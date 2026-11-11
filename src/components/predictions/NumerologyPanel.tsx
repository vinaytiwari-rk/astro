import React, { useEffect, useMemo, useState } from 'react';
import { Grid3x3 } from 'lucide-react';
import { computeNumerologyReport } from '../../astro/numerology';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { DateDmyInput } from '../DateDmyInput';

interface NumerologyPanelProps {
  chart: ChartData;
}

const LO_SHU_CELLS: number[] = [4, 9, 2, 3, 5, 7, 8, 1, 6];

export const NumerologyPanel: React.FC<NumerologyPanelProps> = ({ chart }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [numName, setNumName] = useState(chart.input.name);
  const [numDob, setNumDob] = useState(chart.input.date);
  const [numGender, setNumGender] = useState<'male' | 'female' | 'other'>(
    chart.input.gender || 'other'
  );
  const [numYear, setNumYear] = useState<number>(() => new Date().getFullYear());

  useEffect(() => {
    setNumName(chart.input.name);
    setNumDob(chart.input.date);
    setNumGender(chart.input.gender || 'other');
  }, [chart.input.id, chart.input.name, chart.input.date, chart.input.gender]);

  const numReport = useMemo(
    () => computeNumerologyReport(numName, numDob, numGender, numYear),
    [numName, numDob, numGender, numYear]
  );

  return (
    <div className="view-stack">
      <section className="panel">
        <div className="panel-header">
          <h3>
            <Grid3x3 size={15} />{' '}
            {isHi
              ? 'संपूर्ण अंक ज्योतिष (मूलांक, भाग्यांक, नामांक व लो शू ग्रिड)'
              : 'Complete Numerology (Mulank, Bhagyank, Chaldean & Lo Shu Grid)'}
          </h3>
        </div>
        <div className="form-grid">
          <label className="field span-2">
            <span>
              {isHi
                ? 'नाम (नामांक एवं संगतता जांच हेतु)'
                : 'Name (Test Spelling for Chaldean / Pythagorean)'}
            </span>
            <input
              type="text"
              className="text-input"
              value={numName}
              onChange={(e) => setNumName(e.target.value)}
            />
          </label>
          <label className="field">
            <span>{isHi ? 'जन्म तिथि (DD-MM-YYYY)' : 'Date of Birth (DD-MM-YYYY)'}</span>
            <DateDmyInput
              value={numDob}
              ariaLabel={isHi ? 'जन्म तिथि (DD-MM-YYYY)' : 'Date of Birth (DD-MM-YYYY)'}
              onChange={setNumDob}
            />
          </label>
          <label className="field">
            <span>{isHi ? 'लिंग (कुआ अंक हेतु)' : 'Gender (for Kua Number)'}</span>
            <select
              className="text-input"
              value={numGender}
              onChange={(e) => setNumGender(e.target.value as 'male' | 'female' | 'other')}
            >
              <option value="male">{isHi ? 'पुरुष' : 'Male'}</option>
              <option value="female">{isHi ? 'महिला' : 'Female'}</option>
              <option value="other">{isHi ? 'अन्य' : 'Other'}</option>
            </select>
          </label>
          <label className="field">
            <span>{isHi ? 'लक्ष्य वर्ष (पर्सनल ईयर)' : 'Target Year (Personal Year)'}</span>
            <input
              type="number"
              className="text-input mono"
              value={numYear}
              onChange={(e) => setNumYear(parseInt(e.target.value, 10) || 2026)}
            />
          </label>
        </div>

        <div className="panel-subblock">
          <div className="branch-highlights">
            <div className="highlight-box">
              <span className="muted small-text">
                {isHi ? 'मूलांक (Mulank / Driver)' : 'Mulank (Radical / Driver)'}
              </span>
              <strong>
                {numReport.mulank} — {isHi ? numReport.mulankRulerHi : numReport.mulankRulerEn}
              </strong>
              <span className="muted small-text">
                {isHi ? numReport.mulankProfileHi : numReport.mulankProfileEn}
              </span>
            </div>
            <div className="highlight-box">
              <span className="muted small-text">
                {isHi ? 'भाग्यांक (Bhagyank / Destiny)' : 'Bhagyank (Destiny / Conductor)'}
              </span>
              <strong>{numReport.bhagyank}</strong>
              <span className="muted small-text">
                {isHi ? numReport.bhagyankProfileHi : numReport.bhagyankProfileEn}
              </span>
            </div>
            <div className="highlight-box">
              <span className="muted small-text">
                {isHi ? 'कुआ अंक व पर्सनल ईयर' : 'Kua Number & Personal Year'}
              </span>
              <strong>
                {isHi ? 'कुआ:' : 'Kua:'} {numReport.kuaNumber} ·{' '}
                {isHi ? `${numYear} अंक:` : `PY ${numYear}:`} {numReport.personalYear}
              </strong>
              <span className="muted small-text">
                {isHi ? numReport.kuaDirectionsHi : numReport.kuaDirectionsEn}
              </span>
            </div>
            <div className="highlight-box">
              <span className="muted small-text">
                {isHi ? 'कीरो (Chaldean) व पाइथागोरस नामांक' : 'Chaldean & Pythagorean Name #'}
              </span>
              <strong>
                {isHi ? 'कीरो:' : 'Chaldean:'} {numReport.chaldeanTotal} → {numReport.chaldeanReduced} ·{' '}
                {isHi ? 'पाइथा:' : 'Pyth:'} {numReport.pythagoreanReduced}
              </strong>
              <span className="muted small-text">
                {isHi ? numReport.nameCompatibilityHi : numReport.nameCompatibilityEn}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="pred-top-grid">
        <section className="panel">
          <div className="panel-header">
            <h3>{isHi ? 'लो शू ग्रिड (Lo Shu 3×3 चक्र)' : 'Lo Shu Grid (3×3 Matrix)'}</h3>
            <span className="muted">
              {isHi ? 'शुभ रंग:' : 'Colors:'}{' '}
              {isHi ? numReport.luckyColorsHi : numReport.luckyColorsEn}
            </span>
          </div>
          <div className="pred-card-body">
            <div className="loshu-grid" aria-label="Lo Shu Grid">
              {LO_SHU_CELLS.map((digit) => {
                const cnt = numReport.loShuCounts[digit] ?? 0;
                const display = cnt > 0 ? String(digit).repeat(Math.min(cnt, 5)) : '—';
                return (
                  <div key={digit} className={`loshu-cell ${cnt > 0 ? 'is-present' : 'is-missing'}`}>
                    <div className="loshu-num mono">{display}</div>
                    <div className="loshu-count">#{digit} ({cnt}×)</div>
                  </div>
                );
              })}
            </div>
            <div className="pred-bullets">
              <div>
                <strong>{isHi ? 'शुभ दिन:' : 'Lucky Days:'}</strong>{' '}
                {isHi ? numReport.luckyDaysHi : numReport.luckyDaysEn}
              </div>
              <div>
                <strong>{isHi ? 'अनुकूल अंक:' : 'Compatible Numbers:'}</strong>{' '}
                {numReport.compatibleNumbers.join(', ')}
              </div>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>{isHi ? 'लो शू ग्रिड के 8 योग एवं रेखाएँ' : '8 Lo Shu Planes & Rajayoga Arrows'}</h3>
          </div>
          <div className="table-scroll max-h-340">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isHi ? 'योग / रेखा' : 'Plane / Arrow'}</th>
                  <th>{isHi ? 'बल %' : 'Strength'}</th>
                  <th>{isHi ? 'फल' : 'Meaning'}</th>
                </tr>
              </thead>
              <tbody>
                {numReport.loShuPlanes.map((p) => (
                  <tr key={p.id}>
                    <td><strong>{isHi ? p.nameHi : p.nameEn}</strong></td>
                    <td>
                      <span
                        className={`tag ${
                          p.complete ? 'tag-varg' : p.presentDigits.length >= 2 ? 'tag-karaka' : 'tag-retro'
                        }`}
                      >
                        {p.strengthPercent}% ({p.presentDigits.join(',') || '0'})
                      </span>
                    </td>
                    <td className="wrap-cell">{isHi ? p.meaningHi : p.meaningEn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {numReport.missingNumbers.length > 0 && (
        <section className="panel">
          <div className="panel-header">
            <h3>
              {isHi
                ? 'अनुपस्थित अंक प्रभाव एवं लो शू उपाय'
                : 'Missing Digits Impact & Balancing Remedies'}
            </h3>
          </div>
          <div className="domains-grid">
            {numReport.missingNumbers.map((m) => (
              <article key={m.digit} className="domain-card">
                <div className="domain-top">
                  <h4>
                    {isHi ? `अंक ${m.digit} अनुपस्थित` : `Missing Number ${m.digit}`} (
                    {isHi ? m.planetHi : m.planetEn})
                  </h4>
                </div>
                <p className="domain-summary">{isHi ? m.impactHi : m.impactEn}</p>
                <div className="gochar-banner is-clear">
                  <strong>{isHi ? 'सरल उपाय:' : 'Remedy:'}</strong>{' '}
                  {isHi ? m.remedyHi : m.remedyEn}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
