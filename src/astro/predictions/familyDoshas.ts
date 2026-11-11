import { SIGNS } from '../constants';
import { formatLocalDateTimeFromUtc } from '../time';
import type { BodyPosition, ChartData } from '../types';

export interface FamilyMemberReading {
  role: string;
  sanskrit: string;
  score: number; // 1..100 harmony/support index
  keyIndicators: string;
  reading: string;
  vargaNote: string;
}

export interface ChildhoodReport {
  score: number;
  earlyDashas: string;
  balyaSummary: string;
  upbringingStyle: string;
  earlyEnvironment: string;
}

export interface FamilyChildhoodReport {
  childhood: ChildhoodReport;
  mother: FamilyMemberReading;
  father: FamilyMemberReading;
  siblings: FamilyMemberReading;
  extendedFamily: FamilyMemberReading;
  inLaws: FamilyMemberReading;
}

export interface DoshaCheckResult {
  name: string;
  status: 'Present' | 'Mitigated (Cancelled)' | 'Clear';
  severity: 'High' | 'Moderate' | 'Mild' | 'None';
  trigger: string;
  mitigation: string;
  effect: string;
  remedy: string;
}

export interface KundaliDoshaReport {
  presentCount: number;
  mitigatedCount: number;
  doshas: DoshaCheckResult[];
}

const KALA_SARPA_NAMES = [
  'Anant (H1–H7)',
  'Kulik (H2–H8)',
  'Vasuki (H3–H9)',
  'Shankhpal (H4–H10)',
  'Padma (H5–H11)',
  'Mahapadma (H6–H12)',
  'Takshak (H7–H1)',
  'Karkotak (H8–H2)',
  'Shankhachud (H9–H3)',
  'Ghatak (H10–H4)',
  'Vishdhar (H11–H5)',
  'Sheshnag (H12–H6)',
];

function clamp(n: number): number {
  return Math.max(30, Math.min(96, Math.round(n)));
}

function digBonus(dignity: string): number {
  const m: Record<string, number> = {
    Exalted: 16,
    Moolatrikona: 14,
    'Own Sign': 12,
    'Great Friend': 8,
    Friend: 5,
    Neutral: 0,
    Enemy: -5,
    'Great Enemy': -8,
    Debilitated: -10,
  };
  return m[dignity] ?? 0;
}

function houseDist(fromSign: number, toSign: number): number {
  return ((toSign - fromSign + 12) % 12) + 1;
}

function isAspecting(aspecter: BodyPosition, targetSign: number): boolean {
  const d = houseDist(aspecter.signIndex, targetSign);
  if (d === 7) return true;
  if (aspecter.id === 'Jupiter' && (d === 5 || d === 9)) return true;
  if (aspecter.id === 'Mars' && (d === 4 || d === 8)) return true;
  if (aspecter.id === 'Saturn' && (d === 3 || d === 10)) return true;
  return false;
}

