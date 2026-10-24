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

const { checkinRepo, CHECKIN_KEY } = await import('../../app/src/infra/db/repositories/checkinRepo.js');
const { gatherAllData, applyAllData, USER_DATA_KEYS, deleteAllUserData } = await import('../../app/src/infra/data/dataExportService.js');
const { dayAverage, isComplete, CHECKIN_AREAS } = await import('../../app/src/domain/checkin.js');

const today = new Date().toISOString().slice(0, 10);

beforeEach(() => globalThis.localStorage.clear());

test('checkinRepo: leerer Tag liefert {}', () => {
  assert.deepEqual(checkinRepo.getDay(today), {});
});

test('checkinRepo: setValue speichert Bereiche einzeln und überschreibt nur den gewählten', () => {
  checkinRepo.setValue(today, 'energie', 4);
  checkinRepo.setValue(today, 'schlaf', 2);
  checkinRepo.setValue(today, 'energie', 5);
  assert.deepEqual(checkinRepo.getDay(today), { energie: 5, schlaf: 2 });
});

test('checkinRepo: getRecent(7) liefert 7 Tage aufsteigend, heute zuletzt', () => {
  checkinRepo.setValue(today, 'stimmung', 3);
  const recent = checkinRepo.getRecent(7);
  assert.equal(recent.length, 7);
  assert.equal(recent[6].date, today);
  assert.equal(recent[6].stimmung, 3);
  assert.ok(recent[0].date < recent[6].date);
});

test('Check-in ist Teil von Export, Import und "Alle Daten löschen"', () => {
  assert.ok(USER_DATA_KEYS.includes(CHECKIN_KEY));
  checkinRepo.setValue(today, 'bauch', 4);
  const data = gatherAllData();
  assert.deepEqual(data.checkin[today], { bauch: 4 });
  globalThis.localStorage.clear();
  applyAllData(data);
  assert.equal(checkinRepo.getDay(today).bauch, 4);
  deleteAllUserData();
  assert.deepEqual(checkinRepo.getDay(today), {});
});

test('checkin.js: vier Bereiche mit je fünf Stufen', () => {
  assert.deepEqual(CHECKIN_AREAS.map(a => a.key), ['energie', 'schlaf', 'bauch', 'stimmung']);
  for (const a of CHECKIN_AREAS) assert.equal(a.faces.length, 5);
});

test('checkin.js: dayAverage nur über ausgefüllte Bereiche, isComplete erst bei allen vier', () => {
  assert.equal(dayAverage({}), null);
  assert.equal(dayAverage({ energie: 2, schlaf: 4 }), 3);
  assert.equal(isComplete({ energie: 2, schlaf: 4 }), false);
  assert.equal(isComplete({ energie: 2, schlaf: 4, bauch: 3, stimmung: 5 }), true);
});
