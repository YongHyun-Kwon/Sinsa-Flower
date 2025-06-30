import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const Dashboard = () => {
  const { user, dashboardInfo, refreshDashboardInfo, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [bestPosts] = useState([
    { postId: 1, title: '작지만 뉴꽃들 [1]', createdDate: '2025.05.08', commentCount: 1 },
    { postId: 2, title: '영업 : 성공', createdDate: '2025.05.08', commentCount: 0 },
    { postId: 3, title: '영업 : 노력', createdDate: '2025.05.08', commentCount: 0 }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      refreshDashboardInfo();
    }
  }, [isAuthenticated, refreshDashboardInfo]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  const handleOrderClick = (e) => {
    e.preventDefault();
    navigate('/order-form');
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-200 mx-auto"></div>
            <p className="mt-4 text-gray-600">대시보드를 불러오는 중...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout showSidebar={false}>
        <div className="min-h-64 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">로그인이 필요합니다.</p>
            <a href="/login" className="mt-4 bg-amber-200 text-white px-4 py-2 rounded inline-block">
              로그인하기
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Banner */}
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm mb-2">상담/가입/정산 문의: <strong className="text-red-500">1670-5800</strong></p>
          <div className="bg-gray-100 h-32 flex items-center justify-center text-gray-500">[배너 광고 영역]</div>
        </div>

        {/* 미확인 수주 카운터 */}
        <div className="bg-white p-3 rounded shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">미확인 수주건</span>
            </div>
            <a href="/all-received-orders" className="flex items-center bg-amber-200 text-white px-3 py-1 rounded-full text-sm">
              <span className="font-bold mr-1">{dashboardInfo.unconfirmedOrders || 0}</span>건 확인하기
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
        
        {/* Settings */}
        <div className="bg-white p-3 rounded shadow">
          <div className="grid grid-cols-2 gap-3">
            <div className="border-r pr-3">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95a1 1 0 001.715 1.029zM6 12a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm7-3a1 1 0 100 2 1 1 0 000-2zM6 9a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-sm">부재중 설정</h3>
              </div>
              <div className="text-xs">
                <div className="flex space-x-2 mb-2">
                  <div className="flex-1">
                    <label className="block">시작일</label>
                    <input type="date" className="w-full border rounded px-1 py-0.5 mt-0.5" />
                  </div>
                  <div className="flex-1">
                    <label className="block">종료일</label>
                    <input type="date" className="w-full border rounded px-1 py-0.5 mt-0.5" />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-amber-200 text-white py-1 rounded text-xs">설정</button>
                  <button className="flex-1 bg-gray-200 text-gray-600 py-1 rounded text-xs">해제</button>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-sm">미취급상품 설정</h3>
              </div>
              <div className="grid grid-cols-3 gap-1 text-xs">
                <label className="flex items-center"><input type="checkbox" className="mr-1 h-3 w-3" />화환</label>
                <label className="flex items-center"><input type="checkbox" className="mr-1 h-3 w-3" />근조</label>
                <label className="flex items-center"><input type="checkbox" className="mr-1 h-3 w-3" />꽃다발</label>
                <label className="flex items-center"><input type="checkbox" className="mr-1 h-3 w-3" />동양란</label>
                <label className="flex items-center"><input type="checkbox" className="mr-1 h-3 w-3" />서양란</label>
                <label className="flex items-center"><input type="checkbox" className="mr-1 h-3 w-3" />관엽식물</label>
              </div>
            </div>
          </div>
        </div>

        {/* Best Posts */}
        <div className="bg-white p-3 rounded shadow">
          <h3 className="font-semibold text-md mb-3">베스트 게시물</h3>
          <div className="space-y-2">
            {bestPosts.map((post) => (
              <div key={post.postId} className="flex justify-between items-center py-1 border-b last:border-b-0">
                <div className="flex-1">
                  <span className="text-sm">{post.title}</span>
                </div>
                <div className="text-xs text-gray-500 ml-2">
                  {post.createdDate} [{post.commentCount}]
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-3 rounded shadow">
          <h3 className="font-semibold text-md mb-3">빠른 실행</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button 
              onClick={handleOrderClick}
              className="text-center p-3 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
            >
              <div className="text-2xl mb-1">📝</div>
              <div className="text-sm font-medium">발주하기</div>
            </button>
            <a href="/all-orders" className="text-center p-3 bg-green-50 rounded hover:bg-green-100 transition-colors">
              <div className="text-2xl mb-1">📋</div>
              <div className="text-sm font-medium">주문목록</div>
            </a>
            <a href="/settlement" className="text-center p-3 bg-yellow-50 rounded hover:bg-yellow-100 transition-colors">
              <div className="text-2xl mb-1">💰</div>
              <div className="text-sm font-medium">정산</div>
            </a>
            <a href="/notice" className="text-center p-3 bg-purple-50 rounded hover:bg-purple-100 transition-colors">
              <div className="text-2xl mb-1">📢</div>
              <div className="text-sm font-medium">공지사항</div>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard; 