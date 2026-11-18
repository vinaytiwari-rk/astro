/**
 * Fortune & Karmic Calculators Engine
 * AV Astro Vibe — 100% Offline, Zero External API Dependency
 *
 * Implements:
 * 1. Love Compatibility Calculator (Chaldean/Pythagorean + Mulank/Bhagyank + Planetary Harmony)
 * 2. Friendship Compatibility Calculator (Vibrational Resonance & Loyalty Quotient)
 * 3. Past Life Calculator (Garuda Purana, Parashari 12th/5th house & Rahu-Ketu Nodal Axis)
 * 4. Future Life & Rebirth Trajectory Calculator (Soul Gati, Karakamsha & Moksha Proximity)
 */

import { computeNameNumber, reduceToSingleDigit } from './numerology';
import { SIGNS } from './constants';
import type { ChartData, NineGrahaId, SevenPlanetId } from './types';

// ==========================================
// 1. LOVE COMPATIBILITY CALCULATOR
// ==========================================

export interface PersonNumerologyProfile {
  name: string;
  dob: string; // YYYY-MM-DD or DD-MM-YYYY
  mulank: number;
  bhagyank: number;
  chaldeanNumber: number;
  pythagoreanNumber: number;
  rulingPlanetEn: string;
  rulingPlanetHi: string;
}

export interface LoveCompatibilityReport {
  person1: PersonNumerologyProfile;
  person2: PersonNumerologyProfile;
  overallLoveScore: number; // 0..100
  attractionScore: number;
  emotionalResonanceScore: number;
  communicationScore: number;
  maritalStabilityScore: number;
  intensityCategoryHi: 'अति उत्तम (Divine Match)' | 'उत्तम (Harmonious Union)' | 'मध्यम (Requires Effort)' | 'चुनौतीपूर्ण (Karmic Friction)';
  intensityCategoryEn: 'Divine Match' | 'Harmonious Union' | 'Requires Effort' | 'Karmic Friction';
  relationshipDynamicsEn: string;
  relationshipDynamicsHi: string;
  potentialFrictionEn: string;
  potentialFrictionHi: string;
  harmonizingRemediesEn: string;
  harmonizingRemediesHi: string;
  auspiciousCoupleDates: number[];
}

const PLANET_NAMES_BY_NUMBER: Record<number, { en: string; hi: string; element: string }> = {
  1: { en: 'Sun (Surya)', hi: 'सूर्य', element: 'Fire' },
  2: { en: 'Moon (Chandra)', hi: 'चंद्र', element: 'Water' },
  3: { en: 'Jupiter (Guru)', hi: 'बृहस्पति (गुरु)', element: 'Ether' },
  4: { en: 'Rahu', hi: 'राहु', element: 'Air' },
  5: { en: 'Mercury (Budha)', hi: 'बुध', element: 'Earth' },
  6: { en: 'Venus (Shukra)', hi: 'शुक्र', element: 'Water' },
  7: { en: 'Ketu', hi: 'केतु', element: 'Fire' },
  8: { en: 'Saturn (Shani)', hi: 'शनि', element: 'Air' },
  9: { en: 'Mars (Mangal)', hi: 'मंगल', element: 'Fire' },
};

// Planetary Love Chemistry (0 = Inimical, 1 = Neutral, 2 = Friendly, 3 = Supreme Harmony)
const PLANETARY_LOVE_MATRIX: Record<number, Record<number, number>> = {
  1: { 1: 2, 2: 3, 3: 3, 4: 2, 5: 3, 6: 1, 7: 2, 8: 0, 9: 3 },
  2: { 1: 3, 2: 2, 3: 3, 4: 1, 5: 2, 6: 2, 7: 3, 8: 1, 9: 1 },
  3: { 1: 3, 2: 3, 3: 3, 4: 1, 5: 2, 6: 1, 7: 2, 8: 2, 9: 3 },
  4: { 1: 2, 2: 1, 3: 1, 4: 2, 5: 3, 6: 3, 7: 3, 8: 2, 9: 0 },
  5: { 1: 3, 2: 2, 3: 2, 4: 3, 5: 3, 6: 3, 7: 2, 8: 2, 9: 2 },
  6: { 1: 1, 2: 2, 3: 1, 4: 3, 5: 3, 6: 3, 7: 2, 8: 3, 9: 2 },
  7: { 1: 2, 2: 3, 3: 2, 4: 3, 5: 2, 6: 2, 7: 2, 8: 1, 9: 2 },
  8: { 1: 0, 2: 1, 3: 2, 4: 2, 5: 2, 6: 3, 7: 1, 8: 2, 9: 0 },
  9: { 1: 3, 2: 1, 3: 3, 4: 0, 5: 2, 6: 2, 7: 2, 8: 0, 9: 2 },
};

function extractDateDigits(dob: string): { day: number; month: number; year: number } {
  // Supports YYYY-MM-DD or DD-MM-YYYY
  const parts = dob.trim().split(/[-/.]/).map((n) => parseInt(n, 10));
  if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
    return { day: 15, month: 6, year: 1995 };
  }
  if (parts[0] > 1000) {
    // YYYY-MM-DD
    return { year: parts[0], month: parts[1], day: parts[2] };
  }
  // DD-MM-YYYY
  return { day: parts[0], month: parts[1], year: parts[2] };
}

