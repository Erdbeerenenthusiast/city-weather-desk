# City Weather Desk

**Student:in:** Timon Eidherr  
**Case:** LEG-01 / City Weather Desk  
**Live-URL:** https://timon.it-tools.me (siehe Abschnitt 11) · Ersatz: https://erdbeerenenthusiast.github.io/city-weather-desk/  
**Public Repository:** https://github.com/Erdbeerenenthusiast/city-weather-desk

## 1. Kurzbeschreibung

Kleine Wetterseite für Österreich: Nutzer:innen wählen auf der Startseite ein Bundesland und eine Temperatureinheit. Die Detailseite zeigt danach für eine Stadt dieses Bundeslands die wichtigsten Tageswerte der Wettervorhersage (Max-/Min-Temperatur, Niederschlagswahrscheinlichkeit). Weitere Städte lassen sich über eine Seitenleiste auswählen, beliebige österreichische Orte über ein Suchfeld.

Use Case: ein schneller Wetter-Check für die Tagesplanung, ohne eine große Wetter-App öffnen zu müssen.

## 2. Funktionsumfang

- Seite 1 (`index.html`): Startseite mit Formular – Auswahl von Bundesland und Temperatureinheit (°C/°F)
- Seite 2 (`details.html`): Bundesland als Überschrift, Städteliste als Seitenleiste, Wetterwerte der gewählten Stadt, Suchfeld für ganz Österreich
- zentrale Nutzeraktion: Klick auf eine Stadt in der Seitenleiste bzw. Suche nach einem Ort → Wetterdaten werden geladen und angezeigt, die gewählte Stadt wird hervorgehoben
- API-/JSON-Funktion: zwei aufeinanderfolgende Requests – Geocoding (Ortsname → Koordinaten, Ort/Land), danach Forecast (Tageswerte). Die Werte werden als dynamisch erzeugte HTML-Elemente ausgegeben.
- Add-on / dynamische Benutzereingabe: Ort als Texteingabe (Suchfeld); die im Formular gewählte Temperatureinheit wird als Parameter `temperature_unit` in den API-Request übernommen, die Einheiten werden aus `daily_units` der Antwort gelesen
- Lade-, Leer- und Fehlerzustände: „Loading…“, Hinweis bei leerer Eingabe, „No place found…“ bei unbekanntem Ort, Fehlermeldung bei nicht erreichbarer API, Hinweis bei fehlender oder ungültiger Region

## 3. Verwendete Technologien

- HTML
- CSS (Flexbox für das Layout)
- JavaScript (Vanilla JS, `async`/`await`)
- Browser Fetch API, `URLSearchParams`
- Open-Meteo Geocoding API und Forecast API

## 4. API

**API:** Open-Meteo (kostenlos, kein API-Key nötig)  
**Dokumentation:** https://open-meteo.com/en/docs · https://open-meteo.com/en/docs/geocoding-api  
**Endpoint(s):**

```text
https://geocoding-api.open-meteo.com/v1/search?name={Ort}&count=1&language=en&countryCode=AT

https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&temperature_unit={celsius|fahrenheit}
```

Der Ortsname wird mit `encodeURIComponent()` kodiert (Umlaute, Leerzeichen). `count=1` liefert nur den besten Treffer, `countryCode=AT` beschränkt die Suche auf Österreich. Der Forecast-Request enthält nur die drei Tageswerte, die tatsächlich angezeigt werden.

### Verwendete JSON-Felder

Geocoding:

- `results[0].latitude`, `results[0].longitude`
- `results[0].name`, `results[0].country`

Forecast:

- `daily.time[0]`
- `daily.temperature_2m_max[0]`, `daily.temperature_2m_min[0]`
- `daily.precipitation_probability_max[0]`
- `daily_units.temperature_2m_max`, `daily_units.temperature_2m_min`, `daily_units.precipitation_probability_max`

Index `[0]` ist jeweils der heutige Tag. Findet die Geocoding-API keinen Ort, fehlt das Feld `results` in der Antwort – das wird vor dem Zugriff geprüft.

## 5. Bedienung

1. Auf der Startseite ein Bundesland und eine Temperatureinheit wählen und auf **Go** klicken.
2. Die Detailseite lädt automatisch die erste Stadt (alphabetisch) des Bundeslands.
3. Eine andere Stadt in der Seitenleiste anklicken – die Werte werden neu geladen, die gewählte Stadt ist fett markiert.
4. Für beliebige Orte in Österreich: Ortsnamen ins Suchfeld eingeben und auf **Search** klicken.
5. Über **Back to Index** zurück zur Startseite.

## 6. Projektstruktur

```text
city-weather-desk/
├── index.html          Startseite mit Auswahlformular
├── details.html        Detailseite (Städteliste, Wetterwerte, Suche)
├── styles.css          gemeinsames Stylesheet beider Seiten
├── weather.js          Logik: URL-Parameter, Städteliste, API-Requests, Ausgabe, Fehlerbehandlung
├── testprotokoll.csv   Testprotokoll
├── statusmatrix.csv    Status der Requirements GEN-01 bis GEN-10
└── README.md
```

Ablauf in `weather.js`: Region und Einheit werden aus der URL gelesen (`URLSearchParams`), die Städteliste der Region wird als Buttons erzeugt, und `getWeather(cityName)` führt Geocoding → Forecast aus und erzeugt die Ausgabe. Alle Fehlerfälle der Requests landen in einem gemeinsamen `try`/`catch`.

