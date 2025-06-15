import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 자동 첨부
apiClient.interceptors.request.use(
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

// 응답 인터셉터 - 토큰 만료 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그아웃 처리
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const authService = {
  // 로그인
  login: async (userId, password) => {
    console.log('AuthService: 로그인 요청', { userId });
    const response = await apiClient.post('/api/auth/login', { userId, password });
    console.log('AuthService: 로그인 응답', response.data);
    return response.data;
  },

  // 회원가입
  register: async (userData) => {
    console.log('AuthService: 회원가입 요청');
    const response = await apiClient.post('/api/auth/signup', userData);
    console.log('AuthService: 회원가입 응답', response.data);
    return response.data;
  },

  // 회원가입 (Register.js에서 사용)
  signup: async (userData) => {
    console.log('AuthService: 회원가입 요청');
    const response = await apiClient.post('/api/auth/signup', userData);
    console.log('AuthService: 회원가입 응답', response.data);
    return response.data;
  },

  // 아이디 중복 확인
  checkUserId: async (userId) => {
    console.log('AuthService: 아이디 중복 확인 요청', { userId });
    const response = await apiClient.get(`/api/auth/check-userid?userId=${userId}`);
    console.log('AuthService: 아이디 중복 확인 응답', response.data);
    return response.data;
  },

  // 관리자 - 대기중인 사용자 목록 조회
  getPendingUsers: async () => {
    console.log('AuthService: 대기중인 사용자 목록 조회');
    const response = await apiClient.get('/api/auth/admin/pending-users');
    console.log('AuthService: 대기중인 사용자 목록 응답', response.data);
    return response.data;
  },

  // 관리자 - 사용자 승인
  approveUser: async (userId) => {
    console.log('AuthService: 사용자 승인 요청', { userId });
    const response = await apiClient.post(`/api/auth/admin/approve/${userId}`);
    console.log('AuthService: 사용자 승인 응답', response.data);
    return response.data;
  },

  // 관리자 - 사용자 거부
  rejectUser: async (userId, reason) => {
    console.log('AuthService: 사용자 거부 요청', { userId, reason });
    const response = await apiClient.post(`/api/auth/admin/reject/${userId}`, null, {
      params: { reason }
    });
    console.log('AuthService: 사용자 거부 응답', response.data);
    return response.data;
  },
};

export default authService; 