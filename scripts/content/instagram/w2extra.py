# Woche 2 Ergänzung (2.–8.11.2026): neue Säulen nach Zielgruppe_und_Markenkern (30.10.)
# Instagram täglich 15:00 zusätzlich, Pinterest täglich 09:00 zusätzlich.

DISCLAIMER = '*EU-zugelassene gesundheitsbezogene Angabe. WellANNI ist kein Medizinprodukt und ersetzt keine ärztliche Beratung.'
DS = DISCLAIMER.replace('*', '\\*')
W = 'https://wellanni.de/'
BA = W + 'bewegung-achtsamkeit.html'
DA = W + 'darm-immunsystem.html'
TAGS_A = '#Achtsamkeit #MeTime #Selbstfürsorge #GesundeGewohnheiten #WellANNI'


def U(url, content):
    return f'{url}?utm_source=pinterest&utm_medium=pin&utm_campaign=w2_saeulen&utm_content={content}'


POSTS = [
# ───── Mo 2.11. 15:00 · Säule 1: Abendnaschen ─────
dict(id='w2x-01_post_abends-naschen', folder='01_Mo-02-11', fmt='post', day='Mo 2.11.', time='15:00', serie='Gesund essen & leichter werden',
  title='Karussell: Abends ständig naschen? 4 Ideen', link=BA,
  slides=[
    dict(t='cover', kicker='Kennst du das?', title='Abends\nständig\n*naschen?*', sub='Mit Disziplin hat das wenig zu tun. 4 Ideen, die wirklich helfen.'),
    dict(t='list', kicker='Woher es kommt', title='Oft steckt\n*das* dahinter', items=[
        ('Zu wenig gegessen', 'Wer tagsüber kaum isst, holt es abends nach.'),
        ('Müdigkeit', 'Der Körper sucht schnelle Energie.'),
        ('Langeweile oder Stress', 'Snacken als kleine Belohnung nach einem langen Tag.')]),
    dict(t='list', kicker='Was du tun kannst', title='4 Ideen für\n*ruhige Abende*', items=[
        ('Satt zu Abend essen', 'Eiweiß und Ballaststoffe: Linsen, Quark, Eier, Gemüse.'),
        ('Küche schließen', 'Tee kochen, Zähne putzen, Licht aus.'),
        ('Kurz nachspüren', 'Hunger, Durst, Müdigkeit oder Langeweile?'),
        ('Wenn naschen, dann genießen', 'Kleine Portion auf dem Teller statt aus der Tüte.')], size=84),
    dict(t='end', title='Welche Idee\nprobierst du\n*heute* aus?', size=96, sub='Schreib die Zahl in die Kommentare. Und speicher dir den Post für heute Abend.'),
  ],
  caption="""Abends ständig naschen? Das hat selten mit fehlender Disziplin zu tun 🌙

Oft steckt dahinter: tagsüber zu wenig gegessen, müde oder einfach ein langer Tag, der eine kleine Belohnung will.

4 Ideen für ruhigere Abende:
1️⃣ Satt zu Abend essen: Eiweiß und Ballaststoffe halten lange satt (Linsen, Quark, Eier, Gemüse, Vollkorn)
2️⃣ Küche schließen: Tee kochen, Zähne putzen, Licht in der Küche aus
3️⃣ Kurz nachspüren: Hunger, Durst, Müdigkeit oder Langeweile? Erst ein Glas Wasser, dann entscheiden
4️⃣ Wenn naschen, dann mit Genuss: kleine Portion auf einem Teller statt aus der Tüte

Welche Idee probierst du heute aus? 👇

📌 Speichern für heute Abend.

#GesundAbnehmen #Heißhunger #GesundeErnährung #Abendroutine #WellANNI""",
  alt='4 Folien: Abends ständig naschen? Gründe: zu wenig gegessen, Müdigkeit, Langeweile. 4 Ideen: satt zu Abend essen, Küche schließen, kurz nachspüren, bewusst genießen.',
  note=''),

# ───── Di 3.11. 15:00 · Säule 4: Spaziergang (Reel) ─────
dict(id='w2x-02_reel_30-minuten-draussen', folder='02_Di-03-11', fmt='reel', day='Di 3.11.', time='15:00', serie='Bewegung im Alltag',
  title='Reel: 30 Minuten draußen – jeden Tag', link=BA,
  slides=[
    dict(t='big', kicker='Die einfachste Gewohnheit', big='30 Min.', bigsize=200, title='draußen. Jeden Tag. *Auch wenn’s grau ist.*', size=84, dur=2.8),
    dict(t='big', kicker='Gut zu wissen', big='150 Min.', bigsize=180, title='Bewegung pro Woche empfiehlt die *WHO* für Erwachsene. Das sind 5 × 30 Minuten.', size=72, dur=3.6),
    dict(t='list', kicker='So klappt’s', title='Mach eine\n*Verabredung* draus', size=96, items=[
        ('Mittagspause', 'Tageslicht tanken, Kopf frei'),
        ('Mit Freundin oder Hörbuch', 'Die Zeit vergeht wie im Flug'),
        ('Umweg nach Hause', 'Eine Station früher aussteigen')], dur=4.4),
    dict(t='end', title='Wer kommt\n*heute* mit?', sub='Markier die Person, mit der du heute rausgehst.', size=110, dur=2.4),
  ],
  caption="""30 Minuten draußen. Jeden Tag. Auch wenn’s grau ist 🚶‍♀️🍂

Die WHO empfiehlt Erwachsenen mindestens 150 Minuten moderate Bewegung pro Woche. Das sind zum Beispiel 5 × 30 Minuten zügiges Gehen. Kein Fitnessstudio nötig.

So wird es zur Gewohnheit:
→ In der Mittagspause, mit Tageslicht
→ Mit Freundin, Partner oder Hörbuch
→ Eine Station früher aussteigen oder einen Umweg laufen

Wer kommt heute mit? Markier die Person 👇

Mehr Ideen für Bewegung im Alltag: wellanni.de (Link in Bio)

#Spazierengehen #BewegungImAlltag #GesundeGewohnheiten #Novemberblues #WellANNI""",
  alt='Reel: 30 Minuten draußen jeden Tag. WHO empfiehlt 150 Minuten Bewegung pro Woche. Tipps: Mittagspause, mit Freundin oder Hörbuch, Umweg nach Hause.',
  note='Musik: nur lizenzfrei. Ohne KI-Bild, kein KI-Label nötig.'),

# ───── Mi 4.11. 15:00 · Säule 3: Was war heute gut? ─────
dict(id='w2x-03_post_was-war-heute-gut', folder='03_Mi-04-11', fmt='post', day='Mi 4.11.', time='15:00', serie='Energie & Gelassenheit',
  title='Karussell: Was war heute gut? Ein Abendritual', link=BA,
  slides=[
    dict(t='photo', photo='abend.jpg', photo_h=0.62, kicker='Abendritual', title='Was war\n*heute gut?*', sub='Eine Frage, zwei Minuten. Jeden Abend.', size=86),
    dict(t='list', kicker='So geht’s', title='Jeden Abend\n*eine Zeile*', items=[
        ('Ein schöner Moment', 'Ein Gespräch, ein Sonnenstrahl, ein gutes Essen.'),
        ('Ein kleiner Erfolg', 'Treppe genommen, Gemüse gegessen, rausgegangen.'),
        ('Etwas, das du für dich getan hast', 'Auch eine Pause zählt.')]),
    dict(t='big', kicker='Warum aufschreiben?', big='In 6\nMonaten', bigsize=140, title='liest du deine eigene Geschichte. Und siehst, *wie viel sich verändert hat.*', size=66),
    dict(t='end', title='Was war\n*heute* gut?', size=110, sub='Schreib es in die Kommentare. Ich fang an: Mittags 20 Minuten Sonne. ☀️'),
  ],
  caption="""Was war heute gut? 🌙

Eine Frage, zwei Minuten, jeden Abend. Ein schöner Moment, ein kleiner Erfolg oder etwas, das du nur für dich getan hast.

Warum aufschreiben? Weil kleine Schritte leicht untergehen. Wenn du in einem halben Jahr zurückblätterst, liest du deine eigene Geschichte und siehst, wie viel sich verändert hat.

Notizbuch, Handy oder Zettel am Kühlschrank, egal. Hauptsache, du fängst heute an.

Was war heute gut bei dir? 👇

📌 Speichern als Erinnerung für heute Abend.

""" + TAGS_A,
  alt='4 Folien, Bild: gemütlicher Abend mit Tee und Buch. Was war heute gut? Jeden Abend eine Zeile: schöner Moment, kleiner Erfolg, etwas für dich. In 6 Monaten liest du deine eigene Geschichte.',
  note='Folie 1 zeigt ein KI-Bild: in der App „KI-Info hinzufügen“ einschalten.'),

# ───── Do 5.11. 15:00 · Säule 2: Pflanzenvielfalt ─────
dict(id='w2x-04_post_pflanzen-zaehlen', folder='04_Do-05-11', fmt='post', day='Do 5.11.', time='15:00', serie='Darm & Immunsystem',
  title='Karussell: Wie viele Pflanzen schaffst du diese Woche?', link=DA,
  slides=[
    dict(t='cover', kicker='Wochen-Challenge', title='Wie viele\n*Pflanzen*\nschaffst du\ndiese Woche?', sub='Ein kleines Spiel für ein gutes Bauchgefühl.', size=118),
    dict(t='list', kicker='Was zählt', title='Jede Pflanze\n*einmal*', items=[
        ('Gemüse und Obst', 'Karotte, Apfel, Rotkohl, Beeren …'),
        ('Hülsenfrüchte und Vollkorn', 'Linsen, Kichererbsen, Hafer, Buchweizen'),
        ('Nüsse, Saaten, Kräuter, Gewürze', 'Auch Zimt und Petersilie zählen mit!')]),
    dict(t='list', kicker='Einfache Tricks', title='So wird’s\n*bunter*', items=[
        ('Topping-Glas', 'Nüsse und Saaten gemischt, über alles drüber'),
        ('TK-Gemüse-Mix', 'Fünf Sorten in einer Packung'),
        ('Kräuter frisch oder TK', 'Jede Sorte zählt als eigene Pflanze')]),
    dict(t='end', title='Zählst du\n*mit?*', size=110, sub='Schreib am Sonntag deine Zahl in die Kommentare. Mehr zu Ballaststoffen und Vielfalt: Link in Bio.'),
  ],
  caption="""Wie viele verschiedene Pflanzen schaffst du diese Woche? 🥕🫘🌿

Ein kleines Spiel für ein gutes Bauchgefühl: Jede Pflanze zählt einmal. Gemüse, Obst, Hülsenfrüchte, Vollkorn, Nüsse, Saaten, Kräuter und Gewürze.

Einfache Tricks:
→ Ein Topping-Glas mit gemischten Nüssen und Saaten
→ TK-Gemüse-Mix mit vielen Sorten
→ Kräuter frisch oder tiefgekühlt

Dazu gehören auch genug Ballaststoffe: Die DGE empfiehlt Erwachsenen mindestens 30 g am Tag.

Zählst du mit? Schreib am Sonntag deine Zahl in die Kommentare 👇

#Darmgesundheit #Ballaststoffe #Pflanzenvielfalt #GesundeErnährung #WellANNI""",
  alt='4 Folien: Wochen-Challenge, wie viele Pflanzen schaffst du? Es zählen Gemüse, Obst, Hülsenfrüchte, Vollkorn, Nüsse, Saaten, Kräuter, Gewürze. Tricks: Topping-Glas, TK-Gemüse-Mix, Kräuter.',
  note=''),

# ───── Fr 6.11. 15:00 · Säule 4: Morgenbewegung (Reel) ─────
dict(id='w2x-05_reel_5-minuten-morgen', folder='05_Fr-06-11', fmt='reel', day='Fr 6.11.', time='15:00', serie='Bewegung im Alltag',
  title='Reel: 5 Minuten Bewegung am Morgen', link=BA,
  slides=[
    dict(t='big', kicker='Ohne Sportklamotten', big='5 Min.', bigsize=200, title='Bewegung am Morgen. *Noch bevor das Handy dran ist.*', size=80, dur=2.8),
    dict(t='list', kicker='Jeweils 1 Minute', title='Dein\n*Morgen-Start*', size=96, items=[
        ('Strecken', 'Arme hoch, Zehenspitzen'),
        ('Arme kreisen', 'Vorwärts und rückwärts'),
        ('Kniebeugen', 'Langsam, so tief es geht'),
        ('Hüfte kreisen', 'Locker in beide Richtungen'),
        ('Tief durchatmen', 'Am offenen Fenster')], dur=5.0),
    dict(t='end', title='Morgen\n*probierst* du’s?', sub='Speicher das Reel und leg dir morgen früh 5 Minuten hin.', size=110, dur=2.4),
  ],
  caption="""5 Minuten Bewegung am Morgen. Ohne Sportklamotten, noch bevor das Handy dran ist ☀️

Jeweils eine Minute:
1. Strecken: Arme hoch, auf die Zehenspitzen
2. Arme kreisen, vorwärts und rückwärts
3. Kniebeugen, langsam
4. Hüfte kreisen, locker in beide Richtungen
5. Am offenen Fenster tief durchatmen

Kein Programm, kein Druck. Einfach ein guter Start in den Tag.

📌 Speichern und morgen früh ausprobieren.

Bei Beschwerden oder Einschränkungen Bewegung bitte vorher ärztlich abklären.

#Morgenroutine #BewegungImAlltag #GesundeGewohnheiten #Selbstfürsorge #WellANNI""",
  alt='Reel: 5 Minuten Bewegung am Morgen: strecken, Arme kreisen, Kniebeugen, Hüfte kreisen, am Fenster tief durchatmen.',
  note='Musik: nur lizenzfrei. Ohne KI-Bild, kein KI-Label nötig.'),

# ───── Sa 7.11. 15:00 · Säule 3: Me-Time ─────
dict(id='w2x-06_post_me-time', folder='06_Sa-07-11', fmt='post', day='Sa 7.11.', time='15:00', serie='Energie & Gelassenheit',
  title='Karussell: 10 Minuten nur für dich – 6 Ideen', link=BA,
  slides=[
    dict(t='cover', kicker='Me-Time', title='10 Minuten\n*nur für dich.*', sub='6 Ideen für zwischendurch, ganz ohne Aufwand.'),
    dict(t='list', kicker='Ideen 1–3', title='Für\n*zwischendurch*', items=[
        ('Tee in Ruhe', 'Ohne Handy, nur du und die Tasse'),
        ('Zehn Seiten lesen', 'Nur zum Vergnügen'),
        ('Ein Lied ganz bewusst hören', 'Augen zu, nichts nebenbei')]),
    dict(t='list', kicker='Ideen 4–6', title='Und\n*auch schön*', items=[
        ('Kurz raus', 'Einmal um den Block, ohne Ziel'),
        ('Etwas mit den Händen', 'Kochen, malen, gärtnern'),
        ('Nichts tun', 'Aus dem Fenster schauen. Wirklich.')]),
    dict(t='end', title='Trag sie dir\n*heute* ein.', size=104, sub='Wie einen Termin im Kalender. Welche Idee nimmst du? 👇'),
  ],
  caption="""10 Minuten nur für dich. Heute, nicht irgendwann 🫖

6 Ideen ohne Aufwand:
1. Tee in Ruhe, ohne Handy
2. Zehn Seiten lesen, nur zum Vergnügen
3. Ein Lied ganz bewusst hören
4. Einmal um den Block, ohne Ziel
5. Etwas mit den Händen: kochen, malen, gärtnern
6. Nichts tun und aus dem Fenster schauen

Tipp: Trag die 10 Minuten in deinen Kalender ein, wie einen Termin.

Welche Idee nimmst du? 👇

📌 Speichern und an jemanden schicken, der gerade dringend eine Pause braucht.

""" + TAGS_A,
  alt='4 Folien: 10 Minuten nur für dich, 6 Ideen: Tee in Ruhe, zehn Seiten lesen, ein Lied bewusst hören, kurz raus, etwas mit den Händen, nichts tun.',
  note=''),

# ───── So 8.11. 15:00 · Leitgedanke: kleine Schritte ─────
dict(id='w2x-07_post_kleine-schritte', folder='07_So-08-11', fmt='post', day='So 8.11.', time='15:00', serie='Leitgedanke',
  title='Karussell: Eine Gewohnheit für diese Woche', link=W,
  slides=[
    dict(t='cover', kicker='Neue Woche', title='Eine\n*Gewohnheit.*\nNicht fünf.', sub='Was du diese Woche anfängst, siehst du vielleicht erst in einem halben Jahr.', size=120),
    dict(t='list', kicker='Such dir eine aus', title='Für diese\n*Woche*', items=[
        ('30 Minuten draußen', 'Jeden Tag, auch wenn’s grau ist'),
        ('Satt zu Abend essen', 'Und danach die Küche schließen'),
        ('Was war heute gut?', 'Jeden Abend eine Zeile'),
        ('Eine Pflanze mehr', 'In jede Mahlzeit')], size=84),
    dict(t='big', kicker='Mein Gedanke', big='6 Monate', bigsize=160, title='Was ich heute an meiner Routine ändere, kann mir in einem halben Jahr *eine ganz neue Sicht auf mich* geben.', size=62),
    dict(t='end', title='Welche nimmst\n*du* diese Woche?', size=96, sub='Schreib sie in die Kommentare, dann erinnere ich dich nächsten Sonntag. 💚'),
  ],
  caption="""Eine Gewohnheit. Nicht fünf. 🌱

Neue Woche, neuer Anfang. Aber bitte klein: Such dir EINE Sache aus, die du diese Woche ausprobierst.

→ 30 Minuten draußen, jeden Tag
→ Satt zu Abend essen und danach die Küche schließen
→ Jeden Abend aufschreiben, was gut war
→ Eine Pflanze mehr in jede Mahlzeit

Ich habe gelernt: Was ich heute an meiner Routine ändere, kann mir in einem halben Jahr ganz neue Chancen und eine neue Sicht auf mich geben. Nicht über Nacht, sondern Schritt für Schritt.

Welche Gewohnheit nimmst du diese Woche? Schreib sie in die Kommentare 👇

#KleineSchritte #GesundeGewohnheiten #Selbstfürsorge #GesundLeben #WellANNI""",
  alt='4 Folien: Eine Gewohnheit, nicht fünf. Auswahl: 30 Minuten draußen, satt zu Abend essen, was war heute gut, eine Pflanze mehr. Gedanke: In 6 Monaten eine neue Sicht auf mich.',
  note='Persönlicher Post (Gründerinnen-Stimme). Gern in die Story teilen.'),
]

