import type { ChartData, DashaPeriod, DivisionalChartId, NineGrahaId } from '../types';
import { SIGNS } from '../constants';

export interface DeepDomainPrediction {
  id: string; titleEn: string; titleHi: string; icon: string;
  /** Internal evidence-balance index, not a probability or event likelihood. */
  score: number;
  ratingEn: 'Excellent' | 'Very Good' | 'Moderate' | 'Challenging';
  ratingHi: 'अति उत्तम' | 'उत्तम' | 'मध्यम' | 'चुनौतीपूर्ण';
  summaryEn: string; summaryHi: string;
  keyStrengthsEn: string[]; keyStrengthsHi: string[];
  watchoutsEn: string[]; watchoutsHi: string[];
  astrologicalFactorsEn: string; astrologicalFactorsHi: string;
  timingEn: string; timingHi: string;
  classicalAdviceEn: string; classicalAdviceHi: string;
}
export interface DeepLifePredictionsReport {
  /** Retained for compatibility; never presented as a statistical score. */
  overallLifeScore: number;
  executiveSummaryEn: string; executiveSummaryHi: string;
  domains: DeepDomainPrediction[];
}
type DomainConfig = {
  id: string; titleEn: string; titleHi: string; icon: string;
  houses: number[]; karakas: NineGrahaId[]; varga: DivisionalChartId;
  adviceEn: string; adviceHi: string;
};
const DOMAINS: DomainConfig[] = [
  { id: 'personality', titleEn: 'Personality, Vitality & Mind', titleHi: 'व्यक्तित्व, आत्मबल एवं मन', icon: 'user', houses: [1, 5, 9], karakas: ['Sun', 'Moon'], varga: 'D9', adviceEn: 'Build on supportive traits while maintaining steady routines. Treat difficult indications as areas for awareness, not fixed outcomes.', adviceHi: 'अनुकूल संकेतों का सदुपयोग करें और नियमित दिनचर्या बनाए रखें। चुनौतीपूर्ण संकेतों को निश्चित परिणाम नहीं, सावधानी के विषय मानें।' },
  { id: 'wealth', titleEn: 'Wealth, Savings & Resources', titleHi: 'धन, बचत एवं संसाधन', icon: 'coins', houses: [2, 11, 5, 9], karakas: ['Jupiter', 'Venus', 'Mercury'], varga: 'D2', adviceEn: 'Use budgeting, documented transactions and diversified, risk-aware financial decisions; astrology cannot establish investment returns.', adviceHi: 'बजट, लिखित अभिलेख और जोखिम-संतुलित वित्तीय निर्णय अपनाएं; ज्योतिष निवेश के लाभ की गारंटी नहीं देता।' },
  { id: 'career', titleEn: 'Career, Work & Public Role', titleHi: 'करियर, कार्य एवं सामाजिक भूमिका', icon: 'briefcase', houses: [10, 6, 2, 11], karakas: ['Sun', 'Saturn', 'Mercury', 'Jupiter'], varga: 'D10', adviceEn: 'Translate strengths into skills, reliable delivery and professional relationships; verify career decisions against real-world conditions.', adviceHi: 'अनुकूल संकेतों को कौशल, भरोसेमंद कार्य-निष्पादन और अच्छे पेशेवर संबंधों में बदलें; करियर निर्णय वास्तविक परिस्थितियों के आधार पर लें।' },
  { id: 'marriage', titleEn: 'Marriage & Relationships', titleHi: 'विवाह एवं संबंध', icon: 'heart', houses: [7, 2, 5, 8], karakas: ['Venus', 'Jupiter'], varga: 'D9', adviceEn: 'Prioritize mutual respect, communication and compatibility. A chart cannot determine a person’s character or guarantee marriage timing.', adviceHi: 'आपसी सम्मान, संवाद और अनुकूलता को प्राथमिकता दें। कुंडली किसी व्यक्ति का चरित्र तय नहीं करती और विवाह का निश्चित समय नहीं बताती।' },
  { id: 'health', titleEn: 'Health, Habits & Resilience', titleHi: 'स्वास्थ्य, आदतें एवं सहनशक्ति', icon: 'shield', houses: [1, 6, 8, 12], karakas: ['Sun', 'Moon', 'Saturn'], varga: 'D30', adviceEn: 'Use this section only for traditional reflection on habits and resilience. It is not a diagnosis; consult a qualified clinician about symptoms or treatment.', adviceHi: 'इस भाग को केवल पारंपरिक जीवनशैली-चिंतन के रूप में लें। यह चिकित्सकीय निदान नहीं है; लक्षण या उपचार के लिए योग्य चिकित्सक से सलाह लें।' },
  { id: 'spirituality', titleEn: 'Dharma, Learning & Spirituality', titleHi: 'धर्म, अध्ययन एवं आध्यात्म', icon: 'sparkles', houses: [9, 12, 5, 8], karakas: ['Jupiter', 'Ketu'], varga: 'D20', adviceEn: 'Develop a consistent study or contemplative practice that fits your beliefs and circumstances; no spiritual outcome is guaranteed by a placement.', adviceHi: 'अपनी मान्यताओं और परिस्थितियों के अनुरूप अध्ययन या साधना की नियमितता विकसित करें; कोई ग्रह-स्थिति आध्यात्मिक उपलब्धि की गारंटी नहीं देती।' },
];
const BENEFICS = new Set<string>(['Jupiter', 'Venus', 'Mercury']);
const MALEFICS = new Set<string>(['Saturn', 'Mars', 'Sun', 'Rahu', 'Ketu']);
function dignityPoints(d: string): number {
  if (['Exalted', 'Moolatrikona', 'Own Sign'].includes(d)) return 2;
  if (['Great Friend', 'Friend'].includes(d)) return 1;
  if (['Enemy', 'Great Enemy', 'Debilitated'].includes(d)) return -2;
  return 0;
}
function flattenDasha(periods: DashaPeriod[] = []): DashaPeriod[] {
  const all: DashaPeriod[] = [];
  const visit = (items: DashaPeriod[]) => items.forEach((p) => { all.push(p); if (p.children?.length) visit(p.children); });
  visit(periods);
  return all;
}
function houseSignIndex(chart: ChartData, house: number): number { return (chart.ascendant.signIndex + house - 1) % 12; }
function planetHouse(chart: ChartData, p: { signIndex: number }): number { return ((p.signIndex - chart.ascendant.signIndex + 12) % 12) + 1; }
function aspectsHouse(chart: ChartData, target: number): string[] {
  const found: string[] = [];
  for (const p of chart.planets) {
    if (p.id === 'Asc') continue;
    const from = planetHouse(chart, p);
    const offsets = p.id === 'Mars' ? [3, 6, 7] : p.id === 'Jupiter' ? [4, 6, 8] : p.id === 'Saturn' ? [2, 6, 9] : [6];
    if (offsets.some((n) => ((from - 1 + n) % 12) + 1 === target)) found.push(String(p.id));
  }
  return [...new Set(found)];
}
function dateLabel(ms: number, hi: boolean): string {
  return new Date(ms).toLocaleDateString(hi ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function buildDomain(chart: ChartData, config: DomainConfig, atMs: number): DeepDomainPrediction {
  const strengthsEn: string[] = [], strengthsHi: string[] = [], watchoutsEn: string[] = [], watchoutsHi: string[] = [];
  const houseEn: string[] = [], houseHi: string[] = [], yogaEvidence: string[] = [];
  const related = new Set<string>();
  let balance = 0, count = 0;
  for (const house of config.houses) {
    const signIndex = houseSignIndex(chart, house), sign = SIGNS[signIndex];
    const lord = chart.planets.find((p) => p.id === sign.lord);
    const occupants = chart.planets.filter((p) => p.id !== 'Asc' && p.rasiHouseNumber === house);
    const aspects = aspectsHouse(chart, house), sav = chart.ashtakavarga?.sarva?.[signIndex];
    const en: string[] = [], hi: string[] = [];
    let local = 0;
    related.add(String(sign.lord));
    if (lord) {
      const d = dignityPoints(lord.dignity); local += d; count++;
      en.push('lord ' + lord.id + ' in H' + lord.rasiHouseNumber + ' (' + lord.signName + ', ' + lord.dignity + ')');
      hi.push('भावेश ' + lord.id + ' भाव ' + lord.rasiHouseNumber + ' में ' + lord.signName + ' राशि में (' + lord.dignity + ')');
      if (d > 0) { strengthsEn.push(house + 'th-house lord ' + lord.id + ' has ' + lord.dignity + ' dignity.'); strengthsHi.push(house + 'वें भावेश ' + lord.id + ' की ' + lord.dignity + ' गरिमा सहायक संकेत है।'); }
      if (d < 0) { watchoutsEn.push(house + 'th-house lord ' + lord.id + ' has ' + lord.dignity + ' dignity; weigh this with strength and aspects.'); watchoutsHi.push(house + 'वें भावेश ' + lord.id + ' की ' + lord.dignity + ' स्थिति को ग्रहबल और दृष्टियों के साथ तौलें।'); }
      const sb = chart.shadbala?.find((row) => row.planet === lord.id);
      if (sb) {
        local += sb.ratio >= 1.2 ? 1 : sb.ratio < 0.8 ? -1 : 0;
        en.push('Shadbala ' + sb.ratio.toFixed(2) + '×'); hi.push('षड्बल ' + sb.ratio.toFixed(2) + '×');
        if (sb.ratio >= 1.2) { strengthsEn.push(lord.id + ' has above-threshold Shadbala (' + sb.ratio.toFixed(2) + '×).'); strengthsHi.push(lord.id + ' का षड्बल अपेक्षाकृत मजबूत (' + sb.ratio.toFixed(2) + '×) है।'); }
        if (sb.ratio < 0.8) { watchoutsEn.push(lord.id + ' has lower Shadbala (' + sb.ratio.toFixed(2) + '×); sustained effort may be needed.'); watchoutsHi.push(lord.id + ' का षड्बल कम (' + sb.ratio.toFixed(2) + '×) है; निरंतर प्रयास आवश्यक हो सकता है।'); }
      }
      if ([1, 4, 5, 7, 9, 10].includes(lord.rasiHouseNumber)) local += 1;
      if ([6, 8, 12].includes(lord.rasiHouseNumber)) local -= 1;
      if (lord.isCombust) { local -= 1; watchoutsEn.push(lord.id + ', the ' + house + 'th lord, is combust.'); watchoutsHi.push(house + 'वें भावेश ' + lord.id + ' अस्त हैं; इसे अन्य बल-सूचकों के साथ तौलें।'); }
      if (lord.isRetrograde && lord.id !== 'Rahu' && lord.id !== 'Ketu') { en.push('retrograde'); hi.push('वक्री'); }
    } else { en.push('lord ' + sign.lord + ' unavailable'); hi.push('भावेश ' + sign.lord + ' का डेटा उपलब्ध नहीं'); }
    if (sav !== undefined) {
      local += sav >= 30 ? 1 : sav <= 24 ? -1 : 0; count++;
      en.push('SAV ' + sav + ' bindus'); hi.push('सर्वाष्टकवर्ग ' + sav + ' बिंदु');
      if (sav >= 30) { strengthsEn.push(house + 'th-house sign has ' + sav + ' Sarvashtakavarga bindus.'); strengthsHi.push(house + 'वें भाव की राशि में ' + sav + ' सर्वाष्टकवर्ग बिंदु अपेक्षाकृत सहायक हैं।'); }
      if (sav <= 24) { watchoutsEn.push(house + 'th-house sign has ' + sav + ' Sarvashtakavarga bindus, a lower-support indicator.'); watchoutsHi.push(house + 'वें भाव की राशि में ' + sav + ' सर्वाष्टकवर्ग बिंदु अपेक्षाकृत कम समर्थन दर्शाते हैं।'); }
    }
    if (occupants.length) {
      count++;
      for (const p of occupants) { related.add(String(p.id)); if (BENEFICS.has(String(p.id))) local += 0.5; if (MALEFICS.has(String(p.id))) local -= 0.5; }
      en.push('occupants ' + occupants.map((p) => p.id + ' (' + p.dignity + ')').join(', '));
      hi.push('स्थित ग्रह ' + occupants.map((p) => p.id + ' (' + p.dignity + ')').join(', '));
    } else { en.push('no classical graha occupant'); hi.push('कोई पारंपरिक ग्रह स्थित नहीं'); }
    if (aspects.length) {
      count++;
      for (const id of aspects) { if (BENEFICS.has(id)) local += 0.5; if (MALEFICS.has(id)) local -= 0.5; }
      en.push('graha aspects ' + aspects.join(', ')); hi.push('ग्रह-दृष्टि ' + aspects.join(', '));
    }
    balance += local;
    houseEn.push('H' + house + ' (' + sign.name + '): ' + en.join('; ') + '.');
    houseHi.push('भाव ' + house + ' (' + sign.name + '): ' + hi.join('; ') + '।');
  }
  for (const id of config.karakas) {
    const p = chart.planets.find((x) => x.id === id);
    if (!p) continue;
    related.add(String(id));
    const d = dignityPoints(p.dignity); balance += d * 0.5; count++;
    if (d > 0) { strengthsEn.push('Natural significator ' + id + ' has ' + p.dignity + ' dignity.'); strengthsHi.push('नैसर्गिक कारक ' + id + ' की ' + p.dignity + ' गरिमा सहायक है।'); }
    if (d < 0) { watchoutsEn.push('Natural significator ' + id + ' has ' + p.dignity + ' dignity.'); watchoutsHi.push('नैसर्गिक कारक ' + id + ' की ' + p.dignity + ' गरिमा पर ध्यान देना चाहिए।'); }
  }
  const varga = chart.divisionalCharts?.[config.varga], vargaEvidence: string[] = [];
  if (varga) for (const id of related) {
    const place = varga.placements.find((p) => p.id === id);
    if (!place) continue;
    vargaEvidence.push(id + ': ' + place.dignity + ', Varga H' + place.houseFromVargaLagna);
    const d = dignityPoints(place.dignity); balance += d * 0.5; count++;
    if (d > 0) { strengthsEn.push(id + ' is ' + place.dignity + ' in ' + config.varga + '.'); strengthsHi.push(id + ' ' + config.varga + ' में ' + place.dignity + ' स्थिति में हैं।'); }
    if (d < 0) { watchoutsEn.push(id + ' is ' + place.dignity + ' in ' + config.varga + '.'); watchoutsHi.push(id + ' की ' + config.varga + ' स्थिति ' + place.dignity + ' है।'); }
  }
  const relatedYogas = chart.yogas.filter((y) => y.planets.some((id) => related.has(id)));
  for (const y of relatedYogas) {
    yogaEvidence.push(y.name + ' (' + y.strength + ')');
    if (y.strength === 'Strong') {
      strengthsEn.unshift('Related yoga: ' + y.name + ' (strong).');
      strengthsHi.unshift('संबंधित योग ' + y.name + ' मजबूत रूप में दर्ज है।');
    }
    // Moderate/Present yogas remain visible as corroborating evidence, but are
    // not counted as supportive outcomes without a strong classification.

  }
  const periods = flattenDasha(chart.vimshottari ?? []);
  const active = periods.filter((p) => related.has(p.lord) && p.startMs <= atMs && atMs < p.endMs).sort((a, b) => b.level - a.level);
  const next = periods.filter((p) => related.has(p.lord) && p.startMs > atMs).sort((a, b) => a.startMs - b.startMs || b.level - a.level)[0];
  const pName = (n: number) => n === 1 ? 'Mahadasha' : n === 2 ? 'Antardasha' : n === 3 ? 'Pratyantardasha' : 'sub-period';
  const pNameHi = (n: number) => n === 1 ? 'महादशा' : n === 2 ? 'अंतर्दशा' : n === 3 ? 'प्रत्यंतर दशा' : 'उप-दशा';
  const timingEn = active.length ? 'Related period active: ' + active.map((p) => p.lord + ' ' + pName(p.level) + ' until ' + dateLabel(p.endMs, false)).join('; ') + '. Traditional activation indicator only, not an event guarantee.'
    : next ? 'Next related period: ' + next.lord + ' ' + pName(next.level) + ' from ' + dateLabel(next.startMs, false) + '. This is not a promised event date.'
    : 'No related active or upcoming Vimshottari period could be established from the supplied dasha data; no timing is stated.';
  const timingHi = active.length ? 'संबंधित दशा सक्रिय है: ' + active.map((p) => p.lord + ' की ' + pNameHi(p.level) + ' ' + dateLabel(p.endMs, true) + ' तक').join('; ') + '। यह सक्रियता-संकेत है, घटना की गारंटी नहीं।'
    : next ? 'अगली संबंधित अवधि: ' + next.lord + ' की ' + pNameHi(next.level) + ' ' + dateLabel(next.startMs, true) + ' से। यह निश्चित घटना-समय नहीं है।'
    : 'उपलब्ध विंशोत्तरी दशा डेटा में संबंधित अवधि स्थापित नहीं हुई; इसलिए समय-सीमा नहीं दी गई है।';
  const hasSupport = strengthsEn.length > 0, hasCaution = watchoutsEn.length > 0;
  const toneEn = hasSupport && hasCaution ? 'mixed' : hasSupport ? 'more supportive' : hasCaution ? 'more challenging' : 'insufficient';
  const toneHi = hasSupport && hasCaution ? 'मिले-जुले' : hasSupport ? 'अपेक्षाकृत अनुकूल' : hasCaution ? 'अपेक्षाकृत चुनौतीपूर्ण' : 'अपर्याप्त';
  const summaryEn = config.titleEn + ': ' + toneEn + ' indications appear across houses ' + config.houses.join(', ') + '. House lords, occupants, aspects, Sarvashtakavarga, ' + config.varga + ' and relevant significators are weighed together; conflicting signals are retained.';
  const summaryHi = config.titleHi + ': भाव ' + config.houses.join(', ') + ' के संकेत ' + toneHi + ' हैं। भावेश, स्थित ग्रह, दृष्टि, सर्वाष्टकवर्ग, ' + config.varga + ' और संबंधित कारकों को साथ देखा गया है; विरोधी संकेतों को छिपाया नहीं गया है।';
  const score = Math.max(25, Math.min(75, Math.round(50 + (count ? (balance / count) * 14 : 0))));
  const ratingEn = score >= 64 ? 'Very Good' : score <= 40 ? 'Challenging' : 'Moderate';
  const ratingHi = score >= 64 ? 'उत्तम' : score <= 40 ? 'चुनौतीपूर्ण' : 'मध्यम';
  const factorsEn = houseEn.join(' ') + ' Karakas: ' + config.karakas.join(', ') + '. ' + config.varga + ': ' + (vargaEvidence.length ? vargaEvidence.join('; ') : 'relevant placements unavailable') + '. Related yogas: ' + (yogaEvidence.length ? yogaEvidence.join('; ') : 'none identified in supplied yoga data') + '.';
  const factorsHi = houseHi.join(' ') + ' कारक ग्रह: ' + config.karakas.join(', ') + '। ' + config.varga + ': ' + (vargaEvidence.length ? vargaEvidence.join('; ') : 'संबंधित स्थिति उपलब्ध नहीं') + '। संबंधित योग: ' + (yogaEvidence.length ? yogaEvidence.join('; ') : 'प्रदत्त योग-डेटा में कोई संबंधित योग दर्ज नहीं') + '।';
  return {
    id: config.id, titleEn: config.titleEn, titleHi: config.titleHi, icon: config.icon, score, ratingEn, ratingHi,
    summaryEn, summaryHi,
    keyStrengthsEn: strengthsEn.length ? [...new Set(strengthsEn)].slice(0, 6) : ['No clearly supportive factor was established from the supplied chart data.'],
    keyStrengthsHi: strengthsHi.length ? [...new Set(strengthsHi)].slice(0, 6) : ['प्रदत्त कुंडली-डेटा से कोई स्पष्ट अनुकूल कारक स्थापित नहीं हुआ।'],
    watchoutsEn: watchoutsEn.length ? [...new Set(watchoutsEn)].slice(0, 6) : ['No major caution was established from available indicators; this does not mean difficulties are impossible.'],
    watchoutsHi: watchoutsHi.length ? [...new Set(watchoutsHi)].slice(0, 6) : ['उपलब्ध संकेतों से कोई प्रमुख सावधानी स्थापित नहीं हुई; इसका अर्थ यह नहीं कि कठिनाइयां असंभव हैं।'],
    astrologicalFactorsEn: factorsEn, astrologicalFactorsHi: factorsHi, timingEn, timingHi,
    classicalAdviceEn: config.adviceEn, classicalAdviceHi: config.adviceHi,
  };
}
export function computeDeepLifePredictions(chart: ChartData, atMs = Date.now()): DeepLifePredictionsReport {
  const domains = DOMAINS.map((config) => buildDomain(chart, config, atMs));
  const supportive = domains.filter((d) => !d.keyStrengthsEn[0].startsWith('No clearly')).length;
  const challenging = domains.filter((d) => !d.watchoutsEn[0].startsWith('No major')).length;
  const executiveSummaryEn = 'This is a chart-specific synthesis, not a fixed life verdict. ' + supportive + ' of ' + domains.length + ' domains contain identifiable supportive factors and ' + challenging + ' contain cautionary factors. Review each domain’s house-lord, planetary, divisional-chart and dasha evidence together; mixed signals are intentionally shown as mixed.';
  const executiveSummaryHi = 'यह उपलब्ध कुंडली-प्रमाणों का व्यक्तिगत समन्वित विश्लेषण है, कोई निश्चित जीवन-निर्णय नहीं। ' + domains.length + ' में से ' + supportive + ' क्षेत्रों में अनुकूल और ' + challenging + ' क्षेत्रों में सावधानी के संकेत मिले हैं। प्रत्येक क्षेत्र में भावेश, ग्रह, वर्ग-कुंडली और दशा को साथ पढ़ें; मिले-जुले संकेत उसी रूप में दिखाए गए हैं।';
  const overallLifeScore = Math.round(domains.reduce((sum, d) => sum + d.score, 0) / domains.length);
  return { overallLifeScore, executiveSummaryEn, executiveSummaryHi, domains };
}
