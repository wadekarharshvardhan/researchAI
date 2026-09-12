"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  CheckCheck,
  Check,
  Sparkles,
  BookOpen,
  FileText,
  Trash2,
  Bookmark,
  Download,
  Copy,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { signOut, useSession } from "@/lib/auth-client";
import { useNotifications, formatNotificationTime } from "@/lib/notifications";

interface DashboardNavbarProps {
  onSignOut?: () => void;
  onToggleSidebar?: () => void;
  onToggleRightbar?: () => void;
  sidebarCollapsed?: boolean;
  activeView?: string;
  onNavigate?: (view: string) => void;
}

export default function DashboardNavbar({
  onSignOut,
  onToggleSidebar,
  onToggleRightbar,
  sidebarCollapsed = false,
  activeView = "home",
  onNavigate,
}: DashboardNavbarProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
    toggleRead,
    removeNotification,
    clearAll,
  } = useNotifications();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const userName = session?.user?.name || "";
  const userEmail = session?.user?.email || "";
  const userImage = session?.user?.image;
  const userInitial = (userName.charAt(0) || "H").toUpperCase();

  const handleSignOutClick = () => {
    setUserMenuOpen(false);
    try {
      localStorage.removeItem("researchai_signed_in");
    } catch {
      // ignore
    }
    if (onSignOut) {
      onSignOut();
    }
    // Background server session cleanup (non-blocking)
    signOut().catch((err) => console.error("Sign out error:", err));

    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      router.push("/");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/75 backdrop-blur-xl border-b border-[#E7EEF8]/80 transition-all">
      <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Sidebar toggle + Logo */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-[#556987] hover:text-[#07133D] hover:bg-slate-100/90 transition-colors cursor-pointer"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="w-5 h-5" strokeWidth={1.9} />
            ) : (
              <PanelLeftClose className="w-5 h-5" strokeWidth={1.9} />
            )}
          </button>

          <Link
            href="/"
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate("home");
              }
            }}
            className="flex items-center gap-2 select-none group"
          >
            <Image
              src="/images/logoblue.png"
              alt="ResearchAI"
              width={190}
              height={48}
              className="h-9 sm:h-10 md:h-[42px] w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03]"
              priority
            />
          </Link>
        </div>

        {/* Right Actions: Search icon, Notification Bell, User profile */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          {/* Notifications Bell with unread red badge & popover */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => {
                setNotificationsOpen((prev) => !prev);
                setUserMenuOpen(false);
              }}
              className={`relative p-2 rounded-full transition-colors cursor-pointer ${
                notificationsOpen
                  ? "text-[#2563EB] bg-blue-50"
                  : "text-[#556987] hover:text-[#07133D] hover:bg-slate-100/70"
              }`}
              aria-label={`Notifications (${unreadCount} unread)`}
              aria-expanded={notificationsOpen}
              aria-haspopup="true"
            >
              <Bell className="w-4 sm:w-5 h-4 sm:h-5" strokeWidth={2.2} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#EF4444] ring-2 ring-white" />
              )}
            </button>

            {/* Notifications Dropdown Popover */}
            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="fixed sm:absolute left-3.5 right-3.5 sm:left-auto sm:right-0 top-16 sm:top-full mt-2 max-w-[380px] sm:w-[380px] mx-auto sm:mx-0 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.14)] border border-[#E2E8F0] z-50 overflow-hidden select-none"
                >
                  {/* Popover Header */}
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#07133D]">Notifications</h3>
                      {unreadCount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-[#2563EB]">
                          {unreadCount} unread
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500">
                          All caught up
                        </span>
                      )}
                    </div>

                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllAsRead}
                        className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 hover:underline cursor-pointer"
                        title="Mark all notifications as read"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Mark all as read</span>
                      </button>
                    )}
                  </div>

                  {/* Notifications List */}
                  <div
                    className="max-h-[380px] overflow-y-auto divide-y divide-slate-100"
                    style={{ scrollbarWidth: "thin" }}
                  >
                    {notifications.length > 0 ? (
                      notifications.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => markAsRead(item.id)}
                          className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer group ${
                            item.read
                              ? "bg-white hover:bg-slate-50/90"
                              : "bg-[#F4F8FE] hover:bg-[#EBF3FD]"
                          }`}
                        >
                          {/* Notification Type Icon */}
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                              item.type === "save"
                                ? "bg-blue-100/70 text-[#2563EB]"
                                : item.type === "download"
                                ? "bg-purple-100/70 text-purple-600"
                                : item.type === "copy"
                                ? "bg-emerald-100/70 text-emerald-600"
                                : item.type === "status"
                                ? "bg-amber-100/70 text-amber-600"
                                : "bg-blue-100/70 text-blue-600"
                            }`}
                          >
                            {item.type === "save" && (
                              <Bookmark className="w-4 h-4" strokeWidth={2.2} />
                            )}
                            {item.type === "download" && (
                              <Download className="w-4 h-4" strokeWidth={2.2} />
                            )}
                            {item.type === "copy" && (
                              <Copy className="w-4 h-4" strokeWidth={2.2} />
                            )}
                            {item.type === "status" && (
                              <Sparkles className="w-4 h-4" strokeWidth={2.2} />
                            )}
                            {(item.type === "library" || item.type === "export") && (
                              <BookOpen className="w-4 h-4" strokeWidth={2.2} />
                            )}
                          </div>

                          {/* Text content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <h4 className="text-xs font-bold text-[#07133D] truncate">
                                {item.title}
                              </h4>
                              {!item.read && (
                                <span className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0" />
                              )}
                            </div>
                            <p className="text-[11.5px] text-[#556987] leading-relaxed line-clamp-2">
                              {item.message}
                            </p>
                            <div className="flex items-center justify-between mt-1.5 pt-0.5">
                              <span className="text-[10.5px] text-[#8DA0BC] font-medium">
                                {formatNotificationTime(item.timestamp)}
                              </span>
                              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleRead(item.id);
                                  }}
                                  className="text-[10.5px] font-medium text-[#2563EB] hover:underline"
                                >
                                  {item.read ? "Mark unread" : "Mark read"}
                                </button>
                                <span className="text-slate-300">•</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeNotification(item.id);
                                  }}
                                  className="text-slate-400 hover:text-red-500 transition-colors"
                                  title="Dismiss notification"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 px-6 text-center">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2.5">
                          <Bell className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-[#07133D]">No notifications yet</p>
                        <p className="text-[11.5px] text-slate-500 mt-1 max-w-[220px] mx-auto leading-relaxed">
                          When you save papers, download PDFs, or copy links, your notifications will appear here.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Popover Footer */}
                  {notifications.length > 0 && (
                    <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{notifications.length} notifications</span>
                      <button
                        type="button"
                        onClick={clearAll}
                        className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen((v) => !v)}
              className="flex items-center gap-2.5 p-1 pl-1.5 pr-2 rounded-full hover:bg-slate-100/70 transition-all cursor-pointer select-none"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              {/* User Avatar */}
              {userImage ? (
                <img
                  src={userImage}
                  alt={userName}
                  className="w-8 h-8 rounded-full object-cover border border-[#E2E8F0] shadow-sm"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm"
                  style={{
                    background: "linear-gradient(135deg, #205DF8 0%, #1546CC 100%)",
                  }}
                >
                  {userInitial}
                </div>
              )}

              {/* User Name */}
              <span className="hidden sm:inline text-sm font-semibold text-[#07133D]">
                {userName}
              </span>

              <ChevronDown
                className={`w-3.5 h-3.5 text-[#6B7FA2] transition-transform duration-200 ${
                  userMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.14)] border border-[#E2E8F0] p-1.5 z-50 overflow-hidden"
                >
                  <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                    <p className="text-xs font-semibold text-[#07133D] truncate">{userName}</p>
                    <p className="text-[11px] text-[#64748B] truncate">{userEmail}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      if (onNavigate) {
                        onNavigate("profile");
                      } else {
                        router.push("/settings");
                      }
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#475569] hover:text-[#07133D] hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>My Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      if (onNavigate) {
                        onNavigate("settings");
                      } else {
                        router.push("/settings");
                      }
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#475569] hover:text-[#07133D] hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Account Settings</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    type="button"
                    onClick={handleSignOutClick}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#DC2626] hover:bg-red-50/70 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-[#DC2626]" />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
