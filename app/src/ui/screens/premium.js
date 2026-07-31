import { entitlements } from '../../domain/entitlements.js';
import { billingService }  from '../../infra/billing/billingService.js';
import { navigate }        from '../../router.js';
import { showToast }       from '../components/toast.js';
import { state }           from '../../appState.js';

export function renderPremium(container) {
  const isPremium  = entitlements.isPremium();
  const prices     = billingService.getPrices();
  const catalog    = state.get('catalog');
  const totalCount = catalog.biomarkers.length;

  // Aktuell gewählter Plan ('yearly' oder 'monthly')
  let selectedPlan = 'yearly';

  container.innerHTML = `
    <div class="screen premium-screen">
      <div class="premium-hero">
        <div class="premium-icon">⭐</div>
        <h1 class="premium-title">WellANNI Premium</h1>
        <p class="premium-sub">Verlauf & Einordnung für alle ${totalCount} Biomarker.</p>
      </div>

      ${isPremium
        ? `<div class="premium-active-card">
             <p>🎉 Du hast Premium aktiv. Verlauf & Einordnung sind für dich freigeschaltet.</p>
           </div>`
        : `<div class="price-card">
             <div class="price-option selected" id="opt-yearly" data-plan="yearly">
               <div class="price-label">Jahresabo <span class="badge-best">Beste Wahl</span></div>
               <div class="price-amount">${prices.yearly}<span class="price-period"> / Jahr</span></div>
               <div class="price-sub">≈ ${_monthlyEstimate(prices.yearly)} pro Monat</div>
             </div>
             <div class="price-option" id="opt-monthly" data-plan="monthly">
               <div class="price-label">Monatsabo</div>
               <div class="price-amount">${prices.monthly}<span class="price-period"> / Monat</span></div>
               <div class="price-sub">Jederzeit kündbar</div>
             </div>
           </div>

           <button class="btn-primary btn-purchase" id="btn-purchase">
             Premium freischalten
           </button>

           <p class="restore-text">
             <button class="btn-link" id="btn-restore">Kauf wiederherstellen</button>
             <br><span style="font-size:11px;color:var(--text-secondary)">Schon auf einem anderen Gerät gekauft? Hier ohne erneute Zahlung freischalten.</span>
           </p>`
      }

      <div class="features-card">
        <h3>Was ist enthalten?</h3>
        <div class="feature-list">
          <div class="feature-item"><span class="feature-check">✅</span><span>Verlaufs-Charts über die Zeit für alle Biomarker</span></div>
          <div class="feature-item"><span class="feature-check">✅</span><span>Farbliche Einordnung (optimal/niedrig/erhöht) gegen deinen Referenzbereich</span></div>
          <div class="feature-item"><span class="feature-check">✅</span><span>Geschlechtsspezifische DGE-Referenzwerte in der Einordnung</span></div>
          <div class="feature-item"><span class="feature-check">✅</span><span>Hautgesundheit & Vitalität – eigener Auswertungs-Screen</span></div>
          <div class="feature-item"><span class="feature-check">✅</span><span>Ernährungsverlauf über 12 Wochen für alle 15 Mikronährstoffe (Free: die 5 wichtigsten)</span></div>
          <div class="feature-item"><span class="feature-check">✅</span><span>Intervallfasten-Tracker mit Autophagie-Phasen & Streak</span></div>
          <div class="feature-item"><span class="feature-check">✅</span><span>Blutzucker-Tagesgang zur Insulinresistenz-Erkennung</span></div>
          <div class="feature-item"><span class="feature-check">✅</span><span>Wochenrückblick – Bewegung, Ernährung & Fasten der letzten 7 Tage</span></div>
        </div>
      </div>

      <div class="free-card">
        <h3>Gratis immer verfügbar</h3>
        <div class="feature-list">
          <div class="feature-item"><span class="feature-check">🆓</span><span>Alle ${totalCount} Biomarker eintragen & aktuellen Wert einsehen</span></div>
          <div class="feature-item"><span class="feature-check">🆓</span><span>Supplement-Empfehlungen zu jedem Marker</span></div>
          <div class="feature-item"><span class="feature-check">🆓</span><span>Lebensmittelquellen, Tipps & passende Rezepte bei Mängeln</span></div>
          <div class="feature-item"><span class="feature-check">🆓</span><span>Heimtest-Hinweise zu jedem Biomarker</span></div>
          <div class="feature-item"><span class="feature-check">🆓</span><span>PDF-Bericht exportieren</span></div>
          <div class="feature-item"><span class="feature-check">🆓</span><span>Heißhunger-Journal, Wochenplan & Einkaufsliste</span></div>
          <div class="feature-item"><span class="feature-check">🆓</span><span>Zyklustracker sowie PMS, Prämenopause & Menopause</span></div>
        </div>
      </div>

      <p class="legal-text">
        Zahlungen werden über Google Play abgewickelt.
        Jahres- und Monatsabo verlängern sich automatisch, sofern sie nicht
        mindestens 24 Stunden vor Ende der Laufzeit im Google-Konto gekündigt werden.
      </p>
    </div>`;

  if (isPremium) return; // Keine Buttons verdrahten wenn schon Premium

  // ─── Planauswahl ──────────────────────────────────────────────────────────
  container.querySelectorAll('.price-option').forEach(el => {
    el.addEventListener('click', () => {
      container.querySelectorAll('.price-option').forEach(o => o.classList.remove('selected'));
      el.classList.add('selected');
      selectedPlan = el.dataset.plan;
    });
  });

  // ─── Kauf-Button ─────────────────────────────────────────────────────────
  const btnPurchase = container.querySelector('#btn-purchase');
  btnPurchase?.addEventListener('click', async () => {
    btnPurchase.disabled = true;
    btnPurchase.textContent = 'Wird verarbeitet …';

    const result = await billingService.purchasePremium(selectedPlan);

    if (!result.success) {
      // Abbruch (Zahl-Dialog verlassen) neutral melden, echten Fehler als Fehler.
      showToast(
        result.cancelled
          ? 'Kauf abgebrochen.'
          : `Fehler: ${result.error ?? 'Kauf konnte nicht abgeschlossen werden.'}`
      );
      btnPurchase.disabled = false;
      btnPurchase.textContent = 'Premium freischalten';
      return;
    }

    // Erfolg wird asynchron über onPremiumGranted → entitlements.setPremium(true) gesetzt.
    // Nach kurzem Moment zur Dashboard-Ansicht navigieren.
    showToast('🎉 Premium freigeschaltet!');
    navigate('dashboard');
  });

  // ─── Kauf wiederherstellen ────────────────────────────────────────────────
  const btnRestore = container.querySelector('#btn-restore');
  btnRestore?.addEventListener('click', async () => {
    btnRestore.disabled = true;
    btnRestore.textContent = 'Wird geprüft …';

    const result = await billingService.restorePurchases();

    if (!result.success) {
      showToast('Wiederherstellung fehlgeschlagen. Prüfe deine Internetverbindung.');
    } else if (entitlements.isPremium()) {
      showToast('✅ Premium wiederhergestellt!');
      navigate('dashboard');
    } else {
      showToast('Kein aktiver Kauf gefunden.');
    }

    btnRestore.disabled = false;
    btnRestore.textContent = 'Kauf wiederherstellen';
  });
}

// Schätzt den monatlichen Preis aus dem Jahrespreis-String (z.B. "14,99 €" → "1,25 €")
function _monthlyEstimate(yearlyPriceStr) {
  const match = yearlyPriceStr?.match(/[\d,.]+/);
  if (!match) return '~1,25 €';
  const yearly = parseFloat(match[0].replace(',', '.'));
  const monthly = (yearly / 12).toFixed(2).replace('.', ',');
  return `${monthly} €`;
}
