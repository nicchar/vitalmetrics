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
 * Google-Play-Ablehnung 29.09.2026 ("Funktionen in Screenshots nicht
 * vorhanden"): Zyklus-Tracker und PMS-/Menopause-Karte müssen für ALLE im
 * Tools-Bereich erreichbar sein - unabhängig vom gewählten Geschlecht. Löst die
 * frühere Regel (Tester-Fund 18.08.2026: nur bei sex === 'f') bewusst ab.
 */
test('toolsHub.js: Zyklus-Tracker und Menopause-Karte sind unabhängig vom Geschlecht sichtbar', () => {
  assert.ok(!src.includes('showCycleWellness ?'), 'Karten dürfen nicht mehr hinter einer Geschlechts-Bedingung stehen');
  assert.ok(src.includes("item('tool-cycle',"), 'Zyklus-Tracker-Karte fehlt');
  assert.ok(src.includes("item('tool-cycle-wellness',"), 'Menopause-Karte fehlt');
  assert.ok(src.includes("querySelector('#tool-cycle').addEventListener('click', () => navigate('cycle'))"));
  assert.ok(src.includes("querySelector('#tool-cycle-wellness').addEventListener('click', () => navigate('cycle_wellness'))"));
});

/**
 * 2.2: "Mehr" ersetzt "Tools"; Bewegung und Profil haben keinen eigenen Tab
 * mehr und sind hier erreichbar. Keine Anglizismen wie "Health Tools".
 */
test('toolsHub.js (Mehr): Bewegung und Profil sind erreichbar', () => {
  assert.ok(src.includes("querySelector('#tool-activity').addEventListener('click', () => navigate('activity'))"));
  assert.ok(src.includes("querySelector('#tool-profile').addEventListener('click', () => navigate('profile'))"));
});

test('toolsHub.js (Mehr): warme, deutsche Texte ohne "Health Tools", "Toolkit" oder "Autophagie"', () => {
  assert.ok(!/Health Tools|Toolkit|Autophagie|Streak|Prämenopause/.test(src));
  assert.ok(src.includes('Perimenopause'));
});
