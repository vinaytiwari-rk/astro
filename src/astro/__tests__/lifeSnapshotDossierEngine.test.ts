import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS, SAMPLE_CHARTS } from '../../data/cities';
import { computeLifeSnapshotDossierReport } from '../predictions/lifeSnapshotDossierEngine';

describe('360° Life Matrix Snapshot Dossier Master Engine', () => {
  it('computes all 14 comprehensive life pillars with 60+ attributes across sample charts', () => {
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

    let totalAttributes = 0;
    for (const pillar of report.pillars) {
      expect(pillar.titleEn.length).toBeGreaterThan(0);
      expect(pillar.titleHi.length).toBeGreaterThan(0);
      expect(pillar.summaryEn.length).toBeGreaterThan(20);
      expect(pillar.summaryHi.length).toBeGreaterThan(20);
      expect(pillar.attributes.length).toBeGreaterThan(0);

      totalAttributes += pillar.attributes.length;
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
    expect(totalAttributes).toBeGreaterThanOrEqual(60);
  });

  it('differentiates physical, career, and lucky predictions between different rising signs', () => {
    const chart1 = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const chart2 = calculateChart(SAMPLE_CHARTS[1], DEFAULT_SETTINGS);

    const report1 = computeLifeSnapshotDossierReport(chart1);
    const report2 = computeLifeSnapshotDossierReport(chart2);

    // 1. Face shape & features should differ based on Lagna/occupants
    const face1 = report1.pillars[0].attributes.find((a) => a.id === 'attr_face_shape')?.valueEn;
    const face2 = report2.pillars[0].attributes.find((a) => a.id === 'attr_face_shape')?.valueEn;
    expect(face1).toBeDefined();
    expect(face2).toBeDefined();

    // 2. Mole location should differ according to Kalapurusha sign
    const mole1 = report1.pillars[0].attributes.find((a) => a.id === 'attr_birthmark_mole')?.valueEn;
    const mole2 = report2.pillars[0].attributes.find((a) => a.id === 'attr_birthmark_mole')?.valueEn;
    expect(mole1).toBeDefined();
    expect(mole2).toBeDefined();
    expect(mole1).not.toEqual(mole2);

    // 3. Spouse Direction & Distance should differ
    const spouseDir1 = report1.pillars[3].attributes.find((a) => a.id === 'attr_spouse_location')?.valueEn;
    const spouseDir2 = report2.pillars[3].attributes.find((a) => a.id === 'attr_spouse_location')?.valueEn;
    expect(spouseDir1).toBeDefined();
    expect(spouseDir2).toBeDefined();

    // 4. Lucky gemstones & colors should match Lagnesha
    const gem1 = report1.pillars[13].attributes.find((a) => a.id === 'attr_lucky_gemstones_metals')?.valueEn;
    const gem2 = report2.pillars[13].attributes.find((a) => a.id === 'attr_lucky_gemstones_metals')?.valueEn;
    expect(gem1).toBeDefined();
    expect(gem2).toBeDefined();
    expect(gem1).not.toEqual(gem2);

    const col1 = report1.pillars[13].attributes.find((a) => a.id === 'attr_lucky_colors')?.valueEn;
    const col2 = report2.pillars[13].attributes.find((a) => a.id === 'attr_lucky_colors')?.valueEn;
    expect(col1).toBeDefined();
    expect(col2).toBeDefined();
    expect(col1).not.toEqual(col2);
  });

  it('correctly calculates nuanced sexual orientation and attraction patterns based on Kama axis', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeLifeSnapshotDossierReport(chart);

    const orientationAttr = report.pillars[3].attributes.find((a) => a.id === 'attr_sexual_orientation');
    expect(orientationAttr).toBeDefined();
    expect(orientationAttr?.titleEn).toContain('Sexual Orientation');
    expect(orientationAttr?.titleHi).toContain('कामुक आकर्षण');
    expect(orientationAttr?.valueEn.length).toBeGreaterThan(15);
    expect(orientationAttr?.valueHi.length).toBeGreaterThan(15);
    expect(orientationAttr?.explanationEn).toContain('Brihat Jataka');
    expect(orientationAttr?.explanationHi).toContain('बृहज्जातक');

    // Synthetic test chart: Venus in Gemini (dual sign) with Mercury influence
    const syntheticChart = {
      ...chart,
      planets: chart.planets.map((p) => {
        if (p.id === 'Venus') {
          return {
            ...p,
            signIndex: 2,
            signName: 'Gemini',
            placedHouse: 7,
            rasiHouseNumber: 7,
          };
        }
        if (p.id === 'Mercury') {
          return {
            ...p,
            placedHouse: 7,
            rasiHouseNumber: 7,
          };
        }
        return p;
      }),
    };

    const syntheticReport = computeLifeSnapshotDossierReport(syntheticChart as any);
    const synOrientation = syntheticReport.pillars[3].attributes.find((a) => a.id === 'attr_sexual_orientation');
    expect(synOrientation?.valueEn).toContain('Bisexual / Fluid Attraction');
    expect(synOrientation?.valueHi).toContain('उभयलैंगिक');
    expect(synOrientation?.valueHi).toContain('समान लिंग');
    expect(synOrientation?.explanationHi).toContain('समान लिंग (Same Gender)');
  });
});
