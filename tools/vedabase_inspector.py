"""Quick Vedabase HTML inspector used to check page structure for parser development.

Usage:
    python3 tools/vedabase_inspector.py <url>

Example:
    python3 tools/vedabase_inspector.py "https://vedabase.io/en/library/cc/adi/1/1/"
"""
import sys
import requests
from bs4 import BeautifulSoup


def inspect(url: str):
    print('Fetching:', url)
    r = requests.get(url, timeout=20)
    r.raise_for_status()
    html = r.text
    soup = BeautifulSoup(html, 'lxml')
    body = soup.body
    print('Body classes:', getattr(body, 'get', lambda k, d=None: d)('class'))
    main = soup.select_one('main, .main, .content, #content')
    print('Main container:', 'found' if main else 'not found')
    divs = soup.find_all('div')
    print('Total divs:', len(divs))
    for i, d in enumerate(divs[:5]):
        cls = d.get('class')
        text = d.get_text(strip=True)[:120]
        print(f'[{i}] class={cls} text_snippet="{text}"')
    body_text = soup.get_text(separator=' ', strip=True)
    print('Contains "TEXT 1"?', 'TEXT 1' in body_text)
    print('Contains "SYNONYMS"?', 'SYNONYMS' in body_text)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python3 tools/vedabase_inspector.py <url>')
        sys.exit(1)
    inspect(sys.argv[1])
