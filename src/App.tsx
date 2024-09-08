import "./App.css";

import { TGame, useGameContext, useUIContext } from "@tedengine/ted";
import game from "./game/game?worker";
import { Minimap } from "./Minimap";
import { HealthBar } from "./HealthBar";

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
          <EnemiesRemaining />
          <HealthBar />
          <Controls />
        </TGame>
      </div>
    </>
  );
}

function EnemiesRemaining() {
  const { scaling } = useUIContext();
  const { minimap } = useGameContext();
  if (!minimap) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: "16px",
        left: "16px",
        color: "white",
        textShadow: "0 1px 0 black",
        transform: `scale(${scaling})`,
        transformOrigin: "top left",
        fontSize: "12px",
      }}
    >
      Enemies Remaining: {minimap.enemies.length}
    </div>
  );
}

function Controls() {
  const { scaling } = useUIContext();
  return (
    <div
      style={{
        position: "absolute",
        bottom: "16px",
        left: "16px",
        transform: `scale(${scaling})`,
        transformOrigin: "bottom left",
        fontSize: "12px",
        textShadow: "0 1px 0 black",
        textAlign: "left",
        lineHeight: "1.6em",
      }}
    >
      WASD/ Arrow keys to move
      <br />
      Click to shoot
    </div>
  );
}
export default App;
