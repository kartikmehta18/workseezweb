"use client";

import { useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { ArrowUp } from "lucide-react";
import { useLenis } from "lenis/react";
import BookCallButton from "@/components/ui/book-call-button";

/* Navy footer: intro + link columns, giant wordmark, copyright bar. */

type FooterLink = { label: string; href: string; external?: boolean };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Pages",
    links: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/#services" },
      { label: "Pricing", href: "/#pricing" },
      { label: "FAQ", href: "/#faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Follow",
    // TODO: replace "#" with the real Workseez profile URLs.
    links: [
      { label: "Instagram", href: "#", external: true },
      { label: "LinkedIn", href: "#", external: true },
      { label: "X", href: "#", external: true },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "Visualeez", href: "https://visualeez.com", external: true },
      { label: "Client Portal", href: "https://portal.workseez.com/", external: true },
    ],
  },
];

const WORDMARK = "Workseez";

// The year is read in the browser only: Next's prerender rejects `new Date()`, so the server snapshot is null.
const noSubscribe = () => () => {};
const useYear = () => useSyncExternalStore(noSubscribe, () => new Date().getFullYear(), () => null);

const linkClass = "text-[17px] font-medium text-slate-300 transition-colors hover:text-white";

/** One wordmark letter, rising from below its baseline as `progress` runs over its slice of the scroll. */
function Letter({ char, index, progress }: { char: string; index: number; progress: MotionValue<number> }) {
  const start = index * 0.05;
  const end = start + 0.55;
  const y = useTransform(progress, [start, end], ["105%", "0%"]);
  const opacity = useTransform(progress, [start, end * 0.8], [0, 1]);
  return (
    <motion.span className="inline-block" style={{ y, opacity }}>
      {char}
    </motion.span>
  );
}

/** Giant wordmark tied to scroll: letters slide up into place, one after another, as you scroll down to it. */
function Wordmark() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();
  // 0 when the wordmark's top enters the bottom of the screen, 1 when its bottom reaches it.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  return (
    <p
      ref={ref}
      aria-hidden
      className="mt-16 flex select-none justify-center overflow-hidden whitespace-nowrap pb-[0.06em] text-[clamp(60px,15.5vw,224px)] font-semibold leading-[0.9] tracking-[-0.06em] md:mt-20"
    >
      {reduceMotion ? WORDMARK : WORDMARK.split("").map((char, i) => <Letter key={i} char={char} index={i} progress={progress} />)}
    </p>
  );
}

export default function SiteFooter() {
  const reduceMotion = useReducedMotion();
  const year = useYear();

  const lenis = useLenis();
  // Glide up with Lenis (instant when reduced motion is on); fall back to native scrolling.
  const backToTop = () => (lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  return (
    <footer className="w-full overflow-hidden bg-brand-navy font-sauce text-white">
      <div className="mx-auto max-w-[1120px] px-6 pt-20 md:pt-24">
        <div className="flex flex-col gap-14 md:flex-row md:justify-between">
          <div className="max-w-[420px]">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Workseez home">
              <Image src="/logo.jpeg" alt="" width={44} height={44} className="size-11 rounded-full ring-1 ring-white/15" />
              <span className="text-[26px] font-semibold tracking-[-0.04em]">Workseez</span>
            </Link>
            <p className="mt-6 text-[20px] leading-[1.4] tracking-[-0.01em] text-slate-300">
              Short-form content, community and paid social for brands that want to be seen.
            </p>
            <BookCallButton variant="light" className="mt-7" />
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-14 gap-y-10 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-[15px] font-semibold text-slate-400">{col.title}</h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href} className={linkClass}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <Wordmark />

        <div className="mt-14 flex items-center justify-between gap-4 border-t border-white/10 py-7 text-[15px]">
          <p className="text-slate-400">© {year ? `${year} ` : ""}Workseez. All rights reserved.</p>
          <button type="button" onClick={backToTop} className="group inline-flex items-center gap-1.5 font-semibold text-white">
            Back to top
            <ArrowUp className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
