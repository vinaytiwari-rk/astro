import { NINE_GRAHAS, SEVEN_PLANETS, SIGNS } from '../constants';
import type { BodyPosition, ChartData, NineGrahaId, PlanetId, SevenPlanetId } from '../types';

export interface BspCycleReading {
  age: number;
  cyclicalHouse: number;
  houseSignIndex: number;
  houseSignName: string;
  houseLord: SevenPlanetId;
  houseLordPlacementHouse: number;
  occupants: NineGrahaId[];
  synthesisEn: string;
  synthesisHi: string;
}

export interface BspSpecificTrigger {
  age: number;
  ruleCode: string;
  sourcePlanet: NineGrahaId;
  offsetHouse: number;
  triggeredHouse: number;
  triggeredSignIndex: number;
  triggeredSignName: string;
  occupants: NineGrahaId[];
  aspects: NineGrahaId[];
  triggerThemeEn: string;
  triggerThemeHi: string;
  readingEn: string;
  readingHi: string;
}

export interface BhriguSaralPaddhatiReport {
  currentAge: number;
  cyclical12YearReading: BspCycleReading;
  activeSpecificTriggers: BspSpecificTrigger[];
  upcomingTriggers: BspSpecificTrigger[];
  lifetimeTimeline: BspSpecificTrigger[];
}

function houseBetween(fromSign: number, toSign: number): number {
  return ((toSign - fromSign + 12) % 12) + 1;
}

function signOfHouse(ascSign: number, houseNum: number): number {
  return (ascSign + houseNum - 1) % 12;
}

