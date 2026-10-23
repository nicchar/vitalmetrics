from build import R
CH={}
S='| Salz, Pfeffer | salz=%s'
R('karotten_ingwer_suppe','Karotten-Ingwer-Suppe mit Orange','lunch','suppe','hw',4,10,25,"""
800 g | Karotten | karotte
1 | Zwiebel | zwiebel
3 cm | frischer Ingwer | ingwer
1 EL | Rapsöl | rapsoel
800 ml | Gemüsebrühe | gemuesebruehe
1 | Orange (Saft und etwas Schale) | orange=150
200 g | Naturjoghurt | joghurt
4 EL | Kürbiskerne, geröstet | kuerbiskerne
4 Scheiben | Vollkornbrot | vk_brot
"""+S%4,["Karotten schälen und in Scheiben schneiden, Zwiebel und Ingwer fein würfeln.",
"Öl erhitzen, Zwiebel und Ingwer 2 Minuten anschwitzen. Karotten zugeben, kurz mitdünsten und mit Brühe ablöschen.",
"Zugedeckt 20 Minuten köcheln lassen, bis die Karotten weich sind. Orangensaft und etwas abgeriebene Schale zugeben und fein pürieren.",
"Mit Salz und Pfeffer abschmecken, mit einem Klecks Joghurt und gerösteten Kürbiskernen servieren und Vollkornbrot dazu reichen."],
"Sechs Zutaten, ein Topf, ein Pürierstab: Ingwer und Orange machen die Karottensuppe frisch und würzig.",
occ='mealprep,familie',kid=True,tip="Lässt sich portionsweise einfrieren. Mit gerösteten Kürbiskernen wird sie knusprig.")
CH['karotten_ingwer_suppe']='Pin-Rezept beibehalten, jetzt mit Orange (wie im Pin beschrieben), Joghurt und Brot als vollständige Mahlzeit.'

R('linsensuppe_zitrone','Rote Linsensuppe mit Zitrone','lunch','suppe','g',4,10,25,"""
250 g | rote Linsen | linsen_rot
1 | Zwiebel | zwiebel
2 | Karotten | karotte
2 | Knoblauchzehen | knoblauch=8
1 EL | Olivenöl | olivenoel
1 TL | Kreuzkümmel, ½ TL Paprikapulver | gewuerz
1 EL | Tomatenmark | tomatenmark
1,2 l | Gemüsebrühe | gemuesebruehe=1200
1 | Zitrone (Saft) | zitrone
2 EL | Petersilie | petersilie
4 Scheiben | Fladenbrot oder Vollkornbrot | vk_brot
"""+S%4,["Zwiebel, Karotten und Knoblauch würfeln, Linsen in einem Sieb abspülen.",
"Öl erhitzen, Gemüse 3 Minuten anschwitzen, Gewürze und Tomatenmark 1 Minute mitrösten.",
"Linsen und Brühe zugeben und 20 Minuten köcheln lassen, bis die Linsen zerfallen. Grob pürieren.",
"Mit Zitronensaft, Salz und Pfeffer abschmecken, mit Petersilie bestreuen und mit Brot servieren."],
"Türkisch inspiriert: samtige Linsen, Kreuzkümmel und ein kräftiger Spritzer Zitrone.",
occ='mealprep,familie',kid=True)
CH['linsensuppe_zitrone']='Gewürze und Tomatenmark ergänzt, Brot dazu; Mengen auf 4 Portionen geprüft.'

R('kuerbissuppe_ingwer_kokos','Hokkaido-Kürbissuppe mit Ingwer und Kokos','lunch','suppe','h',4,10,25,"""
1 kg | Hokkaido-Kürbis | hokkaido
1 | Zwiebel | zwiebel
1 | Kartoffel | kartoffel=150
3 cm | Ingwer | ingwer
1 EL | Rapsöl | rapsoel
700 ml | Gemüsebrühe | gemuesebruehe
200 ml | Kokosmilch | kokosmilch
1 | Limette (Saft) | limette
3 EL | Kürbiskerne | kuerbiskerne
4 Scheiben | Vollkornbrot | vk_brot
"""+S%4,["Kürbis waschen, entkernen und mit Schale würfeln. Zwiebel, Kartoffel und Ingwer klein schneiden.",
"Öl erhitzen, Zwiebel und Ingwer 2 Minuten anschwitzen. Kürbis und Kartoffel zugeben und mit Brühe auffüllen.",
"Zugedeckt 20 Minuten köcheln lassen, bis alles weich ist. Kokosmilch zugeben (2 EL zum Garnieren aufheben) und fein pürieren.",
"Mit Limettensaft, Salz und Pfeffer abschmecken. Kürbiskerne ohne Fett rösten und mit der restlichen Kokosmilch über die Suppe geben."],
"Samtig, leuchtend orange und mit einem Hauch Ingwer – der Herbst in einer Schale.",
occ='mealprep,familie,gaeste',kid=True,tip="Die Kartoffel macht die Suppe cremig ohne Sahne. Friert sich hervorragend ein.")
CH['kuerbissuppe_ingwer_kokos']='Neu (Kürbis-Saison).'

