"use client";

import { useState, useCallback, useEffect } from "react";
import Navbar from "@/components/navbar/Navbar";
import Hero from "@/components/hero/Hero";
import AuthModal, { AuthMode } from "@/components/auth/AuthModal";
import Dashboard from "@/components/dashboard/Dashboard";
import { motion, AnimatePresence } from "motion/react";
import { useSession, signOut } from "@/lib/auth-client";

export default function Home() {
  const { data: session } = useSession();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  // Pending search query from the landing page, sent to dashboard after sign-in
  const [pendingQuery, setPendingQuery] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("researchai_signed_in");
      if (saved === "true" || !!session?.user) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    } catch {
      if (session?.user) {
        setIsSignedIn(true);
      }
    }
  }, [session]);

  const handleOpenSignIn = useCallback(() => {
    setAuthMode("signin");
    setAuthModalOpen(true);
  }, []);

  const handleOpenSignUp = useCallback(() => {
    setAuthMode("signup");
    setAuthModalOpen(true);
  }, []);

  const handleCloseAuth = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  // Called when the hero search bar is submitted — open sign-in modal first
  const handleHeroSearch = useCallback((query: string) => {
    setPendingQuery(query);
    setAuthMode("signin");
    setAuthModalOpen(true);
  }, []);

  // Called when auth modal form is successfully submitted
  const handleSuccessfulAuth = useCallback(() => {
    setAuthModalOpen(false);
    setIsSignedIn(true);
    try {
      localStorage.setItem("researchai_signed_in", "true");
    } catch {
      // ignore
    }
  }, []);

  const handleSignOut = useCallback(() => {
    setIsSignedIn(false);
    try {
      localStorage.removeItem("researchai_signed_in");
    } catch {
      // ignore
    }
    signOut().catch((e) => console.error("Sign out error:", e));
  }, []);

  return (
    <div className="min-h-screen bg-[#EEF4FD]">
      <AnimatePresence mode="wait">
        {isSignedIn ? (
          /* ── Signed-In Homepage (Dashboard) ───────────────── */
          <motion.div
            key="dashboard-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Dashboard
              onSignOut={handleSignOut}
              initialQuery={pendingQuery}
              initialView="home"
            />
          </motion.div>
        ) : (
          /* ── Signed-Out Landing Page ───────────────────────── */
          <motion.div
            key="landing-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-screen relative"
          >
            <Navbar
              onOpenSignIn={handleOpenSignIn}
              onOpenSignUp={handleOpenSignUp}
            />
            <Hero onSearch={handleHeroSearch} />
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={handleCloseAuth}
        onSuccess={handleSuccessfulAuth}
      />
    </div>
  );
}
