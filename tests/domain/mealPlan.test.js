import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generatePlan, resolvePlan, buildShoppingList, scaleIngredients, getUnderCoveredTags, getDayTagCoverage, recipeMatchesIntolerance, filterByIntolerances, INTOLERANCE_LABELS, getEligiblePool, setDaySlot, setPin } from '../../app/src/domain/mealPlan.js';

const recipes = [
  { id: 'r1', title: 'Rührei mit Spinat', category: 'vegetarisch', mealType: 'breakfast', tags: ['vitamin_k'], ingredients: ['3 Eier', '300 g Spinat'], steps: [] },
  { id: 'r2', title: 'Linsen-Curry', category: 'vegetarisch', mealType: 'lunch', tags: ['eisen'], ingredients: ['200 g Linsen', '1 Zwiebel, 2 Knoblauchzehen'], steps: [] },
  { id: 'r3', title: 'Quinoa-Bowl', category: 'vegetarisch', mealType: 'lunch', tags: ['magnesium'], ingredients: ['150 g Quinoa', '1 Zwiebel, 2 Knoblauchzehen'], steps: [] },
  { id: 'r4', title: 'Lachs-Pfanne', category: 'fleisch_fisch', mealType: 'lunch', tags: ['vitamin_d'], ingredients: ['300 g Lachs'], steps: [] },
];

test('generatePlan: liefert 7 Tage mit Frühstück/Mittag/Abend', () => {
  const plan = generatePlan(recipes, 'vegetarisch', '2026-07-20');
  assert.equal(plan.days.length, 7);
  assert.equal(plan.category, 'vegetarisch');
  for (const day of plan.days) {
    assert.ok(day.breakfast);
    assert.ok(day.lunch);
    assert.ok(day.dinner);
  }
});

test('generatePlan: filtert nach Kategorie (keine fleisch_fisch-Rezepte im vegetarischen Plan)', () => {
  const plan = generatePlan(recipes, 'vegetarisch', '2026-07-20');
  const usedIds = plan.days.flatMap(d => [d.breakfast, d.lunch, d.dinner]);
  assert.ok(!usedIds.includes('r4'));
});

test('resolvePlan: loest Rezept-IDs zu vollen Objekten auf', () => {
  const plan = generatePlan(recipes, 'vegetarisch', '2026-07-20');
  const resolved = resolvePlan(plan, recipes);
  assert.ok(resolved.days[0].breakfastRecipe.title);
});

test('buildShoppingList: summiert gleiche Zutat+Einheit ueber die Woche', () => {
  const plan = { weekStart: '2026-07-20', category: 'vegetarisch', days: [
    { date: '2026-07-20', breakfastRecipe: recipes[0], lunchRecipe: recipes[1], dinnerRecipe: null },
    { date: '2026-07-21', breakfastRecipe: recipes[0], lunchRecipe: null, dinnerRecipe: null },
  ] };
  const list = buildShoppingList(plan);
  const eggs = list.find(i => i.label.includes('Eier'));
  assert.ok(eggs);
  assert.equal(eggs.label, '6 Eier'); // 3+3 Eier ueber beide Tage summiert
});

test('buildShoppingList: nicht-numerische Zutaten werden dedupliziert, nicht summiert', () => {
  const plan = { weekStart: '2026-07-20', category: 'vegetarisch', days: [
    { date: '2026-07-20', breakfastRecipe: null, lunchRecipe: recipes[1], dinnerRecipe: recipes[2] },
  ] };
  const list = buildShoppingList(plan);
  const zwiebeln = list.filter(i => i.label.includes('Zwiebel'));
  assert.equal(zwiebeln.length, 1); // nur einmal gelistet, nicht doppelt
});

test('buildShoppingList: Bugfix Portionsskalierung - Rezept mit 4 Portionen wird auf 1 Person herunterskaliert', () => {
  const rezept4Portionen = { title: 'Rindfleisch-Eintopf', servings: 4, ingredients: ['800 g Rindfleisch'], steps: [] };
  const plan = { weekStart: '2026-07-20', category: 'fleisch_fisch', days: [
    { date: '2026-07-20', breakfastRecipe: null, lunchRecipe: null, dinnerRecipe: rezept4Portionen },
  ] };
  const list = buildShoppingList(plan, 1); // Zielportion: 1 Person
  const rind = list.find(i => i.label.includes('Rindfleisch'));
  assert.ok(rind);
  assert.equal(rind.label, '200 g Rindfleisch'); // 800g / 4 Portionen = 200g fuer 1 Person
});

