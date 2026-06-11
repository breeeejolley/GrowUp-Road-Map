import { motion } from "motion/react";
import { UP } from "./data";
import type { Feature } from "./types";

const FONT = "'Nunito', -apple-system, BlinkMacSystemFont, sans-serif";

interface FeatureCardProps {
  feature: Feature;
  phaseColor: string;
  index: number;
  onClick: (feature: Feature) => void;
}

export function FeatureCard({ feature, phaseColor, index, onClick }: FeatureCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-32px" }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(feature)}
      className="group w-full text-left relative overflow-hidden"
      style={{
        background: UP.cardSurface,
        border: `1px solid ${UP.borderSecondary}`,
        borderRadius: 16,
        padding: "20px",
        cursor: "pointer",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${phaseColor}50`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = UP.borderSecondary;
      }}
    >
      {/* Top row: icon + tag */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <div
          className="rounded-full flex items-center justify-center text-lg flex-shrink-0"
          style={{
            width: 40,
            height: 40,
            background: `${phaseColor}1A`,
          }}
        >
          {feature.icon}
        </div>
        {feature.tag && (
          <span
            style={{
              fontFamily: FONT,
              fontSize: "0.625rem",
              fontWeight: 500,
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: phaseColor,
              background: `${phaseColor}1A`,
              borderRadius: 9999,
              padding: "3px 10px",
            }}
          >
            {feature.tag}
          </span>
        )}
      </div>

      {/* Title */}
      <p
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: "0.9375rem",
          lineHeight: "20px",
          letterSpacing: "-0.25px",
          color: UP.textPrimary,
          marginBottom: 6,
        }}
      >
        {feature.title}
      </p>

      {/* Description */}
      <p
        style={{
          fontFamily: FONT,
          fontSize: "0.875rem",
          lineHeight: "18px",
          color: UP.textSecondary,
        }}
      >
        {feature.description}
      </p>

      {/* Tap hint — only visible on hover */}
      <div
        className="mt-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          fontFamily: FONT,
          fontSize: "0.75rem",
          fontWeight: 700,
          color: phaseColor,
        }}
      >
        <span>See detail</span>
        <span>→</span>
      </div>
    </motion.button>
  );
}
