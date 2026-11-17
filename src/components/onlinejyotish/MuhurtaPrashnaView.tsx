import React, { useState } from 'react';
import { findAuspiciousMuhurtas, type MuhurtaPurpose } from '../../astro/muhurtaFinder';
import { computePrashnaKP, type PrashnaCategory } from '../../astro/prashnaKP';
import { computeComprehensiveNadiReport } from '../../astro/nadiAstrology';
import type { ChartData } from '../../astro/types';

interface MuhurtaPrashnaViewProps {
  chart: ChartData;
  initialTab?: 'muhurta' | 'prashna' | 'nadi';
}

export const MuhurtaPrashnaView: React.FC<MuhurtaPrashnaViewProps> = ({ chart, initialTab = 'muhurta' }) => {
  const [activeTab, setActiveTab] = useState<'muhurta' | 'prashna' | 'nadi'>(initialTab);

  // Muhurta State
  const [purpose, setPurpose] = useState<MuhurtaPurpose>('marriage');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [daysCount, setDaysCount] = useState(30);

  const muhurtaReport = React.useMemo(() => {
    return findAuspiciousMuhurtas({
      purpose,
      startDate,
      daysToScan: daysCount,
      latitude: chart.input.latitude,
      longitude: chart.input.longitude,
      timezone: chart.input.timezone,
    });
  }, [purpose, startDate, daysCount, chart.input]);

  // KP Prashna State
  const [horaryNum, setHoraryNum] = useState(108);
  const [prashnaCat, setPrashnaCat] = useState<PrashnaCategory>('job_career');
  const [questionText, setQuestionText] = useState('Will I get the new job offer this month?');

  const prashnaReport = React.useMemo(() => {
    return computePrashnaKP({
      horaryNumber: horaryNum,
      question: questionText,
      category: prashnaCat,
      questionDate: new Date().toISOString().slice(0, 10),
      questionTime: new Date().toTimeString().slice(0, 8),
      latitude: chart.input.latitude,
      longitude: chart.input.longitude,
      timezone: chart.input.timezone,
    });
  }, [horaryNum, questionText, prashnaCat, chart.input]);

  // Nadi Report
  const nadiReport = React.useMemo(() => {
    return computeComprehensiveNadiReport(chart);
  }, [chart]);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>
            Electional Muhurta, KP Horary (1–249) & Nadi Shastra
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            Automated 90-day auspicious window finder, Krishnamurti horary seed calculator & 14 Agastya Kandams
          </p>
        </div>

        {/* Tab Pills */}
        <div className="oj-tab-pills-row">
          <button
            type="button"
            onClick={() => setActiveTab('muhurta')}
            className={`oj-tab-pill ${activeTab === 'muhurta' ? 'is-active' : ''}`}
          >
            Muhurta Finder (90-Day)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('prashna')}
            className={`oj-tab-pill ${activeTab === 'prashna' ? 'is-active' : ''}`}
          >
            KP Prashna (1–249)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('nadi')}
            className={`oj-tab-pill ${activeTab === 'nadi' ? 'is-active' : ''}`}
          >
            Nadi Palm Leaf Kandams
          </button>
        </div>
      </div>

      {/* Tab 1: Muhurta Finder */}
      {activeTab === 'muhurta' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Filter Bar */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', background: 'var(--bg-elevated)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Muhurta Purpose:
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as MuhurtaPurpose)}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--text)', fontWeight: 600 }}
              >
                <option value="marriage">Vivaha (Marriage / विवाह)</option>
                <option value="griha_pravesh">Griha Pravesh (House Warming / गृह प्रवेश)</option>
                <option value="vehicle">Vehicle Purchase (वाहन क्रय)</option>
                <option value="business">Business Launch (व्यापार प्रारंभ)</option>
                <option value="property">Property / Land (भूमि क्रय)</option>
                <option value="surgery">Surgery / Medical (शल्य क्रिया)</option>
                <option value="travel">Travel / Journey (यात्रा)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Search From Date:
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--text)', fontWeight: 600 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Window Range:
              </label>
              <select
                value={daysCount}
                onChange={(e) => setDaysCount(Number(e.target.value))}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--text)', fontWeight: 600 }}
              >
                <option value={15}>Next 15 Days</option>
                <option value={30}>Next 30 Days (1 Month)</option>
                <option value={60}>Next 60 Days (2 Months)</option>
                <option value={90}>Next 90 Days (Quarter)</option>
              </select>
            </div>

            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Auspicious Dates Found</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent)' }}>
                {muhurtaReport.bestDates.length} Optimal Windows
              </div>
            </div>
          </div>

          {/* Best Muhurta Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {muhurtaReport.bestDates.slice(0, 12).map((m, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-elevated)',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  borderTop: `4px solid ${m.score >= 80 ? '#059669' : '#2563eb'}`,
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>
                      {m.date} ({m.dayOfWeek})
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {m.tithiPaksha} {m.tithiName} · {m.nakshatraName}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: m.score >= 80 ? 'rgba(5, 150, 105, 0.12)' : 'rgba(37, 99, 235, 0.12)',
                      color: m.score >= 80 ? '#059669' : '#2563eb',
                    }}
                  >
                    {m.score}/100
                  </span>
                </div>

                {/* Windows */}
                <div style={{ background: 'var(--bg-subtle)', borderRadius: '6px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' }}>
                    Recommended Shubh Lagna / Choghadiya Windows
                  </div>
                  {m.windows.map((w, wIdx) => (
                    <div key={wIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text)' }}>
                      <span>• {w.muhurtaType}</span>
                      <strong style={{ color: 'var(--accent)' }}>{w.startTime} - {w.endTime}</strong>
                    </div>
                  ))}
                </div>

                {/* Rahu Kalam */}
                <div style={{ fontSize: '11.5px', color: '#dc2626' }}>
                  ⚠ Inauspicious Rahu Kalam to Avoid: <strong>{m.rahuKalam}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: KP Prashna 1-249 */}
      {activeTab === 'prashna' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Query Bar */}
          <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--text)' }}>
              Ask a Specific Horary Question (1–249 KP Seed Number)
            </h4>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  KP Horary Seed (1 to 249):
                </label>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <input
                    type="number"
                    min={1}
                    max={249}
                    value={horaryNum}
                    onChange={(e) => setHoraryNum(Math.max(1, Math.min(249, Number(e.target.value))))}
                    style={{ width: '90px', padding: '8px 12px', borderRadius: '6px', border: '1.5px solid var(--accent)', background: 'var(--bg-subtle)', color: 'var(--text)', fontWeight: 700, fontSize: '15px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setHoraryNum(Math.floor(Math.random() * 249) + 1)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid rgba(217, 119, 6, 0.4)',
                      background: 'rgba(254, 243, 199, 0.7)',
                      color: '#b45309',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                    title="रैंडम प्रश्न बीज (1–249) चुनें"
                  >
                    रैंडम बीज (Random)
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Question Category:
                </label>
                <select
                  value={prashnaCat}
                  onChange={(e) => setPrashnaCat(e.target.value as PrashnaCategory)}
                  style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--text)', fontWeight: 600, fontSize: '13px' }}
                >
                  <option value="job_career">Job & Career (नौकरी / आजीविका)</option>
                  <option value="marriage">Marriage & Relationship (विवाह)</option>
                  <option value="wealth_business">Wealth & Business (धन लाभ)</option>
                  <option value="health_recovery">Health Recovery (रोग मुक्ति)</option>
                  <option value="property_vehicle">Property / Vehicle (भवन / वाहन)</option>
                  <option value="litigation_court">Court Litigation (मुकदमा)</option>
                  <option value="foreign_travel">Foreign Travel & Visa (विदेश यात्रा)</option>
                  <option value="lost_object">Lost Object Recovery (खोई वस्तु)</option>
                  <option value="education">Education & Exam (परीक्षा)</option>
                </select>
              </div>

              <div style={{ flex: 1, minWidth: '260px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Question Context:
                </label>
                <input
                  type="text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--text)', fontSize: '13px' }}
                />
              </div>
            </div>

            {/* Quick Question Presets */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', paddingTop: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#b45309' }}>त्वरित प्रश्न (Presets):</span>
              {[
                { label: 'नौकरी: नया अवसर?', cat: 'job_career' as PrashnaCategory, text: 'क्या मुझे नई नौकरी या पदोन्नति का अवसर शीघ्र मिलेगा?' },
                { label: 'विवाह: क्या तय होगा?', cat: 'marriage' as PrashnaCategory, text: 'क्या इस वर्ष मेरा विवाह तय या संपन्न होगा?' },
                { label: 'धन लाभ: रुका धन?', cat: 'wealth_business' as PrashnaCategory, text: 'क्या व्यापार या ऋण में रुका हुआ धन वापस मिलेगा?' },
                { label: 'रोग मुक्ति: स्वास्थ्य लाभ?', cat: 'health_recovery' as PrashnaCategory, text: 'क्या वर्तमान रोग या अस्वस्थता से शीघ्र पूर्ण मुक्ति मिलेगी?' },
                { label: 'मुकदमा: क्या विजय होगी?', cat: 'litigation_court' as PrashnaCategory, text: 'क्या न्यायालय/विवाद में निर्णय मेरे पक्ष में आएगा?' },
                { label: 'खोई वस्तु: क्या मिलेगी?', cat: 'lost_object' as PrashnaCategory, text: 'क्या खोई या चोरी हुई वस्तु पुनः प्राप्त हो जाएगी?' },
                { label: 'वाहन/भवन क्रय?', cat: 'property_vehicle' as PrashnaCategory, text: 'क्या नया मकान या वाहन खरीदना शुभ और सफल रहेगा?' },
              ].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPrashnaCat(p.cat);
                    setQuestionText(p.text);
                  }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    border: '1px solid rgba(217, 119, 6, 0.35)',
                    background: 'rgba(254, 243, 199, 0.5)',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Outcome Verdict Card */}
          <div
            style={{
              padding: '24px',
              borderRadius: '10px',
              background:
                prashnaReport.verdict.outcome.startsWith('Favorable')
                  ? 'rgba(5, 150, 105, 0.08)'
                  : prashnaReport.verdict.outcome.startsWith('Conditional')
                    ? 'rgba(217, 119, 6, 0.08)'
                    : 'rgba(220, 38, 38, 0.08)',
              border: `2px solid ${
                prashnaReport.verdict.outcome.startsWith('Favorable')
                  ? '#059669'
                  : prashnaReport.verdict.outcome.startsWith('Conditional')
                    ? '#d97706'
                    : '#dc2626'
              }`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' }}>
                  KP Shastra Prashna Verdict
                </span>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color:
                      prashnaReport.verdict.outcome.startsWith('Favorable')
                        ? '#059669'
                        : prashnaReport.verdict.outcome.startsWith('Conditional')
                          ? '#d97706'
                          : '#dc2626',
                    marginTop: '2px',
                  }}
                >
                  {prashnaReport.verdict.outcome} ({prashnaReport.verdict.outcomeHi})
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Confidence Index</span>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>
                  {prashnaReport.verdict.confidencePercent}%
                </div>
              </div>
            </div>

            <div style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text)', marginBottom: '10px' }}>
              {prashnaReport.verdict.detailedAnalysisEn}
            </div>
            <div style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-muted)', marginBottom: '14px' }}>
              {prashnaReport.verdict.detailedAnalysisHi}
            </div>

            {/* Timing & Remedy */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', paddingTop: '14px', borderTop: '1px dashed var(--border)' }}>
              <div>
                <strong style={{ fontSize: '12px', color: 'var(--accent)', textTransform: 'uppercase' }}>Timing of Fulfillment:</strong>
                <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'var(--text)' }}>
                  {prashnaReport.verdict.timingPredictionEn}
                </p>
              </div>
              <div>
                <strong style={{ fontSize: '12px', color: '#059669', textTransform: 'uppercase' }}>Recommended Vedic Upaya:</strong>
                <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'var(--text)' }}>
                  {prashnaReport.verdict.remedyEn}
                </p>
              </div>
            </div>
          </div>

          {/* Astronomical & RP Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div style={{ padding: '16px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>KP Ascendant Longitude</div>
              <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--accent)', marginTop: '4px' }}>
                {prashnaReport.ascendant.signName} {prashnaReport.ascendant.dms}
              </div>
            </div>
            <div style={{ padding: '16px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Star Lord & Sub-Lord</div>
              <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', marginTop: '4px' }}>
                Star: {prashnaReport.ascendant.starLord} · Sub: {prashnaReport.ascendant.subLord}
              </div>
            </div>
            <div style={{ padding: '16px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Live Ruling Planets Agreement</div>
              <div style={{ fontSize: '17px', fontWeight: 700, color: '#059669', marginTop: '4px' }}>
                {prashnaReport.verdict.rulingPlanetsAgreement} Alignment
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Nadi Palm Leaf Kandams */}
      {activeTab === 'nadi' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Shiva Dialogue Decree Hero */}
          <div style={{ padding: '20px', borderRadius: '10px', background: 'rgba(180, 83, 9, 0.08)', border: '1.5px solid var(--accent)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Shiva-Parvati Nadi Dialogue · {nadiReport.shivaNadi.karmaClassification} Karma ({nadiReport.shivaNadi.karmaClassificationHi})
            </div>
            <div style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text)', marginBottom: '8px' }}>
              "{nadiReport.shivaNadi.divineDecreeEn}"
            </div>
            <div style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-muted)', marginBottom: '12px' }}>
              "{nadiReport.shivaNadi.divineDecreeHi}"
            </div>
            <div style={{ fontSize: '12.5px', color: '#059669', fontWeight: 600 }}>
              Recommended Jyotirlinga Pilgrimage: {nadiReport.shivaNadi.recommendedJyotirlingaEn} ({nadiReport.shivaNadi.recommendedJyotirlingaHi})
            </div>
          </div>

          {/* 14 Agastya Kandams Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {nadiReport.agastyaKandams.map((k) => (
              <div
                key={k.kandamNumber}
                style={{
                  padding: '16px',
                  borderRadius: '8px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderLeft: `4px solid ${k.isFortunate ? '#059669' : '#d97706'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text)' }}>
                    Kandam {k.kandamNumber}: {k.nameEn}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600 }}>{k.nameHi}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{k.themeEn}</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text)', lineHeight: 1.5, marginTop: '4px' }}>
                  {k.verdictEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MuhurtaPrashnaView;
