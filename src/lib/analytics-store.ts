"use client";

import { useState, useEffect, useCallback } from "react";
import type { ResearchPaper } from "@/types/research-paper";
import { getRecentSearches } from "./recent-searches";
import { getSavedPapers } from "./library-papers";

export interface SearchEvent {
  id: string;
  query: string;
  timestamp: number;
  resultsCount: number;
  topics: string[];
}

export interface PaperViewEvent {
  id: string;
  paperId: string;
  title: string;
  authors: string[];
  year?: number | null;
  source: string;
  venue?: string | null;
  topics: string[];
  citationCount: number;
  isOpenAccess: boolean;
  timestamp: number;
  readDurationSeconds?: number;
}

export interface AnalyticsData {
  searches: SearchEvent[];
  views: PaperViewEvent[];
  initializedAt: number;
}

const STORAGE_KEY = "researchai_analytics_store_v1";
const EVENT_NAME = "researchai:analytics-updated";

/**
 * Domain classification mapping helper
 */
export function categorizeTopic(topic: string): string {
  const t = topic.toLowerCase();
  if (
    t.includes("ai") ||
    t.includes("artificial intelligence") ||
    t.includes("machine learning") ||
    t.includes("deep learning") ||
    t.includes("neural") ||
    t.includes("vision") ||
    t.includes("nlp") ||
    t.includes("transformer") ||
    t.includes("language model") ||
    t.includes("computer") ||
    t.includes("algorithm") ||
    t.includes("robotics")
  ) {
    return "AI & Computer Science";
  }
  if (
    t.includes("climate") ||
    t.includes("crop") ||
    t.includes("plant") ||
    t.includes("agriculture") ||
    t.includes("environment") ||
    t.includes("ecology") ||
    t.includes("carbon") ||
    t.includes("sustainable") ||
    t.includes("soil")
  ) {
    return "Environmental & Agriculture";
  }
  if (
    t.includes("health") ||
    t.includes("medic") ||
    t.includes("clinical") ||
    t.includes("disease") ||
    t.includes("cancer") ||
    t.includes("patient") ||
    t.includes("biomed") ||
    t.includes("pharma") ||
    t.includes("surgery")
  ) {
    return "Medicine & Healthcare";
  }
  if (
    t.includes("physic") ||
    t.includes("quantum") ||
    t.includes("energy") ||
    t.includes("material") ||
    t.includes("chemical") ||
    t.includes("optics") ||
    t.includes("mechanic")
  ) {
    return "Physics & Engineering";
  }
  if (
    t.includes("bio") ||
    t.includes("gene") ||
    t.includes("dna") ||
    t.includes("cell") ||
    t.includes("protein") ||
    t.includes("genom")
  ) {
    return "Biological Sciences";
  }
  return "Interdisciplinary & General";
}

/**
 * Normalizes topics from string or paper
 */
export function extractTopicsFromText(text: string): string[] {
  const words = text
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(
      (w) =>
        w.length > 3 &&
        !["with", "from", "that", "this", "based", "using", "into", "their", "about", "study", "review", "papers", "paper", "what", "which", "when", "where", "have", "more"].includes(
          w.toLowerCase()
        )
    );
  return Array.from(new Set(words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))).slice(0, 4);
}

/**
 * Read raw analytics data from localStorage
 */
export function getAnalyticsData(): AnalyticsData {
  if (typeof window === "undefined") {
    return { searches: [], views: [], initializedAt: Date.now() };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.searches) && Array.isArray(parsed.views)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to parse analytics from localStorage:", err);
  }

  // Bootstrap from existing recent searches & saved papers if available
  const initial = bootstrapInitialData();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  } catch (err) {
    console.error("Failed to initialize analytics store:", err);
  }
  return initial;
}

/**
 * Seed initial analytics from recent searches and saved papers so users don't start with zero if they have existing history
 */
