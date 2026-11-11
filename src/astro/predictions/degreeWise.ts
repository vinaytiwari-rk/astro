import { EXALTATION_DEG, NINE_GRAHAS, SIGNS } from '../constants';
import { angularDiffDeg } from '../time';
import type { BodyPosition, ChartData } from '../types';
import type { PredictionBodyId } from './planetInSign';

export interface DegreePredictionItem {
  planet: PredictionBodyId;
  signIndex: number;
  signNameEn: string;
  signNameHi: string;
  degreeInSign: number;
  dms: string;
  avasthaEn: string;
  avasthaHi: string;
  strengthPercent: number;
  drekkanaNum: 1 | 2 | 3;
  drekkanaLabelEn: string;
  drekkanaLabelHi: string;
  isPushkaraNavamsha: boolean;
  isPushkaraBhaga: boolean;
  isGandanta: boolean;
  isRashiSandhi: boolean;
  specialDegTagEn: string | null;
  specialDegTagHi: string | null;
  sunDistanceDeg: number | null;
  readingEn: string;
  readingHi: string;
  source: string;
}

const SIGN_HI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
];

const PLANET_HI: Record<PredictionBodyId, string> = {
  Asc: 'लग्न', Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध',
  Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
};

// Exact Classical Pushkara Bhaga degrees for Aries(0)..Pisces(11)
const PUSHKARA_BHAGA_DEG = [21, 14, 18, 8, 19, 9, 24, 11, 23, 14, 19, 9];

// Pushkara Navamsha padas (0-based 0..8 inside a sign) by element
function isPushkaraNavamshaDeg(signIndex: number, deg: number): boolean {
  const navIdx = Math.min(8, Math.floor(deg / (30 / 9)));
  const mod4 = signIndex % 4;
  if (mod4 === 0) return navIdx === 6 || navIdx === 8; // Fire: 7th (Libra) & 9th (Sag)
  if (mod4 === 1) return navIdx === 2 || navIdx === 4; // Earth: 3rd (Pisces) & 5th (Taurus)
  if (mod4 === 2) return navIdx === 5 || navIdx === 7; // Air: 6th (Pisces) & 8th (Taurus)
  return navIdx === 0 || navIdx === 2;                 // Water: 1st (Cancer) & 3rd (Virgo)
}

function isGandantaDeg(signIndex: number, deg: number): boolean {
  // Water->Fire junctions: Pi/Ar (11->0), Cn/Le (3->4), Sc/Sg (7->8) within 3°20'
  if ([3, 7, 11].includes(signIndex) && deg >= 26.6667) return true;
  if ([0, 4, 8].includes(signIndex) && deg <= 3.3333) return true;
  return false;
}

function getBaladiByDegree(signIndex: number, deg: number): {
  avasthaEn: string;
  avasthaHi: string;
  pct: number;
  toneEn: string;
  toneHi: string;
} {
  const isOdd = signIndex % 2 === 0;
  const seg = Math.min(4, Math.floor(deg / 6)); // 0..4 (0-6, 6-12, 12-18, 18-24, 24-30)
  const effectiveIdx = isOdd ? seg : 4 - seg;

  if (effectiveIdx === 0) {
    return {
      avasthaEn: 'Bala (Infant State)',
      avasthaHi: 'बाल अवस्था (आरंभिक)',
      pct: 25,
      toneEn: 'emerging, fresh ~25% worldly manifestation; needs gentle encouragement and early patience',
      toneHi: 'लगभग 25% आरंभिक फल — गुण धीरे-धीरे विकसित व परिपक्व होते हैं',
    };
  }
  if (effectiveIdx === 1) {
    return {
      avasthaEn: 'Kumara (Adolescent State)',
      avasthaHi: 'कुमार अवस्था (विकासशील)',
      pct: 55,
      toneEn: 'curious, spirited ~55% strength; eager to learn, test abilities, and build momentum',
      toneHi: 'लगभग 55% शक्ति — सीखने की ऊर्जा, उत्साह और निरंतर प्रगति',
    };
  }
  if (effectiveIdx === 2) {
    return {
      avasthaEn: 'Yuva (Mature Peak State)',
      avasthaHi: 'युवा अवस्था (पूर्ण बली 100%)',
      pct: 100,
      toneEn: 'peak 100% planetary capacity — decisive, mature, capable of delivering its full classical promise',
      toneHi: 'सर्वोच्च 100% पूर्ण फलदायी शक्ति — ग्रह अपने संपूर्ण शुभ या कर्मिक फल स्पष्ट रूप से देता है',
    };
  }
  if (effectiveIdx === 3) {
    return {
      avasthaEn: 'Vriddha (Elder State)',
      avasthaHi: 'वृद्ध अवस्था (अंतर्मुखी)',
      pct: 20,
      toneEn: 'restrained ~20% external drive; works subtly through hindsight, detachment and advisory counsel',
      toneHi: 'लगभग 20% बाह्य सक्रियता — अनुभव, वैराग्य व परामर्श के रूप में सूक्ष्म फल',
    };
  }
  return {
    avasthaEn: 'Mrita (Dormant Edge State)',
    avasthaHi: 'मृत अवस्था (निष्क्रिय अंश)',
    pct: 10,
    toneEn: 'very mild ~10% direct push unless strengthened by Vargottama, aspect, or Pushkara degree',
    toneHi: 'लगभग 10% मंद बल — जब तक वर्गोत्तम या शुभ दृष्टि न हो, फल हेतु अतिरिक्त प्रयास व उपाय उपयोगी रहते हैं',
  };
}

