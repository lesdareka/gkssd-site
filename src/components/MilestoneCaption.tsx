import { forwardRef } from "react";
import type { Milestone } from "@/lib/scene";

type MilestoneCaptionProps = {
  milestone: Milestone;
  className?: string;
};

/**
 * Exhibition-caption styling shared by both the full-motion scrub and the
 * reduced-motion fallback: heading in Unbounded, one supporting line in
 * Helvetica Neue, no icon badge, no card background — the text floats
 * directly in the scene's negative space.
 *
 * Deliberately visibility-passive: it never sets its own opacity or
 * `visibility`. Both call sites already wrap it in an element that owns
 * visibility — the positioned beat container in ScrollScene (GSAP
 * autoAlpha) and the reveal wrapper in ReducedMotionScene (CSS opacity
 * class). If this component also zeroed its own opacity by default, the
 * two would multiply (parent 1 × child 0 = 0) and the caption would never
 * appear regardless of what the parent animates to.
 *
 * Both rendering paths place this over the photographic frame sequence
 * (never over flat --color-bg), so it is set light-on-scrim rather than
 * the ink-on-white pairing DESIGN.md specifies for flat surfaces. The
 * "01/02/03" marker is the one deliberate numbered sequence the design
 * system allows: this genuinely is an ordered 4-stage progression, not a
 * decorative eyebrow repeated per-section.
 */
const MilestoneCaption = forwardRef<HTMLDivElement, MilestoneCaptionProps>(
  ({ milestone, className = "" }, ref) => {
    return (
      <div ref={ref} className={`max-w-measure ${className}`} data-milestone={milestone.id}>
        <p className="mb-3 font-body text-sm uppercase tracking-[0.08em] text-brand-light [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]">
          {String(milestone.index).padStart(2, "0")}
        </p>
        <h2 className="text-balance font-display text-milestone font-medium text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.4)]">
          {milestone.heading}
        </h2>
        <p className="mt-4 max-w-[34ch] text-pretty font-body text-base leading-relaxed text-white/85 [text-shadow:0_1px_16px_rgba(0,0,0,0.4)] md:text-lg">
          {milestone.copy}
        </p>
      </div>
    );
  },
);

MilestoneCaption.displayName = "MilestoneCaption";

export default MilestoneCaption;
