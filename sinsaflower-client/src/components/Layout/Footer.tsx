import { Box, Container, Grid, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              신사플라워
            </Typography>
            <Typography variant="body2" color="text.secondary">
              아름다운 순간을 함께하는 플라워 브랜드
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              고객센터
            </Typography>
            <Typography variant="body2" color="text.secondary">
              전화: 02-1234-5678
            </Typography>
            <Typography variant="body2" color="text.secondary">
              이메일: help@sinsaflower.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              운영시간: 평일 09:00 - 18:00
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              바로가기
            </Typography>
            <Link component={RouterLink} to="/about" color="text.secondary" display="block">
              회사소개
            </Link>
            <Link component={RouterLink} to="/terms" color="text.secondary" display="block">
              이용약관
            </Link>
            <Link component={RouterLink} to="/privacy" color="text.secondary" display="block">
              개인정보처리방침
            </Link>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link component={RouterLink} to="/" color="inherit">
              신사플라워
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
} 