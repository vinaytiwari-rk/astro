import type {
  AyanamsaId,
  DivisionalChartId,
  NineGrahaId,
  PlanetId,
  SevenPlanetId,
} from './types';

export interface SignInfo {
  index: number;
  name: string;
  sanskrit: string;
  short: string;
  lord: SevenPlanetId;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  modality: 'Movable' | 'Fixed' | 'Dual';
  gender: 'Odd' | 'Even';
  vashya: string;
  varna: 'Brahmin' | 'Kshatriya' | 'Vaishya' | 'Shudra';
}

export const SIGNS: SignInfo[] = [
  { index: 0, name: 'Aries', sanskrit: 'Mesha', short: 'Ar', lord: 'Mars', element: 'Fire', modality: 'Movable', gender: 'Odd', vashya: 'Quadruped', varna: 'Kshatriya' },
  { index: 1, name: 'Taurus', sanskrit: 'Vrishabha', short: 'Ta', lord: 'Venus', element: 'Earth', modality: 'Fixed', gender: 'Even', vashya: 'Quadruped', varna: 'Vaishya' },
  { index: 2, name: 'Gemini', sanskrit: 'Mithuna', short: 'Ge', lord: 'Mercury', element: 'Air', modality: 'Dual', gender: 'Odd', vashya: 'Human', varna: 'Shudra' },
  { index: 3, name: 'Cancer', sanskrit: 'Karka', short: 'Cn', lord: 'Moon', element: 'Water', modality: 'Movable', gender: 'Even', vashya: 'Aquatic', varna: 'Brahmin' },
  { index: 4, name: 'Leo', sanskrit: 'Simha', short: 'Le', lord: 'Sun', element: 'Fire', modality: 'Fixed', gender: 'Odd', vashya: 'Wild', varna: 'Kshatriya' },
  { index: 5, name: 'Virgo', sanskrit: 'Kanya', short: 'Vi', lord: 'Mercury', element: 'Earth', modality: 'Dual', gender: 'Even', vashya: 'Human', varna: 'Vaishya' },
  { index: 6, name: 'Libra', sanskrit: 'Tula', short: 'Li', lord: 'Venus', element: 'Air', modality: 'Movable', gender: 'Odd', vashya: 'Human', varna: 'Shudra' },
  { index: 7, name: 'Scorpio', sanskrit: 'Vrishchika', short: 'Sc', lord: 'Mars', element: 'Water', modality: 'Fixed', gender: 'Even', vashya: 'Insect', varna: 'Brahmin' },
  { index: 8, name: 'Sagittarius', sanskrit: 'Dhanu', short: 'Sg', lord: 'Jupiter', element: 'Fire', modality: 'Dual', gender: 'Odd', vashya: 'Human', varna: 'Kshatriya' },
  { index: 9, name: 'Capricorn', sanskrit: 'Makara', short: 'Cp', lord: 'Saturn', element: 'Earth', modality: 'Movable', gender: 'Even', vashya: 'Aquatic', varna: 'Vaishya' },
  { index: 10, name: 'Aquarius', sanskrit: 'Kumbha', short: 'Aq', lord: 'Saturn', element: 'Air', modality: 'Fixed', gender: 'Odd', vashya: 'Human', varna: 'Shudra' },
  { index: 11, name: 'Pisces', sanskrit: 'Meena', short: 'Pi', lord: 'Jupiter', element: 'Water', modality: 'Dual', gender: 'Even', vashya: 'Aquatic', varna: 'Brahmin' },
];

export interface NakshatraInfo {
  index: number;
  name: string;
  lord: NineGrahaId;
  deity: string;
  gana: 'Deva' | 'Manushya' | 'Rakshasa';
  yoni: string;
  yoniGender: 'M' | 'F';
  nadi: 'Adi' | 'Madhya' | 'Antya';
}

