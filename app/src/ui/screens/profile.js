import { profileRepo } from '../../infra/db/repositories/profileRepo.js';
import { navigate } from '../../router.js';
import { showToast } from '../components/toast.js';
import { feedbackService } from '../../infra/feedback/feedbackService.js';
import { DISCLAIMER_FULL } from '../../domain/healthClaims.js';
import { notifications } from '../../domain/notifications.js';
import { openLegalLink } from '../../domain/legalLinks.js';
import { dataExportService, deleteAllUserData } from '../../infra/data/dataExportService.js';
import { ACTIVITY_LEVELS } from '../../domain/energyNeeds.js';
import { APP_VERSION } from '../../appVersion.js';

export function renderProfile(container) {
  const profile = profileRepo.get();

  container.innerHTML = `
    <div class="screen profile-screen">
      <div class="screen-header">
        <button class="w-link" id="profile-back" type="button">← Mehr</button>
        <h1 class="screen-title">Profil und Einstellungen</h1>
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
          <label for="p-weightgoal">Wunschgewicht in kg (freiwillig)</label>
          <input type="number" id="p-weightgoal" class="form-control" value="${profile.weightGoal || ''}" placeholder="z. B. 70" min="30" max="300">
        </div>
        <div class="form-group">
          <label for="p-height">Körpergröße in cm</label>
          <input type="number" id="p-height" class="form-control" value="${profile.height || ''}" placeholder="z. B. 168" min="120" max="230">
          <p class="hint-text">Freiwillig – damit schätzen wir grob, wie viel Energie und Eiweiß du am Tag brauchst.</p>
        </div>
        <div class="form-group">
          <label for="p-activity">Aktivitätslevel</label>
          <select id="p-activity" class="form-control">
            <option value="" ${!profile.activityLevel ? 'selected' : ''}>Keine Angabe</option>
            ${ACTIVITY_LEVELS.map(a => `<option value="${a.key}" ${profile.activityLevel === a.key ? 'selected' : ''}>${a.label}</option>`).join('')}
          </select>
        </div>
        <h3 style="margin-top:18px">Dein Haushalt</h3>
        <p class="hint-text">Für Portionen auf der Rezeptseite und die Einkaufsliste. Jugendliche zählen wie Erwachsene, Kinder als halbe Portion.</p>
        <div class="onboarding-row">
          <label for="p-adults">Erwachsene<input type="number" id="p-adults" class="form-control" value="${profile.householdAdults || ''}" placeholder="z. B. 2" min="0" max="8" inputmode="numeric"></label>
          <label for="p-kids">Kinder<input type="number" id="p-kids" class="form-control" value="${profile.householdKids || ''}" placeholder="z. B. 1" min="0" max="8" inputmode="numeric"></label>
        </div>
        <button class="btn-primary" id="btn-save-profile" style="margin-top:14px">Speichern</button>
      </div>

      <div class="profile-card">
        <h3>Tägliche Erinnerung</h3>
        <p class="hint-text">Eine lokale Erinnerung auf deinem Gerät – kein Server, keine Übertragung von Daten. Der Hinweistext ist neutral formuliert, damit er auch auf dem Sperrbildschirm nichts verrät.</p>
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
        <h3>Daten sichern</h3>
        <p class="hint-text">Speichere alle deine Daten als Datei – als Sicherung oder für ein neues Handy. Premium musst du nicht sichern, das kommt automatisch über Google Play mit.</p>
        <button class="btn-primary" id="btn-export-data">Meine Daten exportieren</button>
        <button class="btn-secondary" id="btn-import-data" style="margin-top:8px">Sicherung einspielen</button>
        <input type="file" id="input-import-file" accept="application/json,.json" style="display:none">
      </div>

      <div class="profile-card danger-zone">
        <h3>Daten</h3>
        <p class="hint-text">Löscht alles auf diesem Gerät: Profil, Messwerte, Tagebuch, Befinden, Zyklus und Beschwerden, Fasten, Heißhunger-Tagebuch, Schlaf, Trinkmenge, Wochenplan und eigene Rezepte. Dein Premium-Abo bleibt. Tipp: Sichere deine Daten vorher, wenn du sie behalten möchtest. Das lässt sich nicht rückgängig machen.</p>
        <button class="btn-danger" id="btn-clear-data">Alle Daten löschen</button>
      </div>

      <div class="profile-card feedback-card">
        <h3>Deine Meinung</h3>
        <p class="hint-text">Gefällt dir WellANNI? Eine Bewertung hilft anderen, die App zu finden. Und wenn dir etwas fehlt, schreib uns gern.</p>
        <button class="btn-primary" id="btn-rate">App bewerten</button>
        <button class="btn-secondary" id="btn-feedback">Feedback schreiben</button>
      </div>

      <div class="profile-card about-card">
        <h3>Über WellANNI</h3>
        <p>WellANNI hilft dir, gut und mit Genuss zu essen – und dabei im Blick zu behalten, was dein Körper braucht.</p>
        <p class="disclaimer-text">${DISCLAIMER_FULL}</p>
        <p class="disclaimer-text">Lebensmitteldaten: Max Rubner-Institut (2025): Bundeslebensmittelschlüssel (BLS), Version 4.0 – Deutsche Nährstoffdatenbank. Karlsruhe. Lizenz: <a href="https://creativecommons.org/licenses/by/4.0/deed.de" target="_blank" rel="noopener">CC BY 4.0</a>. DOI: 10.25826/Data20251217-134202-0</p>
        <p class="disclaimer-text">Online-Suche &amp; Barcode-Scan: Produktdaten von <a href="https://world.openfoodfacts.org" target="_blank" rel="noopener">Open Food Facts</a>, verfügbar unter der <a href="https://opendatacommons.org/licenses/odbl/1-0/" target="_blank" rel="noopener">Open Database License (ODbL)</a>. Angaben ohne Gewähr.</p>
        <p style="margin-top:8px">
          <a href="#" id="link-impressum">Impressum</a> ·
          <a href="#" id="link-datenschutz-profile">Datenschutzerklärung</a> ·
          <a href="#" id="link-agb-profile">AGB</a>
        </p>
        <p class="version-text">Version ${APP_VERSION}</p>
      </div>
    </div>
  `;

  container.querySelector('#profile-back').addEventListener('click', () => navigate('tools'));

  container.querySelector('#btn-save-profile').addEventListener('click', () => {
    profileRepo.save({
      name: container.querySelector('#p-name').value.trim(),
      birthYear: parseInt(container.querySelector('#p-birthyear').value) || null,
      sex: container.querySelector('#p-sex').value,
      weightGoal: parseFloat(container.querySelector('#p-weightgoal').value) || null,
      height: parseFloat(container.querySelector('#p-height').value) || null,
      activityLevel: container.querySelector('#p-activity').value,
      householdAdults: Math.max(0, Math.min(8, parseInt(container.querySelector('#p-adults').value) || 0)),
      householdKids: Math.max(0, Math.min(8, parseInt(container.querySelector('#p-kids').value) || 0)),
    });
    showToast('Gespeichert');
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
        showToast('Diese Datei konnte nicht gelesen werden – ist es ein WellANNI-Backup?');
      }
      importInput.value = '';
    };
    reader.readAsText(file);
  });

  container.querySelector('#btn-clear-data').addEventListener('click', () => {
    if (confirm('Wirklich ALLE deine Daten löschen (Profil, Messwerte, Tagebücher, Zyklus, Rezepte)? Das kann nicht rückgängig gemacht werden.')) {
      deleteAllUserData();
      notifications.cancelReminder().catch(() => {});
      showToast('Alle Daten gelöscht.');
      navigate('onboarding');
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
