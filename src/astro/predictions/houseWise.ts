import { computeBhavaChalitPlacements } from '../avakahadaChalit';
import { COMBUSTION_ORB, NAKSHATRAS, NINE_GRAHAS, SIGNS } from '../constants';
import { angularDiffDeg } from '../time';
import type { ChartData, NineGrahaId, SevenPlanetId } from '../types';
import { buildHouseLordReading } from './bhavaKb';

export interface HouseWisePrediction {
  houseNumber: number; // 1..12
  titleEn: string;
  titleHi: string;
  signIndex: number;
  signNameEn: string;
  signNameHi: string;
  lordPlanet: SevenPlanetId;
  lordPlacedHouse: number;
  lordPlacedSignIndex: number;
  lordDignity: string;
  occupants: NineGrahaId[];
  aspectingPlanets: NineGrahaId[];
  naturalKaraka: NineGrahaId;
  karakaDignity: string;
  savBindus: number;
  chalitShiftNoteEn: string | null;
  chalitShiftNoteHi: string | null;
  score: number;
  verdictEn: string;
  verdictHi: string;
  lordReadingEn: string;
  lordReadingHi: string;
  synthesisEn: string;
  synthesisHi: string;
  source: string;
  // Extended Parashari Hierarchy details (Drishti, Sthan, Rashi, Nakshatra, Yuti, Degree, Avastha, Kartari)
  lordNakshatraName?: string;
  lordPada?: number;
  lordStarLord?: NineGrahaId;
  lordBaladiAvasthaHi?: string;
  lordBaladiAvasthaEn?: string;
  lordCombust?: boolean;
  kartariYoga?: 'Subhakartari' | 'Papakartari' | 'None';
  kartariHi?: string;
  kartariEn?: string;
  primaryFactorsHi?: string;
  primaryFactorsEn?: string;
  secondarySavHi?: string;
  secondarySavEn?: string;
}

const SIGN_HI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
];

const PLANET_HI: Record<string, string> = {
  Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध',
  Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
};

const DIGNITY_HI: Record<string, string> = {
  Exalted: 'उच्च', Moolatrikona: 'मूलत्रिकोण', 'Own Sign': 'स्वराशि',
  'Great Friend': 'अति मित्र', Friend: 'मित्र', Neutral: 'सम',
  Enemy: 'शत्रु', 'Great Enemy': 'अति शत्रु', Debilitated: 'नीच', '-': '—',
};

