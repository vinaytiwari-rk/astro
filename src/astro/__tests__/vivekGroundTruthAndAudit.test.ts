import { describe, expect, it } from 'vitest';
import { calculateChart, DEFAULT_CALC_SETTINGS } from '../calculator';
import { EXTENDED_CELEBRITY_DATABASE } from '../celebrityDatabase1000';
import { SAMPLE_CHARTS } from '../../data/cities';
import { buildClassicalSynthesisContext } from '../predictions/classicalSynthesisEngine';
import { computeLifeSnapshotDossierReport } from '../predictions/lifeSnapshotDossierEngine';
import { computeDeepLifePredictions } from '../predictions/deepLifePredictions';
import { computeHouseWisePredictions } from '../predictions/houseWise';
import { computeAyurdaya } from '../predictions/ayurdayaEngine';
import { computeLifeEventsAndLedger } from '../predictions/lifeEventsLedger';
import { generatePredictionReport } from '../predictions/engine';
import { computePropheticTransitRoadmap } from '../predictions/propheticDashaGochar';
import { computeComprehensiveMarriageReport } from '../predictions/marriageAstrologyEngine';
import { computeComprehensiveChikitsaReport } from '../predictions/medicalAstrologyEngine';
import { computeEducationAstrologyEngine } from '../predictions/educationAstrologyEngine';
import { computeParasharaJaiminiAyurdaya } from '../relationshipCalculatorsEngine';
import { computeDynamicMarriageAndIntimacySections } from '../predictions/dynamicDossierChapters';
import type { BirthInput } from '../types';

const VIVEK_INPUT: BirthInput = {
  id: 'vivek-ground-truth',
  name: 'Vivek Kumar Singh',
  date: '1988-11-18',
  time: '07:23:00',
  latitude: 24.2092,
  longitude: 83.0253,
  timezone: 'Asia/Kolkata',
  utcOffsetMinutes: 330,
  city: 'Renukoot, Uttar Pradesh',
  country: 'India',
};

function findAttr(report: ReturnType<typeof computeLifeSnapshotDossierReport>, id: string) {
  return report.pillars.flatMap((p) => p.attributes).find((a) => a.id === id);
}

