"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Loader2,
  Copy,
  Check,
  RotateCcw,
  Bot,
  User,
  Quote,
  X,
  BookOpen,
  HelpCircle,
  CornerDownLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { ResearchPaper } from "@/types/research-paper";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  model?: string;
  provider?: string;
}

export interface HighlightContextPayload {
  text: string;
  autoSubmit?: boolean;
}

interface AICopilotPanelProps {
  paper: ResearchPaper;
  activeHighlightContext?: HighlightContextPayload | string | null;
  onClearHighlightContext?: () => void;
}

/**
 * Parses inline formatting like **bold**, *italic*, and `code`
 */
function renderInlineContent(text: string): React.ReactNode {
  // Regex splitting on **bold**, *italic*, `code`
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);

  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-bold text-[#07133D]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={idx} className="italic text-slate-700">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-blue-50/80 text-[#2563EB] font-mono text-[11px] border border-blue-200/60"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

/**
 * Beautiful, Structured Academic Markdown Renderer with Table, List, and Code Block support
 */
function FormattedMarkdown({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: { type: "bullet" | "number"; items: string[] } | null = null;
  let quoteBuffer: string[] = [];

  const flushList = () => {
    if (currentList) {
      if (currentList.type === "bullet") {
        elements.push(
          <ul key={`list-${elements.length}`} className="space-y-1.5 my-2.5 pl-1">
            {currentList.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-[#334155] leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0 mt-1.5" />
                <span className="flex-1">{renderInlineContent(item)}</span>
              </li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`list-${elements.length}`} className="space-y-1.5 my-2.5 pl-1">
            {currentList.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-[#334155] leading-relaxed">
                <span className="w-4 h-4 rounded-md bg-blue-50 text-[#2563EB] border border-blue-200 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="flex-1">{renderInlineContent(item)}</span>
              </li>
            ))}
          </ol>
        );
      }
      currentList = null;
    }
  };

  const flushQuote = () => {
    if (quoteBuffer.length > 0) {
      elements.push(
        <div
          key={`quote-${elements.length}`}
          className="border-l-3 border-[#2563EB] bg-gradient-to-r from-blue-50/80 to-indigo-50/40 p-2.5 my-2.5 rounded-r-xl text-xs text-[#1E293B] italic leading-relaxed shadow-2xs"
        >
          <div className="flex items-start gap-1.5">
            <Quote className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5 not-italic" />
            <div className="space-y-1">
              {quoteBuffer.map((line, i) => (
                <p key={i}>{renderInlineContent(line)}</p>
              ))}
            </div>
          </div>
        </div>
      );
      quoteBuffer = [];
    }
  };

  const isSeparatorRow = (l: string) =>
    /^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(l.trim());

  const parseTableCells = (l: string) => {
    let s = l.trim();
    if (s.startsWith("|")) s = s.slice(1);
    if (s.endsWith("|")) s = s.slice(0, -1);
    return s.split("|").map((c) => c.trim());
  };

  let idx = 0;
  while (idx < lines.length) {
    const rawLine = lines[idx];
    const line = rawLine.trim();

    if (!line) {
      flushList();
      flushQuote();
      idx++;
      continue;
    }

    // 1. Code Block (```)
    if (line.startsWith("```")) {
      flushList();
      flushQuote();
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      idx++;
      while (idx < lines.length && !lines[idx].trim().startsWith("```")) {
        codeLines.push(lines[idx]);
        idx++;
      }
      if (idx < lines.length) idx++; // skip closing ```
      const codeString = codeLines.join("\n");
      elements.push(
        <div
          key={`code-${elements.length}-${idx}`}
          className="my-3 rounded-2xl bg-[#091124] text-slate-100 overflow-hidden border border-slate-800/80 shadow-md font-mono"
        >
          {lang && (
            <div className="px-3.5 py-1.5 bg-slate-900/90 border-b border-slate-800 text-[10.5px] text-blue-400 font-semibold uppercase tracking-wider">
              {lang}
            </div>
          )}
          <pre className="p-3.5 overflow-x-auto text-[11.5px] leading-relaxed text-slate-200" style={{ scrollbarWidth: "thin" }}>
            <code>{codeString}</code>
          </pre>
        </div>
      );
      continue;
    }

    // 2. Table Block (| Col 1 | Col 2 | ... |)
    if (
      line.includes("|") &&
      idx + 1 < lines.length &&
      isSeparatorRow(lines[idx + 1])
    ) {
      flushList();
      flushQuote();

      const headerCells = parseTableCells(line);
      idx += 2; // skip header and separator row

      const rows: string[][] = [];
      while (idx < lines.length && lines[idx].trim().includes("|") && !isSeparatorRow(lines[idx])) {
        rows.push(parseTableCells(lines[idx]));
        idx++;
      }

      elements.push(
        <div
          key={`table-${elements.length}-${idx}`}
          className="my-3 overflow-x-auto rounded-2xl border border-[#DCE7F6] bg-white shadow-2xs"
          style={{ scrollbarWidth: "thin" }}
        >
          <table className="w-full text-left text-xs border-collapse min-w-[360px]">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-blue-50/90 border-b border-[#D0E0F5]">
                {headerCells.map((cell, cIdx) => (
                  <th
                    key={cIdx}
                    className="px-3.5 py-2.5 font-extrabold text-[#07133D] text-[11px] uppercase tracking-wider whitespace-nowrap"
                  >
                    {renderInlineContent(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((rowCells, rIdx) => (
                <tr
                  key={rIdx}
                  className="hover:bg-blue-50/40 transition-colors even:bg-slate-50/50"
                >
                  {rowCells.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className="px-3.5 py-2.5 text-[#334155] leading-relaxed align-top"
                    >
                      {renderInlineContent(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // 3. Horizontal Rule (--- or ***)
    if (line === "---" || line === "***" || line === "___") {
      flushList();
      flushQuote();
      elements.push(
        <hr key={`hr-${elements.length}-${idx}`} className="my-3 border-t border-slate-200/80" />
      );
      idx++;
      continue;
    }

    // 4. Headings (###, ##, #)
    if (line.startsWith("### ")) {
      flushList();
      flushQuote();
      elements.push(
        <h4
          key={`h4-${elements.length}-${idx}`}
          className="text-xs font-extrabold text-[#07133D] uppercase tracking-wide mt-3.5 mb-1.5 flex items-center gap-1.5 border-b border-slate-100 pb-1"
        >
          <span className="w-1.5 h-3.5 rounded-full bg-[#2563EB]" />
          <span>{renderInlineContent(line.slice(4))}</span>
        </h4>
      );
      idx++;
      continue;
    }

    if (line.startsWith("## ")) {
      flushList();
      flushQuote();
      elements.push(
        <h3
          key={`h3-${elements.length}-${idx}`}
          className="text-sm font-extrabold text-[#07133D] mt-4 mb-1.5 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>{renderInlineContent(line.slice(3))}</span>
        </h3>
      );
      idx++;
      continue;
    }

    if (line.startsWith("# ")) {
      flushList();
      flushQuote();
      elements.push(
        <h2
          key={`h2-${elements.length}-${idx}`}
          className="text-base font-extrabold text-[#07133D] mt-4 mb-2"
        >
          {renderInlineContent(line.slice(2))}
        </h2>
      );
      idx++;
      continue;
    }

    // 5. Blockquotes (> )
    if (line.startsWith("> ")) {
      flushList();
      quoteBuffer.push(line.slice(2).trim());
      idx++;
      continue;
    } else {
      flushQuote();
    }

    // 6. Bullet lists (- or * or •)
    if (line.startsWith("- ") || line.startsWith("* ") || line.startsWith("• ")) {
      if (!currentList || currentList.type !== "bullet") {
        flushList();
        currentList = { type: "bullet", items: [] };
      }
      currentList.items.push(line.slice(2).trim());
      idx++;
      continue;
    }

    // 7. Numbered lists (1. 2. etc)
    const numMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      if (!currentList || currentList.type !== "number") {
        flushList();
        currentList = { type: "number", items: [] };
      }
      currentList.items.push(numMatch[2].trim());
      idx++;
      continue;
    }

    // 8. Standard paragraph
    flushList();
    elements.push(
      <p key={`p-${elements.length}-${idx}`} className="text-xs text-[#334155] leading-relaxed my-1">
        {renderInlineContent(line)}
      </p>
    );
    idx++;
  }

  flushList();
  flushQuote();

  return <div className="space-y-1">{elements}</div>;
}

/**
 * Generate intelligent suggested prompts based on paper topics & title.
 */
function getSuggestedQuestions(paper: ResearchPaper): string[] {
  const title = paper.title.toLowerCase();
  const suggestions: string[] = [];

  if (title.includes("detection") || title.includes("vision") || title.includes("crop") || title.includes("image")) {
    suggestions.push("What model architecture and accuracy metrics were achieved?");
    suggestions.push("How does it perform in real-world noisy environments?");
  } else if (title.includes("sensor") || title.includes("health") || title.includes("medical")) {
    suggestions.push("What clinical or health metrics are monitored?");
    suggestions.push("What are the key patient advantages and limitations?");
  } else if (title.includes("transformer") || title.includes("language") || title.includes("llm")) {
    suggestions.push("How does this compare to previous transformer baselines?");
    suggestions.push("What is the computational overhead and latency?");
  }

  suggestions.push("Summarize the core methodology in 3 bullet points");
  suggestions.push("What critical research gaps or limitations remain?");
  suggestions.push("What datasets and benchmarks were evaluated?");

  return suggestions.slice(0, 4);
}

export default function AICopilotPanel({
  paper,
  activeHighlightContext,
  onClearHighlightContext,
}: AICopilotPanelProps) {
  const highlightText =
    typeof activeHighlightContext === "string"
      ? activeHighlightContext
      : activeHighlightContext?.text || null;
  const isAutoSubmit =
    typeof activeHighlightContext === "object" && !!activeHighlightContext?.autoSubmit;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: `### Welcome to ResearchAI Copilot\n\nI have primed the complete context for **"${paper.title}"** (${paper.authors?.[0] ? `${paper.authors[0]} et al.` : "Authors"}, ${paper.year || 2024}).\n\n- Ask any question regarding the methodology, experiments, or equations.\n- Highlight any paragraph in the reader on the left and click **Ask AI** for instant analysis!\n\n*Choose a suggested prompt below or type your inquiry.*`,
      timestamp: Date.now(),
      model: "ResearchAI Academic Model",
      provider: "researchai",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastAutoSubmittedRef = useRef<string | null>(null);

  const suggestedQuestions = getSuggestedQuestions(paper);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (questionText?: string, excerptOverride?: string) => {
    const query = (questionText || input).trim();
    if (!query || loading) return;

    const currentExcerpt = excerptOverride !== undefined ? excerptOverride : highlightText;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: currentExcerpt
        ? `${query}\n\n> "${currentExcerpt}"`
        : query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/paper/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: query,
          paper: {
            id: paper.id,
            title: paper.title,
            authors: paper.authors,
            year: paper.year,
            venue: paper.venue,
            topics: paper.topics,
            abstract: paper.abstract,
            doi: paper.doi,
          },
          selectedHighlight: currentExcerpt || undefined,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        throw new Error("Copilot response failed");
      }

      const data = await res.json();
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.answer || "I have analyzed this paper. Please let me know if you need more details!",
        timestamp: Date.now(),
        model: "ResearchAI Academic Model",
        provider: "researchai",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Copilot fetch error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I had trouble generating the answer. Please try asking again or check network connectivity.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
      if (currentExcerpt && onClearHighlightContext) {
        onClearHighlightContext();
      }
    }
  };

  // Automatically execute inquiry when user clicks "Ask AI" from overlay
  useEffect(() => {
    if (isAutoSubmit && highlightText && lastAutoSubmittedRef.current !== highlightText && !loading) {
      lastAutoSubmittedRef.current = highlightText;
      handleSend("Please explain this excerpt and its significance in the context of this paper:", highlightText);
    }
  }, [isAutoSubmit, highlightText, loading]);

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content: `### Chat History Reset\n\nI am ready to analyze **"${paper.title}"**. What would you like to explore next?`,
        timestamp: Date.now(),
        model: "ResearchAI Academic Model",
        provider: "researchai",
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-[#FAFCFF] border-l border-[#D8E6F8] select-none">
      {/* ── Copilot Header ────────────────────────────────────────── */}
      <div className="px-4 py-3.5 border-b border-[#E2EDF9] flex items-center justify-between bg-white/90 backdrop-blur-md shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-[#07133D] tracking-tight">
                ResearchAI Copilot
              </h3>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#2563EB]">
                <Sparkles className="w-3 h-3 text-blue-500 fill-blue-500" />
                Powered by ResearchAI • Academic Intelligence
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClearChat}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Reset conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Active Selection Banner (If text highlighted/selected) ─── */}
      <AnimatePresence>
        {highlightText && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50/70 border-b border-blue-200/60 text-xs shrink-0 space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <Quote className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                <span className="truncate text-[11px] font-semibold italic text-slate-800">
                  &ldquo;{highlightText}&rdquo;
                </span>
              </div>
              <button
                type="button"
                onClick={onClearHighlightContext}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md cursor-pointer"
                title="Clear selected excerpt"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Prompt Chips for Excerpt */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSend("Explain this excerpt in simple terms:", highlightText)}
                className="px-2.5 py-1 rounded-lg bg-white border border-blue-200/90 text-[11px] font-bold text-[#2563EB] hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <Sparkles className="w-3 h-3 text-amber-500" /> Explain excerpt
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSend("What is the core takeaway of this excerpt?", highlightText)}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#07133D] transition-all cursor-pointer shadow-2xs"
              >
                Core takeaway
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSend("What are the potential limitations or criticisms of this point?", highlightText)}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#07133D] transition-all cursor-pointer shadow-2xs"
              >
                Critical analysis
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Messages Scroll Area ──────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 select-text"
        style={{ scrollbarWidth: "thin" }}
      >
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} group`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[88%] rounded-2xl p-4 text-xs leading-relaxed transition-all ${
                  isUser
                    ? "bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white shadow-md shadow-blue-600/15 rounded-tr-xs"
                    : "bg-white border border-[#DCE7F6] text-[#1E293B] shadow-[0_2px_12px_rgba(30,60,120,0.04)] rounded-tl-xs"
                }`}
              >
                {/* Assistant Message Header */}
                {!isUser && (
                  <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100/90 text-[10.5px]">
                    <div className="flex items-center gap-1.5 font-bold text-[#07133D]">
                      <span>ResearchAI Copilot</span>
                      <span className="px-1.5 py-0.2 rounded bg-blue-50 text-[#2563EB] border border-blue-200/60 font-semibold text-[9.5px] flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 fill-blue-500 text-blue-500" /> ResearchAI
                      </span>
                    </div>
                    <span className="text-slate-400 font-medium">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                )}

                {/* Formatted Markdown Content */}
                {isUser ? (
                  <div className="whitespace-pre-wrap font-medium">{msg.content}</div>
                ) : (
                  <FormattedMarkdown content={msg.content} />
                )}

                {/* Assistant Message Actions */}
                {!isUser && (
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 font-medium">
                      Grounded in paper context
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(msg.id, msg.content)}
                      className="text-[10.5px] font-semibold text-slate-400 hover:text-[#2563EB] flex items-center gap-1 transition-colors cursor-pointer select-none"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-blue-100 shadow-xs w-fit">
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#07133D]">
              <span>Analyzing paper with ResearchAI...</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Suggested Questions Chips ─────────────────────────────── */}
      <div className="p-3 border-t border-[#E2EDF9] bg-[#F6F9FD] shrink-0">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#2563EB]" /> Suggested Prompts
        </div>
        <div className="flex flex-wrap gap-1.5">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              type="button"
              disabled={loading}
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-white hover:bg-blue-50 hover:text-[#2563EB] hover:border-blue-300 text-slate-700 border border-slate-200/90 transition-all cursor-pointer shadow-2xs text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* ── Modern Input Box ─────────────────────────────────────────── */}
      <div className="p-3.5 bg-white border-t border-[#E2EDF9] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              highlightText
                ? `Ask about "${highlightText.slice(0, 30)}..."`
                : "Ask anything about this paper..."
            }
            disabled={loading}
            className="w-full pl-4 pr-12 py-3 rounded-2xl bg-[#F4F7FB] border border-slate-200/90 text-xs text-[#07133D] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] transition-all font-medium"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 p-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 disabled:hover:bg-[#2563EB] text-white transition-all cursor-pointer shadow-xs disabled:cursor-not-allowed"
            title="Send inquiry (Enter)"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-1 font-medium">
          <span className="flex items-center gap-1">
            <CornerDownLeft className="w-2.5 h-2.5" /> Press Enter to send
          </span>
          <span>ResearchAI Academic Assistant</span>
        </div>
      </div>
    </div>
  );
}
