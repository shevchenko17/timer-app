import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Paper, Typography, Button, Box, LinearProgress, Alert } from '@mui/material';
import PropTypes from 'prop-types';
import TimeInput from '../TimeInput/TimeInput';

const Countdown: React.FC = React.memo(() => {
  const [initialTime, setInitialTime] = useState(300); 
  const [currentTime, setCurrentTime] = useState(300);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const handleTimeChange = useCallback((seconds: number) => {
    if (!isActive) {
      setInitialTime(seconds);
      setCurrentTime(seconds);
    }
  }, [isActive]);

  const handleStartPause = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setIsActive(false);
    setCurrentTime(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (isActive && currentTime > 0) {
      intervalRef.current = window.setInterval(() => {
        setCurrentTime(prev => prev - 1);
      }, 1000);
    } else if (!isActive || currentTime === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, currentTime]);

 
  useEffect(() => {
    if (currentTime === 0 && initialTime > 0) {
      audioRef.current?.play();
    }
  }, [currentTime, initialTime]);

  const formatTime = useCallback(() => {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [currentTime]);

  const progress = initialTime > 0 ? ((initialTime - currentTime) / initialTime) * 100 : 0;
  const isExpired = currentTime === 0 && initialTime > 0;

  Countdown.displayName = 'Countdown';

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Обратный отсчёт
      </Typography>

      <TimeInput totalSeconds={initialTime} onChange={handleTimeChange} disabled={isActive} />

      <Box sx={{ my: 3, textAlign: 'center' }}>
        <Typography variant="h1" sx={{ fontFamily: 'monospace' }}>
          {formatTime()}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
            Прогресс: {Math.round(progress)}%
          </Typography>
        </Box>
      </Box>

      {isExpired && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Время вышло!
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button variant="contained" onClick={handleStartPause} disabled={isExpired}>
          {isActive ? 'Пауза' : 'Старт'}
        </Button>
        <Button variant="outlined" color="error" onClick={handleReset}>
          Сброс
        </Button>
      </Box>
    </Paper>
  );
});

Countdown.propTypes = {};

export default Countdown;