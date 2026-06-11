import { motion } from "motion/react";
import { X } from "lucide-react";
import { UP } from "./data";
import type { Phase } from "./types";

const PHASE_EMOJI = ["🚀", "✨", "🌱", "🔭"];
const PHASE_IDS = ["mvp", "phase2", "phase3", "explore"];

interface FeaturePanelProps {
  phase: Phase;
  onClose: () => void;
}

export function FeaturePanel({ phase, onClose }: FeaturePanelProps) {
  const emojiIndex = PHASE_IDS.indexOf(phase.id);

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 380, damping: 36 }}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "40%",
        background: UP.midnightDark,
        borderTop: `2px solid ${phase.color}`,
        borderRadius: "16px 16px 0 0",
        zIndex: 30,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${UP.borderSecondary}`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9999,
              background: `${phase.color}22`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
              flexShrink: 0,
            }}
          >
            {PHASE_EMOJI[emojiIndex]}
          </div>
          <div>
            <div
              style={{
                fontFamily: "Nunito, sans-serif",
                fontWeight: 800,
                fontSize: "0.95rem",
                color: UP.textPrimary,
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              {phase.label}
            </div>
            <div
              style={{
                fontFamily: "Nunito, sans-serif",
                fontSize: "0.62rem",
                fontWeight: 700,
                color: phase.color,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {phase.sublabel} · {phase.features.length} features
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: 28,
            height: 28,
            borderRadius: 9999,
            background: UP.cardSurface,
            border: `1px solid ${UP.borderSecondary}`,
            color: UP.textTertiary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
          aria-label="Close"
        >
          <X size={12} />
        </button>
      </div>

      {/* Feature cards — horizontal scroll */}
      <div
        style={{
          display: "flex",
          gap: 10,
          padding: "12px 16px",
          overflowX: "auto",
          overflowY: "hidden",
          flex: 1,
          alignItems: "stretch",
          scrollbarWidth: "none",
        }}
      >
        {phase.features.map((feature, i) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.28 }}
            style={{
              flexShrink: 0,
              width: 200,
              background: UP.cardSurface,
              border: `1px solid ${UP.borderSecondary}`,
              borderRadius: 12,
              padding: "12px 14px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ fontSize: "1.4rem", marginBottom: 8, lineHeight: 1 }}>
              {feature.icon}
            </div>
            <div
              style={{
                fontFamily: "Nunito, sans-serif",
                fontWeight: 800,
                fontSize: "0.8rem",
                color: UP.textPrimary,
                letterSpacing: "-0.01em",
                lineHeight: 1.3,
                marginBottom: 6,
              }}
            >
              {feature.title}
            </div>
            <div
              style={{
                fontFamily: "Nunito, sans-serif",
                fontSize: "0.7rem",
                color: UP.textSecondary,
                lineHeight: 1.5,
                flex: 1,
              }}
            >
              {feature.description}
            </div>
            {feature.tag && (
              <div
                style={{
                  marginTop: 10,
                  display: "inline-block",
                  alignSelf: "flex-start",
                  borderRadius: 9999,
                  padding: "2px 8px",
                  background: `${phase.color}1A`,
                  color: phase.color,
                  fontFamily: "Nunito, sans-serif",
                  fontSize: "0.58rem",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {feature.tag}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
