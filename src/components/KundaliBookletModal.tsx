import React, { useEffect, useMemo, useState } from 'react';
import { Award, Printer, X } from 'lucide-react';
import {
  computeAvakahadaChakra,
  computeBhavaChalitPlacements,
  computeGhatakChakra,
} from '../astro/avakahadaChalit';
import { SIGNS } from '../astro/constants';
import { computeFullLalKitabReport } from '../astro/lalKitabExtended';
import { generatePredictionReport } from '../astro/predictions/engine';
import { buildSpecializedAstrologySuite } from '../astro/predictions/specialized';
import { computeGemstoneAndRudraksha } from '../astro/rashifalBabyRudraksha';
import { formatDateDmy, formatLocalDateTimeFromUtc } from '../astro/time';
import type { ChartData, ChartStyle } from '../astro/types';
import {
  localizePredictionReportHi,
  localizeSpecializedSuiteHi,
  trBadge,
} from '../i18n/hindiPredictions';
import {
  trPlanet,
  trPlanetShort,
  trSign,
  trTerm,
  UI_TEXT,
  type AppLanguage,
} from '../i18n/translations';
import { ParamayusLockBanner } from './ParamayusLockBanner';
import { VedicChartSvg } from './VedicChartSvg';
import { PatrikaBookFullPrintEdition } from './predictions/PatrikaBookContent';

interface KundaliBookletModalProps {
  open: boolean;
  onClose: () => void;
  chart: ChartData;
  chartStyle: ChartStyle;
  language: AppLanguage;
}

interface BrandingConfig {
  enabled: boolean;
  kendraName: string;
  astrologerName: string;
  contactInfo: string;
  footerNote: string;
}

const BRANDING_STORAGE_KEY = 'jyotish_hora_pdf_branding_v1';

const DEFAULT_BRANDING: BrandingConfig = {
  enabled: true,
  kendraName: 'Jyotish Hora Vedic Studio',
  astrologerName: '',
  contactInfo: '',
  footerNote: 'Prepared with Traditional Parashari, KP, Nadi & Lal Kitab Siddhanta',
};

function loadBranding(): BrandingConfig {
  try {
    const raw = localStorage.getItem(BRANDING_STORAGE_KEY);
    if (raw) return { ...DEFAULT_BRANDING, ...JSON.parse(raw) };
  } catch {
    // ignore storage errors
  }
  return DEFAULT_BRANDING;
}

