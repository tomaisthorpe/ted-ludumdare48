import { quat, vec3 } from "gl-matrix";
import {
  TController,
  TPawn,
  TResourcePackConfig,
  TSceneComponent,
  TSphereCollider,
  TSpriteComponent,
} from "@tedengine/ted";
import type { TEngine } from "@tedengine/ted";
import shipTexture from "../assets/player.png";

export default class Ship extends TPawn {
  public static resources: TResourcePackConfig = {
    textures: [shipTexture],
  };

  private velocity: {
    x: number;
    y: number;
  } = {
    x: 0,
    y: 0,
  };
  private readonly speed = 100;
  private readonly friction = 0.9;
  private readonly fireRate = 0.2;

  private lastShot = 0;
  private theta = 0;

  private sprite: TSpriteComponent;

  constructor(
    engine: TEngine,
    private onShoot: (x: number, y: number, theta: number) => void
  ) {
    super();

    this.rootComponent = new TSceneComponent(this, {
      mass: 1,
      linearDamping: 0.8,
      fixedRotation: true,
    });
    this.rootComponent.collider = new TSphereCollider(16, "Player");
    this.rootComponent.transform.translation = vec3.fromValues(100, -100, -20);

    this.sprite = new TSpriteComponent(engine, this, 32, 32);
    this.sprite.applyTexture(engine, shipTexture);
  }

  public setupController(controller: TController): void {
    super.setupController(controller);
    controller.enableMouseTracking();

    controller.bindAction("Shoot", "pressed", this.shootPressed.bind(this));
  }

  public onUpdate(_: TEngine, dt: number) {
    if (!this.controller) {
      return;
    }

    this.controller.update();

    this.velocity.x +=
      this.controller.getAxisValue("MoveRight") * this.speed * dt;
    this.velocity.y += this.controller.getAxisValue("MoveUp") * this.speed * dt;

    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;

    const force = 1000;

    this.rootComponent.applyCentralForce(
      vec3.fromValues(
        force * this.controller.getAxisValue("MoveRight"),
        force * this.controller.getAxisValue("MoveUp"),
        0
      )
    );

    // Rotate the ship towards the mouse
    const mouse = this.controller.mouseLocation;
    const camera = this.world?.gameState.activeCamera;

    if (mouse && camera) {
      const worldSpace = camera.clipToWorldSpace(mouse.clip);
      const dx = this.rootComponent.transform.translation[0] - worldSpace[0];
      const dy = this.rootComponent.transform.translation[1] - worldSpace[1];
      this.theta = Math.atan2(dy, dx);

      const q = quat.fromEuler(
        quat.create(),
        0,
        0,
        (this.theta * 180) / Math.PI + 90
      );

      this.sprite.transform.rotation = q;
    }

    this.rootComponent.transform.translation[2] = -20;
    // this.rootComponent.setLinearVelocity(
    //   vec3.fromValues(this.velocity.x, this.velocity.y, 0)
    // );
    // this.rootComponent.transform.translation = vec3.add(
    //   vec3.create(),
    //   this.rootComponent.transform.translation,
    //   vec3.fromValues(this.velocity.x, this.velocity.y, 0)
    // );
  }

  public shootPressed() {
    const now = performance.now();

    const canShoot = now - this.lastShot > this.fireRate;
    if (!canShoot) {
      return;
    }

    this.lastShot = now;

    const transform = this.rootComponent.transform;
    const [x, y] = transform.translation;

    this.onShoot(x, y, this.theta + Math.PI);
  }
}
