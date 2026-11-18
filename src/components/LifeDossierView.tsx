import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Award,
  BookOpen,
  Bookmark,
  Briefcase,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Coins,
  Compass,
  Download,
  Edit3,
  Eye,
  Flame,
  Globe,
  Heart,
  HelpCircle,
  Hourglass,
  Layers,
  MapPin,
  Moon,
  Printer,
  Scale,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sun,
  User,
  Users,
} from 'lucide-react';
import type { ChartData, ChartStyle, NineGrahaId, SevenPlanetId } from '../astro/types';
import { useLanguage } from '../i18n/LanguageContext';
import { trPlanet, trPlanetShort, trSign, trSignShort } from '../i18n/translations';
import { computeLifeDossierReport, type LifeDossierReport } from '../astro/predictions/lifeDossierEngine';
import { computeBhavaChalitPlacements } from '../astro/avakahadaChalit';
import { VedicChartSvg, type ChartBadgeItem } from './VedicChartSvg';
import { SIGNS } from '../astro/constants';

interface LifeDossierViewProps {
  chart: ChartData;
  chartStyle: ChartStyle;
  onChangeChartStyle?: (style: ChartStyle) => void;
  onOpenMatchMaking?: () => void;
  onOpenBooklet?: () => void;
  onOpenEditor?: () => void;
}

type ActiveChartType = 'D1' | 'D9' | 'Chalit' | 'Moon' | 'LalKitab';

