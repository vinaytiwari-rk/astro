import type { DivisionalChartId } from '../../astro/types';

export type WorksheetId =
  | 'main'
  | 'vargas'
  | 'strengths'
  | 'dashas'
  | 'transits'
  | 'yogas_research'
  | 'matchmaking'
  | 'ephemeris_panchang'
  | 'custom';

export type CustomWidgetId =
  | 'd1_chart'
  | 'd9_chart'
  | 'varga_picker_chart'
  | 'planets_table'
  | 'panchanga_avakahada'
  | 'vimshottari_5tier'
  | 'shadbala_table'
  | 'bhavabala_table'
  | 'shad_phala'
  | 'ashtakavarga_sav'
  | 'vimsopaka_matrix'
  | 'gochar_live'
  | 'varshaphala_summary'
  | 'yogas_active'
  | 'kp_cusps_ruling'
  | 'jaimini_arudhas'
  | 'dossier_summary';

export interface CustomWorksheetPreset {
  id: string;
  name: string;
  layout: '2-pane' | '4-pane' | '6-pane';
  slots: CustomWidgetId[];
  vargaId: DivisionalChartId;
}

export interface ChartDisplayOptions {
  showDegrees: boolean;
  showArudhas: boolean;
  showSavInRasi: boolean;
  rasiRef: 'lagna' | 'chalit' | 'chandra' | 'surya' | 'arudha' | `house:${number}`;
  secondaryVarga: DivisionalChartId;
}

export const DEFAULT_CUSTOM_PRESETS: CustomWorksheetPreset[] = [
  {
    id: 'classic-quad',
    name: 'Classic Jyotish Quad',
    layout: '4-pane',
    slots: ['d1_chart', 'd9_chart', 'planets_table', 'vimshottari_5tier'],
    vargaId: 'D10',
  },
  {
    id: 'kp-btr-pro',
    name: 'KP & Rectification Pro',
    layout: '4-pane',
    slots: ['d1_chart', 'kp_cusps_ruling', 'vimshottari_5tier', 'gochar_live'],
    vargaId: 'D60',
  },
  {
    id: 'research-6',
    name: '6-Pane Research Desk',
    layout: '6-pane',
    slots: ['d1_chart', 'd9_chart', 'varga_picker_chart', 'shadbala_table', 'ashtakavarga_sav', 'yogas_active'],
    vargaId: 'D10',
  },
];

export const WIDGET_CATALOG: Array<{ id: CustomWidgetId; labelEn: string; labelHi: string }> = [
  { id: 'd1_chart', labelEn: 'D-1 Primary Horoscope Chart', labelHi: 'D-1 लग्न / चलित / चंद्र कुंडली' },
  { id: 'd9_chart', labelEn: 'D-9 Navamsha Chart', labelHi: 'D-9 नवांश कुंडली' },
  { id: 'varga_picker_chart', labelEn: 'Interactive Varga Chart (D2–D60)', labelHi: 'इच्छित वर्ग कुंडली (D2–D60)' },
  { id: 'planets_table', labelEn: 'Graha Sphuta & Nakshatra Table', labelHi: 'ग्रह स्पष्ट व नक्षत्र तालिका' },
  { id: 'panchanga_avakahada', labelEn: 'Panchanga, Avakahada & Ghatak', labelHi: 'पंचांग, अवकहड़ा व घातक चक्र' },
  { id: 'vimshottari_5tier', labelEn: '5-Level Vimshottari Dasha (Prana)', labelHi: '5-स्तरीय विंशोत्तरी दशा (प्राण सहित)' },
  { id: 'shadbala_table', labelEn: 'Shadbala 6-Fold Strength & Bars', labelHi: 'षड्बल व इष्ट/कष्ट फल' },
  { id: 'bhavabala_table', labelEn: 'Bhava Bala (House Potency)', labelHi: 'भाव बल (12 भाव)' },
  { id: 'shad_phala', labelEn: 'Shad Phala (12 Houses Good/Bad)', labelHi: 'षड्फल (12 भाव शुभ-अशुभ फल)' },
  { id: 'ashtakavarga_sav', labelEn: 'SAV / BAV & Shodhya Pinda', labelHi: 'सर्वाष्टकवर्ग व शोध्य पिंड' },
  { id: 'vimsopaka_matrix', labelEn: 'Vimsopaka Bala (Shad/Sapta/Dasha/Shodash)', labelHi: 'विंशोपक बल (4 श्रेणियां)' },
  { id: 'gochar_live', labelEn: 'Live Gochar, Kakshya & Time of Transits', labelHi: 'गोचर, कक्ष्या व आगामी राशि परिवर्तन' },
  { id: 'varshaphala_summary', labelEn: 'Annual Varshaphala & 12 Monthly Charts', labelHi: 'वर्षफल व 12 मासिक ताजिक चक्र' },
  { id: 'yogas_active', labelEn: 'Active Classical Yogas Analyzer', labelHi: 'सक्रिय शास्त्रीय योग विश्लेषण' },
  { id: 'kp_cusps_ruling', labelEn: 'KP Cuspal Sub-Lords & Ruling Planets', labelHi: 'के.पी. भाव सब-लॉर्ड व रूलिंग ग्रह' },
  { id: 'jaimini_arudhas', labelEn: 'Jaimini Karakas & Arudha Padas', labelHi: 'जैमिनी कारक व आरूढ़ पद' },
  { id: 'dossier_summary', labelEn: '360° Life Matrix (74 Classical Attr)', labelHi: '360° जीवन सारांश (74 शास्त्रीय तथ्य)' },
];

export const WORKSHEET_TABS: Array<{ id: WorksheetId; labelEn: string; labelHi: string; shortcut: string }> = [
  { id: 'main', labelEn: '1. Main Horoscope', labelHi: '1. मुख्य कुंडली', shortcut: 'F1' },
  { id: 'vargas', labelEn: '2. All Vargas (D1–D60)', labelHi: '2. समस्त वर्ग चक्र', shortcut: 'F2' },
  { id: 'strengths', labelEn: '3. Strengths & Shad Phala', labelHi: '3. षड्बल, षड्फल व SAV', shortcut: 'F3' },
  { id: 'dashas', labelEn: '4. All Dasha Systems', labelHi: '4. समस्त दशा प्रणालियां', shortcut: 'F4' },
  { id: 'transits', labelEn: '5. Transits & Varsha 12M', labelHi: '5. गोचर व 12-मासिक वर्षफल', shortcut: 'F5' },
  { id: 'yogas_research', labelEn: '6. Yogas & Classical Systems', labelHi: '6. योग, पद्धतियां व शोध', shortcut: 'F6' },
  { id: 'matchmaking', labelEn: '7. Matchmaking & Synastry', labelHi: '7. विवाह मिलान व दशकूट', shortcut: 'F7' },
  { id: 'ephemeris_panchang', labelEn: '8. Ephemeris & Panchanga', labelHi: '8. पंचांग व ग्रह स्पष्ट', shortcut: 'F8' },
  { id: 'custom', labelEn: '9. Custom Builder', labelHi: '9. कस्टम वर्कशीट', shortcut: 'F9' },
];
