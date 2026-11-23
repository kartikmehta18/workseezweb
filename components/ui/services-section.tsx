"use client";

import { useRef, type ComponentType } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { CircleCheck, Film } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";
import BookCallButton from "@/components/ui/book-call-button";

/* "How we help you grow" — service cards that pin and stack as you scroll. */

const loop = { repeat: Infinity, ease: "easeInOut" } as const;
const stroke = { fill: "none", strokeWidth: 3.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/* ---------------------------------- Icons ---------------------------------- */
// Line illustrations: navy strokes with a red accent, each looping a small motion.

function CameraIcon({ still }: { still: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className="size-full" aria-hidden>
      <circle cx="60" cy="24" r="7" className="stroke-brand-navy" {...stroke} />
      <line x1="60" y1="31" x2="60" y2="40" className="stroke-brand-red" {...stroke} />
      {/* Body turns side-on and back, like the camera panning. */}
      <motion.g
        style={{ transformOrigin: "60px 62px", transformBox: "view-box" }}
        animate={still ? undefined : { scaleX: [1, 0.55, 1] }}
        transition={{ duration: 2.6, ...loop }}
      >
        <rect x="42" y="40" width="36" height="42" rx="4" className="stroke-brand-red" {...stroke} />
        <motion.g animate={still ? undefined : { x: [0, 12, 0] }} transition={{ duration: 2.6, ...loop }}>
          <circle cx="62" cy="61" r="12" className="stroke-brand-red" {...stroke} />
          <circle cx="62" cy="61" r="5" className="stroke-brand-navy" {...stroke} />
        </motion.g>
        <line x1="47" y1="72" x2="53" y2="72" className="stroke-brand-navy" {...stroke} />
      </motion.g>
      <motion.circle
        cx="47"
        cy="47"
        r="2.5"
        className="fill-brand-red"
        animate={still ? undefined : { opacity: [1, 0.15, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
      <line x1="54" y1="82" x2="52" y2="102" className="stroke-brand-red" {...stroke} />
      <line x1="66" y1="82" x2="68" y2="102" className="stroke-brand-red" {...stroke} />
    </svg>
  );
}

function ClapperIcon({ still }: { still: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className="size-full" aria-hidden>
      <rect x="28" y="52" width="64" height="44" rx="5" className="stroke-brand-navy" {...stroke} />
      <motion.path
        d="M54 63 L72 74 L54 85 Z"
        className="stroke-brand-red"
        {...stroke}
        style={{ transformOrigin: "62px 74px", transformBox: "view-box" }}
        animate={still ? undefined : { scale: [1, 1, 1.18, 1] }}
        transition={{ duration: 1.8, times: [0, 0.45, 0.6, 1], ...loop }}
      />
      {/* Clapper arm snaps shut on a hinge at the top-left corner. */}
      <motion.g
        style={{ transformOrigin: "28px 52px", transformBox: "view-box" }}
        animate={still ? undefined : { rotate: [0, -24, -24, 0, 0] }}
        transition={{ duration: 1.8, times: [0, 0.25, 0.4, 0.5, 1], ease: "easeInOut", repeat: Infinity }}
      >
        <rect x="28" y="38" width="64" height="14" rx="3" className="stroke-brand-red" {...stroke} />
        <line x1="42" y1="38" x2="49" y2="52" className="stroke-brand-red" {...stroke} />
        <line x1="57" y1="38" x2="64" y2="52" className="stroke-brand-red" {...stroke} />
        <line x1="72" y1="38" x2="79" y2="52" className="stroke-brand-red" {...stroke} />
      </motion.g>
    </svg>
  );
}

// Points along the curve the pen follows (cubic Bézier sampled at 12 steps).
const curve = { p0: [34, 80], p1: [48, 36], p2: [68, 96], p3: [86, 44] } as const;
const curvePath = `M${curve.p0} C${curve.p1} ${curve.p2} ${curve.p3}`;
const curvePoints = Array.from({ length: 13 }, (_, i) => {
  const t = i / 12;
  const u = 1 - t;
  const at = (k: 0 | 1) => u ** 3 * curve.p0[k] + 3 * u * u * t * curve.p1[k] + 3 * u * t * t * curve.p2[k] + t ** 3 * curve.p3[k];
  return [at(0), at(1)];
});

function PenIcon({ still }: { still: boolean }) {
  const draw = { duration: 3, times: [0, 0.6, 0.85, 1], ...loop };
  const penTimes = [...curvePoints.map((_, i) => (i / 12) * 0.6), 0.85, 1];
  return (
    <svg viewBox="0 0 120 120" className="size-full" aria-hidden>
      <rect x="22" y="24" width="76" height="72" rx="8" className="stroke-brand-navy" {...stroke} />
      <motion.path
        d={curvePath}
        className="stroke-brand-red"
        {...stroke}
        initial={still ? false : { pathLength: 0 }}
        animate={still ? { pathLength: 1 } : { pathLength: [0, 1, 1, 1], opacity: [1, 1, 1, 0] }}
        transition={draw}
      />
      <rect x="30" y="76" width="8" height="8" rx="1.5" className="fill-white stroke-brand-navy" strokeWidth={2.5} />
      <rect x="82" y="40" width="8" height="8" rx="1.5" className="fill-white stroke-brand-navy" strokeWidth={2.5} />
      {/* Pen tip riding the end of the line as it draws. */}
      <motion.circle
        r="4.5"
        className="fill-brand-navy"
        cx={curve.p3[0]}
        cy={curve.p3[1]}
        animate={
          still
            ? undefined
            : {
                cx: [...curvePoints.map((p) => p[0]), curve.p3[0], curve.p3[0]],
                cy: [...curvePoints.map((p) => p[1]), curve.p3[1], curve.p3[1]],
                opacity: [...curvePoints.map(() => 1), 1, 0],
              }
        }
        transition={{ duration: 3, times: penTimes, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
}

function star(cx: number, cy: number, outer: number, inner: number) {
  return (
    Array.from({ length: 10 }, (_, i) => {
      const r = i % 2 ? inner : outer;
      const a = (Math.PI / 5) * i - Math.PI / 2;
      return `${i ? "L" : "M"}${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
    }).join(" ") + " Z"
  );
}

const bubble = (x: number, y: number) =>
  `M${x + 5} ${y} h34 a5 5 0 0 1 5 5 v24 a5 5 0 0 1 -5 5 h-12 l-5 6 l-5 -6 h-12 a5 5 0 0 1 -5 -5 v-24 a5 5 0 0 1 5 -5 z`;

function ChatIcon({ still }: { still: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className="size-full" aria-hidden>
      <motion.g animate={still ? undefined : { y: [0, 3, 0] }} transition={{ duration: 2.4, ...loop }}>
        <path d={bubble(50, 52)} className="stroke-brand-navy" {...stroke} />
        {[
          [60, 64, 84],
          [60, 73, 76],
        ].map(([x1, y, x2], i) => (
          <motion.line
            key={y}
            x1={x1}
            y1={y}
            x2={x2}
            y2={y}
            className="stroke-brand-navy"
            {...stroke}
            animate={still ? undefined : { pathLength: [0, 1, 1] }}
            transition={{ duration: 2.4, times: [0, 0.5, 1], delay: i * 0.25, repeat: Infinity, ease: "easeOut" }}
          />
        ))}
      </motion.g>
      <motion.g animate={still ? undefined : { y: [0, -4, 0] }} transition={{ duration: 2.4, ...loop }}>
        {/* Filled with the panel colour so it sits in front of the back bubble. */}
        <path d={bubble(26, 28)} className="fill-slate-100 stroke-brand-red" {...stroke} />
        <motion.path
          d={star(48, 45, 9, 4)}
          className="stroke-brand-navy"
          {...stroke}
          strokeWidth={3}
          style={{ transformOrigin: "48px 45px", transformBox: "view-box" }}
          animate={still ? undefined : { rotate: [0, 0, 72], scale: [1, 1.2, 1] }}
          transition={{ duration: 2.4, times: [0, 0.5, 1], ...loop }}
        />
      </motion.g>
    </svg>
  );
}

/* --------------------------------- Services -------------------------------- */

type Service = {
  title: string;
  description: string;
  points: string[];
  Icon: ComponentType<{ still: boolean }>;
};

const services: Service[] = [
  {
    title: "Content Creation",
    description: "Short-form videos and visuals designed to capture attention and engage the right audience.",
    points: ["Short-form video production", "Branded social visuals", "Content calendar planning"],
    Icon: CameraIcon,
  },
  {
    title: "Video Editing",
    description: "Reels, ads and YouTube videos, cut and polished so people watch to the end.",
    points: ["Reels & short-form edits", "Captions & motion graphics", "Colour grading & sound"],
    Icon: ClapperIcon,
  },
  {
    title: "Graphic Designing",
    description: "On-brand posts, carousels and ad creatives that stop the scroll and explain fast.",
    points: ["Carousels & infographics", "Ad creatives", "Brand kits & templates"],
    Icon: PenIcon,
  },
  {
    title: "Social Management",
    description: "Reach the right audience, boost engagement, and grow your brand with targeted campaigns.",
    points: ["Post scheduling & publishing", "Community engagement", "Performance tracking"],
    Icon: ChatIcon,
  },
];

function ServiceCard({ service, index, progress }: { service: Service; index: number; progress: MotionValue<number> }) {
  const reduceMotion = useReducedMotion() ?? false;
  // Cards further down the stack shrink a little as later ones slide over them.
  const targetScale = 1 - (services.length - 1 - index) * 0.04;
  const scale = useTransform(progress, [index / services.length, 1], [1, targetScale]);
  const { Icon } = service;
  const flip = index % 2 === 1;

  return (
    <div className="sticky" style={{ top: `calc(6rem + ${index * 18}px)` }}>
      <motion.article
        style={{ scale: reduceMotion ? 1 : scale, transformOrigin: "top center" }}
        className="grid gap-3 rounded-[20px] bg-white p-3 shadow-[0_24px_60px_-40px_rgba(6,17,40,.45)] ring-1 ring-slate-200/80 md:grid-cols-2 md:gap-0"
      >
        <div className={`grid min-h-56 place-items-center rounded-lg bg-slate-100 md:min-h-[320px] ${flip ? "md:order-2" : ""}`}>
          <div className="size-40 md:size-52">
            <Icon still={reduceMotion} />
          </div>
        </div>
        <div className="flex flex-col justify-center px-5 pb-5 pt-4 sm:px-8 sm:pb-8 md:p-10">
          <h3 className="text-[28px] font-semibold tracking-[-0.03em] text-brand-navy md:text-[34px]">{service.title}</h3>
          <p className="mt-2 max-w-[370px] text-[16px] leading-[1.45] text-slate-600">{service.description}</p>
          <ul className="mt-5 space-y-2">
            {service.points.map((point) => (
              <li key={point} className="flex items-center gap-2 text-[14px] text-slate-600">
                <CircleCheck className="size-3.5 text-brand-red" />
                {point}
              </li>
            ))}
          </ul>
          <BookCallButton className="mt-7" />
        </div>
      </motion.article>
    </div>
  );
}

export default function ServicesSection() {
  const stackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ["start start", "end end"] });
  const rise = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] as const },
      };

  return (
    <section id="services" className="relative w-full bg-slate-50 px-6 py-24 font-sauce text-brand-navy">
      <motion.div {...rise} className="flex flex-col items-center text-center">
        <SectionBadge icon={Film}>Services</SectionBadge>
        <h2 className="mt-5 text-[38px] font-semibold leading-[1.05] tracking-[-0.04em] md:text-[56px]">How we help you grow</h2>
      </motion.div>

      <div ref={stackRef} className="mx-auto mt-14 flex max-w-[1072px] flex-col gap-10 pb-16">
        {services.map((service, i) => (
          <ServiceCard key={service.title} service={service} index={i} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
