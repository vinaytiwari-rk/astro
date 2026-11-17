import React, { useMemo, useState } from 'react';
import {
  Download,
  Edit3,
  FileText,
  Printer,
  Sparkles,
} from 'lucide-react';
import { computeAvakahadaChakra, computeBhavaChalitPlacements, computeGhatakChakra } from '../../astro/avakahadaChalit';
import { computeAvasthasAndUpagrahas } from '../../astro/avasthasUpagrahas';
import { DIVISIONAL_META, NINE_GRAHAS, SEVEN_PLANETS, SIGNS } from '../../astro/constants';
import { computeKundaliDoshas } from '../../astro/predictions/familyDoshas';
import { computeHouseWisePredictions } from '../../astro/predictions/houseWise';
import { computeDeepGochar } from '../../astro/predictions/gocharDeep';
import { computeGemstoneAndRudraksha } from '../../astro/rashifalBabyRudraksha';
import { formatDateDmy, formatDms } from '../../astro/time';
import type { BirthInput, CalcSettings, ChartData, ChartStyle, DivisionalChartId, NineGrahaId } from '../../astro/types';
import type { CityEntry } from '../../data/cities';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet, trPlanetShort, trSign } from '../../i18n/translations';
import { DateDmyInput } from '../DateDmyInput';
import { InlineCityAutocomplete } from '../InlineCityAutocomplete';
import { VedicChartSvg, type ChartBadgeItem } from '../VedicChartSvg';

interface OnlineJyotishVedicHoroscopeViewProps {
  chart: ChartData;
  activeInput: BirthInput;
  settings: CalcSettings;
  onChangeChartStyle: (style: ChartStyle) => void;
  onApplyBirthInput: (input: BirthInput) => void;
  onOpenBooklet: () => void;
  onNavigate: (view: string, sub?: string) => void;
}

