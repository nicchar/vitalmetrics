import { profileRepo } from '../../infra/db/repositories/profileRepo.js';
import { navigate } from '../../router.js';
import { openLegalLink } from '../../domain/legalLinks.js';
import { ACTIVITY_LEVELS } from '../../domain/energyNeeds.js';

export function renderOnboarding(container) {
  container.innerHTML = `
    <div class="onboarding-screen">
      <div class="onboarding-logo">💊</div>
      <h1 class="onboarding-title">Willkommen bei<br><span class="brand">WellANNI</span></h1>
      <p class="onboarding-sub">Damit wir dir die richtigen Referenzwerte zeigen können, brauchen wir zwei kurze Angaben.</p>

      <div class="onboarding-card">
        <h2 class="step-label">Was ist WellANNI?</h2>
        <p class="step-hint">Kurz erklärt, bevor es losgeht:</p>
        <p style="font-size:14px;color:var(--text-secondary);line-height:1.6;margin:0 0 10px">
          Dein Körper braucht täglich bestimmte Vitamine und Mineralstoffe, zum Beispiel Eisen, Vitamin D, Magnesium
          oder Calcium – man nennt sie auch Nährstoffe. Sie stecken hinter vielen Dingen, die du im Alltag spürst:
          Energie, Konzentration, ein starkes Immunsystem. WellANNI trackt nicht die Nährstoffe direkt, sondern
          deine Ernährung – und rechnet daraus aus, wie gut das deinen Bedarf deckt. So bekommst du ein Gefühl
          dafür, ob du genug bekommst oder ob ein Supplement sinnvoll sein könnte. Ganz ohne Vorwissen, wie ein
          einfaches Tagebuch fürs Essen.
        </p>
        <ul style="margin:8px 0 0;padding-left:20px;font-size:14px;color:var(--text-secondary);line-height:1.6">
          <li>📝 Trage kurz ein, was du isst, wie du dich bewegst oder – falls relevant – deinen Zyklus. Dauert nur wenige Sekunden.</li>
          <li>🔍 Die App vergleicht deine Zufuhr mit den offiziellen Empfehlungen der Deutschen Gesellschaft für Ernährung (DGE) und zeigt dir, wo du gut versorgt bist und wo vielleicht noch etwas fehlt (kein Diagnosewert, nur zur Orientierung).</li>
          <li>💡 Bei niedriger Zufuhr bekommst du Alltagstipps – z. B. welche Lebensmittel helfen oder ob ein Supplement eine Option wäre.</li>
          <li>🔒 Alles bleibt auf deinem Gerät – keine Cloud, kein Account, niemand sieht deine Daten außer dir.</li>
        </ul>
      </div>

      <div class="onboarding-card">
        <div style="font-size:11px;font-weight:700;color:var(--text-secondary);letter-spacing:.03em;margin-bottom:2px">SCHRITT 1 VON 5</div>
        <h2 class="step-label">Bevor es losgeht</h2>
        <p class="step-hint">Alle deine Werte bleiben ausschließlich auf deinem Gerät – es gibt keinen Server und keine Cloud. Wenn du später die optionale tägliche Erinnerung aktivierst, wird diese ebenfalls rein lokal über dein Gerät geplant.</p>
        <label style="display:flex;align-items:flex-start;gap:10px;font-size:14px;margin-top:8px">
          <input type="checkbox" id="consent-check" style="margin-top:3px">
          <span>Ich habe die <a href="#" id="link-datenschutz">Datenschutzerklärung</a> und die <a href="#" id="link-agb">AGB</a> gelesen und stimme zu.</span>
        </label>
      </div>

      <div class="onboarding-card">
        <div style="font-size:11px;font-weight:700;color:var(--text-secondary);letter-spacing:.03em;margin-bottom:2px">SCHRITT 2 VON 5</div>
        <h2 class="step-label">Dein Geschlecht</h2>
        <p class="step-hint">Die DGE-Referenzwerte unterscheiden sich zwischen Männern und Frauen – vor allem bei Eisen und Zink.</p>
        <div class="sex-buttons">
          <button class="sex-btn" data-sex="f">♀ Weiblich</button>
          <button class="sex-btn" data-sex="m">♂ Männlich</button>
          <button class="sex-btn" data-sex="">Keine Angabe</button>
        </div>
      </div>

      <div class="onboarding-card">
        <div style="font-size:11px;font-weight:700;color:var(--text-secondary);letter-spacing:.03em;margin-bottom:2px">SCHRITT 3 VON 5</div>
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

      <div class="onboarding-card">
        <div style="font-size:11px;font-weight:700;color:var(--text-secondary);letter-spacing:.03em;margin-bottom:2px">SCHRITT 4 VON 5 · OPTIONAL</div>
        <h2 class="step-label">Deine Körpergröße</h2>
        <p class="step-hint">Nur nötig für eine grobe Einschätzung deines Tagesbedarfs (Kalorien, Protein) auf der Startseite – überspringbar, du kannst sie jederzeit im Profil nachtragen.</p>
        <input type="number" id="onb-height" class="form-control" placeholder="z. B. 168 (cm)" min="120" max="230">
      </div>

      <div class="onboarding-card">
        <div style="font-size:11px;font-weight:700;color:var(--text-secondary);letter-spacing:.03em;margin-bottom:2px">SCHRITT 5 VON 5 · OPTIONAL</div>
        <h2 class="step-label">Wie aktiv bist du im Alltag?</h2>
        <p class="step-hint">Bestimmt zusammen mit deiner Größe die grobe Tagesbedarfs-Einschätzung – und wie viel Protein für dich sinnvoll ist: Wer sich mehr bewegt bzw. Kraft- oder Ausdauersport betreibt, hat einen höheren Proteinbedarf als die DGE-Basisempfehlung von 0,8 g pro kg Körpergewicht.</p>
        <div class="activity-buttons" style="display:flex;flex-direction:column;gap:8px">
          ${ACTIVITY_LEVELS.map(a => `
            <button class="activity-btn" data-activity="${a.key}" type="button"
              style="text-align:left;padding:10px 12px;border:1px solid var(--border);border-radius:8px;background:var(--surface);cursor:pointer">
              <div style="font-size:14px;font-weight:600">${a.label}</div>
              <div style="font-size:12px;color:var(--text-secondary);margin-top:2px">${a.hint}</div>
            </button>`).join('')}
        </div>
      </div>

      <button class="btn-primary btn-onboarding-done" id="btn-done" disabled>Los geht's →</button>
      <p class="onboarding-disclaimer">Diese Angaben werden nur lokal auf deinem Gerät gespeichert.</p>
    </div>
  `;

  let selectedSex = null;
  let selectedAge = null;
  let selectedActivity = null;

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

  container.querySelectorAll('.activity-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.activity-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedActivity = btn.dataset.activity;
    });
  });

  container.querySelector('#btn-done').addEventListener('click', () => {
    const heightVal = parseFloat(container.querySelector('#onb-height').value);
    profileRepo.save({
      sex: selectedSex,
      ageGroup: selectedAge,
      height: heightVal > 0 ? heightVal : null,
      activityLevel: selectedActivity || '',
      onboardingDone: true,
      consentGiven: true,
      consentDate: new Date().toISOString()
    });
    navigate('dashboard');
  });
}
