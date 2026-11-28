import { describe, expect, it } from 'vitest';
import { calculateChart, DEFAULT_CALC_SETTINGS } from '../calculator';
import { expandPranaDasha, expandSookshmaDasha } from '../dasha';
import { parseGeovisionChartXml, serializeChartToGeovisionXml } from '../geovisionXml';
import { computeShadPhalaHouses } from '../shadPhalaEngine';
import { computeAllVimsopakaBalas } from '../vargas';
import {
  computeMonthlyEphemerisRows,
  computeRashiMutualDistances,
  computeTimeOfTransits,
  computeVarshaphala12MonthlyCharts,
  searchWorkstationCharts,
  shiftBirthInputTime,
} from '../workstationUtils';
import type { BirthInput } from '../types';

const SAMPLE_NATIVE: BirthInput = {
  id: 'test-native-1',
  name: 'Test Native',
  gender: 'male',
  date: '1991-06-15',
  time: '23:55:00',
  timezone: 'Asia/Kolkata',
  utcOffsetMinutes: 330,
  city: 'New Delhi',
  latitude: 28.6139,
  longitude: 77.209,
};

describe('AV Astro Vibe Workstation Engines', () => {
  it('computes 5-tier Vimshottari Prana Dasha summing accurately to parent Sookshma span', () => {
    const chart = calculateChart(SAMPLE_NATIVE, DEFAULT_CALC_SETTINGS);
    const md = chart.vimshottari[0];
    const ad = md.children![0];
    const pd = ad.children![0];
    const sdList = expandSookshmaDasha(pd);
    expect(sdList.length).toBe(9);
    expect(sdList[0].level).toBe(4);

    const pranaList = expandPranaDasha(sdList[0]);
    expect(pranaList.length).toBe(9);
    expect(pranaList[0].level).toBe(5);
    expect(pranaList[0].startMs).toBeCloseTo(sdList[0].startMs, 3);
    expect(pranaList[8].endMs).toBeCloseTo(sdList[0].endMs, 3);
  });

  it('computes all 4 classical Vimsopaka Bala hierarchies (Shadvarga, Saptavarga, Dashavarga, Shodashavarga)', () => {
    const chart = calculateChart(SAMPLE_NATIVE, DEFAULT_CALC_SETTINGS);
    const rows = computeAllVimsopakaBalas(chart.divisionalCharts, chart.maitriMatrix);
    expect(rows.length).toBe(9);
    for (const r of rows) {
      expect(r.shadvarga).toBeGreaterThanOrEqual(2);
      expect(r.shadvarga).toBeLessThanOrEqual(20);
      expect(r.saptavarga).toBeGreaterThanOrEqual(2);
      expect(r.saptavarga).toBeLessThanOrEqual(20);
      expect(r.dashavarga).toBeGreaterThanOrEqual(2);
      expect(r.dashavarga).toBeLessThanOrEqual(20);
      expect(r.shodashavarga).toBeGreaterThanOrEqual(2);
      expect(r.shodashavarga).toBeLessThanOrEqual(20);
    }
  });

  it('shifts birth time accurately across midnight boundary for live BTR stepping', () => {
    const forward = shiftBirthInputTime(SAMPLE_NATIVE, 600); // +10m from 23:55 -> 00:05 next day
    expect(forward.date).toBe('1991-06-16');
    expect(forward.time).toBe('00:05:00');

    const back = shiftBirthInputTime(forward, -600);
    expect(back.date).toBe('1991-06-15');
    expect(back.time).toBe('23:55:00');
  });

  it('generates monthly ephemeris rows with continuous longitudes and Panchanga fields', () => {
    const rows = computeMonthlyEphemerisRows({
      startDateIso: '2026-04-01',
      daysCount: 15,
      timezone: 'Asia/Kolkata',
      utcOffsetMinutes: 330,
      settings: DEFAULT_CALC_SETTINGS,
    });
    expect(rows.length).toBe(15);
    expect(rows[0].dateDmy).toBe('01-04-2026');
    expect(rows[14].dateDmy).toBe('15-04-2026');
    expect(rows[0].planets.Sun.signShort.length).toBe(3);
    expect(rows[0].tithiName.length).toBeGreaterThan(2);
  });

  it('searches across research benchmarks and saved charts by Lagna / Planet conditions', () => {
    const all = searchWorkstationCharts({}, [SAMPLE_NATIVE], DEFAULT_CALC_SETTINGS);
    expect(all.length).toBeGreaterThan(5);

    const gemLagna = searchWorkstationCharts({ lagnaSignIndex: 2 }, [SAMPLE_NATIVE], DEFAULT_CALC_SETTINGS);
    expect(gemLagna.some((m) => m.lagnaSign === 'Gemini')).toBe(true);
    expect(gemLagna.every((m) => m.lagnaSign === 'Gemini')).toBe(true);
  });

  it('searches benchmark and user charts and round-trips standard XML serialization', () => {
    const benchmarkMatches = searchWorkstationCharts({ sourceFilter: 'benchmark' }, [SAMPLE_NATIVE], DEFAULT_CALC_SETTINGS);
    expect(benchmarkMatches.length).toBeGreaterThan(0);

    const xml = serializeChartToGeovisionXml(SAMPLE_NATIVE, 330);
    const parsed = parseGeovisionChartXml(xml, 'xml-roundtrip');
    expect(parsed).not.toBeNull();
    expect(parsed!.name).toBe('Test Native');
    expect(parsed!.date).toBe('1991-06-15');
    expect(parsed!.time).toBe('23:55:00');
    expect(parsed!.utcOffsetMinutes).toBe(330);
    expect(parsed!.longitude).toBeCloseTo(SAMPLE_NATIVE.longitude, 3);
  });

  it('computes Shad Phala 12 houses, Time of Transits, 12-Month Varshaphala, and Rashi Mutual Distances', () => {
    const chart = calculateChart(SAMPLE_NATIVE, DEFAULT_CALC_SETTINGS);
    const shad = computeShadPhalaHouses(chart);
    expect(shad.length).toBe(12);
    expect(shad[0].readingEn.length).toBeGreaterThan(15);

    const transits = computeTimeOfTransits({
      natalChart: chart,
      startDateIso: '2026-04-01',
      horizonDays: 90,
    });
    expect(transits.length).toBeGreaterThan(3);

    const monthlyVarsha = computeVarshaphala12MonthlyCharts(chart, 2026);
    expect(monthlyVarsha.length).toBe(12);
    expect(monthlyVarsha[0].munthaSignName.length).toBeGreaterThan(2);

    const chartB = calculateChart({ ...SAMPLE_NATIVE, id: 'partner-b', date: '1993-08-20', time: '09:15:00' }, DEFAULT_CALC_SETTINGS);
    const dist = computeRashiMutualDistances(chart, chartB);
    expect(dist.length).toBeGreaterThanOrEqual(10);
  });
});
