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
    print(f"[DEBUG parse_vedabase_verse] Called for verse {verse_num}, HTML length: {len(html)}")
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

    # PRIORITY 1: Try Advanced View selectors (most reliable)
    if not sanskrit:
        el = soup.select_one('.av-bengali')
        if el:
            # Get text from inner div with text-center class
            inner = el.select_one('div.text-center')
            if inner:
                text = inner.get_text('\n', strip=True)
                # Remove label "Bengali" if present
                text = text.replace('Bengali', '').strip()
                if text and len(text) > 30:
                    sanskrit = text
                    print(f"[Vedabase] Found Bengali with .av-bengali selector: {sanskrit[:80]}...")
    
    # Fallback: Use regex to find Bengali/Devanagari verse text from HTML
    # Bengali verses typically have 2-4 lines ending with ॥ verse_number ॥
    if not sanskrit:
        # CRITICAL: Match FULL verse including all lines before ॥NUMBER॥
        # Pattern should be greedy to capture all Bengali text up to and including verse number
        # Format: কৃপাসুধা–সরিদ্যস্য<br/>বিশ্বমাপ্লাবয়ন্ত্যপি ।<br/>নীচগৈব সদা ভাতি<br/>তং চৈতন্যপ্রভুং ভজে ॥ ১ ॥
        
        # Bengali Unicode: U+0980-U+09FF, Devanagari numbers: ०-९ or Bengali: ০-৯
        bengali_verse_pattern = r'([\u0980-\u09FF\s।–—\-]+(?:<br\s*/?>\s*[\u0980-\u09FF\s।–—\-]+)*॥\s*[\u09e6-\u09ef0-9]+\s*॥)'
        
        matches = re.findall(bengali_verse_pattern, html, re.DOTALL)
        if matches:
            # Find match that has verse number 1 (this verse)
            # Filter by length: full verses are typically 80-600 chars with HTML (lowered from 150)
            verse_candidates = [m for m in matches if len(m) > 80]
            if verse_candidates:
                # Take longest match (most complete verse)
                full_verse = max(verse_candidates, key=len)
                # Clean up HTML tags, preserve line breaks
                clean = re.sub(r'<br\s*/?>', '\n', full_verse)
                clean = re.sub(r'<[^>]+>', '', clean)
                # Remove excessive whitespace but keep line breaks
                clean = re.sub(r'[ \t]+', ' ', clean)
                sanskrit = clean.strip()
                print(f"[Vedabase] Found Bengali verse (with ॥N॥): {sanskrit[:80]}...")
            else:
                # Fallback: take first match even if short
                if matches:
                    full_verse = matches[0]
                    clean = re.sub(r'<br\s*/?>', '\n', full_verse)
                    clean = re.sub(r'<[^>]+>', '', clean)
                    clean = re.sub(r'[ \t]+', ' ', clean)
                    sanskrit = clean.strip()
                    print(f"[Vedabase] Found Bengali verse (short): {sanskrit[:80]}...")
        else:
            # Fallback: Bengali with single Danda । (if no double danda found)
            bengali_fallback_pattern = r'([\u0980-\u09FF\s]+(?:<br\s*/?>\s*[\u0980-\u09FF\s]+)*।[^॥]{0,50})'
            matches = re.findall(bengali_fallback_pattern, html)
            verse_candidates = [m for m in matches if 80 < len(m) < 600]
            if verse_candidates:
                first_verse = verse_candidates[0]
                clean = re.sub(r'<br\s*/?>', '\n', first_verse)
                clean = re.sub(r'<[^>]+>', '', clean)
                sanskrit = clean.strip()
                print(f"[Vedabase] Found Bengali verse (with single ।): {sanskrit[:80]}...")
    
    # Devanagari fallback (for Bhagavad-gita, Bhagavatam)
    if not sanskrit:
        devanagari_verse_pattern = r'([\u0900-\u097F\s]+(?:<br\s*/?>\s*[\u0900-\u097F\s]+)*॥\s*[\u0966-\u096f0-9]+\s*॥)'
        matches = re.findall(devanagari_verse_pattern, html)
        if matches:
            first_verse = matches[0]
            clean = re.sub(r'<br\s*/?>', '\n', first_verse)
            clean = re.sub(r'<[^>]+>', '', clean)
            sanskrit = clean.strip()
            print(f"[Vedabase] Found Devanagari verse (with ॥N॥): {sanskrit[:80]}...")
    
    # Final fallback: selector-based (least reliable)
    if not sanskrit:
        for sel in ['.r-bengali', '.devanagari', '.bengali', '.sanskrit']:
            el = soup.select_one(sel)
            if el:
                sanskrit = el.get_text('\n', strip=True)
                print(f"[Vedabase] Found sanskrit with fallback selector: {sel}")
                break

    # transliteration - PRIORITY: Advanced View selector
    if not transliteration:
        el = soup.select_one('.av-verse_text')
        if el:
            inner = el.select_one('div[id]')
            if inner:
                # Get text from <em> tags inside, preserve line breaks
                em_tags = inner.find_all('em')
                if em_tags:
                    parts = []
                    for em in em_tags:
                        text = em.get_text('\n', strip=True)
                        if text:
                            parts.append(text)
                    if parts:
                        transliteration = '\n'.join(parts)
                        print(f"[Vedabase] Found transliteration with .av-verse_text: {transliteration[:80]}...")
    
    # FALLBACK: Use regex to find IAST text (English with diacritics)
    if not transliteration:
        # PATTERN: Match IAST text with <br> tags (HTML structure from Vedabase)
        # Example: <em>kṛpā-sudhā-sarid yasya<br>viśvam āplāvayanty api<br>...</em>
        iast_html_pattern = r'<em>([a-zA-Z\s\-āīūṛṇśṣṁḥṅñṭḍ]+(?:<br\s*/?>[ \t]*[a-zA-Z\s\-āīūṛṇśṣṁḥṅñṭḍ]+)*)</em>'
        matches = re.findall(iast_html_pattern, html, re.IGNORECASE)
        for match in matches:
            # Verify it has IAST diacritics and reasonable length
            if re.search(r'[āīūṛṇśṣṁḥṅñṭḍ]', match) and 50 < len(match) < 500:
                # Clean up: convert <br> to \n, remove "Verse text" labels
                clean = re.sub(r'<br\s*/?>', '\n', match)
                clean = re.sub(r'<[^>]+>', '', clean)  # Remove any remaining tags
                clean = clean.replace('Verse text', '').replace('Verse Text', '').strip()
                if clean:
                    transliteration = clean
                    print(f"[Vedabase] Found transliteration via HTML regex: {transliteration[:80]}...")
                    break
    
    # Fallback: selector-based search
    if not transliteration:
        for sel in ['.verse-text', '[class*="verse-text"]', '[class*="romanized"]', 'em']:
            els = soup.select(sel)
            for el in els:
                txt = el.get_text('\n', strip=False).strip()
                # English transliteration has Latin + diacritics
                if txt and re.search(r'[a-zA-Z]', txt) and re.search(r'[āīūṛṇśṣṁḥṅñṭḍ]', txt):
                    transliteration = txt.replace('Verse text', '').replace('Verse Text', '').strip()
                    print(f"[Vedabase] Found transliteration with selector: {sel}")
                    break
            if transliteration:
                break

    # synonyms / word-by-word - PRIORITY: Advanced View
    if not synonyms_en:
        el = soup.select_one('.av-synonyms')
        if el:
            inner = el.select_one('div[id]')
            if inner:
                # ВИПРАВЛЕНО: Структура Vedabase (WITHOUT duplicates):
                # <span class="inline">
                #   <a><em>word1</em></a>-<a><em>word2</em></a> — <span class="inline">meaning</span>; 
                # </span>
                # Проблема: вкладені span.inline створюють дублікати
                # Рішення: беремо ТІЛЬКИ <a><em> для слів і перший span.inline для перекладу
                
                parts = []
                # CRITICAL FIX: Vedabase має ДОДАТКОВИЙ wrapper div!
                # Структура: .av-synonyms > div[id] > div.em:mb-4 > span.inline
                # Треба шукати ВСІ span.inline РЕКУРСИВНО, не тільки direct children
                top_level_spans = inner.find_all('span', class_='inline', recursive=True)
                
                # Фільтруємо: беремо ТІЛЬКИ top-level span.inline (які НЕ вкладені в інші span.inline)
                filtered_spans = []
                for span in top_level_spans:
                    # Перевіряємо чи parent span теж має клас 'inline'
                    parent = span.find_parent('span', class_='inline')
                    if parent is None:
                        # Це top-level span (НЕ вкладений)
                        filtered_spans.append(span)
                
                # Знаходимо всі top-level елементи (не вкладені span.inline)
                for child in filtered_spans:
                    if hasattr(child, 'name'):
                        # Пропускаємо вкладені span.inline (вони створюють дублікати)
                        if child.name == 'span' and 'inline' in child.get('class', []):
                            # Витягуємо слова з <a><em> тегів
                            word_parts = []
                            for a_tag in child.find_all('a', recursive=False):
                                em = a_tag.find('em')
                                if em:
                                    word_parts.append(em.get_text(strip=True))
                            
                            # CRITICAL FIX: Шукаємо ВКЛАДЕНИЙ span.inline (не child itself!)
                            # child.find() знаходить САМ child якщо він span.inline
                            # Потрібно шукати ВНУТРІШНІЙ span серед дітей child
                            inner_spans = [s for s in child.find_all('span', class_='inline', recursive=False) if s != child]
                            if inner_spans:
                                # Беремо ПЕРШИЙ вкладений span
                                meaning = inner_spans[0].get_text(strip=True)
                            else:
                                # Якщо немає вкладеного span, беремо текст після —
                                full_text = child.get_text(' ', strip=True)
                                if '—' in full_text:
                                    meaning = full_text.split('—', 1)[1].strip().rstrip(';').strip()
                                else:
                                    continue
                            
                            # Формуємо пару "слово — переклад"
                            if word_parts and meaning:
                                word = '-'.join(word_parts)
                                parts.append(f"{word} — {meaning}")
                
                if parts:
                    synonyms_en = '; '.join(parts)
                    print(f"[Vedabase] Found synonyms_en with .av-synonyms (deduplicated): {synonyms_en[:100]}...")
    
    # FALLBACK: Try multiple selectors
    if not synonyms_en:
        for sel in ['.r-synonyms', '.synonyms', '.word-for-word', '.wfw', '[class*="synonym"]']:
            syn = soup.select_one(sel)
            if syn:
                # Get all synonym items with formatting
                items = syn.select('.r-synonyms-item')
                if items:
                    parts = []
                    for item in items:
                        word = item.select_one('.r-synonym')
                        meaning = item.select_one('.r-synonim-text, .r-synonym-text')
                        if word and meaning:
                            parts.append(f"{word.get_text(strip=True)} — {meaning.get_text(strip=True)}")
                    if parts:
                        synonyms_en = '; '.join(parts)
                        print(f"[Vedabase] Found synonyms_en: {synonyms_en[:100]}...")
                        break
                else:
                    # Fallback: get all text
                    synonyms_en = syn.get_text(' ', strip=True)
                    # ВИПРАВЛЕНО: Видаляємо "Synonyms" з початку
                    if synonyms_en.startswith('Synonyms '):
                        synonyms_en = synonyms_en[len('Synonyms '):].strip()
                    if synonyms_en:
                        print(f"[Vedabase] Found synonyms_en (fallback): {synonyms_en[:100]}...")
                        break

    # translation - PRIORITY: Advanced View
    if not translation_en:
        el = soup.select_one('.av-translation')
        if el:
            inner = el.select_one('div[id]')
            if inner:
                # Get text, strip <strong> tags but keep content
                text = inner.get_text(' ', strip=True)
                if text and len(text) > 30:
                    translation_en = text
                    print(f"[Vedabase] Found translation_en with .av-translation: {translation_en[:100]}...")
    
    # FALLBACK: Try multiple selectors
    if not translation_en:
        for sel in ['.r-translation', '.translation', '.eng', '.english', '[class*="translation"]']:
            tr = soup.select_one(sel)
            if tr:
                translation_en = tr.get_text(' ', strip=True)
                if translation_en and len(translation_en) > 30:
                    print(f"[Vedabase] Found translation_en: {translation_en[:100]}...")
                    break

    # purport / commentary - PRIORITY: Advanced View
    if not commentary_en:
        el = soup.select_one('.av-purport')
        if el:
            inner = el.select_one('div[id]')
            if inner:
                # Collect all paragraphs
                paragraphs = inner.select('p')
                if paragraphs:
                    parts = [p.get_text(' ', strip=True) for p in paragraphs if p.get_text(strip=True)]
                    commentary_en = '\n\n'.join(parts)
                else:
                    commentary_en = inner.get_text('\n', strip=True)
                if commentary_en and len(commentary_en) > 50:
                    print(f"[Vedabase] Found commentary_en with .av-purport: {commentary_en[:100]}...")
    
    # FALLBACK: Try multiple selectors
    if not commentary_en:
        for sel in ['.r-purport', '.purport', '.commentary', '.notes', '[class*="purport"]']:
            pur = soup.select_one(sel)
            if pur:
                # Collect all paragraphs
                paragraphs = pur.select('p')
                if paragraphs:
                    parts = [p.get_text(' ', strip=True) for p in paragraphs if p.get_text(strip=True)]
                    commentary_en = '\n\n'.join(parts)
                else:
                    commentary_en = pur.get_text('\n', strip=True)
                if commentary_en and len(commentary_en) > 50:
                    print(f"[Vedabase] Found commentary_en: {commentary_en[:100]}...")
                    break

    return {
        'sanskrit': sanskrit,
        'transliteration_en': transliteration,  # АНГЛІЙСЬКА IAST з Vedabase
        'synonyms_en': synonyms_en,
        'translation_en': translation_en,
        'commentary_en': commentary_en,
        '_debug_sanskrit_length': len(sanskrit),  # DEBUG
    }


