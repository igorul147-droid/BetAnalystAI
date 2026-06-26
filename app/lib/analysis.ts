import { type FootballMatch, getMatchName } from "./matches";

export type MatchAnalysis = {
  matchName: string;
  league?: string;
  venue?: string;
  dataSource: "cached" | "api" | "manual";
  confidence: number;
  risk: "Baixo" | "Moderado" | "Alto";
  suggestedMarket: string;
  estimatedProbability: number;
  fairOdd: number;
  attentionPoints: string[];
  metrics: {
    label: string;
    value: string;
    tone: "good" | "warn" | "bad";
  }[];
};

const normalizeMatchName = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) =>
      word.toLowerCase() === "x" ? "x" : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");

export function buildMockAnalysis(matchName: string, match?: FootballMatch): MatchAnalysis {
  const normalizedMatch = match ? getMatchName(match) : normalizeMatchName(matchName || "Brasil x Argentina");
  const seed = normalizedMatch.length;
  const statsBoost = match ? Math.round((match.stats.homeForm + match.stats.awayForm) / 2) : 0;
  const homeProbability = match ? Math.min(84, Math.max(22, Math.round((1 / Math.max(match.odds.home, 1.01)) * 100))) : 58 + (seed % 11);
  const estimatedProbability = match
    ? Math.min(84, Math.max(22, Math.round(homeProbability + match.stats.avgGoals * 1.8 + match.stats.shotsOnTarget * 0.3)))
    : 58 + (seed % 11);
  const fairOdd = Number((100 / estimatedProbability).toFixed(2));
  const confidence = Math.min(92, 66 + (seed % 10) + Math.round(statsBoost / 3) + (match?.source === "api" ? 8 : 0));
  const isHigherRisk = match ? match.stats.cards > 5 || match.stats.avgGoals > 2.9 : seed % 3 === 0;
  const suggestedMarket = match && match.stats.avgGoals >= 2.7 ? "Mais de 1.5 gols" : "Ambas marcam";

  return {
    matchName: normalizedMatch,
    league: match?.league,
    venue: match?.venue,
    dataSource: match ? match.source : "manual",
    confidence,
    risk: isHigherRisk ? "Moderado" : "Baixo",
    suggestedMarket,
    estimatedProbability,
    fairOdd,
    attentionPoints: [
      "Validar escalações oficiais antes da entrada.",
      "Comparar a odd atual com a odd justa calculada.",
      "Evitar entrada se houver queda brusca de preço no mercado.",
    ],
    metrics: [
      { label: "Forma recente", value: match ? `${((match.stats.homeForm + match.stats.awayForm) / 2).toFixed(1)}/10` : "7.4/10", tone: "good" },
      { label: "Volatilidade", value: isHigherRisk ? "Média" : "Baixa", tone: "warn" },
      { label: "Escanteios médios", value: match ? match.stats.corners.toFixed(1) : "9.4", tone: "good" },
      { label: "Risco de gol tardio", value: isHigherRisk ? "Atenção" : "Controlado", tone: isHigherRisk ? "warn" : "good" },
    ],
  };
}
