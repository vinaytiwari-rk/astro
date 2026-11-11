import * as Astronomy from 'astronomy-engine';
import { NAKSHATRAS, SIGNS } from './constants';
import { computeAyanamsaDeg, getTropicalPosition } from './ephemeris';
import { computeNameNumber } from './numerology';
import { getAllNakshatraSyllables, getNakshatraSyllable } from './avakahadaChalit';
import { evaluateParamayusStatus } from './predictions/paramayus';
import { normalizeDeg } from './time';
import type { ChartData, SevenPlanetId } from './types';

export type RashifalPeriod = 'daily' | 'tomorrow' | 'weekly' | 'weekly_love' | 'monthly' | 'yearly';

export interface RashiForecastItem {
  signIndex: number;
  isNatalMoon: boolean;
  score: number;
  moodEn: string;
  moodHi: string;
  dailyEn: string;
  dailyHi: string;
  tomorrowEn: string;
  tomorrowHi: string;
  weeklyEn: string;
  weeklyHi: string;
  weeklyLoveEn: string;
  weeklyLoveHi: string;
  monthlyEn: string;
  monthlyHi: string;
  yearlyEn: string;
  yearlyHi: string;
  loveEn: string;
  loveHi: string;
  careerEn: string;
  careerHi: string;
  healthEn: string;
  healthHi: string;
  luckyColorEn: string;
  luckyColorHi: string;
  luckyNumber: number;
}

export interface BabyNameEntry {
  name: string;
  gender: 'boy' | 'girl';
  nakshatraIndex: number;
  syllableEn: string;
  meaningEn: string;
  meaningHi: string;
  chaldeanNum: number;
}

export interface GemstoneRecommendation {
  roleEn: string;
  roleHi: string;
  planet: SevenPlanetId;
  stoneEn: string;
  stoneHi: string;
  metalEn: string;
  metalHi: string;
  fingerEn: string;
  fingerHi: string;
  dayEn: string;
  dayHi: string;
  weightRatti: string;
  reasonEn: string;
  reasonHi: string;
}

export interface RudrakshaRecommendation {
  mukhi: string;
  titleEn: string;
  titleHi: string;
  deityEn: string;
  deityHi: string;
  planet: string;
  benefitEn: string;
  benefitHi: string;
  mantra: string;
}

export interface GemstoneRudrakshaReport {
  lifeStone: GemstoneRecommendation;
  luckyStone: GemstoneRecommendation;
  beneficStone: GemstoneRecommendation;
  avoidStonesEn: string[];
  avoidStonesHi: string[];
  primaryRudraksha: RudrakshaRecommendation;
  secondaryRudraksha: RudrakshaRecommendation;
  doshaRudrakshaNoteEn: string;
  doshaRudrakshaNoteHi: string;
}

const RASHI_COLORS = [
  { en: 'Coral Red & Gold', hi: 'लाल एवं सुनहरा', num: 9 },
  { en: 'White & Emerald Green', hi: 'सफेद एवं हरा', num: 6 },
  { en: 'Green & Sky Blue', hi: 'हरा एवं हल्का नीला', num: 5 },
  { en: 'Pearl White & Silver', hi: 'मोती जैसा सफेद', num: 2 },
  { en: 'Saffron & Ruby Gold', hi: 'केसरिया एवं सुनहरा', num: 1 },
  { en: 'Mint Green & Cream', hi: 'हल्का हरा एवं क्रीम', num: 5 },
  { en: 'Diamond White & Pink', hi: 'श्वेत एवं गुलाबी', num: 6 },
  { en: 'Crimson & Maroon', hi: 'गहरा लाल', num: 9 },
  { en: 'Saffron Yellow', hi: 'पीला एवं केसरिया', num: 3 },
  { en: 'Royal Blue & Violet', hi: 'गहरा नीला', num: 8 },
  { en: 'Electric Blue & Grey', hi: 'नीला एवं आसमानी', num: 8 },
  { en: 'Mustard Yellow & Cream', hi: 'पीला एवं क्रीम', num: 3 },
];

