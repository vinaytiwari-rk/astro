import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS } from '../../data/cities';
import type { BirthInput } from '../types';
import { computeAstrocartography } from '../astrocartography';
import { findCelebrityTwins } from '../celebrityTwins';
import { computeHumanDesign } from '../humanDesign';
import { computeVarshaphala } from '../varshaphala';

const sampleInput: BirthInput = {
  id: 'test-native-1',
  name: 'Test Native',
  gender: 'male',
  date: '1990-05-15',
  time: '14:30:00',
  city: 'New Delhi',
  country: 'India',
  latitude: 28.6139,
  longitude: 77.209,
  timezone: 'Asia/Kolkata',
};

describe('Modern and Classical Global Astrology Suites', () => {
  const chart = calculateChart(sampleInput, DEFAULT_SETTINGS);

  it('computes Astrocartography planetary lines and top power cities across the globe', () => {
    const report = computeAstrocartography(chart);
    expect(report.planetaryLines.length).toBeGreaterThanOrEqual(9);
    expect(report.topPowerCities.length).toBeGreaterThan(20);
    expect(report.objectiveRecommendations.length).toBeGreaterThanOrEqual(4);

    const firstCity = report.topPowerCities[0];
    expect(firstCity.city).toBeDefined();
    expect(firstCity.country).toBeDefined();
    expect(firstCity.activeLines.length).toBeGreaterThan(0);
  });

  it('matches Celebrity Kundli Twins with similarity scoring and classical yogas', () => {
    const matches = findCelebrityTwins(chart);
    expect(matches.length).toBeGreaterThan(0);
    const top = matches[0];
    expect(top.celebrity.nameEn).toBeDefined();
    expect(top.similarityScore).toBeGreaterThanOrEqual(0);
    expect(top.similarityScore).toBeLessThanOrEqual(100);
    expect(top.astrologicalSynergyEn).toBeDefined();
    expect(top.nativeGuidanceEn).toBeDefined();
  });

  it('computes Human Design 9-Center BodyGraph and I-Ching Gate activations', () => {
    const hd = computeHumanDesign(chart);
    expect(['Generator', 'Manifesting Generator', 'Projector', 'Manifestor', 'Reflector']).toContain(
      hd.energyType
    );
    expect(hd.centers.length).toBe(9);
    expect(hd.activeGates.length).toBeGreaterThanOrEqual(9);
    expect(hd.profileEn).toBeDefined();
    expect(hd.authority).toBeDefined();
  });

  it('computes Tajika Varshaphala with Muntha, Varshesh, Mudda Dasha, and Sahams', () => {
    const vp = computeVarshaphala(chart, 2026);
    expect(vp.year).toBe(2026);
    expect(vp.completedYears).toBe(36);
    expect(vp.varshesh).toBeDefined();
    expect(vp.munthaHouse).toBeGreaterThanOrEqual(1);
    expect(vp.munthaHouse).toBeLessThanOrEqual(12);
    expect(vp.muddaDasha.length).toBe(9);
    expect(vp.sahams.length).toBeGreaterThanOrEqual(10);
  });
});
