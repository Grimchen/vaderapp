import { useCallback, useEffect, useRef, useState } from 'react';
import { getWeather, hasApiKey, MESSAGES } from './api.js';
import { loadFavorites, loadLastPlace, saveFavorites, saveLastPlace } from './storage.js';
import SearchBar from './components/SearchBar.jsx';
import Favorites from './components/Favorites.jsx';
import CurrentWeather from './components/CurrentWeather.jsx';
import Forecast from './components/Forecast.jsx';

export default function App() {
  const [favorites, setFavorites] = useState(loadFavorites);
  const [place, setPlace] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const latestRequest = useRef(0);

  const showPlace = useCallback(async (newPlace) => {
    const requestId = ++latestRequest.current;
    setPlace(newPlace);
    setWeather(null);
    setError('');
    setLoading(true);
    saveLastPlace(newPlace);
    try {
      const result = await getWeather(newPlace);
      if (requestId === latestRequest.current) setWeather(result);
    } catch (err) {
      if (requestId === latestRequest.current) setError(err.message);
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }, []);

  // Vid start: visa senast valda ort, annars första favoriten.
  useEffect(() => {
    if (!hasApiKey()) return;
    const start = loadLastPlace() ?? loadFavorites()[0];
    if (start) showPlace(start);
  }, [showPlace]);

  useEffect(() => saveFavorites(favorites), [favorites]);

  const isFavorite = place ? favorites.some((f) => f.id === place.id) : false;

  const toggleFavorite = () => {
    if (!place) return;
    setFavorites((current) =>
      current.some((f) => f.id === place.id)
        ? current.filter((f) => f.id !== place.id)
        : [...current, place],
    );
  };

  const removeFavorite = (id) => setFavorites((current) => current.filter((f) => f.id !== id));

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          <span aria-hidden="true">☀️</span> Solkollen
        </h1>
        <p className="tagline">Vädret just nu och fem dagar framåt</p>
      </header>

      <main>
        {!hasApiKey() && (
          <div className="message message-error" role="alert">
            <strong>API-nyckel saknas</strong>
            <p>{MESSAGES.noKey}</p>
          </div>
        )}

        <SearchBar onSelect={showPlace} />

        <Favorites
          favorites={favorites}
          activeId={place?.id}
          onSelect={showPlace}
          onRemove={removeFavorite}
        />

        {error && (
          <div className="message message-error" role="alert">
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <p className="message message-info" role="status">
            Hämtar väder för {place.name} …
          </p>
        )}

        {weather && place && (
          <>
            <CurrentWeather
              place={place}
              weather={weather.current}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />
            <Forecast days={weather.days} />
          </>
        )}

        {!place && !error && hasApiKey() && (
          <p className="message message-info">Sök efter en ort för att se vädret.</p>
        )}
      </main>

      <footer className="app-footer">
        Väderdata från{' '}
        <a href="https://openweathermap.org/" target="_blank" rel="noreferrer">
          OpenWeatherMap
        </a>
      </footer>
    </div>
  );
}
