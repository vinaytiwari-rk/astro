/**
 * Extended Vedic Medical Astrology Conditions Database
 * Covers 24 clinical-system clusters derived from classical Iatromathematics
 * (Heart, BP, Diabetes, Asthma/Bronchitis/TB, Liver/Cirrhosis/Spleen,
 * Appendicitis/Colic/Ulcers/Bowel/Piles, Kidney/Stones/Urinary/Dropsy,
 * Cataract/Night Blindness/Eyes, Deafness/Ear/Dental/Speech,
 * Brain/Epilepsy/Paralysis/Mental, Skin/Leukoderma, Rheumatism/Gout/Fractures/Accidents,
 * Tumors/Glands, Reproductive/Prostate/Menstrual/Uterus).
 *
 * All outputs are framed strictly as preventive astrological awareness,
 * never as medical diagnosis or replacement for a physician.
 */

import type { BodyPosition, NineGrahaId } from '../types';

export type ExtendedMedicalPlanet = BodyPosition & { placedHouse: number };

export interface ExtendedMedicalConditionMatch {
  id: string;
  systemGroup:
    | 'Cardiac & Vascular'
    | 'Respiratory & Pulmonary'
    | 'Digestive, Hepatic & Bowel'
    | 'Renal & Urinary'
    | 'Metabolic & Endocrine'
    | 'Ophthalmic, ENT & Dental'
    | 'Neurological & Mental'
    | 'Musculoskeletal & Trauma'
    | 'Dermatological'
    | 'Reproductive & Glandular';
  conditionEn: string;
  conditionHi: string;
  riskLevel: 'Low' | 'Watch' | 'Elevated';
  matchedBasisEn: string;
  matchedBasisHi: string;
  preventiveTipEn: string;
  preventiveTipHi: string;
}

interface ConditionRule {
  id: string;
  systemGroup: ExtendedMedicalConditionMatch['systemGroup'];
  conditionEn: string;
  conditionHi: string;
  check: (ctx: MedEvalCtx) => { matched: boolean; score: number; basisEn: string; basisHi: string };
  preventiveTipEn: string;
  preventiveTipHi: string;
}

interface MedEvalCtx {
  getP: (id: NineGrahaId) => ExtendedMedicalPlanet | undefined;
  inHouses: (id: NineGrahaId, houses: number[]) => boolean;
  inSigns: (id: NineGrahaId, signs: number[]) => boolean;
  sameHouse: (a: NineGrahaId, b: NineGrahaId) => boolean;
  isAfflicted: (id: NineGrahaId) => boolean;
  houseHasAny: (house: number, ids: NineGrahaId[]) => boolean;
}

