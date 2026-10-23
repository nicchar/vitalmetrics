from build import R
CH={}
S='| Salz, Pfeffer | salz=%s'
R('quinoa_salat_rotkohl_suesskartoffel_14','Quinoa-Salat mit Rotkohl und Süßkartoffel','lunch','salat','hw',2,15,25,"""
100 g | Quinoa | quinoa
1 | Süßkartoffel (ca. 300 g) | suesskartoffel=300
150 g | Rotkohl | rotkohl
1 Handvoll | Feldsalat oder Babyspinat | feldsalat=30
2 EL | Kürbiskerne | kuerbiskerne
60 g | Feta | feta
2 EL | Olivenöl | olivenoel
1 EL | Apfelessig | apfelessig
1 TL | Senf, 1 TL Honig | senf
½ TL | Kreuzkümmel | gewuerz
"""+S%2,["Backofen auf 210 °C vorheizen. Süßkartoffel würfeln, mit 1 EL Öl, Kreuzkümmel und Salz mischen und 20–25 Minuten rösten.",
"Quinoa heiß abspülen und in der doppelten Menge Salzwasser 15 Minuten garen, abkühlen lassen.",
"Rotkohl in sehr feine Streifen hobeln und mit einer Prise Salz kräftig durchkneten, damit er zart wird.",
"Essig, Senf, Honig und restliches Öl verrühren. Alles mischen und mit Feldsalat, Feta und Kürbiskernen anrichten."],
"Kein Salat, nach dem du in einer Stunde wieder Hunger hast: Quinoa, Ofen-Süßkartoffel und Rotkohl.",
occ='mealprep,mitnehmen',tip="Schmeckt warm und kalt. Für die Lunchbox Feldsalat erst kurz vor dem Essen unterheben.")
CH['quinoa_salat_rotkohl_suesskartoffel_14']='Pin-Rezept: 2 Portionen statt 1 (vorher 1.033 kcal/Portion), Süßkartoffel wird geröstet statt „nach Packungsanweisung gegart“, Dressing ergänzt.'

R('lachs_avocado_bowl','Lachs-Avocado-Bowl mit Vollkornreis','lunch','bowl','g',2,15,25,"""
120 g | Vollkornreis | vollkornreis
200 g | Lachsfilet | lachs
1 | Avocado | avocado
½ | Salatgurke | gurke=200
1 | Karotte | karotte
100 g | Edamame (TK) | edamame
2 EL | Sojasauce | sojasauce
1 | Limette | limette
1 TL | Sesam | sesam
1 TL | Rapsöl | rapsoel
""",["Reis garen. Edamame 3 Minuten in kochendem Wasser garen.",
"Lachs salzen und im Öl auf der Hautseite 5 Minuten braten, wenden und 2 Minuten fertig braten. In Stücke zupfen.",
"Avocado, Gurke und Karotte in Scheiben bzw. Streifen schneiden. Sojasauce mit Limettensaft verrühren.",
"Reis in Schalen verteilen, alles darauf anrichten, mit Dressing beträufeln und mit Sesam bestreuen."],
"Poke-Bowl-Gefühl zuhause: warmer Lachs, cremige Avocado und viel Knackiges.",
occ='feierabend,mealprep')
CH['lachs_avocado_bowl']='Portion korrigiert (vorher 688 kcal), Edamame und Gemüse ergänzt.'

R('buddha_bowl_kichererbsen_tahini','Buddha-Bowl mit Kichererbsen und Tahini','lunch','bowl','g',2,15,25,"""
100 g | Quinoa oder Bulgur | quinoa
1 Dose | Kichererbsen (240 g abgetropft) | kichererbsen
1 | Süßkartoffel (ca. 250 g) | suesskartoffel=250
100 g | Rotkohl | rotkohl
1 Handvoll | Babyspinat | spinat
½ | Avocado | avocado
2 EL | Tahin | tahin
1 | Zitrone | zitrone=30
1 EL | Olivenöl | olivenoel
1 TL | Paprikapulver | gewuerz
"""+S%2,["Backofen auf 210 °C vorheizen. Süßkartoffel würfeln, mit Kichererbsen, Öl, Paprika und Salz mischen und 25 Minuten rösten.",
"Quinoa garen. Rotkohl fein hobeln, Avocado in Scheiben schneiden.",
"Tahin mit Zitronensaft, Salz und 3–4 EL Wasser zu einer cremigen Sauce rühren.",
"Alles in Schalen anrichten und mit Tahin-Sauce beträufeln."],
"Bunt wie ein Regenbogen, mit nussiger Tahin-Sauce – macht satt und glücklich.",
occ='mealprep,mitnehmen')
CH['buddha_bowl_kichererbsen_tahini']='Ersetzt die „Vollkorn-Power-Bowl“ (1 Portion, 791 kcal).'

