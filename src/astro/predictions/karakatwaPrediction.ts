import type { ChartData, BodyPosition, NineGrahaId } from '../types';
import { SIGNS } from '../constants';

export type KarakatwaDomainId = 'appearance' | 'siblings' | 'personality';
export type KarakatwaEvidenceLevel = 'single-indication' | 'corroborated' | 'mixed' | 'insufficient';
export type KarakatwaSourceStatus = 'primary-text' | 'translation-check' | 'research-hypothesis' | 'calculated-data';

export interface KarakatwaEvidence {
  id: string;
  kind: 'supportive' | 'caution' | 'context';
  factor: string;
  detailEn: string;
  detailHi: string;
  source: string;
  sourceStatus: KarakatwaSourceStatus;
  sourceUrl: string;
}

export interface KarakatwaPrediction {
  id: KarakatwaDomainId;
  titleEn: string;
  titleHi: string;
  predictionEn: string;
  predictionHi: string;
  evidenceLevel: KarakatwaEvidenceLevel;
  evidence: KarakatwaEvidence[];
  caveatEn: string;
  caveatHi: string;
}

export interface KarakatwaPredictionReport {
  titleEn: string;
  titleHi: string;
  summaryEn: string;
  summaryHi: string;
  predictions: KarakatwaPrediction[];
}

const BENEFICS = new Set<NineGrahaId>(['Jupiter', 'Venus']);
const FIXED_MALEFICS = new Set<NineGrahaId>(['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu']);
const HI: Record<string, string> = {
  Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध',
  Jupiter: 'बृहस्पति', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
};
const BPHS = 'Brihat Parashara Hora Shastra';
const BPHS_URL = 'https://vedic-astro.s3.amazonaws.com/books/bhrihat_parasara_hora_shastra.pdf';

function houseSignIndex(chart: ChartData, house: number): number {
  return (chart.ascendant.signIndex + house - 1) % 12;
}

function lordOfHouse(chart: ChartData, house: number): BodyPosition | undefined {
  const lordId = SIGNS[houseSignIndex(chart, house)]?.lord;
  return lordId ? chart.planets.find((p) => p.id === lordId) : undefined;
}

function occupants(chart: ChartData, house: number): BodyPosition[] {
  return chart.planets.filter((p) => p.rasiHouseNumber === house && p.id !== 'Uranus' && p.id !== 'Neptune' && p.id !== 'Pluto');
}

function aspectsHouse(chart: ChartData, targetHouse: number): BodyPosition[] {
  return chart.planets.filter((planet) => {
    if (!['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'].includes(planet.id)) return false;
    const from = planet.rasiHouseNumber;
    const offsets = planet.id === 'Mars' ? [3, 6, 7]
      : planet.id === 'Jupiter' ? [4, 6, 8]
      : planet.id === 'Saturn' ? [2, 6, 9]
      : [6];
    return from !== targetHouse && offsets.some((offset) => ((from - 1 + offset) % 12) + 1 === targetHouse);
  });
}

function dignitySupport(planet: BodyPosition | undefined): boolean {
  return !!planet && ['Exalted', 'Moolatrikona', 'Own Sign', 'Great Friend', 'Friend'].includes(planet.dignity);
}

function dignityCaution(planet: BodyPosition | undefined): boolean {
  return !!planet && ['Debilitated', 'Great Enemy', 'Enemy'].includes(planet.dignity);
}

function houseIsKendraOrTrikona(house: number): boolean {
  return [1, 4, 5, 7, 9, 10].includes(house);
}

function isBenefic(chart: ChartData, planet: BodyPosition): boolean {
  if (planet.id === 'Moon') return chart.panchang?.tithi?.paksha === 'Shukla';
  if (planet.id === 'Mercury') {
    return !chart.planets.some((other) => other.id !== 'Mercury'
      && other.rasiHouseNumber === planet.rasiHouseNumber
      && FIXED_MALEFICS.has(other.id as NineGrahaId));
  }
  return BENEFICS.has(planet.id as NineGrahaId);
}

function isMalefic(chart: ChartData, planet: BodyPosition): boolean {
  if (planet.id === 'Moon') return chart.panchang?.tithi?.paksha === 'Krishna';
  if (planet.id === 'Mercury') return !isBenefic(chart, planet);
  return FIXED_MALEFICS.has(planet.id as NineGrahaId);
}

