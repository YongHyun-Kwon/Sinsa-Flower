package com.sinsaflower.controller;

import com.sinsaflower.config.JwtConfig;
import com.sinsaflower.domain.user.User;
import com.sinsaflower.dto.LoginRequestDto;
import com.sinsaflower.dto.LoginResponseDto;
import com.sinsaflower.dto.SignupRequestDto;
import com.sinsaflower.dto.SuccessResponse;
import com.sinsaflower.dto.UserSummaryDto;
import com.sinsaflower.exception.ErrorResponse;
import com.sinsaflower.repository.UserRepository;
import com.sinsaflower.service.UserService;
import com.sinsaflower.service.JwtService;
import com.sinsaflower.util.IpUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final JwtService jwtService;
    private final JwtConfig jwtConfig;
    private final UserRepository userRepository;

    /**
     * 회원가입 API
     * @param request 회원가입 요청 DTO
     * @return 성공 메시지 또는 에러
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequestDto request) {
        try {
            userService.signupUser(request);
            return ResponseEntity.ok(new SuccessResponse("회원가입이 완료되었습니다. 관리자 승인 후 로그인이 가능합니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("잘못된 요청입니다.", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponse("서버 오류가 발생했습니다.", e.getMessage()));
        }
    }

    /**
     * 아이디 중복 확인 API
     * @param userId 확인할 아이디
     * @return 사용 가능 여부
     */
    @GetMapping("/check-userid")
    public ResponseEntity<?> checkUserId(@RequestParam("userId") String userId) {
        try {
            boolean available = !userRepository.existsByUserId(userId);
            return ResponseEntity.ok(Map.of("available", available));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponse("서버 오류가 발생했습니다.", e.getMessage()));
        }
    }

    /**
     * 로그인 API
     * @param request 로그인 요청 DTO
     * @param httpRequest HTTP 요청 객체 (IP 주소 추출용)
     * @return 로그인 성공 메시지 또는 에러
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto request, HttpServletRequest httpRequest) {
        try {
            String clientIp = IpUtil.getClientIp(httpRequest);
            LoginResponseDto response = userService.login(request, clientIp);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("잘못된 요청입니다.", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponse("서버 오류가 발생했습니다.", e.getMessage()));
        }
    }

    /**
     * 승인 대기 중인 사용자 목록 조회 API (관리자용)
     * @return 승인 대기 중인 사용자 목록
     */
    @GetMapping("/admin/pending-users")
    public ResponseEntity<?> getPendingUsers() {
        try {
            List<UserSummaryDto> pendingUsers = userService.getPendingUsers();
            return ResponseEntity.ok(pendingUsers);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("잘못된 요청입니다.", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponse("서버 오류가 발생했습니다.", e.getMessage()));
        }
    }

    /**
     * 회원가입 승인 API (관리자용)
     * @param userId 승인할 사용자 ID
     * @return 성공 메시지 또는 에러
     */
    @PostMapping("/admin/approve/{userId}")
    public ResponseEntity<?> approveUser(@PathVariable("userId") String userId) {
        try {
            userService.approveUser(userId);
            return ResponseEntity.ok(new SuccessResponse("회원가입이 승인되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("잘못된 요청입니다.", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponse("서버 오류가 발생했습니다.", e.getMessage()));
        }
    }

    /**
     * 회원가입 거절 API (관리자용)
     * @param userId 거절할 사용자 ID
     * @param reason 거절 사유
     * @return 성공 메시지 또는 에러
     */
    @PostMapping("/admin/reject/{userId}")
    public ResponseEntity<?> rejectUser(@PathVariable("userId") String userId, @RequestParam("reason") String reason) {
        try {
            userService.rejectUser(userId, reason);
            return ResponseEntity.ok(new SuccessResponse("회원가입이 거절되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("잘못된 요청입니다.", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponse("서버 오류가 발생했습니다.", e.getMessage()));
        }
    }

    /**
     * 토큰 재발급 API
     * @param request HTTP 요청 객체 (토큰 추출용)
     * @return 새로운 토큰
     */
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(HttpServletRequest request) {
        try {
            String token = request.getHeader(jwtConfig.getHeader()).substring(jwtConfig.getPrefix().length());
            String userId = jwtService.getUserIdFromToken(token);

            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

            String newToken = jwtService.generateToken(user);

            return ResponseEntity.ok(LoginResponseDto.builder()
                    .userId(user.getUserId())
                    .name(user.getName())
                    .phoneNumber(user.getPhone())
                    .role(user.getRole().name())
                    .token(newToken)
                    .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("잘못된 요청입니다.", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponse("서버 오류가 발생했습니다.", e.getMessage()));
        }
    }

    /**
     * 로그아웃 API
     * @param request HTTP 요청 객체 (토큰 추출용)
     * @return 성공 메시지
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        try {
            String token = request.getHeader(jwtConfig.getHeader()).substring(jwtConfig.getPrefix().length());
            // TODO: 토큰을 블랙리스트에 추가하거나 Redis에 저장하여 만료 처리
            return ResponseEntity.ok(new SuccessResponse("로그아웃되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("잘못된 요청입니다.", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponse("서버 오류가 발생했습니다.", e.getMessage()));
        }
    }
}