R('falafel_bowl_hummus','Falafel-Bowl mit Hummus und Gurke','lunch','bowl','g',2,15,15,"""
8 | Falafel (fertig, aus dem Kühlregal) | falafel
80 g | Bulgur | bulgur
100 g | Hummus | hummus
½ | Salatgurke | gurke=200
2 | Tomaten | tomate
½ | rote Zwiebel | rote_zwiebel=40
100 g | Naturjoghurt | joghurt
1 Handvoll | Petersilie, Minze | petersilie=10
1 | Zitrone | zitrone=30
1 EL | Olivenöl | olivenoel
"""+S%2,["Bulgur mit der doppelten Menge heißem Salzwasser übergießen und 10 Minuten quellen lassen.",
"Falafel im Ofen nach Packungsangabe aufbacken.",
"Gurke, Tomaten und Zwiebel würfeln, mit Kräutern, Zitronensaft, Öl und Salz mischen.",
"Bulgur, Salat, Hummus, Joghurt und Falafel in Schalen anrichten."],
"Streetfood aus Beirut als Bowl: knusprige Falafel, cremiger Hummus und frischer Salat.",
occ='feierabend,mitnehmen')
CH['falafel_bowl_hummus']='Neu.'

R('teriyaki_haehnchen_bowl','Teriyaki-Hähnchen-Bowl mit Brokkoli','lunch','bowl','g',2,10,20,"""
300 g | Hähnchenbrust | haehnchenbrust
120 g | Reis | reis
300 g | Brokkoli | brokkoli
1 | Karotte | karotte
3 EL | Sojasauce | sojasauce
1 EL | Honig | honig
1 EL | Reisessig oder Apfelessig | apfelessig
2 cm | Ingwer, 1 Knoblauchzehe | ingwer
1 TL | Rapsöl | rapsoel
1 TL | Sesam, Frühlingszwiebel | sesam
""",["Reis garen. Brokkoli in Röschen 4 Minuten dämpfen, Karotte in feine Streifen schneiden.",
"Sojasauce, Honig, Essig, geriebenen Ingwer und Knoblauch verrühren.",
"Hähnchen in Würfel schneiden und im Öl 5 Minuten braten. Sauce zugeben und 2 Minuten einkochen, bis das Fleisch glänzt.",
"Reis, Hähnchen und Gemüse in Schalen anrichten und mit Sesam und Frühlingszwiebel bestreuen."],
"Glänzend, süß-salzig und unwiderstehlich – Teriyaki ganz ohne Fertigsauce.",
occ='feierabend,mealprep',kid=True)
CH['teriyaki_haehnchen_bowl']='Neu.'

R('burrito_bowl_bohnen','Burrito-Bowl mit schwarzen Bohnen, Mais und Avocado','lunch','bowl','g',2,15,20,"""
100 g | Reis | reis
1 Dose | schwarze Bohnen (240 g abgetropft) | schwarze_bohnen
140 g | Mais | mais
1 | Avocado | avocado
150 g | Kirschtomaten | kirschtomaten=150
1 | Limette | limette
100 g | Naturjoghurt | joghurt
1 TL | Kreuzkümmel, Paprikapulver | gewuerz
1 Handvoll | Koriander, Salatblätter | romana=50
30 g | Feta oder Cheddar (nach Wunsch) | feta
"""+S%2,["Reis garen und mit etwas Limettensaft und Koriander mischen.",
"Bohnen mit Gewürzen und 3 EL Wasser 5 Minuten erwärmen, Mais kurz mitwärmen.",
"Tomaten würfeln, Avocado in Scheiben schneiden.",
"Alles mit Salat in Schalen anrichten, mit Joghurt und Käse toppen."],
"Alles, was am Burrito gut ist – nur übersichtlich in der Schale.",
occ='mealprep,mitnehmen')
CH['burrito_bowl_bohnen']='Ersetzt die Vorlage-Bowls mit schwarzen Bohnen.'