def parse_gitabase_verse(html: str, verse_num: int) -> dict:
    """Парсить вірш з Gitabase HTML
    
    ВАЖЛИВО: Gitabase має проблему - вірш 19 відсутній, а вірш 20 містить текст 19+20.
    Для віршу 19 повертаємо порожні поля (заповнюється вручну).
    Для віршу 20 використовуємо текст як є (редагується вручну).
    
    ПОВЕРТАЄ:
    - translation_ua: український переклад
    - commentary_ua: український коментар
    - transliteration_ua: українська транслітерація (НЕ нормалізована)
    - synonyms_ua: послівний переклад українською (word-by-word)
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
            'transliteration_ua': '',
            'synonyms_ua': '',
        }
    
    # Prefer structured selectors similar to cc_importer_final heuristics
    translation_ua = ""
    commentary_ua = ""
    transliteration_ua = ""
    synonyms_ua = ""

    # transliteration: try id/div with translit
    div_trans = soup.select_one('#div_translit') or soup.select_one('.translit')
    if div_trans:
        em = div_trans.find(['i', 'em'])
        if em:
            transliteration_ua = em.get_text('\n', strip=False)  # Зберігаємо рядки!
            # Видаляємо "Verse text " з Vedabase
            transliteration_ua = transliteration_ua.replace('Verse text ', '').replace('Verse Text ', '')
            # Обрізаємо зайві пробіли ТІЛЬКИ з країв, БЕЗ видалення \n всередині
            transliteration_ua = transliteration_ua.strip()
            print(f"[Gitabase] Found transliteration_ua: {transliteration_ua[:100]}...")

    # word-by-word: Gitabase format is: <i>term</i> — translation; <i>term</i> — translation
    # КРИТИЧНЕ ВИПРАВЛЕННЯ: витягуємо ТІЛЬКИ українські ЗНАЧЕННЯ (після —)
    # СЛОВА беруться з Vedabase synonyms_en (IAST) і конвертуються в нормалізаторі
    dia_blocks = soup.select('.dia_text, .dia, .wfw')
    for db in dia_blocks:
        italics = db.find_all('i')
        # Check if block contains word-by-word (many <i> tags with short words)
        if italics and len(italics) >= 4:
            # НОВИЙ ПІДХІД: витягуємо пари "слово — значення"
            # ТІЛЬКИ значення (після —) зберігаємо для об'єднання з Vedabase IAST
            meanings = []
            for i_tag in italics:
                # Шукаємо текст ПІСЛЯ <i> тегу (там має бути "— український_переклад;")
                next_sibling = i_tag.next_sibling
                if next_sibling:
                    text_after = str(next_sibling).strip()
                    # Витягуємо текст після —
                    if '—' in text_after:
                        meaning = text_after.split('—', 1)[1].strip()
                        # Видаляємо ; в кінці
                        meaning = meaning.rstrip(';').strip()
                        if meaning:
                            meanings.append(meaning)
            
            if meanings:
                # Зберігаємо ТІЛЬКИ українські значення (без слів!)
                # Формат: "я складаю шанобливі поклони ; духовним вчителям ; ..."
                synonyms_ua = ' ; '.join(meanings[:200])
                print(f"[Gitabase] Found {len(meanings)} Ukrainian MEANINGS (without terms): {synonyms_ua[:150]}...")
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
        
        # ВИПРАВЛЕНО: НЕ пропускаємо блоки з тільки латиницею - вони можуть бути українською транслітерацією!
        # Замість цього, такі блоки будемо зберігати у transliteration_ua якщо ще не знайдено
        
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
        # НОВИЙ ВИПАДОК: блок тільки з латиницею - це може бути українська транслітерація!
        elif has_latin and not has_cyrillic and len(text) > 20 and not transliteration_ua:
            # Перевіряємо чи це схоже на транслітерацію (слова через пробіл, мало пунктуації)
            punct_count = text.count('.') + text.count(',')
            space_count = text.count(' ')
            if punct_count < 3 and space_count >= 2:
                transliteration_ua = text
                print(f"[Gitabase] Found transliteration_ua from latin block: {transliteration_ua[:100]}...")
    
    # Sort by index to maintain document order
    all_blocks.sort(key=lambda x: x['index'])
    
    for block in all_blocks:
        # ВИПРАВЛЕНО: НЕ пропускаємо українську транслітерацію - зберігаємо її!
        # Перевірка чи це українська транслітерація (якщо ще не знайдено)
        if not transliteration_ua and block['length'] < 250:
            punct_count = block['text'].count('.') + block['text'].count(',')
            space_count = block['text'].count(' ')
            # Якщо мало пунктуації, багато пробілів (окремі слова), це може бути транслітерація
            if punct_count < 2 and space_count >= 2:
                # Додатково: немає типових українських слів з закінченнями -ся, -ться, -ння
                if not any(ending in block['text'] for ending in ['ться', '-ся', 'ння', 'ість', 'ував']):
                    transliteration_ua = block['text']
                    print(f"[Gitabase] Found transliteration_ua from cyrillic block: {transliteration_ua[:100]}...")
                    continue  # Зберегли транслітерацію, переходимо до наступного блоку
        
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
        # ВИПРАВЛЕНО: НЁ додаємо блоки які виглядають як послівний переклад!
        # ВИПРАВЛЕНО 2: НЕ додаємо блок який вже є перекладом!
        # ВИПРАВЛЕНО 3: НЕ додаємо українську транслітерацію до коментаря!
        # ВИПРАВЛЕНО 4: НЕ додаємо транслітерацію БЕЗ діакритиків до коментаря!
        if translation_ua and not commentary_ua:
            # Skip word-by-word blocks (many dashes and semicolons)
            if block['text'].count('—') > 3 and block['text'].count(';') > 3:
                continue
            # Skip if this block IS the translation (exact match)
            if block['text'] == translation_ua:
                continue
            # Skip Ukrainian transliteration (already saved to transliteration_ua)
            if block['text'] == transliteration_ua:
                continue
            
            # ВИПРАВЛЕНО: Skip transliteration WITHOUT diacritics (Gitabase has 2 translit blocks!)
            # Format: "тха праварта̄іла̄..." (латиниця БЕЗ діакритиків перед "ПОЯСНЕННЯ:")
            block_text = block['text']
            if 'ПОЯСНЕННЯ' in block_text:
                # Видаляємо текст ДО "ПОЯСНЕННЯ:" (це транслітерація)
                idx = block_text.find('ПОЯСНЕННЯ')
                if idx > 0:
                    print(f"[Gitabase] Removed transliteration before 'ПОЯСНЕННЯ:' ({idx} chars)")
            
            # Перевіряємо чи блок достатньо довгий для коментаря (> 100 chars)
            if len(block_text) < 100:
                continue
            
            # Об'єднуємо ВСІ параграфи з цього блоку
            paragraphs = [p.get_text(' ', strip=True) for p in block['element'].find_all('p')]
            if paragraphs:
                commentary_text = '\n\n'.join(paragraphs)
            else:
                commentary_text = block_text
            
            # ВИДАЛЯЄМО "ПОЯСНЕННЯ:" з початку commentary_text
            if commentary_text.startswith('ПОЯСНЕННЯ:'):
                commentary_ua = commentary_text[len('ПОЯСНЕННЯ:'):].lstrip()
                print(f"[Gitabase] Removed 'ПОЯСНЕННЯ:' marker from commentary start")
            else:
                commentary_ua = commentary_text
        elif translation_ua and commentary_ua:
            # Skip word-by-word blocks
            if block['text'].count('—') > 3 and block['text'].count(';') > 3:
                continue
            # Skip if this block IS the translation
            if block['text'] == translation_ua:
                continue
            # Skip Ukrainian transliteration (already saved to transliteration_ua)
            if block['text'] == transliteration_ua:
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
    
    if transliteration_ua:
        print(f"[Gitabase] Found transliteration_ua for verse {verse_num}: {transliteration_ua[:80]}")
    
    if synonyms_ua:
        print(f"[Gitabase] Found synonyms_ua for verse {verse_num}: {synonyms_ua[:80]}")

    return {
        'translation_ua': translation_ua,
        'commentary_ua': commentary_ua,
        'transliteration_ua': transliteration_ua,
        'synonyms_ua': synonyms_ua,
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
        
        # Об'єднати (sanskrit містить Bengali/Sanskrit текст)
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
            
            # For each verse in the segment, fetch BOTH Vedabase AND Gitabase individually
            for v in range(start_v, end_v + 1):
                # VEDABASE: fetch EACH verse separately (required for parsing!)
                # CRITICAL: Use Playwright for Vedabase (dynamic content!)
                ved_url = join_ved(vedabase_base, v)
                ved_html = ''
                try:
                    print(f"[Vedabase {v}] Fetching {ved_url}")
                    ved_html = fetch_with_js(ved_url)
                    print(f"[Vedabase {v}] Success, HTML length: {len(ved_html)}")
                except Exception as e:
                    print(f"[ERROR] Vedabase fetch failed for verse {v}: {e}")
                
                # Parse Vedabase for this specific verse
                ved_data = parse_vedabase_verse(ved_html or '', v)
                
                # GITABASE: fetch this verse
                git_url = join_git(gitabase_base, v)
                git_html = ''
                try:
                    print(f"[Gitabase {v}] Fetching {git_url}")
                    git_html = fetch_with_js(git_url)
                    print(f"[Gitabase {v}] Success, HTML length: {len(git_html)}")
                except Exception as e:
                    print(f"[ERROR] Gitabase fetch failed for verse {v}: {e}")
                
                git_data = parse_gitabase_verse(git_html, v)

                # CRITICAL: Convert English IAST → Ukrainian transliteration
                transliteration_en = ved_data.get('transliteration_en') or ''
                transliteration_ua = ''
                
                # ПРИОРИТЕТ 1: Використовуємо українську транслітерацію з Gitabase (якщо є)
                if git_data.get('transliteration_ua'):
                    transliteration_ua = git_data.get('transliteration_ua')
                    print(f"[Gitabase] Using Ukrainian transliteration from Gitabase: {transliteration_ua[:50]}")
                # ПРИОРИТЕТ 2: Конвертуємо англійську IAST → українська
                elif transliteration_en and NORMALIZER_AVAILABLE:
                    try:
                        from pre_import_normalizer import convert_english_to_ukrainian_translit
                        transliteration_ua = convert_english_to_ukrainian_translit(transliteration_en)
                        print(f"[Converted] IAST → UA: {transliteration_en[:50]} → {transliteration_ua[:50]}")
                    except Exception as e:
                        print(f"[WARN] Transliteration conversion failed: {e}")
                        transliteration_ua = transliteration_en

                verse = {
                    'lila_num': lila_num,
                    'chapter': chapter_num,
                    'verse_number': str(v),
                    'sanskrit': ved_data.get('sanskrit') or '',
                    'transliteration': transliteration_ua,  # УКРАЇНСЬКА (для сумісності зі старим кодом)
                    'transliteration_ua': transliteration_ua,  # УКРАЇНСЬКА
                    'transliteration_en': transliteration_en,  # ENGLISH IAST
                    'synonyms_en': ved_data.get('synonyms_en') or '',
                    'translation_en': ved_data.get('translation_en') or '',
                    'commentary_en': ved_data.get('commentary_en') or '',
                    'synonyms_ua': git_data.get('synonyms_ua') or '',  # ВИПРАВЛЕНО: було word_by_word
                    'translation_ua': git_data.get('translation_ua') or '',
                    'commentary_ua': git_data.get('commentary_ua') or '',
                    'missing': [],
                    'source': {
                        'vedabase_url': ved_url,
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
        # ВИПРАВЛЕНО: Якщо база вже закінчується на номер віршу, використовуємо її як є
        # Приклад: --vedabase-base 'https://vedabase.io/en/library/cc/antya/7/12/' 
        # означає що користувач хоче парсити САМЕ вірш 12, а не вірш 1!
        if not base.endswith('/'):
            base = base + '/'
        
        # Перевіряємо чи база закінчується на /ЧИСЛО/
        match = re.search(r'/(\d+)/?$', base)
        if match:
            base_verse_num = int(match.group(1))
            # Якщо номер віршу в базі СПІВПАДАЄ з запитуваним - повертаємо як є
            if base_verse_num == verse:
                return base
            # Інакше замінюємо номер
            return re.sub(r'/\d+/?$', f'/{verse}/', base)
        else:
            # Якщо база НЕ закінчується на число - додаємо номер віршу
            return f'{base}{verse}/'

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
    
    # ВИПРАВЛЕНО: Якщо база вже містить номер віршу - використовуємо його!
    # Приклад: --vedabase-base 'https://vedabase.io/en/library/cc/antya/7/12/'
    # означає парсити вірш 12, а не перебирати вірші 1, 2, 3...
    base_verse_match = re.search(r'/(\d+)/?$', vedabase_base)
    if base_verse_match and verse_count == 1:
        # Користувач передав URL конкретного віршу і хоче парсити тільки його
        start_verse = int(base_verse_match.group(1))
        verse_range = range(start_verse, start_verse + 1)
    else:
        # Звичайний режим: парсити вірші 1, 2, 3...
        start_verse = 1
        verse_range = range(1, verse_count + 1)
    
    for v in verse_range:
        verse_display = v if base_verse_match else v
        print(f'\n[{v - start_verse + 1}/{verse_count}] 📖 Обробка віршу {verse_display}...')
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

        # ✅ ВИПРАВЛЕНО: зберігаємо IAST окремо від української транслітерації
        transliteration_en = ved_data.get('transliteration_en') or ''
        transliteration_ua = git_data.get('transliteration_ua') or ''

        verse = {
            'verse_number': str(v),
            'sanskrit': ved_data.get('sanskrit') or '',
            'transliteration': transliteration_ua or transliteration_en,  # Deprecated, fallback
            'transliteration_en': transliteration_en,  # IAST з Vedabase
            'transliteration_ua': transliteration_ua,  # Українська з Gitabase (конвертується в нормалізаторі)
            'synonyms_en': ved_data.get('synonyms_en') or '',
            'synonyms_ua': git_data.get('synonyms_ua') or '',
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
