"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Copy,
  FileText,
  Lock,
  PanelLeft,
  Plus,
  RotateCw,
  Send,
  Share,
  Workflow,
} from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

/* "How we work" — the client journey through the Workseez portal.
   Steps auto-advance (each with a progress bar); the window on the right shows that step's screen. */

const PORTAL_URL = "https://portal.workseez.com/";
const STEP_MS = 5000;
const ease = [0.2, 0.8, 0.2, 1] as const;

/* ---------------------------------- Screens --------------------------------- */
// Small, illustrative mock-ups of the portal. `still` = reduced motion: render the end state.

function StrategyScreen({ still }: { still: boolean }) {
  const rows = [
    ["Goal", "2× reach in 90 days"],
    ["Pillars", "Education · Behind the scenes · Proof"],
    ["Cadence", "4 reels + 3 carousels a week"],
  ];
  return (
    <div className="flex h-full flex-col">
      <p className="text-[13px] font-semibold">Q1 Strategy sheet</p>
      <dl className="mt-4 space-y-2.5">
        {rows.map(([k, v], i) => (
          <motion.div
            key={k}
            initial={still ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.12, duration: 0.4, ease }}
            className="flex gap-3 rounded-lg bg-slate-50 px-3 py-2.5 text-[12.5px]"
          >
            <dt className="w-16 flex-none text-slate-400">{k}</dt>
            <dd className="text-slate-700">{v}</dd>
          </motion.div>
        ))}
      </dl>
      <motion.div
        initial={still ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4, ease }}
        className="mt-3 ml-auto max-w-[220px] rounded-xl rounded-br-sm bg-brand-navy px-3 py-2 text-[12px] text-white"
      >
        Love the pillars. Approved from our side.
      </motion.div>
      <motion.span
        initial={still ? false : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1, type: "spring", stiffness: 320, damping: 18 }}
        className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-green/10 px-3 py-1.5 text-[12px] font-medium text-brand-green"
      >
        <CircleCheck className="size-3.5" /> Signed off by client
      </motion.span>
    </div>
  );
}

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const planned: Record<number, { label: string; tone: string }> = {
  0: { label: "Reel", tone: "bg-brand-red/10 text-brand-red" },
  1: { label: "Carousel", tone: "bg-brand-blue/10 text-brand-blue" },
  3: { label: "Reel", tone: "bg-brand-red/10 text-brand-red" },
  4: { label: "Story", tone: "bg-brand-magenta/10 text-brand-magenta" },
  5: { label: "Post", tone: "bg-brand-green/10 text-brand-green" },
};

function CalendarScreen({ still }: { still: boolean }) {
  return (
    <div className="flex h-full flex-col">
      <p className="text-[13px] font-semibold">Content calendar · This week</p>
      <div className="mt-4 grid flex-1 grid-cols-7 gap-1.5">
        {days.map((d, i) => (
          <div key={d} className="flex flex-col rounded-lg bg-slate-50 p-1.5">
            <span className="text-center text-[11px] text-slate-400">{d}</span>
            {planned[i] && (
              <motion.span
                initial={still ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.4, ease }}
                className={`mt-2 truncate rounded-md px-1 py-1.5 text-center text-[10.5px] font-medium ${planned[i].tone}`}
              >
                {planned[i].label}
              </motion.span>
            )}
          </div>
        ))}
      </div>
      <p className="mt-3 text-[12px] text-slate-500">5 posts planned · captions & assets attached</p>
    </div>
  );
}

const statusTone = {
  "In review": "bg-amber-100 text-amber-700",
  Approved: "bg-brand-green/10 text-brand-green",
  "Changes asked": "bg-brand-red/10 text-brand-red",
  Scheduled: "bg-brand-blue/10 text-brand-blue",
  Live: "bg-brand-green/10 text-brand-green",
} as const;

function Status({ s }: { s: keyof typeof statusTone }) {
  return <span className={`flex-none rounded-full px-2 py-0.5 text-[11px] font-medium ${statusTone[s]}`}>{s}</span>;
}

