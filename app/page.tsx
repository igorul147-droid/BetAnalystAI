export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-8">
      <section className="mx-auto max-w-6xl">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">BetAnalyst AI</h1>
            <p className="text-zinc-400">Análise inteligente para apostas esportivas</p>
          </div>

          <span className="rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-400">
            MVP Online
          </span>
        </header>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8">
          <h2 className="mb-3 text-4xl font-bold">
            Analise jogos e múltiplas com IA
          </h2>

          <p className="mb-8 max-w-2xl text-zinc-400">
            Busque uma partida, escolha os mercados e receba uma análise de risco,
            probabilidade estimada e pontos de atenção.
          </p>

          <div className="flex flex-col gap-4 md:flex-row">
            <input
              type="text"
              placeholder="Ex: Suíça x Bósnia"
              className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-4 outline-none focus:border-green-500"
            />

            <button className="rounded-xl bg-green-600 px-6 py-4 font-semibold hover:bg-green-500">
              Analisar Jogo
            </button>

            <button className="rounded-xl border border-zinc-700 px-6 py-4 font-semibold hover:bg-zinc-800">
              Analisar Múltipla
            </button>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-sm text-zinc-400">Modo 1</p>
            <h3 className="mt-2 text-xl font-bold">Análise de Jogo</h3>
            <p className="mt-3 text-zinc-400">
              Probabilidades, gols, escanteios, cartões, chutes e desarmes.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-sm text-zinc-400">Modo 2</p>
            <h3 className="mt-2 text-xl font-bold">Análise de Múltipla</h3>
            <p className="mt-3 text-zinc-400">
              Nota da aposta, mercado mais forte e mercado mais arriscado.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-sm text-zinc-400">Futuro</p>
            <h3 className="mt-2 text-xl font-bold">Detector de Valor</h3>
            <p className="mt-3 text-zinc-400">
              Comparação entre probabilidade calculada e odd oferecida.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}