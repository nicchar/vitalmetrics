import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = readFileSync(path.resolve(__dirname, '../../app/src/ui/screens/myRecipes.js'), 'utf-8');

/**
 * myRecipes.test.js
 *
 * Feature "Eigene Rezepte" (03.08.2026). Bewusst textbasiert statt
 * jsdom-Rendering (siehe nutrition.test.js/onboarding.test.js - jsdom hängt
 * sich in dieser Sandbox unabhängig vom Projekt-Code auf).
 */

test('myRecipes.js: nutzt customRecipeRepo und buildCustomRecipe statt eigener Speicherlogik', () => {
  assert.ok(src.includes("from '../../infra/db/repositories/customRecipeRepo.js'"));
  assert.ok(src.includes("from '../../domain/customRecipe.js'"));
});

test('myRecipes.js: Formular fragt Titel, Portionen, Zutaten und die 4 Makro-Nährwerte ab', () => {
  for (const id of ['rc-title', 'rc-servings', 'rc-ingredients', 'rc-kal', 'rc-protein', 'rc-fat', 'rc-carbs']) {
    assert.ok(src.includes(`id="${id}"`), `Formularfeld #${id} fehlt`);
  }
});

test('myRecipes.js: erklärt, warum Mikronährstoffe bei eigenen Rezepten fehlen', () => {
  assert.ok(/Mikronährstoffe.*werden bei eigenen Rezepten nicht erfasst/.test(src));
});

test('myRecipes.js: Speichern-Handler zeigt bei ok:false einen erklärenden Toast statt stumm zu scheitern', () => {
  const idxHandler = src.indexOf("querySelector('#btn-save-recipe')");
  const block = src.slice(idxHandler, idxHandler + 700);
  assert.ok(block.includes('result.ok'), 'Ergebnis von buildCustomRecipe() wird nicht geprüft');
  assert.ok(block.includes('showToast'), 'Kein Toast bei ungültiger Eingabe');
});

test('myRecipes.js: nutzt die geteilte "Rezept gekocht"-Komponente (recipeLogControl.js) statt eigener Logging-Logik', () => {
  assert.ok(src.includes("from '../components/recipeLogControl.js'"));
  assert.ok(src.includes('recipeLogButtonHtml('));
  assert.ok(src.includes('wireRecipeLogButtons('));
});

test('myRecipes.js: Löschen fragt vor dem Entfernen nach Bestätigung', () => {
  const idxWiring = src.indexOf("querySelectorAll('.btn-delete-recipe')");
  assert.notEqual(idxWiring, -1, 'Delete-Button-Wiring fehlt');
  const block = src.slice(idxWiring, idxWiring + 300);
  assert.ok(/confirm\(/.test(block), 'Löschen sollte eine confirm()-Bestätigung verlangen (Konsistenz mit cravings.js)');
  assert.ok(block.includes('customRecipeRepo.remove'));
});

test('myRecipes.js: Leerzustand-Hinweis vorhanden, wenn noch keine eigenen Rezepte existieren', () => {
  assert.ok(src.includes('Noch keine eigenen Rezepte'));
});
