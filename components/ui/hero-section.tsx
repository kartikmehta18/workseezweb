"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import Image from "next/image";
import visualeezShot from "@/public/visualeez.png";
import { useReducedMotion } from "motion/react";
import { ArrowUpRight, Forward, Heart, MessageCircle } from "lucide-react";

/* Brand colours live in app/globals.css (bg-brand-navy = #061128, …). */

/** Animated post samples (1080×1350) in public/heroslide. */
const slide = (file: string) => `/heroslide/${encodeURIComponent(file)}`;

/** 5140000 → "5.1M", 612000 → "612K". */
function compact(n: number) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1e3) return `${Math.round(n / 1e3)}K`;
  return String(Math.round(n));
}

type Post = {
  handle: string;
  platform: string;
  src: string;
  caption: string;
  tags: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
};

// Sample work. Swap the numbers for real campaign results when you have them.
const posts: Post[] = [
  { handle: "workseez", platform: "LinkedIn", src: slide("AI_Agent_vs_Agentic_AI_Cartoon_1080x1350_light (v1).gif"), caption: "AI agent vs agentic AI, explained in one cartoon", tags: "#ai #agents", views: 2_410_000, likes: 318_000, comments: 3_100, shares: 12_000 },
  { handle: "workseez", platform: "LinkedIn", src: slide("Denis_Panjuta_10_MCP_Concepts_1080x1350.gif"), caption: "10 MCP concepts every AI builder should know", tags: "#mcp #aitools", views: 5_140_000, likes: 612_000, comments: 8_400, shares: 41_000 },
  { handle: "workseez", platform: "LinkedIn", src: slide("Denis_AgenticAIGovernance_Animated_1080x1350.gif"), caption: "Deploying AI agents safely: the terms to know", tags: "#aigovernance #agenticai", views: 3_620_000, likes: 441_000, comments: 5_200, shares: 26_000 },
  { handle: "workseez", platform: "LinkedIn", src: slide("Denis_Panjuta_Claude_Code_Agent_Repos_1080x1350.gif"), caption: "10 best AI agent repositories for Claude Code", tags: "#claudecode #github", views: 4_230_000, likes: 530_000, comments: 7_700, shares: 33_000 },
  { handle: "workseez", platform: "LinkedIn", src: slide("Denis_Panjuta_How_AI_Chatbot_Is_Made_Animated_1080x1350.gif"), caption: "How an AI chatbot is made, start to finish", tags: "#llm #chatbots", views: 1_840_000, likes: 204_000, comments: 2_600, shares: 9_100 },
];

type Tile = { src: string; label: string };

const tileLabels = ["ai.agents", "mcp.concepts", "ai.governance", "claude.code", "ai.chatbots", "agentic.ai", "ai.tools", "llm.basics"];
const initialTiles: Tile[] = tileLabels.map((label, i) => ({ src: posts[i % posts.length].src, label }));

/* ------------------------------ Motion constants ------------------------------ */

const CARD_W = 320;
const CARD_H = Math.round((CARD_W * 16) / 9);
const K = CARD_W / 340; // card details are specced at 340px wide
const TILE_W = 214;
const TILE_H = Math.round((TILE_W * 16) / 9);
const TILE_GAP = 16;
const STRIDE = TILE_W + TILE_GAP;
const WALL_SPEED = 20; // px per second
const AUTO_MS = 2600; // auto-swipe interval
const PATTERN = "RRL"; // auto-swipe directions: R = "Viral", L = "Next"
const SWIPE_COOLDOWN = 420;
const VISUALEEZ_URL = "https://visualeez.com";
const SETTLE = "transform .55s cubic-bezier(.2,.8,.2,1)";

// Resting pose of each card in the fan, front (0) to back (3).
const fan = [
  { x: 0, y: 0, r: 0, s: 1 },
  { x: -24, y: 10, r: -5.5, s: 0.93 },
  { x: 36, y: 20, r: 6.5, s: 0.87 },
  { x: 0, y: 30, r: 0, s: 0.8 },
];

