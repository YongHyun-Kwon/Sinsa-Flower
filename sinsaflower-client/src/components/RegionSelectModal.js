import React, { useState } from 'react';

const RegionSelectModal = ({ isOpen, onClose, onSelect }) => {
  const [selectedSido, setSelectedSido] = useState('서울특별시');
  const [selectedRegion, setSelectedRegion] = useState(null);

  // 지역 데이터 (실제로는 백엔드 API에서 가져와야 함)
  const regionData = {
    '서울특별시': [
      { name: '강남구', price: 38000 },
      { name: '강동구', price: 38000 },
      { name: '강북구', price: 38000 },
      { name: '강서구', price: 38000 },
      { name: '관악구', price: 38000 },
      { name: '광진구', price: 38000 },
      { name: '구로구', price: 38000 },
      { name: '금천구', price: 38000 },
      { name: '노원구', price: 38000 },
      { name: '도봉구', price: 38000 },
      { name: '동대문구', price: 38000 },
      { name: '동작구', price: 38000 },
      { name: '마포구', price: 38000 },
      { name: '서대문구', price: 38000 },
      { name: '서초구', price: 38000 },
      { name: '성동구', price: 38000 },
      { name: '성북구', price: 38000 },
      { name: '송파구', price: 38000 },
      { name: '양천구', price: 38000 },
      { name: '영등포구', price: 38000 },
      { name: '용산구', price: 38000 },
      { name: '은평구', price: 38000 },
      { name: '종로구', price: 38000 },
      { name: '중구', price: 38000 },
      { name: '중랑구', price: 38000 },
    ],
    '강원도': [
      { name: '강릉시', price: 50000 },
      { name: '고성군', price: 50000 },
      { name: '동해시', price: 55000 },
      { name: '삼척시', price: 55000 },
      { name: '속초시', price: 50000 },
      { name: '양구군', price: 70000 },
      { name: '양양군', price: 50000 },
      { name: '영월군', price: 60000 },
      { name: '원주시', price: 55000 },
      { name: '인제군', price: 70000 },
      { name: '정선군', price: 70000 },
      { name: '철원군', price: 65000 },
      { name: '춘천시', price: 47000 },
      { name: '태백시', price: 70000 },
      { name: '평창군', price: 70000 },
      { name: '홍천군', price: 50000 },
      { name: '화천군', price: 60000 },
      { name: '횡성군', price: 70000 },
    ],
    '경기도': [
      { name: '가평군', price: 50000 },
      { name: '고양시', price: 38000 },
      { name: '과천시', price: 38000 },
      { name: '광명시', price: 38000 },
      { name: '광주시', price: 40000 },
      { name: '구리시', price: 38000 },
      { name: '군포시', price: 38000 },
      { name: '김포시', price: 40000 },
      { name: '남양주시', price: 38000 },
      { name: '대부도', price: 50000 },
      { name: '동두천시', price: 40000 },
      { name: '부천시', price: 38000 },
      { name: '성남시', price: 38000 },
      { name: '수원시', price: 40000 },
      { name: '시흥시', price: 38000 },
      { name: '안산시', price: 38000 },
      { name: '안성시', price: 45000 },
      { name: '안양시', price: 38000 },
      { name: '양주시', price: 40000 },
      { name: '양평군', price: 50000 },
      { name: '여주시', price: 45000 },
      { name: '연천군', price: 50000 },
      { name: '오산시', price: 40000 },
      { name: '용인시', price: 40000 },
      { name: '의왕시', price: 38000 },
      { name: '의정부시', price: 38000 },
      { name: '이천시', price: 45000 },
      { name: '파주시', price: 40000 },
      { name: '평택시', price: 45000 },
      { name: '포천시', price: 45000 },
      { name: '하남시', price: 38000 },
      { name: '화성시', price: 40000 },
    ],
    '인천광역시': [
      { name: '강화군', price: 50000 },
      { name: '계양구', price: 38000 },
      { name: '남동구', price: 38000 },
      { name: '동구', price: 38000 },
      { name: '미추홀구', price: 38000 },
      { name: '부평구', price: 38000 },
      { name: '서구', price: 38000 },
      { name: '연수구', price: 38000 },
      { name: '옹진군', price: 70000 },
      { name: '중구', price: 38000 },
    ],
    // 필요에 따라 다른 시/도 데이터도 추가 가능
  };

  const sidoList = [
    '서울특별시', '강원도', '경기도', '경상남도', '경상북도',
    '광주광역시', '대구광역시', '대전광역시', '부산광역시', '세종시',
    '울산광역시', '인천광역시', '전라남도', '전라북도', '제주특별자치도',
    '충청남도', '충청북도'
  ];

  // 시/도 선택
  const handleSidoSelect = (sido) => {
    setSelectedSido(sido);
    setSelectedRegion(null);
  };

  // 구/군 선택
  const handleRegionSelect = (region) => {
    setSelectedRegion({
      sido: selectedSido,
      gugun: region.name,
      fullName: `${selectedSido} ${region.name}`,
      price: region.price
    });
  };

  // 선택 완료
  const handleSelectComplete = () => {
    if (selectedRegion) {
      onSelect(selectedRegion);
      onClose();
      setSelectedRegion(null);
    } else {
      alert('지역을 선택해주세요.');
    }
  };

  // 모달 닫기
  const handleClose = () => {
    onClose();
    setSelectedRegion(null);
  };

  if (!isOpen) return null;

  const currentRegions = regionData[selectedSido] || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl h-[600px] flex flex-col">
        {/* 헤더 */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">지역선택</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectComplete}
              className="bg-amber-200 text-white px-4 py-1 rounded text-sm hover:bg-amber-300"
            >
              선택 완료
            </button>
            <button
              onClick={handleClose}
              className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 시/도 선택 (왼쪽) */}
          <div className="w-1/3 border-r p-3 overflow-y-auto">
            <div className="space-y-1">
              {sidoList.map((sido) => (
                <button
                  key={sido}
                  onClick={() => handleSidoSelect(sido)}
                  className={`w-full text-left px-3 py-2 text-sm rounded border ${
                    selectedSido === sido
                      ? 'bg-amber-100 border-amber-300 font-medium'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {sido}
                </button>
              ))}
            </div>
          </div>

          {/* 구/군 선택 (오른쪽) */}
          <div className="w-2/3 p-3 overflow-y-auto">
            <div className="grid grid-cols-3 gap-2">
              {currentRegions.map((region) => (
                <button
                  key={region.name}
                  onClick={() => handleRegionSelect(region)}
                  className={`p-2 text-sm border rounded text-center hover:bg-gray-50 ${
                    selectedRegion?.gugun === region.name
                      ? 'bg-amber-100 border-amber-300 font-medium'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  {region.name}
                  <div className="text-xs text-orange-600 font-medium mt-1">
                    {region.price.toLocaleString()}
                  </div>
                </button>
              ))}
            </div>

            {currentRegions.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                해당 지역의 데이터가 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* 선택된 지역 표시 */}
        {selectedRegion && (
          <div className="p-4 border-t bg-gray-50">
            <div className="text-sm">
              <span className="font-medium">선택된 지역: </span>
              <span className="text-blue-600">{selectedRegion.fullName}</span>
              <span className="ml-4 font-medium">배송비: </span>
              <span className="text-orange-600 font-medium">
                {selectedRegion.price.toLocaleString()}원
              </span>
            </div>
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="flex justify-end p-4 border-t gap-2">
          <button
            onClick={handleSelectComplete}
            disabled={!selectedRegion}
            className="bg-amber-200 text-white px-4 py-2 rounded text-sm hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default RegionSelectModal; 