// The drawing behind /anlegg's lubrication demo: a 50-tonne class crawler
// excavator (CAT 350 proportions — 6.9 m reach boom, 3.35 m stick, 5.4 m
// track, a large GP bucket) seen from its right side, with a simplified
// lubrication system on it: an EP-1 style pump in the front compartment, a
// main divider on the upper frame and a secondary divider on the boom.
// Everything is laid out in metres and solved as a real linkage — the bucket
// is driven by its cylinder through the idler and power links — then scaled
// into the SVG. The dig cycle (lib/smoremodell.ts) is fitted to the trench
// drawn here. LubricationDemo.tsx moves it.

import type { Pose } from "@/lib/smoremodell";
import { ILL } from "@/lib/illustrasjon";
import {
  at,
  BOOM,
  BOOM_CYL_BASE,
  BOOM_CYL_ROD,
  BUCKET_CYL_BASE,
  BUCKET_SCALE,
  FOOT,
  HEAP,
  heapAt,
  IDLER_PIN,
  solve,
  STICK,
  STICK_CYL_BASE,
  STICK_CYL_ROD,
  TRENCH,
  type Frame,
  type Pt,
  type Solved,
} from "@/lib/gravemaskin";

export type { Pt };

// Machine colours: a neutral technical render in light grey, so the
// lubrication system (black lines, amber grease) is what stands out. No
// manufacturer's livery.
const BODY = "#e6e4de";
const BODY_SHADE = "#cfccc4";
const BODY_DARK = "#b3b0a8";
const EDGE = "#85837c";
const IRON = "#55575a";
const IRON_DARK = "#36383b";
const TRACK = "#2c2d2f";
const GLASS = "#9fb4c4";
const ROD = "#f1f3f5";
const SOIL = ILL.soil;

// ---------------------------------------------------------------- geometry

/** Metres to drawing units, and where the slewing centre stands on the ground. */
const SCALE = 40;
const ORIGIN = { x: 170, y: 300 };
export const toSvg = (p: Pt): Pt => ({
  x: Math.round((ORIGIN.x + p.x * SCALE) * 100) / 100,
  y: Math.round((ORIGIN.y - p.y * SCALE) * 100) / 100,
});

const rad = (d: number) => (d * Math.PI) / 180;

// ------------------------------------------------- lubrication routing

type Local = { f: "house" | "boom" | "stick" | "head" | "link"; u: number; v: number };
const H = (u: number, v: number): Local => ({ f: "house", u, v });
const B = (u: number, v: number): Local => ({ f: "boom", u, v });
const S = (u: number, v: number): Local => ({ f: "stick", u, v });
const HEAD: Local = { f: "head", u: 0, v: 0 };
const LINK: Local = { f: "link", u: 0, v: 0 };

function place(m: Solved, p: Local): Pt {
  if (p.f === "house") return { x: p.u, y: p.v };
  if (p.f === "boom") return at(m.boom, p.u, p.v);
  if (p.f === "stick") return at(m.stick, p.u, p.v);
  return p.f === "head" ? m.head : m.link;
}

/** The main divider, on the upper frame under the boom foot; the secondary one on the side of the boom. */
const MAIN = { u0: 0.95, u1: 1.45, v0: 1.56, v1: 1.74 };
const SECONDARY = { u0: 5.3, u1: 5.8, v0: 0.4, v1: 0.58 };

/**
 * The thirteen lines (lib/smoremodell.ts LINES): 0-4 from the main divider to
 * its points, 5 from the main divider up the boom to the secondary, 6-12 from
 * the secondary to stick and bucket. Each ends at its lubrication point. The
 * runs follow the boom's flanges and cross every joint close to its pivot,
 * as hose would, so no line stretches as the machine moves.
 */
