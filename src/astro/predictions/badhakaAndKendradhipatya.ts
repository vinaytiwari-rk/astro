import { SIGNS } from '../constants';
import type { ChartData, NineGrahaId, SevenPlanetId } from '../types';

export interface BadhakaProfile {
  lagnaSignName: string;
  lagnaModality: 'Chara (Moveable)' | 'Sthira (Fixed)' | 'Dwiswabhava (Dual)';
  badhakaHouseNumber: number;
  badhakaLord: SevenPlanetId;
  placedHouse: number;
  dignity: string;
  isDashaActive: boolean;
  effectEn: string;
  effectHi: string;
  remedyEn: string;
  remedyHi: string;
  classicalSource: string;
}

export interface KendradhipatyaDoshaItem {
  planet: SevenPlanetId;
  ruledKendras: number[];
  placedHouse: number;
  dignity: string;
  isCancelled: boolean;
  cancellationReasonEn?: string;
  cancellationReasonHi?: string;
  severity: 'None' | 'Mild' | 'Moderate' | 'Acute';
  readingEn: string;
  readingHi: string;
  remedyEn: string;
  remedyHi: string;
  classicalSource: string;
}

export interface TrishadayaItem {
  houseNumber: 3 | 6 | 11;
  houseNameEn: string;
  houseNameHi: string;
  lord: SevenPlanetId;
  placedHouse: number;
  dignity: string;
  roleSummaryEn: string;
  roleSummaryHi: string;
}

export interface BadhakaAndFunctionalDoshaReport {
  badhaka: BadhakaProfile;
  kendradhipatya: KendradhipatyaDoshaItem[];
  trishadaya: TrishadayaItem[];
  executiveSynthesisEn: string;
  executiveSynthesisHi: string;
}

