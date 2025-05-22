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
} 