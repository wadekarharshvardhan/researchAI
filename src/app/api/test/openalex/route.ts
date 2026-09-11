import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * Direct OpenAlex search endpoint — bypasses the LLM agent.
 * Useful for testing that the OpenAlex tool works without needing an OPENAI_API_KEY.
 */

const RequestSchema = z.object({
  query: z.string().min(1, "Query is required"),
  year: z.number().int().min(1900).max(2100).optional(),
  yearFrom: z.number().int().min(1900).max(2100).optional(),
  yearTo: z.number().int().min(1900).max(2100).optional(),
  sortBy: z.enum(["latest", "relevance", "citations"]).optional().default("relevance"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  limit: z.number().int().min(1).max(50).optional().default(15),
  retrieveContent: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { query, year, yearFrom, yearTo, sortBy, sortOrder, limit, retrieveContent } = parsed.data;

    // Import direct search function
    const { searchOpenAlexDirect } = await import("@/tools/openalex");

    const result = await searchOpenAlexDirect({
      query,
      year,
      yearFrom,
      yearTo,
      sortBy,
      sortOrder,
      limit,
    });

    let finalPapers = result.papers;

    // Apply BM25 ranking when relevance sort is selected
    if (sortBy === "relevance" && finalPapers.length > 0) {
      const { rankPapersWithBM25 } = await import("@/utils/bm25");
      finalPapers = rankPapersWithBM25(finalPapers, query, { sortOrder });
    }

    if (retrieveContent && finalPapers.length > 0) {
      const { retrievePaperCorpus } = await import("@/tools/retrieve-paper");
      finalPapers = await retrievePaperCorpus(finalPapers);
    }

    return NextResponse.json({
      query,
      year: year ?? null,
      yearFrom: yearFrom ?? null,
      yearTo: yearTo ?? null,
      sortBy,
      sortOrder,
      limit,
      totalResults: result.totalResults,
      papersReturned: finalPapers.length,
      error: result.error,
      papers: finalPapers,
    });
  } catch (err) {
    console.error("OpenAlex search error:", err);
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
