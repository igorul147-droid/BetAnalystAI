export type FootballMatch = {
  id: string;
  league: string;
  country: string;
  startsAt: string;
  homeTeam: string;
  awayTeam: string;
  venue: string;
  source: "demo" | "api";
  odds: {
    home: number;
    draw: number;
    away: number;
    over15: number;
    bothTeamsScore: number;
  };
  stats: {
    homeForm: number;
    awayForm: number;
    avgGoals: number;
    shotsOnTarget: number;
    corners: number;
    cards: number;
  };
};

const demoMatches: FootballMatch[] = [
  {
    id: "flamengo-palmeiras",
    league: "Brasileirão Série A",
    country: "Brasil",
    startsAt: "2026-06-18T21:30:00-03:00",
    homeTeam: "Flamengo",
    awayTeam: "Palmeiras",
    venue: "Maracanã",
    source: "demo",
    odds: { home: 2.18, draw: 3.12, away: 3.35, over15: 1.36, bothTeamsScore: 1.82 },
    stats: { homeForm: 7.6, awayForm: 7.1, avgGoals: 2.4, shotsOnTarget: 9.1, corners: 10.2, cards: 4.8 },
  },
  {
    id: "real-madrid-barcelona",
    league: "LaLiga",
    country: "Espanha",
    startsAt: "2026-06-19T16:00:00-03:00",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    venue: "Santiago Bernabéu",
    source: "demo",
    odds: { home: 2.04, draw: 3.55, away: 3.28, over15: 1.25, bothTeamsScore: 1.58 },
    stats: { homeForm: 8.2, awayForm: 7.8, avgGoals: 3.1, shotsOnTarget: 11.4, corners: 9.6, cards: 5.2 },
  },
  {
    id: "manchester-city-liverpool",
    league: "Premier League",
    country: "Inglaterra",
    startsAt: "2026-06-20T13:30:00-03:00",
    homeTeam: "Manchester City",
    awayTeam: "Liverpool",
    venue: "Etihad Stadium",
    source: "demo",
    odds: { home: 1.92, draw: 3.7, away: 3.65, over15: 1.28, bothTeamsScore: 1.61 },
    stats: { homeForm: 8.4, awayForm: 7.7, avgGoals: 3.0, shotsOnTarget: 12.1, corners: 10.8, cards: 3.9 },
  },
  {
    id: "suica-bosnia",
    league: "Eliminatórias UEFA",
    country: "Europa",
    startsAt: "2026-06-21T15:45:00-03:00",
    homeTeam: "Suíça",
    awayTeam: "Bósnia",
    venue: "St. Jakob-Park",
    source: "demo",
    odds: { home: 1.74, draw: 3.5, away: 4.8, over15: 1.42, bothTeamsScore: 1.96 },
    stats: { homeForm: 7.3, awayForm: 6.2, avgGoals: 2.1, shotsOnTarget: 7.8, corners: 8.9, cards: 4.4 },
  },
];

export const footballMatches: FootballMatch[] = demoMatches;

export const getMatchName = (match: FootballMatch) =>
  `${match.homeTeam} x ${match.awayTeam}`;

export const getFeaturedMatches = () => footballMatches.slice(0, 4);

export const getMatchById = (id: string | undefined) =>
  footballMatches.find((match) => match.id === id);

export const findMatchByName = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  const normalizedValue = normalizeText(value);
  return footballMatches.find((match) =>
    normalizeText(getMatchName(match)).includes(normalizedValue)
  );
};

export const searchMatches = (query: string | undefined) => {
  if (!query) {
    return footballMatches;
  }

  const normalizedQuery = normalizeText(query);
  return footballMatches.filter((match) =>
    [
      match.homeTeam,
      match.awayTeam,
      match.league,
      match.country,
      getMatchName(match),
    ].some((field) => normalizeText(field).includes(normalizedQuery))
  );
};

export function getProviderStatusMessage(message?: string) {
  if (!message) {
    return "Configure uma chave válida para habilitar dados reais.";
  }

  if (message.toLowerCase().includes("token") || message.toLowerCase().includes("auth")) {
    return "A chave do provedor está inválida ou bloqueada. Verifique o token e tente novamente.";
  }

  return message;
}

export async function fetchMatchesFromProvider(query?: string): Promise<FootballMatch[]> {
  const apiKey = process.env.API_SPORTS_KEY?.trim() || process.env.API_FOOTBALL_KEY?.trim() || process.env.FOOTBALL_DATA_API_KEY?.trim();

  if (!apiKey) {
    return [];
  }

  try {
    const response = await fetch("https://v3.football.api-sports.io/fixtures?live=all", {
      headers: {
        "x-apisports-key": apiKey,
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `API-Sports error: ${response.status}`);
    }

    const payload = (await response.json()) as {
      response?: Array<{
        fixture?: { id?: number; date?: string; venue?: { name?: string } };
        league?: { name?: string; country?: string };
        teams?: { home?: { name?: string }; away?: { name?: string } };
      }>;
    };

    const matches = (payload.response ?? []).map((match, index) => ({
      id: `api-${match.fixture?.id ?? index}`,
      league: match.league?.name ?? "Competição",
      country: match.league?.country ?? "Internacional",
      startsAt: match.fixture?.date ?? new Date().toISOString(),
      homeTeam: match.teams?.home?.name ?? "Casa",
      awayTeam: match.teams?.away?.name ?? "Fora",
      venue: match.fixture?.venue?.name ?? "Estádio",
      source: "api" as const,
      odds: {
        home: 2.0,
        draw: 3.2,
        away: 3.4,
        over15: 1.35,
        bothTeamsScore: 1.7,
      },
      stats: {
        homeForm: 7.2,
        awayForm: 7.0,
        avgGoals: 2.5,
        shotsOnTarget: 8.5,
        corners: 9.5,
        cards: 4.5,
      },
    }));

    if (!query) {
      return matches;
    }

    const normalizedQuery = normalizeText(query);
    return matches.filter((match) =>
      [match.homeTeam, match.awayTeam, match.league, match.country, getMatchName(match)].some((field) =>
        normalizeText(field).includes(normalizedQuery)
      )
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Provider fetch failed:", message);
    return [];
  }
}

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
