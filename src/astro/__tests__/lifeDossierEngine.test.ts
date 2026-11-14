import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS, SAMPLE_CHARTS } from '../../data/cities';
import { computeLifeDossierReport } from '../predictions/lifeDossierEngine';

describe('Life Dossier Engine (10-Chapter Master Life Dossier)', () => {
  const sample = SAMPLE_CHARTS[0];
  const chart = calculateChart(sample, DEFAULT_SETTINGS);
  const report = computeLifeDossierReport(chart);

  it('generates all 10 chapters without omission', () => {
    expect(report.chapters.length).toBe(10);
    for (let i = 1; i <= 10; i++) {
      const ch = report.chapters.find((c) => c.chapterNumber === i);
      expect(ch).toBeDefined();
      expect(ch?.titleEn).toBeDefined();
      expect(ch?.titleHi).toBeDefined();
      expect(ch?.sections.length).toBeGreaterThanOrEqual(2);
      for (const sec of ch!.sections) {
        expect(sec.paragraphsEn.length).toBeGreaterThanOrEqual(1);
        expect(sec.paragraphsHi.length).toBeGreaterThanOrEqual(1);
        expect(sec.astrologicalCauseEn).toBeDefined();
        expect(sec.astrologicalCauseHi).toBeDefined();
      }
    }
  });

  it('correctly populates Top Spiritual Identity (Ishta Devata, Naamakshar, Paya) in Chapter 1 only', () => {
    const { ishtaDevata, naamakshar, paya } = report.topIdentity;
    expect(ishtaDevata.deityEn).toBeDefined();
    expect(ishtaDevata.deityHi).toBeDefined();
    expect(ishtaDevata.mantra).toBeDefined();
    expect(ishtaDevata.classicalCauseEn).toContain('Karakamsa');

    expect(naamakshar.syllableEn).toBeDefined();
    expect(naamakshar.syllableHi).toBeDefined();
    expect(naamakshar.allPadasEn.length).toBe(4);
    expect(naamakshar.allPadasHi.length).toBe(4);

    expect(paya.nameEn).toBeDefined();
    expect(paya.nameHi).toBeDefined();
    expect(['Gold', 'Silver', 'Copper', 'Iron']).toContain(paya.metal);
    expect(paya.moonHouseFromLagna).toBeGreaterThanOrEqual(1);
    expect(paya.moonHouseFromLagna).toBeLessThanOrEqual(12);

    // Verify Chapter 1 special data has the same identity
    const ch1 = report.chapters.find((c) => c.chapterNumber === 1);
    expect(ch1?.specialData?.topIdentity).toBeDefined();
    expect(ch1?.specialData?.topIdentity.ishtaDevata.deityEn).toBe(ishtaDevata.deityEn);

    // Verify other chapters do not duplicate the top identity as a primary section
    for (let i = 2; i <= 10; i++) {
      const ch = report.chapters.find((c) => c.chapterNumber === i);
      expect(ch?.specialData?.topIdentity).toBeUndefined();
    }
  });

  it('contains deep classical causes (शास्त्रीय कारण) in every chapter', () => {
    for (const ch of report.chapters) {
      for (const sec of ch.sections) {
        expect(sec.astrologicalCauseEn?.length).toBeGreaterThan(10);
        expect(sec.astrologicalCauseHi?.length).toBeGreaterThan(10);
        expect(sec.astrologicalCauseHi).toContain('शास्त्रीय कारण');
      }
    }
  });

  it('verifies Chapter 8 contains all 12 epochs spanning 15 to 75 years', () => {
    const ch8 = report.chapters.find((c) => c.chapterNumber === 8);
    expect(ch8).toBeDefined();
    expect(ch8?.sections.length).toBe(12);
    expect(ch8?.sections[0].titleEn).toContain('15–20');
    expect(ch8?.sections[11].titleEn).toContain('71–75');
  });

  it('verifies Chapter 1 contains Physical Appearance & Education sections', () => {
    const ch1 = report.chapters.find((c) => c.chapterNumber === 1);
    expect(ch1?.sections.length).toBe(5);
    const physSec = ch1?.sections.find((s) => s.titleEn.includes('Physical Appearance'));
    expect(physSec).toBeDefined();
    expect(physSec?.paragraphsEn.some((p) => p.includes('Stature'))).toBe(true);
    expect(ch1?.specialData?.physicalAppearance).toBeDefined();
    expect(ch1?.specialData?.physicalAppearance.complexionEn).toBeDefined();

    const eduSec = ch1?.sections.find((s) => s.titleEn.includes('Academic Crucible'));
    expect(eduSec).toBeDefined();
    expect(eduSec?.paragraphsEn.some((p) => p.includes('Competitive'))).toBe(true);
    expect(ch1?.specialData?.educationAcademics).toBeDefined();
  });

  it('verifies Chapter 4 contains Government Job verdict, top vocations & workplace hazards', () => {
    const ch4 = report.chapters.find((c) => c.chapterNumber === 4);
    expect(ch4?.sections.length).toBe(5);
    const govtSec = ch4?.sections.find((s) => s.titleEn.includes('Government Job'));
    expect(govtSec).toBeDefined();
    expect(ch4?.specialData?.careerVerdicts).toBeDefined();
    expect(ch4?.specialData?.careerVerdicts.govtJobLikelihoodPct).toBeGreaterThanOrEqual(20);
    expect(ch4?.specialData?.careerVerdicts.targetWingsEn.length).toBeGreaterThanOrEqual(2);
    expect(ch4?.specialData?.careerVerdicts.jobVsBusinessRatio).toBeDefined();

    const vocSec = ch4?.sections.find((s) => s.titleEn.includes('Top 5 Most Suitable Vocations'));
    expect(vocSec).toBeDefined();

    const hazardSec = ch4?.sections.find((s) => s.titleEn.includes('Workplace Hazards'));
    expect(hazardSec).toBeDefined();
  });

  it('verifies Chapter 6 contains Exhaustive 360° Relational Matrix', () => {
    const ch6 = report.chapters.find((c) => c.chapterNumber === 6);
    expect(ch6?.sections.length).toBe(4);
    const coreRelSec = ch6?.sections.find((s) => s.titleEn.includes('Core Family') || s.titleEn.includes('Father, Mother'));
    expect(coreRelSec).toBeDefined();
    expect(coreRelSec?.paragraphsEn.some((p) => p.includes('Father'))).toBe(true);
    expect(coreRelSec?.paragraphsEn.some((p) => p.includes('Mother'))).toBe(true);

    const extRelSec = ch6?.sections.find((s) => s.titleEn.includes('Extended Kinship'));
    expect(extRelSec).toBeDefined();
    expect(extRelSec?.paragraphsEn.some((p) => p.includes('Grandparents'))).toBe(true);
    expect(extRelSec?.paragraphsEn.some((p) => p.includes('In-Laws'))).toBe(true);
    expect(extRelSec?.paragraphsEn.some((p) => p.includes('Friends'))).toBe(true);
    expect(extRelSec?.paragraphsEn.some((p) => p.includes('Neighbours'))).toBe(true);

    expect(ch6?.specialData?.relationalMatrix.length).toBeGreaterThanOrEqual(10);
  });

  it('verifies Chapter 7 contains Addictions, Litigation & Bandhana Yoga', () => {
    const ch7 = report.chapters.find((c) => c.chapterNumber === 7);
    expect(ch7?.sections.length).toBe(5);
    const addictSec = ch7?.sections.find((s) => s.titleEn.includes('Addictions'));
    expect(addictSec).toBeDefined();
    expect(addictSec?.paragraphsEn.some((p) => p.includes('Substance'))).toBe(true);
    expect(ch7?.specialData?.addictionsAndVices).toBeDefined();

    const litSec = ch7?.sections.find((s) => s.titleEn.includes('Litigation'));
    expect(litSec).toBeDefined();
    expect(litSec?.paragraphsEn.some((p) => p.includes('Bandhana'))).toBe(true);
    expect(ch7?.specialData?.litigationAndAffairs).toBeDefined();
  });

  it('verifies Chapter 9 contains Global World Civilizations & Future Rebirth Global Geography', () => {
    const ch9 = report.chapters.find((c) => c.chapterNumber === 9);
    expect(ch9).toBeDefined();
    expect(ch9?.sections.length).toBe(2);
    const pastSec = ch9?.sections[0];
    expect(pastSec?.paragraphsEn.some((p) => p.includes('Civilization'))).toBe(true);
    expect(pastSec?.paragraphsEn.some((p) => p.includes('Manner of Death'))).toBe(true);

    const futureSec = ch9?.sections[1];
    expect(futureSec?.paragraphsEn.some((p) => p.includes('Future Incarnation Global Continent'))).toBe(true);
  });

  it('verifies Chapter 10 contains comprehensive 6-tier Vedic Shastric Remedies, Gochar shield, Nakshatra snana, active dasha and Lal Kitab conduct', () => {
    const ch10 = report.chapters.find((c) => c.chapterNumber === 10);
    expect(ch10).toBeDefined();
    expect(ch10?.sections.length).toBe(6);
    expect(ch10?.sections[0].titleEn).toContain('Vedic Planetary Shanti');
    expect(ch10?.sections[1].titleEn).toContain('Dusthana Cleansing');
    expect(ch10?.sections[2].titleEn).toContain('Nakshatra Deity');
    expect(ch10?.sections[3].titleEn).toContain('Active Gochar');
    expect(ch10?.sections[4].titleEn).toContain('Active Running Dasha Prescription');
    expect(ch10?.sections[5].titleEn).toContain('Lal Kitab Conduct Rules');
  });

  it('verifies dynamic relational contingencies and denial yogas are handled', () => {
    const ch6 = report.chapters.find((c) => c.chapterNumber === 6);
    expect(ch6).toBeDefined();
    const matrix = ch6?.specialData?.relationalMatrix as Array<{ id: string; relationEn: string; bondStatusHi: string; bondStatusEn: string }>;
    expect(matrix).toBeDefined();
    expect(matrix.length).toBe(13);
    const father = matrix.find((m) => m.id === 'father');
    const mother = matrix.find((m) => m.id === 'mother');
    const brothers = matrix.find((m) => m.id === 'brothers');
    const sisters = matrix.find((m) => m.id === 'sisters');
    const children = matrix.find((m) => m.id === 'children');
    const inlaws = matrix.find((m) => m.id === 'inlaws');
    expect(father).toBeDefined();
    expect(mother).toBeDefined();
    expect(brothers).toBeDefined();
    expect(sisters).toBeDefined();
    expect(children).toBeDefined();
    expect(inlaws).toBeDefined();
  });
});
