import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#8B4513' }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            cursor: 'pointer',
            fontWeight: 'bold',
            color: '#F5DEB3'
          }}
          onClick={() => navigate('/')}
        >
          🌸 신사화환
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          {!isAuthenticated ? (
            <>
              <Button 
                color="inherit" 
                onClick={() => navigate('/login')}
                sx={{ color: '#F5DEB3' }}
              >
                로그인
              </Button>
              <Button 
                color="inherit" 
                onClick={() => navigate('/register')}
                sx={{ color: '#F5DEB3' }}
              >
                회원가입
              </Button>
            </>
          ) : (
            <>
              <Typography 
                variant="body2" 
                sx={{ 
                  alignSelf: 'center', 
                  color: '#F5DEB3',
                  marginRight: 1
                }}
              >
                {user?.name || user?.email}님 환영합니다
              </Typography>
              
              {isAdmin && (
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/admin-dashboard')}
                  sx={{ color: '#F5DEB3' }}
                >
                  관리자
                </Button>
              )}
              
              <Button 
                color="inherit" 
                onClick={handleLogout}
                sx={{ color: '#F5DEB3' }}
              >
                로그아웃
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 