const BSP_RULES_TABLE: Array<{
  age: number;
  ruleCode: string;
  planet: NineGrahaId;
  offset: number;
  themeEn: string;
  themeHi: string;
}> = [
  { age: 10, ruleCode: 'BSP-1', planet: 'Sun', offset: 6, themeEn: 'Competition, Physical Resistance & Paternal Lessons', themeHi: 'प्रतिस्पर्धा, शारीरिक प्रतिरोध व पितृ सहयोग' },
  { age: 18, ruleCode: 'BSP-2', planet: 'Moon', offset: 1, themeEn: 'Emotional Awakening, Journeys & Identity Transition', themeHi: 'भावनात्मक जागरण, यात्राएं व आत्म-पहचान' },
  { age: 20, ruleCode: 'BSP-3', planet: 'Saturn', offset: 3, themeEn: 'Skill Acquisition, Diligence & Hard Work Threshold', themeHi: 'कौशल संवर्धन, परिश्रम व नए प्रयासों की शुरुआत' },
  { age: 21, ruleCode: 'BSP-4', planet: 'Saturn', offset: 4, themeEn: 'Academic Milestones, Residence Shift & Emotional Foundation', themeHi: 'उच्च अध्ययन, स्थान परिवर्तन व भावनात्मक आधार' },
  { age: 22, ruleCode: 'BSP-5A', planet: 'Jupiter', offset: 9, themeEn: 'Higher Dharma, Guru Blessings & Long Distance Travel', themeHi: 'गुरु कृपा, धर्म ज्ञान व दूरस्थ यात्राएं' },
  { age: 22, ruleCode: 'BSP-5B', planet: 'Rahu', offset: 5, themeEn: 'Unconventional Ambition, Creative Drive & Romance', themeHi: 'अपरंपरागत महत्वाकांक्षा, सृजनशीलता व प्रेम' },
  { age: 24, ruleCode: 'BSP-6A', planet: 'Ketu', offset: 12, themeEn: 'Spiritual Realization, Detachment & Career Launchpad', themeHi: 'आध्यात्मिक चिंतन, अनासक्ति व कार्यक्षेत्र में प्रविष्टि' },
  { age: 24, ruleCode: 'BSP-6B', planet: 'Saturn', offset: 4, themeEn: 'Property Stability & Establishing Own Base', themeHi: 'स्थिरता, पारिवारिक दायित्व व नवीन आधार' },
  { age: 24, ruleCode: 'BSP-6C', planet: 'Mercury', offset: 10, themeEn: 'Professional Intelligence, Writing & Commercial Success', themeHi: 'व्यावसायिक बुद्धि, लेखन, संचार व वाणिज्यिक लाभ' },
  { age: 25, ruleCode: 'BSP-7', planet: 'Sun', offset: 1, themeEn: 'Self-Illumination, Prestige & Independent Career Authority', themeHi: 'आत्म-तेज, प्रतिष्ठा व स्वतंत्र व्यावसायिक अधिकार' },
  { age: 27, ruleCode: 'BSP-8', planet: 'Mars', offset: 10, themeEn: 'Vigorous Professional Drive, Dynamic Ambition & Physical Drive', themeHi: 'प्रचंड कार्यक्षमता, प्रशासनिक उत्साह व साहसिक निर्णय' },
  { age: 28, ruleCode: 'BSP-9A', planet: 'Saturn', offset: 6, themeEn: 'Overcoming Obstacles, Legal/Competitive Victory & Mastery', themeHi: 'बाधाओं पर विजय, प्रतिस्पर्धा में सफलता व कार्य में दक्षता' },
  { age: 28, ruleCode: 'BSP-9B', planet: 'Mercury', offset: 5, themeEn: 'Intellectual Recognition, Speculative Gain & Wise Planning', themeHi: 'बौद्धिक ख्याति, परामर्श व भविष्योन्मुखी योजनाएं' },
  { age: 30, ruleCode: 'BSP-10', planet: 'Rahu', offset: 1, themeEn: 'Major Karmic Redirection, Sudden Recognition & External Rise', themeHi: 'बड़ा कर्मिक मोड़, आकस्मिक पहचान व दूरगामी उत्थान' },
  { age: 32, ruleCode: 'BSP-11A', planet: 'Moon', offset: 2, themeEn: 'Financial Accumulation, Family Speech & Asset Growth', themeHi: 'धन संग्रह, पारिवारिक सम्मान व संपत्ति वृद्धि' },
  { age: 32, ruleCode: 'BSP-11B', planet: 'Saturn', offset: 10, themeEn: 'Peak Career Solidification, Heavy Responsibilities & Authority', themeHi: 'करियर की ठोस नींव, वरिष्ठ पदभार व स्थायित्व' },
  { age: 32, ruleCode: 'BSP-11C', planet: 'Jupiter', offset: 5, themeEn: 'Progeny Blessings, Divine Grace & Auspicious Merit', themeHi: 'संतान सुख, भगवत कृपा व पूर्वपुण्य का उदय' },
  { age: 32, ruleCode: 'BSP-11D', planet: 'Mars', offset: 4, themeEn: 'Fixed Property, Vehicles & Real Estate Materialization', themeHi: 'अचल संपत्ति, वाहन सुख व भूमि लाभ' },
  { age: 32, ruleCode: 'BSP-11E', planet: 'Sun', offset: 1, themeEn: 'Dignity, Vitality & Radiant Social Leadership', themeHi: 'मान-सम्मान, उत्तम स्वास्थ्य व सामाजिक नेतृत्व' },
  { age: 35, ruleCode: 'BSP-12', planet: 'Jupiter', offset: 1, themeEn: 'Spiritual Maturity, Advisory Role & Expansion of Fortune', themeHi: 'आध्यात्मिक परिपक्वता, सलाहकार की भूमिका व भाग्य वृद्धि' },
  { age: 36, ruleCode: 'BSP-13', planet: 'Mars', offset: 8, themeEn: 'Overcoming Critical Transformation, Hidden Wealth & Endurance', themeHi: 'परिवर्तनकारी घटनाक्रम, गुप्त धन/अनुसंधान व विपत्ति निवारण' },
  { age: 37, ruleCode: 'BSP-14A', planet: 'Rahu', offset: 9, themeEn: 'Unconventional Fortune, Foreign Ventures & Destiny Shift', themeHi: 'अकल्पनीय भाग्योदय, विदेशी संबंध व भाग्य में परिवर्तन' },
  { age: 37, ruleCode: 'BSP-14B', planet: 'Jupiter', offset: 1, themeEn: 'Universal Wisdom, Ethical Guidance & Social Renown', themeHi: 'सार्वभौमिक ज्ञान, नैतिक प्रतिष्ठा व समाज में आदर' },
  { age: 38, ruleCode: 'BSP-15', planet: 'Rahu', offset: 6, themeEn: 'Neutralizing Hidden Rivals, Healthcare Optimization & Victory', themeHi: 'गुप्त शत्रुओं का शमन, स्वास्थ्य सुधार व विजय' },
  { age: 40, ruleCode: 'BSP-16A', planet: 'Jupiter', offset: 9, themeEn: 'Supreme Wisdom, Philanthropy & Philosophical Heights', themeHi: 'परम ज्ञान, परोपकार व आध्यात्मिक प्रतिष्ठा' },
  { age: 40, ruleCode: 'BSP-16B', planet: 'Mercury', offset: 7, themeEn: 'Commercial Partnerships, Contracts & Diplomatic Triumph', themeHi: 'व्यापारिक अनुबंध, साझेदारी में लाभ व कूटनीतिक सफलता' },
  { age: 48, ruleCode: 'BSP-17', planet: 'Saturn', offset: 4, themeEn: 'Consolidation of Estate, Peaceful Foundation & Family Solace', themeHi: 'स्थिर गृहस्थी, अचल संपत्ति सुदृढ़ीकरण व मानसिक शांति' },
  { age: 51, ruleCode: 'BSP-18', planet: 'Saturn', offset: 1, themeEn: 'Rewards of Life-Long Labor, Senior Statesman Status', themeHi: 'जीवनभर के परिश्रम का पूर्ण फल व वरिष्ठता का सम्मान' },
  { age: 66, ruleCode: 'BSP-19', planet: 'Saturn', offset: 1, themeEn: 'Completion of Worldly Obligations & Philosophical Peace', themeHi: 'सांसारिक दायित्वों की पूर्णता व शांत चित्त' },
  { age: 69, ruleCode: 'BSP-20', planet: 'Jupiter', offset: 1, themeEn: 'Highest Spiritual Blessings, Progeny Growth & Moksha Alignment', themeHi: 'सर्वोच्च आध्यात्मिक आशीर्वाद, पौत्र-पौत्री सुख व मोक्ष गति' },
];