export function computePersonProfile(name: string, dob: string): PersonNumerologyProfile {
  const { day, month, year } = extractDateDigits(dob);
  const mulank = reduceToSingleDigit(day) || 1;
  const fullSum = `${day}${month}${year}`.split('').reduce((acc, ch) => acc + parseInt(ch, 10), 0);
  const bhagyank = reduceToSingleDigit(fullSum) || 1;

  const chal = computeNameNumber(name, 'chaldean');
  const pyth = computeNameNumber(name, 'pythagorean');
  const pInfo = PLANET_NAMES_BY_NUMBER[mulank] || PLANET_NAMES_BY_NUMBER[1];

  return {
    name: name.trim() || 'Native',
    dob,
    mulank,
    bhagyank,
    chaldeanNumber: chal.reduced,
    pythagoreanNumber: pyth.reduced,
    rulingPlanetEn: pInfo.en,
    rulingPlanetHi: pInfo.hi,
  };
}

export function computeLoveCompatibility(
  p1Input: { name: string; dob: string },
  p2Input: { name: string; dob: string }
): LoveCompatibilityReport {
  const p1 = computePersonProfile(p1Input.name, p1Input.dob);
  const p2 = computePersonProfile(p2Input.name, p2Input.dob);

  // 1. Mulank Matrix Score (40% weight)
  const mulankChem = PLANETARY_LOVE_MATRIX[p1.mulank]?.[p2.mulank] ?? 1; // 0..3
  const mulankScore = mulankChem === 3 ? 95 : mulankChem === 2 ? 82 : mulankChem === 1 ? 65 : 45;

  // 2. Bhagyank Life Path Score (25% weight)
  const bhagyankChem = PLANETARY_LOVE_MATRIX[p1.bhagyank]?.[p2.bhagyank] ?? 1;
  const bhagyankScore = bhagyankChem === 3 ? 92 : bhagyankChem === 2 ? 80 : bhagyankChem === 1 ? 62 : 40;

  // 3. Name Vibration Compatibility (20% weight)
  const nameChem = PLANETARY_LOVE_MATRIX[p1.chaldeanNumber]?.[p2.chaldeanNumber] ?? 1;
  const nameScore = nameChem === 3 ? 94 : nameChem === 2 ? 80 : nameChem === 1 ? 68 : 50;

  // 4. Element Synergy (15% weight)
  const el1 = PLANET_NAMES_BY_NUMBER[p1.mulank].element;
  const el2 = PLANET_NAMES_BY_NUMBER[p2.mulank].element;
  let elementScore = 75;
  if (el1 === el2) elementScore = 88;
  else if ((el1 === 'Fire' && el2 === 'Air') || (el1 === 'Air' && el2 === 'Fire')) elementScore = 96;
  else if ((el1 === 'Earth' && el2 === 'Water') || (el1 === 'Water' && el2 === 'Earth')) elementScore = 95;
  else if ((el1 === 'Fire' && el2 === 'Water') || (el1 === 'Water' && el2 === 'Fire')) elementScore = 52;

  // Weighted Overall Score
  const rawScore = mulankScore * 0.4 + bhagyankScore * 0.25 + nameScore * 0.2 + elementScore * 0.15;
  const overallLoveScore = Math.min(98, Math.max(42, Math.round(rawScore)));

  // Attraction, Emotional, Communication, Stability
  const attractionScore = Math.min(99, Math.max(45, Math.round(mulankScore * 0.6 + elementScore * 0.4)));
  const emotionalResonanceScore = Math.min(98, Math.max(40, Math.round(nameScore * 0.5 + mulankScore * 0.5)));
  const communicationScore = Math.min(96, Math.max(38, Math.round(bhagyankScore * 0.5 + nameScore * 0.5)));
  const maritalStabilityScore = Math.min(97, Math.max(35, Math.round(bhagyankScore * 0.6 + mulankScore * 0.4)));

  let intensityCategoryHi: LoveCompatibilityReport['intensityCategoryHi'] = 'उत्तम (Harmonious Union)';
  let intensityCategoryEn: LoveCompatibilityReport['intensityCategoryEn'] = 'Harmonious Union';

  if (overallLoveScore >= 85) {
    intensityCategoryHi = 'अति उत्तम (Divine Match)';
    intensityCategoryEn = 'Divine Match';
  } else if (overallLoveScore >= 70) {
    intensityCategoryHi = 'उत्तम (Harmonious Union)';
    intensityCategoryEn = 'Harmonious Union';
  } else if (overallLoveScore >= 55) {
    intensityCategoryHi = 'मध्यम (Requires Effort)';
    intensityCategoryEn = 'Requires Effort';
  } else {
    intensityCategoryHi = 'चुनौतीपूर्ण (Karmic Friction)';
    intensityCategoryEn = 'Karmic Friction';
  }

  // Auspicious dates for the couple
  const setDates = new Set([p1.mulank, p2.mulank, p1.bhagyank, p2.bhagyank]);
  const auspiciousCoupleDates = Array.from(setDates).sort((a, b) => a - b);

  return {
    person1: p1,
    person2: p2,
    overallLoveScore,
    attractionScore,
    emotionalResonanceScore,
    communicationScore,
    maritalStabilityScore,
    intensityCategoryHi,
    intensityCategoryEn,
    relationshipDynamicsHi: `${p1.name} (मूलांक ${p1.mulank}, स्वामी: ${p1.rulingPlanetHi}) तथा ${p2.name} (मूलांक ${p2.mulank}, स्वामी: ${p2.rulingPlanetHi}) के मध्य ${overallLoveScore}% का सुदृढ़ सामंजस्य निर्मित होता है। दोनों का स्वभाव एक-दूसरे की आंतरिक कमियों को पूर्ण करने की स्वाभाविक क्षमता रखता है।`,
    relationshipDynamicsEn: `${p1.name} (Life Path ${p1.mulank}, Ruler: ${p1.rulingPlanetEn}) and ${p2.name} (Life Path ${p2.mulank}, Ruler: ${p2.rulingPlanetEn}) exhibit an authentic ${overallLoveScore}% relational affinity. Their planetary archetypes complement core psychological drives.`,
    potentialFrictionHi: p1.mulank === 1 && p2.mulank === 8
      ? 'सूर्य और शनि का नैसर्गिक विरोध होने के कारण नेतृत्व, अहंकार और नियंत्रण को लेकर तीखे मतभेद उभर सकते हैं।'
      : p1.mulank === 9 || p2.mulank === 9
      ? 'मंगल के प्रभाव से आवेग, आवेशपूर्ण वाणी और त्वरित प्रतिक्रिया संबंधों में क्षणिक कटुता ला सकती है; शांत संवाद आवश्यक है।'
      : 'निर्णय लेते समय एक-दूसरे पर वर्चस्व स्थापित करने के प्रयास से बचें; पारस्परिक स्वतंत्रता का सम्मान अनिवार्य है।',
    potentialFrictionEn: p1.mulank === 1 && p2.mulank === 8
      ? 'Natural Sun-Saturn polarity can trigger authority conflicts, stubborn rigidity, or struggle over decision-making.'
      : p1.mulank === 9 || p2.mulank === 9
      ? 'Martian intensity can provoke quick-tempered arguments and impulsive reactions; conscious de-escalation is needed.'
      : 'Avoid subtle micromanagement; honoring mutual individual independence prevents long-term resentment.',
    harmonizingRemediesHi: `दंपति माह की ${auspiciousCoupleDates.join(', ')} तारीखों को महत्त्वपूर्ण कार्य या संयुक्त यात्राओं हेतु चुनें। दोनों शुक्रवार को श्वेत/सुगंधित पुष्प शिव-पार्वती को अर्पित करें।`,
    harmonizingRemediesEn: `Schedule important relationship milestones on the ${auspiciousCoupleDates.join(', ')}th of the month. Jointly light a sesame or ghee lamp on Fridays for Venusian blessings.`,
    auspiciousCoupleDates,
  };
}

