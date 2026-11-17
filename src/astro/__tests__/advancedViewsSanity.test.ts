import { describe, it, expect } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS } from '../../data/cities';
import { DEFAULT_USER_PROFILE } from '../../App';
import { computeMedicalAstrology } from '../medicalAstrology';
import { computeLalKitabFull } from '../lalKitabFull';
import { computeKPEnterprise } from '../kpEnterprise';
import { computeVarshaphala } from '../varshaphala';
import { computeJaimini } from '../jaimini';
import { computeFullLalKitabReport } from '../lalKitabExtended';
import { computeSarvatobhadraChakra, computeKotaChakra, computeKurmaChakra } from '../specialChakras';
import { computeSudarshanaChakra, computeAdvancedDashas } from '../advancedDashas';
import { computeYoginiDasha } from '../dasha';
import { computeCharaDasha } from '../jaimini';
import { findAuspiciousMuhurtas } from '../muhurtaFinder';
import { computePrashnaKP } from '../prashnaKP';
import { computeComprehensiveNadiReport } from '../nadiAstrology';
import { computeBhriguChakraAndNadiAmsas } from '../predictions/bhriguChakraPaddhati';
import { computeTajikaAndKeralaPrashna } from '../prashnaTajika';
import { computeFinancialAstrology } from '../financialAstrology';
import { computeSamudrikaShastra } from '../samudrikaShastra';
import { computeTransitCalendar365 } from '../transitCalendar365';
import { resolveUtcFromBirth } from '../time';

describe('Advanced Views and Calculation Engines Sanity Test', () => {
  const chart = calculateChart(DEFAULT_USER_PROFILE, DEFAULT_SETTINGS);

  it('runs all calculation engines without crashing', () => {
    // 1. Medical Astrology
    const med = computeMedicalAstrology(chart);
    expect(med).toBeDefined();

    // 2. Lal Kitab Full
    const lk = computeLalKitabFull(chart);
    expect(lk).toBeDefined();

    // 3. KP Enterprise
    const kp = computeKPEnterprise(chart);
    expect(kp).toBeDefined();

    // 4. Varshaphala
    const varsha = computeVarshaphala(chart, 2026);
    expect(varsha).toBeDefined();
    expect(varsha.munthaHouse).toBeGreaterThanOrEqual(1);

    // 5. Jaimini
    const jaimini = computeJaimini(chart);
    expect(jaimini).toBeDefined();

    // 6. Full Lal Kitab Report
    const flk = computeFullLalKitabReport(chart, 2026);
    expect(flk).toBeDefined();

    // 7. Special Chakras
    const sbc = computeSarvatobhadraChakra(chart);
    expect(sbc).toBeDefined();
    const kota = computeKotaChakra(chart);
    expect(kota).toBeDefined();
    const kurma = computeKurmaChakra(chart);
    expect(kurma).toBeDefined();

    // 8. Sudarshana Chakra
    const sudarshana = computeSudarshanaChakra(chart, 2026);
    expect(sudarshana).toBeDefined();

    // 9. Dashas
    const birthMs = resolveUtcFromBirth(
      chart.input.date,
      chart.input.time,
      chart.input.timezone,
      chart.input.utcOffsetMinutes
    ).utcMs;
    expect(Number.isNaN(birthMs)).toBe(false);

    const moon = chart.planets.find((p) => p.id === 'Moon') || chart.ascendant;
    const yogini = computeYoginiDasha(moon.longitude, birthMs, chart.settings.dashaYearType);
    expect(yogini.length).toBeGreaterThan(0);

    const chara = computeCharaDasha(chart);
    expect(chara.length).toBeGreaterThan(0);

    const advDasha = computeAdvancedDashas(chart);
    expect(advDasha.ashtottari.length).toBeGreaterThan(0);

    // 10. Muhurta & Prashna & Nadi
    const muhurta = findAuspiciousMuhurtas({
      purpose: 'marriage',
      startDate: '2026-11-18',
      daysToScan: 15,
      latitude: chart.input.latitude,
      longitude: chart.input.longitude,
      timezone: chart.input.timezone,
    });
    expect(muhurta).toBeDefined();

    const prashna = computePrashnaKP(chart, 108, 'job_career');
    expect(prashna).toBeDefined();

    const nadi = computeComprehensiveNadiReport(chart);
    expect(nadi).toBeDefined();

    const bcp = computeBhriguChakraAndNadiAmsas(chart);
    expect(bcp).toBeDefined();

    const tajikaPrashna = computeTajikaAndKeralaPrashna(chart, 'career_job');
    expect(tajikaPrashna).toBeDefined();

    // 11. Financial, Samudrika & Transit Calendar
    const fin = computeFinancialAstrology(chart);
    expect(fin).toBeDefined();

    const sam = computeSamudrikaShastra(chart);
    expect(sam).toBeDefined();

    const tc = computeTransitCalendar365(chart, 2026);
    expect(tc).toBeDefined();
  });
});
