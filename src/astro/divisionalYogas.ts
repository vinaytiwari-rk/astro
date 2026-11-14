import { DIVISIONAL_META, NINE_GRAHAS, SEVEN_PLANETS, SIGNS } from './constants';
import type { ChartData, DivisionalChartId, NineGrahaId, PlanetId } from './types';
import { computeHigherDivisionalCharts, HIGHER_VARGA_META, type HigherVargaId } from './higherVargas';

export interface DivisionalYogaItem {
  id: string;
  vargaId: string;
  nameEn: string;
  nameHi: string;
  nature: 'Benefic (Shubha)' | 'Malefic (Ashubha)' | 'Mixed (Mishra)';
  natureHi: 'शुभ योग' | 'अशुभ / अरिष्ट योग' | 'मिश्रित योग';
  ruleEn: string;
  ruleHi: string;
  impactEn: string;
  impactHi: string;
  participatingPlanets: string[];
}

export function computeDivisionalYogas(chart: ChartData, targetVarga: string): DivisionalYogaItem[] {
  const yogas: DivisionalYogaItem[] = [];

  const sun = chart.planets.find((p) => p.id === 'Sun') || chart.planets[0];
  const moon = chart.planets.find((p) => p.id === 'Moon') || chart.planets[1];
  const mars = chart.planets.find((p) => p.id === 'Mars') || chart.planets[2];
  const mercury = chart.planets.find((p) => p.id === 'Mercury') || chart.planets[3];
  const jupiter = chart.planets.find((p) => p.id === 'Jupiter') || chart.planets[4];
  const venus = chart.planets.find((p) => p.id === 'Venus') || chart.planets[5];
  const saturn = chart.planets.find((p) => p.id === 'Saturn') || chart.planets[6];

  // Standard varga check
  const stdChart = chart.divisionalCharts[targetVarga as DivisionalChartId];
  const higherCharts = computeHigherDivisionalCharts(chart);
  const higherChart = higherCharts[targetVarga as HigherVargaId];

  // 1. D9 (NAVAMSHA) YOGAS
  if (targetVarga === 'D9' && stdChart) {
    const vargottamas = stdChart.placements.filter((p) => {
      const d1 = chart.ascendant.id === p.id ? chart.ascendant : chart.planets.find((x) => x.id === p.id);
      return d1 && d1.signIndex === p.signIndex;
    });

    if (vargottamas.length > 0) {
      yogas.push({
        id: 'D9_VARGOTTAMA',
        vargaId: 'D9',
        nameEn: 'Vargottama Yoga (D1 = D9 Resonance)',
        nameHi: 'वर्गोत्तम राजयोग (D1 = D9 समान राशि)',
        nature: 'Benefic (Shubha)',
        natureHi: 'शुभ योग',
        ruleEn: `Bodies occupy identical signs in natal D1 and D9 Navamsha: ${vargottamas.map((p) => p.id).join(', ')}.`,
        ruleHi: `ग्रह D1 लग्न व D9 नवांश दोनों में एक ही राशि में स्थित हैं: ${vargottamas.map((p) => p.id).join(', ')}।`,
        impactEn: 'Bestows deep unshakeable inner resilience, soul power, integrity, and lifelong protection during critical crises.',
        impactHi: 'जातक को अदम्य आत्मबल, चरित्र की सुदृढ़ता, आंतरिक स्थिरता व संकट में जीवन-रक्षक सुरक्षा प्रदान करता है।',
        participatingPlanets: vargottamas.map((p) => p.id),
      });
    }

    // Navamsha Raja Yoga: Kendra/Trikona Lord in Kendra in D9
    const d9LagnaLordId = SIGNS[stdChart.lagnaSignIndex].lord;
    const d9LagnaLord = stdChart.placements.find((p) => p.id === d9LagnaLordId);
    if (d9LagnaLord && [1, 4, 7, 10, 5, 9].includes(d9LagnaLord.houseFromVargaLagna)) {
      yogas.push({
        id: 'D9_RAJA_YOGA',
        vargaId: 'D9',
        nameEn: 'Navamsha Kendra-Trikona Raja Yoga',
        nameHi: 'नवांश केंद्र-त्रिकोण राजयोग',
        nature: 'Benefic (Shubha)',
        natureHi: 'शुभ योग',
        ruleEn: `D9 Lagna lord ${d9LagnaLordId} sits in auspicious House ${d9LagnaLord.houseFromVargaLagna} of Navamsha.`,
        ruleHi: `नवांश लग्नेश ${d9LagnaLordId} नवांश के शुभ भाव ${d9LagnaLord.houseFromVargaLagna} में स्थित हैं।`,
        impactEn: 'Promotes harmonious marital fortunes, enduring social respect, and continuous spiritual evolution in the second half of life.',
        impactHi: 'जीवन के उत्तरार्ध में उच्च प्रतिष्ठा, सुखी दांपत्य, धार्मिक अभिरुचि व निरंतर भाग्योदय सुनिश्चित करता है।',
        participatingPlanets: [d9LagnaLordId],
      });
    }
  }

  // 2. D10 (DASHAMSHA) YOGAS
  if (targetVarga === 'D10' && stdChart) {
    const d10H10Lord = SIGNS[(stdChart.lagnaSignIndex + 9) % 12].lord;
    const h10Pl = stdChart.placements.find((p) => p.id === d10H10Lord);

    if (h10Pl && [1, 4, 7, 10].includes(h10Pl.houseFromVargaLagna) && ['Exalted', 'Own Sign', 'Moolatrikona'].includes(h10Pl.dignity)) {
      yogas.push({
        id: 'D10_SIMHASANA',
        vargaId: 'D10',
        nameEn: 'Dashamsha Simhasana Yoga (Executive Throne)',
        nameHi: 'दशमांश सिंहासन राजयोग (सर्वोच्च पद प्राप्ति)',
        nature: 'Benefic (Shubha)',
        natureHi: 'शुभ योग',
        ruleEn: `10th Lord of Dashamsha (${d10H10Lord}) is exalted or in own house in Kendra House ${h10Pl.houseFromVargaLagna}.`,
        ruleHi: `दशमांश के दशमेश (${d10H10Lord}) केंद्र भाव ${h10Pl.houseFromVargaLagna} में स्वराशि या उच्च राशि में स्थित हैं।`,
        impactEn: 'Signifies administrative supremacy, sovereign institutional leadership, and commanding executive authority.',
        impactHi: 'उच्च प्रशासनिक सत्ता, संस्थागत नेतृत्व व कार्यक्षेत्र में सर्वोच्च पद-प्रतिष्ठा का योग।',
        participatingPlanets: [d10H10Lord],
      });
    }
  }

  // 3. D2 (HORA) YOGAS
  if (targetVarga === 'D2' && stdChart) {
    const jupHora = stdChart.placements.find((p) => p.id === 'Jupiter');
    const venHora = stdChart.placements.find((p) => p.id === 'Venus');
    if (jupHora?.signIndex === 3 || venHora?.signIndex === 3) {
      yogas.push({
        id: 'D2_KUBERA',
        vargaId: 'D2',
        nameEn: 'Kubera Hora Yoga (Chandra Hora Wealth Surge)',
        nameHi: 'कुबेर होरा धन योग (चंद्र होरा में शुभ ग्रह)',
        nature: 'Benefic (Shubha)',
        natureHi: 'शुभ योग',
        ruleEn: 'Natural benefics (Jupiter/Venus) occupy the gentle, nourishing Chandra Hora (Cancer).',
        ruleHi: 'शुभ ग्रह (गुरु/शुक्र) पोषणकारी चंद्र होरा (कर्क) में स्थित हैं।',
        impactEn: 'Bestows steady capital accumulation, liquid wealth retention, and financial prosperity without harsh friction.',
        impactHi: 'संचित धन, बैंक बैलेंस व तरल संपदा में सहज वृद्धि व आर्थिक सुरक्षा का वरदान।',
        participatingPlanets: ['Jupiter', 'Venus'],
      });
    }
  }

  // 4. D3 (DREKKANA) YOGAS
  if (targetVarga === 'D3' && stdChart) {
    const d3LagnaSign = stdChart.lagnaSignIndex;
    const isSarpa = [3, 7, 11].includes(d3LagnaSign);
    if (isSarpa) {
      yogas.push({
        id: 'D3_SARPA_DREKKANA',
        vargaId: 'D3',
        nameEn: 'Sarpa Drekkana Sensitivity (Cautious Immunity)',
        nameHi: 'सर्प द्रेष्काण संवेदनशीलता (सावधानी योग)',
        nature: 'Malefic (Ashubha)',
        natureHi: 'अशुभ / अरिष्ट योग',
        ruleEn: `D3 Lagna falls in water sign (${SIGNS[d3LagnaSign].name}) Drekkana.`,
        ruleHi: `D3 लग्न जल राशि (${SIGNS[d3LagnaSign].sanskrit}) के संवेदनशील द्रेष्काण में स्थित है।`,
        impactEn: 'Caution advised regarding water hazards, allergies, and deceit in sibling/partner agreements.',
        impactHi: 'जल संसर्ग, एलर्जी तथा व्यापारिक साझेदारियों में विशेष सतर्कता बरतने की सलाह।',
        participatingPlanets: ['Asc'],
      });
    }
  }

  // 5. D7 (SAPTAMSHA) YOGAS
  if (targetVarga === 'D7' && stdChart) {
    const d7H5Lord = SIGNS[(stdChart.lagnaSignIndex + 4) % 12].lord;
    const h5Pl = stdChart.placements.find((p) => p.id === d7H5Lord);
    if (h5Pl && [1, 4, 5, 9, 11].includes(h5Pl.houseFromVargaLagna)) {
      yogas.push({
        id: 'D7_PUTRA_BHAGYA',
        vargaId: 'D7',
        nameEn: 'Saptamsha Santaan Bhagya Yoga',
        nameHi: 'सप्तांश संतान भाग्य योग',
        nature: 'Benefic (Shubha)',
        natureHi: 'शुभ योग',
        ruleEn: `5th Lord of Saptamsha (${d7H5Lord}) placed in House ${h5Pl.houseFromVargaLagna} (${h5Pl.dignity}).`,
        ruleHi: `सप्तांश के पंचमेश (${d7H5Lord}) शुभ भाव ${h5Pl.houseFromVargaLagna} में स्थित हैं।`,
        impactEn: 'Blessings of virtuous, intellectually accomplished children who bring honor to the family lineage.',
        impactHi: 'सुयोग्य, आज्ञाकारी व कुलीन संतान का सुख, जो वंश की प्रतिष्ठा व गौरव में वृद्धि करते हैं।',
        participatingPlanets: [d7H5Lord],
      });
    }
  }

  // 6. D12 (DWADASHAMSHA) YOGAS
  if (targetVarga === 'D12' && stdChart) {
    const d12H9Lord = SIGNS[(stdChart.lagnaSignIndex + 8) % 12].lord;
    yogas.push({
      id: 'D12_PITRU_PUNYA',
      vargaId: 'D12',
      nameEn: 'Dwadashamsha Ancestral Grace Yoga',
      nameHi: 'द्वादशांश पितृ पुण्य योग',
      nature: 'Benefic (Shubha)',
      natureHi: 'शुभ योग',
      ruleEn: `D12 9th house indicates ancestral blessings flowing from maternal and paternal lineages.`,
      ruleHi: `द्वादशांश नवम भाव कुल व पूर्वजों के संचित आशीर्वाद व सुरक्षा को दर्शाता है।`,
      impactEn: 'Ancestral protection safeguards native during critical crossroads and transfers inherited virtues.',
      impactHi: 'कुल-देवता व पितरों की अदृश्य कृपा संकट के समय जातक की रक्षा करती है।',
      participatingPlanets: [d12H9Lord],
    });
  }

  // 7. D20 (VIMSHAMSHA) YOGAS
  if (targetVarga === 'D20' && stdChart) {
    const jupD20 = stdChart.placements.find((p) => p.id === 'Jupiter');
    if (jupD20 && [1, 5, 9, 10].includes(jupD20.houseFromVargaLagna)) {
      yogas.push({
        id: 'D20_BRAHMA_VIDYA',
        vargaId: 'D20',
        nameEn: 'Brahma Vidya Sadhana Yoga',
        nameHi: 'ब्रह्म विद्या साधना योग',
        nature: 'Benefic (Shubha)',
        natureHi: 'शुभ योग',
        ruleEn: `Jupiter placed in Kendra/Trikona House ${jupD20.houseFromVargaLagna} of Vimshamsha.`,
        ruleHi: `गुरु विंशांश के केंद्र/त्रिकोण भाव ${jupD20.houseFromVargaLagna} में स्थित हैं।`,
        impactEn: 'Bestows spontaneous meditative focus, authentic mantra siddhi, and divine spiritual awakening.',
        impactHi: 'ध्यान, मंत्र सिद्धि, ईश्वरीय साक्षात्कार व आध्यात्मिक उन्नति का दिव्य योग।',
        participatingPlanets: ['Jupiter'],
      });
    }
  }

  // 8. D60 (SHASHTIAMSHA) YOGAS
  if (targetVarga === 'D60' && stdChart) {
    yogas.push({
      id: 'D60_KARMA_NIRVANA',
      vargaId: 'D60',
      nameEn: 'Shashtiamsa Karma Rebalancing Yoga',
      nameHi: 'षष्ट्यंश कर्म परिमार्जन योग',
      nature: 'Benefic (Shubha)',
      natureHi: 'शुभ योग',
      ruleEn: 'Deep karmic blueprint reveals opportunities for resolving ancient vows through present dharma.',
      ruleHi: 'सूक्ष्म पूर्व कर्म बीज इस जन्म में सत्य व निष्काम सेवा द्वारा मोक्ष मार्ग प्रशस्त करते हैं।',
      impactEn: 'Conscious moral conduct neutralizes old karmic weight and activates hidden spiritual genius.',
      impactHi: 'नैतिक आचरण व धर्म-पालन से प्राचीन कर्म-ऋण समाप्त होकर आत्मिक शांति मिलती है।',
      participatingPlanets: ['Asc', 'Saturn'],
    });
  }

  // 9. HIGHER VARGAS (D108..D360)
  if (higherChart) {
    const microVargottamas = higherChart.placements.filter((p) => p.isMicroVargottama);
    if (microVargottamas.length > 0) {
      yogas.push({
        id: `${targetVarga}_MICRO_VARGOTTAMA`,
        vargaId: targetVarga,
        nameEn: `Micro-Harmonic Vargottama (${targetVarga})`,
        nameHi: `सूक्ष्म वर्गोत्तम योग (${targetVarga})`,
        nature: 'Benefic (Shubha)',
        natureHi: 'शुभ योग',
        ruleEn: `Planets in ${targetVarga} match natal D1 Rasi signs: ${microVargottamas.map((p) => p.id).join(', ')}.`,
        ruleHi: `${targetVarga} में ग्रह D1 लग्न राशि के समान राशि में स्थित हैं: ${microVargottamas.map((p) => p.id).join(', ')}।`,
        impactEn: `Hyper-refined psychic and genetic talent; indicates specialized mastery and destiny fulfillment in ${higherChart.meta.nameEn}.`,
        impactHi: `${higherChart.meta.nameHi} में विशिष्ट प्रतिभा, सूक्ष्म कौशल व युगांतरकारी सफलता का योग।`,
        participatingPlanets: microVargottamas.map((p) => p.id),
      });
    }
  }

  return yogas;
}
