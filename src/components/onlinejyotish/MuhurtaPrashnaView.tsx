import React, { useMemo, useState } from 'react';
import { findAuspiciousMuhurtas, type MuhurtaPurpose } from '../../astro/muhurtaFinder';
import { computePrashnaKP, type PrashnaCategory } from '../../astro/prashnaKP';
import { computeComprehensiveNadiReport } from '../../astro/nadiAstrology';
import { computeBhriguChakraAndNadiAmsas } from '../../astro/predictions/bhriguChakraPaddhati';
import { computeTajikaAndKeralaPrashna, type PrashnaTheme } from '../../astro/prashnaTajika';
import { formatDateDmy } from '../../astro/time';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { DateDmyInput } from '../DateDmyInput';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Compass,
  Flame,
  HelpCircle,
  Layers,
  Printer,
  Shield,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';

interface MuhurtaPrashnaViewProps {
  chart: ChartData;
  initialTab?: 'muhurta' | 'prashna' | 'nadi';
}

export const MuhurtaPrashnaView: React.FC<MuhurtaPrashnaViewProps> = ({ chart, initialTab = 'muhurta' }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [activeTab, setActiveTab] = useState<'muhurta' | 'prashna' | 'nadi'>(initialTab);

  // Muhurta State
  const [purpose, setPurpose] = useState<MuhurtaPurpose>('marriage');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [daysCount, setDaysCount] = useState(30);

  const muhurtaReport = useMemo(() => {
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
  const [tajikaTheme, setTajikaTheme] = useState<PrashnaTheme>('career_job');
  const [questionText, setQuestionText] = useState('Will I get the new job offer this month?');

  const prashnaReport = useMemo(() => {
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

  const tajikaReport = useMemo(() => {
    return computeTajikaAndKeralaPrashna(chart, tajikaTheme, questionText);
  }, [chart, tajikaTheme, questionText]);

  // Nadi Reports (14 Agastya Kandams + BCP + Deva Keralam 150 Amsas)
  const nadiReport = useMemo(() => computeComprehensiveNadiReport(chart), [chart]);
  const bcpReport = useMemo(() => computeBhriguChakraAndNadiAmsas(chart), [chart]);

  const [selectedBcpAge, setSelectedBcpAge] = useState<number>(bcpReport.currentAge);
  const activeBcpForecast = bcpReport.timeline120Years[selectedBcpAge] || bcpReport.currentYearForecast;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>
            {isHi ? 'मुहूर्त महा-इंजन, प्रश्न तंत्र एवं नाड़ी ज्योतिष' : 'Electional Muhurta, Prashna Tantra & Nadi Shastra'}
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            {isHi
              ? 'विवाह त्रिबल शुद्धि, ताजिक षोडश योग (इत्थशाल), केरल प्रश्न मार्ग, भृगु चक्र पद्धति व देव केरळम् 150 नाड़ी अंश'
              : 'Tribal Shuddhi Vivaha Muhurta, Tajika 16 Yogas (Ithasala), Kerala Prashna, Bhrigu Chakra Paddhati & Deva Keralam 150 Nadi Amsas'}
          </p>
        </div>

        {/* Tab Pills */}
        <div className="oj-tab-pills-row">
          <button
            type="button"
            onClick={() => setActiveTab('muhurta')}
            className={`oj-tab-pill ${activeTab === 'muhurta' ? 'is-active' : ''}`}
          >
            <Calendar size={13} style={{ marginRight: '5px' }} />
            {isHi ? 'मुहूर्त चयनकर्ता' : 'Muhurta Finder'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('prashna')}
            className={`oj-tab-pill ${activeTab === 'prashna' ? 'is-active' : ''}`}
          >
            <HelpCircle size={13} style={{ marginRight: '5px' }} />
            {isHi ? 'ताजिक व केपी प्रश्न' : 'Tajika & KP Prashna'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('nadi')}
            className={`oj-tab-pill ${activeTab === 'nadi' ? 'is-active' : ''}`}
          >
            <BookOpen size={13} style={{ marginRight: '5px' }} />
            {isHi ? 'भृगु नाड़ी व BCP चक्र' : 'Nadi & Bhrigu Chakra'}
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
                {isHi ? 'मुहूर्त प्रयोजन:' : 'Muhurta Purpose:'}
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as MuhurtaPurpose)}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--text)', fontWeight: 600 }}
              >
                <option value="marriage">{isHi ? 'विवाह (त्रिबल शुद्धि)' : 'Marriage (Vivaha)'}</option>
                <option value="griha_pravesh">{isHi ? 'गृह प्रवेश' : 'House Warming (Griha Pravesh)'}</option>
                <option value="vehicle">{isHi ? 'वाहन क्रय' : 'Vehicle Purchase'}</option>
                <option value="business">{isHi ? 'व्यापार प्रारंभ' : 'Business Launch'}</option>
                <option value="property">{isHi ? 'भूमि क्रय व शिलान्यास' : 'Property / Land Acquisition'}</option>
                <option value="surgery">{isHi ? 'शल्य क्रिया (सर्जरी)' : 'Surgery / Medical Procedure'}</option>
                <option value="travel">{isHi ? 'यात्रा मुहूर्त' : 'Travel / Journey'}</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                {isHi ? 'आरंभ तिथि (DD-MM-YYYY):' : 'Search From Date (DD-MM-YYYY):'}
              </label>
              <DateDmyInput
                value={startDate}
                onChange={setStartDate}
                compact
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                {isHi ? 'अवधि:' : 'Window Range:'}
              </label>
              <select
                value={daysCount}
                onChange={(e) => setDaysCount(Number(e.target.value))}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--text)', fontWeight: 600 }}
              >
                <option value={15}>{isHi ? 'अगले 15 दिन' : 'Next 15 Days'}</option>
                <option value={30}>{isHi ? 'अगले 30 दिन (1 माह)' : 'Next 30 Days (1 Month)'}</option>
                <option value={60}>{isHi ? 'अगले 60 दिन (2 माह)' : 'Next 60 Days (2 Months)'}</option>
                <option value={90}>{isHi ? 'अगले 90 दिन (त्रैमासिक)' : 'Next 90 Days (Quarter)'}</option>
              </select>
            </div>
          </div>

          {/* Results Summary Strip */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
              {isHi
                ? `कुल ${muhurtaReport.bestDates.length} शुभ मुहूर्त उपलब्ध (${muhurtaReport.scannedDays} दिनों में)`
                : `Found ${muhurtaReport.bestDates.length} Auspicious Muhurtas across ${muhurtaReport.scannedDays} Days`}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {isHi ? 'लत्ता, युति, बाण, जामित्र, कर्त्तरी व एकाधल दोष शोधन सहित' : 'Purified against Latta, Yuti, Baana, Jamitra, Kartari & Ekadhala doshas'}
            </span>
          </div>

          {/* Windows Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
            {muhurtaReport.bestDates.map((w, idx) => (
              <div
                key={idx}
                style={{
                  padding: '16px',
                  borderRadius: '8px',
                  background: 'var(--bg-elevated)',
                  border: w.verdict === 'Highly Auspicious' ? '1.5px solid #059669' : '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '15px', color: 'var(--text)' }}>{formatDateDmy(w.date)} ({w.dayOfWeek})</strong>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      background: w.verdict === 'Highly Auspicious' ? 'rgba(5, 150, 105, 0.15)' : 'rgba(37, 99, 235, 0.15)',
                      color: w.verdict === 'Highly Auspicious' ? '#059669' : '#2563eb',
                    }}
                  >
                    {isHi ? w.verdictHi : w.verdict} ({w.score}%)
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {isHi ? 'तिथि:' : 'Tithi:'} {w.tithiName} · {isHi ? 'नक्षत्र:' : 'Nakshatra:'} {w.nakshatraName} · {isHi ? 'योग:' : 'Yoga:'} {w.yogaName}
                </div>
                <div style={{ fontSize: '12.5px', color: '#059669', fontWeight: 600 }}>
                  {isHi ? 'अभिजित:' : 'Abhijit:'} {w.abhijitMuhurta || 'N/A'} · {isHi ? 'राहु काल:' : 'Rahu Kalam:'} {w.rahuKalam || 'N/A'}
                </div>
                <p style={{ margin: 0, fontSize: '12px', lineHeight: 1.5, color: 'var(--text)' }}>
                  {isHi && w.strengthsHi ? w.strengthsHi.join('; ') : w.strengthsEn.join('; ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Prashna Tantra (Tajika Neelakanthi + Kerala + KP) */}
      {activeTab === 'prashna' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Controls Bar */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', background: 'var(--bg-elevated)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ flex: '1 1 240px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                {isHi ? 'प्रश्न का विषय (Tajika Theme):' : 'Prashna Theme:'}
              </label>
              <select
                value={tajikaTheme}
                onChange={(e) => {
                  const val = e.target.value as PrashnaTheme;
                  setTajikaTheme(val);
                  if (val === 'career_job') setPrashnaCat('job_career');
                  else if (val === 'marriage_partnership') setPrashnaCat('marriage');
                  else if (val === 'wealth_finance') setPrashnaCat('wealth_business');
                  else if (val === 'health_illness') setPrashnaCat('health_recovery');
                  else if (val === 'property_vehicle') setPrashnaCat('property_vehicle');
                  else if (val === 'children_education') setPrashnaCat('education');
                  else if (val === 'litigation_dispute') setPrashnaCat('litigation_court');
                }}
                style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--text)', fontWeight: 600 }}
              >
                <option value="career_job">{isHi ? 'आजीविका व नौकरी' : 'Career / Job'}</option>
                <option value="marriage_partnership">{isHi ? 'विवाह व दांपत्य' : 'Marriage & Spouse'}</option>
                <option value="wealth_finance">{isHi ? 'धन संचय व लाभ' : 'Wealth & Finance'}</option>
                <option value="health_illness">{isHi ? 'रोग व स्वास्थ्य' : 'Health & Recovery'}</option>
                <option value="property_vehicle">{isHi ? 'भूमि व वाहन' : 'Property & Vehicles'}</option>
                <option value="children_education">{isHi ? 'संतान व विद्या' : 'Children & Intellect'}</option>
                <option value="litigation_dispute">{isHi ? 'कोर्ट व विवाद' : 'Litigation & Disputes'}</option>
              </select>
            </div>

            <div style={{ flex: '2 1 300px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                {isHi ? 'जातक का तात्कालिक प्रश्न:' : 'Querent Question:'}
              </label>
              <input
                type="text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--text)', fontWeight: 600 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                KP Seed (1–249):
              </label>
              <input
                type="number"
                min={1}
                max={249}
                value={horaryNum}
                onChange={(e) => setHoraryNum(Number(e.target.value))}
                style={{ width: '80px', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--text)', fontWeight: 600 }}
              />
            </div>
          </div>

          {/* Tajika Neelakanthi Primary Verdict Hero */}
          <div style={{ padding: '20px', borderRadius: '10px', background: 'rgba(37, 99, 235, 0.08)', border: '1.5px solid #2563eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>
                {isHi ? 'ताजिक नीलकंठी षोडश योग निर्णय' : 'Tajika Neelakanthi 16-Yoga Verdict'}
              </span>
              <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 700, background: '#2563eb', color: '#fff' }}>
                {isHi ? `सफलता संभावना: ${tajikaReport.probabilityScore}%` : `Outcome Probability: ${tajikaReport.probabilityScore}%`}
              </span>
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}>
              {isHi ? tajikaReport.primaryYoga.yogaNameHi : tajikaReport.primaryYoga.yogaName}
            </div>
            <p style={{ margin: '0 0 10px', fontSize: '13.5px', lineHeight: 1.6, color: 'var(--text)' }}>
              {isHi ? tajikaReport.verdictHi : tajikaReport.verdictEn}
            </p>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {isHi
                ? `लग्नेश: ${tajikaReport.lagneshaHi} · कार्येश: ${tajikaReport.karyeshaHi} (भाव ${tajikaReport.karyeshaHouse}) · दीप्तांश दूरी: ${tajikaReport.primaryYoga.orbDistanceDeg}°`
                : `Querent Lord: ${tajikaReport.lagnesha} · Significator: ${tajikaReport.karyesha} (H${tajikaReport.karyeshaHouse}) · Orb Separation: ${tajikaReport.primaryYoga.orbDistanceDeg}°`}
            </div>
          </div>

          {/* Kerala Prashna Marga Arudha Card */}
          <div style={{ padding: '18px 20px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Compass size={16} color="var(--accent)" />
              <span>{isHi ? 'केरल प्रश्न मार्ग (आरूढ़ लग्न व बाधक निर्णय)' : 'Kerala Prashna Marga (Arudha & Badhaka Assessment)'}</span>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
              <div>
                <strong style={{ fontSize: '13px', color: 'var(--text)' }}>
                  {isHi ? `आरूढ़ लग्न: ${tajikaReport.keralaPrashnaMarga.arudhaSignHi}` : `Arudha Lagna: ${tajikaReport.keralaPrashnaMarga.arudhaSignName}`}
                </strong>
                <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {isHi ? tajikaReport.keralaPrashnaMarga.deepaLakshanaHi : tajikaReport.keralaPrashnaMarga.deepaLakshanaEn}
                </p>
              </div>
              <div>
                <strong style={{ fontSize: '13px', color: '#dc2626' }}>
                  {isHi ? `बाधक स्थान: ${tajikaReport.keralaPrashnaMarga.badhakaSignHi} (${tajikaReport.keralaPrashnaMarga.badhakaLordHi})` : `Badhaka Sign: ${tajikaReport.keralaPrashnaMarga.badhakaSignName} (${tajikaReport.keralaPrashnaMarga.badhakaLord})`}
                </strong>
                <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {isHi ? tajikaReport.keralaPrashnaMarga.tamboolaVerdictHi : tajikaReport.keralaPrashnaMarga.tamboolaVerdictEn}
                </p>
              </div>
            </div>
          </div>

          {/* KP Prashna Sub-Lord Result */}
          <div style={{ padding: '18px 20px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>
              {isHi ? `केपी होरारी (बीज #${horaryNum}) — उप-स्वामी परीक्षण` : `KP Horary (Seed #${horaryNum}) — Cuspal Sub-Lord Verification`}
            </h3>
            <div style={{ fontSize: '14px', fontWeight: 600, color: prashnaReport.verdict.outcome.includes('Favorable') ? '#059669' : '#dc2626', marginBottom: '6px' }}>
              {isHi ? prashnaReport.verdict.outcomeHi : prashnaReport.verdict.outcome}
            </div>
            <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-muted)' }}>
              {isHi ? 'लग्न नक्षत्र स्वामी:' : 'Asc Star:'} {prashnaReport.ascendant.starLord} · {isHi ? 'उप-स्वामी:' : 'Sub-Lord:'} {prashnaReport.ascendant.subLord} · {isHi ? 'राशि:' : 'Sign:'} {prashnaReport.ascendant.signName} {prashnaReport.ascendant.dms}
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Nadi Shastra (BCP + Deva Keralam 150 Amsas + 14 Kandams) */}
      {activeTab === 'nadi' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Deva Keralam 150 Nadi Amsa Hero */}
          <div style={{ padding: '20px', borderRadius: '10px', background: 'rgba(109, 40, 217, 0.08)', border: '1.5px solid #6d28d9' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '17px', fontWeight: 700, color: '#6d28d9', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} />
              <span>{isHi ? 'देव केरळम् (चंद्रकला नाड़ी) — 150 नाड़ी अंश फलादेश' : 'Deva Keralam (Chandra Kala Nadi) — 150 Nadi Amsas'}</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
              <div style={{ background: 'var(--bg-elevated)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '11px', color: '#6d28d9', fontWeight: 700, textTransform: 'uppercase' }}>
                  {isHi ? 'लग्न नाड़ी अंश (Ascendant Nadi Amsa)' : 'Lagna Nadi Amsa'}
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginTop: '2px' }}>
                  {bcpReport.ascendantNadiAmsa.shlokaRef}
                </div>
                <p style={{ margin: '6px 0 0', fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text)' }}>
                  {isHi ? bcpReport.ascendantNadiAmsa.destinyReadingHi : bcpReport.ascendantNadiAmsa.destinyReadingEn}
                </p>
              </div>

              <div style={{ background: 'var(--bg-elevated)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '11px', color: '#6d28d9', fontWeight: 700, textTransform: 'uppercase' }}>
                  {isHi ? 'चंद्र नाड़ी अंश (Moon Nadi Amsa)' : 'Moon Nadi Amsa'}
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginTop: '2px' }}>
                  {bcpReport.moonNadiAmsa.shlokaRef}
                </div>
                <p style={{ margin: '6px 0 0', fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text)' }}>
                  {isHi ? bcpReport.moonNadiAmsa.destinyReadingHi : bcpReport.moonNadiAmsa.destinyReadingEn}
                </p>
              </div>
            </div>
          </div>

          {/* Bhrigu Chakra Paddhati (BCP) 120-Year Wheel */}
          <div style={{ padding: '20px', borderRadius: '10px', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: 'var(--text)' }}>
                  {isHi ? 'भृगु चक्र पद्धति (BCP) — 12-वर्षीय भाव चक्र काल-निर्धारण' : 'Bhrigu Chakra Paddhati (BCP) — 12-Year House Cycle Wheel'}
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  {isHi ? `वर्तमान आयु: ${bcpReport.currentAge} वर्ष (सक्रिय भाव: ${bcpReport.currentActiveHouse})` : `Current Age: ${bcpReport.currentAge} Yrs (Active House: H${bcpReport.currentActiveHouse})`}
                </p>
              </div>

              {/* Age Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>
                  {isHi ? 'आयु चुनें:' : 'Select Age:'}
                </label>
                <select
                  value={selectedBcpAge}
                  onChange={(e) => setSelectedBcpAge(Number(e.target.value))}
                  style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--text)', fontWeight: 700 }}
                >
                  {Array.from({ length: 101 }, (_, i) => (
                    <option key={i} value={i}>
                      {isHi ? `आयु ${i} वर्ष (${bcpReport.timeline120Years[i]?.yearRange})` : `Age ${i} (${bcpReport.timeline120Years[i]?.yearRange})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Year Card */}
            <div
              style={{
                background: 'rgba(180, 83, 9, 0.08)',
                border: '1.5px solid var(--accent)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <strong style={{ fontSize: '15px', color: 'var(--text)' }}>
                  {isHi ? activeBcpForecast.houseTitleHi : activeBcpForecast.houseTitleEn} · {isHi ? activeBcpForecast.themeHi : activeBcpForecast.themeEn}
                </strong>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#059669' }}>
                  {activeBcpForecast.favorableIndex}% {isHi ? 'अनुकूल' : 'Favorable'}
                </span>
              </div>
              <p style={{ margin: '0 0 8px', fontSize: '13px', lineHeight: 1.6, color: 'var(--text)' }}>
                {isHi ? activeBcpForecast.predictionHi : activeBcpForecast.predictionEn}
              </p>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                {isHi ? activeBcpForecast.bhriguPrincipleHi : activeBcpForecast.bhriguPrincipleEn}
              </div>
            </div>
          </div>

          {/* Shiva Dialogue Decree Hero */}
          <div style={{ padding: '20px', borderRadius: '10px', background: 'rgba(180, 83, 9, 0.08)', border: '1.5px solid var(--accent)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '6px' }}>
              {isHi
                ? `शिव-पार्वती नाड़ी संवाद · ${nadiReport.shivaNadi.karmaClassificationHi} कर्म`
                : `Shiva-Parvati Nadi Dialogue · ${nadiReport.shivaNadi.karmaClassification} Karma`}
            </div>
            <div style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text)', marginBottom: '8px' }}>
              "{isHi ? nadiReport.shivaNadi.divineDecreeHi : nadiReport.shivaNadi.divineDecreeEn}"
            </div>
            <div style={{ fontSize: '12.5px', color: '#059669', fontWeight: 600 }}>
              {isHi
                ? `अनुशंसित ज्योतिर्लिंग तीर्थ: ${nadiReport.shivaNadi.recommendedJyotirlingaHi}`
                : `Recommended Jyotirlinga Pilgrimage: ${nadiReport.shivaNadi.recommendedJyotirlingaEn}`}
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
                    {isHi ? `काण्ड ${k.kandamNumber}: ${k.nameHi}` : `Kandam ${k.kandamNumber}: ${k.nameEn}`}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600 }}>
                    {isHi ? k.nameEn : k.nameHi}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {isHi ? (k.themeHi || k.themeEn) : k.themeEn}
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text)', lineHeight: 1.5, marginTop: '4px' }}>
                  {isHi ? (k.verdictHi || k.verdictEn) : k.verdictEn}
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
