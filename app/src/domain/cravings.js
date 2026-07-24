/**
 * cravings.js
 *
 * Referenzdaten + Musteranalyse für das Heißhunger-Journal.
 * Portiert aus dem Monolithen (VitalMetrics.html).
 */

export const CRAVING_MOODS = [
  { key: 'stressed', label: '😤 Stress' },
  { key: 'tired',     label: '😴 Müde' },
  { key: 'bored',     label: '😑 Gelangweilt' },
  { key: 'sad',       label: '😢 Traurig' },
  { key: 'happy',     label: '😊 Glücklich' },
  { key: 'neutral',   label: '😐 Neutral' },
];

export const CRAVING_TRIGGERS = ['Stress', 'Müdigkeit', 'Langeweile', 'Hunger', 'Routine', 'Geruch/Sehen', 'Belohnung', 'Sonstiges'];

/**
 * Analysiert Muster in den Heißhunger-Einträgen (Peak-Uhrzeit, häufigster
 * Auslöser/Stimmung, Ø Hunger-Level). Ab 3 Einträgen aussagekräftig.
 */
export function analyzeCravings(list) {
  if (list.length < 3) return null;
  const hours = list.map(c => new Date(c.timestamp).getHours());
  const hourCount = {};
  hours.forEach(h => { hourCount[h] = (hourCount[h] || 0) + 1; });
  const peakHour = Object.entries(hourCount).sort((a, b) => b[1] - a[1])[0];

  const trigCount = {};
  list.forEach(c => { if (c.trigger) trigCount[c.trigger] = (trigCount[c.trigger] || 0) + 1; });
  const topTrig = Object.entries(trigCount).sort((a, b) => b[1] - a[1])[0];

  const moodCount = {};
  list.forEach(c => { if (c.mood) moodCount[c.mood] = (moodCount[c.mood] || 0) + 1; });
  const topMood = Object.entries(moodCount).sort((a, b) => b[1] - a[1])[0];

  const withHunger = list.filter(c => c.hungerLevel);
  const avgHunger = withHunger.length ? withHunger.reduce((s, c) => s + c.hungerLevel, 0) / withHunger.length : null;

  return {
    peakHour: peakHour?.[0],
    topTrig: topTrig?.[0],
    topMood: topMood?.[0],
    avgHunger: avgHunger?.toFixed(1),
    total: list.length,
  };
}
