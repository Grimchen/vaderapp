export default function Favorites({ favorites, activeId, onSelect, onRemove }) {
  if (favorites.length === 0) {
    return (
      <p className="favorites-empty">
        Tryck på <span aria-hidden="true">☆</span> vid en ort för att spara den som favorit.
      </p>
    );
  }

  return (
    <section className="favorites" aria-label="Favoritorter">
      <h2 className="section-title">Favoriter</h2>
      <ul className="favorites-list">
        {favorites.map((place) => (
          <li key={place.id} className={`chip ${place.id === activeId ? 'chip-active' : ''}`}>
            <button
              type="button"
              className="chip-select"
              onClick={() => onSelect(place)}
              aria-current={place.id === activeId ? 'true' : undefined}
            >
              {place.name}
            </button>
            <button
              type="button"
              className="chip-remove"
              onClick={() => onRemove(place.id)}
              aria-label={`Ta bort ${place.name} från favoriter`}
              title="Ta bort"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
