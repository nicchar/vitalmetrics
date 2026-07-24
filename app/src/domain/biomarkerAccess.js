/**
 * biomarkerAccess.js
 *
 * Zugänglichkeits-Einordnung der 47 Biomarker (Juli 2026, ausgelöst durch
 * Nicoles Frage "wie soll ich die Werte alle haben?" + anschließendes
 * Experten-Feedback). Ergänzt die bestehende Evidenz-Logik (skinVitality.js)
 * um eine zweite, genauso sichtbare Dimension: nicht "wie gut belegt ist der
 * Nutzen", sondern "wie komme ich überhaupt an einen Wert".
 *
 * Grundlage der Einteilung (recherchiert Juli 2026):
 * - Check-up 35 (Kassenleistung) deckt nur ein Lipidprofil + einmalig
 *   Hepatitis B/C - keine Mikronährstoffe.
 * - Vitamin-/Mineralstoff-Einzelwerte sind ohne ärztliche Indikation IGeL
 *   (Selbstzahlerleistung), ca. 15-35€ je Wert, gebündelt 90-120€.
 * - Funktionsmedizin-Marker (Zonulin, BDNF, SCFA u.a.) sind laut
 *   Mediziner-Review nicht Teil der ärztlichen Regelversorgung, unabhängig
 *   vom Budget der Nutzerin - kein Hausarzt bestellt sie routinemäßig.
 *
 * 4 Stufen, in aufsteigendem Aufwand:
 * 1. diary          - automatisch aus dem Ernährungstagebuch, kein Test nötig
 * 2. selftest        - zuhause selbst messbar (Waage, Konsum-Selbstauskunft)
 *                       oder per Heimtest ohne Arzttermin (siehe selfTestNote)
 * 3. lab_common       - ärztlich bestimmbar, ggf. als IGeL-Selbstzahlerleistung
 * 4. lab_specialist    - nicht Teil der ärztlichen Regelversorgung, nur über
 *                       spezialisierte/funktionsmedizinische Labore
 */

export const ACCESS_TIERS = {
  DIARY: 'diary',
  SELFTEST: 'selftest',
  LAB_COMMON: 'lab_common',
  LAB_SPECIALIST: 'lab_specialist',
};

export const ACCESS_TIER_LABELS = {
  diary: 'Ernährungstagebuch',
  selftest: 'Selbst messbar',
  lab_common: 'Beim Arzt möglich',
  lab_specialist: 'Spezialdiagnostik',
};

export const ACCESS_TIER_ICONS = {
  diary: '🥗',
  selftest: '🧪',
  lab_common: '🩺',
  lab_specialist: '🔬',
};

export const ACCESS_TIER_DESCRIPTIONS = {
  diary: 'Wird automatisch aus deinen Mahlzeiten im Ernährungstagebuch berechnet - kein Test nötig.',
  selftest: 'Zuhause selbst messbar oder per Heimtest ohne Arzttermin erhältlich.',
  lab_common: 'Ärztlich bestimmbar, ohne konkreten Anlass meist als Selbstzahlerleistung (IGeL, ca. 15-35€ je Wert).',
  lab_specialist: 'Kein Teil der ärztlichen Regelversorgung - nur über spezialisierte bzw. funktionsmedizinische Labore erhältlich.',
};

/** Kurzform für Badges (Karten haben wenig Platz). */
export function getAccessTierBadge(accessTier) {
  const icon = ACCESS_TIER_ICONS[accessTier];
  const label = ACCESS_TIER_LABELS[accessTier];
  if (!icon || !label) return null;
  return `${icon} ${label}`;
}
