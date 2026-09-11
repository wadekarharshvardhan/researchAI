import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runQuerySearchAgent } from "@/agents/query-search";

const RequestSchema = z.object({
  query: z.string().min(1, "Query is required"),
  yearFrom: z.number().int().min(1900).max(2100).optional(),
  limit: z.number().int().min(1).max(50).optional(),
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

    const result = await runQuerySearchAgent(query, { yearFrom, limit });

    return NextResponse.json(result);
  } catch (err) {
    console.error("Query search agent error:", err);
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
