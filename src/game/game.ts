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
  public width = 2000;
  public height = 1600;

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

export interface MinimapInit {
  type: "minimap.init";
  payload: {
    background: ImageBitmap;
    width: number;
    height: number;
  };
}

class GameState extends TGameState {
  private background?: TTexture;
  private player?: Ship;
  private planet?: Planet;
  private backgroundImage?: ImageBitmap;

  public onEnter() {
    this.engine.events.broadcast({
      type: "minimap.init",
      payload: {
        background: this.backgroundImage!,
        width: 200,
        height: 200 * (this.planet!.height / this.planet!.width),
      },
    });
  }

  public async onCreate(engine: TEngine) {
    const rp = new TResourcePack(engine, Ship.resources);
    await rp.load();

    const result = await generatePlanet(engine, planetTypes[0]);
    this.background = result.texture;
    this.backgroundImage = result.image;

    this.onReady(engine);
  }

  public onUpdate() {
    if (!this.planet) return;

    const p = this.player?.rootComponent.getWorldTransform().translation;

    const ctx = {
      minimap: {
        player: p
          ? [p[0] / this.planet.width, p[1] / -this.planet.height]
          : undefined,
      },
    };
    this.engine.updateGameContext(ctx);
  }

  public beforeWorldCreate() {
    // Disable gravity
    this.world!.config.gravity = vec3.fromValues(0, 0, 0);
    this.world!.config.collisionClasses.push({
      name: "Player",
    });
  }

  public onReady(engine: TEngine) {
    this.planet = new Planet(engine, this.background!, this);
    this.addActor(this.planet);

    const onShoot = this.onShootHandler(engine).bind(this);

    this.player = new Ship(engine, onShoot);
    this.addActor(this.player);

    const controller = new Controller(engine);
    controller.possess(this.player);

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
    cameraController.attachTo(this.player.rootComponent);
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
