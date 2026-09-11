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
  sortBy: z.enum(["latest", "relevance", "citations"]).optional().default("latest"),
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

    const { query, year, yearFrom, yearTo, sortBy, limit, retrieveContent } = parsed.data;

    // Import direct search function
    const { searchOpenAlexDirect } = await import("@/tools/openalex");

    const result = await searchOpenAlexDirect({
      query,
      year,
      yearFrom,
      yearTo,
      sortBy,
      limit,
    });

    let finalPapers = result.papers;
    if (retrieveContent && result.papers.length > 0) {
      const { retrievePaperCorpus } = await import("@/tools/retrieve-paper");
      finalPapers = await retrievePaperCorpus(result.papers);
    }

    return NextResponse.json({
      query,
      year: year ?? null,
      yearFrom: yearFrom ?? null,
      yearTo: yearTo ?? null,
      sortBy,
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
