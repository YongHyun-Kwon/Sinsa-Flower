import { Box, Container, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function NotFound() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          페이지를 찾을 수 없습니다
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
        >
          홈으로 돌아가기
        </Button>
      </Box>
    </Container>
  );
} 