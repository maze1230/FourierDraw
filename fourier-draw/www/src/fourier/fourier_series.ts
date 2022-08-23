export class FourierSeries {
  xs_sample: Float32Array;
  ys_sample: Float32Array;
  A: Float32Array;
  B: Float32Array;
  period: number;
  num_terms: number;

  constructor(xs: Float32Array, ys: Float32Array, num_terms: number = 10) {
    this.xs_sample = xs;
    this.ys_sample = ys;
    this.num_terms = num_terms;

    this.A = new Float32Array(this.num_terms + 1);
    this.B = new Float32Array(this.num_terms + 1);
    this.period = this.xs_sample[this.xs_sample.length - 1] - this.xs_sample[0];

    this.calc();
  }

  calc() {
    for (let n = 0; n <= this.num_terms; n++) {
      this.A[n] = 0;
      this.B[n] = 0;

      for (let i = 0; i < this.xs_sample.length - 1; i++) {
        const x1 = this.xs_sample[i], x2 = this.xs_sample[i + 1];
        const y1 = this.ys_sample[i], y2 = this.ys_sample[i + 1];

        const { addA, addB } = this.integrate_interval(x1, y1, x2, y2, n);

        this.A[n] += addA;
        this.B[n] += addB;
      }
    }
  }

  private integrate_interval(x1: number, y1: number, x2: number, y2: number, n: number)
    : { addA: number, addB: number } {

    if (x1 == x2) {
      return { addA: 0, addB: 0 };
    }

    // y = ax + b が (x1, y1), (x2, y2) を通る
    const a = (y2 - y1) / (x2 - x1);
    const b = y1 - a * x1;

    if (n == 0) {
      return { addA: (y1 + y2) * (x2 - x1) / this.period, addB: 0 };
    }

    const sin1 = Math.sin(2 * Math.PI * n * x1 / this.period);
    const sin2 = Math.sin(2 * Math.PI * n * x2 / this.period);
    const cos1 = Math.cos(2 * Math.PI * n * x1 / this.period);
    const cos2 = Math.cos(2 * Math.PI * n * x2 / this.period);

    const addA = ((y2 * sin2 - y1 * sin1) + a * (cos2 - cos1) * this.period / 2 / Math.PI / n) / Math.PI / n;
    const addB = ((y1 * cos1 - y2 * cos2) + a * (sin2 - sin1) * this.period / 2 / Math.PI / n) / Math.PI / n;

    return { addA, addB };
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
    const ys = new Float32Array(xs.length);

    for (let i = 0; i < xs.length; i++) {
      const x = xs[i];

      ys[i] = this.A[0] / 2;

      for (let n = 1; n <= this.num_terms; n++) {
        ys[i] += this.A[n] * Math.cos(2 * Math.PI * n * x / this.period);
        ys[i] += this.B[n] * Math.sin(2 * Math.PI * n * x / this.period);
      }
    }

    return ys;
  }
}