import React, { useMemo, useState } from 'react';
import { Award, BookOpen, Clock, Compass, FileText, Gem, Layers, Printer, ShieldAlert, Sparkles, Star } from 'lucide-react';
import { SEVEN_PLANETS } from '../../astro/constants';
import { computePatrikaBookData, SHODASHA_VARGAS_LIST, type PatrikaBookData } from '../../astro/predictions/patrikaBook';
import type { PredictionReport } from '../../astro/predictions/types';
import { formatDateDmy, formatLocalDateTimeFromUtc } from '../../astro/time';
import type { ChartData, ChartStyle } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet, trPlanetShort, trSign } from '../../i18n/translations';
import { VedicChartSvg } from '../VedicChartSvg';

type PatrikaSectionTab =
  | 'lagna_panchang'
  | 'houses_12'
  | 'avastha_dasha'
  | 'vargas_sav_purpose'
  | 'dosha_gems_gochar'
  | 'classical_branches';

function signTxt(idx: number, lang: 'en' | 'hi') {
  return trSign(idx, lang);
}

function planetTxt(id: string, lang: 'en' | 'hi') {
  return trPlanet(id, lang);
}

function tierBadgeClass(tier: string) {
  if (tier === 'Recommended') return 'tag-varg';
  if (tier === 'Worth Considering') return 'tag-karaka';
  if (tier === 'Best Avoided') return 'tag-combust';
  return 'tag-retro';
}

