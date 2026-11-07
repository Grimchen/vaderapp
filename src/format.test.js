import { describe, expect, it } from 'vitest';
import { capitalize, dayLabel, placeLabel, temp, weatherEmoji } from './format.js';

describe('format', () => {
  it('avrundar temperatur och lägger till gradtecken', () => {
    expect(temp(12.4)).toBe('12°');
    expect(temp(12.5)).toBe('13°');
    expect(temp(-3.6)).toBe('-4°');
  });

  it('gör första bokstaven stor', () => {
    expect(capitalize('mulet')).toBe('Mulet');
    expect(capitalize('')).toBe('');
  });

  it('bygger ortnamn och hoppar över tomma delar', () => {
    expect(placeLabel({ name: 'Malmö', state: 'Skåne', country: 'SE' })).toBe('Malmö, Skåne, SE');
    expect(placeLabel({ name: 'Stockholm', state: '', country: 'SE' })).toBe('Stockholm, SE');
  });

  it('ger veckodag och datum på svenska', () => {
    expect(dayLabel('2026-11-09')).toEqual({ weekday: 'Måndag', date: '9 nov.' });
  });

  it('ger en ikon, även för okända koder och natt-varianter', () => {
    expect(weatherEmoji('10n')).toBe(weatherEmoji('10d'));
    expect(weatherEmoji('99x')).toBeTruthy();
  });
});
