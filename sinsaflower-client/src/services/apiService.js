import axios from 'axios';

// 기본 설정
const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (JWT 토큰 자동 추가)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그아웃
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // 회원가입
  signup: (data) => api.post('/api/auth/signup', data),
  
  // 로그인
  login: (data) => api.post('/api/auth/login', data),
  
  // 아이디 중복 확인
  checkUserId: (userId) => api.get(`/api/auth/check-userid?userId=${userId}`),
  
  // 토큰 재발급
  refreshToken: () => api.post('/api/auth/refresh-token'),
  
  // 로그아웃
  logout: () => api.post('/api/auth/logout'),
};

// Admin API
export const adminAPI = {
  // 승인 대기 사용자 목록
  getPendingUsers: () => api.get('/api/auth/admin/pending-users'),
  
  // 회원 승인
  approveUser: (userId) => api.post(`/api/auth/admin/approve/${userId}`),
  
  // 회원 거절
  rejectUser: (userId, reason) => api.post(`/api/auth/admin/reject/${userId}?reason=${reason}`),
};

// 대시보드 API
export const dashboardAPI = {
  // 테스트 엔드포인트
  test: () => api.get('/api/dashboard/test'),
  
  // 대시보드 정보 조회
  getDashboardInfo: () => api.get('/api/dashboard/info'),
  
  // 미확인 수주 건수 조회
  getUnconfirmedOrderCount: () => api.get('/api/dashboard/unconfirmed-orders/count'),
};

export default api; 