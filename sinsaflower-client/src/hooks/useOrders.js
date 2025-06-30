import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/apiClient';

/**
 * 주문 관련 API 키 상수
 */
export const ORDER_KEYS = {
  all: ['orders'],
  myOrders: (userId, filters = {}) => ['orders', 'my', userId, filters],
  receivedOrders: (userId, filters = {}) => ['orders', 'received', userId, filters],
  unconfirmedOrders: (userId) => ['orders', 'unconfirmed', userId],
  orderDetail: (orderId) => ['orders', 'detail', orderId],
  dashboard: (userId) => ['orders', 'dashboard', userId],
};

/**
 * 주문 관련 커스텀 훅
 */

// 주문 생성 뮤테이션
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderData) => {
      const response = await api.post('/api/orders/create', orderData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // 관련 쿼리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.myOrders(variables.buyerId) });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.receivedOrders(variables.sellerId) });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.unconfirmedOrders(variables.sellerId) });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.dashboard(variables.buyerId) });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.dashboard(variables.sellerId) });
    },
    onError: (error) => {
      console.error('Order creation failed:', error);
    },
  });
};

// 내가 발주한 주문 목록 조회
export const useMyOrders = (userId, searchRequest = {}) => {
  return useQuery({
    queryKey: ORDER_KEYS.myOrders(userId, searchRequest),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchRequest.orderStatus) {
        params.append('orderStatus', searchRequest.orderStatus);
      }
      if (searchRequest.startDate) {
        params.append('startDate', searchRequest.startDate);
      }
      if (searchRequest.endDate) {
        params.append('endDate', searchRequest.endDate);
      }
      
      const response = await api.get(`/api/orders/my-orders?${params.toString()}`);
      return response.data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2분
    cacheTime: 1000 * 60 * 10, // 10분
  });
};

// 내가 받은 주문 목록 조회
export const useReceivedOrders = (userId, searchRequest = {}) => {
  return useQuery({
    queryKey: ORDER_KEYS.receivedOrders(userId, searchRequest),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchRequest.orderStatus) {
        params.append('orderStatus', searchRequest.orderStatus);
      }
      if (searchRequest.startDate) {
        params.append('startDate', searchRequest.startDate);
      }
      if (searchRequest.endDate) {
        params.append('endDate', searchRequest.endDate);
      }
      
      const response = await api.get(`/api/orders/received-orders?${params.toString()}`);
      return response.data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2분
    cacheTime: 1000 * 60 * 10, // 10분
  });
};

// 미확인 주문 목록 조회
export const useUnconfirmedOrders = (userId) => {
  return useQuery({
    queryKey: ORDER_KEYS.unconfirmedOrders(userId),
    queryFn: async () => {
      const response = await api.get('/api/orders/unconfirmed-orders');
      return response.data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 1, // 1분 (실시간성이 중요)
    cacheTime: 1000 * 60 * 5, // 5분
    refetchInterval: 1000 * 60 * 2, // 2분마다 자동 갱신
  });
};

// 주문 상세 조회
export const useOrderDetail = (orderId) => {
  return useQuery({
    queryKey: ORDER_KEYS.orderDetail(orderId),
    queryFn: async () => {
      const response = await api.get(`/api/orders/${orderId}`);
      return response.data;
    },
    enabled: !!orderId,
    staleTime: 1000 * 60 * 5, // 5분
    cacheTime: 1000 * 60 * 15, // 15분
  });
};

// 주문 상태 업데이트 뮤테이션
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderId, orderStatus, deliveryMemo }) => {
      const response = await api.put(`/api/orders/${orderId}/status`, {
        orderStatus,
        deliveryMemo,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // 주문 상세 캐시 업데이트
      queryClient.invalidateQueries({ 
        queryKey: ORDER_KEYS.orderDetail(variables.orderId) 
      });
      
      // 관련 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.all });
    },
    onError: (error) => {
      console.error('Order status update failed:', error);
    },
  });
};

// 대시보드 데이터 조회
export const useDashboard = (userId) => {
  return useQuery({
    queryKey: ORDER_KEYS.dashboard(userId),
    queryFn: async () => {
      const response = await api.get('/api/dashboard');
      return response.data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5분
    cacheTime: 1000 * 60 * 15, // 15분
  });
};

// 주문 삭제 뮤테이션 (필요한 경우)
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderId) => {
      const response = await api.delete(`/api/orders/${orderId}`);
      return response.data;
    },
    onSuccess: () => {
      // 모든 주문 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.all });
    },
    onError: (error) => {
      console.error('Order deletion failed:', error);
    },
  });
};

// 대량 주문 상태 업데이트 뮤테이션
export const useBulkUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderIds, orderStatus }) => {
      const response = await api.put('/api/orders/bulk-status-update', {
        orderIds,
        orderStatus,
      });
      return response.data;
    },
    onSuccess: () => {
      // 모든 주문 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.all });
    },
    onError: (error) => {
      console.error('Bulk order status update failed:', error);
    },
  });
}; 