import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import type { LoginResponse } from '../services/authService';

interface AuthContextType {
  user: LoginResponse | null;
  isAuthenticated: boolean;
  login: (token: string, userData: LoginResponse) => void;
  logout: () => void;
  refreshAuthState: () => LoginResponse | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 로컬 스토리지에서 사용자 정보를 가져오는 함수
  const refreshAuthState = useCallback((): LoginResponse | null => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    console.log("AuthContext - 저장된 토큰:", token ? '존재함' : '없음');
    console.log("AuthContext - 저장된 사용자 정보:", storedUser);
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser) as LoginResponse;
        setUser(parsedUser);
        setIsAuthenticated(true);
        console.log("AuthContext - 인증 상태 복원 성공:", parsedUser);
        return parsedUser;
      } catch (error) {
        console.error("AuthContext - 사용자 정보 파싱 오류:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        return null;
      }
    } else {
      console.log("AuthContext - 토큰 또는 사용자 정보 없음");
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }
  }, []);

  useEffect(() => {
    // 컴포넌트 마운트 시 인증 상태 복원
    refreshAuthState();
  }, []);

  const login = (token: string, userData: LoginResponse) => {
    console.log("AuthContext - 로그인 실행:", userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, refreshAuthState }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 