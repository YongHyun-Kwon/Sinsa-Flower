import React, { useState } from 'react';

const Notice = () => {
  const [searchType, setSearchType] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [perPage, setPerPage] = useState('30개씩');

  // 더미 공지사항 데이터
  const notices = [
    { id: 10, title: '★ 게시물 작성 200P / 댓글 등록 40P 신사 포인트 적립 ★', date: '2025.05.15', views: 8127, important: true },
    { id: 9, title: '▶ 신사 플라워 인스타그램 & 네이버블로그 팔로우!', date: '2025.05.10', views: 8693, important: true },
    { id: 8, title: '6월 화훼시장 휴무일 안내', date: '2025.05.08', views: 3256, important: false },
    { id: 7, title: '서버 점검 일정 안내 (5/20 03:00~06:00)', date: '2025.05.05', views: 2851, important: false },
    { id: 6, title: '상품 품질 기준 안내 및 배송 지연시 대처 방안', date: '2025.05.01', views: 4982, important: false },
    { id: 5, title: '신사 플라워 B2B 서비스 이용방법 안내', date: '2025.04.25', views: 6734, important: false },
    { id: 4, title: '5월 연휴 배송 안내 (5/1~5/5)', date: '2025.04.15', views: 5621, important: false },
    { id: 3, title: '회원등급 혜택 및 포인트 적립 정책 변경 안내', date: '2025.04.10', views: 7129, important: false },
    { id: 2, title: '서비스 이용약관 개정 안내 (2025년 4월 1일부터 적용)', date: '2025.03.15', views: 5384, important: false },
    { id: 1, title: '신사 플라워 서비스 오픈 안내', date: '2025.03.01', views: 9876, important: false }
  ];

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow p-2 flex justify-between items-center">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <img src="/images/sinsa-flower-logo-nobg.png" alt="신사 플라워 로고" className="h-12 mr-2" />
            <span style={{ color: 'rgb(251,229,187)' }} className="text-xl font-bold">신사 플라워</span>
          </a>
        </div>
        <nav className="space-x-4">
          <a href="/order-form" className="text-sm hover:underline">발주</a>
          <a href="/orders" className="text-sm hover:underline">주문확인</a>
        </nav>
        <div className="text-sm space-x-2">
          <a href="/login" className="hover:underline text-red-500">로그아웃</a>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto mt-6 mb-12 px-4 max-w-7xl">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="col-span-3 space-y-6 sidebar">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="font-bold text-lg">화환앤플라워님</h2>
              <p className="text-sm text-gray-600">잔금총액: <strong>805,500원</strong></p>
              <div className="mt-2">
                <p>신사 포인트: <strong>11,110P</strong></p>
                <p>등급 포인트: <strong>0P</strong></p>
              </div>
              <a href="/settlement" className="block mt-4 w-full bg-amber-200 text-white py-1 rounded text-center">충전/정산</a>
              <button className="mt-2 w-full bg-gray-100 py-1 rounded">신사멤버십 혜택보기</button>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold text-md mb-2">주문관리</h3>
              <ul className="space-y-1 text-sm">
                <li><a href="/member-search" className="hover:underline">회원검색</a></li>
                <li><a href="/order-form" className="hover:underline">발주</a></li>
                <li><a href="/all-orders" className="hover:underline">전체발주리스트</a></li>
                <li><a href="/all-received-orders" className="hover:underline">전체수주리스트</a></li>
                <li><a href="/unconfirmed-orders" className="hover:underline">미확인주문리스트</a></li>
                <li><a href="/canceled-orders" className="hover:underline">취소주문리스트</a></li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold text-md mb-2">게시판</h3>
              <ul className="space-y-1 text-sm">
                <li><a href="/notice" className="text-amber-200 font-medium">공지사항</a></li>
                <li><a href="/board" className="hover:underline">자유게시판</a></li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold text-md mb-2">정산관리</h3>
              <ul className="space-y-1 text-sm">
                <li><a href="/settlement-detail" className="hover:underline">정산내역</a></li>
                <li><a href="#" className="hover:underline">충전하기</a></li>
                <li><a href="#" className="hover:underline">출금요청</a></li>
                <li><a href="#" className="hover:underline">계산서 발행내역</a></li>
              </ul>
            </div>
          </aside>

          {/* Main Board Area */}
          <section className="col-span-9">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Board Header */}
              <div className="border-b px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">📢 공지사항</h1>
                <div className="flex gap-4 items-center">
                  <select 
                    value={perPage}
                    onChange={(e) => setPerPage(e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option>30개씩</option>
                    <option>50개씩</option>
                    <option>100개씩</option>
                  </select>
                </div>
              </div>

              {/* Board Search */}
              <div className="px-6 py-3 bg-gray-50 border-b flex justify-between items-center">
                <div className="flex space-x-2">
                  <select 
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option>전체</option>
                    <option>제목</option>
                    <option>내용</option>
                  </select>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="검색어를 입력하세요" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="text-sm border rounded pl-3 pr-8 py-1 w-64"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  {/* 관리자만 보이는 버튼 */}
                  <button 
                    className="px-4 py-1 rounded text-sm text-white hidden"
                    style={{ backgroundColor: 'rgb(251,229,187)' }}
                  >
                    글쓰기
                  </button>
                </div>
              </div>

              {/* Board Table */}
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b text-gray-600">
                  <tr>
                    <th className="px-4 py-2 w-16">번호</th>
                    <th className="px-4 py-2">제목</th>
                    <th className="px-4 py-2 w-24">작성일</th>
                    <th className="px-4 py-2 w-16">조회</th>
                  </tr>
                </thead>
                <tbody>
                  {notices.map((notice) => (
                    <tr key={notice.id} className="hover:bg-gray-50 border-b">
                      <td className="px-4 py-2 text-gray-500">{notice.id}</td>
                      <td className={`px-4 py-2 ${notice.important ? 'font-medium' : ''}`}>
                        <a href={`/notice/${notice.id}`} className="hover:text-amber-500">
                          {notice.title}
                        </a>
                      </td>
                      <td className="px-4 py-2">{notice.date}</td>
                      <td className="px-4 py-2">{notice.views.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="p-4 flex justify-center">
                <div className="flex items-center space-x-1">
                  <a href="#" className="px-3 py-1 rounded hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                  </a>
                  <a href="#" className="px-3 py-1 rounded hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </a>
                  <a href="#" className="px-3 py-1 rounded text-white" style={{ backgroundColor: 'rgb(251,229,187)' }}>1</a>
                  <a href="#" className="px-3 py-1 rounded hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                  <a href="#" className="px-3 py-1 rounded hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 p-4 border-t">
        &copy; 2025 신사 플라워. All rights reserved.
      </footer>
    </div>
  );
};

export default Notice; 