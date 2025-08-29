import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import type { BirthInfo } from '../../types/fortune';
import { Gender } from '../../types/fortune';

interface BirthInfoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (birthInfo: BirthInfo) => void;
  loading: boolean;
  error: string | null;
}

const BirthInfoModal: React.FC<BirthInfoModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading,
  error,
}) => {
  const [formData, setFormData] = useState<BirthInfo>({
    birthDate: '',
    birthTime: '',
    gender: Gender.MALE,
  });

  const [errors, setErrors] = useState<Partial<BirthInfo>>({});

  // 폼 검증
  const validateForm = (): boolean => {
    const newErrors: Partial<BirthInfo> = {};

    if (!formData.birthDate) {
      newErrors.birthDate = '생년월일을 입력해주세요';
    }

    if (!formData.birthTime) {
      newErrors.birthTime = '생시를 입력해주세요';
    } else {
      // 시간 형식 검증 (HH:mm)
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(formData.birthTime)) {
        newErrors.birthTime = '시간을 올바른 형식(예: 14:30)으로 입력해주세요';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // 입력값 변경 처리
  const handleInputChange = (field: keyof BirthInfo, value: string | Gender) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // 에러 초기화
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // 모달 닫기
  const handleClose = () => {
    if (!loading) {
      setFormData({
        birthDate: '',
        birthTime: '',
        gender: Gender.MALE,
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          🔮 생년월일 정보 입력
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          정확한 사주 해석을 위해 상세 정보를 입력해주세요
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* 생년월일 입력 */}
          <TextField
            fullWidth
            label="생년월일"
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleInputChange('birthDate', e.target.value)}
            error={!!errors.birthDate}
            helperText={errors.birthDate}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 3 }}
            disabled={loading}
          />

          {/* 생시 입력 */}
          <TextField
            fullWidth
            label="생시"
            type="time"
            value={formData.birthTime}
            onChange={(e) => handleInputChange('birthTime', e.target.value)}
            error={!!errors.birthTime}
            helperText={errors.birthTime || '정확한 생시를 모르는 경우 대략적인 시간을 입력해주세요'}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 3 }}
            disabled={loading}
          />

          {/* 성별 선택 */}
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend">성별</FormLabel>
            <RadioGroup
              row
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value as Gender)}
            >
              <FormControlLabel 
                value={Gender.MALE} 
                control={<Radio />} 
                label="남성" 
                disabled={loading}
              />
              <FormControlLabel 
                value={Gender.FEMALE} 
                control={<Radio />} 
                label="여성" 
                disabled={loading}
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={handleClose}
          disabled={loading}
          color="inherit"
        >
          취소
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{ minWidth: 100 }}
        >
          {loading ? '해석중...' : '사주 해석'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BirthInfoModal;