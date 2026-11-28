import { computeBhavabalaReport } from './bhavabalaEngine';
import { SIGNS } from './constants';
import type { ChartData, SevenPlanetId } from './types';

const SHAD_BENEFICS = new Set(['Jupiter', 'Venus', 'Mercury', 'Moon']);
const SHAD_MALEFICS = new Set(['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu']);

export interface ShadPhalaHouseItem {
  house: number;
  domainEn: string;
  domainHi: string;
  signName: string;
  lord: SevenPlanetId;
  bhavaRupas: number;
  savBindus: number;
  shadPhalaScore: number; // -100..+100
  status: 'Strong & Supportive' | 'Balanced / Mixed' | 'Requires Caution';
  readingEn: string;
  readingHi: string;
}

const SHAD_PHALA_BANK: Array<{
  house: number;
  domainEn: string;
  domainHi: string;
  goodEn: string;
  badEn: string;
  goodHi: string;
  badHi: string;
}> = [
  {
    house: 1,
    domainEn: 'Health & Wellbeing',
    domainHi: 'स्वास्थ्य, देह एवं आत्मबल',
    goodEn: 'Vitality, confidence, and physical recovery remain strong; personal initiatives move forward with clarity.',
    badEn: 'Periodic fatigue, stamina dips, or inner restlessness require mindful routine and recovery care.',
    goodHi: 'शारीरिक ऊर्जा, आत्मविश्वास व स्वास्थ्य सबल रहता है; व्यक्तिगत कार्य स्पष्टता से आगे बढ़ते हैं।',
    badHi: 'समय-समय पर थकान, ऊर्जा में कमी या मन में अस्थिरता दिख सकती है; नियमित दिनचर्या आवश्यक है।',
  },
  {
    house: 2,
    domainEn: 'Wealth, Speech & Family',
    domainHi: 'धन, वाणी एवं कुटुम्ब सुख',
    goodEn: 'Financial reserves, speech impact, and family harmony receive strong classical support.',
    badEn: 'Cashflow fluctuations, dietary irregularity, or family sensitivities need patient financial planning.',
    goodHi: 'आर्थिक संचय, वाणी का प्रभाव तथा पारिवारिक सामंजस्य मजबूत रहता है।',
    badHi: 'आय-व्यय में उतार-चढ़ाव या पारिवारिक संवाद में संवेदनशीलता के लिए धैर्यपूर्ण वित्तीय योजना रखें।',
  },
  {
    house: 3,
    domainEn: 'Courage, Siblings & Short Travels',
    domainHi: 'पराक्रम, सहोदर एवं छोटी यात्राएं',
    goodEn: 'Courage, initiative, artistic skills, and helpful ties with siblings and associates thrive.',
    badEn: 'Initiatives may meet delays, travel fatigue, or friction with siblings/neighbors unless paced carefully.',
    goodHi: 'साहस, पहल क्षमता, लेखन-कौशल तथा भाई-बहनों व सहयोगियों से संबंध अनुकूल रहते हैं।',
    badHi: 'यात्राओं या नए प्रयासों में विलंब तथा सहोदर/सहयोगियों से मतभेद से बचने हेतु धैर्य रखें।',
  },
  {
    house: 4,
    domainEn: 'Home, Mother & Peace of Mind',
    domainHi: 'माता, गृह, वाहन एवं मानसिक सुख',
    goodEn: 'Emotional peace, domestic stability, maternal wellbeing, and property/vehicle comforts flourish.',
    badEn: 'Domestic restlessness, property maintenance friction, or worry regarding mother needs gentle nurturing.',
    goodHi: 'मानसिक शांति, पारिवारिक स्थिरता, मातृ-सुख तथा भूमि-भवन-वाहन सुख उत्तम रहता है।',
    badHi: 'गृह-जीवन, संपत्ति या माता के स्वास्थ्य को लेकर अतिरिक्त सजगता व संवेदनशील देखभाल आवश्यक है।',
  },
  {
    house: 5,
    domainEn: 'Intellect, Education & Children',
    domainHi: 'बुद्धि, शिक्षा, सृजन व संतान',
    goodEn: 'Sharp intellect, academic brilliance, creative focus, mantra siddhi, and happiness from progeny.',
    badEn: 'Restless mind, speculative risks, or extra effort in education/progeny matters require discipline.',
    goodHi: 'तीक्ष्ण बुद्धि, विद्या-अध्ययन, रचनात्मक प्रतिभा, मंत्र-साधना व संतान सुख श्रेष्ठ रहता है।',
    badHi: 'सट्टे/जोखिम से बचें तथा शिक्षा या संतान संबंधी विषयों में निरंतर एकाग्रता बनाए रखें।',
  },
  {
    house: 6,
    domainEn: 'Health Resilience, Service & Victory',
    domainHi: 'रोग-प्रतिरोधक क्षमता, सेवा एवं शत्रु-विजय',
    goodEn: 'Strong immunity, competitive victory, disciplined work routine, and capacity to overcome debts/opponents.',
    badEn: 'Digestive/stress sensitivity, debt pressure, or workplace rivalry must be managed methodically.',
    goodHi: 'प्रतिस्पर्धा में विजय, सेवा-कार्य में दक्षता तथा रोग-ऋण से उबरने की अद्भुत क्षमता रहती है।',
    badHi: 'पाचन/तनाव, ऋण प्रबंधन तथा कार्यस्थल प्रतिद्वंद्विता के प्रति व्यवस्थित सतर्कता आवश्यक है।',
  },
  {
    house: 7,
    domainEn: 'Marriage, Spouse & Partnerships',
    domainHi: 'विवाह, जीवनसाथी एवं साझेदारी',
    goodEn: 'Harmonious marriage, supportive life partner, respected public standing, and profitable alliances.',
    badEn: 'Partnership expectations or domestic misunderstandings require transparent communication and patience.',
    goodHi: 'दांपत्य सुख, सहयोगी जीवनसाथी, सामाजिक प्रतिष्ठा तथा व्यापारिक साझेदारी लाभप्रद रहती है।',
    badHi: 'साझेदारी व दांपत्य अपेक्षाओं में पारदर्शी संवाद तथा आपसी धैर्य बनाए रखना लाभकारी रहेगा।',
  },
  {
    house: 8,
    domainEn: 'Longevity, Research & Shared Assets',
    domainHi: 'आयु, गूढ़ शोध एवं संयुक्त संपत्ति',
    goodEn: 'Deep research insight, intuitive depth, transformational resilience, and inherited/joint asset support.',
    badEn: 'Sudden upheavals, chronic stress, or speculative joint liabilities call for steady preventive care.',
    goodHi: 'गहन शोध क्षमता, आध्यात्मिक अंतर्दृष्टि, संकट-सहने की शक्ति तथा पैतृक/बीमा लाभ मिलता है।',
    badHi: 'आकस्मिक परिवर्तनों, तनाव व संयुक्त देनदारियों के प्रति पूर्व-नियोजित सुरक्षा अपनाएं।',
  },
  {
    house: 9,
    domainEn: 'Fortune, Dharma, Guru & Higher Learning',
    domainHi: 'भाग्य, धर्म, गुरु एवं उच्च ज्ञान',
    goodEn: 'Strong dharmic fortune, wisdom, paternal blessings, mentorship, and auspicious long journeys.',
    badEn: 'Philosophical doubt, delayed higher-study journeys, or ideological distance with elders needs humility.',
    goodHi: 'सौभाग्य, धर्म-निष्ठा, पिता व गुरुजनों का आशीर्वाद, उच्च विद्या तथा शुभ तीर्थ यात्राएं फलती हैं।',
    badHi: 'भाग्य-फल में विलंब, पिता से वैचारिक मतभेद या यात्रा-अवरोध को विनम्रता से संतुलित करें।',
  },
  {
    house: 10,
    domainEn: 'Career, Authority & Public Status',
    domainHi: 'कर्म, करियर, पद-प्रतिष्ठा एवं नेतृत्व',
    goodEn: 'Executive recognition, steady career ascent, leadership authority, and harmonious workplace standing.',
    badEn: 'Workplace pressure, authority friction, or slow recognition demand consistent strategic execution.',
    goodHi: 'कार्यक्षेत्र में सम्मान, पदोन्नति, प्रशासनिक क्षमता एवं नेतृत्व में निरंतर प्रगति मिलती है।',
    badHi: 'कार्यस्थल पर उच्चाधिकारियों से तालमेल और धीमी गति की चुनौतियों में धैर्य से काम लें।',
  },
  {
    house: 11,
    domainEn: 'Income Gains, Networks & Desires',
    domainHi: 'लाभ, आय-वृद्धि एवं मित्र-मण्डली',
    goodEn: 'Reliable income channels, influential friends/networks, and fulfillment of long-term ambitions.',
    badEn: 'Delayed payouts or unreliable acquaintances suggest verifying financial commitments carefully.',
    goodHi: 'नियमित आय, प्रभावशाली मित्रों का सहयोग तथा महत्वाकांक्षाओं की पूर्ति सरलता से होती है।',
    badHi: 'आय प्राप्ति में विलंब या मित्रों से अपेक्षाओं को लेकर व्यावहारिक जांच-पड़ताल बनाए रखें।',
  },
  {
    house: 12,
    domainEn: 'Liberation, Foreign Ties & Expenditure',
    domainHi: 'व्यय, विदेश संपर्क एवं मोक्ष/ध्यान',
    goodEn: 'Restorative sleep, charitable grace, foreign opportunities, and deep contemplative serenity.',
    badEn: 'Excess expenditure, sleep disturbance, or unbudgeted losses require conscious financial containment.',
    goodHi: 'शांत निद्रा, दान-पुण्य, विदेश-संबंध तथा आध्यात्मिक ध्यान-योग में उत्कृष्ट शांति प्राप्त होती है।',
    badHi: 'अति-व्यय, अनिद्रा या अनियोजित खर्चों पर बजट नियंत्रण तथा विश्राम का ध्यान रखें।',
  },
];

