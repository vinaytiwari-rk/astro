import type { NineGrahaId, SevenPlanetId } from '../types';

export interface LagnaExtendedDetails {
  physicalAppearance: string;
  mentalQualities: string;
  careerIndicators: string;
  luckyColors: string;
  luckyDays: string;
  luckyNumbers: string;
  luckyGem: string;
  beneficList: SevenPlanetId[];
  maleficList: SevenPlanetId[];
  neutralList: SevenPlanetId[];
  marakaList: SevenPlanetId[];
}

// Synthesized from classical Lagna treatises (Brihat Jataka, Saravali, Phaladeepika, Laghu Parashari)
export const LAGNA_EXTENDED_KB: LagnaExtendedDetails[] = [
  {
    // 0 Aries
    physicalAppearance: 'Lean, athletic or muscular frame, alert gaze, brisk gait, prominent brow, warm complexion.',
    mentalQualities: 'Direct, spirited, enterprising, impatient with bureaucracy, quick to forgive once heard.',
    careerIndicators: 'Engineering, defense, surgery, athletics, entrepreneurship, machinery, and leadership roles.',
    luckyColors: 'Crimson, Saffron, Coral Gold',
    luckyDays: 'Tuesday, Sunday, Thursday',
    luckyNumbers: '1, 3, 9',
    luckyGem: 'Red Coral (for Mars), Yellow Sapphire (for Jupiter)',
    beneficList: ['Sun', 'Mars', 'Jupiter'],
    maleficList: ['Mercury', 'Saturn', 'Venus'],
    neutralList: ['Moon'],
    marakaList: ['Venus', 'Saturn'],
  },
  {
    // 1 Taurus
    physicalAppearance: 'Well-proportioned sturdy build, expressive eyes, pleasant voice, poised bearing.',
    mentalQualities: 'Calm, steadfast, practical, appreciative of comfort and beauty, slow to anger yet firm.',
    careerIndicators: 'Banking, finance, agriculture, architecture, design, luxury goods, culinary/music arts.',
    luckyColors: 'Cream, Emerald Green, Pearl White',
    luckyDays: 'Friday, Wednesday, Saturday',
    luckyNumbers: '2, 5, 6',
    luckyGem: 'Diamond / White Sapphire (Venus), Blue Sapphire (Yogakaraka Saturn)',
    beneficList: ['Saturn', 'Venus', 'Mercury'],
    maleficList: ['Jupiter', 'Moon'],
    neutralList: ['Sun', 'Mars'],
    marakaList: ['Mars', 'Jupiter'],
  },
  {
    // 2 Gemini
    physicalAppearance: 'Youthful, tall or slender stature, expressive hands, bright inquisitive eyes.',
    mentalQualities: 'Witty, inquisitive, adaptable, eloquent, enjoys juggling simultaneous projects.',
    careerIndicators: 'Writing, journalism, software, analytics, commerce, linguistics, law, and communications.',
    luckyColors: 'Emerald Green, Mint, Soft Yellow',
    luckyDays: 'Wednesday, Friday',
    luckyNumbers: '3, 5, 6',
    luckyGem: 'Emerald (Mercury), Diamond / Opal (Venus)',
    beneficList: ['Venus', 'Mercury'],
    maleficList: ['Mars', 'Jupiter', 'Sun'],
    neutralList: ['Moon', 'Saturn'],
    marakaList: ['Mars', 'Jupiter'],
  },
  {
    // 3 Cancer
    physicalAppearance: 'Soft, graceful features, luminous complexion, expressive face reflecting mood.',
    mentalQualities: 'Empathetic, protective, retentive memory, deeply loyal to family and cherished ideals.',
    careerIndicators: 'Healthcare, hospitality, real estate, maritime/trade, counseling, education, public life.',
    luckyColors: 'Pearl White, Silver, Soft Coral',
    luckyDays: 'Monday, Tuesday, Thursday',
    luckyNumbers: '2, 7, 9',
    luckyGem: 'Natural Pearl (Moon), Red Coral (Yogakaraka Mars)',
    beneficList: ['Mars', 'Jupiter', 'Moon'],
    maleficList: ['Venus', 'Mercury', 'Saturn'],
    neutralList: ['Sun'],
    marakaList: ['Saturn', 'Venus'],
  },
  {
    // 4 Leo
    physicalAppearance: 'Broad shoulders, dignified posture, commanding presence, bright eyes.',
    mentalQualities: 'Magnanimous, proud, protective of dependents, thrives on purposeful authority.',
    careerIndicators: 'Executive governance, politics, management, entertainment, medicine, finance, solar/power sectors.',
    luckyColors: 'Gold, Amber, Ruby Red',
    luckyDays: 'Sunday, Tuesday, Thursday',
    luckyNumbers: '1, 4, 9',
    luckyGem: 'Ruby (Sun), Red Coral (Yogakaraka Mars)',
    beneficList: ['Sun', 'Mars', 'Jupiter'],
    maleficList: ['Mercury', 'Venus', 'Saturn'],
    neutralList: ['Moon'],
    marakaList: ['Saturn', 'Venus'],
  },
  {
    // 5 Virgo
    physicalAppearance: 'Refined, youthful symmetry, calm observant gaze, neat appearance.',
    mentalQualities: 'Detail-oriented, analytical, conscientious, modest, practical problem-solver.',
    careerIndicators: 'Accounting, auditing, medicine/nutrition, IT/engineering, publishing, editing, consulting.',
    luckyColors: 'Forest Green, Ivory, Pastel Blue',
    luckyDays: 'Wednesday, Friday',
    luckyNumbers: '5, 6',
    luckyGem: 'Emerald (Mercury), Diamond / Opal (Venus)',
    beneficList: ['Venus', 'Mercury'],
    maleficList: ['Mars', 'Moon', 'Jupiter'],
    neutralList: ['Sun', 'Saturn'],
    marakaList: ['Mars', 'Jupiter'],
  },
  {
    // 6 Libra
    physicalAppearance: 'Balanced features, graceful carriage, charming smile, refined aesthetic sense.',
    mentalQualities: 'Diplomatic, fair-minded, socially astute, dislikes crude conflict, seeks harmony.',
    careerIndicators: 'Law, diplomacy, architecture, fashion/design, commerce, mediation, media, hospitality.',
    luckyColors: 'Ivory, Sapphire Blue, Pastel Pink',
    luckyDays: 'Friday, Saturday, Wednesday',
    luckyNumbers: '6, 8, 5',
    luckyGem: 'Diamond (Venus), Blue Sapphire (Yogakaraka Saturn)',
    beneficList: ['Saturn', 'Mercury', 'Venus'],
    maleficList: ['Sun', 'Jupiter', 'Mars'],
    neutralList: ['Moon'],
    marakaList: ['Mars', 'Sun'],
  },
  {
    // 7 Scorpio
    physicalAppearance: 'Intense, magnetic eyes, sturdy build, composed and resolute expression.',
    mentalQualities: 'Penetrating, private, courageous in crises, fiercely loyal, investigative depth.',
    careerIndicators: 'Surgery, research, defense/intelligence, psychology, chemistry, mining, finance/insurance.',
    luckyColors: 'Maroon, Saffron, Pearl White',
    luckyDays: 'Tuesday, Monday, Thursday',
    luckyNumbers: '9, 2, 3',
    luckyGem: 'Red Coral (Mars), Yellow Sapphire (Jupiter), Pearl (Moon)',
    beneficList: ['Jupiter', 'Moon', 'Sun', 'Mars'],
    maleficList: ['Mercury', 'Venus', 'Saturn'],
    neutralList: [],
    marakaList: ['Venus', 'Mercury'],
  },
  {
    // 8 Sagittarius
    physicalAppearance: 'Tall or open build, bright candid eyes, athletic stride, noble forehead.',
    mentalQualities: 'Principled, optimistic, candid, drawn to ethics, teaching, law, and broad horizons.',
    careerIndicators: 'Law, academia, publishing, advisory/consulting, international trade, spiritual/charitable trusts.',
    luckyColors: 'Turmeric Yellow, Saffron, Gold',
    luckyDays: 'Thursday, Sunday, Tuesday',
    luckyNumbers: '3, 1, 9',
    luckyGem: 'Yellow Sapphire (Jupiter), Ruby (Sun)',
    beneficList: ['Sun', 'Mars', 'Jupiter'],
    maleficList: ['Venus', 'Saturn', 'Mercury'],
    neutralList: ['Moon'],
    marakaList: ['Venus', 'Saturn'],
  },
  {
    // 9 Capricorn
    physicalAppearance: 'Structured bone frame, serious composed expression, ageless endurance.',
    mentalQualities: 'Pragmatic, persistent, strategic, patient, values tangible competence over hype.',
    careerIndicators: 'Administration, civil engineering, law, mining/energy, finance, corporate operations.',
    luckyColors: 'Indigo, Charcoal, Emerald Green',
    luckyDays: 'Saturday, Friday, Wednesday',
    luckyNumbers: '8, 6, 5',
    luckyGem: 'Blue Sapphire (Saturn), Diamond (Yogakaraka Venus)',
    beneficList: ['Venus', 'Mercury', 'Saturn'],
    maleficList: ['Mars', 'Jupiter', 'Moon'],
    neutralList: ['Sun'],
    marakaList: ['Mars', 'Moon'],
  },
  {
    // 10 Aquarius
    physicalAppearance: 'Tall, distinctive presence, thoughtful gaze, calm unhurried demeanor.',
    mentalQualities: 'Humanitarian, inventive, independent, philosophical, values truth and social reform.',
    careerIndicators: 'Technology, science, social reform, aviation, research, logistics, institutional strategy.',
    luckyColors: 'Electric Blue, Violet, Silver',
    luckyDays: 'Saturday, Friday',
    luckyNumbers: '8, 6, 4',
    luckyGem: 'Blue Sapphire (Saturn), Diamond (Yogakaraka Venus)',
    beneficList: ['Venus', 'Saturn', 'Sun'],
    maleficList: ['Jupiter', 'Moon', 'Mars'],
    neutralList: ['Mercury'],
    marakaList: ['Jupiter', 'Moon'],
  },
  {
    // 11 Pisces
    physicalAppearance: 'Gentle eyes, soft graceful build, compassionate and serene expression.',
    mentalQualities: 'Intuitive, imaginative, charitable, adaptable, sensitive to atmosphere and subtleties.',
    careerIndicators: 'Education, medicine/healing, counseling, creative arts, maritime/foreign work, spirituality.',
    luckyColors: 'Golden Yellow, Sea Green, Pearl White',
    luckyDays: 'Thursday, Monday, Tuesday',
    luckyNumbers: '3, 2, 9',
    luckyGem: 'Yellow Sapphire (Jupiter), Red Coral (Mars), Pearl (Moon)',
    beneficList: ['Moon', 'Mars', 'Jupiter'],
    maleficList: ['Saturn', 'Venus', 'Mercury', 'Sun'],
    neutralList: [],
    marakaList: ['Mercury', 'Saturn'],
  },
];

