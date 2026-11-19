import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS, SAMPLE_CHARTS } from '../../data/cities';
import { computeHouseWisePredictions } from '../predictions/houseWise';

describe('House-wise evidence synthesis', () => {
  it('returns twelve individualized natal predictions without Dasha or Transit mixing', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeHouseWisePredictions(chart);
    expect(report).toHaveLength(12);
    expect(report.map((item) => item.houseNumber)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    for (const house of report) {
      expect(house.lordPlanet).toBeTruthy();
      expect(house.lordFunctionalRolesEn.length).toBeGreaterThan(0);
      expect(house.lordFunctionalLordshipNoteEn).toContain('not a standalone benefic/malefic label');
      expect(house.synthesisEn).toContain('Functional lordship:');
      expect(house.lordReadingEn.length).toBeGreaterThan(20);
      expect(house.synthesisEn).toContain('This reading combines');
      expect(house.synthesisEn).not.toMatch(/Current gochar evidence|Dasha timing context/);
      expect(house.synthesisHi).not.toMatch(/वर्तमान गोचर प्रमाण|दशा-संदर्भ/);
      expect(house.predictionEn).toContain('The indications for');
      expect(house.predictionHi).toContain('के विषयों में');
      expect(house.synthesisEn).not.toMatch(/will flourish effortlessly|will develop steadily and bring fruitful milestones|Promises in .* will/i);
      expect(house.synthesisHi).not.toMatch(/स्वतः सिद्ध सफलता|गारंटी देता है/);
    }
  });

  it('produces individualized readings for the same house across different natal charts', () => {
    const reports = SAMPLE_CHARTS.slice(0, 3).map((sample) =>
      computeHouseWisePredictions(calculateChart(sample, DEFAULT_SETTINGS)),
    );
    const tenthHouseReadings = reports.map((report) => {
      const tenth = report.find((house) => house.houseNumber === 10);
      expect(tenth).toBeDefined();
      return JSON.stringify({
        sign: tenth?.signNameEn,
        lord: tenth?.lordPlanet,
        lordPlacement: tenth?.lordPlacedHouse,
        dignity: tenth?.lordDignity,
        occupants: tenth?.occupants,
        aspects: tenth?.aspectingPlanets,
        sav: tenth?.savBindus,
        prediction: tenth?.predictionEn,
        synthesis: tenth?.synthesisEn,
      });
    });
    expect(new Set(tenthHouseReadings).size).toBeGreaterThan(1);
  });
});
