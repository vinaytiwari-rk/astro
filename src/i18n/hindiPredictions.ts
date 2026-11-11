import { SIGNS } from '../astro/constants';
import { getBhavesha144Entry } from '../astro/predictions/bhavesha144';
import type {
  AdvancedDashaBundle,
  SudarshanaWheelResult,
} from '../astro/advancedDashas';
import type { AvasthaUpagrahaReport } from '../astro/avasthasUpagrahas';
import type { BtrSnapshot } from '../astro/btr';
import type { MuhurtaCandidate, MultiYearCalendarReport } from '../astro/muhurtaCalendar';
import type { DashaPredictionDetail, PrashnaAnalysis } from '../astro/predictions/dashaPrashna';
import type { FamilyChildhoodReport, FamilyMemberReading, KundaliDoshaReport } from '../astro/predictions/familyDoshas';
import type { DeepGocharReport } from '../astro/predictions/gocharDeep';
import type { SpecializedAstrologySuite } from '../astro/predictions/specialized';
import type {
  DashaPrediction,
  DivisionalPredictionItem,
  HouseLordPrediction,
  LifeDomainPrediction,
  PlanetHousePrediction,
  PredictionReport,
  RemedyItem,
  TransitForecast,
} from '../astro/predictions/types';
import type {
  ChartData,
  DivisionalChartId,
  MatchMakingResult,
  NineGrahaId,
  SevenPlanetId,
  YogaResult,
} from '../astro/types';
import {
  ATMAKARAKA_HI,
  DASA_PLANET_ARCHETYPE_HI,
  DIRECTION_HI,
  GRAHA_IN_HOUSE_HI,
  LAGNA_HI_PROFILES,
  NAKSHATRA_HI_READINGS,
  REMEDY_HI,
  TARA_HI,
} from './hindiKb';
import {
  DIGNITY_HI,
  MISC_TERMS_HI,
  PLANET_NAMES_I18N,
  SIGN_NAMES_I18N,
  trSign,
  trTerm,
  trVarga,
  type AppLanguage,
} from './translations';

export const HI_EXTRA_BADGES: Record<string, string> = {
  ...MISC_TERMS_HI,
  High: 'उच्च (प्रबल)',
  Moderate: 'मध्यम',
  Mild: 'सामान्य / अल्प',
  None: 'शून्य (नहीं)',
  Neutral: 'सम / तटस्थ',
  Present: 'उपस्थित',
  'Mitigated (Cancelled)': 'भंग / निरस्त',
  Clear: 'दोष मुक्त',
  Asymmetric: 'असमान (अधिक अंतर)',
  'Moderate Difference': 'मध्यम अंतर',
  'Shubha (Highly Auspicious)': 'शुभ (अत्यंत उत्तम)',
  'Magnetic & Passionate': 'अत्यंत प्रबल व चुंबकीय आकर्षण',
  'Harmonious & Affectionate': 'मधुर, स्नेहपूर्ण व सामंजस्यपूर्ण',
  'Complementary (Needs Communication)': 'पूरक (स्पष्ट संवाद लाभकारी)',
  'Different Rhythms': 'भिन्न स्वभाव (धैर्य व समझ अपेक्षित)',
  'Leadership / Independent Enterprise': 'स्वतंत्र उद्यम व नेतृत्व',
  'Structured Service / Institutional': 'सुव्यवस्थित सेवा / सरकारी व संस्थागत कार्य',
  'Balanced Hybrid (Advisory & Enterprise)': 'मिश्रित (परामर्श, प्रबंधन व व्यवसाय)',
  Raja: 'राजयोग',
  Dhana: 'धन योग',
  Mahapurusha: 'पंच महापुरुष योग',
  Lunar: 'चंद्र योग',
  Solar: 'सूर्य योग',
  Dosha: 'दोष / अरिष्ट योग',
  Special: 'विशेष योग',
  'Solar Eclipse': 'सूर्य ग्रहण',
  'Lunar Eclipse': 'चंद्र ग्रहण',
  Total: 'पूर्ण ग्रहण',
  Partial: 'आंशिक ग्रहण',
  Annular: 'कंकणाकृति ग्रहण',
  Penumbral: 'उपच्छाया ग्रहण',
  'Jagrat (Awake)': 'जाग्रत अवस्था (पूर्ण फल)',
  'Swapna (Dreaming)': 'स्वप्न अवस्था (मध्यम फल)',
  'Sushupti (Asleep)': 'सुषुप्ति अवस्था (अल्प फल)',
  'Strong & Auspicious': 'अत्यंत शुभ व बलवान',
  'Mixed / Kakshya Supported': 'मिश्रित / कक्ष्या बल समर्थित',
  Testing: 'परीक्षात्मक (सावधानी)',
  Strong: 'सबल',
  Balanced: 'संतुलित',
  'Needs Care': 'ध्यान अपेक्षित',
  'Attention Needed': 'ध्यान अपेक्षित',
};

export function trBadge(val: string, lang: AppLanguage): string {
  if (lang === 'en') return val;
  return HI_EXTRA_BADGES[val] ?? trTerm(val, lang);
}

const SIGN_NAME_TO_INDEX: Record<string, number> = {
  Aries: 0, Mesha: 0, Taurus: 1, Vrishabha: 1, Gemini: 2, Mithuna: 2,
  Cancer: 3, Karka: 3, Leo: 4, Simha: 4, Virgo: 5, Kanya: 5,
  Libra: 6, Tula: 6, Scorpio: 7, Vrishchika: 7, Sagittarius: 8, Dhanu: 8,
  Capricorn: 9, Makara: 9, Aquarius: 10, Kumbha: 10, Pisces: 11, Meena: 11,
};

export function signToHi(nameOrIdx: string | number): string {
  if (typeof nameOrIdx === 'number') return trSign(nameOrIdx, 'hi');
  const trimmed = nameOrIdx.trim();
  if (SIGN_NAME_TO_INDEX[trimmed] !== undefined) return trSign(SIGN_NAME_TO_INDEX[trimmed], 'hi');
  for (const [k, idx] of Object.entries(SIGN_NAME_TO_INDEX)) {
    if (trimmed.startsWith(k) || trimmed.includes(`(${k})`)) return trSign(idx, 'hi');
  }
  return trimmed;
}

export function planetToHi(id: string): string {
  return PLANET_NAMES_I18N.hi[id] ?? trTerm(id, 'hi');
}

export function replaceEnTermsWithHi(text: string): string {
  let out = text;
  const replacements: Array<[RegExp, string]> = [
    [/\bHouses?\s+(\d+)/gi, 'भाव $1'],
    [/\bH(\d+)\b/g, 'भाव $1'],
    [/\bAries\b|\bMesha\b/g, 'मेष'],
    [/\bTaurus\b|\bVrishabha\b/g, 'वृषभ'],
    [/\bGemini\b|\bMithuna\b/g, 'मिथुन'],
    [/\bCancer\b|\bKarka\b/g, 'कर्क'],
    [/\bLeo\b|\bSimha\b/g, 'सिंह'],
    [/\bVirgo\b|\bKanya\b/g, 'कन्या'],
    [/\bLibra\b|\bTula\b/g, 'तुला'],
    [/\bScorpio\b|\bVrishchika\b/g, 'वृश्चिक'],
    [/\bSagittarius\b|\bDhanu\b/g, 'धनु'],
    [/\bCapricorn\b|\bMakara\b/g, 'मकर'],
    [/\bAquarius\b|\bKumbha\b/g, 'कुंभ'],
    [/\bPisces\b|\bMeena\b/g, 'मीन'],
    [/\bAscendant\b|\bLagna\b/g, 'लग्न'],
    [/\bSun\b/g, 'सूर्य'],
    [/\bMoon\b/g, 'चंद्र'],
    [/\bMars\b/g, 'मंगल'],
    [/\bMercury\b/g, 'बुध'],
    [/\bJupiter\b/g, 'गुरु'],
    [/\bVenus\b/g, 'शुक्र'],
    [/\bSaturn\b/g, 'शनि'],
    [/\bRahu\b/g, 'राहु'],
    [/\bKetu\b/g, 'केतु'],
    [/\bExalted\b/g, 'उच्च'],
    [/\bMoolatrikona\b/g, 'मूलत्रिकोण'],
    [/\bOwn Sign\b/g, 'स्वराशि'],
    [/\bGreat Friend\b/g, 'अति मित्र'],
    [/\bFriend\b/g, 'मित्र'],
    [/\bNeutral\b/g, 'सम'],
    [/\bGreat Enemy\b/g, 'अति शत्रु'],
    [/\bEnemy\b/g, 'शत्रु'],
    [/\bDebilitated\b/g, 'नीच'],
  ];
  for (const [rx, rep] of replacements) {
    out = out.replace(rx, rep);
  }
  return out;
}

const HOUSE_DOMAIN_HI: Record<number, string> = {
  1: 'तन, स्वास्थ्य, आत्मबल एवं व्यक्तित्व',
  2: 'धन, वाणी, कुटुंब एवं संचय',
  3: 'पराक्रम, भाई-बहन, लेखन एवं संवाद',
  4: 'माता, सुख, गृह, वाहन एवं शिक्षा आधार',
  5: 'बुद्धि, संतान, मंत्र, प्रेम एवं रचनात्मकता',
  6: 'रोग, ऋण, शत्रु, सेवा एवं प्रतिस्पर्धा',
  7: 'विवाह, जीवनसाथी, साझेदारी एवं जनसंपर्क',
  8: 'आयु, गूढ़ शोध, पैतृक धन एवं आकस्मिक परिवर्तन',
  9: 'भाग्य, धर्म, पिता, गुरु एवं उच्च शिक्षा',
  10: 'कर्म, करियर, पद-प्रतिष्ठा एवं प्रशासन',
  11: 'आय, लाभ, बड़े भाई-बहन एवं मनोकामना पूर्ति',
  12: 'व्यय, विदेश, शयन सुख, दान एवं मोक्ष',
};

const SOURCE_BOOKS_HI = [
  'बृहत् पाराशर होरा शास्त्र (BPHS)',
  'फलदीपिका (मंत्रेश्वर)',
  'सारावली एवं भृगु नंदी नाड़ी',
  'लघु पाराशरी एवं नाड़ी ग्रंथ परंपरा',
];

function houseListHi(hs: number[]): string {
  if (!hs.length) return 'कोई नहीं';
  return hs.map((h) => `${h}वें भाव`).join(', ');
}

