"use client";

import { useEffect } from "react";
import { useInView } from "@/hooks/useInView";
import MilestoneCaption from "./MilestoneCaption";
import { BRAND_MESSAGE, CLOSING, MILESTONES, frameSrc } from "@/lib/scene";

type RevealProps = {
  frame: number;
  eager?: boolean;
  children: React.ReactNode;
};

/**
 * One full-height static beat: the frame that best represents this stage
 * as a still image, with the caption crossfading to opacity-100 the first
 * time it enters the viewport. No parallax, no growth, no scroll-linked
 * transform — `prefers-reduced-motion` visitors get the identical
 * narrative and copy as the full-motion path, opacity only.
 */
function RevealBeat({ frame, eager, children }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-ink px-6 md:px-16 lg:px-24"
    >
      <img
        src={frameSrc(frame)}
        alt=""
        aria-hidden
        loading={eager ? "eager" : "lazy"}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
      <div className={`relative transition-opacity duration-700 ease-out-quart ${inView ? "opacity-100" : "opacity-0"}`}>
        {children}
      </div>
    </div>
  );
}

type ReducedMotionSceneProps = {
  onNavSolidChange: (solid: boolean) => void;
};

export default function ReducedMotionScene({ onNavSolidChange }: ReducedMotionSceneProps) {
  // `once: false` — unlike the milestone captions, this must keep tracking
  // the hero's live visibility so the nav can flip back to transparent if
  // the visitor scrolls back up to the top.
  const { ref: heroRef, inView: heroInView } = useInView<HTMLDivElement>(0.5, false);

  // Nav goes solid as soon as the visitor scrolls past the brand-intro beat.
  useEffect(() => {
    onNavSolidChange(!heroInView);
  }, [heroInView, onNavSolidChange]);

  return (
    <div id="top">
      <div ref={heroRef} className="relative flex min-h-screen w-full items-center overflow-hidden bg-ink px-6 md:px-16 lg:px-24">
        <img src={frameSrc(0)} alt="" aria-hidden loading="eager" className="absolute inset-0 h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/35 to-transparent" />
        <div className="relative">
          <p className="max-w-2xl text-balance font-display text-display font-medium text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.4)]">
            {BRAND_MESSAGE.line1}
          </p>
          <p className="mt-6 max-w-xl text-pretty font-body text-lg leading-relaxed text-white/85 [text-shadow:0_1px_18px_rgba(0,0,0,0.4)] md:text-xl">
            {BRAND_MESSAGE.line2}
          </p>
        </div>
      </div>

      {MILESTONES.map((milestone) => (
        <RevealBeat key={milestone.id} frame={milestone.representativeFrame}>
          <MilestoneCaption milestone={milestone} />
          {milestone.id === "living-environment" && (
            <div className="mt-10">
              <p className="max-w-[30ch] text-pretty font-body text-base text-white/85 [text-shadow:0_1px_16px_rgba(0,0,0,0.4)] md:text-lg">
                {CLOSING.statement}
              </p>
              <a
                href="mailto:info@gkssd.ru"
                className="mt-5 inline-block rounded-full bg-brand px-7 py-3.5 font-body text-sm text-white transition-colors duration-300 ease-out-quart hover:bg-brand-dark"
              >
                {CLOSING.ctaLabel}
              </a>
            </div>
          )}
        </RevealBeat>
      ))}
    </div>
  );
}
