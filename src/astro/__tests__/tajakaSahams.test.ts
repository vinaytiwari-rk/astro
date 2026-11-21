import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { computeTajaka50Sahams, TAJAKA_DEEPTAMSHAS } from '../tajakaSahams';
import type { BirthInput } from '../types';

describe('Tajaka 50 Sahams Engine (Parashara / Neelakanthi Parity)', () => {
  const sampleBirth: BirthInput = {
    id: 'test-native',
    name: 'Sample Native',
    date: '1995-10-15',
    time: '14:30:00',
    latitude: 28.6139,
    longitude: 77.209,
    timezone: 'Asia/Kolkata',
    utcOffsetMinutes: 330,
    city: 'New Delhi',
    country: 'India',
  };

  const chart = calculateChart(sampleBirth);

  it('computes exactly 50 classical Sahams without omissions', () => {
    const report = computeTajaka50Sahams(chart);
    expect(report.sahams.length).toBe(50);
  });

  it('determines diurnal vs nocturnal birth accurately', () => {
    const report = computeTajaka50Sahams(chart);
    // Born at 14:30 local time in Delhi (Sun in 8th/9th house, above horizon) -> Day birth
    expect(report.isDayBirth).toBe(true);
    expect(report.birthTypeEn).toContain('Day Birth');
    expect(report.birthTypeHi).toContain('दिन का जन्म');
  });

  it('contains essential cornerstone Sahams with valid longitudes and houses', () => {
    const report = computeTajaka50Sahams(chart);
    const punya = report.sahams.find((s) => s.id === 'punya');
    const vidya = report.sahams.find((s) => s.id === 'vidya');
    const yashas = report.sahams.find((s) => s.id === 'yashas');
    const karma = report.sahams.find((s) => s.id === 'karma');
    const dhana = report.sahams.find((s) => s.id === 'dhana');
    const vivaha = report.sahams.find((s) => s.id === 'vivaha');

    expect(punya).toBeDefined();
    expect(vidya).toBeDefined();
    expect(yashas).toBeDefined();
    expect(karma).toBeDefined();
    expect(dhana).toBeDefined();
    expect(vivaha).toBeDefined();

    expect(punya!.longitude).toBeGreaterThanOrEqual(0);
    expect(punya!.longitude).toBeLessThan(360);
    expect(punya!.house).toBeGreaterThanOrEqual(1);
    expect(punya!.house).toBeLessThanOrEqual(12);
  });

  it('categorizes all 50 Sahams into 5 foundational domains', () => {
    const report = computeTajaka50Sahams(chart);
    const categories = Object.keys(report.categorySummary);
    expect(categories).toContain('Spiritual & Dharma');
    expect(categories).toContain('Wealth & Career');
    expect(categories).toContain('Family & Relationships');
    expect(categories).toContain('Vitality & Health');
    expect(categories).toContain('Enterprise & Travel');

    const totalCount = Object.values(report.categorySummary).reduce((a, b) => a + b, 0);
    expect(totalCount).toBe(50);
  });

  it('verifies standard Tajaka Deeptamshas (orbs)', () => {
    expect(TAJAKA_DEEPTAMSHAS.Sun).toBe(15);
    expect(TAJAKA_DEEPTAMSHAS.Moon).toBe(12);
    expect(TAJAKA_DEEPTAMSHAS.Mars).toBe(8);
    expect(TAJAKA_DEEPTAMSHAS.Jupiter).toBe(9);
    expect(TAJAKA_DEEPTAMSHAS.Saturn).toBe(9);
    expect(TAJAKA_DEEPTAMSHAS.Mercury).toBe(7);
    expect(TAJAKA_DEEPTAMSHAS.Venus).toBe(7);
  });
});
