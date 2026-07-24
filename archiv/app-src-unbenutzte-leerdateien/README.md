# Archivierte Leerdateien aus app/src

Diese Dateien lagen seit dem allerersten Commit (14.03.2026) leer in `app/src/`
und werden von keinem einzigen Screen oder Modul importiert (per Codesuche
bestaetigt, 19.07.2026). Sie wurden hierher kopiert statt geloescht, damit
nichts verloren geht, falls die urspruengliche Idee dahinter spaeter doch
aufgegriffen wird:

- infra/db/migrations.js – geplante SQLite-Migrationen (aktuell nutzt die App
  ausschliesslich localStorage ueber sqlite.js, keine echte SQLite-Datenbank)
- infra/db/repositories/entitlementRepo.js – geplantes Repository fuer
  Premium-Status, tatsaechlich liegt die Logik direkt in domain/entitlements.js
- domain/measurementService.js – geplanter Service-Layer, tatsaechlich rufen
  die Screens measurementRepo direkt auf
- ui/components/chartView.js – geplante wiederverwendbare Chart-Komponente,
  tatsaechlich hat trend.js seine eigene drawChart()-Funktion
- data/loadData.js, foodsByNutrient.json, insightsByNutrient.json,
  sources.json – geplante separate Datenmodelle; tatsaechlich stecken Foods,
  Tipps und Funktionsbeschreibungen direkt in den Eintraegen von
  biomarkerCatalog.json

Die Originale bleiben unveraendert in app/src liegen.
