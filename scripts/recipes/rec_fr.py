from build import R
CH={}
R('buchweizen_porridge_apfel_zimt','Buchweizen-Porridge mit Apfel und Zimt','breakfast','porridge','hw',1,3,10,"""
50 g | Buchweizengrütze (oder -flocken) | buchweizengruetze
200 ml | Milch oder Haferdrink | milch
1 | kleiner Apfel, grob gerieben | apfel=120
½ TL | Zimt | gewuerz
1 TL | Ahornsirup | ahornsirup
1 EL | Walnüsse, gehackt | walnuesse
""",["Buchweizen mit Milch und einer Prise Zimt aufkochen und bei kleiner Hitze unter Rühren 7–8 Minuten quellen lassen, bis er cremig ist.",
"Die Hälfte des geriebenen Apfels unterrühren und 1 Minute mitziehen lassen.",
"In eine Schale füllen, mit dem übrigen Apfel, Walnüssen und Ahornsirup toppen."],
"Nussig-warmer Buchweizen mit saftigem Apfel und Zimt – glutenfrei und in zehn Minuten fertig.",
occ='fruehstueck,schnell',tip="Mit Haferdrink wird das Porridge vegan. Glutenfrei bleibt es nur mit zertifiziert glutenfreiem Buchweizen.",kid=True)
CH['buchweizen_porridge_apfel_zimt']='Pin-Rezept beibehalten; Walnüsse und etwas Ahornsirup ergänzt, Zubereitung präzisiert.'

R('kuerbis_porridge_pekannuss','Kürbis-Porridge mit Zimt und Pekannüssen','breakfast','porridge','h',2,10,10,"""
150 g | Hokkaido-Kürbis, fein gerieben | hokkaido
80 g | Haferflocken | haferflocken
400 ml | Milch | milch
1 TL | Zimt, dazu je 1 Prise Ingwer und Muskat | gewuerz
1 EL | Ahornsirup | ahornsirup
20 g | Pekannüsse | pekannuesse
2 EL | Naturjoghurt | joghurt
""",["Kürbis waschen (Hokkaido muss nicht geschält werden), entkernen und fein reiben.",
"Kürbis mit Milch und Gewürzen aufkochen und 3 Minuten köcheln lassen. Haferflocken einrühren und bei kleiner Hitze 5 Minuten quellen lassen, bis der Brei cremig ist.",
"Mit Ahornsirup süßen, in zwei Schalen füllen, je einen Klecks Joghurt daraufgeben und mit gehackten Pekannüssen bestreuen."],
"Schmeckt wie Kürbiskuchen zum Frühstück – samtig, goldorange und duftend nach Zimt.",
occ='fruehstueck,wochenende',tip="Den Rest vom Kürbis für Suppe oder Ofenkürbis verwenden. Geriebener Kürbis hält sich zwei Tage im Kühlschrank.",kid=True)
CH['kuerbis_porridge_pekannuss']='Neu (Kürbis-Saison).'

R('hafer_ananas_porridge','Porridge mit Ananas und Haselnüssen','breakfast','porridge','g',1,3,7,"""
50 g | Haferflocken | haferflocken
200 ml | Milch | milch
100 g | Ananas, frisch, gewürfelt | ananas
1 EL | Haselnüsse, gehackt | haselnuesse
1 EL | Kokosraspeln | kokosraspeln
""",["Haferflocken mit Milch aufkochen und bei kleiner Hitze 4–5 Minuten unter Rühren cremig köcheln.",
"Haselnüsse und Kokosraspeln ohne Fett in einer Pfanne 2 Minuten anrösten, bis sie duften.",
"Porridge in eine Schale füllen, Ananas darauf verteilen und mit Nüssen und Kokos bestreuen."],
"Ein bisschen Urlaub im Schälchen: saftige Ananas, geröstete Nüsse und Kokos.",
occ='fruehstueck,schnell',kid=True)
CH['hafer_ananas_porridge']='Mengen auf eine Portion angepasst, Nüsse werden angeröstet.'

R('hafer_schoko_porridge','Schoko-Porridge mit Banane und Haselnüssen','breakfast','porridge','g',1,3,7,"""
50 g | Haferflocken | haferflocken
220 ml | Milch | milch
1 TL | Kakaopulver (ungesüßt) | kakao
½ | Banane | banane
1 EL | Haselnüsse, gehackt | haselnuesse
10 g | Zartbitterschokolade, gehackt | zartbitter
""",["Haferflocken, Milch und Kakao verrühren, aufkochen und bei kleiner Hitze 4–5 Minuten cremig köcheln.",
"Die Hälfte der Banane zerdrücken und unterrühren – sie süßt das Porridge.",
"Mit den übrigen Bananenscheiben, Haselnüssen und Schokolade toppen."],
"Schokoladig, cremig und nur von der Banane gesüßt – für Tage, an denen es ein bisschen Seelenfutter braucht.",
occ='fruehstueck,schnell',kid=True)
CH['hafer_schoko_porridge']='Zusammengeführt mit Porridge mit dunkler Schokolade; Süße kommt jetzt aus der Banane.'

R('hirse_porridge_himbeeren_mandeln','Hirse-Porridge mit Himbeeren und Mandeln','breakfast','porridge','g',1,3,10,"""
40 g | Hirseflocken | hirseflocken
200 ml | Milch oder Mandeldrink | milch
100 g | Himbeeren (frisch oder TK) | himbeeren
1 EL | Mandeln, gehobelt | mandeln
1 TL | Honig | honig
""",["Hirseflocken mit Milch aufkochen und unter Rühren 3–5 Minuten quellen lassen.",
"Die Hälfte der Himbeeren unterrühren, bis sie leicht zerfallen und das Porridge rosa färben.",
"Mit den übrigen Himbeeren, Mandeln und Honig servieren."],
"Zartrosa, fruchtig und glutenfrei – Hirse wird herrlich cremig.",
occ='fruehstueck,schnell',kid=True,tip="Am Vorabend mit kalter Milch angerührt, wird daraus eine Overnight-Variante.")
CH['hirse_porridge_himbeeren_mandeln']='Als warmes Porridge oder Overnight-Variante; Mengen geprüft.'

