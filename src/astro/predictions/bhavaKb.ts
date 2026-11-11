import type { NineGrahaId } from '../types';

export interface PlanetHouseEntry {
  headline: string;
  reading: string;
  sources: string[];
}

// 9 Grahas x 12 Houses (index 0 = House 1 .. index 11 = House 12)
// Synthesized from Brihat Parashara Hora Shastra, Phaladeepika, Saravali, and Brihat Jataka.
export const PLANET_IN_HOUSE_KB: Record<NineGrahaId, PlanetHouseEntry[]> = {
  Sun: [
    {
      headline: 'Sovereign Bearing & Radiant Vitality',
      reading: 'Strong sense of personal dignity, leadership drive, and clear self-expression. In *Saravali*, Sun in the 1st grants courage, administrative vision, and ambition, though care is needed against heat, eye strain, or excessive pride.',
      sources: ['Brihat Jataka', 'Saravali'],
    },
    {
      headline: 'Focused Earnings & Authoritative Speech',
      reading: 'Financial self-reliance, dignified family standards, and firm speech. When well-aspected, brings wealth through government, leadership, or paternal lineage; if afflicted, guard against bluntness in domestic matters.',
      sources: ['Phaladeepika', 'BPHS'],
    },
    {
      headline: 'Courageous Initiative & Self-Made Stride',
      reading: 'Classically celebrated as a strong placement for Sun (Upachaya). Confers valor, intellectual sharpness, decisive communication, and triumph over rivals through personal effort.',
      sources: ['BPHS', 'Saravali'],
    },
    {
      headline: 'Private Depth & Estate Focus',
      reading: 'Directs vitality toward home, lineage, land, and inner peace. Sun loses directional strength (Dig Bala) here, so emotional ease grows when ambition at work is balanced with domestic warmth.',
      sources: ['Phaladeepika', 'Saravali'],
    },
    {
      headline: 'Creative Intelligence & Advisory Authority',
      reading: 'Sharp analytical mind, interest in classical scholarship, strategy, or speculation, and strong pride in children/creative works. Avoid rigidity in romance or mentoring.',
      sources: ['BPHS', 'Phaladeepika'],
    },
    {
      headline: 'Victory Over Obstacles & Service Command',
      reading: 'In the 6th Upachaya, Sun burns away adversaries and empowers medicine, law, administration, or competitive fields. Maintain disciplined digestion and stress recovery.',
      sources: ['Saravali', 'Phaladeepika'],
    },
    {
      headline: 'Partnership Dynamics & Public Visibility',
      reading: 'Draws strong-willed, accomplished partners and highlights public dealings or diplomacy. Mutual respect is key so ego clashes do not overshadow shared purpose.',
      sources: ['Brihat Jataka', 'Phaladeepika'],
    },
    {
      headline: 'Investigative Depth & Transformative Resilience',
      reading: 'Attraction to research, psychology, inheritance, or hidden sciences. Teaches humility through deep life transitions and supports mastery in specialized or behind-the-scenes fields.',
      sources: ['Saravali', 'Uttara Kalamrita'],
    },
    {
      headline: 'Dharmic Conviction & Higher Vision',
      reading: 'Noble ethics, respect for higher learning, long-distance travel, and philosophical devotion. Supports teaching, publishing, law, and moral leadership.',
      sources: ['BPHS', 'Phaladeepika'],
    },
    {
      headline: 'Peak Career Authority (Dig Bala)',
      reading: 'Sun achieves full directional strength in the 10th house. Classical texts promise institutional authority, reputation, executive command, and visible professional achievement.',
      sources: ['BPHS', 'Saravali', 'Phaladeepika'],
    },
    {
      headline: 'Influential Networks & Steady Gains',
      reading: 'An outstanding Upachaya placement for income, prominent patrons, honors, and fulfillment of long-range ambitions through structured alliances.',
      sources: ['Phaladeepika', 'Saravali'],
    },
    {
      headline: 'Contemplative Retreat & Global Reach',
      reading: 'Turns solar energy inward toward spirituality, foreign lands, research, or charitable service behind the scenes. Guard against scattered energy and prioritize restorative sleep.',
      sources: ['Saravali', 'BPHS'],
    },
  ],
  Moon: [
    {
      headline: 'Empathy, Magnetism & Responsive Mind',
      reading: 'Sensitive, imaginative, and attuned to public mood. A waxing/bright Moon in the 1st gives charm, popularity, and intuitive flair; a waning Moon calls for steady emotional boundaries.',
      sources: ['Brihat Jataka', 'Saravali'],
    },
    {
      headline: 'Warm Speech, Family Ties & Liquid Prosperity',
      reading: 'Gentle, persuasive voice, hospitality, and fluid financial cycles. Supports culinary arts, music, finance, counseling, and family-oriented enterprise.',
      sources: ['Phaladeepika', 'Saravali'],
    },
    {
      headline: 'Curious Communicator & Artistic Effort',
      reading: 'Lively imagination, short journeys, strong bond with siblings/peers, and talent in writing, media, or teaching.',
      sources: ['Saravali', 'BPHS'],
    },
    {
      headline: 'Peak Emotional Sanctuary (Dig Bala)',
      reading: 'Moon gains full directional strength in the 4th house. Blesses domestic contentment, maternal bond, real estate/vehicles, and heartfelt public goodwill.',
      sources: ['BPHS', 'Phaladeepika'],
    },
    {
      headline: 'Poetic Intellect & Devotional Heart',
      reading: 'Creative intuition, fondness for children, subtle mantra/counseling instinct, and artistic refinement. Avoid emotional impulsiveness in speculative decisions.',
      sources: ['Phaladeepika', 'Saravali'],
    },
    {
      headline: 'Compassionate Service & Adaptive Healing',
      reading: 'Instinct for nursing, healing, problem-solving, and caretaking. Prioritize calm digestive and sleep routines so worry does not tax physical stamina.',
      sources: ['Saravali', 'Brihat Jataka'],
    },
    {
      headline: 'Relational Sensitivity & Diplomatic Appeal',
      reading: 'Seeks deep emotional resonance in marriage and business partnerships. Confers graceful social manners and success in client-facing professions.',
      sources: ['Phaladeepika', 'Saravali'],
    },
    {
      headline: 'Psychic Depth & Unseen Insight',
      reading: 'Heightened intuition, fascination with psychology, healing, or occult traditions, and intense inner transformations. Meditation brings deep steadiness.',
      sources: ['BPHS', 'Saravali'],
    },
    {
      headline: 'Pilgrimage, Ethics & Broad Horizons',
      reading: 'Love for higher philosophy, travel, teachers, and charitable ideals. Often brings prosperity through international ties or educational institutions.',
      sources: ['Phaladeepika', 'BPHS'],
    },
    {
      headline: 'Public Reputation & Adaptive Career',
      reading: 'Success in professions touching the public—hospitality, healthcare, public relations, trade, or advisory roles. Career grows through responsiveness and trust.',
      sources: ['Saravali', 'Phaladeepika'],
    },
    {
      headline: 'Wide Circle & Collective Gains',
      reading: 'Supportive friendships, gains through social networks, and compassionate humanitarian goals. Income flows smoothly when linked to community value.',
      sources: ['BPHS', 'Saravali'],
    },
    {
      headline: 'Mystical Imagination & Quiet Compassion',
      reading: 'Rich dream life, artistic solitude, charitable sympathy, and affinity for foreign sanctuaries or hospitals. Grounding daily routines keep energy centered.',
      sources: ['Saravali', 'Phaladeepika'],
    },
  ],
  Mars: [
    {
      headline: 'Bold Vitality & Fearless Initiative',
      reading: 'Direct, energetic, and protective presence. Grants mechanical/technical drive and courage; *Phaladeepika* advises patience in speech and tempering impulsiveness.',
      sources: ['Phaladeepika', 'Saravali'],
    },
    {
      headline: 'Forceful Expression & Hard-Earned Assets',
      reading: 'Decisive speech and strong drive to accumulate resources. When disciplined, succeeds in engineering, finance, or leadership; avoid sharp words in family debates.',
      sources: ['Saravali', 'BPHS'],
    },
    {
      headline: 'Classical Valor (Upachaya Powerhouse)',
      reading: 'One of the finest placements for Mars: fearless courage, athletic/technical skill, strategic boldness, and victory in competition.',
      sources: ['BPHS', 'Phaladeepika'],
    },
    {
      headline: 'Driven Domestic Foundation & Property Energy',
      reading: 'Strong desire to acquire land, vehicles, and protect family. Channel restlessness constructively into home building or real estate rather than domestic friction.',
      sources: ['Saravali', 'Brihat Jataka'],
    },
    {
      headline: 'Sharp Tactical Intellect',
      reading: 'Incisive problem-solving, competitive spirit, and technical creativity. Balance impatience in romance or parenting with warm listening.',
      sources: ['Phaladeepika', 'Saravali'],
    },
    {
      headline: 'Triumph Over Rivals (Upachaya Victory)',
      reading: 'Classically praised for overcoming debts, litigation, and adversaries through grit, surgery/medical precision, or disciplined execution.',
      sources: ['BPHS', 'Saravali'],
    },
    {
      headline: 'Passionate Partnership & Active Enterprise',
      reading: 'Attracts energetic, independent partners and thrives in dynamic business collaborations. Conscious diplomacy prevents power struggles.',
      sources: ['Phaladeepika', 'BPHS'],
    },
    {
      headline: 'Crisis Composure & Research Intensity',
      reading: 'Thrives in emergency work, surgery, engineering diagnostics, or deep research. Guard against haste around machinery or sudden risks.',
      sources: ['Saravali', 'Uttara Kalamrita'],
    },
    {
      headline: 'Crusading Conviction & Long Journeys',
      reading: 'Fierce defense of principles, technical/legal exploration, and active enterprise abroad or in higher institutions.',
      sources: ['Phaladeepika', 'Saravali'],
    },
    {
      headline: 'Executive Command (Dig Bala)',
      reading: 'Mars attains full directional strength in the 10th house. Confers pioneering career achievement, engineering/command leadership, and decisive authority.',
      sources: ['BPHS', 'Phaladeepika', 'Saravali'],
    },
    {
      headline: 'Ambitious Gains & Property Prosperity',
      reading: 'Strong Upachaya placement yielding gains from enterprise, real estate, technology, and influential allies.',
      sources: ['BPHS', 'Saravali'],
    },
    {
      headline: 'Behind-the-Scenes Drive & Foreign Ventures',
      reading: 'Energy invested in distant projects, institutions, or spiritual discipline. Prioritize rest and avoid silent simmering frustration.',
      sources: ['Saravali', 'Phaladeepika'],
    },
  ],
  Mercury: [
    {
      headline: 'Articulate Wit & Intellectual Agility (Dig Bala)',
      reading: 'Mercury reaches peak directional strength in the 1st house. Grants eloquence, mathematical/analytical talent, youthful adaptability, and scholarly charm.',
      sources: ['BPHS', 'Phaladeepika'],
    },
    {
      headline: 'Persuasive Commerce & Refined Speech',
      reading: 'Clever speech, financial literacy, accounting skill, and income through writing, teaching, media, or trade.',
      sources: ['Saravali', 'BPHS'],
    },
    {
      headline: 'Writer’s Craft & Versatile Connections',
      reading: 'Abundant ideas, strong sibling/peer communication, and natural aptitude for journalism, software, marketing, and languages.',
      sources: ['Phaladeepika', 'Saravali'],
    },
    {
      headline: 'Scholarly Home & Cultivated Taste',
      reading: 'Mind rooted in continuous learning, books, real estate documentation, and harmonious intellectual conversation at home.',
      sources: ['Saravali', 'BPHS'],
    },
    {
      headline: 'Analytical Brilliance & Advisory Skill',
      reading: 'Excel in mathematics, coding, counseling, mantra/scripture, and strategic planning; bright, curious temperament.',
      sources: ['BPHS', 'Phaladeepika'],
    },
    {
      headline: 'Sharp Diagnostics & Debate Mastery',
      reading: 'Excels in auditing, legal analysis, medical diagnostics, and systematic problem-solving; turns complexity into clear order.',
      sources: ['Saravali', 'Phaladeepika'],
    },
    {
      headline: 'Diplomatic Commerce & Clever Partnership',
      reading: 'Values witty, communicative partners and succeeds in contracts, negotiations, consulting, and trade.',
      sources: ['Brihat Jataka', 'Saravali'],
    },
    {
      headline: 'Deep Investigation & Esoteric Literacy',
      reading: 'Penetrating curiosity for research, psychology, occult systems, finance/taxation, and hidden technical domains.',
      sources: ['Uttara Kalamrita', 'Saravali'],
    },
    {
      headline: 'Philosophical Synthesis & Publishing',
      reading: 'Connects analytical clarity with higher law, academia, publishing, and international communication.',
      sources: ['BPHS', 'Phaladeepika'],
    },
    {
      headline: 'Strategic Career & Multi-Skill Reputation',
      reading: 'Builds recognition through intelligence, writing, technology, trade, or executive communications.',
      sources: ['Saravali', 'Phaladeepika'],
    },
    {
      headline: 'Networked Prosperity & Advisory Gains',
      reading: 'Consistent gains from commerce, intellectual property, diverse friendships, and collaborative platforms.',
      sources: ['BPHS', 'Saravali'],
    },
    {
      headline: 'Quiet Study & Cross-Border Expression',
      reading: 'Subtle imagination suited to research, translation, foreign work, or contemplative writing; guard against mental over-fatigue.',
      sources: ['Phaladeepika', 'Saravali'],
    },
  ],
  Jupiter: [
    {
      headline: 'Wisdom, Grace & Protective Blessing (Dig Bala)',
      reading: 'Jupiter reaches full directional strength in the 1st house. *BPHS* praises this as a shield over the entire chart—conferring ethics, poise, learning, and benevolent leadership.',
      sources: ['BPHS', 'Phaladeepika', 'Saravali'],
    },
    {
      headline: 'Abundant Speech, Lineage & Ethical Wealth',
      reading: 'Cultured, truthful speech, financial wisdom, scholarly family atmosphere, and steady growth of treasury.',
      sources: ['Saravali', 'Phaladeepika'],
    },
    {
      headline: 'Principled Effort & Supportive Allies',
      reading: 'Thoughtful courage, ethical communication, teaching/writing ability, and loyal assistance from siblings or peers.',
      sources: ['Phaladeepika', 'BPHS'],
    },
    {
      headline: 'Noble Sanctuary & Domestic Fulfillment',
      reading: 'Harmonious home, virtuous elders/mother, spacious property, and deep emotional peace rooted in wisdom.',
      sources: ['BPHS', 'Saravali'],
    },
    {
      headline: 'Classic Vidya, Progeny & Spiritual Merit',
      reading: 'Great intelligence, sound judgment, joy through children/students, and profound Purva Punya (merit from past virtue).',
      sources: ['Brihat Jataka', 'Phaladeepika'],
    },
    {
      headline: 'Graceful Resolution & Healing Counsel',
      reading: 'Softens enmities through fairness, supports legal/medical advisory roles, and preserves inner optimism through challenges.',
      sources: ['Saravali', 'Phaladeepika'],
    },
    {
      headline: 'Virtuous Partnership & Honored Alliances',
      reading: 'Draws wise, ethical spouses/partners and fosters mutual growth through shared philosophy, travel, and trust.',
      sources: ['BPHS', 'Saravali'],
    },
    {
      headline: 'Quiet Grace & Longevity Shield',
      reading: 'Protects longevity, deepens interest in contemplative philosophy or heritage research, and brings timely rescue during crises.',
      sources: ['Phaladeepika', 'Uttara Kalamrita'],
    },
    {
      headline: 'Beacon of Dharma & Higher Fortune',
      reading: 'One of the most auspicious placements in Jyotish: devotion, mentors, pilgrimage, legal/academic eminence, and lasting good fortune.',
      sources: ['BPHS', 'Saravali', 'Phaladeepika'],
    },
    {
      headline: 'Honorable Career & Mentoring Stature',
      reading: 'High credibility in education, law, finance, governance, or advisory leadership; steady rise founded on integrity.',
      sources: ['BPHS', 'Phaladeepika'],
    },
    {
      headline: 'Expansive Gains & Benevolent Networks',
      reading: 'Broad financial gains, respected mentors/elders, and fulfillment of aspirations through honorable collaboration.',
      sources: ['Saravali', 'BPHS'],
    },
    {
      headline: 'Spiritual Compassion & Charitable Legacy',
      reading: 'Generous spirit, peaceful sleep, affinity for spiritual retreats or foreign institutions, and graceful detachment.',
      sources: ['Phaladeepika', 'Saravali'],
    },
  ],
  Venus: [
    {
      headline: 'Charm, Aesthetic Taste & Social Grace',
      reading: 'Refined appearance, artistic sensibility, diplomacy, and natural attractiveness. Favors design, arts, hospitality, and harmonious relations.',
      sources: ['Brihat Jataka', 'Saravali'],
    },
    {
      headline: 'Sweet Speech, Artistry & Accumulating Comfort',
      reading: 'Melodious voice, appreciation of fine food/music, and steady ability to build wealth and pleasant domestic culture.',
      sources: ['Phaladeepika', 'BPHS'],
    },
    {
      headline: 'Creative Expression & Harmonious Peers',
      reading: 'Artistic communication, tasteful writing or performance, pleasant journeys, and affectionate relationships with siblings.',
      sources: ['Saravali', 'Phaladeepika'],
    },
    {
      headline: 'Peak Domestic Luxury & Peace (Dig Bala)',
      reading: 'Venus gains full directional strength in the 4th house. Bestows vehicles, attractive home, emotional warmth, and musical/artistic joy.',
      sources: ['BPHS', 'Phaladeepika'],
    },
    {
      headline: 'Romantic Creativity & Cultured Intellect',
      reading: 'Poetic imagination, devotion to arts, joy with children, and tasteful creative ventures.',
      sources: ['Saravali', 'Phaladeepika'],
    },
    {
      headline: 'Tactful Service & Healing Aesthetics',
      reading: 'Resolves conflict gently through diplomacy; excels in wellness, design, or client care. Guard against over-indulgence affecting metabolism.',
      sources: ['Phaladeepika', 'Saravali'],
    },
    {
      headline: 'Devoted Partnership & Social Magnetism',
      reading: 'Natural fondness for marriage and aesthetic companionship; thrives in public relations, luxury commerce, and diplomacy.',
      sources: ['BPHS', 'Saravali'],
    },
    {
      headline: 'Intense Devotion & Shared Resources',
      reading: 'Deep emotional loyalty, gains through joint assets or inheritance, and fascination with mystic aesthetics.',
      sources: ['Saravali', 'Uttara Kalamrita'],
    },
    {
      headline: 'Fortunate Grace, Arts & Distant Beauty',
      reading: 'Luck through cultural exchange, higher education, travel, and charitable refinement.',
      sources: ['Phaladeepika', 'BPHS'],
    },
    {
      headline: 'Prestigious Creative or Diplomatic Career',
      reading: 'Public admiration in arts, architecture, finance, fashion, law, or leadership where charm and judgment unite.',
      sources: ['Saravali', 'Phaladeepika'],
    },
    {
      headline: 'Prosperous Alliances & Fulfilled Desires',
      reading: 'Abundant gains through friends, refined networks, arts, or commercial patronage.',
      sources: ['BPHS', 'Phaladeepika'],
    },
    {
      headline: 'Unconditional Love & Contemplative Ease',
      reading: 'Classically praised for Venus—grants restful comforts, foreign travel, artistic solitude, and generous compassion.',
      sources: ['Phaladeepika', 'Saravali'],
    },
  ],
  Saturn: [
    {
      headline: 'Stoic Endurance & Mature Gravity',
      reading: 'Self-disciplined, realistic, and responsible from youth. Rewards steady perseverance over years; prioritize joint mobility and optimism.',
      sources: ['Saravali', 'Phaladeepika'],
    },
    {
      headline: 'Frugal Stewardship & Measured Speech',
      reading: 'Careful wealth accumulation, sober truthfulness, and late-maturing financial security through patient discipline.',
      sources: ['BPHS', 'Saravali'],
    },
    {
      headline: 'Classical Endurance (Upachaya Strength)',
      reading: 'One of Saturn’s strongest seats: unwavering determination, strategic patience, and steady triumph through disciplined effort.',
      sources: ['BPHS', 'Phaladeepika'],
    },
    {
      headline: 'Dutiful Foundation & Ancestral Responsibility',
      reading: 'Strong sense of duty toward home and property; gains real estate slowly and solidly while learning to balance duty with emotional warmth.',
      sources: ['Saravali', 'Brihat Jataka'],
    },
    {
      headline: 'Structured Intellect & Serious Study',
      reading: 'Deep concentration for mathematics, law, engineering, or philosophy; measured approach to romance and parenting.',
      sources: ['Phaladeepika', 'Saravali'],
    },
    {
      headline: 'Unmatched Persistence Over Adversity',
      reading: 'In the 6th Upachaya, Saturn systematically wears down rivals, debt, and obstacles through methodical hard work and service.',
      sources: ['BPHS', 'Saravali'],
    },
    {
      headline: 'Loyal Commitment & Gravitas (Dig Bala)',
      reading: 'Saturn attains full directional strength in the 7th house. Favors mature, enduring partnerships, structured contracts, and steady diplomacy.',
      sources: ['BPHS', 'Phaladeepika'],
    },
    {
      headline: 'Longevity Endurance & Research Depth',
      reading: 'Classically associated with longevity and deep investigative persistence. Teaches resilience through slow, structural transformations.',
      sources: ['Phaladeepika', 'Uttara Kalamrita'],
    },
    {
      headline: 'Principled Duty & Structured Philosophy',
      reading: 'Grounded, pragmatic ethics, respect for enduring tradition, and disciplined study of law, history, or metaphysics.',
      sources: ['Saravali', 'BPHS'],
    },
    {
      headline: 'Builder of Institutions & Lasting Authority',
      reading: 'Powerful placement for steady career ascent through integrity, administration, engineering, law, or public service—peaks strongly with maturity.',
      sources: ['BPHS', 'Phaladeepika'],
    },
    {
      headline: 'Enduring Gains & Senior Networks',
      reading: 'Classically one of the best seats for Saturn: reliable long-term income, property, and loyal support from elders or institutions.',
      sources: ['BPHS', 'Saravali'],
    },
    {
      headline: 'Monastic Discipline & Quiet Service',
      reading: 'Attraction to solitude, research, hospitals, foreign work, or selfless spiritual service; rewards conscious expenditure and rest.',
      sources: ['Saravali', 'Phaladeepika'],
    },
  ],
  Rahu: [
    {
      headline: 'Unconventional Charisma & Worldly Drive',
      reading: 'Magnetic, ambitious, and non-conformist presence. Excels when channeling bold originality through clear ethics.',
      sources: ['BPHS', 'Uttara Kalamrita'],
    },
    {
      headline: 'Unusual Income Streams & Bold Speech',
      reading: 'Attracted to modern finance, foreign languages, or unconventional family wealth; cultivate grounded honesty in speech and budgets.',
      sources: ['Saravali', 'Phaladeepika'],
    },
    {
      headline: 'Fearless Upachaya Drive & Media Savvy',
      reading: 'Classically praised placement for Rahu: bold communication, tech/media fluency, risk-taking courage, and victory over competition.',
      sources: ['BPHS', 'Phaladeepika'],
    },
    {
      headline: 'Foreign Ties & Restless Search for Roots',
      reading: 'Drawn to distant residences, unique architecture, or transforming ancestral patterns into broader horizons.',
      sources: ['Uttara Kalamrita', 'BPHS'],
    },
    {
      headline: 'Inventive Intellect & Speculative Flair',
      reading: 'Unorthodox creative ideas, interest in emerging technology or psychology; apply patience before high-risk speculation.',
      sources: ['BPHS', 'Phaladeepika'],
    },
    {
      headline: 'Dynamic Problem-Solver (Upachaya Victory)',
      reading: 'Strong capacity to outmaneuver competition, heal complex ailments, and master crisis strategy or technology.',
      sources: ['BPHS', 'Saravali'],
    },
    {
      headline: 'Cross-Cultural Partnership & Public Reach',
      reading: 'Draws unconventional or international partnerships and business networks; clarity and trust anchor lasting harmony.',
      sources: ['Phaladeepika', 'BPHS'],
    },
    {
      headline: 'Penetrating Intuition & Research Breakthroughs',
      reading: 'Deep pull toward mystery, science, psychology, or transformative finance; thrive through transparency and steady grounding.',
      sources: ['Uttara Kalamrita', 'Saravali'],
    },
    {
      headline: 'Global Philosophy & Breaking Dogma',
      reading: 'Questions narrow convention in pursuit of universal or cross-cultural wisdom; international travel and higher learning expand fortune.',
      sources: ['BPHS', 'Phaladeepika'],
    },
    {
      headline: 'High Ambition & Disruptive Career Rise',
      reading: 'Classically celebrated for career prominence, technology/media leadership, and rapid public ascent when paired with integrity.',
      sources: ['BPHS', 'Uttara Kalamrita'],
    },
    {
      headline: 'Amplified Gains & Vast Networks',
      reading: 'One of Rahu’s premier Upachaya placements: abundant income, large social/digital networks, and fulfillment of ambitious goals.',
      sources: ['BPHS', 'Phaladeepika'],
    },
    {
      headline: 'Global Horizons & Subconscious Depth',
      reading: 'Strong affinity for foreign residence, spiritual exploration, or research; mindful sleep and budgeting keep energy balanced.',
      sources: ['BPHS', 'Uttara Kalamrita'],
    },
  ],
  Ketu: [
    {
      headline: 'Inward Wisdom & Quiet Self-Mastery',
      reading: 'Perceptive, self-contained, and spiritually sensitive. Combines sharp intuition with a preference for substance over show.',
      sources: ['BPHS', 'Jaimini Sutras'],
    },
    {
      headline: 'Minimalist Values & Penetrating Speech',
      reading: 'Unattached to empty materialism yet incisive in speech; thrives in research, mantra, or spiritual philosophy.',
      sources: ['Uttara Kalamrita', 'BPHS'],
    },
    {
      headline: 'Quiet Determination & Technical Skill',
      reading: 'Focused courage, precise craftsmanship, and steady spiritual or analytical discipline.',
      sources: ['BPHS', 'Saravali'],
    },
    {
      headline: 'Inner Sanctuary & Contemplative Home',
      reading: 'Values peaceful, uncluttered living spaces and deep introspection; emotional steadiness grows through spiritual roots.',
      sources: ['Phaladeepika', 'BPHS'],
    },
    {
      headline: 'Intuitive Scholarship & Mantra Siddhi',
      reading: 'Profound analytical/spiritual insight, affinity for mathematics, coding, or traditional wisdom; learns through deep reflection.',
      sources: ['BPHS', 'Jaimini Sutras'],
    },
    {
      headline: 'Sharp Diagnosis & Quiet Triumph',
      reading: 'Classically favorable Upachaya placement for Ketu: dissolves opposition quietly and excels in healing, diagnostics, or focused service.',
      sources: ['BPHS', 'Phaladeepika'],
    },
    {
      headline: 'Karmic Partnership & Spiritual Depth',
      reading: 'Seeks authentic, soul-level resonance rather than superficial social convention in partnerships.',
      sources: ['BPHS', 'Uttara Kalamrita'],
    },
    {
      headline: 'Mystic Insight & Transformative Depth',
      reading: 'Strongest affinity for meditation, psychology, Ayurveda/healing, and uncovering hidden truths beyond appearances.',
      sources: ['Jaimini Sutras', 'Uttara Kalamrita'],
    },
    {
      headline: 'Pilgrim Spirit & Philosophical Independence',
      reading: 'Seeks direct spiritual realization, pilgrimage, and timeless ethics beyond sectarian boundaries.',
      sources: ['BPHS', 'Jaimini Sutras'],
    },
    {
      headline: 'Detached Mastery & Specialized Craft',
      reading: 'Accomplishes impressive work without craving applause—ideal for research, engineering, medicine, or advisory wisdom.',
      sources: ['BPHS', 'Uttara Kalamrita'],
    },
    {
      headline: 'Selective Alliances & Quiet Gains',
      reading: 'Gains come unexpectedly through specialized expertise or trusted inner-circle allies rather than noisy crowds.',
      sources: ['BPHS', 'Phaladeepika'],
    },
    {
      headline: 'Moksha Karaka (Liberation & Transcendence)',
      reading: 'Classically celebrated as Ketu’s highest spiritual seat—deep intuition, restful contemplation, foreign retreats, and liberating wisdom.',
      sources: ['BPHS', 'Jaimini Sutras', 'Phaladeepika'],
    },
  ],
};