const ROUTES: Local[][] = [
  // Main divider
  [H(1.0, 1.56), H(1.0, 1.24), H(0.3, 1.24)], // Svingkrans
  [H(1.3, 1.56), H(1.3, 1.42), H(1.9, 1.42), H(BOOM_CYL_BASE.x, BOOM_CYL_BASE.y)], // Bomsylinder, fot
  [H(1.02, 1.74), H(1.02, 2.05), H(FOOT.x, FOOT.y)], // Bomfot
  [H(1.14, 1.74), H(1.14, 1.86), B(0.2, -0.2), B(0.6, -0.15), B(2.56, 0.56), B(BOOM_CYL_ROD.x, BOOM_CYL_ROD.y)], // Bomsylinder, stang
  [H(1.26, 1.74), H(1.26, 1.82), B(0.15, 0.1), B(0.56, 0.6), B(1.85, 1.1), B(2.85, 1.4), B(STICK_CYL_BASE.x, STICK_CYL_BASE.y)], // Stikkesylinder, fot
  [H(1.38, 1.74), H(1.38, 1.78), B(0.2, 0.0), B(0.6, 0.45), B(1.85, 0.95), B(3.2, 1.22), B(3.75, 1.17), B(SECONDARY.u0, 0.49)], // til sekundærfordeleren
  // Secondary divider
  [B(SECONDARY.u1, 0.49), B(6.6, 0.18), B(BOOM, 0)], // Bom/stikke-ledd
  [B(5.45, SECONDARY.v1), B(6.4, 0.36), B(6.75, 0.15), S(-0.2, 0.05), S(-0.75, 0.3), S(STICK_CYL_ROD.x, STICK_CYL_ROD.y)], // Stikkesylinder, stang
  [B(5.65, SECONDARY.v1), B(6.45, 0.3), B(6.8, 0.1), S(0.1, 0.18), S(-0.1, 0.45), S(BUCKET_CYL_BASE.x, BUCKET_CYL_BASE.y)], // Skuffesylinder, fot
  [B(5.4, SECONDARY.v0), B(6.5, 0.05), B(6.75, -0.1), S(0.15, 0.1), S(2.6, 0.12), S(IDLER_PIN.x, IDLER_PIN.y)], // Mellomlenke
  [B(5.52, SECONDARY.v0), B(6.55, 0.0), B(6.78, -0.14), S(0.15, 0.04), S(2.55, 0.07), S(2.83, 0.2), HEAD], // Lenkeledd
  [B(5.64, SECONDARY.v0), B(6.6, -0.05), B(6.8, -0.18), S(0.15, -0.02), S(2.5, 0.02), S(2.8, 0.16), HEAD, LINK], // Skuffelenke
  [B(5.76, SECONDARY.v0), B(6.62, -0.1), B(6.82, -0.22), S(0.15, -0.08), S(3.1, -0.08), S(STICK, 0)], // Skuffebolt
];

/** The lines in drawing units for a pose. */
export function routes(pose: Pose): Pt[][] {
  const m = solve(pose);
  return ROUTES.map((r) => r.map((p) => toSvg(place(m, p))));
}

/** Where the pump stands (bottom-left of its housing), in the open front compartment. */
const PUMP_M: Pt = { x: 0.22, y: 1.72 };
export const PUMP_AT = toSvg(PUMP_M);
/** Pump drawn at about 1.4× life size, so it reads at this scale. */
export const PUMP_SCALE = 0.3;
/** The pump's line from its outlet down to the main divider. */
export const FEED: Pt[] = [
  { x: 0.5, y: 1.78 },
  { x: 0.86, y: 1.78 },
  { x: 0.86, y: 1.65 },
  { x: MAIN.u0, y: 1.65 },
].map(toSvg);

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
      return {
        x: Math.round((points[i].x + (points[i + 1].x - points[i].x) * r) * 100) / 100,
        y: Math.round((points[i].y + (points[i + 1].y - points[i].y) * r) * 100) / 100,
      };
    }
    left -= lengths[i];
  }
  return points[points.length - 1];
}

// ---------------------------------------------------------------- drawing

const path = (pts: Pt[]) => polyline(pts.map(toSvg)) + " Z";

/** An outline through metre points in a frame: M, L, C, Q and Z commands. */
function shape(f: Frame, cmds: (string | number)[]) {
  let out = "";
  let i = 0;
  while (i < cmds.length) {
    const c = cmds[i++] as string;
    const n = c === "C" ? 3 : c === "Q" ? 2 : c === "Z" ? 0 : 1;
    const pts: string[] = [];
    for (let k = 0; k < n; k++) {
      const p = toSvg(at(f, cmds[i++] as number, cmds[i++] as number));
      pts.push(`${p.x} ${p.y}`);
    }
    out += `${c}${pts.join(" ")} `;
  }
  return out.trim();
}

