import Link from "next/link";
import { fetchMatchesFromProvider, getMatchName } from "./lib/matches";

const dashboardStats = [
  { label: "Partidas monitoradas", value: "4", detail: "estrutura de dados ativa" },
  { label: "Confiança média", value: "74%", detail: "amostra do modelo local" },
  { label: "Mercados no radar", value: "8", detail: "gols, cartões e cantos" },
];

const modes = [
  {
    eyebrow: "Modo principal",
    title: "Análise de jogo",
    text: "Probabilidade estimada, odd justa, risco e pontos de atenção em uma leitura única.",
  },
  {
    eyebrow: "Em preparação",
    title: "Análise de múltipla",
    text: "Base para medir força das seleções, exposição total e perna mais arriscada.",
  },
  {
    eyebrow: "Sprint 2",
    title: "Camada de API",
    text: "A aplicação já expõe `/api/matches` e está pronta para receber um provedor real.",
  },
];

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function Home() {
  const matches = (await fetchMatchesFromProvider()).slice(0, 4);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#0f241c_0,#050505_34rem)] px-5 py-6 sm:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <Link href="/" className="text-2xl font-semibold tracking-tight text-white">
              BetAnalyst AI
            </Link>
            <p className="mt-1 text-sm text-neutral-400">
              Análises esportivas com critério, contexto e controle de risco.
            </p>
          </div>

          <nav className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-1 text-sm font-medium">
            <Link className="rounded-md bg-emerald-400 px-4 py-2 text-neutral-950" href="/">
              Painel
            </Link>
            <Link className="rounded-md px-4 py-2 text-neutral-300 hover:bg-white/5" href="/analise">
              Análise
            </Link>
            <Link className="rounded-md px-4 py-2 text-neutral-300 hover:bg-white/5" href="/multiplas">
              Múltiplas
            </Link>
          </nav>
        </header>

        <section className="grid flex-1 gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex flex-col justify-center rounded-lg border border-white/10 bg-neutral-950/70 p-6 shadow-2xl shadow-black/30 sm:p-8">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase text-emerald-300">
                Premium Preview
              </span>
              <span className="rounded-md border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase text-amber-200">
                Dados em cache
              </span>
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Encontre uma partida e transforme odds em decisão.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-300">
              O app agora trabalha com partidas estruturadas: liga, horário, odds e estatísticas
              entram no fluxo de análise. A próxima troca é simples: conectar um provedor real.
            </p>

            <form action="/analise" className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                name="jogo"
                list="matches"
                required
                placeholder="Ex.: Suíça x Bósnia"
                className="min-h-12 flex-1 rounded-lg border border-white/10 bg-black/50 px-4 text-sm text-neutral-50 outline-none transition placeholder:text-neutral-500 focus:border-emerald-300"
              />
              <datalist id="matches">
                {matches.map((match) => (
                  <option key={match.id} value={getMatchName(match)} />
                ))}
              </datalist>

              <button className="min-h-12 rounded-lg bg-emerald-400 px-6 font-semibold text-neutral-950 transition hover:bg-emerald-300">
                Analisar jogo
              </button>
            </form>

            <div className="mt-7">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold uppercase text-neutral-300">
                  Jogos monitorados
                </h2>
                <span className="text-xs text-neutral-500">Fonte: API em tempo real</span>
              </div>

              <div className="grid gap-3">
                {matches.map((match) => (
                  <Link
                    key={match.id}
                    href={{ pathname: "/analise", query: { id: match.id } }}
                    className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4 transition hover:border-emerald-300/60 hover:bg-white/[0.05] sm:grid-cols-[1fr_auto]"
                  >
                    <div>
                      <p className="text-base font-semibold text-white">{getMatchName(match)}</p>
                      <p className="mt-1 text-sm text-neutral-400">
                        {match.league} · {match.country} · {dateFormatter.format(new Date(match.startsAt))}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-300">
                      <span className="rounded-md bg-black/40 px-2 py-1">Casa {match.odds.home}</span>
                      <span className="rounded-md bg-black/40 px-2 py-1">Over 1.5 {match.odds.over15}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="grid content-center gap-4">
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {dashboardStats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-sm text-neutral-400">{stat.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs text-emerald-200">{stat.detail}</p>
                </div>
              ))}
            </div>

            {modes.map((mode) => (
              <div key={mode.title} className="rounded-lg border border-white/10 bg-neutral-950/80 p-5">
                <p className="text-sm text-neutral-400">{mode.eyebrow}</p>
                <h2 className="mt-2 text-xl font-semibold text-white">{mode.title}</h2>
                <p className="mt-3 text-sm leading-6 text-neutral-400">{mode.text}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
