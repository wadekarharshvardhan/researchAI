import { PaperChunk, ResearchPaper } from "@/types/research-paper";

export interface BM25Options {
  /** Term frequency saturation parameter (default: 1.5) */
  k1?: number;

  /** Document length normalization parameter (default: 0.75) */
  b?: number;

  /** Weight multiplier for matches in the paper title (default: 3.0) */
  titleWeight?: number;

  /** Weight multiplier for matches in paper topics/keywords (default: 1.8) */
  topicsWeight?: number;

  /** Weight multiplier for matches in the abstract (default: 1.0) */
  abstractWeight?: number;

  /** Optional weight for recency in hybrid scoring [0.0 - 1.0] (default: 0.0, pure BM25) */
  recencyWeight?: number;

  /** Optional weight for citations in hybrid scoring [0.0 - 1.0] (default: 0.0, pure BM25) */
  citationWeight?: number;

  /** Sort direction: "desc" (highest score first, default) or "asc" (lowest score first) */
  sortOrder?: "asc" | "desc";
}

const DEFAULT_K1 = 1.5;
const DEFAULT_B = 0.75;
const DEFAULT_TITLE_WEIGHT = 3.0;
const DEFAULT_TOPICS_WEIGHT = 1.8;
const DEFAULT_ABSTRACT_WEIGHT = 1.0;

/**
 * Common English and academic stop words to filter out during BM25 tokenization.
 */
const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
  "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
  "below", "between", "both", "but", "by", "can", "can't", "cannot", "could",
  "did", "do", "does", "doing", "don't", "down", "during", "each", "few", "for",
  "from", "further", "had", "has", "have", "having", "he", "her", "here", "hers",
  "herself", "him", "himself", "his", "how", "i", "if", "in", "into", "is",
  "isn't", "it", "its", "itself", "let's", "me", "more", "most", "mustn't", "my",
  "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other",
  "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't",
  "she", "should", "so", "some", "such", "than", "that", "the", "their", "theirs",
  "them", "themselves", "then", "there", "these", "they", "this", "those", "through",
  "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "were",
  "weren't", "what", "when", "where", "which", "while", "who", "whom", "why",
  "with", "won't", "would", "you", "your", "yours", "yourself", "yourselves",
  // Common academic filler words that shouldn't distort ranking
  "paper", "study", "approach", "method", "proposed", "using", "used", "based",
  "via", "results", "analysis", "show", "shows", "demonstrates", "presents"
]);

/**
 * Light suffix stemming for matching singular/plural and common verb endings.
 */
function lightStem(word: string): string {
  if (word.length <= 3) return word;

  if (word.endsWith("ies") && word.length > 4) {
    return word.slice(0, -3) + "y";
  }
  if (word.endsWith("sses")) {
    return word.slice(0, -2);
  }
  if (word.endsWith("ing") && word.length > 5) {
    return word.slice(0, -3);
  }
  if (word.endsWith("ed") && word.length > 4) {
    return word.slice(0, -2);
  }
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) {
    return word.slice(0, -1);
  }
  if (word.endsWith("tion") && word.length > 5) {
    return word.slice(0, -3); // e.g. "detection" -> "detect"
  }

  return word;
}

/**
 * Tokenize, lowercase, strip punctuation, remove stop words, and stem text.
 */
export function tokenizeAndFilter(text: string): string[] {
  if (!text || typeof text !== "string") return [];

  const rawTokens = text
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/);

  const tokens: string[] = [];

  for (const token of rawTokens) {
    const clean = token.replace(/^-+|-+$/g, ""); // strip outer hyphens
    if (clean.length >= 2 && !STOP_WORDS.has(clean)) {
      tokens.push(lightStem(clean));
    }
  }

  return tokens;
}

/**
 * Calculate term frequencies within an array of tokens.
 */
function getTermFrequencies(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }
  return tf;
}

/**
 * Compute Robertson-Spärck Jones Inverse Document Frequency (IDF).
 *
 * IDF(q) = ln( 1 + (N - n(q) + 0.5) / (n(q) + 0.5) )
 */
function calculateIdf(docFrequency: number, totalDocs: number): number {
  return Math.log(1 + (totalDocs - docFrequency + 0.5) / (docFrequency + 0.5));
}

/**
 * Compute BM25 term score for a single term in a document field.
 */
function computeTermBm25(
  tf: number,
  docLength: number,
  avgDocLength: number,
  k1: number,
  b: number,
  idf: number
): number {
  if (tf <= 0) return 0;
  const lengthNorm = 1 - b + b * (avgDocLength > 0 ? docLength / avgDocLength : 1);
  const numerator = tf * (k1 + 1);
  const denominator = tf + k1 * lengthNorm;
  return idf * (numerator / denominator);
}

