import { SIGNS } from '../constants';
import type { ChartData } from '../types';

export interface IntimacyProfileReport {
  passionDriveScore: number; // Mars + 8th + 3rd + Mars-Venus links
  sensualWarmthScore: number; // Venus + 12th Shayana Sukha + D9 Venus
  emotionalIntimacyScore: number; // Moon + 4th/7th + D9 Moon
  eroticArchetype: string;
  venusStyle: string;
  marsDriveNote: string;
  shayanaSukhaNote: string;
  eighthHouseDepthNote: string;
  d9AndD30Note: string;
  relationshipNeeds: string[];
  guidance: string[];
}

function clamp(n: number): number {
  return Math.max(30, Math.min(96, Math.round(n)));
}

function digWeight(dignity: string): number {
  const m: Record<string, number> = {
    Exalted: 16,
    Moolatrikona: 14,
    'Own Sign': 12,
    'Great Friend': 9,
    Friend: 6,
    Neutral: 1,
    Enemy: -5,
    'Great Enemy': -8,
    Debilitated: -10,
  };
  return m[dignity] ?? 0;
}

const VENUS_ELEMENT_STYLES: Record<'Fire' | 'Earth' | 'Air' | 'Water', string> = {
  Fire: 'Warm, spontaneous, expressive, and energized by playful romance and direct physical affection.',
  Earth: 'Sensual, tactile, patient, and deeply grounded in touch, atmosphere, comfort, and physical presence.',
  Air: 'Communicative, curious, mentally stimulated, and drawn to witty flirting, novelty, and shared ideas.',
  Water: 'Tender, intuitive, deeply bonded, and responsive to emotional safety, devotion, and unspoken resonance.',
};

