/**
 * Rezeptprüfung 2.2 (Okt. 2026): Die Rezeptdatenbank wurde neu aufgebaut
 * (Prüfung als Kochexpertin, Nährwerte aus den Einzelzutaten gegen BLS 4.0
 * berechnet). Diese Tests sichern die dabei behobenen Fehlerklassen ab, damit
 * sie bei künftigen Rezept-Änderungen nicht wiederkommen.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { generatePlan } from '../../app/src/domain/mealPlan.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');
const recipes = JSON.parse(readFileSync(path.join(root, 'app/src/data/recipes.json'), 'utf-8'));
const foods = JSON.parse(readFileSync(path.join(root, 'app/src/data/foodDatabase.json'), 'utf-8'));
const foodById = Object.fromEntries(foods.map(f => [f.id, f]));
const KEYS = ['kal', 'protein', 'fat', 'carbs', 'vit_a', 'vit_d', 'vit_e', 'vit_k', 'vit_c',
  'b1', 'b2', 'b3', 'b6', 'b12', 'folat', 'eisen', 'zink', 'mag', 'cal', 'fiber', 'jod'];

test('Rezeptprüfung: Nährwerte pro Portion lassen sich aus den Zutaten (BLS 4.0) exakt nachrechnen', () => {
  for (const r of recipes) {
    assert.ok(Array.isArray(r.ingredientsData) && r.ingredientsData.length, `${r.id}: ingredientsData fehlt`);
    const sum = Object.fromEntries(KEYS.map(k => [k, 0]));
    for (const ing of r.ingredientsData) {
      if (!ing.bls || !ing.g) continue;
      const f = foodById[ing.bls];
      assert.ok(f, `${r.id}: BLS-Code ${ing.bls} (${ing.name}) nicht in foodDatabase.json`);
      for (const k of KEYS) sum[k] += (f[k] || 0) * ing.g / 100;
    }
    for (const k of KEYS) {
      const expected = sum[k] / r.servings;
      const actual = r.nutritionPerServing[k];
      const tol = Math.max(1, Math.abs(expected) * 0.01);
      assert.ok(Math.abs(actual - expected) <= tol, `${r.id}: ${k} = ${actual}, nachgerechnet ${expected.toFixed(2)}`);
    }
  }
});

test('Rezeptprüfung: plausible Kalorien je Mahlzeit (keine 1.400-kcal-Portionen mehr)', () => {
  const range = { breakfast: [180, 650], lunch: [250, 900], snack: [50, 420] };
  for (const r of recipes) {
    const [min, max] = range[r.mealType];
    const kcal = r.nutritionPerServing.kal;
    assert.ok(kcal >= min && kcal <= max, `${r.id}: ${kcal} kcal/Portion (${r.mealType})`);
  }
});

test('Rezeptprüfung: Hauptgerichte liefern genug Eiweiß, um satt zu machen', () => {
  for (const r of recipes.filter(x => x.mealType === 'lunch')) {
    assert.ok(r.nutritionPerServing.protein >= 10, `${r.id}: nur ${r.nutritionPerServing.protein} g Eiweiß`);
  }
});

test('Rezeptprüfung: keine Vorlagen-Schritte und keine unzulässigen Gesundheitsaussagen', () => {
  const forbidden = /reich an|ideal bei|ideal für|Packungsanweisung|gar braten bzw|bis die gewünschte Konsistenz|Booster|stärkt|heilt|entgift/i;
  for (const r of recipes) {
    const text = [r.title, r.highlight, r.tip || '', ...r.steps].join(' ');
    assert.ok(!forbidden.test(text), `${r.id}: unzulässige Formulierung "${text.match(forbidden)?.[0]}"`);
    assert.ok(r.steps.length >= 2, `${r.id}: zu wenige Schritte`);
  }
});

test('Rezeptprüfung: Titel ohne die alten Grammatikfehler der Vorlage', () => {
  const bad = /\bmit (Nüsse|Grüne|Kürbiskerne|Kokosöl)\b|^Geröstete (Rosenkohl|Spinat|Spargel|Lauch|Zucchini|Brokkoli|Pilz)\b|-Sticks mit .*-Dip/;
  for (const r of recipes) assert.ok(!bad.test(r.title), `${r.id}: Titel "${r.title}"`);
});

test('Rezeptprüfung: Ernährungsform, Saison und Allergene sind für jedes Rezept gepflegt', () => {
  const meat = /hähnchen|pute[nr ]|putenbrust|rinder|rindfleisch|schwein|speck|schinken|salami|hackfleisch|lachs|kabeljau|forelle|makrele|hering|thunfisch|garnele|krabbe|seelachs|würstchen/i;
  for (const r of recipes) {
    assert.equal(typeof r.vegetarian, 'boolean', `${r.id}: vegetarian`);
    assert.equal(typeof r.lowCarb, 'boolean', `${r.id}: lowCarb`);
    assert.ok(Array.isArray(r.allergens), `${r.id}: allergens`);
    assert.ok(Array.isArray(r.seasons) && r.seasons.length, `${r.id}: seasons`);
    if (r.vegetarian) {
      const hit = r.ingredientsData.find(i => i.bls && meat.test(i.name) && !/nach wunsch|oder/i.test(i.name));
      assert.ok(!hit, `${r.id}: als vegetarisch markiert, enthält aber "${hit?.name}"`);
    }
  }
});

test('Rezeptprüfung: jedes Rezeptfoto liegt in app/assets/recipes', () => {
  for (const r of recipes.filter(x => x.image)) {
    assert.ok(existsSync(path.join(root, 'app/assets/recipes', r.image)), `${r.id}: Foto ${r.image} fehlt`);
  }
});

test('Wochenplan "Vegetarisch": kein Fleisch und kein Fisch – auch nicht zum Frühstück (Bugfix 2.2)', () => {
  for (let i = 0; i < 25; i++) {
    const plan = generatePlan(recipes, 'vegetarisch', '2026-10-19');
    const byId = Object.fromEntries(recipes.map(r => [r.id, r]));
    for (const day of plan.days) {
      for (const meal of ['breakfast', 'lunch', 'dinner']) {
        assert.equal(byId[day[meal]].vegetarian, true, `${day.weekday} ${meal}: ${byId[day[meal]].title}`);
      }
    }
  }
});

test('Wochenplan Low Carb: nur kohlenhydratarme Rezepte (höchstens 20 g pro Portion)', () => {
  const plan = generatePlan(recipes, 'keto', '2026-10-19');
  const byId = Object.fromEntries(recipes.map(r => [r.id, r]));
  for (const day of plan.days) {
    for (const meal of ['breakfast', 'lunch', 'dinner']) {
      assert.ok(byId[day[meal]].nutritionPerServing.carbs <= 20, `${byId[day[meal]].title}`);
    }
  }
});

test('Wochenplan im Oktober: kein Spargel und keine reinen Sommer-Rezepte, wenn Saisonales verfügbar ist', () => {
  const byId = Object.fromEntries(recipes.map(r => [r.id, r]));
  for (let i = 0; i < 10; i++) {
    const plan = generatePlan(recipes, 'gemischt', '2026-10-19');
    for (const day of plan.days) {
      for (const meal of ['breakfast', 'lunch', 'dinner']) {
        const r = byId[day[meal]];
        assert.ok(r.seasons.includes('g') || r.seasons.includes('h'), `${r.title} (${r.seasons}) im Oktober`);
      }
    }
  }
});
