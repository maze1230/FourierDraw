import * as utils from '../utils';

import { Point } from "illust/point";
import { FourierSeries } from "./fourier_series";
import { FourierSeriesWasm } from "./fourier_series_wasm";

type KeyPoint = "x" | "y" | "time";

type FourierSeries2DInitializer = {

};

export class FourierSeries2D {
  num_terms: number;
  drawTimeRange: { from: number, to: number };

  xs: Float32Array | undefined;
  ys: Float32Array | undefined;
  ts: Float32Array | undefined;

  FSx: FourierSeries | FourierSeriesWasm | undefined;
  FSy: FourierSeries | FourierSeriesWasm | undefined;

  constructor(
    points: Point[] | undefined = undefined,
    num_terms: number | undefined = undefined,
    drawTimeRange: { from: number, to: number } | undefined = undefined,
    useWasm: boolean = false
  ) {
    if (!points || !num_terms || !drawTimeRange) {
      this.num_terms = 0;
      this.drawTimeRange = { from: 0, to: 0 };

      return;
    }

    const divided: { x: number[], y: number[], time: number[] } = Object.assign({},
      ...Object.keys(points[0])
        .map(key => ( { [key]: points.map(prop => prop[key as keyof Point])}))
    );

    this.num_terms = num_terms;
    this.drawTimeRange = drawTimeRange;

    this.xs = new Float32Array(divided.x);
    this.ys = new Float32Array(divided.y);
    this.ts = new Float32Array(divided.time);

    if (useWasm) {
      this.FSx = new FourierSeriesWasm(this.ts, this.xs, num_terms);
      this.FSy = new FourierSeriesWasm(this.ts, this.ys, num_terms);
    } else {
      this.FSx = new FourierSeries(this.ts, this.xs, num_terms);
      this.FSy = new FourierSeries(this.ts, this.ys, num_terms);
    }
  }

  getPoints(fps: number, drawTimeRange: undefined | { from: number, to: number } = undefined): Point[] {
    if (!this.FSx || !this.FSy) {
      return [];
    }

    if (!drawTimeRange) {
      drawTimeRange = this.drawTimeRange;
    }
    const ts = FourierSeries.getSamplingPoints(drawTimeRange, fps);

    const xs = this.FSx.calcPoints(ts);
    const ys = this.FSy.calcPoints(ts);

    const points: Point[] = [];

    for (let i = 0; i < ts.length; i++) {
      points.push( { x: xs[i], y: ys[i], time: ts[i] });
    }

    return points;
  }

  exportAsBase64(): string | undefined{
    if (this.num_terms > 8 || !this.FSx || !this.FSy) {
      return undefined;
    }

    const n_uint8 = new Uint8Array([this.num_terms]);
    
    // [0, period] is an interval, which is wanted to be drawn in canvas
    //  it must be indicated because of inserted period to remove Gibbs effect
    const _period_f32 = new Float32Array([this.drawTimeRange.to]);
    const period_uint8 = new Uint8Array(_period_f32.buffer);
    
    const fsx_uint8 = this.FSx.convertToByteArray();
    const fsy_uint8 = this.FSy.convertToByteArray();

    if (fsx_uint8 === void 0 || fsy_uint8 === void 0) {
      return undefined;
    }

    const array = utils.concatUint8Array([n_uint8, period_uint8, fsx_uint8, fsy_uint8]);
    return utils.convertByteArrayToBase64(array);
  }

  static fromBase64(base64Str: string, useWasm: boolean = false): FourierSeries2D | undefined {
    const byteArray = utils.convertBase64ToByteArray(base64Str);

    if (byteArray === void 0 || byteArray.length == 0) {
      return undefined;
    }

    const n_uint8 = byteArray[0];

    // n | period | FSx coeffs ( (n + 1) * 2 + 4) | FSy coeffs ( (n + 1 ) * 2 + 4)
    if (byteArray.length != 1 + 4 + (n_uint8 + 1) * 4 * 2 * 2 + 8) {
      return undefined;
    }

    const _period_uint8 = byteArray.slice(1, 5);
    const period_f32 = new Float32Array(_period_uint8.buffer);

    const fsx_byteArray = byteArray.slice(5, 4 * (n_uint8 + 1) * 2 + 5 + 4);
    const fsy_byteArray = byteArray.slice(5 + 4 * (n_uint8 + 1) * 2 + 4, 5 + 2 * 4 * (n_uint8 + 1) * 2 + 8);

    const FS2d = new FourierSeries2D();

    FS2d.num_terms = n_uint8;
    FS2d.drawTimeRange = { from: 0, to: period_f32[0] };
    if (useWasm) {
      FS2d.FSx = FourierSeriesWasm.fromByteArray(n_uint8, fsx_byteArray);
      FS2d.FSy = FourierSeriesWasm.fromByteArray(n_uint8, fsy_byteArray);
    } else {
      FS2d.FSx = FourierSeries.fromByteArray(n_uint8, fsx_byteArray);
      FS2d.FSy = FourierSeries.fromByteArray(n_uint8, fsy_byteArray);
    }

    return FS2d;
  }
}