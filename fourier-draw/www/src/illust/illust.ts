import { Point } from "./point"

export class Illust {
  points: Point[];
  startTime: number | undefined;
  penIsDown: boolean;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  canvasRect: DOMRect;

  constructor(canvas: HTMLCanvasElement) {
    this.points = [];
    this.canvas = canvas;
    this.penIsDown = false;

    this.ctx = this.canvas.getContext('2d');
    this.canvasRect = this.canvas.getBoundingClientRect();

    this.canvas.addEventListener("mousedown", this.mouseDownHandler.bind(this));
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler.bind(this));
    this.canvas.addEventListener("mouseup", this.mouseUpHandler.bind(this));

    console.log("canvasRect: " + this.canvasRect.left + ", " + this.canvasRect.top);
  }

  private initialize() {
    this.points = [];
    this.startTime = undefined;
    this.penIsDown = false;

    if (!this.ctx) {
      console.log("failed to clearing canvas");
    }
    this.ctx?.clearRect(0, 0, this.canvasRect.width, this.canvasRect.height);
    this.ctx?.beginPath();
  }

  private position(e: MouseEvent): { x: number, y: number } {
    const x = e.offsetX;
    const y = e.offsetY;

    return {x, y};
  }

  private inCanvas({ x, y }: { x: number, y: number }): boolean {
    if (x < 0 || y < 0 || this.canvasRect.width <= x || this.canvasRect.height <= y) {
      return false;
    }
    return true;
  }

  addPoint(e: MouseEvent): Point {
    const timestamp: number = Date.now();

    if (!this.startTime) {
      this.startTime = timestamp;
    }

    const { x, y } = this.position(e);

    this.points.push({
      x,
      y,
      time: timestamp - this.startTime,
    });

    return this.points[this.points.length - 1];
  }

  mouseDownHandler(e: MouseEvent) {
    const { x, y } = this.position(e);

    if (!this.inCanvas({ x, y })) {
      return;
    }

    console.log(x + ", " + y + ": mouseDown");
    this.initialize();

    const point = this.addPoint(e);
    this.penIsDown = true;
  }

  mouseMoveHandler(e: MouseEvent) {
    if (this.penIsDown && this.ctx && this.inCanvas(this.position(e))) {
      const lastPoint = this.points[this.points.length - 1];
      const point = this.addPoint(e);

      this.ctx.moveTo(lastPoint.x, lastPoint.y);
      this.ctx.lineTo(point.x, point.y);
      this.ctx.stroke();
    }
  }

  mouseUpHandler(e: MouseEvent) {
    if (this.penIsDown) {
      const { x, y } = this.position(e);
      console.log(x + ", " + y + ": mouseUp");
      this.addPoint(e);
      this.penIsDown = false;

      console.log("elapsed time: " + this.points[this.points.length - 1].time);
      console.log("No. of records: " + this.points.length);
    }
  }

  getPoints(removeGibbsFlag: boolean = false): Point[] {
    if (removeGibbsFlag) {
      const beforeFront: Point = { ...this.points[0] };
      const afterEnd: Point = { ...this.points[this.points.length - 1] };

      beforeFront.time -= 500;
      afterEnd.time += 500;

      return [beforeFront].concat(this.points, [afterEnd]);
    } else {
      return this.points;
    }
  }

  getDrawPeriod(): number {
    if (this.points.length > 0) {
      return this.points[this.points.length - 1].time - this.points[0].time;
    } else {
      return 0;
    }
  }
}