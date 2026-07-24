/**
 * glucoseDayRepo.js
 *
 * Speichert den Blutzucker-Tagesgang (mehrere Werte pro Tag) unter
 * 'vitalmetrics_glucose_day', gruppiert nach Datum. Gleicher Schlüssel wie im
 * Monolithen für Datenkontinuität bei bestehenden Nutzerinnen.
 */
import { storage } from '../sqlite.js';

const KEY = 'vitalmetrics_glucose_day';
const SCHEMA_VERSION = 1;

export const glucoseDayRepo = {
  _load() {
    return storage.getVersioned(KEY, SCHEMA_VERSION) || {};
  },
  getDay(dateStr) {
    return this._load()[dateStr] || {};
  },
  saveDay(dateStr, entry) {
    const all = this._load();
    all[dateStr] = entry;
    storage.setVersioned(KEY, all, SCHEMA_VERSION);
  },

  /** Rohdaten für Export/Import (Backup-Funktion, Juli 2026) */
  getAll() {
    return this._load();
  },
  replaceAll(all) {
    storage.setVersioned(KEY, all && typeof all === 'object' ? all : {}, SCHEMA_VERSION);
  },
};
