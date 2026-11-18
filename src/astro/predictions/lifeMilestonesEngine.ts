/**
 * Chronological Age Milestones & Stree Jataka Engine (आयु कालचक्र व स्त्री जातक फलादेश)
 * AV Astro Vibe — Classical Textbook Predictions Synthesis
 *
 * Implements the chronological timeline of milestone years (आयु वर्ष कालचक्र),
 * classical auspicious & inauspicious sign years, dedicated Stree Jataka sutras,
 * and 36 Drekkana karmic classifications derived from the 296-page classical textbook.
 *
 * Strictly NO emojis, 100% compliant with AV Astro Vibe standards.
 */

import type { ChartData, NineGrahaId } from '../types';
import { SIGNS } from '../constants';
import {
  SIGN_YEARS_MILESTONES,
  DREKKANA_36_CORPUS,
  getSignMilestones,
  getPlanetHouseBookRecord,
  getDrekkanaRecord,
  type DrekkanaBookRecord,
  type SignMilestonesRecord,
  type AgeMilestone
} from './classicalBookData';

export type MilestoneStatus = 'realized' | 'active' | 'upcoming';
export type MilestoneNature = 'favorable' | 'challenging' | 'career' | 'health';

export interface ChronologicalMilestoneItem {
  id: string;
  age: number;
  calendarYear: number;
  status: MilestoneStatus;
  statusTitleEn: string;
  statusTitleHi: string;
  nature: MilestoneNature;
  natureTitleEn: string;
  natureTitleHi: string;
  sourceType: 'planet_house' | 'lagna_sign' | 'moon_sign' | 'drekkana_maraka';
  sourceGraha?: string;
  sourceGrahaHi?: string;
  house?: number;
  houseTitleEn?: string;
  houseTitleHi?: string;
  titleEn: string;
  titleHi: string;
  eventEn: string;
  eventHi: string;
}

export interface StreeJatakaReadingItem {
  planet: string;
  planetHi: string;
  house: number;
  houseTitleEn: string;
  houseTitleHi: string;
  sutraEn: string;
  sutraHi: string;
}

export interface DrekkanaAnalysisReport {
  lagnaDrekkana: DrekkanaBookRecord;
  twentySecondDrekkana: DrekkanaBookRecord;
  marakaWarningEn?: string;
  marakaWarningHi?: string;
}

export interface LifeMilestonesReport {
  currentAge: number;
  birthYear: number;
  lagnaSign: SignMilestonesRecord;
  moonSign: SignMilestonesRecord;
  milestones: ChronologicalMilestoneItem[];
  drekkanaAnalysis: DrekkanaAnalysisReport;
  streeJatakaReadings: StreeJatakaReadingItem[];
  isFemaleNative: boolean;
  summary: {
    totalMilestones: number;
    activeCount: number;
    upcomingCount: number;
    realizedCount: number;
    favorableCount: number;
    challengingCount: number;
  };
}

const HOUSE_TITLES: Record<number, { en: string; hi: string }> = {
  1: { en: '1st House (Lagna)', hi: 'प्रथम भाव (लग्न)' },
  2: { en: '2nd House (Dhana)', hi: 'द्वितीय भाव (धन)' },
  3: { en: '3rd House (Sahaja)', hi: 'तृतीय भाव (पराक्रम)' },
  4: { en: '4th House (Sukha)', hi: 'चतुर्थ भाव (सुख)' },
  5: { en: '5th House (Suta)', hi: 'पंचम भाव (संतान व बुद्धि)' },
  6: { en: '6th House (Ripu)', hi: 'षष्ठ भाव (रोग व शत्रु)' },
  7: { en: '7th House (Kalatra)', hi: 'सप्तम भाव (कलत्र व जाया)' },
  8: { en: '8th House (Ayu)', hi: 'अष्टम भाव (आयु व रंध्र)' },
  9: { en: '9th House (Dharma)', hi: 'नवम भाव (धर्म व भाग्य)' },
  10: { en: '10th House (Karma)', hi: 'दशम भाव (कर्म व राज्य)' },
  11: { en: '11th House (Labha)', hi: 'एकादश भाव (लाभ व आय)' },
  12: { en: '12th House (Vyaya)', hi: 'द्वादश भाव (व्यय व मोक्ष)' }
};