const HOUSE_META: Array<{
  titleEn: string;
  titleHi: string;
  karaka: NineGrahaId;
  areaEn: string;
  areaHi: string;
}> = [
  { titleEn: '1st House — Tanu Bhava (Self, Body & Destiny)', titleHi: 'प्रथम भाव — तनु भाव (व्यक्तित्व, स्वास्थ्य एवं जीवन दिशा)', karaka: 'Sun', areaEn: 'health, vitality, self-confidence, aura and overall life path', areaHi: 'स्वास्थ्य, जीवन-शक्ति, आत्मबल, ओरा व समग्र जीवन-दिशा' },
  { titleEn: '2nd House — Dhana Bhava (Wealth, Speech & Family)', titleHi: 'द्वितीय भाव — धन भाव (संचित धन, वाणी एवं कुटुंब)', karaka: 'Jupiter', areaEn: 'accumulated assets, speech eloquence, family heritage and financial security', areaHi: 'संचित धन, वाणी माधुर्य, पारिवारिक सुख व कुल-संपत्ति' },
  { titleEn: '3rd House — Sahaja Bhava (Courage, Siblings & Skills)', titleHi: 'तृतीय भाव — सहज भाव (पराक्रम, भाई-बहन व संचार)', karaka: 'Mars', areaEn: 'courage, initiative, co-born siblings, communication and self-made efforts', areaHi: 'पराक्रम, उद्यम, छोटे भाई-बहन, लेखन व स्व-प्रयास' },
  { titleEn: '4th House — Sukha Bhava (Mother, Home & Peace)', titleHi: 'चतुर्थ भाव — सुख भाव (माता, गृह, वाहन एवं मनःशांति)', karaka: 'Moon', areaEn: 'maternal bond, landed property, vehicles, mental serenity and domestic peace', areaHi: 'मातृ सुख, भूमि, भवन, वाहन, मनःशांति व गृहस्थ सुख' },
  { titleEn: '5th House — Putra Bhava (Intellect, Progeny & Purva Punya)', titleHi: 'पंचम भाव — पुत्र भाव (शिक्षा, बुद्धि, संतान व पूर्व पुण्य)', karaka: 'Jupiter', areaEn: 'higher intellect, creative genius, children, romantic prospects and past-life merits', areaHi: 'उच्च मेधा, रचनात्मकता, संतान सुख, प्रेम व पूर्व जन्म के पुण्य' },
  { titleEn: '6th House — Ripu Bhava (Service, Health & Competition)', titleHi: 'षष्ठ भाव — रिपु भाव (रोग-प्रतिरोध, सेवा, ऋण व शत्रु विजय)', karaka: 'Saturn', areaEn: 'competitive victory, immunity, daily profession, debt recovery and overcoming rivals', areaHi: 'प्रतिस्पर्धा विजय, रोग-प्रतिरोधक क्षमता, नौकरी, ऋण मुक्ति व शत्रु शमन' },
  { titleEn: '7th House — Kalatra Bhava (Marriage & Partnerships)', titleHi: 'सप्तम भाव — कलत्र भाव (विवाह, जीवनसाथी एवं व्यापार साझेदारी)', karaka: 'Venus', areaEn: 'spouse nature, matrimonial bliss, partnership longevity and foreign trade alliances', areaHi: 'विवाह, जीवनसाथी का स्वभाव, दांपत्य सामंजस्य व व्यापारिक साझेदारी' },
  { titleEn: '8th House — Ayur Bhava (Longevity, Research & Transformation)', titleHi: 'अष्टम भाव — आयु भाव (दीर्घायु, गूढ़ शोध व आकस्मिक परिवर्तन)', karaka: 'Saturn', areaEn: 'longevity resilience, occult depth, sudden unearned wealth, inheritance and inner transformation', areaHi: 'आयु बल, गूढ़ अनुसंधान, पैतृक संपत्ति, आकस्मिक लाभ व आत्म-रूपांतरण' },
  { titleEn: '9th House — Bhagya Bhava (Fortune, Dharma & Father)', titleHi: 'नवम भाव — भाग्य भाव (भाग्योदय, धर्म, गुरु, पिता व उच्च यात्रा)', karaka: 'Jupiter', areaEn: 'fortune rising, paternal blessings, spiritual mentor grace, higher learning and pilgrimages', areaHi: 'भाग्योदय, पिता का आशीष, गुरु कृपा, धार्मिक निष्ठा व तीर्थ यात्रा' },
  { titleEn: '10th House — Karma Bhava (Career, Authority & Status)', titleHi: 'दशम भाव — कर्म भाव (करियर, पद, प्रशासन एवं सामाजिक प्रतिष्ठा)', karaka: 'Mercury', areaEn: 'professional zenith, executive authority, leadership status and enduring life accomplishments', areaHi: 'आजीविका, प्रशासनिक अधिकार, पद-प्रतिष्ठा, कीर्ति व कर्म सिद्धि' },
  { titleEn: '11th House — Labha Bhava (Gains, Network & Desires)', titleHi: 'एकादश भाव — लाभ भाव (नियमित आय, लाभ, मित्र व इच्छा-पूर्ति)', karaka: 'Jupiter', areaEn: 'abundant gains, financial inflows, influential social circles and fulfillment of cherished ambitions', areaHi: 'आर्थिक लाभ, नियमित आय, प्रतिष्ठित मित्र-वर्ग व अभीष्ट मनोकामना पूर्ति' },
  { titleEn: '12th House — Vyaya Bhava (Foreign Lands, Moksha & Expenditure)', titleHi: 'द्वादश भाव — व्यय भाव (विदेश गमन, खर्च, शयन सुख व मोक्ष)', karaka: 'Ketu', areaEn: 'foreign settlement, philanthropic spending, subconscious rest, bed comforts and spiritual liberation', areaHi: 'विदेश गमन/वास, दान-पुण्य, शयन सुख, अंतर्मुखी साधना व मोक्ष' },
];

const NATURAL_BENEFICS = new Set<NineGrahaId>(['Jupiter', 'Venus', 'Mercury', 'Moon']);
const NATURAL_MALEFICS = new Set<NineGrahaId>(['Saturn', 'Mars', 'Rahu', 'Ketu', 'Sun']);

