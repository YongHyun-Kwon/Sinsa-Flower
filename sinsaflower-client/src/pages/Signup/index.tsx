import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { authService } from '../../services/authService';
import type { SignupRequest } from '../../services/authService';
import axios, { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
  detail?: string;
}

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupRequest>({
    userId: '',
    password: '',
    name: '',
    phoneNumber: '',
    email: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.register(formData);
      setSuccess('회원가입이 완료되었습니다. 관리자 승인 후 로그인이 가능합니다.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || '회원가입에 실패했습니다.');
      } else {
        setError('회원가입에 실패했습니다.');
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5">
            회원가입
          </Typography>
          {error && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
              {success}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="userId"
              label="아이디"
              name="userId"
              autoComplete="username"
              autoFocus
              value={formData.userId}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="name"
              label="이름"
              id="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="phoneNumber"
              label="전화번호"
              id="phoneNumber"
              autoComplete="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="이메일"
              id="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              회원가입
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/login')}
            >
              로그인으로 돌아가기
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 