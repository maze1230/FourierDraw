import { Box, Stack } from '@mui/material';
import FourierSeries2D from 'fourier/fourier_series2d';
import React, { useState } from 'react';

import IllustConsumer from './components/IllustConsumer';
import IllustProducer from './components/IllustProducer';

import "./css/style.css";

const App = () => {
  const [fourierSeries2D, setFourierSeries2D] = useState<FourierSeries2D | undefined>(undefined);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Stack spacing={10} sx={{ width: "740px" }}>
        <IllustProducer setFourierSeries2D={setFourierSeries2D} />
        <IllustConsumer fourierSeries2D={fourierSeries2D} />
      </Stack>
    </Box>
  );
};

export default App;