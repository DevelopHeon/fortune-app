import React, { useEffect, useMemo, useCallback } from 'react';
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
} from '@mui/material';
import type { AnalyzeFortuneRequest } from '../../types/fortune';
import { Gender, FortuneType } from '../../types/fortune';
import { useBirthForm } from '../../hooks/useBirthForm';
import DateTimeSelect from '../common/DateTimeSelect';

interface BirthInfoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (birthInfo: AnalyzeFortuneRequest) => void;
  loading: boolean;
  error: string | null;
  fortuneType: FortuneType;
}



const BirthInfoModal: React.FC<BirthInfoModalProps> = React.memo(({
  open,
  onClose,
  onSubmit,
  loading,
  error,
  fortuneType,
}) => {
  // 커스텀 훅으로 로직 분리
  const { 
    formState, 
    formData, 
    validateForm, 
    handlers: {
      handleYearChange,
      handleMonthChange,
      handleDayChange,
      handleHourChange,
      handleMinuteChange,
      handleGenderChange,
    },
    actions: { resetForm, setFortuneType }
  } = useBirthForm(fortuneType);
  
  // fortuneType prop 변경 시 상태 업데이트
  useEffect(() => {
    setFortuneType(fortuneType);
  }, [fortuneType, setFortuneType]);

  // 메모이제이션된 옵션 배열들 - 성능 최적화
  const yearOptions = useMemo(() => 
    Array.from({ length: 100 }, (_, i) => {
      const year = new Date().getFullYear() - i;
      return { value: year.toString(), label: `${year}년`, key: year };
    }), []
  );

  const monthOptions = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => {
      const month = (i + 1).toString().padStart(2, '0');
      return { value: month, label: `${i + 1}월`, key: month };
    }), []
  );

  const dayOptions = useMemo(() => 
    Array.from({ length: 31 }, (_, i) => {
      const day = (i + 1).toString().padStart(2, '0');
      return { value: day, label: `${i + 1}일`, key: day };
    }), []
  );

  const hourOptions = useMemo(() => 
    Array.from({ length: 24 }, (_, i) => {
      const hour = i.toString().padStart(2, '0');
      return { value: hour, label: `${i}시`, key: hour };
    }), []
  );

  const minuteOptions = useMemo(() => 
    Array.from({ length: 60 }, (_, i) => {
      const minute = i.toString().padStart(2, '0');
      return { value: minute, label: `${i}분`, key: minute };
    }), []
  );

  // 메모이제이션된 폼 제출 - 성능 최적화
  const handleSubmit = useCallback(() => {
    if (validateForm()) {
      onSubmit(formData);
    }
  }, [validateForm, formData, onSubmit]);

  // 메모이제이션된 모달 닫기 - 성능 최적화
  const handleClose = useCallback(() => {
    if (!loading) {
      resetForm(fortuneType);
      onClose();
    }
  }, [loading, fortuneType, resetForm, onClose]);

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
                <DateTimeSelect
                  label="년도"
                  value={formState.year}
                  onChange={handleYearChange}
                  options={yearOptions}
                  disabled={loading}
                  placeholder="년도"
                  error={formState.errors.birthDate}
                  minWidth={120}
                />
              </Grid>

              {/* 월 */}
              <Grid item xs={4}>
                <DateTimeSelect
                  label="월"
                  value={formState.month}
                  onChange={handleMonthChange}
                  options={monthOptions}
                  disabled={loading}
                  placeholder="월"
                  minWidth={80}
                />
              </Grid>

              {/* 일 */}
              <Grid item xs={4}>
                <DateTimeSelect
                  label="일"
                  value={formState.day}
                  onChange={handleDayChange}
                  options={dayOptions}
                  disabled={loading}
                  placeholder="일"
                  minWidth={80}
                />
              </Grid>
            </Grid>
          </Box>

          {/* 생시 입력 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              생시
            </Typography>
            <Grid container spacing={2}>
              {/* 시간 */}
              <Grid item xs={6}>
                <DateTimeSelect
                  label="시간"
                  value={formState.hour}
                  onChange={handleHourChange}
                  options={hourOptions}
                  disabled={loading}
                  placeholder="시간"
                  error={formState.errors.birthTime}
                  minWidth={100}
                />
              </Grid>
              
              {/* 분 */}
              <Grid item xs={6}>
                <DateTimeSelect
                  label="분"
                  value={formState.minute}
                  onChange={handleMinuteChange}
                  options={minuteOptions}
                  disabled={loading}
                  placeholder="분"
                  minWidth={100}
                />
              </Grid>
            </Grid>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              정확한 생시를 모르는 경우 대략적인 시간을 선택해주세요
            </Typography>
          </Box>

          {/* 성별 선택 */}
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend">성별</FormLabel>
            <RadioGroup
              row
              value={formState.gender}
              onChange={(e) => handleGenderChange(e.target.value as Gender)}
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
});

BirthInfoModal.displayName = 'BirthInfoModal';

export default BirthInfoModal;