// Brihat Parashara Hora Shastra Ch. 24 (Bhavesha Phala) summaries
const HOUSE_DOMAIN_TOPICS = [
  'vitality, self-identity, and overall trajectory',
  'wealth, family heritage, and speech',
  'courage, siblings, communication, and self-effort',
  'home, mother, inner peace, vehicles, and education',
  'intellect, creativity, children, and past-life merit',
  'service, health discipline, competition, and debts',
  'marriage, partnerships, and public contracts',
  'longevity, research, shared wealth, and transformation',
  'dharma, fortune, mentors, higher learning, and travel',
  'career, public stature, authority, and karma',
  'gains, friendships, elder siblings, and fulfillment',
  'liberation, foreign lands, sleep, and expenditure',
];

const PLACED_HOUSE_THEMES = [
  'the Lagna (1st house), tying this domain directly to personal identity and self-driven initiative',
  'the 2nd house, channeling this domain into financial accumulation, family ties, and speech',
  'the 3rd house, expressing this domain through courage, writing, media, siblings, and personal enterprise',
  'the 4th house, rooting this domain in home, property, domestic happiness, and foundational learning',
  'the 5th house, infusing this domain with intelligence, creativity, mentorship, children, and Purva Punya',
  'the 6th house, engaging this domain with competitive service, healing, legal/analytical problem-solving, and effort',
  'the 7th house, linking this domain closely with marriage, business partners, and public dealings',
  'the 8th house, bringing deep research, sudden transitions, inheritance, or resilient transformation to this domain',
  'the 9th house, blessing this domain with dharma, fortune, higher guidance, and broad horizons',
  'the 10th house, elevating this domain into visible career, reputation, and public responsibility',
  'the 11th house, amplifying this domain toward tangible gains, influential networks, and realized goals',
  'the 12th house, turning this domain toward foreign connections, behind-the-scenes work, charity, or spiritual detachment',
];

