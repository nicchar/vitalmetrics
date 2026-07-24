/**
 * mealPlanRepo.js
 *
 * Speichert den aktuell generierten Wochenplan (Block E) unter 'vm_mealplan',
 * damit er nicht bei jedem Screen-Besuch neu ausgewuerfelt wird.
 */
import { storage } from '../sqlite.js';

const KEY = 'vm_mealplan';
const SCHEMA_VERSION = 1;

export const mealPlanRepo = {
  get() {
    return storage.getVersioned(KEY, SCHEMA_VERSION) || null;
  },
  save(plan) {
    storage.setVersioned(KEY, plan, SCHEMA_VERSION);
  },
  clear() {
    storage.remove(KEY);
  },
};
