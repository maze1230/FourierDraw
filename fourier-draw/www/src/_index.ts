import "./css/style.css";

import { convertTermStringToInteger } from "./utils";

import Illust from "./illust/illust";
import Player from "./illust/player";
import FourierSeries2D from "./fourier/fourier_series2d";

const drawCanvas = document.getElementById("draw-canvas") as HTMLCanvasElement;
const illust = drawCanvas ? new Illust(drawCanvas) : null;

const playCanvas = document.getElementById("play-canvas") as HTMLCanvasElement;
const player = playCanvas ? new Player(playCanvas) : null;
const playButton = document.getElementById(
  "player-button"
) as HTMLButtonElement;

const removeGibbsCheckBox = document.getElementById(
  "remove-gibbs-checkbox"
) as HTMLInputElement;
const useWasmCheckBox = document.getElementById(
  "use-wasm-checkbox"
) as HTMLInputElement;
const termNumInput = document.getElementById(
  "term-num-input"
) as HTMLInputElement;
const curretTermNum = document.getElementById(
  "current-term-num"
) as HTMLElement;

termNumInput.addEventListener("input", (e) => {
  const termNum = convertTermStringToInteger(termNumInput.value);
  if (termNum >= 1 && termNum <= 100000) {
    curretTermNum.innerText = "✔";
  } else {
    curretTermNum.innerText = "✗";
  }
});

if (player) {
  playButton.onclick = () => {
    const termNum = convertTermStringToInteger(termNumInput.value);
    if (illust && termNum >= 1 && termNum <= 100000) {
      const points = illust.getPoints(removeGibbsCheckBox.checked);
      const drawTimeRange = {
        from: 0,
        to: illust.getDrawPeriod(),
      };
      const beforeFSExpansion = Date.now();
      const fs2d = new FourierSeries2D(
        points,
        termNum,
        drawTimeRange,
        useWasmCheckBox.checked
      );
      const afterFSExpansion = Date.now();

      console.log(
        "Fourier Series Expansion takes:",
        afterFSExpansion - beforeFSExpansion
      );

      const fourierPoints = fs2d.getPoints(60);

      const afterGetPoints = Date.now();
      console.log(
        "Points calculation takes:",
        afterGetPoints - afterFSExpansion
      );

      player.setPoints(fourierPoints);

      /*
        TODO:
        If we call requestAnimationFrame here,
          player.play receives timestamp of the time when this button clicked.
        Therefore, I pass performance.now() directly to player.play() but this is quickfix.
      */
      player.play(performance.now());
    }
  };
}
