import { runPaperAnalysisAgent } from "../src/agents/paper-analysis";
import { runResearchGapTrendAgent } from "../src/agents/research-gap-trend";
import { ResearchPaper } from "../src/types/research-paper";

async function testAgent3() {
  console.log("============================================================");
  console.log("  AGENT 3 (RESEARCH GAP & TREND AGENT) VERIFICATION TEST");
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
    {
      id: "W3",
      title: "Benchmark Evaluation of YOLOv8 vs ResNet-50 for Apple Scab Detection",
      authors: ["Smith J.", "O'Connor D."],
      year: 2023,
      doi: "10.1000/183",
      citationCount: 78,
      url: "https://doi.org/10.1000/183",
      pdfUrl: null,
      isOpenAccess: false,
      source: "OpenAlex",
      venue: "Plant Pathology",
      topics: ["YOLOv8", "ResNet-50", "Apple Scab"],
      contentStatus: "abstract_only",
      abstract: "We benchmark YOLOv8 and ResNet-50 on apple scab identification. Achieving 96.8% accuracy on curated datasets. Transfer learning accelerated training. Both architectures suffered from small sample diversity and controlled background assumptions. Future work requires multi-spectral sensor integration.",
    },
  ];

  console.log("--- 1. Running Agent 2 on test cohort ---");
  const agent2Result = await runPaperAnalysisAgent(papers);
  console.log(`Agent 2 completed ${agent2Result.analyses.length} analyses.`);

  console.log("\n--- 2. Running Agent 3 (Cross-Paper Reasoning) ---");
  const agent3Result = await runResearchGapTrendAgent(
    agent2Result.analyses,
    "AI-based crop disease detection"
  );

  console.log(`✓ Total Papers Analyzed:`, agent3Result.totalPapersAnalyzed);
  console.log(`✓ Trends Detected:`, agent3Result.trends.length);
  agent3Result.trends.forEach((t, i) => {
    console.log(`  [Trend ${i + 1}] (${t.category}): ${t.trendDescription.slice(0, 100)}... (Confidence: ${t.confidence}%)`);
  });

  console.log(`✓ Method Comparisons:`, agent3Result.methodComparisons.length);
  console.log(`✓ Agreements Detected:`, agent3Result.agreements.length);
  agent3Result.agreements.forEach((a, i) => {
    console.log(`  [Agreement ${i + 1}]: ${a.claim.slice(0, 90)}... (Papers: ${a.supportingPaperIds.length})`);
  });

  console.log(`✓ Contradictions Detected:`, agent3Result.contradictions.length);
  agent3Result.contradictions.forEach((c, i) => {
    console.log(`  [Contradiction ${i + 1}]: ${c.topic} (Reasons: ${c.possibleReasons.length})`);
  });

  console.log(`✓ Potential Research Gaps Detected:`, agent3Result.potentialGaps.length);
  agent3Result.potentialGaps.forEach((g, i) => {
    console.log(`  [Gap ${i + 1}] "${g.title}"`);
    console.log(`    - Confidence: ${g.confidence}% (Evidence Strength: ${g.evidenceStrength})`);
    console.log(`    - Supporting Papers: ${g.supportingPaperCount}/${g.qualifyingPaperCount}`);
    console.log(`    - Why it matters: ${g.whyItMatters.slice(0, 80)}...`);
    console.log(`    - Direction: ${g.potentialResearchDirection.slice(0, 80)}...`);
  });

  // Assertions
  if (agent3Result.trends.length === 0) throw new Error("Expected at least 1 trend");
  if (agent3Result.agreements.length === 0) throw new Error("Expected at least 1 agreement finding");
  if (agent3Result.potentialGaps.length === 0) throw new Error("Expected at least 1 research gap");

  console.log("\n============================================================");
  console.log("  AGENT 3 VERIFICATION: ALL CHECKS PASSED SUCCESSFULLY!");
  console.log("============================================================\n");
}

testAgent3().catch((err) => {
  console.error("Agent 3 Verification Failed:", err);
  process.exit(1);
});