R('milchreis_zimtpflaumen','Milchreis mit Zimt-Pflaumen','breakfast','porridge','h',4,10,35,"""
200 g | Milchreis (Rundkornreis) | milchreis
1 l | Milch | milch
1 Prise | Salz | salz=0.5
1 EL | Zucker | zucker
400 g | Zwetschgen oder Pflaumen | zwetschgen
1 TL | Zimt | gewuerz
1 EL | Honig | honig
""",["Milch mit Zucker und Salz aufkochen, Reis einrühren und zugedeckt bei kleinster Hitze 30–35 Minuten quellen lassen. Gelegentlich umrühren.",
"Zwetschgen halbieren und entsteinen, mit Honig, Zimt und 3 EL Wasser 5 Minuten weich dünsten.",
"Milchreis mit den warmen Zimt-Pflaumen servieren."],
"Wie früher bei Oma: cremiger Milchreis mit warmen Zimtpflaumen.",
occ='wochenende,familie,mealprep',tip="Milchreis hält sich drei Tage im Kühlschrank und schmeckt auch kalt. Außerhalb der Saison gehen TK-Kirschen.",kid=True)
CH['milchreis_zimtpflaumen']='Neu (Herbst-Klassiker).'

R('overnight_oats_pumpkin_spice','Pumpkin-Spice Overnight Oats','breakfast','bowl_suess','h',2,10,10,"""
150 g | Hokkaido-Kürbis | hokkaido
100 g | Haferflocken | haferflocken
250 ml | Milch | milch
150 g | Naturjoghurt | joghurt
1 EL | Chiasamen | chiasamen
1 EL | Ahornsirup | ahornsirup
1 TL | Zimt, je 1 Prise Ingwer, Muskat, Nelke | gewuerz
2 EL | Pekannüsse oder Walnüsse | pekannuesse
""",["Kürbis würfeln und mit 3 EL Wasser zugedeckt 8–10 Minuten weich dünsten, dann fein pürieren und abkühlen lassen.",
"Kürbispüree mit Haferflocken, Milch, Joghurt, Chiasamen, Ahornsirup und Gewürzen verrühren und auf zwei Gläser verteilen.",
"Über Nacht kühl stellen und morgens mit gehackten Nüssen bestreuen."],
"Herbst im Glas: Kürbis, Zimt und ein Hauch Nelke – das Lieblingsgetränk aus dem Café als Frühstück.",
occ='mealprep,mitnehmen,fruehstueck',tip="Gleich die doppelte Menge Kürbispüree kochen – es hält sich vier Tage im Kühlschrank.",wait=480)
CH['overnight_oats_pumpkin_spice']='Neu (Kürbis-Saison).'

R('overnight_oats_mango_kokos','Overnight Oats mit Mango und Kokos','breakfast','bowl_suess','g',2,10,0,"""
100 g | Haferflocken | haferflocken
200 ml | Milch | milch
150 g | Naturjoghurt | joghurt
1 EL | Chiasamen | chiasamen
1 | reife Mango | mango
2 EL | Kokosraspeln | kokosraspeln
1 | Limette (Schale und Saft) | limette=15
""",["Haferflocken, Milch, Joghurt, Chiasamen und die Hälfte der Kokosraspeln verrühren und auf zwei Gläser verteilen.",
"Mango schälen, würfeln und mit etwas Limettensaft und -schale mischen.",
"Oats über Nacht kühl stellen, morgens Mango daraufgeben und mit den übrigen Kokosraspeln bestreuen."],
"Sonnig, frisch und ein bisschen exotisch – Mango und Limette wecken auch Morgenmuffel.",
occ='mealprep,mitnehmen,fruehstueck',kid=True,wait=480)
CH['overnight_oats_mango_kokos']='Neu.'

R('bircher_muesli_apfel','Bircher-Müsli mit Apfel und Haselnüssen','breakfast','bowl_suess','g',2,10,0,"""
80 g | Haferflocken | haferflocken
150 ml | Milch | milch
150 g | Naturjoghurt | joghurt
2 | Äpfel | apfel
1 EL | Zitronensaft | zitronensaft
30 g | Haselnüsse, grob gehackt | haselnuesse
1 TL | Honig | honig
""",["Haferflocken mit Milch verrühren und mindestens 30 Minuten oder über Nacht quellen lassen.",
"Äpfel grob reiben und sofort mit Zitronensaft mischen. Mit Joghurt und Honig unter die Haferflocken rühren.",
"In Schalen füllen und mit Haselnüssen bestreuen."],
"Der Schweizer Klassiker: frisch geriebener Apfel, cremige Haferflocken und Haselnuss-Crunch.",
occ='fruehstueck,mealprep',kid=True,tip="Den Apfel erst morgens reiben, dann bleibt er frisch und saftig.",wait=30)
CH['bircher_muesli_apfel']='Neu.'

R('chia_pudding_mandelmilch_beeren','Chia-Pudding mit Mandeldrink und Beeren','breakfast','bowl_suess','g',1,5,0,"""
3 EL | Chiasamen | chiasamen
200 ml | Mandeldrink (ungesüßt) | mandeldrink
1 Prise | Vanille | gewuerz
100 g | Beeren | beeren
1 EL | Mandeln, gehobelt | mandeln
""",["Chiasamen mit Mandeldrink und Vanille verrühren, nach 5 Minuten noch einmal umrühren, damit nichts verklumpt.",
"Abgedeckt mindestens 2 Stunden oder über Nacht kühl stellen.",
"Mit Beeren und Mandeln servieren."],
"Leicht, cremig und kaum Kohlenhydrate – der Pudding, der über Nacht von selbst entsteht.",
occ='mealprep,fruehstueck',tip="Mit einem Teelöffel Ahornsirup wird er süßer. Hält sich drei Tage im Kühlschrank.",wait=120)
CH['chia_pudding_mandelmilch_beeren']='Mengen geprüft, Rühr-Tipp gegen Klümpchen ergänzt.'

