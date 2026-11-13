import { computeAscendantAndMcTropical, computeHouses, findHouseForLongitude } from './ephemeris';
import type { ChartData, PlanetId } from './types';

export interface WesternSignInfo {
  index: number; // 0..11
  nameEn: string;
  nameHi: string;
  symbol: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  modality: 'Cardinal' | 'Fixed' | 'Mutable';
  rulingPlanet: string;
}

export const WESTERN_SIGNS: WesternSignInfo[] = [
  { index: 0, nameEn: 'Aries', nameHi: 'मेष', symbol: '♈', element: 'Fire', modality: 'Cardinal', rulingPlanet: 'Mars' },
  { index: 1, nameEn: 'Taurus', nameHi: 'वृषभ', symbol: '♉', element: 'Earth', modality: 'Fixed', rulingPlanet: 'Venus' },
  { index: 2, nameEn: 'Gemini', nameHi: 'मिथुन', symbol: '♊', element: 'Air', modality: 'Mutable', rulingPlanet: 'Mercury' },
  { index: 3, nameEn: 'Cancer', nameHi: 'कर्क', symbol: '♋', element: 'Water', modality: 'Cardinal', rulingPlanet: 'Moon' },
  { index: 4, nameEn: 'Leo', nameHi: 'सिंह', symbol: '♌', element: 'Fire', modality: 'Fixed', rulingPlanet: 'Sun' },
  { index: 5, nameEn: 'Virgo', nameHi: 'कन्या', symbol: '♍', element: 'Earth', modality: 'Mutable', rulingPlanet: 'Mercury' },
  { index: 6, nameEn: 'Libra', nameHi: 'तुला', symbol: '♎', element: 'Air', modality: 'Cardinal', rulingPlanet: 'Venus' },
  { index: 7, nameEn: 'Scorpio', nameHi: 'वृश्चिक', symbol: '♏', element: 'Water', modality: 'Fixed', rulingPlanet: 'Pluto / Mars' },
  { index: 8, nameEn: 'Sagittarius', nameHi: 'धनु', symbol: '♐', element: 'Fire', modality: 'Mutable', rulingPlanet: 'Jupiter' },
  { index: 9, nameEn: 'Capricorn', nameHi: 'मकर', symbol: '♑', element: 'Earth', modality: 'Cardinal', rulingPlanet: 'Saturn' },
  { index: 10, nameEn: 'Aquarius', nameHi: 'कुंभ', symbol: '♒', element: 'Air', modality: 'Fixed', rulingPlanet: 'Uranus / Saturn' },
  { index: 11, nameEn: 'Pisces', nameHi: 'मीन', symbol: '♓', element: 'Water', modality: 'Mutable', rulingPlanet: 'Neptune / Jupiter' },
];

export const WESTERN_PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☉',
  Moon: '☽',
  Mercury: '☿',
  Venus: '♀',
  Mars: '♂',
  Jupiter: '♃',
  Saturn: '♄',
  Uranus: '♅',
  Neptune: '♆',
  Pluto: '♇',
  Rahu: '☊',
  Ketu: '☋',
  Asc: 'AC',
  MC: 'MC',
};

export type AspectType =
  | 'Conjunction'
  | 'Sextile'
  | 'Square'
  | 'Trine'
  | 'Opposition'
  | 'Quincunx'
  | 'Semi-Sextile';

export interface WesternAspectDef {
  type: AspectType;
  angle: number;
  maxOrb: number;
  nature: 'Harmonious' | 'Challenging' | 'Dynamic' | 'Neutral';
  color: string;
  symbol: string;
  meaningEn: string;
  meaningHi: string;
}

