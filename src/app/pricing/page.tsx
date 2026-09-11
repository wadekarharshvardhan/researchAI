"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import Dashboard from "@/components/dashboard/Dashboard";
import PricingPage from "@/components/pricing/PricingPage";
import AuthModal, { AuthMode } from "@/components/auth/AuthModal";
import { useSession, signOut } from "@/lib/auth-client";

export default function PricingPageRoute() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signin");

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

  const handleSuccessfulAuth = useCallback(() => {
    setAuthModalOpen(false);
    setIsSignedIn(true);
    try {
      localStorage.setItem("researchai_signed_in", "true");
    } catch {
      // ignore
    }
    router.push("/");
  }, [router]);

  const handleSignOut = useCallback(() => {
    setIsSignedIn(false);
    try {
      localStorage.removeItem("researchai_signed_in");
    } catch {
      // ignore
    }
    signOut().catch((e) => console.error("Sign out error:", e));
  }, []);

  if (isSignedIn) {
    return <Dashboard initialView="home" onSignOut={handleSignOut} />;
  }

  return (
    <div className="min-h-screen bg-[#EEF4FD]">
      <Navbar
        activePath="/pricing"
        onOpenSignIn={handleOpenSignIn}
        onOpenSignUp={handleOpenSignUp}
      />
      <div className="pt-20 sm:pt-24">
        <PricingPage
          onGetStarted={handleOpenSignUp}
          onContactSales={handleOpenSignUp}
        />
      </div>
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleSuccessfulAuth}
      />
    </div>
  );
}