function localizeDomainsHi(domains: LifeDomainPrediction[], chart: ChartData): LifeDomainPrediction[] {
  const byId = new Map(chart.planets.map((p) => [p.id, p]));
  const ascHi = trSign(chart.ascendant.signIndex, 'hi');
  const titleMap: Record<LifeDomainPrediction['id'], { title: string; focus: string }> = {
    personality: { title: 'व्यक्तित्व, स्वास्थ्य एवं आत्मबल', focus: 'तनु भाव (लग्न · सूर्य · चंद्र)' },
    wealth: { title: 'धन, संपत्ति एवं वित्त योग', focus: 'धन व लाभ भाव (2 व 11 · गुरु)' },
    career: { title: 'करियर, कर्म एवं प्रतिष्ठा', focus: 'कर्म भाव (दशम · दशमांश D10)' },
    marriage: { title: 'विवाह, दांपत्य एवं साझेदारी', focus: 'कलत्र भाव (सप्तम · शुक्र · नवांश D9)' },
    education: { title: 'शिक्षा, बुद्धि एवं संतान', focus: 'विद्या व पुत्र भाव (पंचम · बुध · D24)' },
    health: { title: 'रोग प्रतिरोधक शक्ति एवं आयु', focus: 'षष्ठ व अष्टम भाव (मंगल · शनि)' },
    fortune: { title: 'भाग्य, धर्म एवं विदेश यात्रा', focus: 'भाग्य भाव (नवम · द्वादश · गुरु)' },
    spirituality: { title: 'आध्यात्म, साधना एवं मोक्ष', focus: 'द्वादश भाव (केतु · गुरु · आत्मकारक)' },
  };

  const ascLord = byId.get(SIGNS[chart.ascendant.signIndex].lord)!;
  const d10Lagna = trSign(chart.divisionalCharts.D10.lagnaSignIndex, 'hi');
  const d9Lagna = trSign(chart.divisionalCharts.D9.lagnaSignIndex, 'hi');
  const jup = byId.get('Jupiter')!;
  const ven = byId.get('Venus')!;
  const mer = byId.get('Mercury')!;
  const sat = byId.get( 'Saturn')!;

  return domains.map((d) => {
    const meta = titleMap[d.id];
    const ratioNote = `${d.rating}/100 अंक (${trBadge(d.verdict, 'hi')})`;
    let summary = '';
    let details: string[] = [];

    if (d.id === 'personality') {
      summary = `${ascHi} लग्न तथा लग्नेश ${planetToHi(ascLord.id)} (${ascLord.rasiHouseNumber}वें भाव, ${DIGNITY_HI[ascLord.dignity]}) के प्रभाव से आपका समग्र व्यक्तित्व स्कोर ${ratioNote} है।`;
      details = [
        `लग्नेश ${planetToHi(ascLord.id)} ${trSign(ascLord.signIndex, 'hi')} राशि के ${ascLord.rasiHouseNumber}वें भाव में हैं, जो आपके जीवन की मुख्य दिशा तय करते हैं।`,
        `जन्म नक्षत्र ${trTerm(chart.panchang.nakshatra.name, 'hi')} (चरण ${chart.panchang.nakshatra.pada}) मानसिक स्वभाव व आकर्षण शक्ति को निखारता है।`,
        `षड्बल अनुपात एवं चंद्र की स्थिति दर्शाती है कि अनुशासित दिनचर्या से आपका आत्मबल और प्रखर होगा।`,
      ];
    } else if (d.id === 'wealth') {
      const l2 = SIGNS[(chart.ascendant.signIndex + 1) % 12].lord;
      const l11 = SIGNS[(chart.ascendant.signIndex + 10) % 12].lord;
      summary = `द्वितीयेश ${planetToHi(l2)}, एकादशेश ${planetToHi(l11)} और धनकारक गुरु (${jup.rasiHouseNumber}वें भाव) के योग से धन भाव स्कोर ${ratioNote} है।`;
      details = [
        `द्वितीय भाव के स्वामी ${planetToHi(l2)} संचित धन व पारिवारिक संपत्ति की स्थिति दर्शाते हैं, जबकि एकादशेश ${planetToHi(l11)} नियमित आय के स्रोत बताते हैं।`,
        `होरा कुंडली (D2) और गुरु (${trSign(jup.signIndex, 'hi')}) के प्रभाव से दीर्घकालिक बचत व संपत्ति निर्माण के संकेत मिलते हैं।`,
        `बड़े निवेश शुभ दशा व गुरु/एकादश भाव में उच्च सर्वाष्टकवर्ग (SAV) बिंदुओं के समय करना विशेष फलदायी होगा।`,
      ];
    } else if (d.id === 'career') {
      const l10 = SIGNS[(chart.ascendant.signIndex + 9) % 12].lord;
      summary = `दशमेश ${planetToHi(l10)} तथा दशमांश लग्न (${d10Lagna}) के समन्वय से करियर सामर्थ्य ${ratioNote} है।`;
      details = [
        `दशम भाव कर्म व प्रतिष्ठा का है; दशमेश ${planetToHi(l10)} और कर्मकारक शनि (${sat.rasiHouseNumber}वें भाव) कार्यक्षेत्र की दिशा तय करते हैं।`,
        `दशमांश कुंडली (D10) का विश्लेषण व्यवसायिक उन्नति, पदोन्नति और स्वतंत्र बनाम नौकरी के योग स्पष्ट करता है।`,
        `गोचर में शनि व गुरु के अनुकूल होने पर करियर में स्थायी छलांग देखने को मिलती है।`,
      ];
    } else if (d.id === 'marriage') {
      const l7 = SIGNS[(chart.ascendant.signIndex + 6) % 12].lord;
      summary = `सप्तमेश ${planetToHi(l7)}, शुक्र (${ven.rasiHouseNumber}वें भाव) और नवांश लग्न (${d9Lagna}) के आधार पर दांपत्य योग ${ratioNote} है।`;
      details = [
        `नवांश कुंडली (D9) विवाह और जीवनसाथी के वास्तविक स्वभाव का मुख्य दर्पण है।`,
        `शुक्र (${trSign(ven.signIndex, 'hi')}, ${DIGNITY_HI[ven.dignity]}) दांपत्य में स्नेह, समझ और भौतिक सुख दर्शाते हैं।`,
        `विवाह से पहले अष्टकूट गुण मिलान के साथ-साथ पूर्ण कुंडली व पापांश साम्य (Papa-Samyam) मिलान अनिवार्य रूप से करना चाहिए।`,
      ];
    } else if (d.id === 'education') {
      const l5 = SIGNS[(chart.ascendant.signIndex + 4) % 12].lord;
      summary = `पंचमेश ${planetToHi(l5)}, बुध (${mer.rasiHouseNumber}वें भाव) और चतुर्विंशांश (D24) की स्थिति से विद्या योग ${ratioNote} है।`;
      details = [
        `बुध (${DIGNITY_HI[mer.dignity]}) तार्किक विश्लेषण, भाषा, गणित व तकनीकी कौशल प्रदान करते हैं।`,
        `पंचम व नवम भाव का संबंध उच्च शिक्षा, शोध और संतान के उज्ज्वल भविष्य की ओर संकेत करता है।`,
        `एकाग्रता और नियमित अध्ययन से कठिन प्रतियोगी परीक्षाओं में भी सफलता संभव है।`,
      ];
    } else if (d.id === 'health') {
      summary = `लग्नेश ${planetToHi(ascLord.id)}, षष्ठ भाव तथा अष्टमेश के संतुलन के अनुसार स्वास्थ्य सूचकांक ${ratioNote} है।`;
      details = [
        `लग्न की मजबूती रोग प्रतिरोधक क्षमता देती है, जबकि षष्ठ भाव दैनिक स्वास्थ्य व दिनचर्या दर्शाता है।`,
        `त्रिदोष संतुलन (वात-पित्त-कफ) के अनुसार खान-पान, प्राणायाम और पर्याप्त निद्रा अत्यंत लाभकारी रहेगी।`,
        `विस्तृत अंग-वार सावधानी के लिए 'ज्योतिष शाखाएँ → रोग व चिकित्सा ज्योतिष' टैब देखें।`,
      ];
    } else if (d.id === 'fortune') {
      const l9 = SIGNS[(chart.ascendant.signIndex + 8) % 12].lord;
      summary = `नवमेश ${planetToHi(l9)} व भाग्य कारक गुरु (${trSign(jup.signIndex, 'hi')}) के बल से भाग्योदय सूचकांक ${ratioNote} है।`;
      details = [
        `नवम भाव पूर्वजन्म के पुण्य, पिता के आशीर्वाद, धर्म और दूर की यात्राओं का प्रतिनिधित्व करता है।`,
        `द्वादश व नवम का संबंध विदेश गमन, उच्च अध्ययन और आध्यात्मिक तीर्थयात्रा के अवसर दिलाता है।`,
      ];
    } else {
      const ketu = byId.get('Ketu')!;
      summary = `मोक्ष कारक केतु (${ketu.rasiHouseNumber}वें भाव) तथा गुरु के प्रभाव से आध्यात्मिक प्रगति ${ratioNote} है।`;
      details = [
        `द्वादश भाव, केतु व विंशांश (D20) कुंडली जातक के ध्यान, भक्ति और आंतरिक जागृति की दिशा दर्शाते हैं।`,
        `आत्मकारक ग्रह का अभ्यास करने से जीवन में गहरी मानसिक शांति और संतुलन प्राप्त होता है।`,
      ];
    }

    return {
      ...d,
      title: meta.title,
      sanskritFocus: meta.focus,
      summary,
      details,
      keyFactors: d.keyFactors.map(replaceEnTermsWithHi),
      sources: SOURCE_BOOKS_HI.slice(0, 3),
    };
  });
}

function localizeDivisionalItemsHi(
  items: DivisionalPredictionItem[],
  chart: ChartData
): DivisionalPredictionItem[] {
  return items.map((item) => {
    const dc = chart.divisionalCharts[item.vargaId as DivisionalChartId];
    const trV = trVarga(item.vargaId, item.name, item.domain, 'hi');
    const lagnaSignHi = trSign(dc.lagnaSignIndex, 'hi');
    const lagnaLord = SIGNS[dc.lagnaSignIndex].lord;
    const lordPl = dc.placements.find((p) => p.id === lagnaLord);
    const lordHouse = lordPl?.houseFromVargaLagna ?? 1;
    const lordDig = lordPl ? DIGNITY_HI[lordPl.dignity] : 'सम';
    const strongCount = dc.placements.filter((p) =>
      ['Exalted', 'Moolatrikona', 'Own Sign', 'Great Friend', 'Friend'].includes(p.dignity)
    ).length;

    const qualityNote =
      [1, 4, 5, 7, 9, 10, 11].includes(lordHouse) ||
      (lordPl && ['Exalted', 'Moolatrikona', 'Own Sign'].includes(lordPl.dignity))
        ? `${item.vargaId} वर्गाधिपति ${planetToHi(lagnaLord)} शुभ ${lordHouse}वें भाव में (${lordDig}) होने से ${trV.sig} के फल प्रबल व उन्नतिदायक हैं।`
        : `${item.vargaId} लग्नेश ${planetToHi(lagnaLord)} ${lordHouse}वें भाव में (${lordDig}) हैं; ${trV.sig} में धैर्यपूर्ण प्रयास व समय के साथ प्रगति मिलती है।`;

    const occs = dc.placements
      .filter((p) => p.id !== 'Asc')
      .slice(0, 4)
      .map((p) => `${planetToHi(p.id)} (${p.houseFromVargaLagna}वें भाव)`)
      .join(', ');

    return {
      ...item,
      name: `${item.vargaId} · ${trV.name}`,
      domain: trV.sig,
      lagnaSign: lagnaSignHi,
      keyLord: planetToHi(lagnaLord),
      keyLordStatus: `${planetToHi(lagnaLord)} · ${lordHouse}वें भाव (${lordDig})`,
      occupantsHighlight: `${strongCount} शुभ बली ग्रह · प्रमुख: ${occs}`,
      prediction: `${qualityNote} इस वर्ग कुंडली का लग्न ${lagnaSignHi} है, जो ${trV.sig} के सूक्ष्म परिणामों को निर्धारित करता है।`,
    };
  });
}

