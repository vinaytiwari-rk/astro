import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS, SAMPLE_CHARTS } from '../../data/cities';
import { computeGeneralPrediction } from '../predictions/generalPrediction';

describe('Natal-only General Prediction reconstruction', () => {
  it('returns the twelve approved life domains with explicit chart evidence', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeGeneralPrediction(chart);

    expect(report.domains).toHaveLength(12);
    expect(report.domains.map((domain) => domain.id)).toEqual([
      'personality', 'education', 'career', 'wealth', 'marriage', 'children',
      'property', 'health', 'travels', 'spirituality', 'milestones', 'remedies',
    ]);
    for (const domain of report.domains) {
      expect(domain.evidence.length).toBeGreaterThan(0);
      expect(domain.synthesisEn.length).toBeGreaterThan(40);
      expect(domain.synthesisHi.length).toBeGreaterThan(40);
      expect(['complete', 'partial', 'limited']).toContain(domain.dataCompleteness);
    }
  });

  it('uses career house-lord and D10 evidence without generating timing claims', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeGeneralPrediction(chart);
    const career = report.domains.find((domain) => domain.id === 'career');

    expect(career).toBeDefined();
    expect(career!.evidence.some((item) => item.source.startsWith('House 10 lord:'))).toBe(true);
    expect(career!.evidence.some((item) => item.source.startsWith('D10 placement:'))).toBe(true);
    expect(career!.interpretationBasisEn).toContain('10th house');
    expect(career!.primaryAnchorEn).toContain('House 10 lord');
    expect('timingWindowEn' in career!).toBe(false);
    expect('concreteEventsEn' in career!).toBe(false);
    expect(report.methodEn).toContain('Dasha and transit are separate');
    expect(report.summaryEn).toContain('No Dasha');
  });

  it('produces chart-dependent evidence for different natal charts', () => {
    const reports = SAMPLE_CHARTS.slice(0, 3).map((sample) =>
      computeGeneralPrediction(calculateChart(sample, DEFAULT_SETTINGS)),
    );
    const careerEvidence = reports.map((report) =>
      report.domains.find((domain) => domain.id === 'career')!.evidence
        .map((item) => item.detailEn).join('|'),
    );
    expect(new Set(careerEvidence).size).toBeGreaterThan(1);
  });

  it('provides Hindi and English explanations without probability claims', () => {
    const report = computeGeneralPrediction(calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS));
    expect(report.titleHi).toContain('सामान्य फलादेश');
    expect(report.summaryHi).toContain('जन्मकुंडली');
    expect(report.summaryEn).not.toMatch(/\d+\s*%/);
  });
});
