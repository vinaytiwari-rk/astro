import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import {
  PVR_BIRTHTIME_SENSITIVITY_TABLE,
  PVR_NARASIMHA_RAO_BOOK_METADATA,
  PVR_SHODASHAVARGA_CORPUS,
  computePvrTransitMurthi,
  evaluatePvrArgalaOnHouse,
  evaluatePvrYogadaSystem,
} from '../predictions/pvrNarasimhaRaoKb';
import type { BirthInput, CalcSettings } from '../types';

describe('P.V.R. Narasimha Rao — Vedic Astrology: An Integrated Approach Suite', () => {
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

  const sampleNative: BirthInput = {
    id: 'pvr-test-sample',
    name: 'परीक्षण जातक',
    gender: 'male',
    date: '1990-10-24',
    time: '14:30:00',
    city: 'New Delhi',
    country: 'India',
    latitude: 28.6139,
    longitude: 77.209,
    timezone: 'Asia/Kolkata',
  };

  const chart = calculateChart(sampleNative, defaultSettings);

  it('contains valid Vedic integrated treatise metadata and fundamental axioms', () => {
    expect(PVR_NARASIMHA_RAO_BOOK_METADATA.title).toBe('Vedic Astrology: An Integrated Classical Treatise');
    expect(PVR_NARASIMHA_RAO_BOOK_METADATA.author).toBe('Classical Vedic Tradition');
    expect(PVR_NARASIMHA_RAO_BOOK_METADATA.forewordBy).toBe('Classical Parashari Authority');
    expect(PVR_NARASIMHA_RAO_BOOK_METADATA.totalPages).toBe(442);
    expect(PVR_NARASIMHA_RAO_BOOK_METADATA.url).toBeDefined();
    expect(PVR_NARASIMHA_RAO_BOOK_METADATA.fundamentalAxiomEn).toContain('Rasi chart (D1) represents physical manifestation');
    expect(PVR_NARASIMHA_RAO_BOOK_METADATA.fundamentalAxiomHi).toContain('स्थूल भौतिक संरचना');
  });

  it('contains comprehensive Shodashavarga (16 divisional charts) architecture', () => {
    const requiredVargas = ['D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12', 'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'];
    for (const vCode of requiredVargas) {
      const v = PVR_SHODASHAVARGA_CORPUS[vCode];
      expect(v).toBeDefined();
      expect(v.code).toBe(vCode);
      expect(v.sanskritName.length).toBeGreaterThan(0);
      expect(v.englishName.length).toBeGreaterThan(0);
      expect(v.domainEn.length).toBeGreaterThan(0);
      expect(v.domainHi.length).toBeGreaterThan(0);
      expect(v.significationsEn.length).toBeGreaterThanOrEqual(3);
      expect(v.independentLagnaRuleEn.length).toBeGreaterThan(0);
      expect(v.timeWindowMinutes).toBeGreaterThan(0);
      expect(v.keyHousesToAnalyze.length).toBeGreaterThan(0);
    }
  });

  it('provides exact birthtime error sensitivity scale across all 16 vargas', () => {
    expect(PVR_BIRTHTIME_SENSITIVITY_TABLE).toHaveLength(16);

    const d1 = PVR_BIRTHTIME_SENSITIVITY_TABLE.find((t) => t.varga === 'D1 Rasi')!;
    expect(d1.durationMinutes).toBe(120);

    const d9 = PVR_BIRTHTIME_SENSITIVITY_TABLE.find((t) => t.varga === 'D9 Navamsa')!;
    expect(d9.durationMinutes).toBe(13.3);

    const d10 = PVR_BIRTHTIME_SENSITIVITY_TABLE.find((t) => t.varga === 'D10 Dasamsa')!;
    expect(d10.durationMinutes).toBe(12);

    const d60 = PVR_BIRTHTIME_SENSITIVITY_TABLE.find((t) => t.varga === 'D60 Shashtiamsa')!;
    expect(d60.durationMinutes).toBe(2);
  });

  it('computes live Yogada, Maha Yogada and Kevala Maha Yogada doctrine', () => {
    const report = evaluatePvrYogadaSystem(chart);
    expect(report).toBeDefined();
    expect(Array.isArray(report.dhanaYogadas)).toBe(true);
    expect(Array.isArray(report.rajaYogadas)).toBe(true);
    expect(Array.isArray(report.mahaYogadas)).toBe(true);
    expect(Array.isArray(report.kevalaMahaYogadas)).toBe(true);
    expect(report.summaryHi.length).toBeGreaterThan(0);
    expect(report.summaryEn.length).toBeGreaterThan(0);
  });

  it('evaluates Argala and Virodhargala obstruction mechanics across houses', () => {
    for (let h = 1; h <= 12; h++) {
      const argalas = evaluatePvrArgalaOnHouse(chart, h);
      expect(Array.isArray(argalas)).toBe(true);
      for (const a of argalas) {
        expect(['Primary 2nd', 'Primary 4th', 'Primary 11th', 'Secondary 5th']).toContain(a.argalaType);
        expect(typeof a.isObstructed).toBe('boolean');
        expect(a.manifestationEn.length).toBeGreaterThan(0);
        expect(a.manifestationHi.length).toBeGreaterThan(0);
      }
    }
  });

  it('computes Gochara Murthi Nirnaya according to Moon ingress position (Table 62)', () => {
    // Natal Moon in Aries (0)
    // 1st, 6th, 11th from Moon -> Swarna (Gold)
    const swarna1 = computePvrTransitMurthi(0, 0); // 1st house
    expect(swarna1.type).toBe('Swarna (Gold)');
    expect(swarna1.favourabilityPercentage).toBe(100);

    const swarna6 = computePvrTransitMurthi(5, 0); // 6th house
    expect(swarna6.type).toBe('Swarna (Gold)');
    expect(swarna6.favourabilityPercentage).toBe(100);

    // 2nd, 5th, 9th from Moon -> Rajata (Silver)
    const rajata = computePvrTransitMurthi(1, 0); // 2nd house
    expect(rajata.type).toBe('Rajata (Silver)');
    expect(rajata.favourabilityPercentage).toBe(75);

    // 3rd, 7th, 10th from Moon -> Taamra (Copper)
    const taamra = computePvrTransitMurthi(2, 0); // 3rd house
    expect(taamra.type).toBe('Taamra (Copper)');
    expect(taamra.favourabilityPercentage).toBe(50);

    // 4th, 8th, 12th from Moon -> Loha (Iron)
    const loha = computePvrTransitMurthi(3, 0); // 4th house
    expect(loha.type).toBe('Loha (Iron)');
    expect(loha.favourabilityPercentage).toBe(25);
  });
});
