import React, { useMemo } from 'react';
import {
  Activity,
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Download,
  Eye,
  FileText,
  Heart,
  HelpCircle,
  Home,
  MapPin,
  Moon,
  Printer,
  Shield,
  ShieldAlert,
  Sparkles,
  Star,
  Sun,
  User,
  Users,
} from 'lucide-react';
import { computeSambhavitFalkathan, type SambhavitFalkathanReport } from '../../astro/predictions/sambhavitFalkathan';
import { formatDateDmy } from '../../astro/time';
import type { BirthInput, CalcSettings, ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet, trSign } from '../../i18n/translations';

interface OnlineJyotishSambhavitViewProps {
  chart: ChartData;
  activeInput: BirthInput;
  settings: CalcSettings;
  onNavigate: (view: string, sub?: string) => void;
  onOpenBooklet: () => void;
}

export const OnlineJyotishSambhavitView: React.FC<OnlineJyotishSambhavitViewProps> = ({
  chart,
  activeInput,
  settings,
  onNavigate,
  onOpenBooklet,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const dossier: SambhavitFalkathanReport = useMemo(() => {
    return computeSambhavitFalkathan(chart);
  }, [chart]);

  const moon = useMemo(() => chart.planets.find((p) => p.id === 'Moon') || chart.ascendant, [chart]);

  return (
    <div className="oj-page-container">
      {/* Breadcrumb */}
      <nav className="oj-breadcrumbs" aria-label="Breadcrumb">
        <a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
          {isHi ? 'होम' : 'Home'}
        </a>
        <span className="oj-bc-sep">/</span>
        <a href="#horo" onClick={(e) => { e.preventDefault(); onNavigate('vedic-horoscope'); }}>
          {isHi ? 'वैदिक कुंडली' : 'Vedic Horoscope'}
        </a>
        <span className="oj-bc-sep">/</span>
        <span className="oj-bc-current">{isHi ? 'संभावित फलकथन (25 जीवन आयाम)' : 'Sambhavit Falkathan (25 Life Dimensions)'}</span>
      </nav>

      {/* Header Banner */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          {isHi ? 'समस्त 16 वर्ग कुंडलियों का संश्लेषित फलित · 100% निःशुल्क' : 'Synthesized Analysis of All 16 Divisional Charts · 100% Free'}
        </div>
        <h1 className="oj-page-title">
          {isHi ? 'संभावित फलकथन — जीवन के 25 अनिवार्य पक्षों का प्रामाणिक विश्लेषण' : 'Sambhavit Falkathan — 25 Vital Life Predictions'}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? 'नामाक्षर, इष्ट देवता, माता-पिता का स्वभाव व आयु, संतान योग (प्राकृतिक/वैज्ञानिक), विवाह, शिक्षा स्तर, नौकरी बनाम व्यापार, दीर्घायु, शल्य चिकित्सा, संकट निवारण एवं धन योग।'
            : 'Point-wise classical dossier covering parents longevity & nature, natural vs assisted progeny, career, education attainment, surgery, incarceration, and crisis rescue.'}
        </p>

        {/* Action Pills */}
        <div className="oj-page-actions-bar">
          <button type="button" className="oj-action-btn primary" onClick={onOpenBooklet}>
            <Download size={14} />
            <span>{isHi ? 'संपूर्ण 118-पृष्ठ पीडीएफ डाउनलोड करें' : 'Download Complete 118-Page PDF'}</span>
          </button>
          <button type="button" className="oj-action-btn secondary" onClick={() => window.print()}>
            <Printer size={14} />
            <span>{isHi ? 'फलकथन प्रिंट करें' : 'Print Dossier'}</span>
          </button>
        </div>
      </div>

      {/* Native Metadata Strip */}
      <div className="oj-card oj-meta-strip-card">
        <div className="oj-meta-flex">
          <div>
            <span className="oj-meta-label">{isHi ? 'जातक' : 'Native'}:</span>
            <strong>{chart.input.name}</strong>
          </div>
          <div>
            <span className="oj-meta-label">{isHi ? 'जन्म विवरण' : 'Birth'}:</span>
            <strong>{formatDateDmy(chart.input.date)} {chart.input.time} ({chart.input.city})</strong>
          </div>
          <div>
            <span className="oj-meta-label">{isHi ? 'लग्न / चंद्र' : 'Lagna / Moon'}:</span>
            <strong>{chart.ascendant.signName} / {moon.signName}</strong>
          </div>
          <div>
            <span className="oj-meta-label">{isHi ? 'नक्षत्र' : 'Birth Star'}:</span>
            <strong>{moon.nakshatraName} ({moon.pada})</strong>
          </div>
        </div>
      </div>

      {/* 25 Vital Dimensions Cards Grid */}
      <div className="oj-predictions-grid">
        {/* 1. Name & Identity */}
        <div className="oj-card oj-pred-card">
          <div className="oj-card-header">
            <h3>{isHi ? '1. नामाक्षर, इष्ट देवता एवं मुख्य ग्रह' : '1. Name Syllables, Ishta Devata & Main Planet'}</h3>
          </div>
          <div className="oj-pred-card-body">
            <p><strong>{isHi ? 'शुभ नामाक्षर:' : 'Auspicious Name Syllables:'}</strong> {isHi ? dossier.namakshar.primaryHi : dossier.namakshar.primaryEn} ({isHi ? dossier.namakshar.allPadasHi.join(', ') : dossier.namakshar.allPadasEn.join(', ')})</p>
            <p><strong>{isHi ? 'इष्ट देवता:' : 'Ishta Devata:'}</strong> {isHi ? dossier.ishtaDevata.nameHi : dossier.ishtaDevata.nameEn} ({dossier.ishtaDevata.mantra})</p>
            <p><strong>{isHi ? 'मुख्य नियंत्रक ग्रह:' : 'Main Controlling Planet:'}</strong> {isHi ? dossier.mukhyaGraha.planetHi : dossier.mukhyaGraha.planetEn} — {isHi ? dossier.mukhyaGraha.roleHi : dossier.mukhyaGraha.roleEn}</p>
          </div>
        </div>

        {/* 2. Father */}
        <div className="oj-card oj-pred-card">
          <div className="oj-card-header">
            <h3>{isHi ? '2. पिता का स्वभाव, पेशा, जीवनकाल एवं संबंध' : "2. Father's Temperament, Profession, Longevity & Relation"}</h3>
          </div>
          <div className="oj-pred-card-body">
            <p><strong>{isHi ? 'स्वभाव:' : 'Nature:'}</strong> {isHi ? dossier.father.temperamentHi : dossier.father.temperamentEn}</p>
            <p><strong>{isHi ? 'पेशा / कार्यक्षेत्र:' : 'Profession:'}</strong> {isHi ? dossier.father.professionHi : dossier.father.professionEn}</p>
            <p><strong>{isHi ? 'जीवनकाल (आयु):' : 'Longevity:'}</strong> {isHi ? dossier.father.lifespanHi : dossier.father.lifespanEn}</p>
            <p><strong>{isHi ? 'संबंध:' : 'Relationship:'}</strong> {isHi ? dossier.father.relationshipHi : dossier.father.relationshipEn}</p>
          </div>
        </div>

        {/* 3. Mother */}
        <div className="oj-card oj-pred-card">
          <div className="oj-card-header">
            <h3>{isHi ? '3. माता का स्वभाव, पेशा, जीवनकाल एवं संबंध' : "3. Mother's Temperament, Profession, Longevity & Relation"}</h3>
          </div>
          <div className="oj-pred-card-body">
            <p><strong>{isHi ? 'स्वभाव:' : 'Nature:'}</strong> {isHi ? dossier.mother.temperamentHi : dossier.mother.temperamentEn}</p>
            <p><strong>{isHi ? 'पेशा / कार्यक्षेत्र:' : 'Profession:'}</strong> {isHi ? dossier.mother.professionHi : dossier.mother.professionEn}</p>
            <p><strong>{isHi ? 'जीवनकाल (आयु):' : 'Longevity:'}</strong> {isHi ? dossier.mother.lifespanHi : dossier.mother.lifespanEn}</p>
            <p><strong>{isHi ? 'संबंध:' : 'Relationship:'}</strong> {isHi ? dossier.mother.relationshipHi : dossier.mother.relationshipEn}</p>
          </div>
        </div>

        {/* 4. Siblings */}
        <div className="oj-card oj-pred-card">
          <div className="oj-card-header">
            <h3>{isHi ? '4. भाई-बहनों की संख्या एवं जन्म क्रम' : '4. Siblings Count & Birth Order'}</h3>
          </div>
          <div className="oj-pred-card-body">
            <p><strong>{isHi ? 'भाई-बहनों की संख्या:' : 'Number of Siblings:'}</strong> {isHi ? dossier.siblings.countProjectionHi : dossier.siblings.countProjectionEn}</p>
            <p><strong>{isHi ? 'जन्म क्रम:' : 'Birth Order:'}</strong> {isHi ? dossier.siblings.birthOrderHi : dossier.siblings.birthOrderEn}</p>
            <p><strong>{isHi ? 'सौहार्द व संबंध:' : 'Sibling Harmony:'}</strong> {isHi ? dossier.siblings.harmonyHi : dossier.siblings.harmonyEn}</p>
          </div>
        </div>

        {/* 5. Marriage & Spouse */}
        <div className="oj-card oj-pred-card">
          <div className="oj-card-header">
            <h3>{isHi ? '5. विवाह समय, जीवनसाथी का स्वभाव एवं संबंध' : '5. Marriage Timing, Spouse Nature & Marital Bond'}</h3>
          </div>
          <div className="oj-pred-card-body">
            <p><strong>{isHi ? 'विवाह योग (समय अवधि):' : 'Marriage Window:'}</strong> {isHi ? dossier.marriage.timingAgeWindowHi : dossier.marriage.timingAgeWindowEn}</p>
            <p><strong>{isHi ? 'विवाह योग:' : 'Marriage Yogas:'}</strong> {isHi ? dossier.marriage.marriageYogasHi : dossier.marriage.marriageYogasEn}</p>
            <p><strong>{isHi ? 'जीवनसाथी का स्वभाव:' : 'Spouse Nature:'}</strong> {isHi ? dossier.marriage.spouseNatureHi : dossier.marriage.spouseNatureEn}</p>
            <p><strong>{isHi ? 'आयु अंतर एवं संबंध:' : 'Age Gap & Bond:'}</strong> {isHi ? `${dossier.marriage.spouseAgeGapHi} · ${dossier.marriage.relationshipHi}` : `${dossier.marriage.spouseAgeGapEn} · ${dossier.marriage.relationshipEn}`}</p>
          </div>
        </div>

        {/* 6. Children / Progeny */}
        <div className="oj-card oj-pred-card">
          <div className="oj-card-header">
            <h3>{isHi ? '6. संतान सुख एवं तकनीक (प्राकृतिक / वैज्ञानिक)' : '6. Progeny / Children (Natural vs IVF/Scientific)'}</h3>
          </div>
          <div className="oj-pred-card-body">
            <p><strong>{isHi ? 'संतान प्राप्ति विधि:' : 'Conception Method:'}</strong> {isHi ? dossier.children.conceptionModeHi : dossier.children.conceptionModeEn}</p>
            <p><strong>{isHi ? 'संतान संख्या संभावना:' : 'Progeny Count:'}</strong> {isHi ? dossier.children.progenyCountHi : dossier.children.progenyCountEn}</p>
            <p><strong>{isHi ? 'गर्भपात जोखिम (Miscarriage Risk):' : 'Miscarriage / Delay Risk:'}</strong> {isHi ? dossier.children.miscarriageRiskHi : dossier.children.miscarriageRiskEn}</p>
            <p><strong>{isHi ? 'संतान से सुख व सहयोग:' : 'Filial Joy:'}</strong> {isHi ? dossier.children.filialHappinessHi : dossier.children.filialHappinessEn}</p>
          </div>
        </div>

        {/* 7. Education */}
        <div className="oj-card oj-pred-card">
          <div className="oj-card-header">
            <h3>{isHi ? '7. स्वयं की शिक्षा स्तर एवं उपयुक्त अध्ययन विषय' : '7. Educational Attainment & Suitable Subjects'}</h3>
          </div>
          <div className="oj-pred-card-body">
            <p><strong>{isHi ? 'उच्चतम शिक्षा स्तर:' : 'Highest Qualification:'}</strong> {isHi ? dossier.education.attainmentLevelHi : dossier.education.attainmentLevelEn}</p>
            <p><strong>{isHi ? 'उपयुक्त अध्ययन विषय:' : 'Favorable Fields of Study:'}</strong> {isHi ? dossier.education.suitableStreamsHi.join(', ') : dossier.education.suitableStreamsEn.join(', ')}</p>
            <p>{isHi ? dossier.education.academicSuccessHi : dossier.education.academicSuccessEn}</p>
          </div>
        </div>

        {/* 8. Career & Profession */}
        <div className="oj-card oj-pred-card">
          <div className="oj-card-header">
            <h3>{isHi ? '8. आजीविका: व्यापार या नौकरी / सरकारी या निजी' : '8. Career: Business vs Job / Govt vs Private'}</h3>
          </div>
          <div className="oj-pred-card-body">
            <p><strong>{isHi ? 'व्यापार या नौकरी:' : 'Business vs Job:'}</strong> {isHi ? dossier.career.jobVsBusinessHi : dossier.career.jobVsBusinessEn}</p>
            <p><strong>{isHi ? 'सरकारी या निजी क्षेत्र:' : 'Government vs Private:'}</strong> {isHi ? dossier.career.govtVsPrivateHi : dossier.career.govtVsPrivateEn}</p>
            <p><strong>{isHi ? 'उपयुक्त कार्यक्षेत्र व पद:' : 'Ideal Professions:'}</strong> {isHi ? dossier.career.suitableProfessionsHi.join(', ') : dossier.career.suitableProfessionsEn.join(', ')}</p>
            <p><strong>{isHi ? 'विदेश यात्रा एवं विदेश निवास:' : 'Foreign Travel & Settlement:'}</strong> {isHi ? `${dossier.career.foreignTravelHi} | ${dossier.career.foreignSettlementHi}` : `${dossier.career.foreignTravelEn} | ${dossier.career.foreignSettlementEn}`}</p>
          </div>
        </div>

        {/* 9. Longevity, Surgery & Incarceration */}
        <div className="oj-card oj-pred-card">
          <div className="oj-card-header">
            <h3>{isHi ? '9. आयु मान, शल्य चिकित्सा (सर्जरी) एवं कारावास योग' : '9. Longevity, Surgery & Confinement Risks'}</h3>
          </div>
          <div className="oj-pred-card-body">
            <p><strong>{isHi ? 'आयु वर्ग (दीर्घायु / मध्यायु):' : 'Longevity Tier:'}</strong> {isHi ? `${dossier.longevity.categoryHi} (${dossier.longevity.rangeHi})` : `${dossier.longevity.categoryEn} (${dossier.longevity.rangeEn})`}</p>
            <p><strong>{isHi ? 'शल्य चिकित्सा (सर्जरी) योग:' : 'Surgery / Operation Risk:'}</strong> {isHi ? `${dossier.surgeryYoga.riskLevelHi} (${dossier.surgeryYoga.vulnerableAreasHi})` : `${dossier.surgeryYoga.riskLevelEn} (${dossier.surgeryYoga.vulnerableAreasEn})`}</p>
            <p><strong>{isHi ? 'कारावास / बंधन योग:' : 'Bandhana (Confinement) Risk:'}</strong> {isHi ? `${dossier.bandhanaYoga.verdictHi} — ${dossier.bandhanaYoga.mitigationHi}` : `${dossier.bandhanaYoga.verdictEn} — ${dossier.bandhanaYoga.mitigationEn}`}</p>
          </div>
        </div>

        {/* 10. Health, Psychology & Sports */}
        <div className="oj-card oj-pred-card">
          <div className="oj-card-header">
            <h3>{isHi ? '10. स्वास्थ्य, मानसिक संतुलन एवं प्रिय खेल' : '10. Health, Mental Poise & Favorite Sports'}</h3>
          </div>
          <div className="oj-pred-card-body">
            <p><strong>{isHi ? 'शारीरिक स्वास्थ्य व त्रिदोष:' : 'Constitution & Tridosha:'}</strong> {isHi ? `${dossier.health.constitutionHi} (${dossier.health.vulnerableOrgansHi})` : `${dossier.health.constitutionEn} (${dossier.health.vulnerableOrgansEn})`}</p>
            <p><strong>{isHi ? 'मानसिक स्थिति व संवेदनशीलता:' : 'Psychological Poise:'}</strong> {isHi ? `${dossier.mentalHealth.conditionHi} — ${dossier.mentalHealth.remedyHi}` : `${dossier.mentalHealth.conditionEn} — ${dossier.mentalHealth.remedyEn}`}</p>
            <p><strong>{isHi ? 'पसंदीदा खेल व व्यायाम:' : 'Sports & Athletics:'}</strong> {isHi ? dossier.sports.preferencesHi.join(', ') : dossier.sports.preferencesEn.join(', ')}</p>
          </div>
        </div>

        {/* 11. Wealth & Financial Peaks */}
        <div className="oj-card oj-pred-card">
          <div className="oj-card-header">
            <h3>{isHi ? '11. धन योग बनाम दरिद्र योग (आर्थिक समृद्धि)' : '11. Wealth Yogas vs Financial Challenges'}</h3>
          </div>
          <div className="oj-pred-card-body">
            <p><strong>{isHi ? 'धन योग स्थिति:' : 'Dhana Yoga Status:'}</strong> {isHi ? dossier.wealth.statusHi : dossier.wealth.statusEn}</p>
            <p><strong>{isHi ? 'आर्थिक चरमोत्कर्ष (Financial Peak):' : 'Wealth Peak Timeline:'}</strong> {isHi ? dossier.wealth.peakAgeWindowHi : dossier.wealth.peakAgeWindowEn}</p>
            <p><strong>{isHi ? 'सक्रिय योग:' : 'Active Yogas:'}</strong> {isHi ? dossier.wealth.activeYogasHi.join(', ') : dossier.wealth.activeYogasEn.join(', ')}</p>
          </div>
        </div>

        {/* 12. Crisis Strategy & Essential Cautions */}
        <div className="oj-card oj-pred-card">
          <div className="oj-card-header">
            <h3>{isHi ? '12. संकट में क्या करें एवं सावधानियां' : '12. Crisis Strategy & Essential Cautions'}</h3>
          </div>
          <div className="oj-pred-card-body">
            <p><strong>{isHi ? 'किन बातों से सावधान रहें:' : 'Traps to Avoid:'}</strong> {isHi ? dossier.cautions.hazardsHi.join(', ') : dossier.cautions.hazardsEn.join(', ')}</p>
            <p><strong>{isHi ? 'संकट निवारक वैदिक उपाय:' : 'Crisis Anchor Mantra & Deity:'}</strong> {isHi ? `${dossier.crisisStrategy.primaryDeityHi}: ${dossier.crisisStrategy.actionProtocolHi}` : `${dossier.crisisStrategy.primaryDeityEn}: ${dossier.crisisStrategy.actionProtocolEn}`}</p>
            <p><strong>{isHi ? 'नित्य सुरक्षा मंत्र:' : 'Daily Protective Mantra:'}</strong> {dossier.crisisStrategy.rescueMantra}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
