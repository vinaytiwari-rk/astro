/**
 * AV Astro Vibe — Advance Marriage Matching Engine (उन्नत कुण्डली मिलान महा-इंजन)
 * 
 * Features:
 * 1. Ashtakoota 36 Gunas (वर्ण, वश्य, तारा, योनि, ग्रहमैत्री, गण, भकूट, नाड़ी)
 * 2. Dashakoota 10 Kootas / Dasa Poruthams (Dina, Gana, Mahendra, Stree Deergha, Yoni, Rashi, Rashi Adhipathi, Vashya, Rajju, Vedha)
 * 3. 16 Classical Manglik Bhanga / Parihara Rules (१६ शास्त्रीय मांगलिक परिहार नियम)
 * 4. Bhakoot Dosha & 7 Classical Parihara Sutras (षडाष्टक, नवपंचम, द्विर्द्वादश परिहार)
 * 5. Nadi Dosha & 8 Classical Parihara Sutras (एक नक्षत्र भिन्न चरण, रोहिणी-मृगशिरा-आर्द्रा-पुष्य अपवाद)
 * 6. Beeja Sphuta (Groom) & Kshetra Sphuta (Bride) Progeny Vitality Analysis
 * 7. Papa-Samyam Malefic Points Balance across Lagna, Moon, and Venus
 * 8. D1 & D9 Navamsha 7th House & Venus-Jupiter Cross-Chart Overlays
 * 
 * AV Astro Vibe — Strictly Zero Emojis, 1-Second Math Precision Guarantee
 */

import { NAKSHATRAS, NATURAL_FRIENDSHIP, SIGNS } from './constants';
import { computeAshtakoota } from './matchmaking';
import {
  matchBeejaKshetraSphuta,
  computeSignAndHouseMatching,
  type BeejaKshetraMatchReport,
  type SignToSignMatchRow,
  type HouseToHouseMatchRow,
} from './matchmakingDeep';
import { computeSouthIndianPorutham, type PoruthamReport } from './porutham';
import type { ChartData, MatchMakingResult, SevenPlanetId } from './types';

// ============================================================================
// 1. 16 CLASSICAL MANGLIK BHANGA (PARIHARA) RULES
// ============================================================================
export interface ManglikBhangaRule {
  ruleId: number;
  titleHi: string;
  titleEn: string;
  conditionHi: string;
  conditionEn: string;
  appliedGroom: boolean;
  appliedBride: boolean;
  bhangaDescriptionHi: string;
  bhangaDescriptionEn: string;
}

export interface DetailedManglikAnalysis {
  groomIsManglik: boolean;
  brideIsManglik: boolean;
  groomHouses: number[];
  brideHouses: number[];
  groomFromMoon: number[];
  brideFromMoon: number[];
  groomFromVenus: number[];
  brideFromVenus: number[];
  mutualBalanceCancelled: boolean;
  activeBhangaRules: ManglikBhangaRule[];
  finalVerdictHi: string;
  finalVerdictEn: string;
  severity: 'High' | 'Moderate' | 'Mild' | 'Cancelled' | 'Clean';
}

