import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { computeBhavabalaReport } from '../bhavabalaEngine';
import type { BirthInput } from '../types';

describe('Kala 2018 Bhavabala in Rupas & Virupas Engine', () => {
  const sampleBirth: BirthInput = {
    id: 'test-bhavabala',
    name: 'Bhavabala Test Native',
    date: '1985-03-21',
    time: '18:45:00',
    latitude: 22.5726,
    longitude: 88.3639,
    timezone: 'Asia/Kolkata',
    utcOffsetMinutes: 330,
    city: 'Kolkata',
    country: 'India',
  };

  const chart = calculateChart(sampleBirth);

  it('computes Bhavabala for all 12 houses with the 4 classical components', () => {
    const report = computeBhavabalaReport(chart);
    expect(report.houses.length).toBe(12);

    for (const h of report.houses) {
      expect(h.house).toBeGreaterThanOrEqual(1);
      expect(h.house).toBeLessThanOrEqual(12);
      expect(h.bhavadhipatiBalaVirupas).toBeGreaterThan(0);
      expect(h.bhavaDigbalaVirupas).toBeGreaterThanOrEqual(0);
      expect(h.bhavaDigbalaVirupas).toBeLessThanOrEqual(60);
      expect(typeof h.bhavaDrishtiBalaVirupas).toBe('number');
      expect(h.bhavaDinaRatriBalaVirupas).toBeGreaterThanOrEqual(0);
      expect(h.totalVirupas).toBeGreaterThan(0);
      expect(h.totalRupas).toBeGreaterThan(0);
      expect(h.rank).toBeGreaterThanOrEqual(1);
      expect(h.rank).toBeLessThanOrEqual(12);
      expect(h.potencyVerdict).toBeDefined();
    }
  });

  it('correctly ranks houses from 1 (strongest) to 12 (weakest)', () => {
    const report = computeBhavabalaReport(chart);
    const ranks = report.houses.map((h) => h.rank).sort((a, b) => a - b);
    expect(ranks).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(report.strongestHouse).toBeGreaterThanOrEqual(1);
    expect(report.weakestHouse).toBeGreaterThanOrEqual(1);
    expect(report.averageRupas).toBeGreaterThan(0);
  });
});
