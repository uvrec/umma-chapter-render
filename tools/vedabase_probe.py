from playwright.sync_api import sync_playwright
import json

URL = "https://vedabase.io/en/library/cc/adi/1/1/1/"

script = r"""
(() => {
  const devaRegex = /[\u0900-\u097F\u0980-\u09FF]/g;
  const candidates = [];
  const els = Array.from(document.querySelectorAll('body *'));
  for (const el of els) {
    try {
      const text = (el.innerText || '').trim();
      if (!text || text.length < 8) continue;
      const nonAscii = /[^\x00-\x7F]/.test(text);
      const hasDeva = devaRegex.test(text);
      if (nonAscii || hasDeva) {
        candidates.push({
          tag: el.tagName,
          id: el.id || null,
          class: el.className || null,
          textLen: text.length,
          snippet: text.slice(0, 300).replace(/\n+/g, ' '),
          hasDevanagari: hasDeva
        });
      }
    } catch (e) {
      // ignore
    }
  }
  // sort by textLen desc
  candidates.sort((a,b)=>b.textLen-a.textLen);
  return candidates.slice(0, 60);
})()
"""

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto(URL, wait_until='networkidle')
    # give client scripts a bit more time
    page.wait_for_timeout(2000)
    result = page.evaluate(script)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    browser.close()
