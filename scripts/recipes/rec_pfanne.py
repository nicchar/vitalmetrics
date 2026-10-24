from build import R
CH={}
S='| Salz, Pfeffer | salz=%s'
R('brokkoli_lachs_pfanne','Brokkoli-Lachs-Pfanne mit Sesam','lunch','pfanne','g',2,10,15,"""
250 g | Lachsfilet | lachs
400 g | Brokkoli | brokkoli
1 | Paprika | paprika
1 | Knoblauchzehe | knoblauch=4
2 cm | Ingwer | ingwer
1 EL | Rapsöl | rapsoel
2 EL | Sojasauce | sojasauce
1 TL | Honig | honig
1 EL | Sesam | sesam
120 g | Vollkornreis | vollkornreis
""",["Reis nach Packungsangabe garen. Brokkoli in Röschen, Paprika in Streifen schneiden, Knoblauch und Ingwer hacken. Lachs in Würfel schneiden.",
"Sesam ohne Fett goldbraun rösten und beiseitestellen.",
"Öl erhitzen, Brokkoli und Paprika 4 Minuten unter Rühren braten, Knoblauch und Ingwer kurz mitbraten.",
"Lachs zugeben und 3–4 Minuten vorsichtig mitbraten. Sojasauce und Honig verrühren, darübergeben, mit Sesam bestreuen und mit Reis servieren."],
"Glänzend glasierter Lachs und knackiger Brokkoli – asiatisch, schnell und sehr gut.",
occ='feierabend,schnell')
CH['brokkoli_lachs_pfanne']='Glasur (Sojasauce, Honig, Ingwer) und Reis ergänzt; Mengen auf 2 Portionen geprüft.'

R('lachsfilet_spinat','Lachsfilet auf Spinatbett','lunch','pfanne','g',2,10,12,"""
2 | Lachsfilets (je 125 g) | lachs=250
400 g | Blattspinat | spinat
2 | Knoblauchzehen | knoblauch=8
1 EL | Olivenöl | olivenoel
1 | Zitrone | zitrone=30
2 EL | Pinienkerne oder Mandeln | mandeln
50 g | Feta (nach Wunsch) | feta
"""+S%2,["Lachs trocken tupfen und salzen. Im Öl auf der Hautseite bei mittlerer Hitze 5 Minuten braten, wenden und 2–3 Minuten fertig garen.",
"Lachs herausnehmen, Knoblauch im Bratfett kurz anschwitzen, Spinat zugeben und zusammenfallen lassen. Mit Salz, Pfeffer und Zitronensaft würzen.",
"Mandeln kurz anrösten. Lachs auf dem Spinat anrichten, mit Mandeln und Feta bestreuen."],
"Knusprige Lachshaut auf zartem Knoblauchspinat – fertig in zwanzig Minuten.",
occ='feierabend,schnell')
CH['lachsfilet_spinat']='Highlight neu formuliert (vorher „ideal bei mehreren Mängeln gleichzeitig“ – unzulässiges Wirkversprechen). Mandeln und Feta ergänzt.'

R('gnocchi_pfanne_spinat_tomaten','Gnocchi-Pfanne mit Spinat und Kirschtomaten','lunch','pfanne','g',2,5,15,"""
400 g | Gnocchi (Kühlregal) | gnocchi
250 g | Kirschtomaten | kirschtomaten=250
150 g | Babyspinat | spinat
1 | Knoblauchzehe | knoblauch=4
1 EL | Olivenöl | olivenoel
60 g | Mozzarella oder Feta | mozzarella
1 Dose | weiße Bohnen (240 g abgetropft) | weisse_bohnen=120
1 Handvoll | Basilikum | basilikum
"""+S%2,["Öl in einer großen Pfanne erhitzen und die Gnocchi ungekocht 6–8 Minuten goldbraun und knusprig braten.",
"Tomaten halbieren, mit Knoblauch und Bohnen zugeben und 3 Minuten mitbraten, bis die Tomaten aufplatzen.",
"Spinat unterheben, salzen und pfeffern. Mozzarella darüberzupfen und mit Basilikum servieren."],
"Knusprige Gnocchi, aufgeplatzte Tomaten und Spinat – Feierabendessen in 20 Minuten.",
occ='feierabend,schnell',kid=True)
CH['gnocchi_pfanne_spinat_tomaten']='Neu. Weiße Bohnen für mehr Eiweiß.'

