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
    expect(mars.rolesEn.some((role) => role.includes('Trikona lord'))).toBe(true);
    expect(mars.rolesEn.some((role) => role.includes('Kendra lord'))).toBe(true);
    expect(mars.noteEn).toContain('not a standalone benefic/malefic label');
  });

  it('does not assign classical house ownership to outer planets by type', () => {
    const saturn = getFunctionalLordship('Saturn', 3);
    expect(saturn.ownedHouses).toEqual([7, 8]);
  });
});
