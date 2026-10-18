// The drawing behind /anlegg's lubrication demo: an excavator in the site's
// pale line style, with the lubrication system on it in colour — an EP-1
// style pump (black housing, transparent reservoir, agitator blade) and an
// MX-F style progressive distributor (galvanised sections, indicator pin).
// Pure SVG pieces; LubricationDemo.tsx moves them.

import type { Pose } from "@/lib/smoremodell";

export type Pt = { x: number; y: number };
type Frame = "house" | "boom" | "stick" | "bucket";
type Local = { frame: Frame; x: number; y: number };

export const GREASE = "#e9a23b";
export const GREASE_DARK = "#b9741c";
export const LINE = "#3a3a3a";
const BODY = "#ffffff";
const EDGE = "#cfcfcf";
const SOFT = "#e0e0e0";

/** Boom foot, in the house (world) frame; the boom pivots here. */
const FOOT: Pt = { x: 318, y: 262 };
/** Boom tip (stick pivot), in the boom frame. */
const TIP: Pt = { x: 215, y: -80 };
/** Bucket pin, in the stick frame. */
const PIN: Pt = { x: 40, y: 130 };

const rad = (deg: number) => (deg * Math.PI) / 180;
function rotate(p: Pt, deg: number): Pt {
  const c = Math.cos(rad(deg));
  const s = Math.sin(rad(deg));
  return { x: p.x * c - p.y * s, y: p.x * s + p.y * c };
}
const add = (a: Pt, b: Pt): Pt => ({ x: a.x + b.x, y: a.y + b.y });
// Rounded, so the server's and the browser's trigonometry render the same markup.
const round = (p: Pt): Pt => ({ x: Math.round(p.x * 100) / 100, y: Math.round(p.y * 100) / 100 });

/** Turns a point in any of the machine's frames into drawing coordinates for a pose. */
export function toWorld(pose: Pose, p: Local): Pt {
  return round(frameToWorld(pose, p));
}

function frameToWorld(pose: Pose, p: Local): Pt {
  if (p.frame === "house") return { x: p.x, y: p.y };
  const boomAt = (q: Pt) => add(FOOT, rotate(q, pose.boom));
  if (p.frame === "boom") return boomAt(p);
  const tip = boomAt(TIP);
  const stickAt = (q: Pt) => add(tip, rotate(q, pose.boom + pose.stick));
  if (p.frame === "stick") return stickAt(p);
  return add(stickAt(PIN), rotate(p, pose.boom + pose.stick + pose.bucket));
}

const h = (x: number, y: number): Local => ({ frame: "house", x, y });
const b = (x: number, y: number): Local => ({ frame: "boom", x, y });
const s = (x: number, y: number): Local => ({ frame: "stick", x, y });
const k = (x: number, y: number): Local => ({ frame: "bucket", x, y });

// The MX-F: an inlet block, three sections with an outlet on top and one
// underneath, and an end plate with the indicator pin.
export const MXF = { x: 180, y: 258, w: 68, h: 24 };
const SECTION_X = [202, 218, 234];

/**
 * The six lines, in the order the MX-F serves them (lib/sentralsmoring.ts
 * LUBE_POINTS): from an outlet, along the house and up the boom, to the
 * point. The last waypoint is the lubrication point itself.
 */
export const ROUTES: Local[][] = [
  // 1 Skuffebolt: top of section 1, along the top of the boom and down the stick.
  [h(202, 258), h(202, 244), h(304, 244), b(-10, -18), b(104, -110), b(206, -90), s(4, -2), s(44, 116), s(PIN.x, PIN.y)],
  // 2 Svingkrans: underneath section 1, down to the slewing ring.
  [h(202, 282), h(202, 312), h(250, 312)],
  // 3 Bom/stikke-ledd: top of section 2, along the boom to its tip.
  [h(218, 258), h(218, 248), h(306, 248), b(-4, -12), b(110, -116), b(TIP.x, TIP.y)],
  // 4 Bomsylinder, fot: underneath section 2, to the cylinder's base.
  [h(218, 282), h(218, 296), h(296, 296), h(300, 292)],
  // 5 Bomsylinder, stang: top of section 3, along the boom's underside.
  [h(234, 258), h(234, 252), h(308, 252), b(4, 2), b(76, -44)],
  // 6 Bomfot: underneath section 3, round the end of the block.
  [h(234, 282), h(234, 288), h(268, 288), h(268, 262), h(FOOT.x, FOOT.y)],
];

/** The pump's line to the MX-F inlet. */
export const FEED: Pt[] = [
  { x: 168, y: 226 },
  { x: 160, y: 226 },
  { x: 160, y: 270 },
  { x: 180, y: 270 },
];

export function polyline(points: Pt[]) {
  return points.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
}

