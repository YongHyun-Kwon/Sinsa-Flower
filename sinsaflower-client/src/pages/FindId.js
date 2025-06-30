import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FindId = () => {
  const navigate = useNavigate();
  const [showResult, setShowResult] = useState(false);
  const [foundUserId, setFoundUserId] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    ownerName: '',
    businessNumber: '',
    phoneNumber: ''
  });

  useEffect(() => {
    document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    document.body.style.height = '100vh';
    document.body.style.display = 'flex';
    document.body.style.justifyContent = 'center';
    document.body.style.alignItems = 'center';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.height = '';
      document.body.style.display = '';
      document.body.style.justifyContent = '';
      document.body.style.alignItems = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
    };
  }, []);

  const handleFindId = () => {
    const { ownerName, businessNumber, phoneNumber } = formData;
    
    if (!ownerName || !businessNumber || !phoneNumber) {
      alert('모든 정보를 입력해주세요.');
      return;
    }
    
    // 실제로는 서버 API 호출
    // 테스트용 데이터 검증 로직
    const testUser = {
      ownerName: '홍길동',
      businessNumber: '1234567890',
      phoneNumber: '01012345678',
      userId: 'testuser123'
    };
    
    if (
      ownerName === testUser.ownerName && 
      businessNumber === testUser.businessNumber && 
      phoneNumber === testUser.phoneNumber
    ) {
      setFoundUserId(testUser.userId);
      setIsSuccess(true);
    } else {
      setIsSuccess(false);
    }
    
    setShowResult(true);
  };

  const handleConfirm = () => {
    navigate('/login');
  };

  const handleClose = () => {
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6" style={{ maxWidth: '400px', width: '90%' }}>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-1">아이디 찾기</h2>
        <p className="text-sm text-gray-600">회원정보를 입력하여 아이디를 찾으세요</p>
      </div>
      
      {!showResult ? (
        <div>
          <div className="space-y-4">
            <div>
              <label htmlFor="owner-name" className="block text-sm font-medium text-gray-700 mb-1">대표자 이름</label>
              <input
                id="owner-name"
                name="ownerName"
                type="text"
                value={formData.ownerName}
                onChange={handleInputChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
                placeholder="대표자 이름을 입력하세요"
              />
            </div>
            
            <div>
              <label htmlFor="business-number" className="block text-sm font-medium text-gray-700 mb-1">사업자 등록번호</label>
              <input
                id="business-number"
                name="businessNumber"
                type="text"
                value={formData.businessNumber}
                onChange={handleInputChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
                placeholder="사업자 등록번호를 입력하세요 (- 없이)"
              />
            </div>
            
            <div>
              <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
              <input
                id="phone-number"
                name="phoneNumber"
                type="text"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
                placeholder="전화번호를 입력하세요 (- 없이)"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleFindId}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-200"
              style={{ backgroundColor: 'rgb(251,229,187)' }}
            >
              아이디 찾기
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 py-4 text-center">
          {isSuccess ? (
            <div className="text-green-600 font-medium">
              아이디가 확인되었습니다: <span className="font-bold">{foundUserId}</span>
            </div>
          ) : (
            <div className="text-red-600 font-medium">
              일치하는 정보가 없습니다.
            </div>
          )}
          <button 
            onClick={handleConfirm}
            className="mt-4 py-2 px-6 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-200"
            style={{ backgroundColor: 'rgb(251,229,187)' }}
          >
            확인
          </button>
        </div>
      )}
      
      <div className="mt-4 text-center">
        <button onClick={handleClose} className="text-sm text-gray-600 hover:underline">닫기</button>
      </div>
    </div>
  );
};

export default FindId; 