test('buildShoppingList: Bugfix Portionsskalierung - targetServings=2 skaliert entsprechend', () => {
  const rezept4Portionen = { title: 'Rindfleisch-Eintopf', servings: 4, ingredients: ['800 g Rindfleisch'], steps: [] };
  const plan = { weekStart: '2026-07-20', category: 'fleisch_fisch', days: [
    { date: '2026-07-20', breakfastRecipe: null, lunchRecipe: null, dinnerRecipe: rezept4Portionen },
  ] };
  const list = buildShoppingList(plan, 2);
  const rind = list.find(i => i.label.includes('Rindfleisch'));
  assert.equal(rind.label, '400 g Rindfleisch'); // 800g / 4 * 2 = 400g
});

test('buildShoppingList: Bugfix Salz/Pfeffer - "Salz" und "1 Prise Salz" werden zu einem Eintrag zusammengefuehrt', () => {
  const rezeptBareSalz = { title: 'A', servings: 1, ingredients: ['Salz, Pfeffer'], steps: [] };
  const rezeptPriseSalz = { title: 'B', servings: 1, ingredients: ['1 Prise Salz'], steps: [] };
  const plan = { weekStart: '2026-07-20', category: 'vegetarisch', days: [
    { date: '2026-07-20', breakfastRecipe: rezeptBareSalz, lunchRecipe: rezeptPriseSalz, dinnerRecipe: null },
  ] };
  const list = buildShoppingList(plan);
  const salz = list.filter(i => i.label.toLowerCase().includes('salz'));
  assert.equal(salz.length, 1, 'Salz sollte nur einmal in der Liste stehen, nicht als zwei Eintraege');
  assert.equal(salz[0].label, 'Salz');
});

test('scaleIngredients: Bugfix Detailansicht - skaliert Zutatenmengen wie die Einkaufsliste', () => {
  const ingredients = ['2 Lachsfilets (je 150 g)', '300 g Spinat', 'Salz, Pfeffer'];
  const scaled = scaleIngredients(ingredients, 2, 1); // Rezept fuer 2, Ziel: 1 Person
  assert.equal(scaled[0], '1 Lachsfilets (je 150 g)');
  assert.equal(scaled[1], '150 g Spinat');
  assert.equal(scaled[2], 'Salz, Pfeffer'); // mengenlose Zutaten bleiben unveraendert
});

test('scaleIngredients: Faktor 1 (Zielportionen = Rezeptportionen) laesst Zeilen unveraendert', () => {
  const ingredients = ['3 Eier', '1 Prise Salz'];
  const scaled = scaleIngredients(ingredients, 1, 1);
  assert.deepEqual(scaled, ingredients);
});

test('getUnderCoveredTags: erkennt Naehrstoff unter 70% Referenz', () => {
  const dgeRef = { vit_c: { ref: 110 }, eisen: { ref: 14 } };
  const last7 = [
    { vit_c: 20, eisen: 14 }, // vit_c stark unter Referenz
    { vit_c: 25, eisen: 14 },
  ];
  const tags = getUnderCoveredTags(last7, dgeRef, 70);
  assert.ok(tags.includes('vitamin_c'));
  assert.ok(!tags.includes('eisen')); // eisen ist genau 100% gedeckt
});

test('getUnderCoveredTags: leeres Array ohne Daten', () => {
  assert.deepEqual(getUnderCoveredTags([], { vit_c: { ref: 110 } }), []);
});

test('getUnderCoveredTags: leeres Array bei komplett fehlendem Tracking (0 ist kein Signal, sondern kein Eintrag) - Erstnutzerinnen-Bugfix', () => {
  const dgeRef = { vit_c: { ref: 110 }, eisen: { ref: 14 } };
  const last7Ohne = [
    { vit_c: 0, eisen: 0 },
    { vit_c: 0, eisen: 0 },
  ];
  assert.deepEqual(getUnderCoveredTags(last7Ohne, dgeRef), []);
});

