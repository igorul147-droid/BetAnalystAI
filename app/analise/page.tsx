import Link from "next/link";
import { buildMockAnalysis } from "../lib/analysis";
import { fetchMatchesFromProvider, getMatchName } from "../lib/matches";

type AnalysisPageProps = {
  searchParams: Promise<{ id?: string | string[]; jogo?: string | string[] }>;
};

const toneClasses = {
  good: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  warn: "border-amber-300/30 bg-amber-300/10 text-amber-200",
  bad: "border-red-400/30 bg-red-400/10 text-red-200",
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AnalysisPage({ searchParams }: AnalysisPageProps) {
  const params = await searchParams;
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const rawMatch = Array.isArray(params.jogo) ? params.jogo[0] : params.jogo;
  const providerMatches = await fetchMatchesFromProvider(rawMatch);
  const matches = providerMatches.slice(0, 4);
  const selectedMatch = matches.find((match) => match.id === rawId) ?? matches.find((match) =>
    getMatchName(match).toLowerCase().includes((rawMatch ?? "").toLowerCase())
  );
  const analysis = buildMockAnalysis(rawMatch ?? "", selectedMatch);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,#172119_0,#050505_32rem)] px-5 py-6 sm:px-8">
      <section className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <Link href="/" className="text-2xl font-semibold tracking-tight text-white">
              BetAnalyst AI
            </Link>
            <p className="mt-1 text-sm text-neutral-400">Tela de análise de jogo</p>
          </div>

          <nav className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-1 text-sm font-medium">
            <Link className="rounded-md px-4 py-2 text-neutral-300 hover:bg-white/5" href="/">
              Painel
            </Link>
            <Link className="rounded-md bg-emerald-400 px-4 py-2 text-neutral-950" href="/analise">
              Análise
            </Link>
            <Link className="rounded-md px-4 py-2 text-neutral-300 hover:bg-white/5" href="/multiplas">
              Múltiplas
            </Link>
          </nav>
        </header>

        <form
          action="/analise"
          className="mb-6 flex flex-col gap-3 rounded-lg border border-white/10 bg-neutral-950/80 p-4 shadow-2xl shadow-black/20 sm:flex-row"
        >
          <input
            type="text"
            name="jogo"
            list="matches"
            defaultValue={analysis.matchName}
            required
            className="min-h-12 flex-1 rounded-lg border border-white/10 bg-black/50 px-4 text-sm outline-none transition focus:border-emerald-300"
          />
          <datalist id="matches">
            {matches.map((match) => (
              <option key={match.id} value={getMatchName(match)} />
            ))}
          </datalist>
          <button className="min-h-12 rounded-lg bg-emerald-400 px-6 font-semibold text-neutral-950 transition hover:bg-emerald-300">
            Atualizar análise
          </button>
        </form>

        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-lg border border-white/10 bg-neutral-950/80 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold uppercase text-emerald-300">
                Jogo analisado
              </p>
              <span className="rounded-md border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase text-amber-200">
                {analysis.dataSource === "api" ? "Dados reais" : analysis.dataSource === "demo" ? "Base demo" : "Entrada manual"}
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {analysis.matchName}
            </h1>
            {selectedMatch ? (
              <p className="mt-2 text-sm text-neutral-400">
                {selectedMatch.league} · {selectedMatch.venue} · {dateFormatter.format(new Date(selectedMatch.startsAt))}
              </p>
            ) : (
              <p className="mt-2 text-sm text-neutral-400">
                Configure API_FOOTBALL_KEY para carregar o jogo selecionado com dados reais.
              </p>
            )}

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-white/10 bg-black/40 p-4">
                <p className="text-sm text-neutral-400">Confiança</p>
                <p className="mt-2 text-3xl font-semibold text-emerald-200">{analysis.confidence}%</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/40 p-4">
                <p className="text-sm text-neutral-400">Risco</p>
                <p className="mt-2 text-3xl font-semibold text-amber-200">{analysis.risk}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/40 p-4">
                <p className="text-sm text-neutral-400">Probabilidade</p>
                <p className="mt-2 text-3xl font-semibold text-white">{analysis.estimatedProbability}%</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/40 p-4">
                <p className="text-sm text-neutral-400">Odd justa</p>
                <p className="mt-2 text-3xl font-semibold text-white">{analysis.fairOdd}</p>
              </div>
            </div>

            {selectedMatch ? (
              <div className="mt-5 grid gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-neutral-500">Casa</p>
                  <p className="mt-1 text-lg font-semibold text-white">{selectedMatch.odds.home}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Empate</p>
                  <p className="mt-1 text-lg font-semibold text-white">{selectedMatch.odds.draw}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Fora</p>
                  <p className="mt-1 text-lg font-semibold text-white">{selectedMatch.odds.away}</p>
                </div>
              </div>
            ) : null}

            <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm text-neutral-400">Leitura rápida</p>
              <p className="mt-2 text-sm leading-6 text-neutral-300">
                Entrada interessante apenas se a odd disponível estiver acima da odd justa e se as
                escalações confirmarem o cenário previsto.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-neutral-950/80 p-6">
            <p className="text-sm text-neutral-400">Mercado sugerido</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{analysis.suggestedMarket}</h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {analysis.metrics.map((metric) => (
                <div key={metric.label} className={`rounded-lg border p-4 ${toneClasses[metric.tone]}`}>
                  <p className="text-sm opacity-80">{metric.label}</p>
                  <p className="mt-2 text-xl font-semibold">{metric.value}</p>
                </div>
              ))}
            </div>

            {selectedMatch ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-white/10 bg-black/40 p-4">
                  <p className="text-xs text-neutral-500">Gols médios</p>
                  <p className="mt-2 text-xl font-semibold text-white">{selectedMatch.stats.avgGoals.toFixed(1)}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-black/40 p-4">
                  <p className="text-xs text-neutral-500">Chutes no alvo</p>
                  <p className="mt-2 text-xl font-semibold text-white">{selectedMatch.stats.shotsOnTarget.toFixed(1)}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-black/40 p-4">
                  <p className="text-xs text-neutral-500">Cartões</p>
                  <p className="mt-2 text-xl font-semibold text-white">{selectedMatch.stats.cards.toFixed(1)}</p>
                </div>
              </div>
            ) : null}

            <div className="mt-6 rounded-lg border border-white/10 bg-black/40 p-5">
              <h3 className="font-semibold text-white">Pontos de atenção</h3>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-neutral-300">
                {analysis.attentionPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