R('linsen_bowl_rote_bete_feta','Linsen-Bowl mit Roter Bete und Feta','lunch','bowl','hw',2,15,25,"""
120 g | Beluga- oder Tellerlinsen | linsen
250 g | Rote Bete (vorgegart) | rote_bete_gekocht
1 | Apfel | apfel
2 Handvoll | Feldsalat | feldsalat=60
60 g | Feta | feta
2 EL | Walnüsse | walnuesse
2 EL | Olivenöl | olivenoel
1 EL | Balsamico | balsamico
1 TL | Senf, 1 TL Honig | senf
"""+S%2,["Linsen in ungesalzenem Wasser 20–25 Minuten bissfest garen, abgießen und salzen.",
"Rote Bete und Apfel in Würfel schneiden. Walnüsse grob hacken.",
"Öl, Balsamico, Senf und Honig verrühren und die warmen Linsen damit marinieren.",
"Mit Feldsalat, Roter Bete, Apfel, Feta und Walnüssen anrichten."],
"Erdig, süß und salzig zugleich – eine Bowl in den schönsten Herbstfarben.",
occ='mealprep,mitnehmen')
CH['linsen_bowl_rote_bete_feta']='Ersetzt die Vorlage-Linsen-Bowls.'

R('bulgur_bowl_ofengemuese','Bulgur-Bowl mit Ofengemüse und Joghurt-Dip','lunch','bowl','g',2,15,25,"""
100 g | Bulgur | bulgur
1 | Zucchini | zucchini
1 | Paprika | paprika
1 | rote Zwiebel | rote_zwiebel
1 Dose | Kichererbsen (240 g abgetropft) | kichererbsen=120
2 EL | Olivenöl | olivenoel
1 TL | Za'atar oder Thymian, Paprika | gewuerz
150 g | griechischer Joghurt | joghurt_griech
1 | Knoblauchzehe | knoblauch=4
1 | Zitrone | zitrone=20
"""+S%2,["Backofen auf 210 °C vorheizen. Gemüse in Stücke schneiden, mit Kichererbsen, Öl, Gewürzen und Salz mischen und 25 Minuten rösten.",
"Bulgur mit der doppelten Menge heißem Salzwasser übergießen und 10 Minuten quellen lassen.",
"Joghurt mit gepresstem Knoblauch, Zitronensaft und Salz verrühren.",
"Bulgur, Ofengemüse und Joghurt-Dip in Schalen anrichten."],
"Orientalisch gewürztes Ofengemüse auf Bulgur – mit kühlem Knoblauchjoghurt.",
occ='mealprep,mitnehmen')
CH['bulgur_bowl_ofengemuese']='Neu.'

R('herbstsalat_birne_walnuss','Herbstsalat mit Birne, Walnüssen und Gorgonzola','lunch','salat','h',2,15,0,"""
100 g | Feldsalat | feldsalat
1 | reife Birne | birne
60 g | Gorgonzola | gorgonzola
40 g | Walnüsse | walnuesse
1 Dose | Linsen oder Kichererbsen (120 g) | linsen_gekocht=120
2 EL | Olivenöl | olivenoel
1 EL | Balsamico | balsamico
1 TL | Honig, 1 TL Senf | honig
2 Scheiben | Vollkornbrot | vk_brot
"""+S%1,["Feldsalat waschen und trocken schleudern. Birne in dünne Spalten schneiden.",
"Walnüsse in einer Pfanne ohne Fett rösten, mit Honig beträufeln und kurz karamellisieren lassen.",
"Öl, Balsamico, Senf, Salz und Pfeffer verrühren.",
"Salat mit Linsen und Birne mischen, Gorgonzola darüberbröseln, mit Walnüssen bestreuen und mit Dressing und Brot servieren."],
"Süße Birne, würziger Gorgonzola und honigglasierte Walnüsse – ein Salat, der satt macht.",
occ='gaeste,schnell')
CH['herbstsalat_birne_walnuss']='Neu (passend zum Pin „Herbstsalat, der satt macht“). Linsen und Brot für eine vollständige Mahlzeit.'

