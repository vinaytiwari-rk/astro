import React, { useMemo, useState } from 'react';
import {
  Activity,
  Award,
  BookOpen,
  Calendar,
  Clock,
  Compass,
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
} from 'lucide-react';
import { computeAvakahadaChakra, computeBhavaChalitPlacements, computeGhatakChakra } from '../astro/avakahadaChalit';
import { computeAvasthasAndUpagrahas } from '../astro/avasthasUpagrahas';
import { computeBhavabalaReport } from '../astro/bhavabalaEngine';
import { computeDeepLifePredictions } from '../astro/predictions/deepLifePredictions';
import { DIVISIONAL_META, NINE_GRAHAS, SEVEN_PLANETS, SIGNS } from '../astro/constants';
import { formatDms } from '../astro/time';
import type {
  BirthInput,
  CalcSettings,
  ChartData,
  DivisionalChartId,
  SevenPlanetId,
} from '../astro/types';
import { useLanguage } from '../i18n/LanguageContext';
import { trPlanet, trPlanetShort, trSign } from '../i18n/translations';

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
  | 'jaimini';

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
    </div>
  );
};
