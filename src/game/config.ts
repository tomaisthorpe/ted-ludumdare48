export type PlanetSize = [number, number];

export const sizes: { [key: string]: PlanetSize } = {
  small: [2000, 1600],
  medium: [3000, 2400],
  large: [3200, 4000],
};

export type Color = [number, number, [number, number]];
export type Palette = [number, Color];
export type Frequency = [number, number];

export interface PlanetConfig {
  sizes: string[];
  palette: Palette[];
  frequencies: Frequency[];
}
export const planetTypes: PlanetConfig[] = [
  {
    sizes: ["small", "medium"],
    palette: [
      [0.6, [126, 26, [50, 75]]],
      [0.55, [46, 100, [75, 80]]],
      [0.4, [200, 77, [70, 80]]],
      [0, [200, 77, [50, 60]]],
    ],
    frequencies: [
      [0.001, 0.35],
      [0.002, 0.45],
      [0.01, 0.2],
    ],
  },
  {
    sizes: ["medium", "large"],
    palette: [
      [0.4, [29, 56, [45, 50]]],
      [0, [29, 64, [40, 50]]],
    ],
    frequencies: [
      [0.001, 0.5],
      [0.002, 0.4],
      [0.02, 0.1],
    ],
  },
  {
    sizes: ["medium", "large"],
    palette: [
      [0.5, [249, 45, [50, 55]]],
      [0, [249, 45, [45, 55]]],
    ],
    frequencies: [
      [0.0001, 0.8],
      [0.03, 0.2],
    ],
  },
  {
    sizes: ["small"],
    palette: [
      [0.3, [236, 6, [60, 70]]],
      [0, [236, 6, [50, 55]]],
    ],
    frequencies: [
      [0.003, 0.7],
      [0.02, 0.3],
    ],
  },
];
