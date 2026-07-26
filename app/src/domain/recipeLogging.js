/**
 * recipeLogging.js
 *
 * Block F Phase 4b: "Rezept gekocht" -> Ernährungstagebuch.
 *
 * Jedes Rezept hat (seit der Batch-Anreicherung Juli 2026, siehe
 * recipes.json-Feld `nutritionPerServing`) bereits vorberechnete, gegen
 * BLS 4.0 gematchte Nährwerte für GENAU EINE Rezept-Portion (Summe aller
 * Zutaten ÷ recipe.servings). Dieses Modul rechnet das nur noch mit dem vom
 * Nutzer gewählten Portionsfaktor hoch und formt daraus ein "food"-Objekt im
 * selben Schema, das nutritionRepo.addEntry() für jedes andere Lebensmittel
 * auch erwartet (kal/protein/fat/carbs/vit_.../eisen/zink/mag/cal pro 100g-
 * Äquivalent). Es wird bewusst NICHT zur Laufzeit erneut aus den Freitext-
 * Zutaten geraten - das war genau das Genauigkeitsproblem, das die einmalige
 * Batch-Anreicherung lösen sollte (siehe Block-F-Phase-4b-Report).
 *
 * Portionsfaktor: Nicole (25.07.2026) wies darauf hin, dass einzelne Rezepte
 * für "1 Portion" ungewöhnlich groß bemessen sind (z.B. 300g Lachs) - der
 * Nutzer soll daher beim Eintragen zwischen 0,5x/1x/1,5x/2x wählen können,
 * statt stur game Rezept-Portionsangabe zu übernehmen.
 */

export const PORTION_FACTORS = [0.5, 1, 1.5, 2];

const NUTRIENT_KEYS = [
  'kal', 'protein', 'fat', 'carbs', 'vit_a', 'vit_d', 'vit_e', 'vit_k', 'vit_c',
  'b1', 'b2', 'b3', 'b6', 'b12', 'folat', 'eisen', 'zink', 'mag', 'cal',
];

/**
 * Skaliert die pro-Portion-Nährwerte eines Rezepts mit dem gewählten Faktor.
 * Gibt null zurück, wenn dem Rezept (noch) keine nutritionPerServing-Daten
 * vorliegen (sollte nach Phase 4b nicht mehr vorkommen, aber defensiv für
 * künftige, noch nicht anreicherte Rezepte).
 */
export function computeLoggedNutrition(recipe, portionFactor = 1) {
  const base = recipe?.nutritionPerServing;
  if (!base) return null;
  const out = {};
  for (const key of NUTRIENT_KEYS) {
    out[key] = Math.round((base[key] || 0) * portionFactor * 100) / 100;
  }
  return out;
}

/**
 * Baut aus einem Rezept + Portionsfaktor ein "food"-Objekt im Schema von
 * nutritionRepo.addEntry({food, grams}). Nutzt denselben Trick wie die
 * Open-Food-Facts-Integration: `grams` ist kein echtes Gewicht, sondern
 * 100 * portionFactor, damit die bestehende "kal * grams/100"-Rechnung im
 * Repo exakt portionFactor Portionen ergibt, ganz ohne Repo-Änderung.
 */
export function recipeToFoodEntry(recipe, portionFactor = 1) {
  // WICHTIG: hier bewusst Faktor 1 (unskaliert) - die eigentliche Skalierung
  // um portionFactor passiert unten über `grams`, nicht hier. Beides zu
  // skalieren würde den Faktor quadrieren (0,5x würde z.B. zu 0,25x der
  // echten Werte führen).
  const nutrition = computeLoggedNutrition(recipe, 1);
  if (!nutrition) return null;
  return {
    food: {
      name: recipe.title,
      emoji: '🍳',
      source: 'recipe',
      recipeId: recipe.id,
      ...nutrition,
    },
    grams: 100 * portionFactor,
  };
}
