/**
 * dailyFacts.js – „Fakt des Tages“ (WellANNI 2.2.1, 19.11.2026)
 *
 * Dieselben Fakten wie die WellANNI-Fakt-Reels auf Instagram/Pinterest und
 * wellanni.de/fakten.html. Zahlen aus dem Bundeslebensmittelschlüssel (BLS),
 * Referenzwerte DGE. Gesundheitsbezogene Aussagen sind WORTGLEICH zugelassene
 * Angaben nach VO (EU) 432/2012 – beim Ergänzen nicht umformulieren.
 *
 * Felder: title (Hook), text (Erklärung inkl. Claim), recipeId (Rezept in der
 * App) oder route (Bildschirm), cta (Knopftext).
 */
export const DAILY_FACTS = [
  { icon: '🍋', title: 'Ein Spritzer Zitrone in die Linsensuppe ist kein Deko-Trick.',
    text: 'Linsen liefern Eisen. Zitronensaft liefert Vitamin C – und Vitamin C erhöht die Eisenaufnahme.',
    recipeId: 'linsensuppe_zitrone' },
  { icon: '☀️', title: 'Von Oktober bis März bildet deine Haut kaum Vitamin D aus der Sonne.',
    text: 'Lachs gehört zu den wenigen Lebensmitteln mit nennenswert Vitamin D. Vitamin D trägt zu einer normalen Funktion des Immunsystems bei.',
    recipeId: 'lachsfilet_spinat' },
  { icon: '🥬', title: '100 g roher Rotkohl haben etwa so viel Vitamin C wie eine Orange.',
    text: 'Und Rotkohl wächst hier, gerade im Winter. Vitamin C trägt zu einer normalen Funktion des Immunsystems bei.',
    recipeId: 'quinoa_salat_rotkohl_suesskartoffel_14' },
  { icon: '🌙', title: 'Vor deinen Tagen mehr Hunger als sonst?',
    text: 'Studien zeigen: In der zweiten Zyklushälfte essen Frauen im Schnitt etwas mehr. Das ist Biologie – kein Disziplin-Problem.',
    route: 'cycle', cta: 'Zum Zyklus' },
  { icon: '🥄', title: 'Skyr ist eigentlich gar kein Joghurt.',
    text: 'Skyr ist ein Frischkäse – darum hat er rund 2,5-mal so viel Eiweiß wie Joghurt: 10 g statt 4 g pro 100 g. Eiweiß trägt zur Erhaltung von Muskelmasse bei.',
    recipeId: 'skyr_walnuesse_zimt' },
  { icon: '🥦', title: 'Grünkohl schlägt Milch – beim Calcium.',
    text: 'Gedünsteter Grünkohl: 249 mg Calcium pro 100 g. Milch: 117 mg. Calcium wird für die Erhaltung normaler Knochen benötigt.',
    recipeId: 'kichererbsen_eintopf_gruenkohl_vollkornnudeln_10' },
  { icon: '☕', title: 'Kaffee zum Linsengericht? Lieber eine Stunde warten.',
    text: 'Stoffe in Kaffee und Schwarztee hemmen die Aufnahme von Eisen aus Pflanzen. Die Zitrone hilft: Vitamin C erhöht die Eisenaufnahme.',
    recipeId: 'linsen_dal_spinat_kokos' },
  { icon: '🥚', title: 'Vitamin B12 steckt fast nur in tierischen Lebensmitteln.',
    text: 'Ein Ei liefert rund ein Drittel deines Tageswerts (etwa 1,2 von 4 µg). Vitamin B12 trägt zu einem normalen Energiestoffwechsel bei.',
    recipeId: 'ruehrei_raeucherlachs' },
  { icon: '🌻', title: 'Magnesium ohne Kapsel: 2 Esslöffel Kerne reichen für ein Drittel.',
    text: '30 g Sonnenblumenkerne liefern rund 100 mg Magnesium – ein Drittel deines Tageswerts (300 mg). Magnesium trägt zur Verringerung von Müdigkeit und Ermüdung bei.',
    recipeId: 'overnight_oats_chia_beeren' },
  { icon: '💪', title: 'Magerquark hat sogar etwas mehr Eiweiß als Skyr.',
    text: 'Magerquark: 11,8 g Eiweiß pro 100 g, Skyr: 10,3 g – bei fast gleichen Kalorien. Eiweiß trägt zur Erhaltung von Muskelmasse bei.',
    recipeId: 'kraeuterquark_rohkost' },
];

/** Fakt für ein Datum – wechselt täglich, offline, für alle gleich. */
export function getDailyFact(date = new Date(), facts = DAILY_FACTS) {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  return facts[((day % facts.length) + facts.length) % facts.length];
}
