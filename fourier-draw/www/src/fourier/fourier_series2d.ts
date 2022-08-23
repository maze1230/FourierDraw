import { Point } from "illust/point";
import { FourierSeries } from "./fourier_series";

type KeyPoint = "x" | "y" | "time";

export class FourierSeries2D {
  num_terms: number;

  xs: Float32Array;
  ys: Float32Array;
  ts: Float32Array;

  FSx: FourierSeries;
  FSy: FourierSeries;

  constructor(points: Point[], num_terms: number) {
    const divided: { x: number[], y: number[], time: number[] } = Object.assign({},
      ...Object.keys(points[0])
        .map(key => ( { [key]: points.map(prop => prop[key as keyof Point])}))
    );

    this.num_terms = num_terms;

    this.xs = new Float32Array(divided.x);
    this.ys = new Float32Array(divided.y);
    this.ts = new Float32Array(divided.time);

    this.FSx = new FourierSeries(this.ts, this.xs, num_terms);
    this.FSy = new FourierSeries(this.ts, this.ys, num_terms);
  }

  getPoints(range: {from: number, to: number}, fps: number): Point[] {
    const ts = FourierSeries.getSamplingPoints(range, fps);

    const xs = this.FSx.calcPoints(ts);
    const ys = this.FSy.calcPoints(ts);

    const points: Point[] = [];

    for (let i = 0; i < ts.length; i++) {
      points.push( { x: xs[i], y: ys[i], time: ts[i] });
    }

    return points;
  }
}