R('haehnchen_wok_erdnuss','Hähnchen-Gemüse-Wok mit Erdnusssauce','lunch','pfanne','g',4,15,15,"""
400 g | Hähnchenbrust | haehnchenbrust
1 | Brokkoli | brokkoli=400
2 | Paprika | paprika
2 | Karotten | karotte
1 Bund | Frühlingszwiebeln | fruehlingszwiebel
1 EL | Rapsöl | rapsoel
3 EL | Erdnussmus | erdnussmus
3 EL | Sojasauce | sojasauce
1 | Limette | limette
1 TL | Honig, etwas Chili | honig
2 cm | Ingwer | ingwer
2 EL | Erdnüsse, gehackt | erdnuesse
200 g | Vollkornreis oder Reisnudeln | vollkornreis
""",["Reis garen. Hähnchen in Streifen, Gemüse in mundgerechte Stücke, Frühlingszwiebeln in Ringe schneiden.",
"Erdnussmus mit Sojasauce, Limettensaft, Honig, geriebenem Ingwer und 5 EL warmem Wasser glatt rühren.",
"Öl im Wok stark erhitzen, Hähnchen 4 Minuten braten und herausnehmen. Karotten und Brokkoli 4 Minuten, Paprika 2 Minuten unter Rühren braten.",
"Hähnchen und Sauce zugeben, alles 1 Minute durchschwenken, mit Frühlingszwiebeln und Erdnüssen bestreuen und mit Reis servieren."],
"Cremige Erdnusssauce, knackiges Gemüse und zartes Hähnchen – besser als vom Lieferdienst.",
occ='feierabend,familie',kid=True)
CH['haehnchen_wok_erdnuss']='Ersetzt die Vorlage-Wok-Varianten.'

R('tofu_wok_brokkoli','Tofu-Brokkoli-Wok mit Vollkornreis','lunch','pfanne','g',2,15,15,"""
200 g | Naturtofu | tofu
1 EL | Speisestärke oder Mehl | mehl
300 g | Brokkoli | brokkoli
1 | rote Paprika | paprika
1 | Knoblauchzehe | knoblauch=4
2 cm | Ingwer | ingwer
2 EL | Rapsöl | rapsoel
3 EL | Sojasauce | sojasauce
1 TL | Ahornsirup | ahornsirup
1 TL | Sesamöl | sesamoel
1 EL | Sesam | sesam
120 g | Vollkornreis | vollkornreis
""",["Reis garen. Tofu gut ausdrücken, würfeln und mit Stärke bestäuben.",
"1 EL Öl erhitzen und den Tofu rundum knusprig braten, herausnehmen.",
"Restliches Öl erhitzen, Brokkoli und Paprika 5 Minuten unter Rühren braten, Knoblauch und Ingwer kurz mitbraten.",
"Sojasauce, Ahornsirup und Sesamöl zugeben, Tofu unterschwenken, mit Sesam bestreuen und mit Reis servieren."],
"Außen knusprig, innen zart: so schmeckt Tofu auch Skeptikern.",
occ='feierabend')
CH['tofu_wok_brokkoli']='Ersetzt 4 Tofu-Vorlagen. Trick für knusprigen Tofu ergänzt.'

