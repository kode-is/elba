/**
 * An MX-F style divider from the outside, for the product card: an inlet
 * block, three galvanised sections with an outlet either side, an end plate
 * and the red indicator pin. Static; DividerDemo.tsx shows the inside.
 */
export function DividerIcon({ className }: { className?: string }) {
  const sections = [44, 76, 108];
  return (
    <svg viewBox="0 0 180 110" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="divider-icon-steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eef1f4" />
          <stop offset="45%" stopColor="#c3cad2" />
          <stop offset="100%" stopColor="#8f98a3" />
        </linearGradient>
      </defs>
      {/* Indicator pin */}
      <rect x="148" y="49" width="16" height="10" rx="3" fill="#c11e31" />
      {/* Inlet */}
      <rect x="4" y="47" width="16" height="14" rx="2" fill="#7d8691" />
      <rect x="20" y="30" width="128" height="48" rx="5" fill="url(#divider-icon-steel)" stroke="#6f7882" strokeWidth="2" />
      {[40, 72, 104, 136].map((x) => (
        <line key={x} x1={x} y1="31" x2={x} y2="77" stroke="#6f7882" strokeWidth="1.5" />
      ))}
      {sections.map((x) => (
        <g key={x}>
          <rect x={x + 6} y="18" width="16" height="13" rx="2" fill="#9aa3ad" stroke="#6f7882" />
          <rect x={x + 6} y="77" width="16" height="13" rx="2" fill="#9aa3ad" stroke="#6f7882" />
          <circle cx={x + 14} cy="54" r="4" fill="#9aa3ad" />
        </g>
      ))}
    </svg>
  );
}
