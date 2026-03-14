import { storage } from '../sqlite.js';

const KEY = 'vm_measurements';

function load() {
  return storage.get(KEY) || [];
}

function save(list) {
  storage.set(KEY, list);
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
  }
};
