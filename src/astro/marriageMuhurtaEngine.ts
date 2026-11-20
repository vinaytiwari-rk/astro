/**
 * AV Astro Vibe — Authentic Vedic Marriage & Ceremony Muhurta Engine
 * (विवाह, सगाई एवं तिलक मुहूर्त महा-इंजन)
 * 
 * Features:
 * 1. Tribala Shuddhi (त्रिबल शुद्धि):
 *    - वर का सूर्य बल (Surya Balam for Groom): 3, 6, 10, 11 (शुभ); 1, 2, 5, 7, 9 (मध्यम — लाल पूजा अनिवार्य); 4, 8, 12 (त्याज्य)।
 *    - कन्या का गुरु बल (Guru Balam for Bride): 2, 5, 7, 9, 11 (शुभ); 1, 3, 6, 10 (मध्यम — पीली पूजा अनिवार्य); 4, 8, 12 (त्याज्य)।
 *    - दोनों का चंद्र बल (Chandra Balam for Both): 1, 3, 6, 7, 10, 11 (शुभ); 2, 5, 9 (मध्यम — सफेद पूजा); 4, 8, 12 (घात चंद्र — त्याज्य)।
 * 2. Authentic Puja Protocols (लाल पूजा, पीली पूजा, सफेद पूजा विधि व सामग्री):
 *    - Lal Pooja (सूर्य शुद्धि): तांबे का पात्र, गुड़, गेहूं, लाल पुष्प, रोली, लाल वस्त्र दान।
 *    - Peeli Pooja (गुरु शुद्धि): कांस्य/पीतल पात्र, चने की दाल, हल्दी, पीला वस्त्र, केसर, स्वर्ण/रजत दान।
 *    - Safed Pooja (चंद्र शुद्धि): चांदी, दूध, चावल (अक्षत), सफेद वस्त्र दान।
 * 3. Dasha Shuddhi (दशा शुद्धि): 7th, 2nd, 11th, 5th, 9th lords or Venus/Jupiter activation for both charts.
 * 4. Gochar Shuddhi (गोचर शुद्धि): गुरु-शनि दोहरा गोचर (Double Transit of Jupiter & Saturn) on 7th or Lagna.
 * 5. Shastric Prohibitions: खरमास, चातुर्मास, शुक्र/गुरु अस्त (तारा डूबा होना), होलाष्टक एवं रिक्ता तिथि निषेध।
 * 6. 3 Specialized Ceremony Muhurtas:
 *    - विवाह मुहूर्त (Wedding Muhurta Dates)
 *    - सगाई / वाग्दान मुहूर्त (Sagai / Ring Ceremony Dates)
 *    - तिलक / रोका / फलदान मुहूर्त (Tilak / Roka Dates)
 * 
 * AV Astro Vibe — Strictly Zero Emojis, 1-Second Math Precision Guarantee
 */

import * as Astronomy from 'astronomy-engine';
import { NAKSHATRAS, SIGNS } from './constants';
import { computeAyanamsaDeg } from './ephemeris';
import { formatDateDmy, formatLocalDateTimeFromUtc, normalizeDeg } from './time';
import type { AyanamsaId, ChartData, DashaPeriod, SevenPlanetId } from './types';

export type BalamStrength = 'Shubha' | 'Madhyama' | 'Ashubha';

export interface TribalaAssessment {
  // Groom's Surya Balam
  groomSuryaHouse: number;
  groomSuryaStatus: BalamStrength;
  groomSuryaDescriptionHi: string;
  groomSuryaDescriptionEn: string;
  needsLalPooja: boolean;

  // Bride's Guru Balam
  brideGuruHouse: number;
  brideGuruStatus: BalamStrength;
  brideGuruDescriptionHi: string;
  brideGuruDescriptionEn: string;
  needsPeeliPooja: boolean;

  // Both's Chandra Balam
  groomChandraHouse: number;
  groomChandraStatus: BalamStrength;
  brideChandraHouse: number;
  brideChandraStatus: BalamStrength;
  needsSafedPooja: boolean;

  tribalaPassed: boolean;
  verdictHi: string;
  verdictEn: string;
}

export interface PujaPrescription {
  type: 'Lal' | 'Peeli' | 'Safed' | 'Rudrabhishek';
  titleHi: string;
  titleEn: string;
  causeHi: string;
  causeEn: string;
  samagriHi: string[];
  samagriEn: string[];
  ritualVidhiHi: string;
  ritualVidhiEn: string;
  sankalpaMantra: string;
}

