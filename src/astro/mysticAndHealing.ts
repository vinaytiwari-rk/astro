import { computeNumerologyReport } from './numerology';
import { evaluateParamayusStatus } from './predictions/paramayus';
import type { ChartData, SevenPlanetId } from './types';

export interface HealingModalityItem {
  id: 'ayurveda' | 'yoga' | 'meditation' | 'color' | 'crystal' | 'acupressure' | 'reiki' | 'fengshui' | 'aromatherapy';
  titleEn: string;
  titleHi: string;
  focusEn: string;
  focusHi: string;
  prescriptionEn: string;
  prescriptionHi: string;
}

export interface HealingReport {
  doshaDominantEn: string;
  doshaDominantHi: string;
  kuaNumber: number;
  weakestPlanet: SevenPlanetId;
  items: HealingModalityItem[];
}

export interface PrashnavaliOutcome {
  id: number;
  chaupai: string;
  sourceEn: string;
  sourceHi: string;
  verdict: 'Auspicious' | 'Wait / Patience' | 'Mixed / Effort';
  meaningEn: string;
  meaningHi: string;
}

export interface PalmMountStatus {
  mountEn: string;
  mountHi: string;
  planet: SevenPlanetId;
  locationEn: string;
  locationHi: string;
  strengthRatio: number;
  readingEn: string;
  readingHi: string;
}

export interface SacredPrayerItem {
  id: string;
  category: 'Mantra' | 'Chalisa' | 'Aarti' | 'Dharma';
  titleEn: string;
  titleHi: string;
  sanskritOrHindiText: string;
  meaningEn: string;
  meaningHi: string;
  planetOrDeity: string;
}

// Authentic 9 Chaupais of Goswami Tulsidas's Shri Ramcharitmanas Ramshalaka (indices 0..8)
const RAMSHALAKA_OUTCOMES: PrashnavaliOutcome[] = [
  {
    id: 1,
    chaupai: 'सुनु सिय सत्य असीस हमारी। पूजिहि मन कामना तुम्हारी॥',
    sourceEn: 'Balakanda (Gauri Ashirwad)',
    sourceHi: 'बालकाण्ड (गौरी आशीर्वाद)',
    verdict: 'Auspicious',
    meaningEn: 'Highly auspicious! Your heartfelt wish and ethical endeavor will be fulfilled with divine grace.',
    meaningHi: 'अत्यंत शुभ प्रश्न! आपके मन की कामना पूर्ण होगी और शुभ कार्य निश्चित रूप से सिद्ध होगा।',
  },
  {
    id: 2,
    chaupai: 'प्रबिसि नगर कीजे सब काजा। हृदयँ राखि कोसलपुर राजा॥',
    sourceEn: 'Sundarkanda',
    sourceHi: 'सुन्दरकाण्ड',
    verdict: 'Auspicious',
    meaningEn: 'Go ahead confidently! Keep faith in righteousness and begin the work immediately for success.',
    meaningHi: 'निश्चिंत होकर कार्य आरंभ करें — ईश्वर स्मरण के साथ प्रयास करने पर पूर्ण सफलता मिलेगी।',
  },
  {
    id: 3,
    chaupai: 'उघरहिं बिमल बिलोचन ही के। मिटहिं दोष दुख भव रजनी के॥',
    sourceEn: 'Balakanda',
    sourceHi: 'बालकाण्ड',
    verdict: 'Auspicious',
    meaningEn: 'Clouds of confusion and past sorrow will clear away; clarity, relief, and upliftment arrive.',
    meaningHi: 'संदेह और कष्ट दूर होंगे, ज्ञान-चक्षु खुलेंगे और उत्तम समाधान प्राप्त होगा।',
  },
  {
    id: 4,
    chaupai: 'गइ बहोरि गरुड़ गरुराई। राम कृपाँ सब बिधि सुखदाई॥',
    sourceEn: 'Lankakanda / Prasada',
    sourceHi: 'रामचरितमानस प्रसंग',
    verdict: 'Auspicious',
    meaningEn: 'What seemed lost or delayed returns favorably through renewed grace and support.',
    meaningHi: 'अटका हुआ कार्य या खोया अवसर पुनः प्राप्त होने का शुभ संकेत है।',
  },
  {
    id: 5,
    chaupai: 'बिधि बस सुजन कुसंगत परहीं। फनि मनि सम निज गुन अनुसरहीं॥',
    sourceEn: 'Balakanda',
    sourceHi: 'बालकाण्ड',
    verdict: 'Wait / Patience',
    meaningEn: 'Exercise caution with company and advisors; hold firm to your principles and postpone risky commitments.',
    meaningHi: 'कुसंगति या भ्रामक सलाह से बचें; धैर्य रखें और अभी जोखिम भरा निर्णय टालें।',
  },
  {
    id: 6,
    chaupai: 'होइहि सोइ जो राम रचि राखा। को करि तर्क बढ़ावै साखा॥',
    sourceEn: 'Balakanda',
    sourceHi: 'बालकाण्ड',
    verdict: 'Mixed / Effort',
    meaningEn: 'Surrender excessive worry about uncontrollable outcomes; perform your duty calmly and let destiny align.',
    meaningHi: 'व्यर्थ चिंता छोड़कर कर्तव्य पथ पर अडिग रहें; जो श्रेयस्कर होगा वही स्वाभाविक घटेगा।',
  },
  {
    id: 7,
    chaupai: 'मुद मंगलमय संत समाजू। जो जग जंगम तीरथराजू॥',
    sourceEn: 'Balakanda',
    sourceHi: 'बालकाण्ड',
    verdict: 'Auspicious',
    meaningEn: 'Guidance from wise mentors, family, and virtuous peers brings joy and lasting success.',
    meaningHi: 'श्रेष्ठजनों, गुरुजनों एवं शुभ संगति से आनंद, सहयोग और कार्य-सिद्धि प्राप्त होगी।',
  },
  {
    id: 8,
    chaupai: 'गरल सुधा रिपु करहिं मिताई। गोपद सिंधु अनल सितलाई॥',
    sourceEn: 'Sundarkanda',
    sourceHi: 'सुन्दरकाण्ड',
    verdict: 'Auspicious',
    meaningEn: 'Even obstacles turn into allies — difficult situations become effortless through courage and grace.',
    meaningHi: 'विपरीत परिस्थितियाँ और विरोधी भी अनुकूल हो जाएंगे — कठिन कार्य सरलता से बनेगा।',
  },
  {
    id: 9,
    chaupai: 'बरुन कुबेर सुरेस समीरा। रन सन्मुख धरि काहुँ न धीरा॥',
    sourceEn: 'Lankakanda',
    sourceHi: 'लंकाकाण्ड',
    verdict: 'Wait / Patience',
    meaningEn: 'Pause before confrontation or major outlay; reassess your plan calmly and wait for a stronger time.',
    meaningHi: 'विवाद या बड़े निर्णय से अभी रुकें; शांत मन से पुनर्विचार कर उचित समय की प्रतीक्षा करें।',
  },
];

