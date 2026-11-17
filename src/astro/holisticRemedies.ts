/**
 * AV Astro Vibe — Classical & Practical Holistic Remedies Engine
 * Synthesizes D-1 (Natal), D-9 (Navamsha), Running Vimshottari Mahadasha/Antardasha,
 * Active Transits (Gochar), and Desh-Kaal-Paristhiti (Time, Place & Situation).
 *
 * Focuses on zero-cost & accessible practical remedies:
 * - Planetary Herbal Roots (जड़ी-बूटी धारण) as safe alternatives to expensive gemstones
 * - Color Therapy (रंग चिकित्सा — शुभ व वर्जित रंग)
 * - Astro-Yoga & Pranayama (योग एवं प्राणायाम)
 * - Zero-cost Kitchen & Household Totke (घरेलू व रसोई के टोटके)
 * - Problem-Specific Classical Stotras (कनकधारा, दशरथकृत शनि स्तोत्र, हनुमान चालीसा, गायत्री, महामृत्युंजय आदि)
 * - Ishta Devata Sadhana (D9 Karakamsa 12th House)
 * - Herbal Astro-Bath (स्नान परिहार)
 * - Modern Lifestyle Toggles (Flat/Metro friendly, Zero-smoke, 5-minute quick routines)
 */

import type { ChartData, NineGrahaId } from './types';
import { SIGNS } from './constants';
import { formatDateDmy } from './time';

export type ProblemFocusArea =
  | 'all'
  | 'finance_wealth'
  | 'marriage_relationship'
  | 'career_job'
  | 'health_arishta'
  | 'sade_sati_anxiety'
  | 'progeny_children'
  | 'court_enemies';

export type LifestyleMode =
  | 'all'
  | 'metro_flat' // Zero smoke, zero fire, quiet indoor routines
  | 'zero_cost' // Kitchen items, mindset, daily habits
  | 'quick_5min' // Minimal time commitment for working professionals
  | 'traditional'; // Full classical path and rituals

export interface HerbalRootRemedy {
  planet: NineGrahaId;
  planetHi: string;
  rootNameEn: string;
  rootNameHi: string;
  botanicalName: string;
  gemstoneAlternativeEn: string;
  gemstoneAlternativeHi: string;
  wrappingMethodEn: string;
  wrappingMethodHi: string;
  dayTimeEn: string;
  dayTimeHi: string;
  contraindicationsEn: string;
  contraindicationsHi: string;
  isRecommended: boolean;
  reasonEn: string;
  reasonHi: string;
}

export interface ColorTherapyRemedy {
  favorableColorsEn: string[];
  favorableColorsHi: string[];
  avoidColorsEn: string[];
  avoidColorsHi: string[];
  dashaColorFocusEn: string;
  dashaColorFocusHi: string;
  practicalApplicationEn: string;
  practicalApplicationHi: string;
}

export interface AstroYogaRemedy {
  planetTargeted: NineGrahaId;
  asanasEn: string[];
  asanasHi: string[];
  pranayamaEn: string[];
  pranayamaHi: string[];
  durationMinutes: number;
  timingEn: string;
  timingHi: string;
  therapeuticBenefitsEn: string;
  therapeuticBenefitsHi: string;
}

export interface KitchenTotkaRemedy {
  titleEn: string;
  titleHi: string;
  category: 'kitchen_item' | 'household_habit' | 'animal_charity' | 'water_therapy';
  itemsNeededEn: string;
  itemsNeededHi: string;
  stepByStepEn: string;
  stepByStepHi: string;
  logicalAstroBasisEn: string;
  logicalAstroBasisHi: string;
  lifestyleTag: 'metro_friendly' | 'zero_cost' | 'quick_daily';
}

export interface ClassicalStotraRemedy {
  stotraNameEn: string;
  stotraNameHi: string;
  problemArea: ProblemFocusArea;
  keyDeity: string;
  recommendedCount: string;
  bestDayTimingEn: string;
  bestDayTimingHi: string;
  sampleSanskritVerse: string;
  meaningEn: string;
  meaningHi: string;
  targetPlanet: NineGrahaId;
  urgencyLevel: 'high' | 'moderate' | 'maintenance';
}

export interface IshtaDevataRemedy {
  deityNameEn: string;
  deityNameHi: string;
  classicalBasisEn: string;
  classicalBasisHi: string;
  moolaMantra: string;
  recitationCount: string;
  offeringEn: string;
  offeringHi: string;
}

export interface HerbalBathRemedy {
  dayOfWeekEn: string;
  dayOfWeekHi: string;
  planet: NineGrahaId;
  herbalIngredientsEn: string[];
  herbalIngredientsHi: string[];
  methodEn: string;
  methodHi: string;
  benefitsEn: string;
  benefitsHi: string;
}

export interface PrescriptionSlip {
  clientName: string;
  dateStr: string;
  activeDasha: string;
  dominantDoshaOrAfflictionEn: string;
  dominantDoshaOrAfflictionHi: string;
  primaryRoot: string;
  primaryColorRule: string;
  coreDailyStotra: string;
  kitchenZeroCostHabit: string;
  dietaryTip: string;
  astrologerCounselEn: string;
  astrologerCounselHi: string;
}

export interface FullHolisticRemediesReport {
  activeDasha: {
    mahadasha: NineGrahaId;
    antardasha: NineGrahaId;
    summaryEn: string;
    summaryHi: string;
  };
  gocharHighlights: {
    saturnTransitHouse: number;
    isSadeSatiOrDhaiya: boolean;
    sadeSatiPhaseTextEn: string;
    sadeSatiPhaseTextHi: string;
    jupiterTransitHouse: number;
    rahuTransitHouse: number;
  };
  herbalRoots: HerbalRootRemedy[];
  colorTherapy: ColorTherapyRemedy;
  astroYoga: AstroYogaRemedy[];
  kitchenTotke: KitchenTotkaRemedy[];
  classicalStotras: ClassicalStotraRemedy[];
  ishtaDevata: IshtaDevataRemedy;
  herbalBaths: HerbalBathRemedy[];
  prescriptionSlip: PrescriptionSlip;
}

const HINDI_PLANETS: Record<string, string> = {
  Sun: 'सूर्य',
  Moon: 'चंद्र',
  Mars: 'मंगल',
  Mercury: 'बुध',
  Jupiter: 'गुरु',
  Venus: 'शुक्र',
  Saturn: 'शनि',
  Rahu: 'राहु',
  Ketu: 'केतु',
};

