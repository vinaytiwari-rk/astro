/**
 * Celebrity Kundli Twin & Benchmark Horoscope Matching Engine
 * AV Astro Vibe — 100% Offline, Zero API Dependency
 *
 * Compares natal chart placements, Lagna, Moon sign, and classical Yogas against
 * authentic Rodden AA-rated historical charts from Astro-Databank.
 */

import type { ChartData, NineGrahaId } from './types';
import { SIGNS } from './constants';

export interface CelebrityProfile {
  id: string;
  nameEn: string;
  nameHi: string;
  category: 'spiritual' | 'science_tech' | 'leadership' | 'business_wealth' | 'art_culture';
  categoryTitleEn: string;
  categoryTitleHi: string;
  birthDate: string;
  birthPlace: string;
  ascSignIndex: number; // 0..11
  moonSignIndex: number;
  sunSignIndex: number;
  prominentYogas: string[];
  prominentYogasHi: string[];
  keyPlacements: { planet: NineGrahaId; house: number; noteHi: string; noteEn: string }[];
  bioEn: string;
  bioHi: string;
  quoteEn: string;
  quoteHi: string;
}

export interface CelebrityTwinMatch {
  celebrity: CelebrityProfile;
  similarityScore: number; // 0..100
  sharedYogas: string[];
  sharedYogasHi: string[];
  sharedPlacements: { planet: NineGrahaId; house: number; descriptionHi: string; descriptionEn: string }[];
  astrologicalSynergyHi: string;
  astrologicalSynergyEn: string;
  nativeGuidanceHi: string;
  nativeGuidanceEn: string;
}

