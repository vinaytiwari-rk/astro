import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS, SAMPLE_CHARTS } from '../../data/cities';
import { computeHouseWisePredictions } from '../predictions/houseWise';

describe('House-wise evidence synthesis', () => {
  it('returns twelve individualized house readings with their actual chart evidence', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeHouseWisePredictions(chart);
    expect(report).toHaveLength(12);
    expect(report.map((item) => item.houseNumber)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    for (const house of report) {
      expect(house.lordPlanet).toBeTruthy();
      expect(house.lordReadingEn.length).toBeGreaterThan(20);
      expect(house.synthesisEn).toContain('This reading combines');
      expect(house.synthesisHi).toContain('यह निष्कर्ष');
      expect(house.synthesisEn).not.toMatch(/will flourish effortlessly|will develop steadily and bring fruitful milestones|Promises in .* will/i);
      expect(house.synthesisHi).not.toMatch(/स्वतः सिद्ध सफलता|गारंटी देता है/);
    }
  });
});
