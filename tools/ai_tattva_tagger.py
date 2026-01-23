#!/usr/bin/env python3
"""
AI Tattva Tagger - Automatically assign verses to philosophical categories (tattvas)

Uses Claude API to analyze verse content and match to appropriate tattvas.
Processes verses in batches and stores connections in content_tattvas table.

Usage:
    python tools/ai_tattva_tagger.py --book bg --limit 100
    python tools/ai_tattva_tagger.py --all --batch-size 20
    python tools/ai_tattva_tagger.py --verse-id <uuid>
"""

import os
import sys
import json
import time
import argparse
from typing import Optional
from dataclasses import dataclass

try:
    from supabase import create_client, Client
    import anthropic
except ImportError:
    print("Installing required packages...")
    os.system("pip install supabase anthropic")
    from supabase import create_client, Client
    import anthropic

# Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY") or os.getenv("VITE_SUPABASE_ANON_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

@dataclass
class Tattva:
    """Philosophical category"""
    id: str
    name_uk: str
    name_en: str
    slug: str
    category: Optional[str] = None
    description_en: Optional[str] = None

@dataclass
class Verse:
    """Verse with metadata"""
    id: str
    verse_number: str
    chapter_number: int
    book_slug: str
    book_title: str
    translation_en: Optional[str] = None
    translation_uk: Optional[str] = None
    commentary_en: Optional[str] = None
    sanskrit: Optional[str] = None

def get_supabase_client() -> Client:
    """Create Supabase client"""
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError(
            "Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables."
        )
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def get_anthropic_client() -> anthropic.Anthropic:
    """Create Anthropic client"""
    if not ANTHROPIC_API_KEY:
        raise ValueError(
            "Missing Anthropic API key. Set ANTHROPIC_API_KEY environment variable."
        )
    return anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

def fetch_all_tattvas(supabase: Client) -> list[Tattva]:
    """Fetch all tattvas from database"""
    response = supabase.table("tattvas").select("id, name_uk, name_en, slug, category, description_en").execute()

    if not response.data:
        print("Warning: No tattvas found in database")
        return []

    return [
        Tattva(
            id=t["id"],
            name_uk=t["name_uk"],
            name_en=t["name_en"],
            slug=t["slug"],
            category=t.get("category"),
            description_en=t.get("description_en")
        )
        for t in response.data
    ]

def fetch_verses_to_tag(
    supabase: Client,
    book_slug: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    verse_id: Optional[str] = None
) -> list[Verse]:
    """Fetch verses that need tagging"""

    # Build query
    query = supabase.from_("verses_with_metadata").select(
        "id, verse_number, chapter_number, book_slug, book_title, "
        "translation_en, translation_uk, commentary_en, sanskrit"
    )

    if verse_id:
        query = query.eq("id", verse_id)
    else:
        if book_slug:
            query = query.eq("book_slug", book_slug)

        # Get verses not yet tagged (left join would be better but using simple approach)
        query = query.order("book_slug").order("chapter_number").order("verse_number_sort")
        query = query.range(offset, offset + limit - 1)

    response = query.execute()

    if not response.data:
        return []

    return [
        Verse(
            id=v["id"],
            verse_number=v["verse_number"],
            chapter_number=v["chapter_number"],
            book_slug=v["book_slug"],
            book_title=v["book_title"],
            translation_en=v.get("translation_en"),
            translation_uk=v.get("translation_uk"),
            commentary_en=v.get("commentary_en"),
            sanskrit=v.get("sanskrit")
        )
        for v in response.data
    ]

