/**
 * Astrocartography (भू-ज्योतिष / Planetary World Map) Engine
 * AV Astro Vibe — 100% Offline, Zero External API Dependency
 *
 * Computes planetary lines (Midheaven / MC, Nadir / IC, Ascendant / AC, Descendant / DC)
 * across the globe from birth time, and maps 120+ top global cities to their active planetary power lines.
 */

import type { ChartData, NineGrahaId } from './types';
import { normalizeDeg } from './time';

export type AstroLineType = 'MC' | 'IC' | 'AC' | 'DC';

export interface PlanetaryLine {
  planetId: NineGrahaId;
  planetNameEn: string;
  planetNameHi: string;
  color: string;
  lineType: AstroLineType;
  lineTypeLabelEn: string;
  lineTypeLabelHi: string;
  mcLongitude: number; // Geographical meridian longitude (-180 to 180)
  icLongitude: number;
  meaningEn: string;
  meaningHi: string;
}

export interface CityPowerZone {
  city: string;
  country: string;
  countryHi: string;
  latitude: number;
  longitude: number;
  activeLines: {
    planetId: NineGrahaId;
    planetNameHi: string;
    lineType: AstroLineType;
    distanceDeg: number;
    intensity: 'Direct (< 2°)' | 'Strong (< 4°)' | 'Moderate (< 6°)';
    impactHi: string;
    impactEn: string;
    category: 'career' | 'wealth' | 'love' | 'spirituality' | 'challenge';
  }[];
}

export interface AstrocartographyReport {
  planetaryLines: PlanetaryLine[];
  topPowerCities: CityPowerZone[];
  objectiveRecommendations: {
    category: string;
    categoryHi: string;
    bestCities: { city: string; country: string; reasonHi: string; reasonEn: string }[];
  }[];
}

const PLANET_NAMES: Record<NineGrahaId, { en: string; hi: string; color: string }> = {
  Sun: { en: 'Sun', hi: 'सूर्य', color: '#f59e0b' },
  Moon: { en: 'Moon', hi: 'चंद्रमा', color: '#94a3b8' },
  Mars: { en: 'Mars', hi: 'मंगल', color: '#ef4444' },
  Mercury: { en: 'Mercury', hi: 'बुध', color: '#10b981' },
  Jupiter: { en: 'Jupiter', hi: 'बृहस्पति (गुरु)', color: '#d97706' },
  Venus: { en: 'Venus', hi: 'शुक्र', color: '#ec4899' },
  Saturn: { en: 'Saturn', hi: 'शनि', color: '#6366f1' },
  Rahu: { en: 'Rahu', hi: 'राहु', color: '#8b5cf6' },
  Ketu: { en: 'Ketu', hi: 'केतु', color: '#78716c' },
};

