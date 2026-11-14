import React, { useMemo, useState } from 'react';
import {
  Activity,
  Award,
  BookOpen,
  Bookmark,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Coins,
  Compass,
  Download,
  Eye,
  Flame,
  Globe,
  Heart,
  HelpCircle,
  Hourglass,
  Layers,
  Moon,
  Printer,
  Scale,
  Shield,
  ShieldAlert,
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

  // Generate 10-Chapter Master Life Dossier
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
    const el = document.getElementById(`dossier-chapter-${chNum}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const expandAll = () => setCollapsedChapters({});
  const collapseAll = () => {
    const all: Record<number, boolean> = {};
    for (let i = 1; i <= 10; i++) all[i] = true;
    setCollapsedChapters(all);
  };

  const handlePrint = () => {
    window.print();
  };

  const topIdentity = dossier.topIdentity;

  return (
    <div className="dossier-studio-container">
      {/* Top Banner & Quick Controls */}
      <header className="dossier-hero-header">
        <div className="dossier-hero-left">
          <div className="dossier-badge-pill">
            <Sparkles size={14} className="accent-icon" />
            <span>{isHi ? 'स्प्लिट-स्टूडियो गोपनीय जीवन आलेख' : 'Split-Studio Master Life Dossier'}</span>
          </div>
          <h1 className="dossier-hero-title">
            {dossier.nativeName} — {isHi ? 'सम्पूर्ण जन्म कुंडली व 10-अध्यायी रहस्योद्घाटन' : 'Complete Natal Chart & 10-Chapter Life Revelations'}
          </h1>
          <p className="dossier-hero-subtitle">
            📅 {dossier.birthDateFormatted} · ⏰ {dossier.birthTimeFormatted} · 📍 {dossier.birthCity} ·{' '}
            <strong>{isHi ? 'लग्न:' : 'Asc:'}</strong> {dossier.ascendantSignHi} ({dossier.ascendantSignEn}) ·{' '}
            <strong>{isHi ? 'राशि:' : 'Moon:'}</strong> {dossier.moonSignHi} ({dossier.moonSignEn}) ·{' '}
            <strong>{isHi ? 'सूर्य:' : 'Sun:'}</strong> {dossier.sunSignHi}
          </p>
        </div>

        <div className="dossier-hero-actions">
          {onOpenEditor && (
            <button className="btn btn-secondary btn-sm" onClick={onOpenEditor} title={isHi ? 'जन्म विवरण बदलें' : 'Edit Birth Details'}>
              ✏️ {isHi ? 'विवरण बदलें' : 'Edit Birth'}
            </button>
          )}
          {onOpenMatchMaking && (
            <button className="btn btn-secondary btn-sm" onClick={onOpenMatchMaking} title={isHi ? 'कुंडली मिलान' : 'Match Making'}>
              💍 {isHi ? 'कुंडली मिलान' : 'Match Making'}
            </button>
          )}
          {onOpenBooklet && (
            <button className="btn btn-secondary btn-sm" onClick={onOpenBooklet} title={isHi ? '34-अध्यायी बृहत् पत्रिका' : '34-Ch Patrika Book'}>
              📖 {isHi ? '34-अध्यायी पत्रिका' : 'Deluxe PDF'}
            </button>
          )}
          <button className="btn btn-primary btn-sm" onClick={handlePrint} title={isHi ? 'प्रिंट / PDF' : 'Print / Export'}>
            <Printer size={14} />
            <span>{isHi ? 'प्रिंट / PDF' : 'Print Dossier'}</span>
          </button>
        </div>
      </header>

      {/* Main Two-Column Split Layout */}
      <div className="dossier-split-layout">
        {/* =========================================================================
            LEFT COLUMN (36-38%): STICKY INTERACTIVE KUNDALI & 8-COLUMN TABLE
           ========================================================================= */}
        <aside className="dossier-left-pane">
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

          {/* 8-Column Planetary Matrix Table */}
          <div className="dossier-planets-card card">
            <div className="card-header-compact">
              <h3 className="section-title-sm">
                📊 {isHi ? 'ग्रह स्थिति सारणी (अंश, नक्षत्र, पद व कारक)' : 'Planetary Matrix (Degrees, Nakshatra & Karakas)'}
              </h3>
            </div>
            <div className="table-responsive">
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
                  {/* Ascendant Row */}
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

                  {/* 9 Grahas Rows */}
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
        </aside>

        {/* =========================================================================
            RIGHT COLUMN (62-64%): 10-CHAPTER MASTER LIFE DOSSIER
           ========================================================================= */}
        <main className="dossier-right-pane">
          {/* Sticky Chapter Navigation Bar */}
          <nav className="dossier-chapter-nav-sticky">
            <div className="dossier-nav-scrollable">
              {dossier.chapters.map((ch) => (
                <button
                  key={ch.chapterNumber}
                  className="chapter-nav-chip"
                  onClick={() => scrollToChapter(ch.chapterNumber)}
                >
                  <span className="chip-num">{ch.chapterNumber}</span>
                  <span className="chip-label">
                    {ch.chapterNumber === 1
                      ? isHi ? 'मूल पहचान' : 'Identity'
                      : ch.chapterNumber === 2
                      ? isHi ? 'स्वभाव' : 'Psychology'
                      : ch.chapterNumber === 3
                      ? isHi ? 'वर्तमान' : 'Now'
                      : ch.chapterNumber === 4
                      ? isHi ? 'करियर' : 'Career'
                      : ch.chapterNumber === 5
                      ? isHi ? 'धन' : 'Wealth'
                      : ch.chapterNumber === 6
                      ? isHi ? 'दांपत्य' : 'Marriage'
                      : ch.chapterNumber === 7
                      ? isHi ? 'स्वास्थ्य' : 'Health'
                      : ch.chapterNumber === 8
                      ? isHi ? 'कालचक्र' : 'Timeline'
                      : ch.chapterNumber === 9
                      ? isHi ? 'पूर्व जन्म' : 'Past Life'
                      : isHi ? 'लाल किताब' : 'Lal Kitab'}
                  </span>
                </button>
              ))}
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
                            🗓️ {isHi ? 'उपासना वार:' : 'Day:'} {isHi ? topIdentity.ishtaDevata.worshipDayHi : topIdentity.ishtaDevata.worshipDayEn}
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
                            ⭐ {topIdentity.naamakshar.nakshatraName} ({isHi ? 'चरण' : 'Pada'} {topIdentity.naamakshar.pada})
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
                            📐 {isHi ? `लग्न से भाव: ${topIdentity.paya.moonHouseFromLagna}` : `House from Lagna: ${topIdentity.paya.moonHouseFromLagna}`}
                          </div>
                        </div>
                      </div>

                      {/* Avakahada Quick Grid */}
                      <div className="avakahada-spec-grid">
                        <div className="spec-item">
                          <span className="spec-label">{isHi ? 'वर्ण' : 'Varna'}</span>
                          <span className="spec-val">{chapter.specialData?.avakahada.varna}</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">{isHi ? 'वश्य' : 'Vashya'}</span>
                          <span className="spec-val">{chapter.specialData?.avakahada.vashya}</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">{isHi ? 'योनि' : 'Yoni'}</span>
                          <span className="spec-val">{chapter.specialData?.avakahada.yoni}</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">{isHi ? 'गण' : 'Gana'}</span>
                          <span className="spec-val">{chapter.specialData?.avakahada.gana}</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">{isHi ? 'नाड़ी' : 'Nadi'}</span>
                          <span className="spec-val">{chapter.specialData?.avakahada.nadi}</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">{isHi ? 'तत्व' : 'Element'}</span>
                          <span className="spec-val">{isHi ? chapter.specialData?.avakahada.tatvaHi : chapter.specialData?.avakahada.tatvaEn}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CHAPTER 4 EXCLUSIVE: CAREER VERDICTS & GOVT JOB METER */}
                  {!isCollapsed && chapter.chapterNumber === 4 && chapter.specialData?.careerVerdicts && (
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
                            ⏳ {isHi ? 'परीक्षा स्वर्णिम काल:' : 'Peak Crack Window:'} <strong>{isHi ? chapter.specialData.careerVerdicts.examCrackingAgeWindowHi : chapter.specialData.careerVerdicts.examCrackingAgeWindowEn}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CHAPTER 6 EXCLUSIVE: 360° RELATIONAL WEB SUMMARY */}
                  {!isCollapsed && chapter.chapterNumber === 6 && chapter.specialData?.relationalMatrix && (
                    <div className="dossier-relational-matrix-box">
                      <div className="box-header-row">
                        <Users size={18} className="text-accent" />
                        <h3 className="section-title-sm">{isHi ? 'सम्पूर्ण 360° पारिवारिक व सामाजिक संबंध संक्षेप' : '360° Relational Web Quick Matrix'}</h3>
                      </div>
                      <div className="relational-cards-grid">
                        {chapter.specialData.relationalMatrix.map((item: any) => (
                          <div key={item.id} className="relational-pill-card">
                            <div className="pill-header">
                              <span className="relation-name font-bold">{isHi ? item.relationHi.split('(')[0].trim() : item.relationEn.split('(')[0].trim()}</span>
                              <span className="badge badge-subtle small">{isHi ? item.bhavatBhavamHi.split('(')[0].trim() : item.bhavatBhavamEn.split('(')[0].trim()}</span>
                            </div>
                            <div className="pill-status small">
                              <span className="status-label">{isHi ? item.bondStatusHi.split('/')[0].trim() : item.bondStatusEn.split('/')[0].trim()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CHAPTER 7 EXCLUSIVE: ADDICTIONS & LEGAL HAZARDS SENTINEL */}
                  {!isCollapsed && chapter.chapterNumber === 7 && chapter.specialData?.addictionsAndVices && (
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
                            📍 {isHi ? chapter.specialData.pastLife.birthPlaceOrCountryHi : chapter.specialData.pastLife.birthPlaceOrCountryEn}
                          </div>
                          <div className="odyssey-sub small">
                            ⏳ {isHi ? chapter.specialData.pastLife.historicalEraHi : chapter.specialData.pastLife.historicalEraEn}
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
                            🌍 {isHi ? chapter.specialData.futureBecoming.futureCountryHi : chapter.specialData.futureBecoming.futureCountryEn}
                          </div>
                          <div className="odyssey-sub small">
                            🕊️ {isHi ? chapter.specialData.futureBecoming.futureYoniHi : chapter.specialData.futureBecoming.futureYoniEn}
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
                </section>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};
