import { type FootballMatch, getMatchName } from "./matches";

export type MultipleLeg = {
  id: string;
  matchLabel: string;
  marketLabel: string;
  odd: number;
  estimatedProbability: number;
};

export type MultipleAssessment = {
  combinedOdd: number;
  combinedProbability: number;
  impliedProbability: number;
  valueLabel: "Valor claro" | "Risco alto" | "Ajuste necessário";
  riskLevel: "Baixo" | "Moderado" | "Alto";
  notes: string[];
};

export function buildMultipleLegFromMatch(match: FootballMatch, marketLabel: string): MultipleLeg {
  const marketOdd = marketLabel.toLowerCase() === "over 1.5" ? match.odds.over15 : match.odds.home;
  const probability = marketLabel.toLowerCase() === "over 1.5"
    ? Number((match.stats.avgGoals / 4).toFixed(2))
    : Number((1 / match.odds.home).toFixed(2));

  return {
    id: match.id,
    matchLabel: getMatchName(match),
    marketLabel,
    odd: Number(marketOdd.toFixed(2)),
    estimatedProbability: probability,
  };
}

export function buildMultipleAssessment(legs: MultipleLeg[]): MultipleAssessment {
  const combinedOdd = legs.reduce((total, leg) => total * leg.odd, 1);
  const combinedProbability = legs.reduce((total, leg) => total * leg.estimatedProbability, 1);
  const impliedProbability = 1 / combinedOdd;
  const valueGap = combinedProbability - impliedProbability;

  const valueLabel =
    valueGap > 0.05 ? "Valor claro" : valueGap > 0.01 ? "Ajuste necessário" : "Risco alto";

  const riskLevel = legs.length >= 3 || valueGap <= 0.02 ? "Alto" : legs.length === 2 ? "Moderado" : "Baixo";

  const notes = [
    valueGap > 0.05
      ? "Entrada com valor: a probabilidade agregada supera a chance implícita da odd combinada."
      : "Entrada sem margem clara: revisar odds e selecionar menos pernas.",
    legs.length >= 3
      ? "Bilhete longo: aumentar o critério de seleção para reduzir exposição."
      : "Bilhete enxuto: a exposição tende a ser mais controlada.",
    `Implied probability ${impliedProbability.toFixed(2)} vs combined estimate ${combinedProbability.toFixed(2)}.`,
  ];

  return {
    combinedOdd: Number(combinedOdd.toFixed(3)),
    combinedProbability: Number(combinedProbability.toFixed(3)),
    impliedProbability: Number(impliedProbability.toFixed(3)),
    valueLabel,
    riskLevel,
    notes,
  };
}
