import React, { useState, useMemo } from 'react';
import type { ChartData } from '../../astro/types';
import { computeFullLalKitabReport, type FullLalKitabReport } from '../../astro/lalKitabExtended';
import { formatDateDmy } from '../../astro/time';
import { useLanguage } from '../../i18n/LanguageContext';
import { BookOpen, AlertCircle, Compass, ShieldAlert, Sparkles, Sliders, Printer } from 'lucide-react';

interface LalKitabViewProps {
  chart: ChartData;
  onNavigate?: (view: string) => void;
}

const HINDI_GRAHAS: Record<string, string> = {
  Sun: 'सूर्य',
  Moon: 'चंद्र',
  Mars: 'मंगल',
  Mercury: 'बुध',
  Jupiter: 'बृहस्पति (गुरु)',
  Venus: 'शुक्र',
  Saturn: 'शनि',
  Rahu: 'राहु',
  Ketu: 'केतु',
};

export const LalKitabView: React.FC<LalKitabViewProps> = ({ chart, onNavigate }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const birthYear = parseInt(chart.input.date.split('-')[0], 10) || 1990;
  const currentYear = new Date().getFullYear();
  const initialAge = Math.max(1, currentYear - birthYear);

  const [selectedAge, setSelectedAge] = useState<number>(initialAge);
  const [activeTab, setActiveTab] = useState<'teva' | 'sleeping' | 'debts' | 'varshphal' | 'dasha35'>('varshphal');

  const report: FullLalKitabReport = useMemo(() => {
    const targetYr = birthYear + selectedAge;
    return computeFullLalKitabReport(chart, targetYr);
  }, [chart, birthYear, selectedAge]);

  return (
    <div className="oj-page-container">
      {/* Breadcrumb */}
      <nav className="oj-breadcrumbs" aria-label="Breadcrumb">
        <a href="#home" onClick={(e) => { e.preventDefault(); onNavigate?.('home'); }}>
          {isHi ? 'होम' : 'Home'}
        </a>
        <span className="oj-bc-sep">/</span>
        <span>{isHi ? 'विशिष्ट ज्योतिष' : 'Advanced Astrology'}</span>
        <span className="oj-bc-sep">/</span>
        <span className="oj-bc-current">{isHi ? 'लाल किताब सम्पूर्ण व्यवस्था' : 'Lal Kitab Operating System'}</span>
      </nav>

      {/* Header Banner */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          {isHi ? '1952 मूल लाल किताब फरमान, वर्षफल एवं ऋण मुक्ति' : 'Authentic 1952 Lal Kitab System & Varshphal'}
        </div>
        <h1 className="oj-page-title">
          {isHi ? 'लाल किताब कुण्डली, सोया ग्रह एवं 100-वर्षीय वर्षफल' : 'Lal Kitab System, Sleeping Planets & Annual Varshphal'}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? 'धर्मी/अंधा/नाबालिग तेवा परीक्षण, सोए हुए ग्रह जगाने के उपाय, 9 पूर्वजन्म ऋण एवं आयु अनुसार वार्षिक ग्रह भ्रमण।'
            : 'Teva classification, sleeping house activation catalysts, 9 ancestral debt remedies, 35-year dasha cycle and age-based annual house rotations.'}
        </p>

        {/* Tab Controls */}
        <div className="oj-page-actions-bar">
          <div className="oj-tab-pills-row">
            <button
              type="button"
              className={`oj-tab-pill ${activeTab === 'varshphal' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('varshphal')}
            >
              <Sliders size={13} />
              <span>{isHi ? 'वार्षिक वर्षफल (Varshphal)' : 'Annual Varshphal'}</span>
            </button>
            <button
              type="button"
              className={`oj-tab-pill ${activeTab === 'teva' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('teva')}
            >
              <BookOpen size={13} />
              <span>{isHi ? 'तेवा वर्गीकरण (Teva)' : 'Teva Diagnosis'}</span>
            </button>
            <button
              type="button"
              className={`oj-tab-pill ${activeTab === 'sleeping' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('sleeping')}
            >
              <Sparkles size={13} />
              <span>{isHi ? 'सोए हुए ग्रह (Sleeping)' : 'Sleeping Planets'}</span>
            </button>
            <button
              type="button"
              className={`oj-tab-pill ${activeTab === 'debts' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('debts')}
            >
              <ShieldAlert size={13} />
              <span>{isHi ? '9 पितृ व पूर्व ऋण' : '9 Ancestral Debts'}</span>
            </button>
            <button
              type="button"
              className={`oj-tab-pill ${activeTab === 'dasha35' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('dasha35')}
            >
              <Compass size={13} />
              <span>{isHi ? '35-वर्षीय दशा चक्र' : '35-Year Dasha'}</span>
            </button>
          </div>

          <button type="button" className="oj-action-btn secondary" onClick={() => window.print()}>
            <Printer size={13} />
            <span>{isHi ? 'प्रिंट करें' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Varshphal with Age Slider */}
      {activeTab === 'varshphal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Age Slider Card */}
          <div className="oj-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', color: '#b45309', fontFamily: 'Cinzel, Playfair Display, serif' }}>
                  {isHi ? `आयु: ${selectedAge} वर्ष — लाल किताब वर्षफल ${birthYear + selectedAge}` : `Age: ${selectedAge} Years — Lal Kitab Varshphal ${birthYear + selectedAge}`}
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {isHi ? 'स्लाइडर को आगे-पीछे करके किसी भी वर्ष का लाल किताब ग्रह भ्रमण देखें' : 'Slide to inspect Lal Kitab planetary house positions for any age'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="oj-action-btn secondary"
                  onClick={() => setSelectedAge((a) => Math.max(1, a - 1))}
                  style={{ padding: '4px 10px', fontSize: '11px' }}
                >
                  -1 {isHi ? 'वर्ष' : 'Yr'}
                </button>
                <button
                  type="button"
                  className="oj-action-btn primary"
                  onClick={() => setSelectedAge(initialAge)}
                  style={{ padding: '4px 12px', fontSize: '11px' }}
                >
                  {isHi ? 'वर्तमान आयु' : 'Current Age'} ({initialAge})
                </button>
                <button
                  type="button"
                  className="oj-action-btn secondary"
                  onClick={() => setSelectedAge((a) => Math.min(100, a + 1))}
                  style={{ padding: '4px 10px', fontSize: '11px' }}
                >
                  +1 {isHi ? 'वर्ष' : 'Yr'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <input
                type="range"
                min="1"
                max="100"
                value={selectedAge}
                onChange={(e) => setSelectedAge(Number(e.target.value))}
                style={{ flex: 1, accentColor: '#b45309', height: '6px' }}
              />
              <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#b45309', minWidth: '70px', textAlign: 'right' }}>
                {selectedAge} {isHi ? 'वर्ष' : 'Yrs'}
              </span>
            </div>
          </div>

          {/* Varshphal Planetary Table */}
          <div className="oj-card">
            <div className="oj-card-header">
              <h2>{isHi ? `आयु ${selectedAge} वर्ष की वार्षिक ग्रह स्थिति एवं विशिष्ट उपाय` : `Annual Planetary Positions & Remedies for Age ${selectedAge}`}</h2>
            </div>
            <table className="oj-table">
              <thead>
                <tr>
                  <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                  <th>{isHi ? 'जन्म भाव' : 'Natal H.'}</th>
                  <th>{isHi ? 'वार्षिक भाव (Varsha)' : 'Annual H.'}</th>
                  <th>{isHi ? 'पक्का घर' : 'Pakka Ghar'}</th>
                  <th>{isHi ? 'स्थिति' : 'Condition'}</th>
                  <th>{isHi ? 'उस वर्ष का अचूक लाल किताब उपाय' : 'Annual Lal Kitab Upaya'}</th>
                </tr>
              </thead>
              <tbody>
                {report.planets.map((p) => (
                  <tr key={p.planet}>
                    <td>
                      <strong>{HINDI_GRAHAS[p.planet] || p.planet}</strong>
                    </td>
                    <td>{p.natalHouse}वां भाव</td>
                    <td>
                      <span className="oj-badge-accent" style={{ fontWeight: 'bold' }}>
                        {p.varshaHouse}वां भाव
                      </span>
                    </td>
                    <td>{p.pakkaGhar}वां भाव</td>
                    <td>
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 600,
                          color: p.isSleeping ? '#dc2626' : 'var(--text)',
                        }}
                      >
                        {isHi ? p.statusHi : p.statusEn}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', color: '#b45309' }}>
                      {isHi ? p.remedyHi : p.remedyEn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Teva Classification */}
      {activeTab === 'teva' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="oj-card" style={{ padding: '24px' }}>
            <span className="oj-stat-label">{isHi ? 'लाल किताब कुण्डली वर्गीकरण' : 'Lal Kitab Horoscope Type'}</span>
            <h2 style={{ fontSize: '24px', color: '#b45309', margin: '6px 0 10px', fontFamily: 'Cinzel, Playfair Display, serif' }}>
              {isHi ? report.tevaTypeHi : report.tevaTypeEn}
            </h2>
            <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'var(--text)' }}>
              {isHi ? report.tevaReasonHi : report.tevaReasonEn}
            </p>
          </div>

          <div className="oj-three-col-grid">
            <div className="oj-card" style={{ padding: '16px' }}>
              <h4 style={{ margin: '0 0 8px', color: '#16a34a', fontSize: '15px' }}>{isHi ? 'धर्मी तेवा (Dharmi Teva)' : 'Dharmi Teva'}</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                {isHi
                  ? 'जब सूर्य, गुरु या चंद्र अनुकूल भावों में हों अथवा राहु-केतु शांत हों। ऐसे जातक पर ईश्वरीय कृपा सदैव बनी रहती है।'
                  : 'Occurs when Sun, Moon, or Jupiter dominate key houses. The native enjoys divine protection during sudden crises.'}
              </p>
            </div>

            <div className="oj-card" style={{ padding: '16px' }}>
              <h4 style={{ margin: '0 0 8px', color: '#ea580c', fontSize: '15px' }}>{isHi ? 'अंधा तेवा (Andha Teva)' : 'Andha Teva'}</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                {isHi
                  ? 'जब 10वें भाव में कोई पापी ग्रह हो और 8वें में शुभ ग्रह न हों। कार्यों में अंतिम समय पर बाधा आती है। 10 अंधों को भोजन कराना श्रेष्ठ है।'
                  : 'Occurs when 10th house is afflicted without 8th house support. Work gets delayed at the last moment; feeding visually impaired aids resolution.'}
              </p>
            </div>

            <div className="oj-card" style={{ padding: '16px' }}>
              <h4 style={{ margin: '0 0 8px', color: '#dc2626', fontSize: '15px' }}>{isHi ? 'नाबालिग तेवा (Nabalig Teva)' : 'Nabalig Teva'}</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                {isHi
                  ? 'जब लग्न या 1, 4, 7, 10 केंद्र भाव पूर्णतः पापी ग्रहों से घिरे हों। जातक को 12 वर्ष की आयु तक विशेष सुरक्षा उपाय करने होते हैं।'
                  : 'Applies when Lagna and Kendras lack benefic anchorage. Requires traditional protective tokens up to age 12.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Sleeping Planets */}
      {activeTab === 'sleeping' && (
        <div className="oj-card">
          <div className="oj-card-header">
            <h2>{isHi ? 'सोए हुए ग्रह एवं उन्हें जगाने के उत्प्रेरक (Sleeping Planets Activation)' : 'Sleeping Planets & Activation Catalysts'}</h2>
          </div>
          <p style={{ padding: '0 20px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
            {isHi
              ? 'लाल किताब के अनुसार सोया हुआ ग्रह शुभ फल देने में असमर्थ रहता है। उसे जगाने वाले विशिष्ट मित्र ग्रह की वस्तुएं स्थापित करने से भाग्य जागृत होता है।'
              : 'In Lal Kitab, a sleeping planet remains dormant until activated by its dedicated catalyst planet, object, or behavioral habit.'}
          </p>

          <table className="oj-table">
            <thead>
              <tr>
                <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                <th>{isHi ? 'जन्म भाव' : 'Natal House'}</th>
                <th>{isHi ? 'स्थिति' : 'Condition'}</th>
                <th>{isHi ? 'जगाने की शास्त्रीय विधि व उपाय' : 'Activation Remedy'}</th>
              </tr>
            </thead>
            <tbody>
              {report.planets.map((p) => (
                <tr key={p.planet}>
                  <td><strong>{HINDI_GRAHAS[p.planet] || p.planet}</strong></td>
                  <td>{p.natalHouse}वां भाव</td>
                  <td>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        background: p.isSleeping ? 'rgba(220, 38, 38, 0.12)' : 'rgba(22, 163, 74, 0.12)',
                        color: p.isSleeping ? '#dc2626' : '#16a34a',
                      }}
                    >
                      {p.isSleeping ? (isHi ? 'सोया हुआ (Dormant)' : 'Sleeping') : (isHi ? 'जागृत (Active)' : 'Awake')}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px' }}>
                    {isHi ? p.remedyHi : p.remedyEn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: 9 Ancestral Debts */}
      {activeTab === 'debts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="oj-card" style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 8px', color: '#b45309', fontSize: '16px' }}>
              {isHi ? 'लाल किताब 9 पूर्वजन्म ऋण एवं निवारण' : 'Lal Kitab 9 Ancestral Debts (Rin Mukti)'}
            </h3>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {isHi
                ? 'पूर्वजन्म या पूर्वजों द्वारा किए गए विशिष्ट अनजाने दोषों के कारण जीवन में बार-बार अकारण रुकावटें आती हैं। इन ऋणों का निवारण परिवार के सभी रक्त संबंधियों से अंश एकत्र कर किया जाता है।'
                : 'Ancestral debts stem from unresolved karmic burdens. Lal Kitab specifies collective blood-relative contributions for effective nullification.'}
            </p>
          </div>

          <div className="oj-two-col-grid">
            {[
              {
                nameHi: '1. मातृ ऋण (Mother’s Debt)',
                causeHi: 'केतु चौथे भाव में या चंद्र पीड़ित होने पर। मानसिक अशांति व धन क्षय।',
                upayaHi: 'परिवार के सभी सदस्यों से बराबर चांदी के सिक्के एकत्र कर बहते जल में प्रवाहित करें।',
              },
              {
                nameHi: '2. पितृ ऋण (Father’s Debt)',
                causeHi: 'बृहस्पति 2, 5, 9, 12वें भाव में पापी ग्रहों से घिरने पर। कुल में संतान कष्ट।',
                upayaHi: 'सभी संबंधियों से समान धन लेकर मंदिर में पीले फल व केसर अर्पित करें।',
              },
              {
                nameHi: '3. स्व-ऋण (Self Debt)',
                causeHi: 'सूर्य 5वें भाव में शुक्र-शनि-राहु-केतु से पीड़ित। प्रतिष्ठा पर आघात।',
                upayaHi: 'सभी सदस्यों से पैसे लेकर सूर्य यज्ञ व गरीबों को गुड़-गेहूं का दान करें।',
              },
              {
                nameHi: '4. स्त्री ऋण (Wife/Women’s Debt)',
                causeHi: 'शुक्र 2 या 7वें भाव में राहु/केतु के प्रभाव में। दांपत्य कलह व रोग।',
                upayaHi: 'परिवार के सभी लोगों से चंदा एकत्र कर 100 गायों को हरा चारा खिलाएं।',
              },
              {
                nameHi: '5. भ्रातृ ऋण (Brother/Relatives Debt)',
                causeHi: 'मंगल 1 या 8वें भाव में बुध या केतु के साथ। संपत्ति विवाद व रक्त विकार।',
                upayaHi: 'कपूर जलाकर सुरमे का दान करें अथवा लाल मसूर पक्षियों को दें।',
              },
              {
                nameHi: '6. जल ऋण (Water / Nature Debt)',
                causeHi: 'चंद्र 6, 8, 12वें भाव में राहु से पीड़ित। जल से भय, व्यापारिक हानि।',
                upayaHi: 'सभी से चांदी एकत्र कर कुएं या जलाशय में डालें।',
              },
            ].map((d, i) => (
              <div key={i} className="oj-card" style={{ padding: '16px' }}>
                <h4 style={{ margin: '0 0 6px', color: '#b45309', fontSize: '14.5px' }}>{d.nameHi}</h4>
                <p style={{ margin: '0 0 8px', fontSize: '12px', color: 'var(--text-muted)' }}>{d.causeHi}</p>
                <div style={{ padding: '8px 10px', background: 'rgba(217, 119, 6, 0.08)', borderRadius: '6px', fontSize: '11.5px', color: '#92400e', fontWeight: 600 }}>
                  उपाय: {d.upayaHi}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: 35-Year Dasha Cycle */}
      {activeTab === 'dasha35' && (
        <div className="oj-card">
          <div className="oj-card-header">
            <h2>{isHi ? 'लाल किताब 35-वर्षीय ग्रह दशा चक्र' : 'Lal Kitab 35-Year Planetary Dasha Cycles'}</h2>
          </div>
          <table className="oj-table">
            <thead>
              <tr>
                <th>{isHi ? 'दशा स्वामी' : 'Dasha Lord'}</th>
                <th>{isHi ? 'अवधि (वर्ष)' : 'Duration (Yrs)'}</th>
                <th>{isHi ? 'आयु विस्तार' : 'Age Span'}</th>
                <th>{isHi ? 'तिथि सीमा (DD-MM-YYYY)' : 'Date Range (DD-MM-YYYY)'}</th>
                <th>{isHi ? 'शास्त्रीय फलकथन' : 'Lal Kitab Impact'}</th>
              </tr>
            </thead>
            <tbody>
              {report.dasha35.map((d, idx) => (
                <tr key={idx}>
                  <td><strong>{HINDI_GRAHAS[d.planet] || d.planet}</strong></td>
                  <td>{d.years} {isHi ? 'वर्ष' : 'Years'}</td>
                  <td>{d.startAge} से {d.endAge} वर्ष</td>
                  <td><span className="muted" style={{ fontSize: '11.5px' }}>{formatDateDmy(d.startDate)} — {formatDateDmy(d.endDate)}</span></td>
                  <td style={{ fontSize: '12px' }}>{isHi ? d.effectHi : d.effectEn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LalKitabView;
