import { useReducer, useCallback, useMemo } from 'react';
import {type AnalyzeFortuneRequest, Gender, FortuneType } from '../types/fortune';

// 통합된 상태 관리를 위한 타입 정의
interface BirthFormState {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  gender: Gender;
  fortuneType: FortuneType;
  errors: Partial<AnalyzeFortuneRequest>;
}

// 상태 업데이트 액션 타입
type BirthFormAction =
  | { type: 'SET_DATE_FIELD'; field: 'year' | 'month' | 'day'; value: string }
  | { type: 'SET_TIME_FIELD'; field: 'hour' | 'minute'; value: string }
  | { type: 'SET_GENDER'; value: Gender }
  | { type: 'SET_FORTUNE_TYPE'; value: FortuneType }
  | { type: 'SET_ERRORS'; errors: Partial<AnalyzeFortuneRequest> }
  | { type: 'CLEAR_ERRORS'; field?: keyof AnalyzeFortuneRequest }
  | { type: 'RESET_FORM'; fortuneType: FortuneType };

// 리듀서 함수
const birthFormReducer = (state: BirthFormState, action: BirthFormAction): BirthFormState => {
  switch (action.type) {
    case 'SET_DATE_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        errors: state.errors.birthDate ? { ...state.errors, birthDate: undefined } : state.errors,
      };
    case 'SET_TIME_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        errors: state.errors.birthTime ? { ...state.errors, birthTime: undefined } : state.errors,
      };
    case 'SET_GENDER':
      return {
        ...state,
        gender: action.value,
        errors: state.errors.gender ? { ...state.errors, gender: undefined } : state.errors,
      };
    case 'SET_FORTUNE_TYPE':
      return { ...state, fortuneType: action.value };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'CLEAR_ERRORS':
      if (action.field) {
        return { ...state, errors: { ...state.errors, [action.field]: undefined } };
      }
      return { ...state, errors: {} };
    case 'RESET_FORM':
      return {
        year: '',
        month: '',
        day: '',
        hour: '',
        minute: '',
        gender: Gender.MALE,
        fortuneType: action.fortuneType,
        errors: {},
      };
    default:
      return state;
  }
};

export const useBirthForm = (initialFortuneType: FortuneType) => {
  // useReducer로 통합된 상태 관리
  const [formState, dispatch] = useReducer(birthFormReducer, {
    year: '',
    month: '',
    day: '',
    hour: '',
    minute: '',
    gender: Gender.MALE,
    fortuneType: initialFortuneType,
    errors: {},
  });

  // 개선된 날짜 유효성 검증 함수
  const validateDate = useCallback((year: string, month: string, day: string): { isValid: boolean; error?: string } => {
    if (!year || !month || !day) {
      return { isValid: false, error: '생년월일을 모두 입력해주세요' };
    }

    const yearNum = +year;
    const monthNum = +month;
    const dayNum = +day;

    // 기본 범위 검증
    const currentYear = new Date().getFullYear();
    if (yearNum < 1900 || yearNum > currentYear) {
      return { isValid: false, error: `년도는 1900년부터 ${currentYear}년까지 입력 가능합니다` };
    }

    if (monthNum < 1 || monthNum > 12) {
      return { isValid: false, error: '월은 1월부터 12월까지 입력 가능합니다' };
    }

    // 월별 최대 일수 계산 (윤년 고려)
    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
    if (dayNum < 1 || dayNum > daysInMonth) {
      return { isValid: false, error: `${monthNum}월은 1일부터 ${daysInMonth}일까지 입력 가능합니다` };
    }

    // 미래 날짜 검증
    const inputDate = new Date(yearNum, monthNum - 1, dayNum);
    const today = new Date();
    if (inputDate > today) {
      return { isValid: false, error: '미래 날짜는 입력할 수 없습니다' };
    }

    return { isValid: true };
  }, []);

  // 개선된 시간 유효성 검증 함수
  const validateTime = useCallback((hour: string, minute: string): { isValid: boolean; error?: string } => {
    if (!hour || !minute) {
      return { isValid: false, error: '생시를 모두 입력해주세요' };
    }

    const hourNum = +hour;
    const minuteNum = +minute;

    if (hourNum < 0 || hourNum > 23) {
      return { isValid: false, error: '시간은 0시부터 23시까지 입력 가능합니다' };
    }

    if (minuteNum < 0 || minuteNum > 59) {
      return { isValid: false, error: '분은 0분부터 59분까지 입력 가능합니다' };
    }

    return { isValid: true };
  }, []);

  // 메모이제이션된 폼 검증 - 성능 최적화 및 개선된 검증 로직
  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<AnalyzeFortuneRequest> = {};
    
    // 생년월일 검증
    const dateValidation = validateDate(formState.year, formState.month, formState.day);
    if (!dateValidation.isValid) {
      newErrors.birthDate = dateValidation.error;
    }
    
    // 생시 검증  
    const timeValidation = validateTime(formState.hour, formState.minute);
    if (!timeValidation.isValid) {
      newErrors.birthTime = timeValidation.error;
    }

    dispatch({ type: 'SET_ERRORS', errors: newErrors });
    return Object.keys(newErrors).length === 0;
  }, [formState.year, formState.month, formState.day, formState.hour, formState.minute, validateDate, validateTime]);

  // 메모이제이션된 핸들러들 - 성능 최적화
  const handleYearChange = useCallback((value: string) => {
    dispatch({ type: 'SET_DATE_FIELD', field: 'year', value });
  }, []);
  
  const handleMonthChange = useCallback((value: string) => {
    dispatch({ type: 'SET_DATE_FIELD', field: 'month', value });
  }, []);
  
  const handleDayChange = useCallback((value: string) => {
    dispatch({ type: 'SET_DATE_FIELD', field: 'day', value });
  }, []);
  
  const handleHourChange = useCallback((value: string) => {
    dispatch({ type: 'SET_TIME_FIELD', field: 'hour', value });
  }, []);
  
  const handleMinuteChange = useCallback((value: string) => {
    dispatch({ type: 'SET_TIME_FIELD', field: 'minute', value });
  }, []);
  
  const handleGenderChange = useCallback((value: Gender) => {
    dispatch({ type: 'SET_GENDER', value });
  }, []);

  const resetForm = useCallback((fortuneType: FortuneType) => {
    dispatch({ type: 'RESET_FORM', fortuneType });
  }, []);

  const setFortuneType = useCallback((fortuneType: FortuneType) => {
    dispatch({ type: 'SET_FORTUNE_TYPE', value: fortuneType });
  }, []);

  // 메모이제이션된 폼 데이터 생성
  const formData = useMemo((): AnalyzeFortuneRequest => ({
    birthDate: formState.year && formState.month && formState.day 
      ? `${formState.year}-${formState.month}-${formState.day}` 
      : '',
    birthTime: formState.hour && formState.minute 
      ? `${formState.hour}:${formState.minute}` 
      : '',
    gender: formState.gender,
    fortuneType: formState.fortuneType,
  }), [formState]);

  return {
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
    actions: {
      resetForm,
      setFortuneType,
    },
  };
};