export const NAKSHATRAS: NakshatraInfo[] = [
  { index: 0, name: 'Ashwini', lord: 'Ketu', deity: 'Ashwini Kumaras', gana: 'Deva', yoni: 'Horse', yoniGender: 'M', nadi: 'Adi' },
  { index: 1, name: 'Bharani', lord: 'Venus', deity: 'Yama', gana: 'Manushya', yoni: 'Elephant', yoniGender: 'M', nadi: 'Madhya' },
  { index: 2, name: 'Krittika', lord: 'Sun', deity: 'Agni', gana: 'Rakshasa', yoni: 'Sheep', yoniGender: 'F', nadi: 'Antya' },
  { index: 3, name: 'Rohini', lord: 'Moon', deity: 'Brahma', gana: 'Manushya', yoni: 'Serpent', yoniGender: 'M', nadi: 'Antya' },
  { index: 4, name: 'Mrigashira', lord: 'Mars', deity: 'Soma', gana: 'Deva', yoni: 'Serpent', yoniGender: 'F', nadi: 'Madhya' },
  { index: 5, name: 'Ardra', lord: 'Rahu', deity: 'Rudra', gana: 'Manushya', yoni: 'Dog', yoniGender: 'F', nadi: 'Adi' },
  { index: 6, name: 'Punarvasu', lord: 'Jupiter', deity: 'Aditi', gana: 'Deva', yoni: 'Cat', yoniGender: 'F', nadi: 'Adi' },
  { index: 7, name: 'Pushya', lord: 'Saturn', deity: 'Brihaspati', gana: 'Deva', yoni: 'Sheep', yoniGender: 'M', nadi: 'Madhya' },
  { index: 8, name: 'Ashlesha', lord: 'Mercury', deity: 'Sarpa', gana: 'Rakshasa', yoni: 'Cat', yoniGender: 'M', nadi: 'Antya' },
  { index: 9, name: 'Magha', lord: 'Ketu', deity: 'Pitris', gana: 'Rakshasa', yoni: 'Rat', yoniGender: 'M', nadi: 'Antya' },
  { index: 10, name: 'Purva Phalguni', lord: 'Venus', deity: 'Bhaga', gana: 'Manushya', yoni: 'Rat', yoniGender: 'F', nadi: 'Madhya' },
  { index: 11, name: 'Uttara Phalguni', lord: 'Sun', deity: 'Aryaman', gana: 'Manushya', yoni: 'Cow', yoniGender: 'M', nadi: 'Adi' },
  { index: 12, name: 'Hasta', lord: 'Moon', deity: 'Savitar', gana: 'Deva', yoni: 'Buffalo', yoniGender: 'F', nadi: 'Adi' },
  { index: 13, name: 'Chitra', lord: 'Mars', deity: 'Tvashtar', gana: 'Rakshasa', yoni: 'Tiger', yoniGender: 'F', nadi: 'Madhya' },
  { index: 14, name: 'Swati', lord: 'Rahu', deity: 'Vayu', gana: 'Deva', yoni: 'Buffalo', yoniGender: 'M', nadi: 'Antya' },
  { index: 15, name: 'Vishakha', lord: 'Jupiter', deity: 'Indragni', gana: 'Rakshasa', yoni: 'Tiger', yoniGender: 'M', nadi: 'Antya' },
  { index: 16, name: 'Anuradha', lord: 'Saturn', deity: 'Mitra', gana: 'Deva', yoni: 'Deer', yoniGender: 'F', nadi: 'Madhya' },
  { index: 17, name: 'Jyeshtha', lord: 'Mercury', deity: 'Indra', gana: 'Rakshasa', yoni: 'Deer', yoniGender: 'M', nadi: 'Adi' },
  { index: 18, name: 'Mula', lord: 'Ketu', deity: 'Nirriti', gana: 'Rakshasa', yoni: 'Dog', yoniGender: 'M', nadi: 'Adi' },
  { index: 19, name: 'Purva Ashadha', lord: 'Venus', deity: 'Apas', gana: 'Manushya', yoni: 'Monkey', yoniGender: 'M', nadi: 'Madhya' },
  { index: 20, name: 'Uttara Ashadha', lord: 'Sun', deity: 'Vishvadevas', gana: 'Manushya', yoni: 'Mongoose', yoniGender: 'M', nadi: 'Antya' },
  { index: 21, name: 'Shravana', lord: 'Moon', deity: 'Vishnu', gana: 'Deva', yoni: 'Monkey', yoniGender: 'F', nadi: 'Antya' },
  { index: 22, name: 'Dhanishta', lord: 'Mars', deity: 'Vasus', gana: 'Rakshasa', yoni: 'Lion', yoniGender: 'F', nadi: 'Madhya' },
  { index: 23, name: 'Shatabhisha', lord: 'Rahu', deity: 'Varuna', gana: 'Rakshasa', yoni: 'Horse', yoniGender: 'F', nadi: 'Adi' },
  { index: 24, name: 'Purva Bhadrapada', lord: 'Jupiter', deity: 'Aja Ekapada', gana: 'Manushya', yoni: 'Lion', yoniGender: 'M', nadi: 'Adi' },
  { index: 25, name: 'Uttara Bhadrapada', lord: 'Saturn', deity: 'Ahir Budhnya', gana: 'Manushya', yoni: 'Cow', yoniGender: 'F', nadi: 'Madhya' },
  { index: 26, name: 'Revati', lord: 'Mercury', deity: 'Pushan', gana: 'Deva', yoni: 'Elephant', yoniGender: 'F', nadi: 'Antya' },
];