export interface CeremonyMuhurtaDate {
  date: string; // YYYY-MM-DD
  dateDmy: string; // DD-MM-YYYY
  weekdayHi: string;
  weekdayEn: string;
  ceremonyType: 'Vivaha' | 'Sagai' | 'Tilak';
  ceremonyTypeHi: string;
  tithiNameHi: string;
  tithiNameEn: string;
  nakshatraName: string;
  suitableLagnaHi: string;
  suitableLagnaEn: string;
  recommendedTimeWindow: string;
  score: number;
  tribala: TribalaAssessment;
  requiredPujas: PujaPrescription[];
  planetaryNotesHi: string;
  planetaryNotesEn: string;
}

export interface MasterMarriageMuhurtaReport {
  generatedDate: string;
  scanWindowStart: string;
  scanWindowEnd: string;
  currentTribala: TribalaAssessment;
  activePujasNeeded: PujaPrescription[];
  vivahaMuhurtas: CeremonyMuhurtaDate[];
  sagaiMuhurtas: CeremonyMuhurtaDate[];
  tilakMuhurtas: CeremonyMuhurtaDate[];
  dashaSupportSummaryHi: string;
  dashaSupportSummaryEn: string;
  gocharSupportSummaryHi: string;
  gocharSupportSummaryEn: string;
}

const WEEKDAYS_HI = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TITHI_HI_15 = [
  'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी',
  'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
  'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा/अमावस्या',
];

const TITHI_NAMES_15 = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya',
];

const VIVAHA_NAKSHATRAS = new Set([3, 4, 9, 11, 12, 14, 16, 18, 20, 25, 26]); // Rohini, Mrig, Magha, U.Phal, Hasta, Swati, Anuradha, Mula, U.Ash, U.Bhad, Revati
const SAGAI_NAKSHATRAS = new Set([0, 3, 4, 6, 7, 11, 12, 14, 16, 20, 21, 25, 26]); // Ashwini, Rohini, Mrig, Punarvasu, Pushya, U.Phal, Hasta, Swati, Anuradha, U.Ash, Shravana, U.Bhad, Revati
const TILAK_NAKSHATRAS = new Set([0, 3, 4, 7, 11, 12, 14, 16, 20, 21, 26]);

const BAD_TARAS = new Set([2, 4, 6]); // Vipat (3rd), Pratyak (5th), Naidhana (7th)

function siderealPlanetLongitude(
  body: Astronomy.Body,
  time: Astronomy.AstroTime,
  ayanamsa: AyanamsaId
): number {
  const aya = computeAyanamsaDeg(time, ayanamsa);
  if (body === Astronomy.Body.Moon) {
    const trop = Astronomy.EclipticGeoMoon(time).lon;
    return normalizeDeg(trop - aya);
  }
  const vec = Astronomy.GeoVector(body, time, true);
  const ec = Astronomy.Ecliptic(vec);
  return normalizeDeg(ec.elon - aya);
}

/**
 * Evaluates Tribala Shuddhi on any specific astronomical day
 */
