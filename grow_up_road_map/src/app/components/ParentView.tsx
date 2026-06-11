import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { RoadmapHeader } from './parent/RoadmapHeader';
import { PhaseTimeline } from './parent/PhaseTimeline';
import { FeatureModal } from './parent/FeatureModal';
import type { Feature } from './parent/types';

export function ParentView() {
  const [activeFeature, setActiveFeature] = useState<Feature | null>(null);

  return (
    <div
      style={{
        fontFamily: "'Nunito', -apple-system, BlinkMacSystemFont, sans-serif",
        width: '100%',
        paddingTop: 60, // clears the fixed toggle button
      }}
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