export const SEVEN_PLANETS: SevenPlanetId[] = [
  'Sun',
  'Moon',
  'Mars',
  'Mercury',
  'Jupiter',
  'Venus',
  'Saturn',
];

export const NINE_GRAHAS: NineGrahaId[] = [
  ...SEVEN_PLANETS,
  'Rahu',
  'Ketu',
];

export const OUTER_PLANETS: PlanetId[] = ['Uranus', 'Neptune', 'Pluto'];

export const PLANET_SHORT: Record<PlanetId | 'Asc', string> = {
  Asc: 'As',
  Sun: 'Su',
  Moon: 'Mo',
  Mars: 'Ma',
  Mercury: 'Me',
  Jupiter: 'Ju',
  Venus: 'Ve',
  Saturn: 'Sa',
  Rahu: 'Ra',
  Ketu: 'Ke',
  Uranus: 'Ur',
  Neptune: 'Ne',
  Pluto: 'Pl',
};

export const PLANET_SANSKRIT: Record<NineGrahaId | 'Asc', string> = {
  Asc: 'Lagna',
  Sun: 'Surya',
  Moon: 'Chandra',
  Mars: 'Mangala',
  Mercury: 'Budha',
  Jupiter: 'Guru',
  Venus: 'Shukra',
  Saturn: 'Shani',
  Rahu: 'Rahu',
  Ketu: 'Ketu',
};

export const VIMSHOTTARI_ORDER: NineGrahaId[] = [
  'Ketu',
  'Venus',
  'Sun',
  'Moon',
  'Mars',
  'Rahu',
  'Jupiter',
  'Saturn',
  'Mercury',
];

export const VIMSHOTTARI_YEARS: Record<NineGrahaId, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};

export const YOGINI_LIST: Array<{ name: string; lord: NineGrahaId; years: number }> = [
  { name: 'Mangala', lord: 'Moon', years: 1 },
  { name: 'Pingala', lord: 'Sun', years: 2 },
  { name: 'Dhanya', lord: 'Jupiter', years: 3 },
  { name: 'Bhramari', lord: 'Mars', years: 4 },
  { name: 'Bhadrika', lord: 'Mercury', years: 5 },
  { name: 'Ulka', lord: 'Saturn', years: 6 },
  { name: 'Siddha', lord: 'Venus', years: 7 },
  { name: 'Sankata', lord: 'Rahu', years: 8 },
];

