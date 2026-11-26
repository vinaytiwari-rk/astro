import { describe, expect, it } from 'vitest';
import { calculateChart } from '../calculator';
import { computeDailyChoghadiyaAndGowri, computeDailyPanchangExtras } from '../panchangExtra';
import { DEFAULT_SETTINGS } from '../../data/cities';

describe('Drik Panchang Sunrise-Anchored Accuracy', () => {
  it('anchors winter Delhi Panchang (2026-11-26, sunrise ~06:52) to Thursday rather than 06:00 Wednesday', () => {
    const extras = computeDailyPanchangExtras('2026-11-26', 28.6139, 77.209, 330, 'lahiri');
    expect(extras.sunriseTimeHms.startsWith('06:52')).toBe(true);

    const chart = calculateChart(
      {
        id: 'panchang-2026-11-26',
        name: 'Panchang',
        date: '2026-11-26',
        time: extras.sunriseTimeHms,
        city: 'New Delhi',
        country: 'India',
        latitude: 28.6139,
        longitude: 77.209,
        timezone: 'Asia/Kolkata',
      },
      DEFAULT_SETTINGS
    );

    expect(chart.panchang.vara.name).toBe('Thursday');
    expect(chart.panchang.vara.sanskrit).toBe('Guruvara');
    expect(chart.panchang.vara.lord).toBe('Jupiter');

    const chog = computeDailyChoghadiyaAndGowri('2026-11-26', 28.6139, 77.209, 330);
    expect(chog.dayChoghadiya[0].nameEn).toBe('Shubh');
    expect(chog.dayChoghadiya[0].rulerEn).toBe('Jupiter');
  });

  it('computes dynamic Brahma Muhurta, Amrita Kalam, and limb end times across seasons', () => {
    const winter = computeDailyPanchangExtras('2026-11-26', 28.6139, 77.209, 330, 'lahiri');
    const summer = computeDailyPanchangExtras('2026-06-21', 28.6139, 77.209, 330, 'lahiri');

    expect(winter.brahmaMuhurta).not.toBe('04:45 – 05:35');
    expect(winter.brahmaMuhurta).not.toBe(summer.brahmaMuhurta);
    expect(winter.amritaKalam).not.toBe('07:15 – 08:45');
    expect(winter.tithiEnd).toMatch(/^\d{2}:\d{2}/);
    expect(winter.nakshatraEnd).toMatch(/^\d{2}:\d{2}/);
    expect(winter.yogaEnd).toMatch(/^\d{2}:\d{2}/);
    expect(winter.karanaEnd).toMatch(/^\d{2}:\d{2}/);
  });
});
