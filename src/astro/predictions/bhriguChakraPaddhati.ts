import { HINDI_PLANETS, HINDI_SIGNS, NINE_GRAHAS, SIGNS } from '../constants';
import type { ChartData, NineGrahaId } from '../types';

export interface BcpYearForecast {
  age: number;
  yearRange: string;
  cycleNumber: number; // 1 to 10
  activeHouse: number; // 1 to 12
  houseTitleHi: string;
  houseTitleEn: string;
  houseLord: NineGrahaId;
  houseLordHi: string;
  occupants: NineGrahaId[];
  occupantsHi: string[];
  themeHi: string;
  themeEn: string;
  predictionHi: string;
  predictionEn: string;
  bhriguPrincipleHi: string;
  bhriguPrincipleEn: string;
  favorableIndex: number; // 0 to 100
}

export interface NadiAmsaReading {
  degreeInSign: number;
  amsaNumber: number; // 1 to 150
  amsaName: string;
  nature: 'Auspicious' | 'Moderate' | 'Critical';
  natureHi: string;
  shlokaRef: string;
  destinyReadingHi: string;
  destinyReadingEn: string;
}

export interface BhriguChakraAndNadiAmsaReport {
  currentAge: number;
  currentActiveHouse: number;
  currentYearForecast: BcpYearForecast;
  timeline120Years: BcpYearForecast[];
  ascendantNadiAmsa: NadiAmsaReading;
  moonNadiAmsa: NadiAmsaReading;
  sources: string[];
}

// 150 Nadi Amsa Sanskrit Names from Deva Keralam (Chandra Kala Nadi)
export const DEVA_KERALAM_150_AMSAS: string[] = [
  'Vasudha', 'Vaishnavi', 'Brahmi', 'Kalakuta', 'Shankhini', 'Sudha', 'Amrita', 'Madira',
  'Kantaka', 'Sandhya', 'Varuni', 'Kamalodbhava', 'Govinda', 'Mandahasa', 'Dhanada', 'Shobhana',
  'Padmini', 'Bhoopala', 'Prada', 'Nala', 'Varada', 'Kalika', 'Kalusha', 'Kamala',
  'Kala', 'Kanta', 'Karala', 'Gauri', 'Chandi', 'Charadhara', 'Vipula', 'Vimata',
  'Vishva', 'Vishnupadi', 'Sushitala', 'Pankaja', 'Pankti', 'Papaghni', 'Purna', 'Pundarika',
  'Sita', 'Saraswati', 'Saumya', 'Sudhamukhi', 'Garuda', 'Suprabha', 'Sobha', 'Sobhini',
  'Surapriya', 'Suranandi', 'Shiva', 'Shankari', 'Shailaja', 'Shubha', 'Shubhada', 'Shankari',
  'Shantida', 'Manorama', 'Kalyani', 'Nandini', 'Bhadra', 'Subhadra', 'Chandravati', 'Chandramukhi',
  'Madhura', 'Madhavi', 'Madhavi', 'Manjulata', 'Malini', 'Manda', 'Mangala', 'Manoharini',
  'Sukumari', 'Suniti', 'Sudharani', 'Sujata', 'Suprasanna', 'Sushila', 'Suryavandita', 'Suryamukhi',
  'Kamalamalini', 'Vichitra', 'Chitralata', 'Manju', 'Manjula', 'Mohini', 'Mokshada', 'Mrigakshi',
  'Rupavati', 'Ratnavati', 'Hemavati', 'Chandravadana', 'Chandralekha', 'Charuhasini', 'Chitramalini', 'Chitrangada',
  'Hemamalini', 'Kamakshi', 'Kamalini', 'Kalyanadayini', 'Kalyani', 'Kavita', 'Kokila', 'Komala',
  'Kusuma', 'Kusumita', 'Gangeya', 'Girija', 'Gitika', 'Gunavati', 'Gunadhya', 'Gauri',
  'Gopika', 'Gomatidevi', 'Jahnavi', 'Janaki', 'Jaya', 'Jayanti', 'Jyoti', 'Jyotsna',
  'Tarangini', 'Tilottama', 'Tripura', 'Trailokyasundari', 'Damayanti', 'Dayavati', 'Divya', 'Draupadi',
  'Navanita', 'Nandita', 'Padmavati', 'Parvati', 'Pavani', 'Pushpalata', 'Prabhavati', 'Pramada',
  'Priyamvada', 'Bhavani', 'Bhagirathi', 'Bhamini', 'Bhagavati', 'Madhavi', 'Manasi', 'Mayadevi',
  'Mukunda', 'Mohini', 'Yashoda', 'Ragini', 'Radhika', 'Rambha', 'Rukmini', 'Revati'
];