R('kartoffelsuppe_lauch_majoran','Kartoffelsuppe mit Lauch und Majoran','lunch','suppe','hw',4,15,25,"""
800 g | mehligkochende Kartoffeln | kartoffel
1 Stange | Lauch | lauch
2 | Karotten | karotte
100 g | Knollensellerie | knollensellerie
1 EL | Butter | butter
1 l | Gemüsebrühe | gemuesebruehe=1000
100 ml | Sahne | sahne
1 TL | Majoran, getrocknet | gewuerz
40 g | Bergkäse, gerieben | bergkaese
4 EL | Kürbiskerne | kuerbiskerne
2 EL | Petersilie | petersilie
"""+S%4,["Kartoffeln, Karotten und Sellerie schälen und würfeln. Lauch in Ringe schneiden und gründlich waschen.",
"Butter schmelzen, Lauch 3 Minuten andünsten, übriges Gemüse zugeben und mit Brühe auffüllen.",
"20 Minuten köcheln lassen. Ein Drittel der Suppe pürieren und zurückgeben – so wird sie sämig und bleibt stückig.",
"Sahne und Majoran einrühren, abschmecken und mit Bergkäse, gerösteten Kürbiskernen und Petersilie servieren. Wer mag, erwärmt Wiener Würstchen in Scheiben darin."],
"Wie bei Oma: sämige Kartoffelsuppe mit Lauch und dem typischen Majoran-Duft.",
occ='familie,mealprep',kid=True)
CH['kartoffelsuppe_lauch_majoran']='Neu (Klassiker). Würstchen optional; Nährwerte mit Kürbiskernen gerechnet.'

R('brokkolisuppe_mandeln','Brokkolisuppe mit gerösteten Mandeln','lunch','suppe','g',4,10,20,"""
800 g | Brokkoli | brokkoli
1 | Zwiebel | zwiebel
1 | Kartoffel | kartoffel=150
1 EL | Olivenöl | olivenoel
900 ml | Gemüsebrühe | gemuesebruehe
150 g | Frischkäse | frischkaese
40 g | Mandeln, gehobelt | mandeln
1 Prise | Muskat | gewuerz
4 Scheiben | Vollkornbrot | vk_brot
"""+S%4,["Brokkoli in Röschen teilen, den Strunk schälen und würfeln. Zwiebel und Kartoffel klein schneiden.",
"Öl erhitzen, Zwiebel anschwitzen, Kartoffel, Brokkolistrunk und Brühe zugeben und 10 Minuten köcheln. Röschen zugeben und weitere 6–8 Minuten garen.",
"Frischkäse zugeben, fein pürieren und mit Muskat, Salz und Pfeffer abschmecken.",
"Mandeln ohne Fett goldbraun rösten und über die Suppe streuen. Mit Brot servieren."],
"Leuchtend grün und cremig – die gerösteten Mandeln geben den nussigen Crunch.",
occ='mealprep,schnell',kid=True,tip="Der Strunk ist das Beste: geschält und gewürfelt kommt er einfach mit in den Topf.")
CH['brokkolisuppe_mandeln']='Neu.'

R('minestrone_bohnen','Minestrone mit weißen Bohnen','lunch','suppe','g',4,15,30,"""
1 | Zwiebel | zwiebel
2 | Karotten | karotte
2 Stangen | Staudensellerie | sellerie
1 | Zucchini | zucchini
2 | Knoblauchzehen | knoblauch=8
2 EL | Olivenöl | olivenoel
1 Dose | stückige Tomaten (400 g) | tomaten_dose
1 l | Gemüsebrühe | gemuesebruehe=1000
1 Dose | weiße Bohnen (240 g abgetropft) | weisse_bohnen
80 g | kleine Suppennudeln | nudeln
100 g | Wirsing oder Spinat | wirsing
40 g | Parmesan | parmesan
1 Handvoll | Basilikum | basilikum
"""+S%4,["Zwiebel, Karotten, Sellerie, Zucchini und Knoblauch würfeln, Wirsing in Streifen schneiden.",
"Öl erhitzen und Zwiebel, Karotten und Sellerie 5 Minuten anschwitzen. Zucchini und Knoblauch kurz mitbraten.",
"Tomaten und Brühe zugeben und 15 Minuten köcheln. Nudeln, Bohnen und Wirsing zugeben und weitere 8–10 Minuten garen.",
"Abschmecken und mit Parmesan und Basilikum servieren."],
"Italienische Gemüsesuppe, die nach Sommer in der Toskana duftet – mit Parmesan obendrauf.",
occ='mealprep,familie',kid=True,tip="Am zweiten Tag schmeckt sie noch besser. Die Nudeln quellen nach, dann etwas Brühe ergänzen.")
CH['minestrone_bohnen']='Neu.'

