package com.sinsaflower.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sinsaflower.config.JwtConfig;
import com.sinsaflower.domain.user.User;
import com.sinsaflower.dto.LoginRequestDto;
import com.sinsaflower.dto.LoginResponseDto;
import com.sinsaflower.dto.SignupRequestDto;
import com.sinsaflower.repository.UserRepository;
import com.sinsaflower.service.JwtService;
import com.sinsaflower.service.UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
    controllers = UserController.class,
    excludeAutoConfiguration = {
        org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class,
        org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration.class
    },
    excludeFilters = {
        @ComponentScan.Filter(type = FilterType.REGEX, pattern = "com.sinsaflower.config.*"),
        @ComponentScan.Filter(type = FilterType.REGEX, pattern = "org.springframework.security.*")
    }
)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private JwtConfig jwtConfig;

    @MockBean
    private UserRepository userRepository;

    @Nested
    @DisplayName("회원가입 테스트")
    class SignupTest {
        @Test
        @DisplayName("회원가입 성공")
        void signup_success() throws Exception {
            // given
            SignupRequestDto request = SignupRequestDto.builder()
                    .userId("testUser")
                    .password("1234")
                    .name("홍길동")
                    .phoneNumber("01012345678")
                    .email("a@a.com")
                    .role("USER")
                    .build();

            // when & then
            mockMvc.perform(post("/api/auth/signup")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("회원가입이 완료되었습니다. 관리자 승인 후 로그인이 가능합니다."));
        }

        @Test
        @DisplayName("회원가입 실패 - 중복 아이디")
        void signup_fail_duplicate() throws Exception {
            // given
            SignupRequestDto request = SignupRequestDto.builder()
                    .userId("testUser")
                    .password("1234")
                    .name("홍길동")
                    .phoneNumber("01012345678")
                    .email("a@a.com")
                    .role("USER")
                    .build();

            doThrow(new IllegalArgumentException("이미 존재하는 아이디입니다."))
                    .when(userService).signupUser(any());

            // when & then
            mockMvc.perform(post("/api/auth/signup")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("잘못된 요청입니다."))
                    .andExpect(jsonPath("$.detail").value("이미 존재하는 아이디입니다."));
        }
    }

    @Nested
    @DisplayName("로그인 테스트")
    class LoginTest {
        @Test
        @DisplayName("로그인 성공")
        void login_success() throws Exception {
            // given
            LoginRequestDto request = new LoginRequestDto("testUser", "1234");
            LoginResponseDto response = LoginResponseDto.builder()
                    .userId("testUser")
                    .name("홍길동")
                    .phoneNumber("01012345678")
                    .role("USER")
                    .token("jwt-token")
                    .build();

            when(userService.login(any(), anyString())).thenReturn(response);

            // when & then
            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request))
                    .with(req -> {
                        req.setRemoteAddr("127.0.0.1");
                        return req;
                    }))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.userId").value("testUser"))
                    .andExpect(jsonPath("$.name").value("홍길동"))
                    .andExpect(jsonPath("$.phoneNumber").value("01012345678"))
                    .andExpect(jsonPath("$.role").value("USER"))
                    .andExpect(jsonPath("$.token").value("jwt-token"));
        }

        @Test
        @DisplayName("로그인 실패 - 존재하지 않는 아이디")
        void login_fail_nonexistent_user() throws Exception {
            // given
            LoginRequestDto request = new LoginRequestDto("nonexistent", "1234");

            when(userService.login(any(), anyString()))
                    .thenThrow(new IllegalArgumentException("존재하지 않는 아이디입니다."));

            // when & then
            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request))
                    .with(req -> {
                        req.setRemoteAddr("127.0.0.1");
                        return req;
                    }))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("잘못된 요청입니다."))
                    .andExpect(jsonPath("$.detail").value("존재하지 않는 아이디입니다."));
        }
    }
}