test('generatePlan: bevorzugt Rezepte mit passendem Tag, wenn underCoveredTags gesetzt', () => {
  const onlyOneHasTag = [
    { id: 'a', category: 'vegetarisch', mealType: 'lunch', tags: ['magnesium'], ingredients: [], steps: [] },
    { id: 'b', category: 'vegetarisch', mealType: 'lunch', tags: ['vitamin_c'], ingredients: [], steps: [] },
  ];
  const plan = generatePlan(onlyOneHasTag, 'vegetarisch', '2026-07-20', ['vitamin_c']);
  // Bei nur 2 Optionen und avoid-Fenster von 3 muesste ueber 7 Tage mehrfach
  // "b" (das Tag-passende Rezept) gewaehlt werden, sobald beide "frisch" sind.
  const usedIds = plan.days.map(d => d.lunch);
  assert.ok(usedIds.includes('b'));
});

test('getDayTagCoverage: vereinigt Tags aller drei Mahlzeiten eines Tages', () => {
  const day = {
    breakfastRecipe: { tags: ['vitamin_c', 'zink'] },
    lunchRecipe: { tags: ['eisen'] },
    dinnerRecipe: null,
  };
  const tags = getDayTagCoverage(day);
  assert.deepEqual([...tags].sort(), ['eisen', 'vitamin_c', 'zink']);
});

test('recipeMatchesIntolerance: erkennt Laktose-Keyword in den Zutaten', () => {
  const rezept = { ingredients: ['200 g Sahne', '1 Zwiebel'] };
  assert.equal(recipeMatchesIntolerance(rezept, 'laktose'), true);
  assert.equal(recipeMatchesIntolerance(rezept, 'gluten'), false);
});

test('recipeMatchesIntolerance: erkennt Gluten- und Nuss-Keywords', () => {
  assert.equal(recipeMatchesIntolerance({ ingredients: ['250 g Weizenmehl'] }, 'gluten'), true);
  assert.equal(recipeMatchesIntolerance({ ingredients: ['50 g gehackte Mandeln'] }, 'nuesse'), true);
});

test('recipeMatchesIntolerance: unbekannte Unvertraeglichkeit liefert false statt Fehler', () => {
  assert.equal(recipeMatchesIntolerance({ ingredients: ['Salz'] }, 'unbekannt'), false);
});

test('filterByIntolerances: ohne aktive Auswahl bleiben alle Rezepte erhalten', () => {
  const recipes = [{ id: 'a', ingredients: ['Milch'] }, { id: 'b', ingredients: ['Salz'] }];
  assert.deepEqual(filterByIntolerances(recipes, []), recipes);
});

test('filterByIntolerances: entfernt Rezepte mit passendem Trigger-Keyword', () => {
  const recipes = [
    { id: 'milchreis', ingredients: ['500 ml Milch', 'Zimt'] },
    { id: 'salat', ingredients: ['Salat', 'Olivenöl'] },
  ];
  const gefiltert = filterByIntolerances(recipes, ['laktose']);
  assert.equal(gefiltert.length, 1);
  assert.equal(gefiltert[0].id, 'salat');
});

test('INTOLERANCE_LABELS: enthaelt Laktose, Gluten, Nuesse', () => {
  assert.deepEqual(Object.keys(INTOLERANCE_LABELS).sort(), ['gluten', 'laktose', 'nuesse']);
});

test('generatePlan: activeIntolerances filtert Rezepte vor der Planerstellung', () => {
  const recipesMitMilch = [
    { id: 'a', category: 'vegetarisch', mealType: 'breakfast', tags: [], ingredients: ['200 ml Milch'], steps: [] },
    { id: 'b', category: 'vegetarisch', mealType: 'lunch', tags: [], ingredients: ['Reis'], steps: [] },
  ];
  const plan = generatePlan(recipesMitMilch, 'vegetarisch', '2026-07-20', [], ['laktose']);
  // 'a' (Milch) darf nie als Fruehstueck vorkommen, da laktosehaltig gefiltert.
  const usedBreakfasts = plan.days.map(d => d.breakfast);
  assert.ok(usedBreakfasts.every(id => id === null || id === undefined || id !== 'a'));
});

