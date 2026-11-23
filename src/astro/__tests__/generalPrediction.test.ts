import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS, SAMPLE_CHARTS } from '../../data/cities';
import { computeGeneralPrediction, isClassicalYogaSourceUsable } from '../predictions/generalPrediction';
import { CLASSICAL_YOGAS_KB, detectClassicalYogas } from '../predictions/classicalYogasKb';

describe('Natal-only General Prediction reconstruction', () => {
  it('returns the twelve approved life domains with explicit chart evidence', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeGeneralPrediction(chart);

    expect(report.domains).toHaveLength(12);
    expect(report.domains.map((domain) => domain.id)).toEqual([
      'personality', 'education', 'career', 'wealth', 'marriage', 'children',
      'property', 'health', 'travels', 'spirituality', 'milestones', 'remedies',
    ]);
    for (const domain of report.domains) {
      expect(domain.evidence.length).toBeGreaterThan(0);
      expect(domain.synthesisEn.length).toBeGreaterThan(40);
      expect(domain.synthesisHi.length).toBeGreaterThan(40);
      expect(domain.predictionEn.length).toBeGreaterThan(120);
      expect(domain.predictionHi.length).toBeGreaterThan(120);
      expect(domain.predictionEn).not.toMatch(/\b(?:house|D1|D9|D10|Shadbala|Sarvashtakavarga)\b/i);
      expect(domain.predictionHi).not.toMatch(/भाव\s*\d|षड्बल|सर्वाष्टकवर्ग|दशमांश|नवांश/);
      expect(['complete', 'partial', 'limited']).toContain(domain.dataCompleteness);
    }
  });

  it('uses career house-lord and D10 evidence without generating timing claims', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeGeneralPrediction(chart);
    const career = report.domains.find((domain) => domain.id === 'career');

    expect(career).toBeDefined();
    expect(career!.evidence.some((item) => item.source.startsWith('House 10 lord:'))).toBe(true);
    expect(career!.evidence.some((item) => item.source.startsWith('D10 placement:'))).toBe(true);
    expect(career!.interpretationBasisEn).toContain('10th house');
    expect(career!.primaryAnchorEn).toContain('House 10 lord');
    expect('timingWindowEn' in career!).toBe(false);
    expect('concreteEventsEn' in career!).toBe(false);
    expect(report.methodEn).toContain('Dasha and transit are separate');
    expect(report.summaryEn).toContain('No Dasha');
  });

  it('produces chart-dependent evidence for different natal charts', () => {
    const reports = SAMPLE_CHARTS.slice(0, 3).map((sample) =>
      computeGeneralPrediction(calculateChart(sample, DEFAULT_SETTINGS)),
    );
    const careerEvidence = reports.map((report) =>
      report.domains.find((domain) => domain.id === 'career')!.evidence
        .map((item) => item.detailEn).join('|'),
    );
    expect(new Set(careerEvidence).size).toBeGreaterThan(1);
    const careerStories = reports.map((report) => report.domains.find((domain) => domain.id === 'career')!.predictionEn);
    expect(new Set(careerStories).size).toBeGreaterThan(1);
  });


  it('rejects yoga source labels without verifiable textual attribution', () => {
    expect(isClassicalYogaSourceUsable('Traditional yoga compilation — primary-text citation not verified')).toBe(false);
    expect(isClassicalYogaSourceUsable('Classical Vedic Shastra Ch. 75 / Saravali Ch. 37')).toBe(false);
    expect(isClassicalYogaSourceUsable('Brihat Parashara Hora Shastra, Ch. 36, vv. 3–4')).toBe(true);
  });

  it('surfaces only sourced classical yoga rule matches in relevant domains', () => {
    const targets: Record<string, string[]> = {
      Mahapurusha: ['personality', 'career', 'milestones'],
      Chandra: ['personality', 'wealth', 'milestones'],
      Surya: ['personality', 'career'],
      Raja: ['career', 'milestones'],
      Dhana: ['wealth'],
      Viparita: ['career', 'wealth'],
      Nabhasa: ['personality', 'career', 'spirituality'],
    };
    const charts = SAMPLE_CHARTS.slice(0, 3).map((sample) => calculateChart(sample, DEFAULT_SETTINGS));

    for (const chart of charts) {
      const detected = detectClassicalYogas(chart);
      const report = computeGeneralPrediction(chart);
      for (const yoga of detected) {
        const definition = CLASSICAL_YOGAS_KB.find((item) => item.id === yoga.id);
        if (!definition || /not verified|unverified|verify the individual|traditional yoga compilation|classical jyotisha references|classical vedic shastra|300 classical yogas/i.test(definition.source)) continue;
        for (const domainId of targets[yoga.category] ?? []) {
          const domain = report.domains.find((item) => item.id === domainId);
          expect(domain?.evidence.some((item) =>
            item.source.startsWith(`Classical yoga rule: ${yoga.name} — ${definition.source}`)
            && item.detailEn.includes(definition.conditionEn),
          )).toBe(true);
        }
      }
      const yogaEvidence = report.domains.flatMap((domain) => domain.evidence)
        .filter((item) => item.source.startsWith('Classical yoga rule:'));
      expect(yogaEvidence.every((item) =>
        !/not verified|unverified|verify the individual|classical vedic shastra/i.test(item.source),
      )).toBe(true);
    }
  });

  it('records functional-lordship flags as context rather than stand-alone verdicts', () => {
    const chart = calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS);
    const report = computeGeneralPrediction(chart);
    const flags = report.domains.flatMap((domain) => domain.evidence)
      .filter((item) => item.source.startsWith('Classical functional-lordship flags:'));
    for (const item of flags) {
      expect(item.kind).toBe('context');
      expect(item.detailEn).toContain('traditional ownership classifications only');
    }
  });

  it('provides Hindi and English explanations without probability claims', () => {
    const report = computeGeneralPrediction(calculateChart(SAMPLE_CHARTS[0], DEFAULT_SETTINGS));
    expect(report.titleHi).toContain('सामान्य फलादेश');
    expect(report.summaryHi).toContain('जन्मकुंडली');
    expect(report.summaryEn).not.toMatch(/\d+\s*%/);
  });
});
