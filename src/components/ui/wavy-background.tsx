"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: any;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: any;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSafari, setIsSafari] = useState(false);
  const noise = createNoise3D();
  let animationFrameId: number;

  const waveColors = colors ?? [
    "#38bdf8",
    "#818cf8",
    "#c084fc",
    "#e879f9",
    "#22d3ee",
  ];

  const getSpeed = useCallback(() => {
    return speed === "slow" ? 0.001 : 0.002;
  }, [speed]);

  const drawWave = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      ctx.beginPath();
      ctx.moveTo(0, h);

      for (let i = 0; i < w; i += waveWidth || 20) {
        const scaling = 0.1;
        const noise1 = noise(i * scaling, i * scaling, t);
        const noise2 = noise(i * scaling, i * scaling, t + 1000);
        const noise3 = noise(i * scaling, i * scaling, t + 2000);
        const y = noise1 * 100 + noise2 * 50 + noise3 * 25;

        ctx.lineTo(i, h * 0.5 + y);
      }

      ctx.lineTo(w, h);
      ctx.closePath();
    },
    [noise, waveWidth]
  );

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = backgroundFill || "#000000";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const t = Date.now() * getSpeed();

    waveColors.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.globalAlpha = waveOpacity;
      drawWave(ctx, w, h, t + i * 1000);
      ctx.fill();
    });

    animationFrameId = requestAnimationFrame(render);
  }, [backgroundFill, drawWave, getSpeed, waveColors, waveOpacity]);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (!isSafari) {
        ctx.filter = `blur(${blur}px)`;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [blur, isSafari, render]);

  useEffect(() => {
    const cleanup = init();
    return () => {
      if (cleanup) cleanup();
    };
  }, [init]);

  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      className={cn(
        "h-screen flex flex-col items-center justify-center",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
