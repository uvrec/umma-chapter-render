#!/usr/bin/env python3
"""Scan parsed JSON for suspicious characters (private-use, replacement glyphs, many combining marks)
and produce candidate mappings for manual review.
"""
import argparse
import json
import csv
import os
from collections import defaultdict

PRIVATE_RANGES = [ (0xE000, 0xF8FF), (0xF0000, 0xFFFFD) ]
REPLACEMENT_CHARS = {0xFFFD}


def has_private_use(s: str):
    for ch in s:
        o = ord(ch)
        for a,b in PRIVATE_RANGES:
            if a <= o <= b:
                return True
        if o in REPLACEMENT_CHARS:
            return True
    return False


def count_combining_marks(s: str):
    import unicodedata
    return sum(1 for ch in s if 'COMBINING' in unicodedata.name(ch, ''))


def collect(parsed_path: str):
    with open(parsed_path, 'r', encoding='utf8') as f:
        data = json.load(f)
    # parsed_top may be either top-level parsed list or dict with 'parsed'
    verses = data.get('parsed') if isinstance(data, dict) and 'parsed' in data else data
    candidates = defaultdict(lambda: {'count':0, 'verses':[], 'field':'', 'example':''})
    fields = ['transliteration','word_by_word','synonyms_uk','translation_uk','commentary_uk']
    for v in verses:
        verse_no = v.get('verse_number') or v.get('verse') or v.get('id')
        for fld in fields:
            val = v.get(fld) or ''
            if not val:
                continue
            if has_private_use(val) or count_combining_marks(val) > 10:
                key = val.strip()[:200]
                item = candidates[key]
                item['count'] += 1
                if verse_no not in item['verses']:
                    item['verses'].append(str(verse_no))
                item['field'] = fld
                if not item['example']:
                    item['example'] = key
    out = [{ 'snippet':k, **v } for k,v in candidates.items()]
    # sort by count desc
    out.sort(key=lambda x: x['count'], reverse=True)
    return out


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--parsed', required=True)
    p.add_argument('--out', required=True)
    args = p.parse_args()
    out_list = collect(args.parsed)
    out_json = args.out
    out_csv = out_json + '.csv'
    os.makedirs(os.path.dirname(out_json), exist_ok=True)
    with open(out_json, 'w', encoding='utf8') as f:
        json.dump(out_list, f, ensure_ascii=False, indent=2)
    with open(out_csv, 'w', encoding='utf8', newline='') as f:
        w = csv.writer(f)
        w.writerow(['count','field','snippet','verses','example'])
        for item in out_list:
            w.writerow([item['count'], item.get('field',''), item['snippet'], ';'.join(item['verses']), item.get('example','')])
    print('Wrote candidates from parsed:', out_json, out_csv)

if __name__ == '__main__':
    main()