def build_tattva_catalog(tattvas: list[Tattva]) -> str:
    """Build a formatted catalog of available tattvas for the AI"""
    catalog = "AVAILABLE TATTVAS (Philosophical Categories):\n\n"

    # Group by category
    categories = {"sambandha": [], "abhidheya": [], "prayojana": [], None: []}
    for t in tattvas:
        cat = t.category if t.category in categories else None
        categories[cat].append(t)

    category_names = {
        "sambandha": "SAMBANDHA (Relationship - who is God, who are we)",
        "abhidheya": "ABHIDHEYA (Process - how to achieve the goal)",
        "prayojana": "PRAYOJANA (Goal - ultimate objective)",
        None: "OTHER"
    }

    for cat, cat_tattvas in categories.items():
        if not cat_tattvas:
            continue
        catalog += f"\n{category_names.get(cat, 'OTHER')}:\n"
        for t in cat_tattvas:
            desc = f" - {t.description_en}" if t.description_en else ""
            catalog += f"  - {t.slug}: {t.name_en}{desc}\n"

    return catalog

def analyze_verse_with_ai(
    client: anthropic.Anthropic,
    verse: Verse,
    tattva_catalog: str,
    tattvas: list[Tattva]
) -> list[dict]:
    """Use Claude to analyze verse and match to tattvas"""

    # Build verse content
    verse_content = f"""
VERSE: {verse.book_title} {verse.chapter_number}.{verse.verse_number}

{f"Sanskrit: {verse.sanskrit}" if verse.sanskrit else ""}

{f"Translation: {verse.translation_en}" if verse.translation_en else ""}

{f"Commentary (excerpt): {verse.commentary_en[:2000]}..." if verse.commentary_en and len(verse.commentary_en) > 2000 else f"Commentary: {verse.commentary_en}" if verse.commentary_en else ""}
"""

    system_prompt = """You are a scholar of Gaudiya Vaishnavism analyzing verses from Srila Prabhupada's books.
Your task is to identify which philosophical categories (tattvas) a verse relates to.

IMPORTANT RULES:
1. Only assign tattvas that are DIRECTLY and SIGNIFICANTLY discussed in the verse
2. A verse can have 0-5 tattvas
3. For each tattva, provide a relevance score from 0.5 to 1.0:
   - 1.0: Primary topic of the verse
   - 0.8-0.9: Significantly discussed
   - 0.6-0.7: Mentioned or implied
   - 0.5: Tangentially related
4. Be conservative - it's better to have fewer accurate tags than many inaccurate ones
5. Return ONLY a valid JSON array

OUTPUT FORMAT (JSON array):
[
  {"slug": "tattva-slug", "score": 0.9},
  {"slug": "another-tattva", "score": 0.7}
]

If no tattvas apply, return an empty array: []"""

    user_prompt = f"""{tattva_catalog}

Analyze this verse and identify relevant tattvas:

{verse_content}

Return ONLY a JSON array of matching tattvas with scores. No explanation needed."""

    try:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}]
        )

        # Parse response
        response_text = response.content[0].text.strip()

        # Extract JSON from response (handle markdown code blocks)
        if "```" in response_text:
            json_start = response_text.find("[")
            json_end = response_text.rfind("]") + 1
            response_text = response_text[json_start:json_end]

        matches = json.loads(response_text)

        # Validate and filter matches
        valid_slugs = {t.slug for t in tattvas}
        valid_matches = []

        for match in matches:
            if not isinstance(match, dict):
                continue
            slug = match.get("slug")
            score = match.get("score", 0.5)

            if slug in valid_slugs and 0.5 <= score <= 1.0:
                valid_matches.append({
                    "slug": slug,
                    "score": round(score, 2)
                })

        return valid_matches

    except json.JSONDecodeError as e:
        print(f"  Warning: Failed to parse AI response: {e}")
        return []
    except Exception as e:
        print(f"  Error analyzing verse: {e}")
        return []

def save_verse_tattvas(
    supabase: Client,
    verse_id: str,
    matches: list[dict],
    tattvas: list[Tattva]
) -> int:
    """Save verse-tattva connections to database"""
    if not matches:
        return 0

    # Build slug to ID mapping
    slug_to_id = {t.slug: t.id for t in tattvas}

    # Prepare records
    records = []
    for match in matches:
        tattva_id = slug_to_id.get(match["slug"])
        if tattva_id:
            records.append({
                "verse_id": verse_id,
                "tattva_id": tattva_id,
                "relevance_score": match["score"],
                "tagged_by": "ai"
            })

    if not records:
        return 0

    # Upsert to handle duplicates
    try:
        response = supabase.table("content_tattvas").upsert(
            records,
            on_conflict="verse_id,tattva_id"
        ).execute()
        return len(records)
    except Exception as e:
        print(f"  Error saving to database: {e}")
        return 0

