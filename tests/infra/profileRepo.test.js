import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// profileRepo -> sqlite.js -> localStorage. In der App (Browser/Capacitor
// WebView) ist das immer vorhanden, im Node-Testlauf brauchen wir einen
// minimalen In-Memory-Ersatz, bevor das Modul importiert wird.
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

const { profileRepo } = await import('../../app/src/infra/db/repositories/profileRepo.js');

beforeEach(() => {
  globalThis.localStorage.clear();
});

/**
 * profileRepo.test.js
 *
 * Review 11 (19.08.2026): profileRepo.defaults um height (cm) und
 * activityLevel erweitert, für die grobe Grundumsatz-/Protein-Einschätzung
 * (domain/energyNeeds.js). Beide bewusst optional (null/''), damit
 * Bestandsprofile ohne diese Felder nicht brechen.
 */

test('profileRepo.get(): height und activityLevel sind standardmäßig null bzw. leer', () => {
  const profile = profileRepo.get();
  assert.equal(profile.height, null);
  assert.equal(profile.activityLevel, '');
});

test('profileRepo.save(): height und activityLevel lassen sich setzen und bleiben über get() erhalten', () => {
  profileRepo.save({ height: 168, activityLevel: 'leicht_aktiv' });
  const profile = profileRepo.get();
  assert.equal(profile.height, 168);
  assert.equal(profile.activityLevel, 'leicht_aktiv');
});

test('profileRepo.save(): bestehende Felder (z.B. sex) bleiben beim Speichern von height/activityLevel unverändert (Merge, kein Überschreiben)', () => {
  profileRepo.save({ sex: 'f', weightGoal: 65 });
  profileRepo.save({ height: 170 });
  const profile = profileRepo.get();
  assert.equal(profile.sex, 'f');
  assert.equal(profile.weightGoal, 65);
  assert.equal(profile.height, 170);
});