export const OnlineJyotishVedicHoroscopeView: React.FC<OnlineJyotishVedicHoroscopeViewProps> = ({
  chart,
  activeInput,
  settings,
  onChangeChartStyle,
  onApplyBirthInput,
  onOpenBooklet,
  onNavigate,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState<BirthInput>(activeInput);
  const [selectedVarga, setSelectedVarga] = useState<DivisionalChartId>('D9');

  const sun = useMemo(() => chart.planets.find((p) => p.id === 'Sun') || chart.ascendant, [chart]);
  const moon = useMemo(() => chart.planets.find((p) => p.id === 'Moon') || chart.ascendant, [chart]);

  const avakahada = useMemo(() => computeAvakahadaChakra(chart), [chart]);
  const ghatak = useMemo(() => computeGhatakChakra(avakahada.moonSignIndex), [avakahada.moonSignIndex]);
  const avasthas = useMemo(() => computeAvasthasAndUpagrahas(chart), [chart]);
  const chalit = useMemo(() => computeBhavaChalitPlacements(chart), [chart]);
  const doshas = useMemo(() => computeKundaliDoshas(chart), [chart]);
  const housePreds = useMemo(() => computeHouseWisePredictions(chart), [chart]);
  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const gochar = useMemo(() => computeDeepGochar(chart, todayIso), [chart, todayIso]);
  const gemstones = useMemo(() => computeGemstoneAndRudraksha(chart), [chart]);

  const d1Badges: ChartBadgeItem[] = useMemo(() => [
    {
      id: 'Asc',
      label: trPlanetShort('Asc', lang),
      signIndex: chart.ascendant.signIndex,
      houseNumber: 1,
      isLagna: true,
      isVargottama: chart.ascendant.isVargottama,
      tooltip: `Ascendant: ${chart.ascendant.signName} ${chart.ascendant.dms}`,
    },
    ...chart.planets.map((p) => ({
      id: p.id,
      label: trPlanetShort(p.id, lang),
      signIndex: p.signIndex,
      houseNumber: p.houseNumber,
      isRetrograde: p.isRetrograde,
      isCombust: p.isCombust,
      isVargottama: p.isVargottama,
      dignity: p.dignity,
      tooltip: `${trPlanet(p.id, lang)}: ${p.signName} ${p.dms} (${p.dignity})`,
    })),
  ], [chart, lang]);

  const d9Chart = chart.divisionalCharts.D9;
  const d9Badges: ChartBadgeItem[] = useMemo(() => {
    return d9Chart.placements.map((pl) => ({
      id: pl.id,
      label: trPlanetShort(pl.id, lang),
      signIndex: pl.signIndex,
      isLagna: pl.id === 'Asc',
      isRetrograde: pl.isRetrograde,
      dignity: pl.dignity,
      tooltip: `${trPlanet(pl.id, lang)}: ${trSign(pl.signIndex, lang)} (${pl.dignity})`,
    }));
  }, [d9Chart, lang]);

  const vChart = chart.divisionalCharts[selectedVarga];
  const selectedVargaBadges: ChartBadgeItem[] = useMemo(() => {
    return vChart.placements.map((pl) => ({
      id: pl.id,
      label: trPlanetShort(pl.id, lang),
      signIndex: pl.signIndex,
      isLagna: pl.id === 'Asc',
      isRetrograde: pl.isRetrograde,
      dignity: pl.dignity,
      tooltip: `${trPlanet(pl.id, lang)}: ${trSign(pl.signIndex, lang)} (${pl.dignity})`,
    }));
  }, [vChart, lang]);

  const mangal = useMemo(() => {
    return doshas.doshas.find((d) => d.name.includes('Manglik')) ?? doshas.doshas[0];
  }, [doshas]);

  const kaalSarp = useMemo(() => {
    return doshas.doshas.find((d) => d.name.includes('Kala Sarpa')) ?? doshas.doshas[1];
  }, [doshas]);

  const handleCitySelect = (entry: CityEntry) => {
    setFormData((prev) => ({
      ...prev,
      city: entry.city,
      country: entry.country,
      latitude: entry.lat,
      longitude: entry.lng,
      timezone: entry.timezone,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyBirthInput(formData);
    setShowEditForm(false);
  };

  const saturnTransit = gochar.items.find((it) => it.planet === 'Saturn');
  const jupiterTransit = gochar.items.find((it) => it.planet === 'Jupiter');
  const rahuTransit = gochar.items.find((it) => it.planet === 'Rahu');
  const ketuTransit = gochar.items.find((it) => it.planet === 'Ketu');

  const selectedMeta = DIVISIONAL_META.find((m) => m.id === selectedVarga);

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
        <span className="oj-bc-current">{isHi ? 'वैदिक जन्म कुंडली (फलादेश सहित)' : 'Vedic Horoscope (Janam Kundli)'}</span>
      </nav>

      {/* Page Title Banner */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          {isHi ? '100% निःशुल्क प्रामाणिक वैदिक कुंडली फलादेश' : '100% Free Authentic Vedic Horoscope & Predictions'}
        </div>
        <h1 className="oj-page-title">
          {isHi ? 'वैदिक जन्म कुंडली, षोडशवर्ग एवं सम्पूर्ण फलादेश' : 'Complete Vedic Horoscope, Shodasha Vargas & Life Predictions'}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? 'दृक सिद्धांत एवं स्विस एफिमेरिस आधारित 27+ शास्त्रीय खंड: ग्रह स्थिति, अष्टकवर्ग, षड्बल, 16 वर्ग, विंशोत्तरी महादशा, गोचर एवं उपाय।'
            : 'Accurate planetary positions, 16 Shodasha Vargas, Dasha timelines, Doshas, and traditional Vedic remedies computed using Swiss Ephemeris and Drik Siddhanta.'}
        </p>

        {/* Action Pills */}
        <div className="oj-page-actions-bar">
          <div className="oj-chart-style-pill">
            <span className="oj-pill-label">{isHi ? 'शैली:' : 'Style:'}</span>
            <select
              value={settings.chartStyle}
              onChange={(e) => onChangeChartStyle(e.target.value as ChartStyle)}
              className="oj-chart-select"
            >
              <option value="north">{isHi ? 'उत्तर भारतीय (डायमंड)' : 'North Indian (Diamond)'}</option>
              <option value="south">{isHi ? 'दक्षिण भारतीय (बॉक्स)' : 'South Indian (Box)'}</option>
              <option value="east">{isHi ? 'पूर्वी भारतीय (बंगला)' : 'East Indian (Surya)'}</option>
            </select>
          </div>

          <button
            type="button"
            className="oj-action-btn secondary"
            onClick={() => setShowEditForm(!showEditForm)}
          >
            <Edit3 size={14} />
            <span>{showEditForm ? (isHi ? 'विवरण बंद करें' : 'Hide Details') : (isHi ? 'जन्म विवरण बदलें' : 'Change Birth Data')}</span>
          </button>

          <button
            type="button"
            className="oj-action-btn secondary"
            onClick={() => window.print()}
          >
            <Printer size={14} />
            <span>{isHi ? 'प्रिंट करें' : 'Print'}</span>
          </button>

          <button
            type="button"
            className="oj-action-btn primary"
            onClick={onOpenBooklet}
          >
            <Download size={14} />
            <span>{isHi ? 'संपूर्ण जन्म पत्रिका (Birth Report)' : 'Birth Report (जन्म पत्रिका)'}</span>
          </button>
        </div>
      </div>

      {/* Edit Birth Form Drawer */}
      {showEditForm && (
        <div className="oj-card oj-edit-form-card">
          <div className="oj-card-header">
            <h3>{isHi ? 'जन्म विवरण संशोधित करें' : 'Update Birth Particulars'}</h3>
          </div>
          <form onSubmit={handleFormSubmit} className="oj-form-grid">
            <div className="oj-field">
              <label>{isHi ? 'नाम' : 'Full Name'}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="oj-field">
              <label>{isHi ? 'लिंग' : 'Gender'}</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
              >
                <option value="male">{isHi ? 'पुरुष' : 'Male'}</option>
                <option value="female">{isHi ? 'स्त्री' : 'Female'}</option>
                <option value="other">{isHi ? 'अन्य' : 'Other'}</option>
              </select>
            </div>
            <div className="oj-field">
              <label>{isHi ? 'जन्म तिथि' : 'Date of Birth'}</label>
              <DateDmyInput
                value={formData.date}
                onChange={(d) => setFormData({ ...formData, date: d })}
              />
            </div>
            <div className="oj-field">
              <label>{isHi ? 'जन्म समय' : 'Time of Birth'}</label>
              <input
                type="time"
                step="1"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
            <div className="oj-field oj-field-full">
              <label>{isHi ? 'जन्म स्थान' : 'Birth City'}</label>
              <InlineCityAutocomplete
                value={formData.city}
                onChangeText={(c) => setFormData({ ...formData, city: c })}
                onSelectCity={handleCitySelect}
                lang={lang}
              />
            </div>
            <div className="oj-form-actions">
              <button type="submit" className="oj-btn-primary">
                {isHi ? 'कुंडली पुनः गणना करें' : 'Recalculate Horoscope'}
              </button>
              <button
                type="button"
                className="oj-btn-outline"
                onClick={() => setShowEditForm(false)}
              >
                {isHi ? 'रद्द करें' : 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Native Metadata Strip */}
      <div className="oj-card oj-meta-strip-card">
        <div className="oj-meta-flex">
          <div>
            <span className="oj-meta-label">{isHi ? 'जातक' : 'Native'}:</span>
            <strong>{chart.input.name} ({chart.input.gender === 'male' ? (isHi ? 'पुरुष' : 'Male') : (isHi ? 'स्त्री' : 'Female')})</strong>
          </div>
          <div>
            <span className="oj-meta-label">{isHi ? 'जन्म विवरण' : 'Birth'}:</span>
            <strong>{formatDateDmy(chart.input.date)} {chart.input.time} ({chart.input.city}, {chart.input.country})</strong>
          </div>
          <div>
            <span className="oj-meta-label">{isHi ? 'अक्षांश / देशांतर' : 'Lat / Lon'}:</span>
            <strong>{chart.input.latitude.toFixed(4)}° N, {chart.input.longitude.toFixed(4)}° E ({chart.input.timezone})</strong>
          </div>
          <div>
            <span className="oj-meta-label">{isHi ? 'अयनांश' : 'Ayanamsha'}:</span>
            <strong>{chart.settings.ayanamsa} ({chart.ayanamsaDms})</strong>
          </div>
        </div>
      </div>

      {/* Section 1 & 2: Panchang & Avakahada Tables */}
      <div className="oj-two-col-grid">
        <div className="oj-card">
          <div className="oj-card-header">
            <h2>{isHi ? '1. जन्मकालीन पंचांग (Birth Panchanga)' : '1. Birth Panchang Particulars'}</h2>
          </div>
          <table className="oj-table">
            <tbody>
              <tr>
                <th>{isHi ? 'तिथि' : 'Tithi'}</th>
                <td><strong>{chart.panchang.tithi.name}</strong> ({chart.panchang.tithi.paksha} पक्ष)</td>
                <th>{isHi ? 'वार (दिन)' : 'Day (Vara)'}</th>
                <td>{chart.panchang.vara.name} ({chart.panchang.vara.lord})</td>
              </tr>
              <tr>
                <th>{isHi ? 'नक्षत्र' : 'Nakshatra'}</th>
                <td><strong>{moon.nakshatraName}</strong> ({isHi ? 'चरण' : 'Pada'} {moon.pada})</td>
                <th>{isHi ? 'नक्षत्र स्वामी' : 'Star Lord'}</th>
                <td>{trPlanet(moon.nakshatraLord, lang)}</td>
              </tr>
              <tr>
                <th>{isHi ? 'योग' : 'Yoga'}</th>
                <td>{chart.panchang.yoga.name}</td>
                <th>{isHi ? 'करण' : 'Karana'}</th>
                <td>{chart.panchang.karana.name}</td>
              </tr>
              <tr>
                <th>{isHi ? 'सूर्योदय' : 'Sunrise'}</th>
                <td>{chart.panchang.sunriseLocal || '06:12:00'}</td>
                <th>{isHi ? 'सूर्यास्त' : 'Sunset'}</th>
                <td>{chart.panchang.sunsetLocal || '18:24:00'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="oj-card">
          <div className="oj-card-header">
            <h2>{isHi ? '2. अवकहड़ा चक्र (Avakahada Chakra)' : '2. Avakahada Chakra (Astrological Identity)'}</h2>
          </div>
          <table className="oj-table">
            <tbody>
              <tr>
                <th>{isHi ? 'वर्ण' : 'Varna'}</th>
                <td>{avakahada.varna}</td>
                <th>{isHi ? 'वश्य' : 'Vashya'}</th>
                <td>{avakahada.vashya}</td>
              </tr>
              <tr>
                <th>{isHi ? 'योनि' : 'Yoni'}</th>
                <td>{avakahada.yoni}</td>
                <th>{isHi ? 'गण' : 'Gana'}</th>
                <td><strong>{avakahada.gana}</strong></td>
              </tr>
              <tr>
                <th>{isHi ? 'नाड़ी' : 'Nadi'}</th>
                <td><strong>{avakahada.nadi}</strong></td>
                <th>{isHi ? 'तत्व' : 'Tatva'}</th>
                <td>{isHi ? avakahada.tatvaHi : avakahada.tatvaEn}</td>
              </tr>
              <tr>
                <th>{isHi ? 'नाम पाया' : 'Paya'}</th>
                <td>{isHi ? 'रजत पाया (अति शुभ)' : 'Silver (Rajat)'}</td>
                <th>{isHi ? 'युंजा' : 'Yunja'}</th>
                <td>{isHi ? avakahada.yunjaHi : avakahada.yunjaEn}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3 & 4: Basic Horoscope & Ghata Chakra */}
      <div className="oj-two-col-grid">
        <div className="oj-card">
          <div className="oj-card-header">
            <h2>{isHi ? '3. आधारभूत ज्योतिषीय विवरण' : '3. Basic Astrological Details'}</h2>
          </div>
          <table className="oj-table">
            <tbody>
              <tr>
                <th>{isHi ? 'लग्न राशि' : 'Ascendant (Lagna)'}</th>
                <td><strong>{chart.ascendant.signName}</strong> ({chart.ascendant.dms})</td>
                <th>{isHi ? 'लग्न स्वामी' : 'Lagna Lord'}</th>
                <td><strong>{trPlanet(chart.ascendant.signLord, lang)}</strong></td>
              </tr>
              <tr>
                <th>{isHi ? 'चंद्र राशि' : 'Moon Sign (Rasi)'}</th>
                <td><strong>{moon.signName}</strong> ({moon.dms})</td>
                <th>{isHi ? 'राशि स्वामी' : 'Rasi Lord'}</th>
                <td><strong>{trPlanet(moon.signLord, lang)}</strong></td>
              </tr>
              <tr>
                <th>{isHi ? 'सूर्य राशि' : 'Sun Sign'}</th>
                <td>{sun.signName} ({sun.dms})</td>
                <th>{isHi ? 'दशा शेष' : 'Balance of Dasha'}</th>
                <td>{isHi ? avakahada.dashaBalanceHi : avakahada.dashaBalanceEn}</td>
              </tr>
              <tr>
                <th>{isHi ? 'नामाक्षर (अक्षर)' : 'Name Syllable'}</th>
                <td colSpan={3}><strong>{isHi ? avakahada.nameSyllableHi : avakahada.nameSyllableEn} ({isHi ? avakahada.allPadaSyllablesHi : avakahada.allPadaSyllablesEn})</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="oj-card">
          <div className="oj-card-header">
            <h2>{isHi ? '4. भाग्यशाली तत्त्व एवं घात चक्र' : '4. Lucky Things & Ghata Chakra'}</h2>
          </div>
          <table className="oj-table">
            <tbody>
              <tr>
                <th>{isHi ? 'भाग्यशाली रत्न' : 'Lucky Gemstone'}</th>
                <td><strong>{gemstones.lifeStone.stoneEn} ({gemstones.lifeStone.stoneHi})</strong></td>
                <th>{isHi ? 'रुद्राक्ष' : 'Benefic Rudraksha'}</th>
                <td>{gemstones.primaryRudraksha.mukhi} Mukhi</td>
              </tr>
              <tr>
                <th>{isHi ? 'शुभ वार' : 'Lucky Days'}</th>
                <td>{gemstones.lifeStone.dayEn} ({gemstones.lifeStone.dayHi})</td>
                <th>{isHi ? 'धारण अंगुली' : 'Lucky Finger'}</th>
                <td>{gemstones.lifeStone.fingerEn} ({gemstones.lifeStone.fingerHi})</td>
              </tr>
              <tr>
                <th>{isHi ? 'घात मास / तिथि' : 'Ghata Month / Tithi'}</th>
                <td>{ghatak.monthEn} / {ghatak.tithiEn}</td>
                <th>{isHi ? 'घात वार / नक्षत्र' : 'Ghata Day / Star'}</th>
                <td>{ghatak.varaEn} / {ghatak.nakshatraEn}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 5: Planetary Positions */}
      <div className="oj-card">
        <div className="oj-card-header">
          <h2>{isHi ? '5. विस्तृत ग्रह स्थिति सारणी (Planetary Positions)' : '5. Detailed Planetary Positions'}</h2>
        </div>
        
        <h4 className="oj-sub-heading">{isHi ? 'तालिका अ: ग्रह, राशि, अंश एवं भाव' : 'Table A: Planet, Sign, Degrees & House Position'}</h4>
        <div className="oj-table-wrapper">
          <table className="oj-table">
            <thead>
              <tr>
                <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                <th>{isHi ? 'स्थिति' : 'Condition'}</th>
                <th>{isHi ? 'राशि' : 'Sign (Rashi)'}</th>
                <th>{isHi ? 'अंश : कला : विकला' : 'Deg : Min : Sec'}</th>
                <th>{isHi ? 'भाव' : 'House (Bhava)'}</th>
                <th>{isHi ? 'गति (डिग्री/दिन)' : 'Speed (°/day)'}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="oj-row-highlight">
                <td><strong>*As {isHi ? 'लग्न' : 'Ascendant'}</strong></td>
                <td>-</td>
                <td>{chart.ascendant.signName}</td>
                <td>{chart.ascendant.dms}</td>
                <td>1</td>
                <td>-</td>
              </tr>
              {chart.planets.map((p) => {
                const isRetro = p.isRetrograde;
                const isCombust = p.isCombust;
                const statusStr = [
                  isRetro ? (isHi ? 'वक्री (R)' : 'Retrograde [R]') : null,
                  isCombust ? (isHi ? 'अस्त (C)' : 'Combust [C]') : null,
                ].filter(Boolean).join(' · ') || (isHi ? 'मार्गी' : 'Direct');

                return (
                  <tr key={p.id}>
                    <td>
                      <strong className={`planet-${p.id.toLowerCase()}`}>{trPlanet(p.id, lang)} ({trPlanetShort(p.id, lang)})</strong>
                    </td>
                    <td><span className={isRetro || isCombust ? 'badge-alert' : ''}>{statusStr}</span></td>
                    <td>{p.signName}</td>
                    <td>{p.dms}</td>
                    <td><strong>{p.houseNumber}</strong></td>
                    <td>{p.speedDegPerDay.toFixed(3)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 6: Bhava Chalit Cusps */}
      <div className="oj-card">
        <div className="oj-card-header">
          <h2>{isHi ? '6. भाव चलित सारणी (Bhava Chalit Cusps)' : '6. Bhava Chalit Cusps Table'}</h2>
        </div>
        <table className="oj-table">
          <thead>
            <tr>
              <th>{isHi ? 'ग्रह' : 'Planet'}</th>
              <th>{isHi ? 'राशि भाव (D1)' : 'Rasi House'}</th>
              <th>{isHi ? 'चलित भाव (Sripati)' : 'Chalit House'}</th>
              <th>{isHi ? 'अंश स्थिति' : 'Longitude'}</th>
              <th>{isHi ? 'विस्थापन स्थिति' : 'Shift Status'}</th>
            </tr>
          </thead>
          <tbody>
            {chalit.placements.map((pl) => (
              <tr key={pl.id}>
                <td><strong>{trPlanet(pl.id, lang)}</strong></td>
                <td>{pl.rasiHouse}</td>
                <td><strong>{pl.chalitHouse}</strong></td>
                <td>{pl.dms}</td>
                <td>
                  {pl.shifted ? (
                    <span className="oj-major-tag">
                      {isHi ? `H${pl.rasiHouse} से H${pl.chalitHouse} में विस्थापन` : `Shifted H${pl.rasiHouse} → H${pl.chalitHouse}`}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>
                      {isHi ? 'अपरिवर्तित' : 'Unchanged'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section 7 & 8: Lagna Kundali & Navamsha Kundali Charts */}
      <div className="oj-card">
        <div className="oj-card-header">
          <h2>{isHi ? '7. लग्न कुंडली एवं नवमांश कुंडली (D-1 & D-9 Charts)' : '7. Lagna Chart & Navamsha Chart'}</h2>
        </div>
        <div className="oj-charts-row">
          <div className="oj-chart-box">
            <h4 className="oj-chart-title">{isHi ? 'जन्म लग्न कुंडली (D-1 Rashi)' : 'Lagna Kundali (D-1 Rashi Chart)'}</h4>
            <div className="oj-svg-wrapper">
              <VedicChartSvg
                title={isHi ? 'जन्म लग्न कुंडली (D-1)' : 'Lagna Chart (D-1)'}
                style={settings.chartStyle}
                lagnaSignIndex={chart.ascendant.signIndex}
                items={d1Badges}
                centerLabel={isHi ? 'राशि' : 'RASI'}
              />
            </div>
            <div className="oj-chart-meta">
              <span>{isHi ? 'लग्न:' : 'Asc:'} <strong>{chart.ascendant.signName}</strong></span>
              <span>{isHi ? 'चंद्र:' : 'Moon:'} <strong>{moon.signName}</strong></span>
            </div>
          </div>

          <div className="oj-chart-box">
            <h4 className="oj-chart-title">{isHi ? 'नवमांश कुंडली (D-9 Navamsha)' : 'Navamsha Kundali (D-9 Chart)'}</h4>
            <div className="oj-svg-wrapper">
              <VedicChartSvg
                title={isHi ? 'नवमांश कुंडली (D-9)' : 'Navamsha Chart (D-9)'}
                style={settings.chartStyle}
                lagnaSignIndex={d9Chart.lagnaSignIndex}
                items={d9Badges}
                centerLabel={isHi ? 'नवमांश' : 'NAVAMSHA'}
              />
            </div>
            <div className="oj-chart-meta">
              <span>{isHi ? 'विवाह व भाग्य' : 'Marriage, Dharma & Fruits of Karma'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 9: 16 Shodashavargas Selector */}
      <div className="oj-card">
        <div className="oj-card-header">
          <h2>{isHi ? '8. षोडशवर्ग कुंडलियां (16 Divisional Charts D-1 to D-60)' : '8. Shodashavarga Divisional Charts'}</h2>
        </div>
        <div className="oj-varga-selector-bar">
          {(['D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12', 'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'] as DivisionalChartId[]).map((vId) => (
            <button
              key={vId}
              type="button"
              className={`oj-varga-btn ${selectedVarga === vId ? 'is-active' : ''}`}
              onClick={() => setSelectedVarga(vId)}
            >
              {vId} ({DIVISIONAL_META.find((m) => m.id === vId)?.name ?? vId})
            </button>
          ))}
        </div>
        <div className="oj-single-chart-display">
          <div className="oj-svg-wrapper" style={{ maxWidth: '420px', margin: '0 auto' }}>
            <VedicChartSvg
              title={`${selectedVarga} — ${selectedMeta?.name ?? selectedVarga}`}
              style={settings.chartStyle}
              lagnaSignIndex={vChart.lagnaSignIndex}
              items={selectedVargaBadges}
              centerLabel={selectedVarga}
            />
          </div>
          <p className="oj-chart-desc">
            <strong>{selectedMeta?.name ?? selectedVarga}</strong>: {selectedMeta?.signification ?? 'Divisional Chart'}
          </p>
        </div>
      </div>

      {/* Section 10 & 11: Shadbala & Ashtakavarga Tables */}
      <div className="oj-two-col-grid">
        <div className="oj-card">
          <div className="oj-card-header">
            <h2>{isHi ? '9. षड्बल सारणी (Shadbala Strengths)' : '9. Shadbala Strengths in Rupas'}</h2>
          </div>
          <table className="oj-table">
            <thead>
              <tr>
                <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                <th>{isHi ? 'कुल षड्बल' : 'Total (Rupas)'}</th>
                <th>{isHi ? 'आवश्यक' : 'Required'}</th>
                <th>{isHi ? 'परिणाम' : 'Result'}</th>
              </tr>
            </thead>
            <tbody>
              {chart.shadbala.map((sb) => {
                const isStrong = sb.totalRupas >= sb.requiredRupas;
                return (
                  <tr key={sb.planet}>
                    <td><strong>{trPlanet(sb.planet, lang)}</strong></td>
                    <td><strong>{sb.totalRupas.toFixed(2)}</strong></td>
                    <td>{sb.requiredRupas.toFixed(1)}</td>
                    <td>
                      <span className={`oj-bal-badge ${isStrong ? 'strong' : 'average'}`}>
                        {isStrong ? (isHi ? 'बलवान (Strong)' : 'Strong') : (isHi ? 'मध्यम' : 'Average')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="oj-card">
          <div className="oj-card-header">
            <h2>{isHi ? '10. सर्वाष्टकवर्ग सारणी (Samudaya Ashtakavarga 337)' : '10. Samudaya Ashtakavarga Points'}</h2>
          </div>
          <table className="oj-table">
            <thead>
              <tr>
                <th>{isHi ? 'राशि' : 'Rashi'}</th>
                <th>{isHi ? 'SAV अंक' : 'SAV Points'}</th>
                <th>{isHi ? 'प्रभाव' : 'Significance'}</th>
              </tr>
            </thead>
            <tbody>
              {chart.ashtakavarga.sarva.map((pts, idx) => {
                const s = SIGNS[idx];
                const isHigh = pts >= 30;
                const isLow = pts < 25;
                return (
                  <tr key={idx}>
                    <td><strong>{trSign(idx, lang)} ({s.name})</strong></td>
                    <td><strong>{pts}</strong> / 56</td>
                    <td>
                      <span className={`oj-sav-tag ${isHigh ? 'high' : isLow ? 'low' : 'mid'}`}>
                        {isHigh ? (isHi ? 'अति शुभ (>30)' : 'High (>30)') : isLow ? (isHi ? 'अल्प (<25)' : 'Low (<25)') : (isHi ? 'सामान्य' : 'Average')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 12: Vimshottari Dasha Tree */}
      <div className="oj-card">
        <div className="oj-card-header">
          <h2>{isHi ? '11. विंशोत्तरी महादशा चक्र (Vimshottari Dasha Timeline)' : '11. Vimshottari Dasa Timeline (120 Years)'}</h2>
        </div>
        <div className="oj-table-wrapper">
          <table className="oj-table">
            <thead>
              <tr>
                <th>{isHi ? 'महादशा' : 'Mahadasha'}</th>
                <th>{isHi ? 'आरंभ तिथि' : 'Start Date'}</th>
                <th>{isHi ? 'समाप्ति तिथि' : 'End Date'}</th>
                <th>{isHi ? 'अवधि' : 'Span'}</th>
              </tr>
            </thead>
            <tbody>
              {chart.vimshottari.map((d, i) => (
                <tr key={i}>
                  <td><strong className={`planet-${String(d.lord).toLowerCase()}`}>{trPlanet(d.lord as any, lang)} महादशा</strong></td>
                  <td>{new Date(d.startMs).toLocaleDateString()}</td>
                  <td>{new Date(d.endMs).toLocaleDateString()}</td>
                  <td>{Math.round(d.durationDays / 365.25)} {isHi ? 'वर्ष' : 'Years'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 13: Doshas and Mitigations */}
      <div className="oj-two-col-grid">
        <div className="oj-card">
          <div className="oj-card-header">
            <h2>{isHi ? '12. मंगल दोष एवं परिहार' : '12. Mangal Dosha & Mitigation'}</h2>
          </div>
          <div className="oj-dosha-content">
            <div className={`oj-dosha-status-banner ${mangal.status !== 'Clear' ? 'has-dosha' : 'no-dosha'}`}>
              <strong>
                {mangal.status === 'Clear'
                  ? (isHi ? 'कुंडली मांगलिक दोष से मुक्त है' : 'No Mangal Dosha Present')
                  : (isHi ? `मांगलिक स्थिति: ${mangal.status}` : `Mangal Dosha: ${mangal.status}`)}
              </strong>
            </div>
            <p><strong>{isHi ? 'विवरण:' : 'Details:'}</strong> {mangal.trigger}</p>
            <div className="oj-remedy-box">
              <h4>{isHi ? 'पारंपरिक मंगल उपाय:' : 'Traditional Remedies:'}</h4>
              <p>{mangal.remedy}</p>
            </div>
          </div>
        </div>

        <div className="oj-card">
          <div className="oj-card-header">
            <h2>{isHi ? '13. कालसर्प दोष' : '13. Kaal Sarp Dosha Evaluation'}</h2>
          </div>
          <div className="oj-dosha-content">
            <div className={`oj-dosha-status-banner ${kaalSarp.status !== 'Clear' ? 'has-dosha' : 'no-dosha'}`}>
              <strong>
                {kaalSarp.status === 'Clear'
                  ? (isHi ? 'आपकी कुंडली कालसर्प दोष से पूर्णतः मुक्त है।' : "You don't have Kalasarpa dosha in your chart.")
                  : (isHi ? `कालसर्प दोष स्थिति: ${kaalSarp.name} (${kaalSarp.status})` : `${kaalSarp.name} (${kaalSarp.status})`)}
              </strong>
            </div>
            <p>{kaalSarp.trigger}</p>
            <p>{kaalSarp.remedy}</p>
          </div>
        </div>
      </div>

      {/* Section 14: House-by-House Predictions */}
      <div className="oj-card">
        <div className="oj-card-header">
          <h2>{isHi ? '14. द्वादश भाव विस्तृत फलादेश (House-by-House Predictions)' : '14. Detailed House-by-House Predictions'}</h2>
        </div>
        <div className="oj-predictions-accordion">
          {housePreds.map((hp) => (
            <div key={hp.houseNumber} className="oj-pred-house-block">
              <div className="oj-pred-house-header">
                <h4>
                  {isHi ? `${hp.houseNumber}वां भाव (${hp.titleHi}): ${hp.signNameHi} राशि` : `House ${hp.houseNumber} (${hp.titleEn}): ${hp.signNameEn}`}
                </h4>
                <span className="oj-house-lord-tag">
                  {isHi ? `भावेश: ${trPlanet(hp.lordPlanet, lang)}` : `Lord: ${trPlanet(hp.lordPlanet, lang)} in H${hp.lordPlacedHouse}`}
                </span>
              </div>
              <div className="oj-pred-house-body">
                <p><strong>{isHi ? 'भाव फल:' : 'House Analysis:'}</strong> {isHi ? hp.synthesisHi : hp.synthesisEn}</p>
                <p><strong>{isHi ? 'भावेश स्थिति:' : 'Lord Placement:'}</strong> {isHi ? hp.lordReadingHi : hp.lordReadingEn}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 15: Major Transits Today */}
      <div className="oj-card">
        <div className="oj-card-header">
          <h2>{isHi ? '15. वर्तमान प्रमुख गोचर फल (Live Transits from Moon)' : '15. Major Planetary Transits from Natal Moon'}</h2>
        </div>
        <div className="oj-gochar-grid">
          {saturnTransit && (
            <div className="oj-gochar-card">
              <h4 className="planet-saturn">{isHi ? 'शनि गोचर (Saturn)' : 'Saturn (Shani) Transit'}</h4>
              <p><strong>{isHi ? 'चंद्र से भाव:' : 'House from Moon:'}</strong> {saturnTransit.houseFromMoon}th House</p>
              <p><strong>{isHi ? 'गोचर राशि:' : 'Transit Sign:'}</strong> {saturnTransit.transitSign}</p>
              <p>{saturnTransit.reading}</p>
            </div>
          )}

          {jupiterTransit && (
            <div className="oj-gochar-card">
              <h4 className="planet-jupiter">{isHi ? 'गुरु गोचर (Jupiter)' : 'Jupiter (Guru) Transit'}</h4>
              <p><strong>{isHi ? 'चंद्र से भाव:' : 'House from Moon:'}</strong> {jupiterTransit.houseFromMoon}th House</p>
              <p><strong>{isHi ? 'गोचर राशि:' : 'Transit Sign:'}</strong> {jupiterTransit.transitSign}</p>
              <p>{jupiterTransit.reading}</p>
            </div>
          )}

          {rahuTransit && (
            <div className="oj-gochar-card">
              <h4 className="planet-rahu">{isHi ? 'राहु गोचर (Rahu)' : 'Rahu Transit'}</h4>
              <p><strong>{isHi ? 'चंद्र से भाव:' : 'House from Moon:'}</strong> {rahuTransit.houseFromMoon}th House</p>
              <p>{rahuTransit.reading}</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="oj-card oj-bottom-cta-card">
        <h3>{isHi ? 'संपूर्ण जन्म पत्रिका रिपोर्ट (Birth Report)' : 'Download Complete Birth Report (Kundli Patrika)'}</h3>
        <p>
          {isHi
            ? 'AV Astro Vibe के समस्त विभागों, दशाओं, गोचर, उपायों, और जीवन भविष्यवाणियों को समाहित करने वाला विस्तृत उच्च-गुणवत्ता संपूर्ण जन्म पत्रिका रिपोर्ट 100% निःशुल्क प्राप्त करें।'
            : 'Access the complete comprehensive printed Birth Report (Janmapatrika) containing all calculations, dashas, transits, and traditional remedies completely free.'}
        </p>
        <button
          type="button"
          className="oj-btn-primary large"
          onClick={onOpenBooklet}
        >
          <FileText size={16} />
          <span>{isHi ? 'जन्म पत्रिका खोलें (100% निःशुल्क)' : 'Open Birth Report (जन्म पत्रिका) (100% Free)'}</span>
        </button>
      </div>
    </div>
  );
};
