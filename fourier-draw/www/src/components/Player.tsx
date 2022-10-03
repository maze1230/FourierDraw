import { Box, Button, FormGroup } from "@mui/material";
import FourierSeries2D from "fourier/fourier_series2d";
import React, { useEffect, useRef, useState } from "react";
import PlayerCanvas from "./PlayerCanvas";

import { Point } from "../illust/Point";
import SolidProgressBar from "./styles/SolidProgressBar";

const Player = ({
  fourierSeries2D
}: {
  fourierSeries2D: FourierSeries2D | undefined
}) => {
  const [playTime, setPlayTime] = useState<number>(0);
  const [playing, setPlaying] = useState(false);
  const points = useRef<Point[]>([]);

  const drawTimeRange = (!fourierSeries2D) ? { from: 0, to: 1 } : fourierSeries2D.drawTimeRange;
  useEffect(() => {
    if (fourierSeries2D) {
      points.current = fourierSeries2D.getPoints(60, drawTimeRange);
    } else {
      points.current = [];
    }
    setPlayTime(0);
  }, [fourierSeries2D]);


  if (!fourierSeries2D) {
    return (
      <Box>
        <PlayerCanvas
          points={[]}
          playing={false} 
          setPlaying={setPlaying}
          setPlayTime={setPlayTime}
        />
        <SolidProgressBar variant="determinate" value={100} />
        <FormGroup>
          <Button
            variant="contained"
            sx={{ marginTop: 3 }}
            disabled
          >
            Play
          </Button>
        </FormGroup>
      </Box>
    );
  }


  const progress = Math.ceil((playTime - drawTimeRange.from) / (drawTimeRange.to - drawTimeRange.from) * 100);

  const onClick = () => {
    // points.current = fourierSeries2D.getPoints(60, drawTimeRange);
    setPlaying((p) => !p);
  };

  return (
    <Box>
      <PlayerCanvas
        points={points.current}
        playing={playing}
        setPlaying={setPlaying}
        setPlayTime={setPlayTime}
      />
      <SolidProgressBar variant="determinate" value={progress} />
      <FormGroup>
        <Button
          variant="contained"
          sx={{ marginTop: 3 }}
          onClick={onClick}
        >
          { playing ? "Stop" : "Play" }
        </Button>
      </FormGroup>
    </Box>
  );
};

export default Player;