/**
 * Rank a list of ResearchPaper objects using the BM25 probabilistic algorithm.
 *
 * Features:
 * - Multi-field weighting (title 3x, topics 1.8x, abstract 1x)
 * - Robertson-Spärck Jones IDF over candidate set
 * - Term frequency saturation ($k_1$) and length normalization ($b$)
 * - Normalizes relevance scores between 0.0 and 1.0
 * - Optional hybrid blending with publication recency and citations
 *
 * @param papers - Candidate papers to rank
 * @param query - User's search query
 * @param options - Custom BM25 tuning parameters
 * @returns Sorted array of papers with relevanceScore attached
 */
export function rankPapersWithBM25(
  papers: ResearchPaper[],
  query: string,
  options?: BM25Options
): ResearchPaper[] {
  if (!papers || papers.length === 0) return [];
  if (!query || !query.trim()) {
    // If no query, return original papers with zero score
    return papers.map((p) => ({ ...p, relevanceScore: 0 }));
  }

  const k1 = options?.k1 ?? DEFAULT_K1;
  const b = options?.b ?? DEFAULT_B;
  const titleWeight = options?.titleWeight ?? DEFAULT_TITLE_WEIGHT;
  const topicsWeight = options?.topicsWeight ?? DEFAULT_TOPICS_WEIGHT;
  const abstractWeight = options?.abstractWeight ?? DEFAULT_ABSTRACT_WEIGHT;

  const recencyWeight = Math.max(0, Math.min(1, options?.recencyWeight ?? 0.0));
  const citationWeight = Math.max(0, Math.min(1, options?.citationWeight ?? 0.0));
  const bm25Weight = Math.max(0, 1.0 - recencyWeight - citationWeight);

  const queryTokens = tokenizeAndFilter(query);
  if (queryTokens.length === 0) {
    return papers.map((p) => ({ ...p, relevanceScore: 0 }));
  }

  const N = papers.length;
  const currentYear = new Date().getFullYear();

  // 1. Tokenize document fields and collect corpus stats
  interface DocProfile {
    paper: ResearchPaper;
    titleTokens: string[];
    abstractTokens: string[];
    topicsTokens: string[];
    titleTf: Map<string, number>;
    abstractTf: Map<string, number>;
    topicsTf: Map<string, number>;
    allUniqueTokens: Set<string>;
  }

  const profiles: DocProfile[] = [];
  let totalTitleLen = 0;
  let totalAbstractLen = 0;
  let totalTopicsLen = 0;

  // Track document frequency for query terms
  const docFrequency = new Map<string, number>();

  for (const paper of papers) {
    const titleTokens = tokenizeAndFilter(paper.title || "");
    const abstractTokens = tokenizeAndFilter(paper.abstract || "");
    const topicsTokens = tokenizeAndFilter((paper.topics || []).join(" "));

    totalTitleLen += titleTokens.length;
    totalAbstractLen += abstractTokens.length;
    totalTopicsLen += topicsTokens.length;

    const allUniqueTokens = new Set([
      ...titleTokens,
      ...abstractTokens,
      ...topicsTokens,
    ]);

    for (const qToken of queryTokens) {
      if (allUniqueTokens.has(qToken)) {
        docFrequency.set(qToken, (docFrequency.get(qToken) || 0) + 1);
      }
    }

    profiles.push({
      paper,
      titleTokens,
      abstractTokens,
      topicsTokens,
      titleTf: getTermFrequencies(titleTokens),
      abstractTf: getTermFrequencies(abstractTokens),
      topicsTf: getTermFrequencies(topicsTokens),
      allUniqueTokens,
    });
  }

  const avgTitleLen = totalTitleLen / N;
  const avgAbstractLen = totalAbstractLen / N;
  const avgTopicsLen = totalTopicsLen / N;

  // 2. Precompute IDF for each query token
  const idfMap = new Map<string, number>();
  for (const qToken of queryTokens) {
    const df = docFrequency.get(qToken) || 0;
    idfMap.set(qToken, calculateIdf(df, N));
  }

  // 3. Score each document
  const rawScores: number[] = [];
  let maxScore = 0;

  for (const profile of profiles) {
    let score = 0;

    for (const qToken of queryTokens) {
      const idf = idfMap.get(qToken) || 0;
      if (idf <= 0) continue;

      // Title BM25 contribution
      const titleTf = profile.titleTf.get(qToken) || 0;
      const titleScore = computeTermBm25(
        titleTf,
        profile.titleTokens.length,
        avgTitleLen,
        k1,
        b,
        idf
      );

      // Abstract BM25 contribution
      const abstractTf = profile.abstractTf.get(qToken) || 0;
      const abstractScore = computeTermBm25(
        abstractTf,
        profile.abstractTokens.length,
        avgAbstractLen,
        k1,
        b,
        idf
      );

      // Topics BM25 contribution
      const topicsTf = profile.topicsTf.get(qToken) || 0;
      const topicsScore = computeTermBm25(
        topicsTf,
        profile.topicsTokens.length,
        avgTopicsLen,
        k1,
        b,
        idf
      );

      score +=
        titleScore * titleWeight +
        abstractScore * abstractWeight +
        topicsScore * topicsWeight;
    }

    rawScores.push(score);
    if (score > maxScore) maxScore = score;
  }

  // Find max citations for citation normalization
  let maxCitations = 1;
  for (const p of papers) {
    if (p.citationCount > maxCitations) maxCitations = p.citationCount;
  }

  // 4. Combine and normalize final scores
  const scoredPapers = profiles.map((profile, i) => {
    const normalizedBm25 = maxScore > 0 ? rawScores[i] / maxScore : 0;

    let finalScore = normalizedBm25;

    // Optional hybrid blending
    if (recencyWeight > 0 || citationWeight > 0) {
      // Recency: scaled between 0 and 1 (papers within last 5 years score highest)
      const paperYear = profile.paper.year ?? (currentYear - 10);
      const yearDiff = Math.max(0, currentYear - paperYear);
      const recencyScore = Math.max(0, 1.0 - yearDiff / 10);

      // Citations: log-scale normalized
      const citationScore = Math.log1p(profile.paper.citationCount) / Math.log1p(maxCitations);

      finalScore =
        normalizedBm25 * bm25Weight +
        recencyScore * recencyWeight +
        citationScore * citationWeight;
    }

    return {
      ...profile.paper,
      relevanceScore: Math.round(finalScore * 10000) / 10000,
    };
  });

  // Sort by relevance score (descending by default, or ascending if requested)
  const isAsc = options?.sortOrder === "asc";
  return scoredPapers.sort((a, b) => {
    const diff = (a.relevanceScore ?? 0) - (b.relevanceScore ?? 0);
    return isAsc ? diff : -diff;
  });
}

