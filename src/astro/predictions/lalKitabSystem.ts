import { NINE_GRAHAS, SEVEN_PLANETS, SIGNS } from '../constants';
import type { BodyPosition, ChartData, NineGrahaId, PlanetId, SevenPlanetId } from '../types';

export interface LalKitabDebt {
  debtType: 'Pitri Rin' | 'Matri Rin' | 'Stri Rin' | 'Bhratri Rin' | 'Sva Rin' | 'Nirdayata Rin' | 'Balak Rin';
  debtTypeHi: string;
  isTriggered: boolean;
  afflictedGrahas: NineGrahaId[];
  classicalCauseEn: string;
  classicalCauseHi: string;
  remedialProtocolEn: string;
  remedialProtocolHi: string;
}

export interface LalKitabHouseState {
  houseNumber: number;
  pakkaGharRuler: string;
  pakkaGharRulerHi: string;
  isSleeping: boolean;
  occupants: NineGrahaId[];
  awakeningMethodEn: string;
  awakeningMethodHi: string;
}

export interface LalKitabFullSystemReport {
  isDharmiTeva: boolean;
  dharmiTevaNoteEn: string;
  dharmiTevaNoteHi: string;
  karmicDebts: LalKitabDebt[];
  sleepingHouses: LalKitabHouseState[];
  kayamGrahas: NineGrahaId[];
  kundaliUpayList: Array<{
    planet: NineGrahaId;
    house: number;
    upayEn: string;
    upayHi: string;
  }>;
}

function houseBetween(fromSign: number, toSign: number): number {
  return ((toSign - fromSign + 12) % 12) + 1;
}

const PAKKA_GHAR_RULERS: Record<number, { en: string; hi: string; planets: NineGrahaId[] }> = {
  1: { en: 'Mars (Sun Exalted)', hi: 'मंगल (सूर्य उच्च)', planets: ['Mars', 'Sun'] },
  2: { en: 'Jupiter', hi: 'बृहस्पति (गुरु)', planets: ['Jupiter'] },
  3: { en: 'Mars', hi: 'मंगल', planets: ['Mars'] },
  4: { en: 'Moon', hi: 'चंद्र', planets: ['Moon'] },
  5: { en: 'Jupiter', hi: 'बृहस्पति (गुरु)', planets: ['Jupiter'] },
  6: { en: 'Mercury & Ketu', hi: 'बुध व केतु', planets: ['Mercury', 'Ketu'] },
  7: { en: 'Venus & Mercury', hi: 'शुक्र व बुध', planets: ['Venus', 'Mercury'] },
  8: { en: 'Saturn & Mars', hi: 'शनि व मंगल', planets: ['Saturn', 'Mars'] },
  9: { en: 'Jupiter', hi: 'बृहस्पति (गुरु)', planets: ['Jupiter'] },
  10: { en: 'Saturn', hi: 'शनि', planets: ['Saturn'] },
  11: { en: 'Jupiter & Saturn', hi: 'बृहस्पति व शनि', planets: ['Jupiter', 'Saturn'] },
  12: { en: 'Jupiter & Rahu', hi: 'बृहस्पति व राहु', planets: ['Jupiter', 'Rahu'] },
};