// Feature "Wochenplan selbst bearbeiten" (03.08.2026): Rezepte tauschen und
// Mahlzeiten fest einplanen ("immer das Porridge").

test('getEligiblePool: liefert denselben gefilterten Pool je Mahlzeit wie generatePlan intern nutzt', () => {
  const pool = getEligiblePool(recipes, 'vegetarisch');
  assert.deepEqual(pool.breakfast.map(r => r.id), ['r1']);
  assert.deepEqual(pool.lunch.map(r => r.id).sort(), ['r2', 'r3']);
  assert.deepEqual(pool.dinner.map(r => r.id).sort(), ['r2', 'r3']); // Abend nutzt den Mittag-Pool
});

test('getEligiblePool: respektiert Unvertraeglichkeiten wie generatePlan', () => {
  const pool = getEligiblePool(recipes, 'vegetarisch', []);
  assert.equal(pool.lunch.length, 2);
});

test('setDaySlot: aendert nur die angegebene Mahlzeit an genau diesem Tag', () => {
  const plan = generatePlan(recipes, 'vegetarisch', '2026-08-03');
  const targetDate = plan.days[2].date;
  const otherDateBefore = plan.days[1].lunch;
  const newPlan = setDaySlot(plan, targetDate, 'lunch', 'r3');
  assert.equal(newPlan.days[2].lunch, 'r3');
  assert.equal(newPlan.days[1].lunch, otherDateBefore, 'andere Tage duerfen unveraendert bleiben');
  assert.equal(newPlan.days[2].breakfast, plan.days[2].breakfast, 'andere Mahlzeiten desselben Tages duerfen unveraendert bleiben');
});

test('setDaySlot: veraendert das Original-Plan-Objekt nicht (unveraenderlich)', () => {
  const plan = generatePlan(recipes, 'vegetarisch', '2026-08-03');
  const originalLunch = plan.days[0].lunch;
  setDaySlot(plan, plan.days[0].date, 'lunch', 'r3');
  assert.equal(plan.days[0].lunch, originalLunch);
});

test('setPin: traegt das gepinnte Rezept sofort in ALLE 7 Tage der Mahlzeit ein', () => {
  const plan = generatePlan(recipes, 'vegetarisch', '2026-08-03');
  const newPlan = setPin(plan, 'lunch', 'r3');
  assert.ok(newPlan.days.every(d => d.lunch === 'r3'));
  assert.equal(newPlan.pins.lunch, 'r3');
});

test('setPin: loesen (recipeId=null) entfernt nur den Pin, laesst die aktuellen Tage unveraendert', () => {
  const plan = generatePlan(recipes, 'vegetarisch', '2026-08-03');
  const pinned = setPin(plan, 'lunch', 'r3');
  const unpinned = setPin(pinned, 'lunch', null);
  assert.equal(unpinned.pins.lunch, undefined);
  assert.ok(unpinned.days.every(d => d.lunch === 'r3'), 'Tage bleiben bis zur naechsten Neugenerierung wie sie waren');
});

test('generatePlan: gepinnte Mahlzeit ueberlebt eine Neugenerierung (wird nicht neu gewuerfelt)', () => {
  const firstPlan = generatePlan(recipes, 'vegetarisch', '2026-08-03');
  const pinnedPlan = setPin(firstPlan, 'breakfast', 'r1');
  // Neugenerierung mit denselben Pins - da es nur ein Fruehstuecks-Rezept
  // (r1) gibt, waere das ohnehin immer r1, deshalb hier zusaetzlich pruefen,
  // dass pins im Ergebnis weitergereicht werden.
  const regenerated = generatePlan(recipes, 'vegetarisch', '2026-08-03', [], [], pinnedPlan.pins);
  assert.ok(regenerated.days.every(d => d.breakfast === 'r1'));
  assert.equal(regenerated.pins.breakfast, 'r1');
});

test('generatePlan: gepinntes, aber nicht mehr existierendes Rezept faellt defensiv auf normales Wuerfeln zurueck', () => {
  const plan = generatePlan(recipes, 'vegetarisch', '2026-08-03', [], [], { lunch: 'existiert-nicht-mehr' });
  assert.ok(plan.days.every(d => ['r2', 'r3'].includes(d.lunch)));
});

