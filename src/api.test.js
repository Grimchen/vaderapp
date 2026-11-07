import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

async function loadApi(key = 'test-nyckel') {
  vi.resetModules();
  vi.stubEnv('VITE_OPENWEATHER_API_KEY', key);
  return import('./api.js');
}

const respond = (body, status = 200) =>
  Promise.resolve({ ok: status >= 200 && status < 300, status, json: () => Promise.resolve(body) });

describe('api', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it('ger ett tydligt fel när API-nyckeln saknas', async () => {
    const api = await loadApi('');
    expect(api.hasApiKey()).toBe(false);
    await expect(api.searchPlaces('Lund')).rejects.toMatchObject({ code: 'no-key' });
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([
    [401, 'bad-key'],
    [404, 'not-found'],
    [429, 'too-many'],
    [500, 'unknown'],
  ])('översätter HTTP %i till felkod %s', async (status, code) => {
    const api = await loadApi();
    fetch.mockReturnValue(respond({}, status));
    await expect(api.searchPlaces('Lund')).rejects.toMatchObject({ code });
  });

  it('ger nätverksfel när fetch misslyckas', async () => {
    const api = await loadApi();
    fetch.mockRejectedValue(new TypeError('offline'));
    await expect(api.searchPlaces('Lund')).rejects.toMatchObject({ code: 'network' });
  });

  it('slår ihop dubbletter av orter och använder svenskt namn', async () => {
    const api = await loadApi();
    fetch.mockReturnValue(
      respond([
        { name: 'Gothenburg', local_names: { sv: 'Göteborg' }, country: 'SE', state: 'Västra Götaland', lat: 57.7, lon: 11.97 },
        { name: 'Göteborg', country: 'SE', state: 'Västra Götaland', lat: 57.71, lon: 11.98 },
        { name: 'Lund', country: 'SE', lat: 55.7, lon: 13.19 },
      ]),
    );
    const places = await api.searchPlaces('Göteborg');
    expect(places.map((p) => p.name)).toEqual(['Göteborg', 'Lund']);
    expect(places[0].id).toBe('57.700,11.970');
  });

  it('sammanställer aktuellt väder och en post per dag i prognosen', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-07T10:00:00Z'));
    const api = await loadApi();

    const at = (iso, min, max, pop, icon) => ({
      dt: Date.parse(iso) / 1000,
      main: { temp_min: min, temp_max: max },
      pop,
      weather: [{ icon, description: 'test' }],
    });

    fetch.mockImplementation((url) => {
      if (String(url).includes('/data/2.5/weather')) {
        return respond({
          main: { temp: 8, feels_like: 5, humidity: 70 },
          wind: { speed: 4 },
          weather: [{ icon: '04d', description: 'mulet' }],
        });
      }
      return respond({
        city: { timezone: 0 },
        list: [
          at('2026-11-07T15:00:00Z', 1, 2, 0.9, '10d'), // idag – ska hoppas över
          at('2026-11-08T06:00:00Z', 2, 4, 0.1, '04d'),
          at('2026-11-08T12:00:00Z', 5, 9, 0.6, '02d'),
          at('2026-11-09T12:00:00Z', 0, 3, 0, '01d'),
        ],
      });
    });

    const { current, days } = await api.getWeather({ lat: 55.7, lon: 13.19 });
    expect(current).toMatchObject({ temp: 8, feelsLike: 5, humidity: 70, wind: 4, icon: '04d' });
    expect(days).toHaveLength(2);
    expect(days[0]).toMatchObject({ key: '2026-11-08', min: 2, max: 9, pop: 0.6, icon: '02d' });
    expect(days[1]).toMatchObject({ key: '2026-11-09', min: 0, max: 3 });
  });
});
