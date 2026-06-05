/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#10B981', // Green
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#6366F1'  // Indigo
];

/**
 * Converts HSL color values to a HEX string.
 */
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

/**
 * Returns a color that is not in the existingColors list.
 * It tries preset colors first. If they are all taken, it generates
 * visually distinct and beautiful colors by cycling through HSL hues.
 */
export function getUniqueColor(existingColors: string[]): string {
  const normalizedExisting = existingColors.map(c => c.toUpperCase());

  // 1. Try preset colors first
  const unusedPreset = PRESET_COLORS.find(c => !normalizedExisting.includes(c.toUpperCase()));
  if (unusedPreset) {
    return unusedPreset;
  }

  // 2. If presets are exhausted, search for a unique hue (in 15-degree steps)
  // High saturation and balanced lightness give a premium modern look.
  const saturation = 75;
  const lightness = 55;

  for (let h = 0; h < 360; h += 15) {
    const candidateHex = hslToHex(h, saturation, lightness);
    if (!normalizedExisting.includes(candidateHex)) {
      return candidateHex;
    }
  }

  // 3. Fallback to finer steps (5-degree steps)
  for (let h = 0; h < 360; h += 5) {
    const candidateHex = hslToHex(h, saturation, lightness);
    if (!normalizedExisting.includes(candidateHex)) {
      return candidateHex;
    }
  }

  // 4. Final fallback: return a random color if everything is filled
  return hslToHex(Math.floor(Math.random() * 360), saturation, lightness);
}
