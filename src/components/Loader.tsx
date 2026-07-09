"use client";

type LoaderProps = {
  progress: number; // 0..1
  visible: boolean;
};

/**
 * Pre-scene loading screen. Locks the visitor at the threshold of the
 * exhibition until the full frame sequence is ready, so the very first
 * scroll never stutters or pops a frame in late.
 */
export default function Loader({ progress, visible }: LoaderProps) {
  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-0 z-live flex flex-col items-center justify-center gap-6 bg-bg transition-opacity duration-700 ease-out-quart ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <img src="/logo-nav.svg" alt="" className="h-8 w-auto" aria-hidden />
      <div className="h-px w-40 overflow-hidden bg-line">
        <div
          className="h-full bg-brand transition-[width] duration-200 ease-out"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
      <p className="font-body text-xs uppercase tracking-[0.08em] text-ink-muted">
        Загрузка{" "}
        <span className="tabular-nums text-ink-muted/80">{Math.round(progress * 100)}%</span>
      </p>
    </div>
  );
}
