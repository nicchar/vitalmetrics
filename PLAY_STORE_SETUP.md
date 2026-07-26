# WellANNI — Play Store Setup Guide

Dieser Guide führt dich Schritt für Schritt von der HTML-Datei zum veröffentlichten
Android-App im Google Play Store. Das Capacitor-Projekt ist bereits eingerichtet.

---

## Übersicht: Was du brauchst

| Was | Kosten | Einmalig / Laufend |
|-----|--------|-------------------|
| Google Play Console Account | 25 USD | Einmalig |
| Android Studio | kostenlos | — |
| Node.js (v18+) | kostenlos | — |
| Java JDK 17 | kostenlos | — |
| Keystore (Signatur-Datei) | kostenlos | Einmalig erstellen |

---

## Phase 1: Entwicklungsumgebung einrichten

### 1.1 Node.js installieren
→ https://nodejs.org — Version 18 oder höher (LTS empfohlen)
Prüfen: `node --version` sollte `v18.x.x` oder höher zeigen.

### 1.2 Android Studio installieren
→ https://developer.android.com/studio
Beim ersten Start: Android SDK installieren (API Level 34 empfohlen).
Im SDK Manager prüfen: „Android SDK Build-Tools" und „Android SDK Platform-Tools" sind installiert.

### 1.3 Java JDK 17 installieren
→ https://adoptium.net (Eclipse Temurin JDK 17)
Android Studio bringt oft ein eigenes JDK mit — das reicht auch.

### 1.4 Abhängigkeiten installieren
Im Projektordner (wo package.json liegt):
```
npm install
```

---

## Phase 2: Google Play Console einrichten

### 2.1 Developer-Konto erstellen
→ https://play.google.com/console
Einmalige Registrierungsgebühr: 25 USD.
Wichtig: Echter Name und echte Adresse erforderlich (wird öffentlich angezeigt).

### 2.2 Neue App anlegen
- Play Console → „App erstellen"
- App-Name: WellANNI
- Standardsprache: Deutsch
- App-Typ: App
- Kostenlos/Bezahlt: Kostenlos (Premium läuft über In-App-Käufe)

### 2.3 In-App-Produkte anlegen (WICHTIG — vor dem ersten Build!)
Play Console → Deine App → Monetarisierung → Abonnements → „Erstellen"

Es gibt **kein Einmalkauf-Produkt mehr** (Stand Block C, Juli 2026) – nur die
beiden folgenden Abos. Der Code (storeAdapter.js) erwartet exakt diese IDs:

**Produkt 1 — Jahresabo:**
- Produkt-ID: `vitalmetrics_premium_yearly`  ← muss exakt so heißen
- Name: WellANNI Premium – Jahresabo
- Beschreibung: Verlauf & Einordnung für alle Biomarker, Rezeptempfehlungen
- Abrechnungszeitraum: Jährlich
- Preis: 19,50 EUR

**Produkt 2 — Monatsabo:**
- Produkt-ID: `vitalmetrics_premium_monthly`  ← muss exakt so heißen
- Name: WellANNI Premium – Monatsabo
- Beschreibung: Verlauf & Einordnung für alle Biomarker, monatlich kündbar
- Abrechnungszeitraum: Monatlich
- Preis: 1,89 EUR

### 2.4 Health Apps Declaration (Pflicht für jede App, auch ohne Gesundheitsbezug)

Play Console → App-Inhalte (App content) → Richtlinien → „Health Apps" → Start.
Diese Erklärung ist seit August 2024 für **jede** App auf Google Play Pflicht,
unabhängig vom Thema. Für WellANNI empfehle ich folgende Auswahl (bitte vor
dem Absenden selbst im Formular gegenprüfen, da Google die genauen Formulierungen
gelegentlich anpasst):

**Health and fitness (ankreuzen):**
- ✅ Activity and Fitness (Bewegungs-Tracking)
- ✅ Nutrition and Weight Management (Ernährungstagebuch, Wochenplan, Zielgewicht)
- ✅ Period Tracking (Zyklustracker)
- ✅ Sleep Management (neu: einfacher Schlaf-Tracker im Bereich "Hautgesundheit & Vitalität", Stand Beauty-Feature)
- ❌ Stress Management, Relaxation, Mental Acuity (Heißhunger-Journal ist kein Stress-Coaching)

**Hinweis Beauty-Feature ("Hautgesundheit & Vitalität"):** Dieser Bereich fällt inhaltlich
unter die bereits angekreuzten Kategorien Nutrition/Activity/Sleep – Google hat keine
eigene "Skin Health/Beauty"-Kategorie im Formular. Es muss also keine zusätzliche
Kategorie angekreuzt werden, nur Sleep Management kommt durch den neuen Schlaf-Tracker hinzu.