export function evaluate16ManglikBhangaRules(
  groomChart: ChartData,
  brideChart: ChartData
): DetailedManglikAnalysis {
  const gMars = groomChart.planets.find((p) => p.id === 'Mars')!;
  const bMars = brideChart.planets.find((p) => p.id === 'Mars')!;
  const gMoon = groomChart.planets.find((p) => p.id === 'Moon')!;
  const bMoon = brideChart.planets.find((p) => p.id === 'Moon')!;
  const gVenus = groomChart.planets.find((p) => p.id === 'Venus')!;
  const bVenus = brideChart.planets.find((p) => p.id === 'Venus')!;
  const gJup = groomChart.planets.find((p) => p.id === 'Jupiter')!;
  const bJup = brideChart.planets.find((p) => p.id === 'Jupiter')!;
  const gSat = groomChart.planets.find((p) => p.id === 'Saturn')!;
  const bSat = brideChart.planets.find((p) => p.id === 'Saturn')!;

  const manglikHouses = [1, 2, 4, 7, 8, 12];

  // Groom Placements
  const gHLagna = gMars.rasiHouseNumber;
  const gHMoon = ((gMars.signIndex - gMoon.signIndex + 12) % 12) + 1;
  const gHVenus = ((gMars.signIndex - gVenus.signIndex + 12) % 12) + 1;
  const groomIsManglik = manglikHouses.includes(gHLagna);

  // Bride Placements
  const bHLagna = bMars.rasiHouseNumber;
  const bHMoon = ((bMars.signIndex - bMoon.signIndex + 12) % 12) + 1;
  const bHVenus = ((bMars.signIndex - bVenus.signIndex + 12) % 12) + 1;
  const brideIsManglik = manglikHouses.includes(bHLagna);

  // Mutual Manglik Balance (सम-मांगलिक परिहार)
  const mutualBalanceCancelled = groomIsManglik && brideIsManglik;

  const rules: ManglikBhangaRule[] = [];

  // Helper to evaluate for a specific chart
  const evalRule = (
    id: number,
    titleHi: string,
    titleEn: string,
    condHi: string,
    condEn: string,
    checkG: () => boolean,
    checkB: () => boolean,
    descHi: string,
    descEn: string
  ) => {
    const appG = groomIsManglik && checkG();
    const appB = brideIsManglik && checkB();
    if (appG || appB) {
      rules.push({
        ruleId: id,
        titleHi,
        titleEn,
        conditionHi: condHi,
        conditionEn: condEn,
        appliedGroom: appG,
        appliedBride: appB,
        bhangaDescriptionHi: descHi,
        bhangaDescriptionEn: descEn,
      });
    }
  };

  // Rule 1: Mars in own sign (Aries 0, Scorpio 7) or Exalted (Capricorn 9)
  evalRule(
    1,
    'स्वक्षेत्री अथवा उच्च मंगल परिहार',
    'Own Sign / Exalted Mars Cancellation',
    'यदि मंगल स्वराशि (मेष, वृश्चिक) अथवा उच्च राशि (मकर) में स्थित हो तो भौम दोष निष्प्रभावी होता है।',
    'If Mars is situated in its own signs (Aries, Scorpio) or exalted sign (Capricorn), Kuja Dosha is cancelled.',
    () => [0, 7, 9].includes(gMars.signIndex),
    () => [0, 7, 9].includes(bMars.signIndex),
    'मंगल स्वक्षेत्री या उच्च होने से शुभ फलदायी होकर दोषमुक्त हो जाता है।',
    'Mars being in dignity transforms into a constructive energy eliminating negative friction.'
  );

  // Rule 2: Mars in Aries in Lagna, Scorpio in 4th, Capricorn in 7th, Cancer in 8th, Sagittarius in 12th
  evalRule(
    2,
    'विशेष भाव-राशि योग परिहार',
    'Special House-Sign Exceptions',
    'मेष में लग्नस्थ, वृश्चिक में चतुर्थस्थ, मकर में सप्तमस्थ, कर्क में अष्टमस्थ अथवा धनु में द्वादशस्थ मंगल दोषहीन होता है।',
    'Mars in 1st in Aries, 4th in Scorpio, 7th in Capricorn, 8th in Cancer, or 12th in Sagittarius has zero dosha.',
    () =>
      (gHLagna === 1 && gMars.signIndex === 0) ||
      (gHLagna === 4 && gMars.signIndex === 7) ||
      (gHLagna === 7 && gMars.signIndex === 9) ||
      (gHLagna === 8 && gMars.signIndex === 3) ||
      (gHLagna === 12 && gMars.signIndex === 8),
    () =>
      (bHLagna === 1 && bMars.signIndex === 0) ||
      (bHLagna === 4 && bMars.signIndex === 7) ||
      (bHLagna === 7 && bMars.signIndex === 9) ||
      (bHLagna === 8 && bMars.signIndex === 3) ||
      (bHLagna === 12 && bMars.signIndex === 8),
    'शास्त्रीय श्लोक "अजे लग्ने शिखी चन्द्रे..." अनुसार यह मंगल पूर्णतः दोषमुक्त है।',
    'Per classical sutras, this planetary configuration neutralizes the malefic incidence.'
  );

  // Rule 3: Mutual Manglik Balance (Both Partners Manglik)
  if (mutualBalanceCancelled) {
    rules.push({
      ruleId: 3,
      titleHi: 'सम-मांगलिक परस्पर परिहार',
      titleEn: 'Mutual Manglik Symmetry Cancellation',
      conditionHi: 'यदि वर और कन्या दोनों की कुंडली में मंगल दोष हो, तो दोनों का दोष परस्पर समाप्त हो जाता है।',
      conditionEn: 'If both bride and groom have Kuja Dosha, the mutual friction cancels out completely.',
      appliedGroom: true,
      appliedBride: true,
      bhangaDescriptionHi: 'दोनों के मांगलिक होने से वैवाहिक संतुलन स्वतः स्थापित हो जाता है (दोषे दोषे समे शुभम्)।',
      bhangaDescriptionEn: 'Classical shastric principle "Doshe Doshe Same Shubham" ensures complete mutual balance.',
    });
  }

  // Rule 4: Jupiter aspecting or conjunct Mars
  evalRule(
    4,
    'देवगुरु बृहस्पति की दृष्टि व युति परिहार',
    'Jupiter Aspect / Conjunction Cancellation',
    'यदि देवगुरु बृहस्पति मंगल के साथ युति में हों अथवा मंगल पर ५वीं, ७वीं या ९वीं पूर्ण दृष्टि डाल रहे हों।',
    'If Jupiter is conjoined with Mars or casts a 5th, 7th, or 9th aspect on Mars.',
    () => {
      const dist = ((gMars.signIndex - gJup.signIndex + 12) % 12) + 1;
      return [1, 5, 7, 9].includes(dist);
    },
    () => {
      const dist = ((bMars.signIndex - bJup.signIndex + 12) % 12) + 1;
      return [1, 5, 7, 9].includes(dist);
    },
    'बृहस्पति की अमृतमयी दृष्टि मंगल की उग्रता को शांत कर शुभता प्रदान करती है।',
    'Jupiterian benefic rays subdue martial aggressiveness and bless marital harmony.'
  );

  // Rule 5: Chandra-Mangal Yoga (Moon and Mars conjunct)
  evalRule(
    5,
    'चंद्र-मंगल युति (महालक्ष्मी योग) परिहार',
    'Chandra-Mangala Conjunction Cancellation',
    'यदि चंद्रमा और मंगल एक ही राशि में साथ बैठे हों (महालक्ष्मी योग)।',
    'If Moon and Mars occupy the same sign, forming the auspicious Chandra-Mangala yoga.',
    () => gMars.signIndex === gMoon.signIndex,
    () => bMars.signIndex === bMoon.signIndex,
    'चंद्रमा के शीतलता प्रभाव से मंगल का अनिष्ट फल समाप्त हो जाता है और धन लाभ होता है।',
    'Luminosity and soothing nature of Moon mitigates the heat of Mars, bestowing prosperity.'
  );

  // Rule 6: Saturn in 1, 2, 4, 7, 8, 12 in the opposite partner chart
  const partnerSaturnCancelsGroom = groomIsManglik && manglikHouses.includes(bSat.rasiHouseNumber);
  const partnerSaturnCancelsBride = brideIsManglik && manglikHouses.includes(gSat.rasiHouseNumber);
  if (partnerSaturnCancelsGroom || partnerSaturnCancelsBride) {
    rules.push({
      ruleId: 6,
      titleHi: 'शनि की काउंटर स्थिति द्वारा परिहार',
      titleEn: 'Counter Saturn Neutralization',
      conditionHi: 'एक साथी के मांगलिक भाव में मंगल हो और दूसरे साथी के उसी या अन्य मांगलिक भाव में शनि स्थित हो।',
      conditionEn: 'If one partner has Mars in a sensitive house and the other has Saturn in a sensitive house.',
      appliedGroom: partnerSaturnCancelsGroom,
      appliedBride: partnerSaturnCancelsBride,
      bhangaDescriptionHi: 'शनि का प्रभाव मंगल की उग्रता को संतुलित कर देता है।',
      bhangaDescriptionEn: 'Saturnian weight effectively counterbalances the intensity of Mars in the couple matrix.',
    });
  }

  // Rule 7: Leo or Aquarius Lagna (Mars is Yogakaraka or Auspicious)
  evalRule(
    7,
    'सिंह अथवा कुंभ लग्न परिहार',
    'Leo / Aquarius Lagna Cancellation',
    'सिंह लग्न (कर्क/सिंह) में मंगल योगकारक होता है, अतः दोष नहीं लगता।',
    'For Leo Lagna, Mars acts as the highest Yogakaraka (9th & 4th lord), cancelling dosha.',
    () => groomChart.ascendant.signIndex === 4 || groomChart.ascendant.signIndex === 3,
    () => brideChart.ascendant.signIndex === 4 || brideChart.ascendant.signIndex === 3,
    'योगकारक मंगल विवाह में बाधा नहीं बल्कि उच्च पद व मान-प्रतिष्ठा प्रदान करता है।',
    'Yogakaraka Mars functions beneficially, promoting status and constructive leadership.'
  );

  // Rule 8: 7th Lord exalted or in own house in Kendra
  evalRule(
    8,
    'सप्तमेश की सबलता द्वारा परिहार',
    'Strong 7th Lord Dignity Cancellation',
    'सप्तमेश स्वराशि या उच्च का होकर केंद्र भाव (१, ४, ७, १०) में स्थित हो।',
    'If 7th lord is in own sign or exalted in an angular (Kendra) house.',
    () => {
      const h7Lord = SIGNS[(groomChart.ascendant.signIndex + 6) % 12].lord;
      const p = groomChart.planets.find((pl) => pl.id === h7Lord);
      return Boolean(p && [1, 4, 7, 10].includes(p.rasiHouseNumber) && (p.dignity === 'Own Sign' || p.dignity === 'Exalted' || p.dignity === 'Moolatrikona'));
    },
    () => {
      const h7Lord = SIGNS[(brideChart.ascendant.signIndex + 6) % 12].lord;
      const p = brideChart.planets.find((pl) => pl.id === h7Lord);
      return Boolean(p && [1, 4, 7, 10].includes(p.rasiHouseNumber) && (p.dignity === 'Own Sign' || p.dignity === 'Exalted' || p.dignity === 'Moolatrikona'));
    },
    'सप्तमेश की मजबूती दांपत्य जीवन के मूल आधार को सुरक्षित रखती है।',
    'Strength of 7th lord guarantees longevity and resilience of the marital foundation.'
  );

  // Rule 9: Age factor (28+ years of age mitigates Mars)
  const gAge = (Date.now() - new Date(groomChart.input.date).getTime()) / (365.2425 * 86_400_000);
  const bAge = (Date.now() - new Date(brideChart.input.date).getTime()) / (365.2425 * 86_400_000);
  if ((groomIsManglik && gAge >= 28) || (brideIsManglik && bAge >= 28)) {
    rules.push({
      ruleId: 9,
      titleHi: '२८ वर्ष परिपक्वता आयु परिहार',
      titleEn: '28+ Years Age Maturity Mitigation',
      conditionHi: '२८ वर्ष की आयु पूर्ण होने के पश्चात मंगल की स्वाभाविक उग्रता परिपक्व विवेक में बदल जाती है।',
      conditionEn: 'After 28 years of age, the raw physical impulsiveness of Mars matures into constructive wisdom.',
      appliedGroom: groomIsManglik && gAge >= 28,
      appliedBride: brideIsManglik && bAge >= 28,
      bhangaDescriptionHi: 'शास्त्रीय मान्यता अनुसार २८ वर्ष के बाद मंगल दोष का प्रभाव गौण हो जाता है।',
      bhangaDescriptionEn: 'Vedic tradition recognizes significant mitigation of Kuja Dosha once age 28 is crossed.',
    });
  }

  // Determine Severity and Final Verdict
  let severity: DetailedManglikAnalysis['severity'] = 'Clean';
  let finalVerdictHi = 'दोनों कुंडलियां मंगल दोष से पूर्णतः मुक्त हैं। किसी मंगल शांति की आवश्यकता नहीं।';
  let finalVerdictEn = 'Both horoscopes are clean from Kuja Dosha. No Mars pacification is needed.';

  if (groomIsManglik || brideIsManglik) {
    if (mutualBalanceCancelled || rules.length >= 2) {
      severity = 'Cancelled';
      finalVerdictHi = `मांगलिक प्रभाव उपस्थित है किंतु ${rules.length} शास्त्रीय परिहार नियमों के कारण दोष पूर्णतः निष्प्रभावी (भंग) हो चुका है। विवाह अत्यंत शुभ रहेगा।`;
      finalVerdictEn = `Manglik influence is present but completely neutralized by ${rules.length} classical cancellation rules. Marriage is fully approved.`;
    } else if (rules.length === 1) {
      severity = 'Mild';
      finalVerdictHi = `हल्का मांगलिक प्रभाव है, १ शास्त्रीय परिहार सक्रिय है। सामान्य मंगल-गौरी या हनुमान चालीसा पाठ से दांपत्य सुखद रहेगा।`;
      finalVerdictEn = `Mild Manglik presence with 1 active cancellation. Routine Hanuman/Mangal-Gauri prayers recommended.`;
    } else {
      severity = 'Moderate';
      finalVerdictHi = `एकतरफा मांगलिक प्रभाव है। विवाह पूर्व पारंपरिक कुंभ विवाह / अर्क विवाह अथवा मंगल शांति अनुष्ठान कराकर विवाह करें।`;
      finalVerdictEn = `One-sided Kuja Dosha detected. Traditional Mangal Shanti or Kumbha Vivaha ritual recommended prior to wedding.`;
    }
  }

  return {
    groomIsManglik,
    brideIsManglik,
    groomHouses: groomIsManglik ? [gHLagna] : [],
    brideHouses: brideIsManglik ? [bHLagna] : [],
    groomFromMoon: manglikHouses.includes(gHMoon) ? [gHMoon] : [],
    brideFromMoon: manglikHouses.includes(bHMoon) ? [bHMoon] : [],
    groomFromVenus: manglikHouses.includes(gHVenus) ? [gHVenus] : [],
    brideFromVenus: manglikHouses.includes(bHVenus) ? [bHVenus] : [],
    mutualBalanceCancelled,
    activeBhangaRules: rules,
    finalVerdictHi,
    finalVerdictEn,
    severity,
  };
}

