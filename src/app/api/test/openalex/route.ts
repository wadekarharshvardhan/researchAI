import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * Direct OpenAlex search endpoint — bypasses the LLM agent.
 * Useful for testing that the OpenAlex tool works without needing an OPENAI_API_KEY.
 */

const RequestSchema = z.object({
  query: z.string().min(1, "Query is required"),
  yearFrom: z.number().int().min(1900).max(2100).optional(),
  limit: z.number().int().min(1).max(50).optional().default(10),
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

    const { query, yearFrom, limit } = parsed.data;

    // Import direct search function
    const { searchOpenAlexDirect } = await import("@/tools/openalex");

    const result = await searchOpenAlexDirect({ query, yearFrom, limit });

    return NextResponse.json({
      query,
      yearFrom: yearFrom ?? null,
      limit,
      totalResults: result.totalResults,
      papersReturned: result.papers.length,
      error: result.error,
      papers: result.papers,
    });
  } catch (err) {
    console.error("OpenAlex search error:", err);
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
