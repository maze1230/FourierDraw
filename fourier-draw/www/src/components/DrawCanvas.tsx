/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useRef } from "react";

import { Box } from "@mui/material";
import { Point } from "../illust/Point";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 640;

export const MAX_DRAWING_SECS = 10.0;

const getPosition = (
  e: React.PointerEvent<HTMLCanvasElement>
): { x: number, y: number } => {
  const x = e.nativeEvent.offsetX;
  const y = e.nativeEvent.offsetY;

  return { x, y };
};

const inCanvas = ({ x, y }: { x: number, y: number }): boolean => {
  if (x < 0 || y < 0 || x >= CANVAS_WIDTH || y >= CANVAS_HEIGHT) {
    return false;
  }
  return true;
}

export const DrawCanvas = ({
  setPoints,
  setPassedTime,
}: {
  setPoints: React.Dispatch<React.SetStateAction<Point[]>>,
  setPassedTime: React.Dispatch<React.SetStateAction<number>>,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const passedTimeIntervalId = useRef<NodeJS.Timer | null>(null);
  const startTime = useRef<number | null>(null);
  const penIsDown = useRef<boolean | null>(null);

  const pointsRef = useRef<Point[]>([]);

  const getCtx = () => canvasRef.current!.getContext('2d');

  const initialize = () => {
    // setPoints([]);
    pointsRef.current = [];
    startTime.current = null;
    penIsDown.current = null;

    getCtx()?.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    getCtx()?.beginPath();
  };

  const addPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const timestamp: number = Date.now();

    if (!startTime.current) {
      startTime.current = timestamp;
    }

    const { x, y } = getPosition(e);
    const point: Point = {
      x, y, time: timestamp - startTime.current!
    };

    pointsRef.current.push(point);
    return point;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement> | undefined) => {
    if (penIsDown.current) {
      clearInterval(passedTimeIntervalId.current!);

      if (e) {
        addPoint(e);
      }
      setPoints(pointsRef.current);
      penIsDown.current = false;
    }
  }

  const handlePointerDown = (
    e: React.PointerEvent<HTMLCanvasElement>
  ): void => {
    const { x, y } = getPosition(e);

    if (!inCanvas({ x, y })) {
      return;
    }

    initialize();

    addPoint(e);
    penIsDown.current = true;

    if (passedTimeIntervalId.current) {
      clearInterval(passedTimeIntervalId.current);
    }
    passedTimeIntervalId.current = setInterval(() => {
      const passedTime = Date.now() - startTime.current!;
      setPassedTime(passedTime / 1000);

      if (passedTime >= MAX_DRAWING_SECS * 1000) {
        handlePointerUp(undefined);
      }
    }, 1000 / 30);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = getCtx();
    if (penIsDown.current && ctx && inCanvas(getPosition(e))) {
      const lastPoint = pointsRef.current[pointsRef.current.length - 1];
      const point = addPoint(e);
      ctx.lineWidth = 2;
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  };

  return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        marginBottom="30px"
      >
        <canvas
          id="draw-canvas"
          ref={canvasRef}
          width={`${CANVAS_WIDTH}px`}
          height={`${CANVAS_HEIGHT}px`}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerOut={handlePointerUp}
          onPointerMove={handlePointerMove}
        />
      </Box>
  );
};