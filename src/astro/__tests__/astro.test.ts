import { describe, expect, it } from 'vitest';
import { computeAdvancedDashas, computeSudarshanaChakra } from '../advancedDashas';
import {
  computeAvakahadaChakra,
  computeBhavaChalitPlacements,
  computeGhatakChakra,
  getAllNakshatraSyllables,
} from '../avakahadaChalit';
import { computeAvasthasAndUpagrahas } from '../avasthasUpagrahas';
import { computeBtrSnapshot } from '../btr';
import { calculateChart } from '../calculator';
import { computeAyanamsaDeg } from '../ephemeris';
import { expandSookshmaDasha, findActiveDashaPath } from '../dasha';
import { computeKpReport, computeLiveKpRulingPlanets } from '../kp';
import { computeFullLalKitabReport, getLalKitabVarshaHouse } from '../lalKitabExtended';
import { computeAshtakoota } from '../matchmaking';
import { computeDeepMarriageMatch } from '../matchmakingDeep';
import { computeMultiYearCalendar, findAuspiciousMuhurtas } from '../muhurtaCalendar';
import { computeNameNumber, computeNumerologyReport } from '../numerology';
import { computeAnnualHinduCalendar, computeDailyChoghadiyaAndGowri } from '../panchangExtra';
import {
  computeGemstoneAndRudraksha,
  computeRashifalReport,
  findBabyNames,
} from '../rashifalBabyRudraksha';
import { computeVarshaphala } from '../varshaphala';
import {
  localizeDashaDetailHi,
  localizeMatchResultHi,
  localizePredictionReportHi,
  localizePrashnaHi,
  localizeSpecializedSuiteHi,
} from '../../i18n/hindiPredictions';
import {
  LANGUAGE_LABELS,
  trPlanet,
  trPlanetShort,
  trSign,
  trTerm,
} from '../../i18n/translations';
import { analyzeBodyDegree } from '../predictions/degreeWise';
import { computeCustomBhavatBhavam } from '../predictions/bhavatBhavam';
import { getBhavesha144Entry } from '../predictions/bhavesha144';
import { inspectCustomDrishti } from '../predictions/drishtiPredictions';
import {
  predictDashaDetail,
  analyzePrashnaChart,
  getKpHoraryLongitude,
} from '../predictions/dashaPrashna';
import { generatePredictionReport } from '../predictions/engine';
import { inspectHypotheticalNakshatra } from '../predictions/planetInNakshatra';
import { inspectHypotheticalPlanetInSign } from '../predictions/planetInSign';
import { inspectCustomYuti } from '../predictions/yutiPredictions';
import { buildSpecializedAstrologySuite } from '../predictions/specialized';
import {
  computeGocharaKakshas,
  computePanchaPakshiDay,
  evaluateAshtakavargaYogas,
  getBirthBird,
} from '../panchaPakshiAndKaksha';
import { computeDeepPanchangMuhurta } from '../panchangMuhurtaDeep';
import { DIVISIONAL_META, SEVEN_PLANETS } from '../constants';
import { formatDateDmy, parseDateInputToIso } from '../time';
import { getDivisionalSignIndex } from '../vargas';
import {
  DEFAULT_SETTINGS,
  SAMPLE_CHARTS,
  lookupTimezoneFromCoords,
  searchCities,
  searchCitiesExtended,
} from '../../data/cities';
import * as Astronomy from 'astronomy-engine';

