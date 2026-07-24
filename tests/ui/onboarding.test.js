import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * onboarding.test.js
 *
 * QA-Fund (App-Tester-Durchlauf Juli 2026): das Onboarding bot lange nur die
 * Altersgruppen '18-19'/'19-25'/'25-50' an, obwohl domain/nutrition.js schon
 * eigene DGE-Referenzwerte für '51-70'/'70+' hatte, die dadurch nie griffen.
 * Dieser Test ist bewusst ein einfacher Text-basierter Regressionsschutz
 * (kein DOM-Rendering wie router.test.js) - stellt sicher, dass alle fünf
 * Altersgruppen im Markup vorhanden bleiben.
 */
test('onboarding.js bietet alle 5 Altersgruppen an (inkl. 51-70/70+, QA-Fund Juli 2026)', () => {
  const src = readFileSync(path.resolve(__dirname, '../../app/src/ui/screens/onboarding.js'), 'utf-8');
  for (const age of ['18-19', '19-25', '25-50', '51-70', '70+']) {
    assert.ok(src.includes(`data-age="${age}"`), `Altersgruppe "${age}" fehlt im Onboarding-Markup`);
  }
});
