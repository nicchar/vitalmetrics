import { getRefRange } from './ranges.js';

/**
 * status.js
 *
 * Ordnet einen Messwert relativ zu einem Referenzbereich ein.
 *
 * Wortwahl und Farben wurden im "Interpretation & Sicherheit"-Review
 * (Juli 2026, Regulatory-Affairs-Perspektive) bewusst überarbeitet: die
 * Ampelfarben (Rot/Grün/Orange) und wertende Begriffe wie "zu niedrig/zu
 * hoch" wirken wie eine automatisierte Gesundheitsbewertung - genau die
 * Art Software-Funktion, die laut MDR Art. 3(1) in Richtung Medizinprodukt
 * kippen kann. Seitdem: rein deskriptive Positionsangabe relativ zu einem
 * genannten Referenzbereich ("unterhalb/oberhalb"), keine Ampelfarben mehr.
 * Die internen Status-Keys ('low'/'ok'/'high'/'unknown') bleiben unverändert
 * (werden an vielen Stellen als Bezeichner genutzt) - nur Label und Farbe
 * ändern sich.
 *
 * Returns 'low' | 'ok' | 'high' | 'unknown'
 * profile = { sex: 'm'|'f'|'', ... } for gender-aware ranges.
 */
export function getStatus(value, biomarker, profile) {
  if (value == null || value === '') return 'unknown';
  const v = parseFloat(value);
  if (isNaN(v)) return 'unknown';

  const { min, max } = getRefRange(biomarker, profile || {});
  if (min == null && max == null) return 'unknown';

  if (min != null && v < min) return 'low';
  if (max != null && v > max) return 'high';
  return 'ok';
}

export function getStatusLabel(status) {
  return { low: 'Unterhalb Referenzbereich', ok: 'Im Referenzbereich', high: 'Oberhalb Referenzbereich', unknown: 'Kein Wert' }[status] ?? 'Unbekannt';
}

export function getStatusColor(status) {
  return { low: '#78909C', ok: '#1a7a6e', high: '#8D6E63', unknown: '#BDBDBD' }[status] ?? '#BDBDBD';
}

export function getStatusEmoji(status) {
  return { low: '🔴', ok: '🟢', high: '🟡', unknown: '⚪' }[status] ?? '⚪';
}

/**
 * Neutraler Sicherheitshinweis bei Abweichung vom Referenzbereich
 * (Mediziner-Perspektive im "Interpretation & Sicherheit"-Review: die App
 * sagte bislang bei jeder Abweichung dasselbe wie bei jeder anderen -
 * ohne jeden Hinweis, das Thema ärztlich abklären zu lassen). Bewusst
 * zurückhaltend formuliert (kein "sofort zum Arzt"), um weder Panik zu
 * erzeugen noch eine leere Floskel zu sein.
 * @param {'low'|'ok'|'high'|'unknown'} status
 * @returns {string|null}
 */
export function getEscalationHint(status) {
  if (status !== 'low' && status !== 'high') return null;
  return 'Deutliche Abweichungen vom Referenzbereich sind ein guter Anlass, das Thema bei der nächsten ärztlichen Untersuchung anzusprechen.';
}
