import {
  TGameState,
  TEngine,
  TActor,
  TSpriteComponent,
  TTexture,
  TOrthographicCamera,
} from "@tedengine/ted";
import { generatePlanetBackground } from "./planet-background";
import { vec3 } from "gl-matrix";

class Planet extends TActor {
  constructor(engine: TEngine, texture: TTexture) {
    super();

    const sprite = new TSpriteComponent(engine, this, 2000, 1600);
    sprite.setTexture(texture);

    this.rootComponent.transform.translation = vec3.fromValues(0, 0, -3);
  }
}

class GameState extends TGameState {
  private background?: TTexture;

  public async onCreate(engine: TEngine) {
    this.background = await generatePlanetBackground(engine);

    this.activeCamera = new TOrthographicCamera();
    this.onReady(engine);
  }

  public onReady(engine: TEngine) {
    const planet = new Planet(engine, this.background!);
    this.addActor(planet);
  }
}

const config = {
  states: {
    game: GameState,
  },
  defaultState: "game",
};

const engine = new TEngine(config, postMessage.bind(self));
onmessage = engine.onMessage;
