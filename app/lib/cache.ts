import { FootballMatch } from "./matches";

const CACHE_KEY = "bet_analyst_matches_cache";
const CACHE_EXPIRY_KEY = "bet_analyst_cache_expiry";
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour in milliseconds

type CachedData = {
  matches: FootballMatch[];
  timestamp: number;
};

type SearchHistoryEntry = {
  query: string;
  matches: FootballMatch[];
  timestamp: number;
};

const SEARCH_HISTORY_KEY = "bet_analyst_search_history";

export function getCachedMatches(): FootballMatch[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(CACHE_KEY);
    const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);

    if (!stored || !expiry) {
      return [];
    }

    const expiryTime = Number.parseInt(expiry, 10);
    if (Number.isNaN(expiryTime) || Date.now() > expiryTime) {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_EXPIRY_KEY);
      return [];
    }

    const data: CachedData = JSON.parse(stored);
    return Array.isArray(data.matches) ? data.matches : [];
  } catch (error) {
    console.error("Error reading cache:", error);
    return [];
  }
}

export function setCachedMatches(matches: FootballMatch[]): void {
  if (typeof window === "undefined") return;

  try {
    const data: CachedData = {
      matches,
      timestamp: Date.now(),
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(CACHE_EXPIRY_KEY, String(Date.now() + CACHE_DURATION));
  } catch (error) {
    console.error("Error writing cache:", error);
  }
}

export function addToCache(newMatches: FootballMatch[]): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getCachedMatches();
    const merged = [...existing];

    for (const match of newMatches) {
      if (!merged.find((m) => m.id === match.id)) {
        merged.push(match);
      }
    }

    setCachedMatches(merged);
  } catch (error) {
    console.error("Error adding to cache:", error);
  }
}

export function clearCache(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_EXPIRY_KEY);
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
}

export function isCacheValid(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);
    if (!expiry) return false;

    const expiryTime = Number.parseInt(expiry, 10);
    return !Number.isNaN(expiryTime) && Date.now() <= expiryTime;
  } catch (error) {
    return false;
  }
}

export function getSearchHistory(): SearchHistoryEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!stored) return [];

    const data: SearchHistoryEntry[] = JSON.parse(stored);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error reading search history:", error);
    return [];
  }
}

export function addSearchToHistory(query: string, matches: FootballMatch[]): void {
  if (typeof window === "undefined") return;

  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return;

  try {
    const history = getSearchHistory();
    const nextHistory = [
      { query: normalizedQuery, matches, timestamp: Date.now() },
      ...history.filter((entry) => entry.query !== normalizedQuery),
    ].slice(0, 8);

    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(nextHistory));
  } catch (error) {
    console.error("Error writing search history:", error);
  }
}
