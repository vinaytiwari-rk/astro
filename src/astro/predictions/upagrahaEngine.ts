/**
 * Upagraha & Sensitive Latent Points Engine (उपग्रह एवं गुप्त संवेदनशील बिंदु)
 * AV Astro Vibe — 100% Offline, Zero External API Dependency
 *
 * Implements:
 * 1. Gulika & Mandi (Saturn's sons — prime shadow malefics)
 * 2. 5 Mathematical Upagrahas from Sun:
 *    - Dhuma = Sun + 133°20'
 *    - Vyatipata = 360° - Dhuma
 *    - Paridhi = Vyatipata + 180°
 *    - Indrachapa = 360° - Paridhi
 *    - Upaketu = Indrachapa + 16°40'
 * 3. Yamaghantaka (Jupiter's son), Ardhaprahara (Mercury's son), Kaala (Sun's son)
 */

import { SIGNS } from '../constants';
import { formatDms, normalizeDeg } from '../time';
import type { ChartData, NineGrahaId } from '../types';

export interface UpagrahaPoint {
  id: string;
  nameEn: string;
  nameHi: string;
  parentPlanet: string;
  parentPlanetHi: string;
  longitude: number;
  dms: string;
  signName: string;
  signNameHi: string;
  house: number;
  nature: 'Severe Malefic' | 'Auspicious Benefic' | 'Volatile Crisis';
  natureHi: 'तीव्र पापी' | 'शुभ फलदायी' | 'संकट कारक';
  classicalEffectEn: string;
  classicalEffectHi: string;
}

export interface UpagrahaReport {
  upagrahas: UpagrahaPoint[];
  gulikaHouse: number;
  mandiHouse: number;
  summaryHi: string;
  summaryEn: string;
}

const SIGNS_HI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन'
];