// Exaltation sign & exact peak longitude (sidereal)
export const EXALTATION_DEG: Partial<Record<NineGrahaId, number>> = {
  Sun: 10,       // Aries 10°
  Moon: 33,      // Taurus 3°
  Mars: 298,     // Capricorn 28°
  Mercury: 165,  // Virgo 15°
  Jupiter: 95,   // Cancer 5°
  Venus: 357,    // Pisces 27°
  Saturn: 200,   // Libra 20°
  Rahu: 50,      // Taurus 20° (common Parashari)
  Ketu: 230,     // Scorpio 20°
};

export const EXALTATION_SIGN: Partial<Record<NineGrahaId, number>> = {
  Sun: 0,
  Moon: 1,
  Mars: 9,
  Mercury: 5,
  Jupiter: 3,
  Venus: 11,
  Saturn: 6,
  Rahu: 1,
  Ketu: 7,
};

export const DEBILITATION_SIGN: Partial<Record<NineGrahaId, number>> = {
  Sun: 6,
  Moon: 7,
  Mars: 3,
  Mercury: 11,
  Jupiter: 9,
  Venus: 5,
  Saturn: 0,
  Rahu: 7,
  Ketu: 1,
};

export const OWN_SIGNS: Record<NineGrahaId, number[]> = {
  Sun: [4],
  Moon: [3],
  Mars: [0, 7],
  Mercury: [2, 5],
  Jupiter: [8, 11],
  Venus: [1, 6],
  Saturn: [9, 10],
  Rahu: [10], // Aquarius co-lord
  Ketu: [7],  // Scorpio co-lord
};

// Moolatrikona sign & degree range inside sign [start, end)
export const MOOLATRIKONA: Partial<Record<SevenPlanetId, { sign: number; start: number; end: number }>> = {
  Sun: { sign: 4, start: 0, end: 20 },
  Moon: { sign: 1, start: 3, end: 30 },
  Mars: { sign: 0, start: 0, end: 12 },
  Mercury: { sign: 5, start: 15, end: 20 },
  Jupiter: { sign: 8, start: 0, end: 10 },
  Venus: { sign: 6, start: 0, end: 15 },
  Saturn: { sign: 10, start: 0, end: 20 },
};

// Natural friendships (Naisargika Maitri) per Parashara: 1=Friend, 0=Neutral, -1=Enemy
export const NATURAL_FRIENDSHIP: Record<SevenPlanetId, Record<SevenPlanetId, 1 | 0 | -1>> = {
  Sun: { Sun: 1, Moon: 1, Mars: 1, Mercury: 0, Jupiter: 1, Venus: -1, Saturn: -1 },
  Moon: { Sun: 1, Moon: 1, Mars: 0, Mercury: 1, Jupiter: 0, Venus: 0, Saturn: 0 },
  Mars: { Sun: 1, Moon: 1, Mars: 1, Mercury: -1, Jupiter: 1, Venus: 0, Saturn: 0 },
  Mercury: { Sun: 1, Moon: -1, Mars: 0, Mercury: 1, Jupiter: 0, Venus: 1, Saturn: 0 },
  Jupiter: { Sun: 1, Moon: 1, Mars: 1, Mercury: -1, Jupiter: 1, Venus: -1, Saturn: 0 },
  Venus: { Sun: -1, Moon: -1, Mars: 0, Mercury: 1, Jupiter: 0, Venus: 1, Saturn: 1 },
  Saturn: { Sun: -1, Moon: -1, Mars: -1, Mercury: 1, Jupiter: 0, Venus: 1, Saturn: 1 },
};

// Classical combustion (Moudhya / Asta) orbs in degrees from Sun (Surya Siddhanta / BPHS)
export const COMBUSTION_ORB: Partial<Record<SevenPlanetId, { direct: number; retro?: number }>> = {
  Moon: { direct: 12 },
  Mars: { direct: 17 },
  Mercury: { direct: 14, retro: 12 },
  Jupiter: { direct: 11 },
  Venus: { direct: 10, retro: 8 },
  Saturn: { direct: 15 },
};

export const TITHI_NAMES: string[] = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya',
];

export const TITHI_LORDS: NineGrahaId[] = [
  'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu',
  'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Moon',
  'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu',
  'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Saturn', 'Rahu',
];

