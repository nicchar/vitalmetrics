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

/**
 * Tester-Fund 18.08.2026: Die Karte "PMS, Prämenopause & Menopause" war hier
 * IMMER sichtbar, unabhängig vom Geschlecht - anders als der Zyklus-Tab in
 * der Bottom-Nav, der sich in router.js schon korrekt bei sex !== 'f'
 * ausblendet (updateCycleNavVisibility). Jetzt konsistent gemacht.
 */
test('toolsHub.js: importiert profileRepo und blendet die Menopause-Karte nur bei sex === "f" ein', () => {
  assert.ok(src.includes("import { profileRepo } from '../../infra/db/repositories/profileRepo.js'"),
    'Import von profileRepo fehlt');
  assert.ok(/const showCycleWellness = profileRepo\.get\(\)\.sex === 'f'/.test(src),
    'Sichtbarkeits-Flag für die Menopause-Karte fehlt oder prüft nicht auf sex === "f"');
  const idxCard = src.indexOf('id="tool-cycle-wellness"');
  const block = src.slice(Math.max(0, idxCard - 200), idxCard);
  assert.ok(block.includes('showCycleWellness ?'), 'Karte sollte hinter showCycleWellness im Template stehen');
});

test('toolsHub.js: Event-Listener für die Menopause-Karte nutzt optional chaining (Karte existiert nicht immer im DOM)', () => {
  assert.ok(src.includes("querySelector('#tool-cycle-wellness')?.addEventListener('click', () => navigate('cycle_wellness'))"),
    'Event-Wiring sollte ?. nutzen, da die Karte bei Männern/keine Angabe gar nicht gerendert wird');
});