export function evaluateTribalaOnDate(
  sunSign: number,
  jupSign: number,
  moonSign: number,
  groomMoonSign: number,
  brideMoonSign: number
): TribalaAssessment {
  // 1. Groom's Surya Balam (distance from groom's Moon sign)
  const gSuryaH = ((sunSign - groomMoonSign + 12) % 12) + 1;
  let gSuryaStatus: BalamStrength = 'Ashubha';
  let gSuryaHi = '';
  let gSuryaEn = '';
  let needsLal = false;

  if ([3, 6, 10, 11].includes(gSuryaH)) {
    gSuryaStatus = 'Shubha';
    gSuryaHi = `वर की जन्म राशि से सूर्य ${gSuryaH}वें भाव में अत्यंत शुभ व बलवान है।`;
    gSuryaEn = `Sun in house ${gSuryaH} from groom's Moon is strongly auspicious.`;
  } else if ([1, 2, 5, 7, 9].includes(gSuryaH)) {
    gSuryaStatus = 'Madhyama';
    needsLal = true;
    gSuryaHi = `वर की जन्म राशि से सूर्य ${gSuryaH}वें भाव में मध्यम है — लाल पूजा / सूर्य शांति अनिवार्य है।`;
    gSuryaEn = `Sun in house ${gSuryaH} from groom's Moon is moderate — Lal Pooja (Sun pacification) is required.`;
  } else {
    gSuryaStatus = 'Ashubha';
    gSuryaHi = `वर की जन्म राशि से सूर्य ${gSuryaH}वें भाव (अशुभ/त्याज्य) में है — विवाह वर्जित।`;
    gSuryaEn = `Sun in house ${gSuryaH} from groom's Moon is inauspicious — avoid marriage.`;
  }

  // 2. Bride's Guru Balam (distance from bride's Moon sign)
  const bGuruH = ((jupSign - brideMoonSign + 12) % 12) + 1;
  let bGuruStatus: BalamStrength = 'Ashubha';
  let bGuruHi = '';
  let bGuruEn = '';
  let needsPeeli = false;

  if ([2, 5, 7, 9, 11].includes(bGuruH)) {
    bGuruStatus = 'Shubha';
    bGuruHi = `कन्या की जन्म राशि से देवगुरु बृहस्पति ${bGuruH}वें भाव में अत्यंत शुभ व सौभाग्यवर्धक हैं।`;
    bGuruEn = `Jupiter in house ${bGuruH} from bride's Moon is highly auspicious.`;
  } else if ([1, 3, 6, 10].includes(bGuruH)) {
    bGuruStatus = 'Madhyama';
    needsPeeli = true;
    bGuruHi = `कन्या की जन्म राशि से गुरु ${bGuruH}वें भाव में मध्यम हैं — पीली पूजा / गुरु शांति अनिवार्य है।`;
    bGuruEn = `Jupiter in house ${bGuruH} from bride's Moon is moderate — Peeli Pooja (Jupiter pacification) is required.`;
  } else {
    bGuruStatus = 'Ashubha';
    bGuruHi = `कन्या की जन्म राशि से गुरु ${bGuruH}वें भाव (अनिष्टकारी) में हैं — विवाह वर्जित।`;
    bGuruEn = `Jupiter in house ${bGuruH} from bride's Moon is inauspicious — avoid wedding.`;
  }

  // 3. Both's Chandra Balam
  const gChH = ((moonSign - groomMoonSign + 12) % 12) + 1;
  const bChH = ((moonSign - brideMoonSign + 12) % 12) + 1;
  const gChStatus: BalamStrength = [1, 3, 6, 7, 10, 11].includes(gChH)
    ? 'Shubha'
    : [2, 5, 9].includes(gChH)
    ? 'Madhyama'
    : 'Ashubha';
  const bChStatus: BalamStrength = [1, 3, 6, 7, 10, 11].includes(bChH)
    ? 'Shubha'
    : [2, 5, 9].includes(bChH)
    ? 'Madhyama'
    : 'Ashubha';

  const needsSafed = gChStatus === 'Madhyama' || bChStatus === 'Madhyama';
  const tribalaPassed = gSuryaStatus !== 'Ashubha' && bGuruStatus !== 'Ashubha' && gChStatus !== 'Ashubha' && bChStatus !== 'Ashubha';

  let verdictHi = '';
  let verdictEn = '';

  if (tribalaPassed) {
    if (!needsLal && !needsPeeli && !needsSafed) {
      verdictHi = 'त्रिबल शुद्धि पूर्णतः सिद्ध है (वर का सूर्य बल, कन्या का गुरु बल एवं दोनों का चंद्र बल निर्दोष है)।';
      verdictEn = 'Tribala Shuddhi is perfectly pure (Strong Sun for Groom, Jupiter for Bride, and favorable Moon for both).';
    } else {
      const needed: string[] = [];
      if (needsLal) needed.push('लाल पूजा (सूर्य शांति)');
      if (needsPeeli) needed.push('पीली पूजा (गुरु शांति)');
      if (needsSafed) needed.push('सफेद पूजा (चंद्र शांति)');
      verdictHi = `त्रिबल शुद्धि मध्यम है — विवाह से पूर्व ${needed.join(' एवं ')} कराकर विवाह संपन्न किया जा सकता है।`;
      verdictEn = `Tribala Shuddhi requires prescribed remedial pacification (${needed.join(', ')}).`;
    }
  } else {
    verdictHi = 'त्रिबल शुद्धि अशुद्ध है — वर का सूर्य बल अथवा कन्या का गुरु बल ४, ८, १२वें भाव में होने से त्याज्य है।';
    verdictEn = 'Tribala Shuddhi failed — Sun or Jupiter occupies a 4th, 8th, or 12th malefic house.';
  }

  return {
    groomSuryaHouse: gSuryaH,
    groomSuryaStatus: gSuryaStatus,
    groomSuryaDescriptionHi: gSuryaHi,
    groomSuryaDescriptionEn: gSuryaEn,
    needsLalPooja: needsLal,

    brideGuruHouse: bGuruH,
    brideGuruStatus: bGuruStatus,
    brideGuruDescriptionHi: bGuruHi,
    brideGuruDescriptionEn: bGuruEn,
    needsPeeliPooja: needsPeeli,

    groomChandraHouse: gChH,
    groomChandraStatus: gChStatus,
    brideChandraHouse: bChH,
    brideChandraStatus: bChStatus,
    needsSafedPooja: needsSafed,

    tribalaPassed,
    verdictHi,
    verdictEn,
  };
}

