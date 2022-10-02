import { Box } from '@mui/material';
import React from 'react';

import IllustProducer from './components/IllustProducer';

const App = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box sx={{ width: "740px" }}>
        <IllustProducer />
      </Box>
    </Box>
  );
};

export default App;