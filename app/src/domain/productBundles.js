/**
 * productBundles.js
 *
 * NEU (01.09.2026) - Kombi-Präparate-Kategorien, ergänzend zu affiliateLinks.js
 * (dort ausschließlich Einzelnährstoffe). Hintergrund: Kundinnen/Kunden sollen
 * nicht 6+ Einzelprodukte kaufen müssen, wenn eine fachlich sinnvolle
 * Kombination existiert - recherchiert am 01.09.2026 (DGE, Verbraucherzentrale,
 * Apotheken Umschau, plus Abgleich mit den bestehenden Wechselwirkungen in
 * nutrientInteractions.js).
 *
 * WICHTIG - bewusst als EIGENE, NICHT verdrahtete Datei angelegt:
 *
 * 1. AFFILIATE-STATUS: affiliateLinks.js::AFFILIATE_LINKS_ENABLED steht aktuell
 *    auf false. Amazon PartnerNet verlangt für native Apps eine gesondert
 *    beantragte Zulassung (separate App-Partner-ID + Play-Store-URL + Prüfung).
 *    Nicole hat das am 20.07.2026 beantragt, die Bestätigung steht laut
 *    Kommentar dort noch aus. Kombi-Links aus dieser Datei dürfen in der APP
 *    erst aktiviert werden, wenn diese Bestätigung vorliegt - vorher laut
 *    Amazons eigener Dokumentation ein Verstoß mit Account-Sperr-Risiko.
 *
 * 2. WEBSITE ist davon NICHT betroffen: Für den Wellness Hub und die
 *    vitalmetric552-Website gilt die App-spezifische Zulassungspflicht nicht -
 *    dort kann der bestehende PartnerNet-Website-Tag ('vitalmetrics-21' laut
 *    affiliateLinks.js) sofort für Kombi-Links verwendet werden.
 *
 * 3. Update 02.09.2026: Alle 8 Bundles haben inzwischen einen echten Link
 *    (`amazonLink` + meist `productImage`, `status: 'link_vorhanden'`).
 *    'omega3_vitamin_e_regeneration' und 'basis_multi' wurden auf Nicoles
 *    Wunsch entfernt (kein passendes Kombiprodukt am Markt bzw. bewusst nicht
 *    beworben) - Omega-3 und Vitamin E laufen stattdessen als Einzelprodukte
 *    über partnerProductLinks.js. `getBundlesMissingLinks()` bleibt als
 *    Funktion für künftige neue Bundles ohne Link.
 *
 * Jede Kombination ist ausdrücklich eine ALLGEMEINE Ernährungsinformation,
 * KEINE individuelle oder medizinische Empfehlung - siehe BUNDLE_DISCLAIMER
 * unten und healthClaims.js (DISCLAIMER_FULL, PREFERRED_TERMS). Muss bei
 * jeder Anzeige sichtbar mitgegeben werden, analog zu TRADITIONAL_DISCLAIMER
 * in traditionalPerspectives.js.
 */

export const BUNDLE_DISCLAIMER =
  'Allgemeine Ernährungsinformation, keine individuelle oder medizinische Empfehlung. ' +
  'Ersetzt keine ärztliche oder ernährungstherapeutische Beratung - insbesondere vor ' +
  'längerfristiger Einnahme, bei bestehender Medikation oder Vorerkrankungen bitte ' +
  'ärztlichen oder apothekerlichen Rat einholen.';

// Zielgruppen - bewusst zusätzlich zu den vorhandenen refByGender-Angaben im
// Biomarker-Katalog, weil es hier um Content-/Produkt-Fokus geht, nicht um
// medizinische Referenzwerte.
export const TARGET_GROUPS = {
  general: 'Allgemein',
  women_cycle: 'Frauen / Menstruationszyklus',
  men: 'Männergesundheit',
  athletes: 'Sport & intensives Training',
  beauty: 'Haut, Haare & Nägel',
};

// Hinweis zu den Link-/Bild-Werten unten (ergänzt 02.09.2026, Nicoles
// Recherche): die href-Werte sind Nicoles eigene Kurzlink-Domain
// (link.amazon/…), kein offizielles amzn.to-PartnerNet-Format - unverändert
// so übernommen, wie geliefert. Bild-URLs sind Amazon-CDN-Thumbnails
// (images-eu.ssl-images-amazon.com, UL116/UL232 = kleine Kartengröße,
// nicht für großformatige Hero-Bilder gedacht).

