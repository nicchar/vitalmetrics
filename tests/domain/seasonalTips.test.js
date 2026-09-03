import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getSeasonalTip, getWildHerbTip, WILDHERBS_BY_MONTH, WILDHERB_SAFETY_NOTE } from '../../app/src/domain/seasonalTips.js';

test('getSeasonalTip: liefert fuer jeden Monat einen Tipp mit icon und text', () => {
  for (let m = 0; m < 12; m++) {
    const tip = getSeasonalTip(new Date(2026, m, 15));
    assert.ok(tip, `Monat ${m + 1} hat keinen Tipp`);
    assert.ok(tip.icon);
    assert.ok(tip.text.length > 10);
  }
});

/**
 * Wildkräuter des Monats (Review 11, 19.08.2026): eigener Saisonkalender,
 * getrennt von den Nährstoff-Tipps oben - Tester-Wunsch nach mehr Wildkräuter-
 * Inhalten. Rein informativ, KEIN Bestimmungsleitfaden (siehe Sicherheits-
 * hinweis-Test unten).
 */
test('getWildHerbTip: liefert fuer jeden Monat ein Wildkraut mit icon, name und text', () => {
  for (let m = 0; m < 12; m++) {
    const tip = getWildHerbTip(new Date(2026, m, 15));
    assert.ok(tip, `Monat ${m + 1} hat kein Wildkraut`);
    assert.ok(tip.icon);
    assert.ok(tip.name && tip.name.length > 2);
    assert.ok(tip.text.length > 10);
  }
});

test('WILDHERBS_BY_MONTH: genau 12 Einträge, alle Monate 1-12 abgedeckt', () => {
  assert.equal(Object.keys(WILDHERBS_BY_MONTH).length, 12);
  for (let m = 1; m <= 12; m++) {
    assert.ok(WILDHERBS_BY_MONTH[m], `Monat ${m} fehlt`);
  }
});

test('WILDHERBS_BY_MONTH: Bärlauch-Eintrag (März) warnt ausdrücklich vor den giftigen Doppelgängern', () => {
  const maerz = WILDHERBS_BY_MONTH[3];
  assert.match(maerz.name, /Bärlauch/);
  assert.match(maerz.text, /Maiglöckchen/);
  assert.match(maerz.text, /Herbstzeitlose/);
});

test('WILDHERBS_BY_MONTH: Holunderbeeren-Eintrag (August) weist auf die Erhitzungspflicht hin (roh unbekömmlich)', () => {
  const august = WILDHERBS_BY_MONTH[8];
  assert.match(august.name, /Holunderbeeren/);
  assert.match(august.text, /roh/);
});

test('WILDHERB_SAFETY_NOTE: verweist auf sichere Bestimmung und stellt klar, dass die App keine Pflanzenbestimmung ersetzt', () => {
  assert.match(WILDHERB_SAFETY_NOTE, /zweifelsfrei bestimmen/);
  assert.match(WILDHERB_SAFETY_NOTE, /ersetzt keine Pflanzenbestimmung/);
});
