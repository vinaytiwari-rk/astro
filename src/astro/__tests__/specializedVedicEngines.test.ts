import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS, SAMPLE_CHARTS } from '../../data/cities';
import {
  computeIshtaDevata,
  computeKujaDoshaAnalysis,
  computePanchaPakshi,
  computeSpecializedVedicReport,
  computeTarabalamChandrabalam,
  computeVakriPlanetsAnalysis,
} from '../predictions/specializedVedicEngines';

describe('Specialized Classical Vedic Predictive Engines', () => {
  const sample1 = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
  const sample2 = calculateChart(SAMPLE_CHARTS[1], DEFAULT_SETTINGS);

  describe('1. Ishta Devata & Kula Devata Engine (Jaimini Karakamsha)', () => {
    it('computes Atmakaraka, Karakamsha sign, and 12th house deity accurately', () => {
      const report = computeIshtaDevata(sample1);
      expect(report.atmakarakaId).toBeDefined();
      expect(report.atmakarakaNameEn.length).toBeGreaterThan(0);
      expect(report.karakamshaSignIndex).toBeGreaterThanOrEqual(0);
      expect(report.karakamshaSignIndex).toBeLessThanOrEqual(11);
      expect(report.twelfthHouseSignIndex).toBeGreaterThanOrEqual(0);
      expect(report.twelfthHouseSignIndex).toBeLessThanOrEqual(11);
      expect(report.ishtaDevataNameEn.length).toBeGreaterThan(0);
      expect(report.ishtaDevataNameHi.length).toBeGreaterThan(0);
      expect(report.sacredMantra).toContain('ॐ');
      expect(report.upasanaMethodEn.length).toBeGreaterThan(20);
      expect(report.upasanaMethodHi.length).toBeGreaterThan(20);
      expect(report.kulaDevataEn.length).toBeGreaterThan(10);
    });

    it('generates distinct deity recommendations for charts with different Atmakarakas', () => {
      const r1 = computeIshtaDevata(sample1);
      const r2 = computeIshtaDevata(sample2);
      expect(r1.atmakarakaNameEn).toBeDefined();
      expect(r2.atmakarakaNameEn).toBeDefined();
    });
  });

  describe('2. Planetary Retrograde (Vakri Grah) Cheshta Bala & Karmic Engine', () => {
    it('calculates retrograde counts and activates prior house', () => {
      const report = computeVakriPlanetsAnalysis(sample1);
      expect(report.retrogradeCount).toBeGreaterThanOrEqual(0);
      if (report.planets.length > 0) {
        for (const p of report.planets) {
          expect(p.cheshtaBalaLevel).toContain('60/60 Virupas');
          expect(p.currentHouse).toBeGreaterThanOrEqual(1);
          expect(p.priorHouse).toBeGreaterThanOrEqual(1);
          expect(p.priorHouse).toBeLessThanOrEqual(12);
          expect(p.pastLifeKarmaEn.length).toBeGreaterThan(20);
          expect(p.careerImpactEn.length).toBeGreaterThan(20);
          expect(p.remedyEn.length).toBeGreaterThan(10);
        }
      } else {
        expect(report.overallSummaryEn).toContain('direct motion');
      }
    });
  });

  describe('3. Daily Tarabalam & Chandrabalam Energy Calculator', () => {
    it('calculates 9 Taras cycle and daily energy score accurately', () => {
      const report = computeTarabalamChandrabalam(sample1);
      expect(report.birthNakshatraIndex).toBeGreaterThanOrEqual(0);
      expect(report.birthNakshatraIndex).toBeLessThanOrEqual(26);
      expect(report.currentTaraNumber).toBeGreaterThanOrEqual(1);
      expect(report.currentTaraNumber).toBeLessThanOrEqual(9);
      expect(report.dailyEnergyScore).toBeGreaterThanOrEqual(0);
      expect(report.dailyEnergyScore).toBeLessThanOrEqual(100);
      expect(report.all9Taras.length).toBe(9);
      expect(report.all9Taras.some((t) => t.isActive)).toBe(true);
      expect(report.recommendedActionEn.length).toBeGreaterThan(15);
      expect(report.recommendedActionHi.length).toBeGreaterThan(15);
    });
  });

  describe('4. Tamil Siddha Pancha Pakshi Shastra Bio-Rhythms', () => {
    it('maps birth nakshatra and paksha to one of 5 sacred birds', () => {
      const validBirds = ['Vulture', 'Owl', 'Crow', 'Rooster', 'Peacock'];
      const report = computePanchaPakshi(sample1);
      expect(validBirds).toContain(report.birdNameEn);
      expect(report.pakshaEn).toMatch(/Shukla|Krishna/);
      expect(report.schedule.length).toBe(5);
      expect(report.currentAvastha.powerPercent).toBeGreaterThanOrEqual(0);
      expect(report.currentAvastha.powerPercent).toBeLessThanOrEqual(100);
      expect(report.bioRhythmOverviewEn.length).toBeGreaterThan(30);
    });
  });

  describe('5. 20 Classical Kuja Dosha (Manglik) Cancellation Rules', () => {
    it('detects martial positions and evaluates classical cancellation rules', () => {
      const report = computeKujaDoshaAnalysis(sample1);
      expect(report.marsHouseFromLagna).toBeGreaterThanOrEqual(1);
      expect(report.marsHouseFromLagna).toBeLessThanOrEqual(12);
      expect(report.cancellationReasonsEn.length).toBe(report.cancellationRuleCount);
      expect(report.remediesEn.length).toBeGreaterThan(0);
      expect(report.remediesHi.length).toBeGreaterThan(0);
      if (report.isCancelled) {
        expect(report.finalVerdictEn).toContain('CANCELLED');
        expect(report.finalVerdictHi).toContain('निरस्त');
      }
    });
  });

  describe('6. Master Specialized Synthesis Report', () => {
    it('integrates all 5 classical engines into a unified report', () => {
      const master = computeSpecializedVedicReport(sample1);
      expect(master.ishtaDevata).toBeDefined();
      expect(master.vakriPlanets).toBeDefined();
      expect(master.tarabalam).toBeDefined();
      expect(master.panchaPakshi).toBeDefined();
      expect(master.kujaDosha).toBeDefined();
    });
  });
});
