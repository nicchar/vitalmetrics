import { storage } from '../infra/db/sqlite.js';

/**
 * Schlüssel im lokalen Speicher.
 * Der Wert hier ist nur ein Cache – die autoritative Quelle
 * ist immer Google Play (wird bei jedem App-Start re-verifiziert
 * durch billingService.initialize() → storeAdapter → onPremiumGranted/Revoked).
 */
const KEY = 'vm_premium';

/** Biomarker, die immer kostenlos verfügbar sind */
export const FREE_BIOMARKER_IDS = ['vitamin_d', 'vitamin_b12', 'eisen', 'gewicht'];

export const entitlements = {

  /**
   * Gibt true zurück wenn Premium aktiv ist.
   * Der Wert wurde von Google Play verifiziert und lokal gecacht.
   */
  isPremium() {
    return storage.get(KEY) === true;
  },

  /**
   * Wird ausschließlich vom billingService aufgerufen,
   * nachdem Google Play den Kauf bestätigt (oder entzogen) hat.
   * Nicht direkt aus der UI aufrufen.
   * @param {boolean} value
   */
  setPremium(value) {
    storage.set(KEY, value === true);
  },

  canTrack(biomarkerId) {
    if (this.isPremium()) return true;
    return FREE_BIOMARKER_IDS.includes(biomarkerId);
  },
};
