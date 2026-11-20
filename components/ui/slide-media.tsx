import Image from "next/image";

/**
 * Post samples in public/heroslide, converted from the original GIFs (≈31 MB) to
 * short MP4 loops (≈2 MB total) plus WebP stills.
 */
export const slides = {
  aiAgents: { video: "/heroslide/ai-agent-vs-agentic-ai.mp4", poster: "/heroslide/ai-agent-vs-agentic-ai.webp" },
  mcp: { video: "/heroslide/mcp-concepts.mp4", poster: "/heroslide/mcp-concepts.webp" },
  governance: { video: "/heroslide/agentic-ai-governance.mp4", poster: "/heroslide/agentic-ai-governance.webp" },
  repos: { video: "/heroslide/claude-code-agent-repos.mp4", poster: "/heroslide/claude-code-agent-repos.webp" },
  chatbot: { video: "/heroslide/how-ai-chatbot-is-made.mp4", poster: "/heroslide/how-ai-chatbot-is-made.webp" },
} as const;

export type Slide = { video: string; poster: string };

/**
 * Always renders the optimized still; when `play` is true, a muted looping video sits on top.
 * Only playing cards download video, so background cards and wall tiles cost a small image each.
 */
export function SlideMedia({
  slide,
  alt,
  play = false,
  sizes,
  fit = "object-contain",
  priority = false,
}: {
  slide: Slide;
  alt: string;
  play?: boolean;
  sizes: string;
  /** Tailwind object-fit / object-position classes, applied to both still and video. */
  fit?: string;
  priority?: boolean;
}) {
  return (
    <>
      <Image
        src={slide.poster}
        alt={alt}
        fill
        sizes={sizes}
        preload={priority}
        draggable={false}
        className={`pointer-events-none select-none ${fit}`}
      />
      {play && (
        <video
          key={slide.video}
          src={slide.video}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          className={`pointer-events-none absolute inset-0 size-full select-none ${fit}`}
        />
      )}
    </>
  );
}
