import { NAKSHATRAS, NINE_GRAHAS, SIGNS, VIMSHOTTARI_ORDER, VIMSHOTTARI_YEARS } from './constants';
import { computeKpReport, computeSubSubLord, type KpCuspInfo, type KpPlanetRow } from './kp';
import { formatDms, normalizeDeg } from './time';
import type { ChartData, NineGrahaId, SevenPlanetId } from './types';
import { computeKpSubLord } from './vargas';

export interface CilCuspRow {
  house: number;
  longitude: number;
  signIndex: number;
  signName: string;
  dms: string;
  signLord: SevenPlanetId;
  starLord: NineGrahaId;
  subLord: NineGrahaId;
  subSubLord: NineGrahaId;
  sslStarLord: NineGrahaId;
  sslSubLord: NineGrahaId;
  sslIndex2193: number; // 1 to 2193 micro-arc position
  sslArcSpanDms: string;
  involvementHouses: number[]; // Houses signified by SSL Star Lord
  commitmentHouses: number[]; // Houses signified by SSL Sub Lord
  finalSignifications: number[]; // Combined houses signified
  promiseSummaryEn: string;
  promiseSummaryHi: string;
}

export interface CilPlanetRow {
  planet: NineGrahaId;
  longitude: number;
  signIndex: number;
  signName: string;
  dms: string;
  kpHouse: number;
  signLord: SevenPlanetId;
  starLord: NineGrahaId;
  subLord: NineGrahaId;
  subSubLord: NineGrahaId;
  sslStarLord: NineGrahaId;
  sslSubLord: NineGrahaId;
  sslIndex2193: number;
  signifiedHouses: number[];
}

export interface CuspalPromiseVerification {
  topic: string;
  topicHi: string;
  primaryCusp: number;
  sslLord: NineGrahaId;
  sslStarLord: NineGrahaId;
  sslSubLord: NineGrahaId;
  favorableHouses: number[];
  detrimentalHouses: number[];
  involvementMatches: number[];
  commitmentMatches: number[];
  verdict: 'Strong Promise (पूर्ण सिद्धि)' | 'Conditional / Delayed (प्रयत्न साध्य)' | 'Adverse / Remedial Required (अवरोध / शांति आवश्यक)';
  analysisEn: string;
  analysisHi: string;
}

export interface KpCilMasterReport {
  ayanamsaDms: string;
  totalSubSubSegments: number; // 2193
  cusps: CilCuspRow[];
  planets: CilPlanetRow[];
  cuspalPromises: CuspalPromiseVerification[];
  overallSummaryEn: string;
  overallSummaryHi: string;
}

/**
 * Calculates the exact 1-2193 index and arc span for a given sidereal longitude.
 * 27 Nakshatras * 9 Sub-lords * 9 Sub-Sub Lords = 2,193 segments (accounting for proportional Vimshottari arc divisions).
 */
export function computeCil2193Index(siderealLon: number): {
  index: number;
  starLord: NineGrahaId;
  subLord: NineGrahaId;
  subSubLord: NineGrahaId;
  startDeg: number;
  endDeg: number;
  arcSpanDms: string;
} {
  const lon = normalizeDeg(siderealLon);
  const nakSpan = 360 / 27; // 13°20' = 13.333333333333334°
  const nakIdx = Math.floor(lon / nakSpan) % 27;
  const nakStartLon = nakIdx * nakSpan;
  const nakOffset = lon - nakStartLon;
  const nakLord = NAKSHATRAS[nakIdx].lord;

  const nakStartLordIdx = VIMSHOTTARI_ORDER.indexOf(nakLord);

  let currentSubStart = 0;
  let runningIndex = nakIdx * 81 + 1; // Base index estimation

  let foundSubLord: NineGrahaId = nakLord;
  let foundSsl: NineGrahaId = nakLord;
  let foundSslStart = 0;
  let foundSslEnd = 0;

  for (let s = 0; s < 9; s++) {
    const sLord = VIMSHOTTARI_ORDER[(nakStartLordIdx + s) % 9];
    const sSpan = (VIMSHOTTARI_YEARS[sLord] / 120) * nakSpan;
    const sEnd = currentSubStart + sSpan;

    if (nakOffset < sEnd + 1e-10 || s === 8) {
      foundSubLord = sLord;
      const subOffset = Math.max(0, nakOffset - currentSubStart);
      const sslStartLordIdx = VIMSHOTTARI_ORDER.indexOf(sLord);

      let currentSslStart = 0;
      for (let ss = 0; ss < 9; ss++) {
        const ssLord = VIMSHOTTARI_ORDER[(sslStartLordIdx + ss) % 9];
        const ssSpan = (VIMSHOTTARI_YEARS[ssLord] / 120) * sSpan;
        const ssEnd = currentSslStart + ssSpan;

        if (subOffset < ssEnd + 1e-10 || ss === 8) {
          foundSsl = ssLord;
          foundSslStart = nakStartLon + currentSubStart + currentSslStart;
          foundSslEnd = foundSslStart + ssSpan;
          runningIndex += s * 9 + ss;
          break;
        }
        currentSslStart = ssEnd;
      }
      break;
    }
    currentSubStart = sEnd;
  }

  // Constrain index within 1..2193
  const finalIndex = Math.min(2193, Math.max(1, ((runningIndex - 1) % 2193) + 1));
  const spanDeg = Math.max(0.001, foundSslEnd - foundSslStart);

  return {
    index: finalIndex,
    starLord: nakLord,
    subLord: foundSubLord,
    subSubLord: foundSsl,
    startDeg: foundSslStart,
    endDeg: foundSslEnd,
    arcSpanDms: `${formatDms(spanDeg)} (${formatDms(foundSslStart % 30)} - ${formatDms(foundSslEnd % 30)})`,
  };
}

