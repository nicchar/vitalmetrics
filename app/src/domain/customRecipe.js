/**
 * customRecipe.js
 *
 * Eigene Rezepte (Feature-Wunsch 03.08.2026): persönliche Rezept-Sammlung,
 * rein lokal gespeichert, NICHT in den Wochenplan oder die 302 App-Rezepte
 * integriert (Nicole, 03.08.2026: "Erstmal nur persönliche Sammlung" - AskUser-
 * Question-Antwort). Nährwerte werden manuell pro Portion eingegeben, statt
 * wie bei den App-Rezepten aus Zutaten berechnet - analog zum "Eigenes
 * Lebensmittel"-Formular in nutrition.js. Mikronährstoffe sind bei manueller
 * Eingabe standardmäßig 0 (kann realistisch niemand ohne Laboranalyse seriös
 * schätzen), nur Kalorien/Makros werden abgefragt.
 *
 * Die Objektform ist bewusst kompatibel zu app/src/data/recipes.json (title,
 * servings, ingredients, steps, nutritionPerServing, nutritionConfidence),
 * damit die bestehende "Rezept gekocht"-Komponente (ui/components/
 * recipeLogControl.js, nutzt recipeToFoodEntry()/computeLoggedNutrition() aus
 * domain/recipeLogging.js) eigene Rezepte ohne jede Änderung verarbeiten kann.
 */

const NUTRIENT_KEYS = [
  'kal', 'protein', 'fat', 'carbs', 'vit_a', 'vit_d', 'vit_e', 'vit_k', 'vit_c',
  'b1', 'b2', 'b3', 'b6', 'b12', 'folat', 'eisen', 'zink', 'mag', 'cal',
];

function parseLines(text) {
  return (text || '').split('\n').map(l => l.trim()).filter(Boolean);
}

/**
 * Baut ein Rezept-Objekt aus rohen Formular-Werten (Strings aus Inputs/
 * Textareas). Gibt bei fehlenden Pflichtfeldern { ok:false, reason } zurück
 * statt zu werfen, damit die UI gezielt einen passenden Toast zeigen kann
 * (siehe ui/screens/myRecipes.js).
 *
 * @returns {{ok:true, recipe:object} | {ok:false, reason:'title'|'ingredients'}}
 */
export function buildCustomRecipe({ title, servings, ingredientsText, stepsText, kal, protein, fat, carbs }) {
  const cleanTitle = (title || '').trim();
  if (!cleanTitle) return { ok: false, reason: 'title' };

  const ingredients = parseLines(ingredientsText);
  if (!ingredients.length) return { ok: false, reason: 'ingredients' };

  const steps = parseLines(stepsText);
  const numServings = Math.max(1, parseInt(servings, 10) || 1);

  const nutritionPerServing = Object.fromEntries(NUTRIENT_KEYS.map(k => [k, 0]));
  nutritionPerServing.kal = parseFloat(kal) || 0;
  nutritionPerServing.protein = parseFloat(protein) || 0;
  nutritionPerServing.fat = parseFloat(fat) || 0;
  nutritionPerServing.carbs = parseFloat(carbs) || 0;

  return {
    ok: true,
    recipe: {
      id: `custom_${Date.now()}`,
      title: cleanTitle,
      servings: numServings,
      duration: '',
      ingredients,
      steps,
      nutritionPerServing,
      nutritionConfidence: 'estimated',
      source: 'custom',
      createdAt: new Date().toISOString(),
    },
  };
}