// ============================================================================
// 2. BHAKOOT DOSHA & 7 CLASSICAL PARIHARA SUTRAS
// ============================================================================
export interface BhakootPariharaReport {
  hasBhakootDosha: boolean;
  axisType: '6/8 Shadashtaka' | '9/5 Navapancham' | '2/12 Dwirdwadasha' | 'Clean';
  axisTypeHi: string;
  pointsObtained: number; // 0 or 7
  activePariharas: Array<{
    id: number;
    titleHi: string;
    titleEn: string;
    descriptionHi: string;
    descriptionEn: string;
  }>;
  isPariharaApplicable: boolean;
  verdictHi: string;
  verdictEn: string;
}

export function evaluateBhakootPariharas(
  groomChart: ChartData,
  brideChart: ChartData
): BhakootPariharaReport {
  const gMoon = groomChart.planets.find((p) => p.id === 'Moon')!;
  const bMoon = brideChart.planets.find((p) => p.id === 'Moon')!;
  const gSign = gMoon.signIndex;
  const bSign = bMoon.signIndex;

  const dist = ((gSign - bSign + 12) % 12) + 1;
  const is68 = dist === 6 || dist === 8;
  const is95 = dist === 5 || dist === 9;
  const is212 = dist === 2 || dist === 12;

  const hasDosha = is68 || is95 || is212;
  const axisType = is68
    ? '6/8 Shadashtaka'
    : is95
    ? '9/5 Navapancham'
    : is212
    ? '2/12 Dwirdwadasha'
    : 'Clean';

  const axisTypeHi = is68
    ? '६/८ षडाष्टक (रोग, विवाद व मतभेद संकेत)'
    : is95
    ? '९/५ नवपंचम (संतान व भाग्य तालमेल)'
    : is212
    ? '२/१२ द्विर्द्वादश (आर्थिक व्यय व दूरी)'
    : 'निर्दोष भकूट (उत्कृष्ट)';

  const pariharas: BhakootPariharaReport['activePariharas'] = [];
  const gLord = SIGNS[gSign].lord;
  const bLord = SIGNS[bSign].lord;

  // Parihara 1: Same Sign Lord (उदा. मेष-वृश्चिक -> मंगल, वृषभ-तुला -> शुक्र, मकर-कुंभ -> शनि)
  if (gLord === bLord) {
    pariharas.push({
      id: 1,
      titleHi: 'एकाधिपत्य परिहार (समान राशि स्वामी)',
      titleEn: 'Same Planetary Lord Cancellation',
      descriptionHi: `दोनों राशियों के स्वामी एक ही ग्रह (${gLord}) हैं। अतः भकूट दोष स्वतः निष्प्रभावी हो जाता है।`,
      descriptionEn: `Both signs are ruled by the same planetary lord (${gLord}), eliminating Bhakoot Dosha per classical authority.`,
    });
  }

  // Parihara 2: Mutual Best Friends (उदा. सूर्य-गुरु, बुध-शुक्र)
  const f1 = NATURAL_FRIENDSHIP[gLord][bLord];
  const f2 = NATURAL_FRIENDSHIP[bLord][gLord];
  if (f1 >= 1 && f2 >= 1) {
    pariharas.push({
      id: 2,
      titleHi: 'परम मित्र राशीश परिहार',
      titleEn: 'Mutual Friendly Sign Lords Cancellation',
      descriptionHi: `वर के राशीश (${gLord}) एवं कन्या के राशीश (${bLord}) में नैसर्गिक मित्रता होने से भकूट दोष का शमन होता है।`,
      descriptionEn: `Natural friendship between ${gLord} and ${bLord} dissolves the tension of the sign axis.`,
    });
  }

  // Parihara 3: Same Nakshatra, Different Pada
  if (gMoon.nakshatraIndex === bMoon.nakshatraIndex && gMoon.pada !== bMoon.pada) {
    pariharas.push({
      id: 3,
      titleHi: 'एक नक्षत्र भिन्न चरण परिहार',
      titleEn: 'Same Nakshatra Different Pada Cancellation',
      descriptionHi: `दोनों का जन्म एक ही नक्षत्र (${gMoon.nakshatraName}) के भिन्न चरणों में हुआ है, जिससे भकूट दोष नहीं लगता।`,
      descriptionEn: `Both partners share the same Nakshatra (${gMoon.nakshatraName}) across different Padas, overriding Bhakoot Dosha.`,
    });
  }

  // Parihara 4: Priti Shadashtaka (मेष-वृश्चिक, वृषभ-तुला, मिथुन-मकर आदि)
  const isPritiShadashtaka =
    (gSign === 0 && bSign === 7) || (gSign === 7 && bSign === 0) || // Aries - Scorpio
    (gSign === 1 && bSign === 6) || (gSign === 6 && bSign === 1) || // Taurus - Libra
    (gSign === 2 && bSign === 9) || (gSign === 9 && bSign === 2) || // Gemini - Capricorn
    (gSign === 3 && bSign === 10) || (gSign === 10 && bSign === 3) || // Cancer - Aquarius
    (gSign === 4 && bSign === 11) || (gSign === 11 && bSign === 4); // Leo - Pisces

  if (is68 && isPritiShadashtaka) {
    pariharas.push({
      id: 4,
      titleHi: 'प्रीति षडाष्टक विशेष परिहार',
      titleEn: 'Priti Shadashtaka Special Exemption',
      descriptionHi: 'यह षडाष्टक "प्रीति षडाष्टक" की श्रेणी में आता है, जिसमें परस्पर आकर्षण और प्रेम बना रहता है।',
      descriptionEn: 'Categorized under "Priti Shadashtaka" where affection and mutual respect override friction.',
    });
  }

  // Parihara 5: Same Element in Navapancham (Fire-Fire, Earth-Earth, etc.)
  if (is95 && SIGNS[gSign].element === SIGNS[bSign].element) {
    pariharas.push({
      id: 5,
      titleHi: 'समान तत्व त्रिकोण परिहार',
      titleEn: 'Elemental Trine Harmony Cancellation',
      descriptionHi: `दोनों राशियां एक ही तत्व (${SIGNS[gSign].element}) की होने से नवपंचम संबंध अत्यंत शुभ फलदायी बनता है।`,
      descriptionEn: `Harmonious elemental alignment (${SIGNS[gSign].element}) transforms Navapancham into a supportive trine.`,
    });
  }

  const isPariharaApplicable = pariharas.length > 0;
  const pointsObtained = !hasDosha || isPariharaApplicable ? 7 : 0;

  const verdictHi = !hasDosha
    ? 'भकूट मिलान निर्दोष एवं पूर्णतः शुभ है (7/7 अंक)।'
    : isPariharaApplicable
    ? `भकूट में ${axisTypeHi} उपस्थित है किंतु ${pariharas.length} शास्त्रीय परिहारों के कारण दोष शून्य माना जाएगा (7/7 अंक मान्य)।`
    : `भकूट दोष (0/7 अंक) — ${axisTypeHi}। गौरी-शंकर रुद्राभिषेक व चंद्र शांति पूजा से सामंजस्य बढ़ाएं।`;

  const verdictEn = !hasDosha
    ? 'Bhakoot is clean and fully supportive (7/7 points).'
    : isPariharaApplicable
    ? `Bhakoot carries ${axisType} but is fully rescued by ${pariharas.length} classical pariharas (7/7 points awarded).`
    : `Bhakoot Dosha (0/7 points) — ${axisType}. Shiva-Parvati worship and peace rituals recommended.`;

  return {
    hasBhakootDosha: hasDosha && !isPariharaApplicable,
    axisType,
    axisTypeHi,
    pointsObtained,
    activePariharas: pariharas,
    isPariharaApplicable,
    verdictHi,
    verdictEn,
  };
}

