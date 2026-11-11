import React, { useEffect, useRef, useState } from 'react';
import { Calendar } from 'lucide-react';
import { formatDateDmy, parseDateInputToIso } from '../astro/time';

interface DateDmyInputProps {
  value: string; // canonical YYYY-MM-DD
  onChange: (isoDate: string) => void;
  className?: string;
  ariaLabel?: string;
  compact?: boolean;
}

/**
 * Bilingual-safe DD-MM-YYYY date input with native calendar popup trigger.
 * Accepts direct DD-MM-YYYY typing (and 8-digit auto-hyphenation) while keeping internal ISO YYYY-MM-DD state.
 */
export const DateDmyInput: React.FC<DateDmyInputProps> = ({
  value,
  onChange,
  className = 'text-input mono',
  ariaLabel = 'Date (DD-MM-YYYY)',
  compact = false,
}) => {
  const [text, setText] = useState(() => formatDateDmy(value));
  const pickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setText(formatDateDmy(value));
  }, [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow digits, hyphens, and slashes; auto-format 8 continuous digits as DD-MM-YYYY
    const digitsOnly = raw.replace(/\D/g, '');
    let nextDisplay = raw;
    if (!raw.includes('-') && !raw.includes('/') && digitsOnly.length <= 8) {
      if (digitsOnly.length > 4) {
        nextDisplay = `${digitsOnly.slice(0, 2)}-${digitsOnly.slice(2, 4)}-${digitsOnly.slice(4)}`;
      } else if (digitsOnly.length > 2) {
        nextDisplay = `${digitsOnly.slice(0, 2)}-${digitsOnly.slice(2)}`;
      } else {
        nextDisplay = digitsOnly;
      }
    }
    setText(nextDisplay);

    const parsed = parseDateInputToIso(nextDisplay);
    if (parsed) {
      onChange(parsed);
    }
  };

  const handleBlur = () => {
    const parsed = parseDateInputToIso(text);
    if (parsed) {
      setText(formatDateDmy(parsed));
      if (parsed !== value) onChange(parsed);
    } else {
      setText(formatDateDmy(value));
    }
  };

  const handleOpenPicker = () => {
    const el = pickerRef.current;
    if (!el) return;
    if (typeof el.showPicker === 'function') {
      try {
        el.showPicker();
        return;
      } catch {
        // Fallback below if browser blocks showPicker
      }
    }
    el.focus();
    el.click();
  };

  return (
    <div className={`date-dmy-box ${compact ? 'is-compact' : ''}`}>
      <input
        type="text"
        inputMode="numeric"
        aria-label={ariaLabel}
        className={`${className} date-dmy-text`}
        value={text}
        onChange={handleTextChange}
        onBlur={handleBlur}
        placeholder="DD-MM-YYYY"
        maxLength={10}
      />
      <button
        type="button"
        className="date-dmy-cal-btn"
        onClick={handleOpenPicker}
        title="Pick Date"
        aria-label="Open Calendar Picker"
      >
        <Calendar size={compact ? 13 : 14} />
      </button>
      <input
        ref={pickerRef}
        type="date"
        tabIndex={-1}
        aria-hidden="true"
        className="date-dmy-native-hidden"
        value={/^\d{4}-\d{2}-\d{2}$/.test(value) ? value : ''}
        onChange={(e) => {
          if (e.target.value) {
            onChange(e.target.value);
            setText(formatDateDmy(e.target.value));
          }
        }}
      />
    </div>
  );
};