function bootstrapInitialData(): AnalyticsData {
  const recent = getRecentSearches();
  const saved = getSavedPapers();

  const searches: SearchEvent[] = recent.map((item) => ({
    id: `search-${item.id}`,
    query: item.query,
    timestamp: item.timestamp,
    resultsCount: 15,
    topics: extractTopicsFromText(item.query),
  }));

  const views: PaperViewEvent[] = saved.map((p) => ({
    id: `view-boot-${p.id}`,
    paperId: p.id,
    title: p.title,
    authors: p.authors || [],
    year: p.year,
    source: p.source || "OpenAlex",
    venue: p.venue,
    topics: p.topics && p.topics.length > 0 ? p.topics : extractTopicsFromText(p.title),
    citationCount: p.citationCount || 0,
    isOpenAccess: !!p.isOpenAccess,
    timestamp: p.savedAt || Date.now(),
    readDurationSeconds: 180,
  }));

  return {
    searches,
    views,
    initializedAt: Date.now(),
  };
}

/**
 * Save analytics data to localStorage & notify
 */
function saveAnalyticsData(data: AnalyticsData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: data }));
  } catch (err) {
    console.error("Failed to save analytics data:", err);
  }
}

/**
 * Record a search event
 */
export function recordSearch(
  query: string,
  papersSample: ResearchPaper[] = [],
  totalResults: number = 0
): void {
  if (typeof window === "undefined" || !query || !query.trim()) return;

  const current = getAnalyticsData();
  const trimmed = query.trim();

  // Extract topics from papers or query
  const collectedTopics = new Set<string>();
  papersSample.forEach((p) => {
    if (p.topics) {
      p.topics.slice(0, 3).forEach((t) => collectedTopics.add(t));
    }
  });

  if (collectedTopics.size === 0) {
    extractTopicsFromText(trimmed).forEach((t) => collectedTopics.add(t));
  }

  const newSearch: SearchEvent = {
    id: `srch-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    query: trimmed,
    timestamp: Date.now(),
    resultsCount: totalResults || papersSample.length || 1,
    topics: Array.from(collectedTopics).slice(0, 6),
  };

  // Keep last 150 search events
  const updatedSearches = [newSearch, ...current.searches].slice(0, 150);

  saveAnalyticsData({
    ...current,
    searches: updatedSearches,
  });
}

/**
 * Record a paper view event
 */
export function recordPaperView(paper: ResearchPaper): void {
  if (typeof window === "undefined" || !paper || !paper.id) return;

  const current = getAnalyticsData();

  const topics =
    paper.topics && paper.topics.length > 0
      ? paper.topics.slice(0, 5)
      : extractTopicsFromText(`${paper.title} ${paper.abstract || ""}`);

  const newView: PaperViewEvent = {
    id: `view-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    paperId: paper.id,
    title: paper.title,
    authors: paper.authors || [],
    year: paper.year,
    source: paper.source || "OpenAlex",
    venue: paper.venue || null,
    topics,
    citationCount: paper.citationCount || 0,
    isOpenAccess: !!paper.isOpenAccess,
    timestamp: Date.now(),
    readDurationSeconds: 60, // initial view
  };

  // Keep last 250 paper view events
  const updatedViews = [newView, ...current.views].slice(0, 250);

  saveAnalyticsData({
    ...current,
    views: updatedViews,
  });
}

/**
 * Update reading duration for the most recent view of a paper
 */
export function updatePaperReadDuration(paperId: string, additionalSeconds: number): void {
  if (typeof window === "undefined" || !paperId || additionalSeconds <= 0) return;

  const current = getAnalyticsData();
  const index = current.views.findIndex((v) => v.paperId === paperId);
  if (index === -1) return;

  const updatedViews = [...current.views];
  updatedViews[index] = {
    ...updatedViews[index],
    readDurationSeconds: (updatedViews[index].readDurationSeconds || 0) + additionalSeconds,
  };

  saveAnalyticsData({
    ...current,
    views: updatedViews,
  });
}

/**
 * Seed sample demo research activity for testing or immediate visualization
 */
