import { NINE_GRAHAS, SIGNS } from '../constants';
import type { BodyPosition, ChartData, NineGrahaId } from '../types';

export interface NadiDirectionLine {
  direction: 'East' | 'South' | 'West' | 'North';
  directionHi: string;
  elementEn: string;
  elementHi: string;
  signsEn: string;
  signsHi: string;
  planetsInLine: Array<{
    id: NineGrahaId;
    signIndex: number;
    degreeInSign: number;
    isRetrograde: boolean;
  }>;
  synthesisEn: string;
  synthesisHi: string;
}

export interface BnnCyclePhase {
  ageRange: string;
  cycleNameEn: string;
  cycleNameHi: string;
  themeEn: string;
  themeHi: string;
}

export interface BnnDiseaseAlert {
  comboEn: string;
  comboHi: string;
  triggered: boolean;
  readingEn: string;
  readingHi: string;
}

export interface BnnSpecialRuleResult {
  ruleCode: string;
  titleEn: string;
  titleHi: string;
  verdictEn: string;
  verdictHi: string;
  isTriggered: boolean;
}

export interface BhriguNandiNadiReport {
  directionLines: NadiDirectionLine[];
  karmaCareerEn: string;
  karmaCareerHi: string;
  jivaWealthEn: string;
  jivaWealthHi: string;
  marriageNadiEn: string;
  marriageNadiHi: string;
  rahuKetuAxisEn: string;
  rahuKetuAxisHi: string;
  flankingKarmaEn: string;
  flankingKarmaHi: string;
  retrogradeShiftsEn: string;
  retrogradeShiftsHi: string;
  exchangesEn: string;
  exchangesHi: string;
  diseaseAlerts: BnnDiseaseAlert[];
  guruCycles12Yr: BnnCyclePhase[];
  specialRules: BnnSpecialRuleResult[];
  sources: string[];
}

const PLANET_HI: Record<NineGrahaId, string> = {
  Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध',
  Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
};

const SIGN_HI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
];

function houseBetween(fromSign: number, toSign: number): number {
  return ((toSign - fromSign + 12) % 12) + 1;
}

const BNN_KARAKA_MEANING: Record<NineGrahaId, { en: string; hi: string }> = {
  Sun: { en: 'Soul, Government, Father, Authority', hi: 'आत्मा, सरकार, पिता, अधिकार' },
  Moon: { en: 'Mind, Mother, Water, Travel, Change', hi: 'मन, माता, यात्रा, बदलाव' },
  Mars: { en: 'Courage, Land, Brother, Husband (F chart), Engineering', hi: 'साहस, भूमि, भाई, पति (स्त्री), तकनीक' },
  Mercury: { en: 'Intellect, Commerce, Education, Friends, Skin', hi: 'बुद्धि, व्यापार, शिक्षा, मित्र' },
  Jupiter: { en: 'Jeeva (Native), Wealth, Wisdom, Husband/Progeny', hi: 'जीव (जातक), धन, ज्ञान, संतान' },
  Venus: { en: 'Wealth, Wife (M chart), Luxury, Vehicle, Native (F chart)', hi: 'धन-ऐश्वर्य, पत्नी (पुरुष), वाहन, कला' },
  Saturn: { en: 'Karma (Profession), Work, Longevity, Elder', hi: 'कर्म (व्यवसाय/नौकरी), परिश्रम, आयु' },
  Rahu: { en: 'Foreign, Shadow, Mouth/Media, Sudden Amplification', hi: 'विदेश, मीडिया/तकनीक, अचानक विस्तार' },
  Ketu: { en: 'Moksha, Cuts/Breaks, Medical/Occult, Thread/Research', hi: 'मोक्ष, शोध, चिकित्सा, वैराग्य/विच्छेद' },
};

