/**
 * quickFoods.js – WellANNI 2.2
 *
 * "Oder einfach zwischendurch": alltägliche Lebensmittel mit üblicher
 * Portion, die einen Kernwert spürbar voranbringen – für alle, die nicht
 * extra ein Rezept kochen möchten.
 *
 * Jeder Eintrag ist gegen den Bundeslebensmittelschlüssel (BLS 4.0)
 * nachgerechnet: eine Portion liefert mindestens 15 % der Referenz (bei
 * Eisen mindestens 12 %, weil es kaum Lebensmittel mit mehr gibt). Das prüft
 * tests/domain/quickFoods.test.js. `diet`: 'vegan' | 'veg' | 'meat'.
 *
 * Vitamin D fehlt bewusst: Über Essen ist es kaum zu schaffen, dafür gibt es
 * einen eigenen Hinweis (coreNutrients.js vitaminDNote).
 */
export const QUICK_FOODS = {
  protein: [
    { label: 'Magerquark (150 g)', bls: 'm713100', grams: 150, diet: 'veg' },
    { label: 'ein Becher Skyr (150 g)', bls: 'm710100', grams: 150, diet: 'veg' },
    { label: 'zwei gekochte Eier', bls: 'e111132', grams: 120, diet: 'veg' },
    { label: 'Tofu (100 g)', bls: 'h861000', grams: 100, diet: 'vegan' },
    { label: 'Linsen (150 g gekocht)', bls: 'h730132', grams: 150, diet: 'vegan' },
    { label: 'Thunfisch aus der Dose (80 g)', bls: 't121902', grams: 80, diet: 'meat' },
  ],
  fiber: [
    { label: 'Kichererbsen (150 g gekocht)', bls: 'g770432', grams: 150, diet: 'vegan' },
    { label: 'Linsen (150 g gekocht)', bls: 'h730132', grams: 150, diet: 'vegan' },
    { label: 'zwei Scheiben Roggenvollkornbrot', bls: 'b121000', grams: 100, diet: 'vegan' },
    { label: 'eine Schüssel Haferflocken (50 g)', bls: 'c133000', grams: 50, diet: 'vegan' },
    { label: 'eine Birne', bls: 'f130100', grams: 170, diet: 'vegan' },
    { label: 'Rosenkohl (150 g)', bls: 'g332100', grams: 150, diet: 'vegan' },
  ],
  eisen: [
    { label: 'Linsen (150 g gekocht)', bls: 'h730132', grams: 150, diet: 'vegan' },
    { label: 'Kichererbsen (150 g gekocht)', bls: 'g770432', grams: 150, diet: 'vegan' },
    { label: 'eine Schüssel Haferflocken (50 g)', bls: 'c133000', grams: 50, diet: 'vegan' },
    { label: 'Rindfleisch (120 g)', bls: 'u131182', grams: 120, diet: 'meat' },
  ],
  cal: [
    { label: 'ein Stück Emmentaler (30 g)', bls: 'm304600', grams: 30, diet: 'veg' },
    { label: 'ein Glas Milch', bls: 'm111300', grams: 250, diet: 'veg' },
    { label: 'ein Becher Joghurt (150 g)', bls: 'm141300', grams: 150, diet: 'veg' },
    { label: 'Grünkohl (150 g)', bls: 'g322100', grams: 150, diet: 'vegan' },
    { label: 'ein Glas Sojadrink mit Calcium', bls: 'h841400', grams: 250, diet: 'vegan' },
  ],
  mag: [
    { label: 'eine Handvoll Kürbiskerne (30 g)', bls: 'h310100', grams: 30, diet: 'vegan' },
    { label: 'eine Handvoll Cashewkerne (30 g)', bls: 'h170100', grams: 30, diet: 'vegan' },
    { label: 'eine Handvoll Mandeln (30 g)', bls: 'h210100', grams: 30, diet: 'vegan' },
    { label: 'eine Schüssel Haferflocken (50 g)', bls: 'c133000', grams: 50, diet: 'vegan' },
    { label: 'zwei Scheiben Roggenvollkornbrot', bls: 'b121000', grams: 100, diet: 'vegan' },
  ],
  folat: [
    { label: 'Grünkohl (150 g)', bls: 'g322100', grams: 150, diet: 'vegan' },
    { label: 'Spinat (150 g)', bls: 'g211100', grams: 150, diet: 'vegan' },
    { label: 'Rosenkohl (150 g)', bls: 'g332100', grams: 150, diet: 'vegan' },
    { label: 'Brokkoli (200 g)', bls: 'g312100', grams: 200, diet: 'vegan' },
    { label: 'Feldsalat (80 g)', bls: 'g104100', grams: 80, diet: 'vegan' },
    { label: 'Linsen (150 g gekocht)', bls: 'h730132', grams: 150, diet: 'vegan' },
  ],
  b12: [
    { label: 'zwei gekochte Eier', bls: 'e111132', grams: 120, diet: 'veg' },
    { label: 'ein Glas Milch', bls: 'm111300', grams: 250, diet: 'veg' },
    { label: 'ein Stück Emmentaler (30 g)', bls: 'm304600', grams: 30, diet: 'veg' },
    { label: 'Lachs (125 g)', bls: 't410100', grams: 125, diet: 'meat' },
    { label: 'ein Glas Sojadrink mit Vitaminen', bls: 'h841400', grams: 250, diet: 'vegan' },
  ],
};

/** Kurzer Alltagstipp je Kernwert (nur zugelassene, allgemeine Aussagen). */
export const QUICK_TIPS = {
  eisen: 'Tipp: Eisen aus Pflanzen wird mit Vitamin C besser aufgenommen – etwa mit Paprika oder einer Orange dazu.',
  fiber: 'Tipp: Ballaststoffe langsam steigern und genug dazu trinken.',
};

/**
 * Bis zu `n` Lebensmittel passend zur Ernährungsform, täglich wechselnd.
 * @param {string|null} diet Ernährungsform aus dem Wochenplan
 */
export function quickFoodsFor(key, diet = null, isoDate = new Date().toISOString().slice(0, 10), n = 3) {
  let list = QUICK_FOODS[key] || [];
  if (diet === 'vegetarisch') list = list.filter(f => f.diet !== 'meat');
  if (!list.length) return [];
  const start = Math.floor(new Date(isoDate + 'T12:00:00').getTime() / 86400000) % list.length;
  return Array.from({ length: Math.min(n, list.length) }, (_, i) => list[(start + i) % list.length]);
}
