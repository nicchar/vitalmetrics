import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  TRADITIONAL_PERSPECTIVES,
  TRADITIONAL_GENERAL_NOTE,
  TRADITIONAL_DISCLAIMER,
  getTraditionalPerspectiveFor,
} from '../../app/src/domain/traditionalPerspectives.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(readFileSync(path.join(__dirname, '../../app/src/data/biomarkerCatalog.json'), 'utf-8'));
const validIds = new Set(catalog.biomarkers.map(b => b.id));

test('TRADITIONAL_DISCLAIMER: erwaehnt explizit "keine EFSA-zugelassene" und "nicht ... belegt"', () => {
  assert.ok(TRADITIONAL_DISCLAIMER.includes('keine EFSA-zugelassene'));
  assert.ok(TRADITIONAL_DISCLAIMER.toLowerCase().includes('nicht'));
});

test('TRADITIONAL_PERSPECTIVES: jeder Key ist eine gueltige Biomarker-ID mit nicht-leerem Text', () => {
  for (const [id, text] of Object.entries(TRADITIONAL_PERSPECTIVES)) {
    assert.ok(validIds.has(id), `Unbekannte Biomarker-ID: ${id}`);
    assert.ok(text.length > 20);
  }
});

test('getTraditionalPerspectiveFor: liefert Text fuer eisen, null fuer Naehrstoffe ohne Eintrag', () => {
  assert.ok(getTraditionalPerspectiveFor('eisen'));
  assert.equal(getTraditionalPerspectiveFor('vitamin_d'), null);
  assert.equal(getTraditionalPerspectiveFor('nicht_vorhanden'), null);
});

test('TRADITIONAL_GENERAL_NOTE: vorhanden und nicht leer', () => {
  assert.ok(TRADITIONAL_GENERAL_NOTE.length > 20);
});
