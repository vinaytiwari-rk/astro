import React, { useMemo, useState } from 'react';
import {
  Activity,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Flame,
  Layers,
  Shield,
  Sparkles,
  Sun,
  Moon,
  Target,
  Zap,
} from 'lucide-react';
import { calculateChart } from '../../astro/calculator';
import { computeBhavabalaReport, type BhavabalaMasterReport, type BhavaBalaRow } from '../../astro/bhavabalaEngine';
import {
  computeKpCuspalInterlinksReport,
  type CilCuspRow,
  type CuspalPromiseVerification,
  type KpCilMasterReport,
} from '../../astro/kpCuspalInterlinks';
import {
  computeKakshyaGocharReport,
  type KakshyaGocharSummary,
  type PlanetKakshyaTransitDetail,
} from '../../astro/predictions/kakshyaGocharEngine';
import {
  computeTajaka50Sahams,
  type TajakaSahamsReport,
  type TajakaSahamResult,
} from '../../astro/tajakaSahams';
import { formatDateTimeDmyAmPm } from '../../astro/time';
import type { BirthInput, ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';

export interface ParasharaKalaWorkstationPanelProps {
  natalChart: ChartData;
  transitChart?: ChartData;
  onLoadBenchmarkChart?: (input: BirthInput) => void;
}

type MainTab = 'kakshya' | 'sahams' | 'kp_cil' | 'bhavabala';

export const ParasharaKalaWorkstationPanel: React.FC<ParasharaKalaWorkstationPanelProps> = ({
  natalChart,
  transitChart: propTransitChart,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [activeTab, setActiveTab] = useState<MainTab>('kakshya');

  // Sub-filters for Sahams (Direct categories, no manual search)
  const [sahamCategory, setSahamCategory] = useState<string>('all');

  // Selected planet for Kakshya detail
  const [selectedPlanetKakshya, setSelectedPlanetKakshya] = useState<string>('Saturn');

  // Selected cusp for CIL detail
  const [selectedCilCusp, setSelectedCilCusp] = useState<number>(7);

  // Calculate live transit chart if not provided
  const transitChart = useMemo(() => {
    if (propTransitChart) return propTransitChart;
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const nowIso = `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())}`;
    const nowTime = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`;

    const transitInput: BirthInput = {
      ...natalChart.input,
      id: `live-transit-${nowIso}`,
      name: 'Current Transit (गोचर)',
      date: nowIso,
      time: nowTime,
      timezone: 'MANUAL',
      utcOffsetMinutes: natalChart.offsetMinutesUsed,
    };
    return calculateChart(transitInput, natalChart.settings);
  }, [propTransitChart, natalChart]);

  // Engines
  const kakshyaReport: KakshyaGocharSummary = useMemo(() => {
    return computeKakshyaGocharReport(natalChart, transitChart);
  }, [natalChart, transitChart]);

  const sahamsReport: TajakaSahamsReport = useMemo(() => {
    return computeTajaka50Sahams(natalChart);
  }, [natalChart]);

  const kpCilReport: KpCilMasterReport = useMemo(() => {
    return computeKpCuspalInterlinksReport(natalChart);
  }, [natalChart]);

  const bhavabalaReport: BhavabalaMasterReport = useMemo(() => {
    return computeBhavabalaReport(natalChart);
  }, [natalChart]);

  // Filtered Sahams by category
  const filteredSahams = useMemo(() => {
    if (sahamCategory === 'all') return sahamsReport.sahams;
    return sahamsReport.sahams.filter((s) => s.category === sahamCategory);
  }, [sahamsReport, sahamCategory]);

  const activeKakshyaDetail: PlanetKakshyaTransitDetail | undefined = useMemo(() => {
    return kakshyaReport.allPlanets.find((p) => p.planet === selectedPlanetKakshya) || kakshyaReport.allPlanets[0];
  }, [kakshyaReport, selectedPlanetKakshya]);

  return (
    <div className="sw-chassis">
      {/* 1. Software Titlebar */}
      <div className="sw-titlebar">
        <div className="sw-title-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="sw-badge sw-badge-warning">
              {isHi ? 'शास्त्रीय ज्योतिष कार्यशाला' : 'Classical Astrological Workstation'}
            </span>
          </div>
          <h2>
            {isHi
              ? 'उन्नत ज्योतिष फलित कार्यशाला'
              : 'Advanced Vedic Astrology Workstation'}
          </h2>
          <p>
            {isHi
              ? 'अष्टकवर्ग कक्ष्य गोचर, ताजिक ५० सहम, केपी कस्पल इंटरलिंक्स एवं सम्पूर्ण भावबल का शास्त्रीय फलादेश फलक।'
              : 'Mathematical Ashtakavarga Kakshya micro-transits, Tajaka 50 Sahams, KP Cuspal Interlinks & comprehensive Bhavabala.'}
          </p>
        </div>

        <div className="sw-native-pill">
          {isHi ? 'सक्रिय जातक: ' : 'Active Native: '}
          <strong>{natalChart.input.name}</strong> ({formatDateTimeDmyAmPm(natalChart.input.date, natalChart.input.time)})
        </div>
      </div>

      {/* 2. Master Navigation Tabs */}
      <div className="sw-tab-bar">
        <button
          type="button"
          onClick={() => setActiveTab('kakshya')}
          className={`sw-tab-btn ${activeTab === 'kakshya' ? 'is-active' : ''}`}
        >
          <Clock className="h-4 w-4" />
          {isHi ? 'अष्टकवर्ग कक्ष्य गोचर' : 'Ashtakavarga Kakshya Gochar'}
          <span className="sw-tab-badge">{kakshyaReport.kakshyaFavorabilityPercent}%</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sahams')}
          className={`sw-tab-btn ${activeTab === 'sahams' ? 'is-active' : ''}`}
        >
          <Compass className="h-4 w-4" />
          {isHi ? 'ताजिक ५० सहम' : 'Tajaka 50 Sahams'}
          <span className="sw-tab-badge">50</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('kp_cil')}
          className={`sw-tab-btn ${activeTab === 'kp_cil' ? 'is-active' : ''}`}
        >
          <Layers className="h-4 w-4" />
          {isHi ? 'कस्पल इंटरलिंक्स CIL (1-2193)' : 'Cuspal Interlinks CIL (1-2193)'}
          <span className="sw-tab-badge">8 Pillars</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bhavabala')}
          className={`sw-tab-btn ${activeTab === 'bhavabala' ? 'is-active' : ''}`}
        >
          <Activity className="h-4 w-4" />
          {isHi ? 'सम्पूर्ण भावबल' : 'Bhavabala Engine'}
          <span className="sw-tab-badge">{bhavabalaReport.averageRupas} Rupas</span>
        </button>
      </div>

      {/* 3. Software Content Panels */}
      <div className="sw-content-body">
        {/* ========================================================================= */}
        {/* TAB 1: ASHTAKAVARGA KAKSHYA GOCHAR (PARASHARA'S LIGHT PARITY) */}
        {/* ========================================================================= */}
        {activeTab === 'kakshya' && (
          <div>
            {/* Purpose & Predictive Explanation Box */}
            <div className="sw-purpose-box">
              <h4>
                <Compass className="h-4 w-4" />
                {isHi
                  ? 'अष्टकवर्ग कक्ष्य गोचर क्या है और इसका फलित उपयोग क्यों किया जाता है?'
                  : 'What is Ashtakavarga Kakshya Gochar & Why is it Used?'}
              </h4>
              <p>
                {isHi
                  ? 'शास्त्रीय सिद्धांत: महर्षि पाराशर (बृहत्पाराशर होराशास्त्र) के अनुसार प्रत्येक राशि के ३० अंशों को ८ समान भागों में विभाजित किया जाता है, जिसे "कक्ष्य" (प्रत्येक ३°४५\') कहते हैं। इसके स्वामी क्रमशः शनि, गुरु, मंगल, सूर्य, शुक्र, बुध, चंद्र और लग्न हैं। जब कोई गोचर ग्रह उस कक्ष्य से गुजरता है जहां जातक की जन्म कुंडली के प्रस्ताराष्टकवर्ग में १ बिंदु (शुभ रेखा) प्राप्त है, तो वह कालखंड आकस्मिक सफलता, धन लाभ और कार्य सिद्धि देता है। शून्य बिंदु होने पर वही गोचर निष्फल या कष्टप्रद रहता है।'
                  : 'Classical Axiom: According to Maharishi Parashara, every 30° zodiac sign is divided into 8 equal micro-arcs of 3°45\' called Kakshyas, ruled in sequence by Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon, and Ascendant. When a transiting planet enters a Kakshya that contributed a Prastara Bindu (1) in the native\'s natal Ashtakavarga, that precise window unlocks immediate fruition, unexpected breakthroughs, and prosperity—even during otherwise challenging transits.'}
              </p>
              <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed rgba(217, 119, 6, 0.3)' }}>
                <strong>
                  <Target className="h-4 w-4" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                  {isHi ? `जातक ${natalChart.input.name} की कुंडली के लिए प्रत्यक्ष भविष्यवाणी:` : `Direct Kundali Prediction for ${natalChart.input.name}:`}
                </strong>{' '}
                {isHi ? kakshyaReport.overallVerdictHi : kakshyaReport.overallVerdictEn}
              </div>
            </div>

            {/* Favorability & Golden Corridors Summary Grid */}
            <div className="sw-grid-3" style={{ marginBottom: '20px' }}>
              <div className="sw-card">
                <div className="sw-card-header">
                  <span className="sw-card-title">
                    {isHi ? 'कक्ष्य गोचर अनुकूलता मीटर' : 'Kakshya Transit Favorability Meter'}
                  </span>
                  <span className="sw-badge sw-badge-warning">
                    {kakshyaReport.activePlanetsWithBindu}/7 {isHi ? 'ग्रह बिंदु युक्त' : 'Planets with Bindus'}
                  </span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#d97706', margin: '4px 0' }}>
                  {kakshyaReport.kakshyaFavorabilityPercent}%
                </div>
                <div className="sw-meter-track">
                  <div
                    className="sw-meter-fill"
                    style={{
                      width: `${kakshyaReport.kakshyaFavorabilityPercent}%`,
                      background: 'linear-gradient(90deg, #d97706 0%, #10b981 100%)',
                    }}
                  />
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '8px' }}>
                  {kakshyaReport.activePlanetsWithBindu >= 4
                    ? isHi
                      ? 'बहुसंख्यक ग्रह शुभ कक्ष्य में हैं। नए उपक्रम व निर्णय फलदायी रहेंगे।'
                      : 'Majority of planets hold active bindus. Favorable time for key initiatives.'
                    : isHi
                      ? 'मध्यम प्रभाव। केवल बिंदु युक्त कक्ष्य वाले ग्रहों के क्षेत्रों में सक्रियता रखें।'
                      : 'Moderate support. Focus energy on houses where transiting lords hold bindus.'}
                </p>
              </div>

              <div className="sw-card" style={{ gridColumn: 'span 2' }}>
                <div className="sw-card-header">
                  <span className="sw-card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    {isHi ? 'स्वर्णिम गोचर कालखंड (Golden Kakshya Corridors)' : 'Active Golden Kakshya Corridors'}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                  {(isHi ? kakshyaReport.goldenWindowsHi : kakshyaReport.goldenWindowsEn).length > 0 ? (
                    (isHi ? kakshyaReport.goldenWindowsHi : kakshyaReport.goldenWindowsEn).map((g, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ color: 'var(--text-primary, #1e293b)' }}>{g}</span>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontStyle: 'italic', color: '#94a3b8' }}>
                      {isHi ? 'वर्तमान में संतुलित गोचर प्रभाव।' : 'Moderate transit rhythm across Kakshyas.'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 7 Planet Selector Bar */}
            <div className="sw-planet-bar">
              {kakshyaReport.allPlanets.map((p) => (
                <button
                  key={p.planet}
                  type="button"
                  onClick={() => setSelectedPlanetKakshya(p.planet)}
                  className={`sw-planet-btn ${selectedPlanetKakshya === p.planet ? 'is-active' : ''}`}
                >
                  <span>{p.planet}</span>
                  <span className={`sw-badge ${p.currentHasBindu ? 'sw-badge-success' : 'sw-badge-danger'}`}>
                    {p.currentHasBindu ? (isHi ? '1 बिंदु' : '1 Bindu') : (isHi ? '0 बिंदु' : '0 Bindu')}
                  </span>
                </button>
              ))}
            </div>

            {/* Active Planet Detail & 8-Kakshya Breakdown Table */}
            {activeKakshyaDetail && (
              <div className="sw-grid-3">
                {/* Left: Planetary Current Transit Snapshot */}
                <div className="sw-card">
                  <div className="sw-card-header">
                    <div>
                      <span className="sw-card-title">
                        {activeKakshyaDetail.planet} {isHi ? 'गोचर स्थिति' : 'Transit Status'}
                      </span>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {activeKakshyaDetail.transitSignName} ({activeKakshyaDetail.transitDms}) · House {activeKakshyaDetail.transitHouseFromAsc}
                      </div>
                    </div>
                    <span className={`sw-badge ${activeKakshyaDetail.currentHasBindu ? 'sw-badge-success' : 'sw-badge-warning'}`}>
                      {activeKakshyaDetail.statusCategory}
                    </span>
                  </div>

                  <div className="sw-stat-grid" style={{ marginBottom: '14px' }}>
                    <div className="sw-stat-box">
                      <span className="sw-stat-label">{isHi ? 'वर्तमान कक्ष्य स्वामी' : 'Current Kakshya Lord'}</span>
                      <span className="sw-stat-value">
                        {activeKakshyaDetail.currentKakshyaLord} (#{activeKakshyaDetail.currentKakshyaNumber})
                      </span>
                    </div>
                    <div className="sw-stat-box">
                      <span className="sw-stat-label">{isHi ? 'कक्ष्य विस्तार' : 'Kakshya Span'}</span>
                      <span className="sw-stat-value" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        {activeKakshyaDetail.currentKakshyaSpan}
                      </span>
                    </div>
                    <div className="sw-stat-box">
                      <span className="sw-stat-label">{isHi ? 'भिन्नाष्टक बिंदु (BAV)' : 'Bhinna Bindus (BAV)'}</span>
                      <span className="sw-stat-value">
                        {activeKakshyaDetail.bhinnaBindusInSign} / 8
                      </span>
                    </div>
                    <div className="sw-stat-box">
                      <span className="sw-stat-label">{isHi ? 'सर्वाष्टक बिंदु (SAV)' : 'Sarva Bindus (SAV)'}</span>
                      <span className="sw-stat-value">
                        {activeKakshyaDetail.sarvaBindusInSign} / 56
                      </span>
                    </div>
                  </div>

                  <div style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(217, 119, 6, 0.08)',
                    border: '1px solid rgba(217, 119, 6, 0.25)',
                    fontSize: '0.82rem',
                    lineHeight: 1.5,
                  }}>
                    <div style={{ fontWeight: 700, color: '#b45309', marginBottom: '4px' }}>
                      <Compass className="h-4 w-4" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                      {isHi ? 'फलित शास्त्रीय निर्देश' : 'Predictive Direction for Native'}
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-primary, #334155)' }}>
                      {isHi ? activeKakshyaDetail.predictionHi : activeKakshyaDetail.predictionEn}
                    </p>
                  </div>
                </div>

                {/* Right: Full 8-Kakshya Division Table */}
                <div className="sw-card" style={{ gridColumn: 'span 2' }}>
                  <div className="sw-card-header">
                    <span className="sw-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Layers className="h-4 w-4 text-amber-500" />
                      {isHi
                        ? `${activeKakshyaDetail.transitSignName} राशि में सम्पूर्ण ८ कक्ष्य विभाजन`
                        : `Full 8-Kakshya Division in ${activeKakshyaDetail.transitSignName}`}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      3°45' {isHi ? 'प्रति कक्ष्य' : 'per Kakshya'}
                    </span>
                  </div>

                  <div className="sw-table-container">
                    <table className="sw-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>{isHi ? 'कक्ष्य स्वामी' : 'Kakshya Lord'}</th>
                          <th>{isHi ? 'अंश विस्तार' : 'Degree Arc'}</th>
                          <th style={{ textAlign: 'center' }}>{isHi ? 'प्रस्ताराष्टक बिंदु' : 'Prastara Bindu'}</th>
                          <th>{isHi ? 'वर्तमान स्थिति' : 'Active Status'}</th>
                          <th>{isHi ? 'फल प्रभाव' : 'Fruition Potential'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeKakshyaDetail.kakshyaSlots.map((slot) => (
                          <tr key={slot.kakshyaNumber} className={slot.isActiveNow ? 'is-active-row' : ''}>
                            <td style={{ color: '#94a3b8' }}>#{slot.kakshyaNumber}</td>
                            <td><strong>{slot.lord}</strong></td>
                            <td style={{ fontFamily: 'monospace' }}>{slot.rangeDms}</td>
                            <td style={{ textAlign: 'center' }}>
                              <span className={`sw-badge ${slot.hasBindu ? 'sw-badge-success' : 'sw-badge-neutral'}`}>
                                {slot.hasBindu ? '1' : '0'}
                              </span>
                            </td>
                            <td>
                              {slot.isActiveNow ? (
                                <span className="sw-badge sw-badge-warning">
                                  {isHi ? 'सक्रिय गोचर' : 'Stationed Now'}
                                </span>
                              ) : (
                                <span style={{ color: '#94a3b8' }}>—</span>
                              )}
                            </td>
                            <td>{isHi ? slot.verdictHi : slot.verdictEn}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: TAJAKA 50 SAHAMS ENGINE */}
        {/* ========================================================================= */}
        {activeTab === 'sahams' && (
          <div>
            {/* Purpose & Predictive Explanation Box */}
            <div className="sw-purpose-box">
              <h4>
                <Compass className="h-4 w-4" />
                {isHi
                  ? 'ताजिक ५० सहम क्या हैं और इनसे क्या फलित जाना जाता है?'
                  : 'What are Tajaka 50 Sahams & What Do They Predict for Your Life?'}
              </h4>
              <p>
                {isHi
                  ? 'शास्त्रीय सिद्धांत: ताजिक नीलकण्ठी के अनुसार सहम कुंडली के अति-संवेदनशील गणितीय बिंदु हैं, जो दो ग्रहों के बीच के कोणीय विस्तार को लग्न से जोड़कर निकाले जाते हैं। जब किसी सहम का स्वामी लग्न स्वामी या कार्येश के साथ "इत्थशाल योग" (परस्पर दीप्तांश दृष्टि संबंध) बनाता है, तो उस सहम का फल (धन, विवाह, संतान, राजपद, विदेश यात्रा, रोग मुक्ति) निश्चित रूप से घटित होता है। यह व्यवस्था जातक के जीवन के ५० सूक्ष्म आयामों की सटीक भविष्यवाणी करती है।'
                  : 'Classical Axiom: According to the classical Tajaka Neelakanthi, a Saham is an ultrasensitive mathematical focal point calculated by projecting the longitudinal arc between two planetary significators from the Ascendant. When a Saham lord forms an Ithasala Yoga (harmonious mutual aspect within deeptamsha orb) with the Lagna lord or Karyesha, the specific life event promised by that Saham is guaranteed to materialize with precision.'}
              </p>
              <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed rgba(217, 119, 6, 0.3)' }}>
                <strong>
                  <Target className="h-4 w-4" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                  {isHi ? 'जन्म काल विभाजन:' : 'Birth Chart Archetype:'}
                </strong>{' '}
                {isHi ? sahamsReport.birthTypeHi : sahamsReport.birthTypeEn}
              </div>
            </div>

            {/* Category Chips for Fast Switching without Manual Search */}
            <div className="sw-category-strip">
              {[
                { id: 'all', en: 'All 50 Sahams', hi: 'सभी ५० सहम' },
                { id: 'Wealth & Career', en: 'Wealth & Career (अर्थ व कर्म)', hi: 'धन व कर्म सहम' },
                { id: 'Spiritual & Dharma', en: 'Dharma & Spirit (धर्म व पुण्य)', hi: 'धर्म व पुण्य सहम' },
                { id: 'Family & Relationships', en: 'Family & Love (परिवार व विवाह)', hi: 'परिवार व संबंध सहम' },
                { id: 'Vitality & Health', en: 'Vitality & Health (आरोग्य व आयु)', hi: 'आरोग्य व आयु सहम' },
                { id: 'Enterprise & Travel', en: 'Enterprise & Travel (पराक्रम व यात्रा)', hi: 'पराक्रम व यात्रा सहम' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSahamCategory(cat.id)}
                  className={`sw-category-chip ${sahamCategory === cat.id ? 'is-active' : ''}`}
                >
                  {isHi ? cat.hi : cat.en}
                </button>
              ))}
            </div>

            {/* Active Ithasala Yogas Callout if any */}
            {sahamsReport.sahams.some((s) => s.ithasalaYoga.exists) && (
              <div className="sw-card" style={{ marginBottom: '16px', borderLeft: '4px solid #10b981' }}>
                <div className="sw-card-header">
                  <span className="sw-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles className="h-4 w-4 text-emerald-500" />
                    {isHi ? 'कुंडली में सक्रिय ताजिक इत्थशाल योग (विशेष फलदायी सहम)' : 'Active Tajaka Ithasala Yogas in this Kundali'}
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {sahamsReport.sahams
                    .filter((s) => s.ithasalaYoga.exists)
                    .map((s) => (
                      <div
                        key={s.id}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: 'rgba(16, 185, 129, 0.08)',
                          border: '1px solid rgba(16, 185, 129, 0.25)',
                          fontSize: '0.82rem',
                        }}
                      >
                        <strong>{isHi ? s.nameHi : s.nameEn}</strong> (House {s.house}, {s.signName}) →{' '}
                        <span style={{ color: '#059669', fontWeight: 600 }}>
                          {s.ithasalaYoga.partnerPlanet} ({s.ithasalaYoga.aspectType})
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Sahams Table */}
            <div className="sw-card">
              <div className="sw-card-header">
                <span className="sw-card-title">
                  {isHi ? `ताजिक ५० सहम तालिका (${filteredSahams.length} सहम प्रदर्शित)` : `Tajaka 50 Sahams Table (${filteredSahams.length} Displayed)`}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Tajaka Neelakanthi Formulations
                </span>
              </div>

              <div className="sw-table-container">
                <table className="sw-table">
                  <thead>
                    <tr>
                      <th>{isHi ? 'सहम नाम व सूत्र' : 'Saham Name & Formula'}</th>
                      <th>{isHi ? 'श्रेणी' : 'Category'}</th>
                      <th>{isHi ? 'राशि एवं अंश' : 'Sign & Degree'}</th>
                      <th style={{ textAlign: 'center' }}>{isHi ? 'भाव' : 'House'}</th>
                      <th>{isHi ? 'स्वामी' : 'Lord'}</th>
                      <th>{isHi ? 'इत्थशाल योग' : 'Ithasala Yoga'}</th>
                      <th>{isHi ? 'जातक कुंडली फलित' : 'Kundali Predictive Significance'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSahams.map((s) => (
                      <tr key={s.id}>
                        <td>
                          <strong>{isHi ? s.nameHi : s.nameEn}</strong>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                            {isHi ? s.formulaDescriptionHi : s.formulaDescriptionEn}
                          </div>
                        </td>
                        <td>
                          <span className="sw-badge sw-badge-neutral">{s.category}</span>
                        </td>
                        <td>
                          <strong>{s.signName}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>
                            {s.dms}
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className="sw-badge sw-badge-warning">{s.house}</span>
                        </td>
                        <td><strong>{s.lord}</strong></td>
                        <td>
                          {s.ithasalaYoga.exists ? (
                            <span className="sw-badge sw-badge-success">
                              <Sparkles className="h-3 w-3" />
                              {s.ithasalaYoga.partnerPlanet} ({s.ithasalaYoga.aspectType})
                            </span>
                          ) : (
                            <span style={{ color: '#94a3b8' }}>—</span>
                          )}
                        </td>
                        <td style={{ maxWidth: '320px', lineHeight: 1.4 }}>
                          {isHi ? s.predictionHi : s.predictionEn}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: TRUE ASTROLOGY KP CUSPAL INTERLINKS (CIL 1-2193) */}
        {/* ========================================================================= */}
        {activeTab === 'kp_cil' && (
          <div>
            {/* Purpose & Predictive Explanation Box */}
            <div className="sw-purpose-box">
              <h4>
                <Layers className="h-4 w-4" />
                {isHi
                  ? 'कस्पल इंटरलिंक्स (CIL 1-2193) क्या है और यह क्या सिद्ध करता है?'
                  : 'What is Cuspal Interlinks (CIL 1-2193) & Sub-Sub Lord Theory?'}
              </h4>
              <p>
                {isHi
                  ? 'शास्त्रीय सिद्धांत: केपी कस्पल इंटरलिंक्स पद्धति में भाव के वचन (Promise) का अंतिम निर्णय उप-उप स्वामी (Sub-Sub Lord - SSL) द्वारा होता है, जो संपूर्ण भचक्र को २,१९३ सूक्ष्म भागों में विभाजित करता है। यदि किसी भाव का उप-उप स्वामी अपने नक्षत्र स्वामी और उप स्वामी के माध्यम से उस भाव के अनुकूल भावों (जैसे विवाह हेतु २, ७, ११; धन हेतु २, ६, १०, ११; उच्च शिक्षा हेतु ४, ९, ११) को जोड़ता है, तो वह कार्य अवश्य सिद्ध होता है। यदि ६, ८, १२ के संबंध बनते हैं, तो बाधाएं आती हैं।'
                  : 'Classical Axiom: Under the Krishnamurti Paddhati (KP) Cuspal Interlinks (CIL 1-2193) doctrine, the static promise of any house is governed by its Sub-Sub Lord (SSL), dividing the 360° zodiac into 2,193 micro-arcs. If a cusp Sub-Sub Lord links via its Star and Sub Lords to favorable houses (e.g., 2, 7, 11 for marriage; 2, 6, 10, 11 for career; 4, 9, 11 for higher education), the matter manifests with certainty. Links to 6, 8, 12 indicate obstacles or delays.'}
              </p>
              <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed rgba(217, 119, 6, 0.3)' }}>
                <strong>
                  <Target className="h-4 w-4" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                  {isHi ? `जातक ${natalChart.input.name} की कुंडली का समग्र कस्पल विश्लेषण:` : `Kundali Synthesis for ${natalChart.input.name}:`}
                </strong>{' '}
                {isHi ? kpCilReport.overallSummaryHi : kpCilReport.overallSummaryEn}
              </div>
            </div>

            {/* 8 Cuspal Promise Verification Cards Grid */}
            <div style={{ marginBottom: '20px' }}>
              <div className="sw-card-header" style={{ marginBottom: '14px' }}>
                <span className="sw-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award className="h-4 w-4 text-amber-500" />
                  {isHi ? '८ आधारभूत जीवन आयाम: कस्पल प्रॉमिस सत्यापन' : '8 Core Life Pillars: Cuspal Promise Verification'}
                </span>
                <span className="sw-badge sw-badge-warning">
                  2,193 {isHi ? 'सूक्ष्म उप-उप खंड' : 'Micro-SSL Arcs'}
                </span>
              </div>

              <div className="sw-grid-4">
                {kpCilReport.cuspalPromises.map((p) => (
                  <div key={p.primaryCusp} className="sw-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span className="sw-badge sw-badge-neutral">
                          {isHi ? `भाव ${p.primaryCusp}` : `Cusp ${p.primaryCusp}`}
                        </span>
                        <span className={`sw-badge ${
                          p.verdict.startsWith('Strong')
                            ? 'sw-badge-success'
                            : p.verdict.startsWith('Adverse')
                              ? 'sw-badge-danger'
                              : 'sw-badge-warning'
                        }`}>
                          {p.verdict.split('(')[0].trim()}
                        </span>
                      </div>

                      <h4 style={{ margin: '0 0 6px 0', fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
                        {isHi ? p.topicHi : p.topic}
                      </h4>

                      <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '8px' }}>
                        <div>
                          <strong>SSL: </strong>{p.sslLord} (Star: {p.sslStarLord}, Sub: {p.sslSubLord})
                        </div>
                        <div>
                          <strong>{isHi ? 'अनुकूल भाव:' : 'Fav Houses:'} </strong>
                          <span style={{ color: '#059669', fontWeight: 600 }}>{p.favorableHouses.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    <p style={{
                      margin: 0,
                      fontSize: '0.8rem',
                      lineHeight: 1.45,
                      color: 'var(--text-primary, #334155)',
                      paddingTop: '8px',
                      borderTop: '1px solid var(--border-color, #e2e8f0)',
                    }}>
                      {isHi ? p.analysisHi : p.analysisEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Full 12 Cusps CIL Table */}
            <div className="sw-card">
              <div className="sw-card-header">
                <span className="sw-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers className="h-4 w-4 text-amber-500" />
                  {isHi ? 'सम्पूर्ण १२ भाव कस्पल इंटरलिंक्स सारणी' : 'Full 12-Cusps Cuspal Interlinks (CIL) Table'}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Sign Lord · Star Lord · Sub Lord · Sub-Sub Lord (SSL)
                </span>
              </div>

              <div className="sw-table-container">
                <table className="sw-table">
                  <thead>
                    <tr>
                      <th>Cusp</th>
                      <th>{isHi ? 'अंश एवं राशि' : 'Longitude & Sign'}</th>
                      <th>{isHi ? 'राशि स्वामी' : 'Sign Lord'}</th>
                      <th>{isHi ? 'नक्षत्र स्वामी' : 'Star Lord'}</th>
                      <th>{isHi ? 'उप स्वामी' : 'Sub Lord'}</th>
                      <th style={{ color: '#b45309' }}>{isHi ? 'उप-उप स्वामी (SSL)' : 'Sub-Sub Lord'}</th>
                      <th>{isHi ? 'SSL नक्षत्र / उप' : 'SSL Star / Sub'}</th>
                      <th>{isHi ? 'सक्रिय भाव (Involvement)' : 'Involvement Houses'}</th>
                      <th>{isHi ? 'फल भाव (Commitment)' : 'Commitment Houses'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kpCilReport.cusps.map((c) => (
                      <tr
                        key={c.house}
                        onClick={() => setSelectedCilCusp(c.house)}
                        className={selectedCilCusp === c.house ? 'is-active-row' : ''}
                        style={{ cursor: 'pointer' }}
                      >
                        <td><strong>#{c.house}</strong></td>
                        <td>
                          <strong>{c.signName}</strong>{' '}
                          <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>{c.dms}</span>
                        </td>
                        <td>{c.signLord}</td>
                        <td>{c.starLord}</td>
                        <td>{c.subLord}</td>
                        <td>
                          <strong style={{ color: '#b45309' }}>{c.subSubLord}</strong>{' '}
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                            (#{c.sslIndex2193})
                          </span>
                        </td>
                        <td>{c.sslStarLord} / {c.sslSubLord}</td>
                        <td style={{ fontFamily: 'monospace', color: '#4f46e5' }}>
                          [{c.involvementHouses.join(', ') || 'none'}]
                        </td>
                        <td style={{ fontFamily: 'monospace', color: '#059669' }}>
                          [{c.commitmentHouses.join(', ') || 'none'}]
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: KALA 2018 MATHEMATICAL BHAVABALA ENGINE */}
        {/* ========================================================================= */}
        {activeTab === 'bhavabala' && (
          <div>
            {/* Purpose & Predictive Explanation Box */}
            <div className="sw-purpose-box">
              <h4>
                <Activity className="h-4 w-4" />
                {isHi
                  ? 'भावबल क्या है और जातक की कुंडली में इसका क्या अर्थ है?'
                  : 'What is Bhavabala & How Does it Direct Life Manifestation?'}
              </h4>
              <p>
                {isHi
                  ? 'शास्त्रीय सिद्धांत: महर्षि पाराशर के षड्बल एवं भावबल सिद्धांत के अनुसार, प्रत्येक भाव का कुल बल रूप (Rupas) में मापा जाता है। इसमें भावाधिपति बल (स्वामी का सामर्थ्य), भाव दिग्बल (दिशा बल), भाव दृष्टि बल (शुभ एवं पापक ग्रहों की संयुक्त दृष्टि) और दिन-रात्रि बल सम्मिलित होते हैं। जिस भाव का भावबल अधिक होता है, उस भाव से संबंधित फल अल्प प्रयास में प्रचुर मात्रा में प्राप्त होते हैं।'
                  : 'Classical Axiom: According to the classical Bhavabala doctrine, each of the 12 houses possesses an absolute mathematical potency measured in Rupas (60 Virupas = 1 Rupa). Bhavabala integrates: 1) Bhavadhipati Bala (lord\'s strength), 2) Bhava Digbala (directional cusp strength), 3) Bhava Drishti Bala (net benefic/malefic aspectual impact), and 4) Dina-Ratri Bala. Houses with high Bhavabala yield massive achievements with effortless ease.'}
              </p>
              <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed rgba(217, 119, 6, 0.3)' }}>
                <strong>
                  <Target className="h-4 w-4" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                  {isHi ? `जातक ${natalChart.input.name} का भावबल निष्कर्ष:` : `Bhavabala Direction for ${natalChart.input.name}:`}
                </strong>{' '}
                {isHi ? bhavabalaReport.overallSummaryHi : bhavabalaReport.overallSummaryEn}
              </div>
            </div>

            {/* Bhavabala Stat Cards */}
            <div className="sw-grid-3" style={{ marginBottom: '20px' }}>
              <div className="sw-card">
                <span className="sw-stat-label">{isHi ? 'सर्वाधिक शक्तिशाली भाव' : 'Strongest House'}</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', margin: '4px 0' }}>
                  {isHi ? `भाव ${bhavabalaReport.strongestHouse}` : `House #${bhavabalaReport.strongestHouse}`}
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                  {isHi ? 'यह भाव जीवन में सर्वोच्च उत्कर्ष एवं सफलता का केंद्र है।' : 'Core powerhouse of life achievement & effortless fruition.'}
                </p>
              </div>

              <div className="sw-card">
                <span className="sw-stat-label">{isHi ? 'औसत भावबल' : 'Average Bhavabala'}</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d97706', margin: '4px 0' }}>
                  {bhavabalaReport.averageRupas} <span style={{ fontSize: '1rem', fontWeight: 500 }}>Rupas</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                  {isHi ? 'सामान्य सीमा: ५.० से ६.५ रूप से अधिक बलवान।' : 'Standard classical threshold: 5.0 to 6.5 Rupas.'}
                </p>
              </div>

              <div className="sw-card">
                <span className="sw-stat-label">{isHi ? 'उच्च सामर्थ्य भाव' : 'High Potency Houses'}</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2563eb', margin: '6px 0' }}>
                  {bhavabalaReport.highPotencyHouses.map((h) => `H${h}`).join(', ') || 'None'}
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                  {isHi ? 'इन भावों के फलों में स्वतः वृद्धि होती है।' : 'Houses generating organic, unhindered life expansion.'}
                </p>
              </div>
            </div>

            {/* 12 Bhavas Bhavabala Table */}
            <div className="sw-card">
              <div className="sw-card-header">
                <span className="sw-card-title">
                  {isHi ? 'सम्पूर्ण १२ भाव भावबल गणितीय सारणी' : 'Full 12 Bhavas Bhavabala Mathematical Table'}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Bhavadhipati · Digbala · Drishti Bala · Dina-Ratri
                </span>
              </div>

              <div className="sw-table-container">
                <table className="sw-table">
                  <thead>
                    <tr>
                      <th>House</th>
                      <th>{isHi ? 'राशि एवं स्वामी' : 'Sign & Lord'}</th>
                      <th>{isHi ? 'भावाधिपति बल' : 'Bhavadhipati'}</th>
                      <th>{isHi ? 'भाव दिग्बल' : 'Bhava Digbala'}</th>
                      <th>{isHi ? 'भाव दृष्टि बल' : 'Drishti Bala'}</th>
                      <th>{isHi ? 'दिन-रात्रि बल' : 'Dina-Ratri'}</th>
                      <th style={{ color: '#059669' }}>{isHi ? 'कुल भावबल (रूप)' : 'Total Rupas'}</th>
                      <th style={{ textAlign: 'center' }}>{isHi ? 'कोटि (Rank)' : 'Rank'}</th>
                      <th>{isHi ? 'फलित सामर्थ्य' : 'Potency Verdict'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bhavabalaReport.houses.map((h) => (
                      <tr key={h.house}>
                        <td><strong>#{h.house}</strong></td>
                        <td>
                          <strong>{h.signName}</strong>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {h.lord} · {isHi ? h.signClassificationHi : h.signClassification}
                          </div>
                        </td>
                        <td style={{ fontFamily: 'monospace' }}>{h.bhavadhipatiBalaVirupas} V</td>
                        <td style={{ fontFamily: 'monospace' }}>{h.bhavaDigbalaVirupas} V</td>
                        <td style={{ fontFamily: 'monospace' }}>
                          <span style={{ color: h.bhavaDrishtiBalaVirupas >= 0 ? '#059669' : '#dc2626' }}>
                            {h.bhavaDrishtiBalaVirupas >= 0 ? `+${h.bhavaDrishtiBalaVirupas}` : h.bhavaDrishtiBalaVirupas} V
                          </span>
                        </td>
                        <td style={{ fontFamily: 'monospace' }}>{h.bhavaDinaRatriBalaVirupas} V</td>
                        <td>
                          <strong style={{ fontSize: '0.95rem', color: '#059669' }}>{h.totalRupas} R</strong>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                            {h.totalVirupas} V
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`sw-badge ${h.rank <= 3 ? 'sw-badge-warning' : 'sw-badge-neutral'}`}>
                            #{h.rank}
                          </span>
                        </td>
                        <td style={{ maxWidth: '300px', lineHeight: 1.4 }}>
                          <span className={`sw-badge ${h.potencyVerdict.startsWith('High') ? 'sw-badge-success' : 'sw-badge-warning'}`} style={{ marginBottom: '4px' }}>
                            {h.potencyVerdict.split('(')[0].trim()}
                          </span>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                            {isHi ? h.interpretationHi : h.interpretationEn}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
