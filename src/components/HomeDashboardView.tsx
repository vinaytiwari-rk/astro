import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BookOpen,
  Calendar,
  Clock,
  Compass,
  Edit3,
  FileText,
  Flame,
  Gem,
  Grid3x3,
  Heart,
  HelpCircle,
  Layers,
  Moon,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Star,
  Sun,
  Trash2,
} from 'lucide-react';
import { calculateChart } from '../astro/calculator';
import { computeAnnualHinduCalendar, computeDailyChoghadiyaAndGowri } from '../astro/panchangExtra';
import { computeDeepPanchangMuhurta } from '../astro/panchangMuhurtaDeep';
import { evaluateParamayusStatus } from '../astro/predictions/paramayus';
import { computeRashifalReport, type RashifalPeriod } from '../astro/rashifalBabyRudraksha';
import { formatDateDmy } from '../astro/time';
import type { BirthInput, CalcSettings, ChartData } from '../astro/types';
import type { CityEntry } from '../data/cities';
import { useLanguage } from '../i18n/LanguageContext';
import { trPlanet, trSign, trTerm } from '../i18n/translations';
import type { MainTab } from '../nav';
import { DateDmyInput } from './DateDmyInput';
import { InlineCityAutocomplete } from './InlineCityAutocomplete';
import { ParamayusLockBanner } from './ParamayusLockBanner';

interface HomeDashboardViewProps {
  chart: ChartData;
  activeInput: BirthInput;
  profiles: BirthInput[];
  settings: CalcSettings;
  onSelectProfile: (id: string) => void;
  onNavigate: (tab: MainTab, subTab?: string, nested?: string) => void;
  onOpenEditor: () => void;
  onOpenBooklet: () => void;
  onQuickGenerateKundali: (input: BirthInput) => void;
  onQuickMatchKundali: (groom: BirthInput, bride: BirthInput) => void;
  canDeleteProfile?: boolean;
  onDeleteProfile?: () => void;
}

function getLocalIsoAndTime(d: Date): { date: string; time: string; minutes: number } {
  const pad = (n: number) => String(n).padStart(2, '0');
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
  const minutes = d.getHours() * 60 + d.getMinutes();
  return { date, time, minutes };
}

