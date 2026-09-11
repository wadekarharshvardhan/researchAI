import { runQuerySearchAgent } from "@/agents/query-search";
import { runPaperAnalysisAgent } from "@/agents/paper-analysis";
import { runResearchGapTrendAgent } from "@/agents/research-gap-trend";
import { runLiteratureSynthesisAgent } from "@/agents/literature-synthesis";
import { FullResearchReport, ResearchPaper } from "@/types/research-paper";

/**
 * Options for running the full 4-agent ResearchAI pipeline.
 */
export interface OrchestratorOptions {
  limit?: number;
  year?: number;
  yearFrom?: number;
  skipRetrieval?: boolean;
  maxAnalysisWorkers?: number;
}

/**
 * End-to-end 4-Agent Orchestrator:
 *
 * USER
 *  ↓
 * AGENT 1: Research Discovery & Retrieval (OpenAlex + Deduplication + BM25 + Text Extraction + Chunking)
 *  ↓
 * AGENT 2: Paper Analysis (Deep Problem, Methodology, Models, Datasets, Metrics, Results, Limitations)
 *  ↓
 * AGENT 3: Research Gap & Trend (Cross-paper reasoning: Trends, Methods, Datasets, Agreements, Contradictions, Potential Gaps)
 *  ↓
 * AGENT 4: Literature Synthesis (Evidence-backed Literature Review with Claim Traceability & References)
 */
export async function runFullResearchPipeline(
  query: string,
  options?: OrchestratorOptions,
  existingPapers?: ResearchPaper[]
): Promise<FullResearchReport> {
  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    console.log(`\n[ResearchAI Pipeline] Starting 4-agent run for query: "${query}"`);
  }

  // ── Step 1: Agent 1 (Discovery & Retrieval) ───────────────────────
  let papers: ResearchPaper[] = [];
  let discoveryResult = {
    query,
    searchQueries: [query],
    papers: [] as ResearchPaper[],
  };

  if (existingPapers && existingPapers.length > 0) {
    papers = existingPapers;
    discoveryResult.papers = existingPapers;
  } else {
    discoveryResult = await runQuerySearchAgent(query, {
      yearFrom: options?.year ?? options?.yearFrom,
      limit: options?.limit ?? 10,
      skipRetrieval: options?.skipRetrieval ?? false,
    });
    papers = discoveryResult.papers;
  }

  if (isDev) {
    console.log(`[ResearchAI Pipeline] Agent 1 output count: ${papers.length} papers discovered`);
  }

  // ── Step 2: Agent 2 (Paper Analysis) ──────────────────────────────
  if (isDev) {
    console.log(`[ResearchAI Pipeline] Agent 2 input count: ${papers.length} papers`);
  }

  const agent2Result = await runPaperAnalysisAgent(
    papers,
    options?.maxAnalysisWorkers ?? 5
  );

  if (isDev) {
    console.log(
      `[ResearchAI Pipeline] Agent 2 analyses: ${agent2Result.successfulCount} successful, ${agent2Result.failedCount} failed`
    );
  }

  // ── Step 3: Agent 3 (Research Gap & Trend) ────────────────────────
  if (isDev) {
    console.log(`[ResearchAI Pipeline] Agent 3 input count: ${agent2Result.analyses.length} analyses`);
  }

  const researchIntelligence = await runResearchGapTrendAgent(
    agent2Result.analyses,
    query
  );

  if (isDev) {
    console.log(`[ResearchAI Pipeline] Agent 3 output:
      - Trends detected: ${researchIntelligence.trends.length}
      - Agreements detected: ${researchIntelligence.agreements.length}
      - Contradictions detected: ${researchIntelligence.contradictions.length}
      - Potential research gaps detected: ${researchIntelligence.potentialGaps.length}`);
  }

  // ── Step 4: Agent 4 (Literature Synthesis) ────────────────────────
  if (isDev) {
    console.log(`[ResearchAI Pipeline] Agent 4 input: synthesizing literature review...`);
  }

  const literatureReview = await runLiteratureSynthesisAgent(
    query,
    agent2Result.analyses,
    researchIntelligence,
    papers
  );

  if (isDev) {
    console.log(
      `[ResearchAI Pipeline] Agent 4 completed: ${literatureReview.claims.length} claims traced, ${literatureReview.references.length} references compiled.`
    );
  }

  return {
    query,
    discovery: discoveryResult,
    paperAnalyses: agent2Result.analyses,
    researchIntelligence,
    literatureReview,
    stats: {
      discoveredCount: papers.length,
      analyzedCount: agent2Result.successfulCount,
      failedAnalysisCount: agent2Result.failedCount,
      gapsCount: researchIntelligence.potentialGaps.length,
      trendsCount: researchIntelligence.trends.length,
    },
  };
}
