import { describe, expect, it } from 'vitest';
import { CLASSICAL_YOGAS_KB, detectClassicalYogas } from '../predictions/classicalYogasKb';
import type { ChartData } from '../types';

const makeChart = (signs: number[]): ChartData => {
  const ids = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  return {
    input: { date: '1990-01-01', time: '12:00:00', lat: 23.2, lon: 77.4, timezone: 5.5 },
    utcMs: Date.UTC(1990, 0, 1, 6, 30),
    ascendant: { signIndex: 0, longitude: 0, degreeInSign: 0 },
    planets: ids.map((id, i) => ({
      id, signIndex: signs[i], houseNumber: signs[i] + 1,
      longitude: signs[i] * 30 + 10 + i / 10, degreeInSign: 10 + i / 10,
      dignity: 'Neutral', isCombust: false,
    })),
  } as unknown as ChartData;
};

describe('BPHS Chapter 35 Nabhasa yoga catalogue and detection', () => {
  it('contains all 32 distinct classical Nabhasa definitions with unique ids', () => {
    const nabhasa = CLASSICAL_YOGAS_KB.filter((y) => y.category === 'Nabhasa');
    expect(nabhasa).toHaveLength(32);
    expect(new Set(nabhasa.map((y) => y.id)).size).toBe(32);
    expect(nabhasa.map((y) => y.id)).toEqual(Array.from({ length: 32 }, (_, i) => i + 301));
  });

  it('detects Rajju from seven planets in movable signs and suppresses Sankhya', () => {
    const detected = detectClassicalYogas(makeChart([0, 3, 6, 9, 0, 3, 6]));
    const rajju = detected.find((y) => y.id === 301);
    expect(rajju).toBeTruthy();
    expect(rajju?.source).toContain('Brihat Parashara Hora Shastra, Chapter 35');
    expect(rajju?.resultHi).toContain('Rajju Yoga');
    expect(rajju?.bhangaStatus).toBeUndefined();
    expect(rajju?.bhangaReasonHi).toBeUndefined();
    expect(detected.some((y) => y.id >= 326 && y.id <= 332)).toBe(false);
  });

  it('detects Chakra only when all seven planets occupy its six alternating houses', () => {
    const detected = detectClassicalYogas(makeChart([0, 2, 4, 6, 8, 10, 0]));
    expect(detected.some((y) => y.id === 324)).toBe(true);
    expect(detected.some((y) => y.id === 323)).toBe(false);
  });
});

describe('BPHS Chapter 36 special yoga detection', () => {
  it('detects Subha when a benefic is in the 2nd house alone', () => {
    const detected = detectClassicalYogas(makeChart([0, 3, 6, 9, 1, 3, 6]));
    expect(detected.some((y) => y.id === 333)).toBe(true);
  });

  it('detects Asubha when a malefic is in the 12th house alone', () => {
    const detected = detectClassicalYogas(makeChart([0, 3, 11, 9, 0, 3, 6]));
    expect(detected.some((y) => y.id === 334)).toBe(true);
  });

  it('detects the alternative Chamara rule only from the specified houses', () => {
    const detected = detectClassicalYogas(makeChart([0, 3, 6, 9, 8, 9, 6]));
    expect(detected.some((y) => y.id === 335)).toBe(true);
  });

  it('requires the shared base conditions and one qualifying alternative for Sarada', () => {
    const detected = detectClassicalYogas(makeChart([4, 0, 2, 0, 6, 7, 4]));
    expect(detected.some((y) => y.id === 337)).toBe(true);

    const missingBase = detectClassicalYogas(makeChart([4, 0, 2, 0, 6, 7, 5]));
    expect(missingBase.some((y) => y.id === 337)).toBe(false);
  });
});
