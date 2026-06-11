import { motion } from "motion/react";
import { phases, UP } from "./data";
import { FeatureCard } from "./FeatureCard";
import type { Feature } from "./types";

const FONT = "'Nunito', -apple-system, BlinkMacSystemFont, sans-serif";

const phaseEmoji: Record<string, string> = {
  mvp: "🚀",
  phase2: "✨",
  phase3: "🌱",
  explore: "🔭",
};

interface PhaseTimelineProps {
  onFeatureClick: (feature: Feature) => void;
}

export function PhaseTimeline({ onFeatureClick }: PhaseTimelineProps) {
  return (
    <main className="px-6 pb-24 md:px-16 max-w-5xl mx-auto">
      <div className="flex flex-col" style={{ gap: 64 }}>
        {phases.map((phase, phaseIndex) => (
          <section key={phase.id}>
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: phaseIndex * 0.05 }}
              className="flex flex-wrap items-center gap-3 mb-6"
            >
              <span style={{ fontSize: "1.25rem", lineHeight: 1 }}>{phaseEmoji[phase.id]}</span>
              <h2
                style={{
                  fontFamily: FONT,
                  fontWeight: 400,
                  fontSize: "1.625rem",
                  lineHeight: "31px",
                  letterSpacing: "-0.5px",
                  color: phase.color,
                }}
              >
                {phase.label}
              </h2>
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: "0.625rem",
                  fontWeight: 500,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: phase.color,
                  background: `${phase.color}1A`,
                  borderRadius: 9999,
                  padding: "4px 12px",
                }}
              >
                {phase.sublabel}
              </span>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-6 h-px w-full"
              style={{ background: `linear-gradient(to right, ${phase.color}50, transparent)` }}
            />

            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(272px, 1fr))" }}
            >
              {phase.features.map((feature, i) => (
                <FeatureCard
                  key={feature.id}
                  feature={feature}
                  phaseColor={phase.color}
                  index={i}
                  onClick={onFeatureClick}
                />
              ))}

              {phase.id === "mvp" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="flex flex-col items-center justify-center text-center"
                  style={{
                    background: "transparent",
                    border: `1px dashed ${UP.borderSecondary}`,
                    borderRadius: 16,
                    padding: "20px",
                    minHeight: 136,
                  }}
                >
                  <span style={{ fontSize: "1.25rem", marginBottom: 8 }}>👇</span>
                  <p style={{ fontFamily: FONT, fontSize: "0.875rem", lineHeight: "18px", color: UP.textTertiary }}>
                    More phases below
                  </p>
                </motion.div>
              )}
            </div>
          </section>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-20 text-center"
      >
        <p style={{ fontFamily: FONT, fontSize: "0.875rem", lineHeight: "18px", color: UP.textTertiary }}>
          Timelines are indicative and subject to discovery, regulatory review, and prioritisation.{" "}
          <span style={{ color: UP.sunset }}>Tap any card to explore detail.</span>
        </p>
      </motion.div>
    </main>
  );
}
