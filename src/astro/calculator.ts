import * as Astronomy from 'astronomy-engine';
import { computeAshtakavarga } from './ashtakavarga';
import { SEVEN_PLANETS } from './constants';
import { computeVimshottariDasha, computeYoginiDasha } from './dasha';
import {
  buildBaseBodyPosition,
  computeAscendantAndMcTropical,
  computeAyanamsaDeg,
  computeHouses,
  computeSpecialPoints,
  computeSunriseSunsetForLocalDay,
  getPlanetIds,
  getTropicalPosition,
  getTropicalSpeedDegPerDay,
  isBodyCombust,
} from './ephemeris';
import { computePanchang } from './panchang';
import { computeAspects, computeShadbala } from './strength';
import { formatDms, julianDayFromJ2000Days, normalizeDeg, resolveUtcFromBirth } from './time';
import type {
  BirthInput,
  BodyPosition,
  CalcSettings,
  ChartData,
  SevenPlanetId,
} from './types';
import {
  assignCharaKarakas,
  buildAllDivisionalCharts,
  computeMaitriMatrix,
  computeVimshopakaShodash,
  evaluateDignity,
  getDivisionalSignIndex,
} from './vargas';
import { detectYogas } from './yogas';

export function calculateChart(input: BirthInput, settings: CalcSettings): ChartData {
  const { utcMs, offsetMinutes } = resolveUtcFromBirth(
    input.date,
    input.time,
    input.timezone,
    input.utcOffsetMinutes
  );

  const time = new Astronomy.AstroTime(new Date(utcMs));
  const julianDayUT = julianDayFromJ2000Days(time.ut);
  const julianDayTT = julianDayFromJ2000Days(time.tt);

  const ayanamsaDeg = computeAyanamsaDeg(time, settings.ayanamsa);
  const ayanamsaDms = formatDms(ayanamsaDeg);

  const ascMc = computeAscendantAndMcTropical(time, input.latitude, input.longitude);
  const ascSid = normalizeDeg(ascMc.asc - ayanamsaDeg);
  const mcSid = normalizeDeg(ascMc.mc - ayanamsaDeg);
  const houses = computeHouses(ascSid, mcSid, settings.houseSystem);
  const ascSignIndex = Math.floor(ascSid / 30) % 12;

  const ascD9 = getDivisionalSignIndex(ascSid, 'D9', settings.horaMode);
  const ascendant = buildBaseBodyPosition({
    id: 'Asc',
    siderealLon: ascSid,
    tropicalLon: ascMc.asc,
    latitude: 0,
    speedDegPerDay: 360,
    isCombust: false,
    isVargottama: ascSignIndex === ascD9,
    houses,
    houseSystem: settings.houseSystem,
    ascSignIndex,
  });

  const sunTrop = getTropicalPosition('Sun', time, settings.nodeMode);
  const sunSid = normalizeDeg(sunTrop.lon - ayanamsaDeg);

  const planetIds = getPlanetIds(settings.includeOuterPlanets);
  const planets: BodyPosition[] = planetIds.map((id) => {
    const pos = getTropicalPosition(id, time, settings.nodeMode);
    const sidLon = normalizeDeg(pos.lon - ayanamsaDeg);
    const speed = getTropicalSpeedDegPerDay(id, time, settings.nodeMode);
    const isRetro = id !== 'Sun' && id !== 'Moon' && speed < 0;
    const isCombust = isBodyCombust(id, sidLon, sunSid, isRetro);
    const d1Sign = Math.floor(sidLon / 30) % 12;
    const d9Sign = getDivisionalSignIndex(sidLon, 'D9', settings.horaMode);

    return buildBaseBodyPosition({
      id,
      siderealLon: sidLon,
      tropicalLon: pos.lon,
      latitude: pos.lat,
      speedDegPerDay: speed,
      isCombust,
      isVargottama: d1Sign === d9Sign,
      houses,
      houseSystem: settings.houseSystem,
      ascSignIndex,
    });
  });

  const rasiSignByPlanet = {} as Record<SevenPlanetId, number>;
  for (const p of planets) {
    if (SEVEN_PLANETS.includes(p.id as SevenPlanetId)) {
      rasiSignByPlanet[p.id as SevenPlanetId] = p.signIndex;
    }
  }
  const maitriMatrix = computeMaitriMatrix(rasiSignByPlanet);

  const karakaMap = assignCharaKarakas(planets, settings.karakaCount);
  for (const p of planets) {
    p.dignity = evaluateDignity(p.id, p.signIndex, p.degreeInSign, maitriMatrix);
    if (p.id !== 'Asc') {
      p.charaKaraka = karakaMap.get(p.id);
    }
  }

  const sunRiseSet = computeSunriseSunsetForLocalDay(
    utcMs,
    offsetMinutes,
    input.latitude,
    input.longitude
  );

  const moonPlanet = planets.find((p) => p.id === 'Moon')!;
  const { panchang, vedicDayIndex } = computePanchang({
    utcMs,
    offsetMinutes,
    sunSid,
    moonSid: moonPlanet.longitude,
    sunriseMs: sunRiseSet.sunriseMs,
    sunsetMs: sunRiseSet.sunsetMs,
    vedicSunriseMs: sunRiseSet.vedicSunriseMs,
    vedicSunsetMs: sunRiseSet.vedicSunsetMs,
    nextSunriseMs: sunRiseSet.nextSunriseMs,
    moonriseMs: sunRiseSet.moonriseMs,
    moonsetMs: sunRiseSet.moonsetMs,
  });

  const specialPoints = computeSpecialPoints({
    utcMs,
    vedicSunriseMs: sunRiseSet.vedicSunriseMs,
    vedicSunsetMs: sunRiseSet.vedicSunsetMs,
    nextSunriseMs: sunRiseSet.nextSunriseMs,
    ayanamsa: settings.ayanamsa,
    ayanamsaDeg,
    latitude: input.latitude,
    longitude: input.longitude,
    ascendant,
    planets,
    houses,
    houseSystem: settings.houseSystem,
    vedicDayIndex,
  });

  const divisionalCharts = buildAllDivisionalCharts(
    ascendant,
    planets,
    maitriMatrix,
    settings.horaMode
  );

  const vimshopakaShodash = computeVimshopakaShodash(divisionalCharts, maitriMatrix);
  const vimshottari = computeVimshottariDasha(
    moonPlanet.longitude,
    utcMs,
    settings.dashaYearType
  );
  const yogini = computeYoginiDasha(
    moonPlanet.longitude,
    utcMs,
    settings.dashaYearType
  );

  const ashtakavarga = computeAshtakavarga({
    ...rasiSignByPlanet,
    Asc: ascendant.signIndex,
  });

  const aspects = computeAspects(planets, ascendant);
  const shadbala = computeShadbala({
    planets,
    ascendant,
    mcLongitude: mcSid,
    divisionalCharts,
    maitriMatrix,
    utcMs,
    sunriseMs: sunRiseSet.vedicSunriseMs,
    sunsetMs: sunRiseSet.vedicSunsetMs,
    nextSunriseMs: sunRiseSet.nextSunriseMs,
    varaLord: panchang.vara.lord,
    horaLord: panchang.horaLord,
    obliquityDeg: ascMc.obliquityDeg,
  });

  const yogas = detectYogas(ascendant, planets);

  return {
    input,
    settings,
    utcIso: new Date(utcMs).toISOString(),
    utcMs,
    offsetMinutesUsed: offsetMinutes,
    julianDayUT,
    julianDayTT,
    ayanamsaDeg,
    ayanamsaDms,
    gmstHours: ascMc.gmstHours,
    lmstHours: ascMc.lmstHours,
    obliquityDeg: ascMc.obliquityDeg,
    ascendant,
    mcLongitude: mcSid,
    planets,
    specialPoints,
    houses,
    panchang,
    divisionalCharts,
    vimshottari,
    yogini,
    ashtakavarga,
    shadbala,
    yogas,
    aspects,
    maitriMatrix,
    vimshopakaShodash,
  };
}
