// Single source of truth for the scene's content and timing.
// Both the full-motion (ScrollScene) and prefers-reduced-motion
// (ReducedMotionScene) rendering paths read from this file, so the
// narrative and copy can never drift between the two experiences —
// only the motion technique differs.

export const FRAME_COUNT = 133;
export const FRAME_BASE_PATH = "/scene";

export function frameSrc(index: number): string {
  // frames are 1-indexed on disk: frame-0001.webp .. frame-0133.webp
  const n = Math.min(Math.max(index, 0), FRAME_COUNT - 1) + 1;
  return `${FRAME_BASE_PATH}/frame-${String(n).padStart(4, "0")}.webp`;
}

export const BRAND_MESSAGE = {
  line1: "Мы создаем не просто здания.",
  line2:
    "Мы создаем среду, которая продолжает расти вместе с людьми — от первого камня до каждого дня жизни после строительства.",
};

export type Milestone = {
  id: "site-evaluation" | "virtual-model" | "construction" | "living-environment";
  index: number; // display order, 1-based
  heading: string;
  copy: string;
  /** representative frame (0-indexed) used as the static hero image for this
   * beat in the reduced-motion flow, and as a sanity anchor when tuning the
   * full-motion scrub windows below. */
  representativeFrame: number;
  /** progress window (0-100 scale) within the master ScrollScene timeline */
  motion: {
    fadeInStart: number;
    fadeInEnd: number;
    fadeOutStart: number | null; // null = stays visible to the end
    fadeOutEnd: number | null;
  };
};

export const MILESTONES: Milestone[] = [
  {
    id: "site-evaluation",
    index: 1,
    heading: "Оценка участка",
    copy: "Каждый проект начинается с земли — рельефа, воды, света.",
    representativeFrame: 14,
    motion: { fadeInStart: 9, fadeInEnd: 11.5, fadeOutStart: 17, fadeOutEnd: 19.5 },
  },
  {
    id: "virtual-model",
    index: 2,
    heading: "Виртуальная модель",
    copy: "Прежде чем поднять первую колонну, мы выстраиваем её в цифровом пространстве.",
    representativeFrame: 40,
    motion: { fadeInStart: 29, fadeInEnd: 31.5, fadeOutStart: 39, fadeOutEnd: 41.5 },
  },
  {
    id: "construction",
    index: 3,
    heading: "Строительство",
    copy: "Этаж за этажом здание обретает форму.",
    representativeFrame: 88,
    motion: { fadeInStart: 46, fadeInEnd: 48.5, fadeOutStart: 73, fadeOutEnd: 75.5 },
  },
  {
    id: "living-environment",
    index: 4,
    heading: "Готовая среда",
    copy: "Мост, парк, соседи — жизнь начинается там, где заканчивается стройка.",
    representativeFrame: 132,
    motion: { fadeInStart: 82, fadeInEnd: 84.5, fadeOutStart: null, fadeOutEnd: null },
  },
];

export const CLOSING = {
  statement: "Ваш участок может стать следующей главой.",
  ctaLabel: "Оставить заявку",
  motion: { fadeInStart: 90, fadeInEnd: 93 },
};

export const INTRO_MOTION = {
  fadeInStart: 0,
  fadeInEnd: 3.5,
  fadeOutStart: 6.5,
  fadeOutEnd: 8.5,
};

export const SCRUB_MOTION = {
  start: 8.5,
  end: 95,
};

export const NAV_SOLID_THRESHOLD = 0.07; // fraction of total pin progress (0..1)

export const PIN_SCROLL_DISTANCE = 9200; // px — the "8000–12000px tall illustration" as scrub distance

export const NAV_LINKS = [
  { label: "Проекты", href: "#" },
  { label: "Философия", href: "#" },
  { label: "Компания", href: "#" },
  { label: "Контакты", href: "#" },
];

export const NAV_CTA_LABEL = "Оставить заявку";
