"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import CanvasScrubber, { type CanvasScrubberHandle } from "./CanvasScrubber";
import MilestoneCaption from "./MilestoneCaption";
import {
  BRAND_MESSAGE,
  CLOSING,
  INTRO_MOTION,
  MILESTONES,
  NAV_SOLID_THRESHOLD,
  PIN_SCROLL_DISTANCE,
  SCRUB_MOTION,
} from "@/lib/scene";

type ScrollSceneProps = {
  images: HTMLImageElement[];
  onNavSolidChange: (solid: boolean) => void;
};

/**
 * The single continuous world. One `ScrollTrigger` pins this viewport for
 * `PIN_SCROLL_DISTANCE` px of scroll and drives one master timeline off
 * that scroll progress (`scrub: 1`) — the camera (this viewport) never
 * moves or cuts; only the frame drawn to canvas and the caption opacity
 * change. That pin distance *is* the "8,000–12,000px tall illustration"
 * the brief describes, implemented the way scroll-driven dioramas
 * actually ship (Apple product pages, BIG/Space10 story pages) rather
 * than a literal 9,000px-tall DOM subtree — same visitor-facing result,
 * far better for 60fps.
 */
export default function ScrollScene({ images, onNavSolidChange }: ScrollSceneProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrubberRef = useRef<CanvasScrubberHandle>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const milestoneRefs = useRef<Array<HTMLDivElement | null>>([]);
  const closingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || images.length === 0) return;

    const ctx = gsap.context(() => {
      const frameProxy = { f: 0 };

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${PIN_SCROLL_DISTANCE}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => onNavSolidChange(self.progress > NAV_SOLID_THRESHOLD),
        },
      });

      // brand intro -----------------------------------------------------
      if (introRef.current) {
        gsap.set(introRef.current, { autoAlpha: 0, y: 16 });
        master
          .to(
            introRef.current,
            { autoAlpha: 1, y: 0, duration: INTRO_MOTION.fadeInEnd - INTRO_MOTION.fadeInStart },
            INTRO_MOTION.fadeInStart,
          )
          .to(
            introRef.current,
            { autoAlpha: 0, y: -16, duration: INTRO_MOTION.fadeOutEnd - INTRO_MOTION.fadeOutStart },
            INTRO_MOTION.fadeOutStart,
          );
      }

      // the diorama itself ------------------------------------------------
      master.to(
        frameProxy,
        {
          f: images.length - 1,
          duration: SCRUB_MOTION.end - SCRUB_MOTION.start,
          ease: "none",
          onUpdate: () => scrubberRef.current?.drawFrame(Math.round(frameProxy.f)),
        },
        SCRUB_MOTION.start,
      );

      // milestone captions --------------------------------------------
      MILESTONES.forEach((milestone, i) => {
        const el = milestoneRefs.current[i];
        if (!el) return;
        gsap.set(el, { autoAlpha: 0, y: 16 });
        master.to(
          el,
          { autoAlpha: 1, y: 0, duration: milestone.motion.fadeInEnd - milestone.motion.fadeInStart },
          milestone.motion.fadeInStart,
        );
        if (milestone.motion.fadeOutStart !== null && milestone.motion.fadeOutEnd !== null) {
          master.to(
            el,
            { autoAlpha: 0, y: -16, duration: milestone.motion.fadeOutEnd - milestone.motion.fadeOutStart },
            milestone.motion.fadeOutStart,
          );
        }
      });

      // closing statement + CTA, nested in the final milestone beat -----
      if (closingRef.current) {
        gsap.set(closingRef.current, { autoAlpha: 0, y: 16 });
        master.to(
          closingRef.current,
          { autoAlpha: 1, y: 0, duration: CLOSING.motion.fadeInEnd - CLOSING.motion.fadeInStart },
          CLOSING.motion.fadeInStart,
        );
      }

      // pad to a clean 0–100 progress scale: the remainder simply holds
      // on the completed frame + closing CTA while scroll finishes out.
      const usedDuration = master.duration();
      if (usedDuration < 100) {
        master.to({}, { duration: 100 - usedDuration }, usedDuration);
      }

      scrubberRef.current?.drawFrame(0);
    }, sectionRef);

    return () => ctx.revert();
  }, [images, onNavSolidChange]);

  // Recalculate pin/pixel math after layout settles and once the display
  // webfont has actually swapped in (Unbounded loads with font-display:
  // swap, and a late metric shift would otherwise leave the pin distance
  // measured against the fallback font's line height).
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    let cancelled = false;
    if ("fonts" in document) {
      document.fonts.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
    }
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [images]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative h-screen w-full overflow-hidden bg-ink"
      aria-label="Архитектурная история проекта ГКССД: от участка до готовой среды"
    >
      <CanvasScrubber ref={scrubberRef} images={images} className="absolute inset-0 h-full w-full" />

      {/* legibility scrims — concentrated where captions and nav sit, never flatten the imagery */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/35 to-transparent" />

      <div
        ref={introRef}
        className="invisible absolute inset-x-0 top-0 flex h-full flex-col items-start justify-center px-6 opacity-0 md:px-16 lg:px-24"
      >
        <p className="max-w-2xl text-balance font-display text-display font-medium text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.4)]">
          {BRAND_MESSAGE.line1}
        </p>
        <p className="mt-6 max-w-xl text-pretty font-body text-lg leading-relaxed text-white/85 [text-shadow:0_1px_18px_rgba(0,0,0,0.4)] md:text-xl">
          {BRAND_MESSAGE.line2}
        </p>
      </div>

      {MILESTONES.map((milestone, i) => (
        <div
          key={milestone.id}
          ref={(el) => {
            milestoneRefs.current[i] = el;
          }}
          className="invisible absolute inset-x-0 top-0 flex h-full flex-col items-start justify-center px-6 opacity-0 md:px-16 lg:px-24"
        >
          <MilestoneCaption milestone={milestone} />
          {milestone.id === "living-environment" && (
            <div ref={closingRef} className="invisible mt-10 opacity-0">
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
        </div>
      ))}
    </section>
  );
}
