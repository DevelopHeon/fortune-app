import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';

export interface SelectOption {
  value: string;
  label: string;
  key: string | number;
}

export interface DateTimeSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  placeholder?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  minWidth?: number;
  required?: boolean;
}

// 메모이제이션된 MenuItem 컴포넌트
const MemoizedMenuItem = React.memo(MenuItem);

const DateTimeSelect: React.FC<DateTimeSelectProps> = React.memo(({
  label,
  value,
  onChange,
  options,
  disabled = false,
  placeholder,
  error,
  helperText,
  fullWidth = true,
  minWidth = 120,
  required = false,
}) => {
  return (
    <FormControl fullWidth={fullWidth} error={!!error}>
      <InputLabel required={required}>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        displayEmpty
        renderValue={(selected) => {
          if (!selected && placeholder) {
            return <span style={{ color: '#9e9e9e' }}>{placeholder}</span>;
          }
          return options.find(opt => opt.value === selected)?.label || selected;
        }}
        sx={{ minWidth }}
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 300,
              '& .MuiMenuItem-root': {
                minHeight: 30,
              },
            },
          },
        }}
      >
        {options.map((option) => (
          <MemoizedMenuItem key={option.key} value={option.value}>
            {option.label}
          </MemoizedMenuItem>
        ))}
      </Select>
      {(error || helperText) && (
        <Typography 
          variant="caption" 
          color={error ? 'error' : 'text.secondary'} 
          sx={{ mt: 1, display: 'block' }}
        >
          {error || helperText}
        </Typography>
      )}
    </FormControl>
  );
});

DateTimeSelect.displayName = 'DateTimeSelect';

export default DateTimeSelect;