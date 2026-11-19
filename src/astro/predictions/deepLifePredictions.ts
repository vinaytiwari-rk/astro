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
}

export interface DeepLifePredictionsReport {
  /** Retained for compatibility; never presented as a statistical score. */
  overallLifeScore: number;
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
  const domainOutcome: Record<string, { en: string; hi: string }> = {
    personality: { en: 'The main life theme is self-direction, confidence and steady personal development.', hi: 'मुख्य जीवन-विषय आत्मनिर्णय, आत्मविश्वास और निरंतर व्यक्तित्व-विकास रहेगा।' },
    wealth: { en: 'The main outcome area is earning, savings and management of family resources.', hi: 'मुख्य फलित क्षेत्र आय, बचत और पारिवारिक संसाधनों का प्रबंधन है।' },
    career: { en: 'The main outcome area is work responsibility, professional growth and public standing.', hi: 'मुख्य फलित क्षेत्र कार्य-जिम्मेदारी, पेशेवर उन्नति और सामाजिक प्रतिष्ठा है।' },
    marriage: { en: 'The main outcome area is partnership, commitment and the quality of close relationships.', hi: 'मुख्य फलित क्षेत्र साझेदारी, प्रतिबद्धता और निकट संबंधों की गुणवत्ता है।' },
    health: { en: 'The main outcome area is vitality, daily habits and the need for consistent self-care.', hi: 'मुख्य फलित क्षेत्र जीवन-शक्ति, दैनिक आदतें और नियमित स्वास्थ्य-संरक्षण है।' },
    spirituality: { en: 'The main outcome area is learning, values, reflection and spiritual discipline.', hi: 'मुख्य फलित क्षेत्र अध्ययन, जीवन-मूल्य, आत्मचिंतन और आध्यात्मिक अनुशासन है।' },
  };
  const outcomeTheme = domainOutcome[config.id] ?? { en: 'This life area requires balanced judgement.', hi: 'इस जीवन-क्षेत्र में संतुलित विवेचन आवश्यक है।' };
  const predictionToneEn = hasSupport && hasCaution
    ? 'Supportive planetary factors create opportunities in this area, while the challenging placements indicate where delays, extra responsibility or uneven progress may arise.'
    : hasSupport
      ? 'The planetary pattern is supportive for progress and constructive outcomes in this area; the strongest results come through active use of the indicated strengths.'
      : hasCaution
        ? 'The planetary pattern places greater emphasis on patience, preparation and sustained effort in this area; progress may develop gradually.'
        : 'The available planetary factors give a mixed or indistinct picture in this area, with no single dominant trend emerging.';
  const predictionToneHi = hasSupport && hasCaution
    ? 'ग्रहस्थितियां इस क्षेत्र में अवसर और चुनौतियां दोनों दिखाती हैं। अनुकूल ग्रह प्रगति के अवसर देते हैं, जबकि चुनौतीपूर्ण स्थितियां विलंब, अतिरिक्त जिम्मेदारी या उतार-चढ़ाव ला सकती हैं।'
    : hasSupport
      ? 'ग्रहस्थितियां इस क्षेत्र में प्रगति और अनुकूल परिणामों का समर्थन करती हैं। उपलब्ध क्षमताओं का सक्रिय उपयोग करने से अच्छे अवसर विकसित हो सकते हैं।'
      : hasCaution
        ? 'ग्रहस्थितियां इस क्षेत्र में धैर्य, तैयारी और निरंतर प्रयास को अधिक महत्व देती हैं। प्रगति धीरे-धीरे विकसित हो सकती है।'
        : 'इस क्षेत्र में ग्रहस्थितियों से कोई एक प्रमुख प्रवृत्ति स्पष्ट नहीं होती; संकेत मिले-जुले हैं और परिणाम परिस्थितियों के अनुसार बदल सकते हैं।';
  const keySupportEn = strengthsEn[0] ? ' Key supportive chart factor: ' + strengthsEn[0] : '';
  const keyCautionEn = watchoutsEn[0] ? ' Key caution: ' + watchoutsEn[0] : '';
  const keySupportHi = strengthsHi[0] ? ' मुख्य अनुकूल कुंडली-आधार: ' + strengthsHi[0] : '';
  const keyCautionHi = watchoutsHi[0] ? ' मुख्य सावधानी: ' + watchoutsHi[0] : '';
  const predictionEn = outcomeTheme.en + ' ' + predictionToneEn + keySupportEn + keyCautionEn;
  const predictionHi = outcomeTheme.hi + ' ' + predictionToneHi + keySupportHi + keyCautionHi;
  const score = Math.max(25, Math.min(75, Math.round(50 + (count ? (balance / count) * 14 : 0))));
  const ratingEn = score >= 64 ? 'Very Good' : score <= 40 ? 'Challenging' : 'Moderate';
  const ratingHi = score >= 64 ? 'उत्तम' : score <= 40 ? 'चुनौतीपूर्ण' : 'मध्यम';
  const factorsEn = houseEn.join(' ') + ' Karakas: ' + config.karakas.join(', ') + '. ' + config.varga + ': ' + (vargaEvidence.length ? vargaEvidence.join('; ') : 'relevant placements unavailable') + '. Related yogas: ' + (yogaEvidence.length ? yogaEvidence.join('; ') : 'none identified in supplied yoga data') + '.';
  const factorsHi = houseHi.join(' ') + ' कारक ग्रह: ' + config.karakas.join(', ') + '। ' + config.varga + ': ' + (vargaEvidence.length ? vargaEvidence.join('; ') : 'संबंधित स्थिति उपलब्ध नहीं') + '। संबंधित योग: ' + (yogaEvidence.length ? yogaEvidence.join('; ') : 'प्रदत्त योग-डेटा में कोई संबंधित योग दर्ज नहीं') + '।';
  return {
    id: config.id, titleEn: config.titleEn, titleHi: config.titleHi, icon: config.icon, score, ratingEn, ratingHi,
    summaryEn, summaryHi, predictionEn, predictionHi,
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
  const weekdayReadings: Record<string, { en: string; hi: string }> = {
    Sun: { en: 'Sunday birth is traditionally linked with solar themes: self-respect, visibility, leadership and responsibility. The Sun’s dignity, house and aspects decide how these themes express.', hi: 'रविवार का जन्म परंपरागत रूप से सूर्य के गुण—आत्मसम्मान, पहचान, नेतृत्व और उत्तरदायित्व—से जोड़ा जाता है। इनका वास्तविक रूप सूर्य की राशि, भाव, बल और दृष्टियों से तय होगा।' },
    Moon: { en: 'Monday birth is traditionally associated with the Moon: sensitivity, care, adaptability and public connection. The Moon’s strength and associations qualify this reading.', hi: 'सोमवार का जन्म चंद्रमा के गुण—संवेदनशीलता, देखभाल, अनुकूलन और जन-संपर्क—से जोड़ा जाता है। चंद्रमा का बल और युति-दृष्टि इस संकेत को बदलते हैं।' },
    Mars: { en: 'Tuesday birth is linked with Mars: initiative, courage, competitiveness and decisive action. Its condition shows whether these become constructive drive or impatience.', hi: 'मंगलवार का जन्म मंगल के गुण—पहल, साहस, प्रतिस्पर्धा और निर्णय-क्षमता—से जुड़ा है। मंगल की स्थिति बताएगी कि ये गुण रचनात्मक साहस बनेंगे या अधीरता।' },
    Mercury: { en: 'Wednesday birth is linked with Mercury: learning, communication, calculation, trade and practical intelligence. Mercury’s condition and house lordships refine the result.', hi: 'बुधवार का जन्म बुध के गुण—सीखना, संवाद, गणना, व्यापार और व्यावहारिक बुद्धि—से जुड़ा है। बुध का बल, भाव और स्वामित्व फल को स्पष्ट करेंगे।' },
    Jupiter: { en: 'Thursday birth is traditionally associated with Jupiter: knowledge, ethics, counsel, teaching, faith and expansion. A strong, well-supported Jupiter can make these themes more constructive; affliction may bring overconfidence or inconsistent judgement.', hi: 'गुरुवार का जन्म परंपरागत रूप से गुरु के गुण—ज्ञान, नैतिकता, सलाह, शिक्षा, आस्था और विस्तार—से जुड़ा माना जाता है। बलवान व शुभ-संबद्ध गुरु इन गुणों को निखार सकता है; पीड़ित गुरु में अति-आशावाद या निर्णय में असंगति दिख सकती है।' },
    Venus: { en: 'Friday birth is associated with Venus: relationships, aesthetics, comfort, diplomacy and artistic appreciation. Venus’s dignity and afflictions show how balanced these themes are.', hi: 'शुक्रवार का जन्म शुक्र के गुण—संबंध, सौंदर्य-बोध, सुविधा, कूटनीति और कला-रुचि—से जुड़ा है। शुक्र का बल और पीड़ा इन गुणों की सहजता बताते हैं।' },
    Saturn: { en: 'Saturday birth is traditionally linked with Saturn: discipline, patience, duty, endurance and gradual achievement. Saturn’s condition distinguishes steady maturity from avoidable delay or heaviness.', hi: 'शनिवार का जन्म शनि के गुण—अनुशासन, धैर्य, कर्तव्य, सहनशीलता और क्रमिक उपलब्धि—से जुड़ा है। शनि की स्थिति परिपक्व स्थिरता और अनावश्यक विलंब के बीच अंतर स्पष्ट करती है।' },
  };
  const tithiGroup = (n: number) => n % 5 === 1 ? 'Nanda' : n % 5 === 2 ? 'Bhadra' : n % 5 === 3 ? 'Jaya' : n % 5 === 4 ? 'Rikta' : 'Purna';
  const tithiGroupHi: Record<string,string> = {
    Nanda: 'नंदा', Bhadra: 'भद्रा', Jaya: 'जया', Rikta: 'रिक्ता', Purna: 'पूर्णा',
  };
  switch (id) {
    case 'weekday':
      return weekdayReadings[weekday?.lord ?? ''] ?? { en: 'The weekday lord is ' + (weekday?.lord ?? 'unavailable') + ', traditionally associated with its characteristic qualities and life themes.', hi: 'इस जन्म का वारेश ' + (weekday?.lord ?? 'उपलब्ध नहीं') + ' है, जो अपने पारंपरिक गुणों और जीवन-विषयों से जुड़ा है।' };
    case 'tithi':
      if (tithi?.number === 15 && tithi.paksha === 'Shukla') return { en: 'Purnima birth: the Moon is near its full phase. Tradition associates this with emotional visibility, receptivity and fullness; the Moon’s strength, sign and afflictions decide the personal expression.', hi: 'पूर्णिमा जन्म: चंद्रमा पूर्ण कला के निकट होता है। परंपरा इसे भावनात्मक अभिव्यक्ति, ग्रहणशीलता और पूर्णता से जोड़ती है; वास्तविक फल चंद्रबल, राशि और पीड़ा से तय होगा।' };
      if (tithi?.number === 30 || (tithi?.number === 15 && tithi.paksha === 'Krishna')) return { en: 'Amavasya / new-Moon birth: Sun and Moon are closely united. Traditional readings emphasize inwardness, reflection and the need to assess lunar strength and combustion carefully.', hi: 'अमावस्या जन्म: सूर्य और चंद्रमा निकट युति में होते हैं। पारंपरिक व्याख्या अंतर्मुखता और आत्मचिंतन पर बल देती है; चंद्रबल तथा सूर्य-समीपता को ध्यान से देखना चाहिए।' };
      return { en: 'Tithi ' + valueEn + ' belongs to the ' + tithiGroup(tithi?.number ?? 1) + ' group (' + tithiGroupHi[tithiGroup(tithi?.number ?? 1)] + '), traditionally associated with the qualities of this lunar day.', hi: 'यह तिथि ' + (tithiGroupHi[tithiGroup(tithi?.number ?? 1)]) + ' वर्ग की है और पारंपरिक रूप से इस चंद्र-दिवस के स्वभाव तथा कार्य-प्रवृत्ति से जुड़ी मानी जाती है।' };
    case 'paksha':
      return tithi?.paksha === 'Shukla'
        ? { en: 'Shukla Paksha is the waxing lunar half; traditional interpretation emphasizes growth, outward development and increasing visibility.', hi: 'शुक्ल पक्ष में चंद्रमा की कला बढ़ती है; पारंपरिक रूप से इसे विकास, बाहरी सक्रियता और क्रमशः बढ़ती अभिव्यक्ति से जोड़ा जाता है।' }
        : { en: 'Krishna Paksha is the waning lunar half; traditional interpretation emphasizes reflection, consolidation, release and inward processing.', hi: 'कृष्ण पक्ष में चंद्रमा की कला घटती है; पारंपरिक रूप से इसे आत्मचिंतन, समेकन, त्याग और अंतर्मुखी प्रक्रिया से जोड़ा जाता है।' };
    case 'maas': return { en: 'The lunar month ' + valueEn + ' is traditionally associated with seasonal rhythm, observances and the temperament of the birth period.', hi: 'चंद्र मास ' + valueHi + ' पारंपरिक पंचांग में ऋतु, पर्व-परंपरा और जन्मकालीन सांस्कृतिक वातावरण से जुड़ा है।' };
    case 'ritu': return { en: 'Hemanta birth is traditionally associated with measured conduct, endurance, planning and preference for stability. Saturn, the Moon and the ascendant show how these qualities shape the native’s temperament.', hi: 'हेमंत ऋतु में जन्म परंपरागत रूप से गंभीरता, धैर्य, योजनाबद्ध कार्य और स्थिरता की प्रवृत्ति से जोड़ा जाता है। शनि, चंद्रमा और लग्न इन गुणों की वास्तविक अभिव्यक्ति बताते हैं।' };
    case 'prahar': return { en: 'Prahar records the birth time within the day or night cycle and is traditionally associated with the activity and temperament of that period.', hi: 'प्रहर दिन-रात्रि चक्र में जन्म का समय बताता है और उस अवधि की पारंपरिक कार्य-प्रवृत्ति तथा स्वभाव से जुड़ा है।' };
    case 'karana': return { en: 'Karana is half a tithi and traditionally describes the practical tone, initiative and working style associated with the birth moment.', hi: 'करण तिथि का आधा भाग है और पारंपरिक रूप से जन्मकालीन कार्य-शैली, पहल तथा व्यवहारिक प्रवृत्ति से जुड़ा माना जाता है।' };
    case 'surya-yoga': return { en: 'Nitya Yoga is calculated from the combined longitudes of Sun and Moon. It describes a traditional birth-time quality and is distinct from planetary Raja/Dhana yogas.', hi: 'नित्य योग सूर्य और चंद्रमा के संयुक्त अंशों से निकलता है। यह जन्म-समय का पंचांग संकेत है और ग्रहों से बनने वाले राजयोग/धनयोग से अलग है।' };
    case 'varna': return { en: valueEn + ' Varna is traditionally associated with a style of learning, responsibility and social contribution in classical matching descriptions.', hi: 'राशि-वर्ण ' + valueHi + ' पारंपरिक मिलान-विवेचन में अध्ययन, उत्तरदायित्व और सामाजिक योगदान की प्रवृत्ति से जोड़ा जाता है।' };
    case 'vashya': return { en: valueEn + ' Vashya describes the traditional interaction style associated with the Moon sign, including adaptability, initiative and rapport.', hi: 'वश्य की ' + valueHi + ' श्रेणी चंद्र राशि से जुड़ी पारंपरिक व्यवहार-शैली, अनुकूलन, पहल और पारस्परिक तालमेल को दर्शाती है।' };
    case 'yoni': return { en: 'Yoni is a Nakshatra-based symbolic classification used in traditional compatibility readings, describing instinctive preferences and relational temperament.', hi: 'योनि नक्षत्र-आधारित प्रतीकात्मक श्रेणी है, जिसका पारंपरिक मिलान में उपयोग स्वभावगत पसंद और संबंधों की प्रवृत्ति समझने के लिए किया जाता है।' };
    case 'gana': return { en: valueEn + ' Gana is traditionally associated with a characteristic style of temperament, conduct and interpersonal response.', hi: valueHi + ' गण पारंपरिक रूप से स्वभाव, व्यवहार और पारस्परिक प्रतिक्रिया की विशिष्ट प्रवृत्ति से जुड़ा है।' };
    case 'nadi': return { en: valueEn + ' Nadi is one of the three traditional Nakshatra classifications and is used in Ashtakoota matching to describe a temperament category.', hi: valueHi + ' नाड़ी नक्षत्र की तीन पारंपरिक श्रेणियों में से एक है और अष्टकूट मिलान में स्वभाव-वर्ग के रूप में प्रयुक्त होती है।' };
    case 'nadi-pad': return { en: valueEn + ' combines the Nakshatra Nadi and Pada used in traditional Ashtakoota classification.', hi: valueHi + ' नक्षत्र की नाड़ी और चरण को मिलाकर अष्टकूट की पारंपरिक श्रेणी बताता है।' };
    case 'tattva': return { en: 'The Moon-sign element gives a symbolic emotional-response style: Fire—initiative, Earth—stability, Air—ideas and exchange, Water—sensitivity. Confirm it with Moon strength and aspects.', hi: 'चंद्र राशि का तत्त्व भावनात्मक प्रतिक्रिया का प्रतीकात्मक ढंग बताता है: अग्नि—पहल, पृथ्वी—स्थिरता, वायु—विचार व संवाद, जल—संवेदनशीलता। चंद्रबल और दृष्टियों से पुष्टि करें।' };
    case 'paya': return { en: 'Paya is a regional traditional classification based on the Moon’s house from the Ascendant, associated with the customary symbolism of the birth period.', hi: 'पाया लग्न से चंद्रमा की भाव-स्थिति पर आधारित क्षेत्रीय पारंपरिक वर्गीकरण है, जिसे जन्मकालीन परिस्थितियों के प्रतीकात्मक संकेत के रूप में देखा जाता है।' };
    case 'naam-akshar': return { en: 'The birth syllable is assigned from the Nakshatra Pada and is traditionally used as the opening sound for naming.', hi: 'जन्माक्षर नक्षत्र के चरण से निर्धारित होता है और पारंपरिक रूप से नामकरण के प्रारंभिक अक्षर के रूप में प्रयुक्त होता है।' };
    case 'nakshatra-charan': return { en: 'Nakshatra and Pada refine the Moon’s symbolic field and are read with the Nakshatra lord, Moon condition and occupied house.', hi: 'नक्षत्र और चरण चंद्रमा के प्रतीकात्मक स्वभाव को सूक्ष्म करते हैं। इन्हें नक्षत्रेश, चंद्रमा की स्थिति और भाव के साथ पढ़ना चाहिए।' };
    case 'atmakaraka': return { en: valueEn + ' is the Jaimini Atmakaraka, highlighting the central themes of inner development, responsibility and personal growth.', hi: valueHi + ' जैमिनी आत्मकारक है, जो आंतरिक विकास, उत्तरदायित्व और व्यक्तिगत परिपक्वता के प्रमुख विषयों को दर्शाता है।' };
    case 'ishta-dev': return { en: valueEn + ' is the devotional indication derived from the Jaimini Karakamsha method and may be used as a focus for personal prayer or reflection.', hi: valueHi + ' जैमिनी कारकांश पद्धति से प्राप्त उपास्य संकेत है, जिसे व्यक्तिगत प्रार्थना और आत्मचिंतन का केंद्र बनाया जा सकता है।' };
    default: return { en: valueEn + ' is a traditional birth classification associated with the qualities of this Panchanga or Nakshatra factor.', hi: valueHi + ' इस पंचांग अथवा नक्षत्र कारक का पारंपरिक जन्म-वर्गीकरण है, जो उससे जुड़े गुणों को दर्शाता है।' };
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
  return { factors: interpretedFactors, summaryEn, summaryHi };
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
  return { overallLifeScore, executiveSummaryEn, executiveSummaryHi, domains, birthProfile, classicalYogas };
}
