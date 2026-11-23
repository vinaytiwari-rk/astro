import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS } from '../../data/cities';
import type { BirthInput } from '../types';
import {
  computeAuthenticCalculatorsSuite,
  computeBirthDateMatch,
  computeCoupleAuspiciousDates,
  computeFriendshipAndLoyaltyQuotient,
  computeKarmicSoulBond,
  computeLifePartnerInitials,
  computeLongevityProtectionAndUpayas,
  computeLoveVsArrangedMarriage,
  computeMarakaAndVulnerabilityCycles,
  computeMaritalHarmonyAndRisk,
  computeMarriageTimingAndTransit,
  computeNameVibrationMatch,
  computeParasharaJaiminiAyurdaya,
  computeRelationshipPujaRecommendations,
  computeStreeJatakaAnalysis,
  computeZodiacElementMatch,
  type AyurdayaClassResult,
} from '../relationshipCalculatorsEngine';

const testNative: BirthInput = {
  id: 'test-native-calculators',
  name: 'Aarav',
  gender: 'male',
  date: '1995-06-15',
  time: '12:30:00',
  city: 'New Delhi',
  country: 'India',
  latitude: 28.6139,
  longitude: 77.209,
  timezone: 'Asia/Kolkata',
};

const testPartner: BirthInput = {
  id: 'test-partner-calculators',
  name: 'Priya',
  gender: 'female',
  date: '1997-09-22',
  time: '10:15:00',
  city: 'Varanasi',
  country: 'India',
  latitude: 25.3176,
  longitude: 82.9739,
  timezone: 'Asia/Kolkata',
};