export function computeRashifalReport(
  natalChart: ChartData,
  targetDate: string
): RashiForecastItem[] {
  if (evaluateParamayusStatus(natalChart, targetDate).exceeded) {
    return [];
  }
  const natalMoonSign = natalChart.planets.find((p) => p.id === 'Moon')!.signIndex;
  const ms = Date.parse(`${targetDate}T12:00:00Z`) || Date.now();
  const time = new Astronomy.AstroTime(new Date(ms));
  const ayan = computeAyanamsaDeg(time, natalChart.settings.ayanamsa);

  const signOf = (id: SevenPlanetId, offsetDays = 0) => {
    const tObj = offsetDays === 0 ? time : new Astronomy.AstroTime(new Date(ms + offsetDays * 86_400_000));
    const ay = offsetDays === 0 ? ayan : computeAyanamsaDeg(tObj, natalChart.settings.ayanamsa);
    const lon = normalizeDeg(getTropicalPosition(id, tObj, 'mean').lon - ay);
    return Math.floor(lon / 30) % 12;
  };

  const tMoon = signOf('Moon');
  const tTomorrowMoon = signOf('Moon', 1);
  const tSun = signOf('Sun');
  const tMars = signOf('Mars');
  const tMer = signOf('Mercury');
  const tJup = signOf('Jupiter');
  const tVen = signOf('Venus');
  const tSat = signOf('Saturn');

  const hDiff = (pSign: number, baseSign: number) => ((pSign - baseSign + 12) % 12) + 1;

  const yearStr = targetDate.slice(0, 4);

  return Array.from({ length: 12 }, (_, rIdx) => {
    const hMoon = hDiff(tMoon, rIdx);
    const hTomMoon = hDiff(tTomorrowMoon, rIdx);
    const hSun = hDiff(tSun, rIdx);
    const hJup = hDiff(tJup, rIdx);
    const hSat = hDiff(tSat, rIdx);
    const hVen = hDiff(tVen, rIdx);
    const hMer = hDiff(tMer, rIdx);
    const hMars = hDiff(tMars, rIdx);

    let score = 62;
    if ([1, 3, 6, 7, 10, 11].includes(hMoon)) score += 12;
    if ([4, 8, 12].includes(hMoon)) score -= 11;
    if ([2, 5, 7, 9, 11].includes(hJup)) score += 12;
    if ([3, 6, 11].includes(hSat)) score += 6;
    if ([1, 2, 8, 12].includes(hSat)) score -= 8;
    if ([3, 6, 10, 11].includes(hSun)) score += 5;
    score = Math.max(38, Math.min(95, score));

    const moodEn = score >= 78 ? 'Highly Auspicious' : score >= 62 ? 'Favorable' : 'Steady / Mindful';
    const moodHi = score >= 78 ? 'अत्यंत शुभ' : score >= 62 ? 'अनुकूल व प्रगतिशील' : 'संतुलित (सावधानी लाभकारी)';

    const moonToneEn =
      [1, 3, 6, 7, 10, 11].includes(hMoon)
        ? `Transit Moon in House ${hMoon} lifts clarity, productive conversations, and smooth execution today.`
        : `Transit Moon in House ${hMoon} favors quiet focus, avoiding hasty debates, and conserving energy today.`;
    const moonToneHi =
      [1, 3, 6, 7, 10, 11].includes(hMoon)
        ? `आज चंद्रमा आपकी राशि से ${hMoon}वें भाव में होने से मन प्रसन्न, कार्य सफल और संपर्क लाभकारी रहेंगे।`
        : `आज चंद्रमा ${hMoon}वें भाव में होने से शांति, संयम व सोच-समझकर निर्णय लेना लाभप्रद रहेगा।`;

    const sunMerEn = `Sun (H${hSun}) and Mercury (H${hMer}) guide weekly meetings, paperwork, and planning.`;
    const sunMerHi = `साप्ताहिक गोचर में सूर्य (${hSun}वें) और बुध (${hMer}वें) संवाद, कागजी कार्य व निर्णय क्षमता को गति दे रहे हैं।`;

    const monthEn = `Venus in H${hVen} & Mars in H${hMars} energize monthly relationship warmth, cashflow, and proactive initiative.`;
    const monthHi = `मासिक फल में शुक्र (${hVen}वें) व मंगल (${hMars}वें) से प्रेम/परिवार सुख, आर्थिक प्रवाह व कार्य ऊर्जा प्रभावित होगी।`;

    const yearEn = `In ${yearStr}, Jupiter in H${hJup} and Saturn in H${hSat} define major growth vs discipline pillars — ${[2, 5, 7, 9, 11].includes(hJup) ? 'strong Jupiterian expansion favors career, wisdom & finances.' : 'patient structured progress rewards steady consistency.'}`;
    const yearHi = `वर्ष ${yearStr} में बृहस्पति (${hJup}वें भाव) व शनि (${hSat}वें भाव) का गोचर मुख्य दिशा तय करेगा — ${[2, 5, 7, 9, 11].includes(hJup) ? 'गुरु का शुभ गोचर भाग्य, धन, शिक्षा व परिवार में विस्तार देगा।' : 'धैर्य, नियमबद्ध परिश्रम व बचत से स्थायी सफलता सुनिश्चित होगी।'}`;

    const tomorrowEn =
      [1, 3, 6, 7, 10, 11].includes(hTomMoon)
        ? `Tomorrow's Moon transits auspicious House ${hTomMoon} from your Rashi — excellent momentum for meetings, travel & joyful progress.`
        : `Tomorrow's Moon enters House ${hTomMoon} from your Rashi — keep schedule unhurried and double-check details calmly.`;
    const tomorrowHi =
      [1, 3, 6, 7, 10, 11].includes(hTomMoon)
        ? `कल चंद्रमा आपकी राशि से ${hTomMoon}वें शुभ भाव में गोचर करेगा — महत्वपूर्ण बैठक, यात्रा व लाभकारी अवसर मिलेंगे।`
        : `कल चंद्रमा ${hTomMoon}वें भाव में रहेगा — कार्यों में शांति व सावधानी बनाए रखना हितकर रहेगा।`;

    const weeklyLoveEn =
      [1, 2, 5, 7, 9, 11].includes(hVen)
        ? `Weekly Love & Relationships: Venus in H${hVen} enhances romantic warmth, family dinners, and heartfelt reconciliation.`
        : `Weekly Love & Relationships: Venus in H${hVen} & Mars in H${hMars} advise gentle communication and quality shared time.`;
    const weeklyLoveHi =
      [1, 2, 5, 7, 9, 11].includes(hVen)
        ? `साप्ताहिक प्रेम व दांपत्य: शुक्र (${hVen}वें भाव) प्रेम, पारिवारिक सौहार्द व मधुर संवाद को प्रबल बना रहे हैं।`
        : `साप्ताहिक प्रेम व दांपत्य: शुक्र (${hVen}वें) व मंगल (${hMars}वें) के प्रभाव से वाणी में मधुरता व संयम आवश्यक रहेगा।`;

    const c = RASHI_COLORS[rIdx];
    return {
      signIndex: rIdx,
      isNatalMoon: rIdx === natalMoonSign,
      score,
      moodEn,
      moodHi,
      dailyEn: `${moonToneEn} Lucky momentum comes from focused priority work.`,
      dailyHi: `${moonToneHi} आवश्यक कार्यों को प्राथमिकता देना लाभप्रद रहेगा।`,
      tomorrowEn,
      tomorrowHi,
      weeklyEn: `${sunMerEn} Keep mid-week deadlines organized.`,
      weeklyHi: `${sunMerHi} सप्ताह के मध्य में वित्तीय व पारिवारिक तालमेल अच्छा रहेगा।`,
      weeklyLoveEn,
      weeklyLoveHi,
      monthlyEn: monthEn,
      monthlyHi: monthHi,
      yearlyEn: yearEn,
      yearlyHi: yearHi,
      loveEn: [1, 2, 5, 7, 11].includes(hVen) ? 'Warm harmony, affectionate gestures & deeper trust.' : 'Patience & active listening keep relationships sweet.',
      loveHi: [1, 2, 5, 7, 11].includes(hVen) ? 'दांपत्य व प्रेम संबंधों में मधुरता व स्नेह बढ़ेगा।' : 'संवाद में कोमलता रखने से आपसी समझ सुदृढ़ होगी।',
      careerEn: [1, 3, 6, 10, 11].includes(hSun) ? 'Strong recognition, leadership scope & career progress.' : 'Steady focus and teamwork ensure reliable gains.',
      careerHi: [1, 3, 6, 10, 11].includes(hSun) ? 'कार्यक्षेत्र में सम्मान, पदोन्नति व वरिष्ठों का सहयोग मिलेगा।' : 'धैर्य और व्यवस्थित कार्यप्रणाली से लक्ष्य पूरे होंगे।',
      healthEn: [4, 8, 12].includes(hMoon) ? 'Rest well, hydrate & avoid spicy late meals.' : 'Good vitality; gentle exercise keeps energy high.',
      healthHi: [4, 8, 12].includes(hMoon) ? 'पर्याप्त नींद, जल सेवन व पाचन का ध्यान रखें।' : 'स्वास्थ्य उत्तम रहेगा; प्राणायाम व टहलना लाभकारी है।',
      luckyColorEn: c.en,
      luckyColorHi: c.hi,
      luckyNumber: c.num,
    };
  });
}

