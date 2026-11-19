import { describe, expect, it } from 'vitest';
import { getFunctionalLordship } from '../predictions/functionalLordship';

describe('Ascendant-specific functional house lordship', () => {
  it('derives Taurus ascendant ownership correctly', () => {
    const venus = getFunctionalLordship('Venus', 1);
    expect(venus.ownedHouses).toEqual([1, 6]);
    expect(venus.rolesHi).toContain('लग्नेश (स्वयं एवं जीवन-शक्ति)');
    expect(venus.rolesHi).toContain('दुष्थान एवं उपचयेश (संघर्ष, सेवा एवं प्रयास)');
  });

  it('identifies a clear yogakaraka ownership profile without forcing a final nature verdict', () => {
    const mars = getFunctionalLordship('Mars', 3); // Cancer rising: Mars owns 5th and 10th.
    expect(mars.ownedHouses).toEqual([5, 10]);
    expect(mars.yogakarakaProfile).toBe(true);
    expect(mars.rolesEn.some((role) => role.includes('Yogakaraka'))).toBe(true);
    expect(mars.noteEn).toContain('not a final benefic/malefic verdict');
  });

  it('records both owned houses for a planet with dual lordship', () => {
    const saturn = getFunctionalLordship('Saturn', 3);
    expect(saturn.ownedHouses).toEqual([7, 8]);
    expect(saturn.ownsMarakaHouse).toBe(true);
    expect(saturn.ownsDusthana).toBe(true);
  });

  it('validates ownership and yogakaraka patterns for all twelve ascendants', () => {
    const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'] as const;
    const expectedYogakaraka: Record<number, string> = {
      1: 'Saturn',   // Taurus
      3: 'Mars',     // Cancer
      4: 'Mars',     // Leo
      6: 'Saturn',   // Libra
      9: 'Venus',    // Capricorn
      10: 'Venus',   // Aquarius
    };

    for (let ascendant = 0; ascendant < 12; ascendant++) {
      const profiles = planets.map((planet) => getFunctionalLordship(planet, ascendant));
      const owned = profiles.flatMap((profile) => profile.ownedHouses);
      expect(owned.sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      const yogakarakas = profiles.filter((profile) => profile.yogakarakaProfile);
      if (expectedYogakaraka[ascendant]) {
        expect(yogakarakas.map((profile) => profile.planet)).toEqual([expectedYogakaraka[ascendant]]);
      } else {
        expect(yogakarakas).toHaveLength(0);
      }
    }
  });

  it('flags traditional kendradhipati caution separately from yogakaraka ownership', () => {
    const jupiterForGemini = getFunctionalLordship('Jupiter', 2); // 7th and 10th lords.
    expect(jupiterForGemini.kendradhipatiCaution).toBe(true);
    expect(jupiterForGemini.yogakarakaProfile).toBe(false);
    const marsForCancer = getFunctionalLordship('Mars', 3);
    expect(marsForCancer.kendradhipatiCaution).toBe(false);
  });

  it('rejects invalid ascendant indexes', () => {
    expect(() => getFunctionalLordship('Mars', 12)).toThrow(RangeError);
    expect(() => getFunctionalLordship('Mars', -1)).toThrow(RangeError);
  });
});
