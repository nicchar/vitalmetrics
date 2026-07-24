/**
 * nutritionRepo.js
 *
 * Speichert tägliche Ernährungseinträge unter 'vm_nutrition', gruppiert nach
 * Datum. Jeder Eintrag: { food: {...Nährwerte pro 100g}, grams }.
 */
import { storage } from '../sqlite.js';

const KEY = 'vm_nutrition';
const SCHEMA_VERSION = 1;
const MICRO_KEYS = ['vit_a', 'vit_d', 'vit_e', 'vit_k', 'vit_c', 'b1', 'b2', 'b3', 'b6', 'b12', 'folat', 'eisen', 'zink', 'mag', 'cal'];

export const nutritionRepo = {
  _load() {
    return storage.getVersioned(KEY, SCHEMA_VERSION) || {};
  },

  getDay(dateStr) {
    return this._load()[dateStr] || [];
  },

  addEntry(dateStr, entry) {
    const all = this._load();
    all[dateStr] = [...(all[dateStr] || []), entry];
    storage.setVersioned(KEY, all, SCHEMA_VERSION);
  },

  removeEntry(dateStr, idx) {
    const all = this._load();
    all[dateStr] = (all[dateStr] || []).filter((_, i) => i !== idx);
    storage.setVersioned(KEY, all, SCHEMA_VERSION);
  },

  getDayTotals(dateStr) {
    const entries = this.getDay(dateStr);
    const totals = Object.fromEntries(MICRO_KEYS.map(k => [k, 0]));
    totals.kcal = 0;
    totals.protein = 0;
    totals.fat = 0;
    totals.carbs = 0;
    for (const e of entries) {
      const food = e.food;
      if (!food) continue;
      const factor = e.grams / 100;
      totals.kcal += Math.round(food.kal * factor);
      totals.protein = Math.round((totals.protein + (food.protein || 0) * factor) * 10) / 10;
      totals.fat = Math.round((totals.fat + (food.fat || 0) * factor) * 10) / 10;
      totals.carbs = Math.round((totals.carbs + (food.carbs || 0) * factor) * 10) / 10;
      for (const k of MICRO_KEYS) totals[k] = Math.round((totals[k] + (food[k] || 0) * factor) * 10) / 10;
    }
    return totals;
  },

  /**
   * Liefert die letzten `numDays` Kalendertage (aufsteigend sortiert, heute
   * als letzter Eintrag) als ISO-Datumsstrings 'YYYY-MM-DD'.
   */
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

  /**
   * Liefert die Tages-Totals (kcal + Mikronährstoffe) der letzten 7 Tage,
   * genutzt für den Wochenrückblick-Screen (Block E). Analog zu
   * activityRepo.getLast7Days().
   */
  getLast7DaysTotals() {
    return this._recentDates(7).map(date => ({ date, ...this.getDayTotals(date) }));
  },

  /**
   * Zufuhr-Deckung (%) je Tag der letzten `numDays` Tage für einen einzelnen
   * Mikronährstoff-Schlüssel (z. B. 'vit_d'), berechnet gegen den
   * DGE-Referenzwert `refValue`. Genutzt für den Verlaufs-Chart in trend.js
   * (Entscheidung 7 - Zufuhr-Tracking statt Laborwert-Modell).
   *
   * @returns {{date: string, pct: number, amount: number}[]}
   */
  getCoverageHistory(intakeKey, refValue, numDays = 14) {
    if (!refValue) return [];
    return this._recentDates(numDays).map(date => {
      const totals = this.getDayTotals(date);
      const amount = totals[intakeKey] || 0;
      const pct = Math.min(150, Math.round((amount / refValue) * 100));
      return { date, pct, amount };
    });
  },

  /** Rohdaten für Export/Import (Backup-Funktion, Juli 2026) */
  getAll() {
    return this._load();
  },
  replaceAll(all) {
    storage.setVersioned(KEY, all && typeof all === 'object' ? all : {}, SCHEMA_VERSION);
  },

  /**
   * Häufig gegessene Lebensmittel der letzten `days` Tage, meistgenutzt zuerst
   * (Alltagsreibung-Review Juli 2026: kein manuelles Favoriten-System nötig -
   * die App leitet "Favoriten" automatisch aus dem tatsächlichen Verlauf ab,
   * inkl. der zuletzt verwendeten Grammzahl für einen echten Ein-Klick-Eintrag).
   * @returns {{food: object, grams: number, count: number}[]}
   */
  getFrequentFoods(days = 30, limit = 8) {
    const all = this._load();
    const dates = this._recentDates(days);
    const byKey = new Map();
    for (const date of dates) {
      for (const entry of (all[date] || [])) {
        if (!entry.food) continue;
        const key = entry.food.id || entry.food.name;
        if (!key) continue;
        const existing = byKey.get(key);
        if (existing) {
          existing.count += 1;
          existing.food = entry.food;
          existing.grams = entry.grams;
        } else {
          byKey.set(key, { food: entry.food, grams: entry.grams, count: 1 });
        }
      }
    }
    return [...byKey.values()].sort((a, b) => b.count - a.count).slice(0, limit);
  },
};
