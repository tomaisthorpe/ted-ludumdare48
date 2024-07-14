import { vec3 } from "gl-matrix";
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

export default class Enemy extends TActor {
  public static resources: TResourcePackConfig = {
    textures: [shipTexture],
  };

  private sprite: TSpriteComponent;

  constructor(engine: TEngine, x: number, y: number) {
    super();

    this.rootComponent = new TSceneComponent(this, {
      mass: 1,
      linearDamping: 0.8,
      fixedRotation: true,
    });
    this.rootComponent.collider = new TSphereCollider(16, "Player");
    this.rootComponent.transform.translation = vec3.fromValues(x, y, -20);

    this.sprite = new TSpriteComponent(engine, this, 32, 32);
    this.sprite.layer = TSpriteLayer.Foreground_0;
    this.sprite.applyTexture(engine, shipTexture);
  }
}
