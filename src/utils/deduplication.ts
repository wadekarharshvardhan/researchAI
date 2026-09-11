import { ResearchPaper } from "@/types/research-paper";

/**
 * Normalize a title for comparison purposes.
 * - lowercase
 * - trim whitespace
 * - collapse multiple spaces
 * - remove punctuation that doesn't affect identity
 */
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, " ")
    .replace(/[^\w\s]/g, "");
}

/**
 * Choose the "richer" of two duplicate papers.
 * Prefers the entry with more non-null fields filled in.
 */
function pickRicher(a: ResearchPaper, b: ResearchPaper): ResearchPaper {
  const score = (p: ResearchPaper): number => {
    let s = 0;
    if (p.abstract) s++;
    if (p.doi) s++;
    if (p.url) s++;
    if (p.pdfUrl) s++;
    if (p.year !== null) s++;
    if (p.authors.length > 0) s++;
    s += p.citationCount > 0 ? 1 : 0;
    return s;
  };
  return score(a) >= score(b) ? a : b;
}

/**
 * Remove duplicate papers from a list.
 *
 * Deduplication priority:
 * 1. DOI — two papers with the same non-null DOI are duplicates
 * 2. Normalized title — exact match after normalization
 *
 * When duplicates are found, the entry with richer metadata is kept.
 */
export function deduplicatePapers(papers: ResearchPaper[]): ResearchPaper[] {
  const doiMap = new Map<string, number>();
  const titleMap = new Map<string, number>();
  const result: ResearchPaper[] = [];

  for (const paper of papers) {
    const normalizedDoi = paper.doi?.toLowerCase().trim() ?? null;
    const normalizedTitle = normalizeTitle(paper.title);

    // Check DOI duplicate
    if (normalizedDoi) {
      const existingIdx = doiMap.get(normalizedDoi);
      if (existingIdx !== undefined) {
        // Replace with richer entry if needed
        result[existingIdx] = pickRicher(result[existingIdx], paper);
        continue;
      }
    }

    // Check title duplicate
    if (normalizedTitle) {
      const existingIdx = titleMap.get(normalizedTitle);
      if (existingIdx !== undefined) {
        result[existingIdx] = pickRicher(result[existingIdx], paper);
        // If the new paper has a DOI and the old didn't track it, register it
        if (normalizedDoi) {
          doiMap.set(normalizedDoi, existingIdx);
        }
        continue;
      }
    }

    // No duplicate found — add new entry
    const idx = result.length;
    result.push(paper);

    if (normalizedDoi) {
      doiMap.set(normalizedDoi, idx);
    }
    if (normalizedTitle) {
      titleMap.set(normalizedTitle, idx);
    }
  }

  return result;
}
