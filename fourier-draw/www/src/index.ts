import * as wasm from "fourier-draw-wasm";
import "./css/style.css"

import { Illust } from "./illust/illust";

const drawCanvas = document.getElementById('draw-canvas') as HTMLCanvasElement;
const illust = drawCanvas ? new Illust(drawCanvas) : null;

