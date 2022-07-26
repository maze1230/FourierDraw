import { Point } from "./point";

export class Player {
  points: Point[];
  startTime: number | undefined;
  lastPointIdx: number;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.points = [];
    this.lastPointIdx = 0;
  }

  setPoints(points: Point[]) {
    this.points = [...points];
  }

  initialize() {
    const canvasRect = this.canvas.getBoundingClientRect();
    this.ctx?.clearRect(0, 0, canvasRect.width, canvasRect.height);
    this.ctx?.beginPath();
  }

  play(timestamp: number) {
    if (!this.startTime) {
      this.initialize();
      this.startTime = timestamp;
      this.lastPointIdx = 0;
    }

    const elapsedTime = timestamp - this.startTime;
    for (let i = this.lastPointIdx + 1; i < this.points.length && this.points[i].time <= elapsedTime; i++) {
      const lastPoint = this.points[this.lastPointIdx];
      const point = this.points[i];

      this.ctx?.moveTo(lastPoint.x, lastPoint.y);
      this.ctx?.lineTo(point.x, point.y);
      this.ctx?.stroke();

      this.lastPointIdx = i;
    }

    if (this.lastPointIdx < this.points.length - 1) {
      window.requestAnimationFrame(this.play.bind(this));
    } else {
      this.startTime = undefined;
    }
  }
};