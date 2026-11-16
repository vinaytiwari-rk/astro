import {
  DIVISIONAL_META,
  NAKSHATRAS,
  NINE_GRAHAS,
  SEVEN_PLANETS,
  SIGNS,
  VIMSHOTTARI_ORDER,
  VIMSHOTTARI_YEARS,
} from '../constants';
import {
  computeHigherDivisionalCharts,
  HIGHER_VARGA_META,
  type HigherVargaChart,
  type HigherVargaId,
} from '../higherVargas';
import { computeChartYutiReport } from './yutiPredictions';
import { computeDivisionalYogas, type DivisionalYogaItem } from '../divisionalYogas';
import { evaluateDignity } from '../vargas';
import type {
  ChartData,
  DivisionalChart,
  DivisionalChartId,
  DignityLevel,
  NineGrahaId,
  PlanetId,
  SevenPlanetId,
} from '../types';

export interface VargaPlacementItem {
  id: PlanetId | 'Asc';
  nameEn: string;
  nameHi: string;
  signIndex: number;
  signNameEn: string;
  signNameHi: string;
  houseFromLagna: number;
  dignity: DignityLevel;
  isRetrograde?: boolean;
  isCombust?: boolean;
  isVargottama?: boolean;
  dms?: string;
  nakshatraName?: string;
  pada?: number;
  specialBadge?: string;
}

export interface VargaStrengthAnalysis {
  score: number; // 0..100
  verdictEn: string;
  verdictHi: string;
  kendraCount: number;
  trikonaCount: number;
  dusthanaCount: number;
  exaltedCount: number;
  debilitatedCount: number;
  vargottamaCount: number;
  favorablePlanets: string[];
  afflictedPlanets: string[];
}

export interface VargaYutiItem {
  house: number;
  signNameEn: string;
  signNameHi: string;
  planets: string[];
  nameEn: string;
  nameHi: string;
  impactEn: string;
  impactHi: string;
  isBenefic: boolean;
}

export interface VargaDashaAlignment {
  mdLord: string;
  mdHouse: number;
  mdDignity: string;
  adLord?: string;
  adHouse?: number;
  adDignity?: string;
  pdLord?: string;
  pdHouse?: number;
  sookshmaLord?: string;
  alignmentEffectEn: string;
  alignmentEffectHi: string;
}

export interface VargaGocharAlignment {
  saturnTransitHouse: number;
  jupiterTransitHouse: number;
  rahuTransitHouse: number;
  gocharVerdictEn: string;
  gocharVerdictHi: string;
}

export interface VargaPredictionDetail {
  vargaId: string;
  divisionNumber: number;
  nameEn: string;
  nameHi: string;
  sanskritName: string;
  significationEn: string;
  significationHi: string;
  classicalSource: string;
  shlokaRef?: string;
  verdictEn: string;
  verdictHi: string;
  detailedAnalysisEn: string[];
  detailedAnalysisHi: string[];
  conditionalBranchesEn: Array<{ condition: string; outcome: string }>;
  conditionalBranchesHi: Array<{ condition: string; outcome: string }>;
  remediesEn: string[];
  remediesHi: string[];
}

export interface CompleteVargaPageData {
  vargaId: string;
  divisionNumber: number;
  nameEn: string;
  nameHi: string;
  sanskritName: string;
  significationEn: string;
  significationHi: string;
  lagnaSignIndex: number;
  lagnaLord: string;
  placements: VargaPlacementItem[];
  strength: VargaStrengthAnalysis;
  yutis: VargaYutiItem[];
  yogas: DivisionalYogaItem[];
  dashaAlignment: VargaDashaAlignment;
  gocharAlignment: VargaGocharAlignment;
  prediction: VargaPredictionDetail;
}

// All 28 Varga IDs in exact classical sequence from D1 to D360
export const ALL_VARGA_PAGE_IDS: string[] = [
  'D1',
  'D2',
  'D3',
  'D4',
  'D5',
  'D6',
  'D7',
  'D8',
  'D9',
  'D10',
  'D11',
  'D12',
  'D16',
  'D20',
  'D24',
  'D27',
  'D30',
  'D40',
  'D45',
  'D60',
  'D64',
  'D72',
  'D81',
  'D108',
  'D144',
  'D150',
  'D300',
  'D360',
];

const PLANET_NAMES_HI: Record<string, string> = {
  Asc: 'लग्न',
  Sun: 'सूर्य',
  Moon: 'चंद्र',
  Mars: 'मंगल',
  Mercury: 'बुध',
  Jupiter: 'बृहस्पति (गुरु)',
  Venus: 'शुक्र',
  Saturn: 'शनि',
  Rahu: 'राहु',
  Ketu: 'केतु',
  Uranus: 'अरुण (Uranus)',
  Neptune: 'वरुण (Neptune)',
  Pluto: 'यम (Pluto)',
};

const PLANET_NAMES_EN: Record<string, string> = {
  Asc: 'Ascendant',
  Sun: 'Sun',
  Moon: 'Moon',
  Mars: 'Mars',
  Mercury: 'Mercury',
  Jupiter: 'Jupiter',
  Venus: 'Venus',
  Saturn: 'Saturn',
  Rahu: 'Rahu',
  Ketu: 'Ketu',
  Uranus: 'Uranus',
  Neptune: 'Neptune',
  Pluto: 'Pluto',
};

const SIGN_NAMES_HI = [
  'मेष (Aries)',
  'वृषभ (Taurus)',
  'मिथुन (Gemini)',
  'कर्क (Cancer)',
  'सिंह (Leo)',
  'कन्या (Virgo)',
  'तुला (Libra)',
  'वृश्चिक (Scorpio)',
  'धनु (Sagittarius)',
  'मकर (Capricorn)',
  'कुंभ (Aquarius)',
  'मीन (Pisces)',
];

const SIGN_NAMES_EN = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

