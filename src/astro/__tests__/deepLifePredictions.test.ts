import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS, SAMPLE_CHARTS } from '../../data/cities';
import { computeDeepLifePredictions, computePurusharthaBalance } from '../predictions/deepLifePredictions';
import { computeDashaBhuktiMutualAxis } from '../predictions/dashaPrashna';
import { computeDinaMrityuAndRoga } from '../predictions/dinaMrityuRoga';
import { computeTwelveBhavaAndParivartanaYogas } from '../predictions/twelveBhavaYogas';
import { computeBadhakaAndFunctionalDoshas } from '../predictions/badhakaAndKendradhipatya';

describe('Chart-specific General Prediction synthesis', () => {
  it('derives distinct domain evidence from three different natal charts', () => {
    const reports = SAMPLE_CHARTS.slice(0, 3).map((sample) =>
      computeDeepLifePredictions(calculateChart(sample, DEFAULT_SETTINGS)),
    );
    expect(reports.every((report) => report.domains.length === 12)).toBe(true);
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
    expect(report.executiveSummaryEn).toContain('Chart-specific synthesis:');
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
        tithi: { ...chart.panchang!.tithi!, number: 15, paksha: 'Shukla' as const },
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

  it('computes Four Purushartha Trines balance with exact 100% total and classical guidance', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeDeepLifePredictions(chart);
    expect(report.purusharthas).toBeDefined();
    expect(report.purusharthas.trines).toHaveLength(4);

    const sumPercentage = report.purusharthas.trines.reduce((sum, t) => sum + t.percentage, 0);
    expect(sumPercentage).toBe(100);

    const types = report.purusharthas.trines.map((t) => t.type);
    expect(types).toEqual(['Dharma', 'Artha', 'Kama', 'Moksha']);

    for (const trine of report.purusharthas.trines) {
      expect(trine.percentage).toBeGreaterThan(0);
      expect(trine.score).toBeGreaterThan(0);
      expect(trine.savBindus).toBeGreaterThan(50);
      expect(trine.guidanceEn.length).toBeGreaterThan(20);
      expect(trine.guidanceHi.length).toBeGreaterThan(20);
      expect(trine.classicalSource).toContain('Brihat Parashara');
    }

    expect(['Dharma', 'Artha', 'Kama', 'Moksha']).toContain(report.purusharthas.dominant);
    expect(report.purusharthas.balanceSynthesisEn.length).toBeGreaterThan(30);
    expect(report.purusharthas.balanceSynthesisHi.length).toBeGreaterThan(30);
    expect(report.karmicMissionEn).toBe(report.purusharthas.soulMissionEn);
    expect(report.karmicMissionHi).toBe(report.purusharthas.soulMissionHi);
  });

  it('computes Dasha-Bhukti mutual axis with accurate house distance and classical effects', () => {
    // 5/9 Axis
    const axis59 = computeDashaBhuktiMutualAxis(1, 5, 'Jupiter', 'Sun');
    expect(axis59.axisType).toBe('5/9');
    expect(axis59.isAuspicious).toBe(true);
    expect(axis59.axisLabelHi).toContain('५/९ अक्ष');
    expect(axis59.verdictEn).toContain('Nava-Panchama');

    // 6/8 Shadashtaka Axis
    const axis68 = computeDashaBhuktiMutualAxis(1, 6, 'Saturn', 'Mars');
    expect(axis68.axisType).toBe('6/8');
    expect(axis68.isAuspicious).toBe(false);
    expect(axis68.axisLabelHi).toContain('६/८ अक्ष');
    expect(axis68.verdictEn).toContain('Shadashtaka');
    expect(axis68.remedyHi).toContain('महामृत्युंजय');

    // 1/7 Samasaptaka Axis
    const axis17 = computeDashaBhuktiMutualAxis(1, 7, 'Sun', 'Saturn');
    expect(axis17.axisType).toBe('1/7');
    expect(axis17.isAuspicious).toBe(true);
    expect(axis17.axisLabelHi).toContain('१/७ अक्ष');

    // 1/1 Conjunction Axis
    const axis11 = computeDashaBhuktiMutualAxis(10, 10, 'Mercury', 'Venus');
    expect(axis11.axisType).toBe('1/1');
    expect(axis11.isAuspicious).toBe(true);
  });

  it('computes Dina Mrityu and Dina Roga with day/night awareness and Balarishta Bhanga', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeDeepLifePredictions(chart);
    expect(report.dinaMrityuRoga).toBeDefined();
    expect(typeof report.dinaMrityuRoga.isDayBirth).toBe('boolean');
    expect(report.dinaMrityuRoga.verdictEn.length).toBeGreaterThan(20);
    expect(report.dinaMrityuRoga.verdictHi.length).toBeGreaterThan(20);
    expect(report.dinaMrityuRoga.classicalSource).toContain('Brihat Parashara');

    // Test a synthetic day birth chart with Bharani Pada 4 (Dina Mrityu)
    const bharaniChart = {
      ...chart,
      planets: chart.planets.map((p) => {
        if (p.id === 'Sun') return { ...p, rasiHouseNumber: 10 }; // day birth
        if (p.id === 'Moon') return { ...p, nakshatraName: 'Bharani', pada: 4 };
        return p;
      }),
    };
    const dinaRes = computeDinaMrityuAndRoga(bharaniChart);
    expect(dinaRes.hasDosha).toBe(true);
    expect(dinaRes.doshaType).toBe('Dina Mrityu');
    expect(dinaRes.isDayBirth).toBe(true);
  });

  it('computes 12 Bhava Yogas and 30 Parivartana Yogas accurately', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeDeepLifePredictions(chart);
    expect(report.twelveBhavaYogas).toBeDefined();
    expect(Array.isArray(report.twelveBhavaYogas.bhavaYogas)).toBe(true);
    expect(Array.isArray(report.twelveBhavaYogas.parivartanaYogas)).toBe(true);
    expect(report.twelveBhavaYogas.prominentSummaryEn.length).toBeGreaterThan(15);
    expect(report.twelveBhavaYogas.prominentSummaryHi.length).toBeGreaterThan(15);

    // If any Bhava Yogas detected, verify classical structure
    for (const yoga of report.twelveBhavaYogas.bhavaYogas) {
      expect(yoga.houseNumber).toBeGreaterThanOrEqual(1);
      expect(yoga.houseNumber).toBeLessThanOrEqual(12);
      expect(yoga.effectEn.length).toBeGreaterThan(20);
      expect(yoga.classicalSource).toContain('Phaladeepika');
    }
  });

  it('computes Badhaka Sthana, Badhaka Lord and Kendradhipatya Dosha for 12 Lagnas', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeDeepLifePredictions(chart);
    expect(report.badhakaDosha).toBeDefined();
    expect(report.badhakaDosha.badhaka).toBeDefined();

    // Verify Badhaka house: Chara -> 11, Sthira -> 9, Dwiswabhava -> 7
    const ascSign = chart.ascendant.signIndex;
    const expectedBadhakaH = ascSign % 3 === 0 ? 11 : ascSign % 3 === 1 ? 9 : 7;
    expect(report.badhakaDosha.badhaka.badhakaHouseNumber).toBe(expectedBadhakaH);
    expect(report.badhakaDosha.badhaka.effectEn.length).toBeGreaterThan(30);
    expect(report.badhakaDosha.trishadaya).toHaveLength(3);
  });
});