const HOUSE: Frame = { o: { x: 0, y: 0 }, a: 0 };

function Pin({ p, r = 0.13 }: { p: Pt; r?: number }) {
  const s = toSvg(p);
  return (
    <g>
      <circle cx={s.x} cy={s.y} r={r * SCALE} fill={BODY_SHADE} stroke={EDGE} strokeWidth="1" />
      <circle cx={s.x} cy={s.y} r={r * SCALE * 0.45} fill={IRON} />
    </g>
  );
}

/** A hydraulic cylinder: barrel of fixed length from the base, chrome rod to the head. */
function Cylinder({ from, to, barrel, bore = 0.3 }: { from: Pt; to: Pt; barrel: number; bore?: number }) {
  const a = toSvg(from);
  const b = toSvg(to);
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  const reach = Math.min(barrel * SCALE, len - 6);
  const e = {
    x: Math.round((a.x + ((b.x - a.x) / len) * reach) * 100) / 100,
    y: Math.round((a.y + ((b.y - a.y) / len) * reach) * 100) / 100,
  };
  const w = bore * SCALE;
  return (
    <g strokeLinecap="round">
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#9aa0a6" strokeWidth={w * 0.48 + 1.5} />
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ROD} strokeWidth={w * 0.48} />
      <line x1={a.x} y1={a.y} x2={e.x} y2={e.y} stroke={EDGE} strokeWidth={w + 2} />
      <line x1={a.x} y1={a.y} x2={e.x} y2={e.y} stroke={BODY_SHADE} strokeWidth={w} />
      <line x1={a.x} y1={a.y} x2={e.x} y2={e.y} stroke={BODY} strokeWidth={w * 0.35} opacity="0.8" />
    </g>
  );
}

function Link({ from, to, width }: { from: Pt; to: Pt; width: number }) {
  const a = toSvg(from);
  const b = toSvg(to);
  return (
    <g strokeLinecap="round">
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={IRON_DARK} strokeWidth={width * SCALE + 2} />
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={IRON} strokeWidth={width * SCALE} />
    </g>
  );
}

