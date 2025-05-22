package com.sinsaflower.service;

import com.sinsaflower.domain.user.*;
import com.sinsaflower.dto.LoginRequestDto;
import com.sinsaflower.dto.SignupRequestDto;
import com.sinsaflower.dto.LoginResponseDto;
import com.sinsaflower.dto.UserSummaryDto;
import com.sinsaflower.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BusinessInfoService businessInfoService;
    private final AccountInfoService accountInfoService;
    private final DeliverySettingService deliverySettingService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final int ACCOUNT_LOCK_MINUTES = 30;

    /**
     * 회원가입 서비스
     * @param dto 회원가입 요청 DTO
     */
    @Transactional
    public void signupUser(SignupRequestDto dto) {
        // 1. 아이디/전화번호 중복 체크
        if (userRepository.existsByUserId(dto.getUserId())) {
            throw new IllegalArgumentException("이미 사용중인 아이디입니다.");
        }
        if (userRepository.existsByPhone(dto.getPhoneNumber())) {
            throw new IllegalArgumentException("이미 사용중인 전화번호입니다.");
        }

        // 2. 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(dto.getPassword());

        // 3. User 엔티티 생성 및 저장 (상태: PENDING)
        User user = User.builder()
                .userId(dto.getUserId())
                .name(dto.getName())
                .phone(dto.getPhoneNumber())
                .password(encodedPassword)
                .profileImage(dto.getProfileImage())
                .userType(dto.getUserType())
                .status(User.UserStatus.PENDING)
                .phoneVerified(dto.getPhoneVerified())
                .isMarketing(dto.getIsMarketing())
                .role(User.Role.valueOf(dto.getRole()))
                .isWithdrawn(false)
                .isDormant(false)
                .createdAt(java.time.LocalDateTime.now())
                .updatedAt(java.time.LocalDateTime.now())
                .registrationDate(java.time.LocalDateTime.now())
                .build();
        userRepository.save(user);

        // 4. 각 도메인별 서비스 호출
        businessInfoService.createBusinessInfo(user, dto);
        accountInfoService.createAccountInfo(user, dto);
        deliverySettingService.createDeliverySetting(user, dto);
    }

    /**
     * 로그인 서비스
     * @param dto 로그인 요청 DTO
     * @param clientIp 클라이언트 IP
     * @return 로그인 응답 DTO (사용자 정보 + JWT 토큰)
     */
    @Transactional
    public LoginResponseDto login(LoginRequestDto dto, String clientIp) {
        User user = userRepository.findByUserId(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 아이디입니다."));

        // 계정 상태 확인
        if (user.getStatus() != User.UserStatus.ACTIVE) {
            throw new IllegalArgumentException("승인되지 않은 계정입니다.");
        }

        // 탈퇴한 계정 확인
        if (user.getIsWithdrawn()) {
            throw new IllegalArgumentException("탈퇴한 계정입니다.");
        }

        // 휴면 계정 확인
        if (user.getIsDormant()) {
            throw new IllegalArgumentException("휴면 상태인 계정입니다.");
        }

        // 계정 잠금 확인
        if (user.isAccountLocked()) {
            throw new IllegalArgumentException("계정이 잠겨있습니다. " + 
                user.getAccountLockedUntil() + " 이후에 다시 시도해주세요.");
        }

        // 비밀번호 확인
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            user.incrementLoginAttempts();
            userRepository.save(user);  // 로그인 시도 횟수 증가 저장
            
            // 로그인 시도 횟수 초과 시 계정 잠금
            if (user.getLoginAttempts() >= MAX_LOGIN_ATTEMPTS) {
                user.lockAccount(ACCOUNT_LOCK_MINUTES);
                userRepository.save(user);  // 계정 잠금 상태 저장
                throw new IllegalArgumentException("로그인 시도 횟수를 초과했습니다. " + 
                    ACCOUNT_LOCK_MINUTES + "분 후에 다시 시도해주세요.");
            }
            
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 로그인 성공 시 처리
        user.resetLoginAttempts();
        user.setLastLogin(java.time.LocalDateTime.now());
        user.setLastLoginIp(clientIp);
        userRepository.save(user);  // 로그인 정보 업데이트 저장
        
        // JWT 토큰 생성
        String token = jwtService.generateToken(user);
        
        return LoginResponseDto.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .role(user.getRole().name())
                .token(token)
                .build();
    }

    /**
     * 승인 대기 중인 사용자 목록 조회
     * @return 승인 대기 중인 사용자 목록
     */
    @Transactional(readOnly = true)
    public List<UserSummaryDto> getPendingUsers() {
        List<User> pendingUsers = userRepository.findByStatus(User.UserStatus.PENDING);
        return pendingUsers.stream()
                .map(UserSummaryDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 회원가입 승인
     * @param userId 승인할 사용자 ID
     */
    @Transactional
    public void approveUser(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        if (user.getStatus() != User.UserStatus.PENDING) {
            throw new IllegalArgumentException("승인 대기 상태가 아닌 사용자입니다.");
        }

        user.setStatus(User.UserStatus.ACTIVE);
        user.setUpdatedAt(java.time.LocalDateTime.now());
        userRepository.save(user);  // 상태 변경 저장
    }

    /**
     * 회원가입 거절
     * @param userId 거절할 사용자 ID
     * @param reason 거절 사유
     */
    @Transactional
    public void rejectUser(String userId, String reason) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        if (user.getStatus() != User.UserStatus.PENDING) {
            throw new IllegalArgumentException("승인 대기 상태가 아닌 사용자입니다.");
        }

        user.setStatus(User.UserStatus.REJECTED);
        user.setUpdatedAt(java.time.LocalDateTime.now());
        userRepository.save(user);  // 상태 변경 저장
        // TODO: 거절 사유 저장 및 알림 발송
    }
} 