import { motion } from "motion/react";
import { X } from "lucide-react";
import { phases, UP } from "./data";
import type { Feature } from "./types";

const FONT = "'Nunito', -apple-system, BlinkMacSystemFont, sans-serif";

interface FeatureModalProps {
  feature: Feature;
  onClose: () => void;
}

function getPhase(featureId: string) {
  return phases.find((p) => p.features.some((f) => f.id === featureId));
}

export function FeatureModal({ feature, onClose }: FeatureModalProps) {
  const phase = getPhase(feature.id);
  const color = phase?.color ?? UP.sunset;
  const phaseName = phase ? `${phase.label} · ${phase.sublabel}` : "";

  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40"
        style={{ background: "rgba(26,26,34,0.85)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      />

      {/* Sheet — slides up from bottom on mobile, centered on desktop */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
        <motion.div
          key="sheet"
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 48 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="pointer-events-auto w-full md:max-w-lg overflow-hidden"
          style={{
            background: UP.midnightDark,
            borderRadius: "16px 16px 0 0",
            border: `1px solid ${UP.borderSecondary}`,
            borderBottom: "none",
            maxHeight: "88vh",
            overflowY: "auto",
          }}
        >
          {/* Drag indicator */}
          <div className="flex justify-center pt-3 pb-1 md:hidden">
            <div
              className="rounded-full"
              style={{ width: 36, height: 4, background: UP.borderSecondary }}
            />
          </div>

          {/* Top colour accent */}
          <div className="h-0.5 mx-6 rounded-full mt-3" style={{ background: color }} />

          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className="flex-shrink-0 flex items-center justify-center text-2xl rounded-full"
                  style={{ width: 52, height: 52, background: `${color}1A` }}
                >
                  {feature.icon}
                </div>

                <div>
                  {/* Overline */}
                  <p
                    style={{
                      fontFamily: FONT,
                      fontSize: "0.625rem",
                      fontWeight: 500,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      color,
                      marginBottom: 4,
                    }}
                  >
                    {phaseName}
                    {feature.tag ? ` · ${feature.tag}` : ""}
                  </p>
                  {/* Title */}
                  <h2
                    style={{
                      fontFamily: FONT,
                      fontWeight: 400,
                      fontSize: "1.375rem",
                      lineHeight: "28px",
                      letterSpacing: "-0.5px",
                      color: UP.textPrimary,
                    }}
                  >
                    {feature.title}
                  </h2>
                </div>
              </div>

              {/* Close */}
              <button
                onClick={onClose}
                className="flex-shrink-0 rounded-full flex items-center justify-center transition-colors"
                style={{
                  width: 32,
                  height: 32,
                  background: UP.cardSurface,
                  border: `1px solid ${UP.borderSecondary}`,
                  color: UP.textTertiary,
                  marginTop: 2,
                }}
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 pb-10">
            {/* Summary */}
            <p
              style={{
                fontFamily: FONT,
                fontSize: "1rem",
                lineHeight: "24px",
                color: UP.textSecondary,
                marginBottom: 20,
              }}
            >
              {feature.description}
            </p>

            {/* Hairline */}
            <div
              className="mb-5"
              style={{ height: 1, background: UP.borderSecondary }}
            />

            {/* Overline label */}
            <p
              style={{
                fontFamily: FONT,
                fontSize: "0.625rem",
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: UP.textTertiary,
                marginBottom: 12,
              }}
            >
              Feature detail
            </p>

            {/* Detail body */}
            <p
              style={{
                fontFamily: FONT,
                fontSize: "0.875rem",
                lineHeight: "18px",
                color: UP.textSecondary,
                whiteSpace: "pre-line",
              }}
            >
              {feature.detail}
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