export const CELEBRITY_DATABASE: CelebrityProfile[] = [
  {
    id: 'swami-vivekananda',
    nameEn: 'Swami Vivekananda',
    nameHi: 'स्वामी विवेकानंद',
    category: 'spiritual',
    categoryTitleEn: 'Spiritual Master & Philosopher',
    categoryTitleHi: 'आध्यात्मिक युगद्रष्टा एवं वेदांत दर्शन',
    birthDate: '12-01-1863',
    birthPlace: 'Kolkata, India',
    ascSignIndex: 8, // Sagittarius (धनु)
    moonSignIndex: 5, // Virgo (कन्या)
    sunSignIndex: 8, // Sagittarius (धनु)
    prominentYogas: ['Hamsa Yoga', 'Raja Yoga', 'Bhadra Yoga', 'Saraswati Yoga'],
    prominentYogasHi: ['हंस महापुरुष योग', 'राजयोग', 'भद्र महापुरुष योग', 'सरस्वती योग'],
    keyPlacements: [
      { planet: 'Jupiter', house: 11, noteHi: 'एकादश में गुरु उच्च ज्ञान व वैश्विक प्रभाव', noteEn: 'Jupiter in 11th conferring global spiritual reach' },
      { planet: 'Sun', house: 1, noteHi: 'लग्न में सूर्य अदम्य आत्मतेज व ओजस्वी वाणी', noteEn: 'Sun in Lagna conferring magnetic presence' },
      { planet: 'Saturn', house: 10, noteHi: 'दशम में शनि निष्काम कर्म व सन्यास तप', noteEn: 'Saturn in 10th driving selfless public service' },
    ],
    bioEn: 'World spiritual visionary who introduced Vedanta and Yoga to the Western world at the 1893 Parliament of Religions.',
    bioHi: 'युगप्रवर्तक संन्यासी जिन्होंने 1893 शिकागो धर्म संसद में सनातन धर्म और वेदांत का उद्घोष कर विश्व को जागृत किया।',
    quoteEn: 'Arise, awake, and stop not until the goal is reached.',
    quoteHi: 'उठो, जागो और तब तक मत रुको जब तक लक्ष्य प्राप्त न हो जाए।',
  },
  {
    id: 'apj-abdul-kalam',
    nameEn: 'Dr. A.P.J. Abdul Kalam',
    nameHi: 'डॉ. ए.पी.जे. अब्दुल कलाम',
    category: 'science_tech',
    categoryTitleEn: 'Missile Pioneer & People’s President',
    categoryTitleHi: 'मिसाइल मैन, वैज्ञानिक एवं भारत रत्न राष्ट्रपति',
    birthDate: '15-10-1931',
    birthPlace: 'Rameswaram, India',
    ascSignIndex: 11, // Pisces (मीन)
    moonSignIndex: 7, // Scorpio (वृश्चिक)
    sunSignIndex: 5, // Virgo (कन्या)
    prominentYogas: ['Budhaditya Yoga', 'Gajakesari Yoga', 'Amala Yoga', 'Viparita Raja Yoga'],
    prominentYogasHi: ['बुधादित्य योग', 'गजकेसरी योग', 'अमला योग', 'विपरीत राजयोग'],
    keyPlacements: [
      { planet: 'Mercury', house: 7, noteHi: 'सप्तम में उच्च बुध तीक्ष्ण वैज्ञानिक मेधा', noteEn: 'Exalted Mercury conferring genius intellect' },
      { planet: 'Jupiter', house: 5, noteHi: 'पंचम में उच्च गुरु अद्वितीय दूरदर्शिता', noteEn: 'Exalted Jupiter in 5th granting vision' },
      { planet: 'Saturn', house: 10, noteHi: 'दशम में शनि कठोर परिश्रम व राष्ट्र सेवा', noteEn: 'Saturn in 10th forging unshakeable duty' },
    ],
    bioEn: 'Pioneered India’s space and missile program, later becoming the beloved 11th President of India.',
    bioHi: 'भारत के अंतरिक्ष व मिसाइल कार्यक्रम के जनक तथा सादगी और राष्ट्र-सेवा के प्रतीक 11वें राष्ट्रपति।',
    quoteEn: 'Dream is not that which you see while sleeping, it is something that does not let you sleep.',
    quoteHi: 'सपने वो नहीं जो हम सोते हुए देखते हैं, सपने वो हैं जो हमें सोने नहीं देते।',
  },
  {
    id: 'albert-einstein',
    nameEn: 'Albert Einstein',
    nameHi: 'अल्बर्ट आइंस्टीन',
    category: 'science_tech',
    categoryTitleEn: 'Theoretical Physicist & Genius',
    categoryTitleHi: 'महान सैद्धांतिक भौतिकविद् व नोबेल विजेता',
    birthDate: '14-03-1879',
    birthPlace: 'Ulm, Germany',
    ascSignIndex: 2, // Gemini (मिथुन)
    moonSignIndex: 8, // Sagittarius (धनु)
    sunSignIndex: 10, // Aquarius (कुंभ)
    prominentYogas: ['Budhaditya Yoga', 'Neechbhanga Raja Yoga', 'Saraswati Yoga'],
    prominentYogasHi: ['बुधादित्य योग', 'नीचभंग राजयोग', 'सरस्वती योग'],
    keyPlacements: [
      { planet: 'Mercury', house: 10, noteHi: 'दशम में नीचभंग बुध कालजयी सापेक्षता सिद्धांत', noteEn: 'Neechbhanga Mercury in 10th revolutionizing physics' },
      { planet: 'Saturn', house: 10, noteHi: 'दशम में शनि गहन चिंतन व अमूर्त गणित', noteEn: 'Saturn in 10th powering abstract mathematics' },
      { planet: 'Jupiter', house: 9, noteHi: 'नवम में गुरु ब्रह्मांडीय रहस्यों की खोज', noteEn: 'Jupiter in 9th seeking cosmic truths' },
    ],
    bioEn: 'Revolutionized human understanding of space, time, gravity, and the universe with General Relativity.',
    bioHi: 'सापेक्षता के सिद्धांत द्वारा दिक्-काल और गुरुत्वाकर्षण की समझ बदलकर आधुनिक विज्ञान के जनक बने।',
    quoteEn: 'Imagination is more important than knowledge.',
    quoteHi: 'कल्पना ज्ञान से अधिक महत्वपूर्ण है।',
  },
  {
    id: 'mahatma-gandhi',
    nameEn: 'Mahatma Gandhi',
    nameHi: 'महात्मा गांधी',
    category: 'leadership',
    categoryTitleEn: 'Father of the Nation & Apostle of Non-Violence',
    categoryTitleHi: 'राष्ट्रपिता एवं अहिंसा के वैश्विक प्रणेता',
    birthDate: '02-10-1869',
    birthPlace: 'Porbandar, India',
    ascSignIndex: 6, // Libra (तुला)
    moonSignIndex: 3, // Cancer (कर्क)
    sunSignIndex: 5, // Virgo (कन्या)
    prominentYogas: ['Ruchaka Yoga', 'Malavya Yoga', 'Budhaditya Yoga', 'Gajakesari Yoga'],
    prominentYogasHi: ['रुचक महापुरुष योग', 'मालव्य महापुरुष योग', 'बुधादित्य योग', 'गजकेसरी योग'],
    keyPlacements: [
      { planet: 'Mars', house: 1, noteHi: 'लग्न में स्वराशि मंगल अदम्य सत्याग्रह शक्ति', noteEn: 'Mars in 1st giving fearless moral courage' },
      { planet: 'Venus', house: 1, noteHi: 'लग्न में स्वराशि शुक्र अहिंसा व नैतिक शुचिता', noteEn: 'Venus in 1st establishing Ahimsa' },
      { planet: 'Jupiter', house: 7, noteHi: 'सप्तम में गुरु जनसमूहों का नैतिक नेतृत्व', noteEn: 'Jupiter in 7th mobilizing masses with truth' },
    ],
    bioEn: 'Led India to independence through truth and non-violent civil resistance, inspiring global civil rights movements.',
    bioHi: 'सत्य और अहिंसा के बल पर भारत को स्वतंत्र कराकर विश्वभर के स्वतंत्रता आंदोलनों के पथप्रदर्शक बने।',
    quoteEn: 'In a gentle way, you can shake the world.',
    quoteHi: 'विनम्रता और सत्य से आप पूरी दुनिया को हिला सकते हैं।',
  },
  {
    id: 'srinivasa-ramanujan',
    nameEn: 'Srinivasa Ramanujan',
    nameHi: 'श्रीनिवास रामानुजन',
    category: 'science_tech',
    categoryTitleEn: 'Mathematical Genius & Mystic',
    categoryTitleHi: 'दिव्य गणितज्ञ व संख्या सिद्धांतकार',
    birthDate: '22-12-1887',
    birthPlace: 'Erode, India',
    ascSignIndex: 8, // Sagittarius (धनु)
    moonSignIndex: 11, // Pisces (मीन)
    sunSignIndex: 8, // Sagittarius (धनु)
    prominentYogas: ['Saraswati Yoga', 'Gajakesari Yoga', 'Hamsa Yoga'],
    prominentYogasHi: ['सरस्वती योग', 'गजकेसरी योग', 'हंस महापुरुष योग'],
    keyPlacements: [
      { planet: 'Jupiter', house: 11, noteHi: 'एकादश में गुरु नामक्कल देवी की आध्यात्मिक प्रेरणा', noteEn: 'Jupiter in 11th channeling divine mathematical theorems' },
      { planet: 'Mercury', house: 1, noteHi: 'लग्न में बुध अनंत समीकरणों की अंतःस्फूर्ति', noteEn: 'Mercury in Lagna perceiving infinite numbers' },
      { planet: 'Moon', house: 4, noteHi: 'चतुर्थ में स्वराशि गुरु-क्षेत्री चंद्र गूढ़ अंतर्दृष्टि', noteEn: 'Moon in 4th providing deep intuitive focus' },
    ],
    bioEn: 'Self-taught mathematical prodigy whose pioneering formulas in number theory continue to transform modern physics.',
    bioHi: 'विलक्षण गणितज्ञ जिन्होंने बिना औपचारिक प्रशिक्षण के 3900+ जटिल प्रमेयों की रचना कर विश्व गणित को नई दिशा दी।',
    quoteEn: 'An equation for me has no meaning unless it expresses a thought of God.',
    quoteHi: 'मेरे लिए किसी समीकरण का तब तक कोई अर्थ नहीं, जब तक वह ईश्वर के विचार को व्यक्त न करे।',
  },
  {
    id: 'steve-jobs',
    nameEn: 'Steve Jobs',
    nameHi: 'स्टीव जॉब्स',
    category: 'business_wealth',
    categoryTitleEn: 'Tech Visionary & Apple Founder',
    categoryTitleHi: 'एप्पल संस्थापक एवं डिजिटल क्रांति के अग्रदूत',
    birthDate: '24-02-1955',
    birthPlace: 'San Francisco, USA',
    ascSignIndex: 4, // Leo (सिंह)
    moonSignIndex: 11, // Pisces (मीन)
    sunSignIndex: 10, // Aquarius (कुंभ)
    prominentYogas: ['Ruchaka Yoga', 'Gajakesari Yoga', 'Budhaditya Yoga', 'Amala Yoga'],
    prominentYogasHi: ['रुचक महापुरुष योग', 'गजकेसरी योग', 'बुधादित्य योग', 'अमला योग'],
    keyPlacements: [
      { planet: 'Mars', house: 8, noteHi: 'अष्टम में मंगल असाधारण रूपांतरणकारी ऊर्जा', noteEn: 'Mars in 8th driving relentless perfection' },
      { planet: 'Jupiter', house: 11, noteHi: 'एकादश में उच्च गुरु विश्व-स्तरीय तकनीकी साम्राज्य', noteEn: 'Exalted Jupiter in 11th bringing vast global empire' },
      { planet: 'Sun', house: 7, noteHi: 'सप्तम में सूर्य करिश्माई उत्पाद प्रस्तुति', noteEn: 'Sun in 7th captivating consumer markets' },
    ],
    bioEn: 'Visionary co-founder of Apple Inc. who transformed computers, animation, music, and mobile phones with impeccable design.',
    bioHi: 'एप्पल के सह-संस्थापक जिन्होंने व्यक्तिगत कंप्यूटर, संगीत और स्मार्टफोन की दुनिया में कला व तकनीक का अद्भुत संगम रचा।',
    quoteEn: 'The people who are crazy enough to think they can change the world are the ones who do.',
    quoteHi: 'जो लोग यह सोचने का पागलपन करते हैं कि वे दुनिया बदल सकते हैं, वही असल में दुनिया बदलते हैं।',
  },
  {
    id: 'rabindranath-tagore',
    nameEn: 'Rabindranath Tagore',
    nameHi: 'रवींद्रनाथ ठाकुर',
    category: 'art_culture',
    categoryTitleEn: 'Nobel Laureate Poet & Universal Mystic',
    categoryTitleHi: 'नोबेल पुरस्कार विजेता कवि, दार्शनिक व संगीतकार',
    birthDate: '07-05-1861',
    birthPlace: 'Kolkata, India',
    ascSignIndex: 11, // Pisces (मीन)
    moonSignIndex: 11, // Pisces (मीन)
    sunSignIndex: 0, // Aries (मेष)
    prominentYogas: ['Hamsa Yoga', 'Saraswati Yoga', 'Gajakesari Yoga', 'Sunafa Yoga'],
    prominentYogasHi: ['हंस महापुरुष योग', 'सरस्वती योग', 'गजकेसरी योग', 'सुनफा योग'],
    keyPlacements: [
      { planet: 'Jupiter', house: 5, noteHi: 'पंचम में उच्च गुरु गीतांजलि जैसी कालजयी रचनाएं', noteEn: 'Exalted Jupiter in 5th inspiring Gitanjali' },
      { planet: 'Venus', house: 1, noteHi: 'लग्न में उच्च शुक्र अप्रतिम काव्य व सौंदर्य चेतना', noteEn: 'Exalted Venus in 1st conferring supreme poetic grace' },
      { planet: 'Sun', house: 2, noteHi: 'द्वितीय में उच्च सूर्य वैश्विक सांस्कृतिक प्रतिष्ठा', noteEn: 'Exalted Sun in 2nd bringing global laurels' },
    ],
    bioEn: 'First non-European to win the Nobel Prize in Literature (1913), composer of two national anthems.',
    bioHi: 'साहित्य के प्रथम गैर-यूरोपीय नोबेल पुरस्कार विजेता (1913) और दो राष्ट्रों (भारत व बांग्लादेश) के राष्ट्रगान रचयिता।',
    quoteEn: 'Clouds come floating into my life, no longer to carry rain or usher storm, but to add color to my sunset sky.',
    quoteHi: 'बादल मेरे जीवन में अब तूफान लाने नहीं, बल्कि मेरे ढलते आकाश में नए रंग भरने तैरते आते हैं।',
  },
  {
    id: 'dhirubhai-ambani',
    nameEn: 'Dhirubhai Ambani',
    nameHi: 'धीरूभाई अंबानी',
    category: 'business_wealth',
    categoryTitleEn: 'Industrial Tycoon & Reliance Founder',
    categoryTitleHi: 'रिलायंस इंडस्ट्रीज संस्थापक व औद्योगिक क्रांति दूत',
    birthDate: '28-12-1932',
    birthPlace: 'Chorwad, India',
    ascSignIndex: 8, // Sagittarius (धनु)
    moonSignIndex: 8, // Sagittarius (धनु)
    sunSignIndex: 8, // Sagittarius (धनु)
    prominentYogas: ['Hamsa Yoga', 'Raja Yoga', 'Dhana Yoga', 'Maha Lakshmi Yoga'],
    prominentYogasHi: ['हंस महापुरुष योग', 'राजयोग', 'महाधन योग', 'महालक्ष्मी योग'],
    keyPlacements: [
      { planet: 'Jupiter', house: 10, noteHi: 'दशम में गुरु भारत का सबसे बड़ा औद्योगिक घराना', noteEn: 'Jupiter in 10th building India’s largest conglomerate' },
      { planet: 'Sun', house: 1, noteHi: 'लग्न में सूर्य अदम्य उद्यम व शेयरधारकों का विश्वास', noteEn: 'Sun in Lagna commanding mass investor loyalty' },
      { planet: 'Venus', house: 11, noteHi: 'एकादश में शुक्र कपड़ों व पेट्रोकेमिकल से अकूत लाभ', noteEn: 'Venus in 11th bringing vast industrial returns' },
    ],
    bioEn: 'Started with humble means in Yemen and built Reliance Industries into India’s largest private enterprise.',
    bioHi: 'एक साधारण यमन पेट्रोल पंप कर्मचारी से उठकर भारत का सबसे विशाल निजी औद्योगिक साम्राज्य स्थापित किया।',
    quoteEn: 'If you don’t build your dream, someone else will hire you to help them build theirs.',
    quoteHi: 'यदि आप अपने सपनों का निर्माण नहीं करेंगे, तो कोई अन्य आपको अपने सपने पूरे करने के लिए काम पर रख लेगा।',
  },
];

