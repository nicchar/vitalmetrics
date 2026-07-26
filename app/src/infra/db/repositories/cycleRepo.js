/**
 * cycleRepo.js
 *
 * Speichert Periodenstarts + berechnet Zykluslänge, aktuelle Phase und
 * Vorhersage des nächsten Zyklus. Schlüssel 'vm_cycle'.
 */
import { storage } from '../sqlite.js';
import { getPhaseForDate } from '../../../domain/cycle.js';

const KEY = 'vm_cycle';
const SCHEMA_VERSION = 1;

export const cycleRepo = {
  get() {
    return Object.assign({ periodStarts: [], periodLength: 5, avgCycleLength: null }, storage.getVersioned(KEY, SCHEMA_VERSION) || {});
  },

  save(data) {
    storage.setVersioned(KEY, data, SCHEMA_VERSION);
  },

  /** Berechnet Zykluslängen aus den Abständen zwischen den Periodenstarts */
  calcStats() {
    const d = this.get();
    const starts = [...d.periodStarts].sort();
    if (starts.length < 2) return { avgCycle: null, cycles: [] };
    const cycles = [];
    for (let i = 1; i < starts.length; i++) {
      const days = Math.round((new Date(starts[i]) - new Date(starts[i - 1])) / 86400000);
      if (days >= 15 && days <= 60) cycles.push(days); // plausibler Bereich
    }
    const avg = cycles.length ? Math.round(cycles.reduce((a, b) => a + b, 0) / cycles.length) : null;
    return { avgCycle: avg, cycles };
  },

  getCurrentPhase() {
    const d = this.get();
    if (!d.periodStarts.length) return null;
    const stats = this.calcStats();
    const today = new Date().toISOString().slice(0, 10);
    return getPhaseForDate(d, today, stats.avgCycle);
  },

  /** Zyklusphase für ein beliebiges (auch vergangenes) Datum, siehe domain/cycle.js. */
  getPhaseFor(dateStr) {
    const d = this.get();
    const stats = this.calcStats();
    return getPhaseForDate(d, dateStr, stats.avgCycle);
  },

  predictNext() {
    const d = this.get();
    const starts = [...d.periodStarts].sort();
    if (!starts.length) return null;
    const stats = this.calcStats();
    const cl = stats.avgCycle || d.avgCycleLength || 28;
    const last = new Date(starts[starts.length - 1]);
    const next = new Date(last);
    next.setDate(next.getDate() + cl);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysUntil = Math.round((next - today) / 86400000);
    return { date: next.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }), daysUntil, cl };
  },
};
