"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { footballMatches, getMatchName } from "../lib/matches";
import { buildMultipleAssessment, buildMultipleLegFromMatch, type MultipleLeg } from "../lib/multiples";

const inputBase =
  "w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-neutral-50 outline-none transition focus:border-emerald-300";

const marketOptions = [
  { label: "Casa", value: "Casa" },
  { label: "Empate", value: "Empate" },
  { label: "Fora", value: "Fora" },
  { label: "Over 1.5", value: "Over 1.5" },
  { label: "Ambas marcam", value: "Ambas marcam" },
  { label: "Over 2.5", value: "Over 2.5" },
];

export default function MultiplesPage() {
  const [legs, setLegs] = useState<MultipleLeg[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<string>("");
  const [selectedMarket, setSelectedMarket] = useState<string>("Casa");

  const selectedMatch = footballMatches.find((m) => m.id === selectedMatchId);

  const assessment = useMemo(() => buildMultipleAssessment(legs), [legs]);

  const updateLeg = (id: string, field: keyof MultipleLeg, value: string) => {
    setLegs((current) =>
      current.map((leg) => {
        if (leg.id !== id) {
          return leg;
        }

        if (field === "odd" || field === "estimatedProbability") {
          return { ...leg, [field]: Number(value) };
        }

        return { ...leg, [field]: value };
      })
    );
  };

  const addLeg = () => {
    if (!selectedMatch) return;

    setLegs((current) => [
      ...current,
      buildMultipleLegFromMatch(selectedMatch, selectedMarket),
    ]);

    setSelectedMatchId("");
    setSelectedMarket("Casa");
  };

  const removeLeg = (id: string) => {
    setLegs((current) => current.filter((leg) => leg.id !== id));
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#191915_0,#050505_30rem)] px-5 py-6 sm:px-8">
      <section className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <Link href="/" className="text-2xl font-semibold tracking-tight text-white">
              BetAnalyst AI
            </Link>
            <p className="mt-1 text-sm text-neutral-400">Análise de múltiplas</p>
          </div>

          <nav className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-1 text-sm font-medium">
            <Link className="rounded-md px-4 py-2 text-neutral-300 hover:bg-white/5" href="/">
              Painel
            </Link>
            <Link className="rounded-md px-4 py-2 text-neutral-300 hover:bg-white/5" href="/analise">
              Análise
            </Link>
            <Link className="rounded-md bg-emerald-400 px-4 py-2 text-neutral-950" href="/multiplas">
              Múltiplas
            </Link>
          </nav>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-lg border border-white/10 bg-neutral-950/80 p-6 shadow-2xl shadow-black/20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase text-emerald-300">Construtor</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                  Múltipla inteligente
                </h1>
              </div>
              <span className="rounded-md border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase text-amber-200">
                Gestão de risco
              </span>
            </div>

            {/* Seletor de Perna */}
            <div className="mt-6 rounded-lg border border-white/10 bg-black/40 p-4">
              <p className="mb-4 text-sm font-semibold text-white">Adicionar perna</p>
              
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-sm text-neutral-300">
                  <span className="mb-1 block">Partida</span>
                  <select
                    value={selectedMatchId}
                    onChange={(e) => setSelectedMatchId(e.target.value)}
                    className={inputBase}
                  >
                    <option value="">Selecione uma partida...</option>
                    {footballMatches.map((match) => (
                      <option key={match.id} value={match.id}>
                        {getMatchName(match)} - {match.league}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm text-neutral-300">
                  <span className="mb-1 block">Mercado</span>
                  <select
                    value={selectedMarket}
                    onChange={(e) => setSelectedMarket(e.target.value)}
                    className={inputBase}
                  >
                    {marketOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Estatísticas da Partida Selecionada */}
              {selectedMatch && (
                <div className="mt-4 rounded-lg border border-emerald-300/20 bg-emerald-300/5 p-3">
                  <p className="mb-3 text-xs font-semibold uppercase text-emerald-200">Estatísticas essenciais</p>
                  <div className="grid gap-2 text-xs sm:grid-cols-2 md:grid-cols-3">
                    <div>
                      <p className="text-neutral-400">Gols médios</p>
                      <p className="font-semibold text-white">{selectedMatch.stats.avgGoals}</p>
                    </div>
                    <div>
                      <p className="text-neutral-400">Cartões</p>
                      <p className="font-semibold text-white">{selectedMatch.stats.cards}</p>
                    </div>
                    <div>
                      <p className="text-neutral-400">Escanteios</p>
                      <p className="font-semibold text-white">{selectedMatch.stats.corners}</p>
                    </div>
                    <div>
                      <p className="text-neutral-400">Chutes ao gol</p>
                      <p className="font-semibold text-white">{selectedMatch.stats.shotsOnTarget}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={addLeg}
                disabled={!selectedMatch}
                className="mt-4 w-full min-h-11 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/20 disabled:border-neutral-600 disabled:bg-neutral-900/50 disabled:text-neutral-500"
              >
                + Adicionar perna
              </button>
            </div>

            {/* Pernas Adicionadas */}
            {legs.length > 0 && (
              <div className="mt-6 space-y-3">
                <p className="text-xs font-semibold uppercase text-neutral-400">Pernas selecionadas ({legs.length})</p>
                {legs.map((leg, index) => (
                  <div key={leg.id} className="rounded-lg border border-white/10 bg-black/40 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">Perna {index + 1}</p>
                      <button
                        onClick={() => removeLeg(leg.id)}
                        className="text-xs text-neutral-400 hover:text-red-400 transition"
                      >
                        Remover
                      </button>
                    </div>
                    <div className="mb-3 grid gap-2 text-xs">
                      <div>
                        <p className="text-neutral-400">{leg.matchLabel}</p>
                        <p className="font-semibold text-white">{leg.marketLabel}</p>
                      </div>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="text-sm text-neutral-300">
                        <span className="mb-1 block">Odd</span>
                        <input
                          type="number"
                          step="0.01"
                          value={leg.odd}
                          onChange={(event) => updateLeg(leg.id, "odd", event.target.value)}
                          className={inputBase}
                        />
                      </label>
                      <label className="text-sm text-neutral-300">
                        <span className="mb-1 block">Prob. estimada</span>
                        <input
                          type="number"
                          step="0.01"
                          value={leg.estimatedProbability}
                          onChange={(event) => updateLeg(leg.id, "estimatedProbability", event.target.value)}
                          className={inputBase}
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-white/10 bg-neutral-950/80 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">Resumo do bilhete</h2>
              {legs.length > 0 && (
                <span className="rounded-md border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase text-emerald-200">
                  {assessment.valueLabel}
                </span>
              )}
            </div>

            {legs.length === 0 ? (
              <div className="mt-6 rounded-lg border border-white/10 bg-black/40 p-8 text-center">
                <p className="text-sm text-neutral-400">
                  Adicione pernas à esquerda para começar a construir sua múltipla.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-white/10 bg-black/40 p-4">
                    <p className="text-xs text-neutral-500">Odd combinada</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{assessment.combinedOdd}</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-black/40 p-4">
                    <p className="text-xs text-neutral-500">Probabilidade estimada</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{assessment.combinedProbability}</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-black/40 p-4">
                    <p className="text-xs text-neutral-500">Probabilidade implícita</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{assessment.impliedProbability}</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-black/40 p-4">
                    <p className="text-xs text-neutral-500">Risco</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{assessment.riskLevel}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="font-semibold text-white">Observações</h3>
                  <ul className="mt-3 space-y-3 text-sm leading-6 text-neutral-300">
                    {assessment.notes.map((note) => (
                      <li key={note}>• {note}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
