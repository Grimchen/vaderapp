import { capitalize, dayLabel, temp, weatherEmoji } from '../format.js';

export default function Forecast({ days }) {
  return (
    <section className="forecast" aria-label="Prognos för kommande dagar">
      <h2 className="section-title">Kommande dagar</h2>
      <ol className="forecast-list">
        {days.map((day) => {
          const label = dayLabel(day.key);
          return (
            <li key={day.key} className="card forecast-day">
              <div className="forecast-date">
                <span className="forecast-weekday">{label.weekday}</span>
                <span className="muted">{label.date}</span>
              </div>
              <span className="forecast-icon" role="img" aria-label={day.description}>
                {weatherEmoji(day.icon)}
              </span>
              <span className="forecast-desc">{capitalize(day.description)}</span>
              <span className="forecast-temps">
                <span className="temp-max" aria-label={`Högst ${temp(day.max)}`}>{temp(day.max)}</span>
                <span className="temp-min" aria-label={`Lägst ${temp(day.min)}`}>{temp(day.min)}</span>
              </span>
              {day.pop >= 0.2 && (
                <span className="forecast-pop" title="Risk för nederbörd">
                  <span aria-hidden="true">💧</span> {Math.round(day.pop * 100)} %
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
