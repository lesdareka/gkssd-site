import type { Metadata } from "next";
import { Unbounded } from "next/font/google";
import "./globals.css";

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-unbounded",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ГКССД — Стратегическое Строительство и Девелопмент",
  description:
    "Мы создаем не просто здания. Мы создаем среду, которая продолжает расти вместе с людьми — от первого камня до каждого дня жизни после строительства.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={unbounded.variable}>
      <body>{children}</body>
    </html>
  );
}
