import type { ChartData, NineGrahaId, PlanetId } from './types';

export interface LalKitabHouseInfo {
  houseNumber: number; // 1..12 (Fixed Aries..Pisces)
  naturalLord: string;
  signification: string;
  significationHi: string;
  planets: string[];
  isSleepingHouse: boolean;
  awakeningGraha: string;
}

export interface SleepingPlanet {
  planet: string;
  house: number;
  reasonEn: string;
  reasonHi: string;
  catalystPlanet: string;
  remedyEn: string;
  remedyHi: string;
}

export interface BlindPlanetPair {
  house: number;
  planets: [string, string];
  conflictType: string;
  impactEn: string;
  impactHi: string;
  farmanRemedyEn: string;
  farmanRemedyHi: string;
}

export interface MasnooiGraha {
  resultantPlanet: string;
  constituentPlanets: [string, string];
  housePlaced: number;
  effectEn: string;
  effectHi: string;
}

export interface LalKitabFarman {
  ruleNumber: number;
  targetPlanet: string;
  targetHouse: number;
  titleEn: string;
  titleHi: string;
  upayaEn: string;
  upayaHi: string;
  cautionEn: string;
  cautionHi: string;
}

export interface LalKitabFullReport {
  isDharmiTeva: boolean;
  tevaType: 'Dharmi Teva (Protected)' | 'Paapi Teva (Challenging)' | 'Saadhaaran Teva (Normal)';
  tevaTypeHi: string;
  fixedHouses: LalKitabHouseInfo[];
  sleepingPlanets: SleepingPlanet[];
  blindPlanets: BlindPlanetPair[];
  masnooiGrahas: MasnooiGraha[];
  farmans: LalKitabFarman[];
  coreRemediesEn: string[];
  coreRemediesHi: string[];
}

const NATURAL_LORDS: Record<number, { lord: string; en: string; hi: string; awakener: string }> = {
  1: { lord: 'Mars / Sun', en: 'Head, Self, Destiny', hi: 'मस्तक, आत्म, भाग्य', awakener: 'Sun' },
  2: { lord: 'Jupiter / Venus', en: 'Wealth, Family, Speech', hi: 'धन, परिवार, वाणी', awakener: 'Jupiter' },
  3: { lord: 'Mercury / Mars', en: 'Siblings, Courage, Hands', hi: 'भाई-बहन, पराक्रम, भुजा', awakener: 'Mars' },
  4: { lord: 'Moon', en: 'Mother, Home, Peace of Mind', hi: 'माता, सुख, मन की शांति', awakener: 'Moon' },
  5: { lord: 'Sun / Jupiter', en: 'Children, Wisdom, Future', hi: 'संतान, विद्या, भविष्य', awakener: 'Jupiter' },
  6: { lord: 'Mercury / Ketu', en: 'Enemies, Debts, Disease', hi: 'शत्रु, ऋण, रोग', awakener: 'Mercury' },
  7: { lord: 'Venus / Mercury', en: 'Spouse, Partnership, Trade', hi: 'जीवनसाथी, साझेदारी, व्यापार', awakener: 'Venus' },
  8: { lord: 'Saturn / Mars', en: 'Longevity, Hidden Obstacles', hi: 'आयु, गुप्त बाधाएं', awakener: 'Saturn' },
  9: { lord: 'Jupiter', en: 'Luck, Religion, Ancestors', hi: 'भाग्य, धर्म, पूर्वज', awakener: 'Jupiter' },
  10: { lord: 'Saturn', en: 'Career, Father, Status', hi: 'कर्म, पिता, प्रतिष्ठा', awakener: 'Saturn' },
  11: { lord: 'Jupiter / Saturn', en: 'Income, Friends, Desires', hi: 'आय, मित्र, मनोरथ', awakener: 'Jupiter' },
  12: { lord: 'Jupiter / Rahu', en: 'Expenses, Bed Pleasure, Moksha', hi: 'व्यय, शयन सुख, मोक्ष', awakener: 'Rahu' },
};

const LK_ENEMIES: Record<string, string[]> = {
  Sun: ['Saturn', 'Venus', 'Rahu', 'Ketu'],
  Moon: ['Rahu', 'Ketu'],
  Mars: ['Mercury', 'Rahu'],
  Mercury: ['Moon'],
  Jupiter: ['Mercury', 'Venus'],
  Venus: ['Sun', 'Moon', 'Rahu'],
  Saturn: ['Sun', 'Moon', 'Mars'],
  Rahu: ['Sun', 'Moon', 'Mars', 'Jupiter'],
  Ketu: ['Sun', 'Moon', 'Venus'],
};

