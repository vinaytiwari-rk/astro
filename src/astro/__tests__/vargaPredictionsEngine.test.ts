import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS, SAMPLE_CHARTS } from '../../data/cities';
import {
  ALL_VARGA_PAGE_IDS,
  computeCompleteVargaPageData,
} from '../predictions/vargaPredictionsEngine';

describe('Varga Predictions Engine (D-1 to D-360)', () => {
  const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);

  it('contains exactly 28 sequential vargas from D1 to D360', () => {
    expect(ALL_VARGA_PAGE_IDS.length).toBe(28);
    expect(ALL_VARGA_PAGE_IDS[0]).toBe('D1');
    expect(ALL_VARGA_PAGE_IDS[1]).toBe('D2');
    expect(ALL_VARGA_PAGE_IDS[ALL_VARGA_PAGE_IDS.length - 1]).toBe('D360');
  });

  it('computes complete D-1 Lagna page with placements, strength, yuti, dasha, gochar and predictions', () => {
    const d1Data = computeCompleteVargaPageData(chart, 'D1');
    expect(d1Data.vargaId).toBe('D1');
    expect(d1Data.divisionNumber).toBe(1);
    expect(d1Data.placements.length).toBeGreaterThanOrEqual(10); // Asc + 9 planets
    expect(d1Data.strength.score).toBeGreaterThan(0);
    expect(d1Data.dashaAlignment.mdLord).toBeTruthy();
    expect(d1Data.prediction.verdictHi).toBeTruthy();
    expect(d1Data.prediction.detailedAnalysisHi.length).toBeGreaterThan(0);
    expect(d1Data.prediction.conditionalBranchesHi.length).toBeGreaterThan(0);
    expect(d1Data.prediction.remediesHi.length).toBeGreaterThan(0);
  });

  it('computes complete D-9 Navamsha page with marital and dharma predictions', () => {
    const d9Data = computeCompleteVargaPageData(chart, 'D9');
    expect(d9Data.vargaId).toBe('D9');
    expect(d9Data.divisionNumber).toBe(9);
    expect(d9Data.prediction.classicalSource).toContain('नवांश');
    expect(d9Data.prediction.shlokaRef).toBeTruthy();
    expect(d9Data.prediction.verdictEn).toContain('Navamsha');
  });

  it('computes higher vargas like D-150 Nadiamsha and D-360 Bhagamsha-Kala with micro predictions', () => {
    const d150Data = computeCompleteVargaPageData(chart, 'D150');
    expect(d150Data.vargaId).toBe('D150');
    expect(d150Data.divisionNumber).toBe(150);
    expect(d150Data.prediction.classicalSource).toContain('देवकेरलम्');

    const d360Data = computeCompleteVargaPageData(chart, 'D360');
    expect(d360Data.vargaId).toBe('D360');
    expect(d360Data.divisionNumber).toBe(360);
    expect(d360Data.prediction.verdictHi).toContain('D-360');
  });
});
