import { generateText, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";
import { searchOpenAlex } from "@/tools/openalex";
import { deduplicatePapers } from "@/utils/deduplication";
import { ResearchPaper, QuerySearchResult } from "@/types/research-paper";

/**
 * System prompt for the Query & Search Agent.
 */
const SYSTEM_PROMPT = `You are the Query and Search Agent.

Your task is to understand the user's research question and find relevant academic papers.

First identify the main research topic, important concepts, keywords, and useful search terms.

Generate focused academic search queries. Create 3-5 different search queries that cover different aspects or synonyms of the research topic.

Use the available academic search tools to find relevant papers. Call the searchOpenAlex tool for each of your generated search queries.

Prefer papers that are:
- relevant to the user's topic
- recent when the user asks for recent research
- academically credible
- useful for literature review

If the user explicitly requests recent research, use the yearFrom parameter to filter by publication year.
If the user does not specify a time range, do not arbitrarily restrict the search to a specific year.

After collecting results from all searches, report all the search queries you used and all the papers you found.

Do not:
- invent papers
- invent metadata
- fabricate citations
- summarize papers in detail
- identify research gaps
- write the final literature review

Only use information returned by the research tools.

IMPORTANT: You MUST call the searchOpenAlex tool for each search query. Do not skip tool calls.

At the end, respond with a JSON object in this exact format:
{
  "searchQueries": ["query1", "query2", ...],
  "summary": "Brief summary of what was searched"
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
    // Try to parse JSON from the response
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
 * Run the Query & Search Agent.
 *
 * This agent:
 * 1. Understands the user's research question
 * 2. Generates multiple search queries
 * 3. Searches OpenAlex for each query
 * 4. Deduplicates results
 * 5. Returns structured paper metadata
 *
 * @param userQuery - The user's research question
 * @param options - Optional parameters for filtering
 * @returns Structured search results with papers and metadata
 */
export async function runQuerySearchAgent(
  userQuery: string,
  options?: {
    yearFrom?: number;
    limit?: number;
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

  try {
    const result = await generateText({
      model: openai("gpt-4o-mini"),
      system: SYSTEM_PROMPT,
      prompt: userMessage,
      tools: {
        searchOpenAlex,
      },
      stopWhen: stepCountIs(10),
    });

    // Extract papers from all tool call results
    const allPapers = extractPapersFromToolResults(
      result.toolResults as Array<{ output?: unknown; result?: unknown }>
    );

    // Deduplicate
    const uniquePapers = deduplicatePapers(allPapers);

    // Extract search queries from the agent's response
    const searchQueries = extractSearchQueries(result.text);

    // Extract any errors
    const errors = extractErrorsFromToolResults(
      result.toolResults as Array<{ output?: unknown; result?: unknown }>
    );

    return {
      query: userQuery,
      searchQueries,
      papers: uniquePapers,
      ...(errors.length > 0 ? { errors } : {}),
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