R('kokos_chia_pudding_mandeln','Kokos-Chia-Pudding mit Mango','breakfast','bowl_suess','g',2,10,0,"""
5 EL | Chiasamen | chiasamen
200 ml | Kokosmilch | kokosmilch
200 ml | Milch oder Mandeldrink | milch
1 TL | Ahornsirup | ahornsirup
1 | Mango | mango
1 EL | Kokosraspeln | kokosraspeln
""",["Kokosmilch mit Milch und Ahornsirup verrühren, Chiasamen einrühren und nach 5 Minuten noch einmal umrühren.",
"Auf zwei Gläser verteilen und mindestens 3 Stunden oder über Nacht kühl stellen.",
"Mango würfeln oder pürieren, auf den Pudding geben und mit Kokosraspeln bestreuen."],
"Wie ein Dessert in Thailand: Kokos, Mango und eine Pudding-Konsistenz zum Reinlöffeln.",
occ='mealprep,fruehstueck',wait=180)
CH['kokos_chia_pudding_mandeln']='Mit dem Beeren-Chia-Pudding mit Kokosmilch zusammengeführt. Vorher reine Kokosmilch (641 kcal/Portion), jetzt halb Kokosmilch, halb Milch.'

R('skyr_walnuesse_zimt','Skyr mit Walnüssen und Zimt','breakfast','bowl_suess','g',1,3,0,"""
200 g | Skyr | skyr
20 g | Walnüsse | walnuesse
½ TL | Zimt | gewuerz
1 TL | Honig (nach Wunsch) | honig
""",["Skyr in eine Schale geben und glatt rühren.",
"Walnüsse grob hacken und darüberstreuen.",
"Mit Zimt bestäuben und nach Wunsch mit etwas Honig beträufeln."],
"Drei Zutaten, kein Kochen und richtig viel Eiweiß – cremig, nussig, zimtig.",
occ='fruehstueck,schnell,mitnehmen')
CH['skyr_walnuesse_zimt']='Pin-Rezept beibehalten (3 Zutaten + optional Honig).'

R('griechischer_joghurt_granatapfel_pistazien','Griechischer Joghurt mit Granatapfel und Pistazien','breakfast','bowl_suess','hw',1,5,0,"""
150 g | griechischer Joghurt (10 % Fett) | joghurt_griech
60 g | Granatapfelkerne | granatapfel
15 g | Pistazien, grob gehackt | pistazien
1 TL | Honig | honig
""",["Joghurt in eine Schale füllen und mit dem Löffel eine Mulde formen.",
"Granatapfelkerne und Pistazien darüber verteilen.",
"Mit einem Hauch Honig beträufeln."],
"Sieht aus wie im Café, dauert fünf Minuten: cremiger Joghurt, rubinrote Kerne, grüne Pistazien.",
occ='fruehstueck,schnell,gaeste')
CH['griechischer_joghurt_granatapfel_pistazien']='Pin-Rezept beibehalten; Joghurt von 200 auf 150 g reduziert (vorher 422 kcal).'

R('skyr_beeren_bowl_kuerbiskerne','Skyr-Bowl mit Beeren und Kürbiskernen','breakfast','bowl_suess','g',1,5,0,"""
200 g | Skyr | skyr
100 g | Beeren (frisch oder aufgetaut) | beeren
2 EL | Haferflocken | haferflocken
1 EL | Kürbiskerne | kuerbiskerne
1 TL | Honig | honig
""",["Skyr mit Honig glatt rühren und in eine Schale geben.",
"Beeren, Haferflocken und Kürbiskerne darauf verteilen.",
"Nach Wunsch die Kürbiskerne vorher kurz ohne Fett anrösten."],
"Beeren, Crunch und viel Eiweiß – hält lange vor und schmeckt nach Sommer.",
occ='fruehstueck,schnell,mitnehmen')
CH['skyr_beeren_bowl_kuerbiskerne']='Mit Skyr-Bowl mit Nüssen und Honig zusammengeführt.'

R('vanillequark_zwetschgen','Vanillequark mit Zwetschgenkompott','breakfast','bowl_suess','h',2,10,8,"""
250 g | Magerquark | magerquark
100 g | Naturjoghurt | joghurt
½ | Vanilleschote (oder 1 TL Vanilleextrakt) | gewuerz
300 g | Zwetschgen | zwetschgen
1 EL | Honig | honig
½ TL | Zimt | gewuerz
2 EL | Haferflocken, geröstet | haferflocken
""",["Zwetschgen entsteinen und vierteln. Mit Honig, Zimt und 2 EL Wasser 6–8 Minuten zu einem stückigen Kompott dünsten, abkühlen lassen.",
"Quark mit Joghurt und dem Mark der Vanilleschote cremig rühren.",
"Vanillequark in Schalen füllen, Kompott daraufgeben und mit gerösteten Haferflocken bestreuen."],
"Herbst wie aus Omas Garten: kühler Vanillequark und warmes Zwetschgenkompott.",
occ='fruehstueck,mealprep',kid=True,tip="Das Kompott hält sich fünf Tage im Kühlschrank und schmeckt auch zu Porridge.")
CH['vanillequark_zwetschgen']='Neu (Herbst).'

