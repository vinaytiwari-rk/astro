import type { SevenPlanetId } from '../types';
import { SIGNS } from '../constants';

export interface FunctionalLordship {
  planet: SevenPlanetId;
  ownedHouses: number[];
  rolesEn: string[];
  rolesHi: string[];
  /** A classical yoga-karaka ownership pattern: at least one non-Lagna kendra and one non-Lagna trikona. */
  yogakarakaProfile: boolean;
  /** Traditional kendradhipati caution for natural benefics owning kendras without Lagna/trikona lordship. */
  kendradhipatiCaution: boolean;
  ownsMarakaHouse: boolean;
  ownsDusthana: boolean;
  ownsTrikona: boolean;
  ownsKendra: boolean;
  noteEn: string;
  noteHi: string;
}

const ROLE_LABELS: Record<number, { en: string; hi: string }> = {
  1: { en: 'Lagna lord (self and vitality)', hi: 'लग्नेश (स्वयं एवं जीवन-शक्ति)' },
  2: { en: 'Dhana lord; also a maraka-house lord', hi: 'धनेश; साथ में मारक-भाव स्वामी' },
  3: { en: 'Upachaya lord (effort and initiative)', hi: 'उपचयेश (परिश्रम एवं पहल)' },
  4: { en: 'Kendra lord (foundation and stability)', hi: 'केंद्रेश (सुख एवं स्थिरता)' },
  5: { en: 'Trikona lord (intelligence and merit)', hi: 'त्रिकोणेश (बुद्धि एवं पूर्व पुण्य)' },
  6: { en: 'Dusthana and Upachaya lord (conflict, service and effort)', hi: 'दुष्थान एवं उपचयेश (संघर्ष, सेवा एवं प्रयास)' },
  7: { en: 'Kendra and maraka-house lord (partnerships)', hi: 'केंद्रेश एवं मारक-भाव स्वामी (साझेदारी)' },
  8: { en: 'Dusthana lord (transformation and vulnerability)', hi: 'दुष्थानेश (परिवर्तन एवं संवेदनशीलता)' },
  9: { en: 'Trikona lord (fortune and dharma)', hi: 'त्रिकोणेश (भाग्य एवं धर्म)' },
  10: { en: 'Kendra lord (career and action)', hi: 'केंद्रेश (कर्म एवं आजीविका)' },
  11: { en: 'Upachaya lord (gains and networks)', hi: 'उपचयेश (लाभ एवं संपर्क)' },
  12: { en: 'Dusthana lord (expenditure and release)', hi: 'दुष्थानेश (व्यय एवं मोक्ष)' },
};

const NATURAL_BENEFICS = new Set<SevenPlanetId>(['Jupiter', 'Venus', 'Mercury', 'Moon']);
const KENDRA_HOUSES = [4, 7, 10];
const TRIKONA_HOUSES = [5, 9];
const DUSTHANA_HOUSES = [6, 8, 12];
const MARAKA_HOUSES = [2, 7];

export function getFunctionalLordship(planet: SevenPlanetId, ascendantSignIndex: number): FunctionalLordship {
  if (!Number.isInteger(ascendantSignIndex) || ascendantSignIndex < 0 || ascendantSignIndex > 11) {
    throw new RangeError('Ascendant sign index must be an integer from 0 to 11.');
  }

  const ownedHouses: number[] = [];
  for (let house = 1; house <= 12; house++) {
    const signIndex = (ascendantSignIndex + house - 1) % 12;
    if (SIGNS[signIndex]?.lord === planet) ownedHouses.push(house);
  }

  const rolesEn = ownedHouses.map((house) => ROLE_LABELS[house].en);
  const rolesHi = ownedHouses.map((house) => ROLE_LABELS[house].hi);
  const ownsKendra = ownedHouses.some((house) => KENDRA_HOUSES.includes(house));
  const ownsTrikona = ownedHouses.some((house) => TRIKONA_HOUSES.includes(house));
  const yogakarakaProfile = ownsKendra && ownsTrikona;
  const kendradhipatiCaution = NATURAL_BENEFICS.has(planet)
    && ownsKendra
    && !ownsTrikona
    && !ownedHouses.includes(1);
  const ownsMarakaHouse = ownedHouses.some((house) => MARAKA_HOUSES.includes(house));
  const ownsDusthana = ownedHouses.some((house) => DUSTHANA_HOUSES.includes(house));

  if (yogakarakaProfile) {
    rolesEn.push('Yogakaraka ownership pattern (Kendra + Trikona)');
    rolesHi.push('योगकारक स्वामित्व-योग (केंद्र + त्रिकोण)');
  }
  if (kendradhipatiCaution) {
    rolesEn.push('Kendradhipati caution (natural benefic owns a Kendra without Trikona/Lagna ownership)');
    rolesHi.push('केंद्राधिपति विचार (स्वाभाविक शुभ ग्रह का केंद्र स्वामित्व, बिना त्रिकोण/लग्न स्वामित्व)');
  }
  if (ownsMarakaHouse) {
    rolesEn.push('Maraka-house ownership (2nd/7th); not a prediction of harm');
    rolesHi.push('मारक भाव स्वामित्व (2/7); इसे अनिष्ट की भविष्यवाणी न मानें');
  }

  return {
    planet,
    ownedHouses,
    rolesEn,
    rolesHi,
    yogakarakaProfile,
    kendradhipatiCaution,
    ownsMarakaHouse,
    ownsDusthana,
    ownsTrikona,
    ownsKendra,
    noteEn: rolesEn.length
      ? 'This is a house-ownership profile, not a final benefic/malefic verdict. Yogakaraka and Kendradhipati flags describe traditional rule patterns only; judge them with dignity, placement, aspects, strength, conjunctions and the running dasha. Maraka ownership alone does not predict illness or death.'
      : 'No classical house ownership was assigned.',
    noteHi: rolesHi.length
      ? 'यह भाव-स्वामित्व का विवरण है, अंतिम शुभ/अशुभ निर्णय नहीं। योगकारक और केंद्राधिपति संकेत केवल पारंपरिक नियम-पैटर्न बताते हैं; अंतिम विचार राशि-गरिमा, स्थिति, दृष्टि, बल, युति और चल रही दशा से करें। केवल मारक भाव का स्वामित्व बीमारी या मृत्यु की भविष्यवाणी नहीं करता।'
      : 'इस ग्रह को कोई पारंपरिक भाव-स्वामित्व नहीं दिया गया है।',
  };
}
