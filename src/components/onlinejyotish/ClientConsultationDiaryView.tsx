import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Edit3, Plus, Printer, Trash2, CheckCircle2, User, Sparkles } from 'lucide-react';
import type { ChartData, BirthInput } from '../../astro/types';
import { formatDateDmy } from '../../astro/time';
import { useLanguage } from '../../i18n/LanguageContext';

export interface ConsultationNoteItem {
  id: string;
  date: string;
  focusArea: string;
  clientQuestions: string;
  astrologicalFindings: string;
  predictionsMade: string;
  timeframe: string;
  remediesPrescribed: string;
  followUpDate: string;
  clientFeedback: string;
  status: 'In Progress' | 'Verified True' | 'Pending Followup';
}

interface ClientConsultationDiaryViewProps {
  chart: ChartData;
  activeInput: BirthInput;
  onNavigate?: (view: string) => void;
}

export const ClientConsultationDiaryView: React.FC<ClientConsultationDiaryViewProps> = ({
  chart,
  activeInput,
  onNavigate,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const storageKey = `av_client_diary_${activeInput.id}`;

  const [notes, setNotes] = useState<ConsultationNoteItem[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [
      {
        id: 'initial-sample',
        date: new Date().toISOString().slice(0, 10),
        focusArea: 'करियर एवं व्यापार विस्तार (Career & Growth)',
        clientQuestions: 'नई कंपनी में स्विच करने का सही समय कब है? पदोन्नति के योग?',
        astrologicalFindings: 'दशमेश गुरु का अनुकूल गोचर, विंशोत्तरी में गुरु की अंतर्दशा चल रही है। 10वें भाव पर अमृत दृष्टि।',
        predictionsMade: 'आगामी 3 से 5 माह के भीतर प्रतिष्ठित पद का प्रस्ताव मिलेगा। स्थान परिवर्तन संभव।',
        timeframe: 'नवंबर 2026 – मार्च 2027',
        remediesPrescribed: 'बृहस्पतिवार को हल्दी युक्त जल का अर्घ्य, गुरुवार को केले के वृक्ष की जड़ धारण, विष्णु सहस्रनाम पाठ।',
        followUpDate: '2026-12-15',
        clientFeedback: 'परामर्श अत्यंत सटीक लगा। उपाय शुरू किए हैं।',
        status: 'In Progress',
      },
    ];
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Omit<ConsultationNoteItem, 'id'>>({
    date: new Date().toISOString().slice(0, 10),
    focusArea: 'करियर एवं आजीविका (Career)',
    clientQuestions: '',
    astrologicalFindings: '',
    predictionsMade: '',
    timeframe: '',
    remediesPrescribed: '',
    followUpDate: '',
    clientFeedback: '',
    status: 'In Progress',
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(notes));
    } catch {
      // ignore
    }
  }, [notes, storageKey]);

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    const newNote: ConsultationNoteItem = {
      ...formData,
      id: `note_${Date.now()}`,
    };
    setNotes([newNote, ...notes]);
    setShowAddForm(false);
    setFormData({
      date: new Date().toISOString().slice(0, 10),
      focusArea: 'सामान्य फलादेश (General Reading)',
      clientQuestions: '',
      astrologicalFindings: '',
      predictionsMade: '',
      timeframe: '',
      remediesPrescribed: '',
      followUpDate: '',
      clientFeedback: '',
      status: 'In Progress',
    });
  };

  const handleDeleteNote = (id: string) => {
    if (window.confirm(isHi ? 'क्या आप इस परामर्श नोट को हटाना चाहते हैं?' : 'Delete this consultation note?')) {
      setNotes(notes.filter((n) => n.id !== id));
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
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
            <BookOpen size={13} />
            {isHi ? 'व्यावसायिक ज्योतिषी केस डायरी' : 'Professional Astrologer Case Diary'}
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: '24px', fontFamily: 'Cinzel, Playfair Display, serif', color: 'var(--text)' }}>
            {isHi ? 'जातक परामर्श डायरी एवं केस नोट्स' : 'Client Consultation Diary & Case Notes'}
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
            {isHi
              ? `जातक: ${activeInput.name} (${formatDateDmy(activeInput.date)} · ${activeInput.city}) के समस्त पूर्व परामर्श, पूछे गए प्रश्न, की गई भविष्यवाणियां एवं परिणाम फीडबैक का सुरक्षित रिकॉर्ड।`
              : `Permanent record of consultations, client inquiries, predictions given, remedies prescribed, and verification feedback for ${activeInput.name}.`}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="oj-action-btn primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus size={14} />
            <span>{showAddForm ? (isHi ? 'फॉर्म बंद करें' : 'Close Form') : (isHi ? 'नया परामर्श नोट दर्ज करें' : 'New Consultation Note')}</span>
          </button>

          <button
            type="button"
            className="oj-action-btn secondary"
            onClick={() => window.print()}
          >
            <Printer size={14} />
            <span>{isHi ? 'परामर्श डायरी प्रिंट करें' : 'Print Notes'}</span>
          </button>
        </div>
      </div>

      {/* New Consultation Form Modal/Drawer */}
      {showAddForm && (
        <section className="oj-card" style={{ marginBottom: '24px', padding: '24px', border: '2px solid #b45309' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '18px', color: '#b45309' }}>
            {isHi ? 'नवीन परामर्श प्रविष्टि दर्ज करें' : 'Record New Consultation Note'}
          </h3>

          <form onSubmit={handleSaveNote} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  {isHi ? 'परामर्श तिथि:' : 'Consultation Date:'}
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  {isHi ? 'परामर्श का मुख्य विषय:' : 'Focus Area:'}
                </label>
                <select
                  value={formData.focusArea}
                  onChange={(e) => setFormData({ ...formData, focusArea: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}
                >
                  <option value="करियर, नौकरी व व्यापार (Career)">करियर, नौकरी व व्यापार (Career)</option>
                  <option value="विवाह, संबंध व दांपत्य (Marriage)">विवाह, संबंध व दांपत्य (Marriage)</option>
                  <option value="संतान बाधा व परिवार (Progeny)">संतान बाधा व परिवार (Progeny)</option>
                  <option value="आर्थिक स्थिति व कर्ज मुक्ति (Finance)">आर्थिक स्थिति व कर्ज मुक्ति (Finance)</option>
                  <option value="स्वास्थ्य अरिष्ट व रोग शांति (Health)">स्वास्थ्य अरिष्ट व रोग शांति (Health)</option>
                  <option value="विदेश यात्रा व निवास (Foreign)">विदेश यात्रा व निवास (Foreign)</option>
                  <option value="कोर्ट-कचहरी व विवाद (Legal)">कोर्ट-कचहरी व विवाद (Legal)</option>
                  <option value="सामान्य संपूर्ण फलादेश (General)">सामान्य संपूर्ण फलादेश (General)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  {isHi ? 'अनुवर्ती परामर्श तिथि (Follow-up):' : 'Follow-up Date:'}
                </label>
                <input
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                {isHi ? 'जातक द्वारा पूछे गए प्रमुख प्रश्न:' : 'Client Inquiries / Questions Asked:'}
              </label>
              <textarea
                rows={2}
                value={formData.clientQuestions}
                onChange={(e) => setFormData({ ...formData, clientQuestions: e.target.value })}
                placeholder={isHi ? 'जैसे: नौकरी में पदोन्नति कब होगी? क्या व्यापार में पार्टनरशिप ठीक रहेगी?' : 'e.g. When will promotion happen?'}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                {isHi ? 'ज्योतिषीय निष्कर्ष (दशा, गोचर, भाव बल):' : 'Astrological Diagnostic Findings:'}
              </label>
              <textarea
                rows={2}
                value={formData.astrologicalFindings}
                onChange={(e) => setFormData({ ...formData, astrologicalFindings: e.target.value })}
                placeholder={isHi ? 'दशा, गोचर, कारक ग्रहों की स्थिति व भाव दृष्टि...' : 'Dasha, Gochar, Transit aspects...'}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  {isHi ? 'दी गई भविष्यवाणी एवं संभावित समय:' : 'Predictions Given & Timeframe:'}
                </label>
                <textarea
                  rows={2}
                  value={formData.predictionsMade}
                  onChange={(e) => setFormData({ ...formData, predictionsMade: e.target.value })}
                  placeholder={isHi ? 'अनुमानित घटना समय...' : 'Predicted timeframe and event...'}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  {isHi ? 'बताए गए वैदिक / व्यावहारिक उपाय:' : 'Remedies Prescribed:'}
                </label>
                <textarea
                  rows={2}
                  value={formData.remediesPrescribed}
                  onChange={(e) => setFormData({ ...formData, remediesPrescribed: e.target.value })}
                  placeholder={isHi ? 'जड़ी-बूटी, स्तोत्र, दान, जप...' : 'Herbal roots, stotra, charity...'}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="oj-action-btn primary">
                {isHi ? 'परामर्श नोट सुरक्षित करें' : 'Save Consultation Record'}
              </button>
              <button type="button" className="oj-action-btn secondary" onClick={() => setShowAddForm(false)}>
                {isHi ? 'रद्द करें' : 'Cancel'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Notes List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {notes.map((note) => (
          <div
            key={note.id}
            className="oj-card"
            style={{
              padding: '20px',
              borderRadius: '14px',
              border: '1px solid var(--border)',
              background: 'var(--bg-elevated)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '9999px', background: '#b45309', color: '#fff', fontWeight: 700 }}>
                  {note.focusArea}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  परामर्श तिथि: <strong>{formatDateDmy(note.date)}</strong>
                </span>
                {note.followUpDate && (
                  <span style={{ fontSize: '11.5px', color: '#2563eb' }}>
                    · अनुवर्ती: {formatDateDmy(note.followUpDate)}
                  </span>
                )}
              </div>

              <button
                type="button"
                className="icon-tool-btn"
                onClick={() => handleDeleteNote(note.id)}
                title="नोट हटाएं"
                style={{ color: '#dc2626' }}
              >
                <Trash2 size={15} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div>
                <strong style={{ color: 'var(--text)' }}>{isHi ? 'पूछे गए प्रश्न:' : 'Inquiries:'}</strong>{' '}
                <span>{note.clientQuestions}</span>
              </div>

              {note.astrologicalFindings && (
                <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'var(--bg-subtle)' }}>
                  <strong style={{ color: '#b45309' }}>{isHi ? 'ज्योतिषीय आधार:' : 'Astrological Basis:'}</strong>{' '}
                  <span style={{ color: 'var(--text-muted)' }}>{note.astrologicalFindings}</span>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(217, 119, 6, 0.08)', borderLeft: '3px solid #b45309' }}>
                  <strong style={{ color: '#92400e', display: 'block', marginBottom: '4px' }}>
                    {isHi ? 'दी गई भविष्यवाणी (Prediction):' : 'Prediction:'}
                  </strong>
                  <span>{note.predictionsMade}</span>
                </div>

                <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.08)', borderLeft: '3px solid #059669' }}>
                  <strong style={{ color: '#065f46', display: 'block', marginBottom: '4px' }}>
                    {isHi ? 'सुझाए गए उपचार (Remedies):' : 'Prescribed Remedies:'}
                  </strong>
                  <span>{note.remediesPrescribed}</span>
                </div>
              </div>

              {note.clientFeedback && (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', borderTop: '1px dashed var(--border)', paddingTop: '8px' }}>
                  {isHi ? 'जातक फीडबैक:' : 'Client Feedback:'} "{note.clientFeedback}"
                </div>
              )}
            </div>
          </div>
        ))}

        {notes.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            {isHi ? 'इस जातक के लिए अभी कोई परामर्श नोट नहीं है। ऊपर दिए गए बटन से नया नोट दर्ज करें।' : 'No consultation notes recorded yet.'}
          </div>
        )}
      </div>
    </div>
  );
};
