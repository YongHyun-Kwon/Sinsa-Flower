package com.sinsaflower.service;

import com.sinsaflower.domain.user.BusinessInfo;
import com.sinsaflower.domain.user.User;
import com.sinsaflower.dto.SignupRequestDto;
import com.sinsaflower.repository.BusinessInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BusinessInfoService {
    private final BusinessInfoRepository businessInfoRepository;

    /**
     * BusinessInfo 저장
     */
    public void createBusinessInfo(User user, SignupRequestDto dto) {
        BusinessInfo businessInfo = BusinessInfo.builder()
                .user(user)
                .businessRegistrationNum(dto.getBusinessRegistrationNum())
                .corporationName(dto.getCorporationName())
                .ceoName(dto.getCeoName())
                .businessType(dto.getBusinessType())
                .businessAddress(dto.getBusinessAddress())
                .businessRegistrationCert(dto.getBusinessRegistrationCert())
                .faxNumber(dto.getFaxNumber())
                .faxSettings(dto.getFaxSettings())
                .smsSettings(dto.getSmsSettings())
                .businessHours(dto.getBusinessHours())
                .createdAt(java.time.LocalDateTime.now())
                .updatedAt(java.time.LocalDateTime.now())
                .build();
        businessInfoRepository.save(businessInfo);
    }

    /**
     * 사용자의 상호명 조회 (법인명/상호명)
     */
    public String getShopNameByUser(User user) {
        return businessInfoRepository.findByUser(user)
                .map(BusinessInfo::getCorporationName)
                .orElse(user.getName()); // 기본값
    }

    /**
     * 사용자의 사업장 주소 조회 (실제 주소)
     */
    public String getRegionByUser(User user) {
        return businessInfoRepository.findByUser(user)
                .map(BusinessInfo::getBusinessAddress)
                .orElse("주소 미입력");
    }

    /**
     * 사업장 주소에서 시/도 정보 추출 (지역 필터링용)
     */
    public String getProvinceFromBusinessAddress(User user) {
        return businessInfoRepository.findByUser(user)
                .map(businessInfo -> {
                    String address = businessInfo.getBusinessAddress();
                    return extractProvinceFromAddress(address);
                })
                .orElse("기타");
    }

    /**
     * 주소에서 시/도 정보 추출
     */
    private String extractProvinceFromAddress(String address) {
        if (address == null || address.trim().isEmpty()) {
            return "기타";
        }
        
        // 실제 주소에서 시/도 추출
        if (address.contains("서울특별시") || address.contains("서울시") || address.contains("서울")) {
            return "서울";
        } else if (address.contains("경기도") || address.contains("경기")) {
            return "경기";
        } else if (address.contains("인천광역시") || address.contains("인천시") || address.contains("인천")) {
            return "인천";
        } else if (address.contains("강원특별자치도") || address.contains("강원도") || address.contains("강원")) {
            return "강원";
        } else if (address.contains("충청북도") || address.contains("충북")) {
            return "충북";
        } else if (address.contains("충청남도") || address.contains("충남")) {
            return "충남";
        } else if (address.contains("경상북도") || address.contains("경북")) {
            return "경북";
        } else if (address.contains("경상남도") || address.contains("경남")) {
            return "경남";
        } else if (address.contains("전라북도") || address.contains("전북")) {
            return "전북";
        } else if (address.contains("전라남도") || address.contains("전남")) {
            return "전남";
        } else if (address.contains("제주특별자치도") || address.contains("제주도") || address.contains("제주")) {
            return "제주";
        } else if (address.contains("부산광역시") || address.contains("부산시") || address.contains("부산")) {
            return "부산";
        } else if (address.contains("대구광역시") || address.contains("대구시") || address.contains("대구")) {
            return "대구";
        } else if (address.contains("대전광역시") || address.contains("대전시") || address.contains("대전")) {
            return "대전";
        } else if (address.contains("광주광역시") || address.contains("광주시") || address.contains("광주")) {
            return "광주";
        } else if (address.contains("울산광역시") || address.contains("울산시") || address.contains("울산")) {
            return "울산";
        } else if (address.contains("세종특별자치시") || address.contains("세종시") || address.contains("세종")) {
            return "세종";
        }
        
        return "기타";
    }
} 