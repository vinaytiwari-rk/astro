import { describe, it, expect } from 'vitest';
import {
  SIGN_YEARS_MILESTONES,
  DREKKANA_36_CORPUS,
  GULIKA_HOUSES_CORPUS,
  PLANET_HOUSE_BOOK_CORPUS,
  GOCHARA_BOOK_CORPUS,
  getSignMilestones,
  getPlanetHouseBookRecord,
  getDrekkanaRecord,
  getGocharaBookRecord,
  getGulikaHouseRecord
} from '../predictions/classicalBookData';
import { computeLifeMilestonesEngine } from '../predictions/lifeMilestonesEngine';
import type { ChartData } from '../types';

describe('Classical Book Knowledge Base & Exact Sutras', () => {
  it('contains complete 12 sign milestones with exact auspicious and inauspicious years', () => {
    expect(SIGN_YEARS_MILESTONES.length).toBe(12);
    for (let i = 0; i < 12; i++) {
      const rec = getSignMilestones(i);
      expect(rec.auspiciousYears.length).toBeGreaterThanOrEqual(5);
      expect(rec.inauspiciousYears.length).toBeGreaterThanOrEqual(5);
      expect(rec.physicalFeaturesEn.length).toBeGreaterThan(10);
      expect(rec.careerFitHi.length).toBeGreaterThan(10);
    }
  });

  it('contains complete 36 Drekkanas with classical classifications and 22nd Drekkana indicators', () => {
    expect(DREKKANA_36_CORPUS.length).toBe(36);
    const classes = new Set(DREKKANA_36_CORPUS.map((d) => d.classification));
    expect(classes.has('Ayudha')).toBe(true);
    expect(classes.has('Sarpa')).toBe(true);
    expect(classes.has('Nigada')).toBe(true);
    expect(classes.has('Pakshi')).toBe(true);

    const drek = getDrekkanaRecord(0, 5.5);
    expect(drek.signIndex).toBe(0);
    expect(drek.drekkanaNumber).toBe(1);
    expect(drek.classification).toBe('Ayudha');
  });

  it('contains complete 108 planet-house combinations with age milestones and Stree Jataka sutras', () => {
    expect(PLANET_HOUSE_BOOK_CORPUS.length).toBe(108);
    const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
    for (const p of planets) {
      for (let h = 1; h <= 12; h++) {
        const rec = getPlanetHouseBookRecord(p, h);
        expect(rec).toBeDefined();
        expect(rec?.baseEn.length).toBeGreaterThan(20);
        expect(rec?.baseHi.length).toBeGreaterThan(20);
        expect(rec?.ageMilestones.length).toBeGreaterThanOrEqual(1);
        expect(rec?.femaleHoroscope.en.length).toBeGreaterThan(15);
        expect(rec?.femaleHoroscope.hi.length).toBeGreaterThan(15);
      }
    }
  });

  it('contains complete 108 Gochara transit records and 12 Gulika house records', () => {
    expect(GOCHARA_BOOK_CORPUS.length).toBe(108);
    expect(GULIKA_HOUSES_CORPUS.length).toBe(12);

    const saturn3 = getGocharaBookRecord('Saturn', 3);
    expect(saturn3?.isFavorable).toBe(true);

    const gulika1 = getGulikaHouseRecord(1);
    expect(gulika1?.titleHi).toContain('गुलिक/मांदि लग्न में');
  });
});

describe('Life Milestones Engine (आयु कालचक्र व स्त्री जातक)', () => {
  const sampleFemaleChart: ChartData = {
    input: {
      date: '1995-05-15',
      time: '14:30:00',
      lat: 28.6139,
      lon: 77.209,
      timezone: 5.5,
      gender: 'female'
    },
    utcMs: Date.UTC(1995, 4, 15, 9, 0, 0),
    ascendant: {
      signIndex: 4, // Leo (सिंह)
      longitude: 135.5,
      degreeInSign: 15.5
    },
    planets: [
      { id: 'Sun', houseNumber: 10, signIndex: 1, longitude: 30.5, degreeInSign: 0.5 },
      { id: 'Moon', houseNumber: 4, signIndex: 7, longitude: 220.5, degreeInSign: 10.5 },
      { id: 'Mars', houseNumber: 1, signIndex: 4, longitude: 130.2, degreeInSign: 10.2 },
      { id: 'Mercury', houseNumber: 10, signIndex: 1, longitude: 45.1, degreeInSign: 15.1 },
      { id: 'Jupiter', houseNumber: 4, signIndex: 7, longitude: 232.0, degreeInSign: 22.0 },
      { id: 'Venus', houseNumber: 9, signIndex: 0, longitude: 15.4, degreeInSign: 15.4 },
      { id: 'Saturn', houseNumber: 8, signIndex: 11, longitude: 340.2, degreeInSign: 10.2 },
      { id: 'Rahu', houseNumber: 3, signIndex: 6, longitude: 190.5, degreeInSign: 10.5 },
      { id: 'Ketu', houseNumber: 9, signIndex: 0, longitude: 10.5, degreeInSign: 10.5 }
    ]
  } as any;

  it('computes chronological timeline, categories, and Stree Jataka for female native', () => {
    const report = computeLifeMilestonesEngine(sampleFemaleChart);
    expect(report.currentAge).toBeGreaterThan(25);
    expect(report.birthYear).toBe(1995);
    expect(report.isFemaleNative).toBe(true);

    // Milestones must be strictly sorted by age ascending
    expect(report.milestones.length).toBeGreaterThan(15);
    for (let i = 1; i < report.milestones.length; i++) {
      expect(report.milestones[i].age).toBeGreaterThanOrEqual(report.milestones[i - 1].age);
    }

    // Must have Stree Jataka entries for female
    expect(report.streeJatakaReadings.length).toBe(9);
    expect(report.streeJatakaReadings[0].sutraHi.length).toBeGreaterThan(10);

    // Drekkana analysis
    expect(report.drekkanaAnalysis.lagnaDrekkana).toBeDefined();
    expect(report.drekkanaAnalysis.twentySecondDrekkana).toBeDefined();
    expect(report.summary.totalMilestones).toBe(report.milestones.length);
  });
});
