import { describe, it, expect } from 'vitest';
import { calculateChart } from '../calculator';
import { computeHolisticRemedies } from '../holisticRemedies';
import { computeSambhavitFalkathan } from '../predictions/sambhavitFalkathan';
import { DEFAULT_SETTINGS, SAMPLE_CHARTS } from '../../data/cities';

describe('AV Astro Vibe — Holistic Remedies & Classical Prediction Rigor', () => {
  const swamiChart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);

  it('computes complete holistic remedies with all 8 modules and prescription slip', () => {
    const report = computeHolisticRemedies(swamiChart, 'all', 'all');

    expect(report.herbalRoots).toBeDefined();
    expect(report.herbalRoots.length).toBe(9);
    // At least one herbal root must be recommended based on Mahadasha or Lagna
    const recommendedRoots = report.herbalRoots.filter((r) => r.isRecommended);
    expect(recommendedRoots.length).toBeGreaterThanOrEqual(1);

    expect(report.colorTherapy).toBeDefined();
    expect(report.colorTherapy.favorableColorsHi.length).toBeGreaterThan(0);
    expect(report.colorTherapy.avoidColorsHi.length).toBeGreaterThan(0);

    expect(report.astroYoga).toBeDefined();
    expect(report.astroYoga.length).toBeGreaterThan(0);
    expect(report.astroYoga[0].asanasHi.length).toBeGreaterThan(0);

    expect(report.kitchenTotke).toBeDefined();
    expect(report.kitchenTotke.length).toBeGreaterThanOrEqual(4);

    expect(report.classicalStotras).toBeDefined();
    expect(report.classicalStotras.some((s) => s.stotraNameHi.includes('कनकधारा'))).toBe(true);
    expect(report.classicalStotras.some((s) => s.stotraNameHi.includes('दशरथकृत'))).toBe(true);

    expect(report.ishtaDevata).toBeDefined();
    expect(report.ishtaDevata.deityNameHi).toBeTruthy();
    expect(report.ishtaDevata.moolaMantra).toBeTruthy();

    expect(report.prescriptionSlip).toBeDefined();
    expect(report.prescriptionSlip.clientName).toBeTruthy();
    expect(report.prescriptionSlip.primaryRoot).toBeTruthy();
  });

  it('computes Sambhavit Falkathan with age calibration and authentic Arishta logic', () => {
    const report = computeSambhavitFalkathan(swamiChart);

    expect(report.dimensions.length).toBe(101);

    // Dimension 10 (Mother's Lifespan)
    const dim10 = report.dimensions.find((d) => d.id === 10);
    expect(dim10).toBeDefined();
    expect(dim10?.verdictHi).toBeTruthy();

    // Dimension 12 (Siblings)
    const dim12 = report.dimensions.find((d) => d.id === 12);
    expect(dim12).toBeDefined();
    expect(dim12?.verdictHi).toBeTruthy();

    // Dimension 15 (Marriage Timing)
    const dim15 = report.dimensions.find((d) => d.id === 15);
    expect(dim15).toBeDefined();
    expect(dim15?.verdictHi).toBeTruthy();

    // Dimension 20 (Children Conception)
    const dim20 = report.dimensions.find((d) => d.id === 20);
    expect(dim20).toBeDefined();
    expect(dim20?.verdictHi).toBeTruthy();

    // Dimension 21 (Children Count)
    const dim21 = report.dimensions.find((d) => d.id === 21);
    expect(dim21).toBeDefined();
    expect(dim21?.verdictHi).toBeTruthy();
  });

  it('correctly handles chart with severe 7th house delay for adult native', () => {
    // Native born in 1985 (currently 40+ years old)
    const adultInput = {
      ...SAMPLE_CHARTS[0],
      date: '1985-05-15',
    };
    const adultChart = calculateChart(adultInput, DEFAULT_SETTINGS);
    const report = computeSambhavitFalkathan(adultChart);
    const dim15 = report.dimensions.find((d) => d.id === 15);

    // For a 40-year old adult, prediction must NOT predict 24 to 28 years!
    expect(dim15?.verdictEn).not.toContain('24 to 28 years of age');
  });
});
