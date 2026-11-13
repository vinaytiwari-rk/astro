import * as Astronomy from 'astronomy-engine';
import type { ChartData, PlanetId } from '../types';
import { NAKSHATRAS } from '../constants';
import {
  buildBaseBodyPosition,
  getTropicalPosition,
  getTropicalSpeedDegPerDay,
} from '../ephemeris';
import { evaluateDignity, getDivisionalSignIndex } from '../vargas';
import { normalizeDeg } from '../time';
import { trPlanet, trSign, trTerm, type AppLanguage } from '../../i18n/translations';

const SIGN_NAMES_EN = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const SIGN_NAMES_HI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
];

export interface PlanetEventPrediction {
  id: PlanetId;
  nameEn: string;
  nameHi: string;
  symbol: string;
  isOuterPlanet: boolean;
  houseNumber: number; // 1..12
  signIndex: number;
  signNameEn: string;
  signNameHi: string;
  nakshatraName: string;
  pada: number;
  nakshatraLord: string;
  dms: string;
  dignity: string;
  isRetrograde: boolean;
  isCombust: boolean;
  isVargottama: boolean;
  ownedHouses: number[];
  conjoinedPlanets: PlanetId[];
  aspectingPlanets: PlanetId[];

  // Placement Overview
  placementSummaryEn: string;
  placementSummaryHi: string;

  // Concrete Positive Events
  positiveEventsEn: string[];
  positiveEventsHi: string[];

  // Concrete Negative Events & Hazards
  negativeEventsEn: string[];
  negativeEventsHi: string[];

  // Timing Triggers
  timingTriggersEn: string;
  timingTriggersHi: string;
  keyAgeWindows: number[];

  // Actionable Remedies
  remediesEn: string[];
  remediesHi: string[];
}

export interface TwelvePlanetsPredictionsReport {
  planets: PlanetEventPrediction[];
  activeConjunctionsSummaryEn: string;
  activeConjunctionsSummaryHi: string;
  criticalPlanetaryAlertsEn: string[];
  criticalPlanetaryAlertsHi: string[];
}

const PLANET_SYMBOLS: Record<PlanetId, string> = {
  Sun: '☉',
  Moon: '☽',
  Mars: '♂',
  Mercury: '☿',
  Jupiter: '♃',
  Venus: '♀',
  Saturn: '♄',
  Rahu: '☊',
  Ketu: '☋',
  Uranus: '♅',
  Neptune: '♆',
  Pluto: '♇',
};

const PLANET_NAMES_HI: Record<PlanetId, string> = {
  Sun: 'सूर्य (Surya)',
  Moon: 'चंद्र (Chandra)',
  Mars: 'मंगल (Mangal)',
  Mercury: 'बुध (Budha)',
  Jupiter: 'गुरु (Guru / Brihaspati)',
  Venus: 'शुक्र (Shukra)',
  Saturn: 'शनि (Shani)',
  Rahu: 'राहु (Rahu)',
  Ketu: 'केतु (Ketu)',
  Uranus: 'हर्षल / अरुण (Uranus)',
  Neptune: 'वरुण (Neptune)',
  Pluto: 'यम (Pluto)',
};

const PLANET_NAMES_EN: Record<PlanetId, string> = {
  Sun: 'Sun (Surya)',
  Moon: 'Moon (Chandra)',
  Mars: 'Mars (Mangal)',
  Mercury: 'Mercury (Budha)',
  Jupiter: 'Jupiter (Guru)',
  Venus: 'Venus (Shukra)',
  Saturn: 'Saturn (Shani)',
  Rahu: 'Rahu (North Node)',
  Ketu: 'Ketu (South Node)',
  Uranus: 'Uranus (Herschel / Revolution)',
  Neptune: 'Neptune (Intuition / Illusion)',
  Pluto: 'Pluto (Transformation / Power)',
};

// House Significations for Event Synthesis
const HOUSE_THEMES = [
  { en: 'Self, Vitality & Stature', hi: 'तनु भाव, स्वास्थ्य व प्रतिष्ठा' },
  { en: 'Wealth, Family & Speech', hi: 'धन कोष, परिवार व वाणी' },
  { en: 'Courage, Enterprise & Siblings', hi: 'पराक्रम, उद्यम व बंधु सुख' },
  { en: 'Mother, Home, Lands & Vehicles', hi: 'माता, गृह, भूमि व वाहन' },
  { en: 'Intellect, Children & Speculation', hi: 'बुद्धि, संतान व पूर्व-पुण्य' },
  { en: 'Enemies, Debts, Disease & Litigation', hi: 'रोग, ऋण, शत्रु व मुकदमे' },
  { en: 'Spouse, Partnership & Public Deals', hi: 'विवाह, साझेदारी व लोक-व्यवहार' },
  { en: 'Longevity, Sudden Crises & Inheritance', hi: 'आयु, आकस्मिक संकट व गुप्त धन' },
  { en: 'Fortune, Dharma, Higher Wisdom & Father', hi: 'भाग्य, धर्म, तीर्थ व पिता' },
  { en: 'Career, Fame, Governance & Authority', hi: 'आजीविका, पद, प्रतिष्ठा व शासन' },
  { en: 'Gains, Ambition, Networks & Inflow', hi: 'लाभ, आय स्रोत व अभिलाषा पूर्ति' },
  { en: 'Expenses, Foreign Relocation & Liberation', hi: 'व्यय, विदेश गमन व मोक्ष' },
];