const CONDITION_RULES: ConditionRule[] = [
  // 1. Cardiac & Vascular
  {
    id: 'med_heart_ailments',
    systemGroup: 'Cardiac & Vascular',
    conditionEn: 'Cardiac & Heart Vitality Care',
    conditionHi: 'हृदय एवं कार्डियक स्वास्थ्य सतर्कता',
    check: (c) => {
      const sunAff = c.isAfflicted('Sun');
      const h4Mal = c.houseHasAny(4, ['Saturn', 'Mars', 'Rahu', 'Ketu']);
      const jupShield = c.houseHasAny(4, ['Jupiter']) || c.sameHouse('Sun', 'Jupiter');
      if ((sunAff || h4Mal) && !jupShield) {
        return {
          matched: true,
          score: sunAff && h4Mal ? 2 : 1,
          basisEn: '4th house / Sun axis receives malefic pressure without Jupiter shield',
          basisHi: 'चतुर्थ भाव अथवा सूर्य अक्ष पर क्रूर प्रभाव (गुरु रक्षण रहित)',
        };
      }
      return { matched: false, score: 0, basisEn: '', basisHi: '' };
    },
    preventiveTipEn: 'Regular lipid/ECG checkups, brisk morning walks, low-sodium sattvic diet, and stress management.',
    preventiveTipHi: 'नियमित हृदय/ईसीजी जांच, प्रातः टहलना, कम नमक वाला सात्विक आहार व तनाव नियंत्रण।',
  },
  {
    id: 'med_blood_pressure',
    systemGroup: 'Cardiac & Vascular',
    conditionEn: 'Blood Pressure (Hypertension / Fluctuation)',
    conditionHi: 'रक्तचाप (ब्लड प्रेशर) संतुलन',
    check: (c) => {
      if (c.sameHouse('Mars', 'Moon') || c.sameHouse('Mars', 'Sun') || c.sameHouse('Mars', 'Rahu')) {
        return {
          matched: true,
          score: 2,
          basisEn: 'Mars conjoins Sun/Moon/Rahu, elevating Pitta-vascular pressure',
          basisHi: 'मंगल की सूर्य/चंद्र/राहु से युति रक्तचाप में उतार-चढ़ाव दर्शाती है',
        };
      }
      return { matched: false, score: 0, basisEn: '', basisHi: '' };
    },
    preventiveTipEn: 'Monitor BP periodically, limit excess salt/caffeine, and practice Sheetali/Anulom-Vilom Pranayama.',
    preventiveTipHi: 'रक्तचाप की नियमित जांच, अत्यधिक नमक/कैफीन से बचाव व अनुलोम-विलोम प्राणायाम।',
  },

  // 2. Respiratory & Pulmonary
  {
    id: 'med_asthma_bronchitis',
    systemGroup: 'Respiratory & Pulmonary',
    conditionEn: 'Asthma, Bronchitis & Respiratory Sensitivity',
    conditionHi: 'दमा, ब्रोंकाइटिस एवं श्वास-नली संवेदनशीलता',
    check: (c) => {
      const moonSat = c.sameHouse('Moon', 'Saturn') || c.sameHouse('Moon', 'Rahu');
      const h4Air = c.houseHasAny(4, ['Saturn', 'Rahu', 'Mercury']) && (c.inHouses('Moon', [6, 8, 12]) || moonSat);
      if (moonSat || h4Air) {
        return {
          matched: true,
          score: moonSat && h4Air ? 2 : 1,
          basisEn: 'Moon-Saturn/Rahu or 4th-house bronchial axis shows cold/Vata sensitivity',
          basisHi: 'चंद्र-शनि/राहु या चतुर्थ भाव पर शीत/वात प्रभाव',
        };
      }
      return { matched: false, score: 0, basisEn: '', basisHi: '' };
    },
    preventiveTipEn: 'Avoid cold/dusty triggers, keep chest warm in winter, and practice deep diaphragmatic breathing.',
    preventiveTipHi: 'ठंड व धूल से बचाव, गुनगुना जल सेवन तथा नियमित श्वसन प्राणायाम।',
  },
  {
    id: 'med_lungs_pleurisy_tb',
    systemGroup: 'Respiratory & Pulmonary',
    conditionEn: 'Lung & Pulmonary Immunity (Pleurisy / Chronic Cough)',
    conditionHi: 'फेफड़ों व फुफ्फुस की प्रतिरक्षा (दीर्घकालिक खांसी/कफ)',
    check: (c) => {
      if ((c.inSigns('Moon', [2, 3, 5]) && c.isAfflicted('Moon')) || (c.inHouses('Saturn', [4]) && c.inHouses('Mars', [4]))) {
        return {
          matched: true,
          score: 1,
          basisEn: 'Afflicted Moon in respiratory signs or Mars-Saturn in 4th house',
          basisHi: 'श्वसन राशियों में पीड़ित चंद्र अथवा चतुर्थ में मंगल-शनि',
        };
      }
      return { matched: false, score: 0, basisEn: '', basisHi: '' };
    },
    preventiveTipEn: 'Maintain smoke-free air quality, timely treatment for persistent cough, and warm herbal fluids.',
    preventiveTipHi: 'धुएं/प्रदूषण से बचाव, लगातार खांसी में शीघ्र चिकित्सकीय जांच व गर्म काढ़ा।',
  },

  // 3. Digestive, Hepatic & Bowel
  {
    id: 'med_liver_cirrhosis',
    systemGroup: 'Digestive, Hepatic & Bowel',
    conditionEn: 'Liver, Bilious (Pitta) & Hepatic Care',
    conditionHi: 'यकृत (लिवर) एवं पित्त विकार सतर्कता',
    check: (c) => {
      const jupAff = c.isAfflicted('Jupiter') || c.inHouses('Jupiter', [6, 8, 12]);
      if (jupAff && (c.sameHouse('Jupiter', 'Rahu') || c.sameHouse('Jupiter', 'Mars') || c.inHouses('Mars', [5]))) {
        return {
          matched: true,
          score: 2,
          basisEn: 'Jupiter afflicted in 6/8/12 or by Rahu/Mars indicates hepatic/bilious sensitivity',
          basisHi: 'गुरु के ६/८/१२ या राहु/मंगल से प्रभावित होने पर यकृत व पित्त सतर्कता',
        };
      }
      return { matched: false, score: 0, basisEn: '', basisHi: '' };
    },
    preventiveTipEn: 'Avoid alcohol/fried excess, prioritize bitter-greens/turmeric in diet, and periodic LFT checkups.',
    preventiveTipHi: 'तले-भुने व मादक पदार्थों से पूर्ण परहेज, हल्का सुपाच्य भोजन व लिवर फंक्शन जांच।',
  },
  {
    id: 'med_stomach_ulcers_colic',
    systemGroup: 'Digestive, Hepatic & Bowel',
    conditionEn: 'Stomach, Gastric Ulcers & Colic Care',
    conditionHi: 'आमाशय, अल्सर एवं उदर-शूल देखभाल',
    check: (c) => {
      if (c.houseHasAny(5, ['Mars', 'Sun', 'Rahu', 'Ketu']) || c.houseHasAny(6, ['Mars', 'Sun'])) {
        return {
          matched: true,
          score: 1,
          basisEn: 'Fiery/nodal planets in 5th or 6th house elevate gastric Pitta acidity',
          basisHi: 'पंचम या षष्ठ भाव में अग्नि/क्रूर ग्रह पाचक पित्त बढ़ाते हैं',
        };
      }
      return { matched: false, score: 0, basisEn: '', basisHi: '' };
    },
    preventiveTipEn: 'Eat meals on fixed schedules, avoid skipping breakfast, and limit excess red chili/acidic foods.',
    preventiveTipHi: 'नियमित समय पर भोजन, खाली पेट न रहना तथा अत्यधिक मिर्च-खटाई से परहेज।',
  },
  {
    id: 'med_appendicitis_bowel_piles',
    systemGroup: 'Digestive, Hepatic & Bowel',
    conditionEn: 'Bowel, Appendicitis, Spleen & Piles Hygiene',
    conditionHi: 'आंत, अपेंडिक्स, प्लीहा एवं बवासीर/पाचन स्वच्छता',
    check: (c) => {
      const h68 = c.houseHasAny(6, ['Saturn', 'Ketu', 'Rahu']) || c.houseHasAny(8, ['Mars', 'Saturn']);
      if (h68 && (c.inSigns('Mars', [5, 7]) || c.inSigns('Saturn', [5, 7]))) {
        return {
          matched: true,
          score: 1,
          basisEn: '6th/8th house malefics with Virgo/Scorpio Mars-Saturn activate lower-bowel sensitivity',
          basisHi: 'षष्ठ/अष्टम में क्रूर ग्रह व कन्या/वृश्चिक में मंगल-शनि आंत संवेदनशीलता दर्शाते हैं',
        };
      }
      return { matched: false, score: 0, basisEn: '', basisHi: '' };
    },
    preventiveTipEn: 'High-fiber whole grains, adequate hydration, and avoiding prolonged sitting without movement.',
    preventiveTipHi: 'रेशेदार (फाइबर युक्त) आहार, पर्याप्त पानी व नियमित शारीरिक सक्रियता।',
  },

  // 4. Renal & Urinary
  {
    id: 'med_kidney_stones_urinary',
    systemGroup: 'Renal & Urinary',
    conditionEn: 'Kidney, Urinary Tract & Stone Prevention',
    conditionHi: 'किडनी, मूत्र-तंत्र एवं पथरी बचाव',
    check: (c) => {
      if (c.sameHouse('Venus', 'Mars') || c.sameHouse('Venus', 'Saturn') || c.inHouses('Venus', [6, 8]) || c.inSigns('Mars', [6])) {
        return {
          matched: true,
          score: c.sameHouse('Venus', 'Saturn') || c.inHouses('Venus', [6, 8]) ? 2 : 1,
          basisEn: 'Venus afflicted in 6/8 or with Mars/Saturn (or Libra Mars) highlights renal/stone vigilance',
          basisHi: '६/८ में शुक्र अथवा शुक्र-मंगल/शनि संबंध मूत्र व पथरी सतर्कता दर्शाता है',
        };
      }
      return { matched: false, score: 0, basisEn: '', basisHi: '' };
    },
    preventiveTipEn: 'Drink 2.5–3L water daily, moderate high-oxalate foods, and never suppress natural urges.',
    preventiveTipHi: 'प्रतिदिन पर्याप्त शुद्ध जल पिएं, संतुलित खनिज आहार लें व मूत्र वेग न रोकें।',
  },

  // 5. Metabolic & Endocrine
  {
    id: 'med_diabetes_prameha',
    systemGroup: 'Metabolic & Endocrine',
    conditionEn: 'Diabetes (Prameha) & Glycemic Balance',
    conditionHi: 'मधुमेह (प्रमेह) एवं शुगर संतुलन',
    check: (c) => {
      const venJupStrained = (c.inHouses('Venus', [6, 8, 12]) || c.isAfflicted('Venus')) && (c.inHouses('Jupiter', [6, 8, 12]) || c.isAfflicted('Jupiter'));
      const waterKapha = c.inSigns('Venus', [3, 7, 11]) && c.isAfflicted('Venus');
      if (venJupStrained || waterKapha) {
        return {
          matched: true,
          score: venJupStrained ? 2 : 1,
          basisEn: 'Venus-Jupiter metabolic axis in 6/8/12 or watery signs suggests glycemic vigilance',
          basisHi: 'शुक्र-गुरु का ६/८/१२ या जलीय राशि में दबाव चयापचय व शुगर सतर्कता दर्शाता है',
        };
      }
      return { matched: false, score: 0, basisEn: '', basisHi: '' };
    },
    preventiveTipEn: 'Annual HbA1c screening, daily 30-min post-meal walks, and reducing refined sugars.',
    preventiveTipHi: 'वार्षिक शुगर (HbA1c) जांच, भोजन के बाद टहलना व मीठे/रिफाइंड कार्ब्स में संयम।',
  },

  // 6. Ophthalmic, ENT & Dental
  {
    id: 'med_eyes_cataract_nightblind',
    systemGroup: 'Ophthalmic, ENT & Dental',
    conditionEn: 'Eyesight, Cataract & Optic Care (2nd/12th Luminaries)',
    conditionHi: 'नेत्र ज्योति, मोतियाबिंद व दृष्टि सुरक्षा (२/१२ सूर्य-चंद्र)',
    check: (c) => {
      if (c.inHouses('Sun', [2, 12, 6, 8]) || c.inHouses('Moon', [2, 12]) || c.sameHouse('Sun', 'Moon') && c.isAfflicted('Sun')) {
        return {
          matched: true,
          score: c.inHouses('Sun', [2, 12]) && c.inHouses('Moon', [2, 12]) ? 2 : 1,
          basisEn: 'Sun/Moon in 2nd (right eye) or 12th (left eye) indicates routine optic care',
          basisHi: 'द्वितीय (दायां नेत्र) या द्वादश (बायां नेत्र) में सूर्य/चंद्र नेत्र देखभाल दर्शाते हैं',
        };
      }
      return { matched: false, score: 0, basisEn: '', basisHi: '' };
    },
    preventiveTipEn: 'Annual eye exams, screen-time breaks (20-20-20 rule), and Vitamin-A rich green/orange foods.',
    preventiveTipHi: 'वार्षिक नेत्र परीक्षण, स्क्रीन से विश्राम व विटामिन-ए युक्त हरी सब्ज़ियाँ/गाजर।',
  },
  {
    id: 'med_ent_dental_speech',
    systemGroup: 'Ophthalmic, ENT & Dental',
    conditionEn: 'Dental, Ear (ENT) & Throat/Speech Hygiene',
    conditionHi: 'दंत, कान (ENT), गला व वाणी देखभाल',
    check: (c) => {
      if (c.houseHasAny(2, ['Saturn', 'Mars', 'Rahu', 'Ketu']) || c.houseHasAny(3, ['Saturn', 'Ketu']) || c.houseHasAny(11, ['Saturn', 'Ketu'])) {
        return {
          matched: true,
          score: 1,
          basisEn: '2nd house (teeth/mouth) or 3rd/11th (ears) hosts Saturn/Mars/nodes',
          basisHi: 'द्वितीय (दांत/मुख) या तृतीय/एकादश (कान) में शनि/मंगल/राहु-केतु का प्रभाव',
        };
      }
      return { matched: false, score: 0, basisEn: '', basisHi: '' };
    },
    preventiveTipEn: 'Twice-yearly dental checkups, avoiding excessive cold/loud-noise exposure, and warm saline gargles.',
    preventiveTipHi: 'नियमित दंत स्वच्छता, तेज शोर से कानों की सुरक्षा व गुनगुने नमक पानी के गरारे।',
  },

  // 7. Neurological & Mental
  {
    id: 'med_brain_mental_epilepsy',
    systemGroup: 'Neurological & Mental',
    conditionEn: 'Nervous System, Sleep & Stress-Seizure Threshold',
    conditionHi: 'मस्तिष्क, स्नायु तंत्र, निद्रा एवं मानसिक तनाव सुरक्षा',
    check: (c) => {
      const moonAff = c.sameHouse('Moon', 'Rahu') || c.sameHouse('Moon', 'Ketu') || c.sameHouse('Moon', 'Saturn');
      const mercAff = c.sameHouse('Mercury', 'Rahu') || c.sameHouse('Mercury', 'Mars');
      if (moonAff || mercAff) {
        return {
          matched: true,
          score: moonAff && mercAff ? 2 : 1,
          basisEn: 'Moon or Mercury conjoins Rahu/Ketu/Saturn, raising nervous overstimulation risk',
          basisHi: 'चंद्र या बुध के राहु/केतु/शनि से युति के कारण स्नायु तनाव व अनिद्रा सतर्कता',
        };
      }
      return { matched: false, score: 0, basisEn: '', basisHi: '' };
    },
    preventiveTipEn: 'Consistent 7–8h sleep schedule, digital detox before bed, Brahmi/meditation, and stress counseling if needed.',
    preventiveTipHi: 'नियमित ७-८ घंटे की निद्रा, सोने से पहले स्क्रीन त्याग व ध्यान/प्राणायाम।',
  },

  // 8. Musculoskeletal & Trauma
  {
    id: 'med_rheumatism_paralysis_joints',
    systemGroup: 'Musculoskeletal & Trauma',
    conditionEn: 'Joints, Rheumatism, Gout & Vata Mobility',
    conditionHi: 'जोड़ों का दर्द, गठिया (वात रोग) एवं अस्थि लचीलापन',
    check: (c) => {
      if (c.inHouses('Saturn', [1, 6, 8, 10]) || c.sameHouse('Saturn', 'Mars') || c.sameHouse('Saturn', 'Rahu')) {
        return {
          matched: true,
          score: c.sameHouse('Saturn', 'Mars') ? 2 : 1,
          basisEn: 'Saturn in 1/6/8/10 or linked with Mars/Rahu activates Vata joint/knee stiffness',
          basisHi: 'शनि की १/६/८/१० स्थिति अथवा मंगल/राहु संबंध जोड़ों व वात की सतर्कता दर्शाता है',
        };
      }
      return { matched: false, score: 0, basisEn: '', basisHi: '' };
    },
    preventiveTipEn: 'Daily joint mobility stretching, Vitamin D/calcium monitoring, and warm sesame-oil massage.',
    preventiveTipHi: 'नियमित स्ट्रेचिंग/योग, विटामिन-डी व कैल्शियम जांच तथा गुनगुने तिल तैल से मालिश।',
  },
  {
    id: 'med_accidents_fractures_wounds',
    systemGroup: 'Musculoskeletal & Trauma',
    conditionEn: 'Accidents, Fractures & Physical Injury Vigilance',
    conditionHi: 'दुर्घटना, अस्थि-भंग (फ्रैक्चर) व चोट सुरक्षा सतर्कता',
    check: (c) => {
      if (c.inHouses('Mars', [1, 6, 8, 12]) && (c.sameHouse('Mars', 'Rahu') || c.sameHouse('Mars', 'Saturn') || c.sameHouse('Mars', 'Ketu'))) {
        return {
          matched: true,
          score: 2,
          basisEn: 'Mars with Rahu/Saturn/Ketu in 1/6/8/12 urges extra road & physical safety',
          basisHi: '१/६/८/१२ में मंगल व राहु/शनि/केतु की युति यात्रा व वाहन सुरक्षा की चेतावनी देती है',
        };
      }
      return { matched: false, score: 0, basisEn: '', basisHi: '' };
    },
    preventiveTipEn: 'Strict defensive driving, protective gear in sports/work, and avoiding impulsive haste.',
    preventiveTipHi: 'वाहन चलाते समय पूर्ण सावधानी, जल्दबाजी से बचाव व सुरक्षा नियमों का पालन।',
  },

  // 9. Dermatological
  {
    id: 'med_skin_leukoderma_allergies',
    systemGroup: 'Dermatological',
    conditionEn: 'Skin Health, Pigment & Allergy Care',
    conditionHi: 'त्वचा स्वास्थ्य, वर्ण एवं एलर्जी देखभाल',
    check: (c) => {
      if (c.sameHouse('Mercury', 'Rahu') || c.sameHouse('Mercury', 'Ketu') || c.inHouses('Mercury', [6, 8]) || (c.sameHouse('Moon', 'Mars') && c.inHouses('Moon', [6, 8]))) {
        return {
          matched: true,
          score: 1,
          basisEn: 'Mercury in 6/8 or with Rahu/Ketu indicates dermal and allergy sensitivity',
          basisHi: '६/८ में बुध या बुध-राहु/केतु युति त्वचा व एलर्जी संवेदनशीलता दर्शाती है',
        };
      }
      return { matched: false, score: 0, basisEn: '', basisHi: '' };
    },
    preventiveTipEn: 'Gentle skincare, avoiding harsh chemical allergens, and blood-purifying green vegetables.',
    preventiveTipHi: 'सौम्य त्वचा देखभाल, रासायनिक एलर्जी से बचाव व हरी पत्तेदार सब्ज़ियों का सेवन।',
  },

  // 10. Reproductive & Glandular
  {
    id: 'med_reproductive_menstrual_prostate',
    systemGroup: 'Reproductive & Glandular',
    conditionEn: 'Reproductive, Menstrual, Uterine & Prostate Care',
    conditionHi: 'प्रजनन, मासिक धर्म, गर्भाशय व प्रोस्टेट स्वास्थ्य',
    check: (c) => {
      if (c.houseHasAny(7, ['Saturn', 'Rahu', 'Ketu']) || c.houseHasAny(8, ['Venus', 'Mars', 'Rahu'])) {
        return {
          matched: true,
          score: 1,
          basisEn: '7th/8th pelvic houses with Venus/Mars/nodes call for routine reproductive wellness checks',
          basisHi: '७वें/८वें भाव में शुक्र/मंगल/राहु-केतु प्रजनन अंगों की नियमित जांच दर्शाते हैं',
        };
      }
      return { matched: false, score: 0, basisEn: '', basisHi: '' };
    },
    preventiveTipEn: 'Routine gynecological/urological checkups, pelvic hygiene, and iron/hormonal balance.',
    preventiveTipHi: 'नियमित स्त्री/मूत्र-रोग विशेषज्ञ जांच, स्वच्छता व हार्मोनल संतुलन बनाए रखें।',
  },
];

