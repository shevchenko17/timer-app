import React, { useCallback } from 'react';
import { Box, TextField, Slider, Typography } from '@mui/material';
import PropTypes from 'prop-types';

interface TimeInputProps {
  totalSeconds: number;
  onChange: (seconds: number) => void;
  disabled?: boolean;
}

const TimeInput: React.FC<TimeInputProps> = React.memo(({ totalSeconds, onChange, disabled = false }) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const handleMinutesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinutes = Math.min(720, Math.max(0, parseInt(e.target.value) || 0));
    onChange(newMinutes * 60 + seconds);
  }, [seconds, onChange]);

  const handleSecondsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newSeconds = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));
    onChange(minutes * 60 + newSeconds);
  }, [minutes, onChange]);

  const handleSliderChange = useCallback((_event: Event, value: number | number[]) => {
    const secondsValue = Math.round((value as number) * 15); // шаг 15 секунд
    onChange(Math.min(720 * 60, secondsValue));
  }, [onChange]);

  TimeInput.displayName = 'TimeInput';

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>Установите время:</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Минуты"
          type="number"
          value={minutes}
          onChange={handleMinutesChange}
          disabled={disabled}
          inputProps={{ min: 0, max: 720 }}
          sx={{ width: 120 }}
        />
        <TextField
          label="Секунды"
          type="number"
          value={seconds}
          onChange={handleSecondsChange}
          disabled={disabled}
          inputProps={{ min: 0, max: 59 }}
          sx={{ width: 120 }}
        />
      </Box>
      <Typography gutterBottom>Слайдер (0-60 минут, шаг 15 сек):</Typography>
      <Slider
        value={Math.min(60 * 4, totalSeconds / 15)}
        onChange={handleSliderChange}
        min={0}
        max={60 * 4} 
        disabled={disabled}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => {
          const secs = (value as number) * 15;
          const mins = Math.floor(secs / 60);
          const secsRemain = secs % 60;
          return `${mins}мин ${secsRemain}сек`;
        }}
      />
    </Box>
  );
});

TimeInput.propTypes = {
  totalSeconds: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default TimeInput;