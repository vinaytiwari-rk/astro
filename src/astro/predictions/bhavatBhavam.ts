import { NINE_GRAHAS, SIGNS } from '../constants';
import type { ChartData, NineGrahaId, SevenPlanetId } from '../types';

export interface BhavatBhavamHouseItem {
  primaryHouse: number; // H (1..12)
  mirrorHouse: number;  // ((2H - 2) % 12) + 1  (Hth from H)
  principleFormulaEn: string;
  principleFormulaHi: string;
  primarySignIndex: number;
  mirrorSignIndex: number;
  primaryLord: SevenPlanetId;
  mirrorLord: SevenPlanetId;
  primaryLordPlacedHouse: number;
  mirrorLordPlacedHouse: number;
  primarySav: number;
  mirrorSav: number;
  mirrorOccupants: NineGrahaId[];
  synergyScore: number; // 25..96
  tone: 'positive' | 'mixed' | 'negative';
  headlineEn: string;
  headlineHi: string;
  readingEn: string;
  readingHi: string;
  positiveEn: string;
  positiveHi: string;
  negativeEn: string;
  negativeHi: string;
}

export interface BhavatBhavamKeyPair {
  topicEn: string;
  topicHi: string;
  formulaEn: string;
  formulaHi: string;
  derivedHouse: number;
  derivedSignIndex: number;
  derivedLord: SevenPlanetId;
  derivedLordDignity: string;
  sav: number;
  summaryEn: string;
  summaryHi: string;
}

