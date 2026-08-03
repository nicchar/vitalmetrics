/**
 * mealType.js
 *
 * Mahlzeiten-Kategorisierung im Ernährungstagebuch (Feature-Wunsch 03.08.2026):
 * bisher stand jeder Tag als eine flache Liste da, ohne Frühstück/Mittag/
 * Abend/Snacks zu unterscheiden. Ab jetzt bekommt jeder Eintrag ein
 * `mealType`-Feld.
 *
 * 'other' ("Sonstiges") ist bewusst KEIN Auswahl-Button in der UI, sondern
 * ausschließlich der automatische Auffangwert für Alt-Einträge aus der Zeit
 * vor diesem Feature (siehe nutritionRepo.js Migration v1->v2) sowie ein
 * defensiver Default, falls doch mal ein Aufrufer kein mealType mitgibt.
 * Neue Einträge bekommen immer eine der vier echten Kategorien, weil die
 * Auswahl in der UI VOR dem Hinzufügen erfolgt (Nicole, 03.08.2026: "erst
 * die Mahlzeit-Kategorie wählen und danach so wie immer handhaben").
 */

export const MEAL_TYPES = [
  { key: 'breakfast', label: 'Frühstück', emoji: '🍳' },
  { key: 'lunch', label: 'Mittag', emoji: '🥗' },
  { key: 'dinner', label: 'Abend', emoji: '🍽️' },
  { key: 'snack', label: 'Snack', emoji: '🍿' },
];

export const OTHER_MEAL_TYPE = { key: 'other', label: 'Sonstiges', emoji: '🍴' };

/** Anzeige-Reihenfolge für die gruppierte Eintragsliste, inkl. "Sonstiges" ganz am Ende. */
export const MEAL_TYPES_FOR_DISPLAY = [...MEAL_TYPES, OTHER_MEAL_TYPE];

const MEAL_TYPE_KEYS = new Set(MEAL_TYPES_FOR_DISPLAY.map(mt => mt.key));

export function mealTypeMeta(key) {
  return MEAL_TYPES_FOR_DISPLAY.find(mt => mt.key === key) || OTHER_MEAL_TYPE;
}

/**
 * Schätzt anhand der aktuellen Uhrzeit eine sinnvolle Vorauswahl für die
 * Mahlzeit-Kategorie (Startwert des Auswahl-Reglers, jederzeit änderbar).
 * Grenzen bewusst grob/alltagstauglich, kein Anspruch auf Exaktheit:
 *   05-11 Uhr Frühstück · 11-15 Uhr Mittag · 15-18 Uhr Snack ·
 *   18-23 Uhr Abend · 23-05 Uhr (spätnachts) Snack als neutralster Default.
 */
export function guessMealTypeByTime(date = new Date()) {
  const h = date.getHours();
  if (h >= 5 && h < 11) return 'breakfast';
  if (h >= 11 && h < 15) return 'lunch';
  if (h >= 15 && h < 18) return 'snack';
  if (h >= 18 && h < 23) return 'dinner';
  return 'snack';
}

/**
 * Gruppiert Tages-Einträge nach Mahlzeit-Kategorie in fester Anzeige-
 * Reihenfolge (Frühstück -> Mittag -> Abend -> Snack -> Sonstiges), lässt
 * leere Gruppen weg und behält für jedes Item den ORIGINAL-Index im
 * ungruppierten `entries`-Array bei (Deleten läuft weiterhin über
 * nutritionRepo.removeEntry(date, idx) mit diesem Index).
 *
 * @returns {{key:string, label:string, emoji:string, kcal:number,
 *            items:{entry:object, idx:number}[]}[]}
 */
export function groupEntriesByMealType(entries) {
  const buckets = new Map(MEAL_TYPES_FOR_DISPLAY.map(mt => [mt.key, { ...mt, items: [], kcal: 0 }]));
  entries.forEach((entry, idx) => {
    const key = MEAL_TYPE_KEYS.has(entry.mealType) ? entry.mealType : 'other';
    const bucket = buckets.get(key);
    bucket.items.push({ entry, idx });
    if (entry.food) bucket.kcal += Math.round((entry.food.kal || 0) * entry.grams / 100);
  });
  return MEAL_TYPES_FOR_DISPLAY.map(mt => buckets.get(mt.key)).filter(b => b.items.length > 0);
}