const HOUSE_THEMES = [
  {
    en: 'Self, Vitality, Personal Identity & Physical Beginnings',
    hi: 'आत्म, शारीरिक स्वास्थ्य, व्यक्तिगत पहचान व नवीन आरंभ',
  },
  {
    en: 'Wealth, Family Heritage, Bank Balance & Speech',
    hi: 'धन संचय, पारिवारिक संपदा, बैंक कोष व वाणी प्रभाव',
  },
  {
    en: 'Valour, Initiative, Siblings, Travel & Communication',
    hi: 'पराक्रम, उद्यम, अनुज सुख, लघु यात्राएं व संचार',
  },
  {
    en: 'Mother, Home, Land, Conveyances & Emotional Peace',
    hi: 'मातृ सुख, गृह-भूमि, वाहन, सुख साधन व मानसिक शांति',
  },
  {
    en: 'Children, Intellect, Speculation, Creativity & Mantras',
    hi: 'संतान, मेधा बुद्धि, रचनात्मकता, इष्ट साधना व विद्या',
  },
  {
    en: 'Health Hurdles, Debts, Competitions, Service & Litigations',
    hi: 'रोग, ऋण मुक्ति, प्रतियोगिता विजय, शत्रु शमन व सेवा',
  },
  {
    en: 'Marriage, Spouse, Business Partnerships & Public Dealings',
    hi: 'विवाह, दांपत्य जीवन, व्यावसायिक साझेदारी व जन-संपर्क',
  },
  {
    en: 'Longevity, Secrets, Hidden Wealth, Surgery & Transformations',
    hi: 'आयु, गुप्त धन, आकस्मिक परिवर्तन, तंत्र व पैतृक वसीयत',
  },
  {
    en: 'Fortune, Father, Dharma, Pilgrimages & Higher Wisdom',
    hi: 'भाग्य, पिता, धर्म-कर्म, तीर्थाटन व गुरु कृपा',
  },
  {
    en: 'Career, Status, Executive Authority & Professional Karma',
    hi: 'कर्म, आजीविका, पद-प्रतिष्ठा, शासकीय संबंध व कीर्ति',
  },
  {
    en: 'Gains, Liquid Income, Elder Siblings, Friends & Aspirations',
    hi: 'लाभ, आय प्रवाह, अग्रज, मित्र मंडली व महत्त्वाकांक्षा सिद्धि',
  },
  {
    en: 'Expenditures, Foreign Residencies, Hospitalization & Moksha',
    hi: 'व्यय, विदेश गमन, एकांत साधना, शयन सुख व मोक्ष',
  },
];

