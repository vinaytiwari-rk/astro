import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Edit3,
  FileText,
  Globe,
  Grid3x3,
  Heart,
  HelpCircle,
  Layers,
  Moon,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  Star,
  Sun,
  User,
} from 'lucide-react';
import { calculateChart } from '../astro/calculator';
import { SIGNS } from '../astro/constants';
import { computeDailyChoghadiyaAndGowri } from '../astro/panchangExtra';
import { computeRashifalReport, type RashiForecastItem } from '../astro/rashifalBabyRudraksha';
import { formatDateDmy } from '../astro/time';
import type { BirthInput, CalcSettings, ChartData } from '../astro/types';
import type { CityEntry } from '../data/cities';
import { useLanguage } from '../i18n/LanguageContext';
import { trPlanet, trSign } from '../i18n/translations';
import { DateDmyInput } from './DateDmyInput';
import { InlineCityAutocomplete } from './InlineCityAutocomplete';

interface OnlineJyotishHomePortalProps {
  chart: ChartData;
  activeInput: BirthInput;
  profiles: BirthInput[];
  settings: CalcSettings;
  onSelectProfile: (id: string) => void;
  onNavigate: (view: string, sub?: string) => void;
  onOpenEditor: () => void;
  onOpenBooklet: () => void;
  onApplyBirthInput: (input: BirthInput) => void;
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

export const OnlineJyotishHomePortal: React.FC<OnlineJyotishHomePortalProps> = ({
  chart,
  activeInput,
  profiles,
  settings,
  onSelectProfile,
  onNavigate,
  onOpenEditor,
  onOpenBooklet,
  onApplyBirthInput,
}) => {
  const { lang, setLang } = useLanguage();
  const isHi = lang === 'hi';

  // --- Quick Kundli Generator Form ---
  const [quickForm, setQuickForm] = useState<BirthInput>(activeInput);
  useEffect(() => {
    setQuickForm(activeInput);
  }, [activeInput]);

  const handleCitySelect = (entry: CityEntry) => {
    setQuickForm((prev) => ({
      ...prev,
      city: entry.city,
      country: entry.country,
      latitude: entry.lat,
      longitude: entry.lng,
      timezone: entry.timezone,
    }));
  };

  const handleGenerateKundli = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyBirthInput(quickForm);
    onNavigate('vedic-horoscope');
  };

