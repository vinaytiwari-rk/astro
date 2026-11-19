import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS, SAMPLE_CHARTS } from '../../data/cities';
import { computeDeepLifePredictions } from '../predictions/deepLifePredictions';

describe('Chart-specific General Prediction synthesis', () => {
  it('derives distinct domain evidence from three different natal charts', () => {
    const reports = SAMPLE_CHARTS.slice(0, 3).map((sample) =>
      computeDeepLifePredictions(calculateChart(sample, DEFAULT_SETTINGS)),
    );
    expect(reports.every((report) => report.domains.length === 6)).toBe(true);
    for (const report of reports) {
      for (const domain of report.domains) {
        expect(domain.astrologicalFactorsEn.length).toBeGreaterThan(80);
        expect(domain.summaryEn).toMatch(/indications/);
        expect(domain.predictionEn.length).toBeGreaterThan(40);
        expect(domain.predictionHi.length).toBeGreaterThan(40);
        expect(domain.keyStrengthsEn.length).toBeGreaterThan(0);
        expect(domain.watchoutsEn.length).toBeGreaterThan(0);
      }
    }
    expect(reports.some((report) => report.domains.some((domain) =>
      domain.astrologicalFactorsEn.includes('functional roles:'),
    ))).toBe(true);
    expect(reports.some((report) => report.domains.some((domain) =>
      domain.astrologicalFactorsHi.includes('कार्यात्मक स्वामित्व'),
    ))).toBe(true);
    expect(reports.every((report) => report.domains.every((domain) =>
      domain.astrologicalFactorsEn.includes('house-lord functional roles:'),
    ))).toBe(true);
    const careerEvidence = reports.map((report) =>
      report.domains.find((domain) => domain.id === 'career')!.astrologicalFactorsEn,
    );
    expect(new Set(careerEvidence).size).toBeGreaterThan(1);
  });

  it('does not describe the internal evidence index as a probability', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeDeepLifePredictions(chart);
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
    const report = computeDeepLifePredictions(nonStrongChart);
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
    );
    const sunRelatedDomains = report.domains.filter((domain) =>
      domain.astrologicalFactorsEn.includes('Test Raja Yoga'),
    );
    expect(sunRelatedDomains.length).toBeGreaterThan(0);
    expect(sunRelatedDomains.some((domain) =>
      domain.keyStrengthsEn.some((item) => item.includes('Test Raja Yoga')),
    )).toBe(true);
  });


  it('includes chart-detected classical yogas in General Prediction and domain evidence', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeDeepLifePredictions(chart);
    expect(Array.isArray(report.classicalYogas)).toBe(true);
    for (const yoga of report.classicalYogas) {
      expect(yoga.name.length).toBeGreaterThan(0);
      expect(['Supreme', 'Strong', 'Moderate', 'Present']).toContain(yoga.strength);
    }
    const linked = report.domains.some((domain) =>
      domain.astrologicalFactorsEn.includes('Related yogas:') &&
      report.classicalYogas.some((yoga) => domain.astrologicalFactorsEn.includes(yoga.name)),
    );
    if (report.classicalYogas.length > 0) expect(linked).toBe(true);
  });

  it('provides an interpretation for every birth factor, including Thursday and Purnima examples', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeDeepLifePredictions(chart);
    expect(report.birthProfile.factors.every((factor) =>
      factor.interpretationEn.length > 30 && factor.interpretationHi.length > 30,
    )).toBe(true);

    const thursdayPurnimaChart = {
      ...chart,
      panchang: {
        ...chart.panchang!,
        vara: { ...chart.panchang!.vara!, lord: 'Jupiter' as const },
        tithi: { ...chart.panchang!.tithi!, number: 15, paksha: 'Shukla' },
      },
    };
    const tailored = computeDeepLifePredictions(thursdayPurnimaChart);
    expect(tailored.birthProfile.factors.find((factor) => factor.id === 'weekday')?.interpretationHi)
      .toContain('गुरुवार');
    expect(tailored.birthProfile.factors.find((factor) => factor.id === 'tithi')?.interpretationHi)
      .toContain('पूर्णिमा');
  });

  it('includes all requested birth Panchang and Avakhada factors in General Prediction', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeDeepLifePredictions(chart);
    const ids = report.birthProfile.factors.map((factor) => factor.id);
    expect(ids).toEqual([
      'weekday', 'tithi', 'paksha', 'maas', 'ritu', 'prahar', 'karana',
      'surya-yoga', 'varna', 'vashya', 'yoni', 'gana', 'nadi', 'nadi-pad',
      'tattva', 'paya', 'naam-akshar', 'nakshatra-charan', 'atmakaraka', 'ishta-dev',
    ]);
    expect(report.birthProfile.factors).toHaveLength(20);
    expect(report.birthProfile.factors.find((factor) => factor.id === 'atmakaraka')?.valueEn).not.toBe('Not available');
    expect(report.birthProfile.factors.find((factor) => factor.id === 'ishta-dev')?.valueEn).not.toBe('Not available');
    expect(report.executiveSummaryHi).toContain('जन्म का आधार');
    expect(report.executiveSummaryEn).toContain('Birth foundation');
  });

});
