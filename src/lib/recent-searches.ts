"use client";

import { useState, useEffect } from "react";

export interface RecentSearchItem {
  id: string;
  query: string;
  timestamp: number;
}

const STORAGE_KEY = "researchai_recent_searches";
const EVENT_NAME = "researchai_recent_searches_updated";

export function getRecentSearches(): RecentSearchItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string): RecentSearchItem[] {
  if (typeof window === "undefined") return [];
  const trimmed = query.trim();
  if (!trimmed) return getRecentSearches();

  try {
    const current = getRecentSearches();
    // Filter out duplicates (case-insensitive)
    const filtered = current.filter(
      (item) => item.query.toLowerCase() !== trimmed.toLowerCase()
    );
    const newItem: RecentSearchItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      query: trimmed,
      timestamp: Date.now(),
    };
    // Keep up to 15 recent searches
    const updated = [newItem, ...filtered].slice(0, 15);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
    return updated;
  } catch (err) {
    console.error("Failed to add recent search:", err);
    return [];
  }
}

export function removeRecentSearch(id: string): RecentSearchItem[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getRecentSearches();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
    return updated;
  } catch {
    return [];
  }
}

export function clearRecentSearches(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: [] }));
  } catch {
    // ignore
  }
}

export function formatRelativeTime(timestamp: number): string {
  const diff = Math.max(0, Date.now() - timestamp);
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

export function useRecentSearches() {
  const [searches, setSearches] = useState<RecentSearchItem[]>([]);

  useEffect(() => {
    // Initial load
    setSearches(getRecentSearches());

    const handleUpdate = () => {
      setSearches(getRecentSearches());
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    // Refresh relative times periodically every 30 seconds
    const interval = setInterval(handleUpdate, 30000);

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      clearInterval(interval);
    };
  }, []);

  return {
    recentSearches: searches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  };
}
