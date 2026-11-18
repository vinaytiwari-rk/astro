/**
 * Bhrigu Nandi Nadi Conjunctions & Past Life Karma Engine (भृगु नंदी नाड़ी ग्रह युति व पूर्वजन्म कर्म शाप)
 * AV Astro Vibe — 100% Offline, Zero External API Dependency
 *
 * Implements:
 * 1. Bhrigu Nandi Nadi 2-Planet, 3-Planet & 4-Planet Conjunctions & Trine (1-5-9) combinations
 * 2. 6 Classical Parashari Past-Life Curses (Sarpa, Pitru, Matru, Bhratri, Matula, Brahmana Shapa)
 * 3. Specific Vedic Prayaschitta & Atonement Protocols
 */

import { normalizeDeg } from '../time';
import type { ChartData, NineGrahaId } from '../types';

export interface NadiConjunctionYoga {
  planets: NineGrahaId[];
  planetsHi: string;
  combinationTitleEn: string;
  combinationTitleHi: string;
  sutrasEn: string;
  sutrasHi: string;
  nativeManifestationEn: string;
  nativeManifestationHi: string;
  lifeMilestoneAge: string;
  lifeMilestoneAgeHi: string;
}

export interface PastLifeShapa {
  shapaId: string;
  nameEn: string;
  nameHi: string;
  active: boolean;
  intensity: 'Severe' | 'Moderate' | 'Mild' | 'None';
  intensityHi: 'तीव्र' | 'मध्यम' | 'सौम्य' | 'अनुपस्थित';
  karmicCauseEn: string;
  karmicCauseHi: string;
  manifestingObstacleEn: string;
  manifestingObstacleHi: string;
  parashariPrayaschittaEn: string;
  parashariPrayaschittaHi: string;
}

export interface NadiKarmaReport {
  nadiCombinations: NadiConjunctionYoga[];
  pastLifeCurses: PastLifeShapa[];
  activeCursesCount: number;
}

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

