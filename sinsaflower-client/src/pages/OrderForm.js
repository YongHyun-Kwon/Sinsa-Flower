import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import OrderFormPreviewModal from '../components/OrderFormPreviewModal';
import MemberSearchModal from '../components/MemberSearchModal';
import RegionSelectModal from '../components/RegionSelectModal';

const OrderForm = () => {
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState('direct');
  const [showOptions, setShowOptions] = useState(false);
  const [showImportantNotice, setShowImportantNotice] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState('default');
  const [imagePrivate, setImagePrivate] = useState(false);
  const [uploadedImageName, setUploadedImageName] = useState('선택된 파일 없음');
  const [uploadedImageFile, setUploadedImageFile] = useState(null);
  const [isAddressSearchOpen, setIsAddressSearchOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewOrderData, setPreviewOrderData] = useState(null);
  
  // 모달 상태 추가
  const [isMemberSearchOpen, setIsMemberSearchOpen] = useState(false);
  const [isRegionSelectOpen, setIsRegionSelectOpen] = useState(false);

  const [formData, setFormData] = useState({
    orderType: 'direct', // 'opencall' 또는 'direct'
    sellerId: null, // 수주처 PK ID
    corporationName: '', // shopName → corporationName으로 변경
    deliveryRegion: '',
    deliveryRegionPrice: 0,
    productName: '축하3단',
    productDetail: '축하3단화환',
    originalPrice: 80000,
    paymentPrice: 80000,
    totalPrice: 80000,
    
    // 옵션들
    optionCake: 0,
    optionChampagne: 0,
    optionCandy: 0,
    optionEtc: 0,
    optionStand: 0,
    optionRibbon: 0,
    optionWine: 0,
    optionChocolate: 0,
    optionPepero: 0,
    optionDonation: 0,
    optionDelivery: 0,
    
    // 체크박스들
    checkCake: false,
    checkChampagne: false,
    checkCandy: false,
    checkEtc: false,
    checkStand: false,
    checkRibbon: false,
    checkWine: false,
    checkChocolate: false,
    checkPepero: false,
    checkDonation: false,
    checkDelivery: false,    
    // 고객정보
    orderCustomerName: '',
    orderCustomerPhone: '',
    orderCustomerMobile: '',
    recipientName: '',
    recipientPhone: '',
    recipientMobile: '',
    
    // 배달 정보
    deliveryDate: '',
    deliveryDay: '',
    customTime: '',
    eventHour: '',
    eventMinute: '',
    eventType: 'ceremony',
    deliveryAddress: '',
    
    // 메시지들
    congratulatoryMessage: '',
    senderName: '',
    cardMessage: '',
    requestMessage: '배송 완료 시 사진 첨부해주세요.'
  });

  // 상품 선택
  const selectProduct = (productName) => {
    setFormData(prev => ({
      ...prev,
      productName,
      productDetail: `${productName}화환`
    }));
  };

  // 발주 유형 변경
  const handleOrderTypeChange = (type) => {
    setOrderType(type);
    setFormData(prev => ({
      ...prev,
      orderType: type,
      // 오픈콜일 때는 sellerId 관련 정보 초기화
      ...(type === 'opencall' && {
        sellerId: null,
        corporationName: '',
        deliveryRegion: '',
        deliveryRegionPrice: 0
      })
    }));
  };

  // 총 가격 업데이트
  const updateTotalPrice = () => {
    let optionTotal = 0;
    
    if (formData.checkCake) optionTotal += formData.optionCake;
    if (formData.checkChampagne) optionTotal += formData.optionChampagne;
    if (formData.checkCandy) optionTotal += formData.optionCandy;
    if (formData.checkEtc) optionTotal += formData.optionEtc;
    if (formData.checkStand) optionTotal += formData.optionStand;
    if (formData.checkRibbon) optionTotal += formData.optionRibbon;
    if (formData.checkWine) optionTotal += formData.optionWine;
    if (formData.checkChocolate) optionTotal += formData.optionChocolate;
    if (formData.checkPepero) optionTotal += formData.optionPepero;
    if (formData.checkDonation) optionTotal += formData.optionDonation;
    if (formData.checkDelivery) optionTotal += formData.optionDelivery;
    
    const totalPrice = formData.paymentPrice + optionTotal + formData.deliveryRegionPrice;
    
    setFormData(prev => ({
      ...prev,
      totalPrice
    }));
  };

  // 가격 설정
  const setPrice = (field, price) => {
    setFormData(prev => ({
      ...prev,
      [field]: price
    }));
  };

  // 가격 초기화
  const resetPrice = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: 0
    }));
  };

  // 전화번호 포맷팅
  const formatPhoneNumber = (value) => {
    const phoneNumber = value.replace(/[^0-9]/g, '');
    if (phoneNumber.length < 4) return phoneNumber;
    if (phoneNumber.length < 7) return phoneNumber.replace(/(\d{3})(\d+)/, '$1-$2');
    if (phoneNumber.length < 11) return phoneNumber.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
    return phoneNumber.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3');
  };

  // 입력 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name.includes('Phone') || name.includes('Mobile')) {
      setFormData(prev => ({
        ...prev,
        [name]: formatPhoneNumber(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value) || 0 : value
      }));
    }
  };

  // 경조사어 빠른 선택
  const selectMessage = (message) => {
    setFormData(prev => ({
      ...prev,
      congratulatoryMessage: message
    }));
  };

  // 이미지 파일 핸들링
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImageFile(file);
      setUploadedImageName(file.name);
    }
  };

  // 카카오 주소 검색 API 로드 및 총 가격 업데이트
  useEffect(() => {
    // 카카오 주소 검색 API 스크립트 로드
    const script = document.createElement('script');
    script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트시 스크립트 제거
      const existingScript = document.querySelector('script[src*="postcode"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  // 배달 날짜 변경시 요일 자동 계산
  useEffect(() => {
    if (formData.deliveryDate) {
      const date = new Date(formData.deliveryDate);
      const days = ['일', '월', '화', '수', '목', '금', '토'];
      const dayOfWeek = days[date.getDay()];
      setFormData(prev => ({
        ...prev,
        deliveryDay: dayOfWeek + '요일'
      }));
    }
  }, [formData.deliveryDate]);

  // 총 가격 자동 업데이트
  useEffect(() => {
    updateTotalPrice();
  }, [
    formData.paymentPrice,
    formData.deliveryRegionPrice,
    formData.checkCake, formData.optionCake,
    formData.checkChampagne, formData.optionChampagne,
    formData.checkCandy, formData.optionCandy,
    formData.checkEtc, formData.optionEtc,
    formData.checkStand, formData.optionStand,
    formData.checkRibbon, formData.optionRibbon,
    formData.checkWine, formData.optionWine,
    formData.checkChocolate, formData.optionChocolate,
    formData.checkPepero, formData.optionPepero,
    formData.checkDonation, formData.optionDonation,
    formData.checkDelivery, formData.optionDelivery
  ]);

  // 주소 검색
  const handleAddressSearch = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function(data) {
          // 검색 결과를 formData에 반영
          let address = data.address; // 기본 주소
          let extraAddress = ''; // 참고 항목

          // 참고항목이 있을 경우 추가
          if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
            extraAddress += data.bname;
          }
          if (data.buildingName !== '' && data.apartment === 'Y') {
            extraAddress += (extraAddress !== '' ? ', ' + data.buildingName : data.buildingName);
          }
          if (extraAddress !== '') {
            address += ' (' + extraAddress + ')';
          }

          setFormData(prev => ({
            ...prev,
            deliveryAddress: address
          }));
        },
        theme: {
          bgColor: "#FFFFFF",
          searchBgColor: "#0B65C8",
          contentBgColor: "#FFFFFF",
          pageBgColor: "#FAFAFA",
          textColor: "#333333",
          queryTextColor: "#FFFFFF"
        }
      }).open();
    } else {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
    }
  };

  // 회원 검색 기능
  const handleMemberSearch = () => {
    setIsMemberSearchOpen(true);
  };

  // 회원 선택 완료
  const handleMemberSelect = (member) => {
    setFormData(prev => ({
      ...prev,
      sellerId: member.id, // 내부적으로는 ID 저장
      corporationName: member.corporationName,
      deliveryRegion: member.deliveryRegion,
      deliveryRegionPrice: member.deliveryPrice
    }));
    setIsMemberSearchOpen(false);
  };

  // 지역 선택 기능
  const handleRegionSelect = () => {
    setIsRegionSelectOpen(true);
  };

  // 지역 선택 완료
  const handleRegionSelectComplete = (region) => {
    setFormData(prev => ({
      ...prev,
      deliveryRegion: region.fullName,
      deliveryRegionPrice: region.price
    }));
    setIsRegionSelectOpen(false);
  };

  // 미리보기 기능
  const handlePreview = () => {
    // 필수 정보 검증
    if (!formData.productName || !formData.paymentPrice) {
      alert('상품명과 결제금액은 필수 입력항목입니다.');
      return;
    }

    if (orderType === 'direct' && !formData.corporationName) {
      alert('직발주의 경우 수주회원 선택이 필수입니다.');
      return;
    }

    // 주문 데이터 생성
    const orderData = {
      ...formData,
      orderType,
      imagePrivate,
      uploadedImageName: uploadedImageFile ? uploadedImageFile.name : null,
      deliveryTime: deliveryTime === 'custom' ? formData.customTime : deliveryTime,
      totalPrice: formData.totalPrice,
      orderNo: 'OR-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + Math.floor(Math.random() * 100),
      orderDate: new Date().toLocaleString('ko-KR')
    };

    // 미리보기 모달 열기
    setPreviewOrderData(orderData);
    setIsPreviewModalOpen(true);
  };

  // 발주하기 기능 (수정됨)
  const handleSubmitOrder = async () => {
    // 필수 정보 검증
    if (!formData.productName || !formData.paymentPrice) {
      alert('상품명과 결제금액은 필수 입력항목입니다.');
      return;
    }

    if (orderType === 'direct' && !formData.corporationName) {
      alert('직발주의 경우 수주회원 선택이 필수입니다.');
      return;
    }

    if (!formData.deliveryAddress || !formData.deliveryDate) {
      alert('배달장소와 배달일시는 필수 입력항목입니다.');
      return;
    }

    try {
      // FormData 객체 생성 (이미지 파일 포함)
      const orderFormData = new FormData();
      
      // 주문 정보를 JSON으로 변환하여 추가
      const orderInfo = {
        orderType,
        ...formData,
        deliveryTime: deliveryTime === 'custom' ? 
          formData.customTime : 
          (deliveryTime === 'default' ? null : deliveryTime),
        imagePrivate
      };
      
      orderFormData.append('orderInfo', JSON.stringify(orderInfo));
      
      // 이미지 파일이 있으면 추가
      if (uploadedImageFile) {
        orderFormData.append('image', uploadedImageFile);
      }

      console.log(orderFormData.get('orderType'));

      // API 호출 (수정된 엔드포인트)
      const response = await fetch('/api/orders', {
        method: 'POST',
        body: orderFormData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
          // Content-Type은 multipart/form-data일 때 자동으로 설정됨
        }
      });

      if (response.ok) {
        alert('발주가 성공적으로 완료되었습니다.');
        navigate('/all-orders'); // 주문 목록 페이지로 이동
      } else {
        const errorData = await response.json();
        alert(`발주 실패: ${errorData.message || '알 수 없는 오류가 발생했습니다.'}`);
      }
    } catch (error) {
      console.error('발주 오류:', error);
      alert('발주 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Layout>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="text-base font-bold">주문 입력</h1>
        </div>
        
        <div className="bg-white p-2 rounded shadow-sm">
          {/* 특이사항 알림 */}
          <div className="bg-green-50 border border-green-200 text-xs p-1 rounded mb-1 text-center text-red-600 font-medium">
            발주 후 수주처와 협의된 주문서는 <span className="text-red-700">금액, 날짜, 리본 등 수정 가능</span> (협의된 주문건은 본사로 연락 안 하셔도 됩니다)
          </div>
          
          {/* 발주 유형 선택 */}
          <div className="flex justify-center mb-2 gap-1">
            <button 
              type="button" 
              onClick={() => handleOrderTypeChange('direct')}
              className={`px-3 py-1 rounded text-xs font-medium ${
                orderType === 'direct' ? 'bg-amber-200 text-white' : 'bg-gray-200'
              }`}
            >
              직발주
            </button>
            <button 
              type="button" 
              onClick={() => handleOrderTypeChange('opencall')}
              className={`px-3 py-1 rounded text-xs font-medium ${
                orderType === 'opencall' ? 'bg-amber-200 text-white' : 'bg-gray-200'
              }`}
            >
              오픈콜 발주
            </button>
          </div>

          {/* 수주회원 - 직발주일 때만 표시 */}
          {orderType === 'direct' && (
            <div className="mb-2">
              <label className="label text-xs font-medium">수주회원</label>
              <div className="flex items-center gap-1 flex-wrap">
                <input
                  type="text"
                  name="corporationName"
                  value={formData.corporationName}
                  className="border p-0.5 w-1/5 rounded text-xs"
                  readOnly
                  placeholder="상호명"
                />
                <input
                  type="text"
                  name="deliveryRegion"
                  value={formData.deliveryRegion}
                  className="border p-0.5 w-1/5 rounded text-xs"
                  readOnly
                  placeholder="배송지역"
                />
                <button 
                  type="button" 
                  onClick={handleMemberSearch}
                  className="bg-amber-200 text-white px-2 py-0.5 rounded text-xs"
                >
                  회원검색
                </button>
                <button 
                  type="button" 
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    sellerId: null,
                    corporationName: '',
                    deliveryRegion: '',
                    deliveryRegionPrice: 0
                  }))}
                  className="bg-gray-200 px-2 py-0.5 rounded text-xs"
                >
                  선택취소
                </button>
              </div>
            </div>
          )}

          {/* 오픈콜 발주 안내 */}
          {orderType === 'opencall' && (
            <div className="mb-2 bg-blue-50 border border-blue-200 text-xs p-2 rounded">
              <div className="font-medium text-blue-800 mb-1">오픈콜 발주</div>
              <div className="text-blue-600">
                해당 지역의 모든 수주회원에게 주문이 공개되며, 수주 신청을 받은 후 수주회원을 선택할 수 있습니다.
              </div>
            </div>
          )}

          {/* 배달지역 */}
          <div className="mb-2">
            <label className="label text-xs font-medium">배달지역</label>
            <div className="flex items-center gap-1">
              <input
                type="text"
                name="deliveryRegion"
                value={formData.deliveryRegion}
                onChange={handleInputChange}
                className="border p-0.5 flex-grow rounded text-xs"
                placeholder="배송할 지역을 입력하세요"
                readOnly
              />
              <button 
                type="button" 
                onClick={handleRegionSelect}
                className="bg-amber-200 text-white px-2 py-0.5 rounded text-xs"
              >
                지역선택
              </button>
            </div>
          </div>

          {/* 상품명 */}
          <div className="mb-2">
            <label className="label block text-xs font-medium">상품명</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <div className="flex flex-wrap gap-0.5">
                <button type="button" onClick={() => selectProduct('축하3단')} className="bg-red-500 text-white px-1.5 py-0.5 rounded text-xs">축하3단</button>
                <button type="button" onClick={() => selectProduct('근조3단')} className="bg-gray-500 text-white px-1.5 py-0.5 rounded text-xs">근조3단</button>
                <button type="button" onClick={() => selectProduct('근조바구니')} className="bg-gray-300 px-1.5 py-0.5 rounded text-xs">근조바구니</button>
                <button type="button" onClick={() => selectProduct('동양란')} className="bg-gray-300 px-1.5 py-0.5 rounded text-xs">동양란</button>
                <button type="button" onClick={() => selectProduct('서양란')} className="bg-gray-300 px-1.5 py-0.5 rounded text-xs">서양란</button>
                <button type="button" onClick={() => selectProduct('꽃바구니')} className="bg-gray-300 px-1.5 py-0.5 rounded text-xs">꽃바구니</button>
                <button type="button" onClick={() => selectProduct('관엽식물')} className="bg-gray-300 px-1.5 py-0.5 rounded text-xs">관엽식물</button>
              </div>
              
              <div className="flex flex-wrap items-center gap-1">
                <button type="button" className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">상품선택</button>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  className="border p-0.5 rounded w-24 text-xs"
                  readOnly
                  placeholder="상품명"
                />
                <span className="text-xs font-medium">상세상품명:</span>
                <input
                  type="text"
                  name="productDetail"
                  value={formData.productDetail}
                  onChange={handleInputChange}
                  className="border p-0.5 rounded w-24 text-xs"
                  placeholder="상세상품명"
                />
              </div>
            </div>
          </div>

          {/* 원청금액 */}
          <div className="mb-2">
            <label className="label text-xs font-medium">원청금액</label>
            <div className="flex items-center gap-1 flex-wrap">
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                className="border p-0.5 rounded w-32 text-xs"
                placeholder="₩"
              />
              <span className="text-xs">원</span>
              <button type="button" onClick={() => setPrice('originalPrice', 10000)} className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">1만</button>
              <button type="button" onClick={() => setPrice('originalPrice', 60000)} className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">6만</button>
              <button type="button" onClick={() => setPrice('originalPrice', 70000)} className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">7만</button>
              <button type="button" onClick={() => setPrice('originalPrice', 80000)} className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">8만</button>
              <button type="button" onClick={() => resetPrice('originalPrice')} className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">초기화</button>
            </div>
          </div>

          {/* 결제금액 */}
          <div className="mb-2">
            <label className="label text-xs font-medium">결제금액(옵션제외)</label>
            <div className="flex items-center gap-1 flex-wrap">
              <input
                type="number"
                name="paymentPrice"
                value={formData.paymentPrice}
                onChange={handleInputChange}
                className="border p-0.5 rounded w-32 text-xs"
                placeholder="₩"
              />
              <span className="text-xs">원</span>
              <button type="button" onClick={() => setPrice('paymentPrice', 10000)} className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">1만</button>
              <button type="button" onClick={() => setPrice('paymentPrice', 60000)} className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">6만</button>
              <button type="button" onClick={() => setPrice('paymentPrice', 70000)} className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">7만</button>
              <button type="button" onClick={() => setPrice('paymentPrice', 80000)} className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">8만</button>
              <button type="button" onClick={() => resetPrice('paymentPrice')} className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">초기화</button>
              <div className="flex items-center ml-1">
                <input
                  type="checkbox"
                  id="showOptions"
                  checked={showOptions}
                  onChange={(e) => setShowOptions(e.target.checked)}
                  className="mr-0.5 h-3 w-3"
                />
                <label htmlFor="showOptions" className="text-xs">옵션상품보기</label>
              </div>
            </div>
          </div>
          
          {/* 옵션상품 */}
          {showOptions && (
            <div className="mb-4 p-4 border rounded bg-gray-50">
              <h3 className="font-semibold mb-3">옵션상품</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 좌측 옵션들 */}
                <div className="space-y-2">
                  {[
                    {key: 'Cake', label: '케익'},
                    {key: 'Champagne', label: '샴페인'},
                    {key: 'Candy', label: '사탕'},
                    {key: 'Etc', label: '기타'},
                    {key: 'Stand', label: '화분받침대'},
                    {key: 'Ribbon', label: '리본교체비'}
                  ].map(option => (
                    <div key={option.key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name={`check${option.key}`}
                        checked={formData[`check${option.key}`]}
                        onChange={handleInputChange}
                        className="option-checkbox"
                      />
                      <label className="w-28">{option.label}</label>
                      <input
                        type="number"
                        name={`option${option.key}`}
                        value={formData[`option${option.key}`]}
                        onChange={handleInputChange}
                        className="border p-1 rounded w-20"
                        min="0"
                      />
                      <span className="text-sm">원</span>
                    </div>
                  ))}
                </div>
                
                {/* 우측 옵션들 */}
                <div className="space-y-2">
                  {[
                    {key: 'Wine', label: '와인'},
                    {key: 'Chocolate', label: '초코렛'},
                    {key: 'Pepero', label: '빼빼로'},
                    {key: 'Donation', label: '경조사비'},
                    {key: 'Delivery', label: '배송비'}
                  ].map(option => (
                    <div key={option.key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name={`check${option.key}`}
                        checked={formData[`check${option.key}`]}
                        onChange={handleInputChange}
                        className="option-checkbox"
                      />
                      <label className="w-28">{option.label}</label>
                      <input
                        type="number"
                        name={`option${option.key}`}
                        value={formData[`option${option.key}`]}
                        onChange={handleInputChange}
                        className="border p-1 rounded w-20"
                        min="0"
                      />
                      <span className="text-sm">원</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 상품이미지 - 개선된 버전 */}
          <div className="mb-2">
            <label className="label text-xs font-medium">상품이미지</label>
            <div className="flex items-center gap-1">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label 
                htmlFor="image-upload"
                className="bg-amber-200 text-white px-2 py-0.5 rounded text-xs cursor-pointer hover:bg-amber-300"
              >
                이미지 등록
              </label>
              <span className="text-xs text-gray-600">{uploadedImageName}</span>
              <div className="ml-auto flex items-center">
                <input
                  type="checkbox"
                  id="image-private"
                  checked={imagePrivate}
                  onChange={(e) => setImagePrivate(e.target.checked)}
                  className="mr-0.5 h-3 w-3"
                />
                <label htmlFor="image-private" className="text-xs">비공개</label>
              </div>
            </div>
            {uploadedImageFile && (
              <div className="mt-1">
                <img 
                  src={URL.createObjectURL(uploadedImageFile)} 
                  alt="업로드된 이미지" 
                  className="w-20 h-20 object-cover rounded border"
                />
              </div>
            )}
            <div className="mt-1 bg-orange-50 border border-orange-200 p-1 rounded text-orange-700 text-xs">
              비공개일 때 수주화원 배송사진 목록에 등록되지 않습니다.
            </div>
          </div>

          {/* 총 결제액 */}
          <div className="mb-4 bg-gray-100 p-3 rounded">
            <div className="flex justify-between items-center">
              <label className="font-bold text-lg">총 결제액:</label>
              <div className="text-xl font-bold text-gray-800">
                <span>{formData.totalPrice.toLocaleString()}</span>원 (옵션포함)
              </div>
            </div>
          </div>

          {/* 고객 정보 */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="label text-xs font-medium">주문고객정보</label>
              <div className="grid grid-cols-3 gap-1">
                <input
                  type="text"
                  name="orderCustomerName"
                  value={formData.orderCustomerName}
                  onChange={handleInputChange}
                  className="border p-0.5 w-full rounded text-xs"
                  placeholder="주문고객명"
                />
                <input
                  type="text"
                  name="orderCustomerPhone"
                  value={formData.orderCustomerPhone}
                  onChange={handleInputChange}
                  className="border p-0.5 w-full rounded text-xs"
                  placeholder="전화번호"
                />
                <input
                  type="text"
                  name="orderCustomerMobile"
                  value={formData.orderCustomerMobile}
                  onChange={handleInputChange}
                  className="border p-0.5 w-full rounded text-xs"
                  placeholder="핸드폰"
                />
              </div>
            </div>
            <div>
              <label className="label text-xs font-medium">받는고객정보</label>
              <div className="grid grid-cols-3 gap-1">
                <input
                  type="text"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleInputChange}
                  className="border p-0.5 w-full rounded text-xs"
                  placeholder="받는고객명"
                />
                <input
                  type="text"
                  name="recipientPhone"
                  value={formData.recipientPhone}
                  onChange={handleInputChange}
                  className="border p-0.5 w-full rounded text-xs"
                  placeholder="전화번호"
                />
                <input
                  type="text"
                  name="recipientMobile"
                  value={formData.recipientMobile}
                  onChange={handleInputChange}
                  className="border p-0.5 w-full rounded text-xs"
                  placeholder="핸드폰"
                />
              </div>
            </div>
          </div>

          {/* 배달일시 */}
          <div className="mb-2">
            <label className="label text-xs font-medium">배달일시</label>
            <div className="flex flex-wrap items-center gap-1 mb-0.5">
              <input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleInputChange}
                className="border p-0.5 rounded w-24 text-xs"
              />
              <input
                type="text"
                name="deliveryDay"
                value={formData.deliveryDay}
                className="border p-0.5 rounded w-12 text-xs"
                readOnly
                placeholder="요일"
              />
              <select
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                className="border p-0.5 rounded w-16 text-xs"
              >
                <option value="default">기본시간</option>
                {Array.from({length: 16}, (_, i) => i + 8).map(hour => (
                  <option key={hour} value={`${hour}:00`}>{hour}:00</option>
                ))}
                <option value="custom">직접입력</option>
              </select>
            </div>
            
            {deliveryTime === 'custom' && (
              <div className="flex flex-wrap items-center gap-1 mb-0.5">
                <span className="text-xs">직접입력:</span>
                <input
                  type="text"
                  name="customTime"
                  value={formData.customTime}
                  onChange={handleInputChange}
                  className="border p-0.5 rounded w-40 text-xs"
                  placeholder="예: 14:30 또는 오후 2시반"
                />
              </div>
            )}
            
            {deliveryTime !== 'custom' && (
              <div className="flex flex-wrap items-center gap-1 mb-0.5">
                <span className="text-xs">행사시간:</span>
                <select
                  name="eventHour"
                  value={formData.eventHour}
                  onChange={handleInputChange}
                  className="border p-0.5 rounded w-12 text-xs"
                >
                  <option value="">시</option>
                  {Array.from({length: 16}, (_, i) => i + 8).map(hour => (
                    <option key={hour} value={hour}>{hour}시</option>
                  ))}
                </select>
                <select
                  name="eventMinute"
                  value={formData.eventMinute}
                  onChange={handleInputChange}
                  className="border p-0.5 rounded w-12 text-xs"
                >
                  <option value="">분</option>
                  {['00', '10', '20', '30', '40', '50'].map(minute => (
                    <option key={minute} value={minute}>{minute}분</option>
                  ))}
                </select>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  className="border p-0.5 rounded w-12 text-xs"
                >
                  <option value="ceremony">예식</option>
                  <option value="event">행사</option>
                </select>
              </div>
            )}
            
            <div className="bg-orange-50 border border-orange-200 p-1 rounded text-orange-700 text-xs">
              근조화환 배송시간 가급적 여유있게 설정해주시기 바랍니다.(권장 5시간 이상)
            </div>
          </div>

          {/* 배달장소 - 개선된 주소 검색 */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <label className="label font-bold">배달장소</label>
              <button
                onClick={() => setShowImportantNotice(!showImportantNotice)}
                className="bg-gray-200 px-2 py-0.5 rounded text-xs"
              >
                필독사항
              </button>
            </div>
            
            {showImportantNotice && (
              <div className="bg-gray-50 p-1.5 rounded border mb-1 text-xs">
                <h4 className="font-bold mb-0.5">배달장소 필독사항</h4>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>정확한 주소지를 기재해 주세요.</li>
                  <li>상세 주소 없이 발생하는 배송 문제는 책임지지 않습니다.</li>
                  <li>특별한 요청사항이 있는 경우 반드시 기재해 주세요.</li>
                </ul>
              </div>
            )}
            
            <div className="flex gap-1">
              <input
                type="text"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleInputChange}
                className="border p-1 flex-grow rounded text-sm"
                placeholder="주소 검색 버튼을 클릭하여 정확한 주소를 입력하세요"
              />
              <button 
                type="button"
                onClick={handleAddressSearch}
                className="whitespace-nowrap bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
              >
                주소검색
              </button>
            </div>
          </div>

          {/* 경조사어 & 보내는 분 */}
          <div className="mb-1">
            <div className="mb-1">
              <label className="label block">경조사어(오른쪽)</label>
              <div className="border rounded p-1 bg-gray-50">
                <div>
                  <p className="flex flex-wrap gap-0.5">
                    {['祝結婚', '祝華婚', '祝發展', '祝開業', '祝榮轉', '祝昇進', '謹弔', '삼가 故人의 冥福을 빕니다'].map(msg => (
                      <button
                        key={msg}
                        type="button"
                        onClick={() => selectMessage(msg)}
                        className={`border px-1 py-0.5 rounded text-xs ${
                          msg.includes('弔') || msg.includes('冥福') ? 'bg-red-100' : 'bg-pink-100'
                        }`}
                      >
                        {msg}
                      </button>
                    ))}
                  </p>
                  <p className="mt-0.5 flex flex-wrap gap-0.5">
                    {['축결혼', '축화혼', '축발전', '축개업', '축영전', '축승진', '근조', '삼가 고인의 명복을 빕니다'].map(msg => (
                      <button
                        key={msg}
                        type="button"
                        onClick={() => selectMessage(msg)}
                        className={`border px-1 py-0.5 rounded text-xs ${
                          msg.includes('근조') || msg.includes('명복') ? 'bg-red-100' : 'bg-pink-100'
                        }`}
                      >
                        {msg}
                      </button>
                    ))}
                  </p>
                </div>
              </div>
              <input
                type="text"
                name="congratulatoryMessage"
                value={formData.congratulatoryMessage}
                onChange={handleInputChange}
                className="mt-0.5 border p-1 w-full rounded"
                placeholder="경조사어를 입력하세요"
              />
            </div>
            
            <div className="mb-1">
              <label className="label block">보내는 분(왼쪽)</label>
              <input
                type="text"
                name="senderName"
                value={formData.senderName}
                onChange={handleInputChange}
                className="border p-1 w-full rounded"
                placeholder="보내는 분을 입력하세요"
              />
            </div>
          </div>

          {/* 카드 문구 */}
          <div className="mb-1">
            <label className="label block">카드 문구</label>
            <textarea
              name="cardMessage"
              value={formData.cardMessage}
              onChange={handleInputChange}
              className="border p-1 w-full rounded text-sm"
              rows="1"
              placeholder="예: 사랑하는 마음을 담아..."
            />
          </div>

          {/* 요구사항 */}
          <div className="mb-1">
            <label className="label block">요구사항</label>
            <textarea
              name="requestMessage"
              value={formData.requestMessage}
              onChange={handleInputChange}
              className="border p-1 w-full rounded text-sm"
              rows="1"
              placeholder="배송 완료 시 사진 첨부해주세요."
            />
          </div>

          {/* 버튼 - 개선된 버전 */}
          <div className="flex justify-end gap-4">
            <button 
              type="button" 
              onClick={handlePreview}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              미리 보기
            </button>
            <button 
              type="button" 
              onClick={handleSubmitOrder}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              발주하기
            </button>
          </div>

          <p className="text-center text-xs text-red-600 mt-4">
            발주 후 수주처와 협의된 주문서는 <span className="font-bold">금액, 날짜, 리본 등 수정 가능</span>
          </p>
        </div>
      </div>

      {/* 미리보기 모달 */}
      <OrderFormPreviewModal 
        isOpen={isPreviewModalOpen} 
        onClose={() => setIsPreviewModalOpen(false)} 
        orderData={previewOrderData}
      />

      {/* 회원 검색 모달 */}
      <MemberSearchModal 
        isOpen={isMemberSearchOpen}
        onClose={() => setIsMemberSearchOpen(false)}
        onSelect={handleMemberSelect}
      />

      {/* 지역 선택 모달 */}
      <RegionSelectModal 
        isOpen={isRegionSelectOpen}
        onClose={() => setIsRegionSelectOpen(false)}
        onSelect={handleRegionSelectComplete}
      />
    </Layout>
  );
};

export default OrderForm; 