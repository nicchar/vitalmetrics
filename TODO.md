# WellANNI — Nächste Schritte

Zuletzt aktualisiert: Oktober 2026

---

## Nach Release 2.2 (Stand 25.10.2026)

### Für 2.2.1 vorgemerkt
- [ ] **Zyklus-Bildschirm im neuen Design:** Die Phasen-Karte oben ist noch im alten Orange-Verlauf. Auf die 2.2-Farben umstellen (Salbei/Honig, Figtree, abgerundete Karten wie auf „Heute“), Texte prüfen (du-Form, keine Anglizismen), danach einen Zyklus-Screenshot für den Store ergänzen.

### Release-Nachbereitung 2.2.0
- [ ] Prüfung in der Play Console abwarten (Produktion + Store-Eintrag eingereicht am 25.10.)
- [ ] Nach Freigabe: alte Tests beenden bzw. pausieren (Interner Test 2.0.1, Geschlossener Test „test2“ 2.0.5)
- [ ] Versions-Tag setzen: `git tag v2.2.0` und `git push origin v2.2.0`
- [ ] `npm audit` in Ruhe ansehen (5 Meldungen aus Build-Werkzeugen, nicht vor einem Release beheben)
- [ ] Preisangaben in README und dieser Datei an die Play Console angleichen (alte Angabe 2,45 €/22,99 €/Lifetime ist überholt; Ersatzpreise in der App: 19,50 €/Jahr, 1,89 €/Monat)

---

## Phase 1 — Demo testen & Feedback sammeln (aktuell)

- [ ] Neue `VitalMetrics.html` auf GitHub hochladen (Version mit Affiliate-Links & neuem Dashboard)
- [ ] Demo-Link teilen: https://nicchar.github.io/vitalmetrics/VitalMetrics.html
- [ ] Testnutzer gewinnen (Familie, Freunde, Social Media)
- [ ] Feedback sammeln und auswerten
- [ ] Wichtigste Verbesserungen aus dem Feedback umsetzen

---

## Phase 2 — App vorbereiten

- [ ] **App-Icon erstellen** (1024×1024 px, PNG)
  - Wird für beide Stores benötigt
  - Claude kann das Icon generieren
- [ ] **Splash Screen** erstellen (Ladebildschirm beim App-Start)
- [ ] **Store-Screenshots** erstellen (mind. 3 Stück für Phone-Ansicht)
- [ ] **Feedback-Funktion** in App einbauen (Button im Profil → E-Mail oder Google Form)
- [ ] **Echter In-App-Kauf** einrichten (Capacitor Purchase Plugin, ersetzt den Demo-Button)

---

## Phase 3 — Google Play Store (Android)

- [ ] **Google Play Console** Konto anlegen: https://play.google.com/console
  - Einmalige Gebühr: 25 €
  - Freischaltung dauert 1–2 Werktage
- [ ] **Android Studio** installieren (kostenlos): https://developer.android.com/studio
- [ ] **Capacitor einrichten:**
  ```
  npm install @capacitor/core @capacitor/cli
  npx cap init WellANNI com.vitalmetrics.app
  npx cap add android
  npx cap sync
  ```
- [ ] Android App Bundle (.aab) erstellen
- [ ] App im Play Store einreichen (Review: 2–7 Tage)
- [ ] **Amazon PartnerNet:** App-URL nach Veröffentlichung eintragen

---

## Phase 4 — Apple App Store (iOS)

> ⚠️ Voraussetzung: Mac-Computer erforderlich

- [ ] **Apple Developer Program** beitreten: https://developer.apple.com
  - Jährliche Gebühr: 99 USD (~92 €)
- [ ] Xcode installieren (nur auf Mac verfügbar)
- [ ] Capacitor iOS hinzufügen: `npx cap add ios`
- [ ] App im App Store Connect einreichen (Review: 1–3 Tage)

---

## Phase 5 — Wachstum & Monetarisierung

- [ ] Social Media Präsenz aufbauen (Instagram/TikTok mit Gesundheitstipps)
- [ ] Amazon PartnerNet Konto aktivieren sobald App-URL live ist
- [ ] Bewertungen im Store aktiv einsammeln
- [ ] B2B: Ernährungsberater als Zielgruppe ansprechen
- [ ] Ggf. eigene Domain kaufen (z.B. vitalmetrics.de) statt GitHub Pages

---

## Offene rechtliche Aufgaben

- [ ] Postanschrift für Impressum klären (Pflicht nach § 5 TMG)
  - Optionen: eigene Adresse · Postfach (~200 €/Jahr) · Impressum-Dienst (~20–50 €/Jahr)
- [ ] AGB erstellen (vor Store-Veröffentlichung empfohlen)

---

## Notizen

- **Amazon Tracking-ID:** vitalmetrics-21
- **GitHub Repository:** https://github.com/nicchar/vitalmetrics
- **Freie Biomarker:** Vitamin D, Vitamin B12, Eisen, Gewicht
- **Premium-Preis:** 2,45 €/Monat · 22,99 €/Jahr · 60 € Lifetime
