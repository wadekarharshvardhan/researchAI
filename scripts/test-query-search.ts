/**
 * Test script for the Query & Search Agent (Agent 1).
 *
 * Tests:
 * 1. OpenAlex tool in isolation
 * 2. Deduplication utility
 * 3. Full agent with a real query
 *
 * Run with: npx tsx scripts/test-query-search.ts
 * Requires: OPENAI_API_KEY environment variable
 */

/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */

// ─── Path alias resolution for tsx (outside Next.js) ──────────────────────
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import type { ResearchPaper } from "../src/types/research-paper";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, "..", "src");

/** Convert an absolute file path to a file:// URL string (required on Windows for ESM dynamic imports) */
function toFileUrl(filePath: string): string {
  return pathToFileURL(filePath).href;
}

// We need to use dynamic imports with full paths since tsx doesn't support
// Next.js path aliases (@/...) out of the box

// ─── Helpers ──────────────────────────────────────────────────────────────

function log(header: string, data?: unknown) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`  ${header}`);
  console.log("=".repeat(60));
  if (data !== undefined) {
    console.log(
      typeof data === "string" ? data : JSON.stringify(data, null, 2)
    );
  }
}

function logPapers(papers: any[]) {
  if (papers.length === 0) {
    console.log("  (no papers returned)");
    return;
  }
  for (const [i, p] of papers.entries()) {
    console.log(`\n  [${i + 1}] ${p.title}`);
    console.log(`      Authors: ${p.authors?.slice(0, 3).join(", ") || "N/A"}`);
    console.log(`      Year: ${p.year ?? "N/A"}`);
    console.log(`      DOI: ${p.doi ?? "N/A"}`);
    console.log(`      Citations: ${p.citationCount}`);
    console.log(`      Open Access: ${p.isOpenAccess}`);
    console.log(`      Source: ${p.source}`);
    console.log(
      `      Abstract: ${p.abstract ? p.abstract.slice(0, 120) + "..." : "N/A"}`
    );
    console.log(`      URL: ${p.url ?? "N/A"}`);
    console.log(`      PDF: ${p.pdfUrl ?? "N/A"}`);
  }
}

// ─── Test 1: OpenAlex tool in isolation ───────────────────────────────────

async function testOpenAlexTool() {
  log("TEST 1: OpenAlex Tool — Direct Call");

  // Dynamic import to work around path aliases
  const { searchOpenAlex } = await import(
    toFileUrl(path.join(srcDir, "tools", "openalex.ts"))
  );

  console.log('\n  Query: "AI-based crop disease detection"');
  console.log("  yearFrom: 2023, limit: 5\n");

  const result = await searchOpenAlex.execute(
    { query: "AI-based crop disease detection", yearFrom: 2023, limit: 5 },
    { toolCallId: "test-1", messages: [], abortSignal: undefined as any }
  );

  console.log(`  Total results available: ${result.totalResults}`);
  console.log(`  Papers returned: ${result.papers.length}`);
  console.log(`  Error: ${result.error ?? "none"}`);
  logPapers(result.papers);

  // Assertions
  if (result.papers.length === 0 && !result.error) {
    console.error("\n  ❌ FAIL: No papers returned and no error reported");
    return false;
  }
  if (result.error) {
    console.error(`\n  ⚠️  WARNING: API error: ${result.error}`);
    return false;
  }

  // Verify paper structure
  for (const paper of result.papers) {
    if (!paper.id || !paper.title || paper.source !== "OpenAlex") {
      console.error("\n  ❌ FAIL: Paper has missing required fields");
      return false;
    }
  }

  console.log("\n  ✅ PASS: OpenAlex tool returns valid papers");
  return true;
}

// ─── Test 2: Deduplication ────────────────────────────────────────────────

async function testDeduplication() {
  log("TEST 2: Deduplication Utility");

  const { deduplicatePapers } = await import(
    toFileUrl(path.join(srcDir, "utils", "deduplication.ts"))
  );

  const papers = [
    {
      id: "1",
      title: "Deep Learning for Crop Disease Detection",
      authors: ["Author A"],
      abstract: "A study on deep learning.",
      year: 2023,
      doi: "10.1234/test001",
      citationCount: 10,
      url: "https://example.com/1",
      pdfUrl: null,
      isOpenAccess: true,
      source: "OpenAlex",
    },
    {
      // Same DOI — should be deduplicated
      id: "2",
      title: "Deep Learning for Crop Disease Detection — Extended",
      authors: ["Author A", "Author B"],
      abstract: "A study on deep learning with more detail.",
      year: 2023,
      doi: "10.1234/test001",
      citationCount: 15,
      url: "https://example.com/2",
      pdfUrl: "https://example.com/2.pdf",
      isOpenAccess: true,
      source: "SemanticScholar",
    },
    {
      // Same title (after normalization) — should be deduplicated
      id: "3",
      title: "deep learning for crop disease detection",
      authors: ["Author A"],
      abstract: null,
      year: 2023,
      doi: null,
      citationCount: 5,
      url: null,
      pdfUrl: null,
      isOpenAccess: false,
      source: "Crossref",
    },
    {
      // Unique paper — should be kept
      id: "4",
      title: "Transformer Models in Agriculture",
      authors: ["Author C"],
      abstract: "Transformers for agriculture.",
      year: 2024,
      doi: "10.1234/test002",
      citationCount: 3,
      url: "https://example.com/4",
      pdfUrl: null,
      isOpenAccess: true,
      source: "OpenAlex",
    },
  ];

  const deduped = deduplicatePapers(papers);

  console.log(`  Input papers: ${papers.length}`);
  console.log(`  Deduplicated papers: ${deduped.length}`);

  for (const p of deduped) {
    console.log(`    - "${p.title}" (DOI: ${p.doi ?? "N/A"}, source: ${p.source})`);
  }

  if (deduped.length !== 2) {
    console.error(
      `\n  ❌ FAIL: Expected 2 papers after dedup, got ${deduped.length}`
    );
    return false;
  }

  // The kept entry for the duplicate should be the richer one (paper 2)
  const keptDup = deduped.find((p: ResearchPaper) => p.doi === "10.1234/test001");
  if (!keptDup) {
    console.error("\n  ❌ FAIL: DOI-matched paper not found in results");
    return false;
  }
  if (keptDup.pdfUrl !== "https://example.com/2.pdf") {
    console.error("\n  ❌ FAIL: Richer metadata entry was not preserved");
    return false;
  }

  console.log("\n  ✅ PASS: Deduplication works correctly");
  return true;
}