R('gebratener_reis_ei_erbsen','Gebratener Reis mit Ei und Erbsen','lunch','pfanne','g',2,10,10,"""
300 g | gekochter Reis vom Vortag (ca. 120 g roh) | reis=120
3 | Eier | ei
150 g | Erbsen (TK) | erbsen
1 | Karotte | karotte
3 | Frühlingszwiebeln | fruehlingszwiebel
1 | Knoblauchzehe | knoblauch=4
1 EL | Rapsöl | rapsoel
2 EL | Sojasauce | sojasauce
1 TL | Sesamöl | sesamoel
""",["Karotte fein würfeln, Frühlingszwiebeln in Ringe schneiden, Knoblauch hacken.",
"Öl im Wok stark erhitzen, Karotte 2 Minuten braten, Knoblauch und Erbsen zugeben.",
"Reis zugeben und unter Rühren 4 Minuten braten, bis er leicht knusprig wird. Zur Seite schieben, Eier verquirlen, in die freie Stelle geben und stocken lassen.",
"Alles mischen, mit Sojasauce und Sesamöl würzen und mit Frühlingszwiebeln bestreuen."],
"Das beste Resteessen der Welt – kalter Reis wird hier richtig schön knusprig.",
occ='resteessen,schnell,feierabend',kid=True,tip="Funktioniert nur mit Reis vom Vortag – frischer Reis klebt.")
CH['gebratener_reis_ei_erbsen']='Neu (Resteessen).'

R('rind_brokkoli_pfanne','Rindfleisch-Brokkoli-Pfanne mit Reis','lunch','pfanne','g',4,15,15,"""
400 g | Rinderhüfte oder -steak | rinderhuefte
1 EL | Speisestärke | mehl
600 g | Brokkoli | brokkoli
1 | Zwiebel | zwiebel
2 | Knoblauchzehen | knoblauch=8
2 cm | Ingwer | ingwer
2 EL | Rapsöl | rapsoel
4 EL | Sojasauce | sojasauce
1 EL | Honig | honig
1 TL | Sesamöl | sesamoel
200 g | Basmatireis | reis
""",["Reis garen. Fleisch quer zur Faser in dünne Streifen schneiden und mit Stärke und 1 EL Sojasauce mischen.",
"Brokkoli in Röschen teilen und 3 Minuten in kochendem Wasser blanchieren. Zwiebel in Streifen schneiden, Knoblauch und Ingwer hacken.",
"Öl im Wok sehr stark erhitzen und das Fleisch portionsweise 1–2 Minuten scharf anbraten, herausnehmen. Zwiebel, Knoblauch und Ingwer 2 Minuten braten.",
"Brokkoli, Fleisch, restliche Sojasauce, Honig und Sesamöl zugeben, 1 Minute schwenken und mit Reis servieren."],
"Zartes Rindfleisch in glänzender Sauce mit knackigem Brokkoli – wie beim Lieblings-Chinesen.",
occ='feierabend')
CH['rind_brokkoli_pfanne']='Ersetzt Vorlage-Rindfleisch-Varianten.'

R('garnelen_zucchini_nudeln','Knoblauch-Garnelen mit Zucchini-Nudeln','lunch','pfanne','s',2,10,10,"""
250 g | Garnelen (TK, aufgetaut) | garnelen
3 | Zucchini | zucchini
3 | Knoblauchzehen | knoblauch=12
2 EL | Olivenöl | olivenoel
200 g | Kirschtomaten | kirschtomaten=200
1 | Zitrone | zitrone=30
1 Prise | Chiliflocken | gewuerz
30 g | Parmesan | parmesan
2 EL | Petersilie | petersilie
"""+S%2,["Zucchini mit einem Spiralschneider zu Nudeln drehen oder mit dem Sparschäler in Streifen schneiden. Knoblauch in Scheiben schneiden.",
"1 EL Öl erhitzen, Garnelen 2 Minuten pro Seite braten, bis sie rosa sind, salzen und herausnehmen.",
"Restliches Öl, Knoblauch, Chili und Tomaten 2 Minuten braten. Zucchini-Nudeln zugeben und nur 1–2 Minuten schwenken, damit sie Biss behalten.",
"Garnelen, Zitronensaft und Petersilie unterheben und mit Parmesan servieren."],
"Leicht, sommerlich und voller Knoblauch – Pasta-Gefühl ganz ohne Pasta.",
occ='feierabend,schnell')
CH['garnelen_zucchini_nudeln']='Ersetzt 15 Vorlage-Varianten mit Garnelen.'