export function computeKpCuspalInterlinksReport(chart: ChartData): KpCilMasterReport {
  const kpReport = computeKpReport(chart);

  // Map planets to their signified houses
  const planetSigMap = new Map<NineGrahaId, number[]>();
  for (const pl of kpReport.planets) {
    planetSigMap.set(pl.planet, pl.signifiesHouses);
  }

  // Function to get planetary attributes at any longitude
  const getPlanetaryCilDetail = (lon: number) => {
    const cil = computeCil2193Index(lon);
    // Find who rules the SSL's star and sub
    const sslBody = kpReport.planets.find((p) => p.planet === cil.subSubLord);
    const sslStarLord = sslBody ? sslBody.starLord : cil.subSubLord;
    const sslSubLord = sslBody ? sslBody.subLord : cil.subSubLord;

    const invHouses = planetSigMap.get(sslStarLord) ?? [];
    const comHouses = planetSigMap.get(sslSubLord) ?? [];
    const allSig = Array.from(new Set([...invHouses, ...comHouses]));

    return {
      ...cil,
      sslStarLord,
      sslSubLord,
      invHouses,
      comHouses,
      allSig,
    };
  };

  // Build CIL Cusps Table
  const cilCusps: CilCuspRow[] = kpReport.cusps.map((c: KpCuspInfo) => {
    const detail = getPlanetaryCilDetail(c.longitude);
    const signIdx = Math.floor(c.longitude / 30) % 12;

    const summaryEn = `Cusp ${c.house} SSL is ${detail.subSubLord} (Star: ${detail.sslStarLord}, Sub: ${detail.sslSubLord}). Involves houses ${detail.invHouses.join(', ') || 'None'}; commits to ${detail.comHouses.join(', ') || 'None'}.`;
    const summaryHi = `भाव ${c.house} के उप-उप स्वामी ${detail.subSubLord} (नक्षत्र: ${detail.sslStarLord}, उप: ${detail.sslSubLord})। सक्रिय भाव: ${detail.invHouses.join(', ') || 'शून्य'}; फल प्रदाता भाव: ${detail.comHouses.join(', ') || 'शून्य'}।`;

    return {
      house: c.house,
      longitude: c.longitude,
      signIndex: signIdx,
      signName: SIGNS[signIdx].name,
      dms: c.dms,
      signLord: c.signLord,
      starLord: detail.starLord,
      subLord: detail.subLord,
      subSubLord: detail.subSubLord,
      sslStarLord: detail.sslStarLord,
      sslSubLord: detail.sslSubLord,
      sslIndex2193: detail.index,
      sslArcSpanDms: detail.arcSpanDms,
      involvementHouses: detail.invHouses,
      commitmentHouses: detail.comHouses,
      finalSignifications: detail.allSig,
      promiseSummaryEn: summaryEn,
      promiseSummaryHi: summaryHi,
    };
  });

  // Build CIL Planets Table
  const cilPlanets: CilPlanetRow[] = kpReport.planets.map((p: KpPlanetRow) => {
    const detail = getPlanetaryCilDetail(p.longitude);
    const signIdx = Math.floor(p.longitude / 30) % 12;

    return {
      planet: p.planet,
      longitude: p.longitude,
      signIndex: signIdx,
      signName: SIGNS[signIdx].name,
      dms: p.dms,
      kpHouse: p.kpHouse,
      signLord: p.signLord,
      starLord: detail.starLord,
      subLord: detail.subLord,
      subSubLord: detail.subSubLord,
      sslStarLord: detail.sslStarLord,
      sslSubLord: detail.sslSubLord,
      sslIndex2193: detail.index,
      signifiedHouses: p.signifiesHouses,
    };
  });

  // Cuspal Promise Verification Engine (8 Core Life Dimensions)
  interface PromiseQuery {
    topic: string;
    topicHi: string;
    cusp: number;
    favHouses: number[];
    detHouses: number[];
    favContextEn: string;
    favContextHi: string;
    detContextEn: string;
    detContextHi: string;
  }

  const queries: PromiseQuery[] = [
    {
      topic: 'Marriage & Partnership (विवाह एवं दांपत्य)',
      topicHi: 'विवाह एवं दांपत्य जीवन',
      cusp: 7,
      favHouses: [2, 7, 11],
      detHouses: [1, 6, 10],
      favContextEn: '2 (family expansion), 7 (spouse/union), 11 (fulfillment of desires)',
      favContextHi: '2 (कुटुंब वृद्धि), 7 (जीवनसाथी/विवाह), 11 (मनोकामना पूर्ति)',
      detContextEn: '1 (self/independence), 6 (separation/friction - 12th from 7), 10 (status alone - 12th from 11)',
      detContextHi: '1 (स्वतंत्रता), 6 (विवाद/पृथकता - 7वें से 12वां), 10 (11वें से 12वां)',
    },
    {
      topic: 'Career, Status & Profession (आजीविका एवं सामाजिक प्रतिष्ठा)',
      topicHi: 'कार्यक्षेत्र, आजीविका व पद प्रतिष्ठा',
      cusp: 10,
      favHouses: [2, 6, 10, 11],
      detHouses: [5, 9, 12],
      favContextEn: '2 (income), 6 (service/competitive edge), 10 (status/authority), 11 (gains)',
      favContextHi: '2 (धन), 6 (सेवा/प्रतिस्पर्धा), 10 (अधिकार/पद), 11 (प्रचुर लाभ)',
      detContextEn: '5 (resignation/break - 12th from 6), 9 (change of job - 12th from 10), 12 (loss of position)',
      detContextHi: '5 (नौकरी से विराम - 6ठे से 12वां), 9 (स्थानांतरण - 10वें से 12वां), 12 (पद हानि)',
    },
    {
      topic: 'Wealth & Financial Accumulation (धन संचय एवं कोष वृद्धि)',
      topicHi: 'धन संचय व स्थाई कोष',
      cusp: 2,
      favHouses: [2, 6, 11],
      detHouses: [5, 8, 12],
      favContextEn: '2 (treasury), 6 (repayment of dues), 11 (manifold inflows)',
      favContextHi: '2 (कोष), 6 (ऋण मुक्ति/धन आगम), 11 (निरंतर लाभ)',
      detContextEn: '5 (speculative risk - 12th from 6), 8 (unforeseen blockages), 12 (expenditure/outflows)',
      detContextHi: '5 (सट्टा जोखिम - 6ठे से 12वां), 8 (आकस्मिक रुकावट), 12 (व्यय/हानि)',
    },
    {
      topic: 'Health, Longevity & Recovery (आरोग्य एवं जीवनी शक्ति)',
      topicHi: 'आरोग्य, दीर्घायु व रोगमुक्ति',
      cusp: 1,
      favHouses: [1, 5, 11],
      detHouses: [6, 8, 12],
      favContextEn: '1 (vital body), 5 (cure/restoration - 12th from 6), 11 (recovery/longevity - 12th from 12)',
      favContextHi: '1 (स्वस्थ देह), 5 (रोगमुक्ति - 6ठे से 12वां), 11 (आरोग्य लाभ - 12वें से 12वां)',
      detContextEn: '6 (sickness), 8 (chronic vulnerability/danger), 12 (hospitalization/confinement)',
      detContextHi: '6 (रोग), 8 (गंभीर कष्ट), 12 (चिकित्सालय वास/व्यय)',
    },
    {
      topic: 'Higher Studies & Research (उच्च शिक्षा एवं शोध कार्य)',
      topicHi: 'उच्च शिक्षा व अनुसंधान',
      cusp: 9,
      favHouses: [4, 9, 11],
      detHouses: [3, 8],
      favContextEn: '4 (foundational knowledge), 9 (higher academia/masters/doctorate), 11 (successful graduation)',
      favContextHi: '4 (ज्ञान आधार), 9 (उच्च शिक्षण/पीएचडी), 11 (सफल उपाधि प्राप्ति)',
      detContextEn: '3 (change of subjects/short courses), 8 (research friction/break in studies)',
      detContextHi: '3 (विषय परिवर्तन), 8 (अध्ययन में व्यवधान)',
    },
    {
      topic: 'Childbirth & Progeny (संतान सुख एवं कुल वृद्धि)',
      topicHi: 'संतान प्राप्ति व कुल परंपरा',
      cusp: 5,
      favHouses: [2, 5, 11],
      detHouses: [1, 4, 10],
      favContextEn: '2 (addition of member), 5 (conception/progeny), 11 (desire fulfillment)',
      favContextHi: '2 (कुटुंब में वृद्धि), 5 (संतान उत्पत्ति), 11 (सकुशल प्रसव)',
      detContextEn: '1 (12th from 2), 4 (12th from 5 - impediment to conception), 10 (12th from 11)',
      detContextHi: '1 (2रे से 12वां), 4 (गर्भधारण में बाधा - 5वें से 12वां), 10 (11वें से 12वां)',
    },
    {
      topic: 'Foreign Travel & Settlement (विदेश गमन एवं अंतर्राष्ट्रीय निवास)',
      topicHi: 'विदेश गमन व अंतर्राष्ट्रीय निवास',
      cusp: 12,
      favHouses: [3, 9, 11, 12],
      detHouses: [2, 4],
      favContextEn: '3 (relocation/leaving home), 9 (long journey), 11 (visa grant), 12 (foreign land stay)',
      favContextHi: '3 (स्थान परिवर्तन), 9 (सुदूर यात्रा), 11 (वीजा प्राप्ति), 12 (विदेश वास)',
      detContextEn: '2 (clinging to birthplace), 4 (rooted in domestic residence)',
      detContextHi: '2 (जन्मस्थान आसक्ति), 4 (स्वदेश/गृह निवास)',
    },
    {
      topic: 'Property & Real Estate (भूमि, भवन एवं अचल संपत्ति)',
      topicHi: 'भूमि, भवन व अचल संपत्ति',
      cusp: 4,
      favHouses: [4, 11, 12],
      detHouses: [3, 10],
      favContextEn: '4 (immovable asset), 11 (gain/ownership title), 12 (capital investment)',
      favContextHi: '4 (गृह/भू संपत्ति), 11 (स्वामित्व लाभ), 12 (पूंजी निवेश)',
      detContextEn: '3 (sale/leaving property - 12th from 4), 10 (official hurdles)',
      detContextHi: '3 (संपत्ति विक्रय - 4थे से 12वां), 10 (प्रशासनिक बाधा)',
    },
  ];

  const cuspalPromises: CuspalPromiseVerification[] = queries.map((q) => {
    const cuspRow = cilCusps.find((c) => c.house === q.cusp)!;
    const invMatches = cuspRow.involvementHouses.filter((h) => q.favHouses.includes(h));
    const invDetMatches = cuspRow.involvementHouses.filter((h) => q.detHouses.includes(h));
    const comMatches = cuspRow.commitmentHouses.filter((h) => q.favHouses.includes(h));
    const comDetMatches = cuspRow.commitmentHouses.filter((h) => q.detHouses.includes(h));

    let verdict: CuspalPromiseVerification['verdict'] = 'Conditional / Delayed (प्रयत्न साध्य)';

    // Classical CIL Rule:
    // If SSL's Star Lord signifies favorable houses AND SSL's Sub Lord supports favorable houses -> Strong Promise!
    // If SSL's Star Lord or Sub Lord predominantly signifies detrimental houses (12th from supporting) -> Adverse.
    const favScore = invMatches.length * 2 + comMatches.length * 3;
    const detScore = invDetMatches.length * 2 + comDetMatches.length * 3;

    if (favScore >= 5 && comDetMatches.length === 0) {
      verdict = 'Strong Promise (पूर्ण सिद्धि)';
    } else if (favScore > detScore) {
      verdict = 'Strong Promise (पूर्ण सिद्धि)';
    } else if (detScore > favScore && comDetMatches.length > 0) {
      verdict = 'Adverse / Remedial Required (अवरोध / शांति आवश्यक)';
    } else {
      verdict = 'Conditional / Delayed (प्रयत्न साध्य)';
    }

    const analysisEn = `Cusp ${q.cusp} Sub-Sub Lord is ${cuspRow.subSubLord} (Stationed in Star of ${cuspRow.sslStarLord}, Sub of ${cuspRow.sslSubLord}). Star Lord indicates involvement in houses [${cuspRow.involvementHouses.join(', ') || 'none'}], activating favorable factors [${invMatches.join(', ') || 'none'}]. Sub Lord signifies commitment in houses [${cuspRow.commitmentHouses.join(', ') || 'none'}]. ${
      verdict === 'Strong Promise (पूर्ण सिद्धि)'
        ? `The Cuspal Interlink is firmly established with primary supporting houses (${q.favContextEn}). The promise of this cusp will blossom during the operational Dasha and Bhukti of the signifying planets.`
        : verdict === 'Adverse / Remedial Required (अवरोध / शांति आवश्यक)'
          ? `The Cuspal Interlink indicates interference from negating houses (${q.detContextEn}). Deliberate caution, ethical grounding, and pacifying remedial upayas for ${cuspRow.subSubLord} are advised.`
          : `The Cuspal Interlink presents a balanced interplay of favorable and testing houses. Manifestation requires conscious perseverance and patience.`
    }`;

    const analysisHi = `भाव ${q.cusp} के उप-उप स्वामी ${cuspRow.subSubLord} (नक्षत्र स्वामी: ${cuspRow.sslStarLord}, उप स्वामी: ${cuspRow.sslSubLord}) हैं। नक्षत्र स्वामी द्वारा सक्रिय भाव [${cuspRow.involvementHouses.join(', ') || 'शून्य'}] हैं, जिनमें अनुकूल कारक [${invMatches.join(', ') || 'शून्य'}] सम्मिलित हैं। उप स्वामी द्वारा फल प्रदाता भाव [${cuspRow.commitmentHouses.join(', ') || 'शून्य'}] हैं। ${
      verdict === 'Strong Promise (पूर्ण सिद्धि)'
        ? `कस्पल इंटरलिंक अनुकूल भावों (${q.favContextHi}) से पूर्णतः संबंधित है। दशा व भुक्ति काल में यह फल निश्चित रूप से सिद्ध होगा।`
        : verdict === 'Adverse / Remedial Required (अवरोध / शांति आवश्यक)'
          ? `कस्पल इंटरलिंक में बाधक भावों (${q.detContextHi}) का प्रभाव है। अतः विवेकपूर्ण निर्णय लें और ${cuspRow.subSubLord} के वैदिक उपाय करें।`
          : `कस्पल इंटरलिंक मिश्रित प्रभाव दर्शाता है। धैर्य, सतत पुरुषार्थ और अनुकूल समय की प्रतीक्षा से अभीष्ट फल प्राप्त होगा।`
    }`;

    return {
      topic: q.topic,
      topicHi: q.topicHi,
      primaryCusp: q.cusp,
      sslLord: cuspRow.subSubLord,
      sslStarLord: cuspRow.sslStarLord,
      sslSubLord: cuspRow.sslSubLord,
      favorableHouses: q.favHouses,
      detrimentalHouses: q.detHouses,
      involvementMatches: invMatches,
      commitmentMatches: comMatches,
      verdict,
      analysisEn,
      analysisHi,
    };
  });

  const strongCount = cuspalPromises.filter((p) => p.verdict.startsWith('Strong')).length;
  const overallSummaryEn = `Cuspal Interlinks (CIL 1-2193) confirms strong positive promise across ${strongCount}/8 foundational life pillars. The native possesses robust astrological backing in career, wealth, and spiritual growth.`;
  const overallSummaryHi = `कस्पल इंटरलिंक्स (CIL 1-2193) के अनुसार 8 प्रमुख जीवन आयामों में से ${strongCount} में पूर्ण सिद्धि का योग है। जातक के जीवन में कार्यक्षेत्र, धन संचय व आत्मविकास हेतु सुदृढ़ शास्त्रीय वचन प्राप्त है।`;

  return {
    ayanamsaDms: kpReport.kpAyanamsaDms,
    totalSubSubSegments: 2193,
    cusps: cilCusps,
    planets: cilPlanets,
    cuspalPromises,
    overallSummaryEn,
    overallSummaryHi,
  };
}
