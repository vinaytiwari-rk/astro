import React, { useState, useEffect, useMemo } from 'react';
import { computeKPEnterprise } from '../../astro/kpEnterprise';
import { computeVarshaphala } from '../../astro/varshaphala';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet } from '../../i18n/translations';

interface KPEnterpriseViewProps {
  chart: ChartData;
  initialTab?: 'fourfold' | 'csl' | 'rp' | 'varsha';
}

export const KPEnterpriseView: React.FC<KPEnterpriseViewProps> = ({ chart, initialTab = 'fourfold' }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [activeTab, setActiveTab] = useState<'fourfold' | 'csl' | 'rp' | 'varsha'>(initialTab);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const kpReport = useMemo(() => computeKPEnterprise(chart), [chart]);
  const varshaReport = useMemo(() => computeVarshaphala(chart, selectedYear), [chart, selectedYear]);

  return (
    <div className="kp-enterprise-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>
            {isHi ? 'केपी सिस्टम एवं ताजिक वर्षफल' : 'KP Enterprise Shastra & Varshaphala'}
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            {isHi
              ? 'कृष्णमूर्ति पद्धति 4-स्तरीय कारकत्व, कस्पल सब-लॉर्ड, लाइव रूलिंग प्लैनेट्स एवं वार्षिक सौर वर्षफल'
              : 'Krishnamurti Paddhati 4-Fold Significators, Cuspal Sub-Lords, Live Ruling Planets & Tajika Annual Solar Return'}
          </p>
        </div>

        {/* Tab Pills */}
        <div className="oj-tab-pills-row">
          <button
            type="button"
            onClick={() => setActiveTab('fourfold')}
            className={`oj-tab-pill ${activeTab === 'fourfold' ? 'is-active' : ''}`}
          >
            {isHi ? '4-स्तरीय कारकत्व' : '4-Fold Significators'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('csl')}
            className={`oj-tab-pill ${activeTab === 'csl' ? 'is-active' : ''}`}
          >
            {isHi ? 'कस्पल सब-लॉर्ड (CSL)' : 'Cuspal Sub-Lords'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rp')}
            className={`oj-tab-pill ${activeTab === 'rp' ? 'is-active' : ''}`}
          >
            {isHi ? 'रूलिंग प्लैनेट्स (RP)' : 'Live Ruling Planets'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('varsha')}
            className={`oj-tab-pill ${activeTab === 'varsha' ? 'is-active' : ''}`}
          >
            {isHi ? 'ताजिक वर्षफल' : 'Tajika Varshaphala'}
          </button>
        </div>
      </div>

      {/* Tab 1: 4-Fold Significators */}
      {activeTab === 'fourfold' && (
        <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)', padding: '20px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '16px', color: 'var(--text)' }}>
            {isHi ? 'केपी 4-स्तरीय ग्रह कारकत्व सारणी (12 भाव)' : 'KP 4-Fold Planetary Significators Table (12 Bhavas)'}
          </h3>
          <p style={{ margin: '0 0 16px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
            {isHi
              ? 'स्तर A (प्रबलतम) = भाव स्थित ग्रह के नक्षत्र में | स्तर B = भाव में स्थित ग्रह | स्तर C = भावेश के नक्षत्र में | स्तर D = भावेश'
              : 'Level A (Strongest) = In Star of Occupant | Level B = In House | Level C = In Star of Lord | Level D = House Lord'}
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '10px' }}>{isHi ? 'भाव' : 'House'}</th>
                  <th style={{ padding: '10px' }}>{isHi ? 'स्तर A (नक्षत्र में स्थित)' : 'Level A (Star of Occupant)'}</th>
                  <th style={{ padding: '10px' }}>{isHi ? 'स्तर B (भाव में स्थित)' : 'Level B (Occupants)'}</th>
                  <th style={{ padding: '10px' }}>{isHi ? 'स्तर C (भावेश के नक्षत्र में)' : 'Level C (Star of Lord)'}</th>
                  <th style={{ padding: '10px' }}>{isHi ? 'स्तर D (भावेश)' : 'Level D (House Lord)'}</th>
                  <th style={{ padding: '10px' }}>{isHi ? 'समस्त कारक ग्रह' : 'All Significators'}</th>
                </tr>
              </thead>
              <tbody>
                {kpReport.fourFoldSignificators.map((row) => (
                  <tr key={row.house} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px', fontWeight: 700, color: 'var(--accent)' }}>
                      {isHi ? `${row.house}वां भाव` : `House ${row.house}`}
                    </td>
                    <td style={{ padding: '10px' }}>
                      {row.lordA.length ? row.lordA.map((p) => trPlanet(p, lang)).join(', ') : '—'}
                    </td>
                    <td style={{ padding: '10px' }}>
                      {row.lordB.length ? row.lordB.map((p) => trPlanet(p, lang)).join(', ') : '—'}
                    </td>
                    <td style={{ padding: '10px' }}>
                      {row.lordC.length ? row.lordC.map((p) => trPlanet(p, lang)).join(', ') : '—'}
                    </td>
                    <td style={{ padding: '10px' }}>
                      {row.lordD.length ? row.lordD.map((p) => trPlanet(p, lang)).join(', ') : '—'}
                    </td>
                    <td style={{ padding: '10px', fontWeight: 600 }}>
                      {row.allSignificators.map((p) => trPlanet(p, lang)).join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Cuspal Sub-Lords */}
      {activeTab === 'csl' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {kpReport.cuspalSubLordGrid.map((csl) => (
            <div
              key={csl.house}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
                  {isHi ? `${csl.house}वां भाव कस्प` : `Cusp ${csl.house}`}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(180, 83, 9, 0.12)', color: 'var(--accent)' }}>
                  CSL: {trPlanet(csl.csl, lang)}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {isHi ? 'कारक भाव:' : 'Signifies Houses:'} <strong>{csl.cslSignificates.join(', ') || (isHi ? 'कोई नहीं' : 'None')}</strong>
              </div>
              <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {csl.predictions.map((p, idx) => (
                  <div key={idx} style={{ fontSize: '12px', color: 'var(--text)' }}>
                    • {p}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Live Ruling Planets */}
      {activeTab === 'rp' && (
        <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)', padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '17px', color: 'var(--text)' }}>
            {isHi ? 'वर्तमान समय के लाइव रूलिंग प्लैनेट्स (RP)' : 'Live Ruling Planets (RP) at Current Moment'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
            <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {isHi ? 'वार स्वामी (Day Lord)' : 'Day Lord (Vara)'}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent)', marginTop: '4px' }}>
                {trPlanet(kpReport.liveRulingPlanets.dayLord, lang)}
              </div>
            </div>
            <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {isHi ? 'लग्न राशि स्वामी' : 'Lagna Sign Lord'}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginTop: '4px' }}>
                {trPlanet(kpReport.liveRulingPlanets.lagnaLord, lang)}
              </div>
            </div>
            <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {isHi ? 'लग्न नक्षत्र स्वामी' : 'Lagna Star Lord'}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginTop: '4px' }}>
                {trPlanet(kpReport.liveRulingPlanets.lagnaStarLord, lang)}
              </div>
            </div>
            <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {isHi ? 'चंद्र राशि स्वामी' : 'Moon Sign Lord'}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginTop: '4px' }}>
                {trPlanet(kpReport.liveRulingPlanets.moonSignLord, lang)}
              </div>
            </div>
            <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {isHi ? 'चंद्र नक्षत्र स्वामी' : 'Moon Star Lord'}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginTop: '4px' }}>
                {trPlanet(kpReport.liveRulingPlanets.moonStarLord, lang)}
              </div>
            </div>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-subtle)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <h4 style={{ margin: '0 0 6px', fontSize: '14px', color: 'var(--accent)' }}>
              {isHi ? 'केपी रूलिंग प्लैनेट्स सामंजस्य निर्णय' : 'Ruling Planets Agreement Verdict'}
            </h4>
            <div style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.5 }}>
              {kpReport.liveRulingPlanets.commonPlanets.length > 0
                ? kpReport.liveRulingPlanets.commonPlanets.map((p) => trPlanet(p, lang)).join(', ')
                : (isHi ? 'लग्न एवं चंद्र स्वामियों के मध्य पूर्ण सामंजस्य' : 'Planets in strong agreement across Ascendant and Moon rulers')}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Tajika Varshaphala */}
      {activeTab === 'varsha' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-elevated)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
              {isHi ? 'वर्षफल ईसवी वर्ष चुनें:' : 'Select Solar Return Year:'}
            </label>
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              style={{ width: '90px', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--text)', fontWeight: 600 }}
            />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {isHi ? `(पूर्ण आयु: ${varshaReport.completedYears} वर्ष)` : `(Age completed: ${varshaReport.completedYears} years)`}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {isHi ? 'मुन्था राशि एवं भाव' : 'Muntha Sign & House'}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent)', marginTop: '4px' }}>
                {varshaReport.munthaSignName} ({isHi ? `${varshaReport.munthaHouse}वां भाव` : `House ${varshaReport.munthaHouse}`})
              </div>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {isHi ? 'वर्षेश (वर्ष का स्वामी)' : 'Varsheshwar (Year Lord)'}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginTop: '4px' }}>
                {trPlanet(varshaReport.varshesh, lang)}
              </div>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {isHi ? 'वर्ष प्रवेश समय' : 'Solar Return Epoch'}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginTop: '4px' }}>
                {varshaReport.varshaPraveshLocal}
              </div>
            </div>
          </div>

          {/* Muntha Prediction */}
          <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '14px', color: 'var(--accent)' }}>
              {isHi ? 'मुन्था फल (वार्षिक गति फलादेश)' : 'Muntha Phalam (Annual Progression)'}
            </h4>
            <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6, color: 'var(--text)' }}>{varshaReport.munthaPrediction}</p>
          </div>

          {/* Tajika Sahams */}
          <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: 'var(--text)' }}>
              {isHi ? 'प्रमुख ताजिक सहम (संवेदनशील बिंदु)' : 'Key Tajika Sahams (Sensitive Arabic Points)'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {varshaReport.sahams.map((s) => (
                <div key={s.nameEn} style={{ padding: '10px', borderRadius: '6px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>
                    {isHi ? s.nameHi : s.nameEn}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text)', marginTop: '2px' }}>
                    {isHi ? `${s.house}वां भाव` : `House ${s.house}`} · {s.dms}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KPEnterpriseView;
