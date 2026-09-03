import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(readFileSync(path.resolve(__dirname, '../../app/src/data/biomarkerCatalog.json'), 'utf-8'));

/**
 * biomarkerCatalog.test.js
 *
 * Review 11 (19.08.2026): neuer Biomarker "hueftumfang" (Hüftumfang) als
 * Bezugsgröße für das Taille-Hüft-Verhältnis (WHR, siehe domain/energyNeeds.js
 * calcWHR). Absichtlich ohne eigenen Referenzbereich (nur im Verhältnis zur
 * Taille aussagekräftig) - anders als die meisten anderen Biomarker im
 * Katalog. Dieser Test schützt vor kaputtem JSON und einer versehentlichen
 * Löschung/Umbenennung des Eintrags.
 */

test('biomarkerCatalog.json: ist valides JSON mit einer nicht-leeren biomarkers-Liste', () => {
  assert.ok(Array.isArray(catalog.biomarkers));
  assert.ok(catalog.biomarkers.length > 0);
});

test('biomarkerCatalog.json: alle Biomarker-IDs sind eindeutig', () => {
  const ids = catalog.biomarkers.map(b => b.id);
  assert.equal(new Set(ids).size, ids.length, 'Es gibt doppelte Biomarker-IDs im Katalog');
});

test('biomarkerCatalog.json: "hueftumfang" existiert, gehört zur Kategorie "body" und hat bewusst keinen eigenen Referenzbereich', () => {
  const hip = catalog.biomarkers.find(b => b.id === 'hueftumfang');
  assert.ok(hip, 'Biomarker "hueftumfang" fehlt');
  assert.equal(hip.category, 'body');
  assert.equal(hip.unit, 'cm');
  assert.equal(hip.refMin, null);
  assert.equal(hip.refMax, null);
  assert.equal(hip.refByGender, null);
});

test('biomarkerCatalog.json: "gewicht" und "taillenumfang" existieren weiterhin unverändert als "body"-Biomarker (Voraussetzung für die Heute-Karte/WHR)', () => {
  const gewicht = catalog.biomarkers.find(b => b.id === 'gewicht');
  const taille = catalog.biomarkers.find(b => b.id === 'taillenumfang');
  assert.ok(gewicht, 'Biomarker "gewicht" fehlt');
  assert.ok(taille, 'Biomarker "taillenumfang" fehlt');
  assert.equal(gewicht.category, 'body');
  assert.equal(taille.category, 'body');
});