// Curated Offline Baby Names across all 27 Nakshatras (Boy & Girl pairs per Nakshatra)
const RAW_BABY_NAMES: Array<[number, 'boy' | 'girl', string, string, string]> = [
  [0, 'boy', 'Chirag', 'Lamp, brilliance', 'दीपक, तेज'],
  [0, 'boy', 'Chetan', 'Conscious, vibrant life', 'चेतन, जीवंत'],
  [0, 'girl', 'Chahat', 'Love, deep desire', 'स्नेह, चाहत'],
  [0, 'girl', 'Lavanya', 'Grace, beauty', 'लावण्य, सुंदरता'],
  [1, 'boy', 'Lakshya', 'Goal, aim', 'लक्ष्य, ध्येय'],
  [1, 'boy', 'Lokesh', 'King of worlds (Brahma)', 'लोकेश, ब्रह्मा'],
  [1, 'girl', 'Lipika', 'Sacred syllable/script', 'पवित्र लिपि'],
  [1, 'girl', 'Lopamudra', 'Vedic scholar & sage', 'वैदिक विदुषी'],
  [2, 'boy', 'Aarav', 'Peaceful wisdom', 'शांति एवं ज्ञान'],
  [2, 'boy', 'Ishaan', 'Lord Shiva, Sun', 'ईशान, भगवान शिव'],
  [2, 'girl', 'Ananya', 'Matchless, unique', 'अनन्या, अद्वितीय'],
  [2, 'girl', 'Ishita', 'Desired, mastery', 'इशिता, श्रेष्ठ'],
  [3, 'boy', 'Omkar', 'Sacred sound Om', 'ॐ का नाद'],
  [3, 'boy', 'Vivaan', 'Morning rays, full of life', 'प्रातः की किरण, ऊर्जावान'],
  [3, 'girl', 'Vani', 'Goddess Saraswati, speech', 'वाणी, सरस्वती'],
  [3, 'girl', 'Vrinda', 'Sacred Tulsi, Devi Radha', 'वृंदा, तुलसी'],
  [4, 'boy', 'Vedant', 'Ultimate Vedic wisdom', 'वेदांत, सर्वोच्च ज्ञान'],
  [4, 'boy', 'Kartikeya', 'Lord Murugan, warrior', 'कार्तिकेय, तेजस्वी'],
  [4, 'girl', 'Kavya', 'Poetry, musical grace', 'काव्य, सुंदर रचना'],
  [4, 'girl', 'Kiara', 'Bright light, pure', 'उज्ज्वल, पवित्र'],
  [5, 'boy', 'Kushagra', 'Sharp intellect', 'कुशाग्र बुद्धि'],
  [5, 'boy', 'Ghanashyam', 'Lord Krishna', 'घनश्याम, श्रीकृष्ण'],
  [5, 'girl', 'Kumudini', 'Water lily, lotus', 'कुमुदिनी, कमल'],
  [5, 'girl', 'Chhaya', 'Protective shade', 'छवि, शीतल छाया'],
  [6, 'boy', 'Keshav', 'Lord Vishnu / Krishna', 'केशव, श्रीविष्णु'],
  [6, 'boy', 'Harshvardhan', 'Creator of joy', 'हर्ष बढ़ाने वाला'],
  [6, 'girl', 'Keerti', 'Fame, eternal glory', 'कीर्ति, यश'],
  [6, 'girl', 'Himani', 'Goddess Parvati', 'हिमानी, माँ पार्वती'],
  [7, 'boy', 'Hriday', 'Heart, pure compassion', 'हृदय, करुणामय'],
  [7, 'boy', 'Daksh', 'Skilled, son of Brahma', 'दक्ष, कुशल'],
  [7, 'girl', 'Hema', 'Golden, Goddess Parvati', 'हेमा, स्वर्णमयी'],
  [7, 'girl', 'Damini', 'Lightning radiance', 'दामिनी, दीप्ति'],
  [8, 'boy', 'Devansh', 'Divine spark of God', 'देवांश, ईश्वर का अंश'],
  [8, 'boy', 'Divyansh', 'Part of the divine light', 'दिव्यांश'],
  [8, 'girl', 'Diya', 'Sacred oil lamp', 'दीया, प्रकाश'],
  [8, 'girl', 'Deeksha', 'Sacred initiation', 'दीक्षा, संकल्प'],
  [9, 'boy', 'Manav', 'Humanity, noble soul', 'मानव, श्रेष्ठ मनुष्य'],
  [9, 'boy', 'Mihir', 'Bright Sun', 'मिहिर, सूर्य'],
  [9, 'girl', 'Meera', 'Devotee of Krishna', 'मीरा, भक्तिमयी'],
  [9, 'girl', 'Manya', 'Worthy of honor', 'मान्या, सम्माननीय'],
  [10, 'boy', 'Moksh', 'Spiritual liberation', 'मोक्ष, मुक्ति'],
  [10, 'boy', 'Tanmay', 'Engrossed in meditation', 'तन्मय, एकाग्र'],
  [10, 'girl', 'Tara', 'Bright star, Devi', 'तारा, नक्षत्र'],
  [10, 'girl', 'Tulsi', 'Sacred basil plant', 'तुलसी, पवित्र'],
  [11, 'boy', 'Tejas', 'Radiant brilliance', 'तेजस, कांति'],
  [11, 'boy', 'Pranav', 'Sacred syllable Om', 'प्रणव, ओंकार'],
  [11, 'girl', 'Pihu', 'Sweet songbird', 'पीहू, मधुर स्वर'],
  [11, 'girl', 'Pallavi', 'New tender leaf', 'पल्लवी, नवपल्लव'],
  [12, 'boy', 'Purav', 'East wind, melody', 'पूरब, प्रातः राग'],
  [12, 'boy', 'Shashwat', 'Eternal truth', 'शाश्वत, सनातन'],
  [12, 'girl', 'Shambhavi', 'Goddess Durga', 'शांभवी, माँ दुर्गा'],
  [12, 'girl', 'Nandini', 'Goddess Durga, joyful', 'नंदिनी, आनंदमयी'],
  [13, 'boy', 'Raghav', 'Descendant of Raghu (Rama)', 'राघव, श्रीराम'],
  [13, 'boy', 'Rohan', 'Ascending progress', 'रोहन, उन्नति'],
  [13, 'girl', 'Prachi', 'Eastern dawn direction', 'प्राची, पूर्व दिशा'],
  [13, 'girl', 'Rhea', 'Flowing stream, goddess', 'रिया, सरिता'],
  [14, 'boy', 'Rudra', 'Lord Shiva', 'रुद्र, महादेव'],
  [14, 'boy', 'Reyansh', 'Ray of Lord Vishnu', 'रेयांश, सूर्य किरण'],
  [14, 'girl', 'Roshni', 'Radiant light', 'रोशनी, उजाला'],
  [14, 'girl', 'Tanvi', 'Graceful Devi Durga', 'तन्वी, सुकोमल'],
  [15, 'boy', 'Teerth', 'Sacred pilgrimage', 'तीर्थ, पवित्र'],
  [15, 'boy', 'Tushar', 'Morning dew, snow', 'तुषार, हिमकण'],
  [15, 'girl', 'Trisha', 'Thirst, aspiration', 'तृषा, कामना'],
  [15, 'girl', 'Tripti', 'Contentment, peace', 'तृप्ति, संतोष'],
  [16, 'boy', 'Nakul', 'Sharp, wise Pandava', 'नकुल, बुद्धिमान'],
  [16, 'boy', 'Nirvaan', 'Ultimate bliss', 'निर्वाण, परम शांति'],
  [16, 'girl', 'Niharika', 'Nebula, dewdrops', 'निहारिका, ओस कण'],
  [16, 'girl', 'Nisha', 'Peaceful night', 'निशा, शांत रात्रि'],
  [17, 'boy', 'Yug', 'Epoch, age', 'युग, काल'],
  [17, 'boy', 'Yuvraj', 'Crown prince', 'युवराज'],
  [17, 'girl', 'Yamini', 'Moonlit night', 'यामिनी, चाँदनी रात'],
  [17, 'girl', 'Yukti', 'Wisdom, strategy', 'युक्ति, उपाय'],
  [18, 'boy', 'Yash', 'Fame, success', 'यश, कीर्ति'],
  [18, 'boy', 'Bhavesh', 'Lord of existence (Shiva)', 'भावेश, शिव'],
  [18, 'girl', 'Bhavya', 'Grand, Goddess Parvati', 'भव्या, भव्य'],
  [18, 'girl', 'Bhumi', 'Mother Earth', 'भूमि, पृथ्वी'],
  [19, 'boy', 'Bhuvan', 'Palace, universe', 'भुवन, लोक'],
  [19, 'boy', 'Dhairya', 'Courageous patience', 'धैर्य, सहनशीलता'],
  [19, 'girl', 'Dharini', 'Earth, nurturing power', 'धारिणी, पृथ्वी'],
  [19, 'girl', 'Phalguni', 'Sacred spring star', 'फाल्गुनी'],
  [20, 'boy', 'Jayesh', 'Lord of victory', 'जयेश, विजयी'],
  [20, 'boy', 'Jatin', 'Disciplined ascetic (Shiva)', 'जतिन, शिव'],
  [20, 'girl', 'Jhanvi', 'Sacred river Ganga', 'जहान्वी, माँ गंगा'],
  [20, 'girl', 'Jiya', 'Life, heart', 'जिया, हृदय'],
  [21, 'boy', 'Khushal', 'Prosperous & joyful', 'खुशहाल, प्रसन्न'],
  [21, 'boy', 'Kshitij', 'Horizon where earth meets sky', 'क्षितिज'],
  [21, 'girl', 'Khyati', 'Fame & distinction', 'ख्याति, प्रसिद्धि'],
  [21, 'girl', 'Khushi', 'Happiness, delight', 'खुशी, आनंद'],
  [22, 'boy', 'Gaurav', 'Pride, dignity', 'गौरव, सम्मान'],
  [22, 'boy', 'Gagan', 'Vast sky', 'गगन, आकाश'],
  [22, 'girl', 'Gauri', 'Goddess Parvati', 'गौरी, माँ पार्वती'],
  [22, 'girl', 'Geetanjali', 'Garland of sacred songs', 'गीतांजलि'],
  [23, 'boy', 'Samarth', 'Capable, powerful', 'समर्थ, सक्षम'],
  [23, 'boy', 'Siddharth', 'Enlightened, accomplished', 'सिद्धार्थ'],
  [23, 'girl', 'Suhani', 'Pleasant, graceful', 'सुहानी, मधुर'],
  [23, 'girl', 'Siya', 'Goddess Sita', 'सिया, माँ सीता'],
  [24, 'boy', 'Soham', 'Vedic mantra “I am That”', 'सोऽहम्, ब्रह्म नाद'],
  [24, 'boy', 'Divij', 'Born in heaven, pure', 'दिविज, दिव्य'],
  [24, 'girl', 'Shraddha', 'Faith, devotion', 'श्रद्धा, निष्ठा'],
  [24, 'girl', 'Simran', 'Remembrance of Divine', 'सिमरन, ईश्वर स्मरण'],
  [25, 'boy', 'Dushyant', 'Noble king of Bharat lineage', 'दुष्यंत'],
  [25, 'boy', 'Dhruv', 'Unshakeable Pole Star', 'ध्रुव तारा, अटल'],
  [25, 'girl', 'Durga', 'Invincible Mother', 'दुर्गा, शक्ति'],
  [25, 'girl', 'Jhalak', 'Bright glimpse', 'झलक, आभा'],
  [26, 'boy', 'Dev', 'Divine', 'देव, दिव्य'],
  [26, 'boy', 'Charan', 'Lotus feet, disciple', 'चरण, विनम्र'],
  [26, 'girl', 'Devika', 'Little goddess', 'देविका, देवी स्वरूप'],
  [26, 'girl', 'Charvi', 'Beautiful, graceful', 'चार्वी, सुंदर'],
];