export function computeTwelvePlanetsPredictions(chart: ChartData): TwelvePlanetsPredictionsReport {
  const lagnaSignIndex = chart.ascendant.signIndex;

  // Determine owned houses for Vedic planets
  function getOwnedHouses(pId: PlanetId): number[] {
    const houses: number[] = [];
    for (let h = 1; h <= 12; h++) {
      const sign = (lagnaSignIndex + h - 1) % 12;
      if (pId === 'Sun' && sign === 4) houses.push(h); // Leo
      if (pId === 'Moon' && sign === 3) houses.push(h); // Cancer
      if (pId === 'Mars' && (sign === 0 || sign === 7)) houses.push(h); // Aries, Scorpio
      if (pId === 'Mercury' && (sign === 2 || sign === 5)) houses.push(h); // Gemini, Virgo
      if (pId === 'Jupiter' && (sign === 8 || sign === 11)) houses.push(h); // Sagittarius, Pisces
      if (pId === 'Venus' && (sign === 1 || sign === 6)) houses.push(h); // Taurus, Libra
      if (pId === 'Saturn' && (sign === 9 || sign === 10)) houses.push(h); // Capricorn, Aquarius
    }
    return houses;
  }

  // Filter out any non-planet entries such as Ascendant
  const validPlanets = chart.planets.filter((p): p is typeof p & { id: PlanetId } => p.id !== 'Asc');

  // Guarantee that all 3 outer planets (Uranus, Neptune, Pluto) are evaluated even if not initially toggled
  const outerPlanetsList: PlanetId[] = ['Uranus', 'Neptune', 'Pluto'];
  const missingOuter = outerPlanetsList.filter((id) => !validPlanets.some((p) => p.id === id));
  if (missingOuter.length > 0 && chart.utcMs) {
    const time = new Astronomy.AstroTime(new Date(chart.utcMs));
    for (const id of missingOuter) {
      const pos = getTropicalPosition(id, time, chart.settings.nodeMode);
      const sidLon = normalizeDeg(pos.lon - chart.ayanamsaDeg);
      const speed = getTropicalSpeedDegPerDay(id, time, chart.settings.nodeMode);
      const isRetro = speed < 0;
      const d1Sign = Math.floor(sidLon / 30) % 12;
      const d9Sign = getDivisionalSignIndex(sidLon, 'D9', chart.settings.horaMode);
      const body = buildBaseBodyPosition({
        id,
        siderealLon: sidLon,
        tropicalLon: pos.lon,
        latitude: pos.lat,
        speedDegPerDay: speed,
        isCombust: false,
        isVargottama: d1Sign === d9Sign,
        houses: chart.houses,
        houseSystem: chart.settings.houseSystem,
        ascSignIndex: chart.ascendant.signIndex,
      });
      body.dignity = evaluateDignity(id, body.signIndex, body.degreeInSign, chart.maitriMatrix);
      validPlanets.push(body as any);
    }
  }

  // Precalculate conjunctions & aspects
  const houseOccupantsMap = new Map<number, PlanetId[]>();
  for (const p of validPlanets) {
    const list = houseOccupantsMap.get(p.houseNumber) || [];
    list.push(p.id);
    houseOccupantsMap.set(p.houseNumber, list);
  }

  const results: PlanetEventPrediction[] = [];
  const criticalAlertsEn: string[] = [];
  const criticalAlertsHi: string[] = [];

  for (const p of validPlanets) {
    const hNum = p.houseNumber;
    const signIdx = p.signIndex;
    const signNameEn = SIGN_NAMES_EN[signIdx];
    const signNameHi = SIGN_NAMES_HI[signIdx];
    const isOuter = p.id === 'Uranus' || p.id === 'Neptune' || p.id === 'Pluto';
    const owned = getOwnedHouses(p.id);

    const conjoined = (houseOccupantsMap.get(hNum) || []).filter((id) => id !== p.id);

    // Identify aspecting planets
    const aspecting: PlanetId[] = [];
    for (const other of validPlanets) {
      if (other.id === p.id) continue;
      const dist = (p.houseNumber - other.houseNumber + 12) % 12;
      // 7th house mutual aspect for all
      if (dist === 6) aspecting.push(other.id);
      // Special aspects
      if (other.id === 'Mars' && (dist === 3 || dist === 7)) aspecting.push(other.id); // 4th, 8th
      if (other.id === 'Jupiter' && (dist === 4 || dist === 8)) aspecting.push(other.id); // 5th, 9th
      if (other.id === 'Saturn' && (dist === 2 || dist === 9)) aspecting.push(other.id); // 3rd, 10th
      if ((other.id === 'Rahu' || other.id === 'Ketu') && (dist === 4 || dist === 8)) aspecting.push(other.id);
    }

    const isExalted = p.dignity === 'Exalted';
    const isDebilitated = p.dignity === 'Debilitated';
    const isOwn = p.dignity === 'Own Sign' || p.dignity === 'Moolatrikona';
    const isTrikona = hNum === 1 || hNum === 5 || hNum === 9;
    const isKendra = hNum === 1 || hNum === 4 || hNum === 7 || hNum === 10;
    const isDusthana = hNum === 6 || hNum === 8 || hNum === 12;

    const positiveEventsEn: string[] = [];
    const positiveEventsHi: string[] = [];
    const negativeEventsEn: string[] = [];
    const negativeEventsHi: string[] = [];
    const remediesEn: string[] = [];
    const remediesHi: string[] = [];
    let timingEn = '';
    let timingHi = '';
    const ageWindows: number[] = [];

    // --- SYNTHESIS BY PLANET ---
    switch (p.id) {
      case 'Sun': {
        ageWindows.push(21, 22, 28, 48, 50);
        timingEn = `Active during Sun Mahadasha (6 Years), Sun Antardashas, and annual transit through Aries (exaltation), Leo (own sign), and 10th House.`;
        timingHi = `सूर्य की 6-वर्षीय महादशा, अंतर्दशाओं, तथा मेष राशि (उच्च), सिंह राशि व दशम भाव में सूर्य के वार्षिक गोचर काल में विशेष फल घटित होंगे।`;

        if (isExalted || isOwn || isKendra || isTrikona) {
          positiveEventsEn.push(
            `High administrative rank, governmental favor, or leadership mandate in professional sphere.`,
            `Father’s rise in reputation and ancestral estate blessings.`,
            `Acquisition of executive authority, public honors, and powerful mentors.`
          );
          positiveEventsHi.push(
            `प्रशासनिक पद, सरकारी कार्यों में सफलता, अथवा कार्यक्षेत्र में शीर्ष नेतृत्व का अवसर।`,
            `पिता के मान-सम्मान व प्रतिष्ठा में वृद्धि तथा पैतृक संपत्ति का लाभ।`,
            `उच्चाधिकारियों का सहयोग, सामाजिक प्रभुत्व एवं राजकीय पुरस्कार/सम्मान प्राप्ति।`
          );
        } else {
          positiveEventsEn.push(
            `Self-made willpower and independent perseverance overcoming difficult odds.`,
            `Steady gradual career stability through meticulous personal effort.`
          );
          positiveEventsHi.push(
            `आत्म-संघर्ष से विकसित दृढ़ इच्छाशक्ति एवं विपरीत परिस्थितियों से उबरने की क्षमता।`,
            `कठिन व्यक्तिगत परिश्रम द्वारा आजीविका में क्रमिक स्थायित्व।`
          );
        }

        if (isDebilitated || isDusthana || p.isCombust) {
          negativeEventsEn.push(
            `Ego friction with superiors, bureaucratic audit hurdles, or penalty risks in public affairs.`,
            `Cardiovascular strain, vitality drops, eye weakness (specifically right eye), or chronic bone density fatigue.`,
            `Strained relations or health vulnerability for father during Sun's adverse dasha windows.`
          );
          negativeEventsHi.push(
            `उच्चाधिकारियों से वैचारिक मतभेद, सरकारी/विभागीय जांच या पेनल्टी का जोखिम।`,
            `हृदय विकार, नेत्र-कष्ट (विशेषकर दाईं आंख), अस्थि दुर्बलता अथवा जीवनी शक्ति में अचानक गिरावट।`,
            `सूर्य की प्रतिकूल दशा में पिता के स्वास्थ्य में गिरावट अथवा पिता के साथ मतभेद।`
          );
          criticalAlertsEn.push(`Sun in H${hNum} warns against conflict with governmental authorities & cardiovascular health strain.`);
          criticalAlertsHi.push(`सूर्य भाव ${hNum} में स्थित होकर शासन-प्रशासन से टकराव व हृदय/नेत्र स्वास्थ्य में सावधानी की चेतावनी देता है।`);
        } else {
          negativeEventsEn.push(
            `Tendency towards excessive pride or impatience when authority is questioned.`,
            `Over-exhaustion caused by taking on unilateral institutional responsibilities.`
          );
          negativeEventsHi.push(
            `अहंकार या अधैर्य के कारण सहयोगियों के साथ कभी-कभार तनाव।`,
            `अकेले सारे दायित्व संभालने के कारण शारीरिक व मानसिक थकान।`
          );
        }

        remediesEn.push(
          `Offer early morning water (Surya Arghya) in a pure copper vessel with red sandalwood and flowers.`,
          `Recite Aditya Hridaya Stotra or Gayatri Mantra 108 times on Sundays.`,
          `Donate whole wheat or copper utensils to deserving individuals on Shukla Paksha Sundays.`
        );
        remediesHi.push(
          `नित्य प्रातः तांबे के लोटे में रोली-अक्षत मिलाकर भगवान सूर्य को तांबे के पात्र से अर्घ्य दें।`,
          `रविवार को आदित्य हृदय स्तोत्र अथवा 108 बार गायत्री मंत्र का पाठ करें।`,
          `शुक्ल पक्ष के रविवार को गेहूं, गुड़ अथवा तांबे के बर्तन का सात्विक दान करें।`
        );
        break;
      }

      case 'Moon': {
        ageWindows.push(23, 24, 32, 45);
        timingEn = `Active during Moon Mahadasha (10 Years), Moon sub-periods, full moon phases (Purnima), and Saturn Sade Sati transit cycles.`;
        timingHi = `चंद्रमा की 10-वर्षीय महादशा, अंतर्दशाओं, पूर्णिमा तिथियों तथा शनि की साढ़े साती/ढैय्या काल में फल प्रत्यक्ष होंगे।`;

        if (isExalted || isOwn || isTrikona || isKendra) {
          positiveEventsEn.push(
            `Flourishing public goodwill, mass appeal, and exceptional intuitive business perception.`,
            `Deep emotional contentment, mother's longevity & maternal property gains.`,
            `Lucrative foreign travel, liquid wealth growth, and prosperous home ambiance.`
          );
          positiveEventsHi.push(
            `जनप्रियता, लोक-स्वीकार्यता एवं व्यापार में असाधारण अंतर्ज्ञान व दूरदर्शिता का लाभ।`,
            `मातृ सुख में वृद्धि, माता का आशीर्वाद व ननिहाल/मातृपक्ष से संपत्ति लाभ।`,
            `विदेश यात्राओं से लाभ, तरल धन (कैश फ्लो) में सतत वृद्धि तथा गृह-सुख का विस्तार।`
          );
        } else {
          positiveEventsEn.push(
            `Rich imaginative mind, artistic taste, and adaptability to changing life conditions.`,
            `Support from maternal figures and empathetic connection with public.`
          );
          positiveEventsHi.push(
            `रचनात्मक कल्पनाशक्ति, कलात्मक सुरुचि एवं परिस्थितियों के अनुकूल स्वयं को ढालने की क्षमता।`,
            `स्त्री वर्ग व जनसामान्य से भावनात्मक सहयोग की प्राप्ति।`
          );
        }

        if (isDebilitated || isDusthana || p.isCombust) {
          negativeEventsEn.push(
            `Severe mood swings, anxiety spikes, insomnia, or psychosomatic vulnerability during dark fortnights.`,
            `Respiratory or phlegmatic distress, fluid imbalance, or recurrent digestive sluggishness.`,
            `Mother's health complications or periods of emotional alienation from family.`
          );
          negativeEventsHi.push(
            `गंभीर मानसिक अवसाद, अज्ञात भय, अनिद्रा अथवा कृष्ण पक्ष में भावनात्मक अस्थिरता।`,
            `कफ विकार, फेफड़ों में संक्रमण, जलभय अथवा पाचन तंत्र की दुर्बलता।`,
            `माता के स्वास्थ्य में आकस्मिक कष्ट अथवा घरेलू वातावरण में अशांति का दौर।`
          );
          criticalAlertsEn.push(`Moon in H${hNum} indicates mental anxiety spikes and emotional vulnerability requiring grounding.`);
          criticalAlertsHi.push(`चंद्र भाव ${hNum} में मानसिक अशांति, अनिद्रा व भावनात्मक उतार-चढ़ाव की ओर संकेत करता है।`);
        } else {
          negativeEventsEn.push(
            `Over-sensitivity to casual criticism and periodic decision vacillation.`,
            `Emotional expenditures driven by impulsive moods.`
          );
          negativeEventsHi.push(
            `अत्यधिक भावुकता के कारण दूसरों की बातों का जल्दी बुरा मान जाना।`,
            `क्षणिक आवेश में आकर भावनात्मक या अनावश्यक खर्च कर बैठना।`
          );
        }

        remediesEn.push(
          `Offer milk mixed with water on a Shiva Lingam on Mondays with Om Namah Shivaya japa.`,
          `Wear a natural South Sea pearl in silver on the little finger (if functionally benefic).`,
          `Practice daily Chandra Bhedana Pranayama and avoid drinking cold water at night.`
        );
        remediesHi.push(
          `सोमवार को शिवलिंग पर कच्चा दूध व जल अर्पित करें तथा ॐ नमः शिवाय का 108 बार जप करें।`,
          `चांदी की अंगूठी में मोती कनिष्ठिका अंगुली में धारण करें (यदि कुंडली में योगकारक हो)।`,
          `पूर्णिमा का उपवास रखें, नित्य प्राणायाम करें एवं रात्रि में दूध/ठंडे जल का परहेज रखें।`
        );
        break;
      }

      case 'Mars': {
        ageWindows.push(27, 28, 33, 44);
        timingEn = `Active during Mars Mahadasha (7 Years), Mars sub-periods, and transits across 1st, 4th, 7th, 8th, 10th and 12th houses.`;
        timingHi = `मंगल की 7-वर्षीय महादशा, अंतर्दशाओं, तथा लग्न, चतुर्थ, सप्तम, अष्टम, दशम व द्वादश भाव में मंगल के गोचर काल में सक्रिय रहेगा।`;

        if (isExalted || isOwn || isKendra || isTrikona) {
          positiveEventsEn.push(
            `Acquisition of valuable landed property, residential buildings, and commanding vehicles.`,
            `Decisive victory over adversaries, top rank in competitive exams, sports, or litigation.`,
            `Rapid executive promotions in engineering, defense, surgery, real estate, or entrepreneurial ventures.`
          );
          positiveEventsHi.push(
            `अचल संपत्ति (भूमि, भवन, फ्लैट) का क्रय तथा उत्तम वाहन सुख की प्राप्ति।`,
            `शत्रुओं पर पूर्ण विजय, प्रतियोगी परीक्षाओं व कानूनी विवादों में निर्णायक सफलता।`,
            `इंजीनियरिंग, रक्षा, पुलिस, शल्य चिकित्सा (सर्जरी) या रियल एस्टेट में त्वरित पदोन्नति व ख्याति।`
          );
        } else {
          positiveEventsEn.push(
            `Undaunted physical courage, high energy levels, and direct crisis management capability.`,
            `Brotherly camaraderie and protective leadership over team members.`
          );
          positiveEventsHi.push(
            `निडरता, उच्च ऊर्जा स्तर तथा संकट के समय सीधे समाधान निकालने का शौर्य।`,
            `भाइयों का सहयोग तथा कार्यस्थल पर टीम का साहसिक नेतृत्व।`
          );
        }

        if (isDebilitated || isDusthana || p.isCombust) {
          negativeEventsEn.push(
            `Sudden accidental injuries, surgical interventions, blood/bone marrow disorders, or burn hazards.`,
            `Fierce disputes with siblings or land co-owners leading to arbitration.`,
            `Manglik strain: explosive temper flare-ups causing marital friction or delayed domestic settlement.`
          );
          negativeEventsHi.push(
            `आकस्मिक चोट, दुर्घटना, शल्य चिकित्सा (ऑपरेशन), रक्त विकार या अग्नि/वाहन से जोखिम।`,
            `भाइयों अथवा सहकर्मियों से संपत्ति को लेकर कटु विवाद या मुकद्दमेबाज़ी की आशंका।`,
            `मांगलिक प्रभाव: अत्यधिक क्रोध व जल्दबाजी के कारण दांपत्य सुख में तनाव अथवा विवाह में विलंब।`
          );
          criticalAlertsEn.push(`Mars in H${hNum} signals blood/accident risks and temper volatility; drive and handle tools safely.`);
          criticalAlertsHi.push(`मंगल भाव ${hNum} में दुर्घटना, शल्य-चिकित्सा व क्रोध पर संयम बरतने की स्पष्ट चेतावनी देता है।`);
        } else {
          negativeEventsEn.push(
            `Occasional rash impulses or haste leading to rework in complex projects.`,
            `Tendency to confront rather than negotiate in delicate disputes.`
          );
          negativeEventsHi.push(
            `जल्दबाजी या उग्रता में आकर निर्णय लेने से बनते कार्यों में विलंब।`,
            `संवाद की जगह सीधे टकराव का मार्ग चुनना।`
          );
        }

        remediesEn.push(
          `Chant the Hanuman Chalisa or Sundarkanda daily, especially on Tuesdays and Saturdays.`,
          `Donate red lentils (masoor dal) and jaggery to laborers or temple kitchens on Tuesdays.`,
          `Install or worship Mangal Yantra and avoid initiating property registries during Tuesday Rahu Kaal.`
        );
        remediesHi.push(
          `नित्य श्री हनुमान चालीसा अथवा सुंदरकांड का पाठ करें, विशेषकर मंगलवार के दिन।`,
          `मंगलवार को लाल मसूर की दाल, गुड़ अथवा तांबे का दान जरूरतमंदों को करें।`,
          `क्रोध पर नियंत्रण रखें, मंगलवार को नमक कम लें और भाई-बंधुओं से संबंध मधुर रखें।`
        );
        break;
      }

      case 'Mercury': {
        ageWindows.push(17, 32, 35, 42);
        timingEn = `Active during Mercury Mahadasha (17 Years), Mercury sub-periods, and transits through Gemini, Virgo, and 1st/10th houses.`;
        timingHi = `बुध की 17-वर्षीय महादशा, अंतर्दशाओं, तथा मिथुन, कन्या राशि व लग्न/दशम भाव में बुध के गोचर काल में फलीभूत होगा।`;

        if (isExalted || isOwn || isTrikona || isKendra) {
          positiveEventsEn.push(
            `Exceptional commercial acumen: establishing profitable trading, agency, or software enterprises.`,
            `Mastery of speech, analytical logic, accounts, mathematics, journalism, or communicative arts.`,
            `Abundant gains through maternal relatives, networking contracts, and high academic degrees.`
          );
          positiveEventsHi.push(
            `असाधारण व्यापारिक दक्षता: ट्रेडिंग, सॉफ्टवेयर, मीडिया व एजेंसी कारोबार से विपुल धन लाभ।`,
            `वाक्पटुता, तार्किक बुद्धि, लेखांकन (Accounts), परामर्श व संचार क्षेत्र में शीर्ष सम्मान।`,
            `मातुल पक्ष (मामा) से सहयोग, बहुमूल्य अनुबंध (Contracts) तथा उच्च शैक्षणिक उपलब्धियां।`
          );
        } else {
          positiveEventsEn.push(
            `Quick wit, multi-tasking flair, and sharp mathematical comprehension.`,
            `Adeptness at learning new languages, software tools, and digital platforms.`
          );
          positiveEventsHi.push(
            `हाजिरजवाबी, बहुमुखी प्रतिभा (Multi-tasking) तथा नई विधाओं को शीघ्र सीखने की क्षमता।`,
            `डिजिटल तकनीक, भाषा व सोशल मीडिया में स्वाभाविक निपुणता।`
          );
        }

        if (isDebilitated || isDusthana || p.isCombust) {
          negativeEventsEn.push(
            `Skin allergies, nervous breakdowns, speech stammering under pressure, or gastrointestinal sensitivity.`,
            `Contractual breaches, fraudulent document traps, or financial losses caused by blind mercantile trust.`,
            `Calculative hesitation causing missed golden opportunities.`
          );
          negativeEventsHi.push(
            `त्वचा विकार (Allergies), स्नायु तंत्र (Nervous System) की कमजोरी अथवा पाचन विकार।`,
            `दस्तावेजी धोखाधड़ी, अनुबंध टूटना अथवा व्यापार में अति-विश्वास के कारण धन हानि।`,
            `अत्यधिक गुणा-भाग और संशय के चलते सही समय पर अवसर हाथ से निकल जाना।`
          );
        } else {
          negativeEventsEn.push(
            `Restless curiosity scattering mental focus across too many simultaneous tasks.`,
            `Occasional cynical sarcasm alienating sensitive friends.`
          );
          negativeEventsHi.push(
            `एक साथ कई कार्यों में हाथ डालने से ऊर्जा और ध्यान का बिखराव।`,
            `व्यंग्यपूर्ण वाणी के कारण कभी-कभार मित्रों से अनबन।`
          );
        }

        remediesEn.push(
          `Feed green fodder or spinach to cows on Wednesday mornings.`,
          `Recite Vishnu Sahasranama or chant 'Om Bum Budhaya Namaha' 108 times on Wednesdays.`,
          `Donate green moong dal, green clothes, or stationery books to deserving students.`
        );
        remediesHi.push(
          `बुधवार को गौमाता को हरा चारा, पालक अथवा हरी मूंग की दाल खिलाएं।`,
          `विष्णु सहस्रनाम का पाठ करें अथवा ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः का नित्य 108 बार जप करें।`,
          `बुधवार को कन्याओं को भोजन कराएं अथवा विद्यार्थियों को पुस्तकें/लेखन सामग्री दान करें।`
        );
        break;
      }

      case 'Jupiter': {
        ageWindows.push(16, 24, 32, 40, 56);
        timingEn = `Active during Jupiter Mahadasha (16 Years), Jupiter sub-periods, and auspicious 1-year transit through Kendra and Trikona houses.`;
        timingHi = `गुरु की 16-वर्षीय महादशा, अंतर्दशाओं, तथा केंद्र व त्रिकोण भावों में गुरु के वार्षिक गोचर काल में सर्वाधिक फलकारी रहेगा।`;

        if (isExalted || isOwn || isKendra || isTrikona) {
          positiveEventsEn.push(
            `Birth of virtuous progeny, family prosperity, and prestigious academic or spiritual titles.`,
            `Elevation to advisory, judicial, ministerial, professorial, or institutional leadership roles.`,
            `Abundant divine protection: miraculous rescues from complex adversities and steady wealth accumulation.`
          );
          positiveEventsHi.push(
            `सुयोग्य व संस्कारी संतान प्राप्ति, कुल की प्रतिष्ठा में भारी वृद्धि व आध्यात्मिक सम्मान।`,
            `उच्च सलाहकार, न्यायिक, शैक्षणिक, बैंकिंग अथवा नीति-निर्धारक पदों पर आसीन होना।`,
            `ईश्वरीय कृपा: भीषण संकटों से बाल-बाल बचाव, मान-सम्मान की रक्षा एवं सतत धन-संपत्ति वृद्धि।`
          );
        } else {
          positiveEventsEn.push(
            `Natural philosophical outlook, moral integrity, and respect for noble traditions.`,
            `Wise financial prudence and charitable inclination towards worthy causes.`
          );
          positiveEventsHi.push(
            `स्वाभाविक दार्शनिक सोच, नैतिक आचरण एवं धर्म-कर्म के प्रति स्वाभाविक आस्था।`,
            `सकारात्मक वित्तीय समझदारी तथा परोपकारी कार्यों में सहभागिता।`
          );
        }

        if (isDebilitated || isDusthana || p.isCombust) {
          negativeEventsEn.push(
            `Liver disorders, obesity, gallbladder complications, diabetes, or metabolic imbalances.`,
            `Delays or sorrow in child-related aspirations, or ideological estrangement with teachers/gurus.`,
            `Misguided financial investments based on unverified moral trust or over-optimistic speculation.`
          );
          negativeEventsHi.push(
            `यकृत (Liver) रोग, मोटापा, मधुमेह (Diabetes), अथवा कोलेस्ट्रॉल/मेटाबॉलिज्म विकार।`,
            `संतान प्राप्ति में विलंब, संतान संबंधी चिंताएं अथवा गुरुजनों/शिक्षकों से मतभेद।`,
            `अति-आशावादी होकर बिना जांचे-परखे निवेश करने से बड़ी पूंजी फंसने का जोखिम।`
          );
          criticalAlertsEn.push(`Jupiter in H${hNum} advises strict dietary discipline regarding liver/diabetes & verified financial contracts.`);
          criticalAlertsHi.push(`गुरु भाव ${hNum} में यकृत/मधुमेह स्वास्थ्य पर विशेष ध्यान देने तथा अंधविश्वास से बचने की चेतावनी देता है।`);
        } else {
          negativeEventsEn.push(
            `Tendency towards moral complacency or dogmatic righteousness in arguments.`,
            `Over-promising assistance beyond realistic bandwidth.`
          );
          negativeEventsHi.push(
            `अपने विचारों को सही साबित करने का हठ अथवा उपदेशात्मक शैली।`,
            `सामर्थ्य से अधिक मदद का आश्वासन देकर स्वयं को परेशानी में डालना।`
          );
        }

        remediesEn.push(
          `Wear a natural yellow sapphire or yellow topaz in gold on the index finger on Thursday mornings (if benefic).`,
          `Donate yellow items (chana dal, turmeric, yellow bananas, saffron) to Brahmins or elderly gurus.`,
          `Chant the Brihaspati Beej Mantra 108 times daily and water a Peepal tree without touching it on Thursdays.`
        );
        remediesHi.push(
          `बृहस्पतिवार को चने की दाल, हल्दी, पीले फल अथवा बेसन की मिठाई का दान करें।`,
          `ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः का नित्य 108 बार जप करें।`,
          `गुरुजनों, माता-पिता व संतों का आदर करें तथा माथे पर नित्य केसर अथवा हल्दी का तिलक लगाएं।`
        );
        break;
      }

      case 'Venus': {
        ageWindows.push(20, 25, 30, 45);
        timingEn = `Active during Venus Mahadasha (20 Years), Venus sub-periods, and transits across 1st, 2nd, 4th, 5th, 7th, 9th, and 12th houses.`;
        timingHi = `शुक्र की 20-वर्षीय महादशा, अंतर्दशाओं, तथा केंद्र/त्रिकोण व द्वादश भाव में शुक्र के गोचर काल में सुख-समृद्धि का विस्तार होगा।`;

        if (isExalted || isOwn || isKendra || isTrikona || hNum === 12) {
          positiveEventsEn.push(
            `Opulent lifestyle: acquisition of luxury imported vehicles, bespoke residences, and fine couture.`,
            `Blissful marital union with an accomplished, charming, and supportive partner.`,
            `Sensational artistic, cinematic, hospitality, architectural, or design industry recognition and windfall gains.`
          );
          positiveEventsHi.push(
            `वैभवशाली जीवनशैली: विलासितापूर्ण वाहन, सुंदर आवास, वस्त्र-आभूषण व आधुनिक सुख-साधनों की प्राप्ति।`,
            `सुंदर, सुसंस्कृत व सहयोगी जीवनसाथी के साथ दांपत्य जीवन में प्रगाढ़ प्रेम व सामंजस्य।`,
            `कला, संगीत, फैशन, इंटीरियर डिजाइन, सौंदर्य प्रसाधन अथवा होटल व्यवसाय में अपार सफलता।`
          );
        } else {
          positiveEventsEn.push(
            `Graceful aesthetic sense, charismatic diplomatic presence, and joyful creative interests.`,
            `Social popularity and talent in fostering harmony among diverse groups.`
          );
          positiveEventsHi.push(
            `उत्कृष्ट सौंदर्य-बोध, आकर्षक व्यक्तित्व एवं संबंधों में मिठास बनाए रखने की कला।`,
            `सामाजिक मित्रों में लोकप्रियता तथा कलात्मक गतिविधियों में स्वाभाविक रुचि।`
          );
        }

        if (isDebilitated || isDusthana || p.isCombust) {
          negativeEventsEn.push(
            `Renal, urinary, kidney stone, or reproductive system infections and endocrinological distress.`,
            `Sensual scandals, broken engagements, infidelities, or costly divorce litigation.`,
            `Heavy financial squandering on frivolous indulgences leading to liquidity crises.`
          );
          negativeEventsHi.push(
            `गुर्दे (Kidney), मूत्र विकार, पथरी, अथवा प्रजनन/हार्मोन संबंधी व्याधियाँ।`,
            `प्रेम संबंधों में विछोह, विवाह में बाधा, वैवाहिक असंतोष अथवा अपयश का खतरा।`,
            `अत्यधिक विलासिता व फिजूलखर्ची के कारण संचित धन का क्षय।`
          );
        } else {
          negativeEventsEn.push(
            `Susceptibility to sweet flattery and difficulty in imposing disciplined boundaries.`,
            `Over-spending on decorative luxuries beyond immediate cash surplus.`
          );
          negativeEventsHi.push(
            `चापलूस मित्रों की बातों में जल्दी आ जाना तथा दृढ़ता से ना न कह पाना।`,
            `दिखावे और साज-सज्जा पर बजट से अधिक व्यय करना।`
          );
        }

        remediesEn.push(
          `Offer white fragrant flowers or lotus to Goddess Lakshmi on Fridays while reciting Sri Suktam.`,
          `Donate white cow's ghee, curd, rice, sugar, or white silk clothes to women on Fridays.`,
          `Wear a natural diamond or white zircon in platinum/silver on the ring finger (if functionally auspicious).`
        );
        remediesHi.push(
          `शुक्रवार को माता महालक्ष्मी को खीर अथवा सफेद मिठाई का भोग लगाएं एवं श्री सूक्त का पाठ करें।`,
          `शुक्रवार के दिन सफेद गाय को आटा/रोटी खिलाएं अथवा चावल, कपूर, चीनी या सफेद वस्त्र का दान करें।`,
          `स्त्री जाति का सदैव सम्मान करें तथा इत्र व सुगंधित वस्तुओं का प्रयोग करें।`
        );
        break;
      }

      case 'Saturn': {
        ageWindows.push(36, 42, 54, 72);
        timingEn = `Active during Saturn Mahadasha (19 Years), Saturn sub-periods, Saturn Sade Sati (7.5 Yrs), and Ashtama Shani transits.`;
        timingHi = `शनि की 19-वर्षीय महादशा, अंतर्दशाओं, शनि की साढ़े साती (7.5 वर्ष) तथा कंटक/अष्टम ढैय्या (2.5 वर्ष) के दौरान जीवन में बड़े बदलाव होंगे।`;

        if (isExalted || isOwn || isKendra || isTrikona) {
          positiveEventsEn.push(
            `Building massive long-term empires in heavy industries, mining, manufacturing, real estate, oil, or politics.`,
            `Unshakeable mass following, democratic popularity, and monumental endurance through crises.`,
            `Blessing of extreme longevity, profound spiritual detachment, and unbreachable resilience.`
          );
          positiveEventsHi.push(
            `भारी उद्योग, मशीनरी, खनन, लोहा-इस्पात, निर्माण, तेल, या राजनीति में विशाल साम्राज्य का निर्माण।`,
            `जनसामान्य व श्रमिकों का अटूट समर्थन, असाधारण धैर्य एवं घोर संकटों से विजेता बनकर उभरना।`,
            `दीर्घायु, गंभीर व्यावहारिक परिपक्वता, निष्ठावान अनुयायी एवं स्थायी प्रतिष्ठा।`
          );
        } else {
          positiveEventsEn.push(
            `Grounded discipline, patient work ethic, and ability to endure arduous routines without complaining.`,
            `Realistic evaluation of human nature and immunity to illusions.`
          );
          positiveEventsHi.push(
            `अनुशासन, निरंतर परिश्रम करने की अद्भुत क्षमता एवं कठिन दायित्वों का निर्वहन।`,
            `यथार्थवादी दृष्टिकोण तथा संकट के समय बिना विचलित हुए कार्य करते रहना।`
          );
        }

        if (isDebilitated || isDusthana || p.isCombust) {
          negativeEventsEn.push(
            `Chronic arthritis, neuromuscular paralysis, sciatica, knee degeneration, or persistent bone fractures.`,
            `Agonizing career stagnation, punitive demotions, or betrayal by long-serving subordinates.`,
            `Severe melancholy, loneliness, poverty traps, or crushing debt burdens during Sade Sati peaks.`
          );
          negativeEventsHi.push(
            `जोड़ों का दर्द (Gout/Arthritis), साइटिका, नसों का खिंचाव, घुटनों की समस्या अथवा अस्थि-रोग।`,
            `कारियर में भारी रुकावटें, विलंब, अधीनस्थों द्वारा विश्वासघात अथवा कानूनी जटिलताएं।`,
            `साढ़े साती के दौरान अत्यधिक मानसिक अकेलापन, आर्थिक तंगी व पारिवारिक उत्तरदायित्वों का भारी बोझ।`
          );
          criticalAlertsEn.push(`Saturn in H${hNum} enforces karmic audit; strict patience and service to the underprivileged are essential.`);
          criticalAlertsHi.push(`शनि भाव ${hNum} में कर्मफल का कड़ा हिसाब मांगता है; अहंकार त्यागकर धैर्य व सेवाभाव अपनाना अनिवार्य है।`);
        } else {
          negativeEventsEn.push(
            `Pessimistic cynicism expecting negative outcomes in new endeavors.`,
            `Cold emotional reserve distancing close family members.`
          );
          negativeEventsHi.push(
            `कार्यों में अनावश्यक विलंब होने का डर अथवा नकारात्मक आशंकाओं से घिरना।`,
            `अपनी भावनाओं को व्यक्त न कर पाने के कारण अपनों से दूरी।`
          );
        }

        remediesEn.push(
          `Light a mustard oil lamp under a sacred Peepal tree on Saturday evenings after sunset.`,
          `Recite Dasharatha Shani Stotra or Hanuman Chalisa 11 times every Saturday.`,
          `Donate black sesame seeds, iron pans, black shoes, or umbrellas to disabled laborers on Saturdays.`
        );
        remediesHi.push(
          `शनिवार सायंकाल पीपल के वृक्ष के नीचे सरसों के तेल का दीपक प्रज्वलित करें।`,
          `शनिवार को दशरथकृत शनि स्तोत्र अथवा सुंदरकांड का पाठ करें।`,
          `काले तिल, लोहे का तवा, काले जूते, छाता अथवा उड़द की दाल का दान असहाय/श्रमिक वर्ग को करें।`
        );
        break;
      }

      case 'Rahu': {
        ageWindows.push(18, 42, 45, 60);
        timingEn = `Active during Rahu Mahadasha (18 Years), Rahu sub-periods, nodal transits over 1st/7th axis, and solar/lunar eclipses.`;
        timingHi = `राहु की 18-वर्षीय महादशा, अंतर्दशाओं, लग्न-सप्तम अक्ष पर नोडल गोचर तथा सूर्य/चंद्र ग्रहण के समय अचानक घटनाएँ घटेंगी।`;

        if (isExalted || isTrikona || hNum === 3 || hNum === 6 || hNum === 10 || hNum === 11) {
          positiveEventsEn.push(
            `Sudden explosive rise to prominence in digital, cutting-edge tech, crypto, aviation, cinema, or international politics.`,
            `Massive unconventional speculative wealth, overseas PR residency, and out-of-the-box fame.`,
            `Fearless mastery over formidable opponents through clever strategic diplomacy.`
          );
          positiveEventsHi.push(
            `अचानक अप्रत्याशित उत्थान: विदेशी कंपनियों, हाई-टेक, डिजिटल मीडिया, फिल्म या अंतरराष्ट्रीय व्यापार में भारी सफलता।`,
            `विशाल आकस्मिक धन लाभ, विदेश में स्थायी निवास (PR) तथा लीक से हटकर कीर्ति।`,
            `शत्रुओं पर रणनीतिक कूटनीति से विजय तथा जटिल परिस्थितियों से चतुराई से निकल जाना।`
          );
        } else {
          positiveEventsEn.push(
            `Insatiable ambition, innovative worldview, and talent for seeing global trends ahead of peers.`,
            `Fascination with futuristic science and foreign cultures.`
          );
          positiveEventsHi.push(
            `उच्च महत्वाकांक्षा, दूरगामी सोच एवं विश्व-स्तरीय अवसरों को पहले से भांप लेने की कला।`,
            `आधुनिक विज्ञान, अन्वेषण एवं विदेशी संस्कृतियों में स्वाभाविक पकड़।`
          );
        }

        if (isDusthana || hNum === 8 || hNum === 12) {
          negativeEventsEn.push(
            `Mysterious undiagnosable illnesses, toxin/poison exposure, acute paranoia, or severe sleep paralysis.`,
            `Devastating sudden losses through fraudulent online schemes, crypto collapses, or shadow syndicates.`,
            `Sudden disgrace, social media cancelation, or sudden legal investigations.`
          );
          negativeEventsHi.push(
            `अज्ञात व अनिदान रोग, विषाक्तता/फूड पॉइजनिंग, भयंकर भ्रम, फोबिया अथवा अनिद्रा की समस्या।`,
            `साइबर फ्रॉड, सट्टेबाजी, गलत संगति अथवा ऑनलाइन वित्तीय घोटालों में भारी धन हानि।`,
            `आकस्मिक लांछन, बदनामी अथवा कानूनी/विभागीय जांच का गंभीर खतरा।`
          );
          criticalAlertsEn.push(`Rahu in H${hNum} warns against get-rich-quick speculation and unverified foreign transactions.`);
          criticalAlertsHi.push(`राहु भाव ${hNum} में शॉर्टकट से धन कमाने के लोभ व संदिग्ध विदेशी सौदों से दूर रहने की सख्त चेतावनी देता है।`);
        } else {
          negativeEventsEn.push(
            `Restless desire for overnight breakthroughs leading to impatience with foundational work.`,
            `Susceptibility to illusionary promises from flashy acquaintances.`
          );
          negativeEventsHi.push(
            `रातों-रात बड़ा बनने की जल्दबाजी में बुनियादी कार्यों की अनदेखी।`,
            `चमक-दमक वाले लोगों की बातों में आकर भ्रमित हो जाना।`
          );
        }

        remediesEn.push(
          `Feed stray black dogs daily with fresh roti smeared with mustard oil.`,
          `Immerse a dry raw coconut with husk in flowing river water on Wednesday evenings.`,
          `Chant the Rahu Beej Mantra 'Om Bhram Bhreem Bhroum Sah Rahave Namaha' 108 times after dusk.`
        );
        remediesHi.push(
          `प्रतिदिन काले कुत्ते को सरसों के तेल से चुपड़ी हुई रोटी खिलाएं।`,
          `बुधवार सायंकाल जटा वाला सूखा नारियल बहते जल में प्रवाहित करें।`,
          `संध्या समय ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः का 108 बार जप करें तथा भैरव मंदिर में दर्शन करें।`
        );
        break;
      }

      case 'Ketu': {
        ageWindows.push(24, 48, 52, 60);
        timingEn = `Active during Ketu Mahadasha (7 Years), Ketu sub-periods, and nodal transits over natal sensitive points.`;
        timingHi = `केतु की 7-वर्षीय महादशा, अंतर्दशाओं, तथा जन्मकालीन संवेदनशील भावों पर केतु के गोचर काल में वैराग्य व मुक्ति फलित होंगे।`;

        if (isExalted || hNum === 9 || hNum === 12 || isTrikona) {
          positiveEventsEn.push(
            `Attainment of rare spiritual enlightenment, Kundalini awakening, and deep mastery of astrology/occult sciences.`,
            `Sudden disinterest in trivial material rivalries, conferring profound inner tranquility and Moksha alignment.`,
            `Uncanny intuitive gut signals warning against hidden perils before they materialize.`
          );
          positiveEventsHi.push(
            `दुर्लभ आध्यात्मिक ज्ञान, आत्म-साक्षात्कार, ज्योतिष व गूढ़ विद्याओं (Occult) में असाधारण सिद्धि।`,
            `भौतिक प्रपंचों से मुक्ति, मन में असीम शांति एवं मोक्ष मार्ग पर अग्रसर होने का सौभाग्य।`,
            `अंतर्ज्ञान (Intuition) का इतना तीव्र होना कि आने वाले संकटों का पहले ही पूर्वाभास हो जाना।`
          );
        } else {
          positiveEventsEn.push(
            `Natural ascetic detachment, intellectual penetration into hidden root causes, and non-attachment.`,
            `Skill in debugging, surgical incisions, or breaking down intricate structural knots.`
          );
          positiveEventsHi.push(
            `निर्मोही स्वभाव, समस्याओं की जड़ तक पहुंचने की तीक्ष्ण बुद्धि एवं निष्काम कर्म भावना।`,
            `शोध, शल्य-कर्म, कोडिंग अथवा जटिल रहस्यों को सुलझाने में विशेष योग्यता।`
          );
        }

        if (isDusthana || hNum === 2 || hNum === 7 || hNum === 8) {
          negativeEventsEn.push(
            `Sudden surgical amputations, deep lacerations, mysterious allergies, or insect/dog bites.`,
            `Painful emotional isolation: abrupt estrangement from spouse, business partners, or family clan.`,
            `Sudden loss of enthusiasm or feeling of purposeless vacuum if material ambitions collapse.`
          );
          negativeEventsHi.push(
            `अचानक ऑपरेशन, फोड़े-फुंसी, रहस्यमयी एलर्जी अथवा कुत्ते/कीड़े के काटने का खतरा।`,
            `दांपत्य या साझेदारी में अचानक अलगाव, मनमुटाव अथवा घर-परिवार से विरक्ति।`,
            `लक्ष्यहीनता की भावना, मानसिक उदासीनता अथवा भौतिक कार्यों से एकाएक मन उचट जाना।`
          );
        } else {
          negativeEventsEn.push(
            `Periodic hyper-detachment leaving important worldly tasks half-finished.`,
            `Difficulty in following rigid corporate bureaucratic routines.`
          );
          negativeEventsHi.push(
            `अचानक विरक्ति के कारण हाथ में लिए गए सांसारिक कार्यों को अधूरा छोड़ देना।`,
            `कठोर औपचारिक नियमों व बंधनों में घुटन महसूस करना।`
          );
        }

        remediesEn.push(
          `Offer worship to Lord Ganesha with fresh Durva grass and recite Ganesha Sankat Nashan Stotra.`,
          `Donate a two-colored (black & white) wool blanket to homeless ascetics on Thursday or Saturday.`,
          `Feed birds with mixed grains (Sapta Dhanya) every morning.`
        );
        remediesHi.push(
          `भगवान श्री गणेश को नित्य दूर्वा अर्पित करें एवं संकट नाशन गणेश स्तोत्र का पाठ करें।`,
          `कंबल अथवा दोरंगी (काला-सफेद) ऊनी वस्त्र किसी भिक्षुक या मंदिर में दान करें।`,
          `प्रतिदिन प्रातः पक्षियों को सात प्रकार का मिश्रित अनाज (सप्तधान्य) डालें।`
        );
        break;
      }

      // --- 3 OUTER PLANETS (URANUS, NEPTUNE, PLUTO) ---
      case 'Uranus': {
        ageWindows.push(21, 42, 63, 84);
        timingEn = `Active during Uranus transits through 1st, 4th, 7th, 10th houses and the critical midlife Uranus Opposition (approx. age 40–44).`;
        timingHi = `हर्षल (अरुण) के केंद्र भावों (1, 4, 7, 10) में गोचर तथा 40–44 वर्ष की आयु में होने वाले 'हर्षल प्रतियुति' (Midlife Opposition) के समय जीवन में अभूतपूर्व क्रांतिकारी मोड़ आएंगे।`;

        positiveEventsEn.push(
          `Breakthrough sudden breakthroughs: revolutionary technological, intellectual, or humanitarian innovations.`,
          `Shattering of stale old limitations, granting extraordinary personal independence and authentic self-expression.`,
          `Lightning-fast elevation in futuristic sectors (artificial intelligence, space, electronics, civil aviation).`
        );
        positiveEventsHi.push(
          `आकस्मिक क्रांतिकारी मोड़: आधुनिक तकनीक, वैज्ञानिक शोध, नवाचार अथवा समाज-सुधार में युगप्रवर्तक सफलता।`,
          `पुरातन बंधनों व रूढ़ियों को तोड़कर असाधारण व्यक्तिगत स्वतंत्रता एवं मौलिक पहचान की स्थापना।`,
          `भविष्योन्मुखी क्षेत्रों (AI, अंतरिक्ष, विमानन, इलेक्ट्रॉनिक्स, शोध) में बिजली की गति से ख्याति।`
        );

        negativeEventsEn.push(
          `Catastrophic sudden disruptions: abrupt job layoffs, unannounced contract terminations, or sudden divorces.`,
          `Severe nervous tension, cardiac palpitations, or electrical/lightening/shock hazards.`,
          `Rebellious instability causing self-inflicted estrangement from vital support networks.`
        );
        negativeEventsHi.push(
          `आकस्मिक संकट: बिना पूर्व सूचना के नौकरी छूटना, अनुबंध टूटना अथवा संबंधों का एकाएक बिखरना।`,
          `स्नायु तंत्र में अत्यधिक तनाव, रक्तचाप में अचानक उछाल, अथवा बिजली/शॉक/दुर्घटना का जोखिम।`,
          `विद्रोही स्वभाव के कारण स्थापित व्यवस्था व शुभचिंतकों से अचानक संबंध तोड़ लेना।`
        );

        remediesEn.push(
          `Practice systematic daily mindfulness and physical earthing (walking barefoot on grass) to discharge nervous static.`,
          `Avoid making irreversible life decisions during erratic emotional impulses; wait 72 hours.`,
          `Support technological and educational charities that empower underprivileged innovators.`
        );
        remediesHi.push(
          `नित्य हरी घास पर नंगे पैर चलकर 'अर्थिंग' करें ताकि स्नायु तंत्र का अतिरिक्त तनाव शांत हो सके।`,
          `क्षणिक आवेश या उत्तेजना में आकर कोई भी बड़ा निर्णय न लें; कम से कम 72 घंटे का विराम लें।`,
          `वैज्ञानिक व नवाचारी विद्यार्थियों की शिक्षा में यथासंभव सहयोग करें।`
        );
        break;
      }

      case 'Neptune': {
        ageWindows.push(28, 42, 56, 70);
        timingEn = `Active during Neptune transits through water signs (Cancer, Scorpio, Pisces) and conjunct/opposite natal luminaries (Sun & Moon).`;
        timingHi = `वरुण (नेपच्यून) के जल राशियों (कर्क, वृश्चिक, मीन) में गोचर तथा जन्मकालीन सूर्य व चंद्र से दृष्टि संबंध के समय आध्यात्मिक व रचनात्मक फल प्रत्यक्ष होंगे।`;

        positiveEventsEn.push(
          `Sublime artistic and musical genius: creating timeless poetic, visual, cinematic, or photographic masterpieces.`,
          `Prophetic psychic intuition, transcendent spiritual visions, and unconditional healing compassion.`,
          `Phenomenal success in marine trade, global hospitality, philanthropy, or subtle chemical sciences.`
        );
        positiveEventsHi.push(
          `असाधारण कलात्मक व रचनात्मक सिद्धि: संगीत, काव्य, सिनेमा, चित्रकला अथवा साहित्य में कालजयी रचनाओं का निर्माण।`,
          `त्रिकालदर्शी अंतर्ज्ञान, दिव्य स्वप्न, आध्यात्मिक समाधि एवं दीन-दुखियों के प्रति अगाध करुणा।`,
          `समुद्री व्यापार, वैश्विक पर्यटन, सेवाभावी ट्रस्ट अथवा औषधि/रसायन के क्षेत्र में उच्च सफलता।`
        );

        negativeEventsEn.push(
          `Falling victim to massive illusions, sophisticated financial frauds, Ponzi schemes, or deceptive associates.`,
          `Vulnerability to escapism, alcohol/substance toxicity, chronic allergies, or water-borne infections.`,
          `Loss of practical reality checks, leading to severe financial or emotional disillusionment.`
        );
        negativeEventsHi.push(
          `धोखेबाजी का शिकार होना: वित्तीय फ्रॉड, पोंजी स्कीम अथवा विश्वासघाती लोगों द्वारा छले जाने का भारी जोखिम।`,
          `नशे, व्यसन, पलायनवादी सोच, जल-जनित संक्रमण अथवा रहस्यमयी एलर्जी से स्वास्थ्य को खतरा।`,
          `यथार्थ से कटकर ख्याली दुनिया में जीने के कारण वास्तविक जीवन में बड़ा आर्थिक व भावनात्मक आघात।`
        );

        remediesEn.push(
          `Insist on rigorous legal verification and third-party accounting audits before signing any financial contracts.`,
          `Maintain complete abstinence from toxic intoxicants and practice disciplined daily meditation.`,
          `Engage in selfless service at water conservation projects, clean water charities, or destitute shelters.`
        );
        remediesHi.push(
          `किसी भी वित्तीय अनुबंध या निवेश से पूर्व कानूनी व दस्तावेजी जांच अनिवार्य रूप से करें।`,
          `मादक पदार्थों व व्यसनों से पूर्ण दूरी बनाएं तथा नित्य त्राटक व प्राणायाम का अभ्यास करें।`,
          `जल संरक्षण कार्यों में सहयोग करें तथा प्यासों को जल पिलाने व निस्वार्थ सेवा में भाग लें।`
        );
        break;
      }

      case 'Pluto': {
        ageWindows.push(36, 40, 48, 62);
        timingEn = `Active during Pluto's slow tectonic transits across Angular houses (1st, 4th, 7th, 10th) and Pluto square cycles.`;
        timingHi = `यम (प्लूटो) के केंद्र भावों (1, 4, 7, 10) में अत्यंत मंद गति से गोचर के दौरान जीवन की संरचना में आमूलचूल परिवर्तन घटित होगा।`;

        positiveEventsEn.push(
          `Monumental Phoenix-like rebirth: rising from total career/financial ashes into immense unshakeable power.`,
          `Access to massive institutional resources, political clout, and control over large corporate/state syndicates.`,
          `Extraordinary psychological mastery, penetrating hidden criminal or commercial conspiracies, and total self-reinvention.`
        );
        positiveEventsHi.push(
          `फीनिक्स की भांति पुनर्जन्म: घोर संकट या पतन के बाद राख से उठकर अजेय शक्ति व साम्राज्य की पुनर्स्थापना।`,
          `विशाल संस्थागत संसाधनों पर नियंत्रण, उच्च राजनीतिक प्रभाव एवं शासन तंत्र पर गहरी पकड़।`,
          `अथाह मनोवैज्ञानिक इच्छाशक्ति, गुप्त रहस्यों का भेदन तथा स्वयं का संपूर्ण कायाकल्प कर लेना।`
        );

        negativeEventsEn.push(
          `Brutal, high-stakes power struggles, hostile corporate takeovers, or ruthless institutional victimization.`,
          `Crushing life crises involving deep surgical interventions, structural bankruptcy, or sudden total devastation.`,
          `Obsessive urge to dominate and manipulate others, attracting venomous underground retaliation.`
        );
        negativeEventsHi.push(
          `सत्ता व वर्चस्व का खूनी संघर्ष: संस्थागत षड्यंत्र, अनैतिक अधिग्रहण अथवा गुप्त शत्रुओं द्वारा निर्मम प्रहार।`,
          `जीवन को हिला देने वाले संकट: गंभीर शल्य-चिकित्सा (मेजर सर्जरी), पूर्ण दिवालियापन या आकस्मिक विनाश।`,
          `दूसरों को नियंत्रित करने का अत्यधिक जुनून, जिससे खतरनाक शत्रुता और विनाशकारी टकराव उत्पन्न हो।`
        );

        remediesEn.push(
          `Surrender the pathological need for absolute control; embrace transparent ethical accountability in all power dealings.`,
          `Engage in deep therapeutic shadow-work and release historical resentment through forgiveness.`,
          `Contribute anonymously to hospice care, trauma rehabilitation, or disaster reconstruction projects.`
        );
        remediesHi.push(
          `अति-नियंत्रण और प्रतिशोध की भावना का त्याग करें; सत्ता व धन के मामलों में पूर्ण पारदर्शिता रखें।`,
          `मन में दबे पुराने आक्रोश को क्षमा-भाव से समाप्त करें तथा शिव साधना व महामृत्युंजय का आश्रय लें।`,
          `आपदा पीड़ितों, लावारिस शवों के अंतिम संस्कार अथवा अनाथालयों में गुप्त दान करें।`
        );
        break;
      }
    }

    // Compose Placement Summary
    const dignTxtEn = isExalted ? 'Exalted' : isDebilitated ? 'Debilitated' : isOwn ? 'Own/Moolatrikona' : p.dignity;
    const dignTxtHi = isExalted ? 'उच्च' : isDebilitated ? 'नीच' : isOwn ? 'स्वराशि/मूलत्रिकोण' : trTerm(p.dignity, 'hi');
    const houseTheme = HOUSE_THEMES[hNum - 1];

    const placementSummaryEn = `${PLANET_NAMES_EN[p.id]} is placed in House ${hNum} (${signNameEn} at ${p.dms}), occupying ${p.nakshatraName} Nakshatra (Pada ${p.pada}, ruled by ${p.nakshatraLord}). Dignity: ${dignTxtEn}.${p.isRetrograde ? ' (Retrograde).' : ''}${p.isCombust ? ' (Combust).' : ''} Affects ${houseTheme.en}.${owned.length ? ` Rules House(s) ${owned.join(' & ')}.` : ''}${conjoined.length ? ` Conjoined with: ${conjoined.join(', ')}.` : ''}${aspecting.length ? ` Aspected by: ${aspecting.join(', ')}.` : ''}`;
    const placementSummaryHi = `${PLANET_NAMES_HI[p.id]} कुंडली के ${hNum}वें भाव (${signNameHi} राशि, ${p.dms}) में स्थित है, और ${p.nakshatraName} नक्षत्र के चरण ${p.pada} (स्वामी: ${p.nakshatraLord}) में गोचरस्थ है। ग्रह अवस्था: ${dignTxtHi}।${p.isRetrograde ? ' (वक्री)' : ''}${p.isCombust ? ' (अस्त)' : ''} मुख्य प्रभाव क्षेत्र: ${houseTheme.hi}।${owned.length ? ` स्वामित्व: भाव ${owned.join(' व ')}।` : ''}${conjoined.length ? ` युति: ${conjoined.map(x => trPlanet(x, 'hi')).join(', ')} के साथ।` : ''}${aspecting.length ? ` दृष्टि: ${aspecting.map(x => trPlanet(x, 'hi')).join(', ')} द्वारा।` : ''}`;

    results.push({
      id: p.id,
      nameEn: PLANET_NAMES_EN[p.id],
      nameHi: PLANET_NAMES_HI[p.id],
      symbol: PLANET_SYMBOLS[p.id] || '★',
      isOuterPlanet: isOuter,
      houseNumber: hNum,
      signIndex: signIdx,
      signNameEn,
      signNameHi,
      nakshatraName: p.nakshatraName,
      pada: p.pada,
      nakshatraLord: p.nakshatraLord,
      dms: p.dms,
      dignity: p.dignity,
      isRetrograde: p.isRetrograde,
      isCombust: p.isCombust,
      isVargottama: p.isVargottama,
      ownedHouses: owned,
      conjoinedPlanets: conjoined,
      aspectingPlanets: aspecting,
      placementSummaryEn,
      placementSummaryHi,
      positiveEventsEn,
      positiveEventsHi,
      negativeEventsEn,
      negativeEventsHi,
      timingTriggersEn: timingEn,
      timingTriggersHi: timingHi,
      keyAgeWindows: ageWindows,
      remediesEn,
      remediesHi,
    });
  }

  // Active Conjunctions Summary
  const conjunctionHouses: Array<{ house: number; planets: PlanetId[] }> = [];
  houseOccupantsMap.forEach((planets, h) => {
    if (planets.length >= 2) {
      conjunctionHouses.push({ house: h, planets });
    }
  });

  const activeConjunctionsSummaryEn = conjunctionHouses.length
    ? `Native has ${conjunctionHouses.length} active planetary conjunction(s): ${conjunctionHouses.map((c) => `House ${c.house} (${c.planets.join(' + ')})`).join('; ')}.`
    : 'No major planetary clusters (conjunctions) present in natal houses.';

  const activeConjunctionsSummaryHi = conjunctionHouses.length
    ? `कुंडली में ${conjunctionHouses.length} भावों में ग्रह युति (Conjunctions) सक्रिय हैं: ${conjunctionHouses.map((c) => `भाव ${c.house} (${c.planets.map((p) => trPlanet(p, 'hi')).join(' + ')})`).join('; ')}।`
    : 'कुंडली में किसी भाव में बहु-ग्रह युति नहीं है।';

  return {
    planets: results,
    activeConjunctionsSummaryEn,
    activeConjunctionsSummaryHi,
    criticalPlanetaryAlertsEn: criticalAlertsEn,
    criticalPlanetaryAlertsHi: criticalAlertsHi,
  };
}
