import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
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

  const [filterType, setFilterType] = useState<'house' | 'category'>('house');
  const [selectedHouse, setSelectedHouse] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const report: SambhavitFalkathanReport = useMemo(() => {
    return computeSambhavitFalkathan(chart);
  }, [chart]);

  const moon = useMemo(
    () => chart.planets.find((p) => p.id === 'Moon') || chart.ascendant,
    [chart]
  );

  const houses = useMemo(() => [
    { num: 'all', titleEn: 'All 101 Dimensions', titleHi: 'समस्त 101 आयाम', count: 101 },
    { num: 1, titleEn: 'H1: Tanu & Self', titleHi: 'भाव 1: तनु व देह', count: 10 },
    { num: 2, titleEn: 'H2: Dhana & Speech', titleHi: 'भाव 2: धन व वाणी', count: 8 },
    { num: 3, titleEn: 'H3: Sahaja & Valour', titleHi: 'भाव 3: सहज व पराक्रम', count: 8 },
    { num: 4, titleEn: 'H4: Sukha & Mother', titleHi: 'भाव 4: सुख व मातृ', count: 9 },
    { num: 5, titleEn: 'H5: Intellect & Progeny', titleHi: 'भाव 5: बुद्धि व संतान', count: 10 },
    { num: 6, titleEn: 'H6: Disease & Debts', titleHi: 'भाव 6: रोग, ऋण व शत्रु', count: 9 },
    { num: 7, titleEn: 'H7: Marriage & Trade', titleHi: 'भाव 7: विवाह व व्यापार', count: 10 },
    { num: 8, titleEn: 'H8: Longevity & Mystery', titleHi: 'भाव 8: आयु व रंध्र', count: 9 },
    { num: 9, titleEn: 'H9: Fortune & Dharma', titleHi: 'भाव 9: भाग्य व धर्म', count: 9 },
    { num: 10, titleEn: 'H10: Karma & Vocation', titleHi: 'भाव 10: कर्म व पद', count: 9 },
    { num: 11, titleEn: 'H11: Gains & Network', titleHi: 'भाव 11: लाभ व आय', count: 5 },
    { num: 12, titleEn: 'H12: Moksha & Foreign', titleHi: 'भाव 12: व्यय व मोक्ष', count: 5 },
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
          {isHi ? 'संभावित फलकथन (101 जीवन आयाम)' : 'Sambhavit Falkathan (101 Life Dimensions)'}
        </span>
      </nav>

      {/* Header Banner */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          {isHi
            ? 'पाराशर, जैमिनी, वराहमिहिर, फलदीपिका, सारावली, लाल किताब व बी.वी. रमन मत संश्लेषित · 100% निःशुल्क'
            : 'Multi-Author Classical Synthesis: BPHS, Jaimini, Phaladeepika, Saravali, Lal Kitab & B.V. Raman · 100% Free'}
        </div>
        <h1 className="oj-page-title">
          {isHi
            ? 'संभावित फलकथन — जीवन के 101 शास्त्रीय आयामों का प्रामाणिक व गतिशील महा-विश्लेषण'
            : 'Sambhavit Falkathan — 101 Classical Life Dimensions Authentic Dossier'}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? 'समस्त 12 भावों, भावेश गरिमा, नवांश/दशमांश वर्ग पुष्टि, वक्री ग्रह चेष्टा बल एवं वर्तमान विंशोत्तरी महादशा-अंतर्दशा पर आधारित 101 बिंदुवार प्रामाणिक फलादेश।'
            : 'Point-wise classical dossier covering all 12 houses, planetary dignities, D9/D10 divisional verifications, retrograde chesta bala calculations, and active Vimshottari dasha.'}
        </p>

        {/* Action Buttons */}
        <div className="oj-page-actions-bar no-print">
          <button type="button" className="oj-action-btn primary" onClick={onOpenBooklet}>
            <Download size={14} />
            <span>{isHi ? 'संपूर्ण जन्म पत्रिका (Birth Report) डाउनलोड करें' : 'Download Complete Birth Report (PDF)'}</span>
          </button>
          <button type="button" className="oj-action-btn secondary" onClick={() => window.print()}>
            <Printer size={14} />
            <span>{isHi ? 'फलकथन प्रिंट करें' : 'Print 101 Dimensions Dossier'}</span>
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
                  ? '101 फलकथनों में खोजें (उदा: विवाह, शिक्षा, पिता, करियर, सर्जरी, धन योग, फलदीपिका, वक्री...)'
                  : 'Search 101 dimensions (e.g. marriage, career, father, surgery, wealth, Phaladeepika, retrograde...)'
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
              : `Showing ${filteredDimensions.length} of 101 Dimensions`}
          </div>
        </div>

        {/* Filter Mode Selector (12 Bhavas vs Categories) */}
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
      </div>

      {/* 101 Dimensions Grid */}
      <div className="oj-50-predictions-container">
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
              {isHi ? 'सभी 101 आयाम दिखाएं' : 'Reset Filters & Show All 101'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
