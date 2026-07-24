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
