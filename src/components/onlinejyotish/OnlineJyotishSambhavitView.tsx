import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  Compass,
  Download,
  Flame,
  Heart,
  Moon,
  Printer,
  Search,
  Shield,
  Sparkles,
  Star,
  Sun,
  User,
  Users,
} from 'lucide-react';
import {
  computeSambhavitFalkathan,
  type DimensionCategory,
  type LifeDimensionReading,
  type SambhavitFalkathanReport,
} from '../../astro/predictions/sambhavitFalkathan';
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

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const report: SambhavitFalkathanReport = useMemo(() => {
    return computeSambhavitFalkathan(chart);
  }, [chart]);

  const moon = useMemo(
    () => chart.planets.find((p) => p.id === 'Moon') || chart.ascendant,
    [chart]
  );

  const categories: { key: string; labelEn: string; labelHi: string; icon: React.ReactNode }[] = [
    { key: 'all', labelEn: 'All 50 Dimensions', labelHi: 'समस्त 50 आयाम', icon: <Sparkles size={14} /> },
    { key: 'identity', labelEn: 'Identity & Core', labelHi: 'पहचान व आत्म', icon: <User size={14} /> },
    { key: 'family', labelEn: 'Parents & Lineage', labelHi: 'माता-पिता व कुल', icon: <Users size={14} /> },
    { key: 'marriage', labelEn: 'Marriage & Spouse', labelHi: 'विवाह व दांपत्य', icon: <Heart size={14} /> },
    { key: 'progeny', labelEn: 'Progeny & Family', labelHi: 'संतान व वंश', icon: <Star size={14} /> },
    { key: 'education', labelEn: 'Education & Intellect', labelHi: 'शिक्षा व विद्या', icon: <BookOpen size={14} /> },
    { key: 'career', labelEn: 'Career & Authority', labelHi: 'करियर व पद', icon: <Briefcase size={14} /> },
    { key: 'longevity_health', labelEn: 'Health & Longevity', labelHi: 'स्वास्थ्य व आयु', icon: <Activity size={14} /> },
    { key: 'shadow_challenges', labelEn: 'Shadow Challenges', labelHi: 'चुनौतियां व सतर्कता', icon: <Shield size={14} /> },
    { key: 'spirituality', labelEn: 'Spirituality & Grace', labelHi: 'आध्यात्म व मोक्ष', icon: <Flame size={14} /> },
    { key: 'wealth_fortune', labelEn: 'Wealth & Prosperity', labelHi: 'धन व समृद्धि', icon: <Award size={14} /> },
  ];

  // Filter dimensions
  const filteredDimensions = useMemo(() => {
    return report.dimensions.filter((d) => {
      const matchCat = selectedCategory === 'all' || d.category === selectedCategory;
      if (!matchCat) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const inTitle = d.titleEn.toLowerCase().includes(q) || d.titleHi.includes(q);
      const inVerdict = d.verdictEn.toLowerCase().includes(q) || d.verdictHi.includes(q);
      const inBasis = d.astroBasisEn.toLowerCase().includes(q) || d.astroBasisHi.includes(q);
      const inAnalysis = d.detailedAnalysisEn.toLowerCase().includes(q) || d.detailedAnalysisHi.includes(q);
      return inTitle || inVerdict || inBasis || inAnalysis;
    });
  }, [report.dimensions, selectedCategory, searchQuery]);

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
          {isHi ? 'संभावित फलकथन (50 जीवन आयाम)' : 'Sambhavit Falkathan (50 Life Dimensions)'}
        </span>
      </nav>

      {/* Header Banner */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          {isHi
            ? 'समस्त 16 वर्ग कुंडलियों एवं अष्टकवर्ग (SAV 337) का संश्लेषित फलित · 100% निःशुल्क'
            : 'Synthesized Synthesis of All 16 Divisional Charts & Ashtakavarga · 100% Free'}
        </div>
        <h1 className="oj-page-title">
          {isHi
            ? 'संभावित फलकथन — जीवन के 50 अनिवार्य पक्षों का प्रामाणिक व गतिशील विश्लेषण'
            : 'Sambhavit Falkathan — 50 Dynamic & In-Depth Life Predictions'}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? 'जातक के विशिष्ट लग्न, भावेश, ग्रह गरिमा, अष्टकवर्ग बिंदु एवं वर्तमान विंशोत्तरी दशा पर आधारित बिंदुवार प्रामाणिक फलादेश। कोई भी फलादेश सामान्य या स्थिर नहीं है।'
            : 'Point-wise classical dossier strictly customized to the native’s exact Lagna, House Lords, planetary dignities, Ashtakavarga SAV points, and current Vimshottari Mahadasha/Antardasha.'}
        </p>

        {/* Action Buttons */}
        <div className="oj-page-actions-bar no-print">
          <button type="button" className="oj-action-btn primary" onClick={onOpenBooklet}>
            <Download size={14} />
            <span>{isHi ? 'संपूर्ण 118-पृष्ठ पीडीएफ डाउनलोड करें' : 'Download Complete 118-Page PDF'}</span>
          </button>
          <button type="button" className="oj-action-btn secondary" onClick={() => window.print()}>
            <Printer size={14} />
            <span>{isHi ? 'फलकथन प्रिंट करें' : 'Print 50 Dimensions Dossier'}</span>
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

      {/* Search & Category Filter Bar */}
      <div className="oj-filter-controls-card no-print">
        <div className="oj-search-row">
          <div className="oj-search-box">
            <Search size={15} className="oj-search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isHi
                  ? '50 फलकथनों में खोजें (उदा: विवाह, शिक्षा, पिता, करियर, सर्जरी, धन योग...)'
                  : 'Search 50 predictions (e.g. marriage, career, father, surgery, wealth, progeny...)'
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
            {isHi
              ? `कुल ${filteredDimensions.length} आयाम प्रदर्शित`
              : `Showing ${filteredDimensions.length} of 50 Dimensions`}
          </div>
        </div>

        {/* Categories Pills */}
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
      </div>

      {/* 50 Dimensions Grid */}
      <div className="oj-50-predictions-container">
        {filteredDimensions.map((dim) => (
          <article
            key={dim.id}
            className={`oj-dim-card oj-dim-${dim.auspiciousness}`}
            id={`dimension-${dim.id}`}
          >
            {/* Header: Number, Title, Category Badge & Auspiciousness Pill */}
            <div className="oj-dim-header">
              <div className="oj-dim-id-badge">
                <span className="oj-dim-num">#{dim.id}</span>
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
                setSelectedCategory('all');
              }}
            >
              {isHi ? 'सभी 50 आयाम दिखाएं' : 'Reset Filters & Show All 50'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
