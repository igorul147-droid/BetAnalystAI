"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { addSearchToHistory, addToCache, getCachedMatches, getSearchHistory } from "../lib/cache";
import { type FootballMatch, getMatchName, searchMatches } from "../lib/matches";
import { buildMultipleAssessment, buildMultipleLegFromMatch, type MultipleLeg } from "../lib/multiples";

type MultipleMarket = "Casa" | "Over 1.5";
type SearchHistoryEntry = {
  query: string;
  matches: FootballMatch[];
  timestamp: number;
};

export default function MultiplasPage() {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<FootballMatch[]>([]);
  const [legs, setLegs] = useState<MultipleLeg[]>([]);
  const [market, setMarket] = useState<MultipleMarket>("Casa");
  const [history, setHistory] = useState<SearchHistoryEntry[]>([]);
  const [message, setMessage] = useState("Busque uma partida para montar sua múltipla.");

  useEffect(() => {
    const cachedMatches = getCachedMatches();
    if (cachedMatches.length) {
      setMatches(cachedMatches);
    }

    setHistory(getSearchHistory());
  }, []);

  const assessment = useMemo(() => buildMultipleAssessment(legs), [legs]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextQuery = query.trim();
    if (!nextQuery) {
      setMessage("Digite o nome da partida para buscar estatísticas.");
      return;
    }

    const nextMatches = searchMatches(nextQuery);
    setMatches(nextMatches);
    addToCache(nextMatches);
    addSearchToHistory(nextQuery, nextMatches);
    setHistory(getSearchHistory());

    if (nextMatches.length) {
      setMessage(`Encontramos ${nextMatches.length} partidas para o termo buscado.`);
    } else {
      setMessage("Nenhuma partida encontrada. Tente um nome mais amplo.");
    }
  };

  const addLeg = (match: FootballMatch) => {
    const nextLeg = buildMultipleLegFromMatch(match, market);
    setLegs((current) => [...current, nextLeg]);
    addToCache([match]);
    addSearchToHistory(query || getMatchName(match), [match]);
    setHistory(getSearchHistory());
    setMessage(`${getMatchName(match)} adicionada à sua múltipla.`);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#0f241c_0,#050505_34rem)] px-5 py-6 text-white sm:px-8">
      <section className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Múltiplas</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Monte sua análise por pernas</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-400">
            Busque uma partida, adicione uma perna e acompanhe o risco agregado. O aplicativo salva o histórico localmente para reduzir requisições repetidas.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-white/10 bg-neutral-950/70 p-5">
            <form onSubmit={handleSearch} className="flex flex-col gap-3">
              <label className="text-sm font-medium text-neutral-300" htmlFor="match-search">
                Buscar partida
              </label>
              <input
                id="match-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Digite a partida que deseja analisar"
                className="rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
              />
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-sm text-neutral-400">Mercado</label>
                <select
                  value={market}
                  onChange={(event) => setMarket(event.target.value as MultipleMarket)}
                  className="rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm outline-none"
                >
                  <option value="Casa">Casa</option>
                  <option value="Over 1.5">Over 1.5</option>
                </select>
                <button className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-300">
                  Buscar
                </button>
              </div>
            </form>

            <p className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              {message}
            </p>

            <div className="mt-5 grid gap-3">
              {matches.length === 0 && (
                <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] p-4 text-sm text-neutral-400">
                  Use a busca para encontrar um jogo e adicionar uma perna à múltipla.
                </div>
              )}

              {matches.map((match) => (
                <button
                  key={match.id}
                  onClick={() => addLeg(match)}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition hover:border-emerald-400/60 hover:bg-white/[0.05]"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{getMatchName(match)}</p>
                    <p className="mt-1 text-xs text-neutral-400">{match.league} · {match.country}</p>
                  </div>
                  <span className="rounded-lg bg-black/40 px-3 py-1 text-xs text-neutral-200">
                    {market} · {match.odds.home.toFixed(2)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-neutral-950/70 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Múltipla atual</h2>
                <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs uppercase text-amber-200">
                  {legs.length} pernas
                </span>
              </div>

              {legs.length === 0 ? (
                <div className="mt-4 rounded-xl border border-dashed border-white/10 bg-white/[0.03] p-4 text-sm text-neutral-400">
                  Ainda não há pernas adicionadas. Escolha uma partida e adicione uma perna.
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  {legs.map((leg) => (
                    <div key={leg.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-neutral-300">
                      <p className="font-medium text-white">{leg.matchLabel}</p>
                      <div className="mt-1 flex items-center justify-between text-xs text-neutral-400">
                        <span>{leg.marketLabel}</span>
                        <span>Odd {leg.odd.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <p className="text-sm font-semibold text-emerald-200">Resumo</p>
                <p className="mt-2 text-sm text-neutral-200">
                  Odd combinada: {assessment.combinedOdd.toFixed(2)} · Probabilidade agregada: {assessment.combinedProbability.toFixed(2)}
                </p>
                <p className="mt-2 text-xs text-emerald-100">{assessment.valueLabel} · {assessment.riskLevel}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-neutral-950/70 p-5">
              <h2 className="text-lg font-semibold text-white">Histórico local</h2>
              {history.length === 0 ? (
                <p className="mt-3 text-sm text-neutral-400">As buscas recentes aparecerão aqui para agilizar novas análises.</p>
              ) : (
                <div className="mt-4 space-y-2">
                  {history.map((entry) => (
                    <div key={`${entry.query}-${entry.timestamp}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-neutral-300">
                      <p className="font-medium text-white">{entry.query}</p>
                      <p className="mt-1 text-xs text-neutral-400">{entry.matches.length} partida(s) salva(s) localmente</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}