R('erdbeeren_joghurt_bowl','Joghurt-Bowl mit Erdbeeren, Haferflocken und Mandeln','breakfast','bowl_suess','fs',1,5,0,"""
200 g | Naturjoghurt | joghurt
150 g | Erdbeeren | erdbeeren
3 EL | Haferflocken | haferflocken
1 EL | Mandeln, gehobelt | mandeln
1 TL | Honig | honig
""",["Erdbeeren waschen, putzen und vierteln.",
"Joghurt in eine Schale geben und mit Haferflocken und Erdbeeren belegen.",
"Mit Mandeln bestreuen und mit Honig beträufeln."],
"Erdbeeren in Hochform: frisch, süß und mit knusprigen Mandeln.",
occ='fruehstueck,schnell',kid=True)
CH['erdbeeren_joghurt_bowl']='Aus drei sehr ähnlichen Joghurt-/Erdbeer-Bowls zusammengeführt (eine davon 586 kcal).'

R('quinoa_bowl_mango_kokosraspeln','Quinoa-Frühstücksbowl mit Mango und Kokos','breakfast','bowl_suess','g',2,5,15,"""
100 g | Quinoa | quinoa
250 ml | Milch oder Kokosdrink | milch
1 Prise | Zimt | gewuerz
1 | Mango | mango
150 g | Naturjoghurt | joghurt
2 EL | Kokosraspeln | kokosraspeln
1 TL | Ahornsirup | ahornsirup
""",["Quinoa in einem Sieb heiß abspülen (das nimmt die Bitterstoffe). Mit Milch und Zimt aufkochen und zugedeckt 15 Minuten quellen lassen.",
"Mango schälen und würfeln.",
"Quinoa warm oder kalt in Schalen füllen, Joghurt und Mango daraufgeben und mit Kokosraspeln und Ahornsirup toppen."],
"Mal was anderes als Haferflocken: körnige Quinoa, süße Mango und Kokos.",
occ='mealprep,fruehstueck',tip="Quinoa auf Vorrat kochen – sie hält sich drei Tage im Kühlschrank.")
CH['quinoa_bowl_mango_kokosraspeln']='Portionen korrigiert (vorher 1 Portion mit 656 kcal, jetzt 2). Abspülen der Quinoa ergänzt.'

R('fruehstuecks_couscous_trockenfruechte','Frühstücks-Couscous mit Orange, Datteln und Zimt','breakfast','bowl_suess','w',2,10,5,"""
100 g | Couscous | couscous
200 ml | Milch | milch
1 | Orange | orange
3 | Datteln | datteln
½ TL | Zimt | gewuerz
150 g | Naturjoghurt | joghurt
2 EL | Pistazien oder Mandeln | pistazien
""",["Milch mit Zimt aufkochen, über den Couscous gießen, abdecken und 5 Minuten quellen lassen.",
"Orange filetieren, den Saft dabei auffangen und unter den Couscous rühren. Datteln klein schneiden.",
"Couscous mit Orangenfilets, Datteln, Joghurt und gehackten Pistazien anrichten."],
"Duftet nach Orient: Orange, Datteln und Zimt auf fluffigem Couscous.",
occ='fruehstueck,schnell')
CH['fruehstuecks_couscous_trockenfruechte']='Überarbeitet: Orange statt Trockenfruchtmischung, Joghurt ergänzt.'

R('vollkorn_pancakes_beeren','Vollkorn-Pancakes mit Beeren','breakfast','pfannkuchen','g',2,10,15,"""
120 g | Dinkel- oder Weizenvollkornmehl | vk_mehl
1 TL | Backpulver | backpulver
1 Prise | Salz | salz=0.5
1 | Ei | ei
200 ml | Buttermilch oder Milch | buttermilch
1 EL | Zucker | zucker
1 EL | Rapsöl | rapsoel
200 g | Beeren | beeren
4 EL | Naturjoghurt | joghurt
""",["Mehl, Backpulver, Zucker und Salz mischen. Ei und Buttermilch verquirlen und kurz unterrühren, bis keine Mehlnester mehr da sind.",
"Teig 5 Minuten ruhen lassen. Eine Pfanne dünn mit Öl auspinseln und kleine Pancakes bei mittlerer Hitze backen, bis sich Bläschen bilden, dann wenden.",
"Mit Beeren und Joghurt servieren."],
"Fluffige Wochenend-Pancakes, die trotzdem lange satt machen.",
occ='wochenende,familie',kid=True)
CH['vollkorn_pancakes_beeren']='Buttermilch für fluffigeren Teig, Mengen geprüft.'

R('vollkorn_waffeln_quark_beeren','Vollkorn-Waffeln mit Quark und Beeren','breakfast','pfannkuchen','g',4,15,15,"""
200 g | Dinkelvollkornmehl | vk_mehl
2 | Eier | ei
250 ml | Milch | milch
40 g | Butter, geschmolzen | butter
1 TL | Backpulver | backpulver
1 EL | Zucker | zucker
250 g | Magerquark | magerquark
1 EL | Honig | honig
300 g | Beeren | beeren
""",["Mehl, Backpulver und Zucker mischen. Eier, Milch und geschmolzene Butter verquirlen und unterrühren.",
"Waffeleisen vorheizen und nacheinander 8 Waffeln goldbraun backen.",
"Quark mit Honig und 2 EL Milch glatt rühren. Waffeln mit Quark und Beeren servieren."],
"Sonntagsfrühstück für alle: knusprige Waffeln mit cremigem Quark und Beeren.",
occ='wochenende,familie,gaeste',kid=True)
CH['vollkorn_waffeln_quark_beeren']='Auf 4 Portionen (8 Waffeln) umgestellt.'

