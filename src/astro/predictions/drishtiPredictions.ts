import { NINE_GRAHAS, SIGNS } from '../constants';
import { parasharaAspectVirupas } from '../strength';
import type { AspectInfo, BodyPosition, ChartData, NineGrahaId, PlanetId } from '../types';

export interface DrishtiLinkPrediction {
  from: PlanetId;
  to: PlanetId | 'Asc';
  typeEn: string;
  typeHi: string;
  virupas: number; // 0..60 Parashari aspect strength
  orbDeg: number;
  strengthPercent: number;
  isMutual: boolean; // Samasaptaka or mutual special Drishti
  tone: 'positive' | 'mixed' | 'negative';
  headlineEn: string;
  headlineHi: string;
  positiveEn: string;
  positiveHi: string;
  negativeEn: string;
  negativeHi: string;
  eventEn: string;
  eventHi: string;
}

export interface HouseDrishtiSummary {
  houseNumber: number;
  signIndex: number;
  aspectingGrahas: Array<{ planet: NineGrahaId; typeEn: string; typeHi: string; isBenefic: boolean }>;
  beneficCount: number;
  maleficCount: number;
  tone: 'positive' | 'mixed' | 'negative';
  readingEn: string;
  readingHi: string;
}

export interface DrishtiReport {
  planetaryDrishtis: DrishtiLinkPrediction[];
  mutualOppositions: DrishtiLinkPrediction[];
  houseDrishtis: HouseDrishtiSummary[];
  summaryEn: string;
  summaryHi: string;
}

const PLANET_HI: Record<string, string> = {
  Asc: 'लग्न', Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध',
  Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
  Uranus: 'अरुण', Neptune: 'वरुण', Pluto: 'यम',
};

const NAT_BENEFIC = new Set<string>(['Jupiter', 'Venus', 'Mercury', 'Moon']);

function trAspectTypeHi(t: string): string {
  if (t.includes('7th Full')) return 'सप्तम पूर्ण दृष्टि (7वीं)';
  if (t.includes('4th Mars')) return 'मंगल चतुर्थ विशेष दृष्टि (4थी)';
  if (t.includes('8th Mars')) return 'मंगल अष्टम विशेष दृष्टि (8वीं)';
  if (t.includes('5th Jupiter')) return 'गुरु पंचम अमृतमयी दृष्टि (5वीं)';
  if (t.includes('9th Jupiter')) return 'गुरु नवम धर्म-दृष्टि (9वीं)';
  if (t.includes('3rd Saturn')) return 'शनि तृतीय कर्म-दृष्टि (3री)';
  if (t.includes('10th Saturn')) return 'शनि दशम कर्म-दृष्टि (10वीं)';
  if (t.includes('5th Nodal')) return 'राहु/केतु पंचम दृष्टि (5वीं)';
  if (t.includes('9th Nodal')) return 'राहु/केतु नवम दृष्टि (9वीं)';
  return t;
}

const ASPECT_FLAVOR: Record<
  string,
  {
    tone: 'positive' | 'mixed' | 'negative';
    natureEn: string;
    natureHi: string;
    posEn: string;
    posHi: string;
    negEn: string;
    negHi: string;
    evEn: string;
    evHi: string;
  }
