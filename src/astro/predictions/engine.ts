import { calculateChart } from '../calculator';
import { NAKSHATRAS, NINE_GRAHAS, SEVEN_PLANETS, SIGNS } from '../constants';
import { findActiveDashaPath } from '../dasha';
import { computeJaiminiReport, computeLalKitabReport } from '../jaiminiLalKitab';
import { computeKpReport } from '../kp';
import type {
  BodyPosition,
  ChartData,
  DivisionalChartId,
  NineGrahaId,
  SevenPlanetId,
} from '../types';
import { computeVarshaphala } from '../varshaphala';
import {
  buildHouseLordReading,
  GOCHAR_GOOD_HOUSES,
  GOCHAR_VEDHA_MAP,
  isVedhaExemptPair,
  PLANET_IN_HOUSE_KB,
} from './bhavaKb';
import { LAGNA_EXTENDED_KB } from './extendedKb';
import { computeDegreePredictions } from './degreeWise';
import { computeFamilyAndChildhood, computeKundaliDoshas } from './familyDoshas';
import { computeDeepGochar } from './gocharDeep';
import { computeHouseWisePredictions } from './houseWise';
import { ATMAKARAKA_THEMES, LAGNA_KB, NAKSHATRA_KB, REMEDY_KB } from './lagnaNakshatraKb';
import { computePlanetInNakshatraPredictions } from './planetInNakshatra';
import { computePlanetInSignPredictions } from './planetInSign';
import { computeLifeEventsAndLedger } from './lifeEventsLedger';
import { computeBhavatBhavamReport } from './bhavatBhavam';
import { getBhavesha144Entry } from './bhavesha144';
import { computeBhriguNandiNadi } from './bhriguNandiNadi';
import { computeDrishtiPredictions } from './drishtiPredictions';
import { evaluateParamayusStatus, type ParamayusStatus } from './paramayus';
import { computeAdvancedPredictiveTechniques } from './advancedTechniques';
import { computePastFutureLifeReading } from './pastFutureLife';
import { computeChartYutiReport } from './yutiPredictions';
import { detectClassicalYogas } from './classicalYogasKb';
import { computeBhriguSaralPaddhati } from './bhriguSaralPaddhati';
import { computeKpFourStepReport } from './kpFourStepEngine';
import { computeLalKitabSystemReport } from './lalKitabSystem';
import { computeBhavarthaRatnakaraReport } from './bhavarthaRatnakara';
import type {
  DashaPrediction,
  DivisionalPredictionItem,
  HouseLordPrediction,
  LifeDomainPrediction,
  PlanetHousePrediction,
  PredictionReport,
  RemedyItem,
  TransitForecast,
  TransitPredictionItem,
} from './types';

function clampScore(n: number): number {
  return Math.max(25, Math.min(96, Math.round(n)));
}

function getVerdict(score: number): LifeDomainPrediction['verdict'] {
  if (score >= 78) return 'Highly Auspicious';
  if (score >= 62) return 'Favorable';
  if (score >= 46) return 'Balanced / Mixed';
  return 'Requires Effort';
}

function dignityBonus(dignity: string): number {
  switch (dignity) {
    case 'Exalted':
      return 18;
    case 'Moolatrikona':
      return 15;
    case 'Own Sign':
      return 13;
    case 'Great Friend':
      return 9;
    case 'Friend':
      return 5;
    case 'Neutral':
      return 0;
    case 'Enemy':
      return -7;
    case 'Great Enemy':
      return -11;
    case 'Debilitated':
      return -14;
    default:
      return 0;
  }
}

function housesRuledBy(planet: SevenPlanetId, ascSign: number): number[] {
  const ruled: number[] = [];
  for (let h = 1; h <= 12; h++) {
    const signIdx = (ascSign + h - 1) % 12;
    if (SIGNS[signIdx].lord === planet) ruled.push(h);
  }
  return ruled;
}

function describeMutualRelation(hA: number, hB: number): { label: string; delta: number } {
  const dist = ((hB - hA + 12) % 12) + 1;
  if (dist === 1) return { label: 'Conjunction (1/1)', delta: 8 };
  if (dist === 5 || dist === 9) return { label: 'Trinal Harmony (5/9)', delta: 12 };
  if (dist === 3 || dist === 11) return { label: 'Upachaya Growth (3/11)', delta: 6 };
  if (dist === 4 || dist === 10) return { label: 'Angular Drive (4/10)', delta: 5 };
  if (dist === 7) return { label: 'Mutual Opposition (7/7)', delta: 2 };
  if (dist === 6 || dist === 8) return { label: 'Shadashtaka Friction (6/8)', delta: -10 };
  return { label: 'Dwirdwadasha Adjustment (2/12)', delta: -6 };
}

function buildDignityModifierText(p: BodyPosition, housesRuled: number[]): string {
  const parts: string[] = [];
  if (p.dignity !== '-' && p.dignity !== 'Neutral') {
    parts.push(`${p.dignity} dignity in ${p.signName}`);
  }
  if (p.isVargottama) parts.push('Vargottama (D1 = D9, deep stability)');
  if (p.isRetrograde && p.id !== 'Rahu' && p.id !== 'Ketu') {
    parts.push('Retrograde (Chesta Bala, internalized intensity)');
  }
  if (p.isCombust) parts.push('Combust near Sun (outwardly subdued, subtle inner focus)');
  if (housesRuled.length > 0) {
    parts.push(`rules house${housesRuled.length > 1 ? 's' : ''} ${housesRuled.join(' & ')}`);
  }
  return parts.length > 0 ? parts.join(' · ') : `Placed in ${p.signName} (House ${p.rasiHouseNumber})`;
}

function getHouseLordPlanet(chart: ChartData, houseNum: number): BodyPosition {
  const signIdx = (chart.ascendant.signIndex + houseNum - 1) % 12;
  const lordId = SIGNS[signIdx].lord;
  return chart.planets.find((p) => p.id === lordId)!;
}

function getVargaDignity(chart: ChartData, varga: DivisionalChartId, planetId: string): string {
  return (
    chart.divisionalCharts[varga].placements.find((x) => x.id === planetId)?.dignity ?? '-'
  );
}

function getShadbalaRatio(chart: ChartData, planetId: string): number {
  return chart.shadbala.find((s) => s.planet === planetId)?.ratio ?? 1;
}

