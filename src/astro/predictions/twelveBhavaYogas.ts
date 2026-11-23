import { SEVEN_PLANETS, SIGNS } from '../constants';
import type { ChartData, NineGrahaId, SevenPlanetId } from '../types';

export interface DetectedBhavaYoga {
  houseNumber: number;
  yogaNameEn: string;
  yogaNameHi: string;
  conditionMetEn: string;
  conditionMetHi: string;
  effectEn: string;
  effectHi: string;
  isAuspicious: boolean;
  classicalSource: string;
}

export interface DetectedParivartanaYoga {
  type: 'Maha' | 'Khala' | 'Dainya';
  nameEn: string;
  nameHi: string;
  planet1: SevenPlanetId;
  house1: number;
  planet2: SevenPlanetId;
  house2: number;
  effectEn: string;
  effectHi: string;
  classicalSource: string;
}

export interface TwelveBhavaAndParivartanaReport {
  bhavaYogas: DetectedBhavaYoga[];
  parivartanaYogas: DetectedParivartanaYoga[];
  prominentSummaryEn: string;
  prominentSummaryHi: string;
}

/**
 * 12 Bhava-Phala Yogas from Phaladeepika (Chapter 6, Slokas 44–69) & Predictive Astrology (Annexure V):
 * 1. Chamara Yoga (H1)
 * 2. Dhenu Yoga (H2)
 * 3. Shaurya Yoga (H3)
 * 4. Jaladhi Yoga (H4)
 * 5. Chhattra Yoga (H5)
 * 6. Astra Yoga (H6)
 * 7. Kama Yoga (H7)
 * 8. Asura Yoga (H8)
 * 9. Bhagya Yoga (H9)
 * 10. Khyati Yoga (H10)
 * 11. Parijata Yoga (H11)
 * 12. Musala Yoga (H12)
 */
