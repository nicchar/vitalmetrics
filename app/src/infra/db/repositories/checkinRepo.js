/**
 * checkinRepo.js – WellANNI 2.2
 *
 * Täglicher Befindens-Check-in ("Wie geht's dir heute?") unter 'vm_checkin',
 * gruppiert nach Datum: { 'YYYY-MM-DD': { energie, schlaf, bauch, stimmung } }
 * mit Werten 1–5. Rein lokal, Teil der Gesundheitsdaten-Einwilligung
 * (Version 2, siehe domain/consent.js), in Export und Löschen enthalten.
 */
import { storage } from '../sqlite.js';

export const CHECKIN_KEY = 'vm_checkin';
const SCHEMA_VERSION = 1;

export const checkinRepo = {
  _load() {
    return storage.getVersioned(CHECKIN_KEY, SCHEMA_VERSION) || {};
  },
  getDay(dateStr) {
    return this._load()[dateStr] || {};
  },
  /** Setzt einen einzelnen Bereich (z. B. 'energie') für den Tag. */
  setValue(dateStr, area, value) {
    const all = this._load();
    all[dateStr] = { ...(all[dateStr] || {}), [area]: value };
    storage.setVersioned(CHECKIN_KEY, all, SCHEMA_VERSION);
  },
  /** Letzte `days` Tage aufsteigend, heute zuletzt. */
  getRecent(days = 7) {
    const all = this._load();
    const out = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const date = d.toISOString().slice(0, 10);
      out.push({ date, ...(all[date] || {}) });
    }
    return out;
  },
  getAll() {
    return this._load();
  },
  replaceAll(all) {
    storage.setVersioned(CHECKIN_KEY, all && typeof all === 'object' ? all : {}, SCHEMA_VERSION);
  },
};
