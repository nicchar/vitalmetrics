/**
 * legalLinks.js
 *
 * URLs der öffentlichen Rechtstexte (Impressum, Datenschutzerklärung, AGB).
 * Gehostet über GitHub Pages aus dem Repo nicchar/vitalmetrics (Block C,
 * Entscheidung: GitHub Pages statt eigener Domain).
 *
 * WICHTIG: Damit diese Links funktionieren, muss GitHub Pages im Repo unter
 * Settings → Pages einmalig aktiviert werden (Branch: main, Ordner: / (root)).
 * Die drei HTML-Dateien (impressum.html, datenschutzerklaerung.html, agb.html)
 * liegen bereits im Repo-Root.
 */

const BASE_URL = 'https://nicchar.github.io/vitalmetrics';

export const LEGAL_LINKS = {
  impressum: `${BASE_URL}/impressum.html`,
  datenschutz: `${BASE_URL}/datenschutzerklaerung.html`,
  agb: `${BASE_URL}/agb.html`,
};

/**
 * Öffnet einen Rechtstext im System-Browser (gleiches Muster wie
 * feedbackService.js), damit die App nicht versucht, externe Seiten in der
 * WebView selbst zu rendern.
 */
export function openLegalLink(key) {
  const url = LEGAL_LINKS[key];
  if (!url) return;
  window.open(url, '_system');
}
