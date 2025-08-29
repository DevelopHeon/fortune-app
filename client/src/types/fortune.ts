// 성별 타입
export const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE'
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

// 생년월일 정보 타입
export interface BirthInfo {
  birthDate: string; // YYYY-MM-DD 형식
  birthTime: string; // HH:mm 형식
  gender: Gender;
}

// 사주 해석 응답 타입
export interface FortuneResponse {
  result: string;
  timestamp: string;
}

// 에러 응답 타입
export interface ErrorResponse {
  error: string;
  message: string;
  timestamp: string;
}

// 운세 카드 타입
export const FortuneType = {
  SAJU: 'saju',
  TAROT: 'tarot',
  DAILY: 'daily'
} as const;

export type FortuneType = typeof FortuneType[keyof typeof FortuneType];

// 카드 상태 타입
export interface FortuneCard {
  type: FortuneType;
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
  comingSoon?: boolean;
}

// API 응답 상태
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}