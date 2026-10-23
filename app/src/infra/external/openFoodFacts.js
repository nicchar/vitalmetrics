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

const round2 = v => Math.round(v * 100) / 100;
/** g -> mg (OFF-Normierung, siehe mapOFFFood) */
const mg = g => round2((Number(g) || 0) * 1000);
/** g -> µg */
const ug = g => round2((Number(g) || 0) * 1000000);

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
    // 2.2: Open Food Facts speichert alle *_100g-Werte normiert in GRAMM
    // (z. B. vitamin-c_100g = 0.0182 für 18,2 mg). Vorher wurden die Werte
    // ungerechnet übernommen - Mikronährstoffe aus Suche/Scan waren dadurch
    // um Faktor 1.000 (mg) bzw. 1.000.000 (µg) zu klein.
    vit_a: ug(n['vitamin-a_100g']),
    vit_d: ug(n['vitamin-d_100g']),
    vit_e: mg(n['vitamin-e_100g']),
    vit_k: ug(n['vitamin-k_100g']),
    vit_c: mg(n['vitamin-c_100g']),
    b1: mg(n['vitamin-b1_100g']),
    b2: mg(n['vitamin-b2_100g']),
    // OFF führt Niacin/Vitamin B3 intern unter 'vitamin-pp_100g' (historischer
    // Name "Vitamine PP"), 'niacin_100g' bleibt als Fallback.
    b3: mg(n['vitamin-pp_100g'] || n['niacin_100g']),
    b6: mg(n['vitamin-b6_100g']),
    b12: ug(n['vitamin-b12_100g']),
    folat: ug(n['folates_100g'] || n['vitamin-b9_100g']),
    eisen: mg(n['iron_100g']),
    zink: mg(n['zinc_100g']),
    mag: mg(n['magnesium_100g']),
    cal: mg(n['calcium_100g']),
    fiber: Math.round((n['fiber_100g'] || 0) * 10) / 10,
    jod: ug(n['iodine_100g']),
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
