import { computeAvakahadaChakra } from '../avakahadaChalit';
import { NINE_GRAHAS, SEVEN_PLANETS, SIGNS } from '../constants';
import { formatLocalDateTimeFromUtc } from '../time';
import type { BodyPosition, ChartData, NineGrahaId, SevenPlanetId } from '../types';

export interface DatedLifeEvent {
  ageRange: string;
  yearRange: string;
  categoryEn: string;
  categoryHi: string;
  tone: 'positive' | 'mixed' | 'negative';
  titleEn: string;
  titleHi: string;
  detailEn: string;
  detailHi: string;
}

export interface Life120YearEvent {
  index: number;
  startAge: number;
  endAge: number;
  ageRange: string;
  yearRange: string;
  mahadashaLord: string;
  antardashaLord: string;
  activatedHouses: number[];
  stageEn: string;
  stageHi: string;
  categoryId: 'education' | 'career' | 'marriage' | 'finance' | 'health' | 'spiritual';
  categoryEn: string;
  categoryHi: string;
  tone: 'positive' | 'mixed' | 'negative';
  titleEn: string;
  titleHi: string;
  detailEn: string;
  detailHi: string;
  milestoneEn?: string;
  milestoneHi?: string;
}

export interface PayaAndGandmoolDetail {
  payaNameEn: string;
  payaNameHi: string;
  payaTone: 'auspicious' | 'mixed' | 'challenging';
  payaMeaningEn: string;
  payaMeaningHi: string;
  isGandmool: boolean;
  nakshatraNameEn: string;
  nakshatraNameHi: string;
  pada: number;
  gandmoolSeverity: 'None' | 'Auspicious Pada' | 'Moderate' | 'High';
  gandmoolReadingEn: string;
  gandmoolReadingHi: string;
  shantiRemedyEn: string;
  shantiRemedyHi: string;
}

export interface LongevityAssessment {
  categoryEn: string;
  categoryHi: string;
  pairScoreEn: string;
  pairScoreHi: string;
  hasAlpayuCaution: boolean;
  balarishtaStatusEn: string;
  balarishtaStatusHi: string;
  marakaWarningEn: string;
  marakaWarningHi: string;
  summaryEn: string;
  summaryHi: string;
  disclaimerEn: string;
  disclaimerHi: string;
}

export interface LedgerQaItem {
  id: string;
  titleEn: string;
  titleHi: string;
  verdictBadgeEn: string;
  verdictBadgeHi: string;
  tone: 'positive' | 'mixed' | 'negative';
  answerEn: string;
  answerHi: string;
  positiveEn: string;
  positiveHi: string;
  negativeEn: string;
  negativeHi: string;
}

export interface LifeEventsAndLedgerReport {
  payaAndGandmool: PayaAndGandmoolDetail;
  accidentProfile: {
    riskLevelEn: string;
    riskLevelHi: string;
    tone: 'positive' | 'mixed' | 'negative';
    riskTypesEn: string;
    riskTypesHi: string;
    cautionWindowsEn: string;
    cautionWindowsHi: string;
    precautionEn: string;
    precautionHi: string;
  };
  timelineEvents: DatedLifeEvent[];
  timeline120Years: Life120YearEvent[];
  longevity: LongevityAssessment;
  deityAndMainPlanet: {
    ishtaDevataEn: string;
    ishtaDevataHi: string;
    ishtaBasisEn: string;
    ishtaBasisHi: string;
    ishtaMantra: string;
    mainPlanetEn: string;
    mainPlanetHi: string;
    supportingKingsEn: string;
    supportingKingsHi: string;
  };
  qaLedger: LedgerQaItem[];
}

const SIGN_HI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
];

const PLANET_HI: Record<string, string> = {
  Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध',
  Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
};

const DIGNITY_HI: Record<string, string> = {
  Exalted: 'उच्च', Moolatrikona: 'मूलत्रिकोण', 'Own Sign': 'स्वराशि',
  'Great Friend': 'अति मित्र', Friend: 'मित्र', Neutral: 'सम',
  Enemy: 'शत्रु', 'Great Enemy': 'अति शत्रु', Debilitated: 'नीच', '-': '—',
};

const NAK_HI: Record<string, string> = {
  Ashwini: 'अश्विनी', Bharani: 'भरणी', Krittika: 'कृत्तिका', Rohini: 'रोहिणी',
  Mrigashira: 'मृगशिरा', Ardra: 'आर्द्रा', Punarvasu: 'पुनर्वसु', Pushya: 'पुष्य',
  Ashlesha: 'अश्लेषा', Magha: 'मघा', 'Purva Phalguni': 'पूर्वा फाल्गुनी',
  'Uttara Phalguni': 'उत्तरा फाल्गुनी', Hasta: 'हस्त', Chitra: 'चित्रा',
  Swati: 'स्वाति', Vishakha: 'विशाखा', Anuradha: 'अनुराधा', Jyeshtha: 'ज्येष्ठा',
  Mula: 'मूल', 'Purva Ashadha': 'पूर्वाषाढ़ा', 'Uttara Ashadha': 'उत्तराषाढ़ा',
  Shravana: 'श्रवण', Dhanishta: 'धनिष्ठा', Shatabhisha: 'शतभिषा',
  'Purva Bhadrapada': 'पूर्वा भाद्रपद', 'Uttara Bhadrapada': 'उत्तरा भाद्रपद', Revati: 'रेवती',
};

const GANDMOOL_PADA_RULES: Record<
  string,
  Array<{ sev: PayaAndGandmoolDetail['gandmoolSeverity']; en: string; hi: string }>
> = {
  Ashwini: [
    { sev: 'Moderate', en: 'Pada 1 indicates intense focus on father / headship responsibilities in early years.', hi: 'चरण 1: प्रारंभिक वर्षों में पिता/परिवार दायित्व पर विशेष ध्यान।' },
    { sev: 'Auspicious Pada', en: 'Pada 2 bestows comfort, steady enterprise and financial resilience.', hi: 'चरण 2: धन, सुख-सुविधा व परिश्रम से उन्नति।' },
    { sev: 'Auspicious Pada', en: 'Pada 3 favors travel, higher learning and leadership status.', hi: 'चरण 3: यात्रा, उच्च विद्या व पद-प्रतिष्ठा में सहायक।' },
    { sev: 'Moderate', en: 'Pada 4 demands regular health discipline and self-care in childhood.', hi: 'चरण 4: बाल्यावस्था में स्वास्थ्य व दिनचर्या पर विशेष ध्यान।' },
  ],
  Ashlesha: [
    { sev: 'Auspicious Pada', en: 'Pada 1 is classically auspicious; performing Shanti refines acute intellect.', hi: 'चरण 1: परंपरागत रूप से शुभ; शांति पूजा बुद्धि को निखारती है।' },
    { sev: 'Moderate', en: 'Pada 2 warns against impulsive wealth risks in early life.', hi: 'चरण 2: प्रारंभिक जीवन में आर्थिक उतार-चढ़ाव से सतर्क रहें।' },
    { sev: 'High', en: 'Pada 3 calls for gentle care toward mother’s emotional & physical health.', hi: 'चरण 3: माता के स्वास्थ्य व भावनात्मक शांति का विशेष ध्यान रखें।' },
    { sev: 'Moderate', en: 'Pada 4 asks for patience in paternal relationship and authority bonds.', hi: 'चरण 4: पिता के साथ संवाद व स्वास्थ्य में धैर्य रखें।' },
  ],
  Magha: [
    { sev: 'High', en: 'Pada 1 emphasizes mother’s comfort and heritage care in childhood.', hi: 'चरण 1: बाल्यावस्था में माता के सुख व स्वास्थ्य पर ध्यान।' },
    { sev: 'Moderate', en: 'Pada 2 highlights father’s duty cycles and self-made courage.', hi: 'चरण 2: पिता संबंधी दायित्व एवं स्व-परिश्रम से भाग्योदय।' },
    { sev: 'Auspicious Pada', en: 'Pada 3 grants prosperity, noble friends and academic success.', hi: 'चरण 3: समृद्धि, अच्छे मित्र व शिक्षा में सफलता।' },
    { sev: 'Auspicious Pada', en: 'Pada 4 brings scholarship, wealth accumulation and honorable status.', hi: 'चरण 4: विद्या, धन संचय एवं मान-सम्मान।' },
  ],
  Jyeshtha: [
    { sev: 'Moderate', en: 'Pada 1 flags competitive tests with elder siblings or seniors.', hi: 'चरण 1: बड़े भाई-बहन या वरिष्ठों से प्रतिस्पर्धा/मतभेद सावधानी।' },
    { sev: 'Moderate', en: 'Pada 2 advises warm harmony toward younger siblings.', hi: 'चरण 2: छोटे भाई-बहनों के स्वास्थ्य व संबंधों में मधुरता रखें।' },
    { sev: 'High', en: 'Pada 3 underscores gentle devotion and maternal health care.', hi: 'चरण 3: माता के स्वास्थ्य की विशेष देखभाल आवश्यक।' },
    { sev: 'Moderate', en: 'Pada 4 advises structured temperament & self-protection in youth.', hi: 'चरण 4: युवावस्था में क्रोध/जोखिम नियंत्रण व स्वास्थ्य रक्षा।' },
  ],
  Mula: [
    { sev: 'High', en: 'Pada 1 (Abhukta Mula zone) specifically highlights paternal health/distance unless Shanti is performed.', hi: 'चरण 1 (अभुक्त मूल): पिता के स्वास्थ्य या दूरी पर प्रभाव — मूल शांति अत्यंत श्रेष्ठ।' },
    { sev: 'High', en: 'Pada 2 underscores maternal wellbeing & steady domestic peace.', hi: 'चरण 2: माता के स्वास्थ्य व पारिवारिक सुख हेतु शांति पूजा लाभकारी।' },
    { sev: 'Moderate', en: 'Pada 3 brings lessons around early capital preservation and inheritance.', hi: 'चरण 3: प्रारंभिक धन-संपत्ति प्रबंधन में सतर्कता।' },
    { sev: 'Auspicious Pada', en: 'Pada 4 is constructive — turns intensity into research mastery and fortune.', hi: 'चरण 4: शुभ — शोध, ज्ञान व संघर्ष से प्रबल भाग्योदय।' },
  ],
  Revati: [
    { sev: 'Auspicious Pada', en: 'Pada 1 grants executive leadership, compassion and honorable name.', hi: 'चरण 1: राजसी सम्मान, नेतृत्व व करुणामय प्रतिष्ठा।' },
    { sev: 'Auspicious Pada', en: 'Pada 2 supports steady finances and administrative competence.', hi: 'चरण 2: स्थायी धन, प्रशासनिक कौशल व शांति।' },
    { sev: 'Auspicious Pada', en: 'Pada 3 favors material comfort, creative expression and gains.', hi: 'चरण 3: सुख-सुविधा, कला व आर्थिक लाभ।' },
    { sev: 'Moderate', en: 'Pada 4 warns of nervous sensitivity or early childhood health tests; Shanti brings serenity.', hi: 'चरण 4: प्रारंभिक स्वास्थ्य व भावनात्मक संवेदनशीलता हेतु शांति पूजा श्रेष्ठ।' },
  ],
};

function hDist(fromSign: number, toSign: number): number {
  return ((toSign - fromSign + 12) % 12) + 1;
}

function isAspecting(p: BodyPosition, targetSign: number): boolean {
  const d = hDist(p.signIndex, targetSign);
  if (d === 7) return true;
  if (p.id === 'Jupiter' && (d === 5 || d === 9)) return true;
  if (p.id === 'Mars' && (d === 4 || d === 8)) return true;
  if (p.id === 'Saturn' && (d === 3 || d === 10)) return true;
  return false;
}

function digWeight(dignity: string): number {
  const m: Record<string, number> = {
    Exalted: 16, Moolatrikona: 14, 'Own Sign': 12, 'Great Friend': 9, Friend: 6,
    Neutral: 0, Enemy: -6, 'Great Enemy': -9, Debilitated: -12,
  };
  return m[dignity] ?? 0;
}