// Authentic 15x15 = 225-syllable Ramshalaka Grid (repeating 9-step interlaced sequence modulo 9 chaupai index)
const BASE_9_SYLLABLES = ['सु', 'प्र', 'उ', 'ग', 'बि', 'हो', 'मु', 'ग', 'ब'];
export const RAMSHALAKA_CELLS: Array<{ row: number; col: number; letter: string; outcomeIdx: number }> = Array.from(
  { length: 225 },
  (_, idx) => {
    const outcomeIdx = idx % 9;
    return {
      row: Math.floor(idx / 15),
      col: idx % 15,
      letter: BASE_9_SYLLABLES[outcomeIdx],
      outcomeIdx,
    };
  }
);

export function resolveRamshalaka(cellIndex: number): PrashnavaliOutcome {
  const stepIdx = ((cellIndex % 225) + 225) % 225;
  return RAMSHALAKA_OUTCOMES[stepIdx % 9];
}

export function resolveHanumanPrashna(squareOneTo49: number): PrashnavaliOutcome {
  const hanumanList: PrashnavaliOutcome[] = [
    {
      id: 1,
      chaupai: 'संकट कटै मिटै सब पीरा। जो सुमिरै हनुमत बलबीरा॥',
      sourceEn: 'Hanuman Chalisa',
      sourceHi: 'हनुमान चालीसा',
      verdict: 'Auspicious',
      meaningEn: 'All obstacles will recede cleanly. Pray to Shri Hanuman with courage and begin steady action.',
      meaningHi: 'सभी संकट व बाधाएं शांत होंगी। निर्भय होकर सकारात्मक प्रयास प्रारंभ करें।',
    },
    {
      id: 2,
      chaupai: 'नासै रोग हरै सब पीरा। जपत निरंतर हनुमत बीरा॥',
      sourceEn: 'Hanuman Chalisa',
      sourceHi: 'हनुमान चालीसा',
      verdict: 'Auspicious',
      meaningEn: 'Favorable recovery in health, mental peace, and clearing of lingering disputes.',
      meaningHi: 'स्वास्थ्य में सुधार, मानसिक तनाव से मुक्ति व अवरोध समाप्ति का संकेत।',
    },
    {
      id: 3,
      chaupai: 'अस कठिन काज जगत माहीं। जो नहिं होय तात तुम पाहीं॥',
      sourceEn: 'Hanuman Chalisa',
      sourceHi: 'हनुमान चालीसा',
      verdict: 'Auspicious',
      meaningEn: 'Though the task looks demanding, sustained perseverance guarantees breakthrough success.',
      meaningHi: 'कार्य चुनौतीपूर्ण है परंतु दृढ़ परिश्रम और विश्वास से अवश्य पूर्ण होगा।',
    },
    {
      id: 4,
      chaupai: 'अष्ट सिद्धि नौ निधि के दाता। अस बर दीन जानकी माता॥',
      sourceEn: 'Hanuman Chalisa',
      sourceHi: 'हनुमान चालीसा',
      verdict: 'Auspicious',
      meaningEn: 'Wealth, status, and resource support increase steadily over the coming phase.',
      meaningHi: 'धन, पद, विद्या व संसाधनों में क्रमशः शुभ वृद्धि के योग हैं।',
    },
    {
      id: 5,
      chaupai: 'दुर्गम काज जगत के जेते। सुगम अनुग्रह तुम्हरे तेते॥',
      sourceEn: 'Hanuman Chalisa',
      sourceHi: 'हनुमान चालीसा',
      verdict: 'Mixed / Effort',
      meaningEn: 'Do not rush blindly; follow proper rules and seek advice from experienced elders before executing.',
      meaningHi: 'जल्दबाज़ी न करें — नियमों का पालन कर अनुभवी जनों की सलाह से कार्य करें।',
    },
    {
      id: 6,
      chaupai: 'राम दुआरे तुम रखवारे। होत न आज्ञा बिनु पैसारे॥',
      sourceEn: 'Hanuman Chalisa',
      sourceHi: 'हनुमान चालीसा',
      verdict: 'Wait / Patience',
      meaningEn: 'Wait for formal approval or clearer timing. Patience and pure intention unlock the right door.',
      meaningHi: 'थोड़ा धैर्य रखें व उचित स्वीकृति की प्रतीक्षा करें — सही समय शीघ्र आएगा।',
    },
    {
      id: 7,
      chaupai: 'सब सुख लहै तुम्हारी सरना। तुम रक्षक काहू को डरना॥',
      sourceEn: 'Hanuman Chalisa',
      sourceHi: 'हनुमान चालीसा',
      verdict: 'Auspicious',
      meaningEn: 'Complete protection surrounds your home and family; stay cheerful and proceed without fear.',
      meaningHi: 'परिवार और कार्य में पूर्ण सुरक्षा व मंगल है — भय त्याग कर आगे बढ़ें।',
    },
  ];
  const idx = (Math.max(1, squareOneTo49) - 1) % hanumanList.length;
  return hanumanList[idx];
}

