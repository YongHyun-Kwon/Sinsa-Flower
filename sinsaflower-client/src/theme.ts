import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#F9F5E6', // 연한 베이지
      paper: '#FFFDF7',   // 카드 등
    },
    primary: {
      main: '#5A4327',    // 진한 브라운
      contrastText: '#FFF',
    },
    secondary: {
      main: '#E25A5A',    // 꽃의 빨강
    },
    text: {
      primary: '#5A4327', // 진한 브라운
      secondary: '#A67C52', // 밝은 브라운
    },
    info: { main: '#4A90E2' },    // 파랑
    warning: { main: '#F5C242' }, // 노랑
    success: { main: '#6FCF97' }, // 초록
    error: { main: '#B96DD1' },   // 보라
  },
  typography: {
    fontFamily: 'Pretendard, Noto Sans KR, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { borderRadius: 16, fontWeight: 600 },
  },
  shape: {
    borderRadius: 16, // 카드, 버튼 등 라운드
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 2px 8px rgba(90,67,39,0.06)',
        },
      },
    },
  },
});

export default theme; 