import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getSeasonalTip } from '../../app/src/domain/seasonalTips.js';

test('getSeasonalTip: liefert fuer jeden Monat einen Tipp mit icon und text', () => {
  for (let m = 0; m < 12; m++) {
    const tip = getSeasonalTip(new Date(2026, m, 15));
    assert.ok(tip, `Monat ${m + 1} hat keinen Tipp`);
    assert.ok(tip.icon);
    assert.ok(tip.text.length > 10);
  }
});
