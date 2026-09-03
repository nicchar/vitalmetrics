/**
 * seasonalTips.js
 *
 * Saisonale, nicht-diagnostische Hinweise für die Dashboard-Startseite
 * (Block E). Rein informativ, keine individuelle Bewertung.
 */
const TIPS_BY_MONTH = {
  1: { icon: '☀️', text: 'Im Winter reicht die Sonneneinstrahlung in Deutschland meist nicht für die körpereigene Vitamin-D-Bildung – ein Blick auf deine Zufuhr lohnt sich.' },
  2: { icon: '☀️', text: 'Später Winter: Erkältungszeit – Vitamin C und Zink aus der Ernährung unterstützen ein normal funktionierendes Immunsystem.' },
  3: { icon: '🌱', text: 'Frühlingsgemüse wie Spinat und Spargel liefern viel Folat – gut für die Zellteilung.' },
  4: { icon: '🌱', text: 'Mit steigenden Temperaturen mehr Bewegung im Freien – ein Baustein für die Vitamin-D-Bildung über die Haut.' },
  5: { icon: '🥗', text: 'Erdbeersaison: eine der besten heimischen Vitamin-C-Quellen.' },
  6: { icon: '💧', text: 'Bei warmen Temperaturen steigt der Flüssigkeitsbedarf – ausreichend trinken nicht vergessen.' },
  7: { icon: '💧', text: 'Hochsommer: Elektrolyte (Magnesium, Kalium) bei viel Schwitzen im Blick behalten.' },
  8: { icon: '🥗', text: 'Sommergemüse und Beeren sind reich an Antioxidantien und Vitamin C.' },
  9: { icon: '🍂', text: 'Die Sonnenstunden nehmen ab – ein guter Zeitpunkt, die eigene Vitamin-D-Zufuhr im Blick zu behalten.' },
  10: { icon: '🍂', text: 'Herbstzeit, Erkältungszeit: Vitamin C und Zink aus Obst/Gemüse können das Immunsystem unterstützen.' },
  11: { icon: '☁️', text: 'Wenig Sonnenlicht im November – Fisch, Eier und angereicherte Lebensmittel liefern etwas Vitamin D über die Nahrung.' },
  12: { icon: '☁️', text: 'Kurze Tage, wenig Sonne: ein guter Anlass, die Vitamin-D-Zufuhr über den Winter zu tracken.' },
};

/**
 * @param {Date} [date] - für Tests injizierbar, Standard: heute
 */
export function getSeasonalTip(date = new Date()) {
  return TIPS_BY_MONTH[date.getMonth() + 1];
}

/**
 * Wildkräuter des Monats (Review 11, 19.08.2026): Nicoles Testerinnen legen
 * ausdrücklich Wert auf Wildkräuter/Sammeln - eigener, von den Nährstoff-
 * Hinweisen (TIPS_BY_MONTH) getrennter Saisonkalender. Rein informativ wie
 * der Rest der App, KEIN Bestimmungsleitfaden und KEIN Ersatz dafür (siehe
 * WILDHERB_SAFETY_NOTE) - die Inhalte fassen allgemein bekannte, botanisch
 * unstrittige Fakten zu weit verbreiteten heimischen Wildpflanzen zusammen
 * (u. a. anhand von Wikipedia/Wikimedia-Material recherchiert, in eigenen
 * Worten formuliert), keine wörtliche Übernahme einer einzelnen Quelle.
 */
export const WILDHERBS_BY_MONTH = {
  1: { icon: '🌿', name: 'Vogelmiere', text: 'Vogelmiere wächst an milden Wintertagen oft weiter und ist eines der wenigen Wildkräuter, die schon jetzt zu finden sind – milder, spinatartiger Geschmack, reich an Vitamin C.' },
  2: { icon: '🌿', name: 'Giersch', text: 'Die ersten zarten Giersch-Triebe zeigen sich oft schon im Spätwinter – jung geerntet schmecken sie mild, petersilienähnlich.' },
  3: { icon: '🧄', name: 'Bärlauch', text: 'Bärlauchsaison in feuchten Laubwäldern: deutlicher Knoblauchduft beim Zerreiben eines Blatts ist das wichtigste Unterscheidungsmerkmal zu den giftigen Doppelgängern Maiglöckchen und Herbstzeitlose.' },
  4: { icon: '🌱', name: 'Brennnessel', text: 'Junge Brennnesseltriebe sind reich an Eisen und Vitamin C – für Tee, Suppe oder als Spinat-Ersatz, am besten mit Handschuhen ernten.' },
  5: { icon: '🌼', name: 'Löwenzahn', text: 'Löwenzahnblätter und -blüten sind komplett essbar – die Blätter leicht bitter, gut für Salate, die Blüten z. B. für Sirup.' },
  6: { icon: '🌸', name: 'Holunderblüten', text: 'Holunderblüten duften jetzt intensiv und eignen sich für Sirup oder Tee – nur die Blüten, nicht die noch grünen, unreifen Beeren verwenden.' },
  7: { icon: '🌾', name: 'Schafgarbe', text: 'Schafgarbe blüht jetzt an Wegrändern und Wiesen – traditionell als aromatisch-bitterer Tee genutzt.' },
  8: { icon: '🫐', name: 'Holunderbeeren', text: 'Reife, dunkelviolette Holunderbeeren sind jetzt erntereif – roh unbekömmlich, daher immer erhitzen (z. B. zu Saft oder Mus).' },
  9: { icon: '🍑', name: 'Hagebutten', text: 'Hagebutten sind jetzt reif und liefern viel Vitamin C – für Tee oder Mus die Kerne und die feinen, hautreizenden Härchen entfernen.' },
  10: { icon: '🫐', name: 'Schlehen', text: 'Schlehen schmecken nach dem ersten Frost deutlich milder – wer nicht warten möchte, legt sie vor der Verarbeitung ein paar Stunden ins Gefrierfach.' },
  11: { icon: '🌰', name: 'Brennnesselsamen', text: 'Die kleinen, nährstoffreichen Brennnesselsamen lassen sich jetzt von den Fruchtständen abstreifen – z. B. geröstet als Topping.' },
  12: { icon: '🍵', name: 'Wildkräuter-Rückblick', text: 'Sammelpause: eine gute Zeit, getrocknete Kräuter aus dem Jahr (z. B. Brennnessel, Schafgarbe) als Tee zu genießen und ein Bestimmungsbuch für die neue Saison griffbereit zu legen.' },
};

/**
 * Verpflichtender Sicherheitshinweis (Heilpraktikerin- und Tester-Feedback,
 * Review 11): Wildkräuter können giftige Doppelgänger haben - die App macht
 * dazu ausdrücklich keine eigene Bestimmungsaussage.
 */
export const WILDHERB_SAFETY_NOTE = 'Nur sammeln, was du zweifelsfrei bestimmen kannst – im Zweifel stehen lassen und ein Bestimmungsbuch oder eine erfahrene Person hinzuziehen. Diese App ersetzt keine Pflanzenbestimmung.';

/**
 * @param {Date} [date] - für Tests injizierbar, Standard: heute
 */
export function getWildHerbTip(date = new Date()) {
  return WILDHERBS_BY_MONTH[date.getMonth() + 1];
}
