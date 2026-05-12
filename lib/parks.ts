// Single source of truth for park names used across the website.
// Keep in sync with studio/schemas/sighting.js's park dropdown options.
// Both the Sanity-stored value AND the displayed label use the full name,
// so the public site reads as polished/editorial.
export type Park = string

export const PARKS: readonly Park[] = [
  "Bandhavgarh National Park",
  "Ranthambore National Park",
  "Kanha National Park",
  "Pench National Park",
  "Tadoba Andhari Tiger Reserve",
  "Jim Corbett National Park",
  "Kaziranga National Park",
  "Sundarbans National Park",
  "Gir National Park",
  "Satpura National Park",
  "Nagarhole National Park",
  "Bandipur National Park",
  "Periyar Tiger Reserve",
] as const