export function findBabyNames(
  nakshatraIndex: number | 'all',
  gender: 'all' | 'boy' | 'girl' = 'all'
): BabyNameEntry[] {
  return RAW_BABY_NAMES.filter(([nIdx, g]) => {
    if (nakshatraIndex !== 'all' && nIdx !== nakshatraIndex) return false;
    if (gender !== 'all' && g !== gender) return false;
    return true;
  }).map(([nIdx, g, name, mEn, mHi]) => {
    const syl = getAllNakshatraSyllables(nIdx);
    const matchedSyl =
      syl.en.find((s) => name.toLowerCase().startsWith(s.toLowerCase())) ??
      getNakshatraSyllable(nIdx, 1).en;
    return {
      name,
      gender: g,
      nakshatraIndex: nIdx,
      syllableEn: matchedSyl,
      meaningEn: mEn,
      meaningHi: mHi,
      chaldeanNum: computeNameNumber(name, 'chaldean').reduced,
    };
  });
}

const GEMSTONE_BY_PLANET: Record<
  SevenPlanetId,
  {
    stoneEn: string;
    stoneHi: string;
    metalEn: string;
    metalHi: string;
    fingerEn: string;
    fingerHi: string;
    dayEn: string;
    dayHi: string;
    weightRatti: string;
  }
