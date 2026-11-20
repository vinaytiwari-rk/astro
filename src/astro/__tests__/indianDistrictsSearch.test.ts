import { describe, expect, it } from 'vitest';
import { searchCities } from '../../data/cities';

describe('Indian Districts Atlas & Multi-Lingual Search Verification', () => {
  it('resolves Sonbhadra in English, Hindi, and via headquarters name Robertsganj', () => {
    const q1 = searchCities('Sonbhadra', 5);
    expect(q1.length).toBeGreaterThan(0);
    expect(q1[0].city).toContain('Sonbhadra');
    expect(q1[0].province).toBe('Uttar Pradesh');
    expect(q1[0].country).toBe('India');
    expect(q1[0].timezone).toBe('Asia/Kolkata');

    const q2 = searchCities('Sonbhadra Uttar Pradesh', 5);
    expect(q2.length).toBeGreaterThan(0);
    expect(q2[0].city).toContain('Sonbhadra');
    expect(q2[0].province).toBe('Uttar Pradesh');

    const q3 = searchCities('सोनभद्र', 5);
    expect(q3.length).toBeGreaterThan(0);
    expect(q3[0].city).toContain('Sonbhadra');

    const q4 = searchCities('सोनभद्र उत्तर प्रदेश', 5);
    expect(q4.length).toBeGreaterThan(0);
    expect(q4[0].city).toContain('Sonbhadra');

    const q5 = searchCities('Robertsganj', 5);
    expect(q5.length).toBeGreaterThan(0);
    expect(q5[0].city).toContain('Sonbhadra');
  });

  it('resolves all key Uttar Pradesh districts with exact coordinates', () => {
    const upDistricts = [
      'Kaushambi',
      'Sant Kabir Nagar',
      'Siddharthnagar',
      'Amethi',
      'Chitrakoot',
      'Prayagraj',
      'Ayodhya',
      'Mathura',
      'Varanasi',
      'Mirzapur',
      'Jaunpur',
      'Bhadohi',
      'Deoria',
      'Ballia',
      'Ghazipur',
      'Lakhimpur Kheri',
      'Banda',
      'Fatehpur',
      'Kushinagar',
      'Maharajganj',
      'Budaun',
      'Pilibhit',
      'Sambhal',
      'Hapur',
      'Shamli',
      'Kasganj',
      'Hathras',
      'Auraiya',
      'Farrukhabad',
      'Kannauj',
      'Mahoba',
      'Lalitpur',
      'Jalaun',
      'Aligarh',
      'Agra',
      'Bareilly',
      'Gorakhpur',
      'Jhansi',
      'Kanpur',
      'Lucknow',
      'Meerut',
      'Moradabad',
      'Muzaffarnagar',
      'Saharanpur',
    ];

    for (const d of upDistricts) {
      const res = searchCities(d, 5);
      expect(res.length, `Expected to find UP district ${d}`).toBeGreaterThan(0);
      const top = res[0];
      expect(top.country).toBe('India');
      expect(top.timezone).toBe('Asia/Kolkata');
    }
  });

  it('resolves pilgrimage and interstate locations accurately', () => {
    const pilgrimLocs = [
      'Kedarnath',
      'Badrinath',
      'Ujjain',
      'Shirdi',
      'Tirupati',
      'Puri',
      'Singrauli',
      'Patna',
      'Gaya',
      'Rishikesh',
      'Haridwar',
      'Kurukshetra',
    ];

    for (const loc of pilgrimLocs) {
      const res = searchCities(loc, 5);
      expect(res.length, `Expected to find location ${loc}`).toBeGreaterThan(0);
      expect(res[0].country).toBe('India');
    }
  });
});
