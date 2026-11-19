import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS, SAMPLE_CHARTS } from '../../data/cities';
import { computeTwelvePlanetsPredictions } from '../predictions/twelvePlanetsPredictions';
import { computeDeepGochar } from '../predictions/gocharDeep';

describe('Planet-wise prediction timing integrity', () => {
  it('does not publish generic fixed-age windows for any planet', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeTwelvePlanetsPredictions(chart, Date.UTC(2026, 10, 19));
    expect(report.planets.length).toBeGreaterThanOrEqual(9);
    expect(report.criticalPlanetaryAlertsEn).toEqual([]);
    expect(report.criticalPlanetaryAlertsHi).toEqual([]);
    for (const planet of report.planets) {
      expect(planet.keyAgeWindows).toEqual([]);
      expect(planet.timingTriggersEn.length).toBeGreaterThan(20);
      expect(planet.timingTriggersHi.length).toBeGreaterThan(10);
      expect(planet.timingTriggersEn).not.toMatch(/age 40|age 42|age 36|midlife/i);
      const interpretation = [...planet.positiveEventsEn, ...planet.negativeEventsEn, ...planet.remediesEn].join(' ');
      expect(interpretation).not.toMatch(/heart disease|cardiovascular|major surgery|bankruptcy|criminal|hospitalization|miscarriage|guaranteed/i);
      expect(planet.positiveEventsEn.length).toBeGreaterThan(0);
      expect(planet.negativeEventsEn.length).toBeGreaterThan(0);
      expect(planet.remediesEn).toHaveLength(1);
    }
  });

  it('states that timing is unavailable rather than inventing a period when dasha data is empty', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeTwelvePlanetsPredictions({ ...chart, vimshottari: [] }, Date.UTC(2026, 10, 19));
    for (const planet of report.planets) {
      expect(planet.timingTriggersEn).toMatch(/no timing is stated/i);
    }
  });

  it('includes date-specific gochar houses and assessment for classical grahas', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeTwelvePlanetsPredictions(chart, Date.UTC(2026, 10, 19));
    const classical = report.planets.find((planet) => planet.id === 'Jupiter');
    expect(classical).toBeDefined();
    if (classical?.transitEvidenceEn) {
      expect(classical.transitEvidenceEn).toMatch(/Current transit \(2026-11-19\)/);
      expect(classical.transitEvidenceEn).toMatch(/House \d+ from natal Moon/);
      expect(classical.transitEvidenceEn).toMatch(/Gochar assessment:/);
    }
    const outer = report.planets.find((planet) => planet.id === 'Uranus');
    expect(outer?.transitEvidenceEn).toBeNull();
  });

  it('reports ephemeris-derived direct or retrograde motion for every classical transit item', () => {
    const chart = calculateChart(SAMPLE_CHARTS[3], DEFAULT_SETTINGS);
    const report = computeDeepGochar(chart, '2026-11-19');
    expect(report.items).toHaveLength(9);
    expect(report.overallSummary).toMatch(/does not guarantee an event|no Double Transit conclusion is drawn/i);
    expect(report.overallSummary).not.toMatch(/priming these life areas for concrete events|encouraging gradual preparation/i);
    for (const item of report.items) {
      const transitPosition = report.transitChart.planets.find((planet) => planet.id === item.planet);
      expect(transitPosition).toBeDefined();
      expect(item.speedDegPerDay).toBe(transitPosition?.speedDegPerDay);
      expect(item.isRetrograde).toBe(transitPosition?.isRetrograde);
      expect(['Direct', 'Retrograde', 'Stationary']).toContain(item.motionLabel);
      expect(item.reading).toContain(item.motionLabel.toLowerCase());
      expect(Number.isFinite(item.speedDegPerDay)).toBe(true);
      expect(item.isRetrograde).toBe(item.speedDegPerDay < 0);
    }
    const planetReport = computeTwelvePlanetsPredictions(chart, Date.UTC(2026, 10, 19));
    const jupiter = planetReport.planets.find((planet) => planet.id === 'Jupiter');
    expect(jupiter?.transitEvidenceEn).toMatch(/Motion: (direct|retrograde|stationary) at [-0-9.]+°\/day/);
    expect(jupiter?.transitEvidenceHi).toMatch(/गति: (वक्री|स्थिर|मार्गी)/);
  });

  it('shows the combined Mahadasha-Antardasha-Pratyantardasha path in planet-wise timing', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const nestedPeriods = [{
      lord: 'Saturn', level: 1 as const, startMs: 0, endMs: 1000, durationDays: 1,
      children: [{
        lord: 'Jupiter', level: 2 as const, startMs: 0, endMs: 1000, durationDays: 1,
        children: [{ lord: 'Mercury', level: 3 as const, startMs: 0, endMs: 1000, durationDays: 1 }],
      }],
    }];
    const report = computeTwelvePlanetsPredictions({ ...chart, vimshottari: nestedPeriods }, 500);
    const mercury = report.planets.find((planet) => planet.id === 'Mercury');
    expect(mercury?.timingTriggersEn).toContain('Saturn Mahadasha → Jupiter Antardasha → Mercury Pratyantardasha');
    expect(mercury?.timingTriggersHi).toContain('वर्तमान संयुक्त विंशोत्तरी क्रम');
  });

  it('produces chart-specific planet readings rather than reusing one generic profile', () => {
    const reports = SAMPLE_CHARTS.slice(0, 3).map((sample) =>
      computeTwelvePlanetsPredictions(calculateChart(sample, DEFAULT_SETTINGS), Date.UTC(2026, 10, 19)),
    );
    const jupiterReadings = reports.map((report) => {
      const jupiter = report.planets.find((planet) => planet.id === 'Jupiter');
      expect(jupiter).toBeDefined();
      return JSON.stringify({
        placement: jupiter?.placementSummaryEn,
        dignity: jupiter?.dignity,
        positive: jupiter?.positiveEventsEn,
        negative: jupiter?.negativeEventsEn,
        ownedHouses: jupiter?.ownedHouses,
      });
    });
    expect(new Set(jupiterReadings).size).toBeGreaterThan(1);
  });
});