// ==========================================
// 2. FRIENDSHIP COMPATIBILITY CALCULATOR
// ==========================================

export interface FriendshipCompatibilityReport {
  person1Name: string;
  person2Name: string;
  friendshipScore: number; // 0..100
  trustIndex: number;
  communicationSynergy: number;
  funAndHumorScore: number;
  sharedStrengthsHi: string;
  sharedStrengthsEn: string;
  frictionTriggersHi: string;
  frictionTriggersEn: string;
  friendshipVerdictHi: string;
  friendshipVerdictEn: string;
}

export function computeFriendshipCompatibility(
  p1Name: string,
  p2Name: string,
  p1Dob?: string,
  p2Dob?: string
): FriendshipCompatibilityReport {
  const name1Num = computeNameNumber(p1Name, 'chaldean').reduced;
  const name2Num = computeNameNumber(p2Name, 'chaldean').reduced;

  let baseScore = 60;
  const chem = PLANETARY_LOVE_MATRIX[name1Num]?.[name2Num] ?? 1;
  baseScore += chem === 3 ? 28 : chem === 2 ? 18 : chem === 1 ? 5 : -15;

  if (p1Dob && p2Dob) {
    const { day: d1 } = extractDateDigits(p1Dob);
    const { day: d2 } = extractDateDigits(p2Dob);
    const m1 = reduceToSingleDigit(d1);
    const m2 = reduceToSingleDigit(d2);
    const mChem = PLANETARY_LOVE_MATRIX[m1]?.[m2] ?? 1;
    baseScore += mChem === 3 ? 10 : mChem === 2 ? 6 : mChem === 1 ? 0 : -8;
  }

  const friendshipScore = Math.min(99, Math.max(45, Math.round(baseScore)));
  const trustIndex = Math.min(98, Math.max(40, Math.round(friendshipScore * 0.95 + (chem >= 2 ? 5 : -5))));
  const communicationSynergy = Math.min(96, Math.max(42, Math.round(friendshipScore * 0.92)));
  const funAndHumorScore = Math.min(99, Math.max(50, Math.round(friendshipScore * 1.02)));

  return {
    person1Name: p1Name.trim() || 'Friend 1',
    person2Name: p2Name.trim() || 'Friend 2',
    friendshipScore,
    trustIndex,
    communicationSynergy,
    funAndHumorScore,
    sharedStrengthsHi: `${p1Name} और ${p2Name} के बीच निष्कपट बातचीत, संकट में एक-दूसरे के साथ खड़े रहने की तत्परता और स्वाभाविक हास्य-बोध अत्यंत प्रगाढ़ है।`,
    sharedStrengthsEn: `Natural transparency, dependable support during unforeseen hardships, and shared sense of adventure create an unbreakable bond.`,
    frictionTriggersHi: 'वित्तीय लेन-देन में पारदर्शिता न होना या तीसरे व्यक्ति की बातों में आकर गलतफहमी पालना इस मित्रता की मुख्य परीक्षा हो सकता है।',
    frictionTriggersEn: 'Financial ambiguity or entertaining third-party hearsay represents the primary point of potential misunderstanding.',
    friendshipVerdictHi: friendshipScore >= 80
      ? 'सच्ची एवं कालजयी मित्रता — यह संबंध जीवनपर्यंत विश्वासपात्र और सुख-दुःख का संबल सिद्ध होगा।'
      : 'सकारात्मक एवं सहयोगी मित्रता — व्यावहारिक सीमाओं का सम्मान करते हुए दीर्घकालिक साथ संभव है।',
    friendshipVerdictEn: friendshipScore >= 80
      ? 'An authentic and enduring friendship built to survive trials, distance, and time.'
      : 'A constructive and affectionate alliance that thrives on mutual respect and healthy personal boundaries.',
  };
}

