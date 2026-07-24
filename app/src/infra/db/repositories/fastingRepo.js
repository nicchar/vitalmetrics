/**
 * fastingRepo.js
 *
 * Speichert den Intervallfasten-Status unter 'vitalmetrics_fasting'.
 * Wichtig: exakt der gleiche Schlüssel wie im Monolithen (VitalMetrics.html),
 * damit bestehende Nutzerinnen beim App-Update ihren Streak/Log nicht verlieren.
 */
import { storage } from '../sqlite.js';

const KEY = 'vitalmetrics_fasting';
const SCHEMA_VERSION = 1;
const DEFAULTS = { protocol: '16:8', isActive: false, startTime: null, streak: 0, log: [] };

export const fastingRepo = {
  get() {
    return Object.assign({}, DEFAULTS, storage.getVersioned(KEY, SCHEMA_VERSION) || {});
  },
  save(data) {
    storage.setVersioned(KEY, data, SCHEMA_VERSION);
  },
};