/** Tracks, undercarriage and upper structure; none of it moves. */
export function Body() {
  const sprocket = toSvg({ x: -2.18, y: 0.57 });
  const idler = toSvg({ x: 2.2, y: 0.55 });
  const track = shape(HOUSE, ["M", -2.18, 1.13, "L", 2.2, 1.11, "Q", 2.78, 1.1, 2.76, 0.55, "Q", 2.74, 0.0, 2.2, 0.0, "L", -2.18, 0.0, "Q", -2.76, 0.0, -2.75, 0.57, "Q", -2.74, 1.13, -2.18, 1.13, "Z"]);
  return (
    <g strokeLinejoin="round">
      {/* Crawler track: shoes, track frame, rollers, idler and sprocket */}
      <path d={track} fill={TRACK} />
      <path d={track} fill="none" stroke="#1b1b1c" strokeWidth="5" strokeDasharray="5 2.2" />
      <path
        d={path([{ x: -1.85, y: 0.36 }, { x: 1.9, y: 0.36 }, { x: 2.05, y: 0.82 }, { x: 1.7, y: 0.98 }, { x: -1.7, y: 0.98 }, { x: -2.0, y: 0.82 }])}
        fill={IRON}
        stroke={IRON_DARK}
        strokeWidth="1"
      />
      <path d={path([{ x: -1.6, y: 0.62 }, { x: 1.62, y: 0.62 }, { x: 1.55, y: 0.78 }, { x: -1.55, y: 0.78 }])} fill={IRON_DARK} opacity="0.5" />
      {[-1.55, -1.1, -0.65, -0.2, 0.25, 0.7, 1.15, 1.6].map((x) => {
        const p = toSvg({ x, y: 0.22 });
        return <circle key={x} cx={p.x} cy={p.y} r={0.15 * SCALE} fill={IRON} stroke={IRON_DARK} strokeWidth="1" />;
      })}
      {[-0.8, 0.85].map((x) => {
        const p = toSvg({ x, y: 1.02 });
        return <circle key={x} cx={p.x} cy={p.y} r={0.09 * SCALE} fill={IRON} stroke={IRON_DARK} strokeWidth="1" />;
      })}
      <circle cx={idler.x} cy={idler.y} r={0.42 * SCALE} fill={IRON} stroke={IRON_DARK} strokeWidth="1.5" />
      <circle cx={idler.x} cy={idler.y} r={0.16 * SCALE} fill={IRON_DARK} />
      <circle cx={sprocket.x} cy={sprocket.y} r={0.44 * SCALE} fill={IRON} stroke={IRON_DARK} strokeWidth="3" strokeDasharray="4 3" />
      <circle cx={sprocket.x} cy={sprocket.y} r={0.24 * SCALE} fill={IRON_DARK} />
      {/* Car body and slewing ring */}
      <path d={path([{ x: -1.05, y: 1.1 }, { x: 1.05, y: 1.1 }, { x: 0.95, y: 1.36 }, { x: -0.95, y: 1.36 }])} fill={IRON_DARK} />

      {/* Cab, on the far (left) side: its glass shows above and behind the boom */}
      <path
        d={shape(HOUSE, ["M", -0.12, 1.72, "L", -0.12, 3.2, "Q", -0.11, 3.32, 0.02, 3.33, "L", 1.3, 3.33, "Q", 1.42, 3.32, 1.46, 3.2, "L", 1.72, 1.95, "L", 1.72, 1.72, "Z"])}
        fill={BODY_SHADE}
        stroke={EDGE}
        strokeWidth="1"
      />
      <path d={shape(HOUSE, ["M", 0.0, 2.05, "L", 0.0, 3.2, "L", 1.32, 3.2, "L", 1.58, 2.05, "Z"])} fill={GLASS} />
      <path d={shape(HOUSE, ["M", 0.62, 2.05, "L", 0.62, 3.2])} stroke={IRON_DARK} strokeWidth="2.5" />
      <path d={shape(HOUSE, ["M", 0.12, 3.1, "L", 0.42, 3.1, "L", 0.12, 2.6, "Z"])} fill="#ffffff" opacity="0.35" />

      {/* Upper frame */}
      <path d={path([{ x: -3.5, y: 1.36 }, { x: 2.08, y: 1.36 }, { x: 2.08, y: 1.62 }, { x: -3.5, y: 1.62 }])} fill={IRON} />
      {/* Upper structure: counterweight, engine and front compartment as one body, with panel lines */}
      <rect x={toSvg({ x: -3.6, y: 2.8 }).x} y={toSvg({ x: -3.6, y: 2.8 }).y} width={(0.78 + 3.6) * SCALE} height={(2.8 - 1.6) * SCALE} rx="3" fill={BODY} stroke={EDGE} strokeWidth="1.2" />
      {[-1.85, -0.2].map((x) => (
        <path key={x} d={shape(HOUSE, ["M", x, 1.62, "L", x, 2.78])} stroke={EDGE} strokeWidth="1" opacity="0.7" />
      ))}
      <path d={shape(HOUSE, ["M", -3.58, 2.52, "L", -1.85, 2.52])} stroke={BODY_SHADE} strokeWidth="2" />
      {[1.9, 2.04, 2.18, 2.32].map((y) => (
        <path key={y} d={shape(HOUSE, ["M", -1.55, y, "L", -0.6, y])} stroke={BODY_DARK} strokeWidth="2" strokeLinecap="round" />
      ))}
      {/* A thin ELBA-red stripe along the bottom of the body */}
      <path d={path([{ x: -3.6, y: 1.66 }, { x: 0.78, y: 1.66 }, { x: 0.78, y: 1.72 }, { x: -3.6, y: 1.72 }])} fill={ILL.brand} />
      {/* Handrails on top */}
      <path d={shape(HOUSE, ["M", -3.3, 2.8, "L", -3.3, 3.12, "L", -0.3, 3.12, "L", -0.3, 2.8])} fill="none" stroke={IRON_DARK} strokeWidth="1.5" />
      <path d={shape(HOUSE, ["M", -1.8, 2.8, "L", -1.8, 3.12])} stroke={IRON_DARK} strokeWidth="1.5" />
      {/* A small ELBA wordmark on the counterweight */}
      {(() => {
        const tl = toSvg({ x: -3.36, y: 2.33 });
        const w = 0.95 * SCALE;
        return (
          <svg x={tl.x} y={tl.y} width={w} height={Math.round(((w * 117.1) / 399.5) * 100) / 100} viewBox="105.79 241.45 399.5 117.1" aria-hidden="true">
            <image href="/logos/elba-logo.svg" width="600" height="600" opacity="0.9" />
          </svg>
        );
      })()}
      {/* The front compartment's hatch, open on the pump */}
      <path d={path([{ x: 0.1, y: 1.66 }, { x: 0.72, y: 1.66 }, { x: 0.72, y: 2.34 }, { x: 0.1, y: 2.34 }])} fill={IRON} stroke={IRON_DARK} strokeWidth="1" />
      {/* Front of the upper frame: boom foot plates and the boom cylinder mount */}
      <path d={path([{ x: 0.78, y: 1.6 }, { x: 0.86, y: 2.3 }, { x: 1.52, y: 2.34 }, { x: 1.85, y: 1.62 }])} fill={IRON} stroke={IRON_DARK} strokeWidth="1" />
      <path d={path([{ x: 1.7, y: 1.36 }, { x: 2.24, y: 1.36 }, { x: 2.2, y: 1.66 }, { x: 1.78, y: 1.7 }])} fill={IRON} stroke={IRON_DARK} strokeWidth="1" />
      {/* Step at the front corner */}
      <path d={shape(HOUSE, ["M", 0.6, 1.36, "L", 0.6, 1.15, "L", 0.82, 1.15])} fill="none" stroke={IRON_DARK} strokeWidth="2" />
    </g>
  );
}

