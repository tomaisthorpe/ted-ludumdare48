import {
  TActor,
  TActorPool,
  TEngine,
  TPoolableActor,
  TSphereCollider,
  TSphereComponent,
} from "@tedengine/ted";
import { vec3 } from "gl-matrix";
import Enemy from "./enemy";

export default class Bullet extends TActor implements TPoolableActor {
  private readonly speed = 1000;
  private lifetime = 1;

  private fx?: number;
  private fy?: number;

  public pool!: TActorPool<Bullet>;
  public acquired: boolean = false;

  constructor(engine: TEngine) {
    super();

    new TSphereComponent(engine, this, 5, 5, 2);

    this.rootComponent.collider = new TSphereCollider(8, "Bullet");
  }

  public onUpdate(_: TEngine, dt: number) {
    if (this.fx !== undefined && this.fy !== undefined) {
      this.rootComponent.setLinearVelocity(
        vec3.fromValues(this.fx, this.fy, 0)
      );
    }

    this.lifetime -= dt;
    if (this.lifetime <= 0) {
      this.pool.release(this);
    }
  }

  public onWorldAdd() {
    this.onEnterCollisionClass("Solid", () => {
      this.pool.release(this);
    });

    this.onEnterCollisionClass("Enemy", (actor) => {
      this.pool.release(this);

      if (actor instanceof Enemy) {
        (actor as Enemy).damage();
      }
    });
  }

  public reset() {
    this.lifetime = 1;
  }

  public setup(x: number, y: number, theta: number) {
    this.rootComponent.transform.translation = vec3.fromValues(x, y, -10);
    this.fx = Math.cos(theta) * this.speed;
    this.fy = Math.sin(theta) * this.speed;
  }
}