export function resolveGaneshPrashna(slot1to12: number): PrashnavaliOutcome {
  const outcomes: PrashnavaliOutcome[] = [
    {
      id: 1,
      chaupai: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
      sourceEn: 'Ganesh Ashirwad',
      sourceHi: 'गणेश स्मरण',
      verdict: 'Auspicious',
      meaningEn: 'Obstacles vanish; smooth initiation for business, education, and auspicious ceremonies.',
      meaningHi: 'विघ्न दूर होंगे — व्यापार, विद्या और मांगलिक कार्यों के लिए उत्तम समय।',
    },
    {
      id: 2,
      chaupai: 'गजाननं भूतगणादिसेवितं कपित्थजम्बूफलचारुभक्षणम्।',
      sourceEn: 'Gajanan Dhyana',
      sourceHi: 'गजानन ध्यान',
      verdict: 'Mixed / Effort',
      meaningEn: 'Steady effort and structured planning will convert mixed circumstances into steady gain.',
      meaningHi: 'नियमित श्रम व सुव्यवस्थित योजना से मध्यम स्थिति भी लाभ में बदलेगी।',
    },
    {
      id: 3,
      chaupai: 'एकदन्ताय विद्महे वक्रतुण्डाय धीमहि। तन्नो दन्ती प्रचोदयात्॥',
      sourceEn: 'Ganesh Gayatri',
      sourceHi: 'गणेश गायत्री',
      verdict: 'Auspicious',
      meaningEn: 'Intellectual clarity and sharp focus guide the right choice cleanly.',
      meaningHi: 'बौद्धिक स्पष्टता व एकाग्रता से सही निर्णय प्राप्त होगा।',
    },
    {
      id: 4,
      chaupai: 'ॐ गं गणपतये नमः — धैर्य और विवेक से प्रतीक्षा करें।',
      sourceEn: 'Ganesh Mantra Sadhana',
      sourceHi: 'गणेश मंत्र साधना',
      verdict: 'Wait / Patience',
      meaningEn: 'Pause briefly before financial risk; seek blessing and wait for a clearer weekday/muhurta.',
      meaningHi: 'आर्थिक जोखिम से थोड़ा रुकें और शुभ मुहूर्त में कदम उठाएँ।',
    },
  ];
  return outcomes[(Math.max(1, slot1to12) - 1) % outcomes.length];
}

