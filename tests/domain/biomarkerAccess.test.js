import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  ACCESS_TIERS,
  ACCESS_TIER_LABELS,
  ACCESS_TIER_ICONS,
  ACCESS_TIER_DESCRIPTIONS,
  getAccessTierBadge,
} from '../../app/src/domain/biomarkerAccess.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VALID_TIERS = Object.values(ACCESS_TIERS);

test('ACCESS_TIERS: genau die 4 erwarteten Stufen', () => {
  assert.deepEqual(VALID_TIERS.sort(), ['diary', 'lab_common', 'lab_specialist', 'selftest'].sort());
});

test('ACCESS_TIER_LABELS/ICONS/DESCRIPTIONS: jede Stufe hat Label, Icon und Beschreibung', () => {
  for (const tier of VALID_TIERS) {
    assert.equal(typeof ACCESS_TIER_LABELS[tier], 'string');
    assert.ok(ACCESS_TIER_LABELS[tier].length > 0);
    assert.equal(typeof ACCESS_TIER_ICONS[tier], 'string');
    assert.ok(ACCESS_TIER_ICONS[tier].length > 0);
    assert.equal(typeof ACCESS_TIER_DESCRIPTIONS[tier], 'string');
    assert.ok(ACCESS_TIER_DESCRIPTIONS[tier].length > 10);
  }
});

test('getAccessTierBadge: liefert Icon + Label kombiniert fuer jede gueltige Stufe', () => {
  for (const tier of VALID_TIERS) {
    const badge = getAccessTierBadge(tier);
    assert.equal(typeof badge, 'string');
    assert.ok(badge.includes(ACCESS_TIER_ICONS[tier]));
    assert.ok(badge.includes(ACCESS_TIER_LABELS[tier]));
  }
});

test('getAccessTierBadge: null bei unbekannter/fehlender Stufe (kein Absturz im UI)', () => {
  assert.equal(getAccessTierBadge('__invalid__'), null);
  assert.equal(getAccessTierBadge(undefined), null);
  assert.equal(getAccessTierBadge(null), null);
});

test('biomarkerCatalog.json: alle 47 Biomarker haben ein gueltiges accessTier-Feld', () => {
  const catalogPath = path.resolve(__dirname, '../../app/src/data/biomarkerCatalog.json');
  const catalog = JSON.parse(readFileSync(catalogPath, 'utf-8'));
  assert.equal(catalog.biomarkers.length, 47);
  const missing = [];
  const invalid = [];
  for (const bm of catalog.biomarkers) {
    if (bm.accessTier == null) missing.push(bm.id);
    else if (!VALID_TIERS.includes(bm.accessTier)) invalid.push(`${bm.id}: ${bm.accessTier}`);
  }
  assert.deepEqual(missing, [], `Biomarker ohne accessTier: ${missing.join(', ')}`);
  assert.deepEqual(invalid, [], `Biomarker mit ungueltigem accessTier: ${invalid.join(', ')}`);
});

test('biomarkerCatalog.json: diary-Stufe deckt sich mit intakeTracking-Flag', () => {
  // Die 15 diary-Biomarker sind genau die, die automatisch aus dem
  // Ernaehrungstagebuch berechnet werden (intakeTracking: true).
  const catalogPath = path.resolve(__dirname, '../../app/src/data/biomarkerCatalog.json');
  const catalog = JSON.parse(readFileSync(catalogPath, 'utf-8'));
  const diaryIds = catalog.biomarkers.filter(b => b.accessTier === 'diary').map(b => b.id).sort();
  const intakeTrackingIds = catalog.biomarkers.filter(b => b.intakeTracking).map(b => b.id).sort();
  assert.deepEqual(diaryIds, intakeTrackingIds);
});