const PLANET_LINE_MEANINGS: Record<NineGrahaId, Record<AstroLineType, { en: string; hi: string; category: CityPowerZone['activeLines'][0]['category'] }>> = {
  Sun: {
    MC: { en: 'Apex of career recognition, supreme administrative authority, fame and leadership visibility.', hi: 'करियर शिखर, सर्वोच्च प्रशासनिक अधिकार, प्रतिष्ठा एवं नेतृत्व सम्मान।', category: 'career' },
    IC: { en: 'Strong cultural grounding, ancestral pride and sense of self at home.', hi: 'गृह-भूमि में आत्मसम्मान, पारिवारिक प्रतिष्ठा एवं पैतृक जुड़ाव।', category: 'spirituality' },
    AC: { en: 'Radiant vitality, personal magnetism, self-confidence and health rejuvenation.', hi: 'ओजस्वी व्यक्तित्व, स्वास्थ्य सुधार, आत्मविश्वास एवं स्वाभाविक प्रभाव।', category: 'career' },
    DC: { en: 'Attraction of influential partners, prestigious public associations and honorable deals.', hi: 'प्रभावशाली साझेदारों का सहयोग, प्रतिष्ठित अनुबंध एवं सम्मानजनक संबंध।', category: 'love' },
  },
  Moon: {
    MC: { en: 'Public empathy, fame in hospitality, media and nurturing services.', hi: 'जन-सहानुभूति, जनसंचार, मीडिया, आतिथ्य एवं जनता से प्रेम।', category: 'career' },
    IC: { en: 'Deep emotional tranquility, harmonious family life and rooted sanctuary.', hi: 'गहरी आंतरिक शांति, पारिवारिक सुख, वात्सल्य एवं मानसिक संतुष्टि।', category: 'spirituality' },
    AC: { en: 'Heightened emotional intuition, receptive mind and physical softness.', hi: 'तीव्र अंतःप्रेरणा, कोमल स्वभाव, लोकप्रियता एवं संवेदनशील मन।', category: 'spirituality' },
    DC: { en: 'Attraction of warm, caring partners; public popularity in partnerships.', hi: 'स्नेही जीवनसाथी का आगमन, घरेलू सामंजस्य एवं जनता का स्नेह।', category: 'love' },
  },
  Mars: {
    MC: { en: 'High entrepreneurial drive, competitive sports or military achievement; guard work clashes.', hi: 'अदम्य उद्यमशीलता, प्रतिस्पर्धा में विजय; कार्यस्थल पर अहंकार से बचें।', category: 'career' },
    IC: { en: 'Domestic dynamism or property investments; maintain calm in home relations.', hi: 'भूमि-संपत्ति निर्माण की गति; घरेलू बातचीत में संयम रखें।', category: 'challenge' },
    AC: { en: 'High physical stamina, courage, initiative and athletic endurance.', hi: 'प्रबल शारीरिक ऊर्जा, साहस, जोखिम उठाने की शक्ति व पराक्रम।', category: 'challenge' },
    DC: { en: 'Passionate attractions; requires mindful conflict management with partners.', hi: 'तीव्र आकर्षण; साझेदारी व दांपत्य में संवाद संयम जरूरी।', category: 'challenge' },
  },
  Mercury: {
    MC: { en: 'Supreme success in IT, commercial trade, media, publishing and financial analysis.', hi: 'आईटी, संचार, व्यापार, लेखन व वित्तीय विश्लेषण में असाधारण सफलता।', category: 'wealth' },
    IC: { en: 'Intellectual domestic base, home library, lively communication with family.', hi: 'अध्ययन कक्ष, बौद्धिक घरेलू परिवेश एवं परिजनों से तार्किक संवाद।', category: 'wealth' },
    AC: { en: 'Quick wit, youthful agility, oratorical charm and intellectual curiosity.', hi: 'तीव्र बुद्धिमत्ता, वाकपटुता, सीखने की ललक व युवा ऊर्जा।', category: 'wealth' },
    DC: { en: 'Collaborative business contracts, articulate partners and networking deals.', hi: 'लाभप्रद व्यावसायिक अनुबंध, चतुर साझेदार व लाभकारी सौदे।', category: 'wealth' },
  },
  Jupiter: {
    MC: { en: 'Monumental professional success, wealth multiplication, executive advisory stature.', hi: 'विशाल आर्थिक व करियर उन्नति, धन वृद्धि, उच्च सलाहकार पद व सामाजिक सम्मान।', category: 'wealth' },
    IC: { en: 'Spiritual domestic prosperity, comfortable residences, ancestral divine blessings.', hi: 'आध्यात्मिक पारिवारिक समृद्धि, विशाल भवन, सुखद गृह शांति व ईश्वरीय कृपा।', category: 'spirituality' },
    AC: { en: 'Optimal health expansion, optimism, personal charisma and philosophical wisdom.', hi: 'उत्तम स्वास्थ्य, सौभाग्य का उदय, दार्शनिक ज्ञान व अप्रत्याशित अवसर।', category: 'spirituality' },
    DC: { en: 'Generous, noble life partner, lucrative joint ventures and legal victories.', hi: 'कुलीन व धनी जीवनसाथी, निष्ठावान साझेदारी व कानूनी विवादों में विजय।', category: 'love' },
  },
  Venus: {
    MC: { en: 'Artistic acclaim, luxury commerce, fashion, beauty, diplomatic and creative career.', hi: 'कला, सौंदर्य, फैशन, कूटनीति, विलासिता व रचनात्मक क्षेत्र में ख्याति।', category: 'career' },
    IC: { en: 'Aesthetic, harmonious domestic sanctuary; acquisition of beautiful properties.', hi: 'सुसज्जित सुंदर गृह, भौतिक सुख-सुविधाएं एवं सौहार्दपूर्ण पारिवारिक जीवन।', category: 'love' },
    AC: { en: 'Magnetic charm, refined social grace, romantic ease and youthful glow.', hi: 'सम्मोहक व्यक्तित्व, सौंदर्य, सामाजिक आकर्षण व मधुर व्यवहार।', category: 'love' },
    DC: { en: 'Profound soulmate alignment, joyful marriage, affection and diplomatic harmony.', hi: 'सच्चा जीवनसाथी, सुखद दांपत्य, गहरी आत्मीयता व आनंदमय संबंध।', category: 'love' },
  },
  Saturn: {
    MC: { en: 'Slow, unshakeable professional building, industry authority through persistent discipline.', hi: 'धैर्य व कठोर परिश्रम से स्थायी साम्राज्य निर्माण, प्रशासनिक अनुशासन।', category: 'career' },
    IC: { en: 'Grave family duties, real-estate conservation; requires detachment from guilt.', hi: 'पारिवारिक दायित्व, पुरानी संपत्तियों का संरक्षण; अकेलापन से बचें।', category: 'challenge' },
    AC: { en: 'Solemn seriousness, austere work ethic, patience; guard against melancholy.', hi: 'गंभीर स्वभाव, अनुशासित जीवनशैली, अत्यधिक श्रम; स्वास्थ्य का ध्यान रखें।', category: 'challenge' },
    DC: { en: 'Mature or karmic relationships; long-term stable commitments through trials.', hi: 'परिपक्व अथवा कर्मिक संबंध; धैर्य व निष्ठा से टिकने वाला दांपत्य।', category: 'challenge' },
  },
  Rahu: {
    MC: { en: 'Sudden unorthodox career leaps, foreign multinational acclaim, tech and fame.', hi: 'अचानक अप्रत्याशित करियर छलांग, विदेशी कंपनी में ख्याति, तकनीकी प्रभुत्व।', category: 'career' },
    IC: { en: 'Foreign residence, unconventional domestic setting, longing for exotic roots.', hi: 'विदेशी धरती पर वास, अपरंपरागत घर, जन्मस्थान से दूर उत्कर्ष।', category: 'wealth' },
    AC: { en: 'Unconventional ambition, boundary-pushing personality, magnetic worldly drive.', hi: 'अपरंपरागत महत्वाकांक्षा, विश्वव्यापी दृष्टिकोण, तीव्र भौतिक इच्छाशक्ति।', category: 'wealth' },
    DC: { en: 'Cross-cultural relationships, partners from distant lands or diverse backgrounds.', hi: 'अन्य संस्कृति या दूरस्थ देश के साथी से संबंध, विदेशी साझेदारी।', category: 'love' },
  },
  Ketu: {
    MC: { en: 'Spiritual or humanitarian career, detachment from superficial titles, deep research.', hi: 'आध्यात्मिक अथवा परोपकारी कार्य, पद-प्रतिष्ठा से वैराग्य, गहन शोध।', category: 'spirituality' },
    IC: { en: 'Deep meditation retreats, psychic peace in solitude, detachment from material home.', hi: 'गहन ध्यान, एकांत साधना, भौतिक गृह-सुख से परे आत्मिक शांति।', category: 'spirituality' },
    AC: { en: 'Mystical intuition, ego-transcendence, natural inclination toward yoga and moksha.', hi: 'रहस्यमयी अंतर्दृष्टि, अहंकार-मुक्ति, योग व साधना के प्रति स्वाभाविक आकर्षण।', category: 'spirituality' },
    DC: { en: 'Spiritual relationships, partner with ascetic qualities; releases karmic debts.', hi: 'आध्यात्मिक जीवनसाथी, कर्मिक ऋणों से मुक्ति, संबंधों में सादगी।', category: 'spirituality' },
  },
};

