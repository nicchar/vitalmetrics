/**
 * exportService.js
 *
 * Orchestriert den PDF-Export: baut das Dokument (reportPdf.js) und
 * speichert/teilt es nativ über Capacitor Filesystem + Share.
 *
 * Zugriffsmuster: Capacitor-Core-Plugins werden (wie @capacitor/android sie
 * zur Laufzeit injiziert) über die globale Registry window.Capacitor.Plugins
 * angesprochen – dieselbe Vanilla-JS-Strategie, die storeAdapter.js bereits
 * für window.CdvPurchase verwendet. Im Browser (Entwicklung/Preview) sind
 * diese Plugins nicht vorhanden -> sauberer Fallback auf doc.save() (direkter
 * Browser-Download), damit die Funktion überall testbar bleibt.
 */
import { buildReportPdf, gatherReportData } from './reportPdf.js';
import { profileRepo } from '../db/repositories/profileRepo.js';
import { measurementRepo } from '../db/repositories/measurementRepo.js';
import { state } from '../../appState.js';

function isCapacitorPluginAvailable(name) {
  return typeof window !== 'undefined'
    && typeof window.Capacitor !== 'undefined'
    && typeof window.Capacitor.Plugins !== 'undefined'
    && typeof window.Capacitor.Plugins[name] !== 'undefined';
}

function dataUriToBase64(dataUri) {
  const commaIdx = dataUri.indexOf(',');
  return commaIdx >= 0 ? dataUri.slice(commaIdx + 1) : dataUri;
}

function buildFileName() {
  const iso = new Date().toISOString().slice(0, 10);
  return `WellANNI-Bericht-${iso}.pdf`;
}

export const exportService = {
  /**
   * @returns {Promise<{ok:true, mode:'share'|'download'} | {ok:false, reason:string, error?:any}>}
   */
  async exportReport() {
    const hasJsPdf = typeof window !== 'undefined'
      && ((window.jspdf && window.jspdf.jsPDF) || window.jsPDF);
    if (!hasJsPdf) {
      return { ok: false, reason: 'jspdf-missing' };
    }

    const profile = profileRepo.get();
    const catalog = state.get('catalog');
    if (!catalog) {
      return { ok: false, reason: 'catalog-missing' };
    }

    const data = gatherReportData({ profile, catalog, measurementRepo });
    if (!data) {
      return { ok: false, reason: 'no-data' };
    }

    let doc;
    try {
      doc = buildReportPdf(data);
    } catch (err) {
      return { ok: false, reason: 'build-failed', error: err };
    }

    const fileName = buildFileName();
    const hasFilesystem = isCapacitorPluginAvailable('Filesystem');
    const hasShare = isCapacitorPluginAvailable('Share');

    if (hasFilesystem && hasShare) {
      try {
        const { Filesystem, Share } = window.Capacitor.Plugins;
        const base64 = dataUriToBase64(doc.output('datauristring'));

        const writeResult = await Filesystem.writeFile({
          path: fileName,
          data: base64,
          directory: 'CACHE'
        });

        let uri = writeResult && writeResult.uri;
        if (!uri) {
          const uriResult = await Filesystem.getUri({ directory: 'CACHE', path: fileName });
          uri = uriResult && uriResult.uri;
        }

        await Share.share({
          title: 'WellANNI Bericht',
          text: 'Mein WellANNI Biomarker-Bericht',
          url: uri,
          dialogTitle: 'Bericht teilen oder speichern'
        });

        return { ok: true, mode: 'share' };
      } catch (err) {
        // Native Freigabe fehlgeschlagen (z.B. Nutzer hat Share-Dialog abgebrochen,
        // oder Plugin-Fehler) -> sauberer Fallback auf direkten Download.
        console.warn('[exportService] Native Share fehlgeschlagen, Fallback auf Download:', err);
      }
    }

    doc.save(fileName);
    return { ok: true, mode: 'download' };
  }
};
