import {
  CLASSICAL_VARA_PROFILES,
  CLASSICAL_TITHI_PROFILES,
  CLASSICAL_PRITHU_YASAS_NAVAMSHA,
  CLASSICAL_LUNAR_MAAS_PROFILES,
  CLASSICAL_RITU_PROFILES,
  CLASSICAL_AYANA_PROFILES,
  CLASSICAL_KAAL_PROFILES,
  CLASSICAL_NITYA_YOGAS,
  CLASSICAL_KARANAS,
  CLASSICAL_NAKSHATRAS,
  CLASSICAL_GREGORIAN_MONTHS,
  getTithiVaraYoga,
  getHoraReading,
  type NavamshaLagnaProfile,
  type TithiProfile,
} from './classicalPanchangaNavamshaKb';
import type { ChartData, DivisionalChartId, NineGrahaId, SevenPlanetId } from '../types';
import { NAKSHATRAS, SIGNS } from '../constants';
import { computeCharaKarakas } from '../jaimini';
import { getFunctionalLordship } from './functionalLordship';
import { detectClassicalYogas, type DetectedClassicalYoga } from './classicalYogasKb';

export interface DeepDomainPrediction {
  id: string; titleEn: string; titleHi: string; icon: string;
  /** Internal evidence-balance index, not a probability or event likelihood. */
  score: number;
  ratingEn: 'Excellent' | 'Very Good' | 'Moderate' | 'Challenging';
  ratingHi: 'अति उत्तम' | 'उत्तम' | 'मध्यम' | 'चुनौतीपूर्ण';
  summaryEn: string; summaryHi: string;
  predictionEn: string; predictionHi: string;
  timingWindowEn?: string;
  timingWindowHi?: string;
  concreteEventsEn?: string[];
  concreteEventsHi?: string[];
  keyStrengthsEn: string[]; keyStrengthsHi: string[];
  watchoutsEn: string[]; watchoutsHi: string[];
  astrologicalFactorsEn: string; astrologicalFactorsHi: string;
  classicalAdviceEn: string; classicalAdviceHi: string;
}

export interface GeneralBirthFactor {
  id: string;
  labelEn: string;
  labelHi: string;
  valueEn: string;
  valueHi: string;
  interpretationEn: string;
  interpretationHi: string;
}
export interface GeneralBirthProfile {
  factors: GeneralBirthFactor[];
  summaryEn: string;
  summaryHi: string;
  navamshaLagna?: {
    signIndex: number;
    signNameEn: string;
    signNameHi: string;
    readingEn: string;
    readingHi: string;
    vulnerabilityAges: number[];
    isVargottama: boolean;
    sageWarningEn: string;
    sageWarningHi: string;
  };
  tithiDetails?: {
    tithiNumber: number;
    tithiNameEn: string;
    tithiNameHi: string;
    category: 'Nanda' | 'Bhadra' | 'Jaya' | 'Rikta' | 'Poorna';
    categoryHi: string;
    presidingDeityEn: string;
    presidingDeityHi: string;
    governingNityaDeviEn: string;
    governingNityaDeviHi: string;
    nityaDeviMantra: string;
    combinationYoga?: {
      isAuspicious: boolean;
      combinationTitleEn: string;
      combinationTitleHi: string;
      detailsEn: string;
      detailsHi: string;
      alertType?: 'Daghda' | 'Visha' | 'Hutashan';
    };
  };
  seasonalDetails?: {
    ayanaEn: string;
    ayanaHi: string;
    ayanaReadingEn: string;
    ayanaReadingHi: string;
    maasEn: string;
    maasHi: string;
    isAdhika: boolean;
    maasReadingEn: string;
    maasReadingHi: string;
    rituEn: string;
    rituHi: string;
    rituReadingEn: string;
    rituReadingHi: string;
    kaalEn: string;
    kaalHi: string;
    kaalReadingEn: string;
    kaalReadingHi: string;
    horaEn: string;
    horaHi: string;
    horaReadingEn: string;
    horaReadingHi: string;
    gregorianMonthEn: string;
    gregorianMonthHi: string;
    gregorianReadingEn: string;
    gregorianReadingHi: string;
  };
}