// Tajika Varshaphala Muntha in Houses 1..12
export const MUNTHA_HOUSE_PREDICTIONS: string[] = [
  'Muntha in the 1st house brings vitality, personal authority, career initiative, and noticeable progress across the year.',
  'Muntha in the 2nd house highlights financial accumulation, family gatherings, and profitable negotiations.',
  'Muntha in the 3rd house favors courage, short trips, sibling support, communication projects, and victorious effort.',
  'Muntha in the 4th house can test domestic peace or demand patience around property/relatives; guard comfort and health.',
  'Muntha in the 5th house blesses intelligence, creative output, joyful news from children/students, and wise judgment.',
  'Muntha in the 6th house warns against unnecessary disputes, loans, or fatigue; steady discipline overcomes obstacles.',
  'Muntha in the 7th house activates partnerships, travel, or spouse’s health/career focus—calls for diplomacy in agreements.',
  'Muntha in the 8th house advises conservative financial/health caution, avoiding risky ventures, and focusing on research/inner renewal.',
  'Muntha in the 9th house is highly auspicious—bringing luck, mentor support, long-distance travel, and ethical honors.',
  'Muntha in the 10th house is one of the best placements: promotion, career recognition, honors, and successful leadership.',
  'Muntha in the 11th house promises strong income, fulfillment of major ambitions, and helpful friends or patrons.',
  'Muntha in the 12th house increases expenses, foreign travel, or charitable/spiritual retreat—budget carefully and prioritize rest.',
];

