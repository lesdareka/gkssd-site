"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Minimal IntersectionObserver hook for the reduced-motion path.
 *
 * `once: true` (default) reveals the first time the element crosses the
 * threshold and then stops observing — used for the milestone captions,
 * where "same content, same sequence" only requires a one-way reveal.
 *
 * `once: false` keeps reporting the live intersection state in both
 * directions — used for the hero/nav threshold, where the nav needs to
 * know whether the visitor is currently over the hero or has scrolled
 * past it, not just whether they once did.
 */
export function useInView<T extends HTMLElement>(threshold = 0.35, once = true) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry) return;

        if (once) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        } else {
          setInView(entry.isIntersecting);
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once]);

  return { ref, inView };
}