R('vollkornreis_spinat_pekannuss_salat','Vollkornreis-Salat mit Spinat und Pekannüssen','lunch','salat','g',2,10,30,"""
120 g | Vollkornreis | vollkornreis
100 g | Babyspinat | spinat
1 | Apfel | apfel
40 g | Pekannüsse | pekannuesse
2 EL | Cranberrys oder Rosinen | rosinen
60 g | Feta | feta
2 EL | Olivenöl | olivenoel
1 EL | Apfelessig | apfelessig
1 TL | Senf, 1 TL Ahornsirup | senf
"""+S%2,["Reis nach Packungsangabe garen und abkühlen lassen.",
"Pekannüsse ohne Fett rösten. Apfel würfeln.",
"Öl, Essig, Senf, Ahornsirup und Salz verrühren und unter den Reis mischen.",
"Spinat, Apfel, Rosinen und Pekannüsse unterheben und mit Feta servieren."],
"Nussig, fruchtig und ideal zum Vorbereiten – schmeckt nach Herbstpicknick.",
occ='mealprep,mitnehmen')
CH['vollkornreis_spinat_pekannuss_salat']='Dressing und Feta ergänzt, Mengen geprüft.'

R('linsensalat_apfel_walnuss','Linsensalat mit Apfel und Walnüssen','lunch','salat','h',4,15,25,"""
250 g | Berglinsen | linsen
2 | Äpfel | apfel
2 | Karotten | karotte
3 | Frühlingszwiebeln | fruehlingszwiebel
50 g | Walnüsse | walnuesse
100 g | Ziegenfrischkäse oder Feta | feta
3 EL | Olivenöl | olivenoel
3 EL | Apfelessig | apfelessig
1 TL | Senf, 1 TL Honig | senf
1 Bund | Petersilie | petersilie
"""+S%3,["Linsen in ungesalzenem Wasser 20–25 Minuten bissfest garen, abgießen.",
"Öl, Essig, Senf, Honig, Salz und Pfeffer verrühren und die noch warmen Linsen damit marinieren.",
"Äpfel und Karotten würfeln, Frühlingszwiebeln in Ringe schneiden, Walnüsse rösten und hacken.",
"Alles mit Petersilie unter die Linsen mischen und mit zerbröseltem Käse servieren."],
"Herzhaft-säuerlicher Linsensalat mit knackigem Apfel – hält im Kühlschrank drei Tage.",
occ='mealprep,mitnehmen,gaeste')
CH['linsensalat_apfel_walnuss']='Neu.'

R('griechischer_salat_kichererbsen','Griechischer Salat mit Kichererbsen','lunch','salat','s',2,15,0,"""
3 | Tomaten | tomate
1 | Salatgurke | gurke
1 | grüne Paprika | paprika
½ | rote Zwiebel | rote_zwiebel=40
1 Dose | Kichererbsen (240 g abgetropft) | kichererbsen
100 g | Feta | feta
10 | Kalamata-Oliven | oliven_schwarz
2 EL | Olivenöl | olivenoel
1 EL | Rotweinessig | essig
1 TL | Oregano | gewuerz
2 Scheiben | Vollkornbrot oder Pita | vk_brot
"""+S%1,["Tomaten, Gurke und Paprika in grobe Stücke, Zwiebel in feine Ringe schneiden.",
"Mit Kichererbsen und Oliven mischen, mit Öl, Essig, Oregano, Salz und Pfeffer anmachen.",
"Feta als Stück obenauf legen, mit Oregano bestreuen und mit Brot servieren."],
"Urlaub auf dem Teller: sonnenreife Tomaten, Feta und Oliven – mit Kichererbsen als Sattmacher.",
occ='ohne_kochen,schnell')
CH['griechischer_salat_kichererbsen']='Neu.'

