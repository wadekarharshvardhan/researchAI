"use client";

import { useState, useEffect, useCallback } from "react";
import type { ResearchPaper } from "@/types/research-paper";
import { getSavedPapers } from "./library-papers";

export type HighlightColor = "yellow" | "blue" | "green" | "purple";

export interface PaperHighlight {
  id: string;
  paperId: string;
  text: string;
  color: HighlightColor;
  note?: string;
  createdAt: number;
}

const HIGHLIGHTS_STORAGE_KEY_PREFIX = "researchai_highlights_";
const ACTIVE_PAPER_KEY = "researchai_active_reader_paper";
const HIGHLIGHT_EVENT = "researchai:highlights-updated";

export const HIGHLIGHT_COLORS: Record<HighlightColor, { bg: string; border: string; label: string }> = {
  yellow: { bg: "rgba(254, 240, 138, 0.65)", border: "#FDE047", label: "Yellow" },
  blue: { bg: "rgba(186, 230, 253, 0.65)", border: "#7DD3FC", label: "Blue" },
  green: { bg: "rgba(187, 247, 208, 0.65)", border: "#86EFAC", label: "Green" },
  purple: { bg: "rgba(233, 213, 255, 0.65)", border: "#D8B4FE", label: "Purple" },
};

/**
 * Set active paper before opening reader in a new tab.
 */
export function setActiveReaderPaper(paper: ResearchPaper): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(ACTIVE_PAPER_KEY, JSON.stringify(paper));
    localStorage.setItem(ACTIVE_PAPER_KEY, JSON.stringify(paper));
  } catch (err) {
    console.error("Failed to set active reader paper:", err);
  }
}

/**
 * Get active paper in the reader tab.
 */
export function getActiveReaderPaper(paperId?: string | null): ResearchPaper | null {
  if (typeof window === "undefined") return null;
  try {
    // 1. Check sessionStorage
    const sessionRaw = sessionStorage.getItem(ACTIVE_PAPER_KEY);
    if (sessionRaw) {
      const parsed = JSON.parse(sessionRaw);
      if (!paperId || parsed.id === paperId) return parsed;
    }

    // 2. Check localStorage
    const localRaw = localStorage.getItem(ACTIVE_PAPER_KEY);
    if (localRaw) {
      const parsed = JSON.parse(localRaw);
      if (!paperId || parsed.id === paperId) return parsed;
    }

    // 3. Look up in saved library papers
    if (paperId) {
      const savedPapers = getSavedPapers();
      const match = savedPapers.find((p) => p.id === paperId);
      if (match) return match;
    }
  } catch (err) {
    console.error("Failed to get active reader paper:", err);
  }
  return null;
}

/**
 * Retrieve highlights for a specific paper.
 */
export function getPaperHighlights(paperId: string): PaperHighlight[] {
  if (typeof window === "undefined" || !paperId) return [];
  try {
    const raw = localStorage.getItem(`${HIGHLIGHTS_STORAGE_KEY_PREFIX}${paperId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to get paper highlights:", err);
    return [];
  }
}

/**
 * Add a highlight for a paper.
 */
export function addPaperHighlight(
  paperId: string,
  text: string,
  color: HighlightColor = "yellow",
  note?: string
): PaperHighlight {
  const current = getPaperHighlights(paperId);
  const newHighlight: PaperHighlight = {
    id: `hl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    paperId,
    text: text.trim(),
    color,
    note: note?.trim(),
    createdAt: Date.now(),
  };

  const updated = [newHighlight, ...current];
  try {
    localStorage.setItem(`${HIGHLIGHTS_STORAGE_KEY_PREFIX}${paperId}`, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(HIGHLIGHT_EVENT, { detail: { paperId, highlight: newHighlight } }));
  } catch (err) {
    console.error("Failed to save highlight:", err);
  }

  return newHighlight;
}

/**
 * Remove a highlight by ID.
 */
export function removePaperHighlight(paperId: string, highlightId: string): void {
  const current = getPaperHighlights(paperId);
  const updated = current.filter((h) => h.id !== highlightId);

  try {
    localStorage.setItem(`${HIGHLIGHTS_STORAGE_KEY_PREFIX}${paperId}`, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(HIGHLIGHT_EVENT, { detail: { paperId, highlightId } }));
  } catch (err) {
    console.error("Failed to remove highlight:", err);
  }
}

/**
 * Hook for consuming highlights reactively for a given paper.
 */
export function usePaperHighlights(paperId: string) {
  const [highlights, setHighlights] = useState<PaperHighlight[]>([]);

  const refresh = useCallback(() => {
    if (paperId) {
      setHighlights(getPaperHighlights(paperId));
    }
  }, [paperId]);

  useEffect(() => {
    refresh();

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ paperId?: string }>;
      if (!customEvent.detail || customEvent.detail.paperId === paperId) {
        refresh();
      }
    };

    window.addEventListener(HIGHLIGHT_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(HIGHLIGHT_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [paperId, refresh]);

  return {
    highlights,
    addHighlight: (text: string, color: HighlightColor = "yellow", note?: string) =>
      addPaperHighlight(paperId, text, color, note),
    removeHighlight: (id: string) => removePaperHighlight(paperId, id),
    refresh,
  };
}
