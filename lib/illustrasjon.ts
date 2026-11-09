// Colours for the drawn illustrations on /anlegg (the excavator, the divider
// cutaway, the grease chart and the pin section). SVG presentation
// attributes cannot read CSS variables reliably, so the drawings take their
// colours from here; the values that are also site tokens (app/globals.css)
// are the same hex.
//
// Grease is the one illustration hue the brand has no token for: an amber
// that reads as grease against the grey machine and is distinct from ELBA red,
// which the drawings keep for ELBA's own curve and for faults. It is also in
// @theme as --color-grease so HTML next to the drawings can match it.

export const ILL = {
  // Site tokens
  brand: "#c11e31",
  brandSoft: "#ffb6c1",
  surface: "#f5f2ef",
  inkMuted: "#444444",
  inkFaint: "#919191",
  line: "#e0e0e0",
  // Grease
  grease: "#e9a23b",
  greaseDark: "#b9741c",
  greaseLight: "#f6c46f",
  // Soil in the bucket and on the heap
  soil: "#8c7356",
  // Lubrication lines and fittings
  hose: "#262626",
  // Galvanised steel: dividers, pistons, pins
  steelLight: "#e9edf1",
  steel: "#c3cad2",
  steelMid: "#9aa3ad",
  steelDark: "#6f7882",
} as const;
