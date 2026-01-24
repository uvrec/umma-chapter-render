#!/usr/bin/env python3
"""Scan parsed chapter JSON and produce a report of missing fields and suspicious characters.

Usage:
  python3 tools/scan_parsed_report.py --in tools/outputs/parsed_l1_c1_v110.json --out tools/outputs/parsed_l1_c1_v110.report.json

Outputs JSON with per-verse diagnostics and CSV summary.
"""
import argparse
import json
import re
import csv
from typing import List, Dict

PRIVATE_USE_RE = re.compile(r"[\uE000-\uF8FF\uFFF0-\uFFFF]")
CONTROL_CHARS_RE = re.compile(r"[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u202A-\u202E]")
MOJIBAKE_GLYPHS = ['','','','','','�']

FIELDS = ['transliteration','word_by_word','synonyms_uk','translation_uk','commentary_uk']


def analyze_field(text: str) -> List[str]:
    """Return list of issues found in the text."""
    issues = []
    if text is None or (isinstance(text, str) and text.strip()==''):
        issues.append('missing')
        return issues
    # control/private use
    if PRIVATE_USE_RE.search(text):
        issues.append('private_use_chars')
    if CONTROL_CHARS_RE.search(text):
        issues.append('control_chars')
    # mojibake glyphs
    for g in MOJIBAKE_GLYPHS:
        if g in text:
            issues.append(f'mojibake:{g}')
    # suspicious unicode sequences (lots of combining marks)
    if len(re.findall(r'[\u0300-\u036F]', text)) > 4:
        issues.append('many_combining_marks')
    # suspicious shortness
    if len(text.strip()) < 5:
        issues.append('very_short')
    return issues


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--in', dest='input', required=True)
    p.add_argument('--out', dest='output', required=True)
    args = p.parse_args()

    with open(args.input, 'r', encoding='utf8') as f:
        data = json.load(f)

    parsed = data.get('parsed') if isinstance(data, dict) and 'parsed' in data else data
    report = {
        'total_verses': len(parsed),
        'verses': [],
        'summary': {}
    }

    summary_counts = {f: {'missing':0,'suspicious':0} for f in FIELDS}

    rows = []
    for v in parsed:
        vnum = v.get('verse_number') or v.get('verse') or 'unknown'
        verse_report = {'verse_number': vnum, 'missing_fields': [], 'suspicious_fields': {}}
        for f in FIELDS:
            txt = v.get(f)
            issues = analyze_field(txt)
            if 'missing' in issues:
                verse_report['missing_fields'].append(f)
                summary_counts[f]['missing'] += 1
            else:
                if issues:
                    verse_report['suspicious_fields'][f] = {'issues': issues, 'snippet': (txt[:200] + '...') if txt and len(txt)>200 else txt}
                    summary_counts[f]['suspicious'] += 1
        report['verses'].append(verse_report)
        rows.append([vnum, ','.join(verse_report['missing_fields']), ','.join([k+":"+(';'.join(v['suspicious_fields'][k]['issues'])) for k in verse_report['suspicious_fields']])])

    report['summary'] = summary_counts

    with open(args.output, 'w', encoding='utf8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    # write CSV
    csv_out = args.output + '.csv'
    with open(csv_out, 'w', newline='', encoding='utf8') as cf:
        w = csv.writer(cf)
        w.writerow(['verse_number','missing_fields','suspicious_fields'])
        for r in rows:
            w.writerow(r)

    print('Wrote report:', args.output, 'and', csv_out)

if __name__ == '__main__':
    main()
