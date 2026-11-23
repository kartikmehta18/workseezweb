"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { CircleCheck, CircleX, Scale } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

/* "Why choose Workseez" — generic agencies vs. us, side by side. */

const others = ["Generic content approach", "Focus on vanity metrics", "Limited video strategy", "Basic reporting", "Minimal communication"];
const ours = ["Audience-first strategy", "Results-driven campaigns", "Short-form video expertise", "Data-backed optimization", "Dedicated support"];

export default function ComparisonSection() {
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
    <section id="comparison" className="w-full bg-white px-6 py-24 font-sauce text-brand-navy">
      <motion.div {...rise()} className="flex flex-col items-center text-center">
        <SectionBadge icon={Scale}>Comparison</SectionBadge>
        <h2 className="mt-7 text-[36px] font-semibold leading-[1.1] tracking-[-0.04em] md:text-[48px]">
          Why Choose
          <br />
          <span className="text-brand-red">Workseez</span> Over Others
        </h2>
        <p className="mt-4 max-w-[340px] text-[16px] leading-[1.4] text-slate-600">
          See how our results-driven approach sets us apart from traditional social media agencies.
        </p>
      </motion.div>

      <motion.div {...rise(0.1)} className="mx-auto mt-14 grid max-w-[795px] rounded-[22px] bg-slate-50 md:grid-cols-2">
        <div className="px-7 py-8 md:py-9">
          <h3 className="text-[24px] font-medium tracking-[-0.03em]">Other Agencies</h3>
          <ul className="mt-6 space-y-3.5">
            {others.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[16px] text-slate-500">
                <CircleX className="size-4 flex-none fill-slate-500 text-white" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Highlighted side sits slightly proud of the panel. */}
        <div className="relative m-1.5 rounded-[18px] border-[3px] border-brand-navy bg-white px-6 py-7 shadow-[0_24px_48px_-24px_rgba(6,17,40,.45)] md:-my-1.5 md:mx-1.5">
          <h3 className="flex items-center gap-2.5 text-[24px] font-medium tracking-[-0.03em]">
            <Image src="/logo.jpeg" alt="" width={32} height={32} className="size-8 rounded-full" />
            Workseez
          </h3>
          <ul className="mt-6 space-y-3.5">
            {ours.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[16px] text-slate-700">
                <CircleCheck className="size-4 flex-none fill-brand-red text-white" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
