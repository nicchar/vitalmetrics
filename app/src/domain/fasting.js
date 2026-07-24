/**
 * fasting.js
 *
 * Statische Referenzdaten für den Intervallfasten-Tracker.
 * Portiert aus dem Monolithen (VitalMetrics.html).
 */

export const FASTING_STAGES = [
  { h: 4,  emoji: '🍬', name: 'Zuckerverdauung', desc: 'Insulin sinkt, Glykogen wird verbraucht.' },
  { h: 8,  emoji: '🔥', name: 'Fettverbrennung', desc: 'Körper wechselt auf Fettverbrennung.' },
  { h: 12, emoji: '🧹', name: 'Tiefe Reinigung', desc: 'Erste Autophagie-Prozesse starten.' },
  { h: 16, emoji: '♻️', name: 'Autophagie aktiv', desc: 'Zellreinigung läuft — optimale Erneuerung.' },
  { h: 20, emoji: '⚡', name: 'Ketose & Fokus', desc: 'Ketone steigen — mentale Klarheit.' },
];

export const FASTING_PROTOCOLS = { '16:8': 16, '14:10': 14, '12:12': 12 };