/** Boom, stick, linkage and bucket, with their cylinders, for a pose. */
export function Arm({ pose }: { pose: Pose }) {
  const m = solve(pose);
  return (
    <g strokeLinejoin="round">
      {/* Boom: box section, deepest at the knee */}
      <path
        d={shape(m.boom, ["M", -0.28, 0.32, "Q", 0.9, 1.05, 2.95, 1.56, "Q", 3.35, 1.62, 3.7, 1.42, "L", 6.95, 0.34, "Q", 7.3, 0.2, 7.25, -0.08, "Q", 7.15, -0.36, 6.85, -0.32, "L", 3.55, 0.62, "Q", 3.2, 0.7, 2.9, 0.58, "L", 0.35, -0.34, "Q", -0.3, -0.45, -0.38, 0.0, "Z"])}
        fill={BODY}
        stroke={EDGE}
        strokeWidth="1.2"
      />
      {/* An ELBA-red pinstripe along the side of the boom */}
      <path d={shape(m.boom, ["M", 0.4, 0.2, "Q", 1.5, 0.75, 3.0, 1.18, "L", 6.6, 0.12])} fill="none" stroke={ILL.brand} strokeWidth="1.6" />
      {/* Brackets, welded to the flanges: boom cylinder rod end below, stick cylinder head on top */}
      <path d={shape(m.boom, ["M", 2.62, 0.5, "L", 3.0, 0.1, "L", 3.38, 0.64, "Q", 3.0, 0.68, 2.62, 0.5, "Z"])} fill={BODY_SHADE} stroke={EDGE} strokeWidth="1" />
      <path d={shape(m.boom, ["M", 2.75, 1.52, "L", 3.15, 2.2, "L", 3.56, 1.5, "Q", 3.15, 1.6, 2.75, 1.52, "Z"])} fill={BODY_SHADE} stroke={EDGE} strokeWidth="1" />
      {/* Boom cylinder: the right-hand one of the pair, in front of the boom */}
      <Cylinder from={BOOM_CYL_BASE} to={at(m.boom, BOOM_CYL_ROD.x, BOOM_CYL_ROD.y)} barrel={1.8} bore={0.34} />
      <Cylinder from={at(m.boom, STICK_CYL_BASE.x, STICK_CYL_BASE.y)} to={at(m.stick, STICK_CYL_ROD.x, STICK_CYL_ROD.y)} barrel={2.8} bore={0.3} />
      {/* Stick */}
      <path
        d={shape(m.stick, ["M", -1.0, -0.3, "Q", -1.22, 0.0, -1.18, 0.3, "Q", -1.14, 0.56, -0.9, 0.58, "Q", -0.4, 0.58, 0.25, 0.44, "L", 2.95, 0.24, "Q", 3.4, 0.2, 3.5, 0.06, "Q", 3.52, -0.14, 3.3, -0.17, "L", 0.45, -0.4, "Q", -0.4, -0.5, -0.75, -0.42, "Z"])}
        fill={BODY}
        stroke={EDGE}
        strokeWidth="1.2"
      />
      <path d={shape(m.stick, ["M", 0.3, 0.02, "L", 3.0, -0.02])} stroke={BODY_SHADE} strokeWidth="2.5" />
      <path d={shape(m.stick, ["M", -0.42, 0.42, "L", -0.22, 0.72, "L", 0.05, 0.44, "Z"])} fill={BODY_SHADE} stroke={EDGE} strokeWidth="1" />
      <Cylinder from={at(m.stick, BUCKET_CYL_BASE.x, BUCKET_CYL_BASE.y)} to={m.head} barrel={2.15} bore={0.26} />
      <Bucket m={m} />
      {/* Idler link (stick to cylinder head) and power link (cylinder head to bucket) */}
      <Link from={m.idler} to={m.head} width={0.16} />
      <Link from={m.head} to={m.link} width={0.2} />
      {[FOOT, m.tip, at(m.boom, BOOM_CYL_ROD.x, BOOM_CYL_ROD.y), at(m.boom, STICK_CYL_BASE.x, STICK_CYL_BASE.y), BOOM_CYL_BASE].map((p, i) => (
        <Pin key={`a${i}`} p={p} r={i < 2 ? 0.2 : 0.12} />
      ))}
      {[at(m.stick, STICK_CYL_ROD.x, STICK_CYL_ROD.y), at(m.stick, BUCKET_CYL_BASE.x, BUCKET_CYL_BASE.y), m.idler, m.head, m.link, m.pin].map((p, i) => (
        <Pin key={`b${i}`} p={p} r={i === 5 ? 0.16 : 0.11} />
      ))}
    </g>
  );
}

