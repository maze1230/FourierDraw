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

if (player) {
  playButton.onclick = () => {
    if (illust) {
      const points = illust.getPoints();

      const fs2d = new FourierSeries2D(points, 10000);
      const fourier_points = fs2d.getPoints(60);

      player.setPoints(fourier_points);
      requestAnimationFrame(player.play.bind(player));
    }
  }
}
