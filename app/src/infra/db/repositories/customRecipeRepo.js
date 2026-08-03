/**
 * customRecipeRepo.js
 *
 * Speichert die persönliche Rezept-Sammlung (Feature "Eigene Rezepte",
 * 03.08.2026) unter 'vm_custom_recipes' als Array, analog zu
 * cravingsRepo.js. Eigenes Repo statt Erweiterung von recipes.json/state.recipes,
 * weil eigene Rezepte bewusst NICHT in den Wochenplan/die App-Rezepte
 * integriert sind (siehe domain/customRecipe.js).
 */
import { storage } from '../sqlite.js';

const KEY = 'vm_custom_recipes';
const SCHEMA_VERSION = 1;

export const customRecipeRepo = {
  getAll() {
    return storage.getVersioned(KEY, SCHEMA_VERSION) || [];
  },

  save(recipe) {
    const all = this.getAll();
    all.push(recipe);
    storage.setVersioned(KEY, all, SCHEMA_VERSION);
  },

  remove(id) {
    const all = this.getAll().filter(r => r.id !== id);
    storage.setVersioned(KEY, all, SCHEMA_VERSION);
  },
};
