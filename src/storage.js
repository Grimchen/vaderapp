// Favoriter och senast visade ort sparas i webbläsarens localStorage.
const FAVORITES_KEY = 'solkollen.favoriter';
const LAST_PLACE_KEY = 'solkollen.senasteOrt';

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Lagring kan vara avstängd (t.ex. privat läge) – appen fungerar ändå.
  }
}

export const loadFavorites = () => {
  const favorites = read(FAVORITES_KEY, []);
  return Array.isArray(favorites) ? favorites : [];
};
export const saveFavorites = (favorites) => write(FAVORITES_KEY, favorites);

export const loadLastPlace = () => read(LAST_PLACE_KEY, null);
export const saveLastPlace = (place) => write(LAST_PLACE_KEY, place);
