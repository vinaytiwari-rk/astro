export type AyanamsaId =
  | 'lahiri'
  | 'true_chitra'
  | 'kp'
  | 'raman'
  | 'fagan_bradley'
  | 'yukteswar'
  | 'tropical';

export type NodeMode = 'mean' | 'true';

export type HouseSystem = 'whole_sign' | 'equal' | 'sripati';

export type ChartStyle = 'north' | 'south' | 'east';

export type DashaYearType = 'tropical' | 'sidereal' | 'savana';

export type PlanetId =
  | 'Sun'
  | 'Moon'
  | 'Mars'
  | 'Mercury'
  | 'Jupiter'
  | 'Venus'
  | 'Saturn'
  | 'Rahu'
  | 'Ketu'
  | 'Uranus'
  | 'Neptune'
  | 'Pluto';

export type SevenPlanetId =
  | 'Sun'
  | 'Moon'
  | 'Mars'
  | 'Mercury'
  | 'Jupiter'
  | 'Venus'
  | 'Saturn';

export type NineGrahaId = SevenPlanetId | 'Rahu' | 'Ketu';

export type SpecialPointId = 'Asc' | 'HL' | 'GL' | 'BL' | 'AL' | 'UL' | 'Mandi';

export type DignityLevel =
  | 'Exalted'
  | 'Moolatrikona'
  | 'Own Sign'
  | 'Great Friend'
  | 'Friend'
  | 'Neutral'
  | 'Enemy'
  | 'Great Enemy'
  | 'Debilitated'
  | '-';

export type DivisionalChartId =
  | 'D1'
  | 'D2'
  | 'D3'
  | 'D4'
  | 'D5'
  | 'D6'
  | 'D7'
  | 'D8'
  | 'D9'
  | 'D10'
  | 'D11'
  | 'D12'
  | 'D16'
  | 'D20'
  | 'D24'
  | 'D27'
  | 'D30'
  | 'D40'
  | 'D45'
  | 'D60';

export interface BirthInput {
  id: string;
  name: string;
  gender?: 'male' | 'female' | 'other';
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  timezone: string; // IANA timezone e.g. 'Asia/Kolkata' or 'MANUAL'
  utcOffsetMinutes?: number; // used when timezone === 'MANUAL' or fallback
  city: string;
  country?: string;
  latitude: number; // +N, -S
  longitude: number; // +E, -W
  notes?: string;
}

export interface CalcSettings {
  ayanamsa: AyanamsaId;
  nodeMode: NodeMode;
  houseSystem: HouseSystem;
  chartStyle: ChartStyle;
  dashaYearType: DashaYearType;
  includeOuterPlanets: boolean;
  karakaCount: 7 | 8;
  horaMode: 'parashara' | 'samasaptama';
}

export interface SignPlacement {
  longitude: number; // 0..360 sidereal
  signIndex: number; // 0..11 (0=Aries .. 11=Pisces)
  signName: string;
  sanskritName: string;
  degreeInSign: number; // 0..30
  dms: string; // e.g. 14°22'18"
  shortDms: string; // e.g. 14°22'
  nakshatraIndex: number; // 0..26
  nakshatraName: string;
  pada: number; // 1..4
  nakshatraLord: NineGrahaId;
  signLord: SevenPlanetId;
  subLord: NineGrahaId;
}

export interface BodyPosition extends SignPlacement {
  id: PlanetId | 'Asc';
  shortLabel: string;
  tropicalLongitude: number;
  latitude: number;
  speedDegPerDay: number;
  isRetrograde: boolean;
  isCombust: boolean;
  isVargottama: boolean;
  houseNumber: number; // 1..12 relative to chosen house system
  rasiHouseNumber: number; // 1..12 whole sign from Lagna
  dignity: DignityLevel;
  charaKaraka?: string; // AK, AmK, BK, MK, PK, GK, DK, PiK
  avasta?: string;
}

export interface SpecialPoint extends SignPlacement {
  id: SpecialPointId;
  label: string;
  shortLabel: string;
  houseNumber: number;
}

export interface HouseCusp {
  house: number; // 1..12
  midpoint: number; // Bhava Madhya sidereal 0..360
  start: number; // Bhava Sandhi start sidereal 0..360
  signIndex: number;
  signName: string;
  dms: string;
}

export interface DivisionalPlacement extends SignPlacement {
  id: PlanetId | 'Asc';
  shortLabel: string;
  houseFromVargaLagna: number; // 1..12
  isRetrograde: boolean;
  isCombust: boolean;
  dignity: DignityLevel;
}

export interface DivisionalChart {
  id: DivisionalChartId;
  name: string;
  sanskritName: string;
  signification: string;
  lagnaSignIndex: number;
  placements: DivisionalPlacement[];
}

