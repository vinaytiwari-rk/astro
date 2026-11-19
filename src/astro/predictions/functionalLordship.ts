import type { SevenPlanetId } from '../types';
import { SIGNS } from '../constants';

export interface FunctionalLordship {
  planet: SevenPlanetId;
  ownedHouses: number[];
  rolesEn: string[];
  rolesHi: string[];
  /** This is a lordship profile, not a single benefic/malefic verdict. */
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

export function getFunctionalLordship(planet: SevenPlanetId, ascendantSignIndex: number): FunctionalLordship {
  const ownedHouses: number[] = [];
  for (let house = 1; house <= 12; house++) {
    const signIndex = (ascendantSignIndex + house - 1) % 12;
    if (SIGNS[signIndex]?.lord === planet) ownedHouses.push(house);
  }
  const rolesEn = ownedHouses.map((house) => ROLE_LABELS[house].en);
  const rolesHi = ownedHouses.map((house) => ROLE_LABELS[house].hi);
  return {
    planet,
    ownedHouses,
    rolesEn,
    rolesHi,
    noteEn: rolesEn.length
      ? 'Functional role is described through house ownership. Where one planet owns different house types, their indications must be judged together with dignity, placement, aspects, strength and dasha; this is not a standalone benefic/malefic label.'
      : 'No classical house ownership was assigned.',
    noteHi: rolesHi.length
      ? 'ग्रह की कार्यात्मक भूमिका उसके भाव-स्वामित्व से दिखाई गई है। एक ग्रह के अलग-अलग प्रकार के भावों का स्वामित्व हो तो गरिमा, स्थिति, दृष्टि, बल और दशा के साथ संयुक्त निर्णय करें; यह अपने-आप शुभ/अशुभ की अंतिम संज्ञा नहीं है।'
      : 'इस ग्रह को कोई पारंपरिक भाव-स्वामित्व नहीं दिया गया है।',
  };
}
