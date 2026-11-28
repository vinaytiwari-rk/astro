import React, { useEffect, useMemo, useState } from 'react';
import {
  Baby,
  Compass,
  ExternalLink,
  Gem,
  Grid3x3,
  Heart,
  Home,
  Lightbulb,
  RefreshCw,
  Rss,
  Smile,
  Sparkles,
  Star,
  TrendingUp,
  UserCheck,
  Zap,
} from 'lucide-react';
import { NAKSHATRAS } from '../astro/constants';
import { computeAvakahadaChakra } from '../astro/avakahadaChalit';
import {
  computeGemstoneAndRudraksha,
  computeRashifalReport,
  findBabyNames,
  type RashifalPeriod,
} from '../astro/rashifalBabyRudraksha';
import {
  fetchClickAstroFeed,
  CLICKASTRO_DAILY_FEED_SNAPSHOT,
  CLICKASTRO_WEEKLY_FEED_SNAPSHOT,
  type FeedSignHoroscope,
} from '../astro/externalHoroscopeFeeds';
import { evaluateParamayusStatus } from '../astro/predictions/paramayus';
import { formatDateDmy } from '../astro/time';
import type { ChartData } from '../astro/types';
import { useLanguage } from '../i18n/LanguageContext';
import { trPlanet, trSign, trTerm } from '../i18n/translations';
import { DateDmyInput } from './DateDmyInput';
import { ParamayusLockBanner } from './ParamayusLockBanner';
import { NumerologyPanel } from './predictions/NumerologyPanel';

interface AstroSageToolsViewProps {
  chart: ChartData;
  requestedMode?: { id?: string; nonce: number };
}

type ToolMode = 'rashifal' | 'baby_names' | 'gems_rudraksha';