export const LifeDossierView: React.FC<LifeDossierViewProps> = ({
  chart,
  chartStyle,
  onChangeChartStyle,
  onOpenMatchMaking,
  onOpenBooklet,
  onOpenEditor,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [activeChartType, setActiveChartType] = useState<ActiveChartType>('D1');
  const [collapsedChapters, setCollapsedChapters] = useState<Record<number, boolean>>({});
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'dossier' | 'charts' | 'planets'>('dossier');
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [isChapterDrawerOpen, setIsChapterDrawerOpen] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(1);

  // Generate 12-Chapter Master Life Dossier
  const dossier = useMemo<LifeDossierReport>(() => {
    return computeLifeDossierReport(chart);
  }, [chart]);

  // Compute Chalit placements for Chalit toggle
  const chalitData = useMemo(() => {
    try {
      return computeBhavaChalitPlacements(chart);
    } catch {
      return null;
    }
  }, [chart]);

  // Build Badges for Left Sticky Chart
  const { chartTitle, chartSubtitle, lagnaSignIndex, chartBadges } = useMemo(() => {
    if (activeChartType === 'D9') {
      const d9 = chart.divisionalCharts.D9;
      const ascSignIdx = d9?.lagnaSignIndex ?? 0;
      const badges: ChartBadgeItem[] = (d9?.placements ?? [])
        .filter((p) => p.id !== 'Asc')
        .map((p) => ({
          id: p.id,
          label: trPlanetShort(p.id, lang),
          signIndex: p.signIndex,
          isRetrograde: chart.planets.find((pl) => pl.id === p.id)?.isRetrograde ?? false,
          isCombust: chart.planets.find((pl) => pl.id === p.id)?.isCombust ?? false,
          dignity: p.dignity,
        }));
      return {
        chartTitle: isHi ? 'नवांश कुंडली (D9)' : 'Navamsha Chart (D9)',
        chartSubtitle: isHi ? 'धर्म, भाग्य व दांपत्य की आंतरिक शक्ति' : 'Dharma, Destiny & Inner Strengths',
        lagnaSignIndex: ascSignIdx,
        chartBadges: badges,
      };
    }

    if (activeChartType === 'Chalit') {
      const ascSignIdx = chart.ascendant.signIndex;
      const badges: ChartBadgeItem[] = (chalitData?.placements ?? []).map((p) => ({
        id: p.id,
        label: trPlanetShort(p.id, lang),
        signIndex: p.chalitDisplaySignIndex,
        houseNumber: p.chalitHouse,
        isRetrograde: p.isRetrograde,
        isCombust: p.isCombust,
        dignity: p.dignity,
        tooltip: p.shifted ? (isHi ? 'चलित भाव विस्थापन' : 'Shifted in Chalit') : undefined,
      }));
      return {
        chartTitle: isHi ? 'भाव चलित चक्र (श्रीपति)' : 'Bhava Chalit Chart (Sripati)',
        chartSubtitle: isHi ? 'वास्तविक दृश्य भाव सीमाएं' : 'True Visual House Boundaries',
        lagnaSignIndex: ascSignIdx,
        chartBadges: badges,
      };
    }

    if (activeChartType === 'Moon') {
      const moon = chart.planets.find((p) => p.id === 'Moon') ?? chart.planets[1];
      const ascSignIdx = moon.signIndex;
      const badges: ChartBadgeItem[] = chart.planets.map((p) => ({
        id: p.id,
        label: trPlanetShort(p.id, lang),
        signIndex: p.signIndex,
        isRetrograde: p.isRetrograde,
        isCombust: p.isCombust,
        dignity: p.dignity,
      }));
      return {
        chartTitle: isHi ? 'चंद्र कुंडली (Chandra Lagna)' : 'Moon Chart (Chandra Lagna)',
        chartSubtitle: isHi ? 'मन, भावना व मानसिक स्वास्थ्य' : 'Mind, Emotions & Mental Perception',
        lagnaSignIndex: ascSignIdx,
        chartBadges: badges,
      };
    }

    if (activeChartType === 'LalKitab') {
      // Fixed Aries base: Lagna = 0 (Aries)
      const badges: ChartBadgeItem[] = chart.planets.map((p) => {
        const fixedSignIdx = (p.rasiHouseNumber - 1) % 12;
        return {
          id: p.id,
          label: trPlanetShort(p.id, lang),
          signIndex: fixedSignIdx,
          isRetrograde: p.isRetrograde,
          isCombust: p.isCombust,
        };
      });
      return {
        chartTitle: isHi ? 'लाल किताब टेवा (स्थायी मेष आधार)' : 'Lal Kitab Tewa (Fixed Aries)',
        chartSubtitle: isHi ? 'स्थायी भाव अनुसार ग्रहों की स्थिति' : 'Fixed House Planetary Alignments',
        lagnaSignIndex: 0,
        chartBadges: badges,
      };
    }

    // Default D1 Lagna Kundali
    const ascSignIdx = chart.ascendant.signIndex;
    const badges: ChartBadgeItem[] = chart.planets.map((p) => ({
      id: p.id,
      label: trPlanetShort(p.id, lang),
      signIndex: p.signIndex,
      isRetrograde: p.isRetrograde,
      isCombust: p.isCombust,
      dignity: p.dignity,
    }));
    return {
      chartTitle: isHi ? 'जन्म लग्न कुंडली (D1)' : 'Birth Lagna Kundali (D1)',
      chartSubtitle: isHi ? 'स्थूल शरीर, मूल प्रारब्ध व व्यक्तित्व' : 'Physical Body & Root Destiny',
      lagnaSignIndex: ascSignIdx,
      chartBadges: badges,
    };
  }, [activeChartType, chart, chalitData, isHi, lang]);

  const toggleChapter = (chNum: number) => {
    setCollapsedChapters((prev) => ({
      ...prev,
      [chNum]: !prev[chNum],
    }));
  };

  const scrollToChapter = (chNum: number) => {
    setCurrentChapter(chNum);
    const el = document.getElementById(`dossier-chapter-${chNum}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const expandAll = () => setCollapsedChapters({});
  const collapseAll = () => {
    const all: Record<number, boolean> = {};
    for (let i = 1; i <= 12; i++) all[i] = true;
    setCollapsedChapters(all);
  };

  const handlePrint = () => {
    window.print();
  };

  const topIdentity = dossier.topIdentity;

  // --------------------------------------------------------------------------
  // RENDER HELPERS: CHART & PLANETARY CARDS (Reusable on Mobile & Desktop)
  // --------------------------------------------------------------------------
  const renderChartCard = () => (
    <div className="dossier-chart-card card">
      {/* Quick Chart Toggle Pills */}
      <div className="dossier-chart-nav-pills">
        <button
          className={`chart-pill-btn ${activeChartType === 'D1' ? 'active' : ''}`}
          onClick={() => setActiveChartType('D1')}
        >
          {isHi ? 'D1 लग्न' : 'D1 Lagna'}
        </button>
        <button
          className={`chart-pill-btn ${activeChartType === 'D9' ? 'active' : ''}`}
          onClick={() => setActiveChartType('D9')}
        >
          {isHi ? 'D9 नवांश' : 'D9 Navamsha'}
        </button>
        <button
          className={`chart-pill-btn ${activeChartType === 'Chalit' ? 'active' : ''}`}
          onClick={() => setActiveChartType('Chalit')}
        >
          {isHi ? 'भाव चलित' : 'Chalit'}
        </button>
        <button
          className={`chart-pill-btn ${activeChartType === 'Moon' ? 'active' : ''}`}
          onClick={() => setActiveChartType('Moon')}
        >
          {isHi ? 'चंद्र कुंडली' : 'Moon Chart'}
        </button>
        <button
          className={`chart-pill-btn ${activeChartType === 'LalKitab' ? 'active' : ''}`}
          onClick={() => setActiveChartType('LalKitab')}
        >
          {isHi ? 'लाल किताब टेवा' : 'Lal Kitab'}
        </button>
      </div>

      {/* Interactive SVG Chart */}
      <div className="dossier-svg-wrapper">
        <VedicChartSvg
          title={chartTitle}
          subtitle={chartSubtitle}
          style={chartStyle}
          lagnaSignIndex={lagnaSignIndex}
          items={chartBadges}
          savBindus={chart.ashtakavarga?.sarva}
          showDownload={false}
        />
      </div>

      {/* Chart Style Selector */}
      {onChangeChartStyle && (
        <div className="dossier-chart-style-bar">
          <span className="text-muted small">{isHi ? 'शैली:' : 'Style:'}</span>
          <button
            className={`btn-tag ${chartStyle === 'north' ? 'active' : ''}`}
            onClick={() => onChangeChartStyle('north')}
          >
            {isHi ? 'उत्तर भारतीय' : 'North'}
          </button>
          <button
            className={`btn-tag ${chartStyle === 'south' ? 'active' : ''}`}
            onClick={() => onChangeChartStyle('south')}
          >
            {isHi ? 'दक्षिण भारतीय' : 'South'}
          </button>
          <button
            className={`btn-tag ${chartStyle === 'east' ? 'active' : ''}`}
            onClick={() => onChangeChartStyle('east')}
          >
            {isHi ? 'पूर्वी भारतीय' : 'East'}
          </button>
        </div>
      )}
    </div>
  );

  const renderPlanetsCard = () => (
    <div className="dossier-planets-card card">
      <div className="card-header-compact">
        <h3 className="section-title-sm">
          <Activity size={14} className="accent-icon" />{' '}
          {isHi ? 'ग्रह स्थिति सारणी (अंश, नक्षत्र, पद व कारक)' : 'Planetary Matrix (Degrees, Nakshatra & Karakas)'}
        </h3>
      </div>

      {/* Mobile Touch Cards Deck (Visible on small screens) */}
      <div className="mobile-planet-cards-deck">
        <div className="mobile-planet-card ascendant-card">
          <div className="mp-card-top">
            <span className="planet-tag ascendant-tag">{isHi ? 'लग्न (Lagna / Ascendant)' : 'Ascendant (Lagna)'}</span>
            <span className="mono font-bold">{isHi ? 'प्रथम भाव' : '1st House'}</span>
          </div>
          <div className="mp-card-grid">
            <div><span className="text-muted small">{isHi ? 'राशि:' : 'Sign:'}</span> <strong>{isHi ? trSign(chart.ascendant.signIndex, lang) : chart.ascendant.signName}</strong></div>
            <div><span className="text-muted small">{isHi ? 'अंश:' : 'Deg:'}</span> <span className="mono">{chart.ascendant.shortDms}</span></div>
            <div><span className="text-muted small">{isHi ? 'नक्षत्र:' : 'Star:'}</span> {chart.ascendant.nakshatraName} ({chart.ascendant.pada})</div>
            <div><span className="text-muted small">{isHi ? 'स्वामी:' : 'Lords:'}</span> <span className="mono small">{trPlanetShort(chart.ascendant.signLord, lang)}/{trPlanetShort(chart.ascendant.nakshatraLord, lang)}/{trPlanetShort(chart.ascendant.subLord, lang)}</span></div>
          </div>
        </div>

        {chart.planets.map((p) => {
          const isSelected = selectedPlanetId === p.id;
          return (
            <div
              key={p.id}
              className={`mobile-planet-card ${isSelected ? 'row-selected' : ''}`}
              onClick={() => setSelectedPlanetId(isSelected ? null : p.id)}
            >
              <div className="mp-card-top">
                <span className={`planet-tag ${p.id.toLowerCase()}-tag`}>
                  {trPlanet(p.id, lang)}
                  {p.isRetrograde && p.id !== 'Rahu' && p.id !== 'Ketu' ? (isHi ? ' (व)' : ' (R)') : ''}
                  {p.isCombust ? '*' : ''}
                </span>
                <span className={`dignity-badge ${
                  p.dignity === 'Exalted'
                    ? 'badge-good'
                    : p.dignity === 'Debilitated'
                    ? 'badge-bad'
                    : p.dignity === 'Own Sign' || p.dignity === 'Moolatrikona'
                    ? 'badge-blue'
                    : 'badge-neutral'
                }`}>
                  {p.dignity || '—'}
                </span>
              </div>
              <div className="mp-card-grid">
                <div><span className="text-muted small">{isHi ? 'भाव:' : 'House:'}</span> <strong className="mono font-bold">भाव {p.rasiHouseNumber}</strong></div>
                <div><span className="text-muted small">{isHi ? 'राशि:' : 'Sign:'}</span> {isHi ? trSign(p.signIndex, lang) : p.signName}</div>
                <div><span className="text-muted small">{isHi ? 'अंश:' : 'Deg:'}</span> <span className="mono">{p.shortDms}</span></div>
                <div><span className="text-muted small">{isHi ? 'नक्षत्र:' : 'Star:'}</span> {p.nakshatraName} ({p.pada})</div>
                {p.charaKaraka && (
                  <div><span className="text-muted small">{isHi ? 'कारक:' : 'Karaka:'}</span> <span className="badge badge-subtle">{p.charaKaraka}</span></div>
                )}
                <div><span className="text-muted small">{isHi ? 'रा/न/उप:' : 'S/N/Sub:'}</span> <span className="mono small">{trPlanetShort(p.signLord, lang)}/{trPlanetShort(p.nakshatraLord, lang)}/{trPlanetShort(p.subLord, lang)}</span></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Traditional Table for Desktop */}
      <div className="table-responsive desktop-only-table">
        <table className="table table-sm dossier-table">
          <thead>
            <tr>
              <th>{isHi ? 'ग्रह' : 'Body'}</th>
              <th>{isHi ? 'राशि' : 'Sign'}</th>
              <th>{isHi ? 'अंश' : 'Degree'}</th>
              <th>{isHi ? 'नक्षत्र (पद)' : 'Nakshatra (Pada)'}</th>
              <th>{isHi ? 'रा/न/उप' : 'S/N/Sub'}</th>
              <th>{isHi ? 'भाव' : 'H'}</th>
              <th>{isHi ? 'कारक' : 'Karaka'}</th>
              <th>{isHi ? 'अवस्था' : 'Dignity'}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="ascendant-row">
              <td>
                <span className="planet-tag ascendant-tag">{isHi ? 'लग्न' : 'Asc'}</span>
              </td>
              <td>{isHi ? trSign(chart.ascendant.signIndex, lang) : chart.ascendant.signName}</td>
              <td className="mono small">{chart.ascendant.shortDms}</td>
              <td className="small">
                {chart.ascendant.nakshatraName} ({chart.ascendant.pada})
              </td>
              <td className="mono small">
                {trPlanetShort(chart.ascendant.signLord, lang)}/{trPlanetShort(chart.ascendant.nakshatraLord, lang)}/{trPlanetShort(chart.ascendant.subLord, lang)}
              </td>
              <td className="mono font-bold">1</td>
              <td>—</td>
              <td>—</td>
            </tr>

            {chart.planets.map((p) => {
              const isSelected = selectedPlanetId === p.id;
              return (
                <tr
                  key={p.id}
                  className={`planet-row ${isSelected ? 'row-selected' : ''}`}
                  onClick={() => setSelectedPlanetId(isSelected ? null : p.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <span className={`planet-tag ${p.id.toLowerCase()}-tag`}>
                      {trPlanet(p.id, lang)}
                      {p.isRetrograde && p.id !== 'Rahu' && p.id !== 'Ketu' ? (isHi ? ' (व)' : ' (R)') : ''}
                      {p.isCombust ? '*' : ''}
                    </span>
                  </td>
                  <td>{isHi ? trSign(p.signIndex, lang) : p.signName}</td>
                  <td className="mono small">{p.shortDms}</td>
                  <td className="small">
                    {p.nakshatraName} ({p.pada})
                  </td>
                  <td className="mono small">
                    {trPlanetShort(p.signLord, lang)}/{trPlanetShort(p.nakshatraLord, lang)}/{trPlanetShort(p.subLord, lang)}
                  </td>
                  <td className="mono font-bold">{p.rasiHouseNumber}</td>
                  <td>
                    {p.charaKaraka ? (
                      <span className="badge badge-subtle">{p.charaKaraka}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    <span
                      className={`dignity-badge ${
                        p.dignity === 'Exalted'
                          ? 'badge-good'
                          : p.dignity === 'Debilitated'
                          ? 'badge-bad'
                          : p.dignity === 'Own Sign' || p.dignity === 'Moolatrikona'
                          ? 'badge-blue'
                          : 'badge-neutral'
                      }`}
                    >
                      {p.dignity || '—'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="table-legend-footer">
        <span className="small text-muted">
          *(C): अस्त (Combust) · (R): वक्री (Retrograde) · S/N/Sub: राशि-नक्षत्र-उप स्वामी
        </span>
      </div>
    </div>
  );

  return (
    <div className="dossier-studio-container">
      {/* Top Banner & Quick Controls */}
      <header className="dossier-hero-header">
        <div className="dossier-hero-left">
          <div className="dossier-badge-pill">
            <Sparkles size={14} className="accent-icon" />
            <span>{isHi ? 'AV Astro Vibe 12-अध्याय सम्पूर्ण जीवन डोजियर' : 'AV Astro Vibe 12-Chapter Master Life Dossier'}</span>
          </div>
          <h1 className="dossier-hero-title">
            {dossier.nativeName} — {isHi ? 'सम्पूर्ण जन्म कुंडली व 12-भाव यथार्थ फलादेश' : 'Complete Natal Chart & 12-Bhava Unvarnished Revelations'}
          </h1>
          <p className="dossier-hero-subtitle">
            <Calendar size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
            {dossier.birthDateFormatted} ·{' '}
            <Clock size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
            {dossier.birthTimeFormatted} ·{' '}
            <MapPin size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
            {dossier.birthCity} ·{' '}
            <strong>{isHi ? 'लग्न:' : 'Asc:'}</strong> {dossier.ascendantSignHi} ({dossier.ascendantSignEn}) ·{' '}
            <strong>{isHi ? 'राशि:' : 'Moon:'}</strong> {dossier.moonSignHi} ({dossier.moonSignEn}) ·{' '}
            <strong>{isHi ? 'सूर्य:' : 'Sun:'}</strong> {dossier.sunSignHi}
          </p>
        </div>

        <div className="dossier-hero-actions">
          {onOpenEditor && (
            <button className="btn btn-secondary btn-sm" onClick={onOpenEditor} title={isHi ? 'जन्म विवरण बदलें' : 'Edit Birth Details'}>
              <Edit3 size={13} />
              <span>{isHi ? 'विवरण बदलें' : 'Edit Birth'}</span>
            </button>
          )}
          {onOpenMatchMaking && (
            <button className="btn btn-secondary btn-sm" onClick={onOpenMatchMaking} title={isHi ? 'कुंडली मिलान' : 'Match Making'}>
              <Heart size={13} />
              <span>{isHi ? 'कुंडली मिलान' : 'Match Making'}</span>
            </button>
          )}
          {onOpenBooklet && (
            <button className="btn btn-secondary btn-sm" onClick={onOpenBooklet} title={isHi ? 'जन्म पत्रिका (Birth Report) PDF' : 'Birth Report (Patrika) PDF'}>
              <Printer size={13} />
              <span>{isHi ? 'जन्म पत्रिका (Birth Report)' : 'Birth Report (PDF)'}</span>
            </button>
          )}
          <button className="btn btn-primary btn-sm" onClick={handlePrint} title={isHi ? 'प्रिंट / PDF' : 'Print / Export'}>
            <Printer size={14} />
            <span>{isHi ? 'प्रिंट / PDF' : 'Print Dossier'}</span>
          </button>
        </div>
      </header>

      {/* Mobile App Navigation Bar (< 992px) */}
      <div className="dossier-mobile-tabs-bar">
        <button
          className={`dossier-m-tab-btn ${mobileTab === 'dossier' ? 'active' : ''}`}
          onClick={() => setMobileTab('dossier')}
        >
          <BookOpen size={14} />
          <span>{isHi ? 'जीवन आलेख' : 'Dossier'}</span>
        </button>
        <button
          className={`dossier-m-tab-btn ${mobileTab === 'charts' ? 'active' : ''}`}
          onClick={() => setMobileTab('charts')}
        >
          <Compass size={14} />
          <span>{isHi ? 'जन्म चक्र' : 'Charts'}</span>
        </button>
        <button
          className={`dossier-m-tab-btn ${mobileTab === 'planets' ? 'active' : ''}`}
          onClick={() => setMobileTab('planets')}
        >
          <Layers size={14} />
          <span>{isHi ? 'ग्रह स्थिति' : 'Planets'}</span>
        </button>
      </div>

      {/* Main Two-Column Split Layout */}
      <div className="dossier-split-layout">
        {/* =========================================================================
            LEFT COLUMN (36-38%): STICKY INTERACTIVE KUNDALI & PLANETARY TABLE
           ========================================================================= */}
        <aside
          className={`dossier-left-pane ${
            mobileTab === 'dossier' ? 'mobile-hidden' : ''
          }`}
        >
          {/* On mobile: show chart card if mobileTab === 'charts' */}
          {mobileTab === 'charts' && renderChartCard()}

          {/* On mobile: show planets card if mobileTab === 'planets' */}
          {mobileTab === 'planets' && renderPlanetsCard()}

          {/* On desktop: show both side-by-side */}
          <div className="desktop-only-left-content">
            {renderChartCard()}
            {renderPlanetsCard()}
          </div>
        </aside>

        {/* =========================================================================
            RIGHT COLUMN (62-64%): 12-CHAPTER MASTER LIFE DOSSIER
           ========================================================================= */}
        <main
          className={`dossier-right-pane ${
            mobileTab !== 'dossier' ? 'mobile-hidden' : ''
          }`}
        >
          <div className="card" style={{ padding: '10px 14px', marginBottom: '12px', fontSize: '12.5px', lineHeight: 1.5 }}>
            <strong>{isHi ? 'रिपोर्ट को कैसे पढ़ें: ' : 'How to read this report: '}</strong>
            {isHi
              ? 'हर अध्याय एक जीवन क्षेत्र के पारंपरिक ज्योतिषीय संकेत बताता है। अनुकूल, मिले-जुले या चुनौतीपूर्ण संकेत किसी घटना की गारंटी, प्रतिशत संभावना या निश्चित भविष्यवाणी नहीं हैं। स्वास्थ्य, कानूनी, वित्तीय और जीवन-मृत्यु से जुड़े निर्णय योग्य विशेषज्ञ की सलाह से ही लें।'
              : 'Each chapter describes traditional astrological indications for one area of life. Supportive, mixed or challenging signs are not guarantees, probability percentages or certain predictions. For medical, legal, financial and life-or-death matters, rely on qualified professional advice.'}
          </div>
          {/* Sticky Chapter Navigation Bar */}
          <nav className="dossier-chapter-nav-sticky">
            <div className="dossier-nav-scrollable">
              {dossier.chapters.map((ch) => {
                const CHIP_TITLES: Record<number, { hi: string; en: string }> = {
                  1: { hi: 'तनु', en: 'Tanu' },
                  2: { hi: 'धन', en: 'Dhana' },
                  3: { hi: 'सहज', en: 'Sahaja' },
                  4: { hi: 'सुख', en: 'Sukha' },
                  5: { hi: 'सुत/विद्या', en: 'Suta' },
                  6: { hi: 'रिपु/रोग', en: 'Ripu' },
                  7: { hi: 'कलत्र/विवाह', en: 'Kalatra' },
                  8: { hi: 'रंध्र/आयु', en: 'Randhra' },
                  9: { hi: 'भाग्य/धर्म', en: 'Bhagya' },
                  10: { hi: 'कर्म/राज्य', en: 'Karma' },
                  11: { hi: 'लाभ', en: 'Labha' },
                  12: { hi: 'व्यय/मोक्ष', en: 'Vyaya' },
                };
                const chipLabel = isHi ? CHIP_TITLES[ch.chapterNumber]?.hi : CHIP_TITLES[ch.chapterNumber]?.en;
                return (
                  <button
                    key={ch.chapterNumber}
                    className={`chapter-nav-chip ${currentChapter === ch.chapterNumber ? 'active' : ''}`}
                    onClick={() => scrollToChapter(ch.chapterNumber)}
                  >
                    <span className="chip-num">{ch.chapterNumber}</span>
                    <span className="chip-label">{chipLabel}</span>
                  </button>
                );
              })}
            </div>
            <div className="dossier-nav-controls">
              <button className="btn-icon-sm" onClick={expandAll} title={isHi ? 'सभी अध्याय खोलें' : 'Expand All'}>
                <ChevronDown size={14} />
              </button>
              <button className="btn-icon-sm" onClick={collapseAll} title={isHi ? 'सभी अध्याय समेटें' : 'Collapse All'}>
                <ChevronUp size={14} />
              </button>
            </div>
          </nav>

          {/* Chapter Stream */}
          <div className="dossier-chapters-wrapper">
            {dossier.chapters.map((chapter) => {
              const isCollapsed = collapsedChapters[chapter.chapterNumber] ?? false;
              const bp = chapter.bhavaProfile;
              const tr = chapter.targetedRemedy;

              return (
                <section
                  key={chapter.chapterNumber}
                  id={`dossier-chapter-${chapter.chapterNumber}`}
                  className={`dossier-chapter-card card ${chapter.chapterNumber === 1 ? 'is-first-chapter' : ''}`}
                >
                  {/* Chapter Header */}
                  <div
                    className="chapter-card-header"
                    onClick={() => toggleChapter(chapter.chapterNumber)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="chapter-title-group">
                      <span className="chapter-index-pill">
                        {isHi ? `अध्याय ${chapter.chapterNumber}` : `Chapter ${chapter.chapterNumber}`}
                      </span>
                      <h2 className="chapter-main-title">
                        {isHi ? chapter.titleHi : chapter.titleEn}
                      </h2>
                      <p className="chapter-main-subtitle">
                        {isHi ? chapter.subtitleHi : chapter.subtitleEn}
                      </p>
                    </div>
                    <div className="chapter-header-action">
                      {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                    </div>
                  </div>

                  {/* Summary Poetic Quote */}
                  {!isCollapsed && (
                    <blockquote className="chapter-summary-quote">
                      "{isHi ? chapter.summaryQuoteHi : chapter.summaryQuoteEn}"
                    </blockquote>
                  )}

                  {/* =================================================================
                      BHAVA PROFILE CARD: HOUSE ATTRIBUTES & UNVARNISHED VERDICT
                     ================================================================= */}
                  {!isCollapsed && bp && (
                    <div className="dossier-bhava-profile-card">
                      <div className="bhava-profile-header">
                        <div className="bhava-profile-title-group">
                          <span className="bhava-number-badge">{bp.houseNumber}</span>
                          <span className="bhava-name-text">{isHi ? bp.bhavaNameHi : bp.bhavaNameEn}</span>
                        </div>
                        <span className={`tag ${bp.verdictTone === 'favorable' ? 'tag-good' : bp.verdictTone === 'mixed' ? 'tag-subtle' : 'tag-warn'}`}>
                          {isHi
                            ? (bp.verdictTone === 'favorable' ? 'अनुकूल संकेत' : bp.verdictTone === 'mixed' ? 'मिले-जुले संकेत' : bp.verdictTone === 'challenging' ? 'अधिक प्रयास अपेक्षित' : 'विशेष सावधानी')
                            : (bp.verdictTone === 'favorable' ? 'Supportive signs' : bp.verdictTone === 'mixed' ? 'Mixed signs' : bp.verdictTone === 'challenging' ? 'More effort needed' : 'Extra caution')}
                        </span>
                      </div>

                      <div className={`bhava-unvarnished-verdict tone-${bp.verdictTone}`}>
                        <strong>{isHi ? 'सरल अर्थ: ' : 'In everyday language: '}</strong>
                        {bp.verdictTone === 'favorable'
                          ? (isHi ? 'इस जीवन क्षेत्र में सहयोगी संकेत अधिक हैं। अवसरों का लाभ लेने के लिए योजना और निरंतर प्रयास जरूरी रहेंगे।' : 'This area has more supportive indications. Planning and consistent effort are still needed to make the most of opportunities.')
                          : bp.verdictTone === 'mixed'
                            ? (isHi ? 'इस क्षेत्र में अच्छे और चुनौतीपूर्ण दोनों संकेत हैं। परिणाम परिस्थिति और आपके निर्णयों के अनुसार बदल सकते हैं।' : 'Both supportive and challenging indications appear here. Outcomes can vary with circumstances and decisions.')
                            : bp.verdictTone === 'challenging'
                              ? (isHi ? 'इस क्षेत्र में अपेक्षाकृत अधिक मेहनत, धैर्य और व्यावहारिक तैयारी की जरूरत हो सकती है। इसे निश्चित असफलता न मानें।' : 'This area may require extra effort, patience and practical preparation. It does not mean certain failure.')
                              : (isHi ? 'इस क्षेत्र में जल्दबाजी से बचें और जरूरी मामलों में विशेषज्ञ की सलाह लें। ज्योतिषीय संकेत को निश्चित घटना न समझें।' : 'Avoid rushing in this area and seek qualified advice where needed. An astrological indication is not a certain event.')}
                      </div>
                      <details className="dossier-technical-details" style={{ marginTop: '10px' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>
                          {isHi ? 'विस्तृत फलादेश और ज्योतिषीय आधार देखें' : 'View detailed reading and astrological basis'}
                        </summary>
                        <div className="bhava-meta-strip">
                          <span className="bhava-meta-item">{isHi ? 'राशि:' : 'Sign:'} <strong>{isHi ? bp.signNameHi : bp.signNameEn}</strong></span>
                          <span className="bhava-meta-item">
                            {isHi ? 'भावेश:' : 'House lord:'} <strong>{isHi ? bp.lordNameHi : bp.lordNameEn}</strong>
                            {' '}({isHi ? 'भाव' : 'house'} {bp.lordPlacedHouse}, {bp.lordDignity}
                            {bp.isLordRetrograde ? (isHi ? ', वक्री' : ', retrograde') : ''}
                            {bp.isLordCombust ? (isHi ? ', अस्त' : ', combust') : ''})
                          </span>
                          <span className="bhava-meta-item">{isHi ? 'अष्टकवर्ग बिंदु:' : 'Ashtakavarga bindus:'} <strong>{bp.savBindus}</strong></span>
                          <span className="bhava-meta-item">
                            {isHi ? 'स्थित ग्रह:' : 'Occupants:'} <strong>{(isHi ? bp.occupantsHi : bp.occupantsEn).length > 0 ? (isHi ? bp.occupantsHi : bp.occupantsEn).join(', ') : (isHi ? 'कोई ग्रह नहीं' : 'None')}</strong>
                          </span>
                        </div>
                        <p style={{ margin: '8px 0 0', fontSize: '13px', lineHeight: 1.55 }}>
                          {isHi ? bp.verdictSummaryHi : bp.verdictSummaryEn}
                        </p>
                      </details>
                    </div>
                  )}

                  {/* =================================================================
                      CHAPTER 1 EXCLUSIVE: TOP SACRED SPIRITUAL IDENTITY CARD
                     ================================================================= */}
                  {!isCollapsed && chapter.chapterNumber === 1 && (
                    <div className="chapter-top-identity-block">
                      <div className="identity-triad-grid">
                        {/* 1. Ishta Devata */}
                        <div className="identity-card ishta-card">
                          <div className="identity-card-header">
                            <Sparkles size={18} className="identity-icon" />
                            <span className="identity-card-label">
                              {isHi ? 'मुख्य इष्ट देवता (12th from AK)' : 'Ishta Devata (12th from AK)'}
                            </span>
                          </div>
                          <div className="identity-main-val">
                            {isHi ? topIdentity.ishtaDevata.deityHi : topIdentity.ishtaDevata.deityEn}
                          </div>
                          <div className="identity-mantra-box">
                            <span className="small text-muted">{isHi ? 'नित्य जप मंत्र:' : 'Sacred Mantra:'}</span>
                            <div className="mono identity-mantra">{topIdentity.ishtaDevata.mantra}</div>
                          </div>
                          <div className="identity-sub-note small">
                            <Calendar size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                            {isHi ? 'उपासना वार:' : 'Day:'} {isHi ? topIdentity.ishtaDevata.worshipDayHi : topIdentity.ishtaDevata.worshipDayEn}
                          </div>
                        </div>

                        {/* 2. Naamakshar */}
                        <div className="identity-card naamakshar-card">
                          <div className="identity-card-header">
                            <Bookmark size={18} className="identity-icon" />
                            <span className="identity-card-label">
                              {isHi ? 'जन्म नामाक्षर (Moon Nakshatra & Pada)' : 'Birth Syllable (Naamakshar)'}
                            </span>
                          </div>
                          <div className="identity-syllable-display">
                            <span className="large-glyph">{topIdentity.naamakshar.syllableHi}</span>
                            <span className="large-glyph-en">({topIdentity.naamakshar.syllableEn})</span>
                          </div>
                          <div className="identity-sub-note">
                            <Sparkles size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                            {topIdentity.naamakshar.nakshatraName} ({isHi ? 'चरण' : 'Pada'} {topIdentity.naamakshar.pada})
                          </div>
                          <div className="identity-padas-strip small text-muted">
                            {isHi ? 'चारों चरण:' : 'All Padas:'}{' '}
                            <strong>{isHi ? topIdentity.naamakshar.allPadasHi.join(' · ') : topIdentity.naamakshar.allPadasEn.join(' · ')}</strong>
                          </div>
                        </div>

                        {/* 3. Paya */}
                        <div className={`identity-card paya-card paya-${topIdentity.paya.metal.toLowerCase()}`}>
                          <div className="identity-card-header">
                            <Award size={18} className="identity-icon" />
                            <span className="identity-card-label">
                              {isHi ? 'जन्म पाया (Paya - चंद्र भाव आधार)' : 'Birth Paya (Moon Foot)'}
                            </span>
                          </div>
                          <div className="identity-main-val">
                            {isHi ? topIdentity.paya.nameHi : topIdentity.paya.nameEn}
                          </div>
                          <div className="identity-sub-note small">
                            {isHi ? topIdentity.paya.meaningHi : topIdentity.paya.meaningEn}
                          </div>
                          <div className="identity-paya-rule small text-muted">
                            <Shield size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                            {isHi ? `लग्न से भाव: ${topIdentity.paya.moonHouseFromLagna}` : `House from Lagna: ${topIdentity.paya.moonHouseFromLagna}`}
                          </div>
                        </div>
                      </div>

                      {/* Avakahada Quick Grid */}
                      <div className="avakahada-spec-grid">
                        <div className="spec-item">
                          <span className="spec-label">{isHi ? 'वर्ण' : 'Varna'}</span>
                          <span className="spec-val">{chapter.specialData?.avakahada?.varna}</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">{isHi ? 'वश्य' : 'Vashya'}</span>
                          <span className="spec-val">{chapter.specialData?.avakahada?.vashya}</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">{isHi ? 'योनि' : 'Yoni'}</span>
                          <span className="spec-val">{chapter.specialData?.avakahada?.yoni}</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">{isHi ? 'गण' : 'Gana'}</span>
                          <span className="spec-val">{chapter.specialData?.avakahada?.gana}</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">{isHi ? 'नाड़ी' : 'Nadi'}</span>
                          <span className="spec-val">{chapter.specialData?.avakahada?.nadi}</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">{isHi ? 'तत्व' : 'Element'}</span>
                          <span className="spec-val">{isHi ? chapter.specialData?.avakahada?.tatvaHi : chapter.specialData?.avakahada?.tatvaEn}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CHAPTER 6 EXCLUSIVE: ADDICTIONS & LEGAL HAZARDS SENTINEL */}
                  {!isCollapsed && chapter.chapterNumber === 6 && chapter.specialData?.addictionsAndVices && (
                    <div className="dossier-vulnerabilities-box">
                      <div className="vulnerability-strip-grid">
                        <div className="vuln-item">
                          <span className="vuln-label">{isHi ? 'रासायनिक नशा/व्यसन संवेदनशीलता:' : 'Substance Risk:'}</span>
                          <span className="badge badge-neutral font-bold">{chapter.specialData.addictionsAndVices.substanceRiskHi.split('(')[0].trim()}</span>
                        </div>
                        <div className="vuln-item">
                          <span className="vuln-label">{isHi ? 'बंधन योग (कारावास/दंड):' : 'Bandhana Yoga:'}</span>
                          <span className="badge badge-subtle font-bold">{chapter.specialData.litigationAndAffairs.bandhanaYogaHi.split('(')[0].trim()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CHAPTER 8 EXCLUSIVE: LONGEVITY CATEGORY BADGE */}
                  {!isCollapsed && chapter.chapterNumber === 8 && chapter.specialData?.longevity && (
                    <div className="dossier-vulnerabilities-box" style={{ background: 'var(--bg-elevated)' }}>
                      <div className="vulnerability-strip-grid">
                        <div className="vuln-item">
                          <Hourglass size={16} className="text-accent" />
                          <span className="vuln-label">{isHi ? 'पाराशरी आयु वर्ग:' : 'Longevity Category:'}</span>
                          <span className="badge badge-good font-bold">{isHi ? chapter.specialData.longevity.categoryHi : chapter.specialData.longevity.categoryEn}</span>
                        </div>
                        <div className="vuln-item">
                          <ShieldCheck size={16} className="text-accent" />
                          <span className="vuln-label">{isHi ? 'आयुर्दाय मर्यादा:' : 'Estimated Lifespan:'}</span>
                          <span className="mono font-bold">{chapter.specialData.longevity.estimatedYears} {isHi ? 'वर्ष' : 'Years'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CHAPTER 9 EXCLUSIVE: WORLD CIVILIZATIONS ODYSSEY */}
                  {!isCollapsed && chapter.chapterNumber === 9 && chapter.specialData?.pastLife && (
                    <div className="dossier-global-odyssey-box">
                      <div className="odyssey-grid">
                        <div className="odyssey-card past-odyssey">
                          <div className="odyssey-header">
                            <Globe size={18} className="text-accent" />
                            <span className="odyssey-title">{isHi ? 'पूर्व जन्म की विश्व सभ्यता व भूगोल' : 'Past Life World Civilization'}</span>
                          </div>
                          <div className="odyssey-val font-bold">
                            {isHi ? chapter.specialData.pastLife.civilizationHi : chapter.specialData.pastLife.civilizationEn}
                          </div>
                          <div className="small text-muted">
                            <MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                            {isHi ? chapter.specialData.pastLife.birthPlaceOrCountryHi : chapter.specialData.pastLife.birthPlaceOrCountryEn}
                          </div>
                          <div className="odyssey-sub small">
                            <Hourglass size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                            {isHi ? chapter.specialData.pastLife.historicalEraHi : chapter.specialData.pastLife.historicalEraEn}
                          </div>
                        </div>

                        <div className="odyssey-card future-odyssey">
                          <div className="odyssey-header">
                            <Sparkles size={18} className="text-accent" />
                            <span className="odyssey-title">{isHi ? 'भावी पुनर्जन्म का महाद्वीप व स्वरूप' : 'Future Rebirth Continent & Station'}</span>
                          </div>
                          <div className="odyssey-val font-bold">
                            {isHi ? chapter.specialData.futureBecoming.futureContinentHi : chapter.specialData.futureBecoming.futureContinentEn}
                          </div>
                          <div className="small text-muted">
                            <Globe size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                            {isHi ? chapter.specialData.futureBecoming.futureCountryHi : chapter.specialData.futureBecoming.futureCountryEn}
                          </div>
                          <div className="odyssey-sub small">
                            <Sparkles size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                            {isHi ? chapter.specialData.futureBecoming.futureYoniHi : chapter.specialData.futureBecoming.futureYoniEn}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CHAPTER 10 EXCLUSIVE: CAREER VERDICTS & GOVT JOB METER */}
                  {!isCollapsed && chapter.chapterNumber === 10 && chapter.specialData?.careerVerdicts && (
                    <div className="dossier-career-verdicts-box">
                      <div className="career-verdicts-grid">
                        <div className="verdict-metric-card govt-job-metric">
                          <div className="metric-header">
                            <Award size={18} className="text-accent" />
                            <span className="metric-title">{isHi ? 'सरकारी नौकरी संभावना' : 'Govt Job Probability'}</span>
                          </div>
                          <div className="metric-value-row">
                            <span className="metric-large-pct">{chapter.specialData.careerVerdicts.govtJobLikelihoodPct}%</span>
                            <span className={`badge ${chapter.specialData.careerVerdicts.govtJobLikelihoodPct >= 75 ? 'badge-good' : chapter.specialData.careerVerdicts.govtJobLikelihoodPct >= 50 ? 'badge-blue' : 'badge-neutral'}`}>
                              {chapter.specialData.careerVerdicts.govtJobLikelihoodPct >= 75 ? (isHi ? 'प्रचंड राजयोग' : 'High Rajayoga') : chapter.specialData.careerVerdicts.govtJobLikelihoodPct >= 50 ? (isHi ? 'मध्यम योग' : 'Moderate') : (isHi ? 'निजी क्षेत्र' : 'Private Domain')}
                            </span>
                          </div>
                          <p className="metric-desc small">
                            {isHi ? (chapter.specialData.careerVerdicts.govtJobVerdictHi.split(':')[1]?.trim() || chapter.specialData.careerVerdicts.govtJobVerdictHi) : (chapter.specialData.careerVerdicts.govtJobVerdictEn.split(':')[1]?.trim() || chapter.specialData.careerVerdicts.govtJobVerdictEn)}
                          </p>
                          <div className="target-wings-strip">
                            <span className="small text-muted">{isHi ? 'लक्षित विभाग:' : 'Target Wings:'}</span>
                            <div className="chips-wrap">
                              {(isHi ? chapter.specialData.careerVerdicts.targetWingsHi : chapter.specialData.careerVerdicts.targetWingsEn).map((w: string, i: number) => (
                                <span key={i} className="chip-tag small">{w.split('(')[0].trim()}</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="verdict-metric-card job-vs-biz-metric">
                          <div className="metric-header">
                            <Briefcase size={18} className="text-accent" />
                            <span className="metric-title">{isHi ? 'नौकरी बनाम स्वतंत्र व्यवसाय' : 'Job vs Business Split'}</span>
                          </div>
                          <div className="metric-value-row">
                            <span className="metric-large-pct">{chapter.specialData.careerVerdicts.jobVsBusinessRatio.businessPct}% {isHi ? 'व्यापार' : 'Biz'}</span>
                            <span className="text-muted">/</span>
                            <span className="metric-sub-pct">{chapter.specialData.careerVerdicts.jobVsBusinessRatio.jobPct}% {isHi ? 'नौकरी' : 'Job'}</span>
                          </div>
                          <p className="metric-desc small">
                            {isHi ? chapter.specialData.careerVerdicts.jobVsBusinessRatio.verdictHi : chapter.specialData.careerVerdicts.jobVsBusinessRatio.verdictEn}
                          </p>
                          <div className="exam-window-note small">
                            <Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                            {isHi ? 'परीक्षा स्वर्णिम काल:' : 'Peak Crack Window:'} <strong>{isHi ? chapter.specialData.careerVerdicts.examCrackingAgeWindowHi : chapter.specialData.careerVerdicts.examCrackingAgeWindowEn}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Chapter Content Sections */}
                  {!isCollapsed && (
                    <div className="chapter-body-content">
                      {chapter.sections.map((section, sIdx) => (
                        <div key={sIdx} className="chapter-section-card">
                          <h3 className="section-sub-heading">
                            {isHi ? section.titleHi : section.titleEn}
                          </h3>

                          {section.leadHi && (
                            <p className="section-lead-text">
                              {isHi ? section.leadHi : section.leadEn}
                            </p>
                          )}

                          <div className="section-paragraphs-flow">
                            {(isHi ? section.paragraphsHi : section.paragraphsEn).map((para, pIdx) => (
                              <p key={pIdx} className="dossier-paragraph">
                                {para}
                              </p>
                            ))}
                          </div>

                          {/* Classical Astrological Cause Highlight Box */}
                          {(section.astrologicalCauseHi || section.astrologicalCauseEn) && (
                            <div className="astrological-cause-callout">
                              <div className="cause-header">
                                <Flame size={14} className="cause-icon" />
                                <span className="cause-title">
                                  {isHi ? 'शास्त्रीय ज्योतिषीय कारण एवं प्रमाण' : 'Classical Astrological Cause & Shastric Rationale'}
                                </span>
                              </div>
                              <p className="cause-text">
                                {isHi ? section.astrologicalCauseHi : section.astrologicalCauseEn}
                              </p>
                            </div>
                          )}

                          {/* Key Points if available */}
                          {section.keyPointsHi && section.keyPointsHi.length > 0 && (
                            <ul className="section-keypoints-list">
                              {(isHi ? section.keyPointsHi : section.keyPointsEn ?? []).map((kp, kIdx) => (
                                <li key={kIdx}>{kp}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* =================================================================
                      TARGETED REMEDY CARD: ONLY PRESCRIBED WHERE AFFLICTION EXISTS
                     ================================================================= */}
                  {!isCollapsed && tr && (
                    <div className={`dossier-targeted-remedy-card ${tr.isNeeded ? 'remedy-needed' : 'remedy-safe'}`}>
                      <div className="remedy-card-header">
                        {tr.isNeeded ? (
                          <>
                            <AlertTriangle size={16} className="text-warning" />
                            <span className="remedy-card-title">{isHi ? 'शास्त्रीय अनिष्ट शमन उपाय (Targeted Vedic Remedy)' : 'Targeted Vedic Remedy (Shanti Vidhana)'}</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck size={16} className="text-success" />
                            <span className="remedy-card-title">{isHi ? 'भाव स्थिति: सुरक्षित व निर्दोष (Protected & Auspicious House)' : 'Bhava Disposition: Safe & Auspicious (No Remedy Needed)'}</span>
                          </>
                        )}
                      </div>

                      <div className="remedy-card-reason">
                        {isHi ? tr.reasonHi : tr.reasonEn}
                      </div>

                      {tr.isNeeded ? (
                        <>
                          <div className="remedy-details-grid">
                            {tr.stotraOrMantraHi && (
                              <div className="remedy-detail-block">
                                <span className="remedy-detail-label">{isHi ? 'सिद्ध मंत्र / स्तोत्र पाठ:' : 'Sacred Mantra / Stotra:'}</span>
                                <strong className="mono">{isHi ? tr.stotraOrMantraHi : tr.stotraOrMantraEn}</strong>
                              </div>
                            )}
                            {tr.charityItemHi && (
                              <div className="remedy-detail-block">
                                <span className="remedy-detail-label">{isHi ? 'शास्त्रीय दान द्रव्य व शुभ समय:' : 'Donation Item & Auspicious Timing:'}</span>
                                <span>{isHi ? tr.charityItemHi : tr.charityItemEn} ({isHi ? tr.charityDayHi : tr.charityDayEn})</span>
                              </div>
                            )}
                          </div>
                          <p className="remedy-precaution-text">
                            <strong>{isHi ? 'सात्विक आचार-व्यवहार सावधानी: ' : 'Practical Behavioral Precaution: '}</strong>
                            {isHi ? tr.practicalPrecautionHi : tr.practicalPrecautionEn}
                          </p>
                        </>
                      ) : (
                        <p className="remedy-precaution-text">
                          <strong>{isHi ? 'वैदिक परामर्श: ' : 'Vedic Counsel: '}</strong>
                          {isHi ? tr.practicalPrecautionHi : tr.practicalPrecautionEn}
                        </p>
                      )}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </main>
      </div>

      {/* Mobile Floating Action Button to View Chart Sheet */}
      <button
        className="dossier-floating-chart-btn"
        onClick={() => setIsChartModalOpen(true)}
        title={isHi ? 'कुंडली चक्र देखें' : 'View Charts'}
      >
        <Compass size={18} />
        <span>{isHi ? 'कुंडली चक्र' : 'View Chart'}</span>
      </button>

      {/* Mobile Bottom App Navigation Bar (< 768px) */}
      <div className="dossier-mobile-bottom-bar">
        <button
          className="mbb-btn"
          onClick={() => {
            const prev = Math.max(1, currentChapter - 1);
            setCurrentChapter(prev);
            scrollToChapter(prev);
          }}
          disabled={currentChapter <= 1}
        >
          <ChevronLeft size={16} />
          <span>{isHi ? 'पिछला' : 'Prev'}</span>
        </button>
        <button
          className="mbb-btn mbb-chapter-btn"
          onClick={() => setIsChapterDrawerOpen(true)}
        >
          <BookOpen size={14} />
          <span>{isHi ? `अध्याय ${currentChapter}/12` : `Ch ${currentChapter}/12`}</span>
        </button>
        <button
          className="mbb-btn"
          onClick={() => {
            const next = Math.min(12, currentChapter + 1);
            setCurrentChapter(next);
            scrollToChapter(next);
          }}
          disabled={currentChapter >= 12}
        >
          <span>{isHi ? 'अगला' : 'Next'}</span>
          <ChevronRight size={16} />
        </button>
        <button
          className="mbb-btn mbb-chart-btn"
          onClick={() => setIsChartModalOpen(true)}
        >
          <Compass size={14} />
          <span>{isHi ? 'चक्र' : 'Chart'}</span>
        </button>
        <button
          className="mbb-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title={isHi ? 'ऊपर जाएं' : 'Scroll Top'}
        >
          <ChevronUp size={16} />
        </button>
      </div>

      {/* Mobile Bottom Sheet Modal for Chart Inspection */}
      {isChartModalOpen && (
        <div className="dossier-modal-backdrop" onClick={() => setIsChartModalOpen(false)}>
          <div className="dossier-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-sheet-header">
              <h3 className="modal-sheet-title">
                <Compass size={16} className="accent-icon" />{' '}
                {isHi ? 'जन्म कुंडली व वर्ग चक्र' : 'Natal & Divisional Charts'}
              </h3>
              <button className="btn-close-sheet" onClick={() => setIsChartModalOpen(false)}>✕</button>
            </div>
            <div className="modal-sheet-body">
              {renderChartCard()}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Chapter Picker Drawer */}
      {isChapterDrawerOpen && (
        <div className="dossier-modal-backdrop" onClick={() => setIsChapterDrawerOpen(false)}>
          <div className="dossier-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-sheet-header">
              <h3 className="modal-sheet-title">
                <BookOpen size={16} className="accent-icon" />{' '}
                {isHi ? 'अध्याय सूची (1 से 12 भाव)' : 'Select Chapter (Houses 1 to 12)'}
              </h3>
              <button className="btn-close-sheet" onClick={() => setIsChapterDrawerOpen(false)}>✕</button>
            </div>
            <div className="modal-sheet-body chapter-picker-list">
              {dossier.chapters.map((ch) => (
                <button
                  key={ch.chapterNumber}
                  className={`chapter-picker-item ${currentChapter === ch.chapterNumber ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentChapter(ch.chapterNumber);
                    scrollToChapter(ch.chapterNumber);
                    setIsChapterDrawerOpen(false);
                  }}
                >
                  <span className="cp-num">{ch.chapterNumber}</span>
                  <span className="cp-title">{isHi ? ch.titleHi : ch.titleEn}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
