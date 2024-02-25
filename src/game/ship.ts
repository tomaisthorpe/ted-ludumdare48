import { quat, vec3 } from "gl-matrix";
import {
  TController,
  TPawn,
  TMeshComponent,
  TResourcePackConfig,
} from "@tedengine/ted";
import type { TEngine } from "@tedengine/ted";
import shipMesh from "../assets/ship.obj";
import shipMtl from "../assets/ship.mtl";

export default class Ship extends TPawn {
  public static resources: TResourcePackConfig = {
    meshes: [shipMesh],
    materials: [shipMtl],
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

  constructor(
    engine: TEngine,
    private onShoot: (x: number, y: number, theta: number) => void
  ) {
    super();

    const mesh = new TMeshComponent(engine, this);
    mesh.applyMesh(engine, shipMesh);
    mesh.applyMaterial(engine, shipMtl);
    mesh.transform.scale = vec3.fromValues(10, 10, 10);

    this.rootComponent.transform.translation = vec3.fromValues(0, 0, -20);
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

    // Rotate the ship towards the mouse
    const mouse = this.controller.mouseLocation;
    if (mouse?.worldX && mouse?.worldY) {
      const dx = this.rootComponent.transform.translation[0] - mouse.worldX;
      const dy = this.rootComponent.transform.translation[1] - mouse.worldY;
      this.theta = Math.atan2(dy, dx);

      const q = quat.fromEuler(
        quat.create(),
        0,
        0,
        (this.theta * 180) / Math.PI - 90
      );

      this.rootComponent.transform.rotation = q;
    }

    this.rootComponent.transform.translation = vec3.add(
      vec3.create(),
      this.rootComponent.transform.translation,
      vec3.fromValues(this.velocity.x, this.velocity.y, 0)
    );
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