export function buildIntimacyProfile(chart: ChartData): IntimacyProfileReport {
  const ascSign = chart.ascendant.signIndex;
  const byId = new Map(chart.planets.map((p) => [p.id, p]));
  const sun = byId.get('Sun')!;
  const moon = byId.get('Moon')!;
  const mars = byId.get('Mars')!;
  const mercury = byId.get('Mercury')!;
  const jupiter = byId.get('Jupiter')!;
  const venus = byId.get('Venus')!;
  const saturn = byId.get('Saturn')!;
  const rahu = byId.get('Rahu')!;
  const ketu = byId.get('Ketu')!;

  const d9Venus = chart.divisionalCharts.D9.placements.find((p) => p.id === 'Venus')!;
  const d9Mars = chart.divisionalCharts.D9.placements.find((p) => p.id === 'Mars')!;
  const d30Venus = chart.divisionalCharts.D30.placements.find((p) => p.id === 'Venus')!;
  const d30Mars = chart.divisionalCharts.D30.placements.find((p) => p.id === 'Mars')!;

  const marsVenusDist = ((venus.signIndex - mars.signIndex + 12) % 12) + 1;
  const hasMarsVenusLink = [1, 5, 7, 9].includes(marsVenusDist);
  const rahuVenusLink = venus.signIndex === rahu.signIndex || ((rahu.signIndex - venus.signIndex + 12) % 12) + 1 === 7;
  const saturnVenusLink = venus.signIndex === saturn.signIndex || [3, 7, 10].includes(((venus.signIndex - saturn.signIndex + 12) % 12) + 1);

  const occ8 = chart.planets.filter((p) => p.rasiHouseNumber === 8);
  const occ12 = chart.planets.filter((p) => p.rasiHouseNumber === 12);
  const l12 = byId.get(SIGNS[(ascSign + 11) % 12].lord)!;
  const l8 = byId.get(SIGNS[(ascSign + 7) % 12].lord)!;

  const passionDriveScore = clamp(
    60 +
      digWeight(mars.dignity) * 0.7 +
      (hasMarsVenusLink ? 14 : 0) +
      (rahuVenusLink ? 8 : 0) +
      ([1, 3, 5, 7, 8, 12].includes(mars.rasiHouseNumber) ? 6 : 0) +
      (saturnVenusLink ? -6 : 0)
  );

  const sensualWarmthScore = clamp(
    62 +
      digWeight(venus.dignity) * 0.7 +
      digWeight(d9Venus.dignity) * 0.5 +
      (venus.isVargottama ? 8 : 0) +
      (venus.isCombust ? -7 : 0) +
      ([1, 2, 4, 5, 7, 11, 12].includes(venus.rasiHouseNumber) ? 6 : 0)
  );

  const emotionalIntimacyScore = clamp(
    61 +
      digWeight(moon.dignity) * 0.7 +
      (jupiter.signIndex === moon.signIndex || [5, 7, 9].includes(((moon.signIndex - jupiter.signIndex + 12) % 12) + 1) ? 9 : 0) +
      (saturn.signIndex === moon.signIndex ? -6 : 0)
  );

  const venusElem = SIGNS[venus.signIndex].element;
  let eroticArchetype = 'Balanced & Devoted Companion';
  if (hasMarsVenusLink && passionDriveScore >= 75) {
    eroticArchetype = 'Magnetic & High-Passion Romantic';
  } else if (rahuVenusLink) {
    eroticArchetype = 'Intense, Unconventional & Boundary-Exploring';
  } else if (saturnVenusLink || ketu.rasiHouseNumber === 12) {
    eroticArchetype = 'Selective, Controlled & Deeply Loyal';
  } else if (venusElem === 'Earth' || venusElem === 'Water') {
    eroticArchetype = 'Sensual, Tactile & Emotionally Anchored';
  } else if (venusElem === 'Air') {
    eroticArchetype = 'Playful, Communicative & Mentally Driven';
  }

  const venusStyle = `Venus in ${venus.signName} (${venusElem}, House ${venus.rasiHouseNumber}, ${venus.dignity}): ${VENUS_ELEMENT_STYLES[venusElem]}${venus.isCombust ? ' Note: solar proximity internalizes romantic desire until deep trust forms.' : ''}`;

  const marsDriveNote = `Mars in ${mars.signName} (House ${mars.rasiHouseNumber}, ${mars.dignity}) governs stamina, pursuit, and erotic initiative.${hasMarsVenusLink ? ` Strong Mars–Venus ${marsVenusDist === 1 ? 'conjunction' : `${marsVenusDist}th link`} heightens physical attraction and romantic vitality.` : ''}`;

  const shayanaSukhaNote = `12th house (Shayana Sukha — bedroom bliss & sensory rest) is ruled by ${l12.id} (placed in House ${l12.rasiHouseNumber}, ${l12.dignity})${occ12.length ? ` and hosts ${occ12.map((p) => p.id).join(', ')}` : ''}. ${occ12.some((p) => ['Venus', 'Jupiter', 'Moon'].includes(p.id)) ? 'Benefics in the 12th classically bless sensual fulfillment and restful intimacy.' : occ12.some((p) => ['Saturn', 'Ketu', 'Sun'].includes(p.id)) ? 'Requires unhurried relaxation, privacy, and releasing daytime work stress before intimacy.' : 'Smooth intimacy unfolds when daily rest and emotional harmony align.'}`;

  const eighthHouseDepthNote = `8th house (deep bonding, vulnerability & shared desire) is ruled by ${l8.id} in House ${l8.rasiHouseNumber}${occ8.length ? ` with ${occ8.map((p) => p.id).join(', ')} inside` : ''}. ${occ8.some((p) => ['Mars', 'Rahu', 'Venus'].includes(p.id)) ? 'Indicates intense, magnetic physical chemistry and strong transformative desire.' : 'Emphasizes steady trust and emotional transparency for deep physical openness.'}`;

  const d9AndD30Note = `In D9 Navamsa, Venus sits in ${d9Venus.signName} (${d9Venus.dignity}) and Mars in ${d9Mars.signName} (${d9Mars.dignity}); in D30 Trimsamsa (subconscious impulses & restraint), Venus is in ${d30Venus.signName} and Mars in ${d30Mars.signName}.`;

  const relationshipNeeds: string[] = [];
  if (mercury.signIndex === venus.signIndex || venusElem === 'Air') {
    relationshipNeeds.push('Verbal warmth, playful humor, and open conversation heighten attraction.');
  }
  if (venusElem === 'Water' || moon.rasiHouseNumber === 7 || moon.rasiHouseNumber === 12) {
    relationshipNeeds.push('Emotional tenderness and unhurried reassurance unlock deepest physical responsiveness.');
  }
  if (venusElem === 'Earth' || sun.rasiHouseNumber === 7) {
    relationshipNeeds.push('Consistent loyalty, tactile affection, and dignified mutual respect build lasting passion.');
  }
  if (rahuVenusLink || occ8.some((p) => p.id === 'Rahu')) {
    relationshipNeeds.push('Curiosity, novelty, and honest boundary-setting keep desire vibrant without restlessness.');
  }
  if (relationshipNeeds.length === 0) {
    relationshipNeeds.push('Balanced rhythm of physical affection, shared leisure, and mutual emotional presence.');
  }

  const guidance = [
    `Strongest Kama channel: ${passionDriveScore >= sensualWarmthScore ? 'assertive Martian chemistry & excitement' : 'Venusian atmosphere, comfort & unhurried sensuality'}.`,
    saturnVenusLink || l12.id === 'Saturn'
      ? 'Protect dedicated private time from work/responsibility fatigue so intimacy never feels postponed.'
      : 'Keep communication candid about emotional and physical rhythms for enduring fulfillment.',
  ];

  return {
    passionDriveScore,
    sensualWarmthScore,
    emotionalIntimacyScore,
    eroticArchetype,
    venusStyle,
    marsDriveNote,
    shayanaSukhaNote,
    eighthHouseDepthNote,
    d9AndD30Note,
    relationshipNeeds,
    guidance,
  };
}