> = {
  Jupiter: {
    tone: 'positive',
    natureEn: 'Amrita / Protective Wisdom Gaze',
    natureHi: 'अमृतमयी एवं रक्षात्मक ज्ञान-दृष्टि',
    posEn: 'Purifies afflictions, expands dharma, prosperity, marriage/child grace and shields against crises.',
    posHi: 'दोषों को शांत कर भाग्य, धन, शिक्षा, संतान व दांपत्य की रक्षा तथा संकट से बचाव करता है।',
    negEn: 'Rare complacency or excessive generosity if target is already overly expansive.',
    negHi: 'कभी-कभी अति-आशावाद या अनावश्यक उदारता दे सकता है।',
    evEn: 'Rescue by wise mentors, auspicious family ceremonies, promotions & recovery in health scares.',
    evHi: 'संकट के समय योग्य गुरु/मित्र की सहायता, मांगलिक उत्सव, पदोन्नति व स्वास्थ्य सुधार।',
  },
  Venus: {
    tone: 'positive',
    natureEn: 'Harmonizing Aesthetics & Comfort Gaze',
    natureHi: 'सौंदर्य, प्रेम एवं ऐश्वर्य-दृष्टि',
    posEn: 'Adds diplomatic sweetness, romantic charm, artistic talent, luxury comforts & financial polish.',
    posHi: 'मधुर व्यवहार, आकर्षण, कलात्मक सौंदर्य, वाहन सुख व आर्थिक संपन्नता बढ़ाता है।',
    negEn: 'Sensual distraction or luxury indulgence if target is already Moon/Rahu/Mars.',
    negHi: 'लक्ष्य ग्रह चंद्र/राहु/मंगल होने पर भोग-विलास या प्रेम-भटकाव संभव है।',
    evEn: 'Artistic contracts, wedding alliances, lifestyle upgrades & romantic attraction.',
    evHi: 'कला/डिजाइन सफलता, विवाह प्रस्ताव, वाहन/वस्त्र वैभव एवं प्रेम प्रसंग।',
  },
  Mercury: {
    tone: 'positive',
    natureEn: 'Intellectual & Commercial Logic Gaze',
    natureHi: 'बौद्धिक, तार्किक एवं व्यापारिक दृष्टि',
    posEn: 'Activates sharp analysis, articulate communication, trade acumen, math & adaptability.',
    posHi: 'तीक्ष्ण विश्लेषण, मधुर संवाद, गणना, कोडिंग व व्यापारिक सूझबूझ जगाता है।',
    negEn: 'Nervous restlessness or skeptical over-thinking when aspecting Moon/Saturn.',
    negHi: 'अति-विश्लेषण, चिंता या चंचलता बढ़ा सकता है।',
    evEn: 'Signed contracts, publications, exams cleared & smart financial negotiations.',
    evHi: 'अनुबंध हस्ताक्षर, परीक्षा उत्तीर्ण, लेखन व व्यापार समझौते।',
  },
  Moon: {
    tone: 'positive',
    natureEn: 'Nurturing Emotional & Public Gaze',
    natureHi: 'शीतल भावनात्मक एवं जन-सहयोग दृष्टि',
    posEn: 'Softens rigidity, enhances public popularity, motherly care, hospitality & intuitive creativity.',
    posHi: 'कठोरता कम कर जनप्रियता, कला, मातृ-स्नेह व भावनात्मक जुड़ाव देता है।',
    negEn: 'Fluctuating moods or nostalgia swings if waxing/waning near malefics.',
    negHi: 'मन की अस्थिरता या भावुक उतार-चढ़ाव संभव है।',
    evEn: 'Support from women/public audiences, home warmth & domestic changes.',
    evHi: 'जनसंपर्क/महिलाओं से सहयोग, यात्रा व गृह सुख से जुड़े परिवर्तन।',
  },
  Sun: {
    tone: 'mixed',
    natureEn: 'Sovereign Authority & Illumination Gaze',
    natureHi: 'राजकीय तेज एवं अधिकार-दृष्टि',
    posEn: 'Grants dignity, government backing, confidence & truth visibility to the aspected planet/house.',
    posHi: 'सरकारी सम्मान, आत्मबल, नेतृत्व व सत्य प्रकाशन की शक्ति प्रदान करता है।',
    negEn: 'Can scorch softness into ego clashes, father/authority friction or heat strain.',
    negHi: 'अहं-टकराव, वरिष्ठों से मतभेद या शारीरिक उष्णता बढ़ा सकता है।',
    evEn: 'Official promotions, public spotlight, leadership tests or father-related milestones.',
    evHi: 'राजकीय पदोन्नति, सार्वजनिक सम्मान, पिता या प्रशासनिक अधिकार से जुड़ी घटनाएँ।',
  },
  Mars: {
    tone: 'negative',
    natureEn: 'Agni / Cutting Energy & Drive Gaze (4th, 7th, 8th)',
    natureHi: 'अग्नि, साहस व तीक्ष्ण आवेग-दृष्टि (4, 7, 8वीं)',
    posEn: 'Ignites fearless execution, surgery/engineering/defense focus & decisive speed.',
    posHi: 'साहस, शल्य-चिकित्सा, इंजीनियरिंग, पुलिस/रक्षा व त्वरित निर्णय-शक्ति देता है।',
    negEn: 'Heats up anger, conflict, haste, blood pressure, marital quarrels & impatient injuries.',
    negHi: 'क्रोध, विवाद, रक्तचाप, उतावलेपन में चोट-चपेट व रिश्तों में कड़वाहट बढ़ाता है।',
    evEn: 'Heightens accident/cut/burn risk during Mars/target Dashas, real-estate duels & bold battles.',
    evHi: 'दुर्घटना, कट-चोट, सर्जरी, वाहन गति या संपत्ति/कार्यस्थल विवाद के घटनाक्रम बनते हैं।',
  },
  Saturn: {
    tone: 'negative',
    natureEn: 'Vayu / Karmic Delay, Duty & Restriction Gaze (3rd, 7th, 10th)',
    natureHi: 'शनि की कर्म, विलंब व कठोर परीक्षा-दृष्टि (3, 7, 10वीं)',
    posEn: 'Grounds fantasies into realistic endurance, legal mastery, structure & late permanent gains.',
    posHi: 'व्यावहारिक यथार्थ, कानून, अनुशासन व देर से मिलने वाली अति-स्थायी सफलता देता है।',
    negEn: 'Chills enthusiasm, causes delays, chronic stiffness, grief, marriage delay or loneliness.',
    negHi: 'कार्यों में विलंब, निराशा, विवाह में देरी, जोड़ों/थकान व अलगाव की परीक्षा देता है।',
    evEn: 'Demanding tests, heavy responsibilities, orthopedic care or restructuring before lasting success.',
    evHi: 'कठोर परीक्षा, कार्यभार वृद्धि, स्थानांतरण या हड्डी-स्वास्थ्य देखभाल के बाद पक्की विजय।',
  },
  Rahu: {
    tone: 'negative',
    natureEn: 'Obsessive Amplification & Foreign Illusion Gaze (5th, 7th, 9th)',
    natureHi: 'तीव्र महत्वाकांक्षा, भ्रम व अनपेक्षित मोड़-दृष्टि (5, 7, 9वीं)',
    posEn: 'Breaks conventional ceilings for tech, cinema, mass fame & foreign breakthroughs.',
    posHi: 'तकनीक, विदेश, मीडिया व आधुनिक क्षेत्रों में अचानक बड़ी सफलता दिलाता है।',
    negEn: 'Triggers anxiety, obsessive craving, deceit, scandals or unconventional shocks.',
    negHi: 'भ्रम, लालच, धोखा, व्यसन या सामाजिक परंपरा से टकराव का जोखिम देता है।',
    evEn: 'Sudden foreign leaps, unexpected gossip/disputes or dramatic relationship turns.',
    evHi: 'अचानक विदेश गमन, गुप्त षड्यंत्र/बदनामी से बचाव या आकस्मिक मोड़।',
  },
  Ketu: {
    tone: 'mixed',
    natureEn: 'Detachment, Sudden Cut & Mystic Research Gaze (5th, 7th, 9th)',
    natureHi: 'वैराग्य, गूढ़ शोध व आकस्मिक विच्छेद-दृष्टि (5, 7, 9वीं)',
    posEn: 'Sharpens root-cause intuition, occult/coding mastery, humility & spiritual realization.',
    posHi: 'गहन शोध, कोडिंग, ज्योतिष, आध्यात्म व सूक्ष्म सत्य की पकड़ प्रदान करता है।',
    negEn: 'Induces sudden disillusionment, misdiagnosis, detachment or quiet breaks.',
    negHi: 'अचानक मोहभंग, स्वास्थ्य जांच में भ्रम, अलगाव या एकाकीपन दे सकता है।',
    evEn: 'Unexpected resignations, surgeries/mysteries solved or spiritual turning points.',
    evHi: 'अचानक पद/रिश्ते से विरक्ति, सर्जरी सावधानी या तीर्थ/आध्यात्मिक परिवर्तन।',
  },
};

