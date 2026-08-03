import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = readFileSync(path.resolve(__dirname, '../../app/src/ui/screens/mealPlan.js'), 'utf-8');

/**
 * mealPlan.test.js
 *
 * Feature "Wochenplan selbst bearbeiten" (03.08.2026): Rezepte tauschen
 * ("keine Forelle mag") und Mahlzeiten fest einplanen ("immer das
 * Porridge"), Nährstoff-Defizit-Anzeige bleibt dabei unverändert bestehen.
 * Bewusst textbasiert statt jsdom-Rendering, siehe nutrition.test.js.
 */

test('mealPlan.js: importiert die Tausch/Pin-Funktionen aus dem Domain-Modul statt eigener Logik', () => {
  assert.ok(src.includes('getEligiblePool'));
  assert.ok(src.includes('setDaySlot'));
  assert.ok(src.includes('setPin'));
});

test('mealPlan.js: Tausch-Auswahl nutzt denselben gefilterten Pool wie die Plan-Generierung, NICHT die eigenen Rezepte', () => {
  assert.ok(src.includes('getEligiblePool(recipes,'), 'Pool sollte aus state.recipes (App-Rezepte) kommen, nicht aus customRecipeRepo');
  assert.ok(!src.includes('customRecipeRepo'), 'Eigene Rezepte sind laut Nicole (03.08.2026) bewusst NICHT in den Wochenplan integriert');
});

test('mealPlan.js: mealplan-swap-select ruft setDaySlot() für genau den Tag/die Mahlzeit des Selects auf', () => {
  const idx = src.indexOf("querySelectorAll('.mealplan-swap-select')");
  const block = src.slice(idx, idx + 500);
  assert.ok(block.includes('setDaySlot(plan, sel.dataset.date, sel.dataset.mealtype'));
  assert.ok(block.includes('mealPlanRepo.save'));
});

test('mealPlan.js: leere Platzhalter-Option im Tausch-Select löst keinen Tausch aus', () => {
  const idx = src.indexOf("querySelectorAll('.mealplan-swap-select')");
  const block = src.slice(idx, idx + 300);
  assert.ok(/if\s*\(\s*!newRecipeId\s*\)\s*return/.test(block), 'Sollte bei leerer Auswahl früh zurückkehren');
});

test('mealPlan.js: mealplan-pin-btn togglet zwischen Pinnen und Lösen für DIESELBE Mahlzeit-Kategorie', () => {
  const idx = src.indexOf("querySelectorAll('.mealplan-pin-btn')");
  const block = src.slice(idx, idx + 600);
  assert.ok(block.includes('setPin(plan, mealType'));
  assert.ok(block.includes('alreadyPinned'));
});

test('mealPlan.js: "Neu generieren" gibt bestehende Pins an generatePlan() weiter (Pins überleben Neugenerierung)', () => {
  const idx = src.indexOf("querySelector('#btn-generate-plan')");
  const block = src.slice(idx, idx + 700);
  assert.ok(/plan\?\.pins\s*\|\|\s*\{\}/.test(block), 'Sollte plan?.pins als Fallback {} auslesen');
  assert.ok(/generatePlan\([^)]*existingPins[^)]*\)/s.test(block), 'existingPins sollte an generatePlan() übergeben werden');
});

test('mealPlan.js: Rezept-Detailansicht zeigt weiterhin Zutaten/Zubereitung UND die "Rezept gekocht"-Komponente (unverändert durch Punkt 3)', () => {
  assert.ok(src.includes('recipe-ingredients'));
  assert.ok(src.includes('recipeLogButtonHtml('));
});
