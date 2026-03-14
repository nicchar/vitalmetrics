import recipesData from '../data/recipes.json' assert { type: 'json' };

/**
 * Returns recipes that contain at least one tag matching the given biomarker ids.
 * @param {string[]} biomarkerIds
 * @param {number} limit
 */
export function getRecipesForBiomarkers(biomarkerIds, limit = 3) {
  if (!biomarkerIds?.length) return [];
  return recipesData
    .filter(r => r.tags.some(t => biomarkerIds.includes(t)))
    .slice(0, limit);
}

/**
 * Returns the top foods for a biomarker.
 */
export function getFoodsForBiomarker(biomarker, limit = 6) {
  return (biomarker.foods || []).slice(0, limit);
}
