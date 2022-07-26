import * as wasm from "fourier-draw-wasm";
import "./css/style.css"

import { Illust } from "./illust/illust";
import { Player } from "./illust/player";

const drawCanvas = document.getElementById('draw-canvas') as HTMLCanvasElement;
const illust = drawCanvas ? new Illust(drawCanvas) : null;

const playCanvas = document.getElementById('play-canvas') as HTMLCanvasElement;
const player = playCanvas ? new Player(playCanvas) : null;
const playButton = document.getElementById('player-button') as HTMLButtonElement;
if (player) {
  playButton.onclick = () => {
    if (illust) {
      const points = illust.getPoints().filter((elem, idx) => idx % 5 == 0);
      player.setPoints(points);
      requestAnimationFrame(player.play.bind(player));
    }
  }
}