// ==========================================
// 3. PAST LIFE CALCULATOR (पूर्व जन्म रहस्य)
// ==========================================

export interface PastLifeReport {
  soulOriginRealmEn: string;
  soulOriginRealmHi: string;
  pastLifeRoleEn: string;
  pastLifeRoleHi: string;
  geographicSoulCradleEn: string;
  geographicSoulCradleHi: string;
  historicalEraEn: string;
  historicalEraHi: string;
  pastLifeDominantVirtueEn: string;
  pastLifeDominantVirtueHi: string;
  pastLifeKarmicFlawEn: string;
  pastLifeKarmicFlawHi: string;
  sanchitaKarmaDebtEn: string;
  sanchitaKarmaDebtHi: string;
  debtSeverity: 'High' | 'Moderate' | 'Mild';
  unfinishedSoulMissionEn: string;
  unfinishedSoulMissionHi: string;
  garudaPuranaRemedyEn: string;
  garudaPuranaRemedyHi: string;
}

const PAST_ROLES_BY_KETU_SIGN: Record<number, { roleEn: string; roleHi: string; virtueEn: string; virtueHi: string; flawEn: string; flawHi: string }> = {
  0: { // Aries
    roleEn: 'Warrior, General, or Chieftain in Fierce Border Conflicts',
    roleHi: 'सेनापति, दुर्ग रक्षक अथवा सीमांत युद्धों का पराक्रमी योद्धा',
    virtueEn: 'Fearless bravery and physical leadership under fire',
    virtueHi: 'अदम्य वीरता, रणकौशल एवं संकट में सैनिकों का निर्भीक नेतृत्व',
    flawEn: 'Impatience, fiery anger, and excessive combat aggression',
    flawHi: 'अति-क्रोध, अधीरता एवं युद्ध में अत्यधिक आक्रामकता',
  },
  1: { // Taurus
    roleEn: 'Wealthy Merchant, Royal Banker, or Land Baron',
    roleHi: 'समृद्ध व्यापारी, राजकोषीय साहूकार अथवा विशाल भूमि स्वामी',
    virtueEn: 'Steadfast material preservation, reliability, and family patron',
    virtueHi: 'आर्थिक अनुशासन, विश्वसनीयता एवं विशाल परिवार का भरण-पोषण',
    flawEn: 'Attachment to gold, hoarding tendencies, and stubborn material possessiveness',
    flawHi: 'स्वर्ण व भूमि के प्रति अत्यधिक आसक्ति और संचय की हवस',
  },
  2: { // Gemini
    roleEn: 'Scribe, Royal Diplomat, Astrologer, or Traveling Scholar',
    roleHi: 'राजकीय दूत, संदेशवाहक, लेखक, दैवज्ञ अथवा भ्रमणशील विद्वान',
    virtueEn: 'Quick intellect, eloquence, and preserving oral traditions',
    virtueHi: 'कुशाग्र मेधा, वाणी चातुर्य एवं दुर्लभ ज्ञान का संरक्षण',
    flawEn: 'Fickleness, spreading rumors, and intellectual skepticism without faith',
    flawHi: 'चंचलता, अफवाहों को हवा देना और श्रद्धाहीन शुष्क तर्क',
  },
  3: { // Cancer
    roleEn: 'Healer, Matriarch, Temple Priest, or Spiritual Caregiver',
    roleHi: 'वैद्य, परिवार संरक्षिका, मंदिर के मुख्य अर्चक अथवा औषध शास्त्री',
    virtueEn: 'Unconditional maternal compassion and selfless nursing of the wounded',
    virtueHi: 'असीम वात्सल्य, रोगियों की निस्वार्थ सेवा एवं परिवार निष्ठा',
    flawEn: 'Emotional hypersensitivity, holding grudges, and suffocating possessiveness',
    flawHi: 'अत्यधिक भावुकता, पुरानी कड़वाहट न भूलना एवं संकीर्ण मोह',
  },
  4: { // Leo
    roleEn: 'Monarch, Sovereign Ruler, Chief Magistrate, or High Noble',
    roleHi: 'स्वतंत्र शासक, सामंत, मुख्य दंडाधिकारी अथवा राजकुल का प्रतिष्ठित नेता',
    virtueEn: 'Magnanimous justice, royal patronage of arts, and protective pride',
    virtueHi: 'न्यायप्रियता, कलाकारों को राज्याश्रय एवं प्रजा की सिंह जैसी रक्षा',
    flawEn: 'Arrogance, inability to accept criticism, and demands for constant subservience',
    flawHi: 'राजसी अहंकार, आलोचना न सह पाना एवं अत्यधिक चापलूसी की अपेक्षा',
  },
  5: { // Virgo
    roleEn: 'Ayurvedic Physician, Temple Accountant, Master Artisan, or Herbalist',
    roleHi: 'आयुर्वेदिक चिकित्सक, राजकोष के मुख्य लेखाकार अथवा हस्तशिल्प गुरु',
    virtueEn: 'Meticulous accuracy, ethical craftsmanship, and selfless healing',
    virtueHi: 'सूक्ष्म परिशुद्धता, नैतिक कार्यकुशलता एवं निःशुल्क औषध सेवा',
    flawEn: 'Hyper-critical fault finding and obsessive anxiety over imperfections',
    flawHi: 'दूसरों में केवल त्रुटियां देखना और अत्यधिक शंकालु स्वभाव',
  },
  6: { // Libra
    roleEn: 'High Court Judge, Chief Negotiator, Architect, or Court Artist',
    roleHi: 'न्यायाधीश, शांति वार्ताकार, शिल्पकार अथवा राजदरबार के मुख्य कलाकार',
    virtueEn: 'Impartial mediation, aesthetic elegance, and upholding social peace',
    virtueHi: 'निष्पक्ष न्याय, कलात्मक सौंदर्यबोध एवं शांति स्थापना की क्षमता',
    flawEn: 'Indecision, moral compromises for luxury, and superficial appearances',
    flawHi: 'अनिर्णय की स्थिति, भोग-विलास हेतु नैतिक समझौते एवं दिखावा',
  },
  7: { // Scorpio
    roleEn: 'Occult Seer, Tantric Alchemist, Spymaster, or Cryptic Researcher',
    roleHi: 'तांत्रिक, रस रसायनवेत्ता, गुप्तचर प्रमुख अथवा गूढ़ विद्याओं के साधक',
    virtueEn: 'Penetrating psychic insight, indomitable will, and uncovering hidden truths',
    virtueHi: 'गहन अंतर्दृष्टि, अदम्य इच्छाशक्ति एवं प्रकृति के गुप्त रहस्यों का शोध',
    flawEn: 'Holding deep grudges, covert manipulation, and vindictive vengeance',
    flawHi: 'प्रतिशोध की भावना, गुप्त षड्यंत्र एवं दूसरों पर मनोवैज्ञानिक नियंत्रण',
  },
  8: { // Sagittarius
    roleEn: 'Philosopher, Guru, High Priest, or Global Pilgrim',
    roleHi: 'वेदांती दार्शनिक, गुरु, तीर्थयात्री अथवा गुरुकुल के कुलपति',
    virtueEn: 'Spreading Dharma, moral wisdom, and inspiring spiritual liberation',
    virtueHi: 'धर्म का प्रसार, नैतिक ज्ञान एवं शिष्यों को मोक्ष मार्ग दिखाना',
    flawEn: 'Dogmatism, religious self-righteousness, and neglecting family duties',
    flawHi: 'कट्टरता, स्वयं को धर्मात्मा मान दूसरों को नीचा समझना एवं गृहस्थ उपेक्षा',
  },
  9: { // Capricorn
    roleEn: 'State Builder, Citadel Architect, Chief Minister, or Guild Master',
    roleHi: 'दुर्ग निर्माता, प्रधान आमात्य, नगर योजनाकार अथवा शिल्प संघ प्रमुख',
    virtueEn: 'Rock-solid administrative endurance, duty, and creating enduring institutions',
    virtueHi: 'अटल कर्तव्यनिष्ठा, संस्थाओं का निर्माण एवं निष्काम श्रम',
    flawEn: 'Emotional coldness, harsh austerity, and valuing status over human empathy',
    flawHi: 'भावनात्मक कठोरता, अपनों के प्रति रूखापन एवं मानवीय संवेदना का अभाव',
  },
  10: { // Aquarius
    roleEn: 'Visionary Reformer, Astronomer, Rebel Thinker, or Philanthropist',
    roleHi: 'समाज सुधारक, खगोलविद, विद्रोही विचारक अथवा अकाल राहत संचालक',
    virtueEn: 'Egalitarian vision, fighting orthodoxy, and universal human welfare',
    virtueHi: 'समानता की दृष्टि, रूढ़ियों पर प्रहार एवं दीन-दुखियों का कल्याण',
    flawEn: 'Detached intellectual arrogance and emotional rebellion against tradition',
    flawHi: 'परंपराओं से अकारण विद्रोह और व्यक्तिगत रिश्तों में भावनात्मक उदासीनता',
  },
  11: { // Pisces
    roleEn: 'Monk, Ocean Navigator, Hospitalier, or Mystic Hermit in Isolation',
    roleHi: 'संन्यासी, एकांत साधक, सुदूर समुद्री नाविक अथवा आश्रम के तपोनिष्ठ साधक',
    virtueEn: 'Profound surrender to the Divine, psychic compassion, and transcendence',
    virtueHi: 'ईश्वरीय शरणागति, गहरी अंतर्ज्ञानी करुणा एवं संसार से वैराग्य',
    flawEn: 'Escapism, confusion, substance misuse, or failing to anchor in reality',
    flawHi: 'संसार से पलायन, भ्रम एवं व्यावहारिक दायित्वों से मुंह मोड़ना',
  },
};

