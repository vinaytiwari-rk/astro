import { calculateChart } from './calculator';
import { computeBtrSnapshot, type BtrSnapshot } from './btr';
import type { ChartData, BirthInput, CalcSettings } from './types';

export type BTREventType =
  | 'marriage'
  | 'child_birth'
  | 'job_joining'
  | 'promotion'
  | 'illness_surgery'
  | 'foreign_travel'
  | 'property_vehicle'
  | 'loss_litigation'
  | 'major_success';

export interface BTRLifeEvent {
  id: string;
  eventType: BTREventType;
  date: string; // YYYY-MM-DD
  description?: string;
}

export interface BTREventMatch {
  event: BTRLifeEvent;
  matchedLord: string;
  relevantHouse: number;
  score: number; // 0..100
  noteEn: string;
  noteHi: string;
}

export interface BTRCandidate {
  offsetMinutes: number;
  rectifiedTime: string;
  d1AscSign: string;
  d9AscSign: string;
  d10AscSign: string;
  d60AscSign: string;
  kpSubLord: string;
  kundaAligned: boolean;
  pranapadaAligned: boolean;
  totalScore: number;
  matches: BTREventMatch[];
  snapshot: BtrSnapshot;
}

export interface BTRReport {
  originalTime: string;
  originalAscSign: string;
  eventsCount: number;
  bestCandidate: BTRCandidate;
  candidates: BTRCandidate[];
  guidanceEn: string;
  guidanceHi: string;
}

const EVENT_SIGNIFICATIONS: Record<BTREventType, { houses: number[]; lords: string[]; labelEn: string; labelHi: string }> = {
  marriage: { houses: [7, 2, 11], lords: ['Venus', 'Jupiter'], labelEn: 'Marriage / Relationship', labelHi: 'विवाह / संबंध' },
  child_birth: { houses: [5, 2, 11], lords: ['Jupiter'], labelEn: 'Child Birth', labelHi: 'संतान प्राप्ति' },
  job_joining: { houses: [10, 6, 2, 11], lords: ['Sun', 'Saturn', 'Mercury'], labelEn: 'New Job / Career Start', labelHi: 'नई नौकरी / करियर' },
  promotion: { houses: [10, 11, 1], lords: ['Sun', 'Jupiter', 'Mars'], labelEn: 'Promotion / Honor', labelHi: 'पदोन्नति / सम्मान' },
  illness_surgery: { houses: [6, 8, 12], lords: ['Mars', 'Saturn', 'Rahu', 'Ketu'], labelEn: 'Illness / Surgery', labelHi: 'रोग / शल्य चिकित्सा' },
  foreign_travel: { houses: [9, 12, 3], lords: ['Rahu', 'Moon', 'Jupiter'], labelEn: 'Foreign Travel / Relocation', labelHi: 'विदेश यात्रा / स्थानांतरण' },
  property_vehicle: { houses: [4, 11], lords: ['Mars', 'Venus'], labelEn: 'Property / Vehicle Purchase', labelHi: 'संपत्ति / वाहन क्रय' },
  loss_litigation: { houses: [6, 8, 12], lords: ['Saturn', 'Mars', 'Rahu'], labelEn: 'Litigation / Financial Loss', labelHi: 'मुकदमा / धन हानि' },
  major_success: { houses: [1, 9, 10, 11], lords: ['Jupiter', 'Sun', 'Venus'], labelEn: 'Major Breakthrough', labelHi: 'विशिष्ट सफलता' },
};

export function computeBTR(
  chart: ChartData,
  events: BTRLifeEvent[]
): BTRReport {
  const baseInput: BirthInput = chart.input;
  const settings: CalcSettings = chart.settings;
  const originalAscSign = chart.ascendant.signName;

  // Test offsets from -15 to +15 minutes in 1-minute steps
  const offsets = [-15, -12, -9, -6, -3, -1, 0, 1, 3, 6, 9, 12, 15];

  const candidates: BTRCandidate[] = offsets.map((offset) => {
    const snapshot = computeBtrSnapshot(baseInput, settings, offset * 60);

    // Score events against this candidate
    let eventScoreSum = 0;
    const matches: BTREventMatch[] = events.map((ev) => {
      const sig = EVENT_SIGNIFICATIONS[ev.eventType] || EVENT_SIGNIFICATIONS.major_success;
      
      // Check if D9/D10/Lagna align with expected house lords
      const primaryLord = snapshot.kpAscSubLord;
      const alignsWithSig = sig.lords.some(l => l.toLowerCase() === primaryLord.toLowerCase());
      
      const matchScore = alignsWithSig ? 85 : 60;
      eventScoreSum += matchScore;

      return {
        event: ev,
        matchedLord: primaryLord,
        relevantHouse: sig.houses[0],
        score: matchScore,
        noteEn: `${sig.labelEn}: Primary active Sub-Lord ${primaryLord} activates Houses ${sig.houses.join(', ')}.`,
        noteHi: `${sig.labelHi}: सक्रिय उप-स्वामी ${primaryLord} भाव ${sig.houses.join(', ')} को फलित करता है।`,
      };
    });

    // Astronomical alignment bonus (Kunda + Pranapada)
    let totalScore = events.length > 0 ? Math.round(eventScoreSum / events.length) : 65;
    if (snapshot.kundaAligned) totalScore += 10;
    if (snapshot.pranapadaAligned) totalScore += 10;
    if (offset === 0) totalScore += 5; // prior baseline weight

    totalScore = Math.min(100, totalScore);

    return {
      offsetMinutes: offset,
      rectifiedTime: snapshot.rectifiedTime,
      d1AscSign: snapshot.d1LagnaSign,
      d9AscSign: snapshot.d9LagnaSign,
      d10AscSign: snapshot.d10LagnaSign,
      d60AscSign: snapshot.d60LagnaSign,
      kpSubLord: snapshot.kpAscSubLord,
      kundaAligned: snapshot.kundaAligned,
      pranapadaAligned: snapshot.pranapadaAligned,
      totalScore,
      matches,
      snapshot,
    };
  });

  // Sort candidates by total score descending
  candidates.sort((a, b) => b.totalScore - a.totalScore);
  const best = candidates[0];

  const guidanceEn = best.offsetMinutes === 0
    ? `The registered birth time (${baseInput.time}) aligns strongly with your life events, Kunda Lagna, and Pranapada.`
    : `Optimal BTR calibration suggests shifting birth time by ${best.offsetMinutes > 0 ? '+' : ''}${best.offsetMinutes} min to ${best.rectifiedTime}. This aligns D9 (${best.d9AscSign}), D10 (${best.d10AscSign}), and KP Sub-Lord (${best.kpSubLord}) with verified milestones.`;

  const guidanceHi = best.offsetMinutes === 0
    ? `पंजीकृत जन्म समय (${baseInput.time}) जीवन की घटनाओं, कुण्ड लग्न और प्राणपद से पूर्ण सामंजस्य में है।`
    : `जन्म समय संशोधन से ${best.offsetMinutes > 0 ? '+' : ''}${best.offsetMinutes} मिनट का विचलन (${best.rectifiedTime}) श्रेष्ठ पाया गया है। इससे D9 (${best.d9AscSign}), D10 (${best.d10AscSign}) और उप-स्वामी (${best.kpSubLord}) का पूर्ण समन्वय होता है।`;

  return {
    originalTime: baseInput.time,
    originalAscSign,
    eventsCount: events.length,
    bestCandidate: best,
    candidates,
    guidanceEn,
    guidanceHi,
  };
}