R('ricotta_brot_feigen','Vollkornbrot mit Ricotta, Feigen und Honig','breakfast','brot','h',2,5,0,"""
4 Scheiben | Vollkornbrot | vk_brot
125 g | Ricotta | ricotta
3 | frische Feigen | feige
2 TL | Honig | honig
2 EL | Walnüsse | walnuesse
1 Prise | Salz, etwas Thymian | salz=0.3
""",["Brot nach Wunsch toasten und mit Ricotta bestreichen.",
"Feigen in Spalten schneiden und darauflegen.",
"Mit Honig beträufeln, mit gehackten Walnüssen, einer Prise Salz und Thymian bestreuen."],
"Ein Frühstück wie in der Toskana: cremiger Ricotta, reife Feigen und Honig.",
occ='wochenende,gaeste')
CH['ricotta_brot_feigen']='Neu (Herbst).'

R('champignon_ruehrei','Champignon-Rührei auf Vollkornbrot','breakfast','ei','g',1,5,8,"""
2 | Eier | ei
100 g | Champignons | champignons
1 TL | Butter | butter
1 Scheiben | Vollkornbrot | vk_brot
1 EL | Schnittlauch | schnittlauch
| Salz, Pfeffer | salz=0.8
""",["Champignons in Scheiben schneiden und in der Butter bei starker Hitze 4 Minuten goldbraun braten.",
"Eier mit Salz und Pfeffer verquirlen, in die Pfanne geben und bei kleiner Hitze langsam stocken lassen, dabei mit dem Pfannenwender große Flocken ziehen.",
"Auf dem Brot anrichten und mit Schnittlauch bestreuen."],
"Goldbraun gebratene Pilze und saftiges, cremiges Rührei – ein Klassiker, richtig gemacht.",
occ='fruehstueck,schnell')
CH['champignon_ruehrei']='Garmethode präzisiert (Pilze scharf anbraten, Eier langsam stocken).'

R('champignon_spinat_omelett','Champignon-Spinat-Omelett mit Bergkäse','breakfast','ei','g',1,5,8,"""
3 | Eier | ei
80 g | Champignons | champignons
1 Handvoll | Babyspinat | spinat
20 g | Bergkäse, gerieben | bergkaese
1 TL | Rapsöl | rapsoel
| Salz, Pfeffer | salz=0.8
""",["Champignons in Scheiben schneiden und im Öl 3 Minuten anbraten, Spinat zugeben und zusammenfallen lassen.",
"Eier mit Salz und Pfeffer verquirlen, über das Gemüse gießen und bei mittlerer Hitze stocken lassen.",
"Käse darüberstreuen, das Omelett zusammenklappen und noch 1 Minute ziehen lassen."],
"Würziger Bergkäse, zarte Pilze und Spinat – ein Omelett, das lange satt macht.",
occ='fruehstueck,schnell')
CH['champignon_spinat_omelett']='Mit Spinat-Omelett mit Käse zusammengeführt.'

R('shakshuka','Shakshuka mit Paprika und Feta','breakfast','ei','g',2,10,20,"""
1 | Zwiebel | zwiebel
1 | rote Paprika | paprika
1 | Knoblauchzehe | knoblauch=4
1 Dose | stückige Tomaten (400 g) | tomaten_dose
1 TL | Kreuzkümmel und edelsüßes Paprikapulver | gewuerz
4 | Eier | ei
50 g | Feta | feta
1 EL | Olivenöl | olivenoel
2 Scheiben | Vollkornbrot zum Dippen | vk_brot
| Salz, Pfeffer, Petersilie | salz=1.5
""",["Zwiebel, Paprika und Knoblauch würfeln und im Öl in einer Pfanne 5 Minuten weich dünsten. Gewürze kurz mitrösten.",
"Tomaten zugeben, salzen und 8 Minuten sämig einköcheln lassen.",
"Vier Mulden formen, je ein Ei hineinschlagen und zugedeckt bei kleiner Hitze 5–7 Minuten stocken lassen, bis das Eiweiß fest und das Eigelb noch weich ist.",
"Mit zerbröseltem Feta und Petersilie bestreuen und direkt aus der Pfanne mit Brot servieren."],
"Eier, die in würziger Tomatensauce pochieren – das Frühstück für lange Sonntage.",
occ='wochenende,gaeste')
CH['shakshuka']='Neu.'

R('gebackene_eier_spinat_feta','Gebackene Eier mit Spinat und Feta','breakfast','ei','g',2,5,15,"""
200 g | Babyspinat | spinat
1 | Knoblauchzehe | knoblauch=4
4 | Eier | ei
60 g | Feta | feta
1 TL | Olivenöl | olivenoel
| Salz, Pfeffer, Chiliflocken | salz=1
""",["Backofen auf 200 °C vorheizen. Spinat mit Knoblauch im Öl zusammenfallen lassen, salzen und in zwei kleine ofenfeste Formen verteilen.",
"Je zwei Mulden formen, die Eier hineinschlagen und Feta darüberbröseln.",
"10–12 Minuten backen, bis das Eiweiß gestockt ist. Mit Pfeffer und Chiliflocken servieren."],
"Cremige Eier auf würzigem Spinat, darüber salziger Feta – fast ohne Kohlenhydrate.",
occ='fruehstueck,wochenende')
CH['gebackene_eier_spinat_feta']='Mengen und Backzeit geprüft.'

R('ruehrei_tomaten_schnittlauch','Rührei mit Tomaten und Schnittlauch','breakfast','ei','g',1,5,5,"""
2 | Eier | ei
1 | Tomate | tomate
1 TL | Butter | butter
1 EL | Schnittlauch | schnittlauch
1 Scheiben | Vollkornbrot | vk_brot
| Salz, Pfeffer | salz=0.8
""",["Tomate würfeln. Eier mit Salz und Pfeffer verquirlen.",
"Butter in einer Pfanne schmelzen, Eier hineingeben und bei kleiner Hitze langsam stocken lassen. Kurz vor Schluss die Tomaten unterheben.",
"Mit reichlich Schnittlauch bestreuen und mit Brot servieren."],
"Saftiges Rührei mit frischen Tomaten – schnell, einfach und immer gut.",
occ='fruehstueck,schnell',kid=True)
CH['ruehrei_tomaten_schnittlauch']='Ersetzt 15 Vorlage-Varianten „Rührei mit Gemüse“.'