/** Pose for a fractional depth, so the second card eases forward while the top one is dragged. */
function fanPose(depth: number) {
  const a = fan[Math.floor(depth)];
  const b = fan[Math.min(3, Math.ceil(depth))];
  const f = depth - Math.floor(depth);
  const mix = (k: "x" | "y" | "r" | "s") => a[k] + (b[k] - a[k]) * f;
  return `translate(${mix("x") * K}px, ${mix("y") * K}px) rotate(${mix("r")}deg) scale(${mix("s")})`;
}

type Drag = { dx: number; dy: number };
const dragPose = (d: Drag) => `translate(${d.dx}px, ${d.dy * 0.25}px) rotate(${d.dx / 20}deg)`;

type Flyer = { id: number; post: Post; dir: 1 | -1; from: string; tile: number; tx: number; ty: number; s: number };

/* --------------------------------- Post card --------------------------------- */

function Stamp({ dir }: { dir: 1 | -1 }) {
  const viral = dir > 0;
  return (
    <span
      className={`absolute whitespace-nowrap font-bold tracking-[-0.02em] ${viral ? "border-white bg-brand-navy text-white" : "border-brand-navy bg-white text-brand-navy"}`}
      style={{
        top: 96 * K,
        [viral ? "left" : "right"]: 22 * K,
        padding: `${8 * K}px ${18 * K}px`,
        borderRadius: 14 * K,
        borderWidth: 3 * K,
        fontSize: 34 * K,
        transform: `rotate(${viral ? -14 : 14}deg)`,
      }}
    >
      {viral ? "Viral" : "Next"}
    </span>
  );
}

function PostCard({
  post,
  seg,
  active,
  stamp,
  uiRef,
}: {
  post: Post;
  /** Which of the 3 story bars this card is on. */
  seg: number;
  /** Fill the current story bar over the auto-swipe interval. */
  active: boolean;
  stamp: 0 | 1 | -1;
  uiRef?: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      className="absolute inset-0 overflow-hidden bg-brand-navy"
      style={{
        borderRadius: 30 * K,
        boxShadow: `0 ${30 * K}px ${60 * K}px -${28 * K}px rgba(6,17,40,.55), 0 ${10 * K}px ${22 * K}px -${12 * K}px rgba(0,0,0,.35)`,
      }}
    >
      <Image
        src={post.src}
        alt={post.caption}
        fill
        sizes={`${CARD_W}px`}
        unoptimized
        loading="eager"
        draggable={false}
        className="pointer-events-none select-none object-contain object-[50%_45%]"
      />
      <div ref={uiRef} className="absolute inset-0 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.38)_0%,rgba(0,0,0,0)_22%,rgba(0,0,0,0)_50%,rgba(0,0,0,.74)_100%)]" />

        <div className="absolute" style={{ left: 16 * K, right: 16 * K, top: 14 * K }}>
          <div className="flex" style={{ gap: 5 * K }}>
            {[0, 1, 2].map((i) => (
              <i key={i} className="block flex-1 overflow-hidden rounded-[3px] bg-white/40" style={{ height: 3 * K }}>
                <i
                  className={`block h-full bg-white ${
                    i < seg ? "w-full" : i > seg ? "w-0" : active ? "w-0 animate-story-fill motion-reduce:w-[55%] motion-reduce:animate-none" : "w-[55%]"
                  }`}
                />
              </i>
            ))}
          </div>
          <div className="flex items-center font-semibold tracking-[-0.01em]" style={{ gap: 9 * K, marginTop: 12 * K, fontSize: 15 * K }}>
            <span className="relative flex-none overflow-hidden rounded-full border-white bg-white" style={{ width: 34 * K, height: 34 * K, borderWidth: 2 * K }}>
              <Image src="/logo.jpeg" alt="" fill sizes="34px" draggable={false} className="object-cover" />
            </span>
            <span className="truncate">@{post.handle}</span>
            <span className="ml-auto whitespace-nowrap rounded-full bg-white/22 backdrop-blur-md" style={{ fontSize: 12 * K, padding: `${5 * K}px ${10 * K}px` }}>
              {post.platform}
            </span>
          </div>
        </div>

        <div className="absolute flex flex-col items-center font-semibold" style={{ right: 12 * K, bottom: 112 * K, gap: 14 * K, fontSize: 12 * K }}>
          {[
            { Icon: Heart, value: post.likes },
            { Icon: MessageCircle, value: post.comments },
            { Icon: Forward, value: post.shares },
          ].map(({ Icon, value }, i) => (
            <span key={i} className="flex flex-col items-center" style={{ gap: 3 * K }}>
              <Icon className="fill-white drop-shadow-[0_2px_4px_rgba(0,0,0,.35)]" strokeWidth={0} style={{ width: 28 * K, height: 28 * K }} />
              {compact(value)}
            </span>
          ))}
        </div>

        <div className="absolute" style={{ left: 18 * K, right: 60 * K, bottom: 20 * K }}>
          <span
            className="inline-flex items-center rounded-full bg-black/45 font-semibold backdrop-blur-md"
            style={{ gap: 6 * K, marginBottom: 10 * K, fontSize: 13 * K, padding: `${5 * K}px ${10 * K}px ${5 * K}px ${8 * K}px` }}
          >
            <svg viewBox="0 0 12 12" width={11 * K} height={11 * K} aria-hidden>
              <path d="M3 1.6v8.8L10.4 6z" fill="#fff" />
            </svg>
            {compact(post.views)} views
          </span>
          <div className="font-semibold leading-[1.22] tracking-[-0.01em]" style={{ fontSize: 17 * K }}>{post.caption}</div>
          <div className="font-semibold text-sky-200" style={{ marginTop: 7 * K, fontSize: 14 * K }}>{post.tags}</div>
        </div>

        {stamp !== 0 && <Stamp dir={stamp} />}
      </div>
    </div>
  );
}