export function computeTwelveBhavaAndParivartanaYogas(chart: ChartData): TwelveBhavaAndParivartanaReport {
  const ascSign = chart.ascendant.signIndex;
  const bhavaYogas: DetectedBhavaYoga[] = [];

  const getLordOfHouse = (h: number) => {
    const sIdx = (ascSign + h - 1) % 12;
    const lId = SIGNS[sIdx]?.lord;
    return chart.planets.find((p) => p.id === lId);
  };

  const getOccupants = (h: number) => chart.planets.filter((p) => p.rasiHouseNumber === h);

  const jupiter = chart.planets.find((p) => p.id === 'Jupiter');

  // 1. Chamara Yoga (House 1): Lagna lord exalted in Kendra, or aspected by Jupiter, or benefics in Kendra/Trikona
  const l1 = getLordOfHouse(1);
  if (l1) {
    const isKendra = [1, 4, 7, 10].includes(l1.rasiHouseNumber);
    const jupAspectsL1 =
      jupiter && [5, 7, 9].includes(((l1.rasiHouseNumber - jupiter.rasiHouseNumber + 12) % 12) + 1);
    if ((isKendra && l1.dignity === 'Exalted') || (isKendra && jupAspectsL1) || l1.dignity === 'Exalted') {
      bhavaYogas.push({
        houseNumber: 1,
        yogaNameEn: 'Chamara Yoga (चामर योग)',
        yogaNameHi: 'चामर योग',
        conditionMetEn: `Lagna Lord ${l1.id} occupies House ${l1.rasiHouseNumber} with ${l1.dignity} dignity${jupAspectsL1 ? ', receiving divine aspect from Jupiter' : ''}.`,
        conditionMetHi: `लग्नेश ${l1.id} केंद्र (भाव ${l1.rasiHouseNumber}) में ${l1.dignity} स्थिति में है${jupAspectsL1 ? ', जिस पर देवगुरु बृहस्पति की अमृत दृष्टि है' : ''}।`,
        effectEn: 'Endows an illustrious persona, natural leadership, profound scholarly intellect, long life, and sovereign public respect.',
        effectHi: 'प्रखर व्यक्तित्व, दीर्घायु, उच्च बौद्धिक प्रतिष्ठा, शासन से सम्मान एवं यशस्वी नेतृत्व प्रदान करता है।',
        isAuspicious: true,
        classicalSource: 'Phaladeepika Ch. 6, Sloka 44 · Brihat Parashara Hora Shastra',
      });
    }
  }

  // 2. Dhenu Yoga (House 2): 2nd lord in Kendra/Trikona or 2nd house with natural benefics
  const l2 = getLordOfHouse(2);
  const h2Occupants = getOccupants(2);
  const h2HasBenefics = h2Occupants.some((p) => ['Jupiter', 'Venus', 'Mercury'].includes(p.id));
  if (l2 && ([1, 2, 4, 5, 7, 9, 10, 11].includes(l2.rasiHouseNumber) || h2HasBenefics)) {
    if (['Exalted', 'Own Sign', 'Moolatrikona', 'Friend', 'Great Friend'].includes(l2.dignity) || h2HasBenefics) {
      bhavaYogas.push({
        houseNumber: 2,
        yogaNameEn: 'Dhenu Yoga (धेनु योग)',
        yogaNameHi: 'धेनु योग',
        conditionMetEn: `2nd Lord ${l2.id} is well-placed in House ${l2.rasiHouseNumber} (${l2.dignity})${h2HasBenefics ? ' and 2nd house is fortified by benefics' : ''}.`,
        conditionMetHi: `द्वितीयेश ${l2.id} भाव ${l2.rasiHouseNumber} में शुभ स्थिति (${l2.dignity}) में है${h2HasBenefics ? ' तथा धन भाव शुभ ग्रहों से युक्त है' : ''}।`,
        effectEn: 'Bountiful generational wealth, refined eloquence, wholesome culinary comfort, and financial sovereignty.',
        effectHi: 'अखंड संचित धन, सत्य एवं मधुर वाणी, उत्तम कुल प्रतिष्ठा एवं स्थायी आर्थिक सुरक्षा।',
        isAuspicious: true,
        classicalSource: 'Phaladeepika Ch. 6, Sloka 47 · Predictive Astrology Annexure V',
      });
    }
  }

  // 3. Shaurya Yoga (House 3): 3rd lord well dignified, 3rd house aspected by benefics
  const l3 = getLordOfHouse(3);
  if (l3 && [1, 3, 5, 9, 10, 11].includes(l3.rasiHouseNumber)) {
    if (['Exalted', 'Own Sign', 'Moolatrikona', 'Friend', 'Great Friend'].includes(l3.dignity)) {
      bhavaYogas.push({
        houseNumber: 3,
        yogaNameEn: 'Shaurya Yoga (शौर्य योग)',
        yogaNameHi: 'शौर्य योग',
        conditionMetEn: `3rd Lord ${l3.id} is fortified in House ${l3.rasiHouseNumber} (${l3.dignity}).`,
        conditionMetHi: `तृतीयेश ${l3.id} भाव ${l3.rasiHouseNumber} में शुभ बली स्थिति (${l3.dignity}) में है।`,
        effectEn: 'Exceptional valor, resolute self-reliance, successful entrepreneurial initiatives, and thriving brotherly support.',
        effectHi: 'असीम पराक्रम, दृढ़ स्वावलंबन, नए व्यावसायिक उद्यमों में विजय तथा बंधु-बांधवों का सहयोग।',
        isAuspicious: true,
        classicalSource: 'Phaladeepika Ch. 6, Sloka 49',
      });
    }
  }

  // 4. Jaladhi Yoga (House 4): 4th lord in Kendra/Trikona with benefics
  const l4 = getLordOfHouse(4);
  if (l4 && [1, 4, 5, 7, 9, 10].includes(l4.rasiHouseNumber)) {
    if (['Exalted', 'Own Sign', 'Moolatrikona', 'Friend', 'Great Friend'].includes(l4.dignity)) {
      bhavaYogas.push({
        houseNumber: 4,
        yogaNameEn: 'Jaladhi Yoga (जलधि योग)',
        yogaNameHi: 'जलधि योग',
        conditionMetEn: `4th Lord ${l4.id} sits comfortably in House ${l4.rasiHouseNumber} with ${l4.dignity} dignity.`,
        conditionMetHi: `चतुर्थेश ${l4.id} केंद्र/त्रिकोण (भाव ${l4.rasiHouseNumber}) में ${l4.dignity} स्थिति में प्रतिष्ठित है।`,
        effectEn: 'Acquisition of palatial properties, luxurious vehicles, deep contemplative wisdom like the ocean, and maternal serenity.',
        effectHi: 'भव्य भवन, वाहन सुख, समुद्र तुल्य गंभीर प्रज्ञा, मातृ सुख तथा समाज में प्रतिष्ठित गृह-सौख्य।',
        isAuspicious: true,
        classicalSource: 'Phaladeepika Ch. 6, Sloka 51 · Saravali',
      });
    }
  }

  // 5. Chhattra Yoga (House 5): 5th lord strong in Kendra/Trikona
  const l5 = getLordOfHouse(5);
  if (l5 && [1, 4, 5, 7, 9, 10, 11].includes(l5.rasiHouseNumber)) {
    if (['Exalted', 'Own Sign', 'Moolatrikona', 'Friend', 'Great Friend'].includes(l5.dignity)) {
      bhavaYogas.push({
        houseNumber: 5,
        yogaNameEn: 'Chhattra Yoga (छत्र योग)',
        yogaNameHi: 'छत्र योग',
        conditionMetEn: `5th Lord ${l5.id} occupies House ${l5.rasiHouseNumber} with ${l5.dignity} dignity.`,
        conditionMetHi: `पंचमेश ${l5.id} भाव ${l5.rasiHouseNumber} में ${l5.dignity} स्थिति में विराजित है।`,
        effectEn: 'Royal umbrella of institutional honor, razor-sharp intellect, advisory and ministerial competence, and virtuous progeny.',
        effectHi: 'छत्र तुल्य राज्य संरक्षण, अद्वितीय बौद्धिक प्रज्ञा, उच्च सलाहकारी पद एवं सुयोग्य संतान सुख।',
        isAuspicious: true,
        classicalSource: 'Phaladeepika Ch. 6, Sloka 53 · Jataka Parijata',
      });
    }
  }

  // 6. Astra Yoga (House 6): 6th lord strong in Upachaya or 6th house fortified
  const l6 = getLordOfHouse(6);
  if (l6 && [3, 6, 11].includes(l6.rasiHouseNumber)) {
    bhavaYogas.push({
      houseNumber: 6,
      yogaNameEn: 'Astra Yoga (अस्त्र योग)',
      yogaNameHi: 'अस्त्र योग',
      conditionMetEn: `6th Lord ${l6.id} is strategically placed in Upachaya House ${l6.rasiHouseNumber}.`,
      conditionMetHi: `षष्ठेश ${l6.id} उपचय भाव ${l6.rasiHouseNumber} में रणनीतिक रूप से स्थित है।`,
      effectEn: 'Overcomes opponents in competitive arenas, triumphs in complex legal battles, and possesses robust immune resilience.',
      effectHi: 'शत्रुओं पर पूर्ण विजय, कानूनी व प्रतिस्पर्धी क्षेत्रों में अजेयता तथा सुदृढ़ रोग-प्रतिरोधक क्षमता।',
      isAuspicious: true,
      classicalSource: 'Phaladeepika Ch. 6, Sloka 55',
      });
  }

  // 7. Kama Yoga (House 7): 7th lord in Kendra or Trikona in good dignity
  const l7 = getLordOfHouse(7);
  if (l7 && [1, 4, 5, 7, 9, 10].includes(l7.rasiHouseNumber)) {
    if (['Exalted', 'Own Sign', 'Moolatrikona', 'Friend', 'Great Friend'].includes(l7.dignity)) {
      bhavaYogas.push({
        houseNumber: 7,
        yogaNameEn: 'Kama Yoga (काम योग)',
        yogaNameHi: 'काम योग',
        conditionMetEn: `7th Lord ${l7.id} sits auspiciously in House ${l7.rasiHouseNumber} (${l7.dignity}).`,
        conditionMetHi: `सप्तमेश ${l7.id} केंद्र/त्रिकोण (भाव ${l7.rasiHouseNumber}) में शुभ स्थिति (${l7.dignity}) में है।`,
        effectEn: 'A virtuous, accomplished spouse, deep matrimonial harmony, and mutually lucrative commercial partnerships.',
        effectHi: 'संस्कारी व सुयोग्य जीवनसाथी, आदर्श दांपत्य माधुर्य तथा सफल व्यावसायिक साझेदारियां।',
        isAuspicious: true,
        classicalSource: 'Phaladeepika Ch. 6, Sloka 57',
      });
    }
  }

  // 8. Asura Yoga (House 8): 8th house afflicted or 8th lord debilitated without cancellation
  const l8 = getLordOfHouse(8);
  const h8Occupants = getOccupants(8);
  const h8Malefics = h8Occupants.filter((p) => ['Saturn', 'Mars', 'Rahu', 'Ketu'].includes(p.id));
  if (h8Malefics.length >= 2 || (l8 && l8.dignity === 'Debilitated')) {
    bhavaYogas.push({
      houseNumber: 8,
      yogaNameEn: 'Asura Yoga (असुर योग)',
      yogaNameHi: 'असुर योग',
      conditionMetEn: `8th house is occupied by multiple malefics (${h8Malefics.map((p) => p.id).join(', ')})${l8?.dignity === 'Debilitated' ? ' and 8th lord is debilitated' : ''}.`,
      conditionMetHi: `अष्टम भाव क्रूर ग्रहों (${h8Malefics.map((p) => p.id).join(', ')}) से युक्त है।`,
      effectEn: 'Indicates hidden resistance, unexpected obstructions in assets, and need for disciplined Mahamrityunjaya sadhana.',
      effectHi: 'कार्यों में गुप्त अवरोध एवं आकस्मिक उतार-चढ़ाव; इसके निवारण हेतु शिव साधना व सात्विक दिनचर्या आवश्यक।',
      isAuspicious: false,
      classicalSource: 'Phaladeepika Ch. 6, Sloka 59 · Predictive Astrology Annexure V',
    });
  }

  // 9. Bhagya Yoga (House 9): 9th lord in Kendra/Trikona in dignity
  const l9 = getLordOfHouse(9);
  if (l9 && [1, 4, 5, 7, 9, 10, 11].includes(l9.rasiHouseNumber)) {
    if (['Exalted', 'Own Sign', 'Moolatrikona', 'Friend', 'Great Friend'].includes(l9.dignity)) {
      bhavaYogas.push({
        houseNumber: 9,
        yogaNameEn: 'Bhagya Yoga (भाग्य योग)',
        yogaNameHi: 'भाग्य योग',
        conditionMetEn: `9th Lord ${l9.id} is exalted or well-dignified in House ${l9.rasiHouseNumber} (${l9.dignity}).`,
        conditionMetHi: `नवमेश ${l9.id} भाव ${l9.rasiHouseNumber} में शुभ स्थिति (${l9.dignity}) में स्थित है।`,
        effectEn: 'Supreme fortune, effortless fruition of righteous ventures, divine mentorship, philanthropic stature, and pilgrimage honors.',
        effectHi: 'परम भाग्योदय, पूर्व पुण्य का उदय, गुरु कृपा, तीर्थाटन एवं धर्मनिष्ठ सामाजिक प्रतिष्ठा।',
        isAuspicious: true,
        classicalSource: 'Phaladeepika Ch. 6, Sloka 61 · Brihat Parashara Hora Shastra',
      });
    }
  }

  // 10. Khyati Yoga (House 10): 10th lord in Kendra/Trikona in high dignity
  const l10 = getLordOfHouse(10);
  if (l10 && [1, 4, 7, 10, 5, 9].includes(l10.rasiHouseNumber)) {
    if (['Exalted', 'Own Sign', 'Moolatrikona'].includes(l10.dignity)) {
      bhavaYogas.push({
        houseNumber: 10,
        yogaNameEn: 'Khyati Yoga (ख्याति योग)',
        yogaNameHi: 'ख्याति योग',
        conditionMetEn: `10th Lord ${l10.id} shines in Kendra/Trikona (House ${l10.rasiHouseNumber}, ${l10.dignity}).`,
        conditionMetHi: `दशमेश ${l10.id} केंद्र/त्रिकोण (भाव ${l10.rasiHouseNumber}) में ${l10.dignity} होकर विराजमान है।`,
        effectEn: 'Widespread international renown, unblemished administrative reputation, commanding leadership, and enduring historical legacy.',
        effectHi: 'विश्वव्यापी यश, निष्कलंक कीर्ति, शीर्ष प्रशासनिक अधिकार एवं चिरस्थायी सामाजिक प्रतिष्ठा।',
        isAuspicious: true,
        classicalSource: 'Phaladeepika Ch. 6, Sloka 63',
      });
    }
  }

  // 11. Parijata Yoga (House 11): 11th lord in Kendra/Trikona in dignity
  const l11 = getLordOfHouse(11);
  if (l11 && [1, 2, 4, 5, 7, 9, 10, 11].includes(l11.rasiHouseNumber)) {
    if (['Exalted', 'Own Sign', 'Moolatrikona', 'Friend', 'Great Friend'].includes(l11.dignity)) {
      bhavaYogas.push({
        houseNumber: 11,
        yogaNameEn: 'Parijata Yoga (पारिजात योग)',
        yogaNameHi: 'पारिजात योग',
        conditionMetEn: `11th Lord ${l11.id} is comfortably placed in House ${l11.rasiHouseNumber} (${l11.dignity}).`,
        conditionMetHi: `एकादशेश ${l11.id} भाव ${l11.rasiHouseNumber} में शुभ स्थिति (${l11.dignity}) में है।`,
        effectEn: 'Perpetual stream of multi-channel revenue, fulfillment of ambitious life goals, influential network alliances, and civic honors.',
        effectHi: 'विविध स्रोतों से सतत धन लाभ, महत्त्वाकांक्षाओं की पूर्ण सिद्धि एवं सम्मानित सामाजिक संपर्क।',
        isAuspicious: true,
        classicalSource: 'Phaladeepika Ch. 6, Sloka 65',
      });
    }
  }

  // 12. Musala Yoga (House 12): 12th lord in good dignity or 12th house unafflicted
  const l12 = getLordOfHouse(12);
  if (l12 && ['Exalted', 'Own Sign', 'Moolatrikona', 'Friend', 'Great Friend'].includes(l12.dignity)) {
    bhavaYogas.push({
      houseNumber: 12,
      yogaNameEn: 'Musala Yoga (मुसल योग)',
      yogaNameHi: 'मुसल योग',
      conditionMetEn: `12th Lord ${l12.id} is placed with dignity in House ${l12.rasiHouseNumber} (${l12.dignity}).`,
      conditionMetHi: `द्वादशेश ${l12.id} भाव ${l12.rasiHouseNumber} में शुभ स्थिति (${l12.dignity}) में है।`,
      effectEn: 'Chaste spending on charitable and sacred endowments, freedom from debilitating debts, and tranquil meditative detachment.',
      effectHi: 'परोपकार व धर्मार्थ कार्यों में सात्विक व्यय, ऋण से मुक्ति एवं आंतरिक आध्यात्मिक शांति।',
      isAuspicious: true,
      classicalSource: 'Phaladeepika Ch. 6, Sloka 67',
    });
  }

  // ─── 30 Parivartana Yogas (Maha, Khala, Dainya) ──────────────────────────
  const parivartanaYogas: DetectedParivartanaYoga[] = [];
  const checkedPairs = new Set<string>();

  for (const p1Id of SEVEN_PLANETS) {
    const p1 = chart.planets.find((p) => p.id === p1Id);
    if (!p1) continue;
    const signOfP1 = p1.signIndex;
    const lordOfSign1 = SIGNS[signOfP1]?.lord as SevenPlanetId;

    if (lordOfSign1 && lordOfSign1 !== p1Id && SEVEN_PLANETS.includes(lordOfSign1)) {
      const p2 = chart.planets.find((p) => p.id === lordOfSign1);
      if (!p2) continue;
      const signOfP2 = p2.signIndex;
      const lordOfSign2 = SIGNS[signOfP2]?.lord as SevenPlanetId;

      if (lordOfSign2 === p1Id) {
        const pairKey = [p1Id, lordOfSign1].sort().join('-');
        if (!checkedPairs.has(pairKey)) {
          checkedPairs.add(pairKey);

          const h1 = p1.rasiHouseNumber;
          const h2 = p2.rasiHouseNumber;
          const isTrik = [6, 8, 12].includes(h1) || [6, 8, 12].includes(h2);
          const isKhala = !isTrik && (h1 === 3 || h2 === 3);

          if (isTrik) {
            // Dainya Parivartana Yoga (6 varieties)
            parivartanaYogas.push({
              type: 'Dainya',
              nameEn: `Dainya Parivartana Yoga (${p1Id} in H${h1} ↔ ${lordOfSign1} in H${h2})`,
              nameHi: `दैन्य परिवर्तन योग (${p1Id} भाव ${h1} ↔ ${lordOfSign1} भाव ${h2})`,
              planet1: p1Id,
              house1: h1,
              planet2: lordOfSign1,
              house2: h2,
              effectEn: `Mutual sign exchange involving Dusthana (Houses ${h1} & ${h2}). Produces testing phases, financial restructuring, but unlocks powerful transformation or Vipreet Raja Yoga effects through persistence.`,
              effectHi: `त्रिक भाव (${h1} व ${h2}) का राशि परिवर्तन संघर्ष के बाद अप्रत्याशित सफलता एवं विपरीत राजयोग के फल प्रदान करता है।`,
              classicalSource: 'Phaladeepika Ch. 6, Slokas 32–34 · Brihat Parashara Hora Shastra',
            });
          } else if (isKhala) {
            // Khala Parivartana Yoga (8 varieties)
            parivartanaYogas.push({
              type: 'Khala',
              nameEn: `Khala Parivartana Yoga (${p1Id} in H${h1} ↔ ${lordOfSign1} in H${h2})`,
              nameHi: `खल परिवर्तन योग (${p1Id} भाव ${h1} ↔ ${lordOfSign1} भाव ${h2})`,
              planet1: p1Id,
              house1: h1,
              planet2: lordOfSign1,
              house2: h2,
              effectEn: `Mutual sign exchange involving the 3rd house of enterprise (Houses ${h1} & ${h2}). Fortunes fluctuate periodically, but courageous initiative and personal grit secure ultimate prosperity.`,
              effectHi: `तृतीय भाव के साथ राशि परिवर्तन जीवन में उतार-चढ़ाव के उपरांत व्यक्तिगत पराक्रम व स्वावलंबन से स्थायी सफलता दिलाता है।`,
              classicalSource: 'Phaladeepika Ch. 6, Slokas 32–33',
            });
          } else {
            // Maha Parivartana Raja Yoga (16 varieties among 1, 2, 4, 5, 7, 9, 10, 11)
            parivartanaYogas.push({
              type: 'Maha',
              nameEn: `Maha Parivartana Raja Yoga (${p1Id} in H${h1} ↔ ${lordOfSign1} in H${h2})`,
              nameHi: `महा परिवर्तन राजयोग (${p1Id} भाव ${h1} ↔ ${lordOfSign1} भाव ${h2})`,
              planet1: p1Id,
              house1: h1,
              planet2: lordOfSign1,
              house2: h2,
              effectEn: `Supreme mutual sign exchange between auspicious Kendra/Trikona lords (Houses ${h1} & ${h2}). Classical texts hail this as equivalent to royal stature, massive material prosperity, and institutional authority.`,
              effectHi: `शुभ केंद्र व त्रिकोण भावों (${h1} व ${h2}) का परस्पर राशि परिवर्तन अखंड राजयोग, अटूट धन संपदा एवं उच्च प्रशासनिक प्रतिष्ठा प्रदान करता है।`,
              classicalSource: 'Phaladeepika Ch. 6, Slokas 32–35 · Predictive Astrology Chapter 13',
            });
          }
        }
      }
    }
  }

  const prominentSummaryEn = bhavaYogas.length
    ? `${bhavaYogas.length} Classical Bhava Yogas detected (${bhavaYogas.map((y) => y.yogaNameEn.split(' (')[0]).join(', ')})${parivartanaYogas.length ? ` along with ${parivartanaYogas.length} Parivartana sign exchange(s)` : ''}.`
    : parivartanaYogas.length
      ? `${parivartanaYogas.length} Parivartana sign exchange(s) detected.`
      : 'No major Bhava-Phala or Parivartana exchange detected.';

  const prominentSummaryHi = bhavaYogas.length
    ? `कुंडली में ${bhavaYogas.length} शास्त्रीय भाव-योग उपस्थित हैं (${bhavaYogas.map((y) => y.yogaNameHi).join(', ')})${parivartanaYogas.length ? ` तथा ${parivartanaYogas.length} राशि परिवर्तन योग सक्रिय हैं` : ''}।`
    : parivartanaYogas.length
      ? `कुंडली में ${parivartanaYogas.length} राशि परिवर्तन योग सक्रिय हैं।`
      : 'कोई विशिष्ट भाव-योग या राशि परिवर्तन नहीं मिला।';

  return {
    bhavaYogas,
    parivartanaYogas,
    prominentSummaryEn,
    prominentSummaryHi,
  };
}
