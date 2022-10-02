import React, { useState } from "react";

import { Box, Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, Modal, Stack, TextField, Typography } from "@mui/material";

import { Point } from "../illust/Point";
import { DrawCanvas, MAX_DRAWING_SECS } from "./DrawCanvas";

import { convertTermStringToInteger, validateTermString } from "../utils";
import FourierSeries2D from "../fourier/fourier_series2d";
import SolidProgressBar from "./styles/SolidProgressBar";

const transformPoints = (points: Point[], removeGibbs: boolean): Point[] => {
  if (removeGibbs) {
    const beforeFront: Point = { ...points[0] };
    const afterEnd: Point = { ...points[points.length - 1] };

    const period = afterEnd.time;

    beforeFront.time -= period / 10;
    afterEnd.time += period / 10;

    return [beforeFront].concat(points, [afterEnd]);
  }
  return points;
};

const getDrawPeriod = (points: Point[]): number => {
  if (points.length > 0) {
    return points[points.length - 1].time - points[0].time;
  }
  return 0;
};

const DrawForm = ({
  setFourierSeries2D
}: {
  setFourierSeries2D: React.Dispatch<React.SetStateAction<FourierSeries2D | undefined>>
}) => {
  const [ modalOpen, setModalOpen ] = useState<boolean>(false);

  const [ points, setPoints ] = useState<Point[]>([]);

  const [ passedTime, setPassedTime ] = useState<number>(0);
  const [ termStr, setTermStr ] = useState<string>("10");
  const [ removeGibbs, setRemoveGibbs ] = useState<boolean>(false);
  const [ useWasm, setUseWasm ] = useState<boolean>(false);

  const progress = passedTime / MAX_DRAWING_SECS * 100;

  const handleTermStrChange: React.ChangeEventHandler<HTMLInputElement> = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTermStr(e.currentTarget.value);
  };

  const handleChecked = (
    setState: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setState((flag) => !flag);
  };

  const termStrIsValid = validateTermString(termStr);

  const onClick = () => {
    const termNum = convertTermStringToInteger(termStr);
    const drawingPeriod = getDrawPeriod(points);
    const pointsForConvert = transformPoints(points, removeGibbs);

    if (termNum >= 1000) {
      setModalOpen(true);
    }

    setTimeout(() => {
      setFourierSeries2D(
        new FourierSeries2D(
          pointsForConvert,
          termNum,
          { from: 0, to: drawingPeriod },
          useWasm
        )
      );
      if (termNum >= 1000) {
        setModalOpen(false);
      }
    }, 50);
  };
  
  const canConvert = termStrIsValid && points.length !== 0;

  return (
    <Box>
      <DrawCanvas
        setPoints={setPoints}
        setPassedTime={setPassedTime}
      />
      <Stack direction="row" alignItems="center">
        <Box width="80%" marginRight="20px">
          <SolidProgressBar variant="determinate" value={progress} />
        </Box>
        <Typography> <span id="passed-drawing-time"> {`${passedTime}`} </span> / {`${MAX_DRAWING_SECS}s`}</Typography>
      </Stack>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox onChange={() => handleChecked(setRemoveGibbs)} checked={removeGibbs} />
          }
          label="最初と最後を綺麗にする(表現力が低下します)"
        />
        <FormControlLabel
          control={
            <Checkbox onChange={() => handleChecked(setUseWasm)} checked={useWasm} />
          }
          label="WebAssemblyを使用する"
        />
        <TextField
          error={!termStrIsValid}
          id="term-num-input-error"
          label="項数"
          helperText={termStrIsValid ? " " : "1以上100000以下の整数"}
          type="number"
          variant="standard"
          value={termStr}
          onChange={handleTermStrChange}
        />
        <Button
          variant="contained"
          sx={{ marginTop: 3 }}
          onClick={onClick}
          disabled={!canConvert}
        >
          Convert
        </Button>
      </FormGroup>
      <Modal
        open={modalOpen}
      >
        <Stack
          display="flex"
          justifyContent="center"
          alignItems="center"
          spacing={3}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: "primary.main",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography>
            計算中です...
          </Typography>
          <CircularProgress disableShrink />
        </Stack>
      </Modal>
    </Box>
  );
};

export default DrawForm;