function buildLifeDomains(chart: ChartData): LifeDomainPrediction[] {
  const ascSign = chart.ascendant.signIndex;
  const byId = new Map(chart.planets.map((p) => [p.id, p]));
  const sun = byId.get('Sun')!;
  const moon = byId.get('Moon')!;
  const mercury = byId.get('Mercury')!;
  const jupiter = byId.get('Jupiter')!;
  const venus = byId.get('Venus')!;
  const saturn = byId.get('Saturn')!;

  const savAtHouse = (h: number) => chart.ashtakavarga.sarva[(ascSign + h - 1) % 12];
  const planetsInHouse = (h: number) => chart.planets.filter((p) => p.rasiHouseNumber === h);
  const yogaNames = chart.yogas.map((y) => y.name);

  const l1 = getHouseLordPlanet(chart, 1);
  const l2 = getHouseLordPlanet(chart, 2);
  const l4 = getHouseLordPlanet(chart, 4);
  const l5 = getHouseLordPlanet(chart, 5);
  const l6 = getHouseLordPlanet(chart, 6);
  const l7 = getHouseLordPlanet(chart, 7);
  const l8 = getHouseLordPlanet(chart, 8);
  const l9 = getHouseLordPlanet(chart, 9);
  const l10 = getHouseLordPlanet(chart, 10);
  const l11 = getHouseLordPlanet(chart, 11);
  const l12 = getHouseLordPlanet(chart, 12);

  // 1. Personality & Vitality
  const pScore = clampScore(
    60 +
      dignityBonus(l1.dignity) +
      (getShadbalaRatio(chart, l1.id) - 1) * 18 +
      (savAtHouse(1) - 28) * 1.2 +
      (chart.ascendant.isVargottama ? 8 : 0) +
      ([1, 4, 5, 7, 9, 10].includes(l1.rasiHouseNumber) ? 8 : -4)
  );
  const pOcc = planetsInHouse(1).map((p) => p.id);

  // 2. Wealth & Family
  const wScore = clampScore(
    58 +
      dignityBonus(l2.dignity) * 0.7 +
      dignityBonus(l11.dignity) * 0.6 +
      dignityBonus(jupiter.dignity) * 0.4 +
      (savAtHouse(2) + savAtHouse(11) - 56) * 0.9 +
      (yogaNames.some((n) => n.includes('Dhana') || n.includes('Chandra-Mangala')) ? 6 : 0)
  );
  const d2Jupiter = getVargaDignity(chart, 'D2', 'Jupiter');

  // 3. Career & Public Standing
  const cScore = clampScore(
    60 +
      dignityBonus(l10.dignity) * 0.8 +
      (getShadbalaRatio(chart, l10.id) - 1) * 15 +
      (savAtHouse(10) - 28) * 1.3 +
      (yogaNames.some((n) => n.includes('Dharma-Karmadhipati') || n.includes('Raja') || n.includes('Hamsa') || n.includes('Sasa') || n.includes('Ruchaka') || n.includes('Bhadra') || n.includes('Malavya')) ? 9 : 0)
  );
  const d10L10 = getVargaDignity(chart, 'D10', l10.id);
  const strongestShadbala = [...chart.shadbala].sort((a, b) => b.ratio - a.ratio)[0];

  // 4. Marriage & Partnerships
  const mScore = clampScore(
    59 +
      dignityBonus(l7.dignity) * 0.7 +
      dignityBonus(venus.dignity) * 0.5 +
      dignityBonus(getVargaDignity(chart, 'D9', l7.id)) * 0.5 +
      (savAtHouse(7) - 28) * 1.1 +
      (yogaNames.some((n) => n.includes('Kuja / Manglik Dosha')) ? -7 : 0)
  );
  const upapada = chart.specialPoints.find((s) => s.id === 'UL');
  const darakaraka = chart.planets.find((p) => p.charaKaraka === 'DK');

  // 5. Education, Intelligence & Children
  const eScore = clampScore(
    60 +
      dignityBonus(l4.dignity) * 0.5 +
      dignityBonus(l5.dignity) * 0.6 +
      dignityBonus(mercury.dignity) * 0.4 +
      dignityBonus(jupiter.dignity) * 0.4 +
      (savAtHouse(4) + savAtHouse(5) - 56) * 0.8
  );
  const d24Merc = getVargaDignity(chart, 'D24', 'Mercury');
  const d7Jup = getVargaDignity(chart, 'D7', 'Jupiter');

  // 6. Health & Longevity
  const hScore = clampScore(
    60 +
      (getShadbalaRatio(chart, l1.id) - 1) * 16 +
      dignityBonus(sun.dignity) * 0.4 +
      dignityBonus(moon.dignity) * 0.4 +
      (savAtHouse(6) > savAtHouse(8) ? 5 : -2) +
      ([6, 8, 12].includes(l8.rasiHouseNumber) ? 4 : 0) // Saturn/8th lord longevity note
  );

  // 7. Fortune, Dharma & Mentors
  const fScore = clampScore(
    60 +
      dignityBonus(l9.dignity) * 0.8 +
      dignityBonus(jupiter.dignity) * 0.5 +
      (savAtHouse(9) - 28) * 1.2 +
      (yogaNames.some((n) => n.includes('Gaja Kesari') || n.includes('Dharma-Karmadhipati')) ? 8 : 0)
  );

  // 8. Foreign Horizons & Spiritual Liberation
  const sScore = clampScore(
    58 +
      dignityBonus(l12.dignity) * 0.5 +
      dignityBonus(saturn.dignity) * 0.3 +
      (planetsInHouse(12).length > 0 ? 5 : 0) +
      (savAtHouse(12) >= 28 ? 5 : 0)
  );
  const d20Jup = getVargaDignity(chart, 'D20', 'Jupiter');

  return [
    {
      id: 'personality',
      title: 'Self, Vitality & Character',
      sanskritFocus: 'Tanu Bhava (H1) & Lagna Lord',
      rating: pScore,
      verdict: getVerdict(pScore),
      summary: `${chart.ascendant.signName} Lagna ruled by ${l1.id} placed in House ${l1.rasiHouseNumber} (${l1.signName}, ${l1.dignity}).`,
      details: [
        `Lagna degree ${chart.ascendant.shortDms} falls in ${chart.ascendant.nakshatraName} Pada ${chart.ascendant.pada}${chart.ascendant.isVargottama ? ' and is Vargottama (D1 = D9), conferring deep resilience and authenticity' : ''}.`,
        `Lagna Lord ${l1.id} achieves a Shadbala ratio of ${getShadbalaRatio(chart, l1.id).toFixed(2)}× minimum required strength.`,
        pOcc.length > 0
          ? `Planets in the 1st house (${pOcc.join(', ')}) directly color your outward presence and instinctual approach.`
          : `An unoccupied 1st house places primary focus on ${l1.id}'s placement in House ${l1.rasiHouseNumber}.`,
      ],
      keyFactors: [
        `Lagna Lord: ${l1.id} in H${l1.rasiHouseNumber}`,
        `SAV House 1: ${savAtHouse(1)} bindus`,
        `Moon: ${moon.signName} (${moon.nakshatraName})`,
      ],
      sources: ['Brihat Parashara Hora Shastra', 'Brihat Jataka'],
    },
    {
      id: 'wealth',
      title: 'Wealth, Family & Speech',
      sanskritFocus: 'Dhana (H2), Labha (H11) & Hora (D2)',
      rating: wScore,
      verdict: getVerdict(wScore),
      summary: `2nd lord ${l2.id} (H${l2.rasiHouseNumber}) and 11th lord ${l11.id} (H${l11.rasiHouseNumber}) shape family heritage and income flow.`,
      details: [
        `2nd house (accumulated treasury & speech) carries ${savAtHouse(2)} SAV bindus; 11th house (gains & networks) carries ${savAtHouse(11)} SAV bindus.`,
        `Karaka Jupiter sits in ${jupiter.signName} (House ${jupiter.rasiHouseNumber}, ${jupiter.dignity}) and holds ${d2Jupiter} dignity in D2 Hora.`,
        l2.rasiHouseNumber === 11 || l11.rasiHouseNumber === 2 || l2.signIndex === l11.signIndex
          ? 'Strong 2nd–11th Dhana link indicates self-multiplying financial opportunities.'
          : 'Wealth builds steadily during the Dashas of the 2nd, 5th, 9th, and 11th lords.',
      ],
      keyFactors: [
        `2nd Lord: ${l2.id} in H${l2.rasiHouseNumber}`,
        `11th Lord: ${l11.id} in H${l11.rasiHouseNumber}`,
        `SAV H2/H11: ${savAtHouse(2)} / ${savAtHouse(11)}`,
      ],
      sources: ['Phaladeepika', 'BPHS Ch. 13 & 22'],
    },
    {
      id: 'career',
      title: 'Career, Status & Karma',
      sanskritFocus: 'Karma Bhava (H10) & Dasamsa (D10)',
      rating: cScore,
      verdict: getVerdict(cScore),
      summary: `10th lord ${l10.id} in House ${l10.rasiHouseNumber} (${l10.signName}) paired with ${strongestShadbala.planet} as your strongest Shadbala planet (${strongestShadbala.ratio.toFixed(2)}×).`,
      details: [
        `10th lord ${l10.id} holds ${l10.dignity} dignity in Rasi (D1) and ${d10L10} dignity in Dasamsa (D10).`,
        `10th house carries ${savAtHouse(10)} SAV bindus (${savAtHouse(10) >= 28 ? 'above-average public backing and professional stability' : 'rewards specialized skill over sheer crowd-pleasing'}).`,
        planetsInHouse(10).length > 0
          ? `10th-house occupants (${planetsInHouse(10).map((p) => p.id).join(', ')}) strongly define your visible career arena.`
          : `Unoccupied 10th house directs vocational expression through ${l10.id}'s sign and D10 placement.`,
      ],
      keyFactors: [
        `10th Lord: ${l10.id} (${l10.dignity})`,
        `D10 Status: ${d10L10}`,
        `Top Shadbala: ${strongestShadbala.planet}`,
      ],
      sources: ['BPHS', 'Saravali', 'Uttara Kalamrita'],
    },
    {
      id: 'marriage',
      title: 'Love, Marriage & Partnerships',
      sanskritFocus: 'Kalatra Bhava (H7), Navamsa (D9) & Upapada',
      rating: mScore,
      verdict: getVerdict(mScore),
      summary: `7th lord ${l7.id} in House ${l7.rasiHouseNumber} (${l7.signName}) and D9 Navamsa status (${getVargaDignity(chart, 'D9', l7.id)}) govern committed bonds.`,
      details: [
        `Venus (natural relationship Karaka) sits in ${venus.signName} (House ${venus.rasiHouseNumber}, ${venus.dignity}); 7th house has ${savAtHouse(7)} SAV bindus.`,
        darakaraka
          ? `Jaimini Darakaraka (DK) is ${darakaraka.id} in ${darakaraka.signName}, highlighting partner qualities of ${darakaraka.id}.`
          : '',
        upapada
          ? `Upapada Lagna (UL) falls in ${upapada.signName} (House ${upapada.houseNumber}), indicating marriage style and longevity.`
          : '',
      ].filter(Boolean),
      keyFactors: [
        `7th Lord: ${l7.id} in H${l7.rasiHouseNumber}`,
        `Venus: ${venus.dignity}`,
        `SAV H7: ${savAtHouse(7)} bindus`,
      ],
      sources: ['Brihat Jataka', 'Phaladeepika', 'Jaimini Sutras'],
    },
    {
      id: 'education',
      title: 'Intellect, Learning & Progeny',
      sanskritFocus: 'Vidya (H4), Putra (H5) & D24 / D7',
      rating: eScore,
      verdict: getVerdict(eScore),
      summary: `4th lord ${l4.id} (H${l4.rasiHouseNumber}) and 5th lord ${l5.id} (H${l5.rasiHouseNumber}) shape formal study, creativity, and children.`,
      details: [
        `Mercury (intellect) holds ${mercury.dignity} dignity in Rasi and ${d24Merc} in D24 Chaturvimsamsa (higher learning).`,
        `Jupiter (wisdom & progeny Karaka) holds ${jupiter.dignity} in Rasi and ${d7Jup} in D7 Saptamsa.`,
        `4th & 5th houses score ${savAtHouse(4)} and ${savAtHouse(5)} SAV bindus respectively.`,
      ],
      keyFactors: [
        `5th Lord: ${l5.id} in H${l5.rasiHouseNumber}`,
        `D24 Mercury: ${d24Merc}`,
        `D7 Jupiter: ${d7Jup}`,
      ],
      sources: ['BPHS', 'Saravali'],
    },
    {
      id: 'health',
      title: 'Health, Vitality & Resilience',
      sanskritFocus: 'Roga (H6), Ayur (H8) & Lagna Strength',
      rating: hScore,
      verdict: getVerdict(hScore),
      summary: `Balanced comparison between 6th house (${savAtHouse(6)} bindus), 8th house (${savAtHouse(8)} bindus), and Lagna lord ${l1.id}.`,
      details: [
        `Sun (vitality Karaka) is in ${sun.signName} (${sun.dignity}) and Moon (mind/prana) is in ${moon.signName} (${moon.dignity}).`,
        `6th lord ${l6.id} sits in House ${l6.rasiHouseNumber}, indicating where discipline and preventive routines protect stamina.`,
        `8th lord ${l8.id} in House ${l8.rasiHouseNumber} reflects longevity endurance and recovery after stress.`,
      ],
      keyFactors: [
        `Sun / Moon: ${sun.dignity} / ${moon.dignity}`,
        `6th Lord: ${l6.id} in H${l6.rasiHouseNumber}`,
        `SAV H6/H8: ${savAtHouse(6)} / ${savAtHouse(8)}`,
      ],
      sources: ['Phaladeepika', 'Brihat Jataka'],
    },
    {
      id: 'fortune',
      title: 'Fortune, Dharma & Mentors',
      sanskritFocus: 'Bhagya Bhava (H9) & Purva Punya',
      rating: fScore,
      verdict: getVerdict(fScore),
      summary: `9th lord ${l9.id} placed in House ${l9.rasiHouseNumber} (${l9.signName}, ${l9.dignity}) anchors luck, ethics, and guidance.`,
      details: [
        `Bhagya Bhava (9th house) holds ${savAtHouse(9)} SAV bindus.`,
        yogaNames.some((n) => n.includes('Gaja Kesari') || n.includes('Dharma-Karmadhipati'))
          ? 'Classical Dharma/Kendra-Trikona combinations amplify protective fortune and respected counsel.'
          : 'Fortune blossoms steadily through honoring mentors, continuous learning, and ethical alignment.',
      ],
      keyFactors: [
        `9th Lord: ${l9.id} in H${l9.rasiHouseNumber}`,
        `Jupiter: ${jupiter.signName} (H${jupiter.rasiHouseNumber})`,
        `SAV H9: ${savAtHouse(9)} bindus`,
      ],
      sources: ['BPHS', 'Jataka Parijata'],
    },
    {
      id: 'spirituality',
      title: 'Foreign Horizons & Inner Liberation',
      sanskritFocus: 'Vyaya (H12), Moksha Trikona & D20',
      rating: sScore,
      verdict: getVerdict(sScore),
      summary: `12th lord ${l12.id} in House ${l12.rasiHouseNumber} (${l12.signName}) and D20 Vimsamsa describe quiet retreat, global ties, and spiritual growth.`,
      details: [
        `12th house carries ${savAtHouse(12)} SAV bindus; Jupiter in D20 Vimsamsa holds ${d20Jup} dignity.`,
        `Rahu/Ketu nodal axis across Houses ${byId.get('Rahu')!.rasiHouseNumber}–${byId.get('Ketu')!.rasiHouseNumber} marks the core axis of worldly experience vs inward detachment.`,
      ],
      keyFactors: [
        `12th Lord: ${l12.id} in H${l12.rasiHouseNumber}`,
        `Ketu: House ${byId.get('Ketu')!.rasiHouseNumber}`,
        `D20 Jupiter: ${d20Jup}`,
      ],
      sources: ['BPHS', 'Jaimini Sutras', 'Phaladeepika'],
    },
  ];
}

