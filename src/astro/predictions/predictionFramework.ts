import type { ChartData, DashaPeriod, NineGrahaId, SevenPlanetId } from '../types';
import { SIGNS } from '../constants';

export type PredictionDomainId =
  | 'career' | 'marriage' | 'wealth' | 'education'
  | 'children' | 'property' | 'litigation' | 'foreign';

export type EvidenceTone = 'supportive' | 'mixed' | 'strained' | 'insufficient';

export interface PredictionDomainEvidence {
  id: PredictionDomainId;
  titleHi: string;
  titleEn: string;
  primaryHouses: number[];
  karakas: string[];
  houseFindings: Array<{
    house: number;
    sign: string;
    lord: string;
    lordHouse: number;
    lordDignity: string;
    occupants: string[];
    savBindus: number | null;
    aspects: string[];
    tone: EvidenceTone;
  }>;
  divisionalFinding: string;
  activePeriods: Array<{ lord: string; level: number; startMs: number; endMs: number }>;
  tone: EvidenceTone;
  summaryHi: string;
  summaryEn: string;
  timingHi: string;
  timingEn: string;
  limitationsHi: string;
  limitationsEn: string;
}

const DOMAIN_CONFIG: Record<PredictionDomainId, {
  titleHi: string; titleEn: string; houses: number[]; karakas: string[];
  varga: 'D9' | 'D10' | 'D7' | 'D4' | 'D24' | null;
}> = {
  career: { titleHi: 'नौकरी और करियर', titleEn: 'Career', houses: [10, 6, 2, 11], karakas: ['Sun', 'Saturn', 'Mercury', 'Jupiter'], varga: 'D10' },
  marriage: { titleHi: 'विवाह और संबंध', titleEn: 'Marriage and relationships', houses: [7, 2, 5, 8], karakas: ['Venus', 'Jupiter'], varga: 'D9' },
  wealth: { titleHi: 'धन और आय', titleEn: 'Wealth and income', houses: [2, 11, 5, 9], karakas: ['Jupiter', 'Venus', 'Mercury'], varga: null },
  education: { titleHi: 'शिक्षा और अध्ययन', titleEn: 'Education', houses: [4, 5, 9], karakas: ['Mercury', 'Jupiter'], varga: 'D24' },
  children: { titleHi: 'संतान', titleEn: 'Children', houses: [5, 9, 2], karakas: ['Jupiter'], varga: 'D7' },
  property: { titleHi: 'मकान और संपत्ति', titleEn: 'Property', houses: [4, 2, 11], karakas: ['Mars', 'Moon', 'Venus'], varga: 'D4' },
  litigation: { titleHi: 'विवाद और मुकदमे', titleEn: 'Disputes and litigation', houses: [6, 7, 8, 12], karakas: ['Mars', 'Saturn'], varga: null },
  foreign: { titleHi: 'विदेश यात्रा और निवास', titleEn: 'Foreign travel and residence', houses: [9, 12, 7, 4], karakas: ['Rahu', 'Saturn', 'Moon'], varga: null },
};

const NATURAL_BENEFICS = new Set(['Jupiter', 'Venus', 'Mercury', 'Moon']);
const NATURAL_MALEFICS = new Set(['Saturn', 'Mars', 'Sun']);

function dignityValue(dignity: string): number {
  if (['Exalted', 'Moolatrikona', 'Own Sign'].includes(dignity)) return 2;
  if (['Great Friend', 'Friend'].includes(dignity)) return 1;
  if (['Enemy', 'Great Enemy', 'Debilitated'].includes(dignity)) return -2;
  return 0;
}

function aspectsHouse(chart: ChartData, targetHouse: number): string[] {
  const ascSign = chart.ascendant.signIndex;
  const results: string[] = [];
  for (const planet of chart.planets) {
    if (planet.id === 'Asc') continue;
    const fromHouse = ((planet.signIndex - ascSign + 12) % 12) + 1;
    const offsets = planet.id === 'Mars' ? [3, 6, 7]
      : planet.id === 'Jupiter' ? [4, 6, 8]
      : planet.id === 'Saturn' ? [2, 6, 9]
      : [6];
    if (offsets.some((offset) => ((fromHouse - 1 + offset) % 12) + 1 === targetHouse)) {
      results.push(String(planet.id));
    }
  }
  return results;
}

