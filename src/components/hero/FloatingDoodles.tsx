"use client";

import { useEffect, useReducer } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { doodleEntrance } from "@/lib/animations";

/* ─── Float animation wrapper ────────────────────────────────────── */

interface FloatProps {
  duration?: number;
  yRange?: number;
  rotateRange?: number;
  delay?: number;
  children: React.ReactNode;
  className?: string;
}

function Float({
  duration = 5,
  yRange = 10,
  rotateRange = 2,
  delay = 0,
  children,
  className,
}: FloatProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -yRange, 0],
        rotate: [-rotateRange, rotateRange, -rotateRange],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Parallax wrapper ───────────────────────────────────────────── */

interface ParallaxDoodleProps {
  mouseX: number;
  mouseY: number;
  strength?: number;
  children: React.ReactNode;
  className?: string;
  initialDelay?: number;
}

function ParallaxDoodle({
  mouseX,
  mouseY,
  strength = 12,
  children,
  className,
  initialDelay = 0,
}: ParallaxDoodleProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={doodleEntrance}
      initial="hidden"
      animate="visible"
      transition={{ delay: initialDelay }}
      style={
        !prefersReducedMotion
          ? {
              x: mouseX * strength,
              y: mouseY * strength,
            }
          : {}
      }
    >
      {children}
    </motion.div>
  );
}

/* ─── Mouse tracking ─────────────────────────────────────────────── */

type MouseState = { x: number; y: number };

function mouseReducer(_: MouseState, e: MouseEvent): MouseState {
  return {
    x: (e.clientX / window.innerWidth - 0.5) * 0.08,
    y: (e.clientY / window.innerHeight - 0.5) * 0.08,
  };
}

