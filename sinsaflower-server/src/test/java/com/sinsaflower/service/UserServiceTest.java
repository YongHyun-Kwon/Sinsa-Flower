package com.sinsaflower.service;


import com.sinsaflower.domain.user.User;
import com.sinsaflower.domain.user.User.Role;
import com.sinsaflower.domain.user.User.UserStatus;
import com.sinsaflower.dto.LoginRequestDto;
import com.sinsaflower.dto.LoginResponseDto;
import com.sinsaflower.dto.SignupRequestDto;
import com.sinsaflower.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock private UserRepository userRepository;
    @Mock private BusinessInfoService businessInfoService;
    @Mock private AccountInfoService accountInfoService;
    @Mock private DeliverySettingService deliverySettingService;
    @Mock private JwtService jwtService;
    @Mock private BCryptPasswordEncoder passwordEncoder;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Nested
    @DisplayName("회원가입 테스트")
    class SignupTest {

        @Test
        @DisplayName("회원가입 성공")
        void signupSuccess() {
            // given
            SignupRequestDto request = SignupRequestDto.builder()
                    .userId("testUser")
                    .password("password123")
                    .name("홍길동")
                    .phoneNumber("01012345678")
                    .email("test@example.com")
                    .role("USER")
                    .phoneVerified(true)
                    .isMarketing(false)
                    .userType("NORMAL")
                    .build();

            when(userRepository.existsByUserId("testUser")).thenReturn(false);
            when(userRepository.existsByPhone("01012345678")).thenReturn(false);
            when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");

            // when
            userService.signupUser(request);

            // then
            verify(userRepository).save(any(User.class));
            verify(businessInfoService).createBusinessInfo(any(), eq(request));
            verify(accountInfoService).createAccountInfo(any(), eq(request));
            verify(deliverySettingService).createDeliverySetting(any(), eq(request));
        }

        @Test
        @DisplayName("회원가입 실패 - 중복 아이디")
        void signupFailDuplicateUserId() {
            // given
            SignupRequestDto request = SignupRequestDto.builder()
                    .userId("testUser")
                    .password("password123")
                    .name("홍길동")
                    .phoneNumber("01012345678")
                    .email("test@example.com")
                    .role("USER")
                    .build();

            when(userRepository.existsByUserId("testUser")).thenReturn(true);

            // expect
            assertThatThrownBy(() -> userService.signupUser(request))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("이미 사용중인 아이디입니다.");
        }
    }

    @Nested
    @DisplayName("로그인 테스트")
    class LoginTest {

        @Test
        @DisplayName("로그인 성공")
        void loginSuccess() {
            // given
            LoginRequestDto request = new LoginRequestDto("testUser", "password123");
            User user = User.builder()
                    .userId("testUser")
                    .password("encodedPassword")
                    .role(Role.USER)
                    .status(UserStatus.ACTIVE)
                    .isWithdrawn(false)
                    .isDormant(false)
                    .loginAttempts(0)
                    .build();

            when(userRepository.findByUserId("testUser")).thenReturn(Optional.of(user));
            when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);
            when(jwtService.generateToken(user)).thenReturn("mockToken");

            // when
            LoginResponseDto response = userService.login(request, "127.0.0.1");

            // then
            assertThat(response.getUserId()).isEqualTo("testUser");
            assertThat(response.getRole()).isEqualTo("USER");
            assertThat(response.getToken()).isEqualTo("mockToken");
        }

        @Test
        @DisplayName("로그인 실패 - 잘못된 비밀번호")
        void loginFailWrongPassword() {
            // given
            LoginRequestDto request = new LoginRequestDto("testUser", "wrongPassword");
            User user = User.builder()
                    .userId("testUser")
                    .password("encodedPassword")
                    .role(Role.USER)
                    .status(UserStatus.ACTIVE)
                    .isWithdrawn(false)
                    .isDormant(false)
                    .loginAttempts(0)
                    .build();

            when(userRepository.findByUserId("testUser")).thenReturn(Optional.of(user));
            when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

            // expect
            assertThatThrownBy(() -> userService.login(request, "127.0.0.1"))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("비밀번호가 일치하지 않습니다.");
        }

        @Test
        @DisplayName("로그인 실패 - 존재하지 않는 사용자")
        void loginFailNoUser() {
            // given
            LoginRequestDto request = new LoginRequestDto("nonexistent", "password");

            when(userRepository.findByUserId("nonexistent")).thenReturn(Optional.empty());

            // expect
            assertThatThrownBy(() -> userService.login(request, "127.0.0.1"))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("존재하지 않는 아이디입니다.");
        }
    }
}