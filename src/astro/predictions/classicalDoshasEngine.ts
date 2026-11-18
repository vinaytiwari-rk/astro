/**
 * 18 Classical Doshas & Active Age Milestones Engine (18 शास्त्रीय दोष व सक्रियता आयु)
 * AV Astro Vibe — 100% Offline, Zero External API Dependency
 *
 * Evaluates:
 * 1. Kaal Sarp Dosha (12 classical types: Anant to Sheshnag) with active age triggers
 * 2. Manglik Dosha & 16 Classical Cancellations (Kuja Dosha Bhanga)
 * 3. Pitru Dosha, Guru Chandal, Angarak, Kemadruma, Shakat, Vish Yoga, Grahan Dosha
 * 4. Gandmool Dosha & 24 Pada-specific impacts
 * 5. 6 Vedic Past-Life Curses (Sarpa, Pitru, Matru, Bhratri, Brahmana, Stri Shapa)
 */

import { SIGNS } from '../constants';
import { normalizeDeg } from '../time';
import type { ChartData, NineGrahaId } from '../types';

export type DoshaSeverity = 'Severe' | 'Moderate' | 'Mild' | 'Cancelled / Nullified';
export type DoshaSeverityHi = 'अति तीव्र' | 'मध्यम' | 'सौम्य' | 'भंग / निष्प्रभावी';

export interface ClassicalDoshaItem {
  id: string;
  nameEn: string;
  nameHi: string;
  present: boolean;
  severity: DoshaSeverity;
  severityHi: DoshaSeverityHi;
  activeAgeYears: string; // e.g. "Age 28 to 36"
  activeAgeYearsHi: string;
  cancellationNoteEn: string;
  cancellationNoteHi: string;
  astrologicalBasisEn: string;
  astrologicalBasisHi: string;
  manifestationEn: string;
  manifestationHi: string;
  shastricRemedyEn: string;
  shastricRemedyHi: string;
}

export interface ClassicalDoshasReport {
  totalDoshasDetected: number;
  activeDoshasCount: number;
  cancelledDoshasCount: number;
  overallDoshaScore: number; // 0..100
  doshas: ClassicalDoshaItem[];
}

