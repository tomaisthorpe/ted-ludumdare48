import { vec3 } from "gl-matrix";
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

  constructor(engine: TEngine) {
    super();

    const mesh = new TMeshComponent(engine, this);
    mesh.applyMesh(engine, shipMesh);
    mesh.applyMaterial(engine, shipMtl);
    mesh.transform.scale = vec3.fromValues(10, 10, 10);

    this.rootComponent.transform.translation = vec3.fromValues(0, 0, -20);
  }

  public setupController(controller: TController): void {
    super.setupController(controller);

    controller.bindAction("Shoot", "pressed", this.shootPressed);
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

    this.rootComponent.transform.translation = vec3.add(
      vec3.create(),
      this.rootComponent.transform.translation,
      vec3.fromValues(this.velocity.x, this.velocity.y, 0)
    );
  }

  public shootPressed() {
    console.log("omg");
  }
}
