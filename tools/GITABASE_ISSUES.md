GITABASE_ISSUES.md

This document lists known issues when scraping gitabase.com for Sri Caitanya Caritamrita Ukrainian texts.

1. Numbering inconsistencies
   - Some verses are missing from their canonical verse page and instead are embedded in the commentary block of the previous verse (e.g., verse 1.1.19).
   - Recommendation: Use vedabase.io as the canonical source for verse order and presence.

2. HTML structure variations
   - gitabase pages are generated from markdown; structure may vary between files leading to selector failures.
   - Recommendation: Inspect specific pages and update selectors in `parse_gitabase_verse()`.

3. Mixed content locations
   - Some translations or explanations may appear in separate files or under different headings.
   - Recommendation: Implement fallback heuristics and log missing fields for manual review.

4. Character encoding and diacritics
   - Transliteration text may include various combining characters. Use Unicode-aware parsing and normalisation.

5. Logging
   - Always log URLs and any missing fields to make manual correction easier.

6. Rate limiting
   - Be polite: include a 2s delay between requests to avoid temporary blocks.

7. Testing
   - Save example HTML for problem cases and include them in the repo for offline testing of parsers.

8. Manual fixes
   - Provide a small CSV of manual corrections for verses that cannot be parsed automatically.

