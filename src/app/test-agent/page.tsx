"use client";

import { useState } from "react";

interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string | null;
  year: number | null;
  doi: string | null;
  citationCount: number;
  url: string | null;
  pdfUrl: string | null;
  isOpenAccess: boolean;
  source: string;
}

interface SearchResult {
  query: string;
  totalResults: number;
  papersReturned: number;
  error: string | null;
  papers: Paper[];
}

export default function TestAgentPage() {
  const [query, setQuery] = useState("AI-based crop disease detection");
  const [yearFrom, setYearFrom] = useState("2023");
  const [limit, setLimit] = useState("5");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const body: Record<string, unknown> = { query };
      if (yearFrom) body.yearFrom = parseInt(yearFrom);
      if (limit) body.limit = parseInt(limit);

      const res = await fetch("/api/test/openalex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Request failed");
        return;
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#e5e5e5",
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#fff",
              marginBottom: 8,
            }}
          >
            🧪 Agent 1 — Query & Search Test
          </h1>
          <p style={{ color: "#888", fontSize: 14 }}>
            Test the OpenAlex search tool directly. No API key needed.
          </p>
        </div>

        {/* Search Form */}
        <div
          style={{
            background: "#141414",
            border: "1px solid #262626",
            borderRadius: 12,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                color: "#888",
                marginBottom: 6,
              }}
            >
              Research Query
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your research topic..."
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: 8,
                color: "#fff",
                fontSize: 15,
                outline: "none",
                boxSizing: "border-box",
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  color: "#888",
                  marginBottom: 6,
                }}
              >
                Year From (optional)
              </label>
              <input
                type="number"
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
                placeholder="e.g. 2023"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: 15,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  color: "#888",
                  marginBottom: 6,
                }}
              >
                Limit
              </label>
              <input
                type="number"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                min={1}
                max={50}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: 15,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            style={{
              padding: "10px 28px",
              background: loading ? "#333" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "opacity 0.2s",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Searching..." : "🔍 Search OpenAlex"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "#1c0a0a",
              border: "1px solid #7f1d1d",
              borderRadius: 12,
              padding: 16,
              marginBottom: 24,
              color: "#fca5a5",
              fontSize: 14,
            }}
          >
            ❌ {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <>
            {/* Stats */}
            <div
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 24,
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "Total Available", value: result.totalResults.toLocaleString() },
                { label: "Returned", value: result.papersReturned },
                { label: "Status", value: result.error ? "⚠️ Error" : "✅ OK" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "#141414",
                    border: "1px solid #262626",
                    borderRadius: 10,
                    padding: "12px 20px",
                    minWidth: 140,
                  }}
                >
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Papers */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {result.papers.map((paper, i) => (
                <div
                  key={paper.id}
                  style={{
                    background: "#141414",
                    border: "1px solid #262626",
                    borderRadius: 12,
                    padding: 20,
                    transition: "border-color 0.2s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        background: "#6366f1",
                        color: "#fff",
                        borderRadius: 6,
                        padding: "2px 8px",
                        fontSize: 12,
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      {i + 1}
                    </span>
                    <h3
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#fff",
                        margin: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      {paper.url ? (
                        <a
                          href={paper.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#a5b4fc", textDecoration: "none" }}
                        >
                          {paper.title}
                        </a>
                      ) : (
                        paper.title
                      )}
                    </h3>
                  </div>

                  {/* Meta */}
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      fontSize: 13,
                      color: "#888",
                      marginBottom: 10,
                      flexWrap: "wrap",
                      paddingLeft: 36,
                    }}
                  >
                    {paper.year && <span>📅 {paper.year}</span>}
                    <span>📊 {paper.citationCount} citations</span>
                    {paper.isOpenAccess && (
                      <span style={{ color: "#4ade80" }}>🔓 Open Access</span>
                    )}
                    <span>📦 {paper.source}</span>
                  </div>

                  {/* Authors */}
                  {paper.authors.length > 0 && (
                    <div
                      style={{
                        fontSize: 13,
                        color: "#999",
                        marginBottom: 10,
                        paddingLeft: 36,
                      }}
                    >
                      {paper.authors.slice(0, 5).join(", ")}
                      {paper.authors.length > 5 &&
                        ` +${paper.authors.length - 5} more`}
                    </div>
                  )}

                  {/* Abstract */}
                  {paper.abstract && (
                    <p
                      style={{
                        fontSize: 13,
                        color: "#aaa",
                        lineHeight: 1.6,
                        margin: 0,
                        paddingLeft: 36,
                      }}
                    >
                      {paper.abstract.length > 300
                        ? paper.abstract.slice(0, 300) + "..."
                        : paper.abstract}
                    </p>
                  )}

                  {/* Links */}
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      marginTop: 12,
                      paddingLeft: 36,
                      fontSize: 13,
                    }}
                  >
                    {paper.doi && (
                      <a
                        href={`https://doi.org/${paper.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#6366f1", textDecoration: "none" }}
                      >
                        DOI ↗
                      </a>
                    )}
                    {paper.pdfUrl && (
                      <a
                        href={paper.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#8b5cf6", textDecoration: "none" }}
                      >
                        PDF ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Raw JSON toggle */}
            <details
              style={{
                marginTop: 24,
                background: "#141414",
                border: "1px solid #262626",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <summary
                style={{
                  cursor: "pointer",
                  color: "#888",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                View Raw JSON Response
              </summary>
              <pre
                style={{
                  marginTop: 12,
                  color: "#aaa",
                  fontSize: 12,
                  overflow: "auto",
                  maxHeight: 400,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </>
        )}
      </div>
    </div>
  );
}
