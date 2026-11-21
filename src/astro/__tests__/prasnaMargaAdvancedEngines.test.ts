import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS, SAMPLE_CHARTS } from '../../data/cities';
import {
  computePrasnaMargaMedical,
  computeFertilityAndProgeny,
  computeBadhakaAndDeities,
  computeSpouseAndVivahaAnalysis,
  computeAshtakavargaLongevityAndLifeMap,
  computeTripatakiChakra,
  computeMundaneEarthquakeRisk,
  computeMasterPrasnaMargaReport,
} from '../predictions/prasnaMargaAdvancedEngines';

describe('Prasna Marga & VedAstro Classical Advanced Engines', () => {
  const sample1 = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
  const sample2 = calculateChart(SAMPLE_CHARTS[1], DEFAULT_SETTINGS);

  describe('1. Medical Astrology & Tridosha (Prasna Marga Ch. 10-12)', () => {
    it('evaluates Nija vs Agantuka classification, Tridosha percentages, and 7 Dhatus', () => {
      const report = computePrasnaMargaMedical(sample1);
      expect(report.etiologyType).toBeDefined();
      expect(['Nija', 'Agantuka', 'Mixed']).toContain(report.etiologyType);
      expect(report.vataPercent + report.pittaPercent + report.kaphaPercent).toBe(100);
      expect(report.dhatus.length).toBe(7);
      expect(report.soolaChakraOnsetNakshatra.length).toBeGreaterThan(0);
      expect(report.soolaChakraRecoveryNakshatra.length).toBeGreaterThan(0);
      expect(report.ayurvedicTasteRemediesEn.length).toBeGreaterThanOrEqual(3);
      expect(report.mrityunjayaSadhanaHi).toContain('महामृत्युंजय');
    });
  });

  describe('2. Beeja & Kshetra Sphutas (Fertility & Progeny)', () => {
    it('calculates male Beeja Sphuta and female Kshetra Sphuta with odd/even polarity', () => {
      const report = computeFertilityAndProgeny(sample1);
      expect(report.maleBeejaSphuta.sphutaLongitude).toBeGreaterThanOrEqual(0);
      expect(report.maleBeejaSphuta.sphutaLongitude).toBeLessThan(360);
      expect(report.maleBeejaSphuta.signIndex).toBeGreaterThanOrEqual(0);
      expect(report.maleBeejaSphuta.signIndex).toBeLessThanOrEqual(11);
      expect(report.femaleKshetraSphuta.sphutaLongitude).toBeGreaterThanOrEqual(0);
      expect(report.femaleKshetraSphuta.sphutaLongitude).toBeLessThan(360);
      expect(report.progenyPromiseScore).toBeGreaterThanOrEqual(0);
      expect(report.progenyPromiseScore).toBeLessThanOrEqual(100);
      expect(report.santanaSphutaLongitude).toBeGreaterThanOrEqual(0);
      expect(report.classicalUpayasHi[0]).toContain('देवकीसुत');
      expect(report.classicalUpayasEn.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('3. Badhakasthana & Offended Deities (Prasna Marga Ch. 15)', () => {
    it('accurately identifies badhaka house (11 for Chara, 9 for Sthira, 7 for Dwisvabhava)', () => {
      const report = computeBadhakaAndDeities(sample1);
      const lagnaIdx = sample1.ascendant ? sample1.ascendant.signIndex : 0;
      const isMovable = [0, 3, 6, 9].includes(lagnaIdx);
      const isFixed = [1, 4, 7, 10].includes(lagnaIdx);
      const expectedBadhaka = isMovable ? 11 : isFixed ? 9 : 7;
      expect(report.badhakaHouseNumber).toBe(expectedBadhaka);
      expect(report.offendedDeityEn.length).toBeGreaterThan(0);
      expect(report.offendedDeityHi.length).toBeGreaterThan(0);
      expect(report.drishtiBadhaScore).toBeGreaterThanOrEqual(0);
      expect(report.drishtiBadhaScore).toBeLessThanOrEqual(100);
      expect(['Negligible', 'Mild', 'Moderate', 'Severe']).toContain(report.drishtiBadhaSeverity);
      expect(report.prescribedPalliativesEn.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('4. Spouse Characteristics & Vivaha Prasna (Prasna Marga Ch. 17)', () => {
    it('computes Chandrabhilasha Sphuta wedding window and evaluates remarriage yogas', () => {
      const report = computeSpouseAndVivahaAnalysis(sample1);
      expect(report.spouseComplexionEn.length).toBeGreaterThan(0);
      expect(report.spouseTemperamentEn.length).toBeGreaterThan(0);
      expect(report.chandrabhilashaSphutaDeg).toBeGreaterThanOrEqual(0);
      expect(report.chandrabhilashaSphutaDeg).toBeLessThan(360);
      expect(report.chandrabhilashaTimingWindowEn.length).toBeGreaterThan(10);
      expect(report.remarriageYogas.length).toBeGreaterThanOrEqual(1);
      expect(report.maritalHarmonyAdviceEn.length).toBeGreaterThan(10);
    });
  });

  describe('5. Ashtakavarga Sodya Pinda Longevity & 337 Life Map', () => {
    it('distributes 337 bindus across 4 Purusharthas and yields classical lifespan band', () => {
      const report = computeAshtakavargaLongevityAndLifeMap(sample1);
      expect(report.totalSodyaPinda).toBeGreaterThan(0);
      expect(report.dharmaBindus + report.arthaBindus + report.kamaBindus + report.mokshaBindus).toBeGreaterThan(0);
      expect(report.grossLongevityYears).toBeGreaterThanOrEqual(45);
      expect(report.grossLongevityYears).toBeLessThanOrEqual(100);
      expect(['Alpayu (Under 32)', 'Madhyayu (33–66)', 'Purnayu (67–100+)']).toContain(report.netLongevityCategory);
      expect(report.dominantPurusharthaEn.length).toBeGreaterThan(0);
      expect(report.saturnAfflictionHouse).toBeGreaterThanOrEqual(1);
      expect(report.saturnAfflictionHouse).toBeLessThanOrEqual(12);
      expect(report.jupiterProsperityHouse).toBeGreaterThanOrEqual(1);
      expect(report.jupiterProsperityHouse).toBeLessThanOrEqual(12);
    });
  });

  describe('6. Tripataki 3-Flag Transit Vedha Chakra', () => {
    it('evaluates Lagna, Moon, and Sun flags with planetary afflictions', () => {
      const report = computeTripatakiChakra(sample1);
      expect(report.lagnaFlag.focusKey).toBe('Lagna');
      expect(report.moonFlag.focusKey).toBe('Moon');
      expect(report.sunFlag.focusKey).toBe('Sun');
      expect(report.overallFlagSafetyScore).toBeGreaterThanOrEqual(0);
      expect(report.overallFlagSafetyScore).toBeLessThanOrEqual(100);
      expect(report.annualForecastEn.length).toBeGreaterThan(10);
      expect(report.protectiveRemedyEn.length).toBeGreaterThan(10);
    });
  });

  describe('7. B.V. Raman Mundane & Earthquake Risk Model', () => {
    it('calculates 0-35 risk score with planetary alignment triggers', () => {
      const report = computeMundaneEarthquakeRisk(sample1);
      expect(report.score).toBeGreaterThanOrEqual(0);
      expect(report.score).toBeLessThanOrEqual(35);
      expect(['Low Risk', 'Moderate Risk', 'Elevated Risk', 'High Risk']).toContain(report.riskLevel);
      expect(report.activeIndicatorsEn.length).toBeGreaterThanOrEqual(1);
      expect(report.geophysicalSummaryEn).toContain('Dr. B.V. Raman');
    });
  });

  describe('8. Master Prasna Marga Report Synthesizer', () => {
    it('consolidates all 7 engines into a coherent master report', () => {
      const master = computeMasterPrasnaMargaReport(sample2);
      expect(master.medical.dhatus.length).toBe(7);
      expect(master.progeny.progenyPromiseScore).toBeGreaterThanOrEqual(0);
      expect(master.badhaka.badhakaHouseNumber).toBeGreaterThanOrEqual(7);
      expect(master.spouse.spouseComplexionEn.length).toBeGreaterThan(0);
      expect(master.ashtakavarga.totalSodyaPinda).toBeGreaterThan(0);
      expect(master.tripataki.overallFlagSafetyScore).toBeGreaterThanOrEqual(0);
      expect(master.mundane.score).toBeGreaterThanOrEqual(0);
    });
  });
});
