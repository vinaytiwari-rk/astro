/**
 * Comprehensive 9-Graha & 3-Tier (Strong / Moderate / Afflicted) Shastric Prediction Database
 *
 * Ensures that EVERY micro-attribute across all 14 Life Matrix Pillars dynamically adapts
 * to the exact chart's Position, Aspect, Conjunction (PAC), House Lordship, and Dignity,
 * eliminating repetitive/static predictions across different birth charts.
 */

import { SIGNS } from '../constants';
import type { BodyPosition, DivisionalChart } from '../types';

export type PlanetPos = BodyPosition & { placedHouse: number };
export type GrahaKey = 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn' | 'Rahu' | 'Ketu';
export type HouseStrengthTier = 'strong' | 'moderate' | 'afflicted';

export interface BilingualPrediction {
  valEn: string;
  valHi: string;
  explEn: string;
  explHi: string;
}

export interface HousePacProfile {
  houseNum: number;
  signIdx: number;
  signName: string;
  element: string;
  modality: string;
  lordId: GrahaKey;
  lordPlanet?: PlanetPos;
  lordHouse: number;
  occupants: PlanetPos[];
  aspectors: PlanetPos[];
  dominantGraha: GrahaKey;
  tier: HouseStrengthTier;
}

const BENEFICS: Set<string> = new Set(['Jupiter', 'Venus', 'Moon', 'Mercury']);
const MALEFICS: Set<string> = new Set(['Saturn', 'Mars', 'Rahu', 'Ketu', 'Sun']);

