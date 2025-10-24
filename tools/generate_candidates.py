#!/usr/bin/env python3
"""Generate candidate snippet mappings from a parsed report JSON.

Usage:
  python3 tools/generate_candidates.py --report tools/outputs/parsed_l1_c1_v110.report.json --out tools/outputs/parsed_l1_c1_v110.candidates.json

Output: JSON mapping of snippet -> {count, verses:[...], example}
And CSV for quick review.
"""
import argparse
import json
import csv
import os
from collections import defaultdict


def collect_candidates(report_path: str):
    with open(report_path, 'r', encoding='utf8') as f:
        rep = json.load(f)
    candidates = defaultdict(lambda: {'count':0, 'verses':[], 'example':''})
    for v in rep.get('verses', []):
        verse = v.get('verse_number')
        susp = v.get('suspicious_fields', {})
        for field, info in susp.items():
            snippet = info.get('snippet') or ''
            # normalize snippet length
            s = snippet.strip()
            if not s:
                continue
            if len(s) > 200:
                s_short = s[:200]
            else:
                s_short = s
            key = s_short
            candidates[key]['count'] += 1
            if verse not in candidates[key]['verses']:
                candidates[key]['verses'].append(verse)
            if not candidates[key]['example']:
                candidates[key]['example'] = s_short
    # sort candidates by count desc
    sorted_items = sorted(candidates.items(), key=lambda kv: kv[1]['count'], reverse=True)
    out = [{ 'snippet': k, **v } for k,v in sorted_items]
    return out


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--report', required=True)
    p.add_argument('--out', required=True)
    args = p.parse_args()

    out_list = collect_candidates(args.report)
    out_json = args.out
    out_csv = out_json + '.csv'
    os.makedirs(os.path.dirname(out_json), exist_ok=True)
    with open(out_json, 'w', encoding='utf8') as f:
        json.dump(out_list, f, ensure_ascii=False, indent=2)
    with open(out_csv, 'w', encoding='utf8', newline='') as f:
        w = csv.writer(f)
        w.writerow(['count','snippet','verses','example'])
        for item in out_list:
            w.writerow([item['count'], item['snippet'], ';'.join(map(str,item['verses'])), item['example']])
    print('Wrote candidates:', out_json, out_csv)

if __name__ == '__main__':
    main()
