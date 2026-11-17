import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS, SAMPLE_CHARTS } from '../../data/cities';
import { computeBhriguChakraAndNadiAmsas } from '../predictions/bhriguChakraPaddhati';
import { computeTajikaAndKeralaPrashna } from '../prashnaTajika';
import { computeTransitCalendar365 } from '../transitCalendar365';
import { computeFinancialAstrology } from '../financialAstrology';
import { computeSamudrikaShastra } from '../samudrikaShastra';

describe('Expanded Astrological Modules (BNN/BCP, Tajika Prashna, Transit Calendar, Financial & Samudrika)', () => {
  const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);

  it('computes Bhrigu Chakra Paddhati (BCP) 120-Year Wheel and Deva Keralam 150 Nadi Amsas', () => {
    const report = computeBhriguChakraAndNadiAmsas(chart);

    expect(report.timeline120Years.length).toBe(121);
    expect(report.currentAge).toBeGreaterThanOrEqual(0);
    expect(report.currentActiveHouse).toBeGreaterThanOrEqual(1);
    expect(report.currentActiveHouse).toBeLessThanOrEqual(12);

    // Verify 12-year cycle mathematics
    expect(report.timeline120Years[0].activeHouse).toBe(1);
    expect(report.timeline120Years[11].activeHouse).toBe(12);
    expect(report.timeline120Years[12].activeHouse).toBe(1);
    expect(report.timeline120Years[24].activeHouse).toBe(1);

    // Verify Deva Keralam 150 Nadi Amsa
    expect(report.ascendantNadiAmsa.amsaNumber).toBeGreaterThanOrEqual(1);
    expect(report.ascendantNadiAmsa.amsaNumber).toBeLessThanOrEqual(150);
    expect(report.ascendantNadiAmsa.amsaName.length).toBeGreaterThan(2);
    expect(report.ascendantNadiAmsa.destinyReadingHi).toMatch(/[\u0900-\u097F]/);

    expect(report.moonNadiAmsa.amsaNumber).toBeGreaterThanOrEqual(1);
    expect(report.moonNadiAmsa.amsaNumber).toBeLessThanOrEqual(150);
  });

  it('computes Tajika Neelakanthi 16-Yogas and Kerala Prashna Marga Arudha', () => {
    const tajika = computeTajikaAndKeralaPrashna(chart, 'career_job', 'Will I get promoted?');

    expect(tajika.theme).toBe('career_job');
    expect(tajika.karyeshaHouse).toBe(10);
    expect(tajika.lagnesha).toBeTruthy();
    expect(tajika.karyesha).toBeTruthy();
    expect(tajika.primaryYoga).toBeDefined();
    expect(tajika.probabilityScore).toBeGreaterThanOrEqual(0);
    expect(tajika.probabilityScore).toBeLessThanOrEqual(100);

    // Kerala Prashna Marga
    expect(tajika.keralaPrashnaMarga.arudhaSignName).toBeTruthy();
    expect(tajika.keralaPrashnaMarga.badhakaSignName).toBeTruthy();
    expect(tajika.keralaPrashnaMarga.badhakaLord).toBeTruthy();
    expect(tajika.keralaPrashnaMarga.deepaLakshanaHi).toMatch(/[\u0900-\u097F]/);
  });

  it('computes Personalized 365-Day Transit Calendar & Heatmap with Chandrashtama detection', () => {
    const calendar = computeTransitCalendar365(chart, 2026);

    expect(calendar.year).toBe(2026);
    expect(calendar.months.length).toBe(12);
    expect(calendar.annualAverageScore).toBeGreaterThanOrEqual(0);
    expect(calendar.annualAverageScore).toBeLessThanOrEqual(100);

    expect(calendar.top10AuspiciousDays.length).toBe(10);
    expect(calendar.top10AuspiciousDays[0].dailyScore).toBeGreaterThanOrEqual(
      calendar.top10AuspiciousDays[9].dailyScore
    );

    // Verify Chandrashtama logic (House 8 from Natal Moon has Chandrashtama flag)
    const allDays = calendar.months.flatMap((m) => m.days);
    const chandrashtamaDays = allDays.filter((d) => d.isChandrashtama);
    expect(chandrashtamaDays.length).toBeGreaterThan(0);
    expect(chandrashtamaDays[0].transitMoonHouseFromNatalMoon).toBe(8);
    expect(chandrashtamaDays[0].tier).toBe('Caution Needed');
  });

  it('computes Financial Astrology, Indu Lagna and Speculative Market Suitability', () => {
    const finance = computeFinancialAstrology(chart);

    expect(finance.wealthIndex).toBeGreaterThanOrEqual(0);
    expect(finance.wealthIndex).toBeLessThanOrEqual(100);

    // Indu Lagna
    expect(finance.induLagna.induLagnaSignName).toBeTruthy();
    expect(finance.induLagna.induLagnaSignIndex).toBeGreaterThanOrEqual(0);
    expect(finance.induLagna.induLagnaSignIndex).toBeLessThan(12);

    // Dhana Yogas
    expect(finance.dhanaYogas.length).toBeGreaterThanOrEqual(3);

    // Speculative Score & Sectors
    expect(finance.speculativeRiskScore).toBeGreaterThanOrEqual(0);
    expect(finance.speculativeRiskScore).toBeLessThanOrEqual(100);
    expect(finance.topSectors.length).toBeGreaterThanOrEqual(3);
  });

  it('computes Samudrika Shastra hand geometry, palm lines and sacred marks', () => {
    const samudrika = computeSamudrikaShastra(chart);

    expect(samudrika.handType).toBeTruthy();
    expect(samudrika.palmLines.length).toBeGreaterThanOrEqual(5);
    expect(samudrika.palmMounts.length).toBeGreaterThanOrEqual(6);
    expect(samudrika.sacredMarks.length).toBeGreaterThanOrEqual(3);

    // Check Life Line & Head Line
    const lifeLine = samudrika.palmLines.find((l) => l.lineId === 'life_line');
    expect(lifeLine).toBeDefined();
    expect(lifeLine?.strengthPercentage).toBeGreaterThanOrEqual(50);

    // Check Matsya Rekha (Fish Mark)
    const fishMark = samudrika.sacredMarks.find((s) => s.symbolName.includes('Matsya'));
    expect(fishMark).toBeDefined();
    expect(fishMark?.destinyFruitHi).toMatch(/[\u0900-\u097F]/);
  });
});