// Lal Kitab Pakka Ghar (permanent house of each planet) & classical Lal Kitab House summary
export const LAL_KITAB_PAKKA_GHAR: Record<NineGrahaId, number> = {
  Sun: 1,
  Moon: 4,
  Mars: 3,
  Mercury: 7,
  Jupiter: 2,
  Venus: 7,
  Saturn: 8,
  Rahu: 12,
  Ketu: 6,
};

export interface LalKitabRinRule {
  name: string;
  triggerHouses: number[];
  planet: NineGrahaId;
  meaning: string;
  remedy: string;
}

// Classical Lal Kitab Karmic Debts (Rins)
export const LAL_KITAB_RINS: LalKitabRinRule[] = [
  {
    name: 'Pitra Rin (Ancestral / Paternal Debt)',
    triggerHouses: [2, 5, 9, 12],
    planet: 'Venus',
    meaning: 'Indicated in Lal Kitab when Venus, Saturn, or Rahu occupy houses 2, 5, 9, or 12—calling for honoring ancestral lineage and elders.',
    remedy: 'Contribute respectfully to community temple/charitable repairs and serve elders without expectation.',
  },
  {
    name: 'Swabhava / Self Rin (Debt to Self)',
    triggerHouses: [5],
    planet: 'Venus',
    meaning: 'Triggered when Venus, Saturn, or Rahu influence the 5th house—urging disciplined ethics and keeping promises.',
    remedy: 'Feed stray cows/dogs respectfully and keep word and daily vows consistent.',
  },
  {
    name: 'Matri Rin (Maternal Debt)',
    triggerHouses: [4],
    planet: 'Ketu',
    meaning: 'Triggered when Ketu sits in the 4th house—highlighting deep care for mother, home harmony, and water purity.',
    remedy: 'Serve mother/maternal figures warmly and keep household water sources clean.',
  },
  {
    name: 'Stri Rin (Partner / Relationship Debt)',
    triggerHouses: [2, 7],
    planet: 'Sun',
    meaning: 'Associated with Sun, Moon, or Rahu creating tension in houses 2 or 7—emphasizing kindness and fairness toward spouse/women.',
    remedy: 'Practice patience in domestic dialogue and support family welfare cooperatively.',
  },
  {
    name: 'Daiv / Guru Rin (Spiritual / Mentor Debt)',
    triggerHouses: [6, 10],
    planet: 'Jupiter',
    meaning: 'Associated with Mercury or Ketu in houses 1 or 8, or afflicted 9th/10th—inviting humility toward teachers and sacred study.',
    remedy: 'Honor teachers, donate books to deserving students, and uphold honest conduct.',
  },
];
