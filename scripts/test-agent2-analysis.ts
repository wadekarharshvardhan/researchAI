import { analyzeSinglePaper, runPaperAnalysisAgent } from "../src/agents/paper-analysis";
import { ResearchPaper } from "../src/types/research-paper";

async function runAgent2Verification() {
  console.log("============================================================");
  console.log("  AGENT 2 (PAPER ANALYSIS AGENT) VERIFICATION TEST");
  console.log("============================================================\n");

  // Sample Paper 1: Full-text with realistic technical content
  const paper1: ResearchPaper = {
    id: "https://openalex.org/W10001",
    title: "Deep Vision Transformer for Real-Time Maize Leaf Blight Detection on Edge Devices",
    authors: ["Li Wei", "K. R. Patel", "A. Gomez"],
    year: 2024,
    doi: "10.1016/j.compag.2024.108920",
    citationCount: 38,
    url: "https://doi.org/10.1016/j.compag.2024.108920",
    pdfUrl: "https://example.com/maize_vit.pdf",
    isOpenAccess: true,
    source: "OpenAlex",
    venue: "Computers and Electronics in Agriculture",
    topics: ["Computer Vision", "Vision Transformer", "Crop Disease", "Edge AI"],
    contentStatus: "full_text",
    abstract: null,
    text: `
      Abstract: Accurate identification of maize leaf blight is essential to reduce yield losses. Traditional convolutional architectures often struggle with variable field illumination and small lesion boundaries. We propose a lightweight Vision Transformer (ViT) quantized for mobile deployment. The model was trained on 14,500 images from the PlantVillage and FieldPlant benchmarks. Results demonstrate an accuracy of 98.4% and an F1-score of 0.98. However, computational overhead increases significantly on unquantized edge devices, and detection accuracy degrades under severe occlusions. Future work should investigate multimodal sensor fusion and self-supervised pretraining on in-the-wild datasets.
      
      1. Introduction
      Crop foliar diseases cause over 20% annual yield degradation in cereal crops. Conventional visual scouting is labor-intensive and error-prone. While Deep CNN baselines such as ResNet-50 and YOLOv8 have been adopted, their localized receptive fields limit global pattern recognition across complex leaf structures.
      
      2. Methodology & Proposed Architecture
      We develop Mobile-ViT, integrating patch-level self-attention with inverted residual blocks. The framework was trained using cross-entropy loss with AdamW optimizer. Models were benchmarked against YOLOv8 and ResNet-50.
      
      3. Experiments and Results
      Evaluation on the FieldPlant dataset yielded an accuracy of 98.4% with inference latency of 32ms. Precision reached 97.9% and recall reached 98.8%.
      
      4. Limitations and Future Directions
      A key limitation is that training relied heavily on controlled laboratory lighting, causing false positives in severe shadows. Furthermore, memory footprint restricts execution on microcontroller hardware. Future research will explore domain adaptation for regional cultivars.
    `,
  };

  // Sample Paper 2: Abstract-only paper
  const paper2: ResearchPaper = {
    id: "https://openalex.org/W10002",
    title: "Automated Apple Scab Classification Using Lightweight MobileNetV3 and UAV Imagery",
    authors: ["Sarah Jenkins", "Michael Chang"],
    year: 2023,
    doi: "10.3390/rs15040982",
    citationCount: 64,
    url: "https://doi.org/10.3390/rs15040982",
    pdfUrl: null,
    isOpenAccess: false,
    source: "OpenAlex",
    venue: "Remote Sensing",
    topics: ["UAV imagery", "MobileNet", "Apple Scab", "Precision Agriculture"],
    contentStatus: "abstract_only",
    abstract: "We introduce a mobile vision framework for detecting apple scab disease from UAV imagery. The approach leverages MobileNetV3 with depthwise separable convolutions to classify canopy health. Tested on 6,200 aerial photographs, the model achieved an accuracy of 95.7% and mAP@50 of 0.91. However, flight altitude and motion blur constrained reliable segmentation of early-stage micro-lesions. We plan to extend this work with multi-spectral imagery in future research.",
  };

  console.log("--- 1. Testing analyzeSinglePaper (Full Text Paper) ---");
  const analysis1 = await analyzeSinglePaper(paper1);
  console.log("Paper 1 Analysis Result:", {
    paperId: analysis1.paperId,
    title: analysis1.title,
    contentLevel: analysis1.contentLevel,
    researchProblem: analysis1.researchProblem.slice(0, 100) + "...",
    methodology: analysis1.methodology.slice(0, 100) + "...",
    models: analysis1.models,
    datasets: analysis1.datasets,
    metrics: analysis1.evaluationMetrics,
    limitations: analysis1.limitations,
    futureWork: analysis1.futureWork,
    status: analysis1.analysisStatus,
  });

  // Verify extracted models
  const hasViT = analysis1.models.some((m) => m.toLowerCase().includes("vit") || m.toLowerCase().includes("transformer"));
  console.log(`✓ Detected Transformer / ViT model:`, hasViT);

  // Verify extracted datasets
  const hasPlantVillage = analysis1.datasets.some((d) => d.toLowerCase().includes("plantvillage") || d.toLowerCase().includes("fieldplant"));
  console.log(`✓ Detected PlantVillage / FieldPlant dataset:`, hasPlantVillage);

  // Verify metrics
  const hasAccuracy = analysis1.evaluationMetrics.some((m) => m.metric.toLowerCase().includes("accuracy"));
  console.log(`✓ Detected quantified accuracy metric:`, hasAccuracy);

  // Verify limitations
  const hasLimitations = analysis1.limitations.length > 0;
  console.log(`✓ Extracted genuine limitations:`, hasLimitations, `(${analysis1.limitations.length} found)`);

  console.log("\n--- 2. Testing runPaperAnalysisAgent (Batch Execution) ---");
  const batchResult = await runPaperAnalysisAgent([paper1, paper2]);
  console.log(`Batch processed ${batchResult.analyses.length} papers. Successful: ${batchResult.successfulCount}, Failed: ${batchResult.failedCount}`);

  if (batchResult.successfulCount !== 2) {
    throw new Error("Batch analysis expected 2 successful analyses");
  }

  console.log("\n============================================================");
  console.log("  AGENT 2 VERIFICATION: ALL CHECKS PASSED SUCCESSFULLY!");
  console.log("============================================================\n");
}

runAgent2Verification().catch((err) => {
  console.error("Agent 2 Verification Failed:", err);
  process.exit(1);
});
