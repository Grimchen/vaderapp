import { capitalize, placeLabel, temp, weatherEmoji } from '../format.js';

export default function CurrentWeather({ place, weather, isFavorite, onToggleFavorite }) {
  return (
    <section className="card current" aria-label="Vädret just nu">
      <div className="current-header">
        <div className="current-place">
          <h2>{place.name}</h2>
          <p className="muted">{placeLabel({ ...place, name: '' }) || ' '}</p>
        </div>
        <button
          type="button"
          className={`favorite-toggle ${isFavorite ? 'is-favorite' : ''}`}
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Ta bort ${place.name} från favoriter` : `Spara ${place.name} som favorit`}
          title={isFavorite ? 'Ta bort favorit' : 'Spara som favorit'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>

      <div className="current-main">
        <span className="current-icon" aria-hidden="true">
          {weatherEmoji(weather.icon)}
        </span>
        <div>
          <p className="current-temp">{temp(weather.temp)}</p>
          <p className="current-desc">{capitalize(weather.description)}</p>
        </div>
      </div>

      <dl className="current-details">
        <div>
          <dt>Känns som</dt>
          <dd>{temp(weather.feelsLike)}</dd>
        </div>
        <div>
          <dt>Vind</dt>
          <dd>{Math.round(weather.wind)} m/s</dd>
        </div>
        <div>
          <dt>Luftfuktighet</dt>
          <dd>{weather.humidity} %</dd>
        </div>
      </dl>
    </section>
  );
}