function localizeDoshaReportHi(doshaRep: KundaliDoshaReport): KundaliDoshaReport {
  const nameMap: Array<[string, string, string, string]> = [
    [
      'Manglik',
      'मांगलिक / कुज दोष',
      'विवाह में सामंजस्य बनाए रखने के लिए क्रोध व उतावलेपन पर संयम आवश्यक है; कुंडली मिलान में साथी का मांगलिक/पापांश संतुलन देखें।',
      'मंगलवार को हनुमान चालीसा पाठ, शांत संवाद एवं समान मांगलिक/शमित कुंडली से मिलान करें।',
    ],
    [
      'Kala Sarpa',
      'कालसर्प दोष',
      'सभी ग्रहों का राहु-केतु अक्ष के एक ओर होने से जीवन में संघर्ष, आकस्मिक मोड़ और 33–42 वर्ष के बाद असाधारण एकाग्रता से सफलता मिलती है।',
      'भगवान शिव का रुद्राभिषेक, महामृत्युंजय जप, नाग पंचमी पूजन एवं अनुशासित आचरण करें।',
    ],
    [
      'Pitra Dosha',
      'पितृ दोष',
      'सूर्य या नवम भाव पर शनि/राहु/केतु के प्रभाव से भाग्य में विलंब या पारिवारिक उत्तरदायित्व का भार महसूस हो सकता है।',
      'माता-पिता व बुजुर्गों का सम्मान करें, अमावस्या को अन्न-जल दान करें और पीपल या पवित्र वृक्ष की सेवा करें।',
    ],
    [
      'Guru Chandal',
      'गुरु चांडाल दोष',
      'बृहस्पति के साथ राहु/केतु की युति पारंपरिक मान्यताओं से हटकर स्वतंत्र व तीव्र बुद्धि देती है, किंतु गुरु व नीति से भटकने का भय रहता है।',
      'गुरुजनों का सम्मान, गुरुवार को पीले फल/पुस्तकें दान व सत्साहित्य का नियमित स्वाध्याय करें।',
    ],
    [
      'Shrapit',
      'श्रापित दोष (शनि + राहु)',
      'शनि और राहु की युति कर्मों की परीक्षा लेती है—ईमानदारी, धैर्य व कठिन परिश्रम के बाद ही स्थायी फल मिलते हैं।',
      'शनिवार को निर्धनों/श्रमिकों की सहायता, हनुमान/शिव आराधना और धैर्यपूर्वक कर्तव्य पालन करें।',
    ],
    [
      'Grahan Dosha',
      'ग्रहण दोष (सूर्य/चंद्र + राहु/केतु)',
      'सूर्य या चंद्र के साथ राहु-केतु होने से मानसिक संवेदनशीलता या आत्मविश्वास में उतार-चढ़ाव आ सकता है; सधने पर यही गहन अंतर्ज्ञान देता है।',
      'उगते सूर्य को जल अर्घ्य, सोमवार को चंद्र/शिव ध्यान एवं चावल-दूध का दान लाभकारी है।',
    ],
    [
      'Vish Dosha',
      'विष दोष (शनि+चंद्र) / अंगारक (मंगल+राहु)',
      'शनि-चंद्र युति से अधिक चिंता या एकाकीपन तथा मंगल-राहु युति से तीव्र क्रोध या आवेग उत्पन्न हो सकता है।',
      'प्राणायाम, नियमित व्यायाम व हनुमान/शिव मंत्र जप से मानसिक संतुलन बनाए रखें।',
    ],
    [
      'Kemadruma',
      'केमद्रुम दोष (एकाकी चंद्र)',
      'चंद्र के दोनों ओर ग्रह न होने पर व्यक्ति स्वावलंबी बनता है और कभी-कभी भावनात्मक अकेलापन महसूस कर सकता है।',
      'सोमवार का व्रत या शिव उपासना, जल का समुचित सेवन व परिवार/समाज से जुड़ाव बढ़ाएँ।',
    ],
    [
      'Gandmool',
      'गंडमूल नक्षत्र / गंडांत संधि',
      'अश्विनी, अश्लेषा, मघा, ज्येष्ठा, मूल, रेवती या राशि संधि जन्म के कारण जीवन में गहन आध्यात्मिक व कर्मिक मोड़ आते हैं।',
      'परंपरागत गंडमूल शांति पूजा एवं भगवान गणेश व नवग्रह वंदना अत्यंत शुभ रहती है।',
    ],
    [
      'Shakata Dosha',
      'शकट दोष (गुरु से 6/8/12 चंद्र)',
      'गुरु से चंद्र के छठे, आठवें या बारहवें होने से आर्थिक या भाग्य में समय-समय पर चक्रवात जैसा उतार-चढ़ाव आ सकता है।',
      'नियमित बचत योजना बनाए रखें तथा गुरुवार व सोमवार को कृतज्ञता व दान-पुण्य करें।',
    ],
  ];

  return {
    ...doshaRep,
    doshas: doshaRep.doshas.map((d) => {
      const found = nameMap.find(([prefix]) => d.name.includes(prefix));
      const cleanName = found
        ? d.name.includes('—')
          ? `${found[1]} — ${replaceEnTermsWithHi(d.name.split('—')[1].trim())}`
          : found[1]
        : replaceEnTermsWithHi(d.name);

      return {
        ...d,
        name: cleanName,
        trigger: replaceEnTermsWithHi(d.trigger)
          .replace(/No planets \(excluding Sun\/Nodes\) occupy the 1st, 2nd, or 12th signs from चंद्र/i, 'चंद्र से 1ले, 2रे या 12वें भाव में कोई अन्य ग्रह स्थित नहीं है')
          .replace(/Moon is flanked or joined by planetary companions\./i, 'चंद्र के आगे, पीछे या साथ में ग्रह उपस्थित हैं (दोष नहीं)।')
          .replace(/All seven planets are hemmed on one side of the राहु .* axis\./i, 'सभी सात ग्रह राहु-केतु अक्ष के एक ही तरफ स्थित हैं।')
          .replace(/Planets are distributed across both sides of the राहु–केतु axis\./i, 'ग्रह राहु-केतु अक्ष के दोनों तरफ फैले हैं (कालसर्प नहीं)।')
          .replace(/Six planets fall on one side, but one planet breaks the hem.*/i, 'छह ग्रह एक तरफ हैं पर एक ग्रह बाहर होने से दोष भंग हो गया है।')
          .replace(/Neither सूर्य nor चंद्र shares a sign with राहु or केतु\./i, 'सूर्य और चंद्र दोनों राहु-केतु की युति से मुक्त हैं।')
          .replace(/Moon नक्षत्र and key points are clear of Gandmool\/Gandanta junctions\./i, 'जन्म नक्षत्र एवं मुख्य बिंदु गंडमूल/गंडांत संधि से मुक्त हैं।')
          .replace(/Jupiter is not conjoined with राहु or केतु\./i, 'गुरु राहु या केतु के साथ युति में नहीं हैं।')
          .replace(/Saturn and राहु occupy different signs\./i, 'शनि और राहु अलग-अलग राशियों में स्थित हैं।')
          .replace(/Sun and 9th house\/lord are free from heavy nodal or Saturnian conjunctions\./i, 'सूर्य व नवम भाव/नवमेश राहु-केतु या शनि के भारी प्रभाव से मुक्त हैं।')
          .replace(/Moon is separated from शनि and मंगल is separated from राहु\/केतु\./i, 'चंद्र शनि से तथा मंगल राहु-केतु से अलग हैं।'),
        mitigation:
          d.status === 'Clear'
            ? 'कुंडली में यह दोष अनुपस्थित है, अतः किसी विशेष निवारण की आवश्यकता नहीं है।'
            : d.status === 'Mitigated (Cancelled)'
              ? `शुभ ग्रहों की दृष्टि या उच्च/स्वराशि बल से यह दोष भंग (निरस्त) हो रहा है (${replaceEnTermsWithHi(d.mitigation)})`
              : `यह दोष सक्रिय है; उचित उपाय व जीवनशैली सुधार लाभकारी रहेगा।`,
        effect: found ? found[2] : replaceEnTermsWithHi(d.effect),
        remedy: found ? found[3] : replaceEnTermsWithHi(d.remedy),
      };
    }),
  };
}

export function localizeFamilyHi(fam: FamilyChildhoodReport, chart: ChartData): FamilyChildhoodReport {
  const mkReading = (
    item: FamilyMemberReading,
    roleHi: string,
    sansHi: string,
    summaryText: string,
    vargaExtra: string
  ): FamilyMemberReading => ({
    ...item,
    role: roleHi,
    sanskrit: sansHi,
    keyIndicators: replaceEnTermsWithHi(item.keyIndicators),
    reading: summaryText,
    vargaNote: vargaExtra,
  });

  const l3 = SIGNS[(chart.ascendant.signIndex + 2) % 12].lord;
  const l4 = SIGNS[(chart.ascendant.signIndex + 3) % 12].lord;
  const l9 = SIGNS[(chart.ascendant.signIndex + 8) % 12].lord;

  return {
    childhood: {
      ...fam.childhood,
      earlyDashas: replaceEnTermsWithHi(fam.childhood.earlyDashas),
      balyaSummary: `बाल्यावस्था का समग्र सामंजस्य अंक ${fam.childhood.score}/100 है। प्रारंभिक दशाओं (${replaceEnTermsWithHi(fam.childhood.earlyDashas)}) और लग्न-चंद्र की स्थिति से बचपन का वातावरण व स्वास्थ्य निर्मित हुआ।`,
      upbringingStyle:
        fam.childhood.score >= 70
          ? 'सहायक एवं स्नेहपूर्ण पालन-पोषण, माता-पिता का मार्गदर्शन और शैक्षणिक व सांस्कृतिक संस्कारों का सुदृढ़ आधार।'
          : 'परिश्रम और प्रारंभिक जीवन अनुभवों ने आपको समय से पहले समझदार व आत्मनिर्भर बनाया।',
      earlyEnvironment: `लग्न, चंद्र नक्षत्र (${trTerm(chart.panchang.nakshatra.name, 'hi')}) एवं चतुर्थ भाव के प्रभाव से घर के परिवेश में अनुशासन व भावनात्मक जुड़ाव का मिश्रण रहा।`,
    },
    mother: mkReading(
      fam.mother,
      'माता एवं मातृसुख',
      'मातृ भाव (चतुर्थ · चंद्र · D12)',
      `चतुर्थेश ${planetToHi(l4)} एवं चंद्र की स्थिति से माता के प्रति गहन स्नेह, पोषण और पारिवारिक आधार (${fam.mother.score}/100) का योग है। माता के स्वास्थ्य व सुख-सुविधाओं का ध्यान रखना सदैव मंगलकारी रहेगा।`,
      `द्वादशांश (D12) में चंद्र व चतुर्थेश की स्थिति माता से मिलने वाले संस्कार व सुख को दर्शाती है।`
    ),
    father: mkReading(
      fam.father,
      'पिता एवं पितृ पक्ष',
      'पितृ भाव (नवम/दशम · सूर्य · D12)',
      `सूर्य और नवमेश ${planetToHi(l9)} के योग से पिता से मूल्य, अनुशासन, प्रतिष्ठा और जीवन की दिशा (${fam.father.score}/100) प्राप्त होती है। आपसी संवाद और सम्मान संबंधों को और प्रगाढ़ बनाता है।`,
      `द्वादशांश (D12) में सूर्य की स्थिति पिता की उन्नति व पैतृक परंपरा से जुड़ाव को दर्शाती है।`
    ),
    siblings: mkReading(
      fam.siblings,
      'भाई-बहन एवं पराक्रम',
      'भ्रातृ भाव (तृतीय/एकादश · मंगल · D3)',
      `तृतीयेश ${planetToHi(l3)} व मंगल की स्थिति भाई-बहनों के साथ संबंध और पारस्परिक सहयोग (${fam.siblings.score}/100) दर्शाती है। स्पष्ट संवाद व उदारता से भाइयों-बहनों का निरंतर साथ मिलता है।`,
      `द्रेष्काण (D3) कुंडली सहोदर सुख और पराक्रम को स्पष्ट करती है।`
    ),
    extendedFamily: mkReading(
      fam.extendedFamily,
      'कुटुंब एवं पारिवारिक परंपरा',
      'कुटुंब भाव (द्वितीय · D12)',
      `द्वितीय भाव व द्वादशांश (D12) के अनुसार कुटुंब में संवाद, पारिवारिक उत्सव और कुल-परंपरा का स्तर ${fam.extendedFamily.score}/100 है।`,
      `D12 लग्न एवं द्वितीय भाव कुल की समृद्धि और सामाजिक प्रतिष्ठा को दर्शाते हैं।`
    ),
    inLaws: mkReading(
      fam.inLaws,
      'ससुराल पक्ष एवं साझेदार परिवार',
      'अष्टम भाव (विवाह परिवार · D9)',
      `अष्टम भाव व सप्तम से द्वितीय (अष्टम) भाव ससुराल पक्ष के स्वभाव और विवाह उपरांत संबंधों (${fam.inLaws.score}/100) को दर्शाते हैं। परस्पर सम्मान से अच्छे संबंध निभते हैं।`,
      `नवांश (D9) में शुक्र और अष्टमेश की स्थिति विवाह के बाद पारिवारिक सौहार्द बताती है।`
    ),
  };
}

