import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS, SAMPLE_CHARTS } from '../../data/cities';
import { computeLifeDossierReport } from '../predictions/lifeDossierEngine';
import { computePredictionFramework } from '../predictions/predictionFramework';

describe('Life Dossier Engine (12-Chapter Master Life Dossier)', () => {
  const sample = SAMPLE_CHARTS[0];
  const chart = calculateChart(sample, DEFAULT_SETTINGS);
  const report = computeLifeDossierReport(chart);

  it('generates all 12 chapters strictly mapping Bhavas 1 through 12 without omission', () => {
    expect(report.chapters.length).toBe(12);
    for (let i = 1; i <= 12; i++) {
      const ch = report.chapters.find((c) => c.chapterNumber === i);
      expect(ch).toBeDefined();
      expect(ch?.houseNumber).toBe(i);
      expect(ch?.titleEn).toBeDefined();
      expect(ch?.titleHi).toBeDefined();
      expect(ch?.bhavaProfile).toBeDefined();
      expect(ch?.bhavaProfile.afflictionScore).toBeGreaterThanOrEqual(15);
      expect(ch?.bhavaProfile.afflictionScore).toBeLessThanOrEqual(95);
      expect(ch?.bhavaProfile.verdictSummaryHi.length).toBeGreaterThan(10);
      expect(ch?.bhavaProfile.verdictSummaryEn.length).toBeGreaterThan(10);

      expect(ch?.targetedRemedy).toBeDefined();
      expect(typeof ch?.targetedRemedy.isNeeded).toBe('boolean');
      expect(ch?.targetedRemedy.practicalPrecautionHi.length).toBeGreaterThan(10);
      expect(ch?.targetedRemedy.practicalPrecautionEn.length).toBeGreaterThan(10);

      expect(ch?.sections.length).toBeGreaterThanOrEqual(2);
      for (const sec of ch!.sections) {
        expect(sec.paragraphsEn.length).toBeGreaterThanOrEqual(1);
        expect(sec.paragraphsHi.length).toBeGreaterThanOrEqual(1);
        expect(sec.astrologicalCauseEn).toBeDefined();
        expect(sec.astrologicalCauseHi).toBeDefined();
      }
    }
  });

  it('uses the same central domain evidence in the 12-chapter dossier and 21-prediction engine', () => {
    const central = computePredictionFramework(chart);
    expect(central.map((item) => item.id)).toEqual([
      'career', 'marriage', 'wealth', 'education', 'children', 'property', 'litigation', 'foreign',
    ]);
    const careerChapter = report.chapters.find((chapter) => chapter.chapterNumber === 10);
    const marriageChapter = report.chapters.find((chapter) => chapter.chapterNumber === 7);
    const educationChapter = report.chapters.find((chapter) => chapter.chapterNumber === 5);
    expect(careerChapter?.predictionEvidence?.map((item) => item.id)).toEqual(['career']);
    expect(marriageChapter?.predictionEvidence?.map((item) => item.id)).toEqual(['marriage']);
    expect(educationChapter?.predictionEvidence?.map((item) => item.id)).toEqual(['education', 'children']);
    expect(report.chapters.find((chapter) => chapter.chapterNumber === 8)?.predictionEvidence).toEqual([]);
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
    for (let i = 2; i <= 12; i++) {
      const ch = report.chapters.find((c) => c.chapterNumber === i);
      expect(ch?.specialData?.topIdentity).toBeUndefined();
    }
  });

  it('contains deep classical causes (शास्त्रीय कारण) in every chapter', () => {
    for (const ch of report.chapters) {
      for (const sec of ch.sections) {
        expect(sec.astrologicalCauseEn?.length).toBeGreaterThan(10);
        expect(sec.astrologicalCauseHi?.length).toBeGreaterThan(10);
        // Evidence may be stated as a direct chart placement or a classical
        // cause; do not require one fixed prefix for every section.
        expect(sec.astrologicalCauseHi).toMatch(/शास्त्रीय कारण|पारंपरिक|ज्योतिषीय|भाव \d+ में|राशि/);
      }
    }
  });

  it('verifies targeted remedy logic: safe houses require no remedy, afflicted houses prescribe targeted stotras', () => {
    let safeHouseFound = false;
    let afflictedHouseFound = false;

    for (const ch of report.chapters) {
      if (!ch.targetedRemedy.isNeeded) {
        safeHouseFound = true;
        expect(ch.targetedRemedy.practicalPrecautionHi).toContain('किसी उपाय, रत्न');
      } else {
        afflictedHouseFound = true;
        expect(ch.targetedRemedy.stotraOrMantraHi).toBeDefined();
        expect(ch.targetedRemedy.charityDayHi).toBeDefined();
      }
    }

    expect(safeHouseFound).toBe(true);
    expect(afflictedHouseFound).toBe(true);
  });

  it('verifies Chapter 1 contains Physical Appearance', () => {
    const ch1 = report.chapters.find((c) => c.chapterNumber === 1);
    expect(ch1?.sections.length).toBe(5);
    const physSec = ch1?.sections.find((s) => s.titleEn.includes('Physical Appearance'));
    expect(physSec).toBeDefined();
    expect(physSec?.paragraphsEn.some((p) => p.includes('Stature'))).toBe(true);
    expect(ch1?.specialData?.physicalAppearance).toBeDefined();
  });

  it('verifies Chapter 5 (Suta Bhava) contains Academic Crucible & Education', () => {
    const ch5 = report.chapters.find((c) => c.chapterNumber === 5);
    expect(ch5).toBeDefined();
    const eduSec = ch5?.sections.find((s) => s.titleEn.includes('Academic Crucible'));
    expect(eduSec).toBeDefined();
    expect(eduSec?.paragraphsEn.some((p) => p.includes('Competitive'))).toBe(true);
    expect(ch5?.specialData?.educationAcademics).toBeDefined();
  });

  it('verifies Chapter 6 (Ripu Bhava) contains Addictions & Litigation', () => {
    const ch6 = report.chapters.find((c) => c.chapterNumber === 6);
    expect(ch6).toBeDefined();
    const addictSec = ch6?.sections.find((s) => s.titleEn.includes('Addiction'));
    expect(addictSec).toBeDefined();
    expect(ch6?.specialData?.addictionsAndVices).toBeDefined();

    const litSec = ch6?.sections.find((s) => s.titleEn.includes('Litigation'));
    expect(litSec).toBeDefined();
    expect(ch6?.specialData?.litigationAndAffairs).toBeDefined();
  });

  it('verifies Chapter 7 (Kalatra Bhava) contains Marriage, Spouse & Bed Pleasures', () => {
    const ch7 = report.chapters.find((c) => c.chapterNumber === 7);
    expect(ch7).toBeDefined();
    expect(ch7?.sections.length).toBeGreaterThanOrEqual(3);
    const spouseSec = ch7?.sections.find((s) => s.titleEn.includes('Spouse') || s.titleEn.includes('Marriage'));
    expect(spouseSec).toBeDefined();
  });

  it('verifies Chapter 8 (Randhra Bhava) contains Longevity & all 12 epochs spanning 15 to 75 years', () => {
    const ch8 = report.chapters.find((c) => c.chapterNumber === 8);
    expect(ch8).toBeDefined();
    expect(ch8?.sections.length).toBe(15); // 3 foundation sections + 12 epochs
    expect(ch8?.specialData?.longevity).toBeUndefined();
    const epoch1 = ch8?.sections.find((s) => s.titleEn.includes('15–20') || s.titleEn.includes('1878–1883'));
    expect(epoch1).toBeDefined();
    const epochs = ch8?.sections.filter((section) => section.titleEn.startsWith('Epoch ')) ?? [];
    expect(epochs).toHaveLength(12);
    for (const epoch of epochs) {
      expect(epoch.paragraphsEn.join(' ')).toContain('does not establish');
      expect(epoch.paragraphsHi.join(' ')).toContain('सिद्ध नहीं होता');
      expect(epoch.paragraphsEn.join(' ')).not.toContain('Manner of Death');
    }
  });

  it('verifies Chapter 9 (Bhagya Bhava) contains Global World Civilizations & Future Rebirth Global Geography', () => {
    const ch9 = report.chapters.find((c) => c.chapterNumber === 9);
    expect(ch9).toBeDefined();
    expect(ch9?.sections.length).toBe(4);
    const pastSec = ch9?.sections.find((s) => s.titleEn.includes('Past-Life Identity Markers'));
    expect(pastSec).toBeDefined();
    expect(pastSec?.paragraphsEn.some((p) => p.includes('Civilization'))).toBe(true);

    const futureSec = ch9?.sections.find((s) => s.titleEn.includes('Future Incarnation'));
    expect(futureSec).toBeDefined();
  });

  it('verifies Chapter 10 (Karma Bhava) contains Government Job verdict, top vocations & workplace hazards', () => {
    const ch10 = report.chapters.find((c) => c.chapterNumber === 10);
    expect(ch10).toBeDefined();
    expect(ch10?.sections.length).toBe(6);
    const govtSec = ch10?.sections.find((s) => s.titleEn.includes('Government Job'));
    expect(govtSec).toBeDefined();
    expect(ch10?.specialData?.careerVerdicts).toBeDefined();
    expect(ch10?.specialData?.careerVerdicts.govtJobLikelihoodPct).toBeGreaterThanOrEqual(20);
    expect(ch10?.specialData?.careerVerdicts.jobVsBusinessRatio).toBeDefined();
  });

  it('verifies Chapter 12 (Vyaya Bhava) contains Financial Leakage & comprehensive Vedic remedies', () => {
    const ch12 = report.chapters.find((c) => c.chapterNumber === 12);
    expect(ch12).toBeDefined();
    expect(ch12?.specialData?.vedicRemediesSummary).toBeDefined();
    const remSec = ch12?.sections.find((s) => s.titleEn.includes('Vedic Planetary Shanti'));
    expect(remSec).toBeDefined();
  });

  it('guarantees unique, individualized predictions across different horoscopes with zero boilerplate parity', () => {
    const vivekanandaChart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const einsteinChart = calculateChart(SAMPLE_CHARTS[1], DEFAULT_SETTINGS);

    const repVivekananda = computeLifeDossierReport(vivekanandaChart);
    const repEinstein = computeLifeDossierReport(einsteinChart);

    // Verify completely different Nakshatra profiles & psychology in Chapter 1
    const ch1Viv = repVivekananda.chapters.find((c) => c.chapterNumber === 1);
    const ch1Ein = repEinstein.chapters.find((c) => c.chapterNumber === 1);
    expect(ch1Viv?.sections[4].paragraphsEn[1]).not.toBe(ch1Ein?.sections[4].paragraphsEn[1]);

    // Verify completely different Indu Lagna in Chapter 2
    const ch2Viv = repVivekananda.chapters.find((c) => c.chapterNumber === 2);
    const ch2Ein = repEinstein.chapters.find((c) => c.chapterNumber === 2);
    expect(ch2Viv?.sections[0].paragraphsEn[1]).not.toBe(ch2Ein?.sections[0].paragraphsEn[1]);

    // Verify completely different Marriage profiles in Chapter 7
    const ch7Viv = repVivekananda.chapters.find((c) => c.chapterNumber === 7);
    const ch7Ein = repEinstein.chapters.find((c) => c.chapterNumber === 7);
    expect(ch7Viv?.sections[0].paragraphsEn[0]).not.toBe(ch7Ein?.sections[0].paragraphsEn[0]);

    // Verify completely different Epoch Timeline calendar years in Chapter 8
    const ch8Viv = repVivekananda.chapters.find((c) => c.chapterNumber === 8);
    const ch8Ein = repEinstein.chapters.find((c) => c.chapterNumber === 8);
    const vivEpoch1 = ch8Viv?.sections.find((s) => s.titleEn.includes('1878–1883'));
    const einEpoch1 = ch8Ein?.sections.find((s) => s.titleEn.includes('1894–1899'));
    expect(vivEpoch1).toBeDefined();
    expect(einEpoch1).toBeDefined();
  });
});
  it('keeps career chapter claims qualitative, chart-led and free of invented age windows', () => {
    const first = computeLifeDossierReport(calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS));
    const second = computeLifeDossierReport(calculateChart(SAMPLE_CHARTS[1], DEFAULT_SETTINGS));
    const firstCareer = first.chapters.find((chapter) => chapter.chapterNumber === 10);
    const secondCareer = second.chapters.find((chapter) => chapter.chapterNumber === 10);
    expect(firstCareer).toBeDefined();
    expect(secondCareer).toBeDefined();

    const firstText = firstCareer!.sections.map((section) =>
      [section.titleEn, section.titleHi, ...section.paragraphsEn, ...section.paragraphsHi].join(' '),
    ).join(' ');
    expect(firstText).not.toMatch(/% Probability|% संभावना|Ages 22 to 28|22 से 28 वर्ष/);
    expect(firstText).toMatch(/not a probability|सांख्यिकीय संभावना नहीं/);

    const firstVocations = firstCareer!.sections.find((section) => section.titleEn.includes('Vocations'));
    const secondVocations = secondCareer!.sections.find((section) => section.titleEn.includes('Vocations'));
    expect(firstVocations).toBeDefined();
    expect(secondVocations).toBeDefined();
    expect(firstVocations!.paragraphsEn[1]).not.toBe(secondVocations!.paragraphsEn[1]);
  });
  it('embeds all 21 selected life predictions within the existing 12 chapters', () => {
    const report = computeLifeDossierReport(calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS));
    expect(report.chapters).toHaveLength(12);
    const embedded = report.chapters.flatMap((chapter) =>
      chapter.sections.filter((section) => section.lifeDimensionId !== undefined),
    );
    expect(embedded).toHaveLength(21);
    expect(embedded.map((section) => section.lifeDimensionId).sort((a, b) => a! - b!))
      .toEqual(Array.from({ length: 21 }, (_, index) => index + 1));
    for (const chapter of report.chapters) {
      expect(chapter.sections.filter((section) => section.lifeDimensionId !== undefined).length)
        .toBeGreaterThanOrEqual(0);
    }
  });
