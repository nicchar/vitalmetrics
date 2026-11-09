/**
 * journal.js – "Mein Tagebuch" (WellANNI 2.3, Nicole 30.10.2026)
 *
 * 1. Heute: "Was war heute gut?" und ein freier Eintrag (speichert beim Tippen)
 * 2. Rückblick "Vor 1 / 3 / 6 Monaten": Befinden, Gewicht und ein guter
 *    Moment aus dieser Zeit neben heute – ohne Bewertung
 * 3. Alle Einträge nach Monaten
 * Alles bleibt lokal auf dem Gerät.
 */
import { journalRepo, JOURNAL_MAX_LENGTH } from '../../infra/db/repositories/journalRepo.js';
import { checkinRepo } from '../../infra/db/repositories/checkinRepo.js';
import { measurementRepo } from '../../infra/db/repositories/measurementRepo.js';
import { buildLookback, groupByMonth, firstEntryDate } from '../../domain/journal.js';
import { escapeHtml, fmtNum } from '../components/recipeFormat.js';
import { navigate } from '../../router.js';
import { entitlements } from '../../domain/entitlements.js';

const TEXTAREA_STYLE = 'width:100%;padding:10px;border:1px solid var(--border);border-radius:8px;font-size:14px;font-family:inherit;resize:vertical;margin-top:6px';

function fmtDate(iso, opts = { weekday: 'short', day: 'numeric', month: 'long' }) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('de-DE', opts);
}

function sinceLabel(months) {
  return months === 1 ? 'Vor einem Monat' : `Vor ${months} Monaten`;
}

function renderLookback(items) {
  if (!items.length) {
    return `<div class="w-card"><p class="w-muted">Hier siehst du bald, wie es dir vor einem, drei und sechs Monaten ging – dein Befinden, dein Gewicht und deine guten Momente. Was du heute änderst, zeigt sich oft erst später. Schreib einfach jeden Tag ein bisschen.</p></div>`;
  }
  return items.map(it => {
    const rows = [];
    if (it.checkin != null) rows.push(`<span>Befinden damals <b>${fmtNum(it.checkin)} von 5</b>${it.checkinNow != null ? ` · heute <b>${fmtNum(it.checkinNow)}</b>` : ''}</span>`);
    if (it.weight != null) rows.push(`<span>Gewicht damals <b>${fmtNum(it.weight)} kg</b>${it.weightNow != null ? ` · heute <b>${fmtNum(it.weightNow)} kg</b>` : ''}</span>`);
    return `<div class="w-card journal-lookback" data-months="${it.months}" style="margin-bottom:10px">
      <b>${sinceLabel(it.months)}</b> <span class="w-small" style="margin:0">(${fmtDate(it.date, { day: 'numeric', month: 'long', year: 'numeric' })})</span>
      ${rows.length ? `<div class="w-body-row" style="margin-top:6px">${rows.join('')}</div>` : ''}
      ${it.moment ? `<p class="w-muted" style="margin-top:6px">💛 „${escapeHtml(it.moment.text)}“</p>` : ''}
    </div>`;
  }).join('');
}

function renderMonths(groups) {
  if (!groups.length) return '<p class="w-muted">Noch keine Einträge. Dein erster Eintrag steht oben.</p>';
  return groups.map(g => `<h3 class="w-group-title">${g.label}</h3>
    <div class="w-card">${g.entries.map(e => `<div class="journal-entry" style="padding:8px 0;border-bottom:1px solid var(--border)">
      <div class="w-small" style="margin:0">${fmtDate(e.date)}</div>
      ${e.good ? `<p style="margin-top:4px">💛 ${escapeHtml(e.good)}</p>` : ''}
      ${e.note ? `<p class="w-muted" style="margin-top:4px;white-space:pre-line">${escapeHtml(e.note)}</p>` : ''}
    </div>`).join('')}</div>`).join('');
}

export function renderJournal(container) {
  const today = new Date().toISOString().slice(0, 10);
  const day = journalRepo.getDay(today);
  const journal = journalRepo.getAll();
  const lookback = buildLookback({
    today,
    journal,
    checkins: checkinRepo.getAll(),
    weights: measurementRepo.getByBiomarker('gewicht'),
  });
  const first = firstEntryDate(journal);
  // 2.2.1 (Entscheidung 09.11.2026): Der Rückblick ist eine Premium-Funktion,
  // Schreiben und die Liste aller Einträge bleiben kostenlos.
  const isPremium = entitlements.isPremium();
  const others = { ...journal };
  delete others[today];

  container.innerHTML = `<div class="w-screen" id="journal-screen">
    <button class="w-link" id="btn-back-dashboard" type="button">← Heute</button>
    <h1 class="w-h1" style="margin-top:12px">Mein Tagebuch</h1>
    <p class="w-sub">${first ? `Du schreibst seit ${fmtDate(first, { day: 'numeric', month: 'long', year: 'numeric' })}.` : 'Kleine Schritte, die man später sieht.'}</p>

    <section class="w-block">
      <div class="w-block-title">Heute, ${fmtDate(today)}</div>
      <div class="w-card">
        <label for="journal-good"><b>Was war heute gut?</b></label>
        <textarea id="journal-good" rows="2" maxlength="${JOURNAL_MAX_LENGTH}" style="${TEXTAREA_STYLE}" placeholder="Ein schöner Moment, ein kleiner Erfolg, ein gutes Gespräch …">${escapeHtml(day.good || '')}</textarea>
        <label for="journal-note" style="display:block;margin-top:12px"><b>Dein Eintrag</b> <span class="w-small" style="margin:0">(optional)</span></label>
        <textarea id="journal-note" rows="4" maxlength="${JOURNAL_MAX_LENGTH}" style="${TEXTAREA_STYLE}" placeholder="Was hast du heute ausprobiert? Wie ging es dir mit Essen, Bewegung, Schlaf? Was nimmst du dir vor?">${escapeHtml(day.note || '')}</textarea>
        <p class="w-small" id="journal-saved" hidden>Gespeichert, nur auf deinem Handy.</p>
      </div>
    </section>

    <section class="w-block">
      <div class="w-block-title">Dein Rückblick</div>
      ${isPremium ? renderLookback(lookback) : `<div class="w-card">
        <p style="margin-top:0"><b>Was hat sich in 1, 3 und 6 Monaten verändert?</b></p>
        <p class="w-small">Der Rückblick stellt dein Befinden, dein Gewicht und einen guten Moment von damals neben heute – ganz ohne Bewertung. Er ist Teil von Premium. Deine Einträge werden in jedem Fall gespeichert, nur auf deinem Handy.</p>
        <button type="button" class="w-btn w-btn-primary" id="btn-journal-premium">Premium ansehen</button>
      </div>`}
    </section>

    <section class="w-block">
      <div class="w-block-title">Alle Einträge</div>
      ${renderMonths(groupByMonth(others))}
    </section>
  </div>`;

  const saved = container.querySelector('#journal-saved');
  let timer = null;
  for (const [id, field] of [['#journal-good', 'good'], ['#journal-note', 'note']]) {
    const el = container.querySelector(id);
    const save = () => { journalRepo.setField(today, field, el.value); saved.hidden = false; };
    el.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(save, 500); });
    el.addEventListener('blur', save);
  }
  container.querySelector('#btn-back-dashboard').addEventListener('click', () => navigate('dashboard'));
  container.querySelector('#btn-journal-premium')?.addEventListener('click', () => navigate('premium'));
}
