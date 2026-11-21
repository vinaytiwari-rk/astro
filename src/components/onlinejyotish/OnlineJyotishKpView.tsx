import React, { useMemo } from 'react';
import {
  Compass,
  Download,
  FileText,
  Printer,
  Sparkles,
} from 'lucide-react';
import { NINE_GRAHAS, SIGNS } from '../../astro/constants';
import { computeKpReport } from '../../astro/kp';
import { formatDateDmy, formatDateTimeDmyAmPm, formatDms } from '../../astro/time';
import type { BirthInput, CalcSettings, ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet, trSign } from '../../i18n/translations';
import { VedicChartSvg } from '../VedicChartSvg';

interface OnlineJyotishKpViewProps {
  chart: ChartData;
  activeInput: BirthInput;
  settings: CalcSettings;
  onNavigate: (view: string, sub?: string) => void;
  onOpenBooklet: () => void;
}

export const OnlineJyotishKpView: React.FC<OnlineJyotishKpViewProps> = ({
  chart,
  activeInput,
  settings,
  onNavigate,
  onOpenBooklet,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const kp = useMemo(() => computeKpReport(chart), [chart]);

  return (
    <div className="oj-page-container">
      {/* Breadcrumb */}
      <nav className="oj-breadcrumbs" aria-label="Breadcrumb">
        <a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
          {isHi ? 'होम' : 'Home'}
        </a>
        <span className="oj-bc-sep">/</span>
        <span>{isHi ? 'निःशुल्क ज्योतिष' : 'Free Astrology'}</span>
        <span className="oj-bc-sep">/</span>
        <span className="oj-bc-current">{isHi ? 'केपी कुंडली एवं उप-स्वामी (KP Horoscope)' : 'KP Horoscope & Sub-Lords'}</span>
      </nav>

      {/* Header Banner */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          {isHi ? 'कृष्णमूर्ति पद्धति (KP System) · 100% निःशुल्क' : 'Krishnamurti Paddhati (KP System) · 100% Free'}
        </div>
        <h1 className="oj-page-title">
          {isHi ? `${chart.input.name} की केपी कुंडली एवं उप-स्वामी सारणी` : `KP Horoscope & Sub-Lord Calculator for ${chart.input.name}`}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? 'प्लेसिडस भाव संधि, 1 से 12 भावों के उप-स्वामी (Sub-Lord), ग्रहों के उप-स्वामी, 4-स्तरीय कार्यकत्व एवं सत्तारूढ़ ग्रह (Ruling Planets)।'
            : 'Placidus Cuspal Positions, Cusp Sub-Lords, Planetary Sub-Lords, 4-Level KP Significators, and Ruling Planets (RP).'}
        </p>

        <div className="oj-page-actions-bar">
          <button type="button" className="oj-action-btn primary" onClick={onOpenBooklet}>
            <Download size={14} />
            <span>{isHi ? 'जन्म पत्रिका डाउनलोड' : 'Birth Report (जन्म पत्रिका)'}</span>
          </button>
          <button type="button" className="oj-action-btn secondary" onClick={() => window.print()}>
            <Printer size={14} />
            <span>{isHi ? 'प्रिंट करें' : 'Print KP Chart'}</span>
          </button>
        </div>
      </div>

      {/* Native Details Strip */}
      <div className="oj-card oj-samvat-card">
        <div className="oj-samvat-grid">
          <div>
            <span className="oj-meta-label">{isHi ? 'जातक' : 'Native'}:</span>
            <strong>{chart.input.name}</strong>
          </div>
          <div>
            <span className="oj-meta-label">{isHi ? 'जन्म विवरण' : 'Birth Particulars'}:</span>
            <strong>{formatDateTimeDmyAmPm(chart.input.date, chart.input.time)} ({chart.input.city})</strong>
          </div>
          <div>
            <span className="oj-meta-label">{isHi ? 'केपी अयनांश' : 'KP Ayanamsha'}:</span>
            <strong>{kp.kpAyanamsaDms}</strong>
          </div>
          <div>
            <span className="oj-meta-label">{isHi ? 'लग्न / चंद्र' : 'Asc / Moon'}:</span>
            <strong>{trSign(chart.ascendant.signIndex, lang)} / {trSign(chart.planets.find((p) => p.id === 'Moon')?.signIndex ?? 0, lang)}</strong>
          </div>
        </div>
      </div>

      {/* Table 1: KP Cuspal Positions Table */}
      <div className="oj-card">
        <div className="oj-card-header">
          <h2>{isHi ? '1. केपी भाव संधि एवं उप-स्वामी सारणी (Cuspal Positions)' : '1. KP Cuspal Positions Table (Placidus Cusps)'}</h2>
        </div>
        <p className="oj-section-note">
          {isHi
            ? 'प्लेसिडस पद्धति द्वारा 1 से 12 भावों के आरंभिक अंश, राशि स्वामी, नक्षत्र स्वामी, उप-स्वामी (Sub-Lord) एवं उप-उप स्वामी।'
            : 'Exact Cuspal longitudes computed using Placidus house system with Sign Lord, Star Lord, Sub-Lord, and Sub-Sub Lord.'}
        </p>
        <div className="oj-table-wrapper">
          <table className="oj-table">
            <thead>
              <tr>
                <th>{isHi ? 'भाव (Cusp)' : 'Cusp'}</th>
                <th>{isHi ? 'राशि (Sign)' : 'Sign'}</th>
                <th>{isHi ? 'अंश : कला : विकला' : 'Deg : Min : Sec'}</th>
                <th>{isHi ? 'राशि स्वामी' : 'Sign Lord'}</th>
                <th>{isHi ? 'नक्षत्र स्वामी' : 'Star Lord'}</th>
                <th>{isHi ? 'उप-स्वामी (Sub-Lord)' : 'Sub-Lord (Upadhipati)'}</th>
                <th>{isHi ? 'उप-उप स्वामी' : 'Sub-Sub Lord'}</th>
              </tr>
            </thead>
            <tbody>
              {kp.cusps.map((c) => (
                <tr key={c.house} className={c.house === 1 || c.house === 7 || c.house === 10 ? 'oj-row-highlight' : ''}>
                  <td><strong>{c.house} {isHi ? 'भाव' : 'Cusp'}</strong></td>
                  <td>{c.signName}</td>
                  <td>{c.dms}</td>
                  <td><strong>{trPlanet(c.signLord, lang)}</strong></td>
                  <td>{trPlanet(c.starLord, lang)}</td>
                  <td><strong style={{ color: 'var(--primary-maroon)' }}>{trPlanet(c.subLord, lang)}</strong></td>
                  <td>{trPlanet(c.subSubLord, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 2: KP Planetary Positions with Star & Sub-Lords */}
      <div className="oj-card">
        <div className="oj-card-header">
          <h2>{isHi ? '2. ग्रह स्थिति, नक्षत्र एवं उप-स्वामी सारणी (Planetary Sub-Lords)' : '2. Planetary Positions with Star & Sub-Lords'}</h2>
        </div>
        <div className="oj-table-wrapper">
          <table className="oj-table">
            <thead>
              <tr>
                <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                <th>{isHi ? 'केपी भाव' : 'KP House'}</th>
                <th>{isHi ? 'राशि' : 'Sign'}</th>
                <th>{isHi ? 'अंश : कला : विकला' : 'Deg : Min : Sec'}</th>
                <th>{isHi ? 'राशि स्वामी' : 'Sign Lord'}</th>
                <th>{isHi ? 'नक्षत्र स्वामी' : 'Star Lord'}</th>
                <th>{isHi ? 'उप-स्वामी (Sub-Lord)' : 'Sub-Lord'}</th>
                <th>{isHi ? 'कार्यकत्व भाव' : 'Signifies Houses'}</th>
              </tr>
            </thead>
            <tbody>
              {kp.planets.map((p) => (
                <tr key={p.planet}>
                  <td>
                    <strong className={`planet-${p.planet}`}>
                      {trPlanet(p.planet, lang)}
                    </strong>
                  </td>
                  <td><strong>{p.kpHouse}</strong></td>
                  <td>{p.signName}</td>
                  <td>{p.dms}</td>
                  <td>{trPlanet(p.signLord, lang)}</td>
                  <td>{trPlanet(p.starLord, lang)}</td>
                  <td><strong style={{ color: 'var(--primary-maroon)' }}>{trPlanet(p.subLord, lang)}</strong></td>
                  <td>{p.signifiesHouses.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 3 & 4: Ruling Planets & 4-Level Significators */}
      <div className="oj-two-col-grid">
        {/* Ruling Planets (RP) */}
        <div className="oj-card">
          <div className="oj-card-header">
            <h2>{isHi ? '3. सत्तारूढ़ ग्रह (Ruling Planets - RP)' : '3. Ruling Planets (RP) at Birth'}</h2>
          </div>
          <p className="oj-section-note">
            {isHi
              ? 'प्रश्नावस्था एवं निर्णय काल में फलकथन के लिए सर्वाधिक महत्वपूर्ण सत्तारूढ़ ग्रह (Ruling Planets)।'
              : 'Fundamental guiding planets for KP judgment, horary prashna, and event timing.'}
          </p>
          <table className="oj-table">
            <tbody>
              <tr>
                <th>{isHi ? 'दिन स्वामी (Day Lord)' : 'Day Lord'}</th>
                <td><strong>{trPlanet(kp.chartRulingPlanets.dayLord, lang)}</strong></td>
              </tr>
              <tr>
                <th>{isHi ? 'चंद्र राशि स्वामी (Moon Sign Lord)' : 'Moon Sign Lord'}</th>
                <td><strong>{trPlanet(kp.chartRulingPlanets.moonSignLord, lang)}</strong></td>
              </tr>
              <tr>
                <th>{isHi ? 'चंद्र नक्षत्र स्वामी (Moon Star Lord)' : 'Moon Star Lord'}</th>
                <td><strong style={{ color: 'var(--accent)' }}>{trPlanet(kp.chartRulingPlanets.moonStarLord, lang)}</strong></td>
              </tr>
              <tr>
                <th>{isHi ? 'चंद्र उप-स्वामी (Moon Sub-Lord)' : 'Moon Sub-Lord'}</th>
                <td><strong>{trPlanet(kp.chartRulingPlanets.moonSubLord, lang)}</strong></td>
              </tr>
              <tr>
                <th>{isHi ? 'लग्न राशि स्वामी (Asc Sign Lord)' : 'Lagna Sign Lord'}</th>
                <td><strong>{trPlanet(kp.chartRulingPlanets.lagnaSignLord, lang)}</strong></td>
              </tr>
              <tr>
                <th>{isHi ? 'लग्न नक्षत्र स्वामी (Asc Star Lord)' : 'Lagna Star Lord'}</th>
                <td><strong style={{ color: 'var(--accent)' }}>{trPlanet(kp.chartRulingPlanets.lagnaStarLord, lang)}</strong></td>
              </tr>
              <tr>
                <th>{isHi ? 'लग्न उप-स्वामी (Asc Sub-Lord)' : 'Lagna Sub-Lord'}</th>
                <td><strong>{trPlanet(kp.chartRulingPlanets.lagnaSubLord, lang)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 4-Level House Significators */}
        <div className="oj-card">
          <div className="oj-card-header">
            <h2>{isHi ? '4. चतुर्विध कार्यकत्व (4-Level Significators)' : '4. 4-Level KP House Significators'}</h2>
          </div>
          <p className="oj-section-note">
            {isHi
              ? 'स्तर 1: स्थित ग्रह के नक्षत्र में ग्रह | स्तर 2: स्थित ग्रह | स्तर 3: भावेश के नक्षत्र में ग्रह | स्तर 4: भावेश'
              : 'Level 1: In star of occupants | Level 2: Occupant | Level 3: In star of lord | Level 4: House Lord'}
          </p>
          <div className="oj-table-wrapper" style={{ maxHeight: '380px', overflowY: 'auto' }}>
            <table className="oj-table">
              <thead>
                <tr>
                  <th>{isHi ? 'भाव' : 'House'}</th>
                  <th>Level 1</th>
                  <th>Level 2</th>
                  <th>Level 3</th>
                  <th>Level 4</th>
                </tr>
              </thead>
              <tbody>
                {kp.houseSignificators.map((hs) => (
                  <tr key={hs.house}>
                    <td><strong>H{hs.house}</strong></td>
                    <td>{hs.levelA.map((p) => trPlanet(p, lang)).join(', ') || '-'}</td>
                    <td>{hs.levelB.map((p) => trPlanet(p, lang)).join(', ') || '-'}</td>
                    <td>{hs.levelC.map((p) => trPlanet(p, lang)).join(', ') || '-'}</td>
                    <td>{hs.levelD.map((p) => trPlanet(p, lang)).join(', ') || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* KP Event Promise Analysis */}
      <div className="oj-card">
        <div className="oj-card-header">
          <h2>{isHi ? '5. केपी जीवन घटना विश्लेषण (KP Life Event Predictions)' : '5. KP Cuspal Sub-Lord Event Predictions'}</h2>
        </div>
        <div className="oj-table-wrapper">
          <table className="oj-table">
            <thead>
              <tr>
                <th>{isHi ? 'जीवन आयाम' : 'Life Event'}</th>
                <th>{isHi ? 'कारक भाव' : 'Key Cusp'}</th>
                <th>{isHi ? 'भाव उप-स्वामी (Sub-Lord)' : 'Cuspal Sub-Lord'}</th>
                <th>{isHi ? 'संबद्ध भाव' : 'Signified Houses'}</th>
                <th>{isHi ? 'शास्त्रीय फल (Verdict)' : 'KP Verdict'}</th>
              </tr>
            </thead>
            <tbody>
              {kp.events.map((ev, i) => (
                <tr key={i}>
                  <td><strong>{ev.topic}</strong></td>
                  <td>Cusp {ev.cusp}</td>
                  <td><strong style={{ color: 'var(--primary-maroon)' }}>{trPlanet(ev.cuspalSubLord, lang)}</strong></td>
                  <td>{ev.subLordSignifies.join(', ')}</td>
                  <td>
                    <span className={`oj-kp-verdict ${ev.verdict.toLowerCase().replace(/[^a-z]/g, '-')}`}>
                      {ev.verdict}
                    </span>
                    <br />
                    <span className="muted" style={{ fontSize: '12px' }}>{ev.reading}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
