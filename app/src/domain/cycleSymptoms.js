/**
 * cycleSymptoms.js
 *
 * Referenzdaten für das Zyklus-Symptom-Tagebuch (PMS/Prämenopause/Menopause,
 * Experten-Review 5 + Ergänzung, 25.07.2026).
 *
 * WICHTIG (Nicole, 25.07.2026): "Im Zyklustagebuch soll nur getrackt werden,
 * nicht bewertet." Anders als beim Heißhunger-Journal (siehe domain/
 * cravings.js, analyzeCravings()) gibt es hier BEWUSST KEINE Muster-/
 * Häufigkeitsanalyse, keinen Score, keine Ampel und keinen PMDS-Bezug zu den
 * eigenen Daten. Nur Erfassen und unbewertetes Anzeigen der eingetragenen
 * Symptome, ggf. mit der zum Zeitpunkt berechneten Zyklusphase als reine
 * Zusatzinfo (nicht als Bewertung).
 */

export const SYMPTOM_TAGS = [
  { key: 'kraempfe', label: '🤕 Krämpfe' },
  { key: 'kopfschmerzen', label: '🤯 Kopfschmerzen' },
  { key: 'stimmungsschwankungen', label: '🎭 Stimmungsschwankungen' },
  { key: 'hitzewallungen', label: '🔥 Hitzewallungen' },
  { key: 'schlafprobleme', label: '😴 Schlafprobleme' },
  { key: 'blaehungen', label: '🎈 Blähungen' },
  { key: 'erschoepfung', label: '🔋 Erschöpfung' },
  { key: 'heisshunger', label: '🍫 Heißhunger' },
  { key: 'brustspannen', label: '💠 Brustspannen' },
  { key: 'migraene', label: '⚡ Migräne' },
];

export const SYMPTOM_LABELS = Object.fromEntries(SYMPTOM_TAGS.map(t => [t.key, t.label]));
