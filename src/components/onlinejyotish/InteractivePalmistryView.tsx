import React, { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Compass,
  Flame,
  Heart,
  HelpCircle,
  Info,
  Printer,
  RotateCcw,
  Shield,
  Sparkles,
  Star,
  User,
  Zap,
} from 'lucide-react';
import {
  computePalmistryReading,
  DEFAULT_PALMISTRY_ANSWERS,
  type PalmistryAnswers,
  type PalmistryReport,
} from '../../astro/palmistryEngine';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';

interface InteractivePalmistryViewProps {
  chart: ChartData;
  onNavigate?: (view: string) => void;
}

// ==========================================
// PALM SVG ILLUSTRATION COMPONENT
// Renders authentic hand diagrams with highlighted red lines
// modeled directly on classical Samudrika palmistry charts
// ==========================================
interface PalmSvgProps {
  type: 'heart' | 'head' | 'life' | 'fate' | 'sun' | 'marriage' | 'shape' | 'hand';
  variant: string;
  isRightHand?: boolean;
}

const PalmIllustrationSvg: React.FC<PalmSvgProps> = ({ type, variant, isRightHand = true }) => {
  // SVG coordinates:
  // Palm center: ~60, 80
  // Wrist: ~50, 130 to 70, 130
  // Thumb: extends left (for right hand) from (35, 90) to (18, 70)
  // Index finger: (38, 48) to (42, 18)
  // Middle finger: (52, 45) to (57, 10)
  // Ring finger: (68, 47) to (73, 16)
  // Little finger: (84, 55) to (88, 30)

  return (
    <svg
      viewBox="0 0 120 145"
      className="w-24 h-28 mx-auto filter drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
      style={{ overflow: 'visible' }}
    >
      {/* Palm & Hand Outline */}
      <path
        d="M 45 135 
           C 30 132, 28 115, 28 98 
           C 25 90, 14 78, 12 68 
           C 10 58, 20 54, 25 62 
           C 28 68, 32 78, 35 75 
           L 35 45 
           C 35 34, 45 34, 46 45 
           L 47 42 
           C 48 30, 59 30, 60 42 
           L 61 44 
           C 62 33, 73 33, 74 44 
           L 75 52 
           C 76 43, 87 45, 87 56 
           C 87 75, 88 95, 84 110 
           C 81 125, 75 135, 45 135 Z"
        fill="#fef3c7"
        stroke="#d97706"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* Palm Mount Guidelines (subtle) */}
      {/* Wrist bracelet lines */}
      <path d="M 42 131 C 55 133, 68 133, 78 131" stroke="#f59e0b" strokeWidth="1" strokeDasharray="1 1" fill="none" opacity="0.6" />
      <path d="M 44 134 C 55 136, 67 136, 76 134" stroke="#f59e0b" strokeWidth="1" strokeDasharray="1 1" fill="none" opacity="0.6" />

      {/* Baseline faint crease lines */}
      <path d="M 33 78 C 42 85, 45 110, 48 128" stroke="#cbd5e1" strokeWidth="1.2" fill="none" />
      <path d="M 32 76 C 50 82, 70 85, 84 88" stroke="#cbd5e1" strokeWidth="1.2" fill="none" />
      <path d="M 85 68 C 70 66, 52 64, 42 55" stroke="#cbd5e1" strokeWidth="1.2" fill="none" />

      {/* ======================================================== */}
      {/* SPECIFIC RED HIGHLIGHTED LINE ACCORDING TO QUESTION TYPE */}
      {/* ======================================================== */}

      {/* 1. HEART LINE VARIANTS */}
      {type === 'heart' && (
        <>
          {variant === 'under_jupiter' && (
            // Reaches high onto Jupiter mount (index finger base)
            <path
              d="M 86 68 C 70 66, 50 63, 40 46"
              stroke="#dc2626"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
          )}
          {variant === 'between_jupiter_saturn' && (
            // Terminates neatly between index and middle fingers
            <path
              d="M 86 68 C 70 66, 52 64, 48 44"
              stroke="#dc2626"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
          )}
          {variant === 'under_saturn' && (
            // Terminates under middle finger (Saturn)
            <path
              d="M 86 68 C 72 66, 60 63, 56 46"
              stroke="#dc2626"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
          )}
          {variant === 'trident' && (
            // Trident fork at the end
            <g stroke="#dc2626" strokeWidth="2.8" strokeLinecap="round" fill="none">
              <path d="M 86 68 C 70 66, 55 64, 50 50" />
              <path d="M 50 50 L 40 44" />
              <path d="M 50 50 L 48 40" />
              <path d="M 50 50 L 55 42" />
            </g>
          )}
          {variant === 'drooping_head' && (
            // Curved downward towards head line
            <path
              d="M 86 68 C 70 66, 55 72, 42 80"
              stroke="#dc2626"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
          )}
        </>
      )}

      {/* 2. HEAD LINE VARIANTS */}
      {type === 'head' && (
        <>
          {variant === 'sloping_moon' && (
            // Sloping downward gently to Moon mount
            <path
              d="M 33 76 C 48 80, 65 88, 76 112"
              stroke="#dc2626"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
          )}
          {variant === 'straight_mars' && (
            // Straight across to Upper Mars
            <path
              d="M 33 76 C 50 79, 70 82, 85 84"
              stroke="#dc2626"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
          )}
          {variant === 'writers_fork' && (
            // Writer's fork at terminal
            <g stroke="#dc2626" strokeWidth="2.8" strokeLinecap="round" fill="none">
              <path d="M 33 76 C 50 80, 65 85, 75 92" />
              <path d="M 75 92 L 84 88" />
              <path d="M 75 92 L 80 102" />
            </g>
          )}
          {variant === 'short' && (
            // Short line ending under middle finger
            <path
              d="M 33 76 C 44 78, 52 80, 58 82"
              stroke="#dc2626"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
          )}
        </>
      )}

      {/* 3. LIFE LINE VARIANTS */}
      {type === 'life' && (
        <>
          {variant === 'deep_long' && (
            // Deep, long curve around Venus mount to wrist
            <path
              d="M 33 74 C 44 80, 48 105, 50 130"
              stroke="#dc2626"
              strokeWidth="3.4"
              strokeLinecap="round"
              fill="none"
            />
          )}
          {variant === 'forked_moon' && (
            // Forked branch curving to Moon mount
            <g stroke="#dc2626" strokeWidth="2.8" strokeLinecap="round" fill="none">
              <path d="M 33 74 C 44 80, 48 105, 48 120" />
              <path d="M 48 110 C 56 115, 66 120, 72 125" />
              <path d="M 48 120 L 50 130" />
            </g>
          )}
          {variant === 'short_faint' && (
            // Short life line ending mid-palm
            <path
              d="M 33 74 C 40 80, 45 92, 46 102"
              stroke="#dc2626"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
          )}
          {variant === 'chained_islands' && (
            // Chained segments or islands
            <path
              d="M 33 74 C 44 80, 48 105, 50 130"
              stroke="#dc2626"
              strokeWidth="3.2"
              strokeDasharray="4 3"
              strokeLinecap="round"
              fill="none"
            />
          )}
        </>
      )}

      {/* 4. FATE LINE VARIANTS */}
      {type === 'fate' && (
        <>
          {variant === 'from_wrist_to_saturn' && (
            // Direct from wrist to Saturn mount
            <path
              d="M 58 130 L 56 46"
              stroke="#dc2626"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
          )}
          {variant === 'from_moon' && (
            // Originates from Mount of Moon (lower right) to Saturn
            <path
              d="M 76 122 C 68 105, 60 75, 56 46"
              stroke="#dc2626"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
          )}
          {variant === 'from_lifeline' && (
            // Rising from Life line
            <path
              d="M 46 95 C 50 85, 54 65, 56 46"
              stroke="#dc2626"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
          )}
          {variant === 'starts_after_35' && (
            // Prominent only from head line (age 35) upward
            <path
              d="M 58 84 L 56 46"
              stroke="#dc2626"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
          )}
          {variant === 'broken_faint' && (
            // Broken segments
            <g stroke="#dc2626" strokeWidth="2.8" strokeLinecap="round" fill="none">
              <path d="M 58 128 L 58 105" />
              <path d="M 56 95 L 56 75" />
              <path d="M 55 65 L 55 48" />
            </g>
          )}
        </>
      )}

      {/* 5. SUN LINE VARIANTS */}
      {type === 'sun' && (
        <>
          {variant === 'prominent_deep' && (
            // Deep line running straight to Sun mount (ring finger)
            <path
              d="M 69 110 L 68 46"
              stroke="#dc2626"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
          )}
          {variant === 'upper_palm_only' && (
            // Short line under ring finger only
            <path
              d="M 68 70 L 68 46"
              stroke="#dc2626"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
          )}
          {variant === 'subtle_absent' && (
            // Very faint dashed line
            <path
              d="M 68 65 L 68 48"
              stroke="#dc2626"
              strokeWidth="1.5"
              strokeDasharray="2 2"
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
            />
          )}
        </>
      )}

      {/* 6. MARRIAGE LINE VARIANTS */}
      {type === 'marriage' && (
        <>
          {variant === 'single_deep' && (
            // Single deep line on edge below little finger
            <line x1="88" y1="62" x2="78" y2="62" stroke="#dc2626" strokeWidth="3.2" strokeLinecap="round" />
          )}
          {variant === 'multiple_lines' && (
            // Multiple parallel lines
            <g stroke="#dc2626" strokeWidth="2.4" strokeLinecap="round">
              <line x1="88" y1="58" x2="80" y2="58" />
              <line x1="88" y1="63" x2="78" y2="63" />
              <line x1="88" y1="68" x2="82" y2="68" />
            </g>
          )}
          {variant === 'forked_end' && (
            // Forked end towards palm center
            <g stroke="#dc2626" strokeWidth="2.4" strokeLinecap="round" fill="none">
              <line x1="88" y1="62" x2="82" y2="62" />
              <path d="M 82 62 L 76 59" />
              <path d="M 82 62 L 76 65" />
            </g>
          )}
          {variant === 'curved_down' && (
            // Curving downward towards heart line
            <path d="M 88 60 C 83 60, 78 64, 76 68" stroke="#dc2626" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          )}
        </>
      )}

      {/* 7. HAND SHAPE VARIANTS */}
      {type === 'shape' && (
        <>
          {variant === 'earth' && (
            // Square palm indicator
            <rect x="36" y="52" width="46" height="46" fill="none" stroke="#dc2626" strokeWidth="1.6" strokeDasharray="3 2" />
          )}
          {variant === 'air' && (
            // Long fingers indicator
            <line x1="57" y1="10" x2="57" y2="45" stroke="#dc2626" strokeWidth="2.5" strokeDasharray="2 2" />
          )}
          {variant === 'fire' && (
            // Rectangular long palm indicator
            <rect x="36" y="48" width="46" height="58" fill="none" stroke="#dc2626" strokeWidth="1.6" strokeDasharray="3 2" />
          )}
          {variant === 'water' && (
            // Long palm + long fingers
            <rect x="36" y="48" width="46" height="58" fill="none" stroke="#dc2626" strokeWidth="1.6" strokeDasharray="3 2" />
          )}
        </>
      )}
    </svg>
  );
};

