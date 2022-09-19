mod utils;

use std::{f32::consts::PI};

use js_sys::Float32Array;
use wasm_bindgen::prelude::*;

use web_sys::console::log_1;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub struct FourierSeries {
    n_points: usize,
    num_terms: usize,
    period: f32,
    A: Vec<f32>,
    B: Vec<f32>,
}

#[wasm_bindgen]
impl FourierSeries {
    pub fn new(n_points: usize, num_terms: usize) -> FourierSeries {
        FourierSeries {
            n_points: n_points,
            num_terms: num_terms,
            period: 0.0,
            A: vec![0_f32; num_terms + 1],
            B: vec![0_f32; num_terms + 1],
        }
    }

    pub fn A_ptr(&self) -> *const f32 {
        self.A.as_ptr()
    }

    pub fn B_ptr(&self) -> *const f32 {
        self.B.as_ptr()
    }

    pub fn calc(&mut self, xs: &[f32], ys: &[f32]) {
        self.period = xs[xs.len() - 1] - xs[0];

        for n in 0..=self.num_terms {
            self.A[n] = 0.0;
            self.B[n] = 0.0;

            for i in 0..(self.n_points - 1) {
                let (add_a, add_b) = self.integrate_interval(
                    xs[i], 
                    ys[i], 
                    xs[i + 1], 
                    ys[i + 1], 
                    n,
                );

                self.A[n] += add_a;
                self.B[n] += add_b;
            }
        }
    }

    fn integrate_interval(&self, x1: f32, y1: f32, x2: f32, y2: f32, n: usize) -> (f32, f32) {
        if x1 == x2 {
            return (0.0, 0.0);
        }

        let a = (y2 - y1) / (x2 - x1);

        if n == 0 {
            return ((y1 + y2) * (x2 - x1) / self.period, 0.0);
        }

        let n_f32 = n as f32;

        let (sin1, cos1) = (2.0 * PI * n_f32 * x1 / self.period).sin_cos();
        let (sin2, cos2) = (2.0 * PI * n_f32 * x2 / self.period).sin_cos();

        let add_a = ((y2 * sin2 - y1 * sin1) + a * (cos2 - cos1) * self.period / 2.0 / PI / n_f32) / PI / n_f32;
        let add_b = ((y1 * cos1 - y2 * cos2) + a * (sin2 - sin1) * self.period / 2.0 / PI / n_f32) / PI / n_f32;

        (add_a, add_b)
    }

    pub fn calc_points(&self, xs: &[f32]) -> Float32Array {
        let mut ys = vec![0_f32; xs.len()];
        
        for i in 0..xs.len() {
            let x = xs[i];

            ys[i] = self.A[0] / 2.0;

            for n in 1..=self.num_terms {
                ys[i] += self.A[n] * (2.0 * PI * (n as f32) * x / self.period).cos();
                ys[i] += self.B[n] * (2.0 * PI * (n as f32) * x / self.period).sin();
            }
        }

        Float32Array::from(ys.as_slice())
    }
// pub unsafe fn array_sum(ptr: *mut u8, len: usize) -> u8 {
//     // create a Vec<u8> from the pointer to the
//     // linear memory and the length
//     let data = Vec::from_raw_parts(ptr, len, len);

}

fn log(s: &String) {
    log_1(&JsValue::from(s));
}