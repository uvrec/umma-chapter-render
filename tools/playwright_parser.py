#!/usr/bin/env python3
"""
Headless parser for Vedabase + Gitabase using Playwright
"""
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import json
import time
import re
from urllib.parse import urljoin, urlparse
import os
import asyncio

# Import normalizer
try:
    from pre_import_normalizer import normalize_parsed_data
    NORMALIZER_AVAILABLE = True
except ImportError:
    print("[WARN] pre_import_normalizer not found, skipping normalization")
    NORMALIZER_AVAILABLE = False


def fetch_with_js(url: str) -> str:
    """Завантажує сторінку з виконанням JS (без валідації вмісту)."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print(f"[Fetching] {url}")
        try:
            page.goto(url, wait_until="networkidle", timeout=45000)
        except Exception:
            # fallback to load and wait a little
            try:
                page.goto(url)
            except Exception:
                pass
        time.sleep(1.2)  # small pause for client-side rendering

        html = page.content()
        browser.close()

        print(f"[Success] HTML length: {len(html)}")
        return html


def fetch_with_js_checked(url: str, expect_devanagari: bool = False) -> str:
    """Load a page with Playwright and optionally validate it contains Devanagari/Bengali text.
    Also guards against Vedabase Not Found responses.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        print(f"[Fetching/checked] {url}")
        try:
            page.goto(url, wait_until="networkidle", timeout=45000)
        except Exception:
            try:
                page.goto(url)
            except Exception:
                pass
        page.wait_for_timeout(900)

        # Fast Not Found detection
        body_text = page.evaluate("() => document.body ? document.body.innerText : ''") or ''
        if 'Not Found!' in body_text or 'Could not find requested resource' in body_text:
            browser.close()
            raise RuntimeError(f"Vedabase returned Not Found page for URL: {url}")

        html = page.content()
        if 'NEXT_NOT_FOUND' in html:
            browser.close()
            raise RuntimeError(f"Vedabase returned NEXT_NOT_FOUND for URL: {url}")

        if expect_devanagari:
            has_deva = page.evaluate(
                r"""
                () => {
                  const re = /[\u0900-\u097F\u0980-\u09FF]/u;
                  const nodes = Array.from(document.querySelectorAll('body *'));
                  for (const el of nodes) {
                      const t = (el.textContent || '').trim();
                      if (!t) continue;
                      if (t.replace(/\s+/g,'').length < 6) continue;
                      if (re.test(t)) return true;
                  }
                  return false;
                }
                """
            )
            if not has_deva:
                print(f"[Check] No Devanagari/Bengali detected in DOM for {url}")

        browser.close()
        print(f"[Success] HTML length: {len(html)}")
        return html


