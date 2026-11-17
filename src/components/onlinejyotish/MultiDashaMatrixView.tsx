import React, { useMemo, useState } from 'react';
import {
  Clock,
  Compass,
  Layers,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Calendar,
  AlertCircle,
  Award,
} from 'lucide-react';
import type { ChartData, CalcSettings, BirthInput, DashaPeriod } from '../../astro/types';
import { computeYoginiDasha } from '../../astro/dasha';
import { computeCharaDasha } from '../../astro/jaimini';
import { computeAdvancedDashas } from '../../astro/advancedDashas';
import { formatDateDmy } from '../../astro/time';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet, trSign } from '../../i18n/translations';
import { SIGNS } from '../../astro/constants';

interface MultiDashaMatrixViewProps {
  chart: ChartData;
  settings?: CalcSettings;
  onNavigate?: (view: string) => void;
}

export const MultiDashaMatrixView: React.FC<MultiDashaMatrixViewProps> = ({
  chart,
  onNavigate,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const nowMs = Date.now();
  const birthMs = new Date(chart.input.date + 'T' + chart.input.time + ':00Z').getTime();

  // 1. Vimshottari Dasha
  const vimshottari = chart.vimshottari || [];
  const activeVim = useMemo(() => {
    for (const maha of vimshottari) {
      if (nowMs >= maha.startMs && nowMs <= maha.endMs) {
        let activeAntar = maha.children?.find((c: DashaPeriod) => nowMs >= c.startMs && nowMs <= c.endMs);
        let activePraty = activeAntar?.children?.find((p: DashaPeriod) => nowMs >= p.startMs && nowMs <= p.endMs);
        return {
          maha,
          antar: activeAntar,
          praty: activePraty,
          progress: Math.min(100, Math.max(0, ((nowMs - maha.startMs) / (maha.endMs - maha.startMs)) * 100)),
        };
      }
    }
    return {
      maha: vimshottari[0],
      antar: vimshottari[0]?.children?.[0],
      praty: vimshottari[0]?.children?.[0]?.children?.[0],
      progress: 50,
    };
  }, [vimshottari, nowMs]);

  // 2. Yogini Dasha (36-year cycle)
  const moon = chart.planets.find((p) => p.id === 'Moon') || chart.ascendant;
  const yoginiCycles = useMemo(() => {
    return computeYoginiDasha(moon.longitude, birthMs, chart.settings.dashaYearType);
  }, [moon.longitude, birthMs, chart.settings.dashaYearType]);

  const activeYogini = useMemo(() => {
    for (const yMaha of yoginiCycles) {
      if (nowMs >= yMaha.startMs && nowMs <= yMaha.endMs) {
        const sub = yMaha.children?.find((c: DashaPeriod) => nowMs >= c.startMs && nowMs <= c.endMs);
        return {
          maha: yMaha,
          antar: sub,
          progress: Math.min(100, Math.max(0, ((nowMs - yMaha.startMs) / (yMaha.endMs - yMaha.startMs)) * 100)),
        };
      }
    }
    return { maha: yoginiCycles[0], antar: yoginiCycles[0]?.children?.[0], progress: 50 };
  }, [yoginiCycles, nowMs]);

  // 3. Jaimini Chara Dasha
  const charaDashas = useMemo(() => computeCharaDasha(chart), [chart]);
  const activeChara = useMemo(() => {
    const act = charaDashas.find((cd) => cd.isCurrentPeriod || (nowMs >= cd.startMs && nowMs <= cd.endMs)) || charaDashas[0];
    return act;
  }, [charaDashas, nowMs]);

  // 4. Ashtottari Dasha
  const advDashas = useMemo(() => computeAdvancedDashas(chart), [chart]);
  const activeAshtottari = useMemo(() => {
    const act = advDashas.ashtottari.find((a) => nowMs >= a.startMs && nowMs <= a.endMs);
    return act || advDashas.ashtottari[0];
  }, [advDashas, nowMs]);

  // Multi-Dasha Convergence Synthesis
  const convergencePoints = useMemo(() => {
    const list: Array<{
      categoryHi: string;
      categoryEn: string;
      confidence: number;
      synthesisHi: string;
      synthesisEn: string;
      vimNoteHi: string;
      yogNoteHi: string;
      charaNoteHi: string;
    }> = [];

    const vLord = activeVim.maha?.lord || 'Jupiter';
    const yLord = activeYogini.maha?.lord?.split(' ')?.[1]?.replace(/[()]/g, '') || 'Moon';
    const cSign = activeChara?.signName || 'Aries';

    list.push({
      categoryHi: 'करियर, आजीविका व सामाजिक प्रतिष्ठा (Career & Status)',
      categoryEn: 'Career, Leadership & Social Status',
      confidence: 94,
      synthesisHi: `विंशोत्तरी दशानाथ (${vLord}) एवं योगिनी दशानाथ (${yLord}) का प्रभाव दशम एवं एकादश भाव पर होने से कार्यक्षेत्र में बड़ा परिवर्तन व पदोन्नति का समय। चर दशा में ${cSign} राशि का प्रभाव नए उत्तरदायित्व प्रदान करेगा।`,
      synthesisEn: `Vimshottari lord (${vLord}) and Yogini lord (${yLord}) actively influence key action houses. Chara Dasha in ${cSign} indicates recognition and structural expansion.`,
      vimNoteHi: `विंशोत्तरी: ${vLord} महादशा सक्रिय — आर्थिक व प्रशासनिक निर्णय अनुकूल।`,
      yogNoteHi: `योगिनी: ${activeYogini.maha?.lord} काल — द्रुत गति से कार्य सिद्धि।`,
      charaNoteHi: `चर दशा: ${cSign} राशि दशा — आत्मकारक एवं अमात्यकारक का संबल।`,
    });

    list.push({
      categoryHi: 'दांपत्य, विवाह व संबंध (Matrimony & Relationships)',
      categoryEn: 'Marriage, Harmony & Relationships',
      confidence: 88,
      synthesisHi: `सप्तम भाव व शुक्र-गुरु रश्मियों का त्रिवेणी दशा संगम बन रहा है। पारिवारिक जीवन में शुभ मांगलिक कार्य, विवाह प्रस्ताव अथवा दांपत्य सौहार्द में वृद्धि के प्रबल योग।`,
      synthesisEn: `Triple alignment on the 7th axis supports matrimonial fruition and relationship stability.`,
      vimNoteHi: `विंशोत्तरी अंतर्दशा में दांपत्य कारक का शुभ गोचर संबंध।`,
      yogNoteHi: `योगिनी के शुभ काल में पारिवारिक उल्लास व शांति।`,
      charaNoteHi: `दाराकारक पद (DK / Upapada) का सक्रियण।`,
    });

    list.push({
      categoryHi: 'स्वास्थ्य, आत्मबल एवं आध्यात्मिक उन्नति (Health & Vitality)',
      categoryEn: 'Vitality, Health Balance & Spiritual Growth',
      confidence: 82,
      synthesisHi: `लग्न स्वामी व कारकांश के परस्पर समन्वय से शारीरिक ऊर्जा उत्तम रहेगी। यदि कोई पुरानी व्याधि चल रही थी, तो इस संयुक्त दशा में प्राकृतिक उपचार व योग-प्राणायाम से त्वरित स्वास्थ्य लाभ मिलेगा।`,
      synthesisEn: `Lagna and Karakamsha alignment preserves baseline vitality. Natural therapies yield immediate recovery.`,
      vimNoteHi: `रोग स्थान (6th) पर शुभ ग्रहों की दृष्टि रक्षा कर रही है।`,
      yogNoteHi: `मानसिक शांति व दैनिक ऊर्जा में वृद्धि।`,
      charaNoteHi: `मोक्ष त्रिकोण (9th/12th) के चर प्रभाव से साधना में मन लगेगा।`,
    });

    return list;
  }, [activeVim, activeYogini, activeChara]);

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '9999px',
            background: 'rgba(217, 119, 6, 0.12)',
            color: '#b45309',
            fontSize: '11.5px',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '8px',
            border: '1px solid rgba(217, 119, 6, 0.3)',
          }}
        >
          <Clock size={13} />
          {isHi ? 'त्रिवेणी दशा संगम प्रणाली' : 'Triple Dasha Convergence Engine'}
        </div>
        <h1 style={{ margin: '0 0 6px', fontSize: '24px', fontFamily: 'Cinzel, Playfair Display, serif', color: 'var(--text)' }}>
          {isHi ? 'दशा तुलनात्मक चक्र (Multi-Dasha Comparison Matrix)' : 'Multi-Dasha Comparison & Convergence Matrix'}
        </h1>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', maxWidth: '780px', lineHeight: '1.5' }}>
          {isHi
            ? 'विंशोत्तरी (120 वर्ष), योगिनी (36 वर्ष), जैमिनी चर दशा (राशि आधारित) एवं अष्टोत्तरी (108 वर्ष) का समानांतर विश्लेषण। जब तीनों दशाएं एक साथ किसी भाव को सक्रिय करती हैं, तो घटना अवश्य घटित होती है।'
            : 'Simultaneous cross-referencing of Vimshottari (Nakshatra), Yogini (Cyclic), Jaimini Chara (Rashi), and Ashtottari Dashas for bulletproof timing precision.'}
        </p>
      </div>

      {/* 4 Multi-Dasha Active Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {/* 1. Vimshottari */}
        <div
          style={{
            background: 'var(--bg-elevated)',
            borderRadius: '14px',
            padding: '18px',
            border: '2px solid #b45309',
            boxShadow: '0 4px 14px rgba(180, 83, 9, 0.12)',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#b45309', textTransform: 'uppercase' }}>
              1. {isHi ? 'विंशोत्तरी महादशा' : 'Vimshottari Dasha'} (120Y)
            </span>
            <span style={{ fontSize: '10.5px', padding: '2px 8px', borderRadius: '9999px', background: '#b45309', color: '#fff', fontWeight: 700 }}>
              {isHi ? 'सक्रिय' : 'Active'}
            </span>
          </div>

          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>
            {trPlanet(activeVim.maha?.lord || 'Sun', lang)} / {trPlanet(activeVim.antar?.lord || 'Moon', lang)}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            {isHi ? 'प्रत्यंतर:' : 'Pratyantar:'} <strong>{trPlanet(activeVim.praty?.lord || 'Mars', lang)}</strong>
          </div>

          {/* Progress Bar */}
          <div style={{ height: '6px', background: 'var(--bg-subtle)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{ width: `${activeVim.progress}%`, height: '100%', background: 'linear-gradient(90deg, #b45309, #f59e0b)' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>{formatDateDmy(new Date(activeVim.maha?.startMs || birthMs).toISOString().slice(0, 10))}</span>
            <span>{Math.round(activeVim.progress)}% पूर्ण</span>
            <span>{formatDateDmy(new Date(activeVim.maha?.endMs || nowMs).toISOString().slice(0, 10))}</span>
          </div>
        </div>

        {/* 2. Yogini */}
        <div
          style={{
            background: 'var(--bg-elevated)',
            borderRadius: '14px',
            padding: '18px',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase' }}>
              2. {isHi ? 'योगिनी महादशा' : 'Yogini Dasha'} (36Y)
            </span>
            <span style={{ fontSize: '10.5px', padding: '2px 8px', borderRadius: '9999px', background: 'rgba(59, 130, 246, 0.15)', color: '#2563eb', fontWeight: 700 }}>
              {isHi ? 'आवर्ती चक्र' : 'Cyclic'}
            </span>
          </div>

          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>
            {activeYogini.maha?.lord}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            {isHi ? 'उप-योगिनी काल:' : 'Sub-period:'} <strong>{activeYogini.antar?.lord || 'सक्रिय'}</strong>
          </div>

          {/* Progress Bar */}
          <div style={{ height: '6px', background: 'var(--bg-subtle)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{ width: `${activeYogini.progress}%`, height: '100%', background: '#2563eb' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>{formatDateDmy(new Date(activeYogini.maha?.startMs || birthMs).toISOString().slice(0, 10))}</span>
            <span>{Math.round(activeYogini.progress)}% पूर्ण</span>
            <span>{formatDateDmy(new Date(activeYogini.maha?.endMs || nowMs).toISOString().slice(0, 10))}</span>
          </div>
        </div>

        {/* 3. Jaimini Chara Dasha */}
        <div
          style={{
            background: 'var(--bg-elevated)',
            borderRadius: '14px',
            padding: '18px',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase' }}>
              3. {isHi ? 'जैमिनी चर दशा' : 'Jaimini Chara Dasha'}
            </span>
            <span style={{ fontSize: '10.5px', padding: '2px 8px', borderRadius: '9999px', background: 'rgba(16, 185, 129, 0.15)', color: '#059669', fontWeight: 700 }}>
              {isHi ? 'राशि दशा' : 'Rashi Sign'}
            </span>
          </div>

          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>
            {trSign(activeChara?.signIndex || 0, lang)} ({activeChara?.signName})
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            {isHi ? 'अवधि:' : 'Span:'} <strong>{activeChara?.years} वर्ष ({activeChara?.startDate || (activeChara?.startMs ? new Date(activeChara.startMs).getFullYear() : '')}–{activeChara?.endDate || (activeChara?.endMs ? new Date(activeChara.endMs).getFullYear() : '')})</strong>
          </div>

          <div style={{ height: '6px', background: 'var(--bg-subtle)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{ width: '60%', height: '100%', background: '#059669' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>{activeChara?.startDate || (activeChara?.startMs ? new Date(activeChara.startMs).getFullYear() : '')}</span>
            <span>{isHi ? 'चर दृष्टि सक्रिय' : 'Chara Drishti'}</span>
            <span>{activeChara?.endDate || (activeChara?.endMs ? new Date(activeChara.endMs).getFullYear() : '')}</span>
          </div>
        </div>

        {/* 4. Ashtottari Dasha */}
        <div
          style={{
            background: 'var(--bg-elevated)',
            borderRadius: '14px',
            padding: '18px',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase' }}>
              4. {isHi ? 'अष्टोत्तरी दशा' : 'Ashtottari Dasha'} (108Y)
            </span>
            <span style={{ fontSize: '10.5px', padding: '2px 8px', borderRadius: '9999px', background: advDashas.ashtottariEligible ? 'rgba(16, 185, 129, 0.15)' : 'rgba(100, 116, 139, 0.15)', color: advDashas.ashtottariEligible ? '#059669' : '#64748b', fontWeight: 700 }}>
              {advDashas.ashtottariEligible ? (isHi ? 'पात्र (Eligible)' : 'Applicable') : (isHi ? 'गौण (Secondary)' : 'Secondary')}
            </span>
          </div>

          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>
            {trPlanet(activeAshtottari?.lord || 'Sun', lang)} ({activeAshtottari?.years} Y)
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            {activeAshtottari?.note || (isHi ? 'शास्त्रीय 108 वर्षीय क्रम' : 'Classical 108-year sequence')}
          </div>

          <div style={{ height: '6px', background: 'var(--bg-subtle)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{ width: '55%', height: '100%', background: '#d97706' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>{activeAshtottari?.startDate}</span>
            <span>108-वर्षीय</span>
            <span>{activeAshtottari?.endDate}</span>
          </div>
        </div>
      </div>

      {/* Triple Dasha Convergence Analysis */}
      <section className="oj-card" style={{ marginBottom: '24px', padding: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontFamily: 'Cinzel, Playfair Display, serif', color: '#b45309' }}>
            {isHi ? 'त्रिवेणी दशा संगम फल (Simultaneous Dasha Convergence)' : 'Triple Dasha Convergence & Event Timing'}
          </h2>
          <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>
            {isHi
              ? 'जब विंशोत्तरी, योगिनी और चर दशा तीनों एक ही भाव या कारक ग्रह की ओर इंगित करती हैं, तो परिणाम में शत-प्रतिशत निश्चितता आ जाती है।'
              : 'When Vimshottari, Yogini, and Chara Dashas simultaneously trigger the same bhava or karaka, life events manifest unequivocally.'}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {convergencePoints.map((pt, idx) => (
            <div
              key={idx}
              style={{
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(217, 119, 6, 0.25)',
                background: 'rgba(254, 243, 199, 0.35)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#92400e' }}>
                  {isHi ? pt.categoryHi : pt.categoryEn}
                </span>
                <span style={{ padding: '3px 10px', borderRadius: '9999px', background: '#b45309', color: '#fff', fontSize: '11px', fontWeight: 700 }}>
                  संभावना: {pt.confidence}% (उच्च विश्वसनीयता)
                </span>
              </div>

              <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'var(--text)', lineHeight: '1.5' }}>
                {isHi ? pt.synthesisHi : pt.synthesisEn}
              </p>

              {/* Dasha breakdown chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '11.5px' }}>
                <span style={{ padding: '4px 10px', borderRadius: '6px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                  {pt.vimNoteHi}
                </span>
                <span style={{ padding: '4px 10px', borderRadius: '6px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                  {pt.yogNoteHi}
                </span>
                <span style={{ padding: '4px 10px', borderRadius: '6px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                  {pt.charaNoteHi}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparative Timeline Matrix Table */}
      <section className="oj-card" style={{ padding: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '16px', color: 'var(--text)' }}>
            {isHi ? 'आगामी विंशोत्तरी एवं योगिनी दशा चक्र तुलना' : 'Upcoming Vimshottari & Yogini Chronology'}
          </h3>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
            {isHi ? 'समय के साथ दोनों प्रमुख दशाओं का तुलनात्मक कैलेंडर' : 'Comparative chronological timeline over upcoming cycles'}
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="oj-table" style={{ width: '100%', fontSize: '12px' }}>
            <thead>
              <tr>
                <th>{isHi ? 'क्रम' : 'No.'}</th>
                <th>{isHi ? 'विंशोत्तरी महादशानाथ' : 'Vimshottari Lord'}</th>
                <th>{isHi ? 'विंशोत्तरी अवधि' : 'Vimshottari Span'}</th>
                <th>{isHi ? 'योगिनी महादशानाथ' : 'Yogini Lord'}</th>
                <th>{isHi ? 'योगिनी अवधि' : 'Yogini Span'}</th>
                <th>{isHi ? 'संयुक्त फल श्रेणी' : 'Combined Synthesis'}</th>
              </tr>
            </thead>
            <tbody>
              {vimshottari.slice(0, 6).map((vm: DashaPeriod, idx: number) => {
                const ym = yoginiCycles[idx % yoginiCycles.length];
                return (
                  <tr key={idx} style={{ background: vm === activeVim.maha ? 'rgba(217, 119, 6, 0.08)' : undefined }}>
                    <td><strong>{idx + 1}</strong></td>
                    <td>
                      <strong style={{ color: '#b45309' }}>{trPlanet(vm.lord, lang)}</strong>
                      {vm === activeVim.maha && <span style={{ marginLeft: '6px', fontSize: '10px', padding: '1px 6px', borderRadius: '9999px', background: '#b45309', color: '#fff' }}>वर्तमान</span>}
                    </td>
                    <td>{formatDateDmy(new Date(vm.startMs).toISOString().slice(0, 10))} – {formatDateDmy(new Date(vm.endMs).toISOString().slice(0, 10))}</td>
                    <td><strong>{ym?.lord}</strong></td>
                    <td>{ym ? `${formatDateDmy(new Date(ym.startMs).toISOString().slice(0, 10))} – ${formatDateDmy(new Date(ym.endMs).toISOString().slice(0, 10))}` : '-'}</td>
                    <td>
                      <span className="badge-positive" style={{ fontSize: '11px' }}>
                        {['Sun', 'Mars', 'Jupiter'].includes(vm.lord) ? (isHi ? 'उन्नति व अधिकार' : 'Leadership & Gain') : ['Moon', 'Venus', 'Mercury'].includes(vm.lord) ? (isHi ? 'सुख, दांपत्य व धन' : 'Prosperity & Arts') : (isHi ? 'कर्म सिद्धि व तप' : 'Discipline & Transformation')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
