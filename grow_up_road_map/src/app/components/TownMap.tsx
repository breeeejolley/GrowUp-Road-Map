import { useState, useRef, useEffect, useCallback } from 'react';
import type { Stop } from '../App';
import upLogoImg from '../../imports/UP_CORE_LOGO-1.png';

// ─── Up Brand Palette ──────────────────────────────────────────────────────
const UP = {
  midnight:     '#242430',
  midnight_d:   '#1A1A22',
  sunset:       '#FF7A64',
  sunset_d:     '#C04830',
  sunset_l:     '#FF9A80',
  sunrise:      '#FFF06B',
  sunrise_d:    '#C4A800',
  pink:         '#FF8BB5',
  pink_d:       '#C4527A',
  pink_l:       '#FFD0E0',
  blue:         '#4E6280',
  blue_d:       '#2A3A52',
  blue_l:       '#6A82A0',
  green:        '#305555',
  green_d:      '#1A3030',
  green_l:      '#508080',
  sometimes:    '#3FA8F4',
  sometimes_d:  '#1A5A90',
  sometimes_l:  '#90CCFF',
  success:      '#00BC83',
};

const P = 8; // base pixel unit (8 SVG units per "pixel")

// ─── Route geometry ────────────────────────────────────────────────────────
// Path: M 120,640 H 920 V 200 H 120 V 440 H 560
// Visits: Start(120,640)→School(920,640)→Library(920,200)→Groceries(480,200)→Clothing(120,440)→Bank(560,440)

const ROUTE_CORNERS = [
  { x: 120, y: 640, d: 0 },
  { x: 920, y: 640, d: 800 },
  { x: 920, y: 200, d: 800 + 440 },   // d=1240
  { x: 120, y: 200, d: 1240 + 800 },  // d=2040, corner — no stop
  { x: 120, y: 440, d: 2040 + 240 },  // d=2280
  { x: 560, y: 440, d: 2280 + 440 },  // d=2720
];
const TOTAL_D = 2720;

// Groceries at x=480 on segment d=1240→d=2040: from x=920 going left 440 → d=1240+440=1680
const STOP_DISTS: Record<string, number> = {
  start:     0,
  school:    800,
  library:   1240,
  groceries: 1680,
  clothing:  2280,
  bank:      2720,
};
const STOP_ORDER = ['start','school','library','groceries','clothing','bank'];