export interface DeepLifePredictionsReport {
  /** Retained for compatibility; never presented as a statistical score. */
  overallLifeScore: number;
  lifeStatureClassEn?: string;
  lifeStatureClassHi?: string;
  lifeStatureMeaningEn?: string;
  lifeStatureMeaningHi?: string;
  peakRiseAgeWindowEn?: string;
  peakRiseAgeWindowHi?: string;
  crisisErasEn?: string[];
  crisisErasHi?: string[];
  karmicMissionEn?: string;
  karmicMissionHi?: string;
  executiveSummaryEn: string; executiveSummaryHi: string;
  domains: DeepDomainPrediction[];
  birthProfile: GeneralBirthProfile;
  classicalYogas: DetectedClassicalYoga[];
}
type DomainConfig = {
  id: string; titleEn: string; titleHi: string; icon: string;
  houses: number[]; karakas: NineGrahaId[]; varga: DivisionalChartId;
  adviceEn: string; adviceHi: string;
};
const DOMAINS: DomainConfig[] = [
  { id: 'personality', titleEn: 'Personality, Vitality & Mind', titleHi: 'व्यक्तित्व, आत्मबल एवं मन', icon: 'user', houses: [1, 5, 9], karakas: ['Sun', 'Moon'], varga: 'D9', adviceEn: 'Use initiative, self-awareness and consistent routines to develop the strengths shown by the chart.', adviceHi: 'कुंडली में दिखने वाली क्षमताओं को आत्मविश्वास, आत्मजागरूकता और नियमित दिनचर्या से विकसित करें।' },
  { id: 'wealth', titleEn: 'Wealth, Savings & Resources', titleHi: 'धन, बचत एवं संसाधन', icon: 'coins', houses: [2, 11, 5, 9], karakas: ['Jupiter', 'Venus', 'Mercury'], varga: 'D2', adviceEn: 'Build financial stability through disciplined saving, careful budgeting and informed decisions.', adviceHi: 'अनुशासित बचत, सुविचारित बजट और जानकारीपूर्ण निर्णयों से आर्थिक स्थिरता विकसित करें।' },
  { id: 'career', titleEn: 'Career, Work & Public Role', titleHi: 'करियर, कार्य एवं सामाजिक भूमिका', icon: 'briefcase', houses: [10, 6, 2, 11], karakas: ['Sun', 'Saturn', 'Mercury', 'Jupiter'], varga: 'D10', adviceEn: 'Strengthen professional skills, document achievements and build dependable working relationships.', adviceHi: 'पेशेवर कौशल बढ़ाएं, उपलब्धियों का अभिलेख रखें और भरोसेमंद कार्य-संबंध विकसित करें।' },
  { id: 'marriage', titleEn: 'Marriage & Relationships', titleHi: 'विवाह एवं संबंध', icon: 'heart', houses: [7, 2, 5, 8], karakas: ['Venus', 'Jupiter'], varga: 'D9', adviceEn: 'Nurture relationships through mutual respect, honest communication and thoughtful compatibility.', adviceHi: 'आपसी सम्मान, स्पष्ट संवाद और समझदारीपूर्ण अनुकूलता से संबंधों को मजबूत बनाएं।' },
  { id: 'health', titleEn: 'Health, Habits & Resilience', titleHi: 'स्वास्थ्य, आदतें एवं सहनशक्ति', icon: 'shield', houses: [1, 6, 8, 12], karakas: ['Sun', 'Moon', 'Saturn'], varga: 'D30', adviceEn: 'Support vitality with regular sleep, balanced activity, nutritious food and consistent preventive care.', adviceHi: 'नियमित नींद, संतुलित गतिविधि, पौष्टिक भोजन और समयानुसार स्वास्थ्य-जांच से जीवनशक्ति बनाए रखें।' },
  { id: 'spirituality', titleEn: 'Dharma, Learning & Spirituality', titleHi: 'धर्म, अध्ययन एवं आध्यात्म', icon: 'sparkles', houses: [9, 12, 5, 8], karakas: ['Jupiter', 'Ketu'], varga: 'D20', adviceEn: 'Deepen learning and inner growth through regular study, reflection, service and a steady spiritual practice.', adviceHi: 'नियमित अध्ययन, आत्मचिंतन, सेवा और साधना से ज्ञान तथा आंतरिक विकास को गहराई दें।' },
];
const CLASSICAL_PLANETS = new Set<string>(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']);
const CLASSICAL_GRAHAS = new Set<string>(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']);
function functionalLordshipEvidence(chart: ChartData, planetId: string): { en: string; hi: string; adjustment: number } | null {
  if (!CLASSICAL_PLANETS.has(planetId)) return null;
  const lordship = getFunctionalLordship(planetId as SevenPlanetId, chart.ascendant.signIndex);
  const houses = lordship.ownedHouses;
  // Keep the influence deliberately modest: ownership is one layer, never a verdict.
  const adjustment = lordship.yogakarakaProfile
    ? 0.75
    : lordship.kendradhipatiCaution
      ? -0.25
      : lordship.ownsDusthana && !lordship.ownsTrikona
        ? -0.5
        : lordship.ownsTrikona && !lordship.ownsDusthana
          ? 0.5
          : 0;
  return {
    en: planetId + ' owns houses ' + houses.join(', ') + ' (' + lordship.rolesEn.join('; ') + ')',
    hi: planetId + ' भाव ' + houses.join(', ') + ' का स्वामी है (' + lordship.rolesHi.join('; ') + ')',
    adjustment,
  };
}
function dignityPoints(d: string): number {
  if (['Exalted', 'Moolatrikona', 'Own Sign'].includes(d)) return 2;
  if (['Great Friend', 'Friend'].includes(d)) return 1;
  if (['Enemy', 'Great Enemy', 'Debilitated'].includes(d)) return -2;
  return 0;
}
function houseSignIndex(chart: ChartData, house: number): number { return (chart.ascendant.signIndex + house - 1) % 12; }
function planetHouse(chart: ChartData, p: { signIndex: number }): number { return ((p.signIndex - chart.ascendant.signIndex + 12) % 12) + 1; }
function aspectsHouse(chart: ChartData, target: number): string[] {
  const found: string[] = [];
  for (const p of chart.planets) {
    if (!CLASSICAL_GRAHAS.has(String(p.id))) continue;
    const from = planetHouse(chart, p);
    const offsets = p.id === 'Mars' ? [3, 6, 7] : p.id === 'Jupiter' ? [4, 6, 8] : p.id === 'Saturn' ? [2, 6, 9] : [6];
    if (offsets.some((n) => ((from - 1 + n) % 12) + 1 === target)) found.push(String(p.id));
  }
  return [...new Set(found)];
}
function buildDomain(chart: ChartData, config: DomainConfig, classicalYogas: DetectedClassicalYoga[]): DeepDomainPrediction {
  const strengthsEn: string[] = [], strengthsHi: string[] = [], watchoutsEn: string[] = [], watchoutsHi: string[] = [];
  const houseEn: string[] = [], houseHi: string[] = [], yogaEvidence: string[] = [];
  const related = new Set<string>();
  let balance = 0, count = 0;
  for (const house of config.houses) {
    const signIndex = houseSignIndex(chart, house), sign = SIGNS[signIndex];
    const lord = chart.planets.find((p) => p.id === sign.lord);
    const occupants = chart.planets.filter((p) => p.id !== 'Asc' && p.rasiHouseNumber === house);
    const aspects = aspectsHouse(chart, house), sav = chart.ashtakavarga?.sarva?.[signIndex];
    const en: string[] = [], hi: string[] = [];
    let local = 0;
    related.add(String(sign.lord));
    if (lord) {
      const d = dignityPoints(lord.dignity); local += d; count++;
      en.push('lord ' + lord.id + ' in H' + lord.rasiHouseNumber + ' (' + lord.signName + ', ' + lord.dignity + ')');
      hi.push('भावेश ' + lord.id + ' भाव ' + lord.rasiHouseNumber + ' में ' + lord.signName + ' राशि में (' + lord.dignity + ')');
      const lordRole = functionalLordshipEvidence(chart, String(lord.id));
      if (lordRole) {
        local += lordRole.adjustment;
        en.push('house-lord functional roles: ' + lordRole.en);
        hi.push('भावेश का कार्यात्मक स्वामित्व: ' + lordRole.hi);
      }
      if (d > 0) { strengthsEn.push(house + 'th-house lord ' + lord.id + ' has ' + lord.dignity + ' dignity.'); strengthsHi.push(house + 'वें भावेश ' + lord.id + ' की ' + lord.dignity + ' गरिमा सहायक संकेत है।'); }
      if (d < 0) { watchoutsEn.push(house + 'th-house lord ' + lord.id + ' has ' + lord.dignity + ' dignity; weigh this with strength and aspects.'); watchoutsHi.push(house + 'वें भावेश ' + lord.id + ' की ' + lord.dignity + ' स्थिति को ग्रहबल और दृष्टियों के साथ तौलें।'); }
      const sb = chart.shadbala?.find((row) => row.planet === lord.id);
      if (sb) {
        local += sb.ratio >= 1.2 ? 1 : sb.ratio < 0.8 ? -1 : 0;
        en.push('Shadbala ' + sb.ratio.toFixed(2) + '×'); hi.push('षड्बल ' + sb.ratio.toFixed(2) + '×');
        if (sb.ratio >= 1.2) { strengthsEn.push(lord.id + ' has above-threshold Shadbala (' + sb.ratio.toFixed(2) + '×).'); strengthsHi.push(lord.id + ' का षड्बल अपेक्षाकृत मजबूत (' + sb.ratio.toFixed(2) + '×) है।'); }
        if (sb.ratio < 0.8) { watchoutsEn.push(lord.id + ' has lower Shadbala (' + sb.ratio.toFixed(2) + '×); sustained effort may be needed.'); watchoutsHi.push(lord.id + ' का षड्बल कम (' + sb.ratio.toFixed(2) + '×) है; निरंतर प्रयास आवश्यक हो सकता है।'); }
      }
      if ([1, 4, 5, 7, 9, 10].includes(lord.rasiHouseNumber)) local += 1;
      if ([6, 8, 12].includes(lord.rasiHouseNumber)) local -= 1;
      if (lord.isCombust) { local -= 1; watchoutsEn.push(lord.id + ', the ' + house + 'th lord, is combust.'); watchoutsHi.push(house + 'वें भावेश ' + lord.id + ' अस्त हैं; इसे अन्य बल-सूचकों के साथ तौलें।'); }
      if (lord.isRetrograde && lord.id !== 'Rahu' && lord.id !== 'Ketu') { en.push('retrograde'); hi.push('वक्री'); }
    } else { en.push('lord ' + sign.lord + ' unavailable'); hi.push('भावेश ' + sign.lord + ' का डेटा उपलब्ध नहीं'); }
    if (sav !== undefined) {
      local += sav >= 30 ? 1 : sav <= 24 ? -1 : 0; count++;
      en.push('SAV ' + sav + ' bindus'); hi.push('सर्वाष्टकवर्ग ' + sav + ' बिंदु');
      if (sav >= 30) { strengthsEn.push(house + 'th-house sign has ' + sav + ' Sarvashtakavarga bindus.'); strengthsHi.push(house + 'वें भाव की राशि में ' + sav + ' सर्वाष्टकवर्ग बिंदु अपेक्षाकृत सहायक हैं।'); }
      if (sav <= 24) { watchoutsEn.push(house + 'th-house sign has ' + sav + ' Sarvashtakavarga bindus, a lower-support indicator.'); watchoutsHi.push(house + 'वें भाव की राशि में ' + sav + ' सर्वाष्टकवर्ग बिंदु अपेक्षाकृत कम समर्थन दर्शाते हैं।'); }
    }
    if (occupants.length) {
      const occupantEvidence = occupants.map((p) => {
        related.add(String(p.id));
        // Each occupant contributes one dignity observation and, where applicable,
        // one modest functional-lordship modifier. Keep the denominator at the
        // same evidence grain so crowded houses cannot distort the balance.
        const dignity = dignityPoints(p.dignity);
        local += dignity;
        count++;
        if (dignity > 0) {
          strengthsEn.push(p.id + ' occupies house ' + house + ' with ' + p.dignity + ' dignity.');
          strengthsHi.push(p.id + ' भाव ' + house + ' में ' + p.dignity + ' गरिमा के साथ स्थित है।');
        } else if (dignity < 0) {
          watchoutsEn.push(p.id + ' occupies house ' + house + ' with ' + p.dignity + ' dignity; weigh this with its strength and relationships.');
          watchoutsHi.push(p.id + ' भाव ' + house + ' में ' + p.dignity + ' स्थिति में है; इसे ग्रहबल और संबंधों के साथ तौलें।');
        }
        const role = functionalLordshipEvidence(chart, String(p.id));
        if (role) {
          local += role.adjustment;
          count++;
          return role.en;
        }
        return String(p.id) + ' has no assigned classical house lordship in this synthesis';
      });
      en.push('occupants ' + occupants.map((p) => p.id + ' (' + p.dignity + ')').join(', '));
      en.push('occupant functional roles: ' + occupantEvidence.join('; '));
      hi.push('स्थित ग्रह ' + occupants.map((p) => p.id + ' (' + p.dignity + ')').join(', '));
      hi.push('स्थित ग्रहों का कार्यात्मक स्वामित्व: ' + occupants.map((p) => functionalLordshipEvidence(chart, String(p.id))?.hi ?? String(p.id) + ' का पारंपरिक भाव-स्वामित्व नहीं').join('; '));
    } else { en.push('no classical graha occupant'); hi.push('कोई पारंपरिक ग्रह स्थित नहीं'); }
    if (aspects.length) {
      const aspectEvidence = aspects.map((id) => {
        related.add(id);
        const role = functionalLordshipEvidence(chart, id);
        if (role) {
          local += role.adjustment;
          count++;
          return role.en;
        }
        return id + ' has no assigned classical house lordship in this synthesis';
      });
      en.push('graha aspects ' + aspects.join(', '));
      en.push('aspecting planets functional roles: ' + aspectEvidence.join('; '));
      hi.push('ग्रह-दृष्टि ' + aspects.join(', '));
      hi.push('दृष्टि डालने वाले ग्रहों का कार्यात्मक स्वामित्व: ' + aspects.map((id) => functionalLordshipEvidence(chart, id)?.hi ?? id + ' का पारंपरिक भाव-स्वामित्व नहीं').join('; '));
    }
    balance += local;
    houseEn.push('H' + house + ' (' + sign.name + '): ' + en.join('; ') + '.');
    houseHi.push('भाव ' + house + ' (' + sign.name + '): ' + hi.join('; ') + '।');
  }
  for (const id of config.karakas) {
    const p = chart.planets.find((x) => x.id === id);
    if (!p) continue;
    related.add(String(id));
    const d = dignityPoints(p.dignity); balance += d * 0.5; count++;
    if (d > 0) { strengthsEn.push('Natural significator ' + id + ' has ' + p.dignity + ' dignity.'); strengthsHi.push('नैसर्गिक कारक ' + id + ' की ' + p.dignity + ' गरिमा सहायक है।'); }
    if (d < 0) { watchoutsEn.push('Natural significator ' + id + ' has ' + p.dignity + ' dignity.'); watchoutsHi.push('नैसर्गिक कारक ' + id + ' की ' + p.dignity + ' गरिमा पर ध्यान देना चाहिए।'); }
  }
  const varga = chart.divisionalCharts?.[config.varga], vargaEvidence: string[] = [];
  if (varga) for (const id of related) {
    const place = varga.placements.find((p) => p.id === id);
    if (!place) continue;
    vargaEvidence.push(id + ': ' + place.dignity + ', Varga H' + place.houseFromVargaLagna);
    const d = dignityPoints(place.dignity); balance += d * 0.5; count++;
    if (d > 0) { strengthsEn.push(id + ' is ' + place.dignity + ' in ' + config.varga + '.'); strengthsHi.push(id + ' ' + config.varga + ' में ' + place.dignity + ' स्थिति में हैं।'); }
    if (d < 0) { watchoutsEn.push(id + ' is ' + place.dignity + ' in ' + config.varga + '.'); watchoutsHi.push(id + ' की ' + config.varga + ' स्थिति ' + place.dignity + ' है।'); }
  }
  const relatedYogas = chart.yogas.filter((y) => y.planets.some((id) => related.has(id)));
  const relatedClassicalYogas = classicalYogas.filter((y) =>
    y.planets.some((id) => related.has(id)) || y.houses.some((house) => config.houses.includes(house))
  );
  for (const y of relatedClassicalYogas) {
    yogaEvidence.push(y.name + ' (' + y.strength + (y.bhangaStatus ? ', ' + y.bhangaStatus + ' bhanga status' : '') + ')');
    if (y.strength === 'Strong' || y.strength === 'Supreme') {
      strengthsEn.unshift('Classical yoga: ' + y.name + ' (' + y.strength + ').');
      strengthsHi.unshift('शास्त्रीय योग ' + y.nameHi + ' (' + y.strength + ') इस जीवन-क्षेत्र से संबंधित है।');
    }
    if (y.bhangaStatus === 'Bhanga' || y.bhangaStatus === 'Partial') {
      watchoutsEn.push(y.name + ' has ' + y.bhangaStatus.toLowerCase() + ' / reduced manifestation: ' + (y.bhangaReasonEn ?? 'review participating planets and conditions.'));
      watchoutsHi.push(y.nameHi + ' के फल में ' + (y.bhangaStatus === 'Bhanga' ? 'भंग' : 'आंशिक कमी') + ' का संकेत है: ' + (y.bhangaReasonHi ?? 'योग के ग्रहों और शर्तों की पुनः जांच करें।'));
    }
  }
  for (const y of relatedYogas) {
    yogaEvidence.push(y.name + ' (' + y.strength + ')');
    if (y.strength === 'Strong') {
      strengthsEn.unshift('Related yoga: ' + y.name + ' (strong).');
      strengthsHi.unshift('संबंधित योग ' + y.name + ' मजबूत रूप में दर्ज है।');
    }
    // Moderate/Present yogas remain visible as corroborating evidence, but are
    // not counted as supportive outcomes without a strong classification.

  }
  const hasSupport = strengthsEn.length > 0, hasCaution = watchoutsEn.length > 0;
  const toneEn = hasSupport && hasCaution ? 'mixed' : hasSupport ? 'more supportive' : hasCaution ? 'more challenging' : 'insufficient';
  const toneHi = hasSupport && hasCaution ? 'मिले-जुले' : hasSupport ? 'अपेक्षाकृत अनुकूल' : hasCaution ? 'अपेक्षाकृत चुनौतीपूर्ण' : 'अपर्याप्त';
  const summaryEn = config.titleEn + ': ' + toneEn + ' indications appear across houses ' + config.houses.join(', ') + '. House lords, occupants, aspects, Sarvashtakavarga, ' + config.varga + ' and relevant significators are weighed together; conflicting signals are retained.';
  const summaryHi = config.titleHi + ': भाव ' + config.houses.join(', ') + ' के संकेत ' + toneHi + ' हैं। भावेश, स्थित ग्रह, दृष्टि, सर्वाष्टकवर्ग, ' + config.varga + ' और संबंधित कारकों को साथ देखा गया है; विरोधी संकेतों को छिपाया नहीं गया है।';
  const supportSummaryEn = [...new Set(strengthsEn)].slice(0, 2).join(' ');
  const cautionSummaryEn = [...new Set(watchoutsEn)].slice(0, 2).join(' ');
  const supportSummaryHi = [...new Set(strengthsHi)].slice(0, 2).join(' ');
  const cautionSummaryHi = [...new Set(watchoutsHi)].slice(0, 2).join(' ');
  const evidenceToneEn = hasSupport && hasCaution
    ? 'mixed, with both supportive and demanding factors'
    : hasSupport
      ? 'supportive'
      : hasCaution
        ? 'demanding, calling for sustained effort'
        : 'not yet clear from the available chart data';
  const evidenceToneHi = hasSupport && hasCaution
    ? 'अनुकूल और चुनौतीपूर्ण दोनों प्रकार के संकेत'
    : hasSupport
      ? 'अनुकूल'
      : hasCaution
        ? 'अधिक प्रयास और धैर्य की अपेक्षा वाले'
        : 'उपलब्ध कुंडली-डेटा से स्पष्ट नहीं';
  const predictionEn = `${config.titleEn}: the chart shows ${evidenceToneEn}. ${supportSummaryEn ? 'The strongest supporting factors are: ' + supportSummaryEn : ''} ${cautionSummaryEn ? 'The main pressure points are: ' + cautionSummaryEn : ''}`.trim();
  const predictionHi = `${config.titleHi}: कुंडली में ${evidenceToneHi} संकेत हैं। ${supportSummaryHi ? 'मुख्य अनुकूल आधार: ' + supportSummaryHi : ''} ${cautionSummaryHi ? 'मुख्य चुनौती के क्षेत्र: ' + cautionSummaryHi : ''}`.trim();
  const score = Math.max(25, Math.min(75, Math.round(50 + (count ? (balance / count) * 14 : 0))));
  const ratingEn = score >= 64 ? 'Very Good' : score <= 40 ? 'Challenging' : 'Moderate';
  const ratingHi = score >= 64 ? 'उत्तम' : score <= 40 ? 'चुनौतीपूर्ण' : 'मध्यम';
  const factorsEn = houseEn.join(' ') + ' Karakas: ' + config.karakas.join(', ') + '. ' + config.varga + ': ' + (vargaEvidence.length ? vargaEvidence.join('; ') : 'relevant placements unavailable') + '. Related yogas: ' + (yogaEvidence.length ? yogaEvidence.join('; ') : 'none identified in supplied yoga data') + '.';
  const factorsHi = houseHi.join(' ') + ' कारक ग्रह: ' + config.karakas.join(', ') + '। ' + config.varga + ': ' + (vargaEvidence.length ? vargaEvidence.join('; ') : 'संबंधित स्थिति उपलब्ध नहीं') + '। संबंधित योग: ' + (yogaEvidence.length ? yogaEvidence.join('; ') : 'प्रदत्त योग-डेटा में कोई संबंधित योग दर्ज नहीं') + '।';
  const domainEventsMap: Record<string, { timingEn: string; timingHi: string; eventsEn: string[]; eventsHi: string[] }> = {
    personality: {
      timingEn: 'Age 21 to 28 (Emergence of independent identity, academic fruition & inner self-mastery)',
      timingHi: 'आयु 21 से 28 वर्ष (स्वतंत्र व्यक्तित्व का उदय, शैक्षणिक पूर्णता एवं आत्म-विश्वास का उत्कर्ष)',
      eventsEn: [
        'Age 21–24: Laying decisive intellectual foundation, graduation & core philosophical direction.',
        'Age 26–28: Elevation of social esteem, leadership rank & independent recognition in society.',
        'Age 35+: Mature decision-making wisdom, dignified stature and revered role in clan/community.',
      ],
      eventsHi: [
        'आयु 21-24 वर्ष: बौद्धिक नींव की पूर्णता, उच्च शिक्षा व स्पष्ट जीवन-दिशा का निर्धारण।',
        'आयु 26-28 वर्ष: सामाजिक मान-प्रतिष्ठा, स्वतंत्र पहचान एवं नेतृत्व क्षमता का ऐतिहासिक विस्तार।',
        'आयु 35+ वर्ष: परिपक्व निर्णय क्षमता, कुल में प्रतिष्ठित स्थान एवं मार्गदर्शक की भूमिका।',
      ],
    },
    wealth: {
      timingEn: 'Age 28 to 36 (Accumulation of immovable assets, self-earned wealth & steady treasury)',
      timingHi: 'आयु 28 से 36 वर्ष (स्व-अर्जित संपत्ति, स्थिर धन संचय, भवन निर्माण व कोष विस्तार)',
      eventsEn: [
        'Age 27–29: Inauguration of stable primary revenue stream & steady accumulation of savings.',
        'Age 31–34: Auspicious acquisition of immovable property (land/home) or milestone vehicle.',
        'Age 42+: Sustained multi-fold multiplication of ancestral & self-earned investments.',
      ],
      eventsHi: [
        'आयु 27-29 वर्ष: प्रथम दीर्घकालिक आय स्रोत की स्थापना एवं संचित कोष का नियमित विस्तार।',
        'आयु 31-34 वर्ष: अचल संपत्ति (भूमि/भवन) अथवा नवीन वाहन का मांगलिक अर्जन।',
        'आयु 42+ वर्ष: पैतृक व स्व-अर्जित पूंजी का बहुगुणा सुदृढ़ीकरण एवं वित्तीय स्वावलंबन।',
      ],
    },
    career: {
      timingEn: 'Age 29 to 38 (Executive authority, promotion, professional zenith & institutional role)',
      timingHi: 'आयु 29 से 38 वर्ष (प्रशासनिक अधिकार, पदोन्नति, कार्यक्षेत्र में नेतृत्व व कीर्ति)',
      eventsEn: [
        'Age 24–26: Professional entry, foundational skill validation & early competitive success.',
        'Age 30–33: Decisive career elevation, executive promotion & prestigious authority.',
        'Age 36–40: Zenith of public role, autonomous enterprise or commanding organizational rank.',
      ],
      eventsHi: [
        'आयु 24-26 वर्ष: कार्यक्षेत्र में प्रवेश, प्रारंभिक व्यावसायिक योग्यता एवं योग्यता का प्रमाण।',
        'आयु 30-33 वर्ष: निर्णायक पदोन्नति, उच्च उत्तरदायित्व एवं प्रशासनिक सम्मान की प्राप्ति।',
        'आयु 36-40 वर्ष: करियर का ऐतिहासिक उत्कर्ष, शीर्ष नेतृत्व पद या सफल स्वतंत्र उद्यम।',
      ],
    },
    marriage: {
      timingEn: 'Age 25 to 29 (Prime auspicious matrimony window, cultured spouse & domestic harmony)',
      timingHi: 'आयु 25 से 29 वर्ष (अनुकूल वैवाहिक स्वर्ण काल, सुयोग्य जीवनसाथी व गृहस्थ सुख)',
      eventsEn: [
        'Age 25–28: Auspicious nuptial alliance into a cultured, virtuous and supportive family.',
        'Age 28–31: Blessing of progeny, domestic stability and mutual emotional companionship.',
        'Age 38+: Joint asset acquisition and shared social prestige with spouse.',
      ],
      eventsHi: [
        'आयु 25-28 वर्ष: सुसंस्कृत, बुद्धिमान व मान-सम्मान वाले कुल में शुभ विवाह संस्कार।',
        'आयु 28-31 वर्ष: संतान सुख का मांगलिक योग एवं दांपत्य जीवन में स्थायी माधुर्य।',
        'आयु 38+ वर्ष: जीवनसाथी के सहयोग से संयुक्त संपत्ति का निर्माण व सामाजिक सम्मान।',
      ],
    },
    health: {
      timingEn: 'Longevity 75+ Years; vigilant digestion & Vata care around age 40 to 44',
      timingHi: 'दीर्घायु योग (75+ वर्ष); आयु 40 से 44 वर्ष में पाचन, वात व नियमित दिनचर्या पर विशेष ध्यान',
      eventsEn: [
        'Robust natural vitality and immune resilience protecting against chronic infirmities.',
        'Age 39–42: Workload stress may induce digestive sensitivity or sleep issues; clean diet vital.',
        'Enduring longevity and mental clarity into mature golden years through yogic discipline.',
      ],
      eventsHi: [
        'प्राकृतिक रोग-प्रतिरोधक क्षमता (आरोग्य) सुदृढ़, मौसमी व्याधियों से स्वतः त्वरित मुक्ति।',
        'आयु 39-42 वर्ष: अत्यधिक कार्यभार से अनिद्रा या पाचन संवेदनशीलता; सात्विक जीवनशैली आवश्यक।',
        'सुदीर्घ आयु (75+ वर्ष) एवं वृद्धावस्था में मानसिक चेतना व शारीरिक संतुलन की पूर्ण रक्षा।',
      ],
    },
    spirituality: {
      timingEn: 'Age 32 onward (Spiritual inclination, sacred pilgrimages & higher philosophical peace)',
      timingHi: 'आयु 32 वर्ष के पश्चात (आध्यात्मिक जागृति, तीर्थाटन, गुरु कृपा व आत्मिक शांति)',
      eventsEn: [
        'Inherited ethical moorings and innate faith in Vedic principles and righteous conduct.',
        'Age 34–40: Transformative pilgrimages to revered shrines & association with wise mentors.',
        'Age 50+: Meditative internalization, philanthropic legacy and steady ascent toward Moksha.',
      ],
      eventsHi: [
        'पारिवारिक संस्कारों से धर्म, नीति एवं ईश्वरीय सत्ता में स्वाभाविक अडिग निष्ठा।',
        'आयु 34-40 वर्ष: सिद्ध तीर्थ स्थलों की यात्राएं एवं उच्च गुरुजनों का आध्यात्मिक मार्गदर्शन।',
        'आयु 50+ वर्ष: अंतर्मुखी साधना, परोपकारी कार्य, सात्विक दान एवं मोक्ष मार्ग की अग्रसरता।',
      ],
    },
  };

  const domainSpec = domainEventsMap[config.id] || {
    timingEn: 'Age 28 to 35 (Maturation and stability window)',
    timingHi: 'आयु 28 से 35 वर्ष (स्थिरता व परिपक्वता कालखंड)',
    eventsEn: ['Gradual progressive growth', 'Milestone realization around prime age', 'Long-term consolidation'],
    eventsHi: ['क्रमिक प्रगति व उन्नति', 'प्रधान आयु में महत्वपूर्ण उपलब्धि', 'दीर्घकालिक स्थिरता'],
  };

  return {
    id: config.id, titleEn: config.titleEn, titleHi: config.titleHi, icon: config.icon, score, ratingEn, ratingHi,
    summaryEn, summaryHi, predictionEn, predictionHi,
    timingWindowEn: domainSpec.timingEn,
    timingWindowHi: domainSpec.timingHi,
    concreteEventsEn: domainSpec.eventsEn,
    concreteEventsHi: domainSpec.eventsHi,
    keyStrengthsEn: strengthsEn.length ? [...new Set(strengthsEn)].slice(0, 6) : ['No clearly supportive factor was established from the supplied chart data.'],
    keyStrengthsHi: strengthsHi.length ? [...new Set(strengthsHi)].slice(0, 6) : ['प्रदत्त कुंडली-डेटा से कोई स्पष्ट अनुकूल कारक स्थापित नहीं हुआ।'],
    watchoutsEn: watchoutsEn.length ? [...new Set(watchoutsEn)].slice(0, 6) : ['No prominent challenging factor appears among the assessed indicators.'],
    watchoutsHi: watchoutsHi.length ? [...new Set(watchoutsHi)].slice(0, 6) : ['जाँचे गए संकेतों में कोई प्रमुख चुनौतीपूर्ण कारक सामने नहीं आया।'],
    astrologicalFactorsEn: factorsEn, astrologicalFactorsHi: factorsHi,
    classicalAdviceEn: config.adviceEn, classicalAdviceHi: config.adviceHi,
  };
}


function interpretBirthFactor(
  id: string,
  valueEn: string,
  valueHi: string,
  chart: ChartData
): { en: string; hi: string } {
  const weekday = chart.panchang?.vara;
  const tithi = chart.panchang?.tithi;
  const sun = chart.planets.find((p) => p.id === 'Sun');
  const moon = chart.planets.find((p) => p.id === 'Moon');

  switch (id) {
    case 'weekday': {
      const lord = weekday?.lord ?? '';
      const varaProf = CLASSICAL_VARA_PROFILES[lord];
      if (varaProf) {
        return {
          en: `${varaProf.nameEn}: ${varaProf.psychologicalTraitsEn} Ambition & Work: ${varaProf.workAndAmbitionEn} Relationship dynamic: ${varaProf.relationshipNatureEn} Ruling planet: ${varaProf.rulingPlanet}.`,
          hi: `${varaProf.nameHi}: ${varaProf.psychologicalTraitsHi} कार्य व महत्वाकांक्षा: ${varaProf.workAndAmbitionHi} संबंध स्वभाव: ${varaProf.relationshipNatureHi} स्वामी ग्रह: ${varaProf.rulingPlanetHi}।`,
        };
      }
      return {
        en: `Born on ${valueEn}. Reflects planetary qualities of ${weekday?.lord ?? 'the day lord'}, shaping core drive and social role.`,
        hi: `${valueHi} का जन्म। यह वार स्वामी (${weekday?.sanskrit ?? 'वार स्वामी'}) के प्रभाव से जातक की कार्यशैली व स्वभाव का निर्धारण करता है।`,
      };
    }

    case 'tithi': {
      const tNum = Math.max(1, Math.min(15, tithi?.number ?? 1));
      const tProf = CLASSICAL_TITHI_PROFILES[tNum];
      const isShukla = tithi?.paksha === 'Shukla';
      const isPurnima = tNum === 15 && isShukla;
      const isAmavasya = tNum === 15 && !isShukla;
      const yogaRes = getTithiVaraYoga(tNum, weekday?.lord ?? '');

      if (tProf) {
        const titleEn = isPurnima ? 'Purnima (15th Shukla Tithi)' : isAmavasya ? 'Amavasya (15th Krishna Tithi)' : tProf.nameEn;
        const titleHi = isPurnima ? 'पूर्णिमा (१५वीं शुक्ल तिथि)' : isAmavasya ? 'अमावस्या (१५वीं कृष्ण तिथि)' : tProf.nameHi;
        const deityEn = isPurnima ? 'Chandra Deva & Goddess Lakshmi' : isAmavasya ? 'Pitrus & Lord Shani' : tProf.presidingDeityEn;
        const deityHi = isPurnima ? 'चंद्र देव एवं महालक्ष्मी' : isAmavasya ? 'पितृगण एवं शनि देव' : tProf.presidingDeityHi;
        const nityaEn = isPurnima ? 'Shodashi / Maha Nitya' : isAmavasya ? 'Chitra Nitya Devi' : tProf.governingNityaDeviEn;
        const nityaHi = isPurnima ? 'षोडशी / महानित्या' : isAmavasya ? 'चित्रा नित्या देवी' : tProf.governingNityaDeviHi;

        return {
          en: `${titleEn} [${tProf.category} Category - ${tProf.categorySignificanceEn}]: Presiding Deity: ${deityEn}; Governing Nitya Devi: ${nityaEn}. Classical Indication: ${tProf.classicalResultEn} Propitious activities: ${tProf.propitiousWorkEn}. Combination: ${yogaRes.combinationTitleEn} (${yogaRes.detailsEn}).`,
          hi: `${titleHi} [${tProf.categoryHi} वर्ग - ${tProf.categorySignificanceHi}]: अधिष्ठाता देव: ${deityHi}; अधिष्ठात्री नित्या देवी: ${nityaHi}। शास्त्रीय फलकथन: ${tProf.classicalResultHi} शुभ कार्य: ${tProf.propitiousWorkHi}। संयोग: ${yogaRes.combinationTitleHi} (${yogaRes.detailsHi})।`,
        };
      }
      return {
        en: `Tithi ${valueEn}: Governs vital lunar vitality, mental disposition, and timing of auspicious actions.`,
        hi: `तिथि ${valueHi}: चंद्र-कलाओं पर आधारित मानसिक स्थिति, आत्मबल और मांगलिक कार्यों की शुभता का निर्धारण करती है।`,
      };
    }

    case 'paksha': {
      const isShukla = tithi?.paksha === 'Shukla';
      if (isShukla) {
        return {
          en: 'Shukla Paksha (Bright Fortnight): Waxing lunar digits endow the native with flourishing progeny, wealth, righteous conduct, benevolence, and natural ascent in public esteem.',
          hi: 'शुक्ल पक्ष (शुक्ल पक्षीय जन्म): वर्धमान चंद्र किरणों के प्रभाव से जातक संतान-सुख, प्रचुर धन, धार्मिक रुचि, दया, उदारता और समाज में निरंतर यश व प्रगति प्राप्त करता है।',
        };
      }
      return {
        en: 'Krishna Paksha (Dark Fortnight): Deeply devoted to mother, pragmatic worldly karma, tenacious debater for self-advancement, building strength through perseverance and overcoming early hurdles.',
        hi: 'कृष्ण पक्ष (कृष्ण पक्षीय जन्म): माता के प्रति अनन्य भक्ति, व्यावहारिक कर्मठता, स्वावलंबन हेतु तार्किक दृढ़ता तथा आरंभिक चुनौतियों को पार कर अडिग सफलता पाने का सामर्थ्य।',
      };
    }

    case 'maas': {
      // Find clean maas name
      const cleanMaas = valueEn.replace('Adhika ', '').trim();
      const maasProf = CLASSICAL_LUNAR_MAAS_PROFILES[cleanMaas];
      const isAdhika = valueEn.startsWith('Adhika');
      const adhikaEn = isAdhika ? ' [Adhika Maas (Purushottama Maas): Sacred astronomical synchronization balancing solar and lunar cycles, extraordinarily auspicious for spiritual merit.]' : '';
      const adhikaHi = isAdhika ? ' [अधिक मास (पुरुषोत्तम मास): सौर व चांद्र वर्ष के सामंजस्य का पावन मास, जो आध्यात्मिक उत्थान व दान-पुण्य हेतु परम फलदायी है।]' : '';

      if (maasProf) {
        return {
          en: `${valueEn} (Sun in ${maasProf.sunSignEn}): ${maasProf.shastricResultEn}${adhikaEn}`,
          hi: `${valueHi} (सूर्य ${maasProf.sunSignHi} में): ${maasProf.shastricResultHi}${adhikaHi}`,
        };
      }
      return {
        en: `Lunar Month ${valueEn}: Marks seasonal solar-lunar alignment and societal inclination.`,
        hi: `चांद्र मास ${valueHi}: सौर-चांद्र संवत्सर के प्रभाव से जीवन की प्राथमिक प्रवृत्तियों को दिशा देता है।`,
      };
    }

    case 'ritu': {
      const cleanRitu = valueEn.split(' ')[0] ?? 'Vasanta';
      const rituProf = CLASSICAL_RITU_PROFILES[cleanRitu] ?? CLASSICAL_RITU_PROFILES['Vasanta'];
      return {
        en: `${rituProf.nameEn} (Lunar Months: ${rituProf.lunarMonthsEn}): ${rituProf.temperamentEn}`,
        hi: `${rituProf.nameHi} (${rituProf.lunarMonthsHi}): ${rituProf.temperamentHi}`,
      };
    }

    case 'prahar': {
      let kaalKey = 'Madhyahna';
      const sunHouse = sun?.rasiHouseNumber ?? 1;
      if (sunHouse === 12 || sunHouse === 1 || sunHouse === 2) kaalKey = 'Ushakaal';
      else if (sunHouse === 11 || sunHouse === 10) kaalKey = 'Pratushakaal';
      else if (sunHouse === 9 || sunHouse === 8) kaalKey = 'Madhyahna';
      else if (sunHouse === 7 || sunHouse === 6) kaalKey = 'Sayamkaal';
      else kaalKey = 'RatriKaal';

      const kaalProf = CLASSICAL_KAAL_PROFILES[kaalKey] ?? CLASSICAL_KAAL_PROFILES['Madhyahna'];
      return {
        en: `${valueEn} · ${kaalProf.nameEn} (Diurnal Phase): ${kaalProf.natureEn} Solar alignment in ${kaalProf.sunHousePosition}.`,
        hi: `${valueHi} · ${kaalProf.nameHi}: ${kaalProf.natureHi} सूर्य की भाव-स्थिति (${kaalProf.sunHousePosition})।`,
      };
    }

    case 'karana': {
      const karanaName = chart.panchang?.karana?.name ?? valueEn.split(' ')[0] ?? 'Bava';
      const kProf = CLASSICAL_KARANAS[karanaName];
      if (kProf) {
        return {
          en: `Karana ${kProf.nameEn} [${kProf.natureEn}]: ${kProf.classicalResultEn}`,
          hi: `करण ${kProf.nameHi} [${kProf.natureHi}]: ${kProf.classicalResultHi}`,
        };
      }
      return {
        en: `Karana ${valueEn}: Defines executive rhythm and immediate capacity to take decisive actions.`,
        hi: `करण ${valueHi}: कार्य-संपादन क्षमता, तात्कालिक निर्णय-शक्ति और पुरुषार्थ का प्रतीक है।`,
      };
    }

    case 'surya-yoga': {
      const yogaNum = chart.panchang?.yoga?.number ?? 1;
      const yProf = CLASSICAL_NITYA_YOGAS[yogaNum];
      if (yProf) {
        return {
          en: `Nitya Yoga ${yProf.nameEn} [${yProf.natureEn}]: ${yProf.classicalResultEn}`,
          hi: `नित्य योग ${yProf.nameHi} [${yProf.natureHi}]: ${yProf.classicalResultHi}`,
        };
      }
      return {
        en: `Surya-Chandra Yoga ${valueEn}: Shows harmonized coordination between vital consciousness and mind.`,
        hi: `सूर्य-चंद्र नित्य योग ${valueHi}: आत्मबल और मनोबल के पारस्परिक सामंजस्य का शास्त्रीय संकेत है।`,
      };
    }

    case 'nakshatra-charan': {
      const nakIndex = chart.panchang?.nakshatra?.index ?? moon?.nakshatraIndex ?? 0;
      const nakProf = CLASSICAL_NAKSHATRAS[nakIndex];
      if (nakProf) {
        return {
          en: `${valueEn}: Appearance: ${nakProf.physicalFeaturesEn} Personality: ${nakProf.psychologicalTraitsEn}${nakProf.lifeTrajectoryEn ? ` Career & Life: ${nakProf.lifeTrajectoryEn}` : ''}`,
          hi: `${valueHi}: शारीरिक लक्षण: ${nakProf.physicalFeaturesHi} स्वभाव व व्यक्तित्व: ${nakProf.psychologicalTraitsHi}${nakProf.lifeTrajectoryHi ? ` कार्यक्षेत्र व प्रगति: ${nakProf.lifeTrajectoryHi}` : ''}`,
        };
      }
      return {
        en: `Nakshatra Pada ${valueEn}: Sets specific subconscious tendencies and mental orientation.`,
        hi: `नक्षत्र चरण ${valueHi}: मानसिक प्रवृत्तियों और चेतना की दिशा को सूक्ष्म रूप से निर्धारित करता है।`,
      };
    }

    case 'varna':
      return {
        en: `Varna (${valueEn}): Traditionally signifies natural aptitude and temperament in social responsibility and intellectual pursuits.`,
        hi: `वर्ण (${valueHi}): सामाजिक उत्तरदायित्व और बौद्धिक कार्यप्रणाली में जातक की स्वाभाविक रुचि व प्रवृत्ति का शास्त्रीय वर्गीकरण है।`,
      };

    case 'vashya':
      return {
        en: `Vashya (${valueEn}): Classical indicator of mutual influence, social adaptability, and magnetic relationship resonance.`,
        hi: `वश्य (${valueHi}): सामाजिक अनुकूलता, प्रभावशीलता और संबंधों में पारस्परिक आकर्षण का शास्त्रीय सूचक है।`,
      };

    case 'yoni':
      return {
        en: `Yoni (${valueEn}): Instinctive nature, physiological resilience, and relational harmony in marriage compatibility.`,
        hi: `योनि (${valueHi}): जातक की मूल जैविक प्रकृति, शारीरिक ऊर्जा और दांपत्य जीवन में स्वाभाविक सामंजस्य का प्रतीक है।`,
      };

    case 'gana':
      return {
        en: `Gana (${valueEn}): Mental disposition and worldview—Deva indicates noble idealism; Manushya indicates pragmatic balance; Rakshasa indicates bold ambition and defiance of convention.`,
        hi: `गण (${valueHi}): जीवन-दृष्टिकोण का निर्धारण—देव गण उच्च आदर्श; मनुष्य गण व्यावहारिक संतुलन; राक्षस गण अदम्य साहस और दृढ़ महत्वाकांक्षा का सूचक है।`,
      };

    case 'nadi':
      return {
        en: `Nadi (${valueEn}): Constitutional biological current (Vata/Pitta/Kapha balance), hereditary vitality, and marital longevity harmony.`,
        hi: `नाड़ी (${valueHi}): जैविक त्रिदोष (वात/पित्त/कफ) संतुलन, आनुवंशिक जीवनशक्ति और दांपत्य स्वास्थ्य का मुख्य आधार है।`,
      };

    case 'nadi-pad':
      return {
        en: `Nadi Pada (${valueEn}): Quarter-based refinement of physical constitution and micro-timing of constitutional health.`,
        hi: `नाड़ी पाद (${valueHi}): शारीरिक धातु-पुष्टि और स्वास्थ्य प्रवृत्तियों का सूक्ष्म शास्त्रीय संकेत है।`,
      };

    case 'tattva':
      return {
        en: `Tatva (${valueEn}): Elemental foundation of the psyche—Fire gives bold action, Earth gives steadfast pragmatism, Air gives intellectual agility, Water gives intuitive empathy.`,
        hi: `तत्त्व (${valueHi}): मानसिक चेतना का मूल तत्त्व—अग्नि पराक्रम देती है, पृथ्वी स्थिरता, वायु बौद्धिक संवेदनशीलता, और जल सहज अंतर्दृष्टि।`,
      };

    case 'paya':
      return {
        en: `Paya (${valueEn}): North-Indian classical matrix based on Moon’s house from Lagna, indicating childhood blessings and baseline fortune.`,
        hi: `पाया (${valueHi}): लग्न से चंद्रमा की भाव-स्थिति पर आधारित उत्तर-भारतीय पद्धति, जो जीवनारंभ के भाग्य और पारिवारिक संबल को दर्शाती है।`,
      };

    case 'naam-akshar':
      return {
        en: `Birth Syllable (${valueEn}): Assigned from the Nakshatra Pada, activating the sacred sonic vibration for personal naming and vitality.`,
        hi: `जन्माक्षर (${valueHi}): नक्षत्र चरण से निर्धारित मंगल ध्वनि, जो नामकरण और आत्मिक आभा को बल प्रदान करती है।`,
      };

    case 'atmakaraka':
      return {
        en: `${valueEn} is the Jaimini Atmakaraka (Soul Signifier), indicating core karmic lessons, ethical mission, and path of self-realization.`,
        hi: `${valueHi} जैमिनी आत्मकारक है, जो आत्मा के मुख्य कर्म-संस्कार, जीवन-उद्देश्य और आत्म-साक्षात्कार के मार्ग को उजागर करता है।`,
      };

    case 'ishta-dev':
      return {
        en: `${valueEn} is the Ishta Devata derived from the 12th from Karakamsha in Navamsha (D9), serving as the supreme focus for personal meditation and divine protection.`,
        hi: `${valueHi} नवांश (D9) में कारकांश से १२वें भाव से प्राप्त इष्ट देव हैं, जो व्यक्तिगत साधना, मानसिक शांति और दैवीय संबल के सर्वोच्च केंद्र हैं।`,
      };

    default:
      return {
        en: `${valueEn} is a traditional birth foundation factor providing classical perspective on constitutional strengths.`,
        hi: `${valueHi} एक पारंपरिक जन्म कारक है, जो जातक की शास्त्रीय प्रवृत्तियों को स्पष्ट करता है।`,
      };
  }
}

const NAKSHATRA_NAME_AKSHAR: string[][] = [
  ['चू', 'चे', 'चो', 'ला'], ['ली', 'लू', 'ले', 'लो'], ['अ', 'ई', 'उ', 'ए'],
  ['ओ', 'वा', 'वी', 'वू'], ['वे', 'वो', 'का', 'की'], ['कू', 'घ', 'ङ', 'छ'],
  ['के', 'को', 'हा', 'ही'], ['हू', 'हे', 'हो', 'डा'], ['डी', 'डू', 'डे', 'डो'],
  ['मा', 'मी', 'मू', 'मे'], ['मो', 'टा', 'टी', 'टू'], ['टे', 'टो', 'पा', 'पी'],
  ['पू', 'ष', 'ण', 'ठ'], ['पे', 'पो', 'रा', 'री'], ['रू', 'रे', 'रो', 'ता'],
  ['ती', 'तू', 'ते', 'तो'], ['ना', 'नी', 'नू', 'ने'], ['नो', 'या', 'यी', 'यू'],
  ['ये', 'यो', 'भा', 'भी'], ['भू', 'धा', 'फा', 'ढा'], ['भे', 'भो', 'जा', 'जी'],
  ['खी', 'खू', 'खे', 'खो'], ['गा', 'गी', 'गू', 'गे'], ['गो', 'सा', 'सी', 'सू'],
  ['से', 'सो', 'दा', 'दी'], ['दू', 'थ', 'झ', 'ञ'], ['दे', 'दो', 'चा', 'ची'],
];
const PLANET_ISHTA_DEVATA: Record<string, string> = {
  Sun: 'Shiva', Moon: 'Gauri / Parvati', Mars: 'Skanda / Kartikeya',
  Mercury: 'Vishnu', Jupiter: 'Narayana', Venus: 'Lakshmi',
  Saturn: 'Hanuman / Brahma', Rahu: 'Durga', Ketu: 'Ganesha',
};
function normalize360(value: number): number { return ((value % 360) + 360) % 360; }
function buildGeneralBirthProfile(chart: ChartData): GeneralBirthProfile {
  const moon = chart.planets.find((p) => p.id === 'Moon');
  const sun = chart.planets.find((p) => p.id === 'Sun');
  const moonSign = moon ? SIGNS[moon.signIndex] : undefined;
  const nak = chart.panchang?.nakshatra;
  const pada = Math.max(1, Math.min(4, nak?.pada ?? moon?.pada ?? 1));
  const nakInfo = nak ? NAKSHATRAS[nak.index] : moon ? NAKSHATRAS[moon.nakshatraIndex] : undefined;
  const moonHouse = moon?.rasiHouseNumber ?? (moon ? ((moon.signIndex - chart.ascendant.signIndex + 12) % 12) + 1 : 0);
  const paya = moonHouse === 1 || moonHouse === 6 || moonHouse === 11
    ? ['Swarna Paya', 'स्वर्ण पाया']
    : moonHouse === 2 || moonHouse === 5 || moonHouse === 9
      ? ['Rajat Paya', 'रजत पाया']
      : moonHouse === 3 || moonHouse === 7 || moonHouse === 10
        ? ['Tamra Paya', 'ताम्र पाया']
        : ['Loha Paya', 'लौह पाया'];

  // Amanta lunar month is named from the Sun's sign at the month's full moon.
  // Estimate the full-moon instant from the current Sun-Moon elongation and daily speeds.
  const relativeSpeed = (moon?.speedDegPerDay ?? 13) - (sun?.speedDegPerDay ?? 1);
  const elongation = moon && sun ? normalize360(moon.longitude - sun.longitude) : 0;
  const fullMoonDelta = relativeSpeed > 0
    ? (elongation <= 180 ? (180 - elongation) : -(elongation - 180)) / relativeSpeed
    : 0;
  const fullMoonSunLongitude = sun ? normalize360(sun.longitude + sun.speedDegPerDay * fullMoonDelta) : 0;
  const fullMoonSunSign = Math.floor(fullMoonSunLongitude / 30);
  const lunarMonths = ['Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha', 'Shravana', 'Bhadrapada', 'Ashwin', 'Kartika', 'Margashirsha', 'Pausha', 'Magha', 'Phalguna'];
  const lunarMonth = lunarMonths[fullMoonSunSign] ?? 'Not available';
  const elapsedSinceNewMoon = relativeSpeed > 0 ? elongation / relativeSpeed : 0;
  const untilNextNewMoon = relativeSpeed > 0 ? (360 - elongation) / relativeSpeed : 0;
  const previousNewMoonSun = sun ? normalize360(sun.longitude - sun.speedDegPerDay * elapsedSinceNewMoon) : 0;
  const nextNewMoonSun = sun ? normalize360(sun.longitude + sun.speedDegPerDay * untilNextNewMoon) : 0;
  const isAdhika = Math.floor(previousNewMoonSun / 30) === Math.floor(nextNewMoonSun / 30);
  const monthName = (isAdhika ? 'Adhika ' : '') + lunarMonth;
  const rituNames = ['Vasanta (वसंत)', 'Grishma (ग्रीष्म)', 'Varsha (वर्षा)', 'Sharad (शरद)', 'Hemanta (हेमंत)', 'Shishira (शिशिर)'];
  const rituIndex = Math.floor((fullMoonSunSign % 12) / 2);
  const ritu = rituNames[rituIndex];

  let prahar = 'Not available';
  let praharHi = 'उपलब्ध नहीं';
  const birthMs = chart.utcMs;
  const sunriseMs = chart.panchang?.sunriseUtc ? Date.parse(chart.panchang.sunriseUtc) : NaN;
  const sunsetMs = chart.panchang?.sunsetUtc ? Date.parse(chart.panchang.sunsetUtc) : NaN;
  const nextSunriseMs = chart.panchang?.nextSunriseUtc ? Date.parse(chart.panchang.nextSunriseUtc) : NaN;
  if (Number.isFinite(sunriseMs) && Number.isFinite(sunsetMs) && Number.isFinite(nextSunriseMs)) {
    if (birthMs >= sunriseMs && birthMs < sunsetMs && sunsetMs > sunriseMs) {
      const part = Math.min(3, Math.floor(((birthMs - sunriseMs) / (sunsetMs - sunriseMs)) * 4));
      prahar = `Day Prahar ${part + 1}`;
      praharHi = `दिन का ${part + 1}वाँ प्रहर`;
    } else if (birthMs >= sunsetMs && birthMs < nextSunriseMs && nextSunriseMs > sunsetMs) {
      const part = Math.min(3, Math.floor(((birthMs - sunsetMs) / (nextSunriseMs - sunsetMs)) * 4));
      prahar = `Night Prahar ${part + 1}`;
      praharHi = `रात्रि का ${part + 1}वाँ प्रहर`;
    }
  }

  const karakas = computeCharaKarakas(chart);
  const ak = karakas.find((k) => k.role === 'AK');
  const d9 = chart.divisionalCharts?.D9;
  const akD9 = ak ? d9?.placements.find((p) => p.id === ak.planet) : undefined;
  const karakamshaSign = akD9?.signIndex;
  const ishtaSign = karakamshaSign === undefined ? undefined : (karakamshaSign + 11) % 12;
  const d9Occupants = ishtaSign === undefined ? [] : d9?.placements.filter((p) => p.id !== 'Asc' && p.signIndex === ishtaSign) ?? [];
  const ishtaPlanets = d9Occupants.length
    ? d9Occupants.map((p) => String(p.id))
    : ishtaSign === undefined ? [] : [SIGNS[ishtaSign].lord];
  const ishtaNames = [...new Set(ishtaPlanets.map((p) => PLANET_ISHTA_DEVATA[p] ?? p))];
  const ishtaMethod = d9Occupants.length ? '12th from Karakamsha (D9 occupant)' : '12th-house lord from Karakamsha (D9 fallback)';
  const ishtaHi = d9Occupants.length ? 'कारकांश से 12वें नवांश में स्थित ग्रह के आधार पर' : 'कारकांश से 12वें नवांश के स्वामी के आधार पर';

  const weekday = chart.panchang?.vara;
  const tithi = chart.panchang?.tithi;
  const yoga = chart.panchang?.yoga;
  const karana = chart.panchang?.karana;
  const factors: Omit<GeneralBirthFactor, 'interpretationEn' | 'interpretationHi'>[] = [
    { id: 'weekday', labelEn: 'Weekday / Vaar', labelHi: 'वार', valueEn: weekday ? `${weekday.name} (${weekday.lord})` : 'Not available', valueHi: weekday ? `${weekday.sanskrit} (${weekday.lord})` : 'उपलब्ध नहीं' },
    { id: 'tithi', labelEn: 'Tithi', labelHi: 'तिथि', valueEn: tithi ? `${tithi.name} (Tithi ${tithi.number})` : 'Not available', valueHi: tithi ? `${tithi.name} (${tithi.number})` : 'उपलब्ध नहीं' },
    { id: 'paksha', labelEn: 'Paksha', labelHi: 'पक्ष', valueEn: tithi?.paksha ?? 'Not available', valueHi: tithi?.paksha === 'Shukla' ? 'शुक्ल पक्ष' : tithi?.paksha === 'Krishna' ? 'कृष्ण पक्ष' : 'उपलब्ध नहीं' },
    { id: 'maas', labelEn: 'Maas (Amanta)', labelHi: 'मास (अमान्त)', valueEn: monthName, valueHi: (isAdhika ? 'अधिक ' : '') + lunarMonth },
    { id: 'ritu', labelEn: 'Ritu', labelHi: 'ऋतु', valueEn: ritu, valueHi: ritu.split(' (')[1]?.replace(')', '') ?? ritu },
    { id: 'prahar', labelEn: 'Prahar (Day / Night)', labelHi: 'प्रहर (दिन / रात्रि)', valueEn: prahar, valueHi: praharHi },
    { id: 'karana', labelEn: 'Karana', labelHi: 'करण', valueEn: karana ? `${karana.name} (${karana.type})` : 'Not available', valueHi: karana ? karana.name : 'उपलब्ध नहीं' },
    { id: 'surya-yoga', labelEn: 'Surya Siddhanta Yoga (Nitya Yoga)', labelHi: 'सूर्य सिद्धांत योग (नित्य योग)', valueEn: yoga ? `${yoga.name} (#${yoga.number})` : 'Not available', valueHi: yoga ? `${yoga.name} (योग ${yoga.number})` : 'उपलब्ध नहीं' },
    { id: 'varna', labelEn: 'Varna (Moon Rashi)', labelHi: 'वर्ण (चंद्र राशि)', valueEn: moonSign?.varna ?? 'Not available', valueHi: moonSign?.varna === 'Brahmin' ? 'ब्राह्मण' : moonSign?.varna === 'Kshatriya' ? 'क्षत्रिय' : moonSign?.varna === 'Vaishya' ? 'वैश्य' : moonSign?.varna === 'Shudra' ? 'शूद्र' : 'उपलब्ध नहीं' },
    { id: 'vashya', labelEn: 'Vashya (Moon Rashi)', labelHi: 'वश्य (चंद्र राशि)', valueEn: moonSign?.vashya ?? 'Not available', valueHi: ({ Quadruped: 'चतुष्पद', Human: 'मानव', Aquatic: 'जलचर', Wild: 'वनचर', Insect: 'कीट' } as Record<string,string>)[moonSign?.vashya ?? ''] ?? 'उपलब्ध नहीं' },
    { id: 'yoni', labelEn: 'Yoni', labelHi: 'योनि', valueEn: nakInfo?.yoni ?? 'Not available', valueHi: nakInfo?.yoni ?? 'उपलब्ध नहीं' },
    { id: 'gana', labelEn: 'Gana', labelHi: 'गण', valueEn: nakInfo?.gana ?? 'Not available', valueHi: nakInfo?.gana === 'Deva' ? 'देव' : nakInfo?.gana === 'Manushya' ? 'मनुष्य' : nakInfo?.gana === 'Rakshasa' ? 'राक्षस' : 'उपलब्ध नहीं' },
    { id: 'nadi', labelEn: 'Nadi', labelHi: 'नाड़ी', valueEn: nakInfo?.nadi ?? 'Not available', valueHi: nakInfo?.nadi === 'Adi' ? 'आदि' : nakInfo?.nadi === 'Madhya' ? 'मध्य' : nakInfo?.nadi === 'Antya' ? 'अंत्य' : 'उपलब्ध नहीं' },
    { id: 'nadi-pad', labelEn: 'Nadi Pada', labelHi: 'नाड़ी पद', valueEn: nakInfo ? `${nakInfo.nadi} Nadi · Pada ${pada}` : 'Not available', valueHi: nakInfo ? `${nakInfo.nadi === 'Adi' ? 'आदि' : nakInfo.nadi === 'Madhya' ? 'मध्य' : 'अंत्य'} नाड़ी · पद ${pada}` : 'उपलब्ध नहीं' },
    { id: 'tattva', labelEn: 'Tattva (Moon Rashi)', labelHi: 'तत्त्व (चंद्र राशि)', valueEn: moonSign?.element ?? 'Not available', valueHi: ({ Fire: 'अग्नि', Earth: 'पृथ्वी', Air: 'वायु', Water: 'जल' } as Record<string,string>)[moonSign?.element ?? ''] ?? 'उपलब्ध नहीं' },
    { id: 'paya', labelEn: 'Paya (Moon from Lagna method)', labelHi: 'पाया (लग्न से चंद्र स्थिति)', valueEn: `${paya[0]} · Moon in H${moonHouse}`, valueHi: `${paya[1]} · चंद्रमा भाव ${moonHouse}` },
    { id: 'naam-akshar', labelEn: 'Naamakshar', labelHi: 'नामाक्षर', valueEn: nakInfo ? NAKSHATRA_NAME_AKSHAR[nakInfo.index]?.[pada - 1] ?? 'Not available' : 'Not available', valueHi: nakInfo ? NAKSHATRA_NAME_AKSHAR[nakInfo.index]?.[pada - 1] ?? 'उपलब्ध नहीं' : 'उपलब्ध नहीं' },
    { id: 'nakshatra-charan', labelEn: 'Nakshatra Charan', labelHi: 'नक्षत्र चरण', valueEn: nakInfo ? `${nakInfo.name} · Pada ${pada}` : 'Not available', valueHi: nakInfo ? `${nakInfo.name} · चरण ${pada}` : 'उपलब्ध नहीं' },
    { id: 'atmakaraka', labelEn: 'Atmakaraka', labelHi: 'आत्मकारक', valueEn: ak ? `${ak.planet} · ${ak.signName} · ${ak.degreeInSign.toFixed(2)}°` : 'Not available', valueHi: ak ? `${ak.planet} · ${ak.signName} · ${ak.degreeInSign.toFixed(2)}°` : 'उपलब्ध नहीं' },
    { id: 'ishta-dev', labelEn: 'Ishta Dev', labelHi: 'इष्ट देव', valueEn: ishtaNames.length ? `${ishtaNames.join(' / ')} (${ishtaMethod})` : 'Not available', valueHi: ishtaNames.length ? `${ishtaNames.join(' / ')} (${ishtaHi})` : 'उपलब्ध नहीं' },
  ];
  const summaryEn = `Birth foundation: ${weekday?.name ?? 'weekday unavailable'}, ${tithi?.name ?? 'tithi unavailable'} / ${tithi?.paksha ?? 'paksha unavailable'}, ${monthName}, ${ritu}; ${nakInfo?.name ?? 'birth nakshatra unavailable'} Pada ${pada}, ${nakInfo?.gana ?? ''} Gana, ${nakInfo?.nadi ?? ''} Nadi. The birth profile combines Panchanga, Nakshatra, Moon-sign attributes, Chara Atmakaraka and D9 Karakamsha indications.`;
  const summaryHi = `जन्म का आधार: ${weekday?.sanskrit ?? 'वार उपलब्ध नहीं'}, ${tithi?.name ?? 'तिथि उपलब्ध नहीं'} / ${tithi?.paksha === 'Shukla' ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष'}, ${monthName}, ${ritu}; ${nakInfo?.name ?? 'नक्षत्र उपलब्ध नहीं'} चरण ${pada}, ${nakInfo?.gana ?? ''} गण, ${nakInfo?.nadi ?? ''} नाड़ी। इसमें पंचांग, नक्षत्र, चंद्र राशि के वर्ण-वश्य-तत्त्व, जैमिनी आत्मकारक और D9 कारकांश से प्राप्त इष्ट देव के संकेत सम्मिलित हैं।`;
  const interpretedFactors = factors.map((factor) => ({ ...factor, ...(() => { const meaning = interpretBirthFactor(factor.id, factor.valueEn, factor.valueHi, chart); return { interpretationEn: meaning.en, interpretationHi: meaning.hi }; })() }));
  // Compute Classical Navamsha Lagna (Prithu Yasas)
  const d9AscPlacement = chart.divisionalCharts?.D9?.placements?.find((p) => p.id === 'Asc');
  const navSignIndex = d9AscPlacement
    ? d9AscPlacement.signIndex
    : Math.floor(normalize360(chart.ascendant.longitude) / (30 / 9)) % 12;
  const navProf = CLASSICAL_PRITHU_YASAS_NAVAMSHA[navSignIndex] ?? CLASSICAL_PRITHU_YASAS_NAVAMSHA[0];
  const isVargottama = navSignIndex === chart.ascendant.signIndex;

  const navamshaLagna = {
    signIndex: navSignIndex,
    signNameEn: navProf.signNameEn,
    signNameHi: navProf.signNameHi,
    readingEn: navProf.prithuYasasDictumEn + (isVargottama ? ' [Vargottama Navamsha: Lagna in identical sign in D1 and D9 bestows two-fold happiness, great longevity and unshakeable prosperity.]' : ''),
    readingHi: navProf.prithuYasasDictumHi + (isVargottama ? ' [वर्गोत्तम नवांश: लग्न D1 व D9 दोनों में समान राशि में होने से जातक को दोगुना शुभ फल, उत्तम स्वास्थ्य और अखंड समृद्धि मिलती है।]' : ''),
    vulnerabilityAges: navProf.criticalVulnerabilityAges,
    isVargottama,
    sageWarningEn: navProf.sageWarningEn,
    sageWarningHi: navProf.sageWarningHi,
  };

  // Compute Tithi & Nitya Devi Profile
  const tNum = Math.max(1, Math.min(15, chart.panchang?.tithi?.number ?? 1));
  const tProf = CLASSICAL_TITHI_PROFILES[tNum] ?? CLASSICAL_TITHI_PROFILES[1];
  const tithiYoga = getTithiVaraYoga(tNum, chart.panchang?.vara?.lord ?? '');
  const isShukla = chart.panchang?.tithi?.paksha === 'Shukla';
  const tithiDetails = {
    tithiNumber: tNum,
    tithiNameEn: tNum === 15 ? (isShukla ? 'Purnima' : 'Amavasya') : tProf.nameEn,
    tithiNameHi: tNum === 15 ? (isShukla ? 'पूर्णिमा' : 'अमावस्या') : tProf.nameHi,
    category: tProf.category,
    categoryHi: tProf.categoryHi,
    presidingDeityEn: tNum === 15 ? (isShukla ? 'Chandra Deva & Mahalakshmi' : 'Pitrus & Lord Shani') : tProf.presidingDeityEn,
    presidingDeityHi: tNum === 15 ? (isShukla ? 'चंद्र देव एवं महालक्ष्मी' : 'पितृगण एवं शनि देव') : tProf.presidingDeityHi,
    governingNityaDeviEn: tNum === 15 ? (isShukla ? 'Shodashi / Maha Nitya' : 'Chitra Nitya Devi') : tProf.governingNityaDeviEn,
    governingNityaDeviHi: tNum === 15 ? (isShukla ? 'षोडशी / महानित्या' : 'चित्रा नित्या देवी') : tProf.governingNityaDeviHi,
    nityaDeviMantra: tProf.nityaDeviMantra,
    combinationYoga: tithiYoga,
  };

  // Compute Seasonal Details (Ayana, Maas, Ritu, Kaal, Hora, Gregorian Month)
  const sunSign = sun ? sun.signIndex : 0;
  const isUttarayana = sunSign === 9 || sunSign === 10 || sunSign === 11 || sunSign === 0 || sunSign === 1 || sunSign === 2;
  const ayanaData = isUttarayana ? CLASSICAL_AYANA_PROFILES.Uttarayana : CLASSICAL_AYANA_PROFILES.Dakshinayana;
  const maasProf = CLASSICAL_LUNAR_MAAS_PROFILES[lunarMonth] ?? CLASSICAL_LUNAR_MAAS_PROFILES['Chaitra'];
  const rituKey = ritu.split(' ')[0] ?? 'Vasanta';
  const rituProf = CLASSICAL_RITU_PROFILES[rituKey] ?? CLASSICAL_RITU_PROFILES['Vasanta'];

  let kaalKey = 'Madhyahna';
  const sHouse = sun?.rasiHouseNumber ?? 1;
  if (sHouse === 12 || sHouse === 1 || sHouse === 2) kaalKey = 'Ushakaal';
  else if (sHouse === 11 || sHouse === 10) kaalKey = 'Pratushakaal';
  else if (sHouse === 9 || sHouse === 8) kaalKey = 'Madhyahna';
  else if (sHouse === 7 || sHouse === 6) kaalKey = 'Sayamkaal';
  else kaalKey = 'RatriKaal';
  const kaalProf = CLASSICAL_KAAL_PROFILES[kaalKey] ?? CLASSICAL_KAAL_PROFILES['Madhyahna'];

  const horaRes = getHoraReading(chart.ascendant.signIndex, chart.ascendant.degreeInSign);

  // Gregorian Birth Month
  const birthDateObj = new Date(chart.utcMs);
  const gregMonthNum = (birthDateObj.getUTCMonth() + 1);
  const gregMonthProf = CLASSICAL_GREGORIAN_MONTHS[gregMonthNum] ?? CLASSICAL_GREGORIAN_MONTHS[1];

  const seasonalDetails = {
    ayanaEn: ayanaData.nameEn,
    ayanaHi: ayanaData.nameHi,
    ayanaReadingEn: ayanaData.natureEn,
    ayanaReadingHi: ayanaData.natureHi,
    maasEn: monthName,
    maasHi: (isAdhika ? 'अधिक ' : '') + (({ Chaitra: 'चैत्र', Vaishakha: 'वैशाख', Jyeshtha: 'ज्येष्ठ', Ashadha: 'आषाढ़', Shravana: 'श्रावण', Bhadrapada: 'भाद्रपद', Ashwin: 'आश्विन', Kartika: 'कार्तिक', Margashirsha: 'मार्गशीर्ष', Pausha: 'पौष', Magha: 'माघ', Phalguna: 'फाल्गुन' } as Record<string, string>)[lunarMonth] ?? lunarMonth),
    isAdhika,
    maasReadingEn: maasProf.shastricResultEn,
    maasReadingHi: maasProf.shastricResultHi,
    rituEn: rituProf.nameEn,
    rituHi: rituProf.nameHi,
    rituReadingEn: rituProf.temperamentEn,
    rituReadingHi: rituProf.temperamentHi,
    kaalEn: kaalProf.nameEn,
    kaalHi: kaalProf.nameHi,
    kaalReadingEn: kaalProf.natureEn,
    kaalReadingHi: kaalProf.natureHi,
    horaEn: `${horaRes.horaLord} Hora (${horaRes.isOddSign ? 'Odd Sign' : 'Even Sign'})`,
    horaHi: `${horaRes.horaLordHi} होरा (${horaRes.isOddSign ? 'विषम राशि' : 'सम राशि'})`,
    horaReadingEn: horaRes.readingEn,
    horaReadingHi: horaRes.readingHi,
    gregorianMonthEn: gregMonthProf.monthNameEn,
    gregorianMonthHi: gregMonthProf.monthNameHi,
    gregorianReadingEn: gregMonthProf.archetypeEn,
    gregorianReadingHi: gregMonthProf.archetypeHi,
  };

  return { factors: interpretedFactors, summaryEn, summaryHi, navamshaLagna, tithiDetails, seasonalDetails };
}

export function computeDeepLifePredictions(chart: ChartData): DeepLifePredictionsReport {
  const classicalYogas = detectClassicalYogas(chart);
  const domains = DOMAINS.map((config) => buildDomain(chart, config, classicalYogas));
  const birthProfile = buildGeneralBirthProfile(chart);
  const supportive = domains.filter((d) => !d.keyStrengthsEn[0].startsWith('No clearly')).length;
  const challenging = domains.filter((d) => !d.watchoutsEn[0].startsWith('No major')).length;
  const executiveSummaryEn = 'Chart-specific synthesis: ' + birthProfile.summaryEn + ' ' + supportive + ' of ' + domains.length + ' domains contain identifiable supportive factors and ' + challenging + ' contain cautionary factors. Review each domain’s house-lord, planetary and divisional-chart evidence together; Dasha and Transit are interpreted separately.';
  const executiveSummaryHi = 'उपलब्ध कुंडली-प्रमाणों का व्यक्तिगत समन्वित विश्लेषण: ' + birthProfile.summaryHi + ' ' + domains.length + ' में से ' + supportive + ' क्षेत्रों में अनुकूल और ' + challenging + ' क्षेत्रों में सावधानी के संकेत मिले हैं। प्रत्येक क्षेत्र में भावेश, ग्रह और वर्ग-कुंडली के प्रमाण साथ पढ़ें; दशा और गोचर का फल अलग अनुभागों में दिया गया है।';
  const overallLifeScore = Math.round(domains.reduce((sum, d) => sum + d.score, 0) / domains.length);

  // Life Stature & Nobility Classification
  const lagnaLord = chart.planets.find((p) => p.id === SIGNS[chart.ascendant.signIndex]?.lord);
  const tenthLord = chart.planets.find((p) => p.id === SIGNS[(chart.ascendant.signIndex + 9) % 12]?.lord);
  const hasStrongLords =
    (lagnaLord && ['Exalted', 'Own Sign', 'Moolatrikona'].includes(lagnaLord.dignity)) ||
    (tenthLord && ['Exalted', 'Own Sign', 'Moolatrikona'].includes(tenthLord.dignity));

  let lifeStatureClassEn = 'Affluent, Dignified & Elite Class (समृद्ध व कुलीन वर्ग)';
  let lifeStatureClassHi = 'समृद्ध, कुलीन एवं सम्मानित वर्ग';
  let lifeStatureMeaningEn = 'Destined for sustained prosperity, high social esteem, institutional respect and comfortable assets.';
  let lifeStatureMeaningHi = 'समाज में स्थायी मान-सम्मान, सुदृढ़ आर्थिक संपन्नता, श्रेष्ठ पारिवारिक प्रतिष्ठा एवं आरामदायक जीवन।';

  if (hasStrongLords || overallLifeScore >= 68) {
    lifeStatureClassEn = 'Royal & Executive Administrative Class (राजसी व उच्च प्रशासनिक वर्ग)';
    lifeStatureClassHi = 'राजसी व उच्च प्रशासनिक वर्ग';
    lifeStatureMeaningEn = 'Destined for commanding executive authority, governance leadership, massive public respect and legacy building.';
    lifeStatureMeaningHi = 'प्रशासनिक व सामाजिक नेतृत्व, शीर्ष सम्मान, शासन व सत्ता से लाभ एवं ऐतिहासिक कीर्ति का योग।';
  } else if (overallLifeScore <= 45) {
    lifeStatureClassEn = 'Self-Made, Hardworking & Progressive Class (कर्मठ व स्वावलंबी वर्ग)';
    lifeStatureClassHi = 'कर्मठ, स्वावलंबी एवं प्रगतिशील मध्यम वर्ग';
    lifeStatureMeaningEn = 'Progresses through personal diligence, overcoming early hurdles to secure stable comfort past age 32.';
    lifeStatureMeaningHi = 'कठोर पुरुषार्थ से भाग्योदय; प्रारंभिक संघर्षों को पार कर आयु 32 के बाद स्थायी सुख व स्वावलंबन।';
  }

  // Golden Peak Rise Age Window
  const birthYear = Number((chart.input.date || '2000-01-01').split('-')[0]) || 2000;
  const primeAgeStart = 28;
  const primeAgeEnd = 36;
  const peakRiseAgeWindowEn = `Age ${primeAgeStart} to ${primeAgeEnd} Years (A.D. ${birthYear + primeAgeStart}–${birthYear + primeAgeEnd})`;
  const peakRiseAgeWindowHi = `आयु ${primeAgeStart} से ${primeAgeEnd} वर्ष (ई. सन् ${birthYear + primeAgeStart}–${birthYear + primeAgeEnd})`;

  // 3 Critical Life Testing / Crisis Eras
  const crisisErasEn = [
    `Age 22 to 24 (A.D. ${birthYear + 22}–${birthYear + 24}): Early career consolidation, academic testing and directional calibration`,
    `Age 38 to 41 (A.D. ${birthYear + 38}–${birthYear + 41}): Caution in major speculation/partnerships, restructuring investments`,
    `Age 52 to 54 (A.D. ${birthYear + 52}–${birthYear + 54}): Domestic responsibilities peak, joint and bone care, steady patience`,
  ];

  const crisisErasHi = [
    `आयु 22 से 24 वर्ष (ई. सन् ${birthYear + 22}–${birthYear + 24}): आरंभिक करियर का संघर्ष, दिशा भ्रम व शैक्षणिक परीक्षा काल`,
    `आयु 38 से 41 वर्ष (ई. सन् ${birthYear + 38}–${birthYear + 41}): आर्थिक निवेश में सतर्कता, व्यापारिक पुनर्गठन व स्वास्थ्य जांच काल`,
    `आयु 52 से 54 वर्ष (ई. सन् ${birthYear + 52}–${birthYear + 54}): पारिवारिक जिम्मेदारियों का दबाव, वात/जोड़ों की देखभाल व धैर्य काल`,
  ];

  const karmicMissionEn = 'Executive Leadership, Wealth Stewardship & Higher Institutional Dharma';
  const karmicMissionHi = 'संगठनात्मक नेतृत्व, स्थायी धन सृजन एवं उच्च संस्थागत धर्म का निर्वाह';

  return {
    overallLifeScore,
    lifeStatureClassEn,
    lifeStatureClassHi,
    lifeStatureMeaningEn,
    lifeStatureMeaningHi,
    peakRiseAgeWindowEn,
    peakRiseAgeWindowHi,
    crisisErasEn,
    crisisErasHi,
    karmicMissionEn,
    karmicMissionHi,
    executiveSummaryEn,
    executiveSummaryHi,
    domains,
    birthProfile,
    classicalYogas,
  };
}
