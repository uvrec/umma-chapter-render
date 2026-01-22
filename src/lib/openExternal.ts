export const openExternal = (url: string) => {
  try {
    // Validate protocol to avoid javascript: URLs
    const parsed = new URL(url, window.location.href);
    if (!/^https?:$/i.test(parsed.protocol)) {
      throw new Error('Unsupported protocol');
    }

    // Create an anchor and trigger a real user-like click
    const a = document.createElement('a');
    a.href = parsed.href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    (a as any).referrerPolicy = 'no-referrer';

    // The element must be in the DOM in some browsers
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    // Cleanup
    document.body.removeChild(a);

    if ((import.meta as any).env?.DEV) {
      console.debug('[openExternal] anchor-click navigation', { url: parsed.href, uk: navigator.userAgent });
    }
  } catch (err) {
    console.error('[openExternal] Fallback navigation due to error:', err);
    // Fallbacks
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      window.location.assign(url);
    }
  }
};