export function computeChartHealingReport(chart: ChartData): HealingReport {
  const byRatio = [...chart.shadbala].sort((a, b) => a.ratio - b.ratio);
  const weakestPlanet = (byRatio[0]?.planet ?? 'Moon') as SevenPlanetId;
  const num = computeNumerologyReport(
    chart.input.name,
    chart.input.date,
    chart.input.gender || 'other'
  );

  // Determine dominant Ayurvedic Tridosha from Lagna element & Sun/Mars/Moon/Saturn balance
  const ascElem = chart.ascendant.signIndex % 4; // 0 Fire, 1 Earth, 2 Air, 3 Water
  let doshaDominantEn = 'Pitta (Fire & Transformation)';
  let doshaDominantHi = 'पित्त प्रधान (अग्नि व ऊर्जा)';
  if (ascElem === 2) {
    doshaDominantEn = 'Vata (Air & Nervous Velocity)';
    doshaDominantHi = 'वात प्रधान (वायु व मानसिक वेग)';
  } else if (ascElem === 1 || ascElem === 3) {
    doshaDominantEn = 'Kapha (Water/Earth & Stability)';
    doshaDominantHi = 'कफ प्रधान (जल/पृथ्वी व स्थायित्व)';
  }

  const planetRemedies: Record<
    SevenPlanetId,
    { colorEn: string; colorHi: string; crystalEn: string; crystalHi: string; marmaEn: string; marmaHi: string; aromaEn: string; aromaHi: string }
  > = {
    Sun: {
      colorEn: 'Sunrise Saffron, Warm Gold & Copper accents',
      colorHi: 'प्रभात केसरिया, सुनहरा व ताम्र वर्ण',
      crystalEn: 'Sunstone, Citrine or Garnet over Solar Plexus',
      crystalHi: 'सनस्टोन या सुनैला (मणिपुर चक्र पर)',
      marmaEn: 'Adhipati (Crown) & Sthapani (Third Eye) light stimulation',
      marmaHi: 'अधिपति (शीर्ष) व स्थपनी (भ्रूमध्य) मर्म स्पर्श',
      aromaEn: 'Frankincense, Cinnamon & Saffron',
      aromaHi: 'लोबान, केसर व दालचीनी सुगंध',
    },
    Moon: {
      colorEn: 'Cool Pearl White, Cream & Silver tones',
      colorHi: 'मोती श्वेत, क्रीम व रजत वर्ण',
      crystalEn: 'Rainbow Moonstone or Pearl for calm sleep',
      crystalHi: 'मूनस्टोन (चंद्रमणि) शांति व निद्रा हेतु',
      marmaEn: 'Hridaya (Heart) & Talahridaya (Palm Center) soothing press',
      marmaHi: 'हृदय एवं तलहृदय (हथेली मध्य) मर्म बिंदु',
      aromaEn: 'White Jasmine, Sandalwood & Rose water',
      aromaHi: 'मोगरा, श्वेत चंदन व गुलाब सुगंध',
    },
    Mars: {
      colorEn: 'Coral Red & Terracotta balanced with Mint Green',
      colorHi: 'हल्का मूंगा लाल एवं संतुलित हरा रंग',
      crystalEn: 'Red Jasper or Carnelian (grounding stamina)',
      crystalHi: 'रेड जैस्पर या कार्नेलियन (ऊर्जा संतुलन)',
      marmaEn: 'Nabhi (Navel) & Kurcha (Wrist/Ankle) vitality points',
      marmaHi: 'नाभि व कूर्च (कलाई-टखना) मर्म बिंदु',
      aromaEn: 'Vetiver (Khus) & Cedarwood to cool excess heat',
      aromaHi: 'खस (उशीर) व देवदार उष्णता शमन हेतु',
    },
    Mercury: {
      colorEn: 'Fresh Leaf Emerald Green & Pastel Mint',
      colorHi: 'हरा (पन्ना जैसा) एवं हल्का पुदीना रंग',
      crystalEn: 'Green Aventurine or Fluorite for mental focus',
      crystalHi: 'ग्रीन एवेंचुरिन या फ्लोराइट एकाग्रता हेतु',
      marmaEn: 'Kshipra (Thumb-Index web / LI-4) for headache & focus',
      marmaHi: 'क्षिप्र मर्म (अंगूठे-तर्जनी संधि) बुद्धि व सिरदर्द हेतु',
      aromaEn: 'Peppermint, Tulsi & Lemongrass',
      aromaHi: 'तुलसी, पुदीना व लेमनग्रास',
    },
    Jupiter: {
      colorEn: 'Sacred Turmeric Yellow & Saffron Amber',
      colorHi: 'हल्दी पीला एवं शुद्ध केसरिया वर्ण',
      crystalEn: 'Yellow Citrine or Pyrite for wisdom & abundance',
      crystalHi: 'सिट्रीन या सुनहला स्फटिक',
      marmaEn: 'Indrabasti & Anahata chest breathing expansion',
      marmaHi: 'इन्द्रबस्ति व अनाहत (वक्ष) श्वास केंद्र',
      aromaEn: 'Saffron, Lotus & Temple Sandalwood',
      aromaHi: 'कमल, चंदन व केसर सुगंध',
    },
    Venus: {
      colorEn: 'Luminous Ivory White, Soft Rose & Light Blue',
      colorHi: 'श्वेत, हल्का गुलाबी व आसमानी वर्ण',
      crystalEn: 'Rose Quartz & Clear Quartz for relationship warmth',
      crystalHi: 'रोज़ क्वार्ट्ज़ (सद्भाव व सौंदर्य हेतु)',
      marmaEn: 'Talahridaya (Palms/Soles) & Throat Vishuddha relaxation',
      marmaHi: 'तलहृदय एवं विशुद्धि (कंठ) मर्म शांति',
      aromaEn: 'Rose Otto, Vanilla & Cardamom',
      aromaHi: 'गुलाब, इलायची व मधुर चंदन',
    },
    Saturn: {
      colorEn: 'Calm Indigo, Slate Blue & Earthy Grey',
      colorHi: 'नीला, इंडिगो एवं संतुलित स्लेटी वर्ण',
      crystalEn: 'Amethyst & Black Tourmaline (nerve & aura shield)',
      crystalHi: 'जमुनिया (एमेथिस्ट) या ब्लैक टूमलाइन',
      marmaEn: 'Pada-Kshipra & Janu (Knee) warm oil gentle massage',
      marmaHi: 'पाद-क्षिप्र व जानु (घुटने) का अभ्यंग मर्म',
      aromaEn: 'Camphor, Lavender & Sesame oil Abhyanga',
      aromaHi: 'कपूर, लैवेंडर व तिल तैल मालिश',
    },
  };

  const pr = planetRemedies[weakestPlanet];
  const items: HealingModalityItem[] = [
    {
      id: 'ayurveda',
      titleEn: 'Ayurveda & Prakruti Diet',
      titleHi: 'आयुर्वेद एवं प्रकृति आहार',
      focusEn: doshaDominantEn,
      focusHi: doshaDominantHi,
      prescriptionEn: ascElem === 2 ? 'Warm cooked meals, ghee, soaking routines & regular sleep calm Vata.' : ascElem === 0 ? 'Cooling cucumber, coriander water, sweet fruits & avoiding late-night spice calm Pitta.' : 'Light warm spiced meals, brisk morning walk & dry ginger tea invigorate Kapha.',
      prescriptionHi: ascElem === 2 ? 'ताजा गरम भोजन, गाय का घी व नियमित निद्रा वात शांत करती है।' : ascElem === 0 ? 'धनिया जल, मीठे फल व रात में तीखे भोजन से परहेज पित्त संतुलित करता है।' : 'हल्का गुनगुना भोजन, सुबह तेज़ सैर व अदरक-तुलसी कफ संतुलित रखते हैं।',
    },
    {
      id: 'yoga',
      titleEn: 'Yoga & Pranayama',
      titleHi: 'योग व प्राणायाम चिकित्सा',
      focusEn: `Support ${weakestPlanet} Vitality`,
      focusHi: `${weakestPlanet} बल वर्धन`,
      prescriptionEn: 'Daily 12 rounds Nadi Shodhana (alternate-nostril breathing) + Bhramari before breakfast; Surya Namaskar for Sun/Mars balance.',
      prescriptionHi: 'प्रातः 12 चक्र नाड़ी शोधन प्राणायाम, भ्रामरी व क्षमतानुसार सूर्य नमस्कार करें।',
    },
    {
      id: 'meditation',
      titleEn: 'Meditation & Dhyana',
      titleHi: 'ध्यान एवं मानसिक शांति',
      focusEn: `Moon in House ${chart.planets.find((p) => p.id === 'Moon')!.rasiHouseNumber}`,
      focusHi: `भाव ${chart.planets.find((p) => p.id === 'Moon')!.rasiHouseNumber} में चंद्र ध्यान`,
      prescriptionEn: '15-minute slow breath awareness on the Ajna (Third Eye) point at dusk stabilizes mood & sharpens intuition.',
      prescriptionHi: 'संध्या समय 15 मिनट आज्ञा चक्र पर श्वास-ध्यान करने से मन स्थिर व अंतर्ज्ञान प्रखर होता है।',
    },
    {
      id: 'color',
      titleEn: 'Vedic Color Therapy',
      titleHi: 'सूर्य-रश्मि व रंग चिकित्सा',
      focusEn: pr.colorEn,
      focusHi: pr.colorHi,
      prescriptionEn: `Incorporate ${pr.colorEn} in daily attire or workspace curtains to harmonize ${weakestPlanet}'s rays.`,
      prescriptionHi: `दैनिक वस्त्र, रुमाल या कार्य-कक्ष में ${pr.colorHi} का उपयोग ${weakestPlanet} की ऊर्जा संतुलित करता है।`,
    },
    {
      id: 'crystal',
      titleEn: 'Crystal & Uparatna Healing',
      titleHi: 'क्रिस्टल व उपरत्न चिकित्सा',
      focusEn: pr.crystalEn,
      focusHi: pr.crystalHi,
      prescriptionEn: 'Keep cleansed crystal on work desk or wear after washing in clean water & chanting planet mantra.',
      prescriptionHi: 'स्वच्छ जल से शुद्ध कर अध्ययन/कार्य मेज़ पर रखें या मंत्र स्मरण के साथ धारण करें।',
    },
    {
      id: 'acupressure',
      titleEn: 'Acupressure (Marma Vigyan)',
      titleHi: 'एक्यूप्रेशर व मर्म बिंदु',
      focusEn: pr.marmaEn,
      focusHi: pr.marmaHi,
      prescriptionEn: `Gentle circular pressure for 60 seconds twice daily relieves stress along ${weakestPlanet}-ruled channels.`,
      prescriptionHi: 'प्रतिदिन 60 सेकंड हल्का गोलाकार दबाव देने से नाड़ी-प्रवाह व तनाव में राहत मिलती है।',
    },
    {
      id: 'reiki',
      titleEn: 'Reiki & 7-Chakra Alignment',
      titleHi: 'रेकी व सप्त-चक्र संतुलन',
      focusEn: `Chakra Focus for ${weakestPlanet}`,
      focusHi: `${weakestPlanet} चक्र संतुलन`,
      prescriptionEn: 'Place warm palms softly over Heart (Anahata) & Solar Plexus for 5 minutes visualizing calm golden light.',
      prescriptionHi: 'अनाहत (हृदय) व मणिपुर चक्र पर शांत सुनहरे प्रकाश का ध्यान करते हुए ऊर्जा प्रवाहित करें।',
    },
    {
      id: 'fengshui',
      titleEn: `Feng Shui (Kua #${num.kuaNumber})`,
      titleHi: `फेंगशुई (कुआ अंक #${num.kuaNumber})`,
      focusEn: num.kuaDirectionsEn,
      focusHi: num.kuaDirectionsHi,
      prescriptionEn: 'Face your Sheng Chi (Success) direction when working or studying and keep the North-East clutter-free.',
      prescriptionHi: 'कार्य व अध्ययन करते समय अपनी शुभ दिशा की ओर मुख रखें व ईशान कोण स्वच्छ रखें।',
    },
    {
      id: 'aromatherapy',
      titleEn: 'Vedic Aromatherapy',
      titleHi: 'सुगंध एवं हर्बल चिकित्सा',
      focusEn: pr.aromaEn,
      focusHi: pr.aromaHi,
      prescriptionEn: `Diffuse natural essential oils of ${pr.aromaEn} in the evening to unwind mental fatigue.`,
      prescriptionHi: `सायं समय ${pr.aromaHi} का प्राकृतिक प्रसारण मानसिक थकान दूर करता है।`,
    },
  ];

  return {
    doshaDominantEn,
    doshaDominantHi,
    kuaNumber: num.kuaNumber,
    weakestPlanet,
    items,
  };
}