const GEOGRAPHIC_CRADLES_BY_12TH: Record<number, { cradleEn: string; cradleHi: string; eraEn: string; eraHi: string }> = {
  0: { cradleEn: 'Ancient India (Northern Kingdoms / Kurukshetra & Aryavarta)', cradleHi: 'प्राचीन भारत (आर्यावर्त, कुरुक्षेत्र व गंगा घाटी)', eraEn: 'Classical Vedic & Epic Epoch', eraHi: 'वैदिक एवं महाकाव्य कालखंड' },
  1: { cradleEn: 'Mediterranean Basin (Ancient Greece, Sicily & Rome)', cradleHi: 'भूमध्यसागरीय साम्राज्य (प्राचीन यूनान, सिसिली व रोम)', eraEn: 'Greco-Roman Classical Era', eraHi: 'ग्रीको-रोमन शास्त्रीय काल' },
  2: { cradleEn: 'Persia, Mesopotamia & Ancient Silk Road Hubs', cradleHi: 'प्राचीन फारस, मेसोपोटामिया एवं रेशम मार्ग', eraEn: 'Zoroastrian & Trade Route Empire', eraHi: 'फारसी एवं मध्य एशियाई व्यापारिक युग' },
  3: { cradleEn: 'Sacred River Valleys of South India (Chola / Pandya Dynasties)', cradleHi: 'दक्षिण भारत की पावन कावेरी घाटी (चोल व पाण्ड्य साम्राज्य)', eraEn: 'Temple Civilization Epoch', eraHi: 'भव्य मंदिर निर्माण एवं भक्ति काल' },
  4: { cradleEn: 'Ancient Egypt (Nile Valley, Thebes & Alexandria)', cradleHi: 'प्राचीन मिस्र (नील नदी घाटी, थीब्स व सिकंदरिया)', eraEn: 'Pharaonic & Dynastic Era', eraHi: 'फैरो एवं रहस्यदर्शी ज्ञान युग' },
  5: { cradleEn: 'Himalayan Foothills, Kashmir & Gandhara', cradleHi: 'हिमालय की तलहटी, कश्मीर एवं प्राचीन गांधार', eraEn: 'Buddhist & Shaivite Monastic Era', eraHi: 'बौद्ध एवं कश्मीरी शैव दर्शन युग' },
  6: { cradleEn: 'Ancient East Asia (Imperial China & Ancient Kyoto)', cradleHi: 'प्राचीन पूर्वी एशिया (शाही चीन व प्राचीन क्योटो, जापान)', eraEn: 'Dynastic Mandate & Taoist Epoch', eraHi: 'ताओवादी एवं शाही साम्राज्य युग' },
  7: { cradleEn: 'Central Americas (Mayan & Incan Highlands)', cradleHi: 'मध्य एवं दक्षिण अमेरिका (प्राचीन मय व इंका सभ्यता)', eraEn: 'Pyramid Astronomy Era', eraHi: 'खगोलीय वेधशाला एवं सौर उपासना युग' },
  8: { cradleEn: 'Holy Kashi (Varanasi), Prayag & Naimisharanya', cradleHi: 'काशी (वाराणसी), प्रयागराज एवं नैमिषारण्य', eraEn: 'Puranic Exposition Epoch', eraHi: 'पौराणिक शास्त्रार्थ एवं तपस्या काल' },
  9: { cradleEn: 'Northern & Celtic Europe (Ancient Britain & Scandinavia)', cradleHi: 'उत्तरी एवं सेल्टिक यूरोप (प्राचीन ब्रिटेन व स्कैंडिनेविया)', eraEn: 'Iron Age & Druidic Circles', eraHi: 'लौह युग एवं ड्रुइडिक साधना काल' },
  10: { cradleEn: 'Ancient Levant (Jerusalem, Damascus & Antioch)', cradleHi: 'प्राचीन लेवांत (यरूशलम, दमिश्क एवं अंताकिया)', eraEn: 'Monotheistic Prophets Era', eraHi: 'पैगंबर एवं एकेश्वरवादी साधना युग' },
  11: { cradleEn: 'Tibetan Plateau & Mount Kailash Periphery', cradleHi: 'तिब्बती पठार, मानसरोवर एवं कैलाश परिक्रमा क्षेत्र', eraEn: 'Tantric Buddhist Mahasiddha Epoch', eraHi: 'महासिद्ध एवं उच्च हिमाच्छादित तपोभूमि काल' },
};

