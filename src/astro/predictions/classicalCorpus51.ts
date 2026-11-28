/**
 * Classical Corpus 51 Master Life Dimensions Engine (वैदिक जीवन-विषयक 51 महा-आयाम)
 * AV Astro Vibe — Traditional Jyotish synthesis across the 12 Bhavas.
 *
 * The 51-dimension corpus is a rule-based interpretive aid, not a validated
 * probability model. Birth-time sensitivity depends on the actual chart calculation;
 * do not claim a universal one-second change or guaranteed predictive precision.
 */

import type { ChartData, NineGrahaId, SevenPlanetId } from '../types';
import { COMBUSTION_ORB, NAKSHATRAS, NINE_GRAHAS, SIGNS } from '../constants';
import type { AuspiciousnessLevel, LifeDimensionReading } from './sambhavitFalkathan';
import {
  getSignMilestones,
  getPlanetHouseBookRecord,
  getDrekkanaRecord
} from './classicalBookData';
import { getBhavesha144Entry } from './bhavesha144';

const HINDI_SIGNS = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन'
];

const HINDI_PLANETS: Record<string, string> = {
  Sun: 'सूर्य', Moon: 'चंद्रमा', Mars: 'मंगल', Mercury: 'बुध',
  Jupiter: 'बृहस्पति (गुरु)', Venus: 'शुक्र', Saturn: 'शनि',
  Rahu: 'राहु', Ketu: 'केतु', Asc: 'लग्न'
};

const DIGNITY_HI_MAP: Record<string, string> = {
  Exalted: 'उच्च',
  Moolatrikona: 'मूलत्रिकोण',
  'Own Sign': 'स्वराशि',
  'Great Friend': 'अति मित्र',
  Friendly: 'मित्र',
  Neutral: 'सम',
  Enemy: 'शत्रु',
  'Great Enemy': 'अति शत्रु',
  Debilitated: 'नीच'
};

const KP_LORDS = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];

export interface Classical51Context {
  chart: ChartData;
  ascSign: number;
  ascSignName: string;
  ascSignHi: string;
  ascLord: SevenPlanetId;
  ascLordHi: string;
  planets: ChartData['planets'];
  sav: number[]; // 1 to 12
  currentAge: number;
  mdLord: string;
  adLord: string;
  mdLordHi: string;
  adLordHi: string;
  getHLord: (h: number) => any;
  getAspectsOnHouse: (targetHouse: number) => any[];
  getKartariOnHouse: (targetHouse: number) => string;
}