**Medical (mit Vorsicht prüfen):**
- ⚠️ Medication and Treatment Management — die Medikamenten-Wechselwirkungshinweise
  (feste Kategorie-Auswahl, keine Diagnose, kein Rezept-Feature) könnten hierunter fallen.
  Empfehlung: ankreuzen, aber NICHT unter "Disease and Condition Management" einordnen,
  da die App keine Diagnosen stellt oder Krankheiten verwaltet.
- ❌ **Medical Device Apps NICHT ankreuzen.** WellANNI ist laut eurer eigenen
  Positionierung (Wellness, kein Medizinprodukt, kein MDR-Zulassungsverfahren)
  ausdrücklich kein Medizinprodukt. Ein Ankreuzen hier würde einen Nachweis
  einer Zulassung/CE-Kennzeichnung verlangen, den es nicht gibt.

**Wichtig:** Diese Auswahl ist rechtlich bindend gegenüber Google – bitte vor dem
endgültigen Absenden noch einmal selbst durchgehen, ich kann das Formular nicht
für dich ausfüllen (kein Play-Console-Zugriff).

---

## Phase 3: App bauen

**Hinweis:** Der alte Workflow über eine einzelne `VitalMetrics.html` ist seit der
Umstellung auf `app/src` (mehrere Module, Build-Pipeline) nicht mehr aktuell.
So läuft es jetzt:

### 3.1 Tests laufen lassen (vor jedem Release-Build)
```
npm test
```

### 3.2 Versionsnummer erhöhen
```
npm run version:bump          # patch (Standard)
npm run version:bump -- minor # oder minor/major
```
Erhöht `versionCode` und `versionName` in `android/app/build.gradle` automatisch.

### 3.3 Release-Build erzeugen und mit Android synchronisieren
```
npm run build:release
```
Minifiziert `app/` nach `dist-release/app/` und synct das Ergebnis nach Android
(siehe `scripts/release.mjs` für die volle Orchestrierung inkl. `cap sync`).

### 3.4 In Android Studio öffnen
```
npx cap open android
```
Oder manuell: Android Studio → „Open" → `android/` Ordner auswählen.

### 3.5 Keystore erstellen (einmalig — sicher aufbewahren!)
In Android Studio: Build → Generate Signed Bundle/APK → Android App Bundle
→ „Create new keystore"

**Keystore-Daten sicher notieren und NIE verlieren:**
- Keystore-Datei: z.B. `vitalmetrics.keystore`
- Key-Alias: z.B. `vitalmetrics`
- Passwörter: Beide Passwörter notieren

⚠️ Wenn du den Keystore verlierst, kannst du keine Updates mehr veröffentlichen!
→ Keystore-Datei und Passwörter getrennt sichern (z.B. Passwortmanager + USB-Backup).

### 3.6 Release Bundle bauen
Build → Generate Signed Bundle/APK → Android App Bundle (.aab)
→ Release auswählen
→ Keystore-Datei und Passwörter eingeben
→ Build

Die .aab-Datei liegt dann unter: `android/app/build/outputs/bundle/release/app-release.aab`

---

## Phase 4: Play Store Listing

### 4.1 Store-Eintrag ausfüllen
Play Console → Deine App → Store-Präsenz → Haupt-Store-Eintrag

**Kurzbeschreibung (80 Zeichen):**
Vitalstoffe tracken, Ernährung planen, Wellness-Alltag im Blick behalten.