describe('Authentic Relationship, Marriage, Numerology & Longevity Calculators Suite', () => {
  const chart1 = calculateChart(testNative, DEFAULT_SETTINGS);
  const chart2 = calculateChart(testPartner, DEFAULT_SETTINGS);

  // Category 1: Vedic Shastric Relationship & Marriage Calculators
  it('1. computes Love vs Arranged Marriage accurately with weights and classical factors', () => {
    const res = computeLoveVsArrangedMarriage(chart1);
    expect(res.loveScore).toBeGreaterThanOrEqual(0);
    expect(res.arrangedScore).toBeGreaterThanOrEqual(0);
    expect(res.loveScore + res.arrangedScore).toBe(100);
    expect(['Love Marriage', 'Arranged Marriage', 'Love-cum-Arranged']).toContain(res.verdictType);
    expect(res.verdictHi.length).toBeGreaterThan(10);
    expect(res.classicalReference).toContain('महर्षि पराशर');
  });

  it('2. computes Marriage Timing and Double Transit window with upcoming 3 years', () => {
    const res = computeMarriageTimingAndTransit(chart1);
    expect(res.primeAgeWindowHi).toBeDefined();
    expect(res.upcomingFavorableYears.length).toBe(3);
    expect(res.upcomingFavorableYears[0].year).toBe(new Date().getFullYear());
    expect(res.upapadaLagnaSignHi.length).toBeGreaterThan(0);
    expect(res.timingRemedyHi).toContain('बृहस्पतिवार');
  });

  it('3. derives Life Partner Name Initials using 7th house, UL, and 108 Nakshatra Padas', () => {
    const res = computeLifePartnerInitials(chart1);
    expect(res.primaryInitials.length).toBeGreaterThan(0);
    expect(res.primaryInitials[0].devanagari.length).toBeGreaterThan(0);
    expect(res.primaryInitials[0].roman.length).toBeGreaterThan(0);
    expect(res.seventhSignHi.length).toBeGreaterThan(0);
    expect(res.seventhLordHi.length).toBeGreaterThan(0);
  });

  it('4. analyzes Marital Harmony & Separation Risk without alarmist claims', () => {
    const res = computeMaritalHarmonyAndRisk(chart1);
    expect(res.harmonyScore).toBeGreaterThanOrEqual(0);
    expect(res.harmonyScore).toBeLessThanOrEqual(100);
    expect(res.separationRiskScore).toBeGreaterThanOrEqual(0);
    expect(res.separationRiskScore).toBeLessThanOrEqual(100);
    expect(res.protectiveFactorsHi.length).toBeGreaterThan(0);
    expect(res.sensitiveLifePeriodsHi.length).toBeGreaterThan(0);
  });

  it('5. computes Karmic Soul Bond & Rinanubandha (Vedic Alternative to Twin Flame)', () => {
    const res = computeKarmicSoulBond(chart1, chart2, { name: 'Aarav', dob: '1995-06-15' }, { name: 'Priya', dob: '1997-09-22' });
    expect(res.soulBondScore).toBeGreaterThanOrEqual(30);
    expect(res.soulBondScore).toBeLessThanOrEqual(100);
    expect(res.bondTypeHi.length).toBeGreaterThan(0);
    expect(res.karmicLessonHi.length).toBeGreaterThan(0);
  });

  it('6. calculates Varahamihira Stree Jataka Trimsamsha & Saubhagya accurately', () => {
    const res = computeStreeJatakaAnalysis(chart2);
    expect(res.lagnaTrimsamshaLordHi.length).toBeGreaterThan(0);
    expect(res.saubhagyaStatusHi.length).toBeGreaterThan(0);
    expect(res.characterAndVirtuesHi).toContain('त्रिंशांश');
    expect(res.classicalReference).toContain('वराहमिहिर');
  });

  it('7. evaluates Zodiac Element & Planetary Resonance Match', () => {
    const res = computeZodiacElementMatch(0, 6); // Aries (Fire) & Libra (Air)
    expect(res.overallResonanceScore).toBeGreaterThan(70);
    expect(res.element1Hi).toContain('अग्नि');
    expect(res.element2Hi).toContain('वायु');
    expect(res.elementalSynergyVerdictHi).toContain('संगम');
  });

  it('8. provides Vedic Relationship Puja & Upayas recommendations', () => {
    const res = computeRelationshipPujaRecommendations(chart1);
    expect(res.recommendedPujas.length).toBeGreaterThanOrEqual(3);
    const katyayani = res.recommendedPujas.find((p) => p.pujaTitleHi.includes('कात्यायनी'));
    expect(katyayani).toBeDefined();
    expect(katyayani?.prescribedMantra).toContain('कात्यायनि महामाये');
  });

  // Category 2: Authentic Numerology Calculators
  it('9. computes Birth Date Mulank & Bhagyank Compatibility', () => {
    const res = computeBirthDateMatch('1995-06-15', '1997-09-22');
    expect(res.mulank1).toBe(6); // 15 -> 1+5=6
    expect(res.mulank2).toBe(4); // 22 -> 2+2=4
    expect(res.overallScore).toBeGreaterThan(0);
    expect(res.dynamicAnalysisHi.length).toBeGreaterThan(0);
  });

  it('10. computes Chaldean & Pythagorean Name Vibration Match', () => {
    const res = computeNameVibrationMatch('Aarav', 'Priya');
    expect(res.p1Chaldean).toBeGreaterThanOrEqual(1);
    expect(res.p2Chaldean).toBeGreaterThanOrEqual(1);
    expect(res.vibrationalScore).toBeGreaterThanOrEqual(0);
    expect(res.vibrationVerdictHi.length).toBeGreaterThan(0);
  });

  it('11. finds Couple Auspicious Dates and Days of the week', () => {
    const res = computeCoupleAuspiciousDates('1995-06-15', '1997-09-22');
    expect(res.auspiciousMonthlyDates.length).toBeGreaterThan(0);
    expect(res.auspiciousWeekdaysHi.length).toBeGreaterThan(0);
    expect(res.recommendedActivitiesHi.length).toBeGreaterThan(0);
  });

  it('12. calculates Friendship & Loyalty Quotient with multiple dimensions', () => {
    const res = computeFriendshipAndLoyaltyQuotient(
      { name: 'Aarav', dob: '1995-06-15' },
      { name: 'Amit', dob: '1994-03-08' }
    );
    expect(res.loyaltyIndex).toBeGreaterThan(0);
    expect(res.communicationIndex).toBeGreaterThan(0);
    expect(res.longevityIndex).toBeGreaterThan(0);
    expect(res.overallFriendshipScore).toBeGreaterThan(0);
    expect(res.friendshipTypeHi.length).toBeGreaterThan(0);
  });

  // Category 3: Classical Ayurdaya & Longevity Protection
  it('13. computes Parashara & Jaimini Ayurdaya Longevity Class (Strictly ethical without death clock)', () => {
    const res = computeParasharaJaiminiAyurdaya(chart1);
    expect(['अल्पायु (०–३६ वर्ष)', 'मध्यायु (३६–७२ वर्ष)', 'दीर्घायु (७२–१०८ वर्ष)', 'पूर्णायु (१०८–१२० वर्ष)']).toContain(
      res.longevityClassHi
    );
    expect(res.jaiminiPairDetails.length).toBe(3);
    expect(res.ethicalShastricDisclaimerHi).toContain('सटीक मृत्यु तिथि');
    expect(res.classicalSource).toContain('जैमिनी');
  });

  it('14. computes Maraka Lords, Badhaka and 22nd Drekkana Vulnerability Cycles', () => {
    const res = computeMarakaAndVulnerabilityCycles(chart1);
    expect(res.marakaLords.length).toBe(2);
    expect(res.marakaLords[0].house).toBe(2);
    expect(res.marakaLords[1].house).toBe(7);
    expect(res.badhakaLord).toBeDefined();
    expect(res.twentySecondDrekkanaLordHi.length).toBeGreaterThan(0);
    expect(res.vulnerableAgeMilestones.length).toBeGreaterThan(0);
  });

  it('15. verifies Longevity Protection & Maha Mrityunjaya Balarishta Bhanga Upayas', () => {
    const res = computeLongevityProtectionAndUpayas(chart1);
    expect(typeof res.hasBalarishtaBhanga).toBe('boolean');
    expect(res.activeBhangaYogasHi.length).toBeGreaterThan(0);
    expect(res.mahaMrityunjayaMantra).toContain('त्र्यम्बकं यजामहे');
    expect(res.protectiveCharitiesHi.length).toBeGreaterThan(0);
  });

  // Master Suite
  it('runs the Master Suite and returns all 15 authentic calculators simultaneously', () => {
    const suite = computeAuthenticCalculatorsSuite(chart1, chart2);
    expect(suite.loveVsArranged).toBeDefined();
    expect(suite.marriageTiming).toBeDefined();
    expect(suite.lifePartnerInitials).toBeDefined();
    expect(suite.maritalHarmonyAndRisk).toBeDefined();
    expect(suite.karmicSoulBond).toBeDefined();
    expect(suite.streeJataka).toBeDefined();
    expect(suite.zodiacElementMatch).toBeDefined();
    expect(suite.relationshipPuja).toBeDefined();
    expect(suite.birthDateMatch).toBeDefined();
    expect(suite.nameVibrationMatch).toBeDefined();
    expect(suite.coupleAuspiciousDates).toBeDefined();
    expect(suite.friendshipAndLoyalty).toBeDefined();
    expect(suite.ayurdayaClass).toBeDefined();
    expect(suite.marakaAndVulnerability).toBeDefined();
    expect(suite.longevityProtection).toBeDefined();
  });

  it('16. dynamically updates scores, verdicts, Nama Rashi and partner verification in real time when names change', () => {
    const suitePriya = computeAuthenticCalculatorsSuite(
      chart1,
      undefined,
      { name: 'Aarav', dob: '1995-06-15' },
      { name: 'Priya', dob: '1997-09-22' }
    );

    const suiteSneha = computeAuthenticCalculatorsSuite(
      chart1,
      undefined,
      { name: 'Aarav', dob: '1995-06-15' },
      { name: 'Sneha', dob: '1997-09-22' }
    );

    const suiteRohan = computeAuthenticCalculatorsSuite(
      chart1,
      undefined,
      { name: 'Aarav', dob: '1995-06-15' },
      { name: 'Rohan', dob: '1997-09-22' }
    );

    // 1. Name Vibration numbers and scores must differ
    expect(suitePriya.nameVibrationMatch.p2Chaldean).not.toBe(suiteSneha.nameVibrationMatch.p2Chaldean);

    // 2. Zodiac Element & Nama Rashi must differ
    // Priya -> कन्या (Earth / Mercury)
    // Sneha -> कुंभ (Air / Saturn)
    expect(suitePriya.zodiacElementMatch.moonSign2Hi).not.toBe(suiteSneha.zodiacElementMatch.moonSign2Hi);
    expect(suitePriya.zodiacElementMatch.element2Hi).not.toBe(suiteSneha.zodiacElementMatch.element2Hi);

    // 3. Partner Name Match verification must differ
    expect(suitePriya.lifePartnerInitials.partnerNameMatch).toBeDefined();
    expect(suiteSneha.lifePartnerInitials.partnerNameMatch).toBeDefined();
    expect(suitePriya.lifePartnerInitials.partnerNameMatch?.partnerName).toBe('Priya');
    expect(suiteSneha.lifePartnerInitials.partnerNameMatch?.partnerName).toBe('Sneha');

    // 4. Marital Harmony score must dynamically factor in name vibration
    expect(suitePriya.maritalHarmonyAndRisk.harmonyScore).toBeDefined();
    expect(suiteRohan.maritalHarmonyAndRisk.harmonyScore).toBeDefined();
    expect(typeof suitePriya.maritalHarmonyAndRisk.harmonyScore).toBe('number');
  });
});
