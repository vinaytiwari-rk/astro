import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { computeKakshyaGocharReport } from '../predictions/kakshyaGocharEngine';
import type { BirthInput } from '../types';

describe('Ashtakavarga Kakshya Micro-Transit Engine (Parashara Parity)', () => {
  const natalBirth: BirthInput = {
    id: 'test-natal',
    name: 'Natal Test Native',
    date: '1990-05-20',
    time: '08:30:00',
    latitude: 19.076,
    longitude: 72.8777,
    timezone: 'Asia/Kolkata',
    utcOffsetMinutes: 330,
    city: 'Mumbai',
    country: 'India',
  };

  const transitBirth: BirthInput = {
    id: 'test-transit',
    name: 'Transit Test',
    date: '2026-11-21',
    time: '12:00:00',
    latitude: 19.076,
    longitude: 72.8777,
    timezone: 'Asia/Kolkata',
    utcOffsetMinutes: 330,
    city: 'Mumbai',
    country: 'India',
  };

  const natalChart = calculateChart(natalBirth);
  const transitChart = calculateChart(transitBirth);

  it('computes kakshya details for all 7 classical planets', () => {
    const report = computeKakshyaGocharReport(natalChart, transitChart);
    expect(report.allPlanets.length).toBe(7);
    const planets = report.allPlanets.map((p) => p.planet);
    expect(planets).toContain('Saturn');
    expect(planets).toContain('Jupiter');
    expect(planets).toContain('Mars');
    expect(planets).toContain('Sun');
    expect(planets).toContain('Venus');
    expect(planets).toContain('Mercury');
    expect(planets).toContain('Moon');
  });

  it('divides each transited sign into exactly 8 Kakshya slots of 3°45 each', () => {
    const report = computeKakshyaGocharReport(natalChart, transitChart);
    for (const p of report.allPlanets) {
      expect(p.kakshyaSlots.length).toBe(8);
      expect(p.currentKakshyaNumber).toBeGreaterThanOrEqual(1);
      expect(p.currentKakshyaNumber).toBeLessThanOrEqual(8);

      // Verify exact Kakshya lord sequence
      const lords = p.kakshyaSlots.map((s) => s.lord);
      expect(lords).toEqual(['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Asc']);

      // Exactly one slot should be active now
      const activeSlots = p.kakshyaSlots.filter((s) => s.isActiveNow);
      expect(activeSlots.length).toBe(1);
    }
  });

  it('calculates overall favorability percentage and actionable status categories', () => {
    const report = computeKakshyaGocharReport(natalChart, transitChart);
    expect(report.kakshyaFavorabilityPercent).toBeGreaterThanOrEqual(0);
    expect(report.kakshyaFavorabilityPercent).toBeLessThanOrEqual(100);
    expect(report.activePlanetsWithBindu).toBeGreaterThanOrEqual(0);
    expect(report.activePlanetsWithBindu).toBeLessThanOrEqual(7);

    expect(report.majorSlowMovers.saturn).toBeDefined();
    expect(report.majorSlowMovers.jupiter).toBeDefined();
    expect(report.majorSlowMovers.mars).toBeDefined();
  });
});
