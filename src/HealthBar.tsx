import { useGameContext, useUIContext } from "@tedengine/ted";

const healthColor = "rgb(177, 7, 7)";
const healthBarWidth = 250;
const healthBarHeight = 19;

export function HealthBar() {
  const { scaling } = useUIContext();
  const ctx = useGameContext();

  return (
    <div
      style={{
        position: "absolute",
        top: "0",
        right: "0",
        transform: `scale(${scaling})`,
        transformOrigin: "top right",
      }}
    >
      <div
        style={{
          display: "flex",
          marginTop: "12px",
          marginRight: "48px",
          alignItems: "center",
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
    </div>
  );
}
