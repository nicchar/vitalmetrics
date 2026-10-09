import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSkinVitalityView, SKIN_VITALITY_CLUSTERS, EVIDENCE } from '../../app/src/domain/skinVitality.js';

const fakeCatalog = {
  biomarkers: [
    { id: 'vitamin_b7', unit: 'µg' },
  ],
};

test('SKIN_VITALITY_CLUSTERS: genau 3 Cluster, alle mit id/title/items', () => {
  assert.equal(SKIN_VITALITY_CLUSTERS.length, 3);
  for (const c of SKIN_VITALITY_CLUSTERS) {
    assert.ok(c.id);
    assert.ok(c.title);
    assert.ok(Array.isArray(c.items) && c.items.length > 0);
  }
});

test('jedes Item hat ein gueltiges Evidenz-Label', () => {
  const validEvidence = Object.values(EVIDENCE);
  for (const cluster of SKIN_VITALITY_CLUSTERS) {
    for (const item of cluster.items) {
      assert.ok(validEvidence.includes(item.evidence), `${item.id} hat ungueltiges Evidence-Label`);
    }
  }
});

test('kein Item enthaelt "Anti-Aging" im Text (Panel-Konsens)', () => {
  for (const cluster of SKIN_VITALITY_CLUSTERS) {
    assert.doesNotMatch(cluster.title, /anti.?aging/i);
    for (const item of cluster.items) {
      assert.doesNotMatch(item.text, /anti.?aging/i);
    }
  }
});

test('buildSkinVitalityView: intake-Item ohne Daten -> tracked false', () => {
  const view = buildSkinVitalityView({ latestAll: {}, dayTotals: {}, dgeRef: {}, catalog: fakeCatalog });
  const hautCluster = view.find(c => c.id === 'haut_haare_naegel');
  const vitC = hautCluster.items.find(i => i.id === 'vitamin_c');
  assert.equal(vitC.status.tracked, false);
});

test('buildSkinVitalityView: intake-Item mit Daten -> berechnet Prozent', () => {
  const view = buildSkinVitalityView({
    latestAll: {},
    dayTotals: { vit_c: 55 },
    dgeRef: { vit_c: { ref: 110 } },
    catalog: fakeCatalog,
  });
  const hautCluster = view.find(c => c.id === 'haut_haare_naegel');
  const vitC = hautCluster.items.find(i => i.id === 'vitamin_c');
  assert.equal(vitC.status.tracked, true);
  assert.match(vitC.status.text, /50%/);
});

test('buildSkinVitalityView: biomarker-Item mit Messwert -> zeigt letzten Wert', () => {
  const view = buildSkinVitalityView({
    latestAll: { vitamin_b7: { value: 45, date: '2026-07-01' } },
    dayTotals: {},
    dgeRef: {},
    catalog: fakeCatalog,
  });
  const hautCluster = view.find(c => c.id === 'haut_haare_naegel');
  const vitaminB7 = hautCluster.items.find(i => i.id === 'vitamin_b7');
  assert.equal(vitaminB7.status.tracked, true);
  assert.match(vitaminB7.status.text, /45/);
});

test('buildSkinVitalityView: info-Item (rauchen) ist immer infoOnly, nie tracked', () => {
  const view = buildSkinVitalityView({ latestAll: {}, dayTotals: {}, dgeRef: {}, catalog: fakeCatalog });
  const lifestyle = view.find(c => c.id === 'lifestyle');
  const rauchen = lifestyle.items.find(i => i.id === 'rauchen');
  assert.equal(rauchen.status.tracked, false);
  assert.equal(rauchen.status.infoOnly, true);
});
