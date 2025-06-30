import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';

const MemberSearchModal = ({ isOpen, onClose, onSelect }) => {
  const [searchType, setSearchType] = useState('상호명');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [selectedMember, setSelectedMember] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 지역 목록 확장
  const regionOptions = [
    '전체', '서울', '경기', '인천', '강원', '충북', '충남', 
    '경북', '경남', '전북', '전남', '제주', '부산', '대구', 
    '대전', '광주', '울산', '세종'
  ];

  // 회원 검색 API 호출
  const { data: members = [], isLoading, error, refetch } = useQuery({
    queryKey: ['searchMembers', searchType, searchKeyword, selectedRegion],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchKeyword.trim()) {
        params.append('searchType', searchType);
        params.append('searchKeyword', searchKeyword.trim());
      }
      if (selectedRegion !== '전체') {
        params.append('region', selectedRegion);
      }
      
      const response = await apiClient.get(`/api/orders/search-members?${params}`);
      return response.data;
    },
    enabled: isOpen && !isInitialLoad, // 모달이 열려있고 초기 로드가 아닐 때만 실행
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    retry: 2, // 실패 시 2번 재시도
    onError: (error) => {
      console.error('회원 검색 오류:', error);
    }
  });

  // 페이지네이션 설정
  const itemsPerPage = 10;
  const totalPages = Math.ceil(members.length / itemsPerPage);
  const currentMembers = members.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 검색 실행
  const handleSearch = () => {
    setCurrentPage(1);
    setIsInitialLoad(false);
    refetch();
  };

  // 엔터키 검색
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 지역 변경 시 자동 검색
  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    setCurrentPage(1);
    if (!isInitialLoad) {
      // 지역 변경 시 바로 검색 실행
      setTimeout(() => refetch(), 100);
    }
  };

  // 검색 타입 변경 시 키워드 초기화
  const handleSearchTypeChange = (newSearchType) => {
    setSearchType(newSearchType);
    setSearchKeyword('');
  };

  // 회원 선택
  const handleMemberSelect = (member) => {
    setSelectedMember(member);
  };

  // 선택 완료
  const handleSelectComplete = () => {
    if (selectedMember) {
      onSelect(selectedMember);
      onClose();
      resetModal();
    } else {
      alert('회원을 선택해주세요.');
    }
  };

  // 모달 초기화
  const resetModal = () => {
    setSearchKeyword('');
    setSelectedRegion('전체');
    setSelectedMember(null);
    setCurrentPage(1);
    setIsInitialLoad(true);
  };

  // 모달 닫기
  const handleClose = () => {
    onClose();
    resetModal();
  };

  // 페이지 변경
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 모달이 열릴 때 초기 데이터 로드
  useEffect(() => {
    if (isOpen && isInitialLoad) {
      setIsInitialLoad(false);
      refetch();
    }
  }, [isOpen, isInitialLoad, refetch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl h-[700px] flex flex-col">
        {/* 헤더 */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">회원검색</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* 검색 영역 */}
        <div className="p-4 border-b">
          <div className="flex gap-2 mb-3">
            <select
              value={searchType}
              onChange={(e) => handleSearchTypeChange(e.target.value)}
              className="border rounded p-2 text-sm min-w-24"
            >
              <option value="상호명">상호명</option>
              <option value="회원코드">회원코드</option>
              <option value="대표자명">대표자명</option>
              <option value="전화번호">전화번호</option>
            </select>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`${searchType}을(를) 입력하세요`}
              className="border rounded p-2 flex-grow text-sm"
            />
            <button
              onClick={handleSearch}
              className="bg-amber-200 text-white px-4 py-2 rounded text-sm hover:bg-amber-300 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? '검색중...' : '검색'}
            </button>
            <button
              onClick={() => {
                setSearchKeyword('');
                setSelectedRegion('전체');
                setCurrentPage(1);
                refetch();
              }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300"
            >
              초기화
            </button>
          </div>

          {/* 지역 필터 - 개선된 UI */}
          <div className="mb-2">
            <label className="text-sm font-medium text-gray-700 mb-2 block">지역 필터:</label>
            <div className="flex flex-wrap gap-2 text-sm">
              {regionOptions.map((region) => (
                <label key={region} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="region"
                    value={region}
                    checked={selectedRegion === region}
                    onChange={(e) => handleRegionChange(e.target.value)}
                    className="mr-1"
                  />
                  <span className={`px-2 py-1 rounded ${
                    selectedRegion === region 
                      ? 'bg-amber-100 text-amber-800 font-medium' 
                      : 'hover:bg-gray-100'
                  }`}>
                    {region}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 검색 결과 개수 표시 */}
          <div className="text-sm text-gray-600">
            총 {members.length}건의 회원이 검색되었습니다.
          </div>
        </div>

        {/* 검색 결과 */}
        <div className="flex-1 overflow-auto">
          {error && (
            <div className="p-4 text-red-600 text-center">
              검색 중 오류가 발생했습니다: {error.message}
              <button 
                onClick={() => refetch()} 
                className="ml-2 text-blue-600 underline"
              >
                다시 시도
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="p-4 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
              <span className="ml-2">검색 중...</span>
            </div>
          ) : (
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">선택</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">상호명</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">대표자명</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">전화번호</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">사업장<br />주소</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">배송<br />지역</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentMembers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-3 py-8 text-center text-gray-500">
                      {isInitialLoad ? '검색을 실행해주세요.' : '검색 결과가 없습니다.'}
                    </td>
                  </tr>
                ) : (
                  currentMembers.map((member) => (
                    <tr
                      key={member.id}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedMember?.id === member.id ? 'bg-amber-50 border-amber-200' : ''
                      }`}
                      onClick={() => handleMemberSelect(member)}
                    >
                      <td className="px-3 py-2">
                        <input
                          type="radio"
                          name="selectedMember"
                          checked={selectedMember?.id === member.id}
                          onChange={() => handleMemberSelect(member)}
                        />
                      </td>
                      <td className="px-3 py-2 text-sm font-medium">{member.corporationName}</td>
                      <td className="px-3 py-2 text-sm">{member.ownerName}</td>
                      <td className="px-3 py-2 text-sm">{member.phoneNumber}</td>
                      <td className="px-3 py-2 text-sm whitespace-pre-line">{member.businessAddress}</td>
                      <td className="px-3 py-2 text-sm">
                        {member.deliveryRegion}
                        <br />
                        <span className="text-orange-600 font-medium">
                          {member.deliveryPrice?.toLocaleString()}원
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center p-4 border-t gap-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 text-gray-600 disabled:opacity-50 hover:bg-gray-100 rounded"
            >
              &lt;
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded text-sm ${
                    currentPage === pageNum
                      ? 'bg-blue-500 text-white'
                      : 'border hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-2 py-1 text-gray-600 disabled:opacity-50 hover:bg-gray-100 rounded"
            >
              &gt;
            </button>
          </div>
        )}

        {/* 버튼 영역 */}
        <div className="flex justify-end p-4 border-t gap-2">
          <button
            onClick={handleSelectComplete}
            className="bg-amber-200 text-white px-4 py-2 rounded text-sm hover:bg-amber-300 disabled:opacity-50"
            disabled={!selectedMember}
          >
            선택완료
          </button>
          <button
            onClick={handleClose}
            className="bg-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-400"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberSearchModal; 