const DIRECTION_BY_SIGN: Array<{ en: string; hi: string }> = [
  { en: 'East', hi: 'पूर्व दिशा' },
  { en: 'South', hi: 'दक्षिण दिशा' },
  { en: 'West', hi: 'पश्चिम दिशा' },
  { en: 'North', hi: 'उत्तर दिशा' },
];

const ISHTA_DEITY_MAP: Record<NineGrahaId, { en: string; hi: string; mantra: string }> = {
  Sun: { en: 'Lord Shiva / Shri Rama (Surya Narayana)', hi: 'भगवान शिव / श्री राम / सूर्य नारायण', mantra: 'ॐ नमः शिवाय · ॐ घृणि सूर्याय नमः' },
  Moon: { en: 'Shri Krishna / Maa Gauri Parvati', hi: 'श्री कृष्ण / माता गौरी पार्वती', mantra: 'ॐ नमो भगवते वासुदेवाय · ॐ सों सोमाय नमः' },
  Mars: { en: 'Shri Hanuman / Lord Kartikeya (Skanda)', hi: 'श्री हनुमान जी / भगवान कार्तिकेय', mantra: 'ॐ हं हनुमते नमः · हनुमान चालीसा' },
  Mercury: { en: 'Lord Maha Vishnu / Shri Narayana', hi: 'भगवान महाविष्णु / श्री नारायण', mantra: 'ॐ नमो नारायणाय · विष्णु सहस्रनाम' },
  Jupiter: { en: 'Shri Vamana / Dakshinamurthy Shiva / Vishnu', hi: 'भगवान विष्णु / दत्तात्रेय / दक्षिणामूर्ति शिव', mantra: 'ॐ गुरवे नमः · ॐ नमो भगवते वासुदेवाय' },
  Venus: { en: 'Maa Mahalakshmi / Shri Radha-Krishna', hi: 'माँ महालक्ष्मी / श्री राधा-कृष्ण', mantra: 'ॐ श्रीं ह्रीं श्रीं महालक्ष्म्यै नमः' },
  Saturn: { en: 'Shri Kurma / Kaal Bhairav / Hanumanji', hi: 'श्री हनुमान जी / कालभैरव / शनि देव', mantra: 'ॐ शं शनैश्चराय नमः · बजरंग बाण / चालीसा' },
  Rahu: { en: 'Maa Durga (Chandi) / Lord Varaha', hi: 'माँ दुर्गा / कालिका / भगवान वराह', mantra: 'ॐ दुं दुर्गायै नमः' },
  Ketu: { en: 'Lord Ganesha / Matsya Avatara', hi: 'भगवान श्री गणेश / भगवान मत्स्य', mantra: 'ॐ गं गणपतये नमः' },
};

const CAREER_NICHE: Record<
  SevenPlanetId,
  { jobEn: string; jobHi: string; bizEn: string; bizHi: string }
> = {
  Sun: {
    jobEn: 'Government Administration, IAS/PCS, PSU Executive, Medical Directorate & Politics',
    jobHi: 'सरकारी प्रशासन, IAS/राजकीय सेवा, PSU अधिकारी, चिकित्सा एवं राजनीति',
    bizEn: 'Pharmaceuticals, Solar/Power, Defense Supplies, Healthcare Hospitals & Heritage Gold',
    bizHi: 'औषधि/फार्मा, ऊर्जा-सोलर, अस्पताल, स्वर्ण-आभूषण एवं राजकीय ठेके',
  },
  Moon: {
    jobEn: 'Public Relations, Nursing/Counseling, Hospitality Management & Naval/Water Dept',
    jobHi: 'जनसंपर्क, चिकित्सा-सेवा, होटल प्रबंधन, पर्यटन व जल/नौवहन विभाग',
    bizEn: 'Dairy, Food/Beverages, Hotels/Restaurants, Silver/Pearls, Imports-Exports',
    bizHi: 'डेयरी, खाद्य-पेय, होटल-रेस्तरां, वस्त्र, मोती-चाँदी व समुद्री आयात-निर्यात',
  },
  Mars: {
    jobEn: 'Defense/Police/IPS, Mechanical/Civil Engineering, Surgery & Fire/Safety Services',
    jobHi: 'सेना, पुलिस, मैकेनिकल/सिविल इंजीनियरिंग, शल्य चिकित्सा (सर्जरी) व सुरक्षा सेवा',
    bizEn: 'Real Estate/Construction, Gym/Sports, Metallurgy, Hardware, Restaurants & Logistics',
    bizHi: 'रियल एस्टेट, निर्माण, जिम/खेल, हार्डवेयर, सुरक्षा व तकनीकी उद्यम',
  },
  Mercury: {
    jobEn: 'Software/IT, Data Analytics, Chartered Accountancy, Banking, Media & Journalism',
    jobHi: 'सॉफ्टवेयर/IT, डेटा एनालिटिक्स, CA/बैंकिंग, मीडिया, लेखन व शिक्षण',
    bizEn: 'E-Commerce, SaaS/Tech Startups, Trading, Stock Brokerage, Digital Marketing & Printing',
    bizHi: 'ई-कॉमर्स, IT/स्टार्टअप, ट्रेडिंग, शेयर मार्केट, डिजिटल मार्केटिंग व प्रकाशन',
  },
  Jupiter: {
    jobEn: 'Judiciary, University Professor, Financial Advisor, Ministry/Policy & Bank Officer',
    jobHi: 'न्यायिक सेवा, प्रोफेसर, बैंक अधिकारी, कर सलाहकार व शिक्षा/नीति विभाग',
    bizEn: 'EdTech, Legal/Tax Consultancy, Religious Tourism, Publishing & Wealth Advisory',
    bizHi: 'एडटेक, कानून/वित्त परामर्श, प्रकाशन, शिक्षण संस्थान व वेल्थ मैनेजमेंट',
  },
  Venus: {
    jobEn: 'Architecture, Fashion/Media Direction, Foreign Diplomacy & Luxury Hospitality',
    jobHi: 'आर्किटेक्चर, मीडिया/सिनेमा, विदेश मंत्रालय व लग्जरी ब्रांड प्रबंधन',
    bizEn: 'Garments, Jewellery, Cosmetics, Automobiles, Event Wedding Curation & Interior Design',
    bizHi: 'वस्त्र-फैशन, आभूषण, कॉस्मेटिक्स, ऑटोमोबाइल, इवेंट/वेडिंग व इंटीरियर डिज़ाइन',
  },
  Saturn: {
    jobEn: 'Law/Judiciary, Operations Management, Civil Infrastructure, Railways & Mining Dept',
    jobHi: 'कानून, रेलवे, खनन, श्रम-प्रशासन, विनिर्माण व दीर्घकालीन प्रबंधन',
    bizEn: 'Manufacturing, Steel/Iron/Oil, Logistics Transport, Heavy Machinery & Agriculture',
    bizHi: 'फैक्ट्री/विनिर्माण, लोहा-तेल-कोयला, ट्रांसपोर्ट-लॉजिस्टिक्स, मशीनरी व कृषि',
  },
};