function addNakshatraContext(evidence: KarakatwaEvidence[], planet: BodyPosition | undefined, label: string): void {
  if (!planet) return;
  evidence.push(makeEvidence(
    `nakshatra-${label}-${planet.id.toLowerCase()}`, 'context', `${label}: sign and nakshatra context`,
    `${planet.id} is in ${planet.signName}, ${planet.nakshatraName} pada ${planet.pada}; the nakshatra lord is ${planet.nakshatraLord}. This is retained as a separate interpretive layer and is not used as a stand-alone prediction until its specific rule and source are verified.`,
    `${HI[planet.id] ?? planet.id} ${planet.signName} राशि में ${planet.nakshatraName} नक्षत्र के पाद ${planet.pada} में हैं; नक्षत्र स्वामी ${HI[planet.nakshatraLord] ?? planet.nakshatraLord} हैं। इसे अलग व्याख्यात्मक स्तर पर रखा गया है; विशिष्ट नियम और ग्रंथ-संदर्भ सत्यापित हुए बिना इसे स्वतंत्र फलादेश नहीं बनाया जाता।`,
    'Nakshatra interpretive layer — rule-level source verification pending',
    'research-hypothesis',
    '',
  ));
}

function evidenceLevel(supportive: number, caution: number, total: number): KarakatwaEvidenceLevel {
  if (total === 0 || (supportive === 0 && caution === 0)) return 'insufficient';
  if (supportive > 0 && caution > 0) return 'mixed';
  if (total >= 3) return 'corroborated';
  return 'single-indication';
}

function evidenceLevelText(level: KarakatwaEvidenceLevel, hi: boolean): string {
  const labels = {
    'single-indication': ['one supporting indication', 'एक सहायक संकेत'],
    corroborated: ['multiple independent indications converge', 'एकाधिक स्वतंत्र संकेत एक दिशा में हैं'],
    mixed: ['supporting and cautionary indications are mixed', 'सहायक और सावधानी वाले संकेत मिले-जुले हैं'],
    insufficient: ['the available chart factors are insufficient for a specific conclusion', 'उपलब्ध कुंडली-संकेत किसी विशिष्ट निष्कर्ष के लिए पर्याप्त नहीं हैं'],
  } as const;
  return labels[level][hi ? 1 : 0];
}

function makeEvidence(
  id: string,
  kind: KarakatwaEvidence['kind'],
  factor: string,
  detailEn: string,
  detailHi: string,
  source: string,
  sourceStatus: KarakatwaSourceStatus = 'primary-text',
  sourceUrl = BPHS_URL,
): KarakatwaEvidence {
  return { id, kind, factor, detailEn, detailHi, source, sourceStatus, sourceUrl };
}

