import { describe, expect, it } from 'vitest';
import {
  CHARAK_BHAVA_12_CORPUS,
  CHARAK_DOUBLE_TRANSIT_DOCTRINE,
  CHARAK_GOCHARA_VEDHA_RULES,
  CHARAK_GRAHA_9_CORPUS,
  CHARAK_SUDARSHANA_CHAKRA_DOCTRINE,
  DR_CHARAK_BOOK_METADATA,
  FARFARAWAY_SYNTHESIS_METADATA,
  getCharakBhava,
  getCharakGraha,
} from '../predictions/charakElementsKb';

describe('Dr. K.S. Charak & Far Far Away Classical Treatises KB', () => {
  it('contains valid treatise metadata and fundamental axioms', () => {
    expect(DR_CHARAK_BOOK_METADATA.title).toContain('Elements of Vedic Astrology');
    expect(DR_CHARAK_BOOK_METADATA.author).toContain('Dr. K.S. Charak');
    expect(DR_CHARAK_BOOK_METADATA.affiliation).toContain('Bharatiya Vidya Bhavan');
    expect(DR_CHARAK_BOOK_METADATA.pagesOrLength).toContain('518 Pages');
    expect(DR_CHARAK_BOOK_METADATA.url).toContain('charak-1.pdf');
    expect(DR_CHARAK_BOOK_METADATA.fundamentalAxiomEn).toContain('interplay of three cosmic energies');

    expect(FARFARAWAY_SYNTHESIS_METADATA.title).toContain('Basics of Vedic Astrology');
    expect(FARFARAWAY_SYNTHESIS_METADATA.author).toBe('Far Far Away');
    expect(FARFARAWAY_SYNTHESIS_METADATA.url).toContain('farfaraway.co');
    expect(FARFARAWAY_SYNTHESIS_METADATA.scope).toContain('33 Elemental energies');
  });

  it('contains comprehensive profiles for all 12 Bhavas', () => {
    for (let h = 1; h <= 12; h++) {
      const bhava = getCharakBhava(h);
      expect(bhava).toBeDefined();
      expect(bhava?.house).toBe(h);
      expect(bhava?.sanskritName).toBeTruthy();
      expect(bhava?.englishName).toBeTruthy();
      expect(bhava?.classification).toBeTruthy();
      expect(bhava?.primaryKarakas.length).toBeGreaterThan(0);
      expect(bhava?.bodyPartsEn).toBeTruthy();
      expect(bhava?.bodyPartsHi).toBeTruthy();
      expect(bhava?.modernCareersEn.length).toBeGreaterThan(0);
      expect(bhava?.modernCareersHi.length).toBeGreaterThan(0);
      expect(bhava?.happinessMatrix).toBeDefined();
      expect(bhava?.eventManifestationEn).toBeTruthy();
      expect(bhava?.eventManifestationHi).toBeTruthy();
    }

    // Specific house tests
    const h1 = getCharakBhava(1)!;
    expect(h1.classification).toBe('Kendra & Trikona');
    expect(h1.primaryKarakas).toContain('Sun');

    const h4 = getCharakBhava(4)!;
    expect(h4.classification).toBe('Kendra');
    expect(h4.happinessMatrix.superHappy).toContain('Moon');

    const h7 = getCharakBhava(7)!;
    expect(h7.primaryKarakas).toContain('Venus');
    expect(h7.classification).toContain('Maraka');

    const h9 = getCharakBhava(9)!;
    expect(h9.classification).toBe('Trikona');
    expect(h9.happinessMatrix.superHappy).toContain('Sun');

    const h10 = getCharakBhava(10)!;
    expect(h10.happinessMatrix.superHappy).toContain('Sun');
    expect(h10.happinessMatrix.superHappy).toContain('Mars');
    expect(h10.happinessMatrix.superHappy).toContain('Saturn');
  });

  it('contains comprehensive profiles for all 9 Grahas', () => {
    const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
    for (const p of planets) {
      const graha = getCharakGraha(p);
      expect(graha).toBeDefined();
      expect(graha?.id).toBe(p);
      expect(graha?.nameEn).toBeTruthy();
      expect(graha?.nameHi).toBeTruthy();
      expect(graha?.psychologicalArchetypeEn).toBeTruthy();
      expect(graha?.psychologicalArchetypeHi).toBeTruthy();
      expect(graha?.bodyPartsEn).toBeTruthy();
      expect(graha?.modernProfessionsEn.length).toBeGreaterThan(0);
      expect(graha?.modernProfessionsHi.length).toBeGreaterThan(0);
      expect(graha?.maturationAge).toBeGreaterThan(0);
    }

    // Specific planetary tests
    const mars = getCharakGraha('Mars')!;
    expect(mars.maturationAge).toBe(28);
    expect(mars.combustionDegrees).toBe(17);
    expect(mars.tridosha).toBe('Pitta');

    const mercury = getCharakGraha('Mercury')!;
    expect(mercury.maturationAge).toBe(32);
    expect(mercury.combustionDegrees).toBe(14);
    expect(mercury.tridosha).toBe('Tridosha');

    const saturn = getCharakGraha('Saturn')!;
    expect(saturn.maturationAge).toBe(36);
    expect(saturn.combustionDegrees).toBe(15);
    expect(saturn.tridosha).toBe('Vata');

    const jupiter = getCharakGraha('Jupiter')!;
    expect(jupiter.maturationAge).toBe(16);
    expect(jupiter.combustionDegrees).toBe(11);
    expect(jupiter.tridosha).toBe('Kapha');
  });

  it('contains classical Gochara Vedha rules and transit doctrines', () => {
    const sunVedha = CHARAK_GOCHARA_VEDHA_RULES.Sun;
    expect(sunVedha.favorableHousesFromMoon).toEqual([3, 6, 10, 11]);
    expect(sunVedha.vedhaHouses[3]).toBe(9);
    expect(sunVedha.vedhaHouses[6]).toBe(12);
    expect(sunVedha.vedhaHouses[10]).toBe(4);
    expect(sunVedha.vedhaHouses[11]).toBe(5);

    const jupiterVedha = CHARAK_GOCHARA_VEDHA_RULES.Jupiter;
    expect(jupiterVedha.favorableHousesFromMoon).toEqual([2, 5, 7, 9, 11]);
    expect(jupiterVedha.vedhaHouses[2]).toBe(12);
    expect(jupiterVedha.vedhaHouses[5]).toBe(4);
    expect(jupiterVedha.vedhaHouses[7]).toBe(3);

    expect(CHARAK_DOUBLE_TRANSIT_DOCTRINE.titleEn).toContain('Double Transit');
    expect(CHARAK_DOUBLE_TRANSIT_DOCTRINE.titleHi).toContain('गुरु-शनि');
    expect(CHARAK_DOUBLE_TRANSIT_DOCTRINE.summaryHi).toContain('शनि और गुरु');

    expect(CHARAK_SUDARSHANA_CHAKRA_DOCTRINE.titleEn).toContain('Sudarshana Chakra');
    expect(CHARAK_SUDARSHANA_CHAKRA_DOCTRINE.titleHi).toContain('सुदर्शन चक्र');
    expect(CHARAK_SUDARSHANA_CHAKRA_DOCTRINE.summaryHi).toContain('तीन प्रमुख बिंदुओं');
  });
});
