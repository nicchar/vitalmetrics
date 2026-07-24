/**
 * sleepRepo.js
 *
 * Einfaches Schlaf-Tracking: Stunden + subjektive Qualität (1-5) pro Tag,
 * unter 'vm_sleep'. Bewusst simpel gehalten - KEINE Schlafphasen-Analyse,
 * kein Schlafapnoe-Screening, keine medizinische Diagnostik (Panel-Konsens:
 * reines Wellness-Self-Tracking, passt zur "kein Medizinprodukt"-Positionierung
 * der gesamten App).
 */
import { storage } from '../sqlite.js';

const KEY = 'vm_sleep';
const SCHEMA_VERSION = 1;

// Allgemeine Wellness-Richtgröße für Erwachsene (7-9h), keine individuelle
// medizinische Empfehlung.
export const SLEEP_REF_HOURS = 8;

export const sleepRepo = {
  _load() {
    return storage.getVersioned(KEY, SCHEMA_VERSION) || {};
  },

  getDay(dateStr) {
    return this._load()[dateStr] || null;
  },

  /**
   * @param {string} dateStr
   * @param {{ hours: number, quality: number }} entry quality 1-5
   */
  setDay(dateStr, entry) {
    const all = this._load();
    all[dateStr] = entry;
    storage.setVersioned(KEY, all, SCHEMA_VERSION);
  },

  _recentDates(numDays) {
    const dates = [];
    const today = new Date();
    for (let i = numDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().slice(0, 10));
    }
    return dates;
  },

  getLast7Days() {
    return this._recentDates(7).map(date => ({ date, ...(this.getDay(date) || { hours: null, quality: null }) }));
  },

  /** Rohdaten für Export/Import (Backup-Funktion, Juli 2026) */
  getAll() {
    return this._load();
  },
  replaceAll(all) {
    storage.setVersioned(KEY, all && typeof all === 'object' ? all : {}, SCHEMA_VERSION);
  },
};
