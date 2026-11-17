import { HINDI_PLANETS, HINDI_SIGNS, NINE_GRAHAS, SIGNS } from './constants';
import type { ChartData, NineGrahaId } from './types';

export interface SectorAffinity {
  sectorNameEn: string;
  sectorNameHi: string;
  governingPlanets: NineGrahaId[];
  suitabilityScore: number; // 0 to 100
  verdictHi: string;
  verdictEn: string;
}

export interface DhanaYogaDetails {
  yogaName: string;
  yogaNameHi: string;
  isTriggered: boolean;
  participatingLords: string;
  strengthScore: number;
  explanationHi: string;
  explanationEn: string;
}

export interface InduLagnaReport {
  induLagnaSignIndex: number;
  induLagnaSignName: string;
  induLagnaSignHi: string;
  occupants: NineGrahaId[];
  occupantsHi: string[];
  wealthPotential: 'Extraordinary (Kuber-like)' | 'High' | 'Steady Growth' | 'Fluctuating / Caution';
  wealthPotentialHi: string;
  explanationHi: string;
  explanationEn: string;
}

export interface FinancialAstrologyReport {
  wealthIndex: number; // 0 to 100
  primaryWealthController: NineGrahaId;
  primaryWealthControllerHi: string;
  induLagna: InduLagnaReport;
  dhanaYogas: DhanaYogaDetails[];
  speculativeRiskScore: number; // 0 to 100 (high = suitable for active trading; low = SIP/real estate)
  speculationAdviceHi: string;
  speculationAdviceEn: string;
  topSectors: SectorAffinity[];
  financialRemediesHi: string[];
  financialRemediesEn: string[];
}

const PLANETARY_RAYS_KALA: Record<string, number> = {
  Sun: 30,
  Moon: 16,
  Mars: 6,
  Mercury: 8,
  Jupiter: 10,
  Venus: 12,
  Saturn: 1,
};

