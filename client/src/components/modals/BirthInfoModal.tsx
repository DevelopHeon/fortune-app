import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Grid,
  MenuItem,
  Select,
  InputLabel,
} from '@mui/material';
import type { AnalyzeFortuneRequest } from '../../types/fortune';
import { Gender, FortuneType } from '../../types/fortune';

interface BirthInfoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (birthInfo: AnalyzeFortuneRequest) => void;
  loading: boolean;
  error: string | null;
  fortuneType: FortuneType;
}

const BirthInfoModal: React.FC<BirthInfoModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading,
  error,
  fortuneType,
}) => {
  const [formData, setFormData] = useState<AnalyzeFortuneRequest>({
    birthDate: '',
    birthTime: '',
    gender: Gender.MALE,
    fortuneType: fortuneType,
  });
  
  // fortuneType prop 변경 시 formData 업데이트
  useEffect(() => {
    setFormData(prev => ({ ...prev, fortuneType: fortuneType }));
  }, [fortuneType]);
  
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthHour, setBirthHour] = useState('');
  const [birthMinute, setBirthMinute] = useState('');

  const [errors, setErrors] = useState<Partial<AnalyzeFortuneRequest>>({});

  // 폼 검증
  const validateForm = (): boolean => {
    const newErrors: Partial<AnalyzeFortuneRequest> = {};

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

  // 생년월일 업데이트
  const updateBirthDate = (year: string, month: string, day: string) => {
    if (year && month && day) {
      const birthDate = `${year}-${month}-${day}`;
      setFormData(prev => ({ ...prev, birthDate }));
      
      if (errors.birthDate) {
        setErrors(prev => ({ ...prev, birthDate: undefined }));
      }
    }
  };
  
  // 생시 업데이트
  const updateBirthTime = (hour: string, minute: string) => {
    if (hour && minute) {
      const birthTime = `${hour}:${minute}`;
      setFormData(prev => ({ ...prev, birthTime }));
      
      if (errors.birthTime) {
        setErrors(prev => ({ ...prev, birthTime: undefined }));
      }
    }
  };

  // 입력값 변경 처리
  const handleInputChange = (field: keyof AnalyzeFortuneRequest, value: string | Gender) => {
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
        fortuneType: fortuneType,
      });
      setBirthYear('');
      setBirthMonth('');
      setBirthDay('');
      setBirthHour('');
      setBirthMinute('');
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
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              생년월일
            </Typography>
            <Grid container spacing={2}>
              {/* 년도 */}
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel>년도</InputLabel>
                  <Select
                    value={birthYear}
                    label="년도"
                    onChange={(e) => {
                      setBirthYear(e.target.value);
                      updateBirthDate(e.target.value, birthMonth, birthDay);
                    }}
                    disabled={loading}
                    displayEmpty
                    renderValue={(selected) => {
                      if (!selected) {
                        return <span style={{ color: '#9e9e9e' }}>년도</span>;
                      }
                      return `${selected}년`;
                    }}
                    sx={{ minWidth: 120 }}
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
                    {Array.from({ length: 100 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <MenuItem key={year} value={year.toString()}>
                          {year}년
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              
              {/* 월 */}
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel>월</InputLabel>
                  <Select
                    value={birthMonth}
                    label="월"
                    onChange={(e) => {
                      setBirthMonth(e.target.value);
                      updateBirthDate(birthYear, e.target.value, birthDay);
                    }}
                    disabled={loading}
                    displayEmpty
                    renderValue={(selected) => {
                      if (!selected) {
                        return <span style={{ color: '#9e9e9e' }}>월</span>;
                      }
                      return `${selected}월`;
                    }}
                    sx={{ minWidth: 80 }}
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
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = (i + 1).toString().padStart(2, '0');
                      return (
                        <MenuItem key={month} value={month}>
                          {i + 1}월
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              
              {/* 일 */}
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel>일</InputLabel>
                  <Select
                    value={birthDay}
                    label="일"
                    onChange={(e) => {
                      setBirthDay(e.target.value);
                      updateBirthDate(birthYear, birthMonth, e.target.value);
                    }}
                    disabled={loading}
                    displayEmpty
                    renderValue={(selected) => {
                      if (!selected) {
                        return <span style={{ color: '#9e9e9e' }}>일</span>;
                      }
                      return `${selected}일`;
                    }}
                    sx={{ minWidth: 80 }}
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
                    {Array.from({ length: 31 }, (_, i) => {
                      const day = (i + 1).toString().padStart(2, '0');
                      return (
                        <MenuItem key={day} value={day}>
                          {i + 1}일
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {errors.birthDate && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {errors.birthDate}
              </Typography>
            )}
          </Box>

          {/* 생시 입력 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              생시
            </Typography>
            <Grid container spacing={2}>
              {/* 시간 */}
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>시간</InputLabel>
                  <Select
                    value={birthHour}
                    label="시간"
                    onChange={(e) => {
                      setBirthHour(e.target.value);
                      updateBirthTime(e.target.value, birthMinute);
                    }}
                    disabled={loading}
                    displayEmpty
                    renderValue={(selected) => {
                      if (!selected) {
                        return <span style={{ color: '#9e9e9e' }}>시간</span>;
                      }
                      return `${selected}시`;
                    }}
                    sx={{ minWidth: 100 }}
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
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      return (
                        <MenuItem key={hour} value={hour}>
                          {i}시
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              
              {/* 분 */}
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>분</InputLabel>
                  <Select
                    value={birthMinute}
                    label="분"
                    onChange={(e) => {
                      setBirthMinute(e.target.value);
                      updateBirthTime(birthHour, e.target.value);
                    }}
                    disabled={loading}
                    displayEmpty
                    renderValue={(selected) => {
                      if (!selected) {
                        return <span style={{ color: '#9e9e9e' }}>분</span>;
                      }
                      return `${selected}분`;
                    }}
                    sx={{ minWidth: 100 }}
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
                    {Array.from({ length: 60 }, (_, i) => {
                      const minute = i.toString().padStart(2, '0');
                      return (
                        <MenuItem key={minute} value={minute}>
                          {i}분
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              정확한 생시를 모르는 경우 대략적인 시간을 선택해주세요
            </Typography>
            {errors.birthTime && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {errors.birthTime}
              </Typography>
            )}
          </Box>

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