R('caesar_salad_haehnchen','Caesar Salad mit Hähnchen','lunch','salat','g',2,15,15,"""
300 g | Hähnchenbrust | haehnchenbrust
1 | Romanasalat | romana
30 g | Parmesan | parmesan
1 Scheiben | Vollkornbrot für Croûtons | vk_brot
150 g | griechischer Joghurt | joghurt_griech
1 TL | Senf | senf
1 | Knoblauchzehe | knoblauch=4
1 | Zitrone | zitrone=20
2 TL | Olivenöl | olivenoel
"""+S%2,["Hähnchen salzen und im Öl je Seite 5–6 Minuten braten, ruhen lassen und in Scheiben schneiden.",
"Brot würfeln und in der Pfanne knusprig rösten.",
"Joghurt mit Senf, gepresstem Knoblauch, Zitronensaft, der Hälfte des Parmesans, Salz und Pfeffer zu einem Dressing verrühren.",
"Salat in Stücke zupfen, mit Dressing mischen und mit Hähnchen, Croûtons und restlichem Parmesan anrichten."],
"Der Klassiker in leicht: knackiger Romana, cremiges Joghurt-Parmesan-Dressing und Hähnchen.",
occ='feierabend')
CH['caesar_salad_haehnchen']='Neu. Dressing auf Joghurtbasis statt Mayonnaise.'

R('kartoffelsalat_gurke_dill','Schwäbischer Kartoffelsalat mit Gurke','lunch','salat','s',4,20,25,"""
1,2 kg | festkochende Kartoffeln | kartoffel=1200
1 | Zwiebel | zwiebel
300 ml | Gemüsebrühe | gemuesebruehe
4 EL | Weißweinessig | essig
1 TL | Senf | senf
4 EL | Rapsöl | rapsoel
1 | Salatgurke | gurke
1 Bund | Schnittlauch | schnittlauch
4 | Eier, hart gekocht | ei
"""+S%5,["Kartoffeln in der Schale 20–25 Minuten kochen, pellen und noch warm in dünne Scheiben schneiden.",
"Zwiebel fein würfeln und mit Brühe aufkochen, Essig, Senf, Salz und Pfeffer zugeben und heiß über die Kartoffeln gießen. Vorsichtig mischen und 30 Minuten ziehen lassen.",
"Öl unterheben, Gurke in feine Scheiben hobeln und mit Schnittlauch untermischen.",
"Mit hart gekochten Eiern servieren."],
"Schlotzig, säuerlich und ohne Mayo – so geht Kartoffelsalat im Süden.",
occ='gaeste,mitnehmen,familie',kid=True)
CH['kartoffelsalat_gurke_dill']='Neu (Klassiker). Eier für eine vollständige Mahlzeit.'

R('rote_bete_salat_apfel','Rote-Bete-Salat mit Apfel und Meerrettich-Joghurt','lunch','salat','hw',2,15,0,"""
400 g | Rote Bete (vorgegart) | rote_bete_gekocht
1 | säuerlicher Apfel | apfel
150 g | Naturjoghurt | joghurt
1 EL | Meerrettich | meerrettich
1 EL | Apfelessig | apfelessig
2 EL | Walnüsse | walnuesse
100 g | geräucherte Forelle (nach Wunsch) | forelle_ger
2 Scheiben | Roggenvollkornbrot | vk_brot
1 EL | Dill | dill
"""+S%1,["Rote Bete und Apfel in feine Stifte schneiden.",
"Joghurt mit Meerrettich, Essig, Salz und Pfeffer verrühren und unterheben.",
"Mit gehackten Walnüssen, zerzupfter Forelle und Dill anrichten und mit Brot servieren."],
"Pink, frisch und mit einem Hauch Schärfe – Rote Bete, wie sie jedem schmeckt.",
occ='ohne_kochen,schnell')
CH['rote_bete_salat_apfel']='Neu (Winter).'

R('thunfischsalat_weisse_bohnen','Thunfischsalat mit weißen Bohnen','lunch','salat','g',2,10,0,"""
1 Dose | Thunfisch im eigenen Saft (130 g) | thunfisch
1 Dose | weiße Bohnen (240 g abgetropft) | weisse_bohnen
½ | rote Zwiebel | rote_zwiebel=40
150 g | Kirschtomaten | kirschtomaten=150
1 Handvoll | Rucola | rucola
2 EL | Olivenöl | olivenoel
1 | Zitrone | zitrone=30
1 EL | Kapern, Petersilie | kapern
"""+S%1,["Bohnen abspülen und abtropfen lassen. Zwiebel in feine Ringe schneiden, Tomaten halbieren.",
"Olivenöl, Zitronensaft, Salz und Pfeffer verrühren und mit Bohnen und Zwiebeln mischen.",
"Thunfisch zerpflücken und mit Tomaten, Kapern und Rucola unterheben."],
"Italienischer Vorratssalat: cremige Bohnen, Thunfisch und Zitrone – fertig in zehn Minuten.",
occ='ohne_kochen,mitnehmen,schnell')
CH['thunfischsalat_weisse_bohnen']='Ersetzt Vorlage-Thunfisch-Salate.'

