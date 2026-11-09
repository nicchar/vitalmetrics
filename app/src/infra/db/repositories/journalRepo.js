/**
 * journalRepo.js – WellANNI 2.3 (Nicole, 30.10.2026)
 *
 * Persönliches Tagebuch unter 'vm_journal', gruppiert nach Datum:
 * { 'YYYY-MM-DD': { good: 'Was war heute gut?', note: 'eigener Eintrag' } }
 * Rein lokal, in Export, Import und "Alle Daten löschen" enthalten
 * (siehe infra/data/dataExportService.js).
 */
import { storage } from '../sqlite.js';

export const JOURNAL_KEY = 'vm_journal';
const SCHEMA_VERSION = 1;
export const JOURNAL_MAX_LENGTH = 2000;

function clean(text) {
  return String(text ?? '').slice(0, JOURNAL_MAX_LENGTH);
}

export const journalRepo = {
  _load() {
    return storage.getVersioned(JOURNAL_KEY, SCHEMA_VERSION) || {};
  },
  getDay(dateStr) {
    return this._load()[dateStr] || {};
  },
  /** Setzt ein Feld ('good' oder 'note'). Leere Tage werden entfernt. */
  setField(dateStr, field, text) {
    if (field !== 'good' && field !== 'note') return;
    const all = this._load();
    const day = { ...(all[dateStr] || {}), [field]: clean(text) };
    if (!day.good?.trim() && !day.note?.trim()) delete all[dateStr];
    else all[dateStr] = day;
    storage.setVersioned(JOURNAL_KEY, all, SCHEMA_VERSION);
  },
  getAll() {
    return this._load();
  },
  replaceAll(all) {
    storage.setVersioned(JOURNAL_KEY, all && typeof all === 'object' ? all : {}, SCHEMA_VERSION);
  },
};
