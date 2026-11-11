import * as Astronomy from 'astronomy-engine';
import { NAKSHATRAS, NATURAL_FRIENDSHIP, SIGNS } from './constants';
import { computeAyanamsaDeg } from './ephemeris';
import { evaluateParamayusStatus, type ParamayusStatus } from './predictions/paramayus';
import { formatDateDmy, formatLocalDateTimeFromUtc, normalizeDeg } from './time';
import type {
  AyanamsaId,
  ChartData,
  DashaPeriod,
  MatchMakingResult,
  PlanetId,
  SevenPlanetId,
} from './types';
import { buildSignPlacement, getDivisionalSignIndex } from './vargas';

export interface SphutaDetail {
  longitude: number;
  signIndex: number;
  signName: string;
  dms: string;
  d9SignIndex: number;
  d9SignName: string;
  polarityStrong: boolean; // Beeja strongest in Odd signs, Kshetra strongest in Even signs
  beneficSupport: boolean;
  labelEn: string;
  labelHi: string;
}

export interface BeejaKshetraMatchReport {
  primaryRoleNoteEn: string;
  primaryRoleNoteHi: string;
  partnerABeeja: SphutaDetail;
  partnerAKshetra: SphutaDetail;
  partnerBBeeja: SphutaDetail;
  partnerBKshetra: SphutaDetail;
  activeBeejaOwnerName: string;
  activeKshetraOwnerName: string;
  d1AxisLabelEn: string;
  d1AxisLabelHi: string;
  d9AxisLabelEn: string;
  d9AxisLabelHi: string;
  score: number;
  status: 'Strong' | 'Moderate' | 'Attention Needed';
  summaryEn: string;
  summaryHi: string;
  remedyEn: string;
  remedyHi: string;
}

export interface MatchDoshaPoojaItem {
  id: string;
  doshaEn: string;
  doshaHi: string;
  severity: 'High' | 'Moderate' | 'Low' | 'Clear';
  affectedEn: string;
  affectedHi: string;
  poojaNameEn: string;
  poojaNameHi: string;
  mantraAndVidhiEn: string;
  mantraAndVidhiHi: string;
}

export interface VivahaDashaWindow {
  startDate: string;
  endDate: string;
  partnerADasha: string;
  partnerBDasha: string;
  strength: number;
  noteEn: string;
  noteHi: string;
}

export interface SuitableMarriageDate {
  date: string;
  weekdayEn: string;
  weekdayHi: string;
  tithiNameEn: string;
  tithiNameHi: string;
  nakshatraName: string;
  score: number;
  noteEn: string;
  noteHi: string;
}

export interface VivahaTimingReport {
  overlapWindows: VivahaDashaWindow[];
  auspiciousDates: SuitableMarriageDate[];
  overallSummaryEn: string;
  overallSummaryHi: string;
}

export interface SignToSignMatchRow {
  key: string;
  dimensionEn: string;
  dimensionHi: string;
  signAIndex: number;
  signBIndex: number;
  axisDist: number;
  axisLabelEn: string;
  axisLabelHi: string;
  lordshipEn: string;
  lordshipHi: string;
  score: number;
  status: 'Strong' | 'Balanced' | 'Caution';
  insightEn: string;
  insightHi: string;
}

export interface HouseToHouseMatchRow {
  house: number;
  themeEn: string;
  themeHi: string;
  signAIndex: number;
  signBIndex: number;
  lordA: SevenPlanetId;
  lordB: SevenPlanetId;
  occupantsA: string[];
  occupantsB: string[];
  crossFromBInAH: string[];
  crossFromAInBH: string[];
  score: number;
  status: 'Strong' | 'Balanced' | 'Caution';
  readingEn: string;
  readingHi: string;
}

export interface DeepMarriageMatchReport {
  paramayusLocked?: ParamayusStatus;
  beejaKshetra: BeejaKshetraMatchReport | null;
  doshaPoojas: MatchDoshaPoojaItem[];
  vivahaTiming: VivahaTimingReport;
  signMatches: SignToSignMatchRow[];
  houseMatches: HouseToHouseMatchRow[];
}

const BENEFICS = new Set<string>(['Jupiter', 'Venus', 'Mercury', 'Moon']);

const SIGN_NAMES_HI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
];

const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAYS_HI = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];

const PLANET_HI_SHORT: Record<string, string> = {
  Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध',
  Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
};

function pHi(p: string): string {
  return PLANET_HI_SHORT[p] ?? p;
}

function axisScoreAndLabel(signA: number, signB: number): {
  dist: number;
  score: number;
  en: string;
  hi: string;
} {
  const dist = ((signB - signA + 12) % 12) + 1;
  if (dist === 1) return { dist, score: 86, en: '1/1 Same Sign Resonance', hi: '1/1 समान राशि (एक-मन समरसता)' };
  if (dist === 7) return { dist, score: 88, en: '1/7 Samasaptaka Opposition', hi: '1/7 समसप्तक (पूर्ण आकर्षण व पूरकता)' };
  if (dist === 5 || dist === 9) return { dist, score: 93, en: `${dist}/${14 - dist} Navapancham Trine`, hi: `${dist}/${14 - dist} नवपंचम त्रिकोण (अत्यंत शुभ)` };
  if (dist === 3 || dist === 11) return { dist, score: 84, en: `${dist}/${14 - dist} Labha-Sahaja Friendship`, hi: `${dist}/${14 - dist} लाभ-तृतीय मैत्री भाव` };
  if (dist === 4 || dist === 10) return { dist, score: 75, en: `${dist}/${14 - dist} Kendra Action Balance`, hi: `${dist}/${14 - dist} चतुर्थ-दशम केंद्र संतुलन` };
  if (dist === 6 || dist === 8) return { dist, score: 48, en: `${dist}/${14 - dist} Shadashtaka Tension`, hi: `${dist}/${14 - dist} षडाष्टक (धैर्य व समन्वय आवश्यक)` };
  return { dist, score: 56, en: `${dist}/${14 - dist} Dwirdwadasha Adjustment`, hi: `${dist}/${14 - dist} द्विर्द्वादश (सामंजस्य आवश्यक)` };
}