R('bratkartoffeln_spiegelei','Bratkartoffeln mit Spiegelei und Gurkensalat','lunch','pfanne','g',2,15,20,"""
600 g | Pellkartoffeln vom Vortag | kartoffel
1 | Zwiebel | zwiebel
1 EL | Butterschmalz | butterschmalz
4 | Eier | ei
1 | Salatgurke | gurke
150 g | Naturjoghurt | joghurt
1 TL | Senf, Dill | senf
1 EL | Schnittlauch | schnittlauch
"""+S%3,["Kartoffeln pellen und in Scheiben schneiden. Zwiebel in Streifen schneiden.",
"Butterschmalz in einer großen Pfanne erhitzen und die Kartoffeln in einer Lage 10 Minuten ohne Rühren goldbraun braten, dann wenden. Zwiebel zugeben und weitere 8 Minuten braten. Salzen und pfeffern.",
"Gurke in feine Scheiben hobeln, mit Joghurt, Senf, Dill, Salz und Pfeffer anmachen.",
"Eier als Spiegeleier braten und mit Bratkartoffeln, Gurkensalat und Schnittlauch servieren."],
"Knusprige Bratkartoffeln, Spiegelei und frischer Gurkensalat – ehrliche Hausmannskost.",
occ='familie,resteessen',kid=True,tip="Das Geheimnis knuspriger Bratkartoffeln: gekochte Kartoffeln vom Vortag und Geduld beim Wenden.")
CH['bratkartoffeln_spiegelei']='Neu (Klassiker).'

R('kartoffelpuffer_apfelmus','Kartoffelpuffer mit Apfelmus','lunch','pfanne','hw',4,25,25,"""
1,2 kg | mehligkochende Kartoffeln | kartoffel=1200
1 | Zwiebel | zwiebel
2 | Eier | ei
3 EL | Dinkelvollkornmehl | vk_mehl
4 EL | Rapsöl zum Braten | rapsoel
400 g | Apfelmus (ungesüßt) | apfelmus
250 g | Magerquark | magerquark
1 Prise | Muskat | gewuerz
| Salz | salz=4
""",["Kartoffeln schälen und mit der Zwiebel fein reiben. In einem sauberen Küchentuch kräftig auspressen – je trockener, desto knuspriger.",
"Kartoffelmasse mit Eiern, Mehl, Salz und Muskat mischen.",
"Öl in einer Pfanne erhitzen, je 2 EL Masse hineingeben, flach drücken und von jeder Seite 3–4 Minuten goldbraun backen. Auf Küchenpapier abtropfen lassen.",
"Mit Apfelmus und Quark servieren."],
"Goldbraun, knusprig und mit Apfelmus – der Duft vom Weihnachtsmarkt in der eigenen Küche.",
occ='familie,wochenende',kid=True)
CH['kartoffelpuffer_apfelmus']='Neu (Klassiker). Quark für mehr Eiweiß dazu.'

R('halloumi_gemuesepfanne_couscous','Halloumi-Gemüsepfanne mit Couscous','lunch','pfanne','s',2,10,15,"""
150 g | Halloumi | halloumi
1 | Zucchini | zucchini
1 | Paprika | paprika
150 g | Kirschtomaten | kirschtomaten=150
1 | rote Zwiebel | rote_zwiebel
1 EL | Olivenöl | olivenoel
100 g | Couscous | couscous
150 ml | Gemüsebrühe | gemuesebruehe
½ | Zitrone | zitrone=20
1 Handvoll | Minze oder Petersilie | minze
""",["Couscous mit heißer Brühe übergießen und 5 Minuten quellen lassen.",
"Halloumi in Scheiben schneiden und ohne Fett von beiden Seiten goldbraun braten, herausnehmen.",
"Öl erhitzen und Zucchini, Paprika und Zwiebel 6 Minuten braten, Tomaten 2 Minuten mitbraten.",
"Couscous auflockern, mit Zitronensaft und Kräutern mischen und mit Gemüse und Halloumi anrichten."],
"Quietschender, goldbrauner Halloumi auf Sommergemüse – Urlaub auf Zypern zum Feierabend.",
occ='feierabend,schnell')
CH['halloumi_gemuesepfanne_couscous']='Ersetzt die Vorlagen Halloumi-Wok/-Pfanne (z. B. „Halloumi-Wok mit Spargel“ mit 1.305 kcal).'

