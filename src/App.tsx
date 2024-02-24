import "./App.css";

import { TGame } from "@tedengine/ted";
import game from "./game/game?worker";

function App() {
  return (
    <>
      <div>
        <TGame game={new game()} />
      </div>
    </>
  );
}

export default App;