> = {
  Sun: { stoneEn: 'Ruby (Manikya)', stoneHi: 'माणिक्य (Ruby)', metalEn: 'Gold / Copper', metalHi: 'सोना / तांबा', fingerEn: 'Ring Finger', fingerHi: 'अनामिका उंगली', dayEn: 'Sunday morning', dayHi: 'रविवार प्रातः', weightRatti: '4.5–6 Ratti' },
  Moon: { stoneEn: 'Natural Pearl (Moti)', stoneHi: 'मोती (Pearl)', metalEn: 'Silver', metalHi: 'चाँदी', fingerEn: 'Little Finger', fingerHi: 'कनिष्ठा उंगली', dayEn: 'Monday evening', dayHi: 'सोमवार संध्या', weightRatti: '5.5–7.5 Ratti' },
  Mars: { stoneEn: 'Red Coral (Moonga)', stoneHi: 'लाल मूंगा (Red Coral)', metalEn: 'Copper / Gold', metalHi: 'तांबा / सोना', fingerEn: 'Ring Finger', fingerHi: 'अनामिका उंगली', dayEn: 'Tuesday morning', dayHi: 'मंगलवार प्रातः', weightRatti: '6–8 Ratti' },
  Mercury: { stoneEn: 'Emerald (Panna)', stoneHi: 'पन्ना (Emerald)', metalEn: 'Gold / Silver', metalHi: 'सोना / चाँदी', fingerEn: 'Little Finger', fingerHi: 'कनिष्ठा उंगली', dayEn: 'Wednesday morning', dayHi: 'बुधवार प्रातः', weightRatti: '4.5–6 Ratti' },
  Jupiter: { stoneEn: 'Yellow Sapphire (Pukhraj)', stoneHi: 'पीला पुखराज (Yellow Sapphire)', metalEn: 'Gold', metalHi: 'सोना', fingerEn: 'Index Finger', fingerHi: 'तर्जनी उंगली', dayEn: 'Thursday morning', dayHi: 'गुरुवार प्रातः', weightRatti: '4.5–6.5 Ratti' },
  Venus: { stoneEn: 'Opal / White Sapphire / Diamond', stoneHi: 'ओपल / श्वेत पुखराज / हीरा', metalEn: 'Silver / Platinum / White Gold', metalHi: 'चाँदी / श्वेत स्वर्ण', fingerEn: 'Middle / Ring Finger', fingerHi: 'मध्यमा / अनामिका', dayEn: 'Friday morning', dayHi: 'शुक्रवार प्रातः', weightRatti: '5–7 Ratti (Opal) / 0.5–1 ct (Diamond)', },
  Saturn: { stoneEn: 'Blue Sapphire / Amethyst (Neelam)', stoneHi: 'नीलम / जामुनिया (Blue Sapphire)', metalEn: 'Silver / Panchdhatu', metalHi: 'चाँदी / पंचधातु', fingerEn: 'Middle Finger', fingerHi: 'मध्यमा उंगली', dayEn: 'Saturday evening (Trial first)', dayHi: 'शनिवार (परीक्षण उपरांत)', weightRatti: '5–7 Ratti' },
};

