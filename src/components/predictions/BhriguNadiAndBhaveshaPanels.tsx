import React, { useMemo, useState } from 'react';
import { Activity, Briefcase, Compass, Heart, Sparkles } from 'lucide-react';
import { getBhavesha144Entry } from '../../astro/predictions/bhavesha144';
import type { BhriguNandiNadiReport } from '../../astro/predictions/bhriguNandiNadi';
import type { HouseLordPrediction } from '../../astro/predictions/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet, trSign } from '../../i18n/translations';

export const BhriguNadiPanel: React.FC<{ report: BhriguNandiNadiReport }> = ({ report }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  return (
    <div className="view-stack">
      <section className="panel">
        <div className="panel-header">
          <h3>
            <Compass size={15} />{' '}
            {isHi
              ? 'भृगु नंदी नाड़ी ज्योतिष (Bhrigu Nandi Nadi — कारकाधारित एवं 1-5-9 त्रिकोण पद्धति)'
              : 'Bhrigu Nandi Nadi (BNN) — Karaka & 1-5-9 Directional Chain System'}
          </h3>
          <span className="muted small-text">{report.sources.join(' · ')}</span>
        </div>

        <div className="domains-grid">
          {report.directionLines.map((line) => (
            <article key={line.direction} className="domain-card">
              <div className="domain-top">
                <div>
                  <h4>{isHi ? line.directionHi : `${line.direction} Direction Nadi`}</h4>
                  <div className="muted small-text">
                    {isHi ? `${line.elementHi} · ${line.signsHi}` : `${line.elementEn} · ${line.signsEn}`}
                  </div>
                </div>
                <span className="tag tag-karaka">{line.planetsInLine.length} {isHi ? 'ग्रह' : 'Grahas'}</span>
              </div>

              {line.planetsInLine.length > 0 && (
                <div className="rp-chip-row">
                  {line.planetsInLine.map((pl) => (
                    <span key={pl.id} className="tag tag-varg">
                      {trPlanet(pl.id, lang)} ({trSign(pl.signIndex, lang)}{' '}
                      {pl.degreeInSign.toFixed(1)}°{pl.isRetrograde ? (isHi ? ' व' : ' R') : ''})
                    </span>
                  ))}
                </div>
              )}

              <p className="domain-summary">{isHi ? line.synthesisHi : line.synthesisEn}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Core BNN Engines: Saturn Karma, Jupiter Jiva, Marriage & Retrograde */}
      <div className="domains-grid" style={{ padding: 0 }}>
        <section className="panel">
          <div className="panel-header">
            <h3><Briefcase size={15} /> {isHi ? 'कर्म-कारक शनि (करियर नाड़ी शृंखला)' : 'Saturn (Karma Karaka) Career Chain'}</h3>
          </div>
          <div className="pred-card-body">
            <p>{isHi ? report.karmaCareerHi : report.karmaCareerEn}</p>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3><Sparkles size={15} /> {isHi ? 'जीव-कारक गुरु (धन व जीवन प्रवाह)' : 'Jupiter (Jiva Karaka) Wealth & Grace'}</h3>
          </div>
          <div className="pred-card-body">
            <p>{isHi ? report.jivaWealthHi : report.jivaWealthEn}</p>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3><Heart size={15} /> {isHi ? 'BNN विवाह व प्रेम-विवाह नियम' : 'BNN Marriage & Relationship Rules'}</h3>
          </div>
          <div className="pred-card-body">
            <p>{isHi ? report.marriageNadiHi : report.marriageNadiEn}</p>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3><Activity size={15} /> {isHi ? 'वक्री (Retrograde) एवं नाड़ी विनिमय' : 'Vakri (Backward) & Sign Exchange Rules'}</h3>
          </div>
          <div className="pred-card-body">
            <p>{isHi ? report.retrogradeShiftsHi : report.retrogradeShiftsEn}</p>
            <p className="muted small-text">{isHi ? report.exchangesHi : report.exchangesEn}</p>
          </div>
        </section>
      </div>

      {/* BNN Disease Alerts + 12-Yr Guru Cycle */}
      <div className="pred-top-grid">
        <section className="panel">
          <div className="panel-header">
            <h3>
              {isHi
                ? 'नाड़ी चिकित्सा व रोग संकेत'
                : 'BNN Health & Disease Combinations'}
            </h3>
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isHi ? 'नाड़ी योग' : 'Combination'}</th>
                  <th>{isHi ? 'स्थिति' : 'Status'}</th>
                  <th>{isHi ? 'प्रभाव' : 'Observation'}</th>
                </tr>
              </thead>
              <tbody>
                {report.diseaseAlerts.map((d, idx) => (
                  <tr key={idx}>
                    <td><strong>{isHi ? d.comboHi : d.comboEn}</strong></td>
                    <td>
                      <span className={`tag ${d.triggered ? 'tag-combust' : 'tag-varg'}`}>
                        {d.triggered ? (isHi ? 'सक्रिय' : 'Active') : (isHi ? 'साफ़' : 'Clear')}
                      </span>
                    </td>
                    <td className="wrap-cell">{isHi ? d.readingHi : d.readingEn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>{isHi ? 'भृगु 12-वर्षीय गुरु गोचर जीवन चक्र' : 'Bhrigu 12-Year Jupiter Progression Cycles'}</h3>
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isHi ? 'आयु' : 'Age'}</th>
                  <th>{isHi ? 'चरण व फल' : 'Life Chapter & Focus'}</th>
                </tr>
              </thead>
              <tbody>
                {report.guruCycles12Yr.map((c, idx) => (
                  <tr key={idx}>
                    <td className="mono"><strong>{c.ageRange}</strong></td>
                    <td className="wrap-cell">
                      <strong>{isHi ? c.cycleNameHi : c.cycleNameEn}:</strong>{' '}
                      {isHi ? c.themeHi : c.themeEn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export const Bhavesha144Panel: React.FC<{ houseLordships: HouseLordPrediction[] }> = ({
  houseLordships,
}) => {
  const { lang, t } = useLanguage();
  const isHi = lang === 'hi';

  const [simLordHouse, setSimLordHouse] = useState<number>(9);
  const [simPlacedHouse, setSimPlacedHouse] = useState<number>(7);
  const simEntry = useMemo(
    () => getBhavesha144Entry(simLordHouse, simPlacedHouse),
    [simLordHouse, simPlacedHouse]
  );

  return (
    <div className="view-stack">
      <section className="panel">
        <div className="panel-header">
          <h3>
            <Compass size={15} />{' '}
            {isHi
              ? 'आपकी कुंडली के द्वादश भावेशों की स्थिति (कौन-सा भावेश किस भाव में)'
              : 'Your Chart’s 12 House Lords Placed in Houses'}
          </h3>
        </div>

        <div className="placement-cards">
          {houseLordships.map((hl) => (
            <article key={hl.lordHouse} className="placement-card">
              <div className="placement-card-top">
                <div>
                  <strong>{hl.headline}</strong>
                  <div className="muted small-text">
                    {isHi ? 'स्वामी:' : 'Lord:'} {trPlanet(hl.planet, lang)} ·{' '}
                    {isHi ? 'राशि:' : 'Sign:'} {hl.placedSign}
                  </div>
                </div>
                <span className="tag tag-karaka">
                  {t.common.house}{hl.lordHouse} → {t.common.house}{hl.placedHouse}
                </span>
              </div>
              <p className="yoga-desc">{hl.reading}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Interactive 12x12 = 144 Reference Explorer */}
      <section className="panel">
        <div className="panel-header">
          <h3>
            <Sparkles size={15} />{' '}
            {isHi
              ? '144 भावेश-स्थान एक्सप्लोरर (कोई भी भाव स्वामी × किसी भी भाव में देखें)'
              : 'All 144 House-Lord-in-House Matrix Explorer (e.g. 9th Lord in 7th House)'}
          </h3>
          <div className="toolbar-group">
            <select
              className="select-compact"
              value={simLordHouse}
              onChange={(e) => setSimLordHouse(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                <option key={h} value={h}>
                  {isHi ? `${h}वें भाव का स्वामी` : `${h}th House Lord`}
                </option>
              ))}
            </select>
            <span>→</span>
            <select
              className="select-compact"
              value={simPlacedHouse}
              onChange={(e) => setSimPlacedHouse(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                <option key={h} value={h}>
                  {isHi ? `${h}वें भाव में` : `in ${h}th House`}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="pred-card-body">
          <p className="lead-text">{isHi ? simEntry.headlineHi : simEntry.headlineEn}</p>
          <p>{isHi ? simEntry.readingHi : simEntry.readingEn}</p>
          <div className="gochar-banner is-info">
            <strong>{isHi ? 'प्रमुख जीवन घटनाएँ:' : 'Likely Life Events:'}</strong>{' '}
            {isHi ? simEntry.eventHi : simEntry.eventEn}
          </div>
        </div>
      </section>
    </div>
  );
};
