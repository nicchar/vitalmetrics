/**
 * healthConsent.js
 *
 * Einmalige Nachfrage für Bestandsnutzer:innen (Datenschutz-Gap-Analyse
 * 28.09.2026): Wer das Onboarding vor Einführung der separaten
 * Gesundheitsdaten-Einwilligung abgeschlossen hat, bestätigt sie hier einmal.
 * Ohne Einwilligung dürfen Gesundheitsdaten nicht verarbeitet werden - daher
 * bietet "Nicht einwilligen" Export und anschließendes Löschen an.
 */
import { profileRepo } from '../../infra/db/repositories/profileRepo.js';
import { dataExportService, deleteAllUserData } from '../../infra/data/dataExportService.js';
import { navigate } from '../../router.js';
import { openLegalLink } from '../../domain/legalLinks.js';
import { HEALTH_CONSENT_TEXT, healthConsentFields } from '../../domain/consent.js';
import { notifications } from '../../domain/notifications.js';
import { showToast } from '../components/toast.js';

export function renderHealthConsent(container) {
  container.innerHTML = `
    <div class="onboarding-screen">
      <h1 class="onboarding-title">Neu: Wie geht's dir heute?</h1>
      <p class="onboarding-sub">Auf der Startseite kannst du jetzt jeden Tag kurz festhalten, wie es dir geht – Energie, Schlaf, Bauchgefühl und Stimmung. Weil auch das Gesundheitsdaten sind, bitten wir dich einmal um deine Zustimmung. Alles bleibt wie bisher nur auf deinem Gerät.</p>

      <div class="onboarding-card">
        <label style="display:flex;align-items:flex-start;gap:10px;font-size:14px">
          <input type="checkbox" id="health-consent-check" style="margin-top:3px">
          <span>${HEALTH_CONSENT_TEXT}</span>
        </label>
        <p style="font-size:13px;margin-top:10px"><a href="#" id="link-datenschutz-consent">Datenschutzerklärung ansehen</a></p>
      </div>

      <button class="btn-primary" id="btn-health-consent" disabled>Zustimmen und weiter</button>

      <div class="onboarding-card" style="margin-top:16px">
        <p class="step-hint" style="margin:0 0 8px">Du möchtest nicht einwilligen? Dann kann WellANNI deine Gesundheitsdaten nicht weiter verarbeiten. Du kannst sie vorher exportieren und anschließend löschen.</p>
        <button class="btn-secondary" id="btn-consent-export">Meine Daten exportieren</button>
        <button class="btn-danger" id="btn-consent-decline" style="margin-top:8px">Nicht einwilligen &amp; alle Daten löschen</button>
      </div>
    </div>`;

  const check = container.querySelector('#health-consent-check');
  const btn = container.querySelector('#btn-health-consent');
  check.addEventListener('change', () => { btn.disabled = !check.checked; });

  container.querySelector('#link-datenschutz-consent').addEventListener('click', e => {
    e.preventDefault();
    openLegalLink('datenschutz');
  });

  btn.addEventListener('click', () => {
    if (!check.checked) return;
    profileRepo.save({ ...profileRepo.get(), ...healthConsentFields() });
    navigate('dashboard');
  });

  container.querySelector('#btn-consent-export').addEventListener('click', async () => {
    const result = await dataExportService.exportData();
    if (!result.ok) showToast('Export leider fehlgeschlagen. Bitte erneut versuchen.');
  });

  container.querySelector('#btn-consent-decline').addEventListener('click', () => {
    if (confirm('Wirklich alle Daten löschen? Das kann nicht rückgängig gemacht werden.')) {
      deleteAllUserData();
      notifications.cancelReminder().catch(() => {});
      showToast('Alle Daten gelöscht.');
      navigate('onboarding');
    }
  });
}