export function computeFinancialAstrology(chart: ChartData): FinancialAstrologyReport {
  const asc = chart.ascendant;
  const planets = chart.planets;
  const ascSign = asc.signIndex;

  const getHLord = (h: number): NineGrahaId => {
    const sIdx = (ascSign + h - 1) % 12;
    return SIGNS[sIdx].lord;
  };

  const h1Lord = getHLord(1);
  const h2Lord = getHLord(2);
  const h5Lord = getHLord(5);
  const h9Lord = getHLord(9);
  const h11Lord = getHLord(11);

  const getP = (id: NineGrahaId) => planets.find((p) => p.id === id) || planets[0];
  const moon = getP('Moon');
  const jupiter = getP('Jupiter');
  const venus = getP('Venus');
  const mercury = getP('Mercury');
  const rahu = planets.find((p) => p.id === 'Rahu');

  // Indu Lagna Calculation (Parashara / Jaimini)
  const lord9FromLagna = SIGNS[(ascSign + 8) % 12].lord;
  const lord9FromMoon = SIGNS[(moon.signIndex + 8) % 12].lord;

  const rays1 = PLANETARY_RAYS_KALA[lord9FromLagna] || 10;
  const rays2 = PLANETARY_RAYS_KALA[lord9FromMoon] || 10;
  const totalRays = rays1 + rays2;
  const rem = totalRays % 12;
  const induOffset = rem === 0 ? 12 : rem;
  const induSignIdx = (moon.signIndex + induOffset - 1) % 12;

  const induOccupants = planets.filter((p) => p.signIndex === induSignIdx && p.id !== 'Asc').map((p) => p.id as NineGrahaId);
  const induOccupantsHi = induOccupants.map((p) => HINDI_PLANETS[p] || p);

  const hasBeneficInIndu = induOccupants.some((p) => ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(p));
  const hasExaltedInIndu = planets.some((p) => p.signIndex === induSignIdx && p.dignity === 'Exalted');

  let wealthPot: InduLagnaReport['wealthPotential'] = 'Steady Growth';
  let wealthPotHi = 'स्थिर व क्रमिक आर्थिक वृद्धि';
  if (hasExaltedInIndu || (hasBeneficInIndu && induOccupants.length >= 2)) {
    wealthPot = 'Extraordinary (Kuber-like)';
    wealthPotHi = 'अखंड धन संपदा व कुबेर योग';
  } else if (hasBeneficInIndu) {
    wealthPot = 'High';
    wealthPotHi = 'उच्च वित्तीय समृद्धि व संचय';
  } else if (induOccupants.some((p) => ['Rahu', 'Saturn', 'Mars'].includes(p))) {
    wealthPot = 'Fluctuating / Caution';
    wealthPotHi = 'उतार-चढ़ाव युक्त व विवेकपूर्ण संचय';
  }

  const induReport: InduLagnaReport = {
    induLagnaSignIndex: induSignIdx,
    induLagnaSignName: SIGNS[induSignIdx].name,
    induLagnaSignHi: HINDI_SIGNS[induSignIdx],
    occupants: induOccupants,
    occupantsHi: induOccupantsHi,
    wealthPotential: wealthPot,
    wealthPotentialHi: wealthPotHi,
    explanationHi: `इंदु लग्न ${HINDI_SIGNS[induSignIdx]} में है। ${
      induOccupants.length > 0
        ? `इसमें स्थित ग्रह: ${induOccupantsHi.join(', ')}।`
        : 'शुभ ग्रहों की दृष्टि इंदु लग्न को आर्थिक रूप से पुष्ट करती है।'
    } महर्षि पराशर अनुसार इंदु लग्न जातक की आकस्मिक व संचित संपदा का अचूक पैमाना है।`,
    explanationEn: `Indu Lagna is placed in ${SIGNS[induSignIdx].name}. Occupants: ${
      induOccupants.length > 0 ? induOccupants.join(', ') : 'None'
    }. BPHS designates Indu Lagna as the premier celestial barometer of accumulated wealth.`,
  };

  // Classical Dhana Yogas
  const dhanaYogas: DhanaYogaDetails[] = [
    {
      yogaName: 'Mahalakshmi Dhana Yoga (H2 & H11 Link)',
      yogaNameHi: 'महालक्ष्मी धन योग (द्वितीयेश व एकादशेश संबंध)',
      isTriggered: h2Lord === h11Lord || getP(h2Lord).houseNumber === 11 || getP(h11Lord).houseNumber === 2,
      participatingLords: `2nd Lord (${h2Lord}) + 11th Lord (${h11Lord})`,
      strengthScore: 88,
      explanationHi: 'द्वितीय भाव (संचित कोष) और एकादश भाव (नियमित लाभ) के स्वामियों का परस्पर संबंध जातक को कभी निर्धन नहीं होने देता।',
      explanationEn: 'Direct nexus between the 2nd lord of liquid wealth and the 11th lord of ongoing gains.',
    },
    {
      yogaName: 'Lakhpati Yoga (Trine & Kendra Wealth Axis)',
      yogaNameHi: 'कोट्याधिपति / लखपति योग (त्रिकोण व केंद्र स्वामियों का मेल)',
      isTriggered: [1, 4, 7, 10].includes(getP(h9Lord).houseNumber) || [1, 4, 7, 10].includes(getP(h5Lord).houseNumber),
      participatingLords: `5th Lord (${h5Lord}) / 9th Lord (${h9Lord}) in Kendra`,
      strengthScore: 85,
      explanationHi: 'त्रिकोणेश (5वें या 9वें भाव का स्वामी) केंद्र भाव में स्थित होकर जातक को प्रचुर व्यापारिक व निवेश लाभ कराता है।',
      explanationEn: 'Trinal lord seated in a Kendra house yields profound compounding of asset valuation.',
    },
    {
      yogaName: 'Chandra-Mangala Gaja Yoga',
      yogaNameHi: 'चंद्र-मंगल धन योग (व्यापारिक समृद्धि)',
      isTriggered: moon.signIndex === getP('Mars').signIndex || Math.abs(moon.houseNumber - getP('Mars').houseNumber) === 6,
      participatingLords: 'Moon + Mars Conjunction or Mutual Aspect',
      strengthScore: 82,
      explanationHi: 'चंद्रमा और मंगल की युति या दृष्टि से जातक में त्वरित वित्तीय निर्णय क्षमता और व्यापारिक कौशल का संचार होता है।',
      explanationEn: 'Moon and Mars synergy confers extraordinary commercial stamina and kinetic capital generation.',
    },
  ];

  // Speculative Trading Risk Score (H5, H8, Rahu, Mercury)
  const h5Planet = getP(h5Lord);
  let specScore = 40;
  if (rahu && (rahu.houseNumber === 5 || rahu.houseNumber === 11 || rahu.houseNumber === 9)) specScore += 25;
  if (mercury.houseNumber === 5 || mercury.houseNumber === 10 || mercury.dignity === 'Exalted') specScore += 20;
  if (h5Planet.dignity === 'Exalted' || h5Planet.dignity === 'Own Sign') specScore += 15;
  if (h5Planet.dignity === 'Debilitated' || h5Planet.houseNumber === 6 || h5Planet.houseNumber === 8) specScore -= 25;
  specScore = Math.max(15, Math.min(95, specScore));

  const specAdviceHi =
    specScore >= 70
      ? 'आपकी कुंडली में त्वरित विश्लेषण, शेयर ट्रेडिंग, कमोडिटी और डेरिवेटिव्स के लिए अनुकूल योग हैं। स्टॉप-लॉस के साथ सुनियोजित ट्रेडिंग फलदायी होगी।'
      : 'आपकी कुंडली सट्टेबाजी या इंट्राडे ट्रेडिंग के बजाय लंबी अवधि के एसआईपी (SIP), म्यूचुअल फंड्स, रियल एस्टेट और स्वर्ण निवेश के लिए अत्यधिक अनुकूल है।';

  const specAdviceEn =
    specScore >= 70
      ? 'Strong speculative acumen confirmed for disciplined equity trading, commodities, and derivatives with systematic risk management.'
      : 'Conservative asset allocation favored: SIPs, diversified index funds, physical real estate, and sovereign gold over high-leverage day trading.';

  // Top Sector Affinities
  const sectors: SectorAffinity[] = [
    {
      sectorNameEn: 'IT, Software, Fintech & AI Brokerage',
      sectorNameHi: 'सूचना प्रौद्योगिकी (IT), सॉफ्टवेयर, फिनटेक व डिजिटल ट्रेडिंग',
      governingPlanets: ['Mercury', 'Rahu'],
      suitabilityScore: Math.min(95, 55 + (mercury.houseNumber === 10 || mercury.houseNumber === 11 ? 25 : 10)),
      verdictHi: 'बुध व राहु के अनुकूल प्रभाव से डिजिटल प्लेटफॉर्म, टेक सेवाएं व सॉफ्टवेयर व्यापार में असाधारण प्रगति।',
      verdictEn: 'Strong Mercury-Rahu dynamics favor tech ecosystems, digital platforms, and software automation.',
    },
    {
      sectorNameEn: 'Banking, Wealth Advisory, Consultancy & Legal',
      sectorNameHi: 'बैंकिंग, वित्तीय परामर्श, कॉरपोरेट विधि व ट्रस्ट प्रबंधन',
      governingPlanets: ['Jupiter'],
      suitabilityScore: Math.min(96, 50 + (jupiter.dignity === 'Exalted' || jupiter.houseNumber === 10 ? 30 : 12)),
      verdictHi: 'गुरु की गरिमा से वित्तीय संस्थानों, बैंक, ऑडिट, परामर्श एवं उच्च विधि व्यवस्था में सम्मानजनक लाभ।',
      verdictEn: 'Jupiterian prominence grants ethical authority and high remuneration in financial and advisory sectors.',
    },
    {
      sectorNameEn: 'Real Estate, Infrastructure, Metals & Manufacturing',
      sectorNameHi: 'रियल एस्टेट, भूमि-भवन, इंफ्रास्ट्रक्चर व औद्योगिक विनिर्माण',
      governingPlanets: ['Mars', 'Saturn'],
      suitabilityScore: Math.min(92, 52 + (getP('Mars').houseNumber === 4 || getP('Saturn').houseNumber === 10 ? 25 : 8)),
      verdictHi: 'मंगल व शनि के प्रभाव से अचल संपत्ति, निर्माण सामग्री, भूमि विकास व भारी उद्योगों में दीर्घकालिक लाभ।',
      verdictEn: 'Mars-Saturn endurance fuels lucrative long-term capitalization in physical land and infrastructure.',
    },
    {
      sectorNameEn: 'FMCG, Luxury Goods, Entertainment & Hospitality',
      sectorNameHi: 'उपभोक्ता वस्तुएं (FMCG), विलासिता, हॉस्पिटैलिटी व मनोरंजन',
      governingPlanets: ['Venus', 'Moon'],
      suitabilityScore: Math.min(94, 50 + (venus.dignity === 'Exalted' || venus.houseNumber === 11 ? 28 : 10)),
      verdictHi: 'शुक्र व चंद्र की सौम्यता से खुदरा ब्रांड्स, रेस्टोरेंट, होटल, परिधान व लाइफस्टाइल में उत्तम आकर्षण।',
      verdictEn: 'Venusian aesthetic appeal guarantees steady consumer patronage in lifestyle and luxury goods.',
    },
  ];

  return {
    wealthIndex: Math.round((dhanaYogas.filter((y) => y.isTriggered).length * 20 + (hasBeneficInIndu ? 25 : 10) + 40)),
    primaryWealthController: jupiter.dignity === 'Exalted' ? 'Jupiter' : h11Lord,
    primaryWealthControllerHi: HINDI_PLANETS[jupiter.dignity === 'Exalted' ? 'Jupiter' : h11Lord] || 'गुरु',
    induLagna: induReport,
    dhanaYogas,
    speculativeRiskScore: specScore,
    speculationAdviceHi: specAdviceHi,
    speculationAdviceEn: specAdviceEn,
    topSectors: sectors.sort((a, b) => b.suitabilityScore - a.suitabilityScore),
    financialRemediesHi: [
      'प्रतिदिन कनकधारा स्तोत्र अथवा श्रीसूक्त का पाठ करें।',
      'अपनी तिजोरी या कार्यस्थल पर श्रीयंत्र की स्थापना कर शुक्रवार को सुगंधित इत्र अर्पित करें।',
      'आय का 2% भाग अन्नदान या गौशाला सेवा में समर्पित करें।',
    ],
    financialRemediesEn: [
      'Recite Kanakadhara Stotram or Sri Suktam daily for financial abundance.',
      'Place a consecrated Sri Yantra at your business desk or safe vault.',
      'Tithe 2% of liquid monthly gains to Gaushala or charitable food distribution.',
    ],
  };
}
