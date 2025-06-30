import React, { useState, useEffect } from 'react';

const UnconfirmedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnconfirmedOrders();
  }, []);

  const fetchUnconfirmedOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders/unconfirmed', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('미확인 주문 목록 조회 실패');
      }
    } catch (error) {
      console.error('미확인 주문 목록 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = async (orderId, action) => {
    try {
      let endpoint;
      switch (action) {
        case 'confirm':
          endpoint = `/api/orders/${orderId}/confirm`;
          break;
        case 'cancel':
          endpoint = `/api/orders/${orderId}/cancel`;
          break;
        default:
          return;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert(action === 'confirm' ? '주문이 확인되었습니다.' : '주문이 거절되었습니다.');
        fetchUnconfirmedOrders(); // 목록 새로고침
      } else {
        alert('처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('주문 처리 오류:', error);
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-2 px-2 grid grid-cols-1 md:grid-cols-12 gap-2">
      {/* Sidebar */}
      <aside className="md:col-span-3 space-y-2">
        <div className="bg-white p-2 rounded shadow-sm">
          <h2 className="font-bold text-sm">화환앤플라워님</h2>
          <p className="text-xs text-gray-600">잔금총액: <strong>805,500원</strong></p>
          <div className="mt-1">
            <p className="text-xs">신사 포인트: <strong>11,110P</strong></p>
            <p className="text-xs">등급 포인트: <strong>0P</strong></p>
          </div>
          <button className="block mt-1 w-full bg-amber-200 text-white py-0.5 rounded text-center text-xs">
            충전/정산
          </button>
          <button className="mt-1 w-full bg-gray-100 py-0.5 rounded text-xs">
            신사멤버십 혜택보기
          </button>
        </div>

        <div className="bg-white p-2 rounded shadow-sm">
          <h3 className="font-semibold text-xs border-b pb-1 mb-1">주문관리</h3>
          <ul className="space-y-0.5 text-xs">
            <li><a href="/member-search" className="hover:underline">회원검색</a></li>
            <li><a href="/order-form" className="hover:underline">발주</a></li>
            <li><a href="/all-orders" className="hover:underline">전체발주리스트</a></li>
            <li><a href="/all-received-orders" className="hover:underline">전체수주리스트</a></li>
            <li><a href="/unconfirmed-orders" className="hover:underline font-semibold text-amber-200">미확인주문리스트</a></li>
            <li><a href="/canceled-orders" className="hover:underline">취소주문리스트</a></li>
          </ul>
        </div>
      </aside>

      {/* Main Panel */}
      <section className="md:col-span-9 space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="text-base font-bold">미확인 주문 리스트</h1>
          <div className="flex gap-2">
            <div className="text-sm text-red-600 font-medium">
              미확인 주문: <span className="text-lg">{orders.length}</span>건
            </div>
            <button
              onClick={fetchUnconfirmedOrders}
              className="bg-amber-200 text-white px-3 py-1 rounded text-xs hover:bg-amber-300"
            >
              새로고침
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded shadow-sm">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">미확인 주문을 불러오는 중...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-auto w-full border text-sm bg-white shadow-sm">
                <thead className="bg-red-100 text-gray-700 text-center">
                  <tr>
                    <th className="border px-2 py-1">순번</th>
                    <th className="border px-2 py-1">주문번호<br/>주문일시</th>
                    <th className="border px-2 py-1">발주화원<br/>지역</th>
                    <th className="border px-2 py-1">받는분<br/>연락처</th>
                    <th className="border px-2 py-1">상품명<br/>배송지</th>
                    <th className="border px-2 py-1">배송요구일시</th>
                    <th className="border px-2 py-1">원청액<br/>결제액</th>
                    <th className="border px-2 py-1">수주확인</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="border px-2 py-8 text-center text-gray-500">
                        <div className="text-lg mb-2">🎉</div>
                        <div>미확인 주문이 없습니다!</div>
                        <div className="text-xs text-gray-400 mt-1">모든 주문이 처리되었습니다.</div>
                      </td>
                    </tr>
                  ) : (
                    orders.map((order, index) => (
                      <tr key={order.orderId} className="hover:bg-yellow-50">
                        <td className="border px-2 py-1 text-center">{index + 1}</td>
                        <td className="border px-2 py-1 text-center text-xs">
                          <div className="font-medium text-blue-600">{order.orderNumber}</div>
                          <div className="text-gray-500">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </div>
                          <div className="text-gray-500">
                            {new Date(order.orderDate).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="border px-2 py-1 text-center text-xs">
                          <div className="font-medium">{order.counterpartShopName}</div>
                          <div className="text-gray-500">{order.region}</div>
                        </td>
                        <td className="border px-2 py-1 text-center text-xs">
                          <div className="font-medium">{order.recipientName}</div>
                          <div className="text-gray-500">{order.recipientPhone || '-'}</div>
                        </td>
                        <td className="border px-2 py-1 text-xs">
                          <div className="font-medium">{order.productName}</div>
                          <div className="text-gray-500 text-xs truncate" title={order.shippingAddress}>
                            {order.shippingAddress}
                          </div>
                        </td>
                        <td className="border px-2 py-1 text-center text-xs">
                          <div className="font-medium text-red-600">
                            {order.deliveryDate && new Date(order.deliveryDate).toLocaleDateString()}
                          </div>
                          <div className="text-gray-500">
                            {order.deliveryTime || '-'}
                          </div>
                        </td>
                        <td className="border px-2 py-1 text-center text-xs">
                          <div>원청: {order.originalAmount?.toLocaleString()}원</div>
                          <div className="font-medium text-blue-600">
                            결제: {order.totalAmount?.toLocaleString()}원
                          </div>
                        </td>
                        <td className="border px-2 py-1 text-center">
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => window.location.href = `/order-detail/${order.orderId}`}
                              className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs hover:bg-blue-600"
                            >
                              상세보기
                            </button>
                            <button
                              onClick={() => handleOrderAction(order.orderId, 'confirm')}
                              className="bg-green-500 text-white px-2 py-0.5 rounded text-xs hover:bg-green-600"
                            >
                              수주확인
                            </button>
                            <button
                              onClick={() => handleOrderAction(order.orderId, 'cancel')}
                              className="bg-red-500 text-white px-2 py-0.5 rounded text-xs hover:bg-red-600"
                            >
                              수주거절
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 안내 메시지 */}
        {orders.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-xs">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-600">⚠️</span>
              <span className="font-medium text-yellow-800">주문 처리 안내</span>
            </div>
            <ul className="space-y-1 text-yellow-700">
              <li>• 미확인 주문은 가능한 빨리 처리해주세요.</li>
              <li>• 수주확인 후에는 배송 준비를 시작하실 수 있습니다.</li>
              <li>• 수주거절 시에는 발주자에게 자동으로 알림이 전송됩니다.</li>
            </ul>
          </div>
        )}
      </section>
    </div>
  );
};

export default UnconfirmedOrders; 