/** The point a fraction `f` of the way along a polyline. */
export function along(points: Pt[], f: number): Pt {
  const lengths = points.slice(1).map((p, i) => Math.hypot(p.x - points[i].x, p.y - points[i].y));
  let left = lengths.reduce((a, l) => a + l, 0) * f;
  for (let i = 0; i < lengths.length; i++) {
    if (left <= lengths[i] || i === lengths.length - 1) {
      const r = lengths[i] ? Math.min(1, left / lengths[i]) : 0;
      return round({ x: points[i].x + (points[i + 1].x - points[i].x) * r, y: points[i].y + (points[i + 1].y - points[i].y) * r });
    }
    left -= lengths[i];
  }
  return points[points.length - 1];
}

export const routeAt = (pose: Pose, i: number) => ROUTES[i].map((p) => toWorld(pose, p));

const shape = (pose: Pose, pts: Local[]) => polyline(pts.map((p) => toWorld(pose, p))) + " Z";

/** A hydraulic cylinder: polished rod, and a barrel of fixed length from the base. */
function Cylinder({ from, to, barrel }: { from: Pt; to: Pt; barrel: number }) {
  const len = Math.hypot(to.x - from.x, to.y - from.y) || 1;
  const end = round({ x: from.x + ((to.x - from.x) / len) * barrel, y: from.y + ((to.y - from.y) / len) * barrel });
  return (
    <g strokeLinecap="round">
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#9a9a9a" strokeWidth="6" />
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#e9e9e9" strokeWidth="3" />
      <line x1={from.x} y1={from.y} x2={end.x} y2={end.y} stroke={EDGE} strokeWidth="14" />
      <line x1={from.x} y1={from.y} x2={end.x} y2={end.y} stroke={BODY} strokeWidth="11" />
      <circle cx={from.x} cy={from.y} r="4" fill={SOFT} />
      <circle cx={to.x} cy={to.y} r="4" fill={SOFT} />
    </g>
  );
}

/** The excavator's tracks and house; nothing here moves. */
export function Undercarriage() {
  return (
    <g>
      {/* Tracks */}
      <rect x="118" y="320" width="292" height="42" rx="21" fill={BODY} stroke={EDGE} strokeWidth="2" />
      <rect x="126" y="326" width="276" height="30" rx="15" fill="none" stroke={SOFT} strokeWidth="2" strokeDasharray="7 5" />
      <circle cx="140" cy="341" r="15" fill={BODY} stroke={EDGE} strokeWidth="2" />
      <circle cx="388" cy="341" r="15" fill={BODY} stroke={EDGE} strokeWidth="2" />
      {[186, 232, 278, 324].map((x) => (
        <circle key={x} cx={x} cy="343" r="8" fill={BODY} stroke={EDGE} strokeWidth="2" />
      ))}
      {/* Slewing ring */}
      <rect x="196" y="306" width="140" height="15" rx="4" fill="#f5f2ef" stroke={EDGE} strokeWidth="2" />
      {/* Counterweight, engine hood, cab */}
      <path d="M96 304 V262 Q96 238 122 236 H152 V304 Z" fill="#f2f2f2" stroke={EDGE} strokeWidth="2" />
      <rect x="150" y="232" width="92" height="72" rx="4" fill={BODY} stroke={EDGE} strokeWidth="2" />
      {[164, 176, 188].map((y) => (
        <line key={y} x1="104" y1={y + 92} x2="142" y2={y + 92} stroke={SOFT} strokeWidth="2" strokeLinecap="round" />
      ))}
      <path d="M240 304 V160 Q240 150 250 150 H292 Q300 150 302 158 L318 236 H340 V304 Z" fill={BODY} stroke={EDGE} strokeWidth="2" />
      <path d="M250 162 H290 L304 230 H250 Z" fill="#e8edf3" stroke={EDGE} strokeWidth="1.5" />
      <line x1="96" y1="304" x2="340" y2="304" stroke={EDGE} strokeWidth="2" />
    </g>
  );
}

/** Boom, stick, bucket and their cylinders, for a pose. */
export function Arm({ pose }: { pose: Pose }) {
  const w = (p: Local) => toWorld(pose, p);
  return (
    <g>
      <Cylinder from={w(h(300, 292))} to={w(b(76, -44))} barrel={58} />
      <path
        d={shape(pose, [b(-14, -10), b(102, -120), b(118, -124), b(224, -96), b(230, -74), b(216, -64), b(116, -90), b(10, 16)])}
        fill={BODY}
        stroke={EDGE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <Cylinder from={w(b(96, -126))} to={w(s(-24, -46))} barrel={64} />
      <path
        d={shape(pose, [s(-34, -44), s(-16, -54), s(14, -6), s(54, 124), s(38, 142), s(22, 132), s(-10, 10)])}
        fill={BODY}
        stroke={EDGE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <Cylinder from={w(s(8, -16))} to={w(k(24, -14))} barrel={52} />
      <path
        d={(() => {
          const p = (x: number, y: number) => w(k(x, y));
          const a = p(-6, -8);
          const c1 = p(54, 18);
          const e1 = p(34, 58);
          const c2 = p(18, 68);
          const e2 = p(-6, 62);
          const t1 = p(-18, 68);
          const t2 = p(-12, 56);
          const c3 = p(-18, 24);
          const l = p(24, -14);
          return `M${a.x} ${a.y} L${l.x} ${l.y} Q${c1.x} ${c1.y} ${e1.x} ${e1.y} Q${c2.x} ${c2.y} ${e2.x} ${e2.y} L${t1.x} ${t1.y} L${t2.x} ${t2.y} Q${c3.x} ${c3.y} ${a.x} ${a.y} Z`;
        })()}
        fill="#f2f2f2"
        stroke={EDGE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Pivot pins */}
      {[w(h(FOOT.x, FOOT.y)), w(b(TIP.x, TIP.y)), w(s(PIN.x, PIN.y))].map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="6" fill={SOFT} stroke={EDGE} strokeWidth="1.5" />
      ))}
    </g>
  );
}

