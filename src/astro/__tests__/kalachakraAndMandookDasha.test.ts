import { describe, expect, it } from 'vitest';
import {
  computeKalachakraDasha,
  computeMandookDasha,
} from '../advancedDashas';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS, SAMPLE_CHARTS } from '../../data/cities';
import { findAuspiciousMuhurtas } from '../muhurtaFinder';

describe('Advanced Classical Dashas & Topocentric Coordinates', () => {
  it('computes Kalachakra Dasha with Savya/Apasavya progression, Deha/Jeeva rasis, and Gatis', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const kcd = computeKalachakraDasha(chart);

    expect(kcd).toBeDefined();
    expect(typeof kcd.isSavya).toBe('boolean');
    expect(['Savya (Direct Clockwise)', 'Apasavya (Indirect Counter-Clockwise)']).toContain(kcd.movementType);
    expect(kcd.dehaRasiName).toBeDefined();
    expect(kcd.jeevaRasiName).toBeDefined();
    expect(kcd.dehaRasiIndex).toBeGreaterThanOrEqual(0);
    expect(kcd.jeevaRasiIndex).toBeGreaterThanOrEqual(0);
    expect(kcd.periods.length).toBeGreaterThan(0);

    const firstPeriod = kcd.periods[0];
    expect(firstPeriod.signIndex).toBeGreaterThanOrEqual(0);
    expect(firstPeriod.signIndex).toBeLessThan(12);
    expect(firstPeriod.years).toBeGreaterThan(0);
    expect(firstPeriod.startMs).toBeLessThan(firstPeriod.endMs);
    expect(typeof firstPeriod.isDehaRasi).toBe('boolean');
    expect(typeof firstPeriod.isJeevaRasi).toBe('boolean');
  });

  it('computes Mandook Dasha (Jaimini Frog-Leap progression) for all 12 signs', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const mandook = computeMandookDasha(chart);

    expect(mandook).toBeDefined();
    expect(mandook.length).toBe(12);

    let prevEndMs = mandook[0].startMs;
    for (const p of mandook) {
      expect(p.startMs).toBe(prevEndMs);
      expect(p.endMs).toBeGreaterThan(p.startMs);
      expect(p.years).toBeGreaterThan(0);
      expect(p.signIndex).toBeGreaterThanOrEqual(0);
      expect(p.signIndex).toBeLessThan(12);
      prevEndMs = p.endMs;
    }
  });

  it('computes Topocentric Lunar Parallax (~58 arcminutes) when topocentric is enabled', () => {
    const geocentricSettings = { ...DEFAULT_SETTINGS, topocentric: false };
    const topocentricSettings = { ...DEFAULT_SETTINGS, topocentric: true };

    const geoChart = calculateChart(SAMPLE_CHARTS[0], geocentricSettings);
    const topoChart = calculateChart(SAMPLE_CHARTS[0], topocentricSettings);

    const geoMoon = geoChart.planets.find((p) => p.id === 'Moon')!;
    const topoMoon = topoChart.planets.find((p) => p.id === 'Moon')!;

    expect(geoMoon).toBeDefined();
    expect(topoMoon).toBeDefined();

    // Lunar parallax is physically ~0.05 to 2.5 degrees depending on observer altitude and hour angle
    const diffDeg = Math.abs(geoMoon.longitude - topoMoon.longitude);
    expect(diffDeg).toBeGreaterThan(0.01);
    expect(diffDeg).toBeLessThan(3.0);
  });

  it('scans multi-criteria Muhurtas with Navatara and Chandrabala filtering', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const natalMoonNak = chart.panchang.nakshatra.index;
    const natalMoonSign = chart.planets.find((p) => p.id === 'Moon')!.signIndex;

    const report = findAuspiciousMuhurtas({
      purpose: 'marriage',
      startDate: '2026-11-20',
      endDate: '2026-12-05',
      latitude: chart.input.latitude,
      longitude: chart.input.longitude,
      timezone: chart.input.timezone,
      natalMoonNakshatraIndex: natalMoonNak,
      natalMoonSignIndex: natalMoonSign,
    });

    expect(report).toBeDefined();
    expect(report.allResults.length).toBeGreaterThan(0);
    for (const m of report.allResults) {
      expect(m.date).toBeDefined();
      expect(m.verdict).toBeDefined();
      expect(m.score).toBeGreaterThanOrEqual(0);
    }
  });
});
