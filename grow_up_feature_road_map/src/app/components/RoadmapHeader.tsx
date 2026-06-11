import { motion } from "motion/react";
import { UP } from "./data";

const FONT = "'Nunito', -apple-system, BlinkMacSystemFont, sans-serif";

export function RoadmapHeader() {
  return (
    <header className="relative overflow-hidden px-6 pt-16 pb-12 md:px-16 md:pt-24 md:pb-16">
      {/* Subtle radial glows — Up doesn't use heavy gradients, just warm atmosphere */}
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
        {/* Up × Kids pill */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8 flex flex-wrap items-center gap-3"
        >
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5"
            style={{ background: UP.sunset }}
          >
            <span
              style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: "0.82rem",
                color: UP.midnight,
                letterSpacing: "-0.01em",
              }}
            >
              Up
            </span>
            <span style={{ color: UP.midnight, opacity: 0.5, fontSize: "0.75rem" }}>×</span>
            <span
              style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: "0.82rem",
                color: UP.midnight,
              }}
            >
              Kids
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
            Feature Roadmap · 2025–2027
          </span>
        </motion.div>

        {/* Headline */}
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

        {/* Sub-copy */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16 }}
          className="mt-5 max-w-lg"
          style={{
            fontFamily: FONT,
            fontSize: "1rem",
            lineHeight: "24px",
            color: UP.textSecondary,
          }}
        >
          Making money easy for parents, and financial literacy an arcade game for kids. Welcome to Up Kids, where we're building healthy habits today, and Up customers for life.
        </motion.p>

        {/* Divider */}
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
