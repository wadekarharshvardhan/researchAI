import { runPaperAnalysisAgent } from "../src/agents/paper-analysis";
import { runResearchGapTrendAgent } from "../src/agents/research-gap-trend";
import { runLiteratureSynthesisAgent } from "../src/agents/literature-synthesis";
import { ResearchPaper } from "../src/types/research-paper";

async function testAgent4() {
  console.log("============================================================");
  console.log("  AGENT 4 (LITERATURE SYNTHESIS AGENT) VERIFICATION TEST");
  console.log("============================================================\n");

  const papers: ResearchPaper[] = [
    {
      id: "W1",
      title: "Mobile-ViT for In-Field Crop Foliar Disease Diagnosis",
      authors: ["Zhang L.", "Chen W."],
      year: 2024,
      doi: "10.1016/j.compag.2024.108920",
      citationCount: 22,
      url: "https://doi.org/10.1016/j.compag.2024.108920",
      pdfUrl: null,
      isOpenAccess: true,
      source: "OpenAlex",
      venue: "Computers and Electronics in Agriculture",
      topics: ["Vision Transformer", "Crop Disease", "Edge AI"],
      contentStatus: "full_text",
      abstract: null,
      text: "We propose Mobile-ViT leveraging Vision Transformer with self-attention for crop disease detection. Evaluated on PlantVillage and FieldPlant, reaching 98.4% accuracy. However, computational overhead is high and background illumination causes degradation in field tests. Future work will investigate multimodal telemetry.",
    },
    {
      id: "W2",
      title: "Real-Time MobileNetV3 for Ultra-Low-Power Edge Crop Scouting",
      authors: ["Kumar S.", "Patel R."],
      year: 2023,
      doi: "10.1000/182",
      citationCount: 45,
      url: "https://doi.org/10.1000/182",
      pdfUrl: null,
      isOpenAccess: true,
      source: "OpenAlex",
      venue: "IEEE Access",
      topics: ["MobileNet", "Edge AI", "Crop Disease"],
      contentStatus: "full_text",
      abstract: null,
      text: "We present a MobileNetV3 framework for rapid foliar disease scouting. On 10,000 images, accuracy achieved 95.2% with 18ms latency. Transfer learning was crucial for baseline convergence. However, the model fails under severe shadow occlusions and relies primarily on controlled datasets. Early-stage micro-lesions remain undetectable.",
    },
  ];

  console.log("--- 1. Agent 2 Execution ---");
  const a2 = await runPaperAnalysisAgent(papers);
  console.log(`Agent 2 produced ${a2.analyses.length} analyses.`);

  console.log("--- 2. Agent 3 Execution ---");
  const a3 = await runResearchGapTrendAgent(a2.analyses, "AI in crop disease detection");
  console.log(`Agent 3 produced ${a3.trends.length} trends and ${a3.potentialGaps.length} research gaps.`);

  console.log("--- 3. Agent 4 Execution ---");
  const review = await runLiteratureSynthesisAgent(
    "AI in crop disease detection",
    a2.analyses,
    a3,
    papers
  );

  console.log(`✓ Executive Summary generated (${review.executiveSummary.length} chars)`);
  console.log(`✓ Major Approaches generated (${review.majorResearchApproaches.length} chars)`);
  console.log(`✓ Results Comparison generated (${review.resultsComparison.length} chars)`);
  console.log(`✓ Claims with Supporting Papers: ${review.claims.length} claims`);
  review.claims.slice(0, 3).forEach((c, i) => {
    console.log(`  Claim ${i + 1}: "${c.claim.slice(0, 70)}..." -> Papers: [${c.supportingPaperIds.join(", ")}]`);
  });

  console.log(`✓ References generated: ${review.references.length} citations`);
  review.references.forEach((r, i) => {
    console.log(`  Ref ${i + 1}: ${r.authors.join(", ")} (${r.year}). "${r.title}". ${r.venue || ""}`);
  });

  if (review.claims.length === 0) throw new Error("Expected traceable claims");
  if (review.references.length !== 2) throw new Error("Expected 2 references");

  console.log("\n============================================================");
  console.log("  AGENT 4 VERIFICATION: ALL CHECKS PASSED SUCCESSFULLY!");
  console.log("============================================================\n");
}

testAgent4().catch((err) => {
  console.error("Agent 4 Verification Failed:", err);
  process.exit(1);
});
