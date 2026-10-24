/**
 * partnerProductLinks.js
 *
 * NEU (02.09.2026) - von Nicole recherchierte, ECHTE Amazon-Partnerlinks zu
 * konkreten Produktseiten (inkl. Produktbild), als Ergänzung zu:
 * - affiliateLinks.js: dort SUPPLEMENT_LINKS/TEST_LINKS als generische
 *   Amazon-SUCHERGEBNIS-Links (amazon.de/s?k=...), kein Produktbild.
 * - productBundles.js: dort die Mehr-Nährstoff-Kombipräparate.
 *
 * Diese Datei deckt Einzelprodukte ab: ein Nährstoff pro Produkt (plus ein
 * paar kleine Zweier-Kombis wie "Magnesium + B6", die nicht groß genug für
 * ein eigenes Bundle in productBundles.js sind) sowie Lifestyle-Produkte
 * ohne direkten Nährstoffbezug, die zu bestehenden Content-Themen passen
 * (Zyklus-Schmerzen, Beauty-Routine).
 *
 * WICHTIG - dieselbe Einschränkung wie in productBundles.js:
 * 1. affiliateLinks.js::AFFILIATE_LINKS_ENABLED steht auf false (Amazon-
 *    PartnerNet-Zulassung für die native App seit 20.07.2026 beantragt,
 *    Bestätigung steht aus). Diese Links dürfen in der APP erst aktiviert
 *    werden, wenn die Bestätigung da ist - für die WEBSITE gilt das nicht.
 * 2. Die href-Werte sind Nicoles eigene Kurzlink-Domain (link.amazon/…),
 *    kein offizielles amzn.to-PartnerNet-Format - unverändert übernommen.
 * 3. Produktbilder sind kleine Amazon-CDN-Thumbnails (UL116/UL232), gedacht
 *    für Karten/Listen, nicht für großformatige Hero-Bilder.
 * 4. Allgemeine Ernährungsinformation, keine individuelle oder medizinische
 *    Empfehlung - siehe healthClaims.js (DISCLAIMER_FULL) und
 *    productBundles.js (BUNDLE_DISCLAIMER), gilt hier genauso.
 *
 * Stand 02.09.2026 sind längst nicht alle 48 Katalog-Nährstoffe abgedeckt -
 * offene Lücken stehen unten in OPEN_RESEARCH_ITEMS.
 */

/**
 * @typedef {Object} PartnerProduct
 * @property {string} id
 * @property {string} name
 * @property {string} link
 * @property {string} image
 * @property {string[]} nutrientIds - Biomarker-IDs aus biomarkerCatalog.json (leer bei Lifestyle-Produkten)
 * @property {string} [note]
 */

