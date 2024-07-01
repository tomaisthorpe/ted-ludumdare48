import "./App.css";

import { TGame, useGameContext } from "@tedengine/ted";
import game from "./game/game?worker";

function Minimap() {
  const ctx = useGameContext();
  if (!ctx) return null;
  if (!ctx.minimap) return null;

  const { player } = ctx.minimap;

  return (
    <div
      style={{
        position: "absolute",
        width: "250px",
        height: "150px",
        border: "2px solid rgba(0, 0, 0, 0.1)",
        bottom: 0,
        right: 0,
        background: "rgba(0, 0, 0, 0.3)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: `${player[1] * 100}%`,
          left: `${player[0] * 100}%`,
          width: 10,
          height: 10,
          background: "yellow",
        }}
      />
    </div>
  );
}

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