def check_existing_tags(supabase: Client, verse_id: str) -> bool:
    """Check if verse already has tags"""
    response = supabase.table("content_tattvas").select("id").eq("verse_id", verse_id).limit(1).execute()
    return bool(response.data)

def main():
    parser = argparse.ArgumentParser(description="AI Tattva Tagger for verses")
    parser.add_argument("--book", type=str, help="Book slug to process (e.g., bg, sb)")
    parser.add_argument("--all", action="store_true", help="Process all books")
    parser.add_argument("--verse-id", type=str, help="Process specific verse by ID")
    parser.add_argument("--limit", type=int, default=100, help="Max verses to process")
    parser.add_argument("--batch-size", type=int, default=10, help="Verses per batch")
    parser.add_argument("--skip-existing", action="store_true", help="Skip already tagged verses")
    parser.add_argument("--dry-run", action="store_true", help="Don't save to database")
    parser.add_argument("--offset", type=int, default=0, help="Starting offset")

    args = parser.parse_args()

    if not args.book and not args.all and not args.verse_id:
        parser.print_help()
        print("\nError: Specify --book, --all, or --verse-id")
        sys.exit(1)

    print("Initializing AI Tattva Tagger...")

    # Initialize clients
    supabase = get_supabase_client()
    anthropic_client = get_anthropic_client()

    # Fetch tattvas
    print("Fetching tattvas...")
    tattvas = fetch_all_tattvas(supabase)
    print(f"  Found {len(tattvas)} tattvas")

    if not tattvas:
        print("Error: No tattvas in database. Run migrations first.")
        sys.exit(1)

    # Build catalog for AI
    tattva_catalog = build_tattva_catalog(tattvas)

    # Fetch verses
    print(f"Fetching verses (offset={args.offset}, limit={args.limit})...")
    verses = fetch_verses_to_tag(
        supabase,
        book_slug=args.book if not args.all else None,
        limit=args.limit,
        offset=args.offset,
        verse_id=args.verse_id
    )
    print(f"  Found {len(verses)} verses to process")

    if not verses:
        print("No verses to process.")
        return

    # Process verses
    total_tagged = 0
    total_connections = 0
    skipped = 0

    for i, verse in enumerate(verses):
        ref = f"{verse.book_slug.upper()} {verse.chapter_number}.{verse.verse_number}"

        # Check if already tagged
        if args.skip_existing and check_existing_tags(supabase, verse.id):
            print(f"[{i+1}/{len(verses)}] {ref} - Skipped (already tagged)")
            skipped += 1
            continue

        print(f"[{i+1}/{len(verses)}] Analyzing {ref}...")

        # Analyze with AI
        matches = analyze_verse_with_ai(anthropic_client, verse, tattva_catalog, tattvas)

        if matches:
            match_str = ", ".join([f"{m['slug']}({m['score']})" for m in matches])
            print(f"  Matches: {match_str}")

            if not args.dry_run:
                saved = save_verse_tattvas(supabase, verse.id, matches, tattvas)
                total_connections += saved
            else:
                total_connections += len(matches)

            total_tagged += 1
        else:
            print("  No matching tattvas found")

        # Rate limiting - be gentle with APIs
        if (i + 1) % args.batch_size == 0:
            print(f"\n--- Batch complete. Tagged {total_tagged} verses, {total_connections} connections ---\n")
            time.sleep(1)  # Brief pause between batches

    # Summary
    print("\n" + "=" * 50)
    print("SUMMARY")
    print("=" * 50)
    print(f"Verses processed: {len(verses)}")
    print(f"Verses tagged: {total_tagged}")
    print(f"Verses skipped: {skipped}")
    print(f"Total connections: {total_connections}")
    if args.dry_run:
        print("(DRY RUN - no data saved)")

if __name__ == "__main__":
    main()
