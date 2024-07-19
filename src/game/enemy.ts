import { quat, vec3 } from "gl-matrix";
import {
  TActor,
  TResourcePackConfig,
  TSceneComponent,
  TSphereCollider,
  TSpriteComponent,
  TSpriteLayer,
} from "@tedengine/ted";
import type { TEngine } from "@tedengine/ted";
import shipTexture from "../assets/player.png";
import Ship from "./ship";

export default class Enemy extends TActor {
  public static resources: TResourcePackConfig = {
    textures: [shipTexture],
  };

  private sprite: TSpriteComponent;

  public health = 100;

  constructor(engine: TEngine, x: number, y: number, private player: Ship) {
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
  }

  public damage() {
    this.health -= 50;
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

      const q = quat.fromEuler(
        quat.create(),
        0,
        0,
        (angle * 180) / Math.PI - 90
      );
      this.sprite.transform.rotation = q;
    }
  }
}
