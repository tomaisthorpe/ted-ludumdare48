import {
  TGameState,
  TEngine,
  TActor,
  TSpriteComponent,
  TTexture,
  TOrthographicCamera,
  TResourcePack,
} from "@tedengine/ted";
import { generatePlanet } from "./generate-planet";
import { vec3 } from "gl-matrix";
import Ship from "./ship";
import Controller from "./controller";
import Bullet from "./bullet";
import { planetTypes } from "./config";

class Planet extends TActor {
  constructor(engine: TEngine, texture: TTexture) {
    super();

    const sprite = new TSpriteComponent(engine, this, 2000, 1600);
    sprite.setTexture(texture);

    this.rootComponent.transform.translation = vec3.fromValues(0, 0, -100);
  }
}

class GameState extends TGameState {
  private background?: TTexture;

  public async onCreate(engine: TEngine) {
    const rp = new TResourcePack(engine, Ship.resources);
    await rp.load();

    const result = await generatePlanet(engine, planetTypes[0]);
    this.background = result.texture;

    this.activeCamera = new TOrthographicCamera();
    this.onReady(engine);
  }

  public onReady(engine: TEngine) {
    const planet = new Planet(engine, this.background!);
    this.addActor(planet);

    const onShoot = this.onShootHandler(engine).bind(this);

    const ship = new Ship(engine, onShoot);
    this.addActor(ship);

    const controller = new Controller(engine);
    controller.possess(ship);
  }

  public onShootHandler(
    engine: TEngine
  ): (x: number, y: number, theta: number) => void {
    return (x: number, y: number, theta: number) => {
      const bullet = new Bullet(engine, x, y, theta);
      this.addActor(bullet);
    };
  }
}

const config = {
  states: {
    game: GameState,
  },
  defaultState: "game",
};

new TEngine(config, self);
