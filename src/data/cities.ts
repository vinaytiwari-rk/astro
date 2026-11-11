import rawCities from 'city-timezones/data/cityMap.json';
import tzlookup from 'tz-lookup';
import type { BirthInput, CalcSettings } from '../astro/types';

export interface CityEntry {
  city: string;
  cityAscii: string;
  province: string;
  country: string;
  lat: number;
  lng: number;
  pop: number;
  timezone: string;
  source?: 'core' | 'atlas' | 'online';
}

const ESSENTIAL_INDIAN_CITIES: CityEntry[] = [
  { city: 'New Delhi', cityAscii: 'New Delhi', province: 'Delhi', country: 'India', lat: 28.6139, lng: 77.2090, pop: 32900000, timezone: 'Asia/Kolkata', source: 'core' },
  { city: 'Mumbai', cityAscii: 'Mumbai', province: 'Maharashtra', country: 'India', lat: 19.0760, lng: 72.8777, pop: 21200000, timezone: 'Asia/Kolkata', source: 'core' },
  { city: 'Kolkata', cityAscii: 'Kolkata', province: 'West Bengal', country: 'India', lat: 22.5726, lng: 88.3639, pop: 15300000, timezone: 'Asia/Kolkata', source: 'core' },
  { city: 'Bengaluru', cityAscii: 'Bengaluru', province: 'Karnataka', country: 'India', lat: 12.9716, lng: 77.5946, pop: 13600000, timezone: 'Asia/Kolkata', source: 'core' },
  { city: 'Chennai', cityAscii: 'Chennai', province: 'Tamil Nadu', country: 'India', lat: 13.0827, lng: 80.2707, pop: 11900000, timezone: 'Asia/Kolkata', source: 'core' },
  { city: 'Hyderabad', cityAscii: 'Hyderabad', province: 'Telangana', country: 'India', lat: 17.3850, lng: 78.4867, pop: 10800000, timezone: 'Asia/Kolkata', source: 'core' },
  { city: 'Ahmedabad', cityAscii: 'Ahmedabad', province: 'Gujarat', country: 'India', lat: 23.0225, lng: 72.5714, pop: 8600000, timezone: 'Asia/Kolkata', source: 'core' },
  { city: 'Pune', cityAscii: 'Pune', province: 'Maharashtra', country: 'India', lat: 18.5204, lng: 73.8567, pop: 7100000, timezone: 'Asia/Kolkata', source: 'core' },
  { city: 'Jaipur', cityAscii: 'Jaipur', province: 'Rajasthan', country: 'India', lat: 26.9124, lng: 75.7873, pop: 4200000, timezone: 'Asia/Kolkata', source: 'core' },
  { city: 'Varanasi', cityAscii: 'Varanasi', province: 'Uttar Pradesh', country: 'India', lat: 25.3176, lng: 82.9739, pop: 1700000, timezone: 'Asia/Kolkata', source: 'core' },
  { city: 'Ujjain', cityAscii: 'Ujjain', province: 'Madhya Pradesh', country: 'India', lat: 23.1765, lng: 75.7885, pop: 580000, timezone: 'Asia/Kolkata', source: 'core' },
  { city: 'Mathura', cityAscii: 'Mathura', province: 'Uttar Pradesh', country: 'India', lat: 27.4924, lng: 77.6737, pop: 450000, timezone: 'Asia/Kolkata', source: 'core' },
  { city: 'Haridwar', cityAscii: 'Haridwar', province: 'Uttarakhand', country: 'India', lat: 29.9457, lng: 78.1642, pop: 320000, timezone: 'Asia/Kolkata', source: 'core' },
  { city: 'Ayodhya', cityAscii: 'Ayodhya', province: 'Uttar Pradesh', country: 'India', lat: 26.7922, lng: 82.1998, pop: 250000, timezone: 'Asia/Kolkata', source: 'core' },
  { city: 'Puri', cityAscii: 'Puri', province: 'Odisha', country: 'India', lat: 19.8135, lng: 85.8312, pop: 220000, timezone: 'Asia/Kolkata', source: 'core' },
  { city: 'Tirupati', cityAscii: 'Tirupati', province: 'Andhra Pradesh', country: 'India', lat: 13.6288, lng: 79.4192, pop: 460000, timezone: 'Asia/Kolkata', source: 'core' },
  { city: 'Vrindavan', cityAscii: 'Vrindavan', province: 'Uttar Pradesh', country: 'India', lat: 27.5811, lng: 77.6966, pop: 120000, timezone: 'Asia/Kolkata', source: 'core' },
  { city: 'Rishikesh', cityAscii: 'Rishikesh', province: 'Uttarakhand', country: 'India', lat: 30.0869, lng: 78.2676, pop: 110000, timezone: 'Asia/Kolkata', source: 'core' },
];

