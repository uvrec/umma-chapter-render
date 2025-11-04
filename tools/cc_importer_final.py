"""
cc_importer_final.py

Importer for Sri Caitanya Caritamrita (Ukrainian + Bengali)

Usage:
    pip install requests beautifulsoup4 lxml
    python tools/cc_importer_final.py

This will perform a test import for verse 1.1.19 and write test_verse_1_1_19.json

Notes:
- This is a practical, forgiving scraper. HTML selectors may need tuning.
- It fetches from vedabase.io (bengali) and gitabase.com (ukrainian/transliteration/commentary).
- Missing fields are logged for manual review.
"""

import requests
from bs4 import BeautifulSoup
import time
import json
import re
import sys
from typing import Optional, Dict, Any

# Simple mappings / replacements described in the spec
AUTOREPLACE = {
    "Чайтан'я": "Чайтанья",
    "Ніт'янанда": "Нітьянанда",
    "Ґопінатга": "Ґопінатха",
    "Махапрабгу": "Махапрабху",
    "енерґія": "енергія",
}

TRANSLIT_FIXES = {
    "тг": "тх",
    "пг": "пх",
    "кг": "кх",
}

HEADERS = {"User-Agent": "vedavoice-cc-importer/1.0 (+https://vedavoice.org)"}

