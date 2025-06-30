import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FindPassword = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [timerInterval, setTimerInterval] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(180);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [step1Data, setStep1Data] = useState({
    userId: '',
    ownerName: '',
    businessNumber: '',
    phoneNumber: ''
  });
  
  const [verificationCode, setVerificationCode] = useState('');
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  
  const verificationTestCode = '123456'; // 테스트용 인증번호

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
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  const startVerificationTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    setRemainingSeconds(180);
    
    const interval = setInterval(() => {
      setRemainingSeconds(prev => {
        const newValue = prev - 1;
        if (newValue <= 0) {
          clearInterval(interval);
          alert('인증시간이 만료되었습니다. 인증번호를 다시 요청해주세요.');
          setCurrentStep(1);
        }
        return newValue;
      });
    }, 1000);
    
    setTimerInterval(interval);
  };

  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const maskPhoneNumber = (phone) => {
    return phone.replace(/(\d{3})-?(\d{4})-?(\d{4})/, '$1-****-$3');
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    const { userId, ownerName, businessNumber, phoneNumber } = step1Data;
    
    if (!userId || !ownerName || !businessNumber || !phoneNumber) {
      alert('모든 정보를 입력해주세요.');
      return;
    }
    
    // 실제로는 서버 API 호출
    const user = {
      userId,
      ownerName,
      businessNumber,
      phoneNumber
    };
    
    setCurrentUser(user);
    startVerificationTimer();
    setCurrentStep(2);
  };

  const handleResendCode = () => {
    alert('인증번호가 재전송되었습니다. (테스트용 인증번호: 123456)');
    startVerificationTimer();
  };

  const handleVerifyCode = () => {
    if (!verificationCode) {
      alert('인증번호를 입력해주세요.');
      return;
    }
    
    if (verificationCode === verificationTestCode) {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      setCurrentStep(3);
    } else {
      alert('인증번호가 일치하지 않습니다.');
    }
  };

  const handlePasswordChange = () => {
    const { newPassword, confirmPassword } = passwordData;
    
    if (!newPassword || !confirmPassword) {
      alert('새 비밀번호를 입력해주세요.');
      return;
    }
    
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      alert('비밀번호는 영문, 숫자, 특수문자 조합 8자 이상이어야 합니다.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    // 실제로는 서버 API 호출
    console.log('비밀번호 변경됨:', currentUser);
    setCurrentStep(4);
  };

  const handleClose = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    navigate('/login');
  };

  const renderStep1 = () => (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-1">비밀번호 찾기</h2>
        <p className="text-sm text-gray-600">회원정보를 입력하여 비밀번호를 재설정하세요</p>
      </div>
      
      <form onSubmit={handleStep1Submit} className="space-y-4">
        <div>
          <label htmlFor="user-id" className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
          <input
            id="user-id"
            type="text"
            value={step1Data.userId}
            onChange={(e) => setStep1Data({...step1Data, userId: e.target.value})}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
            placeholder="아이디를 입력하세요"
          />
        </div>
        
        <div>
          <label htmlFor="owner-name" className="block text-sm font-medium text-gray-700 mb-1">대표자 이름</label>
          <input
            id="owner-name"
            type="text"
            value={step1Data.ownerName}
            onChange={(e) => setStep1Data({...step1Data, ownerName: e.target.value})}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
            placeholder="대표자 이름을 입력하세요"
          />
        </div>
        
        <div>
          <label htmlFor="business-number" className="block text-sm font-medium text-gray-700 mb-1">사업자 등록번호</label>
          <input
            id="business-number"
            type="text"
            value={step1Data.businessNumber}
            onChange={(e) => setStep1Data({...step1Data, businessNumber: e.target.value})}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
            placeholder="사업자 등록번호를 입력하세요 (- 없이)"
          />
        </div>
        
        <div>
          <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 mb-1">휴대폰 번호</label>
          <input
            id="phone-number"
            type="text"
            value={step1Data.phoneNumber}
            onChange={(e) => setStep1Data({...step1Data, phoneNumber: e.target.value})}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
            placeholder="휴대폰 번호를 입력하세요 (- 없이)"
          />
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-200"
            style={{ backgroundColor: 'rgb(251,229,187)' }}
          >
            인증번호 받기
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-center">
        <button onClick={handleClose} className="text-sm text-gray-600 hover:underline">닫기</button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-1">휴대폰 인증</h2>
        <p className="text-sm text-gray-600">휴대폰으로 전송된 인증번호를 입력하세요</p>
      </div>
      
      <div>
        <p className="text-sm mb-2">
          <span className="text-gray-700 font-medium">휴대폰 번호:</span> 
          <span>{currentUser && maskPhoneNumber(currentUser.phoneNumber)}</span>
        </p>
        
        <div className="flex items-center">
          <div className="flex-grow">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
              placeholder="인증번호 6자리"
              maxLength="6"
            />
          </div>
          <div className="ml-2">
            <span className="text-sm text-red-500 font-medium">{formatTimer(remainingSeconds)}</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-1">인증번호가 전송되었습니다. (테스트용 인증번호: 123456)</p>
      </div>
      
      <div className="mt-6">
        <button
          onClick={handleVerifyCode}
          className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-200"
          style={{ backgroundColor: 'rgb(251,229,187)' }}
        >
          인증 확인
        </button>
      </div>
      
      <div className="mt-4 text-center">
        <button onClick={handleResendCode} className="text-sm text-gray-600 hover:underline mr-4">인증번호 재전송</button>
        <button onClick={handleClose} className="text-sm text-gray-600 hover:underline">닫기</button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-1">새 비밀번호 설정</h2>
        <p className="text-sm text-gray-600">새로운 비밀번호를 입력해주세요</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
          <input
            id="new-password"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
            placeholder="새 비밀번호"
          />
          <p className="text-xs text-gray-500 mt-1">영문, 숫자, 특수문자 조합 8자 이상</p>
        </div>
        
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호 확인</label>
          <input
            id="confirm-password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
            placeholder="새 비밀번호 확인"
          />
        </div>
      </div>
      
      <div className="mt-6">
        <button
          onClick={handlePasswordChange}
          className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-200"
          style={{ backgroundColor: 'rgb(251,229,187)' }}
        >
          비밀번호 변경
        </button>
      </div>
      
      <div className="mt-4 text-center">
        <button onClick={handleClose} className="text-sm text-gray-600 hover:underline">닫기</button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="text-center py-8">
      <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <h2 className="mt-4 text-xl font-bold text-gray-900">비밀번호가 변경되었습니다</h2>
      <p className="mt-2 text-sm text-gray-600">
        새 비밀번호로 로그인해 주세요
      </p>
      <button
        onClick={() => navigate('/login')}
        className="mt-6 py-2 px-6 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-200"
        style={{ backgroundColor: 'rgb(251,229,187)' }}
      >
        로그인하기
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6" style={{ maxWidth: '400px', width: '90%' }}>
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}
    </div>
  );
};

export default FindPassword; 