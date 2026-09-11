"use client";

import { useState, useEffect, useCallback } from "react";

export type NotificationType = "save" | "download" | "copy" | "status" | "library" | "export";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  type: NotificationType;
}

const STORAGE_KEY = "researchai_notifications";
const EVENT_NAME = "researchai:notifications-updated";

/**
 * Format relative time string for notifications.
 */
export function formatNotificationTime(timestamp: number): string {
  if (!timestamp) return "Just now";
  const now = Date.now();
  const diffSec = Math.floor((now - timestamp) / 1000);

  if (diffSec < 45) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin === 1) return "1m ago";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours === 1) return "1h ago";
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return "Recently";
}

/**
 * Get all notifications from localStorage (starts empty).
 */
export function getNotifications(): NotificationItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Filter out any legacy dummy notifications
    const clean = parsed.filter(
      (n: NotificationItem) =>
        n && !["notif-1", "notif-2", "notif-3", "notif-4"].includes(n.id)
    );
    return clean;
  } catch (err) {
    console.error("Failed to parse notifications:", err);
    return [];
  }
}

/**
 * Add a new real notification based on user activity.
 */
export function addNotification(
  title: string,
  message: string,
  type: NotificationType = "save"
): NotificationItem {
  const current = getNotifications();
  const newNotif: NotificationItem = {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title,
    message,
    timestamp: Date.now(),
    read: false,
    type,
  };

  // Keep up to 30 most recent notifications
  const updated = [newNotif, ...current].slice(0, 30);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: newNotif }));
  } catch (err) {
    console.error("Failed to save notification:", err);
  }

  return newNotif;
}

/**
 * Mark all notifications as read.
 */
export function markAllNotificationsAsRead(): void {
  const current = getNotifications();
  const updated = current.map((n) => ({ ...n, read: true }));

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch (err) {
    console.error("Failed to mark all as read:", err);
  }
}

/**
 * Mark a single notification as read or unread.
 */
export function toggleNotificationRead(id: string): void {
  const current = getNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, read: !n.read } : n));

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch (err) {
    console.error("Failed to toggle notification read:", err);
  }
}

/**
 * Mark a single notification as read.
 */
export function markNotificationAsRead(id: string): void {
  const current = getNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch (err) {
    console.error("Failed to mark notification as read:", err);
  }
}

/**
 * Remove a single notification.
 */
export function removeNotification(id: string): void {
  const current = getNotifications();
  const updated = current.filter((n) => n.id !== id);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch (err) {
    console.error("Failed to remove notification:", err);
  }
}

/**
 * Clear all notifications.
 */
export function clearAllNotifications(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch (err) {
    console.error("Failed to clear notifications:", err);
  }
}

/**
 * Reactive hook for consuming notifications.
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(() => {
    setNotifications(getNotifications());
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

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    isLoaded,
    addNotification,
    markAllAsRead: markAllNotificationsAsRead,
    markAsRead: markNotificationAsRead,
    toggleRead: toggleNotificationRead,
    removeNotification,
    clearAll: clearAllNotifications,
    refresh,
  };
}
