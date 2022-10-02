import { Box, Tab, Tabs } from '@mui/material';
import FourierSeries2D from 'fourier/fourier_series2d';
import React, { useState } from 'react';

import DrawForm from './DrawForm';
import IllustLoader from './IllustLoader';
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
      id={`producer-tabpanel-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
);

const IllustProducer = ({
  setFourierSeries2D
}:{
  setFourierSeries2D: React.Dispatch<React.SetStateAction<FourierSeries2D | undefined>>
}) => {
  const [value, setValue] = useState(0);

  const handleChange = (e: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <BorderBox>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Draw" id="producer-tab-0" />
          <Tab label="Import" id="producer-tab-1" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <DrawForm setFourierSeries2D={setFourierSeries2D} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <IllustLoader />
      </TabPanel>
    </BorderBox>
  )
};

export default IllustProducer;