R('feta_ruehrei_kirschtomaten','Feta-Rührei mit Kirschtomaten','breakfast','ei','g',2,5,7,"""
4 | Eier | ei
60 g | Feta | feta
200 g | Kirschtomaten | kirschtomaten=200
1 TL | Olivenöl | olivenoel
| Pfeffer, Oregano | pfeffer
""",["Kirschtomaten halbieren und im Öl 2 Minuten anbraten.",
"Eier verquirlen (Feta ist salzig, daher kein Salz), in die Pfanne geben und bei kleiner Hitze stocken lassen.",
"Feta darüberbröseln, mit Pfeffer und Oregano würzen und sofort servieren."],
"Mediterranes Rührei: warme Tomaten und cremiger Feta – ganz ohne Brot ein Genuss.",
occ='fruehstueck,schnell')
CH['feta_ruehrei_kirschtomaten']='Aus „Rührei mit Feta und Tomaten“ (1 Portion, 735 kcal mit 150 g Feta) neu bemessen: 2 Portionen, 60 g Feta.'

R('huettenkaese_toast_radieschen_kresse','Hüttenkäse-Toast mit Radieschen und Kresse','breakfast','brot','fs',1,5,2,"""
2 Scheiben | Vollkornbrot | vk_brot
150 g | Hüttenkäse | huettenkaese
6 | Radieschen | radieschen
½ Beet | Kresse | kresse
| Salz, Pfeffer | salz=0.5
""",["Brot toasten und mit Hüttenkäse bestreichen.",
"Radieschen in feine Scheiben schneiden und darauf verteilen.",
"Mit Kresse, Salz und Pfeffer bestreuen."],
"Knackige Radieschen und frische Kresse – ein Frühlingsfrühstück mit viel Eiweiß.",
occ='fruehstueck,schnell')
CH['huettenkaese_toast_radieschen_kresse']='Unverändert, Mengen geprüft.'

R('tofu_ruehrei_spinat','Tofu-Rührei mit Spinat und Tomaten','breakfast','ei','g',2,5,8,"""
200 g | Naturtofu | tofu
1 | Tomate | tomate
50 g | Babyspinat | spinat
½ TL | Kurkuma und 1 Prise Kala Namak (Schwarzsalz) | gewuerz
1 EL | Olivenöl | olivenoel
2 Scheiben | Vollkornbrot | vk_brot
| Salz, Pfeffer | salz=1
""",["Tofu mit einer Gabel grob zerdrücken. Tomate würfeln.",
"Öl erhitzen, Tofu mit Kurkuma 4 Minuten anbraten, bis er leicht goldig ist. Tomate und Spinat zugeben und zusammenfallen lassen.",
"Mit Kala Namak (gibt den Ei-Geschmack), Salz und Pfeffer würzen und mit Brot servieren."],
"Sieht aus wie Rührei, schmeckt herzhaft-würzig – und ist rein pflanzlich.",
occ='fruehstueck,schnell')
CH['tofu_ruehrei_spinat']='Neu (vegan).'

R('fruehstuecks_wrap_ei_feta','Frühstücks-Wrap mit Ei, Spinat und Feta','breakfast','brot','g',2,5,5,"""
2 | Vollkornwraps | tortilla
3 | Eier | ei
50 g | Babyspinat | spinat
40 g | Feta | feta
½ | rote Paprika | paprika
1 TL | Olivenöl | olivenoel
| Pfeffer | pfeffer
""",["Paprika fein würfeln. Eier verquirlen.",
"Öl erhitzen, Paprika 1 Minute anbraten, Spinat und Eier zugeben und zu Rührei stocken lassen. Feta darüberbröseln.",
"Wraps kurz in der trockenen Pfanne erwärmen, füllen, fest aufrollen und halbieren."],
"Frühstück zum Mitnehmen: warm gefüllt, fest gerollt und richtig herzhaft.",
occ='mitnehmen,schnell')
CH['fruehstuecks_wrap_ei_feta']='Neu.'

R('herzhafte_haferflocken_spiegelei','Herzhafte Haferflocken mit Spiegelei und Spinat','breakfast','porridge','g',1,3,8,"""
50 g | zarte Haferflocken | haferflocken
200 ml | Gemüsebrühe | gemuesebruehe
1 Handvoll | Babyspinat | spinat
1 | Ei | ei
1 TL | Olivenöl | olivenoel
10 g | Parmesan | parmesan
| Pfeffer, Chiliflocken | pfeffer
""",["Haferflocken mit Brühe aufkochen und 4 Minuten cremig köcheln. Spinat unterrühren.",
"Währenddessen das Ei im Öl als Spiegelei braten.",
"Haferflocken in eine Schale geben, Spiegelei darauflegen und mit Parmesan, Pfeffer und Chiliflocken bestreuen."],
"Haferflocken mal herzhaft – wie ein Risotto zum Frühstück, mit flüssigem Eigelb.",
occ='fruehstueck,schnell')
CH['herzhafte_haferflocken_spiegelei']='Neu.'

R('raeucherlachs_fruehstuecksteller_vollkorn','Räucherlachs-Brot mit Frischkäse und Gurke','breakfast','brot','g',1,5,0,"""
2 Scheiben | Vollkornbrot | vk_brot
30 g | Frischkäse | frischkaese
60 g | Räucherlachs | raeucherlachs
¼ | Salatgurke | gurke=80
1 TL | Meerrettich (nach Wunsch) | meerrettich
| Dill, Pfeffer, Zitrone | zitronensaft=3
""",["Frischkäse nach Wunsch mit Meerrettich verrühren und auf das Brot streichen.",
"Gurke in feine Scheiben hobeln und darauflegen.",
"Räucherlachs darauf verteilen, mit Dill, Pfeffer und ein paar Tropfen Zitrone vollenden."],
"Feiner Räucherlachs, frischer Dill und knackige Gurke – Sonntagsbrunch an jedem Tag.",
occ='fruehstueck,schnell,gaeste')
CH['raeucherlachs_fruehstuecksteller_vollkorn']='Zusammengeführt mit dem Forellen-Frischkäse-Brötchen.'

