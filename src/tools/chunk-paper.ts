import { PaperChunk, ResearchPaper } from "@/types/research-paper";

export interface ChunkingOptions {
  /** Maximum number of characters per chunk (default: 800, roughly 180-220 tokens) */
  chunkSize?: number;

  /** Overlap in characters between adjacent chunks (default: 150) */
  chunkOverlap?: number;
}

const DEFAULT_CHUNK_SIZE = 800;
const DEFAULT_CHUNK_OVERLAP = 150;

/**
 * Estimate token count using the standard ~4 chars per token rule of thumb.
 */
function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}

/**
 * Split a continuous string into chunks based on paragraph and sentence boundaries.
 */
export function chunkText(
  text: string,
  options?: ChunkingOptions
): string[] {
  if (!text || typeof text !== "string") return [];

  const chunkSize = options?.chunkSize ?? DEFAULT_CHUNK_SIZE;
  const chunkOverlap = options?.chunkOverlap ?? DEFAULT_CHUNK_OVERLAP;

  const trimmed = text.trim();
  if (trimmed.length === 0) return [];

  // If text is already within chunk size, return as single chunk
  if (trimmed.length <= chunkSize) {
    return [trimmed];
  }

  const chunks: string[] = [];

  // Split into natural paragraphs first
  const paragraphs = trimmed.split(/\n{2,}/);
  let currentChunk = "";

  for (const paragraph of paragraphs) {
    const p = paragraph.trim();
    if (!p) continue;

    // If adding this paragraph exceeds chunkSize, break it down or flush currentChunk
    if (currentChunk.length + p.length + 2 <= chunkSize) {
      currentChunk += (currentChunk ? "\n\n" : "") + p;
    } else {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.trim());

        // Retain overlap from end of currentChunk if possible
        if (chunkOverlap > 0 && currentChunk.length > chunkOverlap) {
          const overlapSlice = currentChunk.slice(-chunkOverlap);
          // Try to slice at a sentence or word boundary
          const lastSpace = overlapSlice.lastIndexOf(" ");
          currentChunk = lastSpace !== -1 ? overlapSlice.slice(lastSpace + 1) : overlapSlice;
        } else {
          currentChunk = "";
        }
      }

      // If the paragraph itself exceeds chunkSize, split by sentence
      if (p.length > chunkSize) {
        const sentences = p.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) || [p];
        for (const sentence of sentences) {
          const s = sentence.trim();
          if (!s) continue;

          if (currentChunk.length + s.length + 1 <= chunkSize) {
            currentChunk += (currentChunk ? " " : "") + s;
          } else {
            if (currentChunk.length > 0) {
              chunks.push(currentChunk.trim());
              const overlapSlice = currentChunk.slice(-chunkOverlap);
              const lastSpace = overlapSlice.lastIndexOf(" ");
              currentChunk = lastSpace !== -1 ? overlapSlice.slice(lastSpace + 1) : overlapSlice;
            }
            // If even a single sentence exceeds chunkSize, slice by word
            if (s.length > chunkSize) {
              const words = s.split(/\s+/);
              for (const word of words) {
                if (currentChunk.length + word.length + 1 <= chunkSize) {
                  currentChunk += (currentChunk ? " " : "") + word;
                } else {
                  if (currentChunk.length > 0) {
                    chunks.push(currentChunk.trim());
                  }
                  currentChunk = word;
                }
              }
            } else {
              currentChunk += (currentChunk ? " " : "") + s;
            }
          }
        }
      } else {
        currentChunk += (currentChunk ? "\n\n" : "") + p;
      }
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Divide a paper's content into structured PaperChunk objects prepared for RAG.
 *
 * @param paper - The source research paper
 * @param content - The extracted and cleaned text to chunk
 * @param isAbstract - Whether the content is derived solely from the abstract
 * @param options - Chunking configuration (size and overlap)
 */
export function chunkPaper(
  paper: ResearchPaper,
  content: string,
  isAbstract = false,
  options?: ChunkingOptions
): PaperChunk[] {
  const rawChunks = chunkText(content, options);

  return rawChunks.map((chunkText, idx) => ({
    chunkIndex: idx,
    text: chunkText,
    tokenCount: estimateTokens(chunkText),
    metadata: {
      paperId: paper.id,
      paperTitle: paper.title,
      source: paper.source,
      doi: paper.doi ?? null,
      year: paper.year ?? null,
      isAbstract,
    },
  }));
}