export function computePastLifeReading(chart: ChartData): PastLifeReport {
  const ascSign = chart.ascendant.signIndex;
  const ketu = chart.planets.find((p) => p.id === 'Ketu');
  const ketuSign = ketu ? ketu.signIndex : (ascSign + 6) % 12;

  // 12th house (sign index)
  const h12Sign = (ascSign + 11) % 12;

  const roleData = PAST_ROLES_BY_KETU_SIGN[ketuSign] || PAST_ROLES_BY_KETU_SIGN[0];
  const cradleData = GEOGRAPHIC_CRADLES_BY_12TH[h12Sign] || GEOGRAPHIC_CRADLES_BY_12TH[0];

  // Sanchita Karma Debt Assessment
  let sanchitaKarmaDebtHi = 'पितृ ऋण (Ancestral Debt): पूर्व जन्म में परिवार के प्रति वचनबद्धता या कुल-मर्यादा की पूर्ति में कुछ कमी रह गई थी।';
  let sanchitaKarmaDebtEn = 'Pitra Rina (Ancestral Obligation): An incomplete vow or unfinished filial duty carried over to this lifetime.';
  let debtSeverity: PastLifeReport['debtSeverity'] = 'Moderate';

  if ([0, 7].includes(ketuSign)) {
    sanchitaKarmaDebtHi = 'भ्रातृ व अंगारक ऋण: पूर्व जन्म में युद्ध अथवा भूमि विवाद में अनुचित कठोरता का प्रायश्चित्त इस जन्म में धैर्य से करना है।';
    sanchitaKarmaDebtEn = 'Karmic Conflict Debt: Impulsive severity in past territorial or sibling disputes requiring patience now.';
    debtSeverity = 'High';
  } else if ([1, 6].includes(ketuSign)) {
    sanchitaKarmaDebtHi = 'स्त्री व भोग ऋण: पूर्व जन्म में अत्यधिक विलासिता या किसी स्नेही स्त्री के विश्वास के प्रति अनादर की क्षतिपूर्ति।';
    sanchitaKarmaDebtEn = 'Relational Excess Debt: Taking relationships for granted or prioritizing luxury over emotional fidelity.';
    debtSeverity = 'Moderate';
  } else if ([8, 11].includes(ketuSign)) {
    sanchitaKarmaDebtHi = 'गुरु व देव ऋण: पूर्व जन्म में प्राप्त उच्च आध्यात्मिक ज्ञान को संसार में न बांटकर एकांत में सीमित रखने का ऋण।';
    sanchitaKarmaDebtEn = 'Spiritual Hoarding Debt: Harboring esoteric enlightenment without adequately guiding struggling seekers.';
    debtSeverity = 'Mild';
  }

  // Unfinished Soul Mission
  const unfinishedSoulMissionHi = `इस जन्म में आपकी आत्मा का मुख्य संकल्प '${roleData.virtueHi}' को पुनः जागृत कर अपने पूर्वजन्म के दोष '${roleData.flawHi}' पर पूर्ण विजय प्राप्त करना है। वर्तमान जीवन में आपकी सहज अंतर्दृष्टि और विशिष्ट रुचियां इसी पुराने प्रारब्ध की निरंतरता हैं।`;
  const unfinishedSoulMissionEn = `Your primary incarnation mission is to reactivate your latent mastery of '${roleData.virtueEn}' while consciously overcoming the residual trap of '${roleData.flawEn}'. Your intuitive inclinations directly mirror this ancestral soul continuity.`;

  return {
    soulOriginRealmHi: h12Sign % 2 === 0 ? 'स्वर्गलोक एवं गंधर्व क्षेत्र (Elevated Celestial Realm)' : 'ऋषि मंडल एवं तपोलोक (Realm of Sages & Contemplatives)',
    soulOriginRealmEn: h12Sign % 2 === 0 ? 'Celestial Realm of Artists & Sages' : 'Contemplative Realm of Ascetics & Seers',
    pastLifeRoleHi: roleData.roleHi,
    pastLifeRoleEn: roleData.roleEn,
    geographicSoulCradleHi: cradleData.cradleHi,
    geographicSoulCradleEn: cradleData.cradleEn,
    historicalEraHi: cradleData.eraHi,
    historicalEraEn: cradleData.eraEn,
    pastLifeDominantVirtueHi: roleData.virtueHi,
    pastLifeDominantVirtueEn: roleData.virtueEn,
    pastLifeKarmicFlawHi: roleData.flawHi,
    pastLifeKarmicFlawEn: roleData.flawEn,
    sanchitaKarmaDebtHi,
    sanchitaKarmaDebtEn,
    debtSeverity,
    unfinishedSoulMissionHi,
    unfinishedSoulMissionEn,
    garudaPuranaRemedyHi: 'गरुड़ पुराण व पराशर स्मृति अनुसार: नियमित रूप से पक्षियों को अन्न व जल दें, अमावस्या को पूर्वजों के निमित्त तिल-जल तर्पण करें, तथा जरूरतमंद विद्यार्थियों को शिक्षा सामग्री दान करें।',
    garudaPuranaRemedyEn: 'According to Garuda Purana and Parashara: Feed wild birds daily, offer black sesame and water on Amavasya (New Moon) for ancestors, and sponsor educational supplies for needy scholars.',
  };
}