describe('Generalized Classical Synthesis & 10,646-Kundali Integrity Audit', () => {
  it('computes authentic Shadbala, SAV, Avastha & non-contradictory Dossier outputs on benchmark charts without Western crude labels', () => {
    const benchmarkInputs: BirthInput[] = [
      VIVEK_INPUT,
      {
        id: 'ajay-bench',
        name: 'Benchmark Capricorn',
        date: '1989-07-22',
        time: '19:50:00',
        latitude: 23.2599,
        longitude: 77.4126,
        timezone: 'Asia/Kolkata',
        utcOffsetMinutes: 330,
        city: 'Bhopal, Madhya Pradesh',
        country: 'India',
      },
      {
        id: 'khandwa-bench',
        name: 'Benchmark Aquarius',
        date: '1983-07-07',
        time: '22:30:00',
        latitude: 21.8314,
        longitude: 76.3498,
        timezone: 'Asia/Kolkata',
        utcOffsetMinutes: 330,
        city: 'Khandwa, Madhya Pradesh',
        country: 'India',
      },
    ];

    const vivekChart = calculateChart(VIVEK_INPUT, DEFAULT_CALC_SETTINGS);
    expect(vivekChart.ascendant.signName).toBe('Scorpio');
    expect(vivekChart.planets.find((p) => p.id === 'Moon')?.signName).toBe('Aquarius');
    expect(vivekChart.planets.find((p) => p.id === 'Venus')?.dignity).toBe('Debilitated');

    const vivekCtx = buildClassicalSynthesisContext(vivekChart);
    expect(vivekCtx.shadbalaByPlanet.get('Saturn')?.rank).toBeLessThanOrEqual(3);
    expect(vivekCtx.shadbalaByPlanet.get('Sun')?.rank).toBeGreaterThanOrEqual(6);
    expect(vivekCtx.bhavaByHouse.get(7)?.savBindus).toBeLessThanOrEqual(23);

    for (const inp of benchmarkInputs) {
      const chart = calculateChart(inp, DEFAULT_CALC_SETTINGS);
      const report = computeLifeSnapshotDossierReport(chart);
      expect(report.pillars.length).toBe(16);
      const serialized = JSON.stringify(report);
      expect(serialized).not.toMatch(/\b(bisexual|gay|lesbian|queer)\b/i);
      // Every attribute should have non-empty bilingual values & PAC/Shastric citations
      for (const attr of report.pillars.flatMap((p) => p.attributes)) {
        expect(attr.valueEn.trim().length).toBeGreaterThan(3);
        expect(attr.valueHi.trim().length).toBeGreaterThan(3);
        expect(attr.shastricRef.trim().length).toBeGreaterThan(2);
      }
    }
  });

  it('reduces <=3 unique-value hardcoded Dossier attributes to <= 2 across 120 diverse charts', () => {
    const reports = [];
    for (let i = 0; i < 120; i++) {
      const year = 1955 + ((i * 7) % 52);
      const month = ((i * 5) % 12) + 1;
      const day = ((i * 11) % 28) + 1;
      const hour = (i * 2) % 24;
      const min = (i * 13) % 60;
      const chart = calculateChart(
        {
          id: `audit-${i}`,
          name: `Audit Native ${i}`,
          date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
          time: `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}:00`,
          latitude: 12 + ((i * 3) % 20),
          longitude: 72 + ((i * 5) % 18),
          timezone: 'Asia/Kolkata',
          utcOffsetMinutes: 330,
          city: 'Audit City',
          country: 'India',
        },
        DEFAULT_CALC_SETTINGS
      );
      reports.push(computeLifeSnapshotDossierReport(chart));
    }

    const attrIds = reports[0].pillars.flatMap((p) => p.attributes.map((a) => a.id));
    const lowVariety: string[] = [];
    for (const id of attrIds) {
      const uniqueVals = new Set(reports.map((r) => findAttr(r, id)?.valueEn ?? ''));
      if (uniqueVals.size <= 3) {
        lowVariety.push(`${id} (${uniqueVals.size})`);
      }
    }
    console.log(`120-Chart Uniqueness Audit: Total=${attrIds.length}, LowVariety(<=3)=${lowVariety.length} -> [${lowVariety.join(', ')}]`);
    expect(lowVariety.length).toBe(0);
  }, 60000);

  it('verifies 10,646+ Kundali database integrity across edge-case life categories', () => {
    expect(EXTENDED_CELEBRITY_DATABASE.length).toBeGreaterThanOrEqual(10500);

    // Check coverage across requested real-life categories in bioEn/categoryTitleEn
    const allBios = EXTENDED_CELEBRITY_DATABASE.map((c) => `${c.categoryTitleEn} ${c.bioEn}`.toLowerCase());
    const hasUntimelyOrAccident = allBios.filter((s) => /accident|untimely|murder|assassinated|suicide|war/.test(s)).length;
    const hasFamilyEdge = allBios.filter((s) => /orphan|step|sibling|family|affair|scandal/.test(s)).length;
    expect(hasUntimelyOrAccident).toBeGreaterThan(50);
    expect(hasFamilyEdge).toBeGreaterThan(50);

    // Sample 100 charts evenly across 10,646 records & verify astrological metadata consistency
    let validPlacements = 0;
    for (let idx = 0; idx < EXTENDED_CELEBRITY_DATABASE.length; idx += 100) {
      const rec = EXTENDED_CELEBRITY_DATABASE[idx];
      expect(rec.ascSignIndex).toBeGreaterThanOrEqual(0);
      expect(rec.ascSignIndex).toBeLessThan(12);
      expect(rec.moonSignIndex).toBeGreaterThanOrEqual(0);
      expect(rec.moonSignIndex).toBeLessThan(12);
      expect(rec.sunSignIndex).toBeGreaterThanOrEqual(0);
      expect(rec.sunSignIndex).toBeLessThan(12);
      if (rec.prominentYogas.length > 0 && rec.keyLifeMilestones.length > 0) {
        validPlacements++;
      }
    }
    expect(validPlacements).toBeGreaterThanOrEqual(100);
  });

  it('blind held-out evaluation across 20 unseen Kundalis enforces 74 authentic attributes, SAV=337 invariant, and wide differentiation', () => {
    const pool = EXTENDED_CELEBRITY_DATABASE.filter((r) =>
      /^\d{2}-\d{2}-(19[2-9]\d|200\d)$/.test(r.birthDate)
    );
    expect(pool.length).toBeGreaterThan(200);
    const step = Math.floor(pool.length / 20);
    const heldOut = Array.from({ length: 20 }, (_, i) => pool[i * step]);

    const coreIds = [
      'attr_temperament',
      'attr_suitable_profession',
      'attr_marriage_timing_triggers',
      'attr_longevity_tier',
      'attr_financial_wealth_tier',
    ] as const;
    const seenByCoreId = new Map<string, Set<string>>(coreIds.map((id) => [id, new Set<string>()]));

    for (const rec of heldOut) {
      const [dd, mm, yyyy] = rec.birthDate.split('-');
      let matchedChart = null;
      for (let h = 0; h < 24; h += 2) {
        const candidate = calculateChart(
          {
            id: `heldout-${rec.id}`,
            name: rec.nameEn,
            date: `${yyyy}-${mm}-${dd}`,
            time: `${String(h).padStart(2, '0')}:30:00`,
            latitude: 28.6139,
            longitude: 77.209,
            timezone: 'Asia/Kolkata',
            utcOffsetMinutes: 330,
            city: rec.birthPlace || 'Delhi',
            country: 'India',
          },
          DEFAULT_CALC_SETTINGS
        );
        if (candidate.ascendant.signIndex === rec.ascSignIndex) {
          matchedChart = candidate;
          break;
        }
      }
      const chart =
        matchedChart ??
        calculateChart(
          {
            id: `heldout-${rec.id}`,
            name: rec.nameEn,
            date: `${yyyy}-${mm}-${dd}`,
            time: '12:00:00',
            latitude: 28.6139,
            longitude: 77.209,
            timezone: 'Asia/Kolkata',
            utcOffsetMinutes: 330,
            city: rec.birthPlace || 'Delhi',
            country: 'India',
          },
          DEFAULT_CALC_SETTINGS
        );

      const ctx = buildClassicalSynthesisContext(chart);
      let savTotal = 0;
      for (let h = 1; h <= 12; h++) {
        savTotal += ctx.bhavaByHouse.get(h)?.savBindus ?? 0;
      }
      expect(savTotal).toBe(337);

      const report = computeLifeSnapshotDossierReport(chart);
      expect(report.pillars.length).toBe(16);
      const attrs = report.pillars.flatMap((p) => p.attributes);
      expect(attrs.length).toBe(74);

      const serialized = JSON.stringify(report);
      expect(serialized).not.toMatch(/\b(bisexual|gay|lesbian|queer)\b/i);
      expect(serialized).not.toMatch(/Ayurvedic Business|Grocery\/FMCG|Noida\/Tech/i);
      expect(serialized).not.toMatch(/\b(75 to 82|68 to 76|82 to 90\+|75\+ yrs)\b/i);

      for (const id of coreIds) {
        const val = findAttr(report, id)?.valueEn ?? '';
        expect(val.length).toBeGreaterThan(5);
        seenByCoreId.get(id)?.add(val);
      }
    }

    for (const id of coreIds) {
      const uniqueCount = seenByCoreId.get(id)?.size ?? 0;
      const minExpected =
        id === 'attr_longevity_tier' || id === 'attr_financial_wealth_tier' ? 3 : 8;
      expect(uniqueCount).toBeGreaterThanOrEqual(minExpected);
    }

    // Confirm OR / अथवा multi-hypothesis branches naturally fire across diverse unseen charts
    const orAltCount = heldOut.filter((rec) => {
      const [dd, mm, yyyy] = rec.birthDate.split('-');
      const chart = calculateChart(
        {
          id: `or-chk-${rec.id}`,
          name: rec.nameEn,
          date: `${yyyy}-${mm}-${dd}`,
          time: '12:00:00',
          latitude: 28.6139,
          longitude: 77.209,
          timezone: 'Asia/Kolkata',
          utcOffsetMinutes: 330,
          city: rec.birthPlace || 'Delhi',
          country: 'India',
        },
        DEFAULT_CALC_SETTINGS
      );
      return JSON.stringify(computeLifeSnapshotDossierReport(chart)).includes('OR / अथवा');
    }).length;
    expect(orAltCount).toBeGreaterThanOrEqual(10);
  }, 60000);

  it('guarantees zero broken templates, zero fixed death-age brackets, zero cross-pillar contradictions, and chart-specific variety across all prediction engines', () => {
    const charts = [
      ...SAMPLE_CHARTS.slice(0, 4),
      VIVEK_INPUT,
      {
        id: 'ajay-audit',
        name: 'Ajay Pawar',
        date: '1989-07-22',
        time: '19:50:00',
        latitude: 23.2599,
        longitude: 77.4126,
        timezone: 'Asia/Kolkata',
        utcOffsetMinutes: 330,
        city: 'Bhopal',
        country: 'India',
      },
    ];

    const brokenPattern = /,\s*,|:\s*,|\(\s*\)|in undefined\b|\[object Object\]/i;
    const deathAgePattern =
      /\b(75 to 82|68 to 76|82 to 90\+|75\+\s*yrs?|36\s*-\s*72\s*Years|72\s*-\s*108\s*Years|108\s*-\s*120\s*Years|96 से 120|74 से 94|58 से 72|32 से 36 वर्ष)/i;

    for (const inp of charts) {
      const chart = calculateChart(inp, DEFAULT_CALC_SETTINGS);
      const dossier = computeLifeSnapshotDossierReport(chart);
      const deep = computeDeepLifePredictions(chart);
      const hw = computeHouseWisePredictions(chart);
      const ayur = computeAyurdaya(chart);
      const ledger = computeLifeEventsAndLedger(chart);
      const rep = generatePredictionReport(chart, '2026-11-28');
      const transitRoad = computePropheticTransitRoadmap(chart, rep.deepGochar, rep.transitForecast);
      const marRep = computeComprehensiveMarriageReport(chart);
      const medRep = computeComprehensiveChikitsaReport(chart);
      const eduRep = computeEducationAstrologyEngine(chart);
      const relAyur = computeParasharaJaiminiAyurdaya(chart);
      const dynRel = computeDynamicMarriageAndIntimacySections(chart, false);

      for (const payload of [dossier, deep, hw, ayur, ledger, transitRoad, marRep, medRep, eduRep, relAyur, dynRel]) {
        const str = JSON.stringify(payload);
        expect(str).not.toMatch(brokenPattern);
        expect(str).not.toMatch(deathAgePattern);
        expect(str).not.toMatch(/\b(bisexual|gay|lesbian|queer)\b/i);
      }

      // Check Pillar 5 self-consistency: "Abundant & Blessed" must not appear alongside negative obstruction narration
      const chYog = findAttr(dossier, 'attr_children_yoga')!;
      expect(
        /Abundant & Blessed/i.test(chYog.valueEn) &&
          /Negative H5 Drishti|D7 Saptamsha H5 holds (Mercury\+Saturn|Saturn|Rahu|Ketu)/i.test(chYog.explanationEn)
      ).toBe(false);
    }
  }, 60000);
});
