import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Compass,
  Filter,
  Flame,
  Info,
  Layers,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  computeTwelvePlanetsPredictions,
  type PlanetEventPrediction,
  type TwelvePlanetsPredictionsReport,
} from '../../astro/predictions/twelvePlanetsPredictions';
import type { ChartData, PlanetId } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet, trSign, trTerm } from '../../i18n/translations';

interface TwelvePlanetsPanelProps {
  chart: ChartData;
}

export const TwelvePlanetsPanel: React.FC<TwelvePlanetsPanelProps> = ({ chart }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [selectedPlanetId, setSelectedPlanetId] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'vedic' | 'outer'>('all');

  const report: TwelvePlanetsPredictionsReport = useMemo(
    () => computeTwelvePlanetsPredictions(chart),
    [chart]
  );

  const filteredPlanets = useMemo(() => {
    let list = report.planets;
    if (filterType === 'vedic') {
      list = list.filter((p) => !p.isOuterPlanet);
    } else if (filterType === 'outer') {
      list = list.filter((p) => p.isOuterPlanet);
    }

    if (selectedPlanetId !== 'all') {
      list = list.filter((p) => p.id === selectedPlanetId);
    }
    return list;
  }, [report.planets, filterType, selectedPlanetId]);

  return (
    <div className="view-stack">
      {/* Top Header Card */}
      <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Sparkles size={20} style={{ color: 'var(--accent)' }} />
              <span>
                {isHi
                  ? 'द्वादश ग्रह विस्तृत घटना फलादेश (9 वैदिक ग्रह + 3 बाह्य ग्रह: हर्षल, नेपच्यून, प्लूटो)'
                  : '12-Planets Comprehensive Event Predictions (9 Vedic Grahas + Uranus, Neptune, Pluto)'}
              </span>
            </h2>
            <p className="muted" style={{ margin: '4px 0 0', fontSize: '13px' }}>
              {isHi
                ? 'प्रत्येक ग्रह का कुंडली-सम्मत सटीक विश्लेषण: सकारात्मक उपलब्धियां, नकारात्मक खतरे, फलन काल व अचूक उपाय।'
                : 'House, sign, nakshatra, dignity-based concrete positive events, hazard warnings, timing triggers & remedies for all 12 bodies.'}
            </p>
          </div>

          <div className="toolbar-group">
            <span
              className="badge badge-accent mono"
              style={{ fontSize: '13px', padding: '6px 12px', fontWeight: 700 }}
            >
              {isHi ? '12 खगोलीय पिण्ड सक्रिय' : '12 Celestial Bodies'}
            </span>
          </div>
        </div>

        {/* Multi-Planet Conjunctions Summary */}
        <div
          style={{
            marginTop: '12px',
            padding: '10px 14px',
            background: 'var(--bg-subtle)',
            borderRadius: '8px',
            fontSize: '13px',
            lineHeight: 1.5,
          }}
        >
          <strong style={{ color: 'var(--accent)' }}>
            <Layers size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            {isHi ? 'सक्रिय ग्रह युति सारांश: ' : 'Active Conjunctions Overview: '}
          </strong>
          {isHi ? report.activeConjunctionsSummaryHi : report.activeConjunctionsSummaryEn}
        </div>

        {/* Critical Alerts Banner */}
        {((isHi ? report.criticalPlanetaryAlertsHi : report.criticalPlanetaryAlertsEn) || []).length > 0 && (
          <div
            style={{
              marginTop: '10px',
              padding: '10px 14px',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '8px',
              fontSize: '12.5px',
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: 'var(--color-combust, #ef4444)',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <AlertTriangle size={14} />
              <span>{isHi ? 'महत्वपूर्ण ग्रहीय सावधानियां व संवेदनशीलता:' : 'Critical Planetary Alerts & Cautions:'}</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: 1.5 }}>
              {(isHi ? report.criticalPlanetaryAlertsHi : report.criticalPlanetaryAlertsEn).map((alert, idx) => (
                <li key={idx}>{alert}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Filter and Planet Selection Bar */}
      <div className="card" style={{ padding: '10px 14px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* Main Planet Dropdown Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 300px' }}>
            <Compass size={16} className="muted" />
            <span style={{ fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap' }}>
              {isHi ? 'ग्रह चुनें:' : 'Select Planet:'}
            </span>
            <select
              aria-label={isHi ? 'ग्रह चयन' : 'Select Planet'}
              className="select-compact"
              value={selectedPlanetId}
              onChange={(e) => setSelectedPlanetId(e.target.value)}
              style={{ flex: 1, minHeight: '34px', fontWeight: 600 }}
            >
              <option value="all">
                {isHi ? '🌟 सभी 12 ग्रह विहंगावलोकन (All 12 Planets Overview)' : '🌟 All 12 Planets Overview'}
              </option>
              <optgroup label={isHi ? '९ वैदिक ग्रह (9 Vedic Grahas)' : '9 Vedic Grahas'}>
                {report.planets
                  .filter((p) => !p.isOuterPlanet)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.symbol} {isHi ? p.nameHi : p.nameEn} — भाव {p.houseNumber} ({isHi ? p.signNameHi : p.signNameEn}, {p.dms})
                    </option>
                  ))}
              </optgroup>
              <optgroup label={isHi ? '३ बाह्य ग्रह (Uranus, Neptune, Pluto)' : '3 Outer Planets'}>
                {report.planets
                  .filter((p) => p.isOuterPlanet)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.symbol} {isHi ? p.nameHi : p.nameEn} — भाव {p.houseNumber} ({isHi ? p.signNameHi : p.signNameEn}, {p.dms})
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          {/* Planet Group Filter Buttons */}
          <div className="toolbar-group">
            <button
              type="button"
              className={`btn btn-sm ${filterType === 'all' ? 'btn-primary' : ''}`}
              onClick={() => setFilterType('all')}
            >
              {isHi ? 'समग्र 12 ग्रह' : 'All 12'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filterType === 'vedic' ? 'btn-primary' : ''}`}
              onClick={() => setFilterType('vedic')}
            >
              {isHi ? '९ वैदिक ग्रह' : '9 Vedic Grahas'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filterType === 'outer' ? 'btn-primary' : ''}`}
              onClick={() => setFilterType('outer')}
            >
              {isHi ? '३ बाह्य ग्रह' : '3 Outer Planets'}
            </button>
          </div>
        </div>
      </div>

      {/* Planets Event Prediction Cards Grid / Stack */}
      <div className="view-stack" style={{ gap: '16px' }}>
        {filteredPlanets.map((planet) => (
          <PlanetPredictionCard key={planet.id} planet={planet} isHi={isHi} />
        ))}
      </div>
    </div>
  );
};

interface PlanetCardProps {
  planet: PlanetEventPrediction;
  isHi: boolean;
}

const PlanetPredictionCard: React.FC<PlanetCardProps> = ({ planet, isHi }) => {
  const dignClass =
    planet.dignity === 'Exalted'
      ? 'tag-varg'
      : planet.dignity === 'Debilitated'
        ? 'tag-combust'
        : planet.dignity === 'Own' || planet.dignity === 'Moolatrikona'
          ? 'tag-karaka'
          : 'tag';

  return (
    <article
      className="panel"
      style={{
        borderLeft: planet.isOuterPlanet ? '4px solid #8b5cf6' : '4px solid var(--accent)',
      }}
    >
      {/* Card Header */}
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: planet.isOuterPlanet
                ? 'rgba(139, 92, 246, 0.15)'
                : 'rgba(217, 119, 6, 0.15)',
              color: planet.isOuterPlanet ? '#8b5cf6' : 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 700,
            }}
          >
            {planet.symbol}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px' }}>
              {isHi ? planet.nameHi : planet.nameEn}{' '}
              <span className="muted" style={{ fontSize: '13px', fontWeight: 500 }}>
                ({planet.isOuterPlanet ? (isHi ? 'बाह्य ग्रह' : 'Outer Planet') : isHi ? 'वैदिक ग्रह' : 'Vedic Graha'})
              </span>
            </h3>
            <div className="muted small-text">
              {isHi
                ? `भाव ${planet.houseNumber} · ${planet.signNameHi} राशि (${planet.dms}) · ${planet.nakshatraName} नक्षत्र (पाद ${planet.pada})`
                : `House ${planet.houseNumber} · ${planet.signNameEn} (${planet.dms}) · ${planet.nakshatraName} (Pada ${planet.pada})`}
            </div>
          </div>
        </div>

        {/* Tags / Status Badges */}
        <div className="toolbar-group">
          <span className={`tag ${dignClass}`}>
            {isHi ? trTerm(planet.dignity, 'hi') : planet.dignity}
          </span>
          {planet.isRetrograde && (
            <span className="tag tag-combust">{isHi ? 'वक्री (R)' : 'Retrograde (R)'}</span>
          )}
          {planet.isCombust && (
            <span className="tag tag-combust">{isHi ? 'अस्त (Combust)' : 'Combust'}</span>
          )}
          {planet.isVargottama && (
            <span className="tag tag-varg">{isHi ? 'वर्गोत्तम' : 'Vargottama'}</span>
          )}
          {planet.ownedHouses.length > 0 && (
            <span className="tag">
              {isHi
                ? `भावेश: ${planet.ownedHouses.join(', ')}`
                : `Lord of: H${planet.ownedHouses.join(', H')}`}
            </span>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="pred-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Placement Summary */}
        <div
          style={{
            padding: '10px 14px',
            background: 'var(--bg-subtle)',
            borderRadius: '6px',
            fontSize: '13px',
            lineHeight: 1.5,
          }}
        >
          <strong>{isHi ? 'ग्रह स्थिति व संबंध: ' : 'Placement & Influences: '}</strong>
          {isHi ? planet.placementSummaryHi : planet.placementSummaryEn}
        </div>

        {/* Two-Column Grid: Positive Events vs Negative Events */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '12px',
          }}
        >
          {/* Positive Events Card */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              background: 'rgba(34, 197, 94, 0.06)',
              border: '1px solid rgba(34, 197, 94, 0.22)',
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: '#16a34a',
                fontSize: '13.5px',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <CheckCircle size={15} />
              <span>{isHi ? 'सकारात्मक जीवन घटनाएँ व उपलब्धियां' : 'Concrete Positive Events & Milestones'}</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', lineHeight: 1.55 }}>
              {(isHi ? planet.positiveEventsHi : planet.positiveEventsEn).map((event, idx) => (
                <li key={idx} style={{ marginBottom: '6px' }}>
                  {event}
                </li>
              ))}
            </ul>
          </div>

          {/* Negative Events & Hazards Card */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.06)',
              border: '1px solid rgba(239, 68, 68, 0.22)',
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: '#dc2626',
                fontSize: '13.5px',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <AlertTriangle size={15} />
              <span>{isHi ? 'नकारात्मक घटनाएँ, खतरे व सावधानियाँ' : 'Concrete Negative Events & Hazard Alerts'}</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', lineHeight: 1.55 }}>
              {(isHi ? planet.negativeEventsHi : planet.negativeEventsEn).map((hazard, idx) => (
                <li key={idx} style={{ marginBottom: '6px' }}>
                  {hazard}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Timing Triggers & Critical Age Windows */}
        <div
          style={{
            padding: '10px 14px',
            background: 'rgba(59, 130, 246, 0.06)',
            border: '1px solid rgba(59, 130, 246, 0.22)',
            borderRadius: '8px',
            fontSize: '13px',
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: '#2563eb',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={15} />
              <span>{isHi ? 'घटना फलन समय व दशा/गोचर ट्रिगर:' : 'Event Materialization & Timing Triggers:'}</span>
            </span>
            {planet.keyAgeWindows.length > 0 && (
              <span className="mono" style={{ fontSize: '12px', fontWeight: 600 }}>
                {isHi ? 'सक्रिय आयु वर्ष:' : 'Critical Ages:'}{' '}
                {planet.keyAgeWindows.map((age) => `${age}y`).join(', ')}
              </span>
            )}
          </div>
          <div style={{ lineHeight: 1.5 }}>
            {isHi ? planet.timingTriggersHi : planet.timingTriggersEn}
          </div>
        </div>

        {/* Actionable Remedies & Safeguards */}
        <div
          style={{
            padding: '10px 14px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            fontSize: '12.5px',
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: 'var(--accent)',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Shield size={14} />
            <span>{isHi ? 'अचूक शास्त्रीय व व्यावहारिक उपाय (Remedies):' : 'Classical & Practical Remedies:'}</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: 1.5 }}>
            {(isHi ? planet.remediesHi : planet.remediesEn).map((rem, idx) => (
              <li key={idx} style={{ marginBottom: '4px' }}>
                {rem}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
};