function lordshipPair(lordA: SevenPlanetId, lordB: SevenPlanetId): { en: string; hi: string; bonus: number } {
  if (lordA === lordB) return { en: `Shared Lord (${lordA})`, hi: `समान स्वामी (${pHi(lordA)})`, bonus: 8 };
  const f1 = NATURAL_FRIENDSHIP[lordA][lordB];
  const f2 = NATURAL_FRIENDSHIP[lordB][lordA];
  const sum = f1 + f2;
  if (sum >= 2) return { en: `Mutual Friends (${lordA}–${lordB})`, hi: `परस्पर मित्र (${pHi(lordA)}–${pHi(lordB)})`, bonus: 8 };
  if (sum === 1) return { en: `Friendly Neutral (${lordA}–${lordB})`, hi: `मित्र-सम संबंध (${pHi(lordA)}–${pHi(lordB)})`, bonus: 4 };
  if (sum === 0) return { en: `Balanced / Neutral (${lordA}–${lordB})`, hi: `सम / संतुलित (${pHi(lordA)}–${pHi(lordB)})`, bonus: 0 };
  return { en: `Contrasting Nature (${lordA}–${lordB})`, hi: `भिन्न प्रकृति (${pHi(lordA)}–${pHi(lordB)})`, bonus: -7 };
}

function computeSingleSphuta(chart: ChartData, kind: 'beeja' | 'kshetra'): SphutaDetail {
  const sun = chart.planets.find((p) => p.id === 'Sun')!;
  const moon = chart.planets.find((p) => p.id === 'Moon')!;
  const mars = chart.planets.find((p) => p.id === 'Mars')!;
  const jupiter = chart.planets.find((p) => p.id === 'Jupiter')!;
  const venus = chart.planets.find((p) => p.id === 'Venus')!;

  const lon =
    kind === 'beeja'
      ? normalizeDeg(sun.longitude + venus.longitude + jupiter.longitude)
      : normalizeDeg(moon.longitude + mars.longitude + jupiter.longitude);

  const pl = buildSignPlacement(lon);
  const d9SignIndex = getDivisionalSignIndex(lon, 'D9');
  const signOdd = pl.signIndex % 2 === 0; // Aries(0)=Odd, Taurus(1)=Even
  const d9Odd = d9SignIndex % 2 === 0;

  const polarityStrong =
    kind === 'beeja' ? signOdd && d9Odd : !signOdd && !d9Odd;
  const partialPolarity =
    kind === 'beeja' ? signOdd || d9Odd : !signOdd || !d9Odd;

  // Check natural benefic association or trine/7th Jupiter glance in D1
  const sameSignBenefic = chart.planets.some((p) => BENEFICS.has(p.id) && p.signIndex === pl.signIndex);
  const jupDist = ((pl.signIndex - jupiter.signIndex + 12) % 12) + 1;
  const jupAspect = [1, 5, 7, 9].includes(jupDist);
  const beneficSupport = sameSignBenefic || jupAspect;

  const expectedEn = kind === 'beeja' ? 'Odd sign / D9' : 'Even sign / D9';
  const expectedHi = kind === 'beeja' ? 'विषम राशि / नवांश' : 'सम राशि / नवांश';

  return {
    longitude: lon,
    signIndex: pl.signIndex,
    signName: pl.signName,
    dms: pl.shortDms,
    d9SignIndex,
    d9SignName: SIGNS[d9SignIndex].name,
    polarityStrong: polarityStrong || (partialPolarity && beneficSupport),
    beneficSupport,
    labelEn: `${pl.signName} ${pl.shortDms} (D9: ${SIGNS[d9SignIndex].name}) · ${
      polarityStrong ? `Strong (${expectedEn})` : partialPolarity ? 'Balanced' : `Needs Progeny Care (${expectedEn})`
    }${beneficSupport ? ' · Jupiter/Benefic Blessed' : ''}`,
    labelHi: `${SIGN_NAMES_HI[pl.signIndex]} ${pl.shortDms} (D9: ${SIGN_NAMES_HI[d9SignIndex]}) · ${
      polarityStrong ? `बली (${expectedHi})` : partialPolarity ? 'मध्यम' : `संतान शुभत्व पोषणीय (${expectedHi})`
    }${beneficSupport ? ' · गुरु/शुभ दृष्टि प्राप्त' : ''}`,
  };
}

export function matchBeejaKshetraSphuta(
  partnerA: ChartData,
  partnerB: ChartData
): BeejaKshetraMatchReport {
  const aBeeja = computeSingleSphuta(partnerA, 'beeja');
  const aKshetra = computeSingleSphuta(partnerA, 'kshetra');
  const bBeeja = computeSingleSphuta(partnerB, 'beeja');
  const bKshetra = computeSingleSphuta(partnerB, 'kshetra');

  // Auto-align roles if gender set cleanly (e.g. A=male & B=female -> A's Beeja + B's Kshetra; else A=Bride Kshetra + B=Groom Beeja)
  const aIsMaleAndBNotMale =
    partnerA.input.gender === 'male' && partnerB.input.gender !== 'male';
  const activeBeeja = aIsMaleAndBNotMale ? aBeeja : bBeeja;
  const activeKshetra = aIsMaleAndBNotMale ? bKshetra : aKshetra;
  const activeBeejaOwnerName = aIsMaleAndBNotMale ? partnerA.input.name : partnerB.input.name;
  const activeKshetraOwnerName = aIsMaleAndBNotMale ? partnerB.input.name : partnerA.input.name;

  const d1Ax = axisScoreAndLabel(activeKshetra.signIndex, activeBeeja.signIndex);
  const d9Ax = axisScoreAndLabel(activeKshetra.d9SignIndex, activeBeeja.d9SignIndex);

  let raw = d1Ax.score * 0.4 + d9Ax.score * 0.35;
  raw += (activeBeeja.polarityStrong ? 14 : 6) + (activeKshetra.polarityStrong ? 14 : 6);
  if (activeBeeja.beneficSupport) raw += 4;
  if (activeKshetra.beneficSupport) raw += 4;

  const score = Math.max(30, Math.min(98, Math.round(raw)));
  const status: BeejaKshetraMatchReport['status'] =
    score >= 74 ? 'Strong' : score >= 58 ? 'Moderate' : 'Attention Needed';

  const summaryEn = `Evaluating ${activeBeejaOwnerName}'s Beeja Sphuta (${activeBeeja.signName} / D9 ${activeBeeja.d9SignName}) with ${activeKshetraOwnerName}'s Kshetra Sphuta (${activeKshetra.signName} / D9 ${activeKshetra.d9SignName}): D1 forms ${d1Ax.en} and D9 forms ${d9Ax.en}. Score: ${score}/100.`;
  const summaryHi = `${activeBeejaOwnerName} के बीज स्फुट (${SIGN_NAMES_HI[activeBeeja.signIndex]} / D9 ${SIGN_NAMES_HI[activeBeeja.d9SignIndex]}) और ${activeKshetraOwnerName} के क्षेत्र स्फुट (${SIGN_NAMES_HI[activeKshetra.signIndex]} / D9 ${SIGN_NAMES_HI[activeKshetra.d9SignIndex]}) का मिलान: D1 में "${d1Ax.hi}" व D9 में "${d9Ax.hi}" बनता है। संतान स्फुट बल: ${score}/100।`;

  const remedyEn =
    score >= 72
      ? 'Strong natural progeny synergy. Standard Santan-Sukha blessings via Thursday Vishnu worship keep lineage harmony bright.'
      : 'Perform Santan Gopal Stotra Path (or 108x "Om Devakisut Govinda..." daily), Harivamsha Shravana, and Thursday yellow banana/tulsi charity for progeny bliss.';
  const remedyHi =
    score >= 72
      ? 'संतान एवं गर्भ स्फुट समन्वय उत्तम है। गुरुवार को श्रीविष्णु व केला-तुलसी पूजन संतान सुख को और सुदृढ़ रखेगा।'
      : 'बीज/क्षेत्र स्फुट पोषण हेतु संतान गोपाल स्तोत्र पाठ (108 बार मंत्र जप), हरिवंश पुराण श्रवण एवं गुरुवार पीले फल-वस्त्र का दान अत्यंत फलदायी है।';

  return {
    primaryRoleNoteEn: `Beeja Sphuta evaluated for ${activeBeejaOwnerName}; Kshetra Sphuta evaluated for ${activeKshetraOwnerName}.`,
    primaryRoleNoteHi: `बीज स्फुट (${activeBeejaOwnerName}) एवं क्षेत्र स्फुट (${activeKshetraOwnerName}) के आधार पर संतान मिलान।`,
    partnerABeeja: aBeeja,
    partnerAKshetra: aKshetra,
    partnerBBeeja: bBeeja,
    partnerBKshetra: bKshetra,
    activeBeejaOwnerName,
    activeKshetraOwnerName,
    d1AxisLabelEn: d1Ax.en,
    d1AxisLabelHi: d1Ax.hi,
    d9AxisLabelEn: d9Ax.en,
    d9AxisLabelHi: d9Ax.hi,
    score,
    status,
    summaryEn,
    summaryHi,
    remedyEn,
    remedyHi,
  };
}

