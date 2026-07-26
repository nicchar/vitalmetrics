import { profileRepo } from '../../infra/db/repositories/profileRepo.js';
import { navigate } from '../../router.js';
import { openLegalLink } from '../../domain/legalLinks.js';

export function renderOnboarding(container) {
  container.innerHTML = `
    <div class="onboarding-screen">
      <div class="onboarding-logo">💊</div>
      <h1 class="onboarding-title">Willkommen bei<br><span class="brand">WellANNI</span></h1>
      <p class="onboarding-sub">Damit wir dir die richtigen Referenzwerte zeigen können, brauchen wir zwei kurze Angaben.</p>

      <div class="onboarding-card">
        <h2 class="step-label">Bevor es losgeht</h2>
        <p class="step-hint">Alle deine Werte bleiben ausschließlich auf deinem Gerät – es gibt keinen Server und keine Cloud. Wenn du später die optionale tägliche Erinnerung aktivierst, wird diese ebenfalls rein lokal über dein Gerät geplant.</p>
        <label style="display:flex;align-items:flex-start;gap:10px;font-size:14px;margin-top:8px">
          <input type="checkbox" id="consent-check" style="margin-top:3px">
          <span>Ich habe die <a href="#" id="link-datenschutz">Datenschutzerklärung</a> und die <a href="#" id="link-agb">AGB</a> gelesen und stimme zu.</span>
        </label>
      </div>

      <div class="onboarding-card">
        <h2 class="step-label">Dein Geschlecht</h2>
        <p class="step-hint">Die DGE-Referenzwerte unterscheiden sich zwischen Männern und Frauen – vor allem bei Eisen und Zink.</p>
        <div class="sex-buttons">
          <button class="sex-btn" data-sex="f">♀ Weiblich</button>
          <button class="sex-btn" data-sex="m">♂ Männlich</button>
          <button class="sex-btn" data-sex="">Keine Angabe</button>
        </div>
      </div>

      <div class="onboarding-card">
        <h2 class="step-label">Deine Altersgruppe</h2>
        <p class="step-hint">Die DGE-Referenzwerte unterscheiden sich auch nach Alter – ab 51 z. B. bei Vitamin D und einigen B-Vitaminen.</p>
        <div class="age-buttons">
          <button class="age-btn" data-age="18-19">18–19 Jahre</button>
          <button class="age-btn" data-age="19-25">19–25 Jahre</button>
          <button class="age-btn" data-age="25-50">25–50 Jahre</button>
          <button class="age-btn" data-age="51-70">51–70 Jahre</button>
          <button class="age-btn" data-age="70+">70+ Jahre</button>
        </div>
      </div>

      <button class="btn-primary btn-onboarding-done" id="btn-done" disabled>Los geht's →</button>
      <p class="onboarding-disclaimer">Diese Angaben werden nur lokal auf deinem Gerät gespeichert.</p>
    </div>
  `;

  let selectedSex = null;
  let selectedAge = null;

  function updateDoneButton() {
    const btn = container.querySelector('#btn-done');
    const consentChecked = container.querySelector('#consent-check').checked;
    btn.disabled = selectedSex === null || selectedAge === null || !consentChecked;
  }

  container.querySelector('#consent-check').addEventListener('change', updateDoneButton);
  container.querySelector('#link-datenschutz').addEventListener('click', e => {
    e.preventDefault();
    openLegalLink('datenschutz');
  });
  container.querySelector('#link-agb').addEventListener('click', e => {
    e.preventDefault();
    openLegalLink('agb');
  });

  container.querySelectorAll('.sex-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.sex-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSex = btn.dataset.sex;
      updateDoneButton();
    });
  });

  container.querySelectorAll('.age-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.age-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedAge = btn.dataset.age;
      updateDoneButton();
    });
  });

  container.querySelector('#btn-done').addEventListener('click', () => {
    profileRepo.save({
      sex: selectedSex,
      ageGroup: selectedAge,
      onboardingDone: true,
      consentGiven: true,
      consentDate: new Date().toISOString()
    });
    navigate('dashboard');
  });
}
