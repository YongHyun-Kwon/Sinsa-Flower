package com.sinsaflower.dto;

import lombok.*;

/**
 * 회원가입 요청 DTO
 * User, BusinessInfo, AccountInfo, DeliverySetting 정보를 모두 포함
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SignupRequestDto {
    // User 정보
    private String userId; // 아이디
    private String name; // 이름
    private String phoneNumber; // 전화번호
    private String password; // 비밀번호
    private String profileImage; // 프로필 이미지 URL
    private String userType; // 회원 유형
    private String status; // 상태
    private Boolean phoneVerified; // 휴대폰 인증 여부
    private Boolean isMarketing; // 마케팅 수신 동의
    private String role; // 권한(ADMIN, BUSINESS, USER)
    private String email;

    // BusinessInfo 정보
    private String businessRegistrationNum; // 사업자등록번호
    private String corporationName; // 상호명
    private String ceoName; // 대표자명
    private String businessType; // 업종
    private String businessAddress; // 사업장 주소
    private String businessRegistrationCert; // 사업자등록증 이미지 URL
    private String faxNumber; // 팩스번호
    private String faxSettings; // 팩스 설정
    private String smsSettings; // 문자 설정
    private String businessHours; // 영업시간

    // AccountInfo 정보
    private String accountNumber; // 계좌번호
    private String virtualAccount; // 가상계좌
    private String bankAccountCopy; // 통장사본 이미지 URL

    // DeliverySetting 정보
    private String deliveryAreaInfo; // 배송 가능 지역
    private String memberActualAddress; // 실제 주소
    private String mainPhoneNumber; // 대표 전화번호
    private String mainMobileNumber; // 대표 휴대폰번호
    private Boolean autoProductRegister; // 상품 자동 등록 여부
    private Boolean handleFruitProducts; // 과일 취급 여부
    private Boolean handleCondolenceBasket; // 근조바구니 취급 여부
    private Boolean expressDeliveryAvailable; // 퀵배송 가능 여부
    private Boolean handleRoundFlowerArrangement; // 원형화환 취급 여부
    private Boolean blackGoldRibbonAvailable; // 검정/금색 리본 가능 여부
    private Boolean handleLargeExtraLarge; // 대/특대 취급 여부
    private Boolean handle4_5Tier; // 4단/5단 취급 여부
    private Boolean handleBonsa; // 분재 취급 여부
    private Boolean holidayDeliveryAvailable; // 공휴일 배송 가능 여부
    private Boolean nightDeliveryAvailable; // 야간 배송 가능 여부
} 