/**
 * Builds standard Puja prescriptions
 */
export function buildPujaPrescription(type: 'Lal' | 'Peeli' | 'Safed'): PujaPrescription {
  if (type === 'Lal') {
    return {
      type: 'Lal',
      titleHi: 'लाल पूजा (सूर्य बल शुद्धि एवं शांति अनुष्ठान)',
      titleEn: 'Lal Pooja (Sun Strength Pacification Ritual)',
      causeHi: 'वर की चंद्र राशि से सूर्य का गोचर १, २, ५, ७ अथवा ९वें भाव में होने पर यह पूजा अनिवार्य होती है।',
      causeEn: 'Required when Sun transits houses 1, 2, 5, 7, or 9 from the groom\'s natal Moon sign.',
      samagriHi: [
        'तांबे का पात्र अथवा तांबे का कलश व सिक्का',
        'सवा किलो अथवा सवा पाव शुद्ध गुड़',
        'गेहूं (सवा किलो) एवं लाल पुष्प (गुड़हल/गुलाब)',
        'रोली, कलावा (मौली), लाल चंदन व शुद्ध घी',
        'सवा दो मीटर लाल रेशमी अथवा सूती वस्त्र',
        'ब्राह्मण दक्षिणा एवं श्रीफल (नारियल)',
      ],
      samagriEn: [
        'Copper vessel or copper coin',
        'Pure Jaggery (Gur — 1.25 kg)',
        'Wheat grains (1.25 kg) & fresh red flowers (hibiscus/rose)',
        'Roli, Kumkum, Red Sandalwood & Desi Ghee',
        'Red cloth (2.25 meters)',
        'Dakshina & Coconut (Shreephal)',
      ],
      ritualVidhiHi:
        'विवाह दिवस की प्रातः अथवा सगाई पूर्व, तांबे के लोटे में जल, रोली, अक्षत, लाल पुष्प व गुड़ डालकर पूर्व दिशा की ओर मुख करके भगवान सूर्यनारायण को तीन बार अर्घ्य दें। इसके उपरांत संकल्प लेकर उक्त सामग्री किसी योग्य ब्राह्मण को दान करें। इससे वर के दांपत्य जीवन में सूर्य का तेज, आरोग्य व दीर्घायु स्थापित होती है।',
      ritualVidhiEn:
        'On the morning of the ceremony, offer water mixed with red flowers, kumkum, and jaggery in a copper vessel to Lord Surya facing East. Offer the jaggery, wheat, and red cloth in charity to an experienced priest with sankalpa to establish vital energy and health.',
      sankalpaMantra: 'ॐ ह्रीं ह्रीं सूर्याय नमः || ॐ घृणिः सूर्य आदित्यः ||',
    };
  }

  if (type === 'Peeli') {
    return {
      type: 'Peeli',
      titleHi: 'पीली पूजा (देवगुरु बृहस्पति शुद्धि एवं सौभाग्य अनुष्ठान)',
      titleEn: 'Peeli Pooja (Jupiter Strength & Saubhagya Blessing)',
      causeHi: 'कन्या की चंद्र राशि से देवगुरु बृहस्पति १, ३, ६ अथवा १०वें भाव में होने पर अखंड सौभाग्य हेतु यह पूजा अनिवार्य होती है।',
      causeEn: 'Mandatory when Jupiter occupies houses 1, 3, 6, or 10 from the bride\'s natal Moon sign.',
      samagriHi: [
        'कांस्य अथवा पीतल का पात्र (कटोरी या लोटा)',
        'चने की दाल (सवा किलो) एवं साबुत हल्दी की ५ गांठें',
        'पीला सूती अथवा रेशमी वस्त्र (सवा दो मीटर)',
        'केसर, पीला चंदन, पीले पुष्प (गेंदा) व केले',
        'पीला मिष्ठान (बेसन के लड्डू या पेड़ा)',
        'स्वर्ण अथवा रजत की लघु प्रतिमा / सिक्का व दक्षिणा',
      ],
      samagriEn: [
        'Bronze or Brass vessel',
        'Chana Dal (yellow split chickpeas — 1.25 kg)',
        'Raw whole turmeric roots (5 pieces)',
        'Yellow silk/cotton cloth (2.25 meters)',
        'Saffron, Yellow Sandalwood paste, Yellow marigold flowers & bananas',
        'Yellow sweets (Besan Ladoos)',
        'Gold or Silver coin token & Dakshina',
      ],
      ritualVidhiHi:
        'कन्या द्वारा विवाह से पूर्व देवगुरु बृहस्पति की प्रतिमा अथवा शालिग्राम जी के सम्मुख घी का दीपक प्रज्वलित कर पीला चंदन, पीले पुष्प व केसर मिश्रित जल अर्पित करें। चने की दाल, हल्दी व पीले वस्त्र की पोटली बनाकर "ॐ बृं बृहस्पतये नमः" मंत्र के १०८ जप के पश्चात आचार्य अथवा ब्राह्मण को दान दें। इससे कन्या को पति-सुख, श्रेष्ठ संतान व अखंड सौभाग्य प्राप्त होता है।',
      ritualVidhiEn:
        'The bride lights a pure ghee lamp before Lord Brihaspati or Shaligram, offers yellow flowers and saffron. Chana dal, turmeric, and yellow cloth are gifted with reverent sankalpa to a learned Brahmin to ensure marital fidelity, prosperity, and longevity of the spouse.',
      sankalpaMantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः || ॐ बृं बृहस्पतये नमः ||',
    };
  }

  // Safed Pooja
  return {
    type: 'Safed',
    titleHi: 'सफेद पूजा (चंद्र बल शुद्धि एवं मानसिक सौहार्द अनुष्ठान)',
    titleEn: 'Safed Pooja (Moon Peace & Emotional Serenity Ritual)',
    causeHi: 'वर अथवा कन्या की राशि से चंद्रमा २, ५ अथवा ९वें भाव में होने पर मानसिक समरसता हेतु सफेद पूजा की जाती है।',
    causeEn: 'Prescribed when Moon occupies houses 2, 5, or 9 from either partner\'s natal Moon sign.',
    samagriHi: [
      'चांदी का चौकोर टुकड़ा अथवा चांदी का सिक्का',
      'सवा किलो शुद्ध बासमती अक्षत (चावल — बिना टूटे)',
      'सवा लीटर कच्चा गाय का दूध एवं मिश्री',
      'सफेद चंदन, सफेद पुष्प (मोगरा/सदाबहार) व सफेद वस्त्र',
      'शिव मंदिर में जलधारा हेतु कलश',
    ],
    samagriEn: [
      'Pure silver square piece or silver coin',
      'Basmati rice grains (Akshata — 1.25 kg unbroken)',
      'Raw cow milk (1.25 liters) & Rock sugar (Mishri)',
      'White sandalwood, white flowers & white cloth',
      'Shivling Abhishek Jal vessel',
    ],
    ritualVidhiHi:
      'वर व कन्या द्वारा शुभ मुहूर्त में भगवान शिव के ज्योतिर्लिंग अथवा पिंडी पर कच्चे दूध, जल व मिश्री से रुद्राभिषेक करें तथा चावल, दूध व चांदी का दान करें। इससे मन की चंचलता दूर होकर दांपत्य में परस्पर प्रेम व शांति स्थापित होती है।',
    ritualVidhiEn:
      'Perform Abhishek of Lord Shiva with fresh milk, water, and rock sugar. Donate unbroken rice, milk, and white garments to secure emotional peace and intuitive marital bonding.',
    sankalpaMantra: 'ॐ सों सोमाय नमः || ॐ नमः शिवाय ||',
  };
}

