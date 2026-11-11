import React, { useMemo, useState } from 'react';
import { Flame, Layers, Sparkles } from 'lucide-react';
import { NINE_GRAHAS, SIGNS } from '../../astro/constants';
import {
  inspectCustomYuti,
  type ChartYutiGroup,
  type YutiReport,
} from '../../astro/predictions/yutiPredictions';
import type { NineGrahaId } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet, trSign } from '../../i18n/translations';

const YutiGroupCard: React.FC<{ group: ChartYutiGroup; isHi: boolean }> = ({ group, isHi }) => {
  return (
    <article className="panel" style={{ borderLeft: '3px solid var(--accent)' }}>
      <div className="panel-header">
        <div>
          <h3>{isHi ? group.headlineHi : group.headlineEn}</h3>
          <div className="muted small-text">
            {isHi ? group.labelHi : group.labelEn} ·{' '}
            {group.planets.map((p) => trPlanet(p, isHi ? 'hi' : 'en')).join(' + ')} ·{' '}
            {isHi ? `अंश विस्तार ${group.degreeSpanDeg}°` : `Orb span ${group.degreeSpanDeg}°`}
          </div>
        </div>
        <div className="toolbar-group">
          <span className="tag tag-karaka">
            {isHi ? `${group.count} ग्रह युति` : `${group.count}-Planet Yuti`}
          </span>
          {group.warPairs.length > 0 && (
            <span className="tag tag-combust">
              {isHi ? `ग्रह युद्ध: ${group.warPairs.join(', ')}` : `Graha Yuddha: ${group.warPairs.join(', ')}`}
            </span>
          )}
        </div>
      </div>

      <div className="pred-card-body">
        <div className="domains-grid" style={{ padding: 0 }}>
          <div className="gochar-banner is-clear">
            <strong>{isHi ? 'सकारात्मक फल (Positive):' : 'Positive Fruits:'}</strong>{' '}
            {isHi ? group.positiveHi : group.positiveEn}
          </div>
          <div className="gochar-banner is-alert">
            <strong>{isHi ? 'नकारात्मक / सावधानी (Negative):' : 'Negative / Challenges:'}</strong>{' '}
            {isHi ? group.negativeHi : group.negativeEn}
          </div>
        </div>

        <div className="gochar-banner is-info">
          <strong>
            <Flame size={13} style={{ verticalAlign: 'middle' }} />{' '}
            {isHi ? 'प्रमुख घटना व दुर्घटना संकेत (Events/Incidents):' : 'Concrete Event / Incident Triggers:'}
          </strong>{' '}
          {isHi ? group.incidentRiskHi : group.incidentRiskEn}
        </div>

        <div className="muted small-text">
          <strong>{isHi ? 'उपाय (Remedy):' : 'Remedy:'}</strong>{' '}
          {isHi ? group.remedyHi : group.remedyEn}
        </div>

        {group.pairInsights.length > 0 && group.count > 2 && (
          <div className="panel-subblock">
            <h4>
              {isHi
                ? `इस ${group.count}-ग्रही समूह में निर्मित प्रमुख युति योग (${group.pairInsights.length} जोड़े):`
                : `Component Pair Yutis inside this ${group.count}-Planet Stellium:`}
            </h4>
            <div className="placement-cards" style={{ padding: '6px 0' }}>
              {group.pairInsights.map((pi) => (
                <div key={`${pi.pair[0]}-${pi.pair[1]}`} className="placement-card">
                  <div className="placement-card-top">
                    <strong>{isHi ? pi.yogaNameHi : pi.yogaNameEn}</strong>
                    <span
                      className={`tag ${
                        pi.tone === 'auspicious'
                          ? 'tag-varg'
                          : pi.tone === 'challenging'
                            ? 'tag-combust'
                            : 'tag-karaka'
                      }`}
                    >
                      {trPlanet(pi.pair[0], isHi ? 'hi' : 'en')} +{' '}
                      {trPlanet(pi.pair[1], isHi ? 'hi' : 'en')}
                    </span>
                  </div>
                  <p className="yoga-desc">
                    <strong>+</strong> {isHi ? pi.positiveHi : pi.positiveEn}
                  </p>
                  <p className="yoga-desc muted">
                    <strong>−</strong> {isHi ? pi.negativeHi : pi.negativeEn}
                  </p>
                  <p className="small-text">
                    <strong>{isHi ? 'घटना:' : 'Event:'}</strong>{' '}
                    {isHi ? pi.incidentHi : pi.incidentEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export const YutiPanel: React.FC<{ report: YutiReport }> = ({ report }) => {
  const { lang, t } = useLanguage();
  const isHi = lang === 'hi';

  const [selectedPlanets, setSelectedPlanets] = useState<NineGrahaId[]>(['Sun', 'Mercury']);
  const [simHouse, setSimHouse] = useState<number>(10);
  const [simSign, setSimSign] = useState<number>(0);

  const togglePlanet = (id: NineGrahaId) => {
    setSelectedPlanets((prev) => {
      if (prev.includes(id)) {
        return prev.length > 2 ? prev.filter((x) => x !== id) : prev;
      }
      if (prev.length >= 7) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  const applyPresetCount = (cnt: number) => {
    const presets: NineGrahaId[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
    setSelectedPlanets(presets.slice(0, cnt));
  };

  const simGroup = useMemo(
    () => inspectCustomYuti(selectedPlanets, simHouse, simSign),
    [selectedPlanets, simHouse, simSign]
  );

  return (
    <div className="view-stack">
      {/* 1. Native Chart Yutis */}
      <section className="panel">
        <div className="panel-header">
          <h3>
            <Layers size={15} />{' '}
            {isHi
              ? 'आपकी जन्म कुंडली में ग्रह युति फल (2 से 7 ग्रहों की युतियाँ)'
              : 'Yuti-Wise Conjunction Predictions in Your Birth Chart'}
          </h3>
          <span className="tag tag-karaka">
            {isHi
              ? `अधिकतम युति: ${report.maxConjunctionCount} ग्रह`
              : `Largest Yuti: ${report.maxConjunctionCount} Planet(s)`}
          </span>
        </div>
        <div className="two-col-split-pad">
          <div className="gochar-banner is-info">
            {isHi ? report.summaryHi : report.summaryEn}
          </div>
          {report.soloPlanets.length > 0 && (
            <div className="muted small-text">
              <strong>{isHi ? 'अकेले (अयुत) ग्रह:' : 'Solo / Unconjoined Planets:'}</strong>{' '}
              {report.soloPlanets.map((p) => trPlanet(p, lang)).join(', ')}
            </div>
          )}
        </div>
      </section>

      {report.groups.map((grp, idx) => (
        <YutiGroupCard key={`${grp.signIndex}-${idx}`} group={grp} isHi={isHi} />
      ))}

      {/* 2. Interactive 2- to 7-Planet Yuti Explorer */}
      <section className="panel">
        <div className="panel-header">
          <h3>
            <Sparkles size={15} />{' '}
            {isHi
              ? 'कस्टम युति एक्सप्लोरर — 2, 3, 4, 5, 6 या 7 ग्रहों की कोई भी युति जांचें'
              : '2 to 7 Planet Yuti Calculator (Test Any 2, 3, 4, 5, 6, or 7-Planet Conjunction)'}
          </h3>
          <div className="toolbar-group">
            {[2, 3, 4, 5, 6, 7].map((c) => (
              <button
                key={c}
                type="button"
                className={`subtab-btn ${selectedPlanets.length === c ? 'is-active' : ''}`}
                onClick={() => applyPresetCount(c)}
              >
                {c} {isHi ? 'ग्रह' : 'Pl'}
              </button>
            ))}
          </div>
        </div>

        <div className="two-col-split-pad">
          <div className="toolbar-group">
            <span className="label-muted">{isHi ? 'ग्रह चुनें (2–7):' : 'Select Planets (2–7):'}</span>
            {NINE_GRAHAS.map((g) => {
              const active = selectedPlanets.includes(g);
              return (
                <button
                  key={g}
                  type="button"
                  className={`subtab-btn ${active ? 'is-active' : ''}`}
                  onClick={() => togglePlanet(g)}
                >
                  {trPlanet(g, lang)}
                </button>
              );
            })}
          </div>

          <div className="toolbar-group">
            <label className="small-text muted">{t.common.house}:</label>
            <select
              className="select-compact"
              value={simHouse}
              onChange={(e) => setSimHouse(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                <option key={h} value={h}>
                  {t.common.house}{h}
                </option>
              ))}
            </select>
            <label className="small-text muted">{t.common.sign}:</label>
            <select
              className="select-compact"
              value={simSign}
              onChange={(e) => setSimSign(Number(e.target.value))}
            >
              {SIGNS.map((s) => (
                <option key={s.index} value={s.index}>
                  {trSign(s.index, lang)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {simGroup && <YutiGroupCard group={simGroup} isHi={isHi} />}
    </div>
  );
};
