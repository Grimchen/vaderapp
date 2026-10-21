// Hjälpfunktioner för visning.
const ICONS = {
  '01d': '☀️',
  '01n': '🌙',
  '02': '🌤️',
  '03': '⛅',
  '04': '☁️',
  '09': '🌧️',
  '10': '🌦️',
  '11': '⛈️',
  '13': '❄️',
  '50': '🌫️',
};

export const weatherEmoji = (icon) => ICONS[icon] ?? ICONS[icon.slice(0, 2)] ?? '🌡️';

export const temp = (value) => `${Math.round(value)}°`;

export const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export const placeLabel = (place) =>
  [place.name, place.state, place.country].filter(Boolean).join(', ');

export function dayLabel(key) {
  const date = new Date(`${key}T12:00:00Z`);
  const weekday = date.toLocaleDateString('sv-SE', { weekday: 'long', timeZone: 'UTC' });
  const dayMonth = date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short', timeZone: 'UTC' });
  return { weekday: capitalize(weekday), date: dayMonth };
}