/** A swiped card: flies out to the side, then drops into its slot in the photo wall. */
function FlyingCard({ flyer, instant, onDone }: { flyer: Flyer; instant: boolean; onDone: (f: Flyer) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (instant || !el.animate) {
      onDone(flyer);
      return;
    }
    const out = `translate(${flyer.dir * CARD_W * 0.62}px, ${-CARD_H * 0.04}px) rotate(${flyer.dir * 13}deg) scale(.92)`;
    const land = `translate(${flyer.tx}px, ${flyer.ty - 0.35 * CARD_H * (1 - flyer.s)}px) rotate(0deg) scale(${flyer.s})`;
    const move = el.animate([{ transform: flyer.from }, { transform: out, offset: 0.4 }, { transform: land }], {
      duration: 1000,
      easing: "cubic-bezier(.45,.05,.25,1)",
      fill: "forwards",
    });
    uiRef.current?.animate([{ opacity: 1 }, { opacity: 1, offset: 0.45 }, { opacity: 0 }], { duration: 1000, fill: "forwards" });

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      onDone(flyer);
    };
    move.onfinish = finish;
    const fallback = setTimeout(finish, 1600);
    return () => {
      clearTimeout(fallback);
      move.onfinish = null;
    };
  }, [flyer, instant, onDone]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-30 origin-[50%_85%]" style={{ transform: flyer.from }}>
      <PostCard post={flyer.post} seg={2} active={false} stamp={flyer.dir} uiRef={uiRef} />
    </div>
  );
}

/* ------------------------------- Deck + wall stage ------------------------------ */

