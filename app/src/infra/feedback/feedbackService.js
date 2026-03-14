/**
 * feedbackService.js
 *
 * Zwei Feedback-Kanäle wie bei professionellen Indie-Apps üblich:
 *
 * 1. BEWERTEN  → Google Play In-App Review API (nativer Dialog, kein Store-Wechsel)
 *               Fallback: Play Store Seite im Browser öffnen
 *
 * 2. FEEDBACK  → Mail-App öffnen mit vorausgefüllter Betreffzeile
 *
 * Außerdem: automatische Bewertungsanfrage nach 10 Einträgen und 7 Tagen Nutzung.
 * Wird nur einmal gezeigt – danach nicht mehr nerven.
 */

import { storage } from '../db/sqlite.js';

const APP_ID        = 'com.vitalmetrics.app';
const FEEDBACK_MAIL = 'doehring.nicole@gmail.com';

const STORAGE_KEY_REVIEW      = 'vm_review_requested';
const STORAGE_KEY_INSTALL_DATE = 'vm_install_date';
const STORAGE_KEY_ENTRY_COUNT  = 'vm_entry_count';

// ─── Öffentliche API ──────────────────────────────────────────────────────────
export const feedbackService = {

  /**
   * Beim App-Start und nach jedem Eintrag aufrufen.
   * Löst automatisch den Bewertungs-Dialog aus, wenn der Nutzer
   * bereit dafür ist (10+ Einträge UND 7+ Tage nach Installation).
   */
  trackEntryAdded() {
    _ensureInstallDate();
    const count = (storage.get(STORAGE_KEY_ENTRY_COUNT) || 0) + 1;
    storage.set(STORAGE_KEY_ENTRY_COUNT, count);
    _maybeRequestReview();
  },

  /**
   * Öffnet den nativen Google Play Bewertungsdialog.
   * Funktioniert nur auf echtem Gerät mit installiertem Play Store.
   * Im Browser-/Emulator-Modus öffnet stattdessen die Play-Store-Seite.
   */
  async requestReview() {
    // Capacitor In-App Review Plugin (optional, kein Pflicht-Plugin)
    // Wenn @capacitor-community/in-app-review installiert ist, dieses verwenden:
    if (_isCapacitorNative() && window.Capacitor?.Plugins?.InAppReview) {
      try {
        await window.Capacitor.Plugins.InAppReview.requestReview();
        storage.set(STORAGE_KEY_REVIEW, true);
        return;
      } catch {
        // Fallback wenn Plugin fehlschlägt
      }
    }

    // Fallback: Play Store Seite direkt öffnen
    _openPlayStore();
    storage.set(STORAGE_KEY_REVIEW, true);
  },

  /**
   * Öffnet die Mail-App mit vorausgefüllter Betreffzeile und Vorlage.
   */
  openFeedbackMail() {
    const subject  = encodeURIComponent('Feedback – VitalMetrics App');
    const body     = encodeURIComponent(
      'Hallo,\n\n' +
      'ich möchte folgendes Feedback zur VitalMetrics App teilen:\n\n' +
      '[Dein Feedback hier]\n\n' +
      '---\n' +
      `App-Version: 1.0.0\n` +
      `Gerät: ${navigator.userAgent}\n`
    );
    window.open(`mailto:${FEEDBACK_MAIL}?subject=${subject}&body=${body}`, '_system');
  },

  /**
   * Öffnet die App-Seite im Play Store (z.B. für manuelles Bewerten).
   */
  openPlayStore() {
    _openPlayStore();
  },
};

// ─── Interne Hilfsfunktionen ─────────────────────────────────────────────────

function _isCapacitorNative() {
  return typeof window !== 'undefined'
    && window.Capacitor?.isNativePlatform?.();
}

function _openPlayStore() {
  // Auf Android: öffnet Play Store App direkt auf der App-Seite
  // Im Browser: öffnet die Web-Version des Play Stores
  const url = _isCapacitorNative()
    ? `market://details?id=${APP_ID}`
    : `https://play.google.com/store/apps/details?id=${APP_ID}`;
  window.open(url, '_system');
}

function _ensureInstallDate() {
  if (!storage.get(STORAGE_KEY_INSTALL_DATE)) {
    storage.set(STORAGE_KEY_INSTALL_DATE, new Date().toISOString());
  }
}

function _maybeRequestReview() {
  // Nicht nochmal fragen wenn bereits angefragt
  if (storage.get(STORAGE_KEY_REVIEW)) return;

  const entryCount   = storage.get(STORAGE_KEY_ENTRY_COUNT) || 0;
  const installDate  = storage.get(STORAGE_KEY_INSTALL_DATE);
  const daysSinceInstall = installDate
    ? (Date.now() - new Date(installDate).getTime()) / (1000 * 60 * 60 * 24)
    : 0;

  // Erst nach 10 Einträgen UND 7 Tagen Nutzung fragen
  if (entryCount >= 10 && daysSinceInstall >= 7) {
    // Kurze Verzögerung – nicht sofort nach dem Speichern aufpoppen
    setTimeout(() => feedbackService.requestReview(), 1500);
  }
}
