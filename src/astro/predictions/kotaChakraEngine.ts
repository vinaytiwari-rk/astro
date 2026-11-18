/**
 * Kota Chakra & Fort Defense Engine (कोटा चक्र एवं दुर्ग वेध महा-इंजन)
 * AV Astro Vibe — 100% Offline, Zero External API Dependency
 *
 * Implements:
 * 1. 4 Concentric Quadrangles of the Fort:
 *    - Stambha (Center / Throne / Prana)
 *    - Madhya Durg (Inner Fort / Resources)
 *    - Prakara (Boundary Wall / Battlements)
 *    - Bahya (Outer Perimeter / Environs)
 * 2. Kota Swami (Fort Lord) & Kota Pala (Fort Sentinel / Gatekeeper)
 * 3. Pravesha (Entry) vs Nirgama (Exit) transit vectors
 * 4. Assessment of Siege, Legal Conflict, Health Crisis & Triumph
 */

import { normalizeDeg } from '../time';
import type { ChartData, NineGrahaId } from '../types';

export type KotaSection = 'Stambha (Pillar / Throne)' | 'Durg (Inner Fort)' | 'Prakara (Boundary Walls)' | 'Bahya (Outer Perimeter)';
export type KotaSectionHi = 'स्तंभ (सिंहासन / प्राण केंद्र)' | 'दुर्ग (भीतरी किला / सामर्थ्य)' | 'प्राकार (परकोटा / प्राचीर)' | 'बाह्य (बाहरी सीमा)';

export interface PlanetKotaPlacement {
  planet: NineGrahaId;
  planetHi: string;
  isBenefic: boolean;
  section: KotaSection;
  sectionHi: KotaSectionHi;
  nakshatraName: string;
  nakshatraNameHi: string;
  entryExitMotion: 'Pravesha (Inward Motion)' | 'Nirgama (Outward Motion)';
  entryExitMotionHi: 'प्रवेश (भीतर आगमन)' | 'निर्गम (बाहर गमन)';
  battleRoleEn: string;
  battleRoleHi: string;
}

export interface KotaChakraReport {
  janmaNakshatra: string;
  janmaNakshatraHi: string;
  kotaSwami: NineGrahaId;
  kotaSwamiHi: string;
  kotaPala: NineGrahaId;
  kotaPalaHi: string;
  fortVulnerabilityStatus: 'Fortified & Triumphant' | 'Vulnerable / Under Siege' | 'Balanced Defense';
  fortVulnerabilityStatusHi: 'अभेद्य एवं विजयी' | 'अति संवेदनशील / घेराबंदी' | 'संतुलित रक्षा';
  fortVerdictEn: string;
  fortVerdictHi: string;
  stambhaPlanets: string[];
  durgPlanets: string[];
  prakaraPlanets: string[];
  bahyaPlanets: string[];
  placements: PlanetKotaPlacement[];
}

const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Moola', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const NAKSHATRA_NAMES_HI = [
  'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा',
  'पुनर्वसु', 'पुष्य', 'अश्लेषा', 'मघा', 'पूर्वा फाल्गुनी', 'उत्तरा फाल्गुनी',
  'हस्त', 'चित्रा', 'स्वाति', 'विशाखा', 'अनुराधा', 'ज्येष्ठा',
  'मूल', 'पूर्वाषाढ़ा', 'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा',
  'पूर्वा भाद्रपद', 'उत्तरा भाद्रपद', 'रेवती'
];

const PLANET_NAMES_HI: Record<NineGrahaId, string> = {
  Sun: 'सूर्य',
  Moon: 'चंद्र',
  Mars: 'मंगल',
  Mercury: 'बुध',
  Jupiter: 'गुरु',
  Venus: 'शुक्र',
  Saturn: 'शनि',
  Rahu: 'राहु',
  Ketu: 'केतु',
};