R('haehnchengeschnetzeltes_champignons','Hähnchengeschnetzeltes mit Champignons und Reis','lunch','pfanne','g',4,15,20,"""
500 g | Hähnchenbrust | haehnchenbrust
400 g | Champignons | champignons
1 | Zwiebel | zwiebel
1 EL | Rapsöl | rapsoel
200 ml | Hühnerbrühe | huehnerbruehe
150 ml | Kochsahne oder Milch | sahne=100
1 TL | Senf | senf
2 EL | Petersilie | petersilie
200 g | Reis | reis
200 g | Erbsen oder Brokkoli | erbsen
"""+S%4,["Reis garen. Hähnchen in Streifen, Pilze in Scheiben schneiden, Zwiebel würfeln.",
"Öl stark erhitzen und das Hähnchen portionsweise 3 Minuten anbraten, salzen und herausnehmen.",
"Pilze im Bratfett 5 Minuten braun braten, Zwiebel 2 Minuten mitbraten. Mit Brühe ablöschen, Sahne und Senf zugeben und 3 Minuten einköcheln.",
"Fleisch und Erbsen zugeben und 3 Minuten ziehen lassen. Mit Petersilie bestreuen und mit Reis servieren."],
"Cremig, pilzig und in 35 Minuten fertig – Zürcher Art für den Alltag.",
occ='familie,feierabend',kid=True)
CH['haehnchengeschnetzeltes_champignons']='Neu.'

R('schweinefilet_rosenkohl_stampf','Schweinefilet mit Rosenkohl und Kartoffelstampf','lunch','pfanne','hw',4,20,30,"""
600 g | Schweinefilet | schweinefilet
800 g | mehligkochende Kartoffeln | kartoffel
200 ml | Milch | milch
1 EL | Butter | butter
500 g | Rosenkohl | rosenkohl
1 EL | Rapsöl | rapsoel
2 EL | Walnüsse | walnuesse
1 TL | Senf, etwas Thymian | senf
1 Prise | Muskat | gewuerz
"""+S%5,["Kartoffeln schälen und in Salzwasser 20 Minuten weich kochen. Rosenkohl putzen und halbieren. Backofen auf 120 °C vorheizen.",
"Filet salzen, im Öl rundum 5 Minuten kräftig anbraten und im Ofen 15–20 Minuten garziehen lassen (innen zartrosa, 60 °C).",
"Rosenkohl mit der Schnittfläche nach unten in der Fleischpfanne 6–8 Minuten braten, bis er goldbraun ist, mit 3 EL Wasser ablöschen und mit Walnüssen und Thymian schwenken.",
"Kartoffeln abgießen, mit warmer Milch, Butter und Muskat stampfen. Filet in Scheiben schneiden und mit Stampf und Rosenkohl servieren."],
"Zartrosa Filet, nussiger Rosenkohl und cremiger Stampf – ein Herbstessen für Gäste.",
occ='gaeste,wochenende')
CH['schweinefilet_rosenkohl_stampf']='Ersetzt 5 Vorlage-Varianten mit Schweinefilet.'

