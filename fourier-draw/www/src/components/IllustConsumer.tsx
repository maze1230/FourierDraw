import { Box, Tab, Tabs } from '@mui/material';
import FourierSeries2D from 'fourier/fourier_series2d';
import React, { useState } from 'react';

import IllustExporter from './IllustExporter';
import Player from './Player';
import BorderBox from './styles/BorderBox';

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

const TabPanel = ({
  children = undefined,
  index,
  value,
}: TabPanelProps) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`consumer-tabpanel-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
);

const IllustConsumer = ({
  fourierSeries2D
}:{
  fourierSeries2D: FourierSeries2D | undefined
}) => {
  const [value, setValue] = useState(0);

  const handleChange = (e: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <BorderBox>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Play" id="consumer-tab-0" />
          <Tab label="Export" id="consumer-tab-1" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Player fourierSeries2D={fourierSeries2D} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <IllustExporter />
      </TabPanel>
    </BorderBox>
  )
};

export default IllustConsumer;