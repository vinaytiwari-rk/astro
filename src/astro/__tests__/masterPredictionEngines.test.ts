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
});
