import type { NineGrahaId, SevenPlanetId } from '../types';

export interface LagnaKnowledge {
  ruler: SevenPlanetId;
  functionalBenefics: SevenPlanetId[];
  yogakaraka: SevenPlanetId | null;
  temperament: string;
  strengths: string;
  cautions: string;
}

// Synthesized from Brihat Parashara Hora Shastra (Ch. 34 Yogakaraka & Lagna), Brihat Jataka, & Saravali
export const LAGNA_KB: LagnaKnowledge[] = [
  {
    // 0 Aries
    ruler: 'Mars',
    functionalBenefics: ['Sun', 'Mars', 'Jupiter'],
    yogakaraka: null,
    temperament:
      'Pioneering, decisive, action-oriented Mesha Lagna. Natural initiator who thrives on direct challenge, independence, and visible leadership.',
    strengths:
      'Courageous vitality, quick recuperation, candor, and strong capacity to launch ventures from scratch.',
    cautions:
      'Impatience, rash speech, and scattered starts; gains most when Jupiterian foresight tempers Martian haste.',
  },
  {
    // 1 Taurus
    ruler: 'Venus',
    functionalBenefics: ['Saturn', 'Mercury', 'Venus'],
    yogakaraka: 'Saturn',
    temperament:
      'Steadfast, aesthetic, resource-building Vrishabha Lagna. Seeks durable security, harmony, fine craft, and loyal bonds.',
    strengths:
      'Patience, practical stewardship of wealth, artistic taste, and calm endurance under sustained pressure.',
    cautions:
      'Stubbornness or over-attachment to comfort; Saturn as Yogakaraka (9th & 10th lord) grants steady ascent through discipline.',
  },
  {
    // 2 Gemini
    ruler: 'Mercury',
    functionalBenefics: ['Venus', 'Mercury', 'Saturn'],
    yogakaraka: null,
    temperament:
      'Curious, articulate, analytical Mithuna Lagna. Bridges ideas, people, commerce, writing, and multi-disciplinary skills.',
    strengths:
      'Adaptability, linguistic wit, pattern recognition, and commercial acumen.',
    cautions:
      'Restless attention or nervous fatigue; grounding routines and Venusian poise unlock sustained authority.',
  },
  {
    // 3 Cancer
    ruler: 'Moon',
    functionalBenefics: ['Mars', 'Jupiter', 'Moon'],
    yogakaraka: 'Mars',
    temperament:
      'Intuitive, protective, emotionally perceptive Karka Lagna. Guided by empathy, heritage, nurturing leadership, and deep memory.',
    strengths:
      'Emotional intelligence, devotion to family/community, imagination, and magnetic public appeal when Moon is well-placed.',
    cautions:
      'Mood fluctuations and taking criticism personally; Mars (5th & 10th Yogakaraka) provides decisive backbone.',
  },
  {
    // 4 Leo
    ruler: 'Sun',
    functionalBenefics: ['Mars', 'Sun', 'Jupiter'],
    yogakaraka: 'Mars',
    temperament:
      'Dignified, noble-minded, sovereign Simha Lagna. Values integrity, self-respect, creative expression, and protective authority.',
    strengths:
      'Generosity, commanding presence, organizational vision, and unwavering loyalty once trust is earned.',
    cautions:
      'Pride or rigidity under ego challenges; Mars (4th & 9th Yogakaraka) anchors fortune and estate.',
  },
  {
    // 5 Virgo
    ruler: 'Mercury',
    functionalBenefics: ['Venus', 'Mercury'],
    yogakaraka: null,
    temperament:
      'Methodical, discerning, service-driven Kanya Lagna. Excels in analysis, healing, accounting, engineering, and craftsmanship.',
    strengths:
      'Precision, intellectual clarity, conscientious problem-solving, and practical refinement.',
    cautions:
      'Over-analysis, perfectionism, or self-doubt; Venus (2nd & 9th lord) brings grace and prosperity.',
  },
  {
    // 6 Libra
    ruler: 'Venus',
    functionalBenefics: ['Saturn', 'Mercury', 'Venus'],
    yogakaraka: 'Saturn',
    temperament:
      'Diplomatic, justice-seeking, socially poised Tula Lagna. Thrives in partnerships, law, design, negotiation, and balanced commerce.',
    strengths:
      'Fairness, aesthetic sense, strategic diplomacy, and ability to harmonize opposing interests.',
    cautions:
      'Indecisiveness from weighing every side; Saturn (4th & 5th Yogakaraka) delivers enduring structure and creative weight.',
  },
  {
    // 7 Scorpio
    ruler: 'Mars',
    functionalBenefics: ['Jupiter', 'Moon', 'Sun'],
    yogakaraka: null,
    temperament:
      'Intense, investigative, transformative Vrishchika Lagna. Penetrates beneath surface appearances into psychology, research, and strategy.',
    strengths:
      'Fearless depth, crisis composure, loyalty, and mastery of hidden or technical knowledge.',
    cautions:
      'Secretiveness or holding onto resentments; Jupiter (2nd & 5th lord) and Moon (9th lord) elevate wisdom and grace.',
  },
  {
    // 8 Sagittarius
    ruler: 'Jupiter',
    functionalBenefics: ['Sun', 'Mars', 'Jupiter'],
    yogakaraka: null,
    temperament:
      'Philosophical, principled, aspirational Dhanu Lagna. Oriented toward higher truth, teaching, law, ethics, and expansive horizons.',
    strengths:
      'Optimism, moral compass, mentoring ability, and natural resilience during testing chapters.',
    cautions:
      'Blunt frankness or overpromising; Sun (9th lord) and Mars (5th lord) empower Dharma-Karmadhipati growth.',
  },
  {
    // 9 Capricorn
    ruler: 'Saturn',
    functionalBenefics: ['Venus', 'Mercury', 'Saturn'],
    yogakaraka: 'Venus',
    temperament:
      'Pragmatic, ambitious, enduring Makara Lagna. Builds lasting institutions patiently through responsibility, strategy, and realism.',
    strengths:
      'Self-discipline, administrative mastery, late-blooming stature, and calm crisis leadership.',
    cautions:
      'Excessive austerity or overwork; Venus (5th & 10th Yogakaraka) adds refinement, diplomacy, and fortune.',
  },
  {
    // 10 Aquarius
    ruler: 'Saturn',
    functionalBenefics: ['Venus', 'Saturn'],
    yogakaraka: 'Venus',
    temperament:
      'Humanitarian, unconventional, systems-minded Kumbha Lagna. Attracted to reform, technology, networks, and philosophical inquiry.',
    strengths:
      'Original thinking, detachment under pressure, egalitarian vision, and intellectual depth.',
    cautions:
      'Aloofness or internal stubbornness; Venus (4th & 9th Yogakaraka) channels vision into tangible harmony and esteem.',
  },
  {
    // 11 Pisces
    ruler: 'Jupiter',
    functionalBenefics: ['Moon', 'Mars', 'Jupiter'],
    yogakaraka: null,
    temperament:
      'Compassionate, contemplative, intuitive Meena Lagna. Connects naturally to healing, counsel, creativity, and spiritual wisdom.',
    strengths:
      'Empathy, vivid imagination, adaptability, and quiet spiritual strength.',
    cautions:
      'Over-idealism or absorbing others’ stress; Mars (2nd & 9th lord) supplies clarity, courage, and practical focus.',
  },
];