export function computeLalKitabSystemReport(chart: ChartData): LalKitabFullSystemReport {
  const ascSign = chart.ascendant.signIndex;
  const pMap = new Map<NineGrahaId, BodyPosition>();
  for (const p of chart.planets) {
    pMap.set(p.id as NineGrahaId, p);
  }

  // Calculate occupants per house
  const houseOccupants = new Map<number, NineGrahaId[]>();
  for (let h = 1; h <= 12; h++) houseOccupants.set(h, []);
  for (const p of chart.planets) {
    const h = houseBetween(ascSign, p.signIndex);
    houseOccupants.get(h)?.push(p.id as NineGrahaId);
  }

  // 1. Dharmi Teva (Righteous Protective Shield)
  const jup = pMap.get('Jupiter');
  const jupH = jup ? houseBetween(ascSign, jup.signIndex) : 1;
  const sat = pMap.get('Saturn');
  const satH = sat ? houseBetween(ascSign, sat.signIndex) : 1;
  const isDharmiTeva = [1, 5, 9, 11].includes(jupH) || satH === 11;
  const dharmiTevaNoteEn = isDharmiTeva
    ? 'Dharmi Teva Active: Divine shield protects native against extreme disasters and accidental ruin. Prayers and charitable deeds yield multiply blessed returns.'
    : 'Standard Teva: Planetary influences manifest per natural karma and personal righteous conduct.';
  const dharmiTevaNoteHi = isDharmiTeva
    ? 'धर्मी तेवा सक्रिय: कुंडली को दैवीय सुरक्षा प्राप्त है; अचानक आने वाले संकटों से रक्षा होती है तथा सत्कर्म व परोपकार का बहुगुणित शुभ फल मिलता है।'
    : 'सामान्य तेवा: कर्म फल प्राकृतिक रूप से प्रारब्ध व व्यक्तिगत आचरण के अनुसार प्राप्त होते हैं।';

  // 2. Karmic Debts (Rin)
  const debts: LalKitabDebt[] = [];

  // Pitri Rin (Jupiter afflicted in 2/5/9/12)
  const pitriAfflicted = [2, 5, 9, 12].includes(jupH) && (
    (pMap.get('Rahu') && houseBetween(ascSign, pMap.get('Rahu')!.signIndex) === jupH) ||
    (pMap.get('Venus') && houseBetween(ascSign, pMap.get('Venus')!.signIndex) === jupH) ||
    (pMap.get('Saturn') && houseBetween(ascSign, pMap.get('Saturn')!.signIndex) === jupH)
  );
  debts.push({
    debtType: 'Pitri Rin',
    debtTypeHi: 'पितृ ऋण (पूर्वजों का ऋण)',
    isTriggered: !!pitriAfflicted,
    afflictedGrahas: pitriAfflicted ? ['Jupiter'] : [],
    classicalCauseEn: 'Disrespect towards family elders, preceptors or desecrating sacred trees in ancestral lineage.',
    classicalCauseHi: 'पूर्वजों के समय कुल पुरोहित का अनादर, वृद्धों की उपेक्षा अथवा पूज्य वृक्षों का अहित।',
    remedialProtocolEn: 'All blood relatives collect equal brass utensils and donate to temple priest, or offer saffron tilak regularly.',
    remedialProtocolHi: 'रक्त संबंधी मिलकर समान मात्रा में पीतल के बर्तन मंदिर में दान करें तथा प्रतिदिन केसर का तिलक लगाएं।',
  });

  // Matri Rin (Moon afflicted in 4th)
  const moon = pMap.get('Moon');
  const moonH = moon ? houseBetween(ascSign, moon.signIndex) : 1;
  const ketu = pMap.get('Ketu');
  const ketuH = ketu ? houseBetween(ascSign, ketu.signIndex) : 1;
  const matriAfflicted = moonH === 4 && (ketuH === 4 || (pMap.get('Rahu') && houseBetween(ascSign, pMap.get('Rahu')!.signIndex) === 4));
  debts.push({
    debtType: 'Matri Rin',
    debtTypeHi: 'मातृ ऋण (माता का ऋण)',
    isTriggered: !!matriAfflicted,
    afflictedGrahas: matriAfflicted ? ['Moon', 'Ketu'] : [],
    classicalCauseEn: 'Neglect of mother, defiling pure water bodies or causing grief to maternal ancestors.',
    classicalCauseHi: 'माता का अनादर, शुद्ध जल स्रोतों को दूषित करना अथवा मातृपक्ष को कष्ट पहुंचाना।',
    remedialProtocolEn: 'Collect equal silver coins from family members and immerse in flowing natural river; touch mother\'s feet daily.',
    remedialProtocolHi: 'परिवार के सभी सदस्यों से बराबर चांदी के सिक्के एकत्रित कर बहते जल में प्रवाहित करें व नित्य मातृ-चरण स्पर्श करें।',
  });

  // Stri Rin (Venus afflicted in 2/7)
  const ven = pMap.get('Venus');
  const venH = ven ? houseBetween(ascSign, ven.signIndex) : 1;
  const striAfflicted = [2, 7].includes(venH) && (
    (pMap.get('Sun') && houseBetween(ascSign, pMap.get('Sun')!.signIndex) === venH) ||
    (pMap.get('Mars') && houseBetween(ascSign, pMap.get('Mars')!.signIndex) === venH) ||
    (pMap.get('Rahu') && houseBetween(ascSign, pMap.get('Rahu')!.signIndex) === venH)
  );
  debts.push({
    debtType: 'Stri Rin',
    debtTypeHi: 'स्त्री ऋण (नारी सम्मान ऋण)',
    isTriggered: !!striAfflicted,
    afflictedGrahas: striAfflicted ? ['Venus'] : [],
    classicalCauseEn: 'Mistreatment or betrayal of women, cruel acts towards pregnant women or cows.',
    classicalCauseHi: 'स्त्री वर्ग का तिरस्कार, गर्भवती महिलाओं या गौमाता को कष्ट देना।',
    remedialProtocolEn: 'Feed 10 cows with green fodder on Fridays; respect women and avoid domestic quarrels.',
    remedialProtocolHi: 'शुक्रवार को गौशाला में हरी घास खिलाएं तथा घर की स्त्रियों का पूर्ण मान-सम्मान बनाए रखें।',
  });

  // Bhratri Rin (Mars afflicted in 1/8)
  const mars = pMap.get('Mars');
  const marsH = mars ? houseBetween(ascSign, mars.signIndex) : 1;
  const bhratriAfflicted = [1, 8].includes(marsH) && (
    (pMap.get('Mercury') && houseBetween(ascSign, pMap.get('Mercury')!.signIndex) === marsH) ||
    (pMap.get('Ketu') && houseBetween(ascSign, pMap.get('Ketu')!.signIndex) === marsH)
  );
  debts.push({
    debtType: 'Bhratri Rin',
    debtTypeHi: 'भ्रातृ ऋण (बंधु-बांधव ऋण)',
    isTriggered: !!bhratriAfflicted,
    afflictedGrahas: bhratriAfflicted ? ['Mars'] : [],
    classicalCauseEn: 'Disputes, betrayal or expropriation of property belonging to brothers or close kinsmen.',
    classicalCauseHi: 'भाइयों के साथ छल, संपत्ति विवाद अथवा बंधुओं के प्रति कपटपूर्ण आचरण।',
    remedialProtocolEn: 'Donate red lentils (masoor dal) or sweet bread baked in earth tandoor; maintain cordial fraternal relations.',
    remedialProtocolHi: 'लाल मसूर की दाल अथवा मीठी रोटियां मिट्टी के तंदूर में बनवाकर जरूरतमंदों को बांटें व भाइयों से सद्भाव रखें।',
  });

  // Sva Rin (5th house afflicted)
  const h5Occs = houseOccupants.get(5) || [];
  const svaAfflicted = h5Occs.includes('Rahu') || h5Occs.includes('Ketu') || (h5Occs.includes('Saturn') && !h5Occs.includes('Jupiter'));
  debts.push({
    debtType: 'Sva Rin',
    debtTypeHi: 'स्व-ऋण (आत्म-ऋण)',
    isTriggered: svaAfflicted,
    afflictedGrahas: h5Occs.filter(p => ['Rahu', 'Ketu', 'Saturn'].includes(p)),
    classicalCauseEn: 'Breach of sacred vows, turning away from spiritual duties or abandoning family traditions.',
    classicalCauseHi: 'कुल परम्परा का त्याग, धार्मिक नियमों का उल्लंघन अथवा संकल्प भंग करना।',
    remedialProtocolEn: 'Perform Surya Namaskar at dawn, offer water to Sun in a copper vessel with jaggery and red flowers.',
    remedialProtocolHi: 'नित्य प्रातः तांबे के लोटे से सूर्य को जल, रोली व गुड़ मिलाकर अर्घ्य दें और आदित्य हृदय स्तोत्र का पाठ करें।',
  });

  // Nirdayata Rin (10/11th house Saturn afflicted)
  const satH10or11 = satH === 10 || satH === 11;
  const nirdayataAfflicted = satH10or11 && (
    (pMap.get('Sun') && houseBetween(ascSign, pMap.get('Sun')!.signIndex) === satH) ||
    (pMap.get('Mars') && houseBetween(ascSign, pMap.get('Mars')!.signIndex) === satH)
  );
  debts.push({
    debtType: 'Nirdayata Rin',
    debtTypeHi: 'निर्दयता ऋण (अत्याचार ऋण)',
    isTriggered: !!nirdayataAfflicted,
    afflictedGrahas: nirdayataAfflicted ? ['Saturn'] : [],
    classicalCauseEn: 'Usurping land, exploiting poor laborers or tormenting animals in past generations.',
    classicalCauseHi: 'श्रमिकों का शोषण, पशुओं पर अत्याचार अथवा किसी असहाय की भूमि पर अनुचित अधिकार।',
    remedialProtocolEn: 'Feed black dogs with buttered rotis, feed fish with flour balls, and support destitute laborers.',
    remedialProtocolHi: 'काले कुत्तों को सरसों के तेल से चुपड़ी रोटी खिलाएं, मछलियों को आटे की गोलियां डालें व श्रमिकों की सहायता करें।',
  });

  // 3. Sleeping Houses (Soya Ghar)
  const sleepingHouses: LalKitabHouseState[] = [];
  const AWAKENING_TIPS: Record<number, { en: string; hi: string }> = {
    1: { en: 'Awaken with Sun/Mars deeds: Wake before sunrise, perform physical exercise, take leadership initiative.', hi: 'सूर्य/मंगल कर्मों से जगाएं: सूर्योदय पूर्व उठें, व्यायाम करें व साहसिक कार्य प्रारंभ करें।' },
    2: { en: 'Awaken with Jupiter deeds: Donate yellow sweets to temple, apply saffron tilak on forehead/navel.', hi: 'गुरु कर्मों से जगाएं: मंदिर में चने की दाल व हल्दी दान करें, माथे और नाभि पर केसर तिलक लगाएं।' },
    3: { en: 'Awaken with Mars deeds: Gift sweets to brothers, wear copper bracelet, avoid bitter arguments.', hi: 'मंगल कर्मों से जगाएं: भाइयों को मिठाई दें, तांबे का कड़ा धारण करें व मधुर वाणी का प्रयोग करें।' },
    4: { en: 'Awaken with Moon deeds: Drink water from silver glass, take blessings from mother before travel.', hi: 'चंद्र कर्मों से जगाएं: चांदी के पात्र से जल पिएं, यात्रा से पूर्व माता का आशीर्वाद लें।' },
    5: { en: 'Awaken with Jupiter deeds: Sponsor child education, read scriptures, avoid gambling/speculation.', hi: 'गुरु कर्मों से जगाएं: निर्धन बच्चों की पढ़ाई में सहायता करें, सत्संग करें व सट्टेबाजी से दूर रहें।' },
    6: { en: 'Awaken with Mercury/Ketu deeds: Feed green moong to birds, keep a dog or feed stray dogs.', hi: 'बुध/केतु कर्मों से जगाएं: पक्षियों को साबुत मूंग डालें व कुत्तों की सेवा करें।' },
    7: { en: 'Awaken with Venus deeds: Keep home scented, gift fragrance/flowers to spouse, respect women.', hi: 'शुक्र कर्मों से जगाएं: घर में सुगंधित वातावरण रखें, जीवनसाथी को उपहार दें व नारी सम्मान करें।' },
    8: { en: 'Awaken with Saturn deeds: Feed crows, avoid taking free gifts or secondhand machinery.', hi: 'शनि कर्मों से जगाएं: कौवों को रोटी डालें, मुफ्त की चीजें व पुराना लोहा लेने से बचें।' },
    9: { en: 'Awaken with Jupiter deeds: Undertake holy pilgrimages, respect spiritual elders and teachers.', hi: 'गुरु कर्मों से जगाएं: तीर्थ यात्रा करें, संतों व गुरुजनों की सेवा करें।' },
    10: { en: 'Awaken with Saturn deeds: Work with utmost honesty, feed laborers, keep shoes/slippers organized.', hi: 'शनि कर्मों से जगाएं: कार्य में पूर्ण निष्ठा रखें, श्रमिकों को भोजन कराएं व जूते-चप्पल व्यवस्थित रखें।' },
    11: { en: 'Awaken with Jupiter/Saturn deeds: Share profits with charity, respect elder siblings.', hi: 'गुरु/शनि कर्मों से जगाएं: कमाई का दशांश शुभ कार्य में लगाएं व बड़े भाई-बहनों का आदर करें।' },
    12: { en: 'Awaken with Rahu/Jupiter deeds: Maintain clean rooftop, keep fennel seeds in red cloth near bed.', hi: 'राहु/गुरु कर्मों से जगाएं: छत को साफ रखें, लाल कपड़े में सौंफ बांधकर सिरहाने रखें।' },
  };

  for (let h = 1; h <= 12; h++) {
    const occs = houseOccupants.get(h) || [];
    const isSleeping = occs.length === 0;
    const pakka = PAKKA_GHAR_RULERS[h];
    const tips = AWAKENING_TIPS[h] || AWAKENING_TIPS[1];

    sleepingHouses.push({
      houseNumber: h,
      pakkaGharRuler: pakka.en,
      pakkaGharRulerHi: pakka.hi,
      isSleeping,
      occupants: occs,
      awakeningMethodEn: isSleeping ? tips.en : 'Active house; energized naturally by occupying planets.',
      awakeningMethodHi: isSleeping ? tips.hi : 'जागृत भाव; स्थित ग्रहों द्वारा स्वतः संचालित व सक्रिय।',
    });
  }

  // 4. Kayam Grahas (Established planets)
  const kayamGrahas: NineGrahaId[] = [];
  for (const [id, bp] of pMap.entries()) {
    const h = houseBetween(ascSign, bp.signIndex);
    const pakka = PAKKA_GHAR_RULERS[h];
    if (pakka.planets.includes(id)) {
      kayamGrahas.push(id);
    }
  }

  // 5. Authentic Lal Kitab Upay List
  const LAL_KITAB_UPAY_CATALOG: Record<NineGrahaId, Array<{ condition: (h: number) => boolean; upayEn: string; upayHi: string }>> = {
    Sun: [
      { condition: (h) => [6, 7, 8, 10, 12].includes(h), upayEn: 'Throw a square copper coin in flowing water at sunrise.', upayHi: 'रविवार को सूर्योदय के समय बहते पानी में तांबे का चौकोर सिक्का प्रवाहित करें।' },
      { condition: () => true, upayEn: 'Drink a sip of water with a little sugar/jaggery before stepping out for important work.', upayHi: 'किसी भी महत्वपूर्ण कार्य हेतु घर से निकलने से पूर्व थोड़ा गुड़ या मीठा खाकर जल पिएं।' },
    ],
    Moon: [
      { condition: (h) => [6, 8, 12].includes(h), upayEn: 'Take silver coin with a square shape from mother and preserve in cash box.', upayHi: 'माता से चांदी का चौकोर टुकड़ा आशीर्वाद स्वरूप लेकर अपनी तिजोरी में रखें।' },
      { condition: () => true, upayEn: 'Touch mother\'s feet daily and offer milk or rice to needy women on Mondays.', upayHi: 'प्रतिदिन माता के चरण स्पर्श करें और सोमवार को खीर अथवा दूध का दान करें।' },
    ],
    Mars: [
      { condition: (h) => [4, 7, 8].includes(h), upayEn: 'Bake sweet tandoori rotis with jaggery and distribute to birds/needy on Tuesdays.', upayHi: 'मंगलवार को गुड़ वाली मीठी तंदूरी रोटी बनवाकर कुत्तों व पक्षियों को खिलाएं।' },
      { condition: () => true, upayEn: 'Keep a small earthen pot with honey in the south-east or south corner.', upayHi: 'घर के दक्षिण-पूर्व (आग्नेय) अथवा दक्षिण कोने में मिट्टी के कुल्हड़ में शहद रखें।' },
    ],
    Mercury: [
      { condition: (h) => [3, 8, 11, 12].includes(h), upayEn: 'Pierce a copper coin in the center and throw into flowing river on Wednesday.', upayHi: 'बुधवार को तांबे के गोल सिक्के में छेद करके बहते जल में प्रवाहित करें।' },
      { condition: () => true, upayEn: 'Feed soaked green gram (moong dal) to pigeons and green fodder to cows.', upayHi: 'भीगी हुई साबुत मूंग की दाल कबूतरों को डालें व गौमाता को हरा चारा खिलाएं।' },
    ],
    Jupiter: [
      { condition: (h) => [6, 7, 10].includes(h), upayEn: 'Apply saffron or turmeric tilak on forehead, navel and tongue daily.', upayHi: 'प्रतिदिन माथे, नाभि और जिह्वा पर केसर या हल्दी का तिलक लगाएं।' },
      { condition: () => true, upayEn: 'Donate yellow items (chana dal, yellow sweets) to elderly preceptors or temple.', upayHi: 'गुरुवार को मंदिर में चने की दाल व पीले फल संतों अथवा ब्राह्मणों को भेंट करें।' },
    ],
    Venus: [
      { condition: (h) => [1, 6, 9].includes(h), upayEn: 'Donate cow ghee, curd or camphor in temple on Friday.', upayHi: 'शुक्रवार को मंदिर में शुद्ध देशी घी, दही अथवा कपूर का दान करें।' },
      { condition: () => true, upayEn: 'Feed a portion of daily food to cows before eating; maintain cleanliness.', upayHi: 'भोजन करने से पूर्व पहली रोटी गौमाता को समर्पित करें व स्वच्छता बनाए रखें।' },
    ],
    Saturn: [
      { condition: (h) => [1, 4, 5, 6].includes(h), upayEn: 'Pour mustard oil in a bowl, see your reflection (Chhaya Daan), and donate to Shani temple.', upayHi: 'शनिवार को कांसे या लोहे के कटोरे में सरसों का तेल डालकर अपना चेहरा देखें और दान करें।' },
      { condition: () => true, upayEn: 'Feed black dogs, avoid alcohol and leather gifts, respect domestic workers.', upayHi: 'काले कुत्तों को रोटी खिलाएं, मद्यपान से बचें व अधीनस्थों का कभी अनादर न करें।' },
    ],
    Rahu: [
      { condition: (h) => [1, 5, 8, 9].includes(h), upayEn: 'Keep fennel seeds (saunf) and sugar in a red pouch under your pillow.', upayHi: 'लाल सूती थैली में सौंफ और खांड भरकर सिरहाने रखें।' },
      { condition: () => true, upayEn: 'Clean the rooftop of house regularly; do not accumulate junk, iron scrap or coal.', upayHi: 'घर की छत को एकदम साफ रखें; कबाड़, खराब इलेक्ट्रॉनिक सामान या कोयला इकट्ठा न करें।' },
    ],
    Ketu: [
      { condition: (h) => [6, 8].includes(h), upayEn: 'Feed multi-colored or black-and-white street dogs with sweet bread.', upayHi: 'दो-रंगे या काले-सफेद कुत्ते को मीठी रोटी खिलाएं।' },
      { condition: () => true, upayEn: 'Donate black-and-white blanket to a poor person on Sunday or Tuesday.', upayHi: 'रविवार अथवा मंगलवार को दो-रंगा (काला-सफेद) कंबल किसी जरूरतमंद को दान करें।' },
    ],
  };

  const kundaliUpayList: LalKitabFullSystemReport['kundaliUpayList'] = [];
  for (const [pId, bp] of pMap.entries()) {
    const h = houseBetween(ascSign, bp.signIndex);
    const rules = LAL_KITAB_UPAY_CATALOG[pId] || [];
    for (const r of rules) {
      if (r.condition(h)) {
        kundaliUpayList.push({
          planet: pId,
          house: h,
          upayEn: r.upayEn,
          upayHi: r.upayHi,
        });
        break; // Keep most specific
      }
    }
  }

  return {
    isDharmiTeva,
    dharmiTevaNoteEn,
    dharmiTevaNoteHi,
    karmicDebts: debts,
    sleepingHouses,
    kayamGrahas,
    kundaliUpayList,
  };
}
