import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BetAnalyst AI | Análise premium",
  description: "Analise jogos, odds e múltiplas com uma experiência visual premium e cassino.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="relative min-h-full overflow-x-hidden bg-transparent text-neutral-50">
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