export function computeBhriguSaralPaddhati(chart: ChartData, inputAge?: number): BhriguSaralPaddhatiReport {
  const ascSign = chart.ascendant.signIndex;
  const pMap = new Map<NineGrahaId, BodyPosition>();
  for (const p of chart.planets) {
    pMap.set(p.id as NineGrahaId, p);
  }

  // Calculate native current age
  const birthYear = parseInt(chart.input.date.split('-')[0], 10) || 1990;
  const currentYear = new Date().getFullYear();
  const calculatedAge = Math.max(1, currentYear - birthYear);
  const runningAge = inputAge && inputAge > 0 ? inputAge : calculatedAge;

  // 1. Cyclical 12-Year House Reading (BPHS & Bhrigu)
  const rem = runningAge % 12 === 0 ? 12 : runningAge % 12;
  const cSignIdx = signOfHouse(ascSign, rem);
  const cSign = SIGNS[cSignIdx];
  const cLord = cSign.lord;
  const pLord = pMap.get(cLord as NineGrahaId);
  const cLordHouse = pLord ? houseBetween(ascSign, pLord.signIndex) : 1;

  const occupants: NineGrahaId[] = [];
  for (const [id, bp] of pMap.entries()) {
    if (houseBetween(ascSign, bp.signIndex) === rem) {
      occupants.push(id);
    }
  }

  const houseThemes: Record<number, { en: string; hi: string }> = {
    1: { en: 'Vitality, personal focus, new beginnings, identity evolution', hi: 'शारीरिक स्वास्थ्य, नवीन शुरुआत, आत्म-चिंतन व व्यक्तित्व विकास' },
    2: { en: 'Financial accumulation, speech, family bonding, liquid wealth', hi: 'धन संचय, वाणी प्रभाव, कुटुंब सुख व वित्तीय योजनाएं' },
    3: { en: 'Courage, initiative, siblings, short journeys, communication skills', hi: 'साहस, पराक्रम, भाई-बहनों का सहयोग, लघु यात्राएं व नवीन कौशल' },
    4: { en: 'Home, property acquisition, vehicular comfort, inner peace, maternal focus', hi: 'गृह, भूमि-वाहन सुख, मानसिक शांति व माता के प्रति समर्पण' },
    5: { en: 'Intellect, higher education, creativity, progeny matters, speculative gains', hi: 'बुद्धि, उच्च विद्या, संतान विषयक सुख, सृजनात्मकता व पूर्वपुण्य लाभ' },
    6: { en: 'Service, competitive triumphs, debt clearing, disciplined wellness', hi: 'नौकरी, प्रतियोगी सफलता, ऋणमुक्ति व स्वास्थ्य नियमन' },
    7: { en: 'Partnerships, marriage, public dealings, agreements, business diplomacy', hi: 'विवाह, दांपत्य सामंजस्य, व्यापारिक साझेदारी व लोक संबंध' },
    8: { en: 'Transformation, research, unexpected gains, esoteric studies, longevity', hi: 'गूढ़ ज्ञान, आकस्मिक परिवर्तन, पैतृक लाभ व अंतर्ज्ञान' },
    9: { en: 'Fortune, pilgrimages, higher knowledge, spiritual mentor blessings, dharma', hi: 'भाग्योदय, तीर्थाटन, उच्च ज्ञान, गुरु कृपा व धर्म संवर्धन' },
    10: { en: 'Career status, executive responsibility, fame, societal authority', hi: 'कार्यक्षेत्र में पदोन्नति, प्रशासनिक दायित्व, यश व कीर्ति' },
    11: { en: 'Fulfillment of long-cherished ambitions, vast network gains, elder siblings', hi: 'मनोकामना सिद्धि, प्रचुर अर्थ लाभ, मित्र मंडली व सामाजिक प्रतिष्ठा' },
    12: { en: 'Spiritual detachment, foreign connections, expenditure planning, meditation', hi: 'आत्म-शांति, विदेश संपर्क, शुभ व्यय व एकांत साधना' },
  };

  const currTheme = houseThemes[rem] || houseThemes[1];
  const occTxtEn = occupants.length > 0 ? ` Occupied by ${occupants.join(', ')}.` : ' Naturally vacant; ruled primarily by ' + cLord + '.';
  const occTxtHi = occupants.length > 0 ? ` इस भाव में ${occupants.join(', ')} स्थित हैं।` : ` यह भाव रिक्त है तथा इसका संचालन स्वामी ग्रह ${cLord} द्वारा हो रहा है।`;

  const cyclical12YearReading: BspCycleReading = {
    age: runningAge,
    cyclicalHouse: rem,
    houseSignIndex: cSignIdx,
    houseSignName: cSign.name,
    houseLord: cLord,
    houseLordPlacementHouse: cLordHouse,
    occupants,
    synthesisEn: `At running age ${runningAge}, cyclical year activates House ${rem} (${cSign.name}). Primary focus: ${currTheme.en}.${occTxtEn} The lord ${cLord} sits in House ${cLordHouse}, directly linking this year's outcomes to the matters of House ${cLordHouse}.`,
    synthesisHi: `वर्तमान वर्ष (आयु ${runningAge} वर्ष) में भृगु 12-वर्षीय चक्र के अनुसार कुंडली का ${rem}वां भाव (${cSign.name}) सक्रिय है। मुख्य फल: ${currTheme.hi}।${occTxtHi} भाव स्वामी ${cLord} कुंडली के ${cLordHouse}वें भाव में विराजमान हैं, जिससे इस वर्ष के परिणाम विशेष रूप से ${cLordHouse}वें भाव से जुड़ेंगे।`,
  };

  // 2. Evaluate all Specific BSP Triggers
  const allTriggers: BspSpecificTrigger[] = [];

  for (const rule of BSP_RULES_TABLE) {
    const srcPlanet = pMap.get(rule.planet);
    if (!srcPlanet) continue;

    const trigSignIdx = (srcPlanet.signIndex + rule.offset - 1) % 12;
    const trigHouse = houseBetween(ascSign, trigSignIdx);
    const trigSignName = SIGNS[trigSignIdx].name;

    const trigOccs: NineGrahaId[] = [];
    for (const [id, bp] of pMap.entries()) {
      if (bp.signIndex === trigSignIdx) trigOccs.push(id);
    }

    const trigAspects: NineGrahaId[] = [];
    for (const [id, bp] of pMap.entries()) {
      const dist = houseBetween(bp.signIndex, trigSignIdx);
      if (dist === 7) trigAspects.push(id);
      else if (id === 'Mars' && (dist === 4 || dist === 8)) trigAspects.push(id);
      else if (id === 'Jupiter' && (dist === 5 || dist === 9)) trigAspects.push(id);
      else if (id === 'Saturn' && (dist === 3 || dist === 10)) trigAspects.push(id);
    }

    const readingEn = `Sage Bhrigu's ${rule.ruleCode} activates House ${trigHouse} (${trigSignName}, being the ${rule.offset}th house from natal ${rule.planet}). Theme: ${rule.themeEn}.${trigOccs.length > 0 ? ` Occupied by ${trigOccs.join(', ')}.` : ''}${trigAspects.length > 0 ? ` Aspected by ${trigAspects.join(', ')}.` : ''}`;
    const readingHi = `महर्षि भृगु के ${rule.ruleCode} सूत्रानुसार जन्मकुंडली में ${rule.planet} से ${rule.offset}वां भाव (अर्थात् लग्न से भाव ${trigHouse}, ${trigSignName} राशि) सक्रिय होता है। प्रभाव: ${rule.themeHi}।${trigOccs.length > 0 ? ` इस भाव में ${trigOccs.join(', ')} विद्यमान हैं।` : ''}${trigAspects.length > 0 ? ` इस पर ${trigAspects.join(', ')} की पूर्ण दृष्टि है।` : ''}`;

    allTriggers.push({
      age: rule.age,
      ruleCode: rule.ruleCode,
      sourcePlanet: rule.planet,
      offsetHouse: rule.offset,
      triggeredHouse: trigHouse,
      triggeredSignIndex: trigSignIdx,
      triggeredSignName: trigSignName,
      occupants: trigOccs,
      aspects: trigAspects,
      triggerThemeEn: rule.themeEn,
      triggerThemeHi: rule.themeHi,
      readingEn,
      readingHi,
    });
  }

  // Active triggers for current age (exact age or within +-1 year)
  const activeSpecificTriggers = allTriggers.filter(
    (t) => t.age === runningAge || (Math.abs(t.age - runningAge) <= 1 && allTriggers.filter(x => x.age === runningAge).length === 0)
  );

  // Upcoming triggers
  const upcomingTriggers = allTriggers.filter((t) => t.age > runningAge).slice(0, 5);

  return {
    currentAge: runningAge,
    cyclical12YearReading,
    activeSpecificTriggers: activeSpecificTriggers.length > 0 ? activeSpecificTriggers : allTriggers.filter(t => Math.abs(t.age - runningAge) <= 2),
    upcomingTriggers,
    lifetimeTimeline: allTriggers,
  };
}
