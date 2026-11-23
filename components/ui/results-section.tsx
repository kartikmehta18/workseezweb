"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion, useSpring } from "motion/react";
import { BadgeCheck, Heart, MessageCircle, Send, TrendingUp } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";
import BookCallButton from "@/components/ui/book-call-button";
import { SlideMedia, slides } from "@/components/ui/slide-media";

/* "We focus on results" — copy on the left, a phone that swipes through reels on the right. */

// Same post samples as the hero, so the browser already has them cached.
const reels = [
  { slide: slides.mcp, caption: "10 MCP concepts every AI builder should know", likes: "612K", comments: "8.4K" },
  { slide: slides.aiAgents, caption: "AI agent vs agentic AI, explained in one cartoon", likes: "318K", comments: "3.1K" },
  { slide: slides.chatbot, caption: "How an AI chatbot is made, start to finish", likes: "204K", comments: "2.6K" },
  { slide: slides.repos, caption: "10 best AI agent repositories for Claude Code", likes: "530K", comments: "7.7K" },
];

const SWIPE_MS = 2800;

/* ----------------------------------- Phone ----------------------------------- */

/**
 * Optional hand photo (transparent PNG, phone-free) placed behind the mockup.
 * Leave null until you have an image you're licensed to use — e.g. "/hand.png".
 */
const HAND_SRC: string | null = null;

function StatusBar() {
  return (
    <div className="absolute inset-x-0 top-0 z-20 flex h-11 items-center justify-between px-7 text-[12px] font-semibold text-white">
      <span>9:41</span>
      <span className="flex items-center gap-1.5" aria-hidden>
        <svg viewBox="0 0 18 12" className="h-2.5 w-4 fill-white">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg viewBox="0 0 27 13" className="h-3 w-6">
          <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" className="fill-none stroke-white/60" />
          <rect x="2.5" y="2.5" width="16" height="8" rx="2" className="fill-white" />
          <rect x="24" y="4.5" width="2" height="4" rx="1" className="fill-white/60" />
        </svg>
      </span>
    </div>
  );
}

function Reel({ reel, play }: { reel: (typeof reels)[number]; play: boolean }) {
  return (
    <>
      {/* Blurred copy fills the tall screen; the 4:5 post sits sharp on top, like Reels does. */}
      <Image src={reel.slide.poster} alt="" fill sizes="96px" aria-hidden className="scale-125 object-cover opacity-70 blur-2xl" />
      <div className="absolute inset-0 bg-brand-navy/35" />
      <SlideMedia slide={reel.slide} alt={reel.caption} play={play} sizes="280px" fit="object-contain object-[50%_44%]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.45)_0%,rgba(0,0,0,0)_16%,rgba(0,0,0,0)_60%,rgba(0,0,0,.8)_100%)]" />

      <div className="absolute bottom-6 left-4 right-14 text-white">
        <div className="flex items-center gap-2 text-[13px] font-semibold">
          <Image src="/logo.jpeg" alt="" width={26} height={26} className="size-[26px] rounded-full ring-1 ring-white/70" />
          workseez
          <BadgeCheck className="size-4 fill-sky-500 text-white" />
          <span className="ml-1 rounded-md border border-white/60 px-1.5 py-0.5 text-[10px] font-medium">Follow</span>
        </div>
        <p className="mt-2 text-[12px] leading-[1.35] text-white/90">{reel.caption}</p>
      </div>
      <div className="absolute bottom-7 right-3 flex flex-col items-center gap-4 text-[10px] font-semibold text-white">
        <span className="flex flex-col items-center gap-0.5">
          <Heart className="size-[22px] fill-white" strokeWidth={0} />
          {reel.likes}
        </span>
        <span className="flex flex-col items-center gap-0.5">
          <MessageCircle className="size-[22px] fill-white" strokeWidth={0} />
          {reel.comments}
        </span>
        <Send className="size-5" strokeWidth={2} />
      </div>
    </>
  );
}

function PhoneScreen({ index, play }: { index: number; play: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[42px] bg-brand-navy">
      {/* Each reel slides up from below as the previous one leaves through the top. */}
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ y: "100%", scale: 1 }}
          animate={{ y: "0%", scale: 1 }}
          exit={{ y: "-100%", scale: 0.96 }}
          transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
        >
          <Reel reel={reels[index]} play={play} />
        </motion.div>
      </AnimatePresence>

      <StatusBar />
      {/* Dynamic island */}
      <span className="absolute left-1/2 top-2.5 z-20 h-[30px] w-[96px] -translate-x-1/2 rounded-full bg-black" />
      {/* Home indicator */}
      <span className="absolute bottom-2 left-1/2 z-20 h-1 w-28 -translate-x-1/2 rounded-full bg-white/80" />
      {/* Glass reflection */}
      <span className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(115deg,rgba(255,255,255,.14)_0%,rgba(255,255,255,.04)_28%,rgba(255,255,255,0)_42%)]" />
    </div>
  );
}