function buildDashaPrediction(chart: ChartData, targetDate: string): DashaPrediction {
  const targetMs = Date.parse(`${targetDate}T12:00:00Z`) || Date.now();
  const path = findActiveDashaPath(chart.vimshottari, targetMs);
  const md = path[0] ?? chart.vimshottari[0];
  const ad = path[1] ?? md.children?.[0] ?? md;
  const pd = path[2] ?? ad.children?.[0] ?? ad;

  const mdId = md.lord as NineGrahaId;
  const adId = ad.lord as NineGrahaId;
  const mdBody = chart.planets.find((p) => p.id === mdId)!;
  const adBody = chart.planets.find((p) => p.id === adId)!;

  const ascSign = chart.ascendant.signIndex;
  const mdHouses = SEVEN_PLANETS.includes(mdId as SevenPlanetId)
    ? housesRuledBy(mdId as SevenPlanetId, ascSign)
    : [];
  const adHouses = SEVEN_PLANETS.includes(adId as SevenPlanetId)
    ? housesRuledBy(adId as SevenPlanetId, ascSign)
    : [];

  const rel = describeMutualRelation(mdBody.rasiHouseNumber, adBody.rasiHouseNumber);
  const score =
    60 +
    rel.delta +
    dignityBonus(mdBody.dignity) * 0.5 +
    dignityBonus(adBody.dignity) * 0.4 +
    (chart.ashtakavarga.sarva[mdBody.signIndex] - 28) * 0.5;

  const favorability: DashaPrediction['favorability'] =
    score >= 74
      ? 'Very Favorable'
      : score >= 60
        ? 'Supportive'
        : score >= 48
          ? 'Mixed / Transformative'
          : 'Challenging';

  const mdTheme = PLANET_IN_HOUSE_KB[mdId][mdBody.rasiHouseNumber - 1];
  const adTheme = PLANET_IN_HOUSE_KB[adId][adBody.rasiHouseNumber - 1];

  return {
    targetDate,
    mahadashaLord: mdId,
    antardashaLord: adId,
    pratyantardashaLord: pd.lord,
    mdHousesRuled: mdHouses,
    adHousesRuled: adHouses,
    mdPlacedHouse: mdBody.rasiHouseNumber,
    adPlacedHouse: adBody.rasiHouseNumber,
    mutualRelation: rel.label,
    favorability,
    summary: `Active ${mdId} Mahadasha / ${adId} Antardasha / ${pd.lord} Pratyantardasha exhibits a ${rel.label} dynamic (${favorability}).`,
    mahadashaReading: `${mdId} (in House ${mdBody.rasiHouseNumber}, ${mdBody.signName}, ${mdBody.dignity}${mdHouses.length ? `, ruling House${mdHouses.length > 1 ? 's' : ''} ${mdHouses.join(' & ')}` : ''}) sets the multi-year backdrop: ${mdTheme.headline}. ${mdTheme.reading}`,
    antardashaReading: `${adId} (in House ${adBody.rasiHouseNumber}, ${adBody.signName}, ${adBody.dignity}${adHouses.length ? `, ruling House${adHouses.length > 1 ? 's' : ''} ${adHouses.join(' & ')}` : ''}) triggers sub-period themes: ${adTheme.headline}.`,
    guidance:
      rel.delta < 0
        ? `Because ${mdId} and ${adId} lie in a ${rel.label} angle, pace major commitments carefully, double-check communications, and lean on patient consistency.`
        : `Their ${rel.label} geometry supports constructive coordination between Houses ${mdBody.rasiHouseNumber} and ${adBody.rasiHouseNumber}; lean into decisive action during Pratyantardashas of friendly benefics.`,
    sources: ['BPHS Dasha Phala', 'Phaladeepika Ch. 19–22'],
  };
}