function toneFromBalance(balance: number, evidenceCount: number): EvidenceTone {
  if (evidenceCount < 2) return 'insufficient';
  if (balance >= 2) return 'supportive';
  if (balance <= -2) return 'strained';
  return 'mixed';
}

function flattenDasha(periods: DashaPeriod[] = []): DashaPeriod[] {
  const result: DashaPeriod[] = [];
  const visit = (items: DashaPeriod[]) => {
    for (const item of items) {
      result.push(item);
      if (item.children?.length) visit(item.children);
    }
  };
  visit(periods);
  return result;
}

function periodLabel(level: number, hi: boolean): string {
  if (level === 1) return hi ? 'महादशा' : 'Mahadasha';
  if (level === 2) return hi ? 'अंतर्दशा' : 'Antardasha';
  if (level === 3) return hi ? 'प्रत्यंतर दशा' : 'Pratyantardasha';
  return hi ? 'उप-दशा' : 'sub-period';
}

/**
 * Central domain-evidence layer. It deliberately reports chart evidence rather
 * than event probabilities. It does not calculate transits; callers must not
 * describe these natal/dasha findings as a transit-confirmed event forecast.
 */
export function computePredictionFramework(chart: ChartData, atMs = Date.now()): PredictionDomainEvidence[] {
  const ascSign = chart.ascendant.signIndex;
  const periods = flattenDasha(chart.vimshottari ?? []);
  return (Object.keys(DOMAIN_CONFIG) as PredictionDomainId[]).map((id) => {
    const config = DOMAIN_CONFIG[id];
    let totalBalance = 0;
    let totalEvidence = 0;
    const houseFindings = config.houses.map((house) => {
      const signIndex = (ascSign + house - 1) % 12;
      const sign = SIGNS[signIndex];
      const lord = chart.planets.find((p) => p.id === sign.lord);
      const occupants = chart.planets.filter((p) => p.id !== 'Asc' && p.rasiHouseNumber === house);
      const aspects = aspectsHouse(chart, house);
      const savBindus = chart.ashtakavarga?.sarva?.[signIndex] ?? null;
      let balance = lord ? dignityValue(lord.dignity) : 0;
      if (savBindus !== null) balance += savBindus >= 30 ? 1 : savBindus <= 24 ? -1 : 0;
      balance += occupants.reduce((sum, p) => sum + (NATURAL_BENEFICS.has(p.id) ? 1 : NATURAL_MALEFICS.has(p.id) ? -1 : 0), 0);
      balance += aspects.reduce((sum, p) => sum + (NATURAL_BENEFICS.has(p as NineGrahaId) ? 1 : NATURAL_MALEFICS.has(p as NineGrahaId) ? -1 : 0), 0);
      const evidenceCount = (lord ? 1 : 0) + (savBindus !== null ? 1 : 0) + (occupants.length ? 1 : 0) + (aspects.length ? 1 : 0);
      totalBalance += balance;
      totalEvidence += evidenceCount;
      return {
        house, sign: sign.name, lord: String(sign.lord),
        lordHouse: lord?.rasiHouseNumber ?? 0,
        lordDignity: lord?.dignity ?? 'Unavailable',
        occupants: occupants.map((p) => String(p.id)),
        savBindus, aspects, tone: toneFromBalance(balance, evidenceCount),
      };
    });
    const relevantLords = new Set<string>([
      ...config.houses.map((house) => String(SIGNS[(ascSign + house - 1) % 12].lord)),
      ...config.karakas,
    ]);
    const activePeriods = periods
      .filter((p) => relevantLords.has(p.lord) && p.startMs <= atMs && atMs < p.endMs)
      .sort((a, b) => b.level - a.level)
      .map((p) => ({ lord: p.lord, level: p.level, startMs: p.startMs, endMs: p.endMs }));
    const nextPeriod = periods
      .filter((p) => relevantLords.has(p.lord) && p.startMs > atMs)
      .sort((a, b) => a.startMs - b.startMs || b.level - a.level)[0];
    const tone = toneFromBalance(totalBalance, totalEvidence);
    const varga = config.varga ? chart.divisionalCharts?.[config.varga] : undefined;
    const vargaPlacements = varga?.placements.filter((p) =>
      config.karakas.includes(p.id) || relevantLords.has(p.id),
    ) ?? [];
    const vargaFinding = varga
      ? `${config.varga} लग्न ${SIGNS[varga.lagnaSignIndex]?.name ?? 'उपलब्ध'}; संबंधित ग्रह: ${vargaPlacements.length
        ? vargaPlacements.map((p) => `${p.id} वर्ग लग्न से ${p.houseFromVargaLagna}वें भाव में`).join(', ')
        : 'निर्धारित कारक ग्रहों की स्थिति उपलब्ध नहीं'}।`
      : 'इस विषय के लिए इस चरण में अलग वर्ग-कुंडली पुष्टिकरण शामिल नहीं है।';
    const toneHi = tone === 'supportive' ? 'सहयोगी संकेत अपेक्षाकृत अधिक' : tone === 'strained' ? 'चुनौतीपूर्ण संकेत अपेक्षाकृत अधिक' : tone === 'mixed' ? 'मिले-जुले संकेत' : 'पर्याप्त संकेत उपलब्ध नहीं';
    const toneEn = tone === 'supportive' ? 'relatively more supportive indications' : tone === 'strained' ? 'relatively more challenging indications' : tone === 'mixed' ? 'mixed indications' : 'insufficient evidence';
    const timingHi = activePeriods.length
      ? activePeriods.map((p) => `${p.lord} की ${periodLabel(p.level, true)} ${new Date(p.endMs).toLocaleDateString('hi-IN')} तक सक्रिय है`).join('; ') + '। यह पारंपरिक सक्रियता-संकेत है, घटना की गारंटी नहीं।'
      : nextPeriod
        ? `अगली संबंधित अवधि ${nextPeriod.lord} की ${periodLabel(nextPeriod.level, true)} ${new Date(nextPeriod.startMs).toLocaleDateString('hi-IN')} से शुरू होती है। यह संभावित सक्रियता-संकेत है, निश्चित घटना का समय नहीं।`
        : 'उपलब्ध दशा डेटा में निकट अवधि का स्पष्ट संबंध नहीं मिला; इसलिए समय-सीमा नहीं दी जा रही है।';
    const timingEn = activePeriods.length
      ? activePeriods.map((p) => `${p.lord} ${periodLabel(p.level, false)} is active until ${new Date(p.endMs).toLocaleDateString('en-IN')}`).join('; ') + '. This is a traditional activation indicator, not a guaranteed event.'
      : nextPeriod
        ? `The next related period is ${nextPeriod.lord} ${periodLabel(nextPeriod.level, false)}, beginning ${new Date(nextPeriod.startMs).toLocaleDateString('en-IN')}. This is an activation indicator, not a promised event date.`
        : 'The available dasha data does not show a clear near-term link, so no timing window is stated.';
    return {
      id, titleHi: config.titleHi, titleEn: config.titleEn,
      primaryHouses: config.houses, karakas: config.karakas,
      houseFindings, divisionalFinding: vargaFinding, activePeriods, tone,
      summaryHi: `${config.titleHi} के लिए ${toneHi} मिले। निष्कर्ष में संबंधित भावों के स्वामी, ग्रह-स्थिति, दृष्टि और उपलब्ध सर्वाष्टकवर्ग संकेत शामिल हैं।`,
      summaryEn: `${toneEn} appear for ${config.titleEn}, based on relevant house lords, placements, aspects and available Sarvashtakavarga indicators.`,
      timingHi, timingEn,
      limitationsHi: 'यह जन्मकुंडली और उपलब्ध विंशोत्तरी दशा पर आधारित पारंपरिक संकेत-पठन है। गोचर इस गणना में शामिल नहीं है; इसे निश्चित घटना, प्रतिशत संभावना या पेशेवर सलाह न मानें।',
      limitationsEn: 'This is a traditional reading of natal placements and available Vimshottari periods. Transits are not included; this is not a guaranteed event, statistical probability or professional advice.',
    };
  });
}
