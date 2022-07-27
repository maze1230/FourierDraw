import { Point } from "illust/point";
import { FourierSeries } from "./fourier_series";

type KeyPoint = "x" | "y" | "time";

export class FourierSeries2D {
  num_terms: number;

  xs: Float64Array;
  ys: Float64Array;
  ts: Float64Array;

  FSx: FourierSeries;
  FSy: FourierSeries;

  constructor(points: Point[], num_terms: number) {
    const divided: { x: number[], y: number[], time: number[] } = Object.assign({},
      ...Object.keys(points[0])
        .map(key => ( { [key]: points.map(prop => prop[key as keyof Point])}))
    );

    this.num_terms = num_terms;

    this.xs = new Float64Array(divided.x);
    this.ys = new Float64Array(divided.y);
    this.ts = new Float64Array(divided.time);

    console.log('calculating FSx');
    this.FSx = new FourierSeries(this.ts, this.xs, num_terms);
    console.log('calculating FSy');
    this.FSy = new FourierSeries(this.ts, this.ys, num_terms);
  }

  getPoints(fps: number): Point[] {
    const { xs: ts, ys: xs } = this.FSx.getPoints(undefined, 60);
    const { ys: ys } = this.FSy.getPoints(ts);

    const points: Point[] = [];

    console.log('xs_length: ' + xs.length);
    console.log('ys_length: ' + ys.length);
    console.log('ts_length: ' + ts.length);

    for (let i = 0; i < ts.length; i++) {
      points.push( { x: xs[i], y: ys[i], time: ts[i] });

      if (i % 20 == 0) {
        console.log("x: " + xs[i] + ", y: " + ys[i] + ", t: " + ts[i]);
      }
    }

    return points;
  }
}