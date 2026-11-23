import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS, SAMPLE_CHARTS } from '../../data/cities';
import { computeKarakatwaPredictions } from '../predictions/karakatwaPrediction';

describe('Karakatwa-based reader-first predictions', () => {
  const baseChart = () => calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);

  it('provides the three agreed reader-facing prediction areas in Hindi and English', () => {
    const report = computeKarakatwaPredictions(baseChart());
    expect(report.predictions.map((item) => item.id)).toEqual(['appearance', 'siblings', 'personality']);
    expect(report.titleHi).toContain('कारकत्व');
    for (const item of report.predictions) {
      expect(item.predictionEn.length).toBeGreaterThan(50);
      expect(item.predictionHi.length).toBeGreaterThan(50);
      expect(['single-indication', 'corroborated', 'mixed', 'insufficient']).toContain(item.evidenceLevel);
      expect(item.caveatEn.length).toBeGreaterThan(30);
      expect(item.caveatHi.length).toBeGreaterThan(30);
    }
  });

  it('recognises benefic influence on the ascendant as appearance evidence', () => {
    const chart = baseChart();
    const modified = {
      ...chart,
      planets: chart.planets.map((planet) =>
        planet.id === 'Jupiter' ? { ...planet, rasiHouseNumber: 1 } : planet,
      ),
    };
    const appearance = computeKarakatwaPredictions(modified).predictions.find((item) => item.id === 'appearance');
    expect(appearance?.evidence.some((item) => item.id === 'appearance-benefic-lagna')).toBe(true);
  });

  it('examines third-house benefic influence and Mars without asserting sibling count', () => {
    const chart = baseChart();
    const modified = {
      ...chart,
      planets: chart.planets.map((planet) =>
        planet.id === 'Jupiter' ? { ...planet, rasiHouseNumber: 3 } : planet,
      ),
    };
    const siblings = computeKarakatwaPredictions(modified).predictions.find((item) => item.id === 'siblings');
    expect(siblings?.evidence.some((item) => item.id === 'siblings-benefic-third')).toBe(true);
    expect(siblings?.predictionEn).not.toMatch(/no younger siblings|sibling will die|siblings will die/i);
    expect(siblings?.caveatEn).toContain('not a census');
  });

  it('keeps nakshatra and D3 as separately labelled supplementary evidence', () => {
    const report = computeKarakatwaPredictions(baseChart());
    const allEvidence = report.predictions.flatMap((item) => item.evidence);
    expect(allEvidence.some((item) => item.id.startsWith('nakshatra-'))).toBe(true);
    expect(allEvidence.some((item) => item.id === 'siblings-d3-cross-check')).toBe(true);
    expect(allEvidence.filter((item) => item.sourceStatus === 'research-hypothesis')
      .every((item) => item.kind === 'context')).toBe(true);
  });

  it('does not convert classical Sun/Saturn hair descriptions into baldness predictions', () => {
    const report = computeKarakatwaPredictions(baseChart());
    const appearance = report.predictions.find((item) => item.id === 'appearance');
    expect(appearance?.predictionEn).not.toMatch(/bald|hair loss|alopecia/i);
    expect(appearance?.evidence.filter((item) => item.id.startsWith('appearance-hair-'))
      .every((item) => item.kind === 'context' && /does not establish/i.test(item.detailEn))).toBe(true);
  });

  it('includes calculated degree, yuti and drishti evidence without mislabelling it as a text citation', () => {
    const report = computeKarakatwaPredictions(baseChart());
    for (const item of report.predictions) {
      expect(item.evidence.some((evidence) => evidence.sourceStatus === 'calculated-data'
        && evidence.factor.startsWith('Calculated placement:'))).toBe(true);
      for (const evidence of item.evidence.filter((entry) => entry.sourceStatus === 'calculated-data')) {
        expect(evidence.source).toContain('Calculated');
      }
    }
    const chart = baseChart();
    const moon = chart.planets.find((planet) => planet.id === 'Moon')!;
    const modified = {
      ...chart,
      planets: chart.planets.map((planet) => planet.id === 'Sun'
        ? { ...planet, signIndex: moon.signIndex, longitude: moon.longitude + 2 }
        : planet),
    };
    const personality = computeKarakatwaPredictions(modified).predictions.find((item) => item.id === 'personality');
    expect(personality?.evidence.some((item) => item.factor.startsWith('Same-sign yuti review:'))).toBe(true);
  });

  it('produces chart-specific evidence across multiple natal charts', () => {
    const reports = SAMPLE_CHARTS.slice(0, 4).map((sample) =>
      computeKarakatwaPredictions(calculateChart(sample, DEFAULT_SETTINGS)),
    );
    const signatures = reports.map((report) => report.predictions
      .map((item) => item.evidence.map((evidence) => evidence.id + ':' + evidence.kind).join(','))
      .join('|'));
    expect(new Set(signatures).size).toBeGreaterThan(1);
  });
});