/**
 * The EP-1 style pump on the engine hood. `level` is the reservoir fill
 * (0-1); `stir` turns the agitator blade (an angle in degrees); `running`
 * lights the pump's lamp.
 */
export function Pump({ x, y, level, stir, running }: { x: number; y: number; level: number; stir: number; running: boolean }) {
  const top = y + 6;
  const inner = 44;
  const fillTop = top + inner * (1 - level);
  const blade = Math.round(Math.abs(Math.cos(rad(stir))) * 1000) / 1000;
  return (
    <g>
      {/* Reservoir, lid */}
      <rect x={x + 4} y={top} width="32" height={inner} rx="5" fill="#eef3f8" />
      <rect x={x + 5} y={fillTop} width="30" height={top + inner - fillTop} rx="4" fill={GREASE} />
      <rect x={x + 5} y={fillTop} width="30" height="3" rx="1.5" fill="#f6c46f" />
      <rect x={x + 20 - 13 * blade} y={top + 10} width={Math.max(2, 26 * blade)} height="30" rx="2" fill="#ffffff" opacity="0.35" />
      <line x1={x + 20} y1={top} x2={x + 20} y2={top + inner} stroke="#5a5a5a" strokeWidth="1.5" opacity="0.5" />
      <rect x={x + 4} y={top} width="32" height={inner} rx="5" fill="none" stroke="#9aa3ad" strokeWidth="1.5" />
      <rect x={x + 9} y={top + 4} width="4" height={inner - 10} rx="2" fill="#ffffff" opacity="0.7" />
      <rect x={x + 2} y={y} width="36" height="8" rx="3" fill="#1d1d1d" />
      {/* Pump housing */}
      <rect x={x} y={top + inner} width="40" height="24" rx="4" fill="#1d1d1d" />
      <rect x={x + 6} y={top + inner + 7} width="18" height="3" rx="1.5" fill="#6b6b6b" />
      <rect x={x + 6} y={top + inner + 13} width="12" height="3" rx="1.5" fill="#6b6b6b" />
      <circle cx={x + 32} cy={top + inner + 9} r="3" fill={running ? "#c11e31" : "#4a4a4a"} />
    </g>
  );
}

/**
 * The MX-F style distributor: galvanised sections between an inlet block and
 * an end plate. `active` is the outlet (0-5) delivering now; `pin` is how far
 * the indicator pin stands out (0-1).
 */
export function Distributor({ active, pin }: { active: number | null; pin: number }) {
  const { x, y, w, h: hh } = MXF;
  return (
    <g>
      <defs>
        <linearGradient id="mxf-steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eef1f4" />
          <stop offset="45%" stopColor="#c3cad2" />
          <stop offset="100%" stopColor="#8f98a3" />
        </linearGradient>
      </defs>
      {/* Indicator pin */}
      <rect x={x + w - 2} y={y + hh / 2 - 2.5} width={5 + 9 * pin} height="5" rx="2" fill="#c11e31" />
      <rect x={x} y={y} width={w} height={hh} rx="3" fill="url(#mxf-steel)" stroke="#7d8691" strokeWidth="1.5" />
      {[194, 210, 226, 242].map((sx) => (
        <line key={sx} x1={sx} y1={y + 1} x2={sx} y2={y + hh - 1} stroke="#7d8691" strokeWidth="1.2" />
      ))}
      {SECTION_X.flatMap((sx, si) =>
        [y - 3, y + hh - 1].map((oy, side) => {
          const outlet = si * 2 + side;
          return (
            <rect
              key={`${sx}-${side}`}
              x={sx - 4}
              y={oy}
              width="8"
              height="4"
              rx="1"
              fill={active === outlet ? GREASE : "#7d8691"}
            />
          );
        }),
      )}
      <circle cx={x + 7} cy={y + hh / 2} r="3" fill="#7d8691" />
    </g>
  );
}

/** A grease gun at a point, for the manual round. */
export function GreaseGun({ at }: { at: Pt }) {
  return (
    <g transform={`translate(${at.x} ${at.y}) rotate(-35)`}>
      <rect x="6" y="-5" width="10" height="10" rx="2" fill="#1d1d1d" />
      <rect x="16" y="-8" width="40" height="16" rx="7" fill="#c11e31" />
      <rect x="20" y="8" width="4" height="16" rx="2" fill="#1d1d1d" transform="rotate(20 22 8)" />
      <line x1="0" y1="0" x2="8" y2="0" stroke="#1d1d1d" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}
