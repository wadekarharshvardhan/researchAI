"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "Library", href: "/library" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Docs", href: "/docs" },
];

interface NavbarProps {
  onOpenSignIn?: () => void;
  onOpenSignUp?: () => void;
  activePath?: string;
  isSignedIn?: boolean;
}

export default function Navbar({ onOpenSignIn, onOpenSignUp, activePath, isSignedIn }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), []);

  const AUTH_GATED = new Set(["/explore", "/library"]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent, href: string) => {
      if (!isSignedIn && AUTH_GATED.has(href)) {
        e.preventDefault();
        onOpenSignUp?.();
      }
    },
    [isSignedIn, onOpenSignUp]
  );

  const isLinkActive = (href: string) => {
    if (activePath) {
      return activePath === href;
    }
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-4 sm:pt-5 px-4 pointer-events-none">
      {/* Desktop / Tablet ultra-glassmorphic pill navbar */}
      <nav
        className="pointer-events-auto w-full max-w-[1040px] flex items-center justify-between pl-6 sm:pl-7 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-full transition-all duration-300"
        style={{
          background: "rgba(255, 255, 255, 0.32)",
          backdropFilter: "blur(24px) saturate(190%)",
          WebkitBackdropFilter: "blur(24px) saturate(190%)",
          border: "1px solid rgba(255, 255, 255, 0.65)",
          boxShadow:
            "0 12px 36px -8px rgba(15, 35, 90, 0.07), 0 2px 6px rgba(0, 0, 0, 0.02), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.9), inset 0 -1px 2px 0 rgba(255, 255, 255, 0.25)",
        }}
        aria-label="Primary navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 select-none py-0.5 group"
          aria-label="ResearchAI home"
        >
          <Image
            src="/images/logoblue.png"
            alt="ResearchAI"
            width={180}
            height={48}
            className="h-9 sm:h-10 md:h-[42px] w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            priority
          />
        </Link>

        {/* Center links — hidden on mobile */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {navLinks.map((link) => {
            const active = isLinkActive(link.href);
            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-4 sm:px-5 py-2 text-[14px] transition-all duration-200 block select-none ${
                    active
                      ? "font-medium text-[#0F1A43] bg-[#E8EDFF]/70 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_1px_2px_rgba(40,80,180,0.03)] border border-[#D5E1FD]/70 backdrop-blur-sm"
                      : "font-normal text-[#556482] hover:text-[#0F1A43] hover:bg-white/30 rounded-full"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenSignIn}
            className="hidden md:block text-[14px] font-normal text-[#556482] hover:text-[#0F1A43] hover:bg-white/30 rounded-full transition-colors px-3.5 py-1.5 cursor-pointer"
          >
            Sign in
          </button>

          <button
            type="button"
            onClick={onOpenSignUp}
            className="flex items-center gap-2 px-5 py-2.5 text-[14px] font-medium text-white rounded-full transition-all duration-200 hover:bg-[#121E48] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            style={{
              background: "#07133D",
              boxShadow:
                "0 4px 14px rgba(7, 19, 61, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.25)",
            }}
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.2} />
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer ml-1"
            onClick={toggleMobile}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="w-5 h-5 text-[#07133D]" />
            ) : (
              <Menu className="w-5 h-5 text-[#07133D]" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-auto absolute top-[calc(100%+8px)] left-4 right-4 rounded-2xl p-4 z-50"
            style={{
              background: "rgba(255, 255, 255, 0.75)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.8)",
              boxShadow:
                "0 12px 36px rgba(20, 50, 120, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.9)",
            }}
          >
            <ul className="flex flex-col gap-1 mb-3" role="list">
              {navLinks.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={(e) => {
                        if (!isSignedIn && AUTH_GATED.has(link.href)) {
                          e.preventDefault();
                          setMobileOpen(false);
                          onOpenSignUp?.();
                        } else {
                          setMobileOpen(false);
                        }
                      }}
                      className={`block px-4 py-2.5 rounded-xl text-sm transition-colors ${
                        active
                          ? "bg-[#E8EDFF]/80 text-[#0F1A43] font-medium"
                          : "text-[#556482] hover:bg-white/50 hover:text-[#0F1A43] font-normal"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenSignIn?.();
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-[#556482] hover:bg-white/50 hover:text-[#0F1A43] transition-colors cursor-pointer"
                >
                  Sign in
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenSignUp?.();
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-[#205DF8] bg-blue-50/60 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  Get Started →
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