# ───────────── Pinterest: täglich 09:00, neue Pinnwände ─────────────
B_DARM, B_AB, B_ACH = 'Darmgesundheit & Immunsystem', 'Gesund abnehmen ohne Hungern', 'Achtsamkeit, Bewegung & Me-Time'


def P(n, when, board, title, desc, link, slide, alt, ki):
    return dict(id=f'w2x-pin{n:02d}', folder='pins', fmt='pin', day=when, time='', serie=board, board=board,
                title=title, caption=desc, link=link, alt=alt, slides=[slide], note='KI-modifiziert markieren' if ki else '')


PINS = [
P(1, '2.11. 09:00', B_DARM, 'Darmfreundlich essen: so kommst du auf 30 g Ballaststoffe am Tag',
  'Die DGE empfiehlt mindestens 30 g Ballaststoffe am Tag, die meisten schaffen das nicht. Mit Hülsenfrüchten und Vollkorn geht es leichter, als du denkst. Zwei weitere einfache Wege und darmfreundliche Rezepte auf wellanni.de. Darmfreundliche Rezepte, Ballaststoffe, Darmgesundheit Ernährung.',
  U(DA, 'ballaststoffe'),
  dict(t='photo', photo='dal.jpg', photo_h=0.62, kicker='Darmfreundlich essen', title='So schaffst du\n*30 g Ballaststoffe*', sub='4 einfache Wege, ohne Pulver:', cta='wellanni.de', size=78),
  'Linsen-Dal in einer Schale in einer hellen Küche. Text: So schaffst du 30 g Ballaststoffe.', True),
P(2, '3.11. 09:00', B_AB, 'Abends nicht mehr ständig naschen: 4 Ideen, die wirklich helfen',
  'Heißhunger am Abend hat oft einfache Gründe: tagsüber zu wenig gegessen, müde oder ein langer Tag. Zwei Ideen siehst du hier, zwei weitere und das passende Abendessen findest du auf wellanni.de. Abends naschen stoppen, Heißhunger, gesund abnehmen ohne Hungern.',
  U(BA, 'naschen'),
  dict(t='list', kicker='Abends ständig naschen?', title='4 Ideen für\n*ruhige Abende*', items=[('Satt zu Abend essen', 'Eiweiß + Ballaststoffe'), ('Küche schließen', 'Tee, Zähne putzen, Licht aus')], more='2 weitere auf wellanni.de', size=92),
  'Textgrafik: Abends ständig naschen? 4 Ideen: satt zu Abend essen, Küche schließen, zwei weitere auf wellanni.de.', False),
P(3, '4.11. 09:00', B_ACH, '30 Minuten spazieren am Tag: so wird es zur Gewohnheit',
  'Die WHO empfiehlt Erwachsenen 150 Minuten Bewegung pro Woche, zum Beispiel 5 × 30 Minuten zügig gehen. Wie du den täglichen Spaziergang wirklich in den Alltag bekommst, auch im grauen November: auf wellanni.de. Spazieren gehen, Bewegung im Alltag, gesunde Gewohnheiten.',
  U(BA, 'spazieren'),
  dict(t='big', kicker='Bewegung im Alltag', big='30 Min.', bigsize=210, title='draußen, jeden Tag. *So wird’s zur Gewohnheit.*', size=72),
  'Textgrafik: 30 Minuten draußen, jeden Tag. So wird es zur Gewohnheit.', False),
P(4, '5.11. 09:00', B_DARM, 'Pflanzenvielfalt: Wie viele Pflanzen schaffst du diese Woche?',
  'Ein kleines Spiel für ein gutes Bauchgefühl: Jede Pflanze zählt einmal, auch Kräuter, Nüsse und Gewürze. Was alles zählt und einfache Tricks für mehr Vielfalt auf dem Teller: wellanni.de. Darmgesundheit, Pflanzenvielfalt, darmfreundliche Ernährung.',
  U(DA, 'vielfalt'),
  dict(t='list', kicker='Wochen-Challenge', title='Wie viele *Pflanzen*\nschaffst du?', items=[('Gemüse und Obst', 'jede Sorte einmal'), ('Kräuter und Gewürze', 'zählen auch mit')], more='Was noch zählt: wellanni.de', size=90),
  'Textgrafik: Wochen-Challenge, wie viele Pflanzen schaffst du? Gemüse und Obst, Kräuter und Gewürze zählen.', False),
P(5, '6.11. 09:00', B_AB, 'Gesund abnehmen ohne Hungern: satt werden mit Eiweiß und Ballaststoffen',
  'Abnehmen muss nicht Hungern heißen. Eiweiß und Ballaststoffe halten lange satt, zum Beispiel in einer Linsensuppe. Welche Lebensmittel besonders sättigen und Rezepte mit Nährwerten: wellanni.de. Gesund abnehmen, satt werden, eiweißreiche Rezepte.',
  U(W + 'echtes-essen.html', 'satt'),
  dict(t='photo', photo='suppe.jpg', photo_h=0.62, kicker='Gesund abnehmen', title='Satt werden\n*ohne Hungern*', sub='Was wirklich lange satt hält:', cta='wellanni.de', size=80),
  'Rote Linsensuppe mit Zitrone in einer hellen Küche. Text: Satt werden ohne Hungern.', True),
P(6, '7.11. 09:00', B_ACH, 'Me-Time: 10 Minuten nur für dich, Ideen für jeden Tag',
  'Zehn Minuten nur für dich, wie ein Termin im Kalender: Tee in Ruhe, ein paar Seiten lesen, kurz raus. Mehr Ideen für Achtsamkeit und Gelassenheit im Alltag: wellanni.de. Me-Time Ideen, Selbstfürsorge, Achtsamkeit im Alltag.',
  U(BA, 'metime'),
  dict(t='photo', photo='abend.jpg', photo_h=0.62, kicker='Me-Time', title='10 Minuten\n*nur für dich*', sub='Ideen für jeden Tag:', cta='wellanni.de', size=82),
  'Gemütliche Abendszene mit Tee, Buch und Decke. Text: 10 Minuten nur für dich.', True),
P(7, '8.11. 09:00', B_DARM, 'Erkältungszeit: 3 Nährstoffe vom Teller für dein Immunsystem',
  'Vitamin C, Zink und Vitamin D tragen zu einer normalen Funktion des Immunsystems bei.* In welchen Lebensmitteln sie stecken und was du in der grauen Jahreszeit sonst tun kannst: wellanni.de. Immunsystem stärken Ernährung, Erkältungszeit, Vitamin D Winter. *EU-zugelassene Angabe.',
  U(DA, 'immun'),
  dict(t='list', kicker='Erkältungszeit', title='3 Nährstoffe\n*vom Teller*', items=[('Vitamin C', 'Paprika, Brokkoli, Rosenkohl'), ('Zink', 'Haferflocken, Linsen, Kürbiskerne')], more='Nr. 3 und mehr auf wellanni.de', foot='Vitamin C und Zink tragen zu einer normalen Funktion des Immunsystems bei.\\* \\*EU-zugelassene Angabe.', size=92),
  'Textgrafik: Erkältungszeit, 3 Nährstoffe vom Teller: Vitamin C, Zink, Nummer 3 auf wellanni.de.', False),
]

POSTS = POSTS + PINS
