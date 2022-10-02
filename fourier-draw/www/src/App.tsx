import { Box } from '@mui/material';
import FourierSeries2D from 'fourier/fourier_series2d';
import React, { useState } from 'react';

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
      <Box sx={{ width: "740px" }}>
        <IllustProducer setFourierSeries2D={setFourierSeries2D} />
      </Box>
    </Box>
  );
};

export default App;