function localizeDashaBlockHi(d: DashaPrediction): DashaPrediction {
  const mdHi = planetToHi(d.mahadashaLord);
  const adHi = planetToHi(d.antardashaLord);
  const pdHi = planetToHi(d.pratyantardashaLord);
  const mdTheme = DASA_PLANET_ARCHETYPE_HI[d.mahadashaLord as NineGrahaId] ?? mdHi;
  const adTheme = DASA_PLANET_ARCHETYPE_HI[d.antardashaLord as NineGrahaId] ?? adHi;

  return {
    ...d,
    mahadashaLord: mdHi,
    antardashaLord: adHi,
    pratyantardashaLord: pdHi,
    mutualRelation: replaceEnTermsWithHi(d.mutualRelation)
      .replace(/Kendra\/Trikona mutual relation/gi, 'केंद्र/त्रिकोण शुभ संबंध')
      .replace(/Shadashtaka \(6\/8\)/gi, 'षडाष्टक (6/8) — धैर्य अपेक्षित')
      .replace(/Dwirdwadasha \(2\/12\)/gi, 'द्विर्द्वादश (2/12) — व्यय/परिवर्तन')
      .replace(/Samasaptaka \(7th\)/gi, 'समसप्तक (7वां) — साझेदारी प्रभाव'),
    summary: `दिनांक ${d.targetDate} के लिए वर्तमान विंशोत्तरी दशा क्रम: ${mdHi} महादशा → ${adHi} अंतरदशा → ${pdHi} प्रत्यंतरदशा (${trBadge(d.favorability, 'hi')})।`,
    mahadashaReading: `${mdHi} महादशा (${d.mdPlacedHouse}वें भाव में स्थित, स्वामी: ${houseListHi(d.mdHousesRuled)}) मुख्य रूप से ${mdTheme} के विषयों को सक्रिय करती है।`,
    antardashaReading: `${adHi} अंतरदशा (${d.adPlacedHouse}वें भाव में स्थित, स्वामी: ${houseListHi(d.adHousesRuled)}) ${adTheme} के फल प्रदान करती है।`,
    guidance: `${mdHi} व ${adHi} द्वारा शासित भावों (${houseListHi([...new Set([...d.mdHousesRuled, ...d.adHousesRuled])])}) के कार्यों पर ध्यान दें; नियमित मंत्र जप व अनुशासन से दशा के श्रेष्ठ परिणाम प्राप्त होंगे।`,
    sources: SOURCE_BOOKS_HI.slice(0, 3),
  };
}

function localizeTransitsHi(tr: TransitForecast, deep: DeepGocharReport): {
  transitForecast: TransitForecast;
  deepGochar: DeepGocharReport;
} {
  const janmaHi = signToHi(tr.janmaRasi);
  const sadeActive = tr.sadeSatiStatus.active;
  const phaseHi = sadeActive
    ? tr.sadeSatiStatus.phase.includes('Rising') || tr.sadeSatiStatus.phase.includes('1st')
      ? 'साढ़ेसाती — प्रथम चरण (उदय/शीर्ष)'
      : tr.sadeSatiStatus.phase.includes('Peak') || tr.sadeSatiStatus.phase.includes('2nd')
        ? 'साढ़ेसाती — द्वितीय चरण (मध्य/शिखर)'
        : 'साढ़ेसाती — तृतीय चरण (अस्त/उतरती)'
    : tr.sadeSatiStatus.phase.includes('Dhaiya') || tr.sadeSatiStatus.phase.includes('Kantaka')
      ? replaceEnTermsWithHi(tr.sadeSatiStatus.phase).replace(/Dhaiya/gi, 'ढैया')
      : 'साढ़ेसाती सक्रिय नहीं है (मुक्त)';

  const itemsHi = tr.items.map((it) => {
    const pHi = planetToHi(it.planet);
    const sHi = signToHi(it.transitSign);
    const vedhaStr = it.hasVedha && it.vedhaPlanet ? ` (${planetToHi(it.vedhaPlanet)} द्वारा वेध)` : '';
    const vText =
      it.verdict === 'Auspicious'
        ? `${pHi} जन्म चंद्र से ${it.houseFromMoon}वें भाव (${sHi}) में वेध-रहित होकर शुभ फलदायी हैं (SAV बिंदु: ${it.savBindus})।`
        : it.verdict === 'Obstructed (Vedha)'
          ? `${pHi} चंद्र से ${it.houseFromMoon}वें भाव (${sHi}) में शुभ स्थान पर हैं, किंतु वेध${vedhaStr} के कारण फल धीमे मिलते हैं।`
          : `${pHi} चंद्र से ${it.houseFromMoon}वें भाव (${sHi}) में गोचर कर रहे हैं (SAV: ${it.savBindus}); धैर्य व कर्मनिष्ठा लाभकारी रहेगी।`;

    return {
      ...it,
      transitSign: sHi,
      vedhaPlanet: it.vedhaPlanet ? planetToHi(it.vedhaPlanet) : undefined,
      reading: vText,
    };
  });

  const deepItemsHi = deep.items.map((di) => {
    const pHi = planetToHi(di.planet);
    const sHi = signToHi(di.transitSign);
    const d9Hi = signToHi(di.d9TransitSign);
    const d10Hi = signToHi(di.d10TransitSign);
    const kakHi = planetToHi(di.kakshyaLord);
    const taraClean = TARA_HI[di.taraName] ?? trTerm(di.taraName, 'hi');
    const vedhaNote = di.hasVedha ? ` (वेध: ${planetToHi(di.vedhaPlanet ?? '')})` : ' (वेध मुक्त)';

    return {
      ...di,
      transitSign: sHi,
      nakshatraName: trTerm(di.nakshatraName, 'hi'),
      d9TransitSign: d9Hi,
      d10TransitSign: d10Hi,
      kakshyaLord: (PLANET_NAMES_I18N.hi[di.kakshyaLord] ?? di.kakshyaLord) as SevenPlanetId | 'Asc',
      taraName: taraClean,
      vedhaPlanet: di.vedhaPlanet ? planetToHi(di.vedhaPlanet) : undefined,
      reading: `${pHi} का ${sHi} (${di.degreeInSign.toFixed(1)}°, ${trTerm(di.nakshatraName, 'hi')}) गोचर: चंद्र से ${di.houseFromMoon}वां व लग्न से ${di.houseFromLagna}वां भाव, नवांश में ${d9Hi} व दशमांश में ${d10Hi}। कक्ष्या स्वामी ${kakHi} (${di.kakshyaHasBindu ? 'अष्टकवर्ग बिंदु प्राप्त ✓' : 'बिंदु रहित'}), तारा: ${taraClean}${vedhaNote}।`,
    };
  });

  const dblHi = deep.doubleTransitHouses.map((dt) => ({
    ...dt,
    signName: signToHi(dt.signName),
    jupiterLink: replaceEnTermsWithHi(dt.jupiterLink),
    saturnLink: replaceEnTermsWithHi(dt.saturnLink),
    meaning: `गुरु व शनि दोनों के दोहरे गोचर (Double Transit) से ${dt.house}वां भाव (${signToHi(dt.signName)} · SAV ${dt.savBindus}) सक्रिय है — ${HOUSE_DOMAIN_HI[dt.house]} से जुड़े प्रमुख कार्य सिद्ध होने का समय।`,
  }));

  return {
    transitForecast: {
      ...tr,
      janmaRasi: janmaHi,
      sadeSatiStatus: {
        active: sadeActive,
        phase: phaseHi,
        description: sadeActive
          ? `जन्म राशि ${janmaHi} पर शनि की साढ़ेसाती/ढैया का प्रभाव सक्रिय है। यह समय अनुशासन, कर्मशुद्धि और दीर्घकालिक नींव रखने का है।`
          : `वर्तमान गोचर में जन्म राशि ${janmaHi} पर शनि की साढ़ेसाती सक्रिय नहीं है।`,
      },
      jupiterTransitNote: replaceEnTermsWithHi(tr.jupiterTransitNote),
      items: itemsHi,
      sources: SOURCE_BOOKS_HI,
    },
    deepGochar: {
      ...deep,
      items: deepItemsHi,
      doubleTransitHouses: dblHi,
      overallSummary: `दिनांक ${deep.targetDate} के लिए गहन गोचर (राशि + नवांश + दशमांश + कक्ष्या + तारा बल + दोहरा गोचर): ${dblHi.length ? `गुरु-शनि के दोहरे गोचर से ${dblHi.map((x) => `${x.house}वां भाव`).join(', ')} विशेष रूप से सक्रिय हैं।` : 'नियमित गोचर प्रभाव संतुलित चल रहा है।'}`,
    },
  };
}

