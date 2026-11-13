import React, { useMemo, useState } from 'react';
import { BookOpen, Compass, Sliders } from 'lucide-react';
import { NINE_GRAHAS, SIGNS } from '../../astro/constants';
import {
  analyzeBodyDegree,
  type DegreePredictionItem,
} from '../../astro/predictions/degreeWise';
import type { HouseWisePrediction } from '../../astro/predictions/houseWise';
import type { PredictionBodyId } from '../../astro/predictions/planetInSign';
import type { PredictionReport } from '../../astro/predictions/types';
import { trBadge } from '../../i18n/hindiPredictions';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet, trSign, trTerm } from '../../i18n/translations';

export const PlanetInHousePanel: React.FC<{ report: PredictionReport }> = ({ report }) => {
  const { lang, t } = useLanguage();
  const isHi = lang === 'hi';

  return (
    <section className="panel">
      <div className="panel-header">
        <h3>
          <BookOpen size={15} />{' '}
          {isHi
            ? 'विभिन्न भावों में 9 ग्रह फल (Planets in Different Houses)'
            : 'Planets in Different Houses (1st–12th Bhava Phala)'}
        </h3>
        <span className="muted small-text">{isHi ? 'शास्त्रीय फलादेश सूत्र' : 'Classical Shastra Matrix'}</span>
      </div>

      <div className="placement-cards">
        {report.planetPlacements.map((p) => (
          <article key={p.planet} className="placement-card">
            <div className="placement-card-top">
              <div>
                <strong>
                  {isHi
                    ? `${p.house}वें भाव (${p.signName}) में ${trPlanet(p.planet, lang)}`
                    : `${p.planet} in House ${p.house} (${p.signName})`}
                </strong>
                <div className="muted small-text">{p.headline}</div>
              </div>
              <span className="tag tag-karaka">{trTerm(p.dignity, lang)}</span>
            </div>
            <p className="yoga-desc">{p.classicalReading}</p>
            <div className="muted small-text">
              {p.dignityModifier} · {t.common.house} {p.house}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export const HouseWisePanel: React.FC<{
  houses: HouseWisePrediction[];
  report: PredictionReport;
}> = ({ houses, report }) => {
  const { lang, t } = useLanguage();
  const isHi = lang === 'hi';
  const [selectedHouse, setSelectedHouse] = useState<number | 'all'>('all');

  const visibleHouses =
    selectedHouse === 'all' ? houses : houses.filter((h) => h.houseNumber === selectedHouse);

  return (
    <div className="view-stack">
      {/* Quick Lagna + Nakshatra + Atmakaraka Overview Banner */}
      <div className="pred-top-grid">
        <section className="panel pred-hero-card">
          <div className="panel-header">
            <h3>
              <Compass size={15} />{' '}
              {isHi
                ? `${report.lagnaProfile.signName} लग्न — मूल जीवन सारांश`
                : `${report.lagnaProfile.signName} Lagna — Core Chart Overview`}
            </h3>
            <span className="tag">{isHi ? 'प्रथम भाव आधार' : 'H1 Foundation'}</span>
          </div>
          <div className="pred-card-body">
            <p>{report.lagnaProfile.temperament}</p>
            <div className="pred-bullets">
              <div>
                <strong>{isHi ? 'शुभ ग्रह:' : 'Functional Benefics:'}</strong>{' '}
                {report.lagnaProfile.beneficList.map((id) => trPlanet(id, lang)).join(', ')}
              </div>
              <div>
                <strong>{isHi ? 'अकारक / मारक ग्रह:' : 'Challenging / Maraka:'}</strong>{' '}
                {report.lagnaProfile.maleficList.map((id) => trPlanet(id, lang)).join(', ')} ·{' '}
                <span className="muted">
                  {report.lagnaProfile.marakaList.map((id) => trPlanet(id, lang)).join(', ')}
                </span>
              </div>
              <div>
                <strong>{isHi ? 'जन्म नक्षत्र व आत्मकारक:' : 'Moon Nakshatra & Atmakaraka:'}</strong>{' '}
                {report.nakshatraProfile.name} ({isHi ? 'चरण' : 'Pada'} {report.nakshatraProfile.pada}) ·{' '}
                {report.atmakarakaInsight.planet} ({t.common.house}{report.atmakarakaInsight.house})
              </div>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>{isHi ? '8 जीवन स्तंभ स्कोर (Life Pillars)' : '8 Core Life Domain Ratings'}</h3>
          </div>
          <div className="two-col-split-pad">
            <div className="table-scroll">
              <table className="data-table">
                <tbody>
                  {report.lifeDomains.map((d) => (
                    <tr key={d.id}>
                      <td><strong>{d.title}</strong></td>
                      <td className="mono">{d.rating}/100</td>
                      <td>
                        <span
                          className={`tag ${
                            d.rating >= 62 ? 'tag-varg' : d.rating >= 46 ? 'tag-karaka' : 'tag-combust'
                          }`}
                        >
                          {trBadge(d.verdict, lang)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {/* 12 Houses Holistic Synthesizer */}
      <section className="panel">
        <div className="panel-header">
          <h3>
            {isHi
              ? 'द्वादश भाव संपूर्ण फलादेश (1st to 12th House-wise Predictions)'
              : 'House-wise Predictions (1st to 12th House Complete Analysis)'}
          </h3>
          <div className="toolbar-group">
            <select
              className="select-compact"
              value={selectedHouse}
              onChange={(e) =>
                setSelectedHouse(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
            >
              <option value="all">{isHi ? 'सभी 12 भाव दिखाएँ' : 'All 12 Houses (H1–H12)'}</option>
              {houses.map((h) => (
                <option key={h.houseNumber} value={h.houseNumber}>
                  {isHi ? h.titleHi : h.titleEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="domains-grid">
          {visibleHouses.map((h) => {
            const tone = h.score >= 75 ? 'high' : h.score >= 55 ? 'mid' : 'low';
            return (
              <article key={h.houseNumber} className="domain-card">
                <div className="domain-top">
                  <div>
                    <h4>{isHi ? h.titleHi : h.titleEn}</h4>
                    <div className="muted small-text">
                      {trSign(h.signIndex, lang)} · {isHi ? 'भावेष:' : 'Lord:'}{' '}
                      {trPlanet(h.lordPlanet, lang)} → {t.common.house}{h.lordPlacedHouse} (
                      {trTerm(h.lordDignity, lang)})
                    </div>
                  </div>
                  <div className="domain-score-badge">
                    <strong className={`mono tone-text-${tone}`}>{h.score}</strong>
                    <span>/100</span>
                  </div>
                </div>

                <div className="bar-track">
                  <div className={`bar-fill tone-${tone}`} style={{ width: `${h.score}%` }} />
                </div>

                <div className="domain-verdict-row">
                  <span
                    className={`tag ${
                      h.score >= 70 ? 'tag-varg' : h.score >= 55 ? 'tag-karaka' : 'tag-combust'
                    }`}
                  >
                    {isHi ? h.verdictHi : h.verdictEn}
                  </span>
                  <span className="muted small-text mono">
                    SAV: {h.savBindus} · {isHi ? 'कारक:' : 'Karaka:'} {trPlanet(h.naturalKaraka, lang)}
                  </span>
                </div>

                <p className="domain-summary">{isHi ? h.synthesisHi : h.synthesisEn}</p>
                <p className="yoga-desc">
                  <strong>{isHi ? 'भावेश फल:' : 'House Lord Placement:'}</strong>{' '}
                  {isHi ? h.lordReadingHi : h.lordReadingEn}
                </p>

                {(h.chalitShiftNoteHi || h.chalitShiftNoteEn) && (
                  <div className="gochar-banner is-info">
                    {isHi ? h.chalitShiftNoteHi : h.chalitShiftNoteEn}
                  </div>
                )}

                <div className="domain-factors">
                  <span className="factor-chip">
                    {isHi ? 'स्थित ग्रह:' : 'Occupants:'}{' '}
                    {h.occupants.length
                      ? h.occupants.map((o) => trPlanet(o, lang)).join(', ')
                      : isHi ? 'रिक्त' : 'None'}
                  </span>
                  <span className="factor-chip">
                    {isHi ? 'दृष्टि:' : 'Aspects:'}{' '}
                    {h.aspectingPlanets.length
                      ? h.aspectingPlanets.map((a) => trPlanet(a, lang)).join(', ')
                      : isHi ? 'कोई नहीं' : 'None'}
                  </span>
                </div>
                <div className="small-text muted" style={{ marginTop: 6 }}>
                  <strong>{isHi ? 'उपाय:' : 'Upay / Guidance:'}</strong>{' '}
                  {isHi
                    ? `${trPlanet(h.lordPlanet, lang)} के मंत्र-जप एवं सात्विक दान से ${h.houseNumber}वें भाव का शुभत्व बढ़ता है।`
                    : `Honor ${h.lordPlanet} on its weekday and cultivate discipline in House ${h.houseNumber} affairs.`}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export const DegreeWisePanel: React.FC<{ items: DegreePredictionItem[] }> = ({ items }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [simPlanet, setSimPlanet] = useState<PredictionBodyId>('Sun');
  const [simSign, setSimSign] = useState<number>(0);
  const [simDeg, setSimDeg] = useState<number>(15);

  const simResult = useMemo(
    () =>
      analyzeBodyDegree(
        simPlanet,
        simSign,
        simDeg,
        `${Math.floor(simDeg)}°00'00"`,
        simSign * 30 + simDeg
      ),
    [simPlanet, simSign, simDeg]
  );

  return (
    <div className="view-stack">
      <section className="panel">
        <div className="panel-header">
          <h3>
            <Sliders size={15} />{' '}
            {isHi
              ? 'अंश-वार फलादेश (Degree-wise Predictions — बलादि अवस्था, पुष्कर व गंडांत जांच)'
              : 'Degree-wise Predictions (0°–30° Baladi Avastha, Pushkara & Critical Degrees)'}
          </h3>
          <span className="muted small-text">{isHi ? 'ग्रह अवस्था विश्लेषण' : 'Planetary Avasthas & States'}</span>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>{isHi ? 'ग्रह / लग्न' : 'Body'}</th>
                <th>{isHi ? 'राशि व अंश' : 'Sign & Degree'}</th>
                <th>{isHi ? 'बलादि अवस्था' : 'Baladi Avastha'}</th>
                <th>{isHi ? 'फल क्षमता' : 'Manifest %'}</th>
                <th>{isHi ? 'द्रेष्काण' : 'Drekkana'}</th>
                <th>{isHi ? 'विशेष अंश (पुष्कर / संधि)' : 'Special Degree Flags'}</th>
                <th>{isHi ? 'सूर्य से दूरी' : 'Sun Orb'}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((d) => (
                <tr key={d.planet}>
                  <td><strong>{trPlanet(d.planet, lang)}</strong></td>
                  <td className="mono">
                    {trSign(d.signIndex, lang)} {d.dms}
                  </td>
                  <td>{isHi ? d.avasthaHi : d.avasthaEn}</td>
                  <td>
                    <span
                      className={`tag ${
                        d.strengthPercent >= 75
                          ? 'tag-varg'
                          : d.strengthPercent >= 45
                            ? 'tag-karaka'
                            : 'tag-retro'
                      }`}
                    >
                      {d.strengthPercent}%
                    </span>
                  </td>
                  <td>{isHi ? d.drekkanaLabelHi : d.drekkanaLabelEn}</td>
                  <td className="wrap-cell">
                    {d.specialDegTagHi || d.specialDegTagEn ? (
                      <span
                        className={`tag ${
                          d.isGandanta || d.isRashiSandhi
                            ? 'tag-combust'
                            : d.isPushkaraBhaga || d.isPushkaraNavamsha
                              ? 'tag-varg'
                              : 'tag-karaka'
                        }`}
                      >
                        {isHi ? d.specialDegTagHi : d.specialDegTagEn}
                      </span>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td className="mono">
                    {d.sunDistanceDeg !== null ? `${d.sunDistanceDeg}°` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Detailed Degree Cards */}
      <div className="placement-cards">
        {items.map((d) => (
          <article key={d.planet} className="placement-card">
            <div className="placement-card-top">
              <strong>
                {trPlanet(d.planet, lang)} · {trSign(d.signIndex, lang)} {d.degreeInSign.toFixed(2)}°
              </strong>
              <span className="tag tag-karaka">{d.strengthPercent}%</span>
            </div>
            <p className="yoga-desc">{isHi ? d.readingHi : d.readingEn}</p>
          </article>
        ))}
      </div>

      {/* Interactive 0°–30° Degree Simulator */}
      <section className="panel">
        <div className="panel-header">
          <h3>
            {isHi
              ? 'अंश कैलकुलेटर (0°–30° किसी भी डिग्री का फल जांचें)'
              : 'Interactive Degree (Ansha) Simulator (0°–30°)'}
          </h3>
          <div className="toolbar-group">
            <select
              className="select-compact"
              value={simPlanet}
              onChange={(e) => setSimPlanet(e.target.value as PredictionBodyId)}
            >
              {(['Asc', ...NINE_GRAHAS] as PredictionBodyId[]).map((b) => (
                <option key={b} value={b}>{trPlanet(b, lang)}</option>
              ))}
            </select>
            <select
              className="select-compact"
              value={simSign}
              onChange={(e) => setSimSign(Number(e.target.value))}
            >
              {SIGNS.map((s) => (
                <option key={s.index} value={s.index}>{trSign(s.index, lang)}</option>
              ))}
            </select>
            <input
              type="range"
              min={0}
              max={29.9}
              step={0.5}
              value={simDeg}
              onChange={(e) => setSimDeg(Number(e.target.value))}
            />
            <span className="mono tag tag-karaka">{simDeg.toFixed(1)}°</span>
          </div>
        </div>
        <div className="pred-card-body">
          <p className="lead-text">
            {isHi ? simResult.avasthaHi : simResult.avasthaEn} ({simResult.strengthPercent}%) ·{' '}
            {isHi ? simResult.drekkanaLabelHi : simResult.drekkanaLabelEn}
          </p>
          <p>{isHi ? simResult.readingHi : simResult.readingEn}</p>
        </div>
      </section>
    </div>
  );
};
