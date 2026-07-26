import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { NUTRIENT_INTERACTIONS, getInteractionsFor } from '../../app/src/domain/nutrientInteractions.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(readFileSync(path.join(__dirname, '../../app/src/data/biomarkerCatalog.json'), 'utf-8'));
const validIds = new Set(catalog.biomarkers.map(b => b.id));
const LIFESTYLE_FACTORS = new Set(['alkohol', 'koffein', 'rauchen', 'fett']);

test('NUTRIENT_INTERACTIONS: jeder Eintrag hat a, b, effect (foerdert/hemmt) und nicht-leeren Text', () => {
  for (const entry of NUTRIENT_INTERACTIONS) {
    assert.equal(typeof entry.a, 'string');
    assert.equal(typeof entry.b, 'string');
    assert.ok(['foerdert', 'hemmt'].includes(entry.effect));
    assert.ok(entry.text.length > 10);
  }
});

test('NUTRIENT_INTERACTIONS: a/b sind entweder gueltige Biomarker-IDs oder bekannte Lebensstil-Faktoren', () => {
  for (const entry of NUTRIENT_INTERACTIONS) {
    for (const side of [entry.a, entry.b]) {
      assert.ok(
        validIds.has(side) || LIFESTYLE_FACTORS.has(side),
        `Unbekannte ID/Faktor in Interaktion: ${side}`
      );
    }
  }
});

test('NUTRIENT_INTERACTIONS: enthaelt die 8 in Experten-Review 4 (Block F) ergaenzten Zusammenhaenge', () => {
  const pairs = NUTRIENT_INTERACTIONS.map(i => `${i.a}|${i.b}`);
  assert.ok(pairs.includes('magnesium|vitamin_d'));
  assert.ok(pairs.includes('vitamin_d|vitamin_k'));
  assert.ok(pairs.includes('vitamin_c|vitamin_e'));
  assert.ok(pairs.includes('omega3|vitamin_e'));
  assert.ok(pairs.includes('vitamin_b6|homocystein'));
  assert.ok(pairs.includes('vitamin_b9|homocystein'));
  assert.ok(pairs.includes('vitamin_b12|homocystein'));
  assert.ok(pairs.includes('zink|vitamin_a'));
  assert.ok(pairs.includes('selen|jod'));
  assert.ok(pairs.includes('vitamin_a|eisen'));
});

test('getInteractionsFor: liefert beide Seiten (als a und als b) inkl. partner-Feld', () => {
  const asA = getInteractionsFor('vitamin_d');
  assert.ok(asA.length > 0);
  for (const i of asA) {
    assert.ok(i.partner);
    assert.ok(i.partner === 'vitamin_d' ? false : true); // partner ist NIE die eigene ID
  }
  // magnesium+vitamin_d wurde als {a: magnesium, b: vitamin_d} hinterlegt -
  // getInteractionsFor('vitamin_d') muss diesen Eintrag trotzdem finden (als b).
  assert.ok(asA.some(i => i.partner === 'magnesium'));
});

test('getInteractionsFor: unbekannte ID liefert leeres Array, kein Fehler', () => {
  assert.deepEqual(getInteractionsFor('nicht_vorhanden'), []);
});
