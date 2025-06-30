package com.sinsaflower.domain.user;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // id

    @Column(nullable = false, unique = true, length = 80)
    private String userId; // user_id

    @Column(nullable = false, length = 40)
    private String name; // name

    @Column(nullable = false, length = 40)
    private String phone; // phone

    @Column(nullable = false, length = 100)
    private String password; // password

    @Column(length = 255)
    private String profileImage; // profile_image

    @Column(length = 40)
    private String userType; // user_type

    @Column
    private LocalDateTime registrationDate; // registration_date

    @Column
    private LocalDateTime lastLogin; // last_login

    @Column
    private Boolean phoneVerified; // phone_verified

    @Column
    private Boolean isMarketing; // is_marketing

    @Column(length = 255)
    private String businessId;

    @Column(length = 255)
    private String memberName;

    @Column(length = 255)
    private String boardNickname;

    @Column(length = 255)
    private String deliveryAreaInfo;

    @Column(length = 255)
    private String memberActualAddress;

    @Column(length = 40)
    private String mainPhoneNumber;

    @Column(length = 40)
    private String mainMobileNumber;

    @Column(length = 40)
    private String ceoName;

    @Column(length = 40)
    private String faxNumber;

    @Column(length = 40)
    private String accountNumber;

    @Column(length = 40)
    private String virtualAccount;

    @Column(length = 40)
    private String businessRegistrationNum;

    @Column(length = 255)
    private String corporationName;

    @Column(length = 40)
    private String businessType;

    @Column(length = 255)
    private String ceoFullName;

    @Column(length = 255)
    private String businessAddress;

    @Column(length = 255)
    private String businessRegistrationCert;

    @Column(length = 255)
    private String faxSettings;

    @Column(length = 255)
    private String smsSettings;

    @Column
    private Boolean autoProductRegister;

    @Column
    private Boolean handleFruitProducts;

    @Column
    private Boolean handleCondolenceBasket;

    @Column
    private Boolean expressDeliveryAvailable;

    @Column
    private Boolean handleRoundFlowerArrangement;

    @Column
    private Boolean blackGoldRibbonAvailable;

    @Column
    private Boolean handleLargeExtraLarge;

    @Column
    private Boolean handle4_5Tier;

    @Column
    private Boolean handleBonsa;

    @Column
    private Boolean holidayDeliveryAvailable;

    @Column
    private Boolean nightDeliveryAvailable;

    @Column(length = 255)
    private String businessHours;

    @Column(length = 255)
    private String bankAccountCopy;

    // 지역별 검색을 위한 필드들 추가
    @Column(length = 20)
    private String businessProvince; // 사업장 광역시도 (예: 서울특별시, 경기도)
    
    @Column(length = 20)  
    private String businessCity; // 사업장 시군구 (예: 강남구, 분당구)
    
    @Column(length = 20)
    private String actualProvince; // 실제 주소 광역시도
    
    @Column(length = 20)
    private String actualCity; // 실제 주소 시군구

    // 공통 필드
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt; // created_at

    @Column(nullable = false)
    private LocalDateTime updatedAt; // updated_at

    // 탈퇴/휴면
    @Column(nullable = false)
    private Boolean isWithdrawn = false; // is_withdrawn

    @Column(nullable = false)
    private Boolean isDormant = false; // is_dormant

    // 권한
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.USER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserStatus status = UserStatus.PENDING; // 기본값 PENDING

    @Column
    private Integer loginAttempts = 0; // 로그인 시도 횟수

    @Column
    private LocalDateTime lastLoginAttempt; // 마지막 로그인 시도 시간

    @Column
    private String lastLoginIp; // 마지막 로그인 IP

    @Column
    private LocalDateTime accountLockedUntil; // 계정 잠금 해제 시간

    // 정규화된 테이블과의 1:1 관계
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private BusinessInfo businessInfo;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private AccountInfo accountInfo;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private DeliverySetting deliverySetting;

    public enum Role {
        ADMIN, BUSINESS, USER
    }

    public enum UserStatus {
        PENDING,    // 승인 대기
        ACTIVE,     // 활성화
        REJECTED,   // 거절
        SUSPENDED,  // 일시 정지
        WITHDRAWN   // 탈퇴
    }

    // 계정 잠금 여부 확인
    public boolean isAccountLocked() {
        return accountLockedUntil != null && accountLockedUntil.isAfter(LocalDateTime.now());
    }

    // 로그인 시도 횟수 증가
    public void incrementLoginAttempts() {
        this.loginAttempts++;
        this.lastLoginAttempt = LocalDateTime.now();
    }

    // 로그인 시도 횟수 초기화
    public void resetLoginAttempts() {
        this.loginAttempts = 0;
        this.accountLockedUntil = null;
    }

    // 계정 잠금
    public void lockAccount(int minutes) {
        this.accountLockedUntil = LocalDateTime.now().plusMinutes(minutes);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return userId;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
} 