test('getDayTagCoverage: funktioniert unveraendert nach einem Tausch (Deckungs-Anzeige bleibt korrekt)', () => {
  const plan = generatePlan(recipes, 'vegetarisch', '2026-08-03');
  const swapped = setDaySlot(plan, plan.days[0].date, 'lunch', 'r3'); // r3 hat Tag 'magnesium'
  const resolved = resolvePlan(swapped, recipes);
  const tags = getDayTagCoverage(resolved.days[0]);
  assert.ok(tags.includes('magnesium'));
});

test('buildShoppingList: zaehlbare Einheiten werden nach der Skalierung aufgerundet', () => {
  const rezept3Portionen = { title: 'Omelett', servings: 3, ingredients: ['3 Eier'], steps: [] };
  const plan = { weekStart: '2026-07-20', category: 'vegetarisch', days: [
    { date: '2026-07-20', breakfastRecipe: rezept3Portionen, lunchRecipe: null, dinnerRecipe: null },
  ] };
  const list = buildShoppingList(plan, 1); // 3 Eier / 3 Portionen * 1 = 1 Ei genau
  const eggs = list.find(i => i.label.includes('Eier'));
  assert.equal(eggs.label, '1 Eier');
});

// Review 12 (19.08.2026), Tester-Feedback: "an zwei Wochentagen jeweils
// Mittag- und Abendessen dasselbe Rezept" + "in jedem Rezept wird Fleisch
// oder Fisch verwendet" + "Frühstück eine komplett eigene Kategorie".

test('generatePlan: Mittag und Abend sind an KEINEM Tag identisch, auch nicht bei einem sehr kleinen Pool', () => {
  // 'recipes' hat fuer 'vegetarisch' nur genau 2 Mittag/Abend-Optionen (r2, r3)
  // - genau der Fall, in dem der urspruengliche Bug auftrat (Wochen-Fallback
  // reintroduziert sonst leicht ein Duplikat ueber den Tag-Boost).
  const plan = generatePlan(recipes, 'vegetarisch', '2026-08-03');
  for (const day of plan.days) {
    assert.notEqual(day.lunch, day.dinner, `Tag ${day.date}: Mittag und Abend duerfen nicht gleich sein`);
  }
});

test('generatePlan: kein Rezept wird zweimal in derselben Woche verwendet, wenn der Pool exakt genug Rezepte fuer alle Mittag/Abend-Slots hat', () => {
  const vierzehnMittagsrezepte = Array.from({ length: 14 }, (_, i) => ({
    id: `lunch_${i}`,
    category: 'vegetarisch',
    mealType: 'lunch',
    tags: [],
    ingredients: [],
    steps: [],
  }));
  const plan = generatePlan(vierzehnMittagsrezepte, 'vegetarisch', '2026-08-03');
  const usedIds = plan.days.flatMap(d => [d.lunch, d.dinner]);
  assert.equal(usedIds.length, 14);
  assert.equal(new Set(usedIds).size, 14, 'bei genau 14 verfuegbaren Rezepten fuer 14 Slots darf keines doppelt vorkommen');
});

test('getEligiblePool: "fleisch_fisch" umfasst seit Review 12 den GESAMTEN Mittag/Abend-Pool, nicht nur Fleisch/Fisch-Rezepte', () => {
  const pool = getEligiblePool(recipes, 'fleisch_fisch');
  assert.deepEqual(pool.lunch.map(r => r.id).sort(), ['r2', 'r3', 'r4'], 'vegetarische Rezepte (r2, r3) muessen im Fleisch/Fisch-Pool ebenfalls waehlbar sein');
});

test('getEligiblePool: "vegetarisch" bleibt strikt - Fleisch/Fisch-Rezepte sind dort weiterhin ausgeschlossen', () => {
  const pool = getEligiblePool(recipes, 'vegetarisch');
  assert.ok(!pool.lunch.some(r => r.id === 'r4'), 'r4 (fleisch_fisch) darf im vegetarischen Pool nicht auftauchen');
});

