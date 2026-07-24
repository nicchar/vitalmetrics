import { storage } from '../sqlite.js';

const KEY = 'vm_measurements';
const SCHEMA_VERSION = 1;

function load() {
  return storage.getVersioned(KEY, SCHEMA_VERSION) || [];
}

function save(list) {
  storage.setVersioned(KEY, list, SCHEMA_VERSION);
}

export const measurementRepo = {
  /** Add a new measurement { biomarkerId, value, date (ISO string), note? } */
  add(entry) {
    const list = load();
    const item = { id: Date.now(), ...entry };
    list.push(item);
    save(list);
    return item;
  },

  /** Get all measurements for a biomarker, sorted ascending by date */
  getByBiomarker(biomarkerId) {
    return load()
      .filter(m => m.biomarkerId === biomarkerId)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  },

  /** Get the latest measurement for every tracked biomarker */
  getLatestAll() {
    const all = load();
    const map = {};
    for (const m of all) {
      if (!map[m.biomarkerId] || new Date(m.date) > new Date(map[m.biomarkerId].date)) {
        map[m.biomarkerId] = m;
      }
    }
    return map; // { biomarkerId: measurement }
  },

  /** Delete a measurement by id */
  delete(id) {
    const list = load().filter(m => m.id !== id);
    save(list);
  },

  /** Get all tracked biomarker IDs (those that have at least one entry) */
  getTrackedIds() {
    const all = load();
    return [...new Set(all.map(m => m.biomarkerId))];
  },

  /** Clear all data (for testing / reset) */
  clear() {
    storage.remove(KEY);
  },

  /** Rohdaten für Export (technische Grundlagen: Backup-Funktion, Juli 2026) */
  getAll() {
    return load();
  },

  /** Rohdaten aus einem Import 1:1 übernehmen (überschreibt bestehende Messwerte) */
  replaceAll(list) {
    save(Array.isArray(list) ? list : []);
  }
};
