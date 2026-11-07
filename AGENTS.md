# AGENTS.md

## Vad appen gör
Solkollen är en svensk väderapp. Man söker en ort och ser aktuellt väder (temperatur, känns som, vind, luftfuktighet) samt femdygnsprognos med högsta/lägsta temperatur och nederbördsrisk. Favoritorter sparas i webbläsarens localStorage.

## Teknik
- React 18 + Vite 5 (ES-moduler, JSX, ingen TypeScript)
- Data från OpenWeatherMaps gratis-API:er (aktuellt väder, 5-dagarsprognos, Geocoding)
- Publiceras på GitHub Pages via `.github/workflows/deploy.yml` (körs vid push till `main`)

## Struktur
- `src/api.js` – anrop mot OpenWeatherMap, felmeddelanden (`WeatherError`, `MESSAGES`)
- `src/App.jsx` – huvudkomponent
- `src/components/` – `SearchBar`, `CurrentWeather`, `Forecast`, `Favorites`
- `src/storage.js` – localStorage för favoriter
- `src/format.js` – formatering av värden
- `vite.config.js` – `base: './'` så att appen fungerar från undermapp

## Starta
1. Skaffa en gratis API-nyckel på openweathermap.org.
2. Skapa `.env.local` (ignoreras av git) med:
   ```
   VITE_OPENWEATHER_API_KEY=din-nyckel
   ```
3. Kör:
   ```bash
   npm install
   npm run dev      # http://localhost:5173
   ```
   Starta om dev-servern efter ändringar i `.env.local`.

## Bygga
```bash
npm run build      # resultat i dist/
npm run preview    # förhandsgranska bygget
```

## Testa
Kör automatiska tester (Vitest) med `npm test`. De körs även på varje pull request via `.github/workflows/test.yml` (jobbet `test`, krävs av rulesetet Skydda main). Det finns inget lint-skript. Verifiera dessutom manuellt:
- `npm run build` ska gå igenom utan fel.
- Kör `npm run dev` och kontrollera: sök på en ort, prognosen visas, favorit kan sparas/tas bort, och ett tydligt meddelande visas om nyckeln saknas eller är ogiltig.

## Gott att veta
- `VITE_`-variabler byggs in i den publicerade koden – använd bara en gratisnyckel.
- Nyckeln för deploy sätts som repo-secret `VITE_OPENWEATHER_API_KEY`.
- Nyskapade OpenWeatherMap-nycklar kan ta upp till ett par timmar att aktiveras.
- `.env.example` har tagits bort, trots att README fortfarande hänvisar till den.

## Arbetssätt
- Jobba alltid på en ny branch, aldrig direkt på main.
- Kör testerna innan du öppnar en pull request. De ska gå igenom (här: `npm test`).
- När du är klar: pusha branchen och öppna en pull request med gh.
