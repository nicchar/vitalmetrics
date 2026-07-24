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

const { dataExportService, gatherAllData, applyAllData, EXPORT_FORMAT_VERSION } =
  await import('../../app/src/infra/data/dataExportService.js');
const { profileRepo } = await import('../../app/src/infra/db/repositories/profileRepo.js');
const { measurementRepo } = await import('../../app/src/infra/db/repositories/measurementRepo.js');
const { hydrationRepo } = await import('../../app/src/infra/db/repositories/hydrationRepo.js');
const { cravingsRepo } = await import('../../app/src/infra/db/repositories/cravingsRepo.js');

beforeEach(() => {
  globalThis.localStorage.clear();
});

test('gatherAllData: enthält alle erwarteten Bereiche', () => {
  const data = gatherAllData();
  for (const key of ['profile', 'measurements', 'nutrition', 'activity', 'cycle', 'fasting', 'glucoseDay', 'cravings', 'mealPlan', 'hydration', 'sleep']) {
    assert.ok(key in data, `Bereich fehlt: ${key}`);
  }
});

test('gatherAllData/applyAllData: Rundreise erhält Profil, Messwerte und Hydration', () => {
  profileRepo.save({ name: 'Nicole', sex: 'f' });
  measurementRepo.add({ biomarkerId: 'vitamin_d', value: 45, date: '2026-07-01' });
  hydrationRepo.setDay('2026-07-01', 1500);
  cravingsRepo.saveAll([{ date: '2026-07-01', mood: 'gestresst' }]);

  const exported = gatherAllData();

  // Zustand "verlieren" (z.B. Geräte-/App-Wechsel simulieren)
  globalThis.localStorage.clear();
  assert.equal(profileRepo.get().name, ''); // zurueck auf Default

  applyAllData(exported);

  assert.equal(profileRepo.get().name, 'Nicole');
  assert.equal(measurementRepo.getAll().length, 1);
  assert.equal(measurementRepo.getAll()[0].value, 45);
  assert.equal(hydrationRepo.getDay('2026-07-01'), 1500);
  assert.equal(cravingsRepo.getAll().length, 1);
});

test('exportData: liefert in einer Node-Umgebung ohne DOM/Capacitor trotzdem ein gültiges JSON', async () => {
  profileRepo.save({ name: 'Testnutzerin' });
  const result = await dataExportService.exportData();
  assert.equal(result.ok, true);
  assert.equal(result.mode, 'json');
  const parsed = JSON.parse(result.json);
  assert.equal(parsed.exportFormatVersion, EXPORT_FORMAT_VERSION);
  assert.ok(parsed.exportedAt);
  assert.equal(parsed.data.profile.name, 'Testnutzerin');
});

test('importData: lehnt ungültiges JSON sauber ab', () => {
  const result = dataExportService.importData('{ das ist kein json');
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'invalid-json');
});

test('importData: lehnt valides JSON ohne Backup-Format ab', () => {
  const result = dataExportService.importData(JSON.stringify({ foo: 'bar' }));
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'invalid-format');
});

test('importData: übernimmt ein gültiges Backup', () => {
  const backup = {
    exportFormatVersion: EXPORT_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    data: { profile: { name: 'Aus Backup', sex: 'f' } },
  };
  const result = dataExportService.importData(JSON.stringify(backup));
  assert.equal(result.ok, true);
  assert.equal(profileRepo.get().name, 'Aus Backup');
});
