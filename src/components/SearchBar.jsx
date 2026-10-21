import { useState } from 'react';
import { MESSAGES, searchPlaces } from '../api.js';
import { placeLabel } from '../format.js';

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const text = query.trim();
    if (!text) return;

    setSearching(true);
    setError('');
    setResults([]);
    try {
      const places = await searchPlaces(text);
      if (places.length === 0) {
        setError(MESSAGES.notFound);
      } else if (places.length === 1) {
        choose(places[0]);
      } else {
        setResults(places);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  };

  const choose = (place) => {
    setResults([]);
    setQuery('');
    onSelect(place);
  };

  return (
    <section className="search" aria-label="Sök ort">
      <form className="search-form" onSubmit={handleSubmit} role="search">
        <label htmlFor="search-input" className="visually-hidden">
          Ort
        </label>
        <input
          id="search-input"
          type="search"
          placeholder="Sök ort, t.ex. Göteborg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          enterKeyHint="search"
        />
        <button type="submit" className="button button-primary" disabled={searching}>
          {searching ? 'Söker …' : 'Sök'}
        </button>
      </form>

      {error && (
        <p className="message message-error search-error" role="alert">
          {error}
        </p>
      )}

      {results.length > 0 && (
        <ul className="search-results" aria-label="Sökträffar">
          {results.map((place) => (
            <li key={place.id}>
              <button type="button" className="search-result" onClick={() => choose(place)}>
                <span aria-hidden="true">📍</span> {placeLabel(place)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
