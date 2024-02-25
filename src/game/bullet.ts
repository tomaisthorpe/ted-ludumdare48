import { TActor, TEngine, TSphereComponent } from "@tedengine/ted";
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
  private lifetime = 2;

  constructor(engine: TEngine, x: number, y: number, theta: number) {
    super();

    new TSphereComponent(engine, this, 5, 5, 5);

    this.rootComponent.transform.translation = vec3.fromValues(x, y, -10);

    this.velocity.x = Math.cos(theta) * this.speed;
    this.velocity.y = Math.sin(theta) * this.speed;
  }

  public onUpdate(_: TEngine, dt: number) {
    this.rootComponent.transform.translation[0] += this.velocity.x * dt;
    this.rootComponent.transform.translation[1] += this.velocity.y * dt;

    this.lifetime -= dt;
    if (this.lifetime <= 0) {
      // @todo add this later
    }
  }
}