/**
 * @typedef {Object} ProductBundle
 * @property {string} id
 * @property {string} title
 * @property {string[]} targetGroups - Keys aus TARGET_GROUPS
 * @property {string[]} nutrientIds - Biomarker-IDs aus biomarkerCatalog.json
 * @property {string} rationale - fachliche Begründung inkl. Quellenbezug
 * @property {string} searchQuery - Amazon-Suchbegriff (wie q in affiliateLinks.js)
 * @property {string|null} amazonLink - Nicoles Partnerlink zum Produkt (eigene Kurzlink-Domain)
 * @property {string} [amazonLinkAlt] - optionale gleichwertige Produktalternative
 * @property {string|null} productImage - Amazon-CDN-Thumbnail-URL fürs Produktbild
 * @property {'link_fehlt'|'link_vorhanden'} status
 */

/** @type {ProductBundle[]} */
export const PRODUCT_BUNDLES = [
  {
    id: 'd3_k2_magnesium',
    title: 'Vitamin D3 + K2 + Magnesium',
    targetGroups: ['general'],
    nutrientIds: ['vitamin_d', 'vitamin_k2', 'magnesium'],
    rationale:
      'Magnesium ist Cofaktor der Enzyme, die Vitamin D erst in seine aktive Form ' +
      'umwandeln; Vitamin K2 unterstützt, dass durch D mobilisiertes Calcium in die ' +
      'Knochen eingebaut wird. Deckt sich mit den bestehenden Einträgen ' +
      'vitamin_d/magnesium und vitamin_d/vitamin_k in nutrientInteractions.js. ' +
      'Hinweis Verbraucherzentrale: Zusatznutzen von K2 gilt als plausibel, ' +
      'wissenschaftlich aber noch nicht sauber belegt - im Text entsprechend vorsichtig formulieren.',
    searchQuery: 'Vitamin+D3+K2+Magnesium+Kombipraeparat',
    // 02.09.2026: Nicole hat kein reines D3+K2+Magnesium-Dreierprodukt
    // gefunden, dafür zwei D3+K2-Varianten (Tropfen/Kapseln) - Magnesium
    // separat bewerben (siehe magnesium in partnerProductLinks.js) oder als
    // "2 Produkte statt 3" kommunizieren, bis ein echtes Dreierprodukt da ist.
    amazonLink: 'https://link.amazon/A0hhuwAwP', // Vitamin D3 K2 hochdosiert (Kapseln)
    amazonLinkAlt: 'https://link.amazon/B06hXzeh2', // Vitamin D3 K2 Tropfen (Alternative)
    productImage: 'https://images-eu.ssl-images-amazon.com/images/I/71qIabVn1QL._AC_UL232_SR232,232_.jpg',
    status: 'link_vorhanden',
  },
  {
    id: 'b_komplex',
    title: 'B-Komplex (B1, B2, B3, B5, B6, B9, B12)',
    targetGroups: ['general'],
    nutrientIds: ['vitamin_b1', 'vitamin_b2', 'vitamin_b3', 'vitamin_b5', 'vitamin_b6', 'vitamin_b9', 'vitamin_b12'],
    rationale:
      'B6, B9 (Folat) und B12 sind laut nutrientInteractions.js gemeinsam am ' +
      'Homocystein-Abbau beteiligt. Ein Komplex bündelt, was sonst 5-7 Einzelkäufe ' +
      'wären, und deckt zugleich Vitamin B5 ab, für das es in affiliateLinks.js ' +
      'aktuell noch keinen eigenen Einzel-Link gibt.',
    searchQuery: 'Vitamin+B-Komplex+B1+B2+B6+B12+Kapseln',
    // 02.09.2026: Nicole hat für B1/B2/B3/B5/B6/B7/B9/B12 durchgängig denselben
    // Link/dasselbe Bild geliefert -> eindeutig EIN B-Komplex-Produkt, das alle
    // acht abdeckt (nicht acht Einzelprodukte).
    amazonLink: 'https://link.amazon/B00cditwc',
    productImage: 'https://images-eu.ssl-images-amazon.com/images/I/71Hhwku2mFL._AC_UL116_SR116,116_.jpg',
    status: 'link_vorhanden',
  },
  {
    id: 'eisen_vitamin_c_zyklus',
    title: 'Eisen + Vitamin C (Zyklus-Fokus)',
    targetGroups: ['women_cycle'],
    nutrientIds: ['eisen', 'vitamin_c'],
    rationale:
      'Menstruierende Frauen haben laut DGE einen erhöhten Eisenbedarf (16 mg/Tag ' +
      'gegenüber 11 mg ohne Menstruation, wegen des monatlichen Blutverlusts). ' +
      'Vitamin C verbessert zusätzlich die Aufnahme von pflanzlichem Eisen. ' +
      'Inhaltlich bereits in cycle.js (CYCLE_NUTRIENTS.menstruation) und im ' +
      'Wellness Hub (pms-zyklus.html) verankert - dort aber bisher ohne ' +
      'verknüpftes Kombiprodukt/Link. Größte kurzfristige Lücke.',
    searchQuery: 'Eisen+Vitamin+C+Kombipraeparat+Frauen',
    amazonLink: 'https://link.amazon/B0azEpW7X',
    productImage: 'https://images-eu.ssl-images-amazon.com/images/I/71Fn8mvV2OL._AC_UL232_SR232,232_.jpg',
    status: 'link_vorhanden',
  },
  {
    id: 'jod_selen',
    title: 'Jod + Selen (Schilddrüse)',
    targetGroups: ['general'],
    nutrientIds: ['jod', 'selen'],
    rationale:
      'Beide Spurenelemente wirken laut nutrientInteractions.js gemeinsam bei der ' +
      'Umwandlung von Schilddrüsenhormon (T4 zu T3) - passt zum bereits ' +
      'getrackten TSH-Wert (Kategorie Laborwerte).',
    searchQuery: 'Jod+Selen+Kombipraeparat+Schilddruese',
    amazonLink: 'https://link.amazon/B0aMWVgAy',
    productImage: 'https://images-eu.ssl-images-amazon.com/images/I/51APimMUo+L._AC_UL116_SR116,116_.jpg',
    status: 'link_vorhanden',
  },
  {
    id: 'zink_selen_maenner',
    title: 'Zink + Selen (+ Magnesium) - Männergesundheit',
    targetGroups: ['men'],
    nutrientIds: ['zink', 'selen', 'magnesium'],
    rationale:
      'Komplett neue Zielgruppen-Kategorie: Der Wellness Hub deckt aktuell nur ' +
      'PMS/Zyklus, Wechseljahre und einen allgemeinen Morgenroutine-Artikel ab - ' +
      'kein Männer-Pendant. Zink ist an der Testosteron-Synthese in den ' +
      'Leydig-Zellen beteiligt, Selen an der Spermienbildung. Passt zum bereits ' +
      'getrackten Testosteron-Wert (Kategorie Longevity), der bislang ohne ' +
      'begleitenden Content oder Produktbezug ist.',
    searchQuery: 'Zink+Selen+Magnesium+Kapseln+Maenner',
    // 02.09.2026: Nicole hat ein reines Zink+Selen-Produkt gefunden (kein
    // Bild verfügbar laut ihrer Recherche) - deckt Zink+Selen ab, aber ohne
    // Magnesium. Für den vollen Dreier-Stack Magnesium separat bewerben
    // (siehe magnesium_bisglycinat in partnerProductLinks.js) oder als
    // "Zink + Selen für Männergesundheit" ohne Magnesium-Versprechen
    // kommunizieren, bis ein echtes Dreierprodukt gefunden ist. Die zuvor
    // gefundene Biotin+Selen+Zink-Beauty-Variante (siehe
    // biotin_selen_zink_beauty unten) bleibt als Beauty-Alternative bestehen.
    amazonLink: 'https://link.amazon/B04ocZta1',
    productImage: null, // kein Produktbild verfügbar (Stand 02.09.2026)
    status: 'link_vorhanden',
  },
  {
    id: 'sport_elektrolyte',
    title: 'Elektrolyte (Magnesium u. a.) - Sport/Ausdauer',
    targetGroups: ['athletes'],
    nutrientIds: ['magnesium'],
    rationale:
      'Zweite komplett neue Zielgruppen-Kategorie, bisher weder im Wellness Hub ' +
      'noch in affiliateLinks.js abgebildet. Magnesium und Elektrolyte gehen bei ' +
      'starkem Schweißverlust verloren (vgl. bereits vorhandenen Sommer-Hinweis in ' +
      'seasonalTips.js, Monat 7); B-Vitamine sind am Energiestoffwechsel beteiligt. ' +
      'Passt zur bereits bestehenden Stufe ACTIVITY_LEVELS.sehr_aktiv in ' +
      'energyNeeds.js (körperlich harte Arbeit/Leistungssport), die dort bisher ' +
      'nur für Kalorien/Protein genutzt wird, nicht für Mikronährstoffe. ' +
      'Wichtig: Fachliteratur betont Labordiagnostik vor Supplementierung statt ' +
      'pauschaler Empfehlung - Formulierung entsprechend zurückhaltend halten.',
    searchQuery: 'Magnesium+Elektrolyte+Kapseln+Sport+Ausdauer',
    // 02.09.2026: Nicole hat "Elektrolyte PUR" gefunden (reines Elektrolyt-
    // Pulver, zuckerfrei, keto-geeignet) - deckt den Elektrolyt-Teil ab.
    // Enthält keine B-Vitamine; für den vollen Stack ggf. mit
    // b_komplex_alle (partnerProductLinks.js) kombinieren/gegenseitig bewerben.
    amazonLink: 'https://link.amazon/B0iNEPUDe',
    productImage: 'https://images-eu.ssl-images-amazon.com/images/I/71lPKjOfCVL._AC_UL232_SR232,232_.jpg',
    status: 'link_vorhanden',
  },
  {
    id: 'calcium_vitamin_d',
    title: 'Calcium + Vitamin D',
    targetGroups: ['general'],
    nutrientIds: ['calcium', 'vitamin_d'],
    rationale:
      'Vitamin D ist laut nutrientInteractions.js Voraussetzung dafür, dass der ' +
      'Körper Calcium aus der Nahrung überhaupt aufnehmen kann - klassisches, gut ' +
      'belegtes Kombipaar (u. a. relevant für die Lutealphase, vgl. ' +
      'CYCLE_NUTRIENTS.luteal in cycle.js: "Calcium mildert PMS-Symptome nachweislich").',
    searchQuery: 'Calcium+Vitamin+D+Kombipraeparat',
    amazonLink: 'https://link.amazon/B09UYNugT',
    productImage: 'https://images-eu.ssl-images-amazon.com/images/I/8195sFu3iWL._AC_UL232_SR232,232_.jpg',
    status: 'link_vorhanden',
  },
  {
    id: 'biotin_selen_zink_beauty',
    title: 'Biotin (hochdosiert) + Selen + Zink - Haare, Haut & Nägel',
    targetGroups: ['beauty', 'women_cycle'],
    nutrientIds: ['biotin', 'selen', 'zink'],
    rationale:
      'NEU gefunden (02.09.2026), passt inhaltlich zum bereits bestehenden ' +
      'skinVitality.js-Modul (Haut-Tracking) und zur clean-girl-morgenroutine.html ' +
      'im Wellness Hub - dort bisher kein passendes Produkt verlinkt. Biotin ist ' +
      'einer der zugkräftigsten Beauty-Suchbegriffe im NEM-Markt.',
    searchQuery: 'Biotin+Selen+Zink+Haare+Haut+Naegel',
    amazonLink: 'https://link.amazon/B0aFRFWbr',
    productImage: 'https://images-eu.ssl-images-amazon.com/images/I/715f5+brKfL._AC_UL116_SR116,116_.jpg',
    status: 'link_vorhanden',
  },
];

/**
 * @param {string} groupKey - Key aus TARGET_GROUPS
 * @returns {ProductBundle[]}
 */
export function getBundlesForTargetGroup(groupKey) {
  return PRODUCT_BUNDLES.filter(b => b.targetGroups.includes(groupKey));
}

/**
 * @param {string} id
 * @returns {ProductBundle|null}
 */
export function getBundleById(id) {
  return PRODUCT_BUNDLES.find(b => b.id === id) || null;
}

/**
 * @returns {ProductBundle[]} Bundles, denen Nicole noch einen echten
 * PartnerNet-Link hinzufügen muss.
 */
export function getBundlesMissingLinks() {
  return PRODUCT_BUNDLES.filter(b => b.status === 'link_fehlt');
}