export function localizePredictionReportHi(
  report: PredictionReport,
  chart: ChartData
): PredictionReport {
  if (report.paramayus?.exceeded) {
    return report;
  }
  const ascIdx = chart.ascendant.signIndex;
  const ascHi = trSign(ascIdx, 'hi');
  const lagnaKb = LAGNA_HI_PROFILES[ascIdx] ?? LAGNA_HI_PROFILES[0];
  const nakIdx = chart.panchang.nakshatra.index;
  const nakKb = NAKSHATRA_HI_READINGS[nakIdx] ?? NAKSHATRA_HI_READINGS[0];
  const akPlanet = report.atmakarakaInsight.planet;

  const kpEventsHi = report.kpReport.events.map((ev) => ({
    ...ev,
    topic: replaceEnTermsWithHi(ev.topic)
      .replace(/Marriage \/ Partnership/i, 'विवाह एवं दांपत्य')
      .replace(/Career \/ Profession/i, 'करियर, पद एवं व्यवसाय')
      .replace(/Wealth & Income/i, 'धन एवं आय वृद्धि')
      .replace(/Higher Education \/ Fortune/i, 'उच्च शिक्षा एवं भाग्य')
      .replace(/Property & Home/i, 'भवन, वाहन एवं सुख')
      .replace(/Children \/ Speculation/i, 'संतान एवं निवेश'),
    reading: `भाव ${ev.cusp} का उप-स्वामी (Sub-Lord) ${planetToHi(ev.cuspalSubLord)} है, जो मुख्यतः भाव (${ev.subLordSignifies.join(', ')}) को सूचित कर रहा है। अपेक्षित भाव (${ev.targetHouses.join(', ')}) में से [${ev.matchedHouses.length ? ev.matchedHouses.join(', ') : 'कोई सीधा नहीं'}] का मिलान होने से परिणाम: ${trBadge(ev.verdict, 'hi')}।`,
  }));

  const kpCuspsHi = report.kpReport.cusps.map((c) => ({
    ...c,
    signName: signToHi(c.signName),
  }));

  const kpPlanetsHi = report.kpReport.planets.map((p) => ({
    ...p,
    signName: signToHi(p.signName),
  }));

  const { transitForecast, deepGochar } = localizeTransitsHi(
    report.transitForecast,
    report.deepGochar
  );

  const planetPlacementsHi: PlanetHousePrediction[] = report.planetPlacements.map((pp) => {
    const pHi = planetToHi(pp.planet);
    const sHi = signToHi(pp.signName);
    const digHi = DIGNITY_HI[pp.dignity] ?? pp.dignity;
    return {
      ...pp,
      signName: sHi,
      dignity: digHi,
      headline: `${pp.house}वें भाव (${sHi}) में ${pHi} — ${digHi}`,
      classicalReading: GRAHA_IN_HOUSE_HI[pp.planet]?.[pp.house] ?? pp.classicalReading,
      dignityModifier: `${pHi} की स्थिति '${digHi}' है${pp.lordOfHouses.length ? ` तथा यह ${houseListHi(pp.lordOfHouses)} के स्वामी होकर फल प्रदान करते हैं।` : ' (छाया ग्रह)।'}`,
      sources: SOURCE_BOOKS_HI.slice(0, 3),
    };
  });

  const houseLordshipsHi: HouseLordPrediction[] = report.houseLordships.map((hl) => {
    const pHi = planetToHi(hl.planet);
    const sHi = signToHi(hl.placedSign);
    const b144 = getBhavesha144Entry(hl.lordHouse, hl.placedHouse);
    return {
      ...hl,
      placedSign: sHi,
      headline: `${b144.headlineHi} (${pHi} · ${sHi})`,
      reading: `${b144.readingHi} संभावित घटनाएँ: ${b144.eventHi}`,
      source: 'शास्त्रीय पाराशरी भावेश फल',
    };
  });

  const remediesHi: RemedyItem[] = report.remedies.map((r) => {
    const kb = REMEDY_HI[r.planet];
    return {
      ...r,
      reason: replaceEnTermsWithHi(r.reason),
      mantra: kb.mantra,
      dana: kb.dana,
      lifestyle: kb.lifestyle,
      gemNote: kb.gemNote,
    };
  });

  return {
    ...report,
    lagnaProfile: {
      ...report.lagnaProfile,
      signName: ascHi,
      sanskritName: ascHi,
      ...lagnaKb,
      sources: SOURCE_BOOKS_HI,
    },
    nakshatraProfile: {
      ...report.nakshatraProfile,
      name: trTerm(report.nakshatraProfile.name, 'hi'),
      deity: nakKb.deity,
      coreNature: nakKb.coreNature,
      vocation: nakKb.vocation,
      growthPath: nakKb.growthPath,
      sources: ['बृहत् संहिता', 'माइंडसूत्र / वेबज्योतिषी नक्षत्र अध्याय'],
    },
    atmakarakaInsight: {
      ...report.atmakarakaInsight,
      planet: planetToHi(akPlanet),
      signName: signToHi(report.atmakarakaInsight.signName),
      soulTheme: ATMAKARAKA_HI[akPlanet] ?? replaceEnTermsWithHi(report.atmakarakaInsight.soulTheme),
      source: 'जैमिनी सूत्र (चर कारक अध्याय)',
    },
    lifeDomains: localizeDomainsHi(report.lifeDomains, chart),
    planetPlacements: planetPlacementsHi,
    houseLordships: houseLordshipsHi,
    dashaForecast: localizeDashaBlockHi(report.dashaForecast),
    transitForecast,
    deepGochar,
    divisionalPredictions: localizeDivisionalItemsHi(report.divisionalPredictions, chart),
    kpReport: {
      ...report.kpReport,
      cusps: kpCuspsHi,
      planets: kpPlanetsHi,
      events: kpEventsHi,
    },
    varshaphala: {
      ...report.varshaphala,
      munthaSignName: trSign(report.varshaphala.munthaSignIndex, 'hi'),
      munthaPrediction: `${report.varshaphala.year} वर्षफल में मुंथा ${report.varshaphala.munthaHouse}वें भाव (${trSign(report.varshaphala.munthaSignIndex, 'hi')}) में स्थित है — इस वर्ष ${HOUSE_DOMAIN_HI[report.varshaphala.munthaHouse]} के विषयों पर मुख्य ध्यान रहेगा।`,
      varsheshStrengthNote: `वर्षेश ${planetToHi(report.varshaphala.varshesh)} वार्षिक कुंडली की दिशा नियंत्रित कर रहे हैं (${replaceEnTermsWithHi(report.varshaphala.varsheshStrengthNote)})।`,
      tajikaYogas: report.varshaphala.tajikaYogas.map((y) => ({
        ...y,
        name: replaceEnTermsWithHi(y.name),
        planets: replaceEnTermsWithHi(y.planets),
        description: replaceEnTermsWithHi(y.description),
      })),
      annualSummary: `वर्ष ${report.varshaphala.year} (आयु ${report.varshaphala.completedYears} पूर्ण): वर्ष प्रवेश ${report.varshaphala.varshaPraveshLocal}। वर्षेश ${planetToHi(report.varshaphala.varshesh)} व ${report.varshaphala.munthaHouse}वें भाव की मुंथा इस वर्ष प्रगति व अवसर प्रदान करेगी।`,
    },
    jaiminiReport: {
      ...report.jaiminiReport,
      karakamshaSign: signToHi(report.jaiminiReport.karakamshaSign),
      swamsaSign: signToHi(report.jaiminiReport.swamsaSign),
      karakamshaReading: `आत्मकारक ${planetToHi(akPlanet)} नवांश में ${signToHi(report.jaiminiReport.karakamshaSign)} (कारकांश) में स्थित हैं। जैमिनी सूत्रों के अनुसार यह आध्यात्मिक उन्नति एवं स्थायी कार्यक्षेत्र का प्रमुख सूचक है।`,
      arudhaPadas: report.jaiminiReport.arudhaPadas.map((a) => ({
        ...a,
        signName: signToHi(a.signName),
      })),
      charaDasha: report.jaiminiReport.charaDasha.map((c) => ({
        ...c,
        signName: signToHi(c.signName),
        reading: `${signToHi(c.signName)} चर दशा (${c.years} वर्ष) लग्न से ${c.houseFromLagna}वें भाव (${HOUSE_DOMAIN_HI[c.houseFromLagna]}) को सक्रिय करती है।`,
      })),
    },
    lalKitabReport: {
      ...report.lalKitabReport,
      planets: report.lalKitabReport.planets.map((p) => ({
        ...p,
        note: p.isPakka
          ? `${planetToHi(p.planet)} अपने पक्का घर (${p.pakkaGhar}वें भाव) में अत्यंत स्थिर व बली हैं।`
          : `${planetToHi(p.planet)} ${p.house}वें भाव में हैं (पक्का घर: ${p.pakkaGhar}वां भाव) — आचरण व उपाय द्वारा शुभ फल मिलते हैं।`,
      })),
      rins: report.lalKitabReport.rins.map((rn) => ({
        ...rn,
        name: replaceEnTermsWithHi(rn.name).replace(/Rin/gi, 'ऋण'),
        meaning: replaceEnTermsWithHi(rn.meaning),
        remedy: replaceEnTermsWithHi(rn.remedy),
      })),
      generalUpay: report.lalKitabReport.generalUpay.map(replaceEnTermsWithHi),
    },
    familyReport: localizeFamilyHi(report.familyReport, chart),
    kundaliDoshas: localizeDoshaReportHi(report.kundaliDoshas),
    remedies: remediesHi,
  };
}

