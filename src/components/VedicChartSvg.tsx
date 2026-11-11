import React, { useMemo, useRef } from 'react';
import { Download } from 'lucide-react';
import type { ChartStyle } from '../astro/types';
import { useLanguage } from '../i18n/LanguageContext';
import { trPlanetShort, trSign, trSignShort, type AppLanguage } from '../i18n/translations';

export interface ChartBadgeItem {
  id: string;
  label: string;
  signIndex: number; // 0..11
  houseNumber?: number; // 1..12 (used if North Indian chart uses Bhava houses)
  isLagna?: boolean;
  isRetrograde?: boolean;
  isCombust?: boolean;
  isVargottama?: boolean;
  dignity?: string;
  tooltip?: string;
}

interface VedicChartSvgProps {
  title: string;
  subtitle?: string;
  style: ChartStyle;
  lagnaSignIndex: number;
  items: ChartBadgeItem[];
  savBindus?: number[]; // 12 values by sign index 0..11
  compact?: boolean;
  showDownload?: boolean;
  centerLabel?: string;
}

function formatBadgeText(item: ChartBadgeItem, lang: AppLanguage): string {
  const translated = trPlanetShort(item.id, lang);
  let text = lang === 'hi' && translated !== item.id ? translated : item.label;
  if (item.isRetrograde && item.id !== 'Rahu' && item.id !== 'Ketu') {
    text += lang === 'hi' ? '(व)' : '(R)';
  }
  if (item.isCombust) text += '*';
  if (item.dignity === 'Exalted') text += '↑';
  if (item.dignity === 'Debilitated') text += '↓';
  if (item.isVargottama) text += '□';
  return text;
}

function getBadgeColorClass(item: ChartBadgeItem): string {
  if (item.isLagna) return 'chart-badge-lagna';
  if (item.dignity === 'Exalted' || item.dignity === 'Moolatrikona' || item.dignity === 'Own Sign') {
    return 'chart-badge-strong';
  }
  if (item.dignity === 'Debilitated') return 'chart-badge-weak';
  if (item.isRetrograde) return 'chart-badge-retro';
  return 'chart-badge-normal';
}

// North Indian House Regions (400x400 viewBox, outer frame 8..392)
interface NorthRegion {
  house: number;
  signPos: [number, number];
  center: [number, number];
  maxPerRow: number;
}

const NORTH_REGIONS: NorthRegion[] = [
  { house: 1, signPos: [200, 178], center: [200, 102], maxPerRow: 3 },
  { house: 2, signPos: [104, 86], center: [104, 46], maxPerRow: 2 },
  { house: 3, signPos: [84, 108], center: [46, 104], maxPerRow: 2 },
  { house: 4, signPos: [176, 204], center: [102, 200], maxPerRow: 3 },
  { house: 5, signPos: [84, 298], center: [46, 296], maxPerRow: 2 },
  { house: 6, signPos: [104, 322], center: [104, 356], maxPerRow: 2 },
  { house: 7, signPos: [200, 228], center: [200, 298], maxPerRow: 3 },
  { house: 8, signPos: [296, 322], center: [296, 356], maxPerRow: 2 },
  { house: 9, signPos: [316, 298], center: [354, 296], maxPerRow: 2 },
  { house: 10, signPos: [224, 204], center: [298, 200], maxPerRow: 3 },
  { house: 11, signPos: [316, 108], center: [354, 104], maxPerRow: 2 },
  { house: 12, signPos: [296, 86], center: [296, 46], maxPerRow: 2 },
];

// South Indian Sign Grid (col 0..3, row 0..3)
const SOUTH_SIGN_CELLS: Array<{ sign: number; col: number; row: number }> = [
  { sign: 11, col: 0, row: 0 },
  { sign: 0, col: 1, row: 0 },
  { sign: 1, col: 2, row: 0 },
  { sign: 2, col: 3, row: 0 },
  { sign: 3, col: 3, row: 1 },
  { sign: 4, col: 3, row: 2 },
  { sign: 5, col: 3, row: 3 },
  { sign: 6, col: 2, row: 3 },
  { sign: 7, col: 1, row: 3 },
  { sign: 8, col: 0, row: 3 },
  { sign: 9, col: 0, row: 2 },
  { sign: 10, col: 0, row: 1 },
];