function buildTransitForecast(chart: ChartData, targetDate: string): TransitForecast {
  const transitInput = {
    ...chart.input,
    id: 'pred-transit',
    name: 'Transit',
    date: targetDate,
    time: '12:00:00',
  };
  const tChart = calculateChart(transitInput, chart.settings);
  const natalMoon = chart.planets.find((p) => p.id === 'Moon')!;
  const moonSign = natalMoon.signIndex;

  const transitById = new Map<NineGrahaId, BodyPosition>();
  for (const p of tChart.planets) {
    if (NINE_GRAHAS.includes(p.id as NineGrahaId)) {
      transitById.set(p.id as NineGrahaId, p);
    }
  }

  // Occupied houses from Natal Moon for Vedha check
  const occupantsByHouse = new Map<number, NineGrahaId[]>();
  for (const g of NINE_GRAHAS) {
    const tp = transitById.get(g)!;
    const h = ((tp.signIndex - moonSign + 12) % 12) + 1;
    const list = occupantsByHouse.get(h) ?? [];
    list.push(g);
    occupantsByHouse.set(h, list);
  }

  const items: TransitPredictionItem[] = NINE_GRAHAS.map((g) => {
    const tp = transitById.get(g)!;
    const houseFromMoon = ((tp.signIndex - moonSign + 12) % 12) + 1;
    const isGood = GOCHAR_GOOD_HOUSES[g].includes(houseFromMoon);
    const vedhaHouse = GOCHAR_VEDHA_MAP[g][houseFromMoon];

    let hasVedha = false;
    let vedhaPlanet: string | undefined;
    if (isGood && vedhaHouse) {
      const blockers = (occupantsByHouse.get(vedhaHouse) ?? []).filter(
        (other) => other !== g && !isVedhaExemptPair(g, other)
      );
      if (blockers.length > 0) {
        hasVedha = true;
        vedhaPlanet = blockers.join(', ');
      }
    }

    const savBindus = chart.ashtakavarga.sarva[tp.signIndex];
    const verdict: TransitPredictionItem['verdict'] = isGood
      ? hasVedha
        ? 'Obstructed (Vedha)'
        : 'Auspicious'
      : savBindus >= 30
        ? 'Neutral'
        : 'Testing';

    let reading = '';
    if (isGood && !hasVedha) {
      reading = `${g} transits House ${houseFromMoon} from Natal Moon (${tp.signName}, ${savBindus} SAV bindus) — classically auspicious and free from Vedha obstruction.`;
    } else if (isGood && hasVedha) {
      reading = `${g} occupies favorable House ${houseFromMoon} from Moon, but receives classical Vedha from ${vedhaPlanet} in House ${vedhaHouse}, softening full expression.`;
    } else {
      reading = `${g} moves through House ${houseFromMoon} from Moon (${tp.signName}, ${savBindus} SAV bindus) — ${savBindus >= 29 ? 'high natal SAV bindus cushion this transit well' : 'calls for patience and measured pacing'}.`;
    }

    return {
      planet: g,
      transitSign: tp.signName,
      houseFromMoon,
      isClassicalGood: isGood,
      hasVedha,
      vedhaPlanet,
      savBindus,
      verdict,
      reading,
    };
  });

  // Sade Sati & Ashtama Shani check
  const saturnTransit = items.find((i) => i.planet === 'Saturn')!;
  let sadeSatiStatus = {
    active: false,
    phase: 'Inactive',
    description: `Saturn transits House ${saturnTransit.houseFromMoon} from your Janma Rasi (${natalMoon.signName}) — outside Sade Sati.`,
  };
  if (saturnTransit.houseFromMoon === 12) {
    sadeSatiStatus = {
      active: true,
      phase: '1st Phase (Rising / 12th from Moon)',
      description: 'Saturn enters the 12th from Natal Moon: invites financial discipline, reorganization of routines, and quiet inner reflection.',
    };
  } else if (saturnTransit.houseFromMoon === 1) {
    sadeSatiStatus = {
      active: true,
      phase: 'Peak Phase (Janma Shani / Over Moon)',
      description: 'Saturn transits directly over your Natal Moon: rewards maturity, realistic responsibility, health care, and steady focus.',
    };
  } else if (saturnTransit.houseFromMoon === 2) {
    sadeSatiStatus = {
      active: true,
      phase: '3rd Phase (Setting / 2nd from Moon)',
      description: 'Saturn moves through the 2nd from Natal Moon: consolidates family finances and durable work fruits before completing Sade Sati.',
    };
  } else if (saturnTransit.houseFromMoon === 4 || saturnTransit.houseFromMoon === 8) {
    sadeSatiStatus = {
      active: true,
      phase: saturnTransit.houseFromMoon === 4 ? 'Kantaka Shani (4th)' : 'Ashtama Shani (8th)',
      description: `Saturn transits House ${saturnTransit.houseFromMoon} from Natal Moon: encourages patient domestic/career restructuring and steady calm.`,
    };
  }

  const jupTransit = items.find((i) => i.planet === 'Jupiter')!;
  const jupiterTransitNote = jupTransit.isClassicalGood
    ? `Jupiter in ${jupTransit.transitSign} (House ${jupTransit.houseFromMoon} from Moon) offers direct protective growth and auspicious openings${jupTransit.hasVedha ? ` (moderated by Vedha from ${jupTransit.vedhaPlanet})` : ''}.`
    : `Jupiter in ${jupTransit.transitSign} (House ${jupTransit.houseFromMoon} from Moon) still blesses your chart through its 5th, 7th, and 9th trinal aspects.`;

  return {
    targetDate,
    janmaRasi: natalMoon.signName,
    sadeSatiStatus,
    jupiterTransitNote,
    items,
    sources: ['Phaladeepika Ch. 26 (Gochara Phala)', 'Brihat Samhita'],
  };
}

