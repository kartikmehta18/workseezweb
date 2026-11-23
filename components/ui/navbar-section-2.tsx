"use client";

import { useEffect, useRef, useState, type ComponentType, type RefObject } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import visualeezShot from "@/public/visualeez.png";
import portalShot from "@/public/portal.png";
import {
  ArrowRight,
  ArrowUpRight,
  ChartColumn,
  ChevronDown,
  Clapperboard,
  CodeXml,
  LayoutDashboard,
  Megaphone,
  Menu,
  PenLine,
  Share2,
  X,
} from "lucide-react";

/* Brand colours live in app/globals.css (bg-brand-navy = #061128, etc.). */

type Accent = "red" | "blue" | "green" | "magenta";

// Full class strings so Tailwind can detect them at build time.
const accentBg: Record<Accent, string> = {
  red: "bg-brand-red",
  blue: "bg-brand-blue",
  green: "bg-brand-green",
  magenta: "bg-brand-magenta",
};

type IconType = ComponentType<{ className?: string }>;

type PanelId = "products" | "solutions";

type NavItem = {
  label: string;
  href?: string;
  panelId?: PanelId;
};

type PanelItem = {
  title: string;
  description: string;
  href: string;
  /** Shown at the bottom of the card, e.g. the product's domain. */
  footer?: string;
  external?: boolean;
  icon: IconType;
  accent: Accent;
  /** Screenshot shown as a large preview card (Products panel). */
  image?: StaticImageData;
};

type MenuPanel = {
  id: PanelId;
  /** Open height of the bar, in px (48px nav row + panel content). */
  height: number;
  items: PanelItem[];
};

const PORTAL_URL = "https://portal.workseez.com/";
const VISUALEEZ_URL = "https://visualeez.com";

// Paths start with "/" so they also work from other pages (e.g. /contact).
const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/#results" },
  { label: "Products", panelId: "products" },
  { label: "Services", panelId: "solutions" },
  { label: "About", href: "/#comparison" },
];

const menuPanels: MenuPanel[] = [
  {
    id: "products",
    height: 296,
    items: [
      { title: "Visualeez", description: "Turn ideas into animated infographics", href: VISUALEEZ_URL, footer: "visualeez.com", external: true, icon: ChartColumn, accent: "magenta", image: visualeezShot },
      { title: "Workseez Portal", description: "Every client relationship, in one place", href: PORTAL_URL, footer: "portal.workseez.com", external: true, icon: LayoutDashboard, accent: "blue", image: portalShot },
    ],
  },
  {
    id: "solutions",
    height: 250,
    items: [
      // All open the Services section on the home page.
      { title: "Digital Marketing", description: "Ads, SEO and campaigns", href: "/#services", icon: Megaphone, accent: "red" },
      { title: "Web & Software Dev", description: "Websites, apps and software", href: "/#services", icon: CodeXml, accent: "blue" },
      { title: "Video Editing", description: "Reels, ads and YouTube", href: "/#services", icon: Clapperboard, accent: "green" },
      { title: "Content Creation", description: "Writing, design and scripts", href: "/#services", icon: PenLine, accent: "red" },
      { title: "Social Media", description: "Page management and posting", href: "/#services", icon: Share2, accent: "blue" },
    ],
  },
];

function getPanel(panelId: string | null) {
  return menuPanels.find((panel) => panel.id === panelId);
}

function linkProps(item: Pick<PanelItem, "href" | "external">) {
  return item.external
    ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
    : { href: item.href };
}

function WorkseezLogo({ showWordmark = false }: { showWordmark?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <Image src="/logo.jpeg" alt="Workseez" width={38} height={38} loading="eager" className="size-[38px] rounded-lg" />
      {showWordmark && <span className="text-[17px] font-semibold tracking-tight text-brand-navy">Workseez</span>}
    </span>
  );
}