R('putenschnitzel_kartoffelsalat','Putenschnitzel mit Kartoffel-Gurken-Salat','lunch','pfanne','s',4,25,25,"""
4 | Putenschnitzel (je 120 g) | putenbrust=480
800 g | festkochende Kartoffeln | kartoffel
1 | Salatgurke | gurke
1 | Zwiebel | zwiebel
250 ml | Gemüsebrühe | gemuesebruehe
3 EL | Apfelessig | apfelessig
1 TL | Senf | senf
3 EL | Rapsöl | rapsoel
1 Bund | Schnittlauch oder Dill | schnittlauch
1 | Zitrone | zitrone=20
"""+S%5,["Kartoffeln als Pellkartoffeln 20 Minuten kochen, pellen und noch warm in Scheiben schneiden. Zwiebel fein würfeln.",
"Brühe mit Zwiebel aufkochen, Essig, Senf, 2 EL Öl, Salz und Pfeffer einrühren und über die warmen Kartoffeln gießen. 20 Minuten ziehen lassen, dann Gurkenscheiben und Kräuter unterheben.",
"Schnitzel flach klopfen, salzen und im restlichen Öl von jeder Seite 3 Minuten goldbraun braten.",
"Mit Zitronenspalten und Kartoffelsalat servieren."],
"Sommer-Klassiker: zartes Schnitzel und schwäbischer Kartoffelsalat ohne Mayo.",
occ='familie,gaeste',kid=True)
CH['putenschnitzel_kartoffelsalat']='Neu (Klassiker).'

R('forelle_muellerin','Forelle Müllerin mit Petersilienkartoffeln','lunch','pfanne','g',2,15,20,"""
4 | Forellenfilets (je ca. 100 g) | forelle=400
2 EL | Mehl | mehl
1 EL | Rapsöl | rapsoel
1 EL | Butter | butter
500 g | kleine Kartoffeln | kartoffel
2 EL | Petersilie | petersilie
1 | Zitrone | zitrone=30
1 Kopf | Kopfsalat mit Joghurtdressing | kopfsalat=150
"""+S%3,["Kartoffeln schälen und in Salzwasser 15–20 Minuten garen.",
"Forellenfilets salzen, in Mehl wenden und abklopfen.",
"Öl erhitzen und die Filets auf der Hautseite 3 Minuten knusprig braten, wenden und 1 Minute fertig braten. Herausnehmen.",
"Butter in die Pfanne geben, aufschäumen lassen, Zitronensaft und Petersilie zugeben und über Fisch und Kartoffeln geben. Mit Salat servieren."],
"Der Klassiker vom Gasthof am See: knusprige Forelle in brauner Butter mit Zitrone.",
occ='gaeste')
CH['forelle_muellerin']='Neu (Klassiker).'

R('zucchinipuffer_kraeuterjoghurt','Zucchinipuffer mit Kräuterjoghurt','lunch','pfanne','s',4,20,20,"""
3 | Zucchini | zucchini
2 | Kartoffeln | kartoffel=200
2 | Eier | ei
60 g | Feta | feta
4 EL | Dinkelvollkornmehl | vk_mehl
2 | Frühlingszwiebeln | fruehlingszwiebel
3 EL | Rapsöl | rapsoel
300 g | griechischer Joghurt | joghurt_griech
1 Bund | Dill und Minze | dill
1 | Knoblauchzehe | knoblauch=4
1 Dose | Kichererbsen (240 g, als Salat dazu) | kichererbsen
"""+S%4,["Zucchini und Kartoffeln grob raspeln, salzen und 10 Minuten ziehen lassen. Dann in einem Tuch kräftig ausdrücken.",
"Mit Eiern, zerbröseltem Feta, Mehl, Frühlingszwiebeln und Pfeffer mischen.",
"Öl erhitzen und aus je 2 EL Masse flache Puffer von beiden Seiten 3–4 Minuten goldbraun braten.",
"Joghurt mit Kräutern, Knoblauch und Salz verrühren. Kichererbsen mit Zitrone, Salz und Kräutern als Salat anmachen und alles zusammen servieren."],
"Knusprige Gemüsepuffer mit kühlem Kräuterjoghurt – griechischer Sommer auf dem Teller.",
occ='familie')
CH['zucchinipuffer_kraeuterjoghurt']='Neu.'

