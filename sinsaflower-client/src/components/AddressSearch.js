import React, { useEffect, useCallback } from 'react';

/**
 * 다음 우편번호 API를 사용한 주소 검색 컴포넌트
 * @param {Function} onAddressSelected - 주소 선택 시 콜백 함수
 * @param {string} buttonText - 버튼 텍스트 (기본값: '주소 검색')
 * @param {string} className - 추가 CSS 클래스
 */
const AddressSearch = ({ 
  onAddressSelected, 
  buttonText = '주소 검색',
  className = '',
  disabled = false
}) => {
  // Daum Postcode 스크립트 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // 주소 검색 실행
  const handleAddressSearch = useCallback(() => {
    if (!window.daum || !window.daum.Postcode) {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: function(data) {
        // 선택된 주소 정보 처리
        let addr = '';
        let extraAddr = '';

        // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
        if (data.userSelectedType === 'R') {
          // 도로명 주소를 선택했을 경우
          addr = data.roadAddress;
        } else {
          // 지번 주소를 선택했을 경우(J)
          addr = data.jibunAddress;
        }

        // 도로명 주소인 경우 참고항목을 조합한다.
        if (data.userSelectedType === 'R') {
          // 법정동명이 있을 경우 추가한다. (법정리는 제외)
          if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname;
          }
          // 건물명이 있고, 공동주택일 경우 추가한다.
          if (data.buildingName !== '' && data.apartment === 'Y') {
            extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
          }
          // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
          if (extraAddr !== '') {
            extraAddr = ' (' + extraAddr + ')';
          }
        }

        // 콜백 함수 호출
        if (onAddressSelected) {
          onAddressSelected({
            zonecode: data.zonecode,
            address: addr,
            extraAddress: extraAddr,
            fullAddress: addr + extraAddr,
            sido: data.sido,
            sigungu: data.sigungu,
            bname: data.bname,
            buildingName: data.buildingName
          });
        }
      },
      onresize: function(size) {
        // 검색창 크기 조정
      },
      width: '100%',
      height: '100%'
    }).open();
  }, [onAddressSelected]);

  return (
    <button
      type="button"
      onClick={handleAddressSearch}
      disabled={disabled}
      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed ${className}`}
    >
      {buttonText}
    </button>
  );
};

export default AddressSearch; 