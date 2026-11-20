import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const variants = {
  // Navy pill, white arrow disc — for light backgrounds.
  dark: {
    pill: "bg-brand-navy text-white shadow-[0_20px_40px_-18px_rgba(6,17,40,.75),inset_0_1px_0_rgba(255,255,255,.12)] hover:bg-brand-navy-light",
    disc: "bg-white text-brand-navy",
  },
  // White pill, navy arrow disc — for the navy footer.
  light: {
    pill: "bg-white text-brand-navy shadow-[0_20px_40px_-18px_rgba(0,0,0,.6)] hover:bg-slate-100",
    disc: "bg-brand-navy text-white",
  },
};

/** "Book a call" pill with an arrow disc that turns on hover. Used in the hero, service cards, FAQ and footer. */
export default function BookCallButton({
  href = "/contact",
  className = "",
  variant = "dark",
}: {
  href?: string;
  className?: string;
  variant?: keyof typeof variants;
}) {
  const v = variants[variant];
  return (
    <Link
      href={href}
      className={`group inline-flex h-[55px] w-fit items-center gap-3.5 rounded-full pl-6 pr-2 text-[17px] font-medium tracking-[-0.02em] transition-[translate,background-color] duration-300 hover:-translate-y-0.5 ${v.pill} ${className}`}
    >
      Book a call
      <span className={`grid size-10 place-items-center rounded-full transition-transform duration-300 group-hover:rotate-45 ${v.disc}`}>
        <ArrowUpRight className="size-4" strokeWidth={2.5} />
      </span>
    </Link>
  );
}