export function localizeSpecializedSuiteHi(
  suite: SpecializedAstrologySuite,
  chart: ChartData
): SpecializedAstrologySuite {
  const byId = new Map(chart.planets.map((p) => [p.id, p]));
  const mer = byId.get('Mercury')!;
  const jup = byId.get('Jupiter')!;
  const ven = byId.get('Venus')!;
  const mars = byId.get('Mars')!;
  const sat = byId.get('Saturn')!;
  const kalapurushaHi = [
    { region: 'सिर, मस्तिष्क एवं नेत्र (मेष)', care: 'पर्याप्त नींद, जल सेवन व क्रोध/उष्णता से बचाव।' },
    { region: 'गला, गर्दन, थायरॉयड व मुख (वृषभ)', care: 'गले व वाणी की देखभाल, संतुलित आहार व ठंडी चीज़ों से सावधानी।' },
    { region: 'फेफड़े, कंधे, भुजाएँ व स्नायु तंत्र (मिथुन)', care: 'प्राणायाम, विश्राम व मानसिक अति-विचार से बचाव।' },
    { region: 'छाती, हृदय क्षेत्र, फेफड़े व आमाशय (कर्क)', care: 'समय पर सात्विक भोजन, भावनात्मक संतुलन व रात्रि हल्का भोजन।' },
    { region: 'हृदय, ऊपरी रीढ़ व जीवन शक्ति (सिंह)', care: 'नियमित हृदय व्यायाम, रीढ़ सीधा रखना व तनाव प्रबंधन।' },
    { region: 'आंतें, पाचन व उदर प्रणाली (कन्या)', care: 'सुपाच्य भोजन, फाइबर व चिंता-मुक्त दिनचर्या।' },
    { region: 'गुर्दे (किडनी), कमर का निचला भाग (तुला)', care: 'नियमित जल सेवन, कमर स्ट्रेचिंग व कार्य-विश्राम संतुलन।' },
    { region: 'श्रोणि क्षेत्र, प्रजनन व उत्सर्जन तंत्र (वृश्चिक)', care: 'स्वच्छ जल, विषाक्त तनाव से दूरी व योग अभ्यास।' },
    { region: 'नितंब, जांघें व यकृत चयापचय (धनु)', care: 'तले-भुने भोजन में संयम, तेज टहलना व लचीलापन।' },
    { region: 'घुटने, हड्डियाँ, जोड़ व दांत (मकर)', care: 'विटामिन-डी/कैल्शियम व गर्म तेल मालिश।' },
    { region: 'पिंडलियाँ, टखने व रक्त संचार (कुंभ)', care: 'नियमित पैदल चलना, लंबे समय तक एक ही मुद्रा में न बैठना।' },
    { region: 'पैर, लसीका तंत्र व निद्रा चक्र (मीन)', care: 'पैरों की स्वच्छता, अंधेरे शांत कमरे में गहरी नींद।' },
  ];

  return {
    financial: {
      ...suite.financial,
      induLagnaSign: signToHi(suite.financial.induLagnaSign),
      induLagnaNote: `इंदु लग्न ${signToHi(suite.financial.induLagnaSign)} (${suite.financial.induLagnaHouse}वां भाव) स्थायी धन व संपत्ति प्रवाह का मुख्य केंद्र है।`,
      d2WealthChannel: `होरा कुंडली (D2) विश्लेषण: सूर्य होरा स्व-परिश्रम से धन व चंद्र होरा जनसंपर्क, साझेदारी व तरल निवेश से आय दर्शाती है।`,
      fixedAssetsNote: `चतुर्थांश (D4) एवं चतुर्थ भाव के प्रभाव से भूमि, मकान व अचल संपत्ति के दीर्घकालिक योग बनते हैं (${suite.financial.score}/100)।`,
      speculationRiskNote: `पंचम व एकादश भाव के अनुसार सट्टा/शेयर बाजार में केवल अनुसंधान आधारित दीर्घकालिक निवेश ही सुरक्षित रहेगा।`,
      wealthStyle:
        suite.financial.score >= 70
          ? 'सशक्त संचय एवं बहु-स्रोतीय धन निर्माण क्षमता'
          : 'अनुशासित बचत व निरंतर व्यवसाय/करियर वृद्धि से स्थिर समृद्धि',
      favorableDashas: suite.financial.favorableDashas.map((d) => ({
        ...d,
        lord: planetToHi(d.lord),
        reason: replaceEnTermsWithHi(d.reason),
      })),
      insights: [
        `गुरु (${trSign(jup.signIndex, 'hi')}, ${jup.rasiHouseNumber}वें भाव) की स्थिति आर्थिक विस्तार एवं शुभ निवेश में सहायक है।`,
        `धन (2रा) व लाभ (11वां) भाव की अनुकूल दशाओं में संपत्ति एवं बचत में तीव्र वृद्धि देखी जाती है।`,
        `अष्टकवर्ग के अनुसार सर्वाधिक SAV बिंदुओं वाली दिशा व अवधि में नए वित्तीय उपक्रम प्रारंभ करें।`,
      ],
    },
    education: {
      ...suite.education,
      recommendedStreams: suite.education.recommendedStreams.map(replaceEnTermsWithHi),
      d24Note: `चतुर्विंशांश (D24) कुंडली उच्च शिक्षा, शोध एवं शैक्षणिक प्रमाणपत्रों में सफलता की दिशा दिखाती है (${suite.education.score}/100)।`,
      analyticalStrength: `बुध (${DIGNITY_HI[mer.dignity]}) व पंचम भाव के प्रभाव से तार्किक समझ, स्मरण शक्ति एवं संवाद कौशल कार्य करता है।`,
      higherStudyNote: `नवम भाव व द्वादश भाव के संबंध उच्च स्तरीय उपाधि, शोध या विदेश में अध्ययन के अवसर प्रदान करते हैं।`,
      favorableDashas: suite.education.favorableDashas.map((d) => ({
        ...d,
        lord: planetToHi(d.lord),
        reason: replaceEnTermsWithHi(d.reason),
      })),
      insights: [
        `बुध, गुरु व चंद्र के मजबूत होने से शिक्षा में एकाग्रता व विषय-बोध गहरा होता है।`,
        `विशिष्ट करियर के अनुरूप विषयों का चयन करने से प्रतियोगी परीक्षाओं में श्रेष्ठ रैंक मिलती है।`,
      ],
    },
    career: {
      ...suite.career,
      topSectors: suite.career.topSectors.map(replaceEnTermsWithHi),
      d10Summary: `दशमांश (D10) लग्न ${trSign(chart.divisionalCharts.D10.lagnaSignIndex, 'hi')} कार्यक्षेत्र की प्रकृति, पदोन्नति और सम्मान निर्धारित करता है (${suite.career.score}/100)।`,
      amatyakarakaNote: `अमात्यकारक ग्रह पेशेवर पहचान और जीविका का मुख्य स्तंभ है (${replaceEnTermsWithHi(suite.career.amatyakarakaNote)})।`,
      favorableDashas: suite.career.favorableDashas.map((d) => ({
        ...d,
        lord: planetToHi(d.lord),
        reason: replaceEnTermsWithHi(d.reason),
      })),
      insights: [
        `नौकरी अंक: ${suite.career.serviceScore}/100 बनाम स्वतंत्र व्यवसाय अंक: ${suite.career.businessScore}/100 — प्रकृति के अनुसार कार्य शैली चुनें।`,
        `शनि (${sat.rasiHouseNumber}वें भाव) की अनुशासित ऊर्जा दीर्घकालिक करियर में स्थायी शिखर प्रदान करती है।`,
      ],
    },
    marriage: {
      ...suite.marriage,
      spouseProfile: `नवांश (D9) व सप्तम भाव के अनुसार जीवनसाथी समझदार, जिम्मेदार एवं परिवार के प्रति समर्पित व्यक्तित्व वाले होंगे (${suite.marriage.score}/100)।`,
      d9Summary: `नवांश लग्न ${trSign(chart.divisionalCharts.D9.lagnaSignIndex, 'hi')} और शुक्र (${trSign(ven.signIndex, 'hi')}, ${DIGNITY_HI[ven.dignity]}) दांपत्य की आंतरिक मधुरता दर्शाते हैं।`,
      upapadaNote: `उपपद लग्न (UL) विवाह के बाहरी स्वरूप, जीवनसाथी के कुल व संबंध के स्थायित्व का सूचक है (${replaceEnTermsWithHi(suite.marriage.upapadaNote)})।`,
      manglikAssessment: replaceEnTermsWithHi(suite.marriage.manglikAssessment),
      favorableDashas: suite.marriage.favorableDashas.map((d) => ({
        ...d,
        lord: planetToHi(d.lord),
        reason: replaceEnTermsWithHi(d.reason),
      })),
      insights: [
        `शुक्र व सप्तमेश की अनुकूल दशा एवं गुरु के सप्तम/नवांश संबंध से विवाह योग प्रबल होता है।`,
        `आपसी सम्मान व स्पष्ट संवाद दांपत्य जीवन को सदैव सुखी बनाता है।`,
      ],
    },
    intimacy: {
      ...suite.intimacy,
      eroticArchetype: replaceEnTermsWithHi(suite.intimacy.eroticArchetype)
        .replace(/Magnetic, Intense & Passionate/gi, 'चुंबकीय, गहन एवं तीव्र अनुरागी')
        .replace(/Tender, Sensual & Devoted/gi, 'कोमल, कामुक एवं गहन समर्पित')
        .replace(/Playful, Expressive & Communicative/gi, 'चंचल, अभिव्यक्तिपूर्ण एवं संवादी')
        .replace(/Balanced, Grounded & Loyal/gi, 'संतुलित, स्थिर एवं निष्ठावान'),
      venusStyle: `शुक्र (${trSign(ven.signIndex, 'hi')}, ${ven.rasiHouseNumber}वें भाव) के प्रभाव से प्रेम व आकर्षण में सौंदर्य, स्पर्श, भावनात्मक जुड़ाव एवं आपसी आदर प्रमुख रहते हैं।`,
      marsDriveNote: `मंगल (${trSign(mars.signIndex, 'hi')}, ${mars.rasiHouseNumber}वें भाव) शारीरिक ऊर्जा, साहस, कामना और आवेग की तीव्रता (${suite.intimacy.passionDriveScore}/100) का संचालन करते हैं।`,
      shayanaSukhaNote: `द्वादश भाव (शयन सुख स्थान) बिस्तर सुख, विश्राम व अंतरंग सानिध्य की गुणवत्ता (${suite.intimacy.sensualWarmthScore}/100) को दर्शाता है।`,
      eighthHouseDepthNote: `अष्टम भाव (रंध्र व गुप्त आकर्षण) गहन शारीरिक व मानसिक समर्पण, विश्वास और रूपांतरण का सूचक है।`,
      d9AndD30Note: `नवांश (D9) व त्रिंशांश (D30) में शुक्र-मंगल की स्थिति विवाह के भीतर दीर्घकालिक शारीरिक सामंजस्य और इच्छाओं के संतुलन को दर्शाती है।`,
      relationshipNeeds: [
        'भावनात्मक सुरक्षा एवं पारदर्शी विश्वास (चंद्र व चतुर्थ भाव)',
        'रोमांस, सौंदर्य और स्नेहपूर्ण संवाद (शुक्र व तृतीय भाव)',
        'संतुलित शारीरिक आकर्षण व आपसी सम्मान (मंगल व सप्तम/द्वादश भाव)',
      ],
      guidance: [
        'शारीरिक निकटता के साथ-साथ शांत संवाद और भावनात्मक देखभाल संबंध को चिरस्थायी बनाती है।',
        'क्रोध या जल्दबाजी से बचकर साथी की लय व भावनाओं का सम्मान करना अत्यंत शुभ रहेगा।',
      ],
    },
    child: {
      ...suite.child,
      d7Summary: `सप्तांश (D7) लग्न ${trSign(chart.divisionalCharts.D7.lagnaSignIndex, 'hi')} संतान सुख व रचनात्मक विस्तार की क्षमता (${suite.child.score}/100) को दर्शाता है।`,
      putrakarakaNote: `जैमिनी पुत्रकारक ग्रह व पंचम भाव संतान से सुख, शिक्षा और वंश वृद्धि के सूचक हैं (${replaceEnTermsWithHi(suite.child.putrakarakaNote)})।`,
      jupiterProgenyNote: `संतान कारक बृहस्पति (${trSign(jup.signIndex, 'hi')}, ${jup.rasiHouseNumber}वें भाव, ${DIGNITY_HI[jup.dignity]}) संतान की उन्नति में सहायक हैं।`,
      favorableDashas: suite.child.favorableDashas.map((d) => ({
        ...d,
        lord: planetToHi(d.lord),
        reason: replaceEnTermsWithHi(d.reason),
      })),
      insights: [
        `पंचम भाव, पंचमेश एवं सप्तांश (D7) का समन्वय संतान प्राप्ति और उनके करियर की शुभता दर्शाता है।`,
        `संतान योग की पुष्टि के लिए माता-पिता दोनों की कुंडली एवं गुरु-पंचमेश दशा देखना उत्तम रहता है।`,
      ],
    },
    lifePath: {
      ...suite.lifePath,
      longevityResilience: replaceEnTermsWithHi(suite.lifePath.longevityResilience),
      spiritualPathNote: `आत्मकारक, नवम व द्वादश भाव के आधार पर जीवन का उच्च उद्देश्य सेवा, ज्ञान और आत्म-जागृति से जुड़ना है।`,
      chapters: suite.lifePath.chapters.map((ch) => ({
        phase: ch.phase
          .replace(/Balya.*Youth/i, 'बाल्यावस्था एवं प्रारंभिक विद्या')
          .replace(/Madhya.*Growth/i, 'युवा एवं कर्म निर्माण काल')
          .replace(/Vriddha.*Consolidation/i, 'प्रौढ़, नेतृत्व एवं फल काल')
          .replace(/Vairagya.*Wisdom/i, 'परिपक्वता, मार्गदर्शन एवं मोक्ष काल'),
        ageRange: ch.ageRange.replace(/yrs?/gi, 'वर्ष'),
        dashas: replaceEnTermsWithHi(ch.dashas),
        focus: replaceEnTermsWithHi(ch.focus),
      })),
      insights: [
        `चारों तत्वों (अग्नि, पृथ्वी, वायु, जल) व त्रिगुणों (सत्व, रजस, तमस) का संतुलन आपके स्वभाव व निर्णय शैली का आधार है।`,
        `आयु व जीवन शक्ति की रक्षा हेतु नियमित दिनचर्या एवं नैतिक जीवन शैली अपनाएँ।`,
      ],
    },
    medical: {
      ...suite.medical,
      disclaimer:
        'वैधानिक सूचना: यह आयुर्वेदिक व चिकित्सा ज्योतिष विश्लेषण केवल शैक्षणिक एवं निवारक मार्गदर्शन हेतु है — किसी भी रोग के उपचार हेतु योग्य चिकित्सक से परामर्श अवश्य लें।',
      dominantPrakriti: replaceEnTermsWithHi(suite.medical.dominantPrakriti)
        .replace(/Vata/g, 'वात')
        .replace(/Pitta/g, 'पित्त')
        .replace(/Kapha/g, 'कफ'),
      d6ShashthamsaNote: `षष्ठांश (D6) कुंडली शरीर की रोग प्रतिरोधक क्षमता, आकस्मिक रोग एवं शीघ्र स्वास्थ्य लाभ की शक्ति को दर्शाती है।`,
      vulnerableZones: suite.medical.vulnerableZones.map((vz) => {
        const signIdx = SIGN_NAME_TO_INDEX[vz.signName.split(' ')[0]] ?? ((chart.ascendant.signIndex + vz.house - 1) % 12);
        const kp = kalapurushaHi[signIdx] ?? kalapurushaHi[0];
        return {
          ...vz,
          signName: trSign(signIdx, 'hi'),
          anatomicalRegion: kp.region,
          trigger: replaceEnTermsWithHi(vz.trigger),
          preventiveCare: kp.care,
        };
      }),
      wellnessGuidance: [
        'अपनी प्रधान प्रकृति (वात/पित्त/कफ) के अनुकूल ताजा, सात्विक व ऋतु-अनुकूल भोजन लें।',
        'षष्ठ भाव, लग्न व चंद्र के बल हेतु प्रतिदिन प्राणायाम, सूर्योदय जागरण व पर्याप्त विश्राम करें।',
        'विपरीत गोचर व अष्टम/षष्ठ दशा में नियमित स्वास्थ्य जांच कराते रहें।',
      ],
    },
    other: {
      astroVastu: suite.other.astroVastu.map((av) => ({
        ...av,
        direction: DIRECTION_HI[av.direction] ?? replaceEnTermsWithHi(av.direction),
        planet: planetToHi(av.planet),
        signName: signToHi(av.signName),
        tip:
          av.status === 'Strong'
            ? `${DIRECTION_HI[av.direction] ?? av.direction} दिशा कुंडली में बली है — यहाँ मुख्य कार्य कक्ष या पूजा/अध्ययन स्थान रखना शुभ रहेगा।`
            : av.status === 'Balanced'
              ? `${DIRECTION_HI[av.direction] ?? av.direction} दिशा संतुलित है — यहाँ स्वच्छता, प्रकाश व व्यवस्था बनाए रखें।`
              : `${DIRECTION_HI[av.direction] ?? av.direction} दिशा में भारी कबाड़ या अव्यवस्था न रखें; संबंधित ग्रह का रंग व पौधा शुभता बढ़ाएगा।`,
      })),
      taraBalaSummary: suite.other.taraBalaSummary.map((tb) => ({
        ...tb,
        nakshatra: trTerm(tb.nakshatra, 'hi'),
        taraName: TARA_HI[tb.taraName] ?? trTerm(tb.taraName, 'hi'),
      })),
      westernVedicBridge: {
        ...suite.other.westernVedicBridge,
        siderealSun: replaceEnTermsWithHi(suite.other.westernVedicBridge.siderealSun),
        tropicalSun: replaceEnTermsWithHi(suite.other.westernVedicBridge.tropicalSun),
        siderealMoon: replaceEnTermsWithHi(suite.other.westernVedicBridge.siderealMoon),
        tropicalMoon: replaceEnTermsWithHi(suite.other.westernVedicBridge.tropicalMoon),
        siderealAsc: replaceEnTermsWithHi(suite.other.westernVedicBridge.siderealAsc),
        tropicalAsc: replaceEnTermsWithHi(suite.other.westernVedicBridge.tropicalAsc),
        note: `वैदिक निरयण (अयनांश युक्त) व पाश्चात्य सायन (Tropical) पद्धति में ~${chart.ayanamsaDeg.toFixed(1)}° का अंतर होता है, जिससे आपकी नक्षत्रीय व सौर राशि का तुलनात्मक अध्ययन स्पष्ट होता है।`,
      },
    },
  };
}

