import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { NUTRIENT_TIMING, getTimingHintFor, EVIDENCE } from '../../app/src/domain/nutrientTiming.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(readFileSync(path.join(__dirname, '../../app/src/data/biomarkerCatalog.json'), 'utf-8'));
const validIds = new Set(catalog.biomarkers.map(b => b.id));

test('NUTRIENT_TIMING: jeder Key ist eine gueltige Biomarker-ID', () => {
  for (const id of Object.keys(NUTRIENT_TIMING)) {
    assert.ok(validIds.has(id), `Unbekannte Biomarker-ID: ${id}`);
  }
});

test('NUTRIENT_TIMING: jeder Eintrag hat Text und gueltigen evidence-Wert, keine Dosierungssprache', () => {
  const validEvidence = Object.values(EVIDENCE);
  for (const [id, hint] of Object.entries(NUTRIENT_TIMING)) {
    assert.ok(hint.text.length > 10, `Zu kurzer/leerer Text bei ${id}`);
    assert.ok(validEvidence.includes(hint.evidence));
    // Regulatory-Affairs-Vorgabe (Review 4): keine Mengen-/Dosierungsanweisung wie "mg" o.ae. im Fliesstext
    assert.ok(!/\bmg\b/.test(hint.text) || id === 'calcium', `Moeglicher Dosierungsbezug bei ${id}: ${hint.text}`);
  }
});

test('getTimingHintFor: liefert Hinweis fuer bekannte ID, null fuer unbekannte/nicht hinterlegte ID', () => {
  assert.ok(getTimingHintFor('vitamin_d'));
  assert.ok(getTimingHintFor('magnesium'));
  assert.equal(getTimingHintFor('nicht_vorhanden'), null);
  assert.equal(getTimingHintFor('homocystein'), null); // Laborwert, kein Einnahme-Hinweis sinnvoll
});
