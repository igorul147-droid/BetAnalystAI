"use client";

import Link from "next/link";
import { useState } from "react";
import { footballMatches, getMatchName, searchMatches } from "../lib/matches";

type SelectedMatch = {
  id: string;
  name: string;
};

const inputBase =
  "w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-neutral-50 outline-none transition focus:border-emerald-300";

export default function MultiplesPage() {
  const [selectedMatches, setSelectedMatches] = useState<SelectedMatch[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState(footballMatches);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchMatches(query);
      setSearchResults(results);
    } else {
      setSearchResults(footballMatches);
    }
  };

  const addMatch = (match: typeof footballMatches[0]) => {
    if (!selectedMatches.find((m) => m.id === match.id)) {
      setSelectedMatches([...selectedMatches, { id: match.id, name: getMatchName(match) }]);
    }
    setSearchQuery("");
    setSearchResults(footballMatches);
  };

  const removeMatch = (id: string) => {
    setSelectedMatches((current) => current.filter((m) => m.id !== id));
  };

  const getSelectedMatchDetails = (id: string) => {
    return footballMatches.find((m) => m.id === id);
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

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg border border-white/10 bg-neutral-950/80 p-6 shadow-2xl shadow-black/20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase text-emerald-300">Análise</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                  Comparador de jogos
                </h1>
              </div>
              <span className="rounded-md border border-blue-300/30 bg-blue-300/10 px-3 py-1 text-xs font-semibold uppercase text-blue-200">
                Estatísticas essenciais
              </span>
            </div>

            {/* Buscador de Partidas */}
            <div className="mt-6 rounded-lg border border-white/10 bg-black/40 p-4">
              <label className="text-sm text-neutral-300">
                <span className="mb-2 block font-semibold">Buscar partida</span>
                <input
                  type="text"
                  placeholder="Ex: Flamengo, Liverpool, Barcelona..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className={inputBase}
                />
              </label>

              {/* Resultados da Busca */}
              {searchQuery && searchResults.length > 0 && (
                <div className="mt-3 max-h-48 overflow-y-auto space-y-2 rounded-lg border border-emerald-300/20 bg-emerald-300/5 p-3">
                  {searchResults.map((match) => (
                    <button
                      key={match.id}
                      onClick={() => addMatch(match)}
                      className="w-full text-left rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-neutral-300 transition hover:bg-emerald-400/20 hover:border-emerald-400/50"
                    >
                      <p className="font-semibold text-white">{getMatchName(match)}</p>
                      <p className="text-xs text-neutral-500">{match.league} • {match.country}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Partidas Selecionadas */}
            {selectedMatches.length > 0 && (
              <div className="mt-6 space-y-3">
                <p className="text-xs font-semibold uppercase text-neutral-400">Partidas em análise ({selectedMatches.length})</p>
                {selectedMatches.map((match, index) => {
                  const details = getSelectedMatchDetails(match.id);
                  if (!details) return null;

                  return (
                    <div key={match.id} className="rounded-lg border border-white/10 bg-black/40 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white">{match.name}</p>
                          <p className="text-xs text-neutral-500">{details.league} • {details.country}</p>
                        </div>
                        <button
                          onClick={() => removeMatch(match.id)}
                          className="text-xs text-neutral-400 hover:text-red-400 transition"
                        >
                          Remover
                        </button>
                      </div>

                      <div className="grid gap-3 grid-cols-2 text-xs">
                        <div className="rounded-lg border border-white/5 bg-black/50 p-3">
                          <p className="text-neutral-500">Gols médios</p>
                          <p className="mt-1 text-lg font-semibold text-white">{details.stats.avgGoals}</p>
                        </div>
                        <div className="rounded-lg border border-white/5 bg-black/50 p-3">
                          <p className="text-neutral-500">Cartões</p>
                          <p className="mt-1 text-lg font-semibold text-white">{details.stats.cards}</p>
                        </div>
                        <div className="rounded-lg border border-white/5 bg-black/50 p-3">
                          <p className="text-neutral-500">Escanteios</p>
                          <p className="mt-1 text-lg font-semibold text-white">{details.stats.corners}</p>
                        </div>
                        <div className="rounded-lg border border-white/5 bg-black/50 p-3">
                          <p className="text-neutral-500">Chutes ao gol</p>
                          <p className="mt-1 text-lg font-semibold text-white">{details.stats.shotsOnTarget}</p>
                        </div>
                      </div>

                      {/* Detalhes do Jogo */}
                      <div className="mt-3 pt-3 border-t border-white/10 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-neutral-500">Horário</p>
                            <p className="font-semibold text-white">{new Date(details.startsAt).toLocaleString("pt-BR")}</p>
                          </div>
                          <div>
                            <p className="text-neutral-500">Local</p>
                            <p className="font-semibold text-white">{details.venue}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-white/10 bg-neutral-950/80 p-6">
            <h2 className="text-xl font-semibold text-white">Resumo da análise</h2>

            {selectedMatches.length === 0 ? (
              <div className="mt-6 rounded-lg border border-white/10 bg-black/40 p-8 text-center">
                <p className="text-sm text-neutral-400">
                  Busque e adicione partidas à esquerda para ver uma análise comparativa das estatísticas.
                </p>
              </div>
            ) : (
              <>
                {/* Estatísticas Agregadas */}
                <div className="mt-6 rounded-lg border border-blue-300/20 bg-blue-300/5 p-4">
                  <p className="mb-4 text-xs font-semibold uppercase text-blue-200">Médias das partidas selecionadas</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-white/10 bg-black/40 p-3">
                      <p className="text-xs text-neutral-500">Gols médios</p>
                      <p className="mt-2 text-2xl font-semibold text-white">
                        {(
                          selectedMatches.reduce((acc, m) => {
                            const details = getSelectedMatchDetails(m.id);
                            return acc + (details?.stats.avgGoals || 0);
                          }, 0) / selectedMatches.length
                        ).toFixed(1)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-black/40 p-3">
                      <p className="text-xs text-neutral-500">Cartões médios</p>
                      <p className="mt-2 text-2xl font-semibold text-white">
                        {(
                          selectedMatches.reduce((acc, m) => {
                            const details = getSelectedMatchDetails(m.id);
                            return acc + (details?.stats.cards || 0);
                          }, 0) / selectedMatches.length
                        ).toFixed(1)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-black/40 p-3">
                      <p className="text-xs text-neutral-500">Escanteios médios</p>
                      <p className="mt-2 text-2xl font-semibold text-white">
                        {(
                          selectedMatches.reduce((acc, m) => {
                            const details = getSelectedMatchDetails(m.id);
                            return acc + (details?.stats.corners || 0);
                          }, 0) / selectedMatches.length
                        ).toFixed(1)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-black/40 p-3">
                      <p className="text-xs text-neutral-500">Chutes ao gol médios</p>
                      <p className="mt-2 text-2xl font-semibold text-white">
                        {(
                          selectedMatches.reduce((acc, m) => {
                            const details = getSelectedMatchDetails(m.id);
                            return acc + (details?.stats.shotsOnTarget || 0);
                          }, 0) / selectedMatches.length
                        ).toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Insights */}
                <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="font-semibold text-white">Insights das partidas</h3>
                  <ul className="mt-3 space-y-3 text-sm leading-6 text-neutral-300">
                    <li>
                      • <span className="font-semibold text-emerald-200">
                        {selectedMatches.length} partida{selectedMatches.length > 1 ? "s" : ""} em análise
                      </span>
                    </li>
                    <li>
                      • Gols: foco em jogos com média de{" "}
                      <span className="font-semibold text-white">
                        {(
                          selectedMatches.reduce((acc, m) => {
                            const details = getSelectedMatchDetails(m.id);
                            return acc + (details?.stats.avgGoals || 0);
                          }, 0) / selectedMatches.length
                        ).toFixed(1)}
                      </span>{" "}
                      gols
                    </li>
                    <li>
                      • Disciplina: expectativa de{" "}
                      <span className="font-semibold text-white">
                        {(
                          selectedMatches.reduce((acc, m) => {
                            const details = getSelectedMatchDetails(m.id);
                            return acc + (details?.stats.cards || 0);
                          }, 0) / selectedMatches.length
                        ).toFixed(1)}
                      </span>{" "}
                      cartões por jogo
                    </li>
                    <li>
                      • Controle: escanteios e chutes refletem intensidade tática dos confrontos
                    </li>
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
