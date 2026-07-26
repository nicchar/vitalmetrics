/**
 * dataExportService.js
 *
 * Export/Import aller lokal gespeicherten Nutzerdaten als eine JSON-Datei
 * (technische Grundlagen, Juli 2026 - schließt zwei unabhängig voneinander
 * genannte Lücken: DSGVO-Auskunftsrecht/Löschrecht (Datenschutz-Review) und
 * Datenverlust bei Geräte-/App-Wechsel, da alle Daten ausschließlich lokal in
 * localStorage liegen (Entwickler-Review)).
 *
 * BEWUSST AUSGESCHLOSSEN: Premium-Status (vm_premium). Der ist laut
 * domain/entitlements.js nur ein Cache, der bei jedem App-Start automatisch
 * neu von Google Play verifiziert wird - ihn zu exportieren/importieren würde
 * nur unnötiges Risiko schaffen (z.B. einen alten, zwischenzeitlich
 * abgelaufenen Premium-Status "wiederherstellen").
 *
 * Zugriffsmuster für Dateisystem/Freigabe identisch zu
 * infra/pdf/exportService.js: Capacitor Filesystem+Share wenn verfügbar,
 * sonst sauberer Fallback (Browser-Download bzw. reines JSON-Ergebnis für
 * Tests/Node, wo weder Capacitor noch DOM vorhanden sind).
 *
 * Import ist bewusst ein VOLLSTÄNDIGES ÜBERSCHREIBEN (kein Merge) - das
 * entspricht dem erwarteten Verhalten eines Backups/einer Wiederherstellung.
 * Die UI (profile.js) muss vor dem Aufruf explizit bestätigen lassen.
 */
import { profileRepo } from '../db/repositories/profileRepo.js';
import { measurementRepo } from '../db/repositories/measurementRepo.js';
import { nutritionRepo } from '../db/repositories/nutritionRepo.js';
import { activityRepo } from '../db/repositories/activityRepo.js';
import { cycleRepo } from '../db/repositories/cycleRepo.js';
import { fastingRepo } from '../db/repositories/fastingRepo.js';
import { glucoseDayRepo } from '../db/repositories/glucoseDayRepo.js';
import { cravingsRepo } from '../db/repositories/cravingsRepo.js';
import { mealPlanRepo } from '../db/repositories/mealPlanRepo.js';
import { hydrationRepo } from '../db/repositories/hydrationRepo.js';
import { sleepRepo } from '../db/repositories/sleepRepo.js';

export const EXPORT_FORMAT_VERSION = 1;

function isCapacitorPluginAvailable(name) {
  return typeof window !== 'undefined'
    && typeof window.Capacitor !== 'undefined'
    && typeof window.Capacitor.Plugins !== 'undefined'
    && typeof window.Capacitor.Plugins[name] !== 'undefined';
}

/** Sammelt die Rohdaten aller Repositories - reine Funktion, ohne Datei-I/O. */
export function gatherAllData() {
  return {
    profile: profileRepo.get(),
    measurements: measurementRepo.getAll(),
    nutrition: nutritionRepo.getAll(),
    activity: activityRepo.getAll(),
    cycle: cycleRepo.get(),
    fasting: fastingRepo.get(),
    glucoseDay: glucoseDayRepo.getAll(),
    cravings: cravingsRepo.getAll(),
    mealPlan: mealPlanRepo.get(),
    hydration: hydrationRepo.getAll(),
    sleep: sleepRepo.getAll(),
  };
}

/** Schreibt Rohdaten zurück in alle Repositories - reine Funktion, ohne Datei-I/O. */
export function applyAllData(data) {
  if (!data || typeof data !== 'object') return;
  if (data.profile) profileRepo.save(data.profile);
  if (data.measurements) measurementRepo.replaceAll(data.measurements);
  if (data.nutrition) nutritionRepo.replaceAll(data.nutrition);
  if (data.activity) activityRepo.replaceAll(data.activity);
  if (data.cycle) cycleRepo.save(data.cycle);
  if (data.fasting) fastingRepo.save(data.fasting);
  if (data.glucoseDay) glucoseDayRepo.replaceAll(data.glucoseDay);
  if (data.cravings) cravingsRepo.saveAll(data.cravings);
  if (data.mealPlan) mealPlanRepo.save(data.mealPlan); else mealPlanRepo.clear();
  if (data.hydration) hydrationRepo.replaceAll(data.hydration);
  if (data.sleep) sleepRepo.replaceAll(data.sleep);
}

function buildFileName() {
  const iso = new Date().toISOString().slice(0, 10);
  return `WellANNI-Backup-${iso}.json`;
}

function utf8ToBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

export const dataExportService = {
  /**
   * @returns {Promise<{ok:true, mode:'share'|'download'|'json', json?:string} | {ok:false, reason:string, error?:any}>}
   */
  async exportData() {
    const payload = {
      exportFormatVersion: EXPORT_FORMAT_VERSION,
      exportedAt: new Date().toISOString(),
      data: gatherAllData(),
    };
    const json = JSON.stringify(payload, null, 2);
    const fileName = buildFileName();

    const hasFilesystem = isCapacitorPluginAvailable('Filesystem');
    const hasShare = isCapacitorPluginAvailable('Share');

    if (hasFilesystem && hasShare) {
      try {
        const { Filesystem, Share } = window.Capacitor.Plugins;
        const base64 = utf8ToBase64(json);
        const writeResult = await Filesystem.writeFile({ path: fileName, data: base64, directory: 'CACHE' });
        let uri = writeResult && writeResult.uri;
        if (!uri) {
          const uriResult = await Filesystem.getUri({ directory: 'CACHE', path: fileName });
          uri = uriResult && uriResult.uri;
        }
        await Share.share({
          title: 'WellANNI Backup',
          text: 'Meine WellANNI-Daten (Backup)',
          url: uri,
          dialogTitle: 'Backup teilen oder speichern',
        });
        return { ok: true, mode: 'share' };
      } catch (err) {
        console.warn('[dataExportService] Native Share fehlgeschlagen, Fallback auf Download:', err);
      }
    }

    if (typeof document !== 'undefined' && typeof Blob !== 'undefined') {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      return { ok: true, mode: 'download' };
    }

    // Node/Test-Umgebung ohne DOM/Capacitor - Payload trotzdem zurückgeben,
    // damit gatherAllData()/JSON-Aufbau ohne echtes Dateisystem testbar ist.
    return { ok: true, mode: 'json', json };
  },

  /**
   * @param {string} jsonString Inhalt einer zuvor exportierten Backup-Datei
   * @returns {{ok:true} | {ok:false, reason:string, error?:any}}
   */
  importData(jsonString) {
    let payload;
    try {
      payload = JSON.parse(jsonString);
    } catch (err) {
      return { ok: false, reason: 'invalid-json', error: err };
    }
    if (!payload || typeof payload !== 'object' || typeof payload.exportFormatVersion !== 'number' || !payload.data) {
      return { ok: false, reason: 'invalid-format' };
    }
    try {
      applyAllData(payload.data);
    } catch (err) {
      return { ok: false, reason: 'apply-failed', error: err };
    }
    return { ok: true };
  },
};