export function localizeDashaDetailHi(
  detail: DashaPredictionDetail,
  _chart: ChartData,
  levelLabel: 'mahadasha' | 'antardasha' | 'pratyantardasha' | 'yogini'
): DashaPredictionDetail {
  if (detail.score === 0 && detail.activatedHouses.length === 0) {
    return detail;
  }
  const mdHi = levelLabel === 'yogini' ? detail.mdLord : planetToHi(detail.mdLord);
  const adHi = detail.adLord ? (levelLabel === 'yogini' ? detail.adLord : planetToHi(detail.adLord)) : undefined;
  const pdHi = detail.pdLord ? planetToHi(detail.pdLord) : undefined;
  const titleHi = pdHi
    ? `${mdHi} → ${adHi} → ${pdHi}`
    : adHi
      ? `${mdHi} → ${adHi}`
      : `${mdHi} ${levelLabel === 'yogini' ? 'योगिनी दशा' : 'महादशा'}`;

  return {
    ...detail,
    title: titleHi,
    mdLord: mdHi,
    adLord: adHi,
    pdLord: pdHi,
    mdSummary: `${mdHi} ${levelLabel === 'yogini' ? 'योगिनी' : 'महादशा'} मुख्य रूप से ${houseListHi(detail.activatedHouses)} के परिणाम सक्रिय करती है (दशा बल: ${detail.score}/100)।`,
    adSummary: adHi ? `${adHi} अंतरदशा में ${HOUSE_DOMAIN_HI[detail.activatedHouses[0] ?? 1]} व संबद्ध कार्यों में गति आती है।` : undefined,
    pdSummary: pdHi ? `${pdHi} प्रत्यंतरदशा घटनाओं के घटित होने का सूक्ष्म समय बिंदु निर्धारित करती है।` : undefined,
    d9AndD10Note: replaceEnTermsWithHi(detail.d9AndD10Note)
      .replace(/In D9 Navamsa & D10 Dasamsa/i, 'नवांश (D9) व दशमांश (D10) में'),
    keyEffects: detail.keyEffects.map((ef) => replaceEnTermsWithHi(ef)),
    guidance: `इस दशा अवधि में (${detail.startDate} से ${detail.endDate}) सक्रिय भावों (${houseListHi(detail.activatedHouses)}) से जुड़े कर्म, संयम और मंत्र-साधना विशेष फलदायी रहेंगे।`,
  };
}

export function localizePrashnaHi(
  analysis: PrashnaAnalysis,
  horaryChart: ChartData
): PrashnaAnalysis {
  const catLabelsHi: Record<string, string> = {
    general: 'सामान्य जीवन व निर्णय',
    career: 'करियर, नौकरी व पदोन्नति',
    marriage: 'विवाह, प्रेम व संबंध',
    wealth: 'धन, व्यापार व आर्थिक लाभ',
    education: 'शिक्षा, परीक्षा व विद्या',
    health: 'स्वास्थ्य व रोग निवारण',
    litigation: 'न्यायालय, विवाद व शत्रु विजय',
    travel: 'यात्रा एवं विदेश गमन',
    property: 'भूमि, मकान एवं वाहन',
    lost_object: 'खोई हुई वस्तु / गुम व्यक्ति',
  };

  const lagnaLHi = planetToHi(analysis.lagnaLord);
  const karyHi = planetToHi(analysis.karyesha);
  const hAscSign = trSign(horaryChart.ascendant.signIndex, 'hi');
  const hMoon = horaryChart.planets.find((p) => p.id === 'Moon')!;

  return {
    ...analysis,
    categoryLabel: catLabelsHi[analysis.category] ?? analysis.categoryLabel,
    horaryAscSign: analysis.horaryAscSign ? signToHi(analysis.horaryAscSign) : hAscSign,
    lagnaLordPlacement: replaceEnTermsWithHi(analysis.lagnaLordPlacement),
    karyeshaPlacement: replaceEnTermsWithHi(analysis.karyeshaPlacement),
    tajikaYoga: replaceEnTermsWithHi(analysis.tajikaYoga),
    tajikaDetail: `ताजिक विश्लेषण: लग्नेश ${lagnaLHi} और कार्येश (${analysis.queryHouse}वें भावेश) ${karyHi} के बीच ${replaceEnTermsWithHi(analysis.tajikaYoga)} योग बन रहा है, जो प्रश्न की सफलता/गति को दर्शाता है (${analysis.outcomeScore}/100)।`,
    moonCondition: `प्रश्न चंद्रमा ${trSign(hMoon.signIndex, 'hi')} (${hMoon.rasiHouseNumber}वें भाव, ${trTerm(horaryChart.panchang.nakshatra.name, 'hi')} नक्षत्र) में होकर मन व कार्य की तत्काल परिस्थिति दर्शाते हैं।`,
    panchangOmen: `प्रश्न शकुन: ${trTerm(horaryChart.panchang.vara.name, 'hi')}, ${trTerm(horaryChart.panchang.tithi.name, 'hi')} तिथि, ${trTerm(horaryChart.panchang.yoga.name, 'hi')} योग एवं ${trTerm(horaryChart.panchang.karana.name, 'hi')} करण।`,
    timingEstimate: replaceEnTermsWithHi(analysis.timingEstimate)
      .replace(/Short term \/ Movable/gi, 'शीघ्र (चर लग्न/राशि)')
      .replace(/Medium term/gi, 'मध्यम अवधि (प्रयास सहित)')
      .replace(/Long term \/ Fixed/gi, 'दीर्घ अवधि / धैर्य (स्थिर राशि)')
      .replace(/weeks?/gi, 'सप्ताह')
      .replace(/months?/gi, 'माह')
      .replace(/days?/gi, 'दिन'),
    lostObjectDirection: replaceEnTermsWithHi(analysis.lostObjectDirection)
      .replace(/East/gi, 'पूर्व')
      .replace(/West/gi, 'पश्चिम')
      .replace(/North/gi, 'उत्तर')
      .replace(/South/gi, 'दक्षिण'),
    kpHoraryNote: `KP प्रश्न कुंडली: ${analysis.queryHouse}वें भाव व लग्न उप-स्वामी (Sub-Lord) के कार्येश संबंध से सफलता अंक ${analysis.outcomeScore}/100 बनते हैं।`,
    keyInsights: [
      `लग्न ${hAscSign} (स्वामी ${lagnaLHi}) प्रश्नकर्ता की वर्तमान मानसिक व भौतिक स्थिति दर्शाता है।`,
      `कार्य भाव (${analysis.queryHouse}वां भाव — ${HOUSE_DOMAIN_HI[analysis.queryHouse]}) और कार्येश ${karyHi} की युति/दृष्टि कार्य सिद्धि की सूचक है।`,
      `समग्र प्रश्न परिणाम: ${trBadge(analysis.verdict, 'hi')}।`,
    ],
    advice:
      analysis.outcomeScore >= 70
        ? 'प्रश्न कुंडली अत्यंत अनुकूल संकेत दे रही है; आत्मविश्वास के साथ शुभ समय में कार्य प्रारंभ करें।'
        : analysis.outcomeScore >= 50
          ? 'सफलता संभव है, परंतु योजना, स्पष्ट संवाद और धैर्यपूर्वक प्रयास आवश्यक होंगे।'
          : 'अभी परिस्थितियाँ पूरी तरह अनुकूल नहीं हैं; कुछ समय प्रतीक्षा कर रणनीति संशोधित करना श्रेयस्कर है।',
  };
}

export function localizeMatchResultHi(
  res: MatchMakingResult,
  bride: ChartData,
  groom: ChartData
): MatchMakingResult {
  if (res.paramayusLocked?.exceeded) {
    return {
      ...res,
      verdict: res.paramayusLocked.titleHi,
      combinedVerdict: res.paramayusLocked.messageHi,
    };
  }
  const kootaHiNames: Record<string, { name: string; focus: string }> = {
    Varna: { name: 'वर्ण', focus: 'आध्यात्मिक व कार्य स्तर' },
    Vashya: { name: 'वश्य', focus: 'परस्पर आकर्षण व नियंत्रण' },
    Tara: { name: 'तारा', focus: 'स्वास्थ्य, आयु व सौभाग्य' },
    Yoni: { name: 'योनि', focus: 'शारीरिक व अंतरंग सामंजस्य' },
    'Graha Maitri': { name: 'ग्रह मैत्री', focus: 'मानसिक मित्रता व विचार' },
    Gana: { name: 'गण', focus: 'स्वभाव व जीवनशैली' },
    Bhakoot: { name: 'भकूट', focus: 'आर्थिक समृद्धि व भावनात्मक सुख' },
    Nadi: { name: 'नाड़ी', focus: 'स्वास्थ्य, आनुवंशिकी व संतान सुख' },
  };

  const verdictHi =
    res.totalObtained >= 28
      ? 'सर्वोत्तम मिलान (28+ गुण)'
      : res.totalObtained >= 21
        ? 'उत्तम / शुभ मिलान (21–27 गुण)'
        : res.totalObtained >= 18
          ? 'मध्यम / स्वीकृत मिलान (18–20 गुण)'
          : 'कम गुण मिलान (< 18) — पूर्ण कुंडली परीक्षण आवश्यक';

  const combinedVerdictHi =
    res.kundaliScore >= 75 && res.totalObtained >= 18
      ? 'अत्यंत शुभ एवं संतुलित विवाह योग (गुण + पूर्ण कुंडली दोनों उत्तम)'
      : res.kundaliScore >= 60
        ? 'संतुलित विवाह योग (परस्पर संवाद व पापांश मिलान के साथ अनुकूल)'
        : 'विचारणीय योग — योग्य ज्योतिषी से विस्तृत दशा व नवांश परीक्षण कराएँ';

  return {
    ...res,
    verdict: verdictHi,
    combinedVerdict: combinedVerdictHi,
    kootas: res.kootas.map((k) => {
      const m = kootaHiNames[k.name];
      return {
        ...k,
        name: m ? `${m.name}` : k.name,
        sanskrit: m ? m.focus : k.sanskrit,
        brideValue: trTerm(replaceEnTermsWithHi(k.brideValue), 'hi'),
        groomValue: trTerm(replaceEnTermsWithHi(k.groomValue), 'hi'),
        note: `${m?.focus ?? k.name}: ${k.obtainedPoints}/${k.maxPoints} अंक (${trBadge(k.status, 'hi')})।`,
      };
    }),
    brideManglik: {
      ...res.brideManglik,
      note: res.brideManglik.isManglik
        ? `मांगलिक उपस्थित (${replaceEnTermsWithHi(res.brideManglik.note)})`
        : replaceEnTermsWithHi(res.brideManglik.note).replace(/Non-Manglik/i, 'मांगलिक नहीं'),
    },
    groomManglik: {
      ...res.groomManglik,
      note: res.groomManglik.isManglik
        ? `मांगलिक उपस्थित (${replaceEnTermsWithHi(res.groomManglik.note)})`
        : replaceEnTermsWithHi(res.groomManglik.note).replace(/Non-Manglik/i, 'मांगलिक नहीं'),
    },
    papaSamyam: {
      ...res.papaSamyam,
      note: `वधू पापांश: ${res.papaSamyam.bridePapaPoints} अंक बनाम वर पापांश: ${res.papaSamyam.groomPapaPoints} अंक — ${trBadge(res.papaSamyam.status, 'hi')}।`,
    },
    sexualCompatibility: {
      ...res.sexualCompatibility,
      venusMarsCrossLinks: res.sexualCompatibility.venusMarsCrossLinks.map(replaceEnTermsWithHi),
      shayanaAndEighthNote: `शयन सुख (12वां भाव) व अष्टम भाव के अनुसार अंतरंग सामंजस्य स्कोर ${res.sexualCompatibility.score}/100 (${trBadge(res.sexualCompatibility.chemistryLevel, 'hi')}) है।`,
      yoniAndLibidoNote: `योनि मिलान एवं शुक्र-मंगल बल से शारीरिक आकर्षण व अंतरंग तृप्ति संतुलित व आनंदपूर्ण रहने के संकेत हैं।`,
      brideArchetype: replaceEnTermsWithHi(res.sexualCompatibility.brideArchetype),
      groomArchetype: replaceEnTermsWithHi(res.sexualCompatibility.groomArchetype),
      guidance: `दोनों साथियों के मध्य स्नेह, विश्वास, खुला संवाद व एक-दूसरे की भावनात्मक आवश्यकताओं का सम्मान वैवाहिक और शयन सुख को प्रगाढ़ बनाएगा।`,
    },
    kundaliPillars: res.kundaliPillars.map((p) => {
      const brideAsc = trSign(bride.ascendant.signIndex, 'hi');
      const groomAsc = trSign(groom.ascendant.signIndex, 'hi');
      return {
        ...p,
        title: replaceEnTermsWithHi(p.title)
          .replace(/7th Lord & D9 Navamsa Synastry/i, 'सप्तम भाव एवं नवांश (D9) सामंजस्य')
          .replace(/Lagna & Moon Temperament Harmony/i, 'लग्न व चंद्र स्वभाव सामंजस्य')
          .replace(/Longevity, Health & Family Continuity/i, 'आयु, स्वास्थ्य एवं वंश/संतान स्थिरता')
          .replace(/Financial & Career Partnership/i, 'आर्थिक एवं करियर साझेदारी')
          .replace(/Manglik & Papa-Samyam Balance/i, 'मांगलिक व पापांश संतुलन')
          .replace(/Running Dasha Synchronization/i, 'वर्तमान दशा समन्वय'),
        summary: `अंक: ${p.score}/100 (${trBadge(p.status, 'hi')}) — वधू (${brideAsc}) व वर (${groomAsc}) की कुंडली में यह स्तंभ विवाह के दीर्घकालिक सुख की समीक्षा करता है।`,
        details: p.details.map(replaceEnTermsWithHi),
      };
    }),
  };
}