export function computeLifeMilestonesEngine(chart: ChartData): LifeMilestonesReport {
  // 1. Calculate native's chronological age
  let birthDate: Date;
  try {
    const [y, m, d] = (chart.input.date || '2000-01-01').split('-').map(Number);
    const [hh, mm, ss] = (chart.input.time || '12:00:00').split(':').map(Number);
    birthDate = new Date(Date.UTC(y, (m || 1) - 1, d || 1, hh || 12, mm || 0, ss || 0));
  } catch {
    birthDate = new Date('2000-01-01T12:00:00Z');
  }

  const birthYear = birthDate.getUTCFullYear() || 2000;
  const nowMs = Date.now();
  const currentAge = Math.max(0, (nowMs - birthDate.getTime()) / (365.25 * 86400000));
  const roundedAge = Math.floor(currentAge);

  // 2. Identify Lagna & Moon signs
  const ascSign = chart.ascendant?.signIndex ?? 0;
  const moonPlanet = chart.planets?.find((p) => p.id === 'Moon');
  const moonSign = moonPlanet?.signIndex ?? ascSign;

  const lagnaRecord = getSignMilestones(ascSign);
  const moonRecord = getSignMilestones(moonSign);

  const rawMilestones: ChronologicalMilestoneItem[] = [];

  const resolveStatus = (age: number): { status: MilestoneStatus; en: string; hi: string } => {
    if (age < roundedAge) {
      return { status: 'realized', en: 'Past / Realized', hi: 'घटित काल (अनुभूत)' };
    }
    if (Math.abs(age - currentAge) <= 1.2 || age === roundedAge) {
      return { status: 'active', en: 'Active Age Window', hi: 'सक्रिय वर्तमान काल' };
    }
    return { status: 'upcoming', en: 'Upcoming Horizon', hi: 'आगामी समय काल' };
  };

  const resolveNature = (n: MilestoneNature): { en: string; hi: string } => {
    switch (n) {
      case 'favorable':
        return { en: 'Fortunate / Auspicious Milestone', hi: 'शुभ व उन्नतिदायक मील का पत्थर' };
      case 'career':
        return { en: 'Professional & Status Milestone', hi: 'आजीविका व पदोन्नति का वर्ष' };
      case 'health':
        return { en: 'Physical & Health Vigilance', hi: 'स्वास्थ्य व शारीरिक सतर्कता' };
      case 'challenging':
      default:
        return { en: 'Testing & Caution Horizon', hi: 'चुनौतीपूर्ण व सावधानी का वर्ष' };
    }
  };

  // 3. Scan 9 planets and collect exact book milestones
  const scannedPlanets: NineGrahaId[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  const streeJatakaReadings: StreeJatakaReadingItem[] = [];

  for (const pid of scannedPlanets) {
    const p = chart.planets?.find((pl) => pl.id === pid);
    if (!p) continue;
    const hNum = p.houseNumber || 1;
    const bookRec = getPlanetHouseBookRecord(pid, hNum);
    if (!bookRec) continue;

    // Check Stree Jataka
    if (chart.input.gender === 'female' && bookRec.femaleHoroscope) {
      const hTitle = HOUSE_TITLES[hNum] || { en: `House ${hNum}`, hi: `भाव ${hNum}` };
      streeJatakaReadings.push({
        planet: pid,
        planetHi: bookRec.planetHi,
        house: hNum,
        houseTitleEn: hTitle.en,
        houseTitleHi: hTitle.hi,
        sutraEn: bookRec.femaleHoroscope.en,
        sutraHi: bookRec.femaleHoroscope.hi
      });
    }

    // Add age milestones from Chapter 8
    for (const m of bookRec.ageMilestones) {
      const st = resolveStatus(m.age);
      const nt = resolveNature(m.nature);
      const hTitle = HOUSE_TITLES[hNum] || { en: `House ${hNum}`, hi: `भाव ${hNum}` };

      rawMilestones.push({
        id: `ph_${pid}_h${hNum}_age${m.age}`,
        age: m.age,
        calendarYear: birthYear + m.age,
        status: st.status,
        statusTitleEn: st.en,
        statusTitleHi: st.hi,
        nature: m.nature,
        natureTitleEn: nt.en,
        natureTitleHi: nt.hi,
        sourceType: 'planet_house',
        sourceGraha: pid,
        sourceGrahaHi: bookRec.planetHi,
        house: hNum,
        houseTitleEn: hTitle.en,
        houseTitleHi: hTitle.hi,
        titleEn: `${bookRec.titleEn} — Age ${m.age}`,
        titleHi: `${bookRec.titleHi} — आयु वर्ष ${m.age}`,
        eventEn: m.eventEn,
        eventHi: m.eventHi
      });
    }
  }

  // 4. Add Lagna Sign Auspicious & Inauspicious Milestone Years
  for (const age of lagnaRecord.auspiciousYears) {
    const st = resolveStatus(age);
    rawMilestones.push({
      id: `lagna_ausp_${age}`,
      age,
      calendarYear: birthYear + age,
      status: st.status,
      statusTitleEn: st.en,
      statusTitleHi: st.hi,
      nature: 'favorable',
      natureTitleEn: 'Lagna Auspicious Year',
      natureTitleHi: 'लग्न शुभ व भाग्योदय वर्ष',
      sourceType: 'lagna_sign',
      titleEn: `${lagnaRecord.nameEn} Lagna Fortunate Year (Age ${age})`,
      titleHi: `${lagnaRecord.nameHi} लग्न शुभ भाग्योदय वर्ष (आयु ${age})`,
      eventEn: `Classical fortunate milestone year for ${lagnaRecord.nameEn} Lagna: Fosters breakthroughs in ventures, vitality, and societal recognition.`,
      eventHi: `${lagnaRecord.nameHi} लग्न हेतु शास्त्रीय शुभ वर्ष: नवीन उपक्रमों में विजय, शारीरिक आरोग्य तथा प्रतिष्ठा में वृद्धि का समय।`
    });
  }

  for (const age of lagnaRecord.inauspiciousYears) {
    const st = resolveStatus(age);
    rawMilestones.push({
      id: `lagna_inausp_${age}`,
      age,
      calendarYear: birthYear + age,
      status: st.status,
      statusTitleEn: st.en,
      statusTitleHi: st.hi,
      nature: 'challenging',
      natureTitleEn: 'Lagna Caution Year',
      natureTitleHi: 'लग्न सतर्कता व कष्टकारी वर्ष',
      sourceType: 'lagna_sign',
      titleEn: `${lagnaRecord.nameEn} Lagna Caution Year (Age ${age})`,
      titleHi: `${lagnaRecord.nameHi} लग्न सतर्कता वर्ष (आयु ${age})`,
      eventEn: `Classical caution year for ${lagnaRecord.nameEn} Lagna: Advises patience, health precautions regarding ${lagnaRecord.vulnerabilitiesEn}, and prudent financial moves.`,
      eventHi: `${lagnaRecord.nameHi} लग्न हेतु शास्त्रीय सतर्कता वर्ष: धैर्य रखें, ${lagnaRecord.vulnerabilitiesHi} से सावधान रहें तथा वित्तीय मामलों में सतर्क रहें।`
    });
  }

  // 5. Add Moon Sign Auspicious & Inauspicious Milestone Years (if different sign from Lagna)
  if (moonSign !== ascSign) {
    for (const age of moonRecord.auspiciousYears) {
      const st = resolveStatus(age);
      rawMilestones.push({
        id: `moon_ausp_${age}`,
        age,
        calendarYear: birthYear + age,
        status: st.status,
        statusTitleEn: st.en,
        statusTitleHi: st.hi,
        nature: 'favorable',
        natureTitleEn: 'Chandra Rashi Fortunate Year',
        natureTitleHi: 'चन्द्र राशि शुभ फल वर्ष',
        sourceType: 'moon_sign',
        titleEn: `${moonRecord.nameEn} Moon Sign Fortunate Year (Age ${age})`,
        titleHi: `${moonRecord.nameHi} चन्द्र राशि शुभ वर्ष (आयु ${age})`,
        eventEn: `Auspicious emotional and social milestone year for ${moonRecord.nameEn} Rashi: Brings domestic peace, family expansion, and prosperity.`,
        eventHi: `${moonRecord.nameHi} राशि हेतु शुभ वर्ष: मानसिक प्रसन्नता, पारिवारिक मांगलिक कार्य तथा सुख-समृद्धि का योग।`
      });
    }

    for (const age of moonRecord.inauspiciousYears) {
      const st = resolveStatus(age);
      rawMilestones.push({
        id: `moon_inausp_${age}`,
        age,
        calendarYear: birthYear + age,
        status: st.status,
        statusTitleEn: st.en,
        statusTitleHi: st.hi,
        nature: 'challenging',
        natureTitleEn: 'Chandra Rashi Caution Year',
        natureTitleHi: 'चन्द्र राशि सतर्कता वर्ष',
        sourceType: 'moon_sign',
        titleEn: `${moonRecord.nameEn} Moon Sign Caution Year (Age ${age})`,
        titleHi: `${moonRecord.nameHi} चन्द्र राशि सतर्कता वर्ष (आयु ${age})`,
        eventEn: `Cautionary emotional year for ${moonRecord.nameEn} Rashi: Emotional stability needed, guard against mental anxiety and digestive fluctuations.`,
        eventHi: `${moonRecord.nameHi} राशि हेतु सतर्कता वर्ष: मानसिक शांति रखें, भावुकता पर नियंत्रण रखें तथा स्वास्थ्य का ध्यान रखें।`
      });
    }
  }

  // 6. 36 Drekkana Analysis: Lagna Drekkana & 22nd Drekkana (खर द्रेष्काण)
  const lagnaDeg = chart.ascendant?.degreeInSign ?? 15;
  const lagnaDrekkana = getDrekkanaRecord(ascSign, lagnaDeg);

  // 22nd Drekkana is in 8th house from Lagna: (ascSign + 7) % 12
  const eighthSign = (ascSign + 7) % 12;
  const eighthHousePlanet = chart.planets?.find((p) => p.houseNumber === 8);
  const eighthDeg = eighthHousePlanet?.degreeInSign ?? lagnaDeg;
  const twentySecondDrekkana = getDrekkanaRecord(eighthSign, eighthDeg);

  let marakaWarningEn: string | undefined;
  let marakaWarningHi: string | undefined;

  if (twentySecondDrekkana.isMarakaSensitive) {
    marakaWarningEn = `22nd Drekkana is ${twentySecondDrekkana.classification} (${twentySecondDrekkana.nameEn}): Requires protective vigilance regarding bodily vulnerabilities and travel precautions.`;
    marakaWarningHi = `22वां खर द्रेष्काण ${twentySecondDrekkana.classificationHi} (${twentySecondDrekkana.nameHi}) है: शारीरिक स्वास्थ्य, यात्रा तथा जल/अग्नि संवेदनशीलता के प्रति सजगता आवश्यक।`;
  }

  // Deduplicate and Sort chronologically by age
  const uniqueMap = new Map<string, ChronologicalMilestoneItem>();
  for (const m of rawMilestones) {
    const key = `${m.age}_${m.sourceType}_${m.nature}_${m.sourceGraha || ''}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, m);
    }
  }

  const sortedMilestones = Array.from(uniqueMap.values()).sort((a, b) => {
    if (a.age !== b.age) return a.age - b.age;
    return a.nature === 'favorable' ? -1 : 1;
  });

  // Calculate summary statistics
  let activeCount = 0;
  let upcomingCount = 0;
  let realizedCount = 0;
  let favorableCount = 0;
  let challengingCount = 0;

  for (const m of sortedMilestones) {
    if (m.status === 'active') activeCount++;
    else if (m.status === 'upcoming') upcomingCount++;
    else realizedCount++;

    if (m.nature === 'favorable' || m.nature === 'career') favorableCount++;
    else challengingCount++;
  }

  return {
    currentAge: Math.round(currentAge * 10) / 10,
    birthYear,
    lagnaSign: lagnaRecord,
    moonSign: moonRecord,
    milestones: sortedMilestones,
    drekkanaAnalysis: {
      lagnaDrekkana,
      twentySecondDrekkana,
      marakaWarningEn,
      marakaWarningHi
    },
    streeJatakaReadings,
    isFemaleNative: chart.input.gender === 'female',
    summary: {
      totalMilestones: sortedMilestones.length,
      activeCount,
      upcomingCount,
      realizedCount,
      favorableCount,
      challengingCount
    }
  };
}
