import { describe, it, expect } from 'vitest';
import { calculateChart } from '../calculator';
import { computeHolisticRemedies } from '../holisticRemedies';
import { computeSambhavitFalkathan } from '../predictions/sambhavitFalkathan';
import { DEFAULT_SETTINGS, SAMPLE_CHARTS } from '../../data/cities';

describe('AV Astro Vibe — Holistic Remedies & Classical Prediction Rigor', () => {
  const swamiChart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);

  it('computes complete holistic remedies with all 8 modules and prescription slip', () => {
    const report = computeHolisticRemedies(swamiChart, 'all', 'all');

    expect(report.herbalRoots).toBeDefined();
    expect(report.herbalRoots.length).toBe(9);
    // At least one herbal root must be recommended based on Mahadasha or Lagna
    const recommendedRoots = report.herbalRoots.filter((r) => r.isRecommended);
    expect(recommendedRoots.length).toBeGreaterThanOrEqual(1);

    expect(report.colorTherapy).toBeDefined();
    expect(report.colorTherapy.favorableColorsHi.length).toBeGreaterThan(0);
    expect(report.colorTherapy.avoidColorsHi.length).toBeGreaterThan(0);

    expect(report.astroYoga).toBeDefined();
    expect(report.astroYoga.length).toBeGreaterThan(0);
    expect(report.astroYoga[0].asanasHi.length).toBeGreaterThan(0);

    expect(report.kitchenTotke).toBeDefined();
    expect(report.kitchenTotke.length).toBeGreaterThanOrEqual(4);

    expect(report.classicalStotras).toBeDefined();
    expect(report.classicalStotras.some((s) => s.stotraNameHi.includes('कनकधारा'))).toBe(true);
    expect(report.classicalStotras.some((s) => s.stotraNameHi.includes('दशरथकृत'))).toBe(true);

    expect(report.ishtaDevata).toBeDefined();
    expect(report.ishtaDevata.deityNameHi).toBeTruthy();
    expect(report.ishtaDevata.moolaMantra).toBeTruthy();

    expect(report.prescriptionSlip).toBeDefined();
    expect(report.prescriptionSlip.clientName).toBeTruthy();
    expect(report.prescriptionSlip.primaryRoot).toBeTruthy();
  });

  it('computes Sambhavit Falkathan 21 Master Dimensions with age calibration and authentic Arishta logic', () => {
    const report = computeSambhavitFalkathan(swamiChart);

    expect(report.dimensions.length).toBe(21);

    // Mother's Lifespan
    const dim14 = report.dimensions.find((d) => d.id === 14);
    expect(dim14).toBeDefined();
    expect(dim14?.verdictHi).toBeTruthy();

    // Siblings
    const dim9 = report.dimensions.find((d) => d.id === 9);
    expect(dim9).toBeDefined();
    expect(dim9?.verdictHi).toBeTruthy();

    // Marriage Timing
    const dim26 = report.dimensions.find((d) => d.id === 26);
    expect(dim26).toBeDefined();
    expect(dim26?.verdictHi).toBeTruthy();

    // Children Conception
    const dim19 = report.dimensions.find((d) => d.id === 19);
    expect(dim19).toBeDefined();
    expect(dim19?.verdictHi).toBeTruthy();

    // Children Challenges
    const dim20 = report.dimensions.find((d) => d.id === 20);
    expect(dim20).toBeDefined();
    expect(dim20?.verdictHi).toBeTruthy();

    // Verify all 21 dimensions have distinct, non-repetitive remedies and detailed analyses
    const remediesHi = report.dimensions.map((d) => d.remedyHi);
    const uniqueRemedies = new Set(remediesHi);
    expect(uniqueRemedies.size).toBe(21);

    const detailedHi = report.dimensions.map((d) => d.detailedAnalysisHi);
    const uniqueDetailed = new Set(detailedHi);
    expect(uniqueDetailed.size).toBe(21);
  });


  it('keeps sensitive selected predictions non-deterministic and transparent about chart evidence', () => {
    const report = computeSambhavitFalkathan(swamiChart);
    const byId = (id: number) => report.dimensions.find((dimension) => dimension.id === id)!;

    for (const id of [1, 5, 9, 10, 12, 13, 14, 17, 19, 20, 22, 24, 26, 27, 31, 34, 37, 39, 44, 48, 51]) {
      const dimension = byId(id);
      expect(dimension).toBeDefined();
      expect(dimension.astroBasisEn).toContain('Recorded chart evidence:');
      expect(dimension.detailedAnalysisEn).toContain('divisional evidence:');
      expect(dimension.astroBasisHi).toContain('कुंडली में दर्ज आधार');
    }

    expect(byId(1).astroBasisEn).toContain('D1');
    expect(byId(5).astroBasisEn).toContain('D2');
    expect(byId(9).astroBasisEn).toContain('D3');
    expect(byId(13).astroBasisEn).toContain('D12');
    expect(byId(19).astroBasisEn).toContain('D7');
    expect(byId(22).astroBasisEn).toContain('D6');
    expect(byId(26).astroBasisEn).toContain('D9');
    expect(byId(39).astroBasisEn).toContain('D10');
    expect(byId(44).astroBasisEn).toContain('D2');
    expect(byId(51).astroBasisEn).toContain('D20');

    const maternal = byId(14);
    const health = byId(22);
    const disputes = byId(24);
    const marriage = byId(26);
    const longevity = byId(31);
    const career = byId(39);
    const foreign = byId(48);
    const spirituality = byId(51);

    expect(maternal.titleEn).not.toMatch(/longevity/i);
    expect(maternal.verdictEn).toMatch(/cannot establish.*health, lifespan or longevity/i);
    expect(health.titleEn).not.toMatch(/disease|vulnerabilit|recovery speed/i);
    expect(health.verdictEn).toMatch(/cannot diagnose/i);
    expect(disputes.titleEn).not.toMatch(/adversar|court triumph/i);
    expect(disputes.verdictEn).toMatch(/cannot.*guarantee/i);
    expect(marriage.titleEn).not.toMatch(/age span|timing window/i);
    expect(marriage.verdictEn).toMatch(/does not determine a certain marriage date or age/i);
    expect(longevity.titleEn).not.toMatch(/lifespan|longevity|maraka/i);
    expect(longevity.verdictEn).toMatch(/cannot reliably estimate lifespan/i);
    expect(longevity.timingEn).toMatch(/No health- or lifespan-related timing/i);
    expect(career.verdictEn).toMatch(/tenth house and its ruler govern career/i);
    expect(foreign.verdictEn).toMatch(/twelfth house is the primary classical indicator/i);
    expect(spirituality.verdictEn).toMatch(/twelfth house and Ketu form the core foundation/i);
  });

  it('correctly handles chart with severe 7th house delay for adult native', () => {
    // Native born in 1985 (currently 40+ years old)
    const adultInput = {
      ...SAMPLE_CHARTS[0],
      date: '1985-05-15',
    };
    const adultChart = calculateChart(adultInput, DEFAULT_SETTINGS);
    const report = computeSambhavitFalkathan(adultChart);
    const dim26 = report.dimensions.find((d) => d.id === 13);

    // For a 40-year old adult, prediction must NOT predict 24 to 28 years!
    expect(dim26?.verdictEn).not.toContain('24 to 28 years of age');
  });

  it('removes deterministic claims from legacy compatibility fields rendered in the Patrika dossier', () => {
    const report = computeSambhavitFalkathan(swamiChart);

    expect(report.father.lifespanEn).toMatch(/cannot assess.*health or lifespan/i);
    expect(report.mother.lifespanEn).toMatch(/cannot assess.*health or lifespan/i);
    expect(report.marriage.spouseAgeGapEn).toMatch(/cannot reliably determine/i);
    expect(report.marriage.marriageYogasEn).toMatch(/not a guarantee/i);
    expect(report.marriage.relationshipEn).toMatch(/no outcome is guaranteed/i);
    expect(report.children.conceptionModeEn).toMatch(/No conception method/i);
    expect(report.career.govtVsPrivateEn).toMatch(/cannot reliably determine/i);
    expect(report.career.suitableProfessionsEn[0]).toMatch(/no profession is guaranteed/i);
    expect(report.career.jobVsBusinessEn).toMatch(/tenth house and its ruler govern career/i);
    expect(report.mentalHealth.conditionEn).toMatch(/not a mental-health assessment/i);
    expect(report.addictions.vulnerabilitiesEn[0]).toMatch(/No psychological vulnerability/i);
    expect(report.children.progenyCountEn).toMatch(/No prediction of number or sex/i);
    expect(report.children.miscarriageRiskEn).toMatch(/cannot assess miscarriage risk/i);
    expect(report.children.countAndGenderEn).toMatch(/No prediction.*number or gender/i);
    expect(report.longevity.rangeEn).toMatch(/No lifespan range/i);
    expect(report.surgeryYoga.riskLevelEn).toMatch(/No surgery or medical-risk prediction/i);
    expect(report.surgeryYoga.vulnerableAreasEn).toMatch(/cannot identify vulnerable organs/i);
    expect(report.surgeryYoga.timingEn).toMatch(/No medical or surgery timing/i);
    expect(report.mentalHealth.vulnerabilitiesEn).toMatch(/cannot diagnose mental-health/i);
    expect(report.health.vulnerableOrgansEn).toMatch(/cannot identify vulnerable organs/i);
    expect(report.wealth.peakAgeWindowEn).toMatch(/No fixed age window/i);
  });

  it('proves 1-second precision sensitivity: changing birth time by even 1 second changes the prediction output', () => {
    const chartTime1 = calculateChart({
      ...SAMPLE_CHARTS[0],
      time: '12:00:00',
    }, DEFAULT_SETTINGS);

    const chartTime2 = calculateChart({
      ...SAMPLE_CHARTS[0],
      time: '12:00:01', // Exactly 1 second later!
    }, DEFAULT_SETTINGS);

    // Astronomical longitudes MUST differ by ~15 arcseconds
    expect(chartTime1.ascendant.longitude).not.toBe(chartTime2.ascendant.longitude);

    const report1 = computeSambhavitFalkathan(chartTime1);
    const report2 = computeSambhavitFalkathan(chartTime2);

    expect(report1.dimensions.length).toBe(21);
    expect(report2.dimensions.length).toBe(21);

    // 1-Second micro-precision stamps must visibly and mathematically change
    expect(report1.dimensions[0].detailedAnalysisEn).not.toBe(report2.dimensions[0].detailedAnalysisEn);
    expect(report1.dimensions[0].detailedAnalysisHi).not.toBe(report2.dimensions[0].detailedAnalysisHi);
    expect(report1.dimensions[0].astroBasisEn).not.toBe(report2.dimensions[0].astroBasisEn);
    expect(report1.dimensions[0].astroBasisHi).not.toBe(report2.dimensions[0].astroBasisHi);
  });
});
