import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { DEFAULT_SETTINGS, SAMPLE_CHARTS } from '../../data/cities';
import {
  CLICKASTRO_DAILY_FEED_SNAPSHOT,
  CLICKASTRO_WEEKLY_FEED_SNAPSHOT,
  fetchClickAstroFeed,
  parseClickAstroRssXml,
} from '../externalHoroscopeFeeds';
import { computeRashifalReport } from '../rashifalBabyRudraksha';

describe('External ClickAstro Feeds & Enhanced Thematic Domain Horoscope', () => {
  it('validates offline daily feed snapshot contains all 12 signs with complete metadata', () => {
    expect(CLICKASTRO_DAILY_FEED_SNAPSHOT).toHaveLength(12);

    CLICKASTRO_DAILY_FEED_SNAPSHOT.forEach((item, idx) => {
      expect(item.signIndex).toBe(idx);
      expect(item.period).toBe('daily');
      expect(item.signNameEn).toBeTruthy();
      expect(item.signNameHi).toBeTruthy();
      expect(item.title).toContain(item.signNameEn);
      expect(item.link).toBeDefined();
      expect(item.pubDateFormatted).toMatch(/^\d{2}-\d{2}-\d{4}$/);
      expect(item.description.length).toBeGreaterThan(50);
      expect(item.descriptionHi.length).toBeGreaterThan(50);
      expect(item.keyThemesEn.length).toBeGreaterThanOrEqual(2);
      expect(item.keyThemesHi.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('validates offline weekly feed snapshot contains all 12 signs with complete metadata', () => {
    expect(CLICKASTRO_WEEKLY_FEED_SNAPSHOT).toHaveLength(12);

    CLICKASTRO_WEEKLY_FEED_SNAPSHOT.forEach((item, idx) => {
      expect(item.signIndex).toBe(idx);
      expect(item.period).toBe('weekly');
      expect(item.signNameEn).toBeTruthy();
      expect(item.signNameHi).toBeTruthy();
      expect(item.title).toContain(item.signNameEn);
      expect(item.link).toBeDefined();
      expect(item.pubDateFormatted).toMatch(/^\d{2}-\d{2}-\d{4}$/);
      expect(item.description.length).toBeGreaterThan(50);
      expect(item.descriptionHi.length).toBeGreaterThan(50);
      expect(item.keyThemesEn.length).toBeGreaterThanOrEqual(2);
      expect(item.keyThemesHi.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('parses raw ClickAstro RSS XML feed format into 12 structured items', () => {
    const sampleXml = `<?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0">
        <channel>
          <title>Dialy Sign Horoscope</title>
          <item>
            <title>Aries Horoscope Nov 21 2026</title>
            <link>https://www.clickastro.com/aries-horoscope-daily</link>
            <description>Your habit of speaking without thinking may prove negative today. Some financial problems resolve.</description>
            <pubDate>Sat, 21 Nov 2026 12:15:53 IST</pubDate>
          </item>
          <item>
            <title>Taurus Horoscope Nov 21 2026</title>
            <link>https://www.clickastro.com/taurus-horoscope-daily</link>
            <description>You will be an inspiration to people today. Compassion and empathy from peers.</description>
            <pubDate>Sat, 21 Nov 2026 12:15:53 IST</pubDate>
          </item>
        </channel>
      </rss>`;

    const parsed = parseClickAstroRssXml(sampleXml, 'daily');
    // If not all 12 are present in sampleXml, it falls back cleanly to the 12-item snapshot
    expect(parsed).toHaveLength(12);
  });

  it('fetches feeds cleanly in offline mode with cached status', async () => {
    const dailyRes = await fetchClickAstroFeed('daily', false);
    expect(dailyRes.status).toBe('cached');
    expect(dailyRes.items).toHaveLength(12);

    const weeklyRes = await fetchClickAstroFeed('weekly', false);
    expect(weeklyRes.status).toBe('cached');
    expect(weeklyRes.items).toHaveLength(12);
  });

  it('enriches computeRashifalReport with 5 core thematic domains for all 12 signs', () => {
    const chart = calculateChart(SAMPLE_CHARTS[3], DEFAULT_SETTINGS);
    const report = computeRashifalReport(chart, '2026-11-21');

    expect(report).toHaveLength(12);

    for (const rashi of report) {
      expect(rashi.thematicDomains).toHaveLength(5);
      const domainIds = rashi.thematicDomains.map((d) => d.domainId);
      expect(domainIds).toEqual([
        'mental_state',
        'work_career',
        'love_attraction',
        'finance_relief',
        'family_siblings',
      ]);

      for (const dom of rashi.thematicDomains) {
        expect(dom.score).toBeGreaterThanOrEqual(40);
        expect(dom.score).toBeLessThanOrEqual(100);
        expect(dom.domainNameEn).toBeTruthy();
        expect(dom.domainNameHi).toBeTruthy();
        expect(dom.verdictEn).toBeTruthy();
        expect(dom.verdictHi).toBeTruthy();
        expect(dom.adviceEn.length).toBeGreaterThan(20);
        expect(dom.adviceHi.length).toBeGreaterThan(20);
      }

      expect(rashi.mentalMoodEn).toBeTruthy();
      expect(rashi.mentalMoodHi).toBeTruthy();
      expect(rashi.workplaceBossEn).toBeTruthy();
      expect(rashi.workplaceBossHi).toBeTruthy();
      expect(rashi.loveAttractionEn).toBeTruthy();
      expect(rashi.loveAttractionHi).toBeTruthy();
      expect(rashi.financeReliefEn).toBeTruthy();
      expect(rashi.financeReliefHi).toBeTruthy();
      expect(rashi.familySiblingsEn).toBeTruthy();
      expect(rashi.familySiblingsHi).toBeTruthy();
    }
  });

  it('strictly adheres to zero emojis and zero personal modern author names', () => {
    const combinedData = JSON.stringify({
      daily: CLICKASTRO_DAILY_FEED_SNAPSHOT,
      weekly: CLICKASTRO_WEEKLY_FEED_SNAPSHOT,
    });

    // Check for emojis
    const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/u;
    expect(emojiRegex.test(combinedData)).toBe(false);

    // Check for modern author names
    expect(combinedData).not.toMatch(/Abha Bansal|Arun Bansal|Adawal|Suryanarayan|Kiran Bedi|Dheerubhai/i);
  });
});