export function evaluateMatchDoshasAndPoojas(
  partnerA: ChartData,
  partnerB: ChartData,
  match: MatchMakingResult,
  sphuta: BeejaKshetraMatchReport
): MatchDoshaPoojaItem[] {
  const items: MatchDoshaPoojaItem[] = [];

  // 1. Manglik / Kuja Dosha
  const manglikMismatch = match.brideManglik.isManglik !== match.groomManglik.isManglik;
  const bothMildOrHigh = match.brideManglik.isManglik || match.groomManglik.isManglik;
  if (manglikMismatch) {
    const affectedName = match.brideManglik.isManglik ? partnerA.input.name : partnerB.input.name;
    items.push({
      id: 'manglik_dosha',
      doshaEn: 'Asymmetrical Manglik / Kuja Dosha (One Partner Only)',
      doshaHi: 'एकल / असमान मांगलिक दोष (केवल एक साथी में मंगल दोष)',
      severity: 'High',
      affectedEn: `${affectedName} carries Lagna Kuja Dosha (${match.brideManglik.isManglik ? match.brideManglik.note : match.groomManglik.note})`,
      affectedHi: `${affectedName} की कुंडली में लग्न मांगलिक दोष उपस्थित है।`,
      poojaNameEn: 'Kumbha Vivaha / Ark Vivaha + Mangal Bhat Puja',
      poojaNameHi: 'कुंभ विवाह / अर्क विवाह एवं मंगल भात पूजा (उज्जैन मंगलनाथ विधि)',
      mantraAndVidhiEn: 'Before actual Vivaha, perform traditional Kumbha Vivaha (for female) or Ark Vivaha (for male) alongside Mangal Chandika Stotra & Tuesday Hanuman Chalisa + red lentil (Masoor) dan.',
      mantraAndVidhiHi: 'विवाह से पूर्व शास्त्रीय कुंभ विवाह (कन्या हेतु) अथवा अर्क विवाह (वर हेतु), मंगलनाथ भात पूजा, 11,000 भौम मंत्र जप व मंगलवार हनुमान चालीसा पाठ करें।',
    });
  } else if (bothMildOrHigh) {
    items.push({
      id: 'manglik_balanced',
      doshaEn: 'Mutual Manglik Balance (Both Partners Manglik)',
      doshaHi: 'सम-मांगलिक योग (दोनों कुंडलियों में मंगल संतुलित)',
      severity: 'Low',
      affectedEn: 'Both charts carry Mars in sensitive houses — mutual cancellation weakens negative friction.',
      affectedHi: 'दोनों साथियों में मंगल प्रभाव होने से परस्पर परिहार (शांति) हो रही है।',
      poojaNameEn: 'Mangal-Gauri Stotra & Tuesday Sweet Prasaad Offering',
      poojaNameHi: 'मंगल-गौरी पूजन व हनुमान मंदिर में सिंदूर-गुड़ अर्पण',
      mantraAndVidhiEn: 'Chant "Om Angarakaya Namah" (108x) on Tuesdays and begin married life with calm conflict communication.',
      mantraAndVidhiHi: 'मंगलवार को "ॐ अं अंगारकाय नमः" का जप व गुड़-चने का प्रसाद वितरण शुभ फल देता है।',
    });
  }

  // 2. Nadi Dosha
  const nadiKoota = match.kootas.find((k) => k.name === 'Nadi');
  if (nadiKoota && nadiKoota.obtainedPoints < 8) {
    const isFullDosha = nadiKoota.obtainedPoints === 0;
    items.push({
      id: 'nadi_dosha',
      doshaEn: isFullDosha ? 'Full Nadi Dosha (0/8 — Same Nadi)' : 'Partial Nadi Overlap (4/8)',
      doshaHi: isFullDosha ? 'पूर्ण नाड़ी दोष (0/8 — एक ही नाड़ी)' : 'आंशिक नाड़ी मिलान (4/8)',
      severity: isFullDosha ? 'High' : 'Moderate',
      affectedEn: `${partnerA.input.name} (${nadiKoota.brideValue}) ↔ ${partnerB.input.name} (${nadiKoota.groomValue})`,
      affectedHi: `${partnerA.input.name} (${nadiKoota.brideValue}) ↔ ${partnerB.input.name} (${nadiKoota.groomValue})`,
      poojaNameEn: 'Maha Mrityunjaya Japa, Swarna-Nadi & Anna-Daan',
      poojaNameHi: 'महामृत्युंजय मंत्र अनुष्ठान (11,000+ जप), स्वर्ण-नाड़ी व सप्तधान्य अन्नदान',
      mantraAndVidhiEn: 'Perform Maha Mrityunjaya Havan + Swarna-Nadi charity & food distribution (Annadanam) before Vivaha; recommended medical compatibility screening too.',
      mantraAndVidhiHi: 'विवाह से पूर्व सवा लाख / 11,000 महामृत्युंजय जप, स्वर्ण-सर्प/नाड़ी दान, सप्तधान्य व गाय दान कराएँ तथा आधुनिक स्वास्थ्य जाँच भी कर लें।',
    });
  }

  // 3. Bhakoot Dosha
  const bhakootKoota = match.kootas.find((k) => k.name === 'Bhakoot');
  if (bhakootKoota && bhakootKoota.obtainedPoints === 0) {
    items.push({
      id: 'bhakoot_dosha',
      doshaEn: 'Bhakoot Dosha (0/7 — Rashi 6/8 or 2/12 Tension)',
      doshaHi: 'भकूट दोष (0/7 — चंद्र राशि षडाष्टक/द्विर्द्वादश)',
      severity: 'Moderate',
      affectedEn: `${bhakootKoota.brideValue} vs ${bhakootKoota.groomValue}`,
      affectedHi: `${bhakootKoota.brideValue} बनाम ${bhakootKoota.groomValue}`,
      poojaNameEn: 'Gauri-Shankar Rudrabhishek & Chandra-Shukra Shanti',
      poojaNameHi: 'गौरी-शंकर रुद्राभिषेक व चंद्र-शुक्र शांति पूजा',
      mantraAndVidhiEn: 'Jointly perform Gauri-Shankar Rudrabhishek on an auspicious Monday & offer white kheer/milk to Shiva Linga.',
      mantraAndVidhiHi: 'शुभ सोमवार को दोनों साथ मिलकर गौरी-शंकर रुद्राभिषेक व चंद्र-शुक्र मंत्र हवन करें, तथा चावल-दूध का दान करें।',
    });
  }

  // 4. Gana Dosha
  const ganaKoota = match.kootas.find((k) => k.name === 'Gana');
  if (ganaKoota && ganaKoota.obtainedPoints <= 1) {
    items.push({
      id: 'gana_dosha',
      doshaEn: 'Gana Maitri Clash (Temperament Difference)',
      doshaHi: 'गण दोष (स्वभाव एवं प्रतिक्रिया में भिन्नता)',
      severity: 'Moderate',
      affectedEn: `${ganaKoota.brideValue} vs ${ganaKoota.groomValue}`,
      affectedHi: `${ganaKoota.brideValue} बनाम ${ganaKoota.groomValue}`,
      poojaNameEn: 'Ganapati-Gauri Vivaha Archana & Uma-Maheshwara Puja',
      poojaNameHi: 'उमा-महेश्वर एवं गणपति-गौरी पूजन',
      mantraAndVidhiEn: 'Chant "Om Uma Maheshwarabhyam Namah" and sponsor a temple Uma-Maheshwara Abhishek prior to engagement.',
      mantraAndVidhiHi: 'सगाई/विवाह पूर्व उमा-महेश्वर अभिषेक एवं "ॐ उमा महेश्वराभ्यां नमः" का जप पारिवारिक सौहार्द बढ़ाता है।',
    });
  }

  // 5. Papa Samyam Imbalance
  if (match.papaSamyam.status === 'Asymmetric') {
    items.push({
      id: 'papa_samyam',
      doshaEn: 'Asymmetric Papa-Samyam Malefic Weight',
      doshaHi: 'असमान पापांश (शनि/राहु/मंगल भार अंतर)',
      severity: 'Moderate',
      affectedEn: `${match.papaSamyam.bridePapaPoints} pts vs ${match.papaSamyam.groomPapaPoints} pts`,
      affectedHi: `${match.papaSamyam.bridePapaPoints} बनाम ${match.papaSamyam.groomPapaPoints} पापांश`,
      poojaNameEn: 'Navagraha Shanti Havan (Saturn-Rahu Pacification)',
      poojaNameHi: 'नवग्रह शांति हवन (शनि-राहु एवं अरिष्ट निवारण)',
      mantraAndVidhiEn: 'Perform Navagraha Shanti Havan before wedding ceremonies & feed crows/dogs on Saturdays.',
      mantraAndVidhiHi: 'विवाह मंडप से पूर्व नवग्रह शांति हवन कराएँ एवं शनिवार को काले तिल व अन्न का दान करें।',
    });
  }

  // 6. Beeja / Kshetra Sphuta Progeny Caution
  if (sphuta.score < 62) {
    items.push({
      id: 'sphuta_dosha',
      doshaEn: 'Beeja–Kshetra Sphuta Progeny Support Needed',
      doshaHi: 'बीज-क्षेत्र स्फुट पोषण एवं संतान बाधा निवारण',
      severity: 'Moderate',
      affectedEn: `${sphuta.d1AxisLabelEn} · Score ${sphuta.score}/100`,
      affectedHi: `${sphuta.d1AxisLabelHi} · स्कोर ${sphuta.score}/100`,
      poojaNameEn: 'Santan Gopal Anushthan & Harivamsha Parayana',
      poojaNameHi: 'संतान गोपाल मंत्र अनुष्ठान व हरिवंश पुराण कथा',
      mantraAndVidhiEn: sphuta.remedyEn,
      mantraAndVidhiHi: sphuta.remedyHi,
    });
  }

  if (items.length === 0) {
    items.push({
      id: 'no_dosha',
      doshaEn: 'No Major Matching Dosha Detected',
      doshaHi: 'कोई प्रमुख मिलान दोष नहीं (निर्मल मिलान)',
      severity: 'Clear',
      affectedEn: 'Manglik, Nadi, Bhakoot, Gana & Sphuta harmony remain supportive.',
      affectedHi: 'मांगलिक, नाड़ी, भकूट, गण एवं संतान स्फुट सभी अनुकूल व निर्दोष हैं।',
      poojaNameEn: 'Ganapati-Ambika Pujan, Kuldevata Darshan & Vivaha Sankalpa',
      poojaNameHi: 'गणपति-अंबिका पूजन, कुलदेवता वंदना एवं शुभ मंगल कलश स्थापना',
      mantraAndVidhiEn: 'No special Dosha pacification puja is needed; proceed happily with traditional Ganapati & Kuldevata worship.',
      mantraAndVidhiHi: 'किसी विशेष दोष-शांति पूजा की आवश्यकता नहीं; पारंपरिक गणेश-गौरी पूजन व कुलदेवता आशीर्वाद के साथ विवाह संपन्न करें।',
    });
  }

  return items;
}

