import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/apiClient';

/**
 * 인증 관련 API 키 상수
 */
export const AUTH_KEYS = {
  pendingUsers: ['auth', 'pendingUsers'],
  userProfile: ['auth', 'userProfile'],
};

/**
 * 인증 관련 커스텀 훅
 */

// 로그인 뮤테이션
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, password }) => {
      const response = await api.post('/api/auth/login', { userId, password });
      return response.data;
    },
    onSuccess: (data) => {
      // 토큰과 사용자 정보 저장
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      // 사용자 프로필 캐시 무효화 및 업데이트
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.userProfile });
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

// 회원가입 뮤테이션
export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData) => {
      const response = await api.post('/api/auth/signup', userData);
      return response.data;
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });
};

// 아이디 중복 확인 뮤테이션
export const useCheckUserId = () => {
  return useMutation({
    mutationFn: async (userId) => {
      const response = await api.get(`/api/auth/check-userid?userId=${userId}`);
      return response.data;
    },
    onError: (error) => {
      console.error('User ID check failed:', error);
    },
  });
};

// 대기중인 사용자 목록 조회 쿼리
export const usePendingUsers = () => {
  return useQuery({
    queryKey: AUTH_KEYS.pendingUsers,
    queryFn: async () => {
      const response = await api.get('/api/auth/admin/pending-users');
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2분
    cacheTime: 1000 * 60 * 5, // 5분
  });
};

// 사용자 승인 뮤테이션
export const useApproveUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId) => {
      const response = await api.put(`/api/auth/admin/users/${userId}/approve`);
      return response.data;
    },
    onSuccess: () => {
      // 대기 사용자 목록 갱신
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.pendingUsers });
    },
    onError: (error) => {
      console.error('User approval failed:', error);
    },
  });
};

// 사용자 거부 뮤테이션
export const useRejectUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, reason }) => {
      const response = await api.put(`/api/auth/admin/users/${userId}/reject`, { reason });
      return response.data;
    },
    onSuccess: () => {
      // 대기 사용자 목록 갱신
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.pendingUsers });
    },
    onError: (error) => {
      console.error('User rejection failed:', error);
    },
  });
};

// 로그아웃 함수
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return () => {
    // 로컬 스토리지 정리
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 모든 쿼리 캐시 정리
    queryClient.clear();
    
    // 로그인 페이지로 리다이렉트
    window.location.href = '/login';
  };
};

// 현재 사용자 정보 가져오기
export const useCurrentUser = () => {
  return useQuery({
    queryKey: AUTH_KEYS.userProfile,
    queryFn: () => {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    },
    staleTime: Infinity, // 로컬 스토리지 데이터는 수동으로 갱신
    cacheTime: Infinity,
  });
};

// 인증 상태 확인
export const useAuthState = () => {
  const { data: user } = useCurrentUser();
  const token = localStorage.getItem('token');
  
  return {
    isAuthenticated: !!(user && token),
    user,
    token,
  };
}; 