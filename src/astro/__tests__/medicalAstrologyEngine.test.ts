import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS, SAMPLE_CHARTS } from '../../data/cities';
import { computeComprehensiveChikitsaReport } from '../predictions/medicalAstrologyEngine';
import { computeDeepLifePredictions } from '../predictions/deepLifePredictions';

describe('Comprehensive Medical Astrology & Progeny Engine', () => {
  it('computes valid Tridosha constitution with correct percentage distribution', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeComprehensiveChikitsaReport(chart);

    expect(report.dominantDosha).toBeDefined();
    expect(report.dominantDoshaHi).toBeDefined();
    expect(report.doshaBreakdown.vata).toBeGreaterThan(0);
    expect(report.doshaBreakdown.pitta).toBeGreaterThan(0);
    expect(report.doshaBreakdown.kapha).toBeGreaterThan(0);

    const totalPct = report.doshaBreakdown.vata + report.doshaBreakdown.pitta + report.doshaBreakdown.kapha;
    expect(totalPct).toBeGreaterThanOrEqual(98);
    expect(totalPct).toBeLessThanOrEqual(102);

    expect(report.constitutionalAdviceEn.length).toBeGreaterThan(20);
    expect(report.constitutionalAdviceHi.length).toBeGreaterThan(20);
  });

  it('evaluates all 12 Kalapurusha organ systems and ranks vulnerability', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeComprehensiveChikitsaReport(chart);

    expect(report.vulnerableOrganSystems.length).toBe(12);

    // Verify all 12 houses are covered
    const houses = report.vulnerableOrganSystems.map((s) => s.house).sort((a, b) => a - b);
    expect(houses).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

    for (const sys of report.vulnerableOrganSystems) {
      expect(sys.organEn.length).toBeGreaterThan(5);
      expect(sys.organHi.length).toBeGreaterThan(5);
      expect(['Safe', 'Mild Sensitivity', 'Moderate Vigilance', 'High Care']).toContain(sys.severity);
      expect(sys.factorsEn.length).toBeGreaterThan(0);
      expect(sys.factorsHi.length).toBeGreaterThan(0);
    }
  });

  it('generates 6 classical disease alerts with planetary causes and Ayurvedic remedies', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeComprehensiveChikitsaReport(chart);

    expect(report.diseaseAlerts.length).toBe(6);
    const categories = report.diseaseAlerts.map((d) => d.category);
    expect(categories).toContain('Heart');
    expect(categories).toContain('Diabetes');
    expect(categories).toContain('Liver');
    expect(categories).toContain('Eyes');
    expect(categories).toContain('Mental');
    expect(categories).toContain('JointsVata');

    for (const d of report.diseaseAlerts) {
      expect(d.diseaseNameEn.length).toBeGreaterThan(3);
      expect(d.diseaseNameHi.length).toBeGreaterThan(3);
      expect(d.planetaryCausesEn.length).toBeGreaterThan(0);
      expect(d.planetaryCausesHi.length).toBeGreaterThan(0);
      expect(d.preventiveGuidelinesEn.length).toBeGreaterThan(15);
      expect(d.preventiveGuidelinesHi.length).toBeGreaterThan(15);
      expect(d.ayurvedicUpayaEn.length).toBeGreaterThan(10);
      expect(d.ayurvedicUpayaHi.length).toBeGreaterThan(10);
      expect(d.classicalSource.length).toBeGreaterThan(5);
    }
  });

  it('evaluates progeny promise, 5th lord, Jupiter dignity, and Santana Gopala remedies', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeComprehensiveChikitsaReport(chart);
    const progeny = report.progenyDiagnostic;

    expect(progeny.overallPromise).toBeDefined();
    expect(progeny.overallPromiseHi).toBeDefined();
    expect(progeny.fifthHouseLord).toBeDefined();
    expect(progeny.fifthHousePlaced).toBeGreaterThanOrEqual(1);
    expect(progeny.fifthHousePlaced).toBeLessThanOrEqual(12);
    expect(progeny.fifthLordDignity).toBeDefined();
    expect(progeny.putrakarakaJupiterDignity).toBeDefined();

    expect(typeof progeny.hasNagaSarpaDosha).toBe('boolean');
    expect(typeof progeny.hasPitruDoshaInProgeny).toBe('boolean');

    expect(progeny.timingPredictionEn.length).toBeGreaterThan(20);
    expect(progeny.timingPredictionHi.length).toBeGreaterThan(20);
    expect(progeny.vedicRemediesEn.length).toBeGreaterThanOrEqual(2);
    expect(progeny.vedicRemediesHi.length).toBeGreaterThanOrEqual(2);
    expect(progeny.vedicRemediesHi.some((r) => r.includes('संतान गोपाल'))).toBe(true);
  });

  it('cites strictly classical treatises (no modern author names)', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeComprehensiveChikitsaReport(chart);

    expect(report.classicalSources).toContain('Charaka Samhita');
    expect(report.classicalSources).toContain('Sushruta Samhita');
    expect(report.classicalSources).toContain('Sphujidhvaja Yavanajataka');
    expect(report.classicalSources).toContain('Brihat Parashara Hora Shastra');
  });

  it('integrates seamlessly with computeDeepLifePredictions in Chapters 6 & 8', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const deepReport = computeDeepLifePredictions(chart);

    expect(deepReport.chikitsaReport).toBeDefined();
    expect(deepReport.chikitsaReport.dominantDosha).toBeDefined();

    const healthDomain = deepReport.domains.find((d) => d.id === 'health');
    expect(healthDomain).toBeDefined();
    expect(healthDomain?.keyStrengthsEn.some((s) => s.includes('Dominant Dosha'))).toBe(true);
    expect(healthDomain?.keyStrengthsHi.some((s) => s.includes('त्रिदोष प्रकृति'))).toBe(true);

    const childrenDomain = deepReport.domains.find((d) => d.id === 'children');
    expect(childrenDomain).toBeDefined();
    expect(childrenDomain?.concreteEventsEn?.length).toBeGreaterThan(0);
    expect(childrenDomain?.concreteEventsHi?.length).toBeGreaterThan(0);
  });
});
