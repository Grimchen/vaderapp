// Fast ort för rutan som alltid visas överst i appen.
import { getWeather, placeId } from './api.js';

const base = { name: 'Stockholm', state: '', country: 'SE', lat: 59.3293, lon: 18.0686 };
export const STOCKHOLM = { ...base, id: placeId(base) };

export const getStockholmWeather = () => getWeather(STOCKHOLM);
