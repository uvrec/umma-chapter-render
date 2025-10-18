from playwright.sync_api import sync_playwright
import json
import re

URL = "https://vedabase.io/en/library/cc/adi/1/1/1/"

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        # Set localStorage before any script runs by using add_init_script
        toggles = {
            "av-before-verses": True,
            "av-devanagari": True,
            "av-bengali": True,
            "av-verse_text": True,
            "av-translation": True,
            "av-synonyms": True,
            "av-purport": True
        }
        context.add_init_script(f"window.localStorage.setItem('advancedViewToggles', {json.dumps(json.dumps(toggles))});")
        page = context.new_page()
        page.goto(URL, wait_until='networkidle')
        page.wait_for_timeout(1500)
        # collect elements containing Devanagari/Bengali
        res = page.evaluate(r"""
        (() => {
          const deva = /[\u0900-\u097F\u0980-\u09FF]/g;
          const out = [];
          const els = Array.from(document.querySelectorAll('body *'));
          for (const el of els) {
            try {
              const text = (el.innerText || '').trim();
              if (!text || text.length < 4) continue;
              if (deva.test(text)) {
                out.push({tag: el.tagName, id: el.id||null, class: el.className||null, len: text.length, snippet: text.slice(0,240).replace(/\n+/g,' ')})
              }
            } catch(e){}
          }
          return out.slice(0,200);
        })()
        """)
        print('Found', len(res), 'elements with Devanagari after toggling advanced-view')
        print(json.dumps(res, ensure_ascii=False, indent=2))
        browser.close()

if __name__ == '__main__':
    run()
