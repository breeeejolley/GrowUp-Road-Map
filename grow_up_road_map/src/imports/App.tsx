import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { RoadmapHeader } from "./components/RoadmapHeader";
import { PhaseTimeline } from "./components/PhaseTimeline";
import { FeatureModal } from "./components/FeatureModal";
import type { Feature } from "./components/types";

export default function App() {
  const [activeFeature, setActiveFeature] = useState<Feature | null>(null);

  return (
    <div
      className="min-h-screen w-full"
      style={{ fontFamily: "'Nunito', -apple-system, BlinkMacSystemFont, sans-serif", background: "var(--background)" }}
    >
      <RoadmapHeader />
      <PhaseTimeline onFeatureClick={setActiveFeature} />
      <AnimatePresence>
        {activeFeature && (
          <FeatureModal feature={activeFeature} onClose={() => setActiveFeature(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
