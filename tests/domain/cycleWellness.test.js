import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  CYCLE_WELLNESS_CLUSTERS, TRADITIONAL_PHYTO_NOTE, PMDS_LEARNING_CONTENT, EVIDENCE,
} from '../../app/src/domain/cycleWellness.js';
import { TRADITIONAL_DISCLAIMER } from '../../app/src/domain/traditionalPerspectives.js';

test('CYCLE_WELLNESS_CLUSTERS: jedes Item hat gueltige Evidenz und nicht-leeren Text', () => {
  const validEvidence = Object.values(EVIDENCE);
  for (const cluster of CYCLE_WELLNESS_CLUSTERS) {
    assert.ok(cluster.title && cluster.intro, `${cluster.id}: Titel/Intro fehlt`);
    for (const item of cluster.items) {
      assert.ok(validEvidence.includes(item.evidence), `${cluster.id}/${item.id}: ungueltige Evidenz "${item.evidence}"`);
      assert.ok(item.text?.length > 10, `${cluster.id}/${item.id}: Text zu kurz/fehlt`);
    }
  }
});

test('CYCLE_WELLNESS_CLUSTERS: deckt PMS, Praemenopause und Menopause ab', () => {
  const ids = CYCLE_WELLNESS_CLUSTERS.map(c => c.id);
  assert.ok(ids.includes('pms'));
  assert.ok(ids.includes('praemenopause'));
  assert.ok(ids.includes('menopause'));
});

test('TRADITIONAL_PHYTO_NOTE: erwaehnt Vitex/Cimicifuga nur generisch ohne Wirkversprechen, verweist auf aerztliche/apothekerliche Beratung', () => {
  assert.match(TRADITIONAL_PHYTO_NOTE, /Mönchspfeffer/);
  assert.match(TRADITIONAL_PHYTO_NOTE, /Traubensilberkerze/);
  assert.match(TRADITIONAL_PHYTO_NOTE, /ärztliche.*Beratung|apothekerliche Beratung/);
  // Darf keine Dosierungsangabe enthalten (Regulatory-Affairs-Vorgabe)
  assert.doesNotMatch(TRADITIONAL_PHYTO_NOTE, /\d+\s*mg/);
});

test('PMDS_LEARNING_CONTENT: enthaelt expliziten Hinweis, dass keine eigenen Trackingdaten bewertet werden', () => {
  assert.match(PMDS_LEARNING_CONTENT.hint, /keine eigenen Trackingdaten|bewertet keine/);
  assert.match(PMDS_LEARNING_CONTENT.hint, /ärztliche|therapeutische/);
});

test('PMDS_LEARNING_CONTENT: Text selbst nennt keinen Bezug zu "deine" Symptome/Eintraege (reiner Lerninhalt, nicht personalisiert)', () => {
  assert.doesNotMatch(PMDS_LEARNING_CONTENT.text, /dein(e)?\s+(symptom|eintrag|tracking)/i);
});

test('TRADITIONAL_DISCLAIMER (wiederverwendet aus traditionalPerspectives.js) ist vorhanden und enthaelt die Pflichtformulierung', () => {
  assert.match(TRADITIONAL_DISCLAIMER, /keine EFSA-zugelassene/);
});