test('getEligiblePool: Fruehstueck ist von der gewaehlten Mittag/Abend-Kategorie entkoppelt', () => {
  // r1 ist als 'vegetarisch' einsortiert, muss aber auch bei Kategorie
  // 'fleisch_fisch' als Fruehstuecksoption erscheinen (Nicole: "zum
  // Fruehstueck Skyr mit Beeren" soll unabhaengig von der Mittag/Abend-Wahl
  // moeglich sein).
  const poolFleischFisch = getEligiblePool(recipes, 'fleisch_fisch');
  assert.deepEqual(poolFleischFisch.breakfast.map(r => r.id), ['r1']);

  const poolVegetarisch = getEligiblePool(recipes, 'vegetarisch');
  assert.deepEqual(poolVegetarisch.breakfast.map(r => r.id), ['r1'], 'Fruehstueck ist bei jeder Kategorie identisch');
});

test('generatePlan: FLEISCH_FISCH_WEIGHT bevorzugt Fleisch/Fisch, wenn der Zufallswert niedrig ist', () => {
  const gemischterPool = [
    { id: 'meat_a', category: 'fleisch_fisch', mealType: 'lunch', tags: [], ingredients: [], steps: [] },
    { id: 'meat_b', category: 'fleisch_fisch', mealType: 'lunch', tags: [], ingredients: [], steps: [] },
    { id: 'meat_c', category: 'fleisch_fisch', mealType: 'lunch', tags: [], ingredients: [], steps: [] },
    { id: 'veg_a', category: 'vegetarisch', mealType: 'lunch', tags: [], ingredients: [], steps: [] },
    { id: 'veg_b', category: 'vegetarisch', mealType: 'lunch', tags: [], ingredients: [], steps: [] },
    { id: 'veg_c', category: 'vegetarisch', mealType: 'lunch', tags: [], ingredients: [], steps: [] },
  ];
  const meatIds = new Set(['meat_a', 'meat_b', 'meat_c']);
  const originalRandom = Math.random;
  try {
    Math.random = () => 0.01; // deutlich unter FLEISCH_FISCH_WEIGHT (0.65)
    const plan = generatePlan(gemischterPool, 'fleisch_fisch', '2026-08-03');
    // Am ersten Tag sind noch alle 6 Rezepte "frisch" (beide Varianten im
    // Kandidaten-Pool verfuegbar) - die Gewichtung muss hier greifen.
    assert.ok(meatIds.has(plan.days[0].lunch), `erwartete Fleisch/Fisch-Rezept bei niedrigem Zufallswert, bekam ${plan.days[0].lunch}`);
  } finally {
    Math.random = originalRandom;
  }
});

test('generatePlan: FLEISCH_FISCH_WEIGHT erlaubt auch vegetarische Auswahl, wenn der Zufallswert hoch ist ("Fleisch/Fisch" ist Praeferenz, keine Pflicht)', () => {
  const gemischterPool = [
    { id: 'meat_a', category: 'fleisch_fisch', mealType: 'lunch', tags: [], ingredients: [], steps: [] },
    { id: 'meat_b', category: 'fleisch_fisch', mealType: 'lunch', tags: [], ingredients: [], steps: [] },
    { id: 'meat_c', category: 'fleisch_fisch', mealType: 'lunch', tags: [], ingredients: [], steps: [] },
    { id: 'veg_a', category: 'vegetarisch', mealType: 'lunch', tags: [], ingredients: [], steps: [] },
    { id: 'veg_b', category: 'vegetarisch', mealType: 'lunch', tags: [], ingredients: [], steps: [] },
    { id: 'veg_c', category: 'vegetarisch', mealType: 'lunch', tags: [], ingredients: [], steps: [] },
  ];
  const meatIds = new Set(['meat_a', 'meat_b', 'meat_c']);
  const originalRandom = Math.random;
  try {
    Math.random = () => 0.99; // deutlich ueber FLEISCH_FISCH_WEIGHT (0.65)
    const plan = generatePlan(gemischterPool, 'fleisch_fisch', '2026-08-03');
    assert.ok(!meatIds.has(plan.days[0].lunch), `erwartete vegetarisches Rezept bei hohem Zufallswert, bekam ${plan.days[0].lunch}`);
  } finally {
    Math.random = originalRandom;
  }
});
