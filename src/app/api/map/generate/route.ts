import { NextRequest, NextResponse } from "next/server";
import { getPresetOrGenerateMap } from "@/lib/research-map-presets";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body.query || "Renewable energy";
    const graph = getPresetOrGenerateMap(query);

    return NextResponse.json(graph);
  } catch (err) {
    console.error("Map generation error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate research map" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "Renewable energy";
  const graph = getPresetOrGenerateMap(query);
  return NextResponse.json(graph);
}