  // --- Real-time Live Panchang & Muhurta ---
  const [nowClock, setNowClock] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNowClock(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const currentMoment = useMemo(() => getLocalIsoAndTime(nowClock), [nowClock]);

  const livePanchangInput: BirthInput = useMemo(
    () => ({
      id: 'live-portal-panchang',
      name: 'Current Moment',
      gender: 'other',
      date: currentMoment.date,
      time: currentMoment.time,
      timezone: activeInput.timezone || 'Asia/Kolkata',
      city: activeInput.city || 'New Delhi',
      country: activeInput.country || 'India',
      latitude: activeInput.latitude || 28.6139,
      longitude: activeInput.longitude || 77.209,
    }),
    [currentMoment.date, currentMoment.time, activeInput]
  );

  const livePanchangChart = useMemo(
    () => calculateChart(livePanchangInput, settings),
    [livePanchangInput, settings]
  );

  const choghadiyaToday = useMemo(
    () =>
      computeDailyChoghadiyaAndGowri(
        currentMoment.date,
        activeInput.latitude || 28.6139,
        activeInput.longitude || 77.209,
        livePanchangChart.offsetMinutesUsed
      ),
    [currentMoment.date, activeInput, livePanchangChart.offsetMinutesUsed]
  );

  // Active running Choghadiya
  const activeChoghadiya = useMemo(() => {
    const srMin = parseHhMm(choghadiyaToday.sunrise);
    const ssMin = parseHhMm(choghadiyaToday.sunset);
    const nowM = currentMoment.minutes;
    const isDay = srMin >= 0 && ssMin >= 0 ? nowM >= srMin && nowM < ssMin : nowM >= 360 && nowM < 1080;
    const slots = isDay ? choghadiyaToday.dayChoghadiya : choghadiyaToday.nightChoghadiya;
    const current = slots.find((s) => {
      const a = parseHhMm(s.startTime);
      const b = parseHhMm(s.endTime);
      return nowM >= a && nowM < b;
    });
    return current || slots[0];
  }, [choghadiyaToday, currentMoment.minutes]);

  // Rashifal Report (12 items)
  const rashifalReport: RashiForecastItem[] = useMemo(
    () => computeRashifalReport(chart, currentMoment.date),
    [chart, currentMoment.date]
  );

  const [selectedRashiIdx, setSelectedRashiIdx] = useState<number>(0);

  // Search box state
  const [searchQuery, setSearchQuery] = useState('');

  const activeRashiItem = rashifalReport[selectedRashiIdx] || rashifalReport[0];

  return (
    <div className="oj-portal-root">
      {/* 1. Header Emblem & Hero Section */}
      <section className="oj-hero-banner">
        <div className="oj-hero-container">
          <div className="oj-emblem-row">
            <div className="oj-emblem-badge">
              <span className="oj-om-symbol" aria-hidden="true">ॐ</span>
              <div className="oj-emblem-text">
                <span className="oj-site-title">AV Astro Vibe</span>
                <span className="oj-site-org">{isHi ? 'वैदिक ज्योतिष, पंचांग एवं संपूर्ण फलादेश' : 'Vedic Astrology, Panchang & Free Predictions'}</span>
              </div>
            </div>
            <div className="oj-hero-tag">
              <span className="oj-pill-badge">{isHi ? '100% निःशुल्क वैदिक ज्योतिष सॉफ्टवेयर' : '100% Free Vedic Astrology Software'}</span>
              <span className="oj-pill-sub">{isHi ? 'कोई पंजीकरण या सशुल्क सेवा नहीं' : 'No Registration · Zero Paid Barrier'}</span>
            </div>
          </div>

          <h1 className="oj-hero-heading">
            {isHi ? 'दैनिक जीवन के प्रश्नों हेतु प्रामाणिक वैदिक ज्योतिष' : 'Vedic astrology for your everyday questions'}
          </h1>
          <p className="oj-hero-subtitle">
            {isHi
              ? 'जन्म कुंडली बनाएं, स्थानीय पंचांग देखें, कुंडली मिलान करें, दैनिक व वार्षिक राशिफल पढ़ें और विशिष्ट ज्योतिषीय कैलकुलेटरों का उपयोग करें। हमारे सॉफ्टवेयर में समस्त गणनाएं, भविष्यवाणियां एवं संपूर्ण जन्म पत्रिका (Birth Report) पूर्णतः निःशुल्क हैं।'
              : 'Create a Janam Kundli, check your local Panchang, compare horoscopes, read Rashifal and use specialist astrology calculators. 100% free calculators and complete Birth Report PDF documents, with no registration required.'}
          </p>

          {/* 4 Hero Action Buttons */}
          <div className="oj-hero-actions-grid">
            <button
              type="button"
              className="oj-btn-hero-primary"
              onClick={() => onNavigate('vedic-horoscope')}
            >
              <FileText size={17} />
              <span>{isHi ? 'निःशुल्क कुंडली बनाएं' : 'Create free Kundli'}</span>
            </button>

            <button
              type="button"
              className="oj-btn-hero-secondary"
              onClick={() => onNavigate('daily-panchanga')}
            >
              <Calendar size={17} />
              <span>{isHi ? 'पंचांग देखें' : 'View Panchang'}</span>
            </button>

            <button
              type="button"
              className="oj-btn-hero-secondary"
              onClick={() => onNavigate('marriage-matching')}
            >
              <Heart size={17} />
              <span>{isHi ? 'कुंडली मिलान' : 'Check matching'}</span>
            </button>

            <button
              type="button"
              className="oj-btn-hero-secondary"
              onClick={() => onNavigate('general-prediction')}
            >
              <Sparkles size={17} />
              <span>{isHi ? 'सामान्य फलादेश' : 'General Prediction'}</span>
            </button>

            <button
              type="button"
              className="oj-btn-hero-secondary"
              onClick={() => onNavigate('general-prediction')}
            >
              <Star size={17} />
              <span>{isHi ? 'सामान्य फलादेश' : 'General Prediction'}</span>
            </button>
          </div>

          {/* Quick Feature Pills Bar */}
          <div className="oj-quick-pills-row">
            <button type="button" className="oj-link-pill" onClick={() => onNavigate('general-prediction')}>
              {isHi ? 'सामान्य फलादेश' : 'General Prediction'}
            </button>
            <button type="button" className="oj-link-pill" onClick={() => onNavigate('vedic-horoscope')}>
              {isHi ? 'जन्म कुंडली (Kundli)' : 'Birth chart (Kundli)'}
            </button>
            <button type="button" className="oj-link-pill" onClick={() => onNavigate('kp-horoscope')}>
              {isHi ? 'KP कुंडली (KP System)' : 'KP horoscope'}
            </button>
            <button type="button" className="oj-link-pill" onClick={() => onNavigate('baby-names')}>
              {isHi ? 'शिशु नामकरण (Newborn)' : 'Newborn horoscope'}
            </button>
            <button type="button" className="oj-link-pill" onClick={() => onNavigate('marriage-matching')}>
              {isHi ? 'गुण मिलान व दोष भंग' : 'Guna Milan with Dosha Bhanga'}
            </button>
            <button type="button" className="oj-link-pill" onClick={() => onNavigate('marriage-matching')}>
              {isHi ? 'नक्षत्र मिलान' : 'Nakshatra Matching'}
            </button>
            <button type="button" className="oj-link-pill" onClick={() => onNavigate('marriage-matching')}>
              {isHi ? 'दश कूट मिलान' : 'Dasha Koota matching'}
            </button>
            <button type="button" className="oj-link-pill" onClick={() => onNavigate('general-prediction')}>
              {isHi ? 'सामान्य फलादेश' : 'General Prediction'}
            </button>
            <button type="button" className="oj-link-pill" onClick={() => onNavigate('transit-calendar')}>
              {isHi ? '365-दिवसीय गोचर कैलेंडर' : '365-Day Transit Calendar'}
            </button>
            <button type="button" className="oj-link-pill" onClick={() => onNavigate('financial-astrology')}>
              {isHi ? 'शेयर बाजार व इंदु लग्न' : 'Financial Astrology & Indu Lagna'}
            </button>
            <button type="button" className="oj-link-pill" onClick={() => onNavigate('samudrika-shastra')}>
              {isHi ? 'सामुद्रिक शास्त्र व हस्तरेखा' : 'Samudrika Shastra & Palmistry'}
            </button>
            <button type="button" className="oj-link-pill" onClick={onOpenBooklet}>
              {isHi ? 'जन्म पत्रिका PDF (निःशुल्क)' : 'Birth Report PDF (Free)'}
            </button>
          </div>
        </div>
      </section>

      {/* 2. Quick Birth Entry & Native Profile Card */}
      <section className="oj-section oj-quick-entry-section">
        <div className="oj-container">
          <div className="oj-entry-card">
            <div className="oj-entry-header">
              <div>
                <h3 className="oj-entry-title">
                  <User size={18} />
                  {isHi ? 'त्वरित जन्म विवरण प्रविष्टि (Quick Birth Entry)' : 'Quick Birth Details & Instant Horoscope'}
                </h3>
                <p className="oj-entry-sub">
                  {isHi
                    ? 'जातक का नाम, जन्म दिनांक, समय व स्थान दर्ज करें। तुरंत संपूर्ण कुंडली गणना व फलादेश प्राप्त करें।'
                    : 'Enter birth date, exact time, and location to generate comprehensive Vedic calculations.'}
                </p>
              </div>
              <div className="oj-profile-switch-inline">
                <span className="small-text muted">{isHi ? 'सहेजे गए जातक:' : 'Saved Native:'}</span>
                <select
                  aria-label="Select Saved Native Profile"
                  value={activeInput.id}
                  onChange={(e) => onSelectProfile(e.target.value)}
                  className="oj-select-profile"
                >
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({formatDateDmy(p.date)} · {p.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <form onSubmit={handleGenerateKundli} className="oj-entry-form-grid">
              <div className="oj-form-group">
                <label>{isHi ? 'जातक का नाम' : 'Native Name'}</label>
                <input
                  type="text"
                  required
                  placeholder={isHi ? 'नाम दर्ज करें' : 'Enter full name'}
                  value={quickForm.name}
                  onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                  className="oj-input"
                />
              </div>

              <div className="oj-form-group">
                <label>{isHi ? 'लिंग' : 'Gender'}</label>
                <select
                  value={quickForm.gender}
                  onChange={(e) => setQuickForm({ ...quickForm, gender: e.target.value as any })}
                  className="oj-input"
                >
                  <option value="male">{isHi ? 'पुरुष (Male)' : 'Male'}</option>
                  <option value="female">{isHi ? 'स्त्री (Female)' : 'Female'}</option>
                  <option value="other">{isHi ? 'अन्य (Other)' : 'Other'}</option>
                </select>
              </div>

              <div className="oj-form-group">
                <label>{isHi ? 'जन्म दिनांक (DD-MM-YYYY)' : 'Date of Birth (DD-MM-YYYY)'}</label>
                <DateDmyInput
                  value={quickForm.date}
                  onChange={(d) => setQuickForm({ ...quickForm, date: d })}
                  className="oj-input"
                />
              </div>

              <div className="oj-form-group">
                <label>{isHi ? 'जन्म समय (HH:MM:SS)' : 'Time of Birth (HH:MM:SS)'}</label>
                <input
                  type="time"
                  step="1"
                  required
                  value={quickForm.time.slice(0, 8)}
                  onChange={(e) => setQuickForm({ ...quickForm, time: e.target.value })}
                  className="oj-input"
                />
              </div>

              <div className="oj-form-group oj-form-group-full">
                <label>{isHi ? 'जन्म स्थान (शहर/राज्य/देश)' : 'Birth Place (City, State, Country)'}</label>
                <InlineCityAutocomplete
                  value={quickForm.city}
                  country={quickForm.country}
                  lang={lang}
                  placeholder={isHi ? 'शहर का नाम खोजें (उदा. Delhi, Mumbai, London)...' : 'Search city or birthplace...'}
                  onChangeText={(txt) => setQuickForm((prev) => ({ ...prev, city: txt }))}
                  onSelectCity={handleCitySelect}
                />
              </div>

              <div className="oj-form-actions oj-form-group-full">
                <button type="submit" className="oj-btn-primary">
                  <FileText size={16} />
                  <span>{isHi ? 'जन्म कुंडली बनाएं (Open Kundli) →' : 'Generate Janam Kundli →'}</span>
                </button>
                <button
                  type="button"
                  className="oj-btn-outline"
                  onClick={() => {
                    onApplyBirthInput(quickForm);
                    onOpenBooklet();
                  }}
                >
                  <BookOpen size={16} />
                  <span>{isHi ? 'संपूर्ण जन्म पत्रिका PDF खोलें' : 'Open Birth Report (जन्म पत्रिका)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 3. Live Today's Panchang & Transits Bar */}
      <section className="oj-section oj-live-panchang-section">
        <div className="oj-container">
          <div className="oj-panchang-strip">
            <div className="oj-strip-head">
              <div className="oj-strip-title">
                <Clock size={16} />
                <strong>{isHi ? 'आज का स्थानीय पंचांग एवं ग्रह गोचर' : "Today's Live Panchang & Planetary Transits"}</strong>
                <span className="oj-badge-city">{activeInput.city || 'New Delhi'} · {formatDateDmy(currentMoment.date)}</span>
              </div>
              <button
                type="button"
                className="oj-btn-text"
                onClick={() => onNavigate('panchang')}
              >
                <span>{isHi ? 'विस्तृत पंचांग खोलें →' : 'View Full Panchang →'}</span>
              </button>
            </div>

            <div className="oj-strip-grid">
              <div className="oj-strip-item">
                <span className="oj-label">{isHi ? 'तिथि:' : 'Tithi:'}</span>
                <span className="oj-val">
                  {livePanchangChart.panchang.tithi.name} ({livePanchangChart.panchang.tithi.paksha})
                </span>
              </div>
              <div className="oj-strip-item">
                <span className="oj-label">{isHi ? 'नक्षत्र:' : 'Nakshatra:'}</span>
                <span className="oj-val">
                  {livePanchangChart.panchang.nakshatra.name} (P{livePanchangChart.panchang.nakshatra.pada})
                </span>
              </div>
              <div className="oj-strip-item">
                <span className="oj-label">{isHi ? 'योग / करण:' : 'Yoga / Karana:'}</span>
                <span className="oj-val">
                  {livePanchangChart.panchang.yoga.name} · {livePanchangChart.panchang.karana.name}
                </span>
              </div>
              <div className="oj-strip-item">
                <span className="oj-label">{isHi ? 'सूर्योदय / सूर्यास्त:' : 'Sun Rise / Set:'}</span>
                <span className="oj-val">{choghadiyaToday.sunrise} · {choghadiyaToday.sunset}</span>
              </div>
              <div className="oj-strip-item">
                <span className="oj-label">{isHi ? 'राहु काल:' : 'Rahu Kalam:'}</span>
                <span className="oj-val" style={{ color: 'var(--bad, #b91c1c)' }}>
                  {livePanchangChart.panchang.rahuKalam || '--'}
                </span>
              </div>
              <div className="oj-strip-item">
                <span className="oj-label">{isHi ? 'वर्तमान चौघड़िया:' : 'Active Choghadiya:'}</span>
                <span
                  className="oj-val"
                  style={{
                    color: activeChoghadiya.quality === 'best' || activeChoghadiya.quality === 'good' ? 'var(--good, #15803d)' : 'var(--warn, #b45309)',
                    fontWeight: 600,
                  }}
                >
                  {isHi ? activeChoghadiya.nameHi : activeChoghadiya.nameEn} ({activeChoghadiya.startTime} - {activeChoghadiya.endTime})
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Service Hubs Grid ("Choose the service you need") */}
      <section className="oj-section">
        <div className="oj-container">
          <div className="oj-section-header">
            <h2 className="oj-section-title">
              {isHi ? 'अपनी आवश्यकतानुसार सेवा चुनें (Choose the service you need)' : 'Choose the service you need'}
            </h2>
            <p className="oj-section-desc">
              {isHi
                ? 'प्रत्येक उपकरण विशिष्ट शास्त्रीय प्रयोजन हेतु निर्मित है। संबंधित सेवा खोलें और प्रामाणिक फलादेश प्राप्त करें।'
                : 'Each tool below is designed for a specific purpose. Open the relevant service and enter only the details needed for that calculation.'}
            </p>
          </div>

          <div className="oj-services-grid">
            {/* Card 1: Free Janam Kundli */}
            <article className="oj-service-card">
              <div className="oj-card-badge-row">
                <span className="oj-card-tag">{isHi ? 'सर्वाधिक लोकप्रिय' : 'Most Popular'}</span>
              </div>
              <h3 className="oj-card-title">{isHi ? 'निःशुल्क जन्म कुंडली (Free Janam Kundli)' : 'Free Janam Kundli'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? 'लग्न, राशि, नक्षत्र, ग्रह स्थिति, षोडशवर्ग (D-1 से D-60) तथा विंशोत्तरी व त्रिभागी दशा विवरण के साथ प्रामाणिक वैदिक कुंडली बनाएं।'
                  : 'Create a Vedic birth chart with Lagna, Rashi, Nakshatra, planetary positions, divisional charts and Vimshottari Dasha details.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('vedic-horoscope')}
              >
                <span>{isHi ? 'कुंडली बनाएं →' : 'Create your Kundli →'}</span>
              </button>
            </article>

            {/* Card 2: Daily Panchang */}
            <article className="oj-service-card">
              <div className="oj-card-badge-row">
                <span className="oj-card-tag">{isHi ? 'दैनिक पंचांग' : 'Daily Panchang'}</span>
              </div>
              <h3 className="oj-card-title">{isHi ? 'दैनिक एवं मासिक पंचांग (Daily Panchang)' : 'Daily Panchang'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? 'तिथि, नक्षत्र, योग, करण, सूर्योदय, सूर्यास्त, राहु काल, चौघड़िया, होरा एवं अपने स्थान हेतु सटीक मुहूर्त समय देखें।'
                  : 'Check Tithi, Nakshatra, Yoga, Karana, sunrise, sunset, Rahu Kalam and other timings calculated for your selected place.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('daily-panchanga')}
              >
                <span>{isHi ? 'पंचांग देखें →' : "View today's Panchang →"}</span>
              </button>
            </article>

            {/* Card 3: Marriage Matching */}
            <article className="oj-service-card">
              <div className="oj-card-badge-row">
                <span className="oj-card-tag">{isHi ? 'विवाह मिलान' : 'Match Making'}</span>
              </div>
              <h3 className="oj-card-title">{isHi ? 'कुंडली मिलान (Marriage Matching)' : 'Marriage Matching'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? 'अष्टकूट गुण मिलान (36 गुण), दक्षिण भारतीय दश कूट (10 Poruthams) एवं मांगलिक दोष भंग परिहार के साथ दो कुंडलियों की तुलना करें।'
                  : 'Compare two birth charts using Ashtakoota Guna Milan, South Indian Porutham and other traditional compatibility factors.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('marriage-matching')}
              >
                <span>{isHi ? 'कुंडली मिलान करें →' : 'Compare horoscopes →'}</span>
              </button>
            </article>

            {/* Card 4: Daily, Monthly & Yearly Rashifal */}
            <article className="oj-service-card">
              <div className="oj-card-badge-row">
                <span className="oj-card-tag">{isHi ? '12 राशियां' : 'All 12 Signs'}</span>
              </div>
              <h3 className="oj-card-title">{isHi ? 'दैनिक, मासिक व वार्षिक राशिफल' : 'Daily, Monthly & Yearly Rashifal'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? 'सभी 12 चंद्र राशियों हेतु आज का राशिफल, मासिक मार्गदर्शन एवं 2026-2027 के प्रमुख ग्रह गोचर का विस्तृत फलादेश पढ़ें।'
                  : 'Read general Moon-sign guidance for all 12 Rashis. These forecasts cover day, month, and major annual transit themes.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('daily-panchanga')}
              >
                <span>{isHi ? 'राशिफल पढ़ें →' : 'Read Rashifal →'}</span>
              </button>
            </article>

            {/* Card 5: KP Horoscope */}
            <article className="oj-service-card">
              <div className="oj-card-badge-row">
                <span className="oj-card-tag">{isHi ? 'केपी ज्योतिष' : 'KP System'}</span>
              </div>
              <h3 className="oj-card-title">{isHi ? 'केपी कुंडली (KP Horoscope)' : 'KP Horoscope'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? 'कृष्णमूर्ति पद्धति (KP) चार्ट, भाव संधि (Cusps), नक्षत्र स्वामी (Star Lords), उप-स्वामी (Sub Lords) एवं कारक ग्रहों का विश्लेषण।'
                  : 'Generate Krishnamurti Paddhati charts with cusps, star lords, sub-lords, significators and ruling-planet information.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('kp-horoscope')}
              >
                <span>{isHi ? 'KP चार्ट बनाएं →' : 'Generate a KP chart →'}</span>
              </button>
            </article>

            {/* Card 6: Newborn Horoscope */}
            <article className="oj-service-card">
              <div className="oj-card-badge-row">
                <span className="oj-card-tag">{isHi ? 'शिशु नामकरण' : 'Newborn Baby'}</span>
              </div>
              <h3 className="oj-card-title">{isHi ? 'नवजात शिशु कुंडली (Newborn Horoscope)' : 'Newborn Horoscope'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? 'नवजात शिशु की राशि, नक्षत्र, चरण, नामाक्षर, गंडमूल दोष जांच तथा प्रारंभिक जन्म कुंडली विवरण प्राप्त करें।'
                  : 'Find the baby’s Rashi, Nakshatra, Pada, suggested naming syllables and basic birth-chart details.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('baby-names')}
              >
                <span>{isHi ? 'शिशु विवरण देखें →' : 'Check newborn details →'}</span>
              </button>
            </article>

            {/* Card 7: Astrology Calculators */}
            <article className="oj-service-card">
              <div className="oj-card-badge-row">
                <span className="oj-card-tag">{isHi ? 'कैलकुलेटर' : 'Calculators'}</span>
              </div>
              <h3 className="oj-card-title">{isHi ? 'ज्योतिषीय कैलकुलेटर (Astro Calculators)' : 'Astrology Calculators'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? 'गोचर, अष्टकवर्ग (SAV/BAV), षड्बल, ग्रह अवस्था, वक्री व अस्त ग्रह, मुहूर्त चेकर एवं चौघड़िया समय का तत्काल अन्वेषण करें।'
                  : 'Use transit, eclipse, retrograde, Shadbala, Ashtakavarga, Choghadiya, and other practical astrology calculators.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('ashtakavarga')}
              >
                <span>{isHi ? 'कैलकुलेटर खोलें →' : 'Browse calculators →'}</span>
              </button>
            </article>

            {/* Card 8: Detailed 12-Bhava Life Dossier */}
            <article className="oj-service-card" style={{ borderLeft: '3px solid var(--accent)' }}>
              <div className="oj-card-badge-row">
                <span className="oj-card-tag" style={{ background: 'var(--accent)', color: '#fff' }}>
                  {isHi ? 'सामान्य फलादेश' : 'General Prediction'}
                </span>
              </div>
              <h3 className="oj-card-title">{isHi ? 'सामान्य फलादेश' : 'General Prediction'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? 'प्रत्येक भाव का अलग, विस्तृत और कुंडली-आधारित विश्लेषण: राशि, भावेश की स्थिति, ग्रहों का प्रभाव, दृष्टि, सर्वाष्टकवर्ग, संबंधित वर्ग-कुंडली और उपलब्ध दशा संकेत।'
                  : 'A detailed, chart-specific reading for each house, covering its sign, house lord, planetary placements and aspects, Sarvashtakavarga, relevant divisional charts and available dasha indicators.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('general-prediction')}
              >
                <span>{isHi ? 'सामान्य फलादेश देखें →' : 'Explore General Prediction →'}</span>
              </button>
            </article>

            {/* Card 9: Comprehensive Birth Report (जन्म पत्रिका) (100% Free) */}
            <article className="oj-service-card" style={{ borderLeft: '3px solid var(--good, #15803d)' }}>
              <div className="oj-card-badge-row">
                <span className="oj-card-tag" style={{ background: 'var(--good, #15803d)', color: '#fff' }}>
                  {isHi ? '100% निःशुल्क (Free)' : '100% Free PDF'}
                </span>
              </div>
              <h3 className="oj-card-title">{isHi ? 'बृहत जन्म पत्रिका (Birth Report (PDF))' : 'Complete Janmakundali (Birth Report)'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? 'अपनी जन्म कुंडली का गहनतम अध्ययन। 12 भाव फल, भावेश फल, सर्वाष्टकवर्ग, महादशा-अंतर्दशा एवं शास्त्रीय उपाय संपूर्ण जन्म पत्रिका पीडीएफ में। पूर्णतः निःशुल्क!'
                  : 'Explore career, relationships, lifelong dashas, SAV 12 houses, and traditional remedies in one detailed Birth Report PDF. Completely free of charge.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={onOpenBooklet}
              >
                <span>{isHi ? 'निःशुल्क जन्म पत्रिका खोलें →' : 'Open Free Birth Report →'}</span>
              </button>
            </article>

            {/* Card 10: Sade Sati & Live Transits */}
            <article className="oj-service-card" style={{ borderLeft: '3px solid #2563eb' }}>
              <div className="oj-card-badge-row">
                <span className="oj-card-tag" style={{ background: '#2563eb', color: '#fff' }}>
                  {isHi ? 'शनि साढ़े साती' : 'Saturn Sade Sati'}
                </span>
              </div>
              <h3 className="oj-card-title">{isHi ? 'साढ़े साती व गोचर टाइमलाइन (Sade Sati & Transits)' : 'Sade Sati & Live Transits'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? 'शनि साढ़े साती के तीनों चरण (उदय, मध्य, अस्त), ढैया, कंटक शनि, अष्टम शनि एवं शास्त्रीय मूर्ति निर्णय (स्वर्ण, रजत, ताम्र, लौह)।'
                  : 'Track Saturn 3 Charans (Rising, Peak, Setting), Dhaiya, Kantaka Shani, Ashtama Shani, and classical Moorti Nirnaya foot calculations.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('sade-sati')}
              >
                <span>{isHi ? 'साढ़े साती रिपोर्ट देखें →' : 'View Sade Sati Report →'}</span>
              </button>
            </article>

            {/* Card: Live Double Transit Wheel Simulator */}
            <article className="oj-service-card" style={{ borderLeft: '3px solid #b45309' }}>
              <div className="oj-card-badge-row">
                <span className="oj-card-tag" style={{ background: '#b45309', color: '#fff' }}>
                  {isHi ? 'द्वि-चक्र गोचर' : 'Dual Transit Wheel'}
                </span>
              </div>
              <h3 className="oj-card-title">{isHi ? 'द्वि-चक्र गोचर सिम्युलेटर (Double Transit Wheel)' : 'Live Double Transit Wheel Simulator'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? 'जन्म कुंडली के केंद्र पर घूमते हुए लाइव गोचर ग्रह, युति/दृष्टि किरणें (Aspect Rays), समय यात्रा कंट्रोल्स एवं सटीक डिग्री अंतर विश्लेषण।'
                  : 'Outer transit wheel orbiting natal chart with live aspect rays (Conjunction, Trine, Opposition), time-travel controls and exact degree orbs.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('dual-transit')}
              >
                <span>{isHi ? 'गोचर सिम्युलेटर खोलें →' : 'Open Transit Simulator →'}</span>
              </button>
            </article>

            {/* Card: Holistic Vedic Remedies */}
            <article className="oj-service-card" style={{ borderLeft: '3px solid #15803d' }}>
              <div className="oj-card-badge-row">
                <span className="oj-card-tag" style={{ background: '#15803d', color: '#fff' }}>
                  {isHi ? 'समग्र वैदिक उपचार' : 'Holistic Remedies'}
                </span>
              </div>
              <h3 className="oj-card-title">{isHi ? 'वैदिक समग्र उपचार एवं परिहार (Holistic Remedies)' : 'Holistic Remedies & Practical Upaya'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? 'रत्नों के भारी खर्च के बिना — वृक्षों की जड़ें, रंग चिकित्सा, योग-प्राणायाम, रसोई के टोटके, संकट अनुसार शास्त्रीय स्तोत्र एवं इष्ट देव साधना।'
                  : 'Zero-cost practical remedies: Planetary roots, color therapy, astro-yoga, kitchen totke, crisis stotras, and D9 Karakamsa Ishta Devata.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('holistic-remedies')}
              >
                <span>{isHi ? 'समग्र उपचार देखें →' : 'View Holistic Remedies →'}</span>
              </button>
            </article>

            {/* Card 11: KP Enterprise & Cuspal Sub-Lords */}
            <article className="oj-service-card" style={{ borderLeft: '3px solid #d97706' }}>
              <div className="oj-card-badge-row">
                <span className="oj-card-tag" style={{ background: '#d97706', color: '#fff' }}>
                  {isHi ? 'केपी सिस्टम' : 'KP Enterprise'}
                </span>
              </div>
              <h3 className="oj-card-title">{isHi ? 'केपी 4-फ़ोल्ड व कस्पल सब-लॉर्ड (KP 4-Fold & CSL)' : 'KP 4-Fold & Cuspal Sub-Lords'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? '12 भावों का 4-फ़ोल्ड सिग्निफिकेटर, कस्पल सब-लॉर्ड्स एवं रियल-टाइम लाइव रूलिंग प्लैनेट्स (RP) के साथ ताजिक वर्षफल वार्षिक सौर रिटर्न।'
                  : '4-Fold planetary significators across all 12 bhavas, Cuspal Sub-Lord house links, Live Ruling Planets, and Tajika Varshaphala.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('kp-enterprise')}
              >
                <span>{isHi ? 'केपी 4-फ़ोल्ड खोलें →' : 'Open KP Enterprise →'}</span>
              </button>
            </article>

            {/* Card 12: Jaimini Sutra Suite */}
            <article className="oj-service-card" style={{ borderLeft: '3px solid #7c3aed' }}>
              <div className="oj-card-badge-row">
                <span className="oj-card-tag" style={{ background: '#7c3aed', color: '#fff' }}>
                  {isHi ? 'जैमिनी सूत्र' : 'Jaimini Sutras'}
                </span>
              </div>
              <h3 className="oj-card-title">{isHi ? 'जैमिनी सूत्र व चर दशा (Jaimini Suite)' : 'Jaimini Sutra & Chara Dasha'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? '7 व 8 चर कारक (आत्मकारक से दाराकारक), 12 आरूढ़ पद (AL, UL, A7), कारकांश कुण्डली, राशि दृष्टि, अर्गला एवं के.एन. राव चर दशा।'
                  : 'Chara Karakas (AK to DK), 12 Arudha Padas (AL, UL, A7), Karakamsha chart, Jaimini Rashi Drishti, Argala, and Chara Dasha.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('jaimini')}
              >
                <span>{isHi ? 'जैमिनी विश्लेषण देखें →' : 'View Jaimini Suite →'}</span>
              </button>
            </article>

            {/* Card 13: Auspicious Muhurta Finder */}
            <article className="oj-service-card" style={{ borderLeft: '3px solid #059669' }}>
              <div className="oj-card-badge-row">
                <span className="oj-card-tag" style={{ background: '#059669', color: '#fff' }}>
                  {isHi ? 'शुभ मुहूर्त' : '90-Day Muhurta'}
                </span>
              </div>
              <h3 className="oj-card-title">{isHi ? '90-दिवसीय शुभ मुहूर्त फाइंडर (Muhurta Finder)' : '90-Day Auspicious Muhurta Finder'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? 'विवाह, गृह प्रवेश, वाहन क्रय, व्यापार उद्घाटन व शल्य चिकित्सा हेतु अगले 90 दिनों की श्रेष्ठतम तिथियों व चौघड़िया की स्वचालित खोज।'
                  : 'Automated 90-day search engine for Vivaha, Griha Pravesh, Vehicle purchase, Business start, Property and Surgery windows.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('muhurta')}
              >
                <span>{isHi ? 'शुभ मुहूर्त खोजें →' : 'Find Best Muhurtas →'}</span>
              </button>
            </article>

            {/* Card 14: Medical Astrology & Lal Kitab */}
            <article className="oj-service-card" style={{ borderLeft: '3px solid #ea580c' }}>
              <div className="oj-card-badge-row">
                <span className="oj-card-tag" style={{ background: '#ea580c', color: '#fff' }}>
                  {isHi ? 'रोग निर्णय' : 'Medical & Lal Kitab'}
                </span>
              </div>
              <h3 className="oj-card-title">{isHi ? 'चिकित्सा ज्योतिष व लाल किताब (Medical & Lal Kitab)' : 'Medical Astrology & Lal Kitab'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? 'वात-पित्त-कफ त्रिदोष संतुलन, 12 भाव अंग मैपिंग, 22वां द्रेष्काण (खरेश), 64वां नवमांश एवं लाल किताब के सोए ग्रह व अनिवार्य फरमान उपाय।'
                  : 'Tridosha Vata-Pitta-Kapha breakdown, 12 Kalapurusha body systems, 22nd Drekkana Kharesh, 64th Navamsha and Lal Kitab remedies.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('medical-astrology')}
              >
                <span>{isHi ? 'स्वास्थ्य व उपाय देखें →' : 'View Health & Upaya →'}</span>
              </button>
            </article>

            {/* Card 15: KP Horary 1-249 Prashna */}
            <article className="oj-service-card" style={{ borderLeft: '3px solid #0284c7' }}>
              <div className="oj-card-badge-row">
                <span className="oj-card-tag" style={{ background: '#0284c7', color: '#fff' }}>
                  {isHi ? 'प्रश्न कुण्डली' : 'KP Horary 1-249'}
                </span>
              </div>
              <h3 className="oj-card-title">{isHi ? 'केपी प्रश्न कुण्डली 1–249 (Horary Prashna)' : 'KP Prashna 1–249 Horary'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? 'बिना जन्म समय के 1 से 249 संख्या द्वारा तात्कालिक प्रश्न: नौकरी, विवाह, धन, रोगमुक्ति अथवा खोई वस्तु का हाँ/ना में सटीक उत्तर।'
                  : 'Ask any specific question using a seed number from 1 to 249: Instant Yes/No/Conditional outcome with timing and remedies.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('prashna')}
              >
                <span>{isHi ? 'प्रश्न पूछें →' : 'Ask Horary Question →'}</span>
              </button>
            </article>

            {/* Card 16: BTR & Synastry */}
            <article className="oj-service-card" style={{ borderLeft: '3px solid #4f46e5' }}>
              <div className="oj-card-badge-row">
                <span className="oj-card-tag" style={{ background: '#4f46e5', color: '#fff' }}>
                  {isHi ? 'समय संशोधन' : 'BTR & Synastry'}
                </span>
              </div>
              <h3 className="oj-card-title">{isHi ? 'जन्म समय संशोधन व सिनैस्ट्री (BTR & Synastry)' : 'BTR Workbench & Synastry'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? 'जीवन की प्रमुख घटनाओं (विवाह, नौकरी, संतान) से जन्म समय में सूक्ष्म सुधार (BTR) एवं दो कुंडलियों का ग्रहीय दृष्टि मिलान व सिनैस्ट्री।'
                  : 'Rectify birth time using life event milestones and perform deep cross-chart planetary aspecting and synastry.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('btr')}
              >
                <span>{isHi ? 'BTR वर्कबेंच खोलें →' : 'Open BTR Workbench →'}</span>
              </button>
            </article>

            {/* Card 17: Nadi Palm Leaf Shastra */}
            <article className="oj-service-card" style={{ borderLeft: '3px solid #b45309' }}>
              <div className="oj-card-badge-row">
                <span className="oj-card-tag" style={{ background: '#b45309', color: '#fff' }}>
                  {isHi ? 'नाड़ी ज्योतिष' : 'Nadi Shastra'}
                </span>
              </div>
              <h3 className="oj-card-title">{isHi ? 'नाड़ी ज्योतिष व 14 कण्डम (Nadi Palm Leaf)' : 'Nadi Palm Leaf Kandams'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? 'महर्षि अगस्त्य के 14 कण्डम फल, नंदी त्रिकोण संबंध (1-5-9, 2-6-10), शिव-पार्वती संवाद एवं प्रारब्ध कर्म विमोचन तीर्थ परिहार।'
                  : '14 Agastya Kandams, Nandi directional trine connections, Shiva-Parvati dialogue decrees, and karmic pilgrimage remedies.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('nadi')}
              >
                <span>{isHi ? 'नाड़ी कण्डम पढ़ें →' : 'Read Nadi Kandams →'}</span>
              </button>
            </article>

            {/* Card 18: Astrocartography */}
            <article className="oj-service-card" style={{ borderLeft: '3px solid #0284c7' }}>
              <div className="oj-card-badge-row">
                <span className="oj-card-tag" style={{ background: '#0284c7', color: '#fff' }}>
                  {isHi ? 'भू-ज्योतिष' : 'Astrocartography'}
                </span>
              </div>
              <h3 className="oj-card-title">{isHi ? 'एस्ट्रोकार्टोग्राफी व विश्व शक्ति रेखाएं' : 'Astrocartography & World Lines'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? 'जन्मकालीन ग्रहों की मध्यलग्न (MC), पाताल (IC), लग्न (AC) व सप्तम (DC) रेखाओं का वैश्विक मानचित्र एवं १२०+ प्रमुख वैश्विक नगरों में शक्ति विश्लेषण।'
                  : 'Global projection of natal MC, IC, AC, and DC horizon/meridian vectors across 120+ top global metropolitan cities.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('astrocartography')}
              >
                <span>{isHi ? 'विश्व मानचित्र देखें →' : 'Explore World Map →'}</span>
              </button>
            </article>

            {/* Card 19: Celebrity Kundli Twin */}
            <article className="oj-service-card" style={{ borderLeft: '3px solid #d97706' }}>
              <div className="oj-card-badge-row">
                <span className="oj-card-tag" style={{ background: '#d97706', color: '#fff' }}>
                  {isHi ? 'कुंडली सादृश्य' : 'Celebrity Twins'}
                </span>
              </div>
              <h3 className="oj-card-title">{isHi ? 'सेलिब्रिटी कुंडली ट्विन (Twin Matcher)' : 'Celebrity Kundli Twin Matcher'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? 'रॉडेन एए-रेटेड प्रामाणिक जन्म समय आधारित ऐतिहासिक युगद्रष्टाओं, वैज्ञानिकों व उद्योगपतियों से आपकी कुंडली का प्रतिशत सादृश्य एवं साझा योग।'
                  : 'Benchmark your horoscope against Rodden AA-rated historical luminaries, identifying shared classical yogas and life lessons.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('celebrity-twins')}
              >
                <span>{isHi ? 'ट्विन मैच देखें →' : 'Check Twin Matches →'}</span>
              </button>
            </article>

            {/* Card 20: Human Design BodyGraph */}
            <article className="oj-service-card" style={{ borderLeft: '3px solid #16a34a' }}>
              <div className="oj-card-badge-row">
                <span className="oj-card-tag" style={{ background: '#16a34a', color: '#fff' }}>
                  {isHi ? 'ह्यूमन डिज़ाइन' : 'Human Design'}
                </span>
              </div>
              <h3 className="oj-card-title">{isHi ? 'ह्यूमन डिज़ाइन व ९ चक्र बॉडीग्राफ़' : 'Human Design & 9 Centers BodyGraph'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? '६४ आई-चिंग षट्कोण द्वारों, ९ ऊर्जा केंद्रों (चक्रों), ५ ऊर्जा प्रकारों, आंतरिक निर्णय सत्ता एवं अवतार क्रॉस का आनुवंशिक ऊर्जा खाका।'
                  : 'BodyGraph mapping of 64 I-Ching Gates, 9 Defined/Open Energy Centers, Energy Type, Strategy, and Inner Authority.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('human-design')}
              >
                <span>{isHi ? 'बॉडीग्राफ़ खोलें →' : 'Open BodyGraph →'}</span>
              </button>
            </article>

            {/* Card 21: Tajika Varshaphala */}
            <article className="oj-service-card" style={{ borderLeft: '3px solid #f59e0b' }}>
              <div className="oj-card-badge-row">
                <span className="oj-card-tag" style={{ background: '#f59e0b', color: '#fff' }}>
                  {isHi ? 'ताजिक वर्षफल' : 'Varshaphala'}
                </span>
              </div>
              <h3 className="oj-card-title">{isHi ? 'ताजिक वार्षिक सौर वर्षफल (Varshaphala)' : 'Tajika Varshaphala (Solar Return)'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? 'सूर्य के जन्मकालीन निरयण अंश पर प्रवेश काल से वर्षेश, मुन्था, पंचाधिकारी, १६ ताजिक योग एवं मुद्देन दशा से वर्ष भर की घटनाओं का सटीक काल-निर्धारण।'
                  : 'Solar return annual charts with Muntha, Varshesh, Panchadhikari candidates, 16 Tajika Yogas, and Mudda Dasha timeline.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('varshaphala')}
              >
                <span>{isHi ? 'वार्षिक वर्षफल देखें →' : 'View Annual Varshaphala →'}</span>
              </button>
            </article>

            {/* Card 22: Western Tropical Wheel */}
            <article className="oj-service-card" style={{ borderLeft: '3px solid #8b5cf6' }}>
              <div className="oj-card-badge-row">
                <span className="oj-card-tag" style={{ background: '#8b5cf6', color: '#fff' }}>
                  {isHi ? 'पाश्चात्य चक्र' : 'Western Wheel'}
                </span>
              </div>
              <h3 className="oj-card-title">{isHi ? 'पाश्चात्य 360° राशि चक्र (Western Tropical)' : 'Western Tropical 360° Wheel'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? '360° वृत्ताकार पाश्चात्य होरोस्कोप, प्रमुख दृष्टि संबंध (युति, समसप्तक, नवपंचम, केंद्र दृष्टि) एवं चतुर्विध तत्व व स्वभाव का विश्लेषण।'
                  : '360° circular tropical wheel, major aspects matrix (conjunction, opposition, trine, square, sextile) and elemental balances.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('western-astrology')}
              >
                <span>{isHi ? 'पाश्चात्य चक्र देखें →' : 'Open Western Wheel →'}</span>
              </button>
            </article>

            {/* Card 23: Life Event Timing Engine */}
            <article className="oj-service-card" style={{ borderLeft: '3px solid #ec4899' }}>
              <div className="oj-card-badge-row">
                <span className="oj-card-tag" style={{ background: '#ec4899', color: '#fff' }}>
                  {isHi ? 'घटना-काल' : 'Event Timing'}
                </span>
              </div>
              <h3 className="oj-card-title">{isHi ? 'सटीक घटना-काल निर्धारण ("कब क्या होगा?")' : 'Life Event Timing ("When will it happen?")'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? 'विवाह, संतान, पदोन्नति, विदेश गमन, संपत्ति क्रय एवं स्वास्थ्य संकट के सटीक कालखंडों का विंशोत्तरी, वर्ग चक्र व गोचर आधारित त्रिकोणीय मिलान।'
                  : 'Pinpointed chronological timing windows for marriage, childbirth, promotion, foreign relocation, property, and surgical vulnerabilities.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('life-event-timing')}
              >
                <span>{isHi ? 'घटना-काल देखें →' : 'Check Timing Windows →'}</span>
              </button>
            </article>

            {/* Card 24: 18 Classical Doshas */}
            <article className="oj-service-card" style={{ borderLeft: '3px solid #ef4444' }}>
              <div className="oj-card-badge-row">
                <span className="oj-card-tag" style={{ background: '#ef4444', color: '#fff' }}>
                  {isHi ? 'शास्त्रीय दोष' : 'Dosha Audit'}
                </span>
              </div>
              <h3 className="oj-card-title">{isHi ? '१८ शास्त्रीय दोष व भंग निर्णय (Classical Doshas)' : '18 Classical Doshas & Cancellations'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? 'कालसर्प (12 भेद), मांगलिक दोष एवं 16 शास्त्रीय भंग (Kuja Dosha Bhanga), पितृ दोष, गुरु चांडाल, अंगारक व केमद्रुम का सक्रियता आयु विश्लेषण।'
                  : 'Scientific auditing of 18 classical doshas, active age triggers, and genuine Parashari cancellations.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('classical-doshas')}
              >
                <span>{isHi ? 'दोष व भंग देखें →' : 'Check Doshas & Bhangas →'}</span>
              </button>
            </article>

            {/* Card 25: 81 Dasha Combinations */}
            <article className="oj-service-card" style={{ borderLeft: '3px solid #0284c7' }}>
              <div className="oj-card-badge-row">
                <span className="oj-card-tag" style={{ background: '#0284c7', color: '#fff' }}>
                  {isHi ? '८१ दशा मैट्रिक्स' : '81 Dasha Matrix'}
                </span>
              </div>
              <h3 className="oj-card-title">{isHi ? '८१ महादशा-अंतर्दशा संयुक्त फलकथन' : '81 Mahadasha-Antardasha Combinations'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? 'महादशा व अंतर्दशा स्वामियों का परस्पर संबंध (षडाष्टक 6/8, द्वि-द्वादश 2/12, नवपंचम 5/9) — करियर, धन, स्वास्थ्य व यथार्थवादी परिणाम।'
                  : 'Interactive deep matrix for all 81 MD-AD pairs, evaluating mutual angular axes, career impacts, and realistic unvarnished truths.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('dasha-matrix-81')}
              >
                <span>{isHi ? '८१ दशा फल खोलें →' : 'Open 81 Dasha Matrix →'}</span>
              </button>
            </article>

            {/* Card 26: Kota Chakra & Ayurdaya */}
            <article className="oj-service-card" style={{ borderLeft: '3px solid #10b981' }}>
              <div className="oj-card-badge-row">
                <span className="oj-card-tag" style={{ background: '#10b981', color: '#fff' }}>
                  {isHi ? 'कोटा व आयुर्दाय' : 'Kota & Longevity'}
                </span>
              </div>
              <h3 className="oj-card-title">{isHi ? 'कोटा चक्र, आयुर्दाय, अष्टकवर्ग कक्षा व उपग्रह' : 'Kota Chakra, Longevity & Upagrahas'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? 'संकट व मुकदमों में पराजय/विजय का दुर्ग वेध (कोटा चक्र), जैमिनी ३-युगल आयुर्दाय, ३°४५\' अष्टकवर्ग कक्षा गोचर, एवं गुलिक-मांदि उपग्रह फल।'
                  : 'Fort Defense analysis for crises and contests, Jaimini 3-pair longevity determination, real-time Kakshya triggers, and Upagrahas.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('kota-ayurdaya')}
              >
                <span>{isHi ? 'कोटा चक्र व आयुर्दाय देखें →' : 'Open Kota & Longevity →'}</span>
              </button>
            </article>

            {/* Card 27: Fortune & Karmic Calculators */}
            <article className="oj-service-card" style={{ borderLeft: '3px solid #ec4899' }}>
              <div className="oj-card-badge-row">
                <span className="oj-card-tag" style={{ background: '#ec4899', color: '#fff' }}>
                  {isHi ? 'कैलकुलेटर' : 'Calculators'}
                </span>
              </div>
              <h3 className="oj-card-title">{isHi ? 'भाग्य एवं कार्मिक कैलकुलेटर हब (Fortune Calculators)' : 'Fortune & Karmic Calculators Hub'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? 'प्रेम कम्पैटिबिलिटी (मूलांक-भाग्यांक), मित्रता स्कोर, गरुड़ पुराण व भृगु संहिता आधारित पूर्व जन्म संस्कार एवं आगामी जन्म सद्गति निर्धारण।'
                  : 'Love compatibility, friendship synergy, past life karmic debts, and next reincarnation trajectory.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('fortune-calculators')}
              >
                <span>{isHi ? 'कैलकुलेटर खोलें →' : 'Open Fortune Calculators →'}</span>
              </button>
            </article>

            {/* Card 28: Interactive Palmistry */}
            <article className="oj-service-card" style={{ borderLeft: '3px solid #8b5cf6' }}>
              <div className="oj-card-badge-row">
                <span className="oj-card-tag" style={{ background: '#8b5cf6', color: '#fff' }}>
                  {isHi ? 'सामुद्रिक प्रश्नावली' : 'Interactive Palmistry'}
                </span>
              </div>
              <h3 className="oj-card-title">{isHi ? 'इंटरैक्टिव हस्तरेखा प्रश्नावली ("पूछ-पूछ कर फलकथन")' : 'Interactive Samudrika Palmistry Q&A'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? 'हस्त रेखाओं के सचित्र डायग्राम देखकर चुनें अपनी रेखाएं और जानें अपना सम्पूर्ण भविष्य, भाग्योदय आयु एवं 4 प्रमुख जीवन पड़ाव।'
                  : 'Select your palm line shapes and mounts using illustrated diagrams to receive unvarnished Samudrika Shastra predictions, peak rise age, and 4 major turning points.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('interactive-palmistry')}
              >
                <span>{isHi ? 'हस्तरेखा प्रश्नावली शुरू करें →' : 'Start Palmistry Q&A →'}</span>
              </button>
            </article>

            {/* Card 29: Numerology */}
            <article className="oj-service-card" style={{ borderLeft: '3px solid #f59e0b' }}>
              <div className="oj-card-badge-row">
                <span className="oj-card-tag" style={{ background: '#f59e0b', color: '#fff' }}>
                  {isHi ? 'अंकज्योतिष' : 'Numerology'}
                </span>
              </div>
              <h3 className="oj-card-title">{isHi ? 'वैदिक व चालडियन अंकज्योतिष (Numerology)' : 'Vedic & Chaldean Numerology'}</h3>
              <p className="oj-card-text">
                {isHi
                  ? 'मूलांक (Driver), भाग्यांक (Conductor), चालडियन व पाइथागोरियन नामांक, ३x३ लो-शू ग्रिड, कुआ अंक, पर्सनल ईयर एवं लकी नंबर।'
                  : 'Root Number (Mulank), Destiny Number (Bhagyank), 3x3 Lo Shu Grid, Kua number, Personal Year, and name spelling vibration.'}
              </p>
              <button
                type="button"
                className="oj-card-link-btn"
                onClick={() => onNavigate('numerology')}
              >
                <span>{isHi ? 'अंकज्योतिष खोलें →' : 'Open Numerology →'}</span>
              </button>
            </article>
          </div>
        </div>
      </section>

      {/* 5. 12 Zodiac Signs Rashifal Section */}
      <section className="oj-section oj-rashifal-preview-section">
        <div className="oj-container">
          <div className="oj-section-header">
            <h2 className="oj-section-title">
              {isHi ? '12 राशियों का राशिफल (Rashifal in Your Language)' : 'Rashifal in your preferred language'}
            </h2>
            <p className="oj-section-desc">
              {isHi
                ? 'अपनी चंद्र राशि का चयन कर आज का फलादेश एवं 2026 वार्षिक गोचर फल देखें।'
                : 'Select an available Moon-sign forecast below for daily trends and 2026 yearly transit themes.'}
            </p>
          </div>

          <div className="oj-rashi-selector-strip">
            {rashifalReport.map((r, idx) => (
              <button
                key={r.signIndex}
                type="button"
                className={`oj-rashi-pill ${selectedRashiIdx === idx ? 'is-active' : ''}`}
                onClick={() => setSelectedRashiIdx(idx)}
              >
                <span className="oj-rashi-name">{trSign(r.signIndex, lang)}</span>
              </button>
            ))}
          </div>

          {/* Active Selected Rashi Detail Card */}
          {activeRashiItem && (
            <div className="oj-rashi-detail-card">
              <div className="oj-rashi-card-top">
                <div>
                  <h3 className="oj-rashi-heading">
                    {trSign(activeRashiItem.signIndex, lang)}{' '}
                    {isHi ? 'राशि फलादेश' : 'Moon-Sign Guidance'}
                  </h3>
                  <span className="oj-rashi-sub">
                    {isHi ? 'स्वामी ग्रह:' : 'Ruling Planet:'}{' '}
                    <strong>{trPlanet(SIGNS[activeRashiItem.signIndex].lord, lang)}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  className="oj-btn-outline btn-sm"
                  onClick={() => onNavigate('panchang')}
                >
                  {isHi ? 'संपूर्ण 12 राशियों का वार्षिक फल →' : 'View Full Rashifal Module →'}
                </button>
              </div>

              <div className="oj-rashi-content-grid">
                <div className="oj-rashi-box">
                  <h4 className="oj-box-title">{isHi ? 'आज का फलादेश (Today)' : "Today's Guidance"}</h4>
                  <p>{isHi ? activeRashiItem.dailyHi : activeRashiItem.dailyEn}</p>
                </div>
                <div className="oj-rashi-box">
                  <h4 className="oj-box-title">{isHi ? 'मासिक फलादेश (Monthly Outlook)' : 'Monthly Outlook'}</h4>
                  <p>{isHi ? activeRashiItem.monthlyHi : activeRashiItem.monthlyEn}</p>
                </div>
                <div className="oj-rashi-box">
                  <h4 className="oj-box-title">{isHi ? '2026 वार्षिक गोचर थीम (Yearly Theme)' : '2026 Yearly Transit Theme'}</h4>
                  <p>{isHi ? activeRashiItem.yearlyHi : activeRashiItem.yearlyEn}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. Related Free Astrology Services Section */}
      <section className="oj-section oj-related-services-section">
        <div className="oj-container">
          <div className="oj-section-header">
            <h2 className="oj-section-title">
              {isHi ? 'लोकप्रिय ज्योतिषीय सेवाएं एवं कैलकुलेटर' : 'Related Free Astrology Services'}
            </h2>
          </div>

          <div className="oj-popular-links-grid">
            <div className="oj-popular-item" onClick={() => onNavigate('vedic-horoscope')}>
              <strong>{isHi ? 'वैदिक जन्म कुंडली' : 'Vedic Horoscope'}</strong>
              <span className="oj-badge-popular">Popular</span>
            </div>
            <div className="oj-popular-item" onClick={() => onNavigate('kp')}>
              <strong>{isHi ? 'केपी ज्योतिष (KP Horoscope)' : 'KP Horoscope'}</strong>
            </div>
            <div className="oj-popular-item" onClick={() => onNavigate('panchang')}>
              <strong>{isHi ? 'मासिक पंचांग कैलेंडर' : 'Monthly Panchang Calendar'}</strong>
            </div>
            <div className="oj-popular-item" onClick={() => onNavigate('matching')}>
              <strong>{isHi ? 'गुण मिलान व दोष भंग' : 'Guna Milan with Dosha Bhanga'}</strong>
              <span className="oj-badge-popular">Popular</span>
            </div>
            <div className="oj-popular-item" onClick={() => onNavigate('matching')}>
              <strong>{isHi ? 'अष्टकूट गुण मिलान (36 गुण)' : 'Ashtakoota Guna Milan'}</strong>
              <span className="oj-badge-popular">Popular</span>
            </div>
            <div className="oj-popular-item" onClick={() => onNavigate('matching')}>
              <strong>{isHi ? 'अनुकूल विवाह नक्षत्र' : 'Suitable Marriage Nakshatras'}</strong>
            </div>
            <div className="oj-popular-item" onClick={() => onNavigate('panchang')}>
              <strong>{isHi ? 'आज का पंचांग' : "Today's Panchang"}</strong>
              <span className="oj-badge-popular">Popular</span>
            </div>
            <div className="oj-popular-item" onClick={() => onNavigate('panchang')}>
              <strong>{isHi ? 'आज के होरा समय (Hora)' : "Today's Hora Times"}</strong>
            </div>
            <div className="oj-popular-item" onClick={() => onNavigate('panchang')}>
              <strong>{isHi ? 'आज का चौघड़िया (Choghadiya)' : "Today's Choghadiya Times"}</strong>
            </div>
            <div className="oj-popular-item" onClick={() => onNavigate('panchang')}>
              <strong>{isHi ? 'आज के शुभ मुहूर्त' : "Today's Muhurta Times"}</strong>
            </div>
            <div className="oj-popular-item" onClick={() => onNavigate('panchang')}>
              <strong>{isHi ? 'मुहूर्त चेकर (Muhurta Checker)' : 'Muhurta Checker'}</strong>
            </div>
            <div className="oj-popular-item" onClick={() => onNavigate('general-prediction')}>
              <strong>{isHi ? 'सामान्य फलादेश' : 'General Prediction'}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 7. How Calculations Work & About OnlineJyotish */}
      <section className="oj-section oj-info-section">
        <div className="oj-container">
          <div className="oj-info-grid">
            <div className="oj-info-box">
              <h3 className="oj-info-heading">
                {isHi ? 'खगोलीय गणनाएं एवं सिद्धांत (Planetary Calculations)' : 'How the calculations work'}
              </h3>
              <p>
                {isHi
                  ? 'समस्त ग्रह स्थितियां एवं काल गणनाएं उच्च-सटीक स्विस एफिमरिस (Swiss Ephemeris) एवं लाहिरी अयनांश (Lahiri Ayanamsha) पर आधारित हैं। द्रिक सिद्धांत, पराशरी होरा शास्त्र एवं जैमिनी सूत्रों के अनुसार अक्षांश व देशांतर की शुद्धता से तात्कालिक भाव एवं दशाएं संगणित की जाती हैं।'
                  : 'Planet positions and timing calculations use high-precision Swiss Ephemeris data with Lahiri Ayanamsha. Your date, time, location and time zone directly determine the calculated Ascendant, house cusps, and planetary periods.'}
              </p>
            </div>

            <div className="oj-info-box">
              <h3 className="oj-info-heading">
                {isHi ? 'मार्गदर्शन एवं नैतिक नियम (Guidance & Ethics)' : 'Predictions are traditional guidance'}
              </h3>
              <p>
                {isHi
                  ? 'राशिफल एवं कुंडली फलादेश पारंपरिक ज्योतिषीय प्रवृत्तियों और संभावनाओं का निरूपण करते हैं। जीवन के महत्वपूर्ण निर्णयों, स्वास्थ्य, चिकित्सा, वित्त एवं विधिक मामलों में जातक का स्वविवेक, पुरुषार्थ एवं योग्य विशेषज्ञों का परामर्श सर्वोपरि रहता है।'
                  : 'Horoscope interpretations describe traditional astrological tendencies to support mindful reflection. They should always be considered alongside your circumstances, personal effort, and qualified professional advice.'}
              </p>
            </div>

            <div className="oj-info-box">
              <h3 className="oj-info-heading">
                {isHi ? 'शून्य शुल्क आश्वासन (100% Free Guarantee)' : 'Zero Paid Barrier Guarantee'}
              </h3>
              <p>
                {isHi
                  ? 'व्यावसायिक ज्योतिष पोर्टलों के विपरीत, इस सॉफ्टवेयर में जन्म कुंडली, 12 भावों का विस्तृत जीवन डोजियर एवं संपूर्ण जन्म पत्रिका (Birth Report) PDF सभी उपयोगकर्ताओं हेतु 100% निःशुल्क हैं। किसी भी गणना या रिपोर्ट हेतु कोई शुल्क देय नहीं है।'
                  : 'Unlike commercial astrology portals, the birth chart, detailed 12-house life dossier and comprehensive Birth Report PDF are free to all users, with no paid barriers or hidden costs.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. OnlineJyotish Portal Footer */}
      <footer className="oj-site-footer">
        <div className="oj-container">
          <div className="oj-footer-top">
            <div className="oj-footer-brand">
              <span className="oj-om-symbol-small" aria-hidden="true">ॐ</span>
              <span className="oj-footer-title">AV Astro Vibe</span>
              <p className="oj-footer-tagline">
                {isHi ? 'वैदिक ज्योतिष, पंचांग एवं संपूर्ण फलादेश' : 'Vedic Astrology, Panchang & Free Predictions'}
              </p>
            </div>

            <div className="oj-footer-search-wrap">
              <input
                type="text"
                placeholder={isHi ? 'उपकरण, पंचांग, या विषय खोजें...' : 'Search tools, festivals, topics...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="oj-footer-search-input"
              />
              <button
                type="button"
                className="oj-footer-search-btn"
                onClick={() => {
                  if (searchQuery.trim()) {
                    onNavigate('vedic-horoscope');
                  }
                }}
              >
                <Search size={14} />
                <span>{isHi ? 'खोजें' : 'Search'}</span>
              </button>
            </div>
          </div>

          <div className="oj-footer-links-grid">
            <div className="oj-footer-col">
              <h4>{isHi ? 'निःशुल्क सेवाएं' : 'Free Tools & Kundli'}</h4>
              <ul>
                <li><button type="button" onClick={() => onNavigate('vedic-horoscope')}>{isHi ? 'वैदिक जन्म कुंडली (D-1)' : 'Vedic Horoscope (D-1)'}</button></li>
                <li><button type="button" onClick={() => onNavigate('kp-horoscope')}>{isHi ? 'केपी पद्धति कुंडली' : 'KP System Horoscope'}</button></li>
                <li><button type="button" onClick={() => onNavigate('marriage-matching')}>{isHi ? 'कुंडली मिलान (36 गुण)' : 'Marriage Matching'}</button></li>
                <li><button type="button" onClick={() => onNavigate('daily-panchanga')}>{isHi ? 'दैनिक पंचांग व राहु काल' : 'Daily Panchang & Rahu Kalam'}</button></li>
                <li><button type="button" onClick={() => onNavigate('baby-names')}>{isHi ? 'शिशु नामकरण व नामाक्षर' : 'Newborn Baby Naming'}</button></li>
              </ul>
            </div>

            <div className="oj-footer-col">
              <h4>{isHi ? 'पंचांग एवं पर्व' : 'Panchang & Festivals'}</h4>
              <ul>
                <li><button type="button" onClick={() => onNavigate('daily-panchanga')}>{isHi ? 'दैनिक पंचांग व राहु काल' : 'Daily Panchang & Rahu Kalam'}</button></li>
                <li><button type="button" onClick={() => onNavigate('festivals')}>{isHi ? 'हिंदू पर्व व व्रत सूची' : 'Hindu Festivals & Vrats'}</button></li>
                <li><button type="button" onClick={() => onNavigate('festivals')}>{isHi ? 'एकादशी एवं प्रदोष तिथियां' : 'Ekadashi & Pradosh Dates'}</button></li>
                <li><button type="button" onClick={() => onNavigate('choghadiya')}>{isHi ? 'चौघड़िया मुहूर्त (दिन व रात)' : 'Choghadiya Timings'}</button></li>
                <li><button type="button" onClick={() => onNavigate('daily-panchanga')}>{isHi ? 'होरा चक्र (Planetary Hours)' : 'Planetary Hora Timings'}</button></li>
              </ul>
            </div>

            <div className="oj-footer-col">
              <h4>{isHi ? 'शास्त्रीय फलादेश व उपाय' : 'Predictions & Remedies'}</h4>
              <ul>
                <li><button type="button" onClick={() => onNavigate('general-prediction')}>{isHi ? 'सामान्य फलादेश' : 'General Prediction'}</button></li>
                <li><button type="button" onClick={() => onNavigate('vedic-horoscope')}>{isHi ? 'द्वादश भाव व भावेश फल' : '12 Houses & House Lords'}</button></li>
                <li><button type="button" onClick={() => onNavigate('ashtakavarga')}>{isHi ? 'सर्वाष्टकवर्ग 12 भाव फल' : 'SAV 12 Houses Analysis'}</button></li>
                <li><button type="button" onClick={() => onNavigate('transit-today')}>{isHi ? 'प्रमुख चंद्र गोचर (शनि/गुरु)' : 'Major Transits from Moon'}</button></li>
                <li><button type="button" onClick={() => onNavigate('gemstones')}>{isHi ? 'वैदिक रत्न व रुद्राक्ष परामर्श' : 'Gemstone & Rudraksha'}</button></li>
              </ul>
            </div>

            <div className="oj-footer-col">
              <h4>{isHi ? 'बृहत पत्रिका व टूल्स' : 'Patrika Reports & Tools'}</h4>
              <ul>
                <li><button type="button" onClick={onOpenBooklet}>{isHi ? 'संपूर्ण जन्म पत्रिका (निःशुल्क)' : 'Birth Report Booklet (Free)'}</button></li>
                <li><button type="button" onClick={() => onNavigate('shadbala')}>{isHi ? 'षड्बल व ग्रह बल' : 'Shadbala & Planetary Strengths'}</button></li>
                <li><button type="button" onClick={() => onNavigate('marriage-matching')}>{isHi ? 'दश कूट मिलान (10 Poruthams)' : 'Dasha Koota Matching'}</button></li>
                <li><button type="button" onClick={() => onNavigate('split-studio')}>{isHi ? '4-स्क्रीन ज्योतिषी वर्कस्टेशन' : '4-Screen Split Workstation'}</button></li>
              </ul>
            </div>
          </div>

          <div className="oj-footer-bottom">
            <p>
              © {new Date().getFullYear()} AV Astro Vibe. All rights reserved.
              <br />
              {isHi
                ? 'गणनाएं द्रिक सिद्धांत, स्विस एफिमरिस एवं प्रामाणिक पराशरी/जैमिनी सिद्धांतों पर आधारित हैं। संपूर्ण जन्म पत्रिका एवं समस्त सेवाएं 100% निःशुल्क हैं।'
                : 'Astronomical calculations computed via Drik Siddhanta and Swiss Ephemeris. All Birth Report PDFs and tools are 100% free of charge.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
