import {
  TActor,
  TActorPool,
  TEngine,
  TOriginPoint,
  TPoolableActor,
  TSphereCollider,
  TSpriteComponent,
  TSpriteLayer,
  TTexture,
} from "@tedengine/ted";
import { quat, vec3 } from "gl-matrix";
import Enemy from "./enemy";
import Ship from "./ship";

export default class Bullet extends TActor implements TPoolableActor {
  private readonly speed = 800;
  private lifetime = 1;

  private fx?: number;
  private fy?: number;

  public pool!: TActorPool<Bullet>;
  public acquired: boolean = false;

  private target = "Enemy";
  private sprite!: TSpriteComponent;

  constructor(engine: TEngine, bulletTexture: TTexture) {
    super();

    this.sprite = new TSpriteComponent(
      engine,
      this,
      4,
      8,
      TOriginPoint.Center,
      TSpriteLayer.Foreground_0,
      {
        fixedRotation: true,
      }
    );
    this.sprite.setTexture(bulletTexture);

    this.rootComponent.collider = new TSphereCollider(8, "Bullet");
  }

  public onUpdate(_: TEngine, dt: number) {
    // Pooled actors aren't dead, so need to use acquired to determine if it's active
    // This potentially could result in unexpected bugs.
    if (!this.acquired) {
      return;
    }

    // This must be run before `setLinearVelocity` otherwise it will try update body
    // on a released actor.
    this.lifetime -= dt;
    if (this.lifetime <= 0) {
      this.pool.release(this);
      return;
    }

    if (this.fx !== undefined && this.fy !== undefined) {
      this.rootComponent.setLinearVelocity(
        vec3.fromValues(this.fx, this.fy, 0)
      );
    }
  }

  public onWorldAdd() {
    this.onEnterCollisionClass("Solid", () => {
      this.pool.release(this);
    });

    this.onEnterCollisionClass(this.target, (actor) => {
      this.pool.release(this);

      if (actor instanceof Enemy) {
        (actor as Enemy).damage();
      }

      if (actor instanceof Ship) {
        (actor as Ship).damage(100);
      }
    });
  }

  public reset() {
    this.lifetime = 1;
  }

  public setup(x: number, y: number, theta: number, target: string) {
    this.rootComponent.transform.translation = vec3.fromValues(x, y, -10);

    const degrees = (theta * 180) / Math.PI - 90;
    this.sprite.transform.rotation = quat.fromEuler(
      quat.create(),
      0,
      0,
      degrees
    );

    this.fx = Math.cos(theta) * this.speed;
    this.fy = Math.sin(theta) * this.speed;
    this.target = target;
  }
}
