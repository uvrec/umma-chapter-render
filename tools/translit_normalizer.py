#!/usr/bin/env python3
"""Normalize transliteration and Ukrainian text fields produced by the parser.

Usage:
  python3 tools/translit_normalizer.py --in /tmp/parsed_l1_c1_v19_v3.json --out /tmp/parsed_l1_c1_v19_v3.clean.json

The script will:
 - Unicode-normalize strings
 - Remove private-use / control glyphs often introduced by site scrapers
 - Apply a set of configurable substring replacements for common mojibake
 - Apply Ukrainian word replacements (WORD_REPLACEMENTS_UKR) when requested
 - Print a small before/after sample for inspection
"""
import argparse
import json
import re
import unicodedata
from typing import Dict, Any

# Heuristics: remove private-use area characters and odd control glyphs
PRIVATE_USE_RE = re.compile(r"[\uE000-\uF8FF\uFFF0-\uFFFF]")
CONTROL_CHARS_RE = re.compile(r"[\u200B-\u200F\u202A-\u202E]")

# Example replacements to fix mojibake observed in Gitabase downloads.
# This list should be expanded iteratively based on observed inputs.
MOJIBAKE_REPLACEMENTS = {
    '\uF0A0': '',
    '': "'",
    '': '',
    '': '',
    '': '',
    '': '',
    '�': '',
    '\ufeff': '',
}

# Ukrainian word-level replacements (from user example)
WORD_REPLACEMENTS_UKR = {
    "Шрі Чайтан'я-чарітамріта": "Шрі Чайтанья-чарітамріта",
    "Чайтан'я": "Чайтанья",
    "Ніт'янанда": "Нітьянанда",
    "енерґія": "енергія",
}


def clean_string(s: str, apply_ukr: bool = False) -> str:
    if s is None:
        return s
    # Normalize unicode
    s0 = s
    s = unicodedata.normalize('NFC', s)
    # Remove zero-width/control characters
    s = CONTROL_CHARS_RE.sub('', s)
    # Remove private-use and odd glyphs
    s = PRIVATE_USE_RE.sub('', s)
    # Apply mojibake replacements
    for a, b in MOJIBAKE_REPLACEMENTS.items():
        s = s.replace(a, b)
    # Remove stray repeated combining markers (common after decode)
    s = re.sub(r'\uFFFD+', '', s)
    s = re.sub(r'[\uF000-\uF8FF]+', '', s)
    # Trim whitespace
    s = re.sub(r'\s+', ' ', s).strip()
    # Ukrainian dictionary replacements
    if apply_ukr:
        for a, b in WORD_REPLACEMENTS_UKR.items():
            s = s.replace(a, b)
    return s


def process_parsed_file(input_path: str, output_path: str, apply_ukr: bool = False) -> Dict[str, Any]:
    with open(input_path, 'r', encoding='utf8') as f:
        data = json.load(f)

    parsed = data.get('parsed') if isinstance(data, dict) and 'parsed' in data else data
    changed = 0
    total = 0
    for v in parsed:
        total += 1
        for key in ['transliteration', 'word_by_word', 'synonyms_ua', 'translation_ua', 'commentary_ua']:
            if key in v and v.get(key):
                before = v[key]
                after = clean_string(before, apply_ukr=apply_ukr)
                if after != before:
                    v[key] = after
                    changed += 1

    # Save back preserving top-level structure
    out = {'parsed': parsed} if isinstance(data, dict) and 'parsed' in data else parsed
    with open(output_path, 'w', encoding='utf8') as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    return {'input': input_path, 'output': output_path, 'total_verses': total, 'changed_fields': changed}


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--in', dest='input', required=True)
    p.add_argument('--out', dest='output', required=True)
    p.add_argument('--map', dest='mapfile', required=False, help='JSON file with exact replacements {"old": "new"}')
    p.add_argument('--ukr', dest='ukr', action='store_true', help='Apply Ukrainian word replacements')
    args = p.parse_args()

    mappings = None
    if getattr(args, 'mapfile', None):
        try:
            with open(args.mapfile, 'r', encoding='utf8') as mf:
                mappings = json.load(mf)
        except Exception as e:
            print('Failed to load map file:', e)

    if mappings:
        # apply exact mappings first
        with open(args.input, 'r', encoding='utf8') as f:
            data = json.load(f)
        parsed = data.get('parsed') if isinstance(data, dict) and 'parsed' in data else data
        for v in parsed:
            for key in ['transliteration', 'word_by_word', 'synonyms_ua', 'translation_ua', 'commentary_ua']:
                if key in v and v.get(key):
                    s = v[key]
                    for a, b in mappings.items():
                        if a in s:
                            s = s.replace(a, b)
                    v[key] = s
        tmp_path = args.input + '.mapped.tmp'
        with open(tmp_path, 'w', encoding='utf8') as tf:
            json.dump(data, tf, ensure_ascii=False, indent=2)
        res = process_parsed_file(tmp_path, args.output, apply_ukr=args.ukr)
    else:
        res = process_parsed_file(args.input, args.output, apply_ukr=args.ukr)

    print('Processed:', res)


if __name__ == '__main__':
    main()
