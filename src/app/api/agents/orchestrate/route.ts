import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runFullResearchPipeline } from "@/agents/orchestrator";
import { ResearchPaper } from "@/types/research-paper";

const RequestSchema = z.object({
  query: z.string().min(1, "Query is required"),
  limit: z.number().int().min(1).max(30).optional().default(10),
  year: z.number().int().optional(),
  yearFrom: z.number().int().optional(),
  skipRetrieval: z.boolean().optional().default(false),
  papers: z.array(z.any()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { query, limit, year, yearFrom, skipRetrieval, papers } = parsed.data;

    const report = await runFullResearchPipeline(
      query,
      {
        limit,
        year,
        yearFrom,
        skipRetrieval,
      },
      papers as ResearchPaper[] | undefined
    );

    return NextResponse.json(report);
  } catch (err) {
    console.error("Orchestrator pipeline error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
