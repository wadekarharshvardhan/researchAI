"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, User, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export type AuthMode = "signin" | "signup";

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: AuthMode;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({
  isOpen,
  initialMode = "signin",
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loadingProvider, setLoadingProvider] = useState<"google" | "github" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync mode with initialMode when opened
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setShowPassword(false);
      setErrorMessage(null);
      setLoadingProvider(null);
      setIsSubmitting(false);
    }
  }, [isOpen, initialMode]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll without layout shift
  useEffect(() => {
    if (!isOpen) return;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  const handleSocialSignIn = async (provider: "google" | "github") => {
    try {
      setLoadingProvider(provider);
      setErrorMessage(null);
      const res = await authClient.signIn.social({
        provider,
        callbackURL: window.location.origin + "/",
      });
      if (res?.error) {
        setErrorMessage(res.error.message || `Failed to sign in with ${provider}`);
        setLoadingProvider(null);
        return;
      }
      if (res?.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : `Failed to sign in with ${provider}`;
      setErrorMessage(msg);
      setLoadingProvider(null);
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMessage(null);
      setIsSubmitting(true);
      try {
        if (mode === "signup") {
          const { error } = await authClient.signUp.email({
            email,
            password,
            name: name || email.split("@")[0],
            callbackURL: window.location.origin + "/",
          });
          if (error) {
            setErrorMessage(error.message || "Failed to sign up");
            setIsSubmitting(false);
            return;
          }
        } else {
          const { error } = await authClient.signIn.email({
            email,
            password,
            callbackURL: window.location.origin + "/",
          });
          if (error) {
            setErrorMessage(error.message || "Invalid email or password");
            setIsSubmitting(false);
            return;
          }
        }
        try {
          localStorage.setItem("researchai_signed_in", "true");
        } catch {
          // ignore
        }
        onClose();
        onSuccess?.();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Authentication failed";
        setErrorMessage(msg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [mode, name, email, password, onClose, onSuccess]
  );

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
          {/* ── Dark Frost Backdrop ───────────────────────────── */}
          <motion.div
            className="fixed inset-0 bg-[#07133D]/45 backdrop-blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              willChange: "opacity",
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
              transform: "translateZ(0)",
            }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* ── Modal Card Container ──────────────────────────── */}
          <motion.div
            className="relative w-full max-w-[820px] bg-white rounded-[26px] sm:rounded-[32px] overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.3),0_10px_25px_rgba(0,0,0,0.12)] border border-white/80 flex flex-col md:flex-row z-10 my-auto"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 360,
              mass: 0.8,
            }}
            style={{
              willChange: "transform, opacity",
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
              transform: "translateZ(0)",
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* ── Close Button (Top-Right) ───────────────────── */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer z-30"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" strokeWidth={2.2} />
            </button>

            {/* ── Left Column: Ethereal Branding & Illustration ── */}
            <div
              className="hidden md:flex w-[42%] shrink-0 flex-col justify-between p-7 sm:p-8 relative select-none overflow-hidden"
              style={{
                background:
                  "linear-gradient(175deg, #F0F5FD 0%, #E2EEFC 50%, #D4E5FA 100%)",
              }}
            >
              {/* Subtle ambient gradient highlights */}
              <div
                className="absolute -top-16 -left-16 w-48 h-48 rounded-full pointer-events-none opacity-50"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.9) 0%, transparent 70%)",
                  filter: "blur(20px)",
                }}
              />

              {/* Logo */}
              <div className="relative z-10">
                <Image
                  src="/images/logoblue.png"
                  alt="ResearchAI"
                  width={132}
                  height={34}
                  className="h-7 w-auto object-contain"
                  priority
                />

                {/* Heading */}
                <h2 className="text-[23px] lg:text-[25px] font-extrabold text-[#07133D] leading-[1.22] mt-6 mb-2.5 tracking-tight">
                  Continue your <br />
                  <span className="text-[#205DF8]">research journey</span>
                </h2>

                {/* Subtitle */}
                <p className="text-xs text-[#556987] leading-relaxed">
                  Sign in to save your research, get personalized insights, and
                  access advanced AI features.
                </p>
              </div>

              {/* Center 3D Illustration */}
              <div className="relative my-auto py-3 flex items-center justify-center">
                <Image
                  src="/images/modal_illustration.png"
                  alt="Research papers and magnifying glass illustration"
                  width={575}
                  height={360}
                  unoptimized
                  className="w-[96%] max-w-[250px] h-auto object-contain select-none mix-blend-multiply"
                />
              </div>

              {/* Bottom Testimonial Quote & Pagination Indicators */}
              <div className="relative z-10 mt-auto pt-2">
                <p className="text-xs font-medium text-[#465E87] leading-snug">
                  <span className="text-[#205DF8] text-base font-serif font-bold select-none mr-1">
                    “
                  </span>
                  A more curious world builds a brighter tomorrow.
                  <span className="text-[#205DF8] text-base font-serif font-bold select-none ml-1">
                    ”
                  </span>
                </p>

                {/* 3 Pagination pill dashes */}
                <div className="flex items-center gap-1.5 mt-3">
                  <span className="w-6 h-1 rounded-full bg-[#205DF8]" />
                  <span className="w-6 h-1 rounded-full bg-[#BFD7F8]" />
                  <span className="w-6 h-1 rounded-full bg-[#BFD7F8]" />
                </div>
              </div>
            </div>

            {/* ── Right Column: Interactive Form & Mode Switch ──── */}
            <div className="w-full md:w-[58%] bg-white p-6 sm:p-8 lg:p-9 flex flex-col justify-between relative">
              <div>
                {/* Segmented Switch: Sign In vs Sign Up */}
                <div className="flex justify-center mb-5 sm:mb-6">
                  <div className="inline-flex p-1 rounded-full bg-[#F0F4FA] border border-[#E1EAF4]">
                    <button
                      type="button"
                      onClick={() => setMode("signin")}
                      className={`px-6 sm:px-7 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                        mode === "signin"
                          ? "bg-[#E8EDFF] text-[#205DF8] shadow-sm font-semibold"
                          : "text-[#667C9D] hover:text-[#07133D]"
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className={`px-6 sm:px-7 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                        mode === "signup"
                          ? "bg-[#E8EDFF] text-[#205DF8] shadow-sm font-semibold"
                          : "text-[#667C9D] hover:text-[#07133D]"
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>

                {/* Form Title & Subtitle */}
                <div className="mb-5">
                  <h3
                    id="modal-title"
                    className="text-[22px] sm:text-2xl font-bold text-[#07133D] tracking-tight mb-1"
                  >
                    {mode === "signin" ? "Welcome back" : "Create an account"}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#6B7FA2]">
                    {mode === "signin"
                      ? "Sign in to your ResearchAI account"
                      : "Start your AI-powered research journey today"}
                  </p>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="mb-3.5 p-3 bg-red-50/90 border border-red-200/90 text-red-600 rounded-xl text-xs font-medium flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-4">
                  {/* Google Button */}
                  <button
                    type="button"
                    disabled={loadingProvider !== null || isSubmitting}
                    onClick={() => handleSocialSignIn("google")}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 border border-[#E2E8F0] hover:border-slate-300 hover:bg-slate-50/70 rounded-xl text-xs font-medium text-[#1E293B] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loadingProvider === "google" ? (
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    ) : (
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    )}
                    <span className="truncate">
                      {loadingProvider === "google" ? "Connecting..." : "Continue with Google"}
                    </span>
                  </button>

                  {/* GitHub Button */}
                  <button
                    type="button"
                    disabled={loadingProvider !== null || isSubmitting}
                    onClick={() => handleSocialSignIn("github")}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 border border-[#E2E8F0] hover:border-slate-300 hover:bg-slate-50/70 rounded-xl text-xs font-medium text-[#1E293B] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loadingProvider === "github" ? (
                      <Loader2 className="w-4 h-4 animate-spin text-slate-800" />
                    ) : (
                      <svg
                        className="w-4 h-4 shrink-0 fill-current text-[#0F172A]"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        />
                      </svg>
                    )}
                    <span className="truncate">
                      {loadingProvider === "github" ? "Connecting..." : "Continue with GitHub"}
                    </span>
                  </button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-3.5">
                  <div className="border-t border-[#E8EEF5] w-full" />
                  <span className="bg-white px-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                    or
                  </span>
                </div>

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* Name field in Sign Up mode */}
                  {mode === "signup" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                        Full Name
                      </label>
                      <div className="relative flex items-center">
                        <User className="absolute left-3.5 w-4 h-4 text-[#94A3B8] pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#205DF8] focus:ring-2 focus:ring-[#205DF8]/15 outline-none text-sm text-[#07133D] placeholder:text-[#94A3B8] transition-all"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Email field */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                      Email
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3.5 w-4 h-4 text-[#94A3B8] pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#205DF8] focus:ring-2 focus:ring-[#205DF8]/15 outline-none text-sm text-[#07133D] placeholder:text-[#94A3B8] transition-all"
                      />
                    </div>
                  </div>

                  {/* Password field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-[#1E293B]">
                        Password
                      </label>
                      {mode === "signin" && (
                        <button
                          type="button"
                          className="text-xs font-medium text-[#205DF8] hover:underline cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 w-4 h-4 text-[#94A3B8] pointer-events-none" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={
                          mode === "signin"
                            ? "Enter your password"
                            : "Create a strong password"
                        }
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#205DF8] focus:ring-2 focus:ring-[#205DF8]/15 outline-none text-sm text-[#07133D] placeholder:text-[#94A3B8] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-[#94A3B8] hover:text-slate-600 p-1 cursor-pointer transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loadingProvider !== null || isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-[#07133D] hover:bg-[#121E48] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_rgba(7,19,61,0.22)] active:scale-[0.99] cursor-pointer mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        <span>{mode === "signin" ? "Sign In" : "Create Account"}</span>
                        <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
                      </>
                    )}
                  </motion.button>
                </form>
              </div>

              {/* Bottom Switch Link & Terms */}
              <div className="pt-4">
                <p className="text-xs text-center text-[#64748B]">
                  {mode === "signin"
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                    className="text-[#205DF8] font-semibold hover:underline cursor-pointer ml-0.5"
                  >
                    {mode === "signin" ? "Sign Up" : "Sign In"}
                  </button>
                </p>

                <p className="text-[11px] text-center text-[#94A3B8] mt-3 leading-normal">
                  By continuing, you agree to our{" "}
                  <a
                    href="#"
                    className="underline font-medium text-[#64748B] hover:text-[#07133D]"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="underline font-medium text-[#64748B] hover:text-[#07133D]"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