interface RawCity {
  city: string;
  city_ascii: string;
  lat: number;
  lng: number;
  pop: number;
  country: string;
  province: string;
  timezone: string;
}

interface IndexedCity {
  city: string;
  cityAscii: string;
  province: string;
  provLow: string;
  country: string;
  countryAliases: string;
  lat: number;
  lng: number;
  pop: number;
  timezone?: string;
  nameLow: string;
  asciiLow: string;
  source: 'core' | 'atlas';
}

export function stripDiacritics(input: string): string {
  for (let i = 0; i < input.length; i++) {
    if (input.charCodeAt(i) > 127) {
      return input.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }
  }
  return input.toLowerCase();
}

export function lookupTimezoneFromCoords(lat: number, lng: number): string {
  try {
    const clampedLat = Math.max(-89.99, Math.min(89.99, Number.isFinite(lat) ? lat : 0));
    const clampedLng = Math.max(-180, Math.min(180, Number.isFinite(lng) ? lng : 0));
    return tzlookup(clampedLat, clampedLng) || 'UTC';
  } catch {
    return 'UTC';
  }
}

const COUNTRY_ALIASES: Record<string, string> = {
  US: 'usa america united states',
  GB: 'uk england britain scotland wales united kingdom',
  AE: 'uae emirates dubai abu dhabi',
  SA: 'ksa saudi',
  IN: 'bharat hindustan india',
  NP: 'nepal',
  LK: 'sri lanka ceylon',
  BD: 'bangladesh',
  PK: 'pakistan',
  XK: 'kosovo',
};

let regionEn: Intl.DisplayNames | null = null;
let regionHi: Intl.DisplayNames | null = null;
try {
  regionEn = new Intl.DisplayNames(['en'], { type: 'region' });
  regionHi = new Intl.DisplayNames(['hi'], { type: 'region' });
} catch {
  // Older runtimes fallback to ISO codes
}

const countryDisplayCache = new Map<string, { en: string; hi: string; alias: string }>();

function resolveCountryMeta(isoCode: string): { en: string; hi: string; alias: string } {
  const cached = countryDisplayCache.get(isoCode);
  if (cached) return cached;
  const en = (isoCode === 'XK' ? 'Kosovo' : regionEn?.of(isoCode)) || isoCode;
  const hi = (isoCode === 'XK' ? 'कोसोवो' : regionHi?.of(isoCode)) || en;
  const extra = COUNTRY_ALIASES[isoCode] || '';
  const meta = {
    en,
    hi,
    alias: `${stripDiacritics(en)} ${hi.toLowerCase()} ${isoCode.toLowerCase()} ${extra}`.trim(),
  };
  countryDisplayCache.set(isoCode, meta);
  return meta;
}

let cachedCoreList: CityEntry[] | null = null;
let cachedCoreIndexed: IndexedCity[] | null = null;