def fetch_devanagari_text(url: str) -> list:
    """Use Playwright to render the page and extract candidate elements containing
    Devanagari/Bengali or other non-ASCII text via page.evaluate(). Returns a list
    of candidate descriptors (dicts). Returns [] if nothing found or on error."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print(f"[Fetching for script-eval] {url}")
        try:
            page.goto(url, wait_until="networkidle", timeout=30000)
        except Exception:
            try:
                page.goto(url)
            except Exception:
                pass
        # small pause for client-side rendering
        page.wait_for_timeout(900)

        # Evaluate a function in the page that finds elements with
        # Devanagari or Bengali characters (or other non-ascii runs) and
        # returns a list of candidate descriptors. This is safer than
        # relying on a single selector because Vedabase renders different
        # fragments client-side.
        js = r"""
        () => {
            const devRe = /[\u0900-\u097F\u0980-\u09FF]/u;
            const nonAsciiRe = /[^\x00-\x7F]/u;
            const els = Array.from(document.querySelectorAll('body *'));
            const out = [];
            for (const el of els) {
                // ВИПРАВЛЕНО: використовуємо innerText щоб зберегти переноси рядків
                // textContent об'єднує все в один рядок, innerText зберігає \n
                let txt = (el.innerText || el.textContent || '').trim();
                if (!txt) continue;
                // ignore tiny UI labels
                if (txt.replace(/\s+/g,'').length < 6) continue;
                const hasDeva = devRe.test(txt);
                const hasNonAscii = nonAsciiRe.test(txt);
                if (!hasDeva && !hasNonAscii) continue;
                out.push({
                    tag: el.tagName,
                    id: el.id || null,
                    className: el.className || null,
                    textLen: txt.length,
                    textSnippet: txt.slice(0, 400),
                    outerHTML: (el.outerHTML || '').slice(0, 800),
                    hasDevanagari: hasDeva,
                    hasNonAscii: hasNonAscii,
                });
                if (out.length >= 40) break;
            }
            return out;
        }
        """

        try:
            res = page.evaluate(js)
        except Exception as e:
            print('[Playwright evaluate] error', e)
            res = None

        browser.close()
        if res and isinstance(res, list) and len(res) > 0:
            print(f"[Playwright] found {len(res)} candidate elements (first snippet len={len(res[0].get('textSnippet',''))})")
            return res
        return []


def fetch_devanagari_candidates(url: str, max_candidates: int = 40) -> list:
        """Return a list of candidate elements (dicts) from the rendered page that
        contain Devanagari/Bengali or other non-ASCII runs. Useful for offline
        inspection and choosing robust selectors."""
        return fetch_devanagari_text(url)


def parse_vedabase_verse(html: str, verse_num: int) -> dict:
    """Парсить вірш з Vedabase HTML (expects a per-verse page when possible)
    Falls back to heuristics if whole-chapter page is provided.
    """
    soup = BeautifulSoup(html, 'html.parser')

    # Debug classes
    all_classes = set()
    for tag in soup.find_all(class_=True):
        all_classes.update(tag.get('class', []))
    print(f"[Vedabase] Found {len(all_classes)} unique classes")

    # Prefer per-verse container: look for an element that contains the verse number
    sanskrit = ""
    transliteration = ""
    synonyms_en = ""
    commentary_en = ""
    translation_en = ""

    # Note: in per-verse pages Vedabase content is often rendered client-side.
    # If the HTML passed in appears to be the server-shell (no verse text),
    # return empty here and expect the caller to call fetch_devanagari_text(url)
    # and re-run parse. For robustness, also scan the static HTML for Devanagari/Bengali.
    candidates = []
    for sel in ['[data-verse]', '[id*="verse"]', '[class*="verse"]', 'article', 'main', 'div']:
        for el in soup.select(sel):
            text = el.get_text(separator=' ').strip()
            if not text:
                continue
            candidates.append(el)

    # If a candidate contains a clear Devanagari/Bengali range, take it
    # ВАЖЛИВО: зберігаємо переноси рядків для структури віршу
    for el in candidates:
        t = el.get_text('\n', strip=True)  # Зберігаємо \n замість пробілів
        if not t:
            continue
        if re.search(r"[\u0980-\u09FF]", t) or re.search(r"[\u0900-\u097F]", t):
            sanskrit = t
            break

    # Fallback: look for specific selectors - PRIORITY: .r-bengali for pure Bengali text
    if not sanskrit:
        # First try the specific .r-bengali selector (most accurate)
        el = soup.select_one('.r-bengali')
        if el:
            sanskrit = el.get_text('\n', strip=True)
            print(f"[Vedabase] Found sanskrit with selector: .r-bengali")
        else:
            # Fallback to other selectors if .r-bengali not found
            for sel in ['.devanagari', '.bengali', '.sanskrit', '[class*="verse"]']:
                el = soup.select_one(sel)
                if el:
                    sanskrit = el.get_text('\n', strip=True)
                    print(f"[Vedabase] Found sanskrit with fallback selector: {sel}")
                    break

    # transliteration - шукаємо англійську з Vedabase
    # Може бути після мітки "Verse text" або в елементі з класом містить "verse"
    # ВАЖЛИВО: зберігаємо оригінальні переноси рядків (\n), НЕ замінюємо на пробіли!
    for sel in ['.verse-text', '[class*="verse-text"]', '[class*="verse"]']:
        els = soup.select(sel)
        for el in els:
            # Використовуємо '\n' як separator щоб зберегти структуру віршу (4 рядки)
            # strip=False зберігає \n всередині, потім .strip() тільки з країв
            txt = el.get_text('\n', strip=False).strip()
            # Англійська транслітерація містить латиницю + діакритику
            if txt and re.search(r'[a-zA-Z]', txt) and re.search(r'[āīūṛṇśṣṁḥṅñṭḍ]', txt):
                transliteration = txt
                print(f"[Vedabase] Found transliteration with selector: {sel} (len={len(txt)})")
                break
        if transliteration:
            break

    # synonyms / word-by-word
    syn = soup.select_one('.synonyms, .word-for-word, .wfw')
    if syn:
        synonyms_en = syn.get_text(' ', strip=True)

    # translation and commentary (English blocks)
    tr = soup.select_one('.translation, .eng, .english')
    if tr:
        translation_en = tr.get_text(' ', strip=True)

    pur = soup.select_one('.purport, .commentary, .notes')
    if pur:
        commentary_en = pur.get_text('\n', strip=True)

    return {
        'sanskrit': sanskrit,
        'transliteration': transliteration,
        'synonyms_en': synonyms_en,
        'translation_en': translation_en,
        'commentary_en': commentary_en,
    }


def parse_gitabase_verse(html: str, verse_num: int) -> dict:
    """Парсить вірш з Gitabase HTML
    
    ВАЖЛИВО: Gitabase має проблему - вірш 19 відсутній, а вірш 20 містить текст 19+20.
    Для віршу 19 повертаємо порожні поля (заповнюється вручну).
    Для віршу 20 використовуємо текст як є (редагується вручну).
    """
    soup = BeautifulSoup(html, 'html.parser')
    
    # Показати всі класи
    all_classes = set()
    for tag in soup.find_all(class_=True):
        all_classes.update(tag.get('class', []))
    print(f"[Gitabase] Found {len(all_classes)} unique classes")
    
    # Перевірка на порожню сторінку (вірш 19)
    body_text = soup.get_text()
    if len(body_text) < 100:
        print(f"[Gitabase] Verse {verse_num} has empty/minimal content (known issue for verse 19)")
        return {
            'translation_ua': '',
            'commentary_ua': '',
            'transliteration': '',
            'word_by_word': '',
        }
    
    # Prefer structured selectors similar to cc_importer_final heuristics
    translation_ua = ""
    commentary_ua = ""
    transliteration = ""
    word_by_word = ""

    # transliteration: try id/div with translit
    div_trans = soup.select_one('#div_translit') or soup.select_one('.translit')
    if div_trans:
        em = div_trans.find(['i', 'em'])
        if em:
            transliteration = em.get_text('\n', strip=False)  # Зберігаємо рядки!
            # Видаляємо "Verse text " з Vedabase
            transliteration = transliteration.replace('Verse text ', '').replace('Verse Text ', '')
            # Обрізаємо зайві пробіли ТІЛЬКИ з країв, БЕЗ видалення \n всередині
            transliteration = transliteration.strip()

    # word-by-word (dia_text with many italics)
    dia_blocks = soup.select('.dia_text, .dia, .wfw')
    for db in dia_blocks:
        italics = db.find_all('i')
        if italics and len(italics) >= 4:
            pieces = [i.get_text(strip=True) for i in italics if i.get_text(strip=True)]
            if pieces:
                word_by_word = ' ; '.join(pieces[:200])
                break

    # translation and commentary: look for labelled blocks
    for label in soup.select('.tlabel, .label, h4, b'):
        lt = label.get_text(' ', strip=True).lower()
        # translation
        if 'текст' in lt or 'текст' in lt or 'переклад' in lt or 'текст' in lt:
            sibling = label.find_next_sibling(class_='dia_text') or label.find_next_sibling()
            if sibling:
                translation_ua = sibling.get_text(' ', strip=True)
                break

    # Primary: look for the expected per-verse div#N > b pattern used in per-verse pages
    try:
        bsel = soup.select_one(f'div#{verse_num} > b')
        if bsel and bsel.get_text(strip=True):
            translation_ua = bsel.get_text(' ', strip=True)
    except Exception:
        pass

    # Strategy: extract all Cyrillic text blocks and categorize by structure
    # Gitabase structure typically:
    # - DIV 1: word-by-word (має багато <i> тегів з короткими словами)
    # - DIV 2: translation (один абзац, 100-500 символів)
    # - DIV 3+: commentary (може бути ДУЖЕ довгим - декілька сторінок!)
    
    all_blocks = []
    dia_divs = soup.select('.dia_text')
    
    for idx, div in enumerate(dia_divs):
        text = div.get_text(' ', strip=True)
        # ВИПРАВЛЕНО: пропускаємо блоки БЕЗ кирилиці (транслітерація, санскрит)
        # або блоки які ТІЛЬКИ латиниця (транслітерація)
        has_cyrillic = bool(re.search(r"[\u0400-\u04FF]", text))
        has_latin = bool(re.search(r"[a-zA-Z]", text))
        
        # Якщо блок ТІЛЬКИ латиниця - це транслітерація, пропускаємо
        if has_latin and not has_cyrillic:
            continue
        
        # Якщо блок містить кирилицю і достатньо довгий
        if has_cyrillic and len(text) > 20:
            has_many_italics = len(div.find_all('i')) > 5
            all_blocks.append({
                'index': idx,
                'text': text,
                'length': len(text),
                'has_italics': has_many_italics,
                'element': div
            })
    
    # Sort by index to maintain document order
    all_blocks.sort(key=lambda x: x['index'])
    
    for block in all_blocks:
        # Block 0 or 1: Word-by-word (має багато <i> тегів з україномовними словами)
        if block['has_italics'] and not word_by_word:
            # Послівний переклад на Gitabase - це українські слова в <i> тегах
            # Формат: <i>слово1</i> — значення; <i>слово2</i> — значення;
            # Беремо весь текст блоку (і латинь, і кирилиця)
            full_text = block['text']
            # Якщо містить типові ознаки послівного перекладу
            if ('—' in full_text or ':' in full_text) and len(full_text) > 50:
                # Обмежуємо довжину (послівний переклад зазвичай не дуже довгий)
                if len(full_text) < 2000:
                    word_by_word = full_text
                    continue
        
        # ПЕРЕВІРКА: чи це українська транслітерація? (ПРОПУСКАЄМО!)
        # Ознаки: коротка, слова через пробіл/дефіс, немає крапок/ком, може бути апостроф
        # Приклад: "ванде ґурун іша-бгактан іша-аватаракан"
        is_ua_translit = False
        if block['length'] < 250:
            punct_count = block['text'].count('.') + block['text'].count(',')
            space_count = block['text'].count(' ')
            # Якщо мало пунктуації, багато пробілів (окремі слова), це транслітерація
            if punct_count < 2 and space_count >= 2:
                # Додатково: немає типових українських слів з закінченнями -ся, -ться, -ння
                if not any(ending in block['text'] for ending in ['ться', '-ся', 'ння', 'ість', 'ував']):
                    is_ua_translit = True
        
        if is_ua_translit:
            continue  # Пропускаємо український транслітерований текст
        
        # Next block after word-by-word: Translation (medium size, single sentence/paragraph)
        # ВИПРАВЛЕНО: пропускаємо блоки які виглядають як послівний переклад
        if not translation_ua and 80 < block['length'] < 700:
            # Skip if looks like word-by-word (many dashes/semicolons)
            if block['text'].count('—') > 3 and block['text'].count(';') > 3:
                continue
            # Skip if contains many paragraphs (that's commentary)
            p_count = len(block['element'].find_all('p'))
            if p_count <= 2:
                translation_ua = block['text']
                continue
        
        # All remaining blocks: Commentary (може бути ДУЖЕ довгим!)
        # ВИПРАВЛЕНО: НЕ додаємо блоки які виглядають як послівний переклад!
        # ВИПРАВЛЕНО 2: НЕ додаємо блок який вже є перекладом!
        # ВИПРАВЛЕНО 3: НЕ додаємо українську транслітерацію!
        if translation_ua and not commentary_ua:
            # Skip word-by-word blocks (many dashes and semicolons)
            if block['text'].count('—') > 3 and block['text'].count(';') > 3:
                continue
            # Skip if this block IS the translation (exact match)
            if block['text'] == translation_ua:
                continue
            # Skip Ukrainian transliteration (same logic as above)
            is_ua_translit = False
            if block['length'] < 250:
                punct_count = block['text'].count('.') + block['text'].count(',')
                space_count = block['text'].count(' ')
                if punct_count < 2 and space_count >= 2:
                    if not any(ending in block['text'] for ending in ['ться', '-ся', 'ння', 'ість', 'ував']):
                        is_ua_translit = True
            if is_ua_translit:
                continue
            # Об'єднуємо ВСІ параграфи з цього блоку
            paragraphs = [p.get_text(' ', strip=True) for p in block['element'].find_all('p')]
            if paragraphs:
                commentary_ua = '\n\n'.join(paragraphs)
            else:
                commentary_ua = block['text']
        elif translation_ua and commentary_ua:
            # Skip word-by-word blocks
            if block['text'].count('—') > 3 and block['text'].count(';') > 3:
                continue
            # Skip if this block IS the translation
            if block['text'] == translation_ua:
                continue
            # Skip Ukrainian transliteration
            is_ua_translit = False
            if block['length'] < 250:
                punct_count = block['text'].count('.') + block['text'].count(',')
                space_count = block['text'].count(' ')
                if punct_count < 2 and space_count >= 2:
                    if not any(ending in block['text'] for ending in ['ться', '-ся', 'ння', 'ість', 'ував']):
                        is_ua_translit = True
            if is_ua_translit:
                continue
            # Якщо є ще блоки - додаємо їх до коментаря
            paragraphs = [p.get_text(' ', strip=True) for p in block['element'].find_all('p')]
            if paragraphs:
                commentary_ua += '\n\n' + '\n\n'.join(paragraphs)
            else:
                commentary_ua += '\n\n' + block['text']
    
    # Fallback: if still no translation, find ANY medium Cyrillic paragraph
    if not translation_ua:
        all_paras = [p.get_text(' ', strip=True) for p in soup.find_all(['p', 'div'])]
        for para in all_paras:
            if re.search(r"[\u0400-\u04FF]", para) and 80 < len(para) < 700:
                # Skip word-by-word pattern
                if not (para.count('—') > 3 and para.count(';') > 3):
                    translation_ua = para
                    break

    # log findings
    if translation_ua:
        print(f"[Gitabase] Found translation for verse {verse_num}: {translation_ua[:120]}")
    else:
        print(f"[Gitabase] Verse {verse_num} not found via selectors; fallback empty")

    return {
        'translation_ua': translation_ua,
        'commentary_ua': commentary_ua,
        'transliteration': transliteration,
        'word_by_word': word_by_word,
    }


def parse_chapter(vedabase_url: str, gitabase_url: str, verse_count: int) -> dict:
    """Парсить повну главу"""
    print(f"\n=== Parsing chapter with {verse_count} verses ===\n")
    
    # Завантажити HTML
    vedabase_html = fetch_with_js(vedabase_url)
    gitabase_html = fetch_with_js(gitabase_url)
    
    verses = []
    
    for verse_num in range(1, verse_count + 1):
        print(f"\n--- Verse {verse_num} ---")
        
        # Парсити з обох джерел
        vedabase_data = parse_vedabase_verse(vedabase_html, verse_num)
        gitabase_data = parse_gitabase_verse(gitabase_html, verse_num)
        
        # Об'єднати
        verse = {
            'verse_number': str(verse_num),
            **vedabase_data,
            **gitabase_data,
        }
        
        verses.append(verse)
        
        print(f"Result: {json.dumps(verse, ensure_ascii=False, indent=2)[:200]}")
    
    return {
        'verses': verses,
        'summary': {
            'total': len(verses),
            'vedabase_url': vedabase_url,
            'gitabase_url': gitabase_url,
        }
    }


# ============================================================================
# API FUNCTION (async wrapper for use with Flask/FastAPI)
# ============================================================================

async def parse_chapter_async(
    verse_ranges: str,
    vedabase_base: str,
    gitabase_base: str,
    lila_num: int = 1,
    chapter_num: int = 1
) -> dict:
    """
    Async wrapper for parsing a complete chapter with Playwright + normalization.
    
    Args:
        verse_ranges: Comma-separated ranges like "1-64,65-66,67-110"
        vedabase_base: Base URL for Vedabase (e.g. "https://vedabase.io/en/library/cc/adi/1/")
        gitabase_base: Base URL for Gitabase (e.g. "https://gitabase.com/ukr/CC/1/1")
        lila_num: Lila number (1=Adi, 2=Madhya, 3=Antya)
        chapter_num: Chapter number
        
    Returns:
        {
            "verses": [...],
            "summary": {"total": N, "vedabase_base": "...", "gitabase_base": "..."}
        }
    """
    # Parse verse ranges
    def parse_ranges(ranges_str: str):
        """Return two structures:
        - verse_numbers: flat sorted unique list of individual verses
        - segments: list of (start, end) tuples where end==start for single verses
        This allows us to fetch Vedabase grouped pages like '65-66' once and
        then map the same Sanskrit/transliteration to both verses.
        """
        verses = set()
        segments = []
        for range_part in ranges_str.split(','):
            rp = range_part.strip()
            if not rp:
                continue
            if '-' in rp:
                try:
                    start_s, end_s = rp.split('-', 1)
                    start, end = int(start_s.strip()), int(end_s.strip())
                except Exception:
                    continue
                if end < start:
                    start, end = end, start
                segments.append((start, end))
                verses.update(range(start, end + 1))
            else:
                try:
                    n = int(rp)
                except Exception:
                    continue
                segments.append((n, n))
                verses.add(n)
        verse_numbers = sorted(list(verses))
        return verse_numbers, segments

    verse_numbers, segments = parse_ranges(verse_ranges)
    verse_count = len(verse_numbers)
    
    # Run sync parser in thread pool to avoid blocking
    loop = asyncio.get_event_loop()
    
    def _parse_sync():
        def join_ved(base: str, verse: int) -> str:
            if not base.endswith('/'):
                base = base + '/'
            return f"{base}{verse}/"

        def join_git(base: str, verse: int) -> str:
            if not base.endswith('/'):
                base = base + '/'
            return urljoin(base, f'{verse}')
        
        verses = []
        os.makedirs('tools/outputs/raw', exist_ok=True)
        
        print(f'\n{"="*60}')
        print(f'🚀 ПАРСИНГ: {verse_count} віршів (діапазон: {verse_ranges}) (Ліла {lila_num}, Глава {chapter_num})')
        print(f'{"="*60}\n')
        
        processed = 0
        for seg in segments:
            start_v, end_v = seg
            is_group = (end_v != start_v)
            label = f"{start_v}-{end_v}" if is_group else f"{start_v}"
            # Progress label shows cumulative across individual verses
            seg_len = (end_v - start_v + 1)
            print(f'\n[{processed+1}-{processed+seg_len}/{verse_count}] 📖 Обробка віршу(ів) {label}...')
            # Build Vedabase URL: single verse or grouped page
            if is_group:
                # Example: https://vedabase.io/en/library/cc/adi/1/65-66/
                if not vedabase_base.endswith('/'):
                    vedabase_base_ = vedabase_base + '/'
                else:
                    vedabase_base_ = vedabase_base
                ved_url_group = f"{vedabase_base_}{start_v}-{end_v}/"
                ved_urls = {v: ved_url_group for v in range(start_v, end_v + 1)}
            else:
                v = start_v
                ved_urls = {v: join_ved(vedabase_base, v)}
            
            # Validate URLs (fixed): validate a sample Vedabase URL and Gitabase base
            try:
                any_v_for_validation = next(iter(ved_urls.keys()))
                ved_url_any = ved_urls[any_v_for_validation]
                if not urlparse(ved_url_any).scheme.startswith('http'):
                    raise RuntimeError(f"Invalid Vedabase URL: {ved_url_any}")
                if not urlparse(gitabase_base).scheme.startswith('http'):
                    raise RuntimeError(f"Invalid Gitabase base URL: {gitabase_base}")
            except StopIteration:
                raise RuntimeError("No verse URLs constructed for validation")
            
            # VEDABASE: fetch once per segment (group or single)
            import requests
            ved_html = None
            ved_data_cache = {}
            try:
                # Take the first URL from ved_urls (for group, they are identical)
                any_v = next(iter(ved_urls.keys()))
                ved_url_any = ved_urls[any_v]
                print(f"[Fetching/checked] {ved_url_any}")
                ved_resp = requests.get(ved_url_any, timeout=30)
                if ved_resp.status_code == 404:
                    # If single verse 404s and segment is group-like (rare), just note it
                    print(f"[WARN] Vedabase returned 404 for {ved_url_any}")
                ved_resp.raise_for_status()
                ved_html = ved_resp.text
                print(f"[Success] HTML length: {len(ved_html)}")
            except Exception as e:
                print(f"[ERROR] Vedabase fetch failed for {label}: {e}")
                ved_html = ''

            # Parse Vedabase once, reuse for all verses in segment
            seg_ved_data = parse_vedabase_verse(ved_html or '', start_v)

            # For each verse in the segment, fetch Gitabase and build verse object
            for v in range(start_v, end_v + 1):
                git_url = join_git(gitabase_base, v)
                git_html = fetch_with_js(git_url)
                git_data = parse_gitabase_verse(git_html, v)

                verse = {
                    'lila_num': lila_num,
                    'chapter': chapter_num,
                    'verse_number': str(v),
                    'sanskrit': seg_ved_data.get('sanskrit') or '',
                    'transliteration': seg_ved_data.get('transliteration') or '',
                    'synonyms_en': seg_ved_data.get('synonyms_en') or '',
                    'translation_en': seg_ved_data.get('translation_en') or '',
                    'commentary_en': seg_ved_data.get('commentary_en') or '',
                    'synonyms_ua': git_data.get('word_by_word') or '',
                    'translation_ua': git_data.get('translation_ua') or '',
                    'commentary_ua': git_data.get('commentary_ua') or '',
                    'missing': [],
                    'source': {
                        'vedabase_url': ved_urls[v],
                        'gitabase_url': git_url
                    }
                }

                # Track missing fields
                if not verse['sanskrit']:
                    verse['missing'].append('sanskrit')
                if not verse['transliteration']:
                    verse['missing'].append('transliteration')
                if not verse['translation_ua']:
                    verse['missing'].append('translation_ua')

                verses.append(verse)
                processed += 1
                print(f"✓ Вірш {v}: sanskrit={len(verse['sanskrit'])}, translit={len(verse['transliteration'])}, ua={len(verse['translation_ua'])}")
        
        # Build result
        result = {
            'verses': verses,
            'summary': {
                'total': len(verses),
                'vedabase_base': vedabase_base,
                'gitabase_base': gitabase_base
            }
        }
        
        # Apply normalization
        if NORMALIZER_AVAILABLE:
            print('\n🔧 Застосовую нормалізацію...')
            result = normalize_parsed_data(result)
            print('✅ Нормалізація завершена!')
        
        return result
    
    # Run in thread pool
    result = await loop.run_in_executor(None, _parse_sync)
    return result


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Parse Vedabase + Gitabase verses')
    parser.add_argument('--verse-count', type=int, default=3, help='Number of verses to parse (default: 3)')
    parser.add_argument('--vedabase-base', type=str, default='https://vedabase.io/en/library/cc/adi/1/1/', help='Vedabase base URL (verse 1)')
    parser.add_argument('--gitabase-base', type=str, default='https://gitabase.com/ukr/CC/1/1', help='Gitabase base URL (lila/chapter)')
    args = parser.parse_args()
    
    # Тест на Adi 1 — використовуємо посилання на ПЕРШИЙ вірш як базу і замінюємо номер
    vedabase_base = args.vedabase_base
    gitabase_base = args.gitabase_base
    verse_count = args.verse_count

    def join_ved(base: str, verse: int) -> str:
        # Ensure trailing slash, then replace last numeric segment with verse
        if not base.endswith('/'):
            base = base + '/'
        return re.sub(r'/\d+/?$', f'/{verse}/', base)

    def join_git(base: str, verse: int) -> str:
        # Gitabase CC/1/{verse}
        if not base.endswith('/'):
            base = base + '/'
        return urljoin(base, f'{verse}')

    verses = []
    os.makedirs('tools/outputs/raw', exist_ok=True)
    
    print(f'\n{"="*60}')
    print(f'🚀 ПОЧАТОК ПАРСИНГУ: {verse_count} віршів')
    print(f'{"="*60}\n')
    
    for v in range(1, verse_count + 1):
        print(f'\n[{v}/{verse_count}] 📖 Обробка віршу {v}...')
        ved_url = join_ved(vedabase_base, v)
        git_url = join_git(gitabase_base, v)
        # Basic URL sanity
        if not urlparse(ved_url).scheme.startswith('http'):
            raise RuntimeError(f"Invalid Vedabase URL: {ved_url}")
        if not urlparse(git_url).scheme.startswith('http'):
            raise RuntimeError(f"Invalid Gitabase URL: {git_url}")

        # Load with checks
        try:
            ved_html = fetch_with_js_checked(ved_url, expect_devanagari=True)
        except Exception as e:
            print(f"[WARN] Vedabase check failed: {e}")
            ved_html = fetch_with_js(ved_url)
        git_html = fetch_with_js(git_url)

        # Collect candidates from rendered Vedabase page
        candidates = []
        try:
            candidates = fetch_devanagari_candidates(ved_url)
        except Exception as e:
            print('[fetch_devanagari_candidates] failed:', e)

        # Save raw + candidates
        try:
            with open(f'tools/outputs/raw/vedabase_1_1_{v}.html', 'w', encoding='utf8') as fh:
                fh.write(ved_html)
            with open(f'tools/outputs/raw/gitabase_1_1_{v}.html', 'w', encoding='utf8') as fh:
                fh.write(git_html)
            if candidates:
                with open(f'tools/outputs/raw/vedabase_1_1_{v}_candidates.json', 'w', encoding='utf8') as fh:
                    json.dump(candidates, fh, ensure_ascii=False, indent=2)
        except Exception as e:
            print('Failed to save raw outputs:', e)

        ved_data = parse_vedabase_verse(ved_html, v)
        # Prefer a candidate with Devanagari, otherwise any non-ASCII
        # Filter: pick candidates that are PURE Devanagari/Bengali (short, no English UI)
        picked_text = ''
        if isinstance(candidates, list) and candidates:
            # Strategy: prefer short pure-script elements (len < 200) over large wrappers
            pure_deva = [c for c in candidates if c.get('hasDevanagari') and c.get('textLen', 9999) < 200]
            if pure_deva:
                picked_text = pure_deva[0].get('textSnippet', '')
            else:
                # fallback: any Devanagari
                dev = next((c for c in candidates if c.get('hasDevanagari') and c.get('textSnippet')), None)
                if dev:
                    picked_text = dev.get('textSnippet', '')
        # Clean up: remove "Bengali", "Devanagari" labels
        if picked_text:
            picked_text = re.sub(r'^(Bengali|Devanagari)\s*', '', picked_text, flags=re.IGNORECASE)
            ved_data['sanskrit'] = picked_text
            print(f"[Vedabase] Set sanskrit from candidate (len={len(picked_text)}) for verse {v}")

        git_data = parse_gitabase_verse(git_html, v)

        verse = {
            'verse_number': str(v),
            'sanskrit': ved_data.get('sanskrit') or '',
            'transliteration': ved_data.get('transliteration') or git_data.get('transliteration') or '',
            'synonyms_en': ved_data.get('synonyms_en') or git_data.get('word_by_word') or '',
            'translation_en': ved_data.get('translation_en') or '',
            'commentary_en': ved_data.get('commentary_en') or '',
            'translation_ua': git_data.get('translation_ua') or '',
            'commentary_ua': git_data.get('commentary_ua') or '',
        }
        verses.append(verse)
        print(f"Saved verse {v} -> sanskrit len={len(verse['sanskrit'])}, ua translation len={len(verse['translation_ua'])}")

    out = {'verses': verses, 'summary': {'total': len(verses), 'vedabase_base': vedabase_base, 'gitabase_base': gitabase_base}}
    
    # ✅ НОРМАЛІЗАЦІЯ ПЕРЕД ЗБЕРЕЖЕННЯМ
    if NORMALIZER_AVAILABLE:
        print('\n🔧 Застосовую нормалізацію...')
        out = normalize_parsed_data(out)
        print('✅ Нормалізація завершена!')
    
    with open('parsed_test.json', 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    
    # Calculate statistics
    sanskrit_filled = sum(1 for v in verses if v.get('sanskrit'))
    transliteration_filled = sum(1 for v in verses if v.get('transliteration'))
    translation_ua_filled = sum(1 for v in verses if v.get('translation_ua'))
    commentary_ua_filled = sum(1 for v in verses if v.get('commentary_ua'))
    translation_en_filled = sum(1 for v in verses if v.get('translation_en'))
    
    print('\n' + '='*60)
    print('📊 СТАТИСТИКА ПАРСИНГУ:')
    print('='*60)
    print(f'Total verses: {len(verses)}')
    print(f'Sanskrit filled: {sanskrit_filled}/{len(verses)}')
    print(f'Transliteration filled: {transliteration_filled}/{len(verses)}')
    print(f'Translation UA filled: {translation_ua_filled}/{len(verses)}')
    print(f'Commentary UA filled: {commentary_ua_filled}/{len(verses)}')
    print(f'Translation EN filled: {translation_en_filled}/{len(verses)}')
    print('='*60)
    
    # Show sample verses
    sample_indices = [0, 9, 18] if len(verses) >= 19 else [0, len(verses)//2, len(verses)-1]
    print('\n📖 ЗРАЗКИ ВІРШІВ:')
    for idx in sample_indices:
        if idx < len(verses):
            v = verses[idx]
            print(f'\n--- Verse {v["verse_number"]} ---')
            print(f'Sanskrit: {v["sanskrit"][:80]}...' if len(v["sanskrit"]) > 80 else f'Sanskrit: {v["sanskrit"]}')
            print(f'Transliteration: {v["transliteration"][:80]}...' if len(v["transliteration"]) > 80 else f'Transliteration: {v["transliteration"]}')
            print(f'Translation UA: {v["translation_ua"][:100]}...' if len(v["translation_ua"]) > 100 else f'Translation UA: {v["translation_ua"]}')
            print(f'Commentary UA length: {len(v["commentary_ua"])} chars')
    
    print('\n✅ Saved to parsed_test.json')
