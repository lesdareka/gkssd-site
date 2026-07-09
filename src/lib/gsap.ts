"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // Slow, deliberate, exhibition-paced easing everywhere — no bounce/elastic.
  gsap.defaults({ ease: "power2.out" });
}

export { gsap, ScrollTrigger };
