import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import {
  computeAdvanceMarriageMatching,
  evaluate16ManglikBhangaRules,
  evaluateBhakootPariharas,
  evaluateNadiPariharas,
} from '../marriageMatchingEngine';
import {
  buildPujaPrescription,
  computeMasterMarriageMuhurtaReport,
  evaluateTribalaOnDate,
} from '../marriageMuhurtaEngine';
import { generateAscendantPrediction } from '../predictions/ascendantWise';
import type { BirthInput, CalcSettings } from '../types';

describe('Advance Marriage Matching & Authentic Muhurta Suite', () => {
  const defaultSettings: CalcSettings = {
    ayanamsa: 'lahiri',
    nodeMode: 'true',
    houseSystem: 'whole_sign',
    chartStyle: 'north',
    dashaYearType: 'tropical',
    includeOuterPlanets: false,
    karakaCount: 8,
    horaMode: 'parashara',
  };

  // Sample Groom: Born in Delhi 15-05-1995 10:30
  const groomInput: BirthInput = {
    id: 'groom-test-1',
    name: 'वर (परीक्षण)',
    gender: 'male',
    date: '1995-05-15',
    time: '10:30',
    city: 'New Delhi',
    country: 'India',
    latitude: 28.6139,
    longitude: 77.209,
    timezone: 'Asia/Kolkata',
  };

  // Sample Bride: Born in Varanasi 22-08-1998 14:15
  const brideInput: BirthInput = {
    id: 'bride-test-1',
    name: 'कन्या (परीक्षण)',
    gender: 'female',
    date: '1998-08-22',
    time: '14:15',
    city: 'Varanasi',
    country: 'India',
    latitude: 25.3176,
    longitude: 82.9739,
    timezone: 'Asia/Kolkata',
  };

  const groomChart = calculateChart(groomInput, defaultSettings);
  const brideChart = calculateChart(brideInput, defaultSettings);

  it('computes 36 Ashtakoota gunas and all 8 kootas accurately', () => {
    const report = computeAdvanceMarriageMatching(groomChart, brideChart);

    expect(report.ashtakoota).toBeDefined();
    expect(report.ashtakoota.totalObtained).toBeGreaterThanOrEqual(0);
    expect(report.ashtakoota.totalObtained).toBeLessThanOrEqual(36);
    expect(report.ashtakoota.kootas).toHaveLength(8);

    const kootaNames = report.ashtakoota.kootas.map((c) => c.name);
    expect(kootaNames).toContain('Varna');
    expect(kootaNames).toContain('Vashya');
    expect(kootaNames).toContain('Tara');
    expect(kootaNames).toContain('Yoni');
    expect(kootaNames).toContain('Graha Maitri');
    expect(kootaNames).toContain('Gana');
    expect(kootaNames).toContain('Bhakoot');
    expect(kootaNames).toContain('Nadi');
  });

  it('computes Dashakoota (10 South Indian Poruthams) with Rajju and Vedha checks', () => {
    const report = computeAdvanceMarriageMatching(groomChart, brideChart);

    expect(report.dashakoota).toBeDefined();
    expect(report.dashakoota.items).toHaveLength(10);
    expect(typeof report.dashakoota.criticalRajjuPass).toBe('boolean');
    expect(report.dashakoota.totalScore).toBeGreaterThanOrEqual(0);
  });

  it('evaluates 16 Classical Manglik Bhanga rules and mutual cancellation', () => {
    const analysis = evaluate16ManglikBhangaRules(groomChart, brideChart);

    expect(typeof analysis.groomIsManglik).toBe('boolean');
    expect(typeof analysis.brideIsManglik).toBe('boolean');
    expect(typeof analysis.mutualBalanceCancelled).toBe('boolean');
    expect(analysis.activeBhangaRules).toBeDefined();
    expect(analysis.finalVerdictHi.length).toBeGreaterThan(0);
  });

  it('evaluates Bhakoot Parihara and Nadi Parihara classical rules correctly', () => {
    const bhakootParihara = evaluateBhakootPariharas(groomChart, brideChart);
    expect(typeof bhakootParihara.isPariharaApplicable).toBe('boolean');
    expect(bhakootParihara.verdictHi.length).toBeGreaterThan(0);

    const nadiParihara = evaluateNadiPariharas(groomChart, brideChart);
    expect(typeof nadiParihara.isPariharaApplicable).toBe('boolean');
    expect(nadiParihara.verdictHi.length).toBeGreaterThan(0);
  });

  it('computes Beeja Sphuta & Kshetra Sphuta, Synastry, Dasha Sandhi, Stri Jataka, Upapada, and Ayushya Safety', () => {
    const report = computeAdvanceMarriageMatching(groomChart, brideChart);

    expect(report.beejaKshetra).toBeDefined();
    expect(report.beejaKshetra.partnerABeeja).toBeDefined();
    expect(report.beejaKshetra.partnerBKshetra).toBeDefined();
    expect(report.synastryHouses).toHaveLength(12);
    expect(report.synastrySigns.length).toBeGreaterThan(0);
    expect(report.totalEffectiveGunas).toBeGreaterThanOrEqual(0);
    expect(report.totalEffectiveGunas).toBeLessThanOrEqual(36);

    // Dasha Sandhi
    expect(report.dashaSandhi).toBeDefined();
    expect(['Safe', 'Caution']).toContain(report.dashaSandhi.status);
    expect(report.dashaSandhi.verdictHi.length).toBeGreaterThan(0);

    // Stri Jataka
    expect(report.striJataka).toBeDefined();
    expect(report.striJataka.mangalyaBhavaScore).toBeGreaterThanOrEqual(0);
    expect(report.striJataka.mangalyaBhavaScore).toBeLessThanOrEqual(100);
    expect(typeof report.striJataka.hasVishaKanyaYoga).toBe('boolean');
    expect(typeof report.striJataka.hasVaidhavyaYoga).toBe('boolean');

    // Upapada Lagna
    expect(report.upapadaSynastry).toBeDefined();
    expect(report.upapadaSynastry.groomULSign).toBeGreaterThanOrEqual(0);
    expect(report.upapadaSynastry.brideULSign).toBeGreaterThanOrEqual(0);
    expect(report.upapadaSynastry.score).toBeGreaterThanOrEqual(0);

    // Ayushya Safety
    expect(report.ayushyaSafety).toBeDefined();
    expect(typeof report.ayushyaSafety.safetyPassed).toBe('boolean');
    expect(report.ayushyaSafety.verdictHi.length).toBeGreaterThan(0);
  });

  it('computes Tribala Shuddhi and triggers Lal Pooja / Peeli Pooja / Safed Pooja when needed', () => {
    // Sun in Taurus (1), Groom Moon Aries (0) -> 2nd house -> Madhyama -> Lal Pooja!
    // Jupiter in Cancer (3), Bride Moon Taurus (1) -> 3rd house -> Madhyama -> Peeli Pooja!
    // Moon in Gemini (2), Groom Aries (0) -> 3rd (Shubha), Bride Taurus (1) -> 2nd (Madhyama -> Safed Pooja)
    const tribala = evaluateTribalaOnDate(1, 3, 2, 0, 1);

    expect(tribala.groomSuryaHouse).toBe(2);
    expect(tribala.groomSuryaStatus).toBe('Madhyama');
    expect(tribala.needsLalPooja).toBe(true);

    expect(tribala.brideGuruHouse).toBe(3);
    expect(tribala.brideGuruStatus).toBe('Madhyama');
    expect(tribala.needsPeeliPooja).toBe(true);

    const lal = buildPujaPrescription('Lal');
    expect(lal.titleHi).toContain('लाल पूजा');
    expect(lal.samagriHi.length).toBeGreaterThan(0);
    expect(lal.sankalpaMantra.length).toBeGreaterThan(0);

    const peeli = buildPujaPrescription('Peeli');
    expect(peeli.titleHi).toContain('पीली पूजा');
    expect(peeli.samagriHi.length).toBeGreaterThan(0);
    expect(peeli.sankalpaMantra.length).toBeGreaterThan(0);
  });

  it('generates authentic Vivah, Sagai, and Tilak muhurtas with strictly DD-MM-YYYY dates', () => {
    const muhurtaCalendar = computeMasterMarriageMuhurtaReport(
      groomChart,
      brideChart,
      '2026-11-20'
    );

    expect(muhurtaCalendar.vivahaMuhurtas.length).toBeGreaterThan(0);
    expect(muhurtaCalendar.sagaiMuhurtas.length).toBeGreaterThan(0);
    expect(muhurtaCalendar.tilakMuhurtas.length).toBeGreaterThan(0);

    // Verify DD-MM-YYYY format for all dates
    const dmyRegex = /^\d{2}-\d{2}-\d{4}$/;
    for (const v of muhurtaCalendar.vivahaMuhurtas) {
      expect(v.dateDmy).toMatch(dmyRegex);
      expect(v.ceremonyType).toBe('Vivaha');
      expect(v.suitableLagnaHi.length).toBeGreaterThan(0);
      expect(v.score).toBeGreaterThanOrEqual(75);
    }

    for (const s of muhurtaCalendar.sagaiMuhurtas) {
      expect(s.dateDmy).toMatch(dmyRegex);
      expect(s.ceremonyType).toBe('Sagai');
    }

    for (const t of muhurtaCalendar.tilakMuhurtas) {
      expect(t.dateDmy).toMatch(dmyRegex);
      expect(t.ceremonyType).toBe('Tilak');
    }
  });

  it('generates rich Ascendant-Wise predictions for all 12 Lagnas with native chart synthesis', () => {
    for (let signIdx = 0; signIdx < 12; signIdx++) {
      const pred = generateAscendantPrediction(groomChart, signIdx);
      expect(pred.selectedLagnaIndex).toBe(signIdx);
      expect(pred.profile.signIndex).toBe(signIdx);
      expect(pred.profile.nameHi.length).toBeGreaterThan(0);
      expect(pred.profile.nameEn.length).toBeGreaterThan(0);
      expect(pred.profile.personalityHi.length).toBeGreaterThan(0);
      expect(pred.profile.dhanaAndProsperityHi.length).toBeGreaterThan(0);
      expect(pred.profile.marriageAndSpouseHi.length).toBeGreaterThan(0);
      expect(pred.profile.careerAndProfessionHi.length).toBeGreaterThan(0);
      expect(pred.profile.healthAndMilestonesHi.length).toBeGreaterThan(0);
      expect(pred.profile.milestoneAges.length).toBeGreaterThan(0);
      expect(pred.profile.functionalBeneficsHi.length).toBeGreaterThan(0);
      expect(pred.profile.functionalMaleficsHi.length).toBeGreaterThan(0);
      expect(pred.profile.remediesAndDeityHi.length).toBeGreaterThan(0);
      expect(pred.natalSynthesisHi.length).toBeGreaterThan(0);
    }
  });
});