class CCImporter:
    def __init__(self, delay_seconds: float = 2.0):
        self.delay = delay_seconds
        self.session = requests.Session()
        self.session.headers.update(HEADERS)

    def _apply_replacements(self, text: Optional[str]) -> Optional[str]:
        if not text:
            return text
        out = text
        for a, b in AUTOREPLACE.items():
            out = out.replace(a, b)
        for a, b in TRANSLIT_FIXES.items():
            out = out.replace(a, b)
        # normalize whitespace
        out = re.sub(r"\s+", " ", out).strip()
        return out

    def fetch_url(self, url: str) -> Optional[str]:
        try:
            r = self.session.get(url, timeout=20)
            r.raise_for_status()
            return r.text
        except Exception as e:
            print(f"[fetch_url] Error fetching {url}: {e}")
            return None

    def parse_vedabase_bengali(self, html: str) -> Optional[str]:
        """Extract Bengali original from vedabase page HTML.
        This uses Unicode range detection as a fallback.
        """
        soup = BeautifulSoup(html, "lxml")
        # Try common vedabase patterns first — find concise Bengali-containing text nodes
        candidates = []
        for tag in soup.find_all(string=True):
            t = tag.strip()
            if not t:
                continue
            if re.search(r"[\u0980-\u09FF]", t):
                # filter out embedded JS/JSON blobs and very long nodes
                if len(t) > 1000:
                    continue
                if 'self.__next_f' in t or 'props:' in t or '{"' in t:
                    continue
                candidates.append(t)
        if candidates:
            candidates.sort(key=lambda s: len(s))
            return self._apply_replacements(candidates[0])

        # Fallback: try element with lang attribute
        el = soup.find(attrs={"lang": re.compile(r"bn|bengali", re.I)})
        if el:
            return self._apply_replacements(el.get_text(separator=" "))
        return None

    def parse_gitabase_verse(self, html: str) -> Dict[str, Optional[str]]:
        """Parse Ukrainian translation / transliteration / word-by-word / commentary from gitabase page HTML.
        Uses page-specific selectors (tlabel/dia_text/div_translit) for Gitabase.
        Returns dict with keys: transliteration, word_by_word, translation_ua, commentary_ua
        """
        soup = BeautifulSoup(html, "lxml")
        result = {
            "transliteration": None,
            "word_by_word": None,
            "translation_ua": None,
            "commentary_ua": None,
        }

        # --- Transliteration ---
        try:
            div_trans = soup.select_one('#div_translit')
            if div_trans:
                em = div_trans.find(['i','em'])
                if em:
                    txt = em.get_text(separator=' ').strip()
                    if txt:
                        result['transliteration'] = self._apply_replacements(txt)
        except Exception:
            pass

        # --- Word-by-word / synonyms ---
        try:
            dia_blocks = soup.select('.dia_text')
            for db in dia_blocks:
                italics = db.find_all('i')
                if italics and len(italics) > 4:
                    pieces = [i.get_text(strip=True) for i in italics if i.get_text(strip=True)]
                    if pieces:
                        joined = ' ; '.join(pieces[:60])
                        result['word_by_word'] = self._apply_replacements(joined)
                        break
        except Exception:
            pass

        # --- Translation (Текст) ---
        try:
            for label in soup.select('.tlabel'):
                lt = label.get_text(separator=' ').strip().lower()
                if 'текст' in lt:
                    sibling = label.find_next_sibling(class_='dia_text')
                    if sibling:
                        strong = sibling.find(['h4','b','strong'])
                        if strong:
                            txt = strong.get_text(separator=' ').strip()
                        else:
                            txt = sibling.get_text(separator=' ').strip()
                        if txt:
                            result['translation_ua'] = self._apply_replacements(txt)
                            break
        except Exception:
            pass

        # --- Commentary (Комментарий / ПОЯСНЕННЯ) ---
        try:
            for label in soup.select('.tlabel'):
                lt = label.get_text(separator=' ').strip().lower()
                if 'комментар' in lt or 'пояснен' in lt or 'пояснення' in lt:
                    sibling = label.find_next_sibling(class_='dia_text')
                    if sibling:
                        txt = sibling.get_text(separator='\n').strip()
                        if txt:
                            result['commentary_ua'] = self._apply_replacements(txt)
                            break
        except Exception:
            pass

        # Fallbacks
        if not result['translation_ua'] or not result['commentary_ua']:
            paragraphs = [p.get_text(separator=' ').strip() for p in soup.find_all(['p','div','li','span'])]
            if not result['translation_ua']:
                cyr = [p for p in paragraphs if re.search(r"[А-Яа-яІіЇїЄєҐґ]", p) and len(p) > 30]
                if cyr:
                    cyr.sort(key=lambda s: len(s), reverse=True)
                    result['translation_ua'] = self._apply_replacements(cyr[0])
            if not result['commentary_ua']:
                for p in paragraphs:
                    if 'пояснен' in p.lower() or 'коментар' in p.lower():
                        result['commentary_ua'] = self._apply_replacements(p)
                        break

        return result

    def import_verse(self, lila_num: int, chapter: int, verse: int, gitabase_base_url: Optional[str] = None) -> Dict[str, Any]:
        """Import a single verse from vedabase and (optionally) gitabase.
        If gitabase_base_url is provided it will be used to construct per-verse URLs.
        Returns a dict ready to be saved.
        """
        # Build Vedabase URL
        vedabase_url = f"https://vedabase.io/en/library/cc/{['adi','madhya','antya'][lila_num-1]}/{chapter}/{verse}/"

        # Build Gitabase URL using provided pattern or default
        if gitabase_base_url:
            try:
                if '{chapter}' in gitabase_base_url or '{verse}' in gitabase_base_url:
                    gitabase_url = gitabase_base_url.format(chapter=chapter, verse=verse, lila=lila_num)
                else:
                    gitabase_url = gitabase_base_url.rstrip('/') + f"/{chapter}/{verse}"
            except Exception:
                gitabase_url = gitabase_base_url
        else:
            gitabase_url = f"https://gitabase.com/ua/CC/{chapter}/{verse}"

        print(f"Importing lila={lila_num} chapter={chapter} verse={verse}")
        out = {
            'lila_num': lila_num,
            'chapter': chapter,
            'verse_number': str(verse),
            'sanskrit': None,
            'transliteration': None,
            'synonyms_ua': None,
            'translation_ua': None,
            'commentary_ua': None,
            'missing': [],
            'source': {
                'vedabase_url': vedabase_url,
                'gitabase_url': gitabase_url,
            }
        }

        # 1) fetch vedabase bengali
        ved_html = self.fetch_url(vedabase_url)
        if ved_html:
            bengali = self.parse_vedabase_bengali(ved_html)
            if bengali:
                out['sanskrit'] = bengali
            else:
                out['missing'].append('bengali')
            # try to extract transliteration and synonyms from embedded fragments
            try:
                tr = self.extract_vedabase_transliteration(ved_html)
                if tr:
                    out['transliteration'] = tr
            except Exception:
                pass
            try:
                syn = self.extract_vedabase_synonyms(ved_html)
                if syn:
                    out['synonyms_ua'] = syn
            except Exception:
                pass
        else:
            out['missing'].append('vedabase_fetch')

        time.sleep(self.delay)

        # 2) fetch gitabase (ukr) and extract translation/commentary
        git_html = self.fetch_url(gitabase_url)
        if git_html:
            try:
                # Prefer embedded JSON-like extraction (more reliable for client-rendered sites)
                g_translation = self.extract_gitabase_translation(git_html)
                if g_translation:
                    out['translation_ua'] = g_translation
                g_comment = self.extract_gitabase_commentary(git_html)
                if g_comment:
                    out['commentary_ua'] = g_comment

                # Fallback to HTML heuristics
                parsed = self.parse_gitabase_verse(git_html)
                for k, v in parsed.items():
                    if v and not out.get(k):
                        out[k] = v
                # fill synonyms_ua heuristically from word_by_word if present
                if not out.get('synonyms_ua') and parsed.get('word_by_word'):
                    out['synonyms_ua'] = parsed.get('word_by_word')
            except Exception as e:
                print(f"[import_verse] Gitabase parse error: {e}")
        else:
            out['missing'].append('gitabase_fetch')

        # apply replacements to all text fields
        for k in ['sanskrit','transliteration','synonyms_ua','translation_ua','commentary_ua']:
            out[k] = self._apply_replacements(out.get(k)) if out.get(k) else None

        return out

    def import_chapter(self, lila_num: int, chapter: int, verse_count: int, gitabase_base_url: Optional[str] = None):
        """Import an entire chapter; optionally provide a gitabase_base_url pattern to extract Ukrainian fields."""
        verses = []
        for v in range(1, verse_count+1):
            verse = self.import_verse(lila_num, chapter, v, gitabase_base_url)
            verses.append(verse)
            # be polite
            time.sleep(self.delay)
        return verses

    def save_for_vedavoice(self, verses, filename: str):
        with open(filename, 'w', encoding='utf8') as f:
            json.dump(verses, f, ensure_ascii=False, indent=2)
        print('Saved', filename)

    def extract_vedabase_transliteration(self, html: str) -> Optional[str]:
        """Extract transliteration from vedabase embedded JSON-like fragments.
        Scans for 'body_value' occurrences, decodes escaped sequences (\u003c / \u003e) and looks for <em> blocks.
        """
        # robustly capture the quoted string after "body_value"
        body_re = re.compile(r'"body_value"\s*:\s*"((?:\\.|[^"\\])*)"', re.S)
        for m in body_re.finditer(html):
            raw = m.group(1)
            # unescape common sequences
            try:
                dec = raw.encode('utf-8').decode('unicode_escape')
            except Exception:
                dec = raw.replace('\\u003c', '<').replace('\\u003e', '>').replace('\\n', ' ')
            dec = dec.replace('\u003c', '<').replace('\u003e', '>').replace('\n', ' ')
            # now look for <em> content
            em = re.search(r'<em[^>]*>(.*?)</em>', dec, re.S)
            if em:
                text = re.sub(r'<[^>]+>', '', em.group(1)).strip()
                if text:
                    return text
        return None

    def extract_vedabase_synonyms(self, html: str) -> Optional[str]:
        """Extract synonyms/word-for-word from vedabase embedded JSON fragments.
        Scans for 'shadow_value' and 'word_for_word_value' near occurrences and decodes escapes.
        """
        # try to extract shadow_value precisely
        shadow_re = re.compile(r'"shadow_value"\s*:\s*"((?:\\.|[^"\\])*)"', re.S)
        m = shadow_re.search(html)
        if m:
            raw = m.group(1)
            try:
                dec = raw.encode('utf-8').decode('unicode_escape')
            except Exception:
                dec = raw.replace('\\u003c', '<').replace('\\u003e', '>').replace('\\n', ' ')
            dec = dec.replace('\u003c', '<').replace('\u003e', '>').replace('\n', ' ')
            cleaned = re.sub(r'<[^>]+>', '', dec).strip()
            if cleaned:
                return cleaned

        # try word_for_word_value pairs
        wfw_re = re.compile(r'word_for_word_value\s*:\s*\[(.*?)\]', re.S)
        m2 = wfw_re.search(html)
        if m2:
            arr_text = m2.group(1)
            pair_re = re.compile(r'"word"\s*:\s*"((?:\\.|[^"\\])*)"\s*,\s*"translation"\s*:\s*"((?:\\.|[^"\\])*)"', re.S)
            pairs = []
            for pm in pair_re.finditer(arr_text):
                w_raw = pm.group(1)
                t_raw = pm.group(2)
                try:
                    w = w_raw.encode('utf-8').decode('unicode_escape')
                except Exception:
                    w = w_raw
                try:
                    t = t_raw.encode('utf-8').decode('unicode_escape')
                except Exception:
                    t = t_raw
                w = w.replace('\u003c', '<').replace('\u003e', '>')
                t = t.replace('\u003c', '<').replace('\u003e', '>')
                pairs.append((w, t))
            if pairs:
                return ' ; '.join([f"{w} — {t}" for w, t in pairs])

        return None

    # --- Gitabase helper utilities ---
    def _decode_escaped_json_string(self, raw: str) -> str:
        """Decode JSON-escaped string fragments: handle unicode_escape and common \u003c sequences."""
        try:
            dec = raw.encode('utf-8').decode('unicode_escape')
        except Exception:
            dec = raw.replace('\\u003c', '<').replace('\\u003e', '>').replace('\\n', ' ')
        dec = dec.replace('\u003c', '<').replace('\u003e', '>').replace('\n', ' ')
        return dec

    def extract_gitabase_translation(self, html: str) -> Optional[str]:
        """Extract Ukrainian translation text from Gitabase embedded JSON-like blobs.
        Looks for quoted 'body_value' fragments and returns the longest Cyrillic-containing block.
        """
        body_re = re.compile(r'"body_value"\s*:\s*"((?:\\.|[^"\\])*)"', re.S)
        candidates = []
        for m in body_re.finditer(html):
            raw = m.group(1)
            dec = self._decode_escaped_json_string(raw)
            text = re.sub(r'<[^>]+>', '', dec).strip()
            if re.search(r'[А-Яа-яІіЇїЄєҐґ]', text) and len(text) > 10:
                candidates.append(text)
        if candidates:
            candidates.sort(key=lambda s: len(s), reverse=True)
            return self._apply_replacements(candidates[0])
        # fallback: find large Cyrillic blocks in raw HTML
        all_text = re.sub(r'<[^>]+>', ' ', html)
        cands = re.findall(r'([А-Яа-яІіЇїЄєҐґ\s\,\-\:\;\(\)\"\'\`]{30,})', all_text)
        if cands:
            cands = [c.strip() for c in cands if len(c.strip()) > 20]
            if cands:
                cands.sort(key=lambda s: len(s), reverse=True)
                return self._apply_replacements(cands[0])
        return None

    def extract_gitabase_commentary(self, html: str) -> Optional[str]:
        """Extract commentary blocks from Gitabase embedded fragments or HTML headings."""
        # try shadow_value
        shadow_re = re.compile(r'"shadow_value"\s*:\s*"((?:\\.|[^"\\])*)"', re.S)
        m = shadow_re.search(html)
        if m:
            raw = m.group(1)
            dec = self._decode_escaped_json_string(raw)
            cleaned = re.sub(r'<[^>]+>', '', dec).strip()
            if cleaned and re.search(r'[А-Яа-яІіЇїЄєҐґ]', cleaned):
                return self._apply_replacements(cleaned)

        # fallback: look for headings suggesting commentary and take following text
        soup = BeautifulSoup(html, 'lxml')
        for header in soup.find_all(['h2','h3','strong','b']):
            ht = header.get_text().strip().lower()
            if 'пояснен' in ht or 'пояснення' in ht or 'коментар' in ht or 'explan' in ht:
                sib_text = []
                for s in header.next_siblings:
                    if hasattr(s, 'get_text'):
                        sib_text.append(s.get_text(separator=' '))
                if sib_text:
                    joined = ' '.join(sib_text).strip()
                    if re.search(r'[А-Яа-яІіЇїЄєҐґ]', joined):
                        return self._apply_replacements(re.sub(r'<[^>]+>', '', joined))
        return None


if __name__ == '__main__':
    importer = CCImporter(delay_seconds=2.0)
    # default test: Adi-lila (1), chapter 1, verse 1
    test = importer.import_verse(1, 1, 1)
    importer.save_for_vedavoice([test], 'test_verse_1_1_1.json')
    print('Done. Review test_verse_1_1_1.json')
