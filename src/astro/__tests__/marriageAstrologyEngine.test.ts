import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS, SAMPLE_CHARTS } from '../../data/cities';
import { computeComprehensiveMarriageReport } from '../predictions/marriageAstrologyEngine';
import { computeDeepLifePredictions } from '../predictions/deepLifePredictions';

describe('Classical Marriage, Stree Jataka & Double Transit Engine', () => {
  it('computes valid marriage nature and Nadi house scores across sample charts', () => {
    for (const sample of SAMPLE_CHARTS.slice(0, 3)) {
      const chart = calculateChart(sample, DEFAULT_SETTINGS);
      const report = computeComprehensiveMarriageReport(chart);

      expect(report.marriageNature).toBeDefined();
      expect(report.marriageNatureHi).toBeDefined();
      expect(['Arranged / Family-Sanctioned', 'Love / Romantic Union', 'Love-cum-Arranged', 'Delayed / Obstacle-Prone', 'Special Karmic Bond']).toContain(report.marriageNature);

      const nadi = report.nadiSignifications;
      expect(nadi.marriageScore).toBeGreaterThan(0);
      expect(nadi.loveScore).toBeGreaterThanOrEqual(0);
      expect(nadi.negationScore).toBeGreaterThanOrEqual(0);
      expect(nadi.marriageHouses).toEqual([2, 7, 11]);
      expect(nadi.loveHouses).toEqual([5, 8, 12]);
      expect(nadi.negationHouses).toEqual([1, 6, 10]);
      expect(nadi.verdictEn.length).toBeGreaterThan(30);
      expect(nadi.verdictHi.length).toBeGreaterThan(30);
    }
  });

  it('accurately derives Varahamihira Stree Jataka Trimsamsha and Saubhagya 8th house', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeComprehensiveMarriageReport(chart);
    const stree = report.streeJataka;

    expect(['Mars', 'Saturn', 'Jupiter', 'Mercury', 'Venus']).toContain(stree.trimsamshaLord);
    expect(stree.trimsamshaNatureEn.length).toBeGreaterThan(15);
    expect(stree.trimsamshaNatureHi.length).toBeGreaterThan(15);
    expect(stree.trimsamshaDegree).toBeGreaterThanOrEqual(0);
    expect(stree.trimsamshaDegree).toBeLessThanOrEqual(30);

    expect(['Dirgha Saumangalya (Highly Auspicious)', 'Protected', 'Sensitive (Manglik/Affliction)', 'Requires Shanti']).toContain(stree.mangalyaHouse8Status);
    expect(stree.mangalyaDetailsEn.length).toBeGreaterThan(20);
    expect(stree.mangalyaDetailsHi.length).toBeGreaterThan(20);

    expect(stree.spousePersonaEn.length).toBeGreaterThan(10);
    expect(stree.spousePersonaHi.length).toBeGreaterThan(10);
    expect(stree.spouseProfessionAndStatusEn.length).toBeGreaterThan(10);
    expect(stree.spouseProfessionAndStatusHi.length).toBeGreaterThan(10);
  });

  it('calculates Jaimini Upapada Lagna and Double Transit prime marriage window', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeComprehensiveMarriageReport(chart);
    const timing = report.timingAndDoubleTransit;

    expect(timing.upapadaLagnaSign.length).toBeGreaterThan(2);
    expect(timing.upapadaLord).toBeDefined();
    expect(timing.daraKarakaPlanet).toBeDefined();
    expect(timing.primeMarriageAgeWindowEn).toMatch(/Age \d+ to \d+ Years/);
    expect(timing.primeMarriageAgeWindowHi).toMatch(/आयु \d+ से \d+ वर्ष/);
    expect(timing.upapadaSustenanceEn.length).toBeGreaterThan(20);
    expect(timing.upapadaSustenanceHi.length).toBeGreaterThan(20);
    expect(timing.currentTimingVerdictEn.length).toBeGreaterThan(20);
    expect(timing.currentTimingVerdictHi.length).toBeGreaterThan(20);
  });

  it('provides Koota longevity alerts including Rajju Dosha and Vedha checks', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeComprehensiveMarriageReport(chart);
    const koota = report.kootaAlerts;

    expect(koota.rajjuType).toBeDefined();
    expect(typeof koota.rajjuVulnerability).toBe('boolean');
    expect(koota.rajjuExplanationEn.length).toBeGreaterThan(20);
    expect(koota.rajjuExplanationHi.length).toBeGreaterThan(20);
    expect(koota.shashtashtakaHarmonyEn.length).toBeGreaterThan(10);
    expect(koota.shashtashtakaHarmonyHi.length).toBeGreaterThan(10);
  });

  it('cites strictly classical treatises (zero modern names)', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeComprehensiveMarriageReport(chart);

    expect(report.classicalSources).toContain('Brihat Jataka Ch. 24 (Stree Jatakadhyaya)');
    expect(report.classicalSources).toContain('Brihat Samhita (Vivaaha Patalam)');
    expect(report.classicalSources).toContain('Brihat Parashara Hora Shastra (Vivaha & Upapada Adhyayas)');
    expect(report.classicalSources).toContain('Phaladeepika Ch. 10 (Stree Jataka) & Ch. 12');

    const serialized = JSON.stringify(report);
    expect(serialized).not.toMatch(/Khot|Kedar|Kedaar|Bepin|Behari|Narasimha|PVR|Taneja|Tiwari|Rao|Ojha/i);
  });

  it('prescribes authentic Vedic Katyayani and Patni Manoramam remedies', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeComprehensiveMarriageReport(chart);

    expect(report.authenticVedicRemediesEn.length).toBeGreaterThanOrEqual(3);
    expect(report.authenticVedicRemediesHi.length).toBeGreaterThanOrEqual(3);
    expect(report.authenticVedicRemediesHi.some((r) => r.includes('कात्यायनी'))).toBe(true);
    expect(report.authenticVedicRemediesHi.some((r) => r.includes('पत्नीं मनोरमां देहि'))).toBe(true);
  });

  it('integrates seamlessly with computeDeepLifePredictions in Chapter 5 (Marriage)', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const deepReport = computeDeepLifePredictions(chart);

    expect(deepReport.marriageReport).toBeDefined();
    expect(deepReport.marriageReport.marriageNature).toBeDefined();

    const marriageDomain = deepReport.domains.find((d) => d.id === 'marriage');
    expect(marriageDomain).toBeDefined();
    expect(marriageDomain?.concreteEventsEn?.some((e) => e.includes('Marriage Nature:'))).toBe(true);
    expect(marriageDomain?.concreteEventsHi?.some((e) => e.includes('विवाह स्वरूप:'))).toBe(true);
    expect(marriageDomain?.keyStrengthsEn?.some((s) => s.includes('Spouse Persona:'))).toBe(true);
    expect(marriageDomain?.keyStrengthsHi?.some((s) => s.includes('जीवनसाथी का स्वरूप:'))).toBe(true);
  });
});
