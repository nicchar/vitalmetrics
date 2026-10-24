/**
 * household.js – WellANNI 2.2
 *
 * Haushalt für Wochenplan und Einkaufsliste: Erwachsene und Kinder.
 * Ein Kind zählt als halbe Portion – eine grobe, alltagstaugliche Annahme
 * für Kinder im Kita- und Grundschulalter; Jugendliche trägt man besser als
 * Erwachsene ein (steht so auch im Profil).
 */
export const KID_PORTION = 0.5;
export const MAX_ADULTS = 8;
export const MAX_KIDS = 8;

export function household(profile = {}) {
  const adults = Math.max(0, Math.min(MAX_ADULTS, Number(profile.householdAdults) || 0));
  const kids = Math.max(0, Math.min(MAX_KIDS, Number(profile.householdKids) || 0));
  return { adults, kids, isSet: adults + kids > 0 };
}

/** Portionen für die Einkaufsliste (mind. 1). Ohne Angabe: Fallback. */
export function householdPortions(profile = {}, fallback = 1) {
  const { adults, kids, isSet } = household(profile);
  if (!isSet) return fallback;
  return Math.max(1, adults + kids * KID_PORTION);
}

/** Ganze Portionen für den Portionsrechner auf der Rezeptseite. */
export function householdServings(profile = {}) {
  const { isSet } = household(profile);
  return isSet ? Math.ceil(householdPortions(profile)) : null;
}

export function householdLabel(profile = {}) {
  const { adults, kids, isSet } = household(profile);
  if (!isSet) return null;
  const parts = [];
  if (adults) parts.push(`${adults} Erwachsene${adults === 1 ? 'r' : ''}`);
  if (kids) parts.push(`${kids} Kind${kids === 1 ? '' : 'er'}`);
  return parts.join(' und ');
}