// ==========================================
// 4. FUTURE LIFE / REBIRTH CALCULATOR
// ==========================================

export interface FutureLifeReport {
  soulGatiEn: 'Urdhva Gati (Higher Realm / Devaloka)' | 'Madhya Gati (Elevated Human Incarnation)' | 'Adho Gati (Earthly Recycling for Desires)';
  soulGatiHi: string;
  mokshaProximityPercent: number; // 0..100
  rebirthLikelihoodEn: 'Low (Near Liberation)' | 'Moderate (One or Two Incarnations)' | 'Certain (Further Human Lessons)';
  rebirthLikelihoodHi: string;
  anticipatedNextLifeDomainEn: string;
  anticipatedNextLifeDomainHi: string;
  spiritualEvolutionStageEn: string;
  spiritualEvolutionStageHi: string;
  remainingKarmicLessonsEn: string;
  remainingKarmicLessonsHi: string;
  sadgatiPrescriptionEn: string;
  sadgatiPrescriptionHi: string;
}

export function computeFutureLifeReading(chart: ChartData): FutureLifeReport {
  const ascSign = chart.ascendant.signIndex;
  const h12Sign = (ascSign + 11) % 12;
  const h12Lord = SIGNS[h12Sign].lord;
  const p12 = chart.planets.find((p) => p.id === h12Lord);
  const ketu = chart.planets.find((p) => p.id === 'Ketu');
  const jup = chart.planets.find((p) => p.id === 'Jupiter');

  // Moksha proximity calculation:
  // Ketu in 12th or aspecting 12th = +35%
  // Jupiter in 12th, 9th, or Kendra = +25%
  // 12th lord benefic = +20%
  let mokshaScore = 40; // baseline

  if (ketu && ketu.houseNumber === 12) mokshaScore += 35;
  else if (ketu && [4, 8, 9].includes(ketu.houseNumber)) mokshaScore += 18;

  if (jup && [1, 5, 9, 12].includes(jup.houseNumber)) mokshaScore += 22;
  if (['Jupiter', 'Venus'].includes(h12Lord)) mokshaScore += 14;

  const mokshaProximityPercent = Math.min(94, Math.max(35, mokshaScore));

  let soulGatiEn: FutureLifeReport['soulGatiEn'] = 'Madhya Gati (Elevated Human Incarnation)';
  let soulGatiHi = 'मध्य गति (उच्च मानवीय अवतार एवं दार्शनिक कुल में पुनर्जन्म)';
  let rebirthLikelihoodEn: FutureLifeReport['rebirthLikelihoodEn'] = 'Moderate (One or Two Incarnations)';
  let rebirthLikelihoodHi = 'मध्यम (१ या २ जन्मों के भीतर मोक्ष की संभावना)';

  if (mokshaProximityPercent >= 80) {
    soulGatiEn = 'Urdhva Gati (Higher Realm / Devaloka)';
    soulGatiHi = 'ऊर्ध्व गति (देवलोक, सिद्ध मंडल अथवा उच्च चेतना के लोकों में गमन)';
    rebirthLikelihoodEn = 'Low (Near Liberation)';
    rebirthLikelihoodHi = 'अति क्षीण (मोक्ष व आत्म-मुक्ति के अत्यंत सन्निकट)';
  } else if (mokshaProximityPercent < 55) {
    soulGatiEn = 'Adho Gati (Earthly Recycling for Desires)';
    soulGatiHi = 'मध्यम-सांसारिक गति (अधूरी भौतिक इच्छाओं की पूर्ति हेतु पुनर्जन्म)';
    rebirthLikelihoodEn = 'Certain (Further Human Lessons)';
    rebirthLikelihoodHi = 'निश्चित (कर्म फल भोगने हेतु पुनः मानुष तन की प्राप्ति)';
  }

  return {
    soulGatiEn,
    soulGatiHi,
    mokshaProximityPercent,
    rebirthLikelihoodEn,
    rebirthLikelihoodHi,
    anticipatedNextLifeDomainHi: mokshaProximityPercent >= 80
      ? 'उच्चतर चेतना लोक जहां स्थूल शरीर के बंधन नहीं होते; आत्मा केवल ज्ञान, आनंद और लोक-कल्याण के सूक्ष्म स्पंदनों में विचरण करेगी।'
      : 'एक अत्यंत सुसंस्कृत, साधन-संपन्न एवं धर्मनिष्ठ परिवार में जन्म, जहां बचपन से ही विद्या, आध्यात्मिक संस्कार और सात्विक वातावरण सुलभ होगा।',
    anticipatedNextLifeDomainEn: mokshaProximityPercent >= 80
      ? 'A higher subtle vibratory plane unbound by physical matter, existing in pure contemplation and cosmic stewardship.'
      : 'Incarnation into a culturally elevated, materially comfortable, and spiritually inclined family with early access to wisdom.',
    spiritualEvolutionStageHi: `आपकी आत्मा वर्तमान में अपनी चेतनामय यात्रा के ${mokshaProximityPercent}% सोपान को पार कर चुकी है। भौतिक आकर्षण धीरे-धीरे क्षीण होकर आत्म-अनुसंधान में बदल रहे हैं।`,
    spiritualEvolutionStageEn: `Your soul has attained ${mokshaProximityPercent}% maturation on its cyclical pilgrimage. Gross earthly attachments are naturally giving way to contemplative detachment.`,
    remainingKarmicLessonsHi: 'अहंकार का पूर्ण विसर्जन, संसार में रहते हुए भी कमल पत्र की भांति अनासक्त रहना, तथा किसी भी व्यक्ति या परिस्थिति पर क्रोध न करना।',
    remainingKarmicLessonsEn: 'Total dissolution of subtle spiritual ego, remaining like a lotus untouched by murky waters, and absolute eradication of lingering anger.',
    sadgatiPrescriptionHi: 'सद्गति व परम पद प्राप्ति हेतु: प्रतिदिन कम से कम २० मिनट मौन ध्यान करें, श्रीमद्भगवद्गीता के १२वें या १५वें अध्याय का पाठ करें, तथा निस्वार्थ भाव से समाज सेवा करें।',
    sadgatiPrescriptionEn: 'For optimal spiritual transition: Practice 20 minutes of silent meditation daily, study Chapter 12 or 15 of Bhagavad Gita, and engage in expectation-free service.',
  };
}
