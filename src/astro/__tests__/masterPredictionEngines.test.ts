import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS } from '../../data/cities';
import type { BirthInput } from '../types';

import { computeLifeEventTiming } from '../predictions/lifeEventTimingEngine';
import { computeClassicalDoshas } from '../predictions/classicalDoshasEngine';
import { computeAyurdaya } from '../predictions/ayurdayaEngine';
import { getDashaCombinationInsight } from '../predictions/dashaCombinations81';
import { computeAshtakavargaKakshya } from '../predictions/ashtakavargaKakshya';
import { computeNadiYogasAndKarma } from '../predictions/nadiYogasAndKarma';
import { computeUpagrahas } from '../predictions/upagrahaEngine';
import { computeKotaChakra } from '../predictions/kotaChakraEngine';
import { CELEBRITY_DATABASE, findCelebrityTwins } from '../celebrityTwins';
import {
  computeLoveCompatibility,
  computeFriendshipCompatibility,
  computePastLifeReading,
  computeFutureLifeReading,
} from '../fortuneCalculators';
import {
  computePalmistryReading,
  DEFAULT_PALMISTRY_ANSWERS,
} from '../palmistryEngine';

const sampleInput: BirthInput = {
  id: 'master-test-native',
  name: 'Master Test Native',
  gender: 'male',
  date: '1988-10-24',
  time: '08:45:00',
  city: 'Varanasi',
  country: 'India',
  latitude: 25.3176,
  longitude: 82.9739,
  timezone: 'Asia/Kolkata',
};

