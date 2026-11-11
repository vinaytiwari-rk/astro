import * as Astronomy from 'astronomy-engine';
import { SIGNS } from './constants';
import { computeAscendantAndMcTropical, computeAyanamsaDeg, getTropicalPosition } from './ephemeris';
import { formatDms, formatLocalTimeFromUtc, normalizeDeg, resolveUtcFromBirth } from './time';
import type { BirthInput, CalcSettings } from './types';
import { computeKpSubLord, getDivisionalSignIndex } from './vargas';

export interface BtrSnapshot {
  rectifiedDate: string;
  rectifiedTime: string;
  d1LagnaSign: string;
  d1LagnaDms: string;
  d9LagnaSign: string;
  d10LagnaSign: string;
  d60LagnaSign: string;
  kpAscSubLord: string;
  kpMcSubLord: string;
  pranapadaSign: string;
  pranapadaDms: string;
  pranapadaAligned: boolean;
  kundaSign: string;
  kundaAligned: boolean;
  alignmentNote: string;
}

export function computeBtrSnapshot(
  baseInput: BirthInput,
  settings: CalcSettings,
  offsetSeconds: number
): BtrSnapshot {
  const { utcMs: baseUtcMs, offsetMinutes } = resolveUtcFromBirth(
    baseInput.date,
    baseInput.time,
    baseInput.timezone,
    baseInput.utcOffsetMinutes
  );

  const utcMs = baseUtcMs + offsetSeconds * 1000;
  const localD = new Date(utcMs + offsetMinutes * 60_000);
  const pad = (n: number) => String(n).padStart(2, '0');
  const rectifiedDate = `${localD.getUTCFullYear()}-${pad(localD.getUTCMonth() + 1)}-${pad(localD.getUTCDate())}`;
  const rectifiedTime = formatLocalTimeFromUtc(utcMs, offsetMinutes, true);

  const time = new Astronomy.AstroTime(new Date(utcMs));
  const ayan = computeAyanamsaDeg(time, settings.ayanamsa);
  const { asc, mc } = computeAscendantAndMcTropical(time, baseInput.latitude, baseInput.longitude);
  const ascSid = normalizeDeg(asc - ayan);
  const mcSid = normalizeDeg(mc - ayan);

  const d1Idx = Math.floor(ascSid / 30) % 12;
  const d9Idx = getDivisionalSignIndex(ascSid, 'D9', settings.horaMode);
  const d10Idx = getDivisionalSignIndex(ascSid, 'D10', settings.horaMode);
  const d60Idx = getDivisionalSignIndex(ascSid, 'D60', settings.horaMode);

  const kpAscSubLord = computeKpSubLord(ascSid);
  const kpMcSubLord = computeKpSubLord(mcSid);

  // Pranapada Lagna (BPHS Ch. 3): Vighatis since sunrise / 15 * 30° added to Sun (movable) / 9th from Sun (fixed) / 5th from Sun (dual)
  const observer = new Astronomy.Observer(baseInput.latitude, baseInput.longitude, 0);
  const localMidnightUtcMs =
    Date.UTC(localD.getUTCFullYear(), localD.getUTCMonth(), localD.getUTCDate()) -
    offsetMinutes * 60_000;
  let sr = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, new Date(localMidnightUtcMs), 1.2);
  if (sr && sr.date.getTime() > utcMs) {
    sr = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, new Date(localMidnightUtcMs - 86_400_000), 1.2);
  }
  const srMs = sr ? sr.date.getTime() : localMidnightUtcMs + 6 * 3600_000;
  const elapsedMin = Math.max(0, (utcMs - srMs) / 60_000);
  const vighatis = elapsedMin * 2.5; // 1 min = 2.5 vighatis

  const sunLon = normalizeDeg(getTropicalPosition('Sun', time, settings.nodeMode).lon - ayan);
  const sunSign = Math.floor(sunLon / 30) % 12;
  const sunMod = sunSign % 3; // 0=Movable, 1=Fixed, 2=Dual
  const baseSunLon =
    sunMod === 0 ? sunLon : sunMod === 1 ? normalizeDeg(sunLon + 240) : normalizeDeg(sunLon + 120);
  const pranapadaLon = normalizeDeg(baseSunLon + vighatis * 2); // 15 vighatis = 30° => 2° per vighati
  const ppIdx = Math.floor(pranapadaLon / 30) % 12;

  const moonLon = normalizeDeg(getTropicalPosition('Moon', time, settings.nodeMode).lon - ayan);
  const moonIdx = Math.floor(moonLon / 30) % 12;

  const distPpLagna = ((ppIdx - d1Idx + 12) % 12) + 1;
  const distPpMoon = ((ppIdx - moonIdx + 12) % 12) + 1;
  const pranapadaAligned = [1, 5, 9].includes(distPpLagna) || [1, 5, 9].includes(distPpMoon);

  // Kunda Lagna = (Asc * 81) % 360 -> ideally in trine (1, 5, 9) to Moon or Ascendant
  const kundaLon = normalizeDeg(ascSid * 81);
  const kundaIdx = Math.floor(kundaLon / 30) % 12;
  const kundaDist = ((kundaIdx - moonIdx + 12) % 12) + 1;
  const kundaAligned = [1, 5, 9].includes(kundaDist);

  const alignmentNote =
    pranapadaAligned && kundaAligned
      ? 'Strong BPHS BTR alignment: both Pranapada and Kunda sit in classical 1/5/9 trines!'
      : pranapadaAligned
        ? 'Pranapada sits in classical 1/5/9 trinal harmony with Lagna/Moon.'
        : kundaAligned
          ? 'Kunda Lagna aligns in trine with Natal Moon; check D9/D60 transitions.'
          : 'Nudge time slightly to verify D9/D10/D60 shifts against life events or Pranapada trines.';

  return {
    rectifiedDate,
    rectifiedTime,
    d1LagnaSign: SIGNS[d1Idx].name,
    d1LagnaDms: formatDms(ascSid % 30),
    d9LagnaSign: SIGNS[d9Idx].name,
    d10LagnaSign: SIGNS[d10Idx].name,
    d60LagnaSign: SIGNS[d60Idx].name,
    kpAscSubLord,
    kpMcSubLord,
    pranapadaSign: SIGNS[ppIdx].name,
    pranapadaDms: formatDms(pranapadaLon % 30, false),
    pranapadaAligned,
    kundaSign: SIGNS[kundaIdx].name,
    kundaAligned,
    alignmentNote,
  };
}
