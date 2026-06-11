import { motion } from "motion/react";
import { UP } from "./data";

const FONT = "'Nunito', -apple-system, BlinkMacSystemFont, sans-serif";

export function RoadmapHeader() {
  return (
    <header className="relative overflow-hidden px-6 pt-16 pb-12 md:px-16 md:pt-24 md:pb-16">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute -top-32 right-0 h-[500px] w-[500px] rounded-full opacity-[0.07]"
          style={{ background: `radial-gradient(circle, ${UP.sunset}, transparent 70%)` }}
        />
        <div
          className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full opacity-[0.05]"
          style={{ background: `radial-gradient(circle, ${UP.pink}, transparent 70%)` }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8 flex flex-wrap items-center gap-3"
        >
          <div
            className="inline-flex items-center gap-0 rounded-full px-4 py-1.5"
            style={{ background: UP.sunset }}
          >
            <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: "0.82rem", color: UP.midnight, letterSpacing: "-0.02em" }}>
              Grow
            </span>
            <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: "0.82rem", color: UP.midnightDark, letterSpacing: "-0.02em" }}>
              Up
            </span>
          </div>
          <span
            style={{
              fontFamily: FONT,
              fontSize: "0.72rem",
              fontWeight: 500,
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: UP.textTertiary,
            }}
          >
            GrowUp · Feature Roadmap · 2025–2027
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          style={{
            fontFamily: FONT,
            fontWeight: 400,
            fontSize: "clamp(2.2rem, 5.5vw, 4.2rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.5px",
            color: UP.textPrimary,
          }}
        >
          Banking for kids,{" "}
          <br />
          <span style={{ color: UP.sunset }}>built by Up.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.24 }}
          className="mt-5"
          style={{ fontFamily: FONT, fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)", lineHeight: 1.15, color: UP.textSecondary }}
        >
          Welcome to{" "}
          <span style={{ color: UP.textPrimary, fontWeight: 900, letterSpacing: "-0.03em" }}>
            Grow
          </span>
          <span style={{ color: UP.sunset, fontWeight: 900, letterSpacing: "-0.03em" }}>
            Up
          </span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.32 }}
          className="mt-3 max-w-lg"
          style={{ fontFamily: FONT, fontSize: "1rem", lineHeight: "24px", color: UP.textSecondary }}
        >
          Making money easy for parents, and financial literacy an arcade game for kids — building healthy habits today, and Up customers for life.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 h-px w-full"
          style={{ background: UP.borderSecondary }}
        />
      </div>
    </header>
  );
}
