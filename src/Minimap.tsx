import { useEventQueue, useGameContext } from "@tedengine/ted";
import { useEffect, useRef, useState } from "react";
import { MinimapInit } from "./game/game";

export function Minimap() {
  const events = useEventQueue();
  const ctx = useGameContext();
  const ref = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState<[number, number]>([0, 0]);
  const [background, setBackground] = useState<ImageBitmap>();

  useEffect(() => {
    events?.addListener<MinimapInit>("minimap.init", (event) => {
      console.log("minimap.init", event);

      setBackground(event.payload.background);
      setSize([event.payload.width, event.payload.height]);
    });
  }, [events]);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = ref.current.getContext("2d");

    if (!ctx) return;

    if (!background) return;

    ctx.filter = "greyscale() opacity(0.2)";
    ctx.drawImage(background, 0, 0, size[0], size[1]);

    ctx.globalCompositeOperation = "color";

    ctx.filter = "";
    ctx.fillStyle = "rgb(58, 118, 148)";
    ctx.fillRect(0, 0, size[0], size[1]);
    ctx.globalCompositeOperation = "source-over";
  }, [ref.current, background]);

  if (!ctx) return null;
  if (!ctx.minimap) return null;

  const { player, bullets } = ctx.minimap;

  return (
    <div
      style={{
        position: "absolute",
        width: `${size[0]}px`,
        height: `${size[1]}px`,
        border: "2px solid rgba(0, 0, 0, 0.1)",
        bottom: 0,
        right: 0,
        background: "rgba(0, 0, 0, 0.3)",
      }}
    >
      <canvas ref={ref} width={size[0]} height={size[1]} />
      <div
        style={{
          position: "absolute",
          top: `${player[1] * 100}%`,
          left: `${player[0] * 100}%`,
          width: 10,
          height: 10,
          background: "rgb(255, 255, 0)",
        }}
      />
      {bullets.map((b: [number, number], i: number) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: `${b[1] * 100}%`,
            left: `${b[0] * 100}%`,
            width: 2,
            height: 2,
            background: "rgb(255, 0, 0)",
          }}
        />
      ))}
    </div>
  );
}