export function computeKotaChakra(chart: ChartData): KotaChakraReport {
  const moon = chart.planets.find((p) => p.id === 'Moon');
  const moonLon = moon ? moon.longitude : 0;
  const janmaNakIdx = Math.floor(normalizeDeg(moonLon) / (360 / 27));

  // Kota Swami: Lord of Janma Rashi
  const ascSign = chart.ascendant.signIndex;
  const moonSign = moon ? moon.signIndex : 0;
  const rashiLords: NineGrahaId[] = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
  const kotaSwami = rashiLords[moonSign];

  // Kota Pala: Lord of the Janma Nakshatra
  const nakLords: NineGrahaId[] = [
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  ];
  const kotaPala = nakLords[janmaNakIdx];

  const placements: PlanetKotaPlacement[] = [];
  const stambhaPlanets: string[] = [];
  const durgPlanets: string[] = [];
  const prakaraPlanets: string[] = [];
  const bahyaPlanets: string[] = [];

  let maleficInFort = 0;
  let beneficInFort = 0;

  for (const p of chart.planets) {
    if (!['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'].includes(p.id)) continue;
    const pid = p.id as NineGrahaId;
    const pNakIdx = Math.floor(normalizeDeg(p.longitude) / (360 / 27));

    // Distance in nakshatras from Janma Nakshatra (0..26)
    const dist = (pNakIdx - janmaNakIdx + 27) % 27;

    let section: KotaSection = 'Bahya (Outer Perimeter)';
    let sectionHi: KotaSectionHi = 'बाह्य (बाहरी सीमा)';
    let motion: PlanetKotaPlacement['entryExitMotion'] = 'Pravesha (Inward Motion)';
    let motionHi: PlanetKotaPlacement['entryExitMotionHi'] = 'प्रवेश (भीतर आगमन)';

    // Classical Kota allocation by nakshatra distance:
    // Stambha (Pillar / Throne): dist 0, 7, 14, 21
    if (dist === 0 || dist === 7 || dist === 14 || dist === 21) {
      section = 'Stambha (Pillar / Throne)';
      sectionHi = 'स्तंभ (सिंहासन / प्राण केंद्र)';
      stambhaPlanets.push(pid);
    }
    // Durg (Inner Fort): dist 1, 6, 8, 13, 15, 20, 22
    else if ([1, 6, 8, 13, 15, 20, 22].includes(dist)) {
      section = 'Durg (Inner Fort)';
      sectionHi = 'दुर्ग (भीतरी किला / सामर्थ्य)';
      durgPlanets.push(pid);
    }
    // Prakara (Ramparts): dist 2, 5, 9, 12, 16, 19, 23
    else if ([2, 5, 9, 12, 16, 19, 23].includes(dist)) {
      section = 'Prakara (Boundary Walls)';
      sectionHi = 'प्राकार (परकोटा / प्राचीर)';
      prakaraPlanets.push(pid);
    }
    // Bahya: rest
    else {
      section = 'Bahya (Outer Perimeter)';
      sectionHi = 'बाह्य (बाहरी सीमा)';
      bahyaPlanets.push(pid);
    }

    const isBenefic = ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(pid);
    if (section === 'Stambha (Pillar / Throne)' || section === 'Durg (Inner Fort)') {
      if (isBenefic) beneficInFort++;
      else maleficInFort++;
    }

    if (dist % 2 === 0) {
      motion = 'Pravesha (Inward Motion)';
      motionHi = 'प्रवेश (भीतर आगमन)';
    } else {
      motion = 'Nirgama (Outward Motion)';
      motionHi = 'निर्गम (बाहर गमन)';
    }

    placements.push({
      planet: pid,
      planetHi: PLANET_NAMES_HI[pid],
      isBenefic,
      section,
      sectionHi,
      nakshatraName: NAKSHATRA_NAMES[pNakIdx],
      nakshatraNameHi: NAKSHATRA_NAMES_HI[pNakIdx],
      entryExitMotion: motion,
      entryExitMotionHi: motionHi,
      battleRoleEn: isBenefic
        ? `Protective garrison fortifying the ${section}`
        : `Breaching siege force afflicting the ${section}`,
      battleRoleHi: isBenefic
        ? `${sectionHi} की रक्षा करने वाला शुभ ग्रहीय कवच`
        : `${sectionHi} पर दबाव डालने वाला पापी ग्रह वेध`,
    });
  }

  let fortStatus: KotaChakraReport['fortVulnerabilityStatus'] = 'Balanced Defense';
  let fortStatusHi: KotaChakraReport['fortVulnerabilityStatusHi'] = 'संतुलित रक्षा';
  let fortVerdictEn = '';
  let fortVerdictHi = '';

  if (maleficInFort > beneficInFort) {
    fortStatus = 'Vulnerable / Under Siege';
    fortStatusHi = 'अति संवेदनशील / घेराबंदी';
    fortVerdictEn =
      'Cruel malefics have breached the Inner Fort and Stambha; indicates intense vulnerability during high-stakes legal battles, political elections, or sudden health emergencies.';
    fortVerdictHi =
      'दुर्ग एवं स्तंभ में पापी ग्रहों का प्रवेश होने से यह समय कानूनी विवाद, चुनाव या स्वास्थ्य संबंधी संकट में अत्यधिक सतर्क रहने का संकेत देता है।';
  } else if (beneficInFort > maleficInFort) {
    fortStatus = 'Fortified & Triumphant';
    fortStatusHi = 'अभेद्य एवं विजयी';
    fortVerdictEn =
      'Benefic planets strongly guard the Pillar and Inner Fort; native retains unbroken resilience, winning contested challenges and overcoming opponents.';
    fortVerdictHi =
      'शुभ ग्रहों द्वारा स्तंभ व दुर्ग की सशक्त रक्षा हो रही है; जातक विपरीत परिस्थितियों और विरोधियों पर सहज विजय प्राप्त करेगा।';
  } else {
    fortStatus = 'Balanced Defense';
    fortStatusHi = 'संतुलित रक्षा';
    fortVerdictEn =
      'Equilibrium between defensive guards and outer pressures; strategic diplomacy and avoidance of hasty aggression will safeguard victory.';
    fortVerdictHi =
      'रक्षा एवं आक्रमणकारी शक्तियों में संतुलन है; धैर्य एवं कूटनीतिक सूझबूझ से जातक अपने हितों की सफल रक्षा कर सकेगा।';
  }

  return {
    janmaNakshatra: NAKSHATRA_NAMES[janmaNakIdx],
    janmaNakshatraHi: NAKSHATRA_NAMES_HI[janmaNakIdx],
    kotaSwami,
    kotaSwamiHi: PLANET_NAMES_HI[kotaSwami],
    kotaPala,
    kotaPalaHi: PLANET_NAMES_HI[kotaPala],
    fortVulnerabilityStatus: fortStatus,
    fortVulnerabilityStatusHi: fortStatusHi,
    fortVerdictEn,
    fortVerdictHi,
    stambhaPlanets,
    durgPlanets,
    prakaraPlanets,
    bahyaPlanets,
    placements,
  };
}
