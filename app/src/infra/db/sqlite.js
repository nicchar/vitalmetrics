/**
 * Storage Adapter – wraps localStorage for web/Capacitor WebView.
 * Can be swapped for @capacitor-community/sqlite on native later.
 */
export const storage = {
  get(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};