function getMarriageActivatingLords(chart: ChartData): Set<SevenPlanetId> {
  const lords = new Set<SevenPlanetId>(['Venus', 'Jupiter']);
  const h1 = chart.ascendant.signIndex;
  const h7Sign = (h1 + 6) % 12;
  const h2Sign = (h1 + 1) % 12;
  const h11Sign = (h1 + 10) % 12;
  const h5Sign = (h1 + 4) % 12;
  const d9H7Sign = (chart.divisionalCharts.D9.lagnaSignIndex + 6) % 12;

  lords.add(SIGNS[h7Sign].lord);
  lords.add(SIGNS[h2Sign].lord);
  lords.add(SIGNS[h11Sign].lord);
  lords.add(SIGNS[h5Sign].lord);
  lords.add(SIGNS[d9H7Sign].lord);

  for (const p of chart.planets) {
    if (
      [2, 5, 7, 11].includes(p.rasiHouseNumber) &&
      ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].includes(p.id)
    ) {
      lords.add(p.id as SevenPlanetId);
    }
  }
  return lords;
}

interface FlatAdSpan {
  md: string;
  ad: string;
  startMs: number;
  endMs: number;
}

function flattenAntardashas(mdList: DashaPeriod[]): FlatAdSpan[] {
  const spans: FlatAdSpan[] = [];
  for (const md of mdList) {
    for (const ad of md.children ?? []) {
      spans.push({
        md: md.lord,
        ad: ad.lord,
        startMs: ad.startMs,
        endMs: ad.endMs,
      });
    }
  }
  return spans;
}

