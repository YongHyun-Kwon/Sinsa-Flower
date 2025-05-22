import { Box, Container, Typography, Button, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: '로맨틱 장미 꽃다발',
    description: '사랑과 감사의 마음을 전하는 로맨틱한 장미 꽃다발',
    image: '/images/bouquet1.jpg',
    price: '59,000원',
    category: 'bouquet',
  },
  {
    id: 2,
    name: '축하 3단 화환',
    description: '각종 축하의 자리를 빛내줄 고급스러운 3단 화환',
    image: '/images/wreath1.jpg',
    price: '150,000원',
    category: 'wreath',
  },
  {
    id: 3,
    name: '계절 꽃다발',
    description: '제철 꽃으로 구성된 신선하고 아름다운 꽃다발',
    image: '/images/bouquet2.jpg',
    price: '45,000원',
    category: 'bouquet',
  },
];

export default function Home() {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 10,
          pb: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            신사플라워
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            전국 꽃집과 구매자를 연결하는 믿을 수 있는 화환·꽃 중개 플랫폼
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" color="secondary" component={RouterLink} to="/bouquets">
              꽃집 찾기
            </Button>
            <Button variant="outlined" color="primary" component={RouterLink} to="/wreaths">
              화환 주문
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Shops/Products */}
      <Container sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }} maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom>
          추천 꽃집/화환
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card
                sx={{
                  width: 320,
                  minHeight: 340,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                  sx={{ objectFit: 'cover', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
                />
                <CardContent sx={{ flexGrow: 1, width: '100%', textAlign: 'center' }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {product.name}
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    {product.description} (입점 꽃집 제공)
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {product.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" gutterBottom>
            신사플라워만의 특별함
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  전국 꽃집 네트워크
                </Typography>
                <Typography color="text.secondary">
                  다양한 지역의 우수 꽃집과 연결해드립니다.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  믿을 수 있는 중개 서비스
                </Typography>
                <Typography color="text.secondary">
                  신사플라워가 검증한 꽃집만 입점, 안심하고 주문하세요.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  맞춤 주문 지원
                </Typography>
                <Typography color="text.secondary">
                  원하는 디자인, 예산에 맞는 꽃집을 쉽게 찾을 수 있습니다.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
} 