function toGrahaKey(id?: string): GrahaKey {
  const valid: GrahaKey[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  return valid.includes(id as GrahaKey) ? (id as GrahaKey) : 'Jupiter';
}

export function getHousePacProfile(
  houseNum: number,
  planets: PlanetPos[],
  ascSignIdx: number,
  getAspectingPlanets: (h: number) => PlanetPos[]
): HousePacProfile {
  const signIdx = (ascSignIdx + houseNum - 1) % 12;
  const sign = SIGNS[signIdx] || SIGNS[0];
  const lordId = toGrahaKey(sign.lord);
  const lordPlanet = planets.find((p) => p.id === lordId);
  const lordHouse = lordPlanet?.placedHouse ?? houseNum;
  const occupants = planets.filter((p) => p.placedHouse === houseNum);
  const aspectors = getAspectingPlanets(houseNum);

  // Determine dominant graha driving this house's flavor
  let dominantGraha: GrahaKey = lordId;
  if (occupants.length > 0) {
    // Prefer non-luminary or stronger occupant if multiple, else first occupant
    const sorted = [...occupants].sort((a, b) => {
      const aScore = a.dignity === 'Exalted' || a.dignity === 'Own Sign' ? 2 : 1;
      const bScore = b.dignity === 'Exalted' || b.dignity === 'Own Sign' ? 2 : 1;
      return bScore - aScore;
    });
    dominantGraha = toGrahaKey(sorted[0].id);
  } else if (aspectors.length > 0 && (lordHouse === 6 || lordHouse === 8 || lordHouse === 12)) {
    dominantGraha = toGrahaKey(aspectors[0].id);
  }

  // Calculate realistic strength tier
  let score = 0;
  if ([1, 4, 5, 7, 9, 10, 11].includes(lordHouse)) score += 2;
  if ([6, 8, 12].includes(lordHouse)) score -= 2;
  if (lordPlanet?.dignity === 'Exalted' || lordPlanet?.dignity === 'Own Sign') score += 2;
  if (lordPlanet?.dignity === 'Debilitated') score -= 2;

  for (const occ of occupants) {
    if (BENEFICS.has(occ.id)) score += 1.5;
    if (MALEFICS.has(occ.id)) score -= 1.5;
    if (occ.dignity === 'Exalted' || occ.dignity === 'Own Sign') score += 1;
    if (occ.dignity === 'Debilitated') score -= 1;
  }
  for (const asp of aspectors) {
    if (asp.id === 'Jupiter' || asp.id === 'Venus') score += 1;
    if (asp.id === 'Saturn' || asp.id === 'Rahu' || asp.id === 'Mars') score -= 1;
  }

  let tier: HouseStrengthTier = 'moderate';
  if (score >= 2.5) tier = 'strong';
  else if (score <= -1) tier = 'afflicted';

  return {
    houseNum,
    signIdx,
    signName: sign.name,
    element: sign.element,
    modality: sign.modality,
    lordId,
    lordPlanet,
    lordHouse,
    occupants,
    aspectors,
    dominantGraha,
    tier,
  };
}

// ============================================================================
// PILLAR 2: PARENTS' SIBLINGS & ANCESTRAL INFLUENCE
// ============================================================================
const PARENTS_SIBLINGS_BY_GRAHA: Record<GrahaKey, { en: string; hi: string }> = {
  Sun: { en: 'Authoritative paternal uncles/aunts in government or leadership; dignified yet formal relationship', hi: 'चाचा-ताऊ व मामा पक्ष प्रशासनिक या प्रतिष्ठित पदों पर; संबंधों में सम्मान व औपचारिकता' },
  Moon: { en: 'Affectionate, emotionally supportive maternal uncles/aunts (Matul Bhava); frequent family gatherings', hi: 'मामा-मौसी पक्ष से गहरा स्नेह व भावनात्मक सहयोग; पारिवारिक मिलन-जुलन अधिक' },
  Mars: { en: 'Energetic, assertive uncles in technical, land, or defense fields; occasional property debates', hi: 'चाचा या मामा भूमि, पुलिस या तकनीकी क्षेत्र में; कभी-कभी संपत्ति संबंधी वैचारिक मतभेद' },
  Mercury: { en: 'Commercial, business-minded maternal/paternal uncles; helpful in education and trade advice', hi: 'व्यापार व लेखा-जोखा से जुड़े मामा-चाचा; शिक्षा व व्यवसाय में उपयोगी सलाह' },
  Jupiter: { en: 'Wise, scholarly, or spiritually inclined elders in both lineages; acts as family advisors', hi: 'दोनों पक्षों में विद्वान, धार्मिक व सलाहकार बुजुर्ग; परिवार के मार्गदर्शक' },
  Venus: { en: 'Cultured, artistic, and materially comfortable aunts/uncles; harmonious social functions', hi: 'बुआ, मौसी व मामा पक्ष कलाप्रिय व साधन-संपन्न; शुभ आयोजनों में मधुरता' },
  Saturn: { en: 'Self-made, hardworking uncles/aunts with reserved nature; physical distance or rare meetings', hi: 'परिश्रमी व गंभीर स्वभाव के चाचा-मामा; कार्यवश दूरी अथवा सीमित संवाद' },
  Rahu: { en: 'Unconventional or geographically distant uncles/aunts settled in metro cities or abroad', hi: 'महानगरों या विदेश में बसे बुआ-मामा पक्ष; संबंधों में आधुनिक व अनपेक्षित मोड़' },
  Ketu: { en: 'Detached or spiritually inclined co-borns of parents; minimal interference in native’s affairs', hi: 'माता-पिता के भाई-बहन आध्यात्मिक या अपने में सीमित; जातक के जीवन में कम हस्तक्षेप' },
};

export function getParentsSiblingsPred(h11: HousePacProfile, h6: HousePacProfile): BilingualPrediction {
  const g = h6.occupants.length > 0 ? h6.dominantGraha : h11.dominantGraha;
  const base = PARENTS_SIBLINGS_BY_GRAHA[g];
  const tierSuffixEn =
    h6.tier === 'afflicted' || h11.tier === 'afflicted'
      ? '; requires tact to avoid minor inheritance friction'
      : h11.tier === 'strong'
      ? '; brings timely social and moral support'
      : '; cordial mutual respect maintained';
  const tierSuffixHi =
    h6.tier === 'afflicted' || h11.tier === 'afflicted'
      ? '; पैतृक संपत्ति चर्चा में व्यवहारिक सावधानी अपेक्षित'
      : h11.tier === 'strong'
      ? '; समय-समय पर सामाजिक व नैतिक संबल प्राप्त होता है'
      : '; सामान्य सौहार्द व सम्मान बना रहता है';

  return {
    valEn: `${base.en}${tierSuffixEn}`,
    valHi: `${base.hi}${tierSuffixHi}`,
    explEn: `Paternal co-borns (11th house: ${h11.signName}, driven by ${h11.dominantGraha}) and maternal co-borns (6th house: ${h6.signName}, driven by ${h6.dominantGraha}) define extended-family dynamics.`,
    explHi: `एकादश भाव (पितृ-सहोदर) व षष्ठ भाव (मातुल भाव) पर ${h11.dominantGraha} व ${h6.dominantGraha} के प्रभाव से चाचा-ताऊ व मामा-मौसी का स्वभाव व संबंध तय होते हैं।`,
  };
}

export function getParentsInfluencePred(h9: HousePacProfile, h4: HousePacProfile): BilingualPrediction {
  if (h9.tier === 'strong' && h4.tier === 'strong') {
    return {
      valEn: 'Strong transmission of ethical values, social prestige, and foundational immovable assets from both parents',
      valHi: 'माता-पिता से उत्तम संस्कार, सामाजिक प्रतिष्ठा व स्थायी पारिवारिक संपत्ति की सशक्त प्राप्ति',
      explEn: `Both Pitru Sthana (H9: ${h9.signName}) and Matru Sthana (H4: ${h4.signName}) hold robust dignity, giving the native a secure moral and material launchpad.`,
      explHi: `नवम (पिता) व चतुर्थ (माता) दोनों भाव बलवान होने से जातक को पारिवारिक संस्कार, शिक्षा और आर्थिक आधार सहज प्राप्त होता है।`,
    };
  }
  if (h9.tier === 'afflicted' && h4.tier === 'afflicted') {
    return {
      valEn: 'Independent self-made upbringing; native inherits resilience and grit rather than effortless material wealth',
      valHi: 'आत्मनिर्भर जीवन-यात्रा; पैतृक वैभव की अपेक्षा संघर्ष से लड़ने का साहस व व्यावहारिक विवेक विरासत में मिला',
      explEn: `Challenges in both 9th (${h9.dominantGraha}) and 4th (${h4.dominantGraha}) axes indicate that parents did their best amidst constraints, forging an independent native.`,
      explHi: `नवम व चतुर्थ भावों में संघर्ष के कारण जातक को भौतिक सुख स्वयं के परिश्रम से अर्जित करने पड़ते हैं, जिससे व्यक्तित्व अत्यंत सुदृढ़ बनता है।`,
    };
  }
  const stronger = h9.tier === 'strong' ? 'Father’s disciplined guidance and social standing' : 'Mother’s emotional wisdom and domestic values';
  const strongerHi = h9.tier === 'strong' ? 'पिता के अनुशासन, सिद्धांतों व सामाजिक प्रतिष्ठा' : 'माता के स्नेह, त्याग व सांस्कृतिक संस्कारों';
  return {
    valEn: `${stronger} shapes the native’s core worldview; balanced blend of ancestral values and personal effort`,
    valHi: `${strongerHi} का जीवन पर गहरा प्रभाव; पारिवारिक मूल्यों और स्व-परिश्रम का संतुलित संगम`,
    explEn: `Asymmetry between 9th (lord in H${h9.lordHouse}) and 4th (lord in H${h4.lordHouse}) shows one parent acts as the primary anchor while the native builds independent momentum.`,
    explHi: `नवमेश (भाव ${h9.lordHouse}) और चतुर्थेश (भाव ${h4.lordHouse}) की स्थिति के अनुसार किसी एक अभिभावक का मार्गदर्शन जीवन की दिशा तय करता है।`,
  };
}

// ============================================================================
// PILLAR 3: SIBLING CAREERS, FAMILY & BONDING
// ============================================================================
const SIBLING_CAREER_BY_GRAHA: Record<GrahaKey, { en: string; hi: string }> = {
  Sun: { en: 'Public administration, medical leadership, or corporate management roles', hi: 'प्रशासनिक सेवा, चिकित्सा प्रबंधन अथवा सरकारी/कॉर्पोरेट नेतृत्व' },
  Moon: { en: 'Healthcare, hospitality, education, psychology, or public-facing services', hi: 'स्वास्थ्य सेवा, आतिथ्य, शिक्षण, परामर्श अथवा जनसंपर्क क्षेत्र' },
  Mars: { en: 'Engineering, real estate, armed forces, sports, or technical operations', hi: 'इंजीनियरिंग, रियल एस्टेट, रक्षा/पुलिस, खेल अथवा तकनीकी संचालन' },
  Mercury: { en: 'Banking, accounting, IT/software, commerce, media, or analytical consulting', hi: 'बैंकिंग, लेखा, आईटी/सॉफ्टवेयर, व्यापार, मीडिया अथवा कंसल्टिंग' },
  Jupiter: { en: 'Law, academia, finance, advisory, or institutional leadership', hi: 'विधि (कानून), अध्यापन, वित्त, परामर्श अथवा शैक्षणिक संस्थान' },
  Venus: { en: 'Design, fashion, media, luxury retail, finance, or creative entrepreneurship', hi: 'डिजाइन, कला, मीडिया, वस्त्र/आभूषण व्यापार अथवा रचनात्मक उद्यम' },
  Saturn: { en: 'Manufacturing, civil infrastructure, logistics, or steady salaried service', hi: 'निर्माण, लॉजिस्टिक्स, तकनीकी श्रम अथवा दीर्घकालिक नियमित नौकरी' },
  Rahu: { en: 'Digital tech, foreign trade, aviation, research, or non-traditional startups', hi: 'डिजिटल तकनीक, विदेश व्यापार, शोध अथवा आधुनिक स्टार्टअप क्षेत्र' },
  Ketu: { en: 'Specialized research, spiritual/healing arts, coding, or quiet niche professions', hi: 'विशिष्ट शोध, चिकित्सा/आध्यात्मिक कार्य, कोडिंग अथवा एकांतिक तकनीकी पेशा' },
};

export function getSiblingCareersPred(h3: HousePacProfile, h11: HousePacProfile): BilingualPrediction {
  const g = h3.occupants.length > 0 ? h3.dominantGraha : h11.dominantGraha;
  const career = SIBLING_CAREER_BY_GRAHA[g];
  const stabilityEn =
    h3.tier === 'strong' || h11.tier === 'strong'
      ? 'with steady upward growth and financial independence'
      : h3.tier === 'afflicted'
      ? 'requiring periodic career shifts and perseverance before stabilizing'
      : 'with practical, self-reliant occupational progress';
  const stabilityHi =
    h3.tier === 'strong' || h11.tier === 'strong'
      ? '; निरंतर प्रगति व आर्थिक आत्मनिर्भरता'
      : h3.tier === 'afflicted'
      ? '; प्रारंभिक उतार-चढ़ाव व परिश्रम के बाद स्थिरता'
      : '; व्यावहारिक व आत्मनिर्भर कार्यप्रणाली';

  return {
    valEn: `${career.en} ${stabilityEn}`,
    valHi: `${career.hi}${stabilityHi}`,
    explEn: `Analyzed from 3rd house (${h3.signName}, ${h3.dominantGraha}) for younger co-borns and 11th house (${h11.signName}, ${h11.dominantGraha}) for elder co-borns.`,
    explHi: `तृतीय भाव (${h3.dominantGraha}) व एकादश भाव (${h11.dominantGraha}) के आधार पर सहोदरों के कार्यक्षेत्र और आर्थिक स्थिरता का आकलन होता है।`,
  };
}

export function getSiblingFamilyAndBondingPred(h3: HousePacProfile, h11: HousePacProfile): {
  family: BilingualPrediction;
  bonding: BilingualPrediction;
} {
  if (h3.tier === 'strong' && h11.tier !== 'afflicted') {
    return {
      family: {
        valEn: 'Siblings maintain settled domestic households and offer reliable practical counsel during life milestones',
        valHi: 'सहोदरों का सुव्यवस्थित पारिवारिक जीवन; महत्वपूर्ण निर्णयों में व्यावहारिक व विश्वसनीय सहयोग',
        explEn: `Benefic strength on H3/H11 indicates stable sibling households and constructive mutual support.`,
        explHi: `तृतीय व एकादश भावों की शुभ स्थिति भाई-बहनों के सुखी गृहस्थ जीवन को दर्शाती है।`,
      },
      bonding: {
        valEn: 'Warm, loyal camaraderie; respectful dialogue prevails even on financial or ancestral matters',
        valHi: 'आत्मीय व भरोसेमंद संबंध; संपत्ति या पारिवारिक विषयों में भी परिपक्व संवाद व प्रेम',
        explEn: `3rd lord in H${h3.lordHouse} and 11th lord in H${h11.lordHouse} foster enduring sibling solidarity.`,
        explHi: `तृतीयेश व एकादशेश की अनुकूल स्थिति भाई-बहनों में आजीवन स्नेह बनाए रखती है।`,
      },
    };
  }
  if (h3.tier === 'afflicted' || h11.tier === 'afflicted') {
    return {
      family: {
        valEn: 'Siblings live busy, independent or geographically separated lives; occasional domestic hurdles require empathy',
        valHi: 'सहोदर अपने-अपने जीवन व दूरी में व्यस्त; कभी-कभी पारिवारिक जिम्मेदारियों को लेकर तनाव संभव',
        explEn: `Malefic or Dusthana placement on H3/H11 (${h3.dominantGraha}/${h11.dominantGraha}) creates differing lifestyles and physical distance among co-borns.`,
        explHi: `तृतीय या एकादश भाव पर क्रूर ग्रह या त्रिक स्थान का प्रभाव सहोदरों की जीवनशैली व निवास में दूरी लाता है।`,
      },
      bonding: {
        valEn: 'Reserved or formal bonding with periodic ego/opinion clashes; clarity in financial boundaries preserves peace',
        valHi: 'औपचारिक व सीमित संवाद; वैचारिक मतभेद से बचने हेतु आर्थिक मामलों में स्पष्टता आवश्यक',
        explEn: `Mars/Saturn/Rahu influence on the sibling axis advises clear communication and avoiding mixed finances with co-borns.`,
        explHi: `भ्रातृ भाव पर संघर्षकारक प्रभाव होने से भाई-बहनों के साथ लेन-देन स्पष्ट रखना ही संबंधों को मधुर रखता है।`,
      },
    };
  }
  return {
    family: {
      valEn: 'Moderate, self-reliant family lives for siblings; cordial visits during festivals and family rites',
      valHi: 'सहोदरों का सामान्य व आत्मनिर्भर गृहस्थ जीवन; पर्व-त्योहारों व पारिवारिक अवसरों पर सुखद मिलन',
      explEn: `Balanced 3rd and 11th houses denote independent households with mutual goodwill.`,
      explHi: `तृतीय व एकादश भावों का मध्यम बल स्वतंत्र किंतु सौहार्दपूर्ण पारिवारिक संबंध दर्शाता है।`,
    },
    bonding: {
      valEn: 'Affectionate yet independent relationship; each sibling respects personal space while standing together in crises',
      valHi: 'स्नेहपूर्ण किंतु स्वतंत्र संबंध; सामान्य दिनों में अपनी-अपनी व्यस्तता, किंतु संकट में परस्पर साथ',
      explEn: `3rd lord in House ${h3.lordHouse} sustains baseline sibling loyalty despite differing priorities.`,
      explHi: `तृतीयेश की भाव ${h3.lordHouse} में स्थिति आवश्यकता पड़ने पर आपसी सहयोग सुनिश्चित करती है।`,
    },
  };
}

// ============================================================================
// PILLAR 4: IN-LAWS & INTIMACY BONDING
// ============================================================================
export function getInLawsPred(h8: HousePacProfile, h7: HousePacProfile): BilingualPrediction {
  // 2nd from 7th is House 8 (In-laws' family & resources)
  if (h8.tier === 'strong' && h7.tier !== 'afflicted') {
    return {
      valEn: 'Supportive, dignified in-laws with stable social standing; cordial post-marital family integration',
      valHi: 'सुसंस्कृत, प्रतिष्ठित व सहयोगी ससुराल पक्ष; विवाह उपरांत दोनों परिवारों में मधुर सामंजस्य',
      explEn: `The 8th house (2nd from 7th = Kutumba of spouse) is well-supported by ${h8.dominantGraha}, bringing respectful in-law relations.`,
      explHi: `सप्तम से द्वितीय (अष्टम भाव) की शुभ स्थिति ससुराल पक्ष से सम्मान और सहयोग दिलाती है।`,
    };
  }
  if (h8.tier === 'afflicted') {
    return {
      valEn: 'Traditional or opinionated in-laws; maintaining healthy independence and polite boundaries prevents domestic friction',
      valHi: 'ससुराल पक्ष से वैचारिक भिन्नता या अपेक्षाओं का दबाव; मर्यादित दूरी व स्वतंत्र निवास से शांति बनी रहेगी',
      explEn: `Affliction to the 8th house (${h8.dominantGraha}, lord in H${h8.lordHouse}) shows differing cultural expectations; independent household management helps.`,
      explHi: `अष्टम भाव पर ${h8.dominantGraha} के प्रभाव से ससुराल पक्ष से तालमेल में धैर्य और स्वतंत्र निर्णय क्षमता आवश्यक होती है।`,
    };
  }
  return {
    valEn: 'Middle-to-upper-middle class, practical in-laws; respectful, formal harmony maintained across family occasions',
    valHi: 'व्यावहारिक व मध्यम वर्गीय सुसंस्कृत ससुराल पक्ष; पारिवारिक अवसरों पर सम्मानजनक व औपचारिक संबंध',
    explEn: `8th house (${h8.signName}, lord in H${h8.lordHouse}) indicates functional, polite relations with spouse’s family.`,
    explHi: `अष्टम भाव (${h8.signName}) की संतुलित स्थिति ससुराल पक्ष के साथ सामान्य व शिष्ट संबंध दर्शाती है।`,
  };
}

export function getIntimacyBondingPred(h12: HousePacProfile, venus?: PlanetPos, mars?: PlanetPos): BilingualPrediction {
  if (h12.tier === 'strong' && venus?.dignity !== 'Debilitated') {
    return {
      valEn: 'Deep emotional warmth, fulfilling physical intimacy, and mutual tenderness in marital life',
      valHi: 'प्रगाढ़ भावनात्मक उष्मा, संतुष्टिदायक शयन सुख व दांपत्य में परस्पर कोमलता',
      explEn: `Strong 12th house (Shayana Sukha) and dignified Venus cultivate enduring romantic chemistry and marital contentment.`,
      explHi: `द्वादश भाव (शयन सुख) और शुक्र का शुभ बल वैवाहिक जीवन में संतोष व आत्मीयता बनाए रखता है।`,
    };
  }
  if (h12.tier === 'afflicted' || venus?.dignity === 'Debilitated' || (mars && mars.placedHouse === 12)) {
    return {
      valEn: 'Passionate yet temperamental intimacy; work stress or ego differences can cool warmth unless consciously nurtured',
      valHi: 'तीव्र आकर्षण किंतु कार्य-तनाव या क्रोध के कारण शयन सुख में उतार-चढ़ाव; भावनात्मक संवाद आवश्यक',
      explEn: `Malefic influence on the 12th house (${h12.dominantGraha}) or Venus indicates that external stress impacts bedroom harmony; patience restores balance.`,
      explHi: `द्वादश भाव पर ${h12.dominantGraha} का प्रभाव दर्शाता है कि व्यस्तता और तनाव को दांपत्य कक्ष से दूर रखना सुख के लिए आवश्यक है।`,
    };
  }
  return {
    valEn: 'Balanced, affectionate companionship; intimacy deepens steadily over time through shared trust and quiet comfort',
    valHi: 'संतुलित व स्नेहपूर्ण दांपत्य सुख; समय के साथ विश्वास व भावनात्मक निकटता में निरंतर वृद्धि',
    explEn: `12th house (${h12.signName}, lord in H${h12.lordHouse}) indicates steady, respectful marital intimacy.`,
    explHi: `द्वादश भाव की स्थिति जीवनसाथी के साथ मर्यादित, संतुष्टिदायक और स्थायी संबंध को दर्शाती है।`,
  };
}

// ============================================================================
// PILLAR 5: CHILDREN YOGA, INTELLECT, BONDING & TIMING
// ============================================================================
export function getProgenyPillarDetails(
  h5: HousePacProfile,
  h9: HousePacProfile,
  jupiter?: PlanetPos
): {
  yoga: BilingualPrediction;
  intellect: BilingualPrediction;
  bonding: BilingualPrediction;
  timing: BilingualPrediction;
} {
  const isBarren = ['Aries', 'Gemini', 'Leo', 'Virgo'].includes(h5.signName);
  const jupWeak = jupiter && ([6, 8, 12].includes(jupiter.placedHouse) || jupiter.dignity === 'Debilitated');

  // 1. Yoga
  let yoga: BilingualPrediction;
  if (h5.tier === 'strong' && !isBarren && !jupWeak) {
    yoga = {
      valEn: 'Strong, fertile Putrabhava yoga; smooth natural conception and joyful parental fulfillment',
      valHi: 'प्रबल व उर्वर संतान योग; सहज गर्भधारण व संतान द्वारा जीवन में आनंद की प्राप्ति',
      explEn: `5th house (${h5.signName}) and Putrakaraka Jupiter (H${jupiter?.placedHouse}) are well-fortified.`,
      explHi: `पंचम भाव व गुरु की शुभ स्थिति निर्विघ्न संतान सुख का प्रमाण देती है।`,
    };
  } else if (h5.tier === 'afflicted' || (isBarren && jupWeak)) {
    yoga = {
      valEn: 'Delayed or tested progeny yoga (Santan Vilamba); requires medical care, patience, and Jupiter remedies',
      valHi: 'संतान प्राप्ति में विलंब अथवा प्रारंभिक बाधा (संतान विलंब योग); चिकित्सीय परामर्श व गुरु-उपाय लाभकारी',
      explEn: `Affliction on 5th house (${h5.dominantGraha}, lord in H${h5.lordHouse}) or weak Jupiter indicates delays that resolve with proper care.`,
      explHi: `पंचम भाव पर ${h5.dominantGraha} के प्रभाव या गुरु की कमजोरी से संतान सुख में धैर्य और चिकित्सा की आवश्यकता पड़ती है।`,
    };
  } else {
    yoga = {
      valEn: 'Moderate, auspicious progeny promise; fulfilled naturally in due course with family planning balance',
      valHi: 'मध्यम व शुभ संतति योग; समयानुसार स्वाभाविक संतान प्राप्ति व पारिवारिक सुख',
      explEn: `5th house (${h5.signName}, lord in H${h5.lordHouse}) grants steady progeny outcomes during supportive Dasha.`,
      explHi: `पंचमेश की भाव ${h5.lordHouse} में स्थिति अनुकूल दशा में संतान सुख प्रदान करती है।`,
    };
  }

  // 2. Intellect (9th = 5th from 5th)
  const intelMap: Record<GrahaKey, { en: string; hi: string }> = {
    Sun: { en: 'Confident, leadership-oriented children inclined toward administration or medicine', hi: 'आत्मविश्वासी व नेतृत्व-कुशल संतान; प्रशासन या चिकित्सा में रुचि' },
    Moon: { en: 'Imaginative, empathetic children excelling in arts, healthcare, or public communication', hi: 'संवेदनशील व कल्पनाशील संतान; कला, सेवा या जनसंपर्क में सफल' },
    Mars: { en: 'Energetic, courageous children drawn to engineering, sports, or technical action', hi: 'ऊर्जावान व साहसी संतान; इंजीनियरिंग, खेल या तकनीकी क्षेत्र में रुचि' },
    Mercury: { en: 'Sharp-witted, analytical children excelling in commerce, IT, coding, and communication', hi: 'तीव्र बुद्धि व तार्किक संतान; वाणिज्य, आईटी व संवाद कला में निपुण' },
    Jupiter: { en: 'Wise, ethical, academically gifted children excelling in higher education or law', hi: 'विद्वान, संस्कारी व मेधावी संतान; उच्च शिक्षा, वित्त या विधि में श्रेष्ठ' },
    Venus: { en: 'Graceful, creative children inclined toward design, media, management, or fine arts', hi: 'सुशील व रचनात्मक संतान; कला, प्रबंधन, मीडिया या डिजाइन में निपुण' },
    Saturn: { en: 'Disciplined, serious, hardworking children who achieve steady, late-blooming mastery', hi: 'अनुशासित व परिश्रमी संतान; गंभीर अध्ययन व धीरे-धीरे स्थायी सफलता' },
    Rahu: { en: 'Unconventional, tech-savvy children attracted to modern sciences or foreign education', hi: 'आधुनिक सोच व तकनीक-प्रेमी संतान; नवीन विज्ञान या विदेश में अध्ययन' },
    Ketu: { en: 'Deeply intuitive, introspective children inclined toward research or spiritual inquiry', hi: 'गहन चिंतनशील व शोध-वृत्ति वाली संतान; विज्ञान या आध्यात्मिक रुचि' },
  };
  const intel = intelMap[h9.dominantGraha];
  const intellect: BilingualPrediction = {
    valEn: intel.en,
    valHi: intel.hi,
    explEn: `Evaluated from 9th house (5th from 5th: ${h9.signName}, driven by ${h9.dominantGraha}).`,
    explHi: `पंचम से पंचम (नवम भाव) पर ${h9.dominantGraha} के प्रभाव से संतान की बुद्धि और रुचि का निर्धारण होता है।`,
  };

  // 3. Bonding
  let bonding: BilingualPrediction;
  if (h5.tier === 'afflicted') {
    bonding = {
      valEn: 'Deep parental love, though generation-gap or independent career choices create occasional ideological distance',
      valHi: 'संतान के प्रति गहरा स्नेह, किंतु वैचारिक भिन्नता या दूरी के कारण संवाद में धैर्य आवश्यक',
      explEn: `Malefic/Dusthana influence on 5th shows children grow very independent; respectful listening strengthens the bond.`,
      explHi: `पंचम भाव पर दबाव के कारण संतान स्वतंत्र विचार रखती है; मित्रवत व्यवहार से संबंध मधुर रहते हैं।`,
    };
  } else {
    bonding = {
      valEn: 'Warm, respectful filial bond; children value parental guidance and support family elders',
      valHi: 'स्नेहपूर्ण व आदरयुक्त संबंध; संतान माता-पिता के मार्गदर्शन का सम्मान व सेवा करती है',
      explEn: `Harmonious 5th house (${h5.signName}) nurtures mutual respect across generations.`,
      explHi: `पंचम भाव का शुभ बल माता-पिता और संतान के बीच आजीवन आत्मीयता बनाए रखता है।`,
    };
  }

  // 4. Timing
  let timing: BilingualPrediction;
  if (h5.tier === 'afflicted' || h5.occupants.some((p) => p.id === 'Saturn' || p.id === 'Rahu')) {
    timing = {
      valEn: 'Mature conception window between ages 29 and 34 years; activates during Jupiter or 5th lord Antardasha',
      valHi: 'आयु 29 से 34 वर्ष के मध्य संतति प्राप्ति का अनुकूल समय; गुरु अथवा पंचमेश की अंतर्दशा में योग सक्रिय',
      explEn: `Saturn/Rahu or challenging 5th lord placement shifts progeny timing slightly later into mature adulthood.`,
      explHi: `शनि/राहु या विलंबकारक स्थिति के कारण संतान योग परिपक्व आयु में फलीभूत होता है।`,
    };
  } else if (h5.tier === 'strong') {
    timing = {
      valEn: 'Timely auspicious window between ages 25 and 30 years under favorable Guru Gochar',
      valHi: 'आयु 25 से 30 वर्ष के मध्य समयबद्ध व शुभ संतति योग; गुरु के अनुकूल गोचर में फल प्राप्ति',
      explEn: `Fortified 5th house allows smooth, timely manifestation of progeny yoga.`,
      explHi: `बलवान पंचम भाव समय पर सहज संतान सुख प्रदान करता है।`,
    };
  } else {
    timing = {
      valEn: 'Balanced conception window between ages 27 and 32 years aligned with benefic Dasha transits',
      valHi: 'आयु 27 से 32 वर्ष के मध्य शुभ दशा व गोचर के समन्वय से संतान सुख की प्राप्ति',
      explEn: `Transit Jupiter over 5th/9th activates natal progeny promise in late twenties to early thirties.`,
      explHi: `गुरु गोचर व पंचमेश की दशा के संयोग से संतुलित आयु में संतान प्राप्ति होती है।`,
    };
  }

  return { yoga, intellect, bonding, timing };
}

// ============================================================================
// PILLAR 6: EDUCATION (TEACHERS, HOSTEL, HURDLES, EXAMS, FRIENDS)
// ============================================================================
export function getEducationSubDetails(
  h4: HousePacProfile,
  h5: HousePacProfile,
  h6: HousePacProfile,
  h9: HousePacProfile,
  h11: HousePacProfile,
  jupiter?: PlanetPos
): {
  teachers: BilingualPrediction;
  hostel: BilingualPrediction;
  hurdles: BilingualPrediction;
  exams: BilingualPrediction;
  friends: BilingualPrediction;
} {
  // 1. Teachers (H9 & Jupiter)
  const teachers: BilingualPrediction =
    h9.tier === 'strong' && jupiter?.dignity !== 'Debilitated'
      ? {
          valEn: 'Strong patronage from wise professors and senior mentors who open pivotal career doors',
          valHi: 'योग्य गुरुजनों व वरिष्ठ प्राध्यापकों का विशेष स्नेह, मार्गदर्शन व करियर में सहयोग',
          explEn: `Fortified 9th house (${h9.signName}) and Jupiter cultivate lifelong guru-shishya goodwill.`,
          explHi: `नवम भाव व गुरु के बल से जातक को श्रेष्ठ मार्गदर्शकों का आशीर्वाद मिलता है।`,
        }
      : h9.tier === 'afflicted'
      ? {
          valEn: 'Self-directed learning; occasional friction with rigid instructors teaches independent critical thinking',
          valHi: 'स्व-अध्ययन की प्रवृत्ति अधिक; कठोर शिक्षकों से मतभेद के कारण जातक स्वयं के बल पर सीखता है',
          explEn: `Affliction in 9th house (${h9.dominantGraha}) fosters a questioning, self-taught mind rather than passive obedience.`,
          explHi: `नवम भाव में संघर्ष जातक को स्वतंत्र चिंतक व स्व-शिक्षित बनाता है।`,
        }
      : {
          valEn: 'Constructive, practical guidance from experienced teachers during crucial academic transitions',
          valHi: 'अध्ययन के महत्वपूर्ण पड़ावों पर अनुभवी शिक्षकों का व्यावहारिक व उपयोगी मार्गदर्शन',
          explEn: `Balanced 9th house provides steady educational mentorship when sought sincerely.`,
          explHi: `नवम भाव की सामान्य स्थिति समय-समय पर उचित शैक्षणिक दिशा देती है।`,
        };

  // 2. Hostel / Travel for Education (H4, H9, H12)
  const moveForEdu = h4.modality === 'Movable' || [3, 9, 12].includes(h4.lordHouse) || [9, 12].includes(h5.lordHouse);
  const hostel: BilingualPrediction = moveForEdu
    ? {
        valEn: 'Relocation away from hometown for higher studies; hostel life or out-of-state university experience builds independence',
        valHi: 'उच्च शिक्षा हेतु घर से दूर प्रवास; छात्रावास (Hostel) अथवा अन्य नगर में रहकर अध्ययन व आत्मनिर्भरता',
        explEn: `4th house (${h4.signName}) connecting with movable/distant houses (lord in H${h4.lordHouse}) triggers academic relocation.`,
        explHi: `चतुर्थ भाव का चर राशि या ३/९/१२वें भाव से संबंध शिक्षा के लिए घर से दूर जाने का योग बनाता है।`,
      }
    : {
        valEn: 'Primary and higher education largely completed near native city/family base; stable home study environment',
        valHi: 'अधिकांश शिक्षा पैतृक नगर अथवा परिवार के समीप रहकर पूर्ण; घर के शांत वातावरण में अध्ययन',
        explEn: `Fixed/grounded 4th axis keeps academic base anchored close to home.`,
        explHi: `चतुर्थ भाव की स्थिरता जातक को परिवार के पास रहकर पढ़ाई पूर्ण करने का अवसर देती है।`,
      };

  // 3. Education Hurdles
  const hurdles: BilingualPrediction =
    h5.tier === 'afflicted' || h4.tier === 'afflicted'
      ? {
          valEn: 'Noticeable academic hurdles: possible stream change, temporary breaks, or distraction requiring disciplined focus',
          valHi: 'अध्ययन में उतार-चढ़ाव: विषय परिवर्तन, एकाग्रता में भटकाव अथवा अस्थायी व्यवधान; कठोर अनुशासन आवश्यक',
          explEn: `Malefic influence on 4th/5th (${h4.dominantGraha}/${h5.dominantGraha}) creates early academic friction before maturity sets in.`,
          explHi: `चतुर्थ/पंचम भाव पर दबाव के कारण प्रारंभिक शिक्षा में बाधा आती है, जिसे परिश्रम से पार किया जाता है।`,
        }
      : h5.tier === 'strong'
      ? {
          valEn: 'Smooth, unobstructed academic progression with strong focus and timely completion of degrees',
          valHi: 'निर्विघ्न व समयबद्ध शैक्षणिक प्रगति; तीव्र एकाग्रता के साथ उपाधियों की सहज प्राप्ति',
          explEn: `Benefic 4th/5th houses protect educational continuity from major breaks.`,
          explHi: `चतुर्थ व पंचम भावों की शुभ स्थिति शिक्षा को सुचारू और बाधा-रहित रखती है।`,
        }
      : {
          valEn: 'Minor exam stress or brief indecision around ages 18–21; overcomes obstacles through steady revision',
          valHi: '18–21 वर्ष की आयु के आसपास विषय चयन की दुविधा या सामान्य परीक्षा दबाव; नियमित अभ्यास से सफलता',
          explEn: `Moderate 5th axis shows manageable academic challenges overcome by persistence.`,
          explHi: `मध्यम पंचम भाव सामान्य परिश्रम से सभी शैक्षणिक चुनौतियों पर विजय दिलाता है।`,
        };

  // 4. Competitive Exams (H6 & Mars/Mercury)
  const exams: BilingualPrediction =
    h6.tier === 'strong' || ['Mars', 'Sun', 'Mercury'].includes(h6.dominantGraha)
      ? {
          valEn: 'High competitive grit: Capable of clearing tough entrance/government exams through focused strategy',
          valHi: 'प्रबल प्रतिस्पर्धात्मक क्षमता: कठिन प्रवेश परीक्षाओं व सरकारी/प्रतियोगी परीक्षाओं में चयन का उत्तम योग',
          explEn: `6th house (Competition) driven by ${h6.dominantGraha} equips the native with analytical stamina under pressure.`,
          explHi: `षष्ठ भाव पर ${h6.dominantGraha} का प्रभाव जातक को प्रतियोगी परीक्षाओं में विजय दिलाने वाला जुझारूपन देता है।`,
        }
      : h6.tier === 'afflicted'
      ? {
          valEn: 'Competitive exams require multiple persistent attempts; skill-based interviews suit better than rote-memory tests',
          valHi: 'प्रतियोगी परीक्षाओं में एक से अधिक प्रयासों की आवश्यकता; रटने के बजाय व्यावहारिक कौशल-परीक्षण अधिक अनुकूल',
          explEn: `Afflicted 6th axis suggests steady persistence or opting for practical skill-driven career paths.`,
          explHi: `षष्ठ भाव की स्थिति दर्शाती है कि निरंतर अभ्यास या कौशल आधारित चयन से ही सफलता मिलेगी।`,
        }
      : {
          valEn: 'Steady performance in merit tests and interviews when backed by structured 6–12 month preparation',
          valHi: 'नियोजित तैयारी व निरंतर अभ्यास द्वारा प्रवेश परीक्षाओं व साक्षात्कार में संतोषजनक सफलता',
          explEn: `6th lord in House ${h6.lordHouse} rewards systematic preparation in competitive arenas.`,
          explHi: `षष्ठेश की भाव ${h6.lordHouse} में स्थिति अनुशासित तैयारी से सफलता सुनिश्चित करती है।`,
        };

  // 5. Friends & Networking (H11)
  const friendMap: Record<GrahaKey, { en: string; hi: string }> = {
    Sun: { en: 'Small circle of ambitious, influential friends in leadership or public roles', hi: 'प्रभावशाली व महत्वाकांक्षी मित्रों का सीमित किंतु प्रतिष्ठित दायरा' },
    Moon: { en: 'Warm, emotionally supportive friends who feel like extended family', hi: 'भावुक, स्नेही व सुख-दुख में साथ देने वाले घनिष्ठ मित्र' },
    Mars: { en: 'Energetic, action-oriented friends; dynamic camaraderie with occasional blunt debates', hi: 'उत्साही व साहसी मित्र; आपस में स्पष्टवादिता व सक्रिय सहयोग' },
    Mercury: { en: 'Witty, intellectually diverse friend network across tech, media, and business', hi: 'बौद्धिक, चतुर व व्यापार-तकनीक से जुड़े विविध मित्रों का बड़ा समूह' },
    Jupiter: { en: 'Sincere, wise, ethical companions who offer sound counsel and lifelong loyalty', hi: 'सज्जन, विद्वान व सदाचारी मित्र जो सही सलाह व आजीवन साथ देते हैं' },
    Venus: { en: 'Artistic, cheerful, socially refined friends; joyful social gatherings', hi: 'कलाप्रिय, प्रसन्नचित्त व सुरुचिपूर्ण मित्र; सामाजिक मेलजोल में आनंद' },
    Saturn: { en: 'Very few, deeply tested, mature or older friends; values quality over quantity', hi: 'बहुत कम किंतु परिपक्व व विश्वसनीय मित्र; भीड़ की अपेक्षा गहराई को महत्व' },
    Rahu: { en: 'Diverse, unconventional, or cross-cultural friends; requires discernment in financial trust', hi: 'विविध व आधुनिक परिवेश के मित्र; मित्रता में आर्थिक लेन-देन से सतर्कता आवश्यक' },
    Ketu: { en: 'Selective, private social life; prefers 1–2 genuine confidants over large groups', hi: 'अत्यंत सीमित व एकांतप्रिय मित्रता; बड़े समूह के बजाय 1-2 सच्चे मित्र पसंद' },
  };
  const fBase = friendMap[h11.dominantGraha];
  const friends: BilingualPrediction = {
    valEn: `${fBase.en}${h11.tier === 'afflicted' ? '; guard against fair-weather acquaintances' : ''}`,
    valHi: `${fBase.hi}${h11.tier === 'afflicted' ? '; स्वार्थी मित्रों से सावधानी रखें' : ''}`,
    explEn: `11th house (${h11.signName}, driven by ${h11.dominantGraha}, lord in H${h11.lordHouse}) governs friendships and social gains.`,
    explHi: `एकादश भाव (मित्र व लाभ) पर ${h11.dominantGraha} का प्रभाव मित्र-मंडली का स्वरूप तय करता है।`,
  };

  return { teachers, hostel, hurdles, exams, friends };
}

// ============================================================================
// PILLAR 7: PROFIT/LOSS CYCLES & HIDDEN WEALTH
// ============================================================================
export function getCareerFinancialDetails(h11: HousePacProfile, h12: HousePacProfile, h8: HousePacProfile): {
  profitLoss: BilingualPrediction;
  hiddenWealth: BilingualPrediction;
} {
  let profitLoss: BilingualPrediction;
  if (h11.tier === 'strong' && h12.tier !== 'afflicted') {
    profitLoss = {
      valEn: 'Income consistently outpaces expenses; strong savings growth between ages 30 and 45 with disciplined reserves',
      valHi: 'आय व्यय से निरंतर अधिक; 30 से 45 वर्ष की आयु के मध्य पूंजी व बचत में उल्लेखनीय वृद्धि',
      explEn: `11th house (${h11.signName}) dominates 12th house (${h12.signName}), sustaining positive net cash flow.`,
      explHi: `एकादश (लाभ) भाव द्वादश (व्यय) से अधिक बलवान होने से पूंजी संचय सुदृढ़ रहता है।`,
    };
  } else if (h11.tier === 'afflicted' || h12.occupants.some((p) => p.id === 'Rahu' || p.id === 'Mars')) {
    profitLoss = {
      valEn: 'Cyclical income-expense waves; unexpected family/medical expenses require strict emergency funds and avoiding risky speculation',
      valHi: 'आय-व्यय में उतार-चढ़ाव; अनपेक्षित खर्चों से बचने हेतु आपातकालीन बचत व सट्टेबाजी से दूर रहना अनिवार्य',
      explEn: `Active 12th expenses (${h12.dominantGraha}) vs 11th gains (${h11.dominantGraha}) demand conservative risk management.`,
      explHi: `द्वादश भाव में व्यय की प्रवृत्ति होने से सुरक्षित निवेश और बजट अनुशासन ही समृद्धि की कुंजी है।`,
    };
  } else {
    profitLoss = {
      valEn: 'Balanced cash flow: Steady earnings cover living needs comfortably; wealth grows gradually after mid-30s',
      valHi: 'संतुलित आय-व्यय चक्र: नियमित कमाई से सभी दायित्व पूर्ण; 35 वर्ष के बाद संचित कोष में धीरे-धीरे वृद्धि',
      explEn: `11th lord in H${h11.lordHouse} and 12th lord in H${h12.lordHouse} indicate steady financial equilibrium.`,
      explHi: `एकादश व द्वादश भावों का संतुलन जीवन में आर्थिक स्थिरता बनाए रखता है।`,
    };
  }

  let hiddenWealth: BilingualPrediction;
  if (h8.tier === 'strong' && !h8.occupants.some((p) => p.id === 'Rahu' || p.id === 'Saturn')) {
    hiddenWealth = {
      valEn: 'Favorable gains through long-term PF/insurance maturity, ancestral settlement, or quiet investments',
      valHi: 'दीर्घकालिक निवेश, बीमा/पीएफ परिपक्वता अथवा पैतृक हिस्सेदारी से अप्रत्याशित लाभ का योग',
      explEn: `Fortified 8th house (${h8.signName}) unlocks unearned reserves and structured settlements.`,
      explHi: `अष्टम भाव के शुभ बल से रुका हुआ धन, बीमा अथवा पैतृक लाभ प्राप्त होता है।`,
    };
  } else if (h8.tier === 'afflicted') {
    hiddenWealth = {
      valEn: 'No reliance on windfalls or lottery; speculative trading can cause losses — wealth comes strictly through earned work',
      valHi: 'लॉटरी या शॉर्टकट से धन की आशा न रखें; सट्टेबाजी में हानि संभव — केवल परिश्रम की कमाई ही फलदायी',
      explEn: `Afflicted 8th house (${h8.dominantGraha}, lord in H${h8.lordHouse}) warns against get-rich-quick schemes or undocumented loans.`,
      explHi: `अष्टम भाव पर ${h8.dominantGraha} के दबाव के कारण बिना सोचे-समझे जोखिम भरे निवेश से बचना चाहिए।`,
    };
  } else {
    hiddenWealth = {
      valEn: 'Modest long-term compounding through retirement funds, insurance, and gradual asset appreciation',
      valHi: 'भविष्य निधि, बीमा व दीर्घकालिक सुरक्षित बचत के माध्यम से समय के साथ शांत पूंजी वृद्धि',
      explEn: `8th lord in House ${h8.lordHouse} favors patient, low-risk compounding over sudden speculation.`,
      explHi: `अष्टमेश की स्थिति धैर्यपूर्ण व सुरक्षित दीर्घकालिक निवेश को लाभकारी बनाती है।`,
    };
  }

  return { profitLoss, hiddenWealth };
}

// ============================================================================
// PILLAR 8: ACCIDENTS, CRISES, DREAMS, ROMANCE, OCCULT, SECRETS, PETS
// ============================================================================
export function getPillar8MicroDetails(
  h6: HousePacProfile,
  h8: HousePacProfile,
  h12: HousePacProfile,
  moon?: PlanetPos,
  venus?: PlanetPos
): {
  accidents: BilingualPrediction;
  crises: BilingualPrediction;
  dreams: BilingualPrediction;
  romance: BilingualPrediction;
  occult: BilingualPrediction;
  secrets: BilingualPrediction;
  pets: BilingualPrediction;
} {
  // 1. Accidents
  const marsRahu8 = h8.occupants.some((p) => p.id === 'Mars' || p.id === 'Rahu') || h8.aspectors.some((p) => p.id === 'Mars' || p.id === 'Rahu');
  const accidents: BilingualPrediction = marsRahu8
    ? {
        valEn: 'Elevated caution required with fast driving, sharp tools, and fire/electricity; strictly wear safety gear',
        valHi: 'तेज वाहन चालन, अग्नि, बिजली व धारदार उपकरणों से विशेष सावधानी अपेक्षित; सुरक्षा नियमों का पालन अनिवार्य',
        explEn: `Mars/Rahu influence on 8th house (Randhra) warns against haste and impulsive physical risks.`,
        explHi: `अष्टम भाव पर मंगल/राहु का प्रभाव आकस्मिक चोट से बचाव हेतु वाहन धीरे व सावधानी से चलाने की चेतावनी देता है।`,
      }
    : h8.tier === 'strong'
    ? {
        valEn: 'Low accident vulnerability; strong protective shield during travel with minor seasonal precautions',
        valHi: 'गंभीर दुर्घटना की संभावना अत्यंत न्यून; यात्राओं में दैवीय सुरक्षा व सामान्य सतर्कता पर्याप्त',
        explEn: `Benefic protection on 8th house mitigates sudden physical mishaps.`,
        explHi: `अष्टम भाव की शुभ स्थिति आकस्मिक संकटों से जातक की रक्षा करती है।`,
      }
    : {
        valEn: 'Moderate vigilance advised during Rahu/Mars sub-periods; avoid night highway driving when fatigued',
        valHi: 'राहु/मंगल की अंतर्दशा में सामान्य सतर्कता अपेक्षित; थकान में रात्रि वाहन चालन से बचें',
        explEn: `8th lord in H${h8.lordHouse} suggests routine caution keeps physical safety intact.`,
        explHi: `अष्टमेश की स्थिति सामान्य सावधानी के साथ सुरक्षित जीवन दर्शाती है।`,
      };

  // 2. Crises
  const crises: BilingualPrediction =
    h8.tier === 'afflicted'
      ? {
          valEn: 'Significant transformative tests during Saturn/Rahu transits; builds deep psychological resilience and wisdom',
          valHi: 'शनि/राहु गोचर में जीवन के बड़े परीक्षा-काल; कठिन अनुभवों से जातक अत्यंत परिपक्व व मजबूत बनता है',
          explEn: `8th house (${h8.dominantGraha}) brings deep life resets that strip away illusions and forge inner strength.`,
          explHi: `अष्टम भाव के प्रभाव से आने वाले उतार-चढ़ाव जातक को जीवन का गहरा अनुभव और अडिग धैर्य देते हैं।`,
        }
      : {
          valEn: 'Manageable inflection phases around Saturn return (ages 29–30) and mid-life; navigated calmly with planning',
          valHi: '29-30 व 45-47 वर्ष के आसपास सामान्य जीवन-परिवर्तन काल; धैर्य व सूझबूझ से सहज पार',
          explEn: `Natural planetary cycles bring periodic course-corrections without catastrophic upheaval.`,
          explHi: `ग्रहों के स्वाभाविक चक्र समय-समय पर जीवन को नई दिशा और स्थिरता देते हैं।`,
        };

  // 3. Dreams & Fears (Moon + H12)
  const dreamMap: Record<GrahaKey, { en: string; hi: string }> = {
    Sun: { en: 'Dreams of mountains, authority, sunlight, or responsibility; underlying fear of losing dignity', hi: 'ऊंचे पर्वत, सूर्य या प्रतिष्ठा से जुड़े स्वप्न; मान-सम्मान में कमी का अवचेतन भय' },
    Moon: { en: 'Vivid dreams of rivers, oceans, family, or ancestral homes; emotional sensitivity to isolation', hi: 'नदी, जल, परिवार या पुराने घर के सजीव स्वप्न; अकेलेपन के प्रति भावनात्मक संवेदनशीलता' },
    Mars: { en: 'Action-packed or intense dreams of travel, conflict, or fire; restless energy during stress', hi: 'यात्रा, संघर्ष या ऊर्जा से भरपूर स्वप्न; तनाव के समय मन में उग्रता' },
    Mercury: { en: 'Fast-paced dreams involving conversations, exams, numbers, or unfinished tasks; mental overthinking', hi: 'संवाद, परीक्षा, यात्रा या अधूरे कार्यों के स्वप्न; विचारों की अधिकता से चिंता' },
    Jupiter: { en: 'Symbolic, peaceful dreams of temples, mentors, or scriptures; fear of moral compromise', hi: 'मंदिर, गुरुजन व शुभ प्रतीकों के शांत स्वप्न; धर्म व मर्यादा भंग होने का संकोच' },
    Venus: { en: 'Aesthetic dreams of beauty, music, gardens, or relationships; fear of disharmony', hi: 'सौंदर्य, संगीत, बाग-बगीचे व संबंधों के स्वप्न; पारिवारिक कलह से मन में असहजता' },
    Saturn: { en: 'Serious, realistic dreams of responsibility, climbing, or old places; deep fear of failure or scarcity', hi: 'परिश्रम, ऊंचाई पर चढ़ने या पुराने स्थानों के गंभीर स्वप्न; असफलता या अभाव का भय' },
    Rahu: { en: 'Unusual, futuristic, or vivid flying/foreign dreams; occasional anxiety over unknowns', hi: 'विचित्र, भविष्यवादी या अनजानी जगहों के गहरे स्वप्न; अज्ञात भविष्य को लेकर कभी-कभी चिंता' },
    Ketu: { en: 'Prophetic, spiritual, or ancestral dreams; deep longing for peace over worldly noise', hi: 'पूर्वानुमानित, आध्यात्मिक या पूर्वजों से जुड़े स्वप्न; सांसारिक शोर से वैराग्य भाव' },
  };
  const dBase = dreamMap[toGrahaKey(moon?.id === 'Moon' && h12.occupants.length > 0 ? h12.dominantGraha : moon?.id)];
  const dreams: BilingualPrediction = {
    valEn: dBase.en,
    valHi: dBase.hi,
    explEn: `Synthesized from Moon in House ${moon?.placedHouse} (${moon?.signName}) and 12th house (${h12.signName}, ${h12.dominantGraha}).`,
    explHi: `चंद्रमा (भाव ${moon?.placedHouse}) एवं द्वादश भाव (${h12.dominantGraha}) से अवचेतन मन, स्वप्न और आंतरिक भय का विश्लेषण होता है।`,
  };

  // 4. Romance & Discretion
  const hasAffairRisk = h12.occupants.some((p) => p.id === 'Rahu' || p.id === 'Venus') || (venus && [6, 8, 12].includes(venus.placedHouse));
  const romance: BilingualPrediction = hasAffairRisk
    ? {
        valEn: 'Strong romantic magnetism; conscious moral boundaries and transparency needed to avoid complicated attachments',
        valHi: 'प्रबल भावनात्मक आकर्षण; जटिल या गोपनीय संबंधों से बचने हेतु मर्यादा व पारदर्शिता अत्यंत आवश्यक',
        explEn: `Venus/12th axis activation increases romantic curiosity; fidelity and emotional honesty protect reputation.`,
        explHi: `शुक्र व द्वादश भाव की सक्रियता आकर्षण बढ़ाती है; नैतिक संयम से जीवन निष्कलंक रहता है।`,
      }
    : {
        valEn: 'Steady, dignified romantic temperament; values loyalty and avoids scandalous or impulsive entanglements',
        valHi: 'संयमित व मर्यादित प्रेम दृष्टिकोण; निष्ठा को प्राथमिकता तथा लोक-निंदा से पूर्ण बचाव',
        explEn: `Well-regulated Kama houses preserve personal dignity and faithful relationships.`,
        explHi: `शुक्र व सप्तम-द्वादश भावों का संतुलन जातक को मर्यादित और विश्वसनीय बनाए रखता है।`,
      };

  // 5. Occult Interest
  const occultPlanets = h8.occupants.some((p) => ['Ketu', 'Rahu', 'Saturn', 'Jupiter', 'Mercury'].includes(p.id)) || [8, 12].includes(h8.lordHouse);
  const occult: BilingualPrediction = occultPlanets
    ? {
        valEn: 'Strong natural curiosity in Jyotish, metaphysics, deep psychology, and hidden root causes of life',
        valHi: 'ज्योतिष, आध्यात्मिक रहस्य, गहन मनोविज्ञान व जीवन के गूढ़ सत्य जानने में स्वाभाविक रुचि',
        explEn: `Active 8th house (${h8.signName}, ${h8.dominantGraha}) draws the intellect toward mysteries beyond surface appearances.`,
        explHi: `अष्टम भाव की सक्रियता जातक को गूढ़ ज्ञान, ज्योतिष और मनोविज्ञान के प्रति आकर्षित करती है।`,
      }
    : {
        valEn: 'Practical, grounded mindset; respects traditional spirituality while prioritizing tangible real-world logic',
        valHi: 'व्यावहारिक व यथार्थवादी दृष्टिकोण; पारंपरिक आस्था का सम्मान किंतु तंत्र-मंत्र के बजाय कर्म को प्राथमिकता',
        explEn: `8th house remains calm, keeping focus on practical visible duties rather than esoteric pursuits.`,
        explHi: `अष्टम भाव के शांत रहने से जातक व्यावहारिक जीवन और प्रत्यक्ष प्रमाणों पर अधिक विश्वास करता है।`,
      };

  // 6. Secrets & Confidence
  const secrets: BilingualPrediction =
    h8.dominantGraha === 'Saturn' || h8.dominantGraha === 'Ketu' || h8.dominantGraha === 'Scorpio' as unknown as GrahaKey
      ? {
          valEn: 'Deeply private and guarded; keeps personal struggles and family confidences strictly confidential',
          valHi: 'अत्यंत गोपनीय व अंतर्मुखी स्वभाव; अपने निजी संघर्ष और परिवार के रहस्य किसी के सामने प्रकट नहीं करता',
          explEn: `8th house under ${h8.dominantGraha} creates a vault-like personality that rarely overshares.`,
          explHi: `अष्टम भाव पर ${h8.dominantGraha} का प्रभाव जातक को गंभीर व रहस्य गोपनीय रखने वाला बनाता है।`,
        }
      : {
          valEn: 'Trustworthy confidant for friends while maintaining selective discretion on personal finances and plans',
          valHi: 'मित्रों के रहस्यों का विश्वसनीय रक्षक; अपनी आर्थिक व भविष्य की योजनाओं में विवेकपूर्ण गोपनीयता',
          explEn: `Balanced 8th house (${h8.signName}) blends healthy openness with prudent privacy.`,
          explHi: `अष्टम भाव की संतुलित स्थिति जातक को विश्वसनीय व विवेकशील बनाती है।`,
        };

  // 7. Pets & Animals (H6)
  const petMap: Record<GrahaKey, { en: string; hi: string }> = {
    Sun: { en: 'Respects noble animals (horses, cows); feeding birds at sunrise brings mental clarity', hi: 'गाय व अश्व जैसे सात्विक पशुओं के प्रति सम्मान; प्रातः पक्षियों को दाना डालना शुभ' },
    Moon: { en: 'Gentle affinity for cats, rabbits, fish aquariums, or white cows; soothing emotional bond', hi: 'गाय, मछली, खरगोश या शांत पालतू जीवों से स्नेह; पशु सेवा से मानसिक शांति' },
    Mars: { en: 'Strong bond with loyal guard dogs; energetic connection with protective animals', hi: 'स्वामीभक्त श्वान (कुत्तों) के प्रति विशेष लगाव; पशु रक्षा में सक्रिय रुचि' },
    Mercury: { en: 'Fond of talking birds, parrots, or playful small pets; enjoys observing animal intelligence', hi: 'पक्षियों, तोते या चंचल छोटे पालतू जीवों से लगाव; प्रकृति से जुड़ाव' },
    Jupiter: { en: 'Reverence for cows and temple elephants; serving cows (Gau Seva) strongly uplifts fortune', hi: 'गौ-सेवा के प्रति विशेष श्रद्धा; गाय को गुड़-रोटी खिलाना भाग्योदयकारी' },
    Venus: { en: 'Loves graceful, well-groomed pets (cats, ornamental birds, dogs); aesthetic care for animals', hi: 'सुंदर व सजे-संवरे पालतू जीवों व पक्षियों से प्रेम; दयालु व्यवहार' },
    Saturn: { en: 'Compassionate toward stray dogs, crows, and injured animals; feeding strays removes karmic blocks', hi: 'बेसहारा श्वान, कौओं व घायल पशुओं के प्रति करुणा; काले कुत्ते को भोजन देना श्रेष्ठ उपाय' },
    Rahu: { en: 'Fascinated by exotic birds, fish, or unusual pets; feeding birds helps stabilize restlessness', hi: 'रंग-बिरंगी मछलियों या अनोखे पक्षियों में रुचि; पक्षियों को दाना डालना मानसिक शांति देता है' },
    Ketu: { en: 'Quiet empathy for street dogs and stray creatures; silent feeding acts as a potent spiritual remedy', hi: 'श्वान व मूक प्राणियों के प्रति गहरी करुणा; निःस्वार्थ पशु सेवा अत्यंत फलदायी' },
  };
  const pBase = petMap[h6.dominantGraha];
  const pets: BilingualPrediction = {
    valEn: pBase.en,
    valHi: pBase.hi,
    explEn: `6th house (${h6.signName}, driven by ${h6.dominantGraha}) governs domestic animals, pets, and seva.`,
    explHi: `षष्ठ भाव पर ${h6.dominantGraha} के प्रभाव से पालतू पशु-पक्षियों के प्रति लगाव व सेवा-भाव तय होता है।`,
  };

  return { accidents, crises, dreams, romance, occult, secrets, pets };
}

// ============================================================================
// PILLAR 9: PROPERTY, VEHICLES, SLEEP & MOKSHA
// ============================================================================
export function getPillar9AssetDetails(
  h4: HousePacProfile,
  h12: HousePacProfile,
  venus?: PlanetPos,
  moon?: PlanetPos,
  ketu?: PlanetPos
): {
  property: BilingualPrediction;
  vehicles: BilingualPrediction;
  sleep: BilingualPrediction;
  moksha: BilingualPrediction;
} {
  // 1. Property (H4)
  const property: BilingualPrediction =
    h4.tier === 'strong'
      ? {
          valEn: 'Own residential home and potential secondary real estate/land acquired comfortably by early-to-mid 30s',
          valHi: 'स्वयं का सुदृढ़ मकान व भू-संपत्ति का उत्तम योग; 30-35 वर्ष की आयु तक स्थायी गृह प्राप्ति',
          explEn: `Fortified 4th house (${h4.signName}, lord in H${h4.lordHouse}) grants stable immovable property.`,
          explHi: `चतुर्थ भाव की मजबूती जातक को जीवन में स्वयं का सुंदर आवास और भूमि सुख दिलाती है।`,
        }
      : h4.tier === 'afflicted'
      ? {
          valEn: 'Delayed property ownership or acquisition via long-term bank loans/EMIs; verify legal land deeds carefully',
          valHi: 'स्वयं के मकान में विलंब अथवा बैंक ऋण (EMI) द्वारा गृह प्राप्ति; संपत्ति दस्तावेजों की गहन जांच अनिवार्य',
          explEn: `Afflicted 4th house (${h4.dominantGraha}, lord in H${h4.lordHouse}) brings home ownership after sustained effort and careful paperwork.`,
          explHi: `चतुर्थ भाव पर संघर्ष के कारण पैतृक संपत्ति विवाद या ऋण के माध्यम से मकान बनने की संभावना रहती है।`,
        }
      : {
          valEn: 'Own residential flat or modest family home acquired steadily in mid-career through savings and structured EMI',
          valHi: 'करियर के मध्य चरण में बचत व सुव्यवस्थित ऋण के माध्यम से स्वयं का आरामदायक आवास',
          explEn: `Balanced 4th house supports practical, debt-manageable home ownership.`,
          explHi: `चतुर्थ भाव का संतुलित बल समय पर व्यावहारिक गृह सुख प्रदान करता है।`,
        };

  // 2. Vehicles (H4 & Venus)
  const vehicles: BilingualPrediction =
    h4.tier === 'strong' && venus?.dignity !== 'Debilitated'
      ? {
          valEn: 'Comfortable four-wheeler/SUV ownership with smooth upgrades; white, silver, or metallic shades suit well',
          valHi: 'उत्तम व आरामदायक चारपहिया वाहन का सुख; सफेद, सिल्वर या हल्के रंग के वाहन विशेष शुभ',
          explEn: `Strong 4th house and Venus bless the native with reliable, comfortable conveyances.`,
          explHi: `चतुर्थ भाव व शुक्र का शुभ योग वाहन सुख और सुरक्षित यात्रा प्रदान करता है।`,
        }
      : h4.tier === 'afflicted'
      ? {
          valEn: 'Practical, utility-focused vehicle ownership; regular maintenance and cautious driving prevent repair expenses',
          valHi: 'व्यावहारिक व उपयोगी वाहन सुख; समय पर रखरखाव और संयमित ड्राइविंग से वाहन व्यय नियंत्रित रहेगा',
          explEn: `Malefic aspect on 4th suggests choosing sturdy, reliable vehicles over flashy luxury models.`,
          explHi: `चतुर्थ भाव पर दबाव होने से दिखावे के बजाय टिकाऊ व सुरक्षित वाहन चुनना लाभकारी रहता है।`,
        }
      : {
          valEn: 'Steady personal vehicle progression (two-wheeler to reliable family car) matching career growth',
          valHi: 'करियर की प्रगति के साथ क्रमशः दुपहिया से विश्वसनीय पारिवारिक कार तक का स्वाभाविक वाहन सुख',
          explEn: `Moderate 4th/Venus axis grants dependable daily transportation without undue strain.`,
          explHi: `सामान्य वाहन योग जीवन की आवश्यकताओं के अनुरूप सुविधाजनक यातायात प्रदान करता है।`,
        };

  // 3. Sleep (H12 & Moon)
  const sleepAfflicted = h12.tier === 'afflicted' || moon?.placedHouse === 6 || moon?.placedHouse === 8 || moon?.placedHouse === 12;
  const sleep: BilingualPrediction = sleepAfflicted
    ? {
        valEn: 'Light, mind-active sleep; overthinking or late screens disturb rest — evening meditation restores deep calm',
        valHi: 'हल्की व विचारशील निद्रा; रात्रि में अधिक सोचने से नींद प्रभावित — संध्या ध्यान व शांत दिनचर्या लाभकारी',
        explEn: `12th house (${h12.dominantGraha}) or Moon sensitivity stimulates nocturnal thought; regular sleep hygiene is essential.`,
        explHi: `द्वादश भाव या चंद्रमा की संवेदनशीलता रात्रि में मन को सक्रिय रखती है; सोने से पूर्व स्क्रीन से दूरी लाभप्रद है।`,
      }
    : {
        valEn: 'Peaceful, restorative sleep once daily duties conclude; quiet bedroom environment preserves vitality',
        valHi: 'गहरी, शांत व स्फूर्तिदायक निद्रा; शांत शयन कक्ष व नियमित समय पर शयन स्वास्थ्यवर्धक',
        explEn: `Harmonious 12th house (Shayana) and Moon support deep physical and mental recuperation.`,
        explHi: `द्वादश भाव और चंद्रमा का संतुलन गहरी व विश्रामदायक नींद प्रदान करता है।`,
      };

  // 4. Moksha / Spiritual Path (H12 & Ketu)
  const moksha: BilingualPrediction =
    ketu?.placedHouse === 12 || ketu?.placedHouse === 9 || h12.dominantGraha === 'Jupiter' || h12.dominantGraha === 'Ketu'
      ? {
          valEn: 'Strong Moksha-orientation: Contemplative wisdom and natural spiritual detachment deepen in mature years',
          valHi: 'प्रबल मोक्ष-प्रवृत्ति: उत्तरार्ध में आध्यात्मिक चिंतन, ध्यान व वैराग्य भाव में गहन परिपक्वता',
          explEn: `Ketu/Jupiter influence on the 12th/9th axis turns the soul naturally toward self-realization.`,
          explHi: `द्वादश/नवम भाव पर केतु या गुरु का प्रभाव आत्म-चिंतन और मोक्ष मार्ग की ओर अग्रसर करता है।`,
        }
      : {
          valEn: 'Karma-Yoga path: Achieves spiritual fulfillment through honest family duty, charity, and selfless service',
          valHi: 'कर्म-योग मार्ग: निष्ठापूर्वक गृहस्थ धर्म, दान व समाज सेवा के माध्यम से आध्यात्मिक उन्नति',
          explEn: `12th house (${h12.signName}) channels spiritual growth through ethical worldly action rather than renunciation.`,
          explHi: `द्वादश भाव की स्थिति दर्शाती है कि जातक अपने कर्तव्यों का ईमानदारी से पालन करते हुए सद्गति प्राप्त करता है।`,
        };

  return { property, vehicles, sleep, moksha };
}

// ============================================================================
// PILLAR 10 & 11: PAST LIFE, KARMIC DEBT, KULADEVATA & MANTRA
// ============================================================================
export function getPastLifeAndSpiritualDetails(
  akPlanet: string,
  h2: HousePacProfile,
  h9: HousePacProfile,
  rahu?: PlanetPos,
  ketu?: PlanetPos,
  lagnaLordId?: string
): {
  purpose: BilingualPrediction;
  debt: BilingualPrediction;
  kuladevata: BilingualPrediction;
  mantra: BilingualPrediction;
} {
  const purposeMap: Record<string, { en: string; hi: string }> = {
    Sun: { en: 'Developing humble leadership, integrity, and serving society without ego-driven pride', hi: 'अहंकार त्यागकर विनम्र नेतृत्व, सत्यनिष्ठा व समाज सेवा का विकास करना' },
    Moon: { en: 'Cultivating emotional resilience, nurturing others, and balancing deep sensitivity', hi: 'भावनात्मक संतुलन, करुणा और परिवार के प्रति निस्वार्थ सेवा भाव जगाना' },
    Mars: { en: 'Channeling raw courage into protection, righteous discipline, and constructive action', hi: 'साहस व ऊर्जा को क्रोध के बजाय रक्षा, अनुशासन व रचनात्मक निर्माण में लगाना' },
    Mercury: { en: 'Speaking truth with clarity, sharing analytical knowledge, and avoiding manipulative cleverness', hi: 'सत्य व स्पष्ट वाणी का प्रयोग, ज्ञान बांटना और छल-कपट से दूर रहना' },
    Jupiter: { en: 'Upholding dharma, mentoring youth, and sharing wisdom with humility and compassion', hi: 'धर्म की रक्षा, योग्य मार्गदर्शन व विनम्रतापूर्वक ज्ञान का प्रसार करना' },
    Venus: { en: 'Refining love from sensory attachment into unconditional devotion, grace, and harmony', hi: 'भौतिक आसक्ति से ऊपर उठकर शुद्ध प्रेम, कला व सौहार्द की स्थापना करना' },
    Saturn: { en: 'Practicing patience, enduring duty without bitterness, and serving the underprivileged', hi: 'धैर्य, निरंतर कर्तव्यनिष्ठा और श्रमिक व असहाय वर्ग की निस्वार्थ सेवा' },
    Rahu: { en: 'Navigating modern ambition ethically without falling prey to illusion or shortcuts', hi: 'आधुनिक महत्वाकांक्षाओं को नैतिकता के साथ पूर्ण करना व भ्रम से बचना' },
    Ketu: { en: 'Synthesizing worldly responsibility with deep inner detachment and spiritual insight', hi: 'सांसारिक दायित्वों को निभाते हुए आंतरिक वैराग्य और आत्मज्ञान प्राप्त करना' },
  };
  const pEntry = purposeMap[akPlanet] || purposeMap.Jupiter;
  const purpose: BilingualPrediction = {
    valEn: pEntry.en,
    valHi: pEntry.hi,
    explEn: `Atmakaraka (${akPlanet}) reveals the soul’s primary evolutionary lesson in this incarnation (Jaimini Sutras).`,
    explHi: `आत्मकारक ग्रह (${akPlanet}) इस जन्म में आत्मा के मुख्य कर्मिक उद्देश्य और सुधार के क्षेत्र को दर्शाता है।`,
  };

  // Karmic Debt (Rina) based on Rahu/Ketu axis & H9
  const rahuHouse = rahu?.placedHouse ?? 1;
  let debt: BilingualPrediction;
  if ([1, 5, 9].includes(rahuHouse) || h9.tier === 'afflicted') {
    debt = {
      valEn: 'Pitru & Guru Rina prominent; harmonized through honoring elders, charity to teachers, and ancestral Shraddha',
      valHi: 'पितृ एवं गुरु ऋण प्रमुख; बड़ों का सम्मान, गुरुजनों की सेवा व पितृ तर्पण से शीघ्र ऋण-मुक्ति',
      explEn: `Rahu/Ketu along the Dharma/Trikona axis (Rahu in H${rahuHouse}) highlights ancestral and mentor obligations.`,
      explHi: `धर्म त्रिकोण (भाव ${rahuHouse}) में राहु-केतु की स्थिति पितृ व गुरु ऋण के प्रति सचेत करती है।`,
    };
  } else if ([4, 7, 10].includes(rahuHouse)) {
    debt = {
      valEn: 'Matru & Kutumba Rina active; balanced by caring for mother, family harmony, and honest service',
      valHi: 'मातृ व कुटुंब ऋण सक्रिय; माता की सेवा, गृह-शांति व ईमानदारी से आजीविका निभाने से मुक्ति',
      explEn: `Nodal axis across Kendras (Rahu in H${rahuHouse}, Ketu in H${ketu?.placedHouse}) focuses karmic dues on domestic duty.`,
      explHi: `केंद्र भावों में राहु-केतु का अक्ष पारिवारिक व मातृ दायित्वों के निष्ठापूर्ण निर्वहन की ओर संकेत करता है।`,
    };
  } else {
    debt = {
      valEn: 'Sadharan Karmic Rina; easily balanced through regular charity (Anna Daan), animal feeding, and truthfulness',
      valHi: 'सामान्य कर्मिक ऋण; नियमित अन्नदान, मूक प्राणियों को भोजन व सत्य आचरण से सहज संतुलन',
      explEn: `Nodal placement in Upachaya/Dusthana houses (H${rahuHouse}) clears past debts through steady daily service.`,
      explHi: `राहु की भाव ${rahuHouse} में स्थिति नित्य सेवा और परोपकार द्वारा पूर्व संचित कर्मों को शुद्ध करती है।`,
    };
  }

  // Kuladevata / Kuladevi from 2nd/4th/9th lord
  const kulaMap: Record<GrahaKey, { en: string; hi: string }> = {
    Sun: { en: 'Surya Narayana / Maa Gayatri / Ancestral Kuladevata Shiva', hi: 'भगवान सूर्य नारायण / माता गायत्री / कुलदेव महादेव' },
    Moon: { en: 'Maa Parvati / Maa Annapurna / Lord Krishna (Kuladevi Grace)', hi: 'माता पार्वती / माँ अन्नपूर्णा / भगवान श्रीकृष्ण' },
    Mars: { en: 'Maa Durga (Chamunda) / Lord Hanuman / Lord Kartikeya', hi: 'माँ दुर्गा (चामुंडा रूप) / श्री हनुमान जी / भगवान कार्तिकेय' },
    Mercury: { en: 'Lord Vishnu / Maa Tripurasundari / Kuladevi Saraswati', hi: 'भगवान श्रीहरि विष्णु / माँ त्रिपुरसुंदरी / कुलदेवी सरस्वती' },
    Jupiter: { en: 'Lord Dattatreya / Maa Mahalakshmi / Kulaguru Brihaspati', hi: 'भगवान दत्तात्रेय / माँ महालक्ष्मी / कुलगुरु बृहस्पति' },
    Venus: { en: 'Maa Mahalakshmi / Maa Bhavani / Kuladevi Santoshi', hi: 'माँ महालक्ष्मी / माँ भवानी / कुलदेवी शक्ति स्वरूप' },
    Saturn: { en: 'Lord Bhairava / Maa Kali / Lord Hanuman (Protective Shield)', hi: 'श्री काल भैरव / माँ काली / संकटमोचन हनुमान जी' },
    Rahu: { en: 'Maa Durga / Maa Saraswati / Naga Devata (Ancestral Shield)', hi: 'माँ दुर्गा / माँ सरस्वती / कुल-रक्षक नाग देवता' },
    Ketu: { en: 'Lord Ganesha / Lord Shiva / Maa Dhumavati (Moksha Shield)', hi: 'श्री गणेश जी / भगवान शिव / कुल-रक्षक सिद्ध शक्ति' },
  };
  const kulaPlanet = h2.occupants.length > 0 ? h2.dominantGraha : h2.lordId;
  const kEntry = kulaMap[kulaPlanet];
  const kuladevata: BilingualPrediction = {
    valEn: kEntry.en,
    valHi: kEntry.hi,
    explEn: `2nd house (Kutumba / Lineage Tradition: ${h2.signName}, driven by ${kulaPlanet}) reveals the ancestral family deity form.`,
    explHi: `द्वितीय भाव (कुल परंपरा) पर ${kulaPlanet} के प्रभाव से कुलदेवता/कुलदेवी के पूजन स्वरूप का संकेत मिलता है।`,
  };

  // Mantra & Kavacha from Lagna Lord
  const mantraMap: Record<string, { en: string; hi: string }> = {
    Sun: { en: 'Mantra: "Om Ghrini Suryaya Namah" or Aditya Hridayam; Shield: Gayatri Kavach', hi: 'मंत्र: "ॐ घृणि सूर्याय नमः" अथवा आदित्य हृदय स्तोत्र; रक्षा: गायत्री कवच' },
    Moon: { en: 'Mantra: "Om Som Somaya Namah" or "Om Namah Shivaya"; Shield: Devi Kavach', hi: 'मंत्र: "ॐ सों सोमाय नमः" अथवा "ॐ नमः शिवाय"; रक्षा: देवी कवच' },
    Mars: { en: 'Mantra: "Om Ang Angarakaya Namah" or Hanuman Chalisa; Shield: Ram Raksha Stotra', hi: 'मंत्र: "ॐ अं अंगारकाय नमः" अथवा हनुमान चालीसा; रक्षा: राम रक्षा स्तोत्र' },
    Mercury: { en: 'Mantra: "Om Namo Bhagavate Vasudevaya"; Shield: Vishnu Sahasranama / Narayana Kavach', hi: 'मंत्र: "ॐ नमो भगवते वासुदेवाय"; रक्षा: विष्णु सहस्रनाम / नारायण कवच' },
    Jupiter: { en: 'Mantra: "Om Brim Brihaspataye Namah" or "Om Namo Narayanaya"; Shield: Guru Kavach', hi: 'मंत्र: "ॐ बृं बृहस्पतये नमः" अथवा "ॐ नमो नारायणाय"; रक्षा: गुरु कवच' },
    Venus: { en: 'Mantra: "Om Shum Shukraya Namah" or Sri Suktam; Shield: Durga Saptashati Argala', hi: 'मंत्र: "ॐ शुं शुक्राय नमः" अथवा श्री सूक्त; रक्षा: दुर्गा कवच' },
    Saturn: { en: 'Mantra: "Om Sham Shanicharaya Namah" or Maha Mrityunjaya; Shield: Hanuman Bahuk', hi: 'मंत्र: "ॐ शं शनैश्चराय नमः" अथवा महामृत्युंजय मंत्र; रक्षा: बजरंग बाण / शिव कवच' },
  };
  const mEntry = mantraMap[lagnaLordId || 'Jupiter'] || mantraMap.Jupiter;
  const mantra: BilingualPrediction = {
    valEn: mEntry.en,
    valHi: mEntry.hi,
    explEn: `Personalized to your Lagna Lord (${lagnaLordId}) for mental clarity, protection, and spiritual resonance.`,
    explHi: `आपके लग्नेश (${lagnaLordId}) के अनुसार यह मंत्र व कवच मानसिक शांति और जीवन रक्षा के लिए सर्वोत्तम है।`,
  };

  return { purpose, debt, kuladevata, mantra };
}

// ============================================================================
// COMPREHENSIVE 4-LAYER SANTAN YOG, D7 SAPTAMSHA & BEEJA/KSHETRA SPHUTA ENGINE
// ============================================================================
export interface ComprehensiveSantanResult {
  d7Confirmation: BilingualPrediction & { pacEn: string; pacHi: string };
  beejaKshetraSphuta: BilingualPrediction & { pacEn: string; pacHi: string };
  badhaAndRemedies: BilingualPrediction & { pacEn: string; pacHi: string };
}

export function getComprehensiveSantanAnalysis(
  h5: HousePacProfile,
  h9: HousePacProfile,
  planets: PlanetPos[],
  d7?: { lagnaSignIndex: number; placements: Array<{ id: string; signIndex: number; houseFromVargaLagna: number }> },
  jupiterBav?: number[]
): ComprehensiveSantanResult {
  const sun = planets.find((p) => p.id === 'Sun');
  const moon = planets.find((p) => p.id === 'Moon');
  const mars = planets.find((p) => p.id === 'Mars');
  const jupiter = planets.find((p) => p.id === 'Jupiter');
  const venus = planets.find((p) => p.id === 'Venus');
  const rahu = planets.find((p) => p.id === 'Rahu');
  const ketu = planets.find((p) => p.id === 'Ketu');
  const saturn = planets.find((p) => p.id === 'Saturn');

  // 1. D7 Saptamsha Confirmation & Jupiter BAV Bindus (5th from Jupiter)
  const d7LagnaIdx = d7?.lagnaSignIndex ?? h5.signIdx;
  const d7LagnaSign = SIGNS[d7LagnaIdx] || SIGNS[0];
  const d7LagnaLordPlanet = planets.find((p) => p.id === d7LagnaSign.lord);
  const d7LagnaLordStrong =
    d7LagnaLordPlanet &&
    ([1, 4, 5, 7, 9, 10, 11].includes(d7LagnaLordPlanet.placedHouse) ||
      d7LagnaLordPlanet.dignity === 'Exalted' ||
      d7LagnaLordPlanet.dignity === 'Own Sign');

  const d7H5Planets = (d7?.placements || []).filter((p) => p.houseFromVargaLagna === 5);
  const d7Jup = (d7?.placements || []).find((p) => p.id === 'Jupiter');
  const d7HasBeneficIn5 = d7H5Planets.some((p) => ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(p.id));
  const d7HasMaleficIn5 = d7H5Planets.some((p) => ['Saturn', 'Rahu', 'Ketu', 'Mars'].includes(p.id));

  // Jupiter BAV in 5th from Jupiter
  const fifthFromJupSignIdx = jupiter ? (jupiter.signIndex + 4) % 12 : h5.signIdx;
  const jupBavBindus = jupiterBav ? jupiterBav[fifthFromJupSignIdx] ?? 4 : 4;

  // Karako Bhava Nashaya check (Jupiter sitting in 5th alone)
  const karakoBhavaNashaya = jupiter?.placedHouse === 5 && h5.occupants.length === 1;

  const d1Supportive = h5.tier === 'strong' || (h5.tier === 'moderate' && !karakoBhavaNashaya);
  const d7Supportive = Boolean(d7LagnaLordStrong && !d7HasMaleficIn5) || d7HasBeneficIn5;

  let d7ValEn: string;
  let d7ValHi: string;
  let d7ExplEn: string;
  let d7ExplHi: string;

  if (d1Supportive && d7Supportive) {
    d7ValEn = `D1 & D7 Agree — Firm Santan Yog (${jupBavBindus} BAV bindus in 5th from Guru); D7 Lagna ${d7LagnaSign.name} confirms natural progeny promise`;
    d7ValHi = `D1 व सप्तांश D7 में पूर्ण सहमति — सुदृढ़ संतान योग (गुरु से पंचम में ${jupBavBindus} अष्टकवर्ग बिंदु); D7 लग्न ${d7LagnaSign.name} संतति सुख की पुष्टि करता है`;
    d7ExplEn = `All four classical layers align: D1 5th house (${h5.signName}), 5th lord in H${h5.lordHouse}, Putrakaraka Jupiter (${jupBavBindus} bindus in 5th from Guru), and Saptamsha D7 (${d7LagnaSign.name}, D7 Jupiter in H${d7Jup?.houseFromVargaLagna ?? 1}). Note: Both partners' charts should be read together.`;
    d7ExplHi = `ज्योतिष के चारों स्तर — जन्म कुंडली पंचम भाव, पंचमेश, पुत्रकारक गुरु (गुरु से पंचम में ${jupBavBindus} बिंदु) एवं सप्तांश D7 — परस्पर सहमत हैं। विवाह उपरांत दोनों जीवनसाथियों की कुंडली मिलाकर अंतिम समय देखा जाता है।`;
  } else if (d1Supportive !== d7Supportive) {
    d7ValEn = `Mixed D1 vs D7 Signals (${jupBavBindus} BAV bindus in 5th from Guru) — Running Mahadasha/Antardasha & partner’s chart decide timing`;
    d7ValHi = `D1 व सप्तांश D7 में मिश्रित संकेत (गुरु से पंचम में ${jupBavBindus} बिंदु) — चल रही दशा व जीवनसाथी की कुंडली निर्णायक रहेगी`;
    d7ExplEn = `Birth chart D1 and Saptamsha D7 diverge slightly (D7 divides each sign into 7 parts and is highly sensitive to exact birth-minute accuracy). Because they are mixed, favorable Vimshottari Dasha periods and Guru Gochar hold the decisive key.`;
    d7ExplHi = `जन्म लग्न और सप्तांश D7 में आंशिक अंतर होने पर फलित को एकतरफा नहीं कहा जा सकता। सप्तांश जन्म समय के प्रति अत्यंत संवेदनशील होता है; ऐसी स्थिति में शुभ दशा व गुरु गोचर संतान सुख प्रदान करते हैं।`;
  } else {
    d7ValEn = `Santan Badha Indicators in D1 & D7 (${jupBavBindus} BAV bindus in 5th from Guru) — Indicates delay or obstruction rather than absolute denial`;
    d7ValHi = `D1 व D7 दोनों में संतान बाधा के संकेत (गुरु से पंचम में ${jupBavBindus} बिंदु) — यह विलंब या कठिनाई का सूचक है, पूर्ण निषेध नहीं`;
    d7ExplEn = `Both D1 5th axis (${h5.dominantGraha}) and D7 (${d7LagnaSign.name}) ask for closer care. Classical Jyotish stresses that delay is not denial; targeted planetary remedies alongside timely medical fertility consultation bring positive outcomes.`;
    d7ExplHi = `D1 व सप्तांश दोनों में बाधा कारक ग्रहों का प्रभाव होने पर इसे अवरोध या विलंब समझना चाहिए, निराशा नहीं। सही समय पर चिकित्सीय परामर्श और शास्त्रीय उपायों से बाधा दूर होती है।`;
  }

  // 2. Real Beeja Sphuta (Male: Sun + Venus + Jupiter) & Kshetra Sphuta (Female: Moon + Mars + Jupiter)
  const beejaLon = (((sun?.longitude ?? 0) + (venus?.longitude ?? 0) + (jupiter?.longitude ?? 0)) % 360 + 360) % 360;
  const beejaSignIdx = Math.floor(beejaLon / 30);
  const beejaNavIdx = Math.floor((beejaLon % 30) / (30 / 9));
  const beejaSignOdd = beejaSignIdx % 2 === 0; // 0=Aries(Odd), 1=Taurus(Even)
  const beejaNavOdd = beejaNavIdx % 2 === 0;
  const beejaStrength = beejaSignOdd && beejaNavOdd ? 'Strong (Odd-Odd)' : beejaSignOdd || beejaNavOdd ? 'Moderate (Mixed)' : 'Sensitive (Even-Even)';

  const kshetraLon = (((moon?.longitude ?? 0) + (mars?.longitude ?? 0) + (jupiter?.longitude ?? 0)) % 360 + 360) % 360;
  const kshetraSignIdx = Math.floor(kshetraLon / 30);
  const kshetraNavIdx = Math.floor((kshetraLon % 30) / (30 / 9));
  const kshetraSignEven = kshetraSignIdx % 2 === 1;
  const kshetraNavEven = kshetraNavIdx % 2 === 1;
  const kshetraStrength = kshetraSignEven && kshetraNavEven ? 'Strong (Even-Even)' : kshetraSignEven || kshetraNavEven ? 'Moderate (Mixed)' : 'Sensitive (Odd-Odd)';

  const isAdoptionYoga = h5.lordHouse === 6 || (h5.occupants.length >= 4 && h5.lordHouse === 12);
  let beejaValEn: string;
  let beejaValHi: string;
  if (isAdoptionYoga) {
    beejaValEn = `Adoption (Dattaka) / Assisted Conception (IVF) yoga noted (5th lord in H${h5.lordHouse}); Beeja: ${beejaStrength} | Kshetra: ${kshetraStrength}`;
    beejaValHi = `दत्तक संतान अथवा आधुनिक चिकित्सीय सहायता (IVF/ART) से संतान सुख का विशेष योग (पंचमेश भाव ${h5.lordHouse} में); बीज: ${beejaStrength} | क्षेत्र: ${kshetraStrength}`;
  } else if (h5.occupants.some((p) => p.id === 'Rahu' || p.id === 'Mars')) {
    beejaValEn = `Pitta/Rahu sensitivity in early conception (Beeja: ${beejaStrength} | Kshetra: ${kshetraStrength}); regular medical prenatal monitoring strongly advised`;
    beejaValHi = `प्रारंभिक गर्भ में पित्त/राहु संवेदनशीलता (बीज: ${beejaStrength} | क्षेत्र: ${kshetraStrength}); नियमित चिकित्सकीय निगरानी व शीतल सात्विक आहार आवश्यक`;
  } else if (beejaStrength.startsWith('Sensitive') || kshetraStrength.startsWith('Sensitive')) {
    beejaValEn = `Mixed Beeja/Kshetra Sphuta (${beejaStrength} | Kshetra: ${kshetraStrength}); consult a fertility specialist alongside Vedic observances if trying 12+ months`;
    beejaValHi = `मिश्रित बीज/क्षेत्र स्फुट (${beejaStrength} | क्षेत्र: ${kshetraStrength}); १ वर्ष से अधिक प्रयास पर योग्य चिकित्सक से परामर्श व शास्त्रीय उपाय साथ-साथ करें`;
  } else {
    beejaValEn = `Natural conception supported — Beeja Sphuta: ${beejaStrength} (${SIGNS[beejaSignIdx].name}); Kshetra Sphuta: ${kshetraStrength} (${SIGNS[kshetraSignIdx].name})`;
    beejaValHi = `प्राकृतिक गर्भधारण अनुकूल — बीज स्फुट: ${beejaStrength} (${SIGNS[beejaSignIdx].name}); क्षेत्र स्फुट: ${kshetraStrength} (${SIGNS[kshetraSignIdx].name})`;
  }

  // 3. Exact Blocking Graha Diagnosis & Classical Remedies (from BPHS / Phaladeepika / Tradition)
  let blockingGraha: GrahaKey = h5.dominantGraha;
  if (rahu && (rahu.placedHouse === 5 || rahu.placedHouse === 9)) blockingGraha = 'Rahu';
  else if (saturn && (saturn.placedHouse === 5 || h5.aspectors.some((p) => p.id === 'Saturn'))) blockingGraha = 'Saturn';
  else if (ketu && ketu.placedHouse === 5) blockingGraha = 'Ketu';
  else if (mars && mars.placedHouse === 5) blockingGraha = 'Mars';
  else if (sun && sun.placedHouse === 5 && sun.dignity === 'Debilitated') blockingGraha = 'Sun';
  else if (karakoBhavaNashaya) blockingGraha = 'Jupiter';

  const remedyMap: Record<GrahaKey, { valEn: string; valHi: string; explEn: string; explHi: string }> = {
    Sun: {
      valEn: 'Pitru Pida indicator: Offer daily Surya Arghya in copper, listen to Harivamsha Purana, and perform ancestral Tarpan / Pind Daan',
      valHi: 'पितृ पीड़ा संकेत: ताम्र पात्र से नित्य सूर्य अर्घ्य, हरिवंश पुराण श्रवण, गायत्री जप एवं गयाजी/पुष्कर में पितृ तर्पण व पिंड दान करें',
      explEn: 'Sun obstructing the 5th/9th axis points to Pitru Rina. Ancestral Shraddh and Sunday wheat/jaggery charity pacify solar heat.',
      explHi: 'सूर्य द्वारा पंचम/नवम में बाधा होने पर पितृ शांति, रविवार को गेहूं-गुड़ दान व सूर्य मंत्र लाभकारी होते हैं।',
    },
    Moon: {
      valEn: 'Matru / Devi pacification: Recite Gayatri Mantra, observe salt-free Monday fasts, and donate rice, milk, or white cloth',
      valHi: 'मातृ/देवी कृपा उपाय: सोमवार को नमक रहित व्रत, गायत्री जप, माँ दुर्गा आराधना एवं चावल, दूध व श्वेत वस्त्र का दान करें',
      explEn: 'Moon sensitivity benefits from Monday fasting, emotional calm, and Devi worship alongside medical care.',
      explHi: 'चंद्र जनित बाधा में सोमवार व्रत व चंद्र मंत्र से मानसिक शांति एवं संतति सुख में सहायता मिलती है।',
    },
    Mars: {
      valEn: 'Bhratru / Kuja pacification: Recite Ramayana / Hanuman Chalisa, observe Pradosh Vrat, and donate red masoor dal or jaggery on Tuesdays',
      valHi: 'भौम बाधा निवारण: प्रदोष व्रत, श्री रामायण/हनुमान चालीसा पाठ एवं मंगलवार को गुड़ व मसूर दाल का दान करें',
      explEn: 'Martian heat in Putra Bhava is cooled by Ganapati/Hanuman devotion and Tuesday charity.',
      explHi: 'मंगल के उग्र प्रभाव को शांत करने के लिए श्री गणेश व हनुमान उपासना अत्यंत फलदायी है।',
    },
    Mercury: {
      valEn: 'Vishnu & Tulsi Upasana: Recite Vishnu Sahasranama, water and light a lamp near Tulsi daily, and donate green moong on Wednesdays',
      valHi: 'विष्णु-तुलसी उपासना: विष्णु सहस्रनाम पाठ, नित्य तुलसी को जल व दीप दान तथा बुधवार को साबुत मूंग का दान करें',
      explEn: 'Mercury influencing 5th responds gracefully to Lord Vishnu’s worship and Wednesday charity.',
      explHi: 'बुध की शांति हेतु विष्णु पुराण श्रवण व तुलसी सेवा श्रेष्ठ शास्त्रीय उपाय है।',
    },
    Jupiter: {
      valEn: 'Guru & Santan Gopal Upasana: Chant "Om Gram Greem Graum Sah Gurave Namah" on Thursdays, worship Bal Gopal, and keep Putrada Ekadashi',
      valHi: 'गुरु व संतान गोपाल उपासना: गुरुवार को "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः" जप, बाल गोपाल (तुलसी-मिश्री) पूजा व पुत्रदा एकादशी व्रत रखें',
      explEn: 'Since Jupiter is Putrakaraka (and can delay when sitting alone in 5th), Thursday yellow donations (chana dal, turmeric) and Santan Gopal Stotra are supreme.',
      explHi: 'पुत्रकारक गुरु के बल संवर्धन हेतु गुरुवार को चना दाल व हल्दी दान, फलदार वृक्ष लगाना तथा संतान गोपाल स्तोत्र का पाठ सर्वोत्तम है।',
    },
    Venus: {
      valEn: 'Shukra & Gau-Seva: Serve cows (Gau Seva), offer white sweets/curd on Fridays, and honor married women (Suhagin) respectfully',
      valHi: 'शुक्र व गौ-सेवा उपाय: शुक्रवार व्रत, गौ-सेवा (हरा चारा/गुड़), श्वेत वस्त्र-चावल दान व सुहागिन स्त्रियों का सम्मान करें',
      explEn: 'Venusian challenges in the 5th are harmonized through Friday fasting, charity, and nurturing respect.',
      explHi: 'शुक्र संबंधी बाधा में गौ-दान/गौ-सेवा तथा शुक्रवार के सात्विक दान से शुभ फल प्राप्त होते हैं।',
    },
    Saturn: {
      valEn: 'Shani Delay Pacification: Plant Peepal trees, recite Dasharath Krit Shani Stotra & Hanuman Chalisa, and perform Rudrabhisheka on Saturdays',
      valHi: 'शनि विलंब शमन: पीपल वृक्षारोपण, दशरथ कृत शनि स्तोत्र व हनुमान चालीसा पाठ, रुद्राभिषेक तथा शनिवार को काले तिल-तेल का दान करें',
      explEn: 'Saturn delays more often than it denies. Patience, Peepal care, and Rudrabhisheka unlock mature-age progeny.',
      explHi: 'शनि संतान को रोकता नहीं बल्कि विलंब करता है। पीपल सेवा व शिव आराधना से विलंब समाप्त होता है।',
    },
    Rahu: {
      valEn: 'Sarpa / Pitru Pacification: Perform Nag Puja on Nag Panchami, feed fish, recite Santan Gopal Stotra, and donate saptadhanya on Saturdays',
      valHi: 'सर्प/राहु शांति उपाय: नाग पंचमी पर नाग पूजन, मछलियों को आटा/चारा खिलाना, संतान गोपाल स्तोत्र व शनिवार को सतनाजा दान करें',
      explEn: 'Rahu in the 5th/9th axis calls for ancestral/Sarpa pacification alongside modern prenatal medical care.',
      explHi: 'राहु जनित संतान बाधा में पितृ/नाग शांति के साथ-साथ नियमित चिकित्सीय देखभाल रखना अनिवार्य है।',
    },
    Ketu: {
      valEn: 'Ganapati & Brahmin Seva: Offer Durva grass to Lord Ganesha, recite Santan Ganapati Stotra (11x daily), and donate saptadhanya & coconut',
      valHi: 'संतान गणपति प्रयोग: श्री गणेश जी को दूर्वा अर्पण, नित्य संतान गणपति स्तोत्र का पाठ एवं सतनाजा व नारियल का दान करें',
      explEn: 'Ketu’s detachment in 5th softens with Ganesha worship, charity to scholars, and Putrada Ekadashi observance.',
      explHi: 'केतु की बाधा में श्री गणेश जी की आराधना और सतनाजा दान से संतान सुख का मार्ग प्रशस्त होता है।',
    },
  };

  const rem = remedyMap[blockingGraha];

  return {
    d7Confirmation: {
      valEn: d7ValEn,
      valHi: d7ValHi,
      explEn: d7ExplEn,
      explHi: d7ExplHi,
      pacEn: `D1 H5: ${h5.signName} (Lord in H${h5.lordHouse}); D7 Lagna: ${d7LagnaSign.name}; 5th from Guru BAV: ${jupBavBindus} bindus.`,
      pacHi: `D1 पंचम: ${h5.signName} (भावेश भाव ${h5.lordHouse}); D7 लग्न: ${d7LagnaSign.name}; गुरु से पंचम अष्टकवर्ग: ${jupBavBindus} बिंदु।`,
    },
    beejaKshetraSphuta: {
      valEn: beejaValEn,
      valHi: beejaValHi,
      explEn: 'Calculated from exact sidereal longitudes of Sun+Venus+Jupiter (Beeja) and Moon+Mars+Jupiter (Kshetra) with Navamsha parity. Astrology shows tendency and timing — never replaces medical diagnosis.',
      explHi: 'सूर्य+शुक्र+गुरु (बीज स्फुट) एवं चंद्र+मंगल+गुरु (क्षेत्र स्फुट) के वास्तविक अंश व नवांश से गणना। ज्योतिष केवल प्रवृत्ति व समय बताता है; आवश्यकता होने पर योग्य चिकित्सक से परामर्श अवश्य लें।',
      pacEn: `Beeja Lon: ${beejaLon.toFixed(1)}° (${SIGNS[beejaSignIdx].name}); Kshetra Lon: ${kshetraLon.toFixed(1)}° (${SIGNS[kshetraSignIdx].name}).`,
      pacHi: `बीज स्फुट: ${beejaLon.toFixed(1)}° (${SIGNS[beejaSignIdx].name}); क्षेत्र स्फुट: ${kshetraLon.toFixed(1)}° (${SIGNS[kshetraSignIdx].name})।`,
    },
    badhaAndRemedies: {
      valEn: rem.valEn,
      valHi: rem.valHi,
      explEn: `${rem.explEn} Consult gemstones (such as Pukhraj) only after verifying Lagna suitability; keep medical care and spiritual observances side by side.`,
      explHi: `${rem.explHi} पुखराज आदि रत्न बिना विशेषज्ञ परामर्श के धारण न करें। चिकित्सीय उपचार और शास्त्रीय उपाय साथ-साथ जारी रखें।`,
      pacEn: `Primary Indicator: ${blockingGraha} on 5th/9th axis (${h5.signName}).`,
      pacHi: `मुख्य विचारणीय ग्रह: ${blockingGraha} (पंचम/नवम अक्ष पर प्रभाव)।`,
    },
  };
}

// ============================================================================
// COMPREHENSIVE MARRIAGE ASTROLOGY ENGINE (Venus, Mercury, Jupiter, D9, Timing)
// ============================================================================
export interface ComprehensiveMarriageResult {
  luckAndDevotion: BilingualPrediction & { pacEn: string; pacHi: string };
  timingTriggers: BilingualPrediction & { pacEn: string; pacHi: string };
  spouseTemperament: { en: string; hi: string };
  inLawsWealthBonus: { en: string; hi: string };
  unconventionalOrLoveNote: { isLove: boolean; isIntercaste: boolean; en: string; hi: string };
  venusCombust: boolean;
  malefics4812FromVenus: number;
  delayFactors: string[];
  separationRiskCount: number;
}

export function getComprehensiveMarriageAnalysis(
  h1: HousePacProfile,
  h2: HousePacProfile,
  h4: HousePacProfile,
  h5: HousePacProfile,
  h7: HousePacProfile,
  h8: HousePacProfile,
  planets: PlanetPos[],
  d9?: { lagnaSignIndex: number; placements: Array<{ id: string; signIndex: number; houseFromVargaLagna: number }> }
): ComprehensiveMarriageResult {
  const sun = planets.find((p) => p.id === 'Sun');
  const moon = planets.find((p) => p.id === 'Moon');
  const mars = planets.find((p) => p.id === 'Mars');
  const mercury = planets.find((p) => p.id === 'Mercury');
  const jupiter = planets.find((p) => p.id === 'Jupiter');
  const venus = planets.find((p) => p.id === 'Venus');
  const saturn = planets.find((p) => p.id === 'Saturn');
  const rahu = planets.find((p) => p.id === 'Rahu');
  const ketu = planets.find((p) => p.id === 'Ketu');

  // 1. Venus Combustion (< 8 deg from Sun) & 4/8/12 from Venus
  let venusCombust = false;
  if (sun && venus) {
    const diff = Math.abs(sun.longitude - venus.longitude) % 360;
    const angularDist = diff > 180 ? 360 - diff : diff;
    if (angularDist < 8) venusCombust = true;
  }

  let malefics4812FromVenus = 0;
  if (venus) {
    for (const mp of [sun, mars, saturn, rahu]) {
      if (!mp) continue;
      const dist = ((mp.placedHouse - venus.placedHouse + 12) % 12) + 1;
      if (dist === 4 || dist === 8 || dist === 12) malefics4812FromVenus++;
    }
  }

  // 2. Delay Factors (Classical Rules)
  const delayFactors: string[] = [];
  if (saturn && (saturn.placedHouse === 7 || saturn.placedHouse === 1 || h7.aspectors.some((p) => p.id === 'Saturn'))) {
    delayFactors.push('Saturn influencing 7th/1st axis');
  }
  if (rahu && (rahu.placedHouse === 7 || h7.aspectors.some((p) => p.id === 'Rahu'))) {
    delayFactors.push('Rahu influencing 7th');
  }
  if ([6, 8, 12].includes(h7.lordHouse)) {
    delayFactors.push(`7th lord in Dusthana H${h7.lordHouse}`);
  }
  if (venus && ([6, 8, 12].includes(venus.placedHouse) || venus.dignity === 'Debilitated' || venusCombust)) {
    delayFactors.push(venusCombust ? 'Venus combust (<8°)' : `Venus in H${venus.placedHouse}/${venus.dignity}`);
  }
  if (h7.lordPlanet?.isRetrograde || venus?.isRetrograde) {
    delayFactors.push('Retrograde 7th lord or Venus');
  }

  // 3. Separation / Bickering Risk Count (1/5/9/11 & 6/8 or 2/12 between Lagnesh and 7th Lord)
  let separationRiskCount = 0;
  const dist1to7 = ((h7.lordHouse - h1.lordHouse + 12) % 12) + 1;
  if (dist1to7 === 6 || dist1to7 === 8 || dist1to7 === 2 || dist1to7 === 12) separationRiskCount++;
  if (malefics4812FromVenus >= 2) separationRiskCount++;
  if (h4.lordHouse === 6 || h7.lordHouse === 6 || h7.lordHouse === 12) separationRiskCount++;
  if (saturn && sun && rahu) {
    const sepOn7 = [saturn, sun, rahu].filter((p) => p.placedHouse === 7 || h7.aspectors.some((a) => a.id === p.id)).length;
    if (sepOn7 >= 2) separationRiskCount++;
  }

  // 4. Luck After Marriage & Mutual Devotion (Upachaya Venus, 7th lord in 3/6/7/9/11, Jupiter in 7th, Yielding/Henpecked cues)
  const luckAfterMarriage =
    (venus && [2, 3, 6, 7, 10, 11].includes(venus.placedHouse)) ||
    [3, 6, 7, 9, 11].includes(h7.lordHouse);

  const d9Venus = d9?.placements?.find((p) => p.id === 'Venus');
  const venusVargottama = d9Venus && venus && d9Venus.signIndex === venus.signIndex;
  const jupIn7 = jupiter?.placedHouse === 7 || h7.aspectors.some((p) => p.id === 'Jupiter');
  const lagneshIn7 = h1.lordHouse === 7;
  const yieldingCues =
    (mercury?.signName === 'Leo') ||
    (jupiter?.placedHouse === 3) ||
    (mars?.placedHouse === 4) ||
    (h7.lordHouse === 2) ||
    Boolean(venus && venus.placedHouse === 7 && moon && moon.placedHouse === 7);

  let luckValEn: string;
  let luckValHi: string;
  if (luckAfterMarriage && (jupIn7 || lagneshIn7 || venusVargottama)) {
    luckValEn = 'Strong Bhagyodaya (Fortune Rise) after marriage; deep mutual devotion, loyal partnership, and elevated social prosperity';
    luckValHi = 'विवाह उपरांत प्रबल भाग्योदय योग; परस्पर अटूट समर्पण, निष्ठावान जीवनसाथी व मान-सम्मान में उल्लेखनीय वृद्धि';
  } else if (yieldingCues) {
    luckValEn = 'Affectionate, partner-respecting temperament; deeply values spouse’s counsel in household decisions (cooperative/yielding harmony)';
    luckValHi = 'जीवनसाथी के प्रति अत्यंत स्नेही व सम्मानजनक स्वभाव; पारिवारिक निर्णयों में जीवनसाथी की सलाह को सर्वोपरि महत्व देता है';
  } else if (separationRiskCount >= 2) {
    luckValEn = 'Marriage tests patience and communication; careful Kundli matching and mutual empathy transform friction into steady growth';
    luckValHi = 'दांपत्य में धैर्य व मधुर संवाद की परीक्षा; उचित कुंडली मिलान व परस्पर समझदारी से मतभेद दूर होकर स्थिरता आती है';
  } else {
    luckValEn = 'Steady post-marriage stability; shared family values and mutual respect gradually strengthen financial and domestic life';
    luckValHi = 'विवाह उपरांत क्रमशः पारिवारिक व आर्थिक स्थिरता; परस्पर आदर व सहयोग से गृहस्थ जीवन सुखमय रहता है';
  }

  // 5. Wealth from In-Laws Bonus (8th house + 2nd/7th/11th links)
  const inLawsWealth =
    (h7.lordHouse === 11 && venus?.placedHouse === 11) ||
    (h2.lordHouse === 8) ||
    (h2.lordHouse === h7.lordHouse) ||
    (h8.tier === 'strong');
  const inLawsWealthBonus = inLawsWealth
    ? {
        en: 'Strong yoga for financial support, property, or goodwill gains through in-laws after marriage',
        hi: 'विवाह उपरांत ससुराल पक्ष से आर्थिक सहयोग, संपत्ति अथवा व्यावसायिक उन्नति का उत्तम योग',
      }
    : {
        en: 'Self-earned marital prosperity; polite, dignified in-law relationship without financial dependency',
        hi: 'स्व-अर्जित समृद्धि; ससुराल पक्ष से आत्मसम्मान व मर्यादित सौहार्दपूर्ण संबंध',
      };

  // 6. Love / Unconventional / Inter-caste Marriage Analysis
  const is5and7Linked = h5.lordHouse === 7 || h7.lordHouse === 5 || h5.lordHouse === h7.lordHouse;
  const isRahu7OrVenus = rahu?.placedHouse === 7 || h7.aspectors.some((p) => p.id === 'Rahu') || (venus && rahu && Math.abs(venus.placedHouse - rahu.placedHouse) === 0);
  const is7and12Linked = h7.lordHouse === 12 || h7.occupants.some((p) => p.id === h1.lordId && h1.lordHouse === 12);
  const isLove = is5and7Linked || Boolean(venus && mars && (venus.placedHouse === mars.placedHouse || [1, 5, 7].includes(venus.placedHouse)));
  const isIntercaste = Boolean(isRahu7OrVenus || is7and12Linked || (SIGNS[(h1.signIdx + 8) % 12]?.lord === 'Jupiter' && saturn && rahu && (saturn.placedHouse === jupiter?.placedHouse || rahu.placedHouse === jupiter?.placedHouse)));

  let loveNoteEn = 'Traditional family-arranged alliance with mutual consent and parental blessings';
  let loveNoteHi = 'पारिवारिक सहमति व बुजुर्गों के आशीर्वाद से संपन्न होने वाला सुसंस्कृत पारंपरिक विवाह';
  if (isLove && isIntercaste) {
    loveNoteEn = 'Love / Unconventional / Inter-cultural Alliance: Personal choice transcends traditional caste/regional boundaries (5th-7th & Rahu resonance)';
    loveNoteHi = 'प्रेम / अंतरजातीय अथवा आधुनिक विवाह योग: व्यक्तिगत पसंद और भावनात्मक आकर्षण पारंपरिक सीमाओं से ऊपर उठकर विवाह का रूप लेता है';
  } else if (isLove) {
    loveNoteEn = 'Love or Love-cum-Arranged Marriage: Deep emotional affinity and personal choice (5th-7th / Venus-Mars resonance) guide the union';
    loveNoteHi = 'प्रेम अथवा सह-सहमति विवाह: परस्पर भावनात्मक जुड़ाव और व्यक्तिगत पसंद से विवाह तय होने का प्रबल योग';
  } else if (isIntercaste) {
    loveNoteEn = 'Unconventional or Cross-Regional Alliance: Spouse from different cultural background, distant city, or distinct social customs';
    loveNoteHi = 'भिन्न परिवेश या दूरस्थ क्षेत्र से संबंध: जीवनसाथी अलग संस्कृति, प्रांत अथवा आधुनिक विचारधारा वाले परिवार से हो सकता है';
  }

  // 7. Spouse Temperament by 7th Dominant Graha
  const tempMap: Record<GrahaKey, { en: string; hi: string }> = {
    Sun: { en: 'Ambitious, proud, dignified, and leadership-oriented spouse from a respected background', hi: 'स्वाभिमानी, महत्वाकांक्षी, प्रतिष्ठित व नेतृत्व-कुशल जीवनसाथी' },
    Moon: { en: 'Gentle, nurturing, emotionally expressive, and domestic-minded spouse with pleasing round features', hi: 'सौम्य, ममतामयी, भावुक व परिवार के प्रति समर्पित जीवनसाथी' },
    Mars: { en: 'Energetic, headstrong, industrious, and courageous spouse; benefits from calm mutual dialogue', hi: 'ऊर्जावान, कर्मठ, साहसी व स्पष्टवादी जीवनसाथी; शांत संवाद से मधुरता' },
    Mercury: { en: 'Intelligent, articulate, youthful, and analytical spouse fond of learning and conversation', hi: 'तीव्र बुद्धि, वाक्पटु, युवा-प्रवृत्ति व अध्ययनशील जीवनसाथी' },
    Jupiter: { en: 'Virtuous, wise, ethical, and generous spouse who brings Dharma and stability to the home', hi: 'सदाचारी, विद्वान, उदार व धर्मपरायण जीवनसाथी जो घर में सुख-शांति लाते हैं' },
    Venus: { en: 'Refined, artistic, affectionate, and charming spouse with graceful aesthetic taste', hi: 'सुरुचिपूर्ण, कलाप्रिय, स्नेही व आकर्षक व्यक्तित्व वाले जीवनसाथी' },
    Saturn: { en: 'Mature, hardworking, thrifty, and loyal spouse with a reserved, serious outlook', hi: 'परिपक्व, परिश्रमी, मितव्ययी व निष्ठावान जीवनसाथी; गंभीर स्वभाव' },
    Rahu: { en: 'Independent, modern, unconventional spouse with original thinking and scientific/artistic flair', hi: 'स्वतंत्र विचारों वाले, आधुनिक व रूढ़ियों से हटकर सोचने वाले जीवनसाथी' },
    Ketu: { en: 'Introspective, poetic, spiritual, and quietly devoted spouse with deep inner wisdom', hi: 'अंतर्मुखी, आध्यात्मिक, संवेदनशील व गहरी सूझबूझ रखने वाले जीवनसाथी' },
  };
  const spouseTemperament = tempMap[h7.dominantGraha];

  // 8. Marriage Timing Triggers (D1 + D9 + Transit Formula)
  const d9LagnaIdx = d9?.lagnaSignIndex ?? h1.signIdx;
  const d9LagnaSign = SIGNS[d9LagnaIdx] || SIGNS[0];
  const l1Lon = h1.lordPlanet?.longitude ?? 0;
  const l7Lon = h7.lordPlanet?.longitude ?? 0;
  const vivahaTransitSignIdx = Math.floor((((l1Lon + l7Lon) % 360) + 360) % 360 / 30);
  const vivahaTransitSign = SIGNS[vivahaTransitSignIdx] || SIGNS[0];

  const ageBandEn =
    delayFactors.length >= 2
      ? 'Delayed window (ages 28–33+)'
      : delayFactors.length === 1
      ? 'Balanced timely window (ages 25–29)'
      : 'Early-to-timely window (ages 23–27)';
  const ageBandHi =
    delayFactors.length >= 2
      ? 'विलंबित विवाह योग (आयु 28–33+ वर्ष)'
      : delayFactors.length === 1
      ? 'संतुलित समयबद्ध योग (आयु 25–29 वर्ष)'
      : 'शीघ्र व समयबद्ध योग (आयु 23–27 वर्ष)';

  const timingTriggers = {
    valEn: `${ageBandEn}; triggers in Dasha/Bhukti of ${h7.lordId}, ${venus ? 'Venus' : h2.lordId}, or ${d9LagnaSign.lord} when Guru transits ${vivahaTransitSign.name} or trines`,
    valHi: `${ageBandHi}; ${h7.lordId}, शुक्र अथवा नवांश लग्नेश (${d9LagnaSign.lord}) की दशा-अंतर्दशा एवं ${vivahaTransitSign.name} या त्रिकोण में गुरु गोचर से विवाह सिद्ध`,
    explEn: `Classical Bhrigu/Parashari timing adds Lagna lord + 7th lord longitudes (${vivahaTransitSign.name}) and tests D9 Navamsha (${d9LagnaSign.name}) activation alongside Guru/Shani transit.`,
    explHi: `लग्नेश व सप्तमेश के अंशों के योग (${vivahaTransitSign.name}) पर गुरु के गोचर तथा सप्तमेश/नवांश लग्नेश की दशा-अंतर्दशा में विवाह का प्रबल समय बनता है।`,
    pacEn: `7th Lord: ${h7.lordId} (H${h7.lordHouse}); D9 Lagna: ${d9LagnaSign.name}; Transit Seed Sign: ${vivahaTransitSign.name}; Delay Factors: ${delayFactors.length}.`,
    pacHi: `सप्तमेश: ${h7.lordId} (भाव ${h7.lordHouse}); D9 लग्न: ${d9LagnaSign.name}; गोचर बिंदु राशि: ${vivahaTransitSign.name}; विलंब कारक: ${delayFactors.length}।`,
  };

  return {
    luckAndDevotion: {
      valEn: luckValEn,
      valHi: luckValHi,
      explEn: `Evaluated from 1/5/9/11 harmony, Venus (${venusCombust ? 'Combust <8°' : `H${venus?.placedHouse}`}, ${venusVargottama ? 'Vargottama' : venus?.dignity || 'Normal'}), Jupiter, and D9 Navamsha.`,
      explHi: `१/५/९/११ भावों, शुक्र (${venusCombust ? 'अस्त <8°' : `भाव ${venus?.placedHouse}`}), गुरु तथा नवांश बल से विवाह उपरांत भाग्योदय व समर्पण का आकलन किया गया है।`,
      pacEn: `Venus in H${venus?.placedHouse} (${venusCombust ? 'Combust' : 'Clear'}); 7th Lord in H${h7.lordHouse}; Malefics 4/8/12 from Venus: ${malefics4812FromVenus}.`,
      pacHi: `शुक्र भाव ${venus?.placedHouse} में; सप्तमेश भाव ${h7.lordHouse} में; शुक्र से ४/८/१२ में पाप ग्रह: ${malefics4812FromVenus}।`,
    },
    timingTriggers,
    spouseTemperament,
    inLawsWealthBonus,
    unconventionalOrLoveNote: { isLove, isIntercaste, en: loveNoteEn, hi: loveNoteHi },
    venusCombust,
    malefics4812FromVenus,
    delayFactors,
    separationRiskCount,
  };
}

// ============================================================================
// VEDIC MEDICAL ASTROLOGY (IATROMATHEMATICS) ENGINE
// ============================================================================
export interface ComprehensiveMedicalResult {
  organsAndDosha: BilingualPrediction & { pacEn: string; pacHi: string };
  constitutionAndImmunity: BilingualPrediction & { pacEn: string; pacHi: string };
  mentalAndNervousHealth: BilingualPrediction & { pacEn: string; pacHi: string };
  ayurvedaDhatuAndHerbs: BilingualPrediction & { pacEn: string; pacHi: string };
  systemSpecificScreening: BilingualPrediction & { pacEn: string; pacHi: string };
}

const KALAPURUSHA_ORGAN_MAP: Record<number, { en: string; hi: string }> = {
  0: { en: 'Head & Brain (Aries)', hi: 'सिर व मस्तिष्क (मेष)' },
  1: { en: 'Face, Throat & Neck (Taurus)', hi: 'मुख, गला व गर्दन (वृष)' },
  2: { en: 'Lungs, Arms & Collarbones (Gemini)', hi: 'फेफड़े, भुजाएं व श्वास नली (मिथुन)' },
  3: { en: 'Chest, Heart & Stomach (Cancer)', hi: 'छाती, हृदय व आमाशय (कर्क)' },
  4: { en: 'Upper Abdomen & Spine (Leo)', hi: 'ऊपरी पेट व रीढ़ की हड्डी (सिंह)' },
  5: { en: 'Digestive System & Lower Abdomen (Virgo)', hi: 'पाचन तंत्र व निचला पेट (कन्या)' },
  6: { en: 'Kidneys, Lower Back & Groins (Libra)', hi: 'किडनी, कमर व पेडू (तुला)' },
  7: { en: 'Reproductive & Excretory Organs (Scorpio)', hi: 'प्रजनन अंग व मूत्र तंत्र (वृश्चिक)' },
  8: { en: 'Thighs, Hips & Liver Axis (Sagittarius)', hi: 'जंघा, कूल्हे व यकृत (धनु)' },
  9: { en: 'Knees, Bones & Joints (Capricorn)', hi: 'घुटने, हड्डियां व जोड़ (मकर)' },
  10: { en: 'Shanks & Blood Circulation (Aquarius)', hi: 'पिंडलियां व रक्त संचार (कुंभ)' },
  11: { en: 'Feet & Lymphatic Immunity (Pisces)', hi: 'पैर व प्रतिरक्षा तंत्र (मीन)' },
};

const PLANET_MEDICAL_MAP: Record<GrahaKey, { en: string; hi: string }> = {
  Sun: { en: 'Heart, bones, right eye, fever & vitality regulation', hi: 'हृदय, हड्डियां, दाहिनी आंख, ज्वर व रोग प्रतिरोधक ऊर्जा' },
  Moon: { en: 'Mind, blood fluids, lungs, left eye & sleep rhythm', hi: 'मन, रक्त/द्रव्य संतुलन, फेफड़े, बाईं आंख व निद्रा' },
  Mars: { en: 'Muscles, bone marrow, blood pressure, inflammation & cuts', hi: 'मांसपेशियां, रक्तचाप, अस्थि मज्जा, पित्त सूजन व चोट' },
  Mercury: { en: 'Skin, nervous system, speech & digestive coordination', hi: 'त्वचा, तंत्रिका तंत्र, वाणी व पाचन समन्वय' },
  Jupiter: { en: 'Liver, pancreas, fat metabolism & glycemic balance', hi: 'यकृत (लिवर), अग्न्याशय (मधुमेह संतुलन) व वसा चयापचय' },
  Venus: { en: 'Reproductive health, kidneys, urinary tract & hormonal glow', hi: 'प्रजनन स्वास्थ्य, किडनी, मूत्र तंत्र व हार्मोनल संतुलन' },
  Saturn: { en: 'Joints, arthritis, teeth, legs & chronic Vata stiffness', hi: 'जोड़ों का दर्द (गठिया), दांत, पैर व दीर्घकालिक वात कठोरता' },
  Rahu: { en: 'Allergies, toxins, diagnostic ambiguity & nervous stress', hi: 'एलर्जी, विषाक्तता, अनिर्णित लक्षण व मानसिक तनाव' },
  Ketu: { en: 'Intestines, feet, sudden infections & psychosomatic sensitivity', hi: 'आंतें, पैर, आकस्मिक संक्रमण व सूक्ष्म शारीरिक संवेदनशीलता' },
};

export function getComprehensiveMedicalAstrology(
  h1: HousePacProfile,
  h4: HousePacProfile,
  h5: HousePacProfile,
  h6: HousePacProfile,
  h8: HousePacProfile,
  h9: HousePacProfile,
  planets: PlanetPos[],
  d30LagnaSignIdx: number
): ComprehensiveMedicalResult {
  const sun = planets.find((p) => p.id === 'Sun');
  const moon = planets.find((p) => p.id === 'Moon');
  const mars = planets.find((p) => p.id === 'Mars');
  const mercury = planets.find((p) => p.id === 'Mercury');
  const jupiter = planets.find((p) => p.id === 'Jupiter');
  const saturn = planets.find((p) => p.id === 'Saturn');
  const rahu = planets.find((p) => p.id === 'Rahu');
  const ketu = planets.find((p) => p.id === 'Ketu');
  const venus = planets.find((p) => p.id === 'Venus');

  // 1. Tridosha + Kalapurusha Organ + Laterality (2-6 Right Side, 8-12 Left Side)
  const h6Organ = KALAPURUSHA_ORGAN_MAP[h6.signIdx] || KALAPURUSHA_ORGAN_MAP[5];
  const p6Medical = PLANET_MEDICAL_MAP[h6.dominantGraha];
  let tridoshaEn = 'Pitta-dominant (Fire/Vitality)';
  let tridoshaHi = 'पित्त-प्रधान (अग्नि/तेज)';
  if (h6.element === 'Air' || h6.dominantGraha === 'Saturn' || h6.dominantGraha === 'Mercury') {
    tridoshaEn = 'Vata-dominant (Air/Breathing & Nerves)';
    tridoshaHi = 'वात-प्रधान (वायु/श्वास व तंत्रिका)';
  } else if (h6.element === 'Water' || h6.dominantGraha === 'Moon' || h6.dominantGraha === 'Venus') {
    tridoshaEn = 'Kapha-dominant (Water/Blood & Fluids)';
    tridoshaHi = 'कफ-प्रधान (जल/रक्त व कफ)';
  } else if (h6.element === 'Earth') {
    tridoshaEn = 'Mixed Vata-Kapha (Earth/Bone & Flesh)';
    tridoshaHi = 'मिश्रित वात-कफ (पृथ्वी/अस्थि व मांस)';
  }

  const sideFocusEn = [2, 3, 4, 5, 6].includes(h6.lordHouse)
    ? 'Right-side body meridian active (H2–H6)'
    : [8, 9, 10, 11, 12].includes(h6.lordHouse)
    ? 'Left-side body meridian active (H8–H12)'
    : 'Central axis meridian';
  const sideFocusHi = [2, 3, 4, 5, 6].includes(h6.lordHouse)
    ? 'शरीर के दाहिने भाग (भाव २–६) पर विशेष ध्यान'
    : [8, 9, 10, 11, 12].includes(h6.lordHouse)
    ? 'शरीर के बाएं भाग (भाव ८–१२) पर विशेष ध्यान'
    : 'केंद्रीय शारीरिक अक्ष';

  const virgo6NoteEn = h6.signIdx === 5 ? '; Virgo in 6th highlights gastric/digestive care' : '';
  const virgo6NoteHi = h6.signIdx === 5 ? '; षष्ठ में कन्या राशि पाचन-अग्नि की देखभाल मांगती है' : '';
  const venus6NoteEn = venus?.placedHouse === 6 && h6.signIdx !== 6 ? '; Venus in 6th asks for hormonal/urinary hygiene' : '';
  const venus6NoteHi = venus?.placedHouse === 6 && h6.signIdx !== 6 ? '; षष्ठ में शुक्र हार्मोनल व मूत्र स्वास्थ्य की सतर्कता दर्शाता है' : '';

  const organsAndDosha = {
    valEn: `${tridoshaEn} | Watch: ${h6Organ.en} & ${p6Medical.en}${virgo6NoteEn}${venus6NoteEn}`,
    valHi: `${tridoshaHi} | संवेदनशील क्षेत्र: ${h6Organ.hi} एवं ${p6Medical.hi}${virgo6NoteHi}${venus6NoteHi}`,
    explEn: `Derived from 6th house (${h6.signName}), ${h6.dominantGraha} influence, D30 Trimsamsha (${SIGNS[d30LagnaSignIdx]?.name}), and Kalapurusha laterality (${sideFocusEn}). Medical astrology provides preventive awareness alongside modern medical care.`,
    explHi: `षष्ठ भाव (${h6.signName}), ${h6.dominantGraha} के प्रभाव, त्रिंशांश D30 व कालपुरुष अंग विचार (${sideFocusHi}) से संवेदनशील अंगों का निर्धारण होता है। यह निवारक स्वास्थ्य मार्गदर्शन है, चिकित्सा का विकल्प नहीं।`,
    pacEn: `H6: ${h6.signName} (Lord in H${h6.lordHouse}); Dominant: ${h6.dominantGraha}; ${sideFocusEn}.`,
    pacHi: `षष्ठ भाव: ${h6.signName} (भावेश भाव ${h6.lordHouse}); प्रमुख ग्रह: ${h6.dominantGraha}; ${sideFocusHi}।`,
  };

  // 2. Constitution & Immunity (Strong Lagna/Lagnesh + Weak 6th Lord + Satyacharya 9th Lord Rule + Sun Vitality)
  const lagneshStrong = h1.tier === 'strong' || [1, 4, 5, 7, 9, 10, 11].includes(h1.lordHouse);
  const lagneshInTrik = [6, 8, 12].includes(h1.lordHouse);
  const satyacharyaProtection = h9.lordHouse === 6 || h9.lordHouse === 8 || h9.lordHouse === 12 ? false : h6.aspectors.some((p) => p.id === h9.lordId || p.id === 'Jupiter');
  const sunAfflicted = sun && ([6, 8, 12].includes(sun.placedHouse) || sun.dignity === 'Debilitated' || (saturn && saturn.placedHouse === sun.placedHouse) || (rahu && rahu.placedHouse === sun.placedHouse));

  let constValEn: string;
  let constValHi: string;
  if (lagneshStrong && !lagneshInTrik && !sunAfflicted) {
    constValEn = 'Strong fundamental constitution & vital immunity; rapid recovery during seasonal ailments (Lagnesh fortified)';
    constValHi = 'सुदृढ़ शारीरिक गठन व उत्तम रोग-प्रतिरोधक क्षमता; मौसमी व्याधियों से शीघ्र स्वास्थ्य लाभ (लग्नेश बलवान)';
  } else if (lagneshInTrik || (h6.tier === 'strong' && h1.tier === 'afflicted')) {
    constValEn = 'Sensitive immunity & endurance; prone to fatigue or recurring ailments during 6th/8th/12th Dasha-Gochar windows — preventive routine essential';
    constValHi = 'संवेदनशील प्रतिरोधक क्षमता; ६/८/१२वें भाव की दशा-गोचर में थकान या बार-बार स्वास्थ्य अवरोध — नियमित दिनचर्या व जांच आवश्यक';
  } else if (satyacharyaProtection) {
    constValEn = 'Protected recovery constitution (Sage Satyacharya’s Guru/9th-lord shield on 6th); hurdles heal steadily with timely care';
    constValHi = 'रक्षित स्वास्थ्य योग (सत्याचार्य सूत्रानुसार नवमेश/गुरु की षष्ठ पर रक्षा दृष्टि); समय पर उपचार से पूर्ण स्वास्थ्य लाभ';
  } else {
    constValEn = 'Moderate baseline vitality; balanced diet, regular exercise, and Sun/Lagnesh strengthening preserve steady energy';
    constValHi = 'मध्यम व संतुलित जीवनी शक्ति; नियमित व्यायाम, सात्विक आहार व प्रातः सूर्य सेवन से ऊर्जा बनी रहती है';
  }

  const constitutionAndImmunity = {
    valEn: constValEn,
    valHi: constValHi,
    explEn: `Classical Iatromathematics weighs Lagna Lord (${h1.lordId} in H${h1.lordHouse}) against 6th Lord (${h6.lordId} in H${h6.lordHouse}) and Sun’s vitality (${sun?.dignity || 'Neutral'} in H${sun?.placedHouse}). Challenges surface primarily when afflicted planets align in both Dasha and Gochar.`,
    explHi: `आयुर्वेदिक व वैदिक चिकित्सा ज्योतिष में लग्नेश (${h1.lordId} भाव ${h1.lordHouse}), षष्ठेश (${h6.lordId} भाव ${h6.lordHouse}) व सूर्य की जीवनी शक्ति का तुलनात्मक आकलन किया जाता है। रोग मुख्यतः प्रतिकूल दशा व गोचर के संयोग में उभरते हैं।`,
    pacEn: `Lagnesh: ${h1.lordId} (H${h1.lordHouse}, ${h1.tier}); 6th Lord: ${h6.lordId} (H${h6.lordHouse}); Sun: H${sun?.placedHouse}.`,
    pacHi: `लग्नेश: ${h1.lordId} (भाव ${h1.lordHouse}); षष्ठेश: ${h6.lordId} (भाव ${h6.lordHouse}); सूर्य: भाव ${sun?.placedHouse}।`,
  };

  // 3. Mental Calm, Nervous System & Emotional Health (Moon, 4th/5th Houses, Mercury-Mars, Jupiter Shield)
  const moonWithSaturn = moon && saturn && moon.placedHouse === saturn.placedHouse;
  const moonWithNode = moon && ((rahu && moon.placedHouse === rahu.placedHouse) || (ketu && moon.placedHouse === ketu.placedHouse));
  const moonWithMars = moon && mars && moon.placedHouse === mars.placedHouse;
  const jupWithMoonOr5 = jupiter && (jupiter.placedHouse === moon?.placedHouse || jupiter.placedHouse === 5 || h5.aspectors.some((p) => p.id === 'Jupiter'));
  const mercAfflictedMars = mercury && mars && (mercury.placedHouse === mars.placedHouse || h4.tier === 'afflicted');

  let mentalValEn: string;
  let mentalValHi: string;
  if (jupWithMoonOr5 && !moonWithNode && !moonWithSaturn) {
    mentalValEn = 'Resilient, calm & clear-thinking mind; Jupiter’s grace shields emotional equilibrium and nervous poise';
    mentalValHi = 'शांत, संतुलित व स्पष्ट चिंतनशील मन; देवगुरु बृहस्पति की कृपा से मानसिक स्थिरता व भावनात्मक दृढ़ता बनी रहती है';
  } else if (moonWithSaturn || moonWithNode) {
    mentalValEn = 'Heightened emotional sensitivity, overthinking, or periodic anxiety/sleep disruption; meditation, Pranayama & Moon/Shiva care strongly advised';
    mentalValHi = 'अत्यधिक भावुकता, अति-चिंतन या कभी-कभी मानसिक तनाव/अनिद्रा की प्रवृत्ति; ध्यान, प्राणायाम व शिव आराधना अत्यंत लाभकारी';
  } else if (moonWithMars || mercAfflictedMars) {
    mentalValEn = 'High mental velocity & nervous agitation under stress; fiery reactions or sharp speech need mindful cooling and rest';
    mentalValHi = 'तनाव के समय तीव्र मानसिक उत्तेजना व क्रोध की प्रवृत्ति; शांत संवाद, पर्याप्त विश्राम व शीतल दिनचर्या आवश्यक';
  } else {
    mentalValEn = 'Steady practical mindset; manages everyday pressures well with periodic creative breaks and structured sleep';
    mentalValHi = 'संतुलित व व्यावहारिक मानसिक स्थिति; नियमित विश्राम व सकारात्मक दिनचर्या से तनाव सहज नियंत्रित रहता है';
  }

  const mentalAndNervousHealth = {
    valEn: mentalValEn,
    valHi: mentalValHi,
    explEn: `Assessed via Moon (H${moon?.placedHouse}, ${moon?.signName}), Mercury (nervous system, H${mercury?.placedHouse}), 4th/5th houses (emotional/mental peace), and Jupiter’s protective aspect.`,
    explHi: `चंद्रमा (भाव ${moon?.placedHouse}), बुध (तंत्रिका तंत्र, भाव ${mercury?.placedHouse}), चतुर्थ/पंचम भाव व गुरु की रक्षात्मक दृष्टि से मानसिक व स्नायु स्वास्थ्य का आकलन होता है।`,
    pacEn: `Moon: H${moon?.placedHouse} (${moon?.signName}); Mercury: H${mercury?.placedHouse}; 4th: ${h4.tier}; Jupiter: H${jupiter?.placedHouse}.`,
    pacHi: `चंद्र: भाव ${moon?.placedHouse}; बुध: भाव ${mercury?.placedHouse}; चतुर्थ भाव: ${h4.tier}; गुरु: भाव ${jupiter?.placedHouse}।`,
  };

  // 4. Ayurveda Dosha-Rashi (Vata: Gemini, Virgo, Libra, Capricorn, Aquarius | Pitta: Aries, Leo, Scorpio, Sagittarius | Kapha: Taurus, Cancer, Pisces)
  const getAyurvedicDoshaBySign = (sIdx: number): { en: string; hi: string } => {
    if ([2, 5, 6, 9, 10].includes(sIdx)) return { en: 'Vata (Ether & Air)', hi: 'वात प्रकृति (आकाश व वायु)' };
    if ([0, 4, 7, 8].includes(sIdx)) return { en: 'Pitta (Fire & Bile)', hi: 'पित्त प्रकृति (अग्नि व तेज)' };
    return { en: 'Kapha (Water & Earth)', hi: 'कफ प्रकृति (जल व पृथ्वी)' };
  };

  const lagnaAyurDosha = getAyurvedicDoshaBySign(h1.signIdx);
  const dhatuHerbMap: Record<GrahaKey, { dhatuEn: string; dhatuHi: string; herbEn: string; herbHi: string; tasteEn: string; tasteHi: string }> = {
    Sun: { dhatuEn: 'Asthi (Bones) / Fire (Tej)', dhatuHi: 'अस्थि धातु / अग्नि तत्व', herbEn: 'Bilwamoola (Bael Root)', herbHi: 'बेल वृक्ष की जड़ (बिल्वमूल)', tasteEn: 'Warm & balancing light meals', tasteHi: 'संतुलित उष्ण व सात्विक आहार' },
    Moon: { dhatuEn: 'Rakta (Blood) / Water (Jala)', dhatuHi: 'रक्त धातु / जल तत्व', herbEn: 'Kharika (Cooling Hydration)', herbHi: 'खारिका व शीतल जलीय आहार', tasteEn: 'Cooling sweet & hydrating tastes', tasteHi: 'शीतल, मधुर व जल-प्रधान आहार' },
    Mars: { dhatuEn: 'Majja (Bone Marrow) / Fire', dhatuHi: 'मज्जा धातु / अग्नि तत्व', herbEn: 'Bridhadwarakamoola', herbHi: 'वृद्धदारुक मूल', tasteEn: 'Cooling bitter/sweet; reduce excess spice', tasteHi: 'शीतल व मधुर रस; अत्यधिक मिर्च-मसाले से बचाव' },
    Mercury: { dhatuEn: 'Twacha (Skin) / Earth', dhatuHi: 'त्वचा (रस-त्वक) / पृथ्वी तत्व', herbEn: 'Anantmool (Indian Sarsaparilla)', herbHi: 'अनंतमूल (सारिवा)', tasteEn: 'Warm, grounded & easy-to-digest food', tasteHi: 'सुपाच्य, ताजा व नियमित समय पर भोजन' },
    Jupiter: { dhatuEn: 'Vasa (Adipose) / Space (Akasha)', dhatuHi: 'वसा (मेदा) धातु / आकाश तत्व', herbEn: 'Brahmajatimool', herbHi: 'ब्रह्मजटीमूल व हल्दी', tasteEn: 'Light, bitter/astringent; avoid excess sweets', tasteHi: 'हल्का, तिक्त व कसैला आहार; अधिक मीठे से परहेज' },
    Venus: { dhatuEn: 'Shukra (Reproductive) / Water', dhatuHi: 'शुक्र धातु / जल तत्व', herbEn: 'Shwetaberela Moola', herbHi: 'श्वेतबरेला मूल', tasteEn: 'Nourishing milk, ghee & balanced hydration', tasteHi: 'पौष्टिक दुग्ध, घी व संतुलित जलीय आहार' },
    Saturn: { dhatuEn: 'Snayu (Muscles) / Air (Vayu)', dhatuHi: 'स्नायु धातु / वायु तत्व', herbEn: 'Shwetachandanmoola', herbHi: 'श्वेत चंदन मूल व तिल तैल', tasteEn: 'Warm, mildly oiled food; avoid cold/raw excess', tasteHi: 'गर्म व स्निग्ध (घी/तेल युक्त) ताजा भोजन; बासी/ठंडे से बचाव' },
    Rahu: { dhatuEn: 'Subtle Nervous & Toxic Filter', dhatuHi: 'सूक्ष्म स्नायु व विषाक्तता शोधन', herbEn: 'Shwetachandanmoola', herbHi: 'श्वेत चंदन मूल व शुद्ध जल', tasteEn: 'Pure sattvic food; avoid stale/processed toxins', tasteHi: 'शुद्ध सात्विक आहार; तामसिक व जंक फूड से पूर्ण बचाव' },
    Ketu: { dhatuEn: 'Subtle Immunity & Intestines', dhatuHi: 'सूक्ष्म प्रतिरक्षा व आंत तंत्र', herbEn: 'Ashwagandha (Winter Cherry)', herbHi: 'अश्वगंधा', tasteEn: 'Warm, grounding herbal teas & Ashwagandha', tasteHi: 'गर्म हर्बल काढ़ा व अश्वगंधा सेवन (चिकित्सक सलाह से)' },
  };
  const ayurInfo = dhatuHerbMap[h6.dominantGraha];

  const ayurvedaDhatuAndHerbs = {
    valEn: `Prakriti: ${lagnaAyurDosha.en} | Primary Dhatu: ${ayurInfo.dhatuEn} | Classical Herb: ${ayurInfo.herbEn}`,
    valHi: `आयुर्वेदिक प्रकृति: ${lagnaAyurDosha.hi} | प्रमुख धातु: ${ayurInfo.dhatuHi} | शास्त्रीय औषधि: ${ayurInfo.herbHi}`,
    explEn: `Rooted in AtharvaVeda & Charaka Samhita: Lagna (${h1.signName}) sets baseline Prakriti while 6th dominant ${h6.dominantGraha} governs Dhatu balance. Diet: ${ayurInfo.tasteEn}. Consult a qualified Vaidya/physician before taking any herb.`,
    explHi: `अथर्ववेद व चरक संहिता के अनुसार लग्न (${h1.signName}) से मूल प्रकृति तथा षष्ठ भाव (${h6.dominantGraha}) से धातु संतुलन देखा जाता है। आहार: ${ayurInfo.tasteHi}। किसी भी औषधि का सेवन योग्य वैद्य/चिकित्सक के परामर्श से ही करें।`,
    pacEn: `Lagna Prakriti: ${lagnaAyurDosha.en}; 6th Dominant: ${h6.dominantGraha} (${ayurInfo.dhatuEn}).`,
    pacHi: `लग्न प्रकृति: ${lagnaAyurDosha.hi}; षष्ठ प्रमुख: ${h6.dominantGraha} (${ayurInfo.dhatuHi})।`,
  };

  // 5. Classical Organ-System Preventive Screening (Cardiac/BP, Metabolic/Diabetes, Respiratory, Digestive/Liver, Renal/Stones, Eyes/ENT, Joints/Accident, Skin)
  const flagsEn: string[] = [];
  const flagsHi: string[] = [];

  const isMalefic = (id: string) => ['Saturn', 'Mars', 'Rahu', 'Ketu', 'Sun'].includes(id);
  const h4Malefics = h4.occupants.filter((p) => isMalefic(p.id)).length + h4.aspectors.filter((p) => isMalefic(p.id)).length;
  const sunStrained = sun && ([6, 8, 12].includes(sun.placedHouse) || sun.dignity === 'Debilitated' || (saturn && sun.placedHouse === saturn.placedHouse) || (rahu && sun.placedHouse === rahu.placedHouse));
  if ((h4Malefics >= 2 || sunStrained) && !(jupiter && h4.aspectors.some((p) => p.id === 'Jupiter'))) {
    flagsEn.push('Cardiac & Blood Pressure (4th/Sun axis)');
    flagsHi.push('हृदय व रक्तचाप संतुलन (चतुर्थ/सूर्य अक्ष)');
  }

  const venusMetabolic = venus && ([6, 8, 12].includes(venus.placedHouse) || (jupiter && [6, 8, 12].includes(jupiter.placedHouse) && [3, 7, 11].includes(jupiter.signIndex)));
  if (venusMetabolic) {
    flagsEn.push('Glycemic / Pancreatic & Urinary Balance (Venus/Jupiter)');
    flagsHi.push('मधुमेह/पाचन व मूत्र-तंत्र संतुलन (शुक्र/गुरु)');
  }

  const respWatch = (moon && [6, 8, 12].includes(moon.placedHouse)) || (h4.signIdx === 2 || h4.signIdx === 3) && h4.tier === 'afflicted';
  if (respWatch) {
    flagsEn.push('Respiratory / Bronchial Care (Moon/4th)');
    flagsHi.push('श्वास नली व फेफड़ों की देखभाल (चंद्र/चतुर्थ)');
  }

  const digWatch = h5.tier === 'afflicted' || h6.signIdx === 5 || (jupiter && [6, 8, 12].includes(jupiter.placedHouse));
  if (digWatch) {
    flagsEn.push('Digestive, Gastric & Liver Hygiene (5th/6th/Virgo)');
    flagsHi.push('पाचन, यकृत (लिवर) व उदर स्वास्थ्य (पंचम/षष्ठ)');
  }

  const renalWatch = venus && mars && (venus.placedHouse === mars.placedHouse || [6, 8].includes(venus.placedHouse));
  if (renalWatch) {
    flagsEn.push('Kidney & Hydration / Stone Prevention (Venus-Mars)');
    flagsHi.push('किडनी व पथरी बचाव हेतु पर्याप्त जल सेवन (शुक्र-मंगल)');
  }

  const eyeEntWatch = (sun && [2, 12].includes(sun.placedHouse)) || (moon && [2, 12].includes(moon.placedHouse));
  if (eyeEntWatch) {
    flagsEn.push('Eyesight, ENT & Dental Care (2nd/12th Luminaries)');
    flagsHi.push('नेत्र, दंत व गले/कान की नियमित देखभाल (२/१२ सूर्य-चंद्र)');
  }

  const orthoWatch = mars && saturn && (mars.placedHouse === saturn.placedHouse || [1, 6, 8].includes(mars.placedHouse));
  if (orthoWatch) {
    flagsEn.push('Joints, Bones & Road-Safety Vigilance (Mars-Saturn)');
    flagsHi.push('जोड़ों, अस्थि व यात्रा/वाहन सुरक्षा सतर्कता (मंगल-शनि)');
  }

  const skinWatch = mercury && ([6, 8, 12].includes(mercury.placedHouse) || (rahu && mercury.placedHouse === rahu.placedHouse));
  if (skinWatch) {
    flagsEn.push('Skin, Nerve & Allergy Hygiene (Mercury/Rahu)');
    flagsHi.push('त्वचा, एलर्जी व स्नायु स्वच्छता (बुध/राहु)');
  }

  const systemSpecificScreening = {
    valEn: flagsEn.length > 0
      ? `Preventive Vigilance Areas: ${flagsEn.slice(0, 4).join(' | ')}`
      : 'Low System-Specific Vulnerability: Strong baseline resilience across cardiac, metabolic & respiratory axes',
    valHi: flagsHi.length > 0
      ? `निवारक स्वास्थ्य सतर्कता क्षेत्र: ${flagsHi.slice(0, 4).join(' | ')}`
      : 'उत्तम अंग-तंत्र संतुलन: हृदय, चयापचय व श्वास तंत्र में स्वाभाविक सुदृढ़ता',
    explEn: flagsEn.length > 0
      ? `Classical Medical Astrology screens ${flagsEn.join(', ')} based on planet-house combinations. These are preventive lifestyle & checkup indicators, never medical diagnoses.`
      : 'No heavy multi-malefic clusters afflict the primary organ axes (2nd, 4th, 5th, 6th, 8th, 12th). Maintain regular preventive checkups and balanced diet.',
    explHi: flagsHi.length > 0
      ? `शास्त्रीय चिकित्सा ज्योतिष के अनुसार ${flagsHi.join(', ')} पर नियमित जांच व संतुलित जीवनशैली से पूर्ण बचाव संभव है। यह केवल निवारक संकेत है, चिकित्सकीय निदान नहीं।`
      : 'प्रमुख शारीरिक तंत्रों पर कोई गंभीर बहु-पाप प्रभाव नहीं है। नियमित व्यायाम व सात्विक दिनचर्या से स्वास्थ्य उत्तम रहता है।',
    pacEn: `Screened 8 axes: ${flagsEn.length} preventive flags active (${flagsEn.map((f) => f.split(' (')[0]).join(', ') || 'All clear'}).`,
    pacHi: `८ शारीरिक तंत्र परीक्षण: ${flagsHi.length} निवारक संकेत सक्रिय (${flagsHi.map((f) => f.split(' (')[0]).join(', ') || 'सभी संतुलित'})।`,
  };

  return {
    organsAndDosha,
    constitutionAndImmunity,
    mentalAndNervousHealth,
    ayurvedaDhatuAndHerbs,
    systemSpecificScreening,
  };
}

// -----------------------------------------------------------------------------
// PILLAR 7: COMPREHENSIVE CAREER, JOB VS BUSINESS, INDU LAGNA & RAJA/DHANA YOGA
// -----------------------------------------------------------------------------

export interface ComprehensiveCareerResult {
  suitableProfession: { valEn: string; valHi: string; explEn: string; explHi: string; pacEn: string; pacHi: string };
  jobVsBusiness: { valEn: string; valHi: string; explEn: string; explHi: string; pacEn: string; pacHi: string };
  karakaAnd10thLord: { valEn: string; valHi: string; explEn: string; explHi: string; pacEn: string; pacHi: string };
  financialWealthTier: { valEn: string; valHi: string; explEn: string; explHi: string; pacEn: string; pacHi: string };
  rajaDhanaInduYogas: { valEn: string; valHi: string; explEn: string; explHi: string; pacEn: string; pacHi: string };
}

export function getComprehensiveCareerAndWealthAnalysis(
  planets: PlanetPos[],
  ascSignIdx: number,
  h2: HousePacProfile,
  h6: HousePacProfile,
  h7: HousePacProfile,
  h8: HousePacProfile,
  h9: HousePacProfile,
  h10: HousePacProfile,
  h11: HousePacProfile,
  h12: HousePacProfile,
  d9?: DivisionalChart,
  d10?: DivisionalChart,
  chartYogas?: Array<{ name: string; category?: string; isBenefic?: boolean }>
): ComprehensiveCareerResult {
  const SIGN_LORDS: GrahaKey[] = [
    'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
    'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter',
  ];
  const SIGN_HI_NAMES = [
    'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
    'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
  ];
  const GRAHA_HI: Record<GrahaKey, string> = {
    Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध',
    Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
  };
  const TIER_HI: Record<HouseStrengthTier, string> = {
    strong: 'सबल', moderate: 'मध्यम', afflicted: 'पीड़ित',
  };

  const getP = (id: GrahaKey) => planets.find((p) => p.id === id);
  const sun = getP('Sun');
  const moon = getP('Moon');
  const mars = getP('Mars');
  const mercury = getP('Mercury');
  const jupiter = getP('Jupiter');
  const venus = getP('Venus');
  const saturn = getP('Saturn');
  const rahu = getP('Rahu');

  const l10 = h10.lordPlanet;
  const l9 = h9.lordPlanet;
  const l7 = h7.lordPlanet;
  const l2 = h2.lordPlanet;
  const l11 = h11.lordPlanet;

  const isStrongDignity = (p?: PlanetPos) =>
    p?.dignity === 'Exalted' || p?.dignity === 'Own Sign' || p?.dignity === 'Moolatrikona';

  // 1. Karaka-First: Saturn (Karma Karaka) + Jupiter (Jeeva Karaka)
  const saturnCompanions = saturn
    ? planets.filter((p) => p.id !== 'Saturn' && p.placedHouse === saturn.placedHouse)
    : [];
  const saturnLink: GrahaKey = saturnCompanions[0]
    ? toGrahaKey(saturnCompanions[0].id)
    : saturn
    ? SIGN_LORDS[saturn.signIndex]
    : 'Saturn';

  const planetProfessionDomain: Record<GrahaKey, { en: string; hi: string }> = {
    Sun: { en: 'Government Administration, Executive Leadership & Authority Roles', hi: 'सरकारी प्रशासन, उच्च नेतृत्व व नीति-निर्माण' },
    Moon: { en: 'Healthcare, Hospitality, Public Relations & Marine/Fluid Trades', hi: 'स्वास्थ्य सेवा, आतिथ्य सत्कार, जनसंपर्क व जलीय व्यापार' },
    Mars: { en: 'Engineering, Industrial Operations, Defense, Real Estate & Surgery', hi: 'इंजीनियरिंग, औद्योगिक निर्माण, रक्षा, रियल एस्टेट व शल्य चिकित्सा' },
    Mercury: { en: 'Finance, Accounting, Software/Data Analytics, Commerce & Communication', hi: 'वित्त, लेखा, सॉफ्टवेयर/डेटा एनालिटिक्स, वाणिज्य व संचार' },
    Jupiter: { en: 'Advisory, Law, Higher Education, Banking & Institutional Management', hi: 'परामर्श, विधि (Law), उच्च शिक्षा, बैंकिंग व संस्थागत प्रबंधन' },
    Venus: { en: 'Design, Media, Luxury Retail, Architecture, Hospitality & Arts', hi: 'डिजाइन, मीडिया, लक्जरी व्यवसाय, वास्तुकला व कला क्षेत्र' },
    Saturn: { en: 'Infrastructure, Manufacturing, Compliance, Operations & Long-Term Systems', hi: 'बुनियादी ढांचा, विनिर्माण, कानून-अनुपालन व दीर्घकालिक संचालन' },
    Rahu: { en: 'AI/Emerging Tech, Global Trade, Aviation, Digital Media & Research', hi: 'आधुनिक तकनीक (AI/IT), विदेशी व्यापार, डिजिटल मीडिया व शोध' },
    Ketu: { en: 'Deep Research, Auditing, Cybersecurity, Pharmaceuticals & Spiritual Healing', hi: 'गहन शोध, ऑडिटिंग, साइबर सुरक्षा, औषधि व आध्यात्मिक परामर्श' },
  };

  // Determine primary profession from 10th lord + Saturn link + D10 confirmation
  const d10LagnaIdx = d10?.lagnaSignIndex ?? ascSignIdx;
  const d10House10SignIdx = (d10LagnaIdx + 9) % 12;
  const d10Occupants = d10?.placements.filter((pl) => pl.houseFromVargaLagna === 10 && pl.id !== 'Asc') ?? [];
  const l10D9SignIdx = d9?.placements.find((pl) => pl.id === h10.lordId)?.signIndex;

  const primaryDomainKey: GrahaKey =
    (h10.occupants.find((o) => o.id in planetProfessionDomain)?.id as GrahaKey) ||
    h10.lordId ||
    saturnLink;
  const secondaryDomainKey: GrahaKey =
    saturnLink !== primaryDomainKey ? saturnLink : h10.lordId;

  const primaryDomain = planetProfessionDomain[primaryDomainKey] ?? planetProfessionDomain.Saturn;
  const secondaryDomain = planetProfessionDomain[secondaryDomainKey] ?? planetProfessionDomain.Mercury;

  // 2. 10th Lord in 12 Houses
  const tenthLordHouseMap: Record<number, { en: string; hi: string }> = {
    1: { en: 'Self-made independent career, personal brand & direct leadership', hi: 'स्वनिर्मित स्वतंत्र करियर, व्यक्तिगत पहचान व प्रत्यक्ष नेतृत्व' },
    2: { en: 'Finance, banking, speech-driven advisory, or family enterprise', hi: 'वित्त, बैंकिंग, वाणी-प्रधान परामर्श अथवा पारिवारिक व्यवसाय' },
    3: { en: 'Media, sales, communications, publishing, or frequent short-travel work', hi: 'मीडिया, विक्रय, संचार, प्रकाशन अथवा यात्रा-प्रधान कार्य' },
    4: { en: 'Real estate, vehicles, agriculture, education, or homeland administration', hi: 'रियल एस्टेट, वाहन, कृषि, शिक्षा अथवा स्थानीय प्रशासन' },
    5: { en: 'Creative strategy, teaching, investments, or intellectual consulting', hi: 'रचनात्मक रणनीति, शिक्षण, निवेश अथवा बौद्धिक परामर्श' },
    6: { en: 'Structured service, healthcare, law, compliance, or competitive sectors', hi: 'संगठित सेवा (नौकरी), चिकित्सा, कानून अथवा प्रतियोगी क्षेत्र' },
    7: { en: 'Independent business, client partnerships, trade, or foreign commerce', hi: 'स्वतंत्र व्यापार, साझेदारी, वाणिज्य अथवा विदेशी संपर्क' },
    8: { en: 'Research, insurance, taxation, crisis management, or occult/deep analytics', hi: 'शोध, बीमा, कराधान, संकट प्रबंधन अथवा गूढ़ विश्लेषण' },
    9: { en: 'Higher education, law, publishing, foreign assignments, or dharmic leadership', hi: 'उच्च शिक्षा, कानून, प्रकाशन, विदेश कार्य अथवा मार्गदर्शक पद' },
    10: { en: 'High executive authority, institutional status & strong career recognition', hi: 'उच्च प्रशासनिक अधिकार, संस्थागत प्रतिष्ठा व सुदृढ़ कर्म-स्थान' },
    11: { en: 'Entrepreneurship, large networks, tech platforms & scalable gains', hi: 'उद्यमिता, बड़े नेटवर्क, तकनीकी मंच व बहु-स्तरीय लाभ' },
    12: { en: 'MNCs, foreign lands, hospitals, backend architecture, or charitable institutions', hi: 'बहुराष्ट्रीय कंपनी (MNC), विदेश सेवा, अस्पताल अथवा पर्दे के पीछे की भूमिका' },
  };
  const l10HouseInfo = tenthLordHouseMap[l10?.placedHouse ?? 10] ?? tenthLordHouseMap[10];

  const suitableProfession = {
    valEn: `${primaryDomain.en} alongside ${secondaryDomain.en}`,
    valHi: `${primaryDomain.hi} तथा ${secondaryDomain.hi}`,
    explEn: `6-Point Career Synthesis: 10th house (${SIGNS[h10.signIdx].name}) led by ${h10.lordId} in H${l10?.placedHouse ?? 10} (${l10HouseInfo.en}) combines with Karma Karaka Saturn in H${saturn?.placedHouse ?? 10} linked to ${saturnLink}. ${d10Occupants.length > 0 ? `D10 10th house holds ${d10Occupants.map((o) => o.id).join(', ')}, reinforcing professional specialization.` : `D10 Lagna in ${SIGNS[d10LagnaIdx].name} supports steady execution.`}`,
    explHi: `षट्-बिंदु करियर विश्लेषण: दशम भाव (${SIGN_HI_NAMES[h10.signIdx]}) व दशमेश ${GRAHA_HI[h10.lordId]} भाव ${l10?.placedHouse ?? 10} में (${l10HouseInfo.hi}) तथा कर्मकारक शनि भाव ${saturn?.placedHouse ?? 10} (${GRAHA_HI[saturnLink]} प्रभाव) का समन्वय कार्यक्षेत्र तय करता है।`,
    pacEn: `H10: ${SIGNS[h10.signIdx].name}; L10 ${h10.lordId} in H${l10?.placedHouse}; Saturn in ${saturn?.signName} (H${saturn?.placedHouse}); D10 Lagna: ${SIGNS[d10LagnaIdx].name}${l10D9SignIdx !== undefined ? `; L10 D9: ${SIGNS[l10D9SignIdx].name}` : ''}.`,
    pacHi: `दशम भाव: ${SIGN_HI_NAMES[h10.signIdx]}; दशमेश भाव ${l10?.placedHouse} में; शनि भाव ${saturn?.placedHouse} में; D10 लग्न: ${SIGN_HI_NAMES[d10LagnaIdx]}।`,
  };

  // 3. Job vs Business & Phased Trajectory
  let jobScore = 0;
  let bizScore = 0;

  if (h6.tier === 'strong') jobScore += 2;
  if (saturn && (saturn.placedHouse === 6 || saturn.placedHouse === 10 || saturn.placedHouse === 11)) jobScore += 2;
  if (l10 && (l10.placedHouse === 6 || l10.placedHouse === 12)) jobScore += 2;
  if (sun && sun.placedHouse === 10 && h6.tier !== 'afflicted') jobScore += 1;

  if (h7.tier === 'strong') bizScore += 2;
  if (l7 && (l7.placedHouse === 10 || l7.placedHouse === 11 || l7.placedHouse === 1)) bizScore += 2;
  if (l10 && (l10.placedHouse === 7 || l10.placedHouse === 11 || l10.placedHouse === 1)) bizScore += 2;
  if (mercury && (mercury.placedHouse === 1 || mercury.placedHouse === 7 || mercury.placedHouse === 10 || mercury.placedHouse === 11) && mercury.dignity !== 'Debilitated') bizScore += 1;
  if (rahu && (rahu.placedHouse === 10 || rahu.placedHouse === 11) && bizScore >= 2) bizScore += 1;

  const isHybridPhased = Math.abs(jobScore - bizScore) <= 1 || (jobScore >= 2 && bizScore >= 2);
  let jobVsBizValEn = '';
  let jobVsBizValHi = '';
  let jobVsBizExplEn = '';
  let jobVsBizExplHi = '';

  if (isHybridPhased) {
    jobVsBizValEn = 'Phased Hybrid Path: Build mastery in Structured Employment / Leadership first, then transition into Consulting or Independent Enterprise';
    jobVsBizValHi = 'चरणबद्ध मिश्रित मार्ग: प्रारंभिक वर्षों में संगठित नौकरी/नेतृत्व में अनुभव, तत्पश्चात स्वतंत्र परामर्श या उद्यम में सफलता';
    jobVsBizExplEn = `Both service discipline (6th/Saturn score ${jobScore}) and independent enterprise capacity (7th/Mercury/11th score ${bizScore}) are active. Starting in a structured role builds capital, networks, and process mastery before launching a solo venture or equity partnership.`;
    jobVsBizExplHi = `कुंडली में सेवा-अनुशासन (षष्ठ/शनि बल ${jobScore}) और स्वतंत्र व्यापार क्षमता (सप्तम/बुध बल ${bizScore}) दोनों सक्रिय हैं। पहले नौकरी से अनुभव व पूंजी बनाकर फिर स्वतंत्र कार्य करना सर्वोत्तम रहेगा।`;
  } else if (bizScore > jobScore) {
    jobVsBizValEn = 'Strong Independent Business / Entrepreneurship Orientation: Thrives on autonomy, client ownership & calculated risk';
    jobVsBizValHi = 'प्रबल स्वतंत्र व्यवसाय व उद्यमिता योग: स्वायत्तता, ग्राहक प्रबंधन व सोचे-समझे जोखिम में श्रेष्ठ सफलता';
    jobVsBizExplEn = `Enterprise indicators (7th/10th/11th linkages and commercial Mercury/Mars/Rahu drive, score ${bizScore} vs ${jobScore}) outpace pure service markers. Fixed hierarchies may feel restrictive over time; consulting, agency ownership, or trading fits naturally.`;
    jobVsBizExplHi = `व्यापारिक कारक (सप्तम, दशम, एकादश व बुध का बल: ${bizScore} बनाम ${jobScore}) नौकरी के बंधन की तुलना में स्वतंत्र निर्णय, स्वयं के उद्यम या कंसल्टिंग को अधिक अनुकूल बनाते हैं।`;
  } else {
    jobVsBizValEn = 'Structured Employment / Institutional Career Orientation: Thrives on stability, clear hierarchy & steady compounding';
    jobVsBizValHi = 'संगठित नौकरी, प्रशासनिक सेवा व कॉर्पोरेट स्थिरता: नियमित उन्नति, स्पष्ट ढांचे व सुरक्षित आय में श्रेष्ठ प्रदर्शन';
    jobVsBizExplEn = `Service and institutional indicators (6th house/Saturn structure, score ${jobScore} vs ${bizScore}) dominate. Long-term growth is strongest within established organizations, government/PSU roles, or senior specialist tracks without unnecessary capital risk.`;
    jobVsBizExplHi = `सेवा व संरचना कारक (षष्ठ भाव व शनि बल: ${jobScore} बनाम ${bizScore}) प्रबल हैं। बिना अनावश्यक पूंजी जोखिम लिए प्रतिष्ठित संस्थान, कॉर्पोरेट या सरकारी सेवा में निरंतर पदोन्नति मिलती है।`;
  }

  const jobVsBusiness = {
    valEn: jobVsBizValEn,
    valHi: jobVsBizValHi,
    explEn: jobVsBizExplEn,
    explHi: jobVsBizExplHi,
    pacEn: `6th (${h6.tier}) + Saturn H${saturn?.placedHouse} vs 7th (${h7.tier}) + Mercury H${mercury?.placedHouse} + 10th Lord H${l10?.placedHouse}.`,
    pacHi: `षष्ठ (${TIER_HI[h6.tier]}) व शनि भाव ${saturn?.placedHouse} बनाम सप्तम (${TIER_HI[h7.tier]}), बुध भाव ${mercury?.placedHouse} व दशमेश भाव ${l10?.placedHouse}।`,
  };

  // 4. Karaka & 10th Lord Deep-Dive
  const jupStatusEn = jupiter
    ? `Jupiter (Jeeva Karaka) in H${jupiter.placedHouse} (${jupiter.dignity}) ${jupiter.dignity === 'Debilitated' ? 'requires ethical & financial discipline for sustained growth' : 'provides steady sustenance and dharma-aligned career longevity'}`
    : 'Jupiter supports steady career sustenance';
  const jupStatusHi = jupiter
    ? `जीवकारक गुरु भाव ${jupiter.placedHouse} में ${jupiter.dignity === 'Debilitated' ? 'नैतिक व वित्तीय अनुशासन की अपेक्षा रखता है' : 'आजीविका को दीर्घकालिक स्थायित्व व सम्मान देता है'}`
    : 'जीवकारक गुरु आजीविका को स्थायित्व देता है';

  const satSignHi = saturn ? SIGN_HI_NAMES[saturn.signIndex] : '';
  const karakaAnd10thLord = {
    valEn: `Karma Karaka Saturn in H${saturn?.placedHouse ?? '-'} (${saturn?.dignity ?? 'Balanced'}) | 10th Lord ${h10.lordId} in H${l10?.placedHouse ?? '-'}`,
    valHi: `कर्मकारक शनि भाव ${saturn?.placedHouse ?? '-'} में | दशमेश ${GRAHA_HI[h10.lordId]} भाव ${l10?.placedHouse ?? '-'} में`,
    explEn: `Saturn acts as Karma Karaka in ${saturn?.signName ?? 'chart'} (linked with ${saturnLink}), shaping daily work ethic and endurance. ${h10.lordId} in House ${l10?.placedHouse ?? 10} channels career into: ${l10HouseInfo.en}. ${jupStatusEn}.`,
    explHi: `कर्मकारक शनि ${satSignHi} (भाव ${saturn?.placedHouse ?? '-'}) में कार्यशैली व परिश्रम की दिशा तय करते हैं। दशमेश भाव ${l10?.placedHouse ?? 10} में होकर ${l10HouseInfo.hi} से आजीविका जोड़ते हैं। ${jupStatusHi}।`,
    pacEn: `Saturn H${saturn?.placedHouse} (${saturn?.dignity}), Jupiter H${jupiter?.placedHouse} (${jupiter?.dignity}), L10 H${l10?.placedHouse} -> D10 H10 (${SIGNS[d10House10SignIdx].name}).`,
    pacHi: `शनि भाव ${saturn?.placedHouse}, गुरु भाव ${jupiter?.placedHouse}, दशमेश भाव ${l10?.placedHouse} व D10 दशम भाव (${SIGN_HI_NAMES[d10House10SignIdx]})।`,
  };

  // 5. Indu Lagna Calculation (Uttara Kalamrita)
  const INDU_KALAS: Record<GrahaKey, number> = {
    Sun: 30, Moon: 16, Mars: 6, Mercury: 8, Jupiter: 10, Venus: 12, Saturn: 1, Rahu: 0, Ketu: 0,
  };
  const moonSignIdx = moon?.signIndex ?? ascSignIdx;
  const lagna9Lord = SIGN_LORDS[(ascSignIdx + 8) % 12];
  const moon9Lord = SIGN_LORDS[(moonSignIdx + 8) % 12];
  const totalKalas = INDU_KALAS[lagna9Lord] + INDU_KALAS[moon9Lord];
  const induRem = totalKalas % 12 === 0 ? 12 : totalKalas % 12;
  const induSignIdx = (moonSignIdx + induRem - 1) % 12;
  const induHouseFromLagna = ((induSignIdx - ascSignIdx + 12) % 12) + 1;
  const induOccupants = planets.filter((p) => p.signIndex === induSignIdx);
  const induBenefics = induOccupants.filter((p) => ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(p.id));
  const induMalefics = induOccupants.filter((p) => ['Saturn', 'Mars', 'Rahu', 'Ketu', 'Sun'].includes(p.id));

  // 6. Raja Yogas, Dhana Yogas & Special Combinations
  const detectedYogasEn: string[] = [];
  const detectedYogasHi: string[] = [];

  // Gajakesari: Jupiter in 1,4,7,10 from Moon
  if (jupiter && moon) {
    const distFromMoon = ((jupiter.signIndex - moon.signIndex + 12) % 12) + 1;
    if ([1, 4, 7, 10].includes(distFromMoon) && jupiter.dignity !== 'Debilitated') {
      detectedYogasEn.push('Gajakesari Yoga');
      detectedYogasHi.push('गजकेसरी योग');
    }
  }

  // Pancha Mahapurusha
  const mahapurushaChecks: Array<{ p?: PlanetPos; en: string; hi: string }> = [
    { p: mars, en: 'Ruchaka Mahapurusha', hi: 'रुचक महापुरुष' },
    { p: mercury, en: 'Bhadra Mahapurusha', hi: 'भद्र महापुरुष' },
    { p: jupiter, en: 'Hamsa Mahapurusha', hi: 'हंस महापुरुष' },
    { p: venus, en: 'Malavya Mahapurusha', hi: 'मालव्य महापुरुष' },
    { p: saturn, en: 'Shasha Mahapurusha', hi: 'शश महापुरुष' },
  ];
  for (const mc of mahapurushaChecks) {
    if (mc.p && [1, 4, 7, 10].includes(mc.p.placedHouse) && isStrongDignity(mc.p)) {
      detectedYogasEn.push(mc.en);
      detectedYogasHi.push(mc.hi);
    }
  }

  // Amala Yoga: Benefic in 10th from Lagna or Moon
  const hasAmala = planets.some(
    (p) => ['Jupiter', 'Venus', 'Mercury'].includes(p.id) &&
      (p.placedHouse === 10 || (moon && ((p.signIndex - moon.signIndex + 12) % 12) + 1 === 10))
  );
  if (hasAmala) {
    detectedYogasEn.push('Amala Yoga');
    detectedYogasHi.push('अमला योग');
  }

  // Dharma-Karma-Adhipati (9th & 10th lords)
  const isDharmaKarma = l9 && l10 && (
    l9.placedHouse === l10.placedHouse ||
    (l9.placedHouse === 10 && l10.placedHouse === 9) ||
    Math.abs(l9.placedHouse - l10.placedHouse) === 6
  );
  if (isDharmaKarma) {
    detectedYogasEn.push('Dharma-Karma-Adhipati Raja Yoga');
    detectedYogasHi.push('धर्म-कर्माधिपति राजयोग');
  }

  // Dhana Yoga (2nd, 5th, 9th, 11th linkages)
  const dhanaHouses = new Set([1, 2, 5, 9, 11]);
  const isDhanaStrong =
    l2 && l11 &&
    dhanaHouses.has(l2.placedHouse) &&
    dhanaHouses.has(l11.placedHouse) &&
    l2.dignity !== 'Debilitated' &&
    l11.dignity !== 'Debilitated';

  if (isDhanaStrong) {
    detectedYogasEn.push('Parashari Dhana Yoga');
    detectedYogasHi.push('पाराशरी धन योग');
  }

  if (chartYogas) {
    for (const cy of chartYogas) {
      if ((cy.category === 'Raja' || cy.category === 'Dhana') && !detectedYogasEn.some((d) => d.includes(cy.name))) {
        detectedYogasEn.push(cy.name);
        detectedYogasHi.push(cy.name);
      }
    }
  }

  // Realistic Wealth Tier
  const isL2Weak = h2.tier === 'afflicted';
  const isL11Weak = h11.tier === 'afflicted';
  let wealthValEn = '';
  let wealthValHi = '';
  let wealthExplEn = '';
  let wealthExplHi = '';

  if ((isL2Weak || isL11Weak) && induBenefics.length === 0 && !isDhanaStrong) {
    wealthValEn = 'Disciplined Middle-Class Stability: Steady earned income; avoid speculative risks and prioritize systematic savings';
    wealthValHi = 'संयमित मध्यम-वर्गीय स्थिरता: परिश्रम से नियमित आय; सट्टेबाजी से बचकर अनुशासित बचत पर ध्यान आवश्यक';
    wealthExplEn = `With 2nd house (${h2.tier}) and 11th house (${h11.tier}) facing pressure, wealth accumulates gradually through steady service, budgeting, and low-risk instruments rather than windfalls.`;
    wealthExplHi = `द्वितीय (${TIER_HI[h2.tier]}) और एकादश (${TIER_HI[h11.tier]}) भाव पर दबाव होने से धन का संचय आकस्मिक लाभ की अपेक्षा नियमित आय, मितव्ययिता और सुरक्षित निवेश से धीरे-धीरे होता है।`;
  } else if (isDhanaStrong || induBenefics.length > 0 || detectedYogasEn.length >= 2) {
    wealthValEn = 'Strong Prosperity & Asset-Building Potential: Multi-stream earnings, property accumulation & long-term financial independence';
    wealthValHi = 'उत्तम समृद्धि व संपत्ति निर्माण योग: बहु-आयामी आय स्रोत, अचल संपत्ति व दीर्घकालिक आर्थिक सुदृढ़ता';
    wealthExplEn = `Fortified 2nd/11th houses (${h2.tier}/${h11.tier}), active yogas (${detectedYogasEn.slice(0, 3).join(', ') || 'Dhana alignment'}), and Indu Lagna in ${SIGNS[induSignIdx].name} support compounding wealth during favorable Mahadashas.`;
    wealthExplHi = `सशक्त द्वितीय/एकादश भाव (${TIER_HI[h2.tier]}/${TIER_HI[h11.tier]}), शुभ राज/धन योग (${detectedYogasHi.slice(0, 3).join(', ') || 'धन संयोग'}) और ${SIGN_HI_NAMES[induSignIdx]} में इंदु लग्न उत्तम आर्थिक उन्नति व संपत्ति निर्माण दर्शाते हैं।`;
  } else {
    wealthValEn = 'Comfortable Upper-Middle Financial Trajectory: Reliable cashflow, steady asset growth & balanced family prosperity';
    wealthValHi = 'सुदृढ़ उच्च-मध्यम आर्थिक स्थिति: नियमित आय, क्रमिक संपत्ति वृद्धि व संतुलित पारिवारिक समृद्धि';
    wealthExplEn = `Balanced 2nd (${h2.tier}) and 11th (${h11.tier}) houses provide reliable earning capacity, comfortable living standards, and steady asset creation over time.`;
    wealthExplHi = `संतुलित द्वितीय (${TIER_HI[h2.tier]}) व एकादश (${TIER_HI[h11.tier]}) भाव जीवन में आर्थिक सुरक्षा, आवश्यक सुख-सुविधाएं और समय के साथ स्थायी पूंजी निर्माण प्रदान करते हैं।`;
  }

  const financialWealthTier = {
    valEn: wealthValEn,
    valHi: wealthValHi,
    explEn: wealthExplEn,
    explHi: wealthExplHi,
    pacEn: `H2 (${h2.tier}, L2 in H${l2?.placedHouse}) & H11 (${h11.tier}, L11 in H${l11?.placedHouse}); H8 (${h8.tier}), H12 (${h12.tier}).`,
    pacHi: `द्वितीय (${TIER_HI[h2.tier]}) व एकादश (${TIER_HI[h11.tier]}); अष्टम (${TIER_HI[h8.tier]}), द्वादश (${TIER_HI[h12.tier]})।`,
  };

  const induSummaryEn = `Indu Lagna falls in ${SIGNS[induSignIdx].name} (House ${induHouseFromLagna}, Kalas: ${INDU_KALAS[lagna9Lord]} + ${INDU_KALAS[moon9Lord]} = ${totalKalas})${induOccupants.length > 0 ? ` occupied by ${induOccupants.map((p) => p.id).join(', ')}` : ' (unoccupied; judged by its lord)'}`;
  const induSummaryHi = `इंदु लग्न ${SIGN_HI_NAMES[induSignIdx]} (भाव ${induHouseFromLagna}, कला योग: ${INDU_KALAS[lagna9Lord]} + ${INDU_KALAS[moon9Lord]} = ${totalKalas}) में स्थित है${induOccupants.length > 0 ? `, जहाँ ${induOccupants.map((p) => GRAHA_HI[toGrahaKey(p.id)]).join(', ')} विराजमान हैं` : ''}`;

  const yogaListEn = detectedYogasEn.length > 0 ? detectedYogasEn.join(', ') : 'Steady Karma-Artha alignment (earned rise)';
  const yogaListHi = detectedYogasHi.length > 0 ? detectedYogasHi.join(', ') : 'परिश्रम-आधारित क्रमिक कर्म-अर्थ योग';

  const rajaDhanaInduYogas = {
    valEn: `${yogaListEn} | Indu Lagna: ${SIGNS[induSignIdx].name} (H${induHouseFromLagna})`,
    valHi: `${yogaListHi} | इंदु लग्न: ${SIGN_HI_NAMES[induSignIdx]} (भाव ${induHouseFromLagna})`,
    explEn: `${induSummaryEn}. ${induBenefics.length > 0 ? 'Natural benefics in Indu Lagna elevate financial flow and material comfort.' : induMalefics.length > 0 ? 'Malefics in Indu Lagna indicate wealth earned through persistent effort and strategic endurance rather than easy luck.' : 'Wealth timing activates when Indu Lagna lord or Raja/Dhana Yoga planets run their Dasha.'}`,
    explHi: `${induSummaryHi}। ${induBenefics.length > 0 ? 'इंदु लग्न में शुभ ग्रह धन-प्रवाह व भौतिक समृद्धि को प्रबल बनाते हैं।' : induMalefics.length > 0 ? 'इंदु लग्न में क्रूर/कठोर ग्रह निरंतर परिश्रम व रणनीतिक धैर्य से धनार्जन का संकेत देते हैं।' : 'इंदु लग्नेश अथवा राज-धन योग कारक ग्रहों की दशा में विशेष आर्थिक उत्थान होता है।'}`,
    pacEn: `Lagna 9th Lord ${lagna9Lord} (${INDU_KALAS[lagna9Lord]}) + Moon 9th Lord ${moon9Lord} (${INDU_KALAS[moon9Lord]}) -> Indu Sign ${SIGNS[induSignIdx].name}; Active Yogas: ${detectedYogasEn.length}.`,
    pacHi: `लग्न नवमेश ${GRAHA_HI[lagna9Lord]} (${INDU_KALAS[lagna9Lord]}) + चंद्र नवमेश ${GRAHA_HI[moon9Lord]} (${INDU_KALAS[moon9Lord]}) -> इंदु राशि ${SIGN_HI_NAMES[induSignIdx]}।`,
  };

  return {
    suitableProfession,
    jobVsBusiness,
    karakaAnd10thLord,
    financialWealthTier,
    rajaDhanaInduYogas,
  };
}

// -----------------------------------------------------------------------------
// PILLAR 2: COMPREHENSIVE PARENTS, ANCESTRY, MOON-CONTEXT YOGAS & FAMILY HUB
// -----------------------------------------------------------------------------

export interface ComprehensiveParentsFamilyResult {
  fatherBondAndPath: { valEn: string; valHi: string; explEn: string; explHi: string; pacEn: string; pacHi: string };
  motherBondAndAura: { valEn: string; valHi: string; explEn: string; explHi: string; pacEn: string; pacHi: string };
  familyYogasAndClimate: { valEn: string; valHi: string; explEn: string; explHi: string; pacEn: string; pacHi: string };
  ancestralAndUpay: { valEn: string; valHi: string; explEn: string; explHi: string; pacEn: string; pacHi: string };
}

export function getComprehensiveParentsAndFamilyAnalysis(
  planets: PlanetPos[],
  ascSignIdx: number,
  h2: HousePacProfile,
  h4: HousePacProfile,
  h7: HousePacProfile,
  h9: HousePacProfile,
  h10: HousePacProfile,
  h12: HousePacProfile,
  d12?: DivisionalChart
): ComprehensiveParentsFamilyResult {
  const SIGN_HI_NAMES = [
    'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
    'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
  ];
  const GRAHA_HI: Record<GrahaKey, string> = {
    Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध',
    Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
  };
  const TIER_HI: Record<HouseStrengthTier, string> = {
    strong: 'सबल', moderate: 'मध्यम', afflicted: 'पीड़ित',
  };

  const getP = (id: GrahaKey) => planets.find((p) => p.id === id);
  const sun = getP('Sun');
  const moon = getP('Moon');
  const mercury = getP('Mercury');
  const jupiter = getP('Jupiter');
  const venus = getP('Venus');
  const saturn = getP('Saturn');
  const rahu = getP('Rahu');
  const ketu = getP('Ketu');

  // 1. Father (9th + 10th per BPHS 11.11 + Sun + Jupiter Mentor + D12)
  const sunD12 = d12?.placements.find((pl) => pl.id === 'Sun');
  const moonD12 = d12?.placements.find((pl) => pl.id === 'Moon');
  const fatherSaturnTouch = h9.occupants.some((p) => p.id === 'Saturn') || h9.aspectors.some((p) => p.id === 'Saturn');
  const pitruDoshaActive =
    (rahu && (rahu.placedHouse === 9 || (sun && rahu.placedHouse === sun.placedHouse))) ||
    (ketu && (ketu.placedHouse === 9 || (sun && ketu.placedHouse === sun.placedHouse)));
  const jupMentorFather =
    jupiter && (h9.occupants.some((p) => p.id === 'Jupiter') || h9.aspectors.some((p) => p.id === 'Jupiter') || (sun && jupiter.placedHouse === sun.placedHouse));

  let fatherValEn = '';
  let fatherValHi = '';
  let fatherExplEn = '';
  let fatherExplHi = '';

  if (h9.tier === 'strong' && sun && sun.dignity !== 'Debilitated' && !pitruDoshaActive) {
    fatherValEn = jupMentorFather
      ? 'Respected, Wise Mentor-Father: Strong paternal support, ethical guidance & ancestral goodwill'
      : 'Dignified & Supportive Paternal Lineage: Strong leadership, principles & steady family backing';
    fatherValHi = jupMentorFather
      ? 'सम्मानित व ज्ञानी मार्गदर्शक पिता: प्रबल पैतृक सहयोग, नैतिक मार्गदर्शन व कुल की प्रतिष्ठा'
      : 'प्रतिष्ठित व सहयोगी पितृ पक्ष: दृढ़ सिद्धांत, नेतृत्व क्षमता व परिवार को स्थायी संबल';
    fatherExplEn = `9th house (${SIGNS[h9.signIdx].name}), 10th house (BPHS 11.11 father-status axis), and Pitrukaraka Sun in H${sun.placedHouse} align harmoniously.${sunD12 ? ` Confirmed in D12 (Sun in ${SIGNS[sunD12.signIndex].name}).` : ''}`;
    fatherExplHi = `नवम भाव (${SIGN_HI_NAMES[h9.signIdx]}), दशम भाव (BPHS 11.11 के अनुसार पितृ-प्रतिष्ठा) व पितृकारक सूर्य भाव ${sun.placedHouse} में शुभ स्थिति में हैं।`;
  } else if (fatherSaturnTouch || pitruDoshaActive || h9.tier === 'afflicted') {
    fatherValEn = fatherSaturnTouch && !pitruDoshaActive
      ? 'Duty-Driven & Reserved Paternal Bond: Father carried heavy responsibilities; relationship matures with patience and respect'
      : 'Karmic Paternal Friction / Pitru Pattern: Early struggle, generational distance, or self-made path away from father';
    fatherValHi = fatherSaturnTouch && !pitruDoshaActive
      ? 'कर्तव्य-प्रधान व गंभीर पितृ संबंध: पिता पर भारी जिम्मेदारियाँ; धैर्य व संवाद से संबंधों में प्रगाढ़ता'
      : 'पैतृक संघर्ष व आत्मनिर्भर मार्ग: प्रारंभिक वैचारिक दूरी या परिश्रम के बाद स्वयं के बल पर उत्थान';
    fatherExplEn = `${pitruDoshaActive ? 'Nodal influence (Rahu/Ketu) on Sun or 9th house indicates an ancestral duty pattern (Pitru pattern) resolved through service and humility. ' : ''}${fatherSaturnTouch ? 'Saturn touching the 9th brings emotional reserve rather than lack of care. ' : ''}Mercury in H${mercury?.placedHouse ?? '-'} governs whether unspoken care translates into open conversation.`;
    fatherExplHi = `${pitruDoshaActive ? 'सूर्य या नवम भाव पर राहु-केतु का प्रभाव पैतृक ऋण/कर्तव्य की ओर संकेत करता है, जो सेवा व विनम्रता से शांत होता है। ' : ''}${fatherSaturnTouch ? 'शनि का नवम संबंध भावनात्मक संकोच देता है, न कि स्नेह की कमी।' : ''}`;
  } else {
    fatherValEn = 'Balanced Paternal Bond: Hardworking father with steady principles; independent respect grows with age';
    fatherValHi = 'संतुलित पितृ संबंध: परिश्रमी व सिद्धांतवादी पिता; आयु के साथ आपसी सम्मान व समझ में वृद्धि';
    fatherExplEn = `9th house (${h9.tier}) and 10th house (${h10.tier}) show practical paternal support paired with self-earned growth.`;
    fatherExplHi = `नवम (${TIER_HI[h9.tier]}) व दशम (${TIER_HI[h10.tier]}) भाव पिता से व्यावहारिक सहयोग व स्वावलंबन दर्शाते हैं।`;
  }

  const fatherBondAndPath = {
    valEn: fatherValEn,
    valHi: fatherValHi,
    explEn: fatherExplEn,
    explHi: fatherExplHi,
    pacEn: `H9 (${h9.tier}, L9 in H${h9.lordHouse}), H10 (${h10.tier}), Sun H${sun?.placedHouse} (${sun?.dignity})${sunD12 ? `, D12 Sun ${SIGNS[sunD12.signIndex].name}` : ''}.`,
    pacHi: `नवम (${TIER_HI[h9.tier]}), दशम (${TIER_HI[h10.tier]}), सूर्य भाव ${sun?.placedHouse}${sunD12 ? `, D12 सूर्य ${SIGN_HI_NAMES[sunD12.signIndex]}` : ''}।`,
  };

  // 2. Mother (4th + Moon + Venus + Matru Yoga + D12)
  const matruYoga = h4.lordPlanet && moon && (
    h4.lordPlanet.placedHouse === moon.placedHouse ||
    ([1, 4, 7, 10].includes(h4.lordPlanet.placedHouse) && [1, 4, 7, 10].includes(moon.placedHouse))
  );
  const motherSaturnTouch = h4.occupants.some((p) => p.id === 'Saturn') || h4.aspectors.some((p) => p.id === 'Saturn');
  const motherNodeTouch = h4.occupants.some((p) => p.id === 'Rahu' || p.id === 'Ketu') || h4.aspectors.some((p) => p.id === 'Rahu' || p.id === 'Ketu');
  const venusComfort4 = h4.occupants.some((p) => p.id === 'Venus') || h4.aspectors.some((p) => p.id === 'Venus');

  let motherValEn = '';
  let motherValHi = '';
  let motherExplEn = '';
  let motherExplHi = '';

  if ((matruYoga || h4.tier === 'strong') && moon && moon.dignity !== 'Debilitated' && !motherSaturnTouch && !motherNodeTouch) {
    motherValEn = matruYoga
      ? 'Matru Yoga Active: Deeply nurturing, emotionally anchoring mother & peaceful domestic foundation'
      : 'Warm & Supportive Maternal Bond: Caring mother who anchors family values and home harmony';
    motherValHi = matruYoga
      ? 'शुभ मातृ योग सक्रिय: अत्यंत स्नेहमयी, संस्कारवान माता व सुखद पारिवारिक आधार'
      : 'स्नेहमयी व सहयोगी मातृ संबंध: माता परिवार की भावनात्मक धुरी व संस्कारों की रक्षक';
    motherExplEn = `4th house (${SIGNS[h4.signIdx].name}) and Matrukaraka Moon in H${moon.placedHouse} (${moon.dignity}) reinforce emotional security.${venusComfort4 ? ' Venus adds domestic comfort and warmth.' : ''}${moonD12 ? ` D12 Moon in ${SIGNS[moonD12.signIndex].name}.` : ''}`;
    motherExplHi = `चतुर्थ भाव (${SIGN_HI_NAMES[h4.signIdx]}) व मातृकारक चंद्र भाव ${moon.placedHouse} में भावनात्मक सुरक्षा व पारिवारिक सुख देते हैं।${venusComfort4 ? ' शुक्र गृह-सुख व सौंदर्य बढ़ाते हैं।' : ''}`;
  } else if (motherSaturnTouch || motherNodeTouch || h4.tier === 'afflicted') {
    motherValEn = motherNodeTouch
      ? 'Independent / Relocated Domestic Pattern: Mother endured stress or frequent relocation; strong inner resilience'
      : 'Reserved / Duty-Focused Maternal Bond: Care expressed through quiet sacrifice rather than overt words';
    motherValHi = motherNodeTouch
      ? 'परिवर्तनशील घरेलू परिवेश: माता का त्यागमयी जीवन या जन्मस्थान से दूरी; गहन आंतरिक संबल'
      : 'कर्तव्य-निष्ठ व संकोची मातृ संबंध: माता का स्नेह शब्दों से अधिक मौन त्याग व सेवा में दिखता है';
    motherExplEn = `${motherSaturnTouch ? 'Saturn touching the 4th house or Moon creates duty-over-warmth reserve that softens over time. ' : ''}${motherNodeTouch ? 'Rahu/Ketu on the 4th often correlates with living away from the birthplace or restless domestic transitions. ' : ''}Regular calm communication helps bridge unspoken gaps.`;
    motherExplHi = `${motherSaturnTouch ? 'चतुर्थ भाव/चंद्र पर शनि का प्रभाव भावनात्मक संकोच व गंभीरता देता है। ' : ''}${motherNodeTouch ? 'चतुर्थ पर राहु/केतु जन्मस्थान से दूर निवास या घरेलू बदलाव का संकेत देते हैं। ' : ''}नियमित शांत संवाद से संबंध सहज होते हैं।`;
  } else {
    motherValEn = 'Balanced Maternal Anchor: Devoted, practical mother who sustains household stability through steady care';
    motherValHi = 'संतुलित मातृ संबल: समर्पित व व्यावहारिक माता, जो परिवार को स्थिरता प्रदान करती हैं';
    motherExplEn = `4th house (${h4.tier}) and Moon in H${moon?.placedHouse ?? '-'} show dependable maternal care alongside evolving domestic responsibilities.`;
    motherExplHi = `चतुर्थ भाव (${TIER_HI[h4.tier]}) व चंद्र भाव ${moon?.placedHouse ?? '-'} माता के व्यावहारिक स्नेह व पारिवारिक संतुलन को दर्शाते हैं।`;
  }

  const motherBondAndAura = {
    valEn: motherValEn,
    valHi: motherValHi,
    explEn: motherExplEn,
    explHi: motherExplHi,
    pacEn: `H4 (${h4.tier}, L4 in H${h4.lordHouse}), Moon H${moon?.placedHouse} (${moon?.dignity})${matruYoga ? ', Matru Yoga' : ''}${moonD12 ? `, D12 Moon ${SIGNS[moonD12.signIndex].name}` : ''}.`,
    pacHi: `चतुर्थ (${TIER_HI[h4.tier]}), चंद्र भाव ${moon?.placedHouse}${matruYoga ? ', मातृ योग' : ''}${moonD12 ? `, D12 चंद्र ${SIGN_HI_NAMES[moonD12.signIndex]}` : ''}।`,
  };

  // 3. Moon-Context Yogas (Sunapha / Anapha / Durdhara / Kemadruma) + 2nd House + Joint vs Nuclear
  const moonSignIdx = moon?.signIndex ?? ascSignIdx;
  const nonSunPlanets = planets.filter((p) => p.id !== 'Sun' && p.id !== 'Moon' && p.id !== 'Rahu' && p.id !== 'Ketu');
  const in2FromMoon = nonSunPlanets.filter((p) => ((p.signIndex - moonSignIdx + 12) % 12) === 1);
  const in12FromMoon = nonSunPlanets.filter((p) => ((p.signIndex - moonSignIdx + 12) % 12) === 11);
  const moonInKendra = moon ? [1, 4, 7, 10].includes(moon.placedHouse) : false;
  const moonConjunctAny = moon ? nonSunPlanets.some((p) => p.signIndex === moon.signIndex) : false;

  let moonYogaEn = 'Balanced Moon Support';
  let moonYogaHi = 'संतुलित चंद्र स्थिति';
  let moonYogaDescEn = 'Emotional support flows evenly between self-reliance and family ties.';
  let moonYogaDescHi = 'पारिवारिक जीवन में आत्मनिर्भरता व भावनात्मक सहयोग का संतुलन रहता है।';

  if (in2FromMoon.length > 0 && in12FromMoon.length > 0) {
    moonYogaEn = 'Durdhara Yoga';
    moonYogaHi = 'दुर्धरा योग';
    moonYogaDescEn = `Planets flanking the Moon (${in2FromMoon.map((p) => p.id).join(',')} & ${in12FromMoon.map((p) => p.id).join(',')}) confer generosity, family gathering warmth, and steady material support.`;
    moonYogaDescHi = `चंद्र के दोनों ओर ग्रह होने से दुर्धरा योग बनता है, जो उदारता, पारिवारिक उत्सवों का केंद्र बनने व संसाधनों का सुख देता है।`;
  } else if (in2FromMoon.length > 0) {
    moonYogaEn = 'Sunapha Yoga';
    moonYogaHi = 'सुनफा योग';
    moonYogaDescEn = `${in2FromMoon.map((p) => p.id).join(', ')} in 2nd from Moon gives self-earned family stability, articulate speech, and independent financial pillar status.`;
    moonYogaDescHi = `चंद्र से द्वितीय भाव में ग्रह होने से सुनफा योग बनता है, जिससे जातक स्व-अर्जित धन व बुद्धि से परिवार का मुख्य स्तंभ बनता है।`;
  } else if (in12FromMoon.length > 0) {
    moonYogaEn = 'Anapha Yoga';
    moonYogaHi = 'अनफा योग';
    moonYogaDescEn = `${in12FromMoon.map((p) => p.id).join(', ')} in 12th from Moon gives inner steadiness, dignified conduct, and calm family presence.`;
    moonYogaDescHi = `चंद्र से द्वादश में ग्रह होने से अनफा योग बनता है, जो शांत स्वभाव, उत्तम आचरण व पारिवारिक सम्मान देता है।`;
  } else if (!moonInKendra && !moonConjunctAny) {
    moonYogaEn = 'Kemadruma Tendency (Build Conscious Support)';
    moonYogaHi = 'केमद्रुम प्रवृत्ति (सजग संवाद से लाभ)';
    moonYogaDescEn = 'No classical planet flanks or joins the Moon outside Kendras, so inner peace thrives best with deliberate weekly family check-ins and steady routines.';
    moonYogaDescHi = 'चंद्र के दोनों ओर ग्रह न होने से जातक कभी-कभी भीड़ में भी एकाकी अनुभव कर सकता है; नियमित पारिवारिक संवाद व दिनचर्या से मन शांत रहता है।';
  }

  const jointPull = h2.tier === 'strong' && [1, 2, 4, 7, 10].includes(h4.lordHouse);
  const nuclearPull = h7.tier === 'strong' && (h4.lordHouse === 12 || h12.occupants.length >= 2);
  const familyStyleEn = nuclearPull && !jointPull
    ? 'Independent / Nuclear Household Pull (Relocation or self-set home)'
    : 'Strong Roots / Joint-Family Connection & Kutumba Values';
  const familyStyleHi = nuclearPull && !jointPull
    ? 'स्वतंत्र/एकल गृहस्थी की प्रवृत्ति (नए शहर या स्वतंत्र निवास)'
    : 'संयुक्त परिवार व पैतृक कुटुंब मूल्यों से गहरा जुड़ाव';

  const familyYogasAndClimate = {
    valEn: `${moonYogaEn} | ${familyStyleEn}`,
    valHi: `${moonYogaHi} | ${familyStyleHi}`,
    explEn: `${moonYogaDescEn} 2nd house (${SIGNS[h2.signIdx].name}, ${h2.tier}) governs Kutumba values and inherited resources.`,
    explHi: `${moonYogaDescHi} द्वितीय भाव (${SIGN_HI_NAMES[h2.signIdx]}, ${TIER_HI[h2.tier]}) कुटुंब संस्कार व पैतृक संसाधनों का आधार है।`,
    pacEn: `Moon in ${SIGNS[moonSignIdx].name} (H${moon?.placedHouse}); H2 (${h2.tier}); H4 Lord in H${h4.lordHouse}; H7 (${h7.tier}).`,
    pacHi: `चंद्र ${SIGN_HI_NAMES[moonSignIdx]} (भाव ${moon?.placedHouse}); द्वितीय (${TIER_HI[h2.tier]}); चतुर्थेश भाव ${h4.lordHouse} में।`,
  };

  // 4. Ethical Remedies / Upay (5-line simple behavioral + Vedic)
  const upayEnParts: string[] = [];
  const upayHiParts: string[] = [];
  if (pitruDoshaActive) {
    upayEnParts.push('Pitru care: Offer water with black sesame on Amavasya mornings and serve elders respectfully.');
    upayHiParts.push('पितृ सम्मान: अमावस्या प्रातः जल व काले तिल अर्पित करें तथा बड़ों की सेवा करें।');
  }
  if (motherSaturnTouch || motherNodeTouch || h4.tier === 'afflicted') {
    upayEnParts.push('Mother/4th Upay: Sit calmly with mother every Monday evening without distractions; offer raw milk/water to Tulsi.');
    upayHiParts.push('मातृ/चतुर्थ उपाय: प्रत्येक सोमवार शाम माता के साथ शांत समय बिताएं व तुलसी में कच्चा दूध मिश्रित जल दें।');
  }
  if (fatherSaturnTouch || h9.tier === 'afflicted') {
    upayEnParts.push('Father/10th Upay: Offer water to the rising Sun on Sundays and speak respectfully with father/mentors.');
    upayHiParts.push('पितृ/सूर्य उपाय: रविवार सूर्योदय के समय तांबे के लोटे से सूर्य को अर्घ्य दें व पिता का सम्मान करें।');
  }
  if (upayEnParts.length === 0) {
    upayEnParts.push('Behavioral Dharma: Express gratitude to parents regularly and preserve ancestral family harmony.');
    upayHiParts.push('पारिवारिक धर्म: माता-पिता के प्रति कृतज्ञता व नियमित संवाद से कुल की समृद्धि अक्षुण्ण रहती है।');
  }

  const ancestralAndUpay = {
    valEn: upayEnParts[0],
    valHi: upayHiParts[0],
    explEn: upayEnParts.join(' '),
    explHi: upayHiParts.join(' '),
    pacEn: `Pitru signal: ${pitruDoshaActive ? 'Active (Sun/9th nodal)' : 'Clear'}; 4th Saturn/Node: ${motherSaturnTouch || motherNodeTouch ? 'Present' : 'Clear'}.`,
    pacHi: `पितृ संकेत: ${pitruDoshaActive ? 'सक्रिय' : 'शुभ'}; चतुर्थ शनि/राहु: ${motherSaturnTouch || motherNodeTouch ? 'प्रभावित' : 'शुभ'}।`,
  };

  return {
    fatherBondAndPath,
    motherBondAndAura,
    familyYogasAndClimate,
    ancestralAndUpay,
  };
}

// -----------------------------------------------------------------------------
// PILLAR 3: COMPREHENSIVE SIBLINGS, BIRTH ORDER, BHRATRIKARAKA & BONDING
// -----------------------------------------------------------------------------

export interface ComprehensiveSiblingsResult {
  countAndBirthOrder: { valEn: string; valHi: string; explEn: string; explHi: string; pacEn: string; pacHi: string };
  brotherSisterDynamics: { valEn: string; valHi: string; explEn: string; explHi: string; pacEn: string; pacHi: string };
  bhratrikarakaAndUpay: { valEn: string; valHi: string; explEn: string; explHi: string; pacEn: string; pacHi: string };
}

export function getComprehensiveSiblingsAnalysis(
  planets: PlanetPos[],
  ascSignIdx: number,
  h1: HousePacProfile,
  h3: HousePacProfile,
  h5: HousePacProfile,
  h9: HousePacProfile,
  h11: HousePacProfile,
  d3?: DivisionalChart,
  d9?: DivisionalChart
): ComprehensiveSiblingsResult {
  const SIGN_HI_NAMES = [
    'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
    'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
  ];
  const GRAHA_HI: Record<GrahaKey, string> = {
    Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध',
    Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
  };
  const TIER_HI: Record<HouseStrengthTier, string> = {
    strong: 'सबल', moderate: 'मध्यम', afflicted: 'पीड़ित',
  };

  const getP = (id: GrahaKey) => planets.find((p) => p.id === id);
  const sun = getP('Sun');
  const moon = getP('Moon');
  const mars = getP('Mars');
  const mercury = getP('Mercury');
  const jupiter = getP('Jupiter');
  const venus = getP('Venus');
  const saturn = getP('Saturn');
  const rahu = getP('Rahu');
  const ketu = getP('Ketu');

  // Jaimini Chara Bhratrikaraka (3rd highest degree among 7 classical planets)
  const classical7 = planets.filter((p) =>
    ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].includes(p.id)
  );
  const explicitBK = classical7.find((p) => p.charaKaraka === 'BK');
  const sortedByDeg = [...classical7].sort((a, b) => (b.degreeInSign ?? 0) - (a.degreeInSign ?? 0));
  const bkPlanet = explicitBK ?? sortedByDeg[2] ?? mars;
  const bkId = toGrahaKey(bkPlanet?.id);

  // Birth order & count indicators
  const jupIn11 = h11.occupants.some((p) => p.id === 'Jupiter');
  const l3In11 = h3.lordHouse === 11;
  const l11In3 = h11.lordHouse === 3;
  const isDual3rd = [2, 5, 8, 11].includes(h3.signIdx);
  const empty3And11 = h3.occupants.length === 0 && h11.occupants.length === 0;
  const weakLordsDusthana =
    [6, 8, 12].includes(h3.lordHouse) &&
    [6, 8, 12].includes(h11.lordHouse) &&
    h3.aspectors.every((p) => !['Jupiter', 'Venus'].includes(p.id));

  let birthOrderEn = 'Balanced sibling position (1–2 co-borns typical)';
  let birthOrderHi = 'संतुलित सहोदर स्थिति (सामान्यतः १ से २ भाई-बहन)';

  if (empty3And11 && weakLordsDusthana) {
    birthOrderEn = 'Only-child or very compact sibling circle (siblings distant or close friendships fill sibling role)';
    birthOrderHi = 'एकल संतान या अत्यंत सीमित सहोदर योग (मित्र सहोदर जैसी भूमिका निभाते हैं)';
  } else if (jupIn11 || (h1.tier === 'strong' && sun && [1, 9, 10].includes(sun.placedHouse) && h11.occupants.length === 0)) {
    birthOrderEn = 'Eldest-child leadership signature (younger siblings read sequentially via 3rd -> 5th -> 7th)';
    birthOrderHi = 'ज्येष्ठ संतान व नेतृत्व योग (छोटे भाई-बहन क्रमशः ३, ५, ७ भावों से विचारणीय)';
  } else if (h11.occupants.length >= 1 && h3.occupants.length === 0) {
    birthOrderEn = 'Youngest-child signature with elder sibling guidance (elder siblings read anti-clockwise: 11th -> 9th -> 7th)';
    birthOrderHi = 'कनिष्ठ संतान योग व बड़े भाई-बहनों का संबल (बड़े सहोदर ११, ९, ७ भाव से विचारणीय)';
  } else if (h3.occupants.length >= 1 && h11.occupants.length >= 1) {
    birthOrderEn = 'Middle-child / multi-sibling circle (both younger 3rd and elder 11th houses active)';
    birthOrderHi = 'मध्यम संतान व सक्रिय सहोदर परिवार (अनुज ३ और ज्येष्ठ ११ दोनों भाव सक्रिय)';
  } else if (l3In11 || l11In3) {
    birthOrderEn = '3rd–11th lord exchange/link: Distinct eldest or youngest anchor in the family';
    birthOrderHi = 'तृतीयेश-एकादशेश संबंध: परिवार में सबसे बड़े या सबसे छोटे सहोदर की विशिष्ट भूमिका';
  }

  const twinOrMultipleNoteEn = (isDual3rd && h3.occupants.length >= 2) || (isDual3rd && mercury && [1, 3, 11].includes(mercury.placedHouse))
    ? ' Dual sign on 3rd cusp supports multiple/closely-spaced siblings.'
    : '';
  const twinOrMultipleNoteHi = (isDual3rd && h3.occupants.length >= 2) || (isDual3rd && mercury && [1, 3, 11].includes(mercury.placedHouse))
    ? ' तृतीय भाव में द्विस्वभाव राशि अधिक या समवयस्क सहोदरों का संकेत देती है।'
    : '';

  const d3LagnaIdx = d3?.lagnaSignIndex ?? ascSignIdx;
  const marsD9SignIdx = d9?.placements.find((pl) => pl.id === 'Mars')?.signIndex;

  const countAndBirthOrder = {
    valEn: birthOrderEn,
    valHi: birthOrderHi,
    explEn: `Assessed via 3rd house (${SIGNS[h3.signIdx].name}, younger), 11th house (${SIGNS[h11.signIdx].name}, elder), Mars dignity (${mars?.dignity ?? 'Neutral'}), and D3 Drekkana Lagna (${SIGNS[d3LagnaIdx].name}).${twinOrMultipleNoteEn}`,
    explHi: `तृतीय भाव (${SIGN_HI_NAMES[h3.signIdx]} - अनुज), एकादश भाव (${SIGN_HI_NAMES[h11.signIdx]} - ज्येष्ठ), मंगल की स्थिति व D3 द्रेष्काण लग्न (${SIGN_HI_NAMES[d3LagnaIdx]}) से सहोदर क्रम का आकलन।${twinOrMultipleNoteHi}`,
    pacEn: `H3 (${h3.tier}, ${h3.occupants.length} occ), H11 (${h11.tier}, ${h11.occupants.length} occ), Mars H${mars?.placedHouse}${marsD9SignIdx !== undefined ? `, D9 Mars ${SIGNS[marsD9SignIdx].name}` : ''}.`,
    pacHi: `तृतीय (${TIER_HI[h3.tier]}), एकादश (${TIER_HI[h11.tier]}), मंगल भाव ${mars?.placedHouse}${marsD9SignIdx !== undefined ? `, D9 मंगल ${SIGN_HI_NAMES[marsD9SignIdx]}` : ''}।`,
  };

  // Brother-Sister & Communication Dynamics (Mars = brother/protection, Mercury = sister/communication, Venus = sister/warmth, Jupiter = harmony)
  const saturnIn3Or11 =
    h3.occupants.some((p) => p.id === 'Saturn') || h3.aspectors.some((p) => p.id === 'Saturn') ||
    h11.occupants.some((p) => p.id === 'Saturn') || h11.aspectors.some((p) => p.id === 'Saturn');
  const nodeIn3Or11 =
    h3.occupants.some((p) => p.id === 'Rahu' || p.id === 'Ketu') ||
    h11.occupants.some((p) => p.id === 'Rahu' || p.id === 'Ketu');
  const beneficIn35911 =
    [h3, h5, h9, h11].some((hp) => hp.occupants.some((p) => p.id === 'Jupiter' || p.id === 'Venus' || p.id === 'Mercury'));
  const l1L3Link = h1.lordHouse === 3 || h3.lordHouse === 1 || h1.lordHouse === h3.lordHouse;
  const gajakesariOn3Or11 =
    jupiter && moon &&
    [1, 4, 7, 10].includes(((jupiter.signIndex - moon.signIndex + 12) % 12) + 1) &&
    (h3.occupants.some((p) => p.id === 'Jupiter') || h3.aspectors.some((p) => p.id === 'Jupiter') ||
     h11.occupants.some((p) => p.id === 'Jupiter') || h11.aspectors.some((p) => p.id === 'Jupiter'));

  const marsWellPlaced = mars && (mars.placedHouse === 3 || mars.dignity === 'Exalted' || mars.dignity === 'Own Sign') && !mars.isCombust;
  const marsStrained = mars && (mars.dignity === 'Debilitated' || mars.isCombust || (saturn && mars.placedHouse === saturn.placedHouse) || (rahu && mars.placedHouse === rahu.placedHouse));
  const mercStrong = mercury && mercury.dignity !== 'Debilitated' && ![6, 8, 12].includes(mercury.placedHouse);

  let bondValEn = '';
  let bondValHi = '';
  const bondDetailsEn: string[] = [];
  const bondDetailsHi: string[] = [];

  if ((beneficIn35911 || l1L3Link || gajakesariOn3Or11) && !marsStrained && !nodeIn3Or11) {
    bondValEn = 'Warm, Cooperative Brother-Sister Bond: Mutual loyalty, protective care & lifelong family harmony';
    bondValHi = 'स्नेहपूर्ण व सहयोगी भाई-बहन संबंध: आपसी विश्वास, सुरक्षा भावना व आजीवन पारिवारिक सौहार्द';
  } else if (marsStrained || nodeIn3Or11) {
    bondValEn = 'Dynamic / Karmically Tested Sibling Bond: Occasional ego or authority friction; matures with clear boundaries and calm talk';
    bondValHi = 'संवेदनशील व कर्म-परीक्षित सहोदर संबंध: अधिकार या विचारों के मतभेद संभव; स्पष्ट संवाद व धैर्य से संबंध सुधरते हैं';
  } else if (saturnIn3Or11) {
    bondValEn = 'Duty-Over-Warmth / Age-Gap Bond: Dependable during crises, though daily contact may feel reserved or distant';
    bondValHi = 'कर्तव्य-प्रधान व गंभीर सहोदर संबंध: संकट में पूर्ण सहयोग, किंतु दैनिक संवाद में कुछ दूरी या संकोच';
  } else {
    bondValEn = 'Steady & Independent Sibling Bond: Caring relationship balanced with healthy personal independence';
    bondValHi = 'संतुलित व स्वतंत्र सहोदर संबंध: आपसी स्नेह के साथ अपने-अपने जीवन पथ पर प्रगति';
  }

  if (marsWellPlaced) {
    bondDetailsEn.push('Dignified Mars gives protective brotherly energy (healthy competition rather than hostility).');
    bondDetailsHi.push('सबल मंगल भाइयों से रक्षक सहयोग व स्वस्थ प्रतिस्पर्धा देता है।');
  } else if (marsStrained) {
    bondDetailsEn.push('Strained Mars calls for patience to prevent sharp arguments.');
    bondDetailsHi.push('पीड़ित मंगल के कारण तीखी बहस से बचने व धैर्य रखने की आवश्यकता है।');
  }

  if (mercStrong) {
    bondDetailsEn.push('Well-placed Mercury supports easy communication and warm sisterly rapport.');
    bondDetailsHi.push('सबल बुध बहनों से मधुर तालमेल व सहज संवाद बनाए रखता है।');
  } else {
    bondDetailsEn.push('Mercury placement suggests care is present even when frequent calls/messages lag.');
    bondDetailsHi.push('बुध की स्थिति दर्शाती है कि मन में स्नेह होते हुए भी नियमित संवाद कम रह सकता है।');
  }

  if (venus && (h3.aspectors.some((p) => p.id === 'Venus') || h11.aspectors.some((p) => p.id === 'Venus'))) {
    bondDetailsEn.push('Venus aspect adds affection, shared celebrations, and sisterly warmth.');
    bondDetailsHi.push('शुक्र की दृष्टि उत्सवों, उपहारों व आत्मीय स्नेह को बढ़ाती है।');
  }
  if (nodeIn3Or11) {
    bondDetailsEn.push('Rahu/Ketu in sibling houses can indicate geographical distance, unconventional ties, or power-sharing lessons.');
    bondDetailsHi.push('३/११ में राहु-केतु भौगोलिक दूरी या अधिकार-संतुलन के सबक दर्शाते हैं।');
  }

  const brotherSisterDynamics = {
    valEn: bondValEn,
    valHi: bondValHi,
    explEn: bondDetailsEn.join(' '),
    explHi: bondDetailsHi.join(' '),
    pacEn: `Mars H${mars?.placedHouse} (${mars?.dignity}), Mercury H${mercury?.placedHouse} (${mercury?.dignity}), Saturn3/11: ${saturnIn3Or11}, Nodes3/11: ${nodeIn3Or11}${gajakesariOn3Or11 ? ', Gajakesari' : ''}.`,
    pacHi: `मंगल भाव ${mars?.placedHouse}, बुध भाव ${mercury?.placedHouse}, शनि प्रभाव: ${saturnIn3Or11 ? 'हाँ' : 'नहीं'}, राहु-केतु: ${nodeIn3Or11 ? 'हाँ' : 'नहीं'}।`,
  };

  // Jaimini Bhratrikaraka + Practical Remedies
  const bkStrong = bkPlanet && ![6, 8, 12].includes(bkPlanet.placedHouse) && bkPlanet.dignity !== 'Debilitated';
  const sibUpayEn = marsStrained
    ? 'Mars Upay: Recite Hanuman Chalisa on Tuesday mornings (11 Tuesdays) to foster protective calm.'
    : !mercStrong
    ? 'Mercury Upay: Message/call a sibling with no agenda on Wednesdays and feed green fodder to a cow.'
    : 'Nurture sibling ties through shared festivals (Raksha Bandhan / Bhai Dooj) and honest check-ins.';
  const sibUpayHi = marsStrained
    ? 'मंगल उपाय: क्रोध शांत रखने व सौहार्द हेतु ११ मंगलवार प्रातः हनुमान चालीसा का पाठ करें।'
    : !mercStrong
    ? 'बुध उपाय: बुधवार को बिना किसी अपेक्षा के भाई/बहन से स्नेहपूर्वक बात करें व गाय को हरा चारा खिलाएं।'
    : 'रक्षाबंधन/भाई दूज जैसे पर्वों व नियमित संवाद से सहोदर प्रेम को सुदृढ़ रखें।';

  const bhratrikarakaAndUpay = {
    valEn: `Jaimini BK: ${bkId} in H${bkPlanet?.placedHouse ?? '-'} (${bkStrong ? 'Soul-Level Support' : 'Needs Conscious Nurture'})`,
    valHi: `जैमिनी भ्रातृकारक: ${GRAHA_HI[bkId]} भाव ${bkPlanet?.placedHouse ?? '-'} में (${bkStrong ? 'आत्मीय संबल' : 'सजग प्रयास अपेक्षित'})`,
    explEn: `In Jaimini Jyotish, Bhratrikaraka (${bkId}) reflects the deeper karmic bond with siblings beyond house counts. ${sibUpayEn}`,
    explHi: `जैमिनी ज्योतिष में भ्रातृकारक (${GRAHA_HI[bkId]}) भाई-बहनों से आत्मिक जुड़ाव को दर्शाता है। ${sibUpayHi}`,
    pacEn: `Chara BK: ${bkId} (${bkPlanet?.degreeInSign?.toFixed(2) ?? '-'}° in ${bkPlanet?.signName ?? '-'}, H${bkPlanet?.placedHouse}); Nakshatra Lord: ${bkPlanet?.nakshatraLord ?? '-'}.`,
    pacHi: `चर भ्रातृकारक: ${GRAHA_HI[bkId]} (भाव ${bkPlanet?.placedHouse}); नक्षत्र स्वामी: ${GRAHA_HI[toGrahaKey(bkPlanet?.nakshatraLord)]}।`,
  };

  return {
    countAndBirthOrder,
    brotherSisterDynamics,
    bhratrikarakaAndUpay,
  };
}