export function seedSampleAnalytics(): void {
  const now = Date.now();
  const oneDay = 86400000;

  const sampleSearches: SearchEvent[] = [
    {
      id: "demo-s1",
      query: "Crop disease detection with Vision Transformers",
      timestamp: now - oneDay * 0.5,
      resultsCount: 24,
      topics: ["Vision Transformers", "Plant Pathology", "Computer Vision"],
    },
    {
      id: "demo-s2",
      query: "Large Language Models for clinical decision support",
      timestamp: now - oneDay * 1.5,
      resultsCount: 38,
      topics: ["Large Language Models", "Clinical Diagnosis", "Healthcare AI"],
    },
    {
      id: "demo-s3",
      query: "Deep learning models for climate change forecasting",
      timestamp: now - oneDay * 3.2,
      resultsCount: 19,
      topics: ["Climate Modeling", "Deep Learning", "Weather Forecasting"],
    },
    {
      id: "demo-s4",
      query: "Precision agriculture edge AI sensors",
      timestamp: now - oneDay * 4.8,
      resultsCount: 22,
      topics: ["Edge Computing", "Precision Agriculture", "IoT Sensors"],
    },
    {
      id: "demo-s5",
      query: "Quantum computing algorithms for molecular simulation",
      timestamp: now - oneDay * 6.5,
      resultsCount: 15,
      topics: ["Quantum Computing", "Molecular Dynamics", "Computational Chemistry"],
    },
    {
      id: "demo-s6",
      query: "Multimodal AI in biomedical image processing",
      timestamp: now - oneDay * 12,
      resultsCount: 31,
      topics: ["Multimodal AI", "Biomedical Imaging", "Deep Learning"],
    },
  ];

  const sampleViews: PaperViewEvent[] = [
    {
      id: "demo-v1",
      paperId: "https://openalex.org/W4283921829",
      title: "Vision Transformers for High-Precision Plant Leaf Disease Classification",
      authors: ["Zhang, Wei", "Chen, Lin", "Kumar, Rajesh"],
      year: 2024,
      source: "OpenAlex",
      venue: "Computers and Electronics in Agriculture",
      topics: ["Vision Transformers", "Plant Pathology", "Deep Learning"],
      citationCount: 42,
      isOpenAccess: true,
      timestamp: now - oneDay * 0.4,
      readDurationSeconds: 480,
    },
    {
      id: "demo-v2",
      paperId: "https://openalex.org/W3192019283",
      title: "Evaluating Large Language Models in Medical Diagnostic Reasoning: A Multi-Center Study",
      authors: ["Johnson, Emily", "Patel, Amit"],
      year: 2024,
      source: "Nature Medicine",
      venue: "Nature Medicine",
      topics: ["Large Language Models", "Healthcare AI", "Clinical Diagnosis"],
      citationCount: 128,
      isOpenAccess: true,
      timestamp: now - oneDay * 1.2,
      readDurationSeconds: 650,
    },
    {
      id: "demo-v3",
      paperId: "https://openalex.org/W2948291024",
      title: "ClimateNeXt: Physics-Informed Neural Networks for Long-Horizon Global Weather Prediction",
      authors: ["Svensson, Erik", "Müller, Karl"],
      year: 2023,
      source: "arXiv",
      venue: "ICML Climate Workshop",
      topics: ["Climate Modeling", "Neural Networks", "Physics-Informed ML"],
      citationCount: 95,
      isOpenAccess: true,
      timestamp: now - oneDay * 3.0,
      readDurationSeconds: 420,
    },
    {
      id: "demo-v4",
      paperId: "https://openalex.org/W2839482910",
      title: "Edge-Enabled Drone Vision for Real-Time Weed and Pest Monitoring",
      authors: ["Tanaka, Hiroshi", "Santos, Diego"],
      year: 2023,
      source: "IEEE Transactions on Agri-Food",
      venue: "IEEE T-Agri",
      topics: ["Edge Computing", "Precision Agriculture", "Computer Vision"],
      citationCount: 34,
      isOpenAccess: false,
      timestamp: now - oneDay * 4.5,
      readDurationSeconds: 310,
    },
  ];

  saveAnalyticsData({
    searches: sampleSearches,
    views: sampleViews,
    initializedAt: now - oneDay * 15,
  });
}

/**
 * Clear analytics
 */
export function clearAnalytics(): void {
  if (typeof window === "undefined") return;
  const resetData: AnalyticsData = { searches: [], views: [], initializedAt: Date.now() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: resetData }));
  } catch (err) {
    console.error("Failed to clear analytics:", err);
  }
}

