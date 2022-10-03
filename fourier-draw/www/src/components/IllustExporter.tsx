import React, { useState } from "react";

import { Box, Button, FormGroup } from "@mui/material";
import { useSnackbar } from "notistack";

import FourierSeries2D from "../fourier/fourier_series2d";
import CopyTextField from "./CopyAndShareTextField";

const IllustExporter = ({
  fourierSeries2D,
}: {
  fourierSeries2D: FourierSeries2D | undefined,
}) => {
  const [base64Text, setBase64Text] = useState<string>("");
  const { enqueueSnackbar } = useSnackbar();

  const onClick = () => {
    if (!fourierSeries2D) {
      setBase64Text("Convert or Import illust beforehand");
      enqueueSnackbar(
        "Failed to Export!",
        {
          variant: "error"
        }
      );
      return;
    }
    const text = fourierSeries2D.exportAsBase64();
    if (!text) {
      setBase64Text("Cannot export. No. of terms must be lower or equal to 7.");
      enqueueSnackbar(
        "Failed to Export!",
        {
          variant: "error"
        }
      );
      return;
    }
    setBase64Text(text);
  };
  return (
    <Box>
      <CopyTextField text={base64Text} />
      <FormGroup>
        <Button
          variant="contained"
          sx={{ marginTop: 3 }}
          onClick={onClick}
        >
          Export
        </Button>
      </FormGroup>
    </Box>
  );
};

export default IllustExporter;