export function computeLifeEventsAndLedger(chart: ChartData): LifeEventsAndLedgerReport {
  const ascSign = chart.ascendant.signIndex;
  const byId = new Map(chart.planets.map((p) => [p.id, p]));
  const sun = byId.get('Sun')!;
  const moon = byId.get('Moon')!;
  const mars = byId.get('Mars')!;
  const mercury = byId.get('Mercury')!;
  const jupiter = byId.get('Jupiter')!;
  const venus = byId.get('Venus')!;
  const saturn = byId.get('Saturn')!;
  const rahu = byId.get('Rahu')!;
  const ketu = byId.get('Ketu')!;

  const getLord = (h: number) => byId.get(SIGNS[(ascSign + h - 1) % 12].lord)!;
  const savAt = (h: number) => chart.ashtakavarga.sarva[(ascSign + h - 1) % 12];
  const l1 = getLord(1);
  const l2 = getLord(2);
  const l3 = getLord(3);
  const l4 = getLord(4);
  const l5 = getLord(5);
  const l6 = getLord(6);
  const l7 = getLord(7);
  const l8 = getLord(8);
  const l9 = getLord(9);
  const l10 = getLord(10);
  const l11 = getLord(11);
  const l12 = getLord(12);

  // 1. Paya & Detailed Gandmool Nakshatra Dosha
  const av = computeAvakahadaChakra(chart);
  const moonHouse = moon.rasiHouseNumber;
  const payaTone: PayaAndGandmoolDetail['payaTone'] = [2, 5, 9].includes(moonHouse)
    ? 'auspicious'
    : [1, 6, 11].includes(moonHouse) || [3, 7, 10].includes(moonHouse)
      ? 'mixed'
      : 'challenging';

  const payaMeaningEn = [2, 5, 9].includes(moonHouse)
    ? 'Silver Paya (Rajata) — classically considered the luckiest foot placement; brings family luck, comforts & smoother life support.'
    : [1, 6, 11].includes(moonHouse)
      ? 'Gold Paya (Swarna) — brings high stature and wealth after disciplined effort, though health/mind asks regular balance.'
      : [3, 7, 10].includes(moonHouse)
        ? 'Copper Paya (Tamra) — steady self-made rise through hard work, business skill, and resilience.'
        : 'Iron Paya (Loha) — signifies initial struggles, family responsibility weight, and triumph earned through grit rather than easy luck.';

  const payaMeaningHi = [2, 5, 9].includes(moonHouse)
    ? 'चाँदी का पाया (सर्वश्रेष्ठ) — पारिवारिक भाग्य, सुख-सुविधाएँ और जीवन में सहज सहयोग दिलाता है।'
    : [1, 6, 11].includes(moonHouse)
      ? 'सोने का पाया — परिश्रम व योग्यता से उच्च प्रतिष्ठा व आर्थिक समृद्धि देता है; स्वास्थ्य व अहं संतुलन रखें।'
      : [3, 7, 10].includes(moonHouse)
        ? 'तांबे का पाया — स्व-अर्जित सफलता, व्यापारिक सूझबूझ व निरंतर कर्म से स्थिर प्रगति।'
        : 'लोहे का पाया — प्रारंभिक संघर्ष, जिम्मेदारियों का बोझ और कठोर परिश्रम के बाद पक्की विजय का सूचक।';

  const nakNameEn = chart.panchang.nakshatra.name;
  const nakNameHi = NAK_HI[nakNameEn] ?? nakNameEn;
  const pada = chart.panchang.nakshatra.pada;
  const gmRules = GANDMOOL_PADA_RULES[nakNameEn];
  const isGandmool = Boolean(gmRules);
  const gmRule = gmRules?.[Math.max(0, Math.min(3, pada - 1))];

  const payaAndGandmool: PayaAndGandmoolDetail = {
    payaNameEn: av.payaEn,
    payaNameHi: av.payaHi,
    payaTone,
    payaMeaningEn,
    payaMeaningHi,
    isGandmool,
    nakshatraNameEn: nakNameEn,
    nakshatraNameHi: nakNameHi,
    pada,
    gandmoolSeverity: gmRule?.sev ?? 'None',
    gandmoolReadingEn: isGandmool
      ? `Birth in Gandmool Nakshatra ${nakNameEn} Pada ${pada}. ${gmRule!.en}`
      : `Clear — Birth Nakshatra is ${nakNameEn} (Pada ${pada}), NOT a Gandmool Nakshatra.`,
    gandmoolReadingHi: isGandmool
      ? `जन्म गंडमूल नक्षत्र ${nakNameHi} के ${pada} चरण में हुआ है। ${gmRule!.hi}`
      : `दोष-मुक्त — जन्म नक्षत्र ${nakNameHi} (चरण ${pada}) गंडमूल श्रेणी में नहीं आता।`,
    shantiRemedyEn: isGandmool
      ? 'Perform Vedic Mool Shanti (27th-day Nakshatra recurrence Havan with 27-well/tree water, or later Navagraha + Ganesha Puja + Rahu/Ketu/Mercury Dana).'
      : 'No Gandmool Shanti ritual required.',
    shantiRemedyHi: isGandmool
      ? 'गंडमूल शांति पूजा (जन्म से 27वें दिन उसी नक्षत्र की पुनरावृत्ति पर वैदिक हवन/दान, या बड़े होने पर गणेश-नवग्रह शांति) अत्यंत लाभकारी है।'
      : 'गंडमूल शांति की आवश्यकता नहीं है।',
  };

  // 2. Concrete Accident / Surgery / Incident Assessment
  const malefics = [mars, saturn, rahu, ketu, sun];
  const lagnaAfflicted = malefics.filter((p) => p.rasiHouseNumber === 1 || isAspecting(p, ascSign));
  const h8Occ = chart.planets.filter((p) => p.rasiHouseNumber === 8 && malefics.includes(p));
  const h6Occ = chart.planets.filter((p) => p.rasiHouseNumber === 6 && malefics.includes(p));
  const h4Occ = chart.planets.filter((p) => p.rasiHouseNumber === 4 && [mars, saturn, rahu].includes(p));
  const marsRahuOrSat =
    mars.signIndex === saturn.signIndex ||
    mars.signIndex === rahu.signIndex ||
    mars.signIndex === ketu.signIndex ||
    isAspecting(saturn, mars.signIndex) ||
    isAspecting(mars, saturn.signIndex);

  const accidentScore =
    lagnaAfflicted.length * 10 +
    h8Occ.length * 14 +
    (marsRahuOrSat ? 18 : 0) +
    (h4Occ.length > 0 ? 10 : 0) +
    ([6, 8, 12].includes(l1.rasiHouseNumber) ? 12 : 0) -
    (isAspecting(jupiter, ascSign) ? 14 : 0) -
    (isAspecting(jupiter, moon.signIndex) ? 10 : 0);

  const accLevel: 'High' | 'Moderate' | 'Low' =
    accidentScore >= 36 ? 'High' : accidentScore >= 18 ? 'Moderate' : 'Low';

  const riskPiecesEn: string[] = [];
  const riskPiecesHi: string[] = [];
  if (h4Occ.length > 0 || [4, 8, 12].includes(mars.rasiHouseNumber)) {
    riskPiecesEn.push('Road / Vehicle speed caution (Mars/Saturn/Rahu influence on 4th/8th/Lagna)');
    riskPiecesHi.push('वाहन दुर्घटना / तेज़ गति सावधानी (चौथे/आठवें भाव या लग्न पर मंगल/शनि/राहु प्रभाव)');
  }
  if (marsRahuOrSat || h8Occ.length > 0 || h6Occ.length > 0) {
    riskPiecesEn.push('Surgical cuts, sharp tools, bone/joint fall or sudden fever/inflammation incidents');
    riskPiecesHi.push('सर्जरी / कट-चोट, हड्डी-जोड़ चोट या अचानक बुखार/रक्त-दबाव की घटनाएँ');
  }
  if ([6, 8, 12].includes(moon.rasiHouseNumber) || moon.signIndex === rahu.signIndex) {
    riskPiecesEn.push('Water travel, drug/food allergy or stress-triggered immunity dip');
    riskPiecesHi.push('जल-यात्रा सावधानी, औषधि/एलर्जी व तनाव से स्वास्थ्य गिरावट');
  }
  if (riskPiecesEn.length === 0) {
    riskPiecesEn.push('Low baseline accident vulnerability; only routine caution during 6th/8th/Mars/Rahu Antardashas');
    riskPiecesHi.push('दुर्घटना जोखिम कम है; केवल छठे/आठवें भाव या मंगल-राहु अंतरदशा में सामान्य सतर्कता रखें');
  }

  // Scan actual Vimshottari MD x AD (age 1..80) to pinpoint Concrete Dated Life Events
  const birthYear = parseInt(chart.input.date.slice(0, 4), 10) || 1995;
  const timelineEvents: DatedLifeEvent[] = [];
  const cautionWindowsEn: string[] = [];
  const cautionWindowsHi: string[] = [];

  const getPlanetHouses = (id: string): number[] => {
    const out: number[] = [];
    const p = byId.get(id as NineGrahaId);
    if (p) out.push(p.rasiHouseNumber);
    if (SEVEN_PLANETS.includes(id as SevenPlanetId)) {
      for (let h = 1; h <= 12; h++) {
        if (SIGNS[(ascSign + h - 1) % 12].lord === id) out.push(h);
      }
    }
    return Array.from(new Set(out));
  };

  for (const md of chart.vimshottari) {
    for (const ad of md.children ?? []) {
      const sYr = parseInt(formatLocalDateTimeFromUtc(ad.startMs, chart.offsetMinutesUsed).slice(0, 4), 10);
      const eYr = parseInt(formatLocalDateTimeFromUtc(ad.endMs, chart.offsetMinutesUsed).slice(0, 4), 10);
      const sAge = Math.max(0, sYr - birthYear);
      const eAge = Math.max(sAge + 1, eYr - birthYear);
      if (sAge > 119 || eAge < 4) continue;

      const mdH = getPlanetHouses(md.lord);
      const adH = getPlanetHouses(ad.lord);
      const both = Array.from(new Set([...mdH, ...adH]));

      // 1. Accident / Surgery / Crisis Warning
      if (
        (mdH.includes(8) || mdH.includes(6) || md.lord === 'Mars' || md.lord === 'Rahu') &&
        (adH.includes(8) || adH.includes(12) || ad.lord === 'Saturn' || ad.lord === 'Ketu' || ad.lord === 'Mars') &&
        cautionWindowsEn.length < 3
      ) {
        cautionWindowsEn.push(`${sYr}–${eYr} (${md.lord}/${ad.lord}, Age ${sAge}–${eAge})`);
        cautionWindowsHi.push(`${sYr}–${eYr} (${PLANET_HI[md.lord] ?? md.lord}/${PLANET_HI[ad.lord] ?? ad.lord}, आयु ${sAge}–${eAge})`);
        timelineEvents.push({
          ageRange: `Age ${sAge}–${eAge}`,
          yearRange: `${sYr}–${eYr}`,
          categoryEn: 'Accident / Health Incident Alert',
          categoryHi: 'दुर्घटना / स्वास्थ्य घटना चेतावनी',
          tone: 'negative',
          titleEn: `${md.lord} / ${ad.lord} — Physical Safety, Injury or Surgery Watch`,
          titleHi: `${PLANET_HI[md.lord] ?? md.lord}/${PLANET_HI[ad.lord] ?? ad.lord} — चोट, सर्जरी या आकस्मिक तनाव अवधि`,
          detailEn: `Activation of 6th/8th/12th or fiery-karmic planets: avoid high-speed driving, inspect contracts before signing, and keep health checkups regular.`,
          detailHi: `6/8/12 भाव व मंगल-शनि/राहु-केतु सक्रिय होने से वाहन गति, शल्य-चिकित्सा व स्वास्थ्य व खर्च पर विशेष सतर्कता अनिवार्य है।`,
        });
        continue;
      }

      // 2. Marriage / Partnership Window (age 19..38)
      if (
        sAge >= 19 &&
        sAge <= 38 &&
        (both.includes(7) || both.includes(2) || ad.lord === 'Venus' || ad.lord === l7.id) &&
        timelineEvents.filter((x) => x.categoryEn.includes('Marriage')).length < 2
      ) {
        timelineEvents.push({
          ageRange: `Age ${sAge}–${eAge}`,
          yearRange: `${sYr}–${eYr}`,
          categoryEn: 'Marriage / Key Relationship Event',
          categoryHi: 'विवाह / प्रमुख संबंध घटना',
          tone: 'positive',
          titleEn: `${md.lord} / ${ad.lord} — Prime Marriage or Partnership Milestone`,
          titleHi: `${PLANET_HI[md.lord] ?? md.lord}/${PLANET_HI[ad.lord] ?? ad.lord} — विवाह व दांपत्य आरंभ का प्रबल समय`,
          detailEn: `Direct 7th/2nd house and Venus/Darakaraka activation creates concrete proposals, engagement, marriage, or major domestic expansion.`,
          detailHi: `सप्तम/द्वितीय भाव व शुक्र के सक्रिय होने से सगाई, विवाह या बड़ी साझेदारी की ठोस घटना बनती है।`,
        });
        continue;
      }

      // 3. Career Rise / Wealth Windfall
      if (
        sAge >= 21 &&
        (both.includes(10) || both.includes(11)) &&
        (both.includes(9) || both.includes(5) || both.includes(2)) &&
        timelineEvents.filter((x) => x.categoryEn.includes('Breakthrough')).length < 3
      ) {
        timelineEvents.push({
          ageRange: `Age ${sAge}–${eAge}`,
          yearRange: `${sYr}–${eYr}`,
          categoryEn: 'Career & Wealth Breakthrough',
          categoryHi: 'करियर व धन की बड़ी छलांग',
          tone: 'positive',
          titleEn: `${md.lord} / ${ad.lord} — Promotion, Business Surge or Property Gain`,
          titleHi: `${PLANET_HI[md.lord] ?? md.lord}/${PLANET_HI[ad.lord] ?? ad.lord} — पदोन्नति, व्यापार व संपत्ति लाभ`,
          detailEn: `Kendra-Trikona Dharma-Karma / Dhana link delivers tangible promotion, income jump, awards, or real-estate purchase.`,
          detailHi: `कर्म (10), लाभ (11) व भाग्य (9) का शुभ योग उच्च पद, आय वृद्धि, पुरस्कार या मकान-संपत्ति की घटना देता है।`,
        });
      }
    }
  }

  // Ensure Education & Early event around age 15–22 and Senior pivot if needed
  if (timelineEvents.length < 4) {
    const firstAdultMd = chart.vimshottari.find((m) => {
      const y = parseInt(formatLocalDateTimeFromUtc(m.endMs, chart.offsetMinutesUsed).slice(0, 4), 10);
      return y - birthYear >= 18;
    }) ?? chart.vimshottari[1];
    const fy = parseInt(formatLocalDateTimeFromUtc(firstAdultMd.startMs, chart.offsetMinutesUsed).slice(0, 4), 10);
    timelineEvents.push({
      ageRange: `Age ${Math.max(12, fy - birthYear)}–${Math.max(22, fy - birthYear + 6)}`,
      yearRange: `${Math.max(birthYear + 12, fy)}–${Math.max(birthYear + 22, fy + 6)}`,
      categoryEn: 'Life Direction Shift',
      categoryHi: 'जीवन दिशा परिवर्तन',
      tone: 'mixed',
      titleEn: `${firstAdultMd.lord} Chapter — Education, Relocation & Career Initiation`,
      titleHi: `${PLANET_HI[firstAdultMd.lord] ?? firstAdultMd.lord} दशा — शिक्षा, स्थान परिवर्तन व करियर आरंभ`,
      detailEn: `Shifting Mahadasha brings change of city/campus, competitive exams, and early financial independence lessons.`,
      detailHi: `महादशा परिवर्तन से शहर/शिक्षा संस्थान बदलाव, प्रतियोगी परीक्षा व करियर निर्माण की घटनाएँ घटित होती हैं।`,
    });
  }
  timelineEvents.sort((a, b) => parseInt(a.yearRange, 10) - parseInt(b.yearRange, 10));

  // Build Complete 0–120 Year Paramayus Life Event Chronicle across all Mahadasha x Antardasha spans
  const MS_PER_YEAR = 365.2425 * 86_400_000;
  const birthMs = Number.isFinite(chart.utcMs)
    ? chart.utcMs
    : Date.UTC(birthYear, 0, 1, 12, 0, 0);
  const paramayusEndMs = birthMs + 120 * MS_PER_YEAR;
  const timeline120Years: Life120YearEvent[] = [];

  const getStageLabel = (ageMid: number): { en: string; hi: string } => {
    if (ageMid < 12) return { en: '0–12 Childhood', hi: '0–12 बाल्यावस्था' };
    if (ageMid < 24) return { en: '12–24 Youth & Study', hi: '12–24 शिक्षा व युवावस्था' };
    if (ageMid < 36) return { en: '24–36 Marriage & Rise', hi: '24–36 विवाह व करियर निर्माण' };
    if (ageMid < 48) return { en: '36–48 Midlife Expansion', hi: '36–48 मध्य-जीवन उन्नति' };
    if (ageMid < 60) return { en: '48–60 Peak Stature', hi: '48–60 कर्म-शिखर व परिपक्वता' };
    if (ageMid < 75) return { en: '60–75 Elder Wisdom', hi: '60–75 वरिष्ठ मार्गदर्शन व शांति' };
    if (ageMid < 90) return { en: '75–90 Senior Grace', hi: '75–90 वृद्धावस्था तप व सम्मान' };
    return { en: '90–120 Shatabdi & Paramayus', hi: '90–120 शताब्दी एवं परमायु साधना' };
  };

  const MILESTONE_AGES: Array<{ age: number; en: string; hi: string }> = [
    { age: 12, en: '1st Jupiter Return (Age 12)', hi: 'प्रथम गुरु चक्र (आयु 12)' },
    { age: 18, en: '1st Nodal Return (Age 18–19)', hi: 'प्रथम राहु-केतु चक्र (आयु 18–19)' },
    { age: 29, en: '1st Saturn Return (Age 29–30)', hi: 'प्रथम शनि चक्र (आयु 29–30)' },
    { age: 36, en: 'D9 Maturity · 3rd Jupiter (36)', hi: 'नवांश परिपक्वता · तृतीय गुरु (36)' },
    { age: 48, en: '4th Jupiter Return (Age 48)', hi: 'चतुर्थ गुरु चक्र (आयु 48)' },
    { age: 59, en: 'Shashtiabdapoorthi · 2nd Saturn (60)', hi: 'षष्ट्यब्दपूर्ति · द्वितीय शनि (60)' },
    { age: 70, en: 'Bhimaratha Shanti (Age 70–72)', hi: 'भीमरथ शांति · षष्ठ गुरु (70–72)' },
    { age: 81, en: 'Sahasra Chandra Darshana (81)', hi: 'सहस्र चंद्र दर्शन (आयु 81)' },
    { age: 89, en: '3rd Saturn Return (Age 89–90)', hi: 'तृतीय शनि चक्र (आयु 89–90)' },
    { age: 100, en: 'Shatabhisheka Century (Age 100)', hi: 'शताभिषेक शताब्दी वर्ष (आयु 100)' },
    { age: 112, en: '6th Nodal Cycle (Age 112)', hi: 'षष्ठ राहु-केतु चक्र (आयु 112)' },
    { age: 119.5, en: 'Paramayus Poorna (120 Yrs)', hi: 'पूर्ण वैदिक परमायु समापन (120 वर्ष)' },
  ];

  const usedMilestones = new Set<number>();

  for (const md of chart.vimshottari) {
    for (const ad of md.children ?? []) {
      const ovS = Math.max(ad.startMs, birthMs);
      const ovE = Math.min(ad.endMs, paramayusEndMs);
      if (ovE - ovS < 15 * 86_400_000) continue;

      const startAge = Math.max(0, Math.round(((ovS - birthMs) / MS_PER_YEAR) * 10) / 10);
      const endAge = Math.min(120, Math.round(((ovE - birthMs) / MS_PER_YEAR) * 10) / 10);
      if (endAge <= startAge) continue;

      const sYr = Math.max(birthYear, parseInt(formatLocalDateTimeFromUtc(ovS, chart.offsetMinutesUsed).slice(0, 4), 10));
      const eYr = Math.min(birthYear + 120, Math.max(sYr, parseInt(formatLocalDateTimeFromUtc(ovE, chart.offsetMinutesUsed).slice(0, 4), 10)));

      const mdH = getPlanetHouses(md.lord);
      const adH = getPlanetHouses(ad.lord);
      const both = Array.from(new Set([...mdH, ...adH]));
      const midAge = (startAge + endAge) / 2;
      const stage = getStageLabel(midAge);

      let mEn: string | undefined;
      let mHi: string | undefined;
      for (const ms of MILESTONE_AGES) {
        if (!usedMilestones.has(ms.age) && ms.age >= startAge && ms.age <= endAge) {
          usedMilestones.add(ms.age);
          mEn = ms.en;
          mHi = ms.hi;
          break;
        }
      }

      const mdHi = PLANET_HI[md.lord] ?? md.lord;
      const adHi = PLANET_HI[ad.lord] ?? ad.lord;
      let categoryId: Life120YearEvent['categoryId'] = 'career';
      let categoryEn = 'Career & Karma';
      let categoryHi = 'कर्म व प्रगति';
      let tone: Life120YearEvent['tone'] = 'positive';
      let titleEn = '';
      let titleHi = '';
      let detailEn = '';
      let detailHi = '';

      const dusthanaHit =
        (both.includes(6) || both.includes(8) || both.includes(12)) &&
        !both.includes(9) &&
        !both.includes(5) &&
        ['Mars', 'Saturn', 'Rahu', 'Ketu'].includes(ad.lord);

      if (midAge < 15) {
        if (dusthanaHit) {
          categoryId = 'health';
          categoryEn = 'Early Health & Immunity';
          categoryHi = 'बाल्य स्वास्थ्य व सुरक्षा';
          tone = 'negative';
          titleEn = `${md.lord}/${ad.lord} — Childhood Immunity & Safety Watch`;
          titleHi = `${mdHi}/${adHi} — बाल्यावस्था स्वास्थ्य व चोट सावधानी`;
          detailEn = `Early activation of H${both.join(', H')} calls for steady nutrition, fever/allergy vigilance & family protection.`;
          detailHi = `भाव ${both.join(', ')} सक्रिय होने से बाल्य रोग-प्रतिरोधक क्षमता व माता-पिता के ध्यान की अपेक्षा रहती है।`;
        } else {
          categoryId = 'education';
          categoryEn = 'Childhood & Schooling';
          categoryHi = 'प्रारंभिक शिक्षा व संस्कार';
          tone = 'positive';
          titleEn = `${md.lord}/${ad.lord} — Foundational Learning & Family Bond`;
          titleHi = `${mdHi}/${adHi} — विद्या आरंभ व पारिवारिक पोषण`;
          detailEn = `House ${both.join(', ')} stimulation fosters early curiosity, memory development & parental nurturing.`;
          detailHi = `भाव ${both.join(', ')} के प्रभाव से प्रारंभिक बुद्धि-विकास, संस्कार व गृह-सुख प्राप्त होता है।`;
        }
      } else if (midAge < 25) {
        if (dusthanaHit) {
          categoryId = 'health';
          categoryEn = 'Youth Stress & Vehicle Safety';
          categoryHi = 'युवा सावधानी व स्वास्थ्य';
          tone = 'mixed';
          titleEn = `${md.lord}/${ad.lord} — Competitive Pressure & Physical Caution`;
          titleHi = `${mdHi}/${adHi} — परीक्षा तनाव, यात्रा व वाहन सावधानी`;
          detailEn = `Demanding H${both.join(', H')} tests patience in studies/career launch; steady routines prevent exhaustion or mishaps.`;
          detailHi = `भाव ${both.join(', ')} में संघर्ष से मेहनत बढ़ती है; तेज़ वाहन व अनावश्यक जोश से बचाव लाभकारी है।`;
        } else if (both.includes(5) || both.includes(4) || both.includes(9)) {
          categoryId = 'education';
          categoryEn = 'Degrees, Relocation & Mentors';
          categoryHi = 'उच्च शिक्षा व दिशा निर्माण';
          tone = 'positive';
          titleEn = `${md.lord}/${ad.lord} — Academic Milestone & Skill Foundation`;
          titleHi = `${mdHi}/${adHi} — उच्च विद्या, परीक्षा सफलता व स्थान परिवर्तन`;
          detailEn = `Trikona/Kendra link (H${both.join(', H')}) supports college honors, competitive exams, mentors or campus travel.`;
          detailHi = `त्रिकोण-केंद्र भाव (${both.join(', ')}) के सक्रिय होने से डिग्री, प्रतियोगिता व नए शहर/अवसर मिलते हैं।`;
        } else {
          categoryId = 'career';
          categoryEn = 'First Career Steps';
          categoryHi = 'प्रथम रोजगार व स्व-पहचान';
          tone = 'positive';
          titleEn = `${md.lord}/${ad.lord} — Independent Income Initiation`;
          titleHi = `${mdHi}/${adHi} — कार्य आरंभ व आर्थिक स्वावलंबन`;
          detailEn = `House ${both.join(', ')} initiates first earnings, internships, skill building & adult responsibility.`;
          detailHi = `भाव ${both.join(', ')} से प्रथम नौकरी, व्यवसाय प्रयास व आत्मनिर्भरता का आरंभ होता है।`;
        }
      } else if (midAge < 42) {
        if (dusthanaHit) {
          categoryId = 'health';
          categoryEn = 'Accident / Health / Career Reset';
          categoryHi = 'चोट, शल्य-चिकित्सा या कार्य बदलाव';
          tone = 'negative';
          titleEn = `${md.lord}/${ad.lord} — Physical Vigilance & Karmic Audit`;
          titleHi = `${mdHi}/${adHi} — स्वास्थ्य जांच, वाहन सुरक्षा व कार्य परीक्षा`;
          detailEn = `H6/H8/H12 emphasis demands careful vehicle safety, stress control, loan discipline & timely medical checkups.`;
          detailHi = `6/8/12 भाव व क्रूर ग्रह दशा से चोट/सर्जरी, अनावश्यक कर्ज या नौकरी-बदलाव की संभावना — सावधानी रखें।`;
        } else if ((both.includes(7) || ad.lord === 'Venus' || ad.lord === l7.id) && midAge <= 36) {
          categoryId = 'marriage';
          categoryEn = 'Marriage & Family Growth';
          categoryHi = 'विवाह, दांपत्य व संतान योग';
          tone = 'positive';
          titleEn = `${md.lord}/${ad.lord} — Partnership, Wedding or Domestic Expansion`;
          titleHi = `${mdHi}/${adHi} — विवाह, सगाई व गृहस्थ विस्तार`;
          detailEn = `Active H${both.join(', H')} brings serious proposals, marriage vows, childbirth joy or shared family milestones.`;
          detailHi = `सप्तम व सहायक भाव (${both.join(', ')}) विवाह बंधन, जीवनसाथी सहयोग व संतान सुख के अवसर लाते हैं।`;
        } else if (both.includes(2) || both.includes(11) || both.includes(4)) {
          categoryId = 'finance';
          categoryEn = 'Assets, Property & Income';
          categoryHi = 'संपत्ति, वाहन व धन संचय';
          tone = 'positive';
          titleEn = `${md.lord}/${ad.lord} — Asset Acquisition & Earnings Rise`;
          titleHi = `${mdHi}/${adHi} — आय वृद्धि, भू-संपत्ति या वाहन योग`;
          detailEn = `Dhana/Bhava H${both.join(', H')} favors home purchase, savings jump, family investments & promotions.`;
          detailHi = `धन-लाभ भाव (${both.join(', ')}) से मकान/वाहन क्रय, वेतन वृद्धि व पारिवारिक समृद्धि बनती है।`;
        } else {
          categoryId = 'career';
          categoryEn = 'Career Rise & Authority';
          categoryHi = 'पद-प्रतिष्ठा व कार्य-विस्तार';
          tone = 'positive';
          titleEn = `${md.lord}/${ad.lord} — Professional Promotion or Venture Scale`;
          titleHi = `${mdHi}/${adHi} — पदोन्नति, नए प्रोजेक्ट या व्यवसाय उन्नति`;
          detailEn = `Karmic activation of H${both.join(', H')} elevates title, recognition, foreign travel or leadership duties.`;
          detailHi = `कर्म भाव (${both.join(', ')}) की सक्रियता से कार्यक्षेत्र में पदोन्नति, सम्मान व बड़े उत्तरदायित्व मिलते हैं।`;
        }
      } else if (midAge < 65) {
        if (dusthanaHit) {
          categoryId = 'health';
          categoryEn = 'Metabolic / Cardiac & Stress Care';
          categoryHi = 'रक्तचाप, स्वास्थ्य व विश्राम सावधानी';
          tone = 'negative';
          titleEn = `${md.lord}/${ad.lord} — Midlife Health Maintenance & Expense Control`;
          titleHi = `${mdHi}/${adHi} — हृदय/जोड़ों की जांच व अनावश्यक व्यय नियंत्रण`;
          detailEn = `H${both.join(', H')} caution signals BP, joint/blood checkups, measured litigation avoidance & balanced pacing.`;
          detailHi = `मध्य आयु में स्वास्थ्य जांच, हड्डी/हृदय देखभाल, उधार न देने और मानसिक विश्राम पर ध्यान दें।`;
        } else if (both.includes(10) || both.includes(11) || both.includes(9)) {
          categoryId = 'finance';
          categoryEn = 'Peak Stature & Legacy Assets';
          categoryHi = 'शिखर प्रतिष्ठा व स्थायी संपत्ति';
          tone = 'positive';
          titleEn = `${md.lord}/${ad.lord} — Executive Peak, Wealth Consolidation & Children's Rise`;
          titleHi = `${mdHi}/${adHi} — शीर्ष अधिकार, संचित समृद्धि व संतान उन्नति`;
          detailEn = `Mature Dharma-Karma activation (H${both.join(', H')}) delivers institutional stature, investments maturity & family celebrations.`;
          detailHi = `परिपक्व धर्म-कर्म भाव (${both.join(', ')}) से समाज-सम्मान, निवेश लाभ व संतान विवाह/करियर के शुभ कार्य होते हैं।`;
        } else {
          categoryId = 'marriage';
          categoryEn = 'Domestic Harmony & Family Duties';
          categoryHi = 'पारिवारिक दायित्व व संतुलन';
          tone = 'mixed';
          titleEn = `${md.lord}/${ad.lord} — Household Milestones & Advisory Role`;
          titleHi = `${mdHi}/${adHi} — गृह-निर्माण, बच्चों के संस्कार व पारिवारिक मेलजोल`;
          detailEn = `House ${both.join(', ')} centers on spousal companionship, elders care & steady long-term security.`;
          detailHi = `भाव ${both.join(', ')} जीवनसाथी के संग स्थायित्व व पारिवारिक दायित्वों का सुंदर निर्वहन कराते हैं।`;
        }
      } else {
        // Ages 65 to 120: Senior Legacy, Pilgrimage, Spiritual Ascent & Final Paramayus Chapters
        if (dusthanaHit || both.includes(8) || both.includes(6)) {
          categoryId = 'health';
          categoryEn = 'Senior Vitality & Hospital Protection';
          categoryHi = 'वरिष्ठ स्वास्थ्य संरक्षण व शांति पाठ';
          tone = 'mixed';
          titleEn = `${md.lord}/${ad.lord} — Senior Immunity, Peaceful Living & Mantra Shield`;
          titleHi = `${mdHi}/${adHi} — वरिष्ठ स्वास्थ्य देखभाल, नियमित चिकित्सा व जप`;
          detailEn = `House ${both.join(', ')} calls for calm lifestyle, attentive medical care, gentle diet & Maha Mrityunjaya serenity.`;
          detailHi = `वरिष्ठ आयु में सात्विक आहार, नियमित चिकित्सा देखभाल व महामृत्युंजय मंत्र शांति से आरोग्य रक्षा होती है।`;
        } else if (both.includes(9) || both.includes(12) || both.includes(5)) {
          categoryId = 'spiritual';
          categoryEn = 'Pilgrimage, Tapasya & Moksha';
          categoryHi = 'तीर्थ-यात्रा, आध्यात्म व मोक्ष साधना';
          tone = 'positive';
          titleEn = `${md.lord}/${ad.lord} — Spiritual Maturation, Sacred Travel & Lineage Grace`;
          titleHi = `${mdHi}/${adHi} — तीर्थ, भक्ति, गुरु-कृपा व परमायु शांति`;
          detailEn = `Bhagya/Moksha link (H${both.join(', H')}) blesses scripture contemplation, temple pilgrimages, charity & serene wisdom.`;
          detailHi = `धर्म व मोक्ष भाव (${both.join(', ')}) से भगवद्भक्ति, तीर्थ-यात्रा, दान-पुण्य व वंश-आशीर्वाद की अनुभूति होती है।`;
        } else {
          categoryId = 'finance';
          categoryEn = 'Elder Mentorship & Estate Grace';
          categoryHi = 'कुल-संरक्षण, विरासत व सम्मान';
          tone = 'positive';
          titleEn = `${md.lord}/${ad.lord} — Respected Patriarch/Matriarch & Generational Continuity`;
          titleHi = `${mdHi}/${adHi} — कुल-गौरव, पौत्र सुख व स्थायी विरासत`;
          detailEn = `House ${both.join(', ')} brings dignified guidance to younger generations, peaceful property stewardship & community honor.`;
          detailHi = `भाव ${both.join(', ')} अगली पीढ़ी को मार्गदर्शन, पारिवारिक सम्मान व सुव्यवस्थित विरासत सुख देता है।`;
        }
      }

      timeline120Years.push({
        index: timeline120Years.length + 1,
        startAge,
        endAge,
        ageRange: `Age ${Math.floor(startAge)}–${Math.ceil(endAge)}`,
        yearRange: sYr === eYr ? `${sYr}` : `${sYr}–${eYr}`,
        mahadashaLord: md.lord,
        antardashaLord: ad.lord,
        activatedHouses: both,
        stageEn: stage.en,
        stageHi: stage.hi,
        categoryId,
        categoryEn,
        categoryHi,
        tone,
        titleEn,
        titleHi,
        detailEn,
        detailHi,
        milestoneEn: mEn,
        milestoneHi: mHi,
      });
    }
  }

  // 3. Longevity & Alpayu Check (Classical 3-Pair Method)
  const mod = (sIdx: number) => SIGNS[sIdx].modality; // Movable | Fixed | Dual
  const scorePair = (m1: string, m2: string): 'Long' | 'Medium' | 'Short' => {
    if (m1 === 'Movable' && m2 === 'Movable') return 'Long';
    if ((m1 === 'Fixed' && m2 === 'Dual') || (m1 === 'Dual' && m2 === 'Fixed')) return 'Long';
    if (m1 === 'Dual' && m2 === 'Dual') return 'Medium';
    if ((m1 === 'Movable' && m2 === 'Fixed') || (m1 === 'Fixed' && m2 === 'Movable')) return 'Medium';
    return 'Short';
  };
  const p1 = scorePair(mod(l1.signIndex), mod(l8.signIndex));
  const p2 = scorePair(mod(moon.signIndex), mod(saturn.signIndex));
  const hl = chart.specialPoints.find((s) => s.id === 'HL');
  const p3 = scorePair(mod(ascSign), mod(hl?.signIndex ?? ascSign));

  const longCount = [p1, p2, p3].filter((x) => x === 'Long').length;
  const shortCount = [p1, p2, p3].filter((x) => x === 'Short').length;
  const satStrong = digWeight(saturn.dignity) >= 6 || [3, 6, 8, 10, 11].includes(saturn.rasiHouseNumber);
  const jupProtects = isAspecting(jupiter, ascSign) || jupiter.rasiHouseNumber === 1 || isAspecting(jupiter, l8.signIndex);
  const balarishtaRaw = [6, 8, 12].includes(moon.rasiHouseNumber) && !jupProtects && digWeight(l1.dignity) < 0;

  let lonCatEn = 'Madhyayu (Balanced Life Span · ~60–75 Yrs Classical Range)';
  let lonCatHi = 'मध्यायु (संतुलित आयु — ~60–75+ वर्ष शास्त्रीय मानक)';
  let hasAlpayuCaution = false;
  if (longCount >= 2 || (longCount === 1 && satStrong && jupProtects)) {
    lonCatEn = 'Purnayu / Deerghayu (Strong Longevity Resilience · 75+ Yrs Classical Range)';
    lonCatHi = 'पूर्णायु / दीर्घायु (मजबूत जीवन-शक्ति — 75+ वर्ष शास्त्रीय योग)';
  } else if (shortCount >= 2 && !satStrong && !jupProtects) {
    lonCatEn = 'Alpayu Test / Extra Health & Safety Vigilance Needed';
    lonCatHi = 'अल्पायु संदेह / स्वास्थ्य एवं जीवन-रक्षा पर विशेष सतर्कता अपेक्षित';
    hasAlpayuCaution = true;
  }

  const longevity: LongevityAssessment = {
    categoryEn: lonCatEn,
    categoryHi: lonCatHi,
    pairScoreEn: `Pairs: L1+L8=${p1}, Moon+Saturn=${p2}, Lagna+HL=${p3} | Saturn in H${saturn.rasiHouseNumber} (${saturn.dignity})`,
    pairScoreHi: `त्रि-युग्म: लग्नेश+अष्टमेश=${p1}, चंद्र+शनि=${p2}, लग्न+होरा=${p3} | शनि ${saturn.rasiHouseNumber}वें भाव (${DIGNITY_HI[saturn.dignity]})`,
    hasAlpayuCaution,
    balarishtaStatusEn: balarishtaRaw
      ? 'Mild childhood health sensitivity noted — Jupiter/family care & regular preventive medicine safeguard vitality.'
      : jupProtects
        ? 'Balarishta Bhanga (Protected) — Jupiter/Lagna support shields vitality through early & adult tests.'
        : 'Free of severe Balarishta.',
    balarishtaStatusHi: balarishtaRaw
      ? 'बाल्यावस्था में स्वास्थ्य संवेदनशीलता संभव — उचित चिकित्सा, महामृत्युंजय मंत्र व देखभाल से सुरक्षा रहती है।'
      : jupProtects
        ? 'बालारिष्ट भंग (सुरक्षित) — गुरु व लग्नेश की रक्षा से जीवन शक्ति सुरक्षित रहती है।'
        : 'गंभीर बालारिष्ट योग नहीं है।',
    marakaWarningEn: `Watch Maraka rulers ${l2.id} (H2) & ${l7.id} (H7) during senior years (${cautionWindowsEn[0] || '7th/2nd Antardashas'}) for preventive cardiac/health screening.`,
    marakaWarningHi: `वरिष्ठ वर्षों में मारक ग्रह ${PLANET_HI[l2.id]} (2रा) व ${PLANET_HI[l7.id]} (7वां) तथा अष्टमेश की दशाओं में नियमित स्वास्थ्य जांच कराएँ।`,
    summaryEn: `8th house holds ${savAt(8)} SAV bindus ruled by ${l8.id} (${l8.dignity} in H${l8.rasiHouseNumber}); Lagna Lord ${l1.id} sits in H${l1.rasiHouseNumber}. ${jupProtects ? 'Jupiter casts protective grace over vitality.' : 'Disciplined fitness & accident caution steadily extend vitality.'}`,
    summaryHi: `अष्टम भाव (${savAt(8)} SAV) के स्वामी ${PLANET_HI[l8.id]} ${l8.rasiHouseNumber}वें भाव (${DIGNITY_HI[l8.dignity]}) में हैं और लग्नेश ${PLANET_HI[l1.id]} ${l1.rasiHouseNumber}वें भाव में हैं।`,
    disclaimerEn: 'Ethical Note: Vedic Jyotish assesses karmic vitality tendencies, never deterministic lifespan dates; modern healthcare, diet and driving safety always transform risk.',
    disclaimerHi: 'वैधानिक नोट: ज्योतिष केवल आयु-बल व स्वास्थ्य सावधानियों के संकेत देता है — किसी व्यक्ति की निश्चित आयु भविष्यवाणी नहीं की जा सकती; नियमित चिकित्सा व सावधानी सर्वोपरि हैं।',
  };

  // 4. Main Deity (Ishta Devata via 12th from AK in D9) & Main Governing Planet
  const akBody =
    chart.planets.find((p) => p.charaKaraka === 'AK') ??
    [...chart.planets].filter((p) => SEVEN_PLANETS.includes(p.id as SevenPlanetId)).sort((a, b) => b.degreeInSign - a.degreeInSign)[0];
  const akD9 = chart.divisionalCharts.D9.placements.find((p) => p.id === akBody.id)!;
  const h12FromAkD9Sign = (akD9.signIndex + 11) % 12;
  const h12OccD9 = chart.divisionalCharts.D9.placements.filter(
    (p) => p.id !== 'Asc' && p.signIndex === h12FromAkD9Sign
  );
  const ishtaDeterminant: NineGrahaId =
    h12OccD9.length > 0 && NINE_GRAHAS.includes(h12OccD9[0].id as NineGrahaId)
      ? (h12OccD9[0].id as NineGrahaId)
      : SIGNS[h12FromAkD9Sign].lord;
  const ishtaInfo = ISHTA_DEITY_MAP[ishtaDeterminant];

  const mainPlanetBody = l1;
  const topShad = [...chart.shadbala].sort((a, b) => b.ratio - a.ratio)[0];

  // 5. Comprehensive Specific Questions Ledger (Both Positive & Negative!)
  const fHealthBad = [6, 8, 12].includes(sun.rasiHouseNumber) || [6, 8, 12].includes(l9.rasiHouseNumber) || sun.signIndex === saturn.signIndex || sun.signIndex === rahu.signIndex;
  const mHealthBad = [6, 8, 12].includes(moon.rasiHouseNumber) || [6, 8, 12].includes(l4.rasiHouseNumber) || moon.signIndex === saturn.signIndex || moon.signIndex === rahu.signIndex;

  // Sibling estimate
  const d3Occ = chart.divisionalCharts.D3.placements.filter(
    (p) => p.id !== 'Asc' && [3, 11].includes(p.houseFromVargaLagna)
  );
  const h3Count = chart.planets.filter((p) => p.rasiHouseNumber === 3).length;
  const h11Count = chart.planets.filter((p) => p.rasiHouseNumber === 11).length;
  const sibMetric =
    (mars.dignity !== 'Debilitated' ? 1 : 0) +
    ([6, 8, 12].includes(l3.rasiHouseNumber) ? 0 : 1) +
    Math.min(2, h3Count + h11Count) +
    Math.min(1, d3Occ.length);
  const sibEstEn =
    sibMetric >= 4
      ? '2 to 4+ siblings (active 3rd/11th/D3 support)'
      : sibMetric >= 2
        ? '1 to 2 siblings indicated'
        : '0 to 1 sibling (single-child or separated bond tendency)';
  const sibEstHi =
    sibMetric >= 4
      ? '2 से 4+ भाई-बहन के योग (तृतीय/एकादश/D3 बली)'
      : sibMetric >= 2
        ? '1 से 2 भाई-बहन का संकेत'
        : '0 से 1 भाई-बहन (एकल संतान या दूरी का योग)';
  const sibHealthStrain = [6, 8, 12].includes(l3.rasiHouseNumber) || [6, 8, 12].includes(mars.rasiHouseNumber) || mars.dignity === 'Debilitated';

  // Marriage: Timing, Direction, Spouse Health, Affairs Risk, Marriage Count
  const satSees7OrL7 = saturn.rasiHouseNumber === 7 || isAspecting(saturn, (ascSign + 6) % 12) || saturn.signIndex === l7.signIndex || saturn.signIndex === venus.signIndex;
  const marriageAgeBandEn = satSees7OrL7
    ? 'Moderate to Late (Age ~27–33+ due to Saturnian maturity check)'
    : [1, 5, 7, 11].includes(venus.rasiHouseNumber) && !satSees7OrL7
      ? 'Early to Standard (Age ~22–27 favorable)'
      : 'Standard Adult Window (Age ~25–30)';
  const marriageAgeBandHi = satSees7OrL7
    ? 'मध्यम से विलंबित (शनि प्रभाव से ~27–33+ वर्ष उपयुक्त)'
    : [1, 5, 7, 11].includes(venus.rasiHouseNumber) && !satSees7OrL7
      ? 'शीघ्र से मध्यम (शुक्र अनुग्रह से ~22–27 वर्ष अनुकूल)'
      : 'सामान्य विवाह आयु (~25–30 वर्ष)';

  const dirIdx7 = l7.signIndex % 4;
  const dirIdxVen = venus.signIndex % 4;
  const dirMain = DIRECTION_BY_SIGN[dirIdx7];
  const dirAlt = DIRECTION_BY_SIGN[dirIdxVen];
  const isDistantOrForeign =
    [9, 12].includes(l7.rasiHouseNumber) ||
    [9, 12].includes(venus.rasiHouseNumber) ||
    SIGNS[(ascSign + 6) % 12].modality === 'Movable';

  const spouseHealthBad =
    [6, 8, 12].includes(l7.rasiHouseNumber) ||
    [6, 8, 12].includes(l2.rasiHouseNumber) ||
    [venus, l7].some((b) => b.isCombust || b.dignity === 'Debilitated' || [mars, saturn, rahu].some((m) => m.signIndex === b.signIndex && !isAspecting(jupiter, b.signIndex)));

  // Affairs & Fidelity Risk
  const venRahuOrMars =
    venus.signIndex === rahu.signIndex ||
    venus.signIndex === mars.signIndex ||
    [3, 5, 7, 12].filter((h) => [venus.rasiHouseNumber, mars.rasiHouseNumber, rahu.rasiHouseNumber].includes(h)).length >= 2;
  const dual7 = SIGNS[(ascSign + 6) % 12].modality === 'Dual' && SIGNS[l7.signIndex].modality === 'Dual';
  const jupSaves7 = isAspecting(jupiter, (ascSign + 6) % 12) || isAspecting(jupiter, venus.signIndex) || isAspecting(jupiter, l7.signIndex);
  const affairScore = (venRahuOrMars ? 2 : 0) + (dual7 ? 1 : 0) + (moon.signIndex === venus.signIndex || moon.signIndex === rahu.signIndex ? 1 : 0) - (jupSaves7 ? 2 : 0);

  const affairVerdictEn =
    affairScore >= 3
      ? 'Elevated Extra-Marital Temptation Risk — Venus/Mars/Rahu 3-5-7-12 passion links create strong allure outside routine; conscious boundary & D9 dharma needed.'
      : affairScore >= 1
        ? 'Moderate Temptation / Emotional Wandering Under Stress — avoid secret escapism during Venus/Rahu/Mars Antardashas.'
        : 'Low Risk / Loyal & Devoted Partner Profile — Jupiterian/fixed integrity anchors fidelity.';
  const affairVerdictHi =
    affairScore >= 3
      ? 'विवाहेतर आकर्षण (Affair) का बढ़ा हुआ जोखिम — शुक्र/मंगल/राहु का 3/5/7/12 संबंध भावनात्मक या शारीरिक भटकाव दे सकता है; आत्म-संयम आवश्यक।'
      : affairScore >= 1
        ? 'मध्यम सावधानी — तनाव या शुक्र-राहु दशाओं में बाहरी आकर्षण से बचकर पारदर्शिता रखें।'
        : 'कम जोखिम / निष्ठावान स्वभाव — गुरु या स्थिर राशियों की सुरक्षा दांपत्य में ईमानदारी बनाए रखती है।';

  // Number of Marriages
  const occ7 = chart.planets.filter((p) => p.rasiHouseNumber === 7);
  const h7MaleficCount = occ7.filter((p) => [saturn, mars, rahu, ketu, sun].includes(p)).length;
  const d9L7 = chart.divisionalCharts.D9.placements.find((p) => p.id === l7.id)!;
  const ulPoint = chart.specialPoints.find((s) => s.id === 'UL');
  const h2FromUlMal = ulPoint
    ? chart.planets.filter((p) => hDist(ulPoint.signIndex, p.signIndex) === 2 && [mars, saturn, rahu, ketu].includes(p)).length
    : 0;
  const multiMarrTriggers =
    (occ7.length >= 2 && h7MaleficCount >= 1 ? 1 : 0) +
    (SIGNS[(ascSign + 6) % 12].modality === 'Dual' && [6, 8, 12].includes(l7.rasiHouseNumber) ? 1 : 0) +
    (venus.isCombust || venus.dignity === 'Debilitated' || d9L7.dignity === 'Debilitated' ? 1 : 0) +
    (h2FromUlMal >= 1 && !jupSaves7 ? 1 : 0);

  const marrCountEn =
    multiMarrTriggers >= 3
      ? 'Multiple Marriage / Remarriage Yoga (2 Marriages Possible if first relationship lacks counseling)'
      : multiMarrTriggers === 2
        ? '1 Marriage with Separation / Legal Friction Risk — matching Kundali & patience prevent breakdown'
        : '1 Enduring Marriage (Single Lifelong Partnership Strongly Indicated)';
  const marrCountHi =
    multiMarrTriggers >= 3
      ? 'पुनर्विवाह / एक से अधिक विवाह का योग (यदि पहला संबंध समय पर न संभाला जाए तो द्वितीय विवाह संभव)'
      : multiMarrTriggers === 2
        ? '1 विवाह पर तनाव/अलगाव की परीक्षा — सही कुंडली मिलान और धैर्य से संबंध सुरक्षित रहता है'
        : '1 स्थायी विवाह (एकनिष्ठ व दीर्घकालीन वैवाहिक जीवन प्रबल)';

  // Children: Yoga, Count, Health
  const d7Occ5 = chart.divisionalCharts.D7.placements.filter((p) => p.id !== 'Asc' && p.houseFromVargaLagna === 5);
  const childBlocked =
    [6, 8, 12].includes(l5.rasiHouseNumber) &&
    jupiter.dignity === 'Debilitated' &&
    !isAspecting(jupiter, (ascSign + 4) % 12);
  const childDelayed =
    [saturn, rahu, ketu].includes(l5) ||
    chart.planets.some((p) => p.rasiHouseNumber === 5 && [saturn, rahu, ketu].includes(p));
  const childCountEst =
    childBlocked ? 1 : digWeight(l5.dignity) + digWeight(jupiter.dignity) >= 12 ? 3 : 2;
  const d7Odds = d7Occ5.filter((x) => SIGNS[x.signIndex].gender === 'Odd').length;
  const h5Odd = SIGNS[(ascSign + 4) % 12].gender === 'Odd';
  const childGenderHintEn = h5Odd || d7Odds > 0 ? 'Balanced with male-sign enterprise/yang spark' : 'Balanced with caring feminine/lunar grace';
  const childGenderHintHi = h5Odd || d7Odds > 0 ? 'संतुलित संतान सुख (पुरुष/तेजस्वी राशि प्रभाव सहित)' : 'संतुलित संतान सुख (सौम्य/स्त्री राशि प्रभाव सहित)';
  const childHealthBad = childDelayed || chart.planets.some((p) => p.rasiHouseNumber === 5 && [mars, rahu, saturn].includes(p));

  // Career: Job vs Business, Govt vs Private, Sector, Wealth
  const jobPts = (savAt(6) - 26) + digWeight(l6.dignity) * 0.6 + (saturn.rasiHouseNumber === 10 || saturn.rasiHouseNumber === 6 ? 10 : 0);
  const bizPts = (savAt(7) - 26) + (savAt(11) - 26) * 0.6 + digWeight(l7.dignity) * 0.6 + (mercury.rasiHouseNumber === 7 || mercury.rasiHouseNumber === 10 || mercury.rasiHouseNumber === 11 ? 8 : 0);
  const govtPts =
    (sun.rasiHouseNumber === 10 || sun.rasiHouseNumber === 1 || sun.rasiHouseNumber === 9 || sun.rasiHouseNumber === 11 ? 22 : 6) +
    digWeight(sun.dignity) * 0.8 +
    (isAspecting(sun, (ascSign + 9) % 12) ? 14 : 0) +
    (isAspecting(jupiter, sun.signIndex) || isAspecting(jupiter, (ascSign + 9) % 12) ? 10 : 0) +
    (mars.rasiHouseNumber === 10 || l10.id === 'Sun' || l10.id === 'Mars' ? 12 : 0);
  const pvtPts =
    (saturn.dignity !== 'Debilitated' ? 14 : 4) +
    ([rahu, mercury, venus].some((p) => p.rasiHouseNumber === 10 || p.rasiHouseNumber === 6 || p.rasiHouseNumber === 11) ? 18 : 6);

  const workVerdictEn =
    bizPts - jobPts >= 7
      ? 'Independent Business / Entrepreneurship Strongly Favored'
      : jobPts - bizPts >= 7
        ? 'Structured Job / Executive Service Strongly Favored'
        : 'Hybrid Growth: Start in Skilled Service/Role, Expand into Own Consultancy or Enterprise';
  const workVerdictHi =
    bizPts - jobPts >= 7
      ? 'स्वतंत्र व्यवसाय / उद्यमिता (Business) अत्यंत अनुकूल'
      : jobPts - bizPts >= 7
        ? 'संगठित नौकरी / सेवा क्षेत्र (Job/Service) अत्यंत अनुकूल'
        : 'मिश्रित योग — पहले नौकरी/अनुभव, फिर स्वयं का व्यवसाय या परामर्श अत्यंत सफल';

  const govtVerdictEn =
    govtPts >= 42
      ? `High Government / PSU / Regulatory Authority Potential (${Math.min(92, Math.round(50 + govtPts * 0.5))}% Govt tilt vs Private MNC)`
      : govtPts > pvtPts
        ? `Moderate Government / Public Sector Chances; competitive exams reward 2nd–3rd focused attempt`
        : `Private Corporate / MNC / Independent Sector Stronger (${Math.min(90, Math.round(55 + (pvtPts - govtPts)))}% Private/Tech tilt over rigid govt bureaucracy)`;
  const govtVerdictHi =
    govtPts >= 42
      ? `सरकारी नौकरी / प्रशासन / राजकार्य का प्रबल योग (${Math.min(92, Math.round(50 + govtPts * 0.5))}% सरकारी झुकाव)`
      : govtPts > pvtPts
        ? `सरकारी / अर्ध-सरकारी सेवा के मध्यम-अच्छे योग — प्रतियोगी परीक्षा में निरंतर प्रयास से सफलता संभव`
        : `प्राइवेट कॉर्पोरेट / MNC / टेक / व्यवसाय अधिक बलवान — स्वतंत्रता व तेज़ तरक्की प्राइवेट या अपने काम में अधिक मिलेगी`;

  const sectorInfo = SEVEN_PLANETS.includes(l10.id as SevenPlanetId)
    ? CAREER_NICHE[l10.id as SevenPlanetId]
    : CAREER_NICHE.Mercury;
  const altSectorInfo = SEVEN_PLANETS.includes(topShad.planet) ? CAREER_NICHE[topShad.planet] : CAREER_NICHE.Jupiter;

  // Wealth status
  const dhanaScore =
    55 +
    (savAt(2) + savAt(11) - 56) * 0.9 +
    digWeight(l2.dignity) * 0.6 +
    digWeight(l11.dignity) * 0.6 +
    digWeight(jupiter.dignity) * 0.5 -
    ([6, 8, 12].includes(l2.rasiHouseNumber) && [6, 8, 12].includes(l11.rasiHouseNumber) ? 18 : 0);
  const wealthTierEn =
    dhanaScore >= 75
      ? 'High Prosperity / Abundant Wealth Tier (Strong Dhana Yogas)'
      : dhanaScore >= 58
        ? 'Upper-Middle Growth (Steady Capital & Property Accumulation)'
        : 'Fluctuating Self-Made Finances (Guard Against Debt, Bad Loans & Impulse Spending)';
  const wealthTierHi =
    dhanaScore >= 75
      ? 'उच्च समृद्धि एवं प्रबल धन योग (स्थायी संपत्ति व ऐश्वर्य)'
      : dhanaScore >= 58
        ? 'सुदृढ़ मध्यम-उच्च आर्थिक स्तर (नियमित बचत व संपत्ति निर्माण)'
        : 'संघर्षपूर्ण पर स्व-अर्जित वित्त — कर्ज, उधार व अनावश्यक खर्च से सावधानी आवश्यक';

  const qaLedger: LedgerQaItem[] = [
    {
      id: 'parents',
      titleEn: 'Parents — Nature, Relationship & Mother/Father Health',
      titleHi: 'माता-पिता — स्वभाव, सहयोग एवं दोनों का स्वास्थ्य',
      verdictBadgeEn: fHealthBad || mHealthBad ? 'Health Vigilance Needed' : 'Strong Parental Support',
      verdictBadgeHi: fHealthBad || mHealthBad ? 'स्वास्थ्य देखभाल आवश्यक' : 'सुदृढ़ मातृ-पितृ सुख',
      tone: fHealthBad && mHealthBad ? 'negative' : fHealthBad || mHealthBad ? 'mixed' : 'positive',
      answerEn: `Father (Sun H${sun.rasiHouseNumber}, 9th Lord ${l9.id} H${l9.rasiHouseNumber}) ${fHealthBad ? 'faces cardiac/eye/joint/stress sensitivity or ideological generation gap' : 'shows dignified ethics, resilience and supportive guidance'}. Mother (Moon H${moon.rasiHouseNumber}, 4th Lord ${l4.id} H${l4.rasiHouseNumber}) ${mHealthBad ? 'needs care for blood pressure, respiratory, water/emotional fatigue' : 'brings warm nurturing, longevity and domestic security'}.`,
      answerHi: `पिता (सूर्य ${sun.rasiHouseNumber}वें, नवमेश ${PLANET_HI[l9.id]} ${l9.rasiHouseNumber}वें भाव): ${fHealthBad ? 'हृदय/नेत्र/हड्डी स्वास्थ्य देखभाल या वैचारिक मतभेद संभव।' : 'सम्मानित व्यक्तित्व, अनुशासन व जीवन में सहयोग।'} माता (चंद्र ${moon.rasiHouseNumber}वें, चतुर्थेश ${PLANET_HI[l4.id]} ${l4.rasiHouseNumber}वें भाव): ${mHealthBad ? 'रक्तचाप, कफ या भावनात्मक तनाव से माता की सेवा आवश्यक।' : 'ममतामयी पोषण, गृह-शांति व मातृ आशीर्वाद।'}`,
      positiveEn: `Respecting elders directly unlocks 9th-house fortune (SAV ${savAt(9)}) and 4th-house real estate (SAV ${savAt(4)}).`,
      positiveHi: `माता-पिता की सेवा व सम्मान से भाग्य (SAV ${savAt(9)}) और भूमि-भवन सुख (SAV ${savAt(4)}) तुरंत बढ़ता है।`,
      negativeEn: fHealthBad || mHealthBad ? 'Watch paternal/maternal health checkups closely during Sun/Moon/Saturn/Rahu Antardashas.' : 'Minor generation-gap ego friction possible when Saturn/Sun transit 4th or 9th.',
      negativeHi: fHealthBad || mHealthBad ? 'सूर्य/चंद्र/शनि/राहु की अंतरदशा में माता-पिता के स्वास्थ्य की नियमित जांच कराएँ।' : 'शनि या सूर्य के 4/9 गोचर में विचारों का हल्का अंतर संभव है।',
    },
    {
      id: 'siblings',
      titleEn: 'Siblings — Estimated Count, Bonding & Brothers/Sisters Health',
      titleHi: 'भाई-बहन — संभावित संख्या, संबंध व स्वास्थ्य',
      verdictBadgeEn: sibEstEn.split('(')[0].trim(),
      verdictBadgeHi: sibEstHi.split('(')[0].trim(),
      tone: sibHealthStrain ? 'mixed' : 'positive',
      answerEn: `Astrological Sibling Count Indication: ${sibEstEn}. Assessed from 3rd house (${savAt(3)} SAV), 3rd lord ${l3.id} (${l3.dignity}), Mars (${mars.dignity}), 11th house (elder siblings) & D3 Drekkana. ${sibHealthStrain ? 'Health or emotional distance with one sibling needs conscious warmth.' : 'Supportive sibling bond aiding shared courage.'}`,
      answerHi: `शास्त्रीय भाई-बहन संकेत: ${sibEstHi}। (तृतीय भाव बल ${savAt(3)} SAV, तृतीयेश ${PLANET_HI[l3.id]} ${DIGNITY_HI[l3.dignity]}, मंगल व द्रेष्काण D3 से आकलन)। ${sibHealthStrain ? 'किसी भाई/बहन के स्वास्थ्य, ऋण या दूर प्रवास की चिंता संभव है।' : 'भाई-बहनों से सहयोग व भावनात्मक जुड़ाव बना रहेगा।'}`,
      positiveEn: 'Good teamwork during 3rd-lord and Mars periods; helpful advice/networking from elder brothers/sisters.',
      positiveHi: 'मंगल/तृतीयेश की दशा में भाई-बहनों के सहयोग से साहस, संपत्ति या कार्य में लाभ मिलता है।',
      negativeEn: sibHealthStrain ? 'Beware misunderstandings over shared family property or Mars-Saturn injury caution for siblings.' : 'Occasional sharp debates or geographical separation for work.',
      negativeHi: sibHealthStrain ? 'पैतृक संपत्ति या जल्दबाज़ी में वाद-विवाद एवं भाई-बहन के स्वास्थ्य से सावधानी रखें।' : 'करियर या विवाह के कारण निवास में भौगोलिक दूरी संभव है।',
    },
    {
      id: 'marriage_timing_dir',
      titleEn: 'Marriage — Timing (When?), Spouse Direction (Where?) & Health',
      titleHi: 'विवाह — समय (कब?), दिशा (किधर?), जीवनसाथी व स्वास्थ्य',
      verdictBadgeEn: `${marriageAgeBandEn.split('(')[0].trim()} · ${dirMain.en}`,
      verdictBadgeHi: `${dirMain.hi} / ${dirAlt.hi}`,
      tone: spouseHealthBad ? 'mixed' : 'positive',
      answerEn: `When: ${marriageAgeBandEn}. Where (Spouse Origin Direction): ${dirMain.en} (secondary ${dirAlt.en}), likely ${isDistantOrForeign ? 'another city/state or foreign/cultural distance' : 'within familiar regional circle'}. Partner Profile: 7th Lord ${l7.id} in ${l7.signName} (H${l7.rasiHouseNumber}) + Darakaraka ${byId.get(chart.planets.find((p) => p.charaKaraka === 'DK')?.id ?? 'Venus')?.id ?? 'Venus'}.`,
      answerHi: `कब होगा विवाह: ${marriageAgeBandHi}। दिशा: जन्म स्थान से मुख्यतः ${dirMain.hi} (सहायक ${dirAlt.hi}), ${isDistantOrForeign ? 'अन्य शहर/दूर प्रदेश या अंतर-क्षेत्रीय संबंध का प्रबल संकेत।' : 'परिचित क्षेत्रीय या पारिवारिक दायरे के भीतर।'} जीवनसाथी स्वास्थ्य: ${spouseHealthBad ? 'सप्तमेश/शुक्र पीड़ित होने से जीवनसाथी को हार्मोनल, पाचन, सर्जरी या थकान संबंधी देखभाल की आवश्यकता रहेगी।' : 'सामान्यतः स्वस्थ, सहायक व दीर्घायु जीवनसाथी।'}`,
      positiveEn: `Spouse Health & Stature: ${spouseHealthBad ? 'Recovers well with attentive care; brings practical grounding once D9 strength matures.' : 'Strong mutual vitality, attractive bearing & supportive in-law dignity.'}`,
      positiveHi: `सकारात्मक पक्ष: जीवनसाथी बुद्धिमान, पारिवारिक कर्तव्यनिष्ठ व विवाह उपरांत भाग्यवृद्धि में सहायक होता है।`,
      negativeEn: spouseHealthBad ? 'Wife/Husband health check: 7th/2nd house stress indicates periodic hormonal, stress or surgical care for spouse — match charts thoroughly.' : 'Minor temper or work-schedule friction around 7th house transits.',
      negativeHi: spouseHealthBad ? 'नकारात्मक/सावधानी पक्ष: जीवनसाथी के स्वास्थ्य (उदर/हार्मोन/अस्पताल खर्च) और वैचारिक मतभेद पर विशेष ध्यान रखें।' : 'अत्यधिक कार्यव्यस्तता से दांपत्य संवाद में कमी न आने दें।',
    },
    {
      id: 'affairs_count',
      titleEn: 'Marriage Count (How Many?) & Extra-Marital Affairs Risk',
      titleHi: 'विवाह संख्या (कितने विवाह?) व विवाहेतर संबंध (Affair) जांच',
      verdictBadgeEn: `${marrCountEn.split('(')[0].trim()} · ${affairVerdictEn.split('—')[0].trim()}`,
      verdictBadgeHi: `${multiMarrTriggers >= 3 ? 'द्वितीय विवाह योग' : multiMarrTriggers === 2 ? '1 विवाह (तनाव सावधानी)' : '1 स्थायी विवाह'}`,
      tone: multiMarrTriggers >= 2 || affairScore >= 3 ? 'negative' : affairScore >= 1 ? 'mixed' : 'positive',
      answerEn: `Marriage Count Verdict: ${marrCountEn}. Extra-Marital Fidelity Check: ${affairVerdictEn}`,
      answerHi: `विवाह संख्या फल: ${marrCountHi}। विवाहेतर संबंध जांच: ${affairVerdictHi}`,
      positiveEn: jupSaves7 ? 'Jupiter’s gaze on 7th/Venus acts as a strong dharmic shield preserving marriage stability.' : 'Conscious loyalty & open communication keep partnership resilient.',
      positiveHi: jupSaves7 ? 'गुरु की शुभ दृष्टि सप्तम/शुक्र की रक्षा करती है — समझदारी से विवाह सुरक्षित रहता है।' : 'ईमानदार संवाद व संयम से वैवाहिक बंधन मजबूत रहता है।',
      negativeEn: 'Where Mars+Venus+Rahu, dual 7th signs, or afflicted 2nd-from-UL occur without Guru aspect, ego clashes, secrecy or third-party temptation can trigger separation or second marriage.',
      negativeHi: 'यदि सप्तमेश, शुक्र व उपपद लग्न पीड़ित हों तो तीसरे व्यक्ति का आकर्षण, अहं टकराव या कानूनी अलगाव जैसी स्थितियाँ उत्पन्न हो सकती हैं।',
    },
    {
      id: 'children',
      titleEn: 'Children — Child Yoga, Estimated Count & Children Health',
      titleHi: 'संतान — संतान योग, संभावित संख्या व संतान स्वास्थ्य',
      verdictBadgeEn: `${childBlocked ? 'Tested / Remedy Needed' : childDelayed ? 'Delayed / Careful' : 'Present'} · ~${childCountEst} Children`,
      verdictBadgeHi: `${childBlocked ? 'बाधा / उपाय अपेक्षित' : childDelayed ? 'विलंबित पर सुखद' : 'शुभ संतान योग'} · ~${childCountEst} संतान`,
      tone: childBlocked ? 'negative' : childDelayed ? 'mixed' : 'positive',
      answerEn: `Child Yoga: ${childBlocked ? 'Putra-Dosha Obstacles (needs medical + Jupiter Santan-Gopal remedy)' : childDelayed ? 'Delayed/Measured Child Yoga (Saturn/Rahu in 5th stabilizes later)' : 'Clear Progeny Yoga Present'}. Classical Count Indication: ~${childCountEst} child${childCountEst > 1 ? 'ren' : ''} (${childGenderHintEn}).`,
      answerHi: `संतान योग: ${childBlocked ? 'पंचम भाव/गुरु कमजोर होने से संतान में बाधा — चिकित्सा व संतान-गोपाल उपाय करें।' : childDelayed ? 'शनि/राहु प्रभाव से संतान प्राप्ति में कुछ विलंब, पर बाद में स्थायी सुख।' : 'प्रबल व शुभ संतान योग उपस्थित।'} संभावित संख्या: ~${childCountEst} संतान (${childGenderHintHi})।`,
      positiveEn: `5th House carries ${savAt(5)} SAV bindus & D7 Saptamsa supports proud children rising in education/status.`,
      positiveHi: `पंचम भाव में ${savAt(5)} SAV बिंदु व सप्तांश D7 संतान की शिक्षा एवं उन्नति दर्शाते हैं।`,
      negativeEn: childHealthBad ? 'Children’s Health Watch: Mars/Saturn/Rahu link on 5th requires careful pediatric immunity & teenage accident caution.' : 'Minor educational pressure or distance due to higher studies/abroad.',
      negativeHi: childHealthBad ? 'संतान स्वास्थ्य चेतावनी: पंचम पर मंगल/शनि/राहु होने से बच्चों के स्वास्थ्य, चोट या जिद्दी स्वभाव पर ध्यान दें।' : 'उच्च शिक्षा या करियर से संतान का घर से दूर जाना संभव।',
    },
    {
      id: 'profession_wealth',
      titleEn: 'Profession, Job (Govt vs Private) vs Business & Wealth Status',
      titleHi: 'व्यवसाय / नौकरी (सरकारी बनाम प्राइवेट), कार्यक्षेत्र व धन स्थिति',
      verdictBadgeEn: `${bizPts - jobPts >= 7 ? 'Business' : jobPts - bizPts >= 7 ? 'Job' : 'Hybrid'} · ${Math.round(dhanaScore)}/100 Wealth`,
      verdictBadgeHi: `${govtPts >= 42 ? 'सरकारी/प्रशासन योग' : bizPts - jobPts >= 7 ? 'व्यापार प्रधान' : 'प्राइवेट/मिश्रित'}`,
      tone: dhanaScore >= 60 ? 'positive' : 'mixed',
      answerEn: `Job vs Business: ${workVerdictEn}. Govt vs Private: ${govtVerdictEn}. Best Professions: ${sectorInfo.jobEn} | ${sectorInfo.bizEn} (Also ${altSectorInfo.bizEn}). Wealth Tier: ${wealthTierEn}.`,
      answerHi: `नौकरी बनाम व्यापार: ${workVerdictHi}। सरकारी बनाम प्राइवेट: ${govtVerdictHi}। उपयुक्त कार्यक्षेत्र: ${sectorInfo.jobHi} / ${sectorInfo.bizHi}। धन स्थिति: ${wealthTierHi}।`,
      positiveEn: `2nd/11th/10th houses show strong earning potential when you specialize in ${l10.id}/${topShad.planet} industries.`,
      positiveHi: `${PLANET_HI[l10.id]} व ${PLANET_HI[topShad.planet]} के क्षेत्रों में विशेषज्ञता लेने से धन, पद व अचल संपत्ति में श्रेष्ठ वृद्धि होती है।`,
      negativeEn: dhanaScore < 60 ? 'Beware sudden speculative/crypto losses, trusted partner embezzlement, or loan over-leverage.' : 'Avoid office politics (6th lord) and impulsive luxury debt in Rahu/Venus sub-periods.',
      negativeHi: dhanaScore < 60 ? 'सावधानी: सट्टा/शेयर में बिना जांच निवेश, साझेदार द्वारा धोखा या भारी कर्ज लेने से बचें।' : 'कार्यस्थल राजनीति व अनावश्यक दिखावे के खर्च से धन बचाएँ।',
    },
  ];

  return {
    payaAndGandmool,
    accidentProfile: {
      riskLevelEn: accLevel === 'High' ? 'Elevated Risk — Active Safety Discipline Required' : accLevel === 'Moderate' ? 'Moderate Episodic Caution' : 'Low Baseline Risk',
      riskLevelHi: accLevel === 'High' ? 'उच्च सावधानी आवश्यक — दुर्घटना/सर्जरी सुरक्षा रखें' : accLevel === 'Moderate' ? 'मध्यम सतर्कता (विशेष दशाओं में सावधानी)' : 'कम जोखिम (सुरक्षित योग)',
      tone: accLevel === 'High' ? 'negative' : accLevel === 'Moderate' ? 'mixed' : 'positive',
      riskTypesEn: riskPiecesEn.join('; ') + '.',
      riskTypesHi: riskPiecesHi.join('; ') + '।',
      cautionWindowsEn: cautionWindowsEn.length ? cautionWindowsEn.join(' · ') : 'Watch Saturn / Rahu / 8th-Lord Antardashas during stressful Gochar.',
      cautionWindowsHi: cautionWindowsHi.length ? cautionWindowsHi.join(' · ') : 'शनि, राहु, मंगल या अष्टमेश की अंतरदशाओं में वाहन व स्वास्थ्य सावधानी रखें।',
      precautionEn: 'Drive calmly at night, avoid reckless speeds or anger arguments, keep health/vehicle insurance updated, and recite Hanuman Chalisa / Maha Mrityunjaya Mantra.',
      precautionHi: 'रात्रि में तेज़ वाहन न चलाएँ, क्रोध/अग्नि/बिजली से सावधान रहें, नियमित स्वास्थ्य जांच कराएँ व हनुमान चालीसा / महामृत्युंजय मंत्र जपें।',
    },
    timelineEvents,
    timeline120Years,
    longevity,
    deityAndMainPlanet: {
      ishtaDevataEn: ishtaInfo.en,
      ishtaDevataHi: ishtaInfo.hi,
      ishtaBasisEn: `12th sign from Atmakaraka ${akBody.id} in Navamsa (D9 ${SIGNS[akD9.signIndex].name} → 12th sign ${SIGNS[h12FromAkD9Sign].name}, ruled/occupied by ${ishtaDeterminant}).`,
      ishtaBasisHi: `नवांश कुंडली (D9) में आत्मकारक ${PLANET_HI[akBody.id]} (${SIGN_HI[akD9.signIndex]}) से 12वें भाव (${SIGN_HI[h12FromAkD9Sign]}) के ग्रह/स्वामी ${PLANET_HI[ishtaDeterminant]} द्वारा निर्धारित इष्टदेव।`,
      ishtaMantra: ishtaInfo.mantra,
      mainPlanetEn: `${mainPlanetBody.id} (Lagna Lord, H${mainPlanetBody.rasiHouseNumber} in ${mainPlanetBody.signName}) & ${akBody.id} (Atmakaraka Soul Ruler)`,
      mainPlanetHi: `${PLANET_HI[mainPlanetBody.id]} (लग्नेश — ${mainPlanetBody.rasiHouseNumber}वें भाव ${SIGN_HI[mainPlanetBody.signIndex]}) एवं आत्मकारक ${PLANET_HI[akBody.id]}`,
      supportingKingsEn: `Moon Rashi Lord: ${SIGNS[moon.signIndex].lord} | Strongest Shadbala Planet: ${topShad.planet} (${topShad.ratio.toFixed(2)}x)`,
      supportingKingsHi: `राशि स्वामी: ${PLANET_HI[SIGNS[moon.signIndex].lord]} | षड्बल में सर्वाधिक बली: ${PLANET_HI[topShad.planet]} (${topShad.ratio.toFixed(2)}x)`,
    },
    qaLedger,
  };
}
