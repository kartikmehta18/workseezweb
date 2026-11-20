"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CircleCheck } from "lucide-react";

/* "Pricing that actually makes sense" — three plans, a billing toggle and a custom plan row. */

type Billing = "monthly" | "annually";

type Plan = {
  badge: string;
  line1: string;
  line2: string;
  monthly: number;
  features: string[];
  featured?: boolean;
};

const plans: Plan[] = [
  {
    badge: "Starter Plan",
    line1: "For Brands Getting",
    line2: "Started On Social",
    monthly: 47,
    features: ["Posting on 2 platforms", "Basic social management", "Monthly performance report", "Email support", "12 short-form videos", "Visual identity & feed styling"],
  },
  {
    badge: "Growth Plan",
    line1: "For Brands Ready",
    line2: "To Engage",
    monthly: 57,
    featured: true,
    features: ["Posting on 4 platforms", "Full social management", "Paid ads setup & optimization", "Bi-weekly performance reports", "20 short-form videos", "Advanced audience targeting"],
  },
  {
    badge: "Premium Plan",
    line1: "For Brands Making",
    line2: "A Big Impact",
    monthly: 67,
    features: ["Posting on 6 platforms", "Full social management", "Advanced brand positioning", "Weekly performance insights", "25+ short-form videos", "Dedicated support"],
  },
];

const customFeatures = ["Custom strategy", "Flexible deliverables", "Scalable ad budget", "Dedicated reporting"];

// Annual billing: 20% off, shown as the monthly equivalent.
const priceFor = (plan: Plan, billing: Billing) => (billing === "monthly" ? plan.monthly : Math.round(plan.monthly * 0.8));

function BillingToggle({ billing, onChange }: { billing: Billing; onChange: (b: Billing) => void }) {
  return (
    <div role="radiogroup" aria-label="Billing period" className="inline-flex rounded-full bg-slate-50 p-1.5 shadow-[0_12px_32px_-16px_rgba(6,17,40,.35)] ring-1 ring-slate-200/80">
      {(["monthly", "annually"] as const).map((option) => {
        const active = billing === option;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option)}
            className={`relative h-11 rounded-full px-5 text-[17px] font-medium capitalize transition-colors duration-300 ${active ? "text-white" : "text-slate-700 hover:text-brand-navy"}`}
          >
            {active && (
              <motion.span
                layoutId="billing-pill"
                className="absolute inset-0 rounded-full bg-brand-navy shadow-[0_8px_18px_-8px_rgba(6,17,40,.7)]"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{option}</span>
          </button>
        );
      })}
    </div>
  );
}

function Price({ value, billing }: { value: number; billing: Billing }) {
  return (
    <div className="mt-7 flex items-end gap-1">
      <span className="relative inline-flex overflow-hidden text-[52px] font-semibold leading-none tracking-[-0.04em]">
        $
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="pb-1.5 text-[13px] leading-tight text-slate-500">
        /month
        {billing === "annually" && <span className="block">billed yearly</span>}
      </span>
    </div>
  );
}

function PlanCard({ plan, billing }: { plan: Plan; billing: Billing }) {
  const featured = plan.featured;
  return (
    <div
      className={`flex h-full flex-col rounded-[20px] p-2.5 transition-transform duration-300 hover:-translate-y-1 ${
        featured
          ? "bg-brand-red/[0.03] shadow-[0_24px_50px_-28px_rgba(170,36,47,.5)] ring-[3px] ring-brand-red/20"
          : "bg-slate-50 ring-1 ring-slate-200/80"
      }`}
    >
      <div className={`rounded-[10px] p-5 ${featured ? "bg-brand-red/[0.09]" : "bg-slate-100"}`}>
        <span className="inline-block rounded-md bg-brand-red/15 px-2.5 py-1.5 text-[13px] font-medium text-brand-red">{plan.badge}</span>
        <h3 className="mt-5 text-[18px] font-medium leading-[1.4] tracking-[-0.02em]">
          {plan.line1}
          <br />
          <span className="font-semibold text-brand-red">{plan.line2}</span>
        </h3>
        <Price value={priceFor(plan, billing)} billing={billing} />
        <Link
          href="/contact"
          className={`mt-6 inline-flex h-12 items-center rounded-full px-5 text-[17px] font-semibold text-white shadow-[0_14px_26px_-12px_rgba(6,17,40,.75)] transition-[translate,background-color] duration-300 hover:-translate-y-0.5 ${
            featured ? "bg-brand-red hover:bg-[#8f1d27]" : "bg-brand-navy hover:bg-brand-navy-light"
          }`}
        >
          Get Started
        </Link>
      </div>
      <ul className="space-y-[11px] px-2.5 pb-3 pt-7">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-[15px] text-slate-600">
            <CircleCheck className={`size-3.5 flex-none ${featured ? "text-brand-red" : "text-slate-500"}`} />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PricingSection() {
  const [billing, setBilling] = useState<Billing>("monthly");
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
    <section id="pricing" className="w-full bg-white px-6 py-24 font-sauce text-brand-navy">
      <motion.div {...rise()} className="flex flex-col items-center text-center">
        <span className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-[15px] font-medium text-slate-600">Pricing</span>
        <h2 className="mt-7 max-w-[600px] text-[38px] font-semibold leading-[1.12] tracking-[-0.04em] md:text-[52px]">
          Pricing That Actually <br className="hidden md:block" />
          Makes <span className="text-brand-red">Sense</span>
        </h2>
        <p className="mt-3.5 max-w-[450px] text-[17px] leading-[1.35] text-slate-600">
          Straightforward packages with no hidden costs, clear pricing, and transparent deliverables from day one.
        </p>
        <div className="mt-14">
          <BillingToggle billing={billing} onChange={setBilling} />
        </div>
      </motion.div>

      <div className="mx-auto mt-10 max-w-[1071px]">
        <div className="grid gap-[26px] md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div key={plan.badge} {...rise(0.08 * i)}>
              <PlanCard plan={plan} billing={billing} />
            </motion.div>
          ))}
        </div>

        <motion.div
          {...rise(0.1)}
          className="mt-6 grid items-center gap-6 rounded-[20px] bg-slate-50 px-5 py-6 ring-1 ring-slate-200/80 md:grid-cols-[1.35fr_1fr_auto] md:gap-8"
        >
          <div>
            <h3 className="text-[24px] font-medium tracking-[-0.03em]">Custom Plan</h3>
            <p className="mt-2.5 max-w-[430px] text-[17px] leading-[1.35] text-slate-600">
              Need something tailored to your goals? Let&rsquo;s create a custom plan built around your brand and audience.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-x-10 gap-y-3">
            {customFeatures.map((feature) => (
              <li key={feature} className="flex items-center gap-2 whitespace-nowrap text-[15px] text-slate-600">
                <CircleCheck className="size-3.5 flex-none text-brand-red" />
                {feature}
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="inline-flex h-12 w-fit items-center rounded-full bg-brand-navy px-5 text-[17px] font-semibold text-white shadow-[0_14px_26px_-12px_rgba(6,17,40,.75)] transition-[translate,background-color] duration-300 hover:-translate-y-0.5 hover:bg-brand-navy-light"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
