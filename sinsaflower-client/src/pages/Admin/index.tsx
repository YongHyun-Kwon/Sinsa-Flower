import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useAuth } from '../../contexts/AuthContext';
import logoImage from '../../assets/logo.png';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(90,67,39,0.1)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  fontSize: '3rem',
}));

export default function Admin() {
  const navigate = useNavigate();
  const { isAuthenticated, refreshAuthState } = useAuth();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const checkAuth = useCallback(() => {
    console.log("Admin 페이지 - 인증 상태 확인 시작");
    
    // 인증 상태 새로고침
    const userData = refreshAuthState();
    
    if (!userData) {
      console.log("Admin 페이지 - 사용자 정보 없음, 로그인으로 리다이렉트");
      navigate('/login');
      return;
    }
    
    console.log("Admin 페이지 - 사용자 권한:", userData.role);
    
    // 관리자 권한 체크
    if (userData.role !== 'ADMIN') {
      console.log("Admin 페이지 - 관리자 권한 없음, 리다이렉트");
      navigate('/login');
      return;
    }
    
    // 권한 확인 완료
    setAuthorized(true);
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 로딩 중이거나 권한이 없으면 렌더링하지 않음
  if (loading || !authorized) {
    return null;
  }

  const adminFeatures = [
    {
      title: '회원가입 승인',
      description: '새로운 회원가입 요청을 승인하거나 거절합니다.',
      icon: <PersonAddIcon fontSize="inherit" color="primary" />,
      path: '/admin/user-approval'
    },
    {
      title: '상품 관리',
      description: '상품을 등록, 수정, 삭제합니다.',
      icon: <LocalFloristIcon fontSize="inherit" color="secondary" />,
      path: '/admin/products'
    },
    {
      title: '주문 관리',
      description: '주문을 조회하고 상태를 변경합니다.',
      icon: <InventoryIcon fontSize="inherit" color="info" />,
      path: '/admin/orders'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <img src={logoImage} alt="로고" style={{ width: 120, height: 120 }} />
        </Box>
        <Typography component="h1" variant="h3" sx={{ mb: 1 }}>
          관리자 페이지
        </Typography>
        <Typography color="text.secondary">
          신사플라워 관리자 기능을 이용할 수 있습니다.
        </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={4}>
        {adminFeatures.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <FeatureCard>
              <CardContent sx={{ flexGrow: 1 }}>
                <IconWrapper>
                  {feature.icon}
                </IconWrapper>
                <Typography variant="h5" component="h2" gutterBottom align="center">
                  {feature.title}
                </Typography>
                <Typography color="text.secondary" align="center">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button 
                  component={Link} 
                  to={feature.path} 
                  variant="contained" 
                  size="large"
                  sx={{ minWidth: 140 }}
                >
                  바로가기
                </Button>
              </CardActions>
            </FeatureCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
} 