export const ASPECT_DEFINITIONS: Record<AspectType, WesternAspectDef> = {
  Conjunction: {
    type: 'Conjunction',
    angle: 0,
    maxOrb: 8.5,
    nature: 'Dynamic',
    color: '#0284c7', // Sky blue
    symbol: '☌',
    meaningEn: 'Fusing of planetary energies, powerful focal point of intensity.',
    meaningHi: 'ऊर्जाओं का तीव्र संयोजन, अत्यधिक प्रबल केंद्र बिंदु।',
  },
  Sextile: {
    type: 'Sextile',
    angle: 60,
    maxOrb: 6.0,
    nature: 'Harmonious',
    color: '#16a34a', // Green
    symbol: '⚹',
    meaningEn: 'Opportunities, creative talents, smooth flow that invites action.',
    meaningHi: 'अवसर, रचनात्मक प्रतिभा और सहज अनुकूलता।',
  },
  Square: {
    type: 'Square',
    angle: 90,
    maxOrb: 7.5,
    nature: 'Challenging',
    color: '#dc2626', // Red
    symbol: '□',
    meaningEn: 'Dynamic friction, obstacles that forge character and driving ambition.',
    meaningHi: 'आंतरिक संघर्ष, चुनौतियाँ जो संघर्ष और उन्नति को प्रेरित करती हैं।',
  },
  Trine: {
    type: 'Trine',
    angle: 120,
    maxOrb: 8.0,
    nature: 'Harmonious',
    color: '#2563eb', // Royal Blue
    symbol: '△',
    meaningEn: 'Natural gifts, effortless harmony, fortune, and peaceful integration.',
    meaningHi: 'प्राकृतिक प्रतिभा, सहज सामंजस्य, सौभाग्य और मानसिक शांति।',
  },
  Opposition: {
    type: 'Opposition',
    angle: 180,
    maxOrb: 8.5,
    nature: 'Challenging',
    color: '#d97706', // Amber/Orange
    symbol: '☍',
    meaningEn: 'Polarity, external relationship mirrors, balancing opposing needs.',
    meaningHi: 'द्वंद्व, संबंधों में ध्रुवीकरण और विरोधी पक्षों में संतुलन की आवश्यकता।',
  },
  Quincunx: {
    type: 'Quincunx',
    angle: 150,
    maxOrb: 3.0,
    nature: 'Challenging',
    color: '#9333ea', // Purple
    symbol: '⚻',
    meaningEn: 'Subtle adjustments needed, awkward blindspots requiring conscious refinement.',
    meaningHi: 'अप्रत्यक्ष तालमेल की आवश्यकता, सुधार के लिए निरंतर सजगता।',
  },
  'Semi-Sextile': {
    type: 'Semi-Sextile',
    angle: 30,
    maxOrb: 2.0,
    nature: 'Neutral',
    color: '#64748b', // Slate
    symbol: '⚺',
    meaningEn: 'Growth through small, incremental steps and patience.',
    meaningHi: 'धैर्य और क्रमिक प्रयासों से उन्नति का मार्ग।',
  },
};

export interface WesternPlanetPlacement {
  id: PlanetId | 'Asc' | 'MC';
  nameEn: string;
  nameHi: string;
  symbol: string;
  tropicalLon: number; // 0..360
  signIndex: number; // 0..11
  signNameEn: string;
  signNameHi: string;
  degreeInSign: number; // 0..30
  dms: string;
  house: number; // 1..12
  isRetrograde: boolean;
  speed: number;
}

export interface DetectedWesternAspect {
  planet1: string;
  planet2: string;
  symbol1: string;
  symbol2: string;
  aspect: AspectType;
  exactAngle: number;
  actualAngle: number;
  orb: number;
  isApplying: boolean;
  definition: WesternAspectDef;
  interpretationEn: string;
  interpretationHi: string;
}

export interface WesternAstrologyReport {
  ascendant: WesternPlanetPlacement;
  midheaven: WesternPlanetPlacement;
  sunPlacement: WesternPlanetPlacement;
  moonPlacement: WesternPlanetPlacement;
  planets: WesternPlanetPlacement[];
  aspects: DetectedWesternAspect[];
  elementBalance: Record<'Fire' | 'Earth' | 'Air' | 'Water', number>;
  modalityBalance: Record<'Cardinal' | 'Fixed' | 'Mutable', number>;
  siderealVsTropicalComparison: Array<{
    body: string;
    siderealDeg: string;
    siderealSign: string;
    tropicalDeg: string;
    tropicalSign: string;
    differenceAyanamsa: string;
  }>;
  bigThreeSummaryEn: string;
  bigThreeSummaryHi: string;
}