## 7. Testing

Das vollständige Testprotokoll liegt unter `testprotokoll.csv`, die Zuordnung der Requirements zu Dateien und Tests unter `statusmatrix.csv`.

Kurzstatus:
- PASS: [Test-IDs eintragen]
- FAIL: T-06 (bewusster Defekt, siehe Known Issues)
- BLOCKED: [ggf. eintragen]

### Wichtigste getestete Risiken

- Unbekannter Ort bzw. leere Eingabe (die API liefert dann kein `results`-Feld – ohne Prüfung würde das Skript abstürzen)
- API nicht erreichbar (Request in den DevTools blockiert)
- Aufruf der Detailseite ohne bzw. mit ungültigen URL-Parametern

## 8. Known Issues

- **Bewusster Defekt:** Der Link „7-Day Forecast“ auf der Detailseite verweist auf `forecast.html`, die nicht existiert (404). Absichtlich belassen für Test T-06.
- Die Suche ist auf Österreich beschränkt (`countryCode=AT`). Ab drei Zeichen sucht die API unscharf und liefert den besten Treffer – „Paris“ ergibt z. B. „Parisdorf, Austria“. Der tatsächlich gefundene Ortsname wird angezeigt.
- Es wird nur der beste Treffer verwendet (`count=1`); bei mehrdeutigen Ortsnamen kann ein anderer Ort als gemeint geladen werden.
- Die Städtelisten pro Bundesland sind fest im Code hinterlegt, da die API keine Orte nach Bundesland auflisten kann. Wien hat nur einen Eintrag.
- Die Enter-Taste im Suchfeld startet keine Suche; die Suche läuft über den Search-Button (per Tab + Enter erreichbar).
- Es wird nur der heutige Tag angezeigt, das Datum im ISO-Format (z. B. 2026-11-20).
- Keine Optimierung für kleine Bildschirme (nicht Teil der LV).
- Open-Meteo ist nur für nicht-kommerzielle Nutzung mit weniger als 10.000 Aufrufen pro Tag freigegeben.

## 9. Git / Entwicklungsverlauf

1. Projekt-Setup mit `.gitignore` (IntelliJ-Dateien ausgeschlossen)
2. Startseite mit Auswahlformular, gemeinsames Stylesheet, erster Forecast-Request für Wien mit fixen Koordinaten und Ausgabe der Tageswerte
3. Einheiten aus `daily_units`, Korrektur der Formularfeld-Namen
4. Temperatureinheit aus dem Formular wird in den API-Request übernommen
5. Geocoding: Ortsname → Koordinaten, Anzeige von Ort/Land
6. Städteliste pro Bundesland als klickbare Seitenleiste
7. Suchfeld für beliebige Orte, Layout mit Seitenleiste und Bundesland-Überschrift, Hervorhebung der gewählten Stadt
8. Lade-, Leer- und Fehlermeldungen (leere Eingabe, unbekannter Ort, API-Fehler, fehlende Region)
9. README, Testprotokoll und Statusmatrix

Vollständige Historie: `git log --oneline`

## 10. AI Coding

<!-- Bitte prüfen und in eigenen Worten anpassen – das ist deine Erklärung. -->

Als KI-Werkzeug wurde Claude (Anthropic) verwendet, hauptsächlich als Tutor, da ich mich an ein paar Informationen der LV nicht mehr erinnern konnte:

- Erklärung der Konzepte (`fetch`, `async`/`await`, JSON-Pfade, DOM-Manipulation, Events, `URLSearchParams`, `try`/`catch`) anhand von Beispielen mit anderen Daten
- Code-Reviews nach jedem Schritt und Hilfe beim Lesen von Fehlermeldungen in der Konsole

Den Großteil von `index.html` und `weather.js` habe ich selbst geschrieben und nach jedem Schritt im Browser getestet.

Direkt von der KI übernommen:

- die Städtelisten (`citiesByRegion`) und die Namen der Bundesländer (`regionNames`)
- HTML-Struktur und CSS-Layout der Detailseite
- eine Bereinigung von `weather.js` (doppelte Schleife und falsche `ok`-Prüfung entfernt, Formatierung)
- Entwürfe für README, Testprotokoll und Statusmatrix

Ein Vorschlag der IDE-Autovervollständigung wurde verworfen, weil er die eigene Seite statt der API abgerufen hat.

Alle übernommenen Teile habe ich gelesen, nachvollzogen und getestet.

## 11. Deployment

- Vorgesehen: Upload per SFTP (FileZilla) in den Ordner `/home/www/web/student/timon` für https://timon.it-tools.me
- Stand 21.11.2026: Das Überschreiben der vorhandenen `index.html` funktioniert, das Anlegen neuer Dateien (`details.html`, `styles.css`, `weather.js`) schlägt serverseitig fehl („open for write: received failure with description 'Failure'“). Laut Kolleg:innen betrifft das auch andere Ordner; das Problem wurde an den Lektor gemeldet.
- Ersatzweise ist die Seite über GitHub Pages erreichbar: https://erdbeerenenthusiast.github.io/city-weather-desk/
- Der Kernprozess (Auswahl → Detailseite → Stadtwechsel → Suche) wurde auf der GitHub-Pages-Version erneut getestet. [nach dem Test bestätigen]