function addCalculatedGrahaFactors(
  evidence: KarakatwaEvidence[],
  chart: ChartData,
  candidates: Array<BodyPosition | undefined>,
  includeAscendantAspects = false,
): void {
  const relevant = [...new Map(candidates.filter((p): p is BodyPosition => !!p).map((p) => [p.id, p])).values()];
  const ids = new Set(relevant.map((p) => p.id));

  for (const planet of relevant) {
    evidence.push(makeEvidence(
      `calculated-degree-${planet.id.toLowerCase()}`, 'context', `Calculated placement: ${planet.id}`,
      `${planet.id} is at ${planet.dms} in ${planet.signName}; degree in sign ${planet.degreeInSign.toFixed(4)}°. Rasi house: ${planet.rasiHouseNumber}; selected bhava house: ${planet.houseNumber}. Dignity: ${planet.dignity}; retrograde: ${planet.isRetrograde ? 'yes' : 'no'}; combust: ${planet.isCombust ? 'yes' : 'no'}.`,
      `${HI[planet.id] ?? planet.id} ${planet.signName} राशि में ${planet.dms} पर हैं; राशि में अंश ${planet.degreeInSign.toFixed(4)}°। राशि-भाव: ${planet.rasiHouseNumber}; चुनी हुई भाव-पद्धति का भाव: ${planet.houseNumber}। गरिमा: ${planet.dignity}; वक्री: ${planet.isRetrograde ? 'हाँ' : 'नहीं'}; अस्त: ${planet.isCombust ? 'हाँ' : 'नहीं'}।`,
      'Calculated chart data (not a separate textual rule)', 'calculated-data', '',
    ));
    const strength = chart.shadbala?.find((row) => row.planet === planet.id);
    if (strength) {
      evidence.push(makeEvidence(
        `calculated-shadbala-${planet.id.toLowerCase()}`, 'context', `Shadbala: ${planet.id}`,
        `Total ${strength.totalRupas.toFixed(2)} rupas against ${strength.requiredRupas.toFixed(2)} required; ratio ${strength.ratio.toFixed(2)}×; Ishta phala ${strength.ishtaPhala.toFixed(2)} and Kashta phala ${strength.kashtaPhala.toFixed(2)}.`,
        `कुल षड्बल ${strength.totalRupas.toFixed(2)} रूप; आवश्यक ${strength.requiredRupas.toFixed(2)} रूप; अनुपात ${strength.ratio.toFixed(2)}×; इष्टफल ${strength.ishtaPhala.toFixed(2)} और कष्टफल ${strength.kashtaPhala.toFixed(2)}।`,
        'Calculated Shadbala data', 'calculated-data', '',
      ));
    }
  }

  for (let i = 0; i < relevant.length; i++) {
    for (let j = i + 1; j < relevant.length; j++) {
      const a = relevant[i];
      const b = relevant[j];
      if (a.signIndex !== b.signIndex) continue;
      const raw = Math.abs(a.longitude - b.longitude);
      const separation = Math.min(raw, 360 - raw);
      evidence.push(makeEvidence(
        `calculated-yuti-${a.id.toLowerCase()}-${b.id.toLowerCase()}`, 'context',
        `Same-sign yuti review: ${a.id} + ${b.id}`,
        `Both planets occupy ${a.signName}; their angular separation is ${separation.toFixed(3)}°. This is a measured association for interpretation, not an automatic conjunction verdict; no universal orb is assumed.`,
        `दोनों ग्रह ${a.signName} राशि में हैं; इनके बीच कोणीय अंतर ${separation.toFixed(3)}° है। यह व्याख्या हेतु मापा गया संबंध है, अपने-आप में युति का अंतिम निर्णय नहीं; कोई सार्वभौमिक ऑर्ब नहीं माना गया है।`,
        'Calculated sign and longitude data', 'calculated-data', '',
      ));
    }
  }

  for (const aspect of chart.aspects ?? []) {
    const touchesRelevant = ids.has(aspect.from)
      || (aspect.to !== 'Asc' && ids.has(aspect.to))
      || (includeAscendantAspects && aspect.to === 'Asc');
    if (!touchesRelevant) continue;
    evidence.push(makeEvidence(
      `calculated-aspect-${aspect.from.toLowerCase()}-${String(aspect.to).toLowerCase()}`, 'context',
      `Calculated drishti: ${aspect.from} → ${aspect.to}`,
      `${aspect.type}; orb ${aspect.orbDeg.toFixed(3)}°; calculated aspect strength ${aspect.strengthPercent.toFixed(1)}%. Interpret through the planets' ownership, dignity, strength and this domain's significations.`,
      `${aspect.from} से ${aspect.to} पर ${aspect.type}; ऑर्ब ${aspect.orbDeg.toFixed(3)}°; गणितीय दृष्टि-बल ${aspect.strengthPercent.toFixed(1)}%। फलादेश में ग्रहों का भाव-स्वामित्व, गरिमा, बल और इस विषय से उनका संबंध साथ देखें।`,
      'Calculated aspect engine data', 'calculated-data', '',
    ));
  }
}