const RUDRAKSHA_BY_PLANET: Record<string, RudrakshaRecommendation> = {
  Sun: { mukhi: '1 Mukhi / 12 Mukhi', titleEn: '12 Mukhi Rudraksha (Dwadasha Aditya)', titleHi: '12 मुखी रुद्राक्ष (सूर्य कारक)', deityEn: 'Lord Surya & Shiva', deityHi: 'भगवान सूर्य एवं शिव', planet: 'Sun', benefitEn: 'Boosts confidence, vitality, leadership charisma, and relieves fear/hesitation.', benefitHi: 'आत्मविश्वास, तेजस्विता, नेतृत्व व सरकारी सम्मान में वृद्धि करता है।', mantra: 'ॐ क्रों क्षों रों नमः' },
  Moon: { mukhi: '2 Mukhi', titleEn: '2 Mukhi Rudraksha (Ardhanarishvara)', titleHi: '2 मुखी रुद्राक्ष (चंद्र कारक)', deityEn: 'Shiva–Parvati', deityHi: 'अर्धनारीश्वर शिव-पार्वती', planet: 'Moon', benefitEn: 'Calms emotional unrest, strengthens intuition, family harmony & Moon balance.', benefitHi: 'मानसिक शांति, भावनात्मक संतुलन, माता सुख व दांपत्य एकता बढ़ाता है।', mantra: 'ॐ नमः' },
  Mars: { mukhi: '3 Mukhi', titleEn: '3 Mukhi Rudraksha (Agni)', titleHi: '3 मुखी रुद्राक्ष (मंगल कारक)', deityEn: 'Agni Deva', deityHi: 'अग्नि देव', planet: 'Mars', benefitEn: 'Burns past stress, reduces Manglik impatience, and energizes courage.', benefitHi: 'मांगलिक क्रोध शांत कर साहस, ऊर्जा व कर्म-शक्ति प्रदान करता है।', mantra: 'ॐ क्लीं नमः' },
  Mercury: { mukhi: '4 Mukhi', titleEn: '4 Mukhi Rudraksha (Chaturmukha Brahma)', titleHi: '4 मुखी रुद्राक्ष (बुध कारक)', deityEn: 'Lord Brahma & Saraswati', deityHi: 'भगवान ब्रह्मा एवं सरस्वती', planet: 'Mercury', benefitEn: 'Enhances memory, speech clarity, education, coding, writing & business logic.', benefitHi: 'स्मरण शक्ति, वाक्पटुता, शिक्षा व व्यापारिक बुद्धि को प्रखर करता है।', mantra: 'ॐ ह्रीं नमः' },
  Jupiter: { mukhi: '5 Mukhi', titleEn: '5 Mukhi Rudraksha (Kalagni Rudra)', titleHi: '5 मुखी रुद्राक्ष (गुरु कारक)', deityEn: 'Lord Kalagni Rudra', deityHi: 'कालाग्नि रुद्र (शिव)', planet: 'Jupiter', benefitEn: 'Universal spiritual protection, wisdom, peace of mind, health & fortune.', benefitHi: 'सर्वकल्याण, ज्ञान, मानसिक शांति, भाग्य वृद्धि व उच्च रक्तचाप नियंत्रण में सहायक।', mantra: 'ॐ ह्रीं नमः' },
  Venus: { mukhi: '6 Mukhi / 13 Mukhi', titleEn: '6 Mukhi Rudraksha (Kartikeya)', titleHi: '6 मुखी रुद्राक्ष (शुक्र कारक)', deityEn: 'Lord Kartikeya', deityHi: 'भगवान कार्तिकेय', planet: 'Venus', benefitEn: 'Cultivates charm, artistic mastery, relationship harmony & disciplined prosperity.', benefitHi: 'सौंदर्य, आकर्षण, कला-संस्कृति, सुख-वैभव व दांपत्य मधुरता बढ़ाता है।', mantra: 'ॐ ह्रीं हुं नमः' },
  Saturn: { mukhi: '7 Mukhi / 14 Mukhi', titleEn: '7 Mukhi Rudraksha (Mahalakshmi)', titleHi: '7 मुखी रुद्राक्ष (शनि कारक)', deityEn: 'Devi Mahalakshmi', deityHi: 'माँ महालक्ष्मी', planet: 'Saturn', benefitEn: 'Eases Sade Sati pressures, overcomes scarcity, stabilizes career & wealth.', benefitHi: 'शनि साढ़ेसाती/ढैया कष्ट निवारण, आर्थिक संकट मुक्ति व करियर स्थायित्व देता है।', mantra: 'ॐ हुं नमः' },
  Rahu: { mukhi: '8 Mukhi', titleEn: '8 Mukhi Rudraksha (Vighnaharta)', titleHi: '8 मुखी रुद्राक्ष (राहु कारक)', deityEn: 'Lord Ganesha', deityHi: 'भगवान गणेश', planet: 'Rahu', benefitEn: 'Removes Rahu obstacles, anxiety & delays; protects during Kala Sarpa or Grahan.', benefitHi: 'राहु जनित बाधाओं, भ्रम व कालसर्प/ग्रहण दोष के दुष्प्रभाव से रक्षा करता है।', mantra: 'ॐ हुं नमः' },
  Ketu: { mukhi: '9 Mukhi', titleEn: '9 Mukhi Rudraksha (Navadurga)', titleHi: '9 मुखी रुद्राक्ष (केतु कारक)', deityEn: 'Maa Durga', deityHi: 'माँ नवदुर्गा', planet: 'Ketu', benefitEn: 'Grants fearless inner strength, intuition & Ketu/Gandmool stabilization.', benefitHi: 'निर्भयता, आध्यात्मिक उन्नति व केतु/गंडमूल अस्थिरता को संतुलित करता है।', mantra: 'ॐ ह्रीं हुं नमः' },
};

