import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children, showSidebar = true }) => {
  const { user, logout, isAuthenticated, dashboardInfo, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActivePage = (path) => {
    return location.pathname === path;
  };

  const formatCurrency = (amount) => {
    return amount?.toLocaleString() || '0';
  };

  const handleOrderClick = (e) => {
    e.preventDefault();
    navigate('/order-form');
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    navigate('/');
  };

  const handleAdminClick = (e) => {
    e.preventDefault();
    navigate('/admin-dashboard');
  };

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <style>{`
        body { font-family: 'Noto Sans KR', sans-serif; }
        .label { font-weight: bold; margin-right: 6px; }
      `}</style>
      
      {/* Header */}
      <header className="bg-white shadow p-2 flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={handleHomeClick} className="flex items-center hover:opacity-80 transition-opacity">
            <img src="/images/flower-bear-logo.png" alt="신사 플라워 로고" className="h-12 mr-2" />
            <span style={{color: 'rgb(251,229,187)'}} className="text-xl font-bold">신사 플라워</span>
          </button>
        </div>
        <nav className="space-x-4">
          <button 
            onClick={handleOrderClick}
            className={`text-sm hover:underline ${isActivePage('/order-form') ? 'font-semibold' : ''}`}
          >
            발주
          </button>
          <a 
            href="/all-orders" 
            className={`text-sm hover:underline ${isActivePage('/all-orders') ? 'font-semibold' : ''}`}
          >
            주문확인
          </a>
          {isAdmin && (
            <button 
              onClick={handleAdminClick}
              className={`text-sm hover:underline bg-red-100 px-2 py-1 rounded ${isActivePage('/admin-dashboard') ? 'font-semibold bg-red-200' : ''}`}
            >
              관리자
            </button>
          )}
        </nav>
        <div className="text-sm space-x-2">
          {isAuthenticated ? (
            <>
              <span className="text-gray-600">
                {user?.name || user?.username || user?.email} 님님
              </span>
              <a href="/edit-profile" className="hover:underline">회원 정보 수정</a>
              <button onClick={handleLogout} className="hover:underline text-red-500">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="hover:underline">로그인</a>
              <a href="/register" className="hover:underline">회원가입</a>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto mt-2 px-2 grid grid-cols-1 md:grid-cols-12 gap-2">
        {/* Sidebar */}
        {showSidebar && isAuthenticated && (
          <aside className="md:col-span-3 space-y-2">
            {/* 사용자 정보 카드 */}
            <div className="bg-white p-2 rounded shadow-sm">
              <h2 className="font-bold text-sm">
                {user?.name || user?.username || user?.email} 님
              </h2>
              <p className="text-xs text-gray-600">
                잔금총액: <strong>{formatCurrency(dashboardInfo.balance)}원</strong>
              </p>
              <div className="mt-1">
                <p className="text-xs">신사 포인트: <strong>{formatCurrency(dashboardInfo.sinsaPoints)}P</strong></p>
                <p className="text-xs">등급 포인트: <strong>{formatCurrency(dashboardInfo.gradePoints)}P</strong></p>
              </div>
              <div className="mt-1 border-t pt-1">
                <p className="text-xs mb-0.5">수주미확인: <strong>{dashboardInfo.unconfirmedOrders}건</strong></p>
                <p className="text-xs">수주미배송: <strong>{dashboardInfo.undeliveredOrders}건</strong></p>
              </div>
              <a href="/settlement" className="block mt-1 w-full bg-amber-200 text-white py-0.5 rounded text-center text-xs">
                충전/정산
              </a>
              <button className="mt-1 w-full bg-gray-100 py-0.5 rounded text-xs">
                신사멤버십 혜택보기
              </button>
            </div>

            {/* 주문관리 메뉴 */}
            <div className="bg-white p-2 rounded shadow-sm">
              <h3 className="font-semibold text-xs border-b pb-1 mb-1">주문관리</h3>
              <ul className="space-y-0.5 text-xs">
                <li>
                  <a 
                    href="/member-search" 
                    className={`hover:underline ${isActivePage('/member-search') ? 'font-semibold text-amber-200' : ''}`}
                  >
                    회원검색
                  </a>
                </li>
                <li>
                  <button 
                    onClick={handleOrderClick}
                    className={`hover:underline text-left ${isActivePage('/order-form') ? 'font-semibold text-amber-200' : ''}`}
                  >
                    발주
                  </button>
                </li>
                <li>
                  <a 
                    href="/all-orders" 
                    className={`hover:underline ${isActivePage('/all-orders') ? 'font-semibold text-amber-200' : ''}`}
                  >
                    전체발주리스트
                  </a>
                </li>
                <li>
                  <a 
                    href="/all-received-orders" 
                    className={`hover:underline ${isActivePage('/all-received-orders') ? 'font-semibold text-amber-200' : ''}`}
                  >
                    전체수주리스트
                  </a>
                </li>
                <li>
                  <a 
                    href="/unconfirmed-orders" 
                    className={`hover:underline ${isActivePage('/unconfirmed-orders') ? 'font-semibold text-amber-200' : ''}`}
                  >
                    미확인주문리스트
                  </a>
                </li>
                <li>
                  <a 
                    href="/canceled-orders" 
                    className={`hover:underline ${isActivePage('/canceled-orders') ? 'font-semibold text-amber-200' : ''}`}
                  >
                    취소주문리스트
                  </a>
                </li>
              </ul>
            </div>
            
            {/* 게시판 메뉴 */}
            <div className="bg-white p-2 rounded shadow-sm">
              <h3 className="font-semibold text-xs border-b pb-1 mb-1">게시판</h3>
              <ul className="space-y-0.5 text-xs">
                <li>
                  <a 
                    href="/notice" 
                    className={`hover:underline ${isActivePage('/notice') ? 'font-semibold text-amber-200' : ''}`}
                  >
                    공지사항
                  </a>
                </li>
                <li>
                  <a 
                    href="/board" 
                    className={`hover:underline ${isActivePage('/board') ? 'font-semibold text-amber-200' : ''}`}
                  >
                    자유게시판
                  </a>
                </li>
              </ul>
            </div>
            
            {/* 정산관리 메뉴 */}
            <div className="bg-white p-2 rounded shadow-sm">
              <h3 className="font-semibold text-xs border-b pb-1 mb-1">정산관리</h3>
              <ul className="space-y-0.5 text-xs">
                <li>
                  <a 
                    href="/settlement-detail" 
                    className={`hover:underline ${isActivePage('/settlement-detail') ? 'font-semibold text-amber-200' : ''}`}
                  >
                    정산내역
                  </a>
                </li>
                <li><a href="#" className="hover:underline">충전하기</a></li>
                <li><a href="#" className="hover:underline">출금요청</a></li>
                <li><a href="#" className="hover:underline">계산서 발행내역</a></li>
              </ul>
            </div>

            {/* 관리자 메뉴 - 관리자만 표시 */}
            {isAdmin && (
              <div className="bg-red-50 p-2 rounded shadow-sm border border-red-200">
                <h3 className="font-semibold text-xs border-b border-red-200 pb-1 mb-1 text-red-700">관리자</h3>
                <ul className="space-y-0.5 text-xs">
                  <li>
                    <button 
                      onClick={handleAdminClick}
                      className={`hover:underline text-left ${isActivePage('/admin-dashboard') ? 'font-semibold text-red-500' : 'text-red-600'}`}
                    >
                      회원 승인 관리
                    </button>
                  </li>
                  <li>
                    <a 
                      href="/admin-member-approval" 
                      className={`hover:underline ${isActivePage('/admin-member-approval') ? 'font-semibold text-red-500' : 'text-red-600'}`}
                    >
                      회원 승인
                    </a>
                  </li>
                  <li><a href="#" className="hover:underline text-red-600">주문 관리</a></li>
                  <li><a href="#" className="hover:underline text-red-600">시스템 설정</a></li>
                </ul>
              </div>
            )}
          </aside>
        )}

        {/* 메인 컨텐츠 영역 */}
        <section className={showSidebar && isAuthenticated ? "md:col-span-9" : "md:col-span-12"}>
          {children}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-6 text-center text-xs text-gray-500 p-2">
        &copy; 2025 꽃비파트너스. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout; 