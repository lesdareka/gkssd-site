"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export type CanvasScrubberHandle = {
  drawFrame: (index: number) => void;
};

type CanvasScrubberProps = {
  images: HTMLImageElement[];
  className?: string;
};

/**
 * Draws the preloaded frame sequence to a devicePixelRatio-aware canvas,
 * covering its container the way `object-fit: cover` would for an <img>.
 * Kept as a plain canvas (not a stack of <img> elements) so redraws are a
 * single cheap `drawImage` call driven straight from the GSAP scrub —
 * no layout thrash, no decode-on-swap jank.
 */
const CanvasScrubber = forwardRef<CanvasScrubberHandle, CanvasScrubberProps>(
  ({ images, className = "" }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const currentIndexRef = useRef(0);
    const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });

    const draw = (index: number) => {
      const canvas = canvasRef.current;
      const img = images[index];
      if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { width, height, dpr } = sizeRef.current;
      if (width === 0 || height === 0) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
      const drawWidth = img.naturalWidth * scale;
      const drawHeight = img.naturalHeight * scale;
      const dx = (width - drawWidth) / 2;
      const dy = (height - drawHeight) / 2;

      ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
      currentIndexRef.current = index;
    };

    useImperativeHandle(ref, () => ({ drawFrame: draw }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        sizeRef.current = { width: rect.width, height: rect.height, dpr };
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
        draw(currentIndexRef.current);
      };

      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(canvas);
      return () => observer.disconnect();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [images]);

    return <canvas ref={canvasRef} className={className} />;
  },
);

CanvasScrubber.displayName = "CanvasScrubber";

export default CanvasScrubber;
