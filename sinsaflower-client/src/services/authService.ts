import axiosInstance from '../utils/axios';

export interface LoginRequest {
  userId: string;
  password: string;
}

export interface SignupRequest {
  userId: string;
  password: string;
  name: string;
  phoneNumber: string;
  email: string;
  role?: string;
  userType?: string;
  profileImage?: string;
  phoneVerified?: boolean;
  isMarketing?: boolean;
}

export interface LoginResponse {
  token: string;
  userId: string;
  name: string;
  phoneNumber?: string;
  role: string;
}

export interface PendingUser {
  id: number;
  userId: string;
  name: string;
  email?: string;
  phone: string;
  userType?: string;
  registrationDate: string;
  status: string;
}

class AuthService {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  }

  async register(data: SignupRequest): Promise<void> {
    // 기본값 설정
    const signupData: SignupRequest = {
      ...data,
      role: data.role || 'USER',
      userType: data.userType || 'NORMAL',
      phoneVerified: data.phoneVerified ?? false,
      isMarketing: data.isMarketing ?? false
    };
    
    await axiosInstance.post('/auth/signup', signupData);
  }

  async logout(): Promise<void> {
    await axiosInstance.post('/auth/logout');
  }

  async refreshToken(): Promise<string> {
    const response = await axiosInstance.post('/auth/refresh');
    return response.data.token;
  }
  
  // 관리자용 API: 승인 대기 중인 사용자 목록 조회
  async getPendingUsers(): Promise<PendingUser[]> {
    const response = await axiosInstance.get('/auth/admin/pending-users');
    return response.data;
  }
  
  // 관리자용 API: 회원가입 승인
  async approveUser(userId: string): Promise<void> {
    await axiosInstance.post(`/auth/admin/approve/${userId}`);
  }
  
  // 관리자용 API: 회원가입 거절
  async rejectUser(userId: string, reason: string): Promise<void> {
    await axiosInstance.post(`/auth/admin/reject/${userId}?reason=${encodeURIComponent(reason)}`);
  }
}

export const authService = new AuthService(); 