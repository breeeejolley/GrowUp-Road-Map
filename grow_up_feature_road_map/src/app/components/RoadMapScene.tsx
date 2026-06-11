import { motion } from "motion/react";
import { phases, UP } from "./data";
import type { Phase } from "./types";

const W = 1280;
const H = 720;

const ROAD_PATH = `M 20,670 C 60,660 110,650 180,630 C 280,600 380,460 500,310 C 560,240 600,260 640,310 C 680,360 740,420 880,430 C 960,435 1020,380 1070,330 C 1110,290 1140,272 1160,265 C 1190,255 1230,245 1280,238`;

const STOPS = [
  { x: 180, y: 630 },
  { x: 500, y: 310 },
  { x: 880, y: 430 },
  { x: 1160, y: 265 },
];

const PHASE_EMOJI = ["🚀", "✨", "🌱", "🔭"];

function Tree({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <rect x={-3} y={0} width={6} height={22} rx={2} fill="#7A4A28" />
      <circle cx={0} cy={-14} r={18} fill="#2B7A2B" />
      <circle cx={-8} cy={-8} r={12} fill="#3D8B3D" opacity={0.85} />
      <circle cx={8} cy={-8} r={12} fill="#236023" opacity={0.85} />
    </g>
  );
}

function Cloud({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} opacity={0.92}>
      <ellipse cx={0} cy={0} rx={34} ry={21} fill="white" />
      <ellipse cx={-24} cy={7} rx={23} ry={16} fill="white" />
      <ellipse cx={24} cy={7} rx={23} ry={16} fill="white" />
      <ellipse cx={0} cy={10} rx={30} ry={15} fill="white" />
    </g>
  );
}

function Sun({ x, y }: { x: number; y: number }) {
  const rays = Array.from({ length: 10 }, (_, i) => {
    const a = (i * 36 * Math.PI) / 180;
    return { x1: x + Math.cos(a) * 42, y1: y + Math.sin(a) * 42, x2: x + Math.cos(a) * 62, y2: y + Math.sin(a) * 62 };
  });
  return (
    <g>
      {rays.map((r, i) => (
        <line key={i} {...r} stroke="#FFD95A" strokeWidth={4} strokeLinecap="round" opacity={0.65} />
      ))}
      <circle cx={x} cy={y} r={35} fill="#FFD95A" />
      <circle cx={x} cy={y} r={28} fill="#FFE884" />
    </g>
  );
}

function Bird({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g opacity={0.55}>
      <path d={`M ${x},${y} Q ${x + 9 * s},${y - 5 * s} ${x + 17 * s},${y}`} fill="none" stroke="#3A6A7A" strokeWidth={1.5} strokeLinecap="round" />
      <path d={`M ${x},${y} Q ${x - 9 * s},${y - 5 * s} ${x - 17 * s},${y}`} fill="none" stroke="#3A6A7A" strokeWidth={1.5} strokeLinecap="round" />
    </g>
  );
}

interface RoadMapSceneProps {
  selectedPhase: Phase | null;
  onPhaseSelect: (phase: Phase) => void;
}

