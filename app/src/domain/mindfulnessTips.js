/**
 * mindfulnessTips.js – WellANNI 2.3 (Nicole, 30.10.2026)
 *
 * Täglicher Achtsamkeitsimpuls auf der Startseite. Kleine Einladungen statt
 * Aufgaben: keine Wirkversprechen ("hilft gegen", "senkt"), keine Diät- oder
 * Körperbild-Sprache. Rotiert nach Datum, offline, für alle gleich.
 */
export const MINDFULNESS_TIPS = [
  { icon: '🌬️', text: 'Drei tiefe Atemzüge, bevor du heute das Handy in die Hand nimmst.' },
  { icon: '🚶', text: 'Probier heute 30 Minuten draußen: Mittagspause, Feierabend oder ein Umweg zu Fuß.' },
  { icon: '☕', text: 'Trink deinen ersten Tee oder Kaffee heute einmal ohne Bildschirm. Nur du und die Tasse.' },
  { icon: '🍽️', text: 'Iss eine Mahlzeit heute ganz in Ruhe: hinsetzen, Teller statt Packung, langsam kauen.' },
  { icon: '💛', text: 'Was magst du an deinem Körper? Sag ihm heute einmal danke dafür, was er jeden Tag für dich trägt.' },
  { icon: '📵', text: 'Eine Stunde vor dem Schlafen: Handy weg, Licht runter, etwas Ruhiges für dich.' },
  { icon: '🌅', text: 'Öffne heute Morgen kurz das Fenster und schau zwei Minuten nach draußen, bevor der Tag losgeht.' },
  { icon: '🤸', text: 'Fünf Minuten Bewegung am Morgen: strecken, Arme kreisen, ein paar Kniebeugen.' },
  { icon: '📝', text: 'Schreib heute Abend auf, was gut war. Auch kleine Dinge zählen.' },
  { icon: '📞', text: 'Melde dich heute bei einem Menschen, an den du gerade denkst.' },
  { icon: '🛁', text: 'Plane heute 10 Minuten nur für dich ein, wie einen Termin im Kalender.' },
  { icon: '🥕', text: 'Wie viele verschiedene Pflanzen schaffst du heute? Kräuter, Nüsse und Gewürze zählen mit.' },
  { icon: '💧', text: 'Stell dir ein Glas Wasser in Sichtweite. Jedes Mal, wenn du es siehst: ein Schluck.' },
  { icon: '🌳', text: 'Geh heute ein Stück langsamer als sonst und achte auf drei Dinge, die du sonst übersiehst.' },
  { icon: '🙆', text: 'Lockere zwischendurch Schultern und Kiefer. Wo hältst du gerade Spannung fest?' },
  { icon: '🍵', text: 'Nach dem Abendessen: Tee kochen, Küche schließen. Ein kleines Ritual für den Feierabend.' },
  { icon: '🫶', text: 'Sprich heute einmal so freundlich mit dir, wie du mit deiner besten Freundin sprechen würdest.' },
  { icon: '🎶', text: 'Hör heute ein Lied ganz bewusst, ohne nebenbei etwas anderes zu tun.' },
  { icon: '🪟', text: 'Gönn dir heute Tageslicht: Mittag am Fenster oder kurz raus, auch wenn es grau ist.' },
  { icon: '🥗', text: 'Frag dich vor dem Essen kurz: Hunger, Durst, Müdigkeit oder Langeweile?' },
  { icon: '🛏️', text: 'Geh heute zur gleichen Zeit ins Bett wie gestern. Ein fester Rhythmus tut gut.' },
  { icon: '👟', text: 'Nimm heute die Treppe statt des Aufzugs. Viele kleine Wege summieren sich.' },
  { icon: '🌿', text: 'Eine Minute nur atmen: vier Sekunden ein, sechs Sekunden aus.' },
  { icon: '📚', text: 'Lies heute zehn Seiten in einem Buch, nur zum Vergnügen.' },
  { icon: '🍲', text: 'Koch heute etwas mit jemandem zusammen oder lade jemanden zum Essen ein.' },
  { icon: '🙏', text: 'Nenne drei Dinge, für die du heute dankbar bist.' },
  { icon: '🧘', text: 'Setz dich zwei Minuten still hin und spür deine Füße auf dem Boden.' },
  { icon: '🌧️', text: 'Graues Wetter? Zieh dich warm an und geh trotzdem zehn Minuten raus.' },
  { icon: '✋', text: 'Sag heute einmal Nein zu etwas, das dir gerade zu viel ist.' },
  { icon: '🍎', text: 'Bereite dir heute einen Snack vor, auf den du dich freust, und genieß ihn am Tisch.' },
  { icon: '🌙', text: 'Leg dir heute Abend die Sachen für morgen bereit. Ein ruhiger Morgen beginnt am Abend.' },
  { icon: '🎨', text: 'Mach heute etwas mit den Händen: kochen, malen, gärtnern, basteln.' },
  { icon: '😊', text: 'Schreib einem Menschen heute eine Nachricht, warum du ihn magst.' },
  { icon: '🚲', text: 'Erledige heute einen Weg zu Fuß oder mit dem Rad statt mit dem Auto.' },
  { icon: '🪞', text: 'Dein Körper verändert sich mit den Jahren, im Zyklus, in jeder Lebensphase. Das gehört zu dir.' },
  { icon: '🕯️', text: 'Mach es dir heute Abend gemütlich: Kerze, Decke, Lieblingsgetränk.' },
  { icon: '🥣', text: 'Starte mit einem Frühstück, das dich satt macht: Eiweiß und Ballaststoffe halten lange.' },
  { icon: '🌤️', text: 'Was hat dich heute zum Lächeln gebracht? Halte es kurz fest.' },
  { icon: '🏃', text: 'Probier heute eine neue Bewegung aus: tanzen in der Küche zählt auch.' },
  { icon: '🔕', text: 'Schalte für eine Stunde die Benachrichtigungen aus und schau, wie sich das anfühlt.' },
  { icon: '🌻', text: 'Kein perfekter Tag nötig. Ein guter Moment reicht.' },
  { icon: '🧺', text: 'Räum heute eine kleine Ecke auf. Ordnung außen schafft oft Ruhe innen.' },
  { icon: '🥾', text: 'Plane fürs Wochenende einen Spaziergang mit jemandem, den du gern siehst.' },
  { icon: '💭', text: 'Wenn heute etwas nicht klappt: Was würdest du einer Freundin sagen?' },
  { icon: '🌱', text: 'Was du heute anfängst, zeigt sich vielleicht erst in ein paar Monaten. Bleib freundlich dran.' },
  { icon: '🍋', text: 'Probier heute ein Gemüse oder Obst, das du lange nicht gegessen hast.' },
  { icon: '🛋️', text: 'Gönn dir heute eine Pause, ohne dafür einen Grund zu brauchen.' },
  { icon: '👐', text: 'Leg beim Einschlafen die Hände auf den Bauch und spür, wie er sich mit dem Atem hebt.' },
  { icon: '🗓️', text: 'Schau auf deine Woche: Wo ist Platz für etwas, das nur dir Freude macht?' },
  { icon: '🌊', text: 'Stress im Kopf? Fünf Dinge sehen, vier hören, drei fühlen. Ganz im Moment ankommen.' },
  { icon: '🥂', text: 'Feier heute einen kleinen Erfolg, egal wie klein er dir vorkommt.' },
  { icon: '🍃', text: 'Mach heute einen Teil deines Weges ohne Kopfhörer und hör einfach zu.' },
  { icon: '🫖', text: 'Abends Lust auf Süßes? Erst ein warmer Tee und zwei Minuten Pause, dann entscheiden.' },
  { icon: '🌍', text: 'Such dir heute einen Lieblingsplatz draußen und bleib dort ein paar Minuten.' },
  { icon: '📷', text: 'Fotografiere heute etwas Schönes aus deinem Alltag, nur für dich.' },
  { icon: '🤗', text: 'Umarme heute jemanden ein bisschen länger als sonst.' },
  { icon: '🧡', text: 'Zieh heute etwas an, in dem du dich richtig wohlfühlst.' },
  { icon: '⏳', text: 'Gönn dir zwischen zwei Terminen fünf Minuten Puffer statt direkt weiterzuhetzen.' },
  { icon: '🌾', text: 'Iss heute bewusst eine Portion Vollkorn oder Hülsenfrüchte mehr. Dein Bauch freut sich über Abwechslung.' },
  { icon: '✨', text: 'Schau zurück: Was machst du heute anders als vor einem Monat?' },
];

/** Impuls für ein Datum: rotiert über den Tag im Jahr, jeden Tag ein anderer. */
export function getMindfulnessTip(date = new Date()) {
  const start = Date.UTC(date.getFullYear(), 0, 0);
  const now = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const dayOfYear = Math.floor((now - start) / 86400000);
  return MINDFULNESS_TIPS[(dayOfYear + date.getFullYear()) % MINDFULNESS_TIPS.length];
}
