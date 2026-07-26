/**
 * cycleSymptomsRepo.js
 *
 * Speichert Einträge des Zyklus-Symptom-Tagebuchs unter 'vm_cycle_symptoms'
 * (flache Liste, gleiches Muster wie cravingsRepo.js). Jeder Eintrag:
 * { id, date (ISO yyyy-mm-dd), tags: string[], note }.
 *
 * Bewusst KEINE Analyse-/Auswertungsfunktion hier (siehe domain/
 * cycleSymptoms.js Header) - nur Speichern/Lesen/Löschen.
 */
import { storage } from '../sqlite.js';

const KEY = 'vm_cycle_symptoms';
const SCHEMA_VERSION = 1;

export const cycleSymptomsRepo = {
  getAll() {
    return storage.getVersioned(KEY, SCHEMA_VERSION) || [];
  },

  saveAll(list) {
    storage.setVersioned(KEY, list, SCHEMA_VERSION);
  },

  getForDate(dateStr) {
    return this.getAll().filter(e => e.date === dateStr);
  },

  addEntry(entry) {
    const all = this.getAll();
    all.push({ id: Date.now(), tags: [], note: '', ...entry });
    this.saveAll(all);
  },

  removeEntry(id) {
    this.saveAll(this.getAll().filter(e => e.id !== id));
  },
};