const TITHI_NAMES_15 = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya',
];

const TITHI_HI_15 = [
  'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी',
  'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
  'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा/अमावस्या',
];

const GOOD_VIVAHA_TITHIS = new Set([2, 3, 5, 7, 10, 11, 12, 13]);
const GOOD_VIVAHA_NAKSHATRAS = new Set([3, 4, 9, 11, 12, 14, 16, 18, 20, 25, 26]); // Rohini, Mrig, Magha, U.Phal, Hasta, Swati, Anuradha, Mula, U.Ash, U.Bhadra, Revati
const BAD_TARAS = new Set([2, 4, 6]); // Vipat, Pratyak, Naidhana (0-indexed)

function siderealPlanetLongitude(
  body: Astronomy.Body,
  time: Astronomy.AstroTime,
  ayanamsa: AyanamsaId
): number {
  const aya = computeAyanamsaDeg(time, ayanamsa);
  const trop = Astronomy.EclipticGeoMoon(time);
  if (body === Astronomy.Body.Moon) {
    return normalizeDeg(trop.lon - aya);
  }
  const vec = Astronomy.GeoVector(body, time, true);
  const ec = Astronomy.Ecliptic(vec);
  return normalizeDeg(ec.elon - aya);
}

export function computeVivahaTiming(
  partnerA: ChartData,
  partnerB: ChartData,
  fromDateStr?: string
): VivahaTimingReport {
  const baseDateStr = fromDateStr || new Date().toISOString().slice(0, 10);
  const [yr, mo, dy] = baseDateStr.split('-').map((n) => parseInt(n, 10));
  const startScanMs = Date.UTC(yr, mo - 1, dy, 6, 30, 0); // 12:00 PM IST approx
  const tenYrsEndMs = startScanMs + 8 * 365.2425 * 86_400_000;

  // 1. Overlapping Couple Marriage-Activating Dasha Windows
  const lordsA = getMarriageActivatingLords(partnerA);
  const lordsB = getMarriageActivatingLords(partnerB);
  const isVivahaDasha = (span: FlatAdSpan, fav: Set<SevenPlanetId>) =>
    fav.has(span.md as SevenPlanetId) || fav.has(span.ad as SevenPlanetId) || span.md === 'Rahu' || span.ad === 'Rahu';

  const allAdsA = flattenAntardashas(partnerA.vimshottari).filter((s) => isVivahaDasha(s, lordsA));
  const allAdsB = flattenAntardashas(partnerB.vimshottari).filter((s) => isVivahaDasha(s, lordsB));

  const collectOverlaps = (winStart: number, winEnd: number): VivahaDashaWindow[] => {
    const out: VivahaDashaWindow[] = [];
    const spanA = allAdsA.filter((s) => s.endMs > winStart && s.startMs < winEnd);
    const spanB = allAdsB.filter((s) => s.endMs > winStart && s.startMs < winEnd);
    for (const a of spanA) {
      for (const b of spanB) {
        const ovStart = Math.max(a.startMs, b.startMs, winStart);
        const ovEnd = Math.min(a.endMs, b.endMs, winEnd);
        if (ovEnd - ovStart < 35 * 86_400_000) continue; // at least 35 days overlap

        const bothActive =
          (lordsA.has(a.md as SevenPlanetId) && lordsA.has(a.ad as SevenPlanetId) ? 2 : 1) +
          (lordsB.has(b.md as SevenPlanetId) && lordsB.has(b.ad as SevenPlanetId) ? 2 : 1);
        const strength = Math.min(98, 66 + bothActive * 8);

        const sDate = formatLocalDateTimeFromUtc(ovStart, partnerA.offsetMinutesUsed).slice(0, 10);
        const eDate = formatLocalDateTimeFromUtc(ovEnd, partnerA.offsetMinutesUsed).slice(0, 10);
        out.push({
          startDate: sDate,
          endDate: eDate,
          partnerADasha: `${a.md}–${a.ad}`,
          partnerBDasha: `${b.md}–${b.ad}`,
          strength,
          noteEn: `Dual H7/D9/Venus activation for ${partnerA.input.name} (${a.md}–${a.ad}) & ${partnerB.input.name} (${b.md}–${b.ad}).`,
          noteHi: `${partnerA.input.name} (${pHi(a.md)}–${pHi(a.ad)}) व ${partnerB.input.name} (${pHi(b.md)}–${pHi(b.ad)}) की संयुक्त विवाह दशा सक्रिय।`,
        });
      }
    }
    return out;
  };

  let rawWindows = collectOverlaps(startScanMs, tenYrsEndMs);
  if (rawWindows.length === 0 && allAdsA.length > 0 && allAdsB.length > 0) {
    // Fallback for charts whose 120-year Vimshottari span ended before fromDateStr
    const overlapBirthEnd = Math.min(allAdsA[allAdsA.length - 1].endMs, allAdsB[allAdsB.length - 1].endMs);
    const adultStart = Math.max(allAdsA[0].startMs, allAdsB[0].startMs) + 18 * 365.2425 * 86_400_000;
    if (overlapBirthEnd > adultStart) {
      rawWindows = collectOverlaps(adultStart, Math.min(overlapBirthEnd, adultStart + 25 * 365.2425 * 86_400_000));
    } else {
      const ovS = Math.max(allAdsA[0].startMs, allAdsB[0].startMs);
      if (overlapBirthEnd > ovS) rawWindows = collectOverlaps(ovS, overlapBirthEnd);
    }
  }

  rawWindows.sort((x, y) => x.startDate.localeCompare(y.startDate));
  const overlapWindows = rawWindows.slice(0, 6);

  // 2. Concrete Personalized Auspicious Vivaha Muhurta Dates (18-month daily scan)
  const moonNakA = partnerA.planets.find((p) => p.id === 'Moon')!.nakshatraIndex;
  const moonNakB = partnerB.planets.find((p) => p.id === 'Moon')!.nakshatraIndex;
  const moonSignA = partnerA.planets.find((p) => p.id === 'Moon')!.signIndex;
  const moonSignB = partnerB.planets.find((p) => p.id === 'Moon')!.signIndex;

  const ayanamsa = partnerA.settings.ayanamsa;
  const datesFound: SuitableMarriageDate[] = [];

  for (let d = 1; d <= 540 && datesFound.length < 18; d++) {
    const dayMs = startScanMs + d * 86_400_000;
    const dt = new Date(dayMs);
    const t = new Astronomy.AstroTime(dt);

    const sunTrop = Astronomy.SunPosition(t).elon;
    const aya = computeAyanamsaDeg(t, ayanamsa);
    const sunSid = normalizeDeg(sunTrop - aya);
    const sunSign = Math.floor(sunSid / 30) % 12;

    // Exclude Kharmas (Dhanu 8 and Meena 11)
    if (sunSign === 8 || sunSign === 11) continue;

    // Exclude Guru & Shukra Combustion (Moudhya: within 11° Jupiter / 10° Venus of Sun)
    const jupSid = siderealPlanetLongitude(Astronomy.Body.Jupiter, t, ayanamsa);
    const venSid = siderealPlanetLongitude(Astronomy.Body.Venus, t, ayanamsa);
    const sepJup = Math.abs(((jupSid - sunSid + 540) % 360) - 180);
    const sepVen = Math.abs(((venSid - sunSid + 540) % 360) - 180);
    if (sepJup < 11 || sepVen < 10) continue;

    const moonTrop = Astronomy.EclipticGeoMoon(t).lon;
    const moonSid = normalizeDeg(moonTrop - aya);
    const nakIdx = Math.floor(moonSid / (360 / 27)) % 27;
    if (!GOOD_VIVAHA_NAKSHATRAS.has(nakIdx)) continue;

    const sunMoonAngle = normalizeDeg(moonTrop - sunTrop);
    const tithiNum = Math.floor(sunMoonAngle / 12) + 1; // 1..30
    const lunarDay15 = ((tithiNum - 1) % 15) + 1;
    const paksha = tithiNum <= 15 ? 'Shukla' : 'Krishna';
    if (paksha === 'Shukla' && !GOOD_VIVAHA_TITHIS.has(lunarDay15)) continue;
    if (paksha === 'Krishna' && ![2, 3, 5, 7].includes(lunarDay15)) continue;

    // Personal Dual Tarabala & Chandrabala filter
    const taraA = ((nakIdx - moonNakA + 27) % 27) % 9;
    const taraB = ((nakIdx - moonNakB + 27) % 27) % 9;
    if (BAD_TARAS.has(taraA) || BAD_TARAS.has(taraB)) continue;

    const mSign = Math.floor(moonSid / 30) % 12;
    const chA = ((mSign - moonSignA + 12) % 12) + 1;
    const chB = ((mSign - moonSignB + 12) % 12) + 1;
    if ([4, 8, 12].includes(chA) || [4, 8, 12].includes(chB)) continue;

    const wd = dt.getUTCDay();
    const auspiciousDayBonus = [1, 3, 4, 5].includes(wd) ? 8 : 0; // Mon, Wed, Thu, Fri best for Vivaha
    const chaturmasPenalty = [3, 4, 5, 6].includes(sunSign) ? -12 : 6; // Ashadha..Kartika Chaturmas notice

    // Avoid Chaturmas (sunSign Cancer=3, Leo=4, Virgo=5, Libra=6) for main Vivaha Muhurtas
    if (sunSign >= 3 && sunSign <= 6) continue;

    const score = Math.min(98, 76 + auspiciousDayBonus + chaturmasPenalty + ([3, 11, 12, 26].includes(nakIdx) ? 6 : 2));
    const dateIso = dt.toISOString().slice(0, 10);
    const tNameEn = `${paksha} ${TITHI_NAMES_15[lunarDay15 - 1]}`;
    const tNameHi = `${paksha === 'Shukla' ? 'शुक्ल' : 'कृष्ण'} ${TITHI_HI_15[lunarDay15 - 1]}`;

    // Skip if within 3 days of previous picked date so list spreads comfortably across months
    if (datesFound.length > 0) {
      const prevMs = Date.parse(`${datesFound[datesFound.length - 1].date}T00:00:00Z`);
      if (dayMs - prevMs < 4 * 86_400_000) continue;
    }

    datesFound.push({
      date: dateIso,
      weekdayEn: WEEKDAYS_EN[wd],
      weekdayHi: WEEKDAYS_HI[wd],
      tithiNameEn: tNameEn,
      tithiNameHi: tNameHi,
      nakshatraName: NAKSHATRAS[nakIdx].name,
      score,
      noteEn: `Dual Tarabala & Chandrabala clean (A:H${chA}, B:H${chB}); Venus & Jupiter un-combust (non-Kharmas/Chaturmas).`,
      noteHi: `दोनों की ताराबल व चंद्रबल शुद्ध (A:भाव${chA}, B:भाव${chB}); शुक्र-गुरु उदय व खरमास/चातुर्मास मुक्त तिथि।`,
    });
  }

  const bestDasha = overlapWindows[0];
  const bestDate = datesFound[0];

  const overallSummaryEn = bestDate
    ? `First strong personalized marriage date starts around ${formatDateDmy(bestDate.date)} (${bestDate.weekdayEn}, ${bestDate.nakshatraName}). ${
        bestDasha
          ? `Joint marriage-activating Dasha period aligns between ${formatDateDmy(bestDasha.startDate)} and ${formatDateDmy(bestDasha.endDate)}.`
          : ''
      }`
    : bestDasha
      ? `Joint marriage-activating Dasha runs from ${formatDateDmy(bestDasha.startDate)} to ${formatDateDmy(bestDasha.endDate)}.`
      : 'Review Dasha timings alongside an Acharya for local Abhijit / Godhuli Lagna confirmation.';

  const overallSummaryHi = bestDate
    ? `दोनों की कुंडली के अनुसार प्रथम उत्तम विवाह मुहूर्त तिथि ${formatDateDmy(bestDate.date)} (${bestDate.weekdayHi}, ${bestDate.nakshatraName} नक्षत्र) है। ${
        bestDasha
          ? `संयुक्त विवाह दशा अवधि ${formatDateDmy(bestDasha.startDate)} से ${formatDateDmy(bestDasha.endDate)} तक प्रबल है।`
          : ''
      }`
    : bestDasha
      ? `संयुक्त विवाह दशा योग ${bestDasha.startDate} से ${bestDasha.endDate} तक बन रहा है।`
      : 'स्थानीय गोधूलि लग्न व आचार्य परामर्श के साथ शुभ तिथि निर्धारित करें।';

  return {
    overlapWindows,
    auspiciousDates: datesFound.slice(0, 12),
    overallSummaryEn,
    overallSummaryHi,
  };
}