describe('Jyotish Hora Astronomical & Vedic Engine', () => {
  it('computes accurate benchmark chart for Swami Vivekananda (1863-01-12)', () => {
    const vivek = SAMPLE_CHARTS[0];
    const chart = calculateChart(vivek, DEFAULT_SETTINGS);

    // Sagittarius (Dhanu = 8) Lagna
    expect(chart.ascendant.signIndex).toBe(8);
    expect(chart.ascendant.signName).toBe('Sagittarius');

    const sun = chart.planets.find((p) => p.id === 'Sun')!;
    const moon = chart.planets.find((p) => p.id === 'Moon')!;
    const mars = chart.planets.find((p) => p.id === 'Mars')!;
    const jupiter = chart.planets.find((p) => p.id === 'Jupiter')!;
    const saturn = chart.planets.find((p) => p.id === 'Saturn')!;
    const rahu = chart.planets.find((p) => p.id === 'Rahu')!;
    const ketu = chart.planets.find((p) => p.id === 'Ketu')!;

    expect(sun.signName).toBe('Sagittarius');
    expect(moon.signName).toBe('Virgo');
    expect(moon.nakshatraName).toBe('Hasta');
    expect(mars.signName).toBe('Aries');
    expect(jupiter.signName).toBe('Libra');
    expect(saturn.signName).toBe('Virgo');

    // Rahu & Ketu strictly 180 degrees apart
    const nodeDiff = Math.abs(((ketu.longitude - rahu.longitude + 360) % 360) - 180);
    expect(nodeDiff).toBeLessThan(1e-6);
  });

  it('orders Ayanamsa variants correctly at J2000', () => {
    const t = new Astronomy.AstroTime(new Date('2000-01-01T12:00:00Z'));
    const trop = computeAyanamsaDeg(t, 'tropical');
    const raman = computeAyanamsaDeg(t, 'raman');
    const yuk = computeAyanamsaDeg(t, 'yukteswar');
    const kp = computeAyanamsaDeg(t, 'kp');
    const chitra = computeAyanamsaDeg(t, 'true_chitra');
    const lahiri = computeAyanamsaDeg(t, 'lahiri');
    const fagan = computeAyanamsaDeg(t, 'fagan_bradley');

    expect(trop).toBe(0);
    expect(raman).toBeLessThan(yuk);
    expect(yuk).toBeLessThan(kp);
    expect(kp).toBeLessThan(chitra);
    expect(Math.abs(lahiri - chitra)).toBeLessThan(0.05);
    expect(lahiri).toBeLessThan(fagan);
  });

  it('computes all 20 Divisional Charts (D1-D60) accurately', () => {
    // Navamsa spot checks
    expect(getDivisionalSignIndex(0.5, 'D9')).toBe(0);   // Aries 0.5° -> Aries
    expect(getDivisionalSignIndex(3.5, 'D9')).toBe(1);   // Aries 3.5° -> Taurus
    expect(getDivisionalSignIndex(30.5, 'D9')).toBe(9);  // Taurus 0.5° -> Capricorn
    expect(getDivisionalSignIndex(60.5, 'D9')).toBe(6);  // Gemini 0.5° -> Libra
    expect(getDivisionalSignIndex(90.5, 'D9')).toBe(3);  // Cancer 0.5° -> Cancer

    // Dasamsa spot checks
    expect(getDivisionalSignIndex(1.0, 'D10')).toBe(0);  // Aries 1° -> Aries
    expect(getDivisionalSignIndex(31.0, 'D10')).toBe(9); // Taurus 1° -> Capricorn (9th from Taurus)

    const chart = calculateChart(SAMPLE_CHARTS[1], DEFAULT_SETTINGS);
    for (const meta of DIVISIONAL_META) {
      const dc = chart.divisionalCharts[meta.id];
      expect(dc).toBeDefined();
      expect(dc.placements.length).toBe(10); // Asc + 9 grahas
      expect(dc.lagnaSignIndex).toBeGreaterThanOrEqual(0);
      expect(dc.lagnaSignIndex).toBeLessThan(12);
    }
  });

  it('maintains contiguous Vimshottari Dasha periods & exact SAV=337 bindus', () => {
    const chart = calculateChart(SAMPLE_CHARTS[2], DEFAULT_SETTINGS);

    // Vimshottari contiguous 9 periods = 120 years
    const md = chart.vimshottari;
    expect(md.length).toBe(10);
    for (let i = 0; i < md.length - 1; i++) {
      expect(Math.abs(md[i].endMs - md[i + 1].startMs)).toBeLessThan(1);
    }
    const activeAtBirth = findActiveDashaPath(md, chart.utcMs);
    expect(activeAtBirth.length).toBe(3);
    expect(activeAtBirth[0].startMs).toBeLessThanOrEqual(chart.utcMs);
    expect(activeAtBirth[0].endMs).toBeGreaterThan(chart.utcMs);

    // Ashtakavarga exact Parashari bindu sums
    expect(chart.ashtakavarga.totalBindus).toBe(337);
    const expectedSums: Record<string, number> = {
      Sun: 48,
      Moon: 49,
      Mars: 39,
      Mercury: 54,
      Jupiter: 56,
      Venus: 52,
      Saturn: 39,
    };
    for (const p of SEVEN_PLANETS) {
      const sum = chart.ashtakavarga.bhinna[p].reduce((a, b) => a + b, 0);
      expect(sum).toBe(expectedSums[p]);
      for (let s = 0; s < 12; s++) {
        expect(chart.ashtakavarga.trikonaShodhana[p][s]).toBeGreaterThanOrEqual(0);
        expect(chart.ashtakavarga.trikonaShodhana[p][s]).toBeLessThanOrEqual(
          chart.ashtakavarga.bhinna[p][s]
        );
      }
    }
  });

  it('computes Shadbala, Yogas, Ashtakoota, and offline city search', () => {
    const c1 = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const living1 = calculateChart(SAMPLE_CHARTS[3], DEFAULT_SETTINGS);
    const living2 = calculateChart(SAMPLE_CHARTS[4], DEFAULT_SETTINGS);

    expect(c1.shadbala.length).toBe(7);
    expect(c1.shadbala.every((r) => Number.isFinite(r.totalRupas) && r.totalRupas > 0)).toBe(true);
    expect(c1.yogas.length).toBeGreaterThan(0);

    // Living pair computes full Ashtakoota match
    const match = computeAshtakoota(living1, living2);
    expect(match.kootas.length).toBe(8);
    expect(match.totalObtained).toBeGreaterThanOrEqual(0);
    expect(match.totalObtained).toBeLessThanOrEqual(36);
    expect(match.kundaliScore).toBeGreaterThanOrEqual(25);
    expect(match.kundaliScore).toBeLessThanOrEqual(97);
    expect(match.kundaliPillars.length).toBe(4);
    expect(match.papaSamyam.bridePapaPoints).toBeGreaterThanOrEqual(0);
    expect(match.sexualCompatibility.score).toBeGreaterThanOrEqual(25);
    expect(match.sexualCompatibility.score).toBeLessThanOrEqual(97);

    // >120-yr pair is strictly blocked from matchmaking
    const lockedMatch = computeAshtakoota(living1, c1);
    expect(lockedMatch.paramayusLocked?.exceeded).toBe(true);
    expect(lockedMatch.kootas.length).toBe(0);
    expect(lockedMatch.totalObtained).toBe(0);

    const delhi = searchCities('New Delhi', 5);
    expect(delhi.length).toBeGreaterThan(0);
    expect(delhi[0].timezone).toBe('Asia/Kolkata');

    const ulm = searchCities('Ulm', 5);
    expect(ulm.length).toBeGreaterThan(0);
    expect(ulm[0].country).toBe('Germany');
  });

  it('searches expanded global offline atlas across 246 countries on 3-letter prefixes and resolves IANA timezones', async () => {
    expect(lookupTimezoneFromCoords(28.6139, 77.209)).toBe('Asia/Kolkata');
    expect(lookupTimezoneFromCoords(40.7128, -74.006)).toBe('America/New_York');
    expect(lookupTimezoneFromCoords(27.7172, 85.324)).toBe('Asia/Kathmandu');

    // 3-letter prefix search including diacritic towns & smaller Indian towns
    const vri = await searchCitiesExtended('vri', 15);
    expect(vri.some((c) => c.cityAscii.toLowerCase().includes('vrindavan'))).toBe(true);

    // Non-major towns in Nepal, Bhutan, and Iceland
    const pok = await searchCitiesExtended('pokh', 10);
    expect(pok.some((c) => c.country === 'Nepal' && c.timezone === 'Asia/Kathmandu')).toBe(true);

    const thimphu = await searchCitiesExtended('thimphu', 5);
    expect(thimphu.length).toBeGreaterThan(0);
    expect(thimphu[0].country).toBe('Bhutan');
    expect(thimphu[0].timezone).toBe('Asia/Thimphu');

    const timbuktu = await searchCitiesExtended('timb', 10);
    expect(timbuktu.some((c) => c.country === 'Mali')).toBe(true);
  });

  it('supports Sripati houses, True Node, outer planets, sunrise-based Vara, and 4-level Sookshma Dasha', () => {
    // 2026-11-10 02:30:00 IST (Tuesday civil morning, before sunrise -> Vedic Vara is Monday!)
    const preSunriseInput = {
      id: 'pre-sunrise-test',
      name: 'Pre-Sunrise Check',
      date: '2026-11-10',
      time: '02:30:00',
      timezone: 'Asia/Kolkata',
      city: 'New Delhi',
      latitude: 28.6139,
      longitude: 77.209,
    };

    const chart = calculateChart(preSunriseInput, {
      ...DEFAULT_SETTINGS,
      ayanamsa: 'true_chitra',
      nodeMode: 'true',
      houseSystem: 'sripati',
      includeOuterPlanets: true,
      karakaCount: 8,
      horaMode: 'samasaptama',
    });

    expect(chart.panchang.vara.name).toBe('Monday');
    expect(chart.panchang.vara.sunriseBased).toBe(true);
    expect(chart.planets.length).toBe(12); // 9 grahas + Uranus, Neptune, Pluto
    expect(chart.houses.length).toBe(12);
    expect(chart.specialPoints.map((s) => s.id)).toEqual(['BL', 'HL', 'GL', 'Mandi', 'AL', 'UL']);

    // Expand Sookshma Dasha
    const firstPd = chart.vimshottari[0].children![0].children![0];
    const sookshma = expandSookshmaDasha(firstPd);
    expect(sookshma.length).toBe(9);
    const totalSdDays = sookshma.reduce((acc, s) => acc + s.durationDays, 0);
    expect(Math.abs(totalSdDays - firstPd.durationDays)).toBeLessThan(1e-6);

    // Yogini Dasha cycles
    expect(chart.yogini.length).toBe(24);
  });

  it('generates full classical predictions report with BPHS, Phaladeepika, Saravali, Jaimini & Gochar synthesis', () => {
    const vivekChart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const livingChart = calculateChart(SAMPLE_CHARTS[3], DEFAULT_SETTINGS);
    const report = generatePredictionReport(livingChart, '2026-11-10');

    expect(report.paramayus.exceeded).toBe(false);
    expect(report.lagnaProfile.signName).toBe(livingChart.ascendant.signName);
    expect(report.nakshatraProfile.name).toBe(livingChart.panchang.nakshatra.name);
    expect(report.lifeDomains.length).toBe(8);
    expect(report.lifeDomains.every((d) => d.rating >= 25 && d.rating <= 96 && d.sources.length > 0)).toBe(true);
    expect(report.planetPlacements.length).toBe(9);
    expect(report.houseLordships.length).toBe(12);
    expect(report.dashaForecast.targetDate).toBe('2026-11-10');
    expect(report.transitForecast.items.length).toBe(9);
    expect(report.transitForecast.janmaRasi).toBe(livingChart.planets.find((p) => p.id === 'Moon')!.signName);
    expect(report.kpReport.cusps.length).toBe(12);
    expect(report.kpReport.events.length).toBe(6);
    expect(report.varshaphala.year).toBe(2026);
    expect(report.varshaphala.muddaDasha.length).toBe(9);
    expect(report.jaiminiReport.arudhaPadas.length).toBe(12);
    expect(report.jaiminiReport.charaDasha.length).toBe(12);
    expect(report.lalKitabReport.planets.length).toBe(9);
    expect(report.divisionalPredictions.length).toBe(13);
    expect(report.deepGochar.items.length).toBe(9);
    expect(report.deepGochar.items.every((i) => i.d9TransitSign.length > 0 && i.kakshyaLord.length > 0)).toBe(true);
    expect(report.familyReport.childhood.earlyDashas.length).toBeGreaterThan(0);
    expect(report.familyReport.mother.score).toBeGreaterThanOrEqual(30);
    expect(report.familyReport.father.score).toBeGreaterThanOrEqual(30);
    expect(report.familyReport.siblings.score).toBeGreaterThanOrEqual(30);
    expect(report.familyReport.extendedFamily.score).toBeGreaterThanOrEqual(30);
    expect(report.familyReport.inLaws.score).toBeGreaterThanOrEqual(30);
    expect(report.kundaliDoshas.doshas.length).toBe(10);
    expect(report.remedies.length).toBeGreaterThan(0);

    const suite = buildSpecializedAstrologySuite(vivekChart);
    expect(suite.financial.induLagnaHouse).toBeGreaterThanOrEqual(1);
    expect(suite.financial.induLagnaHouse).toBeLessThanOrEqual(12);
    expect(suite.education.recommendedStreams.length).toBeGreaterThan(0);
    expect(suite.career.topSectors.length).toBeGreaterThan(0);
    expect(suite.marriage.score).toBeGreaterThanOrEqual(30);
    expect(suite.intimacy.passionDriveScore).toBeGreaterThanOrEqual(30);
    expect(suite.intimacy.sensualWarmthScore).toBeGreaterThanOrEqual(30);
    expect(suite.intimacy.emotionalIntimacyScore).toBeGreaterThanOrEqual(30);
    expect(suite.child.score).toBeGreaterThanOrEqual(30);
    expect(
      suite.lifePath.elements.Fire +
        suite.lifePath.elements.Earth +
        suite.lifePath.elements.Air +
        suite.lifePath.elements.Water
    ).toBeGreaterThanOrEqual(98);
    expect(
      suite.medical.doshaBalance.vata +
        suite.medical.doshaBalance.pitta +
        suite.medical.doshaBalance.kapha
    ).toBeGreaterThanOrEqual(98);
    expect(suite.other.astroVastu.length).toBe(8);
    expect(suite.other.taraBalaSummary.length).toBe(27);

    // Dasha Predictions & Prashna Kundali (use living chart <= 120 yrs)
    const md = livingChart.vimshottari[0];
    const ad = md.children![0];
    const pd = ad.children![0];
    const dashaPred = predictDashaDetail({
      chart: livingChart,
      system: 'vimshottari',
      mdLordRaw: md.lord,
      adLordRaw: ad.lord,
      pdLordRaw: pd.lord,
      startMs: pd.startMs,
      endMs: pd.endMs,
    });
    expect(dashaPred.score).toBeGreaterThanOrEqual(25);
    expect(dashaPred.activatedHouses.length).toBeGreaterThan(0);
    expect(dashaPred.d9AndD10Note.length).toBeGreaterThan(0);

    expect(getKpHoraryLongitude(1)).toBe(0);
    expect(getKpHoraryLongitude(249)).toBeGreaterThan(355);

    const prashna = analyzePrashnaChart(
      vivekChart,
      'Will this career promotion succeed?',
      'career',
      108
    );
    expect(prashna.queryHouse).toBe(10);
    expect(prashna.horaryAscSign).toBeDefined();
    expect(prashna.outcomeScore).toBeGreaterThanOrEqual(20);
    expect(prashna.tajikaYoga.length).toBeGreaterThan(0);
  });

  it('computes Avasthas, Upagrahas, Ashtottari/Narayana/Sudarshana, BTR, Muhurta Finder, 10-Yr Calendar & i18n', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const living = calculateChart(SAMPLE_CHARTS[3], DEFAULT_SETTINGS);

    const avReport = computeAvasthasAndUpagrahas(chart);
    expect(avReport.avasthas.length).toBe(7);
    expect(avReport.upagrahas.length).toBeGreaterThanOrEqual(5);
    expect(avReport.bhriguBindu.house).toBeGreaterThanOrEqual(1);
    expect(avReport.bhriguBindu.house).toBeLessThanOrEqual(12);

    const advDasha = computeAdvancedDashas(living);
    expect(advDasha.ashtottari.length).toBe(8);
    expect(advDasha.narayana.length).toBe(12);

    const sud = computeSudarshanaChakra(living, 2026);
    expect(sud.lagnaHouse).toBeGreaterThanOrEqual(1);
    expect(sud.lagnaHouse).toBeLessThanOrEqual(12);

    const btr0 = computeBtrSnapshot(SAMPLE_CHARTS[0], DEFAULT_SETTINGS, 0);
    const btrPlus = computeBtrSnapshot(SAMPLE_CHARTS[0], DEFAULT_SETTINGS, 600);
    expect(btr0.d1LagnaSign).toBe('Sagittarius');
    expect(btrPlus.rectifiedTime).not.toBe(btr0.rectifiedTime);

    const muhurtas = findAuspiciousMuhurtas(living, 'marriage', '2026-11-10', 14);
    expect(muhurtas.length).toBe(12);
    expect(muhurtas[0].score).toBeGreaterThanOrEqual(muhurtas[1].score);

    const cal = computeMultiYearCalendar(living, '2026-11-10', 10);
    expect(cal.ingresses.length).toBeGreaterThan(5);
    expect(cal.eclipses.length).toBeGreaterThan(0);

    // >120-yr chart yields empty future Muhurta & 10-yr Calendar predictions
    expect(findAuspiciousMuhurtas(chart, 'marriage', '2026-11-10', 14).length).toBe(0);
    expect(computeMultiYearCalendar(chart, '2026-11-10', 10).ingresses.length).toBe(0);

    expect(Object.keys(LANGUAGE_LABELS)).toEqual(['en', 'hi']);
    expect(trSign(0, 'hi')).toBe('मेष');
    expect(trPlanet('Sun', 'hi')).toBe('सूर्य');
    expect(trPlanetShort('Sun', 'hi')).toBe('सू');
    expect(trTerm('Ashwini', 'hi')).toBe('अश्विनी');
    expect(trTerm('Exalted', 'hi')).toBe('उच्च');

    const livingChart = calculateChart(SAMPLE_CHARTS[3], DEFAULT_SETTINGS);
    const hiReport = localizePredictionReportHi(generatePredictionReport(livingChart, '2026-11-10'), livingChart);
    expect(hiReport.lagnaProfile.signName).toMatch(/[\u0900-\u097F]/);
    expect(hiReport.lagnaProfile.temperament).toMatch(/[\u0900-\u097F]/);
    expect(hiReport.lifeDomains.length).toBe(8);
    expect(hiReport.lifeDomains[0].summary).toMatch(/[\u0900-\u097F]/);
    expect(hiReport.planetPlacements[0].classicalReading).toMatch(/[\u0900-\u097F]/);
    expect(hiReport.houseLordships[0].reading).toMatch(/[\u0900-\u097F]/);
    expect(hiReport.kundaliDoshas.doshas[0].effect).toMatch(/[\u0900-\u097F]/);

    const hiSuite = localizeSpecializedSuiteHi(buildSpecializedAstrologySuite(chart), chart);
    expect(hiSuite.financial.induLagnaNote).toMatch(/[\u0900-\u097F]/);
    expect(hiSuite.medical.disclaimer).toMatch(/[\u0900-\u097F]/);

    const lMd = livingChart.vimshottari[0];
    const hiDasha = localizeDashaDetailHi(
      predictDashaDetail({
        chart: livingChart,
        system: 'vimshottari',
        mdLordRaw: lMd.lord,
        startMs: lMd.startMs,
        endMs: lMd.endMs,
      }),
      livingChart,
      'mahadasha'
    );
    expect(hiDasha.mdSummary).toMatch(/[\u0900-\u097F]/);

    const hiPrashna = localizePrashnaHi(
      analyzePrashnaChart(chart, 'Career check', 'career'),
      chart
    );
    expect(hiPrashna.tajikaDetail).toMatch(/[\u0900-\u097F]/);

    const livingMatchPartner = calculateChart(SAMPLE_CHARTS[4], DEFAULT_SETTINGS);
    const hiMatch = localizeMatchResultHi(
      computeAshtakoota(livingChart, livingMatchPartner),
      livingChart,
      livingMatchPartner
    );
    expect(hiMatch.combinedVerdict).toMatch(/[\u0900-\u097F]/);
    expect(hiMatch.sexualCompatibility.shayanaAndEighthNote).toMatch(/[\u0900-\u097F]/);
  });

  it('computes AstroSage-parity engines: Avakahada, Ghatak, Bhava Chalit, Prastara, Choghadiya, Festival Calendar, Numerology, Lal Kitab, KP RP & Sahams, Rashifal, Baby Names & Gemstones', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);

    // 1. Avakahada, Ghatak & 108 Syllables + Bhava Chalit
    const av = computeAvakahadaChakra(chart);
    expect(av.allPadaSyllablesEn.length).toBe(4);
    expect(av.allPadaSyllablesHi.length).toBe(4);
    expect(getAllNakshatraSyllables(0).en).toEqual(['Chu', 'Che', 'Cho', 'La']);
    expect(av.payaEn.length).toBeGreaterThan(3);
    expect(av.remDashaHi).toMatch(/[\u0900-\u097F]/);

    const gh = computeGhatakChakra(chart.planets.find((p) => p.id === 'Moon')!.signIndex);
    expect(gh.rashiIndex).toBeGreaterThanOrEqual(0);
    expect(gh.rashiIndex).toBeLessThan(12);

    const chalit = computeBhavaChalitPlacements(chart);
    expect(chalit.placements.length).toBe(10); // Asc + 9 grahas

    // 2. Prastarashtakavarga 8x12 sums match Bhinna per planet
    for (const p of SEVEN_PLANETS) {
      for (let s = 0; s < 12; s++) {
        let colSum = 0;
        for (const contrib of [...SEVEN_PLANETS, 'Asc'] as const) {
          const val = chart.ashtakavarga.prastara[p][contrib][s];
          expect(val === 0 || val === 1).toBe(true);
          colSum += val;
        }
        expect(colSum).toBe(chart.ashtakavarga.bhinna[p][s]);
      }
    }

    // 3. Daily Choghadiya & Gowri + Annual Hindu Festival Calendar
    const muhurtaSuite = computeDailyChoghadiyaAndGowri('2026-11-10', 28.6139, 77.209, 330);
    expect(muhurtaSuite.dayChoghadiya.length).toBe(8);
    expect(muhurtaSuite.nightChoghadiya.length).toBe(8);
    expect(muhurtaSuite.dayGowri.length).toBe(8);
    expect(muhurtaSuite.nightGowri.length).toBe(8);
    // Tuesday starts with Rog (2026-11-10 is Tuesday)
    expect(muhurtaSuite.dayChoghadiya[0].nameEn).toBe('Rog');

    const cal2026 = computeAnnualHinduCalendar(2026, 'lahiri', 330);
    const sankrantis = cal2026.filter((e) => e.category === 'sankranti');
    const ekadashis = cal2026.filter((e) => e.category === 'ekadashi');
    const festivals = cal2026.filter((e) => e.category === 'festival');
    expect(sankrantis.length).toBe(12);
    expect(ekadashis.length).toBeGreaterThanOrEqual(22);
    expect(festivals.length).toBeGreaterThanOrEqual(12);

    // 4. Numerology + Lo Shu Grid
    const numRep = computeNumerologyReport('Narendra Modi', '1950-09-17', 'male', 2026);
    expect(numRep.mulank).toBe(8); // 1+7=8
    expect(numRep.bhagyank).toBe(5); // 1+9+5+0+0+9+1+7 = 32 -> 5
    expect(numRep.kuaNumber).toBeGreaterThanOrEqual(1);
    expect(numRep.loShuPlanes.length).toBe(8);
    expect(computeNameNumber('Aarav', 'chaldean').reduced).toBeGreaterThanOrEqual(1);

    // 5. Complete Lal Kitab System
    expect(getLalKitabVarshaHouse(1, 1)).toBe(1);
    expect(getLalKitabVarshaHouse(1, 2)).toBe(4);
    const lkRep = computeFullLalKitabReport(chart, 2026);
    expect(lkRep.planets.length).toBe(9);
    expect(lkRep.dasha35.length).toBe(27); // 9 planets x 3 cycles = 105y

    // 6. KP Ruling Planets, Nakshatra Nadi & Tajika 16 Sahams + Panchadhikari
    const kpRep = computeKpReport(chart);
    expect(kpRep.nakshatraNadi.length).toBe(9);
    expect(kpRep.chartRulingPlanets.rulingPlanets.length).toBeGreaterThanOrEqual(3);
    const liveRp = computeLiveKpRulingPlanets(Date.now(), 330, 28.6139, 77.209);
    expect(liveRp.rulingPlanets.length).toBeGreaterThanOrEqual(3);

    const varsha = computeVarshaphala(chart, 2026);
    expect(varsha.sahams.length).toBe(16);
    expect(varsha.panchadhikari.varshaAscLord).toBeTruthy();

    // 7. 12-Rashi Rashifal, Nakshatra Baby Names, Gemstones & 1-14 Mukhi Rudraksha
    const livingForRashi = calculateChart(SAMPLE_CHARTS[3], DEFAULT_SETTINGS);
    const rashifal = computeRashifalReport(livingForRashi, '2026-11-10');
    expect(rashifal.length).toBe(12);
    expect(rashifal.filter((r) => r.isNatalMoon).length).toBe(1);
    expect(computeRashifalReport(chart, '2026-11-10').length).toBe(0);

    const allNames = findBabyNames('all', 'all');
    expect(allNames.length).toBe(108);
    expect(findBabyNames(0, 'boy').length).toBe(2);

    const gemRep = computeGemstoneAndRudraksha(chart);
    expect(gemRep.lifeStone.stoneEn).toBeTruthy();
    expect(gemRep.primaryRudraksha.mukhi).toBeTruthy();
  });

  it('computes restructured modular predictions: Planet in Sign, Planet in Nakshatra, Planet in House, House-wise (H1–H12), and Degree-wise (Ansha)', () => {
    const living = calculateChart(SAMPLE_CHARTS[3], DEFAULT_SETTINGS);
    const rep = generatePredictionReport(living, '2026-11-10');

    // 1. Planet in Sign (Asc + 9 Grahas)
    expect(rep.planetInSigns.length).toBe(10);
    const marsSign = rep.planetInSigns.find((p) => p.planet === 'Mars')!;
    expect(marsSign.signIndex).toBeGreaterThanOrEqual(0);
    expect(marsSign.readingHi).toMatch(/[\u0900-\u097F]/);
    expect(inspectHypotheticalPlanetInSign('Sun', 0).headlineEn).toContain('Exalted');

    // 2. Planet in Nakshatra (Asc + 9 Grahas)
    expect(rep.planetInNakshatras.length).toBe(10);
    const moonNak = rep.planetInNakshatras.find((p) => p.planet === 'Moon')!;
    expect(moonNak.nakshatraNameEn).toBe(living.panchang.nakshatra.name);
    expect(moonNak.pada).toBeGreaterThanOrEqual(1);
    expect(moonNak.pada).toBeLessThanOrEqual(4);
    expect(moonNak.readingHi).toMatch(/[\u0900-\u097F]/);
    expect(inspectHypotheticalNakshatra('Jupiter', 7, 2).lord).toBe('Saturn');

    // 3. Planet in House
    expect(rep.planetPlacements.length).toBe(9);

    // 4. House-wise (1st to 12th)
    expect(rep.houseWisePredictions.length).toBe(12);
    expect(rep.houseWisePredictions[0].houseNumber).toBe(1);
    expect(rep.houseWisePredictions[11].houseNumber).toBe(12);
    expect(
      rep.houseWisePredictions.reduce((sum, h) => sum + h.savBindus, 0)
    ).toBe(337);
    expect(rep.houseWisePredictions[0].synthesisHi).toMatch(/[\u0900-\u097F]/);

    // 5. Degree-wise (Ansha)
    expect(rep.degreePredictions.length).toBe(10);
    const yuvaSun = analyzeBodyDegree('Sun', 0, 15, '15°00\'00"', 15);
    expect(yuvaSun.avasthaEn).toContain('Yuva');
    expect(yuvaSun.strengthPercent).toBeGreaterThanOrEqual(95);

    const pushkaraSun = analyzeBodyDegree('Sun', 0, 21, '21°00\'00"', 21);
    expect(pushkaraSun.isPushkaraBhaga).toBe(true);
    expect(pushkaraSun.isPushkaraNavamsha).toBe(true);

    const gandantaMoon = analyzeBodyDegree('Moon', 3, 28.5, '28°30\'00"', 118.5);
    expect(gandantaMoon.isGandanta).toBe(true);

    const evenMritaMars = analyzeBodyDegree('Mars', 1, 2.0, '2°00\'00"', 32);
    expect(evenMritaMars.avasthaEn).toContain('Mrita');

    // 6. Yuti-Wise (2, 3, 4, 5, 6, 7 Planets)
    expect(rep.yutiReport.summaryHi).toMatch(/[\u0900-\u097F]/);
    const y2 = inspectCustomYuti(['Sun', 'Mercury'], 10, 0)!;
    expect(y2.count).toBe(2);
    expect(y2.headlineEn).toContain('Budhaditya');
    const y4 = inspectCustomYuti(['Sun', 'Moon', 'Mars', 'Jupiter'], 4, 3)!;
    expect(y4.count).toBe(4);
    expect(y4.pairInsights.length).toBe(6);
    const y7 = inspectCustomYuti(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'], 1, 0)!;
    expect(y7.count).toBe(7);
    expect(y7.labelEn).toContain('7-Planet');
    expect(y7.positiveHi).toMatch(/[\u0900-\u097F]/);

    // 7. Events, Accidents, Paya, Gandmool, Longevity & Life Ledger Q&A
    const leg = rep.lifeEventsLedger;
    expect(leg.payaAndGandmool.payaNameEn.length).toBeGreaterThan(3);
    expect(leg.accidentProfile.riskTypesEn.length).toBeGreaterThan(10);
    expect(leg.timelineEvents.length).toBeGreaterThan(0);
    expect(leg.longevity.categoryEn.length).toBeGreaterThan(5);
    expect(leg.deityAndMainPlanet.ishtaDevataEn.length).toBeGreaterThan(5);
    expect(leg.qaLedger.length).toBe(6);
    expect(leg.qaLedger.every((q) => q.positiveHi.length > 5 && q.negativeHi.length > 5)).toBe(true);

    // 8. Bhavat Bhavam Wise & Aspects / Drishti Wise
    expect(rep.bhavatBhavamReport.houses.length).toBe(12);
    expect(rep.bhavatBhavamReport.houses[4].mirrorHouse).toBe(9); // 5th from 5th = 9th
    expect(rep.bhavatBhavamReport.houses[7].mirrorHouse).toBe(3); // 8th from 8th = 3rd
    expect(rep.bhavatBhavamReport.houses[0].readingHi).toMatch(/[\u0900-\u097F]/);
    expect(computeCustomBhavatBhavam(living, 7, 8).derivedHouse).toBe(2); // 8th from 7th = 2nd

    expect(rep.drishtiReport.houseDrishtis.length).toBe(12);
    expect(rep.drishtiReport.planetaryDrishtis.length).toBeGreaterThan(5);
    expect(rep.drishtiReport.summaryHi).toMatch(/[\u0900-\u097F]/);
    const customDr = inspectCustomDrishti('Mars', 'Saturn', 8);
    expect(customDr.negativeEn).toContain('Mars–Saturn');

    // 9. All 144 House-Lord-in-House Matrix & Bhrigu Nandi Nadi (BNN)
    for (let lh = 1; lh <= 12; lh++) {
      for (let ph = 1; ph <= 12; ph++) {
        const item = getBhavesha144Entry(lh, ph);
        expect(item.readingEn.length).toBeGreaterThan(15);
        expect(item.readingHi).toMatch(/[\u0900-\u097F]/);
      }
    }
    const nineInSeven = getBhavesha144Entry(9, 7);
    expect(nineInSeven.headlineEn).toContain('Fortune Through Marriage');
    expect(rep.bhriguNandiNadi.directionLines.length).toBe(4);
    expect(rep.bhriguNandiNadi.diseaseAlerts.length).toBe(5);
    expect(rep.bhriguNandiNadi.guruCycles12Yr.length).toBe(6);
    expect(rep.bhriguNandiNadi.karmaCareerHi).toMatch(/[\u0900-\u097F]/);
    expect(rep.bhriguNandiNadi.marriageNadiHi).toMatch(/[\u0900-\u097F]/);
  });

  it('computes Pancha Pakshi, Gochara Kakshas (3°45′), Ashtakavarga Yogas, and Deep Samvatsara/Shoola/Vaasa Panchang', () => {
    const living = calculateChart(SAMPLE_CHARTS[3], DEFAULT_SETTINGS);
    const oldChart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const transit = calculateChart(
      {
        ...SAMPLE_CHARTS[3],
        id: 'transit-sample',
        date: '2026-11-11',
        time: '10:30:00',
      },
      DEFAULT_SETTINGS
    );

    // 1. Pancha Pakshi
    expect(getBirthBird(0, 'Shukla')).toBe('Vulture');
    expect(getBirthBird(0, 'Krishna')).toBe('Peacock');
    expect(getBirthBird(12, 'Shukla')).toBe('Crow');
    expect(getBirthBird(12, 'Krishna')).toBe('Crow');

    const pakshi = computePanchaPakshiDay(
      living,
      '2026-11-11',
      '10:30',
      living.input.latitude,
      living.input.longitude,
      330
    );
    expect(pakshi.dayYamas.length).toBe(5);
    expect(pakshi.nightYamas.length).toBe(5);
    expect(pakshi.currentYama.strengthScore).toBeGreaterThan(0);
    expect(pakshi.guidanceHi).toMatch(/[\u0900-\u097F]/);

    // 2. Gochara Kakshas & Ashtakavarga Yogas (living succeeds, >120 halted)
    const kakshas = computeGocharaKakshas(living, transit);
    expect(kakshas.length).toBe(7);
    expect(kakshas.every((k) => k.kakshaNumber >= 1 && k.kakshaNumber <= 8)).toBe(true);
    expect(kakshas.every((k) => k.kakshaBindu === 0 || k.kakshaBindu === 1)).toBe(true);
    expect(computeGocharaKakshas(oldChart, transit).length).toBe(0);

    const avYogas = evaluateAshtakavargaYogas(living);
    expect(avYogas.length).toBeGreaterThan(0);
    expect(avYogas[0].effectHi).toMatch(/[\u0900-\u097F]/);
    expect(evaluateAshtakavargaYogas(oldChart).length).toBe(0);

    // 3. Deep Panchang: 60-Samvatsara, Amanta/Purnimanta, Disha Shoola, Vaasa, Panchaka & Muhurta Rules
    // 2026-11-11 is Wednesday -> North Disha Shoola
    const wedPurnimanta = computeDeepPanchangMuhurta(
      '2026-11-11',
      '10:30',
      28.6139,
      77.209,
      330,
      DEFAULT_SETTINGS,
      'purnimanta'
    );
    expect(wedPurnimanta.dishaShool.directionEn).toBe('North');
    expect(wedPurnimanta.samvatsaraNumber).toBeGreaterThanOrEqual(1);
    expect(wedPurnimanta.samvatsaraNumber).toBeLessThanOrEqual(60);
    expect(wedPurnimanta.muhurtaRules.length).toBeGreaterThanOrEqual(6);
    expect(wedPurnimanta.vaasa.shivaStateEn.length).toBeGreaterThan(3);
    expect(wedPurnimanta.vaasa.agniStateEn.length).toBeGreaterThan(3);

    // Thursday (2026-11-12) -> South Disha Shoola
    const thuPanchang = computeDeepPanchangMuhurta(
      '2026-11-12',
      '10:30',
      28.6139,
      77.209,
      330,
      DEFAULT_SETTINGS,
      'amanta'
    );
    expect(thuPanchang.dishaShool.directionEn).toBe('South');
    expect(thuPanchang.panchaka.remainder).toBeGreaterThanOrEqual(0);
    expect(thuPanchang.panchaka.remainder).toBeLessThanOrEqual(8);
  });

  it('computes deep marriage matching: Beeja/Kshetra Sphuta, Vivaha dates, Pooja remedies, and Sign/House synastry', () => {
    const partnerA = calculateChart(SAMPLE_CHARTS[3], DEFAULT_SETTINGS);
    const partnerB = calculateChart(SAMPLE_CHARTS[4], DEFAULT_SETTINGS);
    const basicMatch = computeAshtakoota(partnerA, partnerB);
    const deep = computeDeepMarriageMatch(partnerA, partnerB, basicMatch, '2026-11-11');

    // 1. Beeja & Kshetra Sphuta Matching
    expect(deep.beejaKshetra).not.toBeNull();
    const sp = deep.beejaKshetra!;
    expect(sp.score).toBeGreaterThanOrEqual(30);
    expect(sp.score).toBeLessThanOrEqual(98);
    expect(sp.partnerABeeja.signIndex).toBeGreaterThanOrEqual(0);
    expect(sp.partnerABeeja.signIndex).toBeLessThan(12);
    expect(sp.partnerBKshetra.d9SignIndex).toBeGreaterThanOrEqual(0);
    expect(sp.summaryHi).toMatch(/[\u0900-\u097F]/);

    // 2. Doshas & Pooja Remedies
    expect(deep.doshaPoojas.length).toBeGreaterThanOrEqual(1);
    expect(deep.doshaPoojas[0].poojaNameEn.length).toBeGreaterThan(5);
    expect(deep.doshaPoojas[0].poojaNameHi).toMatch(/[\u0900-\u097F]/);
    expect(deep.doshaPoojas[0].mantraAndVidhiHi).toMatch(/[\u0900-\u097F]/);

    // 3. Vivaha Timing Windows & Suitable Dates
    expect(deep.vivahaTiming.overlapWindows.length).toBeGreaterThanOrEqual(1);
    expect(deep.vivahaTiming.auspiciousDates.length).toBeGreaterThan(0);
    expect(deep.vivahaTiming.auspiciousDates[0].date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(deep.vivahaTiming.auspiciousDates[0].tithiNameHi).toMatch(/[\u0900-\u097F]/);

    // 4. Sign-to-Sign (7 dimensions) & House-to-House (H1-H12)
    expect(deep.signMatches.length).toBe(7);
    expect(deep.houseMatches.length).toBe(12);
    expect(deep.houseMatches.map((h) => h.house)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(deep.houseMatches[6].readingHi).toMatch(/[\u0900-\u097F]/);
  });

  it('generates detailed Past Life (D60/D12/D20/Ketu), Future Becoming, 0–120 Yr Life Events, and halts predictions after 120 years (Dead or Amar)', () => {
    const living = calculateChart(SAMPLE_CHARTS[3], DEFAULT_SETTINGS);
    const activeRep = generatePredictionReport(living, '2026-11-11');

    // 1. Past Life & Future Becoming for living chart
    expect(activeRep.paramayus.exceeded).toBe(false);
    expect(activeRep.paramayus.status).toBe('ACTIVE');
    expect(activeRep.pastFutureLife).not.toBeNull();
    const pf = activeRep.pastFutureLife!;
    expect(pf.pastLife.chartFactors.length).toBe(6);
    expect(pf.pastLife.previousRoleAndStationHi).toMatch(/[\u0900-\u097F]/);
    expect(pf.pastLife.shashtiamsaDeityEn).toContain('Shashtiamsa');
    expect(pf.futureBecoming.thisLifeMaturityEn.length).toBeGreaterThan(20);
    expect(pf.futureBecoming.nextBirthLokaHi).toMatch(/[\u0900-\u097F]/);
    expect(pf.futureBecoming.chartFactors.length).toBe(4);

    // 2. Full 0–120 Years Paramayus Life Events Chronicle
    const t120 = activeRep.lifeEventsLedger.timeline120Years;
    expect(t120.length).toBeGreaterThanOrEqual(45);
    expect(t120[0].startAge).toBeLessThanOrEqual(1);
    expect(t120[t120.length - 1].endAge).toBeGreaterThanOrEqual(119);
    expect(t120[t120.length - 1].endAge).toBeLessThanOrEqual(120);
    expect(t120.some((e) => e.milestoneEn?.includes('120'))).toBe(true);
    expect(t120.every((e) => e.titleHi.length > 3 && e.detailHi.length > 5)).toBe(true);

    // 3. Hard 120-Year Paramayus Block: Historical & >120-Yr Persons (Considered Dead or Amar)
    for (const oldInput of [
      SAMPLE_CHARTS[0], // Swami Vivekananda (1863)
      SAMPLE_CHARTS[1], // Albert Einstein (1879)
      { ...SAMPLE_CHARTS[3], id: 'old-1902', name: 'Elder (1902)', date: '1902-01-15' },
    ]) {
      const oldChart = calculateChart(oldInput, DEFAULT_SETTINGS);
      const locked = generatePredictionReport(oldChart, '2026-11-11');
      expect(locked.paramayus.exceeded).toBe(true);
      expect(locked.paramayus.status).toBe('DEAD_OR_AMAR');
      expect(locked.paramayus.messageHi).toContain('दिवंगत');
      expect(locked.paramayus.messageHi).toContain('अमर');
      expect(locked.lifeDomains.length).toBe(0);
      expect(locked.planetPlacements.length).toBe(0);
      expect(locked.houseWisePredictions.length).toBe(0);
      expect(locked.pastFutureLife).toBeNull();
      expect(locked.lifeEventsLedger.timeline120Years.length).toBe(0);
      expect(locked.transitForecast.items.length).toBe(0);

      // Verify Gochar, Matching, Dasha & Future predictions are individually blocked too
      const oldDeepMatch = computeDeepMarriageMatch(living, oldChart, computeAshtakoota(living, oldChart), '2026-11-11');
      expect(oldDeepMatch.paramayusLocked?.exceeded).toBe(true);
      expect(oldDeepMatch.beejaKshetra).toBeNull();
      expect(oldDeepMatch.vivahaTiming.auspiciousDates.length).toBe(0);
      const oldMd = oldChart.vimshottari[0];
      const oldDashaPred = predictDashaDetail({
        chart: oldChart,
        system: 'vimshottari',
        mdLordRaw: oldMd.lord,
        startMs: oldMd.startMs,
        endMs: oldMd.endMs,
      });
      expect(oldDashaPred.score).toBe(0);
      expect(oldDashaPred.activatedHouses.length).toBe(0);
    }

    // 4. Forecasting > 120 years past birth also halts predictions
    const farFuture = generatePredictionReport(living, '2125-05-15');
    expect(farFuture.paramayus.exceeded).toBe(true);
    expect(farFuture.paramayus.reason).toBe('TARGET_OVER_120');
    expect(farFuture.lifeDomains.length).toBe(0);

    // 5. DD-MM-YYYY formatting & parsing roundtrip
    expect(formatDateDmy('2000-05-15')).toBe('15-05-2000');
    expect(formatDateDmy('2026-11-11 06:33')).toBe('11-11-2026 06:33');
    expect(parseDateInputToIso('15-05-2000')).toBe('2000-05-15');
    expect(parseDateInputToIso('29/02/2024')).toBe('2024-02-29');
    expect(parseDateInputToIso('31-02-2024')).toBeNull();
  });

  it("synthesizes Systems' Approach MEP/FM orbs, empirical career/Prasthara/DK modules, 1000+ rules & Paramayus block", () => {
    const living = calculateChart(SAMPLE_CHARTS[3], DEFAULT_SETTINGS);
    const activeRep = generatePredictionReport(living, '2026-11-11');
    expect(activeRep.advancedTechniques).not.toBeNull();
    const adv = activeRep.advancedTechniques!;

    expect(adv.targetDateDmy).toBe('11-11-2026');
    expect(adv.mepDegree).toBeCloseTo(living.ascendant.degreeInSign, 2);
    expect(adv.functionalProfiles.length).toBe(9);
    const rahuProfile = adv.functionalProfiles.find((p) => p.planet === 'Rahu')!;
    expect(rahuProfile.role).toBe('FM');
    expect(rahuProfile.remedyHi).toMatch(/[\u0900-\u097F]/);

    expect(adv.careerAudit.serviceScore).toBeGreaterThanOrEqual(40);
    expect(adv.careerAudit.businessScore).toBeGreaterThanOrEqual(40);
    expect(adv.careerAudit.prastharaCareerWindows.length).toBeGreaterThan(0);
    expect(adv.careerAudit.prastharaCareerWindows[0].startDateDmy).toMatch(/^\d{2}-\d{2}-\d{4}$/);

    expect(adv.specialModules.darakaraka).not.toBeNull();
    expect(adv.specialModules.marriageAudit.harmonyScore).toBeGreaterThanOrEqual(25);
    expect(adv.specialModules.educationAudit.summaryHi).toMatch(/[\u0900-\u097F]/);
    expect(adv.specialModules.medicalAudit.d6ResilienceHi).toMatch(/[\u0900-\u097F]/);

    expect(adv.houseSynthesis.length).toBe(12);
    expect(adv.totalRulesEvaluated).toBeGreaterThanOrEqual(1000);
    expect(adv.triggeredRules.length).toBeGreaterThanOrEqual(10);

    // Strictly blocked when Paramayus > 120 years
    const vivek = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const locked = generatePredictionReport(vivek, '2026-11-11');
    expect(locked.paramayus.exceeded).toBe(true);
    expect(locked.advancedTechniques).toBeNull();

    const farFuture = generatePredictionReport(living, '2125-05-15');
    expect(farFuture.advancedTechniques).toBeNull();
  });

  it('passes full astronomical benchmark (1950-09-17), pre-sunrise Upagrahas & Shadbala accuracy checks', () => {
    const chart = calculateChart(
      {
        id: 'audit-1950',
        name: 'Audit Chart 1950',
        gender: 'male',
        date: '1950-09-17',
        time: '11:00:00',
        timezone: 'Asia/Kolkata',
        city: 'Vadnagar',
        country: 'India',
        latitude: 23.78,
        longitude: 72.63,
      },
      DEFAULT_SETTINGS
    );
    expect(chart.ascendant.signName).toBe('Scorpio');
    expect(chart.ascendant.nakshatraName).toBe('Vishakha');
    expect(chart.planets.find((p) => p.id === 'Sun')!.signName).toBe('Virgo');
    expect(chart.planets.find((p) => p.id === 'Moon')!.signName).toBe('Scorpio');
    expect(chart.planets.find((p) => p.id === 'Moon')!.nakshatraName).toBe('Anuradha');
    expect(chart.planets.find((p) => p.id === 'Mars')!.signName).toBe('Scorpio');
    expect(chart.planets.find((p) => p.id === 'Jupiter')!.signName).toBe('Aquarius');
    expect(chart.planets.find((p) => p.id === 'Venus')!.signName).toBe('Leo');
    expect(chart.planets.find((p) => p.id === 'Saturn')!.signName).toBe('Leo');
    expect(chart.ashtakavarga.totalBindus).toBe(337);
    expect(chart.shadbala.every((r) => Number.isFinite(r.totalVirupas) && r.totalVirupas > 120)).toBe(true);

    // Pre-sunrise birth check (Tagore born 02:27 AM before 05:23 sunrise -> Vedic Vara Monday, nocturnal Upagrahas finite)
    const tagore = calculateChart(SAMPLE_CHARTS[2], DEFAULT_SETTINGS);
    expect(tagore.panchang.vara.name).toBe('Monday');
    const upa = computeAvasthasAndUpagrahas(tagore);
    expect(upa.upagrahas.length).toBe(9);
    expect(upa.upagrahas.every((u) => Number.isFinite(u.longitude) && u.longitude >= 0 && u.longitude < 360)).toBe(true);
  });
});
