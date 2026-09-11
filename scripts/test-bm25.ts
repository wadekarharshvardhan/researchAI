/**
 * Verification test script for BM25 Ranking Engine.
 *
 * Tests:
 * 1. Tokenization and stop-word filtering
 * 2. Multi-field weighting (Title vs Abstract)
 * 3. IDF discrimination
 * 4. Chunk ranking for RAG
 * 5. Live paper ranking
 */

import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import type { ResearchPaper, PaperChunk } from "../src/types/research-paper";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, "..", "src");

function toFileUrl(filePath: string): string {
  return pathToFileURL(filePath).href;
}

async function runTests() {
  console.log("============================================================");
  console.log("  TESTING BM25 PROBABILISTIC RANKING ENGINE");
  console.log("============================================================\n");

  const {
    tokenizeAndFilter,
    rankPapersWithBM25,
    rankChunksWithBM25,
  } = await import(toFileUrl(path.join(srcDir, "utils", "bm25.ts")));

  // 1. Test Tokenization and Stopword Filtering
  console.log("--- 1. Testing Tokenization & Filtering ---");
  const rawQuery = "A novel deep learning approach for early crop disease detection in agriculture!";
  const tokens = tokenizeAndFilter(rawQuery);
  console.log("Raw Query:", rawQuery);
  console.log("Processed Tokens:", tokens);

  // Expect stop words like 'a', 'for', 'in' and generic words like 'approach' to be removed
  const containsStopwords = tokens.some((t: string) => ["a", "for", "in", "approach"].includes(t));
  const hasStemmedDetection = tokens.includes("detect") || tokens.includes("detection");
  console.log("Stopwords filtered properly?", !containsStopwords);
  console.log("Key domain terms retained?", hasStemmedDetection && tokens.includes("crop"));

  if (containsStopwords || !tokens.includes("crop")) {
    throw new Error("Tokenization failed");
  }

  // 2. Test Multi-Field Weighting (Title vs Abstract)
  console.log("\n--- 2. Testing Multi-Field Weighting (Title Boost) ---");
  const query = "apple scab disease";

  const paperA: ResearchPaper = {
    id: "paper-A",
    title: "Deep Learning Detection of Apple Scab Disease", // direct title match (3x weight)
    authors: ["Author 1"],
    abstract: "This paper studies general plant pathologies and agricultural challenges.",
    year: 2024,
    doi: "10.1001/a",
    citationCount: 10,
    url: null,
    pdfUrl: null,
    isOpenAccess: true,
    source: "OpenAlex",
  };

  const paperB: ResearchPaper = {
    id: "paper-B",
    title: "General Agricultural Vision Systems", // generic title
    authors: ["Author 2"],
    abstract: "In our benchmark dataset we tested apple scab disease alongside other common orchard infections.", // only abstract mention
    year: 2024,
    doi: "10.1001/b",
    citationCount: 200,
    url: null,
    pdfUrl: null,
    isOpenAccess: true,
    source: "OpenAlex",
  };

  const ranked = rankPapersWithBM25([paperB, paperA], query);
  console.log("Rank 1:", ranked[0].id, `(${ranked[0].title}) - Score:`, ranked[0].relevanceScore);
  console.log("Rank 2:", ranked[1].id, `(${ranked[1].title}) - Score:`, ranked[1].relevanceScore);

  if (ranked[0].id !== "paper-A") {
    throw new Error("Expected Paper A (title match) to rank higher than Paper B (abstract mention)");
  }
  console.log("Title boost verified successfully: Paper A scored higher than Paper B.");

  // 3. Test Chunk Ranking for RAG
  console.log("\n--- 3. Testing Chunk Ranking for RAG (rankChunksWithBM25) ---");
  const chunks: PaperChunk[] = [
    {
      chunkIndex: 0,
      text: "Introduction to general neural network architectures including multi-layer perceptrons.",
      metadata: { paperId: "p1", paperTitle: "Neural Networks", source: "OpenAlex" },
    },
    {
      chunkIndex: 1,
      text: "Attention mechanisms compute soft alignments between queries and keys in self-attention layers.",
      metadata: { paperId: "p2", paperTitle: "Attention Is All You Need", source: "OpenAlex" },
    },
    {
      chunkIndex: 2,
      text: "We evaluate inference latency and throughput on GPU clusters for transformer models.",
      metadata: { paperId: "p3", paperTitle: "Transformer Benchmarking", source: "OpenAlex" },
    },
  ];

  const chunkQuery = "self-attention mechanism query key";
  const rankedChunks = rankChunksWithBM25(chunks, chunkQuery);

  console.log("Top Chunk:", rankedChunks[0].text);
  console.log("Top Chunk Score:", rankedChunks[0].relevanceScore);

  if (rankedChunks[0].chunkIndex !== 1) {
    throw new Error("Expected chunk 1 (direct match for self-attention) to rank #1");
  }
  console.log("Chunk RAG ranking verified successfully.");

  // 4. Test Live Endpoint with BM25 Relevance Sort
  console.log("\n--- 4. Testing Live API with sortBy: 'relevance' ---");
  const res = await fetch("http://localhost:3000/api/test/openalex", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "CRISPR-Cas9 gene editing",
      limit: 4,
      sortBy: "relevance",
    }),
  });

  const data = await res.json();
  console.log(`API returned ${data.papers?.length} papers sorted by relevance.`);
  for (const [i, p] of data.papers.entries()) {
    console.log(`  [${i + 1}] Score: ${p.relevanceScore ?? "N/A"} — ${p.title}`);
  }

  const isSorted = data.papers.every(
    (p: any, idx: number, arr: any[]) =>
      idx === 0 || (arr[idx - 1].relevanceScore ?? 0) >= (p.relevanceScore ?? 0)
  );

  console.log("Papers sorted by BM25 relevance score descending?", isSorted);
  if (!isSorted) {
    throw new Error("Papers are not sorted by BM25 relevance score");
  }

  console.log("\n✅ ALL BM25 TESTS PASSED SUCCESSFULLY!");
}

runTests().catch((err) => {
  console.error("❌ TEST FAILED:", err);
  process.exit(1);
});
