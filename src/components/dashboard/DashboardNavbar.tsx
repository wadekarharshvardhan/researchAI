"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Bell, ChevronDown, LogOut, User, Settings, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DashboardNavbarProps {
  onSignOut?: () => void;
  onToggleSidebar?: () => void;
  onToggleRightbar?: () => void;
  sidebarCollapsed?: boolean;
  activeView?: string;
  onNavigate?: (view: string) => void;
}

const navLinks = [
  { id: "home", label: "Home", href: "/" },
  { id: "explore", label: "Explore", href: "/explore" },
  { id: "library", label: "Library", href: "/library" },
  { id: "pricing", label: "Pricing", href: "/pricing" },
];

export default function DashboardNavbar({
  onSignOut,
  onToggleSidebar,
  onToggleRightbar,
  sidebarCollapsed = false,
  activeView = "home",
  onNavigate,
}: DashboardNavbarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
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

        {/* Center Navigation Links (Hidden on small screens) */}
        <nav className="hidden md:flex items-center gap-1.5" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive =
              activeView === link.id ||
              (activeView === "research" && link.id === "home");

            return (
              <button
                key={link.id}
                type="button"
                onClick={() => onNavigate?.(link.id)}
                className={`px-4 py-1.5 text-sm rounded-full transition-all duration-200 select-none cursor-pointer ${
                  isActive
                    ? "font-semibold text-[#07133D] bg-[#F0F4FA]"
                    : "font-normal text-[#556987] hover:text-[#07133D] hover:bg-slate-50"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Search icon, Notification Bell, User profile */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          {/* Quick Search icon button */}
          <button
            type="button"
            className="p-2 rounded-full text-[#556987] hover:text-[#07133D] hover:bg-slate-100/70 transition-colors cursor-pointer"
            aria-label="Quick search"
          >
            <Search className="w-4 sm:w-5 h-4 sm:h-5" strokeWidth={2.2} />
          </button>

          {/* Notifications Bell with unread red badge */}
          <button
            type="button"
            className="relative p-2 rounded-full text-[#556987] hover:text-[#07133D] hover:bg-slate-100/70 transition-colors cursor-pointer"
            aria-label="Notifications (1 unread)"
          >
            <Bell className="w-4 sm:w-5 h-4 sm:h-5" strokeWidth={2.2} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white" />
          </button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen((v) => !v)}
              className="flex items-center gap-2.5 p-1 pl-1.5 pr-2 rounded-full hover:bg-slate-100/70 transition-all cursor-pointer select-none"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              {/* Blue Avatar circle with "H" */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm"
                style={{
                  background: "linear-gradient(135deg, #205DF8 0%, #1546CC 100%)",
                }}
              >
                H
              </div>

              {/* User Name */}
              <span className="hidden sm:inline text-sm font-semibold text-[#07133D]">
                Harshvardhan
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
                    <p className="text-xs font-semibold text-[#07133D]">Harshvardhan</p>
                    <p className="text-[11px] text-[#64748B] truncate">harshvardhan@research.ai</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#475569] hover:text-[#07133D] hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>My Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#475569] hover:text-[#07133D] hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Account Settings</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      onSignOut?.();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#DC2626] hover:bg-red-50/70 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-[#DC2626]" />
                    <span>Sign Out (Landing Page)</span>
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
