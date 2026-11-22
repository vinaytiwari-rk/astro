import React, { useMemo, useState } from 'react';
import {
  Activity,
  Award,
  BookOpen,
  Calendar,
  Clock,
  Compass,
  Eye,
  FileSpreadsheet,
  Grid,
  Layers,
  Moon,
  Scale,
  Scroll,
  Shield,
  Sparkles,
  Sun,
  User,
  Zap,
} from 'lucide-react';
import { computeAvakahadaChakra, computeBhavaChalitPlacements, computeGhatakChakra } from '../astro/avakahadaChalit';
import { computeAvasthasAndUpagrahas } from '../astro/avasthasUpagrahas';
import { computeBhavabalaReport } from '../astro/bhavabalaEngine';
import { computeDeepLifePredictions } from '../astro/predictions/deepLifePredictions';
import { DIVISIONAL_META, NINE_GRAHAS, SEVEN_PLANETS, SIGNS } from '../astro/constants';
import { formatDateDmy, formatDms, formatLocalDateTimeFromUtc } from '../astro/time';
import type {
  BirthInput,
  CalcSettings,
  ChartData,
  DivisionalChartId,
  NineGrahaId,
  SevenPlanetId,
} from '../astro/types';
import { useLanguage } from '../i18n/LanguageContext';
import { trPlanet, trPlanetShort, trSign } from '../i18n/translations';
import { computeDrishtiPredictions } from '../astro/predictions/drishtiPredictions';
import { computeChartYutiReport } from '../astro/predictions/yutiPredictions';
import { detectClassicalYogas } from '../astro/predictions/classicalYogasKb';
import { computeAshtakavargaKakshya } from '../astro/predictions/ashtakavargaKakshya';

interface CalculationsDossierViewProps {
  chart: ChartData;
  activeInput?: BirthInput;
  settings?: CalcSettings;
  onNavigate?: (view: string, sub?: string) => void;
}

type CalcSubTab =
  | 'panchanga'
  | 'planets'
  | 'shadbala'
  | 'ashtakavarga'
  | 'vargas'
  | 'chalit'
  | 'jaimini'
  | 'dashaMath'
  | 'gocharMath'
  | 'drishtiMath'
  | 'yutiMath'
  | 'yogaMath';

