/**
 * nutrition.js
 *
 * DGE-Referenzwerte für Erwachsene (alters- und geschlechtsangepasst).
 * Portiert aus dem Monolithen (VitalMetrics.html).
 *
 * QA-Fund Juli 2026 (App-Tester-Durchlauf): das Onboarding fragte lange nur
 * die Altersgruppen '18-19', '19-25', '25-50' ab, obwohl hier bereits eigene
 * Referenzwerte für '51-70'/'70+' hinterlegt waren (andere B6-/Calcium-Werte)
 * - für eine große, plausible Nutzergruppe griffen die nie. Onboarding wurde
 * seitdem um beide Gruppen ergänzt (siehe onboarding.js).
 */
export function getDGERef(ageGroup, sex) {
  const isF = sex === 'f';
  const is51 = ageGroup === '51-70' || ageGroup === '70+';
  const is70 = ageGroup === '70+';
  return {
    vit_a:  { label: 'Vitamin A',   unit: 'µg', ref: isF ? 700 : 850 },
    vit_d:  { label: 'Vitamin D',   unit: 'µg', ref: 20 },
    vit_e:  { label: 'Vitamin E',   unit: 'mg', ref: 8 },
    vit_k:  { label: 'Vitamin K',   unit: 'µg', ref: isF ? 60 : 70 },
    vit_c:  { label: 'Vitamin C',   unit: 'mg', ref: 110 },
    b1:     { label: 'Vitamin B1',  unit: 'mg', ref: isF ? 1.0 : 1.3 },
    b2:     { label: 'Vitamin B2',  unit: 'mg', ref: isF ? 1.1 : 1.4 },
    b3:     { label: 'Vitamin B3',  unit: 'mg', ref: isF ? 13 : 16 },
    b6:     { label: 'Vitamin B6',  unit: 'mg', ref: is51 ? (isF ? 1.5 : 1.7) : (isF ? 1.4 : 1.6) },
    b12:    { label: 'Vitamin B12', unit: 'µg', ref: 4.0 },
    folat:  { label: 'Folat',       unit: 'µg', ref: 300 },
    eisen:  { label: 'Eisen',       unit: 'mg', ref: isF ? 14 : 11 },
    zink:   { label: 'Zink',        unit: 'mg', ref: isF ? 8 : 11 },
    mag:    { label: 'Magnesium',   unit: 'mg', ref: isF ? 300 : 350 },
    cal:    { label: 'Calcium',     unit: 'mg', ref: is70 ? 1200 : 1000 },
  };
}
