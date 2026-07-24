import { storage } from '../infra/db/sqlite.js';

/**
 * Schlüssel im lokalen Speicher.
 * Der Wert hier ist nur ein Cache – die autoritative Quelle
 * ist immer Google Play (wird bei jedem App-Start re-verifiziert
 * durch billingService.initialize() → storeAdapter → onPremiumGranted/Revoked).
 */
const KEY = 'vm_premium';

/**
 * Paywall-Modell seit Entscheidung 2 (20.07.2026):
 * Werte eintragen und den aktuellen Wert sehen ist für ALLE Biomarker kostenlos.
 * Das war Voraussetzung dafür, dass VitalMetrics bei Amazon PartnerNet als
 * "Zugelassene Mobile Anwendung" durchgehen kann (verlangt freien Zugriff auf
 * alle Amazon-Links für alle Nutzer, siehe affiliateLinks.js).
 * Premium schaltet stattdessen die Analyse-Tiefe frei: Verlaufs-Chart und die
 * farbliche Status-Einordnung (optimal/niedrig/erhöht) gegen den Referenzbereich.
 * Vorher war das Tracking selbst an eine feste FREE_BIOMARKER_IDS-Liste gekoppelt
 * (4 Marker frei, Rest komplett gesperrt) – das gibt es nicht mehr.
 */
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

  /** Werte eintragen/sehen ist für jeden Biomarker frei. */
  canTrack() {
    return true;
  },

  /** Verlaufs-Chart + Status-Einordnung (ok/niedrig/hoch) sind Premium. */
  canSeeAnalysis() {
    return this.isPremium();
  },
};
