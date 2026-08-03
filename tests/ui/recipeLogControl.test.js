import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = readFileSync(path.resolve(__dirname, '../../app/src/ui/components/recipeLogControl.js'), 'utf-8');

/**
 * recipeLogControl.test.js
 *
 * Feature "Mahlzeiten-Kategorisierung" (03.08.2026): Rezept-Log (Wochenplan
 * + Rezeptideen auf trend.js) ist ein eigener Eintragsweg ohne den
 * zentralen Mahlzeit-Selector aus nutrition.js und braucht daher seine
 * eigene Auswahl direkt in der Bestätigungsbox.
 *
 * Bewusst textbasiert statt jsdom-Rendering (siehe nutrition.test.js/
 * onboarding.test.js - jsdom hängt sich in dieser Sandbox unabhängig vom
 * Projekt-Code auf).
 */

test('recipeLogControl.js: importiert das mealType-Domain-Modul', () => {
  assert.ok(src.includes("from '../../domain/mealType.js'"), 'Import von domain/mealType.js fehlt');
  assert.ok(src.includes('guessMealTypeByTime'), 'Tageszeit-Vorschlag fehlt');
});

test('recipeLogControl.js: mealType-Selector steht in renderLogConfirm() vor der Portionsauswahl', () => {
  const idxFn = src.indexOf('export function renderLogConfirm');
  const idxMealtype = src.indexOf('log-recipe-mealtype', idxFn);
  const idxPortions = src.indexOf('log-recipe-portions', idxFn);
  assert.notEqual(idxMealtype, -1, 'mealType-Selector fehlt in renderLogConfirm()');
  assert.ok(idxMealtype < idxPortions, 'mealType-Selector sollte vor der Portionsauswahl stehen');
});

test('recipeLogControl.js: "Sonstiges" ist auch hier keine waehlbare Option', () => {
  const idxFn = src.indexOf('export function renderLogConfirm');
  const idxSubmit = src.indexOf('log-recipe-submit', idxFn);
  const block = src.slice(idxFn, idxSubmit);
  assert.ok(!/data-mealtype="other"/.test(block), '"Sonstiges" darf im Rezept-Log nicht aktiv waehlbar sein');
});

test('recipeLogControl.js: Submit-Handler reicht das gewaehlte mealType an nutritionRepo.addEntry() durch', () => {
  const idxSubmitHandler = src.indexOf("querySelector('.log-recipe-submit')");
  const handlerBlock = src.slice(idxSubmitHandler, idxSubmitHandler + 500);
  assert.ok(/addEntry\([^)]*mealType[^)]*\)/s.test(handlerBlock), 'addEntry() im Submit-Handler bekommt kein mealType mit');
});
