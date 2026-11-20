"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
import BookCallButton from "@/components/ui/book-call-button";

/* "Got questions? We've got answers." — intro on the left, accordion on the right. */

// Draft answers — check they match how Workseez actually works before launch.
const faqs = [
  {
    q: "Which platforms do you work with?",
    a: "Instagram, LinkedIn and X. We plan, create and post for each one, and shape every format to how people actually use that platform.",
  },
  {
    q: "How long before we see results?",
    a: "Most clients see engagement pick up within the first 4–6 weeks. Leads and sales usually build over 2–3 months as we test and double down on what works.",
  },
  {
    q: "Do you offer custom plans?",
    a: "Yes. If none of the packages fit, we'll build a plan around your goals, budget and platforms. Book a call and we'll scope it together.",
  },
  {
    q: "What services do you offer?",
    a: "Content creation, video editing, graphic design and social media management, plus web development and AI automation when you need them.",
  },
  {
    q: "How do we get started?",
    a: "Book a call. We'll learn about your brand and goals, suggest a plan, and get your first batch of content into production.",
  },
];

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const id = useId();
  return (
    <div className="rounded-[18px] bg-slate-50 ring-1 ring-slate-200/80 transition-colors duration-300 hover:bg-slate-100/70">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 rounded-[18px] px-5 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-brand-navy/40"
      >
        <span className="text-[18px] font-medium tracking-[-0.02em] text-brand-navy">{q}</span>
        <span
          className={`grid size-[30px] flex-none place-items-center rounded-full bg-brand-navy text-white shadow-[0_6px_14px_-6px_rgba(6,17,40,.6)] transition-transform duration-300 ${open ? "rotate-45" : ""}`}
        >
          <Plus className="size-4" strokeWidth={2.5} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-[440px] px-5 pb-5 text-[16px] leading-[1.5] text-slate-600">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const rise = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] as const },
        };

  return (
    <section id="faq" className="w-full bg-white px-6 py-24 font-sauce text-brand-navy md:py-32">
      <div className="mx-auto grid max-w-[1072px] gap-12 md:grid-cols-[1fr_508px] md:gap-16">
        <motion.div {...rise()} className="flex flex-col items-start">
          <span className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-[14px] font-medium text-slate-600">FAQ</span>
          <h2 className="mt-7 text-[38px] font-semibold leading-[1.12] tracking-[-0.04em] md:text-[52px]">
            Got questions?
            <br />
            <span className="text-brand-red">We&rsquo;ve Got Answers.</span>
          </h2>
          <p className="mt-5 max-w-[470px] text-[17px] leading-[1.35] text-slate-600">
            Common questions about how we work and what to expect. Everything you need to know before getting started with us.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <BookCallButton />
            <Link
              href="/contact"
              className="inline-flex h-[55px] items-center rounded-full bg-white px-6 text-[17px] font-medium tracking-[-0.02em] text-brand-navy shadow-[0_12px_28px_-16px_rgba(6,17,40,.45)] ring-1 ring-slate-200 transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:ring-slate-300"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>

        <div className="flex flex-col gap-5">
          {faqs.map((item, i) => (
            <motion.div key={item.q} {...rise(0.06 * i)}>
              <FaqItem q={item.q} a={item.a} open={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? null : i)} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