/* ────────────────────────────────────────────────────────────────────────
 * Calculations Engine
 * ──────────────────────────────────────────────────────────────────────── */

export interface CalculatedStats {
  projectsCount: number;
  projectsChange: string;
  topicsCount: number;
  topicsChange: string;
  queriesCount: number;
  queriesChange: string;
  hoursSaved: number;
  hoursSavedChange: string;
}

export interface ActivityDay {
  dateStr: string;
  displayLabel: string;
  searches: number;
  views: number;
  total: number;
}

export interface TopicStat {
  topic: string;
  count: number;
  percentage: number;
}

export interface SourceStat {
  source: string;
  count: number;
  percentage: number;
  color: string;
}

export interface AreaStat {
  area: string;
  count: number;
  percentage: number;
  color: string;
  iconBg: string;
}

export interface ResearchInsightsCalculated {
  avgCitations: number;
  openAccessRate: number;
  totalReadMinutes: number;
  peakDayLabel: string;
  mostFrequentVenue: string;
  milestones: { title: string; desc: string; unlocked: boolean }[];
}

export interface AnalyticsCalculations {
  stats: CalculatedStats;
  activityTimeline: ActivityDay[];
  topTopics: TopicStat[];
  sources: SourceStat[];
  researchAreas: AreaStat[];
  insights: ResearchInsightsCalculated;
  totalEventsCount: number;
  hasData: boolean;
}

const SOURCE_COLORS: Record<string, string> = {
  OpenAlex: "#2563EB",
  arXiv: "#DC2626",
  PubMed: "#059669",
  Nature: "#D97706",
  IEEE: "#7C3AED",
  ScienceDirect: "#4F46E5",
  Crossref: "#0891B2",
  SemanticScholar: "#0284C7",
  Other: "#64748B",
};

const AREA_PALETTE: { color: string; iconBg: string }[] = [
  { color: "#2563EB", iconBg: "bg-blue-50" },
  { color: "#10B981", iconBg: "bg-emerald-50" },
  { color: "#F59E0B", iconBg: "bg-amber-50" },
  { color: "#8B5CF6", iconBg: "bg-purple-50" },
  { color: "#EC4899", iconBg: "bg-pink-50" },
  { color: "#06B6D4", iconBg: "bg-cyan-50" },
];

/**
 * Format period delta comparison
 */
function formatDelta(current: number, prev: number): string {
  if (prev === 0 && current === 0) return "— vs. previous period";
  if (prev === 0) return `+${current} vs. previous period`;
  const diff = current - prev;
  const pct = Math.round((diff / prev) * 100);
  if (diff > 0) return `+${pct}% vs. previous period`;
  if (diff < 0) return `${pct}% vs. previous period`;
  return `0% vs. previous period`;
}

/**
 * Compute calculations for a specific time range string
 */
