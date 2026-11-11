/**
 * Time, timezone, coordinate, and angle formatting utilities.
 */

export function normalizeDeg(deg: number): number {
  const m = deg % 360;
  return m < 0 ? m + 360 : m;
}

export function angularDiffDeg(a: number, b: number): number {
  let d = Math.abs(normalizeDeg(a) - normalizeDeg(b));
  if (d > 180) d = 360 - d;
  return d;
}

export function formatDms(deg: number, includeSeconds = true): string {
  const norm = normalizeDeg(deg);
  let d = Math.floor(norm);
  const remMin = (norm - d) * 60;
  let m = Math.floor(remMin);
  let s = Math.round((remMin - m) * 60);
  if (s >= 60) {
    s -= 60;
    m += 1;
  }
  if (m >= 60) {
    m -= 60;
    d += 1;
  }
  const dd = String(d).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return includeSeconds ? `${dd}°${mm}'${ss}"` : `${dd}°${mm}'`;
}

export function formatSignedDms(deg: number): string {
  const sign = deg < 0 ? '-' : '';
  const abs = Math.abs(deg);
  let d = Math.floor(abs);
  const remMin = (abs - d) * 60;
  let m = Math.floor(remMin);
  let s = Math.round((remMin - m) * 60);
  if (s >= 60) {
    s -= 60;
    m += 1;
  }
  if (m >= 60) {
    m -= 60;
    d += 1;
  }
  return `${sign}${d}°${String(m).padStart(2, '0')}'${String(s).padStart(2, '0')}"`;
}

export function formatOffsetString(offsetMinutes: number): string {
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const abs = Math.abs(Math.round(offsetMinutes));
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');
  return `${sign}${hh}:${mm}`;
}

export function parseOffsetString(str: string): number | null {
  const match = str.trim().match(/^([+-])?(\d{1,2})(?::?(\d{2}))?$/);
  if (!match) return null;
  const sign = match[1] === '-' ? -1 : 1;
  const hrs = parseInt(match[2], 10);
  const mins = match[3] ? parseInt(match[3], 10) : 0;
  if (hrs > 14 || mins >= 60) return null;
  return sign * (hrs * 60 + mins);
}

function makeUtcMs(year: number, month: number, day: number, hour: number, minute: number, second: number): number {
  const d = new Date(0);
  d.setUTCFullYear(year, month - 1, day);
  d.setUTCHours(hour, minute, second, 0);
  return d.getTime();
}

function getZonePartsMs(utcMs: number, timeZone: string): number | null {
  try {
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    });
    const parts = fmt.formatToParts(new Date(utcMs));
    const map: Record<string, number> = {};
    for (const p of parts) {
      if (p.type !== 'literal') {
        map[p.type] = parseInt(p.value, 10);
      }
    }
    if (map.hour === 24) map.hour = 0;
    return makeUtcMs(map.year, map.month, map.day, map.hour, map.minute, map.second);
  } catch {
    return null;
  }
}

/**
 * Converts local wall-clock date/time + IANA timezone (or manual UTC offset) to UTC epoch ms
 * and returns the effective timezone offset in minutes (e.g., +330 for IST).
 */