// -----------------------------------------------------------------------------
// PILLAR 1 ADDON: FIRST IMPRESSION ARCHETYPE & CONJUNCTION SIGNATURES
// -----------------------------------------------------------------------------

export interface FirstImpressionConjunctionResult {
  valEn: string;
  valHi: string;
  explEn: string;
  explHi: string;
  pacEn: string;
  pacHi: string;
}

export function getFirstImpressionAndConjunctionInsights(
  planets: PlanetPos[],
  ascSignIdx: number
): FirstImpressionConjunctionResult {
  const SIGN_HI_NAMES = [
    'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
    'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
  ];

  const lagnaImpressionMap: Record<number, { en: string; hi: string }> = {
    0: { en: 'Ambitious, fast-paced & decisive first impression (hates waiting)', hi: 'महत्वाकांक्षी, त्वरित निर्णय लेने वाला व ऊर्जावान प्रथम प्रभाव' },
    1: { en: 'Polished, well-groomed & steadfastly determined aura', hi: 'सुसज्जित, आकर्षक व अपने निश्चय पर अडिग रहने वाला व्यक्तित्व' },
    2: { en: 'Articulate, lively & brimming with engaging ideas', hi: 'वाक्पटु, रोचक विचारों से परिपूर्ण व सहज संवादशील छवि' },
    3: { en: 'Warm, emotionally receptive & approachable presence', hi: 'संवेदनशील, स्नेहपूर्ण व अपनत्व जगाने वाला सौम्य व्यक्तित्व' },
    4: { en: 'Magnetic, radiant & naturally stands out in any crowd', hi: 'तेजस्वी, प्रभावशाली व भीड़ में भी सहज ध्यान आकर्षित करने वाला' },
    5: { en: 'Analytical, observant & quietly solving problems in mind', hi: 'विश्लेषणात्मक, सूक्ष्मदर्शी व हर स्थिति की योजना बनाने वाला मन' },
    6: { en: 'Graceful, poised & blessed with a calm, pleasant charm', hi: 'सौम्य, संतुलित, शालीन व मनमोहक मुस्कान युक्त व्यक्तित्व' },
    7: { en: 'Private, deeply perceptive & quick to spot insincerity', hi: 'गंभीर, रहस्यमयी व लोगों की नीयत को तुरंत भांप लेने की क्षमता' },
    8: { en: 'Adventurous, enthusiastic & first to say yes to bold plans', hi: 'साहसी, उत्साहपूर्ण व नई यात्राओं/अभियानों के लिए सदैव तत्पर' },
    9: { en: 'Disciplined, punctual & structured without unnecessary fuss', hi: 'अनुशासित, समयनिष्ठ व व्यवस्थित कार्यशैली की स्पष्ट छाप' },
    10: { en: 'Unconventional, independent & intriguingly detached aura', hi: 'विशिष्ट, स्वतंत्र विचारों वाला व दुनिया से थोड़ा अलग दिखने वाला' },
    11: { en: 'Reflective, spiritual & drawn to deeper meaning over possessions', hi: 'दार्शनिक, आध्यात्मिक व भौतिक दिखावे से ऊपर सत्य के खोजी' },
  };

  const conjPairs: Array<{ a: GrahaKey; b: GrahaKey; en: string; hi: string }> = [
    { a: 'Mars', b: 'Venus', en: 'Mars-Venus: Ageless youthful charm & passionate vitality', hi: 'मंगल-शुक्र: चिर-युवा आकर्षण व प्रबल जीवन ऊर्जा' },
    { a: 'Venus', b: 'Saturn', en: 'Venus-Saturn: Mature, loyal & patient attraction', hi: 'शुक्र-शनि: परिपक्व, निष्ठावान व धैर्यपूर्ण संबंध दृष्टि' },
    { a: 'Sun', b: 'Mercury', en: 'Sun-Mercury (Budhaditya): Sharp analytical precision', hi: 'सूर्य-बुध (बुधादित्य): सूक्ष्म विश्लेषण व तीक्ष्ण बुद्धि' },
    { a: 'Venus', b: 'Rahu', en: 'Venus-Rahu: Cross-cultural appeal & travel-linked romance', hi: 'शुक्र-राहु: दूरस्थ संस्कृतियों के प्रति आकर्षण व नवीन अनुभव' },
    { a: 'Sun', b: 'Mars', en: 'Sun-Mars: Fiercely independent self-starter energy', hi: 'सूर्य-मंगल: अत्यंत स्वतंत्र, निर्भीक व स्व-प्रेरित ऊर्जा' },
    { a: 'Mars', b: 'Rahu', en: 'Mars-Rahu: Bold risk-taking & high-adrenaline drive', hi: 'मंगल-राहु: निर्भीक साहस व असाधारण चुनौतियाँ स्वीकारने की प्रवृत्ति' },
    { a: 'Mars', b: 'Saturn', en: 'Mars-Saturn: Disciplined grit suited to sports/strategy', hi: 'मंगल-शनि: कठोर अनुशासन, सहनशीलता व रणनीतिक साहस' },
    { a: 'Moon', b: 'Venus', en: 'Moon-Venus: Natural artistic charm & creative sensitivity', hi: 'चंद्र-शुक्र: स्वाभाविक कलात्मक सौंदर्य व कोमल संवेदनशीलता' },
    { a: 'Moon', b: 'Mars', en: 'Moon-Mars (Chandra-Mangal): Quick passion; practice calm release', hi: 'चंद्र-मंगल: तीव्र भावनात्मक ऊर्जा; क्रोध पर संयम लाभदायक' },
    { a: 'Moon', b: 'Jupiter', en: 'Moon-Jupiter: Wise intuition & sound life judgment', hi: 'चंद्र-गुरु: विवेकपूर्ण अंतर्ज्ञान व सही समय पर उचित निर्णय' },
    { a: 'Moon', b: 'Rahu', en: 'Moon-Rahu: Intense inner drive beneath a composed exterior', hi: 'चंद्र-राहु: शांत आवरण के भीतर गहन महत्वाकांक्षा व तीव्र मन' },
  ];

  const activeConjs = conjPairs.filter((pair) => {
    const pa = planets.find((p) => p.id === pair.a);
    const pb = planets.find((p) => p.id === pair.b);
    return pa && pb && pa.placedHouse === pb.placedHouse;
  });

  const lagnaImp = lagnaImpressionMap[ascSignIdx] ?? lagnaImpressionMap[0];
  const saturn = planets.find((p) => p.id === 'Saturn');
  const saturnReturnNoteEn = saturn && [1, 7, 10].includes(saturn.placedHouse)
    ? ' Saturn Return (ages 27.5–30) marks a decisive turning point in maturity and stability.'
    : '';
  const saturnReturnNoteHi = saturn && [1, 7, 10].includes(saturn.placedHouse)
    ? ' शनि की पहली वापसी (आयु 27.5–30 वर्ष) जीवन व करियर में निर्णायक परिपक्वता लाती है।'
    : '';

  return {
    valEn: `${lagnaImp.en}${activeConjs.length > 0 ? ` | ${activeConjs[0].en}` : ''}`,
    valHi: `${lagnaImp.hi}${activeConjs.length > 0 ? ` | ${activeConjs[0].hi}` : ''}`,
    explEn: `${activeConjs.length > 0 ? `Active Planetary Conjunctions: ${activeConjs.map((c) => c.en).join('; ')}.` : `Lagna (${SIGNS[ascSignIdx].name}) sets your unmistakable social signature.`}${saturnReturnNoteEn}`,
    explHi: `${activeConjs.length > 0 ? `सक्रिय ग्रह युतियाँ: ${activeConjs.map((c) => c.hi).join('; ')}।` : `लग्न (${SIGN_HI_NAMES[ascSignIdx]}) आपकी स्वाभाविक सामाजिक छवि तय करता है।`}${saturnReturnNoteHi}`,
    pacEn: `Ascendant #${ascSignIdx + 1} (${SIGNS[ascSignIdx].name}); Same-house conjunctions: ${activeConjs.length > 0 ? activeConjs.map((c) => `${c.a}+${c.b}`).join(', ') : 'None (planets well-distributed)'}.`,
    pacHi: `लग्न #${ascSignIdx + 1} (${SIGN_HI_NAMES[ascSignIdx]}); सक्रिय युतियाँ: ${activeConjs.length > 0 ? activeConjs.map((c) => `${c.a}+${c.b}`).join(', ') : 'स्वतंत्र ग्रह स्थिति'}।`,
  };
}