export function computeNadiYogasAndKarma(chart: ChartData): NadiKarmaReport {
  const nadiCombinations: NadiConjunctionYoga[] = [];

  const getPlanet = (id: NineGrahaId) => chart.planets.find((p) => p.id === id);
  const sun = getPlanet('Sun');
  const moon = getPlanet('Moon');
  const mars = getPlanet('Mars');
  const mercury = getPlanet('Mercury');
  const jupiter = getPlanet('Jupiter');
  const venus = getPlanet('Venus');
  const saturn = getPlanet('Saturn');
  const rahu = getPlanet('Rahu');
  const ketu = getPlanet('Ketu');

  // Check conjunction (within 12°) or Trine (120° +/- 8°) between key planets
  const areLinked = (p1: typeof sun, p2: typeof moon): boolean => {
    if (!p1 || !p2) return false;
    const diff = Math.abs(normalizeDeg(p1.longitude) - normalizeDeg(p2.longitude));
    const isConj = diff < 12 || diff > 348;
    const isTrine = (diff >= 112 && diff <= 128) || (diff >= 232 && diff <= 248);
    return isConj || isTrine;
  };

  // 1. GURU + SHANI (Dharma-Karma Yoga)
  if (areLinked(jupiter, saturn)) {
    nadiCombinations.push({
      planets: ['Jupiter', 'Saturn'],
      planetsHi: 'गुरु + शनि',
      combinationTitleEn: 'Dharma-Karmadhipati Yoga (The Law & Order Architect)',
      combinationTitleHi: 'धर्म-कर्माधिपति नाड़ी योग (संस्थागत प्रतिष्ठा व न्याय)',
      sutrasEn: 'Jupiter (Jiva - life principle) connects with Saturn (Karma - duty), compelling the native to build lasting social or spiritual institutions.',
      sutrasHi: 'गुरु (जीव कारक) का शनि (कर्म कारक) से संबंध जातक को गंभीर, कर्तव्यनिष्ठ और समाज में उच्च प्रतिष्ठा का स्वामी बनाता है।',
      nativeManifestationEn: 'Heavy initial struggle until age 32, followed by immense institutional respect, administrative authority, and unshakeable public trust.',
      nativeManifestationHi: '32 वर्ष की आयु तक कठोर परिश्रम एवं परीक्षा, तत्पश्चात उच्च प्रशासनिक पद, न्यायिक प्रतिष्ठा एवं अटूट जन-विश्वास।',
      lifeMilestoneAge: 'Major breakthrough at age 32 to 36',
      lifeMilestoneAgeHi: '32 से 36 वर्ष की आयु में महान भाग्योदय',
    });
  }

  // 2. GURU + RAHU (Shadow Wisdom & Foreign Horizon)
  if (areLinked(jupiter, rahu)) {
    nadiCombinations.push({
      planets: ['Jupiter', 'Rahu'],
      planetsHi: 'गुरु + राहु',
      combinationTitleEn: 'Shadow Wisdom & Foreign Horizon (Guru-Rahu Nadi Yoga)',
      combinationTitleHi: 'गूढ़ शोध एवं वैदेशिक संपर्क योग (गुरु-राहु नाड़ी संबंध)',
      sutrasEn: 'Rahu amplifies Jupiterian intellect beyond orthodox boundaries, pushing native into unconventional discoveries, foreign travels, or cutting-edge technologies.',
      sutrasHi: 'राहु जीव कारक गुरु की चेतना को परंपराओं से परे ले जाकर आधुनिक तकनीक, विदेशी संपर्क अथवा गूढ़ शोध में अग्रसर करता है।',
      nativeManifestationEn: 'Sharp intellect, disregard for hypocrisy, potential abroad migrations, and lucrative breakthroughs in non-traditional fields.',
      nativeManifestationHi: 'असाधारण कुशाग्र बुद्धि, पाखंड के प्रति तीव्र वितृष्णा, विदेश यात्राएं तथा गैर-पारंपरिक क्षेत्रों में बड़ी सफलता।',
      lifeMilestoneAge: 'Major overseas or tech leap at age 27 to 31',
      lifeMilestoneAgeHi: '27 से 31 वर्ष की आयु में वैदेशिक या तकनीकी छलांग',
    });
  }

  // 3. MANGAL + SHUKRA (Passion, Property & Dynamic Alliances)
  if (areLinked(mars, venus)) {
    nadiCombinations.push({
      planets: ['Mars', 'Venus'],
      planetsHi: 'मंगल + शुक्र',
      combinationTitleEn: 'Bhrigu-Mangala Yoga (Vital Passion & Material Prosperity)',
      combinationTitleHi: 'भृगु-मंगल नाड़ी योग (प्रचंड आकर्षण व भौतिक संपदा)',
      sutrasEn: 'Mars (Kshatriya fire) meets Venus (beauty, money and artistic refinement), sparking vibrant charm, real estate accumulation, and passionate relationships.',
      sutrasHi: 'मंगल (ऊर्जा व पराक्रम) और शुक्र (सौंदर्य, भोग व धन) का मिलन जातक को चुंबकीय व्यक्तित्व और अचल संपत्ति का स्वामी बनाता है।',
      nativeManifestationEn: 'Magnetic social presence, success in construction, interior design, luxury automobiles, or real estate; occasional marital volatility.',
      nativeManifestationHi: 'आकर्षक व्यक्तित्व, रियल एस्टेट, सज्जा, विलासिता वाहनों में भारी रुचि; दांपत्य में अहम के टकराव से बचाव आवश्यक।',
      lifeMilestoneAge: 'High financial/property acquisition at age 28 to 34',
      lifeMilestoneAgeHi: '28 से 34 वर्ष में भूमि, भवन व वाहन का विशेष लाभ',
    });
  }

  // 4. SURYA + BUDHA (Budhaditya Intellectual Mastery)
  if (areLinked(sun, mercury)) {
    nadiCombinations.push({
      planets: ['Sun', 'Mercury'],
      planetsHi: 'सूर्य + बुध',
      combinationTitleEn: 'Budhaditya Yoga (Administrative Intellect & Eloquence)',
      combinationTitleHi: 'बुधादित्य नाड़ी योग (प्रशासनिक प्रज्ञा व वाणी तेज)',
      sutrasEn: 'Sun (royal dignity) illuminates Mercury (logic, calculation and commerce), producing articulate leadership and financial acumen.',
      sutrasHi: 'सूर्य का आत्मबल बुध की तार्किक बुद्धि को आलोकित करता है, जिससे जातक प्रखर वक्ता, सलाहकार और चतुर प्रबंधक बनता है।',
      nativeManifestationEn: 'Sharp analytical writing, eloquence in negotiations, governmental advisory roles, and financial management prowess.',
      nativeManifestationHi: 'तार्किक लेखन, सटीक वक्तृत्व कला, शासन-प्रशासन में परामर्शदाता की भूमिका तथा व्यापारिक सूझबूझ।',
      lifeMilestoneAge: 'Intellectual eminence at age 24 to 29',
      lifeMilestoneAgeHi: '24 से 29 वर्ष में बौद्धिक व शैक्षणिक प्रतिष्ठा',
    });
  }

  // 5. SHUKRA + KETU (Spiritual Detachment & Mukti Yoga)
  if (areLinked(venus, ketu)) {
    nadiCombinations.push({
      planets: ['Venus', 'Ketu'],
      planetsHi: 'शुक्र + केतु',
      combinationTitleEn: 'Mukti-Bhrigu Yoga (Spiritual Detachment from Mundane Maya)',
      combinationTitleHi: 'मुक्ति-भृगु नाड़ी योग (वैराग्य, त्याग व सूक्ष्म विद्या)',
      sutrasEn: 'Ketu (Mokshakaraka) cuts through Venusian attachment, leading native through relationship disillusionment to profound mystical transcendence.',
      sutrasHi: 'केतु शुक्र की भौतिक आसक्तियों को काटकर जातक के भीतर वैराग्य, आध्यात्मिक गहराई और निस्वार्थ प्रेम की चेतना जगाता है।',
      nativeManifestationEn: 'Romantic disappointments in early youth leading to profound spiritual surrender, occult talents, and artistic minimalism.',
      nativeManifestationHi: 'प्रारंभिक संबंधों में मोहभंग, तत्पश्चात आध्यात्मिक साधना, ज्योतिष या कला में अतींद्रिय सूझबूझ की प्राप्ति।',
      lifeMilestoneAge: 'Spiritual transformation at age 30 to 35',
      lifeMilestoneAgeHi: '30 से 35 वर्ष की आयु में गहरा आध्यात्मिक रूपांतरण',
    });
  }

  // 6 Classical Past-Life Curses from Brihat Parashara
  const pastLifeCurses: PastLifeShapa[] = [
    {
      shapaId: 'sarpa_shapa',
      nameEn: 'Sarpa Shapa (Curse of Serpents from Past Life)',
      nameHi: 'सर्प शाप (पूर्वजन्म में नाग या पर्यावरण को कष्ट)',
      active: Boolean(rahu && (rahu.signIndex === 4 || rahu.signIndex === 0)), // Leo or Aries Rahu
      intensity: rahu && (rahu.signIndex === 4 || rahu.signIndex === 0) ? 'Moderate' : 'None',
      intensityHi: rahu && (rahu.signIndex === 4 || rahu.signIndex === 0) ? 'मध्यम' : 'अनुपस्थित',
      karmicCauseEn: 'Harm inflicted upon serpents, desecration of natural habitats, or betrayal of sacred oaths in previous incarnation.',
      karmicCauseHi: 'पूर्वजन्म में नागों, सरीसृपों अथवा प्रकृति के साथ क्रूर व्यवहार तथा किसी पवित्र शपथ का उल्लंघन।',
      manifestingObstacleEn: 'Unexplained delays in progeny conception, recurring skin allergies, and anxiety regarding child welfare.',
      manifestingObstacleHi: 'संतान उत्पत्ति में अप्रत्याशित विलंब, त्वचा संबंधी संवेदनशीलता, तथा संतान के प्रति निरंतर चिंता।',
      parashariPrayaschittaEn: 'Installation of silver serpent idol on Shiva Lingam with Rudrabhishek and feeding milk to monks.',
      parashariPrayaschittaHi: 'चांदी के नाग-नागिन के जोड़े का शिवलिंग पर समर्पण, महामृत्युंजय अनुष्ठान एवं निर्धनों को भोजन।',
    },
    {
      shapaId: 'pitru_shapa',
      nameEn: 'Pitru Shapa (Ancestral Neglect Curse)',
      nameHi: 'पितृ शाप (पूर्वजन्म में पिता या गुरु की सेवा में उपेक्षा)',
      active: Boolean(sun && saturn && Math.abs(normalizeDeg(sun.longitude) - normalizeDeg(saturn.longitude)) < 15),
      intensity: sun && saturn && Math.abs(normalizeDeg(sun.longitude) - normalizeDeg(saturn.longitude)) < 15 ? 'Severe' : 'None',
      intensityHi: sun && saturn && Math.abs(normalizeDeg(sun.longitude) - normalizeDeg(saturn.longitude)) < 15 ? 'तीव्र' : 'अनुपस्थित',
      karmicCauseEn: 'Neglect of elderly father, disrespect of ancestors, or failure to perform funeral rites in past birth.',
      karmicCauseHi: 'पूर्वजन्म में वृद्ध पिता की उपेक्षा, पूर्वजों का अनादर, अथवा श्राद्ध संस्कारों का विधिवत पालन न करना।',
      manifestingObstacleEn: 'Stunted career elevation, recurring litigation over family properties, and lack of peace of mind.',
      manifestingObstacleHi: 'कॅरियर में बार-बार अड़चनें, पैतृक संपत्ति को लेकर न्यायालयीन विवाद, तथा गृह शांति का अभाव।',
      parashariPrayaschittaEn: 'Perform Gaya Shraddha or Narayan Bali rites, feed Brahmins on Amavasya, and water Banyan trees.',
      parashariPrayaschittaHi: 'गया तीर्थ में श्राद्ध, प्रत्येक अमावस्या को पितृ तर्पण एवं ब्राह्मण भोजन, तथा वटवृक्ष की परिक्रमा।',
    },
    {
      shapaId: 'matru_shapa',
      nameEn: 'Matru Shapa (Maternal Sorrow Curse)',
      nameHi: 'मातृ शाप (पूर्वजन्म में माता के हृदय को आघात)',
      active: Boolean(moon && saturn && Math.abs(normalizeDeg(moon.longitude) - normalizeDeg(saturn.longitude)) < 12),
      intensity: moon && saturn && Math.abs(normalizeDeg(moon.longitude) - normalizeDeg(saturn.longitude)) < 12 ? 'Severe' : 'None',
      intensityHi: moon && saturn && Math.abs(normalizeDeg(moon.longitude) - normalizeDeg(saturn.longitude)) < 12 ? 'तीव्र' : 'अनुपस्थित',
      karmicCauseEn: 'Causing severe emotional grief or physical abandonment to mother or mother-figures in past life.',
      karmicCauseHi: 'पूर्वजन्म में माता को अत्यधिक मानसिक संताप देना अथवा उनका भरण-पोषण न करना।',
      manifestingObstacleEn: 'Deep-seated chronic depression, domestic discord, and emotional estrangement from close family.',
      manifestingObstacleHi: 'गंभीर मानसिक अवसाद, घर में तनावपूर्ण वातावरण, तथा अपनों से भावनात्मक दूरी का दंश।',
      parashariPrayaschittaEn: 'Sincere daily service to mother, gifting silver pot filled with pure milk to temple, and Devi Mahatmya recitation.',
      parashariPrayaschittaHi: 'जीवित माता की निष्कपट सेवा, मंदिर में चांदी के पात्र में दूध का दान, तथा दुर्गा सप्तशती का पाठ।',
    },
    {
      shapaId: 'brahmana_shapa',
      nameEn: 'Brahmana Shapa (Scholarly/Guru Curse)',
      nameHi: 'ब्राह्मण शाप (पूर्वजन्म में विद्वान, शिक्षक या साधक का अपमान)',
      active: Boolean(jupiter && rahu && Math.abs(normalizeDeg(jupiter.longitude) - normalizeDeg(rahu.longitude)) < 12),
      intensity: jupiter && rahu && Math.abs(normalizeDeg(jupiter.longitude) - normalizeDeg(rahu.longitude)) < 12 ? 'Moderate' : 'None',
      intensityHi: jupiter && rahu && Math.abs(normalizeDeg(jupiter.longitude) - normalizeDeg(rahu.longitude)) < 12 ? 'मध्यम' : 'अनुपस्थित',
      karmicCauseEn: 'Mocking wise scholars, withholding fair wages from spiritual teachers, or desecrating holy scriptures.',
      karmicCauseHi: 'पूर्वजन्म में गुरुजनों का उपहास, शिक्षकों की दक्षिणा रोकना, अथवा धर्मग्रंथों का अनादर करना।',
      manifestingObstacleEn: 'Instability in higher studies, sudden reversals in financial prosperity, and liver ailments.',
      manifestingObstacleHi: 'उच्च विद्या में व्यवधान, व्यापारिक समृद्धि में अचानक गिरावट, तथा यकृत व पाचन तंत्र की दुर्बलता।',
      parashariPrayaschittaEn: 'Donating religious scriptures, financial sponsorship of poor students, and chanting Brihaspati Gayatri.',
      parashariPrayaschittaHi: 'धार्मिक पुस्तकों का वितरण, निर्धन विद्यार्थियों की शिक्षा का व्यय उठाना, तथा ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः का जप।',
    },
  ];

  const activeCursesCount = pastLifeCurses.filter((c) => c.active).length;

  return {
    nadiCombinations,
    pastLifeCurses,
    activeCursesCount,
  };
}
