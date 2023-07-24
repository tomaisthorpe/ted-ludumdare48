import "./App.css";
import Game from "./game/game?worker";

import { TGame } from "@tedengine/ted";

function App() {
  return (
    <>
      <div>
        <TGame game={new Game()} />
      </div>
    </>
  );
}

export default App;
