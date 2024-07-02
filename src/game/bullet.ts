import {
  TActor,
  TEngine,
  TSphereCollider,
  TSphereComponent,
} from "@tedengine/ted";
import { vec3 } from "gl-matrix";

export default class Bullet extends TActor {
  private velocity: {
    x: number;
    y: number;
  } = {
    x: 0,
    y: 0,
  };
  private readonly speed = 1000;
  private lifetime = 1;

  private fx: number;
  private fy: number;

  constructor(engine: TEngine, x: number, y: number, theta: number) {
    super();

    new TSphereComponent(engine, this, 5, 5, 5);

    this.rootComponent.collider = new TSphereCollider(8, "Bullet");
    this.rootComponent.transform.translation = vec3.fromValues(x, y, -10);

    this.fx = Math.cos(theta) * this.speed;
    this.fy = Math.sin(theta) * this.speed;
  }

  public onUpdate(_: TEngine, dt: number) {
    this.rootComponent.setLinearVelocity(vec3.fromValues(this.fx, this.fy, 0));

    this.lifetime -= dt;
    if (this.lifetime <= 0) {
      // this.destroy();
    }
  }

  public onWorldAdd() {
    this.onEnterCollisionClass("Solid", () => {
      // this.destroy();
    });
  }
}
