import { ResearchPaper } from "@/types/research-paper";

/**
 * Call the OpenAlex search API route directly from the client.
 * This bypasses the LLM agent and calls OpenAlex directly — no API key needed.
 */
export async function searchPapers(
  query: string,
  options?: {
    year?: number | null;
    yearFrom?: number | null;
    yearTo?: number | null;
    sortBy?: "latest" | "relevance" | "citations";
    sortOrder?: "asc" | "desc";
    limit?: number;
  }
): Promise<{
  papers: ResearchPaper[];
  totalResults: number;
  error: string | null;
}> {
  try {
    const body: Record<string, unknown> = { query };
    if (options?.year) body.year = options.year;
    if (options?.yearFrom) body.yearFrom = options.yearFrom;
    if (options?.yearTo) body.yearTo = options.yearTo;
    if (options?.sortBy) body.sortBy = options.sortBy;
    if (options?.sortOrder) body.sortOrder = options.sortOrder;
    if (options?.limit) body.limit = options.limit;

    const res = await fetch("/api/test/openalex", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        papers: [],
        totalResults: 0,
        error: data.error || "Search failed",
      };
    }

    return {
      papers: data.papers ?? [],
      totalResults: data.totalResults ?? 0,
      error: data.error ?? null,
    };
  } catch (err) {
    return {
      papers: [],
      totalResults: 0,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}