export interface NakshatraReading {
  coreNature: string;
  vocation: string;
  growthPath: string;
}

// Synthesized from Brihat Jataka, Taittiriya Brahmana & Phaladeepika
export const NAKSHATRA_KB: NakshatraReading[] = [
  {
    coreNature: 'Swift vitality, healing instinct, and pioneering momentum under Ashwini Kumaras.',
    vocation: 'Medicine, emergency response, engineering, transport, or trailblazing startups.',
    growthPath: 'Pair rapid initiative with follow-through so early enthusiasm matures into mastery.',
  },
  {
    coreNature: 'Creative endurance, moral seriousness, and transformative responsibility under Yama.',
    vocation: 'Finance, law, creative arts, obstetrics/care, hospitality, or administrative governance.',
    growthPath: 'Release perfectionistic burdens and practice calm moderation amidst strong desires.',
  },
  {
    coreNature: 'Sharp discernment, purifying honesty, and protective warmth under Agni.',
    vocation: 'Culinary arts, metallurgy, critique, defense, teaching, or precision craftsmanship.',
    growthPath: 'Use critical clarity constructively rather than burning bridges with harshness.',
  },
  {
    coreNature: 'Magnetic charm, fertility of imagination, and appreciation of beauty under Brahma.',
    vocation: 'Design, agriculture, media, luxury/commerce, counseling, or public leadership.',
    growthPath: 'Guard against possessiveness while cultivating steady creative abundance.',
  },
  {
    coreNature: 'Restless curiosity, gentle persuasion, and lifelong seeker’s mind under Soma.',
    vocation: 'Research, journalism, travel, linguistics, textiles, or analytical consulting.',
    growthPath: 'Anchor exploration with sustained commitment once the right path is chosen.',
  },
  {
    coreNature: 'Emotional depth, intellectual storm-clearing, and renewal after crisis under Rudra.',
    vocation: 'Data science, psychiatry, investigation, surgery, software, or crisis management.',
    growthPath: 'Transform turbulence into compassion and objective insight rather than brooding.',
  },
  {
    coreNature: 'Nurturing optimism, cyclic renewal, and philosophical hospitality under Aditi.',
    vocation: 'Education, publishing, counseling, architecture, spiritual guidance, or trade.',
    growthPath: 'Avoid spreading energy too thinly; trust steady cycles of return and growth.',
  },
  {
    coreNature: 'Nourishing wisdom, patient stewardship, and respected ethical grounding under Brihaspati.',
    vocation: 'Advisory roles, academia, governance, finance, philanthropy, or spiritual teaching.',
    growthPath: 'Balance traditional duty with openness to fresh perspectives.',
  },
  {
    coreNature: 'Hypnotic focus, strategic subtlety, and protective intuition under the Sarpas.',
    vocation: 'Pharmacology, psychology, law, secret strategy, finance, or esoteric research.',
    growthPath: 'Cultivate transparent trust and channel intense perception into healing.',
  },
  {
    coreNature: 'Ancestral pride, dignified authority, and ceremonial leadership under the Pitris.',
    vocation: 'Executive leadership, heritage preservation, politics, law, or institutional management.',
    growthPath: 'Lead through humble service rather than resting solely on lineage or rank.',
  },
  {
    coreNature: 'Warm sociability, artistic enjoyment, and generous affection under Bhaga.',
    vocation: 'Entertainment, design, diplomacy, hospitality, coaching, or relationship arts.',
    growthPath: 'Align pleasure and creativity with purposeful discipline.',
  },
  {
    coreNature: 'Reliable patronage, contract fidelity, and organizing generosity under Aryaman.',
    vocation: 'Human resources, social institutions, philanthropy, management, or advisory work.',
    growthPath: 'Avoid over-functioning for others at the expense of personal rest.',
  },
  {
    coreNature: 'Deft craftsmanship, humor, practical intelligence, and healing touch under Savitar.',
    vocation: 'Surgery, software/craftsmanship, commerce, writing, astrology, or fine arts.',
    growthPath: 'Quiet overthinking through grounded manual or meditative craft.',
  },
  {
    coreNature: 'Architectural brilliance, aesthetic symmetry, and magnetic charisma under Tvashtar.',
    vocation: 'Architecture, UI/visual design, jewelry, engineering, media, or branding.',
    growthPath: 'Look beyond outer appearances to cultivate inner peace.',
  },
  {
    coreNature: 'Independent spirit, diplomatic flexibility, and wide networking under Vayu.',
    vocation: 'Trade, aviation/logistics, diplomacy, technology, sales, or independent consulting.',
    growthPath: 'Channel adaptability into deep roots so freedom does not become restlessness.',
  },
  {
    coreNature: 'Goal-oriented determination, persuasive intensity, and eventual triumph under Indragni.',
    vocation: 'Law, politics, competitive enterprise, research, or executive strategy.',
    growthPath: 'Practice patience and ethical fairness so ambition builds lasting alliances.',
  },
  {
    coreNature: 'Devoted friendship, organizational harmony, and quiet perseverance under Mitra.',
    vocation: 'Diplomacy, mathematics, international business, community building, or mining/analytics.',
    growthPath: 'Release lingering self-doubt and trust the loyalty you inspire in others.',
  },
  {
    coreNature: 'Protective courage, seniority of mind, and crisis mastery under Indra.',
    vocation: 'Senior management, defense, investigative journalism, surgery, or strategy.',
    growthPath: 'Temper vigilance and intensity with calm humility.',
  },
  {
    coreNature: 'Root-seeking inquiry, fearless truth-telling, and philosophical depth under Nirriti.',
    vocation: 'Medicine, philosophy, research, law, microbiology, or transformative counseling.',
    growthPath: 'Use penetrating honesty to heal and rebuild rather than merely uproot.',
  },
  {
    coreNature: 'Invincible optimism, persuasive grace, and purifying flow under Apas.',
    vocation: 'Law, media, academia, hospitality, maritime/water industries, or counseling.',
    growthPath: 'Invite constructive feedback early to refine bold convictions.',
  },
  {
    coreNature: 'Unshakeable integrity, broad alliances, and patient victory under the Vishvadevas.',
    vocation: 'Governance, social leadership, research, law, engineering, or public service.',
    growthPath: 'Ensure noble commitments stay sustainable for your personal energy.',
  },
  {
    coreNature: 'Attentive listening, scholarly synthesis, and steady service under Vishnu.',
    vocation: 'Teaching, media, acoustics/music, therapy, consulting, or technology.',
    growthPath: 'Discern true wisdom from gossip and preserve quiet reflection.',
  },
  {
    coreNature: 'Rhythmic ambition, resourcefulness, and team coordination under the Vasus.',
    vocation: 'Finance, music, real estate, engineering, athletics, or organizational leadership.',
    growthPath: 'Balance material drive with emotional softness in close relationships.',
  },
  {
    coreNature: 'Visionary independence, healing mystery, and scientific depth under Varuna.',
    vocation: 'Data systems, medicine, astronomy, oceanography, pharmacy, or research.',
    growthPath: 'Build trusted confidants rather than carrying heavy thoughts alone.',
  },
  {
    coreNature: 'Dual vision, idealistic reform, and intense intellectual fire under Aja Ekapada.',
    vocation: 'Philosophy, writing, advocacy, finance, metallurgy, or spiritual leadership.',
    growthPath: 'Synthesize idealism with calm emotional steadiness.',
  },
  {
    coreNature: 'Compassionate restraint, oceanic wisdom, and selfless resilience under Ahir Budhnya.',
    vocation: 'Counseling, research, non-profit leadership, esoteric study, or medicine.',
    growthPath: 'Maintain healthy boundaries while serving others generously.',
  },
  {
    coreNature: 'Safe guidance, gentle prosperity, and empathetic imagination under Pushan.',
    vocation: 'Education, travel, veterinary/care work, diplomacy, creative arts, or advisory.',
    growthPath: 'Protect practical clarity so compassion is never drained by escapism.',
  },
];

