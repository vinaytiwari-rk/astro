import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { computeCil2193Index, computeKpCuspalInterlinksReport } from '../kpCuspalInterlinks';
import type { BirthInput } from '../types';

describe('True Astrology KP Cuspal Interlinks (CIL 1-2193) Sub-Sub Lord Engine', () => {
  const sampleBirth: BirthInput = {
    id: 'test-cil',
    name: 'CIL Test Native',
    date: '1988-08-15',
    time: '10:15:00',
    latitude: 13.0827,
    longitude: 80.2707,
    timezone: 'Asia/Kolkata',
    utcOffsetMinutes: 330,
    city: 'Chennai',
    country: 'India',
  };

  const chart = calculateChart(sampleBirth);

  it('computes 1-2193 index within valid boundary for any degree', () => {
    const testDegs = [0, 45.5, 120.25, 245.75, 359.9];
    for (const deg of testDegs) {
      const res = computeCil2193Index(deg);
      expect(res.index).toBeGreaterThanOrEqual(1);
      expect(res.index).toBeLessThanOrEqual(2193);
      expect(res.starLord).toBeDefined();
      expect(res.subLord).toBeDefined();
      expect(res.subSubLord).toBeDefined();
      expect(res.arcSpanDms).toBeTruthy();
    }
  });

  it('generates full 12-Cusps CIL table with Sub-Sub Lord and significations', () => {
    const report = computeKpCuspalInterlinksReport(chart);
    expect(report.cusps.length).toBe(12);
    for (const c of report.cusps) {
      expect(c.house).toBeGreaterThanOrEqual(1);
      expect(c.house).toBeLessThanOrEqual(12);
      expect(c.signLord).toBeDefined();
      expect(c.starLord).toBeDefined();
      expect(c.subLord).toBeDefined();
      expect(c.subSubLord).toBeDefined();
      expect(c.sslStarLord).toBeDefined();
      expect(c.sslSubLord).toBeDefined();
      expect(c.sslIndex2193).toBeGreaterThanOrEqual(1);
      expect(c.sslIndex2193).toBeLessThanOrEqual(2193);
    }
  });

  it('evaluates cuspal promises for all 8 foundational life topics', () => {
    const report = computeKpCuspalInterlinksReport(chart);
    expect(report.cuspalPromises.length).toBe(8);

    const topics = report.cuspalPromises.map((p) => p.topic);
    expect(topics.some((t) => t.includes('Marriage'))).toBe(true);
    expect(topics.some((t) => t.includes('Career'))).toBe(true);
    expect(topics.some((t) => t.includes('Wealth'))).toBe(true);
    expect(topics.some((t) => t.includes('Health'))).toBe(true);
    expect(topics.some((t) => t.includes('Higher Studies'))).toBe(true);
    expect(topics.some((t) => t.includes('Childbirth'))).toBe(true);
    expect(topics.some((t) => t.includes('Foreign Travel'))).toBe(true);
    expect(topics.some((t) => t.includes('Property'))).toBe(true);

    for (const p of report.cuspalPromises) {
      expect(p.verdict).toBeDefined();
      expect(p.analysisEn).toBeTruthy();
      expect(p.analysisHi).toBeTruthy();
    }
  });
});