export interface PanchangInfo {
  vara: {
    name: string;
    sanskrit: string;
    lord: SevenPlanetId;
    sunriseBased: boolean;
  };
  tithi: {
    number: number; // 1..30
    name: string;
    paksha: 'Shukla' | 'Krishna';
    lord: NineGrahaId;
    percentElapsed: number;
    percentRemaining: number;
  };
  nakshatra: {
    index: number;
    name: string;
    pada: number;
    lord: NineGrahaId;
    deity: string;
    gana: string;
    yoni: string;
    nadi: string;
    varna: string;
    percentElapsed: number;
    percentRemaining: number;
  };
  yoga: {
    number: number; // 1..27
    name: string;
    meaning: string;
    percentElapsed: number;
  };
  karana: {
    number: number; // 1..60
    name: string;
    type: 'Movable' | 'Fixed';
    percentElapsed: number;
  };
  horaLord: SevenPlanetId;
  sunriseUtc: string | null;
  sunsetUtc: string | null;
  sunriseLocal: string;
  sunsetLocal: string;
  moonriseLocal: string;
  moonsetLocal: string;
  dayDurationStr: string;
  rahuKalam: string;
  yamaganda: string;
  gulikaKalam: string;
  abhijitMuhurta: string;
}

export interface DashaPeriod {
  lord: NineGrahaId | string;
  level: 1 | 2 | 3 | 4;
  startMs: number;
  endMs: number;
  durationDays: number;
  children?: DashaPeriod[];
}

export interface AshtakavargaData {
  bhinna: Record<SevenPlanetId | 'Asc', number[]>; // 12 values (Aries..Pisces)
  prastara: Record<SevenPlanetId | 'Asc', Record<SevenPlanetId | 'Asc', number[]>>; // contributor x sign (0|1)
  sarva: number[]; // 12 values summing to 337
  totalBindus: number;
  trikonaShodhana: Record<SevenPlanetId, number[]>;
  ekadhipatyaShodhana: Record<SevenPlanetId, number[]>;
}

export interface ShadbalaRow {
  planet: SevenPlanetId;
  sthanaBala: number;
  digBala: number;
  kalaBala: number;
  cheshtaBala: number;
  naisargikaBala: number;
  drikBala: number;
  totalVirupas: number;
  totalRupas: number;
  requiredRupas: number;
  ratio: number;
  isStrong: boolean;
  ishtaPhala: number;
  kashtaPhala: number;
}

export interface YogaResult {
  name: string;
  category: 'Raja' | 'Dhana' | 'Mahapurusha' | 'Lunar' | 'Solar' | 'Dosha' | 'Special';
  strength: 'Strong' | 'Moderate' | 'Present';
  planets: string[];
  description: string;
}

export interface AspectInfo {
  from: PlanetId;
  to: PlanetId | 'Asc';
  type: string; // e.g., '7th Full', '4th Mars', '5th Jupiter', '10th Saturn'
  orbDeg: number;
  strengthPercent: number;
}

export interface ChartData {
  input: BirthInput;
  settings: CalcSettings;
  utcIso: string;
  utcMs: number;
  offsetMinutesUsed: number;
  julianDayUT: number;
  julianDayTT: number;
  ayanamsaDeg: number;
  ayanamsaDms: string;
  gmstHours: number;
  lmstHours: number;
  obliquityDeg: number;
  ascendant: BodyPosition;
  mcLongitude: number;
  planets: BodyPosition[];
  specialPoints: SpecialPoint[];
  houses: HouseCusp[];
  panchang: PanchangInfo;
  divisionalCharts: Record<DivisionalChartId, DivisionalChart>;
  vimshottari: DashaPeriod[];
  yogini: DashaPeriod[];
  ashtakavarga: AshtakavargaData;
  shadbala: ShadbalaRow[];
  yogas: YogaResult[];
  aspects: AspectInfo[];
  maitriMatrix: Record<SevenPlanetId, Record<SevenPlanetId, string>>;
  vimshopakaShodash: Record<NineGrahaId, number>;
}

export interface KootaScore {
  name: string;
  sanskrit: string;
  maxPoints: number;
  obtainedPoints: number;
  brideValue: string;
  groomValue: string;
  status: 'Good' | 'Average' | 'Caution';
  note: string;
}

export interface KundaliMatchPillar {
  title: string;
  score: number; // 0..100
  status: 'Strong' | 'Balanced' | 'Attention Needed';
  summary: string;
  details: string[];
}

export interface PapaSamyamSummary {
  bridePapaPoints: number;
  groomPapaPoints: number;
  status: 'Balanced' | 'Moderate Difference' | 'Asymmetric';
  note: string;
}

export interface SexualCompatibilityReport {
  score: number; // 0..100
  chemistryLevel: 'Magnetic & Passionate' | 'Harmonious & Affectionate' | 'Complementary (Needs Communication)' | 'Different Rhythms';
  venusMarsCrossLinks: string[];
  shayanaAndEighthNote: string;
  yoniAndLibidoNote: string;
  brideArchetype: string;
  groomArchetype: string;
  brideDrive: number;
  groomDrive: number;
  guidance: string;
}

export interface MatchMakingResult {
  totalObtained: number;
  totalMax: 36;
  verdict: string;
  kootas: KootaScore[];
  brideManglik: { isManglik: boolean; houses: number[]; note: string };
  groomManglik: { isManglik: boolean; houses: number[]; note: string };
  manglikCompatible: boolean;
  kundaliScore: number; // 0..100 full chart matching score beyond Guna Milan
  combinedVerdict: string;
  papaSamyam: PapaSamyamSummary;
  sexualCompatibility: SexualCompatibilityReport;
  kundaliPillars: KundaliMatchPillar[];
  paramayusLocked?: {
    exceeded: boolean;
    titleEn: string;
    titleHi: string;
    messageEn: string;
    messageHi: string;
  };
}