const SATURN_COMBO_CAREER: Record<NineGrahaId, { en: string; hi: string }> = {
  Sun: { en: 'Government service, executive management, father’s profession, political leadership', hi: 'सरकारी सेवा, प्रशासन, पिता का कार्य या नेतृत्व पद' },
  Moon: { en: 'Public dealing, food/hospitality, healthcare, travel/logistics & transfer-prone jobs', hi: 'जन-संपर्क, होटल/खाद्य, चिकित्सा सेवा या स्थानांतरण वाले कार्य' },
  Mars: { en: 'Mechanical/civil engineering, land construction, defense, surgery & manufacturing', hi: 'इंजीनियरिंग, निर्माण/रियल एस्टेट, रक्षा, सर्जरी या फैक्ट्री' },
  Mercury: { en: 'IT/Software, commerce/trading, accounting, auditing, teaching & communication', hi: 'IT/सॉफ्टवेयर, व्यापार, लेखा-CA, मीडिया व शिक्षण' },
  Jupiter: { en: 'Banking/finance, corporate law, advisory consulting, academic authority & ethical enterprise', hi: 'बैंकिंग/वित्त, कानून, सलाहकारी, उच्च शिक्षा व प्रतिष्ठित पद' },
  Venus: { en: 'Luxury business, banking/finance, automobiles, design, cinema & apparel/jewellery', hi: 'बैंकिंग/धन व्यापार, वाहन, फैशन-डिज़ाइन, कला व लग्जरी क्षेत्र' },
  Saturn: { en: 'Deep structural discipline', hi: 'स्थायी परिश्रम' },
  Rahu: { en: 'MNCs, software technology, foreign trade, aviation, mass media or unconventional enterprise', hi: 'MNC, सॉफ्टवेयर/टेक, विदेशी व्यापार, मीडिया व आधुनिक उद्यम' },
  Ketu: { en: 'Medicine/healing, research, independent work, law or frequent career pivots for freedom', hi: 'चिकित्सा/अनुसंधान, स्वतंत्र काम, वकालत या कार्य बदलाव से स्वतंत्रता' },
};

function dirOfSign(signIndex: number): 0 | 1 | 2 | 3 {
  return (signIndex % 4) as 0 | 1 | 2 | 3; // 0=East, 1=South, 2=West, 3=North
}

function getBnnLinkedPlanets(
  anchor: BodyPosition,
  allGrahas: BodyPosition[]
): Array<{ planet: BodyPosition; relationEn: string; relationHi: string }> {
  const effectiveSigns = [anchor.signIndex];
  if (anchor.isRetrograde && anchor.id !== 'Rahu' && anchor.id !== 'Ketu') {
    effectiveSigns.push((anchor.signIndex + 11) % 12); // Vakri Graha aspects/touches previous sign in BNN!
  }

  const out: Array<{ planet: BodyPosition; relationEn: string; relationHi: string }> = [];
  for (const p of allGrahas) {
    if (p.id === anchor.id) continue;
    const pEffSigns = [p.signIndex];
    if (p.isRetrograde && p.id !== 'Rahu' && p.id !== 'Ketu') {
      pEffSigns.push((p.signIndex + 11) % 12);
    }

    let matchedRelEn = '';
    let matchedRelHi = '';

    for (const aS of effectiveSigns) {
      for (const bS of pEffSigns) {
        const dist = ((bS - aS + 12) % 12) + 1;
        const revTag = aS !== anchor.signIndex || bS !== p.signIndex ? ' (Retro)' : '';
        const revTagHi = aS !== anchor.signIndex || bS !== p.signIndex ? ' (वक्री प्रभाव)' : '';
        if (dist === 1) {
          matchedRelEn = `Conjoined${revTag}`;
          matchedRelHi = `युति${revTagHi}`;
        } else if (dist === 5 || dist === 9) {
          matchedRelEn = `1-5-9 Trine${revTag}`;
          matchedRelHi = `1-5-9 नाड़ी त्रिकोण${revTagHi}`;
        } else if (dist === 7) {
          matchedRelEn = `7th Opposite${revTag}`;
          matchedRelHi = `7वीं सीधी दृष्टि${revTagHi}`;
        } else if (dist === 2) {
          matchedRelEn = `2nd Next Progression${revTag}`;
          matchedRelHi = `2रा अगला प्रभाव${revTagHi}`;
        } else if (dist === 12) {
          matchedRelEn = `12th Behind Root${revTag}`;
          matchedRelHi = `12वां पिछला आधार${revTagHi}`;
        }
        if (matchedRelEn) break;
      }
      if (matchedRelEn) break;
    }

    if (matchedRelEn) {
      out.push({ planet: p, relationEn: matchedRelEn, relationHi: matchedRelHi });
    }
  }
  return out;
}

