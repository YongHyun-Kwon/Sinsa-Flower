import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Link,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAuth } from '../../contexts/AuthContext';
import logoImage from '../../assets/logo.png';

const pages = [
  { name: '홈', path: '/' },
  { name: '꽃다발', path: '/bouquets' },
  { name: '화환', path: '/wreaths' },
];

export default function Header() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const { user, isAuthenticated } = useAuth();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop Logo */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 2, alignItems: 'center' }}>
            <RouterLink to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img src={logoImage} alt="Logo" style={{ width: 50, height: 50 }} />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  ml: 1,
                  fontWeight: 700,
                  color: 'primary.main',
                  textDecoration: 'none',
                }}
              >
                신사플라워
              </Typography>
            </RouterLink>
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="메뉴 열기"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu} component={RouterLink} to={page.path}>
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
              {isAuthenticated && user?.role === 'ADMIN' && (
                <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/admin">
                  <Typography textAlign="center">관리자</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>

          {/* Mobile Logo */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            <RouterLink to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img src={logoImage} alt="Logo" style={{ width: 40, height: 40 }} />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  ml: 1,
                  fontWeight: 700,
                  color: 'primary.main',
                  textDecoration: 'none',
                }}
              >
                신사플라워
              </Typography>
            </RouterLink>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={RouterLink}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'text.primary', display: 'block' }}
              >
                {page.name}
              </Button>
            ))}
            {isAuthenticated && user?.role === 'ADMIN' && (
              <Button
                component={RouterLink}
                to="/admin"
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'primary.main', display: 'flex', alignItems: 'center' }}
                startIcon={<AdminPanelSettingsIcon />}
              >
                관리자
              </Button>
            )}
          </Box>

          {/* Auth Buttons */}
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 2 }}>
                  {user?.name}님
                </Typography>
                <Button
                  component={RouterLink}
                  to="/logout"
                  variant="outlined"
                >
                  로그아웃
                </Button>
              </Box>
            ) : (
              <>
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{ textDecoration: 'none', color: 'text.primary', mr: 2 }}
                >
                  로그인
                </Link>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  sx={{ color: 'white' }}
                >
                  회원가입
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
} 