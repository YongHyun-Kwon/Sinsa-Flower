import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Chip,
  Alert,
  IconButton,
  Tooltip,
  Divider,
  CircularProgress,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { authService } from '../../services/authService';
import type { PendingUser } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { styled } from '@mui/material/styles';
import logoImage from '../../assets/logo.png';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  borderRadius: '20px',
}));

export default function UserApproval() {
  const navigate = useNavigate();
  const { refreshAuthState } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchPendingUsers = useCallback(async () => {
    try {
      setDataLoading(true);
      const users = await authService.getPendingUsers();
      setPendingUsers(users);
      setError(null);
    } catch (err) {
      console.error('승인 대기 중인 사용자 목록을 불러오는 데 실패했습니다.', err);
      setError('승인 대기 중인 사용자 목록을 불러오는 데 실패했습니다.');
    } finally {
      setDataLoading(false);
    }
  }, []);

  const checkAuth = useCallback(() => {
    console.log("UserApproval 페이지 - 인증 상태 확인 시작");
    
    // 인증 상태 새로고침
    const userData = refreshAuthState();
    
    if (!userData) {
      console.log("UserApproval 페이지 - 사용자 정보 없음, 로그인으로 리다이렉트");
      navigate('/login');
      return;
    }
    
    console.log("UserApproval 페이지 - 사용자 권한:", userData.role);
    
    // 관리자 권한 체크
    if (userData.role !== 'ADMIN') {
      console.log("UserApproval 페이지 - 관리자 권한 없음, 리다이렉트");
      navigate('/login');
      return;
    }
    
    // 권한 확인 완료
    setAuthorized(true);
    setLoading(false);
    
    // 데이터 로드
    fetchPendingUsers();
  }, [navigate, fetchPendingUsers]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleApprove = async (userId: string) => {
    try {
      await authService.approveUser(userId);
      setSuccessMessage(`사용자 ${userId}의 회원가입이 승인되었습니다.`);
      // 목록 새로고침
      setPendingUsers(pendingUsers.filter(user => user.userId !== userId));
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error('회원가입 승인 중 오류가 발생했습니다.', err);
      setError('회원가입 승인 중 오류가 발생했습니다.');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleRejectClick = (userId: string) => {
    setSelectedUserId(userId);
    setRejectReason('');
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (selectedUserId && rejectReason.trim()) {
      try {
        await authService.rejectUser(selectedUserId, rejectReason);
        setSuccessMessage(`사용자 ${selectedUserId}의 회원가입이 거절되었습니다.`);
        // 목록 새로고침
        setPendingUsers(pendingUsers.filter(user => user.userId !== selectedUserId));
        setTimeout(() => setSuccessMessage(null), 5000);
      } catch (err) {
        console.error('회원가입 거절 중 오류가 발생했습니다.', err);
        setError('회원가입 거절 중 오류가 발생했습니다.');
        setTimeout(() => setError(null), 5000);
      } finally {
        setRejectDialogOpen(false);
        setSelectedUserId(null);
      }
    }
  };

  const handleRejectCancel = () => {
    setRejectDialogOpen(false);
    setSelectedUserId(null);
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <StatusChip label="승인 대기중" color="warning" />;
      case 'ACTIVE':
        return <StatusChip label="활성화" color="success" />;
      case 'REJECTED':
        return <StatusChip label="거절됨" color="error" />;
      default:
        return <StatusChip label={status} />;
    }
  };

  // 로딩 중이거나 권한이 없으면 렌더링하지 않음
  if (loading || !authorized) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate('/admin')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={logoImage} alt="로고" width={60} height={60} />
          <Typography component="h1" variant="h4" sx={{ ml: 2 }}>
            회원가입 승인 관리
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden', borderRadius: 3 }}>
        <TableContainer>
          {dataLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
              <CircularProgress />
            </Box>
          ) : pendingUsers.length === 0 ? (
            <Box sx={{ p: 5, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                승인 대기 중인 회원가입 요청이 없습니다.
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>아이디</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>이름</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>연락처</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>가입유형</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>가입일시</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>상태</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>관리</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingUsers.map((user) => (
                  <TableRow key={user.userId} hover>
                    <TableCell>{user.userId}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.userType || '일반'}</TableCell>
                    <TableCell>{new Date(user.registrationDate).toLocaleString('ko-KR')}</TableCell>
                    <TableCell>{getStatusChip(user.status)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex' }}>
                        <Tooltip title="승인">
                          <IconButton
                            color="success"
                            onClick={() => handleApprove(user.userId)}
                            sx={{ mr: 1 }}
                          >
                            <CheckIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="거절">
                          <IconButton
                            color="error"
                            onClick={() => handleRejectClick(user.userId)}
                          >
                            <ClearIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Paper>

      {/* 거절 사유 입력 다이얼로그 */}
      <Dialog open={rejectDialogOpen} onClose={handleRejectCancel}>
        <DialogTitle>회원가입 거절 사유</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            회원가입을 거절하는 사유를 입력해주세요. 이 내용은 사용자에게 전달됩니다.
          </DialogContentText>
          <TextField
            autoFocus
            label="거절 사유"
            fullWidth
            multiline
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleRejectCancel} variant="outlined">
            취소
          </Button>
          <Button 
            onClick={handleRejectConfirm} 
            variant="contained" 
            color="error"
            disabled={!rejectReason.trim()}
          >
            거절하기
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 