function buildRemedies(chart: ChartData, dasha: DashaPrediction): RemedyItem[] {
  const ascSign = chart.ascendant.signIndex;
  const lagnaKb = LAGNA_KB[ascSign];
  const weakBenefics = chart.shadbala
    .filter((r) => lagnaKb.functionalBenefics.includes(r.planet) && (!r.isStrong || r.ratio < 1.05))
    .sort((a, b) => a.ratio - b.ratio);

  const targets: Array<{ planet: NineGrahaId; reason: string }> = [];
  const seen = new Set<NineGrahaId>();

  if (weakBenefics[0]) {
    const p = weakBenefics[0].planet;
    targets.push({
      planet: p,
      reason: `Functional benefic for ${chart.ascendant.signName} Lagna with lower Shadbala (${weakBenefics[0].ratio.toFixed(2)}×).`,
    });
    seen.add(p);
  }

  const mdLord = dasha.mahadashaLord as NineGrahaId;
  if (!seen.has(mdLord)) {
    targets.push({
      planet: mdLord,
      reason: `Currently active Mahadasha ruler (${dasha.mahadashaLord} MD / ${dasha.antardashaLord} AD).`,
    });
    seen.add(mdLord);
  }

  const moon = chart.planets.find((p) => p.id === 'Moon')!;
  if (!seen.has('Moon') && (moon.dignity === 'Debilitated' || moon.dignity === 'Enemy')) {
    targets.push({
      planet: 'Moon',
      reason: `Moon in ${moon.signName} (${moon.dignity}) benefits from calming lunar alignment.`,
    });
    seen.add('Moon');
  }

  if (targets.length < 3 && !seen.has('Jupiter')) {
    targets.push({
      planet: 'Jupiter',
      reason: 'Universal Karaka for wisdom, dharma, and protective grace across all charts.',
    });
  }

  return targets.slice(0, 3).map(({ planet, reason }) => {
    const kb = REMEDY_KB[planet];
    return {
      planet,
      reason,
      mantra: kb.mantra,
      dana: kb.dana,
      lifestyle: kb.lifestyle,
      gemNote: kb.gemWarning,
    };
  });
}