export function computeCompleteVargaPageData(
  chart: ChartData,
  vargaId: string,
  gocharChart?: ChartData
): CompleteVargaPageData {
  const isHigherVarga = [
    'D64',
    'D72',
    'D81',
    'D108',
    'D144',
    'D150',
    'D300',
    'D360',
  ].includes(vargaId);

  let division = 1;
  let nameEn = 'Rasi (D-1)';
  let nameHi = 'लग्न कुंडली (D-1)';
  let sanskritName = 'Rasi';
  let significationEn = 'Physical body, general life & core destiny';
  let significationHi = 'स्थूल शरीर, सामान्य जीवन, स्वास्थ्य व मूल प्रारब्ध';
  let lagnaSignIndex = chart.ascendant.signIndex;

  // Extract raw placements
  type RawPl = {
    id: PlanetId | 'Asc';
    signIndex: number;
    houseFromVargaLagna: number;
    dignity: DignityLevel;
    isRetrograde?: boolean;
    isCombust?: boolean;
    dms?: string;
    specialBadge?: string;
  };
  let rawPlacements: RawPl[] = [];

  if (isHigherVarga) {
    const higherCharts = computeHigherDivisionalCharts(chart);
    const hChart = higherCharts[vargaId as HigherVargaId];
    const meta = HIGHER_VARGA_META.find((m) => m.id === vargaId);
    if (meta) {
      division = meta.division;
      nameEn = meta.nameEn;
      nameHi = meta.nameHi;
      sanskritName = meta.sanskrit;
      significationEn = meta.significationEn;
      significationHi = meta.significationHi;
    }
    if (hChart) {
      lagnaSignIndex = hChart.lagnaSignIndex;
      rawPlacements = hChart.placements.map((pl) => ({
        id: pl.id,
        signIndex: pl.vargaSignIndex,
        houseFromVargaLagna: pl.houseFromVargaLagna,
        dignity: pl.dignity,
        isRetrograde: pl.isRetrograde,
        isCombust: pl.isCombust,
        dms: pl.vargaDms,
        specialBadge: pl.amsaName,
      }));
    }
  } else if (vargaId === 'D1') {
    division = 1;
    nameEn = 'Rasi (D-1)';
    nameHi = 'लग्न कुंडली (D-1)';
    sanskritName = 'Rasi';
    significationEn = 'Physical body, general vitality, constitution & core life blueprint';
    significationHi = 'स्थूल शरीर, प्राण शक्ति, शारीरिक गठन, स्वभाव व मूल जीवन चक्र';
    lagnaSignIndex = chart.ascendant.signIndex;

    rawPlacements = [
      {
        id: 'Asc',
        signIndex: chart.ascendant.signIndex,
        houseFromVargaLagna: 1,
        dignity: 'Own Sign',
        dms: chart.ascendant.dms,
      },
      ...chart.planets.map((p) => ({
        id: p.id,
        signIndex: p.signIndex,
        houseFromVargaLagna: p.houseNumber,
        dignity: p.dignity,
        isRetrograde: p.isRetrograde,
        isCombust: p.isCombust,
        dms: p.dms,
      })),
    ];
  } else {
    const stdChart = chart.divisionalCharts[vargaId as DivisionalChartId];
    const meta = DIVISIONAL_META.find((m) => m.id === vargaId);
    if (meta) {
      division = meta.division;
      nameEn = `${meta.name} (${meta.id})`;
      nameHi = `${meta.sanskritName} (${meta.id})`;
      sanskritName = meta.sanskritName;
      significationEn = meta.signification;
      significationHi = meta.signification;
    }
    if (stdChart) {
      lagnaSignIndex = stdChart.lagnaSignIndex;
      rawPlacements = stdChart.placements.map((pl) => {
        const nat = chart.planets.find((x) => x.id === pl.id);
        return {
          id: pl.id,
          signIndex: pl.signIndex,
          houseFromVargaLagna: pl.houseFromVargaLagna,
          dignity: pl.dignity,
          isRetrograde: nat?.isRetrograde,
          isCombust: nat?.isCombust,
        };
      });
    }
  }

  // Build clean placements table
  const lagnaLord = SIGNS[lagnaSignIndex].lord;
  const placements: VargaPlacementItem[] = rawPlacements.map((p) => {
    const isVargottama =
      p.id === 'Asc'
        ? chart.ascendant.signIndex === p.signIndex
        : chart.planets.find((x) => x.id === p.id)?.signIndex === p.signIndex;

    const nat = p.id === 'Asc' ? chart.ascendant : chart.planets.find((x) => x.id === p.id);

    return {
      id: p.id,
      nameEn: PLANET_NAMES_EN[p.id] || p.id,
      nameHi: PLANET_NAMES_HI[p.id] || p.id,
      signIndex: p.signIndex,
      signNameEn: SIGN_NAMES_EN[p.signIndex],
      signNameHi: SIGN_NAMES_HI[p.signIndex],
      houseFromLagna: p.houseFromVargaLagna,
      dignity: p.dignity,
      isRetrograde: p.isRetrograde,
      isCombust: p.isCombust,
      isVargottama,
      dms: p.dms || nat?.dms,
      nakshatraName: nat?.nakshatraName,
      pada: nat?.pada,
      specialBadge: p.specialBadge,
    };
  });

  // Calculate Strength
  let kendraCount = 0;
  let trikonaCount = 0;
  let dusthanaCount = 0;
  let exaltedCount = 0;
  let debilitatedCount = 0;
  let vargottamaCount = 0;
  const favorablePlanets: string[] = [];
  const afflictedPlanets: string[] = [];

  for (const pl of placements) {
    if (pl.id === 'Asc') continue;
    if ([1, 4, 7, 10].includes(pl.houseFromLagna)) kendraCount++;
    if ([5, 9].includes(pl.houseFromLagna)) trikonaCount++;
    if ([6, 8, 12].includes(pl.houseFromLagna)) dusthanaCount++;
    if (pl.dignity === 'Exalted') exaltedCount++;
    if (pl.dignity === 'Debilitated') debilitatedCount++;
    if (pl.isVargottama) vargottamaCount++;

    if (
      ['Exalted', 'Moolatrikona', 'Own Sign', 'Great Friend', 'Friend'].includes(pl.dignity) &&
      ![6, 8, 12].includes(pl.houseFromLagna)
    ) {
      favorablePlanets.push(pl.nameHi);
    } else if (
      pl.dignity === 'Debilitated' ||
      pl.isCombust ||
      [6, 8, 12].includes(pl.houseFromLagna)
    ) {
      afflictedPlanets.push(pl.nameHi);
    }
  }

  const rawScore =
    50 +
    kendraCount * 4 +
    trikonaCount * 6 +
    exaltedCount * 10 +
    vargottamaCount * 7 -
    dusthanaCount * 4 -
    debilitatedCount * 8;
  const score = Math.max(25, Math.min(96, rawScore));

  const verdictEn =
    score >= 75
      ? 'Highly Fortified & Auspicious Harmonic Balance'
      : score >= 55
      ? 'Moderately Strong & Fruitful with Steady Effort'
      : 'Requires Conscious Shastric Remediation & Vigilance';

  const verdictHi =
    score >= 75
      ? 'अति सुदृढ़, शुभ एवं सामर्थ्यवान वर्ग स्थिति'
      : score >= 55
      ? 'मध्यम बलवान, निरंतर प्रयास से शुभ फल प्रदाता'
      : 'चुनौतीपूर्ण वर्ग स्थिति, शास्त्रीय उपाय व सावधानी अपेक्षित';

  const strength: VargaStrengthAnalysis = {
    score,
    verdictEn,
    verdictHi,
    kendraCount,
    trikonaCount,
    dusthanaCount,
    exaltedCount,
    debilitatedCount,
    vargottamaCount,
    favorablePlanets,
    afflictedPlanets,
  };

  // Conjunctions (Yutis) in this Varga
  const yutis: VargaYutiItem[] = [];
  const houseMap = new Map<number, VargaPlacementItem[]>();
  for (const pl of placements) {
    if (pl.id === 'Asc') continue;
    const list = houseMap.get(pl.houseFromLagna) || [];
    list.push(pl);
    houseMap.set(pl.houseFromLagna, list);
  }

  houseMap.forEach((plList, house) => {
    if (plList.length >= 2) {
      const names = plList.map((p) => p.nameHi);
      const enNames = plList.map((p) => p.nameEn);
      const signNameHi = plList[0].signNameHi;
      const signNameEn = plList[0].signNameEn;
      const hasJupiter = plList.some((p) => p.id === 'Jupiter');
      const hasSaturn = plList.some((p) => p.id === 'Saturn');
      const hasRahu = plList.some((p) => p.id === 'Rahu');
      const isBenefic = hasJupiter || (!hasSaturn && !hasRahu);

      let yutiNameHi = `${names.join(' + ')} युति`;
      let yutiNameEn = `${enNames.join(' + ')} Conjunction`;

      if (plList.some((p) => p.id === 'Sun') && plList.some((p) => p.id === 'Mercury')) {
        yutiNameHi = 'बुधादित्य युति (Budhaditya)';
        yutiNameEn = 'Budhaditya Yoga';
      } else if (plList.some((p) => p.id === 'Jupiter') && plList.some((p) => p.id === 'Moon')) {
        yutiNameHi = 'गजकेसरी सदृश युति (Gajakesari Resonance)';
        yutiNameEn = 'Gajakesari Resonance';
      }

      yutis.push({
        house,
        signNameEn,
        signNameHi,
        planets: names,
        nameEn: yutiNameEn,
        nameHi: yutiNameHi,
        impactEn: `In House ${house} (${signNameEn}), the union of ${enNames.join(
          ' and '
        )} exerts direct harmonic focus upon this varga's domain.`,
        impactHi: `भाव ${house} (${signNameHi}) में ${names.join(
          ' तथा '
        )} का संयोग इस वर्ग के फल को विशिष्ट रूप से प्रभावित करता है।`,
        isBenefic,
      });
    }
  });

  // Divisional Yogas
  const yogas = computeDivisionalYogas(chart, vargaId);

  // Active Dasha alignment in this Varga
  const nowMs = Date.now();
  const activeMaha = chart.vimshottari.find((m) => nowMs >= m.startMs && nowMs <= m.endMs);
  const activeAntar = activeMaha?.children?.find((a) => nowMs >= a.startMs && nowMs <= a.endMs);
  const activePratyantar = activeAntar?.children?.find(
    (p) => nowMs >= p.startMs && nowMs <= p.endMs
  );
  const activeSookshma = activePratyantar?.children?.find(
    (s) => nowMs >= s.startMs && nowMs <= s.endMs
  );

  const mdLord = activeMaha?.lord || 'Saturn';
  const adLord = activeAntar?.lord || 'Mercury';
  const pdLord = activePratyantar?.lord || 'Venus';
  const sookshmaLord = activeSookshma?.lord;

  const mdPl = placements.find((p) => p.id === mdLord);
  const adPl = placements.find((p) => p.id === adLord);
  const pdPl = placements.find((p) => p.id === pdLord);

  const mdHouse = mdPl?.houseFromLagna || 1;
  const mdDignity = mdPl?.dignity || 'Neutral';
  const adHouse = adPl?.houseFromLagna;
  const adDignity = adPl?.dignity;
  const pdHouse = pdPl?.houseFromLagna;

  const dashaEffectEn = `Current Mahadasha Lord ${mdLord} sits in House ${mdHouse} (${mdDignity}) of this ${nameEn}, indicating that active time cycles directly trigger this varga's life themes.`;
  const dashaEffectHi = `वर्तमान महादशा स्वामी ${PLANET_NAMES_HI[mdLord] || mdLord} इस ${nameHi} के भाव ${mdHouse} में (${mdDignity}) स्थित हैं। यह दर्शाता है कि सक्रिय दशा काल इस वर्ग के जीवन-क्षेत्र को प्रत्यक्ष रूप से फलित कर रहा है।`;

  const dashaAlignment: VargaDashaAlignment = {
    mdLord,
    mdHouse,
    mdDignity,
    adLord,
    adHouse,
    adDignity,
    pdLord,
    pdHouse,
    sookshmaLord,
    alignmentEffectEn: dashaEffectEn,
    alignmentEffectHi: dashaEffectHi,
  };

  // Gochar alignment in this Varga
  let saturnTransitHouse = 1;
  let jupiterTransitHouse = 1;
  let rahuTransitHouse = 1;

  if (gocharChart) {
    const gSat = gocharChart.planets.find((p) => p.id === 'Saturn');
    const gJup = gocharChart.planets.find((p) => p.id === 'Jupiter');
    const gRah = gocharChart.planets.find((p) => p.id === 'Rahu');

    if (gSat) {
      saturnTransitHouse = ((gSat.signIndex - lagnaSignIndex + 12) % 12) + 1;
    }
    if (gJup) {
      jupiterTransitHouse = ((gJup.signIndex - lagnaSignIndex + 12) % 12) + 1;
    }
    if (gRah) {
      rahuTransitHouse = ((gRah.signIndex - lagnaSignIndex + 12) % 12) + 1;
    }
  }

  const gocharVerdictEn = `Live Gochar shows Jupiter transiting House ${jupiterTransitHouse} and Saturn in House ${saturnTransitHouse} from this varga's Lagna, shaping current karmic manifestation.`;
  const gocharVerdictHi = `वर्तमान गोचर में देवगुरु बृहस्पति इस वर्ग लग्न से भाव ${jupiterTransitHouse} में एवं शनि भाव ${saturnTransitHouse} में संचरण कर रहे हैं, जो इस वर्ग के फलों को सक्रिय कर रहे हैं।`;

  const gocharAlignment: VargaGocharAlignment = {
    saturnTransitHouse,
    jupiterTransitHouse,
    rahuTransitHouse,
    gocharVerdictEn,
    gocharVerdictHi,
  };

  // Generate deep domain-specific predictions for this Varga
  const prediction = generateDomainSpecificVargaPrediction(
    chart,
    vargaId,
    division,
    nameEn,
    nameHi,
    sanskritName,
    significationEn,
    significationHi,
    lagnaSignIndex,
    placements,
    strength,
    dashaAlignment,
    gocharAlignment
  );

  return {
    vargaId,
    divisionNumber: division,
    nameEn,
    nameHi,
    sanskritName,
    significationEn,
    significationHi,
    lagnaSignIndex,
    lagnaLord,
    placements,
    strength,
    yutis,
    yogas,
    dashaAlignment,
    gocharAlignment,
    prediction,
  };
}