export const PatrikaBookInteractivePanel: React.FC<{
  chart: ChartData;
  report: PredictionReport;
  forecastDate: string;
  onOpenBooklet?: () => void;
}> = ({ chart, report, forecastDate, onOpenBooklet }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';
  const [tab, setTab] = useState<PatrikaSectionTab>('lagna_panchang');
  const [selectedHouse, setSelectedHouse] = useState<number | 'all'>('all');

  const book = useMemo(
    () => computePatrikaBookData(chart, forecastDate, report),
    [chart, forecastDate, report]
  );

  const openPrintBook = () => {
    if (onOpenBooklet) onOpenBooklet();
    else window.dispatchEvent(new CustomEvent('jyotish:open-booklet'));
  };

  const sectionTabs: Array<{ id: PatrikaSectionTab; labelEn: string; labelHi: string; icon: React.ReactNode }> = [
    { id: 'lagna_panchang', labelEn: '1. Panchanga & Lagna Complete', labelHi: '1. पंचांग एवं लग्न संपूर्ण फलादेश', icon: <Compass size={13} /> },
    { id: 'houses_12', labelEn: '2. Twelve Houses Book (Ch 28)', labelHi: '2. द्वादश भाव संपूर्ण अध्याय (1–12)', icon: <BookOpen size={13} /> },
    { id: 'avastha_dasha', labelEn: '3. Avasthas & Dasha Support Index', labelHi: '3. अवस्था एवं दशा सपोर्ट इंडेक्स', icon: <Sparkles size={13} /> },
    { id: 'vargas_sav_purpose', labelEn: '4. Vaiseshikamsha, SAV & Purpose', labelHi: '4. षोडशवर्ग, SAV शोधन व जीवन उद्देश्य', icon: <Layers size={13} /> },
    { id: 'dosha_gems_gochar', labelEn: '5. Doshas, Gems, Nakshatra & 10Y Gochar', labelHi: '5. दोष, रत्न, नक्षत्र व 10-वर्षीय गोचर', icon: <Gem size={13} /> },
    { id: 'classical_branches', labelEn: '6. Yogas, Bhrigu, KP & Lal Kitab', labelHi: '6. 300+ योग, भृगु, केपी व लाल किताब', icon: <Award size={13} /> },
  ];

  const chHouses =
    selectedHouse === 'all'
      ? book.horoscopeChapters.houseChapters
      : book.horoscopeChapters.houseChapters.filter((h) => h.houseNumber === selectedHouse);

  return (
    <div className="view-stack">
      <div className="patrika-banner-card">
        <div className="patrika-banner-head">
          <div>
            <strong>
              {isHi
                ? 'बृहत् जन्म पत्रिका — 34 अध्यायों वाला पूर्ण वैदिक फलादेश ग्रंथ'
                : 'Master Janmakundali Book View — Complete 34-Chapter Vedic Report'}
            </strong>
            <div className="small-text muted">
              {isHi
                ? 'पंचांग फल, लग्न संपूर्ण विश्लेषण, द्वादश भाव (राशि+दृष्टि+भावेश+उपाय), अवस्था, दशा सपोर्ट इंडेक्स (-100 से +100), षोडशवर्ग देवता व 10-वर्षीय गोचर'
                : 'Structured after classical paid Janmakundali folios: Panchanga Phal, 6-part Lagna Analysis, 12-House Deep Chapters, Avasthas, Dasha Support Index, Shodhana SAV & 10-Yr Gochar'}
            </div>
          </div>
          <button type="button" className="btn btn-primary btn-sm" onClick={openPrintBook}>
            <Printer size={14} />{' '}
            {isHi ? '34-अध्याय संपूर्ण PDF / प्रिंट खोलें' : 'Open Full 34-Ch Printable PDF'}
          </button>
        </div>
        <div className="patrika-chapter-pills">
          {sectionTabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`patrika-pill-btn ${tab === t.id ? 'is-active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.icon}
              <span>{isHi ? t.labelHi : t.labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: Panchanga Phal & Lagna Complete Analysis */}
      {tab === 'lagna_panchang' && (
        <div className="view-stack">
          <section className="panel">
            <div className="panel-header">
              <h3>{isHi ? 'जन्म पंचांग फल व संवत्सर विवरण' : 'Panchanga Phal — Birth Calendar & Elemental Synthesis'}</h3>
              <span className="tag tag-karaka">
                {book.panchangaMeta.samvatsaraHi} / VS {book.panchangaMeta.vikramSamvat}
              </span>
            </div>
            <div className="pred-card-body">
              <p className="lead-text">{isHi ? book.horoscopeChapters.panchangaPhalHi : book.horoscopeChapters.panchangaPhalEn}</p>
              <div className="table-scroll" style={{ marginTop: 10 }}>
                <table className="data-table">
                  <tbody>
                    <tr>
                      <td>{isHi ? 'संवत्सर / शक / कलियुग' : 'Samvatsara / Shaka / Kaliyuga'}</td>
                      <td><strong>{isHi ? book.panchangaMeta.samvatsaraHi : book.panchangaMeta.samvatsaraEn} · VS {book.panchangaMeta.vikramSamvat} · Kali {book.panchangaMeta.kaliyugaYear}</strong></td>
                      <td>{isHi ? 'अयन / ऋतु / मास' : 'Ayana / Ritu / Masa'}</td>
                      <td><strong>{isHi ? `${book.panchangaMeta.ayanaHi} · ${book.panchangaMeta.rituHi} · ${book.panchangaMeta.masaHi}` : `${book.panchangaMeta.ayanaEn} · ${book.panchangaMeta.rituEn} · ${book.panchangaMeta.masaEn}`}</strong></td>
                    </tr>
                    <tr>
                      <td>{isHi ? 'योगिनी दशा शेष' : 'Yogini Balance at Birth'}</td>
                      <td><strong>{isHi ? book.panchangaMeta.yoginiBirthBalanceHi : book.panchangaMeta.yoginiBirthBalanceEn}</strong></td>
                      <td>{isHi ? 'विंशोत्तरी दशा शेष' : 'Vimshottari Balance'}</td>
                      <td><strong>{isHi ? book.panchangaMeta.avakahada.dashaBalanceHi : book.panchangaMeta.avakahada.dashaBalanceEn}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h3>{isHi ? `${signTxt(chart.ascendant.signIndex, lang)} लग्न — संपूर्ण 6-आयामी विश्लेषण` : `${signTxt(chart.ascendant.signIndex, lang)} Lagna — Complete 6-Part Analysis`}</h3>
            </div>
            <div className="placement-cards">
              {book.horoscopeChapters.lagnaSections.map((sec, idx) => (
                <article key={idx} className="placement-card patrika-parchment-card">
                  <strong>{isHi ? sec.titleHi : sec.titleEn}</strong>
                  <p className="yoga-desc">{isHi ? sec.bodyHi : sec.bodyEn}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h3>{isHi ? 'वर्ग लग्न फलादेश (D2 होरा, D3 द्रेष्काण, D12 द्वादशांश, D30 त्रिशांश)' : 'Ascendant Divisional Readings (D2, D3, D12, D30)'}</h3>
            </div>
            <div className="placement-cards">
              {book.horoscopeChapters.ascDivisionalReadings.map((d) => (
                <article key={d.vargaId} className="placement-card">
                  <div className="placement-card-top">
                    <strong>{isHi ? d.titleHi : d.titleEn}</strong>
                    <span className="tag tag-karaka">{d.vargaId}</span>
                  </div>
                  <p className="yoga-desc">{isHi ? d.textHi : d.textEn}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* SECTION 2: 12-House Master Book (Chapter 28) */}
      {tab === 'houses_12' && (
        <div className="view-stack">
          <div className="charts-toolbar">
            <span className="label-muted">{isHi ? 'भाव अध्याय चुनें:' : 'Filter House Chapter:'}</span>
            <div className="subtab-bar">
              <button
                type="button"
                className={`subtab-btn ${selectedHouse === 'all' ? 'is-active' : ''}`}
                onClick={() => setSelectedHouse('all')}
              >
                {isHi ? 'सभी 12 भाव (1–12)' : 'All 12 Houses'}
              </button>
              {Array.from({ length: 12 }, (_, idx) => idx + 1).map((h) => (
                <button
                  key={h}
                  type="button"
                  className={`subtab-btn ${selectedHouse === h ? 'is-active' : ''}`}
                  onClick={() => setSelectedHouse(h)}
                >
                  H{h}
                </button>
              ))}
            </div>
          </div>

          {chHouses.map((hc) => (
            <section key={hc.houseNumber} className="panel patrika-chapter-panel">
              <div className="panel-header patrika-chapter-head">
                <h3>
                  {isHi ? `${hc.houseNumber}. ${hc.titleHi}` : `House ${hc.houseNumber} — ${hc.titleEn}`}
                </h3>
                <div className="toolbar-group">
                  <span className="tag tag-karaka">
                    {signTxt(hc.signIndex, lang)} · {isHi ? 'स्वामी' : 'Lord'}: {planetTxt(hc.lordPlanet, lang)} (H{hc.lordPlacedHouse})
                  </span>
                  <span className={`tag ${hc.savBindus >= 30 ? 'tag-varg' : hc.savBindus <= 24 ? 'tag-combust' : 'tag-retro'}`}>
                    SAV {hc.savBindus} · {hc.score}/100
                  </span>
                </div>
              </div>
              <div className="pred-card-body">
                <div className="pred-bullets">
                  <div>
                    <strong>{isHi ? 'भावस्थ राशि प्रभाव:' : 'Sign in House:'}</strong>{' '}
                    {isHi ? hc.signResultHi : hc.signResultEn}
                  </div>
                  <div>
                    <strong>{isHi ? 'भाव पर ग्रह दृष्टि:' : 'Planetary Aspects on House:'}</strong>{' '}
                    {isHi ? hc.aspectsResultHi : hc.aspectsResultEn}
                  </div>
                  <div>
                    <strong>{isHi ? 'भावेश स्थिति फल:' : 'House Lord Placement Result:'}</strong>{' '}
                    {isHi ? hc.lordResultHi : hc.lordResultEn}
                  </div>
                  <div>
                    <strong>{isHi ? `विशेष विषय (${hc.topicHeadingHi}):` : `Life Topic (${hc.topicHeadingEn}):`}</strong>{' '}
                    {isHi ? hc.topicReadingHi : hc.topicReadingEn}
                  </div>
                  <div>
                    <strong>{isHi ? 'ग्रह व व्यावहारिक परामर्श:' : 'Occupying Planets & Guidance:'}</strong>{' '}
                    {isHi ? hc.occupantsAdviceHi : hc.occupantsAdviceEn}
                  </div>
                  <div>
                    <strong>{isHi ? 'शास्त्रीय उपाय:' : 'Classical Remedies:'}</strong>{' '}
                    {isHi ? hc.remediesHi : hc.remediesEn}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}

      {/* SECTION 3: Avasthas Narratives + Dasha Support Index (-100..+100) + Antardasha Comparison */}
      {tab === 'avastha_dasha' && (
        <div className="view-stack">
          <section className="panel">
            <div className="panel-header">
              <h3>{isHi ? 'दशा सपोर्ट इंडेक्स (-100 से +100 — सप्त जीवन आयाम)' : 'Dasha Support Index (-100 to +100 Across 7 Life Domains)'}</h3>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                    <th>{isHi ? 'बुद्धि' : 'Intellect'}</th>
                    <th>{isHi ? 'कार्यक्षमता' : 'Efficiency'}</th>
                    <th>{isHi ? 'प्रेम/परिवार' : 'Love/Family'}</th>
                    <th>{isHi ? 'स्वास्थ्य' : 'Health'}</th>
                    <th>{isHi ? 'प्रतिष्ठा' : 'Social'}</th>
                    <th>{isHi ? 'करियर' : 'Career'}</th>
                    <th>{isHi ? 'वित्त' : 'Finance'}</th>
                    <th>{isHi ? 'औसत / निर्णय' : 'Avg & Verdict'}</th>
                  </tr>
                </thead>
                <tbody>
                  {book.dashaSupportIndex.rows.map((r) => (
                    <tr key={r.planet}>
                      <td><strong>{planetTxt(r.planet, lang)}</strong></td>
                      <td className="mono">{r.intelligence > 0 ? `+${r.intelligence}` : r.intelligence}</td>
                      <td className="mono">{r.efficiency > 0 ? `+${r.efficiency}` : r.efficiency}</td>
                      <td className="mono">{r.loveFamily > 0 ? `+${r.loveFamily}` : r.loveFamily}</td>
                      <td className="mono">{r.health > 0 ? `+${r.health}` : r.health}</td>
                      <td className="mono">{r.social > 0 ? `+${r.social}` : r.social}</td>
                      <td className="mono">{r.career > 0 ? `+${r.career}` : r.career}</td>
                      <td className="mono">{r.finance > 0 ? `+${r.finance}` : r.finance}</td>
                      <td>
                        <span className={`tag ${r.average >= 15 ? 'tag-varg' : r.average >= -10 ? 'tag-retro' : 'tag-combust'}`}>
                          {r.average > 0 ? `+${r.average}` : r.average} · {isHi ? r.verdictHi : r.verdictEn}
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
              <h3>{isHi ? 'वर्तमान महादशा में अंतरदशा तुलना तालिका' : 'Upcoming & Active Antardasha Comparison Table'}</h3>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{isHi ? 'अंतरदशा' : 'Antardasha'}</th>
                    <th>{isHi ? 'प्रारंभ — समाप्ति' : 'Period (DD-MM-YYYY)'}</th>
                    <th>{isHi ? 'सपोर्ट अंक' : 'Index'}</th>
                    <th>{isHi ? 'सारांश व फल' : 'Focus & Summary'}</th>
                  </tr>
                </thead>
                <tbody>
                  {book.dashaSupportIndex.activeAntardashas.map((ad, idx) => (
                    <tr key={idx} className={ad.isCurrent ? 'active-row' : ''}>
                      <td>
                        <strong>{planetTxt(ad.lord, lang)}</strong>
                        {ad.isCurrent && <span className="tag tag-karaka" style={{ marginLeft: 6 }}>{isHi ? 'सक्रिय' : 'Active'}</span>}
                      </td>
                      <td className="mono">{ad.startDmy} — {ad.endDmy}</td>
                      <td className="mono">{ad.focusScore > 0 ? `+${ad.focusScore}` : ad.focusScore}</td>
                      <td className="wrap-cell">
                        <strong>{isHi ? ad.verdictHi : ad.verdictEn}:</strong> {isHi ? ad.summaryHi : ad.summaryEn}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h3>{isHi ? 'नवग्रह अवस्था विश्लेषण (बलादि, लज्जितादि, शयनादि एवं ज्योतिषीय व्याख्या)' : 'Planetary Avasthas Narrative (Baladi, Lajjitadi, Sayanadi & Interpretation)'}</h3>
            </div>
            <div className="placement-cards">
              {book.avasthaNarratives.map((av) => (
                <article key={av.planet} className="placement-card">
                  <div className="placement-card-top">
                    <strong>{planetTxt(av.planet, lang)}</strong>
                    <span className="tag tag-karaka">{isHi ? av.subStateHi : av.subStateEn}</span>
                  </div>
                  <div className="small-text muted">
                    {isHi ? av.baladiHi : av.baladiEn} · {isHi ? av.lajjitadiHi : av.lajjitadiEn} · {isHi ? av.sayanadiHi : av.sayanadiEn}
                  </div>
                  <p className="yoga-desc">{isHi ? av.interpretationHi : av.interpretationEn}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* SECTION 4: Vaiseshikamsha, SAV Shodhana, Life Areas & Life Purpose */}
      {tab === 'vargas_sav_purpose' && (
        <div className="view-stack">
          <div className="pred-top-grid">
            <section className="panel">
              <div className="panel-header">
                <h3>{isHi ? 'वैशेषिकांश एवं विंशोपक बल (16 वर्ग)' : 'Vaiseshikamsha & Vimshopaka (16 Vargas)'}</h3>
              </div>
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                      <th>{isHi ? 'शुभ वर्ग संख्या' : 'Strong Vargas'}</th>
                      <th>{isHi ? 'वैशेषिकांश पदवी' : 'Vaiseshikamsha'}</th>
                      <th>{isHi ? 'विंशोपक (20)' : 'Vimshopaka'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {book.vaiseshikamsha.map((v) => (
                      <tr key={v.planet}>
                        <td><strong>{planetTxt(v.planet, lang)}</strong></td>
                        <td className="mono">{v.strongCount} ({v.vargaIdsStrong.join(', ') || '—'})</td>
                        <td><span className="tag tag-varg">{isHi ? v.titleHi : v.titleEn}</span></td>
                        <td className="mono">{v.vimshopakaScore.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <h3>{isHi ? 'जीवन उद्देश्य, इष्टदेव एवं पुरुषार्थ संतुलन' : 'Life Purpose, Ishta Devata & Purushartha'}</h3>
              </div>
              <div className="pred-card-body">
                <div className="pred-bullets">
                  <div>
                    <strong>{isHi ? 'आत्मकारक व कारकांश:' : 'Atmakaraka & Karakamsha:'}</strong>{' '}
                    {book.jaiminiExtended.karakamshaSign} (Swamsa: {book.jaiminiExtended.swamsaSign})
                  </div>
                  <div>
                    <strong>{isHi ? 'इष्ट देवता (कारकांश से 12वां भाव):' : 'Ishta Devata (12th from AK in D9):'}</strong>{' '}
                    {isHi ? book.jaiminiExtended.ishtaDevataFormHi : book.jaiminiExtended.ishtaDevataFormEn} ({planetTxt(book.jaiminiExtended.ishtaDevataPlanet, lang)})
                  </div>
                  <div>
                    <strong>{isHi ? 'चतुर्विध पुरुषार्थ संतुलन:' : '4-Fold Purushartha Balance:'}</strong>{' '}
                    Dharma {book.jaiminiExtended.purushartha.dharma}% · Artha {book.jaiminiExtended.purushartha.artha}% · Kama {book.jaiminiExtended.purushartha.kama}% · Moksha {book.jaiminiExtended.purushartha.moksha}%
                  </div>
                  <div>
                    <strong>{isHi ? 'मोक्ष एवं आध्यात्मिक सूचकांक:' : 'Moksha & Inner Evolution Index:'}</strong>{' '}
                    {book.jaiminiExtended.mokshaIndexPct}%
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section className="panel">
            <div className="panel-header">
              <h3>{isHi ? 'सर्वाष्टकवर्ग शोधन, शोध्य पिंड एवं 12 भाव विश्लेषण' : 'SAV Shodhana Retention, Sodhya Pinda & 12-House Strength'}</h3>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                    <th>{isHi ? 'मूल बिंदु' : 'Raw BAV'}</th>
                    <th>{isHi ? 'त्रिकोण पश्चात्' : 'After Trikona'}</th>
                    <th>{isHi ? 'शोधित (एकाधिपत्य)' : 'Shodhita'}</th>
                    <th>{isHi ? 'धारण %' : 'Retention %'}</th>
                    <th>{isHi ? 'राशि पिंड' : 'Rasi Pinda'}</th>
                    <th>{isHi ? 'ग्रह पिंड' : 'Graha Pinda'}</th>
                    <th>{isHi ? 'शोध्य पिंड' : 'Sodhya Pinda'}</th>
                  </tr>
                </thead>
                <tbody>
                  {book.savAnalysis.shodhana.map((s) => (
                    <tr key={s.planet}>
                      <td><strong>{planetTxt(s.planet, lang)}</strong></td>
                      <td className="mono">{s.rawTotal}</td>
                      <td className="mono">{s.afterTrikona}</td>
                      <td className="mono">{s.shodhitaTotal}</td>
                      <td className="mono">{s.retentionPct}%</td>
                      <td className="mono">{s.rasiPinda}</td>
                      <td className="mono">{s.grahaPinda}</td>
                      <td><strong>{s.sodhyaPinda}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="panel-subblock">
              <div className="placement-cards">
                {book.savAnalysis.houses.map((sh) => (
                  <article key={sh.house} className="placement-card">
                    <div className="placement-card-top">
                      <strong>H{sh.house} · {signTxt(sh.signIndex, lang)} (#{sh.rank})</strong>
                      <span className={`tag ${sh.bindus >= 30 ? 'tag-varg' : sh.bindus <= 24 ? 'tag-combust' : 'tag-karaka'}`}>
                        {sh.bindus} {isHi ? 'बिंदु' : 'Bindus'}
                      </span>
                    </div>
                    <p className="yoga-desc">{isHi ? sh.predictionHi : sh.predictionEn}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h3>{isHi ? '7 जीवन-क्षेत्र समग्र स्कोर एवं विपरीत भाव संतुलन (SAV)' : '7 Life-Area Composite Scores & Opposite-House Balance'}</h3>
            </div>
            <div className="two-col-split-pad">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{isHi ? 'जीवन क्षेत्र' : 'Life Domain'}</th>
                    <th>{isHi ? 'भाव' : 'Houses'}</th>
                    <th>{isHi ? 'स्कोर' : 'Score'}</th>
                    <th>{isHi ? 'निर्णय' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody>
                  {book.savAnalysis.lifeAreas.map((la) => (
                    <tr key={la.houses}>
                      <td><strong>{isHi ? la.nameHi : la.nameEn}</strong></td>
                      <td className="mono">{la.houses}</td>
                      <td className="mono">{la.score}%</td>
                      <td>{isHi ? la.statusHi : la.statusEn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{isHi ? 'अक्ष (द्वंद्व)' : 'House Axis'}</th>
                    <th>{isHi ? 'बिंदु तुलना' : 'Bindus'}</th>
                    <th>Δ</th>
                    <th>{isHi ? 'व्याख्या' : 'Balance Note'}</th>
                  </tr>
                </thead>
                <tbody>
                  {book.savAnalysis.oppositeBalance.map((ob) => (
                    <tr key={ob.pair}>
                      <td><strong>{ob.pair}</strong></td>
                      <td className="mono">{ob.leftPts} vs {ob.rightPts}</td>
                      <td className="mono">{ob.diff > 0 ? `+${ob.diff}` : ob.diff}</td>
                      <td className="small-text wrap-cell">{isHi ? ob.noteHi : ob.noteEn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h3>{isHi ? 'षोडशवर्ग पाराशरी अंश देवता (D1–D60)' : 'Shodasha Varga Parashari Amsa Deities Matrix (D1–D60)'}</h3>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Varga</th>
                    <th>{isHi ? 'लग्न' : 'Lagna'}</th>
                    {SEVEN_PLANETS.map((p) => <th key={p}>{trPlanetShort(p, lang)}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {book.shodashaDeities.filter((r) => ['D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12', 'D16', 'D20', 'D24', 'D30', 'D60'].includes(r.vargaId)).map((r) => (
                    <tr key={r.vargaId}>
                      <td><strong>{r.vargaId}</strong> <span className="small-text muted">{isHi ? r.nameHi : r.nameEn}</span></td>
                      <td>{signTxt(r.lagnaSignIndex, lang).slice(0, 4)}</td>
                      {SEVEN_PLANETS.map((p) => (
                        <td key={p} className="small-text">
                          <strong>{signTxt(r.planets[p].signIndex, lang).slice(0, 3)}</strong>
                          <div className="muted" style={{ fontSize: 10 }}>{r.planets[p].amsaDeity}</div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* SECTION 5: Doshas (Mangal 3-Ref + Putra Shaapa), 4-Tier Gems, Rahu-Ketu Nakshatra, Special Points & 10Y Gochar */}
      {tab === 'dosha_gems_gochar' && (
        <div className="view-stack">
          <div className="pred-top-grid">
            <section className="panel">
              <div className="panel-header">
                <h3><ShieldAlert size={15} /> {isHi ? 'मांगलिक (3 आधार) एवं पुत्र शाप जांच' : 'Manglik (Lagna/Moon/Venus) & Putra Shaapa Audit'}</h3>
              </div>
              <div className="pred-card-body">
                <div className="pred-bullets">
                  <div>
                    <strong>{isHi ? 'मांगलिक स्थिति:' : 'Manglik References:'}</strong>{' '}
                    {isHi ? 'लग्न से:' : 'From Lagna:'} {book.doshasAndGems.manglikLagna ? (isHi ? 'हाँ' : 'Yes') : (isHi ? 'नहीं' : 'No')} ·{' '}
                    {isHi ? 'चंद्र से:' : 'Moon:'} {book.doshasAndGems.manglikMoon ? (isHi ? 'हाँ' : 'Yes') : (isHi ? 'नहीं' : 'No')} ·{' '}
                    {isHi ? 'शुक्र से:' : 'Venus:'} {book.doshasAndGems.manglikVenus ? (isHi ? 'हाँ' : 'Yes') : (isHi ? 'नहीं' : 'No')}
                  </div>
                  {(isHi ? book.doshasAndGems.manglikMitigationsHi : book.doshasAndGems.manglikMitigationsEn).map((m, i) => (
                    <div key={i}>• {m}</div>
                  ))}
                  <div>
                    <strong>{isHi ? 'पुत्र शाप जांच:' : 'Putra Shaapa Check:'}</strong>{' '}
                    <span className="tag tag-retro">{isHi ? book.doshasAndGems.putraShaapa.statusHi : book.doshasAndGems.putraShaapa.statusEn}</span>{' '}
                    — {isHi ? book.doshasAndGems.putraShaapa.detailHi : book.doshasAndGems.putraShaapa.detailEn}
                  </div>
                  <div>
                    <strong>{isHi ? 'परिहार / शांति उपाय:' : 'Remedy:'}</strong>{' '}
                    {isHi ? book.doshasAndGems.putraShaapa.remedyHi : book.doshasAndGems.putraShaapa.remedyEn}
                  </div>
                </div>
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <h3>{isHi ? 'राहु एवं केतु नक्षत्र विशेष फलादेश' : 'Rahu & Ketu Nakshatra Special Readings'}</h3>
              </div>
              <div className="pred-card-body">
                <div className="pred-bullets">
                  <div>
                    <strong>{isHi ? `राहु (${signTxt(book.horoscopeChapters.rahuKetuNakshatra.rahuSign, lang)} · भाव ${book.horoscopeChapters.rahuKetuNakshatra.rahuHouse} · ${book.horoscopeChapters.rahuKetuNakshatra.rahuNakshatra}):` : `Rahu (H${book.horoscopeChapters.rahuKetuNakshatra.rahuHouse}, ${book.horoscopeChapters.rahuKetuNakshatra.rahuNakshatra}):`}</strong>{' '}
                    {isHi ? book.horoscopeChapters.rahuKetuNakshatra.rahuReadingHi : book.horoscopeChapters.rahuKetuNakshatra.rahuReadingEn}
                  </div>
                  <div>
                    <strong>{isHi ? `केतु (${signTxt(book.horoscopeChapters.rahuKetuNakshatra.ketuSign, lang)} · भाव ${book.horoscopeChapters.rahuKetuNakshatra.ketuHouse} · ${book.horoscopeChapters.rahuKetuNakshatra.ketuNakshatra}):` : `Ketu (H${book.horoscopeChapters.rahuKetuNakshatra.ketuHouse}, ${book.horoscopeChapters.rahuKetuNakshatra.ketuNakshatra}):`}</strong>{' '}
                    {isHi ? book.horoscopeChapters.rahuKetuNakshatra.ketuReadingHi : book.horoscopeChapters.rahuKetuNakshatra.ketuReadingEn}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section className="panel">
            <div className="panel-header">
              <h3><Gem size={15} /> {isHi ? 'संपूर्ण रत्न वर्गीकरण (अनुशंसित बनाम त्याज्य रत्न)' : 'Complete 4-Tier Gemstone Matrix'}</h3>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                    <th>{isHi ? 'रत्न' : 'Gemstone'}</th>
                    <th>{isHi ? 'श्रेणी' : 'Suitability Tier'}</th>
                    <th>{isHi ? 'आधार व तर्क' : 'Rationale'}</th>
                  </tr>
                </thead>
                <tbody>
                  {book.doshasAndGems.gemTiers.map((g) => (
                    <tr key={g.planet}>
                      <td><strong>{planetTxt(g.planet, lang)}</strong></td>
                      <td>{isHi ? g.gemHi : g.gemEn}</td>
                      <td><span className={`tag ${tierBadgeClass(g.tier)}`}>{isHi ? g.tierHi : g.tier}</span></td>
                      <td className="wrap-cell">{isHi ? g.reasonHi : g.reasonEn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h3>{isHi ? 'विशेष लग्न एवं बिंदु फलादेश (BL, HL, GL, इंदु, योगी, भृगु बिंदु, त्रिस्फुट, 64वां नवांश)' : 'Special Lagnas & Sensitive Point Readings'}</h3>
            </div>
            <div className="placement-cards">
              {book.specialPoints.map((sp) => (
                <article key={sp.id} className="placement-card">
                  <div className="placement-card-top">
                    <strong>{isHi ? sp.nameHi : sp.nameEn}</strong>
                    <span className="tag tag-karaka">{signTxt(sp.signIndex, lang)} · H{sp.house}</span>
                  </div>
                  <div className="small-text muted mono">{sp.dms} · {isHi ? sp.extraHi : sp.extraEn}</div>
                  <p className="yoga-desc">{isHi ? sp.readingHi : sp.readingEn}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h3>{isHi ? 'आगामी 10-वर्षीय प्रमुख गोचर फलादेश (शनि साढ़ेसाती एवं बृहस्पति राशि परिवर्तन)' : '10-Year Major Planetary Transit Predictions (Saturn & Jupiter)'}</h3>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{isHi ? 'ग्रह / चरण' : 'Transit'}</th>
                    <th>{isHi ? 'अवधि / तिथि' : 'Date / Span'}</th>
                    <th>{isHi ? 'राशि / चंद्र से भाव' : 'Sign & Phase'}</th>
                    <th>{isHi ? 'प्रभाव' : 'Interpretation'}</th>
                  </tr>
                </thead>
                <tbody>
                  {book.horoscopeChapters.gochar10Years.map((g, i) => (
                    <tr key={i}>
                      <td><strong>{g.planet}</strong></td>
                      <td className="mono">{g.dateRange}</td>
                      <td>{g.signName} · <span className="tag tag-karaka">{g.phaseTag}</span></td>
                      <td className="wrap-cell">{isHi ? g.readingHi : g.readingEn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* SECTION 6: 300+ Classical Yogas, Bhrigu Saral Paddhati, KP 4-Step & Lal Kitab */}
      {tab === 'classical_branches' && (
        <div className="view-stack">
          {/* Classical Yogas */}
          <section className="panel">
            <div className="panel-header">
              <h3>
                <Sparkles size={15} />{' '}
                {isHi
                  ? `कुंडली में सक्रिय शास्त्रीय वैदिक योग (${book.classicalYogas.length} योग)`
                  : `Active Classical Vedic Yogas (${book.classicalYogas.length} Yogas)`}
              </h3>
              <span className="tag tag-varg">Brihat Parashara Hora Shastra & Saravali</span>
            </div>
            <div className="domains-grid">
              {book.classicalYogas.map((y) => (
                <article key={y.id} className="domain-card">
                  <div className="domain-top">
                    <div>
                      <h4>{isHi ? y.nameHi : y.name}</h4>
                      <div className="muted small-text">
                        {y.category} · {y.source}
                      </div>
                    </div>
                    <span className="tag tag-varg">{y.strength}</span>
                  </div>
                  <div className="pred-bullets" style={{ marginTop: 6 }}>
                    <div>
                      <strong>{isHi ? 'शास्त्रीय नियम:' : 'Rule:'}</strong>{' '}
                      <span className="muted">{y.conditionEn}</span>
                    </div>
                    <p className="lead-text" style={{ fontSize: '0.86rem', marginTop: 4 }}>
                      {isHi ? y.resultHi : y.resultEn}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Bhrigu Saral Paddhati (BSP) */}
          <section className="panel">
            <div className="panel-header">
              <h3>
                <Clock size={15} />{' '}
                {isHi
                  ? `भृगु सरल पद्धति (BSP — वर्तमान आयु ${book.bhriguSaralPaddhati.currentAge} वर्ष)`
                  : `Bhrigu Saral Paddhati (BSP — Running Age ${book.bhriguSaralPaddhati.currentAge} Yrs)`}
              </h3>
              <span className="tag tag-karaka">
                {isHi
                  ? `12-वर्षीय सक्रिय भाव: ${book.bhriguSaralPaddhati.cyclical12YearReading.cyclicalHouse}`
                  : `Active Cycle House: H${book.bhriguSaralPaddhati.cyclical12YearReading.cyclicalHouse}`}
              </span>
            </div>
            <div className="gochar-banner is-info">
              {isHi
                ? book.bhriguSaralPaddhati.cyclical12YearReading.synthesisHi
                : book.bhriguSaralPaddhati.cyclical12YearReading.synthesisEn}
            </div>
            <div className="panel-subblock">
              <h4>{isHi ? 'सक्रिय भृगु फलित सूत्र:' : 'Active Bhrigu Predictive Rules:'}</h4>
              <div className="domains-grid">
                {book.bhriguSaralPaddhati.activeSpecificTriggers.map((trig) => (
                  <article key={`${trig.age}-${trig.ruleCode}`} className="domain-card">
                    <div className="domain-top">
                      <h4>{trig.ruleCode} · {isHi ? trig.triggerThemeHi : trig.triggerThemeEn}</h4>
                      <span className="tag tag-karaka">{trig.age} Yrs</span>
                    </div>
                    <p className="lead-text" style={{ fontSize: '0.85rem', marginTop: 4 }}>
                      {isHi ? trig.readingHi : trig.readingEn}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* KP 4-Step Event Fructification */}
          <section className="panel">
            <div className="panel-header">
              <h3>
                <Award size={15} />{' '}
                {isHi
                  ? 'के.पी. 4-चरणीय सिद्धांत द्वारा 8 प्रमुख जीवन घटनाओं की फल सिद्धि'
                  : 'KP 4-Step Theory — 8 Core Life Events Fructification Audit'}
              </h3>
            </div>
            <div className="domains-grid">
              {book.kpFourStep.eventPromises.map((ev) => (
                <article key={ev.relevantCusp} className="domain-card">
                  <div className="domain-top">
                    <div>
                      <h4>{isHi ? ev.eventNameHi : ev.eventNameEn}</h4>
                      <div className="muted small-text">
                        {isHi ? `भाव ${ev.relevantCusp} उप-स्वामी:` : `Cusp ${ev.relevantCusp} Sub Lord:`} <strong>{ev.cuspSubLord}</strong>
                      </div>
                    </div>
                    <span className={`tag ${ev.fructificationPromise === 'Highly Favorable' ? 'tag-varg' : 'tag-karaka'}`}>
                      {isHi ? ev.fructificationPromiseHi : ev.fructificationPromise}
                    </span>
                  </div>
                  <p className="lead-text" style={{ fontSize: '0.84rem', marginTop: 4 }}>
                    {isHi ? ev.analysisHi : ev.analysisEn}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* Lal Kitab 1952 Authentic Karmic Debts */}
          <section className="panel">
            <div className="panel-header">
              <h3>
                <ShieldAlert size={15} />{' '}
                {isHi
                  ? 'लाल किताब 6 प्राचीन कर्मिक ऋण (Karmic Debts / Rin) एवं अचूक उपाय'
                  : 'Lal Kitab 6 Ancient Karmic Debts (Rin) & Remedial Measures'}
              </h3>
            </div>
            <div className="domains-grid">
              {book.lalKitab.karmicDebts.map((deb) => (
                <article key={deb.debtType} className="domain-card">
                  <div className="domain-top">
                    <h4>{isHi ? deb.debtTypeHi : deb.debtType}</h4>
                    <span className={`tag ${deb.isTriggered ? 'tag-combust' : 'tag-varg'}`}>
                      {deb.isTriggered ? (isHi ? 'सक्रिय' : 'Active') : (isHi ? 'मुक्त' : 'Clear')}
                    </span>
                  </div>
                  <div className="pred-bullets" style={{ marginTop: 4 }}>
                    <div><strong>{isHi ? 'कारण:' : 'Cause:'}</strong> {isHi ? deb.classicalCauseHi : deb.classicalCauseEn}</div>
                    <div><strong>{isHi ? 'उपाय:' : 'Upay:'}</strong> {isHi ? deb.remedialProtocolHi : deb.remedialProtocolEn}</div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export const PatrikaBookFullPrintEdition: React.FC<{
  chart: ChartData;
  chartStyle: ChartStyle;
  report: PredictionReport;
  language: 'en' | 'hi';
}> = ({ chart, chartStyle, report, language }) => {
  const isHi = language === 'hi';
  const [edition, setEdition] = useState<'complete' | 'concise'>('complete');
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const book: PatrikaBookData = useMemo(
    () => computePatrikaBookData(chart, todayStr, report),
    [chart, todayStr, report]
  );

  const toBadges = (id: keyof ChartData['divisionalCharts']) =>
    chart.divisionalCharts[id].placements.map((p) => ({
      id: p.id,
      label: trPlanetShort(p.id, language),
      signIndex: p.signIndex,
      isLagna: p.id === 'Asc',
      isRetrograde: p.isRetrograde,
      isCombust: p.isCombust,
      dignity: p.dignity,
    }));

  const tocPart1 = isHi
    ? [
        '01. जन्म एवं स्थान विवरण', '02. पंचांग विवरण (संवत्सर, तिथि, योग)', '03. अवकहड़ा चक्र',
        '04. घातक चक्र', '05. अनुकूल बिंदु (Lucky Points)', '06. चर व स्थिर कारक (जैमिनी)',
        '07. उपग्रह (धूम, व्यतिपात, काल, मृत्यु)', '08. विशेष लग्न व संवेदनशील बिंदु', '09. जैमिनी आरुढ़ पद (AL–UL)',
        '10. पंचधा मैत्री चक्र', '11. ग्रह स्पष्ट व षोडशवर्ग तालिका', '12. लग्न, नवांश एवं भाव चलित कुंडली',
        '13. षोडशवर्ग कुंडलियाँ (16 चार्ट) व उच्च वर्ग (D64–D360)', '14. विंशोत्तरी व योगिनी दशा सारणी', '15. विंशोपक व वैशेषिकांश बल',
      ]
    : [
        '01. Birth Details & Horoscope Header', '02. Panchanga Details (Samvatsara–Karana)', '03. Avakahada Chakra',
        '04. Ghata Chakra (Ghatak Triggers)', '05. Lucky Points & Favourable Colors', '06. Jaimini Chara Karakas',
        '07. Upagrahas (Kaala to Upaketu)', '08. Special Lagnas & Sphutas', '09. Jaimini Arudhas (AL–UL)',
        '10. Naisargika, Tatkalika & Panchadha Maitri', '11. Planetary Positions & Cusps', '12. Rasi, Bhava Chalit & Navamsa Charts',
        '13. All 16 Shodashavargas & Micro D64–D360', '14. Vimshottari & Yogini Dasha Tables', '15. Vimshopaka & Vaiseshikamsha',
      ];

  const tocPart2 = isHi
    ? [
        '16. षोडशवर्ग देवता विश्लेषण', '17. ग्रह व भाव शक्ति (Shadbala)', '18. सर्वाष्टकवर्ग (337), शोधन व शोध्य पिंड',
        '19. सप्त जीवन क्षेत्र व विपरीत भाव संतुलन', '20. नवग्रह अवस्था एवं ज्योतिषीय व्याख्या', '21. ग्रह दृष्टि सारणी',
        '22. दशा सपोर्ट इंडेक्स (-100 से +100)', '23. वर्तमान व आगामी अंतरदशा तुलना', '24. मंगल, कालसर्प, पितृ व अन्य दोष',
        '25. पुत्र शाप व परिवर्तन योग जांच', '26. राजयोग, पुरुषार्थ व इष्ट देवता', '27. रत्न वर्गीकरण एवं रुद्राक्ष विधि',
        '28. पंचांग फल, लग्न संपूर्ण व द्वादश भाव अध्याय', '29. वर्ग लग्न फलादेश (D2, D3, D12, D30)', '30. राहु व केतु नक्षत्र विशेष फल',
        '31. विंशोत्तरी व योगिनी दशा फलादेश', '32. 10-वर्षीय प्रमुख गोचर व साढ़ेसाती', '33. विशेष बिंदु (Indu, Yogi, BB) फलादेश',
      ]
    : [
        '16. Shodasha Varga Deities (D1–D60)', '17. Shadbala & House Strength Ranking', '18. SAV (337), Shodhana & Sodhya Pinda',
        '19. 7 Life-Area Composite & Axis Balance', '20. Planetary Avasthas & Interpretation', '21. Graha Drishti & House Aspects',
        '22. Dasha Support Index (-100 to +100)', '23. Active & Upcoming Antardashas', '24. Doshas & Manglik (Lagna/Moon/Venus)',
        '25. Putra Shaapa & Parivartana Yogas', '26. Yogas, Purushartha & Ishta Devata', '27. 4-Tier Gemstones & Rudraksha Protocol',
        '28. Master Horoscope: Panchanga, Lagna & 12 Houses', '29. Ascendant Divisional Readings (D2–D30)', '30. Rahu & Ketu Nakshatra Readings',
        '31. Vimshottari & Yogini Narrative Forecast', '32. 10-Year Gochar & Saturn Cycles', '33. Special Points Narrative & Disclaimer',
      ];

  return (
    <div className="view-stack">
      {/* Edition Mode Toggle (No-Print) */}
      <div className="patrika-edition-bar no-print">
        <span className="label-muted">
          <FileText size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          {isHi ? 'पत्रिका मुद्रण स्तर:' : 'Print Book Edition Depth:'}
        </span>
        <div className="subtab-bar">
          <button
            type="button"
            className={`subtab-btn ${edition === 'complete' ? 'is-active' : ''}`}
            onClick={() => setEdition('complete')}
          >
            {isHi ? 'पूर्ण 34-अध्याय महाग्रंथ (Recommended PDF)' : 'Complete 34-Chapter Book (Recommended)'}
          </button>
          <button
            type="button"
            className={`subtab-btn ${edition === 'concise' ? 'is-active' : ''}`}
            onClick={() => setEdition('concise')}
          >
            {isHi ? 'संक्षिप्त सार (मुख्य अध्याय)' : 'Concise Summary Edition'}
          </button>
        </div>
      </div>

      {/* TABLE OF CONTENTS (OnlineJyotish Pages 2-3 Style) */}
      <div className="print-page-break" />
      <section className="panel patrika-toc-panel">
        <div className="panel-header patrika-chapter-head">
          <h3>{isHi ? 'अनुक्रमणिका — बृहत् जन्म पत्रिका (अध्याय 01–33)' : 'Table of Contents — Comprehensive Janmakundali Book'}</h3>
          <span className="tag tag-karaka">{chart.input.name}</span>
        </div>
        <div className="patrika-toc-grid">
          <div className="patrika-toc-col">
            <h4>{isHi ? 'भाग I: गणित, कुंडलियाँ एवं वर्ग चक्र (01–15)' : 'Part I: Calculations, Vargas & Chakras (01–15)'}</h4>
            <ol>
              {tocPart1.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
          <div className="patrika-toc-col">
            <h4>{isHi ? 'भाग II: फलादेश, दोष, रत्न व दशा-गोचर (16–33)' : 'Part II: Predictions, Doshas, Gems & Gochar (16–33)'}</h4>
            <ol>
              {tocPart2.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* PART I EXTENDED: Panchanga Calendar Meta, Jaimini Karakas/Arudhas, Upagrahas, Special Points, Sripati Cusps & Maitri */}
      <section className="panel">
        <div className="panel-header patrika-chapter-head">
          <h3>{isHi ? 'अध्याय 02–09: हिंदू संवत्सर पंचांग, जैमिनी कारक/आरुढ़, उपग्रह व विशेष लग्न' : 'Ch 02–09: Extended Panchanga, Jaimini Karakas/Arudhas, Upagrahas & Special Points'}</h3>
        </div>
        <div className="two-col-split-pad">
          <table className="data-table">
            <thead>
              <tr>
                <th colSpan={2}>{isHi ? 'संवत्सर एवं जन्म समय विवरण' : 'Eras, Ayana & Yogas'}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Vikram / Shaka / Kaliyuga</td><td className="mono">{book.panchangaMeta.vikramSamvat} / {book.panchangaMeta.shakaSamvat} / {book.panchangaMeta.kaliyugaYear}</td></tr>
              <tr><td>{isHi ? 'संवत्सर / ऋतु / मास' : 'Samvatsara / Ritu / Masa'}</td><td><strong>{isHi ? `${book.panchangaMeta.samvatsaraHi} · ${book.panchangaMeta.rituHi} · ${book.panchangaMeta.masaHi}` : `${book.panchangaMeta.samvatsaraEn} · ${book.panchangaMeta.rituEn} · ${book.panchangaMeta.masaEn}`}</strong></td></tr>
              <tr><td>{isHi ? 'अयन / दिनमान' : 'Ayana / Day Duration'}</td><td>{isHi ? book.panchangaMeta.ayanaHi : book.panchangaMeta.ayanaEn} · {book.panchangaMeta.dayDuration}</td></tr>
              <tr><td>{isHi ? 'योगिनी दशा शेष' : 'Yogini Dasha Balance'}</td><td><strong>{isHi ? book.panchangaMeta.yoginiBirthBalanceHi : book.panchangaMeta.yoginiBirthBalanceEn}</strong></td></tr>
            </tbody>
          </table>

          <table className="data-table">
            <thead>
              <tr>
                <th>{isHi ? 'जैमिनी कारक व आरुढ़' : 'Jaimini Karakas & Arudha Padas'}</th>
                <th>{isHi ? 'स्थिति' : 'Sign / Planet'}</th>
              </tr>
            </thead>
            <tbody>
              {chart.planets.filter((p) => p.charaKaraka).map((p) => (
                <tr key={p.id}>
                  <td>{p.charaKaraka} ({planetTxt(p.id, language)})</td>
                  <td>{signTxt(p.signIndex, language)} · {p.shortDms}</td>
                </tr>
              ))}
              {book.jaiminiExtended.arudhaPadas.slice(0, 4).map((ap) => (
                <tr key={ap.label}>
                  <td>Arudha {ap.label} (H{ap.house})</td>
                  <td>{signTxt(ap.signIndex, language)} (H{ap.houseFromLagna})</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel-subblock">
          <h4>{isHi ? 'विशेष लग्न व सूक्ष्म बिंदु सारणी' : 'Special Lagnas, Upagrahas & Sphuta Summary'}</h4>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isHi ? 'बिंदु' : 'Point'}</th>
                  <th>{isHi ? 'राशि व भाव' : 'Sign & House'}</th>
                  <th>{isHi ? 'अंश / विवरण' : 'Degree & Key'}</th>
                </tr>
              </thead>
              <tbody>
                {book.specialPoints.map((sp) => (
                  <tr key={sp.id}>
                    <td><strong>{isHi ? sp.nameHi : sp.nameEn}</strong></td>
                    <td>{signTxt(sp.signIndex, language)} · H{sp.house}</td>
                    <td className="mono">{sp.dms} · {isHi ? sp.extraHi : sp.extraEn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PART I: All 16 Shodashavargas + Vaiseshikamsha + Higher Vargas Summary */}
      {edition === 'complete' && (
        <>
          <div className="print-page-break" />
          <section className="panel">
            <div className="panel-header patrika-chapter-head">
              <h3>{isHi ? 'अध्याय 13: संपूर्ण षोडशवर्ग कुंडलियाँ (D1–D60) एवं नित्य वर्ग' : 'Ch 13: Complete Shodashavarga Charts (D1–D60)'}</h3>
            </div>
            <div className="patrika-varga-grid-print">
              {SHODASHA_VARGAS_LIST.filter((v) =>
                ['D2', 'D3', 'D4', 'D7', 'D12', 'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'].includes(v.id)
              ).map((vm) => (
                <VedicChartSvg
                  key={vm.id}
                  title={`${vm.id} ${isHi ? vm.nameHi : vm.nameEn}`}
                  style={chartStyle}
                  lagnaSignIndex={chart.divisionalCharts[vm.id].lagnaSignIndex}
                  items={toBadges(vm.id)}
                  showDownload={false}
                  centerLabel={vm.id}
                />
              ))}
            </div>
          </section>

          <div className="print-page-break" />
          <section className="panel">
            <div className="panel-header patrika-chapter-head">
              <h3>{isHi ? 'अध्याय 15–16: षोडशवर्ग देवता, वैशेषिकांश एवं उच्च सूक्ष्म वर्ग (D64–D360)' : 'Ch 15–16: Shodasha Varga Deities, Vaiseshikamsha & Higher Micro Vargas (D64–D360)'}</h3>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                    <th>{isHi ? 'शुभ वर्ग (16 में से)' : 'Own/Exalted Count'}</th>
                    <th>{isHi ? 'वैशेषिकांश पदवी' : 'Vaiseshikamsha Title'}</th>
                    <th>{isHi ? 'विंशोपक (20)' : 'Vimshopaka'}</th>
                    <th>{isHi ? 'प्रबल वर्ग' : 'Strong Vargas'}</th>
                  </tr>
                </thead>
                <tbody>
                  {book.vaiseshikamsha.map((v) => (
                    <tr key={v.planet}>
                      <td><strong>{planetTxt(v.planet, language)}</strong></td>
                      <td className="mono">{v.strongCount}</td>
                      <td><span className="tag tag-varg">{isHi ? v.titleHi : v.titleEn}</span></td>
                      <td className="mono">{v.vimshopakaScore.toFixed(2)}</td>
                      <td className="small-text">{v.vargaIdsStrong.join(', ') || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="panel-subblock">
              <h4>{isHi ? 'नवांश/षोडशवर्ग के आगे उच्च नाड़ी वर्ग (D108, D150 व D360 सारांश)' : 'Higher Nadi & Micro Divisional Positions (D108, D150, D360)'}</h4>
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{isHi ? 'उच्च वर्ग' : 'Micro Varga'}</th>
                      <th>{isHi ? 'लग्न' : 'Lagna'}</th>
                      {SEVEN_PLANETS.map((p) => <th key={p}>{trPlanetShort(p, language)}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {(['D64', 'D81', 'D108', 'D150', 'D360'] as const).map((hid) => {
                      const hv = book.panchangaMeta.higherVargas[hid];
                      return (
                        <tr key={hid}>
                          <td><strong>{hid}</strong></td>
                          <td>{signTxt(hv.lagnaSignIndex, language)}</td>
                          {SEVEN_PLANETS.map((p) => {
                            const pl = hv.placements.find((x) => x.id === p)!;
                            return <td key={p}>{signTxt(pl.vargaSignIndex, language).slice(0, 3)} (#{pl.amsaNumber})</td>;
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Sripati Bhava Cusps + Panchadha Maitri */}
          <section className="panel">
            <div className="panel-header patrika-chapter-head">
              <h3>{isHi ? 'अध्याय 10–11: श्रीपति भाव संधि एवं पंचधा मैत्री चक्र' : 'Ch 10–11: Sripati Bhava Cusps (Arambha/Madhya/Antya) & Panchadha Maitri'}</h3>
            </div>
            <div className="two-col-split-pad">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{isHi ? 'भाव' : 'House'}</th>
                    <th>{isHi ? 'संधि (प्रारंभ)' : 'Bhava Start'}</th>
                    <th>{isHi ? 'भाव मध्य' : 'Bhava Madhya'}</th>
                  </tr>
                </thead>
                <tbody>
                  {chart.houses.map((h) => (
                    <tr key={h.house}>
                      <td className="mono">H{h.house}</td>
                      <td className="mono">{Math.floor(h.start / 30) >= 0 ? signTxt(Math.floor(h.start / 30) % 12, language).slice(0, 3) : ''} {(h.start % 30).toFixed(2)}°</td>
                      <td className="mono">{signTxt(h.signIndex, language).slice(0, 3)} {h.dms}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Maitri</th>
                    {SEVEN_PLANETS.map((p) => <th key={p}>{trPlanetShort(p, language)}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {SEVEN_PLANETS.map((p1) => (
                    <tr key={p1}>
                      <td><strong>{trPlanetShort(p1, language)}</strong></td>
                      {SEVEN_PLANETS.map((p2) => (
                        <td key={p2} className="small-text">
                          {p1 === p2 ? '—' : chart.maitriMatrix[p1][p2].slice(0, 4)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* PART II: SAV Shodhana, Sodhya Pinda, Avasthas, Dasha Support Index, Life Purpose (only when not Paramayus-locked) */}
      {!report.paramayus.exceeded && (
        <>
          <div className="print-page-break" />
          <section className="panel">
            <div className="panel-header patrika-chapter-head">
              <h3>{isHi ? 'अध्याय 18–20: सर्वाष्टकवर्ग शोधन, शोध्य पिंड, जीवन क्षेत्र एवं नवग्रह अवस्था व्याख्या' : 'Ch 18–20: SAV Shodhana Retention, Sodhya Pinda & 9 Planetary Avasthas'}</h3>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                    <th>Raw</th>
                    <th>Trikona</th>
                    <th>Shodhita</th>
                    <th>Ret%</th>
                    <th>Rasi Pinda</th>
                    <th>Graha Pinda</th>
                    <th>Sodhya Pinda</th>
                  </tr>
                </thead>
                <tbody>
                  {book.savAnalysis.shodhana.map((s) => (
                    <tr key={s.planet}>
                      <td><strong>{planetTxt(s.planet, language)}</strong></td>
                      <td className="mono">{s.rawTotal}</td>
                      <td className="mono">{s.afterTrikona}</td>
                      <td className="mono">{s.shodhitaTotal}</td>
                      <td className="mono">{s.retentionPct}%</td>
                      <td className="mono">{s.rasiPinda}</td>
                      <td className="mono">{s.grahaPinda}</td>
                      <td><strong>{s.sodhyaPinda}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="panel-subblock">
              <h4>{isHi ? 'नवग्रह अवस्था एवं ज्योतिषीय फलादेश' : 'Planetary Avasthas & Astrologer Interpretation'}</h4>
              <div className="pred-bullets">
                {book.avasthaNarratives.map((av) => (
                  <div key={av.planet}>
                    <strong>{planetTxt(av.planet, language)} ({isHi ? `${av.baladiHi}, ${av.lajjitadiHi}, ${av.sayanadiHi}` : `${av.baladiEn.split(' (')[0]}, ${av.lajjitadiEn.split(' (')[0]}, ${av.sayanadiEn.split(' (')[0]}`}):</strong>{' '}
                    {isHi ? av.interpretationHi : av.interpretationEn}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header patrika-chapter-head">
              <h3>{isHi ? 'अध्याय 22–23: दशा सपोर्ट इंडेक्स (-100..+100), अंतरदशा तुलना व योगिनी दशा' : 'Ch 22–23: Dasha Support Index (-100..+100), Antardashas & Yogini Cycles'}</h3>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                    <th>Int</th>
                    <th>Eff</th>
                    <th>Love</th>
                    <th>Hlth</th>
                    <th>Soc</th>
                    <th>Car</th>
                    <th>Fin</th>
                    <th>{isHi ? 'औसत' : 'Avg'}</th>
                  </tr>
                </thead>
                <tbody>
                  {book.dashaSupportIndex.rows.map((r) => (
                    <tr key={r.planet}>
                      <td><strong>{planetTxt(r.planet, language)}</strong></td>
                      <td className="mono">{r.intelligence}</td>
                      <td className="mono">{r.efficiency}</td>
                      <td className="mono">{r.loveFamily}</td>
                      <td className="mono">{r.health}</td>
                      <td className="mono">{r.social}</td>
                      <td className="mono">{r.career}</td>
                      <td className="mono">{r.finance}</td>
                      <td><strong>{r.average}</strong> ({isHi ? r.verdictHi : r.verdictEn})</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {edition === 'complete' && (
              <div className="two-col-split-pad">
                <table className="data-table">
                  <thead>
                    <tr><th colSpan={3}>{isHi ? 'सक्रिय/आगामी अंतरदशा' : 'Active/Upcoming Antardashas'}</th></tr>
                  </thead>
                  <tbody>
                    {book.dashaSupportIndex.activeAntardashas.map((ad, i) => (
                      <tr key={i} className={ad.isCurrent ? 'active-row' : ''}>
                        <td><strong>{planetTxt(ad.lord, language)}</strong></td>
                        <td className="mono">{ad.startDmy} → {ad.endDmy}</td>
                        <td>{ad.focusScore > 0 ? `+${ad.focusScore}` : ad.focusScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <table className="data-table">
                  <thead>
                    <tr><th colSpan={3}>{isHi ? 'योगिनी दशा चक्र (36 वर्ष)' : 'Yogini Dasha Life Cycles'}</th></tr>
                  </thead>
                  <tbody>
                    {book.dashaSupportIndex.yoginiPeriods.map((yp, i) => (
                      <tr key={i} className={yp.isCurrent ? 'active-row' : ''}>
                        <td><strong>{yp.yogini}</strong> ({planetTxt(yp.lord, language)})</td>
                        <td className="mono">{yp.startDmy} → {yp.endDmy}</td>
                        <td className="mono">{yp.years}y</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Ch 24-27: Putra Shaapa, Mangal 3-Ref, Purushartha, Ishta, 4-Tier Gems */}
          <section className="panel">
            <div className="panel-header patrika-chapter-head">
              <h3>{isHi ? 'अध्याय 24–27: मांगलिक (3 आधार), पुत्र शाप, पुरुषार्थ एवं रत्न वर्गीकरण' : 'Ch 24–27: Manglik (Lagna/Moon/Venus), Putra Shaapa, Purpose & Gem Matrix'}</h3>
            </div>
            <div className="pred-card-body">
              <div className="pred-bullets">
                <div>
                  <strong>{isHi ? 'मांगलिक परीक्षण (लग्न/चंद्र/शुक्र):' : 'Manglik Check (Lagna / Moon / Venus):'}</strong>{' '}
                  {isHi ? `लग्न: ${book.doshasAndGems.manglikLagna ? 'हाँ' : 'नहीं'}, चंद्र: ${book.doshasAndGems.manglikMoon ? 'हाँ' : 'नहीं'}, शुक्र: ${book.doshasAndGems.manglikVenus ? 'हाँ' : 'नहीं'}.` : `Lagna: ${book.doshasAndGems.manglikLagna ? 'Yes' : 'No'}, Moon: ${book.doshasAndGems.manglikMoon ? 'Yes' : 'No'}, Venus: ${book.doshasAndGems.manglikVenus ? 'Yes' : 'No'}.`}{' '}
                  {(isHi ? book.doshasAndGems.manglikMitigationsHi : book.doshasAndGems.manglikMitigationsEn).join(' ')}
                </div>
                <div>
                  <strong>{isHi ? 'पुत्र शाप जांच:' : 'Putra Shaapa Check:'}</strong>{' '}
                  {isHi ? `${book.doshasAndGems.putraShaapa.statusHi} — ${book.doshasAndGems.putraShaapa.detailHi}` : `${book.doshasAndGems.putraShaapa.statusEn} — ${book.doshasAndGems.putraShaapa.detailEn}`}
                </div>
                <div>
                  <strong>{isHi ? 'इष्टदेव एवं मोक्ष सूचकांक:' : 'Ishta Devata, Purushartha & Moksha Index:'}</strong>{' '}
                  {isHi ? `${book.jaiminiExtended.ishtaDevataFormHi} · मोक्ष सूचकांक ${book.jaiminiExtended.mokshaIndexPct}%` : `${book.jaiminiExtended.ishtaDevataFormEn} · Moksha Index ${book.jaiminiExtended.mokshaIndexPct}%`} (Dharma {book.jaiminiExtended.purushartha.dharma}% / Artha {book.jaiminiExtended.purushartha.artha}% / Kama {book.jaiminiExtended.purushartha.kama}% / Moksha {book.jaiminiExtended.purushartha.moksha}%)
                </div>
                {book.doshasAndGems.parivartana.length > 0 && (
                  <div>
                    <strong>{isHi ? 'परिवर्तन योग:' : 'Parivartana Yogas:'}</strong>{' '}
                    {book.doshasAndGems.parivartana.map((pv) => (isHi ? `${pv.typeHi}: ${pv.noteHi}` : `${pv.typeEn}: ${pv.noteEn}`)).join(' | ')}
                  </div>
                )}
              </div>
              <div className="table-scroll" style={{ marginTop: 10 }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                      <th>{isHi ? 'रत्न' : 'Gem'}</th>
                      <th>{isHi ? 'उपयुक्तता' : 'Recommendation Tier'}</th>
                      <th>{isHi ? 'विश्लेषण' : 'Reasoning'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {book.doshasAndGems.gemTiers.map((g) => (
                      <tr key={g.planet}>
                        <td><strong>{planetTxt(g.planet, language)}</strong></td>
                        <td>{isHi ? g.gemHi : g.gemEn}</td>
                        <td><span className={`tag ${tierBadgeClass(g.tier)}`}>{isHi ? g.tierHi : g.tier}</span></td>
                        <td className="wrap-cell">{isHi ? g.reasonHi : g.reasonEn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* CH 28: MASTER HOROSCOPE PREDICTIONS (Panchanga Phal + Lagna 6-Part + 12 Houses Book) */}
          <div className="print-page-break" />
          <section className="panel">
            <div className="panel-header patrika-chapter-head">
              <h3>{isHi ? 'अध्याय 28: बृहत् फलादेश — पंचांग फल एवं लग्न संपूर्ण विश्लेषण' : 'Ch 28: Master Horoscope Predictions — Panchanga Phal & Lagna Complete Analysis'}</h3>
            </div>
            <div className="pred-card-body">
              <p className="lead-text">{isHi ? book.horoscopeChapters.panchangaPhalHi : book.horoscopeChapters.panchangaPhalEn}</p>
              <div className="pred-bullets" style={{ marginTop: 10 }}>
                {book.horoscopeChapters.lagnaSections.map((ls, idx) => (
                  <div key={idx}>
                    <strong>{isHi ? ls.titleHi : ls.titleEn}:</strong> {isHi ? ls.bodyHi : ls.bodyEn}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {edition === 'complete' && book.horoscopeChapters.houseChapters.map((hc) => (
            <section key={hc.houseNumber} className="panel patrika-chapter-panel">
              <div className="panel-header patrika-chapter-head">
                <h3>{isHi ? `अध्याय 28.${hc.houseNumber}: ${hc.titleHi}` : `Ch 28.${hc.houseNumber}: ${hc.titleEn}`}</h3>
                <span className="tag tag-karaka">{signTxt(hc.signIndex, language)} · SAV {hc.savBindus} · {hc.score}/100</span>
              </div>
              <div className="pred-card-body">
                <div className="pred-bullets">
                  <div><strong>{isHi ? 'भावस्थ राशि:' : 'Sign in House:'}</strong> {isHi ? hc.signResultHi : hc.signResultEn}</div>
                  <div><strong>{isHi ? 'ग्रह दृष्टि:' : 'Aspects on House:'}</strong> {isHi ? hc.aspectsResultHi : hc.aspectsResultEn}</div>
                  <div><strong>{isHi ? 'भावेश फल:' : 'Lord Placement:'}</strong> {isHi ? hc.lordResultHi : hc.lordResultEn}</div>
                  <div><strong>{isHi ? hc.topicHeadingHi : hc.topicHeadingEn}:</strong> {isHi ? hc.topicReadingHi : hc.topicReadingEn}</div>
                  <div><strong>{isHi ? 'ग्रह व सलाह:' : 'Planets & Advice:'}</strong> {isHi ? hc.occupantsAdviceHi : hc.occupantsAdviceEn}</div>
                  <div><strong>{isHi ? 'उपाय:' : 'Remedies:'}</strong> {isHi ? hc.remediesHi : hc.remediesEn}</div>
                </div>
              </div>
            </section>
          ))}

          {/* CH 29-33: Rahu-Ketu Nakshatra, 10-Yr Gochar, Special Points & Disclaimer */}
          <div className="print-page-break" />
          <section className="panel">
            <div className="panel-header patrika-chapter-head">
              <h3>{isHi ? 'अध्याय 29–33: राहु-केतु नक्षत्र, 10-वर्षीय गोचर व विशेष बिंदु फलादेश' : 'Ch 29–33: Rahu–Ketu Nakshatra, 10-Year Gochar & Special Point Readings'}</h3>
            </div>
            <div className="pred-card-body">
              <div className="pred-bullets">
                <div>
                  <strong>{isHi ? `राहु (${book.horoscopeChapters.rahuKetuNakshatra.rahuNakshatra}):` : `Rahu (${book.horoscopeChapters.rahuKetuNakshatra.rahuNakshatra}):`}</strong>{' '}
                  {isHi ? book.horoscopeChapters.rahuKetuNakshatra.rahuReadingHi : book.horoscopeChapters.rahuKetuNakshatra.rahuReadingEn}
                </div>
                <div>
                  <strong>{isHi ? `केतु (${book.horoscopeChapters.rahuKetuNakshatra.ketuNakshatra}):` : `Ketu (${book.horoscopeChapters.rahuKetuNakshatra.ketuNakshatra}):`}</strong>{' '}
                  {isHi ? book.horoscopeChapters.rahuKetuNakshatra.ketuReadingHi : book.horoscopeChapters.rahuKetuNakshatra.ketuReadingEn}
                </div>
              </div>

              {edition === 'complete' && (
                <>
                  <h4 style={{ marginTop: 14, marginBottom: 6 }}>{isHi ? 'विशेष बिंदु फलादेश' : 'Special Lagnas & Sensitive Point Interpretations'}</h4>
                  <div className="pred-bullets">
                    {book.specialPoints.map((sp) => (
                      <div key={sp.id}>
                        <strong>{isHi ? sp.nameHi : sp.nameEn} ({signTxt(sp.signIndex, language)} · H{sp.house}):</strong>{' '}
                        {isHi ? sp.readingHi : sp.readingEn}
                      </div>
                    ))}
                  </div>

                  <h4 style={{ marginTop: 14, marginBottom: 6 }}>{isHi ? 'आगामी 10-वर्षीय गोचर व शनि साढ़ेसाती' : '10-Year Major Gochar & Saturn Sade Sati Outlook'}</h4>
                  <div className="table-scroll">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                          <th>{isHi ? 'तिथि / अवधि' : 'Window'}</th>
                          <th>{isHi ? 'प्रभाव' : 'Phase & Summary'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {book.horoscopeChapters.gochar10Years.map((g, i) => (
                          <tr key={i}>
                            <td><strong>{g.planet}</strong></td>
                            <td className="mono">{g.dateRange}</td>
                            <td className="wrap-cell"><strong>{g.signName} ({g.phaseTag}):</strong> {isHi ? g.readingHi : g.readingEn}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* CH 34: 300+ CLASSICAL YOGAS, BHRIGU SARAL PADDHATI, KP 4-STEP & LAL KITAB */}
          <div className="print-page-break" />
          <section className="panel">
            <div className="panel-header patrika-chapter-head">
              <h3>{isHi ? 'अध्याय 34: शास्त्रीय वैदिक योग (300+), भृगु सरल पद्धति, केपी 4-चरण व लाल किताब ऋण' : 'Ch 34: 300+ Classical Yogas, Bhrigu Saral Paddhati, KP 4-Step & Lal Kitab Heritage'}</h3>
            </div>
            <div className="pred-card-body">
              <h4 style={{ marginBottom: 6 }}>
                {isHi
                  ? `कुंडली में सक्रिय प्रमुख शास्त्रीय योग (${book.classicalYogas.length} योग सक्रिय):`
                  : `Active Classical Yogas in Native's Chart (${book.classicalYogas.length} Active Yogas):`}
              </h4>
              <div className="domains-grid">
                {book.classicalYogas.map((y) => (
                  <article key={y.id} className="domain-card" style={{ borderLeft: '3px solid var(--accent)' }}>
                    <div className="domain-top">
                      <div>
                        <h4>{isHi ? y.nameHi : y.name}</h4>
                        <div className="muted small-text">{y.category} · {y.source}</div>
                      </div>
                      <span className="tag tag-varg">{y.strength}</span>
                    </div>
                    <div className="pred-bullets" style={{ marginTop: 4 }}>
                      <div><strong>{isHi ? 'नियम:' : 'Rule:'}</strong> {y.conditionEn}</div>
                      <p className="lead-text" style={{ fontSize: '0.84rem' }}>{isHi ? y.resultHi : y.resultEn}</p>
                    </div>
                  </article>
                ))}
              </div>

              <h4 style={{ marginTop: 14, marginBottom: 6 }}>
                {isHi
                  ? `भृगु सरल पद्धति (आयु ${book.bhriguSaralPaddhati.currentAge} वर्ष, 12-वर्षीय चक्र भाव ${book.bhriguSaralPaddhati.cyclical12YearReading.cyclicalHouse}):`
                  : `Bhrigu Saral Paddhati (Running Age ${book.bhriguSaralPaddhati.currentAge} Yrs, Cycle House H${book.bhriguSaralPaddhati.cyclical12YearReading.cyclicalHouse}):`}
              </h4>
              <p className="lead-text">{isHi ? book.bhriguSaralPaddhati.cyclical12YearReading.synthesisHi : book.bhriguSaralPaddhati.cyclical12YearReading.synthesisEn}</p>
              <div className="domains-grid" style={{ marginTop: 8 }}>
                {book.bhriguSaralPaddhati.activeSpecificTriggers.map((trig) => (
                  <article key={`${trig.age}-${trig.ruleCode}`} className="domain-card">
                    <div className="domain-top">
                      <h4>{trig.ruleCode} · {isHi ? trig.triggerThemeHi : trig.triggerThemeEn}</h4>
                      <span className="tag tag-karaka">{trig.age} Yrs</span>
                    </div>
                    <p className="lead-text" style={{ fontSize: '0.84rem' }}>{isHi ? trig.readingHi : trig.readingEn}</p>
                  </article>
                ))}
              </div>

              <h4 style={{ marginTop: 14, marginBottom: 6 }}>
                {isHi ? 'के.पी. 4-चरणीय सिद्धांत द्वारा 8 प्रमुख जीवन घटनाओं की फल सिद्धि:' : 'KP 4-Step Theory — 8 Core Life Events Fructification Audit:'}
              </h4>
              <div className="domains-grid">
                {book.kpFourStep.eventPromises.map((ev) => (
                  <article key={ev.relevantCusp} className="domain-card">
                    <div className="domain-top">
                      <div>
                        <h4>{isHi ? ev.eventNameHi : ev.eventNameEn}</h4>
                        <div className="muted small-text">{isHi ? `भाव ${ev.relevantCusp} उप-स्वामी: ${ev.cuspSubLord}` : `Cusp ${ev.relevantCusp} Sub: ${ev.cuspSubLord}`}</div>
                      </div>
                      <span className={`tag ${ev.fructificationPromise === 'Highly Favorable' ? 'tag-varg' : 'tag-karaka'}`}>
                        {isHi ? ev.fructificationPromiseHi : ev.fructificationPromise}
                      </span>
                    </div>
                    <p className="lead-text" style={{ fontSize: '0.84rem', marginTop: 4 }}>{isHi ? ev.analysisHi : ev.analysisEn}</p>
                  </article>
                ))}
              </div>

              <h4 style={{ marginTop: 14, marginBottom: 6 }}>
                {isHi ? 'लाल किताब 6 प्राचीन कर्मिक ऋण (Rin) एवं शास्त्रोक्त उपाय:' : 'Lal Kitab 6 Ancient Karmic Debts (Rin) & Remedial Measures:'}
              </h4>
              <div className="domains-grid">
                {book.lalKitab.karmicDebts.map((deb) => (
                  <article key={deb.debtType} className="domain-card">
                    <div className="domain-top">
                      <h4>{isHi ? deb.debtTypeHi : deb.debtType}</h4>
                      <span className={`tag ${deb.isTriggered ? 'tag-combust' : 'tag-varg'}`}>
                        {deb.isTriggered ? (isHi ? 'सक्रिय' : 'Active') : (isHi ? 'मुक्त' : 'Clear')}
                      </span>
                    </div>
                    <div className="pred-bullets" style={{ marginTop: 4 }}>
                      <div><strong>{isHi ? 'कारण:' : 'Cause:'}</strong> {isHi ? deb.classicalCauseHi : deb.classicalCauseEn}</div>
                      <div><strong>{isHi ? 'उपाय:' : 'Upay:'}</strong> {isHi ? deb.remedialProtocolHi : deb.remedialProtocolEn}</div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Classical Astrological Disclaimer */}
      <section className="panel patrika-disclaimer-panel">
        <div className="pred-card-body small-text muted">
          <strong>{isHi ? 'वैदिक ज्योतिषीय सूचना (अस्वीकरण):' : 'Astrological Note & Ethical Disclaimer:'}</strong>{' '}
          {isHi
            ? `यह बृहत् जन्म पत्रिका पारंपरिक वैदिक ज्योतिष ग्रंथों (बृहत् पाराशर होरा शास्त्र, फलदीपिका, सारावली एवं जैमिनी सूत्र) के शुद्ध खगोलीय गणनाओं पर आधारित है। ज्योतिष जीवन के अवसरों व सावधानियों का मार्गदर्शन करता है; कर्म, विवेक, स्वास्थ्य व महत्वपूर्ण निर्णयों में सचेत प्रयास सदैव सर्वोपरि रहते हैं। (${formatDateDmy(formatLocalDateTimeFromUtc(Date.now(), chart.offsetMinutesUsed).slice(0, 10))})`
            : `This Vedic Janmakundali report is prepared from high-precision Sidereal planetary ephemeris and classical Parashari / Jaimini / Ashtakavarga principles. Astrology illuminates tendencies, timing windows, and strengths to support mindful action; it is not a substitute for professional medical, legal, or financial counsel.`}
        </div>
      </section>
    </div>
  );
};

export const PredictionsPatrikaFrame: React.FC<{
  chart: ChartData;
  report: PredictionReport;
  children: React.ReactNode;
}> = ({ chart, report, children }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';
  const [viewMode, setViewMode] = useState<'modules' | 'patrika'>('modules');

  return (
    <div className="view-stack">
      <div className="patrika-mode-strip">
        <div className="patrika-mode-left">
          <button
            type="button"
            className={`subtab-btn ${viewMode === 'modules' ? 'is-active' : ''}`}
            onClick={() => setViewMode('modules')}
          >
            {isHi ? 'अध्याय-वार मॉड्यूल (वर्तमान टैब)' : 'Interactive Module View'}
          </button>
          <button
            type="button"
            className={`subtab-btn ${viewMode === 'patrika' ? 'is-active' : ''}`}
            onClick={() => setViewMode('patrika')}
          >
            <BookOpen size={13} />{' '}
            {isHi ? 'संपूर्ण 34-अध्याय पत्रिका ग्रंथ (Sample PDF शैली)' : 'Complete 34-Chapter Horoscope Book (Sample PDF Style)'}
          </button>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => window.dispatchEvent(new CustomEvent('jyotish:open-booklet'))}
        >
          <Printer size={14} /> {isHi ? 'पूर्ण 34-अध्याय PDF प्रिंट / सेव' : 'Open Full 34-Ch Printable PDF'}
        </button>
      </div>

      {viewMode === 'patrika' ? (
        <PatrikaBookInteractivePanel
          chart={chart}
          report={report}
          forecastDate={report.dashaForecast.targetDate}
        />
      ) : (
        children
      )}
    </div>
  );
};