R('raeucherlachs_frischkaese_roellchen','Räucherlachs-Frischkäse-Röllchen mit Gurke','breakfast','brot','g',1,5,9,"""
80 g | Räucherlachs (4 Scheiben) | raeucherlachs
40 g | Frischkäse | frischkaese
¼ | Salatgurke | gurke=100
1 | Ei, hart gekocht | ei
1 TL | Dill, gehackt | dill
| Pfeffer, Zitrone | zitronensaft=3
""",["Frischkäse mit Dill und Pfeffer verrühren. Ei 9 Minuten hart kochen, abschrecken und vierteln.",
"Lachsscheiben auslegen, dünn mit Frischkäse bestreichen und je einen Gurkenstift darauflegen.",
"Aufrollen, halbieren, mit Zitrone beträufeln und mit dem Ei servieren."],
"Kleine Röllchen mit großer Wirkung – frisch, salzig und fast ohne Kohlenhydrate.",
occ='fruehstueck,gaeste,schnell')
CH['raeucherlachs_frischkaese_roellchen']='Mengen geprüft.'

R('makrele_brot_meerrettich','Makrelen-Brot mit Meerrettich und Radieschen','breakfast','brot','hw',1,5,0,"""
2 Scheiben | Roggenvollkornbrot | vk_brot
50 g | geräucherte Makrele | makrele_ger
2 EL | Naturjoghurt | joghurt
1 TL | Meerrettich | meerrettich
4 | Radieschen | radieschen
| Schnittlauch, Pfeffer | schnittlauch=2
""",["Joghurt mit Meerrettich verrühren und auf das Brot streichen.",
"Makrele zerzupfen, dabei Gräten entfernen, und darauf verteilen.",
"Mit Radieschenscheiben und Schnittlauch belegen und pfeffern."],
"Norddeutsch und kräftig: rauchige Makrele, scharfer Meerrettich, frische Radieschen.",
occ='fruehstueck,schnell')
CH['makrele_brot_meerrettich']='Makrelenmenge von 100 auf 50 g pro Portion angepasst; Joghurt statt Butter.'

R('ruehrei_raeucherlachs','Rührei mit Räucherlachs und Schnittlauch','breakfast','ei','g',1,5,5,"""
2 | Eier | ei
40 g | Räucherlachs | raeucherlachs
1 TL | Butter | butter
1 EL | Schnittlauch | schnittlauch
1 Scheiben | Vollkornbrot | vk_brot
| Pfeffer | pfeffer
""",["Eier verquirlen und pfeffern (der Lachs bringt genug Salz mit).",
"Butter schmelzen und die Eier bei kleiner Hitze langsam zu cremigem Rührei stocken lassen.",
"Vom Herd nehmen, Lachs in Streifen unterheben und mit Schnittlauch auf dem Brot servieren."],
"Cremiges Rührei mit zartem Räucherlachs – Luxus für zehn Minuten.",
occ='fruehstueck,schnell,wochenende')
CH['ruehrei_raeucherlachs']='Ersetzt 26 Vorlage-Varianten „Rührei mit Fisch/Fleisch“.'

R('putenaufschnitt_vollkorntoast_avocado','Vollkorntoast mit Putenbrust und Avocado','breakfast','brot','g',1,5,2,"""
2 Scheiben | Vollkorntoast | vk_toast
½ | Avocado | avocado
40 g | Putenbrust-Aufschnitt | putenaufschnitt
1 | Tomate | tomate
| Zitronensaft, Salz, Pfeffer | zitronensaft=3
""",["Toast rösten. Avocado mit Zitronensaft, Salz und Pfeffer zerdrücken.",
"Avocado auf den Toast streichen.",
"Mit Putenbrust und Tomatenscheiben belegen."],
"Cremig, herzhaft und frisch – der schnelle Toast für volle Tage.",
occ='fruehstueck,schnell,mitnehmen')
CH['putenaufschnitt_vollkorntoast_avocado']='Tomate ergänzt, Mengen geprüft.'

R('bauernfruehstueck','Bauernfrühstück mit Schnittlauch','breakfast','ei','hw',2,10,15,"""
400 g | gekochte Pellkartoffeln (vom Vortag) | kartoffel
1 | Zwiebel | zwiebel
40 g | Schinkenwürfel oder Speck | speck
4 | Eier | ei
1 EL | Rapsöl | rapsoel
2 EL | Schnittlauch | schnittlauch
2 | Gewürzgurken | gewuerzgurke
| Salz, Pfeffer | salz=1.5
""",["Kartoffeln pellen und in Scheiben schneiden, Zwiebel würfeln.",
"Öl erhitzen und die Kartoffeln mit dem Speck 8–10 Minuten goldbraun braten. Zwiebel in den letzten 3 Minuten zugeben.",
"Eier mit Salz, Pfeffer und der Hälfte des Schnittlauchs verquirlen, darübergießen und bei kleiner Hitze stocken lassen.",
"Mit übrigem Schnittlauch bestreuen und mit Gewürzgurken servieren."],
"Bratkartoffeln, Ei und Speck in einer Pfanne – das herzhafte Wochenendfrühstück.",
occ='wochenende,familie,resteessen',kid=True)
CH['bauernfruehstueck']='Ersetzt die Speck-Kartoffel-Frühstückspfanne.'

