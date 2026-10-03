import { getSearchIndex } from "@/lib/search-index";

// /search-index.json: what the site search looks through (lib/search-index.ts).
// Written once at build time; the browser fetches it the first time someone
// opens search, and the service worker keeps it for offline use.
export const dynamic = "force-static";

export async function GET() {
  return Response.json(await getSearchIndex());
}
