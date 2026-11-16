import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS, SAMPLE_CHARTS } from '../../data/cities';
import {
  computeSudarshanChakra,
  computeSarvatobhadraChakra,
  computeKotaChakra,
  computeKurmaChakra,
} from '../specialChakras';

describe('Special Classical Vedic Chakras', () => {
  const sample = SAMPLE_CHARTS[0];
  const chart = calculateChart(sample, DEFAULT_SETTINGS);

  it('computes Sudarshan Chakra tripartite wheels (Lagna, Chandra, Surya) and yearly progression', () => {
    const sudarshan = computeSudarshanChakra(chart, 2026);
    expect(sudarshan.ageYears).toBeGreaterThan(0);
    expect(sudarshan.activeHouse).toBeGreaterThanOrEqual(1);
    expect(sudarshan.activeHouse).toBeLessThanOrEqual(12);
    expect(sudarshan.houses.length).toBe(12);

    // Verify first house in lagna wheel matches natal lagna
    expect(sudarshan.houses[0].lagnaSign).toBe(chart.ascendant.signIndex);
    expect(sudarshan.houses[0].houseNumber).toBe(1);

    // Verify Chandra sign matches natal Moon
    const moon = chart.planets.find((p) => p.id === 'Moon');
    expect(sudarshan.moonSign).toBe(moon?.signIndex);

    // Verify Surya sign matches natal Sun
    const sun = chart.planets.find((p) => p.id === 'Sun');
    expect(sudarshan.sunSign).toBe(sun?.signIndex);

    expect(sudarshan.annualSynthesisEn).toBeDefined();
    expect(sudarshan.annualSynthesisHi).toBeDefined();
  });

  it('computes Sarvatobhadra Chakra with special sensitive points and vedhas', () => {
    const sbc = computeSarvatobhadraChakra(chart);
    expect(sbc.janmaNakshatra).toBeDefined();
    expect(sbc.specialPoints.length).toBeGreaterThanOrEqual(9);

    // Verify key sensitive points exist
    const janma = sbc.specialPoints.find((p) => p.key === 'janma');
    expect(janma).toBeDefined();
    expect(janma?.titleEn).toContain('Janma');

    const karma = sbc.specialPoints.find((p) => p.key === 'karma');
    expect(karma).toBeDefined();

    const adhana = sbc.specialPoints.find((p) => p.key === 'adhana');
    expect(adhana).toBeDefined();

    const vainashika = sbc.specialPoints.find((p) => p.key === 'vainashika');
    expect(vainashika).toBeDefined();

    // Verify vedha counts exist
    expect(typeof sbc.maleficVedhaCount).toBe('number');
    expect(typeof sbc.beneficVedhaCount).toBe('number');
    expect(sbc.summaryHi).toBeDefined();
    expect(sbc.summaryEn).toBeDefined();
  });

  it('computes Kota Chakra fortress rings, Kota Swami, Kota Pala, and siege index', () => {
    const kota = computeKotaChakra(chart);
    expect(kota.stambhaNakshatras.length).toBeGreaterThan(0);
    expect(kota.madhyaNakshatras.length).toBeGreaterThan(0);
    expect(kota.kantakaNakshatras.length).toBeGreaterThan(0);
    expect(kota.bahyaNakshatras.length).toBeGreaterThan(0);

    // Total nakshatras across rings should sum to 27
    const totalNakshatras =
      kota.stambhaNakshatras.length +
      kota.madhyaNakshatras.length +
      kota.kantakaNakshatras.length +
      kota.bahyaNakshatras.length;
    expect(totalNakshatras).toBe(27);

    expect(kota.kotaSwami).toBeDefined();
    expect(kota.kotaPala).toBeDefined();
    expect(typeof kota.siegeRiskScore).toBe('number');
    expect(kota.defenseStrengthEn).toBeDefined();
    expect(kota.defenseStrengthHi).toBeDefined();
    expect(kota.placements.length).toBeGreaterThanOrEqual(7);
  });

  it('computes Kurma Chakra 9 directional segments and territorial safety', () => {
    const kurma = computeKurmaChakra(chart);
    expect(kurma.zones.length).toBe(9);

    // Directions include Center and 8 compass points
    const directions = kurma.zones.map((s) => s.direction);
    expect(directions).toContain('center');
    expect(directions).toContain('east');
    expect(directions).toContain('north');

    for (const zone of kurma.zones) {
      expect(zone.nakshatras.length).toBeGreaterThan(0);
      expect(zone.statusEn).toBeDefined();
      expect(zone.statusHi).toBeDefined();
    }

    expect(kurma.guidanceEn).toBeDefined();
    expect(kurma.guidanceHi).toBeDefined();
  });
});