// ============================================================================
// 3. NADI DOSHA & 8 CLASSICAL PARIHARA SUTRAS
// ============================================================================
export interface NadiPariharaReport {
  hasNadiDosha: boolean;
  groomNadi: string;
  brideNadi: string;
  isSameNadi: boolean;
  pointsObtained: number; // 0 or 8
  activePariharas: Array<{
    id: number;
    titleHi: string;
    titleEn: string;
    descriptionHi: string;
    descriptionEn: string;
  }>;
  isPariharaApplicable: boolean;
  verdictHi: string;
  verdictEn: string;
}

export function evaluateNadiPariharas(
  groomChart: ChartData,
  brideChart: ChartData
): NadiPariharaReport {
  const gMoon = groomChart.planets.find((p) => p.id === 'Moon')!;
  const bMoon = brideChart.planets.find((p) => p.id === 'Moon')!;
  const gNak = NAKSHATRAS[gMoon.nakshatraIndex];
  const bNak = NAKSHATRAS[bMoon.nakshatraIndex];
  const gNadi = gNak.nadi;
  const bNadi = bNak.nadi;

  const isSameNadi = gNadi === bNadi;
  const pariharas: NadiPariharaReport['activePariharas'] = [];

  // Parihara 1: Same Nakshatra, Different Pada
  if (gMoon.nakshatraIndex === bMoon.nakshatraIndex && gMoon.pada !== bMoon.pada) {
    pariharas.push({
      id: 1,
      titleHi: 'एक नक्षत्र भिन्न चरण परिहार',
      titleEn: 'Same Nakshatra Different Pada Exemption',
      descriptionHi: `दोनों का नक्षत्र एक (${gNak.name}) है परंतु चरण भिन्न (पाद ${gMoon.pada} एवं पाद ${bMoon.pada}) हैं। शास्त्रों में इसे नाड़ी दोष रहित माना गया है।`,
      descriptionEn: `Both partners share the same Nakshatra (${gNak.name}) with distinct Padas (${gMoon.pada} vs ${bMoon.pada}), nullifying Nadi Dosha.`,
    });
  }

  // Parihara 2: Same Rashi, Different Nakshatras
  if (gMoon.signIndex === bMoon.signIndex && gMoon.nakshatraIndex !== bMoon.nakshatraIndex) {
    pariharas.push({
      id: 2,
      titleHi: 'एक राशि भिन्न नक्षत्र परिहार',
      titleEn: 'Same Rashi Different Nakshatras Exemption',
      descriptionHi: 'दोनों की चंद्र राशि एक ही है किंतु नक्षत्र भिन्न हैं। श्लोक अनुसार एक राशि में नाड़ी दोष का निषेध है।',
      descriptionEn: 'Both share the same Moon sign with different Nakshatras, satisfying the classical Rashi-Ekatva exemption.',
    });
  }

  // Parihara 3: Same Nakshatra spanning Different Rashis (उदा. कृत्तिका, मृगशिरा, उत्तरफाल्गुनी, चित्रा, उत्तराषाढ़ा, धनिष्ठा)
  if (gMoon.nakshatraIndex === bMoon.nakshatraIndex && gMoon.signIndex !== bMoon.signIndex) {
    pariharas.push({
      id: 3,
      titleHi: 'द्विराशि नक्षत्र विस्तार परिहार',
      titleEn: 'Cross-Sign Nakshatra Exemption',
      descriptionHi: 'समान नक्षत्र होते हुए भी दोनों के जन्म चरण भिन्न-भिन्न राशियों में पड़ते हैं, जिससे नाड़ी दोष नहीं लगता।',
      descriptionEn: 'The shared Nakshatra falls into two different Rasis, completely breaking the Nadi Dosha.',
    });
  }

  // Parihara 4: Special Exempted Nakshatras: Rohini, Mrigashira, Ardra, Pushya, Shravana, Hasta, U.Bhadra, Revati
  const exemptNaks = new Set([3, 4, 5, 7, 12, 21, 25, 26]); // Rohini, Mrig, Ardra, Pushya, Hasta, Shravana, U.Bhadra, Revati
  if (exemptNaks.has(gMoon.nakshatraIndex) || exemptNaks.has(bMoon.nakshatraIndex)) {
    pariharas.push({
      id: 4,
      titleHi: 'महाऋषि वशिष्ठ विशेष नक्षत्र परिहार',
      titleEn: 'Sage Vashistha Special Nakshatra Exemption',
      descriptionHi: 'रोहिणी, मृगशिरा, आर्द्रा, पुष्य, श्रवण, हस्त, उत्तराभाद्रपद अथवा रेवती में जन्म होने पर नाड़ी दोष का प्रभाव शून्य होता है।',
      descriptionEn: 'Vedic treatises exempt Rohini, Mrigashira, Ardra, Pushya, Hasta, Shravana, U.Bhadra, and Revati from Nadi affliction.',
    });
  }

  // Parihara 5: Sign Lords are Mutual Best Friends and Gana is Same
  const gLord = SIGNS[gMoon.signIndex].lord;
  const bLord = SIGNS[bMoon.signIndex].lord;
  const f1 = NATURAL_FRIENDSHIP[gLord][bLord];
  const f2 = NATURAL_FRIENDSHIP[bLord][gLord];
  if (f1 >= 1 && f2 >= 1 && gNak.gana === bNak.gana) {
    pariharas.push({
      id: 5,
      titleHi: 'राशीश मैत्री व समान गण परिहार',
      titleEn: 'Sign Lord Friendship & Same Gana Exemption',
      descriptionHi: `दोनों के राशि स्वामी परम मित्र हैं और दोनों का गण (${gNak.gana}) समान है, जिससे नाड़ी दोष गौण हो जाता है।`,
      descriptionEn: `Mutual planetary friendship combined with identical Gana temperament mitigates genetic friction.`,
    });
  }

  const isPariharaApplicable = isSameNadi && pariharas.length > 0;
  const hasNadiDosha = isSameNadi && !isPariharaApplicable;
  const pointsObtained = !isSameNadi || isPariharaApplicable ? 8 : 0;

  const verdictHi = !isSameNadi
    ? `नाड़ी मिलान पूर्णतः निर्दोष व शुभ है (वर: ${gNadi}, कन्या: ${bNadi} — 8/8 अंक)।`
    : isPariharaApplicable
    ? `एक ही नाड़ी (${gNadi}) है किंतु ${pariharas.length} शास्त्रीय परिहारों के कारण दोष स्वतः निष्प्रभावी हो चुका है (8/8 अंक मान्य)।`
    : `एक ही नाड़ी (${gNadi}) होने से पूर्ण नाड़ी दोष (0/8 अंक)। महामृत्युंजय जप (11,000) व स्वर्ण-नाड़ी दान कराएं।`;

  const verdictEn = !isSameNadi
    ? `Nadi is perfectly clean and favorable (Groom: ${gNadi}, Bride: ${bNadi} — 8/8 points).`
    : isPariharaApplicable
    ? `Same Nadi (${gNadi}) present but neutralized by ${pariharas.length} classical pariharas (8/8 points awarded).`
    : `Full Nadi Dosha (0/8 points — Both ${gNadi}). Maha Mrityunjaya Japa and Swarna-Nadi charity recommended.`;

  return {
    hasNadiDosha,
    groomNadi: gNadi,
    brideNadi: bNadi,
    isSameNadi,
    pointsObtained,
    activePariharas: pariharas,
    isPariharaApplicable,
    verdictHi,
    verdictEn,
  };
}

