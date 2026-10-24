import { profileRepo } from '../../infra/db/repositories/profileRepo.js';
import { measurementRepo } from '../../infra/db/repositories/measurementRepo.js';
import { navigate } from '../../router.js';
import { openLegalLink } from '../../domain/legalLinks.js';
import { ACTIVITY_LEVELS } from '../../domain/energyNeeds.js';
import { HEALTH_CONSENT_TEXT, healthConsentFields } from '../../domain/consent.js';

export function renderOnboarding(container) {
  container.innerHTML = `
    <div class="onboarding-screen">
      <div class="onboarding-logo" aria-hidden="true">
        <svg viewBox="0 0 64 64" width="64" height="64"><circle cx="32" cy="32" r="30" fill="var(--primary-light)"/>
          <path d="M18 38c0-10 8-18 26-20-1 15-9 24-20 24-3 0-6-1-6-4z" fill="var(--primary)"/>
          <path d="M22 44c5-8 11-14 19-19" stroke="var(--surface)" stroke-width="2.4" fill="none" stroke-linecap="round"/>
          <circle cx="45" cy="44" r="5" fill="var(--accent)"/></svg>
      </div>
      <h1 class="onboarding-title">Schön, dass du da bist</h1>
      <p class="onboarding-sub">WellANNI hilft dir, gut zu essen und es dabei zu genießen – ohne Verbote und ohne Kalorienstress.</p>

      <div class="onboarding-card">
        <h2 class="step-label">Was ist WellANNI?</h2>
        <p class="step-hint">Dein Körper braucht jeden Tag Nährstoffe wie Eisen, Vitamin D, Magnesium oder Calcium. Sie stecken hinter vielen Dingen,
          die du im Alltag spürst: Energie, Konzentration, ein gutes Bauchgefühl. WellANNI trackt nicht die Nährstoffe direkt, sondern
          deine Ernährung – und rechnet daraus aus, was schon gut dabei ist.</p>
        <ul class="onboarding-points">
          <li><b>Rezepte zum Genießen</b> – über 200 saisonale Gerichte, geprüft und mit Nährwerten.</li>
          <li><b>Ein Tagebuch, das schnell geht</b> – mit „Gegessen“ aus dem Wochenplan oder „wie gestern“.</li>
          <li><b>Orientierung statt Bewertung</b> – im Vergleich mit den Empfehlungen der Deutschen Gesellschaft für Ernährung (DGE). Kein Befund, nur ein Gefühl dafür, wo noch was geht.</li>
          <li><b>Alles bleibt bei dir</b> – kein Konto, keine Cloud. Deine Daten liegen nur auf deinem Gerät.</li>
        </ul>
      </div>

      <div class="onboarding-card">
        <div class="onboarding-step">Schritt 1 von 5</div>
        <h2 class="step-label">Bevor es losgeht</h2>
        <p class="step-hint">Deine Angaben bleiben auf deinem Gerät. Nur wenn du online nach einem Lebensmittel suchst oder einen Barcode scannst, geht der Suchbegriff bzw. der Barcode – ohne Gesundheitsdaten – an die Datenbank Open Food Facts.</p>
        <label class="onboarding-check">
          <input type="checkbox" id="consent-check">
          <span>Ich bin mindestens 18 Jahre alt, akzeptiere die <a href="#" id="link-agb">AGB</a> und habe die <a href="#" id="link-datenschutz">Datenschutzerklärung</a> gelesen.</span>
        </label>
        <label class="onboarding-check">
          <input type="checkbox" id="health-consent-check">
          <span>${HEALTH_CONSENT_TEXT}</span>
        </label>
      </div>

      <div class="onboarding-card">
        <div class="onboarding-step">Schritt 2 von 5</div>
        <h2 class="step-label">Dein Geschlecht</h2>
        <p class="step-hint">Danach richten sich die Referenzwerte – bei Eisen, Zink und einigen Vitaminen gibt es Unterschiede.</p>
        <div class="sex-buttons">
          <button class="sex-btn" data-sex="f" type="button">Weiblich</button>
          <button class="sex-btn" data-sex="m" type="button">Männlich</button>
          <button class="sex-btn" data-sex="" type="button">Keine Angabe</button>
        </div>
      </div>

      <div class="onboarding-card">
        <div class="onboarding-step">Schritt 3 von 5</div>
        <h2 class="step-label">Deine Altersgruppe</h2>
        <p class="step-hint">Auch das Alter spielt eine Rolle, zum Beispiel ab 51 bei Calcium und einigen B-Vitaminen.</p>
        <div class="age-buttons">
          <button class="age-btn" data-age="18-19" type="button">18–19</button>
          <button class="age-btn" data-age="19-25" type="button">19–25</button>
          <button class="age-btn" data-age="25-50" type="button">25–50</button>
          <button class="age-btn" data-age="51-70" type="button">51–70</button>
          <button class="age-btn" data-age="70+" type="button">über 70</button>
        </div>
      </div>

      <div class="onboarding-card">
        <div class="onboarding-step">Schritt 4 von 5 · freiwillig</div>
        <h2 class="step-label">Deine Körpergröße und dein Gewicht</h2>
        <p class="step-hint">Damit schätzen wir grob, wie viel Energie und Eiweiß du am Tag brauchst. Du kannst das auch überspringen und später eintragen.</p>
        <div class="onboarding-row">
          <label>Größe in cm<input type="number" id="onb-height" class="form-control" placeholder="z. B. 172" min="120" max="230" inputmode="numeric"></label>
          <label>Gewicht in kg<input type="number" id="onb-weight" class="form-control" placeholder="z. B. 70" min="30" max="300" step="0.1" inputmode="decimal"></label>
        </div>
      </div>

      <div class="onboarding-card">
        <div class="onboarding-step">Schritt 5 von 5 · freiwillig</div>
        <h2 class="step-label">Wie aktiv bist du im Alltag?</h2>
        <p class="step-hint">Wer sich viel bewegt oder Sport macht, braucht mehr Energie und etwas mehr Eiweiß als die Grundempfehlung von 0,8 g pro kg Körpergewicht.</p>
        <div class="activity-buttons">
          ${ACTIVITY_LEVELS.map(a => `
            <button class="activity-btn" data-activity="${a.key}" type="button">
              <span class="activity-btn-title">${a.label}</span>
              <span class="activity-btn-hint">${a.hint}</span>
            </button>`).join('')}
        </div>
      </div>

      <button class="btn-primary btn-onboarding-done" id="btn-done" type="button" disabled>Los geht's</button>
      <p class="onboarding-disclaimer" id="onb-missing">Noch offen: Zustimmung, Geschlecht und Altersgruppe.</p>
    </div>
  `;

  let selectedSex = null;
  let selectedAge = null;
  let selectedActivity = null;

  function updateDoneButton() {
    const btn = container.querySelector('#btn-done');
    const consentChecked = container.querySelector('#consent-check').checked
      && container.querySelector('#health-consent-check').checked;
    btn.disabled = selectedSex === null || selectedAge === null || !consentChecked;
    const missing = [];
    if (!consentChecked) missing.push('Zustimmung');
    if (selectedSex === null) missing.push('Geschlecht');
    if (selectedAge === null) missing.push('Altersgruppe');
    const hint = container.querySelector('#onb-missing');
    hint.textContent = missing.length
      ? `Noch offen: ${missing.join(', ').replace(/, ([^,]*)$/, ' und $1')}.`
      : 'Alles bleibt nur auf deinem Gerät.';
  }

  container.querySelector('#consent-check').addEventListener('change', updateDoneButton);
  container.querySelector('#health-consent-check').addEventListener('change', updateDoneButton);
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

  container.querySelectorAll('.activity-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.activity-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedActivity = btn.dataset.activity;
    });
  });

  container.querySelector('#btn-done').addEventListener('click', () => {
    const heightVal = parseFloat(container.querySelector('#onb-height').value);
    const weightVal = parseFloat(String(container.querySelector('#onb-weight').value).replace(',', '.'));
    // 2.2: Gewicht direkt als erster Messwert, damit Startseite und
    // Eiweiß-Referenz sofort rechnen können.
    if (weightVal >= 30 && weightVal <= 300) {
      measurementRepo.add({ biomarkerId: 'gewicht', value: weightVal, date: new Date().toISOString().slice(0, 10), note: '' });
    }
    profileRepo.save({
      sex: selectedSex,
      ageGroup: selectedAge,
      height: heightVal > 0 ? heightVal : null,
      activityLevel: selectedActivity || '',
      onboardingDone: true,
      consentGiven: true,
      consentDate: new Date().toISOString(),
      ...healthConsentFields(),
    });
    navigate('dashboard');
  });
}