// -----------------------------------------------------------------------------
// PILLAR 4 ADDON: UPAPADA LAGNA, MEDIATOR, D9 DELAY CHECK & REMEDIES
// -----------------------------------------------------------------------------

export interface UpapadaMarriageDeepResult {
  upapadaAndSustenance: { valEn: string; valHi: string; explEn: string; explHi: string; pacEn: string; pacHi: string };
  mediatorAndMeetingMode: { valEn: string; valHi: string; explEn: string; explHi: string; pacEn: string; pacHi: string };
  d9ResilienceAndUpay: { valEn: string; valHi: string; explEn: string; explHi: string; pacEn: string; pacHi: string };
}

export function getUpapadaAndMarriageDeepDive(
  planets: PlanetPos[],
  ascSignIdx: number,
  h7: HousePacProfile,
  h12: HousePacProfile,
  d9?: DivisionalChart
): UpapadaMarriageDeepResult {
  const SIGN_HI_NAMES = [
    'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
    'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
  ];
  const TIER_HI: Record<HouseStrengthTier, string> = {
    strong: 'सबल', moderate: 'मध्यम', afflicted: 'पीड़ित',
  };

  // 1. Upapada Lagna (Arudha of 12th house)
  const h12SignIdx = (ascSignIdx + 11) % 12;
  const l12SignIdx = h12.lordPlanet?.signIndex ?? h12SignIdx;
  const dist12 = ((l12SignIdx - h12SignIdx + 12) % 12) + 1;
  let ulSignIdx = (l12SignIdx + dist12 - 1) % 12;
  if (ulSignIdx === h12SignIdx || ulSignIdx === (h12SignIdx + 6) % 12) {
    ulSignIdx = (ulSignIdx + 9) % 12;
  }
  const ul2SignIdx = (ulSignIdx + 1) % 12;
  const ul8SignIdx = (ulSignIdx + 7) % 12;

  const ul2Planets = planets.filter((p) => p.signIndex === ul2SignIdx);
  const ul8Planets = planets.filter((p) => p.signIndex === ul8SignIdx);
  const ul2Benefics = ul2Planets.filter((p) => ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(p.id));
  const ul2Malefics = ul2Planets.filter((p) => ['Saturn', 'Mars', 'Rahu', 'Ketu'].includes(p.id));
  const ul8Benefics = ul8Planets.filter((p) => ['Jupiter', 'Venus', 'Mercury'].includes(p.id));

  const ulSustainsWell = ul2Malefics.length === 0 || ul2Benefics.length > 0;
  const upapadaAndSustenance = {
    valEn: `Upapada Lagna (UL): ${SIGNS[ulSignIdx].name} | ${ulSustainsWell ? 'Steady Bond Sustenance (2nd from UL supported)' : 'Requires Conscious Patience (2nd from UL tested)'}`,
    valHi: `उपपद लग्न (UL): ${SIGN_HI_NAMES[ulSignIdx]} | ${ulSustainsWell ? 'विवाह स्थायित्व प्रबल (UL से द्वितीय सुरक्षित)' : 'संयम व धैर्य अपेक्षित (UL से द्वितीय पर परीक्षण)'}`,
    explEn: `In Jaimini Jyotish, Upapada Lagna (${SIGNS[ulSignIdx].name}) shows the marriage's social reality and 2nd from UL (${SIGNS[ul2SignIdx].name}) governs longevity. ${ul2Benefics.length > 0 ? 'Benefics in 2nd from UL protect domestic continuity.' : ul2Malefics.length > 0 ? 'Malefics in 2nd from UL advise careful matching and patience during early years.' : '2nd from UL is clear of heavy malefics.'}${ul8Benefics.length > 0 ? ` Benefics in 8th from UL (${SIGNS[ul8SignIdx].name}) support renewal and second-chapter resilience if ever needed.` : ''}`,
    explHi: `जैमिनी ज्योतिष में उपपद लग्न (${SIGN_HI_NAMES[ulSignIdx]}) विवाह का वास्तविक स्वरूप और उससे द्वितीय भाव (${SIGN_HI_NAMES[ul2SignIdx]}) विवाह की स्थिरता दर्शाता है। ${ul2Benefics.length > 0 ? 'द्वितीय में शुभ ग्रह वैवाहिक निरंतरता की रक्षा करते हैं।' : ul2Malefics.length > 0 ? 'द्वितीय में क्रूर ग्रह प्रारंभिक वर्षों में धैर्य व कुंडली मिलान की सलाह देते हैं।' : 'द्वितीय भाव अनावश्यक बाधाओं से मुक्त है।'}`,
    pacEn: `H12 ${SIGNS[h12SignIdx].name}, L12 ${h12.lordId} in ${SIGNS[l12SignIdx].name} -> UL ${SIGNS[ulSignIdx].name}; 2nd from UL (${SIGNS[ul2SignIdx].name}): ${ul2Planets.map((p) => p.id).join(', ') || 'Empty'}.`,
    pacHi: `द्वादश ${SIGN_HI_NAMES[h12SignIdx]}, द्वादशेश ${SIGN_HI_NAMES[l12SignIdx]} में -> UL ${SIGN_HI_NAMES[ulSignIdx]}; UL से द्वितीय: ${ul2Planets.map((p) => p.id).join(', ') || 'रिक्त'}।`,
  };

  // 2. Mediator & Meeting Mode (7th Lord House H1..H12)
  const mediatorByHouse: Record<number, { en: string; hi: string }> = {
    1: { en: 'Personal choice, close family circle or neighborhood acquaintance', hi: 'स्वयं की पसंद, निकट पारिवारिक दायरा या पड़ोसी परिचय' },
    2: { en: 'Close relatives, extended family or long-time family friends', hi: 'निकट संबंधी, कुटुंब या पुराने पारिवारिक मित्र' },
    3: { en: 'Siblings, neighbors, or digital/matrimonial communication channels', hi: 'भाई-बहन, पड़ोसी अथवा आधुनिक वैवाहिक/संवाद माध्यम' },
    4: { en: 'Mother’s side relatives, homeland network or academic setting', hi: 'मातृ पक्ष, मामा/मौसी अथवा शैक्षणिक/स्थानीय परिवेश' },
    5: { en: 'Self-initiated romance, educational campus or social/cultural event', hi: 'स्व-प्रेरित प्रेम संबंध, महाविद्यालय या सांस्कृतिक उत्सव' },
    6: { en: 'Workplace, college peers or maternal uncle’s initiative', hi: 'कार्यस्थल, सहपाठी अथवा मामा पक्ष के माध्यम से प्रस्ताव' },
    7: { en: 'Paternal aunt’s family, business associates or smooth direct proposal', hi: 'बुआ/पितृ पक्ष, व्यापारिक सहयोगी अथवा सहज प्रत्यक्ष प्रस्ताव' },
    8: { en: 'Unexpected meeting (such as a wedding, medical/insurance circle)', hi: 'आकस्मिक परिचय (किसी विवाह समारोह या विशिष्ट पेशेवर क्षेत्र में)' },
    9: { en: 'Father’s network, university, pilgrimage or long-distance travel', hi: 'पिता का संपर्क, उच्च शिक्षा संस्थान, तीर्थ या लंबी यात्रा' },
    10: { en: 'Professional vicinity, workplace colleagues or mother’s guidance', hi: 'कार्यक्षेत्र के सहकर्मी, व्यावसायिक संपर्क या माता का मार्गदर्शन' },
    11: { en: 'Common friends, elder sibling or social/professional groups', hi: 'साझा मित्र मंडल, बड़े भाई-बहन या सामाजिक समूह' },
    12: { en: 'Foreign travel, cross-cultural circles or online/distant introduction', hi: 'विदेश यात्रा, भिन्न संस्कृति या दूरस्थ/ऑनलाइन परिचय' },
  };
  const l7House = h7.lordHouse;
  const medInfo = mediatorByHouse[l7House] ?? mediatorByHouse[7];
  const l7Modality = SIGNS[h7.signIdx].modality;
  const distNoteEn = l7Modality === 'Movable' ? 'Longer geographic distance' : l7Modality === 'Fixed' ? 'Nearby city/region' : 'Same town or twin-city circle';
  const distNoteHi = l7Modality === 'Movable' ? 'अधिक भौगोलिक दूरी' : l7Modality === 'Fixed' ? 'समीपवर्ती नगर/क्षेत्र' : 'उसी नगर या निकटवर्ती क्षेत्र';

  const mediatorAndMeetingMode = {
    valEn: `${medInfo.en} (${distNoteEn})`,
    valHi: `${medInfo.hi} (${distNoteHi})`,
    explEn: `7th lord ${h7.lordId} placed in House ${l7House} points to how the match or relationship initiates, while ${SIGNS[h7.signIdx].name} (${l7Modality}) indicates geographic proximity.`,
    explHi: `सप्तमेश भाव ${l7House} में होने से परिचय/मध्यस्थ का स्रोत तथा सप्तम राशि ${SIGN_HI_NAMES[h7.signIdx]} से दूरी का अनुमान मिलता है।`,
    pacEn: `7th Sign: ${SIGNS[h7.signIdx].name} (${l7Modality}); 7th Lord ${h7.lordId} in H${l7House}.`,
    pacHi: `सप्तम राशि: ${SIGN_HI_NAMES[h7.signIdx]}; सप्तमेश भाव ${l7House} में।`,
  };

  // 3. D1 vs D9 Check, Benefic Protection & Targeted Remedies
  const saturn = planets.find((p) => p.id === 'Saturn');
  const venus = planets.find((p) => p.id === 'Venus');
  const jupiter = planets.find((p) => p.id === 'Jupiter');
  const mars = planets.find((p) => p.id === 'Mars');
  const rahu = planets.find((p) => p.id === 'Rahu');

  const d9SatIn1Or7 = d9?.placements.some((pl) => pl.id === 'Saturn' && (pl.houseFromVargaLagna === 1 || pl.houseFromVargaLagna === 7)) ?? false;
  const d1Delay = h7.occupants.some((p) => p.id === 'Saturn' || p.id === 'Rahu' || p.id === 'Ketu') || [6, 8, 12].includes(h7.lordHouse);
  const jupProtects = jupiter && (h7.aspectors.some((p) => p.id === 'Jupiter') || h7.occupants.some((p) => p.id === 'Jupiter'));

  let resValEn = 'D1 & D9 Aligned: Strong marital resilience protected by balanced benefic support';
  let resValHi = 'D1 व D9 संतुलित: शुभ ग्रहों के संरक्षण से दांपत्य में उत्तम स्थायित्व';
  if (d1Delay && d9SatIn1Or7) {
    resValEn = 'Both D1 & D9 Advise Patience: Mature-age union (post-Saturn Return 28–32+) builds lasting stability';
    resValHi = 'D1 व D9 दोनों में धैर्य संकेत: परिपक्व आयु (२८-३२+ वर्ष) में विवाह अधिक स्थायी व सुखद';
  } else if (d1Delay || d9SatIn1Or7) {
    resValEn = 'Single-Chart Friction Only: Manageable early adjustments; mutual dialogue and D9 matching bring harmony';
    resValHi = 'केवल एक वर्ग में हल्का परीक्षण: प्रारंभिक तालमेल के बाद संवाद व मिलान से पूर्ण सुख';
  }

  const remedyPartsEn: string[] = [];
  const remedyPartsHi: string[] = [];
  if (saturn && (d1Delay || d9SatIn1Or7)) {
    remedyPartsEn.push('Saturn: Light a sesame/mustard oil lamp on Saturdays and respect service staff.');
    remedyPartsHi.push('शनि: शनिवार को तिल/सरसों के तेल का दीपक जलाएं व सहयोगियों का सम्मान करें।');
  }
  if (venus && (venus.dignity === 'Debilitated' || venus.isCombust)) {
    remedyPartsEn.push('Venus: Wear clean pastel/white on Fridays and practice gentle daily appreciation.');
    remedyPartsHi.push('शुक्र: शुक्रवार को स्वच्छ श्वेत/हल्के वस्त्र धारण करें व संबंधों में मधुरता रखें।');
  }
  if (mars && [1, 4, 7, 8, 12].includes(mars.placedHouse)) {
    remedyPartsEn.push('Mars: Recite Hanuman Chalisa on Tuesdays and channel passion into constructive teamwork.');
    remedyPartsHi.push('मंगल: मंगलवार को हनुमान चालीसा का पाठ करें व आवेश के स्थान पर शांत संवाद अपनाएं।');
  }
  if (rahu && rahu.placedHouse === 7) {
    remedyPartsEn.push('Rahu: Practice radical honesty and avoid unrealistic illusions in partnership.');
    remedyPartsHi.push('राहु: दांपत्य में पारदर्शिता रखें व अवास्तविक अपेक्षाओं से बचें।');
  }
  if (remedyPartsEn.length === 0) {
    remedyPartsEn.push(`${jupProtects ? 'Jupiter protects the 7th axis. ' : ''}Spend one device-free hour together daily to keep emotional chemistry alive.`);
    remedyPartsHi.push(`${jupProtects ? 'सप्तम भाव पर गुरु की शुभ रक्षा है। ' : ''}प्रतिदिन जीवनसाथी के साथ बिना मोबाइल शांत संवाद का समय अवश्य निकालें।`);
  }

  const d9ResilienceAndUpay = {
    valEn: resValEn,
    valHi: resValHi,
    explEn: `${jupProtects ? 'Jupiter aspect/presence neutralizes half of marital friction. ' : ''}${remedyPartsEn.join(' ')}`,
    explHi: `${jupProtects ? 'सप्तम पर गुरु का शुभ प्रभाव अनेक दोषों को शांत करता है। ' : ''}${remedyPartsHi.join(' ')}`,
    pacEn: `D1 H7 (${h7.tier}), D9 Saturn 1/7: ${d9SatIn1Or7}, Jupiter protection: ${Boolean(jupProtects)}.`,
    pacHi: `D1 सप्तम (${TIER_HI[h7.tier]}), D9 शनि १/७: ${d9SatIn1Or7 ? 'हाँ' : 'नहीं'}, गुरु रक्षा: ${jupProtects ? 'हाँ' : 'सामान्य'}।`,
  };

  return {
    upapadaAndSustenance,
    mediatorAndMeetingMode,
    d9ResilienceAndUpay,
  };
}