R('erdbeer_spinat_salat_feta','Erdbeer-Spinat-Salat mit Feta und Mandeln','lunch','salat','fs',2,10,0,"""
150 g | Babyspinat | spinat
250 g | Erdbeeren | erdbeeren
100 g | Feta | feta
40 g | Mandeln | mandeln
1 Dose | Kichererbsen (120 g) | kichererbsen=120
2 EL | Olivenöl | olivenoel
1 EL | Balsamico | balsamico
1 TL | Honig | honig
2 Scheiben | Vollkornbrot | vk_brot
"""+S%1,["Erdbeeren halbieren, Mandeln ohne Fett rösten und grob hacken.",
"Öl, Balsamico, Honig, Salz und Pfeffer verrühren.",
"Spinat mit Erdbeeren und Kichererbsen mischen, Feta darüberbröseln, mit Mandeln bestreuen, mit Dressing beträufeln und mit Brot servieren."],
"Süße Erdbeeren, salziger Feta und Balsamico – Frühsommer zum Verlieben.",
occ='ohne_kochen,schnell,gaeste')
CH['erdbeer_spinat_salat_feta']='Neu.'

R('krautsalat_haehnchen_erdnuss','Asiatischer Krautsalat mit Hähnchen und Erdnüssen','lunch','salat','h',2,20,10,"""
250 g | Spitzkohl oder Weißkohl | spitzkohl
1 | Karotte | karotte
½ | rote Paprika | paprika
250 g | Hähnchenbrust | haehnchenbrust
2 EL | Erdnüsse | erdnuesse
1 EL | Erdnussmus | erdnussmus
2 EL | Sojasauce | sojasauce
1 | Limette | limette
1 TL | Honig, 1 TL Sesamöl | sesamoel
1 Handvoll | Koriander oder Minze | koriander
1 TL | Rapsöl | rapsoel
""",["Kohl in feine Streifen hobeln, Karotte und Paprika in feine Streifen schneiden.",
"Erdnussmus mit Sojasauce, Limettensaft, Honig, Sesamöl und 2 EL Wasser verrühren und mit dem Gemüse mischen. 10 Minuten ziehen lassen.",
"Hähnchen im Öl je Seite 5 Minuten braten und in Streifen schneiden.",
"Salat mit Hähnchen, gehackten Erdnüssen und Kräutern anrichten."],
"Knackig, nussig und frisch – Krautsalat, der nach Thailand schmeckt.",
occ='mealprep,mitnehmen')
CH['krautsalat_haehnchen_erdnuss']='Ersetzt Vorlage-Kohl-Varianten.'

R('panzanella','Brotsalat mit Tomaten und Basilikum','lunch','salat','s',2,15,5,"""
150 g | Ciabatta oder Baguette vom Vortag | baguette
500 g | reife Tomaten | tomate
½ | Salatgurke | gurke=200
½ | rote Zwiebel | rote_zwiebel=40
125 g | Mozzarella | mozzarella
3 EL | Olivenöl | olivenoel
1 EL | Rotweinessig | essig
1 Handvoll | Basilikum | basilikum
1 Dose | weiße Bohnen (120 g) | weisse_bohnen=120
"""+S%2,["Brot in Würfel schneiden und mit 1 EL Öl in der Pfanne goldbraun rösten.",
"Tomaten und Gurke grob würfeln, Zwiebel in feine Ringe schneiden, alles mit Salz mischen und 10 Minuten Saft ziehen lassen.",
"Restliches Öl und Essig zugeben, Brot und Bohnen unterheben und 5 Minuten ziehen lassen, damit das Brot den Tomatensaft aufsaugt.",
"Mit Mozzarella und Basilikum servieren."],
"Toskanische Resteküche: Brot saugt sich mit Tomatensaft voll – Sommer pur.",
occ='resteessen,gaeste')
CH['panzanella']='Neu.'