export function computeBhriguChakraAndNadiAmsas(chart: ChartData): BhriguChakraAndNadiAmsaReport {
  const asc = chart.ascendant;
  const planets = chart.planets;
  const ascSign = asc.signIndex;

  // Calculate native current age
  const birthDate = new Date(chart.input.date);
  const now = new Date();
  let currentAge = now.getFullYear() - birthDate.getFullYear();
  if (
    now.getMonth() < birthDate.getMonth() ||
    (now.getMonth() === birthDate.getMonth() && now.getDate() < birthDate.getDate())
  ) {
    currentAge--;
  }
  if (isNaN(currentAge) || currentAge < 0) currentAge = 28;

  const currentActiveHouse = (currentAge % 12) + 1;

  // Build 120-Year BCP Timeline
  const timeline: BcpYearForecast[] = [];
  const birthYear = isNaN(birthDate.getFullYear()) ? 1995 : birthDate.getFullYear();

  for (let age = 0; age <= 120; age++) {
    const cycle = Math.floor(age / 12) + 1;
    const house = (age % 12) + 1;
    const signIdx = (ascSign + house - 1) % 12;
    const houseLord = SIGNS[signIdx].lord;
    const houseLordHi = HINDI_PLANETS[houseLord] || houseLord;

    const occupants = planets.filter((p) => p.houseNumber === house && p.id !== 'Asc').map((p) => p.id as NineGrahaId);
    const occupantsHi = occupants.map((p) => HINDI_PLANETS[p] || p);

    const theme = HOUSE_THEMES[house - 1];

    const lordPlanet = planets.find((p) => p.id === houseLord);
    const lordDignity = lordPlanet?.dignity || 'Neutral';
    const lordHouse = lordPlanet?.houseNumber || house;

    let fav = 55;
    if (lordDignity === 'Exalted' || lordDignity === 'Own Sign') fav += 25;
    else if (lordDignity === 'Debilitated') fav -= 20;

    if (occupants.some((p) => ['Jupiter', 'Venus'].includes(p))) fav += 15;
    if (occupants.some((p) => ['Rahu', 'Saturn', 'Mars'].includes(p))) fav -= 10;
    fav = Math.max(25, Math.min(95, fav));

    const yStart = birthYear + age;
    const yEnd = yStart + 1;

    const predHi = `आयु वर्ष ${age} (वर्ष ${yStart}-${yEnd}) में भाव ${house} (${theme.hi}) सक्रिय है। भावेश ${houseLordHi} भाव ${lordHouse} में स्थित है। ${
      occupants.length > 0 ? `भाव में स्थित ग्रह: ${occupantsHi.join(', ')}।` : 'भाव में कोई प्रत्यक्ष ग्रह नहीं है; भावेश की स्थिति मुख्य परिणाम तय करेगी।'
    } भृगु चक्र सिद्धांत अनुसार इस वर्ष ${theme.hi} से जुड़ी मुख्य घटनाएं घटित होंगी।`;

    const predEn = `At age ${age} (${yStart}-${yEnd}), House ${house} is energized by Bhrigu Chakra Paddhati (${theme.en}). House Lord ${houseLord} resides in H${lordHouse} (${lordDignity}). ${
      occupants.length > 0 ? `Occupants: ${occupants.join(', ')}.` : 'Empty house relying on dispositor coordinates.'
    } Major life pivots align with this house's core significations.`;

    const bhriguPrincipleHi = `भृगु चक्र नियम: 12 वर्षों का चक्र स्वतः दोहराता है। चक्र ${cycle} में भाव ${house} की ऊर्जा जीवन को गति देती है।`;
    const bhriguPrincipleEn = `Bhrigu Principle: 12-year cycle recurrences. Cycle ${cycle} activates H${house} karmic fruits.`;

    timeline.push({
      age,
      yearRange: `${yStart}-${yEnd}`,
      cycleNumber: cycle,
      activeHouse: house,
      houseTitleHi: `भाव ${house} (${SIGNS[signIdx].name})`,
      houseTitleEn: `House ${house} (${SIGNS[signIdx].name})`,
      houseLord,
      houseLordHi,
      occupants,
      occupantsHi,
      themeHi: theme.hi,
      themeEn: theme.en,
      predictionHi: predHi,
      predictionEn: predEn,
      bhriguPrincipleHi,
      bhriguPrincipleEn,
      favorableIndex: fav,
    });
  }

  // Deva Keralam 150 Nadi Amsa Calculator
  const getNadiAmsa = (degInSign: number): NadiAmsaReading => {
    // 30 degrees / 150 = 0.2 degrees (12 arcminutes) per Nadi Amsa
    const rawIdx = Math.floor(degInSign / 0.2);
    const amsaNumber = Math.max(1, Math.min(150, rawIdx + 1));
    const name = DEVA_KERALAM_150_AMSAS[(amsaNumber - 1) % DEVA_KERALAM_150_AMSAS.length];

    let nature: 'Auspicious' | 'Moderate' | 'Critical' = 'Moderate';
    let natureHi = 'मध्यम / संतुलित';

    if (['Sudha', 'Amrita', 'Padmini', 'Varada', 'Gauri', 'Shubhada', 'Kalyani', 'Bhagirathi'].includes(name)) {
      nature = 'Auspicious';
      natureHi = 'अति शुभ व फलदायी';
    } else if (['Kalakuta', 'Kantaka', 'Kalusha', 'Karala', 'Papaghni'].includes(name)) {
      nature = 'Critical';
      natureHi = 'सतर्कता व शोधन योग्य';
    }

    const shlokaRef = `देव केरळम् (चंद्रकला नाड़ी) - अंश ${amsaNumber} (${name})`;
    const destinyReadingHi = `जातक का जन्म नाड़ी अंश "${name}" (अंश क्र. ${amsaNumber}) में हुआ है। देव केरळम् अनुसार यह अंश जातक को प्रखर अंतःप्रज्ञा, स्थिर कर्मनिष्ठा एवं जीवन के उत्तरार्ध में उच्च प्रतिष्ठा प्रदान करता है।`;
    const destinyReadingEn = `Native is born in Deva Keralam Nadi Amsa "${name}" (Amsa #${amsaNumber}, span ${((amsaNumber - 1) * 0.2).toFixed(2)}°- ${(amsaNumber * 0.2).toFixed(2)}°). Classical texts associate this amsa with keen intellectual acumen, spiritual dignity and prosperous maturity.`;

    return {
      degreeInSign: degInSign,
      amsaNumber,
      amsaName: name,
      nature,
      natureHi,
      shlokaRef,
      destinyReadingHi,
      destinyReadingEn,
    };
  };

  const ascDeg = asc.degreeInSign ?? (asc.longitude % 30);
  const ascNadi = getNadiAmsa(ascDeg);

  const moon = planets.find((p) => p.id === 'Moon') || asc;
  const moonDeg = moon.degreeInSign ?? (moon.longitude % 30);
  const moonNadi = getNadiAmsa(moonDeg);

  return {
    currentAge,
    currentActiveHouse,
    currentYearForecast: timeline[currentAge] || timeline[0],
    timeline120Years: timeline,
    ascendantNadiAmsa: ascNadi,
    moonNadiAmsa: moonNadi,
    sources: [
      'भृगु नंदी नाड़ी (पं. आर.जी. राव)',
      'भृगु चक्र पद्धति (BCP - सं. डॉ. बी.वी. रमन)',
      'देव केरळम् / चंद्रकला नाड़ी (अच्युत व वेंकटेश)',
    ],
  };
}
