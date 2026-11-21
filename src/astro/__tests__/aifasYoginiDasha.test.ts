import { describe, expect, it } from 'vitest';
import {
  AIFAS_DASHA_26_RULES,
  AIFAS_YOGINI_64_ANTARDASHAS,
  AIFAS_YOGINI_BOOK_METADATA,
  AIFAS_YOGINI_MAHADASHAS,
  getAifasYoginiMaha,
  getAifasYoginiSub,
} from '../predictions/aifasYoginiDashaKb';
import { predictDashaDetail } from '../predictions/dashaPrashna';
import { localizeDashaDetailHi } from '../../i18n/hindiPredictions';
import { calculateChart } from '../calculator';
import { DEFAULT_USER_PROFILE } from '../../App';
import { DEFAULT_SETTINGS } from '../../data/cities';

describe('AIFAS Yogini & Dasha Predictions System', () => {
  it('contains valid AIFAS book metadata and fundamental axioms', () => {
    expect(AIFAS_YOGINI_BOOK_METADATA.title).toBe('Prediction through Dasha: Yogini & Vimshottari');
    expect(AIFAS_YOGINI_BOOK_METADATA.author).toBeDefined();
    expect(AIFAS_YOGINI_BOOK_METADATA.url).toBeDefined();
    expect(AIFAS_YOGINI_BOOK_METADATA.fundamentalAxiomEn).toContain('natural result of the planets in Yogini');
    expect(AIFAS_YOGINI_BOOK_METADATA.fundamentalAxiomHi).toContain('स्वाभाविक/नैसर्गिक गुणों के आधार पर');
  });

  it('contains all 8 Yogini Mahadashas totaling 36 years', () => {
    const keys = Object.keys(AIFAS_YOGINI_MAHADASHAS);
    expect(keys).toEqual([
      'Mangala',
      'Pingala',
      'Dhanya',
      'Bhramari',
      'Bhadrika',
      'Ulka',
      'Siddha',
      'Sankata',
    ]);

    const totalYears = keys.reduce((acc, k) => acc + AIFAS_YOGINI_MAHADASHAS[k].years, 0);
    expect(totalYears).toBe(36);

    // Check specific mahadashas
    const mangala = getAifasYoginiMaha('Mangala');
    expect(mangala).toBeDefined();
    expect(mangala?.lordEn).toBe('Moon');
    expect(mangala?.years).toBe(1);
    expect(mangala?.nature).toBe('Auspicious');
    expect(mangala?.predictionHi).toContain('मंगला महादशा');

    const sankata = getAifasYoginiMaha('Sankata');
    expect(sankata).toBeDefined();
    expect(sankata?.lordEn).toBe('Rahu');
    expect(sankata?.years).toBe(8);
    expect(sankata?.nature).toBe('Inauspicious');
  });

  it('contains all 64 Yogini Antardashas with correct duration and crisis flags', () => {
    const keys = Object.keys(AIFAS_YOGINI_64_ANTARDASHAS);
    expect(keys.length).toBe(64);

    // Test Mangala-Mangala (10 days)
    const mm = getAifasYoginiSub('Mangala', 'Mangala');
    expect(mm).toBeDefined();
    expect(mm?.years).toBe(0);
    expect(mm?.months).toBe(0);
    expect(mm?.days).toBe(10);
    expect(mm?.durationStrEn).toBe('0Y 0M 10D');

    // Test Sankata-Sankata (640 days = 1y 9m 10d)
    const ss = getAifasYoginiSub('Sankata', 'Sankata');
    expect(ss).toBeDefined();
    expect(ss?.years).toBe(1);
    expect(ss?.months).toBe(9);
    expect(ss?.days).toBe(10);
    expect(ss?.isSpecialCrisisAlert).toBe(true);

    // Test Sankata in Bhramari (Crisis alert)
    const bs = getAifasYoginiSub('Bhramari', 'Sankata');
    expect(bs).toBeDefined();
    expect(bs?.isSpecialCrisisAlert).toBe(true);

    // Test Sankata in Ulka (Crisis alert)
    const us = getAifasYoginiSub('Ulka', 'Sankata');
    expect(us).toBeDefined();
    expect(us?.isSpecialCrisisAlert).toBe(true);

    // Test non-crisis subperiod
    const md = getAifasYoginiSub('Mangala', 'Dhanya');
    expect(md).toBeDefined();
    expect(md?.isSpecialCrisisAlert).toBe(false);
  });

  it('contains all 26 Golden Rules of Dasha Prediction from Chapter 13', () => {
    expect(AIFAS_DASHA_26_RULES.length).toBe(26);

    // Check Rule 1 (Exalted planet)
    const r1 = AIFAS_DASHA_26_RULES[0];
    expect(r1.ruleNumber).toBe(1);
    expect(r1.titleEn).toContain('Exaltation');
    expect(r1.category).toBe('Dignity');

    // Check Rule 8 (1/4/7/10, 5/9 vs 6/8)
    const r8 = AIFAS_DASHA_26_RULES.find((r) => r.ruleNumber === 8);
    expect(r8).toBeDefined();
    expect(r8?.titleEn).toContain('Trine (5/9)');

    // Check Rule 9 (Natural Enmity)
    const r9 = AIFAS_DASHA_26_RULES.find((r) => r.ruleNumber === 9);
    expect(r9).toBeDefined();
    expect(r9?.titleEn).toContain('Natural Enmity');

    // Check Rule 10 (3rd, 5th, 7th Order Rules)
    const r10 = AIFAS_DASHA_26_RULES.find((r) => r.ruleNumber === 10);
    expect(r10).toBeDefined();
    expect(r10?.ruleEn).toContain('serial order');

    // Check Rule 16 (Jeeva vs Dhatva)
    const r16 = AIFAS_DASHA_26_RULES.find((r) => r.ruleNumber === 16);
    expect(r16).toBeDefined();
    expect(r16?.category).toBe('Jeeva vs Dhatva');
  });

  it('predictDashaDetail integrates AIFAS Yogini readings and crisis alerts', () => {
    const chart = calculateChart(DEFAULT_USER_PROFILE, DEFAULT_SETTINGS);

    const now = Date.now();
    // Test Yogini detail
    const detail = predictDashaDetail({
      chart,
      system: 'yogini',
      mdLordRaw: 'Siddha (Venus)',
      adLordRaw: 'Dhanya (Jupiter)',
      startMs: now,
      endMs: now + 86400000 * 210,
    });

    expect(detail.mdSummary).toContain('AIFAS');
    expect(detail.mdSummary).toContain('Siddha');
    expect(detail.adSummary).toContain('Dhanya in Siddha');
    expect(detail.guidance).toContain('AIFAS Classical Upayas');

    // Test Sankata in Bhramari crisis alert
    const crisisDetail = predictDashaDetail({
      chart,
      system: 'yogini',
      mdLordRaw: 'Bhramari (Mars)',
      adLordRaw: 'Sankata (Rahu)',
      startMs: now,
      endMs: now + 86400000 * 320,
    });

    expect(crisisDetail.score).toBeLessThanOrEqual(36);
    expect(crisisDetail.adSummary).toContain('SPECIAL CRISIS ALERT');
    expect(crisisDetail.guidance).toContain('AIFAS High Priority Alert');

    // Test Hindi localization of Yogini
    const localizedHi = localizeDashaDetailHi(detail, chart, 'yogini');
    expect(localizedHi.mdSummary).toContain('सिद्धा महादशा');
    expect(localizedHi.guidance).toContain('शास्त्रीय उपाय');
  });
});
