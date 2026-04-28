import React from 'react';
import { Container, Tabs, Tab, Box } from '@mui/material';
import Timer from './components/Timer/Timer';
import Countdown from './components/Countdown/Countdown';

function App() {
  const [tabValue, setTabValue] = React.useState(0);

  return (
    <Container>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label=" Секундомер (Задание 1)" />
          <Tab label=" Обратный отсчёт (Задание 2)" />
        </Tabs>
      </Box>
      
      {tabValue === 0 && <Timer />}
      {tabValue === 1 && <Countdown />}
    </Container>
  );
}

export default App;