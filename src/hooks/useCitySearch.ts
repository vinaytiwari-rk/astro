import { useEffect, useState } from 'react';
import {
  mergeCityResults,
  preloadExpandedAtlas,
  searchCities,
  searchCitiesExtended,
  searchPlacesOnline,
  type CityEntry,
} from '../data/cities';
import type { AppLanguage } from '../i18n/translations';

interface UseCitySearchOptions {
  query: string;
  lang: AppLanguage;
  active: boolean;
  minChars?: number;
  limit?: number;
}

export function useCitySearch({
  query,
  lang,
  active,
  minChars = 3,
  limit = 30,
}: UseCitySearchOptions): {
  results: CityEntry[];
  isSearchingOnline: boolean;
  trimmedQuery: string;
} {
  const trimmedQuery = query.trim();
  const [results, setResults] = useState<CityEntry[]>(() =>
    trimmedQuery.length >= minChars ? searchCities(trimmedQuery, limit) : []
  );
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);

  useEffect(() => {
    if (active) {
      void preloadExpandedAtlas();
    }
  }, [active]);

  useEffect(() => {
    if (!active || trimmedQuery.length < minChars) {
      setResults([]);
      setIsSearchingOnline(false);
      return;
    }

    let cancelled = false;
    const syncMatches = searchCities(trimmedQuery, limit);
    setResults(syncMatches);

    let extendedMatches = syncMatches;
    void searchCitiesExtended(trimmedQuery, limit).then((ext) => {
      if (cancelled) return;
      extendedMatches = ext;
      setResults((prev) => {
        const prevOnline = prev.filter((item) => item.source === 'online');
        return mergeCityResults(ext, prevOnline, limit);
      });
    });

    if (trimmedQuery.length < 3) {
      setIsSearchingOnline(false);
      return () => {
        cancelled = true;
      };
    }

    const controller = new AbortController();
    setIsSearchingOnline(true);

    const timer = window.setTimeout(() => {
      void searchPlacesOnline(trimmedQuery, lang, 16, controller.signal)
        .then((online) => {
          if (cancelled) return;
          setResults(mergeCityResults(extendedMatches, online, limit));
        })
        .catch(() => {
          // Graceful offline fallback keeps local extended results
        })
        .finally(() => {
          if (!cancelled) setIsSearchingOnline(false);
        });
    }, 220);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [active, trimmedQuery, lang, minChars, limit]);

  return { results, isSearchingOnline, trimmedQuery };
}