export function analyzeBodyDegree(
  planet: PredictionBodyId,
  signIndex: number,
  degInSign: number,
  dms: string,
  longitude: number,
  sunLon?: number,
  isCombust = false
): DegreePredictionItem {
  const sInfo = SIGNS[signIndex];
  const sHi = SIGN_HI[signIndex];
  const bal = getBaladiByDegree(signIndex, degInSign);
  const drekNum: 1 | 2 | 3 = degInSign < 10 ? 1 : degInSign < 20 ? 2 : 3;
  const drekLordIdx = (signIndex + (drekNum - 1) * 4) % 12;
  const drekLord = SIGNS[drekLordIdx].lord;
  const drekkanaLabelEn = `Drekkana ${drekNum} (${drekNum === 1 ? '0–10°' : drekNum === 2 ? '10–20°' : '20–30°'}, ${drekLord})`;
  const drekkanaLabelHi = `${drekNum === 1 ? 'प्रथम (0–10°)' : drekNum === 2 ? 'द्वितीय (10–20°)' : 'तृतीय (20–30°)'} द्रेष्काण`;

  const pNav = isPushkaraNavamshaDeg(signIndex, degInSign);
  const pBhaga = Math.abs(degInSign - PUSHKARA_BHAGA_DEG[signIndex]) <= 1.05;
  const gandanta = isGandantaDeg(signIndex, degInSign);
  const sandhi = degInSign < 1.0 || degInSign > 29.0;

  // Check peak exaltation / debilitation proximity
  let specialDegTagEn: string | null = null;
  let specialDegTagHi: string | null = null;
  const exLon = planet !== 'Asc' ? EXALTATION_DEG[planet] : undefined;
  if (exLon !== undefined) {
    const distEx = angularDiffDeg(longitude, exLon);
    const debLon = (exLon + 180) % 360;
    const distDeb = angularDiffDeg(longitude, debLon);
    if (distEx <= 3.0) {
      specialDegTagEn = `Near Paramochcha (Peak Exaltation at ${(exLon % 30).toFixed(0)}°)`;
      specialDegTagHi = `परमोच्च अंश के निकट (${(exLon % 30).toFixed(0)}°)`;
    } else if (distDeb <= 3.0) {
      specialDegTagEn = `Near Paramanicha (Deep Debilitation at ${(debLon % 30).toFixed(0)}°)`;
      specialDegTagHi = `परमनीच अंश के निकट (${(debLon % 30).toFixed(0)}°)`;
    }
  }

  if (pBhaga) {
    specialDegTagEn = (specialDegTagEn ? `${specialDegTagEn} · ` : '') + `Pushkara Bhaga (${PUSHKARA_BHAGA_DEG[signIndex]}° Auspicious!)`;
    specialDegTagHi = (specialDegTagHi ? `${specialDegTagHi} · ` : '') + `पुष्कर भाग (${PUSHKARA_BHAGA_DEG[signIndex]}° अति शुभ!)`;
  } else if (pNav) {
    specialDegTagEn = (specialDegTagEn ? `${specialDegTagEn} · ` : '') + 'Pushkara Navamsha (Nourishing Degree)';
    specialDegTagHi = (specialDegTagHi ? `${specialDegTagHi} · ` : '') + 'पुष्कर नवांश (पोषक व शुभ अंश)';
  }

  if (gandanta) {
    specialDegTagEn = (specialDegTagEn ? `${specialDegTagEn} · ` : '') + 'Gandanta Cusp (Sensitive Karma)';
    specialDegTagHi = (specialDegTagHi ? `${specialDegTagHi} · ` : '') + 'गंडांत अंश (अति संवेदनशील संधि)';
  } else if (sandhi) {
    specialDegTagEn = (specialDegTagEn ? `${specialDegTagEn} · ` : '') + 'Rashi Sandhi (0°–1° / 29°–30° Cusp)';
    specialDegTagHi = (specialDegTagHi ? `${specialDegTagHi} · ` : '') + 'राशि संधि (अंश परिवर्तन बिंदु)';
  }

  const sunDistanceDeg =
    sunLon !== undefined && planet !== 'Sun' && planet !== 'Asc' && planet !== 'Rahu' && planet !== 'Ketu'
      ? Math.round(angularDiffDeg(longitude, sunLon) * 100) / 100
      : null;

  const extraFlagsEn: string[] = [];
  const extraFlagsHi: string[] = [];
  if (pBhaga || pNav) {
    extraFlagsEn.push('Placed in Pushkara dignity — enhances fortune, recovery and benevolent protection.');
    extraFlagsHi.push('पुष्कर अंश/नवांश में होने से यह ग्रह कठिनाइयों से रक्षा कर शुभ फल में वृद्धि करता है।');
  }
  if (gandanta) {
    extraFlagsEn.push('At Water–Fire Gandanta junction — sharp karmic transition; grounding mantra/charity stabilizes volatility.');
    extraFlagsHi.push('जल-अग्नि के गंडांत अंश पर स्थित — मानसिक स्थिरता व शांति हेतु जप-दान अत्यंत लाभकारी है।');
  } else if (sandhi) {
    extraFlagsEn.push('Located in Rashi-Sandhi (border degree) — expresses qualities of both neighboring signs subtly.');
    extraFlagsHi.push('राशि संधि (किनारे के अंश) पर होने से दोनों समीपवर्ती राशियों के मिश्रित गुण प्रकट होते हैं।');
  }
  if (isCombust && sunDistanceDeg !== null) {
    extraFlagsEn.push(`Within ${sunDistanceDeg}° of Sun (Combust) — outward expression needs patience and gentle cultivation.`);
    extraFlagsHi.push(`सूर्य से केवल ${sunDistanceDeg}° दूर (अस्त) — बाह्य प्रदर्शन में धैर्य और संबंधित ग्रह का उपाय सहायक होगा।`);
  }

  const boostBonus = (pBhaga ? 15 : 0) + (pNav ? 10 : 0) - (sandhi ? 10 : 0) - (gandanta ? 8 : 0);
  const adjPct = Math.max(8, Math.min(100, bal.pct + boostBonus));

  const bodyLabelEn = planet === 'Asc' ? 'Ascendant' : planet;
  const readingEn = `${bodyLabelEn} at ${degInSign.toFixed(2)}° ${sInfo.name} sits in ${bal.avasthaEn} (${drekkanaLabelEn}) — ${bal.toneEn}. ${extraFlagsEn.join(' ')}`.trim();
  const readingHi = `${SIGN_HI[signIndex]} राशि के ${degInSign.toFixed(2)}° पर ${PLANET_HI[planet]} '${bal.avasthaHi}' एवं ${drekkanaLabelHi} में स्थित है — ${bal.toneHi}। ${extraFlagsHi.join(' ')}`.trim();

  return {
    planet,
    signIndex,
    signNameEn: sInfo.name,
    signNameHi: sHi,
    degreeInSign: degInSign,
    dms,
    avasthaEn: bal.avasthaEn,
    avasthaHi: bal.avasthaHi,
    strengthPercent: adjPct,
    drekkanaNum: drekNum,
    drekkanaLabelEn,
    drekkanaLabelHi,
    isPushkaraNavamsha: pNav,
    isPushkaraBhaga: pBhaga,
    isGandanta: gandanta,
    isRashiSandhi: sandhi,
    specialDegTagEn,
    specialDegTagHi,
    sunDistanceDeg,
    readingEn,
    readingHi,
    source: 'BPHS Avasthadhyaya · Jataka Parijata · Pushkara Rules',
  };
}

export function computeDegreePredictions(chart: ChartData): DegreePredictionItem[] {
  const sunLon = chart.planets.find((p) => p.id === 'Sun')?.longitude;
  const byId = new Map(chart.planets.map((p) => [p.id, p]));
  const items: BodyPosition[] = [chart.ascendant, ...NINE_GRAHAS.map((g) => byId.get(g)!)];
  return items.map((b) =>
    analyzeBodyDegree(
      b.id as PredictionBodyId,
      b.signIndex,
      b.degreeInSign,
      b.dms,
      b.longitude,
      sunLon,
      b.isCombust
    )
  );
}
