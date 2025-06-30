import React, { useEffect } from 'react';

const OrderFormPreviewModal = ({ isOpen, onClose, orderData }) => {
  // 모달이 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handlePrint = () => {
    // 모달 내용만 인쇄하기 위한 새 창 열기
    const printContent = document.querySelector('.print-modal-content').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>주문서 미리보기</title>
          <style>
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
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleConfirmOrder = async () => {
    if (!orderData) return;

    try {
      const formData = new FormData();
      
      const orderInfo = {
        ...orderData,
        confirmed: true
      };
      
      formData.append('orderInfo', JSON.stringify(orderInfo));

      const response = await fetch('/api/orders', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert('발주가 성공적으로 완료되었습니다.');
        onClose(); // 모달 닫기
        window.location.href = '/all-orders'; // 주문 목록 페이지로 이동
      } else {
        const errorData = await response.json();
        alert(`발주 실패: ${errorData.message || '알 수 없는 오류가 발생했습니다.'}`);
      }
    } catch (error) {
      console.error('발주 오류:', error);
      alert('발주 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      {/* 모달 컨텐츠 */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          {/* 모달 헤더 */}
          <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
            <h2 className="text-lg font-bold">주문서 / 수주서 미리보기</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          
          {/* 버튼 영역 */}
          <div className="text-center p-4 border-b">
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

          {/* 모달 바디 - 인쇄용 컨텐츠 */}
          <div className="p-4">
            <div className="print-modal-content bg-white">
              {/* 첫 번째 영수증 (상단 부분) */}
              <div className="order-section mb-4">
                <table className="w-full mb-2">
                  <tbody>
                    <tr>
                      <td>NO: <span>{orderData?.orderNo || 'OR-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + Math.floor(Math.random() * 100)}</span></td>
                      <td className="text-right">주문일시: <span>{orderData?.orderDate || new Date().toLocaleString('ko-KR')}</span></td>
                    </tr>
                  </tbody>
                </table>

                <table className="w-full border border-black" style={{borderCollapse: 'collapse'}}>
                  <tbody>
                    <tr>
                      <td colSpan="5" className="border border-black p-1">
                        <table className="w-full" style={{border: 'none'}}>
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
                      <td className="border border-black p-1 text-xs">성명/상호</td>
                      <td className="border border-black p-1 text-xs" colSpan="2">{orderData?.orderCustomerName || ''}</td>
                      <td className="border border-black p-1 text-xs">발주자</td>
                      <td className="border border-black p-1 text-xs">{orderData?.senderName || ''}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 text-xs">연락처</td>
                      <td className="border border-black p-1 text-xs" colSpan="2">{orderData?.orderCustomerPhone || orderData?.orderCustomerMobile || ''}</td>
                      <td className="border border-black p-1 text-xs">발주처</td>
                      <td className="border border-black p-1 text-xs">{orderData?.shopName || ''}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 text-xs">배송지</td>
                      <td className="border border-black p-1 text-xs" colSpan="4">{orderData?.deliveryAddress || ''}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 text-xs">품목</td>
                      <td className="border border-black p-1 text-xs">단가</td>
                      <td className="border border-black p-1 text-xs">수량</td>
                      <td className="border border-black p-1 text-xs">금액</td>
                      <td className="border border-black p-1 text-xs">비고</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 text-xs" style={{height: '80px', verticalAlign: 'top'}}>{orderData?.productName || ''}</td>
                      <td className="border border-black p-1 text-xs" style={{verticalAlign: 'top'}}>{orderData?.paymentPrice?.toLocaleString() || '0'}</td>
                      <td className="border border-black p-1 text-xs" style={{verticalAlign: 'top'}}>1</td>
                      <td className="border border-black p-1 text-xs" style={{verticalAlign: 'top'}}>{orderData?.totalPrice?.toLocaleString() || '0'}</td>
                      <td className="border border-black p-1 text-xs" style={{verticalAlign: 'top'}}>{orderData?.productDetail || ''}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 text-xs">합계</td>
                      <td className="border border-black p-1 text-xs"></td>
                      <td className="border border-black p-1 text-xs"></td>
                      <td className="border border-black p-1 text-xs">{orderData?.totalPrice?.toLocaleString() || '0'}</td>
                      <td className="border border-black p-1 text-xs"></td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 text-xs">배송일시</td>
                      <td className="border border-black p-1 text-xs" colSpan="2">{orderData?.deliveryDate || ''} {orderData?.eventHour || ''}:{orderData?.eventMinute || ''}</td>
                      <td className="border border-black p-1 text-xs">리본색상</td>
                      <td className="border border-black p-1 text-xs">{orderData?.ribbonColor || ''}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 text-xs">경조사어</td>
                      <td className="border border-black p-1 text-xs" colSpan="4">{orderData?.congratulatoryMessage || ''}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 text-xs">특별 요청사항</td>
                      <td className="border border-black p-1 text-xs" colSpan="4">{orderData?.requestMessage || ''}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 절취선 */}
              <div className="cut-line text-center py-2 border-t border-b border-dashed border-gray-400 my-4">
                -------- 절 취 선 --------
              </div>

              {/* 두 번째 영수증 (하단 부분 - 수주서) */}
              <div className="order-section">
                <table className="w-full mb-2">
                  <tbody>
                    <tr>
                      <td>NO: <span>{orderData?.orderNo || 'OR-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + Math.floor(Math.random() * 100)}</span></td>
                      <td className="text-right">주문일시: <span>{orderData?.orderDate || new Date().toLocaleString('ko-KR')}</span></td>
                    </tr>
                  </tbody>
                </table>

                <table className="w-full border border-black" style={{borderCollapse: 'collapse'}}>
                  <tbody>
                    <tr>
                      <td colSpan="5" className="border border-black p-1">
                        <table className="w-full" style={{border: 'none'}}>
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
                      <td className="border border-black p-1 text-xs">성명/상호</td>
                      <td className="border border-black p-1 text-xs" colSpan="2">{orderData?.orderCustomerName || ''}</td>
                      <td className="border border-black p-1 text-xs">발주자</td>
                      <td className="border border-black p-1 text-xs">{orderData?.senderName || ''}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 text-xs">연락처</td>
                      <td className="border border-black p-1 text-xs" colSpan="2">{orderData?.orderCustomerPhone || orderData?.orderCustomerMobile || ''}</td>
                      <td className="border border-black p-1 text-xs">발주처</td>
                      <td className="border border-black p-1 text-xs">{orderData?.shopName || ''}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 text-xs">배송지</td>
                      <td className="border border-black p-1 text-xs" colSpan="4">{orderData?.deliveryAddress || ''}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 text-xs">품목</td>
                      <td className="border border-black p-1 text-xs">단가</td>
                      <td className="border border-black p-1 text-xs">수량</td>
                      <td className="border border-black p-1 text-xs">금액</td>
                      <td className="border border-black p-1 text-xs">비고</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 text-xs" style={{height: '80px', verticalAlign: 'top'}}>{orderData?.productName || ''}</td>
                      <td className="border border-black p-1 text-xs" style={{verticalAlign: 'top'}}>{orderData?.paymentPrice?.toLocaleString() || '0'}</td>
                      <td className="border border-black p-1 text-xs" style={{verticalAlign: 'top'}}>1</td>
                      <td className="border border-black p-1 text-xs" style={{verticalAlign: 'top'}}>{orderData?.totalPrice?.toLocaleString() || '0'}</td>
                      <td className="border border-black p-1 text-xs" style={{verticalAlign: 'top'}}>{orderData?.productDetail || ''}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 text-xs">합계</td>
                      <td className="border border-black p-1 text-xs"></td>
                      <td className="border border-black p-1 text-xs"></td>
                      <td className="border border-black p-1 text-xs">{orderData?.totalPrice?.toLocaleString() || '0'}</td>
                      <td className="border border-black p-1 text-xs"></td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 text-xs">배송일시</td>
                      <td className="border border-black p-1 text-xs" colSpan="2">{orderData?.deliveryDate || ''} {orderData?.eventHour || ''}:{orderData?.eventMinute || ''}</td>
                      <td className="border border-black p-1 text-xs">리본색상</td>
                      <td className="border border-black p-1 text-xs">{orderData?.ribbonColor || ''}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 text-xs">경조사어</td>
                      <td className="border border-black p-1 text-xs" colSpan="4">{orderData?.congratulatoryMessage || ''}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 text-xs">특별 요청사항</td>
                      <td className="border border-black p-1 text-xs" colSpan="4">{orderData?.requestMessage || ''}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 text-xs">인수하신분</td>
                      <td className="border border-black p-1 text-xs">&nbsp;</td>
                      <td className="border border-black p-1 text-xs">관계</td>
                      <td className="border border-black p-1 text-xs">&nbsp;</td>
                      <td className="border border-black p-1 text-xs">인수시간</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderFormPreviewModal; 