export function localizeYogasHi(yogas: YogaResult[]): YogaResult[] {
  return yogas.map((y) => ({
    ...y,
    name: replaceEnTermsWithHi(y.name),
    planets: y.planets.map(planetToHi),
    description: replaceEnTermsWithHi(y.description),
  }));
}

export function localizeAvasthasHi(rep: AvasthaUpagrahaReport): AvasthaUpagrahaReport {
  return {
    ...rep,
    avasthas: rep.avasthas.map((a) => ({
      ...a,
      baladi: a.baladi
        .replace(/Bala \(Infant · 25%\)/i, 'बाल अवस्था (25% फल)')
        .replace(/Kumara \(Adolescent · 50%\)/i, 'कुमार अवस्था (50% फल)')
        .replace(/Yuva \(Youth · 100%\)/i, 'युवा अवस्था (100% पूर्ण फल)')
        .replace(/Vriddha \(Aged · 12%\)/i, 'वृद्ध अवस्था (12% फल)')
        .replace(/Mrita \(Dormant · 0%\)/i, 'मृत अवस्था (न्यून फल)'),
      deeptadi: replaceEnTermsWithHi(a.deeptadi),
      resultCapacity: replaceEnTermsWithHi(a.resultCapacity)
        .replace(/Strong\/Youthful/i, 'प्रबल/युवा')
        .replace(/Active/i, 'सक्रिय'),
    })),
    grahaYuddha: rep.grahaYuddha.map((g) => ({
      ...g,
      signName: signToHi(g.signName),
      note: `${planetToHi(g.winner)} ने ${planetToHi(g.loser)} को ग्रह युद्ध में परास्त किया (${g.separationDeg.toFixed(2)}° अंतर, ${signToHi(g.signName)})।`,
    })),
    upagrahas: rep.upagrahas.map((u) => ({
      ...u,
      signName: signToHi(u.signName),
      nature: u.nature
        .replace(/Malefic \/ Saturn-like/i, 'पाप प्रभाव (शनि तुल्य सावधानी)')
        .replace(/Subtle Transformation/i, 'सूक्ष्म कर्म व परीक्षा कारक')
        .replace(/Mars-like \/ Intense/i, 'तीव्र / अग्नि कारक')
        .replace(/Sun-like \/ Fiery/i, 'सूर्य तुल्य तेजस्वी')
        .replace(/Mercury-like \/ Restless/i, 'चंचल / बौद्धिक')
        .replace(/Rahu-like/i, 'राहु तुल्य छाया बिंदु'),
    })),
    bhriguBindu: {
      ...rep.bhriguBindu,
      signName: signToHi(rep.bhriguBindu.signName),
      note: `भृगु बिंदु (राहु-चंद्र मध्य बिंदु) ${signToHi(rep.bhriguBindu.signName)} राशि के ${rep.bhriguBindu.house}वें भाव में है — जब शुभ ग्रह इस पर से गोचर करते हैं, तब भाग्य के बड़े अवसर आते हैं।`,
    },
    beejaSphuta: {
      ...rep.beejaSphuta,
      signName: signToHi(rep.beejaSphuta.signName),
      strengthNote: `बीज स्फुट ${signToHi(rep.beejaSphuta.signName)} राशि में है (${replaceEnTermsWithHi(rep.beejaSphuta.strengthNote)})।`,
    },
    kshetraSphuta: {
      ...rep.kshetraSphuta,
      signName: signToHi(rep.kshetraSphuta.signName),
      strengthNote: `क्षेत्र स्फुट ${signToHi(rep.kshetraSphuta.signName)} राशि में है (${replaceEnTermsWithHi(rep.kshetraSphuta.strengthNote)})।`,
    },
  };
}

export function localizeBtrHi(snap: BtrSnapshot): BtrSnapshot {
  return {
    ...snap,
    d1LagnaSign: signToHi(snap.d1LagnaSign),
    d9LagnaSign: signToHi(snap.d9LagnaSign),
    d10LagnaSign: signToHi(snap.d10LagnaSign),
    d60LagnaSign: signToHi(snap.d60LagnaSign),
    kpAscSubLord: planetToHi(snap.kpAscSubLord),
    kpMcSubLord: planetToHi(snap.kpMcSubLord),
    pranapadaSign: signToHi(snap.pranapadaSign),
    kundaSign: signToHi(snap.kundaSign),
    alignmentNote:
      snap.pranapadaAligned && snap.kundaAligned
        ? 'उत्तम BPHS जन्म समय मिलान: प्राणपद व कुंद लग्न दोनों शास्त्रीय 1/5/9 त्रिकोण में हैं!'
        : snap.pranapadaAligned
          ? 'प्राणपद लग्न जन्म लग्न/चंद्र से शुभ त्रिकोण सामंजस्य में है।'
          : snap.kundaAligned
            ? 'कुंद लग्न जन्म चंद्र के त्रिकोण में है; नवांश (D9) व षष्ट्यंश (D60) परिवर्तन जांचें।'
            : 'जन्म समय में कुछ सेकंड/मिनट आगे-पीछे कर जीवन की घटनाओं से D9/D60 व प्राणपद मिलान करें।',
  };
}

export function localizeMuhurtasHi(list: MuhurtaCandidate[]): MuhurtaCandidate[] {
  return list.map((m) => ({
    ...m,
    weekday: trTerm(m.weekday, 'hi'),
    tithi: trTerm(m.tithi, 'hi'),
    nakshatra: trTerm(m.nakshatra, 'hi'),
    yoga: trTerm(m.yoga, 'hi'),
    karana: trTerm(m.karana, 'hi'),
    taraStatus: TARA_HI[m.taraStatus.split(' ')[0]] ?? replaceEnTermsWithHi(m.taraStatus),
    chandraBala: replaceEnTermsWithHi(m.chandraBala)
      .replace(/Good/gi, 'शुभ चंद्रबल')
      .replace(/Weak/gi, 'न्यून चंद्रबल'),
    notes: m.notes.map(replaceEnTermsWithHi),
  }));
}

export function localizeCalendarHi(cal: MultiYearCalendarReport): MultiYearCalendarReport {
  return {
    ingresses: cal.ingresses.map((ing) => ({
      ...ing,
      fromSign: signToHi(ing.fromSign),
      toSign: signToHi(ing.toSign),
      note: `${planetToHi(ing.planet)} का ${signToHi(ing.fromSign)} से ${signToHi(ing.toSign)} में राशि परिवर्तन (चंद्र से ${ing.houseFromMoon}वां, लग्न से ${ing.houseFromLagna}वां भाव)।`,
    })),
    sadeSatiWindows: cal.sadeSatiWindows.map((sw) => ({
      ...sw,
      phase: replaceEnTermsWithHi(sw.phase)
        .replace(/1st Phase.*Rising/i, 'प्रथम चरण (उदय — चंद्र से 12वां शनि)')
        .replace(/Peak.*2nd Phase/i, 'द्वितीय चरण (शिखर — जन्म चंद्र पर शनि)')
        .replace(/3rd Phase.*Setting/i, 'तृतीय चरण (अस्त — चंद्र से 2रा शनि)')
        .replace(/Dhaiya/i, 'शनि ढैया'),
      note: replaceEnTermsWithHi(sw.note),
    })),
    eclipses: cal.eclipses.map((ec) => ({
      ...ec,
      signName: signToHi(ec.signName),
      impactedNatalBodies: ec.impactedNatalBodies.map(replaceEnTermsWithHi),
    })),
  };
}

export function localizeAdvancedDashasHi(adv: AdvancedDashaBundle): AdvancedDashaBundle {
  return {
    ...adv,
    ashtottariReason: adv.ashtottariEligible
      ? 'राहु अपनी लग्नेश के केंद्र/त्रिकोण में स्थित होने से अष्टोत्तरी दशा परंपरागत रूप से लागू होती है।'
      : 'सामान्यतः विंशोत्तरी दशा मुख्य मानी जाती है; अष्टोत्तरी तुलनात्मक अध्ययन हेतु प्रदर्शित है।',
    ashtottari: adv.ashtottari.map((p) => ({
      ...p,
      note: `${planetToHi(p.lord)} अष्टोत्तरी दशा (${p.years} वर्ष) — ${DASA_PLANET_ARCHETYPE_HI[p.lord]}।`,
    })),
    narayanaStartSign: signToHi(adv.narayanaStartSign),
    narayana: adv.narayana.map((n) => ({
      ...n,
      signName: signToHi(n.signName),
      pakaSign: signToHi(n.pakaSign),
      bhogaSign: signToHi(n.bhogaSign),
      note: `लग्न से ${n.houseFromLagna}वां भाव (${HOUSE_DOMAIN_HI[n.houseFromLagna]}) सक्रिय | पाक: ${signToHi(n.pakaSign)}, भोग: ${signToHi(n.bhogaSign)}।`,
    })),
  };
}

export function localizeSudarshanaHi(s: SudarshanaWheelResult): SudarshanaWheelResult {
  return {
    ...s,
    lagnaSign: signToHi(s.lagnaSign),
    moonSign: signToHi(s.moonSign),
    sunSign: signToHi(s.sunSign),
    lagnaOccupants: s.lagnaOccupants.map(planetToHi),
    moonOccupants: s.moonOccupants.map(planetToHi),
    sunOccupants: s.sunOccupants.map(planetToHi),
    synthesis: `आयु वर्ष ${s.age} (${s.year}): लग्न चक्र से ${s.lagnaHouse}वां भाव (${signToHi(s.lagnaSign)}), चंद्र चक्र से ${s.moonHouse}वां भाव (${signToHi(s.moonSign)}) तथा सूर्य चक्र से ${s.sunHouse}वां भाव (${signToHi(s.sunSign)}) सक्रिय हैं। इन तीनों का संयुक्त प्रभाव वर्ष के मुख्य कर्म व फल तय करता है।`,
  };
}

export function getSignNamesHiList(): string[] {
  return SIGN_NAMES_I18N.hi;
}
