import React, { useState } from "react";

import { Box, Button, Checkbox, FormControlLabel, FormGroup, TextField } from "@mui/material";
import { useSnackbar } from "notistack";

import FourierSeries2D from "../fourier/fourier_series2d";

const IllustLoader = ({
  setFourierSeries2D,
}: {
  setFourierSeries2D: React.Dispatch<React.SetStateAction<FourierSeries2D | undefined>>,
}) => {
  const [base64Text, setBase64Text] = useState<string>("");
  const [ useWasm, setUseWasm ] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleChecked = (
    setState: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setState((flag) => !flag);
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBase64Text(e.currentTarget.value);
  };

  const onClick = () => {
    const fs2d = FourierSeries2D.fromBase64(base64Text, useWasm);

    if (fs2d) {
      setFourierSeries2D(fs2d);
      enqueueSnackbar(
        "Successfully Imported Illust!",
        {
          variant: "success",
        }
      );
    } else {
      enqueueSnackbar(
        "Failed to Import Illust",
        {
          variant: "error",
        }
      );
    }
  };

  return (
    <Box>
      <FormGroup>
        <TextField
          multiline
          rows={5}
          placeholder="Exported String"
          onChange={onChange}
          sx={{ marginBottom: "30px" }}
        />
        <FormControlLabel
          control={
            <Checkbox onChange={() => handleChecked(setUseWasm)} checked={useWasm} />
          }
          label="WebAssemblyを使用する"
        />
        <Button
          variant="contained"
          sx={{ marginTop: 3 }}
          onClick={onClick}
        >
          Import
        </Button>
      </FormGroup>
    </Box>
  );
};

export default IllustLoader;