function buildCore(): { list: CityEntry[]; indexed: IndexedCity[] } {
  if (cachedCoreList && cachedCoreIndexed) {
    return { list: cachedCoreList, indexed: cachedCoreIndexed };
  }
  const seen = new Set<string>();
  const list: CityEntry[] = [];

  for (const c of ESSENTIAL_INDIAN_CITIES) {
    const key = `${c.city.toLowerCase()}|${c.country.toLowerCase()}`;
    seen.add(key);
    list.push(c);
  }

  for (const r of rawCities as RawCity[]) {
    if (!r.timezone || !r.city) continue;
    const key = `${r.city.toLowerCase()}|${(r.country || '').toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    list.push({
      city: r.city,
      cityAscii: r.city_ascii || r.city,
      province: r.province || '',
      country: r.country || '',
      lat: r.lat,
      lng: r.lng,
      pop: r.pop || 0,
      timezone: r.timezone,
      source: 'core',
    });
  }

  list.sort((a, b) => b.pop - a.pop);

  const indexed: IndexedCity[] = list.map((entry) => {
    const nameLow = stripDiacritics(entry.city);
    const asciiLow = stripDiacritics(entry.cityAscii || entry.city);
    const provLow = stripDiacritics(entry.province);
    const cLow = stripDiacritics(entry.country);
    return {
      city: entry.city,
      cityAscii: entry.cityAscii,
      province: entry.province,
      provLow,
      country: entry.country,
      countryAliases: cLow,
      lat: entry.lat,
      lng: entry.lng,
      pop: entry.pop,
      timezone: entry.timezone,
      nameLow,
      asciiLow,
      source: 'core',
    };
  });

  cachedCoreList = list;
  cachedCoreIndexed = indexed;
  return { list, indexed };
}

export function getCityDatabase(): CityEntry[] {
  return buildCore().list;
}

interface CompactAtlasPayload {
  admin1: Record<string, string>;
  cities: Array<[string, number, number, string, string]>;
}

let expandedAtlasCache: IndexedCity[] | null = null;
let expandedAtlasPromise: Promise<IndexedCity[]> | null = null;

export async function preloadExpandedAtlas(): Promise<void> {
  await loadExpandedAtlas();
}

async function fetchCompactAtlasPayload(): Promise<CompactAtlasPayload | null> {
  if (typeof window !== 'undefined' && typeof fetch === 'function') {
    try {
      const baseUrl = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL || '/';
      const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      const res = await fetch(`${cleanBase}data/world-cities.json`);
      if (res.ok) {
        return (await res.json()) as CompactAtlasPayload;
      }
    } catch {
      // Fall back to empty / node loader
    }
    return null;
  }

  try {
    const fsSpec = 'node:fs/promises';
    const pathSpec = 'node:path';
    const urlSpec = 'node:url';
    const fs = await import(/* @vite-ignore */ fsSpec);
    const path = await import(/* @vite-ignore */ pathSpec);
    const url = await import(/* @vite-ignore */ urlSpec);
    const here = path.dirname(url.fileURLToPath(import.meta.url));
    const jsonPath = path.resolve(here, '../../public/data/world-cities.json');
    const raw = await fs.readFile(jsonPath, 'utf8');
    return JSON.parse(raw) as CompactAtlasPayload;
  } catch {
    return null;
  }
}

async function loadExpandedAtlas(): Promise<IndexedCity[]> {
  if (expandedAtlasCache) return expandedAtlasCache;
  if (!expandedAtlasPromise) {
    expandedAtlasPromise = (async () => {
      try {
        const payload = await fetchCompactAtlasPayload();
        if (!payload || !Array.isArray(payload.cities)) {
          expandedAtlasPromise = null;
          return [];
        }

        const admin1NormMap = new Map<string, { name: string; norm: string }>();
        for (const [code, name] of Object.entries(payload.admin1 || {})) {
          admin1NormMap.set(code, { name, norm: stripDiacritics(name) });
        }

        const rawList = payload.cities;
        const atlas: IndexedCity[] = new Array(rawList.length);
        let count = 0;

        for (let i = 0; i < rawList.length; i++) {
          const row = rawList[i];
          if (!row) continue;
          const [name, lat, lng, cc, a1] = row;
          if (!name || !Number.isFinite(lat) || !Number.isFinite(lng)) continue;

          const cMeta = resolveCountryMeta(cc || '');
          const adm = a1 ? admin1NormMap.get(`${cc}.${a1}`) : undefined;
          const nameLow = stripDiacritics(name);

          atlas[count++] = {
            city: name,
            cityAscii: nameLow,
            province: adm ? adm.name : '',
            provLow: adm ? adm.norm : '',
            country: cMeta.en,
            countryAliases: cMeta.alias,
            lat,
            lng,
            pop: 1500,
            nameLow,
            asciiLow: nameLow,
            source: 'atlas',
          };
        }

        atlas.length = count;
        expandedAtlasCache = atlas;
        return atlas;
      } catch {
        expandedAtlasPromise = null;
        return [];
      }
    })();
  }
  return expandedAtlasPromise;
}

function scoreIndexedCity(
  item: IndexedCity,
  qNorm: string,
  tokens: string[],
  primaryToken: string
): number | null {
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (
      !item.nameLow.includes(t) &&
      !item.asciiLow.includes(t) &&
      !item.provLow.includes(t) &&
      !item.countryAliases.includes(t)
    ) {
      return null;
    }
  }

  let score = item.source === 'core' ? Math.log10(Math.max(10, item.pop)) + 4 : 1;
  const cLow = item.nameLow;
  const aLow = item.asciiLow;

  if (cLow === qNorm || aLow === qNorm || cLow === primaryToken) {
    score += 140;
  } else if (cLow.startsWith(primaryToken) || aLow.startsWith(primaryToken)) {
    score += 65;
  } else if (cLow.includes(` ${primaryToken}`) || aLow.includes(` ${primaryToken}`)) {
    score += 36;
  } else if (cLow.includes(primaryToken) || aLow.includes(primaryToken)) {
    score += 18;
  }

  if (item.countryAliases.includes('india')) {
    score += 1.5;
  }

  return score;
}

function materializeCity(item: IndexedCity): CityEntry {
  const tz = item.timezone || lookupTimezoneFromCoords(item.lat, item.lng);
  return {
    city: item.city,
    cityAscii: item.cityAscii,
    province: item.province,
    country: item.country,
    lat: item.lat,
    lng: item.lng,
    pop: item.pop,
    timezone: tz,
    source: item.source,
  };
}

function sameCityCoords(a: { city: string; lat: number; lng: number }, b: { city: string; lat: number; lng: number }): boolean {
  if (Math.abs(a.lat - b.lat) > 0.16 || Math.abs(a.lng - b.lng) > 0.16) return false;
  return stripDiacritics(a.city) === stripDiacritics(b.city);
}

export function searchCities(query: string, limit = 30): CityEntry[] {
  const { list, indexed } = buildCore();
  const qNorm = stripDiacritics(query.replace(/,/g, ' ').trim());
  if (!qNorm) return list.slice(0, limit);

  const tokens = qNorm.split(/\s+/).filter(Boolean);
  const primary = tokens[0] || qNorm;
  const matches: Array<{ item: IndexedCity; score: number }> = [];

  for (let i = 0; i < indexed.length; i++) {
    const sc = scoreIndexedCity(indexed[i], qNorm, tokens, primary);
    if (sc !== null) {
      matches.push({ item: indexed[i], score: sc });
    }
  }

  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, limit).map((m) => materializeCity(m.item));
}

export async function searchCitiesExtended(query: string, limit = 30): Promise<CityEntry[]> {
  const qNorm = stripDiacritics(query.replace(/,/g, ' ').trim());
  const coreMatches = searchCities(query, limit);
  if (!qNorm || qNorm.length < 2) {
    return coreMatches;
  }

  const atlas = await loadExpandedAtlas();
  const { indexed: coreIndexed } = buildCore();

  const tokens = qNorm.split(/\s+/).filter(Boolean);
  const primary = tokens[0] || qNorm;
  const combined: Array<{ item: IndexedCity; score: number }> = [];

  for (let i = 0; i < coreIndexed.length; i++) {
    const sc = scoreIndexedCity(coreIndexed[i], qNorm, tokens, primary);
    if (sc !== null) combined.push({ item: coreIndexed[i], score: sc });
  }

  for (let i = 0; i < atlas.length; i++) {
    const sc = scoreIndexedCity(atlas[i], qNorm, tokens, primary);
    if (sc !== null) combined.push({ item: atlas[i], score: sc });
  }

  combined.sort((a, b) => b.score - a.score);

  const deduped: CityEntry[] = [];
  for (let i = 0; i < combined.length && deduped.length < limit; i++) {
    const cand = combined[i].item;
    if (deduped.some((existing) => sameCityCoords(existing, cand))) continue;
    deduped.push(materializeCity(cand));
  }

  return deduped;
}

interface OpenMeteoGeoResult {
  name?: string;
  latitude?: number;
  longitude?: number;
  country?: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
  population?: number;
}

export async function searchPlacesOnline(
  query: string,
  lang: 'en' | 'hi' = 'en',
  limit = 15,
  signal?: AbortSignal
): Promise<CityEntry[]> {
  const raw = query.trim();
  if (raw.length < 3) return [];

  const commaParts = raw
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  const primaryQuery = commaParts[0] || raw;
  const filterTokens = commaParts
    .slice(1)
    .join(' ')
    .split(/\s+/)
    .map((t) => stripDiacritics(t))
    .filter(Boolean);

  const fetchOpenMeteo = async (nameQuery: string): Promise<OpenMeteoGeoResult[]> => {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      nameQuery
    )}&count=${Math.min(limit + 8, 25)}&language=${lang === 'hi' ? 'hi' : 'en'}&format=json`;
    const res = await fetch(url, { signal });
    if (!res.ok) return [];
    const data = (await res.json()) as { results?: OpenMeteoGeoResult[] };
    return Array.isArray(data.results) ? data.results : [];
  };

  try {
    let rawResults = await fetchOpenMeteo(primaryQuery);

    let extraTokens = filterTokens;
    if (rawResults.length === 0 && primaryQuery.includes(' ')) {
      const spaceTokens = primaryQuery.split(/\s+/).filter(Boolean);
      if (spaceTokens.length >= 2) {
        rawResults = await fetchOpenMeteo(spaceTokens[0]);
        extraTokens = spaceTokens.slice(1).map((t) => stripDiacritics(t));
      }
    }

    const mapped: CityEntry[] = [];
    for (const r of rawResults) {
      if (!r.name || typeof r.latitude !== 'number' || typeof r.longitude !== 'number') continue;
      const province =
        r.admin2 && r.admin1 && r.admin2 !== r.admin1
          ? `${r.admin1} · ${r.admin2}`
          : r.admin1 || r.admin2 || '';
      const country = r.country || '';
      const entry: CityEntry = {
        city: r.name,
        cityAscii: stripDiacritics(r.name),
        province,
        country,
        lat: r.latitude,
        lng: r.longitude,
        pop: r.population || 0,
        timezone: r.timezone || lookupTimezoneFromCoords(r.latitude, r.longitude),
        source: 'online',
      };
      mapped.push(entry);
    }

    if (extraTokens.length > 0) {
      const filtered = mapped.filter((m) => {
        const hay = `${stripDiacritics(m.city)} ${stripDiacritics(m.province)} ${stripDiacritics(m.country)}`;
        return extraTokens.every((t) => hay.includes(t));
      });
      if (filtered.length > 0) return filtered.slice(0, limit);
    }

    return mapped.slice(0, limit);
  } catch {
    return [];
  }
}

