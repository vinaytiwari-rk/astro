import { describe, it, expect } from 'vitest';
import { filterOutDisallowedProfiles, DEFAULT_USER_PROFILE } from '../../App';
import type { BirthInput } from '../types';

describe('Profile Management and Purging Tests', () => {
  it('permanently filters out all disallowed sample profiles', () => {
    const mixedProfiles: BirthInput[] = [
      {
        id: 'sample-vivekananda',
        name: 'Swami Vivekananda',
        gender: 'male',
        date: '1863-01-12',
        time: '06:33:00',
        timezone: 'Asia/Kolkata',
        city: 'Kolkata',
        country: 'India',
        latitude: 22.5726,
        longitude: 88.3639,
      },
      {
        id: 'sample-einstein',
        name: 'Albert Einstein',
        gender: 'male',
        date: '1879-03-14',
        time: '11:30:00',
        timezone: 'Europe/Berlin',
        city: 'Ulm',
        country: 'Germany',
        latitude: 48.4011,
        longitude: 9.9876,
      },
      {
        id: 'sample-tagore',
        name: 'Rabindranath Tagore',
        gender: 'male',
        date: '1861-05-07',
        time: '02:27:00',
        timezone: 'Asia/Kolkata',
        city: 'Kolkata',
        country: 'India',
        latitude: 22.5726,
        longitude: 88.3639,
      },
      {
        id: 'sample-partner-1998',
        name: 'Aarav Sharma (1998)',
        gender: 'male',
        date: '1998-08-22',
        time: '14:20:00',
        timezone: 'Asia/Kolkata',
        city: 'Mumbai',
        country: 'India',
        latitude: 19.076,
        longitude: 72.8777,
      },
      {
        id: 'sample-new-delhi-modern',
        name: 'Sample Native (2000)',
        gender: 'female',
        date: '2000-05-15',
        time: '08:15:00',
        timezone: 'Asia/Kolkata',
        city: 'New Delhi',
        country: 'India',
        latitude: 28.6139,
        longitude: 77.209,
      },
      {
        id: 'user-custom-001',
        name: 'विनय तिवारी (Vinay Tiwari)',
        gender: 'male',
        date: '1995-10-25',
        time: '09:45:00',
        timezone: 'Asia/Kolkata',
        city: 'Varanasi',
        country: 'India',
        latitude: 25.3176,
        longitude: 82.9739,
      },
      {
        id: 'user-custom-002',
        name: 'सुमन वर्मा (Suman Verma)',
        gender: 'female',
        date: '1998-04-12',
        time: '15:20:00',
        timezone: 'Asia/Kolkata',
        city: 'Jaipur',
        country: 'India',
        latitude: 26.9124,
        longitude: 75.7873,
      },
    ];

    const cleaned = filterOutDisallowedProfiles(mixedProfiles);

    expect(cleaned.length).toBe(2);
    expect(cleaned[0].name).toBe('विनय तिवारी (Vinay Tiwari)');
    expect(cleaned[1].name).toBe('सुमन वर्मा (Suman Verma)');
    expect(cleaned.some((p) => p.name.includes('Einstein'))).toBe(false);
    expect(cleaned.some((p) => p.name.includes('Vivekanand'))).toBe(false);
    expect(cleaned.some((p) => p.name.includes('Tagore'))).toBe(false);
    expect(cleaned.some((p) => p.name.includes('Aarav'))).toBe(false);
  });

  it('provides clean default profile when no user profiles exist', () => {
    expect(DEFAULT_USER_PROFILE.id).toBe('user-profile-default');
    expect(DEFAULT_USER_PROFILE.name).toBe('जातक');
    expect(DEFAULT_USER_PROFILE.date).toBe('2000-01-01');
    expect(DEFAULT_USER_PROFILE.city).toBe('New Delhi');
  });
});
