import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Grid,
  FormControlLabel,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

interface RegisterFormData {
  userId: string;
  password: string;
  passwordConfirm: string;
  name: string;
  phoneNumber: string;
  email: string;
  isMarketing: boolean;
  // BusinessInfo
  businessRegistrationNum?: string;
  corporationName?: string;
  ceoName?: string;
  businessType?: string;
  businessAddress?: string;
  faxNumber?: string;
  // AccountInfo
  accountNumber?: string;
  bankName?: string;
  accountHolder?: string;
  // DeliverySetting
  deliveryAreaInfo?: string;
  mainPhoneNumber?: string;
  mainMobileNumber?: string;
  handleFruitProducts?: boolean;
  handleCondolenceBasket?: boolean;
  expressDeliveryAvailable?: boolean;
  handleRoundFlowerArrangement?: boolean;
  blackGoldRibbonAvailable?: boolean;
  handleLargeExtraLarge?: boolean;
  handle4_5Tier?: boolean;
  handleBonsa?: boolean;
  holidayDeliveryAvailable?: boolean;
  nightDeliveryAvailable?: boolean;
}

const steps = ['기본 정보', '사업자 정보', '계좌 정보', '배송 설정'];

export default function Register() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<RegisterFormData>({
    userId: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phoneNumber: '',
    email: '',
    isMarketing: false,
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const response = await axios.post('/api/auth/register', data);
      return response.data;
    },
    onSuccess: () => {
      navigate('/login');
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || '회원가입에 실패했습니다.');
    },
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeStep === steps.length - 1) {
      if (formData.password !== formData.passwordConfirm) {
        setError('비밀번호가 일치하지 않습니다.');
        return;
      }
      registerMutation.mutate(formData);
    } else {
      handleNext();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="userId"
                label="아이디"
                value={formData.userId}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="비밀번호"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="passwordConfirm"
                label="비밀번호 확인"
                type="password"
                value={formData.passwordConfirm}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="name"
                label="이름"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="phoneNumber"
                label="전화번호"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="email"
                label="이메일"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="isMarketing"
                    checked={formData.isMarketing}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="마케팅 정보 수신에 동의합니다."
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="businessRegistrationNum"
                label="사업자등록번호"
                value={formData.businessRegistrationNum}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="corporationName"
                label="상호명"
                value={formData.corporationName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="ceoName"
                label="대표자명"
                value={formData.ceoName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="businessType"
                label="업종"
                value={formData.businessType}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="businessAddress"
                label="사업장 주소"
                value={formData.businessAddress}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="faxNumber"
                label="팩스번호"
                value={formData.faxNumber}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="accountNumber"
                label="계좌번호"
                value={formData.accountNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="bankName"
                label="은행명"
                value={formData.bankName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="accountHolder"
                label="예금주"
                value={formData.accountHolder}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="deliveryAreaInfo"
                label="배송 가능 지역"
                value={formData.deliveryAreaInfo}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="mainPhoneNumber"
                label="대표 전화번호"
                value={formData.mainPhoneNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="mainMobileNumber"
                label="대표 휴대폰번호"
                value={formData.mainMobileNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="handleFruitProducts"
                    checked={formData.handleFruitProducts}
                    onChange={handleChange}
                  />
                }
                label="과일 취급"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="handleCondolenceBasket"
                    checked={formData.handleCondolenceBasket}
                    onChange={handleChange}
                  />
                }
                label="근조바구니 취급"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="expressDeliveryAvailable"
                    checked={formData.expressDeliveryAvailable}
                    onChange={handleChange}
                  />
                }
                label="퀵배송 가능"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="handleRoundFlowerArrangement"
                    checked={formData.handleRoundFlowerArrangement}
                    onChange={handleChange}
                  />
                }
                label="원형화환 취급"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="blackGoldRibbonAvailable"
                    checked={formData.blackGoldRibbonAvailable}
                    onChange={handleChange}
                  />
                }
                label="검정/금색 리본 가능"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="handleLargeExtraLarge"
                    checked={formData.handleLargeExtraLarge}
                    onChange={handleChange}
                  />
                }
                label="대/특대 취급"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="handle4_5Tier"
                    checked={formData.handle4_5Tier}
                    onChange={handleChange}
                  />
                }
                label="4단/5단 취급"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="handleBonsa"
                    checked={formData.handleBonsa}
                    onChange={handleChange}
                  />
                }
                label="분재 취급"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="holidayDeliveryAvailable"
                    checked={formData.holidayDeliveryAvailable}
                    onChange={handleChange}
                  />
                }
                label="공휴일 배송 가능"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="nightDeliveryAvailable"
                    checked={formData.nightDeliveryAvailable}
                    onChange={handleChange}
                  />
                }
                label="야간 배송 가능"
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          회원가입
        </Typography>
        <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          {renderStepContent(activeStep)}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep !== 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                이전
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              disabled={registerMutation.isPending}
            >
              {activeStep === steps.length - 1
                ? registerMutation.isPending
                  ? '가입 중...'
                  : '가입하기'
                : '다음'}
            </Button>
          </Box>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Link component={RouterLink} to="/login" variant="body2">
            이미 계정이 있으신가요? 로그인
          </Link>
        </Box>
      </Box>
    </Container>
  );
} 