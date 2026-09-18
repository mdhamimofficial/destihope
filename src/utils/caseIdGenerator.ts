/**
 * Generates sequential Case IDs in the format:
 * FIND-{COUNTRY_CODE}-{SERIAL}
 * Examples: FIND-BD-8903, FIND-IND-0001, FIND-PK-0001
 *
 * Requirements:
 * - Country code like BD, IND, PK, etc.
 * - Resets every year starting January 1st so all new uploads get a fresh serial sequence for that year.
 */

interface CaseYearlyTracker {
  year: number;
  serials: Record<string, number>;
}

const STORAGE_KEY = 'destifind_case_yearly_tracker';

export const SUPPORTED_COUNTRIES = [
  { code: 'BD', name: 'বাংলাদেশ (BD)', flag: '🇧🇩' },
  { code: 'IND', name: 'ভারত (IND)', flag: '🇮🇳' },
  { code: 'PK', name: 'পাকিস্তান (PK)', flag: '🇵🇰' },
  { code: 'SA', name: 'সৌদি আরব (SA)', flag: '🇸🇦' },
  { code: 'AE', name: 'সংযুক্ত আরব আমিরাত (AE)', flag: '🇦🇪' },
  { code: 'MY', name: 'মালয়েশিয়া (MY)', flag: '🇲🇾' },
  { code: 'US', name: 'যুক্তরাষ্ট্র (US)', flag: '🇺🇸' },
  { code: 'UK', name: 'যুক্তরাজ্য (UK)', flag: '🇬🇧' },
];

function getTracker(): CaseYearlyTracker {
  const currentYear = new Date().getFullYear();
  let tracker: CaseYearlyTracker = {
    year: currentYear,
    serials: {},
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.year === 'number') {
        tracker = parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read case tracker', err);
  }

  // Every year on January 1st, reset the serial sequence
  if (tracker.year !== currentYear) {
    tracker = {
      year: currentYear,
      serials: {},
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tracker));
    } catch {
      // ignore
    }
  }

  return tracker;
}

export function peekNextCaseId(countryCode: string = 'BD'): string {
  const code = (countryCode || 'BD').trim().toUpperCase().replace(/[^A-Z]/g, '') || 'BD';
  const tracker = getTracker();
  const currentYear = new Date().getFullYear();

  let currentSeq = tracker.serials[code];
  if (currentSeq === undefined) {
    // For BD in 2026, start after initial mock data 8902
    if (code === 'BD' && currentYear === 2026) {
      currentSeq = 8902;
    } else {
      currentSeq = 0;
    }
  }

  const nextSeq = currentSeq + 1;
  const paddedSerial = String(nextSeq).padStart(4, '0');
  return `FIND-${code}-${paddedSerial}`;
}

export function getNextCaseId(countryCode: string = 'BD'): string {
  const code = (countryCode || 'BD').trim().toUpperCase().replace(/[^A-Z]/g, '') || 'BD';
  const tracker = getTracker();
  const currentYear = new Date().getFullYear();

  let currentSeq = tracker.serials[code];
  if (currentSeq === undefined) {
    if (code === 'BD' && currentYear === 2026) {
      currentSeq = 8902;
    } else {
      currentSeq = 0;
    }
  }

  const nextSeq = currentSeq + 1;
  tracker.serials[code] = nextSeq;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tracker));
  } catch (err) {
    console.error('Failed to save case tracker', err);
  }

  const paddedSerial = String(nextSeq).padStart(4, '0');
  return `FIND-${code}-${paddedSerial}`;
}
