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

/**
 * Block F Phase 2 (25.07.2026) - reiner Lerninhalt zu mehrtägigem Heilfasten
 * (z. B. nach Buchinger), aus Experten-Review 4 (Mediziner, Heilpraktiker).
 *
 * BEWUSSTE ENTSCHEIDUNG (siehe Review 4 + Ruecksprache mit Nicole, 25.07.2026):
 * WellANNI bietet dafuer KEIN aktives, gefuehrtes Programm/Tracking an - nur
 * Wissen. Ein mehrtaegiger Fasten-Tracker mit Anleitung waere ein deutlich
 * hoeheres medizinisches/regulatorisches Risiko (Kontraindikationen, i.d.R.
 * aerztliche Aufsicht noetig) und wuerde die "kein Medizinprodukt"-Position
 * der App gefaehrden. Nur der bestehende Intervallfasten-Tracker oben bleibt
 * aktiv nutzbar.
 */
export const HEALING_FAST_INFO = {
  title: 'Was ist Heilfasten?',
  intro: 'Heilfasten (z. B. nach Buchinger) bezeichnet einen mehrtägigen, weitgehend festen Verzicht auf feste Nahrung - anders als das Intervallfasten oben, das im Alltag stattfindet und hier aktiv getrackt werden kann.',
  points: [
    'Dauer meist 5–10 Tage, mit Brühe, verdünnten Säften und viel Flüssigkeit statt fester Nahrung.',
    'Wird traditionell mit Erholung des Verdauungssystems und mentaler Klarheit in Verbindung gebracht - die wissenschaftliche Evidenz dafür ist deutlich dünner als beim zeitlich begrenzten Intervallfasten.',
    'Nicht geeignet bei: Schwangerschaft/Stillzeit, Essstörungen in der Vorgeschichte, Untergewicht, Diabetes (insbesondere unter Insulin/blutzuckersenkender Medikation), Herz-Kreislauf-Erkrankungen und einigen weiteren Vorerkrankungen.',
    'Wird in der Regel unter ärztlicher oder fachlich geschulter Begleitung durchgeführt, gerade bei erstmaliger Durchführung oder bestehenden Vorerkrankungen.',
  ],
  disclaimer: 'Dieser Abschnitt ist ein reiner Lerninhalt. WellANNI bietet dafür kein aktives Tracking und keine Anleitung an - bei Interesse an einem Heilfasten bitte vorher ärztlichen Rat einholen.',
};
