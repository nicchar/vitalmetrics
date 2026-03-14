import { entitlements }   from '../../domain/entitlements.js';
import { billingService }  from '../../infra/billing/billingService.js';
import { navigate }        from '../../router.js';
import { showToast }       from '../components/toast.js';

export function renderPremium(container) {
  const isPremium = entitlements.isPremium();
  const prices    = billingService.getPrices();

  // Aktuell gewählter Plan ('yearly' oder 'onetime')
  let selectedPlan = 'yearly';

  container.innerHTML = `
    <div class="screen premium-screen">
      <div class="premium-hero">
        <div class="premium-icon">⭐</div>
        <h1 class="premium-title">VitalMetrics Premium</h1>
        <p class="premium-sub">Alle 28 Biomarker. Keine Einschränkungen.</p>
      </div>

      ${isPremium
        ? `<div class="premium-active-card">
             <p>🎉 Du hast Premium aktiv. Alle Biomarker sind für dich freigeschaltet.</p>
           </div>`
        : `<div class="price-card">
             <div class="price-option selected" id="opt-yearly" data-plan="yearly">
               <div class="price-label">Jahresabo <span class="badge-best">Beste Wahl</span></div>
               <div class="price-amount">${prices.yearly}<span class="price-period"> / Jahr</span></div>
               <div class="price-sub">≈ ${_monthlyEstimate(prices.yearly)} pro Monat</div>
             </div>
             <div class="price-option" id="opt-onetime" data-plan="onetime">
               <div class="price-label">Einmalzahlung</div>
               <div class="price-amount">${prices.onetime}</div>
               <div class="price-sub">Einmalig – kein Abo</div>
             </div>
           </div>

           <button class="btn-primary btn-purchase" id="btn-purchase">
             Premium freischalten
           </button>

           <p class="restore-text">
             <button class="btn-link" id="btn-restore">Kauf wiederherstellen</button>
           </p>`
      }

      <div class="features-card">
        <h3>Was ist enthalten?</h3>
        <div class="feature-list">
          <div class="feature-item"><span class="feature-check">✅</span><span>Alle 13 Vitamine (A, D, E, K, C, B1–B12)</span></div>
          <div class="feature-item"><span class="feature-check">✅</span><span>Alle 10 Spurenelemente inkl. Magnesium</span></div>
          <div class="feature-item"><span class="feature-check">✅</span><span>Laborwerte: Omega-3, Ferritin, Homocystein, TSH</span></div>
          <div class="feature-item"><span class="feature-check">✅</span><span>Körperwerte: Gewicht, BMI, Taillenumfang</span></div>
          <div class="feature-item"><span class="feature-check">✅</span><span>Geschlechtsspezifische DGE-Referenzwerte</span></div>
          <div class="feature-item"><span class="feature-check">✅</span><span>Passende Rezepte bei Mängeln</span></div>
          <div class="feature-item"><span class="feature-check">✅</span><span>Heimtest-Hinweise zu jedem Biomarker</span></div>
        </div>
      </div>

      <div class="free-card">
        <h3>Gratis immer verfügbar</h3>
        <div class="feature-list">
          <div class="feature-item"><span class="feature-check">🆓</span><span>Vitamin D</span></div>
          <div class="feature-item"><span class="feature-check">🆓</span><span>Vitamin B12</span></div>
          <div class="feature-item"><span class="feature-check">🆓</span><span>Eisen</span></div>
          <div class="feature-item"><span class="feature-check">🆓</span><span>Gewicht</span></div>
        </div>
      </div>

      <p class="legal-text">
        Zahlungen werden über Google Play abgewickelt.
        Das Jahresabo verlängert sich automatisch, sofern es nicht mindestens
        24 Stunden vor Ende der Laufzeit im Google-Konto gekündigt wird.
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
      // Fehler anzeigen und Button zurücksetzen
      showToast(`Fehler: ${result.error ?? 'Kauf konnte nicht abgeschlossen werden.'}`);
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
