/**
 * dailyPicks.js – WellANNI 2.2
 *
 * Tagesabhängige, aber stabile Auswahl für die Startseite: "Rezept des Tages"
 * und ein Rezeptvorschlag für den Kernwert mit der größten Lücke. Die Auswahl
 * hängt nur vom Datum ab (kein Zufall bei jedem Öffnen), bevorzugt Rezepte der
 * aktuellen Saison und – beim Rezept des Tages – Rezepte mit Foto.
 */
import { seasonOf, isInSeason, matchesDiet, filterByIntolerances } from './mealPlan.js';

function dayNumber(isoDate) {
  return Math.floor(new Date(isoDate + 'T12:00:00').getTime() / 86400000);
}

/**
 * @param {string|null} diet Ernährungsform aus dem Wochenplan ('vegetarisch', 'keto', …)
 * @param {string[]} intolerances Unverträglichkeiten aus dem Profil
 */
export function personalPool(recipes, diet = null, intolerances = []) {
  const base = filterByIntolerances(recipes, intolerances);
  return diet ? base.filter(r => matchesDiet(r, diet)) : base;
}

export function recipeOfTheDay(recipes, isoDate) {
  const season = seasonOf(isoDate);
  const pool = recipes.filter(r => r.mealType === 'lunch' && isInSeason(r, season));
  const withPhoto = pool.filter(r => r.image);
  // Jeder zweite Tag ein Foto-Rezept, sonst aus allen – so wird die ganze Sammlung sichtbar
  const list = (dayNumber(isoDate) % 2 === 0 && withPhoto.length) ? withPhoto : pool;
  if (!list.length) return recipes[0] || null;
  return list[dayNumber(isoDate) % list.length];
}

/**
 * Rezeptvorschlag für einen Kernwert: Hauptgerichte der Saison, deren
 * "focus" diesen Nährstoff enthält, sortiert nach Menge pro Portion.
 */
export function recipeForNutrient(recipes, nutrientKey, isoDate, excludeId = null) {
  const season = seasonOf(isoDate);
  const pool = recipes
    .filter(r => r.mealType === 'lunch' && r.id !== excludeId && isInSeason(r, season))
    .map(r => ({ r, amount: r.nutritionPerServing?.[nutrientKey] || 0 }))
    .filter(x => (x.r.focus || []).some(f => f.key === nutrientKey))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);
  if (!pool.length) return null;
  return pool[dayNumber(isoDate) % pool.length].r;
}