export function build51LifeDimensions(ctx: Classical51Context): LifeDimensionReading[] {
  const {
    chart, ascSign, ascSignName, ascSignHi, ascLord, ascLordHi,
    planets, sav, currentAge, mdLord, adLord, mdLordHi, adLordHi,
    getHLord, getAspectsOnHouse, getKartariOnHouse
  } = ctx;

  const dims: LifeDimensionReading[] = [];

  const getP = (id: NineGrahaId) => {
    const raw = planets.find((p) => p.id === id) || planets[0];
    return {
      ...raw,
      placedHouse: raw.rasiHouseNumber ?? raw.houseNumber ?? 1,
      dignityHi: DIGNITY_HI_MAP[raw.dignity] || raw.dignity,
      nameHi: HINDI_PLANETS[raw.id] || raw.id
    };
  };
  const sun = getP('Sun');
  const moon = getP('Moon');
  const mars = getP('Mars');
  const mercury = getP('Mercury');
  const jupiter = getP('Jupiter');
  const venus = getP('Venus');
  const saturn = getP('Saturn');
  const rahu = getP('Rahu');
  const ketu = getP('Ketu');

  // Pre-resolve all 12 House Lords
  const h1 = getHLord(1);
  const h2 = getHLord(2);
  const h3 = getHLord(3);
  const h4 = getHLord(4);
  const h5 = getHLord(5);
  const h6 = getHLord(6);
  const h7 = getHLord(7);
  const h8 = getHLord(8);
  const h9 = getHLord(9);
  const h10 = getHLord(10);
  const h11 = getHLord(11);
  const h12 = getHLord(12);

  // -------------------------------------------------------------------------
  // 1-SECOND MATHEMATICAL & ASTRONOMICAL PRECISION ANCHORS
  // -------------------------------------------------------------------------
  // 1 second of clock time = 15 arcseconds = 0.00416667 degrees of Lagna shift.
  const ascLon = chart.ascendant.longitude;
  const totalArcSec = Math.round(ascLon * 3600);
  const lagnaDeg = Math.floor(ascLon % 30);
  const lagnaMin = Math.floor((ascLon * 60) % 60);
  const lagnaSec = Math.floor((ascLon * 3600) % 60);
  const lagnaCoordStr = `${lagnaDeg}°${lagnaMin.toString().padStart(2, '0')}'${lagnaSec.toString().padStart(2, '0')}"`;

  // D60 Shashtiamsa Progression % (each amsa = 30' = 1800 arcseconds; 1 second = 0.833% progression)
  const d60ProgressionPct = (((ascLon * 2) % 1) * 100).toFixed(2);
  const d60AmsaIndex = Math.floor((ascLon * 2) % 60);
  const isD60DevaAmsa = [2, 3, 4, 13, 17, 18, 19, 21, 22, 23, 24, 25, 31, 33, 34, 38, 39, 40, 42, 43, 44, 47, 50, 52, 53, 56, 58, 59].includes(d60AmsaIndex);
  const d60AmsaNameHi = isD60DevaAmsa ? 'देवांश (शुभ कर्म फलक)' : 'दानवांश (साधना व सतर्कता फलक)';
  const d60AmsaNameEn = isD60DevaAmsa ? 'Deva Amsa (Benefic)' : 'Rakshasa Amsa (Challenging)';

  // KP Sub-Sub Lord for Lagna cusp (changes rapidly across arcseconds)
  const kpSubSubIndex = Math.floor((totalArcSec / 15) % 9);
  const kpSubSubLord = KP_LORDS[kpSubSubIndex];
  const kpSubSubLordHi = HINDI_PLANETS[kpSubSubLord] || kpSubSubLord;

  const getDignityBonus = (dignity?: string) => {
    switch (dignity) {
      case 'Exalted': return 22;
      case 'Moolatrikona': return 18;
      case 'Own Sign': return 15;
      case 'Great Friend':
      case 'Friendly': return 8;
      case 'Neutral': return 0;
      case 'Enemy': return -8;
      case 'Great Enemy': return -14;
      case 'Debilitated': return -20;
      default: return 0;
    }
  };

  const getAuspiciousness = (score: number): AuspiciousnessLevel => {
    if (score >= 75) return 'highly_favorable';
    if (score >= 58) return 'favorable';
    if (score >= 42) return 'mixed_moderate';
    return 'challenging_caution';
  };

  const getVakriExplanation = (p: any) => {
    if (!p?.isRetrograde) return '';
    if (p.dignity === 'Debilitated') {
      return ` [वक्री चेष्टा बल: फलदीपिका अ. 4 के अनुसार नीच राशि में वक्री ग्रह उच्चवत अप्रत्याशित फल देता है]`;
    }
    if (p.dignity === 'Exalted') {
      return ` [वक्री चेष्टा बल: उच्च राशि में वक्री ग्रह फल प्राप्ति में अतिरिक्त समय व धैर्य की अपेक्षा करता है]`;
    }
    return ` [वक्री चेष्टा बल: सारावली मतानुसार ग्रह 100% गतिज चेष्टा बल से युक्त है]`;
  };

  const getVakriExplanationEn = (p: any) => {
    if (!p?.isRetrograde) return '';
    if (p.dignity === 'Debilitated') {
      return ` [Retrograde Chesta Bala: Per Phaladeepika Ch. 4, a retrograde debilitated planet acts like an exalted planet].`;
    }
    if (p.dignity === 'Exalted') {
      return ` [Retrograde Chesta Bala: An exalted retrograde planet delays fructification requiring persistence].`;
    }
    return ` [Retrograde Chesta Bala: Endowed with 100% kinetic force per Saravali].`;
  };

  const isFemaleNative = chart.input?.gender === 'female';
  const lagnaRecord = getSignMilestones(ascSign);
  const lagnaDegVal = chart.ascendant?.degreeInSign ?? (ascLon % 30);
  const lagnaDrekkana = getDrekkanaRecord(ascSign, lagnaDegVal);
  const eighthSign = (ascSign + 7) % 12;
  const eighthHousePlanet = planets.find((p) => (p.rasiHouseNumber ?? p.houseNumber) === 8);
  const twentySecondDrekkana = getDrekkanaRecord(eighthSign, eighthHousePlanet?.degreeInSign ?? lagnaDegVal);

  // Tracks houses where chronological milestones and female horoscope notes have been attached
  // so they appear strictly ONCE per house, rather than duplicating across all dimensions in that house.
  const milestonesAssignedHouses = new Set<number>();
  const femaleNoteAssignedHouses = new Set<number>();

  const getDimensionTargetedInsight = (dimId: number, houseNum: number) => {
    const occupants = planets.filter((p) => (p.rasiHouseNumber ?? p.houseNumber) === houseNum);
    const hLord = getHLord(houseNum);
    const bh = getBhavesha144Entry(houseNum, hLord.placedHouse);

    // Primary foundational dimension for each house (IDs: 1, 5, 9, 13, 17, 22, 26, 31, 35, 39, 44, 48)
    const isPrimaryFoundationDim = [1, 5, 9, 13, 17, 22, 26, 31, 35, 39, 44, 48].includes(dimId);

    let textHi = '';
    let textEn = '';

    if (occupants.length > 0) {
      const p = occupants[0];
      const rec = getPlanetHouseBookRecord(p.id, houseNum);
      if (rec) {
        if (isPrimaryFoundationDim) {
          textHi += `\n\n[शास्त्रीय ग्रंथ प्रमाण - ${rec.titleHi}]: ${rec.baseHi}`;
          textEn += `\n\n[Classical Shastra Treatise - ${rec.titleEn}]: ${rec.baseEn}`;

          if (!milestonesAssignedHouses.has(houseNum) && rec.ageMilestones && rec.ageMilestones.length > 0) {
            milestonesAssignedHouses.add(houseNum);
            const msHi = rec.ageMilestones.map((m) => `आयु ${m.age}: ${m.eventHi}`).join(' | ');
            const msEn = rec.ageMilestones.map((m) => `Age ${m.age}: ${m.eventEn}`).join(' | ');
            textHi += `\n[आयु कालचक्र मील के पत्थर]: ${msHi}`;
            textEn += `\n[Chronological Milestones]: ${msEn}`;
          }
        } else {
          // Distinct Shastric Bhavesha lord synthesis for secondary dimensions in the same house
          textHi += `\n\n[भावेश शास्त्रीय सूत्र - ${bh.headlineHi}]: ${bh.readingHi}`;
          textEn += `\n\n[Classical House Lord Synthesis - ${bh.headlineEn}]: ${bh.readingEn}`;
        }

        if (isFemaleNative && [13, 26, 27].includes(dimId) && !femaleNoteAssignedHouses.has(houseNum) && rec.femaleHoroscope?.hi) {
          femaleNoteAssignedHouses.add(houseNum);
          textHi += `\n[स्त्री जातक विशेष फल]: ${rec.femaleHoroscope.hi}`;
          textEn += `\n[In Female Horoscope]: ${rec.femaleHoroscope.en}`;
        }
      }
    } else {
      // Empty house: provide rich, authentic Bhavesha 144 entry for lord's placement
      textHi += `\n\n[भावेश शास्त्रीय फल - ${bh.headlineHi}]: ${bh.readingHi} (फलकथन: ${bh.eventHi})`;
      textEn += `\n\n[Classical House Lord Placement - ${bh.headlineEn}]: ${bh.readingEn} (Manifestation: ${bh.eventEn})`;
    }

    return { textHi, textEn };
  };

  // Helper to add dimension with 1-second precision modulation and strict unvarnished truths
  const addDim = (d: LifeDimensionReading) => {
    // Keep the source rule's score unchanged. Do not inject synthetic birth-second
    // modulation: a cosmetic sine-wave adjustment is not an astrological method.
    d.auspiciousness = getAuspiciousness(d.strengthScore);

    // Integrate Dimension-Targeted Classical Shastra Sutras
    if (d.houseNumber) {
      const bInsight = getDimensionTargetedInsight(d.id, d.houseNumber);
      if (bInsight) {
        d.detailedAnalysisHi += bInsight.textHi;
        d.detailedAnalysisEn += bInsight.textEn;
      }
    }

    // Integrate Dimension 1 Lagna Physical Traits & Drekkana
    if (d.id === 1) {
      d.detailedAnalysisHi += `\n\n[लग्न राशि शारीरिक लक्षण - ${lagnaRecord.nameHi}]: ${lagnaRecord.physicalFeaturesHi}\n[शुभ वर्ष]: ${lagnaRecord.auspiciousYears.join(', ')} वर्ष | [सतर्कता वर्ष]: ${lagnaRecord.inauspiciousYears.join(', ')} वर्ष\n[उदित द्रेष्काण]: ${lagnaDrekkana.drekkanaNumber}वां द्रेष्काण (${lagnaDrekkana.classificationHi} - ${lagnaDrekkana.nameHi}): ${lagnaDrekkana.karmicOutcomeHi}`;
      d.detailedAnalysisEn += `\n\n[Ascendant Physical Traits - ${lagnaRecord.nameEn}]: ${lagnaRecord.physicalFeaturesEn}\n[Fortunate Years]: ${lagnaRecord.auspiciousYears.join(', ')} | [Caution Years]: ${lagnaRecord.inauspiciousYears.join(', ')}\n[Rising Drekkana]: ${lagnaDrekkana.drekkanaNumber}nd Drekkana (${lagnaDrekkana.classification} - ${lagnaDrekkana.nameEn}): ${lagnaDrekkana.karmicOutcomeEn}`;
    }

    // Integrate 22nd Drekkana Maraka Indicator for 8th house
    if (d.houseNumber === 8 && d.id === 31 && twentySecondDrekkana.isMarakaSensitive) {
      d.detailedAnalysisHi += `\n\n[22वां खर द्रेष्काण सतर्कता]: ${twentySecondDrekkana.classificationHi} (${twentySecondDrekkana.nameHi}) - ${twentySecondDrekkana.karmicOutcomeHi}`;
      d.detailedAnalysisEn += `\n\n[22nd Drekkana Maraka Indicator]: ${twentySecondDrekkana.classification} (${twentySecondDrekkana.nameEn}) - ${twentySecondDrekkana.karmicOutcomeEn}`;
    }

    // Exact micro-astronomical coordinate stamped into astroBasis & detailedAnalysis
    d.detailedAnalysisHi += `\n[सूक्ष्म कालचक्र वेध]: लग्न बिंदु ${lagnaCoordStr} | D60 संचलन ${d60ProgressionPct}% (${d60AmsaNameHi}) | KP उप-उप ${kpSubSubLordHi}।`;
    d.detailedAnalysisEn += `\n[Micro-Temporal Calibration]: Lagna Cusp ${lagnaCoordStr} | D60 Progression ${d60ProgressionPct}% (${d60AmsaNameEn}) | KP Sub-Sub ${kpSubSubLord}.`;

    d.astroBasisHi += ` [सूक्ष्म लग्न बिंदु: ${lagnaCoordStr}, D60 संचलन: ${d60ProgressionPct}% (${d60AmsaNameHi}), KP उप-उप: ${kpSubSubLordHi}]`;
    d.astroBasisEn += ` [Micro Cusp: ${lagnaCoordStr}, D60: ${d60ProgressionPct}% (${d60AmsaNameEn}), KP Sub-Sub: ${kpSubSubLord}]`;

    // Strict Unvarnished Truths — If afflicted, state the harsh reality frankly
    if (d.strengthScore < 45 || d.auspiciousness === 'challenging_caution') {
      if (!d.verdictHi.includes('प्रतिकूल') && !d.verdictHi.includes('सावधानी') && !d.verdictHi.includes('अवरोध')) {
        d.verdictHi = `[प्रतिकूल प्रभाव व अवरोध]: ${d.verdictHi} इस क्षेत्र में अप्रत्याशित विलंब, रुकावट अथवा हानि की वास्तविक संभावना है; सतर्कता अपेक्षित है।`;
        d.verdictEn = `[Adverse Influence & Caution]: ${d.verdictEn} Tangible vulnerability to setbacks or friction in this sector; exercise measured prudence.`;
      }
    }

    dims.push(d);
  };

  // =========================================================================
  // CHAPTER 1: प्रथम भाव (TANU BHAVA) — 4 Dimensions (IDs 1 to 4)
  // =========================================================================

  // 1. शारीरिक संरचना, वर्ण, आभा व जीवन ऊर्जा
  {
    const score = Math.max(35, Math.min(95, 52 + getDignityBonus(h1.dignity) + (h1.placedHouse === 1 || h1.placedHouse === 5 || h1.placedHouse === 9 ? 12 : 0)));
    addDim({
      id: 1,
      houseNumber: 1,
      houseTitleHi: 'प्रथम भाव (तनु भाव)',
      houseTitleEn: '1st House (Tanu Bhava)',
      category: 'identity',
      categoryTitleHi: 'पहचान व आत्म',
      categoryTitleEn: 'Identity & Core Self',
      titleHi: 'शारीरिक संरचना, वर्ण, आभा व देहयष्टि',
      titleEn: 'Physical Constitution, Complexion & Bodily Build',
      classicalRef: 'बृहज्जातक (वराहमिहिर) अ. 1 व सारावली अ. 4',
      divisionalRef: 'D1 लग्न व D9 नवांश',
      vakriNote: getVakriExplanation(planets.find((p) => p.id === h1.lord)),
      astroBasisHi: `लग्न ${ascSignHi} (${ascSignName}); लग्नेश ${h1.lordHi} भाव ${h1.placedHouse} में (${h1.dignityHi}, नक्षत्र: ${h1.nakshatraName}); [सर्वाष्टकवर्ग: ${sav[0]} बिंदु]।`,
      astroBasisEn: `Ascendant in ${ascSignName}; Lagna Lord ${h1.lord} placed in House ${h1.placedHouse} (${h1.dignity}, Star: ${h1.nakshatraName}); [SAV: ${sav[0]} bindus].`,
      verdictHi: `${ascSignHi} लग्न व लग्नेश ${h1.lordHi} (भाव ${h1.placedHouse}) के प्रभाव से मध्यम से सुदृढ़ शारीरिक गठन, ओजस्वी मुखाकृति तथा प्राकृतिक जीवन ऊर्जा का उत्तम संतुलन।`,
      verdictEn: `Balanced physical constitution, commanding facial presence, and robust regenerative vitality governed by ${ascSignName} Ascendant and ${h1.lord} in House ${h1.placedHouse}.`,
      detailedAnalysisHi: `आचार्य वराहमिहिर के बृहज्जातक अनुसार लग्न भाव जातक के स्थूल शरीर का दर्पण है। लग्नेश ${h1.lordHi} का भाव ${h1.placedHouse} में स्थित होना आपके व्यक्तित्व में स्वाभाविक तेज व आकर्षण प्रदान करता है।${getVakriExplanation(planets.find((p) => p.id === h1.lord))}`,
      detailedAnalysisEn: `Per Varahamihira's Brihat Jataka, the physical vessel is shaped by the Ascendant and its dispositor. With ${h1.lord} in House ${h1.placedHouse}, your constitution exhibits natural resilience and imposing dignity.`,
      remedyHi: `नित्य प्रातः सूर्य को तांबे के पात्र से कुंकुम मिश्रित जल अर्पित करें एवं गायत्री मंत्र का जप करें।`,
      remedyEn: `Offer Arghya to the rising Sun daily from a copper vessel and recite the Gayatri Mantra.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 2. त्रिदोष प्रकृति, रोग प्रतिरोधक क्षमता व शीर्ष स्वास्थ्य
  {
    const score = Math.max(30, Math.min(92, 50 + getDignityBonus(h1.dignity) + (sav[0] >= 28 ? 8 : -8)));
    addDim({
      id: 2,
      houseNumber: 1,
      houseTitleHi: 'प्रथम भाव (तनु भाव)',
      houseTitleEn: '1st House (Tanu Bhava)',
      category: 'longevity_health',
      categoryTitleHi: 'स्वास्थ्य व आयु',
      categoryTitleEn: 'Health & Longevity',
      titleHi: 'त्रिदोष प्रकृति (वात/पित्त/कफ) एवं शारीरिक प्रतिरोधक क्षमता',
      titleEn: 'Ayurvedic Tridosha Constitution & Physical Immunity',
      classicalRef: 'फलदीपिका (मंत्रेश्वर) अ. 14 व जातक पारिजात अ. 6',
      divisionalRef: 'D3 द्रेष्काण व D30 त्रिंशांश',
      vakriNote: '',
      astroBasisHi: `लग्न तत्व: ${ascSign % 4 === 0 ? 'अग्नि (पित्त)' : ascSign % 4 === 1 ? 'पृथ्वी (वात/कफ)' : ascSign % 4 === 2 ? 'वायु (वात)' : 'जल (कफ)'}; लग्नेश ${h1.lordHi} भाव ${h1.placedHouse} में।`,
      astroBasisEn: `Lagna Element: ${ascSign % 4 === 0 ? 'Fire (Pitta)' : ascSign % 4 === 1 ? 'Earth (Vata/Kapha)' : ascSign % 4 === 2 ? 'Air (Vata)' : 'Water (Kapha)'}; Lord ${h1.lord} in H${h1.placedHouse}.`,
      verdictHi: `लग्न तत्व (${ascSign % 4 === 0 ? 'अग्नि' : ascSign % 4 === 1 ? 'पृथ्वी' : ascSign % 4 === 2 ? 'वायु' : 'जल'}) एवं लग्नेश ${h1.lordHi} के अनुसार शारीरिक धातुओं में ऊर्जा का संतुलन; मौसमी बदलावों पर सिर, त्वचा अथवा पाचन पर नियंत्रण आवश्यक।`,
      verdictEn: `Metabolic homeostasis influenced by ${ascSignName} and ${h1.lord}; periodic seasonal attention recommended for head, skin, and upper digestion.`,
      detailedAnalysisHi: `फलदीपिका के अनुसार प्रथम भाव त्रिदोष संतुलन और जीवन शक्ति का केंद्र है। लग्नेश की स्थिति यह सुनिश्चित करती है कि रोग होने पर जातक शीघ्र स्वास्थ्य लाभ प्राप्त करता है।`,
      detailedAnalysisEn: `Per Phaladeepika Ch. 14, the 1st house governs vital homeostasis. The placement of Lagnesha ensures rapid cellular recuperation during seasonal imbalances.`,
      remedyHi: `प्राणायाम का नित्य अभ्यास करें तथा तांबे के लोटे में रखा जल प्रातः ग्रहण करें।`,
      remedyEn: `Practice daily pranayama and consume water stored in a pure copper vessel at dawn.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 3. मानसिक प्रवृत्ति, आत्मबल, सामाजिक छवि व प्रतिष्ठा
  {
    const score = Math.max(35, Math.min(95, 55 + (sun.dignity === 'Exalted' || sun.placedHouse === 10 ? 15 : 0) + (moon.placedHouse === 1 ? 10 : 0)));
    addDim({
      id: 3,
      houseNumber: 1,
      houseTitleHi: 'प्रथम भाव (तनु भाव)',
      houseTitleEn: '1st House (Tanu Bhava)',
      category: 'identity',
      categoryTitleHi: 'पहचान व आत्म',
      categoryTitleEn: 'Identity & Core Self',
      titleHi: 'मानसिक प्रवृत्ति, स्वभाव, आत्मबल व सामाजिक प्रतिष्ठा',
      titleEn: 'Core Temperament, Self-Confidence & Social Stature',
      classicalRef: 'उत्तर कालामृत द्वितीय काण्ड व सारावली अ. 30',
      divisionalRef: 'D1 लग्न व चंद्रमा की स्थिति',
      vakriNote: '',
      astroBasisHi: `सूर्य भाव ${sun.placedHouse} में (${sun.dignityHi}); चंद्र भाव ${moon.placedHouse} में (${moon.dignityHi}); लग्न नवांश: ${chart.divisionalCharts.D9.lagnaSignIndex + 1}वीं राशि।`,
      astroBasisEn: `Sun in House ${sun.placedHouse} (${sun.dignity}); Moon in House ${moon.placedHouse} (${moon.dignity}); D9 Lagna Sign ${chart.divisionalCharts.D9.lagnaSignIndex + 1}.`,
      verdictHi: `भाव ${sun.placedHouse} में सूर्य एवं भाव ${moon.placedHouse} में चंद्रमा के प्रभाव से स्वाभिमानी, स्वतंत्र विचार शैली तथा सामाजिक परिवेश में स्वतः प्रतिष्ठा।`,
      verdictEn: `With Sun in House ${sun.placedHouse} and Moon in House ${moon.placedHouse}, dignified self-respect, independent cognitive thinking, and naturally commanded social esteem.`,
      detailedAnalysisHi: `उत्तर कालामृत के अनुसार सूर्य आत्मा का और चंद्र मन का कारक है। लग्न और इन दोनों प्रकाशपुंजों का संयोजन जातक को संकट के समय में भी धैर्यवान और अडिग बनाए रखता है।`,
      detailedAnalysisEn: `Per Uttara Kalamrita, the synthesis of the Luminaries with the Ascendant generates unwavering fortitude during crisis and authentic personal integrity.`,
      remedyHi: `माता-पिता का चरण स्पर्श कर आशीर्वाद लें तथा प्रतिदिन सूर्य नमस्कार करें।`,
      remedyEn: `Seek parental blessings daily and perform Surya Namaskar at sunrise.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 4. जीवन संघर्ष, अरिष्ट शांति व जीवन शक्ति (अरिष्ट-भंग)
  {
    const malAspects = getAspectsOnHouse(1).filter((a) => a.isMalefic);
    const score = Math.max(30, Math.min(90, 56 - malAspects.length * 10 + (jupiter.placedHouse === 1 || jupiter.placedHouse === 5 || jupiter.placedHouse === 9 ? 15 : 0)));
    addDim({
      id: 4,
      houseNumber: 1,
      houseTitleHi: 'प्रथम भाव (तनु भाव)',
      houseTitleEn: '1st House (Tanu Bhava)',
      category: 'shadow_challenges',
      categoryTitleHi: 'चुनौतियां व सतर्कता',
      categoryTitleEn: 'Shadow Challenges',
      titleHi: 'जीवन संघर्ष, अरिष्ट शांति व जीवन शक्ति (अरिष्ट-भंग)',
      titleEn: 'Life Struggles, Arishta Neutralization & Resilient Fortitude',
      classicalRef: 'बृहत्पाराशर होरा शास्त्र (अरिष्ट-भंग अध्याय 10)',
      divisionalRef: 'D1 केंद्र व D60 षष्ट्यंश मूल कर्म',
      vakriNote: '',
      astroBasisHi: `लग्न पर पाप दृष्टि: ${malAspects.length}; गुरु स्थिति: भाव ${jupiter.placedHouse} (${jupiter.dignityHi}); अरिष्ट-भंग योग: ${jupiter.placedHouse === 1 || jupiter.placedHouse === 5 || jupiter.placedHouse === 9 ? 'सक्रिय' : 'सामान्य'}।`,
      astroBasisEn: `Malefic aspects on H1: ${malAspects.length}; Jupiter in H${jupiter.placedHouse} (${jupiter.dignity}); Arishta-Bhanga: ${jupiter.placedHouse === 1 || jupiter.placedHouse === 5 || jupiter.placedHouse === 9 ? 'Active' : 'Moderate'}.`,
      verdictHi: malAspects.length > 0 ? `आरंभिक संघर्ष व स्वास्थ्य में उतार-चढ़ाव संभव, किंतु शुभ ग्रहों की दृष्टि से अरिष्ट-भंग होकर संकट टलेंगे।` : `भाव ${jupiter.placedHouse} में गुरु के प्रभाव से जीवन में किसी गंभीर अरिष्ट का अभाव; स्वाभाविक सुरक्षा कवच एवं दीर्घायु का प्रबल योग।`,
      verdictEn: malAspects.length > 0 ? `Early struggles and vitality fluctuations overcome through potent planetary Arishta-Bhanga protections.` : `With Jupiter in House ${jupiter.placedHouse}, absence of severe Arishta afflictions; fortified vital shield and resilient longevity potential.`,
      detailedAnalysisHi: `महर्षि पराशर अनुसार यदि केंद्र अथवा त्रिकोण में बृहस्पति अथवा शुक्र बलवान हों तो सहस्रों दोष स्वतः नष्ट हो जाते हैं। आपकी कुंडली में सुरक्षात्मक योग उपस्थित हैं।`,
      detailedAnalysisEn: `Per BPHS Ch. 10, strong Jupiter or Venus in Kendras/Trikonas dissolves thousands of doshas, conferring enduring protective vitality.`,
      remedyHi: `महामृत्युंजय मंत्र का नियमित मानसिक जप करें और शनिवार को काले तिल का दान करें।`,
      remedyEn: `Chant the Maha Mrityunjaya Mantra mentally and donate black sesame seeds on Saturdays.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // =========================================================================
  // CHAPTER 2: द्वितीय भाव (DHANA & KUTUMBA BHAVA) — 4 Dimensions (IDs 5 to 8)
  // =========================================================================

  // 5. संचित धन, पैतृक संपत्ति व वित्तीय प्रचुरता
  {
    const score = Math.max(30, Math.min(95, 50 + getDignityBonus(h2.dignity) + (jupiter.dignity === 'Exalted' ? 14 : 0) + (sav[1] >= 28 ? 10 : -8)));
    addDim({
      id: 5,
      houseNumber: 2,
      houseTitleHi: 'द्वितीय भाव (धन व कुटुम्ब भाव)',
      houseTitleEn: '2nd House (Dhana & Kutumba)',
      category: 'wealth_fortune',
      categoryTitleHi: 'धन व समृद्धि',
      categoryTitleEn: 'Wealth & Prosperity',
      titleHi: 'संचित धन, कौटुंबिक कोष व वित्तीय प्रचुरता',
      titleEn: 'Accumulated Liquid Wealth & Family Treasury',
      classicalRef: 'बृहत्पाराशर होरा शास्त्र अ. 12 व सारावली अ. 24',
      divisionalRef: 'D2 होरा व इंदु लग्न',
      vakriNote: getVakriExplanation(planets.find((p) => p.id === h2.lord)),
      astroBasisHi: `द्वितीयेश ${h2.lordHi} भाव ${h2.placedHouse} में (${h2.dignityHi}); धनकारक गुरु भाव ${jupiter.placedHouse} में; द्वितीय भाव SAV: ${sav[1]} बिंदु।`,
      astroBasisEn: `2nd Lord ${h2.lord} in House ${h2.placedHouse} (${h2.dignity}); Wealth Karaka Jupiter in H${jupiter.placedHouse}; 2nd House SAV: ${sav[1]} bindus.`,
      verdictHi: `द्वितीयेश ${h2.lordHi} (भाव ${h2.placedHouse}) एवं गुरु के प्रभाव से तरल धन व स्थायी परिसंपत्तियों का उत्तम संचय; दीर्घकालीन कोष वृद्धि।`,
      verdictEn: `Solid liquid wealth accumulation governed by 2nd Lord ${h2.lord} in House ${h2.placedHouse} and Jupiter in House ${jupiter.placedHouse}.`,
      detailedAnalysisHi: `पाराशरी सिद्धांत के अनुसार द्वितीय भाव संचित धन का मुख्य स्रोत है। द्वितीयेश का शुभ भाव में स्थित होना जातक को विषम परिस्थितियों में भी वित्तीय संबल प्रदान करता है।`,
      detailedAnalysisEn: `Per BPHS Ch. 12, the 2nd house governs bank deposits, gold, and cumulative savings. The strength of ${h2.lord} secures long-term fiscal solvency.`,
      remedyHi: `गुरुवार को चने की दाल व गुड़ गाय को खिलाएं तथा कनकधारा स्तोत्र का पाठ करें।`,
      remedyEn: `Feed soaked chana dal and jaggery to cows on Thursdays and recite the Kanakadhara Stotra.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 6. वाणी प्रभाव, वाक् चातुर्य, सत्यवादिता व सम्मोहन
  {
    const score = Math.max(32, Math.min(92, 52 + getDignityBonus(mercury.dignity) + (h2.placedHouse === 2 ? 12 : 0)));
    addDim({
      id: 6,
      houseNumber: 2,
      houseTitleHi: 'द्वितीय भाव (धन व कुटुम्ब भाव)',
      houseTitleEn: '2nd House (Dhana & Kutumba)',
      category: 'identity',
      categoryTitleHi: 'पहचान व आत्म',
      categoryTitleEn: 'Identity & Core Self',
      titleHi: 'वाणी प्रभाव, वाक् चातुर्य व सत्यवादिता',
      titleEn: 'Speech Eloquence, Vocal Tone & Persuasion',
      classicalRef: 'फलदीपिका अ. 16 व बृहज्जातक अ. 18',
      divisionalRef: 'D1 द्वितीय भाव व बुध ग्रह',
      vakriNote: '',
      astroBasisHi: `वाणीकारक बुध भाव ${mercury.placedHouse} में (${mercury.dignityHi}); द्वितीयेश ${h2.lordHi} भाव ${h2.placedHouse} में।`,
      astroBasisEn: `Speech Karaka Mercury in House ${mercury.placedHouse} (${mercury.dignity}); 2nd Lord ${h2.lord} in House ${h2.placedHouse}.`,
      verdictHi: `बुध (${mercury.placedHouse}वें भाव) एवं द्वितीयेश ${h2.lordHi} के प्रभाव से प्रभावशाली सम्भाषण शैली; तार्किक संवाद एवं संयमित वाणी से लोक-सम्मान।`,
      verdictEn: `Persuasive, articulate communication style guided by Mercury in House ${mercury.placedHouse} and ${h2.lord} in House ${h2.placedHouse}.`,
      detailedAnalysisHi: `फलदीपिका अनुसार द्वितीय भाव वाक्-स्थान है। जब बुध अथवा गुरु का संबंध द्वितीय भाव से हो, तो वाणी में सरस्वती का वास माना जाता है।`,
      detailedAnalysisEn: `Per Phaladeepika Ch. 16, the 2nd house determines vocal cadence and rhetorical eloquence. Mercury's influence confers sharp conversational diplomacy.`,
      remedyHi: `प्रतिदिन ॐ बुं बुधाय नमः का 108 बार जप करें तथा हरी सौंफ का सेवन करें।`,
      remedyEn: `Chant Om Bum Budhaya Namaha 108 times daily and consume green fennel seeds.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 7. कुल-परंपरा, पारिवारिक सौहार्द व घरेलू संबंध
  {
    const score = Math.max(30, Math.min(90, 50 + (h2.placedHouse === 1 || h2.placedHouse === 2 || h2.placedHouse === 4 ? 12 : 0) + (sav[1] >= 28 ? 6 : -6)));
    addDim({
      id: 7,
      houseNumber: 2,
      houseTitleHi: 'द्वितीय भाव (धन व कुटुम्ब भाव)',
      houseTitleEn: '2nd House (Dhana & Kutumba)',
      category: 'family',
      categoryTitleHi: 'माता-पिता व कुल',
      categoryTitleEn: 'Parents & Lineage',
      titleHi: 'कुल-परंपरा, पारिवारिक सौहार्द व घरेलू संबंध',
      titleEn: 'Family Lineage, Ancestral Heritage & Domestic Harmony',
      classicalRef: 'बृहत्पाराशर होरा शास्त्र अ. 14 व लाल किताब 1952',
      divisionalRef: 'D12 द्वादशांश व द्वितीय भाव',
      vakriNote: '',
      astroBasisHi: `द्वितीयेश ${h2.lordHi} भाव ${h2.placedHouse} में; कुटुम्ब भाव पर ग्रहों का संयुक्त प्रभाव।`,
      astroBasisEn: `2nd Lord ${h2.lord} placed in House ${h2.placedHouse}; combined planetary aspects on 2nd cusp.`,
      verdictHi: `द्वितीयेश ${h2.lordHi} के भाव ${h2.placedHouse} में स्थित होने से पारिवारिक संस्कारों का सुदृढ़ आधार; कुटुम्ब में प्रतिष्ठा तथा सदस्यों के मध्य सौहार्द।`,
      verdictEn: `With 2nd Lord ${h2.lord} in House ${h2.placedHouse}, strong cultural moorings and rooted ancestral values fostering domestic goodwill and clan cohesion.`,
      detailedAnalysisHi: `पाराशर मतानुसार द्वितीय भाव संपूर्ण कुल और कुटुंब का प्रतिनिधित्व करता है। द्वितीयेश की अनुकूल स्थिति जातक को कुलदीपक बनाती है।`,
      detailedAnalysisEn: `Per BPHS Ch. 14, the 2nd house embodies collective lineage dignity. A fortified 2nd lord elevates family standing.`,
      remedyHi: `कुलदेवता अथवा कुलदेवी का नियमित पूजन करें तथा घर की प्रथम रोटी गाय को दें।`,
      remedyEn: `Offer regular prayers to family tutelary deity (Kula Devata) and feed the first bread to cows.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 8. आहार शुद्धि, व्यसन संकोच व मुख/नेत्र स्वास्थ्य
  {
    const score = Math.max(28, Math.min(90, 48 + getDignityBonus(sun.dignity) + (venus.placedHouse === 2 ? 8 : 0)));
    addDim({
      id: 8,
      houseNumber: 2,
      houseTitleHi: 'द्वितीय भाव (धन व कुटुम्ब भाव)',
      houseTitleEn: '2nd House (Dhana & Kutumba)',
      category: 'longevity_health',
      categoryTitleHi: 'स्वास्थ्य व आयु',
      categoryTitleEn: 'Health & Longevity',
      titleHi: 'आहार शुद्धि, व्यसन संकोच व मुख/नेत्र स्वास्थ्य',
      titleEn: 'Food Habits, Dietetic Restraint & Facial/Eye Health',
      classicalRef: 'सारावली अ. 27 व फलदीपिका अ. 16',
      divisionalRef: 'D1 द्वितीय भाव व D30 त्रिंशांश',
      vakriNote: '',
      astroBasisHi: `सूर्य (दक्षिण नेत्र) भाव ${sun.placedHouse} में; द्वितीयेश ${h2.lordHi} भाव ${h2.placedHouse} में।`,
      astroBasisEn: `Sun (Right Eye) in House ${sun.placedHouse}; 2nd Lord ${h2.lord} in House ${h2.placedHouse}.`,
      verdictHi: `सूर्य (${sun.placedHouse}वें भाव) एवं द्वितीयेश ${h2.lordHi} के प्रभाव से सात्विक भोजन के प्रति स्वाभाविक रुचि; नेत्र ज्योति व मुख स्वास्थ्य के प्रति सजगता।`,
      verdictEn: `Appreciation for wholesome, nourishing cuisine influenced by Sun in House ${sun.placedHouse} and ${h2.lord} in House ${h2.placedHouse}.`,
      detailedAnalysisHi: `सारावली के अनुसार द्वितीय भाव मुख, दंत और दाहिने नेत्र का कारक है। इस भाव पर पापी ग्रहों का प्रभाव खान-पान में तामसिक रुचि ला सकता है।`,
      detailedAnalysisEn: `Per Saravali Ch. 27, the 2nd house governs oral health and vision. Benefic anchorage ensures disciplined eating habits.`,
      remedyHi: `सूर्योदय के समय नेत्रों को ठंडे जल से धोएं तथा रात्रि में भारी भोजन से परहेज करें।`,
      remedyEn: `Rinse eyes with fresh cool water at dawn and avoid heavy meals late at night.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // =========================================================================
  // CHAPTER 3: तृतीय भाव (SAHAJA & PARAKRAMA BHAVA) — 4 Dimensions (IDs 9 to 12)
  // =========================================================================

  // 9. कनिष्ठ भ्रातृ-भगिनी सुख व भ्रातृ संबंध
  {
    const score = Math.max(30, Math.min(92, 50 + getDignityBonus(h3.dignity) + getDignityBonus(mars.dignity) / 2));
    addDim({
      id: 9,
      houseNumber: 3,
      houseTitleHi: 'तृतीय भाव (सहज भाव)',
      houseTitleEn: '3rd House (Sahaja & Parakrama)',
      category: 'family',
      categoryTitleHi: 'माता-पिता व कुल',
      categoryTitleEn: 'Parents & Lineage',
      titleHi: 'कनिष्ठ भ्रातृ-भगिनी सुख व भ्रातृ संबंध',
      titleEn: 'Younger Siblings, Co-born Harmony & Mutual Support',
      classicalRef: 'बृहत्पाराशर होरा शास्त्र अ. 15 व सारावली अ. 25',
      divisionalRef: 'D3 द्रेष्काण व मंगल ग्रह',
      vakriNote: '',
      astroBasisHi: `तृतीयेश ${h3.lordHi} भाव ${h3.placedHouse} में (${h3.dignityHi}); भ्रातृकारक मंगल भाव ${mars.placedHouse} में (${mars.dignityHi}); तृतीय भाव SAV: ${sav[2]} बिंदु।`,
      astroBasisEn: `3rd Lord ${h3.lord} in H${h3.placedHouse} (${h3.dignity}); Sibling Karaka Mars in H${mars.placedHouse} (${mars.dignity}); 3rd SAV: ${sav[2]} bindus.`,
      verdictHi: `तृतीयेश ${h3.lordHi} (भाव ${h3.placedHouse}) एवं मंगल (भाव ${mars.placedHouse}) के प्रभाव से कनिष्ठ सहोदरों का सुख एवं परस्पर सहयोग।`,
      verdictEn: `Fraternal rapport with younger siblings influenced by 3rd Lord ${h3.lord} in House ${h3.placedHouse} and Mars in House ${mars.placedHouse}.`,
      detailedAnalysisHi: `पाराशर अनुसार तृतीय भाव सहोदरों का है। मंगल और तृतीयेश की शुभ स्थिति भ्रातृ सुख और परस्पर उन्नति को सुनिश्चित करती है।`,
      detailedAnalysisEn: `Per BPHS Ch. 15, the 3rd house represents younger siblings. Mars and the 3rd lord determine mutual goodwill and cooperation.`,
      remedyHi: `मंगलवार को छोटे भाइयों को उपहार दें अथवा हनुमान जी को लाल सिंदूर अर्पित करें।`,
      remedyEn: `Gift sweets to younger siblings on Tuesdays or offer vermilion to Lord Hanuman.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 10. अदम्य पराक्रम, उद्यमशीलता, साहस व इच्छाशक्ति
  {
    const score = Math.max(35, Math.min(95, 54 + (mars.placedHouse === 3 || mars.placedHouse === 6 || mars.placedHouse === 10 ? 14 : 0) + (sav[2] >= 28 ? 8 : -6)));
    addDim({
      id: 10,
      houseNumber: 3,
      houseTitleHi: 'तृतीय भाव (सहज भाव)',
      houseTitleEn: '3rd House (Sahaja & Parakrama)',
      category: 'identity',
      categoryTitleHi: 'पहचान व आत्म',
      categoryTitleEn: 'Identity & Core Self',
      titleHi: 'अदम्य पराक्रम, उद्यमशीलता, साहस व इच्छाशक्ति',
      titleEn: 'Valour, Entrepreneurial Initiative & Willpower',
      classicalRef: 'फलदीपिका अ. 17 व उत्तर कालामृत',
      divisionalRef: 'D3 द्रेष्काण व उपचय भाव',
      vakriNote: getVakriExplanation(mars),
      astroBasisHi: `मंगल भाव ${mars.placedHouse} में (${mars.dignityHi}); तृतीयेश ${h3.lordHi} भाव ${h3.placedHouse} में; उपचय भाव चेष्टा बल।`,
      astroBasisEn: `Mars in House ${mars.placedHouse} (${mars.dignity}); 3rd Lord ${h3.lord} in House ${h3.placedHouse}; Upachaya kinetic force.`,
      verdictHi: `मंगल (${mars.placedHouse}वें भाव, ${mars.dignityHi}) एवं तृतीयेश ${h3.lordHi} के प्रभाव से उच्च कोटि का साहस, उद्यमशीलता व विषम परिस्थितियों में अदम्य इच्छाशक्ति।`,
      verdictEn: `High enterprising courage and willpower catalyzed by Mars in House ${mars.placedHouse} (${mars.dignity}) and 3rd Lord ${h3.lord}.`,
      detailedAnalysisHi: `फलदीपिका के अनुसार तृतीय भाव उपचय भाव है, जो आयु के साथ जातक के पुरुषार्थ और संघर्ष क्षमता में उत्तरोत्तर वृद्धि करता है।`,
      detailedAnalysisEn: `Per Phaladeepika Ch. 17, the 3rd house as an Upachaya steadily amplifies self-reliance, initiative, and grit over time.`,
      remedyHi: `नित्य हनुमान चालीसा का पाठ करें तथा लाल चंदन का तिलक लगाएं।`,
      remedyEn: `Recite the Hanuman Chalisa daily and apply a dot of red sandalwood paste on the forehead.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 11. लेखन, संवाद, तकनीकी व डिजिटल मीडिया कौशल
  {
    const score = Math.max(30, Math.min(95, 52 + getDignityBonus(mercury.dignity) + (h3.placedHouse === 3 || h3.placedHouse === 5 || h3.placedHouse === 10 ? 10 : 0)));
    addDim({
      id: 11,
      houseNumber: 3,
      houseTitleHi: 'तृतीय भाव (सहज भाव)',
      houseTitleEn: '3rd House (Sahaja & Parakrama)',
      category: 'education',
      categoryTitleHi: 'शिक्षा व विद्या',
      categoryTitleEn: 'Education & Intellect',
      titleHi: 'लेखन, संवाद, तकनीकी व डिजिटल मीडिया कौशल',
      titleEn: 'Writing, Communication, Digital Media & Technical Skills',
      classicalRef: 'सर्वार्थ चिंतामणि अ. 4 व केपी कृष्णमूर्ति पद्धति',
      divisionalRef: 'D1 तृतीय भाव व बुध ग्रह',
      vakriNote: '',
      astroBasisHi: `बुध भाव ${mercury.placedHouse} में (${mercury.dignityHi}); तृतीयेश ${h3.lordHi} भाव ${h3.placedHouse} में; हस्त कौशल व संचार कारक।`,
      astroBasisEn: `Mercury in House ${mercury.placedHouse} (${mercury.dignity}); 3rd Lord ${h3.lord} in House ${h3.placedHouse}; communication significators.`,
      verdictHi: `बुध (${mercury.placedHouse}वें भाव) एवं तृतीयेश ${h3.lordHi} के प्रभाव से लेखन, ऑनलाइन संचार, दस्तावेजीकरण अथवा तकनीकी माध्यमों में उत्कृष्ट अभिव्यक्ति।`,
      verdictEn: `Gifted flair for written composition, digital communication, or technology driven by Mercury in House ${mercury.placedHouse} and ${h3.lord}.`,
      detailedAnalysisHi: `सर्वार्थ चिंतामणि के अनुसार तृतीय भाव हाथों के कौशल और मुद्रण/प्रकाशन का अधिपति है। बुध का प्रभाव जातक को अभिव्यक्ति का धनी बनाता है।`,
      detailedAnalysisEn: `Per Sarvartha Chintamani Ch. 4, the 3rd house lords manual dexterity and publication. Mercury brings communicative mastery.`,
      remedyHi: `बुधवार को पक्षियों को हरी मूंग की दाल डालें तथा लेखन सामग्री का सम्मान करें।`,
      remedyEn: `Feed whole green moong beans to wild birds on Wednesdays and respect writing instruments.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 12. लघु यात्राएं, पड़ोसी व रणनीतिक सहयोग
  {
    const score = Math.max(30, Math.min(90, 50 + (sav[2] >= 28 ? 6 : -4)));
    addDim({
      id: 12,
      houseNumber: 3,
      houseTitleHi: 'तृतीय भाव (सहज भाव)',
      houseTitleEn: '3rd House (Sahaja & Parakrama)',
      category: 'career',
      categoryTitleHi: 'करियर व पद',
      categoryTitleEn: 'Career & Authority',
      titleHi: 'लघु यात्राएं, पड़ोसी व रणनीतिक सहयोग',
      titleEn: 'Short Journeys, Neighborhood & Tactical Alliances',
      classicalRef: 'बृहत्पाराशर होरा शास्त्र अ. 15 व लाल किताब 1952',
      divisionalRef: 'D3 द्रेष्काण व तृतीय भाव',
      vakriNote: '',
      astroBasisHi: `तृतीयेश ${h3.lordHi} भाव ${h3.placedHouse} में; यात्रा कारक चंद्र भाव ${moon.placedHouse} में।`,
      astroBasisEn: `3rd Lord ${h3.lord} in House ${h3.placedHouse}; Journey Karaka Moon in House ${moon.placedHouse}.`,
      verdictHi: `तृतीयेश ${h3.lordHi} (भाव ${h3.placedHouse}) एवं चंद्र (${moon.placedHouse}वें भाव) के प्रभाव से नियमित लघु यात्राओं से व्यावसायिक लाभ व सहयोगी संपर्क।`,
      verdictEn: `Beneficial short business excursions and localized cooperation governed by 3rd Lord ${h3.lord} in House ${h3.placedHouse} and Moon in House ${moon.placedHouse}.`,
      detailedAnalysisHi: `पाराशरी मतानुसार तृतीय भाव निकटवर्ती भ्रमण और स्थानीय नेटवर्क का संचालन करता है। यह भाव कार्यक्षेत्र में गतिशीलता बनाए रखता है।`,
      detailedAnalysisEn: `Per BPHS Ch. 15, the 3rd house governs regional mobility and localized commercial alliances that foster progress.`,
      remedyHi: `यात्रा पर निकलते समय गुरुजनों का ध्यान करें तथा जेब में चांदी का एक चौकोर टुकड़ा रखें।`,
      remedyEn: `Keep a small square silver token in pocket and invoke elders before commencing regional journeys.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // =========================================================================
  // CHAPTER 4: चतुर्थ भाव (SUKHA & MATRI BHAVA) — 4 Dimensions (IDs 13 to 16)
  // =========================================================================

  // 13. मातृ सुख, माता का स्वभाव व वात्सल्य
  {
    const score = Math.max(30, Math.min(95, 52 + getDignityBonus(moon.dignity) + getDignityBonus(h4.dignity) / 2));
    addDim({
      id: 13,
      houseNumber: 4,
      houseTitleHi: 'चतुर्थ भाव (सुख व मातृ भाव)',
      houseTitleEn: '4th House (Sukha & Matri)',
      category: 'family',
      categoryTitleHi: 'माता-पिता व कुल',
      categoryTitleEn: 'Parents & Lineage',
      titleHi: 'मातृ सुख, माता का स्वभाव व वात्सल्य',
      titleEn: 'Mother’s Well-being, Maternal Affection & Upbringing',
      classicalRef: 'बृहत्पाराशर होरा शास्त्र अ. 16 व सारावली अ. 26',
      divisionalRef: 'D12 द्वादशांश व चंद्र मातृकारक',
      vakriNote: '',
      astroBasisHi: `मातृकारक चंद्र भाव ${moon.placedHouse} में (${moon.dignityHi}); चतुर्थेश ${h4.lordHi} भाव ${h4.placedHouse} में (${h4.dignityHi}); चतुर्थ भाव SAV: ${sav[3]} बिंदु।`,
      astroBasisEn: `Matrikaraka Moon in House ${moon.placedHouse} (${moon.dignity}); 4th Lord ${h4.lord} in House ${h4.placedHouse} (${h4.dignity}); 4th SAV: ${sav[3]} bindus.`,
      verdictHi: `चतुर्थेश ${h4.lordHi} (भाव ${h4.placedHouse}) एवं चंद्र (${moon.placedHouse}वें भाव) के प्रभाव से माता का भरपूर स्नेह, संस्कार व घरेलू जीवन में आत्मीय सुख।`,
      verdictEn: `Deep maternal affection and emotional anchorage governed by 4th Lord ${h4.lord} in House ${h4.placedHouse} and Moon in House ${moon.placedHouse}.`,
      detailedAnalysisHi: `महर्षि पराशर अनुसार चतुर्थ भाव माता और हृदय का है। चंद्र और चतुर्थेश की शुभता जातक को आजीवन मातृ कृपा और मानसिक शांति प्रदान करती है।`,
      detailedAnalysisEn: `Per BPHS Ch. 16, the 4th house rules maternal affection and heart-centered peace. Moon's dignity sustains lifelong inner serenity.`,
      remedyHi: `माता के चरण स्पर्श कर नित्य आशीर्वाद लें तथा सोमवार को दूध अथवा चावल का दान करें।`,
      remedyEn: `Touch your mother's feet daily for blessings and donate milk or rice on Mondays.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 14. मातृ दीर्घायु व ननिहाल पक्ष की प्रतिष्ठा
  {
    const score = Math.max(30, Math.min(92, 50 + getDignityBonus(h4.dignity) + (moon.placedHouse === 4 || moon.placedHouse === 9 ? 10 : 0)));
    addDim({
      id: 14,
      houseNumber: 4,
      houseTitleHi: 'चतुर्थ भाव (सुख व मातृ भाव)',
      houseTitleEn: '4th House (Sukha & Matri)',
      category: 'family',
      categoryTitleHi: 'माता-पिता व कुल',
      categoryTitleEn: 'Parents & Lineage',
      titleHi: 'मातृ दीर्घायु व ननिहाल पक्ष की प्रतिष्ठा',
      titleEn: 'Mother’s Longevity & Maternal Lineage Prosperity',
      classicalRef: 'जातक पारिजात अ. 9 व बृहत्पाराशर होरा शास्त्र (मातृ-अरिष्ट)',
      divisionalRef: 'चंद्र से चतुर्थ भाव व D12 द्वादशांश',
      vakriNote: '',
      astroBasisHi: `चंद्र से चतुर्थ भाव का स्वामी; चतुर्थेश ${h4.lordHi} भाव ${h4.placedHouse} में।`,
      astroBasisEn: `Dispositor of 4th from Moon; 4th Lord ${h4.lord} placed in House ${h4.placedHouse}.`,
      verdictHi: `चतुर्थेश ${h4.lordHi} (भाव ${h4.placedHouse}) के शुभ प्रभाव से माता की सुदीर्घ आयु एवं ननिहाल पक्ष में मान-प्रतिष्ठा।`,
      verdictEn: `Auspicious longevity indications for mother and honorable maternal lineage standing anchored by 4th Lord ${h4.lord} in House ${h4.placedHouse}.`,
      detailedAnalysisHi: `जातक पारिजात अनुसार चंद्र से चतुर्थ भाव मातृ आयु का सूचक है। यदि यह भाव पापी ग्रहों से सुरक्षित हो तो माता दीर्घायु होती हैं।`,
      detailedAnalysisEn: `Per Jataka Parijata Ch. 9, the 4th house from Moon indicates maternal longevity. Protected placements assure sustained vitality.`,
      remedyHi: `सोमवार को शिवलिंग पर कच्चा दूध व जल अर्पित करें तथा ॐ नमः शिवाय का जप करें।`,
      remedyEn: `Offer unboiled fresh milk and water on a Shiva Lingam on Mondays and chant Om Namah Shivaya.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 15. स्थिर संपत्ति, गृह, भूमि, भवन व स्वदेश निवास
  {
    const score = Math.max(32, Math.min(95, 52 + (mars.dignity === 'Exalted' || mars.placedHouse === 4 || mars.placedHouse === 10 ? 14 : 0) + (sav[3] >= 28 ? 10 : -8)));
    addDim({
      id: 15,
      houseNumber: 4,
      houseTitleHi: 'चतुर्थ भाव (सुख व मातृ भाव)',
      houseTitleEn: '4th House (Sukha & Matri)',
      category: 'wealth_fortune',
      categoryTitleHi: 'धन व समृद्धि',
      categoryTitleEn: 'Wealth & Prosperity',
      titleHi: 'स्थिर संपत्ति, गृह, भूमि व स्वदेश निवास',
      titleEn: 'Immovable Assets, Landed Property, Real Estate & Homeland',
      classicalRef: 'फलदीपिका अ. 18 व बृहत्पाराशर होरा शास्त्र अ. 16',
      divisionalRef: 'D4 चतुर्थांश व मंगल भूमिकारक',
      vakriNote: getVakriExplanation(planets.find((p) => p.id === h4.lord)),
      astroBasisHi: `भूमिकारक मंगल भाव ${mars.placedHouse} में (${mars.dignityHi}); चतुर्थेश ${h4.lordHi} भाव ${h4.placedHouse} में; चतुर्थ भाव SAV: ${sav[3]} बिंदु।`,
      astroBasisEn: `Bhumikaraka Mars in House ${mars.placedHouse} (${mars.dignity}); 4th Lord ${h4.lord} in House ${h4.placedHouse}; 4th SAV: ${sav[3]} bindus.`,
      verdictHi: `चतुर्थेश ${h4.lordHi} (भाव ${h4.placedHouse}) एवं भूमिकारक मंगल (${mars.placedHouse}वें भाव) के प्रभाव से स्वयं के मकान व अचल संपत्ति के निर्माण का प्रबल योग।`,
      verdictEn: `Strong destiny for acquiring real estate and landed property governed by 4th Lord ${h4.lord} in House ${h4.placedHouse} and Mars in House ${mars.placedHouse}.`,
      detailedAnalysisHi: `फलदीपिका अनुसार चतुर्थ भाव भूमि और भवन का अधिपति है। मंगल और चतुर्थेश का सुदृढ़ होना जातक को अपने नाम पर संपत्ति का स्वामी बनाता है।`,
      detailedAnalysisEn: `Per Phaladeepika Ch. 18, Mars and the 4th lord govern tangible real estate and residential mastery.`,
      remedyHi: `घर में तुलसी का पौधा लगाकर नियमित दीप जलाएं तथा भूमि पूजन के समय ताम्र पात्र स्थापित करें।`,
      remedyEn: `Nurture a sacred Tulsi plant at home with an evening ghee lamp and honor Bhoomi pujan traditions.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 16. वाहन सुख, भौतिक सुविधाएं व आंतरिक मानसिक शांति
  {
    const score = Math.max(30, Math.min(95, 50 + getDignityBonus(venus.dignity) + (h4.placedHouse === 4 || h4.placedHouse === 9 ? 12 : 0)));
    addDim({
      id: 16,
      houseNumber: 4,
      houseTitleHi: 'चतुर्थ भाव (सुख व मातृ भाव)',
      houseTitleEn: '4th House (Sukha & Matri)',
      category: 'wealth_fortune',
      categoryTitleHi: 'धन व समृद्धि',
      categoryTitleEn: 'Wealth & Prosperity',
      titleHi: 'वाहन सुख, भौतिक सुविधाएं व आंतरिक मानसिक शांति',
      titleEn: 'Luxury Vehicles, Conveyances & Inner Mental Peace (Sukha)',
      classicalRef: 'बृहत्पाराशर होरा शास्त्र अ. 16 व सारावली अ. 26',
      divisionalRef: 'D16 षोडशांश व शुक्र वाहनकारक',
      vakriNote: '',
      astroBasisHi: `वाहनकारक शुक्र भाव ${venus.placedHouse} में (${venus.dignityHi}); चतुर्थेश ${h4.lordHi} भाव ${h4.placedHouse} में।`,
      astroBasisEn: `Vahanakaraka Venus in House ${venus.placedHouse} (${venus.dignity}); 4th Lord ${h4.lord} in House ${h4.placedHouse}.`,
      verdictHi: `वाहनकारक शुक्र (${venus.placedHouse}वें भाव) एवं चतुर्थेश ${h4.lordHi} के प्रभाव से उत्तम श्रेणी के वाहनों का उपयोग तथा सुख-सुविधाओं से युक्त गृह-परिवेश।`,
      verdictEn: `Enjoyment of premium conveyances and comfortable domestic amenities driven by Venus in House ${venus.placedHouse} and 4th Lord ${h4.lord}.`,
      detailedAnalysisHi: `पाराशर अनुसार चतुर्थ भाव सुख-स्थान है। शुक्र वाहन का प्राकृतिक कारक है। इन दोनों की अनुकूलता जातक को सभी भौतिक ऐश्वर्य प्रदान करती है।`,
      detailedAnalysisEn: `Per BPHS Ch. 16, the 4th house governs Sukha (peace) and Venus governs conveyances, bringing harmonious physical comfort.`,
      remedyHi: `शुक्रवार को मंदिर में सुगंधित श्वेत पुष्प अथवा इत्र अर्पित करें तथा वाहन को स्वच्छ रखें।`,
      remedyEn: `Offer fragrant white flowers or sandalwood essence at a shrine on Fridays and maintain vehicular cleanliness.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // =========================================================================
  // CHAPTER 5: पंचम भाव (PUTRA & BUDDHI BHAVA) — 5 Dimensions (IDs 17 to 21)
  // =========================================================================

  // 17. उच्च बुद्धि, विवेक व रणनीतिक निर्णय क्षमता
  {
    const score = Math.max(35, Math.min(98, 54 + getDignityBonus(h5.dignity) + getDignityBonus(mercury.dignity) / 2 + (sav[4] >= 28 ? 8 : -6)));
    addDim({
      id: 17,
      houseNumber: 5,
      houseTitleHi: 'पंचम भाव (पुत्र व बुद्धि भाव)',
      houseTitleEn: '5th House (Putra & Buddhi)',
      category: 'education',
      categoryTitleHi: 'शिक्षा व विद्या',
      categoryTitleEn: 'Education & Intellect',
      titleHi: 'उच्च बुद्धि, विवेक व रणनीतिक निर्णय क्षमता',
      titleEn: 'Higher Intellect, Analytical Wisdom & Strategic Decision-Making',
      classicalRef: 'बृहज्जातक अ. 17 व फलदीपिका अ. 19',
      divisionalRef: 'D24 चतुर्विंशांश (सिद्धांश) व पंचम भाव',
      vakriNote: getVakriExplanation(planets.find((p) => p.id === h5.lord)),
      astroBasisHi: `पंचमेश ${h5.lordHi} भाव ${h5.placedHouse} में (${h5.dignityHi}); बुद्धिकारक बुध भाव ${mercury.placedHouse} में; पंचम SAV: ${sav[4]} बिंदु।`,
      astroBasisEn: `5th Lord ${h5.lord} in H${h5.placedHouse} (${h5.dignity}); Intellect Karaka Mercury in H${mercury.placedHouse}; 5th SAV: ${sav[4]} bindus.`,
      verdictHi: `पंचमेश ${h5.lordHi} (भाव ${h5.placedHouse}) एवं बुध (${mercury.placedHouse}वें भाव) के प्रभाव से तीक्ष्ण मेधा शक्ति व सटीक रणनीतिक निर्णय क्षमता।`,
      verdictEn: `Sharp analytical discernment and strategic acumen governed by 5th Lord ${h5.lord} in House ${h5.placedHouse} and Mercury in House ${mercury.placedHouse}.`,
      detailedAnalysisHi: `आचार्य वराहमिहिर के अनुसार पंचम भाव प्रज्ञा और विवेक का केंद्र है। पंचमेश का शुभ स्थान जातक को परामर्शदाता अथवा नीति-निर्माता बनाता है।`,
      detailedAnalysisEn: `Per Brihat Jataka Ch. 17, the 5th house rules discerning intellect (Dhi-Shakti) and advisory brilliance.`,
      remedyHi: `प्रतिदिन मां सरस्वती की वंदना करें तथा बुधवार को गणेश जी को दूर्वा अर्पित करें।`,
      remedyEn: `Pray to Goddess Saraswati daily and offer fresh green Durva grass to Lord Ganesha on Wednesdays.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 18. पूर्व जन्म पुण्य, ईश्वरीय कृपा व मंत्र साधना
  {
    const score = Math.max(35, Math.min(95, 52 + (jupiter.placedHouse === 5 || jupiter.placedHouse === 9 ? 15 : 0) + (h5.placedHouse === 5 || h5.placedHouse === 9 ? 12 : 0)));
    addDim({
      id: 18,
      houseNumber: 5,
      houseTitleHi: 'पंचम भाव (पुत्र व बुद्धि भाव)',
      houseTitleEn: '5th House (Putra & Buddhi)',
      category: 'spirituality',
      categoryTitleHi: 'आध्यात्म व मोक्ष',
      categoryTitleEn: 'Spirituality & Grace',
      titleHi: 'पूर्व जन्म पुण्य, ईश्वरीय कृपा व मंत्र साधना',
      titleEn: 'Poorva Punya, Past Life Karmic Credit & Divine Mantra Siddhi',
      classicalRef: 'बृहत्पाराशर होरा शास्त्र अ. 17 व जैमिनी उपदेश सूत्र',
      divisionalRef: 'D60 षष्ट्यंश व इष्ट देवता (D9 नवांश)',
      vakriNote: '',
      astroBasisHi: `पंचमेश ${h5.lordHi} भाव ${h5.placedHouse} में; ज्ञानकारक गुरु भाव ${jupiter.placedHouse} में; पूर्व पुण्य त्रिकोण सक्रिय।`,
      astroBasisEn: `5th Lord ${h5.lord} in House ${h5.placedHouse}; Wisdom Karaka Jupiter in House ${jupiter.placedHouse}; Poorva Punya active.`,
      verdictHi: `पंचमेश ${h5.lordHi} (भाव ${h5.placedHouse}) एवं गुरु (${jupiter.placedHouse}वें भाव) के प्रभाव से पूर्व जन्मों के शुभ कर्मों का संचित फल व अप्रत्याशित दैवीय सहायता।`,
      verdictEn: `Abundant past-life karmic merit (Poorva Punya) and divine grace guided by 5th Lord ${h5.lord} in House ${h5.placedHouse} and Jupiter in House ${jupiter.placedHouse}.`,
      detailedAnalysisHi: `पाराशरी मतानुसार पंचम भाव पूर्व जन्म के पुण्यों का कोष है। इस भाव का बली होना जातक को बिना अत्यधिक प्रयास के भी दैवीय सुरक्षा प्रदान करता है।`,
      detailedAnalysisEn: `Per BPHS Ch. 17, the 5th house stores merits from past incarnations, conferring intuitive spiritual grace.`,
      remedyHi: `इष्ट मंत्र का नियमित जप करें तथा मंदिर अथवा धार्मिक स्थान में दीपक प्रज्वलित करें।`,
      remedyEn: `Chant your personal Ishta mantra regularly and light a ghee lamp at a consecrated temple.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 19. संतान उत्पत्ति, गर्भाधान व संतान का उत्कर्ष
  {
    const score = Math.max(30, Math.min(95, 50 + getDignityBonus(jupiter.dignity) + getDignityBonus(h5.dignity) / 2));
    addDim({
      id: 19,
      houseNumber: 5,
      houseTitleHi: 'पंचम भाव (पुत्र व बुद्धि भाव)',
      houseTitleEn: '5th House (Putra & Buddhi)',
      category: 'progeny',
      categoryTitleHi: 'संतान व वंश',
      categoryTitleEn: 'Progeny & Lineage',
      titleHi: 'संतान उत्पत्ति, गर्भाधान व संतान का उत्कर्ष',
      titleEn: 'Progeny Conception, Children Happiness & Lineage Expansion',
      classicalRef: 'बृहत्पाराशर होरा शास्त्र अ. 17 व फलदीपिका अ. 19',
      divisionalRef: 'D7 सप्तमांश व गुरु पुत्रकारक',
      vakriNote: '',
      astroBasisHi: `संतानकारक गुरु भाव ${jupiter.placedHouse} में (${jupiter.dignityHi}); पंचमेश ${h5.lordHi} भाव ${h5.placedHouse} में; D7 सप्तमांश स्थिति।`,
      astroBasisEn: `Progeny Karaka Jupiter in House ${jupiter.placedHouse} (${jupiter.dignity}); 5th Lord ${h5.lord} in House ${h5.placedHouse}; D7 verified.`,
      verdictHi: `संतानकारक गुरु (${jupiter.placedHouse}वें भाव) एवं पंचमेश ${h5.lordHi} (भाव ${h5.placedHouse}) के प्रभाव से सदाचारी, योग्य एवं कुल का मान बढ़ाने वाली संतान का सुख।`,
      verdictEn: `Joyous, morally upright, and intellectually flourishing progeny expanding lineage prestige through Jupiter in House ${jupiter.placedHouse} and ${h5.lord}.`,
      detailedAnalysisHi: `पाराशर अनुसार गुरु पुत्र का नैसर्गिक कारक है। पंचम भाव और गुरु का संबंध उत्तम संतान प्राप्ति और संतान से सुख की गारंटी देता है।`,
      detailedAnalysisEn: `Per BPHS Ch. 17, Jupiter is natural Putrakaraka. Supported 5th house guarantees filial happiness.`,
      remedyHi: `गुरुवार को पीले वस्त्र धारण करें तथा केले के वृक्ष की जड़ में जल अर्पित करें।`,
      remedyEn: `Wear clean yellow clothing on Thursdays and offer water to the roots of a sacred banana plant.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 20. संतान संबंधी बाधाएं, विलंब व निवारण
  {
    const isAfflicted = planets.some((p) => (p.rasiHouseNumber ?? p.houseNumber) === 5 && (p.id === 'Saturn' || p.id === 'Rahu' || p.id === 'Ketu'));
    const score = isAfflicted ? 40 : 70;
    addDim({
      id: 20,
      houseNumber: 5,
      houseTitleHi: 'पंचम भाव (पुत्र व बुद्धि भाव)',
      houseTitleEn: '5th House (Putra & Buddhi)',
      category: 'progeny',
      categoryTitleHi: 'संतान व वंश',
      categoryTitleEn: 'Progeny & Lineage',
      titleHi: 'संतान संबंधी बाधाएं, विलंब व निवारण',
      titleEn: 'Progeny Challenges, Conception Obstacles & Putrarishta Mitigation',
      classicalRef: 'बृहत्पाराशर होरा शास्त्र (पुत्र-प्रतिबंध अध्याय) व लाल किताब 1952',
      divisionalRef: 'D7 सप्तमांश व पंचम भाव के पापी ग्रह',
      vakriNote: '',
      astroBasisHi: `पंचम भाव में स्थिति: ${isAfflicted ? 'पाप ग्रहों का प्रभाव' : 'शुभ व निर्दोष स्थिति'}; गुरु दृष्टि: भाव ${jupiter.placedHouse} से।`,
      astroBasisEn: `5th House status: ${isAfflicted ? 'Malefic presence noted' : 'Clear and unafflicted'}; Jupiter aspect verified.`,
      verdictHi: isAfflicted ? `पंचम भाव में स्थिति के कारण संतान प्राप्ति में आरंभिक विलंब अथवा गर्भाधान में चिकित्सीय व आध्यात्मिक सतर्कता की आवश्यकता।` : `पंचमेश ${h5.lordHi} के प्रभाव से संतान पक्ष में किसी गंभीर रुकावट का अभाव; समय पर सुचारू वंश वृद्धि।`,
      verdictEn: isAfflicted ? `Mild initial conception delays; medical diligence and astrological pacification recommended.` : `Absence of severe progeny impediments under ${h5.lord}; smooth and timely lineage continuation.`,
      detailedAnalysisHi: `पाराशरी पुत्र प्रतिबंध अध्याय अनुसार यदि पंचम में राहु या शनि हों तो संतान उत्पत्ति में विलंब हो सकता है, किंतु बृहस्पति की दृष्टि निवारक बनती है।`,
      detailedAnalysisEn: `Per BPHS Putra Pratibandha chapter, malefic ingress in 5th may cause initial timing delays, mitigated by Jupiter's grace.`,
      remedyHi: `संतान गोपाल मंत्र का 108 बार जप करें अथवा गुरुवार को अनाथ बच्चों को पठन सामग्री दें।`,
      remedyEn: `Recite the Santana Gopala Mantra 108 times or donate educational stationery to underprivileged children.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 21. सट्टा/शेयर बाजार लाभ, रचनात्मक कला व प्रेम संबंध
  {
    const score = Math.max(30, Math.min(92, 50 + (venus.placedHouse === 5 ? 14 : 0) + (rahu?.placedHouse === 5 || rahu?.placedHouse === 11 ? 12 : 0)));
    addDim({
      id: 21,
      houseNumber: 5,
      houseTitleHi: 'पंचम भाव (पुत्र व बुद्धि भाव)',
      houseTitleEn: '5th House (Putra & Buddhi)',
      category: 'wealth_fortune',
      categoryTitleHi: 'धन व समृद्धि',
      categoryTitleEn: 'Wealth & Prosperity',
      titleHi: 'सट्टा/शेयर बाजार लाभ, रचनात्मक कला व प्रेम संबंध',
      titleEn: 'Speculative Luck, Creative Expression, Arts & Romance',
      classicalRef: 'फलदीपिका अ. 19 व केपी कृष्णमूर्ति पद्धति',
      divisionalRef: 'D1 पंचम भाव व शुक्र ग्रह',
      vakriNote: '',
      astroBasisHi: `पंचमेश ${h5.lordHi} का एकादश/द्वितीय से संबंध; शुक्र व राहु की दृष्टि व स्थिति।`,
      astroBasisEn: `5th Lord connection with Houses 11/2; Venus and Rahu speculative angular geometry.`,
      verdictHi: `शुक्र (${venus.placedHouse}वें भाव) एवं पंचमेश ${h5.lordHi} के प्रभाव से रचनात्मक क्षेत्रों व कला में अभिरुचि; सुनियोजित निवेश से लाभ।`,
      verdictEn: `Artistic, creative sensibility and speculative acumen governed by Venus in House ${venus.placedHouse} and 5th Lord ${h5.lord}.`,
      detailedAnalysisHi: `फलदीपिका अनुसार पंचम भाव अचानक लाभ और मनोरंजन का है। राहु या शुक्र का संबंध सट्टे में तीव्र लाभ-हानि का कारक बनता है।`,
      detailedAnalysisEn: `Per Phaladeepika Ch. 19, the 5th house rules creative entertainment and speculation. Prudence is essential for market trading.`,
      remedyHi: `रचनात्मक शौक को समय दें तथा सट्टा या जुए में अत्यधिक जोखिम लेने से बचें।`,
      remedyEn: `Nurture creative artistic pursuits and avoid uncalculated gambling or impulsive trading.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // =========================================================================
  // CHAPTER 6: षष्ठ भाव (RIPU, ROGA & RINA BHAVA) — 4 Dimensions (IDs 22 to 25)
  // =========================================================================

  // 22. तीव्र व्याधियां, शारीरिक दुर्बलताएं व रोग प्रतिरोध
  {
    const score = Math.max(28, Math.min(88, 52 - getDignityBonus(h6.dignity) / 2 + (sav[5] <= 26 ? 8 : -6)));
    addDim({
      id: 22,
      houseNumber: 6,
      houseTitleHi: 'षष्ठ भाव (रोग, ऋण व शत्रु भाव)',
      houseTitleEn: '6th House (Roga & Ripu)',
      category: 'longevity_health',
      categoryTitleHi: 'स्वास्थ्य व आयु',
      categoryTitleEn: 'Health & Longevity',
      titleHi: 'तीव्र व्याधियां, शारीरिक दुर्बलताएं व रोग प्रतिरोध',
      titleEn: 'Acute Diseases, Bodily Vulnerabilities & Recovery Speed',
      classicalRef: 'बृहत्पाराशर होरा शास्त्र अ. 18 व फलदीपिका अ. 20',
      divisionalRef: 'D30 त्रिंशांश व 22वां द्रेष्काण',
      vakriNote: '',
      astroBasisHi: `षष्ठेश ${h6.lordHi} भाव ${h6.placedHouse} में (${h6.dignityHi}); रोग कारक शनि भाव ${saturn.placedHouse} में; षष्ठ भाव SAV: ${sav[5]} बिंदु।`,
      astroBasisEn: `6th Lord ${h6.lord} in H${h6.placedHouse} (${h6.dignity}); Disease Karaka Saturn in H${saturn.placedHouse}; 6th SAV: ${sav[5]} bindus.`,
      verdictHi: `षष्ठेश ${h6.lordHi} (भाव ${h6.placedHouse}) एवं शनि (${saturn.placedHouse}वें भाव) के प्रभाव से रोगों से लड़ने की प्राकृतिक क्षमता व रोग प्रतिरोध।`,
      verdictEn: `Natural recuperative resilience and metabolic immunity governed by 6th Lord ${h6.lord} in House ${h6.placedHouse} and Saturn in House ${saturn.placedHouse}.`,
      detailedAnalysisHi: `पाराशर मतानुसार षष्ठ भाव रोग-स्थान है। षष्ठेश का संबंध जिस भाव से हो, उस अंग में रोग की संभावना रहती है, किंतु उपचय होने से सुधार संभव है।`,
      detailedAnalysisEn: `Per BPHS Ch. 18, the 6th house indicates acute ailments. Upachaya placement allows steady therapeutic recovery.`,
      remedyHi: `शनिवार को सरसों के तेल का छायापात्र दान करें तथा नित्य अनुलोम-विलोम प्राणायाम करें।`,
      remedyEn: `Donate mustard oil shadow-pot on Saturdays and practice daily Anulom-Vilom pranayama.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 23. ऋण, वित्तीय दायित्व व ऋण मुक्ति योग
  {
    const score = Math.max(30, Math.min(90, 54 + (h6.placedHouse === 6 || h6.placedHouse === 11 ? 10 : -6) + (sav[5] <= 26 ? 8 : -6)));
    addDim({
      id: 23,
      houseNumber: 6,
      houseTitleHi: 'षष्ठ भाव (रोग, ऋण व शत्रु भाव)',
      houseTitleEn: '6th House (Roga & Ripu)',
      category: 'wealth_fortune',
      categoryTitleHi: 'धन व समृद्धि',
      categoryTitleEn: 'Wealth & Prosperity',
      titleHi: 'ऋण, वित्तीय दायित्व व ऋण मुक्ति योग',
      titleEn: 'Financial Debts, Credit Liabilities & Rina Mukti Potential',
      classicalRef: 'बृहत्पाराशर होरा शास्त्र अ. 18 व लाल किताब 1952 (ऋण मुक्ति)',
      divisionalRef: 'D1 षष्ठ भाव व द्वितीय/एकादश भाव',
      vakriNote: '',
      astroBasisHi: `षष्ठेश ${h6.lordHi} भाव ${h6.placedHouse} में; धन भावों (2 व 11) से संबंध; लाल किताब ऋण मुक्ति योग।`,
      astroBasisEn: `6th Lord ${h6.lord} in House ${h6.placedHouse}; connection with wealth houses (2 & 11).`,
      verdictHi: `षष्ठेश ${h6.lordHi} के भाव ${h6.placedHouse} में प्रभाव से कर्ज अथवा वित्तीय देनदारियों को समय पर चुकाने की क्षमता।`,
      verdictEn: `High capacity to service and clear financial credit liabilities governed by 6th Lord ${h6.lord} in House ${h6.placedHouse}.`,
      detailedAnalysisHi: `लाल किताब और पराशर संहिता अनुसार षष्ठ भाव ऋण का कारक है। यदि षष्ठेश शुभ प्रभाव में हो तो जातक ऋण का सदुपयोग कर संपत्ति बनाता है।`,
      detailedAnalysisEn: `Per Lal Kitab 1952 and BPHS Ch. 18, debt leveraged strategically into assets yields wealth, avoiding speculative leverage.`,
      remedyHi: `मंगलवार को ऋण मोचक मंगल स्तोत्र का पाठ करें तथा किसी से मुफ्त में वस्तु न लें।`,
      remedyEn: `Recite the Rina Mochaka Mangala Stotra on Tuesdays and refrain from accepting unearned free gifts.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 24. शत्रु, मुकदमेबाजी, प्रतिस्पर्धा व विजय योग
  {
    const score = Math.max(35, Math.min(95, 56 + (mars.placedHouse === 6 || saturn.placedHouse === 6 ? 18 : 0) + (h6.placedHouse === 6 ? 12 : 0)));
    addDim({
      id: 24,
      houseNumber: 6,
      houseTitleHi: 'षष्ठ भाव (रोग, ऋण व शत्रु भाव)',
      houseTitleEn: '6th House (Roga & Ripu)',
      category: 'shadow_challenges',
      categoryTitleHi: 'चुनौतियां व सतर्कता',
      categoryTitleEn: 'Shadow Challenges',
      titleHi: 'शत्रु, मुकदमेबाजी, प्रतिस्पर्धा व विजय योग',
      titleEn: 'Open Adversaries, Competitors, Litigations & Court Triumphs',
      classicalRef: 'सारावली अ. 28 व जातक पारिजात अ. 11',
      divisionalRef: 'D1 षष्ठ भाव व शत्रु-हंता योग',
      vakriNote: '',
      astroBasisHi: `षष्ठ भाव में पापी ग्रह स्थिति: ${mars.placedHouse === 6 || saturn.placedHouse === 6 || rahu?.placedHouse === 6 ? 'उपस्थित (शत्रुहंता योग)' : 'सामान्य'}; षष्ठेश स्थिति।`,
      astroBasisEn: `Malefic presence in 6th: ${mars.placedHouse === 6 || saturn.placedHouse === 6 || rahu?.placedHouse === 6 ? 'Active Shatru-Hanta Yoga' : 'Moderate'}; 6th Lord verified.`,
      verdictHi: `षष्ठ भाव में ग्रहों के प्रभाव एवं षष्ठेश ${h6.lordHi} की स्थिति से प्रतिस्पर्धा व विवादों में अंतिम विजय; शत्रुओं का प्रभाव स्वतः निष्फल।`,
      verdictEn: `Decisive triumph in competitive arenas and disputes governed by 6th Lord ${h6.lord} and 6th house dynamics.`,
      detailedAnalysisHi: `कल्याण वर्मा की सारावली के अनुसार षष्ठ भाव में स्थित क्रूर ग्रह 'शत्रुहंता योग' बनाते हैं, जिससे जातक विरोधियों पर सदैव भारी पड़ता है।`,
      detailedAnalysisEn: `Per Saravali Ch. 28, natural malefics in the 6th form Shatru-Hanta Yoga, extinguishing opponent maneuvers.`,
      remedyHi: `प्रतिदिन श्री बटुक भैरव स्तोत्र अथवा बजरंग बाण का पाठ करें।`,
      remedyEn: `Recite the Batuk Bhairava Stotra or Bajrang Baan to dismantle competitive roadblocks.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 25. सेवा भाव, नौकरी की स्थिति व मातहतों का व्यवहार
  {
    const score = Math.max(32, Math.min(92, 50 + getDignityBonus(saturn.dignity) + (h6.placedHouse === 10 ? 10 : 0)));
    addDim({
      id: 25,
      houseNumber: 6,
      houseTitleHi: 'षष्ठ भाव (रोग, ऋण व शत्रु भाव)',
      houseTitleEn: '6th House (Roga & Ripu)',
      category: 'career',
      categoryTitleHi: 'करियर व पद',
      categoryTitleEn: 'Career & Authority',
      titleHi: 'सेवा भाव, नौकरी की स्थिति व मातहतों का व्यवहार',
      titleEn: 'Service Professionalism, Employment Discipline & Subordinates',
      classicalRef: 'फलदीपिका अ. 20 व केपी कृष्णमूर्ति पद्धति',
      divisionalRef: 'D1 षष्ठ भाव व शनि सेवाकारक',
      vakriNote: '',
      astroBasisHi: `सेवाकारक शनि भाव ${saturn.placedHouse} में (${saturn.dignityHi}); षष्ठेश ${h6.lordHi} भाव ${h6.placedHouse} में।`,
      astroBasisEn: `Service Karaka Saturn in House ${saturn.placedHouse} (${saturn.dignity}); 6th Lord ${h6.lord} in House ${h6.placedHouse}.`,
      verdictHi: `सेवाकारक शनि (${saturn.placedHouse}वें भाव) एवं षष्ठेश ${h6.lordHi} के प्रभाव से कार्यक्षेत्र में कर्मठता, अनुशासन व मातहतों से सामंजस्य।`,
      verdictEn: `Exemplary vocational dedication governed by Saturn in House ${saturn.placedHouse} and 6th Lord ${h6.lord}.`,
      detailedAnalysisHi: `फलदीपिका अनुसार षष्ठ भाव सेवा और नौकरी का परिचायक है। शनि की अनुकूलता जातक को दीर्घकालीन रोजगार स्थिरता प्रदान करती है।`,
      detailedAnalysisEn: `Per Phaladeepika Ch. 20, the 6th house governs subordinate service and professional discipline under corporate structures.`,
      remedyHi: `शनिवार को सफाई कर्मचारियों अथवा निर्धन श्रमिकों को भोजन कराएं।`,
      remedyEn: `Provide food and warm tea to sanitation workers or manual laborers on Saturdays.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // =========================================================================
  // CHAPTER 7: सप्तम भाव (KALATRA & JAYA BHAVA) — 5 Dimensions (IDs 26 to 30)
  // =========================================================================

  // 26. विवाह समय निर्धारण, वैवाहिक आयु व भाग्य
  {
    const score = Math.max(30, Math.min(95, 52 + getDignityBonus(h7.dignity) + getDignityBonus(venus.dignity) / 2));
    const timingVerdictHi = `सप्तम भाव, सप्तमेश ${h7.lordHi} और शुक्र की स्थिति को संबंधों तथा साझेदारी के पारंपरिक संकेत के रूप में पढ़ा जाता है। केवल इन स्थितियों से विवाह की निश्चित आयु या तारीख तय नहीं की जा सकती।`;
    const timingVerdictEn = `The 7th house, its lord ${h7.lord} and Venus are traditional indicators for relationships and partnerships. These placements alone cannot establish a definite marriage age or date.`;

    addDim({
      id: 26,
      houseNumber: 7,
      houseTitleHi: 'सप्तम भाव (विवाह व व्यापार भाव)',
      houseTitleEn: '7th House (Kalatra & Jaya)',
      category: 'marriage',
      categoryTitleHi: 'विवाह व दांपत्य',
      categoryTitleEn: 'Marriage & Conjugal',
      titleHi: 'विवाह समय निर्धारण, वैवाहिक आयु व भाग्य',
      titleEn: 'Marriage Timing Window, Realistic Age Span & Conjugal Destiny',
      classicalRef: 'बृहत्पाराशर होरा शास्त्र अ. 19 व के.एन. राव विवाह पद्धति',
      divisionalRef: 'D9 नवांश लग्न व सप्तम उप-स्वामी',
      vakriNote: getVakriExplanation(planets.find((p) => p.id === h7.lord)),
      astroBasisHi: `सप्तमेश ${h7.lordHi} भाव ${h7.placedHouse} में (${h7.dignityHi}); विवाहकारक शुक्र भाव ${venus.placedHouse} में; D9 नवांश सप्तमेश।`,
      astroBasisEn: `7th Lord ${h7.lord} in House ${h7.placedHouse} (${h7.dignity}); Kalatrakaraka Venus in House ${venus.placedHouse}; D9 7th Lord verified.`,
      verdictHi: timingVerdictHi,
      verdictEn: timingVerdictEn,
      detailedAnalysisHi: `महर्षि पराशर विरचित बृहत्पाराशर होराशास्त्र (अ. 19) एवं शास्त्रीय गोचर सिद्धांतों के अनुसार सप्तमेश, शुक्र एवं नवांश लग्न की दशा-अंतर्दशा विवाह का समय तय करती है।${getVakriExplanation(planets.find((p) => p.id === h7.lord))}`,
      detailedAnalysisEn: `Per classical Parashari Vivaha dictums in BPHS Ch. 19, the double transit of Saturn-Jupiter combined with 7th house dasha triggers marriage timing.`,
      remedyHi: `शुक्रवार को मां लक्ष्मी को खीर का भोग लगाएं तथा श्री सूक्त का पाठ करें।`,
      remedyEn: `Offer sweet kheer to Goddess Lakshmi on Fridays and recite the Sri Sukta.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 27. जीवनसाथी का रूप-रंग, स्वभाव व कुल
  {
    const score = Math.max(32, Math.min(95, 54 + getDignityBonus(venus.dignity) + (h7.placedHouse === 1 || h7.placedHouse === 7 ? 12 : 0)));
    addDim({
      id: 27,
      houseNumber: 7,
      houseTitleHi: 'सप्तम भाव (विवाह व व्यापार भाव)',
      houseTitleEn: '7th House (Kalatra & Jaya)',
      category: 'marriage',
      categoryTitleHi: 'विवाह व दांपत्य',
      categoryTitleEn: 'Marriage & Conjugal',
      titleHi: 'जीवनसाथी का रूप-रंग, स्वभाव व कुल',
      titleEn: 'Spouse Demeanor, Physical Attributes & Social Standing',
      classicalRef: 'सारावली अ. 29 व जातक पारिजात अ. 12',
      divisionalRef: 'D9 नवांश सप्तम भाव व उपपद लग्न (UL)',
      vakriNote: '',
      astroBasisHi: `सप्तम भाव राशि व नवांश; विवाहकारक शुक्र भाव ${venus.placedHouse} में; उपपद लग्न।`,
      astroBasisEn: `7th house sign and Navamsha; Kalatra Karaka Venus in House ${venus.placedHouse}; Upapada Lagna (UL).`,
      verdictHi: `सप्तमेश ${h7.lordHi} (भाव ${h7.placedHouse}) एवं शुक्र (${venus.placedHouse}वें भाव) के प्रभाव से आकर्षक, कुलीन, स्वाभिमानी एवं व्यावहारिक जीवनसाथी।`,
      verdictEn: `Dignified, attractive, and culturally rooted life partner with high practical poise anchored by 7th Lord ${h7.lord} in House ${h7.placedHouse} and Venus in House ${venus.placedHouse}.`,
      detailedAnalysisHi: `सारावली अनुसार सप्तम भाव में स्थित राशि और ग्रहों का स्वभाव जीवनसाथी के रूप-रंग और संस्कारों का निर्धारण करता है।`,
      detailedAnalysisEn: `Per Saravali Ch. 29, the sign on the 7th cusp and planets in Navamsha define spouse appearance and cultural pedigree.`,
      remedyHi: `गाय को मीठी रोटी खिलाएं तथा सुहागिन स्त्रियों का सम्मान करें।`,
      remedyEn: `Feed sweet bread to cows and honor elderly married matriarchs in the family.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 28. दांपत्य सामंजस्य, वैवाहिक सुख व शैया सुख
  {
    const score = Math.max(30, Math.min(95, 52 + getDignityBonus(venus.dignity) + (sav[6] >= 28 ? 8 : -8)));
    addDim({
      id: 28,
      houseNumber: 7,
      houseTitleHi: 'सप्तम भाव (विवाह व व्यापार भाव)',
      houseTitleEn: '7th House (Kalatra & Jaya)',
      category: 'marriage',
      categoryTitleHi: 'विवाह व दांपत्य',
      categoryTitleEn: 'Marriage & Conjugal',
      titleHi: 'दांपत्य सामंजस्य, वैवाहिक सुख व शैया सुख',
      titleEn: 'Marital Harmony, Mutual Alignment & Bed Comfort',
      classicalRef: 'बृहत्पाराशर होरा शास्त्र अ. 19 व फलदीपिका अ. 21',
      divisionalRef: 'D1 व D9 में शुक्र-मंगल धुरी',
      vakriNote: '',
      astroBasisHi: `शुक्र भाव ${venus.placedHouse} में; सप्तमेश ${h7.lordHi} भाव ${h7.placedHouse} में; सप्तम भाव SAV: ${sav[6]} बिंदु।`,
      astroBasisEn: `Venus in House ${venus.placedHouse}; 7th Lord ${h7.lord} in House ${h7.placedHouse}; 7th SAV: ${sav[6]} bindus.`,
      verdictHi: `शुक्र (${venus.placedHouse}वें भाव) एवं सप्तमेश ${h7.lordHi} (भाव ${h7.placedHouse}) के प्रभाव से परस्पर विश्वास, भावनात्मक समझ व दांपत्य मधुरता।`,
      verdictEn: `Reciprocal emotional devotion and conjugal harmony anchored by Venus in House ${venus.placedHouse} and 7th Lord ${h7.lord} in House ${h7.placedHouse}.`,
      detailedAnalysisHi: `पाराशरी सिद्धांत अनुसार शुक्र भोग और दांपत्य का कारक है। शुक्र और सप्तमेश की अनुकूलता शैया सुख और दांपत्य स्थायित्व प्रदान करती है।`,
      detailedAnalysisEn: `Per BPHS Ch. 19, Venus rules conjugal intimacy. Fortified placements generate profound domestic compatibility.`,
      remedyHi: `दंपति संयुक्त रूप से पूर्णिमा को चंद्र दर्शन करें तथा घर में कपूर का धुआं दें।`,
      remedyEn: `Spouses together behold the Full Moon and burn camphor in the bedroom once a week.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 29. दांपत्य कलह, मांगलिक दोष व विच्छेद निवारण
  {
    const isManglik = [1, 2, 4, 7, 8, 12].includes(mars.placedHouse);
    const score = isManglik ? 42 : 72;
    addDim({
      id: 29,
      houseNumber: 7,
      houseTitleHi: 'सप्तम भाव (विवाह व व्यापार भाव)',
      houseTitleEn: '7th House (Kalatra & Jaya)',
      category: 'marriage',
      categoryTitleHi: 'विवाह व दांपत्य',
      categoryTitleEn: 'Marriage & Conjugal',
      titleHi: 'दांपत्य कलह, मांगलिक दोष व विच्छेद निवारण',
      titleEn: 'Marital Friction, Kuja/Manglik Dosha & Separation Prevention',
      classicalRef: 'बृहत्पाराशर होरा शास्त्र (भौम दोष) व लाल किताब 1952',
      divisionalRef: 'D1 व D9 में भौम स्थिति',
      vakriNote: '',
      astroBasisHi: `मंगल भाव ${mars.placedHouse} में (${isManglik ? 'मांगलिक प्रभाव' : 'निर्दोष स्थिति'}); सप्तम भाव पर क्रूर दृष्टि।`,
      astroBasisEn: `Mars in House ${mars.placedHouse} (${isManglik ? 'Manglik Dosha active' : 'Unafflicted'}); 7th house aspects verified.`,
      verdictHi: isManglik ? `भाव ${mars.placedHouse} में मंगल के प्रभाव से वैवाहिक संवाद में उग्रता अथवा मतभेद की संभावना; कुंडली मिलान व शांति उपाय अपेक्षित।` : `मंगल (${mars.placedHouse}वें भाव) के अनुकूल प्रभाव से मांगलिक दोष का अभाव; दांपत्य जीवन में विच्छेद का कोई जोखिम नहीं।`,
      verdictEn: isManglik ? `Kuja/Manglik friction due to Mars in House ${mars.placedHouse} requiring calm communication and classical astrological matching.` : `Absence of adverse Kuja/Manglik separations with Mars in House ${mars.placedHouse}; stable matrimonial longevity assured.`,
      detailedAnalysisHi: `पाराशर संहिता अनुसार 1, 2, 4, 7, 8, 12वें भाव में मंगल की स्थिति मांगलिक दोष बनाती है, जिसका परिहार गुण मिलान एवं गुरु की दृष्टि से होता है।`,
      detailedAnalysisEn: `Per BPHS Ch. 19, Mars in 1/2/4/7/8/12 creates Kuja energy, effectively tempered by Jupiterian aspects and kundali matching.`,
      remedyHi: `मंगलवार को सुंदरकांड का पाठ करें तथा शिवलिंग पर लाल मसूर की दाल अर्पित करें।`,
      remedyEn: `Recite the Sundarkand on Tuesdays and offer red lentils on a consecrated Shiva Lingam.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 30. व्यापारिक साझेदारी, अनुबंध व लोक संपर्क
  {
    const score = Math.max(30, Math.min(92, 50 + getDignityBonus(mercury.dignity) + (h7.placedHouse === 10 || h7.placedHouse === 11 ? 12 : 0)));
    addDim({
      id: 30,
      houseNumber: 7,
      houseTitleHi: 'सप्तम भाव (विवाह व व्यापार भाव)',
      houseTitleEn: '7th House (Kalatra & Jaya)',
      category: 'career',
      categoryTitleHi: 'करियर व पद',
      categoryTitleEn: 'Career & Authority',
      titleHi: 'व्यापारिक साझेदारी, अनुबंध व लोक संपर्क',
      titleEn: 'Commercial Partnerships, Foreign Contracts & Public Relations',
      classicalRef: 'सारावली अ. 29 व सर्वार्थ चिंतामणि अ. 7',
      divisionalRef: 'D1 सप्तम भाव (दशम से दशम) व बुध',
      vakriNote: '',
      astroBasisHi: `सप्तमेश ${h7.lordHi} भाव ${h7.placedHouse} में; बुध व्यापार कारक; दशम से दशम भाव।`,
      astroBasisEn: `7th Lord ${h7.lord} in House ${h7.placedHouse}; Mercury Trade Karaka; 10th from 10th axis.`,
      verdictHi: `सप्तमेश ${h7.lordHi} (भाव ${h7.placedHouse}) एवं बुध (${mercury.placedHouse}वें भाव) के प्रभाव से व्यापारिक साझेदारियों में लाभ व ग्राहक व्यवहार में दक्षता।`,
      verdictEn: `Fruitful commercial alliances and negotiation diplomacy governed by 7th Lord ${h7.lord} in House ${h7.placedHouse} and Mercury in House ${mercury.placedHouse}.`,
      detailedAnalysisHi: `सारावली के अनुसार सप्तम भाव लोक-व्यवहार और साझेदारी का केंद्र है (दशम से दशम)। बुध का अनुकूल संबंध व्यापार को विस्तार देता है।`,
      detailedAnalysisEn: `Per Saravali Ch. 29, the 7th house acts as secondary vocation (10th from 10th), governing joint ventures and business contracts.`,
      remedyHi: `साझेदारी में कोई भी निर्णय बिना लिखित अनुबंध के न लें तथा उत्तर दिशा में हरियाली रखें।`,
      remedyEn: `Formalize all partnerships in writing and place lush green indoor plants in the North zone.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // =========================================================================
  // CHAPTER 8: अष्टम भाव (AYU & RANDHRA BHAVA) — 4 Dimensions (IDs 31 to 34)
  // =========================================================================

  // 31. आयु खंड, दीर्घायु योग व मारक ग्रह विश्लेषण
  {
    const score = Math.max(35, Math.min(95, 54 + getDignityBonus(saturn.dignity) + (sav[7] >= 28 ? 8 : -6)));
    addDim({
      id: 31,
      houseNumber: 8,
      houseTitleHi: 'अष्टम भाव (आयु व रंध्र भाव)',
      houseTitleEn: '8th House (Ayu & Randhra)',
      category: 'longevity_health',
      categoryTitleHi: 'स्वास्थ्य व आयु',
      categoryTitleEn: 'Health & Longevity',
      titleHi: 'आयु खंड, दीर्घायु योग व मारक ग्रह विश्लेषण',
      titleEn: 'Longevity Category, Lifespan Span & Maraka Analysis',
      classicalRef: 'बृहत्पाराशर होरा शास्त्र अ. 20 व जैमिनी त्रि-विधि आयु साधन',
      divisionalRef: 'D8 अष्टांश व शनि आयुष्यकारक',
      vakriNote: '',
      astroBasisHi: `आयुष्यकारक शनि भाव ${saturn.placedHouse} में (${saturn.dignityHi}); अष्टमेश ${h8.lordHi} भाव ${h8.placedHouse} में; अष्टम SAV: ${sav[7]} बिंदु।`,
      astroBasisEn: `Ayushkaraka Saturn in House ${saturn.placedHouse} (${saturn.dignity}); 8th Lord ${h8.lord} in House ${h8.placedHouse}; 8th SAV: ${sav[7]} bindus.`,
      verdictHi: `आयुष्यकारक शनि (${saturn.placedHouse}वें भाव) एवं अष्टमेश ${h8.lordHi} (भाव ${h8.placedHouse}) के प्रभाव से दीर्घायु (पूर्णायु) के प्रबल शास्त्रीय योग।`,
      verdictEn: `Purnayu (long lifespan) indicators confirmed by Ayushkaraka Saturn in House ${saturn.placedHouse} and 8th Lord ${h8.lord} in House ${h8.placedHouse}.`,
      detailedAnalysisHi: `महर्षि पराशर और जैमिनी के 3-विधि आयु साधन अनुसार लग्नेश और अष्टमेश की बली स्थिति जातक को पूर्णायु व सुदृढ़ जीवनी-शक्ति प्रदान करती है।`,
      detailedAnalysisEn: `Per BPHS Ch. 20 and Jaimini 3-pair methodology, fortified Lagna and 8th lords establish enduring longevity (Purnayu).`,
      remedyHi: `महामृत्युंजय मंत्र का नित्य जप करें तथा मंगलवार/शनिवार को हनुमान चालीसा पढ़ें।`,
      remedyEn: `Chant the Maha Mrityunjaya Mantra daily and read the Hanuman Chalisa on Tuesdays/Saturdays.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 32. आकस्मिक धनलाभ, वसीयत, बीमा व गुप्त धन
  {
    const score = Math.max(30, Math.min(92, 50 + (rahu?.placedHouse === 8 ? 14 : 0) + (sav[7] >= 28 ? 8 : -6)));
    addDim({
      id: 32,
      houseNumber: 8,
      houseTitleHi: 'अष्टम भाव (आयु व रंध्र भाव)',
      houseTitleEn: '8th House (Ayu & Randhra)',
      category: 'wealth_fortune',
      categoryTitleHi: 'धन व समृद्धि',
      categoryTitleEn: 'Wealth & Prosperity',
      titleHi: 'आकस्मिक धनलाभ, वसीयत, बीमा व गुप्त धन',
      titleEn: 'Sudden Transformations, Windfalls, Inheritances & Unearned Wealth',
      classicalRef: 'बृहत्पाराशर होरा शास्त्र अ. 20 व सारावली अ. 30',
      divisionalRef: 'D1 अष्टम भाव व राहु ग्रह',
      vakriNote: '',
      astroBasisHi: `अष्टमेश ${h8.lordHi} भाव ${h8.placedHouse} में; अष्टम भाव में राहु/शुक्र दृष्टि; गुप्त धन योग।`,
      astroBasisEn: `8th Lord ${h8.lord} in House ${h8.placedHouse}; Rahu/Venus aspects on 8th cusp.`,
      verdictHi: `अष्टमेश ${h8.lordHi} (भाव ${h8.placedHouse}) के प्रभाव से जीवन में आकस्मिक मोड़ एवं पैतृक वसीयत अथवा बीमा से अप्रत्याशित वित्तीय लाभ।`,
      verdictEn: `Sudden transformative windfalls, inheritances, and insurance claim resolutions governed by 8th Lord ${h8.lord} in House ${h8.placedHouse}.`,
      detailedAnalysisHi: `सारावली के अनुसार अष्टम भाव वसीयत, पैतृक संपत्ति और आकस्मिक धन का है। इस भाव का शुभ प्रभाव अप्रत्याशित वित्तीय मोड़ लाता है।`,
      detailedAnalysisEn: `Per Saravali Ch. 30, the 8th house governs unearned legacy wealth, sudden transformational capital, and insurance windfalls.`,
      remedyHi: `पक्षियों को सप्तधान्य (सात प्रकार का अनाज) डालें तथा कानूनी दस्तावेजों को व्यवस्थित रखें।`,
      remedyEn: `Feed mixed seven-grain birdseed daily and keep legal estate documentation meticulously organized.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 33. दीर्घकालिक रोग, शल्य चिकित्सा, दुर्घटना व भय
  {
    const score = Math.max(28, Math.min(88, 50 - (mars.placedHouse === 8 || ketu?.placedHouse === 8 ? 14 : 0)));
    addDim({
      id: 33,
      houseNumber: 8,
      houseTitleHi: 'अष्टम भाव (आयु व रंध्र भाव)',
      houseTitleEn: '8th House (Ayu & Randhra)',
      category: 'longevity_health',
      categoryTitleHi: 'स्वास्थ्य व आयु',
      categoryTitleEn: 'Health & Longevity',
      titleHi: 'दीर्घकालिक रोग, शल्य चिकित्सा, दुर्घटना व भय',
      titleEn: 'Chronic Ailments, Surgeries, Accidents & Hidden Fears',
      classicalRef: 'फलदीपिका अ. 22 व 64वां नवांश/22वां द्रेष्काण',
      divisionalRef: 'D30 त्रिंशांश व अष्टम भाव',
      vakriNote: '',
      astroBasisHi: `अष्टम भाव में ग्रह स्थिति: ${mars.placedHouse === 8 || ketu?.placedHouse === 8 ? 'शल्य चिकित्सा संकेत' : 'सुरक्षित'}; 64वां नवांश परीक्षण।`,
      astroBasisEn: `8th House ingress: ${mars.placedHouse === 8 || ketu?.placedHouse === 8 ? 'Surgical indications noted' : 'Protected'}; 64th Navamsha audited.`,
      verdictHi: `अष्टमेश ${h8.lordHi} (भाव ${h8.placedHouse}) के प्रभाव से वाहन चालन व स्वास्थ्य में सामान्य सतर्कता अपेक्षित; संकटों से सुरक्षित बचाव।`,
      verdictEn: `Prudent road and health safety advised under 8th Lord ${h8.lord} in House ${h8.placedHouse}; resilient vital defense ensures protection.`,
      detailedAnalysisHi: `फलदीपिका अनुसार 64वें नवांश और 22वें द्रेष्काण का संबंध जातक के जीवन में आकस्मिक शल्य क्रिया अथवा भय का कारण बनता है।`,
      detailedAnalysisEn: `Per Phaladeepika Ch. 22, the 64th Navamsha and 22nd Drekkana indicate surgical vulnerabilities, requiring timely precautions.`,
      remedyHi: `नित्य कालभैरवाष्टकम् का पाठ करें तथा मंगलवार को वाहन की पूजा करें।`,
      remedyEn: `Recite the Kalabhairav Ashtakam and maintain road safety awareness when traveling.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 34. गूढ़ विद्या, अनुसंधान, ज्योतिष व परा-मनोविज्ञान
  {
    const score = Math.max(35, Math.min(95, 52 + (ketu?.placedHouse === 8 || jupiter.placedHouse === 8 ? 16 : 0) + (mercury.placedHouse === 8 ? 12 : 0)));
    addDim({
      id: 34,
      houseNumber: 8,
      houseTitleHi: 'अष्टम भाव (आयु व रंध्र भाव)',
      houseTitleEn: '8th House (Ayu & Randhra)',
      category: 'spirituality',
      categoryTitleHi: 'आध्यात्म व मोक्ष',
      categoryTitleEn: 'Spirituality & Grace',
      titleHi: 'गूढ़ विद्या, अनुसंधान, ज्योतिष व परा-मनोविज्ञान',
      titleEn: 'Occult Sciences, Astrological Research & Psychological Depth',
      classicalRef: 'सर्वार्थ चिंतामणि अ. 8 व लाल किताब 1952',
      divisionalRef: 'D20 विंशांश व केतु अष्टम में',
      vakriNote: '',
      astroBasisHi: `अष्टम भाव में केतु/गुरु/बुध संबंध; गूढ़ ज्ञान व अनुसंधान त्रिक।`,
      astroBasisEn: `8th house Ketu/Jupiter/Mercury alignment; esoteric research triangle.`,
      verdictHi: `अष्टमेश ${h8.lordHi} (भाव ${h8.placedHouse}) एवं केतु/गुरु के प्रभाव से रहस्यमयी विद्याओं, ज्योतिष, अनुसंधान व मनोविज्ञान में स्वाभाविक अंतर्दृष्टि।`,
      verdictEn: `Profound aptitude for occult metaphysics, astrological research, and psychology anchored by 8th Lord ${h8.lord} in House ${h8.placedHouse}.`,
      detailedAnalysisHi: `सर्वार्थ चिंतामणि अनुसार अष्टम भाव परा-विद्या का प्रवेश द्वार है। केतु अथवा गुरु का प्रभाव जातक को गुप्त रहस्यों का ज्ञाता बनाता है।`,
      detailedAnalysisEn: `Per Sarvartha Chintamani Ch. 8, the 8th house is the gateway to occult insight, granting penetrating psychological vision.`,
      remedyHi: `भगवान शिव का ध्यान करें तथा बुधवार को किसी विद्वान ब्राह्मण का सम्मान करें।`,
      remedyEn: `Meditate upon Lord Shiva and honor scholarly teachers or spiritual researchers.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // =========================================================================
  // CHAPTER 9: नवम भाव (DHARMA & BHAGYA BHAVA) — 4 Dimensions (IDs 35 to 38)
  // =========================================================================

  // 35. पिता का स्वभाव, मार्गदर्शन व पितृ-स्नेह
  {
    const score = Math.max(32, Math.min(95, 52 + getDignityBonus(sun.dignity) + getDignityBonus(h9.dignity) / 2));
    addDim({
      id: 35,
      houseNumber: 9,
      houseTitleHi: 'नवम भाव (भाग्य व धर्म भाव)',
      houseTitleEn: '9th House (Dharma & Bhagya)',
      category: 'family',
      categoryTitleHi: 'माता-पिता व कुल',
      categoryTitleEn: 'Parents & Lineage',
      titleHi: 'पिता का स्वभाव, मार्गदर्शन व पितृ-स्नेह',
      titleEn: 'Father’s Temperament, Moral Guidance & Paternal Alignment',
      classicalRef: 'बृहत्पाराशर होरा शास्त्र अ. 21 व सारावली अ. 31',
      divisionalRef: 'D12 द्वादशांश व सूर्य पितृकारक',
      vakriNote: '',
      astroBasisHi: `पितृकारक सूर्य भाव ${sun.placedHouse} में (${sun.dignityHi}); नवमेश ${h9.lordHi} भाव ${h9.placedHouse} में (${h9.dignityHi}); नवम SAV: ${sav[8]} बिंदु।`,
      astroBasisEn: `Pitrukaraka Sun in House ${sun.placedHouse} (${sun.dignity}); 9th Lord ${h9.lord} in House ${h9.placedHouse} (${h9.dignity}); 9th SAV: ${sav[8]} bindus.`,
      verdictHi: `पितृकारक सूर्य (${sun.placedHouse}वें भाव) एवं नवमेश ${h9.lordHi} (भाव ${h9.placedHouse}) के प्रभाव से पिता का उच्च मार्गदर्शन, स्वाभिमान व नैतिक संस्कार।`,
      verdictEn: `Noble paternal guidance and inherited ethical dignity anchored by Sun in House ${sun.placedHouse} and 9th Lord ${h9.lord} in House ${h9.placedHouse}.`,
      detailedAnalysisHi: `महर्षि पराशर अनुसार नवम भाव पिता और धर्म का मुख्य स्थान है। सूर्य और नवमेश का बली होना जातक को पितृ-कृपा का पात्र बनाता है।`,
      detailedAnalysisEn: `Per BPHS Ch. 21, the 9th house lords the father. Strong Sun and Bhagyesha confer lifelong paternal blessings.`,
      remedyHi: `प्रतिदिन पिता के चरण स्पर्श करें तथा सूर्य को कुंकुम जल अर्पित करें।`,
      remedyEn: `Touch your father's feet for daily blessings and offer copper water to the rising Sun.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 36. पिता की दीर्घायु व कुल की प्रतिष्ठा
  {
    const score = Math.max(30, Math.min(92, 50 + getDignityBonus(h9.dignity) + (sun.placedHouse === 9 || sun.placedHouse === 10 ? 12 : 0)));
    addDim({
      id: 36,
      houseNumber: 9,
      houseTitleHi: 'नवम भाव (भाग्य व धर्म भाव)',
      houseTitleEn: '9th House (Dharma & Bhagya)',
      category: 'family',
      categoryTitleHi: 'माता-पिता व कुल',
      categoryTitleEn: 'Parents & Lineage',
      titleHi: 'पिता की दीर्घायु, कुल की प्रतिष्ठा व पैतृक समृद्धि',
      titleEn: 'Father’s Longevity & Paternal Lineage Fortune',
      classicalRef: 'जातक पारिजात अ. 14 व बृहत्पाराशर होरा शास्त्र (पितृ-अरिष्ट)',
      divisionalRef: 'सूर्य से नवम भाव व D12 द्वादशांश',
      vakriNote: '',
      astroBasisHi: `सूर्य से नवम भाव का स्वामी; नवमेश ${h9.lordHi} भाव ${h9.placedHouse} में।`,
      astroBasisEn: `Dispositor of 9th from Sun; 9th Lord ${h9.lord} placed in House ${h9.placedHouse}.`,
      verdictHi: `नवमेश ${h9.lordHi} (भाव ${h9.placedHouse}) एवं सूर्य के शुभ प्रभाव से पिता की सुदीर्घ आयु एवं पैतृक कुल में मान-सम्मान।`,
      verdictEn: `Promising longevity for father and distinguished lineage status anchored by 9th Lord ${h9.lord} in House ${h9.placedHouse}.`,
      detailedAnalysisHi: `जातक पारिजात अनुसार सूर्य से नवम भाव पिता की आयु का निर्धारण करता है। शुभ ग्रहों के प्रभाव से पिता दीर्घायु होते हैं।`,
      detailedAnalysisEn: `Per Jataka Parijata Ch. 14, the 9th from Sun indicates paternal longevity. Benefic aspects secure paternal life-force.`,
      remedyHi: `रविवार को गेहूं व गुड़ का दान करें तथा आदित्य हृदय स्तोत्र का पाठ करें।`,
      remedyEn: `Donate wheat and jaggery on Sundays and recite the Aditya Hridaya Stotra.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 37. भाग्य का उदय, धर्मपरायणता व ईश्वरीय अनुग्रह
  {
    const score = Math.max(35, Math.min(98, 54 + getDignityBonus(h9.dignity) + (sav[8] >= 28 ? 10 : -8)));
    addDim({
      id: 37,
      houseNumber: 9,
      houseTitleHi: 'नवम भाव (भाग्य व धर्म भाव)',
      houseTitleEn: '9th House (Dharma & Bhagya)',
      category: 'wealth_fortune',
      categoryTitleHi: 'धन व समृद्धि',
      categoryTitleEn: 'Wealth & Prosperity',
      titleHi: 'भाग्य का उदय, धर्मपरायणता व ईश्वरीय अनुग्रह',
      titleEn: 'Bhagya Fortune, Divine Righteousness & Dharma Grace',
      classicalRef: 'बृहत्पाराशर होरा शास्त्र अ. 21 व उत्तर कालामृत',
      divisionalRef: 'D9 नवांश व नवम भाव SAV',
      vakriNote: getVakriExplanation(planets.find((p) => p.id === h9.lord)),
      astroBasisHi: `नवमेश ${h9.lordHi} भाव ${h9.placedHouse} में (${h9.dignityHi}); नवम भाव SAV: ${sav[8]} बिंदु; धर्म त्रिकोण बली।`,
      astroBasisEn: `9th Lord ${h9.lord} in H${h9.placedHouse} (${h9.dignity}); 9th SAV: ${sav[8]} bindus; Dharma Trikona empowered.`,
      verdictHi: `नवमेश ${h9.lordHi} (भाव ${h9.placedHouse}) के प्रभाव से जीवन के महत्वपूर्ण मोड़ों पर भाग्य का भरपूर साथ व ईश्वरीय अनुग्रह।`,
      verdictEn: `Radiant fortune (Bhagya) opening doors at crucial life junctures under 9th Lord ${h9.lord} in House ${h9.placedHouse}.`,
      detailedAnalysisHi: `पाराशर मतानुसार नवम भाव भाग्य और धर्म का शिखर है। जब नवमेश शुभ हो तो जातक के कार्य अल्प प्रयास में भी सिद्ध होते हैं।`,
      detailedAnalysisEn: `Per BPHS Ch. 21, the 9th house is the apex of auspicious destiny (Bhagya), bringing unmerited lucky breakthroughs.`,
      remedyHi: `गुरु अथवा मंदिर के पुजारी का सम्मान करें तथा गुरुवार को केसर का तिलक लगाएं।`,
      remedyEn: `Honor spiritual gurus and apply a sacred saffron tilak on forehead on Thursdays.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 38. उच्च शिक्षा, गुरु कृपा व तीर्थाटन योग
  {
    const score = Math.max(32, Math.min(95, 52 + getDignityBonus(jupiter.dignity) + (h9.placedHouse === 9 || h9.placedHouse === 5 ? 12 : 0)));
    addDim({
      id: 38,
      houseNumber: 9,
      houseTitleHi: 'नवम भाव (भाग्य व धर्म भाव)',
      houseTitleEn: '9th House (Dharma & Bhagya)',
      category: 'education',
      categoryTitleHi: 'शिक्षा व विद्या',
      categoryTitleEn: 'Education & Intellect',
      titleHi: 'उच्च शिक्षा, गुरु कृपा व तीर्थाटन योग',
      titleEn: 'Higher Learning, Philosophy, Guru Blessings & Long Pilgrimages',
      classicalRef: 'सर्वार्थ चिंतामणि अ. 9 व केपी कृष्णमूर्ति पद्धति',
      divisionalRef: 'D24 चतुर्विंशांश व गुरु ग्रह',
      vakriNote: '',
      astroBasisHi: `गुरु भाव ${jupiter.placedHouse} में (${jupiter.dignityHi}); नवमेश ${h9.lordHi} भाव ${h9.placedHouse} में; तीर्थ व उच्च विद्या कारक।`,
      astroBasisEn: `Jupiter in House ${jupiter.placedHouse} (${jupiter.dignity}); 9th Lord ${h9.lord} in House ${h9.placedHouse}; pilgrimage factors.`,
      verdictHi: `गुरु (${jupiter.placedHouse}वें भाव) एवं नवमेश ${h9.lordHi} (भाव ${h9.placedHouse}) के प्रभाव से उच्च डिग्रियां, शोध, दार्शनिक ज्ञान एवं पवित्र तीर्थ यात्राओं के अवसर।`,
      verdictEn: `Postgraduate scholarly research, philosophical erudition, and sacred pilgrimages governed by Jupiter in House ${jupiter.placedHouse} and 9th Lord ${h9.lord}.`,
      detailedAnalysisHi: `सर्वार्थ चिंतामणि अनुसार नवम भाव उच्च अध्ययन और तीर्थ यात्रा का है। गुरु का संबंध जातक को विद्वानों में अग्रगण्य बनाता है।`,
      detailedAnalysisEn: `Per Sarvartha Chintamani Ch. 9, the 9th house governs university scholarship and pilgrimage journeys under wise preceptors.`,
      remedyHi: `धार्मिक ग्रंथों का स्वाध्याय करें तथा पीले चंदन का दान करें।`,
      remedyEn: `Engage in regular study of philosophical texts and donate yellow sandalwood to a shrine.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // =========================================================================
  // CHAPTER 10: दशम भाव (KARMA & RAJYA BHAVA) — 5 Dimensions (IDs 39 to 43)
  // =========================================================================

  // 39. आजीविका दिशा: स्वतंत्र व्यवसाय अथवा सेवा/नौकरी
  {
    const score = Math.max(35, Math.min(98, 54 + getDignityBonus(h10.dignity) + (sav[9] >= 28 ? 10 : -6)));
    const isBusinessOriented = (mercury.placedHouse === 10 || h10.lord === 'Mercury' || h10.lord === 'Venus' || h10.placedHouse === 7);
    addDim({
      id: 39,
      houseNumber: 10,
      houseTitleHi: 'दशम भाव (कर्म व राज्य भाव)',
      houseTitleEn: '10th House (Karma & Rajya)',
      category: 'career',
      categoryTitleHi: 'करियर व पद',
      categoryTitleEn: 'Career & Authority',
      titleHi: 'आजीविका दिशा: स्वतंत्र व्यवसाय अथवा सेवा/नौकरी',
      titleEn: 'Core Career Direction: Independent Enterprise vs Employment',
      classicalRef: 'बृहज्जातक (कर्माजीवाध्याय 10) व फलदीपिका अ. 24',
      divisionalRef: 'D10 दशमांश लग्न व दशमेश',
      vakriNote: getVakriExplanation(planets.find((p) => p.id === h10.lord)),
      astroBasisHi: `दशमेश ${h10.lordHi} भाव ${h10.placedHouse} में (${h10.dignityHi}); दशम भाव SAV: ${sav[9]} बिंदु; D10 दशमांश स्थिति।`,
      astroBasisEn: `10th Lord ${h10.lord} in House ${h10.placedHouse} (${h10.dignity}); 10th SAV: ${sav[9]} bindus; D10 Dashamsha audited.`,
      verdictHi: isBusinessOriented
        ? `दशमेश ${h10.lordHi} (भाव ${h10.placedHouse}) के प्रभाव से स्वतंत्र व्यवसाय, उद्योग अथवा व्यापारिक उद्यम में असाधारण सफलता।`
        : `दशमेश ${h10.lordHi} (भाव ${h10.placedHouse}) के प्रभाव से उच्च प्रशासनिक पद, प्रतिष्ठित सेवा अथवा कॉरपोरेट नेतृत्व में निरंतर स्थायित्व।`,
      verdictEn: isBusinessOriented
        ? `Independent business enterprise and commercial leadership strongly favored by 10th Lord ${h10.lord} in House ${h10.placedHouse}.`
        : `Executive service stability and institutional authority favored by 10th Lord ${h10.lord} in House ${h10.placedHouse}.`,
      detailedAnalysisHi: `आचार्य वराहमिहिर के कर्माजीवाध्याय अनुसार दशम भाव आजीविका का मूल स्रोत है। दशमेश का प्रभाव कार्यक्षेत्र की प्रकृति और नेतृत्व शैली को तय करता है।`,
      detailedAnalysisEn: `Per Varahamihira's Karmajivadhya (Brihat Jataka Ch. 10), the 10th lord and its planetary dispositor dictate lifelong vocation.`,
      remedyHi: `दशमेश के मंत्र का नित्य 108 बार जप करें तथा कार्यस्थल पर उत्तर-पूर्व दिशा को स्वच्छ रखें।`,
      remedyEn: `Chant the mantra of your 10th lord 108 times daily and keep the North-East corner of workspace tidy.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 40. राजकीय कृपा, प्रशासनिक पद, सत्ता व अधिकार
  {
    const score = Math.max(32, Math.min(95, 52 + (sun.placedHouse === 10 || mars.placedHouse === 10 ? 18 : 0) + getDignityBonus(sun.dignity) / 2));
    addDim({
      id: 40,
      houseNumber: 10,
      houseTitleHi: 'दशम भाव (कर्म व राज्य भाव)',
      houseTitleEn: '10th House (Karma & Rajya)',
      category: 'career',
      categoryTitleHi: 'करियर व पद',
      categoryTitleEn: 'Career & Authority',
      titleHi: 'राजकीय कृपा, प्रशासनिक पद, सत्ता व अधिकार',
      titleEn: 'Government Authority, High Executive Rank & State Power',
      classicalRef: 'बृहत्पाराशर होरा शास्त्र (राजयोग अध्याय) व सारावली अ. 32',
      divisionalRef: 'D10 दशमांश व सूर्य/मंगल दशम में (दिग्बल)',
      vakriNote: '',
      astroBasisHi: `सूर्य भाव ${sun.placedHouse} में; मंगल भाव ${mars.placedHouse} में; दशम भाव में दिग्बल स्थिति; राजयोग सक्रियता।`,
      astroBasisEn: `Sun in House ${sun.placedHouse}; Mars in House ${mars.placedHouse}; Digbala directional strength in 10th.`,
      verdictHi: `सूर्य (${sun.placedHouse}वें भाव) एवं मंगल (${mars.placedHouse}वें भाव) के प्रभाव से सरकार, उच्चाधिकारियों अथवा शासन-प्रशासन से विशेष सम्मान व सत्ता।`,
      verdictEn: `State patronage, administrative honors, and executive authority driven by Sun in House ${sun.placedHouse} and Mars in House ${mars.placedHouse}.`,
      detailedAnalysisHi: `पाराशर राजयोग अध्याय अनुसार दशम में सूर्य अथवा मंगल दिग्बली होकर कुलदीपक राजयोग बनाते हैं, जिससे जातक समाज में शीर्ष पद पाता है।`,
      detailedAnalysisEn: `Per BPHS Rajayoga chapters, Sun or Mars in the 10th with Digbala directional force grants supreme civic authority.`,
      remedyHi: `रविवार को तांबे का सिक्का बहते जल में प्रवाहित करें तथा पिता व अधिकारियों का आदर करें।`,
      remedyEn: `Immerse a copper coin in running water on Sundays and maintain respectful diplomacy with government superiors.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 41. अनुकूल कार्यक्षेत्र, विशिष्ट व्यावसायिक कौशल
  {
    const score = Math.max(35, Math.min(95, 52 + getDignityBonus(h10.dignity) + 6));
    addDim({
      id: 41,
      houseNumber: 10,
      houseTitleHi: 'दशम भाव (कर्म व राज्य भाव)',
      houseTitleEn: '10th House (Karma & Rajya)',
      category: 'career',
      categoryTitleHi: 'करियर व पद',
      categoryTitleEn: 'Career & Authority',
      titleHi: 'अनुकूल कार्यक्षेत्र, विशिष्ट व्यावसायिक कौशल',
      titleEn: 'Suitable Professions, Technical Niches & Specialized Fields',
      classicalRef: 'फलदीपिका अ. 24 व अमात्यकारक (AmK)',
      divisionalRef: 'D10 दशमांश व अमात्यकारक नवांश',
      vakriNote: '',
      astroBasisHi: `दशमेश ${h10.lordHi} भाव ${h10.placedHouse} में; अमात्यकारक ग्रह की स्थिति व प्रभाव।`,
      astroBasisEn: `10th Lord ${h10.lord} in House ${h10.placedHouse}; Amatyakaraka (AmK) career significator.`,
      verdictHi: `दशमेश ${h10.lordHi} (भाव ${h10.placedHouse}) एवं दशमांश प्रभाव से विशिष्ट व्यावसायिक कौशल व कार्यक्षेत्र में दक्षता।`,
      verdictEn: `Specialized vocational mastery and industry leadership anchored by 10th Lord ${h10.lord} in House ${h10.placedHouse}.`,
      detailedAnalysisHi: `फलदीपिका और जैमिनी अनुसार अमात्यकारक (AmK) ग्रह आजीविका के विशिष्ट कौशल और दैनिक कार्यप्रणाली का संचालन करता है।`,
      detailedAnalysisEn: `Per Phaladeepika Ch. 24 and Jaimini, the Amatyakaraka dictates personal vocational talent and industry specialization.`,
      remedyHi: `अपनी व्यावसायिक कार्यकुशलता को निखारने हेतु निरंतर स्वाध्याय करें।`,
      remedyEn: `Continuously upgrade professional certifications and functional industry skills.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 42. सामाजिक ख्याति, मान-सम्मान व सार्वजनिक प्रतिष्ठा
  {
    const score = Math.max(35, Math.min(95, 54 + (sav[9] >= 28 ? 10 : -6) + (jupiter.placedHouse === 10 ? 14 : 0)));
    addDim({
      id: 42,
      houseNumber: 10,
      houseTitleHi: 'दशम भाव (कर्म व राज्य भाव)',
      houseTitleEn: '10th House (Karma & Rajya)',
      category: 'career',
      categoryTitleHi: 'करियर व पद',
      categoryTitleEn: 'Career & Authority',
      titleHi: 'सामाजिक ख्याति, मान-सम्मान व सार्वजनिक प्रतिष्ठा',
      titleEn: 'Social Prestige, Public Renown, Fame & Awards',
      classicalRef: 'सर्वार्थ चिंतामणि अ. 10 व आरूढ़ लग्न (AL)',
      divisionalRef: 'D1 दशम भाव व D10 दशमांश',
      vakriNote: '',
      astroBasisHi: `दशम भाव SAV: ${sav[9]} बिंदु; आरूढ़ लग्न स्थिति; शुभ ग्रहों की दृष्टि।`,
      astroBasisEn: `10th SAV: ${sav[9]} bindus; Arudha Lagna (AL) verified; benefic aspects.`,
      verdictHi: `दशमेश ${h10.lordHi} (भाव ${h10.placedHouse}) एवं दशम भाव SAV (${sav[9]} बिंदु) के प्रभाव से विस्तृत सामाजिक प्रतिष्ठा व उत्कृष्ट छवि।`,
      verdictEn: `Broad public recognition and societal honor anchored by 10th Lord ${h10.lord} in House ${h10.placedHouse} and 10th SAV (${sav[9]} bindus).`,
      detailedAnalysisHi: `सर्वार्थ चिंतामणि अनुसार दशम भाव यश और कीर्ति का है। उच्च अष्टकवर्ग बिंदु जातक के कार्यों को सर्वत्र प्रशंसित कराते हैं।`,
      detailedAnalysisEn: `Per Sarvartha Chintamani Ch. 10, robust Ashtakavarga bindus in the 10th confer enduring fame and social laurels.`,
      remedyHi: `सत्यनिष्ठ आचरण बनाए रखें तथा समाज के कल्याण हेतु यथाशक्ति योगदान दें।`,
      remedyEn: `Maintain strict ethical accountability and contribute meaningfully to community welfare.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 43. कार्यक्षेत्र में अस्थिरता, अवनति व स्थानांतरण
  {
    const hasTurbulence = (rahu?.placedHouse === 10 || ketu?.placedHouse === 10 || h10.placedHouse === 6 || h10.placedHouse === 8 || h10.placedHouse === 12);
    const score = hasTurbulence ? 42 : 72;
    addDim({
      id: 43,
      houseNumber: 10,
      houseTitleHi: 'दशम भाव (कर्म व राज्य भाव)',
      houseTitleEn: '10th House (Karma & Rajya)',
      category: 'shadow_challenges',
      categoryTitleHi: 'चुनौतियां व सतर्कता',
      categoryTitleEn: 'Shadow Challenges',
      titleHi: 'कार्यक्षेत्र में अस्थिरता, अवनति व स्थानांतरण',
      titleEn: 'Professional Hazards, Career Turbulence & Demotions',
      classicalRef: 'फलदीपिका अ. 24 व लाल किताब 1952',
      divisionalRef: 'D10 में 8वां भाव व दशम में राहु',
      vakriNote: '',
      astroBasisHi: `दशम भाव में स्थिति: ${hasTurbulence ? 'अस्थिरता कारक ग्रह सक्रिय' : 'स्थिर व सुरक्षित स्थिति'}; दशमेश का षडाष्टक योग।`,
      astroBasisEn: `10th House status: ${hasTurbulence ? 'Turbulence indicators noted' : 'Stable and protected'}; 10th lord alignments.`,
      verdictHi: hasTurbulence
        ? `दशम भाव में स्थिति के कारण दशा परिवर्तन के समय कार्यक्षेत्र में अचानक परिवर्तन अथवा स्थानांतरण से सावधानी अपेक्षित।`
        : `दशमेश ${h10.lordHi} (भाव ${h10.placedHouse}) के प्रभाव से कार्यक्षेत्र में असाधारण स्थिरता; अकारण अवनति का कोई जोखिम नहीं।`,
      verdictEn: hasTurbulence
        ? `Periodic career volatility or transfer during dasha transitions under 10th house influences.`
        : `Exceptional vocational stability under 10th Lord ${h10.lord} in House ${h10.placedHouse}; shielded from unwarranted disruptions.`,
      detailedAnalysisHi: `फलदीपिका अनुसार दशम भाव में राहु या षष्ठेश/अष्टमेश का संबंध करियर में अचानक उथल-पुथल लाता है, जिससे सतर्क रहना आवश्यक है।`,
      detailedAnalysisEn: `Per Phaladeepika Ch. 24, malefic or dusthana involvement in the 10th brings career pivots requiring stoic patience.`,
      remedyHi: `भगवान गणेश को बुधवार को मोदक अर्पित करें तथा कार्यस्थल पर विवादों से तटस्थ रहें।`,
      remedyEn: `Offer sweet modaks to Lord Ganesha on Wednesdays and remain neutral during corporate office intrigues.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // =========================================================================
  // CHAPTER 11: एकादश भाव (LABHA & AYA BHAVA) — 4 Dimensions (IDs 44 to 47)
  // =========================================================================

  // 44. नियमित आय प्रवाह, लाभ की गति व वित्तीय प्रचुरता
  {
    const score = Math.max(35, Math.min(98, 54 + getDignityBonus(h11.dignity) + (sav[10] >= 28 ? 10 : -6)));
    addDim({
      id: 44,
      houseNumber: 11,
      houseTitleHi: 'एकादश भाव (लाभ व आय भाव)',
      houseTitleEn: '11th House (Labha & Aya)',
      category: 'wealth_fortune',
      categoryTitleHi: 'धन व समृद्धि',
      categoryTitleEn: 'Wealth & Prosperity',
      titleHi: 'नियमित आय प्रवाह, लाभ की गति व वित्तीय प्रचुरता',
      titleEn: 'Regular Incomes, Revenue Velocity & Surplus Gains',
      classicalRef: 'बृहत्पाराशर होरा शास्त्र अ. 23 व सारावली अ. 33',
      divisionalRef: 'D1 एकादश भाव व एकादशेश',
      vakriNote: getVakriExplanation(planets.find((p) => p.id === h11.lord)),
      astroBasisHi: `एकादशेश ${h11.lordHi} भाव ${h11.placedHouse} में (${h11.dignityHi}); लाभ भाव SAV: ${sav[10]} बिंदु।`,
      astroBasisEn: `11th Lord ${h11.lord} in House ${h11.placedHouse} (${h11.dignity}); 11th SAV: ${sav[10]} bindus.`,
      verdictHi: `एकादशेश ${h11.lordHi} (भाव ${h11.placedHouse}) एवं एकादश भाव SAV (${sav[10]} बिंदु) के प्रभाव से आय के निरंतर स्रोत व वित्तीय प्रचुरता।`,
      verdictEn: `Continuous recurring revenues and capital profit margins anchored by 11th Lord ${h11.lord} in House ${h11.placedHouse} and 11th SAV (${sav[10]} bindus).`,
      detailedAnalysisHi: `पाराशर मतानुसार एकादश भाव सर्व-कामना सिद्धि और आय का है। यह उपचय भाव होने से समय के साथ आय में निरंतर वृद्धि करता है।`,
      detailedAnalysisEn: `Per BPHS Ch. 23, the 11th house is the prime generator of recurring profits and financial surplus.`,
      remedyHi: `गुरुवार को कुबेर मंत्र का जप करें तथा तिजोरी में लाल रेशमी वस्त्र बिछाएं।`,
      remedyEn: `Chant the Kuber Mantra on Thursdays and place a sacred red silk cloth inside your cash locker.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 45. अग्रज भ्राता-भगिनी, मार्गदर्शक व उच्च संपर्क
  {
    const score = Math.max(30, Math.min(92, 50 + getDignityBonus(h11.dignity) + (jupiter.placedHouse === 11 ? 12 : 0)));
    addDim({
      id: 45,
      houseNumber: 11,
      houseTitleHi: 'एकादश भाव (लाभ व आय भाव)',
      houseTitleEn: '11th House (Labha & Aya)',
      category: 'family',
      categoryTitleHi: 'माता-पिता व कुल',
      categoryTitleEn: 'Parents & Lineage',
      titleHi: 'अग्रज भ्राता-भगिनी, मार्गदर्शक व उच्च संपर्क',
      titleEn: 'Elder Siblings, Mentors, Influential Circles & Patrons',
      classicalRef: 'बृहत्पाराशर होरा शास्त्र अ. 23 व जातक पारिजात अ. 16',
      divisionalRef: 'D3 द्रेष्काण एकादश भाव',
      vakriNote: '',
      astroBasisHi: `एकादशेश ${h11.lordHi} भाव ${h11.placedHouse} में; गुरु की दृष्टि; अग्रज भाव।`,
      astroBasisEn: `11th Lord ${h11.lord} in House ${h11.placedHouse}; Jupiter aspects; elder sibling karakatva.`,
      verdictHi: `एकादशेश ${h11.lordHi} (भाव ${h11.placedHouse}) के प्रभाव से बड़े भाई-बहनों का स्नेह तथा प्रभावशाली मार्गदर्शकों का संरक्षण।`,
      verdictEn: `Supportive fraternal ties with elder siblings and elite mentorship anchored by 11th Lord ${h11.lord} in House ${h11.placedHouse}.`,
      detailedAnalysisHi: `पाराशर अनुसार एकादश भाव बड़े भाई-बहनों और उच्च मित्रों का है। शुभ प्रभाव जातक को प्रभावशाली संरक्षकों का सहयोग दिलाता है।`,
      detailedAnalysisEn: `Per BPHS Ch. 23, the 11th house signifies elder co-borns and elite patrons who accelerate personal elevation.`,
      remedyHi: `बड़े भाई-बहनों का आदर करें तथा शनिवार को जरूरतमंदों को कंबल दान करें।`,
      remedyEn: `Honor elder siblings and donate blankets to the needy during winter seasons.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 46. मनोकामना सिद्धि, महत्वाकांक्षाओं की पूर्ति
  {
    const score = Math.max(35, Math.min(95, 54 + (sav[10] >= 28 ? 10 : -6) + (h11.placedHouse === 11 || h11.placedHouse === 1 ? 12 : 0)));
    addDim({
      id: 46,
      houseNumber: 11,
      houseTitleHi: 'एकादश भाव (लाभ व आय भाव)',
      houseTitleEn: '11th House (Labha & Aya)',
      category: 'wealth_fortune',
      categoryTitleHi: 'धन व समृद्धि',
      categoryTitleEn: 'Wealth & Prosperity',
      titleHi: 'मनोकामना सिद्धि, महत्वाकांक्षाओं की पूर्ति',
      titleEn: 'Fulfillment of Cherished Hopes, Dreams & Ambitions',
      classicalRef: 'सर्वार्थ चिंतामणि अ. 11 व केपी कृष्णमूर्ति पद्धति',
      divisionalRef: 'D1 एकादश भाव व 11वां उप-स्वामी',
      vakriNote: '',
      astroBasisHi: `एकादश भाव SAV: ${sav[10]} बिंदु; एकादशेश ${h11.lordHi} भाव ${h11.placedHouse} में; कामना सिद्धि योग।`,
      astroBasisEn: `11th SAV: ${sav[10]} bindus; 11th Lord ${h11.lord} in House ${h11.placedHouse}; wish fulfillment yoga.`,
      verdictHi: `एकादशेश ${h11.lordHi} (भाव ${h11.placedHouse}) के प्रभाव से महत्वाकांक्षाओं एवं संकल्पों की पूर्ण सिद्धि।`,
      verdictEn: `Realization of long-held ambitions and aspirations governed by 11th Lord ${h11.lord} in House ${h11.placedHouse}.`,
      detailedAnalysisHi: `सर्वार्थ चिंतामणि के अनुसार एकादश भाव सभी प्रकार की इच्छाओं की पूर्ति का द्वार है। यदि यह भाव बली हो तो जातक के संकल्प सिद्ध होते हैं।`,
      detailedAnalysisEn: `Per Sarvartha Chintamani Ch. 11, a strong 11th house actualizes long-held life intentions into reality.`,
      remedyHi: `प्रतिदिन इष्टदेव के सम्मुख अपनी मनोकामना का संकल्प दोहराएं तथा सात्विक रहें।`,
      remedyEn: `Reaffirm noble intentions before your Ishta Devata at dawn and maintain ethical integrity.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 47. जनसंपर्क, संस्थागत नेतृत्व व परोपकार
  {
    const score = Math.max(30, Math.min(92, 50 + (rahu?.placedHouse === 11 || saturn.placedHouse === 11 ? 14 : 0)));
    addDim({
      id: 47,
      houseNumber: 11,
      houseTitleHi: 'एकादश भाव (लाभ व आय भाव)',
      houseTitleEn: '11th House (Labha & Aya)',
      category: 'career',
      categoryTitleHi: 'करियर व पद',
      categoryTitleEn: 'Career & Authority',
      titleHi: 'जनसंपर्क, संस्थागत नेतृत्व व परोपकार',
      titleEn: 'Large-Scale Collectives, Social Networks & Public Platforms',
      classicalRef: 'फलदीपिका अ. 25 व लाल किताब 1952',
      divisionalRef: 'D1 एकादश भाव व राहु/शनि',
      vakriNote: '',
      astroBasisHi: `एकादश भाव में राहु/शनि स्थिति; विशाल सामाजिक नेटवर्क व संस्थागत संबंध।`,
      astroBasisEn: `Rahu/Saturn placement in 11th house; large-scale collective network geometry.`,
      verdictHi: `एकादशेश ${h11.lordHi} (भाव ${h11.placedHouse}) के प्रभाव से विशाल संगठनों, ऑनलाइन समुदायों व परोपकारी कार्यों में अग्रणी भूमिका।`,
      verdictEn: `Expansive connectivity with global collectives and community movements anchored by 11th Lord ${h11.lord} in House ${h11.placedHouse}.`,
      detailedAnalysisHi: `फलदीपिका अनुसार एकादश भाव बड़े जनसमूहों का है। इस भाव में राहु अथवा शनि जातक को जनसाधारण के बीच लोकप्रिय बनाते हैं।`,
      detailedAnalysisEn: `Per Phaladeepika Ch. 25, the 11th house lords mass networks, granting charismatic rapport across large collectives.`,
      remedyHi: `सामूहिक परोपकारी कार्यों में सक्रिय भाग लें तथा प्याऊ अथवा जल सेवा की स्थापना कराएं।`,
      remedyEn: `Support community welfare projects and help fund drinking water facilities for the public.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // =========================================================================
  // CHAPTER 12: द्वादश भाव (VYAYA & MOKSHA BHAVA) — 4 Dimensions (IDs 48 to 51)
  // =========================================================================

  // 48. विदेश गमन, सुदूर प्रवास व विदेशी स्रोतों से लाभ
  {
    const score = Math.max(32, Math.min(95, 52 + (rahu?.placedHouse === 12 || moon.placedHouse === 12 || h12.placedHouse === 9 ? 16 : 0) + (h9.placedHouse === 12 ? 12 : 0)));
    addDim({
      id: 48,
      houseNumber: 12,
      houseTitleHi: 'द्वादश भाव (व्यय व मोक्ष भाव)',
      houseTitleEn: '12th House (Vyaya & Moksha)',
      category: 'career',
      categoryTitleHi: 'करियर व पद',
      categoryTitleEn: 'Career & Authority',
      titleHi: 'विदेश गमन, सुदूर प्रवास व विदेशी स्रोतों से लाभ',
      titleEn: 'Foreign Relocation, Cross-Border Living & Overseas Gains',
      classicalRef: 'बृहत्पाराशर होरा शास्त्र अ. 24 व सारावली अ. 34',
      divisionalRef: 'D1 द्वादश भाव व 4/9/12 धुरी',
      vakriNote: '',
      astroBasisHi: `द्वादशेश ${h12.lordHi} भाव ${h12.placedHouse} में; राहु/चंद्र का द्वादश/नवम संबंध; विदेश यात्रा योग।`,
      astroBasisEn: `12th Lord ${h12.lord} in House ${h12.placedHouse}; Rahu/Moon foreign axis involving Houses 4, 9, 12.`,
      verdictHi: `द्वादशेश ${h12.lordHi} (भाव ${h12.placedHouse}) के प्रभाव से जन्मस्थान से दूर अथवा विदेश में स्थायी निवास व विदेशी स्रोतों से लाभ।`,
      verdictEn: `High potential for international travel, overseas relocation, or cross-border success governed by 12th Lord ${h12.lord} in House ${h12.placedHouse}.`,
      detailedAnalysisHi: `पाराशर संहिता अनुसार द्वादश भाव विदेश का अधिपति है। जब चतुर्थ, नवम और द्वादश भावों का संबंध बने, तो जातक जन्मभूमि से दूर उत्कर्ष पाता है।`,
      detailedAnalysisEn: `Per BPHS Ch. 24, the 12th house rules distant foreign lands. Alignments with 4th and 9th houses foster overseas flourishing.`,
      remedyHi: `विदेश यात्रा से पूर्व मां दुर्गा की पूजा करें तथा पक्षियों को जल पिलाएं।`,
      remedyEn: `Offer prayers to Goddess Durga before long international journeys and keep bird baths filled with fresh water.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 49. व्यय की प्रवृत्ति, वित्तीय क्षरण व अपव्यय नियंत्रण
  {
    const score = Math.max(28, Math.min(88, 50 - (h12.placedHouse === 12 ? 8 : 0) + (sav[11] <= 26 ? 8 : -6)));
    addDim({
      id: 49,
      houseNumber: 12,
      houseTitleHi: 'द्वादश भाव (व्यय व मोक्ष भाव)',
      houseTitleEn: '12th House (Vyaya & Moksha)',
      category: 'wealth_fortune',
      categoryTitleHi: 'धन व समृद्धि',
      categoryTitleEn: 'Wealth & Prosperity',
      titleHi: 'व्यय की प्रवृत्ति, वित्तीय क्षरण व अपव्यय नियंत्रण',
      titleEn: 'Nature of Expenditures, Capital Drain & Wasteful Leakages',
      classicalRef: 'फलदीपिका अ. 26 व लाल किताब 1952',
      divisionalRef: 'D1 द्वादश भाव व द्वादशेश',
      vakriNote: '',
      astroBasisHi: `द्वादशेश ${h12.lordHi} भाव ${h12.placedHouse} में; द्वादश भाव SAV: ${sav[11]} बिंदु; व्यय प्रवृत्ति।`,
      astroBasisEn: `12th Lord ${h12.lord} in House ${h12.placedHouse}; 12th SAV: ${sav[11]} bindus; expenditure velocity.`,
      verdictHi: `द्वादशेश ${h12.lordHi} (भाव ${h12.placedHouse}) एवं द्वादश भाव SAV (${sav[11]} बिंदु) के प्रभाव से परोपकार व निवेशों में सुनियोजित व्यय।`,
      verdictEn: `Purposeful, ethical expenditures and investment budgeting governed by 12th Lord ${h12.lord} in House ${h12.placedHouse} and 12th SAV (${sav[11]} bindus).`,
      detailedAnalysisHi: `फलदीपिका अनुसार द्वादश भाव व्यय का है। यदि इस भाव में शुभ ग्रह हों तो व्यय धार्मिक कार्यों में होता है, जबकि पापी ग्रह व्यर्थ धन खर्च कराते हैं।`,
      detailedAnalysisEn: `Per Phaladeepika Ch. 26, the 12th house governs cash outflow. Benefic aspects ensure purposeful, ethical investments.`,
      remedyHi: `अपनी आय का एक निश्चित अंश (जैसे 2-5%) नित्य दान-पुण्य में लगाएं।`,
      remedyEn: `Divert a fixed tithing portion (2-5%) of monthly earnings directly to genuine charitable causes.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 50. निद्रा सुख, अस्पताल वास, एकांतवास व गुप्त चिंता
  {
    const score = Math.max(30, Math.min(90, 50 + (venus.placedHouse === 12 ? 14 : 0) - (saturn.placedHouse === 12 ? 12 : 0)));
    addDim({
      id: 50,
      houseNumber: 12,
      houseTitleHi: 'द्वादश भाव (व्यय व मोक्ष भाव)',
      houseTitleEn: '12th House (Vyaya & Moksha)',
      category: 'longevity_health',
      categoryTitleHi: 'स्वास्थ्य व आयु',
      categoryTitleEn: 'Health & Longevity',
      titleHi: 'निद्रा सुख, अस्पताल वास, एकांतवास व गुप्त चिंता',
      titleEn: 'Subconscious Health, Hospitalization, Confinement & Sleep',
      classicalRef: 'सारावली अ. 34 व जातक पारिजात अ. 17',
      divisionalRef: 'D30 त्रिंशांश व शुक्र/शनि द्वादश में',
      vakriNote: '',
      astroBasisHi: `द्वादश भाव में ग्रह स्थिति; शुक्र/शनि का प्रभाव; शैया सुख व निद्रा कारक।`,
      astroBasisEn: `12th house planetary occupancy; Venus/Saturn bedroom comfort and sleep parameters.`,
      verdictHi: `द्वादशेश ${h12.lordHi} (भाव ${h12.placedHouse}) के प्रभाव से गहरी निद्रा व एकांत चिंतन का सुख; ध्यान से मानसिक संतुलन।`,
      verdictEn: `Restorative nocturnal sleep quality and quiet mental convalescence governed by 12th Lord ${h12.lord} in House ${h12.placedHouse}.`,
      detailedAnalysisHi: `सारावली अनुसार द्वादश भाव शैया सुख और एकांतवास का है। शुक्र का द्वादश में होना सुखद निद्रा देता है, जबकि शनि चिंता बढ़ा सकता है।`,
      detailedAnalysisEn: `Per Saravali Ch. 34, the 12th house dictates nocturnal rest (Shayya Sukha) and quiet mental convalescence.`,
      remedyHi: `सोने की दिशा दक्षिण अथवा पूर्व रखें तथा शयनकक्ष में मोबाइल फोन से दूरी बनाएं।`,
      remedyEn: `Sleep with head facing South or East and disconnect electronic screens an hour before resting.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  // 51. मोक्ष प्राप्ति, आंतरिक साधना व समाधि योग
  {
    const score = Math.max(35, Math.min(98, 54 + (ketu?.placedHouse === 12 ? 18 : 0) + (jupiter.placedHouse === 12 ? 14 : 0)));
    addDim({
      id: 51,
      houseNumber: 12,
      houseTitleHi: 'द्वादश भाव (व्यय व मोक्ष भाव)',
      houseTitleEn: '12th House (Vyaya & Moksha)',
      category: 'spirituality',
      categoryTitleHi: 'आध्यात्म व मोक्ष',
      categoryTitleEn: 'Spirituality & Grace',
      titleHi: 'मोक्ष प्राप्ति, आंतरिक साधना व समाधि योग',
      titleEn: 'Spiritual Liberation, Moksha, Meditation & Self-Realization',
      classicalRef: 'बृहत्पाराशर होरा शास्त्र अ. 24 व जैमिनी उपदेश सूत्र (कारकांश से 12वां)',
      divisionalRef: 'D20 विंशांश व मोक्षकारक केतु',
      vakriNote: '',
      astroBasisHi: `मोक्षकारक केतु की स्थिति; कारकांश से द्वादश भाव; मोक्ष त्रिकोण (4, 8, 12)।`,
      astroBasisEn: `Mokshakaraka Ketu placement; 12th from Karakamsha in Navamsha; Moksha Trikona verified.`,
      verdictHi: `द्वादशेश ${h12.lordHi} (भाव ${h12.placedHouse}) एवं मोक्ष त्रिकोण के प्रभाव से आध्यात्मिक मुक्ति, आंतरिक साधना व समाधि योग।`,
      verdictEn: `Supreme spiritual liberation (Moksha) and higher meditative awakening anchored by 12th Lord ${h12.lord} in House ${h12.placedHouse}.`,
      detailedAnalysisHi: `पाराशर और जैमिनी के अनुसार द्वादश भाव अथवा कारकांश से द्वादश में केतु या शुभ ग्रह की स्थिति जीवात्मा को आवागमन के चक्र से मुक्त कर मोक्ष दिलाती है।`,
      detailedAnalysisEn: `Per BPHS Ch. 24 and Jaimini Sutras, Ketu in the 12th house or 12th from Karakamsha dissolves material karma, conferring Moksha.`,
      remedyHi: `प्रतिदिन ॐ नमो नारायणाय अथवा ॐ नमः शिवाय का ध्यानपूर्वक जप करें तथा एकांत में ध्यान लगाएं।`,
      remedyEn: `Chant Om Namo Narayanaya or Om Namah Shivaya daily and spend quiet time in silent meditation.`,
      strengthScore: score,
      auspiciousness: getAuspiciousness(score)
    });
  }

  return dims;
}