const HOUSE_THEMES_12: Array<{ en: string; hi: string }> = [
  { en: 'H1 — Self, Vitality & Personality Harmony', hi: 'भाव 1 — व्यक्तित्व, स्वास्थ्य व आत्म-संतुलन' },
  { en: 'H2 — Family, Speech & Joint Finances', hi: 'भाव 2 — कुटुंब, वाणी व संयुक्त धन कोष' },
  { en: 'H3 — Communication, Courage & Daily Rhythm', hi: 'भाव 3 — संवाद, प्रयास व दैनिक तालमेल' },
  { en: 'H4 — Home Peace, Comforts & Domestic Joy', hi: 'भाव 4 — गृह सुख, मकान-वाहन व माता पक्ष' },
  { en: 'H5 — Romance, Intelligence & Progeny', hi: 'भाव 5 — प्रेम, रचनात्मकता एवं संतान सुख' },
  { en: 'H6 — Conflict Handling, Service & Immunity', hi: 'भाव 6 — विवाद प्रबंधन, ऋण व रोग-प्रतिरोधक शक्ति' },
  { en: 'H7 — Marriage Bond, Devotion & Equal Partnership', hi: 'भाव 7 — दांपत्य बंधन, जीवनसाथी व साझेदारी' },
  { en: 'H8 — Intimacy Depth, Longevity & Shared Legacy', hi: 'भाव 8 — आयुष्य, अंतरंगता व ससुराल-पैतृक सुख' },
  { en: 'H9 — Fortune, Ethics, Dharma & Spiritual Growth', hi: 'भाव 9 — सौभाग्य, धर्म, यात्रा व गुरु कृपा' },
  { en: 'H10 — Career Mutual Support & Social Status', hi: 'भाव 10 — करियर सम्मान व सामाजिक प्रतिष्ठा' },
  { en: 'H11 — Long-Term Gains, Friends & Shared Goals', hi: 'भाव 11 — आय, लाभ, मित्रता व इच्छापूर्ति' },
  { en: 'H12 — Bed Comfort (Shayana Sukha), Rest & Peace', hi: 'भाव 12 — शयन सुख, विश्राम, विदेश व मोक्ष' },
];

