import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, authAPI } from '../../services/apiService';

const AdminMemberApproval = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // 승인 대기 사용자 목록 가져오기
  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getPendingUsers();
      setPendingUsers(response.data);
    } catch (error) {
      console.error('사용자 목록 조회 오류:', error);
      alert(error.response?.data?.message || '사용자 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 회원 승인
  const handleApprove = async (userId) => {
    if (!window.confirm('이 회원을 승인하시겠습니까?')) return;

    try {
      const response = await adminAPI.approveUser(userId);
      alert(response.message || '회원이 승인되었습니다.');
      fetchPendingUsers(); // 목록 새로고침
    } catch (error) {
      console.error('승인 처리 오류:', error);
      alert(error.response?.data?.message || '승인 처리 중 오류가 발생했습니다.');
    }
  };

  // 회원 거절
  const handleReject = async (userId) => {
    const reason = prompt('거절 사유를 입력하세요:');
    if (!reason) return;

    try {
      const response = await adminAPI.rejectUser(userId, reason);
      alert(response.message || '회원이 거절되었습니다.');
      fetchPendingUsers(); // 목록 새로고침
    } catch (error) {
      console.error('거절 처리 오류:', error);
      alert(error.response?.data?.message || '거절 처리 중 오류가 발생했습니다.');
    }
  };

  // 로그아웃
  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('로그아웃 오류:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  // 검색 및 필터링
  const filteredUsers = pendingUsers.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.userId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || user.userType === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* Header */}
      <header className="bg-white shadow p-2 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/admin-dashboard">
            <img src="/images/sinsa-flower-logo-nobg.png" alt="신사 플라워 로고" className="h-12 mr-2" />
            <span style={{ color: 'rgb(251,229,187)' }} className="text-xl font-bold">신사 플라워</span>
          </Link>
        </div>
        <div className="text-sm space-x-4">
          <span className="text-gray-600">관리자님 환영합니다</span>
          <button onClick={handleLogout} className="text-sm hover:underline">로그아웃</button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md min-h-screen">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">관리자 메뉴</h2>
            <nav className="space-y-2">
              <Link to="/admin-dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                대시보드
              </Link>
              <Link to="/admin-member-approval" className="block px-4 py-2 bg-amber-100 text-amber-800 rounded">
                회원 승인 관리
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">회원 승인 관리</h1>
            <p className="text-gray-600">신규 가입한 회원들을 승인하거나 거절할 수 있습니다.</p>
          </div>

          {/* 검색 및 필터 */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="이름 또는 아이디로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-200"
              >
                <option value="all">전체</option>
                <option value="BUSINESS">사업자</option>
                <option value="USER">일반 사용자</option>
              </select>
              <button
                onClick={fetchPendingUsers}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                새로고침
              </button>
            </div>
          </div>

          {/* 회원 목록 테이블 */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      회원 정보
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      연락처
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      가입일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center">
                        로딩 중...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        승인 대기 중인 회원이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.userId}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.registrationDate ? new Date(user.registrationDate).toLocaleDateString() : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            승인 대기
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleApprove(user.userId)}
                            className="text-green-600 hover:text-green-900"
                          >
                            승인
                          </button>
                          <button
                            onClick={() => handleReject(user.userId)}
                            className="text-red-600 hover:text-red-900"
                          >
                            거절
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMemberApproval; 