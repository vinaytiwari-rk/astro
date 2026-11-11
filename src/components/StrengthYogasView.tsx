import React, { useMemo, useState } from 'react';
import { SEVEN_PLANETS } from '../astro/constants';
import type { ChartData } from '../astro/types';
import { localizeYogasHi, replaceEnTermsWithHi, trBadge } from '../i18n/hindiPredictions';
import { useLanguage } from '../i18n/LanguageContext';
import { trPlanet, trPlanetShort, trTerm } from '../i18n/translations';

interface StrengthYogasViewProps {
  chart: ChartData;
}

export const StrengthYogasView: React.FC<StrengthYogasViewProps> = ({ chart }) => {
  const { lang } = useLanguage();
  const [yogaFilter, setYogaFilter] = useState<string>('ALL');

  const localizedYogas = useMemo(
    () => (lang === 'hi' ? localizeYogasHi(chart.yogas) : chart.yogas),
    [chart.yogas, lang]
  );

  const categories = ['ALL', ...Array.from(new Set(localizedYogas.map((y) => y.category)))];
  const filteredYogas =
    yogaFilter === 'ALL'
      ? localizedYogas
      : localizedYogas.filter((y) => y.category === yogaFilter);

  return (
    <div className="view-stack">
      {/* Shadbala Table & Ratio Bars */}
      <section className="panel">
        <div className="panel-header">
          <h3>{lang === 'hi' ? 'षड्बल (छह प्रकार का ग्रह बल)' : 'Shadbala (Six-Fold Planetary Strength)'}</h3>
          <span className="muted">
            {lang === 'hi'
              ? 'मान विरुपा में (60 विरुपा = 1 रूप)। अनुपात ≥ 1.00 होने पर ग्रह पूर्ण बली माना जाता है।'
              : 'Values in Virupas (60 Virupas = 1 Rupa). Ratio ≥ 1.00 meets classical threshold.'}
          </span>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>{lang === 'hi' ? 'ग्रह' : 'Graha'}</th>
                <th>{lang === 'hi' ? 'स्थान बल' : 'Sthana'}</th>
                <th>{lang === 'hi' ? 'दिग् बल' : 'Dig'}</th>
                <th>{lang === 'hi' ? 'काल बल' : 'Kala'}</th>
                <th>{lang === 'hi' ? 'चेष्टा बल' : 'Cheshta'}</th>
                <th>{lang === 'hi' ? 'नैसर्गिक' : 'Naisargika'}</th>
                <th>{lang === 'hi' ? 'दृक् बल' : 'Drik'}</th>
                <th>{lang === 'hi' ? 'कुल (विरुपा)' : 'Total (Vir)'}</th>
                <th>{lang === 'hi' ? 'रूप' : 'Rupas'}</th>
                <th>{lang === 'hi' ? 'न्यूनतम आवश्यक' : 'Min Req'}</th>
                <th>{lang === 'hi' ? 'अनुपात' : 'Ratio'}</th>
                <th>{lang === 'hi' ? 'इष्ट / कष्ट फल' : 'Ishta / Kashta'}</th>
              </tr>
            </thead>
            <tbody>
              {chart.shadbala.map((r) => (
                <tr key={r.planet}>
                  <td>
                    <strong>{trPlanet(r.planet, lang)}</strong>
                  </td>
                  <td className="mono">{r.sthanaBala.toFixed(1)}</td>
                  <td className="mono">{r.digBala.toFixed(1)}</td>
                  <td className="mono">{r.kalaBala.toFixed(1)}</td>
                  <td className="mono">{r.cheshtaBala.toFixed(1)}</td>
                  <td className="mono">{r.naisargikaBala.toFixed(1)}</td>
                  <td className="mono">{r.drikBala.toFixed(1)}</td>
                  <td className="mono">
                    <strong>{r.totalVirupas.toFixed(1)}</strong>
                  </td>
                  <td className="mono">
                    <strong>{r.totalRupas.toFixed(2)}</strong>
                  </td>
                  <td className="mono muted">{r.requiredRupas.toFixed(1)}</td>
                  <td>
                    <span className={`tag ${r.isStrong ? 'tag-varg' : 'tag-combust'}`}>
                      {r.ratio.toFixed(2)}×
                    </span>
                  </td>
                  <td className="mono small-cell">
                    {r.ishtaPhala.toFixed(1)} / {r.kashtaPhala.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="basics-bottom-grid">
        {/* Panchadha Maitri Matrix */}
        <section className="panel">
          <div className="panel-header">
            <h3>{lang === 'hi' ? 'पंचधा मैत्री (5-स्तरीय ग्रह मैत्री)' : 'Panchadha Maitri (5-Fold Friendship)'}</h3>
            <span className="muted">
              {lang === 'hi' ? 'पंक्ति वाले ग्रह का स्तंभ वाले ग्रह के प्रति भाव' : "Row planet's attitude toward Column planet"}
            </span>
          </div>
          <div className="table-scroll">
            <table className="data-table matrix-table">
              <thead>
                <tr>
                  <th>{lang === 'hi' ? 'ग्रह →' : 'From \\ To'}</th>
                  {SEVEN_PLANETS.map((p) => (
                    <th key={p}>{trPlanetShort(p, lang)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SEVEN_PLANETS.map((p1) => (
                  <tr key={p1}>
                    <td>
                      <strong>{trPlanet(p1, lang)}</strong>
                    </td>
                    {SEVEN_PLANETS.map((p2) => {
                      const val = chart.maitriMatrix[p1][p2];
                      const shortMap: Record<string, string> = lang === 'hi'
                        ? {
                            Self: '—',
                            'Great Friend': 'अमि',
                            Friend: 'मि',
                            Neutral: 'सम',
                            Enemy: 'श',
                            'Great Enemy': 'अश',
                          }
                        : {
                            Self: '—',
                            'Great Friend': 'GF',
                            Friend: 'Fr',
                            Neutral: 'Nu',
                            Enemy: 'En',
                            'Great Enemy': 'GE',
                          };
                      const cls =
                        val === 'Great Friend' || val === 'Friend'
                          ? 'cell-strong'
                          : val === 'Great Enemy' || val === 'Enemy'
                            ? 'cell-weak'
                            : '';
                      return (
                        <td key={p2} className={`mono ${cls}`} title={`${trPlanet(p1, lang)} → ${trPlanet(p2, lang)}: ${trTerm(val, lang)}`}>
                          {shortMap[val] ?? trTerm(val, lang)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Graha Drishti Aspects */}
        <section className="panel">
          <div className="panel-header">
            <h3>{lang === 'hi' ? 'ग्रह दृष्टि संबंध (पूर्ण व विशेष)' : 'Planetary Aspects (Graha Drishti)'}</h3>
            <span className="muted">
              {lang === 'hi' ? `${chart.aspects.length} शास्त्रीय दृष्टि संबंध प्राप्त` : `${chart.aspects.length} classical aspects found`}
            </span>
          </div>
          <div className="table-scroll max-h-340">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{lang === 'hi' ? 'ग्रह से' : 'From'}</th>
                  <th>{lang === 'hi' ? 'दृष्टि' : 'Aspect'}</th>
                  <th>{lang === 'hi' ? 'लक्ष्य' : 'Target'}</th>
                  <th>{lang === 'hi' ? 'अंतर' : 'Orb'}</th>
                  <th>{lang === 'hi' ? 'बल %' : 'Strength'}</th>
                </tr>
              </thead>
              <tbody>
                {chart.aspects.map((a, idx) => (
                  <tr key={`${a.from}-${a.to}-${idx}`}>
                    <td>
                      <strong>{trPlanet(a.from, lang)}</strong>
                    </td>
                    <td>{lang === 'hi' ? replaceEnTermsWithHi(a.type).replace(/Full/gi, 'पूर्ण') : a.type}</td>
                    <td>{trPlanet(a.to, lang)}</td>
                    <td className="mono">{a.orbDeg.toFixed(1)}°</td>
                    <td className="mono">{a.strengthPercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Classical Yogas */}
      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>
              {lang === 'hi'
                ? `कुंडली में प्राप्त प्रमुख योग एवं दोष (${filteredYogas.length})`
                : `Detected Classical Yogas & Doshas (${filteredYogas.length})`}
            </h3>
          </div>
          <div className="subtab-bar">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={`subtab-btn ${yogaFilter === c ? 'is-active' : ''}`}
                onClick={() => setYogaFilter(c)}
              >
                {c === 'ALL' ? (lang === 'hi' ? 'सभी' : 'ALL') : trBadge(c, lang)}
              </button>
            ))}
          </div>
        </div>

        {filteredYogas.length === 0 ? (
          <div className="empty-state">{lang === 'hi' ? 'इस श्रेणी में कोई योग नहीं मिला।' : 'No yogas matched this filter.'}</div>
        ) : (
          <div className="yoga-grid">
            {filteredYogas.map((y, idx) => (
              <div key={`${y.name}-${idx}`} className={`yoga-card cat-${y.category.toLowerCase()}`}>
                <div className="yoga-card-top">
                  <strong>{y.name}</strong>
                  <span className="tag">{trBadge(y.category, lang)}</span>
                </div>
                <p className="yoga-desc">{y.description}</p>
                <div className="yoga-meta">
                  <span>{lang === 'hi' ? 'संबंधित ग्रह:' : 'Planets:'} {y.planets.join(', ')}</span>
                  <span className="muted">{lang === 'hi' ? 'बल:' : 'Strength:'} {trBadge(y.strength, lang)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
