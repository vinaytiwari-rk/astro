import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Download,
  Heart,
  MapPin,
  Printer,
  Shield,
  ShieldAlert,
  Sparkles,
  User,
} from 'lucide-react';
import { calculateChart } from '../../astro/calculator';
import { NAKSHATRAS, SIGNS } from '../../astro/constants';
import { computeAshtakoota } from '../../astro/matchmaking';
import { formatDateDmy } from '../../astro/time';
import type { BirthInput, CalcSettings, ChartStyle } from '../../astro/types';
import type { CityEntry } from '../../data/cities';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet, trPlanetShort, trSign } from '../../i18n/translations';
import { DateDmyInput } from '../DateDmyInput';
import { InlineCityAutocomplete } from '../InlineCityAutocomplete';
import { VedicChartSvg, type ChartBadgeItem } from '../VedicChartSvg';

interface OnlineJyotishMatchingViewProps {
  settings: CalcSettings;
  onChangeChartStyle: (style: ChartStyle) => void;
  onNavigate: (view: string, sub?: string) => void;
}

export const OnlineJyotishMatchingView: React.FC<OnlineJyotishMatchingViewProps> = ({
  settings,
  onChangeChartStyle,
  onNavigate,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  // Boy & Girl Form States
  const [boyInput, setBoyInput] = useState<BirthInput>({
    id: 'boy-profile',
    name: isHi ? 'वर (Groom)' : 'Groom',
    gender: 'male',
    date: '1995-05-15',
    time: '10:30',
    city: 'New Delhi',
    country: 'India',
    latitude: 28.6139,
    longitude: 77.209,
    timezone: 'Asia/Kolkata',
  });

  const [girlInput, setGirlInput] = useState<BirthInput>({
    id: 'girl-profile',
    name: isHi ? 'कन्या (Bride)' : 'Bride',
    gender: 'female',
    date: '1998-08-22',
    time: '14:15',
    city: 'Varanasi',
    country: 'India',
    latitude: 25.3176,
    longitude: 82.9739,
    timezone: 'Asia/Kolkata',
  });

  const [matchingMethod, setMatchingMethod] = useState<'ashtakoot' | 'doshabhanga' | 'dashakoota'>('doshabhanga');

  const boyChart = useMemo(() => calculateChart(boyInput, settings), [boyInput, settings]);
  const girlChart = useMemo(() => calculateChart(girlInput, settings), [girlInput, settings]);

  const bMoon = useMemo(() => boyChart.planets.find((p) => p.id === 'Moon') || boyChart.ascendant, [boyChart]);
  const gMoon = useMemo(() => girlChart.planets.find((p) => p.id === 'Moon') || girlChart.ascendant, [girlChart]);

  const matchReport = useMemo(() => {
    return computeAshtakoota(girlChart, boyChart);
  }, [girlChart, boyChart]);

  const boyBadges: ChartBadgeItem[] = useMemo(() => [
    {
      id: 'Asc',
      label: trPlanetShort('Asc', lang),
      signIndex: boyChart.ascendant.signIndex,
      houseNumber: 1,
      isLagna: true,
    },
    ...boyChart.planets.map((p) => ({
      id: p.id,
      label: trPlanetShort(p.id, lang),
      signIndex: p.signIndex,
      houseNumber: p.houseNumber,
      isRetrograde: p.isRetrograde,
      isCombust: p.isCombust,
      dignity: p.dignity,
    })),
  ], [boyChart, lang]);

  const girlBadges: ChartBadgeItem[] = useMemo(() => [
    {
      id: 'Asc',
      label: trPlanetShort('Asc', lang),
      signIndex: girlChart.ascendant.signIndex,
      houseNumber: 1,
      isLagna: true,
    },
    ...girlChart.planets.map((p) => ({
      id: p.id,
      label: trPlanetShort(p.id, lang),
      signIndex: p.signIndex,
      houseNumber: p.houseNumber,
      isRetrograde: p.isRetrograde,
      isCombust: p.isCombust,
      dignity: p.dignity,
    })),
  ], [girlChart, lang]);

  const totalPoints = matchReport.totalObtained;
  const isHighMatch = totalPoints >= 24;
  const isAvgMatch = totalPoints >= 18 && totalPoints < 24;

  return (
    <div className="oj-page-container">
      {/* Breadcrumb */}
      <nav className="oj-breadcrumbs" aria-label="Breadcrumb">
        <a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
          {isHi ? 'होम' : 'Home'}
        </a>
        <span className="oj-bc-sep">/</span>
        <span>{isHi ? 'विवाह मिलान' : 'Marriage Matching'}</span>
        <span className="oj-bc-sep">/</span>
        <span className="oj-bc-current">{isHi ? 'कुंडली मिलान (गुण मिलान एवं 10 कूट)' : 'Kundli Matching (Guna Milan)'}</span>
      </nav>

      {/* Header Banner */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          {isHi ? '100% निःशुल्क कुंडली मिलान · अष्टकूट 36 गुण एवं दश कूट' : '100% Free Kundli Matching · 36 Gunas & 10 Poruthams'}
        </div>
        <h1 className="oj-page-title">
          {isHi ? 'वर-कन्या कुंडली मिलान एवं मंगल दोष साम्य' : 'Horoscope Matching for Marriage & Compatibility'}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? 'वर्ण, वश्य, तारा, योनि, ग्रह मैत्री, गण, भकूट एवं नाड़ी के 36 गुणों का सूक्ष्म विश्लेषण एवं शास्त्रीय दोष परिहार।'
            : 'Detailed 36-point Ashtakoota compatibility, 10 South Indian Poruthams, Manglik Dosha balancing, and classical cancellation rules.'}
        </p>

        {/* Action Pills */}
        <div className="oj-page-actions-bar">
          <div className="oj-chart-style-pill">
            <span className="oj-pill-label">{isHi ? 'पद्धति:' : 'Method:'}</span>
            <select
              value={matchingMethod}
              onChange={(e) => setMatchingMethod(e.target.value as any)}
              className="oj-chart-select"
            >
              <option value="doshabhanga">{isHi ? 'दोष भंग सहित अष्टकूट (Guna Milan with Cancellations)' : 'Guna Milan with Dosha Bhanga'}</option>
              <option value="ashtakoot">{isHi ? 'सरल अष्टकूट (Standard Ashtakoota)' : 'Standard Ashtakoota'}</option>
              <option value="dashakoota">{isHi ? 'दश कूट मिलान (10 South Indian Poruthams)' : 'Dasha Koota (10 Poruthams)'}</option>
            </select>
          </div>
          <button type="button" className="oj-action-btn secondary" onClick={() => window.print()}>
            <Printer size={14} />
            <span>{isHi ? 'रिपोर्ट प्रिंट करें' : 'Print Report'}</span>
          </button>
        </div>
      </div>

      {/* Dual Input Form: Boy & Girl */}
      <div className="oj-two-col-grid">
        {/* Boy Form */}
        <div className="oj-card oj-form-card">
          <div className="oj-card-header">
            <h3>{isHi ? 'वर का विवरण (Groom Details)' : 'Groom (Boy) Birth Details'}</h3>
          </div>
          <div className="oj-form-grid">
            <div className="oj-field oj-field-full">
              <label>{isHi ? 'वर का नाम' : 'Boy Full Name'}</label>
              <input
                type="text"
                value={boyInput.name}
                onChange={(e) => setBoyInput({ ...boyInput, name: e.target.value })}
              />
            </div>
            <div className="oj-field">
              <label>{isHi ? 'जन्म तिथि' : 'Date of Birth'}</label>
              <DateDmyInput
                value={boyInput.date}
                onChange={(d) => setBoyInput({ ...boyInput, date: d })}
              />
            </div>
            <div className="oj-field">
              <label>{isHi ? 'जन्म समय' : 'Time of Birth'}</label>
              <input
                type="time"
                step="1"
                value={boyInput.time}
                onChange={(e) => setBoyInput({ ...boyInput, time: e.target.value })}
              />
            </div>
            <div className="oj-field oj-field-full">
              <label>{isHi ? 'जन्म स्थान' : 'City / Place of Birth'}</label>
              <InlineCityAutocomplete
                value={boyInput.city}
                onChangeText={(c) => setBoyInput({ ...boyInput, city: c })}
                onSelectCity={(entry) =>
                  setBoyInput({
                    ...boyInput,
                    city: entry.city,
                    country: entry.country,
                    latitude: entry.lat,
                    longitude: entry.lng,
                    timezone: entry.timezone,
                  })
                }
                lang={lang}
              />
            </div>
          </div>
        </div>

        {/* Girl Form */}
        <div className="oj-card oj-form-card">
          <div className="oj-card-header">
            <h3>{isHi ? 'कन्या का विवरण (Bride Details)' : 'Bride (Girl) Birth Details'}</h3>
          </div>
          <div className="oj-form-grid">
            <div className="oj-field oj-field-full">
              <label>{isHi ? 'कन्या का नाम' : 'Girl Full Name'}</label>
              <input
                type="text"
                value={girlInput.name}
                onChange={(e) => setGirlInput({ ...girlInput, name: e.target.value })}
              />
            </div>
            <div className="oj-field">
              <label>{isHi ? 'जन्म तिथि' : 'Date of Birth'}</label>
              <DateDmyInput
                value={girlInput.date}
                onChange={(d) => setGirlInput({ ...girlInput, date: d })}
              />
            </div>
            <div className="oj-field">
              <label>{isHi ? 'जन्म समय' : 'Time of Birth'}</label>
              <input
                type="time"
                step="1"
                value={girlInput.time}
                onChange={(e) => setGirlInput({ ...girlInput, time: e.target.value })}
              />
            </div>
            <div className="oj-field oj-field-full">
              <label>{isHi ? 'जन्म स्थान' : 'City / Place of Birth'}</label>
              <InlineCityAutocomplete
                value={girlInput.city}
                onChangeText={(c) => setGirlInput({ ...girlInput, city: c })}
                onSelectCity={(entry) =>
                  setGirlInput({
                    ...girlInput,
                    city: entry.city,
                    country: entry.country,
                    latitude: entry.lat,
                    longitude: entry.lng,
                    timezone: entry.timezone,
                  })
                }
                lang={lang}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Score Summary Banner */}
      <div className={`oj-match-score-card ${isHighMatch ? 'high' : isAvgMatch ? 'avg' : 'low'}`}>
        <div className="oj-score-left">
          <span className="oj-score-pts">{totalPoints.toFixed(1)}</span>
          <span className="oj-score-max">/ 36</span>
        </div>
        <div className="oj-score-right">
          <h3>
            {isHighMatch
              ? (isHi ? 'उत्कृष्ट मिलान (Highly Recommended / Shubha Vivaha)' : 'Excellent Match — Highly Recommended')
              : isAvgMatch
              ? (isHi ? 'मध्यम मिलान (Acceptable with Mutual Understanding)' : 'Moderate Match — Acceptable')
              : (isHi ? 'न्यून अंक (Below 18 Points — Detailed Consultation Required)' : 'Below Average — Astrological Consultation Advised')}
          </h3>
          <p>
            {isHi
              ? `वर: ${bMoon.nakshatraName} (पाद ${bMoon.pada}), ${trSign(bMoon.signIndex, lang)} राशि | कन्या: ${gMoon.nakshatraName} (पाद ${gMoon.pada}), ${trSign(gMoon.signIndex, lang)} राशि`
              : `Groom: ${bMoon.nakshatraName} (Pada ${bMoon.pada}), ${SIGNS[bMoon.signIndex].name} | Bride: ${gMoon.nakshatraName} (Pada ${gMoon.pada}), ${SIGNS[gMoon.signIndex].name}`}
          </p>
        </div>
      </div>

      {/* Ashtakoota 36 Points Breakdown Table */}
      <div className="oj-card">
        <div className="oj-card-header">
          <h2>{isHi ? 'अष्टकूट 36 गुण विस्तृत सारणी (Ashtakoota 36-Point Table)' : 'Ashtakoota 36-Point Compatibility Table'}</h2>
        </div>
        <table className="oj-table">
          <thead>
            <tr>
              <th>{isHi ? 'कूट (Koota)' : 'Koota'}</th>
              <th>{isHi ? 'अधिकतम अंक' : 'Max Gunas'}</th>
              <th>{isHi ? 'प्राप्त अंक' : 'Obtained'}</th>
              <th>{isHi ? 'वर विवरण' : 'Groom'}</th>
              <th>{isHi ? 'कन्या विवरण' : 'Bride'}</th>
              <th>{isHi ? 'शास्त्रीय फल' : 'Significance'}</th>
            </tr>
          </thead>
          <tbody>
            {matchReport.kootas.map((k, i) => (
              <tr key={i}>
                <td><strong>{k.name}</strong></td>
                <td>{k.maxPoints}</td>
                <td>
                  <strong style={{ color: k.obtainedPoints === k.maxPoints ? 'var(--good)' : k.obtainedPoints === 0 ? 'var(--bad)' : 'var(--accent)' }}>
                    {k.obtainedPoints}
                  </strong>
                </td>
                <td>{k.groomValue}</td>
                <td>{k.brideValue}</td>
                <td>{k.note}</td>
              </tr>
            ))}
            <tr className="oj-row-highlight">
              <th>{isHi ? 'कुल योग' : 'Total Score'}</th>
              <th>36</th>
              <th><strong style={{ fontSize: '1.1rem' }}>{totalPoints.toFixed(1)}</strong></th>
              <th colSpan={3}>
                {totalPoints >= 18
                  ? (isHi ? 'विवाह हेतु अनुशंसित (18 या अधिक अंक)' : 'Favorable (18 or more points)')
                  : (isHi ? '18 से कम अंक' : 'Less than 18 points')}
              </th>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Manglik Dosha Samya Comparison */}
      <div className="oj-card">
        <div className="oj-card-header">
          <h2>{isHi ? 'मंगल दोष संतुलन एवं परिहार (Dosha Samya)' : 'Mangal Dosha Comparison & Balancing'}</h2>
        </div>
        <div className="oj-two-col-grid" style={{ marginBottom: '1rem' }}>
          <div className={`oj-dosha-status-banner ${matchReport.groomManglik.isManglik ? 'has-dosha' : 'no-dosha'}`}>
            <strong>{isHi ? 'वर की स्थिति:' : 'Groom:'}</strong>{' '}
            {matchReport.groomManglik.isManglik
              ? (isHi ? `मांगलिक (${matchReport.groomManglik.houses.join(', ')}वें भाव में मंगल)` : `Manglik (Mars in H${matchReport.groomManglik.houses.join(', ')})`)
              : (isHi ? 'अमांगलिक (निर्दोष)' : 'Non-Manglik')}
          </div>
          <div className={`oj-dosha-status-banner ${matchReport.brideManglik.isManglik ? 'has-dosha' : 'no-dosha'}`}>
            <strong>{isHi ? 'कन्या की स्थिति:' : 'Bride:'}</strong>{' '}
            {matchReport.brideManglik.isManglik
              ? (isHi ? `मांगलिक (${matchReport.brideManglik.houses.join(', ')}वें भाव में मंगल)` : `Manglik (Mars in H${matchReport.brideManglik.houses.join(', ')})`)
              : (isHi ? 'अमांगलिक (निर्दोष)' : 'Non-Manglik')}
          </div>
        </div>
        <div className={`oj-dosha-status-banner ${matchReport.manglikCompatible ? 'no-dosha' : 'has-dosha'}`}>
          <h4>
            {matchReport.manglikCompatible
              ? (isHi ? 'मंगल दोष साम्य (अनुकूल परिहार)' : 'Dosha Balanced (Dosha Samya)')
              : (isHi ? 'आंशिक असंतुलन (दोष परिहार अपेक्षित)' : 'One-Sided Kuja Dosha (Remedies Advised)')}
          </h4>
          <p>{matchReport.brideManglik.note} {matchReport.groomManglik.note}</p>
        </div>
      </div>

      {/* D-1 Lagna Charts Comparison for Boy & Girl */}
      <div className="oj-card">
        <div className="oj-card-header">
          <h2>{isHi ? 'वर एवं कन्या की लग्न कुंडलियां (D-1 Charts)' : 'Lagna Charts of Groom and Bride'}</h2>
        </div>
        <div className="oj-charts-row">
          <div className="oj-chart-box">
            <h4 className="oj-chart-title">{boyInput.name} ({isHi ? 'वर कुंडली' : 'Groom Chart'})</h4>
            <div className="oj-svg-wrapper">
              <VedicChartSvg
                title={boyInput.name}
                style={settings.chartStyle}
                lagnaSignIndex={boyChart.ascendant.signIndex}
                items={boyBadges}
                centerLabel={isHi ? 'वर' : 'GROOM'}
              />
            </div>
          </div>
          <div className="oj-chart-box">
            <h4 className="oj-chart-title">{girlInput.name} ({isHi ? 'कन्या कुंडली' : 'Bride Chart'})</h4>
            <div className="oj-svg-wrapper">
              <VedicChartSvg
                title={girlInput.name}
                style={settings.chartStyle}
                lagnaSignIndex={girlChart.ascendant.signIndex}
                items={girlBadges}
                centerLabel={isHi ? 'कन्या' : 'BRIDE'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
