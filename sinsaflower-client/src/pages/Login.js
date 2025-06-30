import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // AuthContext의 login 함수 사용 (admin 계정도 포함)
      const result = await login(formData.username, formData.password);
      console.log(result);
      if (result.success) {
        console.log('로그인 성공:', result.user);
        
        // 역할에 따라 리다이렉트
        if (result.user.role === 'ADMIN') {
          navigate('/admin-dashboard');
        } else {
          navigate('/'); // 일반 사용자 대시보드
        }
      } else {
        console.log(result);
        setError(result.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 처리 중 오류:', error);
      setError('로그인 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header - temp HTML과 동일한 구조 */}
      <header className="bg-white shadow p-2 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <img src="/images/sinsa-flower-logo-nobg.png" alt="신사 플라워 로고" className="h-12 mr-2" />
            <span style={{color: 'rgb(251,229,187)'}} className="text-xl font-bold">신사 플라워</span>
          </Link>
        </div>
        <div className="text-sm space-x-4">
          <Link to="/register" className="text-sm hover:underline">회원가입</Link>
        </div>
      </header>

      <div className="login-container">
        <div className="w-full max-w-md space-y-6 p-8 bg-white rounded-lg shadow-md">
          <div>
            <img className="mx-auto h-24 w-auto" src="/images/sinsa-flower-logo-nobg.png" alt="신사 플라워 로고" />
            <h2 className="mt-6 text-center text-3xl font-semibold text-gray-900">로그인</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              전국 꽃집을 연결하는 B2B 플랫폼
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
                  placeholder="아이디를 입력하세요"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
                  placeholder="비밀번호를 입력하세요"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-amber-200 focus:ring-amber-200 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  로그인 유지
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-200"
                style={{ backgroundColor: 'rgb(251,229,187)' }}
              >
                {loading ? '로그인 중...' : '로그인'}
              </button>
            </div>
          </form>
          
          <div className="text-center text-sm space-y-2 mt-4">
            <div className="space-x-4">
              <a href="/find-id" className="hover:underline" style={{ color: 'rgb(251,229,187)' }}>
                아이디 찾기
              </a>
              <a href="/find-password" className="hover:underline" style={{ color: 'rgb(251,229,187)' }}>
                비밀번호 찾기
              </a>
            </div>
            <div className="text-gray-600">
              아직 계정이 없으신가요?{' '}
              <button 
                onClick={() => navigate('/register')}
                className="hover:underline"
                style={{ color: 'rgb(251,229,187)' }}
              >
                회원가입
              </button>
            </div>
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-4">
            <p className="text-xs text-center text-gray-500">
              가입 및 결제 관련 문의: <span className="font-semibold">1670-5800</span> (평일 09:00-18:00)
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto text-center text-xs text-gray-500 p-4">
        &copy; 2025 신사 플라워. All rights reserved.
      </footer>
    </div>
  );
};

export default Login; 