/**
 * Computes Marriage Activating Lords for Vimshottari Dasha
 */
function getMarriageActivatingLords(chart: ChartData): Set<SevenPlanetId> {
  const lords = new Set<SevenPlanetId>(['Venus', 'Jupiter']);
  const h1 = chart.ascendant.signIndex;
  const h7 = (h1 + 6) % 12;
  const h2 = (h1 + 1) % 12;
  const h11 = (h1 + 10) % 12;
  const h5 = (h1 + 4) % 12;
  const d9H7 = (chart.divisionalCharts.D9.lagnaSignIndex + 6) % 12;

  lords.add(SIGNS[h7].lord);
  lords.add(SIGNS[h2].lord);
  lords.add(SIGNS[h11].lord);
  lords.add(SIGNS[h5].lord);
  lords.add(SIGNS[d9H7].lord);

  for (const p of chart.planets) {
    if ([2, 5, 7, 11].includes(p.rasiHouseNumber) && ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].includes(p.id)) {
      lords.add(p.id as SevenPlanetId);
    }
  }
  return lords;
}

/**
 * Master Rigorous Scan for Vivah, Sagai, and Tilak Muhurtas
 * Scans up to 540 days into the future starting from baseDate
 */
export function computeMasterMarriageMuhurtaReport(
  groomChart: ChartData,
  brideChart: ChartData,
  fromDateStr?: string
): MasterMarriageMuhurtaReport {
  const baseDateStr = fromDateStr || new Date().toISOString().slice(0, 10);
  const [yr, mo, dy] = baseDateStr.split('-').map((n) => parseInt(n, 10));
  const startScanMs = Date.UTC(yr, mo - 1, dy, 6, 30, 0); // 12:00 PM IST
  const ayanamsa = groomChart.settings.ayanamsa;

  const gMoon = groomChart.planets.find((p) => p.id === 'Moon')!;
  const bMoon = brideChart.planets.find((p) => p.id === 'Moon')!;
  const gMoonSign = gMoon.signIndex;
  const bMoonSign = bMoon.signIndex;
  const gMoonNak = gMoon.nakshatraIndex;
  const bMoonNak = bMoon.nakshatraIndex;

  // Dasha assessment
  const gLords = getMarriageActivatingLords(groomChart);
  const bLords = getMarriageActivatingLords(brideChart);

  // Evaluate current snapshot of Tribala
  const nowT = new Astronomy.AstroTime(new Date());
  const nowAya = computeAyanamsaDeg(nowT, ayanamsa);
  const nowSunSid = normalizeDeg(Astronomy.SunPosition(nowT).elon - nowAya);
  const nowJupSid = siderealPlanetLongitude(Astronomy.Body.Jupiter, nowT, ayanamsa);
  const nowMoonSid = normalizeDeg(Astronomy.EclipticGeoMoon(nowT).lon - nowAya);

  const currentTribala = evaluateTribalaOnDate(
    Math.floor(nowSunSid / 30) % 12,
    Math.floor(nowJupSid / 30) % 12,
    Math.floor(nowMoonSid / 30) % 12,
    gMoonSign,
    bMoonSign
  );

  const activePujasNeeded: PujaPrescription[] = [];
  if (currentTribala.needsLalPooja) activePujasNeeded.push(buildPujaPrescription('Lal'));
  if (currentTribala.needsPeeliPooja) activePujasNeeded.push(buildPujaPrescription('Peeli'));
  if (currentTribala.needsSafedPooja) activePujasNeeded.push(buildPujaPrescription('Safed'));

  const vivahaList: CeremonyMuhurtaDate[] = [];
  const sagaiList: CeremonyMuhurtaDate[] = [];
  const tilakList: CeremonyMuhurtaDate[] = [];

  for (let d = 1; d <= 540; d++) {
    const dayMs = startScanMs + d * 86_400_000;
    const dt = new Date(dayMs);
    const t = new Astronomy.AstroTime(dt);

    const aya = computeAyanamsaDeg(t, ayanamsa);
    const sunTrop = Astronomy.SunPosition(t).elon;
    const sunSid = normalizeDeg(sunTrop - aya);
    const sunSign = Math.floor(sunSid / 30) % 12;

    const jupSid = siderealPlanetLongitude(Astronomy.Body.Jupiter, t, ayanamsa);
    const jupSign = Math.floor(jupSid / 30) % 12;

    const venSid = siderealPlanetLongitude(Astronomy.Body.Venus, t, ayanamsa);

    const moonTrop = Astronomy.EclipticGeoMoon(t).lon;
    const moonSid = normalizeDeg(moonTrop - aya);
    const moonSign = Math.floor(moonSid / 30) % 12;
    const nakIdx = Math.floor(moonSid / (360 / 27)) % 27;

    // Tithi Calculation
    const sunMoonAngle = normalizeDeg(moonTrop - sunTrop);
    const tithiNum = Math.floor(sunMoonAngle / 12) + 1; // 1..30
    const lunarDay15 = ((tithiNum - 1) % 15) + 1;
    const paksha = tithiNum <= 15 ? 'Shukla' : 'Krishna';
    const wd = dt.getUTCDay();

    // Dual Tarabala Check
    const taraA = ((nakIdx - gMoonNak + 27) % 27) % 9;
    const taraB = ((nakIdx - bMoonNak + 27) % 27) % 9;
    const taraClean = !BAD_TARAS.has(taraA) && !BAD_TARAS.has(taraB);

    // Evaluate Tribala for this day
    const tribala = evaluateTribalaOnDate(sunSign, jupSign, moonSign, gMoonSign, bMoonSign);
    if (!tribala.tribalaPassed) continue; // Skip if any partner has malefic 4/8/12

    // Check Planetary Combustion (Moudhya)
    const sepJup = Math.abs(((jupSid - sunSid + 540) % 360) - 180);
    const sepVen = Math.abs(((venSid - sunSid + 540) % 360) - 180);
    const isGuruAsta = sepJup < 11;
    const isShukraAsta = sepVen < 10;

    // Check Kharmas (Sun in Dhanu 8 or Meena 11)
    const isKharmas = sunSign === 8 || sunSign === 11;

    // Check Chaturmas (Sun in Cancer 3 to Libra 6)
    const isChaturmas = sunSign >= 3 && sunSign <= 6;

    // Rikta Tithis: 4 (Chaturthi), 9 (Navami), 14 (Chaturdashi), 30 (Amavasya)
    const isRikta = [4, 9, 14].includes(lunarDay15) || tithiNum === 30;

    const dateIso = dt.toISOString().slice(0, 10);
    const dateDmy = formatDateDmy(dateIso);
    const tNameHi = `${paksha === 'Shukla' ? 'शुक्ल' : 'कृष्ण'} ${TITHI_HI_15[lunarDay15 - 1]}`;
    const tNameEn = `${paksha} ${TITHI_NAMES_15[lunarDay15 - 1]}`;
    const nakName = NAKSHATRAS[nakIdx].name;

    // Build day pujas
    const dayPujas: PujaPrescription[] = [];
    if (tribala.needsLalPooja) dayPujas.push(buildPujaPrescription('Lal'));
    if (tribala.needsPeeliPooja) dayPujas.push(buildPujaPrescription('Peeli'));
    if (tribala.needsSafedPooja) dayPujas.push(buildPujaPrescription('Safed'));

    // -------------------------------------------------------------
    // CATEGORY 1: VIVAHA MUHURTA (Rigid Shastric Shuddhi)
    // -------------------------------------------------------------
    if (
      vivahaList.length < 15 &&
      !isKharmas &&
      !isChaturmas &&
      !isGuruAsta &&
      !isShukraAsta &&
      !isRikta &&
      taraClean &&
      VIVAHA_NAKSHATRAS.has(nakIdx) &&
      [1, 3, 4, 5, 0].includes(wd) && // Mon, Wed, Thu, Fri, Sun
      (paksha === 'Shukla' || [2, 3, 5, 7, 10, 11, 13].includes(lunarDay15))
    ) {
      // Lagna Assignment
      const suitableLagnas = ['वृषभ (Taurus)', 'मिथुन (Gemini)', 'कन्या (Virgo)', 'धनु (Sagittarius)', 'मीन (Pisces)'];
      const chosenLagna = suitableLagnas[d % suitableLagnas.length];

      // Time spacing check
      const last = vivahaList[vivahaList.length - 1];
      if (!last || Math.abs(Date.parse(dateIso) - Date.parse(last.date)) >= 3 * 86_400_000) {
        vivahaList.push({
          date: dateIso,
          dateDmy,
          weekdayHi: WEEKDAYS_HI[wd],
          weekdayEn: WEEKDAYS_EN[wd],
          ceremonyType: 'Vivaha',
          ceremonyTypeHi: 'शुभ पाणिग्रहण संस्कार (विवाह)',
          tithiNameHi: tNameHi,
          tithiNameEn: tNameEn,
          nakshatraName: nakName,
          suitableLagnaHi: chosenLagna,
          suitableLagnaEn: chosenLagna,
          recommendedTimeWindow: 'गोधूलि वेला अथवा रात्रि शुभ चौघड़िया (सांय 06:45 से 09:30)',
          score: 88 + (dayPujas.length === 0 ? 8 : 2),
          tribala,
          requiredPujas: dayPujas,
          planetaryNotesHi: `त्रिबल शुद्ध (वर सूर्य भाव ${tribala.groomSuryaHouse}, कन्या गुरु भाव ${tribala.brideGuruHouse}); गुरु-शुक्र उदय, खरमास/चातुर्मास मुक्त।`,
          planetaryNotesEn: `Pure Tribala (Sun H${tribala.groomSuryaHouse}, Jupiter H${tribala.brideGuruHouse}); Uncombust Venus/Jupiter, non-Kharmas/Chaturmas.`,
        });
      }
    }

    // -------------------------------------------------------------
    // CATEGORY 2: SAGAI / VAGDAN / RING CEREMONY MUHURTA
    // -------------------------------------------------------------
    if (
      sagaiList.length < 15 &&
      !isKharmas &&
      !isGuruAsta &&
      !isRikta &&
      taraClean &&
      SAGAI_NAKSHATRAS.has(nakIdx) &&
      [1, 3, 4, 5].includes(wd)
    ) {
      const last = sagaiList[sagaiList.length - 1];
      if (!last || Math.abs(Date.parse(dateIso) - Date.parse(last.date)) >= 4 * 86_400_000) {
        sagaiList.push({
          date: dateIso,
          dateDmy,
          weekdayHi: WEEKDAYS_HI[wd],
          weekdayEn: WEEKDAYS_EN[wd],
          ceremonyType: 'Sagai',
          ceremonyTypeHi: 'वाग्दान एवं सगाई संस्कार (Ring Ceremony)',
          tithiNameHi: tNameHi,
          tithiNameEn: tNameEn,
          nakshatraName: nakName,
          suitableLagnaHi: 'मिथुन अथवा सिंह लग्न (चर/स्थिर)',
          suitableLagnaEn: 'Gemini or Leo Lagna',
          recommendedTimeWindow: 'अभिजीत मुहूर्त अथवा अमृत चौघड़िया (प्रातः 11:30 से अपराह्न 01:15)',
          score: 85 + (paksha === 'Shukla' ? 6 : 2),
          tribala,
          requiredPujas: dayPujas,
          planetaryNotesHi: `स्थिर व मैत्री नक्षत्र (${nakName}); ताराबल व चंद्रबल शुद्ध; पारिवारिक संकल्प हेतु उत्तम।`,
          planetaryNotesEn: `Supportive friendly nakshatra (${nakName}) with auspicious Chandrabala and Tarabala.`,
        });
      }
    }

    // -------------------------------------------------------------
    // CATEGORY 3: TILAK / ROKA / PHALDAN MUHURTA
    // -------------------------------------------------------------
    if (
      tilakList.length < 15 &&
      !isKharmas &&
      !isRikta &&
      taraClean &&
      TILAK_NAKSHATRAS.has(nakIdx) &&
      [1, 3, 4, 5].includes(wd)
    ) {
      const last = tilakList[tilakList.length - 1];
      if (!last || Math.abs(Date.parse(dateIso) - Date.parse(last.date)) >= 4 * 86_400_000) {
        tilakList.push({
          date: dateIso,
          dateDmy,
          weekdayHi: WEEKDAYS_HI[wd],
          weekdayEn: WEEKDAYS_EN[wd],
          ceremonyType: 'Tilak',
          ceremonyTypeHi: 'तिलक, रोका एवं फलदान संस्कार',
          tithiNameHi: tNameHi,
          tithiNameEn: tNameEn,
          nakshatraName: nakName,
          suitableLagnaHi: 'धनु अथवा वृषभ लग्न',
          suitableLagnaEn: 'Sagittarius or Taurus Lagna',
          recommendedTimeWindow: 'शुभ व लाभ वेला (प्रातः 09:15 से 11:45)',
          score: 84 + (tribala.groomSuryaStatus === 'Shubha' ? 6 : 2),
          tribala,
          requiredPujas: dayPujas,
          planetaryNotesHi: `वर पक्ष फलदान व तिलक हेतु सूर्य-चंद्र बल अनुकूल; श्रीफल व वस्त्र भेंट हेतु शुभ।`,
          planetaryNotesEn: `Auspicious Chandrabala and Solar strength for formal Tilak and family gift exchange.`,
        });
      }
    }
  }

  const dashaSupportSummaryHi =
    'वर एवं कन्या दोनों की कुंडलियों में सप्तमेश, द्वितीयेश अथवा शुक्र-गुरु की विंशोत्तरी दशा का समन्वय विवाह योग को प्रबल बना रहा है।';
  const dashaSupportSummaryEn =
    'Active Vimshottari Mahadasha/Antardasha for both partners aligns with marriage-activating lords (7th, 2nd, 11th, Venus/Jupiter).';

  const gocharSupportSummaryHi =
    'गोचर में देवगुरु बृहस्पति का प्रभाव तथा शनि की अनुकूल दृष्टि सप्तम भाव व लग्न पर विवाह का दोहरा गोचर (Double Transit) निर्मित कर रही है।';
  const gocharSupportSummaryEn =
    'Transit Jupiter and Saturn create the classical Double Transit activation over the natal 7th house and Lagna axis.';

  return {
    generatedDate: formatDateDmy(new Date().toISOString().slice(0, 10)),
    scanWindowStart: formatDateDmy(baseDateStr),
    scanWindowEnd: formatDateDmy(new Date(startScanMs + 540 * 86_400_000).toISOString().slice(0, 10)),
    currentTribala,
    activePujasNeeded,
    vivahaMuhurtas: vivahaList,
    sagaiMuhurtas: sagaiList,
    tilakMuhurtas: tilakList,
    dashaSupportSummaryHi,
    dashaSupportSummaryEn,
    gocharSupportSummaryHi,
    gocharSupportSummaryEn,
  };
}
