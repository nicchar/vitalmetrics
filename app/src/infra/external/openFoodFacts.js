/**
 * openFoodFacts.js
 *
 * Optionale Online-Suche über die Open Food Facts API. Wird ausschließlich
 * durch eine explizite Nutzer-Aktion (Button-Klick) ausgelöst, nie automatisch
 * bei jeder Tastatureingabe – wichtig für Datensparsamkeit (siehe Datenschutz-
 * erklärung: Datenfluss an externen Dienst nur bei aktiver Nutzung).
 */

function offEmoji(product) {
  const cats = (product.categories_tags || []).join(' ');
  if (/en:fruits|obst/.test(cats)) return '🍎';
  if (/en:vegetables|gemüse/.test(cats)) return '🥦';
  if (/en:meats|fleisch/.test(cats)) return '🥩';
  if (/en:fish|fisch/.test(cats)) return '🐟';
  if (/en:dairy|milch/.test(cats)) return '🥛';
  if (/en:breads|brot/.test(cats)) return '🍞';
  if (/en:beverages|getränk/.test(cats)) return '🥤';
  if (/en:sweet|süß/.test(cats)) return '🍫';
  if (/en:cereals/.test(cats)) return '🥣';
  if (/en:nuts/.test(cats)) return '🥜';
  return '🍽️';
}

export function mapOFFFood(product) {
  const n = product.nutriments || {};
  const rawName = (product.product_name || '').trim() || 'Unbekannt';
  const brand = product.brands ? product.brands.split(',')[0].trim() : '';
  return {
    name: rawName.slice(0, 50),
    brand,
    emoji: offEmoji(product),
    kal: Math.round(n['energy-kcal_100g'] || (n['energy_100g'] || 0) / 4.184),
    protein: Math.round((n['proteins_100g'] || 0) * 10) / 10,
    fat: Math.round((n['fat_100g'] || 0) * 10) / 10,
    carbs: Math.round((n['carbohydrates_100g'] || 0) * 10) / 10,
    // Mikronährstoffe wie von OFF geliefert (Einheiten variieren, Best-Effort)
    vit_a: n['vitamin-a_100g'] || 0,
    vit_d: n['vitamin-d_100g'] || 0,
    vit_e: n['vitamin-e_100g'] || 0,
    vit_k: n['vitamin-k_100g'] || 0,
    vit_c: n['vitamin-c_100g'] || 0,
    b1: n['vitamin-b1_100g'] || 0,
    b2: n['vitamin-b2_100g'] || 0,
    // OFF führt Niacin/Vitamin B3 intern unter 'vitamin-pp_100g' (historischer
    // Name "Vitamine PP"), nicht unter 'niacin_100g' - dadurch war B3 bei
    // Scans/Suche praktisch immer 0 (Fund 18.08.2026). 'niacin_100g' bleibt
    // als Fallback, falls OFF den Wert doch mal unter diesem Namen liefert.
    b3: n['vitamin-pp_100g'] || n['niacin_100g'] || 0,
    b6: n['vitamin-b6_100g'] || 0,
    b12: n['vitamin-b12_100g'] || 0,
    folat: n['folates_100g'] || 0,
    eisen: n['iron_100g'] || 0,
    zink: n['zinc_100g'] || 0,
    mag: n['magnesium_100g'] || 0,
    cal: n['calcium_100g'] || 0,
    source: 'openfoodfacts',
  };
}

/**
 * Sucht Produkte bei Open Food Facts. Wirft bei Netzwerkfehler/Timeout.
 * @param {string} query
 * @returns {Promise<Array>} gemappte Food-Objekte
 */
export async function searchOpenFoodFacts(query) {
  const url = `https://world.openfoodfacts.org/api/v2/search?`
    + `search_terms=${encodeURIComponent(query)}`
    + `&cc=de&page_size=8`
    + `&fields=product_name,brands,nutriments,categories_tags`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000);
  let resp;
  try {
    resp = await fetch(url, { signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
  if (!resp.ok) throw new Error('HTTP ' + resp.status);
  const data = await resp.json();
  const products = (data.products || []).filter(p => p.product_name && p.nutriments);
  return products.map(mapOFFFood);
}

/**
 * Sucht ein einzelnes Produkt bei Open Food Facts anhand seines Barcodes
 * (EAN-8/13, UPC-A/E). Wird ausschließlich nach einem expliziten Scan-Vorgang
 * (Nutzer-Aktion, Kamera-Button) aufgerufen – kein automatischer Datenfluss.
 * @param {string} barcode
 * @returns {Promise<Object|null>} gemapptes Food-Objekt oder null, falls unbekannt
 */
export async function fetchProductByBarcode(barcode) {
  const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}`
    + `?fields=product_name,brands,nutriments,categories_tags,status`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000);
  let resp;
  try {
    resp = await fetch(url, { signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
  if (!resp.ok) throw new Error('HTTP ' + resp.status);
  const data = await resp.json();
  // status === 0 bzw. fehlendes product: Barcode bei OFF nicht bekannt.
  if (!data || data.status === 0 || !data.product || !data.product.product_name) {
    return null;
  }
  return mapOFFFood(data.product);
}
