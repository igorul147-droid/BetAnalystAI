import { type NextRequest } from "next/server";
import { fetchMatchesFromProvider } from "../../lib/matches";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? undefined;
  const matches = await fetchMatchesFromProvider(query);
  const source = matches.some((match) => match.source === "api") ? "api" : "error";

  return Response.json({
    source,
    nextProvider: "api-football",
    matches,
    message: source === "error" ? "Configure API_FOOTBALL_KEY para habilitar dados reais." : undefined,
  });
}