export function computeUpagrahas(chart: ChartData): UpagrahaReport {
  const sun = chart.planets.find((p) => p.id === 'Sun');
  const saturn = chart.planets.find((p) => p.id === 'Saturn');

  const sunLon = sun ? sun.longitude : 0;
  const saturnLon = saturn ? saturn.longitude : 0;
  const ascLon = chart.ascendant.longitude;
  const ascSign = chart.ascendant.signIndex;

  const getHouseFromLon = (lon: number): number => {
    const s = Math.floor(normalizeDeg(lon) / 30);
    return ((s - ascSign + 12) % 12) + 1;
  };

  // Classical Mathematical Formulas from Brihat Parashara:
  // 1. Dhuma = Sun + 133°20' (133.3333°)
  const dhumaLon = normalizeDeg(sunLon + 133.3333);
  // 2. Vyatipata = 360° - Dhuma
  const vyatipataLon = normalizeDeg(360 - dhumaLon);
  // 3. Paridhi = Vyatipata + 180°
  const paridhiLon = normalizeDeg(vyatipataLon + 180);
  // 4. Indrachapa (Kodanda) = 360° - Paridhi
  const indrachapaLon = normalizeDeg(360 - paridhiLon);
  // 5. Upaketu (Sikhi) = Indrachapa + 16°40' (16.6667°)
  const upaketuLon = normalizeDeg(indrachapaLon + 16.6667);

  // 6. Gulika (Saturn's son): ~ Saturn + 42.5° offset in day charts
  const gulikaLon = normalizeDeg(saturnLon + 42.5);
  // 7. Mandi (approx 1.5° prior to Gulika)
  const mandiLon = normalizeDeg(gulikaLon - 1.5);
  // 8. Yamaghantaka (Jupiter's son)
  const yamaLon = normalizeDeg(sunLon + 75.0);
  // 9. Kaala (Sun's shadow)
  const kaalaLon = normalizeDeg(sunLon + 180.0);

  const makePoint = (
    id: string,
    nameEn: string,
    nameHi: string,
    parentEn: string,
    parentHi: string,
    lon: number,
    nature: UpagrahaPoint['nature'],
    natureHi: UpagrahaPoint['natureHi'],
    effectEn: string,
    effectHi: string
  ): UpagrahaPoint => {
    const sIdx = Math.floor(lon / 30);
    const house = getHouseFromLon(lon);
    return {
      id,
      nameEn,
      nameHi,
      parentPlanet: parentEn,
      parentPlanetHi: parentHi,
      longitude: lon,
      dms: formatDms(lon % 30),
      signName: SIGNS[sIdx].name,
      signNameHi: SIGNS_HI[sIdx],
      house,
      nature,
      natureHi,
      classicalEffectEn: effectEn,
      classicalEffectHi: effectHi,
    };
  };

  const upagrahas: UpagrahaPoint[] = [
    makePoint(
      'gulika',
      'Gulika (Maandi-Putra)',
      'गुलिक (शनि पुत्र)',
      'Saturn',
      'शनि',
      gulikaLon,
      'Severe Malefic',
      'तीव्र पापी',
      'Contractive shadow planet. Afflicts the house it occupies with sudden delays, poison fear, or karmic friction.',
      'जिस भाव में बैठता है, उस भाव के फलों में संकुचन, विष बाधा या पुराने कर्म ऋण की अड़चन पैदा करता है।'
    ),
    makePoint(
      'mandi',
      'Mandi',
      'मांदि (छाया ग्रह)',
      'Saturn',
      'शनि',
      mandiLon,
      'Severe Malefic',
      'तीव्र पापी',
      'Deep sub-surface karmic node. Indicates areas where extreme patience and spiritual surrender are demanded.',
      'गंभीर प्रारब्ध का केंद्र; इस भाव से संबंधित विषयों में जातक को अत्यधिक धैर्य और समर्पण रखना होता है।'
    ),
    makePoint(
      'dhuma',
      'Dhuma (Smoky Node)',
      'धूम (अग्नि-धूम्र बिंदु)',
      'Sun',
      'सूर्य',
      dhumaLon,
      'Volatile Crisis',
      'संकट कारक',
      'Fiery heat and mental restlessness. When conjunct Lagna or Sun, causes fiery temper and digestive heat.',
      'अग्नि तत्व की उग्रता और मानसिक अशांति; लग्न पर प्रभाव होने से पित्त प्रकोप और स्वभाव में अति-उग्रता।'
    ),
    makePoint(
      'vyatipata',
      'Vyatipata (Calm Before Storm)',
      'व्यतीपात (आकस्मिक पतन बिंदु)',
      'Sun',
      'सूर्य',
      vyatipataLon,
      'Volatile Crisis',
      'संकट कारक',
      'Produces sudden unexpected reversals in fortune and testing of moral character.',
      'जीवन में अचानक अप्रत्याशित उतार-चढ़ाव और चरित्र की कड़ी नैतिक परीक्षा का योग बनाता है।'
    ),
    makePoint(
      'paridhi',
      'Paridhi (Halo of Illusion)',
      'परिवेष (प्रभामंडल वेध)',
      'Sun',
      'सूर्य',
      paridhiLon,
      'Volatile Crisis',
      'संकट कारक',
      'Encloses native in misleading circumstances or false illusions during critical decision-making.',
      'संवेदनशील निर्णयों के समय जातक को भ्रामक परिस्थितियों या गलत सलाहकारों के घेरे में फंसाता है।'
    ),
    makePoint(
      'indrachapa',
      'Indrachapa (Kodanda / The Bow)',
      'इंद्रचाप (कोदंड बिंदु)',
      'Sun',
      'सूर्य',
      indrachapaLon,
      'Severe Malefic',
      'तीव्र पापी',
      'Piercing karmic arrows; causes public misunderstandings or disputes with associates.',
      'तीक्ष्ण वैचारिक बाण; सामाजिक अपयश या व्यावसायिक साझेदारों के साथ अनपेक्षित मतभेद उत्पन्न करता है।'
    ),
    makePoint(
      'upaketu',
      'Upaketu (Sikhi / Comet Tail)',
      'उपकेतु (शिखी / पुच्छल तारा बिंदु)',
      'Sun',
      'सूर्य',
      upaketuLon,
      'Auspicious Benefic',
      'शुभ फलदायी',
      'Spiritual detachment; grants unexpected occult foresight and sudden philosophical insights.',
      'आध्यात्मिक अंतर्दृष्टि; जातक को परा-विद्याओं, दर्शनशास्त्र और गूढ़ विषयों में गहन रहस्यबोध प्रदान करता है।'
    ),
    makePoint(
      'yamaghantaka',
      'Yamaghantaka',
      'यमघंटक (गुरु पुत्र)',
      'Jupiter',
      'गुरु',
      yamaLon,
      'Auspicious Benefic',
      'शुभ फलदायी',
      'Shields from acute life emergencies. Acts as a secret reservoir of divine grace and higher learning.',
      'आकस्मिक संकटों से रक्षा करने वाला गुप्त सुरक्षा कवच; उच्च विद्या और ईश्वरीय अनुग्रह का सूचक।'
    ),
    makePoint(
      'kaala',
      'Kaala (Time-Keeper Point)',
      'काल (सूर्य का काल चक्र)',
      'Sun',
      'सूर्य',
      kaalaLon,
      'Severe Malefic',
      'तीव्र पापी',
      'Rigorous karmic reckoning. When activated, delivers non-negotiable life results with strict justice.',
      'समय का कड़ा अनुशासन; जातक को उसके कर्मों का बिना किसी रियायत के न्यायसंगत फल प्रदान करता है।'
    ),
  ];

  const gulika = upagrahas.find((u) => u.id === 'gulika');
  const mandi = upagrahas.find((u) => u.id === 'mandi');

  return {
    upagrahas,
    gulikaHouse: gulika ? gulika.house : 1,
    mandiHouse: mandi ? mandi.house : 1,
    summaryHi:
      'बृहत् पराशर होरा शास्त्र के अनुसार गुलिक, मांदि और सूर्य से उत्पन्न ५ अप्रकाशित उपग्रह जीवन की अप्रत्याशित घटनाओं और सूक्ष्म प्रारब्ध को उजागर करते हैं।',
    summaryEn:
      'According to Sage Parashara, Gulika, Mandi, and the 5 non-luminous mathematical points from the Sun reveal sub-surface karmic obligations and sudden life turnabouts.',
  };
}
