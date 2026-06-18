export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold mb-4">
        BetAnalyst AI
      </h1>

      <p className="text-zinc-400 mb-10">
        Análise Inteligente para Apostas Esportivas
      </p>

      <input
        type="text"
        placeholder="Digite um jogo (Ex: Suíça x Bósnia)"
        className="w-[500px] p-4 rounded-xl bg-zinc-900 border border-zinc-700"
      />

      <button className="mt-4 px-6 py-3 bg-green-600 rounded-xl hover:bg-green-500">
        Analisar Jogo
      </button>
    </main>
  );
}