import { profileRepo } from '../../infra/db/repositories/profileRepo.js';
import { navigate } from '../../router.js';

export function renderOnboarding(container) {
  container.innerHTML = `
    <div class="onboarding-screen">
      <div class="onboarding-logo">💊</div>
      <h1 class="onboarding-title">Willkommen bei<br><span class="brand">VitalMetrics</span></h1>
      <p class="onboarding-sub">Damit wir dir die richtigen Referenzwerte zeigen können, brauchen wir zwei kurze Angaben.</p>

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
        <p class="step-hint">Für die 18–50-Altersgruppe sind die DGE-Referenzwerte weitgehend einheitlich. Wir differenzieren in drei Stufen.</p>
        <div class="age-buttons">
          <button class="age-btn" data-age="18-19">18–19 Jahre</button>
          <button class="age-btn" data-age="19-25">19–25 Jahre</button>
          <button class="age-btn" data-age="25-50">25–50 Jahre</button>
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
    btn.disabled = selectedSex === null || selectedAge === null;
  }

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
    profileRepo.save({ sex: selectedSex, ageGroup: selectedAge, onboardingDone: true });
    navigate('dashboard');
  });
}
