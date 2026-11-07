import { useEffect, useState } from 'react';
import { hasApiKey } from '../api.js';
import { getStockholmWeather } from '../stockholm.js';
import { capitalize, dayLabel, temp, weatherEmoji } from '../format.js';

export default function StockholmWeather() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!hasApiKey()) return undefined;
    let cancelled = false;
    getStockholmWeather()
      .then((result) => !cancelled && setWeather(result))
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="card stockholm" aria-label="Vädret i Stockholm">
      <h2 className="stockholm-title">Stockholm</h2>

      {error && <p className="muted" role="alert">{error}</p>}
      {!weather && !error && hasApiKey() && (
        <p className="muted" role="status">Hämtar väder …</p>
      )}

      {weather && (
        <ul className="stockholm-days">
          <li className="stockholm-day is-today">
            <span className="stockholm-weekday">Idag</span>
            <span
              className="stockholm-icon"
              role="img"
              aria-label={weather.current.description}
            >
              {weatherEmoji(weather.current.icon)}
            </span>
            <span className="stockholm-temp">{temp(weather.current.temp)}</span>
            <span className="muted stockholm-desc">{capitalize(weather.current.description)}</span>
          </li>
          {weather.days.map((day) => (
            <li key={day.key} className="stockholm-day">
              <span className="stockholm-weekday">{dayLabel(day.key).weekday.slice(0, 3)}</span>
              <span className="stockholm-icon" role="img" aria-label={day.description}>
                {weatherEmoji(day.icon)}
              </span>
              <span className="stockholm-temp">
                <span className="temp-max" aria-label={`Högst ${temp(day.max)}`}>{temp(day.max)}</span>{' '}
                <span className="temp-min" aria-label={`Lägst ${temp(day.min)}`}>{temp(day.min)}</span>
              </span>
              <span className="muted stockholm-desc">{capitalize(day.description)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