function buildDivisionalPredictions(chart: ChartData): DivisionalPredictionItem[] {
  const specs: Array<{ id: DivisionalChartId; domain: string; focusHouse: number; karaka: NineGrahaId }> = [
    { id: 'D2', domain: 'Wealth & Sustenance', focusHouse: 2, karaka: 'Jupiter' },
    { id: 'D3', domain: 'Courage, Siblings & Initiative', focusHouse: 3, karaka: 'Mars' },
    { id: 'D4', domain: 'Home, Fixed Assets & Fortune', focusHouse: 4, karaka: 'Moon' },
    { id: 'D6', domain: 'Health Challenges & Immunity', focusHouse: 6, karaka: 'Mars' },
    { id: 'D7', domain: 'Children, Progeny & Legacy', focusHouse: 5, karaka: 'Jupiter' },
    { id: 'D9', domain: 'Marriage, Dharma & Inner Strength', focusHouse: 7, karaka: 'Venus' },
    { id: 'D10', domain: 'Career, Authority & Public Deeds', focusHouse: 10, karaka: 'Sun' },
    { id: 'D12', domain: 'Parents, Lineage & Ancestry', focusHouse: 9, karaka: 'Sun' },
    { id: 'D16', domain: 'Vehicles, Comforts & Joy', focusHouse: 4, karaka: 'Venus' },
    { id: 'D20', domain: 'Spiritual Practice & Devotion', focusHouse: 9, karaka: 'Jupiter' },
    { id: 'D24', domain: 'Higher Learning & Degrees', focusHouse: 5, karaka: 'Mercury' },
    { id: 'D30', domain: 'Character, Crises & Subconscious', focusHouse: 8, karaka: 'Saturn' },
    { id: 'D60', domain: 'Past-Life Karma & Subtle Root', focusHouse: 1, karaka: 'Jupiter' },
  ];

  return specs.map((spec) => {
    const dc = chart.divisionalCharts[spec.id];
    const vLagnaSign = SIGNS[dc.lagnaSignIndex].name;
    const keyHouseSignIdx = (dc.lagnaSignIndex + spec.focusHouse - 1) % 12;
    const keyLordId = SIGNS[keyHouseSignIdx].lord;
    const keyLordPl = dc.placements.find((p) => p.id === keyLordId)!;
    const karakaPl = dc.placements.find((p) => p.id === spec.karaka)!;
    const strongPlanets = dc.placements
      .filter((p) => p.id !== 'Asc' && ['Exalted', 'Moolatrikona', 'Own Sign'].includes(p.dignity))
      .map((p) => `${p.id} (${p.dignity} in H${p.houseFromVargaLagna})`);
    const focusOccupants = dc.placements
      .filter((p) => p.id !== 'Asc' && (p.houseFromVargaLagna === 1 || p.houseFromVargaLagna === spec.focusHouse))
      .map((p) => `${p.id} in H${p.houseFromVargaLagna}`);

    const keyLordGood =
      [1, 4, 5, 7, 9, 10, 11].includes(keyLordPl.houseFromVargaLagna) ||
      ['Exalted', 'Moolatrikona', 'Own Sign', 'Great Friend'].includes(keyLordPl.dignity);

    const prediction = `${dc.name} (${dc.id}) rises in ${vLagnaSign}. Its key house-${spec.focusHouse} lord ${keyLordId} sits in ${dc.id} House ${keyLordPl.houseFromVargaLagna} (${keyLordPl.signName}, ${keyLordPl.dignity}), while Karaka ${spec.karaka} occupies ${karakaPl.signName} (H${karakaPl.houseFromVargaLagna}, ${karakaPl.dignity}). ${
      keyLordGood
        ? `Strong divisional backing confirms enduring fruitfulness in ${spec.domain.toLowerCase()} beyond surface Rasi appearances.`
        : `Divisional placement urges patient effort and wise timing to stabilize ${spec.domain.toLowerCase()}.`
    }`;

    return {
      vargaId: spec.id,
      name: dc.name,
      domain: spec.domain,
      lagnaSign: vLagnaSign,
      keyLord: keyLordId,
      keyLordStatus: `H${keyLordPl.houseFromVargaLagna} (${keyLordPl.signName}, ${keyLordPl.dignity})`,
      occupantsHighlight:
        strongPlanets.length > 0
          ? strongPlanets.join(', ')
          : focusOccupants.length > 0
            ? focusOccupants.join(', ')
            : `Karaka ${spec.karaka} in H${karakaPl.houseFromVargaLagna}`,
      prediction,
    };
  });
}