function parseHhMm(hhmm: string): number {
  const parts = hhmm.trim().split(':');
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return -1;
  return h * 60 + m;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({
  chart,
  activeInput,
  profiles,
  settings,
  onSelectProfile,
  onNavigate,
  onOpenEditor,
  onOpenBooklet,
  onQuickGenerateKundali,
  onQuickMatchKundali,
  canDeleteProfile = false,
  onDeleteProfile,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';
  const paramayus = evaluateParamayusStatus(chart);
  const moonSignIndex = chart.planets.find((p) => p.id === 'Moon')?.signIndex ?? 0;

  // --- Card 1: Quick Kundali Form State ---
  const [kundaliForm, setKundaliForm] = useState<BirthInput>(activeInput);
  useEffect(() => {
    setKundaliForm(activeInput);
  }, [activeInput]);

  const handleResetKundaliForm = () => {
    const now = getLocalIsoAndTime(new Date());
    setKundaliForm({
      ...activeInput,
      id: `chart-${Date.now()}`,
      name: '',
      gender: 'male',
      date: now.date,
      time: '12:00:00',
    });
  };

  // --- Card 2: Quick Kundali Matching Boy & Girl State ---
  const [matchSide, setMatchSide] = useState<'boy' | 'girl'>('boy');
  const [boyForm, setBoyForm] = useState<BirthInput>(() => {
    const maleProf = profiles.find((p) => p.gender === 'male') ?? profiles[profiles.length - 1] ?? activeInput;
    return maleProf;
  });
  const [girlForm, setGirlForm] = useState<BirthInput>(() => {
    const femaleProf = profiles.find((p) => p.gender === 'female') ?? profiles[0] ?? activeInput;
    return femaleProf;
  });

  // --- Card 3 & Right Panel: Live Panchang of Current Period ---
  const [nowClock, setNowClock] = useState<Date>(() => new Date());
  const [panchangLoc, setPanchangLoc] = useState<{
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
  }>(() => ({
    city: activeInput.city || 'New Delhi',
    country: activeInput.country || 'India',
    latitude: activeInput.latitude || 28.6139,
    longitude: activeInput.longitude || 77.209,
    timezone: activeInput.timezone || 'Asia/Kolkata',
  }));

  useEffect(() => {
    const id = window.setInterval(() => setNowClock(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const currentMoment = useMemo(() => getLocalIsoAndTime(nowClock), [nowClock]);

  const livePanchangInput: BirthInput = useMemo(
    () => ({
      id: 'home-live-panchang',
      name: 'Live Panchang Moment',
      gender: 'other',
      date: currentMoment.date,
      time: currentMoment.time,
      timezone: panchangLoc.timezone,
      city: panchangLoc.city,
      country: panchangLoc.country,
      latitude: panchangLoc.latitude,
      longitude: panchangLoc.longitude,
    }),
    [currentMoment.date, currentMoment.time, panchangLoc]
  );

  const livePanchangChart = useMemo(
    () => calculateChart(livePanchangInput, settings),
    [livePanchangInput, settings]
  );

  const deepPanchangNow = useMemo(
    () =>
      computeDeepPanchangMuhurta(
        currentMoment.date,
        currentMoment.time,
        panchangLoc.latitude,
        panchangLoc.longitude,
        livePanchangChart.offsetMinutesUsed,
        settings,
        'purnimanta',
        livePanchangChart
      ),
    [currentMoment.date, currentMoment.time, panchangLoc, livePanchangChart, settings]
  );

  const muhurtaSuiteToday = useMemo(
    () =>
      computeDailyChoghadiyaAndGowri(
        currentMoment.date,
        panchangLoc.latitude,
        panchangLoc.longitude,
        livePanchangChart.offsetMinutesUsed
      ),
    [currentMoment.date, panchangLoc.latitude, panchangLoc.longitude, livePanchangChart.offsetMinutesUsed]
  );

  // Locate current running Choghadiya & Gowri slots cleanly (handling midnight wrap)
  const currentPeriodInfo = useMemo(() => {
    const srMin = parseHhMm(muhurtaSuiteToday.sunrise);
    const ssMin = parseHhMm(muhurtaSuiteToday.sunset);
    const nowM = currentMoment.minutes;
    const isDay = srMin >= 0 && ssMin >= 0 ? nowM >= srMin && nowM < ssMin : nowM >= 360 && nowM < 1080;

    if (isDay) {
      const idx = muhurtaSuiteToday.dayChoghadiya.findIndex((s) => {
        const a = parseHhMm(s.startTime);
        const b = parseHhMm(s.endTime);
        return nowM >= a && nowM < b;
      });
      const safeIdx = idx >= 0 ? idx : 0;
      return {
        isDay: true,
        currentChog: muhurtaSuiteToday.dayChoghadiya[safeIdx],
        nextChog: muhurtaSuiteToday.dayChoghadiya[safeIdx + 1] ?? muhurtaSuiteToday.nightChoghadiya[0],
        currentGowri: muhurtaSuiteToday.dayGowri[safeIdx],
      };
    }

    const adjNow = nowM < srMin ? nowM + 1440 : nowM;
    const idx = muhurtaSuiteToday.nightChoghadiya.findIndex((s) => {
      let a = parseHhMm(s.startTime);
      let b = parseHhMm(s.endTime);
      if (a < ssMin) a += 1440;
      if (b <= a) b += 1440;
      return adjNow >= a && adjNow < b;
    });
    const safeIdx = idx >= 0 ? idx : 0;
    return {
      isDay: false,
      currentChog: muhurtaSuiteToday.nightChoghadiya[safeIdx],
      nextChog: muhurtaSuiteToday.nightChoghadiya[safeIdx + 1] ?? muhurtaSuiteToday.dayChoghadiya[0],
      currentGowri: muhurtaSuiteToday.nightGowri[safeIdx],
    };
  }, [muhurtaSuiteToday, currentMoment.minutes]);

  // Upcoming Festivals / Ekadashi / Purnima / Sankranti (next 6 from today)
  const upcomingFestivals = useMemo(() => {
    const yr = nowClock.getFullYear();
    const list = computeAnnualHinduCalendar(
      yr,
      settings.ayanamsa,
      livePanchangChart.offsetMinutesUsed,
      panchangLoc.latitude,
      panchangLoc.longitude
    );
    const nextYrList =
      nowClock.getMonth() >= 10
        ? computeAnnualHinduCalendar(
            yr + 1,
            settings.ayanamsa,
            livePanchangChart.offsetMinutesUsed,
            panchangLoc.latitude,
            panchangLoc.longitude
          )
        : [];
    return [...list, ...nextYrList]
      .filter((e) => e.date >= currentMoment.date)
      .slice(0, 6);
  }, [nowClock, settings.ayanamsa, livePanchangChart.offsetMinutesUsed, panchangLoc.latitude, panchangLoc.longitude, currentMoment.date]);

  // --- Row 3: Live Rashifal Selector ---
  const [rashifalPeriod, setRashifalPeriod] = useState<RashifalPeriod>('daily');
  const [selectedRashi, setSelectedRashi] = useState<number>(
    paramayus.exceeded ? livePanchangChart.planets.find((p) => p.id === 'Moon')?.signIndex ?? 0 : moonSignIndex
  );

  const rashifalSourceChart = paramayus.exceeded ? livePanchangChart : chart;
  const rashifalItems = useMemo(
    () => computeRashifalReport(rashifalSourceChart, currentMoment.date),
    [rashifalSourceChart, currentMoment.date]
  );
  const activeRashifal = rashifalItems[selectedRashi] ?? rashifalItems[0];

  const serviceTiles: Array<{
    id: string;
    titleEn: string;
    titleHi: string;
    icon: React.ReactNode;
    onClick: () => void;
  }> = [
    { id: 'kundli', titleEn: 'Basic Details & Kundli', titleHi: 'मूल विवरण व कुंडली', icon: <Sparkles size={18} />, onClick: () => onNavigate('basics', 'basic_details') },
    { id: 'match', titleEn: 'Kundali Matching', titleHi: 'कुंडली मिलान', icon: <Heart size={18} />, onClick: () => onNavigate('match') },
    { id: 'higher_vargas', titleEn: 'D64–D360 (D108 / D150)', titleHi: 'उच्च सूक्ष्म वर्ग (D64–D360)', icon: <Layers size={18} />, onClick: () => onNavigate('vargas', 'D108') },
    { id: 'adv_rules', titleEn: '1000+ Rules & MEP', titleHi: '1000+ उन्नत सूत्र', icon: <ShieldAlert size={18} />, onClick: () => onNavigate('predictions', 'advancedTechniques') },
    { id: 'events120', titleEn: '120-Yr Events & Q&A', titleHi: '120 वर्ष घटनाएँ', icon: <Compass size={18} />, onClick: () => onNavigate('predictions', 'eventsLedger') },
    { id: 'bnn', titleEn: 'Bhrigu Nandi Nadi', titleHi: 'भृगु नंदी नाड़ी', icon: <Activity size={18} />, onClick: () => onNavigate('predictions', 'bhriguNadi') },
    { id: 'dashas', titleEn: 'Vimshottari & Chara', titleHi: 'दशा फल व कालचक्र', icon: <Clock size={18} />, onClick: () => onNavigate('dasha', 'vimshottari') },
    { id: 'gochar', titleEn: 'Gochar & Sade Sati', titleHi: 'गोचर व साढ़ेसाती', icon: <Moon size={18} />, onClick: () => onNavigate('transits') },
    { id: 'vargas', titleEn: 'Shodashvarga D1–D60', titleHi: 'षोडशवर्ग कुंडली', icon: <Grid3x3 size={18} />, onClick: () => onNavigate('vargas', 'D9') },
    { id: 'shadbala', titleEn: 'Shadbala & Yogas', titleHi: 'षड्बल, योग व दोष', icon: <Star size={18} />, onClick: () => onNavigate('strength') },
    { id: 'sav', titleEn: 'Ashtakavarga', titleHi: 'अष्टकवर्ग व प्रस्तार', icon: <BookOpen size={18} />, onClick: () => onNavigate('ashtakavarga', 'raw') },
    { id: 'lalkitab', titleEn: 'Lal Kitab & Debt', titleHi: 'लाल किताब व ऋण', icon: <Flame size={18} />, onClick: () => onNavigate('predictions', 'branchesNumerology', 'lal_kitab') },
    { id: 'kp', titleEn: 'KP System & Cusps', titleHi: 'KP पध्दति व भाव', icon: <Layers size={18} />, onClick: () => onNavigate('predictions', 'branchesNumerology', 'kp') },
    { id: 'varsha', titleEn: 'Varshaphal (Tajika)', titleHi: 'वर्षफल व मुंथा', icon: <Sun size={18} />, onClick: () => onNavigate('predictions', 'branchesNumerology', 'varshaphal') },
    { id: 'prashna', titleEn: 'Prashna Horary', titleHi: 'प्रश्न कुंडली (1–249)', icon: <HelpCircle size={18} />, onClick: () => onNavigate('prashna') },
    { id: 'gems', titleEn: 'Gemstones & Rudraksha', titleHi: 'रत्न व रुद्राक्ष', icon: <Gem size={18} />, onClick: () => onNavigate('astro_tools', 'gems_rudraksha') },
  ];

  const handleSubmitKundali = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedName = kundaliForm.name.trim() || (isHi ? 'नया जातक' : 'New Native');
    const isUnchangedActive =
      cleanedName === activeInput.name &&
      kundaliForm.date === activeInput.date &&
      kundaliForm.time === activeInput.time &&
      Math.abs(kundaliForm.latitude - activeInput.latitude) < 1e-4 &&
      Math.abs(kundaliForm.longitude - activeInput.longitude) < 1e-4;

    if (isUnchangedActive) {
      onNavigate('basics', 'basic_details');
      return;
    }

    onQuickGenerateKundali({
      ...kundaliForm,
      id: `chart-${Date.now()}`,
      name: cleanedName,
    });
  };

  const handleSubmitMatch = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickMatchKundali(boyForm, girlForm);
  };

  const pan = livePanchangChart.panchang;

  return (
    <div className="view-stack">
      {/* Compact Active Profile & Quick Actions Bar */}
      <div className="ws-hero-strip">
        <div className="ws-hero-meta">
          <span className="portal-active-label">{isHi ? 'सक्रिय कुंडली:' : 'Active Kundali:'}</span>{' '}
          <select
            aria-label={isHi ? 'सक्रिय कुंडली चुनें' : 'Select Active Profile'}
            className="select-compact"
            value={activeInput.id}
            onChange={(e) => onSelectProfile(e.target.value)}
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({formatDateDmy(p.date)})
              </option>
            ))}
          </select>{' '}
          <span className="muted">
            · {trSign(chart.ascendant.signIndex, lang)} {isHi ? 'लग्न' : 'Lagna'} ({chart.ascendant.shortDms})
            {' · '}
            {trSign(moonSignIndex, lang)} {isHi ? 'राशि' : 'Rashi'}
            {' · '}
            {trTerm(chart.panchang.nakshatra.name, lang)} {isHi ? 'च' : 'P'}
            {chart.panchang.nakshatra.pada}
          </span>
        </div>
        <div className="ws-hero-actions">
          <button type="button" className="btn btn-secondary btn-sm" onClick={onOpenEditor}>
            <Edit3 size={13} />
            <span>{isHi ? 'विवरण / स्थान' : 'Edit Coords'}</span>
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onOpenBooklet}>
            <FileText size={13} />
            <span>{isHi ? 'PDF कुंडली' : 'Print PDF'}</span>
          </button>
          {canDeleteProfile && onDeleteProfile && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ color: 'var(--bad)' }}
              onClick={onDeleteProfile}
              title={isHi ? 'वर्तमान प्रोफ़ाइल हटाएँ' : 'Delete Active Profile'}
            >
              <Trash2 size={13} />
              <span>{isHi ? 'हटाएँ' : 'Delete'}</span>
            </button>
          )}
          <button type="button" className="btn btn-primary btn-sm" onClick={() => onNavigate('basics', 'basic_details')}>
            <Sparkles size={13} />
            <span>{isHi ? 'विवरण / कुंडली खोलें' : 'Basic Details & Chart'}</span>
          </button>
        </div>
      </div>

      {paramayus.exceeded && <ParamayusLockBanner status={paramayus} />}

      {/* ROW 1: 3-COLUMN PORTAL (KUNDALI | KUNDALI MATCHING | TODAY'S PANCHANG DETAILS) */}
      <section className="portal-triple-grid" aria-label={isHi ? 'मुख्य पोर्टल कार्ड' : 'Primary Vedic Tools'}>
        {/* CARD 1: KUNDALI / BIRTH CHART */}
        <article className="portal-card">
          <div className="portal-card-head">
            <div>
              <h3>{isHi ? 'कुंडली / जन्म पत्रिका' : 'Kundali / Birth Chart'}</h3>
              <span className="portal-card-sub">
                {isHi ? 'तुरंत निःशुल्क जन्म कुंडली बनाएँ' : 'Create Free Janam Kundli Instantly'}
              </span>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleResetKundaliForm}
              title={isHi ? 'नया विवरण लिखें' : 'New Entry'}
            >
              <RotateCcw size={13} />
              <span>{isHi ? 'नया' : 'New'}</span>
            </button>
          </div>

          <form className="portal-form-body" onSubmit={handleSubmitKundali}>
            <div className="portal-row-2">
              <label className="portal-field">
                <span>{isHi ? 'नाम' : 'Name'}</span>
                <input
                  type="text"
                  className="text-input"
                  value={kundaliForm.name}
                  onChange={(e) => setKundaliForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder={isHi ? 'जातक का नाम' : 'Enter Name'}
                  required
                />
              </label>
              <label className="portal-field">
                <span>{isHi ? 'लिंग' : 'Gender'}</span>
                <select
                  className="text-input"
                  value={kundaliForm.gender || 'male'}
                  onChange={(e) =>
                    setKundaliForm((f) => ({ ...f, gender: e.target.value as BirthInput['gender'] }))
                  }
                >
                  <option value="male">{isHi ? 'पुरुष' : 'Male'}</option>
                  <option value="female">{isHi ? 'महिला' : 'Female'}</option>
                  <option value="other">{isHi ? 'अन्य' : 'Other'}</option>
                </select>
              </label>
            </div>

            <div className="portal-row-2">
              <div className="portal-field">
                <span>{isHi ? 'जन्म तिथि (DD-MM-YYYY)' : 'Date (DD-MM-YYYY)'}</span>
                <DateDmyInput
                  compact
                  value={kundaliForm.date}
                  ariaLabel={isHi ? 'कुंडली जन्म तिथि' : 'Kundali Birth Date'}
                  onChange={(iso) => setKundaliForm((f) => ({ ...f, date: iso }))}
                />
              </div>
              <label className="portal-field">
                <span>{isHi ? 'जन्म समय (24h)' : 'Birth Time (24h)'}</span>
                <input
                  type="time"
                  step="1"
                  className="text-input mono"
                  value={kundaliForm.time}
                  onChange={(e) =>
                    setKundaliForm((f) => ({
                      ...f,
                      time: e.target.value.length === 5 ? `${e.target.value}:00` : e.target.value,
                    }))
                  }
                />
              </label>
            </div>

            <div className="portal-field">
              <span>{isHi ? 'जन्म स्थान' : 'Birth Place'}</span>
              <InlineCityAutocomplete
                value={kundaliForm.city}
                country={kundaliForm.country}
                lang={lang}
                onChangeText={(text) => setKundaliForm((f) => ({ ...f, city: text }))}
                onSelectCity={(c: CityEntry) =>
                  setKundaliForm((f) => ({
                    ...f,
                    city: c.city,
                    country: c.country,
                    latitude: Math.round(c.lat * 10000) / 10000,
                    longitude: Math.round(c.lng * 10000) / 10000,
                    timezone: c.timezone,
                    utcOffsetMinutes: undefined,
                  }))
                }
              />
            </div>

            <div className="portal-coords-hint mono">
              {Math.abs(kundaliForm.latitude).toFixed(2)}°{kundaliForm.latitude >= 0 ? 'N' : 'S'},{' '}
              {Math.abs(kundaliForm.longitude).toFixed(2)}°{kundaliForm.longitude >= 0 ? 'E' : 'W'} ·{' '}
              {kundaliForm.timezone}
            </div>

            <button type="submit" className="portal-cta-btn">
              {isHi ? 'कुंडली देखें (GET KUNDLI)' : 'GET KUNDLI'}
            </button>
          </form>
        </article>

        {/* CARD 2: KUNDALI MATCHING */}
        <article className="portal-card">
          <div className="portal-card-head">
            <div>
              <h3>{isHi ? 'कुंडली मिलान' : 'Kundali Matching'}</h3>
              <span className="portal-card-sub">
                {isHi ? '36 गुण, मांगलिक, बीज/क्षेत्र स्फुट व विवाह मुहूर्त' : '36 Guna, Beeja/Kshetra Sphuta & Vivaha Dates'}
              </span>
            </div>
            <div className="portal-pair-tabs" role="tablist">
              <button
                type="button"
                className={matchSide === 'boy' ? 'is-active' : ''}
                onClick={() => setMatchSide('boy')}
              >
                {isHi ? 'वर (Boy)' : 'Boy'}
              </button>
              <button
                type="button"
                className={matchSide === 'girl' ? 'is-active' : ''}
                onClick={() => setMatchSide('girl')}
              >
                {isHi ? 'वधू (Girl)' : 'Girl'}
              </button>
            </div>
          </div>

          <form className="portal-form-body" onSubmit={handleSubmitMatch}>
            {matchSide === 'boy' ? (
              <>
                <div className="portal-row-2">
                  <label className="portal-field">
                    <span>{isHi ? 'वर का नाम (Boy)' : "Boy's Name"}</span>
                    <input
                      type="text"
                      className="text-input"
                      value={boyForm.name}
                      onChange={(e) => setBoyForm((b) => ({ ...b, name: e.target.value, gender: 'male' }))}
                    />
                  </label>
                  <label className="portal-field">
                    <span>{isHi ? 'सहेजी प्रोफ़ाइल से चुनें' : 'Saved Profile'}</span>
                    <select
                      className="text-input"
                      value={profiles.some((p) => p.id === boyForm.id && p.name === boyForm.name) ? boyForm.id : ''}
                      onChange={(e) => {
                        const found = profiles.find((p) => p.id === e.target.value);
                        if (found) setBoyForm(found);
                      }}
                    >
                      <option value="">{isHi ? '-- नया / संपादित --' : '-- Custom --'}</option>
                      {profiles.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="portal-row-2">
                  <div className="portal-field">
                    <span>{isHi ? 'तिथि (DD-MM-YYYY)' : 'Date (DD-MM-YYYY)'}</span>
                    <DateDmyInput
                      compact
                      value={boyForm.date}
                      ariaLabel="Boy Birth Date"
                      onChange={(iso) => setBoyForm((b) => ({ ...b, date: iso, id: `boy-${Date.now()}` }))}
                    />
                  </div>
                  <label className="portal-field">
                    <span>{isHi ? 'समय (24h)' : 'Time (24h)'}</span>
                    <input
                      type="time"
                      step="1"
                      className="text-input mono"
                      value={boyForm.time}
                      onChange={(e) =>
                        setBoyForm((b) => ({
                          ...b,
                          time: e.target.value.length === 5 ? `${e.target.value}:00` : e.target.value,
                          id: `boy-${Date.now()}`,
                        }))
                      }
                    />
                  </label>
                </div>

                <div className="portal-field">
                  <span>{isHi ? 'वर का जन्म स्थान' : "Boy's Birth Place"}</span>
                  <InlineCityAutocomplete
                    value={boyForm.city}
                    country={boyForm.country}
                    lang={lang}
                    onChangeText={(text) => setBoyForm((b) => ({ ...b, city: text, id: `boy-${Date.now()}` }))}
                    onSelectCity={(c) =>
                      setBoyForm((b) => ({
                        ...b,
                        id: `boy-${Date.now()}`,
                        city: c.city,
                        country: c.country,
                        latitude: Math.round(c.lat * 10000) / 10000,
                        longitude: Math.round(c.lng * 10000) / 10000,
                        timezone: c.timezone,
                        utcOffsetMinutes: undefined,
                      }))
                    }
                  />
                </div>
              </>
            ) : (
              <>
                <div className="portal-row-2">
                  <label className="portal-field">
                    <span>{isHi ? 'वधू का नाम (Girl)' : "Girl's Name"}</span>
                    <input
                      type="text"
                      className="text-input"
                      value={girlForm.name}
                      onChange={(e) => setGirlForm((g) => ({ ...g, name: e.target.value, gender: 'female' }))}
                    />
                  </label>
                  <label className="portal-field">
                    <span>{isHi ? 'सहेजी प्रोफ़ाइल से चुनें' : 'Saved Profile'}</span>
                    <select
                      className="text-input"
                      value={profiles.some((p) => p.id === girlForm.id && p.name === girlForm.name) ? girlForm.id : ''}
                      onChange={(e) => {
                        const found = profiles.find((p) => p.id === e.target.value);
                        if (found) setGirlForm(found);
                      }}
                    >
                      <option value="">{isHi ? '-- नया / संपादित --' : '-- Custom --'}</option>
                      {profiles.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="portal-row-2">
                  <div className="portal-field">
                    <span>{isHi ? 'तिथि (DD-MM-YYYY)' : 'Date (DD-MM-YYYY)'}</span>
                    <DateDmyInput
                      compact
                      value={girlForm.date}
                      ariaLabel="Girl Birth Date"
                      onChange={(iso) => setGirlForm((g) => ({ ...g, date: iso, id: `girl-${Date.now()}` }))}
                    />
                  </div>
                  <label className="portal-field">
                    <span>{isHi ? 'समय (24h)' : 'Time (24h)'}</span>
                    <input
                      type="time"
                      step="1"
                      className="text-input mono"
                      value={girlForm.time}
                      onChange={(e) =>
                        setGirlForm((g) => ({
                          ...g,
                          time: e.target.value.length === 5 ? `${e.target.value}:00` : e.target.value,
                          id: `girl-${Date.now()}`,
                        }))
                      }
                    />
                  </label>
                </div>

                <div className="portal-field">
                  <span>{isHi ? 'वधू का जन्म स्थान' : "Girl's Birth Place"}</span>
                  <InlineCityAutocomplete
                    value={girlForm.city}
                    country={girlForm.country}
                    lang={lang}
                    onChangeText={(text) => setGirlForm((g) => ({ ...g, city: text, id: `girl-${Date.now()}` }))}
                    onSelectCity={(c) =>
                      setGirlForm((g) => ({
                        ...g,
                        id: `girl-${Date.now()}`,
                        city: c.city,
                        country: c.country,
                        latitude: Math.round(c.lat * 10000) / 10000,
                        longitude: Math.round(c.lng * 10000) / 10000,
                        timezone: c.timezone,
                        utcOffsetMinutes: undefined,
                      }))
                    }
                  />
                </div>
              </>
            )}

            <div className="portal-pair-summary">
              <span>
                <strong>{isHi ? 'वर:' : 'Boy:'}</strong> {boyForm.name} ({formatDateDmy(boyForm.date)})
              </span>
              <span>
                <strong>{isHi ? 'वधू:' : 'Girl:'}</strong> {girlForm.name} ({formatDateDmy(girlForm.date)})
              </span>
            </div>

            <button type="submit" className="portal-cta-btn">
              {isHi ? 'मिलान करें (MATCH KUNDLI)' : 'MATCH KUNDLI'}
            </button>
          </form>
        </article>

        {/* CARD 3: TODAY'S PANCHANG DETAILS */}
        <article className="portal-card">
          <div className="portal-card-head">
            <div>
              <h3>{isHi ? 'आज का पंचांग' : "Today's Panchang Details"}</h3>
              <span className="portal-card-sub mono">
                {formatDateDmy(currentMoment.date)} · {panchangLoc.city}
              </span>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setNowClock(new Date())}
              title={isHi ? 'वर्तमान समय अपडेट करें' : 'Refresh Live Moment'}
            >
              <RefreshCw size={13} />
            </button>
          </div>

          <div className="portal-panchang-body">
            <div className="portal-panchang-city-bar">
              <InlineCityAutocomplete
                value={panchangLoc.city}
                lang={lang}
                placeholder={isHi ? 'पंचांग शहर बदलें...' : 'Change Panchang city...'}
                onChangeText={(city) => setPanchangLoc((p) => ({ ...p, city }))}
                onSelectCity={(c) =>
                  setPanchangLoc({
                    city: c.city,
                    country: c.country,
                    latitude: c.lat,
                    longitude: c.lng,
                    timezone: c.timezone,
                  })
                }
              />
            </div>

            <div className="portal-panchang-rows">
              <div className="panchang-kv">
                <span>{isHi ? 'वार / मास / ऋतु' : 'Vara / Lunar Month / Ritu'}</span>
                <strong>
                  {trTerm(pan.vara.name, lang)} · {isHi ? deepPanchangNow.activeMasaHi : deepPanchangNow.activeMasaEn} ·{' '}
                  <span className="muted small-text">{isHi ? deepPanchangNow.rituHi : deepPanchangNow.rituEn}</span>
                </strong>
              </div>
              <div className="panchang-kv is-highlight">
                <span>{isHi ? 'तिथि एवं पक्ष' : 'Tithi & Paksha'}</span>
                <strong>
                  {trTerm(pan.tithi.name, lang)} ({trTerm(pan.tithi.paksha, lang)}) · {pan.tithi.percentRemaining}% {isHi ? 'शेष' : 'left'}
                </strong>
              </div>
              <div className="panchang-kv">
                <span>{isHi ? 'नक्षत्र / चरण' : 'Nakshatra & Pada'}</span>
                <strong>
                  {trTerm(pan.nakshatra.name, lang)} ({isHi ? 'चरण' : 'P'} {pan.nakshatra.pada})
                </strong>
              </div>
              <div className="panchang-kv">
                <span>{isHi ? 'योग / करण' : 'Yoga / Karana'}</span>
                <strong>
                  {trTerm(pan.yoga.name, lang)} / {trTerm(pan.karana.name, lang)}
                </strong>
              </div>
              <div className="panchang-kv">
                <span>{isHi ? 'सूर्योदय / सूर्यास्त' : 'Sunrise / Sunset'}</span>
                <strong className="mono">
                  {pan.sunriseLocal} / {pan.sunsetLocal}
                </strong>
              </div>
              <div className="panchang-kv">
                <span>{isHi ? 'चंद्रोदय / चंद्रास्त' : 'Moonrise / Moonset'}</span>
                <strong className="mono">
                  {pan.moonriseLocal} / {pan.moonsetLocal}
                </strong>
              </div>
              <div className="panchang-kv is-warn">
                <span>{isHi ? 'राहुकाल' : 'Rahu Kalam'}</span>
                <strong className="mono">{pan.rahuKalam}</strong>
              </div>
              <div className="panchang-kv">
                <span>{isHi ? 'अभिजित मुहूर्त' : 'Abhijit Muhurta'}</span>
                <strong className="mono">{pan.abhijitMuhurta}</strong>
              </div>
            </div>

            <button
              type="button"
              className="portal-cta-btn"
              onClick={() => onNavigate('tools', 'deep_panchang')}
            >
              {isHi ? 'संपूर्ण पंचांग देखें' : 'DETAILED PANCHANG'}
            </button>
          </div>
        </article>
      </section>

      {/* ROW 2: LEFT (FREE ASTROLOGY TILES) + RIGHT (PANCHANG OF CURRENT PERIOD & FESTIVALS) */}
      <section className="portal-main-split">
        {/* LEFT COLUMN: 4x4 CLEAN SERVICES TILE GRID */}
        <article className="portal-panel">
          <div className="portal-panel-header">
            <h3>
              {isHi
                ? 'निःशुल्क ज्योतिष एवं कुंडली सेवाएँ'
                : 'Free Horoscope, Kundali & Predictive Services'}
            </h3>
            <span className="muted small-text">{activeInput.name}</span>
          </div>

          <div className="portal-services-grid">
            {serviceTiles.map((tile) => (
              <button
                key={tile.id}
                type="button"
                className="portal-service-tile"
                onClick={tile.onClick}
              >
                <span className="portal-tile-icon">{tile.icon}</span>
                <span className="portal-tile-label">{isHi ? tile.titleHi : tile.titleEn}</span>
              </button>
            ))}
          </div>

          <div className="portal-services-footer">
            <button type="button" onClick={() => onNavigate('predictions', 'pastFuture')}>
              {isHi ? 'पूर्व जन्म व भविष्य' : 'Past Life & Future'}
            </button>
            <button type="button" onClick={() => onNavigate('predictions', 'bhavesha144')}>
              {isHi ? '144 भावेश तालिका' : '144 House-Lord Matrix'}
            </button>
            <button type="button" onClick={() => onNavigate('astro_tools', 'numerology')}>
              {isHi ? 'अंक ज्योतिष व लो-शू ग्रिड' : 'Numerology & Lo Shu Grid'}
            </button>
            <button type="button" onClick={() => onNavigate('astro_tools', 'baby_names')}>
              {isHi ? 'शिशु नाम (108 अक्षर)' : '108 Nakshatra Baby Names'}
            </button>
            <button type="button" onClick={() => onNavigate('tools', 'muhurta')}>
              {isHi ? '10-वर्ष मुहूर्त व ग्रहण पंचांग' : 'Muhurta & 10-Yr Calendar'}
            </button>
          </div>
        </article>

        {/* RIGHT COLUMN: PANCHANG OF CURRENT PERIOD + UPCOMING FESTIVALS */}
        <div className="portal-right-stack">
          <article className="portal-panel">
            <div className="portal-panel-header">
              <h3>
                <Clock size={14} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                {isHi ? 'वर्तमान काल पंचांग व चौघड़िया' : 'Panchang of Current Period'}
              </h3>
              <span className="tag mono">{currentMoment.time.slice(0, 5)}</span>
            </div>

            <div className="portal-panchang-rows compact">
              <div className="panchang-kv is-highlight">
                <span>{isHi ? 'वर्तमान चौघड़िया' : 'Running Choghadiya'}</span>
                <strong>
                  {isHi ? currentPeriodInfo.currentChog?.nameHi : currentPeriodInfo.currentChog?.nameEn} (
                  {isHi
                    ? currentPeriodInfo.currentChog?.qualityLabelHi
                    : currentPeriodInfo.currentChog?.qualityLabelEn}
                  ) · <span className="mono">{currentPeriodInfo.currentChog?.startTime}–{currentPeriodInfo.currentChog?.endTime}</span>
                </strong>
              </div>
              <div className="panchang-kv">
                <span>{isHi ? 'अगला चौघड़िया' : 'Next Choghadiya'}</span>
                <strong>
                  {isHi ? currentPeriodInfo.nextChog?.nameHi : currentPeriodInfo.nextChog?.nameEn} ·{' '}
                  <span className="mono">
                    {currentPeriodInfo.nextChog?.startTime}–{currentPeriodInfo.nextChog?.endTime}
                  </span>
                </strong>
              </div>
              <div className="panchang-kv">
                <span>{isHi ? 'गौरी पंचांगम' : 'Gowri Panchangam'}</span>
                <strong>{isHi ? currentPeriodInfo.currentGowri?.nameHi : currentPeriodInfo.currentGowri?.nameEn}</strong>
              </div>
              <div className="panchang-kv">
                <span>{isHi ? 'सक्रिय होरा स्वामी' : 'Active Planetary Hora'}</span>
                <strong>{trPlanet(pan.horaLord, lang)}</strong>
              </div>
              <div className="panchang-kv">
                <span>{isHi ? 'विक्रम संवत / संवत्सर' : 'Samvat & Samvatsara'}</span>
                <strong>
                  VS {deepPanchangNow.vikramSamvat} ·{' '}
                  {isHi ? deepPanchangNow.samvatsaraHi : deepPanchangNow.samvatsaraEn}
                </strong>
              </div>
              <div className="panchang-kv">
                <span>{isHi ? 'दिशाशूल / वास' : 'Disha Shool / Vaasa'}</span>
                <strong>
                  {isHi ? deepPanchangNow.dishaShool.directionHi : deepPanchangNow.dishaShool.directionEn} ·{' '}
                  {isHi ? deepPanchangNow.vaasa.shivaStateHi : deepPanchangNow.vaasa.shivaStateEn}
                </strong>
              </div>
            </div>

            <div className="portal-panel-foot-link">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => onNavigate('transits')}>
                {isHi ? 'पूर्ण चौघड़िया व गोचर खोलें' : 'Full Choghadiya & Gowri Table →'}
              </button>
            </div>
          </article>

          <article className="portal-panel">
            <div className="portal-panel-header">
              <h3>
                <Calendar size={14} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                {isHi ? 'आगामी व्रत, एकादशी व पर्व' : 'Upcoming Vrat, Festivals & Sankranti'}
              </h3>
            </div>
            <div className="portal-fest-list">
              {upcomingFestivals.map((f, idx) => (
                <div key={`${f.date}-${idx}`} className="portal-fest-row">
                  <span className="mono portal-fest-date">{formatDateDmy(f.date)}</span>
                  <span className="portal-fest-name">{isHi ? f.nameHi : f.nameEn}</span>
                </div>
              ))}
            </div>
            <div className="portal-panel-foot-link">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => onNavigate('tools', 'calendar')}>
                {isHi ? 'वार्षिक हिंदू पंचांग खोलें' : 'Open Annual Hindu Calendar →'}
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* ROW 3: HOROSCOPE / RASHIFAL BAR (DAILY / WEEKLY / MONTHLY / YEARLY) */}
      <section className="portal-panel">
        <div className="portal-panel-header">
          <div>
            <h3>
              {isHi
                ? 'राशिफल — आज, साप्ताहिक, मासिक एवं वार्षिक'
                : 'Horoscope (Rashifal) — Daily, Weekly, Monthly & Yearly'}
            </h3>
          </div>
          <div className="portal-pair-tabs" role="tablist">
            {(
              [
                ['daily', isHi ? 'दैनिक' : 'Daily'],
                ['tomorrow', isHi ? 'कल' : 'Tomorrow'],
                ['weekly', isHi ? 'साप्ताहिक' : 'Weekly'],
                ['weekly_love', isHi ? 'प्रेम सप्ताह' : 'Love'],
                ['monthly', isHi ? 'मासिक' : 'Monthly'],
                ['yearly', isHi ? 'वार्षिक' : 'Yearly'],
              ] as const
            ).map(([k, lbl]) => (
              <button
                key={k}
                type="button"
                className={rashifalPeriod === k ? 'is-active' : ''}
                onClick={() => setRashifalPeriod(k)}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>

        <div className="portal-rashi-strip" role="tablist" aria-label="12 Zodiac Signs">
          {Array.from({ length: 12 }, (_, idx) => {
            const isNatal = !paramayus.exceeded && idx === moonSignIndex;
            return (
              <button
                key={idx}
                type="button"
                className={`portal-rashi-pill ${selectedRashi === idx ? 'is-active' : ''}`}
                onClick={() => setSelectedRashi(idx)}
              >
                <span>{trSign(idx, lang)}</span>
                {isNatal && <small className="portal-natal-dot" title={isHi ? 'जन्म राशि' : 'Natal Moon'}>★</small>}
              </button>
            );
          })}
        </div>

        {activeRashifal && (
          <div className="portal-rashifal-readout">
            <div className="portal-rashifal-top">
              <strong>
                {trSign(selectedRashi, lang)} ({formatDateDmy(currentMoment.date)})
              </strong>
              <span className="tag tag-varg">
                {isHi ? activeRashifal.moodHi : activeRashifal.moodEn} · {activeRashifal.score}/100
              </span>
            </div>
            <p className="domain-summary" style={{ margin: '6px 0 8px' }}>
              {rashifalPeriod === 'daily'
                ? isHi
                  ? activeRashifal.dailyHi
                  : activeRashifal.dailyEn
                : rashifalPeriod === 'tomorrow'
                  ? isHi
                    ? activeRashifal.tomorrowHi
                    : activeRashifal.tomorrowEn
                  : rashifalPeriod === 'weekly'
                    ? isHi
                      ? activeRashifal.weeklyHi
                      : activeRashifal.weeklyEn
                    : rashifalPeriod === 'weekly_love'
                      ? isHi
                        ? activeRashifal.weeklyLoveHi
                        : activeRashifal.weeklyLoveEn
                      : rashifalPeriod === 'monthly'
                        ? isHi
                          ? activeRashifal.monthlyHi
                          : activeRashifal.monthlyEn
                        : isHi
                          ? activeRashifal.yearlyHi
                          : activeRashifal.yearlyEn}
            </p>
            <div className="portal-rashifal-meta">
              <span>
                <strong>{isHi ? 'करियर:' : 'Career:'}</strong>{' '}
                {isHi ? activeRashifal.careerHi : activeRashifal.careerEn}
              </span>
              <span>
                <strong>{isHi ? 'शुभ रंग / अंक:' : 'Lucky:'}</strong>{' '}
                {isHi ? activeRashifal.luckyColorHi : activeRashifal.luckyColorEn} · {activeRashifal.luckyNumber}
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => onNavigate('astro_tools', 'rashifal')}
              >
                {isHi ? 'संपूर्ण 12-राशि फल पढ़ें →' : 'Read All 12 Rashis →'}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