// ── Einzel-Supplemente (ein Nährstoff pro Produkt, ggf. + kleiner Zweier-Kombi) ──
/** @type {PartnerProduct[]} */
export const SUPPLEMENT_PRODUCTS = [
  { id: 'magnesium_bisglycinat', name: 'Magnesium Bisglycinat Kapseln hochdosiert', link: 'https://link.amazon/A0j0BqTV2', image: 'https://images-eu.ssl-images-amazon.com/images/I/71DkkYPtzVL._AC_UL232_SR232,232_.jpg', nutrientIds: ['magnesium'] },
  { id: 'magnesium_b6', name: 'Magnesium + Vitamin B6 Kapseln', link: 'https://link.amazon/B00R9vKgr', image: 'https://images-eu.ssl-images-amazon.com/images/I/51xVw43y+cL._AC_UL232_SR232,232_.jpg', nutrientIds: ['magnesium', 'vitamin_b6'], note: 'Kleine Zweier-Kombi, v. a. für Lutealphase/PMS relevant (siehe CYCLE_NUTRIENTS.luteal in cycle.js).' },
  { id: 'vitamin_d3_kapseln', name: 'Vitamin D3 Kapseln hochdosiert', link: 'https://link.amazon/B0hkKXw28', image: 'https://images-eu.ssl-images-amazon.com/images/I/71qIabVn1QL._AC_UL232_SR232,232_.jpg', nutrientIds: ['vitamin_d'], note: 'Reines D3 ohne K2 - für alle, die K2 gesondert oder gar nicht wollen.' },
  { id: 'omega3_fischoel', name: 'Omega-3 Fischöl hochdosiert', link: 'https://link.amazon/B0j10dkj8', image: 'https://images-eu.ssl-images-amazon.com/images/I/61IsaGoJEwL._AC_UL232_SR232,232_.jpg', nutrientIds: ['omega3'] },
  { id: 'omega3_algenoel', name: 'Omega-3 Algenöl (vegan)', link: 'https://link.amazon/A07eD9j5U', image: 'https://images-eu.ssl-images-amazon.com/images/I/71HFUEuMrjL._AC_UL232_SR232,232_.jpg', nutrientIds: ['omega3'], note: 'Vegane Alternative zu Fischöl.' },
  { id: 'kollagen_peptide', name: 'Kollagen Peptide Pulver', link: 'https://link.amazon/B02ewOcGx', image: 'https://images-eu.ssl-images-amazon.com/images/I/61du234m0BL._AC_UL232_SR232,232_.jpg', nutrientIds: [], note: 'Kein Katalog-Biomarker, aber etabliertes Beauty/Longevity-Produkt - passt zu skinVitality.js.' },
  { id: 'biotin_hochdosiert', name: 'Biotin Kapseln hochdosiert', link: 'https://link.amazon/B08kxyf1v', image: 'https://images-eu.ssl-images-amazon.com/images/I/71JSBtoBuoL._AC_UL116_SR116,116_.jpg', nutrientIds: ['vitamin_b7'] },
  { id: 'vitamin_c_hochdosiert', name: 'Vitamin C hochdosiert Kapseln', link: 'https://link.amazon/A0eLUUxFy', image: 'https://images-eu.ssl-images-amazon.com/images/I/71O6TM20atL._AC_UL232_SR232,232_.jpg', nutrientIds: ['vitamin_c'] },
  { id: 'vitamin_c_kapseln', name: 'Vitamin C Kapseln', link: 'https://link.amazon/A066Zq0kG', image: 'https://images-eu.ssl-images-amazon.com/images/I/71O6TM20atL._AC_UL116_SR116,116_.jpg', nutrientIds: ['vitamin_c'], note: 'Zweite Variante - ggf. mit vitamin_c_hochdosiert abgleichen, ob beide nötig sind.' },
  { id: 'acerola_vitamin_c', name: 'Acerola Vitamin C (natürliche Quelle)', link: 'https://link.amazon/B0hYGEAbw', image: 'https://images-eu.ssl-images-amazon.com/images/I/71pc+om7nCL._AC_UL232_SR232,232_.jpg', nutrientIds: ['vitamin_c'], note: 'Natürliche Alternative zu synthetischer Ascorbinsäure - guter Content-Winkel ("clean").' },
  { id: 'zink_hochdosiert', name: 'Zink Kapseln hochdosiert', link: 'https://link.amazon/A07PkVW2Z', image: 'https://images-eu.ssl-images-amazon.com/images/I/713JpTJfZWL._AC_UL232_SR232,232_.jpg', nutrientIds: ['zink'] },
  { id: 'vitamin_a', name: 'Vitamin A Kapseln', link: 'https://link.amazon/B06hDlrP7', image: 'https://images-eu.ssl-images-amazon.com/images/I/71q0R4EbjCL._AC_UL116_SR116,116_.jpg', nutrientIds: ['vitamin_a'] },
  { id: 'vitamin_e', name: 'Vitamin E Kapseln', link: 'https://link.amazon/B0a7ltoWh', image: 'https://images-eu.ssl-images-amazon.com/images/I/71n0yobnoWL._AC_UL116_SR116,116_.jpg', nutrientIds: ['vitamin_e'] },
  { id: 'vitamin_k', name: 'Vitamin K Kapseln', link: 'https://link.amazon/B03SrLLEt', image: 'https://images-eu.ssl-images-amazon.com/images/I/71-sHVX3BIL._AC_UL116_SR116,116_.jpg', nutrientIds: ['vitamin_k'], note: 'Katalog/nutrientInteractions.js unterscheiden aktuell nicht K1/K2 - Produktbeschreibung vor Bewerbung prüfen, welche Form enthalten ist.' },
  {
    id: 'b_komplex_alle',
    name: 'Vitamin B-Komplex (B1, B2, B3, B5, B6, B7, B9, B12)',
    link: 'https://link.amazon/B00cditwc',
    image: 'https://images-eu.ssl-images-amazon.com/images/I/71Hhwku2mFL._AC_UL116_SR116,116_.jpg',
    nutrientIds: ['vitamin_b1', 'vitamin_b2', 'vitamin_b3', 'vitamin_b5', 'vitamin_b6', 'vitamin_b7', 'vitamin_b9', 'vitamin_b12'],
    note: 'Identisch mit dem b_komplex-Bundle in productBundles.js - hier zusätzlich einzeln gelistet, falls pro Nährstoffseite in der App verlinkt werden soll.',
  },
  { id: 'eisen_kapseln', name: 'Eisen Kapseln', link: 'https://link.amazon/B00nxDgnp', image: 'https://images-eu.ssl-images-amazon.com/images/I/71Fn8mvV2OL._AC_UL232_SR232,232_.jpg', nutrientIds: ['eisen'] },
];