function IconBadge({ icon: Icon, accent, small = false }: { icon: IconType; accent: Accent; small?: boolean }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-md text-white ${accentBg[accent]} ${small ? "size-7" : "size-8"}`}>
      <Icon className={small ? "size-3.5" : "size-4"} />
    </span>
  );
}

/* ---------------------------------- Cards ---------------------------------- */

const cardBase =
  "group flex rounded-lg border border-brand-navy-line bg-white/[0.03] transition-colors hover:border-white/20 hover:bg-white/[0.06]";

function PanelCard({ item, compact = false }: { item: PanelItem; compact?: boolean }) {
  if (item.image) {
    return (
      <a {...linkProps(item)} className={`${cardBase} h-[214px] flex-col p-2`}>
        <span className="relative min-h-0 flex-1 overflow-hidden rounded-md bg-white ring-1 ring-white/10">
          <Image
            src={item.image}
            alt={`${item.title} screenshot`}
            fill
            sizes="320px"
            placeholder="blur"
            loading="eager"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </span>
        <span className="flex h-[46px] shrink-0 items-center justify-between gap-2 px-1.5 pt-1">
          <span className="min-w-0">
            <span className="block text-sm font-medium text-white">{item.title}</span>
            <span className="block truncate text-[11px] text-slate-400">{item.description}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1 text-[11px] text-slate-500 transition-colors group-hover:text-white">
            {item.footer}
            <ArrowUpRight className="size-3" />
          </span>
        </span>
      </a>
    );
  }

  if (compact) {
    return (
      <a {...linkProps(item)} className={`${cardBase} h-[78px] items-center gap-3 p-3`}>
        <IconBadge icon={item.icon} accent={item.accent} small />
        <span>
          <span className="block text-sm font-medium text-white">{item.title}</span>
          <span className="mt-0.5 block text-[11px] text-slate-400">{item.description}</span>
        </span>
      </a>
    );
  }

  return (
    <a {...linkProps(item)} className={`${cardBase} h-[150px] flex-col justify-between p-4`}>
      <div>
        <IconBadge icon={item.icon} accent={item.accent} />
        <h4 className="mt-3 text-[15px] font-medium text-white">{item.title}</h4>
        <p className="mt-1 text-[11px] leading-normal text-slate-400">{item.description}</p>
      </div>
      <span className="flex items-center gap-1 text-[11px] text-slate-500 group-hover:text-white">
        {item.footer ?? "Learn more"}
        {item.external ? <ArrowUpRight className="size-3" /> : <ArrowRight className="size-3" />}
      </span>
    </a>
  );
}

function DropdownPanel({ panel }: { panel: MenuPanel }) {
  const columns = panel.id === "products" ? "grid-cols-2" : "grid-cols-3";
  return (
    <div className={`grid ${columns} gap-3 bg-brand-navy p-4`}>
      {panel.items.map((item) => <PanelCard key={item.title} item={item} compact={panel.id === "solutions"} />)}
    </div>
  );
}

/* --------------------------------- Navbar ---------------------------------- */

/** While `active`, calls `onClose` on a click/tap outside every ref, or on Escape. */
function useDismiss(active: boolean, refs: RefObject<HTMLElement | null>[], onClose: () => void) {
  useEffect(() => {
    if (!active) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!refs.some((ref) => ref.current?.contains(target))) onClose();
    };
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
    // refs are stable and onClose only sets state, so `active` is the only real dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}

export default function NavbarTwo() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileActiveMenu, setMobileActiveMenu] = useState<string | null>(null);
  const activePanel = getPanel(activeMenu);

  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const mobileBarRef = useRef<HTMLDivElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  useDismiss(activeMenu !== null, [desktopMenuRef], () => setActiveMenu(null));
  useDismiss(mobileOpen, [mobileBarRef, mobilePanelRef], () => setMobileOpen(false));

  const toggleMenu = (menuName: string) => setActiveMenu(activeMenu === menuName ? null : menuName);

  return (
    <div className="relative z-40 flex w-full select-none flex-col items-center px-6 pt-0 font-sans text-zinc-900">
      {/* Desktop */}
      <div className="relative z-30 hidden h-12 w-full max-w-7xl items-center justify-between lg:flex">
        <Link href="/" className="flex items-center" aria-label="Workseez home">
          <span className="xl:hidden"><WorkseezLogo /></span>
          <span className="hidden xl:inline"><WorkseezLogo showWordmark /></span>
        </Link>

        <div ref={desktopMenuRef} className="absolute left-1/2 top-0 hidden w-[700px] -translate-x-1/2 lg:block" style={{ filter: "drop-shadow(0 10px 16px rgba(6, 17, 40, 0.16))" }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none absolute -left-[18px] top-0 z-10 text-brand-navy"><path d="M 20 20 L 20 0 L 0 0 C 11.046 0 20 11.046 20 20 Z" fill="currentColor" /></svg>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none absolute -right-[18px] top-0 z-10 text-brand-navy"><path d="M 0 0 L 20 0 C 8.954 0 0 8.954 0 20 Z" fill="currentColor" /></svg>

          <motion.div animate={{ height: activePanel ? activePanel.height : 48 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="relative flex w-full flex-col justify-start overflow-hidden bg-brand-navy" style={{ borderBottomLeftRadius: "16px", borderBottomRightRadius: "16px" }}>
            <div className="z-20 flex h-12 items-center justify-center px-6">
              <nav className="flex w-full items-center justify-center gap-5 text-[13px] font-medium text-slate-300">
                {navItems.map((item) => item.panelId ? (
                  <button key={item.label} type="button" aria-expanded={activeMenu === item.panelId} onClick={() => toggleMenu(item.panelId!)} className={`flex cursor-pointer items-center gap-1 rounded-md px-3 py-1 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/30 ${activeMenu === item.panelId ? "bg-brand-navy-light text-white" : "text-slate-300"}`}>
                    {item.label}<ChevronDown className={`h-3.5 w-3.5 opacity-70 transition-transform duration-200 ${activeMenu === item.panelId ? "rotate-180" : ""}`} />
                  </button>
                ) : <Link key={item.label} href={item.href ?? "/"} onClick={() => setActiveMenu(null)} className="px-2 py-1 text-slate-300 transition-colors hover:text-white">{item.label}</Link>)}
              </nav>
            </div>

            <AnimatePresence mode="wait">
              {activePanel && (
                <motion.div key={activePanel.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden border-t border-brand-navy-line bg-brand-navy">
                  <div onClick={(e) => (e.target as HTMLElement).closest("a") && setActiveMenu(null)}>
                    <DropdownPanel panel={activePanel} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <Link href="/contact" className="flex items-center gap-1 rounded-lg bg-brand-navy px-3.5 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-brand-navy-light">Contact<ArrowUpRight className="h-3.5 w-3.5" /></Link>
      </div>

      {/* Mobile */}
      <div ref={mobileBarRef} className="relative z-30 flex h-14 w-full items-center justify-between lg:hidden">
        <Link href="/" aria-label="Workseez home"><WorkseezLogo showWordmark /></Link>
        <div className="flex items-center gap-2">
          <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-1 rounded-lg bg-brand-navy px-3 py-1.5 text-xs font-medium text-white sm:flex">Client Portal<ArrowUpRight className="h-3 w-3" /></a>
          <button type="button" aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)} className="grid size-9 place-items-center rounded-lg border border-zinc-200 text-brand-navy">{mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}</button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div ref={mobilePanelRef} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="relative z-20 w-full overflow-hidden rounded-xl bg-brand-navy text-white lg:hidden">
            <div className="grid gap-1 p-4">
              {navItems.map((item) => {
                const panel = item.panelId ? getPanel(item.panelId) : null;
                const isOpen = mobileActiveMenu === item.panelId;

                if (!item.panelId) {
                  return <Link key={item.label} href={item.href ?? "/"} onClick={() => setMobileOpen(false)} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white">{item.label}</Link>;
                }

                return (
                  <div key={item.label}>
                    <button type="button" aria-expanded={isOpen} onClick={() => setMobileActiveMenu(isOpen ? null : item.panelId!)} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/10 hover:text-white">
                      {item.label}
                      <ChevronDown className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && panel && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="mx-3 mb-2 grid gap-1 border-l border-white/10 pl-3 pt-1">
                            {panel.items.map((panelItem) => (
                              <a key={panelItem.title} {...linkProps(panelItem)} onClick={() => setMobileOpen(false)} className={`flex gap-3 rounded-md px-3 py-2 hover:bg-white/5 ${panelItem.image ? "items-center" : "items-start"}`}>
                                {panelItem.image ? (
                                  <span className="relative h-10 w-[72px] shrink-0 overflow-hidden rounded bg-white ring-1 ring-white/10">
                                    <Image src={panelItem.image} alt="" fill sizes="72px" placeholder="blur" className="object-cover object-top" />
                                  </span>
                                ) : (
                                  <IconBadge icon={panelItem.icon} accent={panelItem.accent} small />
                                )}
                                <span>
                                  <span className="flex items-center gap-1 text-sm font-medium text-white">
                                    {panelItem.title}
                                    {panelItem.external && <ArrowUpRight className="size-3 text-slate-400" />}
                                  </span>
                                  <span className="mt-0.5 block text-xs leading-5 text-slate-400">{panelItem.description}</span>
                                </span>
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="mt-2 flex items-center justify-center gap-1 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-brand-navy">Contact / Book a call<ArrowUpRight className="size-3.5" /></Link>
              <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 rounded-lg border border-white/20 px-3 py-2 text-sm font-medium text-white sm:hidden">Client Portal<ArrowUpRight className="size-3.5" /></a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
