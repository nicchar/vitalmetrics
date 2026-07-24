/**
 * cravingsRepo.js
 *
 * Speichert Heißhunger-Journal-Einträge unter 'vitalmetrics_cravings' (Array).
 * Gleicher Schlüssel wie im Monolithen für Datenkontinuität bei bestehenden
 * Nutzerinnen.
 */
import { storage } from '../sqlite.js';

const KEY = 'vitalmetrics_cravings';
const SCHEMA_VERSION = 1;

export const cravingsRepo = {
  getAll() {
    return storage.getVersioned(KEY, SCHEMA_VERSION) || [];
  },
  saveAll(list) {
    storage.setVersioned(KEY, list, SCHEMA_VERSION);
  },
};