export default function FloatingDoodles() {
  const [mouse, dispatch] = useReducer(mouseReducer, { x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const handler = (e: MouseEvent) => dispatch(e);
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [prefersReducedMotion]);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none z-10"
      aria-hidden="true"
    >
      {/* ── Left Side Doodles ─────────────────────────────────── */}

      {/* 1. Top-left: Curled Notepad ("Knowledge today. A brighter tomorrow." + Arrow) */}
      <ParallaxDoodle
        mouseX={mouse.x}
        mouseY={mouse.y}
        strength={10}
        className="absolute top-[12%] left-[1.5%] sm:left-[2.5%] lg:left-[3.5%] hidden sm:block"
        initialDelay={0.4}
      >
        <Float duration={6.5} yRange={8} rotateRange={1.8} delay={0}>
          <div className="relative w-[130px] sm:w-[150px] lg:w-[168px] transition-transform duration-300">
            <Image
              src="/images/doodle_notepad_clean.png"
              alt="Knowledge today note"
              width={477}
              height={501}
              unoptimized
              className="w-full h-auto object-contain select-none"
              priority
            />
          </div>
        </Float>
      </ParallaxDoodle>

      {/* 2. Top-left Star Doodle */}
      <ParallaxDoodle
        mouseX={mouse.x}
        mouseY={mouse.y}
        strength={16}
        className="absolute top-[24%] left-[15%] lg:left-[16.5%] hidden md:block"
        initialDelay={0.7}
      >
        <Float duration={4.8} yRange={6} rotateRange={5} delay={0.3}>
          <div className="w-[24px] lg:w-[27px]">
            <Image
              src="/images/doodle_star_clean.png"
              alt="Star doodle"
              width={81}
              height={84}
              unoptimized
              className="w-full h-auto object-contain select-none opacity-85"
            />
          </div>
        </Float>
      </ParallaxDoodle>

      {/* 3. Mid-left: Open Book Sketch */}
      <ParallaxDoodle
        mouseX={mouse.x}
        mouseY={mouse.y}
        strength={14}
        className="absolute top-[48%] left-[7%] lg:left-[9%] hidden sm:block"
        initialDelay={0.6}
      >
        <Float duration={5.5} yRange={8} rotateRange={2.5} delay={0.6}>
          <div className="w-[72px] sm:w-[80px] lg:w-[88px]">
            <Image
              src="/images/doodle_book_clean.png"
              alt="Open book doodle"
              width={255}
              height={198}
              unoptimized
              className="w-full h-auto object-contain select-none"
            />
          </div>
        </Float>
      </ParallaxDoodle>

      {/* 4. Bottom-left Star Doodle */}
      <ParallaxDoodle
        mouseX={mouse.x}
        mouseY={mouse.y}
        strength={18}
        className="absolute top-[62%] left-[5%] lg:left-[6.5%] hidden md:block"
        initialDelay={0.9}
      >
        <Float duration={5.2} yRange={7} rotateRange={4} delay={1.1}>
          <div className="w-[22px] lg:w-[26px]">
            <Image
              src="/images/doodle_star_bl.png"
              alt="Star doodle"
              width={84}
              height={96}
              unoptimized
              className="w-full h-auto object-contain select-none opacity-80"
            />
          </div>
        </Float>
      </ParallaxDoodle>

      {/* ── Right Side Doodles ────────────────────────────────── */}

      {/* 5. Top-right: Handwritten Script ("Explore Understand Create Impact." + Arrow) */}
      <ParallaxDoodle
        mouseX={mouse.x}
        mouseY={mouse.y}
        strength={10}
        className="absolute top-[12%] right-[5%] sm:right-[6%] lg:right-[7.5%] hidden sm:block"
        initialDelay={0.5}
      >
        <Float duration={6.2} yRange={8} rotateRange={1.8} delay={0.2}>
          <div className="w-[125px] sm:w-[145px] lg:w-[162px]">
            <Image
              src="/images/doodle_tr_clean.png"
              alt="Explore Understand Create Impact"
              width={366}
              height={450}
              unoptimized
              className="w-full h-auto object-contain select-none"
              priority
            />
          </div>
        </Float>
      </ParallaxDoodle>

      {/* 6. Right: Magnifying Glass */}
      <ParallaxDoodle
        mouseX={mouse.x}
        mouseY={mouse.y}
        strength={16}
        className="absolute top-[26%] right-[7%] lg:right-[8.5%] hidden md:block"
        initialDelay={0.75}
      >
        <Float duration={5.2} yRange={7} rotateRange={6} delay={0.8}>
          <div className="w-[42px] lg:w-[48px]">
            <Image
              src="/images/doodle_mag_clean.png"
              alt="Magnifying glass doodle"
              width={162}
              height={180}
              unoptimized
              className="w-full h-auto object-contain select-none"
            />
          </div>
        </Float>
      </ParallaxDoodle>

      {/* 7. Right: Curled Paper Document with text lines */}
      <ParallaxDoodle
        mouseX={mouse.x}
        mouseY={mouse.y}
        strength={12}
        className="absolute top-[35%] right-[2%] sm:right-[2.5%] lg:right-[3.5%] hidden sm:block"
        initialDelay={0.65}
      >
        <Float duration={7.0} yRange={9} rotateRange={2.5} delay={0.4}>
          <div className="w-[110px] sm:w-[125px] lg:w-[140px]">
            <Image
              src="/images/doodle_doc_clean.png"
              alt="Paper document doodle"
              width={381}
              height={372}
              unoptimized
              className="w-full h-auto object-contain select-none"
            />
          </div>
        </Float>
      </ParallaxDoodle>

      {/* 8. Right Star Doodle */}
      <ParallaxDoodle
        mouseX={mouse.x}
        mouseY={mouse.y}
        strength={19}
        className="absolute top-[46%] right-[13%] lg:right-[14%] hidden md:block"
        initialDelay={0.85}
      >
        <Float duration={4.4} yRange={5} rotateRange={5} delay={0.7}>
          <div className="w-[18px] lg:w-[22px]">
            <Image
              src="/images/doodle_star_r.png"
              alt="Star doodle"
              width={60}
              height={63}
              unoptimized
              className="w-full h-auto object-contain select-none opacity-80"
            />
          </div>
        </Float>
      </ParallaxDoodle>

      {/* 9. Atmospheric Moon / Glass Bubble next to search bar */}
      <ParallaxDoodle
        mouseX={mouse.x}
        mouseY={mouse.y}
        strength={7}
        className="absolute top-[56%] right-[15%] lg:right-[16%] hidden lg:block"
        initialDelay={1.0}
      >
        <Float duration={8.0} yRange={4} rotateRange={0.5} delay={1.5}>
          <div
            className="w-[68px] h-[68px] rounded-full opacity-60 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.85) 0%, rgba(210,230,255,0.25) 55%, rgba(180,210,255,0.02) 100%)",
              border: "1px solid rgba(255,255,255,0.55)",
              boxShadow: "0 0 20px rgba(210,230,255,0.35)",
            }}
          />
        </Float>
      </ParallaxDoodle>

      {/* 10. Bottom-right: Handwritten Script ("From Papers to Progress." + Arrow) */}
      <ParallaxDoodle
        mouseX={mouse.x}
        mouseY={mouse.y}
        strength={11}
        className="absolute top-[66%] right-[5%] sm:right-[6%] lg:right-[7.5%] hidden sm:block"
        initialDelay={0.8}
      >
        <Float duration={6.0} yRange={7} rotateRange={2} delay={1.0}>
          <div className="w-[115px] sm:w-[130px] lg:w-[145px]">
            <Image
              src="/images/doodle_br_clean.png"
              alt="From Papers to Progress"
              width={420}
              height={300}
              unoptimized
              className="w-full h-auto object-contain select-none"
            />
          </div>
        </Float>
      </ParallaxDoodle>
    </div>
  );
}
