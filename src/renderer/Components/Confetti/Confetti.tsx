import { useEffect, useRef } from 'react';
import './Confetti.css';

type RGB = `rgb(${number}, ${number}, ${number})`;
type HEX = `#${string}`;

type Color = RGB | HEX;

type RectType = {
  x: number;
  y: number;
  size: number;
  rot: number;
  rotSpeed: number;
  color: Color;
};

export default function Confetti({
  amount,
  enabled,
}: {
  amount: number;
  enabled: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  const rects: Array<RectType> = [];

  useEffect(() => {
    if (!canvas.current) return;
    canvas.current.width = window.innerWidth;
    canvas.current.height = window.innerHeight;

    const ctx = canvas.current.getContext('2d');
    if (!ctx) return;
    const height = canvas.current.height;
    const width = canvas.current.width;

    for (let i = 0; i < amount; i++) {
      rects.push({
        x: Math.random() * width,
        y: -Math.random() * height,
        size: Math.random() * 10 + 1,
        rot: Math.random() * 2 * Math.PI,
        rotSpeed: Math.random() * 0.01 + 0.001,
        color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
          Math.random() * 255
        })`,
      });
    }

    setInterval(() => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < rects.length; i++) {
        const rect = rects[i];
        ctx.fillStyle = rect.color;
        ctx.translate(rect.x, rect.y);
        ctx.rotate(rect.rot);
        ctx.fillRect(-rect.size / 2, -rect.size / 2, rect.size, rect.size);
        ctx.resetTransform();

        rects[i].y += 1;
        rects[i].rot += rect.rotSpeed * 5;
        if (rect.y > height + rect.size) rects[i].y = -rect.size;
      }
    }, 50);
  }, [canvas, enabled]);

  return <>{enabled && <canvas ref={canvas} className="confetti" />}</>;
}
