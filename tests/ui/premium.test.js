import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = readFileSync(path.resolve(__dirname, '../../app/src/ui/screens/premium.js'), 'utf-8');

/**
 * premium.test.js
 *
 * Review 9 (30.07.2026), Priorisierungsvorschlag Punkt 2: "Kauf
 * wiederherstellen" hatte keinen Erklärtext, was der Button bewirkt
 * (Tester-Persona "Lisa" verstand ihn nicht auf Anhieb).
 */
test('premium.js: "Kauf wiederherstellen"-Button hat einen erklärenden Hinweistext direkt daneben', () => {
  const idxBtn = src.indexOf('id="btn-restore"');
  assert.notEqual(idxBtn, -1, 'Restore-Button fehlt');
  const after = src.slice(idxBtn, idxBtn + 400);
  assert.ok(/andere[ns]? Gerät|bereits gekauft|schon gekauft/i.test(after),
    'Erklärtext direkt nach dem Restore-Button fehlt oder ist zu weit entfernt');
});