R('bismarckhering_pellkartoffeln','Bismarckhering mit Pellkartoffeln und Gurkensalat','lunch','fisch','g',2,10,25,"""
4 | Bismarckheringfilets (ca. 240 g) | bismarckhering=240
500 g | kleine Kartoffeln | kartoffel
1 | Salatgurke | gurke
150 g | Naturjoghurt | joghurt
1 | Apfel | apfel
1 | rote Zwiebel | rote_zwiebel
1 Bund | Dill | dill
"""+S%2,["Kartoffeln in der Schale 20–25 Minuten kochen.",
"Gurke in Scheiben hobeln und mit der Hälfte des Joghurts, Dill, Salz und Pfeffer anmachen.",
"Apfel und Zwiebel fein würfeln und mit dem übrigen Joghurt zu einer Soße verrühren.",
"Heringe mit der Apfel-Zwiebel-Soße, Pellkartoffeln und Gurkensalat anrichten."],
"Norddeutsche Küstenküche: säuerlicher Hering, Apfel-Zwiebel-Soße und Pellkartoffeln.",
occ='schnell')
CH['bismarckhering_pellkartoffeln']='Vom Frühstück zum Hauptgericht umsortiert; Soße und Gurkensalat ergänzt.'

R('frikadellen_kohlrabi','Frikadellen mit Rahmkohlrabi und Kartoffeln','lunch','pfanne','fs',4,20,25,"""
500 g | gemischtes Hackfleisch | hack_gemischt
1 | Brötchen vom Vortag (oder 40 g Semmelbrösel) | paniermehl=40
1 | Ei | ei
1 | Zwiebel | zwiebel
1 TL | Senf, Majoran | senf
1 EL | Rapsöl | rapsoel
3 | Kohlrabi | kohlrabi
150 ml | Milch | milch
100 g | Schmand | schmand
800 g | Kartoffeln | kartoffel
2 EL | Petersilie | petersilie
1 Prise | Muskat | gewuerz
"""+S%5,["Kartoffeln schälen und in Salzwasser 20 Minuten kochen. Brötchen einweichen und ausdrücken, Zwiebel fein würfeln.",
"Hack mit Brötchen, Ei, Zwiebel, Senf, Majoran, Salz und Pfeffer verkneten, 8 Frikadellen formen und im Öl je Seite 5–6 Minuten braten.",
"Kohlrabi schälen, in Stifte schneiden und in wenig Salzwasser 8 Minuten garen. Wasser bis auf einen Rest abgießen, Milch und Schmand einrühren, 3 Minuten köcheln und mit Muskat und Petersilie abschmecken.",
"Frikadellen mit Rahmkohlrabi und Kartoffeln servieren."],
"Sonntagsessen wie früher: saftige Frikadellen und zarter Rahmkohlrabi.",
occ='familie',kid=True)
CH['frikadellen_kohlrabi']='Neu (Klassiker).'

R('huehnerfrikassee_reis','Hühnerfrikassee mit Reis','lunch','eintopf','g',4,15,30,"""
500 g | Hähnchenbrust | haehnchenbrust
250 g | Champignons | champignons
200 g | Spargel oder Erbsen | erbsen
2 | Karotten | karotte
1 EL | Butter | butter
3 EL | Mehl | mehl
500 ml | Hühnerbrühe | huehnerbruehe
100 ml | Sahne | sahne
1 | Zitrone | zitrone=20
200 g | Reis | reis
2 EL | Petersilie | petersilie
"""+S%3,["Reis garen. Hähnchen in Würfel, Pilze in Scheiben, Karotten in Scheiben schneiden.",
"Hähnchen in der Brühe 10 Minuten garziehen lassen und herausnehmen. Karotten in der Brühe 5 Minuten garen, Erbsen 2 Minuten mitgaren und alles abseihen, Brühe auffangen.",
"Butter schmelzen, Pilze 3 Minuten braten, Mehl einrühren und nach und nach die Brühe zugießen. 5 Minuten köcheln, Sahne zugeben.",
"Fleisch und Gemüse in die Sauce geben, mit Zitronensaft, Salz und Pfeffer abschmecken und mit Reis und Petersilie servieren."],
"Cremig, zitronig und tröstlich – Frikassee, wie es in Familienküchen seit Jahrzehnten gekocht wird.",
occ='familie',kid=True)
CH['huehnerfrikassee_reis']='Neu (Klassiker).'