export function buildHouseLordReading(
  lordHouse: number,
  placedHouse: number,
  planetName: string,
  dignity: string
): { headline: string; reading: string } {
  const topic = HOUSE_DOMAIN_TOPICS[lordHouse - 1];
  const target = PLACED_HOUSE_THEMES[placedHouse - 1];

  const isDusthanaToDusthana =
    [6, 8, 12].includes(lordHouse) && [6, 8, 12].includes(placedHouse) && lordHouse !== placedHouse;
  const isKendraOrTrikona = [1, 4, 5, 7, 9, 10].includes(placedHouse);
  const isStrongDignity = ['Exalted', 'Moolatrikona', 'Own Sign', 'Great Friend'].includes(dignity);

  let nuance = '';
  if (lordHouse === placedHouse) {
    nuance = 'Occupying its own house strengthens stability, self-reliance, and enduring protection over these affairs.';
  } else if (isDusthanaToDusthana) {
    nuance = 'Classical Viparita placement: difficulties convert into unexpected resilience and victory after initial testing.';
  } else if (isKendraOrTrikona && isStrongDignity) {
    nuance = 'Strong angular/trinal placement with supportive dignity favors smooth, auspicious manifestation.';
  } else if ([6, 8, 12].includes(placedHouse) && ![6, 8, 12].includes(lordHouse)) {
    nuance = 'Placed in a challenging Bhava, rewarding patience, service, foreign opportunities, or disciplined management.';
  } else {
    nuance = 'Manifests actively through deliberate effort, timing of its Dasha, and aspects received.';
  }

  return {
    headline: `Lord of ${lordHouse} (${planetName}) in House ${placedHouse}`,
    reading: `Per *BPHS Ch. 24*, the ruler of ${topic} enters ${target}. ${nuance}`,
  };
}

