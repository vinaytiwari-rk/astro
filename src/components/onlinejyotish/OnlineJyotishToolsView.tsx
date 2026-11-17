import React, { useMemo } from 'react';
import {
  Calendar,
  Clock,
  Compass,
  Download,
  FileText,
  Heart,
  MapPin,
  Moon,
  Printer,
  Sparkles,
  Star,
  Sun,
} from 'lucide-react';
import { computeAvakahadaChakra } from '../../astro/avakahadaChalit';
import { calculateChart } from '../../astro/calculator';
import { NINE_GRAHAS, SEVEN_PLANETS, SIGNS } from '../../astro/constants';
import { computeGocharaKakshas } from '../../astro/panchaPakshiAndKaksha';
import { computeDeepGochar } from '../../astro/predictions/gocharDeep';
import { computeGemstoneAndRudraksha } from '../../astro/rashifalBabyRudraksha';
import { formatDateDmy } from '../../astro/time';
import type { BirthInput, CalcSettings, ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet, trSign } from '../../i18n/translations';

export type AstroToolCategory =
  | 'ashtakavarga'
  | 'shadbala'
  | 'transit-today'
  | 'baby-names'
  | 'gemstones'
  | 'choghadiya';

interface OnlineJyotishToolsViewProps {
  tool: AstroToolCategory;
  chart: ChartData;
  activeInput: BirthInput;
  settings: CalcSettings;
  onNavigate: (view: string, sub?: string) => void;
  onOpenBooklet: () => void;
}