export function computeBadhakaAndFunctionalDoshas(
  chart: ChartData,
  activeDashaLord?: string
): BadhakaAndFunctionalDoshaReport {
  const ascSign = chart.ascendant.signIndex;

  // 1. Modality & Badhaka Sthana
  // Chara: 0 (Aries), 3 (Cancer), 6 (Libra), 9 (Capricorn) -> H11
  // Sthira: 1 (Taurus), 4 (Leo), 7 (Scorpio), 10 (Aquarius) -> H9
  // Dwiswabhava: 2 (Gemini), 5 (Virgo), 8 (Sagittarius), 11 (Pisces) -> H7
  const modalityIndex = ascSign % 3;
  let lagnaModality: BadhakaProfile['lagnaModality'] = 'Chara (Moveable)';
  let badhakaHouseNumber = 11;

  if (modalityIndex === 0) {
    lagnaModality = 'Chara (Moveable)';
    badhakaHouseNumber = 11;
  } else if (modalityIndex === 1) {
    lagnaModality = 'Sthira (Fixed)';
    badhakaHouseNumber = 9;
  } else {
    lagnaModality = 'Dwiswabhava (Dual)';
    badhakaHouseNumber = 7;
  }

  const badhakaSignIdx = (ascSign + badhakaHouseNumber - 1) % 12;
  const badhakaLord = SIGNS[badhakaSignIdx].lord as SevenPlanetId;
  const badhakaBody = chart.planets.find((p) => p.id === badhakaLord);
  const badhakaPlacedHouse = badhakaBody?.rasiHouseNumber ?? badhakaHouseNumber;
  const badhakaDignity = badhakaBody?.dignity ?? 'Neutral';

  const isDashaActive = Boolean(
    activeDashaLord &&
      (activeDashaLord === badhakaLord || activeDashaLord.includes(badhakaLord))
  );

  const badhakaEffectEn = `As a ${lagnaModality} Lagna (${chart.ascendant.signName}), House ${badhakaHouseNumber} acts as the Badhaka Sthana (obstructive sphere) and its ruler ${badhakaLord} (placed in House ${badhakaPlacedHouse}, ${badhakaDignity}) is the Badhakadhipati. When active, it produces unexpected delays, elusive hurdles, or inexplicable resistance in undertakings.`;
  const badhakaEffectHi = `${chart.ascendant.signName} (${lagnaModality === 'Chara (Moveable)' ? 'चर' : lagnaModality === 'Sthira (Fixed)' ? 'स्थिर' : 'द्विस्वभाव'} लग्न) के लिए भाव ${badhakaHouseNumber} बाधक स्थान तथा ${badhakaLord} (भाव ${badhakaPlacedHouse} में, ${badhakaDignity}) बाधकेश हैं। इनकी दशा या गोचर में कार्यों में आकस्मिक विलंब अथवा अज्ञात बाधाओं की संभावना रहती है।`;

  const badhakaRemedyEn = `Propitiate Lord Shiva and recite the Maha Mrityunjaya Mantra or Hanuman Chalisa; perform water/milk charity to dissolve subtle impediments.`;
  const badhakaRemedyHi = `शिव उपासना करें, नियमित महामृत्युंजय मंत्र अथवा हनुमान चालीसा का पाठ करें तथा बाधकेश की शांति हेतु सात्विक दान करें।`;

  const badhaka: BadhakaProfile = {
    lagnaSignName: chart.ascendant.signName,
    lagnaModality,
    badhakaHouseNumber,
    badhakaLord,
    placedHouse: badhakaPlacedHouse,
    dignity: badhakaDignity,
    isDashaActive,
    effectEn: badhakaEffectEn,
    effectHi: badhakaEffectHi,
    remedyEn: badhakaRemedyEn,
    remedyHi: badhakaRemedyHi,
    classicalSource: 'Brihat Parashara Hora Shastra · Jataka Parijata · Predictive Astrology Ch. 10',
  };

  // 2. Kendradhipatya Dosha for Benefics
  // Natural benefics: Jupiter, Venus, Mercury. (Lagna lord is exempt per Parashara: "भाग्येशात् लग्नपो यद्वत्...")
  const lagnaLord = SIGNS[ascSign].lord;
  const candidateBenefics: SevenPlanetId[] = ['Jupiter', 'Venus', 'Mercury'];
  const kendradhipatya: KendradhipatyaDoshaItem[] = [];

  for (const bId of candidateBenefics) {
    if (bId === lagnaLord) continue; // Lagna lord is exempt from kendradhipatya blemish

    const ruledKendras: number[] = [];
    for (const h of [1, 4, 7, 10]) {
      const sIdx = (ascSign + h - 1) % 12;
      if (SIGNS[sIdx].lord === bId) ruledKendras.push(h);
    }

    if (ruledKendras.length > 0) {
      const bBody = chart.planets.find((p) => p.id === bId);
      const placedHouse = bBody?.rasiHouseNumber ?? 1;
      const dignity = bBody?.dignity ?? 'Neutral';

      // Cancellation check: placed in Trikona (5 or 9) or conjoined with Trikona lord
      const inTrikona = [5, 9].includes(placedHouse);
      const l5 = SIGNS[(ascSign + 4) % 12].lord;
      const l9 = SIGNS[(ascSign + 8) % 12].lord;
      const conjoinedWithTrikonaLord = chart.planets.some(
        (p) => (p.id === l5 || p.id === l9) && p.rasiHouseNumber === placedHouse && p.id !== bId
      );

      const isCancelled = inTrikona || conjoinedWithTrikonaLord;
      let cancellationReasonEn = '';
      let cancellationReasonHi = '';

      if (isCancelled) {
        cancellationReasonEn = inTrikona
          ? `${bId} is placed in auspicious Trikona (House ${placedHouse}), which dissolves the Kendradhipatya blemish and channels pure prosperity.`
          : `${bId} conjoins with Trikona lord in House ${placedHouse}, converting the angular ownership into an auspicious Raja Yoga configuration.`;
        cancellationReasonHi = inTrikona
          ? `${bId} शुभ त्रिकोण (भाव ${placedHouse}) में स्थित होने से केंद्राधिपत्य दोष समाप्त होकर शुभ फल में परिवर्तित हो जाता है।`
          : `${bId} का त्रिकोणेश के साथ युति संबंध केंद्राधिपत्य दोष को भंग कर राजयोग कारक प्रभाव देता है।`;
      }

      let severity: KendradhipatyaDoshaItem['severity'] = 'Moderate';
      if (isCancelled) severity = 'None';
      else if (bId === 'Jupiter' && ruledKendras.includes(7)) severity = 'Acute'; // Dual kendra + maraka
      else if (bId === 'Mercury' && ruledKendras.length >= 2) severity = 'Moderate';
      else severity = 'Mild';

      const readingEn = isCancelled
        ? `${bId} rules Kendra House(s) ${ruledKendras.join(' & ')}, but the blemish is nullified: ${cancellationReasonEn}`
        : `${bId} rules Kendra House(s) ${ruledKendras.join(' & ')}. As a natural benefic owning angles, it sheds its unconditional generosity and demands structured ethical caution during its operating periods.`;

      const readingHi = isCancelled
        ? `${bId} केंद्र भाव ${ruledKendras.join(' व ')} का स्वामी है, किंतु दोष भंग हो चुका है: ${cancellationReasonHi}`
        : `${bId} केंद्र भाव ${ruledKendras.join(' व ')} का स्वामी होकर केंद्राधिपत्य दोष से युक्त है। अतः इसकी दशा में सहज लाभ के स्थान पर अनुशासित व सतर्क कर्म की आवश्यकता होगी।`;

      kendradhipatya.push({
        planet: bId,
        ruledKendras,
        placedHouse,
        dignity,
        isCancelled,
        cancellationReasonEn,
        cancellationReasonHi,
        severity,
        readingEn,
        readingHi,
        remedyEn: `Recite the stotram or mantra for ${bId} and practice truthfulness in commitments.`,
        remedyHi: `${bId} के वैदिक मंत्र का जप करें और वाणी व आचरण में पूर्ण सत्यता बनाए रखें।`,
        classicalSource: 'Brihat Parashara Hora Shastra (Rajayoga Adhyaya) · Predictive Astrology Ch. 10',
      });
    }
  }

  // 3. Trishadayadhipatis (3, 6, 11)
  const trishadaya: TrishadayaItem[] = ([3, 6, 11] as const).map((h) => {
    const sIdx = (ascSign + h - 1) % 12;
    const lId = SIGNS[sIdx].lord as SevenPlanetId;
    const body = chart.planets.find((p) => p.id === lId);
    const placedH = body?.rasiHouseNumber ?? h;
    const dig = body?.dignity ?? 'Neutral';

    let roleSummaryEn = '';
    let roleSummaryHi = '';

    if (h === 11) {
      roleSummaryEn = `11th Lord ${lId} (in H${placedH}, ${dig}) is classical Jyotish’s premier Trishadaya malefic for health vulnerability and excessive worldly desire, yet the chief driver of liquid cashflow.`;
      roleSummaryHi = `एकादशेश ${lId} (भाव ${placedH}, ${dig}) त्रिषडाय का प्रमुख कारक है जो सांसारिक लाभ देने के साथ-साथ स्वास्थ्य सतर्कता व अति-महत्त्वाकांक्षा की परीक्षा लेता है।`;
    } else if (h === 6) {
      roleSummaryEn = `6th Lord ${lId} (in H${placedH}, ${dig}) rules litigation, debts, and competitive challenges; strong placement converts rivalry into triumph.`;
      roleSummaryHi = `षष्ठेश ${lId} (भाव ${placedH}, ${dig}) प्रतिस्पर्धा, ऋण व विरोधियों का संचालन करता है; शुभ बल होने पर शत्रुओं पर विजय दिलाता है।`;
    } else {
      roleSummaryEn = `3rd Lord ${lId} (in H${placedH}, ${dig}) governs self-effort, courage, and younger co-borns; mandates persistent hard work.`;
      roleSummaryHi = `तृतीयेश ${lId} (भाव ${placedH}, ${dig}) पराक्रम, स्वावलंबन व बंधु सुख का संचालन करता है; कठोर परिश्रम से फल देता है।`;
    }

    return {
      houseNumber: h,
      houseNameEn: `House ${h} (${h === 11 ? 'Labha/Ekadasha' : h === 6 ? 'Shatru/Shastha' : 'Sahaja/Triteeya'})`,
      houseNameHi: `${h === 11 ? 'एकादश भाव (लाभ/इच्छा)' : h === 6 ? 'षष्ठ भाव (शत्रु/रोग)' : 'तृतीय भाव (पराक्रम/सहज)'}`,
      lord: lId,
      placedHouse: placedH,
      dignity: dig,
      roleSummaryEn,
      roleSummaryHi,
    };
  });

  const executiveSynthesisEn = `Chart functional architecture: ${badhaka.badhakaLord} acts as Badhakadhipati for ${chart.ascendant.signName} Lagna (House ${badhaka.badhakaHouseNumber}). ${kendradhipatya.length ? kendradhipatya.map((k) => `${k.planet} carries Kendradhipatya (${k.isCancelled ? 'Cancelled' : k.severity})`).join('; ') + '.' : 'No uncancelled Kendradhipatya blemish.'} Trishadaya dynamics are driven by 11th lord ${trishadaya.find((t) => t.houseNumber === 11)?.lord} and 6th lord ${trishadaya.find((t) => t.houseNumber === 6)?.lord}.`;
  const executiveSynthesisHi = `कार्यात्मक ग्रह विन्यास: ${chart.ascendant.signName} लग्न के लिए ${badhaka.badhakaLord} बाधकेश (भाव ${badhaka.badhakaHouseNumber}) हैं। ${kendradhipatya.length ? kendradhipatya.map((k) => `${k.planet} पर केंद्राधिपत्य (${k.isCancelled ? 'दोष भंग' : k.severity}) प्रभाव है`).join('; ') + '।' : 'कोई केंद्राधिपत्य दोष नहीं है।'} त्रिषडाय का नेतृत्व एकादशेश ${trishadaya.find((t) => t.houseNumber === 11)?.lord} व षष्ठेश ${trishadaya.find((t) => t.houseNumber === 6)?.lord} के पास है।`;

  return {
    badhaka,
    kendradhipatya,
    trishadaya,
    executiveSynthesisEn,
    executiveSynthesisHi,
  };
}