export function computeAnalytics(
  data: AnalyticsData,
  timeRange: string = "Last 30 days"
): AnalyticsCalculations {
  const now = Date.now();
  let days = 30;

  if (timeRange === "Last 7 days") days = 7;
  else if (timeRange === "Last 30 days") days = 30;
  else if (timeRange === "Last 90 days") days = 90;
  else if (timeRange === "All time") days = 365;

  const msPerDay = 86400000;
  const currentCutoff = timeRange === "All time" ? 0 : now - days * msPerDay;
  const prevCutoff = timeRange === "All time" ? 0 : currentCutoff - days * msPerDay;

  // Saved library papers count
  const savedPapers = getSavedPapers();
  const currentSavedCount = savedPapers.filter(
    (p) => (p.savedAt || now) >= currentCutoff
  ).length;
  const prevSavedCount = savedPapers.filter(
    (p) => (p.savedAt || now) < currentCutoff && (p.savedAt || now) >= prevCutoff
  ).length;

  // Filter searches
  const currentSearches = data.searches.filter((s) => s.timestamp >= currentCutoff);
  const prevSearches = data.searches.filter(
    (s) => s.timestamp < currentCutoff && s.timestamp >= prevCutoff
  );

  // Filter views
  const currentViews = data.views.filter((v) => v.timestamp >= currentCutoff);
  const prevViews = data.views.filter(
    (v) => v.timestamp < currentCutoff && v.timestamp >= prevCutoff
  );

  // 1. Projects Stat (Saved Papers + distinct research topics pursued)
  const currentProjects = Math.max(
    currentSavedCount,
    new Set(currentSearches.map((s) => s.query.toLowerCase())).size
  );
  const prevProjects = Math.max(
    prevSavedCount,
    new Set(prevSearches.map((s) => s.query.toLowerCase())).size
  );

  // 2. Topics Explored Stat
  const currentTopicSet = new Set<string>();
  currentSearches.forEach((s) => s.topics?.forEach((t) => currentTopicSet.add(t)));
  currentViews.forEach((v) => v.topics?.forEach((t) => currentTopicSet.add(t)));
  savedPapers.forEach((p) => p.topics?.forEach((t) => currentTopicSet.add(t)));

  const prevTopicSet = new Set<string>();
  prevSearches.forEach((s) => s.topics?.forEach((t) => prevTopicSet.add(t)));
  prevViews.forEach((v) => v.topics?.forEach((t) => prevTopicSet.add(t)));

  const topicsCount = currentTopicSet.size;
  const prevTopicsCount = prevTopicSet.size;

  // 3. Research Queries Stat
  const queriesCount = currentSearches.length;
  const prevQueriesCount = prevSearches.length;

  // 4. Hours Saved Stat
  // Formula: 1.5 hrs per AI synthesis query + 2.0 hrs per paper viewed/analyzed + 0.5 hrs per saved paper
  const currentHours = Math.round(
    queriesCount * 1.5 + currentViews.length * 2.0 + currentSavedCount * 0.5
  );
  const prevHours = Math.round(
    prevQueriesCount * 1.5 + prevViews.length * 2.0 + prevSavedCount * 0.5
  );

  const stats: CalculatedStats = {
    projectsCount: currentProjects,
    projectsChange: formatDelta(currentProjects, prevProjects),
    topicsCount,
    topicsChange: formatDelta(topicsCount, prevTopicsCount),
    queriesCount,
    queriesChange: formatDelta(queriesCount, prevQueriesCount),
    hoursSaved: currentHours,
    hoursSavedChange: formatDelta(currentHours, prevHours),
  };

  // Activity Timeline (Chart bars)
  const bucketCount = days === 7 ? 7 : 8;
  const bucketDuration = (days * msPerDay) / bucketCount;
  const activityTimeline: ActivityDay[] = [];

  for (let i = bucketCount - 1; i >= 0; i--) {
    const bucketEnd = now - i * bucketDuration;
    const bucketStart = bucketEnd - bucketDuration;

    const bSearches = currentSearches.filter(
      (s) => s.timestamp >= bucketStart && s.timestamp < bucketEnd
    ).length;
    const bViews = currentViews.filter(
      (v) => v.timestamp >= bucketStart && v.timestamp < bucketEnd
    ).length;

    const dateObj = new Date(bucketEnd);
    const displayLabel =
      days === 7
        ? dateObj.toLocaleDateString("en-US", { weekday: "short" })
        : dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    activityTimeline.push({
      dateStr: dateObj.toISOString().split("T")[0],
      displayLabel,
      searches: bSearches,
      views: bViews,
      total: bSearches + bViews,
    });
  }

  // Top Research Topics
  const topicCounts: Record<string, number> = {};
  currentSearches.forEach((s) => {
    s.topics?.forEach((t) => {
      topicCounts[t] = (topicCounts[t] || 0) + 1;
    });
  });
  currentViews.forEach((v) => {
    v.topics?.forEach((t) => {
      topicCounts[t] = (topicCounts[t] || 0) + 1;
    });
  });

  const totalTopicOccurrences = Object.values(topicCounts).reduce((a, b) => a + b, 0) || 1;
  const topTopics: TopicStat[] = Object.entries(topicCounts)
    .map(([topic, count]) => ({
      topic,
      count,
      percentage: Math.min(100, Math.round((count / totalTopicOccurrences) * 100)),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Papers by Source
  const sourceCounts: Record<string, number> = {};
  currentViews.forEach((v) => {
    const src = v.source?.trim() || "OpenAlex";
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
  });
  savedPapers.forEach((p) => {
    const src = p.source?.trim() || "OpenAlex";
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
  });

  const totalSourceOccurrences = Object.values(sourceCounts).reduce((a, b) => a + b, 0) || 1;
  const sources: SourceStat[] = Object.entries(sourceCounts)
    .map(([source, count]) => ({
      source,
      count,
      percentage: Math.min(100, Math.round((count / totalSourceOccurrences) * 100)),
      color: SOURCE_COLORS[source] || SOURCE_COLORS["Other"],
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Research Areas
  const areaCounts: Record<string, number> = {};
  Object.keys(topicCounts).forEach((topic) => {
    const area = categorizeTopic(topic);
    areaCounts[area] = (areaCounts[area] || 0) + topicCounts[topic];
  });

  const totalAreaOccurrences = Object.values(areaCounts).reduce((a, b) => a + b, 0) || 1;
  const researchAreas: AreaStat[] = Object.entries(areaCounts)
    .map(([area, count], idx) => ({
      area,
      count,
      percentage: Math.min(100, Math.round((count / totalAreaOccurrences) * 100)),
      color: AREA_PALETTE[idx % AREA_PALETTE.length].color,
      iconBg: AREA_PALETTE[idx % AREA_PALETTE.length].iconBg,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Research Insights
  const totalCitations = currentViews.reduce((acc, v) => acc + (v.citationCount || 0), 0);
  const avgCitations =
    currentViews.length > 0 ? Math.round(totalCitations / currentViews.length) : 0;

  const openAccessCount = currentViews.filter((v) => v.isOpenAccess).length;
  const openAccessRate =
    currentViews.length > 0 ? Math.round((openAccessCount / currentViews.length) * 100) : 0;

  const totalReadSec = currentViews.reduce((acc, v) => acc + (v.readDurationSeconds || 60), 0);
  const totalReadMinutes = Math.round(totalReadSec / 60);

  // Peak day label
  const sortedDays = [...activityTimeline].sort((a, b) => b.total - a.total);
  const peakDayLabel = sortedDays[0]?.total > 0 ? sortedDays[0].displayLabel : "No peak yet";

  // Frequent venue
  const venueCounts: Record<string, number> = {};
  currentViews.forEach((v) => {
    if (v.venue) venueCounts[v.venue] = (venueCounts[v.venue] || 0) + 1;
  });
  const mostFrequentVenue =
    Object.entries(venueCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Academic Journals";

  // Milestones
  const milestones = [
    {
      title: "First Discovery",
      desc: "Conducted your initial literature search query",
      unlocked: queriesCount >= 1,
    },
    {
      title: "Deep Diver",
      desc: "Explored and read 3 or more research papers",
      unlocked: currentViews.length >= 3,
    },
    {
      title: "Cross-Disciplinary",
      desc: "Investigated multiple distinct scientific domains",
      unlocked: researchAreas.length >= 2,
    },
    {
      title: "Open Access Champion",
      desc: "Engaged with accessible open research papers",
      unlocked: openAccessCount >= 1,
    },
  ];

  const totalEventsCount = currentSearches.length + currentViews.length + currentSavedCount;
  const hasData = totalEventsCount > 0;

  return {
    stats,
    activityTimeline,
    topTopics,
    sources,
    researchAreas,
    insights: {
      avgCitations,
      openAccessRate,
      totalReadMinutes,
      peakDayLabel,
      mostFrequentVenue,
      milestones,
    },
    totalEventsCount,
    hasData,
  };
}

/**
 * React hook for consuming analytics reactively
 */
export function useAnalytics(timeRange: string = "Last 30 days") {
  const [data, setData] = useState<AnalyticsData>(() => getAnalyticsData());
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(() => {
    setData(getAnalyticsData());
  }, []);

  useEffect(() => {
    refresh();
    setIsLoaded(true);

    const handleUpdate = () => {
      refresh();
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [refresh]);

  const calculations = computeAnalytics(data, timeRange);

  return {
    raw: data,
    isLoaded,
    calculations,
    recordSearch,
    recordPaperView,
    updatePaperReadDuration,
    seedSampleAnalytics,
    clearAnalytics,
    refresh,
  };
}