export const OnlineJyotishToolsView: React.FC<OnlineJyotishToolsViewProps> = ({
  tool,
  chart,
  activeInput,
  settings,
  onNavigate,
  onOpenBooklet,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const gemstones = useMemo(() => computeGemstoneAndRudraksha(chart), [chart]);
  const gochar = useMemo(() => computeDeepGochar(chart, todayIso), [chart, todayIso]);
  const avakahada = useMemo(() => computeAvakahadaChakra(chart), [chart]);

  const moon = useMemo(() => chart.planets.find((p) => p.id === 'Moon') || chart.ascendant, [chart]);

  const saturnItem = useMemo(() => gochar.items.find((it) => it.planet === 'Saturn'), [gochar]);
  const jupiterItem = useMemo(() => gochar.items.find((it) => it.planet === 'Jupiter'), [gochar]);
  const rahuItem = useMemo(() => gochar.items.find((it) => it.planet === 'Rahu'), [gochar]);
  const ketuItem = useMemo(() => gochar.items.find((it) => it.planet === 'Ketu'), [gochar]);

  const transitChart = useMemo(() => {
    return calculateChart(
      {
        ...activeInput,
        date: todayIso,
        time: '12:00',
      },
      settings
    );
  }, [activeInput, todayIso, settings]);

  const kakshaEntries = useMemo(() => {
    return computeGocharaKakshas(chart, transitChart);
  }, [chart, transitChart]);

  const toolTitles: Record<AstroToolCategory, { titleEn: string; titleHi: string; descEn: string; descHi: string }> = {
    ashtakavarga: {
      titleEn: 'Ashtakavarga Calculator (Bhinnashtakavarga & Samudaya SAV 337)',
      titleHi: 'अष्टकवर्ग सारणी (भिन्नाष्टकवर्ग एवं सर्वाष्टकवर्ग 337 अंक)',
      descEn: 'Planetary Bindus, Rekhas, and house-wise auspicious points benchmarked to classical 337 SAV points.',
      descHi: 'प्रत्येक ग्रह के बिंदु, रेखाएं एवं 12 भावों के सर्वाष्टकवर्ग अंक विश्लेषण।',
    },
    shadbala: {
      titleEn: 'Shadbala Calculator (Six-fold Planetary Strengths)',
      titleHi: 'षड्बल गणना सारणी (स्थान, दिक्, काल, चेष्टा, नैसर्गिक एवं दृग्बल)',
      descEn: 'Comprehensive six-fold planetary strength calculation in Rupas and Virupas based on Brihat Parasara Hora Shastra.',
      descHi: 'महर्षि पाराशर प्रणीत षड्बल के छह अंगों का रूपात्मक एवं विरूपात्मक मूल्यांकन।',
    },
    'transit-today': {
      titleEn: 'Planetary Transits Today (Live Gochar from Natal Moon)',
      titleHi: 'आज का ग्रह गोचर एवं साढ़ेसाती विश्लेषण',
      descEn: 'Real-time positions of Saturn, Jupiter, Rahu, and Ketu evaluated against natal Moon sign with classical remedies.',
      descHi: 'जन्म चंद्र राशि से वर्तमान शनि, गुरु, राहु-केतु का गोचर प्रभाव, साढ़ेसाती चरण एवं शांति उपाय।',
    },
    'baby-names': {
      titleEn: 'Newborn Horoscope & Baby Names (Namakshar Finder)',
      titleHi: 'शिशु नामकरण, नामाक्षर एवं गंडमूल दोष परीक्षण',
      descEn: 'Auspicious birth constellation syllables, Gandamoola Dosha checking, Paya evaluation, and baby naming guidance.',
      descHi: 'जन्म नक्षत्र चरण से शुभ नामाक्षर, गंडमूल दोष विचार, स्वर्ण-रजत-ताम्र-लौह पाया फल एवं नामकरण मार्गदर्शन।',
    },
    gemstones: {
      titleEn: 'Vedic Gemstone & Rudraksha Recommendation Engine',
      titleHi: 'वैदिक रत्न, रुद्राक्ष एवं इष्ट देवता परामर्श',
      descEn: 'Scientifically identified Life Stone, Lucky Stone, Bhagya Stone, and benefic Rudraksha based on Lagna lord dignity.',
      descHi: 'लग्न, पंचम एवं नवम भाव के आधार पर प्राण रत्न, भाग्य रत्न, कारक रुद्राक्ष एवं इष्ट मंत्र परामर्श।',
    },
    choghadiya: {
      titleEn: "Today's Choghadiya & Muhurta Times",
      titleHi: 'दैनिक चौघड़िया मुहूर्त एवं समय सारणी',
      descEn: 'Accurate daytime and nighttime 8 Choghadiya muhurtas calculated from local sunrise and sunset.',
      descHi: 'सूर्योदय से सूर्यास्त एवं सूर्यास्त से सूर्योदय तक दिन व रात के 8-8 चौघड़िया काल।',
    },
  };

  const currentTool = toolTitles[tool] || toolTitles['ashtakavarga'];

  return (
    <div className="oj-page-container">
      {/* Breadcrumb */}
      <nav className="oj-breadcrumbs" aria-label="Breadcrumb">
        <a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
          {isHi ? 'होम' : 'Home'}
        </a>
        <span className="oj-bc-sep">/</span>
        <span>{isHi ? 'ज्योतिषीय कैलकुलेटर' : 'Astrology Tools'}</span>
        <span className="oj-bc-sep">/</span>
        <span className="oj-bc-current">{isHi ? currentTool.titleHi : currentTool.titleEn}</span>
      </nav>

      {/* Header Banner */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          {isHi ? 'प्रामाणिक वैदिक ज्योतिष गणना · 100% निःशुल्क' : 'Classical Vedic Calculations · 100% Free'}
        </div>
        <h1 className="oj-page-title">{isHi ? currentTool.titleHi : currentTool.titleEn}</h1>
        <p className="oj-page-subtitle">{isHi ? currentTool.descHi : currentTool.descEn}</p>

        {/* Action Pills */}
        <div className="oj-page-actions-bar">
          <div className="oj-btn-group">
            <button
              type="button"
              className={`oj-varga-btn ${tool === 'ashtakavarga' ? 'is-active' : ''}`}
              onClick={() => onNavigate('tools', 'ashtakavarga')}
            >
              {isHi ? 'अष्टकवर्ग (SAV 337)' : 'Ashtakavarga'}
            </button>
            <button
              type="button"
              className={`oj-varga-btn ${tool === 'shadbala' ? 'is-active' : ''}`}
              onClick={() => onNavigate('tools', 'shadbala')}
            >
              {isHi ? 'षड्बल (Shadbala)' : 'Shadbala'}
            </button>
            <button
              type="button"
              className={`oj-varga-btn ${tool === 'transit-today' ? 'is-active' : ''}`}
              onClick={() => onNavigate('tools', 'transit-today')}
            >
              {isHi ? 'आज का गोचर' : 'Transits Today'}
            </button>
            <button
              type="button"
              className={`oj-varga-btn ${tool === 'gemstones' ? 'is-active' : ''}`}
              onClick={() => onNavigate('tools', 'gemstones')}
            >
              {isHi ? 'रत्न व रुद्राक्ष' : 'Gemstones'}
            </button>
            <button
              type="button"
              className={`oj-varga-btn ${tool === 'baby-names' ? 'is-active' : ''}`}
              onClick={() => onNavigate('tools', 'baby-names')}
            >
              {isHi ? 'शिशु नामकरण' : 'Baby Names'}
            </button>
          </div>
          <button type="button" className="oj-action-btn secondary" onClick={() => window.print()}>
            <Printer size={14} />
            <span>{isHi ? 'प्रिंट करें' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* 1. Ashtakavarga View */}
      {tool === 'ashtakavarga' && (
        <>
        <div className="oj-card">
          <div className="oj-card-header">
            <h2>{isHi ? 'सर्वाष्टकवर्ग सारणी (337 कुल बिंदु)' : 'Samudaya Ashtakavarga (337 Total Bindus)'}</h2>
          </div>
          <table className="oj-table">
            <thead>
              <tr>
                <th>{isHi ? 'राशि (Sign)' : 'Sign'}</th>
                <th>{isHi ? 'लग्न से भाव' : 'House from Asc'}</th>
                <th>{isHi ? 'सर्वाष्टकवर्ग अंक' : 'SAV Points'}</th>
                <th>{isHi ? 'शक्ति स्तर' : 'Strength Tier'}</th>
                <th>{isHi ? 'शास्त्रीय फल' : 'Interpretation'}</th>
              </tr>
            </thead>
            <tbody>
              {SIGNS.map((s, idx) => {
                const houseNum = ((idx - chart.ascendant.signIndex + 12) % 12) + 1;
                const pts = chart.ashtakavarga.sarva[idx];
                const isHigh = pts >= 30;
                const isLow = pts < 25;
                return (
                  <tr key={idx}>
                    <td><strong>{trSign(idx, lang)} ({s.name})</strong></td>
                    <td>{houseNum} {isHi ? 'भाव' : 'House'}</td>
                    <td><strong style={{ fontSize: '1.1rem' }}>{pts}</strong> / 56</td>
                    <td>
                      <span className={`oj-sav-tag ${isHigh ? 'high' : isLow ? 'low' : 'mid'}`}>
                        {isHigh ? (isHi ? 'बलवान (>30)' : 'High (>30)') : isLow ? (isHi ? 'कमजोर (<25)' : 'Low (<25)') : (isHi ? 'सामान्य' : 'Average')}
                      </span>
                    </td>
                    <td>
                      {isHigh
                        ? (isHi ? 'यह भाव अत्यंत शुभ परिणाम, संपन्नता एवं कार्य सिद्धि प्रदान करता है।' : 'Highly favorable house yielding success and prosperity.')
                        : isLow
                        ? (isHi ? 'इस भाव से संबंधित कार्यों में अतिरिक्त परिश्रम एवं शांति उपाय अपेक्षित हैं।' : 'Requires extra effort and traditional remedial support.')
                        : (isHi ? 'संतुलित एवं सामान्य फल।' : 'Balanced results.')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Kakshya Micro-Transit Table */}
        <div className="oj-card" style={{ marginTop: '20px' }}>
          <div className="oj-card-header">
            <h2>{isHi ? 'दैनिक कक्षा गोचर सारणी (3°45\' सूक्ष्म फल निर्णय)' : 'Daily Kakshya Transit Filter (3°45\' Micro-Results)'}</h2>
          </div>
          <p style={{ margin: '0 0 14px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
            {isHi
              ? 'प्रत्येक राशि 8 कक्षाओं (3°45\' प्रत्येक) में विभाजित होती है। जब गोचर ग्रह उस कक्षा से गुजरता है जिसमें उसे बिंदु (1) प्राप्त है, तो वह दिन अत्यंत शुभ व कार्य सिद्धि कारक होता है। 0 बिंदु पर अड़चन आती है।'
              : 'Each sign has 8 Kakshyas (3°45\' each). A transit planet delivers auspicious results when moving through a Kakshya with 1 Bindu, and temporary delays when Bindu is 0.'}
          </p>
          <table className="oj-table">
            <thead>
              <tr>
                <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                <th>{isHi ? 'गोचर राशि एवं अंश' : 'Sign & Longitude'}</th>
                <th>{isHi ? 'कक्षा सं.' : 'Kakshya #'}</th>
                <th>{isHi ? 'कक्षा अंश विस्तार' : 'Span (3°45\')'}</th>
                <th>{isHi ? 'कक्षा स्वामी' : 'Kakshya Lord'}</th>
                <th>{isHi ? 'बिंदु स्थिति' : 'Bindu (1/0)'}</th>
                <th>{isHi ? 'दैनिक सूक्ष्म फल' : 'Micro-Verdict'}</th>
              </tr>
            </thead>
            <tbody>
              {kakshaEntries.map((k) => (
                <tr key={k.planet}>
                  <td><strong>{trPlanet(k.planet, lang)}</strong></td>
                  <td>{trSign(k.signIndex, lang)} ({k.dms})</td>
                  <td><strong>#{k.kakshaNumber}</strong></td>
                  <td>{k.kakshaRange}</td>
                  <td><strong style={{ color: '#b45309' }}>{k.kakshaLord}</strong></td>
                  <td>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', background: k.kakshaBindu === 1 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: k.kakshaBindu === 1 ? '#059669' : '#dc2626', fontWeight: 800 }}>
                      {k.kakshaBindu === 1 ? (isHi ? '1 बिंदु (शुभ)' : '1 Bindu (Fav)') : (isHi ? '0 बिंदु (बाधा)' : '0 Bindu (Obstacle)')}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px' }}>
                    {isHi ? k.verdictHi : k.verdictEn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}

      {/* 2. Shadbala View */}
      {tool === 'shadbala' && (
        <div className="oj-card">
          <div className="oj-card-header">
            <h2>{isHi ? 'षड्बल बलवान-निर्बल मूल्यांकन (Shadbala Strength Ranking)' : 'Shadbala Six-fold Strength Table (Rupas & Virupas)'}</h2>
          </div>
          <table className="oj-table">
            <thead>
              <tr>
                <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                <th>{isHi ? 'स्थान बल' : 'Sthana Bala'}</th>
                <th>{isHi ? 'दिक् बल' : 'Digbala'}</th>
                <th>{isHi ? 'काल बल' : 'Kaala Bala'}</th>
                <th>{isHi ? 'चेष्टा बल' : 'Chesta Bala'}</th>
                <th>{isHi ? 'दृग्बल' : 'Drik Bala'}</th>
                <th>{isHi ? 'कुल रूपा' : 'Total (Rupas)'}</th>
                <th>{isHi ? 'आवश्यक रूपा' : 'Required'}</th>
                <th>{isHi ? 'अनुपात (%)' : 'Ratio (%)'}</th>
              </tr>
            </thead>
            <tbody>
              {chart.shadbala.map((sb) => {
                const ratio = Math.round(sb.ratio * 100);
                return (
                  <tr key={sb.planet}>
                    <td><strong className={`planet-${sb.planet}`}>{trPlanet(sb.planet, lang)}</strong></td>
                    <td>{sb.sthanaBala.toFixed(0)}</td>
                    <td>{sb.digBala.toFixed(0)}</td>
                    <td>{sb.kalaBala.toFixed(0)}</td>
                    <td>{sb.cheshtaBala.toFixed(0)}</td>
                    <td>{sb.drikBala.toFixed(0)}</td>
                    <td><strong style={{ color: 'var(--primary-maroon)' }}>{sb.totalRupas.toFixed(2)}</strong></td>
                    <td>{sb.requiredRupas.toFixed(1)}</td>
                    <td>
                      <span className={`oj-bal-badge ${ratio >= 100 ? 'strong' : 'average'}`}>
                        {ratio}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. Gemstones & Rudraksha View */}
      {tool === 'gemstones' && (
        <div className="oj-two-col-grid">
          <div className="oj-card">
            <div className="oj-card-header">
              <h2>{isHi ? 'प्राण रत्न एवं भाग्य रत्न (Vedic Gemstones)' : 'Recommended Gemstones (Ratna)'}</h2>
            </div>
            <table className="oj-table">
              <tbody>
                <tr>
                  <th>{isHi ? 'प्राण / जीवन रत्न (Life Stone)' : 'Life Stone (Lagna Lord)'}</th>
                  <td><strong>{gemstones.lifeStone.stoneEn} ({gemstones.lifeStone.stoneHi})</strong></td>
                </tr>
                <tr>
                  <th>{isHi ? 'भाग्य रत्न (Lucky Stone)' : 'Lucky Stone (9th Lord)'}</th>
                  <td><strong>{gemstones.luckyStone.stoneEn} ({gemstones.luckyStone.stoneHi})</strong></td>
                </tr>
                <tr>
                  <th>{isHi ? 'पुण्य / ज्ञान रत्न' : 'Wisdom Stone (5th Lord)'}</th>
                  <td>{gemstones.beneficStone.stoneEn} ({gemstones.beneficStone.stoneHi})</td>
                </tr>
                <tr>
                  <th>{isHi ? 'धारण धातु एवं अंगुली' : 'Metal & Finger'}</th>
                  <td>{gemstones.lifeStone.fingerEn} ({gemstones.lifeStone.fingerHi})</td>
                </tr>
                <tr>
                  <th>{isHi ? 'धारण वार व मुहूर्त' : 'Consecration Day'}</th>
                  <td>{gemstones.lifeStone.dayEn} ({gemstones.lifeStone.dayHi})</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="oj-card">
            <div className="oj-card-header">
              <h2>{isHi ? 'रुद्राक्ष एवं इष्ट देवता (Rudraksha & Ishta)' : 'Auspicious Rudraksha & Ishta Devata'}</h2>
            </div>
            <table className="oj-table">
              <tbody>
                <tr>
                  <th>{isHi ? 'अनुशंसित रुद्राक्ष' : 'Benefic Rudraksha'}</th>
                  <td><strong>{gemstones.primaryRudraksha.mukhi} Mukhi Rudraksha</strong></td>
                </tr>
                <tr>
                  <th>{isHi ? 'रुद्राक्ष अधिष्ठाता' : 'Presiding Deity'}</th>
                  <td>{isHi ? gemstones.primaryRudraksha.deityHi : gemstones.primaryRudraksha.deityEn}</td>
                </tr>
                <tr>
                  <th>{isHi ? 'मूल मंत्र' : 'Mantra'}</th>
                  <td><strong>{gemstones.primaryRudraksha.mantra}</strong></td>
                </tr>
                <tr>
                  <th>{isHi ? 'वर्जित रत्न' : 'Avoid Stones'}</th>
                  <td>{isHi ? gemstones.avoidStonesHi.join(', ') : gemstones.avoidStonesEn.join(', ')}</td>
                </tr>
                <tr>
                  <th>{isHi ? 'शास्त्रीय फल' : 'Benefit'}</th>
                  <td>{isHi ? gemstones.primaryRudraksha.benefitHi : gemstones.primaryRudraksha.benefitEn}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Baby Names & Namakshar View */}
      {tool === 'baby-names' && (
        <div className="oj-card">
          <div className="oj-card-header">
            <h2>{isHi ? 'शिशु नामकरण, नक्षत्र नामाक्षर एवं गंडमूल विचार' : 'Newborn Horoscope & Namakshar Details'}</h2>
          </div>
          <table className="oj-table">
            <tbody>
              <tr>
                <th>{isHi ? 'जन्म नक्षत्र एवं पद' : 'Birth Nakshatra & Pada'}</th>
                <td><strong>{moon.nakshatraName} (Pada {moon.pada})</strong></td>
              </tr>
              <tr>
                <th>{isHi ? 'प्रथम शुभ नामाक्षर' : 'Primary Name Syllable'}</th>
                <td>
                  <strong style={{ fontSize: '1.3rem', color: 'var(--primary-maroon)' }}>
                    {isHi ? avakahada.nameSyllableHi : avakahada.nameSyllableEn}
                  </strong>
                </td>
              </tr>
              <tr>
                <th>{isHi ? 'नक्षत्र के चारों पद नामाक्षर' : 'All 4 Pada Syllables'}</th>
                <td>
                  <strong>
                    {isHi ? avakahada.allPadaSyllablesHi : avakahada.allPadaSyllablesEn}
                  </strong>
                </td>
              </tr>
              <tr>
                <th>{isHi ? 'गंडमूल दोष स्थिति' : 'Gandamoola Status'}</th>
                <td>
                  {(() => {
                    const isGandmool = [0, 8, 9, 17, 18, 26].includes(moon.nakshatraIndex);
                    return (
                      <span className={`oj-dosha-status-banner ${isGandmool ? 'has-dosha' : 'no-dosha'}`}>
                        {isGandmool
                          ? (isHi ? 'गंडमूल नक्षत्र में जन्म (27वें दिन शांति पूजा अनुशंसित)' : 'Born in Gandmool Nakshatra (Shanti Puja Advised)')
                          : (isHi ? 'गंडमूल दोष से मुक्त (शुभ नक्षत्र)' : 'No Gandmool Dosha Present (Auspicious)')}
                      </span>
                    );
                  })()}
                </td>
              </tr>
              <tr>
                <th>{isHi ? 'वर्ण एवं तत्व' : 'Varna & Tatva'}</th>
                <td>{isHi ? `${avakahada.varna} वर्ण · ${avakahada.tatvaHi}` : `${avakahada.varna} · ${avakahada.tatvaEn}`}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* 5. Live Transits (Gochar) View */}
      {tool === 'transit-today' && (
        <div className="oj-card">
          <div className="oj-card-header">
            <h2>{isHi ? 'वर्तमान प्रमुख ग्रह गोचर (Saturn, Jupiter, Rahu, Ketu)' : 'Live Planetary Transits from Natal Moon'}</h2>
          </div>
          <p className="oj-section-note">
            {isHi
              ? `आपकी चंद्र राशि (${trSign(moon.signIndex, lang)}) से वर्तमान ग्रहों का गोचर एवं प्रभाव।`
              : `Current transit impacts evaluated from natal Moon sign (${SIGNS[moon.signIndex].name}).`}
          </p>
          <div className="oj-gochar-grid">
            <div className="oj-gochar-card">
              <h4 className="planet-saturn">{isHi ? 'शनि गोचर (Saturn)' : 'Saturn (Shani) Transit'}</h4>
              <p><strong>{isHi ? 'चंद्र से भाव:' : 'House from Moon:'}</strong> {saturnItem?.houseFromMoon ?? '-'}th House</p>
              <p><strong>{isHi ? 'गोचर राशि:' : 'Transit Sign:'}</strong> {saturnItem?.transitSign ?? '-'}</p>
              <p>{saturnItem?.reading ?? '-'}</p>
            </div>
            <div className="oj-gochar-card">
              <h4 className="planet-jupiter">{isHi ? 'गुरु गोचर (Jupiter)' : 'Jupiter (Guru) Transit'}</h4>
              <p><strong>{isHi ? 'चंद्र से भाव:' : 'House from Moon:'}</strong> {jupiterItem?.houseFromMoon ?? '-'}th House</p>
              <p><strong>{isHi ? 'गोचर राशि:' : 'Transit Sign:'}</strong> {jupiterItem?.transitSign ?? '-'}</p>
              <p>{jupiterItem?.reading ?? '-'}</p>
            </div>
            <div className="oj-gochar-card">
              <h4 className="planet-rahu">{isHi ? 'राहु-केतु गोचर' : 'Rahu & Ketu Transits'}</h4>
              <p><strong>{isHi ? 'राहु / केतु भाव:' : 'Houses:'}</strong> {rahuItem?.houseFromMoon ?? '-'}th / {ketuItem?.houseFromMoon ?? '-'}th</p>
              <p>{rahuItem?.reading ?? '-'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