export function computeFamilyAndChildhood(chart: ChartData): FamilyChildhoodReport {
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

  const getLord = (h: number) => byId.get(SIGNS[(ascSign + h - 1) % 12].lord)!;
  const savAt = (h: number) => chart.ashtakavarga.sarva[(ascSign + h - 1) % 12];
  const d12Pl = (id: string) => chart.divisionalCharts.D12.placements.find((p) => p.id === id)!;
  const d3Pl = (id: string) => chart.divisionalCharts.D3.placements.find((p) => p.id === id)!;

  const l1 = getLord(1);
  const l2 = getLord(2);
  const l3 = getLord(3);
  const l4 = getLord(4);
  const l6 = getLord(6);
  const l8 = getLord(8);
  const l9 = getLord(9);
  const l11 = getLord(11);

  // Childhood (Ages 0–12)
  const age12Ms = chart.utcMs + 12 * 365.2425 * 86_400_000;
  const earlyDashasList = chart.vimshottari.filter(
    (m) => m.endMs > chart.utcMs && m.startMs < age12Ms
  );
  const earlyDashas = earlyDashasList
    .map(
      (m) =>
        `${m.lord} (${formatLocalDateTimeFromUtc(Math.max(m.startMs, chart.utcMs), chart.offsetMinutesUsed).slice(0, 4)}–${formatLocalDateTimeFromUtc(Math.min(m.endMs, age12Ms), chart.offsetMinutesUsed).slice(0, 4)})`
    )
    .join(' → ');

  const h4Occ = chart.planets.filter((p) => p.rasiHouseNumber === 4).map((p) => p.id);
  const childhoodScore = clamp(
    60 +
      digBonus(moon.dignity) * 0.6 +
      digBonus(l1.dignity) * 0.4 +
      digBonus(l4.dignity) * 0.5 +
      (savAt(4) - 28) * 0.9 +
      (isAspecting(jupiter, ascSign) || isAspecting(jupiter, moon.signIndex) ? 8 : 0)
  );

  const firstMd = earlyDashasList[0]?.lord ?? 'Moon';
  const earlyDashaTone =
    ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(firstMd)
      ? `Running ${firstMd} Mahadasha in early life generally favored learning, affectionate care, and steady protection.`
      : ['Saturn', 'Mars', 'Rahu', 'Ketu'].includes(firstMd)
        ? `Running ${firstMd} Mahadasha during childhood cultivated early independence, maturity, or changes in environment.`
        : `Running ${firstMd} Mahadasha instilled early pride, duty, and structured upbringing.`;

  const childhood: ChildhoodReport = {
    score: childhoodScore,
    earlyDashas,
    balyaSummary: `${earlyDashaTone} Moon in ${moon.signName} (House ${moon.rasiHouseNumber}, ${moon.dignity}) and 4th lord ${l4.id} in House ${l4.rasiHouseNumber} shape early emotional security.`,
    upbringingStyle:
      h4Occ.some((x) => ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(x))
        ? `Benefic presence in the 4th house (${h4Occ.join(', ')}) reflects a nurturing, cultured, or education-focused household.`
        : h4Occ.some((x) => ['Saturn', 'Rahu', 'Ketu', 'Mars'].includes(x))
          ? `Planets in the 4th house (${h4Occ.join(', ')}) point to disciplined routines, possible relocations, or early self-reliance.`
          : `Unoccupied 4th house places home atmosphere squarely on 4th lord ${l4.id} in House ${l4.rasiHouseNumber} (${l4.signName}).`,
    earlyEnvironment: `Lagna Lord ${l1.id} (${l1.dignity}) and ${chart.panchang.nakshatra.name} Moon describe early curiosity, health recovery, and childhood temperament.`,
  };

  // Mother (4th House, Moon, Matrukaraka MK, D12)
  const mk = chart.planets.find((p) => p.charaKaraka === 'MK') ?? moon;
  const d12Moon = d12Pl('Moon');
  const d12L4 = d12Pl(l4.id);
  const motherScore = clamp(
    60 + digBonus(moon.dignity) * 0.6 + digBonus(l4.dignity) * 0.6 + digBonus(d12Moon.dignity) * 0.4 + (savAt(4) - 28)
  );
  const mother: FamilyMemberReading = {
    role: 'Mother',
    sanskrit: 'Matri Bhava (H4, Moon & D12)',
    score: motherScore,
    keyIndicators: `4th Lord: ${l4.id} (H${l4.rasiHouseNumber}) · Moon: ${moon.signName} · MK: ${mk.id}`,
    reading: `Mother's warmth and influence reflect through Moon in ${moon.signName} (${moon.dignity}) and 4th lord ${l4.id} in House ${l4.rasiHouseNumber}. ${
      motherScore >= 70
        ? 'Indicates strong maternal support, emotional grounding, and lasting domestic blessing.'
        : 'Suggests a strong-willed or hardworking mother whose resilience taught early practical lessons; attentive care for maternal health pays dividends.'
    }`,
    vargaNote: `In D12 Dwadasamsa (Lineage), Moon sits in ${d12Moon.signName} (H${d12Moon.houseFromVargaLagna}, ${d12Moon.dignity}) and 4th lord ${l4.id} in ${d12L4.signName} (${d12L4.dignity}).`,
  };

  // Father (9th House/Lord, Sun, Pitrukaraka PiK/AK, D12)
  const pik = chart.planets.find((p) => p.charaKaraka === 'PiK') ?? sun;
  const d12Sun = d12Pl('Sun');
  const d12L9 = d12Pl(l9.id);
  const fatherScore = clamp(
    60 + digBonus(sun.dignity) * 0.6 + digBonus(l9.dignity) * 0.6 + digBonus(d12Sun.dignity) * 0.4 + (savAt(9) - 28)
  );
  const father: FamilyMemberReading = {
    role: 'Father',
    sanskrit: 'Pitri Bhava (H9, Sun & D12)',
    score: fatherScore,
    keyIndicators: `9th Lord: ${l9.id} (H${l9.rasiHouseNumber}) · Sun: ${sun.signName} (H${sun.rasiHouseNumber})`,
    reading: `Father's stature, ethics, and mentorship align with Sun in ${sun.signName} (${sun.dignity}) and 9th lord ${l9.id} in House ${l9.rasiHouseNumber}. ${
      sun.signIndex === rahu.signIndex || sun.signIndex === saturn.signIndex
        ? 'Sun–Saturn/Rahu contact indicates a self-made, disciplined, or unconventional father with strong philosophical differences or distance at times, evolving into mutual respect.'
        : fatherScore >= 70
          ? 'Blesses honorable paternal standing, sound guidance, and heritage support.'
          : 'Calls for honoring paternal traditions while carving an independent path.'
    }`,
    vargaNote: `In D12 Dwadasamsa, Sun occupies ${d12Sun.signName} (H${d12Sun.houseFromVargaLagna}, ${d12Sun.dignity}) and 9th lord ${l9.id} sits in ${d12L9.signName} (${d12L9.dignity}). Ancestral Karaka ${pik.id} is in H${pik.rasiHouseNumber}.`,
  };

  // Siblings (3rd Younger, 11th Elder, Mars, BK, D3)
  const bk = chart.planets.find((p) => p.charaKaraka === 'BK') ?? mars;
  const d3Mars = d3Pl('Mars');
  const d3L3 = d3Pl(l3.id);
  const h3Occ = chart.planets.filter((p) => p.rasiHouseNumber === 3).map((p) => p.id);
  const h11Occ = chart.planets.filter((p) => p.rasiHouseNumber === 11).map((p) => p.id);
  const siblingsScore = clamp(
    59 + digBonus(l3.dignity) * 0.5 + digBonus(l11.dignity) * 0.4 + digBonus(mars.dignity) * 0.4 + (savAt(3) - 28) * 0.8
  );
  const siblings: FamilyMemberReading = {
    role: 'Siblings & Cousins',
    sanskrit: 'Bhratru Bhava (H3, H11, Mars & D3)',
    score: siblingsScore,
    keyIndicators: `3rd Lord: ${l3.id} (H${l3.rasiHouseNumber}) · 11th Lord: ${l11.id} (H${l11.rasiHouseNumber}) · BK: ${bk.id}`,
    reading: `Younger siblings are seen from the 3rd house (${savAt(3)} SAV${h3Occ.length ? `, occupied by ${h3Occ.join(', ')}` : ''}) and elder siblings from the 11th (${savAt(11)} SAV${h11Occ.length ? `, occupied by ${h11Occ.join(', ')}` : ''}). ${
      [3, 11].includes(jupiter.rasiHouseNumber) || isAspecting(jupiter, (ascSign + 2) % 12)
        ? 'Jupiterian influence promises helpful, principled siblings or enduring peer camaraderie.'
        : 'Indicates spirited, independent siblings whose paths may diverge geographically while retaining core loyalty.'
    }`,
    vargaNote: `In D3 Drekkana (Siblings chart), Mars is in ${d3Mars.signName} (H${d3Mars.houseFromVargaLagna}, ${d3Mars.dignity}) and 3rd lord ${l3.id} occupies ${d3L3.signName} (${d3L3.dignity}).`,
  };

  // Extended Family & Kutumba (2nd & 6th Houses)
  const h2Occ = chart.planets.filter((p) => p.rasiHouseNumber === 2).map((p) => p.id);
  const extScore = clamp(60 + digBonus(l2.dignity) * 0.6 + (savAt(2) - 28) * 1.1);
  const extendedFamily: FamilyMemberReading = {
    role: 'Extended Family & Maternal Kin',
    sanskrit: 'Kutumba (H2) & Matula (H6)',
    score: extScore,
    keyIndicators: `2nd Lord: ${l2.id} (H${l2.rasiHouseNumber}) · 6th Lord: ${l6.id} (H${l6.rasiHouseNumber}) · Mercury: H${mercury.rasiHouseNumber}`,
    reading: `Kutumba Bhava (2nd house, ${savAt(2)} SAV${h2Occ.length ? `, hosting ${h2Occ.join(', ')}` : ''}) reflects extended family culture, shared gatherings, and lineage traditions. Maternal uncles/aunts and broader relatives appear via the 6th house & Mercury (${mercury.dignity} in ${mercury.signName}).`,
    vargaNote: `D12 Lagna sits in ${SIGNS[chart.divisionalCharts.D12.lagnaSignIndex].name}; 2nd lord ${l2.id} holds ${d12Pl(l2.id).dignity} dignity in D12.`,
  };

  // In-Laws (8th House = 2nd from 7th)
  const inLawScore = clamp(58 + digBonus(l8.dignity) * 0.5 + (savAt(8) - 28) * 0.9);
  const inLaws: FamilyMemberReading = {
    role: 'In-Laws & Partner Family',
    sanskrit: '8th House (2nd from 7th) & D9',
    score: inLawScore,
    keyIndicators: `8th Lord: ${l8.id} (H${l8.rasiHouseNumber}) · D9 2nd House`,
    reading: `Relations with spouse's family reflect through the 8th house (${savAt(8)} SAV) and its ruler ${l8.id} (${l8.dignity}). ${
      [1, 5, 7, 9, 11].includes(l8.rasiHouseNumber) || isAspecting(jupiter, (ascSign + 7) % 12)
        ? 'Supportive connection with in-laws, potential joint family resources, and respectful mutual boundaries.'
        : 'Diplomatic boundaries and clear financial/domestic communication keep in-law ties smooth.'
    }`,
    vargaNote: `In D9 Navamsa, Venus occupies ${chart.divisionalCharts.D9.placements.find((p) => p.id === 'Venus')!.signName} and 8th lord ${l8.id} is in ${chart.divisionalCharts.D9.placements.find((p) => p.id === l8.id)!.signName}.`,
  };

  return {
    childhood,
    mother,
    father,
    siblings,
    extendedFamily,
    inLaws,
  };
}

