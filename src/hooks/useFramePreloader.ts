"use client";

import { useEffect, useRef, useState } from "react";
import { FRAME_COUNT, frameSrc } from "@/lib/scene";

type PreloadState = {
  images: HTMLImageElement[];
  loaded: number;
  progress: number; // 0..1
  isDone: boolean;
};

/**
 * Preloads the full construction-sequence frame set before the pinned
 * scroll experience is allowed to engage. Exhibition framing: the visitor
 * waits briefly at the door, then the whole diorama is ready to move
 * smoothly — no frame ever pops in mid-scrub.
 */
export function useFramePreloader(enabled: boolean): PreloadState {
  const [state, setState] = useState<PreloadState>({
    images: [],
    loaded: 0,
    progress: 0,
    isDone: false,
  });
  const startedRef = useRef(false);

  useEffect(() => {
    if (!enabled || startedRef.current) return;
    startedRef.current = true;

    let cancelled = false;
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    let loaded = 0;

    const settle = () => {
      loaded += 1;
      if (cancelled) return;
      setState({
        images,
        loaded,
        progress: loaded / FRAME_COUNT,
        isDone: loaded >= FRAME_COUNT,
      });
    };

    for (let i = 0; i < FRAME_COUNT; i += 1) {
      const img = new Image();
      img.decoding = "async";
      img.onload = settle;
      img.onerror = settle; // don't let one bad frame stall the whole preload
      img.src = frameSrc(i);
      images[i] = img;
    }

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return state;
}