export interface BhavatBhavamReport {
  houses: BhavatBhavamHouseItem[]; // 1..12
  keyDerivatives: BhavatBhavamKeyPair[];
  summaryEn: string;
  summaryHi: string;
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

const BB_RULES: Array<{
  domainEn: string;
  domainHi: string;
  mirrorMeaningEn: string;
  mirrorMeaningHi: string;
  posEn: string;
  posHi: string;
  negEn: string;
  negHi: string;
}> = [
  {
    domainEn: '1st House (Self & Body)', domainHi: 'प्रथम भाव (व्यक्तित्व व देह)',
    mirrorMeaningEn: '1st from 1st is the Lagna itself (reinforced by Arudha Lagna) — identity radiates directly outward.',
    mirrorMeaningHi: 'प्रथम से प्रथम स्वयं लग्न ही है — जातक का आत्मबल व व्यक्तित्व सीधे जीवन की दिशा तय करता है।',
    posEn: 'Strong H1 Lord & SAV produce magnetic presence, health recovery and self-directed rise.',
    posHi: 'लग्नेश बली होने पर उत्तम स्वास्थ्य, आकर्षक व्यक्तित्व और स्व-प्रयास से उन्नति मिलती है।',
    negEn: 'Affliction drains physical immunity and invites head injury, ego isolation or indecisiveness.',
    negHi: 'लग्न पीड़ित होने पर रोग-प्रतिरोधक क्षमता में कमी, सिर दर्द या निर्णयों में भटकाव आता है।',
  },
  {
    domainEn: '2nd House (Wealth & Family)', domainHi: 'द्वितीय भाव (धन, वाणी व कुटुंब)',
    mirrorMeaningEn: '2nd from 2nd is the 3rd House — accumulated wealth & voice sustain via initiative, writing, commerce & siblings.',
    mirrorMeaningHi: 'द्वितीय से द्वितीय तृतीय भाव है — संचित धन व वाणी का पोषण साहस, व्यापार, लेखन व भाई-बहनों से होता है।',
    posEn: 'Strong 3rd house converts vocal persuasion, digital communication or enterprise into liquid wealth.',
    posHi: 'तीसरा भाव बली होने पर बोलचाल, लेखन, मीडिया या स्व-उद्यम से स्थायी धन संचय होता है।',
    negEn: 'Weakness in 3rd house causes wealth leakage through timid efforts, bad contracts or sibling friction.',
    negHi: 'तृतीय भाव कमजोर होने पर अधूरे प्रयासों, अनुबंध त्रुटि या भाई-बहन विवाद से धन की हानि होती है।',
  },
  {
    domainEn: '3rd House (Courage & Enterprise)', domainHi: 'तृतीय भाव (पराक्रम व प्रयास)',
    mirrorMeaningEn: '3rd from 3rd is the 5th House — physical & mental courage feeds from creative intelligence, mantra power & Purva Punya.',
    mirrorMeaningHi: 'तृतीय से तृतीय पंचम भाव है — पराक्रम और कौशल की असली ऊर्जा रचनात्मक बुद्धि, शिक्षा व पूर्व पुण्य से मिलती है।',
    posEn: 'Benefic 5th house sharpens strategic boldness, artistic craft, competitive success & loyal juniors.',
    posHi: 'पंचम भाव शुभ होने पर कुशल रणनीति, रचनात्मक सफलता व प्रतियोगी परीक्षाओं में विजय मिलती है।',
    negEn: 'Afflicted 5th triggers impulsive speculation risks, romantic distractions or scattered mental energy.',
    negHi: 'पंचम भाव पीड़ित होने पर सट्टा/जोखिम, भावुक भटकाव व निर्णयों में अस्थिरता आती है।',
  },
  {
    domainEn: '4th House (Home, Mother & Peace)', domainHi: 'चतुर्थ भाव (माता, गृह, वाहन व सुख)',
    mirrorMeaningEn: '4th from 4th is the 7th House — domestic security & inner peace root into marriage, spouse harmony & public sanctuary.',
    mirrorMeaningHi: 'चतुर्थ से चतुर्थ सप्तम भाव है — घर की शांति, माता-सुख व वाहन-संपत्ति का संतुलन विवाह व जीवनसाथी से जुड़ता है।',
    posEn: 'Harmonious 7th brings property uplift after marriage, serene home life and vehicle comforts.',
    posHi: 'सप्तम भाव बली होने पर विवाह के बाद गृह-संपत्ति में वृद्धि व पारिवारिक शांति प्राप्त होती है।',
    negEn: 'Disturbed 7th brings domestic tension home, property disputes or restless relocations.',
    negHi: 'सप्तम पीड़ित होने पर दांपत्य तनाव का सीधा असर मनःशांति, घर व वाहन सुख पर पड़ता है।',
  },
  {
    domainEn: '5th House (Progeny, Intellect & Merit)', domainHi: 'पंचम भाव (संतान, विद्या व पूर्व पुण्य)',
    mirrorMeaningEn: '5th from 5th is the 9th House — past merit (Purva Punya) flowers into fortune, higher philosophy, blessings & grandchildren.',
    mirrorMeaningHi: 'पंचम से पंचम नवम भाव है — संतान, बुद्धि व मंत्र-शक्ति का फल भाग्योदय, उच्च शिक्षा और धर्म के रूप में प्रकट होता है।',
    posEn: 'Strong 9th blesses progeny growth, righteous mentorship, university research and fortunate windfalls.',
    posHi: 'नवम भाव बली होने पर संतान का भाग्योदय, गुरु कृपा, उच्च अध्ययन व बड़े आर्थिक सौभाग्य मिलते हैं।',
    negEn: 'Afflicted 9th delays academic/child breakthroughs or invites clashes with elders/mentors.',
    negHi: 'नवम पीड़ित होने पर संतान/शिक्षा में विलंब या पिता/गुरु से वैचारिक मतभेद संभव हैं।',
  },
  {
    domainEn: '6th House (Health, Debt & Service)', domainHi: 'षष्ठ भाव (रोग, ऋण, शत्रु व सेवा)',
    mirrorMeaningEn: '6th from 6th is the 11th House — daily struggle, debt or competition either climbs into victory & gains (11th) or drains income.',
    mirrorMeaningHi: 'षष्ठ से षष्ठ एकादश भाव है — नौकरी, परिश्रम व शत्रु-विजय का परिणाम सीधे आय व लाभ (11वां) से जुड़ा है।',
    posEn: 'Strong 11th overwhelms debts and rivals — turns service/litigation into steady profits & awards.',
    posHi: 'एकादश भाव मजबूत होने पर ऋण व रोग समाप्त होकर परिश्रम से निरंतर लाभ व सफलता मिलती है।',
    negEn: 'Afflicted 11th turns legal/medical stress into income blockages or treacherous acquaintances.',
    negHi: 'एकादश पीड़ित होने पर कर्ज, स्वास्थ्य खर्च या कपटी मित्रों से आय प्रभावित हो सकती है।',
  },
  {
    domainEn: '7th House (Marriage & Partnerships)', domainHi: 'सप्तम भाव (विवाह व साझेदारी)',
    mirrorMeaningEn: '7th from 7th is the 1st House (Self) — marriage mirrors your own vitality, integrity and self-respect directly.',
    mirrorMeaningHi: 'सप्तम से सप्तम लग्न (प्रथम भाव) ही है — जीवनसाथी और साझेदार आपके स्वयं के स्वभाव व आचरण का दर्पण होते हैं।',
    posEn: 'Healthy balanced Lagna attracts devoted partners and win-win public or business alliances.',
    posHi: 'लग्न बली व संतुलित होने पर योग्य, निष्ठावान जीवनसाथी और उत्तम साझेदार मिलते हैं।',
    negEn: 'Lagna pride, anger or health neglect directly provokes partner distance, court tension or breakup.',
    negHi: 'स्वयं के अहंकार, क्रोध या स्वास्थ्य उपेक्षा का सीधा नकारात्मक असर दांपत्य व साझेदारी पर पड़ता है।',
  },
  {
    domainEn: '8th House (Longevity & Sudden Events)', domainHi: 'अष्टम भाव (आयु, दुर्घटना व आकस्मिक मोड़)',
    mirrorMeaningEn: '8th from 8th is the 3rd House — classically called the twin Ayushya/longevity pillar; physical breath, endurance & grit defend against crises.',
    mirrorMeaningHi: 'अष्टम से अष्टम तृतीय भाव है — आयु व संकटों से सुरक्षा के लिए अष्टम के साथ तृतीय (पराक्रम व प्राण) मुख्य आधार माना गया है।',
    posEn: 'Strong 3rd grants bounce-back recovery from surgeries/losses and transforms crisis into research/insurance gains.',
    posHi: 'तृतीय भाव बली होने पर संकट, सर्जरी या आकस्मिक झटकों से शीघ्र उबरने व दीर्घायु होने का बल मिलता है।',
    negEn: 'Simultaneous weakness in 8th & 3rd elevates vulnerability to chronic fatigue, reckless accidents or hidden debt shocks.',
    negHi: 'अष्टम व तृतीय दोनों पीड़ित होने पर दुर्घटना, श्वास/कंधे की चोट व आकस्मिक हानि से सतर्क रहना आवश्यक है।',
  },
  {
    domainEn: '9th House (Fortune, Father & Dharma)', domainHi: 'नवम भाव (भाग्य, धर्म व पिता)',
    mirrorMeaningEn: '9th from 9th is the 5th House — divine grace & fatherly lineage anchor through wise choices, mantra & virtuous progeny.',
    mirrorMeaningHi: 'नवम से नवम पंचम भाव है — भाग्य, धर्म और पिता के आशीर्वाद की सार्थकता सद्बुद्धि, मंत्र-निष्ठा व सुयोग्य संतान से होती है।',
    posEn: 'Strong 5th sustains generational luck, scholarship, moral clarity & long-term wealth blessings.',
    posHi: 'पंचम भाव बली होने पर वंश का भाग्योदय, सही समय पर सद्बुद्धि व संतान-पुण्य का लाभ मिलता है।',
    negEn: 'Afflicted 5th weakens judgment during lucky breakthroughs, causing speculative blunders.',
    negHi: 'पंचम पीड़ित होने पर भाग्य के अवसर गलत निर्णय या आवेग के कारण हाथ से फिसल सकते हैं।',
  },
  {
    domainEn: '10th House (Career, Status & Karma)', domainHi: 'दशम भाव (करियर, पद व कर्म)',
    mirrorMeaningEn: '10th from 10th is the 7th House — career rises from solo work into public markets, business alliances, spouse backing & clients.',
    mirrorMeaningHi: 'दशम से दशम सप्तम भाव है — करियर व प्रतिष्ठा का शिखर जन-संपर्क, साझेदारी, व्यापार (व्यवसाय) व जीवनसाथी सहयोग से बनता है।',
    posEn: 'Strong 7th scales profession into leadership, consulting/business enterprise, diplomacy and public fame.',
    posHi: 'सप्तम भाव बली होने पर कार्यक्षेत्र व्यापार, उच्च प्रबंधन, साझेदारी व जन-प्रतिष्ठा में बदलता है।',
    negEn: 'Afflicted 7th causes partnership betrayals, client disputes or personal marital stress spilling onto work.',
    negHi: 'सप्तम पीड़ित होने पर व्यापारिक साझेदारों से विवाद, क्लाइंट हानि या दांपत्य तनाव से करियर बाधित होता है।',
  },
  {
    domainEn: '11th House (Income, Gains & Network)', domainHi: 'एकादश भाव (लाभ, आय व मित्र)',
    mirrorMeaningEn: '11th from 11th is the 9th House — sustained abundance requires righteous luck, long-range ethics, mentors & broader vision.',
    mirrorMeaningHi: 'एकादश से एकादश नवम भाव है — निरंतर धन-लाभ व इच्छा-पूर्ति के पीछे भाग्य, धर्म, गुरु कृपा व दूरदर्शिता काम करती है।',
    posEn: 'Strong 9th turns ordinary effort into compounding fortune, prestigious networks and ethical wealth.',
    posHi: 'नवम भाव मजबूत होने पर कम प्रयास में भी बड़े लाभ, उच्च नेटवर्क व स्थायी समृद्धि प्राप्त होती है।',
    negEn: 'Afflicted 9th brings unethical shortcut temptations that later collapse income streams.',
    negHi: 'नवम पीड़ित होने पर गलत या शॉर्टकट लाभ की चाह बाद में आर्थिक व प्रतिष्ठा की हानि कराती है।',
  },
  {
    domainEn: '12th House (Expenses, Foreign & Moksha)', domainHi: 'द्वादश भाव (व्यय, विदेश व मोक्ष)',
    mirrorMeaningEn: '12th from 12th is the 11th House — what goes out as charity, foreign move or hospital expenditure mirrors directly against 11th-house cashflow.',
    mirrorMeaningHi: 'द्वादश से द्वादश एकादश भाव है — विदेश प्रवास, दान, अस्पताल या खर्च का संतुलन सीधा एकादश भाव की आय पर निर्भर करता है।',
    posEn: 'Healthy 11th > 12th turns foreign work, exports or spiritual retreat into net surplus wealth & restful sleep.',
    posHi: 'एकादश बली होने पर विदेश/निर्यात कार्यों व आध्यात्मिक दान से धन लौटकर आता है व सुखद निद्रा मिलती है।',
    negEn: 'If 12th malefics overpower 11th, hidden losses, hospital bills or sleep insomnia erode savings.',
    negHi: 'द्वादश भाव भारी होने पर अनियंत्रित खर्च, अस्पताल/कानूनी व्यय या अनिद्रा बचत को कम कर सकते हैं।',
  },
];

function digBonus(d: string): number {
  const m: Record<string, number> = {
    Exalted: 16, Moolatrikona: 14, 'Own Sign': 12, 'Great Friend': 9, Friend: 6,
    Neutral: 0, Enemy: -6, 'Great Enemy': -9, Debilitated: -12,
  };
  return m[d] ?? 0;
}

export function computeBhavatBhavamReport(chart: ChartData): BhavatBhavamReport {
  const ascSign = chart.ascendant.signIndex;
  const byId = new Map(chart.planets.map((p) => [p.id, p]));
  const getLord = (h: number) => byId.get(SIGNS[(ascSign + h - 1) % 12].lord)!;
  const savAt = (h: number) => chart.ashtakavarga.sarva[(ascSign + h - 1) % 12];

  const houses: BhavatBhavamHouseItem[] = Array.from({ length: 12 }, (_, idx) => {
    const h = idx + 1;
    const mirror = ((2 * h - 2) % 12) + 1;
    const rule = BB_RULES[idx];
    const pSign = (ascSign + h - 1) % 12;
    const mSign = (ascSign + mirror - 1) % 12;
    const pLord = getLord(h);
    const mLord = getLord(mirror);
    const pSav = savAt(h);
    const mSav = savAt(mirror);
    const mirrorOcc = NINE_GRAHAS.filter((g) => byId.get(g)!.rasiHouseNumber === mirror);

    const dist = ((mLord.signIndex - pLord.signIndex + 12) % 12) + 1;
    const relBonus = [1, 5, 9].includes(dist)
      ? 10
      : [4, 7, 10, 3, 11].includes(dist)
        ? 5
        : [6, 8].includes(dist)
          ? -10
          : -5;

    const rawScore =
      58 +
      digBonus(pLord.dignity) * 0.5 +
      digBonus(mLord.dignity) * 0.5 +
      (pSav + mSav - 56) * 0.45 +
      relBonus;
    const synergyScore = Math.max(28, Math.min(96, Math.round(rawScore)));
    const tone: BhavatBhavamHouseItem['tone'] =
      synergyScore >= 68 ? 'positive' : synergyScore >= 50 ? 'mixed' : 'negative';

    return {
      primaryHouse: h,
      mirrorHouse: mirror,
      principleFormulaEn: `H${h} → ${h}th from H${h} = H${mirror}`,
      principleFormulaHi: `भाव ${h} → ${h} से ${h}वां = भाव ${mirror}`,
      primarySignIndex: pSign,
      mirrorSignIndex: mSign,
      primaryLord: pLord.id as SevenPlanetId,
      mirrorLord: mLord.id as SevenPlanetId,
      primaryLordPlacedHouse: pLord.rasiHouseNumber,
      mirrorLordPlacedHouse: mLord.rasiHouseNumber,
      primarySav: pSav,
      mirrorSav: mSav,
      mirrorOccupants: mirrorOcc,
      synergyScore,
      tone,
      headlineEn: `H${h} (${rule.domainEn.split('—')[0].trim()}) backed by H${mirror} (${SIGNS[mSign].name})`,
      headlineHi: `${rule.domainHi} ↔ भावात् भावम् आधार: ${mirror}वां भाव (${SIGN_HI[mSign]})`,
      readingEn: `${rule.mirrorMeaningEn} In this chart, H${h} Lord ${pLord.id} (${pLord.dignity} in H${pLord.rasiHouseNumber}) pairs with Mirror H${mirror} Lord ${mLord.id} (${mLord.dignity} in H${mLord.rasiHouseNumber}); SAV H${h}=${pSav}, H${mirror}=${mSav}.`,
      readingHi: `${rule.mirrorMeaningHi} कुंडली में ${h}वें भाव के स्वामी ${PLANET_HI[pLord.id]} (${DIGNITY_HI[pLord.dignity]}, ${pLord.rasiHouseNumber}वें) तथा भावात् भावम् ${mirror}वें भाव के स्वामी ${PLANET_HI[mLord.id]} (${DIGNITY_HI[mLord.dignity]}, ${mLord.rasiHouseNumber}वें) का समन्वय ${synergyScore}/100 बल देता है।`,
      positiveEn: rule.posEn,
      positiveHi: rule.posHi,
      negativeEn: rule.negEn,
      negativeHi: rule.negHi,
    };
  });

  // Practical Relational Bhavat Bhavam Derivatives (House of a House)
  const relSpecs: Array<{
    baseH: number;
    offsetH: number;
    topicEn: string;
    topicHi: string;
    meaningEn: string;
    meaningHi: string;
  }> = [
    { baseH: 7, offsetH: 8, topicEn: 'Spouse Longevity & Joint Finance', topicHi: 'जीवनसाथी आयु व संयुक्त धन', meaningEn: '8th from 7th = 2nd House (family & speech)', meaningHi: 'सप्तम से अष्टम = द्वितीय भाव' },
    { baseH: 7, offsetH: 10, topicEn: 'Spouse Career & Status', topicHi: 'जीवनसाथी का करियर व प्रतिष्ठा', meaningEn: '10th from 7th = 4th House (home & foundation)', meaningHi: 'सप्तम से दशम = चतुर्थ भाव' },
    { baseH: 9, offsetH: 10, topicEn: 'Father’s Career & Authority', topicHi: 'पिता का कार्यक्षेत्र व सम्मान', meaningEn: '10th from 9th = 6th House (service & duty)', meaningHi: 'नवम से दशम = षष्ठ भाव' },
    { baseH: 4, offsetH: 8, topicEn: 'Mother’s Health Resilience', topicHi: 'माता का स्वास्थ्य व आयु-बल', meaningEn: '8th from 4th = 11th House (vitality & gains)', meaningHi: 'चतुर्थ से अष्टम = एकादश भाव' },
    { baseH: 5, offsetH: 9, topicEn: 'Children’s Fortune & Higher Rise', topicHi: 'संतान का भाग्य व उच्च उन्नति', meaningEn: '9th from 5th = 1st House (self & dharma)', meaningHi: 'पंचम से नवम = प्रथम भाव (लग्न)' },
    { baseH: 10, offsetH: 10, topicEn: 'Expansion Beyond Employment', topicHi: 'नौकरी से बड़े व्यापार में विस्तार', meaningEn: '10th from 10th = 7th House (enterprise & clients)', meaningHi: 'दशम से दशम = सप्तम भाव' },
  ];

  const keyDerivatives: BhavatBhavamKeyPair[] = relSpecs.map((sp) => {
    const derivedH = ((sp.baseH - 1 + sp.offsetH - 1) % 12) + 1;
    const dSign = (ascSign + derivedH - 1) % 12;
    const dLord = getLord(derivedH);
    const dSav = savAt(derivedH);
    return {
      topicEn: sp.topicEn,
      topicHi: sp.topicHi,
      formulaEn: `${sp.offsetH}th from ${sp.baseH}th → House ${derivedH}`,
      formulaHi: `${sp.baseH}वें से ${sp.offsetH}वां → भाव ${derivedH}`,
      derivedHouse: derivedH,
      derivedSignIndex: dSign,
      derivedLord: dLord.id as SevenPlanetId,
      derivedLordDignity: dLord.dignity,
      sav: dSav,
      summaryEn: `${sp.meaningEn}: ${SIGNS[dSign].name} ruled by ${dLord.id} (${dLord.dignity} in H${dLord.rasiHouseNumber}, SAV ${dSav}).`,
      summaryHi: `${sp.meaningHi}: ${SIGN_HI[dSign]} राशि, स्वामी ${PLANET_HI[dLord.id]} (${DIGNITY_HI[dLord.dignity]}, ${dLord.rasiHouseNumber}वें भाव, SAV ${dSav})।`,
    };
  });

  const avgSynergy = Math.round(houses.reduce((acc, x) => acc + x.synergyScore, 0) / 12);
  const strongest = [...houses].sort((a, b) => b.synergyScore - a.synergyScore)[0];
  const weakest = [...houses].sort((a, b) => a.synergyScore - b.synergyScore)[0];

  return {
    houses,
    keyDerivatives,
    summaryEn: `Average Bhavat Bhavam resonance: ${avgSynergy}/100. Strongest reinforced pillar: House ${strongest.primaryHouse} ↔ H${strongest.mirrorHouse} (${strongest.synergyScore}/100); watch House ${weakest.primaryHouse} ↔ H${weakest.mirrorHouse} (${weakest.synergyScore}/100).`,
    summaryHi: `औसत भावात् भावम् संतुलन: ${avgSynergy}/100। सर्वाधिक सशक्त युग्म: भाव ${strongest.primaryHouse} ↔ भाव ${strongest.mirrorHouse} (${strongest.synergyScore}/100); विशेष ध्यान अपेक्षित: भाव ${weakest.primaryHouse} ↔ भाव ${weakest.mirrorHouse} (${weakest.synergyScore}/100)।`,
  };
}

export function computeCustomBhavatBhavam(
  chart: ChartData,
  baseHouse: number,
  offsetHouse: number
): BhavatBhavamKeyPair {
  const ascSign = chart.ascendant.signIndex;
  const byId = new Map(chart.planets.map((p) => [p.id, p]));
  const derivedHouse = ((baseHouse - 1 + offsetHouse - 1) % 12) + 1;
  const dSign = (ascSign + derivedHouse - 1) % 12;
  const dLord = byId.get(SIGNS[dSign].lord)!;
  const dSav = chart.ashtakavarga.sarva[dSign];
  const occ = NINE_GRAHAS.filter((g) => byId.get(g)!.rasiHouseNumber === derivedHouse);

  return {
    topicEn: `${offsetHouse}th House Matters of House ${baseHouse}`,
    topicHi: `भाव ${baseHouse} का ${offsetHouse}वां भाव फल`,
    formulaEn: `${offsetHouse}th from H${baseHouse} = H${derivedHouse}`,
    formulaHi: `${baseHouse}वें भाव से ${offsetHouse}वां = भाव ${derivedHouse}`,
    derivedHouse,
    derivedSignIndex: dSign,
    derivedLord: dLord.id as SevenPlanetId,
    derivedLordDignity: dLord.dignity,
    sav: dSav,
    summaryEn: `Points to House ${derivedHouse} (${SIGNS[dSign].name}), Lord ${dLord.id} (${dLord.dignity} in H${dLord.rasiHouseNumber}), SAV=${dSav}${occ.length ? `, Occupants: ${occ.join(', ')}` : ', Empty'}.`,
    summaryHi: `लक्षित भाव ${derivedHouse} (${SIGN_HI[dSign]}), स्वामी ${PLANET_HI[dLord.id]} (${DIGNITY_HI[dLord.dignity]}, ${dLord.rasiHouseNumber}वें भाव), SAV=${dSav}${occ.length ? `, स्थित ग्रह: ${occ.map((x) => PLANET_HI[x]).join(', ')}` : ', रिक्त भाव'}।`,
  };
}
