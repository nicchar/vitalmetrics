/**
 * hydrationRepo.js
 *
 * Einfaches Trinkmengen-Tracking (ml/Tag), gruppiert nach Datum unter
 * 'vm_hydration'. Teil der "Hautgesundheit & Vitalität"-Funktion (Beauty-
 * Feature, Panel-Konsens: Hydration ist einer der am besten belegten
 * Einzelfaktoren für Hautzustand und fehlte bisher komplett im Datenmodell).
 *
 * Referenzwert bewusst als allgemeine Wellness-Richtgröße (nicht als
 * medizinische Dosierungsempfehlung) gehalten: DGE nennt ca. 1,5-2 Liter
 * Getränke pro Tag als übliche Praxisrichtgröße für gesunde Erwachsene.
 */
import { storage } from '../sqlite.js';

const KEY = 'vm_hydration';
const SCHEMA_VERSION = 1;

// Allgemeine Richtgröße, keine individuelle Dosierungsempfehlung.
export const HYDRATION_REF_ML = 1750;

export const hydrationRepo = {
  _load() {
    return storage.getVersioned(KEY, SCHEMA_VERSION) || {};
  },

  getDay(dateStr) {
    return this._load()[dateStr] || 0;
  },

  addMl(dateStr, ml) {
    const all = this._load();
    all[dateStr] = (all[dateStr] || 0) + ml;
    storage.setVersioned(KEY, all, SCHEMA_VERSION);
    return all[dateStr];
  },

  setDay(dateStr, ml) {
    const all = this._load();
    all[dateStr] = ml;
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
    return this._recentDates(7).map(date => ({ date, ml: this.getDay(date) }));
  },

  /** Rohdaten für Export/Import (Backup-Funktion, Juli 2026) */
  getAll() {
    return this._load();
  },
  replaceAll(all) {
    storage.setVersioned(KEY, all && typeof all === 'object' ? all : {}, SCHEMA_VERSION);
  },
};