export function mergeCityResults(
  local: CityEntry[],
  online: CityEntry[],
  limit = 30
): CityEntry[] {
  const merged: CityEntry[] = [];
  for (const item of local) {
    if (merged.length >= limit) break;
    if (!merged.some((m) => sameCityCoords(m, item))) {
      merged.push(item);
    }
  }
  for (const item of online) {
    if (merged.length >= limit) break;
    if (!merged.some((m) => sameCityCoords(m, item))) {
      merged.push(item);
    }
  }
  return merged;
}

export const DEFAULT_SETTINGS: CalcSettings = {
  ayanamsa: 'lahiri',
  nodeMode: 'mean',
  houseSystem: 'whole_sign',
  chartStyle: 'north',
  dashaYearType: 'tropical',
  includeOuterPlanets: false,
  karakaCount: 7,
  horaMode: 'parashara',
};

export function createNowPrashnaInput(): BirthInput {
  const now = new Date();
  const istOffset = 330; // Default to New Delhi IST for quick Prashna, or browser local
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
  const pad = (n: number) => String(n).padStart(2, '0');
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  return {
    id: 'sample-prashna',
    name: 'Current Moment (Prashna)',
    gender: 'other',
    date,
    time,
    timezone: tz,
    utcOffsetMinutes: -now.getTimezoneOffset() || istOffset,
    city: 'New Delhi',
    country: 'India',
    latitude: 28.6139,
    longitude: 77.209,
    notes: 'Live Prashna chart computed for current system time.',
  };
}

export const SAMPLE_CHARTS: BirthInput[] = [
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
    notes: 'Classic benchmark Vedic chart: Dhanu Lagna, Sun at 29° Dhanu, Moon in Hasta (Kanya).',
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
    notes: 'Mithuna Lagna, Budhaditya Yoga in Meena (10th house).',
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
    notes: 'Meena Lagna, Exalted Sun and Mercury in Aries, Exalted Jupiter in Cancer.',
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
    notes: 'Modern sample natal chart for New Delhi.',
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
    notes: 'Modern living sample partner profile for predictions and compatibility matching.',
  },
];