// Herbal roots master database
const HERBAL_ROOTS_DB: Record<NineGrahaId, Omit<HerbalRootRemedy, 'isRecommended' | 'reasonEn' | 'reasonHi'>> = {
  Sun: {
    planet: 'Sun',
    planetHi: 'सूर्य',
    rootNameEn: 'Belpatra (Bael) Root or Shwetark (Calotropis)',
    rootNameHi: 'बेलपत्र की जड़ अथवा श्वेतार्क (मदार)',
    botanicalName: 'Aegle marmelos / Calotropis procera',
    gemstoneAlternativeEn: 'Natural substitute for Ruby (Manikya)',
    gemstoneAlternativeHi: 'माणिक्य रत्न का पूर्ण वैदिक व सुरक्षित विकल्प',
    wrappingMethodEn: 'Wrap in pink or saffron silk cloth, tie with red or golden thread on Sunday morning.',
    wrappingMethodHi: 'रविवार प्रातः काल सूर्योदय के समय गुलाबी अथवा केसरिया रेशमी वस्त्र में लपेटकर लाल/सुनहरे धागे से धारण करें।',
    dayTimeEn: 'Sunday during Sun Hora or Shukla Paksha morning',
    dayTimeHi: 'रविवार प्रातः सूर्य होरा अथवा शुक्ल पक्ष के शुभ मुहूर्त में',
    contraindicationsEn: 'Avoid if Sun is 6th/8th lord with high blood pressure without consultation.',
    contraindicationsHi: 'यदि सूर्य षष्ठेश/अष्टमेश होकर उच्च रक्तचाप हो तो धारण करने से पूर्व परीक्षण करें।',
  },
  Moon: {
    planet: 'Moon',
    planetHi: 'चंद्र',
    rootNameEn: 'Khirni Root',
    rootNameHi: 'खिरनी की जड़',
    botanicalName: 'Manilkara hexandra',
    gemstoneAlternativeEn: 'Natural substitute for Pearl (Moti)',
    gemstoneAlternativeHi: 'मोती रत्न का प्राकृतिक, शांत व सुरक्षित विकल्प',
    wrappingMethodEn: 'Wrap in white clean cloth, tie with silver or white thread on Monday morning.',
    wrappingMethodHi: 'सोमवार प्रातः श्वेत रेशमी वस्त्र में लपेटकर चांदी के ताबीज में अथवा सफेद धागे से गले/दाहिनी भुजा में धारण करें।',
    dayTimeEn: 'Monday morning during Moon Hora or Rohini/Hasta nakshatra',
    dayTimeHi: 'सोमवार प्रातः चंद्र होरा अथवा रोहिणी/हस्त नक्षत्र में',
    contraindicationsEn: 'Extremely safe for all constitutions; cools down excessive anxiety.',
    contraindicationsHi: 'सर्वथा सुरक्षित; अनिद्रा, तनाव व मानसिक अस्थिरता को शांत करती है।',
  },
  Mars: {
    planet: 'Mars',
    planetHi: 'मंगल',
    rootNameEn: 'Anantmool (Indian Sarsaparilla) Root',
    rootNameHi: 'अनंतमूल की जड़',
    botanicalName: 'Hemidesmus indicus',
    gemstoneAlternativeEn: 'Natural substitute for Red Coral (Moonga)',
    gemstoneAlternativeHi: 'मूंगा रत्न का शीतल व सुरक्षित रक्त-शोधक विकल्प',
    wrappingMethodEn: 'Wrap in red cloth, tie with red or copper thread on Tuesday morning.',
    wrappingMethodHi: 'मंगलवार प्रातः लाल वस्त्र में लपेटकर लाल धागे या तांबे के ताबीज में धारण करें।',
    dayTimeEn: 'Tuesday morning during Mars Hora',
    dayTimeHi: 'मंगलवार प्रातः मंगल होरा अथवा मृगशिरा/चित्रा नक्षत्र में',
    contraindicationsEn: 'Balances Pitta unlike Moonga which can heat up the body unnecessarily.',
    contraindicationsHi: 'मूंगा रत्न की तरह रक्तचाप को उग्र नहीं करता, अपितु रक्त को शुद्ध कर संयमित बल देता है।',
  },
  Mercury: {
    planet: 'Mercury',
    planetHi: 'बुध',
    rootNameEn: 'Vidhara (Elephant Creeper) Root',
    rootNameHi: 'विधारा की जड़',
    botanicalName: 'Argyreia speciosa',
    gemstoneAlternativeEn: 'Natural substitute for Emerald (Panna)',
    gemstoneAlternativeHi: 'पन्ना रत्न का उत्तम बौद्धिक व तंत्रिका-पोषक विकल्प',
    wrappingMethodEn: 'Wrap in green cloth, tie with green silk thread on Wednesday morning.',
    wrappingMethodHi: 'बुधवार प्रातः हरे वस्त्र में लपेटकर हरे धागे से दाहिनी भुजा अथवा गले में धारण करें।',
    dayTimeEn: 'Wednesday morning during Mercury Hora',
    dayTimeHi: 'बुधवार प्रातः बुध होरा अथवा अश्लेषा/ज्येष्ठा नक्षत्र में',
    contraindicationsEn: 'Highly beneficial for speech defects, business calculations, and student concentration.',
    contraindicationsHi: 'वाणी दोष, एकाग्रता की कमी, व्यापारिक गणना व त्वचा रोगों में अत्यंत लाभकारी।',
  },
  Jupiter: {
    planet: 'Jupiter',
    planetHi: 'गुरु',
    rootNameEn: 'Banana Tree Root (Kele ki Jad) or Raw Turmeric Knot (Haldi ki Ganth)',
    rootNameHi: 'केले की जड़ अथवा साबुत हल्दी की गांठ',
    botanicalName: 'Musa paradisiaca / Curcuma longa',
    gemstoneAlternativeEn: 'Natural substitute for Yellow Sapphire (Pukhraj)',
    gemstoneAlternativeHi: 'पुखराज रत्न का अति-पवित्र व सुरक्षित विकल्प',
    wrappingMethodEn: 'Wrap in yellow cloth, tie with yellow thread around neck or right arm on Thursday morning.',
    wrappingMethodHi: 'गुरुवार प्रातः पीले रेशमी वस्त्र में लपेटकर पीले सूती/रेशमी धागे से गले अथवा भुजा में धारण करें।',
    dayTimeEn: 'Thursday morning during Jupiter Hora or Punarvasu/Vishakha',
    dayTimeHi: 'गुरुवार प्रातः गुरु होरा अथवा पुनर्वसु/विशाखा नक्षत्र में',
    contraindicationsEn: 'Universally auspicious for spiritual peace, marital harmony, and liver wellness.',
    contraindicationsHi: 'विवाह में विलंब, ज्ञान, संतान सुख व आध्यात्मिक शांति हेतु सर्वथा निर्दोष।',
  },
  Venus: {
    planet: 'Venus',
    planetHi: 'शुक्र',
    rootNameEn: 'Arandi (Castor) or Sarponkha Root',
    rootNameHi: 'अरंडी अथवा सरपोंखा की जड़',
    botanicalName: 'Ricinus communis / Tephrosia purpurea',
    gemstoneAlternativeEn: 'Natural substitute for Diamond (Heera) or White Opal',
    gemstoneAlternativeHi: 'हीरा अथवा ओपल का प्राकृतिक सौन्दर्यवर्धक व कलात्मक विकल्प',
    wrappingMethodEn: 'Wrap in white silk cloth, tie with silver or white thread on Friday morning.',
    wrappingMethodHi: 'शुक्रवार प्रातः श्वेत रेशमी वस्त्र में लपेटकर सफेद रेशमी धागे से गले में धारण करें।',
    dayTimeEn: 'Friday morning during Venus Hora or Bharani/Purva Phalguni',
    dayTimeHi: 'शुक्रवार प्रातः शुक्र होरा अथवा भरणी/पूर्वा फाल्गुनी नक्षत्र में',
    contraindicationsEn: 'Enhances artistic grace, hormonal balance, and marital sweetness without side effects.',
    contraindicationsHi: 'कलात्मक प्रतिभा, हार्मोनल संतुलन व दांपत्य में मधुरता हेतु अत्यंत प्रभावकारी।',
  },
  Saturn: {
    planet: 'Saturn',
    planetHi: 'शनि',
    rootNameEn: 'Shami Root or Bichhu Booti (Nettle) Root',
    rootNameHi: 'शमी की जड़ अथवा बिच्छू बूटी की जड़',
    botanicalName: 'Prosopis cineraria / Urtica dioica',
    gemstoneAlternativeEn: 'Natural substitute for Blue Sapphire (Neelam)',
    gemstoneAlternativeHi: 'नीलम रत्न का सर्वथा सुरक्षित व शांत विकल्प (बिना किसी आकस्मिक झटके के)',
    wrappingMethodEn: 'Wrap in dark blue or black cloth, tie with blue/black thread on Saturday evening.',
    wrappingMethodHi: 'शनिवार सायंकाल नीले अथवा काले कपड़े में लपेटकर नीले धागे से मध्यमा अंगुली के पास या बांह में धारण करें।',
    dayTimeEn: 'Saturday evening around sunset during Pushya/Anuradha',
    dayTimeHi: 'शनिवार सूर्यास्त वेला में शनि नक्षत्र अथवा शनि होरा में',
    contraindicationsEn: 'Unlike Neelam which can cause severe sudden trial if incompatible, Shami root is entirely gentle.',
    contraindicationsHi: 'नीलम रत्न की भांति इसमें कोई उग्र दुष्प्रभाव नहीं होता; यह कर्म सुधार व धैर्य प्रदान करती है।',
  },
  Rahu: {
    planet: 'Rahu',
    planetHi: 'राहु',
    rootNameEn: 'White Sandalwood (Shwet Chandan) Root or Piece',
    rootNameHi: 'श्वेत चंदन की जड़ अथवा टुकड़ा',
    botanicalName: 'Santalum album',
    gemstoneAlternativeEn: 'Natural substitute for Hessonite (Gomed)',
    gemstoneAlternativeHi: 'गोमेद रत्न का मन को शीतलता व स्पष्टता प्रदान करने वाला विकल्प',
    wrappingMethodEn: 'Wrap in blue or white silk, wear around the neck with a blue thread on Saturday.',
    wrappingMethodHi: 'नीले अथवा सफेद कपड़े में बांधकर नीले धागे से गले में शनिवार को धारण करें।',
    dayTimeEn: 'Saturday or Wednesday evening during Rahu-Kalam or Swati nakshatra',
    dayTimeHi: 'शनिवार अथवा बुधवार सायंकाल स्वाति/आर्द्रा नक्षत्र में',
    contraindicationsEn: 'Soothes obsessive hallucinations, clears phantom fears, and calms racing thoughts.',
    contraindicationsHi: 'अति-सोच, भ्रम, अनिद्रा व अज्ञात भय को तुरंत शांत कर मानसिक शांति देता है।',
  },
  Ketu: {
    planet: 'Ketu',
    planetHi: 'केतु',
    rootNameEn: 'Ashwagandha (Winter Cherry) Root',
    rootNameHi: 'अश्वगंधा की जड़',
    botanicalName: 'Withania somnifera',
    gemstoneAlternativeEn: "Natural substitute for Cat's Eye (Lehsuniya)",
    gemstoneAlternativeHi: 'लहसुनिया रत्न का सुरक्षित, आत्मिक व नाड़ी-रक्षक विकल्प',
    wrappingMethodEn: 'Wrap in smoky-grey or brown cloth, tie with grey thread on Thursday/Saturday.',
    wrappingMethodHi: 'भूरे अथवा धूसर रंग के कपड़े में लपेटकर गुरुवार या शनिवार को धारण करें।',
    dayTimeEn: 'Thursday or Tuesday morning during Ketu nakshatras (Ashwini, Magha, Mula)',
    dayTimeHi: 'मंगलवार अथवा गुरुवार प्रातः मूल, मघा अथवा अश्विनी नक्षत्र में',
    contraindicationsEn: 'Strengthens intuition, dissolves past-life karmic phobias, and restores nervous energy.',
    contraindicationsHi: 'अंतर्ज्ञान, आध्यात्मिक साधना व नाड़ी तंत्र को सबल बनाने हेतु अत्यंत श्रेष्ठ।',
  },
};

