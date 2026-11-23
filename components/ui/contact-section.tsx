"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Mail } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

/* Contact / Book a call — short header, full-width Cal.com calendar, agenda row. */

/**
 * Cal.com event: "username/event-slug" (a full https://cal.com/... URL also works).
 * Override per environment with NEXT_PUBLIC_CAL_LINK.
 */
const CAL_LINK = (process.env.NEXT_PUBLIC_CAL_LINK || "workseezcrm-uqox53/30min").replace(/^https?:\/\/(app\.)?cal\.com\//, "").replace(/\/$/, "");
const CAL_NAMESPACE = "workseez-call";
const PORTAL_URL = "https://portal.workseez.com/";


const agenda = ["Your goals, audience and where you are today", "What's working on your socials, and what isn't", "A clear plan and the right package for you"];

function BookingCalendar() {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE });
      cal("ui", {
        theme: "light",
        // Brand colour, and drop Cal's own border so it sits flush inside our panel.
        cssVarsPerTheme: {
          light: { "cal-brand": "#061128", "cal-border-booker": "transparent", "cal-border-booker-width": "0px" },
          dark: { "cal-brand": "#ffffff" },
        },
        // Keep Cal's details column: with it, Cal uses its compact desktop layout (details · calendar · times).
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <Cal
      namespace={CAL_NAMESPACE}
      calLink={CAL_LINK}
      config={{ layout: "month_view", theme: "light" }}
      // The embed grows to fit its content; this only reserves space while it loads.
      className="min-h-[480px] w-full overflow-auto"
    />
  );
}

function Agenda() {
  return (
    <div className="mx-auto mt-6 grid max-w-[1120px] gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
      {agenda.map((item, i) => (
        <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3.5 ring-1 ring-slate-200/80">
          <span className="grid size-8 flex-none place-items-center rounded-full bg-brand-navy text-[12px] font-semibold text-white">0{i + 1}</span>
          <span className="text-[14px] leading-[1.35] text-slate-600">{item}</span>
        </div>
      ))}
      <a
        href={PORTAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center gap-1.5 rounded-2xl bg-brand-navy px-5 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-brand-navy-light"
      >
        Client Portal
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

export default function ContactSection() {
  const reduceMotion = useReducedMotion();
  const rise = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] as const },
        };

  return (
    <section id="contact" className="relative w-full overflow-hidden px-6 pb-20 pt-10 font-sauce text-brand-navy md:pt-14">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[460px] bg-circuit" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[460px] bg-[linear-gradient(180deg,#fff_0%,rgba(255,255,255,0)_20%,rgba(255,255,255,0)_50%,#fff_100%)]" />

      <motion.div {...rise()} className="relative flex flex-col items-center text-center">
        <SectionBadge icon={Mail}>Contact</SectionBadge>
        <h1 className="mt-5 text-[36px] font-semibold leading-[1.08] tracking-[-0.04em] md:text-[48px]">
          Let&rsquo;s Talk About Your <span className="text-brand-red">Growth</span>
        </h1>
        <p className="mt-3 max-w-[520px] text-[17px] leading-[1.45] text-slate-600">
          Pick a time that suits you and we&rsquo;ll come prepared with ideas for your brand.
        </p>
      </motion.div>

      {/* Full width so Cal.com uses its compact desktop layout. */}
      <motion.div
        {...rise(0.12)}
        className="relative mx-auto mt-10 max-w-[1120px] rounded-[28px] bg-white p-2 shadow-[0_30px_70px_-40px_rgba(6,17,40,.45)] ring-1 ring-slate-200/80"
      >
        <BookingCalendar />
      </motion.div>
      <motion.div {...rise(0.2)} className="relative">
        <Agenda />
      </motion.div>
    </section>
  );
}
