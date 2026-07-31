/**
 * storeAdapter.js
 *
 * Low-level Wrapper um cordova-plugin-purchase (CdvPurchase).
 * Kapselt die native Store-API, sodass der Rest der App nichts
 * von Google Play / App Store weiß.
 *
 * Einmalig im Terminal ausführen:
 *   npm install cordova-plugin-purchase
 *   npx cap sync android
 *
 * Produkt-IDs müssen 1:1 im Google Play Console (als Abonnement
 * bzw. einmaliger Kauf) angelegt sein, bevor echte Käufe möglich sind.
 */

// ─── Produkt-IDs (müssen mit Google Play Console übereinstimmen) ──────────────
export const PRODUCT_IDS = {
  YEARLY:  'vitalmetrics_premium_yearly',   // Jahres-Abo
  MONTHLY: 'vitalmetrics_premium_monthly',  // Monats-Abo
};

// ─── Prüft ob das native Plugin geladen ist (nicht im Browser) ────────────────
function isPluginAvailable() {
  return typeof window !== 'undefined'
    && typeof window.CdvPurchase !== 'undefined'
    && typeof window.CdvPurchase.store !== 'undefined';
}

// ─── Öffentliche API ──────────────────────────────────────────────────────────
export const storeAdapter = {

  /**
   * Registriert Produkte und initialisiert den Store.
   * Einmal beim App-Start aufrufen.
   *
   * @param {{ onPremiumGranted: Function, onPremiumRevoked: Function, onError: Function }} callbacks
   */
  async initialize({ onPremiumGranted, onPremiumRevoked, onError }) {
    if (!isPluginAvailable()) {
      // Im Browser (Entwicklungs-Preview) ist kein echter Store vorhanden.
      console.warn('[StoreAdapter] CdvPurchase nicht verfügbar – läuft im Browser.');
      return;
    }

    const { store, ProductType, Platform, LogLevel } = window.CdvPurchase;

    // In der Produktion auf WARNING setzen, zum Debuggen DEBUG verwenden
    store.verbosity = LogLevel.WARNING;

    // Produkte beim Store registrieren
    store.register([
      {
        type:     ProductType.PAID_SUBSCRIPTION,
        id:       PRODUCT_IDS.YEARLY,
        platform: Platform.GOOGLE_PLAY,
      },
      {
        type:     ProductType.PAID_SUBSCRIPTION,
        id:       PRODUCT_IDS.MONTHLY,
        platform: Platform.GOOGLE_PLAY,
      },
    ]);

    // Lifecycle: Kauf genehmigt → verifizieren
    store.when().approved(transaction => {
      // Google Play hat den Kauf autorisiert → Receipt validieren
      transaction.verify();
    });

    // Lifecycle: Verifikation erfolgreich → Premium freischalten
    store.when().verified(receipt => {
      receipt.finish();          // Transaktion offiziell abschließen
      onPremiumGranted();        // App-Logik: Premium aktivieren
    });

    // Lifecycle: Verifikation fehlgeschlagen (abgelaufen, Rückbuchung, Betrug)
    store.when().unverified(() => {
      onPremiumRevoked();        // App-Logik: Premium entziehen
    });

    // Globaler Fehler-Handler
    store.error(err => {
      console.error('[StoreAdapter] Fehler:', err.code, err.message);
      onError(err);
    });

    // Mit Google Play verbinden
    await store.initialize([Platform.GOOGLE_PLAY]);
  },

  /**
   * Öffnet den nativen Kauf-Dialog für ein Produkt.
   * @param {'yearly'|'monthly'} plan
   */
  async purchase(plan) {
    if (!isPluginAvailable()) {
      throw new Error('Store nicht verfügbar (Browser-Modus).');
    }

    const { store, Platform, ErrorCode } = window.CdvPurchase;
    const productId = plan === 'monthly' ? PRODUCT_IDS.MONTHLY : PRODUCT_IDS.YEARLY;
    const product   = store.get(productId, Platform.GOOGLE_PLAY);

    if (!product) {
      throw new Error(
        `Produkt nicht gefunden: "${productId}". ` +
        'Produkt-ID in Google Play Console anlegen und App neu bauen.'
      );
    }

    const offer = product.getOffer();
    if (!offer) {
      throw new Error(`Kein aktives Angebot für: ${productId}`);
    }

    // WICHTIG: store.order() wirft bei Abbruch/Fehler NICHT, sondern löst mit
    // einem IError-Objekt auf (isError: true, code: ErrorCode.*). Wird dieser
    // Rückgabewert ignoriert, sieht jeder Abbruch (z.B. Zahl-Dialog ohne Auswahl
    // verlassen) wie ein erfolgreicher Kauf aus – das war der eigentliche Bug.
    const result = await store.order(offer);
    if (result) {
      if (result.code === ErrorCode.PAYMENT_CANCELLED) {
        const err = new Error('Kauf abgebrochen.');
        err.cancelled = true;
        throw err;
      }
      throw new Error(result.message || 'Kauf fehlgeschlagen.');
    }
  },

  /**
   * Stellt frühere Käufe wieder her.
   * Pflicht laut Google Play-Richtlinien – muss über einen Button erreichbar sein.
   */
  async restorePurchases() {
    if (!isPluginAvailable()) {
      console.warn('[StoreAdapter] Restore im Browser nicht möglich.');
      return;
    }
    await window.CdvPurchase.store.restorePurchases();
  },

  /**
   * Liefert den lokalisierten Preistext direkt vom Store (korrekte Währung).
   * @param {'yearly'|'monthly'} plan
   * @returns {string|null}  z.B. "19,50 €" oder null wenn noch nicht geladen
   */
  getPriceString(plan) {
    if (!isPluginAvailable()) return null;

    const { store, Platform } = window.CdvPurchase;
    const productId = plan === 'monthly' ? PRODUCT_IDS.MONTHLY : PRODUCT_IDS.YEARLY;
    const product   = store.get(productId, Platform.GOOGLE_PLAY);
    return product?.getOffer()?.pricingPhases?.[0]?.price ?? null;
  },
};
