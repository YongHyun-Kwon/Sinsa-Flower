import { QueryClient } from '@tanstack/react-query';

/**
 * React Query 클라이언트 설정
 * - 캐싱 전략 최적화
 * - 에러 처리 표준화
 * - 재시도 로직 설정
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 기본 stale time: 5분
      staleTime: 1000 * 60 * 5,
      
      // 기본 cache time: 10분
      cacheTime: 1000 * 60 * 10,
      
      // 실패 시 3번까지 재시도
      retry: (failureCount, error) => {
        // 4xx 에러는 재시도하지 않음
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      
      // 재시도 간격: 지수 백오프
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // 백그라운드에서 자동 재검증 비활성화 (필요한 경우에만 수동으로)
      refetchOnWindowFocus: false,
      
      // 네트워크 재연결 시 자동 재검증
      refetchOnReconnect: true,
      
      // 컴포넌트 마운트 시 자동 재검증 비활성화
      refetchOnMount: false,
    },
    mutations: {
      // 뮤테이션 실패 시 1번만 재시도
      retry: 1,
      
      // 재시도 간격: 1초
      retryDelay: 1000,
    },
  },
});

export default queryClient; 