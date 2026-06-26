import test from "node:test";
import assert from "node:assert/strict";
import { buildMultipleAssessment, buildMultipleLegFromMatch } from "../app/lib/multiples.ts";
import { footballMatches, getProviderStatusMessage } from "../app/lib/matches.ts";
import { buildMockAnalysis } from "../app/lib/analysis.ts";

test("buildMultipleAssessment detects value when the combined probability beats the implied probability", () => {
  const result = buildMultipleAssessment([
    { id: "leg-1", matchLabel: "Flamengo x Palmeiras", marketLabel: "Casa", odd: 1.85, estimatedProbability: 0.63 },
    { id: "leg-2", matchLabel: "Real Madrid x Barcelona", marketLabel: "Over 1.5", odd: 1.7, estimatedProbability: 0.6 },
  ]);

  assert.equal(result.combinedOdd, 3.145);
  assert.equal(result.valueLabel, "Valor claro");
  assert.equal(result.riskLevel, "Moderado");
  assert.ok(result.notes.some((note) => note.includes("Entrada com valor")));
});

test("buildMultipleLegFromMatch creates a leg from a real fixture", () => {
  const leg = buildMultipleLegFromMatch(footballMatches[0], "Casa");

  assert.equal(leg.matchLabel, "Flamengo x Palmeiras");
  assert.equal(leg.odd, 2.18);
  assert.equal(leg.estimatedProbability, 0.46);
});

test("buildMockAnalysis uses the match odds to derive a probability", () => {
  const analysis = buildMockAnalysis("", footballMatches[0]);

  assert.equal(analysis.dataSource, "cached");
  assert.equal(analysis.estimatedProbability, 53);
  assert.equal(analysis.fairOdd, 1.89);
});

test("getProviderStatusMessage explains invalid API tokens clearly", () => {
  const message = getProviderStatusMessage("Your API token is invalid.");

  assert.match(message, /chave/i);
});
