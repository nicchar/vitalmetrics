import { profileRepo } from '../../infra/db/repositories/profileRepo.js';
import { measurementRepo } from '../../infra/db/repositories/measurementRepo.js';
import { navigate } from '../../router.js';
import { showToast } from '../components/toast.js';
import { feedbackService } from '../../infra/feedback/feedbackService.js';

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
        <p class="disclaimer-text">⚠️ Diese App ist kein Medizinprodukt und ersetzt keine ärztliche Beratung. Die Referenzwerte basieren auf den Empfehlungen der Deutschen Gesellschaft für Ernährung (DGE).</p>
        <p class="version-text">Version 1.0.0</p>
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
}