/**
 * A large GP bucket in profile (outline in lib/gravemaskin.ts): main pin at
 * the origin, power-link pin along +u, the body below. The mouth is raked
 * forward, so the cutting edge and tooth sit well ahead of the top lip, with
 * a long flat floor and one large radius round the back up to the ears.
 */
function Bucket({ m }: { m: Solved }) {
  const f = m.bucket;
  const k = BUCKET_SCALE;
  const p = (u: number, v: number) => toSvg(at(f, u * k, v * k));
  const P = (u: number, v: number) => {
    const q = p(u, v);
    return `${q.x} ${q.y}`;
  };
  // Side plate: top plate, wrapper (one smooth curve), floor, lip, and the
  // front edge curving in towards the back on its way up.
  const side = `M${P(-0.55, -0.3)} L${P(0.8, -0.22)} C${P(1.08, -0.3)} ${P(1.16, -0.9)} ${P(0.98, -1.32)} C${P(0.82, -1.68)} ${P(0.5, -1.83)} ${P(0.2, -1.83)} L${P(-1.0, -1.79)} L${P(-1.05, -1.66)} C${P(-0.62, -1.27)} ${P(-0.46, -0.83)} ${P(-0.55, -0.3)} Z`;
  return (
    <g strokeLinejoin="round">
      <path d={side} fill={BODY_SHADE} stroke={EDGE} strokeWidth="1.2" />
      {/* Side cutter along the lower mouth edge, top lip reinforcement */}
      <path d={`M${P(-0.56, -1.03)} C${P(-0.64, -1.25)} ${P(-0.78, -1.45)} ${P(-0.98, -1.62)}`} fill="none" stroke={BODY_DARK} strokeWidth="4" strokeLinecap="round" />
      <path d={`M${P(-0.55, -0.3)} L${P(0.1, -0.27)} L${P(0.1, -0.38)} L${P(-0.6, -0.42)} Z`} fill={BODY_DARK} />
      {/* Wear straps across the wrapper */}
      {[
        [1.08, -0.7, 0.94, -0.72],
        [1.0, -1.12, 0.87, -1.08],
        [0.62, -1.7, 0.56, -1.56],
      ].map(([u0, v0, u1, v1], i) => (
        <path key={i} d={`M${P(u0, v0)} L${P(u1, v1)}`} stroke={BODY_DARK} strokeWidth="3" strokeLinecap="round" />
      ))}
      {/* Ears carrying the two pins */}
      <path
        d={(() => {
          const q = (u: number, v: number) => {
            const r = toSvg(at(f, u, v));
            return `${r.x} ${r.y}`;
          };
          return `M${q(-0.24, -0.25)} Q${q(-0.26, 0.17)} ${q(0.0, 0.17)} L${q(0.52, 0.15)} Q${q(0.74, 0.14)} ${q(0.76, -0.22)} Z`;
        })()}
        fill={BODY_DARK}
        stroke={EDGE}
        strokeWidth="1"
      />
      {/* Cutting edge, adapter and tooth */}
      <path d={`M${P(0.2, -1.83)} L${P(-1.0, -1.79)} L${P(-1.05, -1.66)} L${P(0.1, -1.72)} Z`} fill={IRON} />
      <path d={`M${P(-0.98, -1.64)} L${P(-1.25, -1.69)} L${P(-1.45, -1.76)} L${P(-1.27, -1.81)} L${P(-0.98, -1.8)} Z`} fill={IRON_DARK} />
    </g>
  );
}

