import * as wasm from 'fourier-draw-wasm';
import { memory } from 'fourier-draw-wasm/fourier_draw_bg.wasm';

import * as utils from '../utils';

export default class FourierSeriesWasm {
  fourierSeries: wasm.FourierSeries | undefined

  A: Float32Array | undefined;

  B: Float32Array | undefined;

  num_terms: number | undefined;

  period: number | undefined;

  constructor(
    xs: Float32Array | undefined = undefined,
    ys: Float32Array | undefined = undefined,
    num_terms = 10
  ) {
    if (!xs || !ys) {
      return;
    }
    const nPoints: number = xs.length;
    this.fourierSeries = wasm.FourierSeries.new(nPoints, num_terms);

    this.num_terms = num_terms;
    this.period = xs[xs.length - 1] - xs[0];

    this.A = new Float32Array(memory.buffer, this.fourierSeries.A_ptr(), this.num_terms + 1);
    this.B = new Float32Array(memory.buffer, this.fourierSeries.B_ptr(), this.num_terms + 1);

    this.fourierSeries.calc(xs, ys);
  }

  static getSamplingPoints(range: { from: number, to: number }, fps = 60) {
    const msecPerFrame = 1000 / fps;
    const ts: number[] = [];

    for (let t = range.from; t < range.to; t += msecPerFrame) {
      ts.push(t);
    }

    return new Float32Array(ts);
  }

  calcPoints(xs: Float32Array): Float32Array {
    if (!this.fourierSeries) {
      return new Float32Array([]);
    }
    return this.fourierSeries.calc_points(xs);
  }

  convertToByteArray(): Uint8Array | undefined {
    if (!this.A || !this.B || !this.fourierSeries) {
      return undefined;
    }
    const byteA = new Uint8Array(memory.buffer, this.fourierSeries.A_ptr(), 4 * (this.fourierSeries.num_terms + 1));
    const byteB = new Uint8Array(memory.buffer, this.fourierSeries.B_ptr(), 4 * (this.fourierSeries.num_terms + 1));
    const periodF32 = new Float32Array([this.fourierSeries.period]);
    const periodUint8 = new Uint8Array(periodF32.buffer);

    return utils.concatUint8Array([byteA, byteB, periodUint8]);
  }

  static fromByteArray(n: number, array: Uint8Array): FourierSeriesWasm | undefined {
    if ((n + 1) * 2 * 4 + 4 !== array.length) {
      return undefined;
    }

    const fs = new FourierSeriesWasm();

    const byteA = array.slice(0, 4 * (n + 1));
    const byteB = array.slice(4 * (n + 1), 4 * 2 * (n + 1));
    const periodUint8 = array.slice(4 * 2 * (n + 1), 4 * 2 * (n + 1) + 4);
    const period = new Float32Array(periodUint8.buffer);

    fs.fourierSeries = wasm.FourierSeries.new(0, n);

    fs.A = new Float32Array(memory.buffer, fs.fourierSeries.A_ptr(), n + 1);
    fs.B = new Float32Array(memory.buffer, fs.fourierSeries.B_ptr(), n + 1);

    fs.A.set(new Float32Array(byteA.buffer));
    fs.B.set(new Float32Array(byteB.buffer));

    [fs.fourierSeries.period] = period;
    fs.fourierSeries.num_terms = n;

    return fs;
  }
}