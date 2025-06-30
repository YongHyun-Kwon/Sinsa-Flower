import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';

const AdminMain = () => {
  const navigate = useNavigate();
  const { user, isAdmin, refreshAuthState, loading } = useAuth();

  useEffect(() => {
    // 로딩이 완료된 후 권한 체크
    if (!loading) {
      if (!user || user.role !== 'ADMIN') {
        navigate('/login');
        return;
      }
    }
  }, [user, isAdmin, loading, navigate]);

  // 로딩 중이거나 권한 확인 중일 때 로딩 표시
  if (loading || !user) {
    return (
      <Layout>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-200 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </Layout>
    );
  }

  // 관리자가 아닌 경우
  if (!isAdmin) {
    return (
      <Layout>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">관리자 권한이 필요합니다.</h1>
          <button 
            onClick={() => navigate('/')} 
            className="bg-amber-200 text-white px-4 py-2 rounded hover:bg-amber-300"
          >
            홈으로 이동
          </button>
        </div>
      </Layout>
    );
  }

  const adminFeatures = [
    {
      title: '회원 승인 관리',
      description: '새로 가입한 화환 판매업체의 승인/거부를 관리합니다.',
      icon: '👥',
      path: '/admin-member-approval',
      color: 'bg-green-50 hover:bg-green-100 border-green-200'
    },
    {
      title: '상품 관리',
      description: '등록된 화환 상품들을 관리합니다.',
      icon: '🌸',
      path: '/admin/products',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
    },
    {
      title: '주문 관리',
      description: '전체 주문 현황을 모니터링하고 관리합니다.',
      icon: '📋',
      path: '/admin/orders',
      color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200'
    },
    {
      title: '통계 및 리포트',
      description: '플랫폼 이용 현황과 매출 통계를 확인합니다.',
      icon: '📊',
      path: '/admin/reports',
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200'
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* 환영 메시지 */}
        <div className="bg-white p-6 rounded shadow text-center">
          <h1 className="text-3xl font-bold text-amber-600 mb-2">🛠️ 관리자 대시보드</h1>
          <h2 className="text-xl text-gray-600 mb-2">
            안녕하세요, {user?.name || user?.email} 관리자님!
          </h2>
          <p className="text-gray-500">
            신사플라워 플랫폼의 전반적인 관리를 진행하실 수 있습니다.
          </p>
        </div>

        {/* 관리 기능 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminFeatures.map((feature, index) => (
            <div 
              key={index}
              onClick={() => navigate(feature.path)}
              className={`${feature.color} p-6 rounded shadow border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105`}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <button className="bg-amber-200 text-white px-4 py-2 rounded hover:bg-amber-300 transition-colors">
                  관리하기
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 빠른 통계 정보 */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-bold mb-4">시스템 현황</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">대기 중인 승인</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">등록된 회원</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-yellow-600">0</div>
              <div className="text-sm text-gray-600">오늘 주문</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-sm text-gray-600">등록된 상품</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminMain; 