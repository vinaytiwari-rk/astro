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
  CLASSICAL_PAYA_PROFILES,
  CLASSICAL_108_PADAS,
  CLASSICAL_ATMAKARAKA_PROFILES,
  getPayaProfile,
  getPadaDetail,
  getAtmakarakaProfile,
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
  it('covers all 4 Payas with real-life traits, Sade Sati armor, remedies and crystals', () => {
    const payaKeys = ['gold', 'silver', 'copper', 'iron'] as const;
    for (const key of payaKeys) {
      const p = CLASSICAL_PAYA_PROFILES[key];
      expect(p).toBeDefined();
      expect(p.nameEn.length).toBeGreaterThan(4);
      expect(p.metalEn.length).toBeGreaterThan(3);
      expect(p.governingPlanetEn.length).toBeGreaterThan(3);
      expect(p.coreBlessingEn.length).toBeGreaterThan(20);
      expect(p.realLifeManifestationEn.length).toBeGreaterThan(20);
      expect(p.vulnerabilityOrCautionEn.length).toBeGreaterThan(15);
      expect(p.sadeSatiExperienceEn.length).toBeGreaterThan(20);
      expect(p.sadeSatiBuildsEn.length).toBeGreaterThan(10);
      expect(p.remediesEn.length).toBeGreaterThanOrEqual(3);
      expect(p.crystalsEn.length).toBeGreaterThanOrEqual(2);
    }
    // Specific crystals
    expect(CLASSICAL_PAYA_PROFILES.gold.crystalsEn).toContain('Citrine');
    expect(CLASSICAL_PAYA_PROFILES.silver.crystalsEn).toContain('Moonstone');
    expect(CLASSICAL_PAYA_PROFILES.copper.crystalsEn).toContain('Carnelian');
    expect(CLASSICAL_PAYA_PROFILES.iron.crystalsEn).toContain('Black Tourmaline');
  });

  it('covers all 108 Nakshatra Padas with Elements, Purusharthas and classical Amsa names', () => {
    expect(Object.keys(CLASSICAL_108_PADAS)).toHaveLength(108);

    for (let nak = 0; nak < 27; nak++) {
      for (let p = 1; p <= 4; p++) {
        const detail = getPadaDetail(nak, p);
        expect(detail).toBeDefined();
        expect(detail.nakshatraIndex).toBe(nak);
        expect(detail.pada).toBe(p);
        expect(detail.amsaName.length).toBeGreaterThan(2);
        expect(detail.navamshaSignEn.length).toBeGreaterThanOrEqual(3);

        // Cyclic elements: Pada 1=Fire, 2=Earth, 3=Air, 4=Water
        if (p === 1) expect(detail.element).toBe('Fire');
        if (p === 2) expect(detail.element).toBe('Earth');
        if (p === 3) expect(detail.element).toBe('Air');
        if (p === 4) expect(detail.element).toBe('Water');

        // Cyclic purusharthas: Pada 1=Dharma, 2=Artha, 3=Kama, 4=Moksha
        if (p === 1) expect(detail.purushartha).toBe('Dharma');
        if (p === 2) expect(detail.purushartha).toBe('Artha');
        if (p === 3) expect(detail.purushartha).toBe('Kama');
        if (p === 4) expect(detail.purushartha).toBe('Moksha');
      }
    }

    // Check specific Somayajula Amsa names
    expect(getPadaDetail(0, 1).amsaName).toBe('Taskara');
    expect(getPadaDetail(0, 2).amsaName).toBe('Bhoga');
    expect(getPadaDetail(0, 3).amsaName).toBe('Vilakshana');
    expect(getPadaDetail(0, 4).amsaName).toBe('Dharma');
    expect(getPadaDetail(1, 1).amsaName).toBe('Nripa');
  });

  it('covers all 8 Jaimini Atmakaraka planets with archetypes, soul lessons and Karakamsa yogas', () => {
    const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu'];
    for (const pl of planets) {
      const ak = getAtmakarakaProfile(pl);
      expect(ak).toBeDefined();
      expect(ak.soulArchetypeEn.length).toBeGreaterThan(10);
      expect(ak.coreDesiresEn.length).toBeGreaterThan(15);
      expect(ak.karmicChallengeEn.length).toBeGreaterThan(15);
      expect(ak.soulLessonEn.length).toBeGreaterThan(20);
      expect(ak.karakamsaYogasEn.length).toBeGreaterThan(20);
    }
    // Specific soul lesson checks
    expect(getAtmakarakaProfile('Sun').soulLessonEn).toMatch(/humility|surrender/i);
    expect(getAtmakarakaProfile('Saturn').soulLessonEn).toMatch(/hardship|serve|duty|suffering/i);
    expect(getAtmakarakaProfile('Mars').soulLessonEn).toMatch(/defeat|patience/i);
  });

  it('evaluates Paya, 108 Pada, and Atmakaraka profile integrations in natal chart predictions', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeDeepLifePredictions(chart);

    expect(report.birthProfile.payaDetails).toBeDefined();
    expect(['gold', 'silver', 'copper', 'iron']).toContain(report.birthProfile.payaDetails?.id);

    expect(report.birthProfile.padaDetails).toBeDefined();
    expect(report.birthProfile.padaDetails?.amsaName.length).toBeGreaterThan(2);

    expect(report.birthProfile.atmakarakaProfile).toBeDefined();
    expect(report.birthProfile.atmakarakaProfile?.soulLessonEn.length).toBeGreaterThan(20);

    const payaFactor = report.birthProfile.factors.find(f => f.id === 'paya');
    expect(payaFactor?.interpretationEn).toContain('Sade Sati Armor');

    const nakPadaFactor = report.birthProfile.factors.find(f => f.id === 'nakshatra-charan');
    expect(nakPadaFactor?.interpretationEn).toContain('Amsa:');

    const akFactor = report.birthProfile.factors.find(f => f.id === 'atmakaraka');
    expect(akFactor?.interpretationEn).toContain('King of the Chart');
  });
});