/**
 * Soil in the bucket, heaped above the mouth, for a load of 0-1; while the
 * bucket empties, clumps fall from the mouth onto the heap below.
 */
export function Load({ pose, load, emptying }: { pose: Pose; load: number; emptying: number }) {
  const m = solve(pose);
  const f = m.bucket;
  const k = BUCKET_SCALE;
  const p = (u: number, v: number) => toSvg(at(f, u * k, v * k));
  const P = (u: number, v: number) => {
    const q = p(u, v);
    return `${q.x} ${q.y}`;
  };
  const bulge = 0.12 + 0.38 * load;
  const mouth = p(-0.7, -1.1);
  const lip = at(f, -0.7 * k, -1.1 * k);
  const below = toSvg({ x: lip.x, y: heapAt(lip.x) });
  return (
    <g>
      {load > 0.02 ? (
        <path
          d={`M${P(-0.55, -0.3)} Q${P(-0.78 - bulge, -0.6)} ${P(-0.8 - bulge * 0.9, -1.0)} Q${P(-1.0 - bulge * 0.6, -1.45)} ${P(-1.03, -1.62)} L${P(-0.77, -1.34)} L${P(-0.6, -1.03)} L${P(-0.53, -0.68)} Z`}
          fill={SOIL}
          opacity={Math.min(1, load * 1.5)}
        />
      ) : null}
      {emptying > 0 && emptying < 1
        ? [0, 0.18, 0.36, 0.54, 0.72].map((lag, i) => {
            const fall = (emptying + lag) % 1;
            const x = Math.round((mouth.x + (i - 2) * 4 + (below.x - mouth.x) * fall) * 10) / 10;
            const y = Math.round((mouth.y + (below.y - mouth.y) * fall * fall) * 10) / 10;
            return <ellipse key={i} cx={x} cy={y} rx={5.5 - i * 0.5} ry={4.5 - i * 0.4} fill={SOIL} />;
          })
        : null}
    </g>
  );
}

/**
 * The EP-1 style pump: black housing, transparent reservoir with grease and
 * an agitator blade. `level` is the reservoir fill (0-1), `stir` turns the
 * blade (degrees), `running` lights the lamp. (x, y) is the housing's
 * bottom-left corner; `scale` 1 is 40 × 80 drawing units.
 */
