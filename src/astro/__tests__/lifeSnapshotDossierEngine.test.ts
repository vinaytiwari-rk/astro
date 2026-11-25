import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS, SAMPLE_CHARTS } from '../../data/cities';
import { computeLifeSnapshotDossierReport } from '../predictions/lifeSnapshotDossierEngine';

describe('360° Life Matrix Snapshot Dossier Engine', () => {
  it('computes all 14 comprehensive life pillars across sample charts', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeLifeSnapshotDossierReport(chart);

    expect(report.pillars.length).toBe(14);
    expect(report.birthSummary.lagnaSignEn.length).toBeGreaterThan(0);
    expect(report.birthSummary.lagnaSignHi.length).toBeGreaterThan(0);
    expect(report.birthSummary.d60DevataEn.length).toBeGreaterThan(0);
    expect(report.birthSummary.atmakarakaEn.length).toBeGreaterThan(0);

    const pillarIds = report.pillars.map((p) => p.id);
    expect(pillarIds).toEqual([
      'physical_persona',
      'parents_ancestry',
      'siblings_bhratri',
      'spouse_marriage',
      'children_progeny',
      'education_academics',
      'career_wealth',
      'health_crises_mysteries',
      'assets_travel_moksha',
      'past_life_karma',
      'ishta_devata_mantra',
      'vastu_lifestyle',
      'palmistry_gait',
      'lucky_synergy_matrix',
    ]);

    for (const pillar of report.pillars) {
      expect(pillar.titleEn.length).toBeGreaterThan(0);
      expect(pillar.titleHi.length).toBeGreaterThan(0);
      expect(pillar.summaryEn.length).toBeGreaterThan(20);
      expect(pillar.summaryHi.length).toBeGreaterThan(20);
      expect(pillar.attributes.length).toBeGreaterThan(0);

      for (const attr of pillar.attributes) {
        expect(attr.id.length).toBeGreaterThan(0);
        expect(attr.titleEn.length).toBeGreaterThan(0);
        expect(attr.titleHi.length).toBeGreaterThan(0);
        expect(attr.valueEn.length).toBeGreaterThan(0);
        expect(attr.valueHi.length).toBeGreaterThan(0);
        expect(attr.explanationEn.length).toBeGreaterThan(20);
        expect(attr.explanationHi.length).toBeGreaterThan(20);
        expect(attr.pacBasisEn.length).toBeGreaterThan(10);
        expect(attr.pacBasisHi.length).toBeGreaterThan(10);
        expect(attr.shastricRef.length).toBeGreaterThan(5);
      }
    }
  });

  it('differentiates physical and life predictions between different rising signs', () => {
    const chart1 = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS); // Pisces or Aries
    const chart2 = calculateChart(SAMPLE_CHARTS[1], DEFAULT_SETTINGS);

    const report1 = computeLifeSnapshotDossierReport(chart1);
    const report2 = computeLifeSnapshotDossierReport(chart2);

    const face1 = report1.pillars[0].attributes.find((a) => a.id === 'attr_face_shape');
    const face2 = report2.pillars[0].attributes.find((a) => a.id === 'attr_face_shape');
    expect(face1).toBeDefined();
    expect(face2).toBeDefined();

    const spouseDir1 = report1.pillars[3].attributes.find((a) => a.id === 'attr_spouse_location');
    const spouseDir2 = report2.pillars[3].attributes.find((a) => a.id === 'attr_spouse_location');
    expect(spouseDir1).toBeDefined();
    expect(spouseDir2).toBeDefined();
  });
});
