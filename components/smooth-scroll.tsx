"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";

/**
 * Site-wide smooth (inertia) scrolling via Lenis.
 * Lenis drives the real window scroll, so sticky sections, motion's useScroll and Cal.com keep working.
 * It honours prefers-reduced-motion automatically (scroll becomes 1:1 and jumps are instant).
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, wheelMultiplier: 1, autoRaf: true, stopInertiaOnNavigate: true }}>
      <HashLinks />
      {children}
    </ReactLenis>
  );
}

/** Glide to #sections: on same-page link clicks, and when arriving on a page with a hash. */
function HashLinks() {
  const lenis = useLenis();
  const pathname = usePathname();

  // Same-page links like "/#services": handle before Next's Link, which would jump instantly.
  useEffect(() => {
    if (!lenis) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank") return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname) return;

      e.preventDefault();
      e.stopPropagation();
      if (!url.hash) {
        lenis.scrollTo(0);
        history.pushState(null, "", url.pathname);
        return;
      }
      const target = document.querySelector(decodeURIComponent(url.hash));
      if (target) lenis.scrollTo(target as HTMLElement);
      history.pushState(null, "", url.hash);
    };
    // Capture phase on window runs before React's handlers, so Next doesn't also scroll.
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [lenis]);

  // Arriving from another page (e.g. /contact → /#services): glide to the section once it has rendered.
  useEffect(() => {
    if (!lenis || !location.hash) return;
    const id = setTimeout(() => {
      const target = document.querySelector(decodeURIComponent(location.hash));
      if (target) lenis.scrollTo(target as HTMLElement);
    }, 80);
    return () => clearTimeout(id);
  }, [lenis, pathname]);

  return null;
}