export function computeSamudrikaPalmMounts(chart: ChartData): PalmMountStatus[] {
  const defs: Array<{
    planet: SevenPlanetId;
    mountEn: string;
    mountHi: string;
    locationEn: string;
    locationHi: string;
  }> = [
    { planet: 'Jupiter', mountEn: 'Mount of Jupiter (Guru Parvat)', mountHi: 'गुरु पर्वत', locationEn: 'Base of Index Finger', locationHi: 'तर्जनी उंगली के नीचे' },
    { planet: 'Saturn', mountEn: 'Mount of Saturn (Shani Parvat)', mountHi: 'शनि पर्वत', locationEn: 'Base of Middle Finger', locationHi: 'मध्यमा उंगली के नीचे' },
    { planet: 'Sun', mountEn: 'Mount of Sun (Surya Parvat)', mountHi: 'सूर्य पर्वत', locationEn: 'Base of Ring Finger', locationHi: 'अनामिका उंगली के नीचे' },
    { planet: 'Mercury', mountEn: 'Mount of Mercury (Budh Parvat)', mountHi: 'बुध पर्वत', locationEn: 'Base of Little Finger', locationHi: 'कनिष्ठा उंगली के नीचे' },
    { planet: 'Mars', mountEn: 'Mounts of Mars (Mangal Kshetra)', mountHi: 'मंगल क्षेत्र', locationEn: 'Inner & Outer Palm Edges', locationHi: 'हथेली का ऊपरी-निचला किनारा' },
    { planet: 'Venus', mountEn: 'Mount of Venus (Shukra Parvat)', mountHi: 'शुक्र पर्वत', locationEn: 'Inner Ball of Thumb', locationHi: 'अंगूठे के नीचे का भाग' },
    { planet: 'Moon', mountEn: 'Mount of Moon (Chandra Parvat)', mountHi: 'चंद्र पर्वत', locationEn: 'Lower Outer Edge above Wrist', locationHi: 'कनिष्ठा ओर कलाई के ऊपर' },
  ];

  const isLocked = evaluateParamayusStatus(chart).exceeded;

  return defs.map((d) => {
    const sh = chart.shadbala.find((s) => s.planet === d.planet);
    const ratio = isLocked ? 0 : sh?.ratio ?? 1;
    const isStrong = ratio >= 1.0;
    return {
      ...d,
      strengthRatio: ratio,
      readingEn: isLocked
        ? 'Paramayus limit exceeded (>120y).'
        : isStrong
          ? `Prominent ${d.planet} vitality (${ratio.toFixed(2)}× Shadbala) correlates with a well-developed, clear mount and balanced lines.`
          : `Moderate ${d.planet} resonance (${ratio.toFixed(2)}×) — benefit from strengthening finger-mount acupressure & matching remedies.`,
      readingHi: isLocked
        ? '120 वर्ष सीमा पूर्ण।'
        : isStrong
          ? `${d.planet} का उच्च षड्बल (${ratio.toFixed(2)}×) सुविकसित पर्वत एवं निर्दोष रेखाओं का संकेत देता है।`
          : `${d.planet} मध्यम बली (${ratio.toFixed(2)}×) — इस पर्वत की ऊर्जा व मंत्र-साधना बढ़ाने से शुभ लाभ मिलता है।`,
    };
  });
}

