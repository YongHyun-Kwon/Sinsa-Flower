import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

export default function Layout() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            신사화환
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {isAuthenticated ? (
              <>
                <Typography variant="body1" sx={{ alignSelf: 'center' }}>
                  {user?.name}님
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate('/login')}>
                  로그인
                </Button>
                <Button color="inherit" onClick={() => navigate('/signup')}>
                  회원가입
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
} 