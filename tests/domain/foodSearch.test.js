import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { rankFoodMatches } from '../../app/src/domain/foodSearch.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * foodSearch.test.js
 *
 * Tester-Fund (31.07.2026): Suche nach "Milch" zeigte nur "Milchspeisen"
 * (Ananasringe im Milchbackteig, Apfelreis mit Milch, ...), aber keine reine
 * Milch. Diese Tests laufen bewusst gegen die ECHTE BLS-4.0-Datenbank
 * (7140 Einträge), nicht gegen ein kleines Fake-Set, damit sie das reale
 * Problem tatsächlich abdecken statt nur die Ranking-Formel isoliert zu prüfen.
 */
const foodDb = JSON.parse(
  readFileSync(path.resolve(__dirname, '../../app/src/data/foodDatabase.json'), 'utf-8')
);

test('foodSearch: "Milch" liefert reine Milch unter den ersten Treffern, nicht nur Milchspeisen', () => {
  const results = rankFoodMatches('Milch', foodDb, 12).map(f => f.name);
  const hasPlainMilk = results.some(n => /^Milch (entrahmt|fettarm)\b/i.test(n));
  assert.ok(hasPlainMilk, `Erwartete reine Milch unter den Top-12, bekam: ${results.join(' | ')}`);
});

test('foodSearch: "Milch" rankt reine Milch vor Kompositum-Süßwaren wie "Milchschokolade"', () => {
  const results = rankFoodMatches('Milch', foodDb, 12).map(f => f.name);
  const idxPlainMilk = results.findIndex(n => /^Milch (entrahmt|fettarm)\b/i.test(n));
  const idxSchoko = results.findIndex(n => /^Milchschokolade/i.test(n));
  assert.notEqual(idxPlainMilk, -1, 'reine Milch fehlt in den Top-12');
  if (idxSchoko !== -1) {
    assert.ok(idxPlainMilk < idxSchoko, 'reine Milch sollte vor "Milchschokolade" stehen');
  }
});

test('foodSearch: exakter Treffer landet immer auf Platz 1', () => {
  const results = rankFoodMatches('Buttermilch', foodDb, 5);
  assert.equal(results[0].name.toLowerCase(), 'buttermilch');
});

test('foodSearch: "Apfel" liefert den rohen Apfel unter den ersten Treffern', () => {
  const results = rankFoodMatches('Apfel', foodDb, 12).map(f => f.name);
  assert.ok(results.some(n => /^Apfel roh$/i.test(n)), `Erwartete "Apfel roh" unter den Top-12, bekam: ${results.join(' | ')}`);
});

test('foodSearch: leere Suche liefert keine Treffer', () => {
  assert.deepEqual(rankFoodMatches('', foodDb, 12), []);
  assert.deepEqual(rankFoodMatches('   ', foodDb, 12), []);
});