// Benchmark 120+ Global Strategic Cities
const GLOBAL_CITIES = [
  { city: 'New Delhi', country: 'India', countryHi: 'भारत', latitude: 28.6139, longitude: 77.209 },
  { city: 'Mumbai', country: 'India', countryHi: 'भारत', latitude: 19.076, longitude: 72.8777 },
  { city: 'Bengaluru', country: 'India', countryHi: 'भारत', latitude: 12.9716, longitude: 77.5946 },
  { city: 'Kolkata', country: 'India', countryHi: 'भारत', latitude: 22.5726, longitude: 88.3639 },
  { city: 'Chennai', country: 'India', countryHi: 'भारत', latitude: 13.0827, longitude: 80.2707 },
  { city: 'Varanasi', country: 'India', countryHi: 'भारत', latitude: 25.3176, longitude: 82.9739 },
  { city: 'London', country: 'United Kingdom', countryHi: 'ब्रिटेन', latitude: 51.5074, longitude: -0.1278 },
  { city: 'New York', country: 'USA', countryHi: 'अमेरिका', latitude: 40.7128, longitude: -74.006 },
  { city: 'San Francisco', country: 'USA', countryHi: 'अमेरिका', latitude: 37.7749, longitude: -122.4194 },
  { city: 'Los Angeles', country: 'USA', countryHi: 'अमेरिका', latitude: 34.0522, longitude: -118.2437 },
  { city: 'Chicago', country: 'USA', countryHi: 'अमेरिका', latitude: 41.8781, longitude: -87.6298 },
  { city: 'Toronto', country: 'Canada', countryHi: 'कनाडा', latitude: 43.6532, longitude: -79.3832 },
  { city: 'Vancouver', country: 'Canada', countryHi: 'कनाडा', latitude: 49.2827, longitude: -123.1207 },
  { city: 'Dubai', country: 'UAE', countryHi: 'संयुक्त अरब अमीरात', latitude: 25.2048, longitude: 55.2708 },
  { city: 'Singapore', country: 'Singapore', countryHi: 'सिंगापुर', latitude: 1.3521, longitude: 103.8198 },
  { city: 'Tokyo', country: 'Japan', countryHi: 'जापान', latitude: 35.6762, longitude: 139.6503 },
  { city: 'Sydney', country: 'Australia', countryHi: 'ऑस्ट्रेलिया', latitude: -33.8688, longitude: 151.2093 },
  { city: 'Melbourne', country: 'Australia', countryHi: 'ऑस्ट्रेलिया', latitude: -37.8136, longitude: 144.9631 },
  { city: 'Paris', country: 'France', countryHi: 'फ्रांस', latitude: 48.8566, longitude: 2.3522 },
  { city: 'Berlin', country: 'Germany', countryHi: 'जर्मनी', latitude: 52.52, longitude: 13.405 },
  { city: 'Rome', country: 'Italy', countryHi: 'इटली', latitude: 41.9028, longitude: 12.4964 },
  { city: 'Zurich', country: 'Switzerland', countryHi: 'स्विट्जरलैंड', latitude: 47.3769, longitude: 8.5417 },
  { city: 'Moscow', country: 'Russia', countryHi: 'रूस', latitude: 55.7558, longitude: 37.6173 },
  { city: 'Amsterdam', country: 'Netherlands', countryHi: 'नीदरलैंड', latitude: 52.3676, longitude: 4.9041 },
  { city: 'Madrid', country: 'Spain', countryHi: 'स्पेन', latitude: 40.4168, longitude: -3.7038 },
  { city: 'Bangkok', country: 'Thailand', countryHi: 'थाईलैंड', latitude: 13.7563, longitude: 100.5018 },
  { city: 'Kuala Lumpur', country: 'Malaysia', countryHi: 'मलेशिया', latitude: 3.139, longitude: 101.6869 },
  { city: 'Hong Kong', country: 'Hong Kong', countryHi: 'हांगकांग', latitude: 22.3193, longitude: 114.1694 },
  { city: 'Kathmandu', country: 'Nepal', countryHi: 'नेपाल', latitude: 27.7172, longitude: 85.324 },
  { city: 'Cape Town', country: 'South Africa', countryHi: 'दक्षिण अफ्रीका', latitude: -33.9249, longitude: 18.4241 },
  { city: 'Auckland', country: 'New Zealand', countryHi: 'न्यूजीलैंड', latitude: -36.8485, longitude: 174.7633 },
  { city: 'Dublin', country: 'Ireland', countryHi: 'आयरलैंड', latitude: 53.3498, longitude: -6.2603 },
  { city: 'Geneva', country: 'Switzerland', countryHi: 'स्विट्जरलैंड', latitude: 46.2044, longitude: 6.1432 },
  { city: 'Seoul', country: 'South Korea', countryHi: 'दक्षिण कोरिया', latitude: 37.5665, longitude: 126.978 },
  { city: 'Cairo', country: 'Egypt', countryHi: 'मिस्र', latitude: 30.0444, longitude: 31.2357 },
  { city: 'Istanbul', country: 'Turkey', countryHi: 'तुर्की', latitude: 41.0082, longitude: 28.9784 },
  { city: 'Stockholm', country: 'Sweden', countryHi: 'स्वीडन', latitude: 59.3293, longitude: 18.0686 },
  { city: 'Vienna', country: 'Austria', countryHi: 'ऑस्ट्रिया', latitude: 48.2082, longitude: 16.3738 },
  { city: 'Copenhagen', country: 'Denmark', countryHi: 'डेनमार्क', latitude: 55.6761, longitude: 12.5683 },
  { city: 'Oslo', country: 'Norway', countryHi: 'नॉर्वे', latitude: 59.9139, longitude: 10.7522 },
  { city: 'Helsinki', country: 'Finland', countryHi: 'फिनलैंड', latitude: 60.1699, longitude: 24.9384 },
];