/**
 * Computes classical Shad Phala house-by-house favorability (Houses 1..12)
 * combining Bhava Bala, House Lord Shadbala ratio, Benefic/Malefic occupation + aspects,
 * and Sarvashtakavarga bindus.
 */
export function computeShadPhalaHouses(chart: ChartData): ShadPhalaHouseItem[] {
  const bhavaReport = computeBhavabalaReport(chart);
  const shadbalaMap = new Map(chart.shadbala.map((s) => [s.planet, s]));

  return SHAD_PHALA_BANK.map((meta) => {
    const signIndex = (chart.ascendant.signIndex + meta.house - 1) % 12;
    const lord = SIGNS[signIndex].lord;
    const bhavaRow = bhavaReport.houses.find((h) => h.house === meta.house);
    const bhavaRupas = bhavaRow?.totalRupas ?? 7.5;
    const savBindus = chart.ashtakavarga.sarva[signIndex] ?? 28;
    const lordRatio = shadbalaMap.get(lord)?.ratio ?? 1.0;

    let score = 0;
    // Bhava Bala contribution (average ~8.0 Rupas)
    score += (bhavaRupas - 8.0) * 14;
    // House lord strength ratio
    score += (lordRatio - 1.0) * 35;
    // SAV bindus (28 is neutral baseline)
    score += (savBindus - 28) * 3.5;

    // Benefic / malefic occupants & aspects in house
    for (const p of chart.planets) {
      if (p.houseNumber === meta.house) {
        if (SHAD_BENEFICS.has(p.id)) score += 16;
        else if (SHAD_MALEFICS.has(p.id)) score -= 12;
      }
      // 7th aspect check
      if (((p.houseNumber + 6 - 1) % 12) + 1 === meta.house) {
        if (SHAD_BENEFICS.has(p.id)) score += 10;
        else if (SHAD_MALEFICS.has(p.id)) score -= 8;
      }
    }

    const clamped = Math.max(-100, Math.min(100, Math.round(score)));
    const status: ShadPhalaHouseItem['status'] =
      clamped >= 15
        ? 'Strong & Supportive'
        : clamped <= -12
          ? 'Requires Caution'
          : 'Balanced / Mixed';

    return {
      house: meta.house,
      domainEn: meta.domainEn,
      domainHi: meta.domainHi,
      signName: SIGNS[signIndex]?.name ?? '',
      lord,
      bhavaRupas: Math.round(bhavaRupas * 100) / 100,
      savBindus,
      shadPhalaScore: clamped,
      status,
      readingEn: clamped >= -11 ? meta.goodEn : meta.badEn,
      readingHi: clamped >= -11 ? meta.goodHi : meta.badHi,
    };
  });
}