export function computeGemstoneAndRudraksha(chart: ChartData): GemstoneRudrakshaReport {
  const ascIdx = chart.ascendant.signIndex;
  const lagnaLord = SIGNS[ascIdx].lord;
  const lord5 = SIGNS[(ascIdx + 4) % 12].lord;
  const lord9 = SIGNS[(ascIdx + 8) % 12].lord;

  const mkGem = (
    roleEn: string,
    roleHi: string,
    planet: SevenPlanetId,
    reasonEn: string,
    reasonHi: string
  ): GemstoneRecommendation => {
    const g = GEMSTONE_BY_PLANET[planet];
    return { roleEn, roleHi, planet, ...g, reasonEn, reasonHi };
  };

  const lifeStone = mkGem(
    'Life Stone (Jeevan Ratna)',
    'जीवन रत्न (लग्नेश)',
    lagnaLord,
    `Strengthens Lagna Lord ${lagnaLord} for overall vitality, confidence, and health.`,
    `लग्नेश के रूप में संपूर्ण स्वास्थ्य, आत्मबल व जीवन उन्नति के लिए धारणीय।`
  );
  const luckyStone = mkGem(
    'Lucky Stone (Bhagya Ratna)',
    'भाग्य रत्न (नवमेश)',
    lord9,
    `Enhances 9th Lord ${lord9} for fortune, dharma, long journeys, and mentorship blessings.`,
    `नवम भाव (भाग्य व धर्म) को प्रबल करने और अवसर आकर्षित करने हेतु सहायक।`
  );
  const beneficStone = mkGem(
    'Education & Progeny Stone (Punya Ratna)',
    'पुण्य रत्न (पंचमेश)',
    lord5,
    `Supports 5th Lord ${lord5} for sharp intelligence, mantra power, creativity, and investments.`,
    `पंचम भाव (बुद्धि, शिक्षा, संतान व निवेश) को सशक्त बनाने के लिए उपयोगी।`
  );

  // Caution stones: Dusthana lords (6, 8, 12 rulers that don't own trines)
  const avoidSet = new Set<SevenPlanetId>();
  const dusthanaLords: SevenPlanetId[] = [
    SIGNS[(ascIdx + 5) % 12].lord,
    SIGNS[(ascIdx + 7) % 12].lord,
    SIGNS[(ascIdx + 11) % 12].lord,
  ];
  for (const dl of dusthanaLords) {
    if (dl !== lagnaLord && dl !== lord5 && dl !== lord9) {
      avoidSet.add(dl);
    }
  }
  const avoidList = Array.from(avoidSet);
  const avoidStonesEn = avoidList.map((p) => `${GEMSTONE_BY_PLANET[p].stoneEn} (${p} rules dusthana 6/8/12)`);
  const avoidStonesHi = avoidList.map((p) => `${GEMSTONE_BY_PLANET[p].stoneHi} (दुस्थान 6/8/12 स्वामी)`);

  // Primary Rudraksha = Lagna Lord or Moon; Secondary = Weakest Functional Benefic or Dasha Lord
  const primaryRudraksha = RUDRAKSHA_BY_PLANET[lagnaLord] ?? RUDRAKSHA_BY_PLANET.Jupiter;
  const activeDashaLord = chart.vimshottari.find(
    (d) => Date.now() >= d.startMs && Date.now() < d.endMs
  )?.lord ?? 'Moon';
  const secKey = activeDashaLord === lagnaLord ? lord9 : activeDashaLord;
  const secondaryRudraksha = RUDRAKSHA_BY_PLANET[secKey] ?? RUDRAKSHA_BY_PLANET.Moon;

  const doshaRudrakshaNoteEn =
    'For Manglik balance wear 3 Mukhi; for Rahu/Kala Sarpa wear 8 Mukhi; for Saturn Sade Sati wear 7 Mukhi after Monday/Thursday purification.';
  const doshaRudrakshaNoteHi =
    'मांगलिक शांति हेतु 3 मुखी, राहु/कालसर्प दोष हेतु 8 मुखी, एवं शनि साढ़ेसाती हेतु 7 मुखी रुद्राक्ष शुभ मुहूर्त में धारण करना विशेष लाभकारी होता है।';

  return {
    lifeStone,
    luckyStone,
    beneficStone,
    avoidStonesEn,
    avoidStonesHi,
    primaryRudraksha,
    secondaryRudraksha,
    doshaRudrakshaNoteEn,
    doshaRudrakshaNoteHi,
  };
}

export function getNakshatraTitle(idx: number): string {
  return NAKSHATRAS[((idx % 27) + 27) % 27]?.name ?? '';
}

export function getSignTitle(idx: number): string {
  return SIGNS[((idx % 12) + 12) % 12]?.name ?? '';
}