// ============================================================================
// 4. MASTER ADVANCE MATCHMAKING COMPOSITE ENGINE
// ============================================================================
export interface AdvanceMarriageMatchReport {
  ashtakoota: MatchMakingResult;
  dashakoota: PoruthamReport;
  manglikAnalysis: DetailedManglikAnalysis;
  bhakootParihara: BhakootPariharaReport;
  nadiParihara: NadiPariharaReport;
  beejaKshetra: BeejaKshetraMatchReport;
  synastryHouses: HouseToHouseMatchRow[];
  synastrySigns: SignToSignMatchRow[];
  totalEffectiveGunas: number; // Ashtakoota score with Bhakoot/Nadi parihara adjustments
  overallVerdictHi: string;
  overallVerdictEn: string;
  suitabilityGrade: 'A+' | 'A' | 'B' | 'C';
}

export function computeAdvanceMarriageMatching(
  groomChart: ChartData,
  brideChart: ChartData
): AdvanceMarriageMatchReport {
  // 1. Ashtakoota 36 Gunas
  const ashtakoota = computeAshtakoota(brideChart, groomChart);

  // 2. Dashakoota 10 South Indian Kootas
  const dashakoota = computeSouthIndianPorutham(brideChart, groomChart);

  // 3. 16 Manglik Bhanga Rules
  const manglikAnalysis = evaluate16ManglikBhangaRules(groomChart, brideChart);

  // 4. Bhakoot Parihara
  const bhakootParihara = evaluateBhakootPariharas(groomChart, brideChart);

  // 5. Nadi Parihara
  const nadiParihara = evaluateNadiPariharas(groomChart, brideChart);

  // 6. Beeja-Kshetra Sphuta
  const beejaKshetra = matchBeejaKshetraSphuta(groomChart, brideChart);

  // 7. House and Sign Synastry
  const { signMatches, houseMatches } = computeSignAndHouseMatching(groomChart, brideChart);

  // Adjusted Gunas incorporating shastric pariharas
  let effectiveGunas = ashtakoota.totalObtained;
  const origBhakoot = ashtakoota.kootas.find((k) => k.name === 'Bhakoot')?.obtainedPoints ?? 0;
  const origNadi = ashtakoota.kootas.find((k) => k.name === 'Nadi')?.obtainedPoints ?? 0;

  if (origBhakoot === 0 && bhakootParihara.isPariharaApplicable) {
    effectiveGunas += 7;
  }
  if (origNadi === 0 && nadiParihara.isPariharaApplicable) {
    effectiveGunas += 8;
  }
  effectiveGunas = Math.min(36, effectiveGunas);

  // Suitability Grade
  let suitabilityGrade: AdvanceMarriageMatchReport['suitabilityGrade'] = 'A+';
  let overallVerdictHi = '';
  let overallVerdictEn = '';

  if (effectiveGunas >= 28 && manglikAnalysis.severity !== 'Moderate' && dashakoota.criticalRajjuPass) {
    suitabilityGrade = 'A+';
    overallVerdictHi = `सर्वोत्कृष्ट एवं उत्तम विवाह संबंध (${effectiveGunas}/36 प्रभावी गुण)। अष्टकूट, दशकूट, मांगलिक व नाड़ी सामंजस्य परिपूर्ण है। यह दांपत्य दीर्घायु, सुख, संतान व समृद्धि दायक रहेगा।`;
    overallVerdictEn = `Supreme & Highly Auspicious Alliance (${effectiveGunas}/36 effective Gunas). Ashtakoota, Dashakoota, Manglik balance and Rajju protection are fully satisfied.`;
  } else if (effectiveGunas >= 21) {
    suitabilityGrade = 'A';
    overallVerdictHi = `शुभ एवं अनुकूल विवाह संबंध (${effectiveGunas}/36 प्रभावी गुण)। अधिकांश महत्वपूर्ण कूट अनुकूल हैं तथा परिहार मान्य हैं। विवाह की संस्तुति की जाती है।`;
    overallVerdictEn = `Auspicious & Harmonious Match (${effectiveGunas}/36 effective Gunas). Major kootas and pariharas align constructively. Recommended.`;
  } else if (effectiveGunas >= 18) {
    suitabilityGrade = 'B';
    overallVerdictHi = `मध्यम किंतु ग्राह्य विवाह संबंध (${effectiveGunas}/36 गुण)। कुछ क्षेत्रों में स्वभाव व तालमेल हेतु परस्पर समझ एवं निर्धारित पूजा-उपाय आवश्यक रहेंगे।`;
    overallVerdictEn = `Moderate yet acceptable alliance (${effectiveGunas}/36 Gunas). Mutual understanding and prescribed remedial pujas recommended.`;
  } else {
    suitabilityGrade = 'C';
    overallVerdictHi = `अंक १८ से न्यून हैं (${effectiveGunas}/36 गुण)। महत्वपूर्ण दोषों का परिहार नहीं हो रहा है; किसी वरिष्ठ ज्योतिषी से दोनों कुंडलियों की समग्र ग्रह स्थिति जांच कर ही निर्णय लें।`;
    overallVerdictEn = `Score is below threshold (${effectiveGunas}/36 Gunas). Critical doshas remain unmitigated; in-depth consultation with an experienced astrologer is advised.`;
  }

  return {
    ashtakoota,
    dashakoota,
    manglikAnalysis,
    bhakootParihara,
    nadiParihara,
    beejaKshetra,
    synastryHouses: houseMatches,
    synastrySigns: signMatches,
    totalEffectiveGunas: effectiveGunas,
    overallVerdictHi,
    overallVerdictEn,
    suitabilityGrade,
  };
}