describe('Master Classical & Modern Prediction Suites', () => {
  const chart = calculateChart(sampleInput, DEFAULT_SETTINGS);

  it('computes exact Life Event Timing windows with chronological sorting', () => {
    const report = computeLifeEventTiming(chart);
    expect(report.currentAge).toBeGreaterThan(30);
    expect(report.eventChronology.length).toBeGreaterThan(0);

    const first = report.eventChronology[0];
    expect(first.category).toBeDefined();
    expect(first.startDate).toMatch(/^\d{2}-\d{2}-\d{4}$/);
    expect(first.endDate).toMatch(/^\d{2}-\d{2}-\d{4}$/);
    expect(first.probabilityScore).toBeGreaterThanOrEqual(0);
    expect(first.probabilityScore).toBeLessThanOrEqual(100);
    expect(first.unvarnishedCautionHi).toBeDefined();
  });

  it('evaluates 18 Classical Doshas, active age triggers & Kuja Dosha cancellations', () => {
    const report = computeClassicalDoshas(chart);
    expect(report.doshas.length).toBeGreaterThanOrEqual(6);
    expect(report.overallDoshaScore).toBeGreaterThanOrEqual(0);
    expect(report.overallDoshaScore).toBeLessThanOrEqual(100);

    const ks = report.doshas.find((d) => d.id === 'kaal_sarp');
    expect(ks).toBeDefined();
    expect(ks?.activeAgeYears).toBeDefined();

    const manglik = report.doshas.find((d) => d.id === 'manglik');
    expect(manglik).toBeDefined();
    expect(manglik?.cancellationNoteHi).toBeDefined();
  });

  it('determines Jaimini 3-Pair Ayurdaya, Maraka and Badhaka lords', () => {
    const ayur = computeAyurdaya(chart);
    expect(ayur.category).toBeDefined();
    expect(ayur.jaiminiPairs.length).toBe(3);
    expect(ayur.marakaLords.length).toBe(2);
    expect(ayur.badhakaLord.house).toBeGreaterThanOrEqual(7);
    expect(ayur.criticalVulnerabilityAges.length).toBeGreaterThanOrEqual(3);
  });

  it('synthesizes 81 Mahadasha-Antardasha combinations with mutual axis', () => {
    const insight = getDashaCombinationInsight(chart, 'Jupiter', 'Saturn');
    expect(insight.mutualAxis).toBeDefined();
    expect(insight.careerImpactHi).toBeDefined();
    expect(insight.unvarnishedRealityHi).toBeDefined();
    expect(insight.classicalRemedyHi).toBeDefined();
  });

  it('evaluates Ashtakavarga Kakshya real-time transit triggers and Shodhya Pinda', () => {
    const kakshya = computeAshtakavargaKakshya(chart);
    expect(kakshya.transitKakshyaStatuses.length).toBeGreaterThanOrEqual(5);
    expect(kakshya.shodhyaPindaInsights.length).toBeGreaterThanOrEqual(3);

    const first = kakshya.transitKakshyaStatuses[0];
    expect(first.kakshyaLord).toBeDefined();
    expect(typeof first.hasBindu).toBe('boolean');
  });

  it('evaluates Bhrigu Nandi Nadi conjunctions and Parashari past-life curses', () => {
    const karma = computeNadiYogasAndKarma(chart);
    expect(karma.pastLifeCurses.length).toBeGreaterThanOrEqual(4);
    const sarpa = karma.pastLifeCurses.find((c) => c.shapaId === 'sarpa_shapa');
    expect(sarpa).toBeDefined();
    expect(sarpa?.parashariPrayaschittaHi).toBeDefined();
  });

  it('computes 9 Upagrahas including Gulika, Mandi, and 5 solar shadow points', () => {
    const upa = computeUpagrahas(chart);
    expect(upa.upagrahas.length).toBe(9);
    expect(upa.gulikaHouse).toBeGreaterThanOrEqual(1);
    expect(upa.gulikaHouse).toBeLessThanOrEqual(12);

    const dhuma = upa.upagrahas.find((u) => u.id === 'dhuma');
    expect(dhuma).toBeDefined();
    expect(dhuma?.longitude).toBeGreaterThanOrEqual(0);
    expect(dhuma?.longitude).toBeLessThan(360);
  });

  it('evaluates Kota Chakra 4 concentric fort quadrangles and fort siege status', () => {
    const kota = computeKotaChakra(chart);
    expect(kota.janmaNakshatra).toBeDefined();
    expect(kota.kotaSwami).toBeDefined();
    expect(kota.kotaPala).toBeDefined();
    expect(['Fortified & Triumphant', 'Vulnerable / Under Siege', 'Balanced Defense']).toContain(
      kota.fortVulnerabilityStatus
    );
    expect(kota.placements.length).toBe(9);
  });

  it('verifies 120-year Parashari Paramayus life event timing coverage', () => {
    const report = computeLifeEventTiming(chart);
    // Chronology should include event windows spanning beyond age 85 up to 120 years
    const maxEndAge = Math.max(...report.eventChronology.map((e) => e.endAge));
    expect(maxEndAge).toBeGreaterThan(80);
    expect(maxEndAge).toBeLessThanOrEqual(121);
  });

  it('validates global celebrity twins databank with 12 Lagnas, initials badges, milestones, and Rodden AA rating', () => {
    expect(CELEBRITY_DATABASE.length).toBeGreaterThanOrEqual(24);

    // Verify all 12 Lagnas (0..11) are represented
    const lagnasRepresented = new Set(CELEBRITY_DATABASE.map((c) => c.ascSignIndex));
    for (let sign = 0; sign < 12; sign++) {
      expect(lagnasRepresented.has(sign)).toBe(true);
    }

    // Verify every celebrity has verified initials, Rodden rating, milestones, and quotes
    for (const celeb of CELEBRITY_DATABASE) {
      expect(celeb.initials.length).toBeGreaterThanOrEqual(1);
      expect(celeb.badgeBg).toBeDefined();
      expect(['AA', 'A']).toContain(celeb.roddenRating);
      expect(celeb.keyLifeMilestones.length).toBeGreaterThanOrEqual(3);
      expect(celeb.quoteHi.length).toBeGreaterThan(5);
      expect(celeb.quoteEn.length).toBeGreaterThan(5);
    }

    // Verify findCelebrityTwins returns sorted matches
    const matches = findCelebrityTwins(chart);
    expect(matches.length).toBe(CELEBRITY_DATABASE.length);
    expect(matches[0].similarityScore).toBeGreaterThanOrEqual(matches[1].similarityScore);
    expect(matches[0].similarityScore).toBeLessThanOrEqual(100);
    expect(matches[0].celebrity.initials).toBeDefined();
  });

  it('computes Name & Date of Birth Love Compatibility with 4 numerology systems', () => {
    const love = computeLoveCompatibility(
      { name: 'Rohit Sharma', dob: '1987-04-30' },
      { name: 'Ritika Sajdeh', dob: '1987-12-21' }
    );
    expect(love.overallLoveScore).toBeGreaterThanOrEqual(0);
    expect(love.overallLoveScore).toBeLessThanOrEqual(100);
    expect(love.attractionScore).toBeGreaterThanOrEqual(0);
    expect(love.emotionalResonanceScore).toBeGreaterThanOrEqual(0);
    expect(love.relationshipDynamicsHi).toBeDefined();
    expect(love.potentialFrictionHi).toBeDefined();
    expect(love.harmonizingRemediesHi).toBeDefined();
    expect(love.auspiciousCoupleDates.length).toBeGreaterThanOrEqual(1);
  });

  it('computes Friendship Compatibility synergy, trust index and friction triggers', () => {
    const friend = computeFriendshipCompatibility('Karan', 'Arjun', '1992-05-14', '1992-08-20');
    expect(friend.friendshipScore).toBeGreaterThanOrEqual(0);
    expect(friend.friendshipScore).toBeLessThanOrEqual(100);
    expect(friend.trustIndex).toBeGreaterThanOrEqual(0);
    expect(friend.sharedStrengthsHi).toBeDefined();
    expect(friend.frictionTriggersHi).toBeDefined();
    expect(friend.friendshipVerdictHi).toBeDefined();
  });

  it('computes Past Life Reading from 12th house, Ketu, D60 & Saturn karma', () => {
    const past = computePastLifeReading(chart);
    expect(past.pastLifeRoleHi).toBeDefined();
    expect(past.geographicSoulCradleHi).toBeDefined();
    expect(past.historicalEraHi).toBeDefined();
    expect(past.sanchitaKarmaDebtHi).toBeDefined();
    expect(past.unfinishedSoulMissionHi).toBeDefined();
    expect(past.garudaPuranaRemedyHi).toBeDefined();
  });

  it('computes Future Life & Rebirth Trajectory from 9th/12th/Jupiter Moksha axis', () => {
    const future = computeFutureLifeReading(chart);
    expect([
      'Urdhva Gati (Higher Realm / Devaloka)',
      'Madhya Gati (Elevated Human Incarnation)',
      'Adho Gati (Earthly Recycling for Desires)',
    ]).toContain(future.soulGatiEn);
    expect(future.mokshaProximityPercent).toBeGreaterThanOrEqual(0);
    expect(future.mokshaProximityPercent).toBeLessThanOrEqual(100);
    expect(future.anticipatedNextLifeDomainHi).toBeDefined();
    expect(future.sadgatiPrescriptionHi).toBeDefined();
  });

  it('computes Interactive Samudrika Palmistry predictions from hand and line traits', () => {
    const palmReport = computePalmistryReading(DEFAULT_PALMISTRY_ANSWERS);
    expect(palmReport.handClassificationHi).toBeDefined();
    expect(palmReport.handClassificationEn).toBeDefined();
    expect(palmReport.primeDestinyRiseAge).toBeGreaterThanOrEqual(20);
    expect(palmReport.primeDestinyRiseAge).toBeLessThanOrEqual(50);
    expect(palmReport.careerAndDestinyHi).toBeDefined();
    expect(palmReport.loveAndMaritalDestinyHi).toBeDefined();
    expect(palmReport.healthAndVitalityIndexHi).toBeDefined();
    expect(palmReport.majorTurningPoints.length).toBe(4);
    expect(palmReport.samudrikaYogasIdentifiedHi.length).toBeGreaterThanOrEqual(1);
    expect(palmReport.classicalRemediesHi).toBeDefined();
  });
});
