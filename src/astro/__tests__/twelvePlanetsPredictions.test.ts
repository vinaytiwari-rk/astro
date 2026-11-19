import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS, SAMPLE_CHARTS } from '../../data/cities';
import { computeTwelvePlanetsPredictions } from '../predictions/twelvePlanetsPredictions';

describe('Planet-wise prediction timing integrity', () => {
  it('does not publish generic fixed-age windows for any planet', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeTwelvePlanetsPredictions(chart, Date.UTC(2026, 10, 19));
    expect(report.planets.length).toBeGreaterThanOrEqual(9);
    for (const planet of report.planets) {
      expect(planet.keyAgeWindows).toEqual([]);
      expect(planet.timingTriggersEn.length).toBeGreaterThan(20);
      expect(planet.timingTriggersHi.length).toBeGreaterThan(10);
      expect(planet.timingTriggersEn).not.toMatch(/age 40|age 42|age 36|midlife/i);
    }
  });

  it('states that timing is unavailable rather than inventing a period when dasha data is empty', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeTwelvePlanetsPredictions({ ...chart, vimshottari: [] }, Date.UTC(2026, 10, 19));
    for (const planet of report.planets) {
      expect(planet.timingTriggersEn).toMatch(/no timing is stated/i);
    }
  });
});
