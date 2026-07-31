/**
 * billingService.js
 *
 * Verbindet Store-Adapter und Entitlements-Logik.
 * Hier liegt die gesamte Kauf-Geschäftslogik der App –
 * die UI-Schicht (premium.js) ruft nur diese Funktionen auf.
 */

import { storeAdapter }  from './storeAdapter.js';
import { entitlements }  from '../../domain/entitlements.js';

// Interner Status – verhindert doppelte Initialisierung
let _initialized = false;

export const billingService = {

  /**
   * Beim App-Start aufrufen (in main.js).
   * Initialisiert den Store und prüft automatisch, ob ein
   * früherer Kauf noch aktiv ist (wichtig nach App-Neustart).
   */
  async initialize() {
    if (_initialized) return;
    _initialized = true;

    await storeAdapter.initialize({

      // Google Play hat einen Kauf / ein Abo bestätigt
      onPremiumGranted() {
        entitlements.setPremium(true);
        console.log('[Billing] Premium gewährt.');
      },

      // Abo abgelaufen, Rückbuchung oder Betrug erkannt
      onPremiumRevoked() {
        entitlements.setPremium(false);
        console.warn('[Billing] Premium entzogen (Abo abgelaufen oder ungültig).');
      },

      // Technischer Fehler (kein Internet, Store nicht erreichbar, etc.)
      onError(err) {
        // Bestehenden Premium-Status NICHT entfernen – könnte Offline-Fehler sein.
        // User behält Premium bis zur nächsten erfolgreichen Verifikation.
        console.error('[Billing] Store-Fehler:', err.message);
      },
    });
  },

  /**
   * Kaufdialog für ein Premium-Paket öffnen.
   * @param {'yearly'|'monthly'} plan
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  async purchasePremium(plan = 'yearly') {
    try {
      await storeAdapter.purchase(plan);
      // Die finale Freischaltung kommt weiterhin asynchron über onPremiumGranted,
      // aber storeAdapter.purchase() wirft jetzt zuverlässig, wenn der Kauf
      // abgebrochen wurde oder fehlgeschlagen ist (siehe storeAdapter.js).
      return { success: true };
    } catch (err) {
      console.error('[Billing] Kauf fehlgeschlagen:', err.message);
      return { success: false, error: err.message, cancelled: err.cancelled === true };
    }
  },

  /**
   * Frühere Käufe wiederherstellen (Pflicht-Button laut Store-Richtlinien).
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  async restorePurchases() {
    try {
      await storeAdapter.restorePurchases();
      // Ergebnis kommt asynchron über onPremiumGranted / onPremiumRevoked
      return { success: true };
    } catch (err) {
      console.error('[Billing] Restore fehlgeschlagen:', err.message);
      return { success: false, error: err.message };
    }
  },

  /**
   * Lokalisierten Preis direkt vom Store holen (z.B. "19,50 €").
   * Gibt Fallback-Strings zurück, wenn der Store noch lädt (bzw. solange die
   * Produkte noch nicht in der Play Console angelegt sind).
   */
  getPrices() {
    return {
      yearly:  storeAdapter.getPriceString('yearly')  ?? '19,50 €',
      monthly: storeAdapter.getPriceString('monthly') ?? '1,89 €',
    };
  },
};