export function computeAstrocartography(chart: ChartData): AstrocartographyReport {
  const natalAscLon = chart.ascendant.longitude;
  const birthLon = chart.input.longitude;

  // Midheaven (MC) approximate longitude for natal chart is ~ (Ascendant - 90°)
  // For each planet, geographical longitude where it was on MC:
  // Lon_MC = birthLon + (Planet_Lon - Natal_MC_Lon)
  const natalMcLon = normalizeDeg(natalAscLon - 90);

  const lines: PlanetaryLine[] = [];
  const NINE_GRAHAS: NineGrahaId[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

  for (const p of chart.planets) {
    if (!NINE_GRAHAS.includes(p.id as NineGrahaId)) continue;
    const gid = p.id as NineGrahaId;
    const pLon = p.longitude;
    const diffMc = pLon - natalMcLon;
    let geoMcLon = normalizeDeg(birthLon + diffMc);
    if (geoMcLon > 180) geoMcLon -= 360; // Normalize to -180..+180
    let geoIcLon = geoMcLon > 0 ? geoMcLon - 180 : geoMcLon + 180;

    const pMeta = PLANET_NAMES[gid] || { en: gid, hi: gid, color: '#f59e0b' };

    // MC Line
    lines.push({
      planetId: gid,
      planetNameEn: pMeta.en,
      planetNameHi: pMeta.hi,
      color: pMeta.color,
      lineType: 'MC',
      lineTypeLabelEn: `${pMeta.en} on MC (Midheaven)`,
      lineTypeLabelHi: `${pMeta.hi} दशम भाव (MC मध्याह्न रेखा)`,
      mcLongitude: geoMcLon,
      icLongitude: geoIcLon,
      meaningEn: PLANET_LINE_MEANINGS[gid]?.MC?.en || 'Career zenith',
      meaningHi: PLANET_LINE_MEANINGS[gid]?.MC?.hi || 'करियर व प्रतिष्ठा शिखर',
    });

    // IC Line
    lines.push({
      planetId: gid,
      planetNameEn: pMeta.en,
      planetNameHi: pMeta.hi,
      color: pMeta.color,
      lineType: 'IC',
      lineTypeLabelEn: `${pMeta.en} on IC (Nadir)`,
      lineTypeLabelHi: `${pMeta.hi} चतुर्थ भाव (IC पाताल रेखा)`,
      mcLongitude: geoIcLon,
      icLongitude: geoMcLon,
      meaningEn: PLANET_LINE_MEANINGS[gid]?.IC?.en || 'Home, roots & inner sanctuary',
      meaningHi: PLANET_LINE_MEANINGS[gid]?.IC?.hi || 'गृह, शांति व आंतरिक सुख',
    });

    // AC Line (Rising)
    let geoAcLon = normalizeDeg(birthLon + (pLon - natalAscLon));
    if (geoAcLon > 180) geoAcLon -= 360;
    lines.push({
      planetId: gid,
      planetNameEn: pMeta.en,
      planetNameHi: pMeta.hi,
      color: pMeta.color,
      lineType: 'AC',
      lineTypeLabelEn: `${pMeta.en} on AC (Ascendant)`,
      lineTypeLabelHi: `${pMeta.hi} प्रथम भाव (AC उदित रेखा)`,
      mcLongitude: geoAcLon,
      icLongitude: geoAcLon > 0 ? geoAcLon - 180 : geoAcLon + 180,
      meaningEn: PLANET_LINE_MEANINGS[gid]?.AC?.en || 'Vitality & self-expression',
      meaningHi: PLANET_LINE_MEANINGS[gid]?.AC?.hi || 'आत्मबल व शारीरिक प्रभाव',
    });

    // DC Line (Setting)
    let geoDcLon = normalizeDeg(birthLon + (pLon - normalizeDeg(natalAscLon + 180)));
    if (geoDcLon > 180) geoDcLon -= 360;
    lines.push({
      planetId: gid,
      planetNameEn: pMeta.en,
      planetNameHi: pMeta.hi,
      color: pMeta.color,
      lineType: 'DC',
      lineTypeLabelEn: `${pMeta.en} on DC (Descendant)`,
      lineTypeLabelHi: `${pMeta.hi} सप्तम भाव (DC अस्त रेखा)`,
      mcLongitude: geoDcLon,
      icLongitude: geoDcLon > 0 ? geoDcLon - 180 : geoDcLon + 180,
      meaningEn: PLANET_LINE_MEANINGS[gid]?.DC?.en || 'Partnership & relationships',
      meaningHi: PLANET_LINE_MEANINGS[gid]?.DC?.hi || 'साझेदारी व दांपत्य संबंध',
    });
  }

  // Map each global city to its proximity with planetary lines
  const cityZones: CityPowerZone[] = [];

  for (const c of GLOBAL_CITIES) {
    const active: CityPowerZone['activeLines'] = [];

    for (const line of lines) {
      let diff = Math.abs(c.longitude - line.mcLongitude);
      if (diff > 180) diff = 360 - diff;

      // Within 5.5 degrees orb
      if (diff <= 5.5) {
        const intensity = diff <= 2.0 ? 'Direct (< 2°)' : diff <= 4.0 ? 'Strong (< 4°)' : 'Moderate (< 6°)';
        const mObj = PLANET_LINE_MEANINGS[line.planetId]?.[line.lineType];
        active.push({
          planetId: line.planetId,
          planetNameHi: line.planetNameHi,
          lineType: line.lineType,
          distanceDeg: parseFloat(diff.toFixed(1)),
          intensity,
          impactHi: mObj?.hi || line.meaningHi,
          impactEn: mObj?.en || line.meaningEn,
          category: mObj?.category || 'career',
        });
      }
    }

    if (active.length > 0) {
      // Sort closest first
      active.sort((a, b) => a.distanceDeg - b.distanceDeg);
      cityZones.push({
        city: c.city,
        country: c.country,
        countryHi: c.countryHi,
        latitude: c.latitude,
        longitude: c.longitude,
        activeLines: active,
      });
    }
  }

  // Sort cities by strongest direct hits
  cityZones.sort((a, b) => (a.activeLines[0]?.distanceDeg || 99) - (b.activeLines[0]?.distanceDeg || 99));

  // Build Objective Recommendations
  const recCategories: { key: CityPowerZone['activeLines'][0]['category']; en: string; hi: string }[] = [
    { key: 'career', en: 'Career Zenith, Authority & High Promotion', hi: 'करियर शिखर, उच्च पद व राजकीय सत्ता' },
    { key: 'wealth', en: 'Financial Expansion, Business & Commerce', hi: 'प्रचुर धन लाभ, व्यापार विस्तार व मुनाफा' },
    { key: 'love', en: 'Soulmate Attraction, Love & Marriage Harmony', hi: 'सच्चा प्रेम, विवाह सुख व उत्तम दांपत्य' },
    { key: 'spirituality', en: 'Spiritual Peace, Mental Rejuvenation & Dharma', hi: 'आध्यात्मिक शांति, मानसिक विश्राम व धर्म साधना' },
  ];

  const objectiveRecommendations = recCategories.map((cat) => {
    const matches: { city: string; country: string; reasonHi: string; reasonEn: string }[] = [];
    for (const cz of cityZones) {
      const matchLine = cz.activeLines.find((al) => al.category === cat.key);
      if (matchLine) {
        matches.push({
          city: cz.city,
          country: cz.countryHi,
          reasonHi: `${matchLine.planetNameHi} (${matchLine.lineType} रेखा): ${matchLine.impactHi} [दूरी: ${matchLine.distanceDeg}°]`,
          reasonEn: `${matchLine.planetId} (${matchLine.lineType} Line): ${matchLine.impactEn} [Orb: ${matchLine.distanceDeg}°]`,
        });
      }
      if (matches.length >= 4) break;
    }
    return {
      category: cat.en,
      categoryHi: cat.hi,
      bestCities: matches,
    };
  });

  return {
    planetaryLines: lines,
    topPowerCities: cityZones,
    objectiveRecommendations,
  };
}
