import { Box, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';

import DrawCanvas from './DrawCanvas';
import IllustLoader from './IllustLoader';
import BorderBox from './styled/BorderBox';

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

const IllustProducer = () => {
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
        <DrawCanvas />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <IllustLoader />
      </TabPanel>
    </BorderBox>
  )
};

export default IllustProducer;