import type { BirthInput } from './types';

function jdToLocalDateAndTime(jd: number): { date: string; time: string } {
  const z = Math.floor(jd + 0.5);
  const f = jd + 0.5 - z;
  let a = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);
  const day = b - d - Math.floor(30.6001 * e);
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;
  let totalSec = Math.round(f * 86400);
  if (totalSec >= 86400) totalSec = 86399;
  const hh = Math.floor(totalSec / 3600);
  const mm = Math.floor((totalSec % 3600) / 60);
  const ss = totalSec % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    date: `${String(year).padStart(4, '0')}-${pad(month)}-${pad(day)}`,
    time: `${pad(hh)}:${pad(mm)}:${pad(ss)}`,
  };
}

function localDateTimeToJd(dateStr: string, timeStr: string): number {
  const [yS, mS, dS] = dateStr.split('-');
  const [hhS = '12', mmS = '0', ssS = '0'] = timeStr.split(':');
  let y = parseInt(yS, 10) || 2000;
  let m = parseInt(mS, 10) || 1;
  const d = parseInt(dS, 10) || 1;
  const hh = parseInt(hhS, 10) || 0;
  const mm = parseInt(mmS, 10) || 0;
  const ss = parseInt(ssS, 10) || 0;

  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const dayFrac = (hh + mm / 60 + ss / 3600) / 24;
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + dayFrac + b - 1524.5;
}

function getTag(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i'));
  return m ? m[1].trim() : '';
}

function escXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Parses a standard GeoVision `.xml` natal chart into AV Astro Vibe `BirthInput`.
 */
export function parseGeovisionChartXml(xmlContent: string, fallbackId?: string): BirthInput | null {
  const birthBlock = xmlContent.match(/<BirthInfo>([\s\S]*?)<\/BirthInfo>/i)?.[1];
  if (!birthBlock) return null;

  const first = getTag(birthBlock, 'FirstName');
  const last = getTag(birthBlock, 'LastName');
  const name = [first, last].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim() || 'Imported Native';

  const jd = parseFloat(getTag(birthBlock, 'BirthDate'));
  const rawLon = parseFloat(getTag(birthBlock, 'Longitude'));
  const rawLat = parseFloat(getTag(birthBlock, 'Latitude'));
  const rawTz = parseFloat(getTag(birthBlock, 'TimeZone'));
  const rawDst = parseFloat(getTag(birthBlock, 'DST')) || 0;

  if (Number.isNaN(jd) || Number.isNaN(rawLon) || Number.isNaN(rawLat) || Number.isNaN(rawTz)) {
    return null;
  }

  const { date, time } = jdToLocalDateAndTime(jd);
  const g = parseInt(getTag(birthBlock, 'Gender'), 10);
  const gender: BirthInput['gender'] = g === 1 ? 'female' : g === 0 ? 'male' : 'other';

  return {
    id: fallbackId || `xml-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name,
    gender,
    date,
    time,
    timezone: 'MANUAL',
    utcOffsetMinutes: Math.round((-rawTz + rawDst) * 60),
    city: getTag(birthBlock, 'City') || getTag(birthBlock, 'State') || 'Unknown',
    country: getTag(birthBlock, 'Country') || undefined,
    latitude: Math.round(rawLat * 10000) / 10000,
    longitude: Math.round(-rawLon * 10000) / 10000,
  };
}

/**
 * Serializes an AV Astro Vibe `BirthInput` into standard `.xml` chart format.
 */
export function serializeChartToGeovisionXml(input: BirthInput, offsetMinutesUsed: number): string {
  const parts = input.name.trim().split(/\s+/);
  const first = parts[0] || input.name;
  const last = parts.slice(1).join(' ');
  const genderCode = input.gender === 'female' ? 1 : input.gender === 'male' ? 0 : 2;
  const jd = localDateTimeToJd(input.date, input.time);
  const xmlLon = -input.longitude;
  const xmlTz = -(offsetMinutesUsed / 60);

  return `<!DOCTYPE BirthData>
<BirthData>
 <BirthInfo>
  <FirstName>${escXml(first)}</FirstName>
  <LastName>${escXml(last)}</LastName>
  <Gender>${genderCode}</Gender>
  <BirthDate>${jd.toFixed(6)}</BirthDate>
  <Longitude>${xmlLon.toFixed(6)}</Longitude>
  <Latitude>${input.latitude.toFixed(6)}</Latitude>
  <TimeZone>${xmlTz.toFixed(6)}</TimeZone>
  <DST>0.000000</DST>
  <City>${escXml(input.city)}</City>
  <Country>${escXml(input.country || '')}</Country>
 </BirthInfo>
 <DetailedNotes>${escXml(input.notes || '')}</DetailedNotes>
</BirthData>
`;
}
