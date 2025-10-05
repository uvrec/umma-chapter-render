export const openExternal = (url: string) => {
  try {
    // Open a new isolated window and then navigate inside it
    const newWin = window.open('', '_blank', 'noopener,noreferrer');
    if (newWin) {
      // Extra safety: sever the connection to the opener
      newWin.opener = null;
      newWin.location.href = url;
      if ((import.meta as any).env?.DEV) {
        console.debug('[openExternal] opening external URL', { url, ua: navigator.userAgent });
      }
    } else {
      // Popup might be blocked — fallback to direct navigation
      window.location.assign(url);
    }
  } catch (err) {
    console.error('[openExternal] Error opening URL', err);
    // Last resort fallback
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};
