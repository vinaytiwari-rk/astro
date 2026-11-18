import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Download,
  Flame,
  Grid,
  Heart,
  Layers,
  Printer,
  Search,
  Shield,
  Sparkles,
  Star,
  User,
  Users,
} from 'lucide-react';
import {
  computeSambhavitFalkathan,
  type DimensionCategory,
  type LifeDimensionReading,
  type SambhavitFalkathanReport,
} from '../../astro/predictions/sambhavitFalkathan';
import {
  computeLifeMilestonesEngine,
  type LifeMilestonesReport,
  type ChronologicalMilestoneItem,
  type StreeJatakaReadingItem,
} from '../../astro/predictions/lifeMilestonesEngine';
import { formatDateDmy } from '../../astro/time';
import type { BirthInput, CalcSettings, ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';

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

  const [filterType, setFilterType] = useState<'house' | 'category' | 'milestones' | 'stree_jataka'>('house');
  const [selectedHouse, setSelectedHouse] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [milestoneStatusFilter, setMilestoneStatusFilter] = useState<'all' | 'active' | 'upcoming' | 'realized'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const report: SambhavitFalkathanReport = useMemo(() => {
    return computeSambhavitFalkathan(chart);
  }, [chart]);

  const milestonesReport: LifeMilestonesReport = useMemo(() => {
    return computeLifeMilestonesEngine(chart);
  }, [chart]);

  const moon = useMemo(
    () => chart.planets.find((p) => p.id === 'Moon') || chart.ascendant,
    [chart]
  );

  const houses = useMemo(() => [
    { num: 'all', titleEn: 'All 21 Predictions', titleHi: 'समस्त 21 फलादेश', count: 21 },
    { num: 1, titleEn: 'H1: Tanu & Self', titleHi: 'भाव 1: तनु व देह', count: 4 },
    { num: 2, titleEn: 'H2: Dhana & Speech', titleHi: 'भाव 2: धन व वाणी', count: 4 },
    { num: 3, titleEn: 'H3: Sahaja & Valour', titleHi: 'भाव 3: सहज व पराक्रम', count: 4 },
    { num: 4, titleEn: 'H4: Sukha & Mother', titleHi: 'भाव 4: सुख व मातृ', count: 4 },
    { num: 5, titleEn: 'H5: Intellect & Progeny', titleHi: 'भाव 5: बुद्धि व संतान', count: 5 },
    { num: 6, titleEn: 'H6: Disease & Debts', titleHi: 'भाव 6: रोग, ऋण व शत्रु', count: 4 },
    { num: 7, titleEn: 'H7: Marriage & Trade', titleHi: 'भाव 7: विवाह व व्यापार', count: 5 },
    { num: 8, titleEn: 'H8: Longevity & Mystery', titleHi: 'भाव 8: आयु व रंध्र', count: 4 },
    { num: 9, titleEn: 'H9: Fortune & Dharma', titleHi: 'भाव 9: भाग्य व धर्म', count: 4 },
    { num: 10, titleEn: 'H10: Karma & Vocation', titleHi: 'भाव 10: कर्म व पद', count: 5 },
    { num: 11, titleEn: 'H11: Gains & Network', titleHi: 'भाव 11: लाभ व आय', count: 4 },
    { num: 12, titleEn: 'H12: Moksha & Foreign', titleHi: 'भाव 12: व्यय व मोक्ष', count: 4 },
  ], []);

  const categories: { key: string; labelEn: string; labelHi: string; icon: React.ReactNode }[] = [
    { key: 'all', labelEn: 'All Categories', labelHi: 'समस्त श्रेणियां', icon: <Sparkles size={14} /> },
    { key: 'identity', labelEn: 'Identity & Core Self', labelHi: 'पहचान व आत्म', icon: <User size={14} /> },
    { key: 'wealth_fortune', labelEn: 'Wealth & Prosperity', labelHi: 'धन व समृद्धि', icon: <Award size={14} /> },
    { key: 'family', labelEn: 'Parents & Lineage', labelHi: 'माता-पिता व कुल', icon: <Users size={14} /> },
    { key: 'marriage', labelEn: 'Marriage & Conjugal', labelHi: 'विवाह व दांपत्य', icon: <Heart size={14} /> },
    { key: 'progeny', labelEn: 'Progeny & Lineage', labelHi: 'संतान व वंश', icon: <Star size={14} /> },
    { key: 'education', labelEn: 'Education & Intellect', labelHi: 'शिक्षा व विद्या', icon: <BookOpen size={14} /> },
    { key: 'career', labelEn: 'Career & Authority', labelHi: 'करियर व पद', icon: <Briefcase size={14} /> },
    { key: 'longevity_health', labelEn: 'Health & Longevity', labelHi: 'स्वास्थ्य व आयु', icon: <Activity size={14} /> },
    { key: 'shadow_challenges', labelEn: 'Shadow Challenges', labelHi: 'चुनौतियां व सतर्कता', icon: <Shield size={14} /> },
    { key: 'spirituality', labelEn: 'Spirituality & Grace', labelHi: 'आध्यात्म व मोक्ष', icon: <Flame size={14} /> },
  ];

  // Filter dimensions
  const filteredDimensions = useMemo(() => {
    return report.dimensions.filter((d) => {
      // House filter
      if (filterType === 'house' && selectedHouse !== 'all') {
        if (d.houseNumber !== selectedHouse) return false;
      }

      // Category filter
      if (filterType === 'category' && selectedCategory !== 'all') {
        if (d.category !== selectedCategory) return false;
      }

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const inTitle = d.titleEn.toLowerCase().includes(q) || d.titleHi.includes(q);
      const inVerdict = d.verdictEn.toLowerCase().includes(q) || d.verdictHi.includes(q);
      const inBasis = d.astroBasisEn.toLowerCase().includes(q) || d.astroBasisHi.includes(q);
      const inAnalysis = d.detailedAnalysisEn.toLowerCase().includes(q) || d.detailedAnalysisHi.includes(q);
      const inRef = (d.classicalRef || '').toLowerCase().includes(q) || (d.classicalRef || '').includes(q);
      const inVakri = (d.vakriNote || '').toLowerCase().includes(q) || (d.vakriNote || '').includes(q);
      return inTitle || inVerdict || inBasis || inAnalysis || inRef || inVakri;
    });
  }, [report.dimensions, filterType, selectedHouse, selectedCategory, searchQuery]);

  // Filter chronological milestones
  const filteredMilestones = useMemo(() => {
    return milestonesReport.milestones.filter((m) => {
      if (milestoneStatusFilter !== 'all' && m.status !== milestoneStatusFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        m.titleEn.toLowerCase().includes(q) ||
        m.titleHi.includes(q) ||
        m.eventEn.toLowerCase().includes(q) ||
        m.eventHi.includes(q) ||
        String(m.age).includes(q) ||
        String(m.calendarYear).includes(q) ||
        (m.sourceGraha || '').toLowerCase().includes(q) ||
        (m.sourceGrahaHi || '').includes(q) ||
        (m.houseTitleEn || '').toLowerCase().includes(q) ||
        (m.houseTitleHi || '').includes(q)
      );
    });
  }, [milestonesReport.milestones, milestoneStatusFilter, searchQuery]);

  // Filter Stree Jataka sutras
  const filteredStreeJataka = useMemo(() => {
    return milestonesReport.streeJatakaReadings.filter((sj) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        sj.planet.toLowerCase().includes(q) ||
        sj.planetHi.includes(q) ||
        sj.houseTitleEn.toLowerCase().includes(q) ||
        sj.houseTitleHi.includes(q) ||
        sj.sutraEn.toLowerCase().includes(q) ||
        sj.sutraHi.includes(q)
      );
    });
  }, [milestonesReport.streeJatakaReadings, searchQuery]);

  return (
    <div className="oj-page-container">
      {/* Breadcrumbs */}
      <nav className="oj-breadcrumbs no-print" aria-label="Breadcrumb">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
          }}
        >
          {isHi ? 'होम' : 'Home'}
        </a>
        <span className="oj-bc-sep">/</span>
        <a
          href="#horo"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('vedic-horoscope');
          }}
        >
          {isHi ? 'वैदिक कुंडली' : 'Vedic Horoscope'}
        </a>
        <span className="oj-bc-sep">/</span>
        <span className="oj-bc-current">
          {isHi ? 'संभावित फलकथन (21 महा-सटीक फलादेश)' : 'Sambhavit Falkathan (21 Supreme Predictions)'}
        </span>
      </nav>

      {/* Header Banner */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          {isHi
            ? 'पाराशर, जैमिनी, वराहमिहिर, फलदीपिका, सारावली, लाल किताब व केपी मत संश्लेषित · 1-सेकंड सूक्ष्म वेध'
            : 'Multi-Author Classical Synthesis: BPHS, Jaimini, Phaladeepika, Saravali, Lal Kitab & KP · 1-Sec Precision'}
        </div>
        <h1 className="oj-page-title">
          {isHi
            ? 'संभावित फलकथन — जीवन के 21 शास्त्रीय आयामों का प्रामाणिक व सूक्ष्म महा-विश्लेषण'
            : 'Sambhavit Falkathan — 21 Master Life Dimensions Classical Dossier'}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? 'समस्त 12 भावों, भावेश गरिमा, षोडशवर्ग पुष्टि, वक्री ग्रह चेष्टा बल एवं 1-सेकंड सूक्ष्म वेध काल-मान पर आधारित 21 बिंदुवार प्रामाणिक फलादेश।'
            : 'Point-wise classical dossier covering all 12 houses, Shodashvargas, retrograde chesta bala, and 1-second micro-temporal astronomical sensitivity.'}
        </p>

        {/* Action Buttons */}
        <div className="oj-page-actions-bar no-print">
          <button type="button" className="oj-action-btn primary" onClick={onOpenBooklet}>
            <Download size={14} />
            <span>{isHi ? 'संपूर्ण जन्म पत्रिका (Birth Report) डाउनलोड करें' : 'Download Complete Birth Report (PDF)'}</span>
          </button>
          <button type="button" className="oj-action-btn secondary" onClick={() => window.print()}>
            <Printer size={14} />
            <span>{isHi ? 'फलकथन प्रिंट करें' : 'Print 21 Predictions Dossier'}</span>
          </button>
        </div>
      </div>

      {/* Native Astrological Metadata Strip */}
      <div className="oj-card oj-meta-strip-card">
        <div className="oj-meta-flex">
          <div>
            <span className="oj-meta-label">{isHi ? 'जातक' : 'Native'}:</span>
            <strong>{chart.input.name}</strong>
          </div>
          <div>
            <span className="oj-meta-label">{isHi ? 'जन्म विवरण' : 'Birth Details'}:</span>
            <strong>
              {formatDateDmy(chart.input.date)} {chart.input.time} ({chart.input.city})
            </strong>
          </div>
          <div>
            <span className="oj-meta-label">{isHi ? 'लग्न / चंद्र' : 'Lagna / Moon'}:</span>
            <strong>
              {chart.ascendant.signName} / {moon.signName}
            </strong>
          </div>
          <div>
            <span className="oj-meta-label">{isHi ? 'नक्षत्र' : 'Birth Star'}:</span>
            <strong>
              {moon.nakshatraName} ({moon.pada})
            </strong>
          </div>
          <div>
            <span className="oj-meta-label">{isHi ? 'मुख्य नियंत्रक ग्रह' : 'Life Controller'}:</span>
            <strong style={{ color: 'var(--accent)' }}>{report.summary.primaryLifeController}</strong>
          </div>
          <div>
            <span className="oj-meta-label">{isHi ? 'इष्ट देवता' : 'Ishta Devata'}:</span>
            <strong style={{ color: '#047857' }}>{report.summary.ishtaDevata}</strong>
          </div>
        </div>
      </div>

      {/* Summary Scorecard Strip */}
      <div className="oj-scorecard-strip">
        <div className="oj-score-card highly-favorable">
          <span className="oj-score-num">{report.summary.highlyFavorableCount}</span>
          <span className="oj-score-lbl">{isHi ? 'अति शुभ आयाम' : 'Highly Favorable'}</span>
        </div>
        <div className="oj-score-card favorable">
          <span className="oj-score-num">{report.summary.favorableCount}</span>
          <span className="oj-score-lbl">{isHi ? 'अनुकूल आयाम' : 'Favorable'}</span>
        </div>
        <div className="oj-score-card mixed">
          <span className="oj-score-num">{report.summary.mixedCount}</span>
          <span className="oj-score-lbl">{isHi ? 'मध्यम / मिश्रित' : 'Mixed / Balanced'}</span>
        </div>
        <div className="oj-score-card caution">
          <span className="oj-score-num">{report.summary.cautionCount}</span>
          <span className="oj-score-lbl">{isHi ? 'सतर्कता आयाम' : 'Needs Caution'}</span>
        </div>
      </div>

      {/* Classical Sign Milestone Years & 22nd Drekkana Card */}
      <div
        className="oj-card"
        style={{
          marginBottom: '16px',
          padding: '16px 20px',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Clock size={16} style={{ color: 'var(--accent)' }} />
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>
            {isHi
              ? 'शास्त्रीय लग्न व चंद्र कालचक्र — शुभ, सतर्कता वर्ष एवं 22वां खर द्रेष्काण वेध'
              : 'Classical Sign Milestones — Auspicious & Caution Years & 22nd Drekkana'}
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {/* Lagna Sign Milestones */}
          <div style={{ background: 'var(--bg-subtle)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <strong style={{ fontSize: '13.5px', color: 'var(--accent)' }}>
                {isHi ? `लग्न राशि: ${milestonesReport.lagnaSign.nameHi}` : `Lagna Sign: ${milestonesReport.lagnaSign.nameEn}`}
              </strong>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {isHi ? 'देहाधिपति काल' : 'Ascendant Years'}
              </span>
            </div>

            <div style={{ marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', display: 'block', marginBottom: '4px' }}>
                {isHi ? 'शुभ व भाग्योदय वर्ष:' : 'Auspicious Milestone Years:'}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {milestonesReport.lagnaSign.auspiciousYears.map((yr: number) => (
                  <span
                    key={`lagna-ausp-${yr}`}
                    className="tag tag-varg"
                    style={{ fontSize: '11px', padding: '2px 7px' }}
                  >
                    {yr} {isHi ? 'वर्ष' : 'yr'}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626', display: 'block', marginBottom: '4px' }}>
                {isHi ? 'सतर्कता / अरिष्ट वर्ष:' : 'Caution / Vulnerability Years:'}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {milestonesReport.lagnaSign.inauspiciousYears.map((yr: number) => (
                  <span
                    key={`lagna-caut-${yr}`}
                    className="tag tag-combust"
                    style={{ fontSize: '11px', padding: '2px 7px' }}
                  >
                    {yr} {isHi ? 'वर्ष' : 'yr'}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.45 }}>
              <strong>{isHi ? 'रोग संवेदनशीलता: ' : 'Vulnerability: '}</strong>
              {isHi ? milestonesReport.lagnaSign.vulnerabilitiesHi : milestonesReport.lagnaSign.vulnerabilitiesEn}
            </div>
          </div>

          {/* Moon Sign Milestones */}
          <div style={{ background: 'var(--bg-subtle)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <strong style={{ fontSize: '13.5px', color: 'var(--accent)' }}>
                {isHi ? `जन्म चंद्र राशि: ${milestonesReport.moonSign.nameHi}` : `Moon Sign: ${milestonesReport.moonSign.nameEn}`}
              </strong>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {isHi ? 'मानसिक व भाग्य काल' : 'Janma Rasi Years'}
              </span>
            </div>

            <div style={{ marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', display: 'block', marginBottom: '4px' }}>
                {isHi ? 'शुभ व भाग्योदय वर्ष:' : 'Auspicious Milestone Years:'}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {milestonesReport.moonSign.auspiciousYears.map((yr: number) => (
                  <span
                    key={`moon-ausp-${yr}`}
                    className="tag tag-varg"
                    style={{ fontSize: '11px', padding: '2px 7px' }}
                  >
                    {yr} {isHi ? 'वर्ष' : 'yr'}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626', display: 'block', marginBottom: '4px' }}>
                {isHi ? 'सतर्कता / अरिष्ट वर्ष:' : 'Caution / Vulnerability Years:'}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {milestonesReport.moonSign.inauspiciousYears.map((yr: number) => (
                  <span
                    key={`moon-caut-${yr}`}
                    className="tag tag-combust"
                    style={{ fontSize: '11px', padding: '2px 7px' }}
                  >
                    {yr} {isHi ? 'वर्ष' : 'yr'}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.45 }}>
              <strong>{isHi ? 'अनुकूल कर्मक्षेत्र: ' : 'Suited Careers: '}</strong>
              {isHi ? milestonesReport.moonSign.careerFitHi : milestonesReport.moonSign.careerFitEn}
            </div>
          </div>

          {/* 22nd Drekkana (Kharesh) Maraka Indicator */}
          <div style={{ background: 'var(--bg-subtle)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <strong style={{ fontSize: '13.5px', color: '#dc2626' }}>
                {isHi ? '22वां खर द्रेष्काण वेध' : '22nd Drekkana (Kharesh)'}
              </strong>
              <span className="tag tag-combust" style={{ fontSize: '10px' }}>
                {isHi ? 'आयु व स्वास्थ्य वेध' : 'Longevity Maraka'}
              </span>
            </div>

            <div style={{ fontSize: '12px', lineHeight: 1.5, color: 'var(--text)', marginBottom: '8px' }}>
              {isHi ? milestonesReport.drekkanaAnalysis.marakaWarningHi : milestonesReport.drekkanaAnalysis.marakaWarningEn}
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '6px' }}>
              <span>
                {isHi
                  ? `लग्न द्रेष्काण: खंड ${milestonesReport.drekkanaAnalysis.lagnaDrekkana.drekkanaNumber} (${milestonesReport.drekkanaAnalysis.lagnaDrekkana.classificationHi}) · स्वामी: ${milestonesReport.drekkanaAnalysis.lagnaDrekkana.rulingPlanetHi}`
                  : `Lagna Drekkana: Dec ${milestonesReport.drekkanaAnalysis.lagnaDrekkana.drekkanaNumber} (${milestonesReport.drekkanaAnalysis.lagnaDrekkana.classification}) · Ruler: ${milestonesReport.drekkanaAnalysis.lagnaDrekkana.rulingPlanet}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Multi-tier Filter Bar */}
      <div className="oj-filter-controls-card no-print">
        {/* Search Row */}
        <div className="oj-search-row">
          <div className="oj-search-box">
            <Search size={15} className="oj-search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isHi
                  ? 'खोजें (विवाह, शिक्षा, पिता, करियर, सर्जरी, धन योग, फलदीपिका, वक्री, आयु वर्ष...)'
                  : 'Search (marriage, career, father, surgery, wealth, Phaladeepika, retrograde, age milestone...)'
              }
              className="oj-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="oj-clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                ×
              </button>
            )}
          </div>
          <div className="oj-results-count">
            {filterType === 'milestones'
              ? (isHi
                  ? `कुल ${filteredMilestones.length} कालचक्र वर्ष प्रदर्शित · वर्तमान आयु: ${milestonesReport.currentAge.toFixed(1)} वर्ष`
                  : `Showing ${filteredMilestones.length} of ${milestonesReport.summary.totalMilestones} Milestones · Current Age: ${milestonesReport.currentAge.toFixed(1)} Yrs`)
              : filterType === 'stree_jataka'
                ? (isHi
                    ? `कुल ${filteredStreeJataka.length} स्त्री जातक ग्रह सूत्र प्रदर्शित`
                    : `Showing ${filteredStreeJataka.length} Stree Jataka Sutras`)
                : (isHi
                    ? `कुल ${filteredDimensions.length} आयाम प्रदर्शित`
                    : `Showing ${filteredDimensions.length} of 21 Predictions`)}
          </div>
        </div>

        {/* Filter Mode Selector */}
        <div style={{ display: 'flex', gap: '8px', margin: '10px 0 8px 0', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>
            {isHi ? 'फिल्टर वर्गीकरण:' : 'Filter Grouping:'}
          </span>
          <button
            type="button"
            className={`oj-cat-pill ${filterType === 'house' ? 'active' : ''}`}
            onClick={() => setFilterType('house')}
            style={{ fontSize: '12px', padding: '4px 10px' }}
          >
            <Grid size={13} />
            <span>{isHi ? '12 भाव अनुसार (House-wise)' : '12 Houses View'}</span>
          </button>
          <button
            type="button"
            className={`oj-cat-pill ${filterType === 'category' ? 'active' : ''}`}
            onClick={() => setFilterType('category')}
            style={{ fontSize: '12px', padding: '4px 10px' }}
          >
            <Layers size={13} />
            <span>{isHi ? 'विषय / श्रेणी अनुसार (Categories)' : 'Category View'}</span>
          </button>
          <button
            type="button"
            className={`oj-cat-pill ${filterType === 'milestones' ? 'active' : ''}`}
            onClick={() => setFilterType('milestones')}
            style={{ fontSize: '12px', padding: '4px 10px' }}
          >
            <Clock size={13} />
            <span>
              {isHi
                ? `आयु कालचक्र (${milestonesReport.summary.totalMilestones} वर्ष)`
                : `Life Milestones Timeline (${milestonesReport.summary.totalMilestones})`}
            </span>
          </button>
          <button
            type="button"
            className={`oj-cat-pill ${filterType === 'stree_jataka' ? 'active' : ''}`}
            onClick={() => setFilterType('stree_jataka')}
            style={{ fontSize: '12px', padding: '4px 10px' }}
          >
            <Heart size={13} />
            <span>
              {isHi
                ? 'स्त्री जातक विशेष (9 ग्रह)'
                : 'Stree Jataka Special (9 Planets)'}
            </span>
          </button>
        </div>

        {/* 12 Bhavas Scrollable Strip */}
        {filterType === 'house' && (
          <div className="oj-bhava-filter-strip">
            {houses.map((h) => {
              const isSelected = selectedHouse === h.num;
              return (
                <button
                  key={String(h.num)}
                  type="button"
                  className={`oj-cat-pill ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedHouse(h.num as any)}
                  style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                  <span>{isHi ? h.titleHi : h.titleEn}</span>
                  <span style={{ fontSize: '10px', opacity: 0.8, marginLeft: '4px' }}>
                    ({h.count})
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Category Pills Strip */}
        {filterType === 'category' && (
          <div className="oj-category-pills-row">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                className={`oj-cat-pill ${selectedCategory === cat.key ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.key)}
              >
                {cat.icon}
                <span>{isHi ? cat.labelHi : cat.labelEn}</span>
              </button>
            ))}
          </div>
        )}

        {/* Milestone Status Filter Strip */}
        {filterType === 'milestones' && (
          <div className="oj-category-pills-row">
            <button
              type="button"
              className={`oj-cat-pill ${milestoneStatusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setMilestoneStatusFilter('all')}
            >
              <Sparkles size={13} />
              <span>{isHi ? `समस्त कालखंड (${milestonesReport.summary.totalMilestones})` : `All Milestones (${milestonesReport.summary.totalMilestones})`}</span>
            </button>
            <button
              type="button"
              className={`oj-cat-pill ${milestoneStatusFilter === 'active' ? 'active' : ''}`}
              onClick={() => setMilestoneStatusFilter('active')}
            >
              <Activity size={13} />
              <span>{isHi ? `सक्रिय वर्तमान काल (${milestonesReport.summary.activeCount})` : `Active Current Window (${milestonesReport.summary.activeCount})`}</span>
            </button>
            <button
              type="button"
              className={`oj-cat-pill ${milestoneStatusFilter === 'upcoming' ? 'active' : ''}`}
              onClick={() => setMilestoneStatusFilter('upcoming')}
            >
              <Clock size={13} />
              <span>{isHi ? `आगामी समय काल (${milestonesReport.summary.upcomingCount})` : `Upcoming Horizon (${milestonesReport.summary.upcomingCount})`}</span>
            </button>
            <button
              type="button"
              className={`oj-cat-pill ${milestoneStatusFilter === 'realized' ? 'active' : ''}`}
              onClick={() => setMilestoneStatusFilter('realized')}
            >
              <CheckCircle2 size={13} />
              <span>{isHi ? `घटित / पूर्व काल (${milestonesReport.summary.realizedCount})` : `Past / Realized (${milestonesReport.summary.realizedCount})`}</span>
            </button>
          </div>
        )}
      </div>

      {/* 51 Dimensions & Classical Timeline Container */}
      <div className="oj-50-predictions-container">
        {/* VIEW 1: Milestones Timeline */}
        {filterType === 'milestones' && (
          <>
            <div
              className="oj-card"
              style={{
                marginBottom: '14px',
                padding: '14px 18px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div>
                <strong style={{ fontSize: '15px', color: 'var(--accent)' }}>
                  {isHi ? 'आयु वर्ष कालचक्र — शास्त्रीय कालखंड फलादेश' : 'Chronological Life Milestones — Classical Timeline'}
                </strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  {isHi
                    ? `जातक जन्म वर्ष: ${milestonesReport.birthYear} · वर्तमान आयु: ${milestonesReport.currentAge.toFixed(1)} वर्ष · ग्रहों की भाव स्थिति एवं राशि कालचक्र अनुसार निर्धारित मील के पत्थर`
                    : `Birth Year: ${milestonesReport.birthYear} · Current Native Age: ${milestonesReport.currentAge.toFixed(1)} Yrs · Determined by planetary house positions and sign milestone years.`}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="tag tag-varg" style={{ fontSize: '12px', padding: '3px 8px' }}>
                  {isHi ? `शुभ वर्ष: ${milestonesReport.summary.favorableCount}` : `Favorable: ${milestonesReport.summary.favorableCount}`}
                </span>
                <span className="tag tag-combust" style={{ fontSize: '12px', padding: '3px 8px' }}>
                  {isHi ? `सतर्कता वर्ष: ${milestonesReport.summary.challengingCount}` : `Caution: ${milestonesReport.summary.challengingCount}`}
                </span>
              </div>
            </div>

            {filteredMilestones.map((m) => {
              const isChallenging = m.nature === 'challenging' || m.nature === 'health';
              return (
                <article
                  key={m.id}
                  className={`oj-dim-card oj-dim-${isChallenging ? 'challenging_caution' : 'favorable'}`}
                  id={`milestone-${m.id}`}
                >
                  <div className="oj-dim-header">
                    <div className="oj-dim-id-badge" style={{ gap: '6px', flexWrap: 'wrap' }}>
                      <span className="oj-dim-num" style={{ fontSize: '13px', fontWeight: 800 }}>
                        {isHi ? `आयु ${m.age} वर्ष` : `Age ${m.age} Yrs`}
                      </span>
                      <span className="oj-dim-house-badge">
                        {isHi ? `ई. सन् ${m.calendarYear}` : `Year ${m.calendarYear}`}
                      </span>
                      {m.sourceGraha && (
                        <span className="oj-dim-cat-tag">
                          {isHi ? `${m.sourceGrahaHi} — ${m.houseTitleHi}` : `${m.sourceGraha} — ${m.houseTitleEn}`}
                        </span>
                      )}
                    </div>
                    <div className={`oj-dim-auspicious-pill ${m.status === 'active' ? 'highly_favorable' : m.status === 'upcoming' ? 'favorable' : 'mixed_moderate'}`}>
                      {isHi ? m.statusTitleHi : m.statusTitleEn}
                    </div>
                  </div>

                  <h2 className="oj-dim-title">{isHi ? m.titleHi : m.titleEn}</h2>

                  <div className="oj-dim-basis-box">
                    <div className="oj-dim-basis-label">
                      <Clock size={13} />
                      <span>{isHi ? 'कालचक्र निर्धारण सूत्र:' : 'Chronological Milestone Formula:'}</span>
                    </div>
                    <div className="oj-dim-basis-text">
                      {isHi
                        ? `जातक जन्म: ${milestonesReport.birthYear} · लक्षित आयु: ${m.age} वर्ष · वर्तमान आयु: ${milestonesReport.currentAge.toFixed(1)} वर्ष (${m.statusTitleHi})`
                        : `Birth: ${milestonesReport.birthYear} · Target Age: ${m.age} · Native Age: ${milestonesReport.currentAge.toFixed(1)} Yrs (${m.statusTitleEn})`}
                    </div>
                  </div>

                  <div className="oj-dim-verdict-box">
                    <div className="oj-dim-verdict-label">
                      <CheckCircle2 size={14} />
                      <span>{isHi ? 'शास्त्रीय फलकथन घटना (Textbook Sutra):' : 'Classical Textbook Event & Trigger:'}</span>
                    </div>
                    <div className="oj-dim-verdict-text">
                      {isHi ? m.eventHi : m.eventEn}
                    </div>
                  </div>
                </article>
              );
            })}

            {filteredMilestones.length === 0 && (
              <div className="oj-no-results-card">
                <AlertTriangle size={32} />
                <p>
                  {isHi
                    ? 'इस कालखंड में कोई मील का पत्थर नहीं मिला।'
                    : 'No milestones found in this status category.'}
                </p>
                <button
                  type="button"
                  className="oj-action-btn secondary"
                  onClick={() => {
                    setMilestoneStatusFilter('all');
                    setSearchQuery('');
                  }}
                >
                  {isHi ? 'समस्त कालखंड देखें' : 'Show All Milestones'}
                </button>
              </div>
            )}
          </>
        )}

        {/* VIEW 2: Stree Jataka */}
        {filterType === 'stree_jataka' && (
          <>
            <div
              className="oj-card"
              style={{
                marginBottom: '14px',
                padding: '14px 18px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
              }}
            >
              <div className="oj-header-badge">
                {isHi
                  ? 'फलदीपिका एवं बृहत्पाराशर होरा शास्त्र — स्त्री जातक अध्याय'
                  : 'Classical Stree Jataka — Phaladeepika & BPHS Female Horoscopy Sutras'}
              </div>
              <h3 style={{ margin: '6px 0 2px 0', fontSize: '15px', fontWeight: 700 }}>
                {isHi
                  ? 'स्त्री कुंडली में 9 ग्रहों के भाव स्थित शास्त्रीय फल'
                  : 'Classical Manifestation of 9 Planets in Female Horoscopy'}
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                {isHi
                  ? 'स्त्री जातक में लग्न, सप्तम, अष्टम व नवम भाव का विशेष महत्व होता है। यह विश्लेषण पाठ्यपुस्तक के स्त्री जातक सूत्रों पर आधारित है।'
                  : 'Female horoscopy accords paramount importance to the 1st, 7th, 8th, and 9th houses. This dossier details planetary manifestations without sugarcoating.'}
              </p>
            </div>

            {filteredStreeJataka.map((sj, idx) => (
              <article key={idx} className="oj-dim-card">
                <div className="oj-dim-header">
                  <div className="oj-dim-id-badge" style={{ gap: '6px' }}>
                    <span className="oj-dim-num">#{idx + 1}</span>
                    <span className="oj-dim-cat-tag">
                      {isHi ? sj.planetHi : sj.planet}
                    </span>
                    <span className="oj-dim-house-badge">
                      {isHi ? sj.houseTitleHi : sj.houseTitleEn}
                    </span>
                  </div>
                  <div className="oj-dim-auspicious-pill favorable">
                    {isHi ? 'स्त्री जातक सूत्र' : 'Stree Jataka Sutra'}
                  </div>
                </div>

                <h2 className="oj-dim-title">
                  {isHi ? `${sj.planetHi} का ${sj.houseTitleHi} में स्त्री जातक फल` : `${sj.planet} in ${sj.houseTitleEn} in Female Horoscope`}
                </h2>

                <div className="oj-dim-basis-box">
                  <div className="oj-dim-basis-label">
                    <BookOpen size={13} />
                    <span>{isHi ? 'शास्त्रीय ग्रंथ संदर्भ:' : 'Classical Source:'}</span>
                  </div>
                  <div className="oj-dim-basis-text">
                    {isHi
                      ? `${sj.planetHi} जन्म कुंडली में ${sj.houseTitleHi} में स्थित है · फलदीपिका एवं बृहत्पाराशर स्त्री जातक अध्याय`
                      : `${sj.planet} placed in ${sj.houseTitleEn} · Phaladeepika & BPHS Female Horoscopy Chapters`}
                  </div>
                </div>

                <div className="oj-dim-verdict-box">
                  <div className="oj-dim-verdict-label">
                    <CheckCircle2 size={14} />
                    <span>{isHi ? 'विशिष्ट फलादेश निष्कर्ष:' : 'Specific Classical Manifestation:'}</span>
                  </div>
                  <div className="oj-dim-verdict-text">
                    {isHi ? sj.sutraHi : sj.sutraEn}
                  </div>
                </div>
              </article>
            ))}

            {filteredStreeJataka.length === 0 && (
              <div className="oj-no-results-card">
                <AlertTriangle size={32} />
                <p>
                  {isHi
                    ? 'कोई स्त्री जातक सूत्र नहीं मिला।'
                    : 'No Stree Jataka sutras match your search filter.'}
                </p>
              </div>
            )}
          </>
        )}

        {/* VIEW 3: 51 Master Dimensions (House-wise or Category-wise) */}
        {(filterType === 'house' || filterType === 'category') && (
          <>
            {filteredDimensions.map((dim) => (
              <article
                key={dim.id}
                className={`oj-dim-card oj-dim-${dim.auspiciousness}`}
                id={`dimension-${dim.id}`}
              >
                {/* Header: Number, House Badge, Category Badge & Auspiciousness Pill */}
                <div className="oj-dim-header">
                  <div className="oj-dim-id-badge" style={{ gap: '6px', flexWrap: 'wrap' }}>
                    <span className="oj-dim-num">#{dim.id}</span>
                    {dim.houseNumber && (
                      <span className="oj-dim-house-badge">
                        {isHi ? dim.houseTitleHi : dim.houseTitleEn}
                      </span>
                    )}
                    <span className="oj-dim-cat-tag">
                      {isHi ? dim.categoryTitleHi : dim.categoryTitleEn}
                    </span>
                  </div>
                  <div className={`oj-dim-auspicious-pill ${dim.auspiciousness}`}>
                    {dim.auspiciousness === 'highly_favorable' && (isHi ? 'अति शुभ (90%+)' : 'Highly Auspicious')}
                    {dim.auspiciousness === 'favorable' && (isHi ? 'शुभ व अनुकूल' : 'Favorable')}
                    {dim.auspiciousness === 'mixed_moderate' && (isHi ? 'संतुलित / मिश्रित' : 'Balanced / Mixed')}
                    {dim.auspiciousness === 'challenging_caution' && (isHi ? 'सतर्कता अपेक्षित' : 'Needs Caution')}
                  </div>
                </div>

                {/* Classical Attributions & Divisional Badges */}
                <div className="oj-dim-badges-row">
                  {dim.classicalRef && (
                    <span className="oj-dim-classical-badge" title={isHi ? 'शास्त्रीय ग्रंथ एवं ऋषि मत' : 'Classical Astrological Source'}>
                      <BookOpen size={11} />
                      <span>{dim.classicalRef}</span>
                    </span>
                  )}
                  {dim.divisionalRef && (
                    <span className="oj-dim-varga-badge" title={isHi ? 'वर्ग कुंडली प्रमाण' : 'Divisional Chart Verification'}>
                      <Compass size={11} />
                      <span>{dim.divisionalRef}</span>
                    </span>
                  )}
                </div>

                {/* Retrograde / Vakri Dynamic Note (when present) */}
                {dim.vakriNote && (
                  <div className="oj-dim-vakri-badge">
                    <Flame size={13} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{dim.vakriNote}</span>
                  </div>
                )}

                <h2 className="oj-dim-title">{isHi ? dim.titleHi : dim.titleEn}</h2>

                {/* Astrological Determinants (Exact Basis) */}
                <div className="oj-dim-basis-box">
                  <div className="oj-dim-basis-label">
                    <Compass size={13} />
                    <span>{isHi ? 'ज्योतिषीय आधार (कुंडली सूत्र):' : 'Astrological Basis (Exact Placements):'}</span>
                  </div>
                  <div className="oj-dim-basis-text">
                    {isHi ? dim.astroBasisHi : dim.astroBasisEn}
                  </div>
                </div>

                {/* Clear Decisive Verdict */}
                <div className="oj-dim-verdict-box">
                  <div className="oj-dim-verdict-label">
                    <CheckCircle2 size={14} />
                    <span>{isHi ? 'स्पष्ट फलादेश निष्कर्ष:' : 'Concrete Verdict:'}</span>
                  </div>
                  <div className="oj-dim-verdict-text">
                    {isHi ? dim.verdictHi : dim.verdictEn}
                  </div>
                </div>

                {/* In-Depth Classical Vedic Analysis */}
                <div className="oj-dim-analysis-box">
                  <p className="oj-dim-analysis-text">
                    {isHi ? dim.detailedAnalysisHi : dim.detailedAnalysisEn}
                  </p>
                </div>

                {/* Authentic Classical Remedy */}
                <div className="oj-dim-remedy-box">
                  <div className="oj-dim-remedy-label">
                    <Sparkles size={13} />
                    <span>{isHi ? 'वैदिक शांति उपाय व मंत्र:' : 'Vedic Remedy & Protective Protocol:'}</span>
                  </div>
                  <div className="oj-dim-remedy-text">
                    {isHi ? dim.remedyHi : dim.remedyEn}
                  </div>
                </div>
              </article>
            ))}

            {filteredDimensions.length === 0 && (
              <div className="oj-no-results-card">
                <AlertTriangle size={32} />
                <p>
                  {isHi
                    ? 'कोई फलकथन नहीं मिला। कृपया अन्य खोज शब्द का प्रयास करें।'
                    : 'No dimensions match your search filter. Please try a different query.'}
                </p>
                <button
                  type="button"
                  className="oj-action-btn secondary"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedHouse('all');
                    setSelectedCategory('all');
                  }}
                >
                  {isHi ? 'सभी 21 आयाम दिखाएं' : 'Reset Filters & Show All 21'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