// Phaladeepika Ch. 26 (Gochara Phala) — Benefic transit houses from Natal Moon
export const GOCHAR_GOOD_HOUSES: Record<NineGrahaId, number[]> = {
  Sun: [3, 6, 10, 11],
  Moon: [1, 3, 6, 7, 10, 11],
  Mars: [3, 6, 11],
  Mercury: [2, 4, 6, 8, 10, 11],
  Jupiter: [2, 5, 7, 9, 11],
  Venus: [1, 2, 3, 4, 5, 8, 9, 11, 12],
  Saturn: [3, 6, 11],
  Rahu: [3, 6, 11],
  Ketu: [3, 6, 11],
};

// Phaladeepika / Brihat Samhita Vedha (obstruction) house mapping: goodHouse -> vedhaHouse
export const GOCHAR_VEDHA_MAP: Record<NineGrahaId, Record<number, number>> = {
  Sun: { 3: 9, 6: 12, 10: 4, 11: 5 },
  Moon: { 1: 5, 3: 9, 6: 12, 7: 2, 10: 4, 11: 8 },
  Mars: { 3: 12, 6: 9, 11: 5 },
  Mercury: { 2: 5, 4: 3, 6: 9, 8: 1, 10: 7, 11: 12 },
  Jupiter: { 2: 12, 5: 4, 7: 3, 9: 10, 11: 8 },
  Venus: { 1: 8, 2: 7, 3: 1, 4: 10, 5: 9, 8: 5, 9: 11, 11: 6, 12: 3 },
  Saturn: { 3: 12, 6: 9, 11: 5 },
  Rahu: { 3: 12, 6: 9, 11: 5 },
  Ketu: { 3: 12, 6: 9, 11: 5 },
};

export function isVedhaExemptPair(p1: NineGrahaId, p2: NineGrahaId): boolean {
  if ((p1 === 'Sun' && p2 === 'Saturn') || (p1 === 'Saturn' && p2 === 'Sun')) return true;
  if ((p1 === 'Moon' && p2 === 'Mercury') || (p1 === 'Mercury' && p2 === 'Moon')) return true;
  return false;
}
