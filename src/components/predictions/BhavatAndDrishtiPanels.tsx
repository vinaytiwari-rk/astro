import React, { useMemo, useState } from 'react';
import { Compass, Eye, Sparkles } from 'lucide-react';
import { NINE_GRAHAS } from '../../astro/constants';
import {
  computeCustomBhavatBhavam,
  type BhavatBhavamReport,
} from '../../astro/predictions/bhavatBhavam';
import {
  inspectCustomDrishti,
  type DrishtiReport,
} from '../../astro/predictions/drishtiPredictions';
import type { ChartData, NineGrahaId } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet, trSign } from '../../i18n/translations';

export const BhavatBhavamPanel: React.FC<{
  report: BhavatBhavamReport;
  chart: ChartData;
}> = ({ report, chart }) => {
  const { lang, t } = useLanguage();
  const isHi = lang === 'hi';

  const [baseHouse, setBaseHouse] = useState<number>(7);
  const [offsetHouse, setOffsetHouse] = useState<number>(8);

  const customPair = useMemo(
    () => computeCustomBhavatBhavam(chart, baseHouse, offsetHouse),
    [chart, baseHouse, offsetHouse]
  );

  return (
    <div className="view-stack">
      <section className="panel">
        <div className="panel-header">
          <h3>
            <Compass size={15} />{' '}
            {isHi
              ? 'भावात् भावम् फलादेश (भाव से भाव का सिद्धांत — H1 से H12)'
              : 'Bhavat Bhavam Predictions (House-from-House Mirror Principle)'}
          </h3>
          <span className="muted small-text">BPHS · Phaladeepika (2H − 1 Rule)</span>
        </div>
        <div className="two-col-split-pad">
          <div className="gochar-banner is-info">
            {isHi ? report.summaryHi : report.summaryEn}
          </div>

          {/* Key Practical Relational Derivatives */}
          <h4 className="subpanel-heading">
            {isHi
              ? 'प्रमुख व्यावहारिक भावात् भावम् सूत्र (संबंधी व विशेष विषय)'
              : 'Key Classical Bhavat Bhavam Relational Indicators'}
          </h4>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isHi ? 'विषय' : 'Life Area'}</th>
                  <th>{isHi ? 'सूत्र' : 'Formula'}</th>
                  <th>{isHi ? 'निष्कर्ष (राशि · स्वामी · SAV)' : 'House Synthesis'}</th>
                </tr>
              </thead>
              <tbody>
                {report.keyDerivatives.map((kd, i) => (
                  <tr key={i}>
                    <td><strong>{isHi ? kd.topicHi : kd.topicEn}</strong></td>
                    <td><span className="tag tag-karaka mono">{isHi ? kd.formulaHi : kd.formulaEn}</span></td>
                    <td className="wrap-cell">{isHi ? kd.summaryHi : kd.summaryEn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Interactive House-from-House Calculator */}
      <section className="panel">
        <div className="panel-header">
          <h3>
            <Sparkles size={15} />{' '}
            {isHi
              ? 'इंटरैक्टिव भावात् भावम् कैलकुलेटर (किसी भाव से कोई भी भाव गिनें)'
              : 'Interactive Bhavat Bhavam Explorer (House X from House Y)'}
          </h3>
          <div className="toolbar-group">
            <label className="small-text muted">{isHi ? 'मूल भाव:' : 'From Base House:'}</label>
            <select
              className="select-compact"
              value={baseHouse}
              onChange={(e) => setBaseHouse(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                <option key={h} value={h}>{t.common.house}{h}</option>
              ))}
            </select>
            <label className="small-text muted">{isHi ? 'गिनती भाव:' : 'Count Offset:'}</label>
            <select
              className="select-compact"
              value={offsetHouse}
              onChange={(e) => setOffsetHouse(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                <option key={h} value={h}>{h}{isHi ? 'वां भाव' : 'th'}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="pred-card-body">
          <p className="lead-text">
            {isHi ? customPair.formulaHi : customPair.formulaEn} —{' '}
            {trSign(customPair.derivedSignIndex, lang)} ({trPlanet(customPair.derivedLord, lang)})
          </p>
          <p>{isHi ? customPair.summaryHi : customPair.summaryEn}</p>
        </div>
      </section>

      {/* 12 Primary-to-Mirror House Cards */}
      <section className="panel">
        <div className="panel-header">
          <h3>
            {isHi
              ? 'द्वादश भावात् भावम् पूर्ण विश्लेषण (प्रथम से द्वादश भाव)'
              : 'All 12 Houses Bhavat Bhavam Breakdown (H1 → H1 to H12 → H11)'}
          </h3>
        </div>
        <div className="domains-grid">
          {report.houses.map((item) => {
            const colorCls =
              item.tone === 'positive'
                ? 'tag-varg'
                : item.tone === 'negative'
                  ? 'tag-combust'
                  : 'tag-karaka';
            return (
              <article key={item.primaryHouse} className="domain-card">
                <div className="domain-top">
                  <div>
                    <h4>{isHi ? item.headlineHi : item.headlineEn}</h4>
                    <div className="muted small-text mono">
                      {isHi ? item.principleFormulaHi : item.principleFormulaEn} · SAV H
                      {item.primaryHouse}={item.primarySav} / H{item.mirrorHouse}={item.mirrorSav}
                    </div>
                  </div>
                  <span className={`tag ${colorCls}`}>{item.synergyScore}/100</span>
                </div>

                <p className="domain-summary">{isHi ? item.readingHi : item.readingEn}</p>

                <div className="gochar-banner is-clear">
                  <strong>{isHi ? '+ शुभ परिणाम:' : '+ Positive Reinforcement:'}</strong>{' '}
                  {isHi ? item.positiveHi : item.positiveEn}
                </div>
                <div className="gochar-banner is-alert">
                  <strong>{isHi ? '− कमज़ोरी / हानि जोखिम:' : '− Weak Spot / Risk:'}</strong>{' '}
                  {isHi ? item.negativeHi : item.negativeEn}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export const DrishtiWisePanel: React.FC<{ report: DrishtiReport }> = ({ report }) => {
  const { lang, t } = useLanguage();
  const isHi = lang === 'hi';

  const [simFrom, setSimFrom] = useState<NineGrahaId>('Jupiter');
  const [simTo, setSimTo] = useState<NineGrahaId | 'Asc'>('Moon');
  const [simOffset, setSimOffset] = useState<number>(7);

  const validOffsets =
    simFrom === 'Mars'
      ? [4, 7, 8]
      : simFrom === 'Jupiter' || simFrom === 'Rahu' || simFrom === 'Ketu'
        ? [5, 7, 9]
        : simFrom === 'Saturn'
          ? [3, 7, 10]
          : [7];

  const activeOffset = validOffsets.includes(simOffset) ? simOffset : 7;
  const simDrishti = useMemo(
    () => inspectCustomDrishti(simFrom, simTo, activeOffset),
    [simFrom, simTo, activeOffset]
  );

  return (
    <div className="view-stack">
      {/* 1. Summary & Mutual Oppositions */}
      <section className="panel">
        <div className="panel-header">
          <h3>
            <Eye size={15} />{' '}
            {isHi
              ? 'ग्रह दृष्टि फल (Aspects / Graha Drishti Predictions — 7वीं व विशेष दृष्टियाँ)'
              : 'Aspects / Drishti-Wise Predictions (Parashari Full & Special Aspects)'}
          </h3>
          <span className="muted small-text">BPHS Drishti Adhyaya · Virupas</span>
        </div>
        <div className="two-col-split-pad">
          <div className="gochar-banner is-info">{isHi ? report.summaryHi : report.summaryEn}</div>

          {report.mutualOppositions.length > 0 && (
            <>
              <h4 className="subpanel-heading">
                {isHi
                  ? `परस्पर समसप्तक (आमने-सामने 7/7) दृष्टि युग्म (${report.mutualOppositions.length})`
                  : `Mutual 1-to-7 Samasaptaka Opposition Aspects (${report.mutualOppositions.length})`}
              </h4>
              <div className="domains-grid" style={{ padding: 0 }}>
                {report.mutualOppositions.map((m, idx) => (
                  <article key={idx} className="domain-card">
                    <div className="domain-top">
                      <h4>
                        {trPlanet(m.from, lang)} ↔ {trPlanet(m.to, lang)}
                      </h4>
                      <span
                        className={`tag ${
                          m.tone === 'positive'
                            ? 'tag-varg'
                            : m.tone === 'negative'
                              ? 'tag-combust'
                              : 'tag-karaka'
                        }`}
                      >
                        {m.virupas} Virupas · {m.strengthPercent}%
                      </span>
                    </div>
                    <p className="yoga-desc">
                      <strong>+</strong> {isHi ? m.positiveHi : m.positiveEn}
                    </p>
                    <p className="yoga-desc muted">
                      <strong>−</strong> {isHi ? m.negativeHi : m.negativeEn}
                    </p>
                    <div className="gochar-banner is-info">
                      <strong>{isHi ? 'घटना प्रभाव:' : 'Event Impact:'}</strong>{' '}
                      {isHi ? m.eventHi : m.eventEn}
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* 2. All Planetary Drishti Links Table */}
      <section className="panel">
        <div className="panel-header">
          <h3>
            {isHi
              ? 'कुंडली की सभी सक्रिय ग्रह दृष्टियाँ (सूर्य–केतु से सभी ग्रहों व लग्न पर)'
              : 'All Active Planetary Aspects in Chart (Graha → Planet / Lagna)'}
          </h3>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>{isHi ? 'दृष्टि कर्ता' : 'From'}</th>
                <th>{isHi ? 'दृष्टि प्रकार' : 'Aspect Type'}</th>
                <th>{isHi ? 'लक्ष्य' : 'To Target'}</th>
                <th>{isHi ? 'बल (विरूप / %)' : 'Strength'}</th>
                <th>{isHi ? 'शुभ / अशुभ फल एवं संभावित घटना' : 'Positive, Negative & Event Impact'}</th>
              </tr>
            </thead>
            <tbody>
              {report.planetaryDrishtis.map((d, idx) => (
                <tr key={idx}>
                  <td><strong>{trPlanet(d.from, lang)}</strong></td>
                  <td>
                    <span
                      className={`tag ${
                        d.tone === 'positive'
                          ? 'tag-varg'
                          : d.tone === 'negative'
                            ? 'tag-combust'
                            : 'tag-karaka'
                      }`}
                    >
                      {isHi ? d.typeHi : d.typeEn}
                    </span>
                  </td>
                  <td><strong>{trPlanet(d.to, lang)}</strong></td>
                  <td className="mono">{d.virupas}V · {d.strengthPercent}%</td>
                  <td className="wrap-cell">
                    <div><strong>+</strong> {isHi ? d.positiveHi : d.positiveEn}</div>
                    <div className="muted"><strong>−</strong> {isHi ? d.negativeHi : d.negativeEn}</div>
                    <div><strong>{isHi ? 'घटना:' : 'Event:'}</strong> {isHi ? d.eventHi : d.eventEn}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. 12-House Aspect Matrix */}
      <section className="panel">
        <div className="panel-header">
          <h3>
            {isHi
              ? 'प्रत्येक भाव पर पड़ने वाली ग्रह दृष्टियाँ (1st to 12th House Aspect Balance)'
              : 'Drishti Balance on All 12 Houses (Benefic vs Malefic Gazes)'}
          </h3>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t.common.house}</th>
                <th>{t.common.sign}</th>
                <th>{isHi ? 'संतुलन' : 'Balance'}</th>
                <th>{isHi ? 'भाव पर दृष्टि डालने वाले ग्रह' : 'Planets Casting Drishti on House'}</th>
              </tr>
            </thead>
            <tbody>
              {report.houseDrishtis.map((hd) => (
                <tr key={hd.houseNumber}>
                  <td className="mono"><strong>{t.common.house}{hd.houseNumber}</strong></td>
                  <td>{trSign(hd.signIndex, lang)}</td>
                  <td>
                    <span
                      className={`tag ${
                        hd.tone === 'positive'
                          ? 'tag-varg'
                          : hd.tone === 'negative'
                            ? 'tag-combust'
                            : 'tag-karaka'
                      }`}
                    >
                      +{hd.beneficCount} / −{hd.maleficCount}
                    </span>
                  </td>
                  <td className="wrap-cell">{isHi ? hd.readingHi : hd.readingEn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Interactive Custom Drishti Explorer */}
      <section className="panel">
        <div className="panel-header">
          <h3>
            <Sparkles size={15} />{' '}
            {isHi
              ? 'कस्टम दृष्टि एक्सप्लोरर (कोई भी ग्रह-दृष्टि संबंध जांचें)'
              : 'Interactive Drishti Reference Explorer'}
          </h3>
          <div className="toolbar-group">
            <select
              className="select-compact"
              value={simFrom}
              onChange={(e) => setSimFrom(e.target.value as NineGrahaId)}
            >
              {NINE_GRAHAS.map((g) => (
                <option key={g} value={g}>{trPlanet(g, lang)}</option>
              ))}
            </select>
            <select
              className="select-compact"
              value={activeOffset}
              onChange={(e) => setSimOffset(Number(e.target.value))}
            >
              {validOffsets.map((o) => (
                <option key={o} value={o}>{o}{isHi ? 'वीं दृष्टि' : 'th Aspect'}</option>
              ))}
            </select>
            <select
              className="select-compact"
              value={simTo}
              onChange={(e) => setSimTo(e.target.value as NineGrahaId | 'Asc')}
            >
              <option value="Asc">{trPlanet('Asc', lang)}</option>
              {NINE_GRAHAS.map((g) => (
                <option key={g} value={g}>{trPlanet(g, lang)}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="pred-card-body">
          <p className="lead-text">{isHi ? simDrishti.headlineHi : simDrishti.headlineEn}</p>
          <div className="gochar-banner is-clear">
            <strong>+</strong> {isHi ? simDrishti.positiveHi : simDrishti.positiveEn}
          </div>
          <div className="gochar-banner is-alert">
            <strong>−</strong> {isHi ? simDrishti.negativeHi : simDrishti.negativeEn}
          </div>
          <p className="yoga-desc">
            <strong>{isHi ? 'घटना प्रभाव:' : 'Event Impact:'}</strong>{' '}
            {isHi ? simDrishti.eventHi : simDrishti.eventEn}
          </p>
        </div>
      </section>
    </div>
  );
};