// ── Selbsttests / Heimtest-Kits ──
/** @type {PartnerProduct[]} */
export const SELFTEST_PRODUCTS = [
  { id: 'test_vitamin_d', name: 'Vitamin D Selbsttest', link: 'https://link.amazon/B0ek9IF65', image: 'https://images-eu.ssl-images-amazon.com/images/I/61-dHWd5TGL._AC_UL232_SR232,232_.jpg', nutrientIds: ['vitamin_d'] },
  { id: 'test_eisen_ferritin', name: 'Eisen/Ferritin Selbsttest', link: 'https://link.amazon/B004XQ1me', image: 'https://images-eu.ssl-images-amazon.com/images/I/51XAPjPK35L._AC_UL116_SR116,116_.jpg', nutrientIds: ['eisen', 'ferritin'] },
  { id: 'test_tsh', name: 'Schilddrüsen-Selbsttest (TSH)', link: 'https://link.amazon/B0cWnf8rE', image: 'https://images-eu.ssl-images-amazon.com/images/I/61ePheXooJL._AC_UL232_SR232,232_.jpg', nutrientIds: ['tsh'] },
  {
    id: 'test_hormon_frau',
    name: 'Hormon-Selbsttest Frau',
    link: 'https://link.amazon/B0akWBgLV',
    image: 'https://images-eu.ssl-images-amazon.com/images/I/61rKWNVojyL._AC_UL232_SR232,232_.jpg',
    nutrientIds: [],
    note: 'Kein Katalog-Biomarker, aber passt inhaltlich zu cycle.js/pms-zyklus.html und wechseljahre.html. Vor Bewerbung prüfen: welche Hormone genau (Zyklus vs. Wechseljahre), Aussagekraft von Heim-Hormontests ist umstritten - Formulierung entsprechend zurückhaltend halten (vgl. TRADITIONAL_DISCLAIMER-Vorsicht in traditionalPerspectives.js).',
  },
];

// ── Lifestyle-Produkte ohne direkten Nährstoffbezug, aber passend zu bestehenden Content-Themen ──
/** @type {PartnerProduct[]} */
export const LIFESTYLE_PRODUCTS = [
  { id: 'waermekissen_unterleib', name: 'Wärmekissen Unterleib', link: 'https://link.amazon/B0cbA02uh', image: 'https://images-eu.ssl-images-amazon.com/images/I/71HRAk4MUPL._AC_UL232_SR232,232_.jpg', nutrientIds: [], relatedContent: 'cycle.js / pms-zyklus.html (Menstruationsphase, Krämpfe)' },
  { id: 'waermflasche', name: 'Wärmflasche', link: 'https://link.amazon/B04CoCccK', image: 'https://images-eu.ssl-images-amazon.com/images/I/A14LCtVpsPL._AC_UL232_SR232,232_.jpg', nutrientIds: [], relatedContent: 'cycle.js / pms-zyklus.html (Menstruationsphase, Krämpfe)' },
  { id: 'gua_sha_set', name: 'Gua Sha Set', link: 'https://link.amazon/B08Z1bG3I', image: 'https://images-eu.ssl-images-amazon.com/images/I/71U9iI+HNPL._AC_UL116_SR116,116_.jpg', nutrientIds: [], relatedContent: 'skinVitality.js / clean-girl-morgenroutine.html' },
  { id: 'jade_roller', name: 'Jade Roller Gesicht', link: 'https://link.amazon/B074QEoVA', image: 'https://images-eu.ssl-images-amazon.com/images/I/71byv-hAWZL._AC_UL232_SR232,232_.jpg', nutrientIds: [], relatedContent: 'skinVitality.js / clean-girl-morgenroutine.html' },
  { id: 'matcha_pulver', name: 'Matcha Pulver Bio', link: 'https://link.amazon/B05qk2vfn', image: 'https://images-eu.ssl-images-amazon.com/images/I/51tfSD5FnqL._AC_UL116_SR116,116_.jpg', nutrientIds: [], relatedContent: 'clean-girl-morgenroutine.html' },
  { id: 'greens_powder', name: 'Greens Powder', link: 'https://link.amazon/B0flLYN4r', image: 'https://images-eu.ssl-images-amazon.com/images/I/51ZxxYsUAiL._AC_UL116_SR116,116_.jpg', nutrientIds: [], relatedContent: 'clean-girl-morgenroutine.html / allgemeine Wellness-Positionierung' },
];

/**
 * Katalog-Nährstoffe/Marker, für die Nicole am 02.09.2026 noch KEIN passendes
 * Produkt gefunden hat - zum Abhaken bei der nächsten Recherche-Runde.
 * (Jod, Zink und Selen sind einzeln offen, obwohl sie in Bundles
 * vorkommen - für Nährstoffseiten in der App braucht es ggf. trotzdem
 * Einzel-Links.)
 */
export const OPEN_RESEARCH_ITEMS = [
  'vitamin_a_selbsttest', // Vitamin A Selbsttest - selten am Markt, ggf. gar nicht verfügbar
  'jod', 'kupfer', 'mangan', 'chrom', 'molybdaen', 'fluorid',
  'omega3_index_test', 'homocystein_test',
  'coq10', 'calcium_einzeln',
  'zink_selen_magnesium_maennergesundheit', // siehe productBundles.js::zink_selen_maenner
];

/** @returns {PartnerProduct[]} */
export function getSupplementsForNutrient(nutrientId) {
  return SUPPLEMENT_PRODUCTS.filter(p => p.nutrientIds.includes(nutrientId));
}

/** @returns {PartnerProduct|null} */
export function getSelfTestForNutrient(nutrientId) {
  return SELFTEST_PRODUCTS.find(p => p.nutrientIds.includes(nutrientId)) || null;
}