R('champignonpfanne_stampf','Rahm-Champignons mit Kartoffelstampf','lunch','pfanne','h',4,15,25,"""
800 g | Champignons (oder Pilzmix) | champignons
2 | Schalotten | schalotte
1 EL | Butter | butter
200 ml | Gemüsebrühe | gemuesebruehe
150 g | Schmand | schmand
2 EL | Petersilie | petersilie
1 kg | mehligkochende Kartoffeln | kartoffel=1000
200 ml | Milch | milch
2 | Eier, als Spiegelei (nach Wunsch) | ei=110
"""+S%5,["Kartoffeln schälen, in Salzwasser 20 Minuten weich kochen und mit warmer Milch zu Stampf verarbeiten.",
"Pilze putzen und vierteln. Butter in einer großen Pfanne stark erhitzen und die Pilze portionsweise braun braten – nicht zu viele auf einmal, sonst ziehen sie Wasser.",
"Schalotten zugeben, mit Brühe ablöschen und Schmand einrühren. 3 Minuten einköcheln, abschmecken.",
"Mit Petersilie bestreuen und mit Stampf (und nach Wunsch Spiegelei) servieren."],
"Pilze in cremiger Rahmsauce – das schmeckt nach Waldspaziergang im Oktober.",
occ='feierabend')
CH['champignonpfanne_stampf']='Ersetzt 6 Vorlage-Pilz-Varianten.'

R('tofu_suess_sauer','Tofu süß-sauer mit Paprika und Ananas','lunch','pfanne','g',4,15,20,"""
400 g | Naturtofu | tofu
2 EL | Speisestärke | mehl
2 | Paprika | paprika
1 | Zwiebel | zwiebel
250 g | Ananas | ananas
2 EL | Rapsöl | rapsoel
3 EL | Sojasauce | sojasauce
2 EL | Apfelessig | apfelessig
2 EL | Ketchup | ketchup
1 EL | Ahornsirup | ahornsirup
200 g | Basmatireis | reis
"""+S%1,["Reis garen. Tofu ausdrücken, würfeln, mit 1 EL Stärke mischen und in 1 EL Öl knusprig braten, herausnehmen.",
"Paprika, Zwiebel und Ananas in Stücke schneiden und im restlichen Öl 4 Minuten braten.",
"Sojasauce, Essig, Ketchup, Ahornsirup, restliche Stärke und 100 ml Wasser verrühren, zugeben und aufkochen, bis die Sauce glänzt.",
"Tofu unterheben und mit Reis servieren."],
"Süß, sauer, knusprig – der Asia-Klassiker, ganz pflanzlich.",
occ='feierabend,familie',kid=True)
CH['tofu_suess_sauer']='Neu (vegan).'

R('haehnchen_fajitas','Hähnchen-Fajitas mit Paprika und Avocado','lunch','pfanne','g',4,15,15,"""
500 g | Hähnchenbrust | haehnchenbrust
3 | Paprika (bunt) | paprika
1 | rote Zwiebel | rote_zwiebel
2 EL | Rapsöl | rapsoel
2 TL | Paprikapulver, Kreuzkümmel, Oregano | gewuerz
8 | kleine Weizentortillas | tortilla=320
1 | Avocado | avocado
150 g | Naturjoghurt | joghurt
1 | Limette | limette
1 Handvoll | Koriander | koriander
"""+S%4,["Hähnchen und Paprika in Streifen, Zwiebel in Spalten schneiden. Hähnchen mit Gewürzen, 1 EL Öl und Salz mischen.",
"Eine große Pfanne stark erhitzen und das Hähnchen 5 Minuten braten, bis es durch ist, herausnehmen. Paprika und Zwiebel im restlichen Öl 5 Minuten braten.",
"Avocado mit Limettensaft und Salz zerdrücken. Tortillas kurz in der trockenen Pfanne erwärmen.",
"Alles auf den Tisch stellen – alle füllen ihre Fajitas selbst mit Hähnchen, Gemüse, Avocado, Joghurt und Koriander."],
"Mitten auf den Tisch, alle rollen selbst: brutzelndes Hähnchen, bunte Paprika und Guacamole.",
occ='familie,gaeste',kid=True,tip="Für Low Carb statt Tortillas große Salatblätter nehmen.")
CH['haehnchen_fajitas']='Neu.'