export function computeKundaliDoshas(chart: ChartData): KundaliDoshaReport {
  const ascSign = chart.ascendant.signIndex;
  const byId = new Map(chart.planets.map((p) => [p.id, p]));
  const sun = byId.get('Sun')!;
  const moon = byId.get('Moon')!;
  const mars = byId.get('Mars')!;
  const jupiter = byId.get('Jupiter')!;
  const venus = byId.get('Venus')!;
  const saturn = byId.get('Saturn')!;
  const rahu = byId.get('Rahu')!;
  const ketu = byId.get('Ketu')!;

  const doshas: DoshaCheckResult[] = [];

  // 1. Kuja / Manglik Dosha (Lagna, Moon, Venus)
  const manglikSet = new Set([1, 2, 4, 7, 8, 12]);
  const hMarsLagna = mars.rasiHouseNumber;
  const hMarsMoon = houseDist(moon.signIndex, mars.signIndex);
  const hMarsVenus = houseDist(venus.signIndex, mars.signIndex);
  const marsInManglik = manglikSet.has(hMarsLagna) || manglikSet.has(hMarsMoon);
  const manglikMitigated =
    ['Exalted', 'Moolatrikona', 'Own Sign'].includes(mars.dignity) ||
    mars.signIndex === jupiter.signIndex ||
    isAspecting(jupiter, mars.signIndex) ||
    (hMarsLagna === 2 && [2, 5].includes(mars.signIndex)) ||
    (hMarsLagna === 12 && [1, 6].includes(mars.signIndex)) ||
    (hMarsLagna === 7 && [3, 9].includes(mars.signIndex));

  doshas.push({
    name: 'Manglik / Kuja Dosha',
    status: !marsInManglik ? 'Clear' : manglikMitigated ? 'Mitigated (Cancelled)' : 'Present',
    severity: !marsInManglik ? 'None' : manglikMitigated ? 'Mild' : manglikSet.has(hMarsLagna) ? 'Moderate' : 'Mild',
    trigger: marsInManglik
      ? `Mars in House ${hMarsLagna} from Lagna, House ${hMarsMoon} from Moon, House ${hMarsVenus} from Venus.`
      : `Mars in House ${hMarsLagna} from Lagna and House ${hMarsMoon} from Moon (non-Manglik houses).`,
    mitigation: manglikMitigated
      ? `Mitigated by Mars's strong dignity (${mars.dignity}) or Jupiter's protective link.`
      : 'Check Papa-Samyam and partner Mars placement in Kundali Matching.',
    effect: 'Can intensify relationship passion, impatience, or domestic friction if unmatched.',
    remedy: 'Hanuman Chalisa on Tuesdays, calm conflict communication, and matching partner chart balance.',
  });

  // 2. Kala Sarpa Dosha (all 7 planets between Rahu and Ketu)
  const rLon = rahu.longitude;
  const kLon = ketu.longitude;
  const arcSpan = ((kLon - rLon + 360) % 360);
  const seven = [sun, moon, mars, byId.get('Mercury')!, jupiter, venus, saturn];
  const allFwd = seven.every((p) => ((p.longitude - rLon + 360) % 360) < arcSpan);
  const allBwd = seven.every((p) => ((p.longitude - kLon + 360) % 360) < (360 - arcSpan));
  const hasKalaSarpa = allFwd || allBwd;
  const ksType = KALA_SARPA_NAMES[rahu.rasiHouseNumber - 1];
  const ksPartial = !hasKalaSarpa && seven.filter((p) => ((p.longitude - rLon + 360) % 360) < arcSpan).length >= 6;

  doshas.push({
    name: hasKalaSarpa ? `Kala Sarpa Dosha — ${ksType}` : 'Kala Sarpa Dosha',
    status: hasKalaSarpa ? 'Present' : ksPartial ? 'Mitigated (Cancelled)' : 'Clear',
    severity: hasKalaSarpa ? 'High' : 'None',
    trigger: hasKalaSarpa
      ? `All seven planets are hemmed on one side of the Rahu (H${rahu.rasiHouseNumber}) – Ketu (H${ketu.rasiHouseNumber}) axis.`
      : ksPartial
        ? 'Six planets fall on one side, but one planet breaks the hem (Kala Sarpa Yoga Bhanga).'
        : 'Planets are distributed across both sides of the Rahu–Ketu axis.',
    mitigation: ksPartial ? 'Broken by planet outside the nodal arc.' : 'Often channels extraordinary focus and late-blooming achievement.',
    effect: 'Creates intense karmic focus, periodic sudden turns, and strong ambition after age 33–42.',
    remedy: 'Shiva Abhishek / Rudrabhishek, Maha Mrityunjaya Mantra, and disciplined ethical grounding.',
  });

  // 3. Pitra Dosha
  const l9 = SIGNS[(ascSign + 8) % 12].lord;
  const l9Body = byId.get(l9)!;
  const sunAfflicted =
    sun.signIndex === rahu.signIndex ||
    sun.signIndex === ketu.signIndex ||
    sun.signIndex === saturn.signIndex;
  const ninthAfflicted =
    [rahu.rasiHouseNumber, ketu.rasiHouseNumber, saturn.rasiHouseNumber].includes(9) ||
    l9Body.signIndex === rahu.signIndex ||
    l9Body.signIndex === saturn.signIndex;
  const pitraPresent = sunAfflicted || (ninthAfflicted && [6, 8, 12].includes(l9Body.rasiHouseNumber));
  const pitraMitigated =
    pitraPresent && (isAspecting(jupiter, sun.signIndex) || jupiter.rasiHouseNumber === 9 || jupiter.signIndex === l9Body.signIndex);

  doshas.push({
    name: 'Pitra Dosha',
    status: !pitraPresent ? 'Clear' : pitraMitigated ? 'Mitigated (Cancelled)' : 'Present',
    severity: !pitraPresent ? 'None' : pitraMitigated ? 'Mild' : 'Moderate',
    trigger: pitraPresent
      ? `Sun (H${sun.rasiHouseNumber}) or 9th house/lord (${l9} in H${l9Body.rasiHouseNumber}) conjoins Saturn/Rahu/Ketu.`
      : 'Sun and 9th house/lord are free from heavy nodal or Saturnian conjunctions.',
    mitigation: pitraMitigated ? 'Jupiterian aspect/association protects ancestral dharma.' : 'Mitigated through honoring elders and ancestral charity.',
    effect: 'Invites patience with paternal lineage responsibilities, delays in luck until duties are honored.',
    remedy: 'Honor parents/elders, offer food/water charity on Amavasya, and plant/tend a sacred tree.',
  });

  // 4. Guru Chandal Dosha (Jupiter + Rahu/Ketu)
  const guruChandal = jupiter.signIndex === rahu.signIndex || jupiter.signIndex === ketu.signIndex;
  const gcMitigated = guruChandal && ['Exalted', 'Moolatrikona', 'Own Sign'].includes(jupiter.dignity);
  doshas.push({
    name: 'Guru Chandal Dosha',
    status: !guruChandal ? 'Clear' : gcMitigated ? 'Mitigated (Cancelled)' : 'Present',
    severity: !guruChandal ? 'None' : gcMitigated ? 'Mild' : 'Moderate',
    trigger: guruChandal
      ? `Jupiter conjoins ${jupiter.signIndex === rahu.signIndex ? 'Rahu' : 'Ketu'} in ${jupiter.signName} (House ${jupiter.rasiHouseNumber}).`
      : 'Jupiter is not conjoined with Rahu or Ketu.',
    mitigation: gcMitigated ? `Jupiter is ${jupiter.dignity}, converting this into unorthodox philosophical brilliance.` : 'Cultivate sincere mentorship and principled decisions.',
    effect: 'Can challenge traditional beliefs or mentors while granting sharp unconventional intellect.',
    remedy: 'Respect teachers, study classical wisdom, and donate yellow items/books on Thursdays.',
  });

  // 5. Shrapit Dosha (Saturn + Rahu)
  const shrapit = saturn.signIndex === rahu.signIndex;
  const shrapitMitigated = shrapit && (isAspecting(jupiter, saturn.signIndex) || jupiter.signIndex === saturn.signIndex);
  doshas.push({
    name: 'Shrapit Dosha (Saturn + Rahu)',
    status: !shrapit ? 'Clear' : shrapitMitigated ? 'Mitigated (Cancelled)' : 'Present',
    severity: !shrapit ? 'None' : shrapitMitigated ? 'Mild' : 'Moderate',
    trigger: shrapit
      ? `Saturn and Rahu conjoin in ${saturn.signName} (House ${saturn.rasiHouseNumber}).`
      : 'Saturn and Rahu occupy different signs.',
    mitigation: shrapitMitigated ? 'Jupiter’s gaze softens karmic friction.' : 'Steady perseverance overcomes delayed rewards.',
    effect: 'Karmic tests requiring extra patience, honesty, and resilience under heavy workloads.',
    remedy: 'Serve elders/workers respectfully on Saturdays and practice Shiva/Hanuman meditation.',
  });

  // 6. Grahan Dosha (Sun/Moon with Rahu/Ketu)
  const sunGrahan = sun.signIndex === rahu.signIndex || sun.signIndex === ketu.signIndex;
  const moonGrahan = moon.signIndex === rahu.signIndex || moon.signIndex === ketu.signIndex;
  const grahanPresent = sunGrahan || moonGrahan;
  doshas.push({
    name: 'Grahan Dosha (Eclipse Conjunction)',
    status: grahanPresent ? 'Present' : 'Clear',
    severity: sunGrahan && moonGrahan ? 'High' : grahanPresent ? 'Moderate' : 'None',
    trigger: grahanPresent
      ? `${sunGrahan ? `Sun with node in ${sun.signName}` : ''}${sunGrahan && moonGrahan ? ' & ' : ''}${moonGrahan ? `Moon with node in ${moon.signName}` : ''}.`
      : 'Neither Sun nor Moon shares a sign with Rahu or Ketu.',
    mitigation: 'Checking exact degree orb and Jupiter’s aspect helps assess intensity.',
    effect: 'Heightens mental sensitivity or inner questioning around identity/emotions; breeds strong intuition once channeled.',
    remedy: 'Morning sunlight / Surya Arghya (if solar) or peaceful Monday meditation & rice charity (if lunar).',
  });

  // 7. Vish Dosha (Saturn + Moon) & Angarak Dosha (Mars + Rahu/Ketu)
  const vishPresent = saturn.signIndex === moon.signIndex;
  const angarakPresent = mars.signIndex === rahu.signIndex || mars.signIndex === ketu.signIndex;
  doshas.push({
    name: 'Vish Dosha (Saturn + Moon) / Angarak (Mars + Node)',
    status: vishPresent || angarakPresent ? 'Present' : 'Clear',
    severity: vishPresent && angarakPresent ? 'High' : vishPresent || angarakPresent ? 'Moderate' : 'None',
    trigger:
      vishPresent || angarakPresent
        ? `${vishPresent ? `Saturn+Moon in ${moon.signName}` : ''}${vishPresent && angarakPresent ? '; ' : ''}${angarakPresent ? `Mars+Node in ${mars.signName}` : ''}.`
        : 'Moon is separated from Saturn and Mars is separated from Rahu/Ketu.',
    mitigation: 'Waxing Moon or benefic aspects greatly calm emotional/impulsive swings.',
    effect: vishPresent ? 'Tends toward serious overthinking or solitary moods.' : 'Can amplify fierce temper or bold restless drive if ungrounded.',
    remedy: 'Breathwork (Pranayama), steady exercise, and calming Shiva/Hanuman prayer.',
  });

  // 8. Kemadruma Dosha
  const nonNodal = [mars, byId.get('Mercury')!, jupiter, venus, saturn];
  const occ2FromMoon = nonNodal.some((p) => houseDist(moon.signIndex, p.signIndex) === 2);
  const occ12FromMoon = nonNodal.some((p) => houseDist(moon.signIndex, p.signIndex) === 12);
  const occ1FromMoon = nonNodal.some((p) => p.signIndex === moon.signIndex);
  const kemadrumaRaw = !occ2FromMoon && !occ12FromMoon && !occ1FromMoon;
  const kemadrumaCancelled =
    kemadrumaRaw &&
    (nonNodal.some((p) => [1, 4, 7, 10].includes(p.rasiHouseNumber)) || isAspecting(jupiter, moon.signIndex));

  doshas.push({
    name: 'Kemadruma Dosha (Isolated Moon)',
    status: !kemadrumaRaw ? 'Clear' : kemadrumaCancelled ? 'Mitigated (Cancelled)' : 'Present',
    severity: !kemadrumaRaw || kemadrumaCancelled ? 'None' : 'Moderate',
    trigger: kemadrumaRaw
      ? `No planets (excluding Sun/Nodes) occupy the 1st, 2nd, or 12th signs from Moon (${moon.signName}).`
      : 'Moon is flanked or joined by planetary companions.',
    mitigation: kemadrumaCancelled ? 'Cancelled by planetary presence in Kendras from Lagna or Jupiterian aspect.' : 'Builds strong self-made independence.',
    effect: 'Periods of feeling emotionally self-reliant; thrives through community service and grounding routines.',
    remedy: 'Monday mindfulness, nourishing hydration, and caring connection with elders/community.',
  });

  // 9. Gandmool Nakshatra & Gandanta Junction Check
  const gandmoolNaks = new Set(['Ashwini', 'Ashlesha', 'Magha', 'Jyeshtha', 'Mula', 'Revati']);
  const isGandmool = gandmoolNaks.has(chart.panchang.nakshatra.name);
  const isGandantaDegree = (lon: number) => {
    const s = Math.floor(lon / 30) % 12;
    const d = lon % 30;
    const isWaterEnd = [3, 7, 11].includes(s) && d >= 26.6667;
    const isFireStart = [0, 4, 8].includes(s) && d <= 3.3333;
    return isWaterEnd || isFireStart;
  };
  const gandantaBodies = [chart.ascendant, moon, sun]
    .filter((b) => isGandantaDegree(b.longitude))
    .map((b) => `${b.id === 'Asc' ? 'Lagna' : b.id} (${b.signName} ${b.shortDms})`);

  doshas.push({
    name: 'Gandmool Nakshatra / Gandanta Junction',
    status: isGandmool || gandantaBodies.length > 0 ? 'Present' : 'Clear',
    severity: gandantaBodies.length > 0 ? 'Moderate' : isGandmool ? 'Mild' : 'None',
    trigger:
      isGandmool || gandantaBodies.length > 0
        ? `${isGandmool ? `Birth Nakshatra is ${chart.panchang.nakshatra.name} (Gandmool)` : ''}${isGandmool && gandantaBodies.length ? '; ' : ''}${gandantaBodies.length ? `Gandanta junction: ${gandantaBodies.join(', ')}` : ''}.`
        : 'Moon Nakshatra and key points are clear of Gandmool/Gandanta junctions.',
    mitigation: 'Traditional Nakshatra Shanti / spiritual resilience turns intense sensitivity into deep wisdom.',
    effect: 'Marks karmic turning points at birth and heightened intuition/intensity.',
    remedy: 'Traditional Gandmool Shanti or Ganesha/Navagraha prayer.',
  });

  // 10. Shakata Dosha (Moon in 6/8/12 from Jupiter)
  const moonFromJup = houseDist(jupiter.signIndex, moon.signIndex);
  const shakataRaw = [6, 8, 12].includes(moonFromJup);
  const shakataCancelled = shakataRaw && [1, 4, 7, 10].includes(moon.rasiHouseNumber);
  doshas.push({
    name: 'Shakata Dosha (Moon 6/8/12 from Jupiter)',
    status: !shakataRaw ? 'Clear' : shakataCancelled ? 'Mitigated (Cancelled)' : 'Present',
    severity: !shakataRaw || shakataCancelled ? 'None' : 'Mild',
    trigger: shakataRaw
      ? `Moon is in House ${moonFromJup} from Jupiter (${jupiter.signName} → ${moon.signName}).`
      : `Moon is in House ${moonFromJup} from Jupiter (free of Shakata).`,
    mitigation: shakataCancelled ? 'Cancelled because Moon occupies a Kendra from Lagna (forms Mukuta Yoga).' : 'Maintain emergency savings for cyclical fluctuations.',
    effect: 'Can create periodic ups and downs in fortune before steady equilibrium returns.',
    remedy: 'Consistent budgeting and Thursday/Monday gratitude practices.',
  });

  const presentCount = doshas.filter((d) => d.status === 'Present').length;
  const mitigatedCount = doshas.filter((d) => d.status === 'Mitigated (Cancelled)').length;

  return { presentCount, mitigatedCount, doshas };
}