**Vollständige Beschreibung (4000 Zeichen max) – aktualisiert auf Version 2.0.0 (Juli 2026):**
```
WellANNI hilft dir, deine Vitamin- und Mineralstoffzufuhr im Blick zu behalten – für mehr Energie im Alltag.

📊 47 VITALSTOFFE IM ÜBERBLICK
Vitamine, Mineralstoffe und weitere Werte – inkl. Zufuhr-Tracking gegen DGE-Referenzwerte für 15 Nährstoffe direkt aus deinem Ernährungstagebuch.

🎯 WIE KOMME ICH AN MEINE WERTE?
Neu: Jeder Vitalstoff zeigt dir, wie du realistisch an einen Wert kommst – automatisch aus dem Ernährungstagebuch, per Heimtest ohne Arzttermin, beim Hausarzt oder nur über Speziallabore. Keine Ratespiele mehr, was ein Bluttest überhaupt abdeckt.

🥗 ERNÄHRUNG ZUERST
Über 270 Rezepte (vegetarisch, mit Fleisch/Fisch, Keto), Wochenplan mit automatischer Einkaufsliste und Unverträglichkeiten-Filter (Laktose/Gluten/Nüsse). Echte Lebensmitteldaten aus dem BLS 4.0 (Bundeslebensmittelschlüssel) plus Online-Suche über Open Food Facts.

⏱️ HEALTH TOOLS
Intervallfasten-Tracker, Blutzucker-Tagesgang, Heißhunger-Journal, Zyklustracker, Bewegungs-, Hydration- und Schlaf-Tracking sowie Wochenrückblick – alles an einem Ort.

✨ HAUTGESUNDHEIT & VITALITÄT (Premium)
Vitamin C, Zink, Biotin & Co. neu eingeordnet: welche bereits getrackten Werte eine belegte Rolle für Haut, Haare und Nägel spielen – inklusive Blutzucker, Lifestyle-Faktoren und Darm-Haut-Achse.

📄 PDF-EXPORT & BACKUP
Erstelle Berichte, die du z. B. für ein Ernährungsberatungsgespräch mitnehmen kannst. Eigene Daten jederzeit als Datei sichern oder auf ein neues Gerät übertragen.

🔒 100% LOKAL – KEIN SERVER
Alle Daten bleiben ausschließlich auf deinem Gerät. Keine Registrierung, keine Cloud, keine Datenweitergabe.

⚕️ WICHTIGER HINWEIS
WellANNI ist kein Medizinprodukt und ersetzt keine ärztliche Beratung, Diagnose oder Behandlung. Die App dient ausschließlich der persönlichen Gesundheitsbeobachtung im Wellness-Bereich.
```

**Wichtig (Health Content Policy, Stand Januar 2026):** Der Satz "WellANNI ist
kein Medizinprodukt..." muss wörtlich so oder sinngemäß in der Store-Beschreibung
stehen – Google verlangt diesen Hinweis inzwischen ausdrücklich für alle Health- und
Medical-Apps, die nicht als reguliertes Medizinprodukt deklariert sind.

### 4.2 Grafiken erstellen (Pflicht)

| Asset | Größe | Format |
|-------|-------|--------|
| App-Icon | 512 × 512 px | PNG, keine Transparenz |
| Feature-Grafik | 1024 × 500 px | PNG oder JPG |
| Screenshots (min. 2) | 320–3840 px | PNG oder JPG |
| Screenshot Handy | min. 1080 × 1920 px | — |

### 4.3 Datenschutzerklärung, Impressum und AGB (Pflicht!)
Google verlangt eine öffentlich zugängliche Datenschutzerklärung-URL im Store-Eintrag.

**Einmalige Einrichtung (GitHub Pages aktivieren):**
1. Im Repo nicchar/vitalmetrics → Settings → Pages
2. Source: „Deploy from a branch" → Branch: `main` → Ordner: `/ (root)`
3. Nach ein paar Minuten sind erreichbar:
   - `https://nicchar.github.io/vitalmetrics/impressum.html`
   - `https://nicchar.github.io/vitalmetrics/datenschutzerklaerung.html`
   - `https://nicchar.github.io/vitalmetrics/agb.html`
4. Die Datenschutz-URL in Play Console → Store-Präsenz → Haupt-Store-Eintrag → „Datenschutzerklärung" eintragen.

Diese drei URLs sind auch in der App selbst verlinkt (Onboarding-Consent-Screen
und Profil-Bildschirm) – siehe `app/src/domain/legalLinks.js`.

---

## Phase 5: App einreichen

### 5.0 Android-Entwicklerverifizierung (zeitkritisch – jetzt starten!)
Google führt ab Ende September 2026 eine verpflichtende Identitätsverifizierung
für alle Play-Console-Konten ein (offizielle Ankündigung, Google Play Console
Help, 15. Juli 2026). Ohne abgeschlossene Verifizierung können keine neuen Apps
veröffentlicht und keine Updates hochgeladen werden. Die Bearbeitung dauert laut
Google 2–4 Wochen – bei Problemen mit den Unterlagen auch länger.

**Für dein Einzelperson-Konto benötigt:**
- Amtlicher Lichtbildausweis (Personalausweis oder Reisepass)
- Aktueller Adressnachweis, nicht älter als 3 Monate (z. B. Meldebescheinigung, Nebenkostenabrechnung)
- Zwei-Faktor-Authentifizierung auf dem Google-Konto aktiviert

