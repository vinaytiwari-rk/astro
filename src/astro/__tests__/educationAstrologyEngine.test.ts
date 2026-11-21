import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS, SAMPLE_CHARTS } from '../../data/cities';
import { computeEducationAstrologyEngine } from '../predictions/educationAstrologyEngine';

describe('Vedic Higher Education & Learning Predictions Engine', () => {
  it('computes robust education reports across sample charts', () => {
    for (const sample of SAMPLE_CHARTS) {
      const chart = calculateChart(sample, DEFAULT_SETTINGS);
      const report = computeEducationAstrologyEngine(chart);

      expect(report.overallEducationScore).toBeGreaterThanOrEqual(25);
      expect(report.overallEducationScore).toBeLessThanOrEqual(98);
      expect(report.overallVerdictEn).toBeTruthy();
      expect(report.overallVerdictHi).toBeTruthy();
    }
  });

  it('correctly assesses the 8 classical learning houses with specific educational roles', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeEducationAstrologyEngine(chart);

    expect(report.coreHouses).toHaveLength(8);
    const houseNumbers = report.coreHouses.map((h) => h.houseNumber);
    expect(houseNumbers).toEqual([1, 2, 4, 5, 8, 9, 10, 11]);

    for (const h of report.coreHouses) {
      expect(h.lord).toBeTruthy();
      expect(h.lordHouse).toBeGreaterThanOrEqual(1);
      expect(h.lordHouse).toBeLessThanOrEqual(12);
      expect(h.savBindus).toBeGreaterThanOrEqual(0);
      expect(h.educationalManifestationEn.length).toBeGreaterThan(20);
      expect(h.educationalManifestationHi.length).toBeGreaterThan(20);
      expect(h.statusRating).toBeTruthy();
      expect(h.statusRatingHi).toBeTruthy();
    }

    // 8th house must explicitly cover deep research / Ph.D.
    const h8 = report.coreHouses.find((h) => h.houseNumber === 8);
    expect(h8?.sanskritRoleEn).toContain('Research');
    expect(h8?.sanskritRoleHi).toContain('शोध');
  });

  it('evaluates all 10 classical break and obstacle rules deterministically', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeEducationAstrologyEngine(chart);

    expect(report.breakFactors).toHaveLength(10);
    expect(report.breakFactors.map((bf) => bf.ruleNumber)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    for (const bf of report.breakFactors) {
      expect(bf.ruleNameEn).toBeTruthy();
      expect(bf.ruleNameHi).toBeTruthy();
      expect(bf.classicalDictaEn).toBeTruthy();
      expect(bf.classicalDictaHi).toBeTruthy();
      expect(typeof bf.isTriggered).toBe('boolean');
      expect(['None', 'Mild', 'Moderate', 'Severe']).toContain(bf.severity);
      expect(bf.manifestationEn).toBeTruthy();
      expect(bf.manifestationHi).toBeTruthy();
      expect(bf.remedyEn).toBeTruthy();
      expect(bf.remedyHi).toBeTruthy();
    }

    expect(report.triggeredBreakCount).toBeGreaterThanOrEqual(0);
    expect(report.triggeredBreakCount).toBeLessThanOrEqual(10);
    expect(['Low', 'Moderate', 'Elevated', 'Severe']).toContain(report.breakRiskLevel);
  });

  it('evaluates classical education yogas including Sarvabhouma and Saraswati', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeEducationAstrologyEngine(chart);

    expect(report.allYogas.length).toBeGreaterThanOrEqual(8);
    const yogaIds = report.allYogas.map((y) => y.id);
    expect(yogaIds).toContain('sarvabhouma');
    expect(yogaIds).toContain('saraswati');
    expect(yogaIds).toContain('kalanithi');
    expect(yogaIds).toContain('brahma');
    expect(yogaIds).toContain('budhaditya');

    const sarvabhouma = report.allYogas.find((y) => y.id === 'sarvabhouma');
    expect(sarvabhouma?.classicalSource).toContain('Brihat Parashara');
    expect(sarvabhouma?.conditionMetEn).toBeTruthy();
  });

  it('evaluates specialized cognitive aptitudes across 6 domains', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeEducationAstrologyEngine(chart);

    expect(report.talents).toHaveLength(6);
    const talentIds = report.talents.map((t) => t.domainId);
    expect(talentIds).toEqual([
      'intelligence',
      'memory',
      'mathematics',
      'grammar',
      'occult_astrology',
      'eloquence',
    ]);

    for (const t of report.talents) {
      expect(t.score).toBeGreaterThanOrEqual(0);
      expect(t.score).toBeLessThanOrEqual(100);
      expect(t.classicalSutraEn).toBeTruthy();
      expect(t.detailedInsightEn).toBeTruthy();
    }
  });

  it('maps all 9 planetary streams to college degrees and disciplines', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeEducationAstrologyEngine(chart);

    expect(report.planetaryStreams).toHaveLength(9);
    for (const stream of report.planetaryStreams) {
      expect(stream.affinityScore).toBeGreaterThanOrEqual(0);
      expect(stream.recommendedDegreesEn.length).toBeGreaterThan(0);
      expect(stream.recommendedDegreesHi.length).toBeGreaterThan(0);
      expect(stream.facultyEn).toBeTruthy();
    }
    const recommended = report.planetaryStreams.filter((s) => s.isRecommended);
    expect(recommended.length).toBeGreaterThanOrEqual(1);
  });

  it('evaluates Moon cognitive psychology and learning timeline windows', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeEducationAstrologyEngine(chart);

    expect(report.moonPsychology.moonSignEn).toBeTruthy();
    expect(report.moonPsychology.mentalFocusScore).toBeGreaterThanOrEqual(0);
    expect(report.moonPsychology.cognitiveProfileEn).toBeTruthy();
    expect(report.moonPsychology.visualAndSensoryFocusEn).toBeTruthy();

    expect(report.timelineWindows.length).toBe(7);
    const stages = report.timelineWindows.map((tw) => tw.stage);
    expect(stages).toContain('Primary Schooling');
    expect(stages).toContain('Secondary & Matriculation');
    expect(stages).toContain('College / Higher Secondary');
    expect(stages).toContain('Graduation & Bachelor');
    expect(stages).toContain('Post-Graduation / Master');
    expect(stages).toContain('Research & Ph.D.');
    expect(stages).toContain('Foreign University Studies');

    expect(report.classicalUpayas.detailsEn.length).toBeGreaterThanOrEqual(4);
    expect(report.classicalUpayas.detailsHi.length).toBeGreaterThanOrEqual(4);
  });

  it('strictly adheres to zero personal modern author names', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeEducationAstrologyEngine(chart);
    const fullText = JSON.stringify(report);

    // Forbidden modern personal author names
    expect(fullText).not.toMatch(/Abha Bansal|Arun Bansal|Adawal|Suryanarayan|Kiran Bedi|Dheerubhai/i);
    // Classical authorities are welcomed
    expect(fullText).toMatch(/Parashara|Brihat|Saravali|Parijata/i);
  });
});