R('tomaten_paprika_suppe_feta','Geröstete Tomaten-Paprika-Suppe mit Feta','lunch','suppe','sh',4,15,40,"""
1 kg | Tomaten | tomate
3 | rote Paprika | paprika
1 | Zwiebel | zwiebel
4 | Knoblauchzehen | knoblauch=16
3 EL | Olivenöl | olivenoel
500 ml | Gemüsebrühe | gemuesebruehe
1 Dose | Kichererbsen (240 g abgetropft) | kichererbsen
100 g | Feta | feta
1 Handvoll | Basilikum | basilikum
4 Scheiben | Vollkornbrot | vk_brot
"""+S%4,["Backofen auf 220 °C vorheizen. Tomaten halbieren, Paprika und Zwiebel grob schneiden, Knoblauch ungeschält dazulegen.",
"Alles mit Öl und Salz auf einem Blech mischen und 30–35 Minuten rösten, bis die Ränder dunkel werden.",
"Knoblauch aus der Schale drücken, Gemüse mit Brühe pürieren und kurz aufkochen. Kichererbsen in der Suppe erwärmen.",
"Mit zerbröseltem Feta, Basilikum und Brot servieren."],
"Das Rösten macht's: süß, rauchig und tief tomatig – ein Sommer zum Löffeln.",
occ='mealprep,gaeste')
CH['tomaten_paprika_suppe_feta']='Neu.'

R('pastinakensuppe_apfel','Pastinakensuppe mit Apfel','lunch','suppe','w',4,15,25,"""
700 g | Pastinaken | pastinake
1 | säuerlicher Apfel | apfel
1 | Zwiebel | zwiebel
1 EL | Butter | butter
900 ml | Gemüsebrühe | gemuesebruehe
100 ml | Sahne | sahne
1 Prise | Muskat | gewuerz
40 g | Walnüsse | walnuesse
4 Scheiben | Vollkornbrot | vk_brot
"""+S%4,["Pastinaken schälen und in Stücke schneiden. Apfel und Zwiebel würfeln (ein Viertel vom Apfel zum Garnieren aufheben).",
"Butter schmelzen, Zwiebel 2 Minuten andünsten, Pastinaken und Apfel zugeben und mit Brühe auffüllen.",
"20 Minuten köcheln, Sahne zugeben, fein pürieren und mit Muskat, Salz und Pfeffer abschmecken.",
"Mit Apfelwürfeln und gehackten Walnüssen bestreuen und mit Brot servieren."],
"Leicht süßlich, nussig und mit frischem Apfel – ein unterschätztes Wintergemüse in Bestform.",
occ='mealprep,gaeste')
CH['pastinakensuppe_apfel']='Neu (Winter).'

R('rote_bete_suppe_meerrettich','Rote-Bete-Suppe mit Meerrettich','lunch','suppe','w',4,15,35,"""
600 g | Rote Bete (roh) | rote_bete
300 g | Kartoffeln | kartoffel
1 | Zwiebel | zwiebel
1 | Apfel | apfel
1 EL | Rapsöl | rapsoel
900 ml | Gemüsebrühe | gemuesebruehe
1 EL | Apfelessig | apfelessig
150 g | Schmand | schmand
2 TL | Meerrettich | meerrettich
1 Bund | Dill | dill
4 Scheiben | Roggenvollkornbrot | vk_brot
"""+S%4,["Rote Bete und Kartoffeln schälen (Handschuhe tragen) und würfeln. Zwiebel und Apfel klein schneiden.",
"Öl erhitzen, Zwiebel andünsten, Gemüse und Apfel zugeben und mit Brühe auffüllen. 30 Minuten köcheln, bis die Rote Bete weich ist.",
"Pürieren und mit Essig, Salz und Pfeffer abschmecken.",
"Schmand mit Meerrettich verrühren, auf die Suppe geben und mit Dill bestreuen. Mit Brot servieren."],
"Pink, erdig und mit einem Hauch Schärfe vom Meerrettich – ein Hingucker auf jedem Tisch.",
occ='mealprep,gaeste')
CH['rote_bete_suppe_meerrettich']='Neu (Winter).'