function scoreDignity(dig: string): number {
  const m: Record<string, number> = {
    Exalted: 20, Moolatrikona: 16, 'Own Sign': 14, 'Great Friend': 10, Friend: 6,
    Neutral: 0, Enemy: -8, 'Great Enemy': -12, Debilitated: -18,
  };
  return m[dig] ?? 0;
}

// Full Parashari aspects calculation with exact special angles
function getGrahaAspectTargets(planetId: NineGrahaId, fromHouse: number): Array<{ targetHouse: number; type: string }> {
  const step = (offset: number) => ((fromHouse - 1 + offset) % 12) + 1;
  const list: Array<{ targetHouse: number; type: string }> = [];

  // All planets aspect 7th house (180°)
  list.push({ targetHouse: step(6), type: '7th (180° पूर्ण दृष्टि)' });

  // Special Parashari aspects
  if (planetId === 'Mars') {
    list.push({ targetHouse: step(3), type: '4th (चतुर्थ विशेष दृष्टि)' });
    list.push({ targetHouse: step(7), type: '8th (अष्टम विशेष दृष्टि)' });
  } else if (planetId === 'Jupiter') {
    list.push({ targetHouse: step(4), type: '5th (पंचम अमृत दृष्टि)' });
    list.push({ targetHouse: step(8), type: '9th (नवम अमृत दृष्टि)' });
  } else if (planetId === 'Saturn') {
    list.push({ targetHouse: step(2), type: '3rd (तृतीय विशेष दृष्टि)' });
    list.push({ targetHouse: step(9), type: '10th (दशम विशेष दृष्टि)' });
  } else if (planetId === 'Rahu' || planetId === 'Ketu') {
    list.push({ targetHouse: step(4), type: '5th (पंचम विशेष दृष्टि)' });
    list.push({ targetHouse: step(8), type: '9th (नवम विशेष दृष्टि)' });
  }
  return list;
}

// Baladi Avastha computation based on odd/even signs
function computeBaladiAvastha(signIdx: number, degInSign: number): { en: string; hi: string; pct: number } {
  const isOdd = signIdx % 2 === 0;
  const seg = Math.min(4, Math.floor(degInSign / 6)); // 0..4
  const effIdx = isOdd ? seg : 4 - seg;

  switch (effIdx) {
    case 0:
      return { en: 'Bala (Infant — 25% manifestation)', hi: 'बाल्यावस्था (25% आरंभिक फल)', pct: 25 };
    case 1:
      return { en: 'Kumara (Adolescent — 55% manifestation)', hi: 'कुमारावस्था (55% विकासशील फल)', pct: 55 };
    case 2:
      return { en: 'Yuva (Mature Peak — 100% full manifestation)', hi: 'युवावस्था (100% पूर्ण बली फल)', pct: 100 };
    case 3:
      return { en: 'Vriddha (Aged — 15% delayed manifestation)', hi: 'वृद्धावस्था (15% शिथिल/विलंबित फल)', pct: 15 };
    default:
      return { en: 'Mrita (Inert — 5% dormant)', hi: 'मृतावस्था (5% सुप्त/निष्क्रिय)', pct: 5 };
  }
}

// Check planetary combustion from Sun
function checkCombustion(planetId: SevenPlanetId, planetLon: number, sunLon: number, isRetro: boolean): { isCombust: boolean; distDeg: number } {
  const dist = angularDiffDeg(planetLon, sunLon);
  const orbDef = COMBUSTION_ORB[planetId];
  if (!orbDef) return { isCombust: false, distDeg: Math.round(dist * 10) / 10 };
  const maxOrb = (isRetro && orbDef.retro) ? orbDef.retro : orbDef.direct;
  return { isCombust: dist <= maxOrb, distDeg: Math.round(dist * 10) / 10 };
}

