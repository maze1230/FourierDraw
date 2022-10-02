/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Box } from "@mui/material";
import React, { useEffect, useRef } from "react";

import { Point } from "../illust/Point";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 640;

const PlayerCanvas = ({
  points,
  playing,
  setPlaying,
  setPlayTime,
}: {
  points: Point[],
  playing: boolean,
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>,
  setPlayTime: React.Dispatch<React.SetStateAction<number>>
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);
  const lastPointIdx = useRef<number>(0);

  const getCtx = () => canvasRef.current!.getContext('2d')!;
  
  const initialize = () => {
    const ctx = getCtx();
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.beginPath();
  };

  const finishAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    startTime.current = null;
    setPlaying(false);
  };

  const play = (timestamp: number) => {
    if (!startTime.current) {
      initialize();
      startTime.current = timestamp;
      lastPointIdx.current = 0;
    }

    const elapsedTime = timestamp - startTime.current;
    setPlayTime(elapsedTime);

    const ctx = getCtx();
    for (let i = lastPointIdx.current + 1; i < points.length && points[i].time <= elapsedTime; i += 1) {
      const lastPoint = points[lastPointIdx.current];
      const point = points[i];

      ctx.lineWidth = 2;
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();

      lastPointIdx.current = i;
    }

    if (playing && lastPointIdx.current < points.length - 1) {
      animationRef.current = requestAnimationFrame(play);
    } else {
      finishAnimation();
    }
  };

  useEffect(() => {
    if (!playing) {
      finishAnimation();

      return () => {};
    }

    animationRef.current = requestAnimationFrame(play);
    return () => {
      finishAnimation();
    };
  }, [playing]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center" 
      marginBottom="30px"
    >
      <canvas
        id="player-canvas"
        ref={canvasRef}
        width={`${CANVAS_WIDTH}px`}
        height={`${CANVAS_HEIGHT}px`}
      />
    </Box>
  );
};

export default PlayerCanvas;