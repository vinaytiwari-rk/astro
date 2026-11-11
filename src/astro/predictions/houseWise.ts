import { computeBhavaChalitPlacements } from '../avakahadaChalit';
import { NINE_GRAHAS, SIGNS } from '../constants';
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
  { titleEn: '1st House — Tanu Bhava (Self, Body & Destiny)', titleHi: 'प्रथम भाव — तनु भाव (व्यक्तित्व, स्वास्थ्य एवं जीवन दिशा)', karaka: 'Sun', areaEn: 'health, vitality, confidence and life path', areaHi: 'स्वास्थ्य, आत्मविश्वास, व्यक्तित्व व जीवन-दिशा' },
  { titleEn: '2nd House — Dhana Bhava (Wealth, Speech & Family)', titleHi: 'द्वितीय भाव — धन भाव (संचित धन, वाणी एवं कुटुंब)', karaka: 'Jupiter', areaEn: 'accumulated wealth, speech clarity and family heritage', areaHi: 'संचित धन, वाणी व पारिवारिक सुख' },
  { titleEn: '3rd House — Sahaja Bhava (Courage, Siblings & Skills)', titleHi: 'तृतीय भाव — सहज भाव (पराक्रम, भाई-बहन व संचार)', karaka: 'Mars', areaEn: 'initiative, communication, siblings and self-effort', areaHi: 'साहस, छोटे भाई-बहन, लेखन व स्व-प्रयास' },
  { titleEn: '4th House — Sukha Bhava (Mother, Home & Peace)', titleHi: 'चतुर्थ भाव — सुख भाव (माता, गृह, वाहन एवं मनःशांति)', karaka: 'Moon', areaEn: 'mother, real estate, vehicles and emotional peace', areaHi: 'माता सुख, भूमि-भवन, वाहन व आंतरिक शांति' },
  { titleEn: '5th House — Putra Bhava (Intellect, Progeny & Purva Punya)', titleHi: 'पंचम भाव — पुत्र भाव (शिक्षा, बुद्धि, संतान व प्रेम)', karaka: 'Jupiter', areaEn: 'higher intelligence, romance, children and past merit', areaHi: 'शिक्षा, बुद्धि, संतान, प्रेम व रचनात्मकता' },
  { titleEn: '6th House — Ripu Bhava (Service, Health & Competition)', titleHi: 'षष्ठ भाव — रिपु भाव (रोग-प्रतिरोध, सेवा, ऋण व शत्रु विजय)', karaka: 'Saturn', areaEn: 'daily discipline, recovery from illness and defeating rivals', areaHi: 'नौकरी/सेवा, प्रतिस्पर्धा विजय, स्वास्थ्य व ऋण मुक्ति' },
  { titleEn: '7th House — Kalatra Bhava (Marriage & Partnerships)', titleHi: 'सप्तम भाव — कलत्र भाव (विवाह, जीवनसाथी एवं व्यापार साझेदारी)', karaka: 'Venus', areaEn: 'spouse, marriage harmony, business alliances and public dealing', areaHi: 'विवाह, जीवनसाथी, दांपत्य व व्यापारिक साझेदारी' },
  { titleEn: '8th House — Ayur Bhava (Longevity, Research & Transformation)', titleHi: 'अष्टम भाव — आयु भाव (दीर्घायु, गूढ़ शोध व आकस्मिक परिवर्तन)', karaka: 'Saturn', areaEn: 'resilience, inheritance, research depth and sudden transformations', areaHi: 'आयु, गहन शोध, पैतृक धन व आकस्मिक बदलाव' },
  { titleEn: '9th House — Bhagya Bhava (Fortune, Dharma & Father)', titleHi: 'नवम भाव — भाग्य भाव (भाग्य, धर्म, गुरु, पिता व उच्च यात्रा)', karaka: 'Jupiter', areaEn: 'fortune, father, higher philosophy, pilgrimages and blessings', areaHi: 'भाग्योदय, पिता, धर्म, गुरु कृपा व उच्च शिक्षा/यात्रा' },
  { titleEn: '10th House — Karma Bhava (Career, Authority & Status)', titleHi: 'दशम भाव — कर्म भाव (करियर, पद, प्रशासन एवं सामाजिक प्रतिष्ठा)', karaka: 'Mercury', areaEn: 'vocation, public stature, leadership and lasting achievements', areaHi: 'करियर, व्यवसाय, पद-प्रतिष्ठा व कर्म सिद्धि' },
  { titleEn: '11th House — Labha Bhava (Gains, Network & Desires)', titleHi: 'एकादश भाव — लाभ भाव (नियमित आय, लाभ, मित्र व इच्छा-पूर्ति)', karaka: 'Jupiter', areaEn: 'cashflow gains, influential friendships and fulfilled ambitions', areaHi: 'आर्थिक लाभ, आय के स्रोत, मित्र व मनोकामना पूर्ति' },
  { titleEn: '12th House — Vyaya Bhava (Foreign Lands, Moksha & Expenditure)', titleHi: 'द्वादश भाव — व्यय भाव (विदेश गमन, खर्च, शयन सुख व मोक्ष)', karaka: 'Ketu', areaEn: 'foreign settlement, charity, sleep quality and spiritual liberation', areaHi: 'विदेश यात्रा/वास, खर्च संतुलन, शयन सुख व मोक्ष' },
];