R('speck_ei_muffins','Speck-Ei-Muffins aus dem Ofen','breakfast','ei','g',3,10,20,"""
6 Scheiben | Frühstücksspeck | speck
6 | Eier | ei
50 g | Babyspinat | spinat
6 | Kirschtomaten | kirschtomaten
30 g | Bergkäse, gerieben | bergkaese
| Pfeffer | pfeffer
""",["Backofen auf 180 °C vorheizen. Sechs Mulden einer Muffinform mit je einer Speckscheibe auslegen.",
"Spinat hacken und auf die Mulden verteilen, je ein Ei hineinschlagen und eine halbierte Kirschtomate dazulegen.",
"Mit Käse und Pfeffer bestreuen und 15–18 Minuten backen, bis das Eiweiß gestockt ist."],
"Knuspriger Speck, saftiges Ei – Frühstück zum Mitnehmen, ganz ohne Brot.",
occ='mealprep,mitnehmen,wochenende')
CH['speck_ei_muffins']='Gemüse ergänzt, Mengen geprüft.'

R('avocado_speck_schuessel_spiegelei','Spiegelei mit Speck und Avocado','breakfast','ei','g',1,3,7,"""
2 Scheiben | Frühstücksspeck | speck
2 | Eier | ei
½ | Avocado | avocado
1 Handvoll | Rucola | rucola
| Salz, Pfeffer, Chiliflocken | salz=0.3
""",["Speck in einer Pfanne ohne Fett knusprig braten und herausnehmen.",
"Im Speckfett die Eier als Spiegeleier braten.",
"Rucola auf einen Teller geben, Avocado in Scheiben daneben legen, Eier und Speck darauf anrichten und würzen."],
"Knusprig, cremig und würzig – ein Low-Carb-Frühstück, das nach mehr schmeckt.",
occ='fruehstueck,schnell')
CH['avocado_speck_schuessel_spiegelei']='Rucola ergänzt, Titel vereinfacht.'

R('fruehstuecks_omelett_champignons_schinken','Omelett mit Champignons und Schinken','breakfast','ei','g',1,5,8,"""
3 | Eier | ei
80 g | Champignons | champignons
40 g | Kochschinken | kochschinken
1 TL | Butter | butter
1 EL | Petersilie | petersilie
| Pfeffer | pfeffer
""",["Champignons in Scheiben, Schinken in Streifen schneiden und in Butter 3 Minuten anbraten.",
"Eier verquirlen und pfeffern, über Pilze und Schinken gießen und bei mittlerer Hitze stocken lassen.",
"Omelett zusammenklappen und mit Petersilie bestreuen."],
"Der Bistro-Klassiker: zartes Omelett mit Pilzen und Schinken.",
occ='fruehstueck,schnell')
CH['fruehstuecks_omelett_champignons_schinken']='Mit dem Keto-Omelett zusammengeführt.'

R('fruehstuecks_kaeseplatte_salami_oliven','Herzhafte Frühstücksplatte mit Käse, Salami und Oliven','breakfast','brot','g',2,10,0,"""
60 g | Bergkäse | bergkaese
40 g | Salami | salami
10 | Oliven | oliven_gruen
2 | Eier, hart gekocht | ei
1 | Paprika | paprika
½ | Salatgurke | gurke=200
""",["Eier 9 Minuten hart kochen, abschrecken und halbieren.",
"Käse in Würfel schneiden, Paprika und Gurke in Streifen.",
"Alles mit Salami und Oliven auf einer Platte anrichten."],
"Zum Teilen und Picken: Käse, Salami, Oliven und viel knackiges Gemüse.",
occ='wochenende,gaeste')
CH['fruehstuecks_kaeseplatte_salami_oliven']='Auf 2 Personen ausgelegt, Gemüse und Eier ergänzt, Käse reduziert.'

R('haehnchen_gemuese_omelett_roellchen','Omelett-Röllchen mit Hähnchen und Gemüse','breakfast','ei','g',2,10,10,"""
4 | Eier | ei
100 g | Hähnchenbrust, gegart (vom Vortag) | haehnchenbrust
½ | rote Paprika | paprika
1 Handvoll | Babyspinat | spinat
30 g | Frischkäse | frischkaese
1 TL | Rapsöl | rapsoel
| Salz, Pfeffer | salz=0.8
""",["Eier mit Salz und Pfeffer verquirlen. In einer großen Pfanne mit wenig Öl zwei dünne Omeletts backen.",
"Omeletts dünn mit Frischkäse bestreichen, mit Spinat, Paprikastreifen und zerzupftem Hähnchen belegen.",
"Fest aufrollen und schräg in Stücke schneiden."],
"Bunte Röllchen voller Eiweiß – super zum Mitnehmen und für Reste vom Vortag.",
occ='mitnehmen,mealprep,resteessen')
CH['haehnchen_gemuese_omelett_roellchen']='Rohes Hähnchen durch gegartes ersetzt (vorher nicht angegeben), Frischkäse als Kleber.'

R('thunfisch_avocado_fruehstuecksschale_limette','Thunfisch-Avocado-Schale mit Limette','breakfast','bowl_herzhaft','g',1,5,0,"""
1 Dose | Thunfisch im eigenen Saft (130 g abgetropft) | thunfisch=100
½ | Avocado | avocado
1 | Tomate | tomate
1 | Ei, hart gekocht | ei
½ | Limette (Saft) | limette=15
| Salz, Pfeffer, Koriander | salz=0.5
""",["Thunfisch abtropfen lassen und mit einer Gabel zerpflücken.",
"Avocado und Tomate würfeln, Ei vierteln.",
"Alles in einer Schale anrichten, mit Limettensaft beträufeln und würzen."],
"Frisch, zitronig und voller Eiweiß – ganz ohne Kochen.",
occ='fruehstueck,schnell,mitnehmen')
CH['thunfisch_avocado_fruehstuecksschale_limette']='Mit der Thunfisch-Ei-Schale zusammengeführt.'
