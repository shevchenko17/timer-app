import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';
import PropTypes from 'prop-types';

interface TimerProps {
  title?: string;
}

const Timer: React.FC<TimerProps> = React.memo(({ title = "Секундомер" }) => {
  const [time, setTime] = useState(0); 
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  
  const formatTime = useCallback(() => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  }, [time]);


  const handleStartPause = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setTime(0);
  }, []);

 
  useEffect(() => {
    if (isRunning) {
      const startTime = Date.now() - time;
      intervalRef.current = window.setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, time]);

  Timer.displayName = 'Timer';

  return (
    <Paper elevation={3} sx={{ p: 4, textAlign: 'center', maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>{title}</Typography>
      <Typography variant="h2" sx={{ fontFamily: 'monospace', my: 3 }}>
        {formatTime()}
      </Typography>
      <Box sx={{ '& button': { m: 1 } }}>
        <Button variant="contained" onClick={handleStartPause}>
          {isRunning ? 'Пауза' : 'Старт'}
        </Button>
        <Button variant="outlined" color="error" onClick={handleReset}>
          Сброс
        </Button>
      </Box>
    </Paper>
  );
});



Timer.propTypes = {
  title: PropTypes.string,
};

export default Timer;