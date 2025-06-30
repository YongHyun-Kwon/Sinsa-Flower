import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import queryClient from './lib/queryClient';
import { AuthProvider } from './contexts/AuthContext';
import { PageLoader } from './components/LoadingSpinner';

// 라우트 기반 코드 스플리팅을 위한 동적 임포트
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const AdminMemberApproval = React.lazy(() => import('./pages/Admin/AdminMemberApproval'));
const AdminMain = React.lazy(() => import('./pages/Admin/AdminMain'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const FindPassword = React.lazy(() => import('./pages/FindPassword'));
const FindId = React.lazy(() => import('./pages/FindId'));
const Notice = React.lazy(() => import('./pages/Notice'));
const OrderForm = React.lazy(() => import('./pages/OrderForm'));
const OrderPrintPreview = React.lazy(() => import('./pages/OrderPrintPreview'));
const AllOrders = React.lazy(() => import('./pages/AllOrders'));
const AllReceivedOrders = React.lazy(() => import('./pages/AllReceivedOrders'));
const UnconfirmedOrders = React.lazy(() => import('./pages/UnconfirmedOrders'));
const MemberSearch = React.lazy(() => import('./pages/MemberSearch'));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/find-password" element={<FindPassword />} />
                <Route path="/find-id" element={<FindId />} />
                <Route path="/notice" element={<Notice />} />
                <Route path="/admin-member-approval" element={<AdminMemberApproval />} />
                <Route path="/admin-dashboard" element={<AdminMain />} />
                
                {/* 주문 관련 라우트 */}
                <Route path="/order-form" element={<OrderForm />} />
                <Route path="/order-print-preview" element={<OrderPrintPreview />} />
                <Route path="/all-orders" element={<AllOrders />} />
                <Route path="/all-received-orders" element={<AllReceivedOrders />} />
                <Route path="/unconfirmed-orders" element={<UnconfirmedOrders />} />
                <Route path="/member-search" element={<MemberSearch />} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </AuthProvider>
      
      {/* 개발 환경에서만 React Query DevTools 표시 */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

export default App;
