import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

const { journalRepo, JOURNAL_MAX_LENGTH } = await import('../../app/src/infra/db/repositories/journalRepo.js');
const { gatherAllData, applyAllData, USER_DATA_KEYS } = await import('../../app/src/infra/data/dataExportService.js');

beforeEach(() => globalThis.localStorage.clear());

test('journalRepo: speichert Felder pro Tag und entfernt leere Tage', () => {
  journalRepo.setField('2026-10-30', 'good', 'Spaziergang in der Sonne');
  journalRepo.setField('2026-10-30', 'note', 'Abends nicht genascht');
  assert.deepEqual(journalRepo.getDay('2026-10-30'), { good: 'Spaziergang in der Sonne', note: 'Abends nicht genascht' });
  journalRepo.setField('2026-10-30', 'good', '');
  journalRepo.setField('2026-10-30', 'note', '  ');
  assert.deepEqual(journalRepo.getAll(), {});
});

test('journalRepo: unbekannte Felder werden ignoriert, Text wird gekürzt', () => {
  journalRepo.setField('2026-10-30', 'gewicht', '80');
  assert.deepEqual(journalRepo.getAll(), {});
  journalRepo.setField('2026-10-30', 'note', 'x'.repeat(JOURNAL_MAX_LENGTH + 50));
  assert.equal(journalRepo.getDay('2026-10-30').note.length, JOURNAL_MAX_LENGTH);
});

test('Tagebuch ist in Export, Import und Löschen enthalten', () => {
  journalRepo.setField('2026-10-30', 'good', 'Mit Freundin gekocht');
  const data = gatherAllData();
  assert.deepEqual(data.journal, { '2026-10-30': { good: 'Mit Freundin gekocht' } });
  globalThis.localStorage.clear();
  applyAllData(data);
  assert.equal(journalRepo.getDay('2026-10-30').good, 'Mit Freundin gekocht');
  assert.ok(USER_DATA_KEYS.includes('vm_journal'));
});
