import { SIGNS } from './constants';
import { formatDms, normalizeDeg } from './time';
import type { ChartData, SevenPlanetId } from './types';

export interface TajakaSahamResult {
  id: string;
  nameEn: string;
  nameHi: string;
  category: 'Spiritual & Dharma' | 'Wealth & Career' | 'Family & Relationships' | 'Vitality & Health' | 'Enterprise & Travel';
  longitude: number;
  signIndex: number;
  signName: string;
  degreeInSign: number;
  dms: string;
  house: number;
  lord: SevenPlanetId;
  formulaDescriptionEn: string;
  formulaDescriptionHi: string;
  ithasalaYoga: {
    exists: boolean;
    partnerPlanet?: SevenPlanetId;
    aspectType?: string;
    descriptionEn: string;
    descriptionHi: string;
  };
  verdict: 'Exalted / Highly Favorable' | 'Auspicious' | 'Neutral' | 'Challenging / Remedial';
  predictionEn: string;
  predictionHi: string;
}

export interface TajakaSahamsReport {
  isDayBirth: boolean;
  birthTypeEn: string;
  birthTypeHi: string;
  sahams: TajakaSahamResult[];
  categorySummary: Record<string, number>;
  prominentSahams: TajakaSahamResult[];
}

// Classical Tajaka Deeptamshas (orbs of influence in degrees)
export const TAJAKA_DEEPTAMSHAS: Record<SevenPlanetId, number> = {
  Sun: 15,
  Moon: 12,
  Mars: 8,
  Mercury: 7,
  Jupiter: 9,
  Venus: 7,
  Saturn: 9,
};

// Mean daily motions for Ithasala speed comparison (fastest to slowest)
const PLANET_SPEED_RANK: Record<SevenPlanetId, number> = {
  Moon: 1,
  Mercury: 2,
  Venus: 3,
  Sun: 4,
  Mars: 5,
  Jupiter: 6,
  Saturn: 7,
};

function computeSahamPoint(
  dayA: number,
  dayB: number,
  ascLon: number,
  isDayBirth: boolean,
  reverseAtNight: boolean = true,
  applyNeelakanthiRule: boolean = true
): number {
  let A = dayA;
  let B = dayB;
  if (!isDayBirth && reverseAtNight) {
    A = dayB;
    B = dayA;
  }
  const diff = normalizeDeg(A - B);
  let saham = normalizeDeg(diff + ascLon);

  if (applyNeelakanthiRule) {
    const lagnaFromB = normalizeDeg(ascLon - B);
    const aFromB = normalizeDeg(A - B);
    const isLagnaBetween = lagnaFromB >= 0 && lagnaFromB <= aFromB;
    if (!isLagnaBetween) {
      saham = normalizeDeg(saham + 30);
    }
  }
  return saham;
}

