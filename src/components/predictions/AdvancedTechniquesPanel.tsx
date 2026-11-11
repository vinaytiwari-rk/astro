import React, { useMemo, useState } from 'react';
import {
  Activity,
  Briefcase,
  Compass,
  Heart,
  Layers,
  ShieldAlert,
  Sparkles,
  Target,
} from 'lucide-react';
import type {
  AdvancedPredictiveReport,
  PredictiveDomainId,
} from '../../astro/predictions/advancedTechniques';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet, trSign } from '../../i18n/translations';

type AdvTabId = 'systems' | 'career' | 'special' | 'matrix';

export const AdvancedTechniquesPanel: React.FC<{ report: AdvancedPredictiveReport }> = ({
  report,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';
  const [tab, setTab] = useState<AdvTabId>('systems');
  const [domainFilter, setDomainFilter] = useState<'all' | PredictiveDomainId>('all');

  const filteredRules = useMemo(() => {
    if (domainFilter === 'all') return report.triggeredRules;
    return report.triggeredRules.filter((r) => r.domain === domainFilter);
  }, [report.triggeredRules, domainFilter]);

  const careerBadgeEn =
    report.careerAudit.verdict === 'Service / Structured Career'
      ? `Service ${report.careerAudit.serviceScore}%`
      : report.careerAudit.verdict === 'Self-Employment / Enterprise'
        ? `Enterprise ${report.careerAudit.businessScore}%`
        : `Hybrid ${report.careerAudit.serviceScore}% / ${report.careerAudit.businessScore}%`;

  return (
    <div className="view-stack">
      {/* TOP SUMMARY STRIP */}
      <section className="panel">
        <div className="panel-header">
          <h3>
            <Layers size={15} />{' '}
            {isHi
              ? 'उन्नत ज्योतिष सूत्र संश्लेषण — सिस्टम अप्रोच (MEP), व्यावहारिक नियम व समग्र वर्गीकरण'
              : "Advanced Predictive Synthesis — Systems' Approach (MEP), Applied Empirical Rules & Multi-Factor Matrix"}
          </h3>
          <span className="tag tag-varg mono">
            {report.totalRulesEvaluated.toLocaleString()}{' '}
            {isHi ? `सूत्र परीक्षित · ${report.totalRulesTriggered} सक्रिय` : `Rules Checked · ${report.totalRulesTriggered} Active`}
          </span>
        </div>

        <div className="pred-card-body">
          <div className="kp-stat-grid">
            <div className="kp-stat-card">
              <div className="kp-stat-label">
                {isHi ? 'प्रभावी मध्य बिंदु (MEP अंश)' : 'House Most Effective Point (MEP)'}
              </div>
              <div className="kp-stat-value mono">{report.mepDms}</div>
              <div className="kp-stat-sub">
                {isHi ? '±1° सटीक · ±5° सक्रिय घेरा' : 'Exact ±1° · Active ±5° Orb'}
              </div>
            </div>

            <div className="kp-stat-card">
              <div className="kp-stat-label">
                {isHi ? 'अति-मारक / मुख्य कारक पाप (MMP)' : 'Most Malefic Planet (MMP)'}
              </div>
              <div className="kp-stat-value">
                {report.mmpPlanet
                  ? trPlanet(report.mmpPlanet, lang)
                  : isHi
                    ? 'अष्टम मूलत्रिकोण रहित'
                    : 'No 8th MT Ruler'}
              </div>
              <div className="kp-stat-sub">
                {isHi ? 'अष्टम भाव मूलत्रिकोण स्वामी नियम' : 'Based on 8th Moolatrikona Lordship'}
              </div>
            </div>

            <div className="kp-stat-card">
              <div className="kp-stat-label">
                {isHi ? 'करियर अनुपात (सेवा बनाम व्यापार)' : 'Career Track (Service vs Enterprise)'}
              </div>
              <div className="kp-stat-value">{careerBadgeEn}</div>
              <div className="kp-stat-sub">
                {isHi ? `संदर्भ तिथि: ${report.targetDateDmy}` : `Forecast Date: ${report.targetDateDmy}`}
              </div>
            </div>

            <div className="kp-stat-card">
              <div className="kp-stat-label">
                {isHi ? 'MEP पर सटीक प्रभाव व गोचर' : 'Exact MEP Orbs & Triple Transits'}
              </div>
              <div className="kp-stat-value mono">
                {report.mepHits.length} MEP · {report.transitTriggers.length} Gochar
              </div>
              <div className="kp-stat-sub">
                {isHi ? 'भाव बल, दारकारक, D24 व D6 सहित' : 'With DK, D9, D10, D24 & D6 Audits'}
              </div>
            </div>
          </div>

          <div className="subtab-bar" style={{ marginTop: 14 }}>
            <button
              type="button"
              className={`subtab-btn ${tab === 'systems' ? 'is-active' : ''}`}
              onClick={() => setTab('systems')}
            >
              <Target size={13} />{' '}
              {isHi ? '1. सिस्टम अप्रोच: MEP, कारक प्रकृति व उपाय' : "1. Systems' Approach: MEP, Nature & Upaya"}
            </button>
            <button
              type="button"
              className={`subtab-btn ${tab === 'career' ? 'is-active' : ''}`}
              onClick={() => setTab('career')}
            >
              <Briefcase size={13} />{' '}
              {isHi ? '2. नौकरी बनाम व्यापार व प्रस्तार-दशा समय' : '2. Service vs. Business & Prasthara Timing'}
            </button>
            <button
              type="button"
              className={`subtab-btn ${tab === 'special' ? 'is-active' : ''}`}
              onClick={() => setTab('special')}
            >
              <Heart size={13} />{' '}
              {isHi ? '3. विवाह (DK), शिक्षा (D24), चिकित्सा (D6) व कालसर्प' : '3. Marriage (DK), Edu (D24), Health (D6) & Kaal Sarpa'}
            </button>
            <button
              type="button"
              className={`subtab-btn ${tab === 'matrix' ? 'is-active' : ''}`}
              onClick={() => setTab('matrix')}
            >
              <Sparkles size={13} />{' '}
              {isHi ? `4. द्वादश भाव संश्लेषण व ${report.totalRulesEvaluated} नियम` : `4. H1–H12 Synthesis & ${report.totalRulesEvaluated} Rule Matrix`}
            </button>
          </div>
        </div>
      </section>

      {/* TAB 1: SYSTEMS APPROACH */}
      {tab === 'systems' && (
        <>
          <section className="panel">
            <div className="panel-header">
              <h3>
                <Compass size={15} />{' '}
                {isHi
                  ? 'सिस्टम अप्रोच — ग्रहों की मूलत्रिकोण कार्यशील प्रकृति, अवस्था बल व सटीक उपाय'
                  : "Systems' Approach — Functional Benefic/Malefic Classification, Operational Strength & Targeted Upaya"}
              </h3>
              <span className="tag">MEP = {report.mepDms}</span>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                    <th>{isHi ? 'सिस्टम भूमिका' : 'SA Role'}</th>
                    <th>{isHi ? 'पराशरी भूमिका' : 'Parashari'}</th>
                    <th>{isHi ? 'भाव / अंश' : 'House / Deg'}</th>
                    <th>{isHi ? 'कार्यशील बल' : 'Op. Strength'}</th>
                    <th>{isHi ? 'उपाय सिद्धांत व विधि' : 'Targeted Remedial Protocol'}</th>
                  </tr>
                </thead>
                <tbody>
                  {report.functionalProfiles.map((fp) => (
                    <tr key={fp.planet}>
                      <td>
                        <strong>{trPlanet(fp.planet, lang)}</strong>
                        {fp.mtHouse && (
                          <div className="label-muted" style={{ fontSize: 11 }}>
                            MT H{fp.mtHouse}
                          </div>
                        )}
                      </td>
                      <td>
                        <span
                          className={`tag ${
                            fp.role === 'FB' ? 'tag-varg' : fp.role === 'MMP' ? 'tag-karaka' : ''
                          }`}
                        >
                          {fp.role === 'FB'
                            ? isHi
                              ? 'शुभ कारक (FB)'
                              : 'Functional Benefic'
                            : fp.role === 'MMP'
                              ? isHi
                                ? 'अति-मारक (MMP)'
                                : 'Most Malefic (MMP)'
                              : isHi
                                ? 'अकारक/पाप (FM)'
                                : 'Functional Malefic'}
                        </span>
                      </td>
                      <td>{fp.classicalParashariRole}</td>
                      <td className="mono">
                        H{fp.house} · {fp.degreeInSign.toFixed(1)}°
                      </td>
                      <td>
                        <strong>{fp.operationalStrength}%</strong>
                        <div className="label-muted" style={{ fontSize: 11 }}>
                          {isHi ? fp.stateTagHi : fp.stateTagEn}
                        </div>
                        {(isHi ? fp.deductionsHi : fp.deductionsEn).slice(0, 2).map((d, idx) => (
                          <div key={idx} className="label-muted" style={{ fontSize: 11 }}>
                            • {d}
                          </div>
                        ))}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 3 }}>
                          {fp.remedyType === 'Strengthen (FB)'
                            ? isHi
                              ? 'बलवर्धन (कमजोर शुभ ग्रह हेतु)'
                              : 'Strengthen Weak Benefic'
                            : isHi
                              ? 'शांति / दान (अकारक व पाप हेतु)'
                              : 'Propitiate Functional Malefic'}
                        </div>
                        <div style={{ fontSize: 12 }}>{isHi ? fp.remedyHi : fp.remedyEn}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h3>
                <ShieldAlert size={15} />{' '}
                {isHi
                  ? 'द्वादश भाव MEP (±5° सूक्ष्म अंश) प्रभाव व सक्रिय गोचर ट्रिगर'
                  : 'House MEP (±5° Exact Orb) Hits & Active Triple-Transit Gochar Triggers'}
              </h3>
              <span className="tag">{report.targetDateDmy}</span>
            </div>
            <div className="pred-card-body">
              <div className="gochar-banner is-info" style={{ marginBottom: 12 }}>
                <strong>{isHi ? report.tripleTransitSummaryHi : report.tripleTransitSummaryEn}</strong>
              </div>

              {report.mepHits.length > 0 ? (
                <div className="domains-grid" style={{ marginBottom: 14 }}>
                  {report.mepHits.map((hit, idx) => (
                    <article key={idx} className="domain-card">
                      <div className="domain-top">
                        <h4>
                          H{hit.house} ({trSign(hit.houseSignIndex, lang)}) ·{' '}
                          {trPlanet(hit.sourcePlanet, lang)}
                        </h4>
                        <span
                          className={`tag ${
                            hit.polarity === 'Blessing' ? 'tag-varg' : 'tag-karaka'
                          }`}
                        >
                          {hit.tightness} ({hit.orbDeg}°)
                        </span>
                      </div>
                      <p className="domain-summary">{isHi ? hit.summaryHi : hit.summaryEn}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="label-muted" style={{ marginBottom: 12 }}>
                  {isHi
                    ? 'कोई भी ग्रह लग्न MEP से ±5° के भीतर प्रत्यक्ष भाव युति/दृष्टि में नहीं है — भाव फल बिना तीव्र अंश-पीड़ा के प्रवाहित होते हैं।'
                    : 'No natal planet strikes any house MEP within a ±5° longitudinal orb — houses operate free of acute pinpoint MEP shock.'}
                </p>
              )}

              {report.transitTriggers.length > 0 && (
                <div className="table-scroll">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>{isHi ? 'गोचर ग्रह' : 'Transit Planet'}</th>
                        <th>{isHi ? 'लक्ष्य' : 'Target'}</th>
                        <th>{isHi ? 'अंतर (Orb)' : 'Orb'}</th>
                        <th>{isHi ? 'संकेत' : 'Activation'}</th>
                        <th>{isHi ? 'विवरण' : 'Effect Note'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.transitTriggers.map((tr, i) => (
                        <tr key={i}>
                          <td>
                            {trPlanet(tr.transitPlanet, lang)} ({trSign(tr.transitSignIndex, lang)}{' '}
                            {tr.transitDegree}°)
                          </td>
                          <td>
                            {tr.targetType === 'MEP'
                              ? `H${tr.targetHouse} MEP`
                              : `${trPlanet(tr.targetPlanet!, lang)} (H${tr.targetHouse})`}
                          </td>
                          <td className="mono">{tr.orbDeg}°</td>
                          <td>
                            <span
                              className={`tag ${
                                tr.triggerType === 'Favorable Activation' ? 'tag-varg' : 'tag-karaka'
                              }`}
                            >
                              {tr.triggerType}
                            </span>
                          </td>
                          <td>{isHi ? tr.noteHi : tr.noteEn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* TAB 2: CAREER SERVICE VS ENTERPRISE + PRASTHARA TIMING */}
      {tab === 'career' && (
        <>
          <section className="panel">
            <div className="panel-header">
              <h3>
                <Briefcase size={15} />{' '}
                {isHi
                  ? 'सेवा (नौकरी) बनाम स्वतंत्र उद्यम (व्यापार) — व्यावहारिक तुलना'
                  : 'Service (Naukri) vs. Self-Employment (Enterprise) — Empirical Comparison'}
              </h3>
              <span className="tag tag-varg">{report.careerAudit.verdict}</span>
            </div>
            <div className="pred-card-body">
              <div className="gochar-banner is-info" style={{ marginBottom: 14 }}>
                <strong>{isHi ? report.careerAudit.verdictHi : report.careerAudit.verdictEn}</strong>
              </div>

              <div className="domains-grid">
                <article className="domain-card">
                  <div className="domain-top">
                    <h4>{isHi ? 'संगठित सेवा व नौकरी सूचक' : 'Service & Institutional Career'}</h4>
                    <span className="tag">{report.careerAudit.serviceScore}%</span>
                  </div>
                  {(isHi
                    ? report.careerAudit.serviceReasonsHi
                    : report.careerAudit.serviceReasonsEn
                  ).map((r, i) => (
                    <p key={i} className="domain-summary" style={{ marginBottom: 6 }}>
                      • {r}
                    </p>
                  ))}
                </article>

                <article className="domain-card">
                  <div className="domain-top">
                    <h4>{isHi ? 'स्वतंत्र व्यापार व उद्यम सूचक' : 'Self-Employment & Enterprise'}</h4>
                    <span className="tag tag-varg">{report.careerAudit.businessScore}%</span>
                  </div>
                  {(isHi
                    ? report.careerAudit.businessReasonsHi
                    : report.careerAudit.businessReasonsEn
                  ).map((r, i) => (
                    <p key={i} className="domain-summary" style={{ marginBottom: 6 }}>
                      • {r}
                    </p>
                  ))}
                </article>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h3>
                <Activity size={15} />{' '}
                {isHi
                  ? 'प्रस्ताराष्टकवर्ग × विंशोत्तरी दशा — करियर उत्थान व पदोन्नति अवधि'
                  : 'Prasthara Ashtakavarga × Vimshottari Dasha — Verified Rise & Promotion Windows'}
              </h3>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{isHi ? 'दशा / अंतर्दशा' : 'Mahadasha / Antardasha'}</th>
                    <th>{isHi ? 'अवधि (DD-MM-YYYY)' : 'Window (DD-MM-YYYY)'}</th>
                    <th>{isHi ? 'दशम / लाभ BAV' : 'H10 / H11 BAV'}</th>
                    <th>{isHi ? 'अंतर्दशा प्रत्यक्ष बिंदु दाता' : 'AD Contributes Bindu?'}</th>
                    <th>{isHi ? 'प्रस्तार दशम दाता ग्रह' : 'H10 Prasthara Donors'}</th>
                    <th>{isHi ? 'निष्कर्ष' : 'Empirical Verdict'}</th>
                  </tr>
                </thead>
                <tbody>
                  {report.careerAudit.prastharaCareerWindows.map((w, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong>
                          {trPlanet(w.mdLord, lang)} – {trPlanet(w.adLord, lang)}
                        </strong>
                        {w.isCurrent && (
                          <div>
                            <span className="tag tag-varg">{isHi ? 'वर्तमान' : 'Current'}</span>
                          </div>
                        )}
                      </td>
                      <td className="mono">
                        {w.startDateDmy} → {w.endDateDmy}
                      </td>
                      <td className="mono">
                        H10: {w.h10Bindus}/8 · H11: {w.h11Bindus}/8
                      </td>
                      <td>
                        {w.contributingAdTo10th ? (
                          <span className="tag tag-varg">H10 +1 Bindu</span>
                        ) : w.contributingAdTo11th ? (
                          <span className="tag">H11 +1 Bindu</span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td style={{ fontSize: 12 }}>{w.topContributors10th.join(', ') || '—'}</td>
                      <td>{isHi ? w.verdictHi : w.verdictEn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* TAB 3: MARRIAGE (DK), EDUCATION (D24), MEDICAL (D6), KAAL SARPA */}
      {tab === 'special' && (
        <div className="domains-grid">
          <article className="domain-card">
            <div className="domain-top">
              <h4>
                <Heart size={14} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                {isHi ? 'दारकारक (DK), नवांश व दांपत्य सामंजस्य' : 'Darakaraka (DK), D9 & Marriage Timing/Harmony'}
              </h4>
              <span className="tag tag-varg">{report.specialModules.marriageAudit.harmonyScore}%</span>
            </div>
            <p className="domain-summary" style={{ marginBottom: 8 }}>
              {isHi
                ? report.specialModules.marriageAudit.dkSummaryHi
                : report.specialModules.marriageAudit.dkSummaryEn}
            </p>
            <p className="label-muted" style={{ marginBottom: 8, fontSize: 12 }}>
              {isHi
                ? report.specialModules.marriageAudit.d9SupportHi
                : report.specialModules.marriageAudit.d9SupportEn}
            </p>
            {(isHi
              ? report.specialModules.marriageAudit.discordRisksHi
              : report.specialModules.marriageAudit.discordRisksEn
            ).map((x, i) => (
              <p key={i} className="domain-summary" style={{ fontSize: 12 }}>
                • {x}
              </p>
            ))}
            {(isHi
              ? report.specialModules.marriageAudit.cancellationsHi
              : report.specialModules.marriageAudit.cancellationsEn
            ).map((x, i) => (
              <p key={i} className="domain-summary" style={{ fontSize: 12, color: 'var(--accent-strong)' }}>
                ✓ {x}
              </p>
            ))}
          </article>

          <article className="domain-card">
            <div className="domain-top">
              <h4>{isHi ? 'शिक्षा (D24 सिद्धांश) व पारिवारिक वातावरण' : 'Education (D24) & Domestic Stress Check'}</h4>
              <span className="tag tag-varg">{report.specialModules.educationAudit.score}%</span>
            </div>
            <p className="domain-summary" style={{ marginBottom: 8 }}>
              <strong>{isHi ? 'उपयुक्त धारा: ' : 'Recommended Stream: '}</strong>
              {isHi
                ? report.specialModules.educationAudit.streamHi
                : report.specialModules.educationAudit.streamEn}
            </p>
            <p className="domain-summary">
              {isHi
                ? report.specialModules.educationAudit.summaryHi
                : report.specialModules.educationAudit.summaryEn}
            </p>
          </article>

          <article className="domain-card">
            <div className="domain-top">
              <h4>{isHi ? 'रोग निदान (D6 षष्ठांश) व शारीरिक प्रतिरोध' : 'Medical Audit (D6) & Constitutional Vitality'}</h4>
              <span className="tag tag-varg">{report.specialModules.medicalAudit.vitalityScore}/100</span>
            </div>
            <p className="domain-summary" style={{ marginBottom: 6 }}>
              {isHi
                ? report.specialModules.medicalAudit.summaryHi
                : report.specialModules.medicalAudit.summaryEn}
            </p>
            <p className="label-muted" style={{ marginBottom: 8, fontSize: 12 }}>
              {isHi
                ? report.specialModules.medicalAudit.d6ResilienceHi
                : report.specialModules.medicalAudit.d6ResilienceEn}
            </p>
            {(isHi
              ? report.specialModules.medicalAudit.vulnerableAreasHi
              : report.specialModules.medicalAudit.vulnerableAreasEn
            ).map((x, i) => (
              <p key={i} className="domain-summary" style={{ fontSize: 12 }}>
                • {x}
              </p>
            ))}
          </article>

          <article className="domain-card">
            <div className="domain-top">
              <h4>{isHi ? 'कालसर्प योग यथार्थ व भंग परीक्षण' : 'Kaal Sarpa Reality & Cancellation Audit'}</h4>
              <span className="tag">{report.specialModules.kaalSarpaAudit.status}</span>
            </div>
            <p className="domain-summary" style={{ marginBottom: 8 }}>
              <strong>
                {isHi
                  ? report.specialModules.kaalSarpaAudit.nameHi
                  : report.specialModules.kaalSarpaAudit.nameEn}
              </strong>
              {' — '}
              {isHi
                ? report.specialModules.kaalSarpaAudit.summaryHi
                : report.specialModules.kaalSarpaAudit.summaryEn}
            </p>
            {(isHi
              ? report.specialModules.kaalSarpaAudit.cancellationsHi
              : report.specialModules.kaalSarpaAudit.cancellationsEn
            ).map((c, i) => (
              <p key={i} className="domain-summary" style={{ fontSize: 12 }}>
                ✓ {c}
              </p>
            ))}
          </article>
        </div>
      )}

      {/* TAB 4: H1-H12 SYNTHESIS + 1500+ TRIGGERED RULE MATRIX */}
      {tab === 'matrix' && (
        <>
          <section className="panel">
            <div className="panel-header">
              <h3>
                <Layers size={15} />{' '}
                {isHi
                  ? 'द्वादश भाव समग्र संश्लेषण (लग्न + वर्ग + अष्टकवर्ग + MEP)'
                  : '12-House Holistic Synthesis (Lagna Lord + Varga + SAV + MEP)'}
              </h3>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{isHi ? 'भाव' : 'House'}</th>
                    <th>{isHi ? 'स्वामी स्थिति' : 'Lordship'}</th>
                    <th>SAV</th>
                    <th>{isHi ? 'वर्ग बल' : 'Varga'}</th>
                    <th>MEP</th>
                    <th>{isHi ? 'समग्र बल' : 'Vitality'}</th>
                    <th>{isHi ? 'सारांश' : 'Verdict'}</th>
                  </tr>
                </thead>
                <tbody>
                  {report.houseSynthesis.map((hs) => (
                    <tr key={hs.house}>
                      <td>
                        <strong>H{hs.house}</strong>
                        <div className="label-muted" style={{ fontSize: 11 }}>
                          {isHi ? hs.houseTitleHi : hs.houseTitleEn}
                        </div>
                      </td>
                      <td className="mono">
                        {trPlanet(hs.lord, lang)} → H{hs.lordHouse}
                      </td>
                      <td className="mono">{hs.savBindus}</td>
                      <td>
                        {hs.vargaRef}: {hs.vargaSupport}
                      </td>
                      <td>
                        <span
                          className={`tag ${
                            hs.mepStatus === 'Blessed'
                              ? 'tag-varg'
                              : hs.mepStatus === 'Afflicted'
                                ? 'tag-karaka'
                                : ''
                          }`}
                        >
                          {hs.mepStatus}
                        </span>
                      </td>
                      <td className="mono">
                        <strong>{hs.vitalityScore}%</strong>
                      </td>
                      <td>{isHi ? hs.verdictHi : hs.verdictEn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h3>
                <Sparkles size={15} />{' '}
                {isHi
                  ? `सक्रिय ज्योतिष नियम मैट्रिक्स (${report.totalRulesEvaluated} में से ${report.totalRulesTriggered} प्रमुख सूत्र)`
                  : `Triggered Rule Matrix (${report.totalRulesTriggered} High-Signal Triggers from ${report.totalRulesEvaluated.toLocaleString()} Rules Evaluated)`}
              </h3>
            </div>
            <div className="pred-card-body">
              <div className="subtab-bar" style={{ marginBottom: 12 }}>
                {(
                  [
                    ['all', isHi ? 'सभी' : 'All', report.triggeredRules.length],
                    ['career', isHi ? 'करियर' : 'Career', report.domainCounts.career],
                    ['wealth', isHi ? 'धन' : 'Wealth', report.domainCounts.wealth],
                    ['marriage', isHi ? 'विवाह' : 'Marriage', report.domainCounts.marriage],
                    ['education', isHi ? 'शिक्षा' : 'Education', report.domainCounts.education],
                    ['health', isHi ? 'स्वास्थ्य' : 'Health', report.domainCounts.health],
                    ['yogas', isHi ? 'विशेष योग' : 'Yogas', report.domainCounts.yogas],
                  ] as const
                ).map(([key, label, count]) => (
                  <button
                    key={key}
                    type="button"
                    className={`subtab-btn ${domainFilter === key ? 'is-active' : ''}`}
                    onClick={() => setDomainFilter(key)}
                  >
                    {label} ({count})
                  </button>
                ))}
              </div>

              <div className="domains-grid">
                {filteredRules.map((r) => (
                  <article key={r.code} className="domain-card">
                    <div className="domain-top">
                      <h4>{isHi ? r.titleHi : r.titleEn}</h4>
                      <span
                        className={`tag ${
                          r.polarity === 'benefic'
                            ? 'tag-varg'
                            : r.polarity === 'challenging'
                              ? 'tag-karaka'
                              : ''
                        }`}
                      >
                        {r.tradition}
                      </span>
                    </div>
                    <div className="label-muted mono" style={{ fontSize: 11, marginBottom: 6 }}>
                      [{r.code}] {isHi ? r.formulaHi : r.formulaEn}
                    </div>
                    <p className="domain-summary">{isHi ? r.verdictHi : r.verdictEn}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};
