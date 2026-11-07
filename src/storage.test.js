import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadFavorites, loadLastPlace, saveFavorites, saveLastPlace } from './storage.js';

function fakeStorage() {
  const data = new Map();
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
  };
}

describe('storage', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', fakeStorage());
  });

  it('ger tom lista när inga favoriter är sparade', () => {
    expect(loadFavorites()).toEqual([]);
  });

  it('sparar och läser favoriter', () => {
    const favorites = [{ id: '1,2', name: 'Lund' }];
    saveFavorites(favorites);
    expect(loadFavorites()).toEqual(favorites);
  });

  it('sparar och läser senast visade ort', () => {
    const place = { id: '1,2', name: 'Lund' };
    saveLastPlace(place);
    expect(loadLastPlace()).toEqual(place);
  });

  it('klarar trasig eller felaktig data', () => {
    localStorage.setItem('solkollen.favoriter', '{inte json');
    expect(loadFavorites()).toEqual([]);
    localStorage.setItem('solkollen.favoriter', '{"a":1}');
    expect(loadFavorites()).toEqual([]);
  });

  it('kraschar inte när lagring är avstängd', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('av');
      },
      setItem: () => {
        throw new Error('av');
      },
    });
    expect(() => saveFavorites([])).not.toThrow();
    expect(loadFavorites()).toEqual([]);
    expect(loadLastPlace()).toBeNull();
  });
});