export function evaluateExtendedMedicalConditions(
  planets: ExtendedMedicalPlanet[]
): ExtendedMedicalConditionMatch[] {
  const getP = (id: NineGrahaId) => planets.find((p) => p.id === id);
  const inHouses = (id: NineGrahaId, houses: number[]) => {
    const p = getP(id);
    return p ? houses.includes(p.placedHouse) : false;
  };
  const inSigns = (id: NineGrahaId, signs: number[]) => {
    const p = getP(id);
    return p ? signs.includes(p.signIndex) : false;
  };
  const sameHouse = (a: NineGrahaId, b: NineGrahaId) => {
    const pa = getP(a);
    const pb = getP(b);
    return Boolean(pa && pb && pa.placedHouse === pb.placedHouse);
  };
  const isAfflicted = (id: NineGrahaId) => {
    const p = getP(id);
    if (!p) return false;
    if (p.dignity === 'Debilitated' || p.isCombust) return true;
    const malefics: NineGrahaId[] = ['Saturn', 'Mars', 'Rahu', 'Ketu'];
    return malefics.some((m) => m !== id && sameHouse(id, m));
  };
  const houseHasAny = (house: number, ids: NineGrahaId[]) =>
    planets.some((p) => p.placedHouse === house && ids.includes(p.id as NineGrahaId));

  const ctx: MedEvalCtx = { getP, inHouses, inSigns, sameHouse, isAfflicted, houseHasAny };
  const results: ExtendedMedicalConditionMatch[] = [];

  for (const rule of CONDITION_RULES) {
    const res = rule.check(ctx);
    if (res.matched) {
      results.push({
        id: rule.id,
        systemGroup: rule.systemGroup,
        conditionEn: rule.conditionEn,
        conditionHi: rule.conditionHi,
        riskLevel: res.score >= 2 ? 'Elevated' : 'Watch',
        matchedBasisEn: res.basisEn,
        matchedBasisHi: res.basisHi,
        preventiveTipEn: rule.preventiveTipEn,
        preventiveTipHi: rule.preventiveTipHi,
      });
    }
  }

  return results;
}
