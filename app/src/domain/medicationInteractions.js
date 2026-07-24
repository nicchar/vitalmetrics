/**
 * medicationInteractions.js
 *
 * Allgemeine, gut belegte Wechselwirkungshinweise zwischen häufigen
 * Medikamenten-/Supplement-Kategorien und Nährstoffen (Block E,
 * Entscheidung "nur allgemeine Hinweise" vom 22.07.2026).
 *
 * BEWUSST KEINE individuelle Bewertung auf Basis einer Freitext-Diagnose -
 * nur breit dokumentierte Kategorie-Effekte mit Arzt/Apotheker-Verweis.
 * Der Nutzer wählt selbst aus einer festen Liste (keine Freitext-Diagnose),
 * siehe profileRepo.medications.
 */
export const MEDICATION_CATEGORIES = {
  blutverduenner: 'Blutverdünner (z. B. Marcumar, Warfarin)',
  schilddruese: 'Schilddrüsenhormone (z. B. L-Thyroxin)',
  antibiotika: 'Antibiotika (Tetracycline/Chinolone)',
  ppi: 'Magensäurehemmer (Protonenpumpenhemmer)',
  statine: 'Cholesterinsenker (Statine)',
  metformin: 'Metformin (Diabetes Typ 2)',
  diuretika: 'Kaliumsparende Diuretika / ACE-Hemmer',
};

export const MEDICATION_INTERACTIONS = [
  { med: 'blutverduenner', nutrient: 'vitamin_k', text: 'Vitamin K kann die Wirkung von Vitamin-K-Antagonisten (Blutverdünnern) abschwächen. Zufuhr möglichst konstant halten, nicht plötzlich stark verändern, und Rücksprache mit dem behandelnden Arzt halten.' },
  { med: 'schilddruese', nutrient: 'calcium', text: 'Calcium kann die Aufnahme von Schilddrüsenhormonen verringern – mindestens 4 Stunden Abstand zwischen Tabletteneinnahme und calciumreichen Lebensmitteln/Supplementen einhalten.' },
  { med: 'schilddruese', nutrient: 'eisen', text: 'Eisen kann die Aufnahme von Schilddrüsenhormonen verringern – mindestens 4 Stunden Abstand zwischen Tabletteneinnahme und Eisenpräparaten einhalten.' },
  { med: 'antibiotika', nutrient: 'calcium', text: 'Calcium kann die Aufnahme bestimmter Antibiotika (Tetracycline, Chinolone) stark verringern – Einnahme zeitlich trennen, siehe Packungsbeilage.' },
  { med: 'antibiotika', nutrient: 'magnesium', text: 'Magnesium kann die Aufnahme bestimmter Antibiotika (Tetracycline, Chinolone) verringern – Einnahme zeitlich trennen.' },
  { med: 'antibiotika', nutrient: 'zink', text: 'Zink kann die Aufnahme bestimmter Antibiotika (Tetracycline, Chinolone) verringern – Einnahme zeitlich trennen.' },
  { med: 'ppi', nutrient: 'vitamin_b12', text: 'Langfristige Einnahme von Magensäurehemmern kann die Vitamin-B12-Aufnahme verringern – bei Daueranwendung Rücksprache mit dem Arzt zu Kontrolle/Supplementierung halten.' },
  { med: 'ppi', nutrient: 'magnesium', text: 'Langfristige Einnahme von Magensäurehemmern kann den Magnesiumspiegel senken – bei Daueranwendung ärztlich kontrollieren lassen.' },
  { med: 'statine', nutrient: 'coq10', text: 'Statine können den körpereigenen Coenzym-Q10-Spiegel senken – bei Muskelbeschwerden unter Statin-Therapie mit dem Arzt besprechen.' },
  { med: 'metformin', nutrient: 'vitamin_b12', text: 'Langfristige Metformin-Einnahme kann den Vitamin-B12-Spiegel senken – regelmäßige Kontrolle wird häufig empfohlen, bitte mit dem Arzt besprechen.' },
  { med: 'diuretika', nutrient: 'magnesium', text: 'Kaliumsparende Diuretika/ACE-Hemmer in Kombination mit Kalium- oder Magnesium-Supplementen können zu erhöhten Elektrolytwerten führen – Supplementierung nur nach Rücksprache mit dem Arzt.' },
];

/**
 * Liefert alle Interaktionswarnungen für die aktiven Medikamentenkategorien
 * des Nutzers, die den gegebenen Nährstoff betreffen.
 * @param {string[]} activeMedications  profile.medications
 * @param {string} nutrientId
 */
export function getMedicationWarnings(activeMedications, nutrientId) {
  if (!activeMedications?.length) return [];
  return MEDICATION_INTERACTIONS.filter(
    i => i.nutrient === nutrientId && activeMedications.includes(i.med)
  );
}

/**
 * Quellenangabe für die Anzeige (Mediziner-Perspektive im "Interpretation &
 * Sicherheit"-Review: fehlende Quellenangabe bei Medikamenten-Hinweisen ist
 * ein Vertrauens-/Haftungsproblem, unabhängig davon, ob der Inhalt stimmt).
 * Bewusst ehrlich formuliert - keine proprietäre Wechselwirkungsdatenbank
 * vorgetäuscht, die es hier nicht gibt.
 */
export const MEDICATION_SOURCE_NOTE =
  'Quelle: allgemein dokumentierte Wechselwirkungen laut Fachinformation/Beipackzettel der jeweiligen Wirkstoffgruppen – keine vollständige Auflistung.';
