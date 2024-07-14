import { TCanvas, TEngine, TTexture, TTextureFilter } from "@tedengine/ted";
import { createNoise2D } from "simplex-noise";
import { sizes, PlanetConfig, Color, PlanetSize } from "./config";

type GridSize = [number, number];
type PlanetGrid = [[number]];

const difficulty = 1;

export interface GeneratePlanetResult {
  texture: TTexture;
  image: ImageBitmap;
  size: PlanetSize;
  enemyLocations: [number, number][];
}

export const generatePlanet = async (
  engine: TEngine,
  planetType: PlanetConfig
): Promise<GeneratePlanetResult> => {
  const size = planetType.sizes[0];

  const planetSize = sizes[size];
  const gridSize: GridSize = [planetSize[0] / 4, planetSize[1] / 4];

  const grid = generateGrid(planetType, gridSize);

  const canvas = new TCanvas(engine, planetSize[0], planetSize[1]);

  const ctx = canvas.getContext();
  drawCanvas(ctx, planetType, grid);

  const texture = await canvas.getTexture({ filter: TTextureFilter.Nearest });

  const image = await createImageBitmap(
    ctx.getImageData(0, 0, planetSize[0], planetSize[1])
  );

  const enemyLocations: [number, number][] = [];
  for (let e = 0; e < 20 * difficulty; e++) {
    const x = 200 + Math.floor(Math.random() * (planetSize[0] - 400));
    const y = -(200 + Math.floor(Math.random() * (planetSize[1] - 400)));

    enemyLocations.push([x, y]);
  }

  return { texture, image, size: planetSize, enemyLocations };
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