function buildParamayusLockedReport(
  chart: ChartData,
  dateStr: string,
  targetYear: number,
  paramayus: ParamayusStatus
): PredictionReport {
  const ascSign = chart.ascendant.signIndex;
  const lagnaKb = LAGNA_KB[ascSign];
  const lagnaExt = LAGNA_EXTENDED_KB[ascSign];
  const moon = chart.planets.find((p) => p.id === 'Moon')!;
  const nakDef = NAKSHATRAS[moon.nakshatraIndex];
  const akPlanet = chart.planets.find((p) => p.charaKaraka === 'AK') ?? chart.planets[0];
  const ascLord = SIGNS[ascSign].lord;

  const emptyFam = (role: string, sanskrit: string) => ({
    role,
    sanskrit,
    score: 0,
    keyIndicators: '—',
    reading: paramayus.messageEn,
    vargaNote: paramayus.noteEn,
  });

  return {
    paramayus,
    pastFutureLife: null,
    advancedTechniques: null,
    lagnaProfile: {
      signName: chart.ascendant.signName,
      sanskritName: chart.ascendant.sanskritName,
      ruler: lagnaKb.ruler,
      functionalBenefics: lagnaKb.functionalBenefics,
      beneficList: lagnaExt.beneficList,
      maleficList: lagnaExt.maleficList,
      neutralList: lagnaExt.neutralList,
      marakaList: lagnaExt.marakaList,
      yogakaraka: lagnaKb.yogakaraka,
      temperament: paramayus.titleEn,
      physicalAppearance: '—',
      mentalQualities: paramayus.messageEn,
      careerIndicators: '—',
      luckyColors: '—',
      luckyDays: '—',
      luckyNumbers: '—',
      luckyGem: '—',
      strengths: paramayus.noteEn,
      cautions: paramayus.titleHi,
      sources: [],
    },
    nakshatraProfile: {
      name: nakDef.name,
      pada: moon.pada,
      lord: nakDef.lord,
      deity: nakDef.deity,
      coreNature: paramayus.titleEn,
      vocation: '—',
      growthPath: paramayus.messageEn,
      sources: [],
    },
    atmakarakaInsight: {
      planet: akPlanet.id,
      signName: akPlanet.signName,
      house: akPlanet.rasiHouseNumber,
      soulTheme: paramayus.messageEn,
      source: 'Paramayus Threshold (>120 Years)',
    },
    lifeDomains: [],
    planetInSigns: [],
    planetInNakshatras: [],
    planetPlacements: [],
    houseWisePredictions: [],
    houseLordships: [],
    degreePredictions: [],
    dashaForecast: {
      targetDate: dateStr,
      mahadashaLord: '-',
      antardashaLord: '-',
      pratyantardashaLord: '-',
      mdHousesRuled: [],
      adHousesRuled: [],
      mdPlacedHouse: 0,
      adPlacedHouse: 0,
      mutualRelation: '-',
      favorability: 'Mixed / Transformative',
      summary: paramayus.messageEn,
      mahadashaReading: paramayus.noteEn,
      antardashaReading: '',
      guidance: '',
      sources: [],
    },
    transitForecast: {
      targetDate: dateStr,
      janmaRasi: moon.signName,
      sadeSatiStatus: {
        active: false,
        phase: 'Predictions Locked (>120 Yrs)',
        description: paramayus.messageEn,
      },
      jupiterTransitNote: paramayus.messageEn,
      items: [],
      sources: [],
    },
    deepGochar: {
      targetDate: dateStr,
      transitChart: chart,
      doubleTransitHouses: [],
      items: [],
      overallSummary: paramayus.messageEn,
    },
    divisionalPredictions: [],
    kpReport: {
      kpAyanamsaDms: '-',
      cusps: [],
      planets: [],
      houseSignificators: [],
      events: [],
      nakshatraNadi: [],
      chartRulingPlanets: {
        timestampLocal: dateStr,
        dayLord: 'Sun',
        lagnaSignLord: ascLord,
        lagnaStarLord: 'Sun',
        lagnaSubLord: 'Sun',
        moonSignLord: SIGNS[moon.signIndex].lord,
        moonStarLord: nakDef.lord,
        moonSubLord: 'Moon',
        rulingPlanets: [],
      },
    },
    varshaphala: {
      year: targetYear,
      completedYears: Math.floor(paramayus.ageYears),
      varshaPraveshUtcIso: '',
      varshaPraveshLocal: '',
      varshaChart: chart,
      munthaSignIndex: ascSign,
      munthaSignName: chart.ascendant.signName,
      munthaHouse: 1,
      munthaPrediction: paramayus.messageEn,
      varshesh: ascLord,
      varsheshStrengthNote: paramayus.noteEn,
      panchadhikari: {
        munthaLord: ascLord,
        birthAscLord: ascLord,
        varshaAscLord: ascLord,
        triRashiLord: ascLord,
        dinRatriLord: ascLord,
      },
      sahams: [],
      muddaDasha: [],
      tajikaYogas: [],
      annualSummary: paramayus.messageEn,
    },
    jaiminiReport: {
      karakamshaSign: '-',
      swamsaSign: '-',
      karakamshaReading: paramayus.messageEn,
      arudhaPadas: [],
      charaDasha: [],
    },
    lalKitabReport: {
      planets: [],
      rins: [],
      generalUpay: [],
    },
    familyReport: {
      childhood: {
        score: 0,
        earlyDashas: '-',
        balyaSummary: paramayus.messageEn,
        upbringingStyle: '-',
        earlyEnvironment: '-',
      },
      mother: emptyFam('Mother', 'Matri'),
      father: emptyFam('Father', 'Pitri'),
      siblings: emptyFam('Siblings', 'Sahodara'),
      extendedFamily: emptyFam('Extended Family', 'Kutumba'),
      inLaws: emptyFam('In-Laws', 'Sasural'),
    },
    kundaliDoshas: {
      presentCount: 0,
      mitigatedCount: 0,
      doshas: [],
    },
    remedies: [],
    yutiReport: {
      groups: [],
      maxConjunctionCount: 0,
      soloPlanets: [],
      summaryEn: paramayus.messageEn,
      summaryHi: paramayus.messageHi,
    },
    lifeEventsLedger: {
      payaAndGandmool: {
        payaNameEn: 'Withheld (>120 Yrs)',
        payaNameHi: 'परमायु पूर्ण (>120 वर्ष)',
        payaTone: 'mixed',
        payaMeaningEn: paramayus.messageEn,
        payaMeaningHi: paramayus.messageHi,
        isGandmool: false,
        nakshatraNameEn: nakDef.name,
        nakshatraNameHi: nakDef.name,
        pada: moon.pada,
        gandmoolSeverity: 'None',
        gandmoolReadingEn: paramayus.noteEn,
        gandmoolReadingHi: paramayus.noteHi,
        shantiRemedyEn: '',
        shantiRemedyHi: '',
      },
      accidentProfile: {
        riskLevelEn: 'Locked (>120 Yrs)',
        riskLevelHi: 'अवरुद्ध (>120 वर्ष)',
        tone: 'mixed',
        riskTypesEn: paramayus.messageEn,
        riskTypesHi: paramayus.messageHi,
        cautionWindowsEn: '',
        cautionWindowsHi: '',
        precautionEn: '',
        precautionHi: '',
      },
      timelineEvents: [],
      timeline120Years: [],
      longevity: {
        categoryEn: paramayus.titleEn,
        categoryHi: paramayus.titleHi,
        pairScoreEn: '-',
        pairScoreHi: '-',
        hasAlpayuCaution: false,
        balarishtaStatusEn: paramayus.messageEn,
        balarishtaStatusHi: paramayus.messageHi,
        marakaWarningEn: '',
        marakaWarningHi: '',
        summaryEn: paramayus.noteEn,
        summaryHi: paramayus.noteHi,
        disclaimerEn: paramayus.messageEn,
        disclaimerHi: paramayus.messageHi,
      },
      deityAndMainPlanet: {
        ishtaDevataEn: '-',
        ishtaDevataHi: '-',
        ishtaBasisEn: paramayus.noteEn,
        ishtaBasisHi: paramayus.noteHi,
        ishtaMantra: '-',
        mainPlanetEn: '-',
        mainPlanetHi: '-',
        supportingKingsEn: '-',
        supportingKingsHi: '-',
      },
      qaLedger: [],
    },
    bhavatBhavamReport: {
      houses: [],
      keyDerivatives: [],
      summaryEn: paramayus.messageEn,
      summaryHi: paramayus.messageHi,
    },
    drishtiReport: {
      planetaryDrishtis: [],
      mutualOppositions: [],
      houseDrishtis: [],
      summaryEn: paramayus.messageEn,
      summaryHi: paramayus.messageHi,
    },
    bhriguNandiNadi: {
      directionLines: [],
      karmaCareerEn: paramayus.messageEn,
      karmaCareerHi: paramayus.messageHi,
      jivaWealthEn: '',
      jivaWealthHi: '',
      marriageNadiEn: '',
      marriageNadiHi: '',
      rahuKetuAxisEn: '',
      rahuKetuAxisHi: '',
      flankingKarmaEn: '',
      flankingKarmaHi: '',
      retrogradeShiftsEn: '',
      retrogradeShiftsHi: '',
      exchangesEn: '',
      exchangesHi: '',
      diseaseAlerts: [],
      guruCycles12Yr: [],
      specialRules: [],
      sources: [],
    },
  };
}