// Jaimini Sutras Atmakaraka soul lessons
export const ATMAKARAKA_THEMES: Record<NineGrahaId, string> = {
  Sun: 'Soul lesson centers on authentic leadership, overcoming ego pride, and shining with humble integrity.',
  Moon: 'Soul lesson centers on emotional equanimity, compassion, nurturing others, and mastering inner fluctuations.',
  Mars: 'Soul lesson centers on disciplined courage, non-violence in speech/action, and protecting the vulnerable.',
  Mercury: 'Soul lesson centers on truthfulness in communication, intellectual humility, and ethical commerce.',
  Jupiter: 'Soul lesson centers on honoring teachers/tradition, wisdom in action, and generous guidance.',
  Venus: 'Soul lesson centers on pure devotion, loyal partnership, and elevating aesthetic desire into grace.',
  Saturn: 'Soul lesson centers on patient endurance, serving the marginalized, and embracing accountability.',
  Rahu: 'Soul lesson centers on transcending illusion, channeling worldly ambition ethically, and cultivating clarity.',
  Ketu: 'Soul lesson centers on non-attachment, spiritual insight, and integrating intuition into daily service.',
};

export interface RemedyBlueprint {
  mantra: string;
  dana: string;
  lifestyle: string;
  gemWarning: string;
}

