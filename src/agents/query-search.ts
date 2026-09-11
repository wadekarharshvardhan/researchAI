import { generateText, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";
import { searchOpenAlex } from "@/tools/openalex";
import { retrievePaperCorpus, retrievePaperTool } from "@/tools/retrieve-paper";
import { deduplicatePapers } from "@/utils/deduplication";
import { rankPapersWithBM25 } from "@/utils/bm25";
import { ResearchPaper, QuerySearchResult, RetrievalSummary } from "@/types/research-paper";

/**
 * System prompt for Agent 1: Research Discovery Agent (Query, Search & Retrieval).
 */
const SYSTEM_PROMPT = `You are the Research Discovery Agent.

Your task is to understand the user's research question, search for relevant academic papers, and prepare them for retrieval and synthesis.

1. Understand Query:
   Identify the core research question, domain concepts, subtopics, and key terminology.

2. Generate Search Queries:
   Create 3-5 focused academic search queries covering different facets and synonyms of the topic.

3. Search Academic Sources:
   Use searchOpenAlex for each search query. If the user specifies a year constraint, include yearFrom.

4. Select Relevant Papers:
   Identify papers that are:
   - highly relevant to the research topic
   - recent when requested
   - academically credible with high citations or clear methodology
   - useful for literature review

5. Retrieve Paper Content:
   Use retrievePaperTool if you need to inspect content for specific candidate papers.

Do not:
- invent papers or DOIs
- fabricate metadata or citations
- summarize papers in full detail or synthesize final literature reviews (those belong to subsequent agents)

Only use information returned by the research tools.

At the end, respond with a JSON object in this exact format:
{
  "searchQueries": ["query1", "query2", ...],
  "summary": "Brief summary of what was searched and discovered"
}`;

/**
 * Extract all ResearchPaper results from tool results.
 */
function extractPapersFromToolResults(
  toolResults?: Array<{ output?: unknown; result?: unknown }>
): ResearchPaper[] {
  const papers: ResearchPaper[] = [];
  if (!toolResults) return papers;

  for (const item of toolResults) {
    const data = (item.output ?? item.result) as
      | {
          papers?: ResearchPaper[];
          error?: string | null;
        }
      | undefined;
    if (data?.papers && Array.isArray(data.papers)) {
      papers.push(...data.papers);
    }
  }

  return papers;
}

/**
 * Extract search queries from the agent's text response.
 */
function extractSearchQueries(text: string): string[] {
  try {
    const jsonMatch = text.match(/\{[\s\S]*"searchQueries"[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed.searchQueries)) {
        return parsed.searchQueries;
      }
    }
  } catch {
    // Fall through to fallback
  }

  return [];
}

/**
 * Extract errors from tool results.
 */
function extractErrorsFromToolResults(
  toolResults?: Array<{ output?: unknown; result?: unknown }>
): string[] {
  const errors: string[] = [];
  if (!toolResults) return errors;

  for (const item of toolResults) {
    const data = (item.output ?? item.result) as
      | {
          error?: string | null;
        }
      | undefined;
    if (data?.error && typeof data.error === "string") {
      errors.push(data.error);
    }
  }

  return errors;
}

/**
 * Run the Research Discovery Agent (Agent 1).
 *
 * Workflow:
 * 1. Understands the user's research question
 * 2. Generates multiple academic search queries
 * 3. Searches academic sources (OpenAlex)
 * 4. Deduplicates results by DOI and normalized title
 * 5. Selects candidate papers
 * 6. Retrieves available content (full text if open access, fallback to abstract)
 * 7. Extracts and cleans text
 * 8. Divides content into manageable semantic chunks
 * 9. Prepares chunks for vector/RAG embedding
 * 10. Returns structured research corpus
 *
 * @param userQuery - The user's research question
 * @param options - Optional parameters for filtering and retrieval
 * @returns Structured search results with papers, chunks, and metadata
 */
export async function runQuerySearchAgent(
  userQuery: string,
  options?: {
    yearFrom?: number;
    limit?: number;
    skipRetrieval?: boolean;
  }
): Promise<QuerySearchResult> {
  const limitPerQuery = options?.limit ?? 10;

  // Build the user message with optional constraints
  let userMessage = userQuery;
  if (options?.yearFrom) {
    userMessage += `\n\nPlease filter results to papers from ${options.yearFrom} onwards. Use yearFrom: ${options.yearFrom} in your tool calls.`;
  }
  if (options?.limit) {
    userMessage += `\n\nLimit each search to ${limitPerQuery} results per query.`;
  }

  // Resilient fallback when OPENAI_API_KEY is absent
  if (!process.env.OPENAI_API_KEY) {
    const { searchOpenAlexDirect } = await import("@/tools/openalex");
    const searchRes = await searchOpenAlexDirect({
      query: userQuery,
      yearFrom: options?.yearFrom,
      limit: limitPerQuery,
    });

    const unique = deduplicatePapers(searchRes.papers);
    const ranked = rankPapersWithBM25(unique, userQuery);

    let finalPapers = ranked;
    let retrievalSummary: RetrievalSummary | undefined = undefined;

    if (!options?.skipRetrieval && ranked.length > 0) {
      finalPapers = await retrievePaperCorpus(ranked);

      let fullTextCount = 0;
      let abstractOnlyCount = 0;
      let metadataOnlyCount = 0;
      let totalChunks = 0;

      for (const p of finalPapers) {
        if (p.contentStatus === "full_text") fullTextCount++;
        else if (p.contentStatus === "abstract_only") abstractOnlyCount++;
        else metadataOnlyCount++;
        totalChunks += p.chunks?.length ?? 0;
      }

      retrievalSummary = {
        totalPapers: finalPapers.length,
        fullTextCount,
        abstractOnlyCount,
        metadataOnlyCount,
        totalChunks,
      };
    }

    return {
      query: userQuery,
      searchQueries: [userQuery],
      papers: finalPapers,
      ...(retrievalSummary ? { retrievalSummary } : {}),
    };
  }

  try {
    const result = await generateText({
      model: openai("gpt-4o-mini"),
      system: SYSTEM_PROMPT,
      prompt: userMessage,
      tools: {
        searchOpenAlex,
        retrievePaperTool,
      },
      stopWhen: stepCountIs(10),
    });

    // 1. Extract papers from all search tool call results
    const allPapers = extractPapersFromToolResults(
      result.toolResults as Array<{ output?: unknown; result?: unknown }>
    );

    // 2. Deduplicate papers
    const uniquePapers = deduplicatePapers(allPapers);

    // 3. Rank papers with BM25 multi-field relevance scoring
    const rankedPapers = rankPapersWithBM25(uniquePapers, userQuery);

    // 4. Extract search queries from the agent's response
    const searchQueries = extractSearchQueries(result.text);

    // 5. Extract any errors from tool execution
    const errors = extractErrorsFromToolResults(
      result.toolResults as Array<{ output?: unknown; result?: unknown }>
    );

    // 6. Paper Retrieval & Preparation Stage
    // Retrieve full text or abstract and generate chunks for RAG
    let finalPapers = rankedPapers;
    let retrievalSummary: RetrievalSummary | undefined = undefined;

    if (!options?.skipRetrieval && rankedPapers.length > 0) {
      // Process papers concurrently with safe fallback
      finalPapers = await retrievePaperCorpus(rankedPapers);

      // Compute retrieval statistics
      let fullTextCount = 0;
      let abstractOnlyCount = 0;
      let metadataOnlyCount = 0;
      let totalChunks = 0;

      for (const p of finalPapers) {
        if (p.contentStatus === "full_text") {
          fullTextCount++;
        } else if (p.contentStatus === "abstract_only") {
          abstractOnlyCount++;
        } else {
          metadataOnlyCount++;
        }
        totalChunks += p.chunks?.length ?? 0;
      }

      retrievalSummary = {
        totalPapers: finalPapers.length,
        fullTextCount,
        abstractOnlyCount,
        metadataOnlyCount,
        totalChunks,
      };
    }

    return {
      query: userQuery,
      searchQueries,
      papers: finalPapers,
      ...(errors.length > 0 ? { errors } : {}),
      ...(retrievalSummary ? { retrievalSummary } : {}),
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error occurred";
    return {
      query: userQuery,
      searchQueries: [],
      papers: [],
      errors: [`Agent execution failed: ${message}`],
    };
  }
}

/** Alias for Agent 1 */
export const runResearchDiscoveryAgent = runQuerySearchAgent;