function generateDomainSpecificVargaPrediction(
  chart: ChartData,
  vargaId: string,
  division: number,
  nameEn: string,
  nameHi: string,
  sanskritName: string,
  significationEn: string,
  significationHi: string,
  lagnaSignIndex: number,
  placements: VargaPlacementItem[],
  strength: VargaStrengthAnalysis,
  dasha: VargaDashaAlignment,
  gochar: VargaGocharAlignment
): VargaPredictionDetail {
  const lagnaLord = SIGNS[lagnaSignIndex].lord;
  const lagnaLordPl = placements.find((p) => p.id === lagnaLord);
  const jupiterPl = placements.find((p) => p.id === 'Jupiter');
  const venusPl = placements.find((p) => p.id === 'Venus');
  const saturnPl = placements.find((p) => p.id === 'Saturn');
  const sunPl = placements.find((p) => p.id === 'Sun');
  const moonPl = placements.find((p) => p.id === 'Moon');
  const marsPl = placements.find((p) => p.id === 'Mars');
  const mercuryPl = placements.find((p) => p.id === 'Mercury');

  let classicalSource = 'बृहत्पाराशर होराशास्त्र (Brihat Parashara Hora Shastra) वर्ग-विवेचन';
  let shlokaRef = 'वर्गेषु बलवान् खेटः संपूर्णं फलमादिशेत्। हीनबलो न कुर्याच्च मिश्रितं मध्यमं फलम्॥';
  let verdictEn = `The harmonic resonance of ${nameEn} is anchored with ${strength.score}% shastric strength.`;
  let verdictHi = `${nameHi} का शास्त्रीय सामर्थ्य ${strength.score}% है। ${strength.verdictHi}`;

  const detailedAnalysisEn: string[] = [];
  const detailedAnalysisHi: string[] = [];
  const conditionalBranchesEn: Array<{ condition: string; outcome: string }> = [];
  const conditionalBranchesHi: Array<{ condition: string; outcome: string }> = [];
  const remediesEn: string[] = [];
  const remediesHi: string[] = [];

  // Varga-Specific Branching Logic
  switch (vargaId) {
    case 'D1': {
      classicalSource = 'बृहत्पाराशर होराशास्त्र Ch. 12 (तनुलग्नाध्याय) व फलदीपिका';
      shlokaRef = 'लग्नेशे बलसंयुक्ते देहारोग्यं सुखं महत्। नीचद्वेष्यगते वाऽपि तनुपीडा भवेद्ध्रुवम्॥';
      verdictEn = `Lagna Lord ${lagnaLord} in House ${lagnaLordPl?.houseFromLagna || 1} (${lagnaLordPl?.dignity}) establishes strong vitality, willpower, and personal authority.`;
      verdictHi = `लग्नेश ${PLANET_NAMES_HI[lagnaLord]} भाव ${lagnaLordPl?.houseFromLagna || 1} में (${lagnaLordPl?.dignity}) स्थित होकर सुदृढ़ जीवन शक्ति, आत्मसम्मान व दीर्घायु प्रदान करते हैं।`;

      detailedAnalysisHi.push(
        `लग्न भाव (${SIGN_NAMES_HI[lagnaSignIndex]}): शरीर सौष्ठव, मानसिक तेज व स्वतंत्र निर्णय क्षमता का आधार लग्न बलवान है।`,
        `लग्नेश की स्थिति: ${PLANET_NAMES_HI[lagnaLord]} का स्थान जातक को जीवन के प्रमुख अवसरों पर स्वाभाविक नेतृत्व शक्ति देता है।`,
        `केंद्र-त्रिकोण बल: कुल ${strength.kendraCount} ग्रह केंद्र में तथा ${strength.trikonaCount} ग्रह त्रिकोण में स्थित होकर लग्न चक्र को सुदृढ़ बनाते हैं।`
      );
      detailedAnalysisEn.push(
        `Ascendant Sign (${SIGN_NAMES_EN[lagnaSignIndex]}): Anchors physical constitution, intellectual radiance, and independent executive judgment.`,
        `Lagna Lord Placed in House ${lagnaLordPl?.houseFromLagna}: Bestows resilience to bounce back from adversity and command respect.`,
        `Angular & Trinal Balance: ${strength.kendraCount} planets occupy Kendras and ${strength.trikonaCount} occupy Trikonas, fortifying life purpose.`
      );

      conditionalBranchesHi.push(
        { condition: 'महादशा स्वामी की अनुकूलता', outcome: 'महादशा स्वामी शुभ भाव में होने पर स्वास्थ्य व ख्याति में तीव्र वृद्धि होती है।' },
        { condition: 'गोचर शनि का प्रभाव', outcome: 'शनि के गोचर के दौरान नियमित दिनचर्या व अनुशासन रखने पर ही दीर्घकालीन सिद्धि प्राप्त होती है।' }
      );
      conditionalBranchesEn.push(
        { condition: 'During Supportive Dasha Periods', outcome: 'Enhances physical stamina, career recognition, and personal authority.' },
        { condition: 'Under Heavy Saturn Transits', outcome: 'Demands strict lifestyle discipline, satvik diet, and routine medical care.' }
      );

      remediesHi.push(
        'नित्य प्रातः सूर्य नमस्कार करें एवं तांबे के लोटे से सूर्य देव को जल अर्पित करें।',
        'लग्नेश के बीज मंत्र का नियमित 108 बार जप करें।'
      );
      remediesEn.push(
        'Offer water to the rising Sun daily in a copper vessel with Gayatri Mantra.',
        'Chant the Beej Mantra of your Lagna Lord regularly for vitality.'
      );
      break;
    }

    case 'D2': {
      classicalSource = 'बृहत्पाराशर होराशास्त्र Ch. 6 (होराध्याय) व सारावली';
      shlokaRef = 'सूर्यहोरागताः क्रूराश्चन्द्रहोरागताः शुभाः। शुभग्रहाः शुभाः प्रोक्ताः संपदो वित्तदायकाः॥';
      verdictEn = 'Hora D-2 governs liquid assets, accumulated wealth, treasury reserves, and financial sustainability.';
      verdictHi = 'होरा (D-2) संचित धन, बैंक बैलेंस, पारिवारिक संपदा व वित्तीय स्थिरता का मुख्य चक्र है।';

      detailedAnalysisHi.push(
        `होरा लग्न व धनाध्यक्ष: द्वितीयेश व गुरु का संबंध यह सुनिश्चित करता है कि जातक संचित धन का उचित प्रबंधन कर सके।`,
        `सूर्य होरा बनाम चंद्र होरा: पुरुष ग्रह सूर्य होरा में आत्मनिर्भर पुरुषार्थ से धन दिलाते हैं, जबकि सौम्य ग्रह चंद्र होरा में सहज प्रवाह व व्यापारिक लाभ प्रदान करते हैं।`,
        `स्थाई कोष सामर्थ्य: कुल ${strength.favorablePlanets.length} ग्रह धन वृद्धि के अनुकूल स्थितियों में स्थित हैं।`
      );
      detailedAnalysisEn.push(
        `Wealth Treasury & Liquid Capital: Ruled by D2 Hora divisions, determining the native's capacity to accumulate bank balance.`,
        `Solar vs Lunar Hora Split: Solar hora favors active enterprise, investments, and grit; Lunar hora favors liquid wealth, real estate, and trade.`,
        `Financial Capacity Index: ${strength.score}% strength confirms dependable capital preservation and sustained cash flow.`
      );

      conditionalBranchesHi.push(
        { condition: 'द्वितीयेश का दशमेश से संबंध', outcome: 'व्यापार अथवा उच्च पद से निरंतर स्थाई धन का आगम बना रहता है।' },
        { condition: 'राहु या व्ययेश की दृष्टि होने पर', outcome: 'सट्टेबाजी व शेयर बाज़ार में बिना शोध के निवेश करने पर धन हानि से सावधान रहें।' }
      );
      conditionalBranchesEn.push(
        { condition: 'When Wealth Lord aspects Career Houses', outcome: 'Generates substantial recurring income through business or leadership.' },
        { condition: 'Under Unvetted Speculative Urges', outcome: 'Avoid impulsive crypto/gambling speculations; focus on sovereign assets.' }
      );

      remediesHi.push(
        'प्रति शुक्रवार कनकधारा स्तोत्र अथवा श्री सूक्त का पाठ करें।',
        'तिजोरी में पीला रेशमी वस्त्र बिछाकर 5 गोमती चक्र व 1 एकाक्षी नारियल रखें।'
      );
      remediesEn.push(
        'Recite Kanakadhara Stotram or Sri Suktam on Friday evenings.',
        'Keep a yellow silk cloth with 5 Gomati Chakras in your treasury safe.'
      );
      break;
    }

    case 'D3': {
      classicalSource = 'बृहत्पाराशर होराशास्त्र Ch. 7 (द्रेष्काणाध्याय) व जातक पारिजात';
      shlokaRef = 'द्रेष्काणे सोदराणां च विचारः क्रियते बुधैः। तृतीयेशे बलोपेते सोदराणां सुखं भवेत्॥';
      verdictEn = 'Drekkana D-3 governs siblings, courage, physical valor, and brotherhood dynamics vs Only Child status.';
      verdictHi = 'द्रेष्काण (D-3) पराक्रम, अनुज व अग्रज भ्राता-भगिनी सुख, साहस एवं एकल संतान परीक्षा का मुख्य वर्ग है।';

      detailedAnalysisHi.push(
        `तृतीय भाव व मंगल की स्थिति: मंगल और द्रेष्काण लग्न का संबंध जातक के भीतर असीम साहस व संकट से लड़ने की शक्ति भरता है।`,
        `भाई-बहन की स्थिति: द्रेष्काण में तृतीयेश व एकादशेश की शुभ स्थिति से भाई-बहनों का सहयोग अथवा एकल संतान (Only Child) की विशिष्ट स्थिति का निर्धारण होता है।`,
        `पराक्रम व उद्यम: द्रेष्काण में शुभ ग्रह उपस्थित होने पर जातक अपनी बाहुबल व कौशल से समाज में प्रतिष्ठित होता है।`
      );
      detailedAnalysisEn.push(
        `Courage & Initiative: Drekkana measures innate grit, risk appetite, and physical fearlessness in crises.`,
        `Siblings vs Only-Child Reality: Auspicious placement of Mars and 3rd/11th lords confirms fraternal solidarity or clear only-child independence.`,
        `Executive Undertakings: Auspicious varga strength ensures triumphant completion of ventures undertaken by self-effort.`
      );

      conditionalBranchesHi.push(
        { condition: 'यदि जातक एकल संतान (Only Child) है', outcome: 'माता-पिता का संपूर्ण उत्तरदायित्व स्वयं वहन करते हुए जातक आत्मनिर्भर महापुरुष बनता है।' },
        { condition: 'यदि भाई-बहन उपस्थित हैं', outcome: 'प्रारंभिक प्रतिस्पर्धा के उपरांत परिपक्व अवस्था में भाई-बहनों से घनिष्ठ वैचारिक तालमेल रहता है।' }
      );
      conditionalBranchesEn.push(
        { condition: 'If Native is an Only Child', outcome: 'Shoulders family legacy independently with unmatched inner strength and self-reliance.' },
        { condition: 'If Siblings Exist', outcome: 'Mutual support and fraternal collaboration strengthen after young adulthood.' }
      );

      remediesHi.push(
        'प्रति मंगलवार सुंदरकांड का पाठ करें अथवा 11 बार हनुमान चालीसा पढ़ें।',
        'छोटे भाइयों व सहकर्मियों का सम्मान करें एवं उनकी शिक्षा में सहयोग करें।'
      );
      remediesEn.push(
        'Recite Sundarkand or Hanuman Chalisa on Tuesdays for courage and protection.',
        'Support and respect younger siblings and subordinates.'
      );
      break;
    }

    case 'D4': {
      classicalSource = 'बृहत्पाराशर होराशास्त्र (चतुर्थांशाध्याय) व फलदीपिका';
      shlokaRef = 'चतुर्थांशे गृहं प्रोक्तं भाग्यं चैव सुखानि च। चतुर्थेशे बलयुते प्रासादभवनादिकम्॥';
      verdictEn = 'Chaturthamsha D-4 governs fixed assets, landed property, palatial homes, vehicles, and enduring domestic peace.';
      verdictHi = 'चतुर्मांश (D-4) अचल संपत्ति, भूमि, भवन, गृह सुख, वाहन एवं स्थाई भाग्य का नियंत्रक वर्ग है।';

      detailedAnalysisHi.push(
        `गृह व भूमि सुख: चतुर्थांश लग्न व चतुर्थेश का बल जातक के स्वयं के स्वामित्व वाले आवास व भूमि संपदा का मार्ग प्रशस्त करता है।`,
        `माता व गृह शांति: इस चक्र में शुक्र व चंद्र की स्थिति घर में सुख-शांति, मातृ सुख एवं सुरुचिपूर्ण साज-सज्जा को दर्शाती है।`,
        `स्थाई संपत्ति संचय: कुल ${strength.score}% सामर्थ्य यह दर्शाता है कि जातक जीवन में एक से अधिक संपत्तियां अर्जित करेगा।`
      );
      detailedAnalysisEn.push(
        `Fixed Real Estate Assets: D-4 dictates ownership of residential homes, land parcels, and real estate investments.`,
        `Domestic Contentment: Harmonious lunar and Venusian placements foster mental peace, luxurious dwellings, and familial joy.`,
        `Asset Accumulation Index: Confirms solid potential for multiple residential and commercial property acquisitions.`
      );

      conditionalBranchesHi.push(
        { condition: 'चतुर्थेश का केंद्र में होना', outcome: 'जीवन के 32वें से 42वें वर्ष के मध्य शानदार निजी गृह व संपत्ति का निर्माण होता है।' },
        { condition: 'यदि 4th में क्रूर ग्रह हों', outcome: 'पैतृक संपत्ति में हिस्सेदारी को लेकर पारिवारिक कागजात व वसीयत को अत्यंत स्पष्ट रखें।' }
      );
      conditionalBranchesEn.push(
        { condition: 'When 4th Lord occupies Kendra', outcome: 'Guarantees magnificent personal residential home ownership between ages 32 and 42.' },
        { condition: 'If Malefic Affliction Exists', outcome: 'Maintain flawless legal documentation to avoid property demarcation disputes.' }
      );

      remediesHi.push(
        'घर के ईशान कोण (North-East) को सदैव स्वच्छ, जल पात्र व पूजा स्थान से सुसज्जित रखें।',
        'भूमि पूजन के समय गाय को गुड़ व चना खिलाएं।'
      );
      remediesEn.push(
        'Keep the North-East quadrant of your home clutter-free and serene.',
        'Donate building materials or feed cows when acquiring new properties.'
      );
      break;
    }

    case 'D7': {
      classicalSource = 'बृहत्पाराशर होराशास्त्र Ch. 8 (सप्तमांशाध्याय) व सारावली';
      shlokaRef = 'सप्तमांशे सुतानां तु चिन्तनं क्रियते सदा। पञ्चमेशे सुहृद्गेहे सुपुत्रफलमादिशेत्॥';
      verdictEn = 'Saptamsha D-7 governs progeny, children happiness, lineage continuation vs child-free reality.';
      verdictHi = 'सप्तमांश (D-7) संतान सुख, कुल वृद्धि, वंश परंपरा एवं निःसंतानता अथवा संतति-मुक्त जीवन का निर्णायक वर्ग है।';

      detailedAnalysisHi.push(
        `संतान सुख व पंचमेश: सप्तमांश में गुरु व पंचम भाव की स्थिति संतान के जन्म, उनकी शिक्षा व उनकी उपलब्धियों का निर्धारण करती है।`,
        `निःसंतानता बनाम संतान सुख: यदि सप्तमांश में शुभ ग्रहों का प्रभाव है तो संस्कारवान संतान से कुल का नाम रोशन होता है; यदि पाप प्रभाव हो तो संतान-मुक्त (Child-Free) या विलंबित संतान योग बनता है।`,
        `रचनात्मक वंश परंपरा: यह चक्र जातक की बौद्धिक व रचनात्मक कृतियों (Creative Legacy) को भी अमर बनाता है।`
      );
      detailedAnalysisEn.push(
        `Progeny & Offspring Radiance: D-7 Saptamsha reveals the destiny, intellect, and moral caliber of children.`,
        `Children vs Childlessness Reality: Strong Jupiterian and 5th house influences ensure joyful parenthood; afflictions indicate deliberate child-free lifestyles or delays.`,
        `Generational Lineage: Governs whether the native leaves lasting biological or intellectual offspring to carry forward their name.`
      );

      conditionalBranchesHi.push(
        { condition: 'संतान प्राप्ति के इच्छुक होने पर', outcome: 'गुरु की दशा अथवा गोचर अनुकूल होने पर सुसंस्कृत संतान का आगमन निश्चित होता है।' },
        { condition: 'संतान-मुक्त (Child-Free) जीवन मार्ग', outcome: 'जातक अपनी रचनात्मक ऊर्जा को समाज सेवा, ज्ञान दान व शिष्य परंपरा में समर्पित करता है।' }
      );
      conditionalBranchesEn.push(
        { condition: 'For Couples Seeking Progeny', outcome: 'Jupiter transits over 5th/9th trigger joyful conception and healthy progeny.' },
        { condition: 'For Intentionally Child-Free Natives', outcome: 'Creative life-force channels into mentoring, enterprise, philanthropy, and artistic legacy.' }
      );

      remediesHi.push(
        'संतान सुख हेतु प्रति गुरुवार संतान गोपाल स्तोत्र का पाठ करें।',
        'पीपल के वृक्ष की सेवा करें एवं विद्यार्थियों को पुस्तकें व लेखनी दान करें।'
      );
      remediesEn.push(
        'Recite Santana Gopala Stotram or Harivamsa Purana excerpts for progeny wellness.',
        'Donate educational books and stationery to underprivileged students.'
      );
      break;
    }

    case 'D9': {
      classicalSource = 'बृहत्पाराशर होराशास्त्र Ch. 9 (नवांशकाध्याय) व जातक पारिजात';
      shlokaRef = 'नवांशे कलत्रं चैव भाग्यं धर्मं च चिन्तयेत्। वर्गोत्तमे बलोपेते सर्वसौख्यं प्रजायते॥';
      verdictEn = 'Navamsha D-9 is the crown jewel of Vedic astrology, governing spouse, marriage, dharma, and destiny after age 30.';
      verdictHi = 'नवांश (D-9) वैदिक ज्योतिष की आत्मा है, जो दांपत्य सुख, विवाह बनाम ब्रह्मचर्य, भाग्य व जीवन के उत्तरार्ध का फल देती है।';

      detailedAnalysisHi.push(
        `नवांश लग्न व लग्नेश: नवांश का लग्न जातक के अंतर्मन व 30-32 वर्ष की आयु के उपरांत जागृत होने वाले वास्तविक भाग्य को दर्शाता है।`,
        `दांपत्य जीवन व सप्तमेश: सप्तमेश, शुक्र व गुरु का नवांश में शुभ होना सुसंस्कृत, गुणवान व सहयोगी जीवनसाथी की प्राप्ति का अकाट्य प्रमाण है।`,
        `वर्गोत्तम व पुष्कर स्थिति: इस कुंडली में वर्गोत्तम ग्रह जातक को संकटों से बचाने वाला अभेद्य सुरक्षा कवच प्रदान करते हैं।`
      );
      detailedAnalysisEn.push(
        `The Sovereign Soul Blueprint: Navamsha reveals the fruit (Phala) of the natal tree, blossoming fully after age 28-30.`,
        `Marital Bond & Partner Caliber: Governs the ethical, emotional, and spiritual depth of the marital partner.`,
        `Vargottama & Pushkara Resonances: Any planet occupying identical signs in D1 and D9 acts as an invincible guardian angel.`
      );

      conditionalBranchesHi.push(
        { condition: 'सदाचारी दांपत्य का मार्ग', outcome: 'विवाह के उपरांत भाग्य में तीव्र उछाल आता है और दोनों मिलकर धर्म व अर्थ का विस्तार करते हैं।' },
        { condition: 'आजीवन ब्रह्मचर्य / संन्यास / एकल जीवन', outcome: 'यदि 7th में केतु-शनि का प्रभाव हो तो जातक सांसारिक बंधनों से मुक्त होकर उच्च आध्यात्मिक शोध करता है।' }
      );
      conditionalBranchesEn.push(
        { condition: 'Path of Wedlock & Shared Dharma', outcome: 'Marriage serves as a springboard for unprecedented prosperity and mutual spiritual elevation.' },
        { condition: 'Path of Singlehood / Bachelorhood', outcome: 'Ketu/Saturn inclinations direct soul energy toward uncompromised philosophical sovereignty and freedom.' }
      );

      remediesHi.push(
        'प्रतिदिन श्री ललिता सहस्रनाम अथवा विष्णु सहस्रनाम का श्रवण या पाठ करें।',
        'गौमाता को हरा चारा एवं श्वेत मिष्ठान्न अर्पित करें।'
      );
      remediesEn.push(
        'Chant Vishnu Sahasranama or Sri Suktam for harmonizing the Navamsha soul-axis.',
        'Cultivate unwavering ethical transparency in all one-on-one relationships.'
      );
      break;
    }

    case 'D10': {
      classicalSource = 'बृहत्पाराशर होराशास्त्र Ch. 10 (दशमांशाध्याय) व फलदीपिका';
      shlokaRef = 'दशमांशे महद्दिव्यं पदं चैव प्रकीर्तितम्। दशमेशे बलोपेते राजमान्यो भवेन्नरः॥';
      verdictEn = 'Dashamsha D-10 governs career zenith, executive leadership, government job vs business, and lasting social prestige.';
      verdictHi = 'दशमांश (D-10) आजीविका, करियर, सरकारी सेवा बनाम स्वतंत्र व्यवसाय, सत्ता व सामाजिक मान-प्रतिष्ठा का महा-चक्र है।';

      detailedAnalysisHi.push(
        `दशमांश लग्न व दशमेश: कार्यक्षेत्र में सर्वोच्च पद व अधिकार का निर्धारण दशमांश के लग्न व दशम भाव से होता है।`,
        `सरकारी सेवा बनाम कॉर्पोरेट / व्यवसाय: सूर्य-गुरु का प्रभाव प्रशासनिक सत्ता (Govt Job) देता है; बुध-शुक्र स्वतंत्र स्टार्टअप व व्यवसाय; शनि-राहु विशाल बहुराष्ट्रीय कॉर्पोरेट में उच्च पद दिलाते हैं।`,
        `सिंहासन राजयोग: दशमांश में केंद्र में उच्च या स्वराशि ग्रह जातक को कार्यक्षेत्र में निर्विवाद नेता व नीति-निर्माता बनाते हैं।`
      );
      detailedAnalysisEn.push(
        `Professional Apex & Executive Authority: D-10 decodes the native's capacity to climb institutional and governmental hierarchies.`,
        `Govt vs Corporate vs Enterprise Audit: Sun/Jupiter promote public sector authority; Mercury/Venus power private commerce; Saturn/Rahu rule global corporate tech.`,
        `Throne Yoga (Simhasana): Benefics in D10 Kendras ensure sovereign leadership, policy-making authority, and industry-wide acclaim.`
      );

      conditionalBranchesHi.push(
        { condition: 'सरकारी नौकरी व प्रशासनिक सेवा', outcome: 'दशमांश में सूर्य व गुरु के बलवान होने पर राजसत्ता, लोक सेवा आयोग अथवा संवैधानिक पदों में सफलता मिलती है।' },
        { condition: 'स्वतंत्र व्यवसाय व वैश्विक व्यापार', outcome: 'बुध व सप्तमेश के बलवान होने पर जातक अपनी कंपनी स्थापित कर सैंकड़ों लोगों को रोजगार देता है।' }
      );
      conditionalBranchesEn.push(
        { condition: 'Government & Civil Service Trajectory', outcome: 'Strong Sun-Jupiter alignments trigger competitive public service breakthroughs and executive tenure.' },
        { condition: 'Independent Enterprise & Commerce', outcome: 'Strong Mercury-Venus configurations favor scaling disruptive commercial ventures.' }
      );

      remediesHi.push(
        'प्रति रविवार आदित्य हृदय स्तोत्र का 3 बार पाठ करें।',
        'कार्यस्थल पर उत्तर दिशा में कुबेर यंत्र अथवा स्फटिक श्रीयंत्र स्थापित करें।'
      );
      remediesEn.push(
        'Recite Aditya Hridaya Stotram on Sundays for commanding career authority.',
        'Keep an authentic energized Kuber Yantra or Sphatik Shri Yantra at your workstation.'
      );
      break;
    }

    case 'D12': {
      classicalSource = 'बृहत्पाराशर होराशास्त्र (द्वादशांशाध्याय) व जातक पारिजात';
      shlokaRef = 'द्वादशांशे तु पितरौ चिन्तनीयौ मनीषिभिः। नवमात् पितरं विद्याच्चतुर्थान्मातरं तथा॥';
      verdictEn = 'Dwadashamsha D-12 governs parents, paternal and maternal lineage, ancestral debts, and inherited blessings.';
      verdictHi = 'द्वादशांश (D-12) माता-पिता, पितृ-मातृ वंश, पूर्वजों के संस्कार एवं पैतृक ऋणों के निवारण का दिव्य चक्र है।';

      detailedAnalysisHi.push(
        `पिता का सुख व नवम भाव: द्वादशांश में नवम भाव व सूर्य का विश्लेषण पिता की दीर्घायु, उनके साथ वैचारिक संबंध व पैतृक संस्कारों को प्रकट करता है।`,
        `माता का स्वास्थ्य व चतुर्थ भाव: चतुर्थ भाव व चंद्र की स्थिति मातृ सुख, माता के स्वास्थ्य व उनसे प्राप्त भावनात्मक आशीर्वाद को दर्शाती है।`,
        `पितृ ऋण व वंश शुद्धि: इस वर्ग से कुल में चले आ रहे आनुवंशिक संस्कारों व पितृ शांति का स्पष्ट संकेत मिलता है।`
      );
      detailedAnalysisEn.push(
        `Paternal Lineage & Father's Bond: 9th house and Sun in D-12 reveal father's longevity, guidance, and ideological transmission.`,
        `Maternal Grace: 4th house and Moon indicate mother's health, unconditional nurturing, and emotional heritage.`,
        `Ancestral Debt Rectification: Diagnoses hereditary genetic and spiritual samskaras carried over from preceding generations.`
      );

      conditionalBranchesHi.push(
        { condition: 'पिता के साथ घनिष्ठ संबंध', outcome: 'पिता के मार्गदर्शन में जातक पैतृक प्रतिष्ठा को नई ऊंचाइयों तक पहुंचाता है।' },
        { condition: 'यदि पितृ स्थान पर क्रूर ग्रह हों', outcome: 'प्रति अमावस्या पितरों के निमित्त तर्पण, जल दान व अन्न दान करने से सभी बाधाएं दूर होती हैं।' }
      );
      conditionalBranchesEn.push(
        { condition: 'Harmonious Paternal Connection', outcome: 'Inherits ancestral wisdom, societal goodwill, and material patrimony seamlessly.' },
        { condition: 'Under Afflicted Ancestral Indicators', outcome: 'Amavasya Tarpan and charitable food donation dissolve generational bottlenecks.' }
      );

      remediesHi.push(
        'प्रतिदिन प्रातःकाल माता-पिता के चरण स्पर्श कर आशीर्वाद लें।',
        'अमावस्या को पितरों के निमित्त गाय, कुत्ते व कौवे को भोजन दें।'
      );
      remediesEn.push(
        'Touch the feet of parents daily to unlock deep ancestral blessings.',
        'Perform food donation (Anna Daan) on Amavasya days for Pitra Shanti.'
      );
      break;
    }

    case 'D60': {
      classicalSource = 'बृहत्पाराशर होराशास्त्र Ch. 6 (षष्ट्यंशाध्याय) — सर्वोपरि सूक्ष्म चक्र';
      shlokaRef = 'षष्ट्यंशे निखिलं चिन्त्यं यत्किञ्चित् भुवि वर्तते। सर्वभावेषु यो मुख्यः षष्ट्यंशः स प्रकीर्तितः॥';
      verdictEn = 'Shashtiamsha D-60 is the supreme ultimate micro-chart, disclosing past-life karma and the root cause of this birth.';
      verdictHi = 'षष्ट्यंश (D-60) पराशर ज्योतिष का सर्वोच्च सूक्ष्म चक्र है, जो संचित पूर्व-जन्म कर्म व वर्तमान जन्म के मूल उद्देश्य को उद्घाटित करता है।';

      detailedAnalysisHi.push(
        `पूर्व-जन्म का लेखा-जोखा: महर्षि पराशर के अनुसार षष्ट्यंश के बिना कोई भी फलकथन पूर्ण नहीं हो सकता; यह आत्मा के प्रारब्ध का वास्तविक दर्पण है।`,
        `देव बनाम राक्षस अंश: इस कुंडली में स्थित षष्ट्यंश देवता यह इंगित करते हैं कि जातक पूर्व जन्म के पुण्य कर्मों के प्रभाव से इस जन्म में उच्च मानवीय योनि में अवतरित हुआ है।`,
        `कर्म परिपाक: जातक के जीवन में आने वाले अप्रत्याशित सुख-दुःख इसी चक्र के सूक्ष्म ग्रहों के प्रभाव से संचालित होते हैं।`
      );
      detailedAnalysisEn.push(
        `The Sovereign Karmic Ledger: Sage Parashara declares D-60 supreme; it decodes why the soul took birth in this specific era and family.`,
        `Deva vs Rakshasa Shashtiamsha Deities: Reveals whether past incarnations accumulated Sattvic spiritual merit or unresolved debts.`,
        `Karmic Ripening: Explains sudden inexplicable strokes of divine fortune or sudden tests that cannot be seen from D1 alone.`
      );

      conditionalBranchesHi.push(
        { condition: 'शुभ षष्ट्यंश में ग्रह स्थिति', outcome: 'पूर्व जन्म का संचित तप इस जन्म में स्वाभाविक प्रतिभा, सम्मान व सुरक्षा बनकर प्रकट होता है।' },
        { condition: 'क्रूर षष्ट्यंश में ग्रह स्थिति', outcome: 'सच्चे हृदय से पश्चाताप, नियमित महामृत्युंजय जप व निष्काम कर्म से पाप नष्ट हो जाते हैं।' }
      );
      conditionalBranchesEn.push(
        { condition: 'Benefic Deva Shashtiamshas', outcome: 'Past-life spiritual tapashya manifests as unprompted genius, fame, and miraculous protection.' },
        { condition: 'Challenging Karmic Degrees', outcome: 'Maha Mrityunjaya Japa and selfless philanthropic service purify subtle karmic baggage.' }
      );

      remediesHi.push(
        'नित्य 108 बार महामृत्युंजय मंत्र का जप करें: ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात्॥',
        'प्रतिदिन मौन ध्यान व श्रीमद्भगवद्गीता के 12वें या 15वें अध्याय का पाठ करें।'
      );
      remediesEn.push(
        'Chant Maha Mrityunjaya Mantra 108 times daily for transmuting deep karmic debts.',
        'Meditate silently and recite Chapter 12 or 15 of Srimad Bhagavad Gita.'
      );
      break;
    }

    case 'D150': {
      classicalSource = 'देवकेरलम् (Deva Keralam / Chandra Kala Nadi) — नाड़ीअंश विधान';
      shlokaRef = 'नाडीअंशे विचित्राणि फलानि कथितानि वै। यस्य नाडी बलोपेता स राजा वा नृपो भवेत्॥';
      verdictEn = 'Deva Keralam Chandra-Kala Nadiamsa (D-150) differentiates twins and decodes minute sub-degree destiny trajectories.';
      verdictHi = 'चंद्रकला नाड़ी (D-150) सूक्ष्मतम नाड़ीअंश है, जो जुड़वां कुंडलियों में अंतर स्थापित करता है और पल-पल के जीवन फल को निर्धारित करता है।';

      detailedAnalysisHi.push(
        `देवकेरलम् नाड़ी रहस्य: प्रत्येक राशि के 150वें भाग (0°12′) पर आधारित यह चक्र बताता है कि आत्मा किस विशिष्ट नाड़ी अंश में अवतरित हुई है।`,
        `जुड़वां कुंडली भेदक: कुछ ही सेकंड के अंतराल से जन्म लेने वाले जुड़वा बच्चों के भाग्य में जो ज़मीन-आसमान का अंतर आता है, उसका रहस्य इसी D-150 में निहित है।`,
        `नाड़ी स्वामी का प्रभाव: नाड़ीअंश का स्वामी जातक के जीवन की निर्णायक घटनाओं के सटीक समय (Minute Life-Timing) को नियंत्रित करता है।`
      );
      detailedAnalysisEn.push(
        `Nadi Amsha Architecture: Divides each zodiac sign into 150 minute slices (12 arcminutes each), revealing granular life scripts.`,
        `Twin Birth Resolving Power: Accurately explains divergent career, marriage, and longevity paths between twins born minutes apart.`,
        `Nadi Ruler Influence: Dictates the precision clockwork behind life-transforming turning points.`
      );

      conditionalBranchesHi.push(
        { condition: 'शुभ नाड़ी अंश में जन्म', outcome: 'अकल्पनीय बौद्धिक कुशाग्रता, समय से पूर्व परिपक्वता व समाज में पूज्य स्थान प्राप्त होता है।' },
        { condition: 'सामान्य नाड़ी अंश में जन्म', outcome: 'सतत पुरुषार्थ, नीति-सम्मत आचरण व गुरु कृपा से जीवन के शिखर तक पहुंचता है।' }
      );
      conditionalBranchesEn.push(
        { condition: 'Auspicious Nadi Amsha Degrees', outcome: 'Endows native with precocious wisdom, intellectual intuition, and venerated social status.' },
        { condition: 'Standard Nadi Amsha Degrees', outcome: 'Ascends to prominence through dedicated mentorship, disciplined ethics, and hard work.' }
      );

      remediesHi.push(
        'नित्य प्रातः 108 बार ॐ नमो भगवते वासुदेवाय का जप करें।',
        'गुरुवार को वृद्धजनों व संन्यासियों को भोजन कराएं।'
      );
      remediesEn.push(
        'Chant Om Namo Bhagavate Vasudevaya 108 times daily for Nadi harmony.',
        'Offer food and support to elderly ascetics and scholars on Thursdays.'
      );
      break;
    }

    case 'D360': {
      classicalSource = 'भागांश-कला (Bhagamsha-Kala D-360) — 4,320 सूक्ष्म चक्र भाग';
      shlokaRef = 'कलाभागे स्थिता ये तु ग्रहाः सूक्ष्मातिसूक्ष्माः। तेषां बलेन संपूर्णं ज्ञायते जगदायुषम्॥';
      verdictEn = 'Bhagamsha-Kala D-360 represents the ultimate micro-harmonic division (5 arcminutes = 4,320 zodiac segments) with ~20s sensitivity.';
      verdictHi = 'भागांश-कला (D-360) ज्योतिष का परम सूक्ष्म चक्र (5 कला = 4,320 चक्र भाग) है, जो 20 सेकंड के भीतर लग्न परिवर्तन की क्षमता रखता है।';

      detailedAnalysisHi.push(
        `परम सूक्ष्म कला भाग: 360 भागों में विभाजित यह चक्र ब्रह्मांडीय चेतना के सूक्ष्मतम कंपन (Micro-Harmonic Vibration) को पकड़ता है।`,
        `जन्म समय शुद्धि का अंतिम मापदंड: 20 सेकंड के भीतर लग्न बदल जाने के कारण यह चक्र सिद्ध करता है कि जातक का जन्म समय पूर्णतः शुद्ध है।`,
        `अंतिम प्रारब्ध संकेत: यह चक्र आत्मा के उस अंतिम संस्कार को दर्शाता है जो उसे इस जन्म के पश्चात् अगली उच्च चेतना में ले जाएगा।`
      );
      detailedAnalysisEn.push(
        `Ultimate Micro-Harmonic Resolution: 360 slices per sign (5 arcminutes each) map the subtlest quantum frequencies of consciousness.`,
        `Gold Standard of Birth Time Rectification: Shifts ascendant every ~20 seconds, confirming absolute geometric precision of birth time.`,
        `Transcendental Destiny Blueprint: Reveals the final evolutionary impulse that propels the soul toward liberation or higher realms.`
      );

      conditionalBranchesHi.push(
        { condition: 'D-360 लग्न की शुद्धि', outcome: 'जातक का संपूर्ण जीवन एक दिव्य योजना के अनुसार संचालित होता है जिसमें हर घटना का गहरा अर्थ है।' },
        { condition: 'सूक्ष्म संस्कारों का परिष्कार', outcome: 'सत्य, अहिंसा व आत्म-चिन्तन से जातक अपने सभी सूक्ष्म प्रारब्ध बंधनों को काटकर मोक्ष की ओर अग्रसर होता है।' }
      );
      conditionalBranchesEn.push(
        { condition: 'Harmonized D-360 Ascendant', outcome: 'The native lives in synchronicity with divine providence; every trial yields profound wisdom.' },
        { condition: 'Evolutionary Mastery', outcome: 'Unyielding truth, compassion, and inner inquiry dissolve all residual subtle debts, preparing for Moksha.' }
      );

      remediesHi.push(
        'प्रतिदिन 24 गायत्री मंत्र का जप सूर्योदय के समय करें।',
        'अहंकार का त्याग कर संपूर्ण कर्मों को परमात्मा को समर्पित (ईश्वर प्रणिधान) करें।'
      );
      remediesEn.push(
        'Chant the Gayatri Mantra 24 times at dawn facing East.',
        'Practice Ishwara Pranidhana (unconditional surrender of fruits of action to the Divine).'
      );
      break;
    }

    default: {
      // Generic deep shastric template for any other varga (D5, D6, D8, D11, D16, D20, D24, D27, D30, D40, D45, D64, D72, D81, D108, D144, D300)
      classicalSource = `बृहत्पाराशर होराशास्त्र — ${nameHi} विवेचन`;
      shlokaRef = 'वर्गाधिपानां संसक्त्या ज्ञायते फलमुत्तमम्। ग्रहाणां बलमालोक्य कथयेत् दैवविद् वरः॥';
      verdictEn = `${nameEn} establishes ${strength.score}% shastric potency in governing ${significationEn}.`;
      verdictHi = `${nameHi} इस जातक के ${significationHi} के क्षेत्र में ${strength.score}% शास्त्रीय सामर्थ्य स्थापित करता है।`;

      detailedAnalysisHi.push(
        `वर्ग लग्न (${SIGN_NAMES_HI[lagnaSignIndex]}): इस वर्ग का लग्न जातक की इस विशिष्ट जीवन-क्षेत्र में स्वाभाविक सामर्थ्य को प्रकट करता है।`,
        `वर्ग लग्नेश (${PLANET_NAMES_HI[lagnaLord]}): लग्नेश की स्थिति यह तय करती है कि इस वर्ग से संबंधित विषय में जातक को कितना संतोष व सिद्धि प्राप्त होगी।`,
        `ग्रहों की स्थिति: कुल ${strength.kendraCount} ग्रह केंद्र में तथा ${strength.favorablePlanets.length} ग्रह अनुकूल स्थिति में स्थित हैं।`
      );
      detailedAnalysisEn.push(
        `Varga Ascendant (${SIGN_NAMES_EN[lagnaSignIndex]}): Sets the foundational baseline for ${significationEn}.`,
        `Varga Lagna Lord (${PLANET_NAMES_EN[lagnaLord]}): Dictates mastery, endurance, and final fruit in this specific domain.`,
        `Harmonic Integrity: Features ${strength.kendraCount} planets in Kendras and ${strength.favorablePlanets.length} fortified grahas.`
      );

      conditionalBranchesHi.push(
        { condition: 'दशा स्वामी की शुभता', outcome: 'जब भी इस वर्ग में शुभ भाव में बैठे ग्रह की दशा आती है, इस क्षेत्र में अभूतपूर्व प्रगति होती है।' },
        { condition: 'चुनौतीपूर्ण गोचर काल', outcome: 'संबंधित ग्रह के वैदिक बीज मंत्र का जप कर शांति बनाए रखें।' }
      );
      conditionalBranchesEn.push(
        { condition: 'During Supportive Dasha Periods', outcome: 'Triggers expansive breakthroughs in the areas governed by this varga.' },
        { condition: 'During Stressful Transits', outcome: 'Practice prescribed Vedic mantras and targeted charities to smooth out friction.' }
      );

      remediesHi.push(
        'इस वर्ग के लग्नेश ग्रह के बीज मंत्र का नित्य जप करें।',
        'संबंधित इष्ट देव की आराधना करें एवं शनिवार को दीप दान करें।'
      );
      remediesEn.push(
        'Chant the Beej Mantra of this Varga’s Lagna Lord regularly.',
        'Meditate upon your Ishta Devata and donate mustard oil or sesame seeds on Saturdays.'
      );
      break;
    }
  }

  return {
    vargaId,
    divisionNumber: division,
    nameEn,
    nameHi,
    sanskritName,
    significationEn,
    significationHi,
    classicalSource,
    shlokaRef,
    verdictEn,
    verdictHi,
    detailedAnalysisEn,
    detailedAnalysisHi,
    conditionalBranchesEn,
    conditionalBranchesHi,
    remediesEn,
    remediesHi,
  };
}