function appearancePrediction(chart: ChartData): KarakatwaPrediction {
  const evidence: KarakatwaEvidence[] = [];
  const lagnaOccupants = occupants(chart, 1);
  const beneficOccupants = lagnaOccupants.filter((p) => isBenefic(chart, p));
  const beneficAspects = aspectsHouse(chart, 1).filter((p) => isBenefic(chart, p));
  const lagnaLord = lordOfHouse(chart, 1);
  const moon = chart.planets.find((p) => p.id === 'Moon');
  const venus = chart.planets.find((p) => p.id === 'Venus');

  if (beneficOccupants.length) {
    evidence.push(makeEvidence(
      'appearance-benefic-lagna', 'supportive', 'Benefic planet(s) in the ascendant',
      `${beneficOccupants.map((p) => p.id).join(', ')} occupy the ascendant. BPHS describes benefic influence on the ascendant as supporting pleasing bodily appearance.`,
      `लग्न में ${beneficOccupants.map((p) => HI[p.id] ?? p.id).join(', ')} स्थित हैं। बृहत्पाराशर होराशास्त्र में लग्न पर शुभ प्रभाव को मनोहर शारीरिक रूप-रंग का सहायक संकेत माना गया है।`,
      `${BPHS}, Chapter 12, verses 1–7`,
    ));
  }
  if (beneficAspects.length) {
    evidence.push(makeEvidence(
      'appearance-benefic-aspect', 'supportive', 'Benefic aspect on the ascendant',
      `${beneficAspects.map((p) => p.id).join(', ')} cast a classical graha aspect to the ascendant; this is a second, distinct form of benefic influence.`,
      `लग्न पर ${beneficAspects.map((p) => HI[p.id] ?? p.id).join(', ')} की ग्रह-दृष्टि है; यह शुभ प्रभाव का अलग संकेत है।`,
      `${BPHS}, Chapter 12, verses 1–7`,
    ));
  }
  if (moon?.rasiHouseNumber === 1 || venus?.rasiHouseNumber === 1) {
    const inLagna = [moon, venus].filter((p) => p?.rasiHouseNumber === 1).map((p) => p!.id);
    evidence.push(makeEvidence(
      'appearance-moon-venus-lagna', 'supportive', 'Moon/Venus connection with the ascendant',
      `${inLagna.join(' and ')} is placed in the ascendant. Traditional appearance descriptions associate Moon and Venus with pleasing or attractive bodily qualities; this is an indication, not a physical measurement.`,
      `लग्न में ${inLagna.map((id) => HI[id]).join(' और ')} स्थित हैं। पारंपरिक ग्रह-स्वरूप वर्णन चंद्र और शुक्र को सौम्य अथवा आकर्षक शारीरिक गुणों से जोड़ते हैं; यह संकेत है, शारीरिक माप नहीं।`,
      `${BPHS}, Chapter 3, verses 23–31; Chapter 12`,
    ));
  }
  if (lagnaLord) {
    addNakshatraContext(evidence, lagnaLord, 'Ascendant lord');
    const supportive = dignitySupport(lagnaLord) && !lagnaLord.isCombust;
    const caution = dignityCaution(lagnaLord) || lagnaLord.isCombust;
    evidence.push(makeEvidence(
      'appearance-lagna-lord', supportive ? 'supportive' : caution ? 'caution' : 'context',
      'Condition of the ascendant lord',
      `The ascendant lord ${lagnaLord.id} is in house ${lagnaLord.rasiHouseNumber}, ${lagnaLord.signName}, with ${lagnaLord.dignity} dignity${lagnaLord.isCombust ? ' and is combust' : ''}. BPHS asks the reader to weigh the ascendant and its lord together.`,
      `लग्नेश ${HI[lagnaLord.id] ?? lagnaLord.id} भाव ${lagnaLord.rasiHouseNumber}, ${lagnaLord.signName} राशि में ${lagnaLord.dignity} गरिमा के साथ हैं${lagnaLord.isCombust ? ' तथा अस्त हैं' : ''}। बृहत्पाराशर होराशास्त्र लग्न और लग्नेश दोनों को साथ देखकर निर्णय करने की पद्धति देता है।`,
      `${BPHS}, Chapter 12, verses 1–7`,
    ));
  }

  addCalculatedGrahaFactors(evidence, chart, [...lagnaOccupants, ...beneficAspects, lagnaLord, moon, venus], true);

  addCalculatedGrahaFactors(evidence, chart, [...thirdOccupants, ...thirdAspects, thirdLord, mars]);

  addCalculatedGrahaFactors(evidence, chart, keyPlanets);

  const supportive = evidence.filter((e) => e.kind === 'supportive').length;
  const caution = evidence.filter((e) => e.kind === 'caution').length;
  const level = evidenceLevel(supportive, caution, evidence.length);
  const predictionEn = supportive
    ? `The chart contains ${supportive > 1 ? 'more than one' : 'a'} traditional indication favouring a pleasing or noticeable presentation. The ascendant factors point more toward ${beneficOccupants.some((p) => p.id === 'Moon') || moon?.rasiHouseNumber === 1 ? 'a softer, gentler expression' : 'a balanced or refined presentation'} than a single fixed physical type. ${evidenceLevelText(level, false)}.`
    : 'The available ascendant factors do not form a sufficiently clear classical pattern for a specific appearance description. A detailed physical prediction is therefore withheld rather than guessed.';
  const predictionHi = supportive
    ? `कुंडली में मनोहर अथवा ध्यान आकर्षित करने वाले व्यक्तित्व के पक्ष में ${supportive > 1 ? 'एक से अधिक' : 'एक'} पारंपरिक संकेत मौजूद हैं। लग्न-संबंधी संकेत ${beneficOccupants.some((p) => p.id === 'Moon') || moon?.rasiHouseNumber === 1 ? 'कोमल और सौम्य अभिव्यक्ति' : 'संतुलित अथवा सुसंस्कृत प्रस्तुति'} की ओर झुकते हैं। ${evidenceLevelText(level, true)}।`
    : 'उपलब्ध लग्न-संबंधी संकेत किसी विशिष्ट रूप-रंग का वर्णन करने के लिए पर्याप्त स्पष्ट शास्त्रीय योग नहीं बनाते। इसलिए अनुमान लगाने के बजाय विस्तृत शारीरिक फलादेश नहीं दिया जा रहा है।';

  // Classical planet-appearance descriptions are not converted into baldness claims.
  const hairPlanets = [chart.planets.find((p) => p.id === 'Sun'), chart.planets.find((p) => p.id === 'Saturn')]
    .filter((p): p is BodyPosition => !!p && (p.rasiHouseNumber === 1 || p.id === lagnaLord?.id));
  for (const planet of hairPlanets) {
    evidence.push(makeEvidence(
      `appearance-hair-${planet.id.toLowerCase()}`, 'context', `Traditional physical description: ${planet.id}`,
      `${planet.id} is connected with the ascendant. BPHS Chapter 3 includes a traditional physical description of this graha; the text does not establish that this placement alone causes hair loss or baldness.`,
      ` ${HI[planet.id]} का लग्न से संबंध है। बृहत्पाराशर होराशास्त्र के अध्याय 3 में इस ग्रह का पारंपरिक शारीरिक स्वरूप-वर्णन है; केवल इस स्थिति से बाल झड़ने या गंजेपन का निष्कर्ष नहीं निकाला जाता।`,
      `${BPHS}, Chapter 3, verses 23–31`,
    ));
  }

  return {
    id: 'appearance', titleEn: 'Physical Appearance & Presentation', titleHi: 'शारीरिक रूप-रंग एवं व्यक्तित्व की प्रस्तुति',
    predictionEn, predictionHi, evidenceLevel: level, evidence,
    caveatEn: 'Appearance is also shaped by heredity, age, environment and health. Classical graha descriptions are symbolic indications, not a reliable way to diagnose hair loss or determine exact physical features.',
    caveatHi: 'रूप-रंग पर आनुवंशिकता, आयु, परिवेश और स्वास्थ्य का भी प्रभाव होता है। ग्रहों के शास्त्रीय स्वरूप-वर्णन प्रतीकात्मक संकेत हैं; उनसे बाल झड़ने का निदान या सटीक शारीरिक विशेषताएँ तय नहीं की जा सकतीं।',
  };
}

