import { describe, expect, it } from 'vitest';
import type { BirthInput } from '../types';
import { getBirthTimeConfirmation, validateBirthInput } from '../birthValidation';

const validBirth: BirthInput = {
  id: 'test',
  name: 'Test',
  date: '2024-07-15',
  time: '12:00:00',
  timezone: 'America/New_York',
  city: 'New York',
  country: 'United States',
  latitude: 40.7128,
  longitude: -74.006,
};

describe('birth input validation', () => {
  it('rejects impossible calendar dates', () => {
    expect(validateBirthInput({ ...validBirth, date: '2024-02-30' })).toBe('date');
  });

  it('rejects malformed or out-of-range birth times', () => {
    expect(validateBirthInput({ ...validBirth, time: '24:00:00' })).toBe('time');
  });

  it('rejects coordinates outside the globe', () => {
    expect(validateBirthInput({ ...validBirth, latitude: 91 })).toBe('coordinates');
  });

  it('rejects local times that do not exist during a daylight-saving transition', () => {
    expect(validateBirthInput({ ...validBirth, date: '2024-03-10', time: '02:30:00' })).toBe('timezone');
  });

  it('returns the resolved timezone offset and equivalent UTC time for review', () => {
    expect(validateBirthInput(validBirth)).toBeNull();
    expect(getBirthTimeConfirmation(validBirth)).toEqual({
      offsetMinutes: -240,
      utcDateTime: '2024-07-15 16:00:00 UTC',
    });
  });

  it('supports validated fixed-offset manual timezones', () => {
    const manualBirth = { ...validBirth, timezone: 'MANUAL' };
    expect(validateBirthInput(manualBirth, 330)).toBeNull();
    expect(getBirthTimeConfirmation(manualBirth, 330)).toEqual({
      offsetMinutes: 330,
      utcDateTime: '2024-07-15 06:30:00 UTC',
    });
    expect(validateBirthInput(manualBirth, 900)).toBe('offset');
  });
});
