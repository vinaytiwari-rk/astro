import type { BirthInput } from './types';
import { parseDateInputToIso, resolveUtcFromBirth } from './time';

export type BirthInputIssue = 'date' | 'time' | 'location' | 'coordinates' | 'timezone' | 'offset';

export interface BirthTimeConfirmation {
  offsetMinutes: number;
  utcDateTime: string;
}

export function validateBirthInput(
  input: BirthInput,
  manualOffsetMinutes?: number
): BirthInputIssue | null {
  if (!input.date || parseDateInputToIso(input.date) !== input.date) return 'date';
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(input.time)) return 'time';
  if (!input.city.trim()) return 'location';
  if (
    !Number.isFinite(input.latitude) || input.latitude < -90 || input.latitude > 90 ||
    !Number.isFinite(input.longitude) || input.longitude < -180 || input.longitude > 180
  ) return 'coordinates';

  if (input.timezone === 'MANUAL') {
    if (
      !Number.isInteger(manualOffsetMinutes) ||
      manualOffsetMinutes! < -840 ||
      manualOffsetMinutes! > 840
    ) return 'offset';
  } else if (!input.timezone.trim()) {
    return 'timezone';
  }

  try {
    resolveUtcFromBirth(input.date, input.time, input.timezone, manualOffsetMinutes);
  } catch {
    return 'timezone';
  }
  return null;
}

export function getBirthTimeConfirmation(
  input: BirthInput,
  manualOffsetMinutes?: number
): BirthTimeConfirmation | null {
  if (validateBirthInput(input, manualOffsetMinutes) !== null) return null;
  try {
    const resolved = resolveUtcFromBirth(
      input.date,
      input.time,
      input.timezone,
      manualOffsetMinutes
    );
    return {
      offsetMinutes: resolved.offsetMinutes,
      utcDateTime: `${new Date(resolved.utcMs).toISOString().slice(0, 19).replace('T', ' ')} UTC`,
    };
  } catch {
    return null;
  }
}