function siblingPrediction(chart: ChartData): KarakatwaPrediction {
  const evidence: KarakatwaEvidence[] = [];
  const thirdOccupants = occupants(chart, 3);
  const thirdAspects = aspectsHouse(chart, 3);
  const thirdLord = lordOfHouse(chart, 3);
  const mars = chart.planets.find((p) => p.id === 'Mars');
  const benefics = [...thirdOccupants, ...thirdAspects].filter((p) => isBenefic(chart, p));
  const malefics = [...thirdOccupants, ...thirdAspects].filter((p) => isMalefic(chart, p));

  if (benefics.length) {
    evidence.push(makeEvidence(
      'siblings-benefic-third', 'supportive', 'Benefic influence on the third house',
      `Benefic influence on the third house comes from ${[...new Set(benefics.map((p) => p.id))].join(', ')}. BPHS Chapter 14 treats benefic influence on the third as relevant to sibling-related happiness and support.`,
      `तृतीय भाव पर ${[...new Set(benefics.map((p) => HI[p.id] ?? p.id))].join(', ')} का शुभ प्रभाव है। बृहत्पाराशर होराशास्त्र अध्याय 14 में तृतीय भाव पर शुभ प्रभाव को भाई-बहनों से सुख एवं सहयोग के आकलन में महत्त्व दिया गया है।`,
      `${BPHS}, Chapter 14, verses 1–6`,
      'translation-check',
    ));
  }
  if (thirdLord) {
    addNakshatraContext(evidence, thirdLord, 'Third-house lord');
    const supportive = dignitySupport(thirdLord) || houseIsKendraOrTrikona(thirdLord.rasiHouseNumber);
    const caution = dignityCaution(thirdLord) || thirdLord.isCombust;
    evidence.push(makeEvidence(
      'siblings-third-lord', supportive ? 'supportive' : caution ? 'caution' : 'context',
      'Strength and placement of the third-house lord',
      `The third-house lord ${thirdLord.id} is in house ${thirdLord.rasiHouseNumber} (${thirdLord.signName}) with ${thirdLord.dignity} dignity${thirdLord.isCombust ? ' and is combust' : ''}. BPHS weighs the strength and placement of the third lord when judging sibling matters.`,
      `तृतीयेश ${HI[thirdLord.id] ?? thirdLord.id} भाव ${thirdLord.rasiHouseNumber} (${thirdLord.signName}) में ${thirdLord.dignity} गरिमा के साथ हैं${thirdLord.isCombust ? ' तथा अस्त हैं' : ''}। बृहत्पाराशर होराशास्त्र भाई-बहनों के विषय में तृतीयेश के बल और स्थिति को साथ तौलता है।`,
      `${BPHS}, Chapter 14, verses 1–6 and 15`,
      'translation-check',
    ));
  }
  if (mars) {
    addNakshatraContext(evidence, mars, 'Sibling significator');
    const connected = mars.rasiHouseNumber === 3 || thirdAspects.some((p) => p.id === 'Mars');
    const supportive = connected && dignitySupport(mars) && !mars.isCombust;
    const caution = connected && (dignityCaution(mars) || mars.isCombust);
    evidence.push(makeEvidence(
      'siblings-mars-karaka', supportive ? 'supportive' : caution ? 'caution' : 'context',
      'Mars as a natural sibling significator',
      `Mars is in house ${mars.rasiHouseNumber} with ${mars.dignity} dignity${connected ? ' and has a direct connection to the third house' : ''}. It is included as a natural significator, but is not used alone to infer sibling count or outcomes.`,
      `मंगल भाव ${mars.rasiHouseNumber} में ${mars.dignity} गरिमा के साथ हैं${connected ? ' तथा तृतीय भाव से सीधा संबंध रखते हैं' : ''}। मंगल को नैसर्गिक कारक के रूप में देखा गया है, पर केवल इससे भाई-बहनों की संख्या या परिणाम तय नहीं किए जाते।`,
      `${BPHS}, Chapter 14`,
      'translation-check',
    ));
  }
  const drekkana = chart.divisionalCharts?.D3;
  if (drekkana) {
    const d3Mars = drekkana.placements.find((p) => p.id === 'Mars');
    evidence.push(makeEvidence(
      'siblings-d3-cross-check', 'context', 'Drekkana (D3) supplementary cross-check',
      `D3 is available; its ascendant sign index is ${drekkana.lagnaSignIndex}${d3Mars ? ` and Mars is in D3 house ${d3Mars.houseFromVargaLagna} with ${d3Mars.dignity} dignity` : ''}. This is recorded as supplementary context, not as a stand-alone sibling-count rule.`,
      `द्रेष्काण (D3) उपलब्ध है; इसका लग्न राशि-सूचकांक ${drekkana.lagnaSignIndex} है${d3Mars ? ` और मंगल D3 के भाव ${d3Mars.houseFromVargaLagna} में ${d3Mars.dignity} गरिमा के साथ हैं` : ''}। इसे सहायक संदर्भ के रूप में रखा गया है, भाई-बहनों की संख्या का स्वतंत्र नियम नहीं बनाया गया है।`,
      'Drekkana (D3) — supplementary divisional-chart cross-check',
      'research-hypothesis',
      '',
    ));
  }

  if (malefics.length) {
    evidence.push(makeEvidence(
      'siblings-malefic-third', 'caution', 'Malefic influence on the third house',
      `The third house receives influence from ${[...new Set(malefics.map((p) => p.id))].join(', ')}. This is treated as a caution to examine effort, friction or distance in sibling relationships, not as proof of absence, death or estrangement.`,
      `तृतीय भाव पर ${[...new Set(malefics.map((p) => HI[p.id] ?? p.id))].join(', ')} का प्रभाव है। इसे भाई-बहनों के संबंध में प्रयास, मतभेद या दूरी की जाँच का संकेत माना गया है; इससे अनुपस्थिति, मृत्यु या संबंध-विच्छेद सिद्ध नहीं होता।`,
      `${BPHS}, Chapter 14, verses 1–6 and 15`,
      'translation-check',
    ));
  }

  const supportive = evidence.filter((e) => e.kind === 'supportive').length;
  const caution = evidence.filter((e) => e.kind === 'caution').length;
  const level = evidenceLevel(supportive, caution, evidence.length);
  const predictionEn = supportive > caution
    ? `The sibling indicators lean toward the possibility of support or meaningful cooperation, although the actual closeness will depend on circumstances and both people's choices. ${evidenceLevelText(level, false)}.`
    : caution > supportive
      ? 'The sibling indicators call for more care around communication, expectations and mutual support. Periods of distance or friction are possible, but the chart does not justify declaring that younger siblings will be absent or that a relationship must break.'
      : 'The sibling picture is mixed or not sufficiently distinctive. The third house, its lord and Mars must be judged together; the available pattern does not support a firm claim about sibling count or relationship outcomes.';
  const predictionHi = supportive > caution
    ? `भाई-बहनों से सहयोग अथवा सार्थक साथ मिलने की संभावना के पक्ष में संकेत अधिक हैं, यद्यपि वास्तविक निकटता परिस्थितियों और दोनों व्यक्तियों के व्यवहार पर निर्भर करेगी। ${evidenceLevelText(level, true)}।`
    : caution > supportive
      ? 'भाई-बहनों के साथ संवाद, अपेक्षाओं और पारस्परिक सहयोग में अधिक सावधानी रखने का संकेत है। कभी-कभी दूरी या मतभेद संभव हैं, लेकिन कुंडली के आधार पर छोटे भाई-बहन न होने या संबंध टूटने की घोषणा उचित नहीं है।'
      : 'भाई-बहनों से संबंधित संकेत मिले-जुले हैं या पर्याप्त विशिष्ट नहीं हैं। तृतीय भाव, उसके स्वामी और मंगल को साथ देखकर ही निर्णय करना चाहिए; उपलब्ध स्थिति से भाई-बहनों की संख्या या संबंधों पर पक्का निष्कर्ष नहीं निकलता।';

  return {
    id: 'siblings', titleEn: 'Younger Siblings & Sibling Relationships', titleHi: 'छोटे भाई-बहन एवं पारिवारिक संबंध',
    predictionEn, predictionHi, evidenceLevel: level, evidence,
    caveatEn: 'The third house is a traditional indicator, not a census. Do not infer that a sibling does not exist, has died, or will be harmed from one affliction. D3 and the full chart are supplementary checks.',
    caveatHi: 'तृतीय भाव पारंपरिक संकेतक है, परिवार की वास्तविक संख्या बताने वाला जनगणना-पत्र नहीं। एक दोष से भाई-बहन का न होना, मृत्यु या हानि निष्कर्षित न करें। D3 और पूरी कुंडली सहायक जाँच हैं।',
  };
}

