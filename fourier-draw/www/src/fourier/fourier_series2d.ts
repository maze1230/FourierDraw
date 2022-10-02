import { Point } from "illust/Point";

import * as utils from '../utils';

import FourierSeries from "./fourier_series";
import FourierSeriesWasm from "./fourier_series_wasm";

type KeyPoint = "x" | "y" | "time";

export default class FourierSeries2D {
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
    useWasm = false
  ) {
    if (!points || !num_terms || !drawTimeRange) {
      this.num_terms = 0;
      this.drawTimeRange = { from: 0, to: 0 };

      return;
    }

    const divided: { x: number[], y: number[], time: number[] } = Object.assign({},
      ...Object.keys(points[0])
        .map(key => ({ [key]: points.map(prop => prop[key as keyof Point]) }))
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

    let useDrawTimeRange = this.drawTimeRange;
    if (drawTimeRange) {
      useDrawTimeRange = drawTimeRange;
    }
    const ts = FourierSeries.getSamplingPoints(useDrawTimeRange, fps);

    const xs = this.FSx.calcPoints(ts);
    const ys = this.FSy.calcPoints(ts);

    const points: Point[] = [];

    for (let i = 0; i < ts.length; i += 1) {
      points.push({ x: xs[i], y: ys[i], time: ts[i] });
    }

    return points;
  }

  exportAsBase64(): string | undefined {
    if (this.num_terms > 8 || !this.FSx || !this.FSy) {
      return undefined;
    }

    const nUint8 = new Uint8Array([this.num_terms]);

    // [0, period] is an interval, which is wanted to be drawn in canvas
    //  it must be indicated because of inserted period to remove Gibbs effect
    const periodF32 = new Float32Array([this.drawTimeRange.to]);
    const periodUint8 = new Uint8Array(periodF32.buffer);

    const fsxUint8 = this.FSx.convertToByteArray();
    const fsyUint8 = this.FSy.convertToByteArray();

    if (!fsxUint8 || !fsyUint8) {
      return undefined;
    }

    const array = utils.concatUint8Array([nUint8, periodUint8, fsxUint8, fsyUint8]);
    return utils.convertByteArrayToBase64(array);
  }

  static fromBase64(base64Str: string, useWasm = false): FourierSeries2D | undefined {
    const byteArray = utils.convertBase64ToByteArray(base64Str);

    if (!byteArray || byteArray.length === 0) {
      return undefined;
    }

    const nUint8 = byteArray[0];

    // n | period | FSx coeffs ( (n + 1) * 2 + 4) | FSy coeffs ( (n + 1 ) * 2 + 4)
    if (byteArray.length !== 1 + 4 + (nUint8 + 1) * 4 * 2 * 2 + 8) {
      return undefined;
    }

    const periodUint8 = byteArray.slice(1, 5);
    const periodF32 = new Float32Array(periodUint8.buffer);

    const fsxByteArray = byteArray.slice(5, 4 * (nUint8 + 1) * 2 + 5 + 4);
    const fsyByteArray = byteArray.slice(5 + 4 * (nUint8 + 1) * 2 + 4, 5 + 2 * 4 * (nUint8 + 1) * 2 + 8);

    const FS2d = new FourierSeries2D();

    FS2d.num_terms = nUint8;
    FS2d.drawTimeRange = { from: 0, to: periodF32[0] };
    if (useWasm) {
      FS2d.FSx = FourierSeriesWasm.fromByteArray(nUint8, fsxByteArray);
      FS2d.FSy = FourierSeriesWasm.fromByteArray(nUint8, fsyByteArray);
    } else {
      FS2d.FSx = FourierSeries.fromByteArray(nUint8, fsxByteArray);
      FS2d.FSy = FourierSeries.fromByteArray(nUint8, fsyByteArray);
    }

    return FS2d;
  }
}