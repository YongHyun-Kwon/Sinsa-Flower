package com.sinsaflower.service;

import com.sinsaflower.domain.user.User;
import com.sinsaflower.repository.UserRepository;
import com.sinsaflower.dto.SignupRequestDto;
import com.sinsaflower.dto.SignupResponseDto;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public SignupResponseDto signup(SignupRequestDto signupRequest) {
        // 중복 체크
        if (userRepository.existsByUserId(signupRequest.getUserId())) {
            throw new RuntimeException("이미 사용중인 아이디입니다.");
        }

        try {
            // 비밀번호 암호화
            String encodedPassword = passwordEncoder.encode(signupRequest.getPassword());

            // 주소에서 지역 정보 추출
            String[] businessLocation = extractLocationFromAddress(signupRequest.getBusinessAddress());
            String[] actualLocation = extractLocationFromAddress(signupRequest.getMemberActualAddress());

            // User 엔티티 생성
            User user = User.builder()
                    .userId(signupRequest.getUserId())
                    .name(signupRequest.getName())
                    .phone(signupRequest.getPhoneNumber())
                    .password(encodedPassword)
                    .profileImage(signupRequest.getProfileImage())
                    .userType(signupRequest.getUserType())
                    .phoneVerified(signupRequest.getPhoneVerified())
                    .isMarketing(signupRequest.getIsMarketing())
                    .role(User.Role.valueOf(signupRequest.getRole()))
                    .status(User.UserStatus.valueOf(signupRequest.getStatus()))
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    
                    // 사업자 정보
                    .businessRegistrationNum(signupRequest.getBusinessRegistrationNum())
                    .corporationName(signupRequest.getCorporationName())
                    .ceoName(signupRequest.getCeoName())
                    .businessType(signupRequest.getBusinessType())
                    .businessAddress(signupRequest.getBusinessAddress())
                    .businessProvince(businessLocation[0])  // 추출된 광역시도
                    .businessCity(businessLocation[1])      // 추출된 시군구
                    .businessRegistrationCert(signupRequest.getBusinessRegistrationCert())
                    .faxNumber(signupRequest.getFaxNumber())
                    .faxSettings(signupRequest.getFaxSettings())
                    .smsSettings(signupRequest.getSmsSettings())
                    .businessHours(signupRequest.getBusinessHours())
                    
                    // 계좌 정보
                    .accountNumber(signupRequest.getAccountNumber())
                    .virtualAccount(signupRequest.getVirtualAccount())
                    .bankAccountCopy(signupRequest.getBankAccountCopy())
                    
                    // 배송 설정
                    .deliveryAreaInfo(signupRequest.getDeliveryAreaInfo())
                    .memberActualAddress(signupRequest.getMemberActualAddress())
                    .actualProvince(actualLocation[0])      // 추출된 광역시도
                    .actualCity(actualLocation[1])          // 추출된 시군구
                    .mainPhoneNumber(signupRequest.getMainPhoneNumber())
                    .mainMobileNumber(signupRequest.getMainMobileNumber())
                    .autoProductRegister(signupRequest.getAutoProductRegister())
                    .handleFruitProducts(signupRequest.getHandleFruitProducts())
                    .handleCondolenceBasket(signupRequest.getHandleCondolenceBasket())
                    .expressDeliveryAvailable(signupRequest.getExpressDeliveryAvailable())
                    .handleRoundFlowerArrangement(signupRequest.getHandleRoundFlowerArrangement())
                    .blackGoldRibbonAvailable(signupRequest.getBlackGoldRibbonAvailable())
                    .handleLargeExtraLarge(signupRequest.getHandleLargeExtraLarge())
                    .handle4_5Tier(signupRequest.getHandle4_5Tier())
                    .handleBonsa(signupRequest.getHandleBonsa())
                    .holidayDeliveryAvailable(signupRequest.getHolidayDeliveryAvailable())
                    .nightDeliveryAvailable(signupRequest.getNightDeliveryAvailable())
                    .build();

            User savedUser = userRepository.save(user);

            return SignupResponseDto.builder()
                    .userId(savedUser.getUserId())
                    .name(savedUser.getName())
                    .status(savedUser.getStatus().toString())
                    .message("회원가입이 완료되었습니다. 관리자 승인 후 로그인이 가능합니다.")
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("회원가입 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    /**
     * 주소에서 지역 정보 추출
     * @param address 전체 주소
     * @return [광역시도, 시군구] 배열
     */
    private String[] extractLocationFromAddress(String address) {
        if (address == null || address.trim().isEmpty()) {
            return new String[]{"", ""};
        }
        
        String[] result = new String[]{"", ""};
        
        // 광역시도 패턴 매칭
        String[] provinces = {
            "서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시", 
            "대전광역시", "울산광역시", "세종특별자치시", "경기도", "강원특별자치도", 
            "충청북도", "충청남도", "전북특별자치도", "전라남도", "경상북도", "경상남도", "제주특별자치도"
        };
        
        for (String province : provinces) {
            if (address.contains(province)) {
                result[0] = province;
                break;
            }
        }
        
        // 시군구 추출 (광역시도 다음에 오는 첫 번째 시/군/구)
        if (!result[0].isEmpty()) {
            String remaining = address.substring(address.indexOf(result[0]) + result[0].length()).trim();
            String[] parts = remaining.split(" ");
            
            for (String part : parts) {
                if (part.endsWith("시") || part.endsWith("군") || part.endsWith("구")) {
                    result[1] = part;
                    break;
                }
            }
        }
        
        return result;
    }
} 