const PLANET_TEMPERAMENT: Record<string, { en: string; hi: string }> = {
  Sun: { en: 'self-directed, purposeful and inclined to take responsibility', hi: 'स्व-निर्णयी, उद्देश्य-केंद्रित और जिम्मेदारी लेने वाला' },
  Moon: { en: 'responsive, perceptive and emotionally receptive', hi: 'संवेदनशील, ग्रहणशील और भावनात्मक रूप से सजग' },
  Mars: { en: 'direct, energetic and action-oriented', hi: 'स्पष्टवादी, ऊर्जावान और कर्म-प्रधान' },
  Mercury: { en: 'analytical, curious and communication-oriented', hi: 'विश्लेषणात्मक, जिज्ञासु और संवाद-केंद्रित' },
  Jupiter: { en: 'principled, reflective and oriented toward learning', hi: 'सिद्धांतनिष्ठ, विचारशील और सीखने की ओर उन्मुख' },
  Venus: { en: 'harmonising, sociable and attentive to comfort or aesthetics', hi: 'सामंजस्यप्रिय, मिलनसार और सुविधा अथवा सौंदर्य के प्रति सजग' },
  Saturn: { en: 'measured, persistent and cautious before committing', hi: 'संयमित, धैर्यशील और निर्णय से पहले सावधानी रखने वाला' },
  Rahu: { en: 'ambitious, experimental and drawn to unconventional approaches', hi: 'महत्त्वाकांक्षी, प्रयोगशील और अपरंपरागत तरीकों की ओर आकर्षित' },
  Ketu: { en: 'independent, inward-looking and selective about involvement', hi: 'स्वतंत्र, अंतर्मुखी और सहभागिता के विषय में चयनशील' },
};