export const REMEDY_KB: Record<NineGrahaId, RemedyBlueprint> = {
  Sun: {
    mantra: 'Aditya Hridayam or "Om Suryaya Namaha" at sunrise',
    dana: 'Offer wheat, jaggery, or copper on Sundays',
    lifestyle: 'Respect father/mentors, maintain a regular dawn routine, and keep promises.',
    gemWarning: 'Ruby only when Sun is a functional benefic for the Lagna.',
  },
  Moon: {
    mantra: '"Om Somaya Namaha" or Shiva Panchakshari on Mondays',
    dana: 'Donate rice, milk, or white cloth to those in need on Mondays',
    lifestyle: 'Prioritize sleep hygiene, hydration, care for mother/elders, and quiet meditation.',
    gemWarning: 'Natural Pearl only when Moon is non-dusthana lord and needs support.',
  },
  Mars: {
    mantra: 'Hanuman Chalisa or "Om Mangalaya Namaha" on Tuesdays',
    dana: 'Donate red lentils (masoor) or support blood/emergency relief',
    lifestyle: 'Channel physical energy via exercise/sport and practice calm restraint in anger.',
    gemWarning: 'Red Coral only for Aries/Cancer/Leo/Scorpio/Sagittarius/Pisces Lagnas with consultation.',
  },
  Mercury: {
    mantra: 'Vishnu Sahasranama or "Om Budhaya Namaha" on Wednesdays',
    dana: 'Donate green gram, books, or educational supplies for students',
    lifestyle: 'Speak accurately without harsh sarcasm; keep accounts, study, and breathwork steady.',
    gemWarning: 'Emerald only if Mercury rules favorable houses (not 6/8/12 dominantly).',
  },
  Jupiter: {
    mantra: '"Om Gurave Namaha" or Dakshinamurthy Stotram on Thursdays',
    dana: 'Offer turmeric, yellow sweets, or support teachers and libraries',
    lifestyle: 'Honor teachers, study philosophy/scripture, and practice ethical generosity.',
    gemWarning: 'Yellow Sapphire only when Jupiter is functional benefic (avoid blindly for Taurus/Libra/Capricorn).',
  },
  Venus: {
    mantra: 'Sri Suktam or "Om Shukraya Namaha" on Fridays',
    dana: 'Donate white sweets, rice, or support arts and women’s welfare',
    lifestyle: 'Keep living spaces harmonious, treat partners with respect, and balance indulgence.',
    gemWarning: 'Diamond/White Sapphire only when Venus is Yogakaraka or strong benefic.',
  },
  Saturn: {
    mantra: 'Dasharatha Shani Stotram or "Om Sham Shanicharaya Namaha" on Saturdays',
    dana: 'Offer sesame oil, black sesame, or warm meals to laborers and elders',
    lifestyle: 'Practice punctuality, patience, fair treatment of subordinates, and steady hard work.',
    gemWarning: 'Blue Sapphire must never be worn without strict chart verification (only Taurus/Libra/Capricorn/Aquarius).',
  },
  Rahu: {
    mantra: 'Durga Chalisa or "Om Rahave Namaha"',
    dana: 'Support sanitation workers, donate blankets, or feed stray dogs/birds',
    lifestyle: 'Avoid shortcuts, intoxicants, and obsessive speculation; ground habits in transparency.',
    gemWarning: 'Hessonite (Gomed) is rarely needed and should be avoided without specialist review.',
  },
  Ketu: {
    mantra: 'Ganesha Atharvashirsha or "Om Ketave Namaha"',
    dana: 'Donate multi-colored blankets or feed dogs/needy',
    lifestyle: 'Engage in daily quiet contemplation, journaling, and selfless service.',
    gemWarning: 'Cat’s Eye is highly potent and generally avoided unless chart strongly calls for it.',
  },
};