function buildPairDrishti(
  fromId: PlanetId,
  toId: PlanetId | 'Asc',
  aspectType: string,
  virupas: number,
  orbDeg: number,
  strengthPercent: number,
  isMutual: boolean
): DrishtiLinkPrediction {
  const fl = ASPECT_FLAVOR[fromId] ?? ASPECT_FLAVOR.Sun;
  const fromHi = PLANET_HI[fromId] ?? fromId;
  const toHi = PLANET_HI[toId] ?? toId;
  const typeHi = trAspectTypeHi(aspectType);

  let extraPosEn = '';
  let extraPosHi = '';
  let extraNegEn = '';
  let extraNegHi = '';
  let extraEvEn = '';
  let extraEvHi = '';

  // Specific iconic Drishti combinations
  if ((fromId === 'Mars' && toId === 'Saturn') || (fromId === 'Saturn' && toId === 'Mars')) {
    extraNegEn = ' Critical Mars–Saturn mutual friction: heightened impatience, conflict & physical accident stress!';
    extraNegHi = ' विशेष मंगल–शनि संघर्ष दृष्टि: अत्यधिक तनाव, क्रोध व शारीरिक चोट का जोखिम!';
    extraEvEn = ' Watch vehicle safety, surgery, machinery & workplace clashes carefully during MD/AD.';
    extraEvHi = ' वाहन, मशीन, सर्जरी व कार्यस्थल विवाद से विशेष बचाव रखें।';
  } else if ((fromId === 'Jupiter' && toId === 'Moon') || (fromId === 'Moon' && toId === 'Jupiter')) {
    extraPosEn = ' Forms auspicious Gajakesari Samasaptaka / Trinal Blessing — grace, wisdom & popularity!';
    extraPosHi = ' शुभ गजकेसरी समसप्तक दृष्टि — ज्ञान, धन, यश व मातृ सुख में अपार वृद्धि!';
  } else if ((fromId === 'Saturn' && toId === 'Moon') || (fromId === 'Moon' && toId === 'Saturn')) {
    extraNegEn = ' Vish-like mental heaviness — periods of melancholy, mother care or emotional pressure.';
    extraNegHi = ' चंद्र-शनि दृष्टि से मानसिक दबाव, चिंता या माता के स्वास्थ्य की चिंता संभव।';
  } else if ((fromId === 'Mars' && toId === 'Venus') || (fromId === 'Venus' && toId === 'Mars')) {
    extraPosEn = ' High romantic magnetism, artistic passion & creative charisma.';
    extraNegEn = ' Guard against restless romantic temptation or intense partner arguments.';
    extraPosHi = ' तीव्र प्रेम आकर्षण, कला व दांपत्य ऊर्जा।';
    extraNegHi = ' आवेगपूर्ण आकर्षण या साथी से तीखे वाद-विवाद पर नियंत्रण रखें।';
  }

  const mutualTagEn = isMutual ? ' [Mutual Samasaptaka 7/7]' : '';
  const mutualTagHi = isMutual ? ' [परस्पर दृष्टि]' : '';

  return {
    from: fromId,
    to: toId,
    typeEn: `${aspectType}${mutualTagEn}`,
    typeHi: `${typeHi}${mutualTagHi}`,
    virupas: Math.round(virupas * 10) / 10,
    orbDeg,
    strengthPercent,
    isMutual,
    tone: fromId === 'Jupiter' && isMutual ? 'positive' : fl.tone,
    headlineEn: `${fromId} casts ${aspectType} onto ${toId === 'Asc' ? 'Ascendant' : toId} (${strengthPercent}% strength)`,
    headlineHi: `${fromHi} की ${toHi} पर ${typeHi} (${strengthPercent}% बल)`,
    positiveEn: `${fl.posEn}${extraPosEn}`,
    positiveHi: `${fl.posHi}${extraPosHi}`,
    negativeEn: `${fl.negEn}${extraNegEn}`,
    negativeHi: `${fl.negHi}${extraNegHi}`,
    eventEn: `${fl.evEn}${extraEvEn}`,
    eventHi: `${fl.evHi}${extraEvHi}`,
  };
}