export const KundaliBookletModal: React.FC<KundaliBookletModalProps> = ({
  open,
  onClose,
  chart,
  chartStyle,
  language,
}) => {
  const [branding, setBranding] = useState<BrandingConfig>(loadBranding);
  const [showBrandingEditor, setShowBrandingEditor] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(branding));
    } catch {
      // ignore storage errors
    }
  }, [branding]);
  const bundle = useMemo(() => {
    if (!open) return null;
    const rawReport = generatePredictionReport(chart);
    const report =
      language === 'hi' ? localizePredictionReportHi(rawReport, chart) : rawReport;
    const rawSpec = buildSpecializedAstrologySuite(chart);
    const spec =
      language === 'hi' ? localizeSpecializedSuiteHi(rawSpec, chart) : rawSpec;
    const moon = chart.planets.find((p) => p.id === 'Moon')!;
    const avakahada = computeAvakahadaChakra(chart);
    const ghatak = computeGhatakChakra(moon.signIndex);
    const chalit = computeBhavaChalitPlacements(chart);
    const lkFull = computeFullLalKitabReport(chart, new Date().getFullYear());
    const gemReport = computeGemstoneAndRudraksha(chart);
    return {
      report,
      spec,
      avakahada,
      ghatak,
      chalit,
      lkFull,
      gemReport,
      moon,
    };
  }, [open, chart, language]);

  if (!open || !bundle) return null;

  const { report, spec, avakahada, ghatak, chalit, lkFull, gemReport, moon } = bundle;
  const t = UI_TEXT[language];
  const isHi = language === 'hi';

  const handlePrint = () => {
    window.print();
  };

  const toBadges = (varga: 'D1' | 'D9' | 'D10') =>
    chart.divisionalCharts[varga].placements.map((p) => ({
      id: p.id,
      label: trPlanetShort(p.id, language),
      signIndex: p.signIndex,
      isLagna: p.id === 'Asc',
      isRetrograde: p.isRetrograde,
      dignity: p.dignity,
    }));

  const chalitBadges = chalit.placements.map((cp) => ({
    id: cp.id,
    label: trPlanetShort(cp.id, language),
    signIndex: cp.chalitDisplaySignIndex,
    isLagna: cp.id === 'Asc',
    isRetrograde: cp.isRetrograde,
  }));

  return (
    <div className="modal-backdrop print-booklet-backdrop" onClick={onClose}>
      <div
        className="modal-card modal-lg booklet-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header no-print">
          <h3>
            {isHi
              ? 'बृहत् जन्म पत्रिका — बहु-पृष्ठीय PDF कुंडली पुस्तिका'
              : 'Brihat Janam Patrika — Multi-Page Printable PDF Booklet'}
          </h3>
          <div className="toolbar-group">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowBrandingEditor((v) => !v)}
            >
              <Award size={14} />
              {isHi ? 'केंद्र / ज्योतिषी नाम' : 'White-Label Branding'}
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={handlePrint}>
              <Printer size={14} />
              {t.common.printPdf}
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={onClose}
              aria-label={t.common.close}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {showBrandingEditor && (
          <div className="branding-editor-strip no-print">
            <label className="checkbox-inline">
              <input
                type="checkbox"
                checked={branding.enabled}
                onChange={(e) => setBranding({ ...branding, enabled: e.target.checked })}
              />
              <span>{isHi ? 'पत्रिका पर अपना केंद्र नाम व संपर्क दिखाएँ' : 'Show Custom Header & Footer on PDF'}</span>
            </label>
            <div className="branding-inputs-grid">
              <input
                type="text"
                className="text-input input-sm"
                value={branding.kendraName}
                onChange={(e) => setBranding({ ...branding, kendraName: e.target.value })}
                placeholder={isHi ? 'संस्था / ज्योतिष केंद्र का नाम' : 'Astrology Center / Studio Name'}
              />
              <input
                type="text"
                className="text-input input-sm"
                value={branding.astrologerName}
                onChange={(e) => setBranding({ ...branding, astrologerName: e.target.value })}
                placeholder={isHi ? 'ज्योतिषी / आचार्य का नाम' : 'Astrologer Name'}
              />
              <input
                type="text"
                className="text-input input-sm"
                value={branding.contactInfo}
                onChange={(e) => setBranding({ ...branding, contactInfo: e.target.value })}
                placeholder={isHi ? 'फ़ोन / वेबसाइट / पता' : 'Phone / Website / Address'}
              />
              <input
                type="text"
                className="text-input input-sm"
                value={branding.footerNote}
                onChange={(e) => setBranding({ ...branding, footerNote: e.target.value })}
                placeholder={isHi ? 'फ़ुटर टिप्पणी' : 'Custom Footer Note'}
              />
            </div>
          </div>
        )}

        <div className="booklet-body">
          {/* PAGE 1: Cover, Birth Particulars, Panchang, Avakahada & Ghatak */}
          <div className="booklet-cover">
            {branding.enabled && (branding.kendraName || branding.astrologerName) && (
              <div className="booklet-letterhead">
                <strong>{branding.kendraName}</strong>
                {branding.astrologerName && <span> · {branding.astrologerName}</span>}
                {branding.contactInfo && <div className="muted small-text">{branding.contactInfo}</div>}
              </div>
            )}
            <div className="booklet-om">ॐ श्री गणेशाय नमः</div>
            <h2>
              {isHi ? 'बृहत् जन्म पत्रिका' : 'Brihat Janam Patrika'} · {chart.input.name}
            </h2>
            <p className="mono">
              {formatDateDmy(chart.input.date)} · {chart.input.time} · {chart.input.city} (
              {chart.input.latitude.toFixed(2)}°N, {chart.input.longitude.toFixed(2)}°E)
            </p>
            <p>
              {t.common.lagna}: <strong>{trSign(chart.ascendant.signIndex, language)}</strong> ·{' '}
              {isHi ? 'जन्म राशि' : 'Moon Sign'}:{' '}
              <strong>{trSign(moon.signIndex, language)}</strong> (
              {trTerm(chart.panchang.nakshatra.name, language)}{' '}
              {isHi ? 'च' : 'P'}
              {chart.panchang.nakshatra.pada}) · {t.common.ayanamsa}:{' '}
              <span className="mono">{chart.ayanamsaDms}</span>
            </p>
          </div>

          <section className="panel">
            <div className="panel-header">
              <h3>{isHi ? 'पंचांग एवं सूर्योदय विवरण' : 'Birth Panchang & Muhurta Details'}</h3>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <tbody>
                  <tr>
                    <td>{isHi ? 'वार (दिन)' : 'Weekday (Vara)'}</td>
                    <td><strong>{trTerm(chart.panchang.vara.name, language)}</strong></td>
                    <td>{isHi ? 'तिथि एवं पक्ष' : 'Tithi & Paksha'}</td>
                    <td>
                      <strong>
                        {trTerm(chart.panchang.tithi.name, language)} (
                        {trTerm(chart.panchang.tithi.paksha, language)})
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td>{isHi ? 'योग' : 'Nitya Yoga'}</td>
                    <td><strong>{trTerm(chart.panchang.yoga.name, language)}</strong></td>
                    <td>{isHi ? 'करण' : 'Karana'}</td>
                    <td><strong>{trTerm(chart.panchang.karana.name, language)}</strong></td>
                  </tr>
                  <tr>
                    <td>{isHi ? 'सूर्योदय / सूर्यास्त' : 'Sunrise / Sunset'}</td>
                    <td className="mono">
                      {chart.panchang.sunriseLocal} / {chart.panchang.sunsetLocal}
                    </td>
                    <td>{isHi ? 'राहुकाल / अभिजीत' : 'Rahu Kalam / Abhijit'}</td>
                    <td className="mono">
                      {chart.panchang.rahuKalam} · {chart.panchang.abhijitMuhurta}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <div className="pred-top-grid">
            <section className="panel">
              <div className="panel-header">
                <h3>{isHi ? 'अवकहड़ा चक्र' : 'Avakahada Chakra'}</h3>
              </div>
              <div className="table-scroll">
                <table className="data-table">
                  <tbody>
                    <tr>
                      <td>{isHi ? 'पाया (चंद्र आधार)' : 'Paya (Moon Foot)'}</td>
                      <td><strong>{isHi ? avakahada.payaHi : avakahada.payaEn}</strong></td>
                    </tr>
                    <tr>
                      <td>{isHi ? 'वर्ण / वश्य / योनि' : 'Varna / Vashya / Yoni'}</td>
                      <td>
                        <strong>
                          {trTerm(avakahada.varna, language)} / {trTerm(avakahada.vashya, language)} /{' '}
                          {trTerm(avakahada.yoni, language)}
                        </strong>
                      </td>
                    </tr>
                    <tr>
                      <td>{isHi ? 'गण / नाड़ी / तत्व' : 'Gana / Nadi / Tatva'}</td>
                      <td>
                        <strong>
                          {trTerm(avakahada.gana, language)} / {trTerm(avakahada.nadi, language)} /{' '}
                          {isHi ? avakahada.tatvaHi : avakahada.tatvaEn}
                        </strong>
                      </td>
                    </tr>
                    <tr>
                      <td>{isHi ? 'नामाक्षर (वर्ण अक्षर)' : 'Name Syllable'}</td>
                      <td>
                        <strong className="tag tag-karaka">
                          {avakahada.nameSyllableHi} ({avakahada.nameSyllableEn})
                        </strong>
                      </td>
                    </tr>
                    <tr>
                      <td>{isHi ? 'जन्म दशा शेष' : 'Birth Dasha Balance'}</td>
                      <td>
                        <strong>
                          {trPlanet(avakahada.birthDashaLord, language)} ·{' '}
                          {isHi ? avakahada.remDashaHi : avakahada.remDashaEn}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <h3>{isHi ? 'घातक चक्र (सावधानी समय)' : 'Ghatak Chakra (Inauspicious Triggers)'}</h3>
              </div>
              <div className="table-scroll">
                <table className="data-table">
                  <tbody>
                    <tr>
                      <td>{isHi ? 'घातक राशि व लग्न' : 'Ghatak Rashi & Lagna'}</td>
                      <td>
                        <strong>
                          {trSign(ghatak.rashiIndex, language)} / {trSign(ghatak.lagnaIndex, language)}
                        </strong>
                      </td>
                    </tr>
                    <tr>
                      <td>{isHi ? 'घातक वार व मास' : 'Ghatak Vara & Month'}</td>
                      <td>
                        <strong>
                          {trTerm(ghatak.varaEn, language)} / {trTerm(ghatak.monthEn, language)}
                        </strong>
                      </td>
                    </tr>
                    <tr>
                      <td>{isHi ? 'घातक तिथि व प्रहर' : 'Ghatak Tithi & Prahar'}</td>
                      <td>
                        <strong>
                          {trTerm(ghatak.tithiEn, language)} · {trTerm(ghatak.praharEn, language)}
                        </strong>
                      </td>
                    </tr>
                    <tr>
                      <td>{isHi ? 'घातक नक्षत्र / योग / करण' : 'Nakshatra / Yoga / Karana'}</td>
                      <td>
                        <strong>
                          {trTerm(ghatak.nakshatraEn, language)} / {trTerm(ghatak.yogaEn, language)} /{' '}
                          {trTerm(ghatak.karanaEn, language)}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* PAGE 2: 4 Core Charts (D1, Bhava Chalit, D9, D10) + Planet Table */}
          <div className="print-page-break" />

          <div className="dual-chart-grid">
            <VedicChartSvg
              title={`${isHi ? 'लग्न कुंडली (D1 राशि)' : 'Lagna / Rasi (D1)'} — ${trSign(chart.ascendant.signIndex, language)}`}
              style={chartStyle}
              lagnaSignIndex={chart.ascendant.signIndex}
              items={toBadges('D1')}
              showDownload={false}
              centerLabel={isHi ? 'D1 लग्न' : 'D1 RASI'}
            />
            <VedicChartSvg
              title={`${isHi ? 'भाव चलित (श्रीपति)' : 'Bhava Chalit (Sripati)'} — ${trSign(chart.ascendant.signIndex, language)}`}
              style={chartStyle}
              lagnaSignIndex={chart.ascendant.signIndex}
              items={chalitBadges}
              showDownload={false}
              centerLabel={isHi ? 'भाव चलित' : 'CHALIT'}
            />
            <VedicChartSvg
              title={`${isHi ? 'नवांश कुंडली (D9)' : 'Navamsa (D9)'} — ${trSign(chart.divisionalCharts.D9.lagnaSignIndex, language)}`}
              style={chartStyle}
              lagnaSignIndex={chart.divisionalCharts.D9.lagnaSignIndex}
              items={toBadges('D9')}
              showDownload={false}
              centerLabel={isHi ? 'D9 नवांश' : 'D9 NAVAMSA'}
            />
            <VedicChartSvg
              title={`${isHi ? 'दशमांश कुंडली (D10 करियर)' : 'Dasamsa (D10 Career)'} — ${trSign(chart.divisionalCharts.D10.lagnaSignIndex, language)}`}
              style={chartStyle}
              lagnaSignIndex={chart.divisionalCharts.D10.lagnaSignIndex}
              items={toBadges('D10')}
              showDownload={false}
              centerLabel={isHi ? 'D10 कर्म' : 'D10 KARMA'}
            />
          </div>

          <section className="panel">
            <div className="panel-header">
              <h3>{isHi ? 'ग्रह स्पष्ट एवं नक्षत्र स्थिति तालिका' : 'Planetary Positions & Nakshatra Details'}</h3>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t.common.body}</th>
                    <th>{t.common.sign}</th>
                    <th>{t.common.degree}</th>
                    <th>{t.common.nakshatra}</th>
                    <th>{isHi ? 'नक्षत्रेश' : 'StarL'}</th>
                    <th>{t.common.house}</th>
                    <th>{t.common.dignity}</th>
                  </tr>
                </thead>
                <tbody>
                  {[chart.ascendant, ...chart.planets].map((b) => (
                    <tr key={b.id}>
                      <td>
                        <strong>{trPlanet(b.id, language)}</strong>
                        {b.isRetrograde && b.id !== 'Rahu' && b.id !== 'Ketu'
                          ? isHi ? ' (व)' : ' (R)'
                          : ''}
                        {b.isCombust ? (isHi ? ' [अस्त]' : ' [C]') : ''}
                      </td>
                      <td>{trSign(b.signIndex, language)}</td>
                      <td className="mono">{b.dms}</td>
                      <td>
                        {trTerm(b.nakshatraName, language)} {isHi ? 'च' : 'P'}
                        {b.pada}
                      </td>
                      <td>{trPlanetShort(b.nakshatraLord, language)}</td>
                      <td className="mono">{t.common.house}{b.rasiHouseNumber}</td>
                      <td>{trTerm(b.dignity, language)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* PAGE 3: Shadbala, Sarvashtakavarga (SAV), & Full Vimshottari Mahadasha */}
          <div className="print-page-break" />

          <div className="pred-top-grid">
            <section className="panel">
              <div className="panel-header">
                <h3>{isHi ? 'षड्बल ग्रह शक्ति (Shadbala)' : 'Shadbala Planetary Strength'}</h3>
              </div>
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t.common.planet}</th>
                      <th>{isHi ? 'विरूप' : 'Virupas'}</th>
                      <th>{isHi ? 'रूप' : 'Rupas'}</th>
                      <th>{isHi ? 'न्यूनतम' : 'Req'}</th>
                      <th>{isHi ? 'अनुपात' : 'Ratio'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chart.shadbala.map((s) => (
                      <tr key={s.planet}>
                        <td><strong>{trPlanet(s.planet, language)}</strong></td>
                        <td className="mono">{s.totalVirupas.toFixed(1)}</td>
                        <td className="mono">{s.totalRupas.toFixed(2)}</td>
                        <td className="mono">{s.requiredRupas.toFixed(1)}</td>
                        <td>
                          <span className={`tag ${s.isStrong ? 'tag-varg' : 'tag-combust'}`}>
                            {s.ratio.toFixed(2)}x
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <h3>{isHi ? 'विंशोत्तरी महादशा चक्र (120 वर्ष)' : 'Vimshottari Mahadasha Timeline (120Y)'}</h3>
              </div>
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{isHi ? 'स्वामी' : 'Lord'}</th>
                      <th>{isHi ? 'प्रारंभ' : 'Start'}</th>
                      <th>{isHi ? 'समाप्ति' : 'End'}</th>
                      <th>{isHi ? 'वर्ष' : 'Yrs'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chart.vimshottari.map((d, idx) => {
                      const isCurr = Date.now() >= d.startMs && Date.now() < d.endMs;
                      return (
                        <tr key={`${d.lord}-${idx}`} className={isCurr ? 'active-row' : ''}>
                          <td>
                            <strong>{trPlanet(d.lord, language)}</strong>
                            {isCurr && (
                              <span className="tag tag-karaka" style={{ marginLeft: 6 }}>
                                {isHi ? 'वर्तमान' : 'Current'}
                              </span>
                            )}
                          </td>
                          <td className="mono">
                            {formatDateDmy(formatLocalDateTimeFromUtc(d.startMs, chart.offsetMinutesUsed).slice(0, 10))}
                          </td>
                          <td className="mono">
                            {formatDateDmy(formatLocalDateTimeFromUtc(d.endMs, chart.offsetMinutesUsed).slice(0, 10))}
                          </td>
                          <td className="mono">{(d.durationDays / 365.2425).toFixed(1)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <section className="panel">
            <div className="panel-header">
              <h3>
                {isHi
                  ? `सर्वाष्टकवर्ग बिंदु (SAV योग = ${chart.ashtakavarga.totalBindus})`
                  : `Sarvashtakavarga Bindus by Sign (Total SAV = ${chart.ashtakavarga.totalBindus})`}
              </h3>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    {SIGNS.map((s) => (
                      <th key={s.index}>{trSign(s.index, language).slice(0, 4)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {chart.ashtakavarga.sarva.map((pts, idx) => (
                      <td key={idx} className="mono">
                        <strong className={pts >= 30 ? 'tone-text-high' : pts <= 24 ? 'tone-text-low' : ''}>
                          {pts}
                        </strong>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* PAGE 4: 10 Kundali Doshas & Classical Yogas */}
          <div className="print-page-break" />

          {report.paramayus.exceeded ? (
            <ParamayusLockBanner status={report.paramayus} />
          ) : (
            <>
          <section className="panel">
            <div className="panel-header">
              <h3>
                {isHi
                  ? `दस प्रमुख कुंडली दोष जांच (${report.kundaliDoshas.presentCount} सक्रिय)`
                  : `10 Classical Kundali Dosha Check (${report.kundaliDoshas.presentCount} Active)`}
              </h3>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{isHi ? 'दोष' : 'Dosha'}</th>
                    <th>{t.common.status}</th>
                    <th>{isHi ? 'स्थिति व परिहार / उपाय' : 'Finding, Mitigation & Remedy'}</th>
                  </tr>
                </thead>
                <tbody>
                  {report.kundaliDoshas.doshas.map((d) => (
                    <tr key={d.name}>
                      <td><strong>{d.name}</strong></td>
                      <td>
                        <span
                          className={`tag ${
                            d.status === 'Present'
                              ? 'tag-combust'
                              : d.status === 'Mitigated (Cancelled)'
                                ? 'tag-retro'
                                : 'tag-varg'
                          }`}
                        >
                          {trBadge(d.status, language)}
                        </span>
                      </td>
                      <td className="wrap-cell">
                        {d.trigger} — <em>{d.mitigation}</em>
                        {d.status !== 'Clear' && ` (${isHi ? 'उपाय:' : 'Upay:'} ${d.remedy})`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {chart.yogas.length > 0 && (
            <section className="panel">
              <div className="panel-header">
                <h3>{isHi ? 'कुंडली में निर्मित प्रमुख राजयोग व शुभ योग' : 'Notable Classical Yogas Detected'}</h3>
              </div>
              <div className="two-col-split-pad">
                <div className="pred-bullets">
                  {chart.yogas.slice(0, 8).map((y, idx) => (
                    <div key={idx}>
                      <strong>
                        {y.name} ({y.planets.map((p) => trPlanet(p, language)).join(', ')}):
                      </strong>{' '}
                      {y.description}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* PAGE 5: Life Pillars, Specialized Branches & Family Heritage */}
          <div className="print-page-break" />

          <section className="panel">
            <div className="panel-header">
              <h3>{isHi ? 'जीवन संश्लेषण, अष्ट स्तंभ एवं विशेष ज्योतिष शाखाएँ' : 'Life Pillars, Specialized Branches & Family Insight'}</h3>
            </div>
            <div className="pred-card-body">
              <p>{report.lagnaProfile.temperament}</p>
              <div className="pred-bullets">
                {report.lifeDomains.map((d) => (
                  <div key={d.id}>
                    <strong>
                      {d.title} ({d.rating}/100):
                    </strong>{' '}
                    {d.summary}
                  </div>
                ))}
                <div>
                  <strong>{isHi ? 'वित्त एवं संपत्ति:' : 'Financial Astrology:'}</strong>{' '}
                  {spec.financial.induLagnaNote} {spec.financial.wealthStyle}
                </div>
                <div>
                  <strong>{isHi ? 'शिक्षा व करियर:' : 'Education & Career:'}</strong>{' '}
                  {spec.education.d24Note} {spec.career.d10Summary}
                </div>
                <div>
                  <strong>{isHi ? 'दांपत्य, संतान एवं परिवार:' : 'Marriage, Progeny & Childhood:'}</strong>{' '}
                  {spec.marriage.spouseProfile} {report.familyReport.childhood.balyaSummary}
                </div>
                <div>
                  <strong>{isHi ? 'चिकित्सा एवं स्वास्थ्य:' : 'Medical Astrology:'}</strong>{' '}
                  {spec.medical.dominantPrakriti} — {spec.medical.d6ShashthamsaNote}
                </div>
                <div>
                  <strong>
                    {isHi
                      ? `वर्तमान दशा (${formatDateDmy(report.dashaForecast.targetDate)}):`
                      : `Active Dasha (${formatDateDmy(report.dashaForecast.targetDate)}):`}
                  </strong>{' '}
                  {report.dashaForecast.summary}
                </div>
                <div>
                  <strong>{isHi ? 'प्रमुख इष्टदेव व स्वामी ग्रह:' : 'Main Deity (Ishta Devata) & Governing Planet:'}</strong>{' '}
                  {isHi ? report.lifeEventsLedger.deityAndMainPlanet.ishtaDevataHi : report.lifeEventsLedger.deityAndMainPlanet.ishtaDevataEn} ·{' '}
                  {isHi ? report.lifeEventsLedger.deityAndMainPlanet.mainPlanetHi : report.lifeEventsLedger.deityAndMainPlanet.mainPlanetEn}
                </div>
                <div>
                  <strong>{isHi ? 'गंडमूल एवं आयु-बल (अल्पायु जांच):' : 'Gandmool Nakshatra & Longevity Assessment:'}</strong>{' '}
                  {isHi ? report.lifeEventsLedger.payaAndGandmool.gandmoolReadingHi : report.lifeEventsLedger.payaAndGandmool.gandmoolReadingEn} ·{' '}
                  {isHi ? report.lifeEventsLedger.longevity.categoryHi : report.lifeEventsLedger.longevity.categoryEn}
                </div>
                <div>
                  <strong>{isHi ? 'ग्रह युति व दुर्घटना सावधानी:' : 'Conjunctions (Yuti) & Accident Watch:'}</strong>{' '}
                  {isHi ? report.yutiReport.summaryHi : report.yutiReport.summaryEn} ·{' '}
                  {isHi ? report.lifeEventsLedger.accidentProfile.riskTypesHi : report.lifeEventsLedger.accidentProfile.riskTypesEn}
                </div>
                <div>
                  <strong>{isHi ? 'भावात् भावम् व ग्रह दृष्टि सारांश:' : 'Bhavat Bhavam & Aspects (Drishti):'}</strong>{' '}
                  {isHi ? report.bhavatBhavamReport.summaryHi : report.bhavatBhavamReport.summaryEn} ·{' '}
                  {isHi ? report.drishtiReport.summaryHi : report.drishtiReport.summaryEn}
                </div>
                <div>
                  <strong>{isHi ? 'भृगु नंदी नाड़ी (BNN) करियर व विवाह:' : 'Bhrigu Nandi Nadi (Career & Marriage):'}</strong>{' '}
                  {isHi ? report.bhriguNandiNadi.karmaCareerHi : report.bhriguNandiNadi.karmaCareerEn} ·{' '}
                  {isHi ? report.bhriguNandiNadi.marriageNadiHi : report.bhriguNandiNadi.marriageNadiEn}
                </div>
                {report.lifeEventsLedger.qaLedger.map((q) => (
                  <div key={q.id}>
                    <strong>{isHi ? q.titleHi : q.titleEn}:</strong>{' '}
                    {isHi ? q.answerHi : q.answerEn}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* PAGE 6: Varshaphala, Lal Kitab, Gemstones & Rudraksha Remedies */}
          <div className="print-page-break" />

          <section className="panel">
            <div className="panel-header">
              <h3>
                {isHi
                  ? 'वर्षफल, लाल किताब टेवा एवं रत्न–रुद्राक्ष परामर्श'
                  : 'Annual Varshaphala, Lal Kitab Teva, Gemstones & Rudraksha'}
              </h3>
            </div>
            <div className="pred-card-body">
              <div className="pred-bullets">
                <div>
                  <strong>
                    {isHi ? `वार्षिक वर्षफल (${report.varshaphala.year}):` : `Varshaphala (${report.varshaphala.year}):`}
                  </strong>{' '}
                  {report.varshaphala.annualSummary}
                </div>
                <div>
                  <strong>{isHi ? 'लाल किताब टेवा वर्ग:' : 'Lal Kitab Teva Classification:'}</strong>{' '}
                  {isHi ? lkFull.tevaTypeHi : lkFull.tevaTypeEn} —{' '}
                  {isHi ? lkFull.tevaReasonHi : lkFull.tevaReasonEn}
                </div>
                <div>
                  <strong>{isHi ? 'जीवन रत्न (लग्नेश):' : 'Life Stone (Jeevan Ratna):'}</strong>{' '}
                  {isHi ? gemReport.lifeStone.stoneHi : gemReport.lifeStone.stoneEn} ·{' '}
                  {isHi ? gemReport.lifeStone.metalHi : gemReport.lifeStone.metalEn} ·{' '}
                  {isHi ? gemReport.lifeStone.dayHi : gemReport.lifeStone.dayEn}
                </div>
                <div>
                  <strong>{isHi ? 'भाग्य व पुण्य रत्न:' : 'Lucky & Benefic Stones:'}</strong>{' '}
                  {isHi ? gemReport.luckyStone.stoneHi : gemReport.luckyStone.stoneEn},{' '}
                  {isHi ? gemReport.beneficStone.stoneHi : gemReport.beneficStone.stoneEn}
                </div>
                <div>
                  <strong>{isHi ? 'त्याज्य रत्न (दुस्थान):' : 'Gemstones to Avoid:'}</strong>{' '}
                  {(isHi ? gemReport.avoidStonesHi : gemReport.avoidStonesEn).join('; ') ||
                    (isHi ? 'कोई मुख्य निषेध नहीं' : 'No strong contraindications')}
                </div>
                <div>
                  <strong>{isHi ? 'अनुशंसित रुद्राक्ष:' : 'Recommended Rudraksha:'}</strong>{' '}
                  {isHi ? gemReport.primaryRudraksha.titleHi : gemReport.primaryRudraksha.titleEn} ·{' '}
                  {isHi ? gemReport.secondaryRudraksha.titleHi : gemReport.secondaryRudraksha.titleEn}{' '}
                  ({gemReport.primaryRudraksha.mantra})
                </div>
              </div>
            </div>
          </section>
            </>
          )}

          <PatrikaBookFullPrintEdition
            chart={chart}
            chartStyle={chartStyle}
            report={report}
            language={language}
          />

          {branding.enabled && (branding.footerNote || branding.kendraName) && (
            <footer className="booklet-footer">
              <div><strong>{branding.kendraName}</strong> {branding.astrologerName ? `· ${branding.astrologerName}` : ''}</div>
              {branding.contactInfo && <div className="small-text muted">{branding.contactInfo}</div>}
              {branding.footerNote && <div className="small-text muted">{branding.footerNote}</div>}
            </footer>
          )}
        </div>
      </div>
    </div>
  );
};