R('haehnchen_wraps_avocado','Hähnchen-Wraps mit Avocado','lunch','brot','g',4,15,10,"""
400 g | Hähnchenbrust | haehnchenbrust
4 | große Vollkornwraps | tortilla=280
1 | Avocado | avocado
1 | Romanasalat | romana=150
2 | Tomaten | tomate
150 g | Naturjoghurt | joghurt
1 TL | Paprikapulver | gewuerz
1 EL | Rapsöl | rapsoel
1 | Limette | limette
"""+S%2,["Hähnchen in Streifen schneiden, mit Paprika und Salz würzen und im Öl 5 Minuten braten.",
"Avocado mit Limettensaft und Salz zerdrücken, Tomaten würfeln, Salat in Streifen schneiden.",
"Wraps kurz erwärmen, mit Avocado bestreichen, mit Salat, Tomaten, Hähnchen und Joghurt belegen, Seiten einschlagen und fest aufrollen."],
"Zum Mitnehmen, zum Teilen, zum Selberrollen – frisch, würzig und sättigend.",
occ='mitnehmen,familie')
CH['haehnchen_wraps_avocado']='Neu.'

R('rindfleisch_burger_coleslaw','Burger mit Coleslaw im Vollkornbrötchen','lunch','brot','s',4,20,15,"""
500 g | Rinderhackfleisch | rinderhack
4 | Vollkorn-Burgerbrötchen | burgerbroetchen
4 Scheiben | Bergkäse oder Cheddar | bergkaese=60
2 | Tomaten | tomate
4 Blatt | Salat | kopfsalat
300 g | Weißkohl | weisskohl
1 | Karotte | karotte
100 g | Naturjoghurt | joghurt
1 EL | Mayonnaise | mayonnaise
1 TL | Senf, 1 TL Apfelessig | senf
"""+S%3,["Kohl sehr fein hobeln, Karotte raspeln. Joghurt, Mayonnaise, Senf, Essig, Salz und Pfeffer verrühren und unterheben (Coleslaw).",
"Hack mit Salz und Pfeffer locker zu 4 flachen Pattys formen, in die Mitte eine kleine Mulde drücken.",
"Pattys in einer sehr heißen Pfanne oder auf dem Grill je Seite 3–4 Minuten braten, Käse in der letzten Minute darauflegen.",
"Brötchen anrösten und mit Salat, Tomate, Patty und etwas Coleslaw belegen. Restlichen Coleslaw dazu servieren."],
"Saftiger Burger mit selbst gemachtem Coleslaw – Grillabend-Gefühl in der eigenen Küche.",
occ='wochenende,gaeste,familie',kid=True)
CH['rindfleisch_burger_coleslaw']='Neu (Genuss).'

R('fisch_tacos_krautsalat','Fisch-Tacos mit Krautsalat und Limette','lunch','brot','s',4,20,10,"""
500 g | Kabeljau oder Seelachs | kabeljau
8 | kleine Weizentortillas | tortilla=320
250 g | Rotkohl | rotkohl
1 | Avocado | avocado
150 g | Naturjoghurt | joghurt
2 | Limetten | limette
1 TL | Kreuzkümmel, Paprikapulver | gewuerz
1 EL | Rapsöl | rapsoel
1 Handvoll | Koriander | koriander
"""+S%3,["Rotkohl fein hobeln, mit Saft einer Limette und Salz verkneten.",
"Fisch in Stücke schneiden, mit Gewürzen und Salz einreiben und im Öl je Seite 2–3 Minuten braten.",
"Joghurt mit Limettenschale, -saft und Salz verrühren. Avocado in Scheiben schneiden. Tortillas kurz in der Pfanne erwärmen.",
"Tortillas mit Krautsalat, Fisch, Avocado, Limettenjoghurt und Koriander füllen."],
"Wie am Strand von Baja California: würziger Fisch, knackiger Kohl und Limette.",
occ='gaeste,wochenende')
CH['fisch_tacos_krautsalat']='Neu.'
