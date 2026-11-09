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
    const plan = storage.getVersioned(KEY, SCHEMA_VERSION) || null;
    // Okt. 2026: Kategorie "keto" in "lowcarb" umbenannt – alte Pläne übernehmen.
    if (plan && plan.category === 'keto') plan.category = 'lowcarb';
    return plan;
  },
  save(plan) {
    storage.setVersioned(KEY, plan, SCHEMA_VERSION);
  },
  clear() {
    storage.remove(KEY);
  },
};