→ Play Console → Kontodetails → Identitätsverifizierung starten. Am besten
gleich jetzt beginnen, damit die Bearbeitungszeit nicht den Launch-Termin verzögert.

### 5.1 AAB hochladen
Play Console → Testing → Interner Test → „Neue Version erstellen"
→ Die .aab-Datei hochladen
→ Versionsnummer: 1 (versionCode), 1.0.0 (versionName)

**Tipp: Erst interner Test, dann Produktion**
1. Internes Testen (du + Tester mit Google-Konto)
2. Geschlossener Test (kleine Gruppe)
3. Offener Test (öffentlich, aber als Beta markiert)
4. Produktion

### 5.2 Inhaltsrating ausfüllen
Play Console → Richtlinien → App-Inhaltsrating → Fragebogen ausfüllen
Für WellANNI: Gesundheits-App, keine Gewalt, keine sensiblen Inhalte → Einstufung PEGI 3 (alle Altersgruppen)

### 5.3 Datenschutz-Abschnitt (Data Safety) ausfüllen
Play Console → Richtlinien → Datensicherheit

Da WellANNI alle Daten ausschließlich lokal auf dem Gerät verarbeitet und
nichts an einen Server überträgt, kannst du im Formular grundsätzlich angeben,
dass keine Daten "gesammelt" (im Google-Sinne von "off-device übertragen")
werden. Trotzdem fragt das Formular inzwischen granularer nach verarbeiteten
Datentypen als früher — bitte beim Ausfüllen direkt in der Play Console prüfen,
welche Kategorien aktuell angeboten werden, da Google das Formular öfter
anpasst. Für WellANNI grob relevant:
- Health & Fitness-Daten (Zufuhr-/Messwerte, Zyklus, Blutzucker) → als "auf dem
  Gerät verarbeitet, nicht gesammelt/übertragen" kennzeichnen, sofern das
  Formular diese Unterscheidung anbietet.
- Keine Datenweitergabe an Dritte.
- Keine Übertragung, daher auch keine "Verschlüsselung bei Übertragung" nötig.

**Wichtig:** Bitte dieses Formular gemeinsam mit mir oder zumindest mit einem
aktuellen Blick in die Play Console ausfüllen – die genauen Formulierungen und
Kategorien ändern sich regelmäßig, und eine falsche Angabe hier ist ein
Richtlinienverstoß gegenüber Google, keine Kleinigkeit.

---

## Workflow: So arbeitest du täglich

```
1. Code in app/src/ ändern
2. npm test                → Tests laufen lassen
3. npm run version:bump    → Versionsnummer erhöhen
4. npm run build:release   → Release-Build + Android-Sync
5. npx cap open android    → Android Studio öffnen
6. In Android Studio: Build → Generate Signed Bundle → .aab bauen
7. .aab in Play Console hochladen → neue Version veröffentlichen
```

---

## Wichtige Produkt-IDs (nicht ändern!)

```
Jahresabo:  vitalmetrics_premium_yearly
Monatsabo:  vitalmetrics_premium_monthly
App-ID:     com.vitalmetrics.app
```

---

## Checkliste vor dem ersten Launch

- [ ] Google Play Console Account erstellt (25 USD bezahlt)
- [ ] Android-Entwicklerverifizierung gestartet (2–4 Wochen Vorlauf einplanen!)
- [ ] Gewerbeanmeldung/Kleinunternehmer-Frage mit Steuerberater/IHK geklärt
- [ ] Beide Abo-Produkte in Play Console angelegt (exakte IDs, 19,50 €/Jahr, 1,89 €/Monat)
- [ ] Keystore erstellt und sicher gesichert
- [ ] GitHub Pages aktiviert, Impressum/Datenschutzerklärung/AGB öffentlich erreichbar
- [ ] Datenschutz-URL in Play Console eingetragen
- [ ] App-Icon (512×512) erstellt
- [ ] Feature-Grafik (1024×500) erstellt
- [ ] Mindestens 2 Screenshots erstellt
- [ ] Store-Beschreibung ausgefüllt (inkl. "kein Medizinprodukt"-Hinweis)
- [ ] Health Apps Declaration ausgefüllt (siehe Phase 2.4)
- [ ] Inhaltsrating-Fragebogen ausgefüllt
- [ ] Datensicherheits-Abschnitt (Data Safety) ausgefüllt
- [ ] Interner Test mit eigenem Google-Konto erfolgreich
- [ ] In-App-Käufe im internen Test getestet (Testcard in Play Console)

---

*Zuletzt aktualisiert für WellANNI v2.0.0 · App-ID: com.vitalmetrics.app · Stand: Juli 2026*