export function resolveUtcFromBirth(
  dateStr: string,
  timeStr: string,
  timezone: string,
  manualOffsetMinutes?: number
): { utcMs: number; offsetMinutes: number } {
  const [yStr, mStr, dStr] = dateStr.split('-');
  const [hhStr = '12', mmStr = '00', ssStr = '00'] = timeStr.split(':');
  const year = parseInt(yStr, 10) || 2000;
  const month = parseInt(mStr, 10) || 1;
  const day = parseInt(dStr, 10) || 1;
  const hour = parseInt(hhStr, 10) || 0;
  const minute = parseInt(mmStr, 10) || 0;
  const second = parseInt(ssStr, 10) || 0;

  const targetWallMs = makeUtcMs(year, month, day, hour, minute, second);

  if (timezone === 'MANUAL' || !timezone) {
    const offsetMin = manualOffsetMinutes ?? 0;
    return { utcMs: targetWallMs - offsetMin * 60_000, offsetMinutes: offsetMin };
  }

  // Two-pass fixed-point conversion handles DST and historical sub-minute LMT offsets cleanly
  let guessUtcMs = targetWallMs - (manualOffsetMinutes ?? 0) * 60_000;
  for (let i = 0; i < 3; i++) {
    const wallAtGuess = getZonePartsMs(guessUtcMs, timezone);
    if (wallAtGuess === null) {
      const fallback = manualOffsetMinutes ?? 0;
      return { utcMs: targetWallMs - fallback * 60_000, offsetMinutes: fallback };
    }
    const offsetMs = wallAtGuess - guessUtcMs;
    const nextUtcMs = targetWallMs - offsetMs;
    if (Math.abs(nextUtcMs - guessUtcMs) < 1) {
      guessUtcMs = nextUtcMs;
      break;
    }
    guessUtcMs = nextUtcMs;
  }

  const finalWall = getZonePartsMs(guessUtcMs, timezone);
  const offsetMinutes =
    finalWall !== null ? Math.round((finalWall - guessUtcMs) / 60_000 * 100) / 100 : (manualOffsetMinutes ?? 0);

  return { utcMs: guessUtcMs, offsetMinutes };
}

export function getIanaOffsetMinutes(dateStr: string, timeStr: string, timezone: string): number {
  return resolveUtcFromBirth(dateStr, timeStr, timezone).offsetMinutes;
}

export function formatLocalTimeFromUtc(utcMs: number | null, offsetMinutes: number, withSeconds = true): string {
  if (utcMs === null || Number.isNaN(utcMs)) return '--:--';
  const local = new Date(utcMs + offsetMinutes * 60_000);
  const hh = String(local.getUTCHours()).padStart(2, '0');
  const mm = String(local.getUTCMinutes()).padStart(2, '0');
  const ss = String(local.getUTCSeconds()).padStart(2, '0');
  return withSeconds ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`;
}

export function formatLocalDateTimeFromUtc(utcMs: number, offsetMinutes: number): string {
  const local = new Date(utcMs + offsetMinutes * 60_000);
  const y = local.getUTCFullYear();
  const m = String(local.getUTCMonth() + 1).padStart(2, '0');
  const d = String(local.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d} ${formatLocalTimeFromUtc(utcMs, offsetMinutes, false)}`;
}

export function julianDayFromJ2000Days(daysSinceJ2000: number): number {
  return 2451545.0 + daysSinceJ2000;
}

export function formatDurationMs(ms: number): string {
  const totalSec = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
}

/**
 * Formats any YYYY-MM-DD (or YYYY-MM-DD HH:MM) string into DD-MM-YYYY display format.
 */
export function formatDateDmy(value: string | null | undefined): string {
  if (!value) return '';
  const trimmed = value.trim();
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})(.*)$/.exec(trimmed);
  if (isoMatch) {
    const [, y, m, d, rest] = isoMatch;
    return `${d}-${m}-${y}${rest}`;
  }
  return trimmed;
}

/**
 * Parses DD-MM-YYYY (or DD/MM/YYYY or YYYY-MM-DD) to canonical YYYY-MM-DD if valid.
 */
export function parseDateInputToIso(raw: string): string | null {
  const trimmed = raw.trim();
  let y = 0;
  let m = 0;
  let d = 0;

  const dmy = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/.exec(trimmed);
  if (dmy) {
    d = parseInt(dmy[1], 10);
    m = parseInt(dmy[2], 10);
    y = parseInt(dmy[3], 10);
  } else {
    const iso = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/.exec(trimmed);
    if (!iso) return null;
    y = parseInt(iso[1], 10);
    m = parseInt(iso[2], 10);
    d = parseInt(iso[3], 10);
  }

  if (y < 100 || y > 9999 || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const probe = new Date(Date.UTC(y, m - 1, d));
  if (
    probe.getUTCFullYear() !== y ||
    probe.getUTCMonth() !== m - 1 ||
    probe.getUTCDate() !== d
  ) {
    return null;
  }
  return `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
