import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { getInsightsFor, groupByCluster, EVIDENCE } from '../../app/src/domain/nutrientInsights.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const insightsData = JSON.parse(readFileSync(path.join(__dirname, '../../app/src/data/insightsByNutrient.json'), 'utf-8'));
const catalog = JSON.parse(readFileSync(path.join(__dirname, '../../app/src/data/biomarkerCatalog.json'), 'utf-8'));
const validIds = new Set(catalog.biomarkers.map(b => b.id));

test('insightsByNutrient.json: ist nicht mehr leer (Block F Phase 1) und jeder Key ist eine gueltige Biomarker-ID', () => {
  const keys = Object.keys(insightsData);
  assert.ok(keys.length > 0);
  for (const key of keys) assert.ok(validIds.has(key), `Unbekannte Biomarker-ID: ${key}`);
});

test('insightsByNutrient.json: jeder Eintrag hat cluster, evidence (gueltiger EVIDENCE-Wert) und Text', () => {
  const validEvidence = Object.values(EVIDENCE);
  for (const [id, insights] of Object.entries(insightsData)) {
    assert.ok(Array.isArray(insights) && insights.length > 0, `Keine Insights fuer ${id}`);
    for (const insight of insights) {
      assert.equal(typeof insight.cluster, 'string');
      assert.ok(insight.cluster.length > 0);
      assert.ok(validEvidence.includes(insight.evidence), `Ungueltiger evidence-Wert bei ${id}: ${insight.evidence}`);
      assert.ok(insight.text.length > 10);
    }
  }
});

test('getInsightsFor: liefert die hinterlegten Insights fuer eine bekannte ID', () => {
  const insights = getInsightsFor(insightsData, 'vitamin_b12');
  assert.ok(insights.length >= 1);
  assert.ok(insights.some(i => i.cluster === 'Nervensystem & Stimmung'));
});

test('getInsightsFor: leeres Array fuer Naehrstoffe ohne Insights oder unbekannte ID, kein Fehler', () => {
  assert.deepEqual(getInsightsFor(insightsData, 'nicht_vorhanden'), []);
  assert.deepEqual(getInsightsFor(null, 'vitamin_d'), []);
});

test('groupByCluster: fasst mehrere Naehrstoffe nach Cluster zusammen, jedes Item traegt seine biomarkerId', () => {
  const grouped = groupByCluster(insightsData, ['vitamin_b12', 'magnesium', 'vitamin_c']);
  assert.ok(grouped['Immunsystem'].some(i => i.biomarkerId === 'vitamin_c'));
  assert.ok(grouped['Energie & Konzentration'].some(i => i.biomarkerId === 'magnesium'));
});
