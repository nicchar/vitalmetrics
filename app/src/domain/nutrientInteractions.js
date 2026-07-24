/**
 * nutrientInteractions.js
 *
 * Gut belegte Nährstoff-Nährstoff- und Nährstoff-Lebensstil-Wechselwirkungen
 * (Block E). Bewusst nur allgemein bekannte, breit dokumentierte Effekte -
 * keine individualisierte Bewertung, kein Ersatz für Ernährungsberatung.
 *
 * Jeder Eintrag: { a, b, effect: 'foerdert' | 'hemmt', text }
 * `a`/`b` sind Biomarker-IDs aus biomarkerCatalog.json ODER die Strings
 * 'alkohol' / 'koffein' / 'rauchen' / 'fett' für Lebensstil-/Makro-Faktoren.
 */
export const NUTRIENT_INTERACTIONS = [
  { a: 'vitamin_c', b: 'eisen', effect: 'foerdert', text: 'Vitamin C verbessert die Aufnahme von pflanzlichem (Non-Häm-)Eisen deutlich – z. B. Linsen mit Zitronensaft kombinieren.' },
  { a: 'calcium', b: 'eisen', effect: 'hemmt', text: 'Calcium und Eisen konkurrieren bei der Aufnahme im Darm – calciumreiche Lebensmittel und Eisenquellen nicht in derselben Mahlzeit kombinieren.' },
  { a: 'koffein', b: 'eisen', effect: 'hemmt', text: 'Tannine in Kaffee und Tee hemmen die Eisenaufnahme – mindestens 30 Minuten Abstand zu eisenreichen Mahlzeiten halten.' },
  { a: 'alkohol', b: 'vitamin_b1', effect: 'hemmt', text: 'Alkohol hemmt die Aufnahme und Speicherung von Vitamin B1 (Thiamin) erheblich – bei regelmäßigem Konsum steigt der Bedarf.' },
  { a: 'vitamin_d', b: 'calcium', effect: 'foerdert', text: 'Vitamin D ist notwendig, damit der Körper Calcium aus der Nahrung überhaupt aufnehmen kann.' },
  { a: 'vitamin_k', b: 'calcium', effect: 'foerdert', text: 'Vitamin K unterstützt den Einbau von Calcium in die Knochen.' },
  { a: 'zink', b: 'kupfer', effect: 'hemmt', text: 'Dauerhaft hohe Zinkzufuhr (z. B. durch Supplemente) kann die Kupferaufnahme verringern.' },
  { a: 'fett', b: 'vitamin_a', effect: 'foerdert', text: 'Vitamin A ist fettlöslich – etwas Fett in der Mahlzeit verbessert die Aufnahme deutlich (z. B. Karotten mit Öl).' },
  { a: 'fett', b: 'vitamin_d', effect: 'foerdert', text: 'Vitamin D ist fettlöslich und wird zusammen mit einer fetthaltigen Mahlzeit besser aufgenommen.' },
  { a: 'fett', b: 'vitamin_e', effect: 'foerdert', text: 'Vitamin E ist fettlöslich – die Aufnahme gelingt zusammen mit etwas Fett deutlich besser.' },
  { a: 'fett', b: 'vitamin_k', effect: 'foerdert', text: 'Vitamin K ist fettlöslich und wird zusammen mit Fett aus der Nahrung besser aufgenommen.' },
  { a: 'vitamin_b9', b: 'vitamin_b12', effect: 'hemmt', text: 'Sehr hohe Folsäure-Zufuhr (z. B. durch Supplemente) kann einen Vitamin-B12-Mangel im Blutbild verschleiern – bei Verdacht auf Mangel beide Werte gemeinsam prüfen lassen.' },
  { a: 'calcium', b: 'magnesium', effect: 'hemmt', text: 'Sehr hohe Calciumzufuhr kann die Magnesiumaufnahme verringern – auf ein ausgewogenes Verhältnis achten statt einseitig hochzudosieren.' },
  { a: 'rauchen', b: 'vitamin_c', effect: 'hemmt', text: 'Raucher:innen haben einen deutlich erhöhten Vitamin-C-Bedarf, da Rauchen den Verbrauch im Körper erhöht.' },
  { a: 'eisen', b: 'zink', effect: 'hemmt', text: 'Hochdosierte Eisen-Supplemente können gleichzeitig eingenommenes Zink in der Aufnahme hemmen – Einnahme zeitlich trennen, falls beides supplementiert wird.' },
];

/**
 * Liefert alle Interaktionen, an denen der gegebene Biomarker/Faktor beteiligt
 * ist (als a ODER b), inkl. der jeweils anderen Seite als `partner`.
 */
export function getInteractionsFor(id) {
  return NUTRIENT_INTERACTIONS
    .filter(i => i.a === id || i.b === id)
    .map(i => ({ ...i, partner: i.a === id ? i.b : i.a }));
}
