import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = readFileSync(path.resolve(__dirname, '../../app/src/ui/screens/profile.js'), 'utf-8');

/**
 * profile.test.js
 *
 * Review 11 (19.08.2026): Körpergröße und Aktivitätslevel lassen sich nicht
 * nur im Onboarding, sondern auch nachträglich im Profil eintragen/ändern -
 * wichtig für Bestandsnutzerinnen, die die App schon vor diesem Feature
 * eingerichtet hatten (deren Onboarding lief nie durch die neuen Schritte
 * 4/5, siehe onboarding.test.js).
 */

test('profile.js: importiert ACTIVITY_LEVELS aus energyNeeds.js', () => {
  assert.ok(src.includes("from '../../domain/energyNeeds.js'"), 'Import von domain/energyNeeds.js fehlt');
});

test('profile.js: Persönliche Daten enthält ein Körpergröße-Feld, vorbelegt mit profile.height', () => {
  assert.match(src, /<input type="number" id="p-height"[^>]*value="\$\{profile\.height \|\| ''\}"/);
});

test('profile.js: Persönliche Daten enthält ein Aktivitätslevel-Dropdown, das aus ACTIVITY_LEVELS gerendert wird', () => {
  assert.ok(src.includes('id="p-activity"'), 'Aktivitätslevel-Feld fehlt');
  assert.ok(src.includes('ACTIVITY_LEVELS.map'), 'Optionen sollten aus ACTIVITY_LEVELS gerendert werden, nicht hartkodiert');
});

test('profile.js: btn-save-profile speichert height (geparst) und activityLevel zusätzlich zu den bestehenden Feldern', () => {
  const idx = src.indexOf("querySelector('#btn-save-profile').addEventListener");
  const block = src.slice(idx, idx + 650);
  assert.match(block, /height:\s*parseFloat\(container\.querySelector\('#p-height'\)\.value\)\s*\|\|\s*null/);
  assert.match(block, /activityLevel:\s*container\.querySelector\('#p-activity'\)\.value/);
  assert.ok(block.includes('weightGoal'), 'Bestehendes weightGoal-Feld sollte weiterhin gespeichert werden');
});