/**
 * Computes complete holistic remedies personalized to chart, dasha, and transits.
 */
export function computeHolisticRemedies(
  chart: ChartData,
  problemFocus: ProblemFocusArea = 'all',
  lifestyleFilter: LifestyleMode = 'all'
): FullHolisticRemediesReport {
  const now = Date.now();
  const ascSign = chart.ascendant.signIndex;

  // Active Dasha
  const activeMD = chart.vimshottari?.find((d) => now >= d.startMs && now < d.endMs) || chart.vimshottari?.[0];
  const activeAD = activeMD?.children?.find((d) => now >= d.startMs && now < d.endMs) || activeMD?.children?.[0];
  const mdLord: NineGrahaId = (activeMD?.lord as NineGrahaId) || 'Jupiter';
  const adLord: NineGrahaId = (activeAD?.lord as NineGrahaId) || mdLord;

  // Saturn Transit & Sade Sati calculation
  const moon = chart.planets.find((p) => p.id === 'Moon') || chart.planets[1];
  const moonSign = moon.signIndex;

  // In 2026, Saturn transits Pisces (sign index 11)
  const saturnTransitSign = 11; // Pisces
  const distFromMoon = (saturnTransitSign - moonSign + 12) % 12;

  let isSadeSatiOrDhaiya = false;
  let sadeSatiPhaseTextEn = 'No active Sade Sati or Kantaka Shani';
  let sadeSatiPhaseTextHi = 'वर्तमान में साढ़े साती अथवा ढैया का कोई गंभीर प्रभाव नहीं है';

  if (distFromMoon === 11) {
    isSadeSatiOrDhaiya = true;
    sadeSatiPhaseTextEn = 'Sade Sati Rising Phase (Charan 1): Mental restructuring, increased responsibilities, career shifts';
    sadeSatiPhaseTextHi = 'साढ़े साती प्रथम चरण (उदय): मानसिक दबाव, अतिरिक्त दायित्व व जीवन में बड़े परिवर्तन';
  } else if (distFromMoon === 0) {
    isSadeSatiOrDhaiya = true;
    sadeSatiPhaseTextEn = 'Sade Sati Peak Phase (Charan 2): Direct emotional testing, health discipline, deep spiritual purification';
    sadeSatiPhaseTextHi = 'साढ़े साती द्वितीय चरण (शिखर): गहन आत्म-परीक्षण, स्वास्थ्य अनुशासन व वैराग्य/धैर्य';
  } else if (distFromMoon === 1) {
    isSadeSatiOrDhaiya = true;
    sadeSatiPhaseTextEn = 'Sade Sati Setting Phase (Charan 3): Financial consolidation, relief, stabilizing long-term gains';
    sadeSatiPhaseTextHi = 'साढ़े साती तृतीय चरण (अस्त): वित्तीय स्थिरता, कष्टों से राहत व दीर्घकालिक लाभ का आरंभ';
  } else if (distFromMoon === 3) {
    isSadeSatiOrDhaiya = true;
    sadeSatiPhaseTextEn = 'Kantaka Shani (4th house Dhaiya): Domestic friction, chest/heart sensitivity, property matters';
    sadeSatiPhaseTextHi = 'कंटक शनि (चतुर्थ भाव ढैया): गृह क्लेश, मानसिक अशांति व भूमि/वाहन संबंधी संवेदनशीलता';
  } else if (distFromMoon === 7) {
    isSadeSatiOrDhaiya = true;
    sadeSatiPhaseTextEn = 'Ashtama Shani (8th house Dhaiya): Caution regarding sudden changes, joint finances, chronic health';
    sadeSatiPhaseTextHi = 'अष्टम शनि ढैया: आकस्मिक परिवर्तन, स्वास्थ्य सावधानी व धैर्यपूर्वक कार्य संचालन';
  }

  // Functional benefics & malefics for Lagna
  // Benefic signs by Lagna:
  // Aries (0): Sun, Jup, Mars. Mal: Mer, Ven, Sat
  // Taurus (1): Sat, Mer, Ven. Mal: Jup, Moon, Mars
  // Gemini (2): Ven, Mer. Mal: Mars, Jup, Sun
  // Cancer (3): Moon, Mars, Jup. Mal: Mer, Ven, Sat
  // Leo (4): Sun, Mars, Jup. Mal: Ven, Mer, Sat
  // Virgo (5): Mer, Ven. Mal: Mars, Jup, Moon
  // Libra (6): Sat, Mer, Ven. Mal: Jup, Sun, Mars
  // Scorpio (7): Jup, Moon, Mars. Mal: Mer, Ven, Sat
  // Sagittarius (8): Sun, Mars, Jup. Mal: Ven, Mer, Sat
  // Capricorn (9): Ven, Mer, Sat. Mal: Mars, Jup, Moon
  // Aquarius (10): Ven, Sat. Mal: Jup, Moon, Mars
  // Pisces (11): Jup, Moon, Mars. Mal: Ven, Mer, Sat

  const BENEFIC_BY_LAGNA: Record<number, NineGrahaId[]> = {
    0: ['Sun', 'Jupiter', 'Mars'],
    1: ['Saturn', 'Mercury', 'Venus'],
    2: ['Venus', 'Mercury'],
    3: ['Mars', 'Moon', 'Jupiter'],
    4: ['Sun', 'Mars', 'Jupiter'],
    5: ['Mercury', 'Venus'],
    6: ['Saturn', 'Mercury', 'Venus'],
    7: ['Jupiter', 'Moon', 'Mars'],
    8: ['Sun', 'Mars', 'Jupiter'],
    9: ['Venus', 'Mercury', 'Saturn'],
    10: ['Venus', 'Saturn'],
    11: ['Jupiter', 'Moon', 'Mars'],
  };

  const MALEFIC_BY_LAGNA: Record<number, NineGrahaId[]> = {
    0: ['Mercury', 'Venus', 'Saturn'],
    1: ['Jupiter', 'Moon', 'Mars'],
    2: ['Mars', 'Jupiter', 'Sun'],
    3: ['Mercury', 'Venus', 'Saturn'],
    4: ['Venus', 'Mercury', 'Saturn'],
    5: ['Mars', 'Jupiter', 'Moon'],
    6: ['Jupiter', 'Sun', 'Mars'],
    7: ['Mercury', 'Venus', 'Saturn'],
    8: ['Venus', 'Mercury', 'Saturn'],
    9: ['Mars', 'Jupiter', 'Moon'],
    10: ['Jupiter', 'Moon', 'Mars'],
    11: ['Venus', 'Mercury', 'Saturn'],
  };

  const lagnaBenefics = BENEFIC_BY_LAGNA[ascSign] || ['Jupiter', 'Sun'];
  const lagnaMalefics = MALEFIC_BY_LAGNA[ascSign] || ['Saturn', 'Rahu'];

  // 1. Herbal Roots Recommendation
  const herbalRoots: HerbalRootRemedy[] = (Object.keys(HERBAL_ROOTS_DB) as NineGrahaId[]).map((pid) => {
    const base = HERBAL_ROOTS_DB[pid];
    let isRecommended = false;
    let reasonEn = 'Neutral for your current chart configuration.';
    let reasonHi = 'आपकी वर्तमान कुंडली के लिए सामान्य।';

    if (pid === mdLord) {
      isRecommended = true;
      reasonEn = `Primary Recommendation: Controller of your running Mahadasha (${pid}). Wearing this root balances its period effects naturally without gemstone volatility.`;
      reasonHi = `विशेष संस्तुति: आपकी वर्तमान महादशा स्वामी (${HINDI_PLANETS[pid]}) हैं। यह जड़ बिना किसी रत्न के उग्र प्रभाव के दशा को सौम्य व फलदायी बनाती है।`;
    } else if (pid === adLord && adLord !== mdLord) {
      isRecommended = true;
      reasonEn = `Secondary Recommendation: Current Antardasha lord (${pid}). Balances short-term fluctuations.`;
      reasonHi = `सहायक संस्तुति: वर्तमान अंतर्दशा स्वामी (${HINDI_PLANETS[pid]}) हैं, जो दैनिक कार्यों में गति प्रदान करेगी।`;
    } else if (pid === 'Saturn' && isSadeSatiOrDhaiya) {
      isRecommended = true;
      reasonEn = `Sade Sati / Dhaiya Support: Shami root gently calms Saturnian pressure without triggering sudden friction.`;
      reasonHi = `साढ़े साती / ढैया रक्षा: शमी की जड़ शनिदेव के प्रभाव को शांत कर धैर्य व कर्मबल प्रदान करती है।`;
    } else if (lagnaBenefics.includes(pid)) {
      isRecommended = true;
      reasonEn = `Lagna Benefic: Highly supportive life-force planet for ${SIGNS[ascSign].name} Ascendant.`;
      reasonHi = `${SIGNS[ascSign].name} लग्न हेतु परम कारक ग्रह; जीवन शक्ति व भाग्य की वृद्धि के लिए अनुकूल।`;
    }

    return {
      ...base,
      isRecommended,
      reasonEn,
      reasonHi,
    };
  });

  // 2. Color Therapy
  const COLOR_PALETTE: Record<NineGrahaId, { en: string; hi: string }> = {
    Sun: { en: 'Saffron, Light Copper, Golden Orange', hi: 'केसरिया, तांबई, हल्का नारंगी' },
    Moon: { en: 'Pearl White, Cream, Milk-White, Silver', hi: 'श्वेत, क्रीम, दुधिया, रूपहला' },
    Mars: { en: 'Bright Red, Coral, Terracotta', hi: 'लाल, सिंदूरी, मूंगा रंग' },
    Mercury: { en: 'Emerald Green, Mint, Bottle Green', hi: 'हरा, तोतिया, पिस्ता' },
    Jupiter: { en: 'Bright Yellow, Saffron Yellow, Turmeric Gold', hi: 'पीला, हल्दी रंग, स्वर्णिम पीतांबर' },
    Venus: { en: 'Sparkling White, Light Pink, Pastel Sky Blue', hi: 'चमकदार श्वेत, हल्का गुलाबी, आसमानी' },
    Saturn: { en: 'Dark Navy Blue, Royal Blue, Charcoal (Avoid Jet Black)', hi: 'गहरा नीला, रॉयल ब्लू (पूर्ण काले रंग से बचें)' },
    Rahu: { en: 'Smoky Grey, Slate Blue', hi: 'धूसर, स्लेटी' },
    Ketu: { en: 'Brown, Earthy Khaki, Beige', hi: 'भूरा, खाकी, मटमैला' },
  };

  const favorableColorsEn = lagnaBenefics.map((b) => COLOR_PALETTE[b].en);
  const favorableColorsHi = lagnaBenefics.map((b) => COLOR_PALETTE[b].hi);

  const avoidColorsEn = lagnaMalefics.map((m) => COLOR_PALETTE[m].en);
  const avoidColorsHi = lagnaMalefics.map((m) => COLOR_PALETTE[m].hi);

  const colorTherapy: ColorTherapyRemedy = {
    favorableColorsEn,
    favorableColorsHi,
    avoidColorsEn,
    avoidColorsHi,
    dashaColorFocusEn: `Under your running ${mdLord} Mahadasha, incorporate ${COLOR_PALETTE[mdLord].en} in your upper clothing, handkerchief, or workspace backdrop.`,
    dashaColorFocusHi: `वर्तमान ${HINDI_PLANETS[mdLord]} महादशा में अपने परिधानों, रुमाल अथवा कार्यस्थल पर ${COLOR_PALETTE[mdLord].hi} रंग को प्राथमिकता दें।`,
    practicalApplicationEn:
      'Color therapy works through retinal photoreceptors influencing neurotransmitters. Avoid wearing heavily saturated prohibited colors during major interviews, court hearings, or hospital visits.',
    practicalApplicationHi:
      'वर्ण चिकित्सा आंखों की ग्रंथियों द्वारा मस्तिष्क को प्रभावित करती है। महत्वपूर्ण साक्षात्कार, परीक्षा अथवा शुभ कार्यों में वर्जित रंगों से परहेज करें।',
  };

  // 3. Astro-Yoga & Pranayama
  const astroYoga: AstroYogaRemedy[] = [
    {
      planetTargeted: mdLord,
      asanasEn: mdLord === 'Sun' || mdLord === 'Mars'
        ? ['Surya Namaskar (6-12 slow rounds)', 'Virabhadrasana (Warrior)', 'Dhanurasana (Bow)']
        : mdLord === 'Moon' || mdLord === 'Venus'
        ? ['Baddha Konasana (Butterfly)', 'Matsyasana (Fish Pose)', 'Shavasana with body scan']
        : mdLord === 'Mercury'
        ? ['Gomukhasana', 'Vrikshasana (Tree Pose for balance)', 'Sarvangasana (Shoulder Stand)']
        : mdLord === 'Jupiter'
        ? ['Halasana (Plow Pose)', 'Padmasana meditation', 'Bhujangasana (Cobra Pose)']
        : ['Paschimottanasana (Seated Forward Bend)', 'Tadasana (Mountain Pose)', 'Balasana (Child Pose)'],
      asanasHi: mdLord === 'Sun' || mdLord === 'Mars'
        ? ['सूर्य नमस्कार (6-12 चक्र शांत गति से)', 'वीरभद्रासन', 'धनुरासन']
        : mdLord === 'Moon' || mdLord === 'Venus'
        ? ['बद्ध कोणासन (तितली आसन)', 'मत्स्यासन', 'गहन शवासन']
        : mdLord === 'Mercury'
        ? ['गोमुखासन', 'वृक्षासन (एकाग्रता हेतु)', 'सर्वांगासन']
        : mdLord === 'Jupiter'
        ? ['हलासन', 'पद्मासन ध्यान', 'भुजंगासन']
        : ['पश्चिमोत्तानासन', 'ताड़ासन (स्थिरता हेतु)', 'बालासन'],
      pranayamaEn: mdLord === 'Moon' || isSadeSatiOrDhaiya
        ? ['Sheetali Pranayama (Cooling breath - 10 rounds)', 'Bhramari (Humming bee breath - 7 cycles)']
        : mdLord === 'Mercury' || mdLord === 'Rahu'
        ? ['Anulom Vilom (Alternate Nostril - 15 minutes)', 'Nadi Shodhana']
        : ['Kapalabhati (gentle pace - 3 rounds of 30 strokes)', 'Deep diaphragmatic breathing'],
      pranayamaHi: mdLord === 'Moon' || isSadeSatiOrDhaiya
        ? ['शीतली प्राणायाम (शीतलता हेतु - 10 चक्र)', 'भ्रामरी प्राणायाम (7 चक्र)']
        : mdLord === 'Mercury' || mdLord === 'Rahu'
        ? ['अनुलोम-विलोम (नाड़ी शोधन - 15 मिनट)', 'भ्रामरी']
        : ['कपालभाति (मध्यम गति - 30 झोंके के 3 चक्र)', 'दीर्घ ओंकार प्राणायाम'],
      durationMinutes: 15,
      timingEn: 'Morning on an empty stomach at sunrise or gentle twilight',
      timingHi: 'प्रातः काल सूर्योदय के समय खाली पेट स्वच्छ वायु में',
      therapeuticBenefitsEn: `Harmonizes the subtle bio-magnetic field corresponding to ${mdLord}, stabilizing nervous impulses and removing psychological exhaustion.`,
      therapeuticBenefitsHi: `${HINDI_PLANETS[mdLord]} से संबंधित जैविक ऊर्जा व नाड़ी चक्रों को संतुलित करता है, जिससे अवसाद व शारीरिक थकान मिटती है।`,
    },
  ];

  // 4. Zero-Cost Kitchen & Household Totke
  const kitchenTotke: KitchenTotkaRemedy[] = [
    {
      titleEn: 'Silver Glass Water Therapy (Chandra Upaya)',
      titleHi: 'चांदी के गिलास में जल सेवन (चंद्र-बुध शांति)',
      category: 'water_therapy',
      itemsNeededEn: 'Pure silver cup, tumbler, or a small clean pure silver coin placed inside water tumbler.',
      itemsNeededHi: 'शुद्ध चांदी का गिलास अथवा साधारण पानी के पात्र में रखा हुआ शुद्ध चांदी का चौकोर टुकड़ा/सिक्का।',
      stepByStepEn: 'Store filtered drinking water in the silver vessel for at least 4 hours. Drink first thing in the morning.',
      stepByStepHi: 'रात को चांदी के गिलास में जल भरकर रखें और प्रातः काल उठकर सर्वप्रथम इस जल का घूंट-घूंट कर सेवन करें।',
      logicalAstroBasisEn: 'Silver is classical Chandra/Venus karaka; absorbs excess heat, eliminates irrational panic, and restores emotional composure.',
      logicalAstroBasisHi: 'चांदी चंद्र तत्व की धातु है; यह शरीर के अतिरिक्त पित्त व मानसिक उत्तेजना को शांत कर अनिद्रा व भय को दूर करती है।',
      lifestyleTag: 'zero_cost',
    },
    {
      titleEn: 'Copper Water Solar Infusion (Surya Upaya)',
      titleHi: 'तांबे के लोटे का जल व सूर्य अर्घ्य',
      category: 'water_therapy',
      itemsNeededEn: 'Copper jug or tumbler, clean water, pinch of red sandalwood or Kumkum.',
      itemsNeededHi: 'तांबे का पात्र, शुद्ध जल, एक चुटकी रोली अथवा लाल चंदन।',
      stepByStepEn: 'Fill copper jug at night. In the morning, offer a portion to the rising Sun facing East while chanting Gayatri, drink remaining water.',
      stepByStepHi: 'रातभर तांबे के पात्र में रखे जल में एक चुटकी रोली डालकर प्रातः पूर्व दिशा में सूर्यदेव को अर्घ्य दें, शेष जल ग्रहण करें।',
      logicalAstroBasisEn: 'Boosts Agni tattva, vitalizes liver and digestive fire, dispels lethargy, and enhances authority.',
      logicalAstroBasisHi: 'अग्नि तत्व को सक्रिय करता है, यकृत (लिवर) व पाचन को सुदृढ़ कर आलस्य मिटाता है और आत्मविश्वास बढ़ाता है।',
      lifestyleTag: 'quick_daily',
    },
    {
      titleEn: 'Kitchen Floor & Bedside Salt Protection (Rahu / Vastu Shuddhi)',
      titleHi: 'सेंधा नमक पोछा व सिरहाने सौंफ (राहु शांति)',
      category: 'household_habit',
      itemsNeededEn: 'Whole rock salt (Sendha namak), small cloth pouch, sweet fennel seeds (saunf).',
      itemsNeededHi: 'सेंधा या खड़ा नमक, एक मुट्ठी सौंफ, सूती रुमाल।',
      stepByStepEn: 'Add a pinch of rock salt to floor mopping water once a week. Keep a small pouch of saunf under pillow to prevent restless sleep.',
      stepByStepHi: 'सप्ताह में एक बार पोंछे के पानी में सेंधा नमक मिलाएं। बुरे स्वप्न व मानसिक भटकाव से बचने हेतु सिरहाने सौंफ की पोटली रखें।',
      logicalAstroBasisEn: 'Neutralizes negative astral static (Rahu), clears heavy electromagnetic smog, and relieves sleep paralysis.',
      logicalAstroBasisHi: 'राहु जनित नकारात्मक ऊर्जा व अज्ञात भय को सोख लेता है; गहरी व शांत निद्रा प्रदान करता है।',
      lifestyleTag: 'metro_friendly',
    },
    {
      titleEn: 'Daily Forehead Kesar/Turmeric Tilak (Guru Blessing)',
      titleHi: 'केसर अथवा कस्तूरी हल्दी का तिलक (बृहस्पति अनुग्रह)',
      category: 'kitchen_item',
      itemsNeededEn: 'Pure kitchen turmeric powder mixed with a drop of milk, or pure saffron threads.',
      itemsNeededHi: 'शुद्ध हल्दी चूर्ण में दो बूंद गंगाजल/दूध अथवा केसर।',
      stepByStepEn: 'Apply a microscopic dot at the Ajna chakra (between eyebrows) and on the throat daily before beginning work.',
      stepByStepHi: 'नित्य प्रातः स्नान के उपरांत अनामिका अंगुली से आज्ञा चक्र (माथे के मध्य) तथा कंठ पर तिलक लगाएं।',
      logicalAstroBasisEn: 'Activates the Jupiterian pituitary center, attracts respect from colleagues, and calms financial anxieties.',
      logicalAstroBasisHi: 'आज्ञा चक्र पर गुरु की शुभता स्थापित करता है; वाणी में वजन, सम्मान व निर्णय क्षमता में स्पष्टता लाता है।',
      lifestyleTag: 'quick_daily',
    },
    {
      titleEn: 'Animal Charity: Bread with Mustard Oil for Stray Dogs (Shani-Ketu)',
      titleHi: 'श्वान (कुत्ते) को तेल चुपड़ी रोटी (शनि-केतु-राहु निवारण)',
      category: 'animal_charity',
      itemsNeededEn: 'One plain wheat roti smeared with 3 drops of pure mustard oil.',
      itemsNeededHi: 'एक सादी गेहूं की रोटी जिस पर 3-4 बूंद सरसों का तेल लगा हो।',
      stepByStepEn: 'Offer to a black or stray dog on Saturday evening without chasing or scaring the animal.',
      stepByStepHi: 'शनिवार सायंकाल किसी गली के श्वान को आदरपूर्वक यह रोटी खिलाएं।',
      logicalAstroBasisEn: 'Dogs are sacred Bhairava vahanas; neutralizes sudden accidents, court tangles, and ancestral debts.',
      logicalAstroBasisHi: 'श्वान भगवान भैरव के दूत माने गए हैं; यह उपाय आकस्मिक संकट, शत्रु बाधा व मुकदमेबाजी से रक्षा करता है।',
      lifestyleTag: 'zero_cost',
    },
  ];

  // 5. Classical Stotras & Paths tailored to problem areas
  const classicalStotras: ClassicalStotraRemedy[] = [
    {
      stotraNameEn: 'Kanakadhara Stotra & Shree Suktam',
      stotraNameHi: 'कनकधारा स्तोत्रम् एवं श्री सूक्तम्',
      problemArea: 'finance_wealth',
      keyDeity: 'Maha Lakshmi',
      recommendedCount: '1 recitation daily at dusk (Sandhya Kaal)',
      bestDayTimingEn: 'Friday evening facing North or East, lighting a cow-ghee lamp',
      bestDayTimingHi: 'शुक्रवार सायंकाल उत्तर अथवा पूर्व मुखी होकर गाय के घी का दीपक प्रज्वलित कर',
      sampleSanskritVerse: 'वन्दे वन्दारुमन्दारमिन्दिरामानन्दकन्दममृताम्बुधिमन्थनोत्थाम्।',
      meaningEn: 'Salutations to Mother Lakshmi, the fulfiller of righteous desires, emerging from the ocean of nectar.',
      meaningHi: 'ऋण मुक्ति, व्यापारिक मंदी निवारण व धन संचय हेतु आदि शंकराचार्य विरचित परम सिद्ध स्तोत्र।',
      targetPlanet: 'Venus',
      urgencyLevel: 'high',
    },
    {
      stotraNameEn: 'Maharaj Dasharatha Shani Stotra & Hanuman Chalisa',
      stotraNameHi: 'महाराज दशरथकृत शनि स्तोत्र एवं श्री हनुमान चालीसा',
      problemArea: 'sade_sati_anxiety',
      keyDeity: 'Lord Shani & Sri Hanuman',
      recommendedCount: '11 Hanuman Chalisa or 1 Dasharatha Shani Stotra on Saturdays',
      bestDayTimingEn: 'Saturday evening after sunset, lighting a mustard oil lamp under Peepal tree or at home altar',
      bestDayTimingHi: 'शनिवार सूर्यास्त के पश्चात सरसों के तेल का दीपक जलाकर श्रद्धापूर्वक पाठ',
      sampleSanskritVerse: 'नमः कृष्णाय नीलाय शितिकण्ठनिभाय च। नमः कालाग्निरूपाय कृतान्ताय च वै नमः॥',
      meaningEn: 'Salutations to the dark-hued, ascetic Lord Saturn, ruler of time and justice.',
      meaningHi: 'साढ़े साती, ढैया, कार्यों में अत्यधिक विलंब, अवसाद व मुकदमों से मुक्ति हेतु अमोघ रक्षा स्तोत्र।',
      targetPlanet: 'Saturn',
      urgencyLevel: isSadeSatiOrDhaiya ? 'high' : 'moderate',
    },
    {
      stotraNameEn: 'Maha Mrityunjaya Mantra & Achyuta-Ananta-Govinda Japa',
      stotraNameHi: 'महामृत्युंजय मंत्र एवं अच्युतानंत गोविंद नाम जप',
      problemArea: 'health_arishta',
      keyDeity: 'Bhagwan Shiva & Lord Dhanvantari',
      recommendedCount: '108 repetitions daily on Rudraksha mala',
      bestDayTimingEn: 'Dawn (Brahma Muhurta) facing North-East',
      bestDayTimingHi: 'प्रातः काल पूर्वोत्तर (ईशान) मुखी होकर रुद्राक्ष माला पर',
      sampleSanskritVerse: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्य pushyee mamritat॥',
      meaningEn: 'We worship the Three-Eyed Lord Shiva, fragrant nourisher of life; liberate us from mortality and illness.',
      meaningHi: 'अकाल मृत्यु भय, मातृ/पितृ अरिष्ट, दीर्घकालीन व्याधि व शारीरिक प्राण रक्षा हेतु महा-संजीवनी मंत्र।',
      targetPlanet: 'Moon',
      urgencyLevel: 'high',
    },
    {
      stotraNameEn: 'Aditya Hridaya Stotra & Gayatri Mantra',
      stotraNameHi: 'आदित्य हृदय स्तोत्र एवं गायत्री महामंत्र',
      problemArea: 'career_job',
      keyDeity: 'Bhagwan Surya Narayana',
      recommendedCount: '3 rounds on Sunday or 1 round daily at sunrise',
      bestDayTimingEn: 'Sunday morning facing the golden disc of the rising Sun',
      bestDayTimingHi: 'रविवार प्रातः उगते हुए सूर्य के सम्मुख तांबे के लोटे में जल रखकर',
      sampleSanskritVerse: 'ततो युद्धपरिश्रान्तं समरे चिन्तया स्थितम्। रावणं चाग्रतो दृष्ट्वा युद्धाय समुपस्थितम्॥',
      meaningEn: 'Sage Agastya imparted this supreme hymn to Lord Rama, bestowing instant victory over all obstacles.',
      meaningHi: 'सरकारी नौकरी, प्रशासनिक पद, पिता के स्वास्थ्य, मान-सम्मान व नेत्र ज्योति की रक्षा हेतु परम तेजस्वी स्तोत्र।',
      targetPlanet: 'Sun',
      urgencyLevel: 'moderate',
    },
    {
      stotraNameEn: 'Sankat Nashan Ganesha Stotra',
      stotraNameHi: 'संकटनाशन श्री गणेश स्तोत्रम्',
      problemArea: 'court_enemies',
      keyDeity: 'Lord Vighnaharta Ganesha',
      recommendedCount: '3 repetitions daily before embarking on work',
      bestDayTimingEn: 'Morning after bath',
      bestDayTimingHi: 'प्रातः किसी भी कार्य के आरंभ से पूर्व',
      sampleSanskritVerse: 'प्रणम्य शिरसा देवं गौरीपुत्रं विनायकम्। भक्तावासं स्मरेन्नित्यमायुःकामार्थसिद्धये॥',
      meaningEn: 'Bow head to Lord Vinayaka, son of Gauri, who dispels all distress and bestows fulfillment.',
      meaningHi: 'अकारण कोर्ट-कचहरी, विरोधी षड्यंत्र, कार्य में रुकावट व आकस्मिक विघ्नों का समूल नाश करने वाला पाठ।',
      targetPlanet: 'Mercury',
      urgencyLevel: 'moderate',
    },
    {
      stotraNameEn: 'Santan Gopal Mantra & Garbha Raksha Stotram',
      stotraNameHi: 'संतान गोपाल स्तोत्र एवं गर्भ रक्षांबिका पाठ',
      problemArea: 'progeny_children',
      keyDeity: 'Bal Gopal Krishna & Mata Garbha Rakshambika',
      recommendedCount: '108 repetitions daily with Tulsi mala',
      bestDayTimingEn: 'Morning after puja with saffron milk or butter offering',
      bestDayTimingHi: 'प्रातः काल माखन-मिश्री का भोग लगाकर तुलसी माला पर 108 जप',
      sampleSanskritVerse: 'देवकीसुत गोविन्द वासुदेव जगत्पते। देहि मे तनयं कृष्ण त्वामहं शरणं गतः॥',
      meaningEn: 'O Son of Devaki, Lord Govinda, Master of the Universe! Grant me a noble child; I surrender to Your shelter.',
      meaningHi: 'संतान प्राप्ति में बाधा, अनपत्य दोष, गर्भपात जोखिम निवारण व सुयोग्य संतान हेतु शास्त्रीय उपाय।',
      targetPlanet: 'Jupiter',
      urgencyLevel: 'high',
    },
  ];

  // 6. Ishta Devata Sadhana (from D9 Karakamsa 12th House)
  // Find Atmakaraka (planet with highest longitude in D1)
  const sortedByLong = [...chart.planets].filter((p) => p.id !== 'Rahu' && p.id !== 'Ketu').sort((a, b) => (b.longitude % 30) - (a.longitude % 30));
  const ak = sortedByLong[0] || chart.planets[0];
  const d9AkPlacement = chart.divisionalCharts.D9.placements.find((p) => p.id === ak.id) || chart.divisionalCharts.D9.placements[0];
  const karakamsaSign = d9AkPlacement.signIndex;
  const h12FromKarakamsa = (karakamsaSign + 11) % 12;
  const h12Lord = SIGNS[h12FromKarakamsa].lord as NineGrahaId;

  const ISHTA_MAP: Record<NineGrahaId, { nameEn: string; nameHi: string; mantra: string; offeringEn: string; offeringHi: string }> = {
    Sun: {
      nameEn: 'Lord Shiva or Sri Rama',
      nameHi: 'भगवान शिव अथवा मर्यादा पुरुषोत्तम श्रीराम',
      mantra: 'ॐ नमः शिवाय (Om Namah Shivaya) or ॐ रां रामाय नमः',
      offeringEn: 'Water, Belpatra, or Red Flowers',
      offeringHi: 'शुद्ध जल, बेलपत्र अथवा लाल पुष्प',
    },
    Moon: {
      nameEn: 'Goddess Parvati / Gauri or Sri Krishna',
      nameHi: 'माता पार्वती / भुवनेश्वरी अथवा श्री राधा-कृष्ण',
      mantra: 'ॐ क्लीं कृष्णाय नमः (Om Kleem Krishnaya Namah)',
      offeringEn: 'White sweets, Mishri, or White Flowers',
      offeringHi: 'सफेद मिठाई, मिश्री-माखन अथवा श्वेत पुष्प',
    },
    Mars: {
      nameEn: 'Lord Hanuman or Kartikeya (Subrahmanya)',
      nameHi: 'श्री हनुमान जी अथवा भगवान कार्तिकेय (स्कंद)',
      mantra: 'ॐ हं हनुमते नमः (Om Ham Hanumate Namah)',
      offeringEn: 'Jaggery, Gram (Chana), or Sindoor',
      offeringHi: 'गुड़-चना, तुलसी दल अथवा सिंदूर',
    },
    Mercury: {
      nameEn: 'Lord Maha Vishnu or Narayana',
      nameHi: 'भगवान श्री लक्ष्मीनारायण अथवा महाविष्णु',
      mantra: 'ॐ नमो भगवते वासुदेवाय (Om Namo Bhagavate Vasudevaya)',
      offeringEn: 'Tulsi leaves and Yellow fruits',
      offeringHi: 'तुलसी दल, पीले फल व पंचामृत',
    },
    Jupiter: {
      nameEn: 'Lord Brihaspati, Shiva as Dakshinamurthy, or Sri Dattatreya',
      nameHi: 'सदाशिव, दक्षिणामूर्ति अथवा भगवान श्री दत्तात्रेय',
      mantra: 'ॐ गुरुवे नमः (Om Gurave Namah) or ॐ द्रां दत्तात्रेयाय नमः',
      offeringEn: 'Yellow flowers, Besan ladoo, or Chana dal',
      offeringHi: 'पीले कनेर के पुष्प, बेसन के लड्डू अथवा भीगी चना दाल',
    },
    Venus: {
      nameEn: 'Maha Lakshmi or Annapurna',
      nameHi: 'माता महालक्ष्मी अथवा मां अन्नपूर्णा',
      mantra: 'ॐ श्रीं ह्रीं श्रीं कमले कमलालये प्रसीद प्रसीद श्रीं ह्रीं श्रीं ॐ महालक्ष्म्यै नमः',
      offeringEn: 'Kheer (Rice Pudding), Lotus, or Rose petals',
      offeringHi: 'खीर, श्वेत बताशे अथवा गुलाब पुष्प',
    },
    Saturn: {
      nameEn: 'Lord Kurma, Sri Kaal Bhairava, or Hanumanji',
      nameHi: 'भगवान काल भैरव, कूर्म अवतार अथवा श्री हनुमान जी',
      mantra: 'ॐ भ्रं भैरवाय नमः (Om Bhram Bhairavaya Namah)',
      offeringEn: 'Mustard oil lamp, Black sesame seeds, or Urad dal',
      offeringHi: 'तिल का तेल, काले उड़द अथवा नीला पुष्प',
    },
    Rahu: {
      nameEn: 'Goddess Durga / Chandi or Sri Varaha',
      nameHi: 'मां दुर्गा / चंडिका अथवा भगवान वराह',
      mantra: 'ॐ दुं दुर्गायै नमः (Om Dum Durgaye Namah)',
      offeringEn: 'Cloves, Pomegranate, or Red Hibiscus',
      offeringHi: 'लौंग का जोड़ा, अनार अथवा लाल अड़हुल का पुष्प',
    },
    Ketu: {
      nameEn: 'Lord Matsya or Lord Ganesha (Vighnaharta)',
      nameHi: 'भगवान मत्स्य अवतार अथवा श्री विघ्नहर्ता गणेश जी',
      mantra: 'ॐ गं गणपतये नमः (Om Gam Ganapataye Namah)',
      offeringEn: 'Durva grass and Modak / Laddus',
      offeringHi: '21 दूर्वा दल तथा मोदक अथवा गुड़',
    },
  };

  const ishtaInfo = ISHTA_MAP[h12Lord] || ISHTA_MAP.Jupiter;
  const ishtaDevata: IshtaDevataRemedy = {
    deityNameEn: ishtaInfo.nameEn,
    deityNameHi: ishtaInfo.nameHi,
    classicalBasisEn: `Atmakaraka ${ak.id} falls in ${SIGNS[karakamsaSign].name} in D9 Navamsha (Karakamsa). The 12th house from Karakamsa (${SIGNS[h12FromKarakamsa].name}) is ruled by ${h12Lord}. Under Jaimini Upadesha Sutras, this directly identifies your soul’s liberating Ishta Devata.`,
    classicalBasisHi: `नवांश (D9) में आत्मकारक ${HINDI_PLANETS[ak.id] || ak.id} ${SIGNS[karakamsaSign].name} राशि में स्थित होकर कारकांश बनाते हैं। कारकांश से 12वें भाव के अधिपति ${HINDI_PLANETS[h12Lord]} हैं। जैमिनी महर्षि के अनुसार यह ग्रह जातक के आत्मा के मोक्षदाता इष्ट देव का निर्धारण करता है।`,
    moolaMantra: ishtaInfo.mantra,
    recitationCount: '108 times daily (1 mala) facing East/North',
    offeringEn: ishtaInfo.offeringEn,
    offeringHi: ishtaInfo.offeringHi,
  };

  // 7. Herbal Planetary Astro-Baths (स्नान परिहार)
  const herbalBaths: HerbalBathRemedy[] = [
    {
      dayOfWeekEn: 'Monday (Somavara)',
      dayOfWeekHi: 'सोमवार',
      planet: 'Moon',
      herbalIngredientsEn: ['2 spoons raw milk', 'few drops rose water', 'pinch of white sandalwood powder'],
      herbalIngredientsHi: ['दो चम्मच कच्चा दूध', 'गुलाब जल की कुछ बूंदें', 'सफेद चंदन पाउडर'],
      methodEn: 'Add ingredients into morning bath bucket; visualize lunar calm entering your aura.',
      methodHi: 'स्नान के जल में मिलाकर स्नान करें; मानसिक शांति व सौम्यता की भावना रखें।',
      benefitsEn: 'Eliminates mental restlessness, relieves chronic headaches and negative dreams.',
      benefitsHi: 'अनिद्रा, सिरदर्द व मानसिक अवसाद को दूर कर शीतलता देता है।',
    },
    {
      dayOfWeekEn: 'Thursday (Guruvara)',
      dayOfWeekHi: 'गुरुवार',
      planet: 'Jupiter',
      herbalIngredientsEn: ['Pinch of pure turmeric (haldi)', 'few yellow flower petals', 'pinch of licorice (mulethi)'],
      herbalIngredientsHi: ['एक चुटकी शुद्ध हल्दी', 'पीले पुष्प की पंखुड़ियां', 'थोड़ी मुलेठी'],
      methodEn: 'Mix into warm bath water on Thursday morning before puja.',
      methodHi: 'गुरुवार प्रातः स्नान जल में हल्दी मिलाकर स्नान करें।',
      benefitsEn: 'Removes marital delay vibrations, brings financial positivity and intellectual radiance.',
      benefitsHi: 'विवाह बाधा निवारण, गुरु दोष शांति व ज्ञान की आभा में वृद्धि।',
    },
    {
      dayOfWeekEn: 'Saturday (Shanivara)',
      dayOfWeekHi: 'शनिवार',
      planet: 'Saturn',
      herbalIngredientsEn: ['Few black sesame seeds (kala til)', 'khus vetiver grass extract', '2 drops mustard oil'],
      herbalIngredientsHi: ['कुछ काले तिल', 'खस का अर्क अथवा जड़', 'सरसों के तेल की 2 बूंदें'],
      methodEn: 'Infuse in water and bathe on Saturday late morning.',
      methodHi: 'शनिवार को जल में काले तिल व खस डालकर स्नान करें।',
      benefitsEn: 'Shields against Sade Sati exhaustion, bone ache, chronic fatigue, and psychic heaviness.',
      benefitsHi: 'शनि की ढैया/साढ़े साती के कष्ट, आलस्य, जोड़ों के दर्द व नकारात्मक ऊर्जा से रक्षा।',
    },
  ];

  // 8. Prescription Slip
  const prescriptionSlip: PrescriptionSlip = {
    clientName: chart.input.name || 'Valued Seeker',
    dateStr: formatDateDmy(new Date()),
    activeDasha: `${mdLord} Mahadasha / ${adLord} Antardasha`,
    dominantDoshaOrAfflictionEn: isSadeSatiOrDhaiya
      ? `Active Sade Sati / Dhaiya Influence + Running ${mdLord} Dasha`
      : `Running ${mdLord} Dasha Cycle (Focus on emotional and career stability)`,
    dominantDoshaOrAfflictionHi: isSadeSatiOrDhaiya
      ? `सक्रिय साढ़े साती / ढैया का प्रभाव + वर्तमान ${HINDI_PLANETS[mdLord]} महादशा`
      : `वर्तमान ${HINDI_PLANETS[mdLord]} महादशा चक्र (मानसिक व कर्म संतुलन अपेक्षित)`,
    primaryRoot: herbalRoots.find((r) => r.isRecommended)?.rootNameHi || 'केले या हल्दी की गांठ',
    primaryColorRule: `शुभ रंग: ${favorableColorsHi[0]} | वर्जित रंग: ${avoidColorsHi[0]}`,
    coreDailyStotra: isSadeSatiOrDhaiya
      ? 'महाराज दशरथकृत शनि स्तोत्र एवं श्री हनुमान चालीसा'
      : `${ishtaDevata.deityNameHi} का मूल मंत्र (108 जप) व कनकधारा स्तोत्र`,
    kitchenZeroCostHabit: 'चांदी के गिलास में जल सेवन अथवा सिरहाने सौंफ की पोटली',
    dietaryTip: 'सूर्यास्त के उपरांत भारी या तामसिक भोजन से बचें, जल में तांबे/चांदी का स्पर्श रखें।',
    astrologerCounselEn:
      'Remedies are not magic switches; they are subtle conscious course-corrections. Practicing low-cost herbal, color, and lifestyle alignment with clean karma yields far more lasting grace than expensive stones.',
    astrologerCounselHi:
      'उपाय कोई अंधविश्वास या जादू नहीं हैं; वे चेतना के सूक्ष्म शोधन का विज्ञान हैं। महंगे रत्नों के आडंबर की बजाय प्रकृति की जड़ों, पवित्र रंगों, सात्विक दिनचर्या व सच्चे ईश्वरीय समर्पण से कर्म के बंधन स्वतः शिथिल हो जाते हैं।',
  };

  return {
    activeDasha: {
      mahadasha: mdLord,
      antardasha: adLord,
      summaryEn: `Currently running ${mdLord} Mahadasha and ${adLord} Antardasha. All remedies are harmonized to pacify negative dasha transits while empowering your Lagna benefics.`,
      summaryHi: `वर्तमान में ${HINDI_PLANETS[mdLord]} महादशा तथा ${HINDI_PLANETS[adLord]} अंतर्दशा प्रभावी है। समस्त उपचार आपकी दशा व लग्न कारकों को संतुलित करने हेतु विशेष रूप से संयोजित किए गए हैं।`,
    },
    gocharHighlights: {
      saturnTransitHouse: distFromMoon + 1,
      isSadeSatiOrDhaiya,
      sadeSatiPhaseTextEn,
      sadeSatiPhaseTextHi,
      jupiterTransitHouse: ((1 - moonSign + 12) % 12) + 1, // Jupiter transit
      rahuTransitHouse: ((10 - moonSign + 12) % 12) + 1, // Rahu in Aquarius/Pisces
    },
    herbalRoots,
    colorTherapy,
    astroYoga,
    kitchenTotke,
    classicalStotras,
    ishtaDevata,
    herbalBaths,
    prescriptionSlip,
  };
}