export function computeLalKitabFull(chart: ChartData): LalKitabFullReport {
  // Remap planets to fixed house: in Lal Kitab, House 1 = natal lagna's house
  const houseOccupants: Record<number, string[]> = {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: []
  };

  chart.planets.forEach((p) => {
    const h = p.houseNumber;
    if (houseOccupants[h]) {
      houseOccupants[h].push(p.id);
    }
  });

  // Fixed house details
  const fixedHouses: LalKitabHouseInfo[] = [];
  for (let h = 1; h <= 12; h++) {
    const occ = houseOccupants[h] || [];
    const meta = NATURAL_LORDS[h];
    fixedHouses.push({
      houseNumber: h,
      naturalLord: meta.lord,
      signification: meta.en,
      significationHi: meta.hi,
      planets: occ,
      isSleepingHouse: occ.length === 0,
      awakeningGraha: meta.awakener,
    });
  }

  // Detect Sleeping Planets (Soi Hui Kismat)
  const sleepingPlanets: SleepingPlanet[] = [];
  chart.planets.forEach((p) => {
    const h = p.houseNumber;
    // in LK, planets in 6, 8, 12 without strong benefic accompany are sleeping
    if ([6, 8, 12].includes(h) && (houseOccupants[h].length === 1 || p.isRetrograde)) {
      sleepingPlanets.push({
        planet: p.id,
        house: h,
        reasonEn: `${p.id} sits in dark House ${h} without protective benefic companion.`,
        reasonHi: `${p.id} अंधकार भाव ${h} में बिना शुभ ग्रह के एकाकी स्थित है।`,
        catalystPlanet: NATURAL_LORDS[h].awakener,
        remedyEn: `Perform Upaya for ${NATURAL_LORDS[h].awakener} to awaken ${p.id}.`,
        remedyHi: `${p.id} को जाग्रत करने हेतु ${NATURAL_LORDS[h].awakener} के निमित्त उपाय करें।`,
      });
    }
  });

  // Detect Blind Planets (mutually enemy planets in the same house)
  const blindPlanets: BlindPlanetPair[] = [];
  for (let h = 1; h <= 12; h++) {
    const occ = houseOccupants[h];
    if (occ.length >= 2) {
      for (let i = 0; i < occ.length; i++) {
        for (let j = i + 1; j < occ.length; j++) {
          const p1 = occ[i];
          const p2 = occ[j];
          const isEnemy = LK_ENEMIES[p1]?.includes(p2) || LK_ENEMIES[p2]?.includes(p1);
          if (isEnemy) {
            blindPlanets.push({
              house: h,
              planets: [p1, p2],
              conflictType: 'Mutual Enmity (Andhe Ghode)',
              impactEn: `${p1} and ${p2} in House ${h} conflict and blind each other's auspicious results.`,
              impactHi: `भाव ${h} में ${p1} और ${p2} की युति परस्पर अंधता उत्पन्न करती है।`,
              farmanRemedyEn: `Separate their energy: avoid combining copper and iron; keep silver coin soaked in rain water.`,
              farmanRemedyHi: `इनकी ऊर्जा को पृथक करें: चांदी का चौकोर टुकड़ा पास रखें।`,
            });
          }
        }
      }
    }
  }

  // Detect Masnooi Grahas (Compound/Artificial planets)
  const masnooiGrahas: MasnooiGraha[] = [];
  // Sun + Saturn = Venus
  for (let h = 1; h <= 12; h++) {
    const occ = houseOccupants[h];
    if (occ.includes('Sun') && occ.includes('Saturn')) {
      masnooiGrahas.push({
        resultantPlanet: 'Artificial Venus (Masnooi Shukra)',
        constituentPlanets: ['Sun', 'Saturn'],
        housePlaced: h,
        effectEn: 'Sun and Saturn together produce artificial Venus energy affecting luxury and marital bliss.',
        effectHi: 'सूर्य और शनि मिलकर कृत्रिम शुक्र का निर्माण करते हैं जो वैवाहिक सुख को प्रभावित करता है।',
      });
    }
    if (occ.includes('Jupiter') && occ.includes('Rahu')) {
      masnooiGrahas.push({
        resultantPlanet: 'Artificial Mercury (Masnooi Budha)',
        constituentPlanets: ['Jupiter', 'Rahu'],
        housePlaced: h,
        effectEn: 'Jupiter and Rahu combine into artificial Mercury, shifting intellect toward clever strategy.',
        effectHi: 'गुरु और राहु मिलकर कृत्रिम बुध बनाते हैं जो बुद्धि को अत्यधिक चतुर बनाते हैं।',
      });
    }
  }

  // Dharmi Teva vs Paapi Teva
  // Dharmi Teva: Jupiter or Saturn in 11th, or Moon in 4th/9th without Rahu/Ketu affliction
  const jup = chart.planets.find(p => p.id === 'Jupiter');
  const moon = chart.planets.find(p => p.id === 'Moon');
  const isDharmiTeva = Boolean((jup && [9, 11, 1].includes(jup.houseNumber)) || (moon && [4, 9].includes(moon.houseNumber)));
  const isPaapiTeva = blindPlanets.length >= 2;

  let tevaType: LalKitabFullReport['tevaType'] = 'Saadhaaran Teva (Normal)';
  let tevaTypeHi = 'साधारण तेवा (सामान्य कुंडली)';
  if (isDharmiTeva) {
    tevaType = 'Dharmi Teva (Protected)';
    tevaTypeHi = 'धर्मी तेवा (दैवीय रक्षा प्राप्त)';
  } else if (isPaapiTeva) {
    tevaType = 'Paapi Teva (Challenging)';
    tevaTypeHi = 'पापी तेवा (विशेष उपाय अनिवार्य)';
  }

  // Generate Lal Kitab Specific Farmans
  const farmans: LalKitabFarman[] = [
    {
      ruleNumber: 1,
      targetPlanet: 'Jupiter',
      targetHouse: jup?.houseNumber ?? 1,
      titleEn: 'Kesar Tilak & Guru Kripa',
      titleHi: 'केसर तिलक एवं गुरु कृपा',
      upayaEn: 'Apply pure saffron (kesar) or turmeric tilak on forehead, navel, and tongue daily before stepping out.',
      upayaHi: 'प्रतिदिन घर से निकलते समय मस्तक, नाभि और जिह्वा पर शुद्ध केसर अथवा हल्दी का तिलक लगाएं।',
      cautionEn: 'Never accept free religious books or brass idols from unknown persons.',
      cautionHi: 'मुफ्त में धार्मिक पुस्तकें अथवा पीतल की मूर्तियां किसी से न लें।',
    },
    {
      ruleNumber: 2,
      targetPlanet: 'Moon',
      targetHouse: moon?.houseNumber ?? 4,
      titleEn: 'Silver Vessel Water',
      titleHi: 'चांदी के पात्र का जल',
      upayaEn: 'Drink drinking water from a pure silver tumbler to strengthen mental calm and emotional fortitude.',
      upayaHi: 'मानसिक शांति और निर्णय क्षमता हेतु शुद्ध चांदी के गिलास से जल ग्रहण करें।',
      cautionEn: 'Do not sell ancestral silver articles or donate milk on Mondays.',
      cautionHi: 'पैतृक चांदी की वस्तुएं न बेचें और सोमवार को दूध का दान न करें।',
    },
    {
      ruleNumber: 3,
      targetPlanet: 'Saturn',
      targetHouse: chart.planets.find(p => p.id === 'Saturn')?.houseNumber ?? 10,
      titleEn: 'Mustard Oil Chhaya Daan',
      titleHi: 'छाया दान (सरसों का तेल)',
      upayaEn: 'On Saturdays, look at your face reflection in a bowl of mustard oil and donate it to a poor laborer.',
      upayaHi: 'शनिवार को कांसे या लोहे के कटोरे में सरसों के तेल में अपना मुख देखकर छाया दान करें।',
      cautionEn: 'Avoid alcohol, meat, and consuming food while lying down on the bed.',
      cautionHi: 'मदिरा, मांसाहार और बिस्तर पर बैठकर भोजन करने से पूर्ण परहेज करें।',
    },
  ];

  const coreRemediesEn = [
    'Apply Kesar (saffron) or Chandan tilak on forehead and navel every morning.',
    'Keep a solid silver square piece (4 grams) in your purse or pocket at all times.',
    'Feed black cows or stray dogs with roti with butter/mustard oil on Saturdays.',
    'Immerse 4 dry coconuts with husks in running river water during Rahu afflictions.',
    'Never wear worn-out shoes or accept leather gifts from strangers.',
  ];

  const coreRemediesHi = [
    'प्रतिदिन प्रातःकाल मस्तक और नाभि पर शुद्ध केसर या चंदन का तिलक लगाएं।',
    'अपने पर्स या जेब में सदैव 4 ग्राम का शुद्ध चांदी का चौकोर टुकड़ा रखें।',
    'शनिवार को काली गाय या श्वान को सरसों का तेल लगी रोटी खिलाएं।',
    'राहु जनित बाधाओं में 4 सूखे जटा वाले नारियल बहते जल में प्रवाहित करें।',
    'फटे हुए जूते न पहनें और किसी से चमड़े की वस्तुएं उपहार में न लें।',
  ];

  return {
    isDharmiTeva,
    tevaType,
    tevaTypeHi,
    fixedHouses,
    sleepingPlanets,
    blindPlanets,
    masnooiGrahas,
    farmans,
    coreRemediesEn,
    coreRemediesHi,
  };
}