// East Indian 3x3 layout centers (400x400, inner 8..392 -> cell = 128)
const EAST_SIGN_CENTERS: Array<{ sign: number; cx: number; cy: number; numPos: [number, number] }> = [
  { sign: 0, cx: 200, cy: 74, numPos: [148, 26] },      // Top-Mid
  { sign: 1, cx: 92, cy: 48, numPos: [122, 24] },       // Top-Left Upper
  { sign: 2, cx: 48, cy: 96, numPos: [20, 126] },       // Top-Left Lower
  { sign: 3, cx: 72, cy: 200, numPos: [20, 154] },      // Mid-Left
  { sign: 4, cx: 48, cy: 304, numPos: [20, 282] },      // Bot-Left Upper
  { sign: 5, cx: 92, cy: 356, numPos: [122, 384] },     // Bot-Left Lower
  { sign: 6, cx: 200, cy: 330, numPos: [148, 384] },    // Bot-Mid
  { sign: 7, cx: 308, cy: 356, numPos: [280, 384] },    // Bot-Right Lower
  { sign: 8, cx: 352, cy: 304, numPos: [380, 282] },    // Bot-Right Upper
  { sign: 9, cx: 328, cy: 200, numPos: [380, 154] },    // Mid-Right
  { sign: 10, cx: 352, cy: 96, numPos: [380, 126] },    // Top-Right Lower
  { sign: 11, cx: 308, cy: 48, numPos: [280, 24] },     // Top-Right Upper
];

function renderItemsCluster(
  items: ChartBadgeItem[],
  cx: number,
  cy: number,
  maxPerRow: number,
  compact: boolean,
  lang: AppLanguage
) {
  if (items.length === 0) return null;
  const rows: ChartBadgeItem[][] = [];
  for (let i = 0; i < items.length; i += maxPerRow) {
    rows.push(items.slice(i, i + maxPerRow));
  }
  const lineHeight = compact ? 15 : 17;
  const startY = cy - ((rows.length - 1) * lineHeight) / 2;

  return rows.map((row, rIdx) => {
    const y = startY + rIdx * lineHeight;
    const stepX = compact ? 31 : 35;
    const startX = cx - ((row.length - 1) * stepX) / 2;
    return row.map((item, cIdx) => (
      <text
        key={`${item.id}-${rIdx}-${cIdx}`}
        x={startX + cIdx * stepX}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        className={`chart-planet-text ${getBadgeColorClass(item)} ${compact ? 'is-compact' : ''}`}
      >
        <title>{item.tooltip || item.label}</title>
        {formatBadgeText(item, lang)}
      </text>
    ));
  });
}