export function computeSignAndHouseMatching(
  partnerA: ChartData,
  partnerB: ChartData
): { signMatches: SignToSignMatchRow[]; houseMatches: HouseToHouseMatchRow[] } {
  const getPlanet = (c: ChartData, id: PlanetId) => c.planets.find((p) => p.id === id)!;

  // 1. Sign-to-Sign Rashi Synastry
  const signDefs: Array<{
    key: string;
    dimEn: string;
    dimHi: string;
    sA: number;
    sB: number;
  }> = [
    { key: 'lagna', dimEn: 'Lagna Sign ↔ Lagna Sign', dimHi: 'लग्न राशि ↔ लग्न राशि', sA: partnerA.ascendant.signIndex, sB: partnerB.ascendant.signIndex },
    { key: 'moon', dimEn: 'Moon Rashi ↔ Moon Rashi', dimHi: 'चंद्र राशि ↔ चंद्र राशि', sA: getPlanet(partnerA, 'Moon').signIndex, sB: getPlanet(partnerB, 'Moon').signIndex },
    { key: 'sun', dimEn: 'Sun Sign ↔ Sun Sign', dimHi: 'सूर्य राशि ↔ सूर्य राशि', sA: getPlanet(partnerA, 'Sun').signIndex, sB: getPlanet(partnerB, 'Sun').signIndex },
    { key: 'venus', dimEn: 'Venus Sign ↔ Venus Sign (Love)', dimHi: 'शुक्र राशि ↔ शुक्र राशि (प्रेम)', sA: getPlanet(partnerA, 'Venus').signIndex, sB: getPlanet(partnerB, 'Venus').signIndex },
    { key: 'mars', dimEn: 'Mars Sign ↔ Mars Sign (Energy)', dimHi: 'मंगल राशि ↔ मंगल राशि (ऊर्जा)', sA: getPlanet(partnerA, 'Mars').signIndex, sB: getPlanet(partnerB, 'Mars').signIndex },
    { key: 'jupiter', dimEn: 'Jupiter Sign ↔ Jupiter Sign (Grace)', dimHi: 'गुरु राशि ↔ गुरु राशि (संस्कार/संतान)', sA: getPlanet(partnerA, 'Jupiter').signIndex, sB: getPlanet(partnerB, 'Jupiter').signIndex },
    { key: 'd9_lagna', dimEn: 'D9 Navamsa Lagna ↔ D9 Lagna', dimHi: 'D9 नवांश लग्न ↔ D9 नवांश लग्न', sA: partnerA.divisionalCharts.D9.lagnaSignIndex, sB: partnerB.divisionalCharts.D9.lagnaSignIndex },
  ];

  const signMatches: SignToSignMatchRow[] = signDefs.map((row) => {
    const ax = axisScoreAndLabel(row.sA, row.sB);
    const lA = SIGNS[row.sA].lord;
    const lB = SIGNS[row.sB].lord;
    const lord = lordshipPair(lA, lB);
    const sameElement = SIGNS[row.sA].element === SIGNS[row.sB].element;
    const score = Math.max(30, Math.min(98, Math.round(ax.score + lord.bonus + (sameElement ? 4 : 0))));
    const status: SignToSignMatchRow['status'] =
      score >= 76 ? 'Strong' : score >= 58 ? 'Balanced' : 'Caution';

    return {
      key: row.key,
      dimensionEn: row.dimEn,
      dimensionHi: row.dimHi,
      signAIndex: row.sA,
      signBIndex: row.sB,
      axisDist: ax.dist,
      axisLabelEn: ax.en,
      axisLabelHi: ax.hi,
      lordshipEn: lord.en,
      lordshipHi: lord.hi,
      score,
      status,
      insightEn: `${SIGNS[row.sA].name} & ${SIGNS[row.sB].name} form ${ax.en} with ${lord.en}${sameElement ? ` (${SIGNS[row.sA].element} element match)` : ''}.`,
      insightHi: `${SIGN_NAMES_HI[row.sA]} व ${SIGN_NAMES_HI[row.sB]} के बीच ${ax.hi} तथा ${lord.hi} संबंध है${sameElement ? ' (समान तत्व)' : ''}।`,
    };
  });

  // 2. House-to-House (H1..H12) Complete Synastry Matrix
  const houseMatches: HouseToHouseMatchRow[] = Array.from({ length: 12 }, (_, idx) => {
    const house = idx + 1;
    const theme = HOUSE_THEMES_12[idx];
    const signAIndex = (partnerA.ascendant.signIndex + idx) % 12;
    const signBIndex = (partnerB.ascendant.signIndex + idx) % 12;
    const lordA = SIGNS[signAIndex].lord;
    const lordB = SIGNS[signBIndex].lord;

    const occA = partnerA.planets.filter((p) => p.rasiHouseNumber === house).map((p) => p.id);
    const occB = partnerB.planets.filter((p) => p.rasiHouseNumber === house).map((p) => p.id);

    // Cross-synastry overlays: Partner B planets falling in signAIndex (= Partner A's House `house`) & vice versa
    const crossBInA = partnerB.planets.filter((p) => p.signIndex === signAIndex).map((p) => p.id);
    const crossAInB = partnerA.planets.filter((p) => p.signIndex === signBIndex).map((p) => p.id);

    const ax = axisScoreAndLabel(signAIndex, signBIndex);
    const lord = lordshipPair(lordA, lordB);

    let crossAdj = 0;
    for (const pid of [...crossBInA, ...crossAInB]) {
      crossAdj += BENEFICS.has(pid) ? 4 : -2;
    }
    const score = Math.max(30, Math.min(98, Math.round(ax.score * 0.72 + 20 + lord.bonus + crossAdj)));
    const status: HouseToHouseMatchRow['status'] =
      score >= 74 ? 'Strong' : score >= 58 ? 'Balanced' : 'Caution';

    const readingEn = `A's H${house} (${SIGNS[signAIndex].name}, Lord ${lordA}) ↔ B's H${house} (${SIGNS[signBIndex].name}, Lord ${lordB}) align on ${ax.en}; ${lord.en}.${
      crossBInA.length || crossAInB.length
        ? ` Cross-overlays trigger shared activation via ${[...crossBInA, ...crossAInB].join(', ')}.`
        : ''
    }`;

    const readingHi = `साथी A का भाव ${house} (${SIGN_NAMES_HI[signAIndex]}, स्वामी ${pHi(lordA)}) ↔ साथी B का भाव ${house} (${SIGN_NAMES_HI[signBIndex]}, स्वामी ${pHi(lordB)}) — ${ax.hi}, ${lord.hi}।${
      crossBInA.length || crossAInB.length
        ? ` परस्पर ग्रह प्रभाव: ${[...crossBInA, ...crossAInB].map(pHi).join(', ')} इस भाव को सक्रिय करते हैं।`
        : ''
    }`;

    return {
      house,
      themeEn: theme.en,
      themeHi: theme.hi,
      signAIndex,
      signBIndex,
      lordA,
      lordB,
      occupantsA: occA,
      occupantsB: occB,
      crossFromBInAH: crossBInA,
      crossFromAInBH: crossAInB,
      score,
      status,
      readingEn,
      readingHi,
    };
  });

  return { signMatches, houseMatches };
}