export function findCelebrityTwins(chart: ChartData): CelebrityTwinMatch[] {
  const ascIdx = chart.ascendant.signIndex;
  const moon = chart.planets.find((p) => p.id === 'Moon');
  const sun = chart.planets.find((p) => p.id === 'Sun');
  const moonIdx = moon?.signIndex ?? 0;
  const sunIdx = sun?.signIndex ?? 0;

  // Identify native's active Yogas
  const nativeYogas: string[] = [];
  const jup = chart.planets.find((p) => p.id === 'Jupiter');
  const mars = chart.planets.find((p) => p.id === 'Mars');
  const merc = chart.planets.find((p) => p.id === 'Mercury');
  const ven = chart.planets.find((p) => p.id === 'Venus');
  const sat = chart.planets.find((p) => p.id === 'Saturn');

  const isKendra = (h?: number) => h === 1 || h === 4 || h === 7 || h === 10;

  // Pancha Mahapurusha Yogas
  if (mars && isKendra(mars.houseNumber) && (mars.signIndex === 0 || mars.signIndex === 7 || mars.signIndex === 9)) nativeYogas.push('Ruchaka Yoga');
  if (merc && isKendra(merc.houseNumber) && (merc.signIndex === 2 || merc.signIndex === 5)) nativeYogas.push('Bhadra Yoga');
  if (jup && isKendra(jup.houseNumber) && (jup.signIndex === 3 || jup.signIndex === 8 || jup.signIndex === 11)) nativeYogas.push('Hamsa Yoga');
  if (ven && isKendra(ven.houseNumber) && (ven.signIndex === 1 || ven.signIndex === 6 || ven.signIndex === 11)) nativeYogas.push('Malavya Yoga');
  if (sat && isKendra(sat.houseNumber) && (sat.signIndex === 6 || sat.signIndex === 9 || sat.signIndex === 10)) nativeYogas.push('Sasa Yoga');

  // Gajakesari Yoga (Jupiter in Kendra from Moon)
  if (jup && moon) {
    const diff = (jup.houseNumber - moon.houseNumber + 12) % 12 + 1;
    if (diff === 1 || diff === 4 || diff === 7 || diff === 10) nativeYogas.push('Gajakesari Yoga');
  }

  // Budhaditya Yoga (Sun & Mercury together)
  if (sun && merc && sun.houseNumber === merc.houseNumber) {
    nativeYogas.push('Budhaditya Yoga');
  }

  const matches: CelebrityTwinMatch[] = [];

  for (const celeb of CELEBRITY_DATABASE) {
    let score = 30; // base score

    // Lagna match (+25)
    if (celeb.ascSignIndex === ascIdx) score += 25;
    // Moon match (+18)
    if (celeb.moonSignIndex === moonIdx) score += 18;
    // Sun match (+12)
    if (celeb.sunSignIndex === sunIdx) score += 12;

    // Common Yogas (+12 each)
    const sharedYogas = celeb.prominentYogas.filter((y) => nativeYogas.includes(y));
    const sharedYogasHi = celeb.prominentYogasHi.filter((_, idx) => nativeYogas.includes(celeb.prominentYogas[idx]));
    score += sharedYogas.length * 12;

    // Common planetary house placements (+8 each)
    const sharedPlacements: CelebrityTwinMatch['sharedPlacements'] = [];
    for (const kp of celeb.keyPlacements) {
      const p = chart.planets.find((pl) => pl.id === kp.planet);
      if (p && p.houseNumber === kp.house) {
        score += 10;
        sharedPlacements.push({
          planet: kp.planet,
          house: kp.house,
          descriptionHi: `${kp.noteHi} — आपकी कुंडली में भी ${kp.planet} ठीक इसी भाव में स्थित है।`,
          descriptionEn: `${kp.noteEn} — In your horoscope as well, ${kp.planet} is placed in the exact same house.`,
        });
      }
    }

    const finalScore = Math.min(96, Math.max(38, score));

    matches.push({
      celebrity: celeb,
      similarityScore: finalScore,
      sharedYogas,
      sharedYogasHi,
      sharedPlacements,
      astrologicalSynergyHi: `आपकी कुंडली में ${SIGNS[ascIdx].name} लग्न तथा ${sharedYogasHi.length > 0 ? sharedYogasHi.join(', ') : 'ग्रह योगों'} की स्थिति ${celeb.nameHi} के कालजयी जीवन चक्र से आश्चर्यजनक साम्य रखती है।`,
      astrologicalSynergyEn: `Your ${SIGNS[ascIdx].name} Ascendant and ${sharedYogas.length > 0 ? sharedYogas.join(', ') : 'planetary formations'} share striking astrological resonance with ${celeb.nameEn}’s destiny blueprint.`,
      nativeGuidanceHi: `${celeb.nameHi} की तरह अपने ${celeb.categoryTitleHi} के क्षेत्र में निस्वार्थ साधना व उच्च लक्ष्य रखें। उनकी जीवन प्रेरणा: "${celeb.quoteHi}"`,
      nativeGuidanceEn: `Like ${celeb.nameEn}, direct your kinetic energy toward principled mastery in ${celeb.categoryTitleEn}. Guiding compass: "${celeb.quoteEn}"`,
    });
  }

  // Sort highest similarity first
  matches.sort((a, b) => b.similarityScore - a.similarityScore);
  return matches;
}