const BENEFICS = new Set<NineGrahaId>(['Jupiter', 'Venus', 'Mercury', 'Moon']);

function scoreDignity(dig: string): number {
  const m: Record<string, number> = {
    Exalted: 18, Moolatrikona: 15, 'Own Sign': 13, 'Great Friend': 9, Friend: 5,
    Neutral: 0, Enemy: -7, 'Great Enemy': -11, Debilitated: -15,
  };
  return m[dig] ?? 0;
}

function getGrahaAspectTargets(planetId: NineGrahaId, fromHouse: number): number[] {
  const step = (offset: number) => ((fromHouse - 1 + offset) % 12) + 1;
  const targets = [step(6)]; // 7th aspect
  if (planetId === 'Mars') targets.push(step(3), step(7)); // 4th & 8th
  if (planetId === 'Jupiter') targets.push(step(4), step(8)); // 5th & 9th
  if (planetId === 'Saturn') targets.push(step(2), step(9)); // 3rd & 10th
  if (planetId === 'Rahu' || planetId === 'Ketu') targets.push(step(4), step(8)); // 5th & 9th
  return targets;
}

export function computeHouseWisePredictions(chart: ChartData): HouseWisePrediction[] {
  const byId = new Map(chart.planets.map((p) => [p.id, p]));
  const ascSign = chart.ascendant.signIndex;
  const chalit = computeBhavaChalitPlacements(chart);

  // Precompute Parashari whole-sign aspects per house
  const aspectMap = new Map<number, NineGrahaId[]>();
  for (let h = 1; h <= 12; h++) aspectMap.set(h, []);
  for (const g of NINE_GRAHAS) {
    const pos = byId.get(g)!;
    for (const targetH of getGrahaAspectTargets(g, pos.rasiHouseNumber)) {
      aspectMap.get(targetH)!.push(g);
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

    const occupants = NINE_GRAHAS.filter((g) => byId.get(g)!.rasiHouseNumber === h);
    const aspectingPlanets = aspectMap.get(h) ?? [];

    // Scoring
    let score = 58 + scoreDignity(lordPos.dignity) * 0.9;
    if ([1, 4, 5, 7, 9, 10, 11].includes(lordPos.rasiHouseNumber)) score += 7;
    if ([6, 8, 12].includes(lordPos.rasiHouseNumber) && ![6, 8, 12].includes(h)) score -= 8;

    score += scoreDignity(karakaPos.dignity) * 0.35;
    if (savBindus >= 30) score += 8;
    else if (savBindus <= 24) score -= 6;

    for (const occ of occupants) {
      if (BENEFICS.has(occ)) score += 6;
      else if (h === 3 || h === 6 || h === 10 || h === 11) score += 4;
      else score -= 4;
    }
    for (const asp of aspectingPlanets) {
      if (BENEFICS.has(asp)) score += 4;
      else score -= 2;
    }

    const finalScore = Math.max(28, Math.min(96, Math.round(score)));
    const verdictEn =
      finalScore >= 76 ? 'Highly Strong' : finalScore >= 60 ? 'Supportive' : finalScore >= 46 ? 'Mixed / Balanced' : 'Requires Attention';
    const verdictHi =
      finalScore >= 76 ? 'अत्यंत बली व शुभ' : finalScore >= 60 ? 'सशक्त एवं अनुकूल' : finalScore >= 46 ? 'मिश्रित / संतुलित' : 'प्रयास व उपाय अपेक्षित';

    const rawLordReadingEn = buildHouseLordReading(
      h,
      lordPos.rasiHouseNumber,
      lordPlanet,
      lordPos.dignity
    ).reading;
    const lordReadingHi = `${h}वें भाव के स्वामी ${PLANET_HI[lordPlanet]} (${DIGNITY_HI[lordPos.dignity] ?? lordPos.dignity}) कुंडली के ${lordPos.rasiHouseNumber}वें भाव (${SIGN_HI[lordPos.signIndex]}) में स्थित हैं — जिससे ${meta.areaHi} के परिणाम ${[6, 8, 12].includes(lordPos.rasiHouseNumber) ? 'संघर्ष व रूपांतरण के बाद परिपक्व होते हैं' : 'सुदृढ़ व प्रत्यक्ष प्रगति प्रदान करते हैं'}।`;

    const shiftsInHouse = chalit.shiftedBodies.filter(
      (s) => s.rasiHouse === h || s.chalitHouse === h
    );
    const chalitShiftNoteEn = shiftsInHouse.length
      ? `Chalit note: ${shiftsInHouse.map((s) => `${s.id} (Rasi H${s.rasiHouse} → Chalit H${s.chalitHouse})`).join(', ')}`
      : null;
    const chalitShiftNoteHi = shiftsInHouse.length
      ? `भाव चलित बदलाव: ${shiftsInHouse.map((s) => `${PLANET_HI[s.id] ?? s.id} (राशि ${s.rasiHouse} → चलित ${s.chalitHouse})`).join(', ')}`
      : null;

    const occStrEn = occupants.length ? occupants.join(', ') : 'Empty (governed cleanly by lord & aspects)';
    const occStrHi = occupants.length
      ? occupants.map((o) => PLANET_HI[o]).join(', ')
      : 'कोई ग्रह नहीं (स्वामी व दृष्टि से फलित)';
    const aspStrEn = aspectingPlanets.length ? aspectingPlanets.join(', ') : 'None';
    const aspStrHi = aspectingPlanets.length ? aspectingPlanets.map((a) => PLANET_HI[a]).join(', ') : 'कोई विशेष दृष्टि नहीं';

    const synthesisEn = `Ruled by ${lordPlanet} (${lordPos.dignity} in H${lordPos.rasiHouseNumber}). Occupants: ${occStrEn}. Aspects: ${aspStrEn}. Karaka ${meta.karaka} is ${karakaPos.dignity}. SAV: ${savBindus} bindus (${savBindus >= 30 ? 'abundant support' : savBindus >= 25 ? 'steady resources' : 'needs mindful building'}). Overall tone for ${meta.areaEn}: ${verdictEn.toLowerCase()}.`;
    const synthesisHi = `स्वामी ${PLANET_HI[lordPlanet]} (${lordPos.rasiHouseNumber}वें भाव में ${DIGNITY_HI[lordPos.dignity]})। स्थित ग्रह: ${occStrHi}। ग्रह दृष्टि: ${aspStrHi}। कारक ${PLANET_HI[meta.karaka]} (${DIGNITY_HI[karakaPos.dignity]}) व सर्वाष्टकवर्ग बल ${savBindus} बिंदु (${savBindus >= 30 ? 'प्रचुर सहयोग' : savBindus >= 25 ? 'संतुलित बल' : 'धैर्य आवश्यक'})।`;

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
      source: 'BPHS Ch. 11–24 · Phaladeepika · Sarvashtakavarga',
    };
  });
}
