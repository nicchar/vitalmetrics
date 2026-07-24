/**
 * Returns recipes that contain at least one tag matching the given biomarker ids.
 * `recipesData` wird beim App-Start per fetch() geladen (siehe main.js,
 * state.get('recipes')) - kein direkter JSON-Import hier, da die
 * `assert`/`with { type: 'json' }`-Importsyntax je nach WebView-Version
 * unzuverlässig ist und dieses Modul bundlerlos direkt im Browser läuft.
 *
 * @param {object[]} recipesData
 * @param {string[]} biomarkerIds
 * @param {number} limit
 */
export function getRecipesForBiomarkers(recipesData, biomarkerIds, limit = 3) {
  if (!biomarkerIds?.length || !recipesData?.length) return [];
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