export function computeDrishtiPredictions(chart: ChartData): DrishtiReport {
  const byId = new Map<string, BodyPosition>([
    ['Asc', chart.ascendant],
    ...chart.planets.map((p) => [p.id, p] as const),
  ]);

  // Fast mutual check among computed aspects
  const pairSet = new Set(chart.aspects.map((a) => `${a.from}->${a.to}`));
  const planetaryDrishtis: DrishtiLinkPrediction[] = chart.aspects
    .filter((a: AspectInfo) => NINE_GRAHAS.includes(a.from as NineGrahaId))
    .map((a: AspectInfo) => {
      const pFrom = byId.get(a.from)!;
      const pTo = byId.get(a.to)!;
      const ang = ((pTo.longitude - pFrom.longitude) % 360 + 360) % 360;
      const virupas = parasharaAspectVirupas(a.from, ang);
      const isMutual = pairSet.has(`${a.to}->${a.from}`);
      return buildPairDrishti(
        a.from,
        a.to,
        a.type,
        virupas,
        a.orbDeg,
        a.strengthPercent,
        isMutual
      );
    })
    .sort((a, b) => Number(b.isMutual) - Number(a.isMutual) || b.strengthPercent - a.strengthPercent);

  // Deduplicate mutual oppositions cleanly for highlight cards
  const seenMutual = new Set<string>();
  const mutualOppositions: DrishtiLinkPrediction[] = [];
  for (const d of planetaryDrishtis) {
    if (!d.isMutual) continue;
    const k = [d.from, d.to].sort().join('<->');
    if (!seenMutual.has(k)) {
      seenMutual.add(k);
      mutualOppositions.push(d);
    }
  }

  // House-wise Drishti Matrix across all 12 Houses
  const ascSign = chart.ascendant.signIndex;
  const houseDrishtis: HouseDrishtiSummary[] = Array.from({ length: 12 }, (_, idx) => {
    const h = idx + 1;
    const signIndex = (ascSign + idx) % 12;
    const aspectingGrahas: HouseDrishtiSummary['aspectingGrahas'] = [];

    for (const g of NINE_GRAHAS) {
      const p = byId.get(g)!;
      const diff = ((h - p.rasiHouseNumber + 12) % 12) + 1;
      let tEn = '';
      if (diff === 7) tEn = '7th Full';
      else if (g === 'Mars' && (diff === 4 || diff === 8)) tEn = `${diff}th Mars Special`;
      else if (g === 'Jupiter' && (diff === 5 || diff === 9)) tEn = `${diff}th Jupiter Special`;
      else if (g === 'Saturn' && (diff === 3 || diff === 10)) tEn = `${diff}th Saturn Special`;
      else if ((g === 'Rahu' || g === 'Ketu') && (diff === 5 || diff === 9)) tEn = `${diff}th Nodal`;

      if (tEn) {
        aspectingGrahas.push({
          planet: g,
          typeEn: tEn,
          typeHi: trAspectTypeHi(tEn),
          isBenefic: NAT_BENEFIC.has(g),
        });
      }
    }

    const beneficCount = aspectingGrahas.filter((x) => x.isBenefic).length;
    const maleficCount = aspectingGrahas.length - beneficCount;
    const tone: HouseDrishtiSummary['tone'] =
      beneficCount > maleficCount ? 'positive' : maleficCount > beneficCount ? 'negative' : 'mixed';

    const listEn = aspectingGrahas.length
      ? aspectingGrahas.map((x) => `${x.planet} (${x.typeEn})`).join(', ')
      : 'No direct Graha Drishti (governed purely by occupants & lord)';
    const listHi = aspectingGrahas.length
      ? aspectingGrahas.map((x) => `${PLANET_HI[x.planet]} (${x.typeHi})`).join(', ')
      : 'कोई सीधी ग्रह दृष्टि नहीं (केवल भावेश व स्थित ग्रह फलित करते हैं)';

    return {
      houseNumber: h,
      signIndex,
      aspectingGrahas,
      beneficCount,
      maleficCount,
      tone,
      readingEn: `House ${h} (${SIGNS[signIndex].name}) receives Drishti from: ${listEn}.`,
      readingHi: `${h}वें भाव पर दृष्टि: ${listHi}।`,
    };
  });

  const benTotal = planetaryDrishtis.filter((d) => NAT_BENEFIC.has(d.from)).length;
  const malTotal = planetaryDrishtis.length - benTotal;

  return {
    planetaryDrishtis,
    mutualOppositions,
    houseDrishtis,
    summaryEn: `Detected ${planetaryDrishtis.length} active planetary Drishtis (${benTotal} benefic gazes, ${malTotal} fiery/karmic gazes) and ${mutualOppositions.length} mutual 1-to-7 Samasaptaka aspect pairs.`,
    summaryHi: `कुंडली में कुल ${planetaryDrishtis.length} सक्रिय ग्रह दृष्टियाँ (${benTotal} शुभ दृष्टियाँ, ${malTotal} क्रूर/कर्मिक दृष्टियाँ) तथा ${mutualOppositions.length} परस्पर समसप्तक दृष्टि-युग्म सक्रिय हैं।`,
  };
}

export function inspectCustomDrishti(
  fromPlanet: NineGrahaId,
  toTarget: NineGrahaId | 'Asc',
  aspectHouseOffset: number
): DrishtiLinkPrediction {
  const label =
    aspectHouseOffset === 7
      ? '7th Full'
      : fromPlanet === 'Mars'
        ? `${aspectHouseOffset}th Mars Special`
        : fromPlanet === 'Jupiter'
          ? `${aspectHouseOffset}th Jupiter Special`
          : fromPlanet === 'Saturn'
            ? `${aspectHouseOffset}th Saturn Special`
            : fromPlanet === 'Rahu' || fromPlanet === 'Ketu'
              ? `${aspectHouseOffset}th Nodal`
              : `${aspectHouseOffset}th Special`;

  return buildPairDrishti(
    fromPlanet,
    toTarget,
    label,
    60,
    1.5,
    92,
    aspectHouseOffset === 7
  );
}
