import { TCanvas, TEngine, TTexture, TTextureFilter } from "@tedengine/ted";
import { createNoise2D } from "simplex-noise";

const sizes: { [key: string]: [number, number] } = {
  small: [2000, 1600],
  medium: [3000, 2400],
  large: [3200, 4000],
};

type Color = [number, number, [number, number]];
type Palette = [number, Color];
type Frequency = [number, number];

interface PlanetConfig {
  sizes: string[];
  palette: Palette[];
  frequencies: Frequency[];
}

const planetTypes: PlanetConfig[] = [
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

type GridSize = [number, number];
type PlanetGrid = [[number]];

export const generatePlanetBackground = async (
  engine: TEngine
): Promise<TTexture> => {
  const config = planetTypes[0];
  const size = config.sizes[0];

  const planetSize = sizes[size];
  const gridSize: GridSize = [planetSize[0] / 4, planetSize[1] / 4];

  const grid = generateGrid(config, gridSize);

  const canvas = new TCanvas(engine, planetSize[0], planetSize[1]);

  const ctx = canvas.getContext();
  drawCanvas(ctx, config, grid);

  const texture = await canvas.getTexture();
  texture.filter = TTextureFilter.Nearest;

  return texture;
};

const drawCanvas = (
  ctx: OffscreenCanvasRenderingContext2D,
  config: PlanetConfig,
  grid: PlanetGrid
) => {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      const v = grid[x][y];

      let color = "black";
      let vMax = 1.0;

      for (const palette of config.palette) {
        if (v >= palette[0]) {
          color = pickColor(palette[0], vMax, palette[1], v);
          break;
        }

        vMax = palette[0];
      }

      if (color === "black") {
        // console.log(v);
      }

      ctx.fillStyle = color;
      ctx.fillRect(x * 4, y * 4, 4, 4);
    }
  }
};

const pickColor = (vMin: number, vMax: number, color: Color, value: number) => {
  const min = color[2][0];
  const max = color[2][1];

  const scaledV = ((value - vMin) * 1) / (vMax - vMin);
  const l = min + (max - min) * scaledV;

  return `hsl(${color[0]}, ${color[1]}%, ${l}%)`;
};

const generateGrid = (config: PlanetConfig, gridSize: GridSize): PlanetGrid => {
  // generate empty grid
  const grid = [...Array(gridSize[0])].map(() => Array(gridSize[1]).fill(0));

  const noiseGen = createNoise2D();
  const noise = (x: number, y: number) => {
    return (noiseGen(x, y) + 1) / 2.0;
  };

  const seed = 0;

  for (const freq of config.frequencies) {
    for (let x = 0; x < gridSize[0]; x++) {
      for (let y = 0; y < gridSize[1]; y++) {
        grid[x][y] =
          grid[x][y] + noise(freq[0] * x + seed, freq[0] * y + seed) * freq[1];
      }
    }
  }

  return grid as PlanetGrid;
};