// ─── Test 3: Empty result ─────────────────────────────────────────────────

async function testEmptyResult() {
  log("TEST 3: OpenAlex Tool — Query With Unlikely Results");

  const { searchOpenAlex } = await import(
    toFileUrl(path.join(srcDir, "tools", "openalex.ts"))
  );

  const result = await searchOpenAlex.execute(
    { query: "xyznonexistentresearchtopic12345abcdef", limit: 5 },
    { toolCallId: "test-3", messages: [], abortSignal: undefined as any }
  );

  console.log(`  Papers returned: ${result.papers.length}`);
  console.log(`  Error: ${result.error ?? "none"}`);

  if (result.papers.length === 0) {
    console.log("\n  ✅ PASS: Empty result handled gracefully");
  } else {
    console.log(
      `\n  ⚠️  NOTE: Got ${result.papers.length} results for junk query (API may be lenient)`
    );
  }
  return true;
}

// ─── Test 4: Full agent (requires OPENAI_API_KEY) ─────────────────────────

async function testFullAgent() {
  log("TEST 4: Full Query & Search Agent");

  if (!process.env.OPENAI_API_KEY) {
    console.log(
      "\n  ⏭️  SKIP: OPENAI_API_KEY not set. Set it to run the full agent test."
    );
    console.log("  Example: $env:OPENAI_API_KEY='sk-...'");
    return true; // Not a failure
  }

  const { runQuerySearchAgent } = await import(
    toFileUrl(path.join(srcDir, "agents", "query-search.ts"))
  );

  console.log('\n  Query: "AI-based crop disease detection"');
  console.log("  yearFrom: 2023, limit: 5\n");

  const result = await runQuerySearchAgent(
    "Analyze recent research on AI-based crop disease detection",
    { yearFrom: 2023, limit: 5 }
  );

  console.log(`  Original query: ${result.query}`);
  console.log(`  Search queries generated: ${result.searchQueries.length}`);
  for (const q of result.searchQueries) {
    console.log(`    - "${q}"`);
  }
  console.log(`  Papers found: ${result.papers.length}`);
  if (result.errors && result.errors.length > 0) {
    console.log(`  Errors: ${result.errors.join(", ")}`);
  }

  logPapers(result.papers);

  if (result.papers.length === 0) {
    console.error(
      "\n  ❌ FAIL: No papers returned from full agent"
    );
    return false;
  }

  // Verify all papers have required fields
  for (const paper of result.papers) {
    if (!paper.id || !paper.title || !paper.source) {
      console.error("\n  ❌ FAIL: Paper missing required fields");
      return false;
    }
  }

  console.log("\n  ✅ PASS: Full agent returns valid papers");
  return true;
}

// ─── Main ─────────────────────────────────────────────────────────────────

async function main() {
  log("RESEARCHAI — Agent 1 Test Suite");
  console.log("  Testing Query & Search Agent components\n");

  const results: { name: string; passed: boolean }[] = [];

  // Test 1: OpenAlex tool
  try {
    results.push({ name: "OpenAlex Tool", passed: await testOpenAlexTool() });
  } catch (err) {
    console.error(`  ❌ ERROR: ${err}`);
    results.push({ name: "OpenAlex Tool", passed: false });
  }

  // Test 2: Deduplication
  try {
    results.push({
      name: "Deduplication",
      passed: await testDeduplication(),
    });
  } catch (err) {
    console.error(`  ❌ ERROR: ${err}`);
    results.push({ name: "Deduplication", passed: false });
  }

  // Test 3: Empty result
  try {
    results.push({
      name: "Empty Result",
      passed: await testEmptyResult(),
    });
  } catch (err) {
    console.error(`  ❌ ERROR: ${err}`);
    results.push({ name: "Empty Result", passed: false });
  }

  // Test 4: Full agent
  try {
    results.push({
      name: "Full Agent",
      passed: await testFullAgent(),
    });
  } catch (err) {
    console.error(`  ❌ ERROR: ${err}`);
    results.push({ name: "Full Agent", passed: false });
  }

  // Summary
  log("TEST SUMMARY");
  for (const r of results) {
    console.log(`  ${r.passed ? "✅" : "❌"} ${r.name}`);
  }

  const allPassed = results.every((r) => r.passed);
  console.log(
    `\n  ${allPassed ? "✅ ALL TESTS PASSED" : "❌ SOME TESTS FAILED"}`
  );
  process.exit(allPassed ? 0 : 1);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