function normalizeDeg(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

function formatDms(deg: number): string {
  const d = Math.floor(deg);
  const rem = (deg - d) * 60;
  const m = Math.floor(rem);
  const s = Math.round((rem - m) * 60);
  return `${d}°${String(m).padStart(2, '0')}'${String(s).padStart(2, '0')}"`;
}

export function computeWesternAstrologyReport(chart: ChartData): WesternAstrologyReport {
  // Ascendant and MC from chart
  const tropAsc = chart.ascendant.tropicalLongitude ?? normalizeDeg(chart.ascendant.longitude + chart.ayanamsaDeg);
  const ascSignIdx = Math.floor(tropAsc / 30);
  const ascDegInSign = tropAsc - ascSignIdx * 30;

  // Midheaven (MC)
  const tropMc = normalizeDeg(tropAsc + 90); // Approximate MC fallback if ephemeris not standalone
  const mcSignIdx = Math.floor(tropMc / 30);
  const mcDegInSign = tropMc - mcSignIdx * 30;

  const ascPlacement: WesternPlanetPlacement = {
    id: 'Asc',
    nameEn: 'Ascendant (Rising)',
    nameHi: 'लग्न (Rising)',
    symbol: 'AC',
    tropicalLon: tropAsc,
    signIndex: ascSignIdx,
    signNameEn: WESTERN_SIGNS[ascSignIdx].nameEn,
    signNameHi: WESTERN_SIGNS[ascSignIdx].nameHi,
    degreeInSign: ascDegInSign,
    dms: formatDms(ascDegInSign),
    house: 1,
    isRetrograde: false,
    speed: 0,
  };

  const mcPlacement: WesternPlanetPlacement = {
    id: 'MC',
    nameEn: 'Midheaven (MC)',
    nameHi: 'दशम भाव मध्य (MC)',
    symbol: 'MC',
    tropicalLon: tropMc,
    signIndex: mcSignIdx,
    signNameEn: WESTERN_SIGNS[mcSignIdx].nameEn,
    signNameHi: WESTERN_SIGNS[mcSignIdx].nameHi,
    degreeInSign: mcDegInSign,
    dms: formatDms(mcDegInSign),
    house: 10,
    isRetrograde: false,
    speed: 0,
  };

  const planetPlacements: WesternPlanetPlacement[] = chart.planets.map((p) => {
    const tropLon = p.tropicalLongitude ?? normalizeDeg(p.longitude + chart.ayanamsaDeg);
    const signIdx = Math.floor(tropLon / 30);
    const degInSign = tropLon - signIdx * 30;
    return {
      id: p.id,
      nameEn: p.id,
      nameHi: p.id,
      symbol: WESTERN_PLANET_SYMBOLS[p.id] || p.id.slice(0, 2),
      tropicalLon: tropLon,
      signIndex: signIdx,
      signNameEn: WESTERN_SIGNS[signIdx].nameEn,
      signNameHi: WESTERN_SIGNS[signIdx].nameHi,
      degreeInSign: degInSign,
      dms: formatDms(degInSign),
      house: p.houseNumber,
      isRetrograde: p.isRetrograde,
      speed: p.speedDegPerDay,
    };
  });

  const sunPlacement = planetPlacements.find((p) => p.id === 'Sun') || planetPlacements[0];
  const moonPlacement = planetPlacements.find((p) => p.id === 'Moon') || planetPlacements[1];

  // Element and modality balance
  const elementBalance: Record<'Fire' | 'Earth' | 'Air' | 'Water', number> = {
    Fire: 0,
    Earth: 0,
    Air: 0,
    Water: 0,
  };

  const modalityBalance: Record<'Cardinal' | 'Fixed' | 'Mutable', number> = {
    Cardinal: 0,
    Fixed: 0,
    Mutable: 0,
  };

  for (const pl of planetPlacements) {
    if (pl.id === 'Rahu' || pl.id === 'Ketu') continue;
    const sign = WESTERN_SIGNS[pl.signIndex];
    if (sign) {
      elementBalance[sign.element] = (elementBalance[sign.element] || 0) + 1;
      modalityBalance[sign.modality] = (modalityBalance[sign.modality] || 0) + 1;
    }
  }

  // Detect Western Aspects between all planets
  const aspects: DetectedWesternAspect[] = [];
  const aspectDefs = Object.values(ASPECT_DEFINITIONS);
  const eligibleBodies = [...planetPlacements, ascPlacement];

  for (let i = 0; i < eligibleBodies.length; i++) {
    for (let j = i + 1; j < eligibleBodies.length; j++) {
      const b1 = eligibleBodies[i];
      const b2 = eligibleBodies[j];
      if (b1.id === 'Rahu' || b1.id === 'Ketu' || b2.id === 'Rahu' || b2.id === 'Ketu') continue;

      let diff = Math.abs(b1.tropicalLon - b2.tropicalLon);
      if (diff > 180) diff = 360 - diff;

      for (const def of aspectDefs) {
        const orb = Math.abs(diff - def.angle);
        if (orb <= def.maxOrb) {
          const isApplying = b1.speed > b2.speed ? b1.tropicalLon < b2.tropicalLon : b2.tropicalLon < b1.tropicalLon;

          const interpEn = `${b1.nameEn} ${def.type.toLowerCase()} ${b2.nameEn} (orb ${orb.toFixed(1)}°): ${def.meaningEn}`;
          const interpHi = `${b1.nameHi} और ${b2.nameHi} के मध्य ${def.type} योग (अंश अंतर ${orb.toFixed(1)}°): ${def.meaningHi}`;

          aspects.push({
            planet1: b1.id,
            planet2: b2.id,
            symbol1: b1.symbol,
            symbol2: b2.symbol,
            aspect: def.type,
            exactAngle: def.angle,
            actualAngle: diff,
            orb: parseFloat(orb.toFixed(2)),
            isApplying,
            definition: def,
            interpretationEn: interpEn,
            interpretationHi: interpHi,
          });
          break; // One aspect per pair
        }
      }
    }
  }

  // Sidereal vs Tropical comparison
  const siderealVsTropicalComparison = chart.planets.map((sp) => {
    const trop = planetPlacements.find((tp) => tp.id === sp.id);
    return {
      body: sp.id,
      siderealDeg: sp.shortDms,
      siderealSign: sp.signName,
      tropicalDeg: trop ? trop.dms : '',
      tropicalSign: trop ? trop.signNameEn : '',
      differenceAyanamsa: `${chart.ayanamsaDeg.toFixed(2)}° (${chart.settings.ayanamsa})`,
    };
  });

  const bigThreeSummaryEn = `In Western Astrology, your Sun Sign is ${sunPlacement.signNameEn} (core identity, willpower), Moon Sign is ${moonPlacement.signNameEn} (emotional inner nature, instinct), and Rising Sign (Ascendant) is ${ascPlacement.signNameEn} (outer persona, physical mask). In contrast, Vedic Astrology places primary focus on your Moon in ${chart.planets.find((p) => p.id === 'Moon')?.signName || ''} and Ascendant in ${chart.ascendant.signName}.`;

  const bigThreeSummaryHi = `पाश्चात्य (Western) ज्योतिष के अनुसार, आपकी सूर्य राशि ${sunPlacement.signNameHi} (आत्म-चेतना व संकल्प शक्ति), चंद्र राशि ${moonPlacement.signNameHi} (भावनात्मक स्वभाव व अंतर्मन), और लग्न (Rising) ${ascPlacement.signNameHi} (बाहरी व्यक्तित्व) है। इसके विपरीत, वैदिक ज्योतिष आपके सिडेरियल चंद्र (${chart.planets.find((p) => p.id === 'Moon')?.signName || ''}) व लग्न (${chart.ascendant.signName}) को सर्वोच्च प्राथमिकता देता है।`;

  return {
    ascendant: ascPlacement,
    midheaven: mcPlacement,
    sunPlacement,
    moonPlacement,
    planets: planetPlacements,
    aspects,
    elementBalance,
    modalityBalance,
    siderealVsTropicalComparison,
    bigThreeSummaryEn,
    bigThreeSummaryHi,
  };
}