export function computeHouseWisePredictions(chart: ChartData): HouseWisePrediction[] {
  const byId = new Map(chart.planets.map((p) => [p.id, p]));
  const sunPos = byId.get('Sun')!;
  const ascSign = chart.ascendant.signIndex;
  const chalit = computeBhavaChalitPlacements(chart);

  // Precompute Parashari aspects per house with aspect details
  const aspectMap = new Map<number, Array<{ planet: NineGrahaId; type: string }>>();
  for (let h = 1; h <= 12; h++) aspectMap.set(h, []);
  for (const g of NINE_GRAHAS) {
    const pos = byId.get(g);
    if (!pos) continue;
    const targets = getGrahaAspectTargets(g, pos.rasiHouseNumber);
    for (const t of targets) {
      aspectMap.get(t.targetHouse)!.push({ planet: g, type: t.type });
    }
  }

  return Array.from({ length: 12 }, (_, idx) => {
    const h = idx + 1;
    const meta = HOUSE_META[idx];
    const signIndex = (ascSign + idx) % 12;
    const signInfo = SIGNS[signIndex];
    const lordPlanet = signInfo.lord;
    const lordPos = byId.get(lordPlanet)!;
    const karakaPos = byId.get(meta.karaka)!;
    const savBindus = chart.ashtakavarga.sarva[signIndex];

    // House Occupants and Conjunctions
    const occupants = NINE_GRAHAS.filter((g) => byId.get(g)?.rasiHouseNumber === h);
    const aspectEntries = aspectMap.get(h) ?? [];
    const aspectingPlanets = aspectEntries.map((a) => a.planet);

    // 1. Lord's Nakshatra & Star Lord
    const lordNakIdx = lordPos.nakshatraIndex ?? Math.floor(lordPos.longitude / (360 / 27));
    const lordNak = NAKSHATRAS[lordNakIdx] ?? NAKSHATRAS[0];
    const lordPada = lordPos.pada || 1;
    const lordStarLord = lordNak.lord;

    // 2. Lord's Baladi Avastha and Degree
    const lordDegInSign = lordPos.degreeInSign ?? (lordPos.longitude % 30);
    const lordAvastha = computeBaladiAvastha(lordPos.signIndex, lordDegInSign);

    // 3. Lord Combustion Check
    const combustion = checkCombustion(lordPlanet, lordPos.longitude, sunPos.longitude, !!lordPos.isRetrograde);

    // 4. Kartari Yoga on the House (Check H-1 and H+1)
    const prevH = h === 1 ? 12 : h - 1;
    const nextH = h === 12 ? 1 : h + 1;
    const planetsInPrevH = NINE_GRAHAS.filter((g) => byId.get(g)?.rasiHouseNumber === prevH);
    const planetsInNextH = NINE_GRAHAS.filter((g) => byId.get(g)?.rasiHouseNumber === nextH);

    const prevHasMalefic = planetsInPrevH.some((p) => NATURAL_MALEFICS.has(p));
    const nextHasMalefic = planetsInNextH.some((p) => NATURAL_MALEFICS.has(p));
    const prevHasBenefic = planetsInPrevH.some((p) => NATURAL_BENEFICS.has(p));
    const nextHasBenefic = planetsInNextH.some((p) => NATURAL_BENEFICS.has(p));

    let kartariYoga: 'Subhakartari' | 'Papakartari' | 'None' = 'None';
    let kartariHi = '';
    let kartariEn = '';

    if (prevHasMalefic && nextHasMalefic && !prevHasBenefic && !nextHasBenefic) {
      kartariYoga = 'Papakartari';
      kartariHi = `पापकर्तरी योग: भाव के 12वें भाव में ${planetsInPrevH.map((p) => PLANET_HI[p]).join(', ')} व द्वितीय भाव में ${planetsInNextH.map((p) => PLANET_HI[p]).join(', ')} स्थित हैं, जिससे भाव के परिणाम संकुचित व संघर्षमय रहते हैं।`;
      kartariEn = `Papakartari Yoga: House is hemmed between malefics (${planetsInPrevH.join(', ')} in H-1 and ${planetsInNextH.join(', ')} in H+1), restricting smooth manifestation.`;
    } else if (prevHasBenefic && nextHasBenefic) {
      kartariYoga = 'Subhakartari';
      kartariHi = `शुभकर्तरी योग: भाव के दोनों ओर शुभ ग्रह (${planetsInPrevH.map((p) => PLANET_HI[p]).join(', ')} एवं ${planetsInNextH.map((p) => PLANET_HI[p]).join(', ')}) होने से भाव को नैसर्गिक सुरक्षा कवच प्राप्त है।`;
      kartariEn = `Subhakartari Yoga: House is protected between benefics (${planetsInPrevH.join(', ')} and ${planetsInNextH.join(', ')}), shielding its promises.`;
    }

    // 5. Categorize Aspects into Benefic vs Malefic
    const beneficAspects = aspectEntries.filter((a) => NATURAL_BENEFICS.has(a.planet));
    const maleficAspects = aspectEntries.filter((a) => NATURAL_MALEFICS.has(a.planet));

    // 6. Classical Parashari Scoring (Lord Sthan + Rashi + Nakshatra + Drishti + Kartari + Avastha + Combustion)
    // SAV is intentionally given a secondary modifier weight (max +/- 5 points)
    let score = 56;

    // Lord Sthan (Kendra / Trikona / Upachaya / Dusthana)
    const lordH = lordPos.rasiHouseNumber;
    if ([1, 4, 7, 10].includes(lordH)) score += 10; // Kendra
    if ([5, 9].includes(lordH)) score += 12; // Trikona
    if ([3, 11].includes(lordH)) score += 6; // Upachaya
    if ([6, 8, 12].includes(lordH) && ![6, 8, 12].includes(h)) score -= 12; // Dusthana affliction

    // Lord Rashi Dignity
    score += scoreDignity(lordPos.dignity) * 0.8;

    // Lord Baladi Avastha
    if (lordAvastha.pct >= 80) score += 6;
    else if (lordAvastha.pct <= 25) score -= 5;

    // Combustion
    if (combustion.isCombust) score -= 10;

    // Kartari
    if (kartariYoga === 'Papakartari') score -= 9;
    if (kartariYoga === 'Subhakartari') score += 7;

    // Occupants
    for (const occ of occupants) {
      if (NATURAL_BENEFICS.has(occ)) score += 7;
      else if (NATURAL_MALEFICS.has(occ)) {
        if ([3, 6, 10, 11].includes(h)) score += 4; // Malefics good in Upachayas
        else score -= 6;
      }
    }

    // Aspects (Drishti)
    for (const ba of beneficAspects) score += 5;
    for (const ma of maleficAspects) score -= 4;

    // Karaka strength
    score += scoreDignity(karakaPos.dignity) * 0.3;

    // Secondary Modifier: SAV (strictly auxiliary)
    if (savBindus >= 32) score += 5;
    else if (savBindus >= 28) score += 2;
    else if (savBindus <= 22) score -= 5;

    const finalScore = Math.max(25, Math.min(96, Math.round(score)));
    const verdictEn =
      finalScore >= 78 ? 'Highly Auspicious & Potent' : finalScore >= 62 ? 'Strong & Supportive' : finalScore >= 46 ? 'Mixed / Demands Effort' : 'Severely Afflicted / Requires Remediation';
    const verdictHi =
      finalScore >= 78 ? 'अत्यंत बली, शुभ एवं फलदायी' : finalScore >= 62 ? 'सशक्त, अनुकूल एवं सहायक' : finalScore >= 46 ? 'मिश्रित / प्रयास व धैर्य अपेक्षित' : 'क्लेशकारी / शास्त्रीय उपाय आवश्यक';

    // Lord Reading
    const rawLordReadingEn = buildHouseLordReading(
      h,
      lordPos.rasiHouseNumber,
      lordPlanet,
      lordPos.dignity
    ).reading;

    const lordReadingHi = `${h}वें भाव के स्वामी ${PLANET_HI[lordPlanet]} (${DIGNITY_HI[lordPos.dignity] ?? lordPos.dignity}) जन्म कुंडली के ${lordPos.rasiHouseNumber}वें भाव (${SIGN_HI[lordPos.signIndex]} राशि) में स्थित हैं। वे ${lordNak.name} नक्षत्र (चरण ${lordPada}), नक्षत्र स्वामी ${PLANET_HI[lordStarLord]} के प्रभाव में हैं। ${combustion.isCombust ? `सूर्य से ${combustion.distDeg}° पर होने से अस्त (Moudhya) हैं। ` : ''}अवस्था: ${lordAvastha.hi}।`;

    // Formulation of primary factors and secondary SAV
    const occStrHi = occupants.length ? occupants.map((o) => `${PLANET_HI[o]} (${DIGNITY_HI[byId.get(o)?.dignity || 'Neutral']})`).join(', ') : 'कोई ग्रह स्थित नहीं (भाव रिक्त है)';
    const occStrEn = occupants.length ? occupants.map((o) => `${o} (${byId.get(o)?.dignity || 'Neutral'})`).join(', ') : 'Empty (governed purely by lord & aspects)';

    const beneficAspStrHi = beneficAspects.length ? beneficAspects.map((b) => `${PLANET_HI[b.planet]} (${b.type})`).join(', ') : 'कोई शुभ दृष्टि नहीं';
    const maleficAspStrHi = maleficAspects.length ? maleficAspects.map((m) => `${PLANET_HI[m.planet]} (${m.type})`).join(', ') : 'कोई अशुभ दृष्टि नहीं';

    const beneficAspStrEn = beneficAspects.length ? beneficAspects.map((b) => `${b.planet} (${b.type})`).join(', ') : 'None';
    const maleficAspStrEn = maleficAspects.length ? maleficAspects.map((m) => `${m.planet} (${m.type})`).join(', ') : 'None';

    const primaryFactorsHi = `1. भावेश स्थिति: ${PLANET_HI[lordPlanet]} भाव ${lordPos.rasiHouseNumber} में (${DIGNITY_HI[lordPos.dignity]}), नक्षत्र: ${lordNak.name} (स्वामी ${PLANET_HI[lordStarLord]}), अवस्था: ${lordAvastha.hi}${combustion.isCombust ? ' (अस्त)' : ''}।\n2. स्थित ग्रह: ${occStrHi}।\n3. दृष्टि प्रभाव: शुभ दृष्टि — ${beneficAspStrHi}; क्रूर दृष्टि — ${maleficAspStrHi}।${kartariHi ? `\n4. कर्तरी प्रभाव: ${kartariHi}` : ''}`;
    const primaryFactorsEn = `1. House Lord: ${lordPlanet} in House ${lordPos.rasiHouseNumber} (${lordPos.dignity}), Nakshatra ${lordNak.name} (Star Lord ${lordStarLord}), Avastha: ${lordAvastha.en}${combustion.isCombust ? ` (Combust within ${combustion.distDeg}°)` : ''}.\n2. Occupants: ${occStrEn}.\n3. Aspects: Benefic — ${beneficAspStrEn}; Malefic — ${maleficAspStrEn}.${kartariEn ? `\n4. Kartari: ${kartariEn}` : ''}`;

    const secondarySavHi = `अष्टकवर्ग (गौण/सहायक): ${savBindus} बिंदु — यह भाव को सहायक ऊर्जा व संसाधन प्रदान करता है (${savBindus >= 30 ? 'प्रचुर पोषक ऊर्जा' : savBindus >= 25 ? 'संतुलित ऊर्जा' : 'अवरोधक/न्यून ऊर्जा'})।`;
    const secondarySavEn = `Ashtakavarga (Secondary/Corroborative): ${savBindus} bindus — provides background resource support (${savBindus >= 30 ? 'abundant reserve' : savBindus >= 25 ? 'steady resource' : 'low reserve, requiring conscious effort'})`;

    // Deep Structured Synthesis
    const synthesisHi = `${meta.titleHi}:
प्राथमिक विश्लेषण (भावेश, राशि, नक्षत्र, युति व दृष्टि):
- ${h}वें भाव के स्वामी ${PLANET_HI[lordPlanet]} कुंडली के ${lordH}वें भाव में ${DIGNITY_HI[lordPos.dignity]} हैं। वे ${lordNak.name} नक्षत्र (स्वामी: ${PLANET_HI[lordStarLord]}) में ${lordAvastha.hi} में विराजमान हैं। ${combustion.isCombust ? `सूर्य के सान्निध्य (${combustion.distDeg}°) के कारण अस्त होने से इस भाव के प्रत्यक्ष परिणामों में देरी व तपस्या का योग बनता है। ` : ''}
- भाव में स्थित ग्रह: ${occStrHi}।
- दृष्टि संबंध: ${beneficAspects.length ? `शुभ ग्रहों की दृष्टि (${beneficAspStrHi}) भाव की सुरक्षा करती है। ` : ''}${maleficAspects.length ? `क्रूर ग्रहों की दृष्टि (${maleficAspStrHi}) चुनौतियां व संघर्ष उत्पन्न करती है। ` : ''}
${kartariYoga === 'Papakartari' ? `- ${kartariHi}\n` : kartariYoga === 'Subhakartari' ? `- ${kartariHi}\n` : ''}
गौण/सहायक प्रभाव:
- ${secondarySavHi}

फलादेश-सार (${meta.areaHi}):
यह निष्कर्ष भावेश, उसकी राशि-गरिमा, नक्षत्र/अवस्था, भाव में स्थित ग्रह, दृष्टियों, कर्तरी और सर्वाष्टकवर्ग को साथ देखकर बनाया गया है। अनुकूल और चुनौतीपूर्ण संकेत एक साथ हों तो परिणाम मिश्रित माने जाएं। कोई एक ग्रह, स्कोर या योग अपने-आप किसी घटना, सफलता, विलंब या हानि की गारंटी नहीं देता।`;

    const synthesisEn = `${meta.titleEn}:
Primary Parashari Analysis (Lord, Dignity, Star Lord, Aspects & Yuti):
- Ruled by ${lordPlanet} located in House ${lordH} (${lordPos.dignity}), under ${lordNak.name} Nakshatra (Star Lord: ${lordStarLord}), manifesting in ${lordAvastha.en}. ${combustion.isCombust ? `Combust with Sun within ${combustion.distDeg}°, demanding perseverance for material results. ` : ''}
- Occupants: ${occStrEn}.
- Planetary Aspects: Benefic Aspects — ${beneficAspStrEn}; Malefic Aspects — ${maleficAspStrEn}.
${kartariYoga === 'Papakartari' ? `- ${kartariEn}\n` : kartariYoga === 'Subhakartari' ? `- ${kartariEn}\n` : ''}
Secondary Corroborative Capacity:
- ${secondarySavEn}.

Synthesis (${meta.areaEn}):
This reading combines the house lord’s placement and dignity, nakshatra/avastha, occupants, aspects, Kartari and Sarvashtakavarga. Where supportive and challenging factors coexist, the result should be read as mixed. No single planet, score or yoga guarantees an event, success, delay or loss.`;

    const shiftsInHouse = chalit.shiftedBodies.filter(
      (s) => s.rasiHouse === h || s.chalitHouse === h
    );
    const chalitShiftNoteEn = shiftsInHouse.length
      ? `Chalit note: ${shiftsInHouse.map((s) => `${s.id} (Rasi H${s.rasiHouse} → Chalit H${s.chalitHouse})`).join(', ')}`
      : null;
    const chalitShiftNoteHi = shiftsInHouse.length
      ? `भाव चलित बदलाव: ${shiftsInHouse.map((s) => `${PLANET_HI[s.id] ?? s.id} (राशि ${s.rasiHouse} → चलित ${s.chalitHouse})`).join(', ')}`
      : null;

    return {
      houseNumber: h,
      titleEn: meta.titleEn,
      titleHi: meta.titleHi,
      signIndex,
      signNameEn: signInfo.name,
      signNameHi: SIGN_HI[signIndex],
      lordPlanet,
      lordPlacedHouse: lordPos.rasiHouseNumber,
      lordPlacedSignIndex: lordPos.signIndex,
      lordDignity: lordPos.dignity,
      occupants,
      aspectingPlanets,
      naturalKaraka: meta.karaka,
      karakaDignity: karakaPos.dignity,
      savBindus,
      chalitShiftNoteEn,
      chalitShiftNoteHi,
      score: finalScore,
      verdictEn,
      verdictHi,
      lordReadingEn: rawLordReadingEn,
      lordReadingHi,
      synthesisEn,
      synthesisHi,
      source: 'Brihat Parashara Hora Shastra (Ch. 11–24) · Phaladeepika · Sarvashtakavarga',
      lordNakshatraName: lordNak.name,
      lordPada,
      lordStarLord,
      lordBaladiAvasthaHi: lordAvastha.hi,
      lordBaladiAvasthaEn: lordAvastha.en,
      lordCombust: combustion.isCombust,
      kartariYoga,
      kartariHi,
      kartariEn,
      primaryFactorsHi,
      primaryFactorsEn,
      secondarySavHi,
      secondarySavEn,
    };
  });
}