export const InteractivePalmistryView: React.FC<InteractivePalmistryViewProps> = ({
  chart,
  onNavigate,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const nativeName = chart.input.name || 'जातक';

  // Questionnaire state
  const [answers, setAnswers] = useState<PalmistryAnswers>(DEFAULT_PALMISTRY_ANSWERS);

  // Computed report
  const report: PalmistryReport = useMemo(() => {
    return computePalmistryReading(answers);
  }, [answers]);

  const handleUpdate = <K extends keyof PalmistryAnswers>(key: K, val: PalmistryAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setAnswers(DEFAULT_PALMISTRY_ANSWERS);
  };

  return (
    <div className="oj-page-container">
      {/* Breadcrumb */}
      <nav className="oj-breadcrumbs no-print" aria-label="Breadcrumb">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            if (onNavigate) onNavigate('home');
          }}
        >
          {isHi ? 'होम' : 'Home'}
        </a>
        <span className="oj-bc-sep">/</span>
        <span className="oj-bc-current">
          {isHi ? 'इंटरैक्टिव सामुद्रिक हस्तरेखा प्रश्नावली' : 'Interactive Samudrika Palmistry'}
        </span>
      </nav>

      {/* Classical Golden Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%)',
          border: '2px solid #d97706',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 6px 18px rgba(180, 83, 9, 0.12)',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#d97706',
                color: '#ffffff',
                padding: '3px 10px',
                borderRadius: '14px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              <Compass size={13} />
              <span>{isHi ? 'सामुद्रिक शास्त्र एवं हस्तरेखा विज्ञान' : 'Samudrika Shastra & Cheiromancy'}</span>
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: 900,
                color: '#78350f',
                fontFamily: 'serif',
                letterSpacing: '0.3px',
              }}
            >
              {isHi ? 'हस्तरेखा दर्पण: पूछ-पूछ कर सम्पूर्ण फलकथन' : 'YOUR PALM REVEALS YOU'}
            </h1>
            <p
              style={{
                margin: '8px 0 0 0',
                fontSize: '13px',
                color: '#92400e',
                lineHeight: 1.6,
                maxWidth: '850px',
              }}
            >
              {isHi
                ? `जातक: ${nativeName} | बायां हाथ आपका जन्मजात प्रारब्ध व संचित संस्कार दर्शाता है, जबकि दायां हाथ वर्तमान पुरुषार्थ व कर्म फल। नीचे दिए गए हथेली चित्रों को देखकर अपनी रेखाओं का चयन करें और जानिए अपना सम्पूर्ण भविष्य।`
                : `Native: ${nativeName} | Your left hand reveals the potential you are born with and your right hand reveals what you have done with it. Select the visual hand illustrations matching your palm lines to uncover authentic Samudrika Shastra life predictions.`}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }} className="no-print">
            <button
              type="button"
              onClick={handlePrint}
              style={{
                background: '#ffffff',
                border: '1px solid #d97706',
                color: '#78350f',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <Printer size={14} />
              <span>{isHi ? 'प्रिंट रिपोर्ट' : 'Print Reading'}</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#475569',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={13} />
              <span>{isHi ? 'रीसेट' : 'Reset'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* VISUAL ILLUSTRATED QUESTIONNAIRE (Matching askastrologer) */}
      {/* ======================================================== */}
      <div className="space-y-8 no-print mb-10">

        {/* STEP 1: Hand Selection */}
        <section
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span
              style={{
                background: '#78350f',
                color: '#ffffff',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              1
            </span>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>
              {isHi ? 'सक्रिय हाथ का चयन करें (Select Hand to Read)' : 'Select the hand to read your palm'}
            </h2>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
            {isHi
              ? 'दायां हाथ सक्रिय कर्म, वर्तमान दशा व उपार्जित भाग्य दर्शाता है। बायां हाथ जन्मजात क्षमता, अवचेतन मन व संचित प्रारब्ध दर्शाता है।'
              : 'Your right hand shows how you have lived and applied your willpower, whereas your left hand reveals inner feelings, desires, and innate blueprint.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            <button
              type="button"
              onClick={() => handleUpdate('activeHand', 'right')}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                answers.activeHand === 'right'
                  ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-400/30'
                  : 'border-slate-200 bg-white hover:border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-800">{isHi ? 'दायां हाथ (Right Hand)' : 'Right Hand'}</span>
                {answers.activeHand === 'right' && <CheckCircle2 className="w-5 h-5 text-amber-600" />}
              </div>
              <p className="text-xs text-slate-600 m-0">
                {isHi ? 'पुरुषार्थ, सक्रिय कर्म, वर्तमान दिशा एवं अर्जित उपलब्धियां' : 'Present action, practical reality, and earned achievements'}
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleUpdate('activeHand', 'left')}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                answers.activeHand === 'left'
                  ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-400/30'
                  : 'border-slate-200 bg-white hover:border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-800">{isHi ? 'बायां हाथ (Left Hand)' : 'Left Hand'}</span>
                {answers.activeHand === 'left' && <CheckCircle2 className="w-5 h-5 text-amber-600" />}
              </div>
              <p className="text-xs text-slate-600 m-0">
                {isHi ? 'जन्मजात संस्कार, संचित प्रारब्ध, आंतरिक भावनाएं व मूल स्वभाव' : 'Innate potential, subconscious instincts, and karmic traits'}
              </p>
            </button>
          </div>
        </section>

        {/* STEP 2: Hand Shape */}
        <section
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span
              style={{
                background: '#78350f',
                color: '#ffffff',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              2
            </span>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>
              {isHi ? 'हथेली का आकार व तत्व (Hand Element & Shape)' : 'Select the shape of your palm & fingers'}
            </h2>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
            {isHi
              ? 'अपनी हथेली के चौकोर अथवा आयताकार आकार और अंगुलियों की लंबाई के आधार पर निकटतम चित्र चुनें:'
              : 'Compare the length of your fingers relative to your palm to identify your elemental temperament:'}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                id: 'earth',
                code: 'A',
                titleHi: 'पृथ्वी हस्त (Earth Hand)',
                titleEn: 'Earth Hand',
                descHi: 'चौकोर हथेली, छोटी दृढ़ अंगुलियां (व्यावहारिक)',
                descEn: 'Square palm with short sturdy fingers',
              },
              {
                id: 'air',
                code: 'B',
                titleHi: 'वायु हस्त (Air Hand)',
                titleEn: 'Air Hand',
                descHi: 'चौकोर हथेली, लंबी बौद्धिक अंगुलियां (संवादी)',
                descEn: 'Square palm with long intellectual fingers',
              },
              {
                id: 'fire',
                code: 'C',
                titleHi: 'अग्नि हस्त (Fire Hand)',
                titleEn: 'Fire Hand',
                descHi: 'आयताकार हथेली, छोटी गतिशील अंगुलियां (ऊर्जावान)',
                descEn: 'Long rectangular palm with short dynamic fingers',
              },
              {
                id: 'water',
                code: 'D',
                titleHi: 'जल हस्त (Water Hand)',
                titleEn: 'Water Hand',
                descHi: 'आयताकार हथेली, लंबी सुकोमल अंगुलियां (संवेदनशील)',
                descEn: 'Long palm with slender intuitive fingers',
              },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleUpdate('handType', item.id as PalmistryAnswers['handType'])}
                className={`p-3 rounded-lg border-2 text-center transition-all group flex flex-col justify-between ${
                  answers.handType === item.id
                    ? 'border-amber-500 bg-amber-50/70 shadow-md ring-2 ring-amber-400/30'
                    : 'border-slate-200 bg-white hover:border-amber-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      ({item.code})
                    </span>
                    {answers.handType === item.id && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                  </div>
                  <PalmIllustrationSvg type="shape" variant={item.id} />
                </div>
                <div className="mt-2 text-left">
                  <div className="font-bold text-xs text-slate-800">{isHi ? item.titleHi : item.titleEn}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{isHi ? item.descHi : item.descEn}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* STEP 3: Heart Line (लाल हृदय रेखा) */}
        <section
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                background: '#78350f',
                color: '#ffffff',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              3
            </span>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>
              {isHi ? 'हृदय रेखा का अंत (Heart Line in Your Palm)' : 'Select the Heart Line in your palm'}
            </h2>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
            {isHi
              ? 'हृदय रेखा (चित्र में लाल रंग से प्रदर्शित) कनिष्ठा के नीचे से प्रारंभ होकर हथेली के ऊपरी भाग में जाती है। देखें कि आपकी रेखा कहां समाप्त होती है:'
              : 'The Heart Line (shown in red) runs across the top of the palm below the fingers. Choose the diagram matching its terminal path:'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              {
                id: 'between_jupiter_saturn',
                code: 'A',
                titleHi: 'गुरु व शनि के मध्य',
                titleEn: 'Between Jupiter & Saturn',
                descHi: 'संतुलित, यथार्थवादी एवं परिपक्व प्रेम',
                descEn: 'Ideal emotional balance',
              },
              {
                id: 'under_jupiter',
                code: 'B',
                titleHi: 'गुरु पर्वत के ऊपर',
                titleEn: 'Mount of Jupiter',
                descHi: 'अत्यंत निष्ठावान, पवित्र व आदर्शवादी प्रेम',
                descEn: 'Noble devotion & fidelity',
              },
              {
                id: 'trident',
                code: 'C',
                titleHi: 'अंत में त्रिशूल चिन्ह',
                titleEn: 'Trident Terminal',
                descHi: 'शिव-शक्ति योग — दुर्लभ सौभाग्य व समृद्धि',
                descEn: 'Sacred trident of fortune',
              },
              {
                id: 'under_saturn',
                code: 'D',
                titleHi: 'शनि पर्वत के नीचे',
                titleEn: 'Under Saturn Mount',
                descHi: 'व्यावहारिक, आत्मनिर्भर व यथार्थवादी',
                descEn: 'Pragmatic & self-reliant',
              },
              {
                id: 'drooping_head',
                code: 'E',
                titleHi: 'नीचे मस्तिष्क रेखा की ओर',
                titleEn: 'Drooping to Head Line',
                descHi: 'अति-संवेदनशील, भावनाओं में बहने वाला',
                descEn: 'Emotional vulnerability',
              },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleUpdate('heartLine', item.id as PalmistryAnswers['heartLine'])}
                className={`p-3 rounded-lg border-2 text-center transition-all group flex flex-col justify-between ${
                  answers.heartLine === item.id
                    ? 'border-amber-500 bg-amber-50/70 shadow-md ring-2 ring-amber-400/30'
                    : 'border-slate-200 bg-white hover:border-amber-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      ({item.code})
                    </span>
                    {answers.heartLine === item.id && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                  </div>
                  <PalmIllustrationSvg type="heart" variant={item.id} />
                </div>
                <div className="mt-2 text-left">
                  <div className="font-bold text-xs text-slate-800">{isHi ? item.titleHi : item.titleEn}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{isHi ? item.descHi : item.descEn}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* STEP 4: Head Line (लाल मस्तिष्क रेखा) */}
        <section
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                background: '#78350f',
                color: '#ffffff',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              4
            </span>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>
              {isHi ? 'मस्तिष्क रेखा की बनावट (Head Line in Your Palm)' : 'Select the Head Line in your palm'}
            </h2>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
            {isHi
              ? 'मस्तिष्क रेखा (चित्र में लाल रंग से प्रदर्शित) तर्जनी और अंगूठे के बीच से प्रारंभ होकर हथेली के बीच से गुजरती है:'
              : 'The Head Line (shown in red) governs mental processing, intellect, and creativity. Choose its curve:'}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                id: 'sloping_moon',
                code: 'A',
                titleHi: 'चंद्र पर्वत की ओर ढलवां',
                titleEn: 'Sloping to Moon Mount',
                descHi: 'रचनात्मक, कल्पनाशील, दूरदर्शी व कलात्मक',
                descEn: 'Imaginative & intuitive mind',
              },
              {
                id: 'straight_mars',
                code: 'B',
                titleHi: 'मंगल मैदान की ओर सीधी',
                titleEn: 'Straight across to Mars',
                descHi: 'तार्किक, व्यावहारिक, एकाग्र व सांख्यिकीय',
                descEn: 'Logical & realistic thinker',
              },
              {
                id: 'writers_fork',
                code: 'C',
                titleHi: 'अंत में लेखकीय द्विशाखा',
                titleEn: "Writer's Fork Terminal",
                descHi: 'बहुमुखी प्रतिभा, कूटनीति व संवादी चातुर्य',
                descEn: 'Versatile communicative genius',
              },
              {
                id: 'short',
                code: 'D',
                titleHi: 'छोटी व त्वरित रेखा',
                titleEn: 'Short & Direct Line',
                descHi: 'तुरंत निर्णय लेने वाला, सीधे परिणाम प्रिय',
                descEn: 'Pragmatic & rapid decision maker',
              },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleUpdate('headLine', item.id as PalmistryAnswers['headLine'])}
                className={`p-3 rounded-lg border-2 text-center transition-all group flex flex-col justify-between ${
                  answers.headLine === item.id
                    ? 'border-amber-500 bg-amber-50/70 shadow-md ring-2 ring-amber-400/30'
                    : 'border-slate-200 bg-white hover:border-amber-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      ({item.code})
                    </span>
                    {answers.headLine === item.id && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                  </div>
                  <PalmIllustrationSvg type="head" variant={item.id} />
                </div>
                <div className="mt-2 text-left">
                  <div className="font-bold text-xs text-slate-800">{isHi ? item.titleHi : item.titleEn}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{isHi ? item.descHi : item.descEn}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* STEP 5: Life Line (लाल जीवन रेखा) */}
        <section
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                background: '#78350f',
                color: '#ffffff',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              5
            </span>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>
              {isHi ? 'जीवन रेखा की स्थिति (Life Line in Your Palm)' : 'Select the Life Line in your palm'}
            </h2>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
            {isHi
              ? 'जीवन रेखा (चित्र में लाल रंग से प्रदर्शित) अंगूठे के आधार (शुक्र पर्वत) को घेरती हुई नीचे कलाई की ओर जाती है:'
              : 'The Life Line (shown in red) curves around the base of the thumb, reflecting physical stamina and vitality:'}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                id: 'deep_long',
                code: 'A',
                titleHi: 'गहरी, स्पष्ट व लंबी चाप',
                titleEn: 'Deep & Long Unbroken Arc',
                descHi: 'असीम जीवन ऊर्जा, उत्कृष्ट रोग प्रतिरोधक बल',
                descEn: 'Exceptional vitality & full longevity',
              },
              {
                id: 'forked_moon',
                code: 'B',
                titleHi: 'अंत में चंद्र की ओर द्विशाखा',
                titleEn: 'Forked towards Moon Mount',
                descHi: 'विदेश यात्रा, सुदूर निवास एवं स्थान परिवर्तन',
                descEn: 'Extensive travel & foreign relocation',
              },
              {
                id: 'short_faint',
                code: 'C',
                titleHi: 'छोटी अथवा हल्की रेखा',
                titleEn: 'Short or Faint Line',
                descHi: 'संवेदनशील प्राणशक्ति, नियमित दिनचर्या आवश्यक',
                descEn: 'Sensitive stamina, needs disciplined care',
              },
              {
                id: 'chained_islands',
                code: 'D',
                titleHi: 'द्वीप चिन्ह अथवा श्रृंखलाकार',
                titleEn: 'Chained or Islanded Segments',
                descHi: 'तनाव संवेदनशील कालखंड, योग व ध्यान हितकारी',
                descEn: 'Stress intervals; meditation restorative',
              },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleUpdate('lifeLine', item.id as PalmistryAnswers['lifeLine'])}
                className={`p-3 rounded-lg border-2 text-center transition-all group flex flex-col justify-between ${
                  answers.lifeLine === item.id
                    ? 'border-amber-500 bg-amber-50/70 shadow-md ring-2 ring-amber-400/30'
                    : 'border-slate-200 bg-white hover:border-amber-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      ({item.code})
                    </span>
                    {answers.lifeLine === item.id && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                  </div>
                  <PalmIllustrationSvg type="life" variant={item.id} />
                </div>
                <div className="mt-2 text-left">
                  <div className="font-bold text-xs text-slate-800">{isHi ? item.titleHi : item.titleEn}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{isHi ? item.descHi : item.descEn}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* STEP 6: Fate Line (लाल भाग्य रेखा) */}
        <section
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                background: '#78350f',
                color: '#ffffff',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              6
            </span>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>
              {isHi ? 'भाग्य रेखा का उद्गम (Fate Line / Destiny Path)' : 'Select the Fate Line in your palm'}
            </h2>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
            {isHi
              ? 'भाग्य रेखा (चित्र में लाल रंग से प्रदर्शित) कलाई अथवा हथेली के निचले भाग से मध्यमा अंगुली (शनि पर्वत) की ओर जाती है:'
              : 'The Fate Line (shown in red) rises vertically to Mount of Saturn, revealing career momentum and prime rise age:'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              {
                id: 'from_wrist_to_saturn',
                code: 'A',
                titleHi: 'कलाई से सीधे शनि पर्वत',
                titleEn: 'Wrist straight to Saturn',
                descHi: 'अखंड लक्ष्मी भाग्य योग — कम आयु से स्पष्ट दिशा',
                descEn: 'Unbroken early destiny flow',
              },
              {
                id: 'from_moon',
                code: 'B',
                titleHi: 'चंद्र पर्वत से उदय',
                titleEn: 'Rising from Moon Mount',
                descHi: 'जनता के सहयोग, कला, मीडिया या विवाह से भाग्योदय',
                descEn: 'Public favor & partnerships',
              },
              {
                id: 'from_lifeline',
                code: 'C',
                titleHi: 'जीवन रेखा से प्रस्फुटित',
                titleEn: 'Rising from Life Line',
                descHi: 'स्वावलंबन — स्वयं के पसीने से निर्मित सफलता',
                descEn: 'Self-made fortune through toil',
              },
              {
                id: 'starts_after_35',
                code: 'D',
                titleHi: '३५ वर्ष की आयु के बाद',
                titleEn: 'Starts after age 35',
                descHi: 'जीवन के उत्तरार्ध में अकूत धन-संपत्ति संचय',
                descEn: 'Exponential mature rise',
              },
              {
                id: 'broken_faint',
                code: 'E',
                titleHi: 'खंडित अथवा कई टुकड़ों में',
                titleEn: 'Broken / Segmented',
                descHi: 'बहुआयामी स्वतंत्र उद्यम व कार्यक्षेत्र परिवर्तन',
                descEn: 'Dynamic versatile career pivots',
              },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleUpdate('fateLine', item.id as PalmistryAnswers['fateLine'])}
                className={`p-3 rounded-lg border-2 text-center transition-all group flex flex-col justify-between ${
                  answers.fateLine === item.id
                    ? 'border-amber-500 bg-amber-50/70 shadow-md ring-2 ring-amber-400/30'
                    : 'border-slate-200 bg-white hover:border-amber-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      ({item.code})
                    </span>
                    {answers.fateLine === item.id && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                  </div>
                  <PalmIllustrationSvg type="fate" variant={item.id} />
                </div>
                <div className="mt-2 text-left">
                  <div className="font-bold text-xs text-slate-800">{isHi ? item.titleHi : item.titleEn}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{isHi ? item.descHi : item.descEn}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* STEP 7: Sun Line (लाल सूर्य रेखा) */}
        <section
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                background: '#78350f',
                color: '#ffffff',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              7
            </span>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>
              {isHi ? 'सूर्य रेखा / कीर्ति रेखा (Sun Line in Your Palm)' : 'Select the Sun Line in your palm'}
            </h2>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
            {isHi
              ? 'सूर्य रेखा (चित्र में लाल रंग से प्रदर्शित) अनामिका (Ring finger) के नीचे स्थित होती है, जो राज्य सम्मान व ख्याति दर्शाती है:'
              : 'The Sun Line (shown in red) under the ring finger signifies public fame, artistic brilliance, and state honor:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
            {[
              {
                id: 'prominent_deep',
                code: 'A',
                titleHi: 'गहरी, स्पष्ट व प्रमुख रेखा',
                titleEn: 'Prominent & Deep Line',
                descHi: 'राज्य सम्मान, उच्च पद, समाज में निर्विवाद कीर्ति',
                descEn: 'Executive prestige & public fame',
              },
              {
                id: 'upper_palm_only',
                code: 'B',
                titleHi: 'केवल ऊपरी हथेली में संक्षिप्त रेखा',
                titleEn: 'Upper Palm Segment Only',
                descHi: 'जीवन के उत्तरार्ध (आयु ४०+) में प्रतिष्ठा व सम्मान',
                descEn: 'Mature acclaim after age 40',
              },
              {
                id: 'subtle_absent',
                code: 'C',
                titleHi: 'सूक्ष्म अथवा अनुपस्थित',
                titleEn: 'Subtle or Absent Line',
                descHi: 'शांत, व्यावहारिक व दिखावे से दूर रहकर कार्यसिद्धि',
                descEn: 'Quiet mastery without need for spotlight',
              },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleUpdate('sunLine', item.id as PalmistryAnswers['sunLine'])}
                className={`p-3 rounded-lg border-2 text-center transition-all group flex flex-col justify-between ${
                  answers.sunLine === item.id
                    ? 'border-amber-500 bg-amber-50/70 shadow-md ring-2 ring-amber-400/30'
                    : 'border-slate-200 bg-white hover:border-amber-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      ({item.code})
                    </span>
                    {answers.sunLine === item.id && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                  </div>
                  <PalmIllustrationSvg type="sun" variant={item.id} />
                </div>
                <div className="mt-2 text-left">
                  <div className="font-bold text-xs text-slate-800">{isHi ? item.titleHi : item.titleEn}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{isHi ? item.descHi : item.descEn}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* STEP 8: Marriage Line (लाल विवाह रेखा) */}
        <section
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                background: '#78350f',
                color: '#ffffff',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              8
            </span>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>
              {isHi ? 'विवाह रेखा (Marriage Line under Little Finger)' : 'Select the Marriage Line in your palm'}
            </h2>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
            {isHi
              ? 'विवाह रेखा (चित्र में लाल रंग से प्रदर्शित) कनिष्ठिका के ठीक नीचे हथेली के बाहरी किनारे पर क्षैतिज रेखा के रूप में स्थित होती है:'
              : 'The Marriage Line (shown in red) lies on the outer edge under the Mercury (little) finger, revealing union dynamics:'}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                id: 'single_deep',
                code: 'A',
                titleHi: 'एक ही गहरी व सीधी रेखा',
                titleEn: 'Single Deep Straight Line',
                descHi: 'आजीवन एकनिष्ठ, स्थायी व सुखद दांपत्य',
                descEn: 'Lifelong faithful marital companionship',
              },
              {
                id: 'multiple_lines',
                code: 'B',
                titleHi: 'दो या अधिक समानांतर रेखाएं',
                titleEn: 'Multiple Parallel Lines',
                descHi: 'जीवन में एकाधिक प्रगाढ़ भावनात्मक संबंध',
                descEn: 'Multiple deep romantic connections',
              },
              {
                id: 'forked_end',
                code: 'C',
                titleHi: 'अंत में द्विशाखा',
                titleEn: 'Forked Terminal End',
                descHi: 'वैचारिक मतभेद अथवा व्यावसायिक यात्रा दूरी',
                descEn: 'Temporary career travel distance',
              },
              {
                id: 'curved_down',
                code: 'D',
                titleHi: 'नीचे हृदय रेखा की ओर झुकी',
                titleEn: 'Curved down to Heart Line',
                descHi: 'जीवनसाथी के स्वास्थ्य व संवेदनशीलता का ध्यान आवश्यक',
                descEn: 'Partner empathy & health mindfulness',
              },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleUpdate('marriageLine', item.id as PalmistryAnswers['marriageLine'])}
                className={`p-3 rounded-lg border-2 text-center transition-all group flex flex-col justify-between ${
                  answers.marriageLine === item.id
                    ? 'border-amber-500 bg-amber-50/70 shadow-md ring-2 ring-amber-400/30'
                    : 'border-slate-200 bg-white hover:border-amber-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      ({item.code})
                    </span>
                    {answers.marriageLine === item.id && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                  </div>
                  <PalmIllustrationSvg type="marriage" variant={item.id} />
                </div>
                <div className="mt-2 text-left">
                  <div className="font-bold text-xs text-slate-800">{isHi ? item.titleHi : item.titleEn}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{isHi ? item.descHi : item.descEn}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

      </div>

      {/* ======================================================== */}
      {/* YOUR PALM READING OUTPUT (Parchment Royal Card Style)   */}
      {/* ======================================================== */}
      <div
        style={{
          background: '#fffdf5',
          border: '2px solid #b45309',
          borderRadius: '12px',
          padding: '28px',
          boxShadow: '0 8px 24px rgba(180, 83, 9, 0.12)',
        }}
      >
        <div style={{ borderBottom: '2px solid #fde68a', paddingBottom: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: '22px',
                  fontWeight: 900,
                  color: '#78350f',
                  fontFamily: 'serif',
                }}
              >
                {isHi ? 'आपका हस्तरेखा फलादेश (Your Palm Reading)' : 'Your Palm Reading'}
              </h2>
              <span style={{ fontSize: '12px', color: '#92400e', fontWeight: 600 }}>
                {isHi ? `जातक: ${nativeName} | सामुद्रिक शास्त्र सम्मत शास्त्रीय विश्लेषण` : `Native: ${nativeName} | Classical Samudrika Shastra Assessment`}
              </span>
            </div>
            <span
              style={{
                background: '#fef3c7',
                border: '1px solid #f59e0b',
                color: '#78350f',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              {answers.activeHand === 'right' ? (isHi ? 'दायां हाथ (सक्रिय कर्म)' : 'Right Hand (Active)') : (isHi ? 'बायां हाथ (प्रारब्ध)' : 'Left Hand (Innate)')}
            </span>
          </div>
        </div>

        {/* 1. Classification & Temperament */}
        <div style={{ marginBottom: '20px', background: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #fef08a' }}>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 'bold', color: '#b45309' }}>
            {isHi ? report.handClassificationHi : report.handClassificationEn}
          </h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
            {isHi ? report.temperamentAndPersonalityHi : report.temperamentAndPersonalityEn}
          </p>

          {/* Prime Age Highlight Badge */}
          <div
            style={{
              marginTop: '14px',
              background: '#fef3c7',
              border: '1px solid #f59e0b',
              padding: '10px 14px',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: '#92400e' }}>
                {isHi ? 'महा-भाग्योदय स्वर्ण काल आयु' : 'Prime Destiny Breakthrough Age'}
              </span>
              <div style={{ fontSize: '12px', color: '#78350f' }}>
                {isHi ? 'भाग्य रेखा व मस्तिष्क रेखा के समन्वय से निर्धारित सर्वोच्च उत्थान' : 'Peak career inflection age'}
              </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#b45309', fontFamily: 'monospace' }}>
              {report.primeDestinyRiseAge} <span style={{ fontSize: '12px', fontWeight: 400 }}>{isHi ? 'वर्ष' : 'Yrs'}</span>
            </div>
          </div>
        </div>

        {/* 2. Auspicious Formations & Yogas */}
        {report.samudrikaYogasIdentifiedHi.length > 0 && (
          <div style={{ marginBottom: '20px', background: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #fef08a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <Award size={16} className="text-amber-600" />
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#78350f' }}>
                {isHi ? 'हस्त में उपस्थित सामुद्रिक शुभ योग' : 'Identified Auspicious Palm Yogas'}
              </h4>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {report.samudrikaYogasIdentifiedHi.map((yoga, idx) => (
                <span
                  key={idx}
                  style={{
                    background: '#fef3c7',
                    border: '1px solid #fde68a',
                    color: '#78350f',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <CheckCircle2 size={12} className="text-amber-700" />
                  {isHi ? yoga : report.samudrikaYogasIdentifiedEn[idx] || yoga}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 3. Three Pillars: Career, Love, Health */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #fef08a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Zap size={15} className="text-amber-600" />
              <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: '#78350f' }}>
                {isHi ? 'कॅरियर, आजीविका व धन' : 'Career & Wealth Trajectory'}
              </h4>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
              {isHi ? report.careerAndDestinyHi : report.careerAndDestinyEn}
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #fef08a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Heart size={15} className="text-rose-600" />
              <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: '#78350f' }}>
                {isHi ? 'प्रेम व वैवाहिक जीवन' : 'Love & Marriage Destiny'}
              </h4>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
              {isHi ? report.loveAndMaritalDestinyHi : report.loveAndMaritalDestinyEn}
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #fef08a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Shield size={15} className="text-emerald-600" />
              <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: '#78350f' }}>
                {isHi ? 'स्वास्थ्य व जीवनी शक्ति' : 'Health & Vitality Index'}
              </h4>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
              {isHi ? report.healthAndVitalityIndexHi : report.healthAndVitalityIndexEn}
            </p>
          </div>
        </div>

        {/* 4. 4 Major Turning Points */}
        <div style={{ marginBottom: '20px', background: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #fef08a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <Calendar size={15} className="text-amber-600" />
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#78350f' }}>
              {isHi ? 'जीवन के ४ प्रमुख भाग्य मोड़ एवं पड़ाव' : '4 Major Life Turning Points'}
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {report.majorTurningPoints.map((tp, idx) => (
              <div
                key={idx}
                style={{
                  background: '#fffdf5',
                  border: '1px solid #fde68a',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                }}
              >
                <span
                  style={{
                    background: '#d97706',
                    color: '#ffffff',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    fontFamily: 'monospace',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tp.age} {isHi ? 'वर्ष' : 'Yrs'}
                </span>
                <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: 1.5 }}>
                  {isHi ? tp.predictionHi : tp.predictionEn}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Classical Remedies */}
        <div style={{ background: '#fef3c7', padding: '14px 18px', borderRadius: '8px', border: '1px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Sparkles size={15} className="text-amber-700" />
            <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: '#78350f' }}>
              {isHi ? 'सामुद्रिक शास्त्रीय उपाय व संतुलन' : 'Classical Samudrika Balancing Remedies'}
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#78350f', lineHeight: 1.6 }}>
            {isHi ? report.classicalRemediesHi : report.classicalRemediesEn}
          </p>
        </div>
      </div>
    </div>
  );
};
