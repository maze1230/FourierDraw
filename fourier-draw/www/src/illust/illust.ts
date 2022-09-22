import { Point } from "./point"

export class Illust {
  points: Point[];
  startTime: number | undefined;
  penIsDown: boolean;

  passedTimeIntervalId: NodeJS.Timer | undefined;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  canvasRect: DOMRect;

  constructor(canvas: HTMLCanvasElement) {
    this.points = [];
    this.canvas = canvas;
    this.penIsDown = false;

    this.ctx = this.canvas.getContext('2d');
    this.canvasRect = this.canvas.getBoundingClientRect();

    this.canvas.addEventListener("pointerdown", this.pointerDownHandler.bind(this));
    this.canvas.addEventListener("pointermove", this.pointerMoveHandler.bind(this));
    this.canvas.addEventListener("pointerup", this.pointerUpHandler.bind(this));
    this.canvas.addEventListener("pointerout", this.pointerUpHandler.bind(this));
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

  private position(e: PointerEvent): { x: number, y: number } {
    const x = e.offsetX;
    const y = e.offsetY;

    return { x, y };
  }

  private inCanvas({ x, y }: { x: number, y: number }): boolean {
    if (x < 0 || y < 0 || this.canvasRect.width <= x || this.canvasRect.height <= y) {
      return false;
    }
    return true;
  }

  addPoint(e: PointerEvent): Point {
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

  pointerDownHandler(e: PointerEvent) {
    const { x, y } = this.position(e);

    if (!this.inCanvas({ x, y })) {
      return;
    }

    this.initialize();

    const point = this.addPoint(e);
    this.penIsDown = true;

    if (this.passedTimeIntervalId) {
      clearInterval(this.passedTimeIntervalId);
    }
    this.passedTimeIntervalId = setInterval(() => {
      const passedTimeElement = document.getElementById('passed-drawing-time') as HTMLElement;
      const passedTime = Date.now() - this.startTime!;
      passedTimeElement.innerText = (passedTime / 1000).toString();

      if (passedTime >= 10000) {
        this.pointerUpHandler(undefined);
      }
    }, 1000 / 30);
  }

  pointerMoveHandler(e: PointerEvent) {
    if (this.penIsDown && this.ctx && this.inCanvas(this.position(e))) {
      const lastPoint = this.points[this.points.length - 1];
      const point = this.addPoint(e);

      this.ctx.moveTo(lastPoint.x, lastPoint.y);
      this.ctx.lineTo(point.x, point.y);
      this.ctx.stroke();
    }
  }

  pointerUpHandler(e: PointerEvent | undefined) {
    if (this.penIsDown) {
      clearInterval(this.passedTimeIntervalId);

      if (e) {
        const { x, y } = this.position(e);
        this.addPoint(e);
      }
      this.penIsDown = false;
    }
  }

  getPoints(removeGibbsFlag: boolean = false): Point[] {
    if (removeGibbsFlag) {
      const beforeFront: Point = { ...this.points[0] };
      const afterEnd: Point = { ...this.points[this.points.length - 1] };

      const period = afterEnd.time;

      beforeFront.time -= period / 10;
      afterEnd.time += period / 10;

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