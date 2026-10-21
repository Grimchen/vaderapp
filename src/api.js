// Kommunikation med OpenWeatherMaps gratis-API:er.
// Nyckeln läses enbart från miljövariabeln VITE_OPENWEATHER_API_KEY (.env.local).
const API_KEY = (import.meta.env.VITE_OPENWEATHER_API_KEY ?? '').trim();
const BASE_URL = 'https://api.openweathermap.org';

export const hasApiKey = () => API_KEY.length > 0;

export class WeatherError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

export const MESSAGES = {
  noKey:
    'Ingen API-nyckel hittades. Lägg in din nyckel i filen .env.local som VITE_OPENWEATHER_API_KEY=din-nyckel och starta sedan om utvecklingsservern.',
  badKey:
    'API-nyckeln fungerar inte. Kontrollera att nyckeln i .env.local är rätt. En nyskapad nyckel kan ta upp till ett par timmar innan den aktiveras hos OpenWeatherMap.',
  network: 'Kunde inte nå OpenWeatherMap. Kontrollera din internetanslutning och försök igen.',
  tooMany: 'För många förfrågningar just nu. Vänta en stund och försök igen.',
  notFound: 'Hittade ingen ort med det namnet. Prova att stava på ett annat sätt.',
  unknown: 'Något gick fel när vädret skulle hämtas. Försök igen om en stund.',
};

async function request(path, params) {
  if (!hasApiKey()) throw new WeatherError('no-key', MESSAGES.noKey);

  const url = new URL(path, BASE_URL);
  for (const [name, value] of Object.entries(params)) {
    url.searchParams.set(name, value);
  }
  url.searchParams.set('appid', API_KEY);

  let response;
  try {
    response = await fetch(url);
  } catch {
    throw new WeatherError('network', MESSAGES.network);
  }

  if (response.status === 401) throw new WeatherError('bad-key', MESSAGES.badKey);
  if (response.status === 429) throw new WeatherError('too-many', MESSAGES.tooMany);
  if (response.status === 404) throw new WeatherError('not-found', MESSAGES.notFound);
  if (!response.ok) throw new WeatherError('unknown', MESSAGES.unknown);

  return response.json();
}

// Unikt id för en ort, baserat på koordinaterna.
export const placeId = (place) => `${place.lat.toFixed(3)},${place.lon.toFixed(3)}`;

export async function searchPlaces(query) {
  const results = await request('/geo/1.0/direct', { q: query, limit: 5 });
  // Slå ihop träffar som ser likadana ut (samma namn, region och land);
  // den första – mest relevanta – träffen behålls.
  const seen = new Set();
  const places = [];
  for (const item of results) {
    const place = {
      name: item.local_names?.sv ?? item.name,
      state: item.state ?? '',
      country: item.country ?? '',
      lat: item.lat,
      lon: item.lon,
    };
    const key = [place.name, place.state, place.country].join('|').toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      places.push({ ...place, id: placeId(place) });
    }
  }
  return places;
}

// Lokalt datum (ÅÅÅÅ-MM-DD) och timme för en tidpunkt, givet ortens tidszonsförskjutning i sekunder.
function localParts(unixSeconds, tzOffset) {
  const date = new Date((unixSeconds + tzOffset) * 1000);
  return { key: date.toISOString().slice(0, 10), hour: date.getUTCHours() };
}

// Prognosen kommer i 3-timmarssteg; slå ihop till en post per dag.
function toDays(forecast) {
  const tz = forecast.city.timezone;
  const today = localParts(Date.now() / 1000, tz).key;
  const days = new Map();

  for (const item of forecast.list) {
    const { key, hour } = localParts(item.dt, tz);
    if (key === today) continue;

    let day = days.get(key);
    if (!day) {
      day = { key, min: Infinity, max: -Infinity, pop: 0, middayItem: item, middayDistance: Infinity };
      days.set(key, day);
    }
    day.min = Math.min(day.min, item.main.temp_min);
    day.max = Math.max(day.max, item.main.temp_max);
    day.pop = Math.max(day.pop, item.pop ?? 0);

    const distance = Math.abs(hour - 13);
    if (distance < day.middayDistance) {
      day.middayDistance = distance;
      day.middayItem = item;
    }
  }

  return [...days.values()].slice(0, 5).map((day) => ({
    key: day.key,
    min: day.min,
    max: day.max,
    pop: day.pop,
    icon: day.middayItem.weather[0].icon,
    description: day.middayItem.weather[0].description,
  }));
}

export async function getWeather(place) {
  const params = { lat: place.lat, lon: place.lon, units: 'metric', lang: 'sv' };
  const [current, forecast] = await Promise.all([
    request('/data/2.5/weather', params),
    request('/data/2.5/forecast', params),
  ]);

  return {
    current: {
      temp: current.main.temp,
      feelsLike: current.main.feels_like,
      humidity: current.main.humidity,
      wind: current.wind.speed,
      icon: current.weather[0].icon,
      description: current.weather[0].description,
    },
    days: toDays(forecast),
  };
}
