import React, { useMemo, useState } from 'react';
import { Layers, Shuffle, Star, Clock, Grid } from 'lucide-react';
import { computeJaimini } from '../../astro/jaimini';
import type {
  JaiminiKaraka,
  ArudhaPada,
  KarakamshaData,
  ArgalaEntry,
  JaiminiCharaDashaPeriod,
} from '../../astro/jaimini';
import { SIGNS } from '../../astro/constants';
import type { ChartData, BirthInput, CalcSettings } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet, trSign, type AppLanguage } from '../../i18n/translations';
import { formatDateDmy } from '../../astro/time';

// ─── Props ────────────────────────────────────────────────────────────────────

interface JaiminiViewProps {
  chart: ChartData;
  activeInput: BirthInput;
  settings: CalcSettings;
  onNavigate: (view: string, sub?: string) => void;
  onOpenBooklet?: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDeg(d: number): string {
  const deg = Math.floor(d);
  const minF = (d - deg) * 60;
  const min = Math.floor(minF);
  return `${deg}°${min.toString().padStart(2, '0')}'`;
}

function NetBadge({ net }: { net: 'positive' | 'negative' | 'neutral' }) {
  const cls =
    net === 'positive' ? 'jm-badge-pos' :
    net === 'negative' ? 'jm-badge-neg' :
    'jm-badge-neu';
  const label = net === 'positive' ? 'Positive' : net === 'negative' ? 'Obstructed' : 'Neutral';
  return <span className={`jm-badge ${cls}`}>{label}</span>;
}

// ─── Tab 1: Chara Karakas ─────────────────────────────────────────────────────

function KarakasTab({ karakas, isHi, lang }: { karakas: JaiminiKaraka[]; isHi: boolean; lang: AppLanguage }) {
  if (!karakas || karakas.length === 0) {
    return (
      <div className="jm-section">
        <p className="jm-section-desc">{isHi ? 'चर कारक गणना उपलब्ध नहीं है।' : 'Chara Karakas calculation unavailable.'}</p>
      </div>
    );
  }

  return (
    <div className="jm-section">
      <h2 className="jm-section-title">
        {isHi ? 'चर कारक — आत्मा का मानचित्र' : 'Chara Karakas — Soul Significators'}
      </h2>
      <p className="jm-section-desc">
        {isHi
          ? 'जैमिनी पद्धति में ग्रहों को उनकी राशि में डिग्री के अनुसार क्रमबद्ध किया जाता है। सर्वोच्च डिग्री वाला ग्रह आत्मकारक बनता है।'
          : 'In Jaimini, planets are ranked by their degree within their sign. The planet with the highest degree becomes Atmakaraka (AK), the soul\'s significator.'}
      </p>
      <div className="jm-table-wrap">
        <table className="jm-table">
          <thead>
            <tr>
              <th>{isHi ? 'कारक' : 'Karaka'}</th>
              <th>{isHi ? 'ग्रह' : 'Planet'}</th>
              <th>{isHi ? 'राशि' : 'Sign'}</th>
              <th>{isHi ? 'प्रभावी डिग्री' : 'Eff. Degree'}</th>
              <th>{isHi ? 'व्याख्या' : 'Interpretation'}</th>
            </tr>
          </thead>
          <tbody>
            {karakas.map((k) => {
              const roleKey = k.role ? k.role.toLowerCase() : 'ak';
              return (
                <tr key={k.role ?? k.planet} className={k.role === 'AK' ? 'jm-row-ak' : ''}>
                  <td>
                    <span className={`jm-karaka-badge jm-karaka-${roleKey}`}>
                      {k.role ?? '—'}
                    </span>
                  </td>
                  <td className="jm-planet-name">{trPlanet(k.planet, lang)}</td>
                  <td>{trSign(k.signIndex, lang)}</td>
                  <td>{fmtDeg(k.degreeInSign ?? 0)}</td>
                  <td className="jm-interp">
                    {isHi ? k.interpretationHi : k.interpretationEn}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="jm-info-box">
        {isHi
          ? 'राहु के लिए प्रभावी डिग्री = 30 − वास्तविक डिग्री। 7-कारक पद्धति में केतु शामिल नहीं।'
          : 'For Rahu, effective degree = 30 − actual degree. Ketu is excluded in the 7-karaka system.'}
      </div>
    </div>
  );
}

// ─── Tab 2: Arudha Padas ─────────────────────────────────────────────────────

function ArudhaTab({ padas, isHi, lang }: { padas: ArudhaPada[]; isHi: boolean; lang: AppLanguage }) {
  if (!padas || padas.length === 0) {
    return (
      <div className="jm-section">
        <p className="jm-section-desc">{isHi ? 'अरुढ़ पद गणना उपलब्ध नहीं है।' : 'Arudha Padas calculation unavailable.'}</p>
      </div>
    );
  }

  return (
    <div className="jm-section">
      <h2 className="jm-section-title">
        {isHi ? 'अरुढ़ पद — माया की दुनिया' : 'Arudha Padas — The World of Maya'}
      </h2>
      <p className="jm-section-desc">
        {isHi
          ? 'अरुढ़ पद यह दर्शाते हैं कि बाहरी संसार में आपके जीवन के विभिन्न क्षेत्र कैसे दिखाई देते हैं।'
          : 'Arudha Padas show how various areas of your life appear in the external world (the world of maya/perception).'}
      </p>
      <div className="jm-table-wrap">
        <table className="jm-table">
          <thead>
            <tr>
              <th>{isHi ? 'भाव' : 'House'}</th>
              <th>{isHi ? 'पद' : 'Pada'}</th>
              <th>{isHi ? 'विशेष' : 'Special'}</th>
              <th>{isHi ? 'राशि' : 'Sign'}</th>
              <th>{isHi ? 'लग्न से भाव' : 'House from Lagna'}</th>
              <th>{isHi ? 'महत्व' : 'Significance'}</th>
            </tr>
          </thead>
          <tbody>
            {padas.map((p) => (
              <tr key={p.house}
                className={p.house === 1 ? 'jm-row-ak' : p.house === 12 ? 'jm-row-ul' : ''}>
                <td>{p.house}</td>
                <td><strong>{p.label}</strong></td>
                <td>
                  {p.specialLabel
                    ? <span className="jm-special-label">{p.specialLabel}</span>
                    : '—'}
                </td>
                <td>{trSign(p.signIndex, lang)} <span className="jm-sign-skt">({SIGNS[p.signIndex]?.sanskrit ?? ''})</span></td>
                <td>{isHi ? `${p.houseFromLagna}वां भाव` : `House ${p.houseFromLagna}`}</td>
                <td className="jm-interp">
                  {isHi ? p.significanceHi : p.significanceEn}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab 3: Karakamsha ───────────────────────────────────────────────────────

function KarakamshaTab({ data, isHi, lang }: { data: KarakamshaData; isHi: boolean; lang: AppLanguage }) {
  if (!data) {
    return (
      <div className="jm-section">
        <p className="jm-section-desc">{isHi ? 'कारकांश गणना उपलब्ध नहीं है।' : 'Karakamsha calculation unavailable.'}</p>
      </div>
    );
  }

  return (
    <div className="jm-section">
      <h2 className="jm-section-title">
        {isHi ? 'कारकांश लग्न — आत्मा का नवांश' : 'Karakamsha Lagna — Soul in Navamsha'}
      </h2>

      <div className="jm-karakamsha-grid">
        {/* Main card */}
        <div className="jm-kk-card jm-kk-primary">
          <div className="jm-kk-label">{isHi ? 'आत्मकारक' : 'Atmakaraka'}</div>
          <div className="jm-kk-value jm-kk-planet">{trPlanet(data.akPlanet, lang)}</div>
        </div>
        <div className="jm-kk-card">
          <div className="jm-kk-label">{isHi ? 'कारकांश राशि' : 'Karakamsha Sign'}</div>
          <div className="jm-kk-value">{trSign(data.karakamshaSignIndex, lang)}</div>
          <div className="jm-kk-sub">{SIGNS[data.karakamshaSignIndex]?.sanskrit ?? ''}</div>
        </div>
        <div className={`jm-kk-card ${data.isSwamsha ? 'jm-kk-active' : ''}`}>
          <div className="jm-kk-label">{isHi ? 'स्वांश' : 'Swamsha'}</div>
          <div className="jm-kk-value">{data.isSwamsha ? (isHi ? 'हाँ' : 'Yes') : (isHi ? 'नहीं' : 'No')}</div>
          <div className="jm-kk-sub">
            {data.isSwamsha
              ? (isHi ? 'AK नवांश लग्न का स्वामी भी है' : 'AK also lords D9 Lagna')
              : (isHi ? 'AK नवांश लग्न का स्वामी नहीं' : 'AK is not D9 Lagna lord')}
          </div>
        </div>

        {/* Ishta Devata */}
        <div className={`jm-kk-card ${data.ishtaDevata ? 'jm-kk-ishta' : ''}`}>
          <div className="jm-kk-label">{isHi ? 'इष्ट देवता' : 'Ishta Devata'}</div>
          <div className="jm-kk-value">{data.ishtaDevata ? data.ishtaDevata.split(', ').map(p => trPlanet(p, lang)).join(', ') : (isHi ? 'कोई ग्रह नहीं' : 'No planet')}</div>
          <div className="jm-kk-sub">{isHi ? 'कारकांश से 12वें में' : '12th from Karakamsha in D9'}</div>
        </div>

        {/* Dhana Yoga */}
        <div className={`jm-kk-card ${data.dhanaYoga ? 'jm-kk-dhana' : ''}`}>
          <div className="jm-kk-label">{isHi ? 'धन योग' : 'Dhana Yoga'}</div>
          <div className="jm-kk-value">{data.dhanaYoga ? data.dhanaYoga.split(', ').map(p => trPlanet(p, lang)).join(', ') : (isHi ? 'कोई ग्रह नहीं' : 'No planet')}</div>
          <div className="jm-kk-sub">{isHi ? 'कारकांश से 2रे में' : '2nd from Karakamsha in D9'}</div>
        </div>

        {/* Vivaha Nakshatra */}
        <div className="jm-kk-card">
          <div className="jm-kk-label">{isHi ? 'विवाह नक्षत्र क्षेत्र' : 'Vivaha Nakshatra Zone'}</div>
          <div className="jm-kk-value jm-kk-small">{data.vivahaNakshatra}</div>
          <div className="jm-kk-sub">{isHi ? 'कारकांश से 7वें' : '7th from Karakamsha'}</div>
        </div>
      </div>

      <div className="jm-kk-summary">
        <h3>{isHi ? 'सार' : 'Summary'}</h3>
        <p>{isHi ? data.summaryHi : data.summaryEn}</p>
      </div>
    </div>
  );
}

// ─── Tab 4: Chara Dasha ──────────────────────────────────────────────────────

function DashaRow({ md, nowMs, isHi, lang }: {
  md: JaiminiCharaDashaPeriod;
  nowMs: number;
  isHi: boolean;
  lang: AppLanguage;
}) {
  const [expanded, setExpanded] = useState(md?.isCurrentPeriod ?? false);
  if (!md) return null;
  const isCurrent = md.isCurrentPeriod;

  return (
    <div className={`jm-dasha-row ${isCurrent ? 'jm-dasha-current' : ''}`}>
      <button
        className="jm-dasha-header"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
      >
        <span className="jm-dasha-sign">{trSign(md.signIndex, lang)}</span>
        <span className="jm-dasha-sign-skt">{SIGNS[md.signIndex]?.sanskrit ?? ''}</span>
        <span className="jm-dasha-years">{md.years ?? 0} {isHi ? 'वर्ष' : 'yr'}</span>
        <span className="jm-dasha-dates">{formatDateDmy(md.startDate)} → {formatDateDmy(md.endDate)}</span>
        {isCurrent && (
          <span className="jm-dasha-active-badge">{isHi ? 'वर्तमान' : 'Current'}</span>
        )}
        <span className="jm-dasha-toggle">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && md.children && (
        <div className="jm-antardasha-list">
          {md.children.map((ad) => (
            <div
              key={`${ad.signIndex}-${ad.startMs}`}
              className={`jm-ad-row ${ad.isCurrentPeriod ? 'jm-ad-current' : ''}`}
            >
              <span className="jm-ad-sign">{trSign(ad.signIndex, lang)}</span>
              <span className="jm-ad-years">{(ad.years ?? 0).toFixed(1)} {isHi ? 'वर्ष' : 'yr'}</span>
              <span className="jm-ad-dates">{formatDateDmy(ad.startDate)} → {formatDateDmy(ad.endDate)}</span>
              {ad.isCurrentPeriod && (
                <span className="jm-ad-active">{isHi ? 'सक्रिय' : 'Active AD'}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DashaTab({ dasha, nowMs, isHi, lang }: {
  dasha: JaiminiCharaDashaPeriod[];
  nowMs: number;
  isHi: boolean;
  lang: AppLanguage;
}) {
  if (!dasha || dasha.length === 0) {
    return (
      <div className="jm-section">
        <p className="jm-section-desc">{isHi ? 'चर दशा गणना उपलब्ध नहीं है।' : 'Chara Dasha calculation unavailable.'}</p>
      </div>
    );
  }

  return (
    <div className="jm-section">
      <h2 className="jm-section-title">
        {isHi ? 'जैमिनी चर दशा — K.N. राव पद्धति' : 'Jaimini Chara Dasha — K.N. Rao Method'}
      </h2>
      <p className="jm-section-desc">
        {isHi
          ? 'चर दशा में प्रत्येक राशि की अवधि = उस राशि में स्थित ग्रहों की संख्या + 1 वर्ष। लग्न से क्रम निर्धारित होता है।'
          : 'Each sign\'s Chara Dasha duration = number of planets in that sign + 1 year. The sequence direction is based on the Lagna sign modality.'}
      </p>
      <div className="jm-dasha-list">
        {dasha.map((md) => (
          <DashaRow key={`${md.signIndex}-${md.startMs}`} md={md} nowMs={nowMs} isHi={isHi} lang={lang} />
        ))}
      </div>
    </div>
  );
}

// ─── Tab 5: Argala ───────────────────────────────────────────────────────────

function ArgalaTab({ argala, isHi, lang }: { argala: ArgalaEntry[]; isHi: boolean; lang: AppLanguage }) {
  if (!argala || argala.length === 0) {
    return (
      <div className="jm-section">
        <p className="jm-section-desc">{isHi ? 'अर्गला विश्लेषण उपलब्ध नहीं है।' : 'Argala analysis unavailable.'}</p>
      </div>
    );
  }

  return (
    <div className="jm-section">
      <h2 className="jm-section-title">
        {isHi ? 'अर्गला विश्लेषण — हस्तक्षेप व बाधा' : 'Argala Analysis — Intervention & Obstruction'}
      </h2>
      <p className="jm-section-desc">
        {isHi
          ? 'भाव 2, 4, 11 से आने वाले ग्रह सकारात्मक अर्गला देते हैं। भाव 12, 10, 3 से वाले विरोधार्गल (बाधा) देते हैं।'
          : 'Planets in houses 2, 4, 11 from a reference create positive Argala. Those in 12, 10, 3 create Virodhargala (obstruction).'}
      </p>
      <div className="jm-argala-grid">
        {argala.map((a) => (
          <div key={a.house} className={`jm-argala-card jm-argala-${a.netArgala}`}>
            <div className="jm-argala-house">
              {isHi ? `भाव ${a.house}` : `House ${a.house}`}
            </div>
            <NetBadge net={a.netArgala} />
            <div className="jm-argala-row">
              <span className="jm-argala-label jm-argala-pos-label">
                {isHi ? 'अर्गला:' : 'Argala:'}
              </span>
              <span className="jm-argala-planets">
                {a.argalaPlanets && a.argalaPlanets.length > 0 ? a.argalaPlanets.map(p => trPlanet(p, lang)).join(', ') : '—'}
              </span>
            </div>
            <div className="jm-argala-row">
              <span className="jm-argala-label jm-argala-neg-label">
                {isHi ? 'विरोध:' : 'Virodha:'}
              </span>
              <span className="jm-argala-planets">
                {a.virodhaPlanets && a.virodhaPlanets.length > 0 ? a.virodhaPlanets.map(p => trPlanet(p, lang)).join(', ') : '—'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const TABS = [
  { id: 'karakas',    iconEl: <Star size={15} />,    labelEn: 'Chara Karakas',  labelHi: 'चर कारक' },
  { id: 'arudha',     iconEl: <Shuffle size={15} />, labelEn: 'Arudha Padas',   labelHi: 'अरुढ़ पद' },
  { id: 'karakamsha', iconEl: <Layers size={15} />,  labelEn: 'Karakamsha',     labelHi: 'कारकांश' },
  { id: 'dasha',      iconEl: <Clock size={15} />,   labelEn: 'Chara Dasha',    labelHi: 'चर दशा' },
  { id: 'argala',     iconEl: <Grid size={15} />,    labelEn: 'Argala',         labelHi: 'अर्गला' },
] as const;

type TabId = typeof TABS[number]['id'];

export const JaiminiView: React.FC<JaiminiViewProps> = ({
  chart,
  activeInput,
  settings,
  onNavigate,
  onOpenBooklet,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [activeTab, setActiveTab] = useState<TabId>('karakas');

  const report = useMemo(() => computeJaimini(chart), [chart]);

  return (
    <div className="oj-page-container">
      {/* Breadcrumb */}
      <nav className="oj-breadcrumbs" aria-label="Breadcrumb">
        <a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
          {isHi ? 'होम' : 'Home'}
        </a>
        <span className="oj-bc-sep">/</span>
        <span>{isHi ? 'निःशुल्क ज्योतिष' : 'Free Astrology'}</span>
        <span className="oj-bc-sep">/</span>
        <span className="oj-bc-current">
          {isHi ? 'जैमिनी सूत्र कुंडली' : 'Jaimini Sutra Kundali'}
        </span>
      </nav>

      {/* Page Header */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          {isHi
            ? 'जैमिनी सूत्र पद्धति · 100% निःशुल्क'
            : 'Jaimini Sutra System · 100% Free'}
        </div>
        <h1 className="oj-page-title">
          {isHi
            ? `${activeInput.name} की जैमिनी कुंडली विश्लेषण`
            : `Jaimini Sutra Analysis for ${activeInput.name}`}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? 'चर कारक, अरुढ़ पद, कारकांश, रशि दृष्टि, अर्गला और चर दशा — सम्पूर्ण जैमिनी ज्योतिष।'
            : 'Chara Karakas, Arudha Padas, Karakamsha, Rashi Drishti, Argala & Chara Dasha — complete Jaimini Jyotish.'}
        </p>
        <div className="oj-page-actions-bar">
          {onOpenBooklet && (
            <button type="button" className="oj-action-btn primary" onClick={onOpenBooklet}>
              <Star size={14} />
              <span>{isHi ? 'पत्रिका डाउनलोड' : 'Download Patrika'}</span>
            </button>
          )}
          <button type="button" className="oj-action-btn secondary" onClick={() => window.print()}>
            <span>{isHi ? 'प्रिंट करें' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* Native Details Strip */}
      <div className="oj-card jm-native-strip">
        <div className="jm-native-grid">
          <div>
            <span className="oj-meta-label">{isHi ? 'जातक' : 'Native'}:</span>
            <span className="oj-meta-value"> {activeInput.name}</span>
          </div>
          <div>
            <span className="oj-meta-label">{isHi ? 'लग्न' : 'Lagna'}:</span>
            <span className="oj-meta-value"> {trSign(chart.ascendant.signIndex, lang)} ({SIGNS[chart.ascendant.signIndex]?.sanskrit ?? ''})</span>
          </div>
          <div>
            <span className="oj-meta-label">{isHi ? 'कारक पद्धति' : 'Karaka System'}:</span>
            <span className="oj-meta-value"> {settings?.karakaCount ?? 7}-{isHi ? 'कारक' : 'Karaka'}</span>
          </div>
          <div>
            <span className="oj-meta-label">{isHi ? 'आत्मकारक' : 'Atmakaraka'}:</span>
            <span className="oj-meta-value jm-ak-highlight">
              {report?.karakas?.[0]?.planet ? trPlanet(report.karakas[0].planet, lang) : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="jm-tabs-nav" role="tablist" aria-label={isHi ? 'जैमिनी विश्लेषण टैब' : 'Jaimini Analysis Tabs'}>
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={activeTab === t.id}
            className={`jm-tab-btn ${activeTab === t.id ? 'jm-tab-active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.iconEl}
            <span>{isHi ? t.labelHi : t.labelEn}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="jm-tab-content oj-card" role="tabpanel">
        {activeTab === 'karakas' && (
          <KarakasTab karakas={report.karakas} isHi={isHi} lang={lang} />
        )}
        {activeTab === 'arudha' && (
          <ArudhaTab padas={report.arudhaPadas} isHi={isHi} lang={lang} />
        )}
        {activeTab === 'karakamsha' && (
          <KarakamshaTab data={report.karakamsha} isHi={isHi} lang={lang} />
        )}
        {activeTab === 'dasha' && (
          <DashaTab dasha={report.charaDasha} nowMs={report.nowMs} isHi={isHi} lang={lang} />
        )}
        {activeTab === 'argala' && (
          <ArgalaTab argala={report.argala} isHi={isHi} lang={lang} />
        )}
      </div>

      {/* Rashi Drishti Reference Card */}
      <div className="oj-card jm-rashi-drishti-ref">
        <h3 className="jm-rd-title">
          {isHi ? 'रशि दृष्टि संदर्भ तालिका' : 'Jaimini Rashi Drishti Reference'}
        </h3>
        <div className="jm-rd-rules">
          <div className="jm-rd-rule">
            <span className="jm-rd-badge jm-rd-movable">{isHi ? 'चर' : 'Movable'}</span>
            <span>
              {isHi
                ? 'मेष, कर्क, तुला, मकर → सभी स्थिर राशियों को, सिवाय पड़ोसी के'
                : 'Ar, Cn, Li, Cp → All Fixed signs except the adjacent one'}
            </span>
          </div>
          <div className="jm-rd-rule">
            <span className="jm-rd-badge jm-rd-fixed">{isHi ? 'स्थिर' : 'Fixed'}</span>
            <span>
              {isHi
                ? 'वृषभ, सिंह, वृश्चिक, कुम्भ → सभी चर राशियों को, सिवाय पड़ोसी के'
                : 'Ta, Le, Sc, Aq → All Movable signs except the adjacent one'}
            </span>
          </div>
          <div className="jm-rd-rule">
            <span className="jm-rd-badge jm-rd-dual">{isHi ? 'द्विस्वभाव' : 'Dual'}</span>
            <span>
              {isHi
                ? 'मिथुन, कन्या, धनु, मीन → सभी द्विस्वभाव राशियों को'
                : 'Ge, Vi, Sg, Pi → All other Dual signs (mutual aspect)'}
            </span>
          </div>
        </div>

        {/* Rashi Aspect Matrix */}
        <div className="jm-aspect-matrix-wrap">
          <div className="jm-aspect-matrix">
            <div className="jm-am-header-row">
              <div className="jm-am-corner">{isHi ? 'से ↓ / को →' : 'From ↓ / To →'}</div>
              {SIGNS.map((s) => (
                <div key={s.index} className="jm-am-col-head">{s.short}</div>
              ))}
            </div>
            {report.rashiAspects?.map((row, fromIdx) => (
              <div key={fromIdx} className="jm-am-row">
                <div className="jm-am-row-head">{SIGNS[fromIdx]?.short ?? ''}</div>
                {row?.map((aspects, toIdx) => (
                  <div
                    key={toIdx}
                    className={`jm-am-cell ${fromIdx === toIdx ? 'jm-am-self' : aspects ? 'jm-am-yes' : 'jm-am-no'}`}
                    title={aspects ? `${SIGNS[fromIdx]?.name ?? ''} aspects ${SIGNS[toIdx]?.name ?? ''}` : ''}
                  >
                    {fromIdx === toIdx ? '—' : aspects ? 'Yes' : ''}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JaiminiView;
