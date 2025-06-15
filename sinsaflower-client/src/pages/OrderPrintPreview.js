import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const OrderPrintPreview = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // sessionStorage에서 주문 데이터 가져오기
    const savedOrderData = sessionStorage.getItem('orderPreviewData');
    if (savedOrderData) {
      setOrderData(JSON.parse(savedOrderData));
    } else {
      // 데이터가 없으면 주문 페이지로 리다이렉트
      alert('주문 데이터가 없습니다. 주문 입력 페이지로 돌아갑니다.');
      navigate('/order-form');
    }
  }, [navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleGoBack = () => {
    navigate('/order-form');
  };

  const handleConfirmOrder = async () => {
    if (!orderData) return;

    try {
      // FormData 객체 생성
      const formData = new FormData();
      
      // 주문 정보를 JSON으로 변환하여 추가
      const orderInfo = {
        ...orderData,
        confirmed: true
      };
      
      formData.append('orderInfo', JSON.stringify(orderInfo));

      // API 호출
      const response = await fetch('/api/orders', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert('발주가 성공적으로 완료되었습니다.');
        sessionStorage.removeItem('orderPreviewData'); // 데이터 정리
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

  if (!orderData) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="text-gray-500">로딩 중...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-2">
        {/* 페이지 제목 */}
        <div className="flex justify-between items-center">
          <h1 className="text-base font-bold">주문서 / 수주서 미리보기</h1>
        </div>
        
        {/* 버튼 영역 */}
        <div className="text-center mb-4 no-print">
          <button 
            onClick={handleGoBack}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
          >
            돌아가기
          </button>
          <button 
            onClick={handlePrint}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
          >
            인쇄하기
          </button>
          <button 
            onClick={handleConfirmOrder}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            발주 확정
          </button>
        </div>

        {/* 인쇄 스타일 */}
        <style>{`
          @media print {
            .no-print, .no-print * {
              display: none !important;
            }
            body {
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .order-section {
              margin: 0;
              padding: 0;
              height: auto;
              max-height: 400px;
              break-inside: avoid;
              page-break-inside: avoid;
            }
            .print-container {
              border: none;
              box-shadow: none;
              padding: 0;
              margin: 0;
            }
            .cut-line {
              display: none !important;
            }
          }
          body {
            font-family: 'Noto Sans KR', sans-serif;
            margin: 0;
            padding: 20px;
          }
          .print-container {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #ddd;
            padding: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            background: white;
          }
          .order-section {
            margin-bottom: 5px;
            page-break-after: auto;
            height: 400px;
            overflow: hidden;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px;
          }
          table.grid {
            border: 1px solid #000;
          }
          table.grid th, table.grid td {
            border: 1px solid #000;
            padding: 2px;
            font-size: 10px;
          }
          table.no_border, table.no_border td {
            border: none;
          }
          .right {
            text-align: right;
          }
          h3 {
            margin: 0;
          }
          .cut-line {
            text-align: center;
            line-height: 20px;
            font-size: 10px;
            border-top: 1px dashed #999;
            border-bottom: 1px dashed #999;
            margin: 5px 0;
          }
        `}</style>

        {/* 인쇄용 컨테이너 */}
        <div className="print-container bg-white">
          {/* 첫 번째 영수증 (상단 부분) */}
          <div className="order-section">
            <table>
              <tbody>
                <tr>
                  <td>NO: <span>{orderData.orderNo}</span></td>
                  <td className="right">주문일시: <span>{orderData.orderDate}</span></td>
                </tr>
              </tbody>
            </table>

            <table className="grid">
              <tbody>
                <tr>
                  <td colSpan="5">
                    <table className="no_border">
                      <tbody>
                        <tr>
                          <td style={{width: '33.33333%', lineHeight: '1.0em'}}>
                            <img src="/images/sinsa-flower-logo-nobg.png" width="80" alt="신사 플라워 로고" />
                          </td>
                          <td style={{width: '33.33333%', textAlign: 'center', fontSize: '16px', fontWeight: 'bold'}}>
                            <h3>주문서</h3>
                            (Order Form)
                          </td>
                          <td style={{width: '33.33333%', textAlign: 'right', fontSize: '9px'}}>
                            서울시 중구 충무로3가 24-28<br />
                            크리스탈빌딩 204호<br />
                            TEL: 02-2275-4648<br />
                            FAX: 02-2275-4649<br />
                            HP: 010-2022-4648
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>성명/상호</td>
                  <td colSpan="2">{orderData.customerName}</td>
                  <td>발주자</td>
                  <td>{orderData.orderBy}</td>
                </tr>
                <tr>
                  <td>연락처</td>
                  <td colSpan="2">{orderData.customerPhone}</td>
                  <td>발주처</td>
                  <td>{orderData.orderFrom}</td>
                </tr>
                <tr>
                  <td>배송지</td>
                  <td colSpan="4">{orderData.deliveryAddress}</td>
                </tr>
                <tr>
                  <td>품목</td>
                  <td>단가</td>
                  <td>수량</td>
                  <td>금액</td>
                  <td>비고</td>
                </tr>
                <tr>
                  <td style={{height: '80px', verticalAlign: 'top'}}>{orderData.productName}</td>
                  <td style={{verticalAlign: 'top'}}>{orderData.unitPrice?.toLocaleString()}</td>
                  <td style={{verticalAlign: 'top'}}>{orderData.quantity}</td>
                  <td style={{verticalAlign: 'top'}}>{orderData.totalAmount?.toLocaleString()}</td>
                  <td style={{verticalAlign: 'top'}}>{orderData.notes}</td>
                </tr>
                <tr>
                  <td>합계</td>
                  <td></td>
                  <td></td>
                  <td>{orderData.totalAmount?.toLocaleString()}</td>
                  <td></td>
                </tr>
                <tr>
                  <td>배송일시</td>
                  <td colSpan="2">{orderData.deliveryDate} {orderData.deliveryTime}</td>
                  <td>리본색상</td>
                  <td>{orderData.ribbonColor}</td>
                </tr>
                <tr>
                  <td>경조사어</td>
                  <td colSpan="4">{orderData.occasionText}</td>
                </tr>
                <tr>
                  <td>특별 요청사항</td>
                  <td colSpan="4">{orderData.specialRequests}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 절취선 */}
          <div className="cut-line">-------- 절 취 선 --------</div>

          {/* 두 번째 영수증 (하단 부분 - 수주서) */}
          <div className="order-section">
            <table>
              <tbody>
                <tr>
                  <td>NO: <span>{orderData.orderNo}</span></td>
                  <td className="right">주문일시: <span>{orderData.orderDate}</span></td>
                </tr>
              </tbody>
            </table>

            <table className="grid">
              <tbody>
                <tr>
                  <td colSpan="5">
                    <table className="no_border">
                      <tbody>
                        <tr>
                          <td style={{width: '33.33333%', lineHeight: '1.0em'}}>
                            <img src="/images/sinsa-flower-logo-nobg.png" width="80" alt="신사 플라워 로고" />
                          </td>
                          <td style={{width: '33.33333%', textAlign: 'center', fontSize: '16px', fontWeight: 'bold'}}>
                            <h3>수주서</h3>
                            (Order Receipt)
                          </td>
                          <td style={{width: '33.33333%', textAlign: 'right', fontSize: '9px'}}>
                            서울시 중구 충무로3가 24-28<br />
                            크리스탈빌딩 204호<br />
                            TEL: 02-2275-4648<br />
                            FAX: 02-2275-4649<br />
                            HP: 010-2022-4648
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>성명/상호</td>
                  <td colSpan="2">{orderData.customerName}</td>
                  <td>발주자</td>
                  <td>{orderData.orderBy}</td>
                </tr>
                <tr>
                  <td>연락처</td>
                  <td colSpan="2">{orderData.customerPhone}</td>
                  <td>발주처</td>
                  <td>{orderData.orderFrom}</td>
                </tr>
                <tr>
                  <td>배송지</td>
                  <td colSpan="4">{orderData.deliveryAddress}</td>
                </tr>
                <tr>
                  <td>품목</td>
                  <td>단가</td>
                  <td>수량</td>
                  <td>금액</td>
                  <td>비고</td>
                </tr>
                <tr>
                  <td style={{height: '80px', verticalAlign: 'top'}}>{orderData.productName}</td>
                  <td style={{verticalAlign: 'top'}}>{orderData.unitPrice?.toLocaleString()}</td>
                  <td style={{verticalAlign: 'top'}}>{orderData.quantity}</td>
                  <td style={{verticalAlign: 'top'}}>{orderData.totalAmount?.toLocaleString()}</td>
                  <td style={{verticalAlign: 'top'}}>{orderData.notes}</td>
                </tr>
                <tr>
                  <td>합계</td>
                  <td></td>
                  <td></td>
                  <td>{orderData.totalAmount?.toLocaleString()}</td>
                  <td></td>
                </tr>
                <tr>
                  <td>배송일시</td>
                  <td colSpan="2">{orderData.deliveryDate} {orderData.deliveryTime}</td>
                  <td>리본색상</td>
                  <td>{orderData.ribbonColor}</td>
                </tr>
                <tr>
                  <td>경조사어</td>
                  <td colSpan="4">{orderData.occasionText}</td>
                </tr>
                <tr>
                  <td>특별 요청사항</td>
                  <td colSpan="4">{orderData.specialRequests}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderPrintPreview; 