export const CalculationsDossierView: React.FC<CalculationsDossierViewProps> = ({
  chart,
  onNavigate,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [activeTab, setActiveTab] = useState<CalcSubTab>('panchanga');
  const [birthProfileTab, setBirthProfileTab] = useState<'panchanga' | 'seasonal' | 'navamsha' | 'avakhada' | 'grid'>('panchanga');
  const [selectedVarga, setSelectedVarga] = useState<DivisionalChartId>('D9');

  const deepLife = useMemo(() => computeDeepLifePredictions(chart), [chart]);
  const avakahada = useMemo(() => computeAvakahadaChakra(chart), [chart]);
  const avasthas = useMemo(() => computeAvasthasAndUpagrahas(chart), [chart]);
  const chalit = useMemo(() => computeBhavaChalitPlacements(chart), [chart]);
  const bhavabala = useMemo(() => computeBhavabalaReport(chart), [chart]);
  const drishtiReport = useMemo(() => computeDrishtiPredictions(chart), [chart]);
  const yutiReport = useMemo(() => computeChartYutiReport(chart), [chart]);
  const detectedYogas = useMemo(() => detectClassicalYogas(chart), [chart]);
  const kakshyaReport = useMemo(() => computeAshtakavargaKakshya(chart), [chart]);

  // Birth Dasha Balance Math
  const birthDashaBalance = useMemo(() => {
    if (!chart.vimshottari || chart.vimshottari.length === 0) return null;
    const firstMd = chart.vimshottari[0];
    const remMs = Math.max(0, firstMd.endMs - chart.utcMs);
    const remDays = remMs / (1000 * 60 * 60 * 24);
    const years = Math.floor(remDays / 365.25);
    const remAfterY = remDays - years * 365.25;
    const months = Math.floor(remAfterY / 30.44);
    const days = Math.floor(remAfterY - months * 30.44);
    return {
      lord: firstMd.lord,
      years,
      months,
      days,
      totalRemainingDays: Math.round(remDays),
    };
  }, [chart]);

  // Active Dasha and Antardasha on Current Date
  const activeDasha = useMemo(() => {
    const now = Date.now();
    const md = chart.vimshottari.find((p) => now >= p.startMs && now < p.endMs) || chart.vimshottari[0];
    const adList = md?.children || [];
    const ad = adList.find((p) => now >= p.startMs && now < p.endMs) || adList[0];
    return { md, ad, adList };
  }, [chart]);

  const navProfile = deepLife.birthProfile.navamshaLagna;
  const tithiDetails = deepLife.birthProfile.tithiDetails;
  const varaFactor = deepLife.birthProfile.factors.find((f) => f.id === 'weekday');
  const tithiFactor = deepLife.birthProfile.factors.find((f) => f.id === 'tithi');
  const nakshatraFactor = deepLife.birthProfile.factors.find((f) => f.id === 'nakshatra-charan');
  const yogaFactor = deepLife.birthProfile.factors.find((f) => f.id === 'surya-yoga');
  const karanaFactor = deepLife.birthProfile.factors.find((f) => f.id === 'karana');

  const navPills: Array<{ id: CalcSubTab; labelEn: string; labelHi: string; icon: React.ReactNode }> = [
    { id: 'panchanga', labelEn: 'Panchang & Foundations', labelHi: 'पंचांग एवं जन्म आधार', icon: <BookOpen size={14} /> },
    { id: 'planets', labelEn: 'Planetary Coordinates & Avasthas', labelHi: 'ग्रह स्थिति, भोगांश व अवस्थाएं', icon: <FileSpreadsheet size={14} /> },
    { id: 'shadbala', labelEn: 'Shadbala & Bhavabala Math', labelHi: 'षड्बल एवं भावबल तालिका', icon: <Scale size={14} /> },
    { id: 'ashtakavarga', labelEn: 'Ashtakavarga (SAV 337)', labelHi: 'अष्टकवर्ग (सर्वाष्टकवर्ग 337)', icon: <Layers size={14} /> },
    { id: 'vargas', labelEn: 'Shodashavargas (D1–D60)', labelHi: 'षोडशवर्ग निर्देशांक (D1–D60)', icon: <Grid size={14} /> },
    { id: 'chalit', labelEn: 'Bhava Chalit & Cusps', labelHi: 'भाव चलित एवं कस्पल विस्थापन', icon: <Compass size={14} /> },
    { id: 'jaimini', labelEn: 'Jaimini Karakas & Arudhas', labelHi: 'जैमिनी चर कारक व आरूढ़ पद', icon: <Sparkles size={14} /> },
    { id: 'dashaMath', labelEn: 'Dasha Math & Balance', labelHi: 'दशा गणित व भुक्त-भोग्य काल', icon: <Clock size={14} /> },
    { id: 'gocharMath', labelEn: 'Transit Ephemeris & Kakshya', labelHi: 'गोचर गणित व कक्ष्या सारणी', icon: <Activity size={14} /> },
    { id: 'drishtiMath', labelEn: 'Aspect (Drishti) Matrix & Virupas', labelHi: 'दृष्टि तालिका व दृष्टि मान', icon: <Eye size={14} /> },
    { id: 'yutiMath', labelEn: 'Conjunction Orbs & Combustion', labelHi: 'युति गणित, निकटता व अस्त मान', icon: <Sun size={14} /> },
    { id: 'yogaMath', labelEn: 'Yoga Verification Criteria Math', labelHi: 'योग गणितीय कसौटी व सत्यापन', icon: <Award size={14} /> },
  ];

  return (
    <div className="view-stack" style={{ maxWidth: 1200, margin: '0 auto', padding: '10px 16px' }}>
      {/* 1. Header Banner */}
      <div
        className="card"
        style={{
          borderLeft: '4px solid var(--accent, #d97706)',
          background: 'var(--bg-elevated)',
          padding: '16px 20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--accent, #d97706)', fontWeight: 700 }}>
              {isHi ? 'गणितीय व तकनीकी कार्यशाला' : 'Mathematical & Technical Dossier'}
            </div>
            <h1 style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: 800 }}>
              {isHi ? 'समस्त ज्योतिषीय गणनाएँ एवं तकनीकी सारणी' : 'Complete Astrological Calculations & Technical Dossier'}
            </h1>
          </div>
          <span className="badge badge-subtle" style={{ fontSize: '11.5px', padding: '5px 10px' }}>
            {isHi ? 'दृक सिद्धांत एवं स्विस एफिमेरिस' : 'Drik Siddhanta & Swiss Ephemeris'}
          </span>
        </div>
        <p className="muted small-text" style={{ margin: '8px 0 0', lineHeight: 1.55 }}>
          {isHi
            ? 'यहाँ जन्म कुंडली से संबंधित समस्त खगोलीय, पंचांगीय, षड्बल, भावबल, अष्टकवर्ग, षोडशवर्ग, भाव चलित और जैमिनी गणितीय आंकड़े एक ही स्थान पर संकलित हैं।'
            : 'All astronomical, Panchanga, Shadbala, Bhavabala, Ashtakavarga, Shodashavarga, Bhava Chalit, and Jaimini mathematical data gathered in a single dedicated technical view.'}
        </p>
      </div>

      {/* 2. Sub-Nav Pills */}
      <div
        className="card"
        style={{
          padding: '8px 12px',
          background: 'var(--bg-elevated)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flexWrap: 'wrap',
        }}
      >
        {navPills.map((pill) => {
          const isActive = activeTab === pill.id;
          return (
            <button
              key={pill.id}
              type="button"
              className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab(pill.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: isActive ? 700 : 500,
                fontSize: '12.5px',
                padding: '6px 12px',
                borderRadius: '6px',
              }}
            >
              {pill.icon}
              <span>{isHi ? pill.labelHi : pill.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* 3. SUB-TAB 1: PANCHANGA & FOUNDATIONS */}
      {activeTab === 'panchanga' && (
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
            <button
              type="button"
              className={`btn btn-sm ${birthProfileTab === 'panchanga' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setBirthProfileTab('panchanga')}
              style={{ fontWeight: 600, fontSize: '12px' }}
            >
              {isHi ? 'पंच महा-अंग एवं नित्या देवी' : 'Panchanga & Nitya Devi'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${birthProfileTab === 'seasonal' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setBirthProfileTab('seasonal')}
              style={{ fontWeight: 600, fontSize: '12px' }}
            >
              {isHi ? 'कालचक्र, अयन व ऋतु फल' : 'Ayana, Season, Prahar & Hora'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${birthProfileTab === 'navamsha' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setBirthProfileTab('navamsha')}
              style={{ fontWeight: 600, fontSize: '12px' }}
            >
              {isHi ? 'पृथु यशस् - नवांश लग्न व संवेदनशील वर्ष' : 'Prithu Yasas Navamsha & Ages'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${birthProfileTab === 'avakhada' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setBirthProfileTab('avakhada')}
              style={{ fontWeight: 600, fontSize: '12px' }}
            >
              {isHi ? 'अवकहड़ा चक्र व आत्मकारक' : 'Avakhada Chakra & AK'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${birthProfileTab === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setBirthProfileTab('grid')}
              style={{ fontWeight: 600, fontSize: '12px' }}
            >
              {isHi ? 'समस्त २० जन्म कारक तालिका' : 'All 20 Factors Overview'}
            </button>
          </div>

          {birthProfileTab === 'panchanga' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {varaFactor && (
                <div style={{ padding: '12px 14px', borderRadius: '8px', background: 'var(--bg-subtle)', borderLeft: '4px solid #b45309' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>{isHi ? 'वार फलादेश (Day of Week)' : 'Vara Prediction'}</span>
                    <span className="badge" style={{ background: 'rgba(180, 83, 9, 0.12)', color: '#b45309', fontWeight: 650 }}>
                      {isHi ? varaFactor.valueHi : varaFactor.valueEn}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', lineHeight: 1.55 }}>{isHi ? varaFactor.interpretationHi : varaFactor.interpretationEn}</div>
                </div>
              )}
              {tithiDetails && (
                <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-subtle)', borderLeft: '4px solid #7c3aed' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>{isHi ? 'तिथि एवं नित्या देवी' : 'Tithi & Nitya Devi'}</span>
                    <span className="badge" style={{ background: 'rgba(124, 58, 237, 0.12)', color: '#7c3aed', fontWeight: 650 }}>
                      {isHi ? tithiDetails.tithiNameHi : tithiDetails.tithiNameEn} ({isHi ? tithiDetails.categoryHi : tithiDetails.category})
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', lineHeight: 1.55, marginBottom: '8px' }}>
                    {tithiFactor ? (isHi ? tithiFactor.interpretationHi : tithiFactor.interpretationEn) : ''}
                  </div>
                  {tithiDetails.nityaDeviMantra && (
                    <div style={{ padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: '6px', border: '1px solid rgba(124, 58, 237, 0.25)', marginBottom: '6px' }}>
                      <div style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 700 }}>
                        {isHi ? `अधिष्ठात्री नित्या देवी: ${tithiDetails.governingNityaDeviHi}` : `Nitya Devi: ${tithiDetails.governingNityaDeviEn}`}
                      </div>
                      <div style={{ fontSize: '12px', fontStyle: 'italic', fontWeight: 600 }}>"{tithiDetails.nityaDeviMantra}"</div>
                    </div>
                  )}
                </div>
              )}
              {nakshatraFactor && (
                <div style={{ padding: '12px 14px', borderRadius: '8px', background: 'var(--bg-subtle)', borderLeft: '4px solid #0284c7' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>{isHi ? 'जन्म नक्षत्र व चरण' : 'Birth Nakshatra & Pada'}</span>
                    <span className="badge" style={{ background: 'rgba(2, 132, 199, 0.12)', color: '#0284c7', fontWeight: 650 }}>
                      {isHi ? nakshatraFactor.valueHi : nakshatraFactor.valueEn}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', lineHeight: 1.55 }}>{isHi ? nakshatraFactor.interpretationHi : nakshatraFactor.interpretationEn}</div>
                </div>
              )}
            </div>
          )}

          {birthProfileTab === 'seasonal' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
              {deepLife.birthProfile.factors
                .filter((f) => ['season', 'ayana', 'prahar', 'birth-hora'].includes(f.id))
                .map((factor) => (
                  <div key={factor.id} style={{ padding: '12px 14px', borderRadius: '8px', background: 'var(--bg-subtle)', borderLeft: '4px solid var(--accent)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '13.5px' }}>{isHi ? factor.labelHi : factor.labelEn}</span>
                      <span className="badge" style={{ background: 'var(--accent-soft)', color: 'var(--accent)', fontWeight: 650 }}>
                        {isHi ? factor.valueHi : factor.valueEn}
                      </span>
                    </div>
                    <div style={{ fontSize: '12.5px', lineHeight: 1.5 }}>{isHi ? factor.interpretationHi : factor.interpretationEn}</div>
                  </div>
                ))}
            </div>
          )}

          {birthProfileTab === 'navamsha' && navProfile && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px 14px', borderRadius: '8px', background: 'var(--bg-subtle)', borderLeft: '4px solid #b45309' }}>
                <h4 style={{ margin: '0 0 6px', fontSize: '14.5px', fontWeight: 700 }}>
                  {isHi ? `नवांश लग्न: ${navProfile.signNameHi} (${navProfile.signNameEn})` : `Navamsha Lagna: ${navProfile.signNameEn}`}
                </h4>
                <div style={{ fontSize: '13px', lineHeight: 1.55 }}>{isHi ? navProfile.readingHi : navProfile.readingEn}</div>
                <div style={{ fontSize: '12px', marginTop: '6px', color: 'var(--text-muted)' }}>
                  <strong>{isHi ? 'संवेदनशील आयु वर्ष: ' : 'Vulnerable / Milestone Ages: '}</strong>
                  {navProfile.vulnerabilityAges.join(', ')} {isHi ? 'वर्ष' : 'years'}
                </div>
              </div>
            </div>
          )}

          {birthProfileTab === 'avakhada' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '8px' }}>
              {deepLife.birthProfile.factors
                .filter((f) => ['varna', 'vashya', 'yoni', 'gana', 'nadi', 'gotra', 'tatva'].includes(f.id))
                .map((factor) => (
                  <div key={factor.id} style={{ padding: '10px 12px', borderRadius: '7px', background: 'var(--bg-subtle)' }}>
                    <div className="muted" style={{ fontSize: '11px', marginBottom: '2px' }}>{isHi ? factor.labelHi : factor.labelEn}</div>
                    <div style={{ fontSize: '13px', fontWeight: 650 }}>{isHi ? factor.valueHi : factor.valueEn}</div>
                    <div style={{ fontSize: '12px', lineHeight: 1.45, marginTop: '4px' }}>{isHi ? factor.interpretationHi : factor.interpretationEn}</div>
                  </div>
                ))}
            </div>
          )}

          {birthProfileTab === 'grid' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '8px' }}>
              {deepLife.birthProfile.factors.map((factor) => (
                <div key={factor.id} style={{ padding: '9px 11px', borderRadius: '7px', background: 'var(--bg-subtle)' }}>
                  <div className="muted" style={{ fontSize: '11px', marginBottom: '3px' }}>{isHi ? factor.labelHi : factor.labelEn}</div>
                  <div style={{ fontSize: '13px', fontWeight: 650 }}>{isHi ? factor.valueHi : factor.valueEn}</div>
                  <div style={{ fontSize: '12px', lineHeight: 1.45, marginTop: '4px' }}>{isHi ? factor.interpretationHi : factor.interpretationEn}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. SUB-TAB 2: PLANETARY LONGITUDES & AVASTHAS */}
      {activeTab === 'planets' && (
        <div className="card" style={{ padding: '16px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 700 }}>
            {isHi ? 'ग्रह स्थिति, स्पष्ट भोगांश एवं अवस्था तालिका' : 'Planetary Longitudes, Dignities & Avasthas'}
          </h3>
          <div className="table-scroll" style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', fontSize: '12.5px' }}>
              <thead>
                <tr>
                  <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                  <th>{isHi ? 'राशि' : 'Sign'}</th>
                  <th>{isHi ? 'भोगांश' : 'Degrees'}</th>
                  <th>{isHi ? 'नक्षत्र (पद)' : 'Nakshatra (Pada)'}</th>
                  <th>{isHi ? 'नक्षत्र स्वामी' : 'Star Lord'}</th>
                  <th>{isHi ? 'उप-स्वामी' : 'Sub Lord'}</th>
                  <th>{isHi ? 'स्थिति' : 'Dignity'}</th>
                  <th>{isHi ? 'गति' : 'Motion'}</th>
                  <th>{isHi ? 'बाल्यादि अवस्था' : 'Baladi Avastha'}</th>
                </tr>
              </thead>
              <tbody>
                {/* Ascendant Row */}
                <tr style={{ background: 'rgba(217, 119, 6, 0.05)' }}>
                  <td><strong>{isHi ? 'लग्न (Asc)' : 'Ascendant'}</strong></td>
                  <td>{trSign(chart.ascendant.signIndex, lang)}</td>
                  <td className="mono">{chart.ascendant.dms}</td>
                  <td>{chart.ascendant.nakshatraName} ({chart.ascendant.pada})</td>
                  <td>{trPlanet(chart.ascendant.nakshatraLord, lang)}</td>
                  <td>{trPlanet(chart.ascendant.subLord, lang)}</td>
                  <td><span className="badge">{chart.ascendant.isVargottama ? 'वर्गोत्तम' : 'लग्न'}</span></td>
                  <td>{isHi ? 'पूर्व क्षितिज' : 'Horizon'}</td>
                  <td>-</td>
                </tr>
                {/* Nine Planets */}
                {chart.planets.map((p) => {
                  const av = avasthas.avasthas.find((a) => a.planet === p.id);
                  return (
                    <tr key={p.id}>
                      <td><strong>{trPlanet(p.id, lang)}</strong></td>
                      <td>{trSign(p.signIndex, lang)}</td>
                      <td className="mono">{p.dms}</td>
                      <td>{p.nakshatraName} ({p.pada})</td>
                      <td>{trPlanet(p.nakshatraLord, lang)}</td>
                      <td>{trPlanet(p.subLord, lang)}</td>
                      <td>
                        <span className={`badge ${p.dignity === 'Exalted' || p.dignity === 'Own Sign' ? 'badge-good' : p.dignity === 'Debilitated' ? 'badge-bad' : ''}`}>
                          {p.dignity}
                        </span>
                      </td>
                      <td>
                        {p.isRetrograde ? (
                          <span style={{ color: '#dc2626', fontWeight: 700 }}>{isHi ? 'वक्री (R)' : 'Retro'}</span>
                        ) : p.isCombust ? (
                          <span style={{ color: '#b45309', fontWeight: 650 }}>{isHi ? 'अस्त (C)' : 'Combust'}</span>
                        ) : (
                          <span style={{ color: '#16a34a' }}>{isHi ? 'मार्गी (D)' : 'Direct'}</span>
                        )}
                      </td>
                      <td>{av?.baladi || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. SUB-TAB 3: SHADBALA & BHAVABALA MATH */}
      {activeTab === 'shadbala' && (
        <div className="card" style={{ padding: '16px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 700 }}>
            {isHi ? 'षड्बल एवं भावबल विस्तृत गणितीय सारणी' : 'Shadbala & Bhavabala Mathematical Matrix'}
          </h3>

          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--accent)' }}>
            {isHi ? '१. ग्रहों का षड्बल (Shadbala Breakdown in Rupas & Virupas)' : '1. Planetary Shadbala Breakdown'}
          </div>
          <div className="table-scroll" style={{ overflowX: 'auto', marginBottom: '20px' }}>
            <table className="data-table" style={{ width: '100%', fontSize: '12px' }}>
              <thead>
                <tr>
                  <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                  <th>{isHi ? 'स्थान बल' : 'Sthana'}</th>
                  <th>{isHi ? 'दिग् बल' : 'Dig'}</th>
                  <th>{isHi ? 'काल बल' : 'Kala'}</th>
                  <th>{isHi ? 'चेष्टा बल' : 'Cheshta'}</th>
                  <th>{isHi ? 'नैसर्गिक' : 'Naisargika'}</th>
                  <th>{isHi ? 'दृग् बल' : 'Drik'}</th>
                  <th>{isHi ? 'कुल विरूपा' : 'Total Virupas'}</th>
                  <th>{isHi ? 'कुल रूप' : 'Total Rupas'}</th>
                  <th>{isHi ? 'अनुपात' : 'Ratio'}</th>
                </tr>
              </thead>
              <tbody>
                {chart.shadbala.map((row) => (
                  <tr key={row.planet}>
                    <td><strong>{trPlanet(row.planet, lang)}</strong></td>
                    <td>{row.sthanaBala.toFixed(1)}</td>
                    <td>{row.digBala.toFixed(1)}</td>
                    <td>{row.kalaBala.toFixed(1)}</td>
                    <td>{row.cheshtaBala.toFixed(1)}</td>
                    <td>{row.naisargikaBala.toFixed(1)}</td>
                    <td>{row.drikBala.toFixed(1)}</td>
                    <td className="mono">{row.totalVirupas.toFixed(1)}</td>
                    <td className="mono"><strong>{row.totalRupas.toFixed(2)}</strong></td>
                    <td>
                      <span className={`badge ${row.ratio >= 1.0 ? 'badge-good' : 'badge-bad'}`}>
                        {(row.ratio * 100).toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--accent)' }}>
            {isHi ? '२. द्वादश भावबल तालिका (Bhavabala Scores in Rupas)' : '2. Bhavabala Scores for 12 Houses'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '8px' }}>
            {bhavabala.houses.map((bh) => (
              <div key={bh.house} style={{ padding: '10px 12px', borderRadius: '6px', background: 'var(--bg-subtle)', borderLeft: '3px solid var(--accent)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{isHi ? `${bh.house}वां भाव (${bh.signName})` : `House ${bh.house} (${bh.signName})`}</div>
                <div style={{ fontSize: '15px', fontWeight: 800, margin: '2px 0' }}>{bh.totalRupas.toFixed(2)} <span style={{ fontSize: '11px', fontWeight: 500 }}>Rupas</span></div>
                <div style={{ fontSize: '11px' }}>{isHi ? `अधिपति: ${trPlanet(bh.lord, lang)}` : `Lord: ${trPlanet(bh.lord, lang)}`}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. SUB-TAB 4: ASHTAKAVARGA SAV 337 */}
      {activeTab === 'ashtakavarga' && (
        <div className="card" style={{ padding: '16px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 700 }}>
            {isHi ? 'सर्वाष्टकवर्ग (SAV 337) एवं भिन्नाष्टकवर्ग (BAV) सारणी' : 'Sarvashtakavarga & Bhinnashtakavarga Tables'}
          </h3>

          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--accent)' }}>
            {isHi ? '१. १२ राशियों में सर्वाष्टकवर्ग बिंदु (SAV Distribution)' : '1. Sarvashtakavarga Bindus across 12 Signs'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(85px, 1fr))', gap: '8px', marginBottom: '20px' }}>
            {SIGNS.map((sign, sIdx) => {
              const bindus = chart.ashtakavarga.sarva[sIdx];
              return (
                <div key={sign.name} style={{ padding: '10px 8px', textAlign: 'center', borderRadius: '6px', background: 'var(--bg-subtle)', borderTop: `3px solid ${bindus >= 28 ? '#16a34a' : '#dc2626'}` }}>
                  <div style={{ fontSize: '11px', fontWeight: 650 }}>{trSign(sIdx, lang)}</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, margin: '4px 0', color: bindus >= 28 ? '#16a34a' : '#dc2626' }}>{bindus}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{bindus >= 28 ? (isHi ? 'सबल' : 'Strong') : (isHi ? 'कम' : 'Low')}</div>
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--accent)' }}>
            {isHi ? '२. भिन्नाष्टकवर्ग (BAV) सारणी (७ ग्रह x १२ राशियाँ)' : '2. Bhinnashtakavarga Matrix'}
          </div>
          <div className="table-scroll" style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', fontSize: '12px', textAlign: 'center' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>{isHi ? 'ग्रह' : 'Planet'}</th>
                  {SIGNS.map((s, idx) => (
                    <th key={s.name}>{trSign(idx, lang).slice(0, 3)}</th>
                  ))}
                  <th>{isHi ? 'योग' : 'Total'}</th>
                </tr>
              </thead>
              <tbody>
                {SEVEN_PLANETS.map((pl) => {
                  const row = chart.ashtakavarga.bhinna[pl] || [];
                  const sum = row.reduce((a, b) => a + b, 0);
                  return (
                    <tr key={pl}>
                      <td style={{ textAlign: 'left' }}><strong>{trPlanet(pl, lang)}</strong></td>
                      {row.map((b, bIdx) => (
                        <td key={bIdx} style={{ fontWeight: b >= 4 ? 700 : 400, color: b >= 4 ? '#16a34a' : 'inherit' }}>
                          {b}
                        </td>
                      ))}
                      <td className="mono"><strong>{sum}</strong></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. SUB-TAB 5: SHODASHAVARGAS (D1–D60) */}
      {activeTab === 'vargas' && (
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
              {isHi ? 'षोडशवर्ग एवं सूक्ष्म वर्ग निर्देशांक तालिका' : 'Shodashavargas & Micro-Varga Coordinates'}
            </h3>
            <select
              className="select-compact"
              value={selectedVarga}
              onChange={(e) => setSelectedVarga(e.target.value as DivisionalChartId)}
              style={{ fontWeight: 650 }}
            >
              {DIVISIONAL_META.map((vm) => (
                <option key={vm.id} value={vm.id}>
                  {vm.id}: {vm.name} ({vm.sanskritName})
                </option>
              ))}
            </select>
          </div>

          {chart.divisionalCharts[selectedVarga] && (
            <div className="table-scroll" style={{ overflowX: 'auto' }}>
              <table className="data-table" style={{ width: '100%', fontSize: '12.5px' }}>
                <thead>
                  <tr>
                    <th>{isHi ? 'ग्रह / लग्न' : 'Body'}</th>
                    <th>{isHi ? `${selectedVarga} राशि` : `${selectedVarga} Sign`}</th>
                    <th>{isHi ? 'राशि स्वामी' : 'Sign Lord'}</th>
                    <th>{isHi ? 'स्थिति / अवस्था' : 'Dignity'}</th>
                    <th>{isHi ? 'वर्गोत्तम / पुष्कर' : 'Special Amsa'}</th>
                  </tr>
                </thead>
                <tbody>
                  {chart.divisionalCharts[selectedVarga].placements.map((pl) => (
                    <tr key={pl.id}>
                      <td><strong>{trPlanet(pl.id, lang)}</strong></td>
                      <td>{trSign(pl.signIndex, lang)}</td>
                      <td>{trPlanet(SIGNS[pl.signIndex].lord, lang)}</td>
                      <td>
                        <span className={`badge ${pl.dignity === 'Exalted' || pl.dignity === 'Own Sign' ? 'badge-good' : pl.dignity === 'Debilitated' ? 'badge-bad' : ''}`}>
                          {pl.dignity}
                        </span>
                      </td>
                      <td>
                        {pl.id === 'Asc' && chart.ascendant.isVargottama ? (
                          <span className="badge badge-accent">वर्गोत्तम</span>
                        ) : chart.planets.find((p) => p.id === pl.id)?.isVargottama ? (
                          <span className="badge badge-accent">वर्गोत्तम</span>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 8. SUB-TAB 6: BHAVA CHALIT & CUSPS */}
      {activeTab === 'chalit' && (
        <div className="card" style={{ padding: '16px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 700 }}>
            {isHi ? 'भाव चलित सारणी एवं कस्पल विस्थापन (श्रीपति पद्धति)' : 'Bhava Chalit Placements & Sripati Cusps'}
          </h3>

          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--accent)' }}>
            {isHi ? '१. राशि भाव बनाम चलित भाव विस्थापन तालिका' : '1. Rasi House vs Chalit House Shift'}
          </div>
          <div className="table-scroll" style={{ overflowX: 'auto', marginBottom: '20px' }}>
            <table className="data-table" style={{ width: '100%', fontSize: '12.5px' }}>
              <thead>
                <tr>
                  <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                  <th>{isHi ? 'राशि भाव (D1)' : 'Rasi House'}</th>
                  <th>{isHi ? 'चलित भाव (Sripati)' : 'Chalit House'}</th>
                  <th>{isHi ? 'विस्थापन स्थिति' : 'Shift Status'}</th>
                </tr>
              </thead>
              <tbody>
                {chalit.placements.map((pl) => (
                  <tr key={pl.id}>
                    <td><strong>{trPlanet(pl.id, lang)}</strong></td>
                    <td>{pl.rasiHouse}</td>
                    <td><strong>{pl.chalitHouse}</strong></td>
                    <td>
                      {pl.shifted ? (
                        <span className="badge badge-warn">
                          {isHi ? `H${pl.rasiHouse} से H${pl.chalitHouse} में विस्थापन` : `Shifted H${pl.rasiHouse} → H${pl.chalitHouse}`}
                        </span>
                      ) : (
                        <span className="badge badge-subtle">{isHi ? 'स्थिर (कोई विस्थापन नहीं)' : 'No Shift'}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--accent)' }}>
            {isHi ? '२. १२ भावों के मध्य (कस्प) व संधि बिंदु' : '2. 12 House Cusps & Boundaries'}
          </div>
          <div className="table-scroll" style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', fontSize: '12px' }}>
              <thead>
                <tr>
                  <th>{isHi ? 'भाव' : 'Bhava'}</th>
                  <th>{isHi ? 'भाव राशि' : 'Sign'}</th>
                  <th>{isHi ? 'भाव मध्य (कस्प)' : 'Bhava Cusp'}</th>
                  <th>{isHi ? 'भाव संधि आरंभ' : 'Sandhi Start'}</th>
                </tr>
              </thead>
              <tbody>
                {chart.houses.map((h) => (
                  <tr key={h.house}>
                    <td><strong>{h.house}</strong></td>
                    <td>{trSign(h.signIndex, lang)}</td>
                    <td className="mono" style={{ fontWeight: 700, color: 'var(--accent)' }}>{h.dms}</td>
                    <td className="mono">{formatDms(h.start)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 9. SUB-TAB 7: JAIMINI CHARA KARAKAS & ARUDHAS */}
      {activeTab === 'jaimini' && (
        <div className="card" style={{ padding: '16px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 700 }}>
            {isHi ? 'जैमिनी चर कारक एवं आरूढ़ पद गणित' : 'Jaimini Chara Karakas & Arudha Pada Mathematics'}
          </h3>

          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--accent)' }}>
            {isHi ? '१. जैमिनी चर कारक तालिका (८ कारक सिद्धांत)' : '1. Jaimini 8 Chara Karakas (Degree Order)'}
          </div>
          <div className="table-scroll" style={{ overflowX: 'auto', marginBottom: '20px' }}>
            <table className="data-table" style={{ width: '100%', fontSize: '12.5px' }}>
              <thead>
                <tr>
                  <th>{isHi ? 'चर कारक' : 'Chara Karaka'}</th>
                  <th>{isHi ? 'संक्षिप्त' : 'Code'}</th>
                  <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                  <th>{isHi ? 'राशि एवं अंश' : 'Sign & Degree'}</th>
                  <th>{isHi ? 'शास्त्रीय अधिकार' : 'Shastric Portfolio'}</th>
                </tr>
              </thead>
              <tbody>
                {chart.planets
                  .filter((p) => p.charaKaraka)
                  .sort((a, b) => b.degreeInSign - a.degreeInSign)
                  .map((p) => (
                    <tr key={p.id}>
                      <td>
                        <strong>
                          {p.charaKaraka === 'AK' ? (isHi ? 'आत्मकारक (राजा)' : 'Atmakaraka (King)') :
                           p.charaKaraka === 'AmK' ? (isHi ? 'अमात्यकारक (मंत्री)' : 'Amatyakaraka (Minister)') :
                           p.charaKaraka === 'BK' ? (isHi ? 'भ्रातृकारक (बंधु)' : 'Bhratrikaraka (Siblings)') :
                           p.charaKaraka === 'MK' ? (isHi ? 'मातृकारक (माता)' : 'Matrikaraka (Mother)') :
                           p.charaKaraka === 'PiK' ? (isHi ? 'पितृकारक (पिता)' : 'Pitrikaraka (Father)') :
                           p.charaKaraka === 'PK' ? (isHi ? 'पुत्रकारक (संतान)' : 'Putrakaraka (Children)') :
                           p.charaKaraka === 'GK' ? (isHi ? 'ज्ञाति कारक (संबंधी/प्रतिद्वंद्वी)' : 'Gnatikaraka (Rivals)') :
                           (isHi ? 'दाराकारक (जीवनसाथी)' : 'Darakaraka (Spouse)')}
                        </strong>
                      </td>
                      <td><span className="badge badge-accent">{p.charaKaraka}</span></td>
                      <td><strong>{trPlanet(p.id, lang)}</strong></td>
                      <td className="mono">{trSign(p.signIndex, lang)} {p.dms}</td>
                      <td>
                        {p.charaKaraka === 'AK' ? (isHi ? 'आत्मा की दिशा, प्रारब्ध कर्म व मोक्ष' : 'Soul destiny & liberation') :
                         p.charaKaraka === 'AmK' ? (isHi ? 'करियर, आजीविका, प्रतिष्ठा व धनोपार्जन' : 'Career, status & intellect') :
                         p.charaKaraka === 'BK' ? (isHi ? 'साहस, पराक्रम, गुरु व सहोदर' : 'Siblings & advisory council') :
                         p.charaKaraka === 'MK' ? (isHi ? 'माता, वाहन, सुख व मानसिक शांति' : 'Mother, emotional peace & assets') :
                         p.charaKaraka === 'PK' ? (isHi ? 'बुद्धि, उच्च विद्या, मंत्र सिद्धि व संतान' : 'Progeny, intellect & mantras') :
                         p.charaKaraka === 'GK' ? (isHi ? 'रोग, ऋण, शत्रु, बाधाएं व संघर्ष' : 'Obstacles, debts & competitors') :
                         (isHi ? 'विवाह, दांपत्य, साझेदारी व व्यापार' : 'Spouse, marriage & trade')}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--accent)' }}>
            {isHi ? '२. द्वादश आरूढ़ पद (Arudha Padas - A1 से A12)' : '2. 12 Bhava Arudha Padas'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => {
              const lordPlanet = SIGNS[(chart.ascendant.signIndex + h - 1) % 12].lord;
              const lordPos = chart.planets.find((p) => p.id === lordPlanet) || chart.ascendant;
              const lordSign = lordPos.signIndex;
              const dist = (lordSign - ((chart.ascendant.signIndex + h - 1) % 12) + 12) % 12;
              let arudhaSign = (lordSign + dist) % 12;
              if (arudhaSign === (chart.ascendant.signIndex + h - 1) % 12) {
                arudhaSign = (arudhaSign + 9) % 12;
              } else if (arudhaSign === ((chart.ascendant.signIndex + h - 1 + 6) % 12)) {
                arudhaSign = (arudhaSign + 9) % 12;
              }
              return (
                <div key={h} style={{ padding: '10px 12px', borderRadius: '6px', background: 'var(--bg-subtle)', borderLeft: '3px solid #7c3aed' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {h === 1 ? (isHi ? 'आरूढ़ लग्न (AL)' : 'Arudha Lagna (AL)') :
                     h === 7 ? (isHi ? 'दारापद (A7)' : 'Dara Pada (A7)') :
                     h === 12 ? (isHi ? 'उपपद लग्न (UL / A12)' : 'Upapada (UL / A12)') :
                     `A${h} पद`}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
                    {trSign(arudhaSign, lang)}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {isHi ? `स्वामी: ${trPlanet(SIGNS[arudhaSign].lord, lang)}` : `Lord: ${trPlanet(SIGNS[arudhaSign].lord, lang)}`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 8. Tab: Dasha Mathematics & Balance of Dasha */}
      {activeTab === 'dashaMath' && (
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                {isHi ? 'विंशोत्तरी दशा गणितीय कालखंड व जन्म समय शेष दशा' : 'Vimshottari Dasha Mathematical Epoch & Balance at Birth'}
              </h2>
              <p className="muted small-text" style={{ margin: '4px 0 0' }}>
                {isHi
                  ? 'जन्म समय चंद्र नक्षत्र भोगांश, भुक्त-भोग्य दशा गणित एवं १२०-वर्षीय महादशा-अंतर्दशा कालखंड'
                  : 'Birth Moon Nakshatra arc, proportional elapsed/remaining balance, and 120-year Vimshottari epoch math'}
              </p>
            </div>
            <span className="badge badge-accent">
              {isHi ? '१२०-वर्षीय विंशोत्तरी चक्र' : '120-Year Vimshottari Cycle'}
            </span>
          </div>

          {/* Balance at Birth Card */}
          {birthDashaBalance && (
            <div
              style={{
                padding: '12px 16px',
                background: 'rgba(217, 119, 6, 0.08)',
                borderLeft: '4px solid var(--accent, #d97706)',
                borderRadius: '8px',
                marginBottom: '16px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--accent, #d97706)', fontWeight: 700 }}>
                  {isHi ? 'जन्म समय शेष महादशा (Balance of Dasha at Birth)' : 'Balance of Dasha at Birth'}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text)', marginTop: '2px' }}>
                  {trPlanet(birthDashaBalance.lord, lang)} {isHi ? 'महादशा शेष:' : 'Mahadasha Balance:'}{' '}
                  <span style={{ color: 'var(--accent, #d97706)' }}>
                    {birthDashaBalance.years} {isHi ? 'वर्ष' : 'Y'}, {birthDashaBalance.months} {isHi ? 'माह' : 'M'}, {birthDashaBalance.days} {isHi ? 'दिन' : 'D'}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {isHi
                    ? `जन्म चंद्र नक्षत्र: ${chart.panchang?.nakshatra?.name || '—'} (पाद ${chart.panchang?.nakshatra?.pada || '—'}) · कुल शेष दिन: ${birthDashaBalance.totalRemainingDays} दिन`
                    : `Birth Moon Nakshatra: ${chart.panchang?.nakshatra?.name || '—'} (Pada ${chart.panchang?.nakshatra?.pada || '—'}) · Total Remaining: ${birthDashaBalance.totalRemainingDays} days`}
                </div>
              </div>
              <div style={{ fontSize: '12px', background: 'var(--bg-elevated)', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                <strong>{isHi ? 'गणितीय सूत्र:' : 'Formula:'}</strong> {isHi ? 'भोग्य अंश / १३°२०\' × ग्रह के पूर्ण वर्ष' : 'Remaining Arc / 13°20\' × Planet Years'}
              </div>
            </div>
          )}

          {/* Master 9 Mahadashas Table */}
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--accent)' }}>
            {isHi ? '१. समस्त ९ विंशोत्तरी महादशाओं की गणितीय सारणी (१२० वर्ष)' : '1. All 9 Vimshottari Mahadasha Timeline Table (120 Years)'}
          </div>
          <div className="table-scroll" style={{ marginBottom: '18px' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{isHi ? 'महादशा स्वामी' : 'Mahadasha Lord'}</th>
                  <th>{isHi ? 'अवधि' : 'Years'}</th>
                  <th>{isHi ? 'आरंभ तिथि' : 'Start Date'}</th>
                  <th>{isHi ? 'समाप्ति तिथि' : 'End Date'}</th>
                  <th>{isHi ? 'आयु वर्ग' : 'Age Span'}</th>
                  <th>{isHi ? 'वर्तमान स्थिति' : 'Status'}</th>
                </tr>
              </thead>
              <tbody>
                {chart.vimshottari.map((md, idx) => {
                  const now = Date.now();
                  const isPast = now >= md.endMs;
                  const isCurrent = now >= md.startMs && now < md.endMs;
                  const birthYr = Number((chart.input.date || '2000-01-01').split('-')[0]) || 2000;
                  const startYr = new Date(md.startMs).getUTCFullYear();
                  const endYr = new Date(md.endMs).getUTCFullYear();
                  const ageStart = Math.max(0, startYr - birthYr);
                  const ageEnd = Math.max(0, endYr - birthYr);
                  const startStr = formatDateDmy(formatLocalDateTimeFromUtc(md.startMs, chart.offsetMinutesUsed).slice(0, 10));
                  const endStr = formatDateDmy(formatLocalDateTimeFromUtc(md.endMs, chart.offsetMinutesUsed).slice(0, 10));

                  return (
                    <tr key={idx} style={isCurrent ? { background: 'rgba(217, 119, 6, 0.08)', fontWeight: 600 } : undefined}>
                      <td className="mono">{idx + 1}</td>
                      <td>
                        <strong>{trPlanet(md.lord, lang)}</strong>
                      </td>
                      <td className="mono">{Math.round((md.endMs - md.startMs) / (1000 * 60 * 60 * 24 * 365.25))} {isHi ? 'वर्ष' : 'yrs'}</td>
                      <td className="mono">{startStr}</td>
                      <td className="mono">{endStr}</td>
                      <td className="mono">{ageStart} – {ageEnd} {isHi ? 'वर्ष' : 'yrs'}</td>
                      <td>
                        {isCurrent ? (
                          <span className="badge badge-accent">{isHi ? 'सक्रिय (Active)' : 'Active'}</span>
                        ) : isPast ? (
                          <span className="badge badge-subtle">{isHi ? 'व्यतीत (Passed)' : 'Passed'}</span>
                        ) : (
                          <span className="badge badge-outline">{isHi ? 'आगामी (Upcoming)' : 'Upcoming'}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Running Mahadasha Antardashas Table */}
          {activeDasha.md && activeDasha.adList.length > 0 && (
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--accent)' }}>
                {isHi
                  ? `२. वर्तमान सक्रिय महादशा (${trPlanet(activeDasha.md.lord, lang)}) के सभी ९ अंतर्दशाओं का गणित`
                  : `2. All 9 Antardashas for Active Mahadasha (${activeDasha.md.lord})`}
              </div>
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>{isHi ? 'अंतर्दशा स्वामी' : 'Antardasha Lord'}</th>
                      <th>{isHi ? 'आरंभ तिथि' : 'Start Date'}</th>
                      <th>{isHi ? 'समाप्ति तिथि' : 'End Date'}</th>
                      <th>{isHi ? 'कुल दिन' : 'Duration'}</th>
                      <th>{isHi ? 'स्थिति' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeDasha.adList.map((ad, adIdx) => {
                      const now = Date.now();
                      const isPast = now >= ad.endMs;
                      const isCurrent = now >= ad.startMs && now < ad.endMs;
                      const sStr = formatDateDmy(formatLocalDateTimeFromUtc(ad.startMs, chart.offsetMinutesUsed).slice(0, 10));
                      const eStr = formatDateDmy(formatLocalDateTimeFromUtc(ad.endMs, chart.offsetMinutesUsed).slice(0, 10));
                      const days = Math.round((ad.endMs - ad.startMs) / (1000 * 60 * 60 * 24));

                      return (
                        <tr key={adIdx} style={isCurrent ? { background: 'rgba(217, 119, 6, 0.1)', fontWeight: 700 } : undefined}>
                          <td className="mono">{adIdx + 1}</td>
                          <td>
                            <strong>{trPlanet(ad.lord, lang)}</strong>
                          </td>
                          <td className="mono">{sStr}</td>
                          <td className="mono">{eStr}</td>
                          <td className="mono">{days} {isHi ? 'दिन' : 'days'}</td>
                          <td>
                            {isCurrent ? (
                              <span className="badge badge-accent">{isHi ? 'वर्तमान सक्रिय' : 'Active Now'}</span>
                            ) : isPast ? (
                              <span className="badge badge-subtle">{isHi ? 'व्यतीत' : 'Passed'}</span>
                            ) : (
                              <span className="badge badge-outline">{isHi ? 'आगामी' : 'Upcoming'}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 9. Tab: Gochar Ephemeris & Kakshya Mathematics */}
      {activeTab === 'gocharMath' && (
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                {isHi ? 'तात्कालिक गोचर ग्रह स्थिति व अष्टकवर्ग कक्ष्या गणित' : 'Transit Ephemeris Coordinates & Ashtakavarga Kakshya Mathematics'}
              </h2>
              <p className="muted small-text" style={{ margin: '4px 0 0' }}>
                {isHi
                  ? 'वर्तमान गोचर स्थिति, अष्टकवर्ग बिंदु, ८-कक्ष्या विस्थापन (३°४५\' प्रति कक्ष्या) एवं प्रस्ताराष्टकवर्ग बिंदु फलन'
                  : 'Transit planetary positions, Sarvashtakavarga bindus, 8-fold Kakshya subdivisions (3°45\' each) and Prastara bindu triggers'}
              </p>
            </div>
            <span className="badge badge-accent">
              {isHi ? 'कक्ष्या सूक्ष्म गोचर' : 'Kakshya Micro-Transit'}
            </span>
          </div>

          {/* Transit Positions & SAV Table */}
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--accent)' }}>
            {isHi ? '१. गोचर ग्रह स्थिति एवं सर्वाष्टकवर्ग (SAV) बिंदु' : '1. Transit Planetary Coordinates & SAV Bindus'}
          </div>
          <div className="table-scroll" style={{ marginBottom: '18px' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                  <th>{isHi ? 'गोचर राशि' : 'Transit Sign'}</th>
                  <th>{isHi ? 'भोगांश (DMS)' : 'Degree in Sign'}</th>
                  <th>{isHi ? 'नक्षत्र व चरण' : 'Nakshatra & Pada'}</th>
                  <th>{isHi ? 'गति' : 'Motion'}</th>
                  <th>{isHi ? 'SAV बिंदु' : 'SAV Bindus'}</th>
                  <th>{isHi ? 'गोचर फल सामर्थ्य' : 'Transit Strength'}</th>
                </tr>
              </thead>
              <tbody>
                {chart.planets
                  .filter((p) => p.id !== 'Asc')
                  .map((p) => {
                    const sav = chart.ashtakavarga?.sarva?.[p.signIndex] ?? 28;
                    const isHigh = sav >= 30;
                    const isLow = sav <= 24;

                    return (
                      <tr key={p.id}>
                        <td><strong>{trPlanet(p.id, lang)}</strong></td>
                        <td>{trSign(p.signIndex, lang)}</td>
                        <td className="mono">{p.dms}</td>
                        <td>{p.nakshatraName} ({p.pada})</td>
                        <td>
                          {p.isRetrograde ? (
                            <span className="badge badge-warn">{isHi ? 'वक्री (R)' : 'Retro (R)'}</span>
                          ) : (
                            <span className="badge badge-subtle">{isHi ? 'मार्गी (D)' : 'Direct (D)'}</span>
                          )}
                        </td>
                        <td className="mono">
                          <strong style={{ color: isHigh ? '#16a34a' : isLow ? '#dc2626' : 'var(--text)' }}>
                            {sav}
                          </strong> / 56
                        </td>
                        <td>
                          {isHigh ? (
                            <span className="badge badge-good">{isHi ? 'अत्यंत बलवान (शुभ)' : 'Strong (Auspicious)'}</span>
                          ) : isLow ? (
                            <span className="badge badge-warn">{isHi ? 'न्यून बल (सावधानी)' : 'Low Bindus (Caution)'}</span>
                          ) : (
                            <span className="badge badge-subtle">{isHi ? 'मध्यम संतुलित' : 'Moderate'}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* 8-Kakshya Status Table */}
          {kakshyaReport && kakshyaReport.transitKakshyaStatuses.length > 0 && (
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--accent)' }}>
                {isHi ? '२. अष्टकवर्ग ८-कक्ष्या विस्थापन सारणी (३°४५\' प्रति कक्ष्या)' : '2. 8-Fold Kakshya Subdivision Table (3°45\' per Kakshya)'}
              </div>
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                      <th>{isHi ? 'गोचर राशि' : 'Transit Sign'}</th>
                      <th>{isHi ? 'अंश' : 'Degree'}</th>
                      <th>{isHi ? 'कक्ष्या स्वामी' : 'Kakshya Lord'}</th>
                      <th>{isHi ? 'प्रस्तार बिंदु' : 'Prastara Bindu'}</th>
                      <th>{isHi ? 'फलन स्थिति' : 'Trigger Status'}</th>
                      <th>{isHi ? 'मार्गदर्शन' : 'Guidance'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kakshyaReport.transitKakshyaStatuses.map((st, sIdx) => (
                      <tr key={sIdx}>
                        <td><strong>{isHi ? st.planetHi : st.planet}</strong></td>
                        <td>{isHi ? st.transitingSignHi : st.transitingSign}</td>
                        <td className="mono">{st.degreeInSign.toFixed(2)}°</td>
                        <td><strong>{isHi ? st.kakshyaLordHi : st.kakshyaLord}</strong></td>
                        <td className="mono">
                          <span className={st.hasBindu ? 'badge badge-good' : 'badge badge-warn'}>
                            {st.hasBindu ? '1 Bindu' : '0 Bindu'}
                          </span>
                        </td>
                        <td>
                          <span className={st.hasBindu ? 'badge badge-good' : 'badge badge-outline'}>
                            {isHi ? st.triggerStatusHi : st.triggerStatusEn}
                          </span>
                        </td>
                        <td className="wrap-cell" style={{ fontSize: '12px' }}>
                          {isHi ? st.actionGuidanceHi : st.actionGuidanceEn}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 10. Tab: Drishti (Aspect) Matrix & Virupas Math */}
      {activeTab === 'drishtiMath' && (
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                {isHi ? 'संपूर्ण ग्रह दृष्टि सारणी एवं दृष्टि बल मान (Virupas Math)' : 'Full Planetary Aspect Matrix & Aspect Virupas Math'}
              </h2>
              <p className="muted small-text" style={{ margin: '4px 0 0' }}>
                {isHi
                  ? 'समसप्तक (७वीं), विशेष दृष्टियां (मंगल ४/८, गुरु ५/९, शनि ३/१०), दृष्टि वीरुपा शक्ति एवं जैमिनी राशि दृष्टियां'
                  : 'Full 7th aspects, special planetary aspects (Mars 4/8, Jupiter 5/9, Saturn 3/10), aspect virupas and Jaimini rashi aspects'}
              </p>
            </div>
            <span className="badge badge-accent">
              {isHi ? '६० वीरुपा पूर्ण दृष्टि' : '60 Virupa Full Aspect'}
            </span>
          </div>

          {/* Aspect Matrix Table */}
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--accent)' }}>
            {isHi ? '१. कुंडली में सक्रिय ग्रह दृष्टियां एवं वीरुपा बल' : '1. Computed Planetary Aspects & Virupa Strength'}
          </div>
          <div className="table-scroll" style={{ marginBottom: '18px' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{isHi ? 'दृष्टिदाता ग्रह' : 'Aspecting Planet'}</th>
                  <th>{isHi ? 'दृष्टि प्राप्त ग्रह / भाव' : 'Aspected Body / House'}</th>
                  <th>{isHi ? 'दृष्टि का प्रकार' : 'Aspect Type'}</th>
                  <th>{isHi ? 'अंशात्मक दूरी' : 'Orb Degree'}</th>
                  <th>{isHi ? 'दृष्टि वीरुपा' : 'Aspect Virupa'}</th>
                  <th>{isHi ? 'दृष्टि बल %' : 'Strength %'}</th>
                </tr>
              </thead>
              <tbody>
                {chart.aspects && chart.aspects.length > 0 ? (
                  chart.aspects.map((asp, aIdx) => (
                    <tr key={aIdx}>
                      <td className="mono">{aIdx + 1}</td>
                      <td><strong>{trPlanet(asp.from, lang)}</strong></td>
                      <td><strong>{asp.to === 'Asc' ? (isHi ? 'लग्न' : 'Ascendant') : trPlanet(asp.to, lang)}</strong></td>
                      <td><span className="badge badge-subtle">{asp.type}</span></td>
                      <td className="mono">{asp.orbDeg.toFixed(2)}°</td>
                      <td className="mono">{Math.round((asp.strengthPercent * 60) / 100)} / 60 वीरुपा</td>
                      <td>
                        <span className={`badge ${asp.strengthPercent >= 80 ? 'badge-good' : asp.strengthPercent >= 50 ? 'badge-accent' : 'badge-outline'}`}>
                          {asp.strengthPercent}%
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      {isHi ? 'दृष्टि आंकड़े संकलित किए जा रहे हैं।' : 'Aspect data compiled.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Jaimini Rashi Drishti Table */}
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--accent)' }}>
            {isHi ? '२. जैमिनी राशि दृष्टि नियम व सारणी (Rashi Drishti)' : '2. Jaimini Rashi Drishti Rules & Matrix'}
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isHi ? 'राशि वर्ग' : 'Sign Category'}</th>
                  <th>{isHi ? 'राशियां' : 'Signs'}</th>
                  <th>{isHi ? 'दृष्टि नियम' : 'Aspect Rule'}</th>
                  <th>{isHi ? 'दृष्टि प्राप्त राशियां' : 'Aspected Signs'}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>{isHi ? 'चर राशियां (Movable)' : 'Chara (Movable)'}</strong></td>
                  <td>{isHi ? 'मेष, कर्क, तुला, मकर' : 'Aries, Cancer, Libra, Capricorn'}</td>
                  <td>{isHi ? 'समीपवर्ती को छोड़कर सभी स्थिर राशियों पर पूर्ण दृष्टि' : 'Aspects all Fixed signs except the adjacent one'}</td>
                  <td>{isHi ? 'सिंह, वृश्चिक, कुंभ (मेष हेतु)' : 'Leo, Scorpio, Aquarius (for Aries)'}</td>
                </tr>
                <tr>
                  <td><strong>{isHi ? 'स्थिर राशियां (Fixed)' : 'Sthira (Fixed)'}</strong></td>
                  <td>{isHi ? 'वृषभ, सिंह, वृश्चिक, कुंभ' : 'Taurus, Leo, Scorpio, Aquarius'}</td>
                  <td>{isHi ? 'समीपवर्ती को छोड़कर सभी चर राशियों पर पूर्ण दृष्टि' : 'Aspects all Movable signs except the adjacent one'}</td>
                  <td>{isHi ? 'कर्क, तुला, मकर (वृषभ हेतु)' : 'Cancer, Libra, Capricorn (for Taurus)'}</td>
                </tr>
                <tr>
                  <td><strong>{isHi ? 'द्विस्वभाव राशियां (Dual)' : 'Dwiswabhava (Dual)'}</strong></td>
                  <td>{isHi ? 'मिथुन, कन्या, धनु, मीन' : 'Gemini, Virgo, Sagittarius, Pisces'}</td>
                  <td>{isHi ? 'स्वयं को छोड़कर अन्य तीनों द्विस्वभाव राशियों पर दृष्टि' : 'Aspects all other three Dual signs'}</td>
                  <td>{isHi ? 'कन्या, धनु, मीन (मिथुन हेतु)' : 'Virgo, Sagittarius, Pisces (for Gemini)'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 11. Tab: Yuti (Conjunction) Orbs & Combustion Math */}
      {activeTab === 'yutiMath' && (
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                {isHi ? 'ग्रह युति गणित, अंशात्मक निकटता एवं अस्त (Combustion) तालिका' : 'Conjunction Orbs, Angular Proximity & Combustion Mathematics'}
              </h2>
              <p className="muted small-text" style={{ margin: '4px 0 0' }}>
                {isHi
                  ? 'एक ही भाव में युत ग्रहों की कोणीय दूरी, सघनता वर्गीकरण, सूर्य से कोणीय अंतर एवं अस्त सीमा'
                  : 'Multi-planet conjunction clusters, exact angular orbs, proximity classification, and combustion limits from Sun'}
              </p>
            </div>
            <span className="badge badge-accent">
              {isHi ? 'सटीक अंशात्मक युति' : 'Exact Angular Orbs'}
            </span>
          </div>

          {/* Conjunction Groups Table */}
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--accent)' }}>
            {isHi ? '१. कुंडली में सक्रिय ग्रह युति समूह एवं अंशात्मक फैलाव' : '1. Natal Planetary Conjunction Clusters'}
          </div>
          <div className="table-scroll" style={{ marginBottom: '18px' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{isHi ? 'भाव व राशि' : 'House & Sign'}</th>
                  <th>{isHi ? 'युत ग्रह' : 'Conjoined Planets'}</th>
                  <th>{isHi ? 'अंशात्मक फैलाव (Orb)' : 'Orb Spread'}</th>
                  <th>{isHi ? 'सघनता' : 'Proximity'}</th>
                  <th>{isHi ? 'प्रकृति' : 'Nature'}</th>
                </tr>
              </thead>
              <tbody>
                {yutiReport && yutiReport.groups.length > 0 ? (
                  yutiReport.groups.map((grp, gIdx) => (
                    <tr key={gIdx}>
                      <td className="mono">{gIdx + 1}</td>
                      <td><strong>भाव {grp.houseNumber} ({isHi ? grp.signNameHi : grp.signNameEn})</strong></td>
                      <td>
                        <strong>
                          {grp.planets.map((pId) => trPlanet(pId, lang)).join(', ')}
                        </strong>
                      </td>
                      <td className="mono">{grp.degreeSpanDeg.toFixed(2)}°</td>
                      <td>
                        <span className={`badge ${grp.degreeSpanDeg <= 3 ? 'badge-accent' : grp.degreeSpanDeg <= 8 ? 'badge-good' : 'badge-subtle'}`}>
                          {grp.degreeSpanDeg <= 3
                            ? (isHi ? 'अत्यंत सघन (< ३°)' : 'Tight (< 3°)')
                            : grp.degreeSpanDeg <= 8
                              ? (isHi ? 'मध्यम युति (३°-८°)' : 'Moderate (3°-8°)')
                              : (isHi ? 'शिथिल युति (> ८°)' : 'Loose (> 8°)')}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-outline">
                          {isHi ? grp.headlineHi : grp.headlineEn}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      {isHi ? 'कुंडली में कोई बहु-ग्रह युति नहीं है।' : 'No multi-planet conjunction clusters detected.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Combustion (Astangata) Table */}
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--accent)' }}>
            {isHi ? '२. सूर्य से कोणीय अंतर एवं ग्रह अस्त (Combustion) तालिका' : '2. Angular Distance from Sun & Combustion (Astangata) Analysis'}
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                  <th>{isHi ? 'सूर्य से अंशात्मक दूरी' : 'Angular Distance from Sun'}</th>
                  <th>{isHi ? 'शास्त्रीय अस्त सीमा' : 'Combustion Threshold'}</th>
                  <th>{isHi ? 'अस्त स्थिति' : 'Combustion Status'}</th>
                  <th>{isHi ? 'शास्त्रीय प्रभाव' : 'Shastric Consequence'}</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const sunPos = chart.planets.find((p) => p.id === 'Sun');
                  const sunLon = sunPos ? sunPos.longitude : 0;
                  const combustionLimits: Record<string, number> = {
                    Moon: 12,
                    Mars: 17,
                    Mercury: 14,
                    Jupiter: 11,
                    Venus: 10,
                    Saturn: 15,
                  };

                  return chart.planets
                    .filter((p) => ['Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].includes(p.id))
                    .map((p) => {
                      const diff = Math.min(
                        Math.abs(p.longitude - sunLon),
                        360 - Math.abs(p.longitude - sunLon)
                      );
                      const threshold = combustionLimits[p.id] || 15;
                      const isCombust = p.isCombust || diff <= threshold;
                      const isDeep = diff <= 3;

                      return (
                        <tr key={p.id}>
                          <td><strong>{trPlanet(p.id, lang)}</strong></td>
                          <td className="mono">{diff.toFixed(2)}° ({formatDms(diff)})</td>
                          <td className="mono">{threshold}°</td>
                          <td>
                            {isDeep ? (
                              <span className="badge badge-warn">{isHi ? 'परम अस्त (Deep Combust)' : 'Deep Combust'}</span>
                            ) : isCombust ? (
                              <span className="badge badge-accent">{isHi ? 'अस्त (Combust)' : 'Combust'}</span>
                            ) : (
                              <span className="badge badge-good">{isHi ? 'उदित (Direct/Rising)' : 'Direct'}</span>
                            )}
                          </td>
                          <td>
                            {isCombust
                              ? (isHi ? 'ग्रह का बाह्य प्रभाव सूर्य में समाहित, कारक तत्वों हेतु विशेष जप आवश्यक' : 'Significations internalize in Sun rays, propitiation advised')
                              : (isHi ? 'पूर्ण स्वतंत्र रूप से फल प्रदाता' : 'Fully expressive independent karakatwas')}
                          </td>
                        </tr>
                      );
                    });
                })()}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 12. Tab: Yoga Mathematical Verification Criteria */}
      {activeTab === 'yogaMath' && (
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                {isHi ? 'शास्त्रीय योग गणितीय कसौटी एवं सत्यापन' : 'Classical Yoga Algorithmic Verification & Mathematical Criteria'}
              </h2>
              <p className="muted small-text" style={{ margin: '4px 0 0' }}>
                {isHi
                  ? 'कुंडली में सक्रिय राजयोग, धनयोग, पंचमहापुरुष, विपरीत व अरिष्ट योगों के गणितीय सत्यापन नियम व शास्त्रीय प्रमाण'
                  : 'Mathematical verification criteria, house/planetary participants and classical citations for all detected yogas'}
              </p>
            </div>
            <span className="badge badge-accent">
              {isHi ? `${detectedYogas.length} योग सत्यापित` : `${detectedYogas.length} Yogas Verified`}
            </span>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{isHi ? 'योग का नाम' : 'Yoga Name'}</th>
                  <th>{isHi ? 'श्रेणी' : 'Category'}</th>
                  <th>{isHi ? 'गुणवत्ता' : 'Quality'}</th>
                  <th>{isHi ? 'संलग्न ग्रह व भाव' : 'Planets & Houses'}</th>
                  <th>{isHi ? 'गणितीय कसौटी व सत्यापन' : 'Mathematical Criteria'}</th>
                  <th>{isHi ? 'शास्त्रीय ग्रंथ प्रमाण' : 'Classical Source'}</th>
                </tr>
              </thead>
              <tbody>
                {detectedYogas.map((y, yIdx) => (
                  <tr key={y.id || yIdx}>
                    <td className="mono">{yIdx + 1}</td>
                    <td>
                      <strong style={{ color: 'var(--text)' }}>
                        {isHi ? y.nameHi || y.name : y.name}
                      </strong>
                    </td>
                    <td>
                      <span className="badge badge-subtle">{y.category}</span>
                    </td>
                    <td>
                      <span className={`badge ${y.quality === 'Positive' ? 'badge-good' : y.quality === 'Negative' ? 'badge-warn' : 'badge-accent'}`}>
                        {y.quality === 'Positive' ? (isHi ? 'शुभ' : 'Positive') : y.quality === 'Negative' ? (isHi ? 'अशुभ' : 'Negative') : (isHi ? 'मिश्रित' : 'Mixed')}
                      </span>
                    </td>
                    <td>
                      <span className="mono" style={{ fontSize: '11.5px' }}>
                        {y.planets?.map((p) => trPlanet(p, lang)).join(', ') || '—'} (भाव {y.houses?.join(', ') || '—'})
                      </span>
                    </td>
                    <td className="wrap-cell" style={{ fontSize: '12px', lineHeight: 1.45 }}>
                      {y.conditionEn}
                    </td>
                    <td style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      {y.source || (isHi ? 'बृहत्पाराशर होराशास्त्र' : 'BPHS')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
