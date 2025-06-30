import React, { useState, useEffect } from 'react';

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = `/api/orders/my-orders${filterStatus ? `?status=${filterStatus}` : ''}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('발주 목록 조회 실패');
      }
    } catch (error) {
      console.error('발주 목록 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'PENDING': '미확인',
      'CONFIRMED': '확인됨',
      'SHIPPED': '배송중',
      'DELIVERED': '배송완료',
      'CANCELLED': '취소됨',
      'REFUNDED': '환불됨'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'PENDING': 'text-yellow-600 bg-yellow-100',
      'CONFIRMED': 'text-blue-600 bg-blue-100',
      'SHIPPED': 'text-purple-600 bg-purple-100',
      'DELIVERED': 'text-green-600 bg-green-100',
      'CANCELLED': 'text-red-600 bg-red-100',
      'REFUNDED': 'text-gray-600 bg-gray-100'
    };
    return colorMap[status] || 'text-gray-600 bg-gray-100';
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
            <li><a href="/all-orders" className="hover:underline font-semibold text-amber-200">전체발주리스트</a></li>
            <li><a href="/all-received-orders" className="hover:underline">전체수주리스트</a></li>
            <li><a href="/unconfirmed-orders" className="hover:underline">미확인주문리스트</a></li>
            <li><a href="/canceled-orders" className="hover:underline">취소주문리스트</a></li>
          </ul>
        </div>
      </aside>

      {/* Main Panel */}
      <section className="md:col-span-9 space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="text-base font-bold">전체 발주 리스트</h1>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border px-2 py-1 rounded text-xs"
            >
              <option value="">전체 상태</option>
              <option value="PENDING">미확인</option>
              <option value="CONFIRMED">확인됨</option>
              <option value="SHIPPED">배송중</option>
              <option value="DELIVERED">배송완료</option>
              <option value="CANCELLED">취소됨</option>
            </select>
            <button
              onClick={fetchOrders}
              className="bg-amber-200 text-white px-3 py-1 rounded text-xs hover:bg-amber-300"
            >
              새로고침
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded shadow-sm">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">발주 목록을 불러오는 중...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-auto w-full border text-sm bg-white shadow-sm">
                <thead className="bg-gray-200 text-gray-700 text-center">
                  <tr>
                    <th className="border px-2 py-1">순번</th>
                    <th className="border px-2 py-1">주문번호<br/>배송요구일</th>
                    <th className="border px-2 py-1">주문접수일<br/>상태</th>
                    <th className="border px-2 py-1">받는분</th>
                    <th className="border px-2 py-1">수주화원<br/>지역/호점</th>
                    <th className="border px-2 py-1">상품명<br/>배송지</th>
                    <th className="border px-2 py-1">원청액<br/>결제액</th>
                    <th className="border px-2 py-1">배송상태</th>
                    <th className="border px-2 py-1">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="border px-2 py-4 text-center text-gray-500">
                        발주 내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order, index) => (
                      <tr key={order.orderId} className="hover:bg-gray-50">
                        <td className="border px-2 py-1 text-center">{index + 1}</td>
                        <td className="border px-2 py-1 text-center text-xs">
                          <div className="font-medium">{order.orderNumber}</div>
                          <div className="text-gray-500">
                            {order.deliveryDate && new Date(order.deliveryDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="border px-2 py-1 text-center text-xs">
                          <div>{new Date(order.orderDate).toLocaleDateString()}</div>
                          <div className={`inline-block px-1 py-0.5 rounded text-xs ${getStatusColor(order.orderStatus)}`}>
                            {getStatusText(order.orderStatus)}
                          </div>
                        </td>
                        <td className="border px-2 py-1 text-center text-xs">
                          {order.recipientName}
                        </td>
                        <td className="border px-2 py-1 text-center text-xs">
                          <div className="font-medium">{order.counterpartShopName}</div>
                          <div className="text-gray-500">{order.region}</div>
                        </td>
                        <td className="border px-2 py-1 text-xs">
                          <div className="font-medium">{order.productName}</div>
                          <div className="text-gray-500 truncate" title={order.shippingAddress}>
                            {order.shippingAddress}
                          </div>
                        </td>
                        <td className="border px-2 py-1 text-center text-xs">
                          <div>원청: {order.originalAmount?.toLocaleString()}원</div>
                          <div className="font-medium text-blue-600">
                            결제: {order.totalAmount?.toLocaleString()}원
                          </div>
                        </td>
                        <td className="border px-2 py-1 text-center text-xs">
                          {order.shippingStatus || '-'}
                        </td>
                        <td className="border px-2 py-1 text-center">
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => window.location.href = `/order-detail/${order.orderId}`}
                              className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs hover:bg-blue-600"
                            >
                              상세
                            </button>
                            {order.orderStatus === 'PENDING' && (
                              <button
                                className="bg-red-500 text-white px-2 py-0.5 rounded text-xs hover:bg-red-600"
                              >
                                취소
                              </button>
                            )}
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
      </section>
    </div>
  );
};

export default AllOrders; 