export function computeBhriguNandiNadi(chart: ChartData): BhriguNandiNadiReport {
  const byId = new Map(chart.planets.map((p) => [p.id, p]));
  const grahas = NINE_GRAHAS.map((g) => byId.get(g)!);
  const saturn = byId.get('Saturn')!;
  const jupiter = byId.get('Jupiter')!;
  const venus = byId.get('Venus')!;
  const mars = byId.get('Mars')!;
  const mercury = byId.get('Mercury')!;
  const moon = byId.get('Moon')!;
  const sun = byId.get('Sun')!;
  const rahu = byId.get('Rahu')!;
  const ketu = byId.get('Ketu')!;

  // 1. 4 Directional Trine Lines (East, South, West, North)
  const DIR_DEFS: Array<{
    direction: NadiDirectionLine['direction'];
    directionHi: string;
    elementEn: string;
    elementHi: string;
    signsEn: string;
    signsHi: string;
  }> = [
    { direction: 'East', directionHi: 'पूर्व दिशा नाड़ी', elementEn: 'Fire (Agni)', elementHi: 'अग्नि तत्व', signsEn: 'Aries · Leo · Sagittarius', signsHi: 'मेष · सिंह · धनु' },
    { direction: 'South', directionHi: 'दक्षिण दिशा नाड़ी', elementEn: 'Earth (Prithvi)', elementHi: 'पृथ्वी तत्व', signsEn: 'Taurus · Virgo · Capricorn', signsHi: 'वृषभ · कन्या · मकर' },
    { direction: 'West', directionHi: 'पश्चिम दिशा नाड़ी', elementEn: 'Air (Vayu)', elementHi: 'वायु तत्व', signsEn: 'Gemini · Libra · Aquarius', signsHi: 'मिथुन · तुला · कुंभ' },
    { direction: 'North', directionHi: 'उत्तर दिशा नाड़ी', elementEn: 'Water (Jala)', elementHi: 'जल तत्व', signsEn: 'Cancer · Scorpio · Pisces', signsHi: 'कर्क · वृश्चिक · मीन' },
  ];

  const directionLines: NadiDirectionLine[] = DIR_DEFS.map((d, dirIdx) => {
    const lineGrahas = grahas
      .filter((p) => dirOfSign(p.signIndex) === dirIdx)
      .sort((a, b) => a.degreeInSign - b.degreeInSign)
      .map((p) => ({
        id: p.id as NineGrahaId,
        signIndex: p.signIndex,
        degreeInSign: p.degreeInSign,
        isRetrograde: p.isRetrograde,
      }));

    const synthesisEn =
      lineGrahas.length >= 2
        ? `Nadi Progression Chain (${d.direction}): ${lineGrahas.map((p) => `${p.id} (${p.degreeInSign.toFixed(1)}° ${SIGNS[p.signIndex].short})`).join(' → ')} — lower-degree planet feeds energy into higher-degree planets as ${lineGrahas.map((p) => BNN_KARAKA_MEANING[p.id].en.split(',')[0]).join(' + ')}.`
        : lineGrahas.length === 1
          ? `Single anchor ${lineGrahas[0].id} occupies the ${d.direction} (${d.elementEn}) triangle.`
          : `No planet placed in ${d.direction} (${d.elementEn}) trine.`;

    const synthesisHi =
      lineGrahas.length >= 2
        ? `नाड़ी प्रवाह शृंखला (${d.directionHi}): ${lineGrahas.map((p) => `${PLANET_HI[p.id]} (${p.degreeInSign.toFixed(1)}°)`).join(' → ')} — कम अंश वाला ग्रह अगले ग्रह को फल सौंपता है (${lineGrahas.map((p) => BNN_KARAKA_MEANING[p.id].hi.split(',')[0]).join(' + ')})।`
        : lineGrahas.length === 1
          ? `इस त्रिकोण में केवल ${PLANET_HI[lineGrahas[0].id]} स्थित हैं।`
          : `इस दिशा त्रिकोण में कोई ग्रह स्थित नहीं है।`;

    return {
      ...d,
      planetsInLine: lineGrahas,
      synthesisEn,
      synthesisHi,
    };
  });

  // 2. BNN Saturn Karma Chain
  const satLinks = getBnnLinkedPlanets(saturn, grahas);
  const satSectorsEn = satLinks.slice(0, 3).map((l) => `${l.planet.id} [${l.relationEn}]: ${SATURN_COMBO_CAREER[l.planet.id as NineGrahaId].en}`);
  const satSectorsHi = satLinks.slice(0, 3).map((l) => `${PLANET_HI[l.planet.id as NineGrahaId]} [${l.relationHi}]: ${SATURN_COMBO_CAREER[l.planet.id as NineGrahaId].hi}`);

  const karmaCareerEn = satLinks.length
    ? `Karma Karaka Saturn sits in ${saturn.signName} (${saturn.degreeInSign.toFixed(1)}°). Linked planets along 1-5-9/2-12/7: ${satSectorsEn.join(' | ')}. (Nadi Rule: Work flourishes best along ${SATURN_COMBO_CAREER[satLinks[0].planet.id as NineGrahaId].en}.)`
    : `Saturn stands independent in ${saturn.signName}, pointing to self-structured technical, real-estate or administrative career stability.`;
  const karmaCareerHi = satLinks.length
    ? `कर्म-कारक शनि ${SIGN_HI[saturn.signIndex]} (${saturn.degreeInSign.toFixed(1)}°) में स्थित हैं। 1-5-9/2/12/7 संबंध द्वारा करियर दिशा: ${satSectorsHi.join(' | ')}।`
    : `शनि ${SIGN_HI[saturn.signIndex]} में स्वतंत्र होकर स्व-परिश्रम, तकनीकी व प्रशासनिक स्थायित्व देते हैं।`;

  // 3. BNN Jupiter Jeeva & Wealth Chain
  const jupLinks = getBnnLinkedPlanets(jupiter, grahas);
  const hasDhanaNadi = jupLinks.some((l) => ['Venus', 'Moon', 'Mercury', 'Sun'].includes(l.planet.id));
  const jivaWealthEn = `Jiva Karaka Jupiter in ${jupiter.signName} (${jupiter.degreeInSign.toFixed(1)}°) connects with ${jupLinks.length ? jupLinks.map((l) => `${l.planet.id} (${l.relationEn})`).join(', ') : 'no close Nadi companion'}. ${hasDhanaNadi ? 'Presence of Venus/Mercury/Moon/Sun in Jupiter’s Nadi chain activates strong Dhanayoga & graceful recognition!' : 'Wealth expands patiently when wisdom aligns with Saturnian service or specialized training.'}`;
  const jivaWealthHi = `जीव-कारक गुरु ${SIGN_HI[jupiter.signIndex]} (${jupiter.degreeInSign.toFixed(1)}°) से जुड़े ग्रह: ${jupLinks.length ? jupLinks.map((l) => `${PLANET_HI[l.planet.id as NineGrahaId]} (${l.relationHi})`).join(', ') : 'स्वतंत्र गुरु'}। ${hasDhanaNadi ? 'गुरु-शुक्र/बुध/चंद्र/सूर्य के नाड़ी संबंध से उत्तम धन योग और मान-सम्मान बनता है!' : 'परिश्रम, ज्ञान और अनुशासन से स्थायी समृद्धि निर्मित होती है।'}`;

  // 4. BNN Marriage & Love Rules (Nikhil World / R.G. Rao)
  const venLinks = getBnnLinkedPlanets(venus, grahas);
  const marsLinks = getBnnLinkedPlanets(mars, grahas);
  const merKetuLinked = getBnnLinkedPlanets(mercury, grahas).some((l) => l.planet.id === 'Ketu');
  const gender = chart.input.gender || 'other';
  const jupVenDist = ((venus.signIndex - jupiter.signIndex + 12) % 12) + 1;
  const femaleVenMarDist = ((mars.signIndex - venus.signIndex + 12) % 12) + 1;
  const venWithKarmic = venLinks.filter((l) => ['Saturn', 'Rahu', 'Ketu'].includes(l.planet.id)).map((l) => l.planet.id);
  const marsWithKarmic = marsLinks.filter((l) => ['Saturn', 'Rahu', 'Ketu'].includes(l.planet.id)).map((l) => l.planet.id);

  const malePromised = [1, 2, 3, 5, 7, 9, 11, 12].includes(jupVenDist);
  const marriageNadiEn =
    gender === 'female'
      ? `Female BNN Rule (Venus Self ↔ Mars Spouse, separation H${femaleVenMarDist}): Venus links with [${venLinks.map((l) => l.planet.id).join(', ') || 'None'}]; Mars links with [${marsWithKarmic.join(', ') || 'Clean'}]. ${merKetuLinked ? 'Mercury–Ketu Nadi link indicates potential love-marriage / unconventional bond.' : ''} ${marsWithKarmic.length ? `Saturn/Node touch on Mars (${marsWithKarmic.join(', ')}) calls for patience, maturity & avoidance of marriage haste.` : 'Clean Nadi flow for devoted spousal partnership.'}`
      : `BNN Rule (Jupiter Jeeva ↔ Venus Wife/Partner, separation H${jupVenDist}): ${malePromised ? 'Marriage strongly promised along Guru–Shukra progression.' : 'Jupiter–Venus 4/6/8/10 separation suggests delayed or carefully negotiated wedding timing.'} Venus touches [${venWithKarmic.join(', ') || 'Clean'}]. ${merKetuLinked ? 'Mercury–Ketu trine/link highlights love romance or unconventional marriage route.' : ''} ${venWithKarmic.length ? `Karmic influence (${venWithKarmic.join(', ')}) on Venus asks for realistic expectations and conscious harmony.` : ''}`;

  const marriageNadiHi =
    gender === 'female'
      ? `स्त्री भृगु नंदी नाड़ी नियम (शुक्र जातक ↔ मंगल पति, दूरी ${femaleVenMarDist} भाव): ${marsWithKarmic.length ? `मंगल पर ${marsWithKarmic.map((p) => PLANET_HI[p as NineGrahaId]).join(', ')} के नाड़ी प्रभाव से विवाह में धैर्य व गुण-मिलान जरूरी है।` : 'मंगल-शुक्र का नाड़ी संबंध अनुकूल है।'} ${merKetuLinked ? 'बुध-केतु संबंध प्रेम-विवाह या अनूठे आकर्षण का संकेत देता है।' : ''}`
      : `भृगु नंदी नाड़ी नियम (गुरु जीव ↔ शुक्र जीवनसाथी, दूरी ${jupVenDist} भाव): ${malePromised ? 'गुरु–शुक्र की स्थिति से विवाह योग सुदृढ़ है।' : 'गुरु–शुक्र के 4/6/8/10 अंतर से विवाह में विलंब या व्यावहारिक समझौता आवश्यक होगा।'} ${venWithKarmic.length ? `शुक्र पर ${venWithKarmic.map((p) => PLANET_HI[p as NineGrahaId]).join(', ')} का प्रभाव दांपत्य में परिपक्वता मांगता है।` : ''} ${merKetuLinked ? 'बुध–केतु नाड़ी संबंध से प्रेम-विवाह या मित्रता का विवाह में बदलने का योग बनता है।' : ''}`;

  // 5. Retrograde & Parivartana Rules
  const retroPlanets = grahas.filter((p) => p.isRetrograde && p.id !== 'Rahu' && p.id !== 'Ketu');
  const retrogradeShiftsEn = retroPlanets.length
    ? `Vakri (Retrograde) Nadi Rule: ${retroPlanets.map((r) => `${r.id} in ${r.signName} also influences previous sign ${SIGNS[(r.signIndex + 11) % 12].name}`).join('; ')}.`
    : 'No true planet is Retrograde — Nadi progressions move linearly forward without backward karmic revisits.';
  const retrogradeShiftsHi = retroPlanets.length
    ? `वक्री नाड़ी नियम: ${retroPlanets.map((r) => `${PLANET_HI[r.id as NineGrahaId]} (${SIGN_HI[r.signIndex]}) अपनी पिछली राशि ${SIGN_HI[(r.signIndex + 11) % 12]} के ग्रहों से भी सीधा संबंध बनाता है`).join('; ')}।`
    : 'कुंडली में कोई ग्रह वक्री नहीं है — नाड़ी फल सीधी दिशा में स्पष्ट चलता है।';

  const exchanges: string[] = [];
  const exchangesHiList: string[] = [];
  const p7 = grahas.filter((p) => p.id !== 'Rahu' && p.id !== 'Ketu');
  for (let i = 0; i < p7.length; i++) {
    for (let j = i + 1; j < p7.length; j++) {
      const a = p7[i];
      const b = p7[j];
      if (SIGNS[a.signIndex].lord === b.id && SIGNS[b.signIndex].lord === a.id) {
        exchanges.push(`${a.id} (${a.signName}) ↔ ${b.id} (${b.signName})`);
        exchangesHiList.push(`${PLANET_HI[a.id as NineGrahaId]} (${SIGN_HI[a.signIndex]}) ↔ ${PLANET_HI[b.id as NineGrahaId]} (${SIGN_HI[b.signIndex]})`);
      }
    }
  }

  // 6. Specific Nadi Disease Combinations (Nikhil Gupta / BNN Medical)
  const isNadiConnected = (pA: BodyPosition, pB: BodyPosition) =>
    getBnnLinkedPlanets(pA, grahas).some((x) => x.planet.id === pB.id);

  const diseaseAlerts: BnnDiseaseAlert[] = [
    {
      comboEn: 'Moon + Mercury (Nadi ENT / Nervous Link)',
      comboHi: 'चंद्र + बुध (गला, श्वास व स्नायु नाड़ी योग)',
      triggered: isNadiConnected(moon, mercury),
      readingEn: isNadiConnected(moon, mercury)
        ? 'Connected in Nadi — watch throat infections, sinus/allergy swings, migraine tension & calm breathwork.'
        : 'Clear — low throat/nervous Nadi link.',
      readingHi: isNadiConnected(moon, mercury)
        ? 'नाड़ी में जुड़े होने से गले में संक्रमण, साइनस/एलर्जी व मानसिक अति-चिंता से बचाव रखें।'
        : 'दोष मुक्त।',
    },
    {
      comboEn: 'Moon + Saturn (Nadi Respiratory / Cold / Stress)',
      comboHi: 'चंद्र + शनि (शीत, कफ व मानसिक अवसाद योग)',
      triggered: isNadiConnected(moon, saturn),
      readingEn: isNadiConnected(moon, saturn)
        ? 'Connected — guard against cold-damp sensitivity, bronchitis, slow recovery or quiet mood dips.'
        : 'Clear.',
      readingHi: isNadiConnected(moon, saturn)
        ? 'जुड़े होने से सर्दी-जुकाम, कफ, थकान व अकेलेपन/चिंता से बचने हेतु प्राणायाम करें।'
        : 'दोष मुक्त।',
    },
    {
      comboEn: 'Mars + Saturn / Rahu / Ketu (Nadi Injury / Surgery)',
      comboHi: 'मंगल + शनि / राहु / केतु (चोट, रक्त व सर्जरी नाड़ी योग)',
      triggered: isNadiConnected(mars, saturn) || isNadiConnected(mars, rahu) || isNadiConnected(mars, ketu),
      readingEn:
        isNadiConnected(mars, saturn) || isNadiConnected(mars, rahu) || isNadiConnected(mars, ketu)
          ? 'Active Nadi contact — exercise extra caution around vehicle speed, bone/joint falls, blood pressure & cuts/surgeries.'
          : 'Clear.',
      readingHi:
        isNadiConnected(mars, saturn) || isNadiConnected(mars, rahu) || isNadiConnected(mars, ketu)
          ? 'नाड़ी संपर्क सक्रिय — वाहन गति, हड्डी/चोट, रक्तचाप व शल्य-चिकित्सा से सावधानी अनिवार्य है।'
          : 'दोष मुक्त।',
    },
    {
      comboEn: 'Venus + Mars / Rahu / Jupiter+Rahu (Metabolic / Endocrine)',
      comboHi: 'शुक्र + मंगल/राहु या गुरु + राहु (हार्मोन, मधुमेह व त्वचा)',
      triggered: isNadiConnected(venus, rahu) || isNadiConnected(jupiter, rahu),
      readingEn:
        isNadiConnected(venus, rahu) || isNadiConnected(jupiter, rahu)
          ? 'Connected — watch sugar balance, hormonal/thyroid routines, liver rich foods and skin hygiene.'
          : 'Clear.',
      readingHi:
        isNadiConnected(venus, rahu) || isNadiConnected(jupiter, rahu)
          ? 'नाड़ी संपर्क से शुगर, थायरॉयड/हार्मोन व लिवर आहार में नियमित संयम रखें।'
          : 'दोष मुक्त।',
    },
    {
      comboEn: 'Sun + Saturn / Rahu (Bone, Eye & Cardiac Check)',
      comboHi: 'सूर्य + शनि / राहु (हड्डी, नेत्र व हृदय नाड़ी योग)',
      triggered: isNadiConnected(sun, saturn) || isNadiConnected(sun, rahu),
      readingEn:
        isNadiConnected(sun, saturn) || isNadiConnected(sun, rahu)
          ? 'Connected — prioritize vitamin-D/spine posture, regular eye checks and calm blood-pressure management.'
          : 'Clear.',
      readingHi:
        isNadiConnected(sun, saturn) || isNadiConnected(sun, rahu)
          ? 'हड्डियों, रीढ़, नेत्र व रक्तचाप की नियमित देखभाल व सूर्य अर्घ्य लाभकारी रहेगा।'
          : 'दोष मुक्त।',
    },
  ];

  // 7. Classical BNN 12-Year Jupiter Transit Cycles (1st..12th sign from Natal Jupiter!)
  const guruCycles12Yr: BnnCyclePhase[] = [
    { ageRange: '0–12 Yrs', cycleNameEn: 'Cycle 1: Childhood & Education Foundation', cycleNameHi: 'चक्र 1 (0–12 वर्ष): बाल्यावस्था व शिक्षा नींव', themeEn: 'Early health, schooling & family protection as Jupiter orbits the 12 natal signs once.', themeHi: 'गुरु का प्रथम पूर्ण चक्र — प्रारंभिक स्वास्थ्य, माता-पिता का संरक्षण व स्कूली शिक्षा।' },
    { ageRange: '12–24 Yrs', cycleNameEn: 'Cycle 2: Higher Study, Youth Awakening & First Job/Love', cycleNameHi: 'चक्र 2 (12–24 वर्ष): उच्च शिक्षा, करियर आरंभ व प्रेम', themeEn: 'Jupiter crosses natal Mercury/Venus/Sun points — shaping college specialization and early career entry.', themeHi: 'दूसरा चक्र — कॉलेज उपाधि, प्रथम नौकरी/हुनर और युवावस्था के प्रमुख निर्णय।' },
    { ageRange: '24–36 Yrs', cycleNameEn: 'Cycle 3: Marriage, Family Building & Career Ascent', cycleNameHi: 'चक्र 3 (24–36 वर्ष): विवाह, गृहस्थाश्रम व करियर उन्नति', themeEn: 'Crucial settlement cycle — marriage/children milestones & establishing independent financial footing.', themeHi: 'तीसरा चक्र — विवाह, संतान, अपना मकान/वाहन व करियर में स्थायी स्थापना।' },
    { ageRange: '36–48 Yrs', cycleNameEn: 'Cycle 4: Peak Karma, Authority & Expansion', cycleNameHi: 'चक्र 4 (36–48 वर्ष): कर्म शिखर, पद-प्रतिष्ठा व धन विस्तार', themeEn: 'Saturn–Jupiter maturity fruits arrive: senior promotion, business growth, children rising & estate build.', themeHi: 'चौथा चक्र — जीवन का सर्वोच्च कर्म-उत्कर्ष, व्यवसाय विस्तार व उच्च सम्मान।' },
    { ageRange: '48–60 Yrs', cycleNameEn: 'Cycle 5: Consolidation, Advisory Wisdom & Legacy', cycleNameHi: 'चक्र 5 (48–60 वर्ष): संचय, सलाहकार प्रतिष्ठा व पारिवारिक दायित्व', themeEn: 'Mentoring next generation, debt retirement, preventive health & strategic wealth protection.', themeHi: 'पाँचवाँ चक्र — बच्चों का विवाह/स्थापना, सलाहकार भूमिका व संपत्ति सुरक्षा।' },
    { ageRange: '60–72+ Yrs', cycleNameEn: 'Cycle 6: Dharma, Inner Peace & Spiritual Liberation', cycleNameHi: 'चक्र 6 (60–72+ वर्ष): धर्म, शांति व आध्यात्मिक परिपक्वता', themeEn: 'Ketu/Jupiter harvest: pilgrimage, detachment, charitable wisdom and serene retirement.', themeHi: 'छठा चक्र — तीर्थ, परोपकार, ध्यान व आत्मिक संतोष।' },
  ];

  // 8. BNN Rule 10: Rahu-Ketu Karmic Axis Hemispheric Division
  const rSign = rahu.signIndex;
  const kSign = ketu.signIndex;
  const eastHemiPlanets: NineGrahaId[] = [];
  const westHemiPlanets: NineGrahaId[] = [];
  for (const p of grahas) {
    if (p.id === 'Rahu' || p.id === 'Ketu') continue;
    const diff = (p.signIndex - rSign + 12) % 12;
    if (diff > 0 && diff < 6) eastHemiPlanets.push(p.id as NineGrahaId);
    else westHemiPlanets.push(p.id as NineGrahaId);
  }
  const rahuKetuAxisEn = `Rahu-Ketu Axis Hemispheric Division: Eastern arc (Rahu to Ketu) holds [${eastHemiPlanets.join(', ')}]; Western arc holds [${westHemiPlanets.join(', ')}]. ${eastHemiPlanets.length > westHemiPlanets.length ? 'Heavier placement towards Rahu arc indicates strong outward material ambitions and overseas or unconventional opportunities.' : 'Balanced distribution between domestic roots and external karmic evolution.'}`;
  const rahuKetuAxisHi = `राहु-केतु कर्मिक अक्ष विभाजन: राहु से केतु की दिशा में [${eastHemiPlanets.map(p => PLANET_HI[p]).join(', ')}] तथा केतु से राहु की दिशा में [${westHemiPlanets.map(p => PLANET_HI[p]).join(', ')}] स्थित हैं। ${eastHemiPlanets.length > westHemiPlanets.length ? 'राहु की ओर ग्रहों का अधिक झुकाव जातक में तीव्र भौतिक महत्वाकांक्षा, विदेश संपर्क व आधुनिक क्षेत्रों में अप्रत्याशित प्रगति देता है।' : 'घरेलू प्रतिष्ठा और बाह्य कर्मिक विस्तार में संतुलित समन्वय रहता है।'}`;

  // 9. BNN Rule 4: Flanking Karma around Saturn (Karma) & Jupiter (Jiva)
  const p2ndFromSat = grahas.filter(p => p.id !== 'Saturn' && houseBetween(saturn.signIndex, p.signIndex) === 2);
  const p12thFromSat = grahas.filter(p => p.id !== 'Saturn' && houseBetween(saturn.signIndex, p.signIndex) === 12);
  const flankingKarmaEn = `Saturn (Karma Karaka) Flanking: 2nd house from Saturn holds [${p2ndFromSat.map(p => p.id).join(', ') || 'None'}]; 12th house holds [${p12thFromSat.map(p => p.id).join(', ') || 'None'}]. ${p2ndFromSat.some(p => ['Jupiter', 'Venus', 'Mercury'].includes(p.id)) ? 'Benefic in 2nd from Saturn ensures steady professional income and respect.' : 'Neutral professional progression with self-made effort.'}`;
  const flankingKarmaHi = `शनि (कर्म कारक) के द्वितीय भाव में [${p2ndFromSat.map(p => PLANET_HI[p.id as NineGrahaId]).join(', ') || 'कोई नहीं'}] तथा द्वादश भाव में [${p12thFromSat.map(p => PLANET_HI[p.id as NineGrahaId]).join(', ') || 'कोई नहीं'}] स्थित हैं। ${p2ndFromSat.some(p => ['Jupiter', 'Venus', 'Mercury'].includes(p.id)) ? 'शनि से द्वितीय में शुभ ग्रह का होना कार्यक्षेत्र में निरंतर आय और उच्च सम्मान सुनिश्चित करता है।' : 'व्यक्तिगत स्वावलंबन और सतत परिश्रम से करियर का उत्थान होता है।'}`;

  // 10. Special BNN Rules from Classical Vels/RG Rao Corpus
  const specialRules: BnnSpecialRuleResult[] = [
    {
      ruleCode: 'BNN-R3',
      titleEn: '7th Sign Direct Aspect Impact',
      titleHi: 'सप्तम दृष्टि का प्रत्यक्ष नाड़ी प्रभाव',
      isTriggered: true,
      verdictEn: `Planets in 7th from each other exchange full mutual energy. Jupiter 7th from Moon brings travel yoga & mother's longevity. Mars 7th from Saturn requires cautious safety.`,
      verdictHi: `एक-दूसरे से सातवें भाव में स्थित ग्रह पूर्ण नाड़ी ऊर्जा का आदान-प्रदान करते हैं। चंद्र से सातवें गुरु मातृ-दीर्घायु व यात्रा योग देता है।`,
    },
    {
      ruleCode: 'BNN-R9',
      titleEn: 'Nadi Neechabhanga / Debilitation Cancellation',
      titleHi: 'नाड़ी नीचभंग / निर्बलता परिहार',
      isTriggered: grahas.some(p => p.dignity === 'Debilitated'),
      verdictEn: `In BNN, if a debilitated planet has friendly planets in its 2nd, 12th, 7th, 5th, or 9th signs, its debility is transmuted into exceptional practical competence.`,
      verdictHi: `नाड़ी ज्योतिष में यदि नीच ग्रह के 2, 12, 7, 5 या 9वें भाव में मित्र ग्रह हों, तो उसकी निर्बलता समाप्त होकर विशेष व्यावहारिक दक्षता में बदल जाती है।`,
    },
  ];

  return {
    directionLines,
    karmaCareerEn,
    karmaCareerHi,
    jivaWealthEn,
    jivaWealthHi,
    marriageNadiEn,
    marriageNadiHi,
    rahuKetuAxisEn,
    rahuKetuAxisHi,
    flankingKarmaEn,
    flankingKarmaHi,
    retrogradeShiftsEn,
    retrogradeShiftsHi,
    exchangesEn: exchanges.length ? `Active Nadi Sign Exchanges (Parivartana): ${exchanges.join(', ')}.` : 'No direct planetary sign exchange (Parivartana).',
    exchangesHi: exchangesHiList.length ? `प्रमुख नाड़ी राशि परिवर्तन (Parivartana): ${exchangesHiList.join(', ')}।` : 'कोई प्रत्यक्ष ग्रह-राशि परिवर्तन नहीं है।',
    diseaseAlerts,
    guruCycles12Yr,
    specialRules,
    sources: [
      'Bhrigu Nandi Nadi Classical Shastras',
      'Classical Nadi Karaka Linkages',
      '1-5-9 Trikona Planetary Chain Siddhanta',
      'Vedic Astrology Research Corpus',
    ],
  };
}
