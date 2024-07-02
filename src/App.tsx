import "./App.css";

import { TGame } from "@tedengine/ted";
import game from "./game/game?worker";
import { Minimap } from "./Minimap";

function App() {
  return (
    <>
      <div>
        <TGame
          config={{
            renderWidth: 800,
            renderHeight: 600,
            imageRendering: "pixelated",
          }}
          game={new game()}
        >
          <Minimap />
        </TGame>
      </div>
    </>
  );
}

export default App;