export function Pump({ x, y, level, stir, running, scale = PUMP_SCALE }: { x: number; y: number; level: number; stir: number; running: boolean; scale?: number }) {
  const blade = Math.round(Math.abs(Math.cos(rad(stir))) * 1000) / 1000;
  const inner = 44;
  const top = 6;
  const fillTop = top + inner * (1 - level);
  return (
    <g transform={`translate(${x} ${Math.round((y - 80 * scale) * 100) / 100}) scale(${scale})`}>
      <rect x="4" y={top} width="32" height={inner} rx="5" fill="#eef3f8" />
      <rect x="5" y={fillTop} width="30" height={top + inner - fillTop} rx="4" fill={ILL.grease} />
      <rect x="5" y={fillTop} width="30" height="3" rx="1.5" fill={ILL.greaseLight} />
      <rect x={20 - 13 * blade} y={top + 10} width={Math.max(2, 26 * blade)} height="30" rx="2" fill="#ffffff" opacity="0.35" />
      <line x1="20" y1={top} x2="20" y2={top + inner} stroke="#5a5a5a" strokeWidth="1.5" opacity="0.5" />
      <rect x="4" y={top} width="32" height={inner} rx="5" fill="none" stroke={ILL.steelMid} strokeWidth="1.5" />
      <rect x="9" y={top + 4} width="4" height={inner - 10} rx="2" fill="#ffffff" opacity="0.7" />
      <rect x="2" y="0" width="36" height="8" rx="3" fill="#1d1d1d" />
      <rect x="0" y={top + inner} width="40" height="30" rx="4" fill="#1d1d1d" />
      <rect x="6" y={top + inner + 8} width="18" height="3" rx="1.5" fill="#6b6b6b" />
      <rect x="6" y={top + inner + 15} width="12" height="3" rx="1.5" fill="#6b6b6b" />
      <circle cx="32" cy={top + inner + 10} r="3" fill={running ? ILL.brand : "#4a4a4a"} />
    </g>
  );
}

/** The two dividers, drawn plainly: a galvanised block that warms up while it delivers. */
export function Dividers({ pose, main, secondary }: { pose: Pose; main: boolean; secondary: boolean }) {
  const m = solve(pose);
  const block = (f: Frame, r: typeof MAIN) => shape(f, ["M", r.u0, r.v0, "L", r.u1, r.v0, "L", r.u1, r.v1, "L", r.u0, r.v1, "Z"]);
  return (
    <g>
      {[
        { d: block(HOUSE, MAIN), on: main },
        { d: block(m.boom, SECONDARY), on: secondary },
      ].map((b, i) => (
        <path
          key={i}
          d={b.d}
          fill={b.on ? ILL.greaseLight : ILL.steel}
          stroke={b.on ? ILL.greaseDark : ILL.steelDark}
          strokeWidth="1.5"
          className="transition-[fill,stroke] duration-300"
        />
      ))}
    </g>
  );
}

/** A grease gun at a point, for the manual round. */
export function GreaseGun({ at: p }: { at: Pt }) {
  return (
    <g transform={`translate(${p.x} ${p.y}) rotate(-35) scale(0.7)`}>
      <rect x="6" y="-5" width="10" height="10" rx="2" fill="#1d1d1d" />
      <rect x="16" y="-8" width="40" height="16" rx="7" fill={ILL.brand} />
      <rect x="20" y="8" width="4" height="16" rx="2" fill="#1d1d1d" transform="rotate(20 22 8)" />
      <line x1="0" y1="0" x2="8" y2="0" stroke="#1d1d1d" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

/**
 * The ground: flat in front of the tracks (where the bucket rests for
 * greasing), the trench the dig cycle itself carves (lib/gravemaskin.ts
 * TRENCH) and the spoil heap the bucket empties on.
 */
function groundPath() {
  const pts: Pt[] = [{ x: -6, y: 0 }, ...TRENCH.map(([x, y]) => ({ x, y }))];
  const n = 24;
  for (let i = 0; i <= n; i++) {
    const x = HEAP.centre - HEAP.half + (2 * HEAP.half * i) / n;
    pts.push({ x, y: heapAt(x) });
  }
  pts.push({ x: 20, y: 0 });
  return polyline(pts.map(toSvg));
}
const SURFACE = groundPath();
export const GROUND = {
  surface: SURFACE,
  fill: `${SURFACE} L${toSvg({ x: 20, y: -4 }).x} ${toSvg({ x: 20, y: -4 }).y} L${toSvg({ x: -6, y: -4 }).x} ${toSvg({ x: -6, y: -4 }).y} Z`,
};
