# Solkollen ☀️

Solkollen är en enkel väderapp på svenska, byggd med React och Vite.

## Vad appen gör

- Du söker efter en ort och ser vädret just nu: temperatur, hur det känns, vind och luftfuktighet.
- Du ser prognosen för de kommande fem dagarna med högsta och lägsta temperatur och risk för nederbörd.
- Du kan spara favoritorter och snabbt byta mellan dem. Favoriterna sparas i webbläsaren (localStorage).
- Sidan fungerar lika bra på mobil som på dator.

Väderdata hämtas från [OpenWeatherMap](https://openweathermap.org/), från deras gratis-API:er för aktuellt väder, femdygnsprognos och ortsökning (Geocoding).

## Kom igång

1. Skapa ett gratiskonto på OpenWeatherMap och hämta en API-nyckel.
2. Kopiera `.env.example` till `.env.local` och fyll i din nyckel:
   ```
   VITE_OPENWEATHER_API_KEY=din-nyckel
   ```
   `.env.local` finns i `.gitignore`, så nyckeln checkas aldrig in.
3. Installera och starta:
   ```bash
   npm install
   npm run dev
   ```

Om nyckeln saknas eller inte fungerar visar appen ett meddelande om det. En nyskapad nyckel kan ta upp till ett par timmar innan den aktiveras.

## Bygga för publicering

```bash
npm run build
```

Resultatet hamnar i `dist/`. Vite är inställt med `base: './'`, så appen fungerar även från en undermapp, till exempel på GitHub Pages.

Tänk på att en nyckel som läses via `VITE_`-variabler byggs in i den publicerade JavaScript-koden och därmed kan ses av besökare. Använd därför bara en gratisnyckel.
