import * as wasm from "fourier-draw-wasm";
import "./css/style.css"

import { Illust } from "./illust/illust";
import { Player } from "./illust/player";
import { FourierSeries2D } from "./fourier/fourier_series2d";

const drawCanvas = document.getElementById('draw-canvas') as HTMLCanvasElement;
const illust = drawCanvas ? new Illust(drawCanvas) : null;

const playCanvas = document.getElementById('play-canvas') as HTMLCanvasElement;
const player = playCanvas ? new Player(playCanvas) : null;
const playButton = document.getElementById('player-button') as HTMLButtonElement;

const removeGibbsCheckBox = document.getElementById('remove-gibbs-checkbox') as HTMLInputElement;
const termNumInput = document.getElementById('term-num-input') as HTMLInputElement;
const curretTermNum = document.getElementById('current-term-num') as HTMLElement;

termNumInput.addEventListener('input',
  (e) => {
    const termNum = parseInt(termNumInput.value);
    if (1 <= termNum && termNum <= 100000) {
      curretTermNum.innerText = "✔";
    } else {
      curretTermNum.innerText = "✗";
    }
  }
);

if (player) {
  playButton.onclick = () => {
    const termNum = parseInt(termNumInput.value);
    if (illust && 1 <= termNum && termNum <= 100000) {
      const points = illust.getPoints(removeGibbsCheckBox.checked);
      const drawTimeRange = {
        from: 0,
        to: illust.getDrawPeriod()
      };
      console.log(points.length, drawTimeRange);

      const fs2d = new FourierSeries2D(points, termNum);
      const fourier_points = fs2d.getPoints(drawTimeRange, 60);

      player.setPoints(fourier_points);

      /*
        TODO:
        If we call requestAnimationFrame here,
          player.play receives timestamp of the time when this button clicked.
        Therefore, I pass performance.now() directly to player.play() but this is quickfix.
      */
      player.play(performance.now());
    }
  }
}
