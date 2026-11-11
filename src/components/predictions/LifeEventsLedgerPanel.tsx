import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Briefcase,
  Calendar,
  Compass,
  Heart,
  ShieldAlert,
  Sparkles,
  Users,
} from 'lucide-react';
import type { LifeEventsAndLedgerReport } from '../../astro/predictions/lifeEventsLedger';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet } from '../../i18n/translations';

export const LifeEventsLedgerPanel: React.FC<{
  ledger: LifeEventsAndLedgerReport;
}> = ({ ledger }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';
  const {
    payaAndGandmool,
    accidentProfile,
    timelineEvents,
    timeline120Years,
    longevity,
    deityAndMainPlanet,
    qaLedger,
  } = ledger;

  const [ageBand, setAgeBand] = useState<'all' | '0_30' | '30_60' | '60_90' | '90_120'>('all');
  const [catFilter, setCatFilter] = useState<'all' | 'career' | 'marriage' | 'finance' | 'health' | 'edu_spir'>('all');

  const filtered120Events = useMemo(() => {
    return (timeline120Years ?? []).filter((ev) => {
      const mid = (ev.startAge + ev.endAge) / 2;
      if (ageBand === '0_30' && (ev.endAge <= 0 || ev.startAge >= 30)) return false;
      if (ageBand === '30_60' && (ev.endAge <= 30 || ev.startAge >= 60)) return false;
      if (ageBand === '60_90' && (ev.endAge <= 60 || ev.startAge >= 90)) return false;
      if (ageBand === '90_120' && mid < 85 && ev.endAge <= 90) return false;

      if (catFilter === 'career' && ev.categoryId !== 'career') return false;
      if (catFilter === 'marriage' && ev.categoryId !== 'marriage') return false;
      if (catFilter === 'finance' && ev.categoryId !== 'finance') return false;
      if (catFilter === 'health' && ev.categoryId !== 'health') return false;
      if (catFilter === 'edu_spir' && ev.categoryId !== 'education' && ev.categoryId !== 'spiritual') {
        return false;
      }
      return true;
    });
  }, [timeline120Years, ageBand, catFilter]);

  return (
    <div className="view-stack">
      {/* 1. Paya, Gandmool Nakshatra Dosha, Main Deity & Governing Planet */}
      <div className="pred-top-grid">
        <section className="panel">
          <div className="panel-header">
            <h3>
              <Sparkles size={15} />{' '}
              {isHi
                ? 'जन्म पाया एवं गंडमूल नक्षत्र दोष विश्लेषण'
                : 'Birth Paya & Detailed Gandmool Nakshatra Dosha'}
            </h3>
            <span
              className={`tag ${
                payaAndGandmool.isGandmool
                  ? payaAndGandmool.gandmoolSeverity === 'Auspicious Pada'
                    ? 'tag-karaka'
                    : 'tag-combust'
                  : 'tag-varg'
              }`}
            >
              {payaAndGandmool.isGandmool
                ? isHi ? `गंडमूल (${payaAndGandmool.gandmoolSeverity})` : `Gandmool (${payaAndGandmool.gandmoolSeverity})`
                : isHi ? 'गंडमूल दोष मुक्त' : 'Non-Gandmool (Clear)'}
            </span>
          </div>
          <div className="pred-card-body">
            <div
              className={`gochar-banner ${
                payaAndGandmool.payaTone === 'auspicious'
                  ? 'is-clear'
                  : payaAndGandmool.payaTone === 'challenging'
                    ? 'is-alert'
                    : 'is-info'
              }`}
            >
              <strong>{isHi ? 'जन्म का पाया (Paya):' : 'Birth Paya:'}</strong>{' '}
              <strong>{isHi ? payaAndGandmool.payaNameHi : payaAndGandmool.payaNameEn}</strong> —{' '}
              {isHi ? payaAndGandmool.payaMeaningHi : payaAndGandmool.payaMeaningEn}
            </div>

            <div className={`gochar-banner ${payaAndGandmool.isGandmool ? 'is-alert' : 'is-clear'}`}>
              <strong>{isHi ? 'गंडमूल नक्षत्र जांच (चरण सहित):' : 'Gandmool Nakshatra (Pada Check):'}</strong>{' '}
              {isHi ? payaAndGandmool.gandmoolReadingHi : payaAndGandmool.gandmoolReadingEn}
            </div>

            <p className="yoga-desc">
              <strong>{isHi ? 'शांति / निवारण:' : 'Shanti / Remedy:'}</strong>{' '}
              {isHi ? payaAndGandmool.shantiRemedyHi : payaAndGandmool.shantiRemedyEn}
            </p>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>
              <Compass size={15} />{' '}
              {isHi
                ? 'प्रमुख इष्टदेव (Deity) एवं कुंडली के मुख्य स्वामी ग्रह'
                : 'Main Deity (Ishta Devata) & Governing Planets'}
            </h3>
            <span className="tag tag-karaka">{isHi ? 'जैमिनी कारकांश आधार' : 'Jaimini D9 Rule'}</span>
          </div>
          <div className="pred-card-body">
            <div className="gochar-banner is-info">
              <strong>{isHi ? 'आपके मुख्य इष्टदेव:' : 'Your Main Deity (Ishta Devata):'}</strong>{' '}
              <strong>{isHi ? deityAndMainPlanet.ishtaDevataHi : deityAndMainPlanet.ishtaDevataEn}</strong>
            </div>
            <div className="pred-bullets">
              <div>
                <strong>{isHi ? 'शास्त्रीय आधार:' : 'Classical Basis:'}</strong>{' '}
                {isHi ? deityAndMainPlanet.ishtaBasisHi : deityAndMainPlanet.ishtaBasisEn}
              </div>
              <div>
                <strong>{isHi ? 'सिद्ध मंत्र:' : 'Daily Mantra:'}</strong>{' '}
                <span className="mono">{deityAndMainPlanet.ishtaMantra}</span>
              </div>
              <div>
                <strong>{isHi ? 'मुख्य स्वामी ग्रह (Main Lord):' : 'Main Governing Planet:'}</strong>{' '}
                {isHi ? deityAndMainPlanet.mainPlanetHi : deityAndMainPlanet.mainPlanetEn}
              </div>
              <div>
                <strong>{isHi ? 'सहायक प्रमुख ग्रह:' : 'Co-Ruling Strength:'}</strong>{' '}
                {isHi ? deityAndMainPlanet.supportingKingsHi : deityAndMainPlanet.supportingKingsEn}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 2. Incidents, Accidents & Longevity / Alpayu Assessment */}
      <div className="pred-top-grid">
        <section className="panel" style={{ borderLeft: '3px solid var(--bad)' }}>
          <div className="panel-header">
            <h3>
              <ShieldAlert size={15} />{' '}
              {isHi
                ? 'दुर्घटना, चोट, शल्य-चिकित्सा व आकस्मिक घटना जोखिम'
                : 'Accident, Injury, Surgery & Sudden Incident Risks'}
            </h3>
            <span
              className={`tag ${
                accidentProfile.tone === 'negative'
                  ? 'tag-combust'
                  : accidentProfile.tone === 'mixed'
                    ? 'tag-retro'
                    : 'tag-varg'
              }`}
            >
              {isHi ? accidentProfile.riskLevelHi : accidentProfile.riskLevelEn}
            </span>
          </div>
          <div className="pred-card-body">
            <div className="pred-bullets">
              <div>
                <strong>{isHi ? 'संभावित जोखिम प्रकार:' : 'Specific Risk Triggers:'}</strong>{' '}
                {isHi ? accidentProfile.riskTypesHi : accidentProfile.riskTypesEn}
              </div>
              <div>
                <strong>{isHi ? 'प्रमुख सावधानी दशा अवधियाँ:' : 'High-Caution Dasha Periods:'}</strong>{' '}
                <span className="mono">
                  {isHi ? accidentProfile.cautionWindowsHi : accidentProfile.cautionWindowsEn}
                </span>
              </div>
              <div className="gochar-banner is-alert">
                <strong>{isHi ? 'सुरक्षा एवं उपाय:' : 'Preventive Protection:'}</strong>{' '}
                {isHi ? accidentProfile.precautionHi : accidentProfile.precautionEn}
              </div>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>
              <Activity size={15} />{' '}
              {isHi
                ? 'आयु-बल एवं अल्पायु / दीर्घायु परीक्षण (Longevity & Balarishta)'
                : 'Longevity Assessment (Alpayu / Madhyayu / Purnayu)'}
            </h3>
            <span className={`tag ${longevity.hasAlpayuCaution ? 'tag-combust' : 'tag-varg'}`}>
              {longevity.hasAlpayuCaution
                ? isHi ? 'स्वास्थ्य रक्षा सतर्कता' : 'Health Vigilance'
                : isHi ? 'सुदृढ़ आयु योग' : 'Resilient Span'}
            </span>
          </div>
          <div className="pred-card-body">
            <p className="lead-text">{isHi ? longevity.categoryHi : longevity.categoryEn}</p>
            <div className="pred-bullets">
              <div className="mono muted small-text">
                {isHi ? longevity.pairScoreHi : longevity.pairScoreEn}
              </div>
              <div>
                <strong>{isHi ? 'बालारिष्ट जांच:' : 'Balarishta Check:'}</strong>{' '}
                {isHi ? longevity.balarishtaStatusHi : longevity.balarishtaStatusEn}
              </div>
              <div>
                <strong>{isHi ? 'मारक सावधानी:' : 'Maraka Vigilance:'}</strong>{' '}
                {isHi ? longevity.marakaWarningHi : longevity.marakaWarningEn}
              </div>
              <div>{isHi ? longevity.summaryHi : longevity.summaryEn}</div>
            </div>
            <div className="gochar-banner is-info small-text">
              {isHi ? longevity.disclaimerHi : longevity.disclaimerEn}
            </div>
          </div>
        </section>
      </div>

      {/* 3. Concrete Dated Events, Accidents & Turning Points Timeline */}
      <section className="panel">
        <div className="panel-header">
          <h3>
            <Calendar size={15} />{' '}
            {isHi
              ? 'जीवन की प्रमुख वास्तविक घटनाएँ, दुर्घटना-संकेत व सफलता वर्ष (दशा आधारित टाइमलाइन)'
              : 'Dated Life Events, Accidents, Breakthroughs & Incidents Timeline'}
          </h3>
          <span className="tag">
            {isHi ? 'स्वभाव नहीं — ठोस घटनाक्रम' : 'Concrete Event Timing (MD/AD Triggers)'}
          </span>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>{isHi ? 'अनुमानित आयु' : 'Age'}</th>
                <th>{isHi ? 'वर्ष अवधि' : 'Years'}</th>
                <th>{isHi ? 'घटना श्रेणी' : 'Event Category'}</th>
                <th>{isHi ? 'शीर्षक (सकारात्मक / नकारात्मक)' : 'Forecast Event / Incident'}</th>
                <th>{isHi ? 'विस्तृत विवरण' : 'Specific Details'}</th>
              </tr>
            </thead>
            <tbody>
              {timelineEvents.map((ev, i) => (
                <tr key={i}>
                  <td className="mono">{ev.ageRange}</td>
                  <td className="mono">{ev.yearRange}</td>
                  <td>
                    <span
                      className={`tag ${
                        ev.tone === 'positive'
                          ? 'tag-varg'
                          : ev.tone === 'negative'
                            ? 'tag-combust'
                            : 'tag-karaka'
                      }`}
                    >
                      {isHi ? ev.categoryHi : ev.categoryEn}
                    </span>
                  </td>
                  <td><strong>{isHi ? ev.titleHi : ev.titleEn}</strong></td>
                  <td className="wrap-cell">{isHi ? ev.detailHi : ev.detailEn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3B. Complete 0–120 Years Paramayus Life Events Chronicle */}
      <section className="panel">
        <div className="panel-header">
          <h3>
            <Calendar size={15} />{' '}
            {isHi
              ? `संपूर्ण 120 वर्षीय परमायु जीवन घटनाक्रम (आयु 0 से 120 वर्ष तक — ${(timeline120Years ?? []).length} दशा चरण)`
              : `Complete 120-Year Paramayus Life Events Chronicle (Ages 0 to 120 — ${(timeline120Years ?? []).length} Dasha Epochs)`}
          </h3>
          <span className="tag tag-varg">
            {isHi ? '0–120 वर्ष पूर्ण विंशोत्तरी चक्र' : 'Full 120-Yr Birth-to-Paramayus Timeline'}
          </span>
        </div>

        <div className="charts-toolbar" style={{ padding: '10px 14px' }}>
          <div className="subtab-bar">
            {(
              [
                ['all', isHi ? 'सभी (0–120 वर्ष)' : 'All 0–120 Yrs'],
                ['0_30', isHi ? '0–30 युवा/शिक्षा' : '0–30 Yrs'],
                ['30_60', isHi ? '30–60 गृहस्थ/शिखर' : '30–60 Yrs'],
                ['60_90', isHi ? '60–90 वरिष्ठ/विरासत' : '60–90 Yrs'],
                ['90_120', isHi ? '90–120 शताब्दी/तप' : '90–120 Yrs'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`subtab-btn ${ageBand === id ? 'is-active' : ''}`}
                onClick={() => setAgeBand(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="subtab-bar" style={{ marginTop: 6 }}>
            {(
              [
                ['all', isHi ? 'सभी विषय' : 'All Topics'],
                ['career', isHi ? 'करियर' : 'Career'],
                ['marriage', isHi ? 'विवाह/परिवार' : 'Marriage/Family'],
                ['finance', isHi ? 'धन/संपत्ति' : 'Finance'],
                ['health', isHi ? 'स्वास्थ्य/दुर्घटना' : 'Health/Caution'],
                ['edu_spir', isHi ? 'शिक्षा/आध्यात्म' : 'Study/Spiritual'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`subtab-btn ${catFilter === id ? 'is-active' : ''}`}
                onClick={() => setCatFilter(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>{isHi ? 'आयु (0–120)' : 'Age Span'}</th>
                <th>{isHi ? 'वर्ष' : 'Years'}</th>
                <th>{isHi ? 'महादशा / अंतरदशा' : 'MD / AD'}</th>
                <th>{isHi ? 'अवस्था व श्रेणी' : 'Stage & Category'}</th>
                <th>{isHi ? 'घटना व परमायु माइलस्टोन' : 'Life Event & Paramayus Milestone'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered120Events.map((ev) => (
                <tr key={ev.index}>
                  <td className="mono">
                    <strong>{ev.ageRange}</strong>
                  </td>
                  <td className="mono">{ev.yearRange}</td>
                  <td className="small-cell">
                    <strong>
                      {trPlanet(ev.mahadashaLord, lang)} / {trPlanet(ev.antardashaLord, lang)}
                    </strong>
                    <div className="muted">
                      {isHi ? 'भाव: ' : 'H: '}
                      {ev.activatedHouses.join(', ')}
                    </div>
                  </td>
                  <td className="small-cell">
                    <div>{isHi ? ev.stageHi : ev.stageEn}</div>
                    <span
                      className={`tag ${
                        ev.tone === 'positive'
                          ? 'tag-varg'
                          : ev.tone === 'negative'
                            ? 'tag-combust'
                            : 'tag-karaka'
                      }`}
                    >
                      {isHi ? ev.categoryHi : ev.categoryEn}
                    </span>
                  </td>
                  <td className="wrap-cell small-cell">
                    <div>
                      <strong>{isHi ? ev.titleHi : ev.titleEn}</strong>
                      {ev.milestoneEn && (
                        <span className="tag tag-karaka" style={{ marginLeft: 8 }}>
                          {isHi ? ev.milestoneHi : ev.milestoneEn}
                        </span>
                      )}
                    </div>
                    <div className="muted" style={{ marginTop: 3 }}>
                      {isHi ? ev.detailHi : ev.detailEn}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Complete Specific Life Questions Ledger (Positive & Negative Side-by-Side) */}
      <section className="panel">
        <div className="panel-header">
          <h3>
            <Users size={15} />{' '}
            {isHi
              ? 'संपूर्ण जीवन प्रश्नोत्तरी — माता-पिता, भाई-बहन संख्या/स्वास्थ्य, विवाह (कब/दिशा/अफेयर/संख्या), संतान, नौकरी बनाम व्यापार व धन'
              : 'Complete Life Questions Ledger — Parents, Siblings Count, Marriage Timing/Direction/Affairs/Count, Children & Career (Positive + Negative)'}
          </h3>
        </div>

        <div className="domains-grid">
          {qaLedger.map((q) => (
            <article key={q.id} className="domain-card">
              <div className="domain-top">
                <h4>
                  {q.id === 'marriage_timing_dir' || q.id === 'affairs_count' ? (
                    <Heart size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                  ) : q.id === 'profession_wealth' ? (
                    <Briefcase size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                  ) : (
                    <AlertTriangle size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                  )}
                  {isHi ? q.titleHi : q.titleEn}
                </h4>
                <span
                  className={`tag ${
                    q.tone === 'positive'
                      ? 'tag-varg'
                      : q.tone === 'negative'
                        ? 'tag-combust'
                        : 'tag-karaka'
                  }`}
                >
                  {isHi ? q.verdictBadgeHi : q.verdictBadgeEn}
                </span>
              </div>

              <p className="domain-summary">{isHi ? q.answerHi : q.answerEn}</p>

              <div className="gochar-banner is-clear">
                <strong>{isHi ? '+ सकारात्मक पहलू:' : '+ Positive Outlook:'}</strong>{' '}
                {isHi ? q.positiveHi : q.positiveEn}
              </div>
              <div className="gochar-banner is-alert">
                <strong>{isHi ? '− नकारात्मक / सावधानी पहलू:' : '− Negative / Caution:'}</strong>{' '}
                {isHi ? q.negativeHi : q.negativeEn}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