export const NITYA_YOGAS: Array<{ name: string; meaning: string }> = [
  { name: 'Vishkumbha', meaning: 'Supported / Pillar' },
  { name: 'Priti', meaning: 'Affection / Joy' },
  { name: 'Ayushman', meaning: 'Long-lived' },
  { name: 'Saubhagya', meaning: 'Good Fortune' },
  { name: 'Shobhana', meaning: 'Splendor / Radiance' },
  { name: 'Atiganda', meaning: 'Obstacle / Caution' },
  { name: 'Sukarma', meaning: 'Virtuous Action' },
  { name: 'Dhriti', meaning: 'Steadfastness' },
  { name: 'Shoola', meaning: 'Sharp / Piercing' },
  { name: 'Ganda', meaning: 'Knot / Challenge' },
  { name: 'Vriddhi', meaning: 'Growth / Prosperity' },
  { name: 'Dhruva', meaning: 'Fixed / Constant' },
  { name: 'Vyaghata', meaning: 'Smiting / Obstruction' },
  { name: 'Harshana', meaning: 'Delight / Cheer' },
  { name: 'Vajra', meaning: 'Diamond / Strength' },
  { name: 'Siddhi', meaning: 'Accomplishment' },
  { name: 'Vyatipata', meaning: 'Calamity / Reversal' },
  { name: 'Variyan', meaning: 'Comfort / Excellence' },
  { name: 'Parigha', meaning: 'Iron Bar / Restraint' },
  { name: 'Shiva', meaning: 'Auspiciousness' },
  { name: 'Siddha', meaning: 'Perfected / Attained' },
  { name: 'Sadhya', meaning: 'Amenable / Achievable' },
  { name: 'Shubha', meaning: 'Bright / Auspicious' },
  { name: 'Shukla', meaning: 'Pure / Luminous' },
  { name: 'Brahma', meaning: 'Creative Wisdom' },
  { name: 'Indra', meaning: 'Sovereignty' },
  { name: 'Vaidhriti', meaning: 'Poor Support / Caution' },
];

export const MOVABLE_KARANAS = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti (Bhadra)'];
export const FIXED_KARANAS = ['Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'];

export const VARA_INFO: Array<{ name: string; sanskrit: string; lord: SevenPlanetId }> = [
  { name: 'Sunday', sanskrit: 'Ravivara', lord: 'Sun' },
  { name: 'Monday', sanskrit: 'Somavara', lord: 'Moon' },
  { name: 'Tuesday', sanskrit: 'Mangalavara', lord: 'Mars' },
  { name: 'Wednesday', sanskrit: 'Budhavara', lord: 'Mercury' },
  { name: 'Thursday', sanskrit: 'Guruvara', lord: 'Jupiter' },
  { name: 'Friday', sanskrit: 'Shukravara', lord: 'Venus' },
  { name: 'Saturday', sanskrit: 'Shanivara', lord: 'Saturn' },
];

// Chaldean hour order for Planetary Hora
export const CHALDEAN_ORDER: SevenPlanetId[] = [
  'Saturn',
  'Jupiter',
  'Mars',
  'Sun',
  'Venus',
  'Mercury',
  'Moon',
];

export const AYANAMSA_META: Record<AyanamsaId, { label: string; description: string }> = {
  lahiri: { label: 'Lahiri (Chitra Paksha)', description: 'Official Indian Astronomical Ephemeris / Govt. of India standard' },
  true_chitra: { label: 'True Chitra (Spica = 180°)', description: 'Jagannatha Hora style placing Spica strictly at 0° Libra (180°)' },
  kp: { label: 'Krishnamurti (KP)', description: 'KP New/Senthilathiban ayanamsa used in Krishnamurti Paddhati' },
  raman: { label: 'B.V. Raman', description: 'Prof. B.V. Raman ayanamsa (~1°24\' less than Lahiri)' },
  fagan_bradley: { label: 'Fagan-Bradley', description: 'Western Sidereal standard (~53\' greater than Lahiri)' },
  yukteswar: { label: 'Sri Yukteswar', description: 'Swami Sri Yukteswar ayanamsa' },
  tropical: { label: 'Sayana (Tropical 0°)', description: 'No ayanamsa offset (Vernal Equinox = 0° Aries)' },
};

