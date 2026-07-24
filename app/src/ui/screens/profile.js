import { profileRepo } from '../../infra/db/repositories/profileRepo.js';
import { measurementRepo } from '../../infra/db/repositories/measurementRepo.js';
import { navigate } from '../../router.js';
import { showToast } from '../components/toast.js';
import { feedbackService } from '../../infra/feedback/feedbackService.js';
import { MEDICATION_CATEGORIES } from '../../domain/medicationInteractions.js';
import { DISCLAIMER_FULL } from '../../domain/healthClaims.js';
import { notifications } from '../../domain/notifications.js';
import { openLegalLink } from '../../domain/legalLinks.js';
import { dataExportService } from '../../infra/data/dataExportService.js';

export function renderProfile(container) {
  const profile = profileRepo.get();

  container.innerHTML = `
    <div class="screen profile-screen">
      <div class="screen-header">
        <h1 class="screen-title">Profil & Einstellungen</h1>
      </div>

      <div class="profile-card">
        <h3>Persönliche Daten</h3>
        <div class="form-group">
          <label for="p-name">Name</label>
          <input type="text" id="p-name" class="form-control" value="${profile.name}" placeholder="Dein Name">
        </div>
        <div class="form-group">
          <label for="p-birthyear">Geburtsjahr</label>
          <input type="number" id="p-birthyear" class="form-control" value="${profile.birthYear || ''}" placeholder="z. B. 1985" min="1900" max="2010">
        </div>
        <div class="form-group">
          <label for="p-sex">Geschlecht</label>
          <select id="p-sex" class="form-control">
            <option value="" ${!profile.sex ? 'selected' : ''}>Keine Angabe</option>
            <option value="f" ${profile.sex === 'f' ? 'selected' : ''}>Weiblich</option>
            <option value="m" ${profile.sex === 'm' ? 'selected' : ''}>Männlich</option>
          </select>
        </div>
        <div class="form-group">
          <label for="p-weightgoal">Zielgewicht (kg)</label>
          <input type="number" id="p-weightgoal" class="form-control" value="${profile.weightGoal || ''}" placeholder="z. B. 70" min="30" max="300">
        </div>
        <button class="btn-primary" id="btn-save-profile">Speichern</button>
      </div>

      <div class="profile-card">
        <h3>Medikamente & Supplemente</h3>
        <p class="hint-text">Falls zutreffend – für allgemeine Wechselwirkungshinweise bei passenden Nährstoffen. Kein Ersatz für ärztliche/pharmazeutische Beratung.</p>
        ${Object.entries(MEDICATION_CATEGORIES).map(([key, label]) => `
          <label style="display:flex;align-items:center;gap:8px;font-size:13px;padding:6px 0">
            <input type="checkbox" class="p-medication" value="${key}" ${profile.medications?.includes(key) ? 'checked' : ''}>
            ${label}
          </label>`).join('')}
        <button class="btn-primary" id="btn-save-medications" style="margin-top:8px">Speichern</button>
      </div>

      <div class="profile-card">
        <h3>Tägliche Erinnerung</h3>
        <p class="hint-text">Eine lokale Erinnerung auf deinem Gerät – kein Server, keine Übertragung von Daten. Neutraler Hinweistext, sichtbar auch bei gesperrtem Bildschirm.</p>
        <label style="display:flex;align-items:center;gap:8px;font-size:14px;padding:6px 0">
          <input type="checkbox" id="p-reminder-enabled" ${profile.reminderEnabled ? 'checked' : ''}>
          Tägliche Erinnerung aktivieren
        </label>
        <div class="form-group" id="p-reminder-time-group" style="${profile.reminderEnabled ? '' : 'display:none'}">
          <label for="p-reminder-time">Uhrzeit</label>
          <input type="time" id="p-reminder-time" class="form-control" value="${profile.reminderTime}">
        </div>
      </div>

      <div class="profile-card">
        <h3>Daten exportieren & sichern</h3>
        <p class="hint-text">Alle deine Daten (Werte, Ernährung, Zyklus, Fasten u.a. – ohne Premium-Status, der automatisch mit Google Play synchronisiert bleibt) als Datei sichern oder auf ein neues Gerät übertragen.</p>
        <button class="btn-primary" id="btn-export-data">⬇️ Meine Daten exportieren</button>
        <button class="btn-secondary" id="btn-import-data" style="margin-top:8px">⬆️ Backup importieren</button>
        <input type="file" id="input-import-file" accept="application/json,.json" style="display:none">
      </div>

      <div class="profile-card danger-zone">
        <h3>Daten</h3>
        <p class="hint-text">Alle gespeicherten Messwerte löschen. Diese Aktion kann nicht rückgängig gemacht werden.</p>
        <button class="btn-danger" id="btn-clear-data">Alle Daten löschen</button>
      </div>

      <div class="profile-card feedback-card">
        <h3>Feedback & Bewertung</h3>
        <p class="hint-text">Gefällt dir VitalMetrics? Eine Bewertung hilft anderen Nutzern, die App zu finden.</p>
        <button class="btn-primary" id="btn-rate">⭐ App bewerten</button>
        <button class="btn-secondary" id="btn-feedback">✉️ Feedback senden</button>
      </div>

      <div class="profile-card about-card">
        <h3>Über VitalMetrics</h3>
        <p>VitalMetrics hilft dir, deine Vitamin- und Mineralstoffwerte im Blick zu behalten.</p>
        <p class="disclaimer-text">⚠️ ${DISCLAIMER_FULL}</p>
        <p class="disclaimer-text">🥗 Lebensmitteldaten: Max Rubner-Institut (2025): Bundeslebensmittelschlüssel (BLS), Version 4.0 – Deutsche Nährstoffdatenbank. Karlsruhe. Lizenz: <a href="https://creativecommons.org/licenses/by/4.0/deed.de" target="_blank" rel="noopener">CC BY 4.0</a>. DOI: 10.25826/Data20251217-134202-0</p>
        <p style="margin-top:8px">
          <a href="#" id="link-impressum">Impressum</a> ·
          <a href="#" id="link-datenschutz-profile">Datenschutzerklärung</a> ·
          <a href="#" id="link-agb-profile">AGB</a>
        </p>
        <p class="version-text">Version 2.0.0</p>
      </div>
    </div>
  `;

  container.querySelector('#btn-save-profile').addEventListener('click', () => {
    profileRepo.save({
      name: container.querySelector('#p-name').value.trim(),
      birthYear: parseInt(container.querySelector('#p-birthyear').value) || null,
      sex: container.querySelector('#p-sex').value,
      weightGoal: parseFloat(container.querySelector('#p-weightgoal').value) || null
    });
    showToast('✅ Profil gespeichert!');
  });

  container.querySelector('#btn-save-medications').addEventListener('click', () => {
    const medications = [...container.querySelectorAll('.p-medication:checked')].map(el => el.value);
    profileRepo.save({ medications });
    showToast('✅ Gespeichert!');
  });

  const reminderCheckbox = container.querySelector('#p-reminder-enabled');
  const reminderTimeGroup = container.querySelector('#p-reminder-time-group');
  const reminderTimeInput = container.querySelector('#p-reminder-time');

  reminderCheckbox.addEventListener('change', async () => {
    const enabled = reminderCheckbox.checked;
    reminderTimeGroup.style.display = enabled ? '' : 'none';

    if (!enabled) {
      await notifications.cancelReminder();
      profileRepo.save({ reminderEnabled: false });
      showToast('Erinnerung deaktiviert.');
      return;
    }

    if (!notifications.isAvailable()) {
      showToast('Erinnerungen sind auf diesem Gerät nicht verfügbar.');
      reminderCheckbox.checked = false;
      reminderTimeGroup.style.display = 'none';
      return;
    }

    const [hour, minute] = reminderTimeInput.value.split(':').map(Number);
    const result = await notifications.scheduleDailyReminder(hour, minute);
    if (result.ok) {
      profileRepo.save({ reminderEnabled: true, reminderTime: reminderTimeInput.value });
      showToast('✅ Erinnerung aktiviert.');
    } else {
      showToast('Berechtigung für Benachrichtigungen wurde nicht erteilt.');
      reminderCheckbox.checked = false;
      reminderTimeGroup.style.display = 'none';
    }
  });

  reminderTimeInput.addEventListener('change', async () => {
    if (!reminderCheckbox.checked) return;
    const [hour, minute] = reminderTimeInput.value.split(':').map(Number);
    const result = await notifications.scheduleDailyReminder(hour, minute);
    if (result.ok) {
      profileRepo.save({ reminderTime: reminderTimeInput.value });
      showToast('✅ Uhrzeit aktualisiert.');
    }
  });

  container.querySelector('#btn-export-data').addEventListener('click', async () => {
    const result = await dataExportService.exportData();
    if (result.ok) {
      showToast(result.mode === 'download' ? '✅ Backup heruntergeladen.' : '✅ Backup geteilt/gespeichert.');
    } else {
      showToast('Export leider fehlgeschlagen. Bitte erneut versuchen.');
    }
  });

  const importInput = container.querySelector('#input-import-file');
  container.querySelector('#btn-import-data').addEventListener('click', () => {
    if (!confirm('Ein Backup einspielen überschreibt alle aktuellen Daten in dieser App mit dem Inhalt der Backup-Datei. Fortfahren?')) return;
    importInput.click();
  });
  importInput.addEventListener('change', () => {
    const file = importInput.files && importInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = dataExportService.importData(String(reader.result));
      if (result.ok) {
        showToast('✅ Backup eingespielt.');
        navigate('dashboard');
      } else {
        showToast('Diese Datei konnte nicht gelesen werden – ist es ein VitalMetrics-Backup?');
      }
      importInput.value = '';
    };
    reader.readAsText(file);
  });

  container.querySelector('#btn-clear-data').addEventListener('click', () => {
    if (confirm('Wirklich alle Messwerte löschen? Das kann nicht rückgängig gemacht werden.')) {
      measurementRepo.clear();
      showToast('Alle Daten gelöscht.');
      navigate('dashboard');
    }
  });

  container.querySelector('#btn-rate').addEventListener('click', () => {
    feedbackService.requestReview();
  });

  container.querySelector('#btn-feedback').addEventListener('click', () => {
    feedbackService.openFeedbackMail();
  });

  container.querySelector('#link-impressum').addEventListener('click', e => {
    e.preventDefault();
    openLegalLink('impressum');
  });
  container.querySelector('#link-datenschutz-profile').addEventListener('click', e => {
    e.preventDefault();
    openLegalLink('datenschutz');
  });
  container.querySelector('#link-agb-profile').addEventListener('click', e => {
    e.preventDefault();
    openLegalLink('agb');
  });
}
