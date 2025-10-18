from playwright.sync_api import sync_playwright
import re

URL = "https://vedabase.io/en/library/cc/adi/1/1/1/"
pattern = re.compile(r"[\u0900-\u097F\u0980-\u09FF]")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto(URL, wait_until='networkidle')
    page.wait_for_timeout(2000)
    scripts_info = page.evaluate(r"""
    (() => {
      const out = [];
      const scripts = Array.from(document.scripts || []);
      for (let i=0;i<scripts.length;i++){
        const s = scripts[i];
        try {
          const text = s.innerText || '';
          out.push({index:i, src: s.src||null, len: text.length, snippet: text.slice(0,500)})
        } catch(e){}
      }
      return out.slice(0,40);
    })()
    """)
    found = False
    for s in scripts_info:
        txt = s['snippet']
        if pattern.search(txt):
            print('Found devanagari in script', s['index'], 'src=', s['src'])
            print(txt)
            found = True
    if not found:
        print('No Devanagari found in first 500 chars of document.scripts; total scripts checked=', len(scripts_info))
    browser.close()