function ReviewScreen({ still }: { still: boolean }) {
  // The first item gets approved a moment after the screen appears.
  const [approved, setApproved] = useState(still);
  useEffect(() => {
    if (still) return;
    const t = setTimeout(() => setApproved(true), 1400);
    return () => clearTimeout(t);
  }, [still]);

  return (
    <div className="flex h-full flex-col">
      <p className="text-[13px] font-semibold">Waiting for your review</p>
      <div className="mt-4 rounded-xl border border-slate-200 p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-medium">Launch week carousel</p>
            <p className="text-[11px] text-slate-400">Instagram · 6 slides</p>
          </div>
          <Status s={approved ? "Approved" : "In review"} />
        </div>
        <div className="mt-3 flex gap-2">
          <motion.span
            animate={approved && !still ? { scale: [1, 0.94, 1] } : undefined}
            transition={{ duration: 0.3 }}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11.5px] font-medium transition-colors ${approved ? "bg-brand-green text-white" : "bg-brand-navy text-white"}`}
          >
            <Check className="size-3" strokeWidth={3} /> {approved ? "Approved" : "Approve"}
          </motion.span>
          <span className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11.5px] text-slate-500">Request changes</span>
        </div>
      </div>
      <div className="mt-2.5 space-y-2">
        {(
          [
            ["Founder story reel", "Instagram Reels", "Approved"],
            ["Hiring post", "LinkedIn", "Changes asked"],
          ] as const
        ).map(([t, c, s]) => (
          <div key={t} className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-[12.5px] font-medium">{t}</p>
              <p className="text-[11px] text-slate-400">{c}</p>
            </div>
            <Status s={s} />
          </div>
        ))}
      </div>
    </div>
  );
}

const bars = [38, 52, 46, 64, 58, 78, 92];

function PublishScreen({ still }: { still: boolean }) {
  return (
    <div className="flex h-full flex-col">
      <p className="text-[13px] font-semibold">Published & performance</p>
      <div className="mt-4 space-y-2">
        {(
          [
            ["Launch week carousel", "Mon · 10:00", "Scheduled"],
            ["Founder story reel", "Yesterday", "Live"],
          ] as const
        ).map(([t, w, s]) => (
          <div key={t} className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-[12.5px] font-medium">{t}</p>
              <p className="text-[11px] text-slate-400">{w}</p>
            </div>
            <Status s={s} />
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11px] text-slate-400">Weekly reach</p>
      <div className="mt-2 flex flex-1 items-end gap-1.5">
        {bars.map((h, i) => (
          <motion.span
            key={i}
            initial={still ? false : { height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ delay: 0.2 + i * 0.06, duration: 0.6, ease }}
            className={`flex-1 rounded-t-md ${i === bars.length - 1 ? "bg-brand-red" : "bg-brand-navy/15"}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------- Steps ---------------------------------- */

type Step = {
  title: string;
  text: string;
  Icon: ComponentType<{ className?: string }>;
  Screen: ComponentType<{ still: boolean }>;
};

const steps: Step[] = [
  { title: "Plan together", text: "We draft your strategy sheet. You comment inline and sign off.", Icon: FileText, Screen: StrategyScreen },
  { title: "See every post ahead", text: "Your shared content calendar shows what's coming and when.", Icon: CalendarDays, Screen: CalendarScreen },
  { title: "Approve in one click", text: "Review each piece, approve it or ask for changes. No email chains.", Icon: CircleCheck, Screen: ReviewScreen },
  { title: "Go live & track", text: "Approved posts go out on schedule and results show up in your dashboard.", Icon: Send, Screen: PublishScreen },
];

export default function ProcessSection() {
  const reduceMotion = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-120px" });
  const [active, setActive] = useState(0);
  // Auto-play stops once the visitor picks a step, and never runs with reduced motion.
  const [manual, setManual] = useState(false);
  const autoplay = !manual && !reduceMotion && inView;

  const rise = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.7, delay, ease },
        };

  const { Screen } = steps[active];

  return (
    <section id="process" className="w-full bg-white px-6 py-24 font-sauce text-brand-navy">
      <motion.div {...rise()} className="flex flex-col items-center text-center">
        <SectionBadge icon={Workflow}>Process</SectionBadge>
        <h2 className="mt-7 text-[36px] font-semibold leading-[1.1] tracking-[-0.04em] md:text-[48px]">
          Your Content,
          <br />
          <span className="text-brand-red">Always in View</span>
        </h2>
        <p className="mt-4 max-w-[420px] text-[16px] leading-[1.4] text-slate-600">
          Every client gets their own Workseez portal: strategy, calendar, approvals and results in one place.
        </p>
      </motion.div>

      <motion.div ref={ref} {...rise(0.1)} className="mx-auto mt-14 grid max-w-[980px] items-center gap-8 md:grid-cols-[minmax(0,380px)_minmax(0,1fr)] md:gap-12">
        <ol className="space-y-2">
          {steps.map(({ title, text, Icon }, i) => {
            const on = i === active;
            return (
              <li key={title}>
                <button
                  type="button"
                  onClick={() => {
                    setManual(true);
                    setActive(i);
                  }}
                  aria-current={on ? "step" : undefined}
                  className={`relative w-full overflow-hidden rounded-2xl px-5 py-4 text-left transition-colors duration-300 ${on ? "bg-slate-50" : "hover:bg-slate-50/60"}`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`grid size-9 flex-none place-items-center rounded-full transition-colors duration-300 ${on ? "bg-brand-navy text-white" : "bg-slate-100 text-slate-500"}`}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className={`text-[18px] font-medium tracking-[-0.02em] transition-colors ${on ? "text-brand-navy" : "text-slate-500"}`}>
                      <span className="mr-2 text-slate-400">0{i + 1}</span>
                      {title}
                    </span>
                  </span>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.span
                        initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease }}
                        className="block overflow-hidden pl-12 text-[15px] leading-[1.45] text-slate-600"
                      >
                        <span className="block pt-1.5">{text}</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {/* Progress bar: when it fills, the next step takes over. */}
                  {on && autoplay && (
                    <motion.span
                      key={`progress-${i}`}
                      className="absolute bottom-0 left-0 h-[3px] bg-brand-red"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                      onAnimationComplete={() => setActive((a) => (a + 1) % steps.length)}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ol>

        <div>
          {/* Portal window — macOS Safari-style frosted toolbar. */}
          <div className="relative isolate overflow-hidden rounded-[22px] bg-white shadow-[0_32px_64px_-32px_rgba(6,17,40,.35),0_0_0_1px_rgba(6,17,40,.08)]">
            {/* Soft brand tint behind the glass so the blur has something to catch. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-[radial-gradient(60%_120%_at_20%_0%,rgba(170,36,47,.10),transparent_70%),radial-gradient(50%_120%_at_85%_0%,rgba(5,54,123,.10),transparent_70%)]"
            />
            <div
              aria-hidden
              className="flex h-13 items-center gap-3 border-b border-black/6 bg-white/55 px-4 shadow-[inset_0_1px_0_rgba(255,255,255,.9)] backdrop-blur-xl backdrop-saturate-150"
            >
              <span className="flex flex-none gap-2">
                <span className="size-3 rounded-full bg-[#ff5f57] ring-1 ring-black/10 ring-inset" />
                <span className="size-3 rounded-full bg-[#febc2e] ring-1 ring-black/10 ring-inset" />
                <span className="size-3 rounded-full bg-[#28c840] ring-1 ring-black/10 ring-inset" />
              </span>
              <span className="hidden flex-none items-center gap-2.5 pl-2 text-slate-500 sm:flex">
                <PanelLeft className="size-4" strokeWidth={1.75} />
                <ChevronLeft className="size-4" strokeWidth={2} />
                <ChevronRight className="size-4 text-slate-300" strokeWidth={2} />
              </span>
              <span className="mx-auto flex h-7 w-full min-w-0 max-w-60 items-center justify-center gap-1.5 rounded-lg bg-black/4.5 px-2.5 text-[12px] text-slate-600 shadow-[inset_0_0_0_0.5px_rgba(0,0,0,.06)]">
                <span className="flex min-w-0 flex-1 items-center justify-center gap-1.5 sm:pl-3">
                  <Lock className="size-3 flex-none text-slate-500" strokeWidth={2.25} />
                  <span className="truncate">portal.workseez.com</span>
                </span>
                <RotateCw className="hidden size-3 flex-none text-slate-400 sm:block" strokeWidth={2.25} />
              </span>
              <span className="hidden flex-none items-center gap-2.5 text-slate-500 sm:flex">
                <Share className="size-4" strokeWidth={1.75} />
                <Plus className="size-4" strokeWidth={1.75} />
                <Copy className="size-4" strokeWidth={1.75} />
              </span>
            </div>
            <div className="relative h-[320px] p-5 sm:p-6">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease }}
                  className="h-full"
                >
                  <Screen still={reduceMotion} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <a
            href={PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mx-auto mt-6 flex w-fit items-center gap-2 text-[15px] font-medium text-brand-navy underline-offset-4 hover:underline"
          >
            Explore the client portal
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
