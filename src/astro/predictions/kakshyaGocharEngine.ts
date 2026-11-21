import { KAKSHA_LORDS, type KakshaLord } from '../panchaPakshiAndKaksha';
import { SEVEN_PLANETS, SIGNS } from '../constants';
import { formatDms } from '../time';
import type { ChartData, SevenPlanetId } from '../types';

export interface KakshyaSlotInfo {
  kakshyaNumber: number; // 1 to 8
  lord: KakshaLord;
  startDeg: number;
  endDeg: number;
  rangeDms: string;
  hasBindu: boolean;
  isActiveNow: boolean;
  verdictEn: string;
  verdictHi: string;
}

export interface PlanetKakshyaTransitDetail {
  planet: SevenPlanetId;
  transitSignIndex: number;
  transitSignName: string;
  transitDegreeInSign: number;
  transitDms: string;
  transitHouseFromAsc: number;
  transitHouseFromMoon: number;
  speedDegPerDay: number;
  isRetrograde: boolean;
  currentKakshyaNumber: number; // 1 to 8
  currentKakshyaLord: KakshaLord;
  currentKakshyaSpan: string;
  currentHasBindu: boolean;
  bhinnaBindusInSign: number; // 0 to 8
  sarvaBindusInSign: number; // 0 to 56
  kakshyaSlots: KakshyaSlotInfo[];
  daysRemainingInKakshya: number;
  statusCategory: 'High Favorability' | 'Moderate Support' | 'Obstruction / Sluggish' | 'Vulnerable Delay';
  predictionEn: string;
  predictionHi: string;
}

export interface KakshyaGocharSummary {
  transitDateLocal: string;
  activePlanetsWithBindu: number; // Out of 7
  kakshyaFavorabilityPercent: number; // 0 to 100%
  overallVerdictEn: string;
  overallVerdictHi: string;
  majorSlowMovers: {
    saturn: PlanetKakshyaTransitDetail;
    jupiter: PlanetKakshyaTransitDetail;
    mars: PlanetKakshyaTransitDetail;
  };
  allPlanets: PlanetKakshyaTransitDetail[];
  goldenWindowsEn: string[];
  goldenWindowsHi: string[];
}

const KAKSHYA_SPAN = 3.75; // 3°45' = 30° / 8

function fmtDegMin(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.round((deg - d) * 60);
  return `${String(d).padStart(2, '0')}°${String(m).padStart(2, '0')}'`;
}

