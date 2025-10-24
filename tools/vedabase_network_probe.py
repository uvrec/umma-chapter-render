from playwright.sync_api import sync_playwright
import re

URL = "https://vedabase.io/en/library/cc/adi/1/1/1/"

def contains_devanagari(s):
    if not s:
        return False
    return re.search(r"[\u0900-\u097F\u0980-\u09FF]", s) is not None

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    hits = []

    def on_response(response):
        try:
            url = response.url
            ct = response.headers.get('content-type', '')
            if 'application/json' in ct or 'text' in ct or url.endswith('.js'):
                text = response.text()
                if contains_devanagari(text) or 'devanagari' in text.lower() or 'bengali' in text.lower():
                    hits.append({'url': url, 'content_type': ct, 'snippet': text[:300]})
        except Exception as e:
            pass

    page.on('response', on_response)
    page.goto(URL, wait_until='networkidle')
    page.wait_for_timeout(2000)
    browser.close()

    print('Found', len(hits), 'responses containing devanagari/devanagari-keywords')
    for h in hits[:20]:
        print('-', h['url'], h['content_type'])
        print('  snippet:', h['snippet'][:300].replace('\n',' '))
