import { TGameState, TEngine } from "@tedengine/ted";

class GameState extends TGameState {
  public async onCreate(engine: TEngine) {
    this.onReady(engine);
  }

  public onReady(engine: TEngine) {}
}

const config = {
  states: {
    game: GameState,
  },
  defaultState: "game",
};

const engine = new TEngine(config, postMessage.bind(self));
onmessage = engine.onMessage;
