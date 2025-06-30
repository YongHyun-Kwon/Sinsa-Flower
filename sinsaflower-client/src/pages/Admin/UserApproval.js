import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  IconButton,
  Collapse
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  ExpandMore,
  ExpandLess,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';

const UserApproval = () => {
  const navigate = useNavigate();
  const { user, isAdmin, refreshAuthState, loading: authLoading } = useAuth();
  
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // 거부 다이얼로그 상태
  const [rejectDialog, setRejectDialog] = useState({
    open: false,
    userId: null,
    userName: '',
    reason: ''
  });
  
  // 사용자 상세 정보 표시 상태
  const [expandedUsers, setExpandedUsers] = useState(new Set());

  // 권한 체크
  useEffect(() => {
    if (!authLoading) {
      const currentUser = refreshAuthState();
      if (!currentUser || currentUser.role !== 'ADMIN') {
        navigate('/login');
        return;
      }
    }
  }, [authLoading, navigate, refreshAuthState]);

  // 대기 중인 사용자 목록 조회
  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('UserApproval: 대기 중인 사용자 목록 조회 시작');
      
      const users = await authService.getPendingUsers();
      console.log('UserApproval: 조회된 사용자 목록:', users);
      
      setPendingUsers(users);
    } catch (error) {
      console.error('UserApproval: 사용자 목록 조회 실패:', error);
      setError('사용자 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && !authLoading) {
      fetchPendingUsers();
    }
  }, [isAdmin, authLoading]);

  // 사용자 승인
  const handleApprove = async (userId, userName) => {
    try {
      console.log('UserApproval: 사용자 승인 시작:', { userId, userName });
      const response = await authService.approveUser(userId);
      
      // 백엔드 응답의 message 사용
      setSuccess(response.message || `${userName}님의 가입을 승인했습니다.`);
      fetchPendingUsers(); // 목록 새로고침
      
      // 성공 메시지 3초 후 자동 제거
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('UserApproval: 사용자 승인 실패:', error);
      setError(error.response?.data?.message || '사용자 승인에 실패했습니다.');
    }
  };

  // 사용자 거부
  const handleReject = async () => {
    try {
      console.log('UserApproval: 사용자 거부 시작:', rejectDialog);
      const response = await authService.rejectUser(rejectDialog.userId, rejectDialog.reason);
      
      // 백엔드 응답의 message 사용
      setSuccess(response.message || `${rejectDialog.userName}님의 가입을 거부했습니다.`);
      setRejectDialog({ open: false, userId: null, userName: '', reason: '' });
      fetchPendingUsers(); // 목록 새로고침
      
      // 성공 메시지 3초 후 자동 제거
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('UserApproval: 사용자 거부 실패:', error);
      setError(error.response?.data?.message || '사용자 거부에 실패했습니다.');
    }
  };

  // 거부 다이얼로그 열기
  const openRejectDialog = (userId, userName) => {
    setRejectDialog({
      open: true,
      userId,
      userName,
      reason: ''
    });
  };

  // 거부 다이얼로그 닫기
  const closeRejectDialog = () => {
    setRejectDialog({ open: false, userId: null, userName: '', reason: '' });
  };

  // 사용자 상세 정보 토글
  const toggleUserDetails = (userId) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  // 로딩 중이거나 권한 확인 중일 때
  if (authLoading || !user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>로딩 중...</Typography>
      </Container>
    );
  }

  // 관리자가 아닌 경우
  if (!isAdmin) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          관리자 권한이 필요합니다.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate('/admin')}
          sx={{ mr: 2, color: '#8B4513' }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ color: '#8B4513', fontWeight: 'bold' }}>
          👥 사용자 승인 관리
        </Typography>
      </Box>

      {/* 알림 메시지 */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* 메인 콘텐츠 */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ color: '#8B4513' }}>
              승인 대기 중인 화환 판매업체
            </Typography>
            <Button
              variant="outlined"
              onClick={fetchPendingUsers}
              disabled={loading}
              sx={{ 
                borderColor: '#8B4513', 
                color: '#8B4513',
                '&:hover': {
                  borderColor: '#654321',
                  backgroundColor: '#F5DEB3'
                }
              }}
            >
              {loading ? <CircularProgress size={20} /> : '새로고침'}
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>대기 중인 사용자를 불러오는 중...</Typography>
            </Box>
          ) : pendingUsers.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                승인 대기 중인 사용자가 없습니다.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                새로운 가입 신청이 있으면 여기에 표시됩니다.
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#F5DEB3' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>업체명</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>이메일</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>연락처</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>가입일</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>상태</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">작업</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">상세</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingUsers.map((user) => (
                    <React.Fragment key={user.id}>
                      <TableRow>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.contactNumber}</TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label="대기중" 
                            color="warning" 
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              startIcon={<CheckCircle />}
                              onClick={() => handleApprove(user.id, user.name)}
                              sx={{ minWidth: '80px' }}
                            >
                              승인
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              startIcon={<Cancel />}
                              onClick={() => openRejectDialog(user.id, user.name)}
                              sx={{ minWidth: '80px' }}
                            >
                              거부
                            </Button>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={() => toggleUserDetails(user.id)}
                            sx={{ color: '#8B4513' }}
                          >
                            {expandedUsers.has(user.id) ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      
                      {/* 상세 정보 행 */}
                      <TableRow>
                        <TableCell colSpan={7} sx={{ paddingTop: 0, paddingBottom: 0 }}>
                          <Collapse 
                            in={expandedUsers.has(user.id)} 
                            timeout="auto" 
                            unmountOnExit
                          >
                            <Box sx={{ margin: 2, padding: 2, backgroundColor: '#FFFEF7', borderRadius: 1 }}>
                              <Typography variant="subtitle2" gutterBottom sx={{ color: '#8B4513', fontWeight: 'bold' }}>
                                상세 정보
                              </Typography>
                              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
                                <Box>
                                  <Typography variant="body2"><strong>사업자 등록번호:</strong> {user.businessNumber}</Typography>
                                  <Typography variant="body2"><strong>사업장 주소:</strong> {user.businessAddress}</Typography>
                                </Box>
                                <Box>
                                  <Typography variant="body2"><strong>은행:</strong> {user.bankName}</Typography>
                                  <Typography variant="body2"><strong>계좌번호:</strong> {user.accountNumber}</Typography>
                                  <Typography variant="body2"><strong>예금주:</strong> {user.accountHolderName}</Typography>
                                </Box>
                                <Box>
                                  <Typography variant="body2"><strong>배송 지역:</strong> {user.deliveryArea}</Typography>
                                  <Typography variant="body2"><strong>최소 주문 금액:</strong> {user.minOrderAmount?.toLocaleString()}원</Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* 거부 사유 입력 다이얼로그 */}
      <Dialog 
        open={rejectDialog.open} 
        onClose={closeRejectDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#8B4513' }}>
          가입 거부 사유 입력
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>{rejectDialog.userName}</strong>님의 가입을 거부하는 사유를 입력해주세요.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="거부 사유"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={rejectDialog.reason}
            onChange={(e) => setRejectDialog({ ...rejectDialog, reason: e.target.value })}
            placeholder="예: 사업자 등록번호 확인 불가, 부적절한 업체 정보 등"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRejectDialog} sx={{ color: '#666' }}>
            취소
          </Button>
          <Button 
            onClick={handleReject} 
            variant="contained" 
            color="error"
            disabled={!rejectDialog.reason.trim()}
          >
            거부 확정
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserApproval; 