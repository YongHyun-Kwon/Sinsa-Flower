import axios from 'axios';

/**
 * 중앙화된 API 클라이언트
 * - 요청/응답 인터셉터
 * - 에러 처리 표준화
 * - 토큰 관리
 * - 로딩 상태 관리
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10초 타임아웃
});

// 로딩 상태 관리를 위한 카운터
let pendingRequests = 0;
const loadingHandlers = new Set();

// 로딩 상태 알림 함수 등록
export const addLoadingHandler = (handler) => {
  loadingHandlers.add(handler);
  return () => loadingHandlers.delete(handler);
};

// 로딩 상태 변경 알림
const notifyLoadingChange = (isLoading) => {
  loadingHandlers.forEach(handler => handler(isLoading));
};

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 로딩 카운터 증가
    pendingRequests++;
    if (pendingRequests === 1) {
      notifyLoadingChange(true);
    }

    // 토큰 자동 첨부
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 요청 로깅 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error) => {
    // 로딩 카운터 감소
    pendingRequests--;
    if (pendingRequests === 0) {
      notifyLoadingChange(false);
    }
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    // 로딩 카운터 감소
    pendingRequests--;
    if (pendingRequests === 0) {
      notifyLoadingChange(false);
    }

    // 응답 로깅 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  (error) => {
    // 로딩 카운터 감소
    pendingRequests--;
    if (pendingRequests === 0) {
      notifyLoadingChange(false);
    }

    // 에러 로깅
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
    });

    // 토큰 만료 처리
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      
      // 로그인 페이지가 아닌 경우에만 토큰 제거 및 리다이렉트
      if (currentPath !== '/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // 토큰 만료 알림
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        
        // 로그인 페이지로 리다이렉트
        window.location.href = '/login';
      }
    }

    // 5xx 서버 에러 처리
    if (error.response?.status >= 500) {
      console.error('서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }

    // 네트워크 에러 처리
    if (!error.response && error.code === 'ECONNABORTED') {
      console.error('요청 시간이 초과되었습니다. 네트워크 연결을 확인해주세요.');
    }

    return Promise.reject(error);
  }
);

/**
 * API 요청 래퍼 함수들
 */
export const api = {
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data, config = {}) => apiClient.post(url, data, config),
  put: (url, data, config = {}) => apiClient.put(url, data, config),
  patch: (url, data, config = {}) => apiClient.patch(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
};

/**
 * 파일 업로드를 위한 API 클라이언트
 */
export const uploadApi = {
  post: (url, formData, onProgress) => {
    return apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress,
    });
  },
};

export default apiClient; 