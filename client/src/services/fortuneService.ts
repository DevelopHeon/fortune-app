import axios from 'axios';
import type { BirthInfo, FortuneResponse, ErrorResponse } from '../types/fortune';

// API 베이스 URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[API Response Error]', error.response || error.message);
    return Promise.reject(error);
  }
);

// 사주 해석 요청
export const getSajuFortune = async (birthInfo: BirthInfo): Promise<FortuneResponse> => {
  try {
    const response = await api.post<FortuneResponse>('/fortune/saju', birthInfo);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorResponse = error.response.data as ErrorResponse;
      throw new Error(errorResponse.message || '사주 해석 중 오류가 발생했습니다');
    }
    throw new Error('네트워크 오류가 발생했습니다');
  }
};

// 서버 상태 확인
export const checkHealthStatus = async (): Promise<{ status: string }> => {
  try {
    const response = await api.get<{ status: string }>('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw new Error('서버 연결을 확인할 수 없습니다');
  }
};

export default api;