export function generatePredictionReport(chart: ChartData, targetDate?: string): PredictionReport {
  const dateStr = targetDate || new Date().toISOString().slice(0, 10);
  const targetYear = parseInt(dateStr.slice(0, 4), 10) || new Date().getFullYear();
  const paramayus = evaluateParamayusStatus(chart, dateStr);
  if (paramayus.exceeded) {
    return buildParamayusLockedReport(chart, dateStr, targetYear, paramayus);
  }
  const ascSign = chart.ascendant.signIndex;
  const lagnaKb = LAGNA_KB[ascSign];
  const lagnaExt = LAGNA_EXTENDED_KB[ascSign];

  const moon = chart.planets.find((p) => p.id === 'Moon')!;
  const nakKb = NAKSHATRA_KB[moon.nakshatraIndex];
  const nakDef = NAKSHATRAS[moon.nakshatraIndex];

  const akPlanet = chart.planets.find((p) => p.charaKaraka === 'AK') ?? chart.planets[0];
  const akTheme = ATMAKARAKA_THEMES[akPlanet.id as NineGrahaId] ?? ATMAKARAKA_THEMES.Sun;

  const planetPlacements: PlanetHousePrediction[] = NINE_GRAHAS.map((g) => {
    const body = chart.planets.find((p) => p.id === g)!;
    const ruled = SEVEN_PLANETS.includes(g as SevenPlanetId)
      ? housesRuledBy(g as SevenPlanetId, ascSign)
      : [];
    const kb = PLANET_IN_HOUSE_KB[g][body.rasiHouseNumber - 1];
    return {
      planet: g,
      house: body.rasiHouseNumber,
      signName: body.signName,
      dignity: body.dignity,
      lordOfHouses: ruled,
      headline: kb.headline,
      classicalReading: kb.reading,
      dignityModifier: buildDignityModifierText(body, ruled),
      sources: kb.sources,
    };
  });

  const houseLordships: HouseLordPrediction[] = Array.from({ length: 12 }, (_, idx) => {
    const lordHouse = idx + 1;
    const lordBody = getHouseLordPlanet(chart, lordHouse);
    const b144 = getBhavesha144Entry(lordHouse, lordBody.rasiHouseNumber);
    const { reading: bphsNote } = buildHouseLordReading(
      lordHouse,
      lordBody.rasiHouseNumber,
      lordBody.id,
      lordBody.dignity
    );
    return {
      lordHouse,
      planet: lordBody.id as SevenPlanetId,
      placedHouse: lordBody.rasiHouseNumber,
      placedSign: lordBody.signName,
      headline: `${b144.headlineEn} (${lordBody.id} in ${lordBody.signName}, ${lordBody.dignity})`,
      reading: `${b144.readingEn} Likely events: ${b144.eventEn} (${bphsNote})`,
      source: 'Classical Parashari Bhavesha Phala',
    };
  });

  const dashaForecast = buildDashaPrediction(chart, dateStr);
  const transitForecast = buildTransitForecast(chart, dateStr);
  const deepGochar = computeDeepGochar(chart, dateStr);
  const divisionalPredictions = buildDivisionalPredictions(chart);
  const lifeDomains = buildLifeDomains(chart);
  const kpReport = computeKpReport(chart);
  const varshaphala = computeVarshaphala(chart, targetYear);
  const jaiminiReport = computeJaiminiReport(chart);
  const lalKitabReport = computeLalKitabReport(chart);
  const familyReport = computeFamilyAndChildhood(chart);
  const kundaliDoshas = computeKundaliDoshas(chart);
  const remedies = buildRemedies(chart, dashaForecast);
  const planetInSigns = computePlanetInSignPredictions(chart);
  const planetInNakshatras = computePlanetInNakshatraPredictions(chart);
  const houseWisePredictions = computeHouseWisePredictions(chart);
  const degreePredictions = computeDegreePredictions(chart);
  const yutiReport = computeChartYutiReport(chart);
  const lifeEventsLedger = computeLifeEventsAndLedger(chart);
  const bhavatBhavamReport = computeBhavatBhavamReport(chart);
  const drishtiReport = computeDrishtiPredictions(chart);
  const bhriguNandiNadi = computeBhriguNandiNadi(chart);
  const pastFutureLife = computePastFutureLifeReading(chart);
  const advancedTechniques = computeAdvancedPredictiveTechniques(chart, dateStr);
  const classicalYogas = detectClassicalYogas(chart);
  const bhriguSaralPaddhati = computeBhriguSaralPaddhati(chart);
  const kpFourStepReport = computeKpFourStepReport(chart);
  const lalKitabSystemReport = computeLalKitabSystemReport(chart);
  const bhavarthaRatnakaraReport = computeBhavarthaRatnakaraReport(chart);

  return {
    paramayus,
    pastFutureLife,
    advancedTechniques,
    lagnaProfile: {
      signName: chart.ascendant.signName,
      sanskritName: chart.ascendant.sanskritName,
      ruler: lagnaKb.ruler,
      functionalBenefics: lagnaKb.functionalBenefics,
      beneficList: lagnaExt.beneficList,
      maleficList: lagnaExt.maleficList,
      neutralList: lagnaExt.neutralList,
      marakaList: lagnaExt.marakaList,
      yogakaraka: lagnaKb.yogakaraka,
      temperament: lagnaKb.temperament,
      physicalAppearance: lagnaExt.physicalAppearance,
      mentalQualities: lagnaExt.mentalQualities,
      careerIndicators: lagnaExt.careerIndicators,
      luckyColors: lagnaExt.luckyColors,
      luckyDays: lagnaExt.luckyDays,
      luckyNumbers: lagnaExt.luckyNumbers,
      luckyGem: lagnaExt.luckyGem,
      strengths: lagnaKb.strengths,
      cautions: lagnaKb.cautions,
      sources: ['BPHS Ch. 34', 'Brihat Jataka', 'Saravali', 'Laghu Parashari'],
    },
    nakshatraProfile: {
      name: nakDef.name,
      pada: moon.pada,
      lord: nakDef.lord,
      deity: nakDef.deity,
      coreNature: nakKb.coreNature,
      vocation: nakKb.vocation,
      growthPath: nakKb.growthPath,
      sources: ['Brihat Jataka', 'Taittiriya Brahmana', 'Phaladeepika'],
    },
    atmakarakaInsight: {
      planet: akPlanet.id,
      signName: akPlanet.signName,
      house: akPlanet.rasiHouseNumber,
      soulTheme: akTheme,
      source: 'Jaimini Sutras (Chara Atmakaraka)',
    },
    lifeDomains,
    planetInSigns,
    planetInNakshatras,
    planetPlacements,
    houseWisePredictions,
    houseLordships,
    degreePredictions,
    dashaForecast,
    transitForecast,
    deepGochar,
    divisionalPredictions,
    kpReport,
    varshaphala,
    jaiminiReport,
    lalKitabReport,
    familyReport,
    kundaliDoshas,
    remedies,
    yutiReport,
    lifeEventsLedger,
    bhavatBhavamReport,
    drishtiReport,
    bhriguNandiNadi,
    classicalYogas,
    bhriguSaralPaddhati,
    kpFourStepReport,
    lalKitabSystemReport,
    bhavarthaRatnakaraReport,
  };
}
