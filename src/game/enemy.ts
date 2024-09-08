import { quat, vec3 } from "gl-matrix";
import {
  TActor,
  TResourcePackConfig,
  TSceneComponent,
  TSphereCollider,
  TSpriteComponent,
  TSpriteLayer,
} from "@tedengine/ted";
import type { TEngine, TSound } from "@tedengine/ted";
import shipTexture from "../assets/enemy.png";
import hitSound from "../assets/hit.wav";
import Ship from "./ship";

export default class Enemy extends TActor {
  public static resources: TResourcePackConfig = {
    textures: [shipTexture],
    sounds: [hitSound],
  };

  private sprite: TSpriteComponent;

  public health = 100;

  private readonly fireRate = 1000;
  private lastShot = 0;

  private angle = 0;

  private hitSound?: TSound;

  constructor(
    engine: TEngine,
    x: number,
    y: number,
    private player: Ship,
    private onEnemyShoot: (x: number, y: number, theta: number) => void
  ) {
    super();

    this.rootComponent = new TSceneComponent(this, {
      mass: 1,
      linearDamping: 0.8,
      fixedRotation: true,
    });
    this.rootComponent.collider = new TSphereCollider(16, "Enemy");
    this.rootComponent.transform.translation = vec3.fromValues(x, y, -20);

    this.sprite = new TSpriteComponent(engine, this, 32, 32);
    this.sprite.layer = TSpriteLayer.Foreground_0;
    this.sprite.applyTexture(engine, shipTexture);

    this.hitSound = engine.resources.get<TSound>(hitSound);
  }

  public damage() {
    this.health -= 50;
    this.hitSound?.play();

    if (this.health <= 0) {
      this.destroy();
    }
  }

  public onUpdate() {
    const playerX = this.player.getX();
    const playerY = this.player.getY();

    const x = this.rootComponent.transform.translation[0];
    const y = this.rootComponent.transform.translation[1];

    const dx = playerX - x;
    const dy = playerY - y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < 400) {
      const angle = Math.atan2(dy, dx);

      this.angle = angle;

      const q = quat.fromEuler(
        quat.create(),
        0,
        0,
        (angle * 180) / Math.PI - 90
      );
      this.sprite.transform.rotation = q;

      this.attemptShoot();
    }
  }

  private attemptShoot() {
    const now = performance.now();
    const canShoot = now - this.lastShot > this.fireRate;
    if (!canShoot) {
      return;
    }

    this.lastShot = now;

    const transform = this.rootComponent.transform;
    const [x, y] = transform.translation;

    this.onEnemyShoot(x, y, this.angle);
  }
}
