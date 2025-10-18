from playwright.sync_api import sync_playwright
import json

URL = "https://vedabase.io/en/library/cc/adi/1/1/1/"

def extract():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(URL, wait_until='networkidle')
        page.wait_for_timeout(1000)
        # Try to locate toggles
        clicked = []
        try:
            # Advanced view or Views menu
            if page.locator('text=Devanagari').count() > 0:
                page.locator('text=Devanagari').first.click()
                clicked.append('Devanagari')
                page.wait_for_timeout(800)
        except Exception:
            pass
        try:
            if page.locator('text=devanagari').count() > 0:
                page.locator('text=devanagari').first.click()
                clicked.append('devanagari')
                page.wait_for_timeout(800)
        except Exception:
            pass
        # fallback: open any dropdown that contains 'Advanced'
        try:
            if page.locator('text=Advanced').count() > 0:
                page.locator('text=Advanced').first.click()
                clicked.append('Advanced')
                page.wait_for_timeout(800)
        except Exception:
            pass

        # After attempts, scan DOM for Devanagari / Bengali
        res = page.evaluate(r"""
        (() => {
          const deva = /[\u0900-\u097F\u0980-\u09FF]/g;
          const out = [];
          const els = Array.from(document.querySelectorAll('body *'));
          for (const el of els) {
            try {
              const text = (el.innerText || '').trim();
              if (!text || text.length < 6) continue;
              if (deva.test(text)) {
                out.push({tag: el.tagName, id: el.id||null, class: el.className||null, len: text.length, snippet: text.slice(0,200).replace(/\n+/g,' ')})
              }
            } catch(e){}
          }
          return out.slice(0,80);
        })()
        """)
        browser.close()
        return clicked, res

if __name__ == '__main__':
    clicked, res = extract()
    print('Clicked:', clicked)
    print('Found', len(res), 'elements with Devanagari')
    print(json.dumps(res, ensure_ascii=False, indent=2))
