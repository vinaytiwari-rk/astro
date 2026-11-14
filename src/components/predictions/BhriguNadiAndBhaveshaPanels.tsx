import React, { useMemo, useState } from 'react';
import {
  Activity,
  Award,
  BookOpen,
  Briefcase,
  Compass,
  Flame,
  Heart,
  Layers,
  Shield,
  Sparkles,
  Star,
} from 'lucide-react';
import { getBhavesha144Entry } from '../../astro/predictions/bhavesha144';
import type { BhriguNandiNadiReport } from '../../astro/predictions/bhriguNandiNadi';
import type { HouseLordPrediction } from '../../astro/predictions/types';
import {
  computeComprehensiveNadiReport,
  type FullNadiReport,
} from '../../astro/nadiAstrology';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet, trSign } from '../../i18n/translations';

interface BhriguNadiPanelProps {
  report: BhriguNandiNadiReport;
  chart?: ChartData;
}

export const BhriguNadiPanel: React.FC<BhriguNadiPanelProps> = ({ report, chart }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [nadiStream, setNadiStream] = useState<
    'bnn' | 'agastya' | 'kaushik' | 'shiva' | 'jeeva'
  >('bnn');

  const fullNadi: FullNadiReport | null = useMemo(() => {
    if (!chart) return null;
    return computeComprehensiveNadiReport(chart);
  }, [chart]);

  return (
    <div className="view-stack">
      {/* Nadi Traditions Ribbon */}
      <div
        className="card"
        style={{
          padding: '8px 12px',
          background: 'var(--bg-elevated)',
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          borderBottom: '2px solid var(--accent)',
        }}
      >
        <button
          type="button"
          className={`subtab-btn ${nadiStream === 'bnn' ? 'is-active' : ''}`}
          onClick={() => setNadiStream('bnn')}
        >
          <Compass size={14} style={{ marginRight: 5, verticalAlign: 'middle' }} />
          {isHi ? 'भृगु नंदी नाड़ी (BNN & त्रिकोण)' : 'Bhrigu Nandi Nadi (BNN)'}
        </button>

        <button
          type="button"
          className={`subtab-btn ${nadiStream === 'agastya' ? 'is-active' : ''}`}
          onClick={() => setNadiStream('agastya')}
        >
          <BookOpen size={14} style={{ marginRight: 5, verticalAlign: 'middle' }} />
          {isHi ? 'अगस्त्य नाड़ी (14 काण्डम्)' : 'Agastya Nadi (14 Kandams)'}
        </button>

        <button
          type="button"
          className={`subtab-btn ${nadiStream === 'kaushik' ? 'is-active' : ''}`}
          onClick={() => setNadiStream('kaushik')}
        >
          <Flame size={14} style={{ marginRight: 5, verticalAlign: 'middle' }} />
          {isHi ? 'कौशिक नाड़ी (तपोबल व भाग्योदय)' : 'Kaushik Nadi (Tapas & Breakthrough)'}
        </button>

        <button
          type="button"
          className={`subtab-btn ${nadiStream === 'shiva' ? 'is-active' : ''}`}
          onClick={() => setNadiStream('shiva')}
        >
          <Shield size={14} style={{ marginRight: 5, verticalAlign: 'middle' }} />
          {isHi ? 'शिव नाड़ी (शिव-पार्वती संवाद व ज्योतिर्लिंग)' : 'Shiva Nadi (Dialogue & Jyotirlinga)'}
        </button>

        <button
          type="button"
          className={`subtab-btn ${nadiStream === 'jeeva' ? 'is-active' : ''}`}
          onClick={() => setNadiStream('jeeva')}
        >
          <Sparkles size={14} style={{ marginRight: 5, verticalAlign: 'middle' }} />
          {isHi ? 'जीव नाड़ी (गुरु-शनि समन्वय व BCP)' : 'Jeeva Nadi (Guru-Shani & BCP)'}
        </button>
      </div>

      {/* 1. BHRIGU NANDI NADI */}
      {nadiStream === 'bnn' && (
        <>
          <section className="panel">
            <div className="panel-header">
              <h3>
                <Compass size={15} />{' '}
                {isHi
                  ? 'भृगु नंदी नाड़ी ज्योतिष (Bhrigu Nandi Nadi — 1-5-9 त्रिकोण एवं कारकाधारित सूत्र)'
                  : 'Bhrigu Nandi Nadi (BNN) — 1-5-9 Directional Chain System'}
              </h3>
              <span className="muted small-text">{isHi ? 'दिशा त्रिकोण एवं कारक संबंध' : 'Directional Trines & Karaka Linkages'}</span>
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

            <div className="two-col-split-pad" style={{ marginTop: 10 }}>
              <div className="gochar-banner is-info">
                <strong>{isHi ? 'राहु-केतु कर्मिक अक्ष (Rule 10):' : 'Rahu-Ketu Karmic Axis (Rule 10):'}</strong>{' '}
                {isHi ? report.rahuKetuAxisHi : report.rahuKetuAxisEn}
              </div>
              <div className="gochar-banner is-clear">
                <strong>{isHi ? 'शनि कर्म पार्श्व-प्रभाव (Rule 4):' : 'Saturn Flanking Karma (Rule 4):'}</strong>{' '}
                {isHi ? report.flankingKarmaHi : report.flankingKarmaEn}
              </div>
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
                <h3>{isHi ? 'नाड़ी चिकित्सा व रोग संकेत' : 'BNN Health & Disease Combinations'}</h3>
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
        </>
      )}

      {/* 2. AGASTYA NADI 14 KANDAMS */}
      {nadiStream === 'agastya' && fullNadi && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              <BookOpen size={16} />{' '}
              {isHi
                ? 'अगस्त्य नाड़ी संहिता (Agastya Nadi — 14 शास्त्रीय काण्डम् विश्लेषण)'
                : 'Agastya Nadi Samhita — 14 Classical Kandams Life Foliation'}
            </h3>
            <span className="tag tag-varg">14 {isHi ? 'काण्डम्' : 'Kandams'}</span>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{isHi ? 'काण्डम् नाम' : 'Kandam Name'}</th>
                  <th>{isHi ? 'क्षेत्र / विषय' : 'Theme'}</th>
                  <th>{isHi ? 'शासक ग्रह' : 'Rulers'}</th>
                  <th>{isHi ? 'स्थिति' : 'Outlook'}</th>
                  <th>{isHi ? 'अगस्त्य नाड़ी सूत्र फलादेश' : 'Agastya Palm Leaf Inscription'}</th>
                </tr>
              </thead>
              <tbody>
                {fullNadi.agastyaKandams.map((k) => (
                  <tr key={k.kandamNumber}>
                    <td className="mono">#{k.kandamNumber}</td>
                    <td><strong>{isHi ? k.nameHi : k.nameEn}</strong></td>
                    <td>{isHi ? k.themeHi : k.themeEn}</td>
                    <td>
                      {k.rulingPlanets.map((p) => (
                        <span key={p} className="tag tag-varg mono" style={{ marginRight: 4 }}>
                          {trPlanet(p, lang)}
                        </span>
                      ))}
                    </td>
                    <td>
                      <span className={`tag ${k.isFortunate ? 'tag-varg' : 'tag-karaka'}`}>
                        {k.isFortunate ? (isHi ? 'शुभ' : 'Favorable') : (isHi ? 'साधना योग्य' : 'Disciplined')}
                      </span>
                    </td>
                    <td className="wrap-cell small-cell">{isHi ? k.verdictHi : k.verdictEn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 3. KAUSHIK NADI */}
      {nadiStream === 'kaushik' && fullNadi && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              <Flame size={16} />{' '}
              {isHi
                ? 'कौशिक (विश्वामित्र) नाड़ी — तपोबल, परीक्षा एवं युगांतरकारी भाग्योदय'
                : 'Kaushik (Vishwamitra) Nadi — Tapas Crucible & Breakthrough Age'}
            </h3>
            <span className="tag tag-karaka">
              {isHi ? `भाग्योदय वर्ष: ${fullNadi.kaushikTapas.breakthroughAge}` : `Breakthrough: Age ${fullNadi.kaushikTapas.breakthroughAge}`}
            </span>
          </div>

          <div className="pred-card-body">
            <div className="gochar-banner is-info">
              <strong>{isHi ? 'तपोबल एवं प्रारंभिक संघर्ष सूत्र:' : 'Tapas Crucible & Karmic Testing:'}</strong>{' '}
              {isHi ? fullNadi.kaushikTapas.trialThemeHi : fullNadi.kaushikTapas.trialThemeEn}
            </div>

            <div className="gochar-banner is-clear" style={{ marginTop: 12 }}>
              <strong>{isHi ? 'प्रतिष्ठा व सफलता का शिखर:' : 'Apex Milestone Elevation:'}</strong>{' '}
              {isHi ? fullNadi.kaushikTapas.elevationHi : fullNadi.kaushikTapas.elevationEn}
            </div>
          </div>
        </section>
      )}

      {/* 4. SHIVA NADI */}
      {nadiStream === 'shiva' && fullNadi && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              <Shield size={16} />{' '}
              {isHi
                ? 'शिव नाड़ी (शिव-पार्वती संवाद — आत्मा का प्रारब्ध एवं ज्योतिर्लिंग सेवा)'
                : 'Shiva Nadi — Shiva-Parvati Dialogue on Soul Prarabdha & Jyotirlinga Seva'}
            </h3>
            <span className="tag tag-varg">{fullNadi.shivaNadi.karmaClassificationHi}</span>
          </div>

          <div className="pred-card-body">
            <div className="gochar-banner is-clear">
              <strong>{isHi ? 'भगवान शिव का वचन:' : 'Divine Decree:'}</strong>{' '}
              {isHi ? fullNadi.shivaNadi.divineDecreeHi : fullNadi.shivaNadi.divineDecreeEn}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 12,
                marginTop: 14,
              }}
            >
              <div style={{ background: 'var(--bg-subtle)', padding: 12, borderRadius: 8, border: '1px solid var(--border)' }}>
                <div className="muted small-text">🔱 {isHi ? 'अनुशंसित ज्योतिर्लिंग तीर्थ' : 'Recommended Jyotirlinga Sanctuary'}</div>
                <div style={{ marginTop: 4, fontWeight: 700, fontSize: '14px', color: 'var(--accent)' }}>
                  {isHi ? fullNadi.shivaNadi.recommendedJyotirlingaHi : fullNadi.shivaNadi.recommendedJyotirlingaEn}
                </div>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: 12, borderRadius: 8, border: '1px solid var(--border)' }}>
                <div className="muted small-text">🌿 {isHi ? 'शिव नाड़ी परिहार व सेवा' : 'Shiva Nadi Karmic Remediation'}</div>
                <div style={{ marginTop: 4, fontSize: '13px', lineHeight: 1.4 }}>
                  {isHi ? fullNadi.shivaNadi.shivaPariharaHi : fullNadi.shivaNadi.shivaPariharaEn}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. JEEVA NADI */}
      {nadiStream === 'jeeva' && fullNadi && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              <Sparkles size={16} />{' '}
              {isHi
                ? 'जीव नाड़ी (Jeeva Nadi — गुरु-शनि समन्वय, भृगु बिंदु व BCP कालचक्र)'
                : 'Jeeva Nadi — Jupiter-Saturn Convergence, Bhrigu Bindu & BCP'}
            </h3>
            <span className="tag tag-varg">
              {isHi ? `सक्रिय भाव: ${fullNadi.bcpActiveHouse}` : `BCP Active House: ${fullNadi.bcpActiveHouse}`}
            </span>
          </div>

          <div className="pred-card-body">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 12,
                marginBottom: 14,
              }}
            >
              <div style={{ background: 'var(--bg-subtle)', padding: 12, borderRadius: 8, border: '1px solid var(--border)' }}>
                <div className="muted small-text">🌱 {isHi ? 'जीव कारक (गुरु)' : 'Jeeva Karaka (Jupiter)'}</div>
                <div style={{ marginTop: 4, fontWeight: 700, fontSize: '13.5px', color: 'var(--accent)' }}>
                  {isHi ? fullNadi.jeevaSynthesis.jeevaPlacementHi : fullNadi.jeevaSynthesis.jeevaPlacementEn}
                </div>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: 12, borderRadius: 8, border: '1px solid var(--border)' }}>
                <div className="muted small-text">⚖️ {isHi ? 'कर्म कारक (शनि)' : 'Karma Karaka (Saturn)'}</div>
                <div style={{ marginTop: 4, fontWeight: 700, fontSize: '13.5px', color: 'var(--accent)' }}>
                  {isHi ? fullNadi.jeevaSynthesis.karmaPlacementHi : fullNadi.jeevaSynthesis.karmaPlacementEn}
                </div>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: 12, borderRadius: 8, border: '1px solid var(--border)' }}>
                <div className="muted small-text">🎯 {isHi ? 'भृगु बिंदु (Bhrigu Bindu)' : 'Bhrigu Bindu (Destiny Focus)'}</div>
                <div style={{ marginTop: 4, fontWeight: 700, fontSize: '13.5px', color: '#10b981' }}>
                  {isHi ? fullNadi.bhriguBinduSignHi : fullNadi.bhriguBinduSignEn} ({fullNadi.bhriguBinduDegree}°)
                </div>
              </div>
            </div>

            <div className="gochar-banner is-info">
              <strong>{isHi ? 'जीव-कर्म समन्वय सूत्र:' : 'Jeeva-Karma Synthesis:'}</strong>{' '}
              {isHi ? fullNadi.jeevaSynthesis.jeevaKarmaLinkHi : fullNadi.jeevaSynthesis.jeevaKarmaLinkEn}
            </div>

            <div className="gochar-banner is-clear" style={{ marginTop: 10 }}>
              <strong>{isHi ? 'वर्तमान BCP चक्र सक्रियता:' : 'Current BCP Progression:'}</strong>{' '}
              {isHi ? fullNadi.jeevaSynthesis.currentAgeActivationHi : fullNadi.jeevaSynthesis.currentAgeActivationEn}
            </div>
          </div>
        </section>
      )}
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
