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

const { cycleSymptomsRepo } = await import('../../app/src/infra/db/repositories/cycleSymptomsRepo.js');

beforeEach(() => {
  globalThis.localStorage.clear();
});

test('getAll: leeres Array ohne Eintraege', () => {
  assert.deepEqual(cycleSymptomsRepo.getAll(), []);
});

test('addEntry + getAll: speichert Eintrag mit id/tags/note', () => {
  cycleSymptomsRepo.addEntry({ date: '2026-07-20', tags: ['kraempfe', 'erschoepfung'], note: 'starker Tag' });
  const all = cycleSymptomsRepo.getAll();
  assert.equal(all.length, 1);
  assert.deepEqual(all[0].tags, ['kraempfe', 'erschoepfung']);
  assert.equal(all[0].note, 'starker Tag');
  assert.ok(all[0].id);
});

test('getForDate: filtert nur Eintraege des angefragten Datums', () => {
  cycleSymptomsRepo.addEntry({ date: '2026-07-20', tags: ['kraempfe'] });
  cycleSymptomsRepo.addEntry({ date: '2026-07-21', tags: ['hitzewallungen'] });
  const forDay = cycleSymptomsRepo.getForDate('2026-07-20');
  assert.equal(forDay.length, 1);
  assert.deepEqual(forDay[0].tags, ['kraempfe']);
});

test('removeEntry: entfernt genau den Eintrag mit der uebergebenen id', () => {
  cycleSymptomsRepo.addEntry({ date: '2026-07-20', tags: ['kraempfe'] });
  const [entry] = cycleSymptomsRepo.getAll();
  cycleSymptomsRepo.removeEntry(entry.id);
  assert.equal(cycleSymptomsRepo.getAll().length, 0);
});

test('cycleSymptomsRepo bietet KEINE Analyse-/Auswertungsfunktion (nur tracken, nicht bewerten)', () => {
  const forbidden = ['analyze', 'getPattern', 'getStats', 'getScore', 'getSummary'];
  for (const fn of forbidden) {
    assert.equal(typeof cycleSymptomsRepo[fn], 'undefined', `cycleSymptomsRepo.${fn} sollte nicht existieren`);
  }
});
