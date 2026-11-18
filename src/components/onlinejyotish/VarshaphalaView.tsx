import React, { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Flame,
  Info,
  Layers,
  Printer,
  Shield,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';
import {
  computeVarshaphala,
  type MuddaDashaItem,
  type TajikaSahamItem,
  type TajikaYogaInfo,
  type VarshaphalaReport,
} from '../../astro/varshaphala';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet, trSign } from '../../i18n/translations';

interface VarshaphalaViewProps {
  chart: ChartData;
  onNavigate?: (view: string) => void;
}

export const VarshaphalaView: React.FC<VarshaphalaViewProps> = ({ chart, onNavigate }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const birthYear = useMemo(() => {
    return parseInt(chart.input.date.slice(0, 4), 10) || 2000;
  }, [chart.input.date]);

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const report: VarshaphalaReport = useMemo(() => {
    return computeVarshaphala(chart, selectedYear);
  }, [chart, selectedYear]);

  // Year choices from birth year up to birth year + 120 (Parashara Vimshottari 120-year cycle)
  const yearOptions = useMemo(() => {
    const list: number[] = [];
    for (let y = birthYear; y <= birthYear + 120; y++) {
      list.push(y);
    }
    return list;
  }, [birthYear]);

  return (
    <div className="oj-page-container">
      {/* Breadcrumb */}
      <nav className="oj-breadcrumbs no-print" aria-label="Breadcrumb">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            if (onNavigate) onNavigate('home');
          }}
        >
          {isHi ? 'होम' : 'Home'}
        </a>
        <span className="oj-bc-sep">/</span>
        <span className="oj-bc-current">
          {isHi ? 'ताजिक वर्षफल व सौर वर्ष प्रवेश' : 'Tajika Varshaphala & Solar Return'}
        </span>
      </nav>

      {/* Header Card */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          {isHi
            ? 'नीलकंठीय ताजिक तंत्र, मुन्था, पंचाधिकारी, १६ ताजिक योग एवं मुद्देन दशा'
            : 'Tajika Neelakanthi Solar Return, Muntha, Panchadhikari & Mudda Dasha'}
        </div>
        <h1 className="oj-page-title">
          {isHi
            ? `ताजिक वर्षफल ${selectedYear}: वार्षिक सौर कुंडली`
            : `Tajika Varshaphala ${selectedYear}: Annual Solar Return Chart`}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? 'जन्मकालीन सूर्य के उसी सूक्ष्म निरयण अंश पर पुनः पहुंचने के काल (वर्ष प्रवेश) से वर्षफल का निर्धारण होता है। इसमें वर्षेश, मुन्था, पंचाधिकारी एवं मुद्देन दशा से वर्ष भर की घटनाओं का सटीक काल-निर्धारण होता है।'
            : 'Computes the exact instant when the Sun returns to its exact natal sidereal degree. Assesses the Year Lord (Varshesh), Muntha placement, 16 Tajika Yogas (Ithasala/Ishrafa), and Mudda Dasha periods.'}
        </p>

        {/* Year Selector & Print */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginTop: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
              {isHi ? 'वर्ष का चयन करें:' : 'Select Year:'}
            </span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                fontWeight: 'bold',
                color: '#0f172a',
                background: '#ffffff',
              }}
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y} ({isHi ? `आयु वर्ष ${y - birthYear}` : `Age ${y - birthYear}`})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => window.print()}
            className="oj-action-btn no-print"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={15} />
            <span>{isHi ? 'वर्षफल प्रिंट करें' : 'Print Annual Dossier'}</span>
          </button>
        </div>
      </div>

      {/* Core Year Metrics Banner */}
      <div
        className="oj-card"
        style={{
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          border: '2px solid #f59e0b',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#92400e', fontWeight: 600, textTransform: 'uppercase' }}>
              {isHi ? 'सौर वर्ष प्रवेश काल (Solar Return)' : 'Varsha Pravesh Instant'}
            </div>
            <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#78350f', marginTop: '3px' }}>
              {report.varshaPraveshLocal}
            </div>
            <div style={{ fontSize: '11px', color: '#92400e', marginTop: '2px' }}>
              {isHi ? `पूर्ण वर्ष: ${report.completedYears}` : `Completed Years: ${report.completedYears}`}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: '#92400e', fontWeight: 600, textTransform: 'uppercase' }}>
              {isHi ? 'वर्षेश (Year Lord / Varshesh)' : 'Year Lord (Varshesh)'}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#78350f', marginTop: '2px' }}>
              {trPlanet(report.varshesh, lang)}
            </div>
            <div style={{ fontSize: '11px', color: '#92400e', marginTop: '2px' }}>
              {report.varsheshStrengthNote}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: '#92400e', fontWeight: 600, textTransform: 'uppercase' }}>
              {isHi ? 'मुन्था की स्थिति (Muntha Placement)' : 'Muntha Placement'}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#78350f', marginTop: '2px' }}>
              {report.munthaSignName} ({isHi ? `भाव ${report.munthaHouse}` : `House ${report.munthaHouse}`})
            </div>
            <div style={{ fontSize: '11px', color: '#92400e', marginTop: '2px' }}>
              {isHi ? 'मुन्था स्वामी:' : 'Muntha Lord:'} {trPlanet(report.panchadhikari.munthaLord, lang)}
            </div>
          </div>
        </div>

        {/* Muntha Detailed Prediction */}
        <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #fde68a', fontSize: '12px', color: '#78350f' }}>
          <strong>{isHi ? 'मुन्था शास्त्रीय फलादेश:' : 'Muntha Classical Shastric Impact:'}</strong> {report.munthaPrediction}
        </div>
      </div>

      {/* Panchadhikari & Tajika Yogas Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        {/* Panchadhikari Table */}
        <div className="oj-card">
          <h2 className="oj-card-title">
            <Award size={18} color="#d97706" />
            {isHi ? 'पंचाधिकारी निर्णय (5 Candidates for Varshesh)' : 'Panchadhikari Assessment'}
          </h2>
          <div style={{ overflowX: 'auto', marginTop: '8px' }}>
            <table className="oj-table" style={{ width: '100%', fontSize: '12px' }}>
              <thead>
                <tr>
                  <th>{isHi ? 'अधिकार' : 'Office'}</th>
                  <th>{isHi ? 'ग्रह स्वामी' : 'Lord Planet'}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>{isHi ? '१. मुन्था पति (Munthesha)' : '1. Muntha Lord'}</td>
                  <td>{trPlanet(report.panchadhikari.munthaLord, lang)}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>{isHi ? '२. जन्म लग्न पति (Janma Lagnesha)' : '2. Natal Asc Lord'}</td>
                  <td>{trPlanet(report.panchadhikari.birthAscLord, lang)}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>{isHi ? '३. वर्ष लग्न पति (Varsha Lagnesha)' : '3. Varsha Asc Lord'}</td>
                  <td>{trPlanet(report.panchadhikari.varshaAscLord, lang)}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>{isHi ? '४. त्रिराशि पति (Tri-Rashi Lord)' : '4. Tri-Rashi Lord'}</td>
                  <td>{trPlanet(report.panchadhikari.triRashiLord, lang)}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>{isHi ? '५. दिन/रात्रि पति (Dina-Ratri Lord)' : '5. Din/Ratri Lord'}</td>
                  <td>{trPlanet(report.panchadhikari.dinRatriLord, lang)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 16 Tajika Yogas */}
        <div className="oj-card">
          <h2 className="oj-card-title">
            <Sparkles size={18} color="#d97706" />
            {isHi ? 'सक्रिय ताजिक योग (इत्थशाल, ईशराफ़ आदि)' : 'Active Tajika Yogas (Ithasala, Ishrafa)'}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto', marginTop: '8px' }}>
            {report.tajikaYogas.length > 0 ? (
              report.tajikaYogas.map((yoga, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '12px' }}>
                    <span style={{ color: '#0f172a' }}>{yoga.name}</span>
                    <span style={{ color: '#0369a1', fontSize: '11px' }}>{yoga.planets}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                    {yoga.description}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: '#64748b', fontSize: '12px', padding: '16px', textAlign: 'center' }}>
                {isHi ? 'इस वर्ष में कोई प्रमुख प्रत्यक्ष ताजिक योग सक्रिय नहीं है।' : 'No major direct Tajika yogas formed this year.'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mudda Dasha Table */}
      <div className="oj-card" style={{ marginBottom: '20px' }}>
        <h2 className="oj-card-title">
          <Clock size={18} color="#d97706" />
          {isHi ? 'मुद्देन दशा काल-चक्र (Annual Vimshottari Sub-Periods)' : 'Mudda Dasha Planetary Periods for the Year'}
        </h2>
        <div style={{ overflowX: 'auto', marginTop: '8px' }}>
          <table className="oj-table" style={{ width: '100%', fontSize: '12px' }}>
            <thead>
              <tr>
                <th>{isHi ? 'दशा स्वामी' : 'Dasha Lord'}</th>
                <th>{isHi ? 'आरंभ तिथि' : 'Start Date'}</th>
                <th>{isHi ? 'समाप्ति तिथि' : 'End Date'}</th>
                <th>{isHi ? 'अवधि (दिन)' : 'Duration (Days)'}</th>
              </tr>
            </thead>
            <tbody>
              {report.muddaDasha.map((m, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>{trPlanet(m.lord, lang)}</td>
                  <td>{m.startDate}</td>
                  <td>{m.endDate}</td>
                  <td>{m.days} {isHi ? 'दिन' : 'days'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tajika Sahams Table */}
      <div className="oj-card">
        <h2 className="oj-card-title">
          <Compass size={18} color="#d97706" />
          {isHi ? 'ताजिक सहम (पुण्य, विद्या, यश, मित्र सहम आदि)' : 'Tajika Sahams (Sensitive Arabic/Tajik Points)'}
        </h2>
        <div style={{ overflowX: 'auto', marginTop: '8px' }}>
          <table className="oj-table" style={{ width: '100%', fontSize: '12px' }}>
            <thead>
              <tr>
                <th>{isHi ? 'सहम का नाम' : 'Saham Name'}</th>
                <th>{isHi ? 'राशि' : 'Sign'}</th>
                <th>{isHi ? 'अंश (DMS)' : 'Longitude (DMS)'}</th>
                <th>{isHi ? 'भाव' : 'House'}</th>
                <th>{isHi ? 'स्वामी' : 'Lord'}</th>
              </tr>
            </thead>
            <tbody>
              {report.sahams.map((s, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>{isHi ? s.nameHi : s.nameEn}</td>
                  <td>{trSign(s.signIndex, lang)}</td>
                  <td>{s.dms}</td>
                  <td>{s.house}</td>
                  <td>{trPlanet(s.lord, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VarshaphalaView;