export function computeDeepMarriageMatch(
  partnerA: ChartData,
  partnerB: ChartData,
  basicMatch: MatchMakingResult,
  fromDateStr?: string
): DeepMarriageMatchReport {
  const pA = evaluateParamayusStatus(partnerA, fromDateStr);
  const pB = evaluateParamayusStatus(partnerB, fromDateStr);
  if (pA.exceeded || pB.exceeded) {
    const lock = pA.exceeded ? pA : pB;
    return {
      paramayusLocked: lock,
      beejaKshetra: null,
      doshaPoojas: [],
      vivahaTiming: {
        overlapWindows: [],
        auspiciousDates: [],
        overallSummaryEn: lock.messageEn,
        overallSummaryHi: lock.messageHi,
      },
      signMatches: [],
      houseMatches: [],
    };
  }

  const beejaKshetra = matchBeejaKshetraSphuta(partnerA, partnerB);
  const doshaPoojas = evaluateMatchDoshasAndPoojas(partnerA, partnerB, basicMatch, beejaKshetra);
  const vivahaTiming = computeVivahaTiming(partnerA, partnerB, fromDateStr);
  const { signMatches, houseMatches } = computeSignAndHouseMatching(partnerA, partnerB);

  return {
    beejaKshetra,
    doshaPoojas,
    vivahaTiming,
    signMatches,
    houseMatches,
  };
}