export const SACRED_PRAYERS_LIB: SacredPrayerItem[] = [
  {
    id: 'm-sun',
    category: 'Mantra',
    planetOrDeity: 'Sun (सूर्य)',
    titleEn: 'Surya Beej & Gayatri Mantra',
    titleHi: 'सूर्य बीज एवं गायत्री मंत्र',
    sanskritOrHindiText: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः॥\nॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥',
    meaningEn: 'Chant 108 times facing East at sunrise on Sundays to uplift vitality, father relations, and leadership confidence.',
    meaningHi: 'रविवार प्रातः सूर्योदय के समय पूर्व मुख होकर 108 जप करने से स्वास्थ्य, तेज, आत्मविश्वास व पद-प्रतिष्ठा बढ़ती है।',
  },
  {
    id: 'm-moon',
    category: 'Mantra',
    planetOrDeity: 'Moon (चंद्र)',
    titleEn: 'Chandra Beej & Someshwara Mantra',
    titleHi: 'चंद्र शांति बीज मंत्र',
    sanskritOrHindiText: 'ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः॥\nॐ नमः शिवाय॥',
    meaningEn: 'Chant gently on Mondays/Full Moon evenings to calm anxiety, nurture sleep, and harmonize emotions.',
    meaningHi: 'सोमवार या पूर्णिमा को जप करने से मन शांत, निद्रा मधुर और माता एवं परिवार सुख में वृद्धि होती है।',
  },
  {
    id: 'm-mars',
    category: 'Mantra',
    planetOrDeity: 'Mars (मंगल)',
    titleEn: 'Mangal & Sankatmochan Mantra',
    titleHi: 'मंगल एवं हनुमान मंत्र',
    sanskritOrHindiText: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः॥\nॐ हं हनुमते नमः॥',
    meaningEn: 'Balances Kuja Dosha, impatience, and property/debt hurdles on Tuesdays.',
    meaningHi: 'मंगलवार को जप करने से मांगलिक दोष, ऋण व भूमि विवाद शांत होते हैं।',
  },
  {
    id: 'm-jup',
    category: 'Mantra',
    planetOrDeity: 'Jupiter (बृहस्पति)',
    titleEn: 'Guru Beej & Vishnu Mantra',
    titleHi: 'गुरु बृहस्पति मंत्र',
    sanskritOrHindiText: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः॥\nॐ नमो भगवते वासुदेवाय॥',
    meaningEn: 'Enhances wisdom, marriage blessings, children, and financial ethics on Thursdays.',
    meaningHi: 'गुरुवार को जप करने से विद्या, संतान, विवाह व धन में शुभ वृद्धि होती है।',
  },
  {
    id: 'm-sat',
    category: 'Mantra',
    planetOrDeity: 'Saturn / Rahu / Ketu',
    titleEn: 'Shani, Rahu & Ketu Peace Mantras',
    titleHi: 'शनि, राहु व केतु शांति मंत्र',
    sanskritOrHindiText: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः॥\nॐ भ्रां भ्रीं भ्रौं सः राहवे नमः॥\nॐ स्रां स्रीं स्रौं सः केतवे नमः॥',
    meaningEn: 'Recite Saturday evenings to harmonize Sade Sati, Dhaiyya, and nodal illusions cleanly.',
    meaningHi: 'शनिवार संध्या को जप करने से साढ़ेसाती, ढैय्या एवं राहु-केतु बाधाएँ शांत होती हैं।',
  },
  {
    id: 'c-hanuman',
    category: 'Chalisa',
    planetOrDeity: 'Shri Hanuman',
    titleEn: 'Shri Hanuman Chalisa — Dhyana & Siddha Verses',
    titleHi: 'श्री हनुमान चालीसा (दोहे व प्रमुख चौपाइयाँ)',
    sanskritOrHindiText: 'श्रीगुरु चरन सरोज रज, निज मनु मुकुरु सुधारि।\nबरनऊँ रघुबर बिमल जसु, जो दायकु फल चारि॥\nबुद्धिहीन तनु जानिके, सुमिरौं पवन-कुमार।\nबल बुद्धि बिद्या देहु मोहिं, हरहु कलेस बिकार॥\n...\nसंकट तें हनुमान छुड़ावै। मन क्रम बचन ध्यान जो लावै॥\nअंतकाल रघुबर पुर जाई। जहाँ जन्म हरि-भक्त कहाई॥',
    meaningEn: 'Recite Tuesdays/Saturdays for courage, relief from Mars/Saturn affliction, and clear protection.',
    meaningHi: 'मंगलवार व शनिवार के पाठ से भय, संकट, शनि-मंगल पीड़ा से रक्षा व अपार बल-बुद्धि मिलती है।',
  },
  {
    id: 'c-ganesh',
    category: 'Chalisa',
    planetOrDeity: 'Shri Ganesha',
    titleEn: 'Shri Ganesh Chalisa Opening & Phalashruti',
    titleHi: 'श्री गणेश चालीसा (प्रमुख पाठ)',
    sanskritOrHindiText: 'जय गणपति सदगुण सदन, कविवर बदन कृपाल।\nविघ्न हरण मंगल करण, जय जय गिरिजालाल॥\nजय जय जय गणपति गणराजू। मंगल भरण करण शुभ काजू॥',
    meaningEn: 'Invoke before starting new studies, travel, or commercial ventures (especially Mercury/Ketu periods).',
    meaningHi: 'किसी भी नए कार्य, अध्ययन या व्यापार के आरंभ से पूर्व पाठ विघ्नों का नाश करता है।',
  },
  {
    id: 'a-ganesh',
    category: 'Aarti',
    planetOrDeity: 'Ganesh / Lakshmi / Vishnu',
    titleEn: 'Nitya Aarti Sangrah (Ganesh · Jagdish · Lakshmi)',
    titleHi: 'नित्य आरती संग्रह (गणेश, जगदीश एवं लक्ष्मी आरती)',
    sanskritOrHindiText: 'जय गणेश जय गणेश जय गणेश देवा। माता जाकी पार्वती पिता महादेवा॥\nॐ जय जगदीश हरे, स्वामी जय जगदीश हरे। भक्त जनों के संकट, क्षण में दूर करे॥\nॐ जय लक्ष्मी माता, मैया जय लक्ष्मी माता। तुमको निशदिन सेवत, हर विष्णु विधाता॥',
    meaningEn: 'Traditional household morning/evening prayer fostering domestic harmony, gratitude, and prosperity.',
    meaningHi: 'प्रातः-सायं परिवार सहित आरती से घर में शांति, सौहार्द और श्री-समृद्धि का वास होता है।',
  },
  {
    id: 'd-karma',
    category: 'Dharma',
    planetOrDeity: 'Sanatana Dharma-Karma',
    titleEn: 'Pancha Mahayajna & Planetary Dharma Guide',
    titleHi: 'पंच महायज्ञ व ग्रह अनुकूल धर्म-कर्म नियम',
    sanskritOrHindiText: 'सत्यं ब्रूयात् प्रियं ब्रूयात् (सत्य व मधुर वाणी)\nपरोपकाराय पुण्याय पापाय परपीडनम्॥',
    meaningEn: 'Classical Jyotish treats ethical action as the highest Upaya: honor parents (Sun/Moon), speak truthfully (Mercury), care for elders & workers (Saturn), feed animals/birds (Rahu/Ketu), and teach knowledge cleanly (Jupiter).',
    meaningHi: 'ज्योतिष में सबसे बड़ा उपाय सदाचार है — माता-पिता सेवा (सूर्य-चंद्र), सत्य वाणी (बुध), श्रमिक व वृद्ध सहायता (शनि), पक्षी-पशु सेवा (राहु-केतु) एवं विद्या दान (गुरु)।',
  },
];
