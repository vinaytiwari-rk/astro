import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS, SAMPLE_CHARTS } from '../../data/cities';
import { computeDeepLifePredictions } from '../predictions/deepLifePredictions';
import {
  CLASSICAL_VARA_PROFILES,
  CLASSICAL_TITHI_PROFILES,
  CLASSICAL_PRITHU_YASAS_NAVAMSHA,
  CLASSICAL_LUNAR_MAAS_PROFILES,
  CLASSICAL_RITU_PROFILES,
  CLASSICAL_NITYA_YOGAS,
  CLASSICAL_KARANAS,
  CLASSICAL_NAKSHATRAS,
  CLASSICAL_GREGORIAN_MONTHS,
  getTithiVaraYoga,
  getHoraReading,
} from '../predictions/classicalPanchangaNavamshaKb';

describe('Classical Panchanga, Seasonality & Prithu Yasas Navamsha Knowledge Base', () => {
  it('covers all 7 Varas with authentic psychological and ambition profiles', () => {
    const keys = Object.keys(CLASSICAL_VARA_PROFILES);
    expect(keys).toHaveLength(7);
    for (const key of keys) {
      const p = CLASSICAL_VARA_PROFILES[key];
      expect(p.nameEn.length).toBeGreaterThan(5);
      expect(p.nameHi.length).toBeGreaterThan(5);
      expect(p.psychologicalTraitsEn.length).toBeGreaterThan(30);
      expect(p.psychologicalTraitsHi.length).toBeGreaterThan(30);
      expect(p.workAndAmbitionEn.length).toBeGreaterThan(20);
      expect(p.relationshipNatureEn.length).toBeGreaterThan(20);
    }
  });

  it('covers all 15 classical Tithis with Deities, Nitya Devis and sacred Mantras', () => {
    for (let t = 1; t <= 15; t++) {
      const tp = CLASSICAL_TITHI_PROFILES[t];
      expect(tp).toBeDefined();
      expect(['Nanda', 'Bhadra', 'Jaya', 'Rikta', 'Poorna']).toContain(tp.category);
      expect(tp.presidingDeityEn.length).toBeGreaterThan(3);
      expect(tp.governingNityaDeviEn.length).toBeGreaterThan(3);
      expect(tp.nityaDeviMantra.length).toBeGreaterThan(15);
      expect(tp.classicalResultEn.length).toBeGreaterThan(20);
      expect(tp.classicalResultHi.length).toBeGreaterThan(20);
    }
  });

  it('identifies auspicious Siddhi yogas and inauspicious Daghda/Visha/Hutashan combinations', () => {
    // Nanda (1, 6, 11) on Friday = Siddhi
    const nandaFriday = getTithiVaraYoga(1, 'Venus');
    expect(nandaFriday.isAuspicious).toBe(true);
    expect(nandaFriday.combinationTitleEn).toContain('Siddhi Yoga');

    // Sunday + 12th Tithi = Daghda
    const sunDaghda = getTithiVaraYoga(12, 'Sun');
    expect(sunDaghda.isAuspicious).toBe(false);
    expect(sunDaghda.alertType).toBe('Daghda');

    // Sunday + 4th Tithi = Visha
    const sunVisha = getTithiVaraYoga(4, 'Sun');
    expect(sunVisha.isAuspicious).toBe(false);
    expect(sunVisha.alertType).toBe('Visha');

    // Friday + 10th Tithi = Hutashan
    const friHutashan = getTithiVaraYoga(10, 'Venus');
    expect(friHutashan.isAuspicious).toBe(false);
    expect(friHutashan.alertType).toBe('Hutashan');
  });

  it('covers all 12 signs of Prithu Yasas Navamsha with critical vulnerability years', () => {
    for (let sign = 0; sign < 12; sign++) {
      const np = CLASSICAL_PRITHU_YASAS_NAVAMSHA[sign];
      expect(np).toBeDefined();
      expect(np.prithuYasasDictumEn.length).toBeGreaterThan(25);
      expect(np.prithuYasasDictumHi.length).toBeGreaterThan(25);
      expect(np.criticalVulnerabilityAges.length).toBeGreaterThan(2);
      expect(np.sageWarningEn.length).toBeGreaterThan(20);
      expect(np.sageWarningHi.length).toBeGreaterThan(20);
    }
    // Check specific years from Prithu Yasas text
    expect(CLASSICAL_PRITHU_YASAS_NAVAMSHA[0].criticalVulnerabilityAges).toEqual([12, 25, 50, 65]);
    expect(CLASSICAL_PRITHU_YASAS_NAVAMSHA[1].criticalVulnerabilityAges).toEqual([10, 22, 23, 72]);
    expect(CLASSICAL_PRITHU_YASAS_NAVAMSHA[5].criticalVulnerabilityAges).toEqual([5, 20, 60]);
  });

  it('computes enriched Navamsha Lagna and Tithi details on natal charts', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeDeepLifePredictions(chart);

    expect(report.birthProfile.navamshaLagna).toBeDefined();
    expect(report.birthProfile.navamshaLagna?.signNameEn.length).toBeGreaterThan(0);
    expect(report.birthProfile.navamshaLagna?.readingEn.length).toBeGreaterThan(30);
    expect(report.birthProfile.navamshaLagna?.vulnerabilityAges.length).toBeGreaterThan(2);

    expect(report.birthProfile.tithiDetails).toBeDefined();
    expect(report.birthProfile.tithiDetails?.governingNityaDeviEn.length).toBeGreaterThan(0);
    expect(report.birthProfile.tithiDetails?.nityaDeviMantra.length).toBeGreaterThan(15);
    expect(report.birthProfile.tithiDetails?.combinationYoga).toBeDefined();

    expect(report.birthProfile.seasonalDetails).toBeDefined();
    expect(report.birthProfile.seasonalDetails?.ayanaEn).toMatch(/Uttarayana|Dakshinayana/);
    expect(report.birthProfile.seasonalDetails?.horaEn).toMatch(/Hora/);
    expect(report.birthProfile.seasonalDetails?.gregorianMonthEn.length).toBeGreaterThan(2);
  });
});
