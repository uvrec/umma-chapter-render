from playwright.sync_api import sync_playwright
import re
import requests

URL = "https://vedabase.io/en/library/cc/adi/1/1/1/"
pattern = re.compile(r"[\u0900-\u097F\u0980-\u09FF]")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    collected = set()

    def on_response(response):
        try:
            url = response.url
            ct = response.headers.get('content-type','')
            if any(x in ct for x in ['javascript','application/json','text/html','text/plain','css']):
                collected.add(url)
        except Exception:
            pass

    page.on('response', on_response)
    page.goto(URL, wait_until='networkidle')
    page.wait_for_timeout(1500)
    browser.close()

print('Collected', len(collected), 'candidate resource URLs')
found = []
for url in sorted(collected):
    try:
        print('Fetching', url)
        r = requests.get(url, timeout=20)
        text = r.text
        if pattern.search(text) or 'devanagari' in text.lower() or 'bengali' in text.lower():
            idx = pattern.search(text)
            snippet = ''
            if idx:
                i = idx.start()
                snippet = text[max(0,i-200):i+200]
            else:
                # find keyword
                kidx = text.lower().find('devanagari')
                if kidx!=-1:
                    snippet = text[max(0,kidx-200):kidx+200]
            print('  --> MATCH in', url)
            found.append({'url':url,'len':len(text),'snippet':snippet[:400]})
    except Exception as e:
        print('  failed to fetch', url, e)

print('\nMatches found:', len(found))
for f in found:
    print('-', f['url'], 'len=', f['len'])
    print('  snippet:', f['snippet'][:400].replace('\n',' '))
