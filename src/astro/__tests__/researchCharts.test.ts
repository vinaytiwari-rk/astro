import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { RESEARCH_BENCHMARK_CHARTS } from '../../data/researchCharts';

describe('11,500 Research Benchmark Charts Curated Database', () => {
  it('contains at least 25 iconic benchmark charts across 5 categories', () => {
    expect(RESEARCH_BENCHMARK_CHARTS.length).toBeGreaterThanOrEqual(25);
    const categories = new Set(RESEARCH_BENCHMARK_CHARTS.map((c) => c.category));
    expect(categories.has('Scientists & Geniuses')).toBe(true);
    expect(categories.has('Spiritual Masters')).toBe(true);
    expect(categories.has('World Leaders')).toBe(true);
    expect(categories.has('Masters of Arts')).toBe(true);
    expect(categories.has('Industrial Pioneers')).toBe(true);
  });

  it('validates each chart has complete metadata, bilingual notes, and valid dates', () => {
    for (const c of RESEARCH_BENCHMARK_CHARTS) {
      expect(c.id).toBeTruthy();
      expect(c.name).toBeTruthy();
      expect(c.nameHi).toBeTruthy();
      expect(c.category).toBeTruthy();
      expect(c.categoryHi).toBeTruthy();
      expect(c.birthInput.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(c.birthInput.time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      expect(typeof c.birthInput.latitude).toBe('number');
      expect(typeof c.birthInput.longitude).toBe('number');
      expect(c.keyAstrologicalHighlightsEn).toBeTruthy();
      expect(c.keyAstrologicalHighlightsHi).toBeTruthy();
      expect(c.biographicalNoteEn).toBeTruthy();
      expect(c.biographicalNoteHi).toBeTruthy();
    }
  });

  it('successfully calculates a full Vedic chart for Albert Einstein', () => {
    const einstein = RESEARCH_BENCHMARK_CHARTS.find((c) => c.id === 'rc-einstein');
    expect(einstein).toBeDefined();
    const chart = calculateChart(einstein!.birthInput);
    expect(chart.ascendant.signName).toBe('Gemini');
    // Venus in Pisces in 10th house
    const venus = chart.planets.find((p) => p.id === 'Venus');
    expect(venus).toBeDefined();
    expect(venus!.signName).toBe('Pisces');
  });

  it('successfully calculates a full Vedic chart for Swami Vivekananda', () => {
    const vivekananda = RESEARCH_BENCHMARK_CHARTS.find((c) => c.id === 'rc-vivekananda');
    expect(vivekananda).toBeDefined();
    const chart = calculateChart(vivekananda!.birthInput);
    expect(chart.ascendant.signName).toBe('Sagittarius');
    const sun = chart.planets.find((p) => p.id === 'Sun');
    expect(sun).toBeDefined();
    expect(sun!.signName).toBe('Sagittarius');
    const mars = chart.planets.find((p) => p.id === 'Mars');
    expect(mars).toBeDefined();
    expect(mars!.signName).toBe('Aries');
  });
});
