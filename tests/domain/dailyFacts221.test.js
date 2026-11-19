import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DAILY_FACTS, getDailyFact } from '../../app/src/domain/dailyFacts.js';
import { APPROVED_CLAIMS } from '../../app/src/domain/healthClaims.js';
import { FASTING_STAGES } from '../../app/src/domain/fasting.js';

const recipes = JSON.parse(readFileSync(new URL('../../app/src/data/recipes.json', import.meta.url), 'utf8'));
const ids = new Set(recipes.map(r => r.id));

test('Fakt des Tages: jeder Fakt hat Titel, Text und ein gültiges Ziel (Rezept oder Bildschirm)', () => {
  assert.ok(DAILY_FACTS.length >= 10);
  for (const f of DAILY_FACTS) {
    assert.ok(f.title && f.text && f.icon);
    assert.ok(f.recipeId ? ids.has(f.recipeId) : !!f.route, `Ziel fehlt/ungültig: ${f.title}`);
  }
});

test('Fakt des Tages: Nährstoff-Aussagen sind wortgleich zugelassene Angaben', () => {
  const claimish = /trägt zu|trägt zur|erhöht die|wird für die/;
  for (const f of DAILY_FACTS) {
    const sentences = f.text.split(/(?<=\.)\s+/).filter(s => claimish.test(s));
    for (const s of sentences) {
      // Angabe muss wortgleich am Satzende stehen (davor z. B. „Die Zitrone hilft:“)
      const ok = APPROVED_CLAIMS.some(c => s.toLowerCase().endsWith(c.toLowerCase()));
      assert.ok(ok, `Nicht zugelassen: "${s}"`);
    }
  }
});

test('Fakt des Tages: wechselt täglich und ist für ein Datum stabil', () => {
  const a = getDailyFact(new Date(2026, 10, 19));
  assert.equal(a, getDailyFact(new Date(2026, 10, 19, 23, 59)));
  assert.notEqual(a, getDailyFact(new Date(2026, 10, 20)));
});

test('Fasten-Stufen: keine Wirkversprechen (Fettverbrennung, Ketose, Klarheit, Entgiftung)', () => {
  const txt = FASTING_STAGES.map(s => `${s.name} ${s.desc}`).join(' ');
  assert.ok(!/Fettverbrennung|Ketose|Klarheit|Fokus|Entgift|Autophagie|Insulin/i.test(txt), txt);
});