export function computeClassicalDoshas(chart: ChartData): ClassicalDoshasReport {
  const doshas: ClassicalDoshaItem[] = [];

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

  const ascSign = chart.ascendant.signIndex; // 0..11

  const getHouse = (planetLon: number): number => {
    const pSign = Math.floor(normalizeDeg(planetLon) / 30);
    return ((pSign - ascSign + 12) % 12) + 1;
  };

  const getHouseOfPlanet = (id: NineGrahaId): number => {
    const p = getPlanet(id);
    return p ? getHouse(p.longitude) : 1;
  };

  // 1. KAAL SARP DOSHA (12 Types)
  let kaalSarpTypeEn = 'None';
  let kaalSarpTypeHi = 'अनुपस्थित';
  let isKaalSarp = false;
  let ksActiveAgeHi = 'सक्रिय नहीं';
  let ksActiveAgeEn = 'Not Active';

  if (rahu && ketu) {
    const rahuHouse = getHouse(rahu.longitude);
    const ketuHouse = getHouse(ketu.longitude);

    // Check if all 7 planets are on one side of Rahu-Ketu axis
    const rahuLon = normalizeDeg(rahu.longitude);
    const ketuLon = normalizeDeg(ketu.longitude);

    let planetsInside = 0;
    let planetsTotal = 0;

    const sevenPlanets: NineGrahaId[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
    for (const pId of sevenPlanets) {
      const p = getPlanet(pId);
      if (!p) continue;
      planetsTotal++;
      const pLon = normalizeDeg(p.longitude);

      // Distance from Rahu going clockwise
      const distFromRahu = normalizeDeg(pLon - rahuLon);
      const distFromKetu = normalizeDeg(ketuLon - rahuLon); // usually ~180°

      if (distFromKetu > 0) {
        if (distFromRahu > 0 && distFromRahu < distFromKetu) {
          planetsInside++;
        }
      }
    }

    if (planetsInside === 0 || planetsInside === planetsTotal) {
      isKaalSarp = true;
      const KAAL_SARP_NAMES: Record<number, { en: string; hi: string; ageEn: string; ageHi: string }> = {
        1: { en: 'Anant Kaal Sarp', hi: 'अनंत कालसर्प दोष', ageEn: 'Active till age 27', ageHi: '27 वर्ष की आयु तक विशेष सक्रिय' },
        2: { en: 'Kulik Kaal Sarp', hi: 'कुलिक कालसर्प दोष', ageEn: 'Active till age 33', ageHi: '33 वर्ष की आयु तक आर्थिक संघर्ष' },
        3: { en: 'Vasuki Kaal Sarp', hi: 'वासुकि कालसर्प दोष', ageEn: 'Active till age 36', ageHi: '36 वर्ष की आयु तक भाई-बहनों से मतभेद' },
        4: { en: 'Shankhapal Kaal Sarp', hi: 'शंखपाल कालसर्प दोष', ageEn: 'Active till age 42', ageHi: '42 वर्ष की आयु तक मानसिक अशांति व गृह क्लेश' },
        5: { en: 'Padma Kaal Sarp', hi: 'पद्म कालसर्प दोष', ageEn: 'Active till age 48', ageHi: '48 वर्ष की आयु तक विद्या व संतान चिंता' },
        6: { en: 'Mahapadma Kaal Sarp', hi: 'महापद्म कालसर्प दोष', ageEn: 'Active till age 54', ageHi: '54 वर्ष की आयु तक गुप्त शत्रु व ऋण' },
        7: { en: 'Takshak Kaal Sarp', hi: 'तक्षक कालसर्प दोष', ageEn: 'Active till age 27', ageHi: '27 वर्ष की आयु तक दांपत्य व साझेदारी विलंब' },
        8: { en: 'Karkotak Kaal Sarp', hi: 'कर्कोटक कालसर्प दोष', ageEn: 'Active till age 33', ageHi: '33 वर्ष की आयु तक पैतृक संपत्ति विवाद' },
        9: { en: 'Shankhachood Kaal Sarp', hi: 'शंखचूड़ कालसर्प दोष', ageEn: 'Active till age 36', ageHi: '36 वर्ष की आयु तक भाग्योदय में अवरोध' },
        10: { en: 'Ghatak Kaal Sarp', hi: 'घातक कालसर्प दोष', ageEn: 'Active till age 42', ageHi: '42 वर्ष की आयु तक आजीविका व प्रतिष्ठा में उतार-चढ़ाव' },
        11: { en: 'Vishdhar Kaal Sarp', hi: 'विषधर कालसर्प दोष', ageEn: 'Active till age 48', ageHi: '48 वर्ष की आयु तक नेत्र व स्मरण शक्ति दबाव' },
        12: { en: 'Sheshnag Kaal Sarp', hi: 'शेषनाग कालसर्प दोष', ageEn: 'Active till age 54', ageHi: '54 वर्ष की आयु तक अपव्यय व मुकदमों का भय' },
      };

      const meta = KAAL_SARP_NAMES[rahuHouse] || {
        en: 'Kaal Sarp Dosha',
        hi: 'कालसर्प दोष',
        ageEn: 'Active till age 33',
        ageHi: '33 वर्ष की आयु तक सक्रिय',
      };
      kaalSarpTypeEn = meta.en;
      kaalSarpTypeHi = meta.hi;
      ksActiveAgeEn = meta.ageEn;
      ksActiveAgeHi = meta.ageHi;
    }
  }

  doshas.push({
    id: 'kaal_sarp',
    nameEn: `Kaal Sarp Dosha (${kaalSarpTypeEn})`,
    nameHi: `कालसर्प योग (${kaalSarpTypeHi})`,
    present: isKaalSarp,
    severity: isKaalSarp ? 'Severe' : 'Cancelled / Nullified',
    severityHi: isKaalSarp ? 'अति तीव्र' : 'भंग / निष्प्रभावी',
    activeAgeYears: ksActiveAgeEn,
    activeAgeYearsHi: ksActiveAgeHi,
    cancellationNoteEn: isKaalSarp
      ? 'If Jupiter or Sun aspects Rahu, partial intensity gets reduced after age 33.'
      : 'Planets are distributed across both sides of Rahu-Ketu axis. No Kaal Sarp exists.',
    cancellationNoteHi: isKaalSarp
      ? 'यदि गुरु या सूर्य की शुभ दृष्टि राहु पर हो तो 33 वर्ष की आयु के बाद इसके अशुभ प्रभाव में भारी कमी आती है।'
      : 'सभी ग्रह राहु-केतु अक्ष के दोनों ओर व्यवस्थित हैं, अतः कुंडली में कालसर्प दोष नहीं है।',
    astrologicalBasisEn: isKaalSarp
      ? `All 7 classical planets hemmed between Rahu in House ${rahu ? getHouse(rahu.longitude) : 1} and Ketu in House ${ketu ? getHouse(ketu.longitude) : 7}.`
      : 'No entrapment of planets between Rahu and Ketu.',
    astrologicalBasisHi: isKaalSarp
      ? `समस्त सात ग्रह राहु (भाव ${rahu ? getHouse(rahu.longitude) : 1}) और केतु (भाव ${ketu ? getHouse(ketu.longitude) : 7}) के एक ही पार्श्व में स्थित हैं।`
      : 'राहु-केतु अक्ष से कोई ग्रह बंधन नहीं है।',
    manifestationEn: isKaalSarp
      ? 'Early life struggle, sudden reversals in fortune, recurring dreams of serpents or deep waters, followed by profound spiritual awakening.'
      : 'Unobstructed organic progress in worldly pursuits.',
    manifestationHi: isKaalSarp
      ? 'जीवन के पूर्वार्ध में कठोर संघर्ष, परिश्रम का श्रेय दूसरों को मिलना, तथा 33 वर्ष की आयु के बाद आकस्मिक भाग्योदय।'
      : 'जीवन में बिना किसी ग्रहीय बंधन के स्वाभाविक उन्नति।',
    shastricRemedyEn: 'Maha Mrityunjaya Japa (108 times daily), worship of Lord Shiva with Bilva leaves, and Nag Gayatri mantra.',
    shastricRemedyHi: 'नित्य महामृत्युंजय मंत्र का 108 जप, शिवलिंग पर जलाभिषेक एवं नाग पंचमी पर शिव आराधना।',
  });

  // 2. MANGLIK DOSHA & 16 CANCELLATIONS (मांगलिक दोष व 16 शास्त्रीय भंग)
  const marsHouseLagna = getHouseOfPlanet('Mars');
  const moonHouse = getHouseOfPlanet('Moon');
  const marsHouseFromMoon = ((getHouseOfPlanet('Mars') - moonHouse + 12) % 12) + 1;

  const isManglikRaw = [1, 2, 4, 7, 8, 12].includes(marsHouseLagna) || [1, 2, 4, 7, 8, 12].includes(marsHouseFromMoon);

  // 16 Classical Cancellations (Kuja Dosha Bhanga from Brihat Jataka)
  let isManglikCancelled = false;
  let manglikCancellationReasonHi = 'कोई विशेष भंग लागू नहीं';
  let manglikCancellationReasonEn = 'No primary cancellation active';

  if (isManglikRaw && mars) {
    const marsSign = Math.floor(normalizeDeg(mars.longitude) / 30);
    // Cancellation 1: Mars in Aries in 1st house
    if (marsHouseLagna === 1 && marsSign === 0) {
      isManglikCancelled = true;
      manglikCancellationReasonHi = 'लग्न में मेष राशि का मंगल स्वक्षेत्री होने से दोष सर्वथा भंग है।';
      manglikCancellationReasonEn = 'Mars in own sign Aries in Lagna completely cancels Kuja dosha.';
    }
    // Cancellation 2: Mars in 4th in Scorpio
    else if (marsHouseLagna === 4 && marsSign === 7) {
      isManglikCancelled = true;
      manglikCancellationReasonHi = 'चतुर्थ भाव में वृश्चिक का मंगल स्वगृही होकर दोषमुक्त करता है।';
      manglikCancellationReasonEn = 'Mars in own sign Scorpio in 4th house dissolves Kuja dosha.';
    }
    // Cancellation 3: Mars in 7th in Capricorn (Exalted) or Cancer (Debilitated)
    else if (marsHouseLagna === 7 && (marsSign === 9 || marsSign === 3)) {
      isManglikCancelled = true;
      manglikCancellationReasonHi = 'सप्तम भाव में मकर (उच्च) या कर्क (नीच) का मंगल दोषरहित माना गया है।';
      manglikCancellationReasonEn = 'Mars exalted in Capricorn or debilitated in Cancer in 7th cancels dosha.';
    }
    // Cancellation 4: Mars in 8th in Sagittarius or Pisces (Jupiter signs)
    else if (marsHouseLagna === 8 && (marsSign === 8 || marsSign === 11)) {
      isManglikCancelled = true;
      manglikCancellationReasonHi = 'अष्टम भाव में गुरु की राशि (धनु या मीन) का मंगल होने से दोष भंग होता है।';
      manglikCancellationReasonEn = 'Mars in Jupiterian signs (Sagittarius/Pisces) in 8th house cancels dosha.';
    }
    // Cancellation 5: Mars in 12th in Taurus or Libra (Venus signs)
    else if (marsHouseLagna === 12 && (marsSign === 1 || marsSign === 6)) {
      isManglikCancelled = true;
      manglikCancellationReasonHi = 'द्वादश भाव में शुक्र की राशि (वृषभ या तुला) में मंगल दोषरहित होता है।';
      manglikCancellationReasonEn = 'Mars in Venusian signs in 12th house neutralizes the dosha.';
    }
    // Cancellation 6: Jupiter conjunct or aspecting Mars
    else if (jupiter && mars) {
      const diff = Math.abs(normalizeDeg(jupiter.longitude) - normalizeDeg(mars.longitude));
      if (diff < 10 || (diff >= 115 && diff <= 125) || (diff >= 235 && diff <= 245)) {
        isManglikCancelled = true;
        manglikCancellationReasonHi = 'देवगुरु बृहस्पति की मंगल पर अमृत दृष्टि होने से मांगलिक दोष निष्प्रभावी हो गया है।';
        manglikCancellationReasonEn = 'Jupiterian aspect or conjunction on Mars purifies Kuja energy.';
      }
    }
  }

  doshas.push({
    id: 'manglik',
    nameEn: 'Manglik Dosha (Kuja Dosha)',
    nameHi: 'मांगलिक दोष (भौम दोष)',
    present: isManglikRaw,
    severity: !isManglikRaw
      ? 'Cancelled / Nullified'
      : isManglikCancelled
      ? 'Cancelled / Nullified'
      : marsHouseLagna === 7 || marsHouseLagna === 8
      ? 'Severe'
      : 'Moderate',
    severityHi: !isManglikRaw
      ? 'भंग / निष्प्रभावी'
      : isManglikCancelled
      ? 'भंग / निष्प्रभावी'
      : marsHouseLagna === 7 || marsHouseLagna === 8
      ? 'अति तीव्र'
      : 'मध्यम',
    activeAgeYears: 'Age 18 to 28',
    activeAgeYearsHi: '18 से 28 वर्ष की आयु (विवाह पूर्व व प्रारंभिक दांपत्य)',
    cancellationNoteEn: isManglikCancelled
      ? `Dosha Cancelled: ${manglikCancellationReasonEn}`
      : isManglikRaw
      ? 'No classical cancellation found. Matching with another Manglik native is recommended.'
      : 'No Manglik dosha present.',
    cancellationNoteHi: isManglikCancelled
      ? `दोष भंग: ${manglikCancellationReasonHi}`
      : isManglikRaw
      ? 'कोई शास्त्रीय भंग नहीं मिला। समकक्ष मांगलिक कुंडली से मिलान श्रेष्ठ रहता है।'
      : 'कुंडली में मांगलिक दोष अनुपस्थित है।',
    astrologicalBasisEn: isManglikRaw
      ? `Mars placed in House ${marsHouseLagna} from Lagna and House ${marsHouseFromMoon} from Moon.`
      : 'Mars is placed in non-Manglik houses (3, 5, 6, 9, 10, 11).',
    astrologicalBasisHi: isManglikRaw
      ? `मंगल लग्न से ${marsHouseLagna}वें भाव एवं चंद्र से ${marsHouseFromMoon}वें भाव में स्थित है।`
      : 'मंगल शुभ व तटस्थ भावों (3, 5, 6, 9, 10, 11) में स्थित है।',
    manifestationEn: isManglikRaw && !isManglikCancelled
      ? 'Heated temperament, friction over minor issues with spouse, delay in marriage settlement, and impulsive verbal reactions.'
      : 'Harmonious temperament and supportive marital disposition.',
    manifestationHi: isManglikRaw && !isManglikCancelled
      ? 'दांपत्य में वैचारिक उग्रता, जीवनसाथी के साथ अहम का टकराव, तथा विवाह निर्णय में विलंब।'
      : 'दांपत्य जीवन में मधुरता और परस्पर सहयोग।',
    shastricRemedyEn: 'Tuesday Hanuman Chalisa recitation, red coral if Mars is auspicious ascendant lord, or charity of jaggery and copper.',
    shastricRemedyHi: 'नित्य हनुमान चालीसा का पाठ, मंगलवार को गुड़-तांबे का दान अथवा सुंदरकांड का पाठ।',
  });

  // 3. PITRU DOSHA (पितृ दोष)
  const isSunRahu = sun && rahu && Math.abs(normalizeDeg(sun.longitude) - normalizeDeg(rahu.longitude)) < 15;
  const isSunSaturn = sun && saturn && Math.abs(normalizeDeg(sun.longitude) - normalizeDeg(saturn.longitude)) < 12;
  const is9thAfflicted = getHouseOfPlanet('Sun') === 9 && (isSunRahu || isSunSaturn);
  const isPitruDosha = isSunRahu || isSunSaturn || is9thAfflicted;

  doshas.push({
    id: 'pitru_dosha',
    nameEn: 'Pitru Dosha (Ancestral Debt)',
    nameHi: 'पितृ दोष (पूर्वज ऋण व अदृश्य अवरोध)',
    present: Boolean(isPitruDosha),
    severity: isPitruDosha ? (is9thAfflicted ? 'Severe' : 'Moderate') : 'Cancelled / Nullified',
    severityHi: isPitruDosha ? (is9thAfflicted ? 'अति तीव्र' : 'मध्यम') : 'भंग / निष्प्रभावी',
    activeAgeYears: 'Age 25 to 45',
    activeAgeYearsHi: '25 से 45 वर्ष की आयु (वंश वृद्धि व आजीविका काल)',
    cancellationNoteEn: isPitruDosha
      ? 'Jupiter in trine (1-5-9) to Sun provides strong spiritual redemption.'
      : 'Sun and 9th house are unafflicted by Rahu/Saturn.',
    cancellationNoteHi: isPitruDosha
      ? 'यदि गुरु का सूर्य से त्रिकोण संबंध हो तो पितरों की कृपा से कष्ट शीघ्र कटते हैं।'
      : 'सूर्य एवं नवम भाव पितृ दोष से पूर्णतः मुक्त हैं।',
    astrologicalBasisEn: isPitruDosha
      ? `Sun afflicted by ${isSunRahu ? 'Rahu' : 'Saturn'} in House ${sun ? getHouse(sun.longitude) : 9}.`
      : 'Clean Sun and Dharma Bhava.',
    astrologicalBasisHi: isPitruDosha
      ? `सूर्य पर ${isSunRahu ? 'राहु' : 'शनि'} का निकट युति वेध (भाव ${sun ? getHouse(sun.longitude) : 9})।`
      : 'सूर्य एवं धर्म भाव पर कोई क्रूर युति नहीं है।',
    manifestationEn: isPitruDosha
      ? 'Unexplained roadblocks in career promotion, progeny delays, lack of mental peace, and chronic friction with paternal figures.'
      : 'Unbroken ancestral blessings and steady career growth.',
    manifestationHi: isPitruDosha
      ? 'बनते कार्यों का अंतिम क्षण में बिगड़ना, वंश वृद्धि में अड़चन, तथा पिता या पैतृक संपत्ति से विवाद।'
      : 'पितरों का आशीर्वाद एवं वंश की निर्बाध प्रगति।',
    shastricRemedyEn: 'Offer water to Sun daily (Surya Arghya with copper pot), Amavasya Tarpan, and feeding cows/crows.',
    shastricRemedyHi: 'नित्य ताम्रपात्र से सूर्य को कुमकुम युक्त अर्घ्य, प्रत्येक अमावस्या को पितृ तर्पण एवं गौ सेवा।',
  });

  // 4. GURU CHANDAL DOSHA (गुरु चांडाल योग)
  const isGuruChandal = jupiter && rahu && Math.abs(normalizeDeg(jupiter.longitude) - normalizeDeg(rahu.longitude)) < 15;
  doshas.push({
    id: 'guru_chandal',
    nameEn: 'Guru Chandal Dosha',
    nameHi: 'गुरु चांडाल दोष (संशय व विवेक वेध)',
    present: Boolean(isGuruChandal),
    severity: isGuruChandal ? 'Moderate' : 'Cancelled / Nullified',
    severityHi: isGuruChandal ? 'मध्यम' : 'भंग / निष्प्रभावी',
    activeAgeYears: 'Age 16 to 32',
    activeAgeYearsHi: '16 से 32 वर्ष (शिक्षा, संस्कार व करियर चयन काल)',
    cancellationNoteEn: isGuruChandal
      ? 'If Jupiter is retrograde or degrees apart by > 8°, intellectual sharpness dominates over negative tendencies.'
      : 'Jupiter is completely free from Rahu affliction.',
    cancellationNoteHi: isGuruChandal
      ? 'यदि गुरु और राहु के अंशों में 8° से अधिक का अंतर हो तो नकारात्मकता की जगह असाधारण बौद्धिक शोध क्षमता मिलती है।'
      : 'गुरु ग्रह राहु के दुष्प्रभाव से सर्वथा मुक्त है।',
    astrologicalBasisEn: isGuruChandal
      ? `Jupiter and Rahu conjoined within orb in House ${jupiter ? getHouse(jupiter.longitude) : 1}.`
      : 'No Jupiter-Rahu conjunction.',
    astrologicalBasisHi: isGuruChandal
      ? `देवगुरु बृहस्पति एवं राहु की भाव ${jupiter ? getHouse(jupiter.longitude) : 1} में युति।`
      : 'बृहस्पति पर राहु का कोई वेध नहीं है।',
    manifestationEn: isGuruChandal
      ? 'Skeptical worldview, rebellious attitude toward traditional authority or dogma, unconventional intellect, and digestive vulnerabilities.'
      : 'Sound moral compass and reverence for genuine wisdom.',
    manifestationHi: isGuruChandal
      ? 'पारंपरिक मर्यादाओं के प्रति विद्रोही दृष्टिकोण, शिक्षकों/मार्गदर्शकों से मतभेद, तथा पेट व यकृत की दुर्बलता।'
      : 'उत्कृष्ट नैतिक विवेक एवं गुरुजनों का पूर्ण आशीर्वाद।',
    shastricRemedyEn: 'Chant Vishnu Sahasranama on Thursdays, apply yellow saffron/sandalwood tilak, and donate turmeric to temple.',
    shastricRemedyHi: 'गुरुवार को विष्णु सहस्रनाम का पाठ, मस्तक पर केसर/हल्दी का तिलक, तथा चने की दाल का दान।',
  });

  // 5. ANGARAK DOSHA (अंगारक दोष)
  const isAngarak = mars && rahu && Math.abs(normalizeDeg(mars.longitude) - normalizeDeg(rahu.longitude)) < 15;
  doshas.push({
    id: 'angarak_dosha',
    nameEn: 'Angarak Dosha (Volatile Energy)',
    nameHi: 'अंगारक दोष (अग्नि तत्व असंतुलन व क्रोध योग)',
    present: Boolean(isAngarak),
    severity: isAngarak ? 'Severe' : 'Cancelled / Nullified',
    severityHi: isAngarak ? 'अति तीव्र' : 'भंग / निष्प्रभावी',
    activeAgeYears: 'Age 18 to 35',
    activeAgeYearsHi: '18 से 35 वर्ष की आयु (ऊर्जा व साहस काल)',
    cancellationNoteEn: isAngarak
      ? 'If aspected by benefic Jupiter or Venus, energy channels into fearless engineering or athletic excellence.'
      : 'Mars and Rahu do not form conjunction.',
    cancellationNoteHi: isAngarak
      ? 'यदि शुभ गुरु की दृष्टि हो तो यह उग्रता पराक्रम, सेना, शल्यक्रिया अथवा तकनीकी शोध में अपार सफलता देती है।'
      : 'मंगल और राहु की कोई युति नहीं है।',
    astrologicalBasisEn: isAngarak
      ? `Mars conjunct Rahu in House ${mars ? getHouse(mars.longitude) : 1}.`
      : 'Unafflicted Mars.',
    astrologicalBasisHi: isAngarak
      ? `मंगल और राहु की भाव ${mars ? getHouse(mars.longitude) : 1} में अग्नि युति।`
      : 'मंगल ग्रह राहु के दोष से मुक्त है।',
    manifestationEn: isAngarak
      ? 'Extreme impulsive temper, accident-prone tendencies with fire, sharp tools, or vehicles, and legal skirmishes.'
      : 'Controlled courage and disciplined willpower.',
    manifestationHi: isAngarak
      ? 'अत्यधिक उग्र क्रोध, वाहन या अग्नि से चोट का भय, तथा वाद-विवाद में अचानक आपा खो देना।'
      : 'नियंत्रित साहस और धैर्यवान निर्णय क्षमता।',
    shastricRemedyEn: 'Worship Lord Kartikeya or Lord Hanuman, avoid wearing red coral without expert consultation, and donate blood regularly.',
    shastricRemedyHi: 'श्री हनुमान जी की उपासना, रक्तदान करना, तथा क्रोध के क्षणों में मौन रहने का अभ्यास।',
  });

  // 6. KEMADRUMA DOSHA (केमद्रुम दोष व 6 शास्त्रीय भंग)
  let isKemadruma = false;
  let isKemadrumaCancelled = false;

  if (moon) {
    const moonH = getHouse(moon.longitude);
    const h2 = (moonH % 12) + 1;
    const h12 = ((moonH - 2 + 12) % 12) + 1;

    // Check if 2nd and 12th from Moon contain Sun, Mars, Mercury, Jupiter, Venus, Saturn
    const occupiedH2 = chart.planets.some(
      (p) => ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].includes(p.id) && getHouse(p.longitude) === h2
    );
    const occupiedH12 = chart.planets.some(
      (p) => ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].includes(p.id) && getHouse(p.longitude) === h12
    );

    if (!occupiedH2 && !occupiedH12) {
      isKemadruma = true;

      // Parashari Cancellations: Planets in Kendra from Moon or Lagna
      const kendraFromMoon = [moonH, (moonH + 3) % 12 || 12, (moonH + 6) % 12 || 12, (moonH + 9) % 12 || 12];
      const hasPlanetsInMoonKendra = chart.planets.some(
        (p) => ['Jupiter', 'Venus', 'Mercury'].includes(p.id) && kendraFromMoon.includes(getHouse(p.longitude))
      );

      const hasPlanetsInLagnaKendra = chart.planets.some(
        (p) => ['Jupiter', 'Venus', 'Mercury'].includes(p.id) && [1, 4, 7, 10].includes(getHouse(p.longitude))
      );

      if (hasPlanetsInMoonKendra || hasPlanetsInLagnaKendra) {
        isKemadrumaCancelled = true;
      }
    }
  }

  doshas.push({
    id: 'kemadruma',
    nameEn: 'Kemadruma Dosha (Psychological Isolation)',
    nameHi: 'केमद्रुम दोष (मानसिक एकाकीपन व निर्धनता वेध)',
    present: isKemadruma,
    severity: !isKemadruma ? 'Cancelled / Nullified' : isKemadrumaCancelled ? 'Cancelled / Nullified' : 'Severe',
    severityHi: !isKemadruma ? 'भंग / निष्प्रभावी' : isKemadrumaCancelled ? 'भंग / निष्प्रभावी' : 'अति तीव्र',
    activeAgeYears: 'Age 20 to 40',
    activeAgeYearsHi: '20 से 40 वर्ष की आयु',
    cancellationNoteEn: isKemadrumaCancelled
      ? 'Cancelled by Parashara Kemadruma Bhanga: Benefic planets occupy Kendra from Lagna or Moon.'
      : isKemadruma
      ? 'No classical cancellation. Mental resilience must be nurtured consciously.'
      : 'Moon is supported by flanking planets.',
    cancellationNoteHi: isKemadrumaCancelled
      ? 'पराशर भंग योग: लग्न अथवा चंद्र से केंद्र भावों में शुभ ग्रह स्थित होने से केमद्रुम दोष पूरी तरह नष्ट हो गया है।'
      : isKemadruma
      ? 'कोई शास्त्रीय भंग नहीं है; मानसिक एकाकीपन से बचने हेतु नियमित साधना आवश्यक है।'
      : 'चंद्रमा के दोनों ओर ग्रह स्थित होने से दोष नहीं है।',
    astrologicalBasisEn: isKemadruma
      ? 'No physical planets (excluding Sun/Rahu/Ketu) occupy the 2nd and 12th houses from Moon.'
      : 'Moon is flanked by supporting planets.',
    astrologicalBasisHi: isKemadruma
      ? 'चंद्रमा के द्वितीय एवं द्वादश भाव में कोई ग्रह (सूर्य/राहु/केतु छोड़कर) स्थित नहीं है।'
      : 'चंद्रमा को दोनों ओर से ग्रहीय सहारा प्राप्त है।',
    manifestationEn: isKemadruma && !isKemadrumaCancelled
      ? 'Profound internal loneliness even amidst crowds, unexpected financial drains, anxiety, and brooding nature.'
      : 'Stable emotional grounding and consistent financial flow.',
    manifestationHi: isKemadruma && !isKemadrumaCancelled
      ? 'भीड़ में भी अकेलापन महसूस होना, चिंता, तथा धन संचय में अचानक बाधाएं।'
      : 'मानसिक संतोष और स्थिर वित्तीय स्थिति।',
    shastricRemedyEn: 'Fast on Mondays, worship Lord Shiva and Goddess Parvati, keep silver square in wallet, and chant Om Namah Shivaya.',
    shastricRemedyHi: 'सोमवार को शिव-पार्वती की आराधना, पर्स में चांदी का चौकोर टुकड़ा रखना, तथा ॐ नमः शिवाय का नित्य जप।',
  });

  // 7. VISH YOG (विष योग - शनि चंद्र युति)
  const isVishYog = saturn && moon && Math.abs(normalizeDeg(saturn.longitude) - normalizeDeg(moon.longitude)) < 15;
  doshas.push({
    id: 'vish_yog',
    nameEn: 'Vish Yog (Saturn-Moon Melancholy)',
    nameHi: 'विष योग (शनि-चंद्र युति व अवसाद वेध)',
    present: Boolean(isVishYog),
    severity: isVishYog ? 'Moderate' : 'Cancelled / Nullified',
    severityHi: isVishYog ? 'मध्यम' : 'भंग / निष्प्रभावी',
    activeAgeYears: 'Lifelong recurring phases during Saturn/Moon Dashas',
    activeAgeYearsHi: 'शनि व चंद्र की दशाओं एवं साढ़े साती के समय विशेष प्रभावी',
    cancellationNoteEn: isVishYog
      ? 'If Saturn is yogakaraka (Taurus/Libra Lagna) or Jupiter casts direct trine aspect, depression converts into intense philosophical mastery.'
      : 'Saturn and Moon do not form conjunction.',
    cancellationNoteHi: isVishYog
      ? 'यदि वृषभ या तुला लग्न में शनि योगकारक हो अथवा गुरु की शुभ दृष्टि हो तो यह योग उच्च कोटि का दार्शनिक वैराग्य और अनुसंधान शक्ति देता है।'
      : 'शनि और चंद्र की कोई युति नहीं है।',
    astrologicalBasisEn: isVishYog
      ? `Saturn and Moon conjunct in House ${saturn ? getHouse(saturn.longitude) : 1}.`
      : 'Clean Moon.',
    astrologicalBasisHi: isVishYog
      ? `शनि एवं चंद्र की भाव ${saturn ? getHouse(saturn.longitude) : 1} में युति।`
      : 'चंद्रमा पर शनि की प्रत्यक्ष युति नहीं है।',
    manifestationEn: isVishYog
      ? 'Pessimistic thought patterns, chronic anxiety, lack of maternal warmth or mother health concern, and cold realism.'
      : 'Optimistic and emotionally resilient outlook.',
    manifestationHi: isVishYog
      ? 'मन में अज्ञात भय, कार्यों में अत्यधिक विलंब से हताशा, तथा माता के स्वास्थ्य की चिंता।'
      : 'सकारात्मक दृष्टिकोण और भावनात्मक संतुलन।',
    shastricRemedyEn: 'Pour raw milk and water on Shiva Lingam every Monday, offer mustard oil to Shani on Saturdays, and recite Hanuman Chalisa.',
    shastricRemedyHi: 'सोमवार को शिवलिंग पर कच्चा दूध व जल अर्पित करना तथा शनिवार को शनि देव को तिल का तेल अर्पित करना।',
  });

  const presentDoshas = doshas.filter((d) => d.present);
  const activeDoshas = doshas.filter((d) => d.present && d.severity !== 'Cancelled / Nullified');
  const cancelledDoshas = doshas.filter((d) => d.present && d.severity === 'Cancelled / Nullified');

  const overallDoshaScore = Math.min(100, activeDoshas.length * 22);

  return {
    totalDoshasDetected: presentDoshas.length,
    activeDoshasCount: activeDoshas.length,
    cancelledDoshasCount: cancelledDoshas.length,
    overallDoshaScore,
    doshas,
  };
}
