/**
 * energyNeeds.js
 *
 * Grober Tagesbedarf (Grundumsatz/TDEE) und aktivitätsabhängige
 * Protein-Referenz - Review 11 (19.08.2026), Nicoles Wunsch: "kann man
 * daraus auch grob den Grundumsatz ermitteln, wenn wir schon keinen
 * Kalorienrechner machen?"
 *
 * Bewusst KEIN Kalorienrechner: alle Funktionen geben Spannen zurück, keine
 * Einzelwerte, und die App zeigt sie ausdrücklich als "Orientierung, kein
 * Ziel zum Unter- oder Überschreiten" (Leitplanke aus Review 11 - Kalorien-
 * angaben sind sensibel, siehe user_wellbeing-Grundsätze des Projekts).
 *
 * Grundlagen (recherchiert für Review 11, Quellen dort dokumentiert):
 * - BMR: Mifflin-St-Jeor-Formel, weiterhin die anerkannt genaueste einfache
 *   Formel für die Allgemeinbevölkerung (kein neuerer Standard etabliert).
 * - PAL-Kategorien orientieren sich an der DGE-Referenztabelle (drei
 *   tabellierte Stufen 1,4/1,6/1,8), ergänzt um eine vierte, gröbere Stufe
 *   für körperlich harte Arbeit/Leistungssport (DGE nennt hierfür 2,0-2,4
 *   als Bereich, nicht einzeln tabelliert - wir nutzen die Mitte 2,2).
 * - Protein: DGE-Basiswert 0,8 g/kg (ab 70 Jahren 1,0 g/kg). Laut DGE KEIN
 *   Mehrbedarf bei lockerem/moderatem Freizeitsport - erst bei strukturiertem,
 *   intensivem Training/körperlich harter Arbeit die höhere Spanne aus dem
 *   DGE-Sportler-Positionspapier (dort 1,2-2,0 g/kg; wir nutzen bewusst das
 *   konservativere untere Teilstück 1,2-1,6 g/kg, um nicht zu überschätzen).
 */

export const ACTIVITY_LEVELS = [
  {
    key: 'sitzend',
    label: 'Sitzende Tätigkeit, kaum Bewegung',
    hint: 'Bürojob, wenig Sport oder Wege zu Fuß im Alltag.',
    pal: 1.4,
  },
  {
    key: 'leicht_aktiv',
    label: 'Sitzend, mit etwas Bewegung',
    hint: 'Bürojob mit regelmäßigen Wegen zu Fuß, gelegentlicher lockerer Sport.',
    pal: 1.6,
  },
  {
    key: 'aktiv',
    label: 'Stehend/gehend oder regelmäßiger Sport',
    hint: 'Stehender/gehender Beruf, oder 3–5× pro Woche moderater Sport.',
    pal: 1.8,
  },
  {
    key: 'sehr_aktiv',
    label: 'Körperlich harte Arbeit oder Leistungssport',
    hint: 'Handwerklich/körperlich fordernder Beruf, strukturiertes intensives Kraft- oder Ausdauertraining.',
    pal: 2.2,
  },
];

export function getActivityLevel(key) {
  return ACTIVITY_LEVELS.find(a => a.key === key) || null;
}

// Mittelwert je Altersgruppen-Bucket - das Onboarding fragt aus Aufwandsgründen
// nur eine grobe Altersgruppe ab (z.B. '25-50'), kein Geburtsjahr-Pflichtfeld.
// Wer im Profil freiwillig ein Geburtsjahr einträgt, bekommt das exakte Alter;
// sonst wird die Bucket-Mitte als grobe Näherung für BMR/TDEE genutzt.
const AGE_GROUP_MIDPOINT = { '18-19': 18, '19-25': 22, '25-50': 37, '51-70': 60, '70+': 75 };

/**
 * Grobe Altersschätzung aus dem Profil - exaktes Alter, falls birthYear
 * hinterlegt ist, sonst die Mitte der im Onboarding gewählten Altersgruppe.
 * @param {{birthYear?: number, ageGroup?: string}} profile
 * @returns {number|null}
 */