function SwipeStage({ className }: { className: string }) {
  const reduceMotion = useReducedMotion() ?? false;
  const [top, setTop] = useState(1);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [tiles, setTiles] = useState<Tile[]>(initialTiles);

  const stageRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const wallPos = useRef(0);
  const topRef = useRef(top);
  const dragRef = useRef<{ x: number; y: number; d: Drag } | null>(null);
  const nextSwipeAt = useRef(0);
  const flyerId = useRef(0);
  const patternStep = useRef(0);

  useEffect(() => {
    topRef.current = top;
  }, [top]);

  // Photo wall: constant-speed marquee driven by rAF so we know where each tile is.
  useEffect(() => {
    if (reduceMotion) return;
    const loop = tiles.length * STRIDE;
    let last = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      wallPos.current = (wallPos.current + (dt * WALL_SPEED) / 1000) % loop;
      if (wallRef.current) wallRef.current.style.transform = `translate3d(${-wallPos.current}px,0,0)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduceMotion, tiles.length]);

  const swipe = useCallback(
    (dir: 1 | -1, from: string) => {
      const stage = stageRef.current;
      const deck = deckRef.current;
      const wall = wallRef.current;
      if (!stage || !deck || !wall) return;

      const now = performance.now();
      if (now < nextSwipeAt.current) return;
      nextSwipeAt.current = now + SWIPE_COOLDOWN;

      // Pick the visible wall tile nearest the side the card is thrown to,
      // using where the wall will be when the card lands (1s from now).
      const width = stage.clientWidth;
      const loop = tiles.length * STRIDE;
      const landingPos = (wallPos.current + (reduceMotion ? 0 : WALL_SPEED)) % loop;
      const deckX = deck.offsetLeft + CARD_W / 2;
      const deckY = deck.offsetTop + CARD_H / 2;
      const aimX = deckX + dir * CARD_W * 0.95;
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < tiles.length * 2; i++) {
        const left = i * STRIDE - landingPos - STRIDE;
        if (left < 8 || left + TILE_W > width - 8) continue;
        const dist = Math.abs(left + TILE_W / 2 - aimX);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      const tileLeft = best * STRIDE - landingPos - STRIDE;

      const current = topRef.current;
      const swiped = posts[current % posts.length];
      setFlyers((list) => [
        ...list,
        {
          id: ++flyerId.current,
          post: swiped,
          dir,
          from,
          tile: best % tiles.length,
          tx: tileLeft + TILE_W / 2 - deckX,
          ty: wall.offsetTop + TILE_H / 2 - deckY,
          s: TILE_W / CARD_W,
        },
      ]);
      setTop((t) => t + 1);
    },
    [reduceMotion, tiles.length],
  );

  const land = useCallback((f: Flyer) => {
    setTiles((list) => list.map((t, i) => (i === f.tile ? { src: f.post.src, label: f.post.handle } : t)));
    setFlyers((list) => list.filter((x) => x.id !== f.id));
  }, []);

  // Auto-swipe on a fixed rhythm, paused while dragging, off-screen or in a hidden tab.
  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      if (document.hidden || dragRef.current) return;
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) return;
      const dir = PATTERN[patternStep.current++ % PATTERN.length] === "L" ? -1 : 1;
      swipe(dir, "translate(0px, 0px) rotate(0deg) scale(1)");
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [reduceMotion, swipe]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current = { x: e.clientX, y: e.clientY, d: { dx: 0, dy: 0 } };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ dx: 0, dy: 0 });
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const start = dragRef.current;
    if (!start) return;
    start.d = { dx: e.clientX - start.x, dy: e.clientY - start.y };
    setDrag(start.d);
  };
  const onPointerUp = () => {
    const start = dragRef.current;
    if (!start) return;
    dragRef.current = null;
    setDrag(null);
    if (Math.abs(start.d.dx) > CARD_W * 0.28) swipe(start.d.dx > 0 ? 1 : -1, dragPose(start.d));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") swipe(1, "translate(0px, 0px) rotate(0deg) scale(1)");
    if (e.key === "ArrowLeft") swipe(-1, "translate(0px, 0px) rotate(0deg) scale(1)");
  };

  const dragProgress = drag ? Math.min(1, Math.abs(drag.dx) / (CARD_W * 0.5)) : 0;
  const depths = [3, 2, 1, 0]; // render back to front

  return (
    <div ref={stageRef} className={`select-none ${className}`}>
      {/* Photo wall */}
      <div ref={wallRef} className="absolute top-[656px] flex will-change-transform xl:top-[664px]" style={{ left: -STRIDE, gap: TILE_GAP }}>
        {[0, 1].flatMap((copy) =>
          tiles.map((tile, i) => (
            <div
              key={`${copy}-${i}`}
              aria-hidden={copy === 1}
              className="relative flex-none overflow-hidden rounded-[22px] bg-white ring-1 ring-slate-200"
              style={{ width: TILE_W, height: TILE_H }}
            >
              <Image src={tile.src} alt={copy === 0 ? `@${tile.label}` : ""} fill sizes={`${TILE_W}px`} unoptimized className="object-contain object-top" />
              <span className="absolute left-2.5 top-2.5 whitespace-nowrap rounded-full bg-brand-navy/45 px-2.5 py-[5px] text-[13px] font-semibold text-white backdrop-blur-[6px]">
                @{tile.label}
              </span>
            </div>
          )),
        )}
      </div>

      {/* Card deck */}
      <div
        ref={deckRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Client posts. Drag the top card, or use the arrow keys, to swipe."
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="absolute left-1/2 top-0 z-10 -ml-[160px] touch-pan-y rounded-[28px] outline-none focus-visible:ring-2 focus-visible:ring-brand-navy/40 focus-visible:ring-offset-8 xl:top-[104px]"
        style={{ width: CARD_W, height: CARD_H }}
      >
        {depths.map((depth) => {
          const index = top + depth;
          const isTop = depth === 0;
          let transform = fanPose(depth);
          if (drag && isTop) transform = dragPose(drag);
          if (drag && depth === 1) transform = fanPose(1 - dragProgress);
          return (
            <div
              key={index}
              aria-hidden={!isTop}
              onPointerDown={isTop ? onPointerDown : undefined}
              onPointerMove={isTop ? onPointerMove : undefined}
              onPointerUp={isTop ? onPointerUp : undefined}
              onPointerCancel={isTop ? onPointerUp : undefined}
              className={`absolute inset-0 origin-[50%_85%] ${isTop ? (drag ? "cursor-grabbing" : "cursor-grab") : ""}`}
              style={{ zIndex: 10 - depth, transform, transition: drag && depth < 2 ? "none" : SETTLE }}
            >
              <PostCard
                post={posts[index % posts.length]}
                seg={index % 3}
                active={isTop}
                stamp={isTop && drag && Math.abs(drag.dx) > 12 ? (drag.dx > 0 ? 1 : -1) : 0}
              />
            </div>
          );
        })}
        {flyers.map((f) => (
          <FlyingCard key={f.id} flyer={f} instant={reduceMotion} onDone={land} />
        ))}
      </div>

      {/* Hint */}
      <span
        className="pointer-events-none absolute left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-full bg-white px-4 py-[9px] text-[14px] font-semibold text-brand-navy shadow-[0_10px_24px_-14px_rgba(6,17,40,.5)]"
        style={{ top: `calc(var(--deck-top) + ${CARD_H + 26}px)` }}
      >
        <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M8 7 3 12l5 5M16 7l5 5-5 5" />
        </svg>
        Drag to swipe
      </span>
    </div>
  );
}

/* --------------------------------- Product card -------------------------------- */

function ProductCard() {
  return (
    <a
      href={VISUALEEZ_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-[340px] max-w-full rounded-[28px] bg-white p-2.5 text-brand-navy shadow-[0_30px_60px_-34px_rgba(6,17,40,.35),0_10px_26px_-18px_rgba(6,17,40,.3)] ring-1 ring-slate-200/70 transition-transform duration-300 hover:-translate-y-1"
    >
      <span className="relative block aspect-[16/10] overflow-hidden rounded-[20px] bg-brand-navy">
        <Image
          src={visualeezShot}
          alt="Visualeez app screenshot"
          fill
          sizes="320px"
          placeholder="blur"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </span>
      <span className="block px-2.5 pb-2 pt-3.5">
        <span className="flex items-center justify-between gap-3">
          <span className="text-[20px] font-semibold tracking-[-0.03em]">Visualeez</span>
          <span className="flex items-center gap-1 text-[13px] font-medium text-slate-500 transition-colors group-hover:text-brand-navy">
            visualeez.com
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </span>
        <span className="mt-1 block text-[14px] text-slate-500">Turn ideas into animated infographics</span>
      </span>
    </a>
  );
}

/* ------------------------------------- Hero ------------------------------------ */

// Lines + dots grid, white base. Only used behind the hero.
const circuitBg =
  "bg-white bg-[repeating-linear-gradient(0deg,transparent,transparent_19px,rgba(75,85,99,0.08)_19px,rgba(75,85,99,0.08)_20px,transparent_20px,transparent_39px,rgba(75,85,99,0.08)_39px,rgba(75,85,99,0.08)_40px),repeating-linear-gradient(90deg,transparent,transparent_19px,rgba(75,85,99,0.08)_19px,rgba(75,85,99,0.08)_20px,transparent_20px,transparent_39px,rgba(75,85,99,0.08)_39px,rgba(75,85,99,0.08)_40px),radial-gradient(circle_at_20px_20px,rgba(55,65,81,0.12)_2px,transparent_2px),radial-gradient(circle_at_40px_40px,rgba(55,65,81,0.12)_2px,transparent_2px)] bg-size-[40px_40px]";

export default function HeroSection() {
  return (
    <section className="relative flex w-full flex-col overflow-hidden font-sauce text-brand-navy [--deck-top:0px] xl:block xl:h-[860px] xl:[--deck-top:104px]">
      <div aria-hidden className={`pointer-events-none absolute inset-0 z-0 ${circuitBg}`} />

      {/* Copy */}
      <div className="relative z-20 order-1 flex flex-col items-start px-6 pt-10 xl:absolute xl:left-[max(1.5rem,calc(50%-640px))] xl:top-[388px] xl:-translate-y-1/2 xl:p-0">
        <span className="inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white py-2 pl-3.5 pr-4 text-[15px] font-medium leading-[1.2] text-brand-navy shadow-[0_6px_16px_-12px_rgba(6,17,40,.4)]">
          <span className="size-2 rounded-full bg-brand-navy" />
          Social media agency
        </span>
        <h1 className="mt-5 max-w-[340px] text-[44px] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-[54px]">Posts people can’t scroll past.</h1>
        <p className="mt-6 max-w-[312px] text-[20px] leading-[1.38] tracking-[-0.01em] text-slate-600">
          Strategy, short-form content and paid social that turn views into customers.
        </p>
        <a
          href="#contact"
          className="group mt-5 inline-flex h-[55px] items-center gap-3.5 rounded-full bg-brand-navy pl-6 pr-2 text-[17px] font-medium tracking-[-0.02em] text-white shadow-[0_20px_40px_-18px_rgba(6,17,40,.75),inset_0_1px_0_rgba(255,255,255,.12)] transition-[translate,background-color] duration-300 hover:-translate-y-0.5 hover:bg-brand-navy-light"
        >
          Book a call
          <span className="grid size-10 place-items-center rounded-full bg-white text-brand-navy transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight className="size-4" strokeWidth={2.5} />
          </span>
        </a>
      </div>

      {/* Deck + photo wall */}
      <SwipeStage className="relative z-10 order-2 mt-10 h-[940px] xl:absolute xl:inset-0 xl:mt-0 xl:h-auto" />

      {/* Product */}
      <div className="relative z-20 order-3 flex justify-center px-6 py-12 xl:absolute xl:right-[max(1.5rem,calc(50%-640px))] xl:top-[388px] xl:-translate-y-1/2 xl:p-0">
        <ProductCard />
      </div>
    </section>
  );
}
