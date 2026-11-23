import type { ComponentType, ReactNode } from "react";

/** Small pill label shown above a section heading, e.g. [icon] Services. */
export default function SectionBadge({
  icon: Icon,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[15px] font-medium text-slate-600">
      <Icon className="size-4" />
      {children}
    </span>
  );
}
