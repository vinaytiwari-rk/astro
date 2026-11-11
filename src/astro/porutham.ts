import { NAKSHATRAS, NATURAL_FRIENDSHIP, SIGNS } from './constants';
import { evaluateParamayusStatus } from './predictions/paramayus';
import type { ChartData } from './types';

export interface PoruthamItem {
  key: string;
  nameEn: string;
  nameHi: string;
  status: 'Uttamam (Best)' | 'Madhyamam (Match)' | 'Adhamam (Mismatch)';
  passed: boolean;
  score: number; // 0, 0.5, 1
  brideVal: string;
  groomVal: string;
  noteEn: string;
  noteHi: string;
}

export interface PoruthamReport {
  locked: boolean;
  brideNakshatra: string;
  groomNakshatra: string;
  brideRashi: string;
  groomRashi: string;
  totalScore: number;
  maxScore: number;
  criticalRajjuPass: boolean;
  verdictEn: string;
  verdictHi: string;
  items: PoruthamItem[];
}

// 5-Fold Rajju Group per Nakshatra (0..26): Pada, Kati, Nabhi, Kanta, Sirassu
type RajjuGroup = 'Pada (Foot)' | 'Kati (Hip)' | 'Nabhi (Navel)' | 'Kanta (Neck)' | 'Sirassu (Head)';
const NAK_RAJJU: RajjuGroup[] = [
  'Pada (Foot)', 'Kati (Hip)', 'Nabhi (Navel)', 'Kanta (Neck)', 'Sirassu (Head)', // 0..4
  'Kanta (Neck)', 'Nabhi (Navel)', 'Kati (Hip)', 'Pada (Foot)',                   // 5..8
  'Pada (Foot)', 'Kati (Hip)', 'Nabhi (Navel)', 'Kanta (Neck)', 'Sirassu (Head)', // 9..13
  'Kanta (Neck)', 'Nabhi (Navel)', 'Kati (Hip)', 'Pada (Foot)',                   // 14..17
  'Pada (Foot)', 'Kati (Hip)', 'Nabhi (Navel)', 'Kanta (Neck)', 'Sirassu (Head)', // 18..22
  'Kanta (Neck)', 'Nabhi (Navel)', 'Kati (Hip)', 'Pada (Foot)',                   // 23..26
];

// Classical Vedha (Hostile Nakshatra Index Pairs)
const VEDHA_PAIRS: Array<[number, number]> = [
  [0, 17],  // Ashwini - Jyeshtha
  [1, 16],  // Bharani - Anuradha
  [2, 15],  // Krittika - Vishakha
  [3, 14],  // Rohini - Swati
  [4, 22],  // Mrigashira - Dhanishta
  [13, 4],  // Chitra - Mrigashira
  [13, 22], // Chitra - Dhanishta
  [5, 21],  // Ardra - Shravana
  [6, 20],  // Punarvasu - Uttara Ashadha
  [7, 19],  // Pushya - Purva Ashadha
  [8, 18],  // Ashlesha - Mula
  [9, 26],  // Magha - Revati
  [10, 25], // P.Phalguni - U.Bhadrapada
  [11, 24], // U.Phalguni - P.Bhadrapada
  [12, 23], // Hasta - Shatabhisha
];

const YONI_ENEMIES: Array<[string, string]> = [
  ['Horse', 'Buffalo'],
  ['Elephant', 'Lion'],
  ['Sheep', 'Monkey'],
  ['Serpent', 'Mongoose'],
  ['Dog', 'Deer'],
  ['Cat', 'Rat'],
  ['Cow', 'Tiger'],
];

const VASHYA_MAP: Record<number, number[]> = {
  0: [4, 7],       // Aries -> Leo, Scorpio
  1: [3, 6],       // Taurus -> Cancer, Libra
  2: [5],          // Gemini -> Virgo
  3: [7, 8],       // Cancer -> Scorpio, Sagittarius
  4: [6],          // Leo -> Libra
  5: [2, 11],      // Virgo -> Gemini, Pisces
  6: [9, 5],       // Libra -> Capricorn, Virgo
  7: [3],          // Scorpio -> Cancer
  8: [11],         // Sagittarius -> Pisces
  9: [0, 10],      // Capricorn -> Aries, Aquarius
  10: [0],         // Aquarius -> Aries
  11: [9],         // Pisces -> Capricorn
};

