import { TController } from "@tedengine/ted";
import type { TEngine } from "@tedengine/ted";

export default class Controller extends TController {
  constructor(engine: TEngine) {
    super(engine.events);

    this.addActionFromKeyEvent("Shoot", "Space");
    this.addActionFromMouseEvent("Shoot", 0);

    this.addAxisFromKeyEvent("MoveUp", "ArrowUp", 1);
    this.addAxisFromKeyEvent("MoveRight", "ArrowLeft", -1);
    this.addAxisFromKeyEvent("MoveRight", "ArrowRight", 1);
    this.addAxisFromKeyEvent("MoveUp", "ArrowDown", -1);

    this.addAxisFromKeyEvent("MoveUp", "w", 1);
    this.addAxisFromKeyEvent("MoveRight", "a", -1);
    this.addAxisFromKeyEvent("MoveRight", "d", 1);
    this.addAxisFromKeyEvent("MoveUp", "s", -1);
  }
}
