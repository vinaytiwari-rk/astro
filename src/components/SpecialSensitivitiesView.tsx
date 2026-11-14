import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Award,
  Compass,
  Flame,
  Layers,
  ShieldAlert,
  Sparkles,
  Star,
  Target,
} from 'lucide-react';
import {
  computeComprehensiveSensitivePoints,
  computeMrityuBhagaAnalysis,
  computeNavataraChakra,
  computePushkaraAnalysis,
  type MrityuBhagaStatus,
  type NavataraItem,
  type PushkaraStatus,
  type SensitivePointItem,
  type SensitivePointsReport,
} from '../astro/specialSensitivities';
import type { ChartData } from '../astro/types';
import { useLanguage } from '../i18n/LanguageContext';
import { trPlanet, trSign } from '../i18n/translations';

interface SpecialSensitivitiesViewProps {
  chart: ChartData;
  initialTab?: 'mrityu' | 'pushkara' | 'navatara' | 'lagnas_arudhas' | 'shodhya_pinda';
}

export const SpecialSensitivitiesView: React.FC<SpecialSensitivitiesViewProps> = ({
  chart,
  initialTab = 'lagnas_arudhas',
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [activeTab, setActiveTab] = useState<
    'mrityu' | 'pushkara' | 'navatara' | 'lagnas_arudhas' | 'shodhya_pinda'
  >(initialTab);

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const mrityuData = useMemo(() => computeMrityuBhagaAnalysis(chart), [chart]);
  const pushkaraData = useMemo(() => computePushkaraAnalysis(chart), [chart]);
  const navataraData = useMemo(() => computeNavataraChakra(chart), [chart]);
  const sensitiveReport = useMemo(() => computeComprehensiveSensitivePoints(chart), [chart]);

  const shodhyaPindaRows = useMemo(() => {
    if (!chart.ashtakavarga.shodhyaPinda) return [];
    return Object.values(chart.ashtakavarga.shodhyaPinda);
  }, [chart]);

  const filteredPoints = useMemo(() => {
    if (categoryFilter === 'ALL') return sensitiveReport.points;
    return sensitiveReport.points.filter((p) => p.category === categoryFilter);
  }, [sensitiveReport.points, categoryFilter]);

  return (
    <div className="view-stack">
      {/* Horizontal Switcher Ribbon */}
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
          className={`subtab-btn ${activeTab === 'lagnas_arudhas' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('lagnas_arudhas')}
        >
          <Compass size={14} style={{ marginRight: 5, verticalAlign: 'middle' }} />
          {isHi
            ? 'विशेष लग्न, आरूढ़ (AL–UL), कर्म बिंदु व उपग्रह'
            : 'Special Lagnas, Arudhas, Sensitive Points & Upagrahas'}
        </button>

        <button
          type="button"
          className={`subtab-btn ${activeTab === 'mrityu' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('mrityu')}
        >
          <ShieldAlert size={14} style={{ marginRight: 5, verticalAlign: 'middle' }} />
          {isHi ? 'मृत्यु भाग (Mrityu Bhaga)' : 'Mrityu Bhaga (Fatal Degrees)'}
        </button>

        <button
          type="button"
          className={`subtab-btn ${activeTab === 'pushkara' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('pushkara')}
        >
          <Sparkles size={14} style={{ marginRight: 5, verticalAlign: 'middle' }} />
          {isHi ? 'पुष्कर भाग व नवांश (Pushkara)' : 'Pushkara Bhaga & Navamsha'}
        </button>

        <button
          type="button"
          className={`subtab-btn ${activeTab === 'navatara' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('navatara')}
        >
          <Star size={14} style={{ marginRight: 5, verticalAlign: 'middle' }} />
          {isHi ? 'नवग्रह नवतारा चक्र (Navatara Chakra)' : 'Navatara Chakra (9 Taras)'}
        </button>

        <button
          type="button"
          className={`subtab-btn ${activeTab === 'shodhya_pinda' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('shodhya_pinda')}
        >
          <Layers size={14} style={{ marginRight: 5, verticalAlign: 'middle' }} />
          {isHi ? 'अष्टकवर्ग शोध्य पिंड (Shodhya Pinda)' : 'Ashtakavarga Shodhya Pinda'}
        </button>
      </div>

      {/* 1. SPECIAL LAGNAS, ARUDHAS, SENSITIVE POINTS & UPAGRAHAS */}
      {activeTab === 'lagnas_arudhas' && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              {isHi
                ? 'विशेष लग्न, आरूढ़ पद (AL से UL), कर्म बिंदु एवं उपग्रह'
                : 'Special Lagnas, Arudha Padas (AL–UL), Karmic Sphutas & Upagrahas'}
            </h3>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {(['ALL', 'Special Lagna', 'Arudha Pada', 'Karmic / Sensitive Point', 'Upagraha'] as const).map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`btn btn-sm ${categoryFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {cat === 'ALL'
                      ? isHi
                        ? 'समस्त'
                        : 'All'
                      : cat === 'Special Lagna'
                        ? isHi
                          ? 'विशेष लग्न'
                          : 'Special Lagnas'
                        : cat === 'Arudha Pada'
                          ? isHi
                            ? 'आरूढ़ पद (AL-UL)'
                            : 'Arudha Padas'
                          : cat === 'Karmic / Sensitive Point'
                            ? isHi
                              ? 'कर्म / स्फुट बिंदु'
                              : 'Karmic Points'
                            : isHi
                              ? 'उपग्रह'
                              : 'Upagrahas'}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Special Karmic Highlight Cards */}
          <div
            style={{
              padding: '12px 16px',
              background: 'var(--bg-subtle)',
              borderBottom: '1px solid var(--border)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 12,
            }}
          >
            <div style={{ background: 'var(--bg-card)', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)' }}>
              <div className="muted small-text">🌟 {isHi ? 'योगी ग्रह (Yogi Graha)' : 'Yogi Planet'}</div>
              <strong style={{ fontSize: '14px', color: 'var(--accent)' }}>{trPlanet(sensitiveReport.yogiPlanetEn, lang)}</strong>
              <div className="muted small-text">
                {isHi ? 'सहयोगी:' : 'Saha Yogi:'} <strong>{trPlanet(sensitiveReport.sahaYogiPlanetEn, lang)}</strong>
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)' }}>
              <div className="muted small-text">⚠️ {isHi ? 'अवयोगी ग्रह (Ava Yogi)' : 'Ava Yogi Planet'}</div>
              <strong style={{ fontSize: '14px', color: '#ef4444' }}>{trPlanet(sensitiveReport.avaYogiPlanetEn, lang)}</strong>
              <div className="muted small-text">{isHi ? 'बाधा कारक' : 'Obstacle catalyst'}</div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)' }}>
              <div className="muted small-text">⚔️ {isHi ? '22वां द्रेष्काण स्वामी (ख्रेश)' : '22nd Drekkana Lord (Kharesh)'}</div>
              <strong style={{ fontSize: '14px' }}>{trPlanet(sensitiveReport.twentySecondDrekkanaLordEn, lang)}</strong>
              <div className="muted small-text">{sensitiveReport.twentySecondDrekkanaNature}</div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)' }}>
              <div className="muted small-text">🎯 {isHi ? '64वां नवांश स्वामी (ख्रेश)' : '64th Navamsha Lord (Kharesh)'}</div>
              <strong style={{ fontSize: '14px' }}>{trPlanet(sensitiveReport.sixtyFourthNavamshaLordEn, lang)}</strong>
              <div className="muted small-text">{isHi ? 'चंद्र नवांश से चतुर्थ' : '4th in D9 from Moon'}</div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)' }}>
              <div className="muted small-text">🔥 {isHi ? 'दग्ध राशियाँ (Zero Signs)' : 'Dagdha Rashis (Zero Signs)'}</div>
              <strong style={{ fontSize: '14px' }}>
                {sensitiveReport.dagdhaRashisEn.length > 0
                  ? isHi
                    ? sensitiveReport.dagdhaRashisHi.join(', ')
                    : sensitiveReport.dagdhaRashisEn.join(', ')
                  : isHi
                    ? 'कोई नहीं (शुभ)'
                    : 'None (Auspicious)'}
              </strong>
              <div className="muted small-text">{isHi ? 'तिथि अनुसार शून्य राशियाँ' : 'Burnt signs by birth tithi'}</div>
            </div>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isHi ? 'संवेदनशील बिंदु / लग्न' : 'Point / Special Lagna'}</th>
                  <th>{isHi ? 'श्रेणी' : 'Category'}</th>
                  <th>{isHi ? 'राशि' : 'Sign'}</th>
                  <th>{isHi ? 'अंश' : 'Degree'}</th>
                  <th>{isHi ? 'भाव' : 'House'}</th>
                  <th>{isHi ? 'शास्त्रीय फल व महत्व' : 'Classical Significance & Rule'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredPoints.map((pt) => (
                  <tr key={pt.id}>
                    <td>
                      <strong>{isHi ? pt.nameHi : pt.nameEn}</strong>
                    </td>
                    <td>
                      <span className="tag tag-varg">{isHi ? pt.categoryHi : pt.category}</span>
                    </td>
                    <td>{isHi ? pt.signNameHi : pt.signNameEn}</td>
                    <td className="mono">{pt.dms}</td>
                    <td className="mono">{isHi ? `भाव ${pt.houseNumber}` : `H${pt.houseNumber}`}</td>
                    <td className="wrap-cell small-cell">{isHi ? pt.significationHi : pt.significationEn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 2. MRITYU BHAGA (Fatal Degrees) */}
      {activeTab === 'mrityu' && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              <ShieldAlert size={16} />{' '}
              {isHi
                ? 'मृत्यु भाग विश्लेषण (Mrityu Bhaga) — शास्त्रीय घातक अंश एवं परिहार'
                : 'Mrityu Bhaga (Fatal Degrees) Analysis — Parashari Precision & Remedies'}
            </h3>
            <span className="tag tag-karaka">
              {mrityuData.filter((m) => m.isCriticalOrb).length > 0
                ? isHi
                  ? `${mrityuData.filter((m) => m.isCriticalOrb).length} ग्रह संवेदनशील भाग में`
                  : `${mrityuData.filter((m) => m.isCriticalOrb).length} planet(s) in fatal orb`
                : isHi
                  ? 'समस्त ग्रह सुरक्षित'
                  : 'All Planets Free from Fatal Orb'}
            </span>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isHi ? 'ग्रह / लग्न' : 'Body'}</th>
                  <th>{isHi ? 'राशि' : 'Sign'}</th>
                  <th>{isHi ? 'वास्तविक अंश' : 'Natal Degree'}</th>
                  <th>{isHi ? 'मृत्यु भाग अंश' : 'Fatal Mrityu Degree'}</th>
                  <th>{isHi ? 'अंतर (Orb)' : 'Distance'}</th>
                  <th>{isHi ? 'स्थिति' : 'Severity Status'}</th>
                  <th>{isHi ? 'संवेदनशील आयु वर्ष' : 'Danger Years'}</th>
                  <th>{isHi ? 'परामर्श व परिहार (महामृत्युंजय)' : 'Classical Advice & Remedy'}</th>
                </tr>
              </thead>
              <tbody>
                {mrityuData.map((row) => (
                  <tr
                    key={row.planet}
                    style={{
                      background: row.isFatalOrb
                        ? 'rgba(239, 68, 68, 0.08)'
                        : row.isCriticalOrb
                          ? 'rgba(245, 158, 11, 0.06)'
                          : undefined,
                    }}
                  >
                    <td>
                      <strong>{trPlanet(row.planet, lang)}</strong>
                    </td>
                    <td>{isHi ? row.signNameHi : row.signNameEn}</td>
                    <td className="mono">{row.actualDms}</td>
                    <td className="mono">{row.mrityuDms}</td>
                    <td className="mono">
                      {row.diffDeg.toFixed(2)}°
                    </td>
                    <td>
                      <span
                        className={`tag ${
                          row.isFatalOrb
                            ? 'tag-karaka'
                            : row.isCriticalOrb
                              ? 'tag-varg'
                              : ''
                        }`}
                      >
                        {isHi ? row.severityHi : row.severity}
                      </span>
                    </td>
                    <td className="mono">
                      {row.dangerYears.length > 0 ? row.dangerYears.join(', ') : '—'}
                    </td>
                    <td className="wrap-cell small-cell">
                      {isHi ? row.recommendationHi : row.recommendationEn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 3. PUSHKARA BHAGA & NAVAMSHA */}
      {activeTab === 'pushkara' && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              <Sparkles size={16} />{' '}
              {isHi
                ? 'पुष्कर भाग एवं पुष्कर नवांश (Pushkara Bhaga & Pushkara Navamsha)'
                : 'Pushkara Bhaga & Pushkara Navamsha (Supreme Rejuvenation Portions)'}
            </h3>
            <span className="tag tag-varg">
              {pushkaraData.filter((p) => p.isPushkaraBhaga || p.isPushkaraNavamsha).length} {isHi ? 'पुष्कर ग्रह' : 'Pushkara bodies'}
            </span>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isHi ? 'ग्रह / लग्न' : 'Body'}</th>
                  <th>{isHi ? 'राशि' : 'Sign'}</th>
                  <th>{isHi ? 'अंश' : 'Degree'}</th>
                  <th>{isHi ? 'पुष्कर भाग (PB)' : 'Pushkara Bhaga'}</th>
                  <th>{isHi ? 'पुष्कर नवांश (PN)' : 'Pushkara Navamsha'}</th>
                  <th>{isHi ? 'नवांश राशि' : 'Navamsha Sign'}</th>
                  <th>{isHi ? 'अमृत सामर्थ्य व फलादेश' : 'Rejuvenation Power & Blessing'}</th>
                </tr>
              </thead>
              <tbody>
                {pushkaraData.map((row) => (
                  <tr
                    key={row.planet}
                    style={{
                      background:
                        row.isPushkaraBhaga && row.isPushkaraNavamsha
                          ? 'rgba(16, 185, 129, 0.08)'
                          : row.isPushkaraBhaga || row.isPushkaraNavamsha
                            ? 'rgba(59, 130, 246, 0.05)'
                            : undefined,
                    }}
                  >
                    <td>
                      <strong>{trPlanet(row.planet, lang)}</strong>
                    </td>
                    <td>{isHi ? row.signNameHi : row.signNameEn}</td>
                    <td className="mono">{row.dms}</td>
                    <td>
                      {row.isPushkaraBhaga ? (
                        <span className="tag tag-varg" style={{ fontWeight: 700 }}>
                          ✓ PB ({row.pushkaraBhagaDeg}°)
                        </span>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                    <td>
                      {row.isPushkaraNavamsha ? (
                        <span className="tag tag-varg" style={{ fontWeight: 700 }}>
                          ✓ PN
                        </span>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                    <td>{row.pushkaraNavamshaSign}</td>
                    <td className="wrap-cell small-cell">
                      {isHi ? row.rejuvenationPowerHi : row.rejuvenationPowerEn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 4. NAVATARA CHAKRA (9 Taras across 27 Nakshatras) */}
      {activeTab === 'navatara' && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              <Star size={16} />{' '}
              {isHi
                ? 'नवतारा चक्र (Navatara Chakra — 9 तारा व 3 पर्याय 27 नक्षत्र)'
                : 'Navatara Chakra (9 Taras & 3 Paryayas across 27 Nakshatras)'}
            </h3>
            <span className="muted small-text">
              {isHi ? 'जन्म नक्षत्र से गणना' : 'Computed from Janma Nakshatra'}
            </span>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{isHi ? 'नक्षत्र' : 'Nakshatra'}</th>
                  <th>{isHi ? 'पर्याय' : 'Paryaya'}</th>
                  <th>{isHi ? 'तारा संज्ञा' : 'Tara Name'}</th>
                  <th>{isHi ? 'प्रकृति' : 'Nature'}</th>
                  <th>{isHi ? 'स्थित ग्रह' : 'Occupying Planets'}</th>
                  <th>{isHi ? 'तारा फल' : 'Signification & Result'}</th>
                </tr>
              </thead>
              <tbody>
                {navataraData.map((row) => (
                  <tr
                    key={row.nakshatraIndex}
                    style={{
                      background:
                        row.occupyingPlanets.length > 0
                          ? row.nature === 'Auspicious'
                            ? 'rgba(16, 185, 129, 0.05)'
                            : row.nature === 'Inauspicious'
                              ? 'rgba(239, 68, 68, 0.05)'
                              : undefined
                          : undefined,
                    }}
                  >
                    <td className="mono">{row.nakshatraIndex + 1}</td>
                    <td>
                      <strong>{isHi ? row.nakshatraNameHi : row.nakshatraNameEn}</strong>
                    </td>
                    <td className="mono">{row.paryaya}</td>
                    <td>
                      <strong>{isHi ? row.taraNameHi : row.taraNameEn}</strong>
                    </td>
                    <td>
                      <span
                        className={`tag ${
                          row.nature === 'Auspicious'
                            ? 'tag-varg'
                            : row.nature === 'Inauspicious'
                              ? 'tag-karaka'
                              : ''
                        }`}
                      >
                        {isHi ? row.natureHi : row.nature}
                      </span>
                    </td>
                    <td>
                      {row.occupyingPlanets.length > 0 ? (
                        row.occupyingPlanets.map((p) => (
                          <span key={p} className="tag tag-varg mono" style={{ marginRight: 4 }}>
                            {trPlanet(p, lang)}
                          </span>
                        ))
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                    <td className="wrap-cell small-cell">
                      {isHi ? row.significationHi : row.significationEn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 5. ASHTAKAVARGA SHODHYA PINDA */}
      {activeTab === 'shodhya_pinda' && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              <Layers size={16} />{' '}
              {isHi
                ? 'अष्टकवर्ग शोध्य पिंड तालिका (Shodhya Pinda — राशि पिंड, ग्रह पिंड व कुल शोध्य पिंड)'
                : 'Ashtakavarga Shodhya Pinda (Rasi Pinda, Graha Pinda & Total Shodhya Pinda)'}
            </h3>
            <span className="muted small-text">
              {isHi ? 'त्रिकोण व एकाधिपत्य शोधन उपरांत' : 'Computed after Trikona & Ekadhipatya Shodhana'}
            </span>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                  <th>{isHi ? 'राशि पिंड (Rasi Pinda)' : 'Rasi Pinda'}</th>
                  <th>{isHi ? 'ग्रह पिंड (Graha Pinda)' : 'Graha Pinda'}</th>
                  <th>{isHi ? 'कुल शोध्य पिंड (Total Shodhya Pinda)' : 'Total Shodhya Pinda'}</th>
                  <th>{isHi ? 'आयु व फल विचार' : 'Classical Significance'}</th>
                </tr>
              </thead>
              <tbody>
                {shodhyaPindaRows.map((r) => (
                  <tr key={r.planet}>
                    <td>
                      <strong>{trPlanet(r.planet, lang)}</strong>
                    </td>
                    <td className="mono">{r.rasiPinda}</td>
                    <td className="mono">{r.grahaPinda}</td>
                    <td className="mono">
                      <strong style={{ color: 'var(--accent)' }}>{r.shodhyaPinda}</strong>
                    </td>
                    <td className="wrap-cell small-cell">
                      {isHi
                        ? `इस ग्रह के गोचर व दशा में ${r.shodhyaPinda} शोध्य पिंड बिंदुओं के अनुपात में भाग्य व फल की प्राप्ति होती है।`
                        : `Transits and Dashas of ${r.planet} deliver results proportional to its ${r.shodhyaPinda} Shodhya Pinda strength.`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};
