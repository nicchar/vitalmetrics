/**
 * checkinHintsRepo.js – WellANNI 2.2
 * Merkt sich, wann ein Befindens-Hinweis weggetippt wurde: { area: 'YYYY-MM-DD' }.
 */
import { storage } from '../sqlite.js';

export const CHECKIN_HINTS_KEY = 'vm_checkin_hints';
const SCHEMA_VERSION = 1;

export const checkinHintsRepo = {
  getAll() {
    return storage.getVersioned(CHECKIN_HINTS_KEY, SCHEMA_VERSION) || {};
  },
  dismiss(area, dateIso) {
    storage.setVersioned(CHECKIN_HINTS_KEY, { ...this.getAll(), [area]: dateIso }, SCHEMA_VERSION);
  },
  replaceAll(all) {
    storage.setVersioned(CHECKIN_HINTS_KEY, all && typeof all === 'object' ? all : {}, SCHEMA_VERSION);
  },
};
