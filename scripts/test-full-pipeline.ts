import { runFullResearchPipeline } from "../src/agents/orchestrator";

async function testFullPipeline() {
  console.log("============================================================");
  console.log("  TESTING FULL 4-AGENT PIPELINE (PS04)");
  console.log("  QUERY: 'Analyze recent research on AI-based crop disease detection'");
  console.log("============================================================\n");

  const query = "AI-based crop disease detection";

  const startTime = Date.now();
  const report = await runFullResearchPipeline(query, {
    limit: 5,
    yearFrom: 2022,
    skipRetrieval: false,
  });
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n✓ Pipeline completed in ${duration}s`);
  console.log("------------------------------------------------------------");
  console.log("STATISTICS:");
  console.log(`- Papers Discovered (Agent 1): ${report.stats.discoveredCount}`);
  console.log(`- Papers Successfully Analyzed (Agent 2): ${report.stats.analyzedCount}`);
  console.log(`- Failed Analyses: ${report.stats.failedAnalysisCount}`);
  console.log(`- Trends Detected (Agent 3): ${report.stats.trendsCount}`);
  console.log(`- Potential Gaps Detected (Agent 3): ${report.stats.gapsCount}`);
  console.log("------------------------------------------------------------");

  console.log("\n--- AGENT 2 SAMPLE ANALYSES ---");
  report.paperAnalyses.slice(0, 2).forEach((a, i) => {
    console.log(`\n[Paper ${i + 1}] "${a.title}" (${a.year || "n.d."})`);
    console.log(`  - Content Level: ${a.contentLevel}`);
    console.log(`  - Research Problem: ${a.researchProblem.slice(0, 90)}...`);
    console.log(`  - Methodology: ${a.methodology.slice(0, 90)}...`);
    console.log(`  - Detected Models: [${a.models.join(", ")}]`);
    console.log(`  - Detected Datasets: [${a.datasets.join(", ")}]`);
    console.log(`  - Metrics: ${a.evaluationMetrics.map(m => `${m.metric}: ${m.value}`).join(", ") || "None reported"}`);
    console.log(`  - Limitations: ${a.limitations.length} identified`);
  });

  console.log("\n--- AGENT 3 RESEARCH GAPS ---");
  report.researchIntelligence.potentialGaps.forEach((g, i) => {
    console.log(`\n[Gap ${i + 1}] ${g.title}`);
    console.log(`  - Confidence: ${g.confidence}% (Strength: ${g.evidenceStrength})`);
    console.log(`  - Supporting Papers: ${g.supportingPaperCount}/${g.qualifyingPaperCount}`);
    console.log(`  - Why it matters: ${g.whyItMatters.slice(0, 100)}...`);
    console.log(`  - Direction: ${g.potentialResearchDirection.slice(0, 100)}...`);
  });

  console.log("\n--- AGENT 4 LITERATURE REVIEW SYNTHESIS ---");
  console.log(`Executive Summary:\n${report.literatureReview.executiveSummary}\n`);
  console.log(`Traceable Claims Count: ${report.literatureReview.claims.length}`);
  console.log(`Bibliographic References Count: ${report.literatureReview.references.length}`);

  // Assertions
  if (report.paperAnalyses.length === 0) throw new Error("Expected analyzed papers");
  if (report.researchIntelligence.potentialGaps.length === 0) throw new Error("Expected research gaps");
  if (report.literatureReview.references.length === 0) throw new Error("Expected references");

  console.log("\n============================================================");
  console.log("  FULL PIPELINE VERIFICATION: 100% PASSED!");
  console.log("============================================================\n");
}

testFullPipeline().catch((err) => {
  console.error("Full Pipeline Test Failed:", err);
  process.exit(1);
});
