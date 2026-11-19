import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS, SAMPLE_CHARTS } from '../../data/cities';
import { computeDeepLifePredictions } from '../predictions/deepLifePredictions';

describe('Chart-specific General Prediction synthesis', () => {
  it('derives distinct domain evidence from three different natal charts', () => {
    const reports = SAMPLE_CHARTS.slice(0, 3).map((sample) =>
      computeDeepLifePredictions(calculateChart(sample, DEFAULT_SETTINGS), Date.UTC(2026, 10, 19)),
    );
    expect(reports.every((report) => report.domains.length === 6)).toBe(true);
    for (const report of reports) {
      for (const domain of report.domains) {
        expect(domain.astrologicalFactorsEn.length).toBeGreaterThan(80);
        expect(domain.summaryEn).toMatch(/indications/);
        expect(domain.timingEn.length).toBeGreaterThan(20);
        expect(domain.keyStrengthsEn.length).toBeGreaterThan(0);
        expect(domain.watchoutsEn.length).toBeGreaterThan(0);
      }
    }
    const careerEvidence = reports.map((report) =>
      report.domains.find((domain) => domain.id === 'career')!.astrologicalFactorsEn,
    );
    expect(new Set(careerEvidence).size).toBeGreaterThan(1);
  });

  it('does not invent dasha timing when no Vimshottari periods are supplied', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeDeepLifePredictions({ ...chart, vimshottari: [] }, Date.UTC(2026, 10, 19));
    expect(report.domains.every((domain) =>
      domain.timingEn.includes('no timing is stated'),
    )).toBe(true);
  });

  it('does not describe the internal evidence index as a probability', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeDeepLifePredictions(chart, Date.UTC(2026, 10, 19));
    expect(report.executiveSummaryEn).toContain('not a fixed life verdict');
    expect(report.executiveSummaryEn).not.toMatch(/probability|%/i);
    expect(report.domains.every((domain) => domain.score >= 25 && domain.score <= 75)).toBe(true);
  });
  it('does not count Moderate or Present yogas as supportive outcomes', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const nonStrongChart = {
      ...chart,
      yogas: chart.yogas.map((yoga) => ({ ...yoga, strength: 'Present' as const })),
    };
    const report = computeDeepLifePredictions(nonStrongChart, Date.UTC(2026, 10, 19));
    for (const domain of report.domains) {
      expect(domain.keyStrengthsEn.some((item) => item.startsWith('Related yoga:'))).toBe(false);
    }
  });

  it('counts only Strong related yogas as supportive factors', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const strongYoga = {
      name: 'Test Raja Yoga',
      category: 'Raja' as const,
      strength: 'Strong' as const,
      planets: ['Sun'],
      description: 'Synthetic test fixture',
    };
    const report = computeDeepLifePredictions(
      { ...chart, yogas: [strongYoga] },
      Date.UTC(2026, 10, 19),
    );
    const sunRelatedDomains = report.domains.filter((domain) =>
      domain.astrologicalFactorsEn.includes('Test Raja Yoga'),
    );
    expect(sunRelatedDomains.length).toBeGreaterThan(0);
    expect(sunRelatedDomains.some((domain) =>
      domain.keyStrengthsEn.some((item) => item.includes('Test Raja Yoga')),
    )).toBe(true);
  });

});