function connectedLabel(planet: BodyPosition, lagnaLord: BodyPosition | undefined): string {
  return planet.id === lagnaLord?.id ? 'Ascendant lord'
    : planet.id === 'Moon' ? 'Moon'
      : 'Sun';
}

function personalityPrediction(chart: ChartData): KarakatwaPrediction {
  const evidence: KarakatwaEvidence[] = [];
  const lagnaLord = lordOfHouse(chart, 1);
  const moon = chart.planets.find((p) => p.id === 'Moon');
  const sun = chart.planets.find((p) => p.id === 'Sun');
  const keyPlanets = [lagnaLord, moon, sun].filter((p): p is BodyPosition => !!p);
  const seen = new Set<string>();

  for (const planet of keyPlanets) {
    if (seen.has(planet.id)) continue;
    seen.add(planet.id);
    const trait = PLANET_TEMPERAMENT[planet.id];
    if (!trait) continue;
    addNakshatraContext(evidence, planet, connectedLabel(planet, lagnaLord));
    const connected = planet.id === lagnaLord?.id ? 'ascendant lord' : planet.id === 'Moon' ? 'Moon (emotional responses)' : 'Sun (purpose and self-expression)';
    const kind = dignitySupport(planet) && !planet.isCombust ? 'supportive'
      : dignityCaution(planet) || planet.isCombust ? 'caution' : 'context';
    evidence.push(makeEvidence(
      `personality-${planet.id.toLowerCase()}`, kind, `${planet.id} as ${connected}`,
      `${planet.id} is placed in house ${planet.rasiHouseNumber}, ${planet.signName}, with ${planet.dignity} dignity. Its traditional temperament is described as ${trait.en}.`,
      `${HI[planet.id] ?? planet.id} भाव ${planet.rasiHouseNumber}, ${planet.signName} राशि में ${planet.dignity} गरिमा के साथ स्थित हैं। इसका पारंपरिक स्वभाव-वर्णन: ${trait.hi}।`,
      `${BPHS}, Chapter 3, verses 23–31; Chapter 12`,
    ));
  }

  const supportive = evidence.filter((e) => e.kind === 'supportive').length;
  const caution = evidence.filter((e) => e.kind === 'caution').length;
  const level = evidenceLevel(supportive, caution, evidence.length);
  const dominant = lagnaLord ? PLANET_TEMPERAMENT[lagnaLord.id] : undefined;
  const moonTrait = moon ? PLANET_TEMPERAMENT[moon.id] : undefined;
  const predictionEn = dominant && moonTrait
    ? `Your outward approach is coloured by a ${dominant.en} style, while your emotional responses carry a ${moonTrait.en} quality. This can create a recognisable contrast between how you approach tasks and how you process personal experiences. ${evidenceLevelText(level, false)}.`
    : 'The ascendant lord and Moon data are not both available, so a balanced personality synthesis cannot be made from the current chart data.';
  const predictionHi = dominant && moonTrait
    ? `आपका बाहरी व्यवहार ${dominant.hi} प्रवृत्ति से प्रभावित है, जबकि भावनात्मक प्रतिक्रिया में ${moonTrait.hi} गुण दिखाई देते हैं। इससे काम करने के तरीके और निजी अनुभवों को भीतर ग्रहण करने के तरीके में एक पहचाने जाने योग्य अंतर बन सकता है। ${evidenceLevelText(level, true)}।`
    : 'लग्नेश और चंद्रमा—दोनों का डेटा उपलब्ध नहीं है, इसलिए वर्तमान कुंडली-डेटा से संतुलित व्यक्तित्व-समन्वय नहीं किया जा सकता।';

  return {
    id: 'personality', titleEn: 'Personality, Behaviour & Emotional Nature', titleHi: 'व्यक्तित्व, व्यवहार एवं भावनात्मक स्वभाव',
    predictionEn, predictionHi, evidenceLevel: level, evidence,
    caveatEn: 'These are traditional symbolic temperament descriptions. They do not determine a person’s character, mental health or behaviour; upbringing and lived experience matter.',
    caveatHi: 'ये पारंपरिक प्रतीकात्मक स्वभाव-वर्णन हैं। इनसे किसी व्यक्ति का चरित्र, मानसिक स्वास्थ्य या व्यवहार निश्चित नहीं होता; परवरिश और जीवन-अनुभव भी महत्त्वपूर्ण हैं।',
  };
}

export function computeKarakatwaPredictions(chart: ChartData): KarakatwaPredictionReport {
  const predictions = [
    appearancePrediction(chart),
    siblingPrediction(chart),
    personalityPrediction(chart),
  ];
  return {
    titleEn: 'Karakatwa-Based Predictions',
    titleHi: 'कारकत्व-आधारित फलादेश',
    summaryEn: 'Specific life-level indications are formed from the ascendant, its lord, relevant house, natural significators and classical descriptions. Each statement shows its textual basis and limits; a single placement is never treated as a guaranteed event.',
    summaryHi: 'लग्न, लग्नेश, संबंधित भाव, नैसर्गिक कारक और शास्त्रीय ग्रह-स्वरूप के समन्वय से जीवन से जुड़े विशिष्ट संकेत निकाले गए हैं। प्रत्येक कथन के साथ उसका ग्रंथ-आधार और सीमा दी गई है; किसी एक स्थिति को निश्चित घटना नहीं माना गया है।',
    predictions,
  };
}
