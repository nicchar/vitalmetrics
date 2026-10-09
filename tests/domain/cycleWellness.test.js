import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  CYCLE_WELLNESS_CLUSTERS, EVIDENCE,
} from '../../app/src/domain/cycleWellness.js';
import * as cycleWellnessDomain from '../../app/src/domain/cycleWellness.js';
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

/**
 * Entscheidung 11.09.2026 (nach wiederholten Google-Play-Ablehnungen
 * "Diseases and Conditions Management"): TRADITIONAL_PHYTO_NOTE (nannte
 * Moenchspfeffer/Traubensilberkerze als "Wirkstoffe zugelassener
 * Arzneimittel", warnte vor "Wechselwirkungen mit anderen Medikamenten")
 * und PMDS_LEARNING_CONTENT (benannte psychische Diagnose,
 * "behandlungsbeduerftig", "depressive Verstimmungen") wurden ersatzlos
 * entfernt - wir sind keine Aerzte/Mediziner und geben keine Ratschlaege,
 * nur allgemeingueltige Informationen im Ton eines Frauenmagazins.
 */
test('TRADITIONAL_PHYTO_NOTE und PMDS_LEARNING_CONTENT wurden entfernt (Compliance-Entscheidung 11.09.2026)', () => {
  assert.equal(cycleWellnessDomain.TRADITIONAL_PHYTO_NOTE, undefined);
  assert.equal(cycleWellnessDomain.PMDS_LEARNING_CONTENT, undefined);
});

test('cycleWellness.js: keine Arzneimittel-/Medikamenten-/Diagnose-Sprache mehr im Modul (Regressionsschutz)', () => {
  const src = readFileSync(new URL('../../app/src/domain/cycleWellness.js', import.meta.url), 'utf-8');
  for (const term of ['Arzneimittel', 'Medikament', 'PMDS', 'behandlungsbedürftig', 'depressive Verstimmung']) {
    assert.ok(!src.includes(term), `Modul sollte "${term}" nicht mehr enthalten`);
  }
});

test('TRADITIONAL_DISCLAIMER (wiederverwendet aus traditionalPerspectives.js) ist vorhanden und enthaelt die Pflichtformulierung', () => {
  assert.match(TRADITIONAL_DISCLAIMER, /keine EFSA-zugelassene/);
});
