import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const respond = (body) => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body) });

describe('stockholm', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('VITE_OPENWEATHER_API_KEY', 'test-nyckel');
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('har Stockholms koordinater och ett id', async () => {
    const { STOCKHOLM } = await import('./stockholm.js');
    expect(STOCKHOLM.name).toBe('Stockholm');
    expect(STOCKHOLM.lat).toBeCloseTo(59.33, 1);
    expect(STOCKHOLM.lon).toBeCloseTo(18.07, 1);
    expect(STOCKHOLM.id).toBe('59.329,18.069');
  });

  it('hämtar väder för Stockholms koordinater', async () => {
    const { getStockholmWeather } = await import('./stockholm.js');
    const current = {
      main: { temp: 5, feels_like: 3, humidity: 80 },
      wind: { speed: 4 },
      weather: [{ icon: '04d', description: 'mulet' }],
    };
    const forecast = { city: { timezone: 3600 }, list: [] };
    fetch.mockImplementation((url) => respond(String(url).includes('/forecast') ? forecast : current));

    const result = await getStockholmWeather();

    expect(result.current.temp).toBe(5);
    expect(result.days).toEqual([]);
    const urls = fetch.mock.calls.map(([url]) => new URL(url));
    expect(urls).toHaveLength(2);
    for (const url of urls) {
      expect(url.searchParams.get('lat')).toBe('59.3293');
      expect(url.searchParams.get('lon')).toBe('18.0686');
    }
  });
});
