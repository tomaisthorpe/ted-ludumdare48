import { useGameContext, useUIContext } from "@tedengine/ted";

const healthColor = "rgb(177, 7, 7)";
const healthBarWidth = 250;
const healthBarHeight = 20;

export function HealthBar() {
  const { scaling } = useUIContext();
  const ctx = useGameContext();

  return (
    <div
      style={{
        display: "flex",
        position: "absolute",
        top: "16px",
        right: "16px",
        alignItems: "center",
        transform: `scale(${scaling})`,
        transformOrigin: "top right",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          marginRight: "8px",
          color: healthColor,
          fontSize: "16px",
        }}
      >
        Health
      </div>
      <div
        style={{
          width: `${healthBarWidth}px`,
          height: `${healthBarHeight - 4}px`,
          border: `2px solid ${healthColor}`,
          padding: "4px",
        }}
      >
        <div
          style={{
            width: `${healthBarWidth * (ctx.health / 100)}px`,
            height: `${healthBarHeight - 4}px`,
            background: healthColor,
          }}
        />
      </div>
    </div>
  );
}