R('rindersteak_bohnen_kraeuterbutter','Rindersteak mit grünen Bohnen und Kräuterbutter','lunch','pfanne','s',2,10,15,"""
2 | Rindersteaks (je 180 g) | rindersteak=360
400 g | grüne Bohnen | gruene_bohnen
150 g | Kirschtomaten | kirschtomaten=150
1 EL | Rapsöl | rapsoel
30 g | weiche Butter | butter
1 EL | Kräuter (Petersilie, Schnittlauch) | petersilie
1 | Knoblauchzehe | knoblauch=4
"""+S%2,["Steaks rechtzeitig aus dem Kühlschrank nehmen, damit sie Zimmertemperatur haben. Butter mit Kräutern, gepresstem Knoblauch und Salz verrühren und kalt stellen.",
"Bohnen putzen und in Salzwasser 6–7 Minuten bissfest garen, abschrecken.",
"Pfanne sehr stark erhitzen, Steaks mit Öl einreiben und je Seite 2–3 Minuten braten (medium). 5 Minuten ruhen lassen, dann salzen und pfeffern.",
"Bohnen und Tomaten in der Steakpfanne 2 Minuten schwenken und mit Steak und Kräuterbutter servieren."],
"Ein perfekt gebratenes Steak mit Kräuterbutter – schlicht, kohlenhydratarm, großartig.",
occ='gaeste,wochenende')
CH['rindersteak_bohnen_kraeuterbutter']='Neu (Low Carb).'

R('haehnchen_brokkoli_kraeuterbutter','Hähnchenbrust mit Brokkoli und Kräuterbutter','lunch','pfanne','g',2,10,20,"""
2 | Hähnchenbrustfilets (je 160 g) | haehnchenbrust=320
500 g | Brokkoli | brokkoli
1 EL | Rapsöl | rapsoel
25 g | Butter | butter
1 EL | Kräuter, gehackt | petersilie
1 | Zitrone | zitrone=20
30 g | Mandeln, gehobelt | mandeln
"""+S%2,["Hähnchen flach klopfen (gleichmäßig dick gart es saftiger), salzen und pfeffern.",
"Öl erhitzen und das Hähnchen je Seite 5–6 Minuten bei mittlerer Hitze goldbraun braten, bis es durchgegart ist. 3 Minuten ruhen lassen.",
"Brokkoli in Röschen 4–5 Minuten dämpfen. Mandeln ohne Fett rösten.",
"Butter in der Pfanne schmelzen, Kräuter und Zitronensaft zugeben und über Hähnchen und Brokkoli geben. Mit Mandeln bestreuen."],
"Saftig gebratenes Hähnchen mit Zitronen-Kräuterbutter – einfach, kohlenhydratarm, sättigend.",
occ='feierabend,schnell')
CH['haehnchen_brokkoli_kraeuterbutter']='Neu (Low Carb).'

R('senfeier_kartoffelpueree','Senfeier mit Kartoffelpüree','lunch','pfanne','g',4,15,25,"""
8 | Eier | ei
1 kg | mehligkochende Kartoffeln | kartoffel=1000
250 ml | Milch | milch
1 EL | Butter | butter
1 | Zwiebel | zwiebel
3 EL | Mehl | mehl
400 ml | Gemüsebrühe | gemuesebruehe
100 ml | Milch für die Sauce | milch
3 EL | mittelscharfer Senf | senf
1 Bund | Schnittlauch | schnittlauch
300 g | Erbsen oder Rote-Bete-Salat dazu | erbsen
"""+S%5,["Kartoffeln schälen, in Salzwasser 20 Minuten kochen und mit warmer Milch und der Hälfte der Butter zu Püree stampfen.",
"Eier 8 Minuten kochen, abschrecken und pellen.",
"Zwiebel fein würfeln und in restlicher Butter glasig dünsten. Mehl einrühren, mit Brühe und Milch ablöschen und 5 Minuten unter Rühren köcheln. Senf einrühren (nicht mehr kochen), abschmecken.",
"Eier halbieren, in die Sauce legen und mit Püree, Erbsen und Schnittlauch servieren."],
"Omas Senfeier: cremige Senfsauce, halbierte Eier und Püree – günstig und gemütlich.",
occ='familie',kid=True)
CH['senfeier_kartoffelpueree']='Neu (Klassiker).'
