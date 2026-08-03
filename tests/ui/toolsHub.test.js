import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = readFileSync(path.resolve(__dirname, '../../app/src/ui/screens/toolsHub.js'), 'utf-8');

/**
 * toolsHub.test.js
 *
 * Feature "Eigene Rezepte" (03.08.2026): neue Karte in der Gruppe
 * "Auswertungen & Pläne", direkt nach dem Wochenplan. Bewusst textbasiert,
 * siehe nutrition.test.js.
 */

test('toolsHub.js: "Eigene Rezepte"-Karte navigiert zu my_recipes', () => {
  const idxCard = src.indexOf('tool-my-recipes');
  assert.notEqual(idxCard, -1, 'Karte fehlt im Markup');
  assert.ok(src.includes("querySelector('#tool-my-recipes').addEventListener('click', () => navigate('my_recipes'))"));
});

test('toolsHub.js: Karte zeigt die Anzahl gespeicherter eigener Rezepte an', () => {
  assert.ok(src.includes('customRecipeRepo.getAll().length'));
  assert.ok(src.includes('Noch keine eigenen Rezepte'));
});
