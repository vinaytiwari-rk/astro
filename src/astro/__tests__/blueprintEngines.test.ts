import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS, SAMPLE_CHARTS } from '../../data/cities';
import {
  computeComprehensiveSensitivePoints,
  computeMrityuBhagaAnalysis,
  computeNavataraChakra,
  computePushkaraAnalysis,
} from '../specialSensitivities';
import { computeComprehensiveNadiReport } from '../nadiAstrology';
import { computeDivisionalYogas } from '../divisionalYogas';
import { computePastFutureLifeReading } from '../predictions/pastFutureLife';

describe('Astrology Blueprint Engines & Calculations', () => {
  const sample = SAMPLE_CHARTS[0];
  const chart = calculateChart(sample, DEFAULT_SETTINGS);

  it('computes classical Mrityu Bhaga fatal degrees and orb check for all 9 grahas + Asc', () => {
    const list = computeMrityuBhagaAnalysis(chart);
    expect(list.length).toBeGreaterThanOrEqual(10);
    const sunMb = list.find((m) => m.planet === 'Sun');
    expect(sunMb).toBeDefined();
    expect(sunMb?.mrityuDeg).toBeGreaterThan(0);
    expect(typeof sunMb?.diffDeg).toBe('number');
    expect(sunMb?.severity).toBeDefined();
    expect(sunMb?.recommendationEn).toBeDefined();
    expect(sunMb?.recommendationHi).toBeDefined();
  });

  it('computes Pushkara Bhaga & Pushkara Navamsha with rejuvenation power', () => {
    const list = computePushkaraAnalysis(chart);
    expect(list.length).toBeGreaterThanOrEqual(10);
    for (const item of list) {
      expect(typeof item.isPushkaraBhaga).toBe('boolean');
      expect(typeof item.isPushkaraNavamsha).toBe('boolean');
      expect(item.rejuvenationPowerEn).toBeDefined();
      expect(item.rejuvenationPowerHi).toBeDefined();
    }
  });

  it('computes 27 Nakshatras across 3 Paryayas in Navatara Chakra', () => {
    const navatara = computeNavataraChakra(chart);
    expect(navatara.length).toBe(27);
    const janmaTara = navatara.find((n) => n.taraNumber === 1 && n.paryaya === 1);
    expect(janmaTara).toBeDefined();
    expect(janmaTara?.taraNameEn).toContain('Janma');
    const vadhaTara = navatara.find((n) => n.taraNumber === 7);
    expect(vadhaTara).toBeDefined();
    expect(vadhaTara?.nature).toBe('Inauspicious');
  });

  it('computes Special Lagnas (BL, HL, GL, VGL, VL, SL, IL), Arudhas (AL-UL) & Karmic Points', () => {
    const report = computeComprehensiveSensitivePoints(chart);
    expect(report.points.length).toBeGreaterThanOrEqual(25);

    const al = report.points.find((p) => p.id === 'AL');
    const ul = report.points.find((p) => p.id === 'UL');
    const bb = report.points.find((p) => p.id === 'BB');
    const bs = report.points.find((p) => p.id === 'BS');
    const ks = report.points.find((p) => p.id === 'KS');
    const yogi = report.points.find((p) => p.id === 'YOGI');

    expect(al).toBeDefined();
    expect(ul).toBeDefined();
    expect(bb).toBeDefined();
    expect(bs).toBeDefined();
    expect(ks).toBeDefined();
    expect(yogi).toBeDefined();

    expect(report.yogiPlanetEn).toBeDefined();
    expect(report.sahaYogiPlanetEn).toBeDefined();
    expect(report.avaYogiPlanetEn).toBeDefined();
    expect(report.twentySecondDrekkanaLordEn).toBeDefined();
    expect(report.sixtyFourthNavamshaLordEn).toBeDefined();
  });

  it('computes all 6 Nadi Traditions (Agastya 14 Kandams, Kaushik, Bhrigu, Shiva, Nandi, Jeeva)', () => {
    const nadi = computeComprehensiveNadiReport(chart);
    expect(nadi.agastyaKandams.length).toBe(14);
    expect(nadi.kaushikTapas.breakthroughAge).toBeGreaterThan(20);
    expect(nadi.shivaNadi.recommendedJyotirlingaEn).toBeDefined();
    expect(nadi.nandiTrines.length).toBe(4);
    expect(nadi.jeevaSynthesis.jeevaPlanet).toBe('Jupiter');
    expect(nadi.jeevaSynthesis.karmaPlanet).toBe('Saturn');
    expect(nadi.bcpActiveHouse).toBeGreaterThanOrEqual(1);
    expect(nadi.bcpActiveHouse).toBeLessThanOrEqual(12);
  });

  it('computes Benefic and Malefic Yogas for divisional charts (D1 to D360)', () => {
    const d9Yogas = computeDivisionalYogas(chart, 'D9');
    expect(Array.isArray(d9Yogas)).toBe(true);

    const d10Yogas = computeDivisionalYogas(chart, 'D10');
    expect(Array.isArray(d10Yogas)).toBe(true);

    const d360Yogas = computeDivisionalYogas(chart, 'D360');
    expect(Array.isArray(d360Yogas)).toBe(true);
  });

  it('computes detailed structured Past Life and Future Becoming attributes', () => {
    const report = computePastFutureLifeReading(chart);
    expect(report).toBeDefined();
    if (!report) return;
    const { pastLife, futureBecoming } = report;

    // Past Life 8 explicit fields
    expect(pastLife.genderEn).toMatch(/Male|Female/);
    expect(pastLife.genderHi).toBeDefined();
    expect(pastLife.lifeTypeEn).toBeDefined();
    expect(pastLife.lifeTypeHi).toBeDefined();
    expect(pastLife.birthPlaceOrCountryEn).toBeDefined();
    expect(pastLife.birthPlaceOrCountryHi).toBeDefined();
    expect(pastLife.professionEn).toBeDefined();
    expect(pastLife.professionHi).toBeDefined();
    expect(pastLife.characterEn).toBeDefined();
    expect(pastLife.characterHi).toBeDefined();
    expect(pastLife.maritalStatusEn).toBeDefined();
    expect(pastLife.maritalStatusHi).toBeDefined();
    expect(pastLife.childrenEn).toBeDefined();
    expect(pastLife.childrenHi).toBeDefined();
    expect(pastLife.howDiedEn).toBeDefined();
    expect(pastLife.howDiedHi).toBeDefined();

    // Future Life metrics
    expect(futureBecoming.futureGatiEn).toBeDefined();
    expect(futureBecoming.futureGatiHi).toBeDefined();
    expect(futureBecoming.spiritualEvolutionIndex).toBeGreaterThanOrEqual(50);
    expect(futureBecoming.mokshaLikelihoodEn).toBeDefined();
    expect(futureBecoming.mokshaLikelihoodHi).toBeDefined();
  });
});
