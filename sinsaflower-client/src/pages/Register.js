import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [termsAgreed, setTermsAgreed] = useState({
    all: false,
    terms1: false,
    terms2: false,
    terms3: false
  });
  const [showTermsDetail, setShowTermsDetail] = useState({
    terms1: false,
    terms2: false,
    terms3: false
  });

  // Daum Postcode 스크립트 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // 백엔드 SignupRequestDto와 완전히 일치하는 폼 데이터
  const [formData, setFormData] = useState({
    // User 정보
    userId: '',
    name: '',
    phoneNumber: '',
    password: '',
    passwordConfirm: '',
    email: '',
    profileImage: '',
    userType: 'BUSINESS',
    status: 'PENDING', // 기본값: 승인대기
    phoneVerified: false,
    isMarketing: false,
    role: 'BUSINESS',

    // BusinessInfo 정보
    businessRegistrationNum: '',
    corporationName: '',
    ceoName: '',
    businessType: '',
    businessAddress: '',
    businessAddressDetail: '', // 사업장 상세 주소
    businessRegistrationCert: '',
    faxNumber: '',
    faxSettings: 'AUTO', // 기본값
    smsSettings: 'AUTO', // 기본값
    businessHours: '',

    // AccountInfo 정보
    accountNumber: '',
    virtualAccount: '',
    bankAccountCopy: '',

    // DeliverySetting 정보
    deliveryAreaInfo: '',
    memberActualAddress: '',
    memberActualAddressDetail: '', // 실제 주소 상세
    mainPhoneNumber: '',
    mainMobileNumber: '',
    autoProductRegister: false,
    handleFruitProducts: false,
    handleCondolenceBasket: false,
    expressDeliveryAvailable: false,
    handleRoundFlowerArrangement: false,
    blackGoldRibbonAvailable: false,
    handleLargeExtraLarge: false,
    handle4_5Tier: false,
    handleBonsa: false,
    holidayDeliveryAvailable: false,
    nightDeliveryAvailable: false
  });

  // 주소 검색을 위한 기본 주소 저장용 상태
  const [baseAddresses, setBaseAddresses] = useState({
    businessAddress: '',
    memberActualAddress: ''
  });

  const [userIdChecked, setUserIdChecked] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // 상세 주소가 변경될 때 최종 주소 업데이트
    if (name === 'businessAddressDetail') {
      const fullAddress = baseAddresses.businessAddress + (value ? ' ' + value : '');
      setFormData(prev => ({
        ...prev,
        businessAddress: fullAddress,
        businessAddressDetail: value
      }));
    } else if (name === 'memberActualAddressDetail') {
      const fullAddress = baseAddresses.memberActualAddress + (value ? ' ' + value : '');
      setFormData(prev => ({
        ...prev,
        memberActualAddress: fullAddress,
        memberActualAddressDetail: value
      }));
    }
    
    // 아이디가 변경되면 중복확인 상태 초기화
    if (name === 'userId') {
      setUserIdChecked(false);
    }
  };

  const handleTermsChange = (termType) => {
    if (termType === 'all') {
      const newValue = !termsAgreed.all;
      setTermsAgreed({
        all: newValue,
        terms1: newValue,
        terms2: newValue,
        terms3: newValue
      });
      setFormData(prev => ({
        ...prev,
        isMarketing: newValue
      }));
    } else {
      const newTerms = { ...termsAgreed, [termType]: !termsAgreed[termType] };
      newTerms.all = newTerms.terms1 && newTerms.terms2 && newTerms.terms3;
      setTermsAgreed(newTerms);
      
      if (termType === 'terms3') {
        setFormData(prev => ({
          ...prev,
          isMarketing: !termsAgreed[termType]
        }));
      }
    }
  };

  const toggleTermsDetail = (termType) => {
    setShowTermsDetail(prev => ({
      ...prev,
      [termType]: !prev[termType]
    }));
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!termsAgreed.terms1 || !termsAgreed.terms2) {
        alert('필수 약관에 동의해주세요.');
        return;
      }
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const checkUserIdDuplicate = async () => {
    if (!formData.userId) {
      alert('아이디를 입력해주세요.');
      return;
    }

    try {
      const response = await authService.checkUserId(formData.userId);
      
      if (response.available) {
        alert('사용 가능한 아이디입니다.');
        setUserIdChecked(true);
      } else {
        alert('이미 사용중인 아이디입니다.');
        setUserIdChecked(false);
      }
    } catch (error) {
      console.error('아이디 중복 확인 오류:', error);
      alert(error.response?.data?.message || '중복 확인 중 오류가 발생했습니다.');
    }
  };

  const submitRegistration = async () => {
    // 필수 필드 검증
    if (!formData.userId || !formData.password || !formData.name || !formData.phoneNumber) {
      alert('필수 정보를 입력해주세요.');
      return;
    }

    if (!userIdChecked) {
      alert('아이디 중복 확인을 해주세요.');
      return;
    }

    // 비밀번호 확인
    if (formData.password !== formData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await authService.signup(formData);

      // authService.signup이 이제 response.data를 반환하므로 직접 message에 접근
      const message = response.message || '회원가입이 완료되었습니다. 관리자 승인 후 로그인이 가능합니다.';
      alert(message);
      setCurrentStep(3);
    } catch (error) {
      console.error('회원가입 오류:', error);
      alert(error.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
    }
  };

  // 주소 검색 함수
  const openAddressSearch = (addressType) => {
    if (!window.daum || !window.daum.Postcode) {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: function(data) {
        // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
        
        // 도로명 주소의 노출 규칙에 따라 주소를 표시한다.
        // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
        let addr = ''; // 주소 변수
        let extraAddr = ''; // 참고항목 변수

        //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
        if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
          addr = data.roadAddress;
        } else { // 사용자가 지번 주소를 선택했을 경우(J)
          addr = data.jibunAddress;
        }

        // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
        if(data.userSelectedType === 'R'){
          // 법정동명이 있을 경우 추가한다. (법정리는 제외)
          // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
          if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
            extraAddr += data.bname;
          }
          // 건물명이 있고, 공동주택일 경우 추가한다.
          if(data.buildingName !== '' && data.apartment === 'Y'){
            extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
          }
          // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
          if(extraAddr !== ''){
            extraAddr = ' (' + extraAddr + ')';
          }
        }

        // 기본 주소 (참고항목 포함)
        const baseAddress = addr + extraAddr;

        // 기본 주소 저장
        setBaseAddresses(prev => ({
          ...prev,
          [addressType]: baseAddress
        }));

        // 기존 상세 주소와 합쳐서 최종 주소 생성
        const detailKey = addressType + 'Detail';
        const existingDetail = formData[detailKey] || '';
        const fullAddress = baseAddress + (existingDetail ? ' ' + existingDetail : '');

        // 선택된 주소를 해당 필드에 설정
        setFormData(prev => ({
          ...prev,
          [addressType]: fullAddress
        }));
      }
    }).open();
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* Header */}
      <header className="bg-white shadow p-2 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <img src="/images/sinsa-flower-logo-nobg.png" alt="신사 플라워 로고" className="h-12 mr-2" />
            <span style={{ color: 'rgb(251,229,187)' }} className="text-xl font-bold">신사 플라워</span>
          </Link>
        </div>
        <div className="text-sm space-x-4">
          <Link to="/login" className="text-sm hover:underline">로그인</Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto mt-8 px-4 pb-12 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">회원가입</h1>
        
        {/* 가입 단계 */}
        <div className="flex mb-8 justify-center">
          <div className="flex items-center">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
              currentStep >= 1 ? 'bg-amber-200 text-white' : 'bg-gray-200 text-gray-500'
            }`}>1</div>
            <div className="text-sm ml-2">약관동의</div>
          </div>
          <div className="w-16 h-1 mx-2 bg-gray-200 self-center"></div>
          <div className="flex items-center">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
              currentStep >= 2 ? 'bg-amber-200 text-white' : 'bg-gray-200 text-gray-500'
            }`}>2</div>
            <div className="text-sm ml-2">정보입력</div>
          </div>
          <div className="w-16 h-1 mx-2 bg-gray-200 self-center"></div>
          <div className="flex items-center">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
              currentStep >= 3 ? 'bg-amber-200 text-white' : 'bg-gray-200 text-gray-500'
            }`}>3</div>
            <div className="text-sm ml-2">가입완료</div>
          </div>
        </div>
        
        {/* Step 1: 약관동의 */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">이용약관 동의</h2>
            
            <div className="mb-6">
              <div className="border rounded-md p-4 mb-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-medium flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2 h-4 w-4 text-amber-200 focus:ring-amber-200 border-gray-300 rounded"
                      checked={termsAgreed.all}
                      onChange={() => handleTermsChange('all')}
                    />
                    전체 약관에 동의합니다
                  </label>
                </div>
                <div className="border-t pt-2 pl-6 text-sm text-gray-600">
                  선택 항목에 동의하지 않으셔도 서비스 이용이 가능합니다.
                </div>
              </div>
              
              {/* 이용약관 */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2 h-4 w-4 text-amber-200 focus:ring-amber-200 border-gray-300 rounded"
                      checked={termsAgreed.terms1}
                      onChange={() => handleTermsChange('terms1')}
                    />
                    <span className="text-red-500 mr-1">*</span> 서비스 이용약관 동의 (필수)
                  </label>
                  <button 
                    type="button" 
                    className="text-sm text-gray-500 hover:underline"
                    onClick={() => toggleTermsDetail('terms1')}
                  >
                    자세히
                  </button>
                </div>
                {showTermsDetail.terms1 && (
                  <div className="bg-gray-50 p-4 border rounded-md h-32 overflow-y-auto text-sm text-gray-600">
                    <p className="mb-2 font-semibold">제1장 총칙</p>
                    <p>제1조 (목적)</p>
                    <p>이 약관은 신사 플라워(이하 "회사"라 함)가 제공하는 서비스(이하 "서비스"라 함)의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.</p>
                    <p>제2조 (약관의 효력 및 변경)</p>
                    <p>① 이 약관은 서비스를 통하여 이를 공지하거나 전자우편, 기타의 방법으로 이용자에게 통지함으로써 효력이 발생합니다.</p>
                  </div>
                )}
              </div>
              
              {/* 개인정보 수집 이용 */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2 h-4 w-4 text-amber-200 focus:ring-amber-200 border-gray-300 rounded"
                      checked={termsAgreed.terms2}
                      onChange={() => handleTermsChange('terms2')}
                    />
                    <span className="text-red-500 mr-1">*</span> 개인정보 수집 및 이용 동의 (필수)
                  </label>
                  <button 
                    type="button" 
                    className="text-sm text-gray-500 hover:underline"
                    onClick={() => toggleTermsDetail('terms2')}
                  >
                    자세히
                  </button>
                </div>
                {showTermsDetail.terms2 && (
                  <div className="bg-gray-50 p-4 border rounded-md h-32 overflow-y-auto text-sm text-gray-600">
                    <p className="mb-2 font-semibold">개인정보 수집 및 이용 안내</p>
                    <p>① 수집하는 개인정보 항목: 아이디, 이름(상호명), 비밀번호, 연락처, 주소, 사업자등록번호, 계좌정보</p>
                    <p>② 수집 및 이용 목적: 회원제 서비스 제공, 서비스 이용 및 상담, 거래 관리</p>
                    <p>③ 보유 및 이용기간: 회원 탈퇴 시까지 (단, 관계 법령에 따라 필요한 경우 해당 법령에서 정한 기간 동안 보존)</p>
                  </div>
                )}
              </div>
              
              {/* 마케팅 정보 수신 동의 */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2 h-4 w-4 text-amber-200 focus:ring-amber-200 border-gray-300 rounded"
                      checked={termsAgreed.terms3}
                      onChange={() => handleTermsChange('terms3')}
                    />
                    마케팅 정보 수신 동의 (선택)
                  </label>
                  <button 
                    type="button" 
                    className="text-sm text-gray-500 hover:underline"
                    onClick={() => toggleTermsDetail('terms3')}
                  >
                    자세히
                  </button>
                </div>
                {showTermsDetail.terms3 && (
                  <div className="bg-gray-50 p-4 border rounded-md h-32 overflow-y-auto text-sm text-gray-600">
                    <p className="mb-2 font-semibold">마케팅 정보 수신 안내</p>
                    <p>① 수집 항목: 휴대전화번호, 이메일</p>
                    <p>② 이용 목적: 신규 서비스 안내, 이벤트 및 혜택 정보 제공</p>
                    <p>③ 보유 및 이용기간: 회원 탈퇴 시 또는 동의 철회 시까지</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-center">
              <button 
                type="button" 
                className="px-6 py-2 rounded-md font-medium text-white"
                style={{ backgroundColor: 'rgb(251,229,187)' }}
                onClick={nextStep}
              >
                다음
              </button>
            </div>
          </div>
        )}
        
        {/* Step 2: 정보입력 */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">회원 정보 입력</h2>
            
            <form className="space-y-8">
              {/* 기본 정보 */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-medium mb-4">기본 정보</h3>
                
                <div className="grid grid-cols-1 gap-y-6">
                  {/* 아이디 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      아이디 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <input 
                        type="text" 
                        name="userId"
                        value={formData.userId}
                        onChange={handleInputChange}
                        required
                        className="flex-1 appearance-none rounded-md relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
                        placeholder="6~20자의 영문, 숫자 조합" 
                      />
                      <button 
                        type="button" 
                        className="ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600"
                        onClick={checkUserIdDuplicate}
                      >
                        중복확인
                      </button>
                    </div>
                  </div>
                  
                  {/* 이름(상호명) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      이름 <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
                      placeholder="이름을 입력하세요" 
                    />
                  </div>
                  
                  {/* 비밀번호 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      비밀번호 <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="password" 
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
                      placeholder="8~16자의 영문, 숫자, 특수문자 조합" 
                    />
                    <p className="mt-1 text-xs text-gray-500">8~16자의 영문, 숫자, 특수문자 조합으로 입력해주세요.</p>
                  </div>
                  
                  {/* 비밀번호 확인 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      비밀번호 확인 <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="password" 
                      name="passwordConfirm"
                      value={formData.passwordConfirm}
                      onChange={handleInputChange}
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
                      placeholder="비밀번호를 다시 입력하세요" 
                    />
                  </div>
                  
                  {/* 휴대전화번호 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      휴대전화번호 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <input 
                        type="tel" 
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                        className="flex-1 appearance-none rounded-md relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
                        placeholder="휴대전화번호를 입력하세요 (- 제외)" 
                      />
                      <button 
                        type="button" 
                        className="ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600"
                      >
                        인증
                      </button>
                    </div>
                  </div>

                  {/* 이메일 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      이메일
                    </label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
                      placeholder="이메일을 입력하세요" 
                    />
                  </div>
                </div>
              </div>

              {/* 사업자 정보 */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-medium mb-4">사업자 정보</h3>
                
                <div className="grid grid-cols-1 gap-y-6">
                  {/* 사업자등록번호 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      사업자등록번호 <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="businessRegistrationNum"
                      value={formData.businessRegistrationNum}
                      onChange={handleInputChange}
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
                      placeholder="사업자등록번호를 입력하세요 (- 제외)" 
                    />
                  </div>
                  
                  {/* 상호명 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      상호명 <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="corporationName"
                      value={formData.corporationName}
                      onChange={handleInputChange}
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
                      placeholder="상호명을 입력하세요" 
                    />
                  </div>
                  
                  {/* 대표자명 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      대표자명 <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="ceoName"
                      value={formData.ceoName}
                      onChange={handleInputChange}
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
                      placeholder="대표자명을 입력하세요" 
                    />
                  </div>
                  
                  {/* 업종 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      업종 <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
                      placeholder="업종을 입력하세요" 
                    />
                  </div>
                  
                  {/* 사업장 주소 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      사업장 주소 <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      <div className="flex">
                        <input 
                          type="text" 
                          value={baseAddresses.businessAddress}
                          readOnly
                          className="flex-1 appearance-none rounded-md relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-gray-50 focus:outline-none focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
                          placeholder="주소 검색 버튼을 클릭하세요" 
                        />
                        <button 
                          type="button" 
                          onClick={() => openAddressSearch('businessAddress')}
                          className="ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600"
                        >
                          주소검색
                        </button>
                      </div>
                      <input 
                        type="text" 
                        name="businessAddressDetail"
                        value={formData.businessAddressDetail}
                        onChange={handleInputChange}
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
                        placeholder="상세 주소를 입력하세요 (동, 호수 등)"
                      />
                    </div>
                  </div>

                  {/* 팩스번호 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      팩스번호
                    </label>
                    <input 
                      type="text" 
                      name="faxNumber"
                      value={formData.faxNumber}
                      onChange={handleInputChange}
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
                      placeholder="팩스번호를 입력하세요 (- 제외)" 
                    />
                  </div>

                  {/* 영업시간 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      영업시간
                    </label>
                    <input 
                      type="text" 
                      name="businessHours"
                      value={formData.businessHours}
                      onChange={handleInputChange}
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
                      placeholder="예: 평일 09:00-18:00, 토요일 09:00-13:00" 
                    />
                  </div>

                  {/* 팩스 설정 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      팩스 설정
                    </label>
                    <select 
                      name="faxSettings"
                      value={formData.faxSettings}
                      onChange={handleInputChange}
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
                    >
                      <option value="AUTO">자동 수신</option>
                      <option value="MANUAL">수동 수신</option>
                      <option value="OFF">사용 안함</option>
                    </select>
                  </div>

                  {/* SMS 설정 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SMS 설정
                    </label>
                    <select 
                      name="smsSettings"
                      value={formData.smsSettings}
                      onChange={handleInputChange}
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
                    >
                      <option value="AUTO">자동 발송</option>
                      <option value="MANUAL">수동 발송</option>
                      <option value="OFF">사용 안함</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 정산 계좌 정보 */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-medium mb-4">정산 계좌 정보</h3>
                
                <div className="grid grid-cols-1 gap-y-6">
                  {/* 계좌번호 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      계좌번호 <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
                      placeholder="계좌번호를 입력하세요 (- 제외)" 
                    />
                  </div>

                  {/* 가상계좌 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      가상계좌
                    </label>
                    <input 
                      type="text" 
                      name="virtualAccount"
                      value={formData.virtualAccount}
                      onChange={handleInputChange}
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
                      placeholder="가상계좌번호를 입력하세요" 
                    />
                  </div>
                </div>
              </div>

              {/* 배송 및 서비스 설정 */}
              <div>
                <h3 className="text-lg font-medium mb-4">배송 및 서비스 설정</h3>
                
                <div className="grid grid-cols-1 gap-y-6">
                  {/* 배송 가능 지역 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      배송 가능 지역 <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="deliveryAreaInfo"
                      value={formData.deliveryAreaInfo}
                      onChange={handleInputChange}
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
                      placeholder="배송 가능 지역을 입력하세요" 
                    />
                  </div>

                  {/* 실제 주소 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      실제 주소 <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      <div className="flex">
                        <input 
                          type="text" 
                          value={baseAddresses.memberActualAddress}
                          readOnly
                          className="flex-1 appearance-none rounded-md relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-gray-50 focus:outline-none focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
                          placeholder="주소 검색 버튼을 클릭하세요" 
                        />
                        <button 
                          type="button" 
                          onClick={() => openAddressSearch('memberActualAddress')}
                          className="ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600"
                        >
                          주소검색
                        </button>
                      </div>
                      <input 
                        type="text" 
                        name="memberActualAddressDetail"
                        value={formData.memberActualAddressDetail}
                        onChange={handleInputChange}
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
                        placeholder="상세 주소를 입력하세요 (동, 호수 등)"
                      />
                    </div>
                  </div>

                  {/* 대표 전화번호 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      대표 전화번호
                    </label>
                    <input 
                      type="text" 
                      name="mainPhoneNumber"
                      value={formData.mainPhoneNumber}
                      onChange={handleInputChange}
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
                      placeholder="대표 전화번호를 입력하세요" 
                    />
                  </div>

                  {/* 대표 휴대폰번호 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      대표 휴대폰번호
                    </label>
                    <input 
                      type="text" 
                      name="mainMobileNumber"
                      value={formData.mainMobileNumber}
                      onChange={handleInputChange}
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-200 focus:border-amber-200 sm:text-sm"
                      placeholder="대표 휴대폰번호를 입력하세요" 
                    />
                  </div>

                  {/* 취급 상품 및 서비스 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">취급 상품 및 서비스</label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          name="autoProductRegister"
                          checked={formData.autoProductRegister}
                          onChange={handleInputChange}
                          className="mr-2 h-4 w-4 text-amber-200 focus:ring-amber-200 border-gray-300 rounded"
                        />
                        상품 자동 등록
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          name="handleCondolenceBasket"
                          checked={formData.handleCondolenceBasket}
                          onChange={handleInputChange}
                          className="mr-2 h-4 w-4 text-amber-200 focus:ring-amber-200 border-gray-300 rounded"
                        />
                        근조바구니
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          name="handleRoundFlowerArrangement"
                          checked={formData.handleRoundFlowerArrangement}
                          onChange={handleInputChange}
                          className="mr-2 h-4 w-4 text-amber-200 focus:ring-amber-200 border-gray-300 rounded"
                        />
                        원형화환
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          name="handleLargeExtraLarge"
                          checked={formData.handleLargeExtraLarge}
                          onChange={handleInputChange}
                          className="mr-2 h-4 w-4 text-amber-200 focus:ring-amber-200 border-gray-300 rounded"
                        />
                        대/특대형
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          name="handle4_5Tier"
                          checked={formData.handle4_5Tier}
                          onChange={handleInputChange}
                          className="mr-2 h-4 w-4 text-amber-200 focus:ring-amber-200 border-gray-300 rounded"
                        />
                        4단/5단
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          name="handleBonsa"
                          checked={formData.handleBonsa}
                          onChange={handleInputChange}
                          className="mr-2 h-4 w-4 text-amber-200 focus:ring-amber-200 border-gray-300 rounded"
                        />
                        분재
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          name="handleFruitProducts"
                          checked={formData.handleFruitProducts}
                          onChange={handleInputChange}
                          className="mr-2 h-4 w-4 text-amber-200 focus:ring-amber-200 border-gray-300 rounded"
                        />
                        과일상품
                      </label>
                    </div>
                  </div>

                  {/* 배송 서비스 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">배송 서비스</label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          name="expressDeliveryAvailable"
                          checked={formData.expressDeliveryAvailable}
                          onChange={handleInputChange}
                          className="mr-2 h-4 w-4 text-amber-200 focus:ring-amber-200 border-gray-300 rounded"
                        />
                        퀵배송 가능
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          name="holidayDeliveryAvailable"
                          checked={formData.holidayDeliveryAvailable}
                          onChange={handleInputChange}
                          className="mr-2 h-4 w-4 text-amber-200 focus:ring-amber-200 border-gray-300 rounded"
                        />
                        공휴일 배송 가능
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          name="nightDeliveryAvailable"
                          checked={formData.nightDeliveryAvailable}
                          onChange={handleInputChange}
                          className="mr-2 h-4 w-4 text-amber-200 focus:ring-amber-200 border-gray-300 rounded"
                        />
                        야간 배송 가능
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          name="blackGoldRibbonAvailable"
                          checked={formData.blackGoldRibbonAvailable}
                          onChange={handleInputChange}
                          className="mr-2 h-4 w-4 text-amber-200 focus:ring-amber-200 border-gray-300 rounded"
                        />
                        검정/금색 리본 가능
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between pt-4">
                <button 
                  type="button" 
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  이전
                </button>
                <button 
                  type="button" 
                  onClick={submitRegistration}
                  className="px-6 py-2 rounded-md font-medium text-white"
                  style={{ backgroundColor: 'rgb(251,229,187)' }}
                >
                  가입하기
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Step 3: 가입완료 */}
        {currentStep === 3 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl font-bold mb-4">회원가입이 완료되었습니다!</h2>
              <p className="text-gray-600 mb-8">
                신사 플라워의 회원이 되신 것을 환영합니다.<br />
                관리자 승인 후 로그인이 가능합니다.
              </p>
              <div className="flex justify-center">
                <Link 
                  to="/login" 
                  className="px-6 py-2 rounded-md font-medium text-white"
                  style={{ backgroundColor: 'rgb(251,229,187)' }}
                >
                  로그인하기
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 p-4 border-t">
        &copy; 2025 신사 플라워. All rights reserved.
      </footer>
    </div>
  );
};

export default Register; 