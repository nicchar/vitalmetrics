import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const recipes = JSON.parse(readFileSync(path.join(__dirname, '../../app/src/data/recipes.json'), 'utf-8'));

const REQUIRED_FIELDS = ['id', 'title', 'duration', 'servings', 'tags', 'ingredients', 'steps', 'highlight', 'category', 'mealType'];

test('recipes.json: alle IDs sind eindeutig', () => {
  const ids = recipes.map(r => r.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('recipes.json: jedes Rezept hat alle Pflichtfelder, nicht-leere Zutaten/Schritte', () => {
  for (const r of recipes) {
    for (const field of REQUIRED_FIELDS) {
      assert.ok(field in r, `Rezept ${r.id || '?'} fehlt Feld "${field}"`);
    }
    assert.ok(r.ingredients.length > 0, `Rezept ${r.id} hat keine Zutaten`);
    assert.ok(r.steps.length > 0, `Rezept ${r.id} hat keine Zubereitungsschritte`);
    assert.ok(r.tags.length > 0, `Rezept ${r.id} hat keine Naehrstoff-Tags`);
  }
});

test('recipes.json (2.2): kuratierte Sammlung mit über 200 Rezepten, alle Mahlzeiten gut belegt', () => {
  assert.ok(recipes.length >= 200, `Erwartet >= 200 Rezepte, gefunden ${recipes.length}`);
  const byMeal = type => recipes.filter(r => r.mealType === type).length;
  assert.ok(byMeal('breakfast') >= 45, `Frühstück: ${byMeal('breakfast')}`);
  assert.ok(byMeal('lunch') >= 110, `Hauptgerichte: ${byMeal('lunch')}`);
  assert.ok(byMeal('snack') >= 30, `Smoothies & Snacks: ${byMeal('snack')}`);
});

const NUTRITION_KEYS = ['kal', 'protein', 'fat', 'carbs', 'vit_a', 'vit_d', 'vit_e', 'vit_k', 'vit_c',
  'b1', 'b2', 'b3', 'b6', 'b12', 'folat', 'eisen', 'zink', 'mag', 'cal'];

test('recipes.json (Block F Phase 4b): jedes Rezept hat nutritionPerServing + nutritionConfidence', () => {
  for (const r of recipes) {
    assert.ok(r.nutritionPerServing, `${r.id}: nutritionPerServing fehlt`);
    assert.ok(['reviewed', 'estimated'].includes(r.nutritionConfidence), `${r.id}: nutritionConfidence ungueltig`);
    for (const key of NUTRITION_KEYS) {
      const val = r.nutritionPerServing[key];
      assert.equal(typeof val, 'number', `${r.id}: nutritionPerServing.${key} ist keine Zahl`);
      assert.ok(!Number.isNaN(val) && val >= 0, `${r.id}: nutritionPerServing.${key} = ${val} (negativ oder NaN)`);
    }
  }
});

test('recipes.json (Block F Phase 4b): kcal pro Portion in plausiblem Bereich (keine Rechenfehler wie 400g/Dattel)', () => {
  for (const r of recipes) {
    const kcal = r.nutritionPerServing.kal;
    assert.ok(kcal >= 20 && kcal <= 1600, `${r.id}: ${kcal} kcal/Portion wirkt unplausibel`);
  }
});

test('recipes.json (Block F Phase 4b): mindestens 99% der Rezepte auf "reviewed" (Zutaten sauber gegen BLS gematcht)', () => {
  const reviewed = recipes.filter(r => r.nutritionConfidence === 'reviewed').length;
  assert.ok(reviewed / recipes.length >= 0.99, `Nur ${reviewed}/${recipes.length} reviewed`);
});

const VALID_TAGS = new Set([
  'calcium', 'cholin', 'eisen', 'jod', 'magnesium', 'mangan', 'omega3', 'selen',
  'vitamin_a', 'vitamin_b1', 'vitamin_b12', 'vitamin_b2', 'vitamin_b3', 'vitamin_b6',
  'vitamin_b7', 'vitamin_b9', 'vitamin_c', 'vitamin_d', 'vitamin_e', 'vitamin_k', 'zink',
]);

// Rezepte, für die es Pins bzw. Seiten auf wellanni.de gibt - die IDs müssen
// stabil bleiben, damit Links und gespeicherte Wochenpläne weiter funktionieren.
const PIN_IDS = [
  'geroestete_rosenkohl_nuesse_249', 'skyr_walnuesse_zimt', 'halloumi_eintopf_rosenkohl_vollkornnudeln_9',
  'overnight_oats_chia_beeren', 'quinoa_salat_rotkohl_suesskartoffel_14', 'haferflocken_energy_balls',
  'kabeljau_ofengericht_rotkohl_suesskartoffel_112', 'griechischer_joghurt_granatapfel_pistazien',
  'tempeh_curry_zucchini_suesskartoffel_24', 'buchweizen_porridge_apfel_zimt',
  'kichererbsen_eintopf_gruenkohl_vollkornnudeln_10', 'karotten_ingwer_suppe', 'linsensuppe_zitrone',
];

test('recipes.json (2.2): Rezepte mit Pin/Website-Seite behalten ihre ID', () => {
  const ids = new Set(recipes.map(r => r.id));
  for (const id of PIN_IDS) assert.ok(ids.has(id), `Pin-Rezept "${id}" fehlt`);
});

test('recipes.json: alle Tags stammen aus dem festgelegten 21-Werte-Vokabular', () => {
  for (const r of recipes) {
    for (const tag of r.tags || []) {
      assert.ok(VALID_TAGS.has(tag), `${r.id}: unbekannter Tag "${tag}"`);
    }
  }
});

test('recipes.json: Fruehstuecks-Pool enthaelt nach Review 12 mehr als nur "Ruehrei"-Varianten', () => {
  const breakfasts = recipes.filter(r => r.mealType === 'breakfast');
  const nichtRuehrei = breakfasts.filter(r => !/rührei/i.test(r.title));
  assert.ok(nichtRuehrei.length >= 20, 'erwartete ausreichend Fruehstuecks-Abwechslung jenseits von Ruehrei-Varianten');
});
