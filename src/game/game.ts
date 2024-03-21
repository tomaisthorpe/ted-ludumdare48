import {
  TGameState,
  TEngine,
  TActor,
  TSpriteComponent,
  TTexture,
  TOrthographicCamera,
  TResourcePack,
  TFixedAxisCameraController,
  TBoxCollider,
  TOriginPoint,
  TSceneComponent,
} from "@tedengine/ted";
import { generatePlanet } from "./generate-planet";
import { vec3 } from "gl-matrix";
import Ship from "./ship";
import Controller from "./controller";
import Bullet from "./bullet";
import { planetTypes } from "./config";

class Wall extends TActor {
  constructor(x: number, y: number, width: number, height: number) {
    super();

    const box = new TSceneComponent(this, {
      mass: 0,
      fixedRotation: true,
    });
    box.transform.translation = vec3.fromValues(
      x + width / 2,
      y - height / 2,
      -20
    );
    this.rootComponent = box;

    box.collider = new TBoxCollider(width, height, 30);
  }
}

class Planet extends TActor {
  constructor(engine: TEngine, texture: TTexture, state: GameState) {
    super();

    const sprite = new TSpriteComponent(
      engine,
      this,
      2000,
      1600,
      TOriginPoint.TopLeft
    );
    sprite.setTexture(texture);

    this.rootComponent.transform.translation = vec3.fromValues(0, 0, -100);

    // Generate walls
    state.addActor(new Wall(0, 0, 50, 1600));
    state.addActor(new Wall(0, 0, 2000, 50));
    state.addActor(new Wall(0, -1600 + 50, 2000, 50));
    state.addActor(new Wall(2000 - 50, 0, 50, 1600));
  }
}

class GameState extends TGameState {
  private background?: TTexture;

  public async onCreate(engine: TEngine) {
    const rp = new TResourcePack(engine, Ship.resources);
    await rp.load();

    const result = await generatePlanet(engine, planetTypes[0]);
    this.background = result.texture;

    this.onReady(engine);
  }

  public beforeWorldCreate() {
    // Disable gravity
    this.world!.config.gravity = vec3.fromValues(0, 0, 0);
    this.world!.config.collisionClasses.push({
      name: "Player",
    });
  }

  public onReady(engine: TEngine) {
    const planet = new Planet(engine, this.background!, this);
    this.addActor(planet);

    const onShoot = this.onShootHandler(engine).bind(this);

    const ship = new Ship(engine, onShoot);
    this.addActor(ship);

    const controller = new Controller(engine);
    controller.possess(ship);

    const camera = new TOrthographicCamera(engine);
    this.activeCamera = camera;
    this.addActor(camera);
    const cameraController = new TFixedAxisCameraController({
      distance: 20,
      axis: "z",
      bounds: {
        min: vec3.fromValues(400, -1300, 0),
        max: vec3.fromValues(1600, -300, 0),
      },
    });
    cameraController.attachTo(ship.rootComponent);
    camera.controller = cameraController;
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
