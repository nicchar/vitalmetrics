import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/** Datenschutz-Gap-Analyse 28.09.2026: Regressionsschutz für die Rechtstexte. */
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = f => readFileSync(path.join(ROOT, f), 'utf-8');
const FILES = ['impressum.html', 'agb.html', 'datenschutzerklaerung.html'];

test('Rechtstexte: keine sichtbaren Platzhalter/internen Notizen', () => {
  for (const f of FILES) {
    const s = read(f);
    assert.ok(!/class="placeholder"/.test(s), `${f}: Platzhalter sichtbar`);
    assert.ok(!/Pflichtangabe einer Telefonnummer/.test(s), `${f}: interne Notiz sichtbar`);
  }
});

test('Rechtstexte: kein Verweis auf die abgeschaltete OS-Plattform, kein TMG mehr', () => {
  for (const f of FILES) {
    const s = read(f);
    assert.ok(!s.includes('consumers/odr'), `${f}: OS-Plattform-Link`);
    assert.ok(!/\bTMG\b/.test(s), `${f}: TMG statt DDG`);
  }
});

test('Datenschutzerklärung: nennt Open Food Facts, Art. 9-Einwilligung, Art. 18/21 und das ULD', () => {
  const s = read('datenschutzerklaerung.html');
  for (const needle of ['Open Food Facts', 'Art. 9 Abs. 2 lit. a', 'Art. 18', 'Art. 21', 'ULD']) {
    assert.ok(s.includes(needle), `fehlt: ${needle}`);
  }
  assert.ok(!/geplant in einer späteren Version/.test(s), 'Export ist nicht mehr "geplant"');
});

test('2.2: Datenschutzerklärung ohne Amazon/Partnerlinks, mit Check-in und präzisem Barcode-Scan', () => {
  const s = read('datenschutzerklaerung.html');
  assert.ok(!/Amazon|Partnerlink|Provision/.test(s));
  assert.ok(s.includes('Tägliches Befinden (Check-in)'));
  assert.ok(s.includes('Einwilligungsversion 2'));
  assert.ok(s.includes('Google Code Scanner') && s.includes('keine Kamerabilder'));
  const nums = [...s.matchAll(/<h2>(\d+)\. /g)].map(m => Number(m[1]));
  assert.deepEqual(nums, nums.map((_, i) => i + 1), 'Abschnitte lückenlos nummeriert');
});

test('2.2: AGB ohne Partnerlinks', () => {
  assert.ok(!/Amazon|Partnerlink|Provision/.test(read('agb.html')));
});
