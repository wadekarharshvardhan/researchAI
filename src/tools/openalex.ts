import { tool } from "ai";
import { z } from "zod";
import { ResearchPaper } from "@/types/research-paper";

/**
 * Reconstruct an abstract from OpenAlex's abstract_inverted_index format.
 *
 * The inverted index maps each word to an array of positions where it appears.
 * We iterate all entries, place each word at its correct position(s), then join.
 */
function reconstructAbstract(
  invertedIndex: Record<string, number[]> | null | undefined
): string | null {
  if (!invertedIndex || typeof invertedIndex !== "object") {
    return null;
  }

  const words: [number, string][] = [];

  for (const [word, positions] of Object.entries(invertedIndex)) {
    if (!Array.isArray(positions)) continue;
    for (const pos of positions) {
      if (typeof pos === "number") {
        words.push([pos, word]);
      }
    }
  }

  if (words.length === 0) return null;

  // Sort by position ascending
  words.sort((a, b) => a[0] - b[0]);

  return words.map(([, word]) => word).join(" ");
}

/**
 * Extract the best available PDF URL from an OpenAlex work result.
 */
function extractPdfUrl(work: Record<string, unknown>): string | null {
  // Try primary location first
  const primaryLocation = work.primary_location as Record<string, unknown> | null;
  if (primaryLocation) {
    const pdf = primaryLocation.pdf_url;
    if (typeof pdf === "string" && pdf.length > 0) return pdf;
  }

  // Try best_oa_location
  const bestOa = work.best_oa_location as Record<string, unknown> | null;
  if (bestOa) {
    const pdf = bestOa.pdf_url;
    if (typeof pdf === "string" && pdf.length > 0) return pdf;
  }

  return null;
}

/**
 * Extract the landing page URL from an OpenAlex work result.
 */
function extractLandingUrl(work: Record<string, unknown>): string | null {
  const primaryLocation = work.primary_location as Record<string, unknown> | null;
  if (primaryLocation) {
    const url = primaryLocation.landing_page_url;
    if (typeof url === "string" && url.length > 0) return url;
  }

  // Fallback to the DOI URL
  const doi = work.doi;
  if (typeof doi === "string" && doi.length > 0) return doi;

  return null;
}

/**
 * Map a raw OpenAlex work object to our ResearchPaper interface.
 */
function mapOpenAlexWork(work: Record<string, unknown>): ResearchPaper {
  // Extract authors
  const authorships = work.authorships as Array<Record<string, unknown>> | undefined;
  const authors: string[] = [];
  if (Array.isArray(authorships)) {
    for (const authorship of authorships) {
      const author = authorship.author as Record<string, unknown> | undefined;
      if (author) {
        const name = author.display_name;
        if (typeof name === "string" && name.length > 0) {
          authors.push(name);
        }
      }
    }
  }

  // Extract DOI — OpenAlex returns full URL like "https://doi.org/10.xxxx"
  let doi: string | null = null;
  if (typeof work.doi === "string" && work.doi.length > 0) {
    doi = work.doi.replace("https://doi.org/", "");
  }

  // Extract publication year
  const year =
    typeof work.publication_year === "number" ? work.publication_year : null;

  // Extract citation count
  const citationCount =
    typeof work.cited_by_count === "number" ? work.cited_by_count : 0;

  // Extract open access status
  const openAccess = work.open_access as Record<string, unknown> | undefined;
  const isOpenAccess =
    openAccess && typeof openAccess.is_oa === "boolean"
      ? openAccess.is_oa
      : false;

  // Reconstruct abstract
  const abstract = reconstructAbstract(
    work.abstract_inverted_index as Record<string, number[]> | null | undefined
  );

  // Extract ID
  const id = typeof work.id === "string" ? work.id : "";

  // Extract title
  const title = typeof work.title === "string" ? work.title : "Untitled";

  // Extract venue / journal
  let venue: string | null = null;
  const primaryLoc = work.primary_location as Record<string, unknown> | undefined;
  const hostVenue = work.host_venue as Record<string, unknown> | undefined;
  const sourceLoc = (primaryLoc?.source || hostVenue) as Record<string, unknown> | undefined;
  if (sourceLoc && typeof sourceLoc.display_name === "string" && sourceLoc.display_name.trim().length > 0) {
    venue = sourceLoc.display_name.trim();
  } else {
    // Check locations array
    const locations = work.locations as Array<Record<string, unknown>> | undefined;
    if (Array.isArray(locations) && locations.length > 0) {
      for (const loc of locations) {
        const src = loc?.source as Record<string, unknown> | undefined;
        if (src && typeof src.display_name === "string" && src.display_name.trim().length > 0) {
          venue = src.display_name.trim();
          break;
        }
      }
    }
  }

  // Extract concepts / topics
  const topics: string[] = [];
  const concepts = work.concepts as Array<{ display_name?: string }> | undefined;
  if (Array.isArray(concepts)) {
    for (const c of concepts) {
      if (typeof c.display_name === "string" && c.display_name.trim().length > 0) {
        topics.push(c.display_name.trim());
      }
      if (topics.length >= 4) break;
    }
  }
  if (topics.length === 0) {
    const keywords = work.keywords as Array<{ keyword?: string; display_name?: string }> | undefined;
    if (Array.isArray(keywords)) {
      for (const kw of keywords) {
        const val = kw.keyword || kw.display_name;
        if (typeof val === "string" && val.trim().length > 0) {
          topics.push(val.trim());
        }
        if (topics.length >= 4) break;
      }
    }
  }

  return {
    id,
    title,
    authors,
    abstract,
    year,
    doi,
    citationCount,
    url: extractLandingUrl(work),
    pdfUrl: extractPdfUrl(work),
    isOpenAccess,
    source: "OpenAlex",
    venue,
    topics,
  };
}