function getPosAtDist(d: number): { x: number; y: number } {
  d = Math.max(0, Math.min(d, TOTAL_D));
  for (let i = 0; i < ROUTE_CORNERS.length - 1; i++) {
    const a = ROUTE_CORNERS[i], b = ROUTE_CORNERS[i + 1];
    if (d >= a.d && d <= b.d) {
      const t = (b.d === a.d) ? 0 : (d - a.d) / (b.d - a.d);
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
  }
  const last = ROUTE_CORNERS[ROUTE_CORNERS.length - 1];
  return { x: last.x, y: last.y };
}

function getDirectionAtDist(d: number, travelDir: 1 | -1 = 1): 'right' | 'left' | 'up' | 'down' {
  d = Math.max(0, Math.min(d, TOTAL_D - 1));
  for (let i = 0; i < ROUTE_CORNERS.length - 1; i++) {
    const a = ROUTE_CORNERS[i], b = ROUTE_CORNERS[i + 1];
    if (d >= a.d && d < b.d) {
      const forward: 'right'|'left'|'up'|'down' =
        b.x > a.x ? 'right' : b.x < a.x ? 'left' : b.y > a.y ? 'down' : 'up';
      if (travelDir === 1) return forward;
      const rev: Record<string,'right'|'left'|'up'|'down'> = { right:'left', left:'right', up:'down', down:'up' };
      return rev[forward];
    }
  }
  return 'right';
}

const DIR_TO_DEG: Record<string, number> = { right: 90, down: 180, left: -90, up: 0 };

// ─── Pixel-art building helpers ────────────────────────────────────────────

function Outline({ x, y, w, h, t = 3 }: { x:number;y:number;w:number;h:number;t?:number }) {
  return <rect x={x-t} y={y-t} width={w+t*2} height={h+t*2} fill={UP.midnight_d} />;
}

// ─── 1. START GATE ─────────────────────────────────────────────────────────
function StartGate({ cx, cy }: { cx:number; cy:number }) {
  const W = 14*P, H = 10*P;
  const bx = cx-W/2, by = cy-H;
  return (
    <g shapeRendering="crispEdges">
      {/* Outline */}
      <rect x={bx-3} y={by-3} width={W+6} height={H+6} fill={UP.midnight_d} />

      {/* Left pillar — sunrise yellow with shadow */}
      <rect x={bx}      y={by}    width={2*P} height={H}    fill={UP.sunrise}  />
      <rect x={bx+P}    y={by}    width={P}   height={H}    fill={UP.sunrise_d}/>

      {/* Right pillar */}
      <rect x={bx+12*P} y={by}    width={2*P} height={H}    fill={UP.sunrise}  />
      <rect x={bx+13*P} y={by}    width={P}   height={H}    fill={UP.sunrise_d}/>

      {/* Top banner — solid sunrise, no black */}
      <rect x={bx}      y={by}    width={W}   height={3*P}   fill={UP.sunrise}  />
      <rect x={bx}      y={by}    width={W}   height={P/2}   fill='#FFFF9A'     />
      <rect x={bx}      y={by+2.5*P} width={W} height={P/2} fill={UP.sunrise_d}/>

      {/* Sunset orange accent stripes on banner (no black) */}
      {[0,1,2,3,4,5,6].map(i=>(
        <rect key={`s${i}`} x={bx+2*P+i*P*1.5} y={by+P/2} width={P/2} height={P*1.5} fill={i%2===0 ? UP.sunset : UP.sunrise_d} opacity={0.55} />
      ))}

      {/* Arch void */}
      <rect x={bx+2*P}  y={by+3*P} width={10*P} height={6*P} fill="#172016"    />
      <rect x={bx+2*P}  y={by+3*P} width={10*P} height={P/2} fill={UP.sunrise_d}/>

      {/* Base plate */}
      <rect x={bx}      y={by+9*P} width={W}   height={P}    fill={UP.sunrise}  />
      <rect x={bx+2*P}  y={by+9*P} width={10*P} height={P}   fill={UP.sunrise_d}/>

      {/* Star dots on banner */}
      <rect x={bx+3*P}  y={by+P}   width={P}   height={P}    fill={UP.sunset}   />
      <rect x={bx+10*P} y={by+P}   width={P}   height={P}    fill={UP.sunset}   />

      <text x={cx} y={by+2.3*P} textAnchor="middle" fill={UP.midnight} fontSize={11} fontWeight="900" fontFamily="monospace" shapeRendering="geometricPrecision">START</text>
    </g>
  );
}

// ─── 2. SCHOOL (brand-pink) ────────────────────────────────────────────────
function SchoolBuilding({ cx, cy }: { cx:number; cy:number }) {
  const W = 14*P, H = 14*P;
  const bx = cx-W/2, by = cy-H;
  return (
    <g shapeRendering="crispEdges">
      <Outline x={bx} y={by-P} w={W} h={H+P} />
      {/* Bell tower */}
      <rect x={cx-P}     y={by-2*P} width={2*P}  height={3*P}  fill={UP.midnight}  />
      <rect x={cx-1.5*P} y={by-P}   width={P}    height={2*P}  fill={UP.sometimes} />
      {/* Roof (stepped pixel) */}
      <rect x={bx}       y={by}     width={W}    height={2*P}  fill={UP.midnight}  />
      <rect x={bx+P}     y={by-P}   width={W-2*P}height={P}    fill={UP.midnight}  />
      <rect x={bx+2*P}   y={by-2*P} width={W-4*P}height={P}    fill={UP.midnight}  />
      <rect x={bx+3*P}   y={by-3*P} width={W-6*P}height={P}    fill={UP.midnight}  />
      <rect x={bx}       y={by}     width={W}    height={P/2}  fill={UP.blue_l}    />
      {/* Wall */}
      <rect x={bx}       y={by+2*P} width={W}    height={12*P} fill={UP.pink}      />
      <rect x={bx}       y={by+2*P} width={P}    height={12*P} fill={UP.pink_d}    />
      <rect x={bx+13*P}  y={by+2*P} width={P}    height={12*P} fill={UP.pink_d}    />
      <rect x={bx+P}     y={by+2*P} width={12*P} height={P/2}  fill={UP.pink_l}   />
      {/* Left window */}
      <rect x={bx+2*P}   y={by+4*P} width={3*P}  height={3*P}  fill={UP.sometimes} />
      <rect x={bx+2*P}   y={by+4*P} width={3*P}  height={P/2}  fill={UP.sometimes_l}/>
      <rect x={bx+2*P}   y={by+5*P+P/2} width={3*P} height={P/2} fill={UP.midnight}/>
      <rect x={bx+3*P+P/2} y={by+4*P} width={P/2} height={3*P} fill={UP.midnight} />
      {/* Right window */}
      <rect x={bx+9*P}   y={by+4*P} width={3*P}  height={3*P}  fill={UP.sometimes} />
      <rect x={bx+9*P}   y={by+4*P} width={3*P}  height={P/2}  fill={UP.sometimes_l}/>
      <rect x={bx+9*P}   y={by+5*P+P/2} width={3*P} height={P/2} fill={UP.midnight}/>
      <rect x={bx+10*P+P/2} y={by+4*P} width={P/2} height={3*P} fill={UP.midnight}/>
      {/* Door */}
      <rect x={cx-1.5*P} y={by+9*P} width={3*P}  height={5*P}  fill={UP.midnight} />
      <rect x={cx-P}     y={by+9*P} width={2*P}  height={P+P/2}fill={UP.sometimes}/>
      <rect x={cx+P/2}   y={by+11*P}width={P/2}  height={P/2}  fill={UP.sunrise}  />
      {/* Steps */}
      <rect x={bx+4*P}   y={by+13*P}width={6*P}  height={P}    fill={UP.pink_d}   />
      {/* Flag */}
      <rect x={bx+13*P}  y={by+P}   width={P/2}  height={4*P}  fill={UP.blue}     />
      <rect x={bx+13*P+P/2} y={by+P} width={2*P} height={2*P}  fill={UP.sunset}   />
    </g>
  );
}

// ─── 3. LIBRARY (brand-sometimes-blue) ────────────────────────────────────
function LibraryBuilding({ cx, cy }: { cx:number; cy:number }) {
  const W = 14*P, H = 13*P;
  const bx = cx-W/2, by = cy-H;
  return (
    <g shapeRendering="crispEdges">
      <Outline x={bx} y={by} w={W} h={H} />
      <rect x={bx-P}     y={by+12*P} width={W+2*P} height={P}    fill={UP.sometimes_d}/>
      <rect x={bx-P/2}   y={by+11.5*P} width={W+P} height={P/2}  fill={UP.sometimes_d}/>
      <rect x={bx}       y={by+2*P}  width={W}     height={10*P}  fill={UP.sometimes} />
      <rect x={bx}       y={by+2*P}  width={P}     height={10*P}  fill={UP.sometimes_d}/>
      <rect x={bx+13*P}  y={by+2*P}  width={P}     height={10*P}  fill={UP.sometimes_d}/>
      <rect x={bx+P}     y={by+2*P}  width={12*P}  height={P/2}   fill={UP.sometimes_l}/>
      {/* Pediment */}
      <rect x={bx-P/2}   y={by+P+P/2} width={W+P} height={P}    fill={UP.sometimes_d}/>
      <rect x={bx}       y={by+P}    width={W}     height={P/2}  fill={UP.sometimes_d}/>
      <rect x={bx+P}     y={by+P/2}  width={W-2*P} height={P/2} fill={UP.sometimes_d}/>
      <rect x={bx+2*P}   y={by}      width={W-4*P} height={P/2} fill={UP.sometimes_d}/>
      <rect x={bx+3*P}   y={by-P/2}  width={W-6*P} height={P/2} fill={UP.sometimes_d}/>
      {/* Up triangle in pediment */}
      <rect x={cx-P/2}   y={by}      width={P}     height={P}   fill={UP.sunrise}   />
      <rect x={cx-P}     y={by+P/2}  width={2*P}   height={P/2} fill={UP.sunrise}   />
      <rect x={cx-1.5*P} y={by+P}    width={3*P}   height={P/2} fill={UP.sunrise}   />
      {/* Columns */}
      {[1,4,8,11].map(col=>(
        <g key={col}>
          <rect x={bx+col*P} y={by+2*P} width={P}   height={9*P}  fill={UP.sometimes_d}/>
          <rect x={bx+col*P} y={by+2*P} width={P/2} height={9*P}  fill={UP.sometimes} />
          <rect x={bx+col*P-P/4} y={by+2*P} width={P+P/2} height={P/2} fill={UP.sometimes_d}/>
        </g>
      ))}
      {/* Door arch */}
      <rect x={cx-P}     y={by+7*P}  width={2*P}   height={4*P} fill={UP.midnight}  />
      <rect x={cx-P}     y={by+6*P}  width={2*P}   height={P}   fill={UP.midnight}  />
      <rect x={cx-P-P/4} y={by+6.5*P} width={P/2} height={P}   fill={UP.midnight}  />
      <rect x={cx+P-P/4} y={by+6.5*P} width={P/2} height={P}   fill={UP.midnight}  />
      {/* Side windows */}
      <rect x={bx+2*P}   y={by+4*P}  width={2*P}   height={3*P} fill={UP.sunrise}   />
      <rect x={bx+2*P}   y={by+4*P}  width={2*P}   height={P/2} fill='#FFFF9A'      />
      <rect x={bx+10*P}  y={by+4*P}  width={2*P}   height={3*P} fill={UP.sunrise}   />
      <rect x={bx+10*P}  y={by+4*P}  width={2*P}   height={P/2} fill='#FFFF9A'      />
      {/* Sign */}
      <rect x={bx+2*P}   y={by+3*P}  width={10*P}  height={P}   fill={UP.sometimes_d}/>
      <text x={cx} y={by+3.8*P} textAnchor="middle" fill={UP.sunrise} fontSize={7} fontWeight="700" fontFamily="monospace" shapeRendering="geometricPrecision">LIBRARY</text>
    </g>
  );
}

// ─── 4. GROCERY STORE (brand-sunrise yellow) ──────────────────────────────
function GroceryBuilding({ cx, cy }: { cx:number; cy:number }) {
  const W = 15*P, H = 11*P;
  const bx = cx-W/2, by = cy-H;
  return (
    <g shapeRendering="crispEdges">
      <Outline x={bx} y={by} w={W} h={H} />
      {/* Sign board */}
      <rect x={bx}       y={by}      width={W}     height={2*P}  fill={UP.green}     />
      <rect x={bx}       y={by}      width={W}     height={P/2}  fill={UP.green_l}   />
      <text x={cx} y={by+1.5*P} textAnchor="middle" fill={UP.sunrise} fontSize={8} fontWeight="700" fontFamily="monospace" shapeRendering="geometricPrecision">GROCERIES</text>
      {/* Wall */}
      <rect x={bx}       y={by+2*P}  width={W}     height={9*P}  fill={UP.sunrise}   />
      <rect x={bx}       y={by+2*P}  width={P}     height={9*P}  fill={UP.sunrise_d} />
      <rect x={bx+14*P}  y={by+2*P}  width={P}     height={9*P}  fill={UP.sunrise_d} />
      <rect x={bx+P}     y={by+2*P}  width={13*P}  height={P/2}  fill='#FFFF9A'      />
      {/* Awning */}
      <rect x={bx-P/2}   y={by+2*P}  width={W+P}   height={P+P/2} fill={UP.sunset}  />
      {[0,1,2,3,4,5,6].map(i=>(
        <rect key={i} x={bx-P/2+i*2*P+P/2} y={by+2*P} width={P} height={P+P/2} fill={UP.sunset_d}/>
      ))}
      <rect x={bx-P/2}   y={by+3.5*P} width={W+P}  height={P/2}  fill={UP.sunset_d} />
      {/* Windows */}
      <rect x={bx+P}     y={by+4*P}  width={5*P}   height={4*P}  fill={UP.sometimes} />
      <rect x={bx+P}     y={by+4*P}  width={5*P}   height={P/2}  fill={UP.sometimes_l}/>
      <rect x={bx+3*P+P/2} y={by+4*P} width={P/2} height={4*P}  fill={UP.midnight_d}/>
      <rect x={bx+P+P/2} y={by+6*P}  width={P}     height={P+P/2} fill={UP.sunset}  />
      <rect x={bx+3*P}   y={by+5.5*P} width={P}    height={2*P}  fill={UP.green_l}  />
      <rect x={bx+9*P}   y={by+4*P}  width={5*P}   height={4*P}  fill={UP.sometimes} />
      <rect x={bx+9*P}   y={by+4*P}  width={5*P}   height={P/2}  fill={UP.sometimes_l}/>
      <rect x={bx+11*P+P/2} y={by+4*P} width={P/2} height={4*P} fill={UP.midnight_d}/>
      <rect x={bx+9*P+P/2} y={by+5.5*P} width={P}  height={2*P} fill={UP.pink}     />
      {/* Door */}
      <rect x={cx-P}     y={by+5*P}  width={2*P}   height={6*P}  fill={UP.midnight} />
      <rect x={cx-P/4}   y={by+7*P}  width={P/2}   height={P/2}  fill={UP.sunrise}  />
      <rect x={bx}       y={by+10*P} width={W}     height={P}    fill={UP.sunrise_d} />
    </g>
  );
}

// ─── 5. CLOTHING SHOP (brand-green) ──────────────────────────────────────
function ClothingBuilding({ cx, cy }: { cx:number; cy:number }) {
  const W = 14*P, H = 13*P;
  const bx = cx-W/2, by = cy-H;
  return (
    <g shapeRendering="crispEdges">
      <Outline x={bx} y={by-P} w={W} h={H+P} />
      {/* Crenels */}
      {[0,1,2,3,4,5].map(i=>(
        <rect key={i} x={bx+i*2*P+P/2} y={by-P} width={P} height={P} fill={UP.green_d}/>
      ))}
      <rect x={bx}       y={by}      width={W}     height={P+P/2}  fill={UP.green_d} />
      {/* Wall */}
      <rect x={bx}       y={by+P+P/2} width={W}   height={11*P+P/2} fill={UP.green} />
      <rect x={bx}       y={by+P+P/2} width={P}   height={11*P+P/2} fill={UP.green_d}/>
      <rect x={bx+13*P}  y={by+P+P/2} width={P}   height={11*P+P/2} fill={UP.green_d}/>
      <rect x={bx+P}     y={by+P+P/2} width={12*P} height={P/2}     fill={UP.green_l}/>
      {/* Sunset awning for contrast */}
      <rect x={bx-P/2}   y={by+P+P/2} width={W+P} height={P}  fill={UP.sunset}     />
      {[0,1,2,3,4,5,6].map(i=>(
        <rect key={i} x={bx-P/2+i*2*P} y={by+P+P/2} width={P} height={P} fill={UP.sunset_d}/>
      ))}
      {/* Display window */}
      <rect x={bx+P}     y={by+3*P}  width={12*P} height={5*P} fill={UP.sunrise}   />
      <rect x={bx+P}     y={by+3*P}  width={12*P} height={P/2} fill='#FFFF9A'      />
      <rect x={bx+P}     y={by+3*P}  width={P/2}  height={5*P} fill={UP.green_d}   />
      <rect x={bx+12.5*P} y={by+3*P} width={P/2}  height={5*P} fill={UP.green_d}   />
      <rect x={bx+7*P}   y={by+3*P}  width={P/2}  height={5*P} fill={UP.midnight_d}/>
      {/* Mannequin left */}
      <rect x={bx+2.5*P} y={by+4*P}  width={P}    height={P}   fill={UP.midnight}  />
      <rect x={bx+2*P}   y={by+5*P}  width={2*P}  height={2*P} fill='#7CC88C'      />
      <rect x={bx+2*P}   y={by+5*P}  width={P/2}  height={P+P/2} fill={UP.midnight_d}/>
      <rect x={bx+3.5*P} y={by+5*P}  width={P/2}  height={P+P/2} fill={UP.midnight_d}/>
      {/* Mannequin right */}
      <rect x={bx+10.5*P} y={by+4*P} width={P}    height={P}   fill={UP.midnight}  />
      <rect x={bx+10*P}  y={by+5*P}  width={2*P}  height={2*P} fill={UP.sunset}    />
      <rect x={bx+10*P}  y={by+5*P}  width={P/2}  height={P+P/2} fill={UP.midnight_d}/>
      <rect x={bx+11.5*P} y={by+5*P} width={P/2}  height={P+P/2} fill={UP.midnight_d}/>
      {/* Door */}
      <rect x={cx-P}     y={by+9*P}  width={2*P}  height={4*P} fill={UP.midnight}  />
      <rect x={cx+P/2}   y={by+11*P} width={P/2}  height={P/2} fill={UP.sunrise}   />
      {/* Sign */}
      <rect x={bx+P}     y={by+P}    width={12*P} height={P+P/4} fill={UP.green_d} />
      <text x={cx} y={by+1.8*P} textAnchor="middle" fill={UP.green_l} fontSize={7} fontWeight="700" fontFamily="monospace" shapeRendering="geometricPrecision">CLOTHING</text>
    </g>
  );
}

// ─── 6. THE BANK (brand-sunset orange + Up logo) ──────────────────────────
function BankBuilding({ cx, cy }: { cx:number; cy:number }) {
  const W = 16*P, H = 15*P;
  const bx = cx-W/2, by = cy-H;
  return (
    <g shapeRendering="crispEdges">
      <Outline x={bx} y={by-P} w={W} h={H+P} t={4} />
      {/* Steps */}
      <rect x={bx-2*P}   y={by+14*P} width={W+4*P} height={P}    fill={UP.sunset_d} />
      <rect x={bx-P}     y={by+13*P} width={W+2*P} height={P}    fill={UP.sunset_d} />
      {/* Wall */}
      <rect x={bx}       y={by+3*P}  width={W}     height={11*P} fill={UP.sunset}   />
      <rect x={bx}       y={by+3*P}  width={P+P/2} height={11*P} fill={UP.sunset_d} />
      <rect x={bx+14.5*P} y={by+3*P} width={P+P/2} height={11*P} fill={UP.sunset_d} />
      <rect x={bx+P+P/2} y={by+3*P}  width={14*P-P} height={P/2} fill={UP.sunset_l} />
      {/* Pediment base */}
      <rect x={bx-P/2}   y={by+2*P}  width={W+P}   height={P}    fill={UP.midnight} />
      {/* Pediment triangle stepped */}
      <rect x={bx}       y={by+P+P/2} width={W}    height={P/2}  fill={UP.midnight} />
      <rect x={bx+P}     y={by+P}     width={W-2*P} height={P/2} fill={UP.midnight} />
      <rect x={bx+2*P}   y={by+P/2}   width={W-4*P} height={P/2} fill={UP.midnight} />
      <rect x={bx+3*P}   y={by}       width={W-6*P} height={P/2} fill={UP.midnight} />
      <rect x={bx+4*P}   y={by-P/2}   width={W-8*P} height={P/2} fill={UP.midnight} />
      {/* Columns (midnight on orange — high contrast) */}
      {[2,5,9,12].map(col=>(
        <g key={col}>
          <rect x={bx+col*P}   y={by+2*P} width={P+P/2} height={11*P} fill={UP.midnight}  />
          <rect x={bx+col*P}   y={by+2*P} width={P/2}   height={11*P} fill={UP.midnight_d}/>
          <rect x={bx+col*P-P/4} y={by+2*P}  width={2*P} height={P/2} fill={UP.midnight_d}/>
          <rect x={bx+col*P-P/4} y={by+12.5*P} width={2*P} height={P/2} fill={UP.midnight_d}/>
        </g>
      ))}
      {/* Grand arched door */}
      <rect x={cx-2*P}   y={by+8*P}  width={4*P}  height={6*P}  fill={UP.midnight}  />
      <rect x={cx-2*P}   y={by+7*P}  width={4*P}  height={P}    fill={UP.midnight}  />
      <rect x={cx-2.5*P} y={by+7.5*P} width={P}   height={2*P}  fill={UP.midnight}  />
      <rect x={cx+1.5*P} y={by+7.5*P} width={P}   height={2*P}  fill={UP.midnight}  />
      <rect x={cx-P/2}   y={by+10*P} width={P}    height={P/2}  fill={UP.sunrise}   />
      {/* Blue windows (contrast on orange) */}
      <rect x={bx+7*P}   y={by+4*P}  width={2*P}  height={3*P}  fill={UP.sometimes} />
      <rect x={bx+7*P}   y={by+4*P}  width={2*P}  height={P/2}  fill={UP.sometimes_l}/>
      <rect x={bx+7*P}   y={by+5*P+P/2} width={2*P} height={P/2} fill={UP.sometimes_d}/>
      <rect x={bx+9*P}   y={by+4*P}  width={2*P}  height={3*P}  fill={UP.sometimes} />
      <rect x={bx+9*P}   y={by+4*P}  width={2*P}  height={P/2}  fill={UP.sometimes_l}/>
      <rect x={bx+9*P}   y={by+5*P+P/2} width={2*P} height={P/2} fill={UP.sometimes_d}/>
      {/* Up logo PNG — rendered last so it sits on top of all building elements */}
      <image href={upLogoImg} x={cx-22} y={by-4} width={44} height={44} shapeRendering="auto" style={{ imageRendering: 'auto' }} />
    </g>
  );
}

// ─── Decorative elements ───────────────────────────────────────────────────

function PixelTree({ x, y, s=1 }: { x:number;y:number;s?:number }) {
  const u = P*s;
  return (
    <g shapeRendering="crispEdges">
      <rect x={x-u/2}   y={y}       width={u}   height={u+u/2} fill='#3A2210' />
      <rect x={x-2*u}   y={y-2*u}   width={4*u} height={2*u}   fill='#1A3E22' />
      <rect x={x-1.5*u} y={y-3*u}   width={3*u} height={u+u/2} fill='#1E4E28' />
      <rect x={x-u}     y={y-4*u}   width={2*u} height={u+u/2} fill='#245230' />
      <rect x={x-u/2}   y={y-4.5*u} width={u}   height={u/2}   fill='#2A6030' />
    </g>
  );
}
function PixelBush({ x, y }: { x:number;y:number }) {
  return (
    <g shapeRendering="crispEdges">
      <rect x={x-P*1.5} y={y-P}    width={P*3} height={P}   fill='#1E4E28' />
      <rect x={x-P}     y={y-P*2}  width={P*2} height={P}   fill='#245230' />
      <rect x={x-P/2}   y={y-P*2.5} width={P}  height={P/2} fill='#2A6030' />
    </g>
  );
}
function PixelFlower({ x, y, color=UP.pink }: { x:number;y:number;color?:string }) {
  return (
    <g shapeRendering="crispEdges">
      <rect x={x-P/4} y={y-P*1.5} width={P/2} height={P*1.5} fill='#2A5A22' />
      <rect x={x-P/2} y={y-P*2}   width={P}   height={P}     fill={color}   />
    </g>
  );
}

// ─── Tiny pixel-art figures ────────────────────────────────────────────────

function TinyPerson({ x, y, shirt, skin = '#E8B07A', hat }: {
  x:number; y:number; shirt:string; skin?:string; hat?:string;
}) {
  return (
    <g shapeRendering="crispEdges">
      {hat && <rect x={x-3} y={y-18} width={6} height={2} fill={hat} />}
      <rect x={x-2} y={y-16} width={4} height={4} fill={skin}     />
      <rect x={x-3} y={y-12} width={6} height={6} fill={shirt}    />
      <rect x={x-3} y={y-12} width={6} height={1} fill="rgba(0,0,0,0.12)" />
      <rect x={x-2} y={y-6}  width={2} height={5} fill="#1A1A22"  />
      <rect x={x}   y={y-6}  width={2} height={5} fill="#242430"  />
    </g>
  );
}

function PeopleGroup({ x, y, shirts, hats, skins }: {
  x:number; y:number;
  shirts: string[];
  hats?:  (string|undefined)[];
  skins?: string[];
}) {
  return (
    <g>
      {shirts.map((shirt, i) => (
        <TinyPerson
          key={i}
          x={x + i * 9}
          y={y}
          shirt={shirt}
          hat={hats?.[i]}
          skin={skins?.[i]}
        />
      ))}
    </g>
  );
}

// ─── Tiny pixel-art animals ────────────────────────────────────────────────

function TinyCat({ x, y, color = '#9A9AAA' }: { x:number; y:number; color?:string }) {
  return (
    <g shapeRendering="crispEdges">
      <rect x={x-3} y={y-12} width={2} height={2} fill={color}    />
      <rect x={x+1} y={y-12} width={2} height={2} fill={color}    />
      <rect x={x-3} y={y-10} width={6} height={5} fill={color}    />
      <rect x={x-1} y={y-8}  width={1} height={1} fill="#1A1A22"  />
      <rect x={x+1} y={y-8}  width={1} height={1} fill="#1A1A22"  />
      <rect x={x-1} y={y-6}  width={2} height={1} fill="#FF8BB5"  />
      <rect x={x-4} y={y-5}  width={9} height={4} fill={color}    />
      <rect x={x+5} y={y-8}  width={1} height={7} fill={color}    />
      <rect x={x+6} y={y-10} width={1} height={4} fill={color}    />
      <rect x={x-3} y={y-1}  width={2} height={3} fill={color}    />
      <rect x={x+1} y={y-1}  width={2} height={3} fill={color}    />
    </g>
  );
}

function TinyDog({ x, y }: { x:number; y:number }) {
  const c = '#B07840', s = '#7A5020';
  return (
    <g shapeRendering="crispEdges">
      <rect x={x+4}  y={y-10} width={7}  height={6} fill={c} />
      <rect x={x+9}  y={y-9}  width={2}  height={4} fill={s} />
      <rect x={x+11} y={y-8}  width={3}  height={2} fill='#C0A070' />
      <rect x={x+14} y={y-7}  width={1}  height={1} fill="#1A1A22" />
      <rect x={x}    y={y-6}  width={11} height={6} fill={c} />
      <rect x={x-2}  y={y-10} width={2}  height={7} fill={c} />
      <rect x={x-3}  y={y-12} width={1}  height={3} fill={c} />
      <rect x={x+2}  y={y}    width={2}  height={4} fill={s} />
      <rect x={x+7}  y={y}    width={2}  height={4} fill={s} />
    </g>
  );
}

function TinyDuck({ x, y, facing = 'right' }: { x:number; y:number; facing?:'left'|'right' }) {
  const f = facing === 'right' ? 1 : -1;
  return (
    <g transform={facing === 'left' ? `scale(-1,1) translate(${-x*2-10},0)` : undefined} shapeRendering="crispEdges">
      <rect x={x}    y={y-5}  width={10} height={5}  fill="#EEEEEE" />
      <rect x={x+7}  y={y-8}  width={5}  height={4}  fill={UP.green} />
      <rect x={x+12} y={y-7}  width={3}  height={1}  fill={UP.sunrise} />
      <rect x={x+1}  y={y-4}  width={5}  height={2}  fill="#DDDDDD" />
      <rect x={x+2}  y={y}    width={2}  height={2}  fill={UP.sunrise} />
      <rect x={x+6}  y={y}    width={2}  height={2}  fill={UP.sunrise} />
    </g>
  );
}

function TinyBird({ x, y }: { x:number; y:number }) {
  return (
    <g shapeRendering="crispEdges">
      <rect x={x-5} y={y}    width={4} height={2} fill={UP.midnight}   />
      <rect x={x-1} y={y-2}  width={2} height={2} fill={UP.midnight}   />
      <rect x={x+1} y={y}    width={4} height={2} fill={UP.midnight}   />
    </g>
  );
}

function TinyRabbit({ x, y }: { x:number; y:number }) {
  return (
    <g shapeRendering="crispEdges">
      <rect x={x-1} y={y-14} width={2} height={5} fill="#E8E8E8" />
      <rect x={x+2} y={y-13} width={2} height={4} fill="#E8E8E8" />
      <rect x={x-2} y={y-9}  width={6} height={5} fill="#E8E8E8" />
      <rect x={x-1} y={y-7}  width={1} height={1} fill="#FF8BB5" />
      <rect x={x+2} y={y-7}  width={1} height={1} fill="#FF8BB5" />
      <rect x={x-2} y={y-4}  width={7} height={4} fill="#E8E8E8" />
      <rect x={x+5} y={y-5}  width={3} height={2} fill="#E8E8E8" />
      <rect x={x-1} y={y}    width={2} height={3} fill="#E8E8E8" />
      <rect x={x+2} y={y}    width={2} height={3} fill="#E8E8E8" />
    </g>
  );
}

// ─── Pixel Castle ─────────────────────────────────────────────────────────
function PixelCastle({ cx, cy }: { cx:number; cy:number }) {
  const Q = 4;   // castle pixel unit
  const st  = '#4A4860';   // stone
  const stL = '#5E5A72';   // stone light
  const stD = '#363448';   // stone dark
  const gt  = UP.midnight_d;

  const bx = cx - 12*Q;  // left edge
  const by = cy - 18*Q;  // top edge

  return (
    <g shapeRendering="crispEdges">
      {/* ── LEFT TOWER ── */}
      <rect x={bx}       y={by+2*Q}  width={6*Q}  height={16*Q} fill={st}  />
      <rect x={bx}       y={by+2*Q}  width={Q}    height={16*Q} fill={stD} />
      <rect x={bx+Q}     y={by+2*Q}  width={Q/2}  height={16*Q} fill={stL} />
      {/* crenels */}
      <rect x={bx}       y={by}      width={2*Q}  height={2*Q}  fill={st}  />
      <rect x={bx+4*Q}   y={by}      width={2*Q}  height={2*Q}  fill={st}  />
      {/* mortar lines */}
      <rect x={bx}       y={by+4*Q}  width={6*Q}  height={Q/2}  fill={stD} />
      <rect x={bx}       y={by+8*Q}  width={6*Q}  height={Q/2}  fill={stD} />
      <rect x={bx}       y={by+12*Q} width={6*Q}  height={Q/2}  fill={stD} />
      {/* window */}
      <rect x={bx+2*Q}   y={by+5*Q}  width={2*Q}  height={3*Q}  fill={gt}  />
      <rect x={bx+2*Q}   y={by+5*Q}  width={2*Q}  height={Q}    fill="rgba(63,168,244,0.35)" />
      {/* flag pole + flag */}
      <rect x={bx+3*Q}   y={by-4*Q}  width={Q/2}  height={4*Q}  fill={UP.blue} />
      <rect x={bx+3*Q+Q/2} y={by-4*Q} width={3*Q} height={2*Q}  fill={UP.sunset} />
      <rect x={bx+3*Q+Q/2} y={by-4*Q} width={3*Q} height={Q/2}  fill={UP.sunrise} />

      {/* ── MAIN WALL ── */}
      <rect x={bx+6*Q}   y={by+8*Q}  width={12*Q} height={10*Q} fill={st}  />
      <rect x={bx+6*Q}   y={by+8*Q}  width={12*Q} height={Q/2}  fill={stL} />
      <rect x={bx+6*Q}   y={by+10*Q} width={12*Q} height={Q/2}  fill={stD} />
      <rect x={bx+6*Q}   y={by+14*Q} width={12*Q} height={Q/2}  fill={stD} />
      {/* wall crenels */}
      <rect x={bx+6*Q}   y={by+6*Q}  width={2*Q}  height={2*Q}  fill={st}  />
      <rect x={bx+10*Q}  y={by+6*Q}  width={2*Q}  height={2*Q}  fill={st}  />
      <rect x={bx+14*Q}  y={by+6*Q}  width={2*Q}  height={2*Q}  fill={st}  />
      {/* gate arch */}
      <rect x={bx+9*Q}   y={by+11*Q} width={6*Q}  height={7*Q}  fill={gt}  />
      <rect x={bx+9*Q}   y={by+11*Q} width={3*Q}  height={6*Q}  fill="#1A2A1A" />
      <rect x={bx+12*Q}  y={by+11*Q} width={3*Q}  height={6*Q}  fill="#121E12" />
      {/* portcullis bars */}
      <rect x={bx+9*Q+Q/2}  y={by+11*Q} width={Q/2} height={6*Q} fill="#283828" opacity={0.8} />
      <rect x={bx+9*Q+2*Q}  y={by+11*Q} width={Q/2} height={6*Q} fill="#283828" opacity={0.8} />
      <rect x={bx+9*Q+3.5*Q} y={by+11*Q} width={Q/2} height={6*Q} fill="#283828" opacity={0.8} />
      <rect x={bx+9*Q}   y={by+13*Q} width={6*Q}  height={Q/2}  fill="#283828" opacity={0.6} />
      <rect x={bx+9*Q}   y={by+15*Q} width={6*Q}  height={Q/2}  fill="#283828" opacity={0.6} />

      {/* ── RIGHT TOWER ── */}
      <rect x={bx+18*Q}  y={by+2*Q}  width={6*Q}  height={16*Q} fill={st}  />
      <rect x={bx+18*Q}  y={by+2*Q}  width={Q}    height={16*Q} fill={stD} />
      <rect x={bx+19*Q}  y={by+2*Q}  width={Q/2}  height={16*Q} fill={stL} />
      <rect x={bx+18*Q}  y={by}      width={2*Q}  height={2*Q}  fill={st}  />
      <rect x={bx+22*Q}  y={by}      width={2*Q}  height={2*Q}  fill={st}  />
      <rect x={bx+18*Q}  y={by+4*Q}  width={6*Q}  height={Q/2}  fill={stD} />
      <rect x={bx+18*Q}  y={by+8*Q}  width={6*Q}  height={Q/2}  fill={stD} />
      <rect x={bx+18*Q}  y={by+12*Q} width={6*Q}  height={Q/2}  fill={stD} />
      <rect x={bx+20*Q}  y={by+5*Q}  width={2*Q}  height={3*Q}  fill={gt}  />
      <rect x={bx+20*Q}  y={by+5*Q}  width={2*Q}  height={Q}    fill="rgba(63,168,244,0.35)" />
      {/* right flag */}
      <rect x={bx+21*Q}  y={by-3*Q}  width={Q/2}  height={3*Q}  fill={UP.blue}    />
      <rect x={bx+21*Q+Q/2} y={by-3*Q} width={2*Q} height={Q+Q/2} fill={UP.sunrise} />

      {/* Ground shadow */}
      <rect x={bx-Q}     y={cy}      width={26*Q} height={Q}    fill="rgba(0,0,0,0.3)" />
    </g>
  );
}

// ─── Pixel Knight ──────────────────────────────────────────────────────────
function TinyKnight({ x, y }: { x:number; y:number }) {
  const ar  = '#5A5870';
  const arL = '#7A788A';
  const vr  = UP.midnight_d;
  const sw  = '#C0C8D8';
  return (
    <g shapeRendering="crispEdges">
      {/* helmet plume */}
      <rect x={x+1}  y={y-23} width={1} height={4} fill={UP.sunset}  />
      <rect x={x+2}  y={y-22} width={1} height={3} fill={UP.sunrise} />
      {/* helmet */}
      <rect x={x-2}  y={y-19} width={5} height={5} fill={ar}  />
      <rect x={x-2}  y={y-19} width={5} height={1} fill={arL} />
      {/* visor brim */}
      <rect x={x-3}  y={y-15} width={7} height={1} fill={ar}  />
      {/* visor slot */}
      <rect x={x-1}  y={y-17} width={3} height={2} fill={vr}  />
      {/* chest plate */}
      <rect x={x-3}  y={y-14} width={7} height={7} fill={ar}  />
      <rect x={x-3}  y={y-14} width={1} height={7} fill={arL} />
      <rect x={x-2}  y={y-13} width={5} height={1} fill={arL} />
      {/* shield (left side) */}
      <rect x={x-7}  y={y-13} width={4} height={5} fill={UP.sunset}  />
      <rect x={x-7}  y={y-13} width={4} height={1} fill={UP.sunrise} />
      <rect x={x-6}  y={y-11} width={2} height={1} fill={UP.sunrise} />
      {/* sword (right side) */}
      <rect x={x+3}  y={y-16} width={1} height={9}  fill={sw}  />
      <rect x={x+2}  y={y-13} width={3} height={1}  fill={sw}  />  {/* crossguard */}
      <rect x={x+3}  y={y-17} width={1} height={1}  fill={arL} />  {/* pommel */}
      {/* legs */}
      <rect x={x-2}  y={y-7}  width={2} height={6}  fill={ar}  />
      <rect x={x+1}  y={y-7}  width={2} height={6}  fill={arL} />
      {/* boots */}
      <rect x={x-3}  y={y-1}  width={3} height={2}  fill={arL} />
      <rect x={x+1}  y={y-1}  width={3} height={2}  fill={ar}  />
    </g>
  );
}

// ─── Stop label ────────────────────────────────────────────────────────────
function StopLabel({ cx, cy, name, ages }: { cx:number;cy:number;name:string;ages:string }) {
  const nameW = name.length * 7.8 + 20;
  const agesW = ages.length * 6.5 + 16;
  const boxW  = Math.max(nameW, agesW, 80);
  return (
    <g>
      <rect x={cx-boxW/2-2} y={cy+2}  width={boxW+4} height={42} fill={UP.midnight_d} />
      <rect x={cx-boxW/2}   y={cy+4}  width={boxW}   height={38} fill={UP.midnight}   />
      <text x={cx} y={cy+20} textAnchor="middle" fill="rgba(255,255,255,0.97)" fontSize={13} fontWeight="700" fontFamily="monospace">{name}</text>
      <text x={cx} y={cy+36} textAnchor="middle" fill={UP.sunset}             fontSize={11} fontFamily="monospace">{ages}</text>
    </g>
  );
}

function StopBadge({ cx, cy, num, color }: { cx:number;cy:number;num:number;color:string }) {
  return (
    <g shapeRendering="crispEdges">
      <rect x={cx-14} y={cy-14} width={28} height={28} fill={UP.midnight_d} />
      <rect x={cx-12} y={cy-12} width={24} height={24} fill={color}         />
      <text x={cx} y={cy+5} textAnchor="middle" fill={UP.midnight_d} fontSize={14} fontWeight="900" fontFamily="monospace">{num}</text>
    </g>
  );
}

// ─── Up Logo Pixel Driver ──────────────────────────────────────────────────
function UpDriver({
  cx, cy, direction, isMoving, onClick, rotation,
}: {
  cx:number; cy:number;
  direction: 'right'|'left'|'up'|'down';
  isMoving: boolean;
  onClick: () => void;
  rotation: number;
}) {
  const S = 5;
  const bx = cx - 4*S, by = cy - 4*S;

  // Trails come out the back — relative to the un-rotated sprite (rotation handles orientation)
  const trails = isMoving ? [1,2,3].map(i => {
    const op = 0.45 - i*0.13;
    const len = S*(4-i);
    const thin = S/2;
    // Always trail downward from the base of the triangle (the rotated sprite handles direction visually)
    return <rect key={i} x={cx-thin/2} y={by+8*S+i*S*1.5} width={thin} height={len} fill={UP.sunset} opacity={op} shapeRendering="crispEdges"/>;
  }) : [];

  return (
    <g
      onClick={onClick}
      style={{
        cursor: 'pointer',
        transform: `rotate(${rotation}deg)`,
        transformOrigin: `${cx}px ${cy}px`,
        // When moving: quick snap to new direction; when stopped: springy spin back upright
        transition: isMoving
          ? 'transform 0.18s ease'
          : 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      shapeRendering="crispEdges"
    >
      {/* Ground shadow */}
      <rect x={bx+4} y={by+8*S+2} width={8*S-8} height={4} fill="rgba(0,0,0,0.45)" />

      {/* Motion trails (exit from base of triangle) */}
      {trails}

      {/* Outline */}
      <rect x={bx-2} y={by-2} width={8*S+4} height={8*S+4} fill={UP.midnight_d} />

      {/* Orange background */}
      <rect x={bx}     y={by}     width={8*S} height={8*S} fill={UP.sunset} />

      {/* Yellow stepped triangle — tip at top */}
      <rect x={bx+3*S} y={by+S}   width={2*S} height={S}   fill={UP.sunrise} />
      <rect x={bx+2*S} y={by+2*S} width={4*S} height={S}   fill={UP.sunrise} />
      <rect x={bx+S}   y={by+3*S} width={6*S} height={S}   fill={UP.sunrise} />
      <rect x={bx+S}   y={by+4*S} width={6*S} height={S}   fill={UP.sunrise} />
      <rect x={bx+S}   y={by+5*S} width={6*S} height={S}   fill={UP.sunrise} />

      {/* Smiley face — two dot eyes + pixel-arc smile */}
      {/* Left eye */}
      <rect x={cx-8}  y={cy-4} width={3} height={3} fill={UP.midnight_d} />
      {/* Right eye */}
      <rect x={cx+5}  y={cy-4} width={3} height={3} fill={UP.midnight_d} />
      {/* Smile — left corner, centre dip, right corner */}
      <rect x={cx-7}  y={cy+3} width={3} height={2} fill={UP.midnight_d} />
      <rect x={cx-3}  y={cy+5} width={5} height={2} fill={UP.midnight_d} />
      <rect x={cx+4}  y={cy+3} width={3} height={2} fill={UP.midnight_d} />

      {/* Pulsing click-hint ring when stopped */}
      {!isMoving && (
        <circle cx={cx} cy={cy} r={4*S+4} fill="none" stroke={UP.sunrise} strokeWidth={2.5} opacity={0.7}>
          <animate attributeName="r"       values={`${4*S+3};${4*S+9};${4*S+3}`} dur="1.8s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.7;0.15;0.7"                  dur="1.8s" repeatCount="indefinite"/>
        </circle>
      )}
    </g>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

const MAIN_ROUTE = 'M 120,640 H 920 V 200 H 120 V 440 H 560';

interface TownMapProps {
  stops: Stop[];
  onSelectStop: (stop: Stop) => void;
}

export function TownMap({ stops, onSelectStop }: TownMapProps) {
  const [hoveredId, setHoveredId]       = useState<string | null>(null);
  const [driverDist, setDriverDist]     = useState(0);
  const [targetDist, setTargetDist]     = useState<number | null>(null);
  const [isMoving, setIsMoving]         = useState(false);
  const [isSettling, setIsSettling]     = useState(false); // true during spin-back before modal opens
  const driverDistRef = useRef(0);
  const animRef       = useRef<number>(0);
  const travelDirRef  = useRef<1|-1>(1); // 1 = forward along route, -1 = backward

  const driverPos = getPosAtDist(driverDist);
  const driverDir = getDirectionAtDist(driverDist, travelDirRef.current);
  // Rotation: tip of triangle points in direction of travel; 0 = upright when stopped
  const driverRotation = isMoving ? (DIR_TO_DEG[driverDir] ?? 0) : 0;

  // ── Travel to a specific stop (bi-directional) ────────────────────────
  const travelTo = useCallback((stopId: string) => {
    if (isMoving || isSettling) return;
    const td = STOP_DISTS[stopId];
    if (td === undefined) return;
    const curr = driverDistRef.current;
    if (Math.abs(curr - td) < 4) {
      const stop = stops.find(s => s.id === stopId);
      if (stop) onSelectStop(stop);
      return;
    }
    // Determine direction and animate — no teleport needed
    travelDirRef.current = td > curr ? 1 : -1;
    setTargetDist(td);
  }, [isMoving, isSettling, stops, onSelectStop]);

  // ── Travel to next stop in sequence (always forward) ─────────────────
  const travelToNext = useCallback(() => {
    if (isMoving || isSettling) return;
    const d = driverDistRef.current;
    let nextId = 'start';
    let minDist = Infinity;
    for (const [id, stopD] of Object.entries(STOP_DISTS)) {
      if (stopD > d + 2 && stopD < minDist) { minDist = stopD; nextId = id; }
    }
    if (minDist === Infinity) {
      driverDistRef.current = 0;
      setDriverDist(0);
      const start = stops.find(s => s.id === 'start');
      if (start) onSelectStop(start);
      return;
    }
    travelDirRef.current = 1;
    travelTo(nextId);
  }, [isMoving, isSettling, travelTo, stops, onSelectStop]);

  // ── Animation loop (supports forward and backward) ────────────────────
  useEffect(() => {
    if (targetDist === null) return;
    const startDist = driverDistRef.current;
    const dir       = travelDirRef.current;
    const travel    = Math.abs(targetDist - startDist);
    if (travel < 2) { setTargetDist(null); return; }

    const SPEED    = 500;
    const duration = (travel / SPEED) * 1000;
    const t0       = performance.now();
    setIsMoving(true);

    const tick = (now: number) => {
      const p     = Math.min((now - t0) / duration, 1);
      const eased = p < 0.5 ? 4*p*p*p : 1 - Math.pow(-2*p+2, 3)/2;
      const d     = Math.max(0, Math.min(startDist + travel * eased * dir, TOTAL_D));
      driverDistRef.current = d;
      setDriverDist(d);

      if (p < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        driverDistRef.current = targetDist;
        setDriverDist(targetDist);
        setIsMoving(false);    // triggers the 0.7s spring spin back to upright
        setIsSettling(true);   // block further clicks during spin
        setTargetDist(null);
        const arrived = stops.find(s => STOP_DISTS[s.id] === targetDist);
        setTimeout(() => {
          setIsSettling(false);
          if (arrived) onSelectStop(arrived);
        }, 750);
      }
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [targetDist, stops, onSelectStop]);

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <div style={{
      width: '100%',
      borderRadius: 8,
      border: `3px solid ${UP.midnight_d}`,
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
      imageRendering: 'pixelated',
    }}>
      <svg
        viewBox="0 0 1200 780"
        width="100%"
        style={{ display:'block', imageRendering:'pixelated' }}
        shapeRendering="crispEdges"
      >
        {/* ── GROUND ─────────────────────────────────────────────────── */}
        <rect x={0} y={0} width={1200} height={780} fill="#172016" />
        <rect x={40}  y={48}  width={240} height={144} fill="#1A2E18" />
        <rect x={376} y={208} width={184} height={136} fill="#1A2E18" />
        <rect x={672} y={288} width={224} height={160} fill="#1A2E18" />
        <rect x={48}  y={448} width={192} height={168} fill="#1A2E18" />
        <rect x={584} y={544} width={352} height={200} fill="#1A2E18" />
        <rect x={376} y={616} width={176} height={152} fill="#1A2E18" />
        <rect x={824} y={48}  width={184} height={136} fill="#1A2E18" />
        <rect x={1048} y={304} width={144} height={176} fill="#1A2E18" />

        {/* Soccer pitch */}
        <rect x={224} y={456} width={160} height={112} fill="#163016" />
        <rect x={232} y={464} width={144} height={96}  fill="none" stroke="#1C4020" strokeWidth={2} />
        <rect x={232} y={500} width={144} height={P/2} fill="#1C4020" />
        <rect x={296} y={464} width={16}  height={96}  fill="none" stroke="#1C4020" strokeWidth={1.5} />
        <rect x={232} y={488} width={16}  height={32}  fill="none" stroke="#1C4020" strokeWidth={1.5} />
        <rect x={360} y={488} width={16}  height={32}  fill="none" stroke="#1C4020" strokeWidth={1.5} />

        {/* Pond */}
        <rect x={608} y={224} width={96}  height={56}  fill="#182438" />
        <rect x={616} y={232} width={80}  height={40}  fill="#1A2840" />
        <rect x={624} y={236} width={64}  height={32}  fill="#1E3050" />
        <rect x={624} y={236} width={24}  height={8}   fill="rgba(63,168,244,0.18)" />

        {/* Car park */}
        <rect x={832} y={56}  width={168} height={120} fill="#1A1A24" />
        {[0,1,2].map(i=>(
          <rect key={i} x={840} y={64+i*40} width={152} height={32} fill="none" stroke="#242438" strokeWidth={2}/>
        ))}

        {/* ── BACKGROUND ROADS ───────────────────────────────────────── */}
        {[88,320,552].map(y=>(
          <g key={`bhr${y}`}>
            <rect x={0} y={y-11} width={1200} height={22} fill="#1C1C28" />
            <rect x={0} y={y-1}  width={1200} height={2}  fill="#242438" />
          </g>
        ))}
        {[296,680].map(x=>(
          <g key={`bvr${x}`}>
            <rect x={x-11} y={0} width={22} height={780} fill="#1C1C28" />
            <rect x={x-1}  y={0} width={2}  height={780} fill="#242438" />
          </g>
        ))}
        {[88,320,552].flatMap(y=>[296,680].map(x=>(
          <rect key={`bi${x}${y}`} x={x-11} y={y-11} width={22} height={22} fill="#1C1C28" />
        )))}

        {/* ── MAIN ROUTE ROADS ───────────────────────────────────────── */}
        <path d={MAIN_ROUTE} stroke="rgba(78,98,128,0.25)" strokeWidth={56}  fill="none" strokeLinejoin="miter"/>
        <path d={MAIN_ROUTE} stroke={UP.blue_d}             strokeWidth={44}  fill="none" strokeLinejoin="miter"/>
        <path d={MAIN_ROUTE} stroke={UP.blue}               strokeWidth={36}  fill="none" strokeLinejoin="miter"/>
        <path d={MAIN_ROUTE} stroke={UP.blue_l}             strokeWidth={2}   fill="none" strokeLinejoin="miter" opacity={0.3}/>
        <path d={MAIN_ROUTE} stroke={UP.sunrise}            strokeWidth={3}   fill="none" strokeDasharray="20 16" strokeLinejoin="miter" opacity={0.9}/>

        {/* Intersection squares */}
        {[[120,640],[920,640],[920,200],[120,200],[120,440],[560,440],[480,200]].map(([x,y])=>(
          <rect key={`int${x}${y}`} x={x-18} y={y-18} width={36} height={36} fill={UP.blue}/>
        ))}
        <path d={MAIN_ROUTE} stroke={UP.sunrise} strokeWidth={3} fill="none" strokeDasharray="20 16" strokeLinejoin="miter" opacity={0.9}/>



        {/* ── TREES & GREENERY ───────────────────────────────────────── */}
        <PixelTree x={72}  y={168} />
        <PixelTree x={144} y={144} s={0.9} />
        <PixelTree x={224} y={168} s={1.1} />
        <PixelTree x={400} y={288} s={0.9} />
        <PixelTree x={448} y={312} />
        <PixelTree x={696} y={336} />
        <PixelTree x={760} y={360} s={1.1} />
        <PixelTree x={840} y={344} s={0.9} />
        <PixelTree x={80}  y={488} />
        <PixelTree x={120} y={544} s={0.85} />
        <PixelTree x={168} y={568} s={0.9} />
        <PixelTree x={624} y={592} />
        <PixelTree x={784} y={600} s={0.9} />
        <PixelTree x={936} y={600} s={0.85} />
        <PixelTree x={856} y={80}  />
        <PixelTree x={912} y={96}  s={0.9} />
        <PixelTree x={976} y={72}  s={1.05} />
        <PixelTree x={1064} y={320} s={0.88} />
        <PixelTree x={1112} y={344} />
        <PixelBush x={152} y={200} />
        <PixelBush x={536} y={264} />
        <PixelBush x={624} y={280} />
        <PixelBush x={1056} y={416} />
        <PixelBush x={336} y={592} />
        <PixelFlower x={96}  y={160} color={UP.pink}    />
        <PixelFlower x={168} y={184} color={UP.sunrise}  />
        <PixelFlower x={432} y={304} color={UP.sunset}   />
        <PixelFlower x={728} y={352} color={UP.pink}    />
        <PixelFlower x={152} y={560} color={UP.pink}    />

        {/* ── CASTLE + KNIGHT (bottom-right corner) ─────────────── */}
        {/* Grass patch for castle grounds */}
        <rect x={944} y={568} width={244} height={196} fill="#1A2E18" />
        {/* Some flowers & bushes around the castle */}
        <PixelBush   x={968}  y={700} />
        <PixelBush   x={1170} y={690} />
        <PixelTree   x={960}  y={640} s={0.75} />
        <PixelTree   x={1168} y={630} s={0.8}  />
        <PixelFlower x={1000} y={720} color={UP.pink}   />
        <PixelFlower x={1150} y={714} color={UP.sunrise} />
        <PixelFlower x={1012} y={706} color={UP.sunset}  />

        {/* Castle */}
        <PixelCastle cx={1086} cy={716} />

        {/* Knight — patrols in front of the gate */}
        <g>
          <TinyKnight x={0} y={0} />
          <animateTransform attributeName="transform" type="translate"
            values="1010 724; 1050 724; 1058 724; 1058 724; 1050 724; 1010 724; 1010 724"
            keyTimes="0; 0.25; 0.35; 0.55; 0.65; 0.9; 1"
            dur="8s" repeatCount="indefinite"/>
        </g>

        {/* ── ANIMATED ANIMALS ─────────────────────────────────────── */}

        {/* Flock 1: birds flying left → right across upper map */}
        <g>
          <TinyBird x={0}  y={104} />
          <TinyBird x={16} y={98}  />
          <TinyBird x={30} y={106} />
          <TinyBird x={48} y={100} />
          <animateTransform attributeName="transform" type="translate"
            from="-80 0" to="1280 0" dur="20s" repeatCount="indefinite"/>
        </g>

        {/* Flock 2: birds flying right → left, different height */}
        <g>
          <TinyBird x={0}  y={136} />
          <TinyBird x={14} y={130} />
          <TinyBird x={26} y={138} />
          <animateTransform attributeName="transform" type="translate"
            from="1280 0" to="-80 0" dur="27s" repeatCount="indefinite"/>
        </g>

        {/* Flock 3: small fast flock */}
        <g>
          <TinyBird x={0}  y={72} />
          <TinyBird x={18} y={68} />
          <animateTransform attributeName="transform" type="translate"
            from="-40 0" to="1280 0" dur="14s" repeatCount="indefinite" begin="6s"/>
        </g>

        {/* Cat patrolling right edge of map */}
        <g>
          <TinyCat x={0} y={0} color="#B0A0C0" />
          <animateTransform attributeName="transform" type="translate"
            values="1068 414; 1120 414; 1120 414; 1068 414; 1068 414"
            keyTimes="0; 0.35; 0.5; 0.85; 1"
            dur="9s" repeatCount="indefinite"/>
        </g>

        {/* Dog near soccer field — gentle excited bob */}
        <g>
          <TinyDog x={0} y={0} />
          <animateTransform attributeName="transform" type="translate"
            values="270 532; 270 529; 270 532; 284 532; 284 529; 284 532; 270 532"
            keyTimes="0; 0.12; 0.25; 0.4; 0.52; 0.65; 1"
            dur="3.5s" repeatCount="indefinite"/>
        </g>

        {/* Ducks near pond — drift and bob */}
        <g>
          <TinyDuck x={616} y={258} facing="right" />
          <animateTransform attributeName="transform" type="translate"
            values="0 0; 6 -2; 12 0; 6 -2; 0 0"
            dur="5s" repeatCount="indefinite"/>
        </g>
        <g>
          <TinyDuck x={638} y={262} facing="left" />
          <animateTransform attributeName="transform" type="translate"
            values="0 0; 0 -2; 0 0; -4 -1; 0 0"
            dur="4s" repeatCount="indefinite" begin="1.5s"/>
        </g>
        <g>
          <TinyDuck x={624} y={268} facing="right" />
          <animateTransform attributeName="transform" type="translate"
            values="0 0; 3 -1; 3 -3; 0 -2; 0 0"
            dur="6s" repeatCount="indefinite" begin="0.8s"/>
        </g>

        {/* Rabbit in bottom-center grass */}
        <g>
          <TinyRabbit x={456} y={648} />
          <animateTransform attributeName="transform" type="translate"
            values="0 0; 0 -2; 12 -2; 12 0; 12 -2; 0 -2; 0 0"
            keyTimes="0; 0.1; 0.3; 0.4; 0.5; 0.7; 1"
            dur="5s" repeatCount="indefinite" begin="2s"/>
        </g>

        {/* ── BUILDINGS ─────────────────────────────────────────────── */}
        {stops.map(stop => {
          const isHovered = hoveredId === stop.id;
          return (
            <g
              key={stop.id}
              style={{
                transform: `translateY(${isHovered ? -6 : 0}px)`,
                transition: 'transform 0.12s steps(2)',
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHoveredId(stop.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => travelTo(stop.id)}
            >
              <rect x={stop.x-48} y={stop.y+2} width={96} height={8} fill="rgba(0,0,0,0.4)"/>
              {isHovered && (
                <rect x={stop.x-52} y={stop.y-2} width={104} height={12} fill={stop.color} opacity={0.2}/>
              )}
              {stop.id==='start'     && <StartGate       cx={stop.x} cy={stop.y}/>}
              {stop.id==='school'    && <SchoolBuilding   cx={stop.x} cy={stop.y}/>}
              {stop.id==='library'   && <LibraryBuilding  cx={stop.x} cy={stop.y}/>}
              {stop.id==='groceries' && <GroceryBuilding  cx={stop.x} cy={stop.y}/>}
              {stop.id==='clothing'  && <ClothingBuilding cx={stop.x} cy={stop.y}/>}
              {stop.id==='bank'      && <BankBuilding     cx={stop.x} cy={stop.y}/>}
              <StopLabel cx={stop.x} cy={stop.y+22} name={stop.name} ages={stop.ages}/>
            </g>
          );
        })}

        {/* ── PEOPLE GROUPS (in front of buildings) ────────────────── */}
        {/* Family near Start / bottom-left grass */}
        <g>
          <PeopleGroup
            x={68} y={660}
            shirts={[UP.sunset, UP.sometimes, UP.pink]}
            hats={[UP.sunrise, undefined, undefined]}
            skins={['#E8B07A','#C68040','#F0C898']}
          />
          <animateTransform attributeName="transform" type="translate"
            values="0 0; 0 -1; 0 0" dur="2.2s" repeatCount="indefinite"/>
        </g>

        {/* Kids near school / bottom-right grass */}
        <g>
          <PeopleGroup
            x={870} y={660}
            shirts={[UP.pink, UP.sunrise, UP.sometimes]}
            skins={['#F0C898','#E8B07A','#C68040']}
          />
          <animateTransform attributeName="transform" type="translate"
            values="0 0; 0 -1; 0 0" dur="1.8s" repeatCount="indefinite"/>
        </g>

        {/* Shoppers near grocery / top-center grass */}
        <g>
          <PeopleGroup
            x={400} y={178}
            shirts={[UP.green_l, UP.sunset]}
            hats={[undefined, UP.sunrise]}
          />
          <animateTransform attributeName="transform" type="translate"
            values="0 0; 0 -1; 0 0" dur="2.6s" repeatCount="indefinite"/>
        </g>

        {/* Business figures near library / right grass */}
        <g>
          <PeopleGroup
            x={730} y={358}
            shirts={[UP.midnight, UP.blue]}
            hats={[UP.sunrise, undefined]}
            skins={['#E8B07A','#C68040']}
          />
          <animateTransform attributeName="transform" type="translate"
            values="0 0; 0 -1; 0 0" dur="3s" repeatCount="indefinite"/>
        </g>

        {/* Park spectators near soccer field */}
        <g>
          <PeopleGroup
            x={194} y={534}
            shirts={[UP.sunset, UP.green_l, UP.sometimes]}
            skins={['#C68040','#F0C898','#E8B07A']}
          />
          <animateTransform attributeName="transform" type="translate"
            values="0 0; 0 -1; 0 0" dur="1.5s" repeatCount="indefinite"/>
        </g>

        {/* Couple near bank / bottom-center grass */}
        <g>
          <PeopleGroup
            x={610} y={610}
            shirts={[UP.sometimes, UP.pink]}
            hats={[UP.sunrise, undefined]}
          />
          <animateTransform attributeName="transform" type="translate"
            values="0 0; 0 -1; 0 0" dur="2s" repeatCount="indefinite"/>
        </g>

        {/* ── UP DRIVER (rendered on top of buildings) ─────────────── */}
        <UpDriver
          cx={driverPos.x}
          cy={driverPos.y}
          direction={driverDir}
          isMoving={isMoving}
          onClick={travelToNext}
          rotation={driverRotation}
        />

        {/* ── STOP BADGES ────────────────────────────────────────────── */}
        {stops.map((stop, i) => {
          const off: Record<string,[number,number]> = {
            start:    [  52,-72], school:   [-56,-80],
            library:  [-56,-96], groceries:[  56,-72],
            clothing: [  56,-80], bank:     [  68,-108],
          };
          const [dx,dy] = off[stop.id] ?? [48,-72];
          return <StopBadge key={`b${stop.id}`} cx={stop.x+dx} cy={stop.y+dy} num={i+1} color={stop.color}/>;
        })}

        {/* ── HINT TEXT near driver ───────────────────────────────────── */}
        {!isMoving && (
          <g>
            <rect x={driverPos.x+26} y={driverPos.y-18} width={96} height={18} fill={UP.midnight} />
            <rect x={driverPos.x+24} y={driverPos.y-20} width={96} height={18} fill={UP.midnight_d} />
            <rect x={driverPos.x+26} y={driverPos.y-18} width={96} height={18} fill={UP.midnight} />
            <text x={driverPos.x+74} y={driverPos.y-7} textAnchor="middle" fill={UP.sunrise} fontSize={8} fontFamily="monospace">click me! →</text>
          </g>
        )}

        {/* ── MAP TITLE ─────────────────────────────────────────────── */}
        <rect x={12} y={12} width={4}   height={52} fill={UP.sunset}    />
        <rect x={16} y={12} width={208} height={52} fill={UP.midnight}  />
        <rect x={16} y={12} width={208} height={2}  fill={UP.midnight_d}/>
        <text x={26} y={33} fill={UP.sunset} fontSize={14} fontWeight="700" fontFamily="monospace" letterSpacing="1">UPTOWN</text>
        <text x={26} y={52} fill="rgba(255,255,255,0.6)" fontSize={11} fontFamily="monospace">Financial Roadmap</text>

        {/* ── LEGEND ────────────────────────────────────────────────── */}
        <rect x={12}  y={720} width={228} height={44} fill={UP.midnight} />
        <rect x={12}  y={720} width={4}   height={44} fill={UP.blue}     />
        <text x={24}  y={736} fill="rgba(255,255,255,0.35)" fontSize={8} fontWeight="700" fontFamily="monospace" letterSpacing="1">LEGEND</text>
        <rect x={24}  y={744} width={48} height={8}  fill={UP.blue}    />
        <rect x={24}  y={746} width={8}  height={4}  fill={UP.sunrise} />
        <rect x={40}  y={746} width={8}  height={4}  fill={UP.sunrise} />
        <rect x={56}  y={746} width={8}  height={4}  fill={UP.sunrise} />
        <text x={80}  y={753} fill="rgba(255,255,255,0.65)" fontSize={9} fontFamily="monospace">Main learning route</text>
      </svg>
    </div>
  );
}
