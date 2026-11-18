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

export const InteractivePalmistryView: React.FC<InteractivePalmistryViewProps> = ({
  chart,
  onNavigate,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const nativeName = chart.input.name || 'जातक';

  // Questionnaire state
  const [answers, setAnswers] = useState<PalmistryAnswers>(DEFAULT_PALMISTRY_ANSWERS);
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);

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

      {/* Header Card */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          <Compass className="w-4 h-4 text-amber-400" />
          <span>{isHi ? 'सामुद्रिक शास्त्र प्रणाली' : 'Samudrika Shastra Engine'}</span>
        </div>
        <h1 className="oj-page-title">
          {isHi ? 'इंटरैक्टिव हस्तरेखा प्रश्नावली एवं संपूर्ण फलकथन' : 'Interactive Palmistry Questionnaire & Predictions'}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? `जातक: ${nativeName} | अपनी हथेली के मुख्य लक्षणों (हस्त प्रकार, जीवन, हृदय, मस्तिष्क, भाग्य व सूर्य रेखा) के आधार पर जानें अपना अचूक भविष्य`
            : `Native: ${nativeName} | Answer interactive questions about your palm lines and mounts to uncover unvarnished Samudrika Shastra life predictions.`}
        </p>
        <div className="oj-header-actions no-print">
          <button onClick={handlePrint} className="oj-btn-outline">
            <Printer className="w-4 h-4 mr-2" />
            {isHi ? 'प्रिंट रिपोर्ट' : 'Print Report'}
          </button>
          <button onClick={handleReset} className="oj-btn-outline">
            {isHi ? 'डिफ़ॉल्ट रीसेट करें' : 'Reset Defaults'}
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column: Interactive Questions (7 Cols) */}
        <div className="lg:col-span-6 space-y-6 no-print">
          <div className="oj-card">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-amber-900/30">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-amber-200">
                {isHi ? 'हथेली के प्रमुख लक्षण चुनें' : 'Select Palm Characteristics'}
              </h2>
            </div>
            <p className="text-xs text-amber-300/80 mb-5">
              {isHi
                ? 'अपनी हथेली को प्राकृतिक प्रकाश में देखें और नीचे दिए गए विकल्पों में से सबसे सटीक लक्षण का चयन करें:'
                : 'Observe your palm in natural light and select the options that closest describe your hand features:'}
            </p>

            {/* Q1: Active Hand */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-amber-200 mb-2">
                1. {isHi ? 'सक्रिय हाथ (Active / Dominant Hand)' : 'Active / Dominant Hand'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleUpdate('activeHand', 'right')}
                  className={`p-3 rounded-lg border text-left text-xs transition-all ${
                    answers.activeHand === 'right'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-100 font-semibold shadow'
                      : 'bg-neutral-900/60 border-neutral-700/60 text-neutral-300 hover:border-amber-500/40'
                  }`}
                >
                  <div className="font-bold text-amber-300 mb-1">{isHi ? 'दायां हाथ (Right Hand)' : 'Right Hand'}</div>
                  <div className="text-[11px] opacity-80">
                    {isHi ? 'सक्रिय कर्म, वर्तमान पुरुषार्थ व अर्जित भाग्य' : 'Active destiny & present deeds'}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdate('activeHand', 'left')}
                  className={`p-3 rounded-lg border text-left text-xs transition-all ${
                    answers.activeHand === 'left'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-100 font-semibold shadow'
                      : 'bg-neutral-900/60 border-neutral-700/60 text-neutral-300 hover:border-amber-500/40'
                  }`}
                >
                  <div className="font-bold text-amber-300 mb-1">{isHi ? 'बायां हाथ (Left Hand)' : 'Left Hand'}</div>
                  <div className="text-[11px] opacity-80">
                    {isHi ? 'जन्मजात संस्कार, संचित प्रारब्ध व अंतर्मन' : 'Inherent potential & subconscious karma'}
                  </div>
                </button>
              </div>
            </div>

            {/* Q2: Hand Shape & Element */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-amber-200 mb-2">
                2. {isHi ? 'हस्त का मूल आकार व तत्व (Hand Element)' : 'Hand Element & Shape'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    id: 'earth',
                    titleHi: 'पृथ्वी हस्त (Earth Hand)',
                    titleEn: 'Earth Hand',
                    descHi: 'चौकोर हथेली, छोटी दृढ़ अंगुलियां (व्यावहारिक)',
                    descEn: 'Square palm, sturdy short fingers',
                  },
                  {
                    id: 'air',
                    titleHi: 'वायु हस्त (Air Hand)',
                    titleEn: 'Air Hand',
                    descHi: 'चौकोर हथेली, लंबी बौद्धिक अंगुलियां (संवादी)',
                    descEn: 'Square palm, long intellectual fingers',
                  },
                  {
                    id: 'fire',
                    titleHi: 'अग्नि हस्त (Fire Hand)',
                    titleEn: 'Fire Hand',
                    descHi: 'आयताकार हथेली, छोटी गतिशील अंगुलियां (साहसी)',
                    descEn: 'Long palm, short dynamic fingers',
                  },
                  {
                    id: 'water',
                    titleHi: 'जल हस्त (Water Hand)',
                    titleEn: 'Water Hand',
                    descHi: 'आयताकार हथेली, लंबी सुकोमल अंगुलियां (संवेदनशील)',
                    descEn: 'Long palm, slender intuitive fingers',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleUpdate('handType', item.id as PalmistryAnswers['handType'])}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                      answers.handType === item.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-100 font-semibold shadow'
                        : 'bg-neutral-900/60 border-neutral-700/60 text-neutral-300 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="font-bold text-amber-300 mb-0.5">{isHi ? item.titleHi : item.titleEn}</div>
                    <div className="text-[10px] opacity-80">{isHi ? item.descHi : item.descEn}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Q3: Life Line */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-amber-200 mb-2">
                3. {isHi ? 'जीवन रेखा की स्थिति (Life Line / Vitality Arc)' : 'Life Line Characteristics'}
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'deep_long',
                    labelHi: 'गहरी, स्पष्ट व शुक्र पर्वत को घेरती हुई लंबी रेखा',
                    labelEn: 'Deep, clear & unbroken arc curving generously around Venus',
                  },
                  {
                    id: 'forked_moon',
                    labelHi: 'अंत में द्विशाखा जो चंद्र पर्वत की ओर जाती है (विदेश योग)',
                    labelEn: 'Forked terminus curving towards Mount of Moon (Travel/Relocation)',
                  },
                  {
                    id: 'short_faint',
                    labelHi: 'छोटी अथवा हल्की रेखा (संवेदनशील प्राणशक्ति)',
                    labelEn: 'Short or faint line (Sensitive vitality/Requires routine care)',
                  },
                  {
                    id: 'chained_islands',
                    labelHi: 'द्वीप चिन्ह अथवा श्रृंखलाकार बनावट (मध्यम तनाव)',
                    labelEn: 'Chained segments or islands (Stress sensitive intervals)',
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleUpdate('lifeLine', opt.id as PalmistryAnswers['lifeLine'])}
                    className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all ${
                      answers.lifeLine === opt.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-100 font-semibold shadow'
                        : 'bg-neutral-900/60 border-neutral-700/60 text-neutral-300 hover:border-amber-500/40'
                    }`}
                  >
                    {isHi ? opt.labelHi : opt.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Q4: Heart Line */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-amber-200 mb-2">
                4. {isHi ? 'हृदय रेखा का अंत (Heart Line Terminal)' : 'Heart Line Terminal'}
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'between_jupiter_saturn',
                    labelHi: 'गुरु व शनि पर्वत के मध्य समाप्त (संतुलित, यथार्थवादी प्रेम)',
                    labelEn: 'Terminates between Jupiter & Saturn (Balanced, grounded romance)',
                  },
                  {
                    id: 'under_jupiter',
                    labelHi: 'गुरु पर्वत के ऊपर तक (अत्यंत निष्ठावान, पवित्र व आदर्श प्रेम)',
                    labelEn: 'Ascends onto Mount of Jupiter (Noble fidelity & idealistic devotion)',
                  },
                  {
                    id: 'trident',
                    labelHi: 'अंत में त्रिशूल का शुभ चिन्ह (शिव-शक्ति सौभाग्य योग)',
                    labelEn: 'Forms a sacred Trident mark at the terminus (Rare fortune & marital grace)',
                  },
                  {
                    id: 'under_saturn',
                    labelHi: 'शनि पर्वत के नीचे समाप्त (व्यावहारिक व आत्मनिर्भर दृष्टिकोण)',
                    labelEn: 'Ends directly under Saturn (Pragmatic, self-reliant & materialistic approach)',
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleUpdate('heartLine', opt.id as PalmistryAnswers['heartLine'])}
                    className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all ${
                      answers.heartLine === opt.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-100 font-semibold shadow'
                        : 'bg-neutral-900/60 border-neutral-700/60 text-neutral-300 hover:border-amber-500/40'
                    }`}
                  >
                    {isHi ? opt.labelHi : opt.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Q5: Head Line */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-amber-200 mb-2">
                5. {isHi ? 'मस्तिष्क रेखा की बनावट (Head Line / Intellectual Curve)' : 'Head Line Formation'}
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'sloping_moon',
                    labelHi: 'चंद्र पर्वत की ओर सुंदर ढलवां रेखा (रचनात्मक, कल्पनाशील व दूरदर्शी)',
                    labelEn: 'Sloping gently towards Mount of Moon (Creative, visionary & imaginative)',
                  },
                  {
                    id: 'straight_mars',
                    labelHi: 'मंगल मैदान की ओर सीधी व स्पष्ट (तार्किक, व्यावहारिक व एकाग्र)',
                    labelEn: 'Straight across palm to Upper Mars (Analytical, realistic & laser focused)',
                  },
                  {
                    id: 'writers_fork',
                    labelHi: 'अंत में लेखकीय द्विशाखा (Writer’s Fork - बहुमुखी प्रतिभा व कूटनीति)',
                    labelEn: 'Writer’s Fork at terminal (Versatile communicative genius & diplomacy)',
                  },
                  {
                    id: 'short',
                    labelHi: 'छोटी व त्वरित रेखा (तुरंत निर्णय लेने वाला व्यावहारिक मस्तिष्क)',
                    labelEn: 'Short & direct line (Rapid pragmatic decision maker)',
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleUpdate('headLine', opt.id as PalmistryAnswers['headLine'])}
                    className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all ${
                      answers.headLine === opt.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-100 font-semibold shadow'
                        : 'bg-neutral-900/60 border-neutral-700/60 text-neutral-300 hover:border-amber-500/40'
                    }`}
                  >
                    {isHi ? opt.labelHi : opt.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Q6: Fate Line */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-amber-200 mb-2">
                6. {isHi ? 'भाग्य रेखा का उद्गम व पथ (Fate Line / Destiny Path)' : 'Fate Line Origin & Trajectory'}
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'from_wrist_to_saturn',
                    labelHi: 'मणिबंध (कलाई) से सीधे शनि पर्वत तक अखंड रेखा (अखंड भाग्य योग)',
                    labelEn: 'Direct unbroken line from wrist to Saturn mount (Royal destiny flow)',
                  },
                  {
                    id: 'from_moon',
                    labelHi: 'चंद्र पर्वत से उदय (जनता, कला, विदेशी संपर्क अथवा विवाह से भाग्योदय)',
                    labelEn: 'Originates from Mount of Moon (Destiny shaped by public favor & travel)',
                  },
                  {
                    id: 'from_lifeline',
                    labelHi: 'जीवन रेखा से प्रस्फुटित (स्वावलंबन, स्वयं के पुरुषार्थ से निर्मित सफलता)',
                    labelEn: 'Branches off from Life Line (Self-made fortune through personal toil)',
                  },
                  {
                    id: 'starts_after_35',
                    labelHi: '३५ वर्ष की आयु के बाद स्पष्ट होना (जीवन के उत्तरार्ध में अकूत समृद्धि)',
                    labelEn: 'Deepens prominently past age 35 (Exponential prosperity in mature years)',
                  },
                  {
                    id: 'broken_faint',
                    labelHi: 'खंडित अथवा कई टुकड़ों में (बहुआयामी स्वतंत्र उद्यम व कार्य परिवर्तन)',
                    labelEn: 'Broken or segmented (Versatile enterprise with multiple career pivots)',
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleUpdate('fateLine', opt.id as PalmistryAnswers['fateLine'])}
                    className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all ${
                      answers.fateLine === opt.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-100 font-semibold shadow'
                        : 'bg-neutral-900/60 border-neutral-700/60 text-neutral-300 hover:border-amber-500/40'
                    }`}
                  >
                    {isHi ? opt.labelHi : opt.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Q7: Sun Line */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-amber-200 mb-2">
                7. {isHi ? 'सूर्य रेखा (Sun / Fame Line under Ring Finger)' : 'Sun Line / Apollo Fame'}
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'prominent_deep',
                    labelHi: 'अनामिका के नीचे गहरी व स्पष्ट सूर्य रेखा (राज्य सम्मान व कीर्ति)',
                    labelEn: 'Deep and clear line of fame (Executive honors, status and public eminence)',
                  },
                  {
                    id: 'upper_palm_only',
                    labelHi: 'केवल हृदय रेखा के ऊपर संक्षिप्त रेखा (आयु ४०+ के बाद प्रसिद्धि)',
                    labelEn: 'Short line present only above heart line (Acclaim arrives in mature years)',
                  },
                  {
                    id: 'subtle_absent',
                    labelHi: 'सूक्ष्म अथवा अनुपस्थित (शांत, अंतर्मुखी व निष्काम कर्मशैली)',
                    labelEn: 'Subtle or absent (Quiet, humble and functional mastery without fanfare)',
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleUpdate('sunLine', opt.id as PalmistryAnswers['sunLine'])}
                    className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all ${
                      answers.sunLine === opt.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-100 font-semibold shadow'
                        : 'bg-neutral-900/60 border-neutral-700/60 text-neutral-300 hover:border-amber-500/40'
                    }`}
                  >
                    {isHi ? opt.labelHi : opt.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Q8: Mounts of Venus & Jupiter */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-amber-200 mb-2">
                8. {isHi ? 'शुक्र व गुरु पर्वत का उभार (Mounts of Venus & Jupiter)' : 'Mounts of Venus & Jupiter'}
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'both_prominent',
                    labelHi: 'दोनों पर्वत सुपुष्ट व उभरे हुए (भौतिक समृद्धि व ज्ञान का उत्तम समन्वय)',
                    labelEn: 'Both well-developed (Flawless synthesis of worldly charm & wisdom)',
                  },
                  {
                    id: 'venus_dominant',
                    labelHi: 'शुक्र पर्वत अत्यधिक उभरा हुआ (कला, विलासिता, सौंदर्य व आकर्षण प्रधान)',
                    labelEn: 'Dominant Venus Mount (Artistic magnetism, luxury, warmth & romance)',
                  },
                  {
                    id: 'jupiter_dominant',
                    labelHi: 'गुरु पर्वत अत्यधिक उभरा हुआ (नेतृत्व, धर्म, अध्यात्म व मार्गदर्शक)',
                    labelEn: 'Dominant Jupiter Mount (Authority, mentorship, scholarship & governance)',
                  },
                  {
                    id: 'flat_moderate',
                    labelHi: 'सामान्य अथवा समतल पर्वत (संयमित, सात्विक व शांत स्वभाव)',
                    labelEn: 'Flat or moderate mounts (Equanimous, reserved & ascetic temperament)',
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleUpdate('mountVenusJupiter', opt.id as PalmistryAnswers['mountVenusJupiter'])}
                    className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all ${
                      answers.mountVenusJupiter === opt.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-100 font-semibold shadow'
                        : 'bg-neutral-900/60 border-neutral-700/60 text-neutral-300 hover:border-amber-500/40'
                    }`}
                  >
                    {isHi ? opt.labelHi : opt.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Q9: Marriage Line */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-amber-200 mb-2">
                9. {isHi ? 'विवाह रेखा (Marriage Line under Little Finger)' : 'Marriage Line under Mercury'}
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'single_deep',
                    labelHi: 'एक ही गहरी, स्पष्ट व सीधी रेखा (आजीवन एकनिष्ठ, सुखद व स्थायी दांपत्य)',
                    labelEn: 'Single, deep & clear line (Lifelong faithful, stable and blessed partnership)',
                  },
                  {
                    id: 'multiple_lines',
                    labelHi: 'दो या अधिक समानांतर रेखाएं (गहन आकर्षण व एकाधिक भावनात्मक संबंध)',
                    labelEn: 'Two or more parallel lines (Multiple deep emotional connections in lifetime)',
                  },
                  {
                    id: 'forked_end',
                    labelHi: 'अंत में द्विशाखा (विचारों के मतभेद अथवा व्यावसायिक यात्रा दूरी)',
                    labelEn: 'Forked terminal (Temporary separations due to careers or strong egos)',
                  },
                  {
                    id: 'curved_down',
                    labelHi: 'नीचे हृदय रेखा की ओर झुकी (जीवनसाथी के स्वास्थ्य व संवेदनशीलता का ध्यान)',
                    labelEn: 'Curving downwards towards heart line (Partner vitality mindfulness needed)',
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleUpdate('marriageLine', opt.id as PalmistryAnswers['marriageLine'])}
                    className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all ${
                      answers.marriageLine === opt.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-100 font-semibold shadow'
                        : 'bg-neutral-900/60 border-neutral-700/60 text-neutral-300 hover:border-amber-500/40'
                    }`}
                  >
                    {isHi ? opt.labelHi : opt.labelEn}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setHasCalculated(true)}
              className="w-full mt-4 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-bold rounded-lg shadow-lg transition-all text-sm flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {isHi ? 'सामुद्रिक फलकथन अद्यतन करें (Refresh Palmistry Reading)' : 'Update Palmistry Reading'}
            </button>
          </div>
        </div>

        {/* Right Column: Comprehensive Samudrika Predictions Report (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Top Classification Banner */}
          <div className="oj-card border-amber-500/40 bg-gradient-to-br from-amber-950/40 via-neutral-950 to-neutral-900 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-amber-800/40 mb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-400" />
                <span className="text-xs uppercase tracking-wider text-amber-300 font-bold">
                  {isHi ? 'सामुद्रिक हस्त वर्गीकरण' : 'Samudrika Classification'}
                </span>
              </div>
              <span className="text-xs px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-mono font-bold">
                {answers.activeHand === 'right' ? (isHi ? 'दायां हाथ' : 'Right Hand') : (isHi ? 'बायां हाथ' : 'Left Hand')}
              </span>
            </div>

            <h3 className="text-lg font-bold text-amber-200 mb-2">
              {isHi ? report.handClassificationHi : report.handClassificationEn}
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed mb-4">
              {isHi ? report.temperamentAndPersonalityHi : report.temperamentAndPersonalityEn}
            </p>

            {/* Prime Breakthrough Age Badge */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-between">
              <div>
                <div className="text-[11px] text-amber-400 font-bold uppercase tracking-wider">
                  {isHi ? 'महा-भाग्योदय स्वर्ण काल' : 'Prime Destiny Breakthrough'}
                </div>
                <div className="text-xs text-neutral-300">
                  {isHi ? 'भाग्य व मस्तिष्क रेखा के समन्वय से निर्धारित आयु' : 'Peak career inflection age'}
                </div>
              </div>
              <div className="text-2xl font-black text-amber-300 font-mono">
                {report.primeDestinyRiseAge} <span className="text-xs font-normal">{isHi ? 'वर्ष' : 'Yrs'}</span>
              </div>
            </div>
          </div>

          {/* Identified Samudrika Yogas */}
          {report.samudrikaYogasIdentifiedHi.length > 0 && (
            <div className="oj-card">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-amber-200">
                  {isHi ? 'हस्त में उपस्थित सामुद्रिक शुभ योग' : 'Identified Auspicious Palm Formations'}
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {report.samudrikaYogasIdentifiedHi.map((yoga, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    {isHi ? yoga : report.samudrikaYogasIdentifiedEn[idx] || yoga}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Career & Wealth Destiny */}
          <div className="oj-card">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-900/30">
              <Zap className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-amber-200">
                {isHi ? 'कॅरियर, आजीविका व धन समृद्धि' : 'Career, Profession & Wealth Trajectory'}
              </h4>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {isHi ? report.careerAndDestinyHi : report.careerAndDestinyEn}
            </p>
          </div>

          {/* Love & Marriage Destiny */}
          <div className="oj-card">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-900/30">
              <Heart className="w-4 h-4 text-rose-400" />
              <h4 className="text-sm font-bold text-amber-200">
                {isHi ? 'प्रेम, वैवाहिक सुख व दांपत्य संबंध' : 'Love, Marriage & Relationship Harmony'}
              </h4>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {isHi ? report.loveAndMaritalDestinyHi : report.loveAndMaritalDestinyEn}
            </p>
          </div>

          {/* Health & Vitality Index */}
          <div className="oj-card">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-900/30">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-amber-200">
                {isHi ? 'स्वास्थ्य, जीवनी शक्ति व दीर्घायु' : 'Health, Vitality & Longevity Index'}
              </h4>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {isHi ? report.healthAndVitalityIndexHi : report.healthAndVitalityIndexEn}
            </p>
          </div>

          {/* 4 Major Life Milestones */}
          <div className="oj-card">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-900/30">
              <Calendar className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-amber-200">
                {isHi ? 'जीवन के ४ प्रमुख भाग्य मोड़ एवं पड़ाव' : '4 Major Life Turning Points'}
              </h4>
            </div>
            <div className="space-y-3">
              {report.majorTurningPoints.map((tp, idx) => (
                <div key={idx} className="p-2.5 bg-neutral-900/70 border border-neutral-800 rounded-lg flex items-start gap-3">
                  <div className="px-2 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-xs font-mono font-bold whitespace-nowrap">
                    {tp.age} {isHi ? 'वर्ष' : 'Yrs'}
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed pt-0.5">
                    {isHi ? tp.predictionHi : tp.predictionEn}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Samudrika Classical Remedies */}
          <div className="oj-card border-amber-500/30 bg-amber-950/20">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-900/30">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-amber-200">
                {isHi ? 'सामुद्रिक शास्त्रीय उपाय एवं संतुलन' : 'Classical Samudrika Balancing Remedies'}
              </h4>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {isHi ? report.classicalRemediesHi : report.classicalRemediesEn}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
