/**
 * Verification test script for Agent 1 (Research Discovery Agent)
 * testing Search + Paper Retrieval + Text Cleaning + Chunking + RAG Preparation.
 */

import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, "..", "src");

function toFileUrl(filePath: string): string {
  return pathToFileURL(filePath).href;
}

async function runTests() {
  console.log("============================================================");
  console.log("  TESTING EXTENDED AGENT 1 (RESEARCH DISCOVERY AGENT)");
  console.log("============================================================\n");

  // 1. Test Text Cleaning
  console.log("--- 1. Testing Text Cleaning (cleanExtractedText) ---");
  const { cleanExtractedText } = await import(toFileUrl(path.join(srcDir, "tools", "extract-text.ts")));

  const dirtyText = `
    Deep learning models have shown   remarkable promise in plant pathology.
    Page 1 of 12
    The archi-
    tecture was trained on 50,000 leaf images.
    
    12
    
    --- Page 2 ---
    Results demonstrate a 98.5% detection accuracy across 14 crop species.
  `;

  const cleaned = cleanExtractedText(dirtyText);
  console.log("Cleaned Text:\n" + cleaned);

  const mergedHyphen = cleaned.includes("architecture");
  const removedPageNum = !cleaned.includes("Page 1 of 12") && !cleaned.includes("--- Page 2 ---");
  console.log(`Hyphenation merged correctly ("architecture"):`, mergedHyphen);
  console.log("Page numbers removed correctly:", removedPageNum);

  if (!mergedHyphen || !removedPageNum) {
    throw new Error("Text cleaning assertions failed");
  }

  // 2. Test Chunking Utility
  console.log("\n--- 2. Testing Chunking Utility (chunkPaper) ---");
  const { chunkPaper } = await import(toFileUrl(path.join(srcDir, "tools", "chunk-paper.ts")));

  const samplePaper = {
    id: "https://openalex.org/W12345678",
    title: "AI-based crop disease detection using convolutional networks",
    authors: ["Jane Doe", "John Smith"],
    abstract: "Convolutional neural networks were deployed on edge devices to diagnose apple scab and tomato blight in real-time.",
    year: 2024,
    doi: "10.1000/182",
    citationCount: 42,
    url: "https://doi.org/10.1000/182",
    pdfUrl: "https://example.com/paper.pdf",
    isOpenAccess: true,
    source: "OpenAlex",
  };

  const longText = `
    Abstract: Convolutional neural networks were deployed on edge devices to diagnose apple scab and tomato blight in real-time with high efficiency.
    
    1. Introduction
    Crop diseases cause substantial losses in agricultural productivity worldwide, threatening food security and livelihoods. Traditional diagnosis relies on visual inspection by agricultural experts, which is labor-intensive, slow, and unavailable in remote rural regions. Rapid advancements in computer vision offer automated, scalable solutions.
    
    2. Methodology
    We constructed a dataset of 54,306 images spanning 14 crop species and 26 diseases. We fine-tuned ResNet-50 and EfficientNet architectures using transfer learning and data augmentation. Models were quantized to INT8 precision for edge deployment on mobile smartphones.
    
    3. Results and Discussion
    The proposed model achieved 98.5% classification accuracy on unseen field test sets. Inference latency was 28 milliseconds per image on standard mobile hardware. The system provides immediate disease diagnoses and treatment recommendations.
  `;

  const chunks = chunkPaper(samplePaper, longText, false, { chunkSize: 300, chunkOverlap: 60 });
  console.log(`Generated ${chunks.length} chunks from paper.`);
  console.log("Chunk 0 sample:", {
    chunkIndex: chunks[0].chunkIndex,
    tokenCount: chunks[0].tokenCount,
    textSlice: chunks[0].text.slice(0, 80) + "...",
    metadata: chunks[0].metadata,
  });

  if (chunks.length < 2) {
    throw new Error("Expected text to be chunked into multiple pieces");
  }
  if (chunks[0].metadata.paperId !== samplePaper.id || chunks[0].metadata.year !== 2024) {
    throw new Error("Chunk metadata mismatch");
  }

  // 3. Test Paper Retrieval Tool with Fallback & Error Handling
  console.log("\n--- 3. Testing Single Paper Retrieval & Fallback (retrieveSinglePaper) ---");
  const { retrieveSinglePaper, retrievePaperCorpus } = await import(toFileUrl(path.join(srcDir, "tools", "retrieve-paper.ts")));

  // Test abstract fallback when no accessible PDF
  const paperWithAbstract = {
    ...samplePaper,
    pdfUrl: null,
    isOpenAccess: false,
  };

  const retrievedAbstract = await retrieveSinglePaper(paperWithAbstract);
  console.log("Retrieved Status (No PDF):", retrievedAbstract.contentStatus);
  console.log(`Generated Chunks:`, retrievedAbstract.chunks?.length);
  if (retrievedAbstract.contentStatus !== "abstract_only" || (retrievedAbstract.chunks?.length ?? 0) === 0) {
    throw new Error("Expected abstract_only fallback");
  }

  // Test metadata-only fallback when no abstract and no PDF
  const paperMetadataOnly = {
    ...samplePaper,
    abstract: null,
    pdfUrl: null,
    isOpenAccess: false,
  };
  const retrievedMetadata = await retrieveSinglePaper(paperMetadataOnly);
  console.log("Retrieved Status (No Abstract, No PDF):", retrievedMetadata.contentStatus);
  if (retrievedMetadata.contentStatus !== "metadata_only") {
    throw new Error("Expected metadata_only status");
  }

  // Test resilient failure handling (simulating dead or paywalled URL)
  const deadUrlPaper = {
    ...samplePaper,
    pdfUrl: "https://invalid-non-existent-domain-12345.org/paper.pdf",
    isOpenAccess: true,
  };
  const deadResult = await retrieveSinglePaper(deadUrlPaper, { timeoutMs: 2000 });
  console.log("Dead URL Paper Status (Fell back to abstract):", deadResult.contentStatus);
  console.log("Recorded Non-Fatal Retrieval Error:", deadResult.retrievalError);
  if (deadResult.contentStatus !== "abstract_only" || !deadResult.retrievalError) {
    throw new Error("Expected graceful fallback to abstract with recorded error");
  }

  // 4. Test Live Academic Search & Retrieval with OpenAlex
  console.log("\n--- 4. Testing Live Search + Retrieval Corpus (retrievePaperCorpus) ---");
  const { searchOpenAlexDirect } = await import(toFileUrl(path.join(srcDir, "tools", "openalex.ts")));
  const searchResults = await searchOpenAlexDirect({
    query: "AI-based crop disease detection",
    limit: 4,
    sortBy: "latest",
  });

  console.log(`Search returned ${searchResults.papers.length} papers from OpenAlex.`);
  
  const corpus = await retrievePaperCorpus(searchResults.papers, { timeoutMs: 4000 });
  console.log(`Corpus prepared: ${corpus.length} papers.`);

  let fullTextCount = 0;
  let abstractCount = 0;
  let metaCount = 0;
  let totalChunks = 0;

  for (const [i, p] of corpus.entries()) {
    console.log(`\n  [Paper ${i + 1}] ${p.title}`);
    console.log(`    Year: ${p.year}, OA: ${p.isOpenAccess}, Status: ${p.contentStatus}`);
    console.log(`    Chunks: ${p.chunks?.length ?? 0}, Text Length: ${p.text?.length ?? 0}`);
    if (p.retrievalError) console.log(`    Note: ${p.retrievalError}`);

    if (p.contentStatus === "full_text") fullTextCount++;
    else if (p.contentStatus === "abstract_only") abstractCount++;
    else metaCount++;

    totalChunks += p.chunks?.length ?? 0;
  }

  console.log("\n--- Summary ---");
  console.log({
    totalPapers: corpus.length,
    fullTextCount,
    abstractCount,
    metaCount,
    totalChunks,
  });

  console.log("\n✅ ALL TESTS PASSED SUCCESSFULLY!");
}

runTests().catch((err) => {
  console.error("❌ TEST FAILED:", err);
  process.exit(1);
});