function PhoneMockup() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  // Only play video and swipe reels while the phone is on screen.
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "200px 0px" });

  // Cursor tilt: the phone leans toward the pointer, smoothed with a spring.
  const tiltX = useSpring(0, { stiffness: 120, damping: 18 });
  const tiltY = useSpring(0, { stiffness: 120, damping: 18 });

  useEffect(() => {
    if (reduceMotion || !inView) return;
    const id = setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % reels.length);
    }, SWIPE_MS);
    return () => clearInterval(id);
  }, [reduceMotion, inView]);

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    tiltY.set(((e.clientX - r.left) / r.width - 0.5) * 16);
    tiltX.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
  };
  const onPointerLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <div
      ref={ref}
      className="relative grid h-[680px] w-[420px] flex-none place-items-center [perspective:1400px]"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {HAND_SRC && <Image src={HAND_SRC} alt="" fill sizes="420px" className="pointer-events-none object-contain object-bottom" />}

      {/* Soft floor shadow that breathes with the float. */}
      <motion.span
        aria-hidden
        className="absolute bottom-6 h-8 w-56 rounded-[50%] bg-brand-navy/25 blur-xl"
        animate={reduceMotion ? undefined : { scaleX: [1, 0.86, 1], opacity: [0.9, 0.6, 0.9] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
        animate={reduceMotion ? undefined : { y: [0, -14, 0], rotateZ: [-2, 1, -2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-[600px] w-[292px]"
      >
        {/* Side buttons */}
        <span className="absolute -left-[3px] top-[118px] h-8 w-[3px] rounded-l bg-[#2a2e37]" />
        <span className="absolute -left-[3px] top-[170px] h-14 w-[3px] rounded-l bg-[#2a2e37]" />
        <span className="absolute -left-[3px] top-[236px] h-14 w-[3px] rounded-l bg-[#2a2e37]" />
        <span className="absolute -right-[3px] top-[190px] h-20 w-[3px] rounded-r bg-[#2a2e37]" />

        {/* Titanium frame, black bezel, screen */}
        <div className="h-full w-full rounded-[54px] bg-[linear-gradient(145deg,#4a505c_0%,#1b1e25_30%,#30343d_62%,#121419_100%)] p-[3px] shadow-[0_50px_90px_-30px_rgba(6,17,40,.55),0_20px_40px_-20px_rgba(6,17,40,.35)]">
          <div className="h-full w-full rounded-[51px] bg-black p-[9px]">
            <PhoneScreen index={index} play={inView} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------------------------------- Section ---------------------------------- */

export default function ResultsSection() {
  const reduceMotion = useReducedMotion();
  const rise = (delay = 0, y = 24) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.8, delay, ease: [0.2, 0.8, 0.2, 1] as const },
        };

  return (
    <section id="results" className="relative w-full overflow-hidden px-6 py-16 font-sauce text-brand-navy md:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-circuit" />
      {/* Soft fade so the grid melts into the sections above and below. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#fff_0%,rgba(255,255,255,0)_18%,rgba(255,255,255,0)_82%,#fff_100%)]" />

      <div className="relative mx-auto grid max-w-[1072px] items-center gap-10 md:grid-cols-[1fr_420px] md:gap-16">
        <motion.div {...rise()} className="flex flex-col items-start pb-6 md:pb-20">
          <SectionBadge icon={TrendingUp}>Ready To Grow?</SectionBadge>
          <h2 className="mt-7 max-w-[520px] text-[36px] font-semibold leading-[1.15] tracking-[-0.04em] md:text-[48px]">
            And We Focus On <span className="text-brand-red">Results</span> Your Audience Actually Responds To.
          </h2>
          <p className="mt-5 max-w-[440px] text-[17px] leading-[1.45] text-slate-600">
            We build content around what your audience watches, saves and shares, so every post turns attention into real growth.
          </p>
          <BookCallButton className="mt-7" />
        </motion.div>

        <motion.div {...rise(0.15, 60)} className="-mb-[170px] flex origin-top scale-75 justify-center sm:mb-0 sm:scale-100 md:justify-end">
          <PhoneMockup />
        </motion.div>
      </div>
    </section>
  );
}
