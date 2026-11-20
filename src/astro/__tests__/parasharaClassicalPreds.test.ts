import { describe, expect, it } from 'vitest';
import {
  PARASHARA_LIGHT_CONJUNCTIONS,
  PARASHARA_LIGHT_YOGAS_CORPUS,
  lookupParasharaConjunction,
} from '../predictions/parasharasLightYogasKb';
import {
  computePlanetInNakshatraPredictions,
  inspectHypotheticalNakshatra,
  NAK_ACTIVATION_AGES,
  NAK_CLASSICAL_SUTRAS,
} from '../predictions/planetInNakshatra';
import {
  computePlanetInSignPredictions,
  inspectHypotheticalPlanetInSign,
} from '../predictions/planetInSign';
import {
  computeDrishtiPredictions,
  inspectCustomDrishti,
} from '../predictions/drishtiPredictions';
import {
  inspectCustomYuti,
} from '../predictions/yutiPredictions';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS } from '../../data/cities';
import { DEFAULT_USER_PROFILE } from '../../App';

describe('Parashara Light 6.1 Classical Yogas & Multi-Planet Conjunctions', () => {
  it('loads classical yogas corpus and multi-graha conjunction combinations', () => {
    expect(PARASHARA_LIGHT_YOGAS_CORPUS.length).toBeGreaterThanOrEqual(250);
    expect(Object.keys(PARASHARA_LIGHT_CONJUNCTIONS).length).toBeGreaterThanOrEqual(100);

    // Test 2-planet conjunction lookup
    const sunMoon = lookupParasharaConjunction(['Sun', 'Moon']);
    expect(sunMoon).toBeDefined();
    expect(sunMoon?.nameHi).toContain('सूर्य-चंद्र');
    expect(sunMoon?.readingEn.length).toBeGreaterThan(10);

    // Test multi-planet conjunction lookup
    const threeGraha = lookupParasharaConjunction(['Sun', 'Moon', 'Mars']);
    expect(threeGraha).toBeDefined();
    expect(threeGraha?.planets).toEqual(['Sun', 'Moon', 'Mars']);

    const fiveGraha = lookupParasharaConjunction(['Sun', 'Moon', 'Mars', 'Jupiter', 'Saturn']);
    expect(fiveGraha).toBeDefined();
    expect(fiveGraha?.readingEn).toContain('combat');
  });

  it('inspectCustomYuti incorporates classical Saravali / Parashara Light 6.1 sutras', () => {
    const custom = inspectCustomYuti(['Sun', 'Moon', 'Mars', 'Jupiter', 'Saturn'], 1, 0);
    expect(custom).not.toBeNull();
    expect(custom?.source).toContain('Saravali');
    expect(custom?.positiveEn).toContain('combat');
    expect(custom?.count).toBe(5);
  });
});

describe('Nakshatra-wise Classical Predictions & Tara Bala Activation', () => {
  it('provides 27 activation age sets and classical sutras', () => {
    expect(NAK_ACTIVATION_AGES.length).toBe(27);
    expect(NAK_CLASSICAL_SUTRAS.length).toBe(27);
    expect(NAK_ACTIVATION_AGES[0]).toEqual([16, 28, 44]); // Ashwini

    const mockChart = calculateChart(DEFAULT_USER_PROFILE, DEFAULT_SETTINGS);

    const preds = computePlanetInNakshatraPredictions(mockChart);
    expect(preds.length).toBeGreaterThanOrEqual(10);
    for (const p of preds) {
      expect(p.activationAges.length).toBeGreaterThan(0);
      expect(p.taraTimingHi.length).toBeGreaterThan(5);
      expect(p.classicalSutraHi).toContain('फलदीपिका');
    }

    const testNak = inspectHypotheticalNakshatra('Moon', 3, 2); // Rohini Pada 2
    expect(testNak.nakNameEn).toBe('Rohini');
    expect(testNak.activationAges).toEqual([24, 36, 48]);
    expect(testNak.classicalSutraHi).toContain('सत्यवादी');
  });
});

describe('Sign-wise Classical Predictions with Saravali & Fruition Milestones', () => {
  it('computes fruition age, decade, Saravali sutra, and remedies', () => {
    const mockChart = calculateChart(DEFAULT_USER_PROFILE, DEFAULT_SETTINGS);

    const signPreds = computePlanetInSignPredictions(mockChart);
    expect(signPreds.length).toBeGreaterThanOrEqual(10);
    for (const sp of signPreds) {
      expect(sp.fruitionAge).toBeGreaterThan(15);
      expect(sp.peakDecade.length).toBeGreaterThan(3);
      expect(sp.saravaliPhalaHi).toContain('सारावली');
      expect(sp.remedyDirectiveHi.length).toBeGreaterThan(5);
    }

    const testSign = inspectHypotheticalPlanetInSign('Sun', 0); // Sun in Aries
    expect(testSign.headlineHi).toContain('उच्च');
    expect(testSign.fruitionAge).toBe(20);
    expect(testSign.remedyHi).toContain('सूर्य');
  });
});

describe('Aspect / Drishti-wise Predictions with Parashari Dasha Timing', () => {
  it('evaluates planetary aspect links with timing rules and remedies', () => {
    const mockChart = calculateChart(DEFAULT_USER_PROFILE, DEFAULT_SETTINGS);

    const drishtiRep = computeDrishtiPredictions(mockChart);
    expect(drishtiRep.planetaryDrishtis.length).toBeGreaterThan(0);
    for (const d of drishtiRep.planetaryDrishtis) {
      expect(d.timingRuleHi).toContain('महादशा');
      expect(d.classicalShastraHi).toContain('बृहत्पाराशर');
      expect(d.remedyHi.length).toBeGreaterThan(5);
    }

    const customDrishti = inspectCustomDrishti('Jupiter', 'Moon', 7);
    expect(customDrishti.timingRuleHi).toContain('महादशा');
    expect(customDrishti.positiveHi).toContain('गजकेसरी');
  });
});