export const AstroSageToolsView: React.FC<AstroSageToolsViewProps> = ({ chart, requestedMode }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';
  const [mode, setMode] = useState<ToolMode>('rashifal');

  useEffect(() => {
    const id = requestedMode?.id;
    if (id === 'rashifal' || id === 'baby_names' || id === 'gems_rudraksha') {
      setMode(id);
    } else if (id === 'rashifal_tomorrow') {
      setMode('rashifal');
      setRashiPeriod('tomorrow');
    } else if (id === 'rashifal_weekly') {
      setMode('rashifal');
      setRashiPeriod('weekly');
    } else if (id === 'rashifal_weekly_love') {
      setMode('rashifal');
      setRashiPeriod('weekly_love');
    } else if (id === 'rashifal_monthly') {
      setMode('rashifal');
      setRashiPeriod('monthly');
    } else if (id === 'rashifal_2027') {
      setMode('rashifal');
      setRashiPeriod('yearly');
      setRashiDate('2027-01-15');
    }
  }, [requestedMode?.nonce, requestedMode?.id]);

  // Rashifal state
  const natalMoonSign = chart.planets.find((p) => p.id === 'Moon')!.signIndex;
  const [rashiDate, setRashiDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [rashiPeriod, setRashiPeriod] = useState<RashifalPeriod>('daily');
  const [selectedRashi, setSelectedRashi] = useState<number>(natalMoonSign);
  useEffect(() => {
    setSelectedRashi(natalMoonSign);
  }, [natalMoonSign]);

  const rashifalList = useMemo(
    () => computeRashifalReport(chart, rashiDate),
    [chart, rashiDate]
  );
  const activeRashifal = rashifalList[selectedRashi] ?? rashifalList[0];

  // Live Web Feeds State
  const [rashifalSource, setRashifalSource] = useState<'engine' | 'live_feeds'>('engine');
  const [feedPeriod, setFeedPeriod] = useState<'daily' | 'weekly'>('daily');
  const [feedStatus, setFeedStatus] = useState<'online' | 'cached'>('cached');
  const [feedItems, setFeedItems] = useState<FeedSignHoroscope[]>(CLICKASTRO_DAILY_FEED_SNAPSHOT);
  const [isRefreshingFeed, setIsRefreshingFeed] = useState(false);

  useEffect(() => {
    let active = true;
    fetchClickAstroFeed(feedPeriod, false).then((res) => {
      if (active) {
        setFeedItems(res.items);
        setFeedStatus(res.status);
      }
    });
    return () => {
      active = false;
    };
  }, [feedPeriod]);

  const handleRefreshFeed = async () => {
    setIsRefreshingFeed(true);
    const res = await fetchClickAstroFeed(feedPeriod, true);
    setFeedItems(res.items);
    setFeedStatus(res.status);
    setIsRefreshingFeed(false);
  };

  const activeFeedItem = feedItems[selectedRashi] ?? feedItems[0];

  // Baby Names state
  const avakahada = useMemo(() => computeAvakahadaChakra(chart), [chart]);
  const [babyNak, setBabyNak] = useState<number | 'all'>(chart.panchang.nakshatra.index);
  const [babyGender, setBabyGender] = useState<'all' | 'boy' | 'girl'>('all');
  useEffect(() => {
    setBabyNak(chart.panchang.nakshatra.index);
  }, [chart.panchang.nakshatra.index]);

  const babyNames = useMemo(
    () => findBabyNames(babyNak, babyGender),
    [babyNak, babyGender]
  );

  // Gems & Rudraksha
  const gemReport = useMemo(() => computeGemstoneAndRudraksha(chart), [chart]);
  const paramayus = useMemo(
    () => evaluateParamayusStatus(chart, mode === 'rashifal' ? rashiDate : undefined),
    [chart, mode, rashiDate]
  );

  return (
    <div className="view-stack">
      <div className="charts-toolbar">
        <div className="subtab-bar">
          <button
            type="button"
            className={`subtab-btn branch-btn ${mode === 'rashifal' ? 'is-active' : ''}`}
            onClick={() => setMode('rashifal')}
          >
            <Star size={14} />
            <span>{isHi ? 'दैनिक / वार्षिक राशिफल' : 'Rashifal (Daily–Yearly)'}</span>
          </button>
          <button
            type="button"
            className={`subtab-btn branch-btn ${mode === 'baby_names' ? 'is-active' : ''}`}
            onClick={() => setMode('baby_names')}
          >
            <Baby size={14} />
            <span>{isHi ? 'शिशु नाम सुझाव (नक्षत्र)' : 'Baby Name Finder'}</span>
          </button>
          <button
            type="button"
            className={`subtab-btn branch-btn ${mode === 'gems_rudraksha' ? 'is-active' : ''}`}
            onClick={() => setMode('gems_rudraksha')}
          >
            <Gem size={14} />
            <span>{isHi ? 'रत्न व 1–14 मुखी रुद्राक्ष' : 'Gemstones & Rudraksha'}</span>
          </button>
        </div>
      </div>

      {paramayus.exceeded && mode !== 'baby_names' ? (
        <ParamayusLockBanner status={paramayus} />
      ) : (
        <>
      {/* 1. RASHIFAL (DAILY / WEEKLY / MONTHLY / YEARLY & CLICKASTRO FEEDS) */}
      {mode === 'rashifal' && (
        <div className="view-stack" style={{ gap: '16px' }}>
          {/* Source Selector Tab */}
          <div
            className="card"
            style={{
              padding: '12px 16px',
              background: 'var(--bg-elevated)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
              borderRadius: '10px',
              border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`btn btn-sm ${rashifalSource === 'engine' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setRashifalSource('engine')}
                style={{ fontWeight: rashifalSource === 'engine' ? 700 : 500, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Sparkles size={14} />
                <span>{isHi ? 'AV Astro Vibe वैदिक गोचर इंजन (100% सटीक)' : 'AV Astro Vibe Vedic Gochar Engine'}</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm ${rashifalSource === 'live_feeds' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setRashifalSource('live_feeds')}
                style={{ fontWeight: rashifalSource === 'live_feeds' ? 700 : 500, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Rss size={14} />
                <span>{isHi ? 'दैनिक व साप्ताहिक गोचर फलादेश (लाइव वेब फीड्स)' : 'Daily & Weekly Gochar Forecast (Live Feeds)'}</span>
              </button>
            </div>

            {rashifalSource === 'live_feeds' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    background: feedStatus === 'online' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: feedStatus === 'online' ? '#059669' : '#d97706',
                    border: `1px solid ${feedStatus === 'online' ? '#10b981' : '#f59e0b'}`,
                  }}
                >
                  {feedStatus === 'online'
                    ? (isHi ? 'लाइव स्ट्रीम सक्रिय' : 'Live Stream Active')
                    : (isHi ? 'सत्यापित कैश सक्रिय' : 'Verified Cache Active')}
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  disabled={isRefreshingFeed}
                  onClick={handleRefreshFeed}
                  style={{ fontSize: '11.5px', padding: '4px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <RefreshCw size={12} className={isRefreshingFeed ? 'spin' : ''} />
                  <span>{isRefreshingFeed ? (isHi ? 'लोड हो रहा है...' : 'Refreshing...') : (isHi ? 'रिफ्रेश' : 'Refresh')}</span>
                </button>
              </div>
            )}
          </div>

          {/* ENGINE VIEW */}
          {rashifalSource === 'engine' && (
            <section className="panel">
              <div className="panel-header">
                <h3>
                  <Star size={15} />{' '}
                  {isHi
                    ? `वैदिक गोचर राशिफल — ५ प्रमुख जीवन आयाम (${formatDateDmy(rashiDate)})`
                    : `Vedic Gochar Horoscope — 5 Thematic Domains (${formatDateDmy(rashiDate)})`}
                </h3>
                <div className="toolbar-group">
                  <DateDmyInput
                    compact
                    className="select-compact mono"
                    value={rashiDate}
                    ariaLabel={isHi ? 'राशिफल दिनांक (DD-MM-YYYY)' : 'Rashifal Date (DD-MM-YYYY)'}
                    onChange={setRashiDate}
                  />
                  <div className="subtab-bar">
                    {(
                      [
                        ['daily', isHi ? 'दैनिक' : 'Daily'],
                        ['tomorrow', isHi ? 'कल' : 'Tomorrow'],
                        ['weekly', isHi ? 'साप्ताहिक' : 'Weekly'],
                        ['weekly_love', isHi ? 'साप्ताहिक प्रेम' : 'Weekly Love'],
                        ['monthly', isHi ? 'मासिक' : 'Monthly'],
                        ['yearly', isHi ? `वार्षिक (${rashiDate.slice(0, 4)})` : `Yearly (${rashiDate.slice(0, 4)})`],
                      ] as Array<[RashifalPeriod, string]>
                    ).map(([id, lbl]) => (
                      <button
                        key={id}
                        type="button"
                        className={`subtab-btn ${rashiPeriod === id ? 'is-active' : ''}`}
                        onClick={() => setRashiPeriod(id)}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="panel-subblock">
                <div className="rashi-pill-grid">
                  {rashifalList.map((r) => (
                    <button
                      key={r.signIndex}
                      type="button"
                      className={`subtab-btn ${selectedRashi === r.signIndex ? 'is-active' : ''}`}
                      onClick={() => setSelectedRashi(r.signIndex)}
                    >
                      {trSign(r.signIndex, lang)} {r.isNatalMoon ? (isHi ? '(जन्म)' : '★') : ''}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pred-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="branch-highlights">
                  <div className="highlight-box">
                    <span className="muted small-text">{isHi ? 'चयनित चंद्र राशि' : 'Selected Moon Rashi'}</span>
                    <strong>
                      {trSign(activeRashifal.signIndex, lang)}{' '}
                      {activeRashifal.isNatalMoon ? (isHi ? '· आपकी जन्म राशि ★' : '· Your Janma Rashi ★') : ''}
                    </strong>
                    <span className="tag tag-varg">
                      {isHi ? activeRashifal.moodHi : activeRashifal.moodEn} ({activeRashifal.score}/100)
                    </span>
                  </div>
                  <div className="highlight-box">
                    <span className="muted small-text">{isHi ? 'शुभ रंग व शुभ अंक' : 'Lucky Color & Number'}</span>
                    <strong>
                      {isHi ? activeRashifal.luckyColorHi : activeRashifal.luckyColorEn} ·{' '}
                      {isHi ? 'अंक' : '#'} {activeRashifal.luckyNumber}
                    </strong>
                  </div>
                </div>

                <div className="gochar-banner is-info">
                  <strong>
                    {rashiPeriod === 'daily'
                      ? (isHi ? 'आज का राशिफल:' : "Today's Overview:")
                      : rashiPeriod === 'tomorrow'
                        ? (isHi ? 'कल का राशिफल:' : "Tomorrow's Overview:")
                        : rashiPeriod === 'weekly'
                          ? (isHi ? 'साप्ताहिक फल:' : 'Weekly Forecast:')
                          : rashiPeriod === 'weekly_love'
                            ? (isHi ? 'साप्ताहिक प्रेम व संबंध:' : 'Weekly Love & Harmony:')
                            : rashiPeriod === 'monthly'
                              ? (isHi ? 'मासिक फल:' : 'Monthly Outlook:')
                              : (isHi ? 'वार्षिक भविष्यफल:' : 'Annual Horoscope:')}
                  </strong>{' '}
                  {rashiPeriod === 'daily'
                    ? (isHi ? activeRashifal.dailyHi : activeRashifal.dailyEn)
                    : rashiPeriod === 'tomorrow'
                      ? (isHi ? activeRashifal.tomorrowHi : activeRashifal.tomorrowEn)
                      : rashiPeriod === 'weekly'
                        ? (isHi ? activeRashifal.weeklyHi : activeRashifal.weeklyEn)
                        : rashiPeriod === 'weekly_love'
                          ? (isHi ? activeRashifal.weeklyLoveHi : activeRashifal.weeklyLoveEn)
                          : rashiPeriod === 'monthly'
                            ? (isHi ? activeRashifal.monthlyHi : activeRashifal.monthlyEn)
                            : (isHi ? activeRashifal.yearlyHi : activeRashifal.yearlyEn)}
                </div>

                {/* 5 Thematic Domains Grid */}
                <div>
                  <h4 style={{ margin: '8px 0 10px', fontSize: '13.5px', color: 'var(--text)' }}>
                    {isHi ? '५ प्रमुख जीवन क्षेत्र विस्तृत विश्लेषण' : '5 Core Thematic Domains Breakdown'}
                  </h4>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '12px',
                    }}
                  >
                    {activeRashifal.thematicDomains.map((dom) => {
                      const iconMap = {
                        mental_state: Smile,
                        work_career: TrendingUp,
                        love_attraction: Heart,
                        finance_relief: Zap,
                        family_siblings: Home,
                      };
                      const IconComp = iconMap[dom.domainId] || Sparkles;
                      const scoreColor =
                        dom.score >= 80 ? '#10b981' : dom.score >= 65 ? '#3b82f6' : '#f59e0b';

                      return (
                        <div
                          key={dom.domainId}
                          style={{
                            padding: '12px 14px',
                            borderRadius: '10px',
                            background: 'var(--bg-subtle, #f8fafc)',
                            border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <IconComp size={15} style={{ color: scoreColor }} />
                              <strong style={{ fontSize: '13px' }}>
                                {isHi ? dom.domainNameHi : dom.domainNameEn}
                              </strong>
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: scoreColor }}>
                              {dom.score}%
                            </span>
                          </div>

                          <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-muted)' }}>
                            {isHi ? dom.verdictHi : dom.verdictEn}
                          </div>

                          <p style={{ margin: 0, fontSize: '12px', lineHeight: 1.5, color: 'var(--text)' }}>
                            {isHi ? dom.adviceHi : dom.adviceEn}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Legacy Quick Summary Bullets */}
                <div className="pred-bullets">
                  <div>
                    <strong>{isHi ? 'करियर एवं पद:' : 'Career & Status:'}</strong>{' '}
                    {isHi ? activeRashifal.careerHi : activeRashifal.careerEn}
                  </div>
                  <div>
                    <strong>{isHi ? 'प्रेम व दांपत्य:' : 'Love & Marriage:'}</strong>{' '}
                    {isHi ? activeRashifal.loveHi : activeRashifal.loveEn}
                  </div>
                  <div>
                    <strong>{isHi ? 'स्वास्थ्य व ऊर्जा:' : 'Health & Vitality:'}</strong>{' '}
                    {isHi ? activeRashifal.healthHi : activeRashifal.healthEn}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* LIVE WEB FEED VIEW */}
          {rashifalSource === 'live_feeds' && (
            <section className="panel">
              <div className="panel-header">
                <div>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Rss size={16} style={{ color: '#ea580c' }} />
                    {isHi
                      ? `लाइव गोचर वेब फलादेश — ${feedPeriod === 'daily' ? 'दैनिक राशिफल' : 'साप्ताहिक राशिफल'} (${activeFeedItem.pubDateFormatted})`
                      : `Live Gochar Web Forecast — ${feedPeriod === 'daily' ? 'Daily Horoscope' : 'Weekly Horoscope'} (${activeFeedItem.pubDateFormatted})`}
                  </h3>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                    {isHi
                      ? 'प्रत्यक्ष वेब फीड्स द्वारा संकलित दैनिक व साप्ताहिक गोचर फलादेश'
                      : 'Live syndication feed from official astronomical FeedBurner channels'}
                  </span>
                </div>

                <div className="toolbar-group">
                  <div className="subtab-bar">
                    <button
                      type="button"
                      className={`subtab-btn ${feedPeriod === 'daily' ? 'is-active' : ''}`}
                      onClick={() => setFeedPeriod('daily')}
                    >
                      {isHi ? 'दैनिक फीड' : 'Daily Feed'}
                    </button>
                    <button
                      type="button"
                      className={`subtab-btn ${feedPeriod === 'weekly' ? 'is-active' : ''}`}
                      onClick={() => setFeedPeriod('weekly')}
                    >
                      {isHi ? 'साप्ताहिक फीड' : 'Weekly Feed'}
                    </button>
                  </div>
                </div>
              </div>

              {/* 12 Rashi Pill Grid */}
              <div className="panel-subblock">
                <div className="rashi-pill-grid">
                  {feedItems.map((item) => (
                    <button
                      key={item.signIndex}
                      type="button"
                      className={`subtab-btn ${selectedRashi === item.signIndex ? 'is-active' : ''}`}
                      onClick={() => setSelectedRashi(item.signIndex)}
                    >
                      {isHi ? item.signNameHi : item.signNameEn} {item.signIndex === natalMoonSign ? (isHi ? '(जन्म)' : '★') : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Sign Feed Card */}
              <div className="pred-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    background: 'var(--bg-elevated, #ffffff)',
                    border: '1px solid var(--border-color, rgba(0,0,0,0.1))',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '10px',
                      marginBottom: '12px',
                      borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.08))',
                      paddingBottom: '10px',
                    }}
                  >
                    <div>
                      <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--text)' }}>
                        {isHi
                          ? `${activeFeedItem.signNameHi} राशि (${activeFeedItem.signNameEn}) — ${feedPeriod === 'daily' ? 'दैनिक राशिफल' : 'साप्ताहिक राशिफल'}`
                          : `${activeFeedItem.title}`}
                      </h4>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        {isHi ? `प्रकाशन दिनांक: ${activeFeedItem.pubDateFormatted}` : `Published: ${activeFeedItem.pubDate}`}
                      </span>
                    </div>
                  </div>

                  {/* Bilingual Reading */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text)', marginBottom: '8px' }}>
                      <strong>{isHi ? 'हिंदी अनुवाद:' : 'Hindi Interpretation:'}</strong>{' '}
                      {activeFeedItem.descriptionHi}
                    </div>
                    <div
                      style={{
                        fontSize: '12.5px',
                        lineHeight: 1.5,
                        color: 'var(--text-muted)',
                        padding: '10px 14px',
                        background: 'var(--bg-subtle, #f8fafc)',
                        borderRadius: '8px',
                        borderLeft: '3px solid #ea580c',
                      }}
                    >
                      <strong>{isHi ? 'मूल अंग्रेजी पाठ:' : 'Original Feed Text:'}</strong>{' '}
                      {activeFeedItem.description}
                    </div>
                  </div>

                  {/* Key Themes Chips */}
                  <div>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      {isHi ? 'मुख्य ज्योतिषीय सूत्र व विषय:' : 'Key Astrological Highlights:'}
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {(isHi ? activeFeedItem.keyThemesHi : activeFeedItem.keyThemesEn).map((th, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            fontSize: '11px',
                            fontWeight: 600,
                            background: 'rgba(234, 88, 12, 0.1)',
                            color: '#c2410c',
                            border: '1px solid rgba(234, 88, 12, 0.25)',
                          }}
                        >
                          {th}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Shastric Rationale Box */}
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(59, 130, 246, 0.08)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    fontSize: '12px',
                    lineHeight: 1.5,
                    color: 'var(--text)',
                  }}
                >
                  <strong style={{ color: '#1d4ed8', display: 'block', marginBottom: '2px' }}>
                    {isHi ? 'AV Astro Vibe वैदिक गोचर तुलना व विश्लेषण:' : 'AV Astro Vibe Planetary Transit Root Rationale:'}
                  </strong>
                  {isHi
                    ? `आपकी चयनित ${activeFeedItem.signNameHi} राशि से आज चंद्रमा का गोचर ${activeRashifal.thematicDomains[0].verdictHi} स्थिति दर्शाता है। सूर्य का प्रभाव कार्यक्षेत्र में वरिष्ठों से तालमेल की मांग करता है, जबकि शुक्र प्रेम संबंधों में वाणी की मिठास बनाए रखने का संकेत देते हैं।`
                    : `For ${activeFeedItem.signNameEn}, the transit Moon's relative placement underpins the daily emotional momentum (${activeRashifal.thematicDomains[0].verdictEn}), while Sun in transit dictates superiors' responsiveness and Venus governs relational harmony.`}
                </div>
              </div>
            </section>
          )}
        </div>
      )}

      {/* 3. BABY NAME FINDER BY NAKSHATRA PADA */}
      {mode === 'baby_names' && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              <Baby size={15} />{' '}
              {isHi
                ? 'नक्षत्र व नामाक्षर अनुसार शिशु नाम खोजक'
                : 'Vedic Baby Name Finder (Nakshatra, Pada Syllable & Chaldean #)'}
            </h3>
            <div className="toolbar-group">
              <select
                className="select-compact"
                value={String(babyNak)}
                onChange={(e) =>
                  setBabyNak(e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10))
                }
              >
                <option value="all">{isHi ? 'सभी 27 नक्षत्र' : 'All 27 Nakshatras'}</option>
                {NAKSHATRAS.map((n, idx) => (
                  <option key={n.name} value={idx}>
                    {idx + 1}. {trTerm(n.name, lang)}{' '}
                    {idx === chart.panchang.nakshatra.index ? (isHi ? '(जन्म नक्षत्र ★)' : '(Birth ★)') : ''}
                  </option>
                ))}
              </select>
              <select
                className="select-compact"
                value={babyGender}
                onChange={(e) => setBabyGender(e.target.value as 'all' | 'boy' | 'girl')}
              >
                <option value="all">{isHi ? 'लड़का व लड़की दोनों' : 'Boys & Girls'}</option>
                <option value="boy">{isHi ? 'केवल लड़का' : 'Boys'}</option>
                <option value="girl">{isHi ? 'केवल लड़की' : 'Girls'}</option>
              </select>
            </div>
          </div>

          <div className="gochar-highlights">
            <div className="gochar-banner is-info">
              <strong>{isHi ? 'जन्म नक्षत्र नामाक्षर:' : 'Birth Nakshatra Pada Syllables:'}</strong>{' '}
              {trTerm(chart.panchang.nakshatra.name, lang)} ({isHi ? 'चरण' : 'Pada'} {avakahada.pada}) →{' '}
              <strong>
                {isHi ? avakahada.nameSyllableHi : avakahada.nameSyllableEn}
              </strong>{' '}
              | {isHi ? 'सभी चरण अक्षर:' : 'All 4 Pada Letters:'}{' '}
              {(isHi ? avakahada.allPadaSyllablesHi : avakahada.allPadaSyllablesEn).join(', ')}
            </div>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isHi ? 'नाम' : 'Name'}</th>
                  <th>{isHi ? 'लिंग' : 'Gender'}</th>
                  <th>{isHi ? 'नक्षत्र व अक्षर' : 'Nakshatra & Sound'}</th>
                  <th>{isHi ? 'अर्थ (Meaning)' : 'Meaning'}</th>
                  <th>{isHi ? 'कीरो नामांक' : 'Chaldean #'}</th>
                </tr>
              </thead>
              <tbody>
                {babyNames.map((bn, idx) => (
                  <tr key={`${bn.name}-${idx}`}>
                    <td>
                      <strong>{bn.name}</strong>
                    </td>
                    <td>
                      <span className={`tag ${bn.gender === 'boy' ? 'tag-karaka' : 'tag-varg'}`}>
                        {bn.gender === 'boy' ? (isHi ? 'लड़का' : 'Boy') : (isHi ? 'लड़की' : 'Girl')}
                      </span>
                    </td>
                    <td>
                      {trTerm(NAKSHATRAS[bn.nakshatraIndex].name, lang)} ({bn.syllableEn})
                    </td>
                    <td className="wrap-cell">{isHi ? bn.meaningHi : bn.meaningEn}</td>
                    <td className="mono">
                      <span className="tag">{bn.chaldeanNum}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 4. GEMSTONES & 1-14 MUKHI RUDRAKSHA */}
      {mode === 'gems_rudraksha' && (
        <div className="view-stack">
          <section className="panel">
            <div className="panel-header">
              <h3>
                <Gem size={15} />{' '}
                {isHi
                  ? 'व्यक्तिगत रत्न सलाहकार (जीवन रत्न, भाग्य रत्न एवं पुण्य रत्न)'
                  : 'Personalized Vedic Gemstone Advisor (Ratna Recommendation)'}
              </h3>
            </div>
            <div className="domains-grid panel-subblock">
              {[gemReport.lifeStone, gemReport.luckyStone, gemReport.beneficStone].map((g) => (
                <article key={g.roleEn} className="domain-card">
                  <div className="domain-top">
                    <div>
                      <h4>{isHi ? g.roleHi : g.roleEn}</h4>
                      <div className="muted small-text">
                        {trPlanet(g.planet, lang)}
                      </div>
                    </div>
                    <span className="tag tag-varg">{isHi ? g.stoneHi : g.stoneEn}</span>
                  </div>
                  <p className="domain-summary">{isHi ? g.reasonHi : g.reasonEn}</p>
                  <div className="pred-bullets">
                    <div>
                      <strong>{isHi ? 'वजन:' : 'Weight:'}</strong> {g.weightRatti}
                    </div>
                    <div>
                      <strong>{isHi ? 'धातु व उंगली:' : 'Metal & Finger:'}</strong>{' '}
                      {isHi ? `${g.metalHi}, ${g.fingerHi}` : `${g.metalEn}, ${g.fingerEn}`}
                    </div>
                    <div>
                      <strong>{isHi ? 'धारण दिन:' : 'Wearing Time:'}</strong>{' '}
                      {isHi ? g.dayHi : g.dayEn}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {gemReport.avoidStonesEn.length > 0 && (
              <div className="gochar-highlights">
                <div className="gochar-banner is-alert">
                  <strong>{isHi ? 'वर्ज्य रत्न (बिना विशेष सलाह न पहनें):' : 'Gemstones to Avoid (Dusthana Lords):'}</strong>{' '}
                  {(isHi ? gemReport.avoidStonesHi : gemReport.avoidStonesEn).join(' · ')}
                </div>
              </div>
            )}
          </section>

          <section className="panel">
            <div className="panel-header">
              <h3>
                <Compass size={15} />{' '}
                {isHi
                  ? '1–14 मुखी रुद्राक्ष सलाहकार (कुंडली एवं दशा आधारित)'
                  : '1–14 Mukhi Rudraksha Prescription'}
              </h3>
            </div>
            <div className="pred-top-grid panel-subblock">
              {[
                { labelEn: 'Primary Life Rudraksha', labelHi: 'मुख्य जीवन रुद्राक्ष', item: gemReport.primaryRudraksha },
                { labelEn: 'Active Dasha & Fortune Rudraksha', labelHi: 'वर्तमान दशा व भाग्य रुद्राक्ष', item: gemReport.secondaryRudraksha },
              ].map(({ labelEn, labelHi, item }) => (
                <article key={labelEn} className="domain-card">
                  <div className="domain-top">
                    <div>
                      <h4>{isHi ? item.titleHi : item.titleEn}</h4>
                      <div className="muted small-text">{isHi ? labelHi : labelEn}</div>
                    </div>
                    <span className="tag tag-karaka">{item.mukhi}</span>
                  </div>
                  <p className="domain-summary">{isHi ? item.benefitHi : item.benefitEn}</p>
                  <div className="pred-bullets">
                    <div>
                      <strong>{isHi ? 'देवता:' : 'Presiding Deity:'}</strong> {isHi ? item.deityHi : item.deityEn}
                    </div>
                    <div>
                      <strong>{isHi ? 'बीज मंत्र:' : 'Beeja Mantra:'}</strong>{' '}
                      <span className="mono">{item.mantra}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="gochar-highlights">
              <div className="gochar-banner is-clear">
                <Sparkles size={13} />{' '}
                <strong>{isHi ? 'दोष निवारण रुद्राक्ष टिप:' : 'Dosha Relief Note:'}</strong>{' '}
                {isHi ? gemReport.doshaRudrakshaNoteHi : gemReport.doshaRudrakshaNoteEn}
              </div>
            </div>
          </section>
        </div>
      )}
        </>
      )}
    </div>
  );
};
