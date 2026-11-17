import React, { useState, useMemo } from 'react';
import type { ChartData, CalcSettings } from '../../astro/types';
import {
  computeHolisticRemedies,
  type ProblemFocusArea,
  type LifestyleMode,
} from '../../astro/holisticRemedies';

interface HolisticRemediesViewProps {
  chart: ChartData;
  settings: CalcSettings;
  onNavigate?: (view: string) => void;
  onOpenBooklet?: () => void;
}

export const HolisticRemediesView: React.FC<HolisticRemediesViewProps> = ({
  chart,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<
    'all' | 'roots' | 'colors' | 'yoga' | 'totke' | 'stotras' | 'ishta' | 'bath' | 'prescription'
  >('all');
  const [problemFilter, setProblemFilter] = useState<ProblemFocusArea>('all');
  const [lifestyleFilter, setLifestyleFilter] = useState<LifestyleMode>('all');

  const report = useMemo(() => {
    return computeHolisticRemedies(chart, problemFilter, lifestyleFilter);
  }, [chart, problemFilter, lifestyleFilter]);

  const filteredTotke = useMemo(() => {
    if (lifestyleFilter === 'all') return report.kitchenTotke;
    if (lifestyleFilter === 'metro_flat') return report.kitchenTotke.filter((t) => t.lifestyleTag === 'metro_friendly');
    if (lifestyleFilter === 'zero_cost') return report.kitchenTotke.filter((t) => t.lifestyleTag === 'zero_cost');
    if (lifestyleFilter === 'quick_5min') return report.kitchenTotke.filter((t) => t.lifestyleTag === 'quick_daily');
    return report.kitchenTotke;
  }, [report.kitchenTotke, lifestyleFilter]);

  const filteredStotras = useMemo(() => {
    if (problemFilter === 'all') return report.classicalStotras;
    return report.classicalStotras.filter((s) => s.problemArea === problemFilter || s.urgencyLevel === 'high');
  }, [report.classicalStotras, problemFilter]);

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="holistic-remedies-view space-y-6 max-w-6xl mx-auto px-4 py-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-amber-600/30">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-amber-500/30">
              Desh-Kaal-Paristhiti Vedic Healing
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-amber-100">
              समग्र वैदिक उपचार एवं व्यावहारिक परिहार
            </h1>
            <p className="text-amber-200/90 text-sm sm:text-base mt-2 max-w-2xl font-sans">
              महंगे रत्नों व जटिल अनुष्ठानों के आडंबर से मुक्त — दशा, गोचर व D1-D9 के आधार पर प्राकृतिक जड़ी-बूटी, रंग चिकित्सा, योग-प्राणायाम, रसोई के टोटके, शास्त्रीय स्तोत्र एवं इष्ट देव साधना।
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('prescription')}
              className="btn btn-primary"
            >
              उपचार पर्ची देखें (Prescription)
            </button>
            {onNavigate && (
              <button
                onClick={() => onNavigate('kundli')}
                className="btn btn-secondary"
              >
                कुंडली चक्र
              </button>
            )}
          </div>
        </div>

        {/* Live Active Context Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-amber-700/40 text-xs sm:text-sm">
          <div className="bg-black/25 rounded-lg p-3 border border-amber-500/20">
            <span className="text-amber-300 font-semibold block">सक्रिय महादशा / अंतर्दशा:</span>
            <span className="text-white font-medium">
              {report.activeDasha.mahadasha} / {report.activeDasha.antardasha}
            </span>
          </div>
          <div className="bg-black/25 rounded-lg p-3 border border-amber-500/20">
            <span className="text-amber-300 font-semibold block">शनि गोचर / साढ़े साती स्थिति:</span>
            <span className="text-white font-medium">{report.gocharHighlights.sadeSatiPhaseTextHi}</span>
          </div>
          <div className="bg-black/25 rounded-lg p-3 border border-amber-500/20">
            <span className="text-amber-300 font-semibold block">इष्ट देव (D9 कारकांश 12वां भाव):</span>
            <span className="text-white font-medium">{report.ishtaDevata.deityNameHi}</span>
          </div>
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="bg-white dark:bg-stone-900 rounded-xl p-4 shadow-sm border border-stone-200 dark:border-stone-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 max-w-full">
          {[
            { id: 'all', label: 'समस्त समाधान' },
            { id: 'roots', label: 'वृक्षों की जड़ें (Herbal Roots)' },
            { id: 'colors', label: 'रंग चिकित्सा (Colors)' },
            { id: 'yoga', label: 'योग एवं प्राणायाम' },
            { id: 'totke', label: 'रसोई व घरेलू टोटके' },
            { id: 'stotras', label: 'शास्त्रीय स्तोत्र व पाठ' },
            { id: 'ishta', label: 'इष्ट देव साधना' },
            { id: 'bath', label: 'औषधि स्नान' },
            { id: 'prescription', label: 'परामर्श पर्ची' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === t.id
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Problem and Lifestyle Filters */}
        <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
          <select
            value={problemFilter}
            onChange={(e) => setProblemFilter(e.target.value as ProblemFocusArea)}
            className="text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-800 dark:text-stone-200 font-medium"
          >
            <option value="all">समस्त समस्याएं (All Concerns)</option>
            <option value="finance_wealth">आर्थिक संकट व ऋण (Finance)</option>
            <option value="sade_sati_anxiety">साढ़े साती व तनाव (Sade Sati)</option>
            <option value="career_job">करियर, नौकरी व मान (Career)</option>
            <option value="health_arishta">स्वास्थ्य व अरिष्ट शांति (Health)</option>
            <option value="marriage_relationship">विवाह व दांपत्य (Marriage)</option>
            <option value="progeny_children">संतान बाधा (Progeny)</option>
            <option value="court_enemies">कोर्ट-कचहरी व शत्रु (Litigation)</option>
          </select>

          <select
            value={lifestyleFilter}
            onChange={(e) => setLifestyleFilter(e.target.value as LifestyleMode)}
            className="text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-800 dark:text-stone-200 font-medium"
          >
            <option value="all">सभी जीवनशैलियां (All Lifestyles)</option>
            <option value="metro_flat">शहरी फ्लैट अनुकूल (Zero Smoke / Metro)</option>
            <option value="zero_cost">शून्य खर्च घरेलू (Zero Cost)</option>
            <option value="quick_5min">5 मिनट दैनिक (Quick 5-Min)</option>
          </select>
        </div>
      </div>

      {/* TAB CONTENT SECTIONS */}

      {/* 1. Herbal Roots (जड़ी-बूटी धारण) */}
      {(activeTab === 'all' || activeTab === 'roots') && (
        <section className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-md border border-stone-200 dark:border-stone-800">
          <div className="mb-4">
            <h2 className="text-xl font-bold font-serif text-amber-900 dark:text-amber-400">
              ग्रह संबंधित वृक्षों की जड़ें (Planetary Herbal Roots — जड़ी-बूटी धारण)
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
              वैदिक ज्योतिष में रत्नों से भी अधिक सौम्य, निर्दोष एवं अत्यंत किफायती विकल्प। जड़ें पृथ्वी तत्व से जुड़ी होने के कारण बिना किसी आकस्मिक झटके के ग्रहों की रश्मियों को शरीर में अवशोषित करती हैं।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {report.herbalRoots.map((root) => (
              <div
                key={root.planet}
                className={`rounded-xl p-4 border transition-all ${
                  root.isRecommended
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-md ring-1 ring-amber-400'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                    {root.planetHi} ({root.planet})
                  </span>
                  {root.isRecommended && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-600 text-white uppercase tracking-wider">
                      आपकी दशा/लग्न अनुकूल
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="font-semibold text-amber-800 dark:text-amber-300">जड़ का नाम: </span>
                    <span className="text-stone-800 dark:text-stone-200 font-medium">{root.rootNameHi}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-500">रत्न का विकल्प: </span>
                    <span className="text-stone-700 dark:text-stone-300">{root.gemstoneAlternativeHi}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-500">धारण विधि: </span>
                    <span className="text-stone-700 dark:text-stone-300">{root.wrappingMethodHi}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-500">शुभ समय: </span>
                    <span className="text-stone-700 dark:text-stone-300">{root.dayTimeHi}</span>
                  </div>
                  {root.isRecommended && (
                    <div className="mt-2 pt-2 border-t border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-300 font-semibold text-[11.5px]">
                      {root.reasonHi}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. Color Therapy (रंग चिकित्सा) */}
      {(activeTab === 'all' || activeTab === 'colors') && (
        <section className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-md border border-stone-200 dark:border-stone-800">
          <div className="mb-4">
            <h2 className="text-xl font-bold font-serif text-amber-900 dark:text-amber-400">
              रंग चिकित्सा (Astro-Color Therapy — शुभ व वर्जित रंग)
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
              नेत्रों द्वारा मस्तिष्क को मिलने वाले प्रकाश तरंगों का प्रभाव। शुभ रंगों का उपयोग आत्मविश्वास बढ़ाता है, जबकि वर्जित रंगों से मानसिक तनाव और रुकावटें पैदा होती हैं।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800/40 rounded-xl p-5">
              <h3 className="font-bold text-emerald-900 dark:text-emerald-300 text-base mb-2 flex items-center gap-2">
                धारणीय व शुभ रंग (Recommended Colors)
              </h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-400 mb-3">
                आपके लग्न के परम कारक ग्रहों के अनुसार इन रंगों के वस्त्र, रुमाल अथवा आंतरिक वस्त्र पहनें:
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {report.colorTherapy.favorableColorsHi.map((c, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white dark:bg-stone-800 text-emerald-900 dark:text-emerald-200 font-semibold text-xs rounded-full border border-emerald-300 shadow-sm"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <div className="text-xs text-stone-700 dark:text-stone-300 pt-2 border-t border-emerald-200 dark:border-emerald-800">
                <span className="font-semibold text-emerald-800 dark:text-emerald-300">दशा विशेष रंग: </span>
                {report.colorTherapy.dashaColorFocusHi}
              </div>
            </div>

            <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-300 dark:border-rose-800/40 rounded-xl p-5">
              <h3 className="font-bold text-rose-900 dark:text-rose-300 text-base mb-2 flex items-center gap-2">
                वर्जित व त्याज्य रंग (Strictly Avoid Colors)
              </h3>
              <p className="text-xs text-rose-800 dark:text-rose-400 mb-3">
                आपकी कुंडली के मारक व बाधक ग्रहों के रंग; महत्वपूर्ण कार्यों, परीक्षाओं व साक्षात्कारों में इनसे बचें:
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {report.colorTherapy.avoidColorsHi.map((c, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white dark:bg-stone-800 text-rose-900 dark:text-rose-200 font-semibold text-xs rounded-full border border-rose-300 shadow-sm"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <div className="text-xs text-stone-700 dark:text-stone-300 pt-2 border-t border-rose-200 dark:border-rose-800">
                {report.colorTherapy.practicalApplicationHi}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Astro-Yoga & Pranayama */}
      {(activeTab === 'all' || activeTab === 'yoga') && (
        <section className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-md border border-stone-200 dark:border-stone-800">
          <div className="mb-4">
            <h2 className="text-xl font-bold font-serif text-amber-900 dark:text-amber-400">
              योग एवं प्राणायाम परिहार (Astro-Yoga & Pranayama Alignment)
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
              ग्रह केवल आकाश में नहीं, हमारे सूक्ष्म शरीर की 72,000 नाड़ियों और चक्रों में स्पंदित होते हैं। विशिष्ट आसन व प्राणायाम से दशा के नकारात्मक प्रभाव स्वतः विसर्जित हो जाते हैं।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.astroYoga.map((yoga, idx) => (
              <div
                key={idx}
                className="bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-xl p-5"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold font-serif text-amber-900 dark:text-amber-300 text-base">
                    सक्रिय दशा स्वामी ({yoga.planetTargeted}) हेतु यौगिक दिनचर्या
                  </span>
                  <span className="text-xs bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-full font-semibold">
                    {yoga.durationMinutes} मिनट नित्य
                  </span>
                </div>

                <div className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
                  <div>
                    <span className="font-semibold text-stone-900 dark:text-stone-100 block mb-1">सुझाए गए मुख्य आसन:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-stone-600 dark:text-stone-300">
                      {yoga.asanasHi.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-stone-200 dark:border-stone-700">
                    <span className="font-semibold text-stone-900 dark:text-stone-100 block mb-1">संस्तुत प्राणायाम:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-stone-600 dark:text-stone-300">
                      {yoga.pranayamaHi.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-stone-200 dark:border-stone-700">
                    <span className="font-semibold text-stone-900 dark:text-stone-100">शुभ समय: </span>
                    <span>{yoga.timingHi}</span>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-lg border border-amber-200/60 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 font-medium">
                    {yoga.therapeuticBenefitsHi}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Kitchen & Household Totke */}
      {(activeTab === 'all' || activeTab === 'totke') && (
        <section className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-md border border-stone-200 dark:border-stone-800">
          <div className="mb-4">
            <h2 className="text-xl font-bold font-serif text-amber-900 dark:text-amber-400">
              घरेलू व रसोई के सरल टोटके (Zero-Cost Kitchen & Household Upaya)
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
              लाल किताब एवं लोक परंपरा के सिद्ध घरेलू उपाय, जिनमें किसी पुरोहित या धन की आवश्यकता नहीं है। आपकी अपनी रसोई की सामग्री ही औषधि व ग्रह-शांति का कार्य करती है।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTotke.map((totka, idx) => (
              <div
                key={idx}
                className="bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                      {totka.titleHi}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                      {totka.lifestyleTag === 'zero_cost'
                        ? 'शून्य खर्च'
                        : totka.lifestyleTag === 'metro_friendly'
                        ? 'फ्लैट अनुकूल'
                        : 'नित्य 2 मिनट'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300 mb-3">
                    <div>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">आवश्यक सामग्री: </span>
                      {totka.itemsNeededHi}
                    </div>
                    <div>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">सरल विधि: </span>
                      {totka.stepByStepHi}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200 dark:border-stone-700 text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                  {totka.logicalAstroBasisHi}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Classical Stotras & Paths */}
      {(activeTab === 'all' || activeTab === 'stotras') && (
        <section className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-md border border-stone-200 dark:border-stone-800">
          <div className="mb-4">
            <h2 className="text-xl font-bold font-serif text-amber-900 dark:text-amber-400">
              संकट एवं समस्या अनुसार शास्त्रीय स्तोत्र व पाठ (Problem-Specific Stotras)
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
              ऋषि-प्रणीत सिद्ध स्तोत्र जो व्यक्ति के जीवन के विशिष्ट संकटों (ऋण, साढ़े साती, रोग, संतान, मुकदमा) में ढाल बनकर रक्षा करते हैं।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStotras.map((stotra, idx) => (
              <div
                key={idx}
                className="bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-5"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold font-serif text-base text-amber-900 dark:text-amber-200">
                    {stotra.stotraNameHi}
                  </h3>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      stotra.urgencyLevel === 'high'
                        ? 'bg-rose-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {stotra.urgencyLevel === 'high' ? 'अति आवश्यक' : 'नियमित पाठ'}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
                  <div>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">आराध्य देवता: </span>
                    <span className="text-amber-800 dark:text-amber-300 font-medium">{stotra.keyDeity}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">पाठ संख्या एवं शुभ वेला: </span>
                    <span>{stotra.bestDayTimingHi} ({stotra.recommendedCount})</span>
                  </div>
                  <div className="bg-white dark:bg-stone-900 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800 text-center font-serif text-xs text-amber-900 dark:text-amber-300 italic">
                    {stotra.sampleSanskritVerse}
                  </div>
                  <div className="text-[11.5px] text-stone-800 dark:text-stone-200 font-medium">
                    {stotra.meaningHi}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Ishta Devata Sadhana */}
      {(activeTab === 'all' || activeTab === 'ishta') && (
        <section className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-md border border-stone-200 dark:border-stone-800">
          <div className="mb-4">
            <h2 className="text-xl font-bold font-serif text-amber-900 dark:text-amber-400">
              इष्ट देव मोक्ष साधना (D9 कारकांश से 12वें भाव के देवता)
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
              जैमिनी उपदेश सूत्रों के अनुसार आत्मा का सच्चा उद्धार व जन्म-जन्मांतर के प्रारब्ध का मोचन केवल अपने इष्ट देव के मंत्र जप से ही संभव है।
            </p>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-stone-800 dark:to-stone-800/80 border border-amber-300 dark:border-amber-700 rounded-xl p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div>
                <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                  आपके जन्मकालिक इष्ट देव
                </span>
                <h3 className="text-2xl font-serif font-bold text-amber-950 dark:text-amber-100">
                  {report.ishtaDevata.deityNameHi}
                </h3>
              </div>
              <div className="bg-amber-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
                नित्य 108 जप अनिवार्य
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
              <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-amber-200 dark:border-amber-800 text-center">
                <span className="text-xs text-stone-500 block mb-1">सिद्ध मूल मंत्र</span>
                <span className="text-lg sm:text-xl font-serif font-bold text-amber-900 dark:text-amber-300 tracking-wide">
                  {report.ishtaDevata.moolaMantra}
                </span>
              </div>

              <div>
                <span className="font-semibold text-stone-900 dark:text-stone-100">शास्त्रीय आधार (जैमिनी सिद्धांत): </span>
                <p className="mt-0.5 text-stone-600 dark:text-stone-300 text-xs leading-relaxed">
                  {report.ishtaDevata.classicalBasisHi}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-2 border-t border-amber-200 dark:border-amber-800/60 text-xs">
                <div>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">जप संख्या: </span>
                  <span>{report.ishtaDevata.recitationCount}</span>
                </div>
                <div>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">प्रिय नैवेद्य/भोग: </span>
                  <span>{report.ishtaDevata.offeringHi}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. Herbal Planetary Astro-Baths (स्नान परिहार) */}
      {(activeTab === 'all' || activeTab === 'bath') && (
        <section className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-md border border-stone-200 dark:border-stone-800">
          <div className="mb-4">
            <h2 className="text-xl font-bold font-serif text-amber-900 dark:text-amber-400">
              औषधि स्नान परिहार (Herbal Planetary Astro-Baths)
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
              शरीर के बाह्य आभामंडल (Aura) पर जमी हुई नकारात्मक तरंगों को जल एवं प्राकृतिक औषधियों के संयोग से शुद्ध करने का प्राचीन विधान।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {report.herbalBaths.map((bath, idx) => (
              <div
                key={idx}
                className="bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-serif font-bold text-amber-900 dark:text-amber-300 text-sm">
                      {bath.dayOfWeekHi} ({bath.planet})
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                    <div>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">सामग्री: </span>
                      {bath.herbalIngredientsHi.join(', ')}
                    </div>
                    <div>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">विधि: </span>
                      {bath.methodHi}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-200 dark:border-stone-700 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                  {bath.benefitsHi}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. Printable Prescription Slip */}
      {(activeTab === 'all' || activeTab === 'prescription') && (
        <section className="bg-white dark:bg-stone-900 rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-amber-600/40 printable-prescription">
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-stone-200 dark:border-stone-700">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-700 dark:text-amber-400">
                AV Astro Vibe Holistic Vedic Prescription
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
                वैदिक उपचार परामर्श पर्ची (Remedy Prescription)
              </h2>
            </div>
            <button
              onClick={handlePrintSlip}
              className="btn btn-primary"
            >
              प्रिंट / सुरक्षित करें
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm mb-6">
            <div className="bg-stone-50 dark:bg-stone-800 p-3 rounded-lg">
              <span className="font-semibold text-stone-500 block">जातक का नाम:</span>
              <span className="font-bold text-stone-900 dark:text-stone-100 text-base">{report.prescriptionSlip.clientName}</span>
            </div>
            <div className="bg-stone-50 dark:bg-stone-800 p-3 rounded-lg">
              <span className="font-semibold text-stone-500 block">सक्रिय दशा व स्थिति:</span>
              <span className="font-bold text-stone-900 dark:text-stone-100 text-base">{report.prescriptionSlip.activeDasha}</span>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <span className="font-bold text-amber-900 dark:text-amber-300 block mb-0.5">1. प्रधान जड़ी-बूटी धारण:</span>
              <span className="text-stone-800 dark:text-stone-200">{report.prescriptionSlip.primaryRoot}</span>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
              <span className="font-bold text-stone-900 dark:text-stone-100 block mb-0.5">2. वर्ण व रंग नियम:</span>
              <span className="text-stone-800 dark:text-stone-200">{report.prescriptionSlip.primaryColorRule}</span>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
              <span className="font-bold text-stone-900 dark:text-stone-100 block mb-0.5">3. नित्य स्तोत्र एवं मंत्र पाठ:</span>
              <span className="text-stone-800 dark:text-stone-200">{report.prescriptionSlip.coreDailyStotra}</span>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
              <span className="font-bold text-stone-900 dark:text-stone-100 block mb-0.5">4. घरेलू व जल परिहार:</span>
              <span className="text-stone-800 dark:text-stone-200">{report.prescriptionSlip.kitchenZeroCostHabit}</span>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
              <span className="font-bold text-stone-900 dark:text-stone-100 block mb-0.5">5. आहार एवं सात्विक नियम:</span>
              <span className="text-stone-800 dark:text-stone-200">{report.prescriptionSlip.dietaryTip}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-700 text-xs italic text-stone-600 dark:text-stone-400 bg-amber-50/50 dark:bg-stone-800/40 p-4 rounded-xl">
            <span className="font-bold text-amber-900 dark:text-amber-300 not-italic block mb-1">ज्योतिषीय परामर्श व मार्गदर्शन:</span>
            {report.prescriptionSlip.astrologerCounselHi}
          </div>
        </section>
      )}
    </div>
  );
};

export default HolisticRemediesView;
