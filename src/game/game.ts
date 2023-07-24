import { TGameState, TEngine } from "@tedengine/ted";

class GameState extends TGameState {}

const config = {
  states: {
    game: GameState,
  },
  defaultState: "game",
};

const engine = new TEngine(config, postMessage.bind(self));
onmessage = engine.onMessage;
