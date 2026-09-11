import { tool } from "ai";
import { z } from "zod";
import { ResearchPaper } from "@/types/research-paper";
import { cleanExtractedText, extractTextFromPdfBuffer } from "./extract-text";
import { chunkPaper } from "./chunk-paper";

export interface RetrievalOptions {
  /** Maximum time in milliseconds to wait for a PDF download (default: 8000ms) */
  timeoutMs?: number;

  /** Maximum allowed file size in bytes (default: 15MB) */
  maxBytes?: number;

  /** Maximum number of concurrent downloads (default: 3) */
  concurrency?: number;
}

const DEFAULT_TIMEOUT_MS = 8000;
const DEFAULT_MAX_BYTES = 15 * 1024 * 1024; // 15MB

/**
 * Check if a URL appears to be an accessible open-access document.
 */
function isAccessibleOpenAccess(paper: ResearchPaper): boolean {
  if (!paper.pdfUrl) return false;

  // If flagged as open access by source
  if (paper.isOpenAccess) return true;

  // Check known open access domains (arXiv, bioRxiv, medRxiv, PMC, unpaywall, etc.)
  const url = paper.pdfUrl.toLowerCase();
  const openDomains = [
    "arxiv.org",
    "biorxiv.org",
    "medrxiv.org",
    "ncbi.nlm.nih.gov/pmc",
    "europepmc.org",
    "frontiersin.org",
    "mdpi.com",
    "plos.org",
    "nature.com/articles/s41598",
  ];

  return openDomains.some((domain) => url.includes(domain));
}

/**
 * Retrieve, clean, and chunk a single paper's content with robust fallback.
 *
 * Rules:
 * 1. Checks for legally accessible full text (Open Access / open preprint repositories).
 * 2. If accessible, downloads and extracts full text.
 * 3. If inaccessible or download fails, falls back to abstract ("abstract_only").
 * 4. If abstract is missing, marks as "metadata_only".
 * 5. Prepares clean chunks with attached metadata.
 * 6. Never throws: records non-fatal error on paper.retrievalError and continues.
 */
export async function retrieveSinglePaper(
  paper: ResearchPaper,
  options?: RetrievalOptions
): Promise<ResearchPaper> {
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxBytes = options?.maxBytes ?? DEFAULT_MAX_BYTES;

  const result: ResearchPaper = { ...paper };

  // 1. Try full-text retrieval if accessible
  if (isAccessibleOpenAccess(paper) && paper.pdfUrl) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(paper.pdfUrl, {
        signal: controller.signal,
        headers: {
          Accept: "application/pdf, application/octet-stream, text/plain",
          "User-Agent": "ResearchAI-Discovery-Agent/1.0 (academic-research-assistant; mailto:researchai@example.com)",
        },
      });

      if (response.ok) {
        // Enforce maximum file size
        const contentLength = response.headers.get("content-length");
        if (contentLength && parseInt(contentLength) > maxBytes) {
          throw new Error(`Document exceeds size limit of ${maxBytes / 1024 / 1024}MB`);
        }

        const arrayBuffer = await response.arrayBuffer();
        if (arrayBuffer.byteLength > maxBytes) {
          throw new Error(`Downloaded document exceeds size limit`);
        }

        const buffer = Buffer.from(arrayBuffer);
        const extractedText = extractTextFromPdfBuffer(buffer);

        // If sufficient text was extracted (at least 300 characters)
        if (extractedText && extractedText.length >= 300) {
          result.contentStatus = "full_text";
          result.text = extractedText;
          result.chunks = chunkPaper(result, extractedText, false);
          return result;
        } else {
          // Document had minimal extractable text (e.g. scanned image without OCR)
          result.retrievalError = "PDF contained insufficient text stream";
        }
      } else {
        result.retrievalError = `HTTP ${response.status} from document host`;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Document fetch failed";
      result.retrievalError = message;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // 2. Fallback to abstract if available
  if (paper.abstract && paper.abstract.trim().length > 0) {
    const cleanedAbstract = cleanExtractedText(paper.abstract);
    result.contentStatus = "abstract_only";
    result.text = cleanedAbstract;
    result.chunks = chunkPaper(result, cleanedAbstract, true);
    return result;
  }

  // 3. Fallback to metadata only
  result.contentStatus = "metadata_only";
  result.text = undefined;
  result.chunks = [];
  return result;
}

/**
 * Retrieve content and generate chunks for a corpus of papers concurrently.
 *
 * Implements concurrency throttling so server and network are not overloaded.
 */
export async function retrievePaperCorpus(
  papers: ResearchPaper[],
  options?: RetrievalOptions
): Promise<ResearchPaper[]> {
  if (!papers || papers.length === 0) return [];

  const concurrency = options?.concurrency ?? 3;
  const results: ResearchPaper[] = new Array(papers.length);

  for (let i = 0; i < papers.length; i += concurrency) {
    const batch = papers.slice(i, i + concurrency);
    const batchPromises = batch.map((paper) => retrieveSinglePaper(paper, options));
    const settled = await Promise.allSettled(batchPromises);

    settled.forEach((res, batchIdx) => {
      const originalIdx = i + batchIdx;
      if (res.status === "fulfilled") {
        results[originalIdx] = res.value;
      } else {
        // In the rare case of unhandled rejection, gracefully fallback
        const originalPaper = papers[originalIdx];
        const hasAbstract = !!originalPaper.abstract?.trim();
        results[originalIdx] = {
          ...originalPaper,
          contentStatus: hasAbstract ? "abstract_only" : "metadata_only",
          text: hasAbstract ? cleanExtractedText(originalPaper.abstract!) : undefined,
          chunks: hasAbstract
            ? chunkPaper(originalPaper, cleanExtractedText(originalPaper.abstract!), true)
            : [],
          retrievalError: res.reason?.message || "Retrieval failed unexpectedly",
        };
      }
    });
  }

  return results;
}

/**
 * AI SDK tool for retrieving paper content.
 *
 * Allows the LLM agent to explicitly trigger full-text/abstract retrieval and chunking
 * for candidate papers discovered during search.
 */
export const retrievePaperTool = tool({
  description:
    "Retrieve accessible paper content (full text or abstract), extract clean text, " +
    "and divide into semantic chunks for vector indexing and RAG.",
  inputSchema: z.object({
    paperId: z.string().describe("The unique ID of the paper to retrieve"),
    title: z.string().describe("Title of the paper"),
    abstract: z.string().nullable().optional().describe("Abstract of the paper"),
    pdfUrl: z.string().nullable().optional().describe("Direct URL to PDF if available"),
    isOpenAccess: z.boolean().optional().default(false).describe("Whether the paper is open access"),
  }),
  execute: async ({ paperId, title, abstract, pdfUrl, isOpenAccess }) => {
    const stubPaper: ResearchPaper = {
      id: paperId,
      title,
      authors: [],
      abstract: abstract ?? null,
      year: null,
      doi: null,
      citationCount: 0,
      url: null,
      pdfUrl: pdfUrl ?? null,
      isOpenAccess: isOpenAccess ?? false,
      source: "OpenAlex",
    };

    const retrieved = await retrieveSinglePaper(stubPaper);
    return {
      paperId: retrieved.id,
      contentStatus: retrieved.contentStatus,
      chunksCount: retrieved.chunks?.length ?? 0,
      error: retrieved.retrievalError ?? null,
    };
  },
});