export function computeKakshyaGocharReport(
  natalChart: ChartData,
  transitChart: ChartData
): KakshyaGocharSummary {
  const details: PlanetKakshyaTransitDetail[] = [];
  const ascSignIdx = natalChart.ascendant.signIndex;
  const natalMoon = natalChart.planets.find((p) => p.id === 'Moon');
  const moonSignIdx = natalMoon ? natalMoon.signIndex : ascSignIdx;

  let binduCount = 0;

  for (const pId of SEVEN_PLANETS) {
    const tr = transitChart.planets.find((x) => x.id === pId);
    if (!tr) continue;

    const signIdx = tr.signIndex;
    const degInSign = tr.degreeInSign;
    const kIdx = Math.min(7, Math.max(0, Math.floor(degInSign / KAKSHYA_SPAN)));
    const curLord = KAKSHA_LORDS[kIdx];
    const houseFromAsc = ((signIdx - ascSignIdx + 12) % 12) + 1;
    const houseFromMoon = ((signIdx - moonSignIdx + 12) % 12) + 1;

    // Prastarashtakavarga bindu check in natal chart
    const rawBindu = natalChart.ashtakavarga.prastara[pId]?.[curLord]?.[signIdx] ?? 0;
    const curHasBindu = rawBindu > 0;
    if (curHasBindu) binduCount++;

    const bhinnaBindus = natalChart.ashtakavarga.bhinna[pId]?.[signIdx] ?? 0;
    const sarvaBindus = natalChart.ashtakavarga.sarva[signIdx] ?? 0;

    // Build the 8 kakshya slots for this transited sign
    const slots: KakshyaSlotInfo[] = [];
    for (let i = 0; i < 8; i++) {
      const lord = KAKSHA_LORDS[i];
      const sDeg = i * KAKSHYA_SPAN;
      const eDeg = sDeg + KAKSHYA_SPAN;
      const bVal = (natalChart.ashtakavarga.prastara[pId]?.[lord]?.[signIdx] ?? 0) > 0;
      const isActive = i === kIdx;

      slots.push({
        kakshyaNumber: i + 1,
        lord,
        startDeg: sDeg,
        endDeg: eDeg,
        rangeDms: `${fmtDegMin(sDeg)} - ${fmtDegMin(eDeg)}`,
        hasBindu: bVal,
        isActiveNow: isActive,
        verdictEn: bVal ? `Contributes 1 Bindu (Auspicious)` : `0 Bindus (Dormant/Challenging)`,
        verdictHi: bVal ? `1 बिंदु प्रदत्त (शुभ फलदायी)` : `0 बिंदु (अवरोध/सुप्त)`,
      });
    }

    // Estimate days remaining in current kakshya
    const endDegOfCur = (kIdx + 1) * KAKSHYA_SPAN;
    const remainingDeg = Math.max(0.01, endDegOfCur - degInSign);
    const speed = Math.abs(tr.speedDegPerDay) > 0.001 ? Math.abs(tr.speedDegPerDay) : 0.05;
    const daysRemaining = Math.max(1, Math.round(remainingDeg / speed));

    // Status category
    let statusCategory: PlanetKakshyaTransitDetail['statusCategory'] = 'Moderate Support';
    if (curHasBindu && bhinnaBindus >= 5 && sarvaBindus >= 28) {
      statusCategory = 'High Favorability';
    } else if (curHasBindu) {
      statusCategory = 'Moderate Support';
    } else if (bhinnaBindus <= 3 || sarvaBindus < 25) {
      statusCategory = 'Vulnerable Delay';
    } else {
      statusCategory = 'Obstruction / Sluggish';
    }

    // Predictive readings
    let predEn = '';
    let predHi = '';

    if (curHasBindu) {
      predEn = `${pId} transiting ${SIGNS[signIdx].name} (House ${houseFromAsc} from Lagna, House ${houseFromMoon} from Moon) is stationed in the ${curLord} Kakshya (${fmtDegMin(kIdx * KAKSHYA_SPAN)} - ${fmtDegMin((kIdx + 1) * KAKSHYA_SPAN)}). With 1 full Prastara Bindu and BAV ${bhinnaBindus}/8, this ~${daysRemaining}-day window releases productive momentum, clears prior hurdles, and manifests tangible progress in House ${houseFromAsc} matters.`;
      predHi = `${pId} का गोचर ${SIGNS[signIdx].name} (लग्न से ${houseFromAsc}वां भाव, चंद्र से ${houseFromMoon}वां) में ${curLord} की कक्ष्य (${fmtDegMin(kIdx * KAKSHYA_SPAN)} - ${fmtDegMin((kIdx + 1) * KAKSHYA_SPAN)}) में है। प्रस्ताराष्टकवर्ग में 1 बिंदु तथा भिन्नाष्टक ${bhinnaBindus}/8 होने से यह आगामी ~${daysRemaining} दिन का समय अत्यंत शुभ व फलदायी है, जो पूर्व की रुकावटों को समाप्त कर सकारात्मक परिणाम देगा।`;
    } else {
      predEn = `${pId} transiting ${SIGNS[signIdx].name} (House ${houseFromAsc} from Lagna) passes through the ${curLord} Kakshya with 0 Bindus (BAV ${bhinnaBindus}/8, SAV ${sarvaBindus}). For the next ~${daysRemaining} days, expected results may encounter temporary inertia or bureaucratic drag. Maintain steady patience, avoid rash speculations, and verify documentation carefully.`;
      predHi = `${pId} का गोचर ${SIGNS[signIdx].name} में ${curLord} की कक्ष्य से शून्य (0) बिंदु पर गुजर रहा है (भिन्नाष्टक ${bhinnaBindus}/8, सर्वाष्टक ${sarvaBindus})। आगामी ~${daysRemaining} दिनों तक कार्यों में मंद गति या अवरोध संभव है; अतः जल्दबाजी में निर्णय न लें और धैर्यपूर्वक आवश्यक दस्तावेजों का सत्यापन रखें।`;
    }

    details.push({
      planet: pId,
      transitSignIndex: signIdx,
      transitSignName: SIGNS[signIdx].name,
      transitDegreeInSign: Math.round(degInSign * 100) / 100,
      transitDms: formatDms(degInSign),
      transitHouseFromAsc: houseFromAsc,
      transitHouseFromMoon: houseFromMoon,
      speedDegPerDay: Math.round(tr.speedDegPerDay * 1000) / 1000,
      isRetrograde: tr.isRetrograde,
      currentKakshyaNumber: kIdx + 1,
      currentKakshyaLord: curLord,
      currentKakshyaSpan: `${fmtDegMin(kIdx * KAKSHYA_SPAN)} - ${fmtDegMin((kIdx + 1) * KAKSHYA_SPAN)}`,
      currentHasBindu: curHasBindu,
      bhinnaBindusInSign: bhinnaBindus,
      sarvaBindusInSign: sarvaBindus,
      kakshyaSlots: slots,
      daysRemainingInKakshya: daysRemaining,
      statusCategory,
      predictionEn: predEn,
      predictionHi: predHi,
    });
  }

  const favorabilityPct = Math.round((binduCount / 7) * 100);

  let overallEn = '';
  let overallHi = '';

  if (favorabilityPct >= 70) {
    overallEn = `Exceptional Kakshya Alignment (${binduCount}/7 planets endowed with Bindus, ${favorabilityPct}%). Peak transit window for inaugurating vital projects, major acquisitions, and strategic career moves.`;
    overallHi = `उत्कृष्ट कक्ष्य गोचर समन्वय (${binduCount}/7 ग्रह बिंदु युक्त, ${favorabilityPct}%)। नए प्रकल्पों, वित्तीय निवेश व महत्वपूर्ण निर्णयों हेतु स्वर्णिम काल।`;
  } else if (favorabilityPct >= 40) {
    overallEn = `Balanced Kakshya Harmony (${binduCount}/7 planets with Bindus, ${favorabilityPct}%). Progress is steady; focus energy on houses where transiting lords hold active bindus.`;
    overallHi = `संतुलित कक्ष्य गोचर स्थिति (${binduCount}/7 ग्रह बिंदु युक्त, ${favorabilityPct}%)। प्रगति निरंतर रहेगी; जिन भावों में बिंदु प्राप्त हैं वहां कार्य प्राथमिकता से करें।`;
  } else {
    overallEn = `Consolidation Phase (${binduCount}/7 planets with Bindus, ${favorabilityPct}%). Transiting planets operate in low-bindu kakshyas; ideal for reflective planning, debt consolidation, and spiritual remedies rather than aggressive expansion.`;
    overallHi = `संयम व नियोजन काल (${binduCount}/7 ग्रह बिंदु युक्त, ${favorabilityPct}%)। ग्रह न्यून बिंदु कक्ष्य में हैं; अतः आक्रामक विस्तार के स्थान पर पूर्व नियोजित कार्यों को व्यवस्थित करें व जप-तप करें।`;
  }

  const saturnDetail = details.find((d) => d.planet === 'Saturn')!;
  const jupiterDetail = details.find((d) => d.planet === 'Jupiter')!;
  const marsDetail = details.find((d) => d.planet === 'Mars')!;

  const goldenEn: string[] = [];
  const goldenHi: string[] = [];

  for (const d of details) {
    if (d.currentHasBindu && d.sarvaBindusInSign >= 28) {
      goldenEn.push(`${d.planet} in ${d.currentKakshyaLord} Kakshya (House ${d.transitHouseFromAsc}): ${d.daysRemainingInKakshya} days remaining of peak fruition.`);
      goldenHi.push(`${d.planet} ${d.currentKakshyaLord} की कक्ष्य में (भाव ${d.transitHouseFromAsc}): आगामी ${d.daysRemainingInKakshya} दिन विशेष लाभकारी व फलदायी।`);
    }
  }

  return {
    transitDateLocal: transitChart.input.date,
    activePlanetsWithBindu: binduCount,
    kakshyaFavorabilityPercent: favorabilityPct,
    overallVerdictEn: overallEn,
    overallVerdictHi: overallHi,
    majorSlowMovers: {
      saturn: saturnDetail,
      jupiter: jupiterDetail,
      mars: marsDetail,
    },
    allPlanets: details,
    goldenWindowsEn: goldenEn,
    goldenWindowsHi: goldenHi,
  };
}
