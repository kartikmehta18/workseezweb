"use client";

import { useEffect } from "react";
import Image from "next/image";
import Cal, { getCalApi } from "@calcom/embed-react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, CircleCheck, Clock, Globe, Video } from "lucide-react";

/* Contact / Book a call — one booking panel: navy call details on the left, Cal.com calendar on the right. */

/**
 * Cal.com event: "username/event-slug" (a full https://cal.com/... URL also works).
 * Override per environment with NEXT_PUBLIC_CAL_LINK.
 */
const CAL_LINK = (process.env.NEXT_PUBLIC_CAL_LINK || "workseezcrm-uqox53/30min").replace(/^https?:\/\/(app\.)?cal\.com\//, "").replace(/\/$/, "");
const CAL_NAMESPACE = "workseez-call";
const PORTAL_URL = "https://portal.workseez.com/";

const details = [
  { icon: Clock, label: "30 minutes" },
  { icon: Video, label: "Cal Video — link sent with your invite" },
  { icon: Globe, label: "Times shown in your timezone" },
];

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
        // Call details live in our navy panel, so Cal shows just the calendar and times.
        hideEventTypeDetails: true,
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

function CallDetails() {
  return (
    <div className="flex h-full flex-col rounded-[22px] bg-brand-navy p-7 text-white">
      <div className="flex items-center gap-2.5">
        <Image src="/logo.jpeg" alt="" width={36} height={36} className="size-9 rounded-full ring-1 ring-white/20" />
        <span className="text-[15px] font-semibold text-slate-300">Workseez</span>
      </div>
      <h2 className="mt-5 text-[26px] font-semibold leading-[1.15] tracking-[-0.03em]">Free strategy call</h2>

      <ul className="mt-5 space-y-3">
        {details.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-3 text-[15px] text-slate-200">
            <Icon className="size-[18px] flex-none text-slate-400" />
            {label}
          </li>
        ))}
      </ul>

      <div className="my-6 h-px bg-white/10" />

      <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-slate-400">What we&rsquo;ll cover</p>
      <ul className="mt-3 space-y-2.5">
        {agenda.map((item) => (
          <li key={item} className="flex gap-2.5 text-[15px] leading-[1.45] text-slate-200">
            <CircleCheck className="mt-0.5 size-4 flex-none fill-brand-red text-brand-navy" />
            {item}
          </li>
        ))}
      </ul>

      <a
        href={PORTAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-auto inline-flex items-center gap-1.5 pt-8 text-[14px] font-medium text-slate-300 transition-colors hover:text-white"
      >
        Already a client? Go to the Client Portal
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
        <span className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-[14px] font-medium text-slate-600">Contact</span>
        <h1 className="mt-5 text-[36px] font-semibold leading-[1.08] tracking-[-0.04em] md:text-[48px]">
          Let&rsquo;s Talk About Your <span className="text-brand-red">Growth</span>
        </h1>
        <p className="mt-3 max-w-[520px] text-[17px] leading-[1.45] text-slate-600">
          Pick a time that suits you and we&rsquo;ll come prepared with ideas for your brand.
        </p>
      </motion.div>

      <motion.div
        {...rise(0.12)}
        className="relative mx-auto mt-10 grid max-w-[1120px] gap-2 rounded-[28px] bg-white p-2 shadow-[0_30px_70px_-40px_rgba(6,17,40,.45)] ring-1 ring-slate-200/80 lg:grid-cols-[340px_1fr]"
      >
        <CallDetails />
        <div className="min-w-0 rounded-[22px] bg-white">
          <BookingCalendar />
        </div>
      </motion.div>
    </section>
  );
}
