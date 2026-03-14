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
   * @param {'yearly'|'onetime'} plan
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  async purchasePremium(plan = 'yearly') {
    try {
      await storeAdapter.purchase(plan);
      // Ergebnis kommt asynchron über onPremiumGranted – hier kein return true nötig.
      return { success: true };
    } catch (err) {
      console.error('[Billing] Kauf fehlgeschlagen:', err.message);
      return { success: false, error: err.message };
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
   * Lokalisierten Preis direkt vom Store holen (z.B. "14,99 €").
   * Gibt Fallback-Strings zurück, wenn der Store noch lädt.
   */
  getPrices() {
    return {
      yearly:  storeAdapter.getPriceString('yearly')  ?? '14,99 €',
      onetime: storeAdapter.getPriceString('onetime') ?? '24,99 €',
    };
  },
};