export const VedicChartSvg: React.FC<VedicChartSvgProps> = ({
  title,
  subtitle,
  style,
  lagnaSignIndex,
  items,
  savBindus,
  compact = false,
  showDownload = true,
  centerLabel,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { lang, t } = useLanguage();

  const groupedBySign = useMemo(() => {
    const map = Array.from({ length: 12 }, () => [] as ChartBadgeItem[]);
    for (const it of items) {
      const idx = ((it.signIndex % 12) + 12) % 12;
      map[idx].push(it);
    }
    return map;
  }, [items]);

  const handleDownload = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const raw = serializer.serializeToString(svgRef.current);
    const blob = new Blob([raw], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`vedic-chart-card ${compact ? 'is-compact' : ''}`}>
      <div className="vedic-chart-header">
        <div>
          <div className="vedic-chart-title">{title}</div>
          {subtitle && <div className="vedic-chart-subtitle">{subtitle}</div>}
        </div>
        {showDownload && (
          <button
            type="button"
            className="icon-btn"
            onClick={handleDownload}
            title={lang === 'hi' ? 'SVG कुंडली डाउनलोड करें' : 'Download SVG Chart'}
          >
            <Download size={14} />
          </button>
        )}
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 400 400"
        className="vedic-chart-svg"
        role="img"
        aria-label={title}
      >
        <rect x="8" y="8" width="384" height="384" rx="4" className="chart-bg" />

        {style === 'north' && (
          <g>
            {/* Outer Border + Diagonals + Inner Diamond */}
            <rect x="8" y="8" width="384" height="384" className="chart-line-outer" />
            <line x1="8" y1="8" x2="392" y2="392" className="chart-line" />
            <line x1="392" y1="8" x2="8" y2="392" className="chart-line" />
            <polygon points="200,8 392,200 200,392 8,200" className="chart-line-inner" />

            {NORTH_REGIONS.map((reg) => {
              const signIdx = (lagnaSignIndex + reg.house - 1) % 12;
              const signItems = groupedBySign[signIdx];
              const bindu = savBindus ? savBindus[signIdx] : undefined;
              return (
                <g key={reg.house}>
                  <text
                    x={reg.signPos[0]}
                    y={reg.signPos[1]}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="chart-rasi-num"
                  >
                    {signIdx + 1}
                    {bindu !== undefined ? ` (${bindu})` : ''}
                  </text>
                  {renderItemsCluster(signItems, reg.center[0], reg.center[1], reg.maxPerRow, compact, lang)}
                </g>
              );
            })}
          </g>
        )}

        {style === 'south' && (
          <g>
            <rect x="8" y="8" width="384" height="384" className="chart-line-outer" />
            {/* 4x4 grid lines skipping center 2x2 */}
            <line x1="104" y1="8" x2="104" y2="392" className="chart-line" />
            <line x1="200" y1="8" x2="200" y2="104" className="chart-line" />
            <line x1="200" y1="296" x2="200" y2="392" className="chart-line" />
            <line x1="296" y1="8" x2="296" y2="392" className="chart-line" />

            <line x1="8" y1="104" x2="392" y2="104" className="chart-line" />
            <line x1="8" y1="200" x2="104" y2="200" className="chart-line" />
            <line x1="296" y1="200" x2="392" y2="200" className="chart-line" />
            <line x1="8" y1="296" x2="392" y2="296" className="chart-line" />

            {/* Center panel label */}
            <text x="200" y="182" textAnchor="middle" className="chart-center-title">
              {centerLabel || title}
            </text>
            <text x="200" y="205" textAnchor="middle" className="chart-center-sub">
              {t.common.lagna}: {trSign(lagnaSignIndex, lang)}
            </text>
            {savBindus && (
              <text x="200" y="226" textAnchor="middle" className="chart-center-sub">
                {lang === 'hi' ? 'SAV योग' : 'SAV Total'}: {savBindus.reduce((a, b) => a + b, 0)}
              </text>
            )}

            {SOUTH_SIGN_CELLS.map(({ sign, col, row }) => {
              const x0 = 8 + col * 96;
              const y0 = 8 + row * 96;
              const isLagnaSign = sign === lagnaSignIndex;
              const signItems = groupedBySign[sign];
              const bindu = savBindus ? savBindus[sign] : undefined;
              return (
                <g key={sign}>
                  {isLagnaSign && (
                    <line x1={x0} y1={y0 + 22} x2={x0 + 22} y2={y0} className="chart-lagna-slash" />
                  )}
                  <text x={x0 + 90} y={y0 + 13} textAnchor="end" className="chart-sign-tag">
                    {trSignShort(sign, lang)}
                  </text>
                  {bindu !== undefined && (
                    <text x={x0 + 6} y={y0 + 90} textAnchor="start" className="chart-bindu-tag">
                      {bindu}
                    </text>
                  )}
                  {renderItemsCluster(signItems, x0 + 48, y0 + 52, 2, compact, lang)}
                </g>
              );
            })}
          </g>
        )}

        {style === 'east' && (
          <g>
            <rect x="8" y="8" width="384" height="384" className="chart-line-outer" />
            {/* 3x3 grid */}
            <line x1="136" y1="8" x2="136" y2="392" className="chart-line" />
            <line x1="264" y1="8" x2="264" y2="392" className="chart-line" />
            <line x1="8" y1="136" x2="392" y2="136" className="chart-line" />
            <line x1="8" y1="264" x2="392" y2="264" className="chart-line" />

            {/* Diagonal corner splits */}
            <line x1="8" y1="8" x2="136" y2="136" className="chart-line" />
            <line x1="264" y1="136" x2="392" y2="8" className="chart-line" />
            <line x1="8" y1="392" x2="136" y2="264" className="chart-line" />
            <line x1="264" y1="264" x2="392" y2="392" className="chart-line" />

            <text x="200" y="190" textAnchor="middle" className="chart-center-title">
              {centerLabel || title}
            </text>
            <text x="200" y="212" textAnchor="middle" className="chart-center-sub">
              {trSign(lagnaSignIndex, lang)}
            </text>

            {EAST_SIGN_CENTERS.map(({ sign, cx, cy, numPos }) => {
              const signItems = groupedBySign[sign];
              const bindu = savBindus ? savBindus[sign] : undefined;
              return (
                <g key={sign}>
                  <text x={numPos[0]} y={numPos[1]} textAnchor="middle" className="chart-rasi-num">
                    {sign + 1}
                    {bindu !== undefined ? `·${bindu}` : ''}
                  </text>
                  {renderItemsCluster(signItems, cx, cy, 2, true, lang)}
                </g>
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
};