/**
 * Rank an array of PaperChunk objects using BM25 for RAG / vector retrieval.
 *
 * @param chunks - Text chunks to rank
 * @param query - Question or topic query
 * @param options - BM25 tuning parameters
 * @returns Sorted chunks with relevanceScore attached
 */
export function rankChunksWithBM25(
  chunks: PaperChunk[],
  query: string,
  options?: Pick<BM25Options, "k1" | "b" | "sortOrder">
): PaperChunk[] {
  if (!chunks || chunks.length === 0) return [];
  if (!query || !query.trim()) {
    return chunks.map((c) => ({ ...c, relevanceScore: 0 }));
  }

  const k1 = options?.k1 ?? DEFAULT_K1;
  const b = options?.b ?? DEFAULT_B;

  const queryTokens = tokenizeAndFilter(query);
  if (queryTokens.length === 0) {
    return chunks.map((c) => ({ ...c, relevanceScore: 0 }));
  }

  const N = chunks.length;
  let totalLength = 0;

  const docTokensList: string[][] = [];
  const docTfList: Map<string, number>[] = [];
  const docFrequency = new Map<string, number>();

  for (const chunk of chunks) {
    // Include chunk text + paper title for context
    const fullText = `${chunk.metadata.paperTitle} ${chunk.text}`;
    const tokens = tokenizeAndFilter(fullText);
    totalLength += tokens.length;

    const tf = getTermFrequencies(tokens);
    const uniqueTokens = new Set(tokens);

    for (const qToken of queryTokens) {
      if (uniqueTokens.has(qToken)) {
        docFrequency.set(qToken, (docFrequency.get(qToken) || 0) + 1);
      }
    }

    docTokensList.push(tokens);
    docTfList.push(tf);
  }

  const avgDocLen = totalLength / N;

  const idfMap = new Map<string, number>();
  for (const qToken of queryTokens) {
    const df = docFrequency.get(qToken) || 0;
    idfMap.set(qToken, calculateIdf(df, N));
  }

  const rawScores: number[] = [];
  let maxScore = 0;

  for (let i = 0; i < N; i++) {
    let score = 0;
    const tokens = docTokensList[i];
    const tf = docTfList[i];

    for (const qToken of queryTokens) {
      const idf = idfMap.get(qToken) || 0;
      if (idf <= 0) continue;

      const termFreq = tf.get(qToken) || 0;
      score += computeTermBm25(termFreq, tokens.length, avgDocLen, k1, b, idf);
    }

    rawScores.push(score);
    if (score > maxScore) maxScore = score;
  }

  const scoredChunks = chunks.map((chunk, i) => {
    const normalized = maxScore > 0 ? rawScores[i] / maxScore : 0;
    return {
      ...chunk,
      relevanceScore: Math.round(normalized * 10000) / 10000,
    };
  });

  const isAsc = options?.sortOrder === "asc";
  return scoredChunks.sort((a, b) => {
    const diff = (a.relevanceScore ?? 0) - (b.relevanceScore ?? 0);
    return isAsc ? diff : -diff;
  });
}