export interface DivisionalMeta {
  id: DivisionalChartId;
  division: number;
  name: string;
  sanskritName: string;
  signification: string;
}

export const DIVISIONAL_META: DivisionalMeta[] = [
  { id: 'D1', division: 1, name: 'Rasi', sanskritName: 'Rasi', signification: 'Physical body, general life & destiny' },
  { id: 'D2', division: 2, name: 'Hora', sanskritName: 'Hora', signification: 'Wealth, prosperity & sustenance' },
  { id: 'D3', division: 3, name: 'Drekkana', sanskritName: 'Drekkana', signification: 'Siblings, courage & initiative' },
  { id: 'D4', division: 4, name: 'Chaturthamsa', sanskritName: 'Chaturthamsa', signification: 'Home, fixed assets & fortune' },
  { id: 'D5', division: 5, name: 'Panchamsa', sanskritName: 'Panchamsa', signification: 'Fame, authority & spiritual merit' },
  { id: 'D6', division: 6, name: 'Shashthamsa', sanskritName: 'Shashthamsa', signification: 'Health, ailments & overcoming obstacles' },
  { id: 'D7', division: 7, name: 'Saptamsa', sanskritName: 'Saptamsa', signification: 'Children, progeny & creative legacy' },
  { id: 'D8', division: 8, name: 'Ashtamsa', sanskritName: 'Ashtamsa', signification: 'Longevity & sudden transformations' },
  { id: 'D9', division: 9, name: 'Navamsa', sanskritName: 'Navamsa', signification: 'Spouse, dharma, inner strength & fruit of chart' },
  { id: 'D10', division: 10, name: 'Dasamsa', sanskritName: 'Dasamsa', signification: 'Career, profession & status' },
  { id: 'D11', division: 11, name: 'Rudramsa', sanskritName: 'Ekadasamsa', signification: 'Gains, honors & overcoming rivals' },
  { id: 'D12', division: 12, name: 'Dwadasamsa', sanskritName: 'Dwadasamsa', signification: 'Parents, lineage & ancestry' },
  { id: 'D16', division: 16, name: 'Shodasamsa', sanskritName: 'Shodasamsa', signification: 'Vehicles, comforts & inner happiness' },
  { id: 'D20', division: 20, name: 'Vimsamsa', sanskritName: 'Vimsamsa', signification: 'Spiritual practice, devotion & upasana' },
  { id: 'D24', division: 24, name: 'Chaturvimsamsa', sanskritName: 'Siddhamsa', signification: 'Higher learning, education & knowledge' },
  { id: 'D27', division: 27, name: 'Saptavimsamsa', sanskritName: 'Bhamsa', signification: 'Physical strength & stamina' },
  { id: 'D30', division: 30, name: 'Trimsamsa', sanskritName: 'Trimsamsa', signification: 'Misfortunes, character & hidden challenges' },
  { id: 'D40', division: 40, name: 'Khavedamsa', sanskritName: 'Khavedamsa', signification: 'Maternal heritage & auspiciousness' },
  { id: 'D45', division: 45, name: 'Akshavedamsa', sanskritName: 'Akshavedamsa', signification: 'Paternal heritage, ethics & general conduct' },
  { id: 'D60', division: 60, name: 'Shashtiamsa', sanskritName: 'Shashtiamsa', signification: 'Past-life karma & finest micro-distinction' },
];

export const CHARA_KARAKA_NAMES_7 = ['AK', 'AmK', 'BK', 'MK', 'PK', 'GK', 'DK'] as const;
export const CHARA_KARAKA_NAMES_8 = ['AK', 'AmK', 'BK', 'MK', 'PiK', 'PK', 'GK', 'DK'] as const;