R('blumenkohlsuppe_curry','Blumenkohl-Curry-Suppe','lunch','suppe','hw',4,10,25,"""
1 | Blumenkohl (ca. 800 g) | blumenkohl=800
1 | Zwiebel | zwiebel
1 EL | Kokosöl oder Rapsöl | rapsoel
2 TL | Currypulver | currypulver
800 ml | Gemüsebrühe | gemuesebruehe
200 ml | Kokosmilch | kokosmilch
1 Dose | Kichererbsen (240 g abgetropft) | kichererbsen
1 TL | Paprikapulver | gewuerz
2 EL | Koriander oder Petersilie | petersilie
"""+S%4,["Backofen auf 200 °C vorheizen. Kichererbsen trocken tupfen, mit Paprika, etwas Öl und Salz mischen und 20 Minuten knusprig rösten.",
"Blumenkohl in Röschen teilen, Zwiebel würfeln. Öl erhitzen, Zwiebel anschwitzen und Curry 1 Minute mitrösten.",
"Blumenkohl und Brühe zugeben und 15 Minuten köcheln. Kokosmilch einrühren und fein pürieren.",
"Abschmecken und mit den knusprigen Kichererbsen und Kräutern servieren."],
"Cremig ohne Sahne, warm gewürzt und mit knusprigen Kichererbsen obendrauf.",
occ='mealprep')
CH['blumenkohlsuppe_curry']='Neu.'

R('spargelcremesuppe','Spargelcremesuppe','lunch','suppe','f',4,15,25,"""
800 g | weißer Spargel | spargel
1 | Kartoffel | kartoffel=150
1 | Schalotte | schalotte
1 EL | Butter | butter
800 ml | Gemüsebrühe | gemuesebruehe
100 ml | Sahne | sahne
1 | Zitrone (Saft) | zitrone=20
1 Prise | Zucker | zucker=1
2 EL | Schnittlauch | schnittlauch
150 g | Kochschinken oder Räucherlachs (nach Wunsch) | kochschinken
4 Scheiben | Baguette oder Vollkornbrot | vk_brot
"""+S%4,["Spargel schälen, holzige Enden abschneiden. Spitzen abschneiden und beiseitelegen, Stangen in Stücke schneiden. Schalen und Enden 15 Minuten in der Brühe auskochen, dann abseihen – das gibt Aroma.",
"Butter schmelzen, Schalotte und Kartoffel andünsten, Spargelstücke zugeben, mit der Spargelbrühe auffüllen und 15 Minuten köcheln.",
"Sahne zugeben, fein pürieren und mit Zitrone, Zucker, Salz und Pfeffer abschmecken. Spitzen in der Suppe 4 Minuten garziehen lassen.",
"Mit Schnittlauch und Schinkenwürfeln servieren."],
"Der Frühlingsklassiker: fein, samtig und mit ganzen Spargelspitzen.",
occ='gaeste')
CH['spargelcremesuppe']='Neu (Frühling).'

R('gurkensuppe_dill','Kalte Gurkensuppe mit Dill','lunch','suppe','s',4,15,0,"""
2 | Salatgurken | gurke
500 g | Naturjoghurt | joghurt
200 g | Buttermilch | buttermilch
1 | Knoblauchzehe | knoblauch=4
1 Bund | Dill | dill
1 EL | Olivenöl | olivenoel
1 EL | Zitronensaft | zitronensaft
150 g | Nordseekrabben oder Räucherforelle | garnelen
4 Scheiben | Vollkornbrot | vk_brot
"""+S%4,["Gurken schälen, ein Stück fein würfeln und beiseitelegen, den Rest grob schneiden.",
"Gurke mit Joghurt, Buttermilch, Knoblauch, Dill, Öl und Zitronensaft fein pürieren. Mit Salz und Pfeffer abschmecken und mindestens 30 Minuten kalt stellen.",
"In Schalen füllen und mit Gurkenwürfeln, Krabben und Dill garnieren. Mit Brot servieren."],
"Erfrischend wie ein Sprung ins Wasser – für die heißesten Tage des Jahres.",
occ='gaeste,ohne_kochen',wait=30)
CH['gurkensuppe_dill']='Neu (Sommer).'