export function computeTajaka50Sahams(chart: ChartData): TajakaSahamsReport {
  const pMap: Record<SevenPlanetId, { lon: number; signIndex: number; house: number; deg: number }> = {
    Sun: { lon: 0, signIndex: 0, house: 1, deg: 0 },
    Moon: { lon: 0, signIndex: 0, house: 1, deg: 0 },
    Mars: { lon: 0, signIndex: 0, house: 1, deg: 0 },
    Mercury: { lon: 0, signIndex: 0, house: 1, deg: 0 },
    Jupiter: { lon: 0, signIndex: 0, house: 1, deg: 0 },
    Venus: { lon: 0, signIndex: 0, house: 1, deg: 0 },
    Saturn: { lon: 0, signIndex: 0, house: 1, deg: 0 },
  };

  for (const pl of chart.planets) {
    if (pl.id in pMap) {
      pMap[pl.id as SevenPlanetId] = {
        lon: pl.longitude,
        signIndex: pl.signIndex,
        house: pl.rasiHouseNumber,
        deg: pl.degreeInSign,
      };
    }
  }

  const ascLon = chart.ascendant.longitude;
  const sunHouse = pMap.Sun.house;
  // Day birth if Sun is in upper hemisphere (Houses 7 through 12)
  const isDayBirth = sunHouse >= 7 && sunHouse <= 12;

  const getCusp = (h: number): number => {
    const idx = (h - 1) % 12;
    return chart.houses && chart.houses[idx] ? chart.houses[idx].midpoint : normalizeDeg(ascLon + (h - 1) * 30);
  };

  const getLordOfHouse = (h: number): SevenPlanetId => {
    const cuspLon = getCusp(h);
    const sIdx = Math.floor(cuspLon / 30) % 12;
    return SIGNS[sIdx].lord;
  };

  const lagnaLord = SIGNS[chart.ascendant.signIndex].lord;
  const h2Lord = getLordOfHouse(2);
  const h9Lord = getLordOfHouse(9);
  const h11Lord = getLordOfHouse(11);
  const h12Lord = getLordOfHouse(12);

  // Helper definition
  interface SahamDef {
    id: string;
    nameEn: string;
    nameHi: string;
    category: TajakaSahamResult['category'];
    dayA: number;
    dayB: number;
    reverseAtNight: boolean;
    applyNeelakanthi: boolean;
    formulaEn: string;
    formulaHi: string;
    themeEn: string;
    themeHi: string;
  }

  // Pre-calculate Punya Saham first as several other Sahams depend on it
  const punyaLon = computeSahamPoint(pMap.Moon.lon, pMap.Sun.lon, ascLon, isDayBirth, true, true);

  const defs: SahamDef[] = [
    // 1-10
    {
      id: 'punya',
      nameEn: 'Punya Saham',
      nameHi: 'पुण्य सहम',
      category: 'Spiritual & Dharma',
      dayA: pMap.Moon.lon,
      dayB: pMap.Sun.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Moon - Sun + Lagna' : 'Sun - Moon + Lagna',
      formulaHi: isDayBirth ? 'चंद्र - सूर्य + लग्न' : 'सूर्य - चंद्र + लग्न',
      themeEn: 'Past-life spiritual merit, sudden fortune, divine benevolence and moral integrity.',
      themeHi: 'पूर्वजन्म संचित पुण्य, आकस्मिक भाग्य, ईश्वरीय कृपा व सत्कर्म फल।',
    },
    {
      id: 'vidya',
      nameEn: 'Vidya Saham',
      nameHi: 'विद्या सहम',
      category: 'Spiritual & Dharma',
      dayA: pMap.Sun.lon,
      dayB: pMap.Moon.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Sun - Moon + Lagna' : 'Moon - Sun + Lagna',
      formulaHi: isDayBirth ? 'सूर्य - चंद्र + लग्न' : 'चंद्र - सूर्य + लग्न',
      themeEn: 'Scholastic excellence, profound intellect, academic degrees and grasping power.',
      themeHi: 'विद्या अर्जन, प्रखर मेधा, उच्च शिक्षण व बौद्धिक अन्वेषण।',
    },
    {
      id: 'yashas',
      nameEn: 'Yashas Saham',
      nameHi: 'यश सहम',
      category: 'Wealth & Career',
      dayA: pMap.Jupiter.lon,
      dayB: punyaLon,
      reverseAtNight: false,
      applyNeelakanthi: true,
      formulaEn: 'Jupiter - Punya + Lagna',
      formulaHi: 'बृहस्पति - पुण्य + लग्न',
      themeEn: 'Public renown, social honor, fame, celebrated stature and lasting goodwill.',
      themeHi: 'सार्वजनिक कीर्ति, सामाजिक प्रतिष्ठा, यशोगान व सर्वमान्य आदर।',
    },
    {
      id: 'mitra',
      nameEn: 'Mitra Saham',
      nameHi: 'मित्र सहम',
      category: 'Family & Relationships',
      dayA: pMap.Jupiter.lon,
      dayB: punyaLon,
      reverseAtNight: false,
      applyNeelakanthi: true,
      formulaEn: 'Jupiter - Punya + Lagna',
      formulaHi: 'बृहस्पति - पुण्य + लग्न',
      themeEn: 'Dependable friendships, alliances, trustworthy counselors and social synergy.',
      themeHi: 'सच्चे मित्र, विश्वासपात्र सहयोगी, परामर्शदाता व सौहार्दपूर्ण संबंध।',
    },
    {
      id: 'mahatmya',
      nameEn: 'Mahatmya Saham',
      nameHi: 'माहात्म्य सहम',
      category: 'Spiritual & Dharma',
      dayA: punyaLon,
      dayB: pMap.Mars.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Punya - Mars + Lagna' : 'Mars - Punya + Lagna',
      formulaHi: isDayBirth ? 'पुण्य - मंगल + लग्न' : 'मंगल - पुण्य + लग्न',
      themeEn: 'Nobility of soul, magnanimity, commanding presence and spiritual greatness.',
      themeHi: 'आत्मा की महानता, उदात्त चरित्र, प्रभावपूर्ण व्यक्तित्व व आध्यात्मिक गौरव।',
    },
    {
      id: 'asha',
      nameEn: 'Asha Saham',
      nameHi: 'आशा सहम',
      category: 'Enterprise & Travel',
      dayA: pMap.Saturn.lon,
      dayB: pMap.Moon.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Saturn - Moon + Lagna' : 'Moon - Saturn + Lagna',
      formulaHi: isDayBirth ? 'शनि - चंद्र + लग्न' : 'चंद्र - शनि + लग्न',
      themeEn: 'Realization of heartfelt aspirations, cherished hopes, and visionary goals.',
      themeHi: 'मनोकामना सिद्धि, आंतरिक अभिलाषाएं, आशावादी दृष्टि व स्वप्न पूर्ति।',
    },
    {
      id: 'samarthya',
      nameEn: 'Samarthya Saham',
      nameHi: 'सामर्थ्य सहम',
      category: 'Enterprise & Travel',
      dayA: pMap.Mars.lon,
      dayB: pMap[lagnaLord].lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Mars - LagnaLord + Lagna' : 'LagnaLord - Mars + Lagna',
      formulaHi: isDayBirth ? 'मंगल - लग्नेश + लग्न' : 'लग्नेश - मंगल + लग्न',
      themeEn: 'Executive competence, courage, competitive drive and capacity to execute.',
      themeHi: 'कार्यकुशलता, पराक्रम, रणनीतिक शक्ति व नेतृत्व क्षमता।',
    },
    {
      id: 'bhratri',
      nameEn: 'Bhratri Saham',
      nameHi: 'भ्रातृ सहम',
      category: 'Family & Relationships',
      dayA: pMap.Jupiter.lon,
      dayB: pMap.Saturn.lon,
      reverseAtNight: false,
      applyNeelakanthi: true,
      formulaEn: 'Jupiter - Saturn + Lagna',
      formulaHi: 'बृहस्पति - शनि + लग्न',
      themeEn: 'Fraternal warmth, sibling solidarity, support from brothers and kinsfolk.',
      themeHi: 'सहोदर भ्रातृ सुख, बंधुजनों का सहयोग व पारिवारिक एकता।',
    },
    {
      id: 'gaurava',
      nameEn: 'Gaurava Saham',
      nameHi: 'गौरव सहम',
      category: 'Wealth & Career',
      dayA: pMap.Jupiter.lon,
      dayB: pMap.Moon.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Jupiter - Moon + Lagna' : 'Moon - Jupiter + Lagna',
      formulaHi: isDayBirth ? 'बृहस्पति - चंद्र + लग्न' : 'चंद्र - बृहस्पति + लग्न',
      themeEn: 'Inherent dignity, self-respect, sovereign esteem and public veneration.',
      themeHi: 'आत्मसम्मान, कुलीनता, सामाजिक गरिमा व गुरुजनों द्वारा मान-सम्मान।',
    },
    {
      id: 'pitri',
      nameEn: 'Pitri Saham',
      nameHi: 'पितृ सहम',
      category: 'Family & Relationships',
      dayA: pMap.Saturn.lon,
      dayB: pMap.Sun.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Saturn - Sun + Lagna' : 'Sun - Saturn + Lagna',
      formulaHi: isDayBirth ? 'शनि - सूर्य + लग्न' : 'सूर्य - शनि + लग्न',
      themeEn: 'Paternal benevolence, fatherly guidance, ancestral heritage and patrimony.',
      themeHi: 'पितृ सुख, पिता का संरक्षण, पैतृक संपत्ति व पूर्वजों का आशीर्वाद।',
    },

    // 11-20
    {
      id: 'matri',
      nameEn: 'Matri Saham',
      nameHi: 'मातृ सहम',
      category: 'Family & Relationships',
      dayA: pMap.Moon.lon,
      dayB: pMap.Venus.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Moon - Venus + Lagna' : 'Venus - Moon + Lagna',
      formulaHi: isDayBirth ? 'चंद्र - शुक्र + लग्न' : 'शुक्र - चंद्र + लग्न',
      themeEn: 'Maternal affection, motherly shelter, domestic contentment and emotional roots.',
      themeHi: 'मातृ स्नेह, माता का वात्सल्य, गृह सौख्य व मानसिक शांति।',
    },
    {
      id: 'putra',
      nameEn: 'Putra Saham',
      nameHi: 'पुत्र सहम',
      category: 'Family & Relationships',
      dayA: pMap.Jupiter.lon,
      dayB: pMap.Moon.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Jupiter - Moon + Lagna' : 'Moon - Jupiter + Lagna',
      formulaHi: isDayBirth ? 'बृहस्पति - चंद्र + लग्न' : 'चंद्र - बृहस्पति + लग्न',
      themeEn: 'Offspring bliss, progeny flourishing, creative talents and lineage continuation.',
      themeHi: 'संतान सुख, पुत्र-पौत्र वृद्धि, मेधावी वंशज व सृजनात्मक आनंद।',
    },
    {
      id: 'jeeva',
      nameEn: 'Jeeva Saham',
      nameHi: 'जीव सहम',
      category: 'Vitality & Health',
      dayA: pMap.Saturn.lon,
      dayB: pMap.Jupiter.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Saturn - Jupiter + Lagna' : 'Jupiter - Saturn + Lagna',
      formulaHi: isDayBirth ? 'शनि - बृहस्पति + लग्न' : 'बृहस्पति - शनि + लग्न',
      themeEn: 'Pranic vitality, bodily longevity, immune resilience and lifeforce endurance.',
      themeHi: 'प्राण शक्ति, दीर्घायु, शारीरिक प्रतिकार क्षमता व आरोग्य रक्षा।',
    },
    {
      id: 'karma',
      nameEn: 'Karma Saham',
      nameHi: 'कर्म सहम',
      category: 'Wealth & Career',
      dayA: pMap.Mars.lon,
      dayB: pMap.Mercury.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Mars - Mercury + Lagna' : 'Mercury - Mars + Lagna',
      formulaHi: isDayBirth ? 'मंगल - बुध + लग्न' : 'बुध - मंगल + लग्न',
      themeEn: 'Professional apex, vocation, administrative achievements and purposeful deeds.',
      themeHi: 'आजीविका सिद्धि, कार्यक्षेत्र में उत्कर्ष, व्यवसाय विस्तार व निष्काम कर्म।',
    },
    {
      id: 'roga',
      nameEn: 'Roga Saham',
      nameHi: 'रोग सहम',
      category: 'Vitality & Health',
      dayA: ascLon,
      dayB: pMap.Moon.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Lagna - Moon + Lagna' : 'Moon - Lagna + Lagna',
      formulaHi: isDayBirth ? 'लग्न - चंद्र + लग्न' : 'चंद्र - लग्न + लग्न',
      themeEn: 'Vulnerability to seasonal illness, physical afflictions and bodily sensitivities.',
      themeHi: 'शारीरिक व्याधियां, मौसमी रोग संवेदनशीलता व स्वास्थ्य सावधानी।',
    },
    {
      id: 'kali',
      nameEn: 'Kali Saham',
      nameHi: 'कलि सहम',
      category: 'Enterprise & Travel',
      dayA: pMap.Jupiter.lon,
      dayB: pMap.Mars.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Jupiter - Mars + Lagna' : 'Mars - Jupiter + Lagna',
      formulaHi: isDayBirth ? 'बृहस्पति - मंगल + लग्न' : 'मंगल - बृहस्पति + लग्न',
      themeEn: 'Litigation hazards, civil friction, ideological quarrels and disputes.',
      themeHi: 'विवाद, अंतर्कलह, न्यायालयीन उलझनें व वैचारिक मतभेद।',
    },
    {
      id: 'shastra',
      nameEn: 'Shastra Saham',
      nameHi: 'शस्त्र सहम',
      category: 'Enterprise & Travel',
      dayA: pMap.Mars.lon,
      dayB: pMap.Saturn.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Mars - Saturn + Lagna' : 'Saturn - Mars + Lagna',
      formulaHi: isDayBirth ? 'मंगल - शनि + लग्न' : 'शनि - मंगल + लग्न',
      themeEn: 'Surgical skill, machinery aptitude, defense proficiency or risk of sharp injuries.',
      themeHi: 'शस्त्र-उपकरण संचालन, शल्य चिकित्सा कौशल, यांत्रिक दक्षता अथवा आघात भय।',
    },
    {
      id: 'bandhu',
      nameEn: 'Bandhu Saham',
      nameHi: 'बन्धु सहम',
      category: 'Family & Relationships',
      dayA: pMap.Mercury.lon,
      dayB: pMap.Moon.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Mercury - Moon + Lagna' : 'Moon - Mercury + Lagna',
      formulaHi: isDayBirth ? 'बुध - चंद्र + लग्न' : 'चंद्र - बुध + लग्न',
      themeEn: 'Clanship solidarity, extended family relationships and maternal relatives.',
      themeHi: 'नाते-रिश्तेदार, कुटुंबीय संबंध, ननिहाल पक्ष व सामाजिक बांधव।',
    },
    {
      id: 'mrityu',
      nameEn: 'Mrityu Saham',
      nameHi: 'मृत्यु सहम',
      category: 'Vitality & Health',
      dayA: getCusp(8),
      dayB: pMap.Moon.lon,
      reverseAtNight: false,
      applyNeelakanthi: true,
      formulaEn: 'H8 Cusp - Moon + Lagna',
      formulaHi: 'अष्टम भाव - चंद्र + लग्न',
      themeEn: 'Karmic crises, transformational life thresholds and vulnerability periods.',
      themeHi: 'गंभीर जीवन संक्रांति, संकट बिंदु, गूढ़ परिवर्तन व आत्म-रक्षा सजगता।',
    },
    {
      id: 'karyasiddhi',
      nameEn: 'Karyasiddhi Saham',
      nameHi: 'कार्य सिद्धि सहम',
      category: 'Wealth & Career',
      dayA: pMap.Saturn.lon,
      dayB: pMap.Sun.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Saturn - Sun + Lagna' : 'Sun - Saturn + Lagna',
      formulaHi: isDayBirth ? 'शनि - सूर्य + लग्न' : 'सूर्य - शनि + लग्न',
      themeEn: 'Fruitful completion of long-term projects, government sanctions and triumph.',
      themeHi: 'योजनाओं की निर्विघ्न पूर्णता, राजकार्य सिद्धि व अभीष्ट फल प्राप्ति।',
    },

    // 21-30
    {
      id: 'vivaha',
      nameEn: 'Vivaha Saham',
      nameHi: 'विवाह सहम',
      category: 'Family & Relationships',
      dayA: pMap.Venus.lon,
      dayB: pMap.Saturn.lon,
      reverseAtNight: false,
      applyNeelakanthi: true,
      formulaEn: 'Venus - Saturn + Lagna',
      formulaHi: 'शुक्र - शनि + लग्न',
      themeEn: 'Matrimonial union, spousal compatibility, wedding ceremonies and enduring companionship.',
      themeHi: 'विवाह बंधन, दांपत्य सामंजस्य, शुभ पाणिग्रहण व जीवनसाथी का सुख।',
    },
    {
      id: 'santana',
      nameEn: 'Santana Saham',
      nameHi: 'सन्तान सहम',
      category: 'Family & Relationships',
      dayA: pMap.Saturn.lon,
      dayB: pMap.Jupiter.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Saturn - Jupiter + Lagna' : 'Jupiter - Saturn + Lagna',
      formulaHi: isDayBirth ? 'शनि - बृहस्पति + लग्न' : 'बृहस्पति - शनि + लग्न',
      themeEn: 'Progeny continuity, childbirth timing, family expansion and generational legacy.',
      themeHi: 'वंश विस्तार, संतान प्राप्ति योग, पारिवारिक सुख व कुल वृद्धि।',
    },
    {
      id: 'shraddha',
      nameEn: 'Shraddha Saham',
      nameHi: 'श्रद्धा सहम',
      category: 'Spiritual & Dharma',
      dayA: pMap.Venus.lon,
      dayB: pMap.Mars.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Venus - Mars + Lagna' : 'Mars - Venus + Lagna',
      formulaHi: isDayBirth ? 'शुक्र - मंगल + लग्न' : 'मंगल - शुक्र + लग्न',
      themeEn: 'Spiritual fidelity, devotional faith, reverence for sacred traditions and sadhana.',
      themeHi: 'ईश्वरीय निष्ठा, गुरु-आस्था, धार्मिक नियम पालन व शुद्ध अंतःकरण।',
    },
    {
      id: 'preeti',
      nameEn: 'Preeti Saham',
      nameHi: 'प्रीति सहम',
      category: 'Family & Relationships',
      dayA: punyaLon,
      dayB: pMap.Sun.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Punya - Sun + Lagna' : 'Sun - Punya + Lagna',
      formulaHi: isDayBirth ? 'पुण्य - सूर्य + लग्न' : 'सूर्य - पुण्य + लग्न',
      themeEn: 'Romantic passion, interpersonal charm, genuine affection and loving bonds.',
      themeHi: 'परस्पर प्रेम, आकर्षण, आत्मीयता व आनंदमय सामाजिक संबंध।',
    },
    {
      id: 'jadya',
      nameEn: 'Jadya Saham',
      nameHi: 'जाड्य सहम',
      category: 'Vitality & Health',
      dayA: pMap.Mars.lon,
      dayB: pMap.Saturn.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Mars - Saturn + Lagna' : 'Saturn - Mars + Lagna',
      formulaHi: isDayBirth ? 'मंगल - शनि + लग्न' : 'शनि - मंगल + लग्न',
      themeEn: 'Mental lethargy, physical sluggishness, procrastination and lack of momentum.',
      themeHi: 'आलस्य, मानसिक सुस्ती, कार्यों में विलंब व ऊर्जा ह्रास।',
    },
    {
      id: 'vyapar',
      nameEn: 'Vyapar (Vanik) Saham',
      nameHi: 'वाणिज्य (व्यापार) सहम',
      category: 'Wealth & Career',
      dayA: pMap.Moon.lon,
      dayB: pMap.Mercury.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Moon - Mercury + Lagna' : 'Mercury - Moon + Lagna',
      formulaHi: isDayBirth ? 'चंद्र - बुध + लग्न' : 'बुध - चंद्र + लग्न',
      themeEn: 'Mercantile trading, commercial negotiations, retail profits and market transactions.',
      themeHi: 'व्यापारिक लाभ, क्रय-विक्रय, वित्तीय सौदे व वाणिज्यिक सफलता।',
    },
    {
      id: 'labha',
      nameEn: 'Labha Saham',
      nameHi: 'लाभ सहम',
      category: 'Wealth & Career',
      dayA: getCusp(11),
      dayB: pMap[h11Lord].lon,
      reverseAtNight: false,
      applyNeelakanthi: true,
      formulaEn: 'H11 Cusp - H11 Lord + Lagna',
      formulaHi: 'एकादश भाव - एकादशेश + लग्न',
      themeEn: 'Revenue influx, fulfilling desires, financial gains and professional incentives.',
      themeHi: 'प्रचुर धन लाभ, आय के नए स्रोत, मनोकामना पूर्ति व व्यापार वृद्धि।',
    },
    {
      id: 'dhana',
      nameEn: 'Dhana (Artha) Saham',
      nameHi: 'धन सहम',
      category: 'Wealth & Career',
      dayA: getCusp(2),
      dayB: pMap[h2Lord].lon,
      reverseAtNight: false,
      applyNeelakanthi: true,
      formulaEn: 'H2 Cusp - H2 Lord + Lagna',
      formulaHi: 'द्वितीय भाव - द्वितीयेश + लग्न',
      themeEn: 'Accumulated wealth, liquid savings, bullion, treasury and financial reserves.',
      themeHi: 'संचित धन, बैंक बैलेंस, स्वर्ण-रत्न संचय व स्थाई आर्थिक समृद्धि।',
    },
    {
      id: 'vyaya',
      nameEn: 'Vyaya Saham',
      nameHi: 'व्यय सहम',
      category: 'Wealth & Career',
      dayA: getCusp(12),
      dayB: pMap[h12Lord].lon,
      reverseAtNight: false,
      applyNeelakanthi: true,
      formulaEn: 'H12 Cusp - H12 Lord + Lagna',
      formulaHi: 'द्वादश भाव - द्वादशेश + लग्न',
      themeEn: 'Financial expenditures, philanthropic donations, investments or wasteful outflows.',
      themeHi: 'खर्च की अधिकता, शुभ व परोपकारी कार्यों में व्यय अथवा धन हानि।',
    },
    {
      id: 'sukha',
      nameEn: 'Sukha Saham',
      nameHi: 'सुख सहम',
      category: 'Spiritual & Dharma',
      dayA: pMap.Sun.lon,
      dayB: pMap.Jupiter.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Sun - Jupiter + Lagna' : 'Jupiter - Sun + Lagna',
      formulaHi: isDayBirth ? 'सूर्य - बृहस्पति + लग्न' : 'बृहस्पति - सूर्य + लग्न',
      themeEn: 'Serenity of soul, domestic bliss, tranquil dwelling and stress-free living.',
      themeHi: 'आंतरिक आनंद, मानसिक शांति, पारिवारिक सुख व संतोषप्रद जीवन।',
    },

    // 31-40
    {
      id: 'dainya',
      nameEn: 'Dainya Saham',
      nameHi: 'दैन्य सहम',
      category: 'Vitality & Health',
      dayA: pMap.Mercury.lon,
      dayB: pMap.Saturn.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Mercury - Saturn + Lagna' : 'Saturn - Mercury + Lagna',
      formulaHi: isDayBirth ? 'बुध - शनि + लग्न' : 'शनि - बुध + लग्न',
      themeEn: 'Feelings of deprivation, helplessness, austerity tests and humility lessons.',
      themeHi: 'कठिन परिस्थितियां, विवशता, आर्थिक तंगी व धैर्य की परीक्षा।',
    },
    {
      id: 'paradesha',
      nameEn: 'Paradesha Saham',
      nameHi: 'परदेश सहम',
      category: 'Enterprise & Travel',
      dayA: getCusp(9),
      dayB: pMap[h9Lord].lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'H9 Cusp - H9 Lord + Lagna' : 'H9 Lord - H9 Cusp + Lagna',
      formulaHi: isDayBirth ? 'नवम भाव - नवमेश + लग्न' : 'नवमेश - नवम भाव + लग्न',
      themeEn: 'Foreign shores settlement, overseas expeditions, cross-border success and diaspora living.',
      themeHi: 'विदेश गमन, सुदूर देशों में निवास, अंतर्राष्ट्रीय सफलता व विदेश व्यापार।',
    },
    {
      id: 'rajya',
      nameEn: 'Rajya Saham',
      nameHi: 'राज्य सहम',
      category: 'Wealth & Career',
      dayA: pMap.Saturn.lon,
      dayB: pMap.Mars.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Saturn - Mars + Lagna' : 'Mars - Saturn + Lagna',
      formulaHi: isDayBirth ? 'शनि - मंगल + लग्न' : 'मंगल - शनि + लग्न',
      themeEn: 'Executive sovereignty, political authority, ministerial honors and governmental sway.',
      themeHi: 'राज सत्ता, उच्च प्रशासनिक पद, शासकीय सम्मान व प्रभुत्व।',
    },
    {
      id: 'bhoga',
      nameEn: 'Bhoga Saham',
      nameHi: 'भोग सहम',
      category: 'Family & Relationships',
      dayA: pMap.Jupiter.lon,
      dayB: pMap.Venus.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Jupiter - Venus + Lagna' : 'Venus - Jupiter + Lagna',
      formulaHi: isDayBirth ? 'बृहस्पति - शुक्र + लग्न' : 'शुक्र - बृहस्पति + लग्न',
      themeEn: 'Sensual luxuries, sumptuous banquets, refined comfort, perfumes and elegance.',
      themeHi: 'विलासिता, भौतिक सुख-साधन, सुरुचिपूर्ण वस्त्र व उत्तम जीवनशैली।',
    },
    {
      id: 'shatru',
      nameEn: 'Shatru Saham',
      nameHi: 'शत्रु सहम',
      category: 'Enterprise & Travel',
      dayA: pMap.Mars.lon,
      dayB: pMap.Saturn.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Mars - Saturn + Lagna' : 'Saturn - Mars + Lagna',
      formulaHi: isDayBirth ? 'मंगल - शनि + लग्न' : 'शनि - मंगल + लग्न',
      themeEn: 'Antagonistic adversaries, competitive rivalries, hidden foes and defensive needs.',
      themeHi: 'शत्रु बाधा, प्रतिद्वंद्विता, ईर्ष्यालू व्यक्ति व सतर्कता की आवश्यकता।',
    },
    {
      id: 'bandhana',
      nameEn: 'Bandhana Saham',
      nameHi: 'बन्धन सहम',
      category: 'Vitality & Health',
      dayA: pMap.Saturn.lon,
      dayB: pMap.Moon.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Saturn - Moon + Lagna' : 'Moon - Saturn + Lagna',
      formulaHi: isDayBirth ? 'शनि - चंद्र + लग्न' : 'चंद्र - शनि + लग्न',
      themeEn: 'Confinement risks, contractual restrictions, institutional bounds or quarantine.',
      themeHi: 'बंधन योग, कानूनी पाबंदियां, परतंत्रता अथवा अवरोधकारी परिस्थितियां।',
    },
    {
      id: 'apamrityu',
      nameEn: 'Apamrityu Saham',
      nameHi: 'अपमृत्यु सहम',
      category: 'Vitality & Health',
      dayA: pMap.Mars.lon,
      dayB: ascLon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Mars - Lagna + Lagna' : 'Lagna - Mars + Lagna',
      formulaHi: isDayBirth ? 'मंगल - लग्न + लग्न' : 'लग्न - मंगल + लग्न',
      themeEn: 'Accidental hazards, sudden risks, transit alerts and requirement for protective kavach.',
      themeHi: 'आकस्मिक दुर्घटना भय, संकट सूचक बिंदु व महामृत्युंजय रक्षा की आवश्यकता।',
    },
    {
      id: 'stri',
      nameEn: 'Stri (Kanya) Saham',
      nameHi: 'स्त्री सहम',
      category: 'Family & Relationships',
      dayA: pMap.Venus.lon,
      dayB: pMap.Moon.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Venus - Moon + Lagna' : 'Moon - Venus + Lagna',
      formulaHi: isDayBirth ? 'शुक्र - चंद्र + लग्न' : 'चंद्र - शुक्र + लग्न',
      themeEn: 'Auspicious feminine partnerships, grace, spouse fortune and marital blessings.',
      themeHi: 'स्त्री पक्ष से लाभ, सुलक्षणा संगिनी, सौन्दर्य व नारी सम्मान।',
    },
    {
      id: 'jnati',
      nameEn: 'Jnati Saham',
      nameHi: 'ज्ञाति सहम',
      category: 'Family & Relationships',
      dayA: pMap.Jupiter.lon,
      dayB: pMap.Mercury.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Jupiter - Mercury + Lagna' : 'Mercury - Jupiter + Lagna',
      formulaHi: isDayBirth ? 'बृहस्पति - बुध + लग्न' : 'बुध - बृहस्पति + लग्न',
      themeEn: 'Communal fraternity, caste affairs, clan reunions and brotherhood gatherings.',
      themeHi: 'ज्ञाति-बिरादरी संपर्क, कुल परंपराएं, जातीय संबंध व बंधु मिलन।',
    },
    {
      id: 'prasava',
      nameEn: 'Prasava Saham',
      nameHi: 'प्रसव सहम',
      category: 'Family & Relationships',
      dayA: pMap.Jupiter.lon,
      dayB: pMap.Mars.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Jupiter - Mars + Lagna' : 'Mars - Jupiter + Lagna',
      formulaHi: isDayBirth ? 'बृहस्पति - मंगल + लग्न' : 'मंगल - बृहस्पति + लग्न',
      themeEn: 'Safe childbirth delivery, obstetric ease, maternal wellness and birth celebrations.',
      themeHi: 'सुलभ प्रसव, मातृत्व सुख, सुरक्षित शिशु जन्म व आनंदोत्सव।',
    },

    // 41-50
    {
      id: 'santaap',
      nameEn: 'Santaap Saham',
      nameHi: 'संताप सहम',
      category: 'Vitality & Health',
      dayA: pMap.Saturn.lon,
      dayB: pMap.Moon.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Saturn - Moon + Lagna' : 'Moon - Saturn + Lagna',
      formulaHi: isDayBirth ? 'शनि - चंद्र + लग्न' : 'चंद्र - शनि + लग्न',
      themeEn: 'Emotional grief, existential anxiety, pangs of separation and bereavement.',
      themeHi: 'मानसिक संताप, विरह वेदना, विषाद व धैर्य धारण की अनिवार्यता।',
    },
    {
      id: 'udyoga',
      nameEn: 'Udyoga Saham',
      nameHi: 'उद्योग सहम',
      category: 'Enterprise & Travel',
      dayA: pMap.Mars.lon,
      dayB: pMap.Saturn.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Mars - Saturn + Lagna' : 'Saturn - Mars + Lagna',
      formulaHi: isDayBirth ? 'मंगल - शनि + लग्न' : 'शनि - मंगल + लग्न',
      themeEn: 'Persevering industry, manufacturing ventures, tenacious effort and factory enterprises.',
      themeHi: 'कठिन परिश्रम, औद्योगिक उपक्रम, निर्माण कार्य व कर्मठता से उन्नति।',
    },
    {
      id: 'yatra',
      nameEn: 'Yatra Saham',
      nameHi: 'यात्रा सहम',
      category: 'Enterprise & Travel',
      dayA: getCusp(9),
      dayB: pMap.Moon.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'H9 Cusp - Moon + Lagna' : 'Moon - H9 Cusp + Lagna',
      formulaHi: isDayBirth ? 'नवम भाव - चंद्र + लग्न' : 'चंद्र - नवम भाव + लग्न',
      themeEn: 'Pilgrimage expeditions, domestic tours, educational travels and scenic wanderings.',
      themeHi: 'तीर्थाटन, सुखद यात्राएं, देशाटन व पर्यटन से ज्ञान लाभ।',
    },
    {
      id: 'jalapatha',
      nameEn: 'Jalapatha Saham',
      nameHi: 'जलयात्रा सहम',
      category: 'Enterprise & Travel',
      dayA: 105, // Cancer 15°
      dayB: pMap.Saturn.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Cancer 15° - Saturn + Lagna' : 'Saturn - Cancer 15° + Lagna',
      formulaHi: isDayBirth ? 'कर्क 15° - शनि + लग्न' : 'शनि - कर्क 15° + लग्न',
      themeEn: 'Maritime cruises, ocean freight, overseas water voyages and port commerce.',
      themeHi: 'समुद्री यात्राएं, जलमार्ग व्यापार, नौकायन व जलतत्वीय कार्य।',
    },
    {
      id: 'bhumi',
      nameEn: 'Bhumi Saham',
      nameHi: 'भूमि सहम',
      category: 'Wealth & Career',
      dayA: pMap.Mars.lon,
      dayB: pMap.Moon.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Mars - Moon + Lagna' : 'Moon - Mars + Lagna',
      formulaHi: isDayBirth ? 'मंगल - चंद्र + लग्न' : 'चंद्र - मंगल + लग्न',
      themeEn: 'Real estate acquisitions, agricultural fields, property appreciation and plots.',
      themeHi: 'कृषि भूमि, अचल संपत्ति, भू-भवन क्रय व स्थायी जायदाद लाभ।',
    },
    {
      id: 'vahan',
      nameEn: 'Vahan Saham',
      nameHi: 'वाहन सहम',
      category: 'Wealth & Career',
      dayA: pMap.Venus.lon,
      dayB: pMap.Moon.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Venus - Moon + Lagna' : 'Moon - Venus + Lagna',
      formulaHi: isDayBirth ? 'शुक्र - चंद्र + लग्न' : 'चंद्र - शुक्र + लग्न',
      themeEn: 'Automobile acquisitions, luxury conveyances, driving comfort and fleet ownership.',
      themeHi: 'उत्तम वाहन सुख, नई गाड़ी का क्रय, सवारी आनंद व यात्रा सुविधा।',
    },
    {
      id: 'daiva',
      nameEn: 'Daiva Saham',
      nameHi: 'दैव सहम',
      category: 'Spiritual & Dharma',
      dayA: pMap.Jupiter.lon,
      dayB: pMap.Sun.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Jupiter - Sun + Lagna' : 'Sun - Jupiter + Lagna',
      formulaHi: isDayBirth ? 'बृहस्पति - सूर्य + लग्न' : 'सूर्य - बृहस्पति + लग्न',
      themeEn: 'Divine intervention, unmerited grace, miraculous rescues and saintly providence.',
      themeHi: 'ईश्वरीय कृपा, अदृश्य दैवीय सहायता, संकटों से चमत्कारिक रक्षा व पुण्य उदय।',
    },
    {
      id: 'guru',
      nameEn: 'Guru Saham',
      nameHi: 'गुरु सहम',
      category: 'Spiritual & Dharma',
      dayA: pMap.Sun.lon,
      dayB: pMap.Jupiter.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Sun - Jupiter + Lagna' : 'Jupiter - Sun + Lagna',
      formulaHi: isDayBirth ? 'सूर्य - बृहस्पति + लग्न' : 'बृहस्पति - सूर्य + लग्न',
      themeEn: 'Spiritual preceptors, enlightened mentors, higher initiation and sacred mantras.',
      themeHi: 'सद्गुरु प्राप्ति, आध्यात्मिक दीक्षा, उच्च मार्गदर्शन व विद्या विस्तार।',
    },
    {
      id: 'mani',
      nameEn: 'Mani Saham',
      nameHi: 'मणि सहम',
      category: 'Wealth & Career',
      dayA: pMap.Moon.lon,
      dayB: pMap.Jupiter.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Moon - Jupiter + Lagna' : 'Jupiter - Moon + Lagna',
      formulaHi: isDayBirth ? 'चंद्र - बृहस्पति + लग्न' : 'बृहस्पति - चंद्र + लग्न',
      themeEn: 'Precious gemstones, diamond ornaments, royal heirlooms and valuable treasures.',
      themeHi: 'रत्न-आभूषण संचय, बहुमूल्य मणियां, पारिवारिक धरोहर व आभूषण सुख।',
    },
    {
      id: 'saukhya',
      nameEn: 'Saukhya Saham',
      nameHi: 'सौख्य सहम',
      category: 'Spiritual & Dharma',
      dayA: pMap.Moon.lon,
      dayB: pMap.Saturn.lon,
      reverseAtNight: true,
      applyNeelakanthi: true,
      formulaEn: isDayBirth ? 'Moon - Saturn + Lagna' : 'Saturn - Moon + Lagna',
      formulaHi: isDayBirth ? 'चंद्र - शनि + लग्न' : 'शनि - चंद्र + लग्न',
      themeEn: 'Wholesome lifestyle contentment, emotional tranquility, peace and satisfaction.',
      themeHi: 'सर्वांगीण सुख-शांति, मानसिक संतोष, स्वास्थ्य स्थिरता व निर्द्वन्द्व जीवन।',
    },
  ];

  const results: TajakaSahamResult[] = [];
  const catSummary: Record<string, number> = {
    'Spiritual & Dharma': 0,
    'Wealth & Career': 0,
    'Family & Relationships': 0,
    'Vitality & Health': 0,
    'Enterprise & Travel': 0,
  };

  for (const def of defs) {
    const lon = computeSahamPoint(
      def.dayA,
      def.dayB,
      ascLon,
      isDayBirth,
      def.reverseAtNight,
      def.applyNeelakanthi
    );

    const signIdx = Math.floor(lon / 30) % 12;
    const degInSign = lon - signIdx * 30;
    const signMeta = SIGNS[signIdx];
    const lord = signMeta.lord;
    const houseFromAsc = ((signIdx - chart.ascendant.signIndex + 12) % 12) + 1;

    // Check Ithasala Yoga between Saham Lord and planets
    let ithasalaFound = false;
    let ithasalaPartner: SevenPlanetId | undefined;
    let ithasalaAspect = '';
    let ithasalaEn = '';
    let ithasalaHi = '';

    const lordData = pMap[lord];
    const lordOrb = TAJAKA_DEEPTAMSHAS[lord];

    for (const [otherId, otherData] of Object.entries(pMap) as [SevenPlanetId, typeof pMap[SevenPlanetId]][]) {
      if (otherId === lord) continue;
      const otherOrb = TAJAKA_DEEPTAMSHAS[otherId];
      const maxOrb = (lordOrb + otherOrb) / 2;

      // Tajaka aspect houses: 1, 3, 5, 7, 9, 11 (Tajaka aspects exist on 1/7, 3/11, 5/9, 4/10)
      const hDiff = ((otherData.signIndex - lordData.signIndex + 12) % 12) + 1;
      const isTajakaAspect = [1, 3, 4, 5, 7, 9, 10, 11].includes(hDiff);

      if (isTajakaAspect) {
        // Check applying (Ithasala): faster planet is at lower degree in sign than slower planet
        const lordRank = PLANET_SPEED_RANK[lord];
        const otherRank = PLANET_SPEED_RANK[otherId];
        const isLordFaster = lordRank < otherRank;

        const faster = isLordFaster ? lordData : otherData;
        const slower = isLordFaster ? otherData : lordData;
        const fasterId = isLordFaster ? lord : otherId;
        const slowerId = isLordFaster ? otherId : lord;

        const degDiff = slower.deg - faster.deg;
        if (degDiff > 0 && degDiff <= maxOrb) {
          ithasalaFound = true;
          ithasalaPartner = otherId;
          ithasalaAspect = `${hDiff}th Tajaka aspect`;
          ithasalaEn = `Active Ithasala Yoga with ${otherId} (applying by ${degDiff.toFixed(2)}°, within orb ${maxOrb.toFixed(1)}°). Promises swift fruition.`;
          ithasalaHi = `${otherId} के साथ सक्रिय इत्थशाल योग (${degDiff.toFixed(2)}° का संसर्ग, दीप्तांश ${maxOrb.toFixed(1)}°)। शीघ्र फल प्राप्ति का स्पष्ट संकेत।`;
          break;
        }
      }
    }

    if (!ithasalaFound) {
      ithasalaEn = 'No active applying Ithasala yoga at this time; manifestations follow standard Dasha and transit cycles.';
      ithasalaHi = 'वर्तमान में सक्रिय इत्थशाल योग नहीं है; सामान्य दशा व गोचर चक्र के अनुसार फल प्राप्त होंगे।';
    }

    // Determine verdict
    let verdict: TajakaSahamResult['verdict'] = 'Neutral';
    const isKendraOrTrikona = [1, 4, 5, 7, 9, 10, 11].includes(houseFromAsc);
    const isDushtana = [6, 8, 12].includes(houseFromAsc);

    if (ithasalaFound && isKendraOrTrikona) {
      verdict = 'Exalted / Highly Favorable';
    } else if (isKendraOrTrikona) {
      verdict = 'Auspicious';
    } else if (isDushtana) {
      verdict = 'Challenging / Remedial';
    } else {
      verdict = 'Neutral';
    }

    // Predictions
    const predEn = `${def.nameEn} occupies House ${houseFromAsc} in ${signMeta.name} ruled by ${lord}. ${def.themeEn} ${
      verdict === 'Exalted / Highly Favorable'
        ? 'Empowered by active Tajaka alignment; indicates effortless prosperity and triumphant breakthrough.'
        : verdict === 'Auspicious'
          ? 'Well-stationed in an auspicious house; promises steady support and tangible growth.'
          : verdict === 'Challenging / Remedial'
            ? 'Placed in a dusthana/trik house; demands conscious patience, moral rectitude, and disciplined remedy.'
            : 'Moderate baseline strength; blossoms during transits of its ruling planet.'
    }`;

    const predHi = `${def.nameHi} लग्न से ${houseFromAsc}वें भाव (${signMeta.name}, स्वामी: ${lord}) में स्थित है। ${def.themeHi} ${
      verdict === 'Exalted / Highly Favorable'
        ? 'सक्रिय ताजिक योग द्वारा अत्यधिक सबल; अभीष्ट फल की सहज प्राप्ति व विजय का प्रबल सूचक।'
        : verdict === 'Auspicious'
          ? 'शुभ स्थान में स्थित; निरंतर सहयोग व अनुकूल प्रगति सुनिश्चित करता है।'
          : verdict === 'Challenging / Remedial'
            ? 'त्रिक भाव में होने से धैर्य, अनुशासन व ईश्वरीय उपासना आवश्यक।'
            : 'सामान्य प्रभाव; संबंधित ग्रह के गोचर काल में विशेष सक्रिय होगा।'
    }`;

    catSummary[def.category] = (catSummary[def.category] || 0) + 1;

    results.push({
      id: def.id,
      nameEn: def.nameEn,
      nameHi: def.nameHi,
      category: def.category,
      longitude: Math.round(lon * 100) / 100,
      signIndex: signIdx,
      signName: signMeta.name,
      degreeInSign: Math.round(degInSign * 100) / 100,
      dms: formatDms(degInSign),
      house: houseFromAsc,
      lord,
      formulaDescriptionEn: def.formulaEn,
      formulaDescriptionHi: def.formulaHi,
      ithasalaYoga: {
        exists: ithasalaFound,
        partnerPlanet: ithasalaPartner,
        aspectType: ithasalaAspect,
        descriptionEn: ithasalaEn,
        descriptionHi: ithasalaHi,
      },
      verdict,
      predictionEn: predEn,
      predictionHi: predHi,
    });
  }

  // Filter prominent sahams (Punya, Vidya, Yashas, Karma, Dhana, Labha, Vivaha, Karyasiddhi)
  const keyIds = ['punya', 'vidya', 'yashas', 'karma', 'dhana', 'labha', 'vivaha', 'karyasiddhi', 'sukha', 'daiva'];
  const prominent = results.filter((s) => keyIds.includes(s.id));

  return {
    isDayBirth,
    birthTypeEn: isDayBirth ? 'Diurnal (Day Birth - Sun in Houses 7 to 12)' : 'Nocturnal (Night Birth - Sun in Houses 1 to 6)',
    birthTypeHi: isDayBirth ? 'दिन का जन्म (सूर्य 7वें से 12वें भाव में)' : 'रात्रि का जन्म (सूर्य 1ले से 6ठे भाव में)',
    sahams: results,
    categorySummary: catSummary,
    prominentSahams: prominent,
  };
}
