/**
 * activityRepo.js
 *
 * Speichert tägliche Bewegungsdaten (Schritte + Sport-Einträge) unter dem
 * Schlüssel 'vm_activity', gruppiert nach Datum (YYYY-MM-DD).
 */
import { storage } from '../sqlite.js';

const KEY = 'vm_activity';
const SCHEMA_VERSION = 1;
const WEEKDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

export const activityRepo = {
  _load() {
    return storage.getVersioned(KEY, SCHEMA_VERSION) || {};
  },

  getDay(dateStr) {
    return this._load()[dateStr] || { steps: 0, activities: [] };
  },

  saveDay(dateStr, data) {
    const all = this._load();
    all[dateStr] = data;
    storage.setVersioned(KEY, all, SCHEMA_VERSION);
  },

  getLast7Days() {
    const all = this._load();
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const day = all[key] || { steps: 0, activities: [] };
      const totalCalories = (day.activities || []).reduce((s, a) => s + (a.calories || 0), 0);
      result.push({
        date: key,
        day: WEEKDAYS[d.getDay()],
        steps: day.steps || 0,
        totalCalories,
        activities: day.activities || [],
        isToday: i === 0,
      });
    }
    return result;
  },

  /** Rohdaten für Export/Import (Backup-Funktion, Juli 2026) */
  getAll() {
    return this._load();
  },
  replaceAll(all) {
    storage.setVersioned(KEY, all && typeof all === 'object' ? all : {}, SCHEMA_VERSION);
  },
};