R('fischsuppe_kabeljau_fenchel','Fischsuppe mit Kabeljau, Fenchel und Tomaten','lunch','suppe','g',4,15,25,"""
500 g | Kabeljaufilet | kabeljau
1 | Fenchelknolle | fenchel
1 | Zwiebel | zwiebel
2 | Knoblauchzehen | knoblauch=8
300 g | Kartoffeln | kartoffel
2 EL | Olivenöl | olivenoel
1 Dose | stückige Tomaten (400 g) | tomaten_dose
800 ml | Fischfond oder Gemüsebrühe | fischbruehe
1 | Orange (Schale) | gewuerz
1 Prise | Safran oder Paprikapulver | gewuerz
2 EL | Petersilie | petersilie
"""+S%4,["Fenchel, Zwiebel und Knoblauch in feine Streifen schneiden, Kartoffeln würfeln.",
"Öl erhitzen und Fenchel, Zwiebel und Knoblauch 5 Minuten andünsten. Tomaten, Fond, Kartoffeln, ein Streifen Orangenschale und Safran zugeben und 15 Minuten köcheln.",
"Fisch in große Stücke schneiden, salzen und in die Suppe legen. Bei kleiner Hitze 5–6 Minuten garziehen lassen – nicht mehr kochen, sonst zerfällt er.",
"Abschmecken und mit Petersilie servieren."],
"Mediterran wie an der Küste: zarter Fisch, Fenchel und ein Hauch Orange.",
occ='gaeste',tip="Statt Kabeljau gehen Seelachs oder ein Mix mit Garnelen.")
CH['fischsuppe_kabeljau_fenchel']='Ersetzt die Vorlage-Fischsuppen (z. B. „Kabeljau-Suppe mit Rosenkohl“).'

R('huehnersuppe_gemuese_nudeln','Hühnersuppe mit Gemüse und Nudeln','lunch','suppe','hw',4,15,45,"""
2 | Hähnchenschenkel | haehnchenschenkel
1,5 l | Wasser | wasser
3 | Karotten | karotte
2 Stangen | Staudensellerie | sellerie
1 Stange | Lauch | lauch
1 | Zwiebel | zwiebel
1 | Lorbeerblatt, 3 Pfefferkörner | gewuerz
120 g | Suppennudeln | eiernudeln
2 EL | Petersilie | petersilie
| Salz | salz=7
""",["Hähnchenschenkel mit Wasser, halbierter Zwiebel, Lorbeer, Pfefferkörnern und 1 TL Salz aufkochen. Schaum abschöpfen und 30 Minuten leise köcheln lassen.",
"Fleisch herausnehmen, Brühe durch ein Sieb gießen. Karotten, Sellerie und Lauch klein schneiden und in der Brühe 10 Minuten garen.",
"Nudeln zugeben und nach Packungsangabe garen. Fleisch von Haut und Knochen lösen, zerzupfen und zurück in die Suppe geben.",
"Abschmecken und mit Petersilie servieren."],
"Wie eine warme Umarmung an grauen Tagen – klare Brühe, zartes Huhn und Nudeln.",
occ='familie,mealprep',kid=True,tip="Ohne Nudeln einfrieren und die Nudeln beim Aufwärmen frisch kochen.")
CH['huehnersuppe_gemuese_nudeln']='Neu (Klassiker).'

R('thai_kokossuppe_haehnchen','Thai-Kokossuppe mit Hähnchen','lunch','suppe','g',4,15,20,"""
400 g | Hähnchenbrust | haehnchenbrust
400 ml | Kokosmilch | kokosmilch
600 ml | Hühnerbrühe | huehnerbruehe
3 cm | Ingwer | ingwer
1 Stange | Zitronengras (oder 1 Limette mehr) | gewuerz
250 g | Champignons | champignons
1 | rote Paprika | paprika
150 g | Zuckerschoten | zuckerschoten
2 | Limetten (Saft) | limette
2 EL | Sojasauce | sojasauce
1 TL | rote Currypaste (nach Geschmack) | currypaste
1 Handvoll | Koriander | koriander
""",["Ingwer in Scheiben schneiden, Zitronengras andrücken. Mit Kokosmilch, Brühe und Currypaste aufkochen und 5 Minuten ziehen lassen.",
"Hähnchen in dünne Streifen, Pilze in Scheiben, Paprika in Streifen schneiden.",
"Hähnchen in die Suppe geben und 5 Minuten leise köcheln. Pilze, Paprika und Zuckerschoten zugeben und weitere 3 Minuten garen.",
"Mit Limettensaft und Sojasauce abschmecken, Ingwer und Zitronengras herausnehmen und mit Koriander servieren."],
"Sauer, scharf, cremig – wie aus der Garküche in Bangkok, aber in 30 Minuten zuhause.",
occ='gaeste')
CH['thai_kokossuppe_haehnchen']='Neu (Low Carb).'
