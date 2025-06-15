import React from 'react';
import { Container, Typography, Box, Card, CardContent, Grid } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ color: '#8B4513', fontWeight: 'bold' }}>
          🌸 신사화환
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          화환 판매자와 고객을 연결하는 플랫폼
        </Typography>
        {isAuthenticated && (
          <Typography variant="h6" sx={{ mt: 2, color: '#8B4513' }}>
            안녕하세요, {user?.name || user?.email}님!
          </Typography>
        )}
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', border: '2px solid #F5DEB3' }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="h4" sx={{ mb: 2 }}>
                🏪
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ color: '#8B4513' }}>
                화환 판매업체
              </Typography>
              <Typography variant="body1" color="text.secondary">
                전국의 다양한 화환 판매업체들이 등록되어 있습니다. 
                품질 좋은 화환을 합리적인 가격에 만나보세요.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', border: '2px solid #F5DEB3' }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="h4" sx={{ mb: 2 }}>
                🚚
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ color: '#8B4513' }}>
                빠른 배송
              </Typography>
              <Typography variant="body1" color="text.secondary">
                주문 후 신속한 제작과 배송으로 
                중요한 순간을 놓치지 않도록 도와드립니다.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', border: '2px solid #F5DEB3' }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="h4" sx={{ mb: 2 }}>
                💝
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ color: '#8B4513' }}>
                맞춤 서비스
              </Typography>
              <Typography variant="body1" color="text.secondary">
                고객의 요구사항에 맞는 맞춤형 화환 제작 서비스를 
                제공합니다.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {!isAuthenticated && (
        <Box sx={{ textAlign: 'center', mt: 6, p: 4, backgroundColor: '#FFFEF7', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#8B4513' }}>
            지금 바로 시작하세요!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            화환 판매업체라면 회원가입하여 더 많은 고객을 만나보세요.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Home; 