/**
 * Direct search function for OpenAlex Works API.
 * Can be called directly by API routes or by the AI SDK tool.
 */
export async function searchOpenAlexDirect({
  query,
  year,
  yearFrom,
  yearTo,
  sortBy = "relevance",
  sortOrder = "desc",
  limit = 15,
}: {
  query: string;
  year?: number;
  yearFrom?: number;
  yearTo?: number;
  sortBy?: "latest" | "relevance" | "citations";
  sortOrder?: "asc" | "desc";
  limit?: number;
}): Promise<{
  papers: ResearchPaper[];
  error: string | null;
  totalResults: number;
}> {
  const effectiveLimit = Math.min(Math.max(limit, 1), 50);

  // Map sort option and direction to OpenAlex sort parameter
  const direction = sortOrder === "asc" ? "asc" : "desc";
  let sortParam = `publication_date:${direction}`;
  if (sortBy === "relevance") {
    // OpenAlex API prohibits relevance_score:asc (returns 400).
    // Always retrieve candidate papers with relevance_score:desc,
    // and let BM25 / downstream ranker sort by the requested order (asc or desc).
    sortParam = "relevance_score:desc";
  } else if (sortBy === "citations") {
    sortParam = `cited_by_count:${direction}`;
  }

  const params = new URLSearchParams({
    search: query,
    per_page: String(effectiveLimit),
    sort: sortParam,
    mailto: "researchai@example.com",
  });

  // Construct filters
  const filters: string[] = [];
  const currentYear = new Date().getFullYear();

  if (year) {
    // Specific exact year
    filters.push(`publication_year:${year}`);
  } else {
    if (yearFrom) {
      filters.push(`from_publication_date:${yearFrom}-01-01`);
    }
    if (yearTo) {
      filters.push(`to_publication_date:${yearTo}-12-31`);
    } else if (sortBy === "latest") {
      // Prevent anomalies in database like year 2045 from showing as latest
      filters.push(`to_publication_date:${currentYear + 1}-12-31`);
    }
  }

  if (filters.length > 0) {
    params.set("filter", filters.join(","));
  }

  const url = `https://api.openalex.org/works?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      return {
        papers: [] as ResearchPaper[],
        error: `OpenAlex API returned status ${response.status}: ${errorText.slice(0, 200)}`,
        totalResults: 0,
      };
    }

    const data = (await response.json()) as {
      results?: Record<string, unknown>[];
      meta?: { count?: number };
    };

    const results = data.results ?? [];
    const papers: ResearchPaper[] = results.map(mapOpenAlexWork);

    return {
      papers,
      error: null,
      totalResults: data.meta?.count ?? papers.length,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error occurred";
    return {
      papers: [] as ResearchPaper[],
      error: `OpenAlex search failed: ${message}`,
      totalResults: 0,
    };
  }
}

/**
 * OpenAlex search tool for the Vercel AI SDK.
 *
 * Searches the OpenAlex Works API and returns structured ResearchPaper results.
 */
export const searchOpenAlex = tool({
  description:
    "Search for academic papers using the OpenAlex API. " +
    "Returns structured metadata including title, authors, abstract, year, DOI, " +
    "citation count, URLs, and open access status. " +
    "Defaults to the latest published research. Use this to find research papers on a given topic.",
  inputSchema: z.object({
    query: z.string().describe("The search query for finding academic papers"),
    year: z
      .number()
      .optional()
      .describe("Filter results to a specific publication year (e.g. 2024)"),
    yearFrom: z
      .number()
      .optional()
      .describe(
        "Filter results to papers published from this year onwards (inclusive)"
      ),
    yearTo: z
      .number()
      .optional()
      .describe("Filter results to papers published up to this year (inclusive)"),
    sortBy: z
      .enum(["latest", "relevance", "citations"])
      .optional()
      .default("relevance")
      .describe("Sort order criterion: 'relevance' (default, BM25-ranked), or 'citations'"),
    sortOrder: z
      .enum(["asc", "desc"])
      .optional()
      .default("desc")
      .describe("Sort direction: 'desc' (descending, default) or 'asc' (ascending)"),
    limit: z
      .number()
      .optional()
      .default(15)
      .describe("Maximum number of results to return (default: 15, max: 50)"),
  }),
  execute: async ({ query, year, yearFrom, yearTo, sortBy, sortOrder, limit }) => {
    return searchOpenAlexDirect({ query, year, yearFrom, yearTo, sortBy, sortOrder, limit });
  },
});
