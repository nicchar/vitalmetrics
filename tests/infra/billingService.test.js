import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';

/**
 * billingService.test.js
 *
 * Regressionsschutz für den Tester-Fund vom 30.07.2026 (Befund 1):
 * "Premium wird als freigeschaltet angezeigt, obwohl kein Kauf stattfand."
 *
 * Root Cause: cordova-plugin-purchase's store.order(offer) wirft bei Abbruch
 * oder Fehler NICHT - es löst mit einem IError-Objekt auf
 * (Promise<IError | undefined>, siehe node_modules/cordova-plugin-purchase/
 * www/store.d.ts). storeAdapter.purchase() hat diesen Rückgabewert bisher
 * ignoriert, wodurch jeder Abbruch (Zahl-Dialog verlassen, ohne etwas
 * auszuwählen) wie ein erfolgreicher Kauf aussah.
 *
 * Diese Tests mocken window.CdvPurchase (wird zur Laufzeit gelesen, nicht
 * beim Import gecacht - siehe isPluginAvailable() in storeAdapter.js), um die
 * drei relevanten Ergebnisse von store.order() durchzuspielen: Erfolg,
 * Abbruch (PAYMENT_CANCELLED) und ein anderer Store-Fehler.
 */

const { storeAdapter } = await import('../../app/src/infra/billing/storeAdapter.js');
const { billingService } = await import('../../app/src/infra/billing/billingService.js');

const ErrorCode = { PAYMENT_CANCELLED: 'PAYMENT_CANCELLED', UNKNOWN: 'UNKNOWN' };
const Platform  = { GOOGLE_PLAY: 'GOOGLE_PLAY' };

function installMockStore(orderResult) {
  const offer   = { id: 'offer-1' };
  const product = { getOffer: () => offer };
  globalThis.window = globalThis.window || {};
  globalThis.window.CdvPurchase = {
    store: {
      get: () => product,
      order: async () => orderResult,
      register: () => {},
      when: () => ({ approved() {}, verified() {}, unverified() {} }),
      error: () => {},
      initialize: async () => {},
    },
    Platform,
    ErrorCode,
    ProductType: { PAID_SUBSCRIPTION: 'PAID_SUBSCRIPTION' },
    LogLevel: { WARNING: 'WARNING' },
  };
}

afterEach(() => {
  delete globalThis.window?.CdvPurchase;
});

test('storeAdapter.purchase: erfolgreicher Kauf (order() löst mit undefined auf) wirft nicht', async () => {
  installMockStore(undefined);
  await assert.doesNotReject(() => storeAdapter.purchase('monthly'));
});

test('storeAdapter.purchase: Abbruch (PAYMENT_CANCELLED) wirft Error mit cancelled=true', async () => {
  installMockStore({ isError: true, code: ErrorCode.PAYMENT_CANCELLED, message: 'User cancelled' });
  await assert.rejects(
    () => storeAdapter.purchase('monthly'),
    (err) => {
      assert.equal(err.cancelled, true);
      return true;
    }
  );
});

test('storeAdapter.purchase: anderer Store-Fehler wirft Error ohne cancelled-Flag', async () => {
  installMockStore({ isError: true, code: ErrorCode.UNKNOWN, message: 'Zahlungsmethode abgelehnt' });
  await assert.rejects(
    () => storeAdapter.purchase('monthly'),
    (err) => {
      assert.equal(err.message, 'Zahlungsmethode abgelehnt');
      assert.notEqual(err.cancelled, true);
      return true;
    }
  );
});

test('billingService.purchasePremium: Erfolg liefert { success: true }', async () => {
  installMockStore(undefined);
  const result = await billingService.purchasePremium('yearly');
  assert.deepEqual(result, { success: true });
});

test('billingService.purchasePremium: Abbruch liefert { success:false, cancelled:true } statt falschem Erfolg', async () => {
  installMockStore({ isError: true, code: ErrorCode.PAYMENT_CANCELLED, message: 'User cancelled' });
  const result = await billingService.purchasePremium('yearly');
  assert.equal(result.success, false);
  assert.equal(result.cancelled, true);
});

test('billingService.purchasePremium: anderer Fehler liefert { success:false, cancelled:false, error }', async () => {
  installMockStore({ isError: true, code: ErrorCode.UNKNOWN, message: 'Zahlungsmethode abgelehnt' });
  const result = await billingService.purchasePremium('yearly');
  assert.equal(result.success, false);
  assert.equal(result.cancelled, false);
  assert.equal(result.error, 'Zahlungsmethode abgelehnt');
});
