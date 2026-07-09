"use client";

import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useFramePreloader } from "@/hooks/useFramePreloader";
import Nav from "./Nav";
import Loader from "./Loader";
import Footer from "./Footer";
import ScrollScene from "./ScrollScene";
import ReducedMotionScene from "./ReducedMotionScene";

/**
 * Top-level orchestrator. Decides, once on the client, whether the
 * visitor gets the pinned canvas-scrub experience or the static
 * crossfade fallback — then owns the one piece of state (`navSolid`)
 * both paths report into so the nav behaves identically either way.
 */
export default function SceneExperience() {
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useReducedMotion();
  const [navSolid, setNavSolid] = useState(false);

  useEffect(() => setMounted(true), []);

  const preload = useFramePreloader(mounted && !reducedMotion);
  const handleNavSolidChange = useCallback((solid: boolean) => setNavSolid(solid), []);

  // Lock scroll while the full-motion scene is still loading — the pinned
  // section doesn't exist in the DOM yet, so any scroll now would land at
  // the wrong absolute position once ~9,000px of content mounts above the
  // footer a moment later.
  const isLoadingFullMotion = !mounted || (!reducedMotion && !preload.isDone);
  useEffect(() => {
    document.documentElement.style.overflow = isLoadingFullMotion ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isLoadingFullMotion]);

  // Before we know the client's motion preference, hold at the loading
  // screen rather than guessing — avoids briefly kicking off a 133-frame
  // preload for a reduced-motion visitor.
  if (!mounted) {
    return <Loader progress={0} visible />;
  }

  if (reducedMotion) {
    return (
      <>
        <Nav solid={navSolid} />
        <ReducedMotionScene onNavSolidChange={handleNavSolidChange} />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Loader progress={preload.progress} visible={!preload.isDone} />
      <Nav solid={navSolid} />
      {preload.isDone && <ScrollScene images={preload.images} onNavSolidChange={handleNavSolidChange} />}
      <Footer />
    </>
  );
}
