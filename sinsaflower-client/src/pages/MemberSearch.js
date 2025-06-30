import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const MemberSearch = () => {
  const { user } = useAuth();
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [members, setMembers] = useState([]);
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: 전국지도, 2: 지역상세, 3: 회원목록
  const svgRef = useRef(null);

  // 대한민국 지역 데이터 (더 정확한 매핑)
  const regions = {
    'seoul': { 
      name: '서울특별시',
      code: 'seoul',
      svgId: 'KR-11', // SVG에서 서울의 ID
      cities: ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구']
    },
    'busan': { 
      name: '부산광역시',
      code: 'busan',
      svgId: 'KR-26',
      cities: ['중구', '서구', '동구', '영도구', '부산진구', '동래구', '남구', '북구', '해운대구', '사하구', '금정구', '강서구', '연제구', '수영구', '사상구', '기장군']
    },
    'daegu': { 
      name: '대구광역시',
      code: 'daegu',
      svgId: 'KR-27',
      cities: ['중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군']
    },
    'incheon': { 
      name: '인천광역시',
      code: 'incheon',
      svgId: 'KR-28',
      cities: ['중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구', '강화군', '옹진군']
    },
    'gwangju': { 
      name: '광주광역시',
      code: 'gwangju',
      svgId: 'KR-29',
      cities: ['동구', '서구', '남구', '북구', '광산구']
    },
    'daejeon': { 
      name: '대전광역시',
      code: 'daejeon',
      svgId: 'KR-30',
      cities: ['동구', '중구', '서구', '유성구', '대덕구']
    },
    'ulsan': { 
      name: '울산광역시',
      code: 'ulsan',
      svgId: 'KR-31',
      cities: ['중구', '남구', '동구', '북구', '울주군']
    },
    'sejong': { 
      name: '세종특별자치시',
      code: 'sejong',
      svgId: 'KR-50',
      cities: ['세종시']
    },
    'gyeonggi': { 
      name: '경기도',
      code: 'gyeonggi',
      svgId: 'KR-41',
      cities: ['수원시', '성남시', '용인시', '안양시', '안산시', '과천시', '광명시', '광주시', '군포시', '부천시', '시흥시', '김포시', '안성시', '오산시', '의왕시', '이천시', '평택시', '하남시', '화성시', '여주시', '양평군', '고양시', '구리시', '남양주시', '동두천시', '양주시', '의정부시', '파주시', '포천시', '가평군', '연천군']
    },
    'gangwon': { 
      name: '강원특별자치도',
      code: 'gangwon',
      svgId: 'KR-42',
      cities: ['춘천시', '원주시', '강릉시', '동해시', '태백시', '속초시', '삼척시', '홍천군', '횡성군', '영월군', '평창군', '정선군', '철원군', '화천군', '양구군', '인제군', '고성군', '양양군']
    },
    'chungbuk': { 
      name: '충청북도',
      code: 'chungbuk',
      svgId: 'KR-43',
      cities: ['청주시', '충주시', '제천시', '보은군', '옥천군', '영동군', '증평군', '진천군', '괴산군', '음성군', '단양군']
    },
    'chungnam': { 
      name: '충청남도',
      code: 'chungnam',
      svgId: 'KR-44',
      cities: ['천안시', '공주시', '보령시', '아산시', '서산시', '논산시', '계룡시', '당진시', '금산군', '부여군', '서천군', '청양군', '홍성군', '예산군', '태안군']
    },
    'jeonbuk': { 
      name: '전북특별자치도',
      code: 'jeonbuk',
      svgId: 'KR-45',
      cities: ['전주시', '군산시', '익산시', '정읍시', '남원시', '김제시', '완주군', '진안군', '무주군', '장수군', '임실군', '순창군', '고창군', '부안군']
    },
    'jeonnam': { 
      name: '전라남도',
      code: 'jeonnam',
      svgId: 'KR-46',
      cities: ['목포시', '여수시', '순천시', '나주시', '광양시', '담양군', '곡성군', '구례군', '고흥군', '보성군', '화순군', '장흥군', '강진군', '해남군', '영암군', '무안군', '함평군', '영광군', '장성군', '완도군', '진도군', '신안군']
    },
    'gyeongbuk': { 
      name: '경상북도',
      code: 'gyeongbuk',
      svgId: 'KR-47',
      cities: ['포항시', '경주시', '김천시', '안동시', '구미시', '영주시', '영천시', '상주시', '문경시', '경산시', '의성군', '청송군', '영양군', '영덕군', '청도군', '고령군', '성주군', '칠곡군', '예천군', '봉화군', '울진군', '울릉군']
    },
    'gyeongnam': { 
      name: '경상남도',
      code: 'gyeongnam',
      svgId: 'KR-48',
      cities: ['창원시', '진주시', '통영시', '사천시', '김해시', '밀양시', '거제시', '양산시', '의령군', '함안군', '창녕군', '고성군', '남해군', '하동군', '산청군', '함양군', '거창군', '합천군']
    },
    'jeju': { 
      name: '제주특별자치도',
      code: 'jeju',
      svgId: 'KR-49',
      cities: ['제주시', '서귀포시']
    }
  };

  // SVG 지도 초기화 (컴포넌트 마운트 후)
  useEffect(() => {
    const initializeMap = () => {
      const svgObject = svgRef.current;
      if (!svgObject) return;

      const handleLoad = () => {
        const svgDoc = svgObject.contentDocument;
        if (!svgDoc) {
          console.log('SVG 문서를 로드할 수 없습니다.');
          return;
        }

        // 모든 path 요소를 가져와서 클릭 가능하게 만들기
        const paths = svgDoc.querySelectorAll('path');
        console.log(`총 ${paths.length}개의 path 요소를 발견했습니다.`);

        paths.forEach((path, index) => {
          if (path.getAttribute('fill') !== '#FFFFFF' && path.getAttribute('fill') !== 'none') {
            // 기본 스타일 설정
            path.style.fill = '#f5f5f5';
            path.style.stroke = '#cccccc';
            path.style.strokeWidth = '1';
            path.style.cursor = 'pointer';
            path.style.transition = 'fill 0.3s';

            // 마우스 이벤트
            path.addEventListener('mouseenter', () => {
              path.style.fill = 'rgb(251,229,187)';
              console.log(`Path ${index} 클릭됨 - ID: ${path.id}`);
            });

            path.addEventListener('mouseleave', () => {
              path.style.fill = '#f5f5f5';
            });

            // 클릭 이벤트 - 임시로 경기도로 설정
            path.addEventListener('click', () => {
              console.log(`Path ${index} 클릭됨 - ID: ${path.id}`);
              
              // path의 bounding box를 이용해 대략적인 지역 판단
              const bbox = path.getBBox();
              const centerX = bbox.x + bbox.width / 2;
              const centerY = bbox.y + bbox.height / 2;
              
              console.log(`중심 좌표: (${centerX}, ${centerY})`);
              
              // 좌표 기반 지역 판단 (대략적)
              let regionCode = 'gyeonggi'; // 기본값
              
              // 더 정확한 좌표 기반 지역 판단
              if (centerX > 700 && centerX < 850 && centerY > 850 && centerY < 950) {
                regionCode = 'seoul';
              } else if (centerX > 950 && centerY < 850) {
                regionCode = 'gangwon';
              } else if (centerX < 500 && centerY > 900 && centerY < 1000) {
                regionCode = 'incheon';
              } else if (centerX > 800 && centerX < 950 && centerY > 1150 && centerY < 1250) {
                regionCode = 'chungbuk';
              } else if (centerX > 600 && centerX < 750 && centerY > 1200 && centerY < 1300) {
                regionCode = 'chungnam';
              } else if (centerX > 700 && centerX < 800 && centerY > 1300 && centerY < 1400) {
                regionCode = 'daejeon';
              } else if (centerX > 650 && centerX < 750 && centerY > 1250 && centerY < 1350) {
                regionCode = 'sejong';
              } else if (centerX < 600 && centerY > 1500 && centerY < 1600) {
                regionCode = 'jeonbuk';
              } else if (centerX < 650 && centerY > 1750 && centerY < 1850) {
                regionCode = 'jeonnam';
              } else if (centerX < 550 && centerY > 1600 && centerY < 1700) {
                regionCode = 'gwangju';
              } else if (centerX > 1000 && centerY > 1150 && centerY < 1250) {
                regionCode = 'gyeongbuk';
              } else if (centerX > 950 && centerX < 1050 && centerY > 1300 && centerY < 1400) {
                regionCode = 'daegu';
              } else if (centerX > 900 && centerY > 1550 && centerY < 1650) {
                regionCode = 'gyeongnam';
              } else if (centerX > 1100 && centerY > 1700) {
                regionCode = 'busan';
              } else if (centerX > 1150 && centerY > 1450 && centerY < 1550) {
                regionCode = 'ulsan';
              } else if (centerY > 2200) {
                regionCode = 'jeju';
              } else if (centerX < 700 && centerY > 950 && centerY < 1100) {
                regionCode = 'gyeonggi';
              }
              
              console.log(`감지된 지역: ${regionCode}`);
              handleRegionClick(regionCode);
            });
          }
        });

        // SVG에 지역명 텍스트 오버레이 추가
        const svgElement = svgDoc.querySelector('svg');
        if (svgElement) {
          // 지역별 좌표 (viewBox: 0 0 1654.519 2892.3에 맞춤, 더 정확한 위치)
          const regionPositions = {
            '서울': { x: '750', y: '900' },
            '경기': { x: '650', y: '1000' },
            '인천': { x: '450', y: '950' },
            '강원': { x: '1050', y: '750' },
            '충북': { x: '850', y: '1200' },
            '충남': { x: '650', y: '1250' },
            '대전': { x: '750', y: '1350' },
            '세종': { x: '700', y: '1300' },
            '전북': { x: '550', y: '1550' },
            '전남': { x: '600', y: '1800' },
            '광주': { x: '500', y: '1650' },
            '경북': { x: '1050', y: '1200' },
            '경남': { x: '950', y: '1600' },
            '대구': { x: '1000', y: '1350' },
            '부산': { x: '1150', y: '1750' },
            '울산': { x: '1200', y: '1500' },
            '제주': { x: '400', y: '2300' }
          };

          Object.entries(regionPositions).forEach(([name, pos]) => {
            const textElement = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'text');
            textElement.setAttribute('x', pos.x);
            textElement.setAttribute('y', pos.y);
            textElement.setAttribute('font-size', '45');
            textElement.setAttribute('font-family', 'Noto Sans KR, sans-serif');
            textElement.setAttribute('font-weight', 'bold');
            textElement.setAttribute('fill', '#000');
            textElement.setAttribute('text-anchor', 'middle');
            textElement.setAttribute('pointer-events', 'none');
            textElement.setAttribute('stroke', '#fff');
            textElement.setAttribute('stroke-width', '2');
            textElement.setAttribute('paint-order', 'stroke fill');
            textElement.textContent = name;
            svgElement.appendChild(textElement);
          });
        }
      };

      const handleError = () => {
        console.error('SVG 파일 로드 중 오류가 발생했습니다.');
      };

      svgObject.addEventListener('load', handleLoad);
      svgObject.addEventListener('error', handleError);

      // cleanup function
      return () => {
        svgObject.removeEventListener('load', handleLoad);
        svgObject.removeEventListener('error', handleError);
      };
    };

    const cleanup = initializeMap();
    return cleanup;
  }, []);

  // 선택된 지역 강조 표시
  useEffect(() => {
    const svgObject = svgRef.current;
    if (!svgObject) return;

    const svgDoc = svgObject.contentDocument;
    if (!svgDoc) return;

    // 모든 지역 초기화
    Object.entries(regions).forEach(([regionCode, region]) => {
      const pathElement = svgDoc.getElementById(region.svgId);
      if (pathElement) {
        pathElement.style.fill = regionCode === selectedRegion ? 'rgb(251,229,187)' : '#f5f5f5';
      }
    });
  }, [selectedRegion]);

  // 지역별 회원 조회 API 호출
  const fetchMembers = async (province, city = null) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (province) params.append('province', province);
      if (city) params.append('city', city);
      
      const response = await fetch(`/api/members/search?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      } else {
        console.error('회원 조회 실패');
        setMembers([]);
      }
    } catch (error) {
      console.error('회원 조회 오류:', error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // 지역 클릭 핸들러 (전국지도에서)
  const handleRegionClick = (regionCode) => {
    setSelectedRegion(regionCode);
    setSelectedCity(null);
    setCurrentStep(2);
    fetchMembers(regions[regionCode].name);
  };

  // 시군구 클릭 핸들러
  const handleCityClick = (city) => {
    setSelectedCity(city);
    setCurrentStep(3);
    fetchMembers(regions[selectedRegion].name, city);
  };

  // 전체 지역으로 돌아가기
  const handleBackToAll = () => {
    setSelectedRegion(null);
    setSelectedCity(null);
    setMembers([]);
    setCurrentStep(1);
  };

  // 지역 선택으로 돌아가기
  const handleBackToRegion = () => {
    setSelectedCity(null);
    setCurrentStep(2);
    fetchMembers(regions[selectedRegion].name);
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* Header */}
      <header className="bg-white shadow p-2 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/images/sinsa-flower-logo-nobg.png" alt="신사 플라워 로고" className="h-12 mr-2" />
          <span style={{ color: 'rgb(251,229,187)' }} className="text-xl font-bold">신사 플라워</span>
        </div>
        <nav className="space-x-4">
          <a href="/order-form" className="text-sm hover:underline">발주</a>
          <a href="/orders" className="text-sm hover:underline">주문확인</a>
        </nav>
        <div className="text-sm space-x-2">
          <span>{user?.name}님</span>
          <button className="hover:underline text-red-500">로그아웃</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto mt-6 px-4 sm:px-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-3 space-y-6">
          {/* 사용자 정보 */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold text-lg">{user?.corporationName || user?.name}님</h2>
            <p className="text-sm text-gray-600">회원검색 시스템</p>
            <div className="mt-2 border-t pt-2">
              <p className="text-sm mb-1">수주미확인: <strong>2건</strong></p>
              <p className="text-sm">수주미배송: <strong>3건</strong></p>
            </div>
          </div>

          {/* 메뉴 */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold text-md mb-2">주문관리</h3>
            <ul className="space-y-1 text-sm">
              <li className="font-semibold text-amber-200">회원검색</li>
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
              <li><a href="/notice" className="hover:underline">공지사항</a></li>
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

        {/* Main Panel */}
        <section className="md:col-span-9 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">회원검색</h1>
          </div>
          
          <div className="bg-white p-4 rounded shadow">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* 지역 선택 패널 (1/4) */}
              <div className="border rounded p-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-amber-200 border-b pb-1">지역선택</h3>
                  {currentStep > 1 && (
                    <button 
                      onClick={currentStep === 3 ? handleBackToRegion : handleBackToAll}
                      className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 flex items-center"
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                      </svg>
                      {currentStep === 3 ? '지역선택' : '전체지역'}
                    </button>
                  )}
                </div>
                
                {/* 지도/목록 보기 전환 */}
                <div className="flex justify-between mb-2">
                  <div className="space-x-1">
                    <button 
                      onClick={() => setViewMode('map')}
                      className={`px-2 py-1 rounded text-xs ${
                        viewMode === 'map' ? 'bg-amber-200 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      지도보기
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`px-2 py-1 rounded text-xs ${
                        viewMode === 'list' ? 'bg-amber-200 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      목록보기
                    </button>
                  </div>
                </div>
                
                {/* Step 1: 전국 지도 */}
                {currentStep === 1 && viewMode === 'map' && (
                  <div className="map-container h-[600px] relative border rounded">
                    <object 
                      ref={svgRef}
                      data={`/images/Map_of_Korea-blank.svg?v=${Date.now()}`}
                      type="image/svg+xml" 
                      width="100%" 
                      height="100%"
                      className="pointer-events-auto"
                      onError={() => console.error('SVG 로드 실패')}
                    >
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <p>대한민국 지도를 불러올 수 없습니다.</p>
                          <p className="text-sm mt-2">목록보기를 사용해주세요.</p>
                        </div>
                      </div>
                    </object>
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-xs text-gray-600 bg-white bg-opacity-80 p-1 rounded">
                        원하는 지역을 클릭하세요
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Step 2: 세부 지역 목록 */}
                {currentStep === 2 && selectedRegion && (
                  <div className="mt-2">
                    <div className="mb-2">
                      <h4 className="font-medium text-sm">{regions[selectedRegion].name}</h4>
                      <p className="text-xs text-gray-500">세부 지역을 선택하세요</p>
                    </div>
                    <div className="grid grid-cols-2 gap-1 max-h-80 overflow-y-auto">
                      {regions[selectedRegion].cities.map(city => (
                        <button
                          key={city}
                          onClick={() => handleCityClick(city)}
                          className={`text-center py-1 border hover:bg-amber-50 text-xs transition-colors ${
                            selectedCity === city ? 'bg-amber-100 border-amber-300' : ''
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 목록 보기 (전국) */}
                {currentStep === 1 && viewMode === 'list' && (
                  <div className="grid grid-cols-1 gap-1 max-h-96 overflow-y-auto">
                    {Object.entries(regions).map(([code, region]) => (
                      <button
                        key={code}
                        onClick={() => handleRegionClick(code)}
                        className="text-left py-2 px-2 border hover:bg-amber-50 text-xs transition-colors rounded"
                      >
                        {region.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* 회원 목록 패널 (3/4) */}
              <div className="md:col-span-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-amber-200">
                    {selectedRegion && selectedCity 
                      ? `${regions[selectedRegion].name} ${selectedCity} 화원목록`
                      : selectedRegion 
                      ? `${regions[selectedRegion].name} 화원목록`
                      : '화원목록'
                    }
                  </h3>
                  <span className="text-sm text-gray-500">
                    총 {members.length}명
                  </span>
                </div>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-200 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">검색 중...</p>
                  </div>
                ) : members.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">화원명</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">대표자</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">연락처</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">지역</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">액션</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {members.map((member, index) => (
                          <tr key={member.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                              {member.corporationName || member.name}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                              {member.ceoName || member.name}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                              {member.phone}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                              {member.businessProvince}<br/><span className="text-xs text-gray-500">{member.businessCity}</span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                              <a href={`/order-form?member=${member.id}`} 
                                 className="text-amber-200 hover:text-amber-300 font-medium">
                                발주하기
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : selectedRegion ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">해당 지역에 등록된 화원이 없습니다.</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">지역을 선택하면 해당 지역의 화원 목록이 표시됩니다.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-6 text-center text-xs text-gray-500 p-2">
        &copy; 2025 신사 플라워. All rights reserved.
      </footer>
    </div>
  );
};

export default MemberSearch; 