export function estimateAge(profile) {
  if (profile?.birthYear) {
    const age = new Date().getFullYear() - profile.birthYear;
    if (age > 0 && age < 130) return age;
  }
  return AGE_GROUP_MIDPOINT[profile?.ageGroup] || null;
}

/**
 * Grundumsatz (BMR) in kcal/Tag nach Mifflin-St-Jeor.
 * Gibt null zurück statt zu raten, wenn Angaben fehlen - insbesondere bei
 * Geschlecht "keine Angabe" gibt es keine neutrale Formel-Konstante, die
 * nicht faktisch eine der beiden Varianten wäre.
 * @param {number} weightKg
 * @param {number} heightCm
 * @param {number} age
 * @param {'m'|'f'|''} sex
 * @returns {number|null}
 */
export function calcBMR(weightKg, heightCm, age, sex) {
  if (!weightKg || !heightCm || !age) return null;
  if (sex !== 'm' && sex !== 'f') return null;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(sex === 'f' ? base - 161 : base + 5);
}

/**
 * Grobe Tagesbedarfs-Spanne (TDEE) in kcal - bewusst als Spanne (±5% um den
 * Mittelwert), damit die Ungenauigkeit der Schätzformel nicht als falsche
 * Präzision daherkommt.
 * @returns {{min:number, max:number, pal:number}|null}
 */
export function calcTDEERange(weightKg, heightCm, age, sex, activityLevelKey) {
  const bmr = calcBMR(weightKg, heightCm, age, sex);
  const level = getActivityLevel(activityLevelKey);
  if (!bmr || !level) return null;
  const mid = bmr * level.pal;
  return {
    min: Math.round((mid * 0.95) / 10) * 10,
    max: Math.round((mid * 1.05) / 10) * 10,
    pal: level.pal,
  };
}

/**
 * Protein-Referenzspanne in Gramm/Tag. Ohne hinterlegtes Gewicht kein Wert
 * (kein Rateergebnis auf Basis eines angenommenen Durchschnittsgewichts).
 * @param {number} weightKg
 * @param {string} activityLevelKey
 * @param {boolean} isSenior - ab 70 Jahren (profil.ageGroup === '70+')
 * @returns {{min:number, max:number}|null}
 */
export function getProteinRefRange(weightKg, activityLevelKey, isSenior) {
  if (!weightKg) return null;
  const level = getActivityLevel(activityLevelKey);
  const baseline = isSenior ? 1.0 : 0.8;
  // DGE: kein Mehrbedarf bei lockerem/moderatem Freizeitsport - erst bei
  // "sehr_aktiv" (strukturiertes intensives Training/körperlich harte Arbeit)
  // die höhere Spanne aus dem DGE-Sportler-Positionspapier.
  if (!level || level.key !== 'sehr_aktiv') {
    const g = Math.round(weightKg * baseline);
    return { min: g, max: g };
  }
  return { min: Math.round(weightKg * 1.2), max: Math.round(weightKg * 1.6) };
}

/**
 * Taille-Hüft-Verhältnis (Waist-to-Hip-Ratio, WHR) - rein deskriptiv wie der
 * Rest der App (status.js-Philosophie: keine Ampel/automatisierte Bewertung).
 * @returns {number|null} z.B. 0.83
 */
export function calcWHR(waistCm, hipCm) {
  if (!waistCm || !hipCm) return null;
  return Math.round((waistCm / hipCm) * 100) / 100;
}

/**
 * WHO-Referenzangabe zum WHR als reiner Informationstext (keine automatische
 * "dein Wert ist zu hoch"-Bewertung durch die App selbst).
 */
export function getWHRRefLabel(sex) {
  if (sex === 'f') return 'WHO-Orientierung: ab 0,85 erhöhtes Risiko';
  if (sex === 'm') return 'WHO-Orientierung: ab 0,90 erhöhtes Risiko';
  return 'WHO-Orientierung: 0,80–0,90 je nach Geschlecht';
}
