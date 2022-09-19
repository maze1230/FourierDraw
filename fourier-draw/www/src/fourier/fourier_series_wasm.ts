import * as wasm from 'fourier-draw-wasm';
import { memory } from 'fourier-draw-wasm/fourier_draw_bg.wasm';

export class FourierSeriesWasm {
  fourierSeries: wasm.FourierSeries
  A: Float32Array;
  B: Float32Array;
  num_terms: number;
  period: number;

  constructor(xs: Float32Array, ys: Float32Array, num_terms: number = 10) {
    const n_points: number = xs.length;
    this.fourierSeries = wasm.FourierSeries.new(n_points, num_terms);

    this.num_terms = num_terms;
    this.period = xs[xs.length - 1] - xs[0];

    this.A = new Float32Array(memory.buffer, this.fourierSeries.A_ptr(), this.num_terms + 1);
    this.B = new Float32Array(memory.buffer, this.fourierSeries.B_ptr(), this.num_terms + 1);

    this.fourierSeries.calc(xs, ys);
  }

  static getSamplingPoints(range: { from: number, to: number }, fps: number = 60) {
    const msecPerFrame = 1000 / fps;
    const ts: number[] = [];

    for (let t = range.from; t < range.to; t += msecPerFrame) {
      ts.push(t);
    }

    return new Float32Array(ts);
  }

  calcPoints(xs: Float32Array): Float32Array {
    return this.fourierSeries.calc_points(xs);
  }
}