/**
 * Computes classical South Indian 10-Porutham (Dasa Porutham) marriage compatibility.
 * Honors the 120-Year Paramayus Lock.
 */
export function computeSouthIndianPorutham(
  bride: ChartData,
  groom: ChartData
): PoruthamReport {
  const bMoon = bride.planets.find((p) => p.id === 'Moon')!;
  const gMoon = groom.planets.find((p) => p.id === 'Moon')!;
  const bNak = bMoon.nakshatraIndex;
  const gNak = gMoon.nakshatraIndex;
  const bSign = bMoon.signIndex;
  const gSign = gMoon.signIndex;

  if (evaluateParamayusStatus(bride).exceeded || evaluateParamayusStatus(groom).exceeded) {
    return {
      locked: true,
      brideNakshatra: NAKSHATRAS[bNak].name,
      groomNakshatra: NAKSHATRAS[gNak].name,
      brideRashi: SIGNS[bSign].name,
      groomRashi: SIGNS[gSign].name,
      totalScore: 0,
      maxScore: 10,
      criticalRajjuPass: false,
      verdictEn: 'Porutham evaluation halted under 120-Year Paramayus limit.',
      verdictHi: '120 वर्ष परमायु सीमा के अंतर्गत मिलान स्थगित है।',
      items: [],
    };
  }

  // Forward count from Bride's Nakshatra to Groom's Nakshatra (1..27)
  const nakDist = ((gNak - bNak + 27) % 27) + 1;
  // Rashi count from Bride's Moon Rashi to Groom's Moon Rashi (1..12)
  const rashiDist = ((gSign - bSign + 12) % 12) + 1;

  const items: PoruthamItem[] = [];

  // 1. Dina Porutham (longevity & daily health): rem = nakDist % 9 -> [2, 4, 6, 8, 0] pass
  const rem9 = nakDist % 9;
  const dinaPass = [0, 2, 4, 6, 8].includes(rem9) || bNak === gNak;
  items.push({
    key: 'dina',
    nameEn: '1. Dina Porutham (Health & Longevity)',
    nameHi: '1. दिन पोरुथम् (आयु व आरोग्य)',
    status: dinaPass ? (rem9 === 0 || [4, 6, 8].includes(rem9) ? 'Uttamam (Best)' : 'Madhyamam (Match)') : 'Adhamam (Mismatch)',
    passed: dinaPass,
    score: dinaPass ? 1 : 0,
    brideVal: NAKSHATRAS[bNak].name,
    groomVal: NAKSHATRAS[gNak].name,
    noteEn: `Nak count ${nakDist} (Tara ${rem9 === 0 ? 9 : rem9}): ${dinaPass ? 'favorable vitality & daily rhythm.' : 'mild Dina mismatch; neutralizable via strong Rashi/Jupiter.'}`,
    noteHi: `वधू से वर नक्षत्र संख्या ${nakDist}: ${dinaPass ? 'उत्तम स्वास्थ्य व दांपत्य आयु।' : 'दिन दोष (अन्य शुभ योगों से परिहार्य)।'}`,
  });

  // 2. Gana Porutham (temperament)
  const bg = NAKSHATRAS[bNak].gana;
  const gg = NAKSHATRAS[gNak].gana;
  const ganaUttam = bg === gg || (bg === 'Deva' && gg === 'Manushya') || (bg === 'Manushya' && gg === 'Deva');
  const ganaMadhyam = (bg === 'Rakshasa' && gg === 'Rakshasa') || (bg === 'Manushya' && gg === 'Deva');
  const ganaPass = ganaUttam || ganaMadhyam;
  items.push({
    key: 'gana',
    nameEn: '2. Gana Porutham (Mental Harmony)',
    nameHi: '2. गण पोरुथम् (स्वभाव व मानसिक सामंजस्य)',
    status: ganaUttam ? 'Uttamam (Best)' : ganaPass ? 'Madhyamam (Match)' : 'Adhamam (Mismatch)',
    passed: ganaPass,
    score: ganaUttam ? 1 : ganaPass ? 0.5 : 0,
    brideVal: bg,
    groomVal: gg,
    noteEn: `${bg} + ${gg}: ${ganaPass ? 'compatible behavioral rhythm.' : 'Deva/Manushya with Rakshasa needs patience & mutual space.'}`,
    noteHi: `${bg} + ${gg}: ${ganaPass ? 'मानसिक स्वभाव अनुकूल है।' : 'स्वभाव में भिन्नता (धैर्य अपेक्षित)।'}`,
  });

  // 3. Mahendra Porutham (children & wealth growth): [4, 7, 10, 13, 16, 19, 22, 25]
  const mahPass = [4, 7, 10, 13, 16, 19, 22, 25].includes(nakDist);
  items.push({
    key: 'mahendra',
    nameEn: '3. Mahendra Porutham (Progeny & Prosperity)',
    nameHi: '3. महेंद्र पोरुथम् (संतान व समृद्धि)',
    status: mahPass ? 'Uttamam (Best)' : 'Adhamam (Mismatch)',
    passed: mahPass,
    score: mahPass ? 1 : 0,
    brideVal: `${bNak + 1}`,
    groomVal: `${gNak + 1}`,
    noteEn: mahPass
      ? `Nakshatra count ${nakDist} falls in Mahendra set — favors family growth & lasting support.`
      : `Count ${nakDist} is outside Mahendra list (helpful bonus, not mandatory when D9/D7 are strong).`,
    noteHi: mahPass ? `नक्षत्र संख्या ${nakDist} महेंद्र श्रेणी में शुभ है — वंश व धन वृद्धि कारक।` : `नक्षत्र संख्या ${nakDist} महेंद्र में नहीं है (अनिवार्य नहीं, नवांश/Saptamsa से देखें)।`,
  });

  // 4. Stree Deergha Porutham (wife's prosperity): distance >= 13 (7..12 Madhyam)
  const sdBest = nakDist >= 13;
  const sdMed = nakDist >= 8 && nakDist < 13;
  const sdPass = sdBest || sdMed;
  items.push({
    key: 'stree_deergha',
    nameEn: '4. Stree Deergha Porutham (Fortune & Comfort)',
    nameHi: '4. स्त्री दीर्घ पोरुथम् (सौभाग्य व सुख)',
    status: sdBest ? 'Uttamam (Best)' : sdMed ? 'Madhyamam (Match)' : 'Adhamam (Mismatch)',
    passed: sdPass,
    score: sdBest ? 1 : sdMed ? 0.5 : 0,
    brideVal: NAKSHATRAS[bNak].name,
    groomVal: `${nakDist} Naks`,
    noteEn: sdBest
      ? `${nakDist} Nakshatras apart (≥13) — strong longevity & comfort for the bride.`
      : sdMed
        ? `${nakDist} Nakshatras apart — moderate Stree Deergha support.`
        : `Only ${nakDist} Nakshatras from bride's star (<8).`,
    noteHi: `वधू से वर नक्षत्र अंतर ${nakDist}: ${sdBest ? 'उत्तम सौभाग्य' : sdMed ? 'मध्यम' : 'न्यून अंतर'}।`,
  });

  // 5. Yoni Porutham (physical & romantic closeness)
  const by = NAKSHATRAS[bNak].yoni;
  const gy = NAKSHATRAS[gNak].yoni;
  const isEnemy = YONI_ENEMIES.some(([a, b]) => (a === by && b === gy) || (a === gy && b === by));
  const yoniPass = !isEnemy;
  items.push({
    key: 'yoni',
    nameEn: '5. Yoni Porutham (Physical Intimacy)',
    nameHi: '5. योनि पोरुथम् (दाम्पत्य आकर्षण)',
    status: by === gy ? 'Uttamam (Best)' : yoniPass ? 'Madhyamam (Match)' : 'Adhamam (Mismatch)',
    passed: yoniPass,
    score: by === gy ? 1 : yoniPass ? 1 : 0,
    brideVal: by,
    groomVal: gy,
    noteEn: isEnemy ? `Sworn Yoni pair (${by} vs ${gy}) lowers physical ease.` : `${by} + ${gy}: smooth conjugal affinity.`,
    noteHi: isEnemy ? `विरोधी योनि (${by} व ${gy}) से सामंजस्य में सावधानी अपेक्षित।` : `${by} व ${gy} योनि परस्पर अनुकूल हैं।`,
  });

  // 6. Rashi Porutham (Moon Rashi distance): [1, 7, 9, 10, 11, 12] best; 3/4/5 good with even/odd; [2, 6, 8] avoid
  const rashiUttam = [1, 7, 9, 10, 11, 12].includes(rashiDist);
  const rashiMed = [3, 4, 5].includes(rashiDist);
  const rashiPass = rashiUttam || rashiMed;
  items.push({
    key: 'rashi',
    nameEn: '6. Rashi Porutham (Family & Lineage Bond)',
    nameHi: '6. राशि पोरुथम् (परिवार व वंश स्थिरता)',
    status: rashiUttam ? 'Uttamam (Best)' : rashiMed ? 'Madhyamam (Match)' : 'Adhamam (Mismatch)',
    passed: rashiPass,
    score: rashiUttam ? 1 : rashiMed ? 0.5 : 0,
    brideVal: SIGNS[bSign].name,
    groomVal: SIGNS[gSign].name,
    noteEn: `Moon sign distance ${rashiDist}: ${rashiPass ? 'harmonious household bond.' : '2/6/8 Moon angle calls for Rasadhipati/Kendra strength.'}`,
    noteHi: `राशि अंतर ${rashiDist}: ${rashiPass ? 'गृहस्थ जीवन अनुकूल।' : '6/8/2 राशि दूरी (राशिपति मैत्री से परिहार देखें)।'}`,
  });

  // 7. Rashyadhipati Porutham (Moon Sign Lords friendship)
  const bl = SIGNS[bSign].lord;
  const gl = SIGNS[gSign].lord;
  const sumF = NATURAL_FRIENDSHIP[bl][gl] + NATURAL_FRIENDSHIP[gl][bl];
  const rlordUttam = bl === gl || sumF >= 1;
  const rlordMed = sumF === 0;
  const rlordPass = rlordUttam || rlordMed;
  items.push({
    key: 'rashyadhipati',
    nameEn: '7. Rashyadhipati (Planetary Lords Affinity)',
    nameHi: '7. राश्याधिपति पोरुथम् (ग्रह स्वामी मैत्री)',
    status: rlordUttam ? 'Uttamam (Best)' : rlordMed ? 'Madhyamam (Match)' : 'Adhamam (Mismatch)',
    passed: rlordPass,
    score: rlordUttam ? 1 : rlordMed ? 0.5 : 0,
    brideVal: bl,
    groomVal: gl,
    noteEn: `${bl} & ${gl}: ${rlordUttam ? 'friendly lords — rescues Rashi friction.' : rlordMed ? 'neutral balance.' : 'contrasting lords.'}`,
    noteHi: `स्वामी ${bl} व ${gl}: ${rlordUttam ? 'मित्र ग्रह स्वामी हैं।' : rlordMed ? 'सम संबंध।' : 'विरोधी ग्रह स्वामी।'}`,
  });

  // 8. Vasya Porutham (magnetic mutual devotion)
  const bAccepts = VASHYA_MAP[bSign]?.includes(gSign) ?? false;
  const gAccepts = VASHYA_MAP[gSign]?.includes(bSign) ?? false;
  const vasyaPass = bAccepts || gAccepts || bSign === gSign;
  items.push({
    key: 'vasya',
    nameEn: '8. Vasya Porutham (Magnetic Bond)',
    nameHi: '8. वश्य पोरुथम् (पारस्परिक प्रेम व आकर्षण)',
    status: vasyaPass ? 'Uttamam (Best)' : 'Madhyamam (Match)',
    passed: vasyaPass,
    score: vasyaPass ? 1 : 0.5,
    brideVal: SIGNS[bSign].vashya,
    groomVal: SIGNS[gSign].vashya,
    noteEn: vasyaPass ? 'Classical Vasya sign affinity reinforces affection.' : 'Neutral Vasya resonance (non-blocking bonus).',
    noteHi: vasyaPass ? 'शास्त्रीय वश्य संबंध प्रेम व समर्पण बढ़ाता है।' : 'सामान्य वश्य स्थिति।',
  });

  // 9. Rajju Porutham (CRITICAL rope match — different Rajju group required!)
  const bRajju = NAK_RAJJU[bNak];
  const gRajju = NAK_RAJJU[gNak];
  const rajjuPass = bRajju !== gRajju;
  items.push({
    key: 'rajju',
    nameEn: '9. Rajju Porutham (Mangalya Protection)',
    nameHi: '9. रज्जु पोरुथम् (मांगल्य एवं दीर्घ सौभाग्य — मुख्य)',
    status: rajjuPass ? 'Uttamam (Best)' : 'Adhamam (Mismatch)',
    passed: rajjuPass,
    score: rajjuPass ? 1 : 0,
    brideVal: bRajju,
    groomVal: gRajju,
    noteEn: rajjuPass
      ? `Distinct Rajjus (${bRajju} vs ${gRajju}) — PASS! Critical South Indian Mangalya check satisfied.`
      : `Same Rajju (${bRajju}) — Caution! Classical Rajju Dosha unless rescued by Rashi, Rashyadhipati, Dina & strong 7th/8th house.`,
    noteHi: rajjuPass
      ? `भिन्न रज्जु (${bRajju} एवं ${gRajju}) — रज्जु पोरुथम् पूर्णतः शुभ व सुरक्षित है।`
      : `समान रज्जु (${bRajju}) — रज्जु दोष! राश्याधिपति, दिन व सप्तम/अष्टम बल अवश्य जांचें।`,
  });

  // 10. Vedha Porutham (Hostile star intersection)
  const isVedha = VEDHA_PAIRS.some(([a, b]) => (a === bNak && b === gNak) || (a === gNak && b === bNak));
  const vedhaPass = !isVedha;
  items.push({
    key: 'vedha',
    nameEn: '10. Vedha Porutham (Friction Shield)',
    nameHi: '10. वेध पोरुथम् (अवरोध रहित नक्षत्र)',
    status: vedhaPass ? 'Uttamam (Best)' : 'Adhamam (Mismatch)',
    passed: vedhaPass,
    score: vedhaPass ? 1 : 0,
    brideVal: NAKSHATRAS[bNak].name,
    groomVal: NAKSHATRAS[gNak].name,
    noteEn: vedhaPass ? 'Free from Nakshatra Vedha conflict.' : `Nakshatra Vedha exists between ${NAKSHATRAS[bNak].name} & ${NAKSHATRAS[gNak].name}.`,
    noteHi: vedhaPass ? 'नक्षत्र वेध दोष से पूर्णतः मुक्त है।' : `${NAKSHATRAS[bNak].name} व ${NAKSHATRAS[gNak].name} में नक्षत्र वेध है।`,
  });

  const totalScore = Math.round(items.reduce((s, it) => s + it.score, 0) * 10) / 10;
  const verdictEn =
    rajjuPass && vedhaPass && totalScore >= 6
      ? `Recommended South Indian Match (${totalScore}/10 Poruthams passed, including critical Rajju & Vedha checks).`
      : !rajjuPass
        ? `Score ${totalScore}/10 — Same Rajju caution present; requires strong Rashi/D9/8th-house compensation and Shanti.`
        : `Moderate match (${totalScore}/10 Poruthams) — verify full chart & Navamsa compatibility.`;
  const verdictHi =
    rajjuPass && vedhaPass && totalScore >= 6
      ? `दक्षिण भारतीय दशा-पोरुथम् अनुकूल (${totalScore}/10 पोरुथम् पूर्ण, रज्जु व वेध सहित शुभ)।`
      : !rajjuPass
        ? `स्कोर ${totalScore}/10 — समान रज्जु की सावधानी है; सप्तम/अष्टम भाव, नवांश व शांति अवश्य देखें।`
        : `मध्यम पोरुथम् (${totalScore}/10) — समग्र कुंडली व नवांश से निर्णय लें।`;

  return {
    locked: false,
    brideNakshatra: NAKSHATRAS[bNak].name,
    groomNakshatra: NAKSHATRAS[gNak].name,
    brideRashi: SIGNS[bSign].name,
    groomRashi: SIGNS[gSign].name,
    totalScore,
    maxScore: 10,
    criticalRajjuPass: rajjuPass,
    verdictEn,
    verdictHi,
    items,
  };
}