export function RoadMapScene({ selectedPhase, onPhaseSelect }: RoadMapSceneProps) {
  const toLeft = (x: number) => `${(x / W) * 100}%`;
  const toTop = (y: number) => `${(y / H) * 100}%`;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* SVG illustrated scene */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3A7DB5" />
            <stop offset="50%" stopColor="#79B8D8" />
            <stop offset="82%" stopColor="#B8DBF0" />
            <stop offset="100%" stopColor="#FFE0A0" />
          </linearGradient>
          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5EAD62" />
            <stop offset="100%" stopColor="#3D8540" />
          </linearGradient>
          <filter id="stopShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.35" />
          </filter>
          <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Sky */}
        <rect width={W} height={H} fill="url(#sky)" />

        {/* Sun */}
        <Sun x={1180} y={95} />

        {/* Distant hills */}
        <path d="M 0,510 C 120,470 280,500 480,478 C 680,456 860,488 1060,470 C 1180,462 1240,470 1280,465 L 1280,720 L 0,720 Z" fill="#9CCB9E" opacity={0.5} />

        {/* Ground */}
        <path d="M 0,590 C 180,572 380,598 600,582 C 820,566 1040,588 1280,574 L 1280,720 L 0,720 Z" fill="url(#ground)" />

        {/* Clouds */}
        <Cloud x={110} y={78} scale={1.2} />
        <Cloud x={390} y={52} scale={0.95} />
        <Cloud x={660} y={88} scale={1.05} />
        <Cloud x={900} y={58} scale={0.82} />
        <Cloud x={1060} y={130} scale={0.7} />

        {/* Birds */}
        <Bird x={240} y={128} s={1.1} />
        <Bird x={265} y={118} />
        <Bird x={510} y={148} s={0.9} />
        <Bird x={790} y={108} s={1.05} />

        {/* Trees — lower foreground (beside lower road) */}
        <Tree x={75} y={622} scale={1.0} />
        <Tree x={125} y={648} scale={1.15} />
        <Tree x={55} y={665} scale={0.85} />
        <Tree x={268} y={638} scale={1.0} />
        <Tree x={330} y={618} scale={0.88} />
        <Tree x={500} y={660} scale={0.95} />
        <Tree x={750} y={652} scale={1.0} />
        <Tree x={1040} y={642} scale={0.9} />

        {/* Trees — mid (beside ascending road) */}
        <Tree x={395} y={548} scale={0.82} />
        <Tree x={430} y={500} scale={0.78} />
        <Tree x={455} y={390} scale={0.72} />
        <Tree x={560} y={370} scale={0.75} />

        {/* Trees — upper (beside upper road segments) */}
        <Tree x={568} y={260} scale={0.62} />
        <Tree x={646} y={372} scale={0.7} />
        <Tree x={718} y={450} scale={0.78} />
        <Tree x={795} y={498} scale={0.82} />
        <Tree x={808} y={512} scale={0.75} />
        <Tree x={964} y={490} scale={0.78} />
        <Tree x={1015} y={448} scale={0.72} />
        <Tree x={1062} y={405} scale={0.68} />
        <Tree x={1108} y={348} scale={0.65} />
        <Tree x={1148} y={308} scale={0.62} />
        <Tree x={1228} y={302} scale={0.68} />
        <Tree x={1258} y={278} scale={0.6} />

        {/* Road shadow */}
        <path d={ROAD_PATH} fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth={54} strokeLinecap="round" strokeLinejoin="round" />

        {/* Road edge outline */}
        <path d={ROAD_PATH} fill="none" stroke="#C4A450" strokeWidth={50} strokeLinecap="round" strokeLinejoin="round" />

        {/* Road surface */}
        <path d={ROAD_PATH} fill="none" stroke="#EDD07C" strokeWidth={44} strokeLinecap="round" strokeLinejoin="round" />

        {/* Road center dashes */}
        <path d={ROAD_PATH} fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="22,17" />

        {/* START label on road */}
        <g transform="translate(68, 628)">
          <rect x={-26} y={-13} width={52} height={26} rx={13} fill="#242430" opacity={0.85} />
          <text textAnchor="middle" y={5} fontSize={10} fontWeight="800" fill="white" letterSpacing="1.5" style={{ fontFamily: "Nunito, sans-serif" }}>START</text>
        </g>

        {/* Phase stop circles */}
        {STOPS.map((stop, i) => {
          const phase = phases[i];
          const isSelected = selectedPhase?.id === phase.id;
          const isDimmed = selectedPhase !== null && !isSelected;

          return (
            <g
              key={phase.id}
              onClick={() => onPhaseSelect(phase)}
              style={{ cursor: "pointer" }}
              opacity={isDimmed ? 0.45 : 1}
            >
              {/* Selection glow */}
              {isSelected && (
                <circle cx={stop.x} cy={stop.y} r={44} fill={phase.color} opacity={0.28} filter="url(#glow)" />
              )}
              {/* White backing ring */}
              <circle cx={stop.x} cy={stop.y} r={30} fill="white" filter="url(#stopShadow)" />
              {/* Colored fill */}
              <circle cx={stop.x} cy={stop.y} r={26} fill={phase.color} />
              {/* Emoji */}
              <text x={stop.x} y={stop.y + 9} textAnchor="middle" fontSize={22} style={{ userSelect: "none" }}>
                {PHASE_EMOJI[i]}
              </text>
              {/* Feature count badge */}
              <circle cx={stop.x + 20} cy={stop.y - 20} r={11} fill="#242430" />
              <text x={stop.x + 20} y={stop.y - 16} textAnchor="middle" fontSize={10} fontWeight="700" fill="white" style={{ fontFamily: "Nunito, sans-serif" }}>
                {phase.features.length}
              </text>
            </g>
          );
        })}
      </svg>

      {/* HTML overlay: phase labels as road signs */}
      {STOPS.map((stop, i) => {
        const phase = phases[i];
        const isSelected = selectedPhase?.id === phase.id;
        const isDimmed = selectedPhase !== null && !isSelected;

        // Place sign above each stop
        const signY = stop.y - 56;

        return (
          <div
            key={phase.id}
            onClick={() => onPhaseSelect(phase)}
            style={{
              position: "absolute",
              left: toLeft(stop.x),
              top: toTop(signY),
              transform: "translate(-50%, -100%)",
              opacity: isDimmed ? 0.35 : 1,
              transition: "opacity 0.22s",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Sign board */}
            <motion.div
              animate={{ scale: isSelected ? 1.08 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              style={{
                background: isSelected ? phase.color : "#1A1A22",
                border: `2px solid ${phase.color}`,
                borderRadius: 8,
                padding: "5px 12px",
                boxShadow: isSelected ? `0 0 20px ${phase.color}70` : "0 3px 10px rgba(0,0,0,0.4)",
                transition: "background 0.2s, box-shadow 0.2s",
                minWidth: 80,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 800,
                  fontSize: "0.72rem",
                  color: isSelected ? "#1A1A22" : phase.color,
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                }}
              >
                {phase.label}
              </div>
              <div
                style={{
                  fontFamily: "Nunito, sans-serif",
                  fontSize: "0.58rem",
                  fontWeight: 600,
                  color: isSelected ? "rgba(26,26,34,0.65)" : UP.textTertiary,
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                }}
              >
                {phase.sublabel}
              </div>
            </motion.div>
            {/* Post */}
            <div
              style={{
                width: 2,
                height: 18,
                background: "#